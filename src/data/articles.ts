export interface Article {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: number;
  category: "guides" | "data" | "opinion";
  featured?: boolean;
}

export const articles: Article[] = [
  {
    slug: "top-10-places-to-move-from-london",
    title: "Top 10 Places to Move From London (By Real Disposable Income)",
    description:
      "We crunched the numbers on every major UK city. Here are the 10 where you'd genuinely be better off after tax, rent, and all the boring stuff.",
    publishedAt: "2026-02-21",
    readingTime: 6,
    category: "data",
    featured: true,
  },
  {
    slug: "cheapest-places-to-live-uk",
    title: "The Cheapest Places to Live in the UK (That Aren't Rubbish)",
    description:
      "Low cost of living is great, but only if there's actually a life to live. We found the sweet spot between affordable and actually decent.",
    publishedAt: "2026-02-21",
    readingTime: 7,
    category: "data",
    featured: true,
  },
  {
    slug: "is-it-cheaper-up-north",
    title: "Is It Actually Cheaper Up North? We Did the Maths",
    description:
      "Everyone says the North is cheaper. But when you factor in salaries, tax, and everything else - is it really? The answer surprised us.",
    publishedAt: "2026-02-21",
    readingTime: 5,
    category: "opinion",
  },
  {
    slug: "real-wages-explained",
    title: "What Are Real Wages? (And Why They Matter More Than Salary)",
    description:
      "Your salary is just a number. What you keep after tax, rent, and bills is what actually matters. Here's how to think about it properly.",
    publishedAt: "2026-02-21",
    readingTime: 4,
    category: "guides",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
