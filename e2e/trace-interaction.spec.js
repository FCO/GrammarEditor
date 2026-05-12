import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

test.describe('Trace Tree Interaction', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('trace nodes expand on click', async ({ page }) => {
    const toggles = page.locator('.tree-toggle:not(.empty)');
    const toggleCount = await toggles.count();
    expect(toggleCount).toBeGreaterThan(0);
    const firstToggle = toggles.first();
    const wasOpen = await firstToggle.evaluate(el => el.textContent === '\u25BE');
    if (wasOpen) {
      await firstToggle.click();
    }
    await firstToggle.click();
    const isExpanded = await firstToggle.evaluate(el => el.textContent === '\u25BE');
    expect(isExpanded).toBe(true);
  });

  test('top-level nodes are expanded by default', async ({ page }) => {
    const openChildren = page.locator('.tree-children.open');
    await expect(openChildren.first()).toBeVisible();
  });

  test('trace tree shows rule names and position data', async ({ page }) => {
    const ruleNames = page.locator('.tree-rule-name');
    await expect(ruleNames.first()).toBeVisible();
    const pos = page.locator('.tree-pos');
    const posCount = await pos.count();
    expect(posCount).toBeGreaterThan(0);
  });

  test('hovering trace node highlights string region', async ({ page }) => {
    const firstNode = page.locator('.tree-node').first();
    await firstNode.hover();
    const highlights = page.locator('#string-highlights .string-highlight');
    await expect(highlights.first()).toBeAttached();
  });

  test('trace and match trees both render after evaluation', async ({ page }) => {
    await expect(page.locator('.tree-node').first()).toBeVisible();
    await expect(page.locator('.match-node').first()).toBeVisible();
  });

  test('leaving hover clears all highlights', async ({ page }) => {
    const firstNode = page.locator('.tree-node').first();
    await firstNode.hover();
    const highlights = page.locator('#string-highlights .string-highlight');
    await expect(highlights.first()).toBeAttached();
    const traceBody = page.locator('#trace-body');
    await traceBody.hover({ position: { x: 0, y: 0 } });
    await expect(highlights.first()).not.toBeAttached();
  });
});
