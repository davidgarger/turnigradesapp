export interface StudentAccessCard { firstName: string; lastName: string; code: string }
export interface StudentAccessCards { className: string; cards: StudentAccessCard[] }
export const studentLoginUrl = 'https://turni.live/schueler';
export function accessCardsComplete(studentIds: string[], codes: Record<string, string>) {
  return studentIds.length > 0 && studentIds.every(id => Boolean(codes[id]));
}