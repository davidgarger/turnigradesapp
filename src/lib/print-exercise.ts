import type { Exercise } from "./kondition-store";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Öffnet ein neues Fenster mit einer druck-optimierten Ansicht der Übung
 * und triggert den Print-Dialog. Nutzer können daraus direkt als PDF
 * speichern ("Als PDF speichern" im Systemdialog).
 */
export function printExercise(ex: Exercise): void {
  const w = window.open("", "_blank", "width=900,height=1200");
  if (!w) return;

  const steps = ex.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
  const toAbs = (src: string) => {
    if (/^(https?:|data:|blob:)/i.test(src)) return src;
    try { return new URL(src, window.location.href).href; } catch { return src; }
  };
  const images = ex.images
    .filter((src) => !src.startsWith("data:video"))
    .map(
      (src) =>
        `<img src="${toAbs(src)}" alt="" style="width:100%;max-width:640px;border-radius:12px;border:1px solid #e2e8f0;display:block;margin:12px auto;page-break-inside:avoid;" />`,
    )
    .join("");

  const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(ex.title)} – Übungsblatt</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0f172a;
    margin: 0;
    padding: 32px;
    max-width: 780px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.55;
  }
  .kicker {
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 6px;
  }
  h1 { font-size: 30px; margin: 0 0 8px; letter-spacing: -0.01em; }
  .lead { color: #334155; margin: 0 0 20px; }
  .meta {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    margin: 16px 0 24px;
  }
  .tile {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 12px;
    background: #fff;
  }
  .tile .l {
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #94a3b8;
  }
  .tile .v { font-weight: 600; font-size: 13px; margin-top: 2px; color: #0f172a; }
  h2 {
    font-size: 12px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #475569;
    margin: 22px 0 8px;
  }
  ol { padding-left: 20px; margin: 0; }
  ol li { margin: 6px 0; }
  p { margin: 0; }
  .foot {
    margin-top: 28px;
    padding-top: 10px;
    border-top: 1px solid #e2e8f0;
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #94a3b8;
    display: flex;
    justify-content: space-between;
  }
  @media print {
    body { padding: 0; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
  <div class="kicker">${escapeHtml(ex.subcategory)} · Übungsblatt</div>
  <h1>${escapeHtml(ex.title)}</h1>
  <p class="lead">${escapeHtml(ex.shortDescription)}</p>

  <div class="meta">
    <div class="tile"><div class="l">Dauer</div><div class="v">${escapeHtml(ex.duration || "—")}</div></div>
    <div class="tile"><div class="l">Gruppe</div><div class="v">${escapeHtml(ex.groupSize || "—")}</div></div>
    <div class="tile"><div class="l">Alter</div><div class="v">${escapeHtml(ex.ageGroup || "—")}</div></div>
    <div class="tile"><div class="l">Schwierigkeit</div><div class="v">${escapeHtml(ex.difficulty || "—")}</div></div>
  </div>

  <h2>Ziel der Übung</h2>
  <p>${escapeHtml(ex.goal || "—")}</p>

  <h2>Material</h2>
  <p>${escapeHtml(ex.material || "—")}</p>

  <h2>Ablauf</h2>
  <ol>${steps}</ol>

  ${images ? `<h2>Vorlage / Vorschau</h2>${images}` : ""}

  <div class="foot">
    <span>Turni · Übungssammlung</span>
    <span>Kondition / Laufspiele</span>
  </div>

  <script>
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
}
