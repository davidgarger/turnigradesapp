import { useMemo } from "react";
import { User } from "lucide-react";
import type { Student } from "@/lib/turn-store";

interface Props {
  student: Pick<Student, "firstName" | "lastName" | "photo">;
  size?: number; // px
  className?: string;
  rounded?: "full" | "lg" | "xl" | "2xl";
}

export function StudentAvatar({ student, size = 32, className = "", rounded = "full" }: Props) {
  const initials = useMemo(
    () =>
      `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase(),
    [student.firstName, student.lastName],
  );
  const radius =
    rounded === "full"
      ? "rounded-full"
      : rounded === "lg"
        ? "rounded-lg"
        : rounded === "xl"
          ? "rounded-xl"
          : "rounded-2xl";

  const style = { width: size, height: size };

  if (student.photo) {
    return (
      <img
        src={student.photo}
        alt={`${student.firstName} ${student.lastName}`}
        style={style}
        className={`${radius} object-cover ring-1 ring-black/10 ${className}`}
        loading="lazy"
      />
    );
  }
  return (
    <div
      style={style}
      className={`${radius} inline-flex items-center justify-center bg-muted text-muted-foreground font-bold ${className}`}
    >
      {initials || <User className="h-1/2 w-1/2" />}
    </div>
  );
}

// Liest eine Bilddatei und skaliert sie clientseitig auf ~max 320px herunter.
export async function fileToResizedDataUrl(
  file: File,
  max = 320,
  quality = 0.78,
): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("Bild konnte nicht geladen werden"));
    i.src = dataUrl;
  });
  // Quadratisch zuschneiden (center crop) und auf max skalieren
  const side = Math.min(img.width, img.height);
  const sx = (img.width - side) / 2;
  const sy = (img.height - side) / 2;
  const out = Math.min(max, side);
  const canvas = document.createElement("canvas");
  canvas.width = out;
  canvas.height = out;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
  return canvas.toDataURL("image/jpeg", quality);
}
