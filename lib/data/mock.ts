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
    question: "Bagaimana cara melakukan pemesanan?",
    answer:
      "Pilih studio yang Anda inginkan, tentukan tanggal dan jam dari jadwal yang tersedia, lalu konfirmasi pemesanan. Anda akan menerima konfirmasi secara langsung.",
  },
  {
    id: "2",
    category: "Booking",
    question: "Apakah saya bisa memesan untuk hari ini?",
    answer:
      "Bisa, selama slot waktu masih tersedia. Kami menyarankan pemesanan beberapa jam sebelumnya agar jadwal pilihan Anda lebih aman.",
  },
  {
    id: "3",
    category: "Cancellation",
    question: "Bagaimana kebijakan pembatalan?",
    answer:
      "Anda dapat membatalkan atau menjadwalkan ulang hingga 2 jam sebelum sesi dimulai tanpa biaya. Pembatalan mendadak dapat dikenakan biaya sebagian.",
  },
  {
    id: "4",
    category: "Facilities",
    question: "Apakah tersedia tempat parkir?",
    answer:
      "Ya, tersedia area parkir khusus pelanggan. Parkir motor dan mobil tersedia tanpa biaya tambahan selama sesi Anda.",
  },
  {
    id: "5",
    category: "Equipment",
    question: "Apakah saya boleh membawa peralatan sendiri?",
    answer:
      "Tentu. Anda boleh membawa gitar, pedal, atau aksesori sendiri. Ruangan kami kompatibel dengan peralatan tambahan dari luar.",
  },
  {
    id: "6",
    category: "Payment",
    question: "Metode pembayaran apa yang tersedia?",
    answer:
      "Saat ini kami menerima pembayaran tunai di lokasi dan transfer bank. Integrasi pembayaran online akan segera tersedia.",
  },
];
