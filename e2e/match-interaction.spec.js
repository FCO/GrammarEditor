import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

test.describe('Match Tree Interaction', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('match tree shows matched rules with data', async ({ page }) => {
    const matchRules = page.locator('.match-rule-name');
    await expect(matchRules.first()).toBeVisible();
    const names = await matchRules.allTextContents();
    expect(names.length).toBeGreaterThan(0);
  });

  test('match nodes display captured string data', async ({ page }) => {
    const matchData = page.locator('.match-data');
    const count = await matchData.count();
    expect(count).toBeGreaterThan(0);
  });
});
