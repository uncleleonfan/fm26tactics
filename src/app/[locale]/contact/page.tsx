import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { generateSEO } from "@/lib/metadata";
import { Mail, Github, MessageCircle } from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "Contact",
  description: "Get in touch with FM26 Tactics — feedback, suggestions, and community.",
  path: "/contact",
});

export default async function ContactPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const ct = await getTranslations({ locale, namespace: "contact" });

  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{ct("title")}</h1>
            <p className="text-text-secondary text-sm mt-1">{ct("subtitle")}</p>
          </div>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Have a tactic to share? Found a bug? Just want to say hi? Reach out
          through any of the channels below.
        </p>

        <div className="space-y-4">
          <a href="mailto:uncleleofan@gmail.com" className="glass-panel p-5 flex items-center gap-4 group hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{ct("email")}</h3>
              <p className="text-xs text-text-secondary">uncleleofan@gmail.com</p>
            </div>
          </a>

          <a href="https://github.com/uncleleonfan/fm26tactics" target="_blank" rel="noopener noreferrer" className="glass-panel p-5 flex items-center gap-4 group hover:border-primary/30 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <Github className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{ct("github")}</h3>
              <p className="text-xs text-text-secondary">Open an issue or submit a pull request</p>
            </div>
          </a>

          <div className="glass-panel p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              What to include when contacting us
            </h3>
            <ul className="text-text-secondary text-xs space-y-1.5">
              <li className="list-disc ml-4 marker:text-text-muted">Tactic-related: formation, roles, instructions, and what&apos;s not working</li>
              <li className="list-disc ml-4 marker:text-text-muted">Bug reports: browser, device, steps to reproduce</li>
              <li className="list-disc ml-4 marker:text-text-muted">Guide suggestions: topic you&apos;d like covered</li>
              <li className="list-disc ml-4 marker:text-text-muted">Community data: links to proven tactics or test results</li>
            </ul>
          </div>
        </div>

        <Link href="/" className="inline-flex items-center gap-1 text-primary text-sm hover:underline mt-8 transition-colors">
          &larr; {ct("backToHome")}
        </Link>
      </div>
    </div>
  );
}
