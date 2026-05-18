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

    const { experimental_output } = await generateText({
      model,
      experimental_output: Output.object({ schema: ResultSchema }),
      messages: [
        {
          role: "system",
          content:
            "Du extrahierst Schülernamen aus Klassenlisten (Fotos, Screenshots, Scans, PDFs). " +
            "Lies SEHR sorgfältig – auch bei schlechter Bildqualität, kleiner Schrift, Handschrift, schräg fotografierten oder leicht unscharfen Bildern. " +
            "Erkenne jeden Schüler. Trenne Vor- und Nachname so wie üblich im deutschen/österreichischen/schweizerischen Schulsystem. " +
            "Achte auf Umlaute (ä, ö, ü), ß, Bindestriche und Apostrophe in Namen (z. B. O'Brien, Müller-Schmidt). " +
            "Wenn nur 'Nachname Vorname' geschrieben ist, ordne korrekt zu. " +
            "Ignoriere Spaltenüberschriften, Klassenbezeichnungen, Lehrernamen, Noten, Geburtsdaten und reine Zahlen. " +
            "Gib lieber einen Namen mit best-guess zurück als ihn auszulassen. " +
            "Gib nur tatsächliche Schülernamen zurück.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extrahiere ALLE Schülernamen aus dieser Datei – auch wenn sie schwer lesbar sind. Lass keinen Namen aus.",
            },
            {
              type: "file",
              data: buffer,
              mediaType: data.mimeType,
            },
          ],
        },
      ],
    });

    return experimental_output;
  });
