import Link from "next/link";
import CowMascot from "@/components/CowMascot";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <CowMascot verdict="not-greener" size="lg" className="mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-charcoal mb-3">
        Moo-ve along, nothing to see here
      </h1>
      <p className="text-charcoal-muted mb-8">
        We couldn&apos;t find that comparison. Maybe the locations don&apos;t
        exist in our database yet, or the URL got a bit mangled.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-grass text-white rounded-xl hover:bg-grass-dark transition-colors font-medium"
      >
        Back to Home
      </Link>
    </div>
  );
}
