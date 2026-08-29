import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero";
import { QuickPicks } from "@/components/home/quick-picks";
import { JsonLd } from "@/components/shared/json-ld";
import { generateLocaleSEO } from "@/lib/metadata";

// ssr: false — eliminates preload links for chunks, preventing bandwidth competition
// on mobile. Content loads instantly after hydration via local JS chunks.
const CommunityInsights = dynamic(
  () => import("@/components/home/community-insights").then((m) => ({ default: m.CommunityInsights })),
  { ssr: false, loading: () => <SectionPlaceholder /> }
);
const FeaturedTactics = dynamic(
  () => import("@/components/home/featured-tactics").then((m) => ({ default: m.FeaturedTactics })),
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
const LatestGuides = dynamic(
  () => import("@/components/home/latest-guides").then((m) => ({ default: m.LatestGuides })),
  { ssr: false, loading: () => <SectionPlaceholder /> }
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
      title: "Best FM26 Tactics & Formations",
      description:
        "Discover the best FM 26 tactics and meta formations. Community-tested strategies, interactive builder, and in-depth guides for Football Manager 2026.",
      keywords: [
        "fm 26 tactics", "fm26 best tactics", "fm 26 formations",
        "football manager 2026", "fm26 gegenpress",
      ],
    },
    tr: {
      title: "En İyi FM26 Taktikleri ve Dizilişleri",
      description:
        "En iyi FM 26 taktiklerini ve meta dizilişlerini keşfedin. Topluluk tarafından test edilen stratejiler, interaktif taktik kurucu ve Football Manager 2026 için kapsamlı rehberler.",
      keywords: [
        "fm 26 taktikleri", "en iyi fm26 taktikleri", "fm 26 dizilişleri",
        "football manager 2026 taktikleri",
      ],
    },
  });
}

const faqEn: Array<[string, string]> = [
  [
    "What are the best FM 26 tactics?",
    "The best FM 26 tactics include gegenpress (4-2-3-1), tiki-taka (4-3-3), and wing play (4-4-2). Community-tested meta tactics from FM-Arena and FM Scout show gegenpress as the most consistent performer across multiple game saves, with 4-2-3-1 and 4-3-3 formations leading the meta rankings.",
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
    "En iyi FM 26 taktikleri neler?",
    "En iyi FM 26 taktikleri arasında gegenpress (4-2-3-1), tiki-taka (4-3-3) ve kanat oyunu (4-4-2) yer alıyor. FM-Arena ve FM Scout'tan topluluk testli meta taktikler, gegenpress'i birden fazla kariyerde en tutarlı performans gösteren taktik olarak işaretliyor; 4-2-3-1 ve 4-3-3 dizilişleri meta sıralamalarına öncülük ediyor.",
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
      <FeaturedTactics />
      <StatsSection />
      <TacticBuilderCTA />
      <LatestGuides />
    </>
  );
}
