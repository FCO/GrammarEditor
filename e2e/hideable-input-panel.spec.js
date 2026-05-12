import { test, expect } from '@playwright/test';
import { setupPage } from './fixtures.js';

test.describe('Hideable Input Panel', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
  });

  test('string panel toggle hides input panel', async ({ page }) => {
    const stringToggle = page.locator('.panel-toggle[data-panel="string"]');
    await stringToggle.click();
    await expect(page.locator('#string-panel')).toHaveClass(/collapsed/);
  });

  test('string panel toggle shows hidden input panel', async ({ page }) => {
    const stringToggle = page.locator('.panel-toggle[data-panel="string"]');
    await stringToggle.click();
    await stringToggle.click();
    await expect(page.locator('#string-panel')).not.toHaveClass(/collapsed/);
  });
});
