import { STATUS_LABELS } from "@/lib/inventory";
import type { StockStatus } from "@/lib/types";

const styles: Record<StockStatus, string> = {
  ok: "bg-emerald-100 text-emerald-800 ring-emerald-600/20",
  attention: "bg-amber-100 text-amber-900 ring-amber-600/20",
  urgent: "bg-red-100 text-red-800 ring-red-600/20",
};

const dots: Record<StockStatus, string> = {
  ok: "bg-emerald-500",
  attention: "bg-amber-500",
  urgent: "bg-red-500",
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const { label } = STATUS_LABELS[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status]}`} />
      {label}
    </span>
  );
}
