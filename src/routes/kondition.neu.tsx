import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, X, Upload, Save, Eye, Info, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { toast } from "sonner";
import {
  SUBCATEGORIES, DIFFICULTIES,
  type Subcategory, type Difficulty, type Exercise,
} from "@/lib/kondition-store";
import { submitCommunityExercise, uploadExerciseImage, useCurrentUserId } from "@/lib/community-store";
import { ExercisePosterModal } from "@/components/ExercisePosterModal";

export const Route = createFileRoute("/kondition/neu")({
  component: NewExercise,
  head: () => ({ meta: [{ title: "Neue Übung — Kondition" }] }),
});

function NewExercise() {
  const navigate = useNavigate();
  const uid = useCurrentUserId();
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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  // Wenn nicht eingeloggt → Login-Hinweis + Redirect
  useEffect(() => {
    if (uid === null) {
      // uid ist initial null (unbekannt) und bleibt null wenn nicht eingeloggt.
      // Wir warten kurz, damit Auth-Session initialisieren kann.
    }
  }, [uid]);

  const canAddStep = steps.length < 5;
  const canRemoveStep = steps.length > 3;

  const setStep = (i: number, v: string) => setSteps((s) => s.map((x, idx) => (idx === i ? v : x)));
  const addStep = () => canAddStep && setSteps((s) => [...s, ""]);
  const removeStep = (i: number) => canRemoveStep && setSteps((s) => s.filter((_, idx) => idx !== i));

  const onPickImages = async (files: FileList | null) => {
    if (!files) return;
    if (!uid) {
      toast.error("Bitte zuerst einloggen, um Bilder hochzuladen.");
      return;
    }
    setUploadingImages(true);
    try {
      const uploaded: string[] = [];
      for (const f of Array.from(files).slice(0, 5)) {
        const url = await uploadExerciseImage(f);
        uploaded.push(url);
      }
      setImages((prev) => [...prev, ...uploaded].slice(0, 6));
    } catch (err) {
      console.error(err);
      toast.error("Bild-Upload fehlgeschlagen");
    } finally {
      setUploadingImages(false);
    }
  };

  const onPickVideo = (f: File | null) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setVideoUrl(String(r.result));
    r.readAsDataURL(f);
  };

  const previewExercise: Exercise = useMemo(() => ({
    id: "preview",
    title: title.trim() || "Titel der Übung",
    subcategory,
    shortDescription: shortDescription.trim() || "Kurze Beschreibung der Übung erscheint hier.",
    goal: goal.trim(),
    steps: steps.map((s) => s.trim()).filter(Boolean),
    duration: duration.trim() || `${durationMinutes} Min`,
    durationMinutes,
    groupSize: groupSize.trim() || "ganze Klasse",
    material: material.trim(),
    ageGroup: ageGroup.trim() || `${ageMin}–${ageMax} Jahre`,
    ageMin, ageMax,
    difficulty,
    images,
    videoUrl: videoUrl || undefined,
    createdAt: Date.now(),
  }), [title, subcategory, shortDescription, goal, steps, duration, durationMinutes, groupSize, material, ageGroup, ageMin, ageMax, difficulty, images, videoUrl]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) {
      toast.error("Bitte zuerst einloggen.");
      navigate({ to: "/login" });
      return;
    }
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (!title.trim() || !shortDescription.trim() || !goal.trim() || cleanSteps.length < 3) {
      toast.error("Bitte alle Pflichtfelder ausfüllen (mind. 3 Schritte).");
      return;
    }
    setSaving(true);
    try {
      await submitCommunityExercise({
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
        authorName: authorName.trim() || undefined,
      });
      toast.success("Übung eingereicht — wird nach Freigabe für alle sichtbar.");
      navigate({ to: "/kondition" });
    } catch (err) {
      console.error(err);
      toast.error("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
          <Link to="/kondition" className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Link>
          <h1 className="truncate text-sm font-medium uppercase tracking-[0.14em] text-slate-500">Bearbeiten</h1>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <Eye className="h-4 w-4" /> Vorschau
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {!uid && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Du bist nicht eingeloggt. <Link to="/login" className="font-semibold underline">Jetzt einloggen</Link>, um eine Übung einzureichen.
            </span>
          </div>
        )}
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Deine Übung wird nach kurzer Freigabe durch einen Admin für alle Nutzer sichtbar.
          </span>
        </div>
        <form onSubmit={submit} className="space-y-6">
          {/* Titel — großer, schlichter Header-Input */}
          <div>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 bg-transparent px-0 text-2xl font-bold tracking-tight text-slate-900 outline-none placeholder:text-slate-300"
              placeholder="Titel der Übung"
            />
            <div className="mt-1 h-px w-full bg-slate-200" />
          </div>

          {/* Unterkategorie */}
          <Row label="Unterkategorie">
            <div className="flex flex-wrap gap-1.5">
              {SUBCATEGORIES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSubcategory(s)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    subcategory === s
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Kurzbeschreibung">
            <textarea required value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} className={plainInput} placeholder="1–2 Sätze" />
          </Row>

          <Row label="Ziel der Übung">
            <textarea required value={goal} onChange={(e) => setGoal(e.target.value)} rows={2} className={plainInput} />
          </Row>

          <Row label="Ablauf" hint="3–5 Schritte">
            <div className="space-y-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-2 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {i + 1}
                  </span>
                  <textarea
                    value={s}
                    onChange={(e) => setStep(i, e.target.value)}
                    rows={2}
                    className={plainInput}
                    placeholder={`Schritt ${i + 1}`}
                  />
                  {canRemoveStep && (
                    <button type="button" onClick={() => removeStep(i)} className="mt-2 grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Schritt entfernen">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {canAddStep && (
                <button type="button" onClick={addStep} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:text-slate-900">
                  <Plus className="h-3.5 w-3.5" /> Schritt hinzufügen
                </button>
              )}
            </div>
          </Row>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Row label="Dauer">
              <input required value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="10 Min" className={plainInput} />
            </Row>
            <Row label="Ungefähre Minuten" hint="für Filter">
              <input type="number" min={1} max={120} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value) || 10)} className={plainInput} />
            </Row>
            <Row label="Gruppengröße">
              <input required value={groupSize} onChange={(e) => setGroupSize(e.target.value)} placeholder="ganze Klasse / 4er-Teams" className={plainInput} />
            </Row>
            <Row label="Material">
              <input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="Hütchen, Würfel…" className={plainInput} />
            </Row>
            <Row label="Altersgruppe">
              <input required value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)} placeholder="10–14 Jahre" className={plainInput} />
            </Row>
            <div className="grid grid-cols-2 gap-2">
              <Row label="Alter von">
                <input type="number" min={4} max={20} value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value) || 8)} className={plainInput} />
              </Row>
              <Row label="Alter bis">
                <input type="number" min={4} max={20} value={ageMax} onChange={(e) => setAgeMax(Number(e.target.value) || 14)} className={plainInput} />
              </Row>
            </div>
            <Row label="Schwierigkeit">
              <div className="flex gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      difficulty === d ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Row>
          </div>

          <Row label="Bilder" hint="optional">
            <div className="space-y-2">
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="aspect-video w-full rounded-md object-cover ring-1 ring-slate-200" />
                      <button type="button" onClick={() => setImages((p) => p.filter((_, idx) => idx !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80" aria-label="Bild entfernen">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input ref={imgRef} type="file" accept="image/*" multiple hidden onChange={(e) => onPickImages(e.target.files)} />
              <button type="button" onClick={() => imgRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <Upload className="h-4 w-4" /> Bilder auswählen
              </button>
            </div>
          </Row>

          <Row label="Video" hint="Link oder Upload">
            <div className="space-y-2">
              <input value={videoUrl.startsWith("data:") ? "" : videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" className={plainInput} />
              <input ref={videoRef} type="file" accept="video/*" hidden onChange={(e) => onPickVideo(e.target.files?.[0] ?? null)} />
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => videoRef.current?.click()} className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <Upload className="h-3.5 w-3.5" /> Video hochladen
                </button>
                {videoUrl.startsWith("data:") && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    Video hochgeladen
                    <button type="button" onClick={() => setVideoUrl("")} className="text-rose-600 hover:underline">entfernen</button>
                  </span>
                )}
              </div>
            </div>
          </Row>

          <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-2 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" /> Vorschau
            </button>
            <Link to="/kondition" className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Abbrechen
            </Link>
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              <Save className="h-4 w-4" /> Speichern
            </button>
          </div>
        </form>
      </main>

      {showPreview && (
        <ExercisePosterModal exercise={previewExercise} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
}

const plainInput = "w-full border-0 border-b border-slate-200 bg-transparent px-0 py-1.5 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-slate-400";

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</span>
        {hint && <span className="text-[10px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}
