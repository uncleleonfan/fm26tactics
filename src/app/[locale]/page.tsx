import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero";
import { QuickPicks } from "@/components/home/quick-picks";
import { FeaturedTactics } from "@/components/home/featured-tactics";
import { LatestGuides } from "@/components/home/latest-guides";
import { FaqSection } from "@/components/home/faq-section";
import { ExploreSection } from "@/components/home/explore-section";
import { JsonLd } from "@/components/shared/json-ld";
import { generateLocaleSEO } from "@/lib/metadata";

// ssr: false — eliminates preload links for chunks, preventing bandwidth competition
// on mobile. Content loads instantly after hydration via local JS chunks.
const CommunityInsights = dynamic(
  () => import("@/components/home/community-insights").then((m) => ({ default: m.CommunityInsights })),
  { ssr: false, loading: () => <SectionPlaceholder /> }
);
const StatsSection = dynamic(
  () => import("@/components/home/stats-section").then((m) => ({ default: m.StatsSection })),
  { ssr: false, loading: () => <SectionPlaceholder /> }
);
const TacticBuilderCTA = dynamic(
  () => import("@/components/home/cta-section").then((m) => ({ default: m.TacticBuilderCTA })),
  { ssr: false, loading: () => <SectionPlaceholderTall /> }
);

// Placeholder skeletons with matching approx height — prevents CLS
function SectionPlaceholder() {
  return <div className="py-16" />;
}
function SectionPlaceholderTall() {
  return <div className="py-24" />;
}

// Turkish pilot L1: home is part of the minimal indexable set (§2b)
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generateLocaleSEO({
    locale: params.locale,
    path: "/",
    en: {
      title: "FM26Tactics — Football Manager 2026 Tactics, Guides & Builder",
      description:
        "FM26Tactics is your hub for Football Manager 2026: browse community-tested tactics, explore formations, learn player roles, read in-depth guides, and build your own tactics with our free interactive builder.",
      keywords: [
        "fm26tactics", "football manager 2026 tactics",
        "fm26 tactics website", "fm26 builder", "fm26 guides",
      ],
    },
    tr: {
      title: "FM26Tactics — Football Manager 2026 Taktik, Rehber ve Builder",
      description:
        "FM26Tactics, Football Manager 2026 için merkeziniz: topluluk testli taktikler, formasyon rehberi, oyuncu rolleri, kapsamlı rehberler ve ücretsiz interaktif taktik oluşturucu.",
      keywords: [
        "fm26tactics", "football manager 2026 taktikleri",
        "fm26 taktik sitesi", "fm26 builder", "fm26 rehberler",
      ],
    },
  });
}

const faqEn: Array<[string, string]> = [
  [
    "What is FM26Tactics?",
    "FM26Tactics is a free resource hub for Football Manager 2026 players. It offers a community-tested tactics library, an interactive tactic builder, formation guides, player role breakdowns, and in-depth strategy guides — all designed to help you win more matches. Browse the full tactics library at fm26tactics.com/tactics.",
  ],
  [
    "Which formation is most effective in Football Manager 2026?",
    "The 4-2-3-1 is the most popular and effective formation in Football Manager 2026. It offers a balanced shape with double pivot protection, an attacking midfielder for creativity, and flexibility to switch between possession-based and counter-attacking styles. Other strong formations include 4-3-3, 4-4-2, 5-2-3, and 3-4-2-1.",
  ],
  [
    "How do I create a successful tactic in FM26?",
    "To create a successful tactic in FM26: 1) Choose a formation that fits your squad's strengths, 2) Assign roles and duties that create passing triangles, 3) Set team instructions (mentality, passing style, pressing intensity) that match your playing philosophy, 4) Test and adjust based on match performance. Use our interactive Tactic Builder to visualize and experiment before implementing in-game.",
  ],
  [
    "What are the best player roles for gegenpress in FM26?",
    "For an effective gegenpress in FM26, use: Sweeper Keeper (Attack) in goal, Ball Playing Defenders, Wing Backs (Support), a Segundo Volante or Ball Winning Midfielder paired with a Deep Lying Playmaker in midfield, Inside Forwards or Inverted Wingers on the flanks, and a Pressing Forward leading the line. High stamina, work rate, and determination are essential attributes.",
  ],
  [
    "How does the FM26 Tactic Builder work?",
    "The FM26 Tactic Builder is a free interactive tool that lets you drag and drop 11 players on a pitch, assign player roles and duties (from all FM26 options), configure team instructions (mentality, passing, pressing, etc.), and export or share your tactic. It works directly in your browser with no download required. Access it at fm26tactics.com/builder.",
  ],
];

const faqTr: Array<[string, string]> = [
  [
    "FM26Tactics nedir?",
    "FM26Tactics, Football Manager 2026 oyuncuları için ücretsiz bir kaynak platformudur. Topluluk testli taktik kütüphanesi, interaktif taktik oluşturucu, formasyon rehberleri, oyuncu rol analizleri ve kapsamlı strateji rehberleri sunar. Tüm taktik kütüphanesine fm26tactics.com/tactics adresinden erişebilirsiniz.",
  ],
  [
    "Football Manager 2026'da hangi diziliş en etkili?",
    "4-2-3-1, Football Manager 2026'da en popüler ve en etkili diziliş. Çift pivot korumasıyla dengeli bir yapı, yaratıcılık için hücumcu bir orta saha ve topa dayanıklı ile kontra atak tarzları arasında geçiş esnekliği sunuyor. Diğer güçlü dizilişler: 4-3-3, 4-4-2, 5-2-3 ve 3-4-2-1.",
  ],
  [
    "FM26'da başarılı bir taktik nasıl oluşturulur?",
    "FM26'da başarılı bir taktik oluşturmak için: 1) Kadronuzun güçlü yönlerine uygun bir diziliş seçin, 2) Pas üçgenleri oluşturan roller ve görevler atayın, 3) Oyun felsefenize uygun takım talimatları (mentalite, pas stili, pres yoğunluğu) belirleyin, 4) Maç performansına göre test edip ayarlayın. Oyunda uygulamadan önce görselleştirmek ve denemek için interaktif Taktik Oluşturucumuzu kullanın.",
  ],
  [
    "FM26'da gegenpress için en iyi oyuncu rolleri neler?",
    "Etkili bir gegenpress için: kalede Süpürücü Kaleci (Hücum), Topla Oynayan Stoperler, Kanat Bekleri (Destek), orta sahada Derin Playmaker ile eşleşmiş bir Segundo Volante veya Top Kaplanı Orta Saha, kanatlarda İç Forvet veya Ters Kanat ve forvette Presçi Forvet kullanın. Yüksek Dayanıklılık, Çalışkanlık ve Kararlılık temel özelliklerdir.",
  ],
  [
    "FM26 Taktik Oluşturucu nasıl çalışır?",
    "FM26 Taktik Oluşturucu; 11 oyuncuyu sahaya sürükleyip bırakmanıza, oyuncu rolleri ve görevleri atamanıza (tüm FM26 seçeneklerinden), takım talimatlarını yapılandırmanıza (mentalite, pas, pres vb.) ve taktiğinizi dışa aktarmanıza veya paylaşmanıza olanak tanıyan ücretsiz bir interaktif araçtır. İndirme gerektirmeden doğrudan tarayıcınızda çalışır. fm26tactics.com/builder adresinden erişin.",
  ],
];

export default function HomePage({ params }: { params: { locale: string } }) {
  const faqs = params.locale === "tr" ? faqTr : faqEn;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: {
              "@type": "Answer",
              text: answer,
            },
          })),
        }}
      />
      <HeroSection />
      <QuickPicks />
      <CommunityInsights />
      <FeaturedTactics locale={params.locale} />
      <StatsSection />
      <TacticBuilderCTA />
      <LatestGuides locale={params.locale} />
      <ExploreSection locale={params.locale} />
      <FaqSection faqs={faqs} locale={params.locale} />
    </>
  );
}
