import { jsPDF } from 'jspdf';
import { studentLoginUrl, type StudentAccessCards } from './student-access-cards';

export function makeAccessCardsPdf(data: StudentAccessCards): Blob {
  const pdf = new jsPDF();
  data.cards.forEach((card, i) => {
    if (i > 0 && i % 8 === 0) pdf.addPage();
    const slot = i % 8;
    const x = 12 + (slot % 2) * 95;
    const y = 22 + Math.floor(slot / 2) * 65;
    if (slot === 0) {
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12);
      pdf.text(`Turni · ${data.className}`, 12, 13);
    }
    pdf.setDrawColor(150); pdf.setLineDashPattern([1, 1], 0); pdf.rect(x, y, 91, 61); pdf.setLineDashPattern([], 0);
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12);
    const name = pdf.splitTextToSize(`${card.firstName} ${card.lastName}`, 81);
    pdf.text(name.slice(0, 2), x + 5, y + 9);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(9);
    pdf.text(studentLoginUrl, x + 5, y + 24);
    const first = pdf.splitTextToSize(`Vorname: ${card.firstName}`, 81);
    pdf.text(first.slice(0, 2), x + 5, y + 31);
    pdf.text('Persönlicher Zugangscode', x + 5, y + 43);
    pdf.setFont('courier', 'bold'); pdf.setFontSize(10);
    pdf.text(card.code, x + 5, y + 50);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(7);
    pdf.text('Nur für dich · Code nicht weitergeben', x + 5, y + 57);
  });
  return pdf.output('blob');
}
export async function deliverAccessCards(blob: Blob, className: string) {
  const filename = `Turni_Zugangskarten_${className.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
  const file = new File([blob], filename, { type: 'application/pdf' });
  if (matchMedia('(pointer: coarse)').matches && navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title: filename }); return; }
    catch (e) { if (e instanceof DOMException && e.name === 'AbortError') return; }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}