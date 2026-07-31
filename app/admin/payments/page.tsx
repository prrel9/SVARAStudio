import { getPaymentsPendingVerification } from "@/lib/services/payments";
import PaymentsAdminClient from "./PaymentsAdminClient";

export const metadata = {
  title: "Payment Verification | SVARA STUDIO Admin",
  description: "Admin — verify or reject customer payment proofs.",
};

// Disable caching so admin always sees fresh data
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const payments = await getPaymentsPendingVerification();
  return <PaymentsAdminClient initialPayments={payments} />;
}
