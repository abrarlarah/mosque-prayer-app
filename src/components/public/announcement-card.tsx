import { Bell, Moon, Star, Clock, Calendar, AlertTriangle, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types/mosque";

interface AnnouncementCardProps {
  announcement: Announcement;
  className?: string;
}

interface TypeDetails {
  label: string;
  icon: LucideIcon;
  badgeClass: string;
}

const TYPE_CONFIG: Record<Announcement["type"], TypeDetails> = {
  general: {
    label: "General",
    icon: Bell,
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  ramadan: {
    label: "Ramadan",
    icon: Moon,
    badgeClass: "bg-primary/10 text-primary border-primary/20",
  },
  eid: {
    label: "Eid",
    icon: Star,
    badgeClass: "bg-accent/15 text-accent-foreground border-accent/30",
  },
  timing_change: {
    label: "Timing Change",
    icon: Clock,
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  event: {
    label: "Event",
    icon: Calendar,
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  },
  emergency: {
    label: "Emergency",
    icon: AlertTriangle,
    badgeClass: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

const PRIORITY_BORDER_CLASSES: Record<Announcement["priority"], string> = {
  urgent: "border-l-destructive",
  high: "border-l-amber-500",
  normal: "border-l-primary",
  low: "border-l-muted-foreground/30",
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "";

  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    if (monthIndex >= 0 && monthIndex < 12 && !isNaN(day)) {
      return `${months[monthIndex]} ${day}`;
    }
  }

  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? dateStr
    : new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(d);
}

function formatDateRange(startDate?: string | null, endDate?: string | null): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  if (start && end) {
    return start === end ? start : `${start} - ${end}`;
  }

  return start || end;
}

export default function AnnouncementCard({
  announcement,
  className,
}: AnnouncementCardProps) {
  const typeConfig = TYPE_CONFIG[announcement.type] ?? {
    label: "General",
    icon: Bell,
    badgeClass: "bg-muted text-muted-foreground border-border",
  };

  const Icon = typeConfig.icon;
  const priorityBorder = PRIORITY_BORDER_CLASSES[announcement.priority] ?? "border-l-primary";
  const dateRange = formatDateRange(announcement.startDate, announcement.endDate);

  return (
    <article
      className={cn(
        "rounded-xl border border-border border-l-4 bg-card p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm",
        priorityBorder,
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
            typeConfig.badgeClass
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{typeConfig.label}</span>
        </span>

        {dateRange && (
          <span className="text-xs font-medium text-muted-foreground">
            {dateRange}
          </span>
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
        {announcement.title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
        {announcement.message}
      </p>
    </article>
  );
}
