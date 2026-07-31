import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StudioHero from "@/components/studio/StudioHero";
import StudioInfo from "@/components/studio/StudioInfo";
import StudioEquipment from "@/components/studio/StudioEquipment";
import StudioFacilities from "@/components/studio/StudioFacilities";
import StudioGallery from "@/components/studio/StudioGallery";
import StudioPricing from "@/components/studio/StudioPricing";
import { getStudioBySlug, getStudioSlugs } from "@/lib/services/studios";

interface StudioDetailPageProps {
  params: Promise<{ slug: string }>;
}

// Generate dynamic metadata for search engine indexing
export async function generateMetadata({
  params,
}: StudioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const studio = await getStudioBySlug(slug);

  if (!studio) {
    return {
      title: "Studio Not Found",
    };
  }

  return {
    title: `${studio.name} | SVARA STUDIO`,
    description: studio.shortDescription,
    openGraph: {
      title: `${studio.name} Rehearsal Space`,
      description: studio.shortDescription,
      images: [{ url: studio.thumbnail }],
    },
  };
}

// Statically generate studio routes to allow fast static builds
export async function generateStaticParams() {
  const slugs = await getStudioSlugs();
  return slugs.map((studio) => ({
    slug: studio.slug,
  }));
}

export default async function StudioDetailPage({ params }: StudioDetailPageProps) {
  const { slug } = await params;
  const studio = await getStudioBySlug(slug);

  // Trigger 404 if studio slug is not found in database
  if (!studio) {
    notFound();
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-background pb-20">
        {/* Dynamic Studio Hero banner */}
        <StudioHero studio={studio} />

        {/* Core Layout Grid */}
        <div className="mx-auto max-w-7xl px-6 md:px-8 mt-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Left Content Area (Specs, Gear list, Gallery, Facilities) */}
            <div className="lg:col-span-2 space-y-12">
              {/* Studio Description & Specifications */}
              <StudioInfo studio={studio} />
              
              {/* Equipment list dependent on Studio equipment level */}
              <StudioEquipment studio={studio} />
              
              {/* Dynamic Facilities list */}
              <StudioFacilities studio={studio} />
              
              {/* Lazy-loaded Dynamic Image Gallery */}
              <StudioGallery studioId={studio.id} studioName={studio.name} />
              
            </div>

            {/* Right Sticky Sidebar (Pricing & Action CTAs) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <StudioPricing studio={studio} />
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
