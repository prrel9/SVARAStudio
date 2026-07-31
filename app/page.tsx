import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import StudioPreviewSection from "@/components/sections/StudioPreviewSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import StudiosSection from "@/components/sections/StudiosSection";
import EquipmentSection from "@/components/sections/EquipmentSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import FAQSection from "@/components/sections/FAQSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import IntroSplash from "@/components/IntroSplash";
import { getStudios } from "@/lib/services/studios";
import { getEquipments } from "@/lib/services/equipments";
import { getReviews } from "@/lib/services/reviews";

export default async function Home() {
  const studios = await getStudios();
  const equipments = await getEquipments();
  const testimonials = await getReviews();
  return (
    <>
      <IntroSplash />

      {/* Navbar (fixed at top) */}
      <Navbar />

      {/* Main content sections in order */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. Why Choose Us */}
        <WhyChooseUsSection />

        {/* 3. Our Studios (6 Studio Cards) */}
        <StudiosSection studios={studios} />

        {/* 4. Interactive 3D Studio Preview */}
        <StudioPreviewSection />

        {/* 5. Equipment Showcase */}
        <EquipmentSection equipments={equipments} />

        {/* 6. Testimonials */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 7. FAQ */}
        <FAQSection />

        {/* 8. Contact & Location Map */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
