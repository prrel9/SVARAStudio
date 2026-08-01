import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StudioCard from "@/components/studio/StudioCard";
import { getStudios } from "@/lib/services/studios";

export const metadata = {
  title: "Jelajahi Studio | SVARA STUDIO",
  description: "Jelajahi enam studio latihan dengan peralatan profesional, pilihan ukuran, dan harga.",
};

export default async function StudiosPage() {
  const studios = await getStudios();
  return (
    <>
      <Navbar />

      <main className="flex-grow pt-28 pb-20 bg-background text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8 space-y-12">
          
          {/* Header */}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
              Our Rehearsal Rooms
            </h1>
            <p className="mt-4 text-base text-text-secondary leading-relaxed">
              Explore our six unique spaces designed for musicians of all levels. From beginner rehearsing to professional live recording.
            </p>
          </div>

          {/* Grid list of studios */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio.id} studio={studio} />
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
