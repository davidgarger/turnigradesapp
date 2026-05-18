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
    const model = gateway("google/gemini-2.5-flash");

    const buffer = Buffer.from(data.fileBase64, "base64");

    const { experimental_output } = await generateText({
      model,
      experimental_output: Output.object({ schema: ResultSchema }),
      messages: [
        {
          role: "system",
          content:
            "Du extrahierst Schülernamen aus Klassenlisten (Bilder oder PDFs). " +
            "Erkenne jeden Schüler. Trenne Vor- und Nachname so wie üblich im deutschen/österreichischen Schulsystem. " +
            "Wenn nur 'Nachname Vorname' geschrieben ist, ordne korrekt zu. " +
            "Ignoriere Spaltenüberschriften, Klassenbezeichnungen, Lehrernamen, Noten und Zahlen. " +
            "Gib nur tatsächliche Schülernamen zurück.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extrahiere alle Schülernamen aus dieser Datei.",
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
