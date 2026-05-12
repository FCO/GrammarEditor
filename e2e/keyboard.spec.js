import { test, expect } from '@playwright/test';
import { setupPage } from './fixtures.js';

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
  });

  test('Tab inserts tab character in grammar editor', async ({ page }) => {
    const ta = page.locator('#grammar-code');
    await ta.focus();
    await page.keyboard.press('Tab');
    const val = await ta.inputValue();
    expect(val).toContain('\t');
  });

  test('Tab inserts tab character in actions editor', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    const ta = page.locator('#actions-code');
    await ta.focus();
    await page.keyboard.press('Tab');
    const val = await ta.inputValue();
    expect(val).toContain('\t');
  });

  test('Ctrl+Enter forces immediate re-parse', async ({ page }) => {
    const ta = page.locator('#grammar-code');
    await ta.focus();
    await page.keyboard.press('Control+Enter');
    const traceBody = page.locator('#trace-body');
    await expect(traceBody).not.toBeEmpty();
  });
});
