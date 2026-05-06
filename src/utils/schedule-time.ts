import type { ScheduleEntry, ScheduleKind } from "@/components/balance-bridge/calendar-month";

/** Visible planner range (local), 6:00–22:00 */
export const DAY_START_MIN = 6 * 60;
export const DAY_END_MIN = 22 * 60;

export function isoFromDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function startOfWeekMonday(d: Date): Date {
    const x = new Date(d);
    const dow = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - dow);
    x.setHours(0, 0, 0, 0);
    return x;
}

export function addDays(d: Date, n: number): Date {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}

export function defaultTimeRange(kind: ScheduleKind): { start: number; end: number } {
    switch (kind) {
        case "shift":
            return { start: 9 * 60 + 30, end: 17 * 60 };
        case "exam":
            return { start: 10 * 60, end: 13 * 60 };
        case "study":
            return { start: 14 * 60, end: 17 * 60 };
    }
}

/** Resolved timeline window for an entry (minutes from midnight). */
export function getEntryTimeRange(e: ScheduleEntry): { start: number; end: number } {
    const fb = defaultTimeRange(e.kind);
    if (e.startMinutes != null && e.durationMinutes != null) {
        return { start: e.startMinutes, end: e.startMinutes + e.durationMinutes };
    }
    if (e.startMinutes != null) {
        return { start: e.startMinutes, end: e.startMinutes + (fb.end - fb.start) };
    }
    if (e.durationMinutes != null) {
        return { start: fb.start, end: fb.start + e.durationMinutes };
    }
    return fb;
}

export function formatHm(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${String(m).padStart(2, "0")}`;
}
