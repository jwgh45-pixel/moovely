import { MapPin, Calculator, Lightbulb } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Pick Two Places",
      description:
        'Choose where you live now and where you\'re thinking of moving. Type any city or town - we\'ve got 150+ locations across the UK.',
    },
    {
      icon: <Calculator className="w-6 h-6" />,
      title: "We Crunch the Numbers",
      description:
        "We pull real government data - median salaries, actual rent prices, tax rates, council tax, commute costs, and more. No crowdsourced guesswork.",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "See the Truth",
      description:
        'One clear number: how much better or worse off you\'d be, per year. Plus a full breakdown of where the money goes. Then you decide.',
    },
  ];

  return (
    <section id="how-it-works" className="bg-brand-50/50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-ink mb-2 text-center">
          How It Works
        </h2>
        <p className="text-ink-muted text-center mb-10">
          Three steps. Thirty seconds. A decision that could change your life.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-brand text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-semibold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
