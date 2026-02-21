import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import PopularComparisons from "@/components/PopularComparisons";
import ExploreCTA from "@/components/ExploreCTA";
import WhyDifferent from "@/components/WhyDifferent";
import EmailCapture from "@/components/EmailCapture";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PopularComparisons />
      <ExploreCTA />
      <section className="max-w-4xl mx-auto px-4">
        <EmailCapture context="homepage" />
      </section>
      <HowItWorks />
      <WhyDifferent />
    </>
  );
}
