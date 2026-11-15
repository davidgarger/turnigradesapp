import { createServerFn } from '@tanstack/react-start';
import { getCookie, setCookie, deleteCookie, setResponseHeader, getRequest, getRequestIP } from '@tanstack/react-start/server';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { TurnState } from './turn-store';
import { makeStudentCode, normalizeStudentCode, normalizeStudentName, projectStudent } from './student-view';
import { accessCardsComplete } from './student-access-cards';

async function hash(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
const classInput = z.object({ classId: z.string().regex(/^(?:[1-9]|10)$/) });
export const prepareStudentCards = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { classId: string; codes: Record<string, string>; replaceCodes: boolean }) => classInput.extend({ codes: z.record(z.string().max(30)), replaceCodes: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const { data: row, error } = await context.supabase.from('app_state').select('state').eq('user_id', context.userId).single();
    if (error) throw new Error('Klasse konnte nicht geladen werden.');
    const state = row.state as unknown as TurnState;
    const cls = state.classes[data.classId as keyof TurnState['classes']];
    if (!cls?.students.length) throw new Error('Keine Schüler in dieser Klasse.');
    const codes: Record<string, string> = {};
    if (data.replaceCodes) {
      const rows = await Promise.all(cls.students.map(async s => {
        const code = makeStudentCode(); codes[s.id] = code;
        return { user_id: context.userId, class_id: cls.id, student_id: s.id, code_hash: await hash(normalizeStudentCode(code)) };
      }));
      const { error: writeError } = await context.supabase.from('student_access').upsert(rows, { onConflict: 'user_id,student_id' });
      if (writeError) throw new Error('Codes konnten nicht erstellt werden.');
    } else {
      if (!accessCardsComplete(cls.students.map(s => s.id), data.codes)) throw new Error('Bitte zuerst Codes für die ganze Klasse erstellen.');
      const { data: rows, error: readError } = await context.supabase.from('student_access').select('student_id,code_hash').eq('user_id', context.userId).eq('class_id', cls.id);
      if (readError) throw new Error('Codes konnten nicht geprüft werden.');
      for (const s of cls.students) {
        const code = data.codes[s.id];
        const expected = await hash(normalizeStudentCode(code));
        if (!rows?.some(r => r.student_id === s.id && r.code_hash === expected)) throw new Error('Ein Code wurde geändert. Bitte PDF neu vorbereiten.');
        codes[s.id] = code;
      }
    }
    return { codes, className: cls.name, cards: cls.students.map(s => ({ firstName: s.firstName, lastName: s.lastName, code: codes[s.id] })) };
  });
export const listStudentAccess = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { classId: string }) => classInput.parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase.from('student_access').select('student_id,created_at').eq('user_id', context.userId).eq('class_id', data.classId);
    if (error) throw new Error('Zugänge konnten nicht geladen werden.');
    return rows ?? [];
  });
export const createStudentAccess = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { classId: string; studentId: string }) => classInput.extend({ studentId: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const code = makeStudentCode();
    const { error } = await context.supabase.from('student_access').upsert({ user_id: context.userId, class_id: data.classId, student_id: data.studentId, code_hash: await hash(normalizeStudentCode(code)) }, { onConflict: 'user_id,student_id' });
    if (error) throw new Error('Zugang konnte nicht erstellt werden. Bitte zuerst die Klasse speichern.');
    setResponseHeader('Cache-Control', 'no-store');
    return { code };
  });
export const revokeStudentAccess = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth])
  .inputValidator((input: { classId: string; studentId: string }) => classInput.extend({ studentId: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('student_access').delete().eq('user_id', context.userId).eq('class_id', data.classId).eq('student_id', data.studentId);
    if (error) throw new Error('Zugang konnte nicht gesperrt werden.');
    return { ok: true };
  });
export const studentLogin = createServerFn({ method: 'POST' })
  .inputValidator((input: { firstName: string; code: string }) => z.object({ firstName: z.string().min(1).max(100), code: z.string().min(1).max(100) }).parse(input))
  .handler(async ({ data }) => {
    setResponseHeader('Cache-Control', 'no-store');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const ip = getRequestIP() ?? 'unknown';
    const { data: allowed, error: limitError } = await supabaseAdmin.rpc('take_student_login_attempt', { p_key: await hash(ip) });
    if (limitError || !allowed) return { ok: false, error: 'Zu viele Anmeldeversuche. Bitte in 15 Minuten erneut versuchen.' };
    const code = normalizeStudentCode(data.code);
    if (!/^[A-HJ-NP-Z2-9]{20}$/.test(code)) return { ok: false, error: 'Vorname oder Zugangscode ist falsch.' };
    const { data: access, error } = await supabaseAdmin.from('student_access').select('id,user_id,class_id,student_id').eq('code_hash', await hash(code)).maybeSingle();
    if (error) throw new Error('Anmeldung ist gerade nicht möglich.');
    if (!access) return { ok: false, error: 'Vorname oder Zugangscode ist falsch.' };
    const { data: row } = await supabaseAdmin.from('app_state').select('state').eq('user_id', access.user_id).maybeSingle();
    const state = row?.state as unknown as TurnState | undefined;
    const student = state?.classes[access.class_id as keyof TurnState['classes']]?.students.find(s => s.id === access.student_id);
    if (!student || normalizeStudentName(student.firstName) !== normalizeStudentName(data.firstName)) return { ok: false, error: 'Vorname oder Zugangscode ist falsch.' };
    const token = crypto.randomUUID() + crypto.randomUUID();
    const { error: sessionError } = await supabaseAdmin.from('student_sessions').insert({ token_hash: await hash(token), access_id: access.id, expires_at: new Date(Date.now() + 8 * 3600000).toISOString() });
    if (sessionError) throw new Error('Anmeldung ist gerade nicht möglich.');
    setCookie('turni-student', token, { httpOnly: true, secure: new URL(getRequest().url).protocol === 'https:', sameSite: 'lax', path: '/', maxAge: 8 * 3600 });
    return { ok: true, error: '' };
  });
export const readStudentView = createServerFn({ method: 'GET' }).handler(async () => {
  setResponseHeader('Cache-Control', 'no-store');
  setResponseHeader('Referrer-Policy', 'no-referrer');
  const token = getCookie('turni-student');
  if (!token || !/^[a-f0-9-]{72}$/.test(token)) return null;
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data: session, error } = await supabaseAdmin.from('student_sessions').select('access_id').eq('token_hash', await hash(token)).gt('expires_at', new Date().toISOString()).maybeSingle();
  if (error) throw new Error('Deine Übersicht konnte nicht geladen werden.');
  if (!session) return null;
  const { data: access } = await supabaseAdmin.from('student_access').select('user_id,class_id,student_id').eq('id', session.access_id).maybeSingle();
  if (!access) return null;
  const { data: row } = await supabaseAdmin.from('app_state').select('state,updated_at').eq('user_id', access.user_id).maybeSingle();
  const state = row?.state as unknown as TurnState | undefined;
  const cls = state?.classes[access.class_id as keyof TurnState['classes']];
  const student = cls?.students.find(s => s.id === access.student_id);
  if (!state || !cls || !student || !row) return null;
  return projectStudent(cls, student, state.settings, row.updated_at);
});
export const studentLogout = createServerFn({ method: 'POST' }).handler(async () => {
  const token = getCookie('turni-student');
  if (token) {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    await supabaseAdmin.from('student_sessions').delete().eq('token_hash', await hash(token));
  }
  deleteCookie('turni-student', { path: '/' });
  return { ok: true };
});