import { test, expect } from '@playwright/test';
import { setGrammar, waitForResponse, setupPage } from './fixtures.js';

test.describe('Actions Editor', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('made panel toggle shows/hides the panel', async ({ page }) => {
    const madePanel = page.locator('#made-panel');
    const madeToggle = page.locator('.panel-toggle[data-panel="made"]');
    await madeToggle.click();
    await expect(madePanel).not.toHaveClass(/collapsed/);
    await madeToggle.click();
    await expect(madePanel).toHaveClass(/collapsed/);
  });

  test('made panel shows value from evaluation when visible', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="made"]').click();
    const madeBody = page.locator('#made-body');
    await expect(madeBody).not.toBeEmpty();
  });

  test('made panel empty when no made value returned', async ({ page }) => {
    await setGrammar(page, `no made`);
    await waitForResponse(page);
    await page.locator('.panel-toggle[data-panel="made"]').click();
    const madeBody = page.locator('#made-body');
    await expect(madeBody).toBeEmpty();
  });
});
