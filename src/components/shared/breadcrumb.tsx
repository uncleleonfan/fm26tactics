import { Link } from "@/i18n/routing";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "./json-ld";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <>
      {/* Structured data */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: `https://www.fm26tactics.com${item.href}` } : {}),
          })),
        }}
      />

      {/* Visual breadcrumb */}
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center flex-wrap gap-1 text-sm">
          {items.map((item, i) => (
            <li key={item.href || item.label} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-text-muted shrink-0" />
              )}
              {i === items.length - 1 ? (
                <span className="text-text-primary font-medium">{item.label}</span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-text-muted hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-text-primary font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
