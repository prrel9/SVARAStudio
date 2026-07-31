export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FAQS: FAQ[] = [
  {
    id: "1",
    category: "Booking",
    question: "How do I make a booking?",
    answer:
      "Simply browse our studios, select your preferred room, pick a date and time from the available schedule, and confirm your booking. You will receive an instant confirmation.",
  },
  {
    id: "2",
    category: "Booking",
    question: "Can I book on the same day?",
    answer:
      "Yes, same-day bookings are available as long as the time slot is still open. We recommend booking at least a few hours in advance to secure your preferred time.",
  },
  {
    id: "3",
    category: "Cancellation",
    question: "What is your cancellation policy?",
    answer:
      "You may cancel or reschedule up to 2 hours before your session starts with no charge. Late cancellations may be subject to a partial fee.",
  },
  {
    id: "4",
    category: "Facilities",
    question: "Is parking available?",
    answer:
      "Yes, we have dedicated parking space for customers. Motorcycle and car parking are both available at no extra cost during your session.",
  },
  {
    id: "5",
    category: "Equipment",
    question: "Can I bring my own equipment?",
    answer:
      "Absolutely. You are welcome to bring your own guitar, pedals, or accessories. Our rooms are fully compatible with external gear.",
  },
  {
    id: "6",
    category: "Payment",
    question: "What payment methods do you accept?",
    answer:
      "We currently accept cash on-site and bank transfer. Online payment integration is coming soon.",
  },
];
