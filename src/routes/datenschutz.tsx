import { createFileRoute, Link } from "@tanstack/react-router";
import { TurniLogo } from "@/components/TurniLogo";
import { ArrowLeft, Mail } from "lucide-react";

export const Route = createFileRoute("/datenschutz")({
  component: DatenschutzPage,
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — Turni" },
      { name: "description", content: "Datenschutzerklärung für turni.live. Informationen zur Verarbeitung personenbezogener Daten." },
    ],
  }),
});

const BRAND_DARK = "#044C3A";
const BRAND_MINT = "#99FBB7";

function DatenschutzPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6faf7] text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${BRAND_MINT}66, transparent)` }}
        />
        <div
          className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${BRAND_DARK}33, transparent)` }}
        />
      </div>

      <header className="mx-auto flex max-w-3xl items-center justify-between px-6 pt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-lg border bg-white/80 px-3 py-2 text-sm font-medium backdrop-blur transition hover:bg-white"
          style={{ borderColor: `${BRAND_DARK}22`, color: BRAND_DARK }}
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Link>
        <div className="flex items-center gap-2">
          <TurniLogo className="h-6 w-6" />
          <span className="text-sm font-bold" style={{ color: BRAND_DARK }}>
            turni.live
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div
          className="rounded-3xl border bg-white/95 p-8 shadow-sm sm:p-10"
          style={{ borderColor: `${BRAND_DARK}15` }}
        >
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: BRAND_DARK }}>
            Datenschutzerklärung
          </h1>
          <p className="mt-2 text-sm" style={{ color: `${BRAND_DARK}aa` }}>
            Stand: {new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                1. Verantwortlicher
              </h2>
              <div className="mt-3 space-y-1 text-sm" style={{ color: `${BRAND_DARK}cc` }}>
                <p className="font-medium text-foreground">David Garger</p>
                <p>Am Kapellenfeld 3</p>
                <p>7540 Güssing</p>
                <p>Österreich</p>
                <a
                  href="mailto:davidgarger2@gmail.com"
                  className="mt-2 inline-flex items-center gap-2 transition hover:underline"
                  style={{ color: BRAND_DARK }}
                >
                  <Mail className="h-4 w-4" />
                  davidgarger2@gmail.com
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                2. Übersicht der Datenverarbeitung
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Turni ist eine Webanwendung für Sportlehrkräfte zur Verwaltung von Klassen, Schülerdaten,
                Leistungsbewertungen und Turngeräten. Wir nehmen den Schutz deiner persönlichen Daten sehr ernst
                und behandeln personenbezogene Daten vertraulich sowie entsprechend der gesetzlichen
                Datenschutzvorschriften (DSGVO, BDSG).
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                3. Welche Daten werden verarbeitet?
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                <p>
                  <strong className="text-foreground">Authentifizierung:</strong> Bei der Registrierung speichern wir
                  deinen selbstgewählten Benutzernamen und ein verschlüsseltes Passwort. Der Benutzername wird in eine
                  interne E-Mail-Adresse umgewandelt, die ausschließlich für die Login-Funktion verwendet wird.
                </p>
                <p>
                  <strong className="text-foreground">Schüler- und Klassendaten:</strong> Du erfasst freiwillig
                  Klassennamen, Schülernamen, Leistungsnoten und Anwesenheitsdaten. Diese Daten werden in unserer
                  Cloud-Datenbank gespeichert und sind nur für dich über dein Konto zugänglich.
                </p>
                <p>
                  <strong className="text-foreground">Nutzungsdaten:</strong> Bei der Nutzung können technische
                  Informationen (z. B. Gerätetyp, Browserversion, IP-Adresse in anonymisierter Form) anfallen,
                  die der Fehleranalyse und der Sicherheit dienen.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                4. Zweck und Rechtsgrundlage
              </h2>
                <div className="mt-3 space-y-2 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                <p>
                  Die Verarbeitung erfolgt zur Erfüllung des Nutzungsvertrags (Art. 6 Abs. 1 lit. b DSGVO) sowie auf
                  Grundlage deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) bei optionalen Funktionen wie Feedback.
                </p>
                <p>
                  Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO): Sicherheit der IT-Systeme, Fehleranalyse und
                  Betrugsprävention.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                5. Datenweitergabe und Auftragsverarbeitung
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Wir geben deine Daten nicht an Dritte weiter. Die Daten werden bei einem Cloud-Anbieter (Lovable Cloud)
                in der Europäischen Union gespeichert. Es besteht ein Auftragsverarbeitungsvertrag (AVV) mit dem
                Hosting-Anbieter.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                6. Speicherdauer
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Deine Daten werden so lange gespeichert, wie du ein aktives Konto besitzt. Bei Löschung des Kontos
                werden alle zugehörigen Daten innerhalb von 30 Tagen vollständig gelöscht, sofern keine gesetzlichen
                Aufbewahrungspflichten entgegenstehen.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                7. Deine Rechte
              </h2>
              <div className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                <p>Du hast das Recht auf:</p>
                <ul className="mt-2 ml-5 list-disc space-y-1">
                  <li>Auskunft über die zu deiner Person gespeicherten Daten (Art. 15 DSGVO)</li>
                  <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                  <li>Löschung deiner Daten („Recht auf Vergessenwerden“, Art. 17 DSGVO)</li>
                  <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                  <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
                </ul>
                <p className="mt-2">
                  Zur Ausübung deiner Rechte wende dich bitte an{' '}
                  <a href="mailto:davidgarger2@gmail.com" className="underline" style={{ color: BRAND_DARK }}>
                    davidgarger2@gmail.com
                  </a>
                  .
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                8. Cookies & LocalStorage
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Turni verwendet technisch notwendige Cookies und LocalStorage-Einträge für die Authentifizierung und
                die Speicherung von App-Einstellungen. Diese sind für den Betrieb der Anwendung erforderlich und
                werden nicht zu Werbe- oder Trackingzwecken genutzt. Eine Einwilligung ist hierfür nicht erforderlich.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                9. Sicherheit
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um deine Daten vor Verlust,
                Missbrauch und unautorisiertem Zugriff zu schützen. Dazu gehören verschlüsselte Datenübertragung (TLS),
                Zugriffskontrollen und regelmäßige Sicherheitsupdates.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                10. Änderungen dieser Erklärung
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an geänderte
                Rechtslagen oder Funktionserweiterungen anzupassen. Die jeweils aktuelle Version ist auf dieser
                Seite einsehbar.
              </p>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: `${BRAND_DARK}99` }}>
          © {new Date().getFullYear()} Turni ·{' '}
          <Link to="/impressum" className="underline" style={{ color: BRAND_DARK }}>
            Impressum
          </Link>
        </p>
      </main>
    </div>
  );
}
