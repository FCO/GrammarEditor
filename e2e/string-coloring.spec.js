import { test, expect } from '@playwright/test';
import { setString, waitForResponse, setupPage } from './fixtures.js';

test.describe('String Coloring', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('matched characters render as colored spans', async ({ page }) => {
    const output = page.locator('#string-colored-output');
    const spans = output.locator('span');
    const count = await spans.count();
    expect(count).toBeGreaterThan(0);
    const style = await spans.first().getAttribute('style');
    expect(style).toContain('color:');
  });

  test('output text matches input', async ({ page }) => {
    const output = page.locator('#string-colored-output');
    await expect(output).toHaveText('hello');
  });

  test('unmatched characters get unmatched-char class', async ({ page }) => {
    await setString(page, '123abc');
    await waitForResponse(page);
    const output = page.locator('#string-colored-output');
    const unmatchedSpans = output.locator('span.unmatched-char');
    const count = await unmatchedSpans.count();
    expect(count).toBeGreaterThan(0);
  });

  test('partial match shows mixed colored and unmatched', async ({ page }) => {
    await setString(page, '123abc');
    await waitForResponse(page);
    const output = page.locator('#string-colored-output');
    const allSpans = output.locator('span');
    const totalSpans = await allSpans.count();
    expect(totalSpans).toBeGreaterThan(0);
    const unmatchedCount = await output.locator('span.unmatched-char').count();
    expect(unmatchedCount).toBeGreaterThan(0);
    expect(unmatchedCount).toBeLessThan(totalSpans);
  });
});
