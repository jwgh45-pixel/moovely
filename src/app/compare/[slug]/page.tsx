import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getLocationById, locations } from "@/data/locations";
import { compareLocations, formatCurrency } from "@/lib/calculations";
import ComparisonResults from "@/components/ComparisonResults";
import ComparisonSearch from "./ComparisonSearch";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseSlug(slug: string): { fromId: string; toId: string } | null {
  const match = slug.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  return { fromId: match[1], toId: match[2] };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Comparison Not Found - Moovely" };

  const from = getLocationById(parsed.fromId);
  const to = getLocationById(parsed.toId);
  if (!from || !to) return { title: "Comparison Not Found - Moovely" };

  const result = compareLocations(from, to);
  const amount = formatCurrency(Math.abs(result.totalAnnualDiff));
  const direction =
    result.verdict === "greener"
      ? "better off"
      : result.verdict === "not-greener"
      ? "worse off"
      : "about the same";

  return {
    title: `${from.name} vs ${to.name} - ${amount}/yr ${direction} | Moovely`,
    description: `Compare real wages between ${from.name} and ${to.name}. See the actual difference in disposable income after tax, rent, commute, and bills.`,
    openGraph: {
      title: `${from.name} vs ${to.name} - Is the grass greener?`,
      description: `You'd be ${amount}/year ${direction} in ${to.name} compared to ${from.name}. See the full breakdown on Moovely.`,
      url: `https://moovely.co/compare/${slug}`,
    },
  };
}

export function generateStaticParams() {
  // Pre-generate pages for popular comparisons
  const popular = [
    "london-average-vs-manchester",
    "london-average-vs-bristol",
    "london-average-vs-edinburgh",
    "london-average-vs-birmingham",
    "london-average-vs-leeds",
    "brighton-vs-bristol",
    "manchester-vs-leeds",
    "birmingham-vs-nottingham",
    "london-average-vs-cardiff",
    "cambridge-vs-york",
  ];

  return popular.map((slug) => ({ slug }));
}

export default async function ComparePage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  const from = getLocationById(parsed.fromId);
  const to = getLocationById(parsed.toId);
  if (!from || !to) notFound();

  const result = compareLocations(from, to);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Search bar at top for new comparisons */}
      <ComparisonSearch currentFrom={from} currentTo={to} />

      {/* Results */}
      <ComparisonResults result={result} />
    </div>
  );
}
