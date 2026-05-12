import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "@untitledui/icons";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import type { ScheduleEntry, ScheduleKind } from "@/components/kira/calendar-month";
import { DayScheduleTimeline } from "@/components/kira/day-schedule-timeline";
import { ScheduleEntryEditModal } from "@/components/kira/schedule-entry-modal";
import { MOCK_EVENTS } from "@/data/mock-events";
import { useCollisionGuardedAdd } from "@/hooks/use-collision-guarded-add";
import { useKiraStore } from "@/stores/kira-store";
import {
    calendarWeekKindMinutes,
    formatMinutesAsHoursMinutes,
    fortnightShiftMinutes,
} from "@/utils/schedule-aggregates";
import { effectiveDeadlineIso, sortedIncompleteByAttention } from "@/utils/next-schedule-action";
import { isoFromDate } from "@/utils/schedule-time";
import { scheduleKindPillClass } from "@/utils/schedule-kind-styles";
import { cx } from "@/utils/cx";
import { t, tWellbeingWelcome } from "@/i18n/strings";

interface DashboardPanelProps {
    onOpenTab: (tab: string) => void;
}

const statsCardClass = cx(
    "relative overflow-hidden rounded-2xl border border-brand-secondary/40 p-6 shadow-lg",
    "bg-gradient-to-br from-brand-primary from-[28%] via-primary_alt to-emerald-50/40",
    "ring-1 ring-brand-secondary/25",
    "dark:border-brand-secondary/35 dark:from-brand-950/55 dark:via-primary_alt dark:to-primary_alt dark:ring-brand-secondary/20",
);

function formatIsoShort(iso: string): string {
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return iso;
    return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function priorityBadgeColor(priority: ScheduleEntry["priority"]): "error" | "warning" | "gray" {
    switch (priority) {
        case "high":
            return "error";
        case "medium":
            return "warning";
        default:
            return "gray";
    }
}

function entryKindLabel(kind: ScheduleKind): string {
    switch (kind) {
        case "shift":
            return t("calendar.legend.shift");
        case "exam":
            return t("calendar.legend.exam");
        case "study":
            return t("calendar.legend.study");
    }
}

function priorityLabel(priority: ScheduleEntry["priority"]): string {
    switch (priority) {
        case "high":
            return t("badges.priority.high");
        case "medium":
            return t("badges.priority.medium");
        case "low":
            return t("badges.priority.low");
    }
}

export function DashboardPanel({ onOpenTab }: DashboardPanelProps) {
    const entries = useKiraStore((s) => s.entries);
    const { tryAdd, collisionModal } = useCollisionGuardedAdd();
    const weeklyStudyGoalMinutes = useKiraStore((s) => s.weeklyStudyGoalMinutes);
    const fortnightWorkLimitHours = useKiraStore((s) => s.fortnightWorkLimitHours);
    const openLimitsEditor = useKiraStore((s) => s.openLimitsEditor);
    const displayName = useKiraStore((s) => s.userProfile.displayName);

    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    const [scheduleDay, setScheduleDay] = useState(() => {
        const x = new Date();
        x.setHours(0, 0, 0, 0);
        return x;
    });

    const refDay = useMemo(() => new Date(), []);

    const fortnightWorkMinutes = useMemo(() => fortnightShiftMinutes(entries, refDay), [entries, refDay]);
    const weekStudyMinutes = useMemo(() => calendarWeekKindMinutes(entries, "study", refDay), [entries, refDay]);

    const workHoursActual = fortnightWorkMinutes / 60;
    const workCapHours = Math.max(fortnightWorkLimitHours, 1);

    const upcoming = useMemo(() => [...entries].sort((a, b) => a.isoDate.localeCompare(b.isoDate)).slice(0, 4), [entries]);

    const editingEntry = useMemo(() => entries.find((e) => e.id === editingEntryId) ?? null, [entries, editingEntryId]);

    const rankedIncomplete = useMemo(() => sortedIncompleteByAttention(entries, new Date()), [entries]);
    const todayIso = isoFromDate(new Date());
    const topPick = rankedIncomplete[0];
    const runnersUp = rankedIncomplete.slice(1, 3);

    const dayHeading = scheduleDay.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const shiftDay = (delta: number) => {
        setScheduleDay((d) => {
            const n = new Date(d);
            n.setDate(n.getDate() + delta);
            return n;
        });
    };

    const goToday = () => {
        const n = new Date();
        n.setHours(0, 0, 0, 0);
        setScheduleDay(n);
    };

    const handleTimelineCreate = (startMinutes: number) => {
        tryAdd(
            {
                isoDate: isoFromDate(scheduleDay),
                title: t("calendar.newTaskDefaultTitle"),
                kind: "study",
                priority: "medium",
                completed: false,
                startMinutes,
                durationMinutes: 30,
            },
            (id) => setEditingEntryId(id),
        );
    };

    const welcomeHeading = tWellbeingWelcome(displayName);

    const statsList = {
        hidden: {},
        show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
    };
    const statsItem = {
        hidden: { opacity: 0, y: 14 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 380, damping: 28 },
        },
    };

    return (
        <div className="flex flex-col gap-8 max-md:gap-4">
            <header className="shrink-0">
                <h2 className="text-display-sm font-semibold tracking-tight text-primary max-md:text-lg max-md:leading-snug">
                    {welcomeHeading}
                </h2>
            </header>
            <motion.div
                className="grid gap-6 max-md:gap-4 lg:grid-cols-2"
                variants={statsList}
                initial="hidden"
                animate="show"
            >
                <motion.section className={cx(statsCardClass, "max-md:p-4 max-md:py-4")} variants={statsItem}>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className="text-xl font-bold text-primary max-md:text-md max-md:leading-tight">{t("dashboard.workHours")}</h2>
                        <Button color="link-color" size="sm" className="px-0 max-md:text-xs md:size-md" onClick={() => openLimitsEditor()}>
                            {t("dashboard.editLimits")}
                        </Button>
                    </div>
                    <p className="mt-1 text-md leading-relaxed text-secondary max-md:hidden">{t("dashboard.workHoursCaption")}</p>
                    <p className="mt-1 text-xs leading-snug text-tertiary md:hidden">{t("dashboard.workHoursCaption")}</p>
                    <div className="mt-3 flex flex-wrap items-end gap-x-2 gap-y-0.5 max-md:mt-2 md:mt-5">
                        <span className="text-display-md font-bold tracking-tight text-primary tabular-nums max-md:text-2xl max-md:leading-none">
                            {workHoursActual.toFixed(1)}
                            <span className="text-display-sm font-bold text-brand-secondary max-md:text-lg">h</span>
                        </span>
                        <span className="pb-0.5 text-lg font-semibold text-tertiary tabular-nums max-md:text-sm max-md:pb-0">
                            / {fortnightWorkLimitHours} h
                        </span>
                    </div>
                    <ProgressBar
                        className="mt-3 max-md:mt-2 md:mt-4"
                        value={workHoursActual}
                        max={workCapHours}
                        labelPosition="bottom"
                        valueFormatter={(v, p) => `${v.toFixed(1)} h (${Math.round(p)}%)`}
                    />
                </motion.section>

                <motion.section className={cx(statsCardClass, "max-md:p-4 max-md:py-4")} variants={statsItem}>
                    <h2 className="text-xl font-bold text-primary max-md:text-md max-md:leading-tight">{t("dashboard.goalTitle")}</h2>
                    <p className="mt-1 text-md leading-relaxed text-secondary max-md:hidden">{t("dashboard.goalCaption")}</p>
                    <p className="mt-1 text-xs leading-snug text-tertiary md:hidden">{t("dashboard.goalCaption")}</p>
                    <p className="mt-3 text-display-sm font-bold leading-tight tracking-tight text-primary tabular-nums max-md:mt-2 max-md:text-xl md:mt-5">
                        {formatMinutesAsHoursMinutes(weekStudyMinutes)}
                        <span className="text-lg font-semibold text-tertiary max-md:text-sm"> / </span>
                        {formatMinutesAsHoursMinutes(weeklyStudyGoalMinutes)}
                    </p>
                    <ProgressBar
                        className="mt-3 max-md:mt-2 md:mt-4"
                        value={weekStudyMinutes}
                        max={Math.max(weeklyStudyGoalMinutes, 1)}
                        labelPosition="right"
                        valueFormatter={(_, p) => `${Math.round(p)}%`}
                    />
                </motion.section>
            </motion.div>

            <div className="flex flex-col gap-6 max-md:gap-4 lg:gap-8">
                <div className="order-1 grid gap-6 max-md:gap-3 lg:order-2 lg:grid-cols-2 lg:items-start">
                    <section className="flex flex-col rounded-2xl border border-secondary bg-primary_alt p-4 shadow-md ring-1 ring-brand-secondary/15 max-md:p-4 dark:ring-brand-secondary/25 md:p-6">
                        <h2 className="text-xl font-bold text-primary max-md:text-md">{t("dashboard.nextAction.title")}</h2>
                        <p className="mt-1 text-lg font-semibold text-brand-secondary max-md:text-sm max-md:leading-snug md:mt-2">
                            {t("dashboard.nextAction.headline")}
                        </p>
                        <p className="mt-1 text-md text-secondary max-md:hidden md:mt-2">{t("dashboard.nextAction.hint")}</p>
                        <p className="mt-1 text-xs leading-snug text-tertiary md:hidden">{t("dashboard.nextAction.hint")}</p>

                        {topPick ? (
                            <>
                                <Button
                                    color="secondary"
                                    size="md"
                                    className="mt-3 h-auto w-full flex-col items-start gap-2 py-3 text-left shadow-xs ring-1 ring-secondary ring-inset max-md:mt-2 max-md:gap-1.5 max-md:py-2.5 md:mt-5 md:gap-3 md:py-4"
                                    onClick={() => setEditingEntryId(topPick.id)}
                                >
                                    <div className="flex w-full flex-wrap items-center gap-1.5 max-md:gap-1 md:gap-2">
                                        <Badge type="pill-color" color={priorityBadgeColor(topPick.priority)} size="sm">
                                            {priorityLabel(topPick.priority)}
                                        </Badge>
                                        <span
                                            className={cx(
                                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
                                                scheduleKindPillClass(topPick.kind),
                                            )}
                                        >
                                            {entryKindLabel(topPick.kind)}
                                        </span>
                                    </div>
                                    <p className="w-full text-lg font-semibold text-primary max-md:text-sm max-md:leading-snug md:text-lg">
                                        {topPick.title}
                                    </p>
                                    <div className="w-full space-y-0.5 text-xs text-secondary max-md:text-[11px] md:space-y-1 md:text-sm">
                                        {effectiveDeadlineIso(topPick) < todayIso && (
                                            <p className="font-semibold text-error-primary">{t("dashboard.nextAction.overdue")}</p>
                                        )}
                                        {topPick.deadlineIso?.trim() ? (
                                            <>
                                                <p>
                                                    <span className="font-medium text-quaternary">{t("dashboard.nextAction.deadline")}</span>{" "}
                                                    <span className="text-secondary">{formatIsoShort(topPick.deadlineIso.trim())}</span>
                                                </p>
                                                <p>
                                                    <span className="font-medium text-quaternary">{t("dashboard.nextAction.scheduled")}</span>{" "}
                                                    <span className="text-secondary">{formatIsoShort(topPick.isoDate)}</span>
                                                </p>
                                            </>
                                        ) : (
                                            <p>
                                                <span className="font-medium text-quaternary">{t("dashboard.nextAction.scheduled")}</span>{" "}
                                                <span className="text-secondary">{formatIsoShort(topPick.isoDate)}</span>
                                            </p>
                                        )}
                                    </div>
                                </Button>

                                {runnersUp.length > 0 && (
                                    <div className="mt-3 max-md:mt-2 md:mt-5">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary max-md:text-[10px] md:text-sm">
                                            {t("dashboard.nextAction.alsoConsider")}
                                        </p>
                                        <ul className="mt-1.5 space-y-1.5 max-md:mt-1 md:mt-2 md:space-y-2">
                                            {runnersUp.map((e) => (
                                                <li key={e.id}>
                                                    <button
                                                        type="button"
                                                        className="w-full rounded-lg bg-primary px-2.5 py-1.5 text-left ring-1 ring-secondary ring-inset transition-colors duration-100 hover:bg-primary_hover max-md:px-2 md:px-3 md:py-2"
                                                        onClick={() => setEditingEntryId(e.id)}
                                                    >
                                                        <span className="block text-sm font-semibold text-primary max-md:text-xs md:text-md">
                                                            {e.title}
                                                        </span>
                                                        <span className="mt-0.5 block text-[11px] text-secondary max-md:leading-tight md:text-sm">
                                                            {formatIsoShort(effectiveDeadlineIso(e))} · {priorityLabel(e.priority)}
                                                        </span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="mt-3 text-sm text-secondary max-md:mt-2 md:mt-5 md:text-md">{t("dashboard.nextAction.empty")}</p>
                        )}

                        <Button
                            color="link-color"
                            size="sm"
                            className="mt-4 justify-start px-0 pt-4 max-md:mt-3 max-md:pt-3 max-md:text-xs md:mt-auto md:pt-6"
                            iconTrailing={ArrowUpRight}
                            onClick={() => onOpenTab("calendar")}
                        >
                            {t("dashboard.openFullCalendar")}
                        </Button>
                    </section>

                    <section className="rounded-2xl border border-secondary bg-primary_alt p-4 shadow-md ring-1 ring-brand-secondary/15 max-md:p-4 dark:ring-brand-secondary/25 md:p-6">
                        <div className="flex items-center justify-between gap-2">
                            <h2 className="text-xl font-bold text-primary max-md:text-md">{t("dashboard.upcoming")}</h2>
                            <Button color="link-color" size="sm" className="px-0 max-md:text-xs" onClick={() => onOpenTab("events")}>
                                {t("app.tab.events")}
                            </Button>
                        </div>
                        <ul className="mt-3 space-y-2 max-md:mt-2 max-md:space-y-1.5 md:mt-4 md:space-y-3">
                            {upcoming.map((e) => (
                                <li key={e.id} className="rounded-xl bg-primary px-3 py-2 ring-1 ring-secondary ring-inset max-md:px-2.5 max-md:py-1.5 md:px-4 md:py-3">
                                    <p className="text-sm font-semibold text-primary max-md:text-xs md:text-md">{e.title}</p>
                                    <p className="mt-0.5 text-[11px] text-secondary max-md:leading-tight md:mt-1 md:text-sm">
                                        {e.isoDate} · {e.kind}
                                    </p>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 border-t border-secondary pt-3 max-md:mt-3 md:mt-6 md:pt-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary max-md:text-[10px] md:text-sm">
                                {t("events.title")}
                            </p>
                            <ul className="mt-1.5 space-y-1 max-md:mt-1 md:mt-2 md:space-y-2">
                                {MOCK_EVENTS.slice(0, 2).map((ev) => (
                                    <li key={ev.id} className="text-xs text-primary max-md:leading-snug md:text-md">
                                        <span className="font-medium">{ev.title}</span>
                                        <span className="text-tertiary"> — {ev.when}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>

                <section className="order-2 rounded-2xl border border-secondary bg-primary_alt p-4 shadow-md ring-1 ring-brand-secondary/15 max-md:p-4 dark:ring-brand-secondary/25 lg:order-1 md:p-6">
                    <div className="flex flex-col gap-3 max-md:gap-2 md:gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wide text-brand-secondary max-md:text-[10px] md:text-sm">
                                {t("calendar.plannerTitle.day")}
                            </p>
                            <h2 className="mt-0.5 text-display-xs font-bold tracking-tight text-primary max-md:text-sm max-md:leading-tight md:mt-1 md:text-display-xs">
                                {dayHeading}
                            </h2>
                            <p className="mt-1 text-sm text-secondary max-md:hidden md:mt-2 md:text-md">{t("dashboard.dayScheduleCaption")}</p>
                            <p className="mt-1 text-[11px] leading-snug text-tertiary max-md:line-clamp-2 md:hidden">
                                {t("dashboard.dayScheduleCaption")}
                            </p>
                            <p className="mt-1 text-xs font-medium text-tertiary max-md:hidden md:mt-2 md:text-sm">
                                {t("dashboard.dayScheduleClickHint")}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 max-md:gap-1 md:gap-2">
                            <Button color="secondary" size="sm" iconLeading={ChevronLeft} aria-label={t("aria.previousDay")} onClick={() => shiftDay(-1)} />
                            <Button color="secondary" size="sm" iconLeading={ChevronRight} aria-label={t("aria.nextDay")} onClick={() => shiftDay(1)} />
                            <Button color="secondary" size="sm" className="max-md:text-xs" onClick={goToday}>
                                {t("calendar.goToday")}
                            </Button>
                        </div>
                    </div>

                    <div className="mt-4 w-full max-md:mt-3 md:mt-6">
                        <DayScheduleTimeline
                            entries={entries}
                            day={scheduleDay}
                            onEntryClick={(entry) => setEditingEntryId(entry.id)}
                            onTimelineBackgroundClick={handleTimelineCreate}
                        />
                    </div>

                    <div className="mt-3 flex flex-col gap-2 max-md:mt-2 md:mt-4 md:gap-3">
                        <div className="flex flex-wrap gap-1.5 max-md:gap-1 md:gap-2">
                            <Badge type="pill-color" color="brand" size="sm">
                                {t("calendar.legend.shift")}
                            </Badge>
                            <Badge type="pill-color" color="warning" size="sm">
                                {t("calendar.legend.exam")}
                            </Badge>
                            <Badge type="pill-color" color="success" size="sm">
                                {t("calendar.legend.study")}
                            </Badge>
                            <Badge type="pill-color" color="success" size="sm">
                                {t("calendar.legend.completed")}
                            </Badge>
                        </div>
                        <Button
                            color="link-color"
                            size="sm"
                            className="justify-start px-0 max-md:text-xs"
                            iconTrailing={ArrowUpRight}
                            onClick={() => onOpenTab("calendar")}
                        >
                            {t("dashboard.openFullCalendar")}
                        </Button>
                    </div>
                </section>
            </div>

            <ScheduleEntryEditModal
                entry={editingEntry}
                isOpen={editingEntryId !== null && editingEntry !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingEntryId(null);
                }}
            />
            {collisionModal}
        </div>
    );
}
