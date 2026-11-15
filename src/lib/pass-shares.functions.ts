import { createServerFn } from '@tanstack/react-start';
import { setResponseHeader } from '@tanstack/react-start/server';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import type { PassPayload } from './turni-pass';

export const readSharedPass = createServerFn({ method: 'GET' })
  .inputValidator((input: { token: string }) => z.object({ token: z.string().max(256) }).parse(input))
  .handler(async ({ data }) => {
    setResponseHeader('Cache-Control', 'no-store');
    setResponseHeader('Referrer-Policy', 'no-referrer');
    if (!/^[a-f0-9]{64}$/.test(data.token)) return null;
    // A capability read is privileged only after the exact 256-bit token is validated.
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { data: row, error } = await supabaseAdmin.from('pass_shares').select('payload, updated_at').eq('token', data.token).maybeSingle();
    if (error) throw new Error('Der Pass kann gerade nicht geladen werden.');
    if (!row) return null;
    // The database trigger creates this allowlisted payload; never return the owner or identities.
    return { payload: row.payload as unknown as PassPayload, updatedAt: row.updated_at };
  });

export const ensurePassLinks = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { classId: string }) => z.object({ classId: z.string().regex(/^(?:[1-9]|10)$/) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: stateRow, error: stateError } = await context.supabase.from('app_state').select('state').eq('user_id', context.userId).single();
    if (stateError) throw new Error('Klasse konnte nicht geladen werden.');
    const state = stateRow.state as unknown as { classes: Record<string, { turniPass?: { aktiv: boolean; linksAktiv?: boolean }; students: { id: string }[] }> };
    const cls = state.classes[data.classId];
    if (!cls?.turniPass?.aktiv || !cls.turniPass.linksAktiv) throw new Error('Pass-Links sind nicht aktiviert.');
    if (cls.students.length) {
      const rows = cls.students.map(s => ({ user_id: context.userId, class_id: data.classId, student_id: s.id }));
      const { error } = await context.supabase.from('pass_shares').upsert(rows, { onConflict: 'user_id,class_id,student_id', ignoreDuplicates: true });
      if (error) throw new Error('Links konnten nicht erstellt werden.');
    }
    const { data: links, error } = await context.supabase.from('pass_shares').select('token,student_id').eq('user_id', context.userId).eq('class_id', data.classId);
    if (error) throw new Error('Links konnten nicht geladen werden.');
    return links ?? [];
  });

export const revokePassLinks = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { classId: string }) => z.object({ classId: z.string().regex(/^(?:[1-9]|10)$/) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('pass_shares').delete().eq('user_id', context.userId).eq('class_id', data.classId);
    if (error) throw new Error('Links konnten nicht gelöscht werden.');
    return { ok: true };
  });