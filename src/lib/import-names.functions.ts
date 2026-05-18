import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway";

const InputSchema = z.object({
  fileBase64: z.string().min(10),
  mimeType: z.string().min(3).max(100),
});

const ResultSchema = z.object({
  students: z
    .array(
      z.object({
        firstName: z.string().min(1).max(100),
        lastName: z.string().min(1).max(100),
      }),
    )
    .max(200),
});

function isImageMimeType(mimeType: string) {
  return mimeType.toLowerCase().startsWith("image/");
}

function cleanStudentNames(students: z.infer<typeof ResultSchema>["students"]) {
  const seen = new Set<string>();
  return students
    .map((student) => ({
      firstName: student.firstName.replace(/\s+/g, " ").trim(),
      lastName: student.lastName.replace(/\s+/g, " ").trim(),
    }))
    .filter((student) => student.firstName && student.lastName)
    .filter((student) => {
      const key = `${student.firstName.toLowerCase()}|${student.lastName.toLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export const extractStudentNames = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("Missing LOVABLE_API_KEY");
    }

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-2.5-pro");

    const buffer = Buffer.from(data.fileBase64, "base64");

    const filePart = isImageMimeType(data.mimeType)
      ? { type: "image" as const, image: buffer, mediaType: data.mimeType }
      : { type: "file" as const, data: buffer, mediaType: data.mimeType };

    const system =
      "Du extrahierst Schülernamen aus Klassenlisten (Fotos, Screenshots, Scans, PDFs). " +
      "Lies SEHR sorgfältig – auch bei schlechter Bildqualität, kleiner Schrift, Handschrift, schräg fotografierten oder leicht unscharfen Bildern. " +
      "Screenshots enthalten Namen oft in Tabellen, Listen, Exporten, Chat-/Schulplattform-Ansichten oder abgeschnittenen Spalten. " +
      "Gehe Zeile für Zeile und Spalte für Spalte durch das gesamte Bild, auch Randbereiche. " +
      "Erkenne jeden Schüler. Trenne Vor- und Nachname so wie üblich im deutschen/österreichischen/schweizerischen Schulsystem. " +
      "Achte auf Umlaute (ä, ö, ü), ß, Bindestriche und Apostrophe in Namen (z. B. O'Brien, Müller-Schmidt). " +
      "Wenn nur 'Nachname Vorname' geschrieben ist, ordne korrekt zu. " +
      "Ignoriere Spaltenüberschriften, Klassenbezeichnungen, Lehrernamen, Noten, Geburtsdaten, E-Mail-Adressen und reine Zahlen. " +
      "Gib lieber einen plausiblen Best-Guess-Namen zurück als ihn auszulassen. " +
      "Gib nur tatsächliche Schülernamen zurück.";

    const { output } = await generateText({
      model,
      output: Output.object({ schema: ResultSchema }),
      messages: [
        {
          role: "system",
          content: system,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extrahiere ALLE Schülernamen aus dieser Datei. Bei Screenshots: lies die sichtbare Liste vollständig von oben nach unten und gib auch unsichere, aber plausible Namen zurück.",
            },
            filePart,
          ],
        },
      ],
    });

    return { students: cleanStudentNames(output.students) };
  });
