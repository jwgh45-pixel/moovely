import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import PopularComparisons from "@/components/PopularComparisons";
import WhyDifferent from "@/components/WhyDifferent";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PopularComparisons />
      <HowItWorks />
      <WhyDifferent />
    </>
  );
}
