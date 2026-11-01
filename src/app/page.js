import CategoryBrowser from "@/components/category-browser";
import GuaranteeSection from "@/components/guarantee-section";
import Hero from "@/components/hero";
import HostCta from "@/components/host-cta";
import HowItWorks from "@/components/how-it-works";

export default function Home() {
  return (
    <main>
      <Hero />
      <CategoryBrowser />
      <HowItWorks />
      <GuaranteeSection />
      <HostCta />
    </main>
  );
}
