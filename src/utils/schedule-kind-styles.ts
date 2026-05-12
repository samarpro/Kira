import type { ScheduleEntry, ScheduleKind } from "@/components/kira/calendar-month";

/** Saturated block styles for timeline / calendar (high contrast between kinds). */
export function scheduleEntryBlockClass(entry: Pick<ScheduleEntry, "completed" | "kind">): string {
    if (entry.completed) {
        return "bg-emerald-600 text-white ring-2 ring-emerald-950/35 shadow-md dark:bg-emerald-500";
    }
    switch (entry.kind) {
        case "shift":
            return "bg-violet-600 text-white ring-2 ring-violet-950/40 shadow-md dark:bg-violet-500";
        case "exam":
            return "bg-rose-500 text-white ring-2 ring-rose-950/45 shadow-md dark:bg-rose-500";
        case "study":
            return "bg-sky-500 text-white ring-2 ring-sky-950/35 shadow-md dark:bg-sky-400";
    }
}

export function scheduleKindDotClass(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return "inline-block size-1.5 rounded-full bg-violet-500 ring-1 ring-violet-950/30";
        case "exam":
            return "inline-block size-1.5 rounded-sm bg-rose-500 ring-1 ring-rose-950/30";
        case "study":
            return "inline-block size-1.5 rounded-full bg-sky-400 ring-1 ring-sky-950/25";
    }
}

export function scheduleKindLegendSwatchClass(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return "size-2 shrink-0 rounded-full bg-violet-500 ring-1 ring-secondary";
        case "exam":
            return "size-2 shrink-0 rounded-sm bg-rose-500 ring-1 ring-secondary";
        case "study":
            return "size-2 shrink-0 rounded-full bg-sky-400 ring-1 ring-secondary";
    }
}

export function scheduleKindPillClass(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return "bg-violet-600 text-white ring-1 ring-violet-900/40";
        case "exam":
            return "bg-rose-500 text-white ring-1 ring-rose-900/40";
        case "study":
            return "bg-sky-600 text-white ring-1 ring-sky-900/35 dark:bg-sky-500";
    }
}
