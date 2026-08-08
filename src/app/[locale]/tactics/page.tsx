import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { TacticsList } from "@/components/tactics/tactics-list";
import { allTactics } from "contentlayer/generated";

export default async function TacticsListPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const tc = await getTranslations({ locale, namespace: "tactics" });
  const cm = await getTranslations({ locale, namespace: "common" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Breadcrumb
          items={[{ label: cm("home"), href: "/" }, { label: nav("tactics") }]}
          className="mb-6"
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="gradient-text">{nav("tactics")}</span> Library
          </h1>
          <p className="text-text-secondary max-w-2xl">
            {tc("description")}
          </p>
        </div>

        <TacticsList tactics={allTactics} />
      </div>
    </div>
  );
}
