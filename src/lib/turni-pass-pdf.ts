import { jsPDF } from 'jspdf';
import { buildPassPayload } from './turni-pass';
import type { ClassData, Student } from './turn-store';

export function downloadPassPdf(cls: ClassData, students: Student[]) {
  if (!students.length) return;
  const pdf = new jsPDF();
  students.forEach((student, index) => {
    const payload = buildPassPayload(cls, student); if (!payload) return;
    if (index) pdf.addPage();
    pdf.setFont('helvetica', 'bold'); pdf.setFontSize(22);
    pdf.text('Turni-Pass Winter', 16, 21);
    pdf.setFontSize(14); pdf.text(`${student.firstName} ${student.lastName}`, 16, 32);
    pdf.setFont('helvetica', 'normal'); pdf.setFontSize(11);
    pdf.text(`${cls.name} | ${payload.variante === 'barren' ? 'Barren' : 'Balken'} | ${payload.points} / 20 Punkte`, 16, 41);
    let y = 53;
    payload.geraete.forEach(device => {
      pdf.setFont('helvetica', 'bold'); pdf.setFontSize(12);
      pdf.text(`${device.name} - ${[...device.pflicht,...device.wahl].filter(e => e.status === 'ok').length} / 5`, 16, y); y += 6;
      pdf.setFontSize(9);
      for (const [label, exercises] of [['Pflicht', device.pflicht], ['Wahl', device.wahl]] as const) {
        pdf.setFont('helvetica','bold'); pdf.text(label,16,y); y += 5;
        pdf.setFont('helvetica','normal');
        for (const exercise of exercises) {
          pdf.rect(16,y-3,3,3);
          if (exercise.status === 'ok') { pdf.line(16.5,y-1.5,17.3,y-0.5); pdf.line(17.3,y-0.5,18.5,y-2.5); }
          if (exercise.status === 'nein') { pdf.line(16.4,y-2.6,18.6,y-0.4); pdf.line(18.6,y-2.6,16.4,y-0.4); }
          const lines = pdf.splitTextToSize(exercise.name, 165); pdf.text(lines, 22,y); y += Math.max(5,lines.length*4);
        }
        if (label === 'Wahl') for (let n=exercises.length;n<2;n++) { pdf.rect(16,y-3,3,3); pdf.text('_______________________________',22,y); y+=5; }
      }
      y += 6;
    });
    pdf.setFontSize(8); pdf.text('Geräteturnen · Turni',16,286);
  });
  pdf.save(`Turni-Pass_${cls.name.replace(/\s/g,'_')}.pdf`);
}