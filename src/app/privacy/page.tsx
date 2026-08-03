import type { Metadata } from "next";
import Link from "next/link";
import { generateSEO } from "@/lib/metadata";
import { Shield } from "lucide-react";

export const metadata: Metadata = generateSEO({
  title: "Privacy Policy",
  description:
    "FM26 Tactics privacy policy — how we handle your data, cookies, and third-party services.",
  path: "/privacy",
});

const sections = [
  {
    title: "Information We Collect",
    content: `FM26 Tactics does not require user registration or account creation. You can browse, read guides, and use the Tactic Builder without providing any personal information.

We may automatically collect limited, non-identifiable information including:
- Browser type and version
- Operating system
- Referring URL and pages visited
- Date and time of access
- Aggregated usage patterns (e.g., most visited pages)

This information is collected through standard web server logs and analytics tools solely to improve site performance and content relevance.`,
  },
  {
    title: "Cookies",
    content: `We use minimal cookies for functional purposes only:

- **Essential Cookies**: Required for core site functionality, such as maintaining your theme preference (dark mode). These do not track you across other websites.
- **Analytics Cookies** (optional): We may use anonymized analytics to understand how visitors interact with our content. No personally identifiable information is collected.

You can disable cookies in your browser settings at any time. The site will continue to function normally.`,
  },
  {
    title: "Tactic Builder Data",
    content: `The Tactic Builder tool runs entirely in your browser. Your tactic designs, formations, and role selections are stored locally on your device using browser storage (localStorage). No tactic data is uploaded to or processed by our servers.

You can clear this data at any time by clearing your browser's site data for fm26tactics.com.`,
  },
  {
    title: "Third-Party Services",
    content: `We use the following third-party services to operate FM26 Tactics:

- **Vercel**: Hosting platform. Vercel may collect standard server logs including IP addresses and request data as part of their infrastructure operation. See Vercel's privacy policy for details.
- **External Links**: Our content links to third-party websites (FM-Arena, FM Scout, Football Manager Blog, etc.). We are not responsible for the privacy practices of those sites.

We do not use advertising networks, tracking pixels, or social media widgets that collect cross-site browsing data.`,
  },
  {
    title: "Data Security",
    content: `We take reasonable measures to protect any information that passes through our infrastructure:
- All connections are encrypted via HTTPS
- We do not store user credentials or payment information
- Server access is restricted and protected

No method of electronic transmission or storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.`,
  },
  {
    title: "Children's Privacy",
    content: `FM26 Tactics is not directed at children under 13. We do not knowingly collect personal information from anyone under 13. If you believe a child has provided personal information through our site, please contact us and we will promptly remove it.`,
  },
  {
    title: "Your Rights",
    content: `Depending on your jurisdiction, you may have the right to:
- Access any personal data we hold about you
- Request correction or deletion of your data
- Object to or restrict processing of your data
- Data portability
- Withdraw consent at any time

To exercise any of these rights, contact us at the email address below.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.

Last updated: August 3, 2026.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background-primary pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Privacy <span className="gradient-text">Policy</span>
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Effective August 3, 2026
            </p>
          </div>
        </div>

        {/* Intro */}
        <p className="text-text-secondary text-sm leading-relaxed mb-10">
          At FM26 Tactics, your privacy matters. This policy explains what
          information we collect, how we use it, and what rights you have.
          We&apos;ve written it in plain English — no legal jargon.
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
              {section.title === "Your Rights" && (
                <ul className="text-text-secondary text-sm leading-relaxed space-y-1.5 pl-5 mt-3">
                  <li className="list-disc marker:text-text-muted">
                    Access any personal data we hold about you
                  </li>
                  <li className="list-disc marker:text-text-muted">
                    Request correction or deletion of your data
                  </li>
                  <li className="list-disc marker:text-text-muted">
                    Object to or restrict processing of your data
                  </li>
                  <li className="list-disc marker:text-text-muted">
                    Data portability
                  </li>
                  <li className="list-disc marker:text-text-muted">
                    Withdraw consent at any time
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="glass-panel p-6 mt-5 text-center">
          <h2 className="text-base font-semibold text-text-primary mb-2">
            Questions About This Policy?
          </h2>
          <p className="text-text-secondary text-sm">
            Contact us at{" "}
            <a
              href="mailto:uncleleofan@gmail.com"
              className="text-primary hover:underline"
            >
              uncleleofan@gmail.com
            </a>
          </p>
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
