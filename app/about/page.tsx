import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { Music, ArrowLeft } from "lucide-react";

export default function AboutPlaceholder() {
  return (
    <>
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-28 pb-16 bg-background text-white">
        <div className="mx-auto max-w-md px-6 text-center space-y-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Music className="h-8 w-8" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">
              About Svara Studio
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed">
              SVARA STUDIO is a modern creative home for musicians. We build professional facilities, curate high-fidelity equipment, and automate scheduling so you can focus entirely on creating music.
            </p>
          </div>

          <div className="pt-4">
            <Link href="/" className="inline-block">
              <Button variant="outline" size="md">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
