import type { Metadata } from "next";
import { generateLocaleSEO } from "@/lib/metadata";
import { MetaPage } from "@/components/home/meta-page";

// Turkish pilot L1: core list page is part of the minimal indexable set (§2b)
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return generateLocaleSEO({
    locale: params.locale,
    path: "/meta",
    en: {
      title: "FM26 Meta Tactics — What's Actually Good in FM26",
      description: "Analysis of the current FM26 tactical meta. Which formations and play styles dominate, what the match engine rewards, and how to adapt your tactics for success.",
    },
    tr: {
      title: "FM26 Meta Taktikleri — FM26'da Gerçekten İşe Yarayan Nedir",
      description: "Güncel FM26 taktik metasının analizi. Hangi dizilişler ve oyun stilleri baskın, maç motoru neyi ödüllendiriyor ve taktiklerinizi başarı için nasıl uyarlayabilirsiniz.",
    },
  });
}

export default function MetaPageRoute() {
  return <MetaPage />;
}
