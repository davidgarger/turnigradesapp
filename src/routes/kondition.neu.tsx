import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, X, Upload, Save } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  SUBCATEGORIES, DIFFICULTIES,
  type Subcategory, type Difficulty,
  konditionActions,
} from "@/lib/kondition-store";

export const Route = createFileRoute("/kondition/neu")({
  component: NewExercise,
  head: () => ({ meta: [{ title: "Neue Übung — Kondition" }] }),
});

function NewExercise() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subcategory, setSubcategory] = useState<Subcategory>("Ausdauer");
  const [shortDescription, setShortDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [steps, setSteps] = useState<string[]>(["", "", ""]);
  const [duration, setDuration] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [groupSize, setGroupSize] = useState("");
  const [material, setMaterial] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [ageMin, setAgeMin] = useState(8);
  const [ageMax, setAgeMax] = useState(14);
  const [difficulty, setDifficulty] = useState<Difficulty>("Mittel");
  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const imgRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const canAddStep = steps.length < 5;
  const canRemoveStep = steps.length > 3;

  const setStep = (i: number, v: string) => setSteps((s) => s.map((x, idx) => (idx === i ? v : x)));
  const addStep = () => canAddStep && setSteps((s) => [...s, ""]);
  const removeStep = (i: number) => canRemoveStep && setSteps((s) => s.filter((_, idx) => idx !== i));

  const onPickImages = async (files: FileList | null) => {
    if (!files) return;
    const arr = await Promise.all(
      Array.from(files).slice(0, 5).map(
        (f) => new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result));
          r.onerror = rej;
          r.readAsDataURL(f);
        })
      )
    );
    setImages((prev) => [...prev, ...arr].slice(0, 6));
  };

  const onPickVideo = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setVideoUrl(String(r.result));
    r.readAsDataURL(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (!title.trim() || !shortDescription.trim() || !goal.trim() || cleanSteps.length < 3) {
      toast.error("Bitte alle Pflichtfelder ausfüllen (mind. 3 Schritte).");
      return;
    }
    const ex = konditionActions.add({
      title: title.trim(),
      subcategory,
      shortDescription: shortDescription.trim(),
      goal: goal.trim(),
      steps: cleanSteps,
      duration: duration.trim() || `${durationMinutes} Min`,
      durationMinutes,
      groupSize: groupSize.trim() || "ganze Klasse",
      material: material.trim(),
      ageGroup: ageGroup.trim() || `${ageMin}–${ageMax} Jahre`,
      ageMin, ageMax,
      difficulty,
      images,
      videoUrl: videoUrl || undefined,
    });
    toast.success("Übung gespeichert");
    navigate({ to: "/kondition/$exerciseId", params: { exerciseId: ex.id } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/kondition" className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
          <h1 className="truncate text-lg font-semibold tracking-tight text-foreground">Neue Übung</h1>
          <div className="w-[76px]" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <form onSubmit={submit} className="space-y-5">
          {/* Titel */}
          <Field label="Titel" required>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="z.B. Kettenfangen" />
          </Field>

          {/* Unterkategorie */}
          <Field label="Unterkategorie" required>
            <div className="flex flex-wrap gap-1.5">
              {SUBCATEGORIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubcategory(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    subcategory === s
                      ? "border-teal-500 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm shadow-teal-500/30"
                      : "border-input bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>

          {/* Kurzbeschreibung */}
          <Field label="Kurzbeschreibung" required hint="1–2 Sätze für die Kartenansicht">
            <textarea required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className={inputCls} />
          </Field>

          {/* Ziel */}
          <Field label="Ziel der Übung" required>
            <textarea required value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} className={inputCls} />
          </Field>

          {/* Ablauf */}
          <Field label="Ablauf" required hint="3 bis 5 Schritte">
            <div className="space-y-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <textarea
                    value={s}
                    onChange={(e) => setStep(i, e.target.value)}
                    rows={2}
                    className={inputCls}
                    placeholder={`Schritt ${i + 1}`}
                  />
                  {canRemoveStep && (
                    <button type="button" onClick={() => removeStep(i)} className="mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-input text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Schritt entfernen">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {canAddStep && (
                <button type="button" onClick={addStep} className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-teal-400 hover:text-teal-600">
                  <Plus className="h-3.5 w-3.5" /> Schritt hinzufügen
                </button>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Dauer" required hint={'z.B. „10 Min"'}>
              <input required value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="10 Min" className={inputCls} />
            </Field>
            <Field label="Ungefähre Minuten" hint="Für Dauer-Filter">
              <input type="number" min={1} max={120} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value) || 10)} className={inputCls} />
            </Field>
            <Field label="Gruppengröße" required>
              <input required value={groupSize} onChange={(e) => setGroupSize(e.target.value)} placeholder="ganze Klasse / 4er-Teams" className={inputCls} />
            </Field>
            <Field label="Material">
              <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Hütchen, Stoppuhr…" className={inputCls} />
            </Field>
            <Field label="Altersgruppe" required>
              <input required value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} placeholder="10–14 Jahre" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Alter von">
                <input type="number" min={4} max={20} value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value) || 8)} className={inputCls} />
              </Field>
              <Field label="Alter bis">
                <input type="number" min={4} max={20} value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value) || 14)} className={inputCls} />
              </Field>
            </div>
            <Field label="Schwierigkeit" required>
              <div className="flex gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 rounded-md border px-3 py-2 text-xs font-semibold transition ${
                      difficulty === d
                        ? "border-teal-500 bg-teal-50 text-teal-700"
                        : "border-input bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          {/* Bilder */}
          <Field label="Bilder" hint="Optional – bis zu 6 Bilder">
            <div className="space-y-2">
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="aspect-video w-full rounded-md border border-border object-cover" />
                      <button type="button" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="Bild entfernen">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={(e) => onPickImages(e.target.files)} />
              <button type="button" onClick={() => imgRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
                <Upload className="h-4 w-4" /> Bilder auswählen
              </button>
            </div>
          </Field>

          {/* Video */}
          <Field label="Video" hint="Link (YouTube, Vimeo…) oder Upload">
            <div className="space-y-2">
              <input value={videoUrl.startsWith("data:") ? "" : videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" className={inputCls} />
              <input ref={videoRef} type="file" accept="video/*" hidden onChange={(e) => onPickVideo(e.target.files?.[0] ?? null)} />
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => videoRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
                  <Upload className="h-3.5 w-3.5" /> Video hochladen
                </button>
                {videoUrl.startsWith("data:") && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    Video hochgeladen
                    <button type="button" onClick={() => setVideoUrl("")} className="text-destructive hover:underline">entfernen</button>
                  </span>
                )}
              </div>
            </div>
          </Field>

          <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
            <Link to="/kondition" className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
              Abbrechen
            </Link>
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-teal-500/30 transition hover:opacity-95">
              <Save className="h-4 w-4" /> Übung speichern
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100";

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label} {required && <span className="text-rose-500">*</span>}
        </span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
