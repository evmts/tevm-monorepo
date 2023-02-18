import { test, expect } from "@playwright/test";

test("should run a pure test", async ({ page }) => {
	await page.goto("http://localhost:5173");

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/wagmi/);

	await page.getByRole("spinbutton").first().click();
	await page.getByRole("spinbutton").first().fill("05");
	await page.getByRole("spinbutton").nth(1).click();
	await page.getByRole("spinbutton").nth(1).fill("08");

	await page.getByText("000000000000000000000000000000013").click();
});
