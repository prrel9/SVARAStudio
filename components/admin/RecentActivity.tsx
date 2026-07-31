import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
} from "lucide-react";
import { formatIDR } from "@/lib/data/schedule";
import type { RecentActivityItem } from "@/lib/services/analytics";

interface RecentActivityProps {
  items: RecentActivityItem[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-2xl border border-border-custom bg-surface p-6">
        <h3 className="text-base font-bold text-white tracking-tight mb-4">Recent Activity</h3>
        <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border-custom bg-bg-secondary/40 rounded-xl">
          <Clock className="h-8 w-8 text-text-secondary mb-2" />
          <p className="text-sm font-semibold text-white">No activity records yet</p>
          <p className="text-xs text-text-secondary">
            Booking creations and payment verification actions will appear here.
          </p>
        </div>
      </div>
    );
  }

  const getActivityBadge = (type: RecentActivityItem["type"]) => {
    switch (type) {
      case "payment_verified":
        return {
          icon: <CheckCircle className="h-4 w-4 text-success-custom" />,
          bgColor: "bg-success-custom/10 border-success-custom/30 text-success-custom",
          label: "Verified",
        };
      case "payment_submitted":
        return {
          icon: <Clock className="h-4 w-4 text-warning-custom animate-pulse" />,
          bgColor: "bg-warning-custom/10 border-warning-custom/30 text-warning-custom",
          label: "Submitted",
        };
      case "payment_rejected":
        return {
          icon: <XCircle className="h-4 w-4 text-error-custom" />,
          bgColor: "bg-error-custom/10 border-error-custom/30 text-error-custom",
          label: "Rejected",
        };
      case "booking_created":
      default:
        return {
          icon: <Calendar className="h-4 w-4 text-info-custom" />,
          bgColor: "bg-info-custom/10 border-info-custom/30 text-info-custom",
          label: "New Booking",
        };
    }
  };

  return (
    <div className="rounded-2xl border border-border-custom bg-surface p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Recent Activity Log</h3>
          <p className="text-xs text-text-secondary">Latest bookings and payment verification updates</p>
        </div>
        <span className="text-xs font-mono text-text-secondary">Top {items.length} events</span>
      </div>

      <div className="divide-y divide-border-custom/50 overflow-hidden rounded-xl border border-border-custom bg-bg-secondary/40">
        {items.map((item) => {
          const badge = getActivityBadge(item.type);
          const dateStr = item.timestamp
            ? new Date(item.timestamp).toLocaleString("id-ID", {
                dateStyle: "short",
                timeStyle: "short",
              })
            : "Recent";

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition-colors hover:bg-surface/80"
            >
              {/* Left Details */}
              <div className="flex items-start space-x-3">
                <div className={`mt-0.5 rounded-xl border p-2 shrink-0 ${badge.bgColor}`}>
                  {badge.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-extrabold text-white font-mono tracking-wider bg-surface border border-border-custom px-2 py-0.5 rounded-md">
                      {item.bookingCode}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider border px-2 py-0.5 rounded-full ${badge.bgColor}`}>
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs font-medium text-white flex items-center gap-1.5">
                    <User className="h-3 w-3 text-text-secondary" />
                    <span>{item.customerName}</span>
                    <span className="text-text-secondary">•</span>
                    <span className="text-text-secondary">{item.details}</span>
                  </p>
                </div>
              </div>

              {/* Right Side: Timestamp & Amount */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs font-mono shrink-0 pl-11 sm:pl-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border-custom/30">
                {item.amount > 0 && (
                  <span className="font-bold text-accent">{formatIDR(item.amount)}</span>
                )}
                <span className="text-[11px] text-text-secondary">{dateStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
