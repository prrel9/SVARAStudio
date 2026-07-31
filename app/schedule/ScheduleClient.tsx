"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScheduleHeader from "@/components/schedule/ScheduleHeader";
import ScheduleFilter from "@/components/schedule/ScheduleFilter";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import ScheduleLegend from "@/components/schedule/ScheduleLegend";
import BookingSummary from "@/components/schedule/BookingSummary";
import {
  getDateString,
  buildScheduleForDate,
  type SelectedSlot,
  type BookedSlotRange,
} from "@/lib/data/schedule";
import { Studio } from "@/lib/types";

export default function ScheduleClient({ studios }: { studios: Studio[] }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getDateString(0));
  const [selectedStudioFilter, setSelectedStudioFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "available">("all");
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlotRange[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch real booked slots from API whenever selected date changes or window receives focus
  useEffect(() => {
    let active = true;
    const fetchBooked = () => {
      fetch(`/api/schedule/booked-slots?date=${selectedDate}`, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          if (active && Array.isArray(data)) {
            setBookedSlots(data);
          }
        })
        .catch(() => {});
    };

    fetchBooked();
    window.addEventListener("focus", fetchBooked);
    return () => {
      active = false;
      window.removeEventListener("focus", fetchBooked);
    };
  }, [selectedDate]);

  // Generate schedule data for the selected date merged with real DB bookings
  const scheduleData = useMemo(
    () => buildScheduleForDate(selectedDate, studios, bookedSlots),
    [selectedDate, studios, bookedSlots]
  );

  // Handle slot selection
  const handleSelectSlot = (
    studioId: string,
    studioName: string,
    hour: number,
    pricePerHour: number
  ) => {
    if (selectedSlot?.studioId === studioId && selectedSlot?.hour === hour) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot({ studioId, studioName, hour, pricePerHour });
    }
  };

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  // Navigate to booking page with slot info in URL params
  const handleContinue = (duration: number) => {
    if (!selectedSlot) return;
    const params = new URLSearchParams({
      studioId: selectedSlot.studioId,
      studioName: selectedSlot.studioName,
      date: selectedDate,
      hour: String(selectedSlot.hour),
      duration: String(duration),
      price: String(selectedSlot.pricePerHour),
    });
    router.push(`/booking?${params.toString()}`);
  };

  // GSAP Reveal Animation
  useEffect(() => {
    async function runAnimation() {
      const { gsap } = await import("gsap");
      if (!containerRef.current) return;
      const elements = containerRef.current.querySelectorAll(".animate-reveal");
      gsap.fromTo(
        elements,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.1,
          clearProps: "all",
        }
      );
    }
    runAnimation();
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-transparent min-h-screen" ref={containerRef}>
        <div className="animate-reveal">
          <ScheduleHeader />
        </div>

        <div className="animate-reveal">
          <ScheduleFilter
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedStudio={selectedStudioFilter}
            onSelectStudio={setSelectedStudioFilter}
            availabilityFilter={availabilityFilter}
            onSelectAvailability={setAvailabilityFilter}
            studios={studios}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-8 pb-24">
          <div className="flex flex-col lg:flex-row gap-8 items-start relative">

            {/* Left Column: Schedule Cards */}
            <div className="w-full lg:w-[65%] xl:w-[70%] space-y-6 animate-reveal">
              <div className="mb-2">
                <ScheduleLegend />
              </div>

              <div className="space-y-6">
                {scheduleData.map((schedule) => {
                  const studio = studios.find((s) => s.id === schedule.studioId);
                  if (!studio) return null;

                  if (selectedStudioFilter !== "all" && studio.id !== selectedStudioFilter) return null;

                  const hasAvailable = schedule.slots.some((s) => s.status === "available");
                  if (availabilityFilter === "available" && !hasAvailable) return null;

                  return (
                    <ScheduleCard
                      key={`${schedule.studioId}-${selectedDate}`}
                      studio={studio}
                      slots={schedule.slots}
                      selectedHour={
                        selectedSlot?.studioId === studio.id ? selectedSlot.hour : null
                      }
                      onSelectHour={(hour) =>
                        handleSelectSlot(studio.id, studio.name, hour, studio.pricePerHour)
                      }
                    />
                  );
                })}
              </div>
            </div>

            {/* Right Column: Booking Summary */}
            <div className="w-full lg:w-[35%] xl:w-[30%] animate-reveal">
              <BookingSummary
                selectedSlot={selectedSlot}
                selectedDate={selectedDate}
                onContinue={handleContinue}
              />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
