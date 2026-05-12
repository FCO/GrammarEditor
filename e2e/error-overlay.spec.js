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

  test('error panel hides on successful parse', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    await expect(page.locator('#error-panel')).toBeVisible();
    await setGrammar(page, `token TOP { <letter> }`);
    await waitForResponse(page);
    await expect(page.locator('#error-panel')).toHaveClass(/collapsed/);
  });

  test('zigzag shown in actions editor on actions error', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.locator('#actions-code').fill(`action error`);
    await page.waitForTimeout(400);
    await waitForResponse(page);
    const overlay = page.locator('#actions-error-overlay');
    const svg = overlay.locator('svg');
    await expect(svg).toBeVisible();
  });

  test('no zigzag for runtime errors', async ({ page }) => {
    await setGrammar(page, `runtime error`);
    await waitForResponse(page);
    await expect(page.locator('#grammar-error-overlay svg')).not.toBeAttached();
    await expect(page.locator('#actions-error-overlay svg')).not.toBeAttached();
    await expect(page.locator('#string-error-overlay svg')).not.toBeAttached();
  });

  test('error tooltip hidden on leave', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const tooltip = page.locator('#error-tooltip');
    await page.dispatchEvent('#grammar-error-overlay svg path', 'mouseenter');
    await expect(tooltip).toHaveClass(/visible/);
    await page.dispatchEvent('#grammar-error-overlay svg path', 'mouseleave');
    await expect(tooltip).not.toHaveClass(/visible/);
  });

  test('error overlay stores line and column data', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const svg = page.locator('#grammar-error-overlay svg');
    await expect(svg).toHaveAttribute('data-line', '1');
    await expect(svg).toHaveAttribute('data-col', '1');
  });

  test('error overlay stores error source as grammar', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const svg = page.locator('#grammar-error-overlay svg');
    await expect(svg).toBeAttached();
    const source = await page.evaluate(() => currentErrorSource);
    expect(source).toBe('grammar');
  });

  test('actions error stores source as actions', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.locator('#actions-code').fill(`action error`);
    await page.waitForTimeout(400);
    await waitForResponse(page);
    const source = await page.evaluate(() => currentErrorSource);
    expect(source).toBe('actions');
  });

  test('zigzag clears on successful parse', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    await expect(page.locator('#grammar-error-overlay svg')).toBeAttached();
    await setGrammar(page, `token TOP { <letter> }`);
    await waitForResponse(page);
    await expect(page.locator('#grammar-error-overlay svg')).not.toBeAttached();
  });
});
