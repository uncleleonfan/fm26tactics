import { getTranslations } from "next-intl/server";

interface FaqSectionProps {
  faqs: Array<[string, string]>;
  locale: string;
}

export async function FaqSection({ faqs, locale }: FaqSectionProps) {
  const t = await getTranslations({ locale, namespace: "home" });

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-20 border-t border-[#1C2436]/50">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        <span className="gradient-text">{t("faqTitle").split(" ")[0]}</span>{" "}
        {t("faqTitle").split(" ").slice(1).join(" ")}
      </h2>
      <div className="space-y-3">
        {faqs.map(([question, answer]) => (
          <details
            key={question}
            className="group rounded-lg border border-surface-border bg-surface"
          >
            <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-base font-semibold text-text-primary select-none">
              {question}
              <span className="text-text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-4 pb-4 text-base text-text-primary/90 leading-7">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
