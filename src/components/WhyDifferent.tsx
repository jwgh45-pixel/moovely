import { ShieldCheck, BarChart3, Heart, Zap } from "lucide-react";

export default function WhyDifferent() {
  const points = [
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Real Wages, Not Raw Costs",
      description:
        "Everyone else shows you prices. We show you what you actually have left after salary, tax, rent, and bills. That's the number that matters.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Government Data, Not Guesswork",
      description:
        "Our data comes from ONS, HMRC, and local authorities. Not from random internet strangers submitting whatever they like.",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Honest, Even When It Hurts",
      description:
        'If the grass isn\'t greener, we\'ll tell you. No spin, no agenda. Just the truth about what your money is worth.',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Built for Real Decisions",
      description:
        "This isn't an academic exercise. It's for people actually thinking about moving. Every feature is designed around that decision.",
    },
  ];

  return (
    <section id="about" className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold text-charcoal mb-2 text-center">
        Why Moovely Is Different
      </h2>
      <p className="text-charcoal-muted text-center mb-10">
        We built the tool we wished existed when we were deciding where to live.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {points.map((point, i) => (
          <div
            key={i}
            className="flex gap-4 p-5 rounded-2xl bg-white border border-grass-100"
          >
            <div className="w-10 h-10 rounded-xl bg-grass-50 text-grass flex items-center justify-center shrink-0">
              {point.icon}
            </div>
            <div>
              <h3 className="font-semibold text-charcoal mb-1">
                {point.title}
              </h3>
              <p className="text-sm text-charcoal-muted leading-relaxed">
                {point.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
