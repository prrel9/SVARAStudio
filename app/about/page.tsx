import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/sections/AboutHero";
import { getAppSettings } from "@/lib/services/appSettings";

export default async function AboutPage() {
  const settings = await getAppSettings();

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-background text-white">
        <AboutHero companyName={settings.company_name} logoUrl={settings.logo_url} />
      </main>
      <Footer />
    </>
  );
}
