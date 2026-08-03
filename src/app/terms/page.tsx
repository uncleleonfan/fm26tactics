import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/metadata";
import { FileText } from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "Terms of Service",
  description:
    "FM26 Tactics terms of service — website usage terms, disclaimers, and limitations of liability.",
  path: "/terms",
});

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing and using FM26 Tactics (fm26tactics.com), you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the website.

FM26 Tactics is an unofficial fan site and is not affiliated with, endorsed by, or connected to Sports Interactive, SEGA, or the Football Manager series. "Football Manager" and "FM" are trademarks of Sports Interactive.`,
  },
  {
    title: "Use of the Website",
    content: `You may use FM26 Tactics for personal, non-commercial purposes. This includes:
- Reading guides, articles, and tactics analysis
- Using the interactive Tactic Builder tool
- Sharing content via links or social media

You agree not to:
- Use the site for any unlawful purpose
- Attempt to disrupt or overload the website's infrastructure
- Scrape or reproduce content at scale without permission
- Misrepresent your affiliation with FM26 Tactics`,
  },
  {
    title: "Intellectual Property",
    content: `All original content on FM26 Tactics — including guides, analysis, graphics, and the Tactic Builder interface — is the intellectual property of FM26 Tactics unless otherwise stated.

Community-sourced data (tactic testing results, formation rankings) is attributed to its respective sources (FM-Arena, FM Scout, etc.) and used for educational and informational purposes.

You may share short excerpts with attribution and a link back. Full reproduction of articles or guides requires prior written permission.`,
  },
  {
    title: "User-Generated Content",
    content: `Currently, FM26 Tactics does not accept user-submitted content, comments, or uploads. The Tactic Builder stores data locally in your browser only.

If we introduce user-submitted content features in the future, we will update these terms accordingly.`,
  },
  {
    title: "Disclaimer of Warranties",
    content: `FM26 Tactics is provided "as is" and "as available" without warranties of any kind, either express or implied.

While we strive to provide accurate and up-to-date Football Manager 2026 tactics information, we make no guarantees regarding:
- The accuracy or completeness of any content
- The effectiveness of any tactic in your specific save game
- Uninterrupted or error-free access to the website
- Compatibility with future FM patches or updates

Tactics are tested in specific conditions and your results may vary based on your squad, league, and play style.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, FM26 Tactics and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the website.

This includes, but is not limited to:
- Loss of game progress or save files
- Decisions made based on website content
- Temporary website unavailability
- Third-party content linked from our pages`,
  },
  {
    title: "Third-Party Links",
    content: `Our website contains links to third-party websites including FM-Arena, FM Scout, Sortitoutsi, Passion4FM, and others. We do not control or endorse the content, privacy policies, or practices of these sites.

Clicking on external links is at your own risk. We recommend reviewing the terms and privacy policies of any third-party website you visit.`,
  },
  {
    title: "Changes to These Terms",
    content: `We reserve the right to modify these Terms of Service at any time. Changes will become effective immediately upon posting to this page.

Your continued use of FM26 Tactics after any changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.

Last updated: August 3, 2026.`,
  },
  {
    title: "Contact",
    content: `If you have questions about these Terms of Service, please contact us at uncleleofan@gmail.com.

For copyright concerns, please include "Copyright" in the subject line for priority handling.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Terms of <span className="gradient-text">Service</span>
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Effective August 3, 2026
            </p>
          </div>
        </div>

        {/* Intro */}
        <p className="text-text-secondary text-sm leading-relaxed mb-10">
          Please read these terms carefully before using FM26 Tactics. By using
          our website, you agree to these terms.
        </p>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section, i) => (
            <div key={i} className="glass-panel p-6">
              <h2 className="text-base font-semibold text-text-primary mb-3">
                {i + 1}. {section.title}
              </h2>
              {section.content.split("\n\n").map((para, j) => (
                <p
                  key={j}
                  className="text-text-secondary text-sm leading-relaxed mb-3 last:mb-0"
                >
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-primary text-sm hover:underline mt-8 transition-colors"
        >
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
