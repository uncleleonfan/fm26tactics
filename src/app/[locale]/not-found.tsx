import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background-primary flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
        <h2 className="text-xl text-text-secondary mb-6">
          Page not found
        </h2>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
