import { useSyncExternalStore } from "react";
import { Moon02, Sun } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { useTheme } from "@/providers/theme-provider";
import { t } from "@/i18n/strings";

function subscribe(onStoreChange: () => void) {
    const el = document.documentElement;
    const observer = new MutationObserver(onStoreChange);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
}

function getResolvedDark() {
    return document.documentElement.classList.contains("dark-mode");
}

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const isDark = useSyncExternalStore(subscribe, getResolvedDark, () => false);

    return (
        <Button
            color="secondary"
            size="md"
            aria-label={isDark ? t("aria.switchToLightMode") : t("aria.switchToDarkMode")}
            iconLeading={isDark ? Sun : Moon02}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        />
    );
}
