import { CalendarDays, Clock } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { JummahSession } from "@/types/mosque";

interface JummahDisplayProps {
  sessions?: JummahSession[];
  timeFormat?: "12h" | "24h";
  className?: string;
}

function getOrdinalLabel(sessionNumber: number): string {
  if (!sessionNumber || sessionNumber < 1) {
    return "Jummah";
  }

  const mod100 = sessionNumber % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${sessionNumber}th Jummah`;
  }

  switch (sessionNumber % 10) {
    case 1:
      return `${sessionNumber}st Jummah`;
    case 2:
      return `${sessionNumber}nd Jummah`;
    case 3:
      return `${sessionNumber}rd Jummah`;
    default:
      return `${sessionNumber}th Jummah`;
  }
}

export default function JummahDisplay({
  sessions = [],
  timeFormat = "12h",
  className,
}: JummahDisplayProps) {
  const enabledSessions = (sessions ?? [])
    .filter((session) => session.isEnabled)
    .sort((a, b) => a.sessionNumber - b.sessionNumber);

  if (enabledSessions.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center shadow-xs",
          className
        )}
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <CalendarDays className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-base font-medium text-foreground">
          Jummah schedule not available
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-xs",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Jummah Prayers</h3>
            <p className="text-xs text-muted-foreground">Friday congregational schedule</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {enabledSessions.length} {enabledSessions.length === 1 ? "Session" : "Sessions"}
        </span>
      </div>

      {/* Sessions List */}
      <div className="divide-y divide-border">
        {enabledSessions.map((session) => {
          const label = getOrdinalLabel(session.sessionNumber);

          return (
            <div
              key={session.id || session.sessionNumber}
              className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
            >
              {/* Session Info */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-md bg-secondary px-2.5 py-1 text-sm font-semibold text-secondary-foreground">
                    {label}
                  </span>
                </div>
                {session.note && (
                  <p className="text-xs text-muted-foreground">{session.note}</p>
                )}
              </div>

              {/* Timings */}
              <div className="flex items-center gap-3 sm:gap-4">
                {session.khutbahTime && (
                  <div className="rounded-lg bg-muted/50 px-3.5 py-2 text-center sm:min-w-[100px]">
                    <div className="flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      <span>Khutbah</span>
                    </div>
                    <span className="mt-0.5 block text-sm font-semibold text-foreground sm:text-base">
                      {formatTime(session.khutbahTime, timeFormat)}
                    </span>
                  </div>
                )}

                <div className="rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2 text-center sm:min-w-[110px]">
                  <div className="flex items-center justify-center gap-1 text-xs font-medium uppercase tracking-wider text-primary">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    <span>Jamaat</span>
                  </div>
                  <span className="mt-0.5 block text-base font-bold text-primary sm:text-lg">
                    {formatTime(session.jamaatTime, timeFormat)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
