import { test } from '@playwright/test'

test('should be able to read', async ({ page }) => {
	await page.goto('http://localhost:5173')
})
