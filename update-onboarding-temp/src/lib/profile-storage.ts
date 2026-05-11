const KEY = "kira-user-profile";
const LEGACY_KEY = "balance-bridge-user-profile";

export interface UserProfile {
    displayName: string;
    universityEmail: string;
}

const empty: UserProfile = { displayName: "", universityEmail: "" };

export function loadUserProfile(): UserProfile {
    if (typeof window === "undefined") return { ...empty };
    try {
        const raw = window.localStorage.getItem(KEY) ?? window.localStorage.getItem(LEGACY_KEY);
        if (!raw) return { ...empty };
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object") return { ...empty };
        const o = parsed as Record<string, unknown>;
        const displayName = typeof o.displayName === "string" ? o.displayName : "";
        const universityEmail = typeof o.universityEmail === "string" ? o.universityEmail : "";
        return { displayName, universityEmail };
    } catch {
        return { ...empty };
    }
}

export function saveUserProfile(profile: UserProfile): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, JSON.stringify(profile));
    window.localStorage.removeItem(LEGACY_KEY);
}
