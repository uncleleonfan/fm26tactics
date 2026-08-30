import type { Metadata } from "next";
import { generateLocaleSEO } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generateLocaleSEO({
    locale: params.locale,
    path: "/builder",
    en: {
      title: "FM26 Tactic Builder – Create Football Manager 2026 Tactics",
      description:
        "Build custom Football Manager 2026 tactics with our free interactive FM26 tactic builder. Drag players onto the pitch, assign roles and duties, configure team instructions, and export your formation — no download required.",
      keywords: [
        "fm26 tactic builder", "fm26 tactics builder", "fm tactic builder",
        "fm26 tactic creator", "football manager 2026 tactic builder",
        "fm 26 formation creator", "fm26 formation builder",
        "fm26 custom tactics", "football manager 2026 formation maker",
      ],
    },
    tr: {
      title: "FM26 Taktik Oluşturucu — Football Manager 2026 Taktikleri Yap",
      description:
        "Ücretsiz interaktif FM26 taktik oluşturucu ile kendi Football Manager 2026 taktiklerinizi tasarlayın. Oyuncuları sahayla sürükleyin, roller atayın, takım talimatlarını ayarlayın ve dizilişinizi dışa aktarın — indirme gerekmez.",
      keywords: [
        "fm26 taktik oluşturucu", "fm26 taktik kurucu", "fm taktik oluşturucu",
        "fm26 taktik yapıcı", "football manager 2026 taktik oluşturucu",
        "fm26 diziliş oluşturucu", "fm26 özel taktikler",
      ],
    },
  });
}

const faqData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the FM26 Tactic Builder?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The FM26 Tactic Builder is a free, browser-based tool for creating custom Football Manager 2026 tactics. You can place players on a virtual pitch, assign every FM26 player role and duty, configure team instructions, and export or share your finished formation.",
      },
    },
    {
      "@type": "Question",
      name: "Is the FM26 tactic builder free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the FM26 Tactic Builder is completely free to use. No download, account, or registration is required — it runs directly in your browser.",
      },
    },
    {
      "@type": "Question",
      name: "How do I export my FM26 tactic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Use the Export button to save your custom tactic as an image with the full lineup, roles, duties, and team instructions visible, ready to recreate in Football Manager 2026.",
      },
    },
    {
      "@type": "Question",
      name: "Can I share my FM26 tactic with others?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — use the Share button to copy your formation setup and share it with friends, forums, or the wider FM community.",
      },
    },
    {
      "@type": "Question",
      name: "Does the FM26 Tactic Builder support custom formations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. You can build any shape, including three-at-the-back systems, diamond midfields, wide 4-3-3s, and unconventional setups — position players anywhere on the pitch and assign the roles that fit your system.",
      },
    },
  ],
};

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqData} />
      <div className="-mt-16 h-dvh overflow-hidden">{children}</div>

      {/* SEO content — below the fold, visible to crawlers and scrollable */}
      <section className="max-w-3xl mx-auto px-4 py-16 space-y-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">FM26 Tactic Builder — Create Football Manager 2026 Tactics</h2>
          <p className="text-text-secondary leading-relaxed mb-3">
            The FM26 Tactic Builder is a free, browser-based tool for designing custom Football Manager 2026 tactics. 
            Whether you want to recreate a classic gegenpress, build a possession-based tiki-taka system, or 
            experiment with an unconventional 3-5-2, the builder lets you place players on a virtual pitch, 
            assign every FM26 player role and duty, configure team instructions, and export your formation — 
            all without downloading any software.
          </p>
          <p className="text-text-secondary leading-relaxed">
            Football Manager 2026 offers incredible tactical depth, but finding the right formation and role 
            combination can be overwhelming. The FM26 Tactic Builder simplifies the process: pick a base 
            formation, assign roles like Deep-Lying Playmaker, Ball-Playing Defender, or Advanced Forward, 
            then export the finished tactic as an image you can recreate in-game.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">How to Use the FM26 Tactic Builder</h3>
          <ol className="space-y-3 text-text-secondary">
            <li className="flex gap-3">
              <span className="font-bold text-primary shrink-0">1.</span>
              <span><strong className="text-text-primary">Choose a formation</strong> — Start with a preset like 4-3-3, 4-2-3-1, 4-4-2, or 3-5-2, or build from scratch.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary shrink-0">2.</span>
              <span><strong className="text-text-primary">Assign player roles</strong> — Click any position to select from all FM26 roles: DLP, BBM, BPD, Target Forward, and more. Set duties (Attack, Support, Defend).</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary shrink-0">3.</span>
              <span><strong className="text-text-primary">Configure team instructions</strong> — Set mentality, tempo, pressing intensity, and defensive line.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-primary shrink-0">4.</span>
              <span><strong className="text-text-primary">Export and share</strong> — Save your tactic as an image with the full lineup visible, ready to recreate in Football Manager 2026.</span>
            </li>
          </ol>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Related FM26 Guides</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "FM26 Tactics Library", href: "/tactics" },
              { label: "FM26 Best Tactics 2026", href: "/best" },
              { label: "FM26 Formations Guide", href: "/formations" },
              { label: "FM26 Player Roles", href: "/roles" },
              { label: "FM26 Shouts Guide", href: "/guides/match-day-shouts-guide" },
              { label: "FM26 Gegenpress Tactics", href: "/tactics/gegenpress-4-3-3" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass-card p-4 rounded-xl border border-primary/10 hover:border-primary/40 transition-colors flex items-center justify-between gap-3 group"
              >
                <span className="text-sm font-medium">{link.label}</span>
                <ArrowRight className="w-4 h-4 text-primary shrink-0 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
