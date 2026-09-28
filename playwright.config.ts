import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001",
    browserName: "chromium",
    launchOptions: process.env.PLAYWRIGHT_ANGLE ? { args: [`--use-angle=${process.env.PLAYWRIGHT_ANGLE}`] } : undefined,
    trace: "retain-on-failure",
  },
  reporter: [["list"], ["json", { outputFile: "docs/review/tests.json" }]],
});
