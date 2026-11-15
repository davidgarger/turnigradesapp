import { expect, it } from 'vitest';
import { accessCardsComplete, studentLoginUrl } from './student-access-cards';
import { makeAccessCardsPdf } from './student-access-pdf';
it('requires every child to have a code before non-reset export', () => {
  expect(accessCardsComplete(['anna','leo'], { anna: 'code' })).toBe(false);
  expect(accessCardsComplete(['anna','leo'], { anna: 'code', leo: 'code2' })).toBe(true);
  expect(accessCardsComplete([], {})).toBe(false);
});
it('uses the student login page', () => { expect(studentLoginUrl).toBe('https://turni.live/schueler'); });
it('includes one card for each child and paginates after eight', async () => {
  const blob = makeAccessCardsPdf({ className: '1A', cards: Array.from({ length: 9 }, (_, i) => ({ firstName: `Child${i}`, lastName: 'Test', code: 'ABCD-EFGH-JKLM-NPQR-STUV' })) });
  const text = await blob.text();
  expect(blob.type).toBe('application/pdf');
  expect(text).toContain('Child0'); expect(text).toContain('Child8');
  expect(text).toContain('/Count 2');
  expect(text).toContain(studentLoginUrl);
});