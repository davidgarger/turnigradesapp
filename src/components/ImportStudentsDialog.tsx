import { useRef, useState } from "react";
import { Loader2, Upload, FileText, Image as ImageIcon, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import readXlsxFile from "read-excel-file/browser";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { extractStudentNames } from "@/lib/import-names.functions";

export type ParsedStudent = { firstName: string; lastName: string };

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (students: ParsedStudent[]) => void;
};

function splitName(raw: string): ParsedStudent | null {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  if (cleaned.includes(",")) {
    const [last, first] = cleaned.split(",").map((s) => s.trim());
    if (last && first) return { firstName: first, lastName: last };
  }
  const parts = cleaned.split(" ");
  if (parts.length < 2) return null;
  // Heuristik: letztes Wort = Vorname? Nein – im deutschsprachigen Raum üblich:
  // "Nachname Vorname" in Listen ODER "Vorname Nachname" – wir nehmen die
  // gängigere Form "Vorname [...Nachname]"
  const firstName = parts[0];
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

function parseCsv(text: string): ParsedStudent[] {
  const rows = text.split(/\r?\n/).map((r) => r.trim()).filter(Boolean);
  const out: ParsedStudent[] = [];
  for (const row of rows) {
    const cols = row.split(/[,;\t]/).map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length >= 2 && cols[0] && cols[1]) {
      // Heuristik: 1. Spalte Nachname, 2. Vorname (typischer Klassenlisten-Export)
      // Wenn Header erkannt -> überspringen
      if (/name|vorname|nachname|first|last/i.test(cols[0]) || /name|vorname|nachname|first|last/i.test(cols[1])) {
        continue;
      }
      out.push({ lastName: cols[0], firstName: cols[1] });
    } else if (cols.length === 1) {
      const s = splitName(cols[0]);
      if (s) out.push(s);
    }
  }
  return out;
}

async function parseXlsx(file: File): Promise<ParsedStudent[]> {
  const rows = await readXlsxFile(file);
  const out: ParsedStudent[] = [];
  for (const row of rows) {
    if (!Array.isArray(row) || row.length === 0) continue;
    const cols = row.map((c) => String(c ?? "").trim());
    if (cols.length >= 2 && cols[0] && cols[1]) {
      if (/name|vorname|nachname|first|last/i.test(cols[0]) || /name|vorname|nachname|first|last/i.test(cols[1])) {
        continue;
      }
      out.push({ lastName: cols[0], firstName: cols[1] });
    } else if (cols[0]) {
      const s = splitName(cols[0]);
      if (s) out.push(s);
    }
  }
  return out;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] ?? "";
      resolve(base64);
    };
    reader.readAsDataURL(file);
  });
}

export default function ImportStudentsDialog({ open, onOpenChange, onConfirm }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<(ParsedStudent & { selected: boolean })[]>([]);
  const extract = useServerFn(extractStudentNames);

  const handleReset = () => {
    setStudents([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setStudents([]);
    try {
      const ext = file.name.toLowerCase().split(".").pop() ?? "";
      let parsed: ParsedStudent[] = [];

      if (ext === "csv" || file.type === "text/csv") {
        parsed = parseCsv(await file.text());
      } else if (["xlsx", "xls"].includes(ext)) {
        parsed = await parseXlsx(file);
      } else if (file.type.startsWith("image/") || file.type === "application/pdf" || ext === "pdf") {
        const base64 = await fileToBase64(file);
        const result = await extract({
          data: { fileBase64: base64, mimeType: file.type || (ext === "pdf" ? "application/pdf" : "image/jpeg") },
        });
        parsed = result.students;
      } else {
        toast.error("Dateityp nicht unterstützt. Erlaubt: Bild, PDF, CSV, Excel.");
        return;
      }

      if (parsed.length === 0) {
        toast.error("Keine Namen erkannt. Versuch eine andere Datei oder ein klareres Bild.");
        return;
      }
      setStudents(parsed.map((s) => ({ ...s, selected: true })));
      toast.success(`${parsed.length} Namen erkannt`);
    } catch (e) {
      console.error(e);
      toast.error("Fehler beim Lesen der Datei");
    } finally {
      setLoading(false);
    }
  };

  const toggleAll = (v: boolean) => {
    setStudents((arr) => arr.map((s) => ({ ...s, selected: v })));
  };

  const updateStudent = (i: number, patch: Partial<ParsedStudent & { selected: boolean }>) => {
    setStudents((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const removeStudent = (i: number) => {
    setStudents((arr) => arr.filter((_, idx) => idx !== i));
  };

  const handleConfirm = () => {
    const picked = students.filter((s) => s.selected && s.firstName.trim() && s.lastName.trim());
    if (picked.length === 0) {
      toast.error("Keine Schüler ausgewählt");
      return;
    }
    onConfirm(picked.map((s) => ({ firstName: s.firstName.trim(), lastName: s.lastName.trim() })));
    handleReset();
    onOpenChange(false);
  };

  const allSelected = students.length > 0 && students.every((s) => s.selected);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) handleReset();
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schüler aus Datei importieren</DialogTitle>
        </DialogHeader>

        {students.length === 0 ? (
          <div className="grid gap-4">
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf,.pdf,.csv,.xlsx,.xls"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="mb-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Wird gelesen…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" /> Datei wählen
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Unterstützt: Foto/Screenshot, PDF, Excel, CSV
              </p>
              <div className="mt-3 flex justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> JPG/PNG
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> PDF
                </span>
                <span className="flex items-center gap-1">
                  <FileSpreadsheet className="h-3.5 w-3.5" /> XLSX/CSV
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(v) => toggleAll(Boolean(v))}
                />
                Alle auswählen ({students.filter((s) => s.selected).length}/{students.length})
              </label>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Andere Datei
              </Button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto rounded-md border border-border">
              {students.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border-b border-border px-2 py-1.5 last:border-b-0"
                >
                  <Checkbox
                    checked={s.selected}
                    onCheckedChange={(v) => updateStudent(i, { selected: Boolean(v) })}
                  />
                  <Input
                    value={s.lastName}
                    onChange={(e) => updateStudent(i, { lastName: e.target.value })}
                    placeholder="Nachname"
                    className="h-8 flex-1"
                  />
                  <Input
                    value={s.firstName}
                    onChange={(e) => updateStudent(i, { firstName: e.target.value })}
                    placeholder="Vorname"
                    className="h-8 flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStudent(i)}
                    className="h-8 px-2 text-muted-foreground"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={handleConfirm} disabled={students.length === 0}>
            {students.filter((s) => s.selected).length > 0
              ? `${students.filter((s) => s.selected).length} hinzufügen`
              : "Hinzufügen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
