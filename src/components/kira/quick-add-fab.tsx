import { useState } from "react";
import { Plus } from "@untitledui/icons";
import { motion } from "motion/react";
import { Button } from "@/components/base/buttons/button";
import { ScheduleEntryCreateDetailsModal } from "@/components/kira/schedule-entry-modal";
import { t } from "@/i18n/strings";
import { cx } from "@/utils/cx";

/**
 * Global floating action — opens the same “task details” flow as Calendar → More options.
 */
export function QuickAddFab() {
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <>
            <motion.div
                className={cx("fixed right-4 bottom-5 z-40 size-14 md:right-6 md:bottom-6")}
                initial={false}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
            >
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
                    <motion.span
                        className="absolute size-full rounded-full border-2 border-brand-solid/35 shadow-[0_0_0_1px_rgba(255,255,255,0.12)] dark:border-brand-solid/50"
                        animate={{ scale: [1, 1.45], opacity: [0.4, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                    />
                </span>
                <Button
                    color="primary"
                    size="lg"
                    aria-label={t("aria.quickAdd")}
                    iconLeading={Plus}
                    onClick={() => setCreateOpen(true)}
                    className={cx(
                        "relative z-10 size-14 shrink-0 rounded-full p-0! shadow-xl",
                        "ring-2 ring-white/25 ring-offset-2 ring-offset-primary dark:ring-white/15 dark:ring-offset-primary",
                    )}
                />
            </motion.div>
            <ScheduleEntryCreateDetailsModal
                isOpen={createOpen}
                onOpenChange={setCreateOpen}
                initialTitle=""
                onSaved={() => undefined}
            />
        </>
    );
}
