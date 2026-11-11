import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:5173";
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../docs/assets");

await mkdir(OUT, { recursive: true });

const hasSystemChrome = ["/usr/bin/google-chrome", "/usr/bin/google-chrome-stable"].some(existsSync);
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL ?? (hasSystemChrome ? "chrome" : undefined),
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  reducedMotion: "reduce",
  recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
});
const page = await context.newPage();
const video = page.video();

async function pause(ms) {
  await page.waitForTimeout(ms);
}

async function settle() {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await pause(600);
}

await page.goto(BASE);
await settle();
await pause(1800);
await page.screenshot({ path: path.join(OUT, "landing.png") });

await page.getByRole("link", { name: /open editor/i }).first().click();
await settle();
await pause(1600);
await page.screenshot({ path: path.join(OUT, "editor-overview.png") });

const projectName = page.locator("#project-name");
await projectName.click();
await projectName.press("ControlOrMeta+A");
await projectName.pressSequentially("Aurora Product System", { delay: 70 });
await pause(2200);

await page.getByRole("button", { name: /collapse sidebar/i }).click();
await pause(1400);
await page.getByRole("button", { name: /expand sidebar/i }).click();
await pause(1200);

await page.getByRole("button", { name: "Undo" }).click();
await pause(1000);
await page.getByRole("button", { name: "Redo" }).click();
await pause(1200);

await page.getByRole("button", { name: /collapse properties panel/i }).click();
await pause(1300);
await page.getByRole("button", { name: /expand properties panel/i }).click();
await pause(1200);

await page.reload();
await settle();
await pause(2400);
await page.screenshot({ path: path.join(OUT, "editor-persisted.png") });

await page.getByRole("link", { name: /saas-ui home/i }).first().click();
await settle();
await pause(3200);

await context.close();
const videoPath = await video.path();
await rename(videoPath, path.join(OUT, "saas-ui-demo.webm"));

await browser.close();

console.log("captured docs/assets/landing.png");
console.log("captured docs/assets/editor-overview.png");
console.log("captured docs/assets/editor-persisted.png");
console.log("captured docs/assets/saas-ui-demo.webm");
