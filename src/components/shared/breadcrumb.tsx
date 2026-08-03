import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/shared/json-ld";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

function getBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `https://fm26tactics.com${item.href}` : undefined,
    })),
  };
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <>
      <JsonLd data={getBreadcrumbJsonLd(items)} />
      <nav className={cn("flex items-center gap-1.5 text-sm", className)} aria-label="Breadcrumb">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-text-muted" aria-hidden="true" />}
            {item.href ? (
              <Link
                href={item.href}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
