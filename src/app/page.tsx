import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import PopularComparisons from "@/components/PopularComparisons";
import ExploreCTA from "@/components/ExploreCTA";
import WhyDifferent from "@/components/WhyDifferent";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PopularComparisons />
      <ExploreCTA />
      <HowItWorks />
      <WhyDifferent />
    </>
  );
}
