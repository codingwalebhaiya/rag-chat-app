import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroSection from "@/components/home/Hero";
import SocialSection from "@/components/home/Social-Proof";
import FeatureSection from "@/components/home/Feature";
import FAQSection from "@/components/home/FAQ";
import TestimonialSection from "@/components/home/Testimonials";
import PricingSection from "@/components/home/Pricing";

export default function Home() {
  return (
    <main className="pt-24 mx-auto w-[calc(100%-32px)]  max-w-[1200px]">
      <Navbar />
      <HeroSection />
      <SocialSection/>
      <FeatureSection/>
      <TestimonialSection/>
      <PricingSection/>
      <FAQSection/>
      
      <Footer />
    </main>
  );
}
