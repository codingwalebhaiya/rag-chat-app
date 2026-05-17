
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import TrustedBy from "@/components/home/TrustedBy";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import UseCases from "@/components/home/UseCases";
import DemoPreview from "@/components/home/DemoPreview";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import Footer from "@/components/common/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground"  >

      <Navbar />

      <Hero />

      <TrustedBy />

      <Features />

      <HowItWorks />

      <UseCases />

      <DemoPreview />

      <Pricing />

      <Testimonials />

      <FAQ />

      <CTA />

      <Footer />
      </main>
  )

}