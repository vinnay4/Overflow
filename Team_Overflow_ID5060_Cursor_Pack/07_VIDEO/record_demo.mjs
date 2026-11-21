import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const BASE = process.env.DEMO_BASE || "http://127.0.0.1:8765";
const OUT = new URL("./raw/", import.meta.url).pathname;

async function caption(page, text) {
  await page.evaluate((text) => {
    let el = document.getElementById("demo-cap");
    if (!el) {
      el = document.createElement("div");
      el.id = "demo-cap";
      el.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:99999;background:rgba(31,42,51,.94);color:#fff;font:600 22px/1.35 ui-sans-serif,system-ui;padding:16px 28px";
      document.body.appendChild(el);
    }
    el.textContent = text;
  }, text);
}

const browser = await chromium.launch({
  executablePath: "/opt/google/chrome/chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--autoplay-policy=no-user-gesture-required"],
});
await mkdir(OUT, { recursive: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  recordVideo: { dir: OUT, size: { width: 1600, height: 900 } },
});
const page = await context.newPage();

await page.goto(`${BASE}/07_VIDEO/cards.html`, { waitUntil: "domcontentloaded" });
await caption(page, "Ubaal, Team Overflow. A demo of the implementation, not a kitchen trial.");
await page.waitForTimeout(7000);

await page.goto(`${BASE}/05_DECK/deck/index.html?slide=1&shot=1`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
await caption(page, "The need: a full boil without watching. Kitchen baseline is untested. The 2.2 seconds is a model.");
await page.waitForTimeout(9000);

await page.goto(`${BASE}/05_DECK/deck/index.html?slide=3&shot=1`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(400);
await caption(page, "One number, Π. Above 1, the model says the foam outgrows the pot. These curves are estimates.");
await page.waitForTimeout(9000);

await page.goto(`${BASE}/02_SIMULATION/app/dist/index.html`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#outcome");
const baseText = await page.locator("#outcome").innerText();
if (!/Boil-over/.test(baseText)) throw new Error("baseline outcome missing: " + baseText);
await caption(page, "Model, full flame, nobody watching. The foam crosses the rim just after the boil.");
await page.waitForTimeout(4000);
await page.selectOption("#speed", "40");
await page.locator("#scrub").fill("0");
await page.locator("#scrub").dispatchEvent("input");
await page.locator("#play").click();
await page.waitForTimeout(7000);

await page.selectOption("#preset", "detector");
await page.waitForFunction(() => document.querySelector("#outcome")?.textContent?.includes("No boil-over"));
const ubaalText = await page.locator("#outcome").innerText();
if (!/24/.test(ubaalText) && !/Alarm lead/.test(ubaalText)) {
  // lead is rendered as a number; 24.x should appear
}
if (!ubaalText.includes("No boil-over")) throw new Error("ubaal scenario still overflows: " + ubaalText);
await caption(page, "Same assumed pot, Ubaal on: alarm at 88 °C, then the flame drops. Model: no boil-over. Not a measurement.");
await page.waitForTimeout(8000);

await page.locator('nav button[data-tab="transformers"]').click();
await page.waitForSelector("#tcards canvas");
await caption(page, "Four transformers. Scale says a wider pot is a weak lever. Change Frame swaps the eye for a microphone.");
await page.waitForTimeout(7000);

await page.goto(`${BASE}/03_DETECTOR_APP/app/index.html`, { waitUntil: "domcontentloaded" });
await caption(page, "Test alarm, English. This button does not use the microphone and it is not a pot.");
await page.locator("#testAlarm").click();
await page.waitForFunction(() => document.querySelector("#msg")?.textContent?.includes("about to boil"));
await page.waitForTimeout(4000);
await page.locator("#hindi").check();
await caption(page, "Same test in Hindi. hi-IN, if the phone has that voice.");
await page.locator("#testAlarm").click();
await page.waitForFunction(() => document.querySelector("#msg")?.textContent?.includes("उबलने"));
await page.waitForTimeout(5000);

await page.goto(`${BASE}/07_VIDEO/end.html`, { waitUntil: "domcontentloaded" });
await caption(page, "Small sample: zero kitchen trials. Next step is a real boil, then an automatic cut on induction.");
await page.waitForTimeout(8000);

const video = page.video();
await context.close();
await browser.close();
const path = await video.path();
console.log("VIDEO", path);
