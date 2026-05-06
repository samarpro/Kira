import type { ScheduleEntry, ScheduleKind } from "@/components/balance-bridge/calendar-month";
import { addDays, getEntryTimeRange, isoFromDate, startOfWeekMonday } from "@/utils/schedule-time";

export function entryDurationMinutes(e: ScheduleEntry): number {
    const r = getEntryTimeRange(e);
    return Math.max(0, r.end - r.start);
}

function eachIsoInRange(start: Date, end: Date): Set<string> {
    const set = new Set<string>();
    const d = new Date(start);
    d.setHours(0, 0, 0, 0);
    const endD = new Date(end);
    endD.setHours(0, 0, 0, 0);
    while (d.getTime() <= endD.getTime()) {
        set.add(isoFromDate(d));
        d.setDate(d.getDate() + 1);
    }
    return set;
}

/** Sum scheduled minutes for `kind` whose isoDate falls in [start, end] (local calendar days). */
export function minutesForKindInDateRange(entries: ScheduleEntry[], kind: ScheduleKind, start: Date, end: Date): number {
    const allowed = eachIsoInRange(start, end);
    let sum = 0;
    for (const e of entries) {
        if (e.kind !== kind) continue;
        if (!allowed.has(e.isoDate)) continue;
        sum += entryDurationMinutes(e);
    }
    return sum;
}

/** Rolling 14-day window ending on `ref` (inclusive). */
export function fortnightShiftMinutes(entries: ScheduleEntry[], ref = new Date()): number {
    const end = new Date(ref);
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 13);
    return minutesForKindInDateRange(entries, "shift", start, end);
}

/** ISO week starting Monday containing `ref`. */
export function calendarWeekKindMinutes(entries: ScheduleEntry[], kind: ScheduleKind, ref = new Date()): number {
    const ws = startOfWeekMonday(ref);
    const we = addDays(ws, 6);
    return minutesForKindInDateRange(entries, kind, ws, we);
}

export function formatMinutesAsHoursMinutes(total: number): string {
    const h = Math.floor(total / 60);
    const m = Math.round(total % 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
}

/** Lightweight estimate tied to study load so metrics stay internally consistent. */
export function estimatedWeekScreenMinutes(studyMinutesWeek: number): number {
    return Math.min(960, Math.round(studyMinutesWeek * 0.34 + 95));
}
