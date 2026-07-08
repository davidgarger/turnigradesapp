import { jsPDF } from "jspdf";
import type { Exercise } from "./kondition-store";

type LoadedImage = { data: string; w: number; h: number; type: "JPEG" | "PNG" };

async function loadImage(src: string): Promise<LoadedImage | null> {
  try {
    const res = await fetch(src, { credentials: "same-origin" });
    if (!res.ok) return null;
    const blob = await res.blob();
    const data = await new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(new Error("read failed"));
      r.readAsDataURL(blob);
    });
    const dims = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => reject(new Error("img load failed"));
      img.src = data;
    });
    const type: "JPEG" | "PNG" = /png/i.test(blob.type) ? "PNG" : "JPEG";
    return { data, w: dims.w, h: dims.h, type };
  } catch {
    return null;
  }
}

export async function downloadExercisePdf(ex: Exercise): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 15;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensure = (need: number) => {
    if (y + need > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const write = (
    text: string,
    opts: {
      size: number;
      style?: "bold" | "normal";
      color?: [number, number, number];
      gapAfter?: number;
    },
  ) => {
    doc.setFont("helvetica", opts.style || "normal");
    doc.setFontSize(opts.size);
    const [r, g, b] = opts.color || [15, 23, 42];
    doc.setTextColor(r, g, b);
    const lines = doc.splitTextToSize(text || "—", contentW);
    const lineH = opts.size * 0.42;
    ensure(lines.length * lineH + (opts.gapAfter || 0));
    doc.text(lines, margin, y + lineH * 0.8);
    y += lines.length * lineH + (opts.gapAfter ?? 2);
  };

  const section = (label: string) =>
    write(label.toUpperCase(), {
      size: 8,
      style: "bold",
      color: [71, 85, 105],
      gapAfter: 1.5,
    });

  // Kicker + Titel + Lead
  write(`${ex.subcategory.toUpperCase()} · ÜBUNGSBLATT`, {
    size: 8,
    color: [100, 116, 139],
    gapAfter: 2,
  });
  write(ex.title, { size: 22, style: "bold", gapAfter: 3 });
  write(ex.shortDescription, { size: 11, color: [51, 65, 85], gapAfter: 5 });

  // Meta-Kacheln (4 Spalten)
  const tiles: Array<[string, string]> = [
    ["Dauer", ex.duration || "—"],
    ["Gruppe", ex.groupSize || "—"],
    ["Alter", ex.ageGroup || "—"],
    ["Schwierigkeit", ex.difficulty || "—"],
  ];
  const gap = 2;
  const tileW = (contentW - gap * 3) / 4;
  const tileH = 14;
  ensure(tileH + 6);
  tiles.forEach(([l, v], i) => {
    const x = margin + i * (tileW + gap);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, tileW, tileH, 2, 2, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(l.toUpperCase(), x + 2.5, y + 4.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(v, x + 2.5, y + 10.5);
  });
  y += tileH + 6;

  section("Ziel der Übung");
  write(ex.goal || "—", { size: 11, gapAfter: 4 });

  section("Material");
  write(ex.material || "—", { size: 11, gapAfter: 4 });

  section("Ablauf");
  ex.steps.forEach((s, i) => write(`${i + 1}.  ${s}`, { size: 11, gapAfter: 1.5 }));

  const imgSources = ex.images.filter((s) => !s.startsWith("data:video"));
  if (imgSources.length) {
    y += 3;
    section("Vorlage / Vorschau");
    for (const src of imgSources) {
      const img = await loadImage(src);
      if (!img) continue;
      const ratio = img.h / img.w;
      const w = Math.min(contentW, 140);
      const h = w * ratio;
      // Bild möglichst auf einer Seite platzieren
      if (y + h > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      const x = margin + (contentW - w) / 2;
      doc.addImage(img.data, img.type, x, y, w, h);
      y += h + 4;
    }
  }

  // Footer auf jeder Seite
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, pageH - 12, pageW - margin, pageH - 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("Turni · Übungssammlung", margin, pageH - 7);
    doc.text(`Seite ${p} / ${pageCount}`, pageW - margin, pageH - 7, { align: "right" });
  }

  const safe = ex.title.replace(/[^\p{L}\p{N}_-]+/gu, "_");
  doc.save(`${safe || "uebung"}.pdf`);
}
