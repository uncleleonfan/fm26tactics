import type { Metadata } from "next";
import { generateSEO } from "@/lib/metadata";
import { JsonLd } from "@/components/shared/json-ld";

export const metadata: Metadata = generateSEO({
  title: "FM26 Tactic Builder — Create Custom Formations & Export",
  description:
    "Design your perfect FM26 tactic with our free interactive builder. Drag players, assign roles and duties, set team instructions, and export your custom formation for Football Manager 2026.",
  path: "/builder",
});

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
    </>
  );
}
