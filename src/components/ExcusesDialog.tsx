import { useEffect, useRef, useState } from "react";
import { Camera, Image as ImageIcon, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { turnActions, type ClassId, type Excuse, type Student } from "@/lib/turn-store";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BUCKET = "excuses";

async function uploadPhoto(file: File, classId: ClassId, studentId: string): Promise<string | null> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    toast.error("Bitte erneut einloggen, um Fotos zu speichern.");
    return null;
  }
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userData.user.id}/${classId}/${studentId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) {
    toast.error(`Foto-Upload fehlgeschlagen: ${error.message}`);
    return null;
  }
  return path;
}

async function signUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60);
  if (error) return null;
  return data.signedUrl;
}

export default function ExcusesDialog({
  open,
  onOpenChange,
  student,
  classId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  student: Student;
  classId: ClassId;
}) {
  const [busy, setBusy] = useState(false);
  const [newDate, setNewDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [newNote, setNewNote] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [zoom, setZoom] = useState<string | null>(null);

  const excuses = student.excuses ?? [];

  // Vorschau-URLs für gespeicherte Fotos laden
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        excuses
          .filter((e) => e.photoPath && !previews[e.id])
          .map(async (e) => [e.id, await signUrl(e.photoPath!)] as const),
      );
      if (cancelled) return;
      const next: Record<string, string> = { ...previews };
      for (const [id, url] of entries) if (url) next[id] = url;
      setPreviews(next);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, excuses.map((e) => e.id).join(",")]);

  const handleAdd = async () => {
    if (!newDate) {
      toast.error("Bitte ein Datum wählen.");
      return;
    }
    setBusy(true);
    let photoPath: string | undefined;
    if (newFile) {
      const p = await uploadPhoto(newFile, classId, student.id);
      if (!p) {
        setBusy(false);
        return;
      }
      photoPath = p;
    }
    turnActions.addExcuse(classId, student.id, { date: newDate, note: newNote.trim() || undefined, photoPath });
    setBusy(false);
    setNewFile(null);
    setNewNote("");
    if (fileRef.current) fileRef.current.value = "";
    toast.success("Entschuldigung gespeichert");
  };

  const handleDelete = async (e: Excuse) => {
    if (!confirm("Diese Entschuldigung wirklich löschen?")) return;
    if (e.photoPath) {
      await supabase.storage.from(BUCKET).remove([e.photoPath]);
    }
    turnActions.removeExcuse(classId, student.id, e.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Entschuldigungen · {student.firstName} {student.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Neue Entschuldigung */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Plus className="h-4 w-4" /> Neue Entschuldigung
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="ex-date" className="text-xs">
                    Datum
                  </Label>
                  <Input
                    id="ex-date"
                    type="date"
                    value={newDate}
                    onChange={(ev) => setNewDate(ev.target.value)}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="ex-note" className="text-xs">
                    Notiz (optional)
                  </Label>
                  <Input
                    id="ex-note"
                    value={newNote}
                    onChange={(ev) => setNewNote(ev.target.value)}
                    placeholder="z. B. Arztbesuch"
                  />
                </div>
              </div>
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(ev) => setNewFile(ev.target.files?.[0] ?? null)}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                    {newFile ? "Foto ändern" : "Foto aufnehmen / wählen"}
                  </Button>
                  {newFile && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs text-muted-foreground">
                      <ImageIcon className="h-3 w-3" />
                      {newFile.name.slice(0, 24)}
                      <button
                        type="button"
                        onClick={() => {
                          setNewFile(null);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                        aria-label="Foto entfernen"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <div className="ml-auto">
                    <Button size="sm" onClick={handleAdd} disabled={busy}>
                      {busy ? "Speichere…" : "Speichern"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Liste */}
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Gespeichert ({excuses.length})
            </div>
            {excuses.length === 0 ? (
              <p className="rounded-md border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Noch keine Entschuldigungen erfasst.
              </p>
            ) : (
              <ul className="divide-y divide-border rounded-md border border-border">
                {[...excuses]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((e) => (
                    <li key={e.id} className="flex items-center gap-3 p-2">
                      {e.photoPath ? (
                        previews[e.id] ? (
                          <button
                            type="button"
                            onClick={() => setZoom(previews[e.id])}
                            className="block h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted"
                          >
                            <img
                              src={previews[e.id]}
                              alt="Entschuldigung"
                              className="h-full w-full object-cover"
                            />
                          </button>
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        )
                      ) : (
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border text-muted-foreground">
                          <span className="text-[10px]">ohne Foto</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">
                          {new Date(e.date + "T00:00:00").toLocaleDateString("de-AT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                        {e.note && (
                          <div className="truncate text-xs text-muted-foreground">{e.note}</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDelete(e)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Entschuldigung löschen"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>

        {zoom && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setZoom(null)}
          >
            <img src={zoom} alt="Vergrößert" className="max-h-full max-w-full rounded-md" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
