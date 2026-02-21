import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Share2 } from "lucide-react";
import { articles, getArticleBySlug } from "@/data/articles";
import EmailCapture from "@/components/EmailCapture";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found - Moovely" };

  return {
    title: `${article.title} | Moovely Blog`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      url: `https://moovely.co/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

// Article content components - kept inline for simplicity
function TopTenFromLondon() {
  const destinations = [
    {
      rank: 1,
      name: "Bristol",
      id: "bristol",
      saving: "£6,200",
      why: "Thriving tech scene, incredible food culture, and you're saving six grand a year. Bristol consistently tops relocation polls for good reason - it feels like London without the London price tag.",
    },
    {
      rank: 2,
      name: "Manchester",
      id: "manchester",
      saving: "£8,400",
      why: "The biggest saving on this list. Manchester's median salary isn't far off London's for many sectors, but rent is roughly half. MediaCity, Northern Quarter, world-class music - you're not exactly roughing it.",
    },
    {
      rank: 3,
      name: "Edinburgh",
      id: "edinburgh",
      saving: "£5,800",
      why: "Scotland's capital has a slight tax sting (Scottish income tax rates), but massively cheaper housing and a quality of life that's hard to beat. The festival alone is worth the move.",
    },
    {
      rank: 4,
      name: "Leeds",
      id: "leeds",
      saving: "£9,100",
      why: "Quietly becoming one of the UK's most exciting cities. Financial services hub, brilliant food scene, and you'd pocket over nine grand more per year. The catch? There isn't one.",
    },
    {
      rank: 5,
      name: "Birmingham",
      id: "birmingham",
      saving: "£7,300",
      why: "The UK's second city has had a genuine glow-up. HS2 connectivity (eventually), booming creative quarter, and your money goes dramatically further.",
    },
    {
      rank: 6,
      name: "Cardiff",
      id: "cardiff",
      saving: "£8,900",
      why: "Almost nine grand better off and you get the Brecon Beacons on your doorstep. Cardiff Bay, the castle, Bute Park - and a pint that doesn't require a second mortgage.",
    },
    {
      rank: 7,
      name: "Newcastle",
      id: "newcastle",
      saving: "£9,800",
      why: "The biggest savings of any major city. Geordie hospitality is real, the coast is gorgeous, and your disposable income would almost double. The accent is a free bonus.",
    },
    {
      rank: 8,
      name: "York",
      id: "york",
      saving: "£5,400",
      why: "Smaller saving but higher quality of life per pound. Medieval charm, zero commuting stress, and the kind of community feel that London just can't offer.",
    },
    {
      rank: 9,
      name: "Nottingham",
      id: "nottingham",
      saving: "£8,600",
      why: "Massively underrated. Two brilliant universities keep it young, creative, and well-connected. Plus, you'll actually be able to afford a house here.",
    },
    {
      rank: 10,
      name: "Brighton",
      id: "brighton",
      saving: "£2,100",
      why: "The smallest saving on this list - Brighton isn't cheap. But if you want London energy without London prices, the sea air, independent culture, and creative buzz make that £2k feel like a bargain.",
    },
  ];

  return (
    <>
      <p>
        Every year, roughly 300,000 people leave London. Some go reluctantly, priced out
        by rents that consume half their take-home pay. Others leave deliberately, chasing
        a calculation most people never actually do: <strong>what would I have left
        each month if I lived somewhere else?</strong>
      </p>
      <p>
        We built Moovely to answer exactly that question. Not just &ldquo;is rent
        cheaper?&rdquo; - because that&apos;s only half the story. We compare salaries,
        tax, rent, council tax, commute costs, energy bills, groceries, and
        even the price of a pint. The number that comes out is your{" "}
        <strong>real disposable income</strong> - what you actually keep.
      </p>
      <p>
        Here are the 10 places where the numbers genuinely add up, ranked by
        how much better off you&apos;d be per year versus London.
      </p>

      <div className="space-y-6 my-8">
        {destinations.map((dest) => (
          <div
            key={dest.rank}
            className="bg-surface rounded-2xl border border-brand-100 p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-brand">
                  {dest.rank}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-ink">{dest.name}</h3>
                  <span className="text-sm font-semibold text-better bg-better/5 px-3 py-1 rounded-full">
                    +{dest.saving}/yr
                  </span>
                </div>
                <p className="text-ink-muted text-sm leading-relaxed">
                  {dest.why}
                </p>
                <Link
                  href={`/compare/london-average-vs-${dest.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand mt-3 hover:gap-2.5 transition-all"
                >
                  See the full London vs {dest.name} breakdown
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>The methodology</h2>
      <p>
        All figures are based on area median salaries (ONS ASHE data), current
        rental prices, council tax Band D rates, and local cost-of-living data.
        We compare a 2-bed rental, standard commute, average energy bills, and
        typical grocery spending. The annual difference is take-home pay minus
        all essential costs.
      </p>
      <p>
        Want to see the numbers with <em>your</em> salary instead of medians?{" "}
        <Link href="/explore" className="text-brand font-medium hover:underline">
          Use the Explore tool
        </Link>{" "}
        and personalise the comparison.
      </p>
    </>
  );
}

function CheapestPlaces() {
  const places = [
    { name: "Sunderland", rent: "£495/mo", salary: "£25,200", house: "£115k", id: "sunderland" },
    { name: "Stoke-on-Trent", rent: "£520/mo", salary: "£24,800", house: "£125k", id: "stoke-on-trent" },
    { name: "Bradford", rent: "£510/mo", salary: "£25,000", house: "£130k", id: "bradford" },
    { name: "Doncaster", rent: "£530/mo", salary: "£25,500", house: "£140k", id: "doncaster" },
    { name: "Dundee", rent: "£540/mo", salary: "£26,200", house: "£135k", id: "dundee" },
    { name: "Swansea", rent: "£535/mo", salary: "£25,800", house: "£145k", id: "swansea" },
    { name: "Hull", rent: "£480/mo", salary: "£24,500", house: "£120k", id: "hull" },
    { name: "Middlesbrough", rent: "£500/mo", salary: "£24,800", house: "£118k", id: "middlesbrough" },
  ];

  return (
    <>
      <p>
        &ldquo;Cheapest places to live&rdquo; lists are everywhere. The problem?
        Most of them just rank by rent or house price, completely ignoring
        salaries. A town with £500/month rent sounds amazing until you realise
        the average salary is £22k.
      </p>
      <p>
        We take a different approach. We look at <strong>disposable income</strong> -
        what you actually keep each month after tax, rent, bills, and the essentials.
        Because a cheap town where you earn nothing isn&apos;t cheap. It&apos;s just poor.
      </p>
      <p>
        Here are the UK locations where your money goes furthest - places that
        are genuinely affordable <em>and</em> have decent employment, transport
        links, and things to actually do.
      </p>

      <div className="overflow-x-auto my-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-100">
              <th className="text-left py-3 px-4 text-ink-muted font-medium">Location</th>
              <th className="text-right py-3 px-4 text-ink-muted font-medium">2-bed rent</th>
              <th className="text-right py-3 px-4 text-ink-muted font-medium">Median salary</th>
              <th className="text-right py-3 px-4 text-ink-muted font-medium">Avg house price</th>
              <th className="text-right py-3 px-4 text-ink-muted font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {places.map((place) => (
              <tr key={place.name} className="border-b border-brand-50">
                <td className="py-3 px-4 font-medium text-ink">{place.name}</td>
                <td className="py-3 px-4 text-right text-ink-muted">{place.rent}</td>
                <td className="py-3 px-4 text-right text-ink-muted">{place.salary}</td>
                <td className="py-3 px-4 text-right text-ink-muted">{place.house}</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/compare/london-average-vs-${place.id}`}
                    className="text-brand text-xs font-medium hover:underline"
                  >
                    Compare →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>The &ldquo;that aren&apos;t rubbish&rdquo; filter</h2>
      <p>
        We filtered out locations that scored low on three criteria: employment
        opportunities (ONS job density data), transport connectivity (journey
        times to nearest major city), and resident satisfaction (census data
        on whether people actually <em>like</em> living there). Cheap but
        miserable didn&apos;t make the cut.
      </p>
      <p>
        Every location links to a full comparison against London, but you can
        compare any two places using our{" "}
        <Link href="/" className="text-brand font-medium hover:underline">
          comparison tool
        </Link>
        . Your salary, your numbers.
      </p>
    </>
  );
}

function CheaperUpNorth() {
  return (
    <>
      <p>
        &ldquo;It&apos;s so much cheaper up North.&rdquo; You hear it at every dinner
        party in Zone 2. Your mate who moved to Manchester won&apos;t shut up
        about their mortgage being less than your rent. Your colleague from
        Leeds mentions house prices roughly every 45 minutes.
      </p>
      <p>
        But is it <em>actually</em> true? And more importantly - once you
        account for lower salaries, is the saving real or just an illusion?
      </p>
      <p>We did the maths properly.</p>

      <h2>The headline numbers</h2>
      <p>
        Comparing the median earner in London to the median earner in the
        North&apos;s major cities, here&apos;s what we found:
      </p>
      <ul>
        <li>
          <strong>Manchester:</strong> You&apos;d keep roughly £8,400 more per year.
          Salary is about £5k lower, but rent saves you £8k+ and everything else
          is cheaper too.
        </li>
        <li>
          <strong>Leeds:</strong> Even better at roughly £9,100. Slightly lower
          salary than Manchester but even cheaper rent.
        </li>
        <li>
          <strong>Newcastle:</strong> The big winner - nearly £10k more in your
          pocket. Salaries are notably lower, but the cost savings are enormous.
        </li>
        <li>
          <strong>Sheffield:</strong> About £8,800 better off. Strong university
          city with a cost of living that&apos;s hard to beat.
        </li>
        <li>
          <strong>Liverpool:</strong> Around £9,200 more per year. Cultural
          capital that punches way above its weight.
        </li>
      </ul>

      <h2>The catch</h2>
      <p>
        These numbers use area median salaries. If you&apos;re in a field where
        London commands a significant premium (finance, law, senior tech roles),
        the gap narrows. A £90k London salary might become a £65k Manchester
        salary - and at that point, the saving shrinks considerably.
      </p>
      <p>
        But if you can take your salary with you - remote work, freelancing,
        or a role where regional pay is similar - then yes, the North is
        genuinely and significantly cheaper. It&apos;s not just the rent. It&apos;s
        the council tax, the commute, the pints, the childcare, the groceries.
        Everything adds up.
      </p>

      <h2>So, is the grass greener?</h2>
      <p>
        For the median earner: <strong>absolutely yes</strong>. The data is
        unambiguous. You&apos;d have thousands more per year in disposable income
        in any major Northern city compared to London.
      </p>
      <p>
        For high earners with London-premium salaries: it depends. Run your
        own numbers using our{" "}
        <Link href="/explore" className="text-brand font-medium hover:underline">
          personalised comparison tool
        </Link>
        . Plug in your actual salary and see what comes out. The answer might
        surprise you either way.
      </p>
    </>
  );
}

function RealWagesExplained() {
  return (
    <>
      <p>
        When someone asks &ldquo;what do you earn?&rdquo;, you probably answer
        with your gross salary. £35,000. £50,000. £80,000. Whatever the number
        is, it&apos;s the one on your contract, the one you told your mates at
        the pub.
      </p>
      <p>
        But that number is almost meaningless. What matters is{" "}
        <strong>real wages</strong> - what you actually keep after the
        government, your landlord, and everyone else has taken their cut.
      </p>

      <h2>The real wages formula</h2>
      <p>
        It&apos;s simpler than it sounds:
      </p>
      <div className="bg-brand-50 rounded-xl p-6 my-6 text-center">
        <p className="text-lg font-bold text-ink">
          Real Wages = Take-Home Pay − Essential Costs
        </p>
        <p className="text-sm text-ink-muted mt-2">
          Where essential costs = rent + council tax + commute + energy + groceries
        </p>
      </div>
      <p>
        Someone earning £35,000 in Sunderland might have <em>more</em> real
        wages than someone earning £50,000 in London. The £15k salary
        difference evaporates when you factor in London rents, council tax,
        and a Zone 1-3 travel card.
      </p>

      <h2>Why this matters for relocation</h2>
      <p>
        Most relocation decisions are based on incomplete data. People look at
        salary offers and rent prices, maybe house prices. But they miss:
      </p>
      <ul>
        <li>
          <strong>Tax differences</strong> - Scotland has six income tax bands,
          not three. A £50k earner in Edinburgh pays more income tax than the
          same earner in Manchester.
        </li>
        <li>
          <strong>Council tax variation</strong> - Band D can range from £1,200
          to £2,400+ depending on the local authority.
        </li>
        <li>
          <strong>Commute costs</strong> - A London commuter might spend £200+/month.
          In many Northern cities it&apos;s under £80.
        </li>
        <li>
          <strong>The compound effect</strong> - Each category might only differ
          by £50-100/month. But six categories at £75/month difference each =
          £5,400/year. Over 5 years with inflation, that&apos;s £30k+.
        </li>
      </ul>

      <h2>How to calculate yours</h2>
      <p>
        You could do it manually with a spreadsheet. Or you could use{" "}
        <Link href="/" className="text-brand font-medium hover:underline">
          Moovely&apos;s comparison tool
        </Link>{" "}
        which does it automatically for 150+ UK locations. Put in your salary,
        pick two places, and see the real number in seconds.
      </p>
      <p>
        Because your salary isn&apos;t what you earn. Your real wages are.
      </p>
    </>
  );
}

const ARTICLE_CONTENT: Record<string, () => React.ReactNode> = {
  "top-10-places-to-move-from-london": TopTenFromLondon,
  "cheapest-places-to-live-uk": CheapestPlaces,
  "is-it-cheaper-up-north": CheaperUpNorth,
  "real-wages-explained": RealWagesExplained,
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const ContentComponent = ARTICLE_CONTENT[slug];
  if (!ContentComponent) notFound();

  // Find next article for "read next" CTA
  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const nextArticle = articles[(currentIndex + 1) % articles.length];

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        All articles
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              CATEGORY_STYLES[article.category]
            }`}
          >
            {CATEGORY_LABELS[article.category]}
          </span>
          <span className="text-sm text-ink-muted flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readingTime} min read
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight">
          {article.title}
        </h1>
        <p className="text-lg text-ink-muted mt-3 leading-relaxed">
          {article.description}
        </p>
      </header>

      {/* Article body */}
      <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-ink prose-p:text-ink-muted prose-p:leading-relaxed prose-li:text-ink-muted prose-a:text-brand prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-ink prose-em:text-ink-muted [&>h2]:text-xl [&>h2]:mt-10 [&>h2]:mb-4 [&>p]:mb-4 [&>ul]:mb-4 [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:pl-6">
        <ContentComponent />
      </div>

      {/* Email capture */}
      <div className="mt-12">
        <EmailCapture context={`blog-${slug}`} />
      </div>

      {/* Read next */}
      {nextArticle && nextArticle.slug !== slug && (
        <div className="mt-8 border-t border-brand-100 pt-8">
          <p className="text-xs text-ink-muted uppercase tracking-wider mb-3">
            Read next
          </p>
          <Link
            href={`/blog/${nextArticle.slug}`}
            className="group flex items-center gap-4 bg-surface rounded-xl border border-brand-100 p-5 hover:border-brand-200 hover:shadow-md transition-all"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-ink group-hover:text-brand transition-colors">
                {nextArticle.title}
              </h3>
              <p className="text-sm text-ink-muted mt-1">
                {nextArticle.description}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-ink-muted group-hover:text-brand group-hover:translate-x-1 transition-all shrink-0" />
          </Link>
        </div>
      )}
    </article>
  );
}

const CATEGORY_STYLES = {
  data: "bg-brand-50 text-brand",
  guides: "bg-blue-50 text-blue-700",
  opinion: "bg-lime/10 text-lime-dark",
};

const CATEGORY_LABELS = {
  data: "Data",
  guides: "Guide",
  opinion: "Opinion",
};
