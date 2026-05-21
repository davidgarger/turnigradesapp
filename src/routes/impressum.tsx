import { createFileRoute, Link } from "@tanstack/react-router";
import { TurniLogo } from "@/components/TurniLogo";
import { ArrowLeft, Mail, Globe } from "lucide-react";

export const Route = createFileRoute("/impressum")({
  component: ImpressumPage,
  head: () => ({
    meta: [
      { title: "Impressum — Turni" },
      { name: "description", content: "Impressum und Kontaktinformationen für turni.live." },
    ],
  }),
});

const BRAND_DARK = "#044C3A";
const BRAND_MINT = "#99FBB7";

function ImpressumPage() {
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
            Impressum
          </h1>
          <p className="mt-2 text-sm" style={{ color: `${BRAND_DARK}aa` }}>
            Angaben gemäß § 5 TMG
          </p>

          <div className="mt-8 space-y-8">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                Betreiber
              </h2>
              <div className="mt-3 space-y-1 text-sm" style={{ color: `${BRAND_DARK}cc` }}>
                <p className="font-medium text-foreground">David Garger</p>
                <p>Am Dorfgraben 25</p>
                <p>91054 Erlangen</p>
                <p>Deutschland</p>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                Kontakt
              </h2>
              <div className="mt-3 space-y-2 text-sm" style={{ color: `${BRAND_DARK}cc` }}>
                <a
                  href="mailto:davidgarger2@gmail.com"
                  className="inline-flex items-center gap-2 transition hover:underline"
                  style={{ color: BRAND_DARK }}
                >
                  <Mail className="h-4 w-4" />
                  davidgarger2@gmail.com
                </a>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>www.turni.live</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                Verantwortlich für den Inhalt
              </h2>
              <p className="mt-3 text-sm" style={{ color: `${BRAND_DARK}cc` }}>
                David Garger
                <br />
                Am Dorfgraben 25 · 91054 Erlangen
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                Haftung für Inhalte
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit
                und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
                gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet,
                übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die
                auf eine rechtswidrige Tätigkeit hinweisen.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                Haftung für Links
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben.
                Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
                verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die
                verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                Urheberrecht
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Die durch den Betreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen
                Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND_DARK }}>
                Streitbeilegung
              </h2>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: `${BRAND_DARK}cc` }}>
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: BRAND_DARK }}
                >
                  ec.europa.eu/consumers/odr
                </a>
                .<br />
                Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>
          </div>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: `${BRAND_DARK}99` }}>
          © {new Date().getFullYear()} Turni ·{' '}
          <Link to="/datenschutz" className="underline" style={{ color: BRAND_DARK }}>
            Datenschutzerklärung
          </Link>
        </p>
      </main>
    </div>
  );
}
