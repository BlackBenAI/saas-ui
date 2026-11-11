import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { migrateLegacyDatabase } from "@/lib/db";
import { migrateLegacyLocalStorage } from "@/lib/legacy-storage";
import "@/index.css";

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found.");
}

const rootElement: HTMLElement = container;

migrateLegacyLocalStorage();

async function bootstrap() {
  await migrateLegacyDatabase();
  const { default: App } = await import("@/App");
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();
