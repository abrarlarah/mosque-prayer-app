"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveClockProps {
  timezone?: string;
  format?: "12h" | "24h";
  showSeconds?: boolean;
  showIcon?: boolean;
  className?: string;
  label?: string;
  variant?: "badge" | "display" | "minimal";
}

export default function LiveClock({
  timezone = "Asia/Kolkata",
  format = "12h",
  showSeconds = true,
  showIcon = true,
  className,
  label = "Current Time",
  variant = "badge",
}: LiveClockProps) {
  const [timeStr, setTimeStr] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const now = new Date();
      if (format === "24h") {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: showSeconds ? "2-digit" : undefined,
          hour12: false,
        });
        setTimeStr(formatter.format(now));
        setPeriod("");
      } else {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "numeric",
          minute: "2-digit",
          second: showSeconds ? "2-digit" : undefined,
          hour12: true,
        });
        const formatted = formatter.format(now);
        // Split time and AM/PM
        const parts = formatted.split(" ");
        setTimeStr(parts[0]);
        setPeriod(parts[1] || "");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone, format, showSeconds]);

  if (!mounted) {
    return (
      <div className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}>
        {showIcon && <Clock className="w-4 h-4 animate-spin text-primary" />}
        <span className="font-mono text-sm">--:--:--</span>
      </div>
    );
  }

  if (variant === "display") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-primary/30 bg-primary/10 px-5 py-3 text-center shadow-inner",
          className
        )}
      >
        {label && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>{label}</span>
          </div>
        )}
        <div className="font-mono font-extrabold tracking-wider text-foreground text-3xl sm:text-4xl flex items-baseline justify-center gap-1.5">
          <span>{timeStr}</span>
          {period && (
            <span className="text-sm sm:text-base font-bold text-primary font-sans">
              {period}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <span className={cn("inline-flex items-center gap-1.5 font-mono font-bold text-foreground", className)}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-primary" />}
        <span>{timeStr}</span>
        {period && <span className="text-xs text-muted-foreground font-sans">{period}</span>}
      </span>
    );
  }

  // Default: "badge" variant
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card/90 shadow-xs",
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {showIcon && <Clock className="w-3.5 h-3.5 text-primary" />}
        <span>{label}:</span>
      </div>
      <div className="font-mono font-bold text-sm text-foreground flex items-baseline gap-1">
        <span>{timeStr}</span>
        {period && (
          <span className="text-[10px] font-bold text-primary uppercase">
            {period}
          </span>
        )}
      </div>
    </div>
  );
}
