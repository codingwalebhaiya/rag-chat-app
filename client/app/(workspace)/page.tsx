import HeroSection from "@/components/home/Hero";
import SocialSection from "@/components/home/Social-Proof";
import FeatureSection from "@/components/home/Feature";
import TestimonialSection from "@/components/home/Testimonials";
import PricingSection from "@/components/home/Pricing";
import FAQSection from "@/components/home/FAQ";
import Footer from "@/components/common/Footer";

export default function Home() {
  return (
    <main className="pt-24 mx-auto w-[calc(100%-32px)]  max-w-[1200px] relative">
      <HeroSection />
      <SocialSection />
      <FeatureSection />
      <TestimonialSection />
      <PricingSection />
      <FAQSection />
      <Footer />
     
    </main>
  );
}