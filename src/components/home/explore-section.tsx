import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Trophy, Layout, Users, BookOpen } from "lucide-react";

const exploreItems = [
  {
    href: "/best",
    titleKey: "exploreBest",
    descKey: "exploreBestDesc",
    icon: <Trophy className="w-5 h-5" />,
  },
  {
    href: "/formations",
    titleKey: "exploreFormations",
    descKey: "exploreFormationsDesc",
    icon: <Layout className="w-5 h-5" />,
  },
  {
    href: "/roles",
    titleKey: "exploreRoles",
    descKey: "exploreRolesDesc",
    icon: <Users className="w-5 h-5" />,
  },
  {
    href: "/blog",
    titleKey: "exploreBlog",
    descKey: "exploreBlogDesc",
    icon: <BookOpen className="w-5 h-5" />,
  },
] as const;

interface ExploreSectionProps {
  locale: string;
}

export async function ExploreSection({ locale }: ExploreSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1C2436]/50">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          <span className="gradient-text">{t("exploreTitle").split(" ")[0]}</span>{" "}
          {t("exploreTitle").split(" ").slice(1).join(" ")}
        </h2>
        <p className="text-text-secondary text-sm">{t("exploreSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {exploreItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass-card p-6 group text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
              {item.icon}
            </div>
            <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors">
              {t(item.titleKey)}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {t(item.descKey)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
