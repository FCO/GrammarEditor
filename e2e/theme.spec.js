import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

test.describe('Theme Selection', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('theme dropdown is populated with 12+ options', async ({ page }) => {
    const select = page.locator('#theme-select');
    const options = select.locator('option');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(12);
  });

  test('default theme is Vitesse Dark', async ({ page }) => {
    const select = page.locator('#theme-select');
    await expect(select).toHaveValue('Vitesse Dark');
  });

  test('changing theme triggers grammar re-evaluation', async ({ page }) => {
    const select = page.locator('#theme-select');
    await select.selectOption('Monokai');
    await expect(select).toHaveValue('Monokai');
    await waitForResponse(page);
    const spans = page.locator('#string-colored-output span');
    await expect(spans.first()).toBeVisible();
  });

  test('changing theme changes string coloring colors', async ({ page }) => {
    const select = page.locator('#theme-select');
    const getColors = () => page.locator('#string-colored-output span').evaluateAll(spans =>
      Array.from(spans).map(s => s.style.color).filter(Boolean)
    );
    const colorsBefore = await getColors();
    await select.selectOption('Monokai');
    await waitForResponse(page);
    const colorsAfter = await getColors();
    expect(colorsAfter.length).toBeGreaterThan(0);
    const isDifferent = colorsBefore.some((c, i) => c !== colorsAfter[i]);
    expect(isDifferent).toBe(true);
  });

  test('highlight output is populated after theme change', async ({ page }) => {
    const select = page.locator('#theme-select');
    await select.selectOption('Monokai');
    await page.waitForTimeout(500);
    const output = page.locator('#highlight-output');
    await expect(output).not.toBeEmpty();
    const text = await output.innerText();
    expect(text).toContain('grammar');
  });
});
