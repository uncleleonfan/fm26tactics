// Root layout — minimal pass-through.
// Actual layout is in [locale]/layout.tsx (required by next-intl for locale-aware <html lang>)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
