export interface Studio {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  pricePerHour: number;
  capacity: number;
  roomSize: string;
  equipmentLevel: "Starter" | "Standard" | "Professional" | "Premium" | "VIP";
  thumbnail: string;
  badge?: string;
  features: string[];
  isAvailable: boolean;
}

export interface Equipment {
  id: string;
  category: string;
  brand: string;
  model: string;
  shortDescription: string;
  availableIn: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  studioUsed: string;
}

export interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export type BookingStatus =
  | "pending_payment"
  | "waiting_verification"
  | "confirmed"
  | "rejected"
  | "expired"
  | "cancelled";

export type PaymentStatus = "waiting_verification" | "verified" | "rejected";

export interface Booking {
  id: string;
  bookingCode: string;
  studioId: string;
  bookingDate: string;       // YYYY-MM-DD
  startTime: string;         // "08:00"
  endTime: string;           // "10:00"
  durationHours: number;
  totalPrice: number;
  bookingStatus: BookingStatus;
  fullName: string;
  whatsapp: string;
  email?: string;
  notes?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  payment?: Payment;
}

export interface Payment {
  id: string;
  bookingId: string;
  proofUrl: string;
  paymentStatus: PaymentStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  booking?: Booking;
}
