const LEGACY_KEYS: Record<string, string> = {
  "saas-builder-preferences": "saas-ui-preferences",
  "saas-builder-ui": "saas-ui-ui",
};

export function migrateLegacyLocalStorage(): void {
  if (typeof window === "undefined") return;

  for (const [legacyKey, currentKey] of Object.entries(LEGACY_KEYS)) {
    const value = window.localStorage.getItem(legacyKey);
    if (value === null) continue;
    if (window.localStorage.getItem(currentKey) === null) {
      window.localStorage.setItem(currentKey, value);
    }
    window.localStorage.removeItem(legacyKey);
  }
}
