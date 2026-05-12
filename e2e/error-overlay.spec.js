import { test, expect } from '@playwright/test';
import { setGrammar, waitForResponse, setupPage } from './fixtures.js';

test.describe('Error Overlay and Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
  });

  test('error overlay SVG appears on parse error', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const overlay = page.locator('#grammar-error-overlay');
    const svg = overlay.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('error body shows error message', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const errorBody = page.locator('#error-body');
    await expect(errorBody).not.toBeEmpty();
  });

  test('error panel shows when error occurs', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const errorPanel = page.locator('#error-panel');
    await expect(errorPanel).toBeVisible();
  });

  test('hovering error zigzag shows tooltip', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const svg = page.locator('#grammar-error-overlay svg');
    await expect(svg).toBeAttached();
    const tooltip = page.locator('#error-tooltip');
    await page.dispatchEvent('#grammar-error-overlay svg path', 'mouseenter');
    await expect(tooltip).toHaveClass(/visible/);
  });
});
