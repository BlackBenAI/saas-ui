export interface LocalSession {
  mode: "local";
  authenticated: false;
}

export function getLocalSession(): LocalSession {
  return { mode: "local", authenticated: false };
}

export function isLocalMode(): boolean {
  return true;
}
