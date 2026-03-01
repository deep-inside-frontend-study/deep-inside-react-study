import { test, expect } from "@playwright/test";

test("has title and hero section", async ({ page }) => {
  await page.goto("/");

  // Title should contain Inside React
  await expect(page).toHaveTitle(/Inside React/);

  // Expect h1 to be visible
  const heading = page
    .getByRole("heading", { level: 1, name: /Inside React/ })
    .first();
  await expect(heading).toBeVisible();

  // Expect About Study section
  const aboutHeading = page.locator("h2", { hasText: "About Study" });
  await expect(aboutHeading).toBeVisible();
});
