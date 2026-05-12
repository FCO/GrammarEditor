import { test, expect } from '@playwright/test';
import { setupPage } from './fixtures.js';

test.describe('Panel Initial States', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
  });

  test('actions panel is collapsed on load', async ({ page }) => {
    await expect(page.locator('#actions-panel')).toHaveClass(/collapsed/);
  });

  test('made panel is collapsed on load', async ({ page }) => {
    await expect(page.locator('#made-panel')).toHaveClass(/collapsed/);
  });

  test('error panel has collapsed class on load', async ({ page }) => {
    await expect(page.locator('#error-panel')).toHaveClass(/collapsed/);
  });

  test('trace panel is visible on load', async ({ page }) => {
    await expect(page.locator('#trace-panel')).not.toHaveClass(/collapsed/);
  });

  test('match panel is visible on load', async ({ page }) => {
    await expect(page.locator('#match-panel')).not.toHaveClass(/collapsed/);
  });

  test('grammar panel is visible on load', async ({ page }) => {
    await expect(page.locator('#grammar-panel')).not.toHaveClass(/collapsed/);
  });

  test('string panel is visible on load', async ({ page }) => {
    await expect(page.locator('#string-panel')).not.toHaveClass(/collapsed/);
  });

  test('error panel toggle shows and hides error panel', async ({ page }) => {
    const errorToggle = page.locator('.panel-toggle[data-panel="error"]');
    const errorPanel = page.locator('#error-panel');
    await errorToggle.click();
    await expect(errorPanel).not.toHaveClass(/collapsed/);
    await errorToggle.click();
    await expect(errorPanel).toHaveClass(/collapsed/);
  });
});
