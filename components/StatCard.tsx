import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  accent?: "slate" | "emerald" | "amber" | "red" | "blue";
}

const accents = {
  slate: "bg-slate-100 text-slate-600",
  emerald: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  blue: "bg-blue-100 text-blue-700",
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "slate",
}: StatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="flex items-start justify-between gap-3">
        <span>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
          ) : null}
        </span>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accents[accent]}`}
        >
          <Icon className="h-5 w-5" />
        </span>
      </span>
    </article>
  );
}
