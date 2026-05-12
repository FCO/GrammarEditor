import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

test.describe('Hover Interaction', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('hovering trace node highlights corresponding match node', async ({ page }) => {
    const traceNodes = page.locator('.tree-node');
    const matchNodes = page.locator('.match-node');
    const traceCount = await traceNodes.count();
    const matchCount = await matchNodes.count();
    expect(traceCount).toBeGreaterThan(0);
    expect(matchCount).toBeGreaterThan(0);

    await traceNodes.first().hover();
    const hasOutline = await matchNodes.evaluateAll(nodes =>
      nodes.some(n => n.style.outline && n.style.outline.includes('2px'))
    );
    expect(hasOutline).toBe(true);
  });

  test('hovering match node highlights string region', async ({ page }) => {
    const matchNodes = page.locator('.match-node');
    const count = await matchNodes.count();
    expect(count).toBeGreaterThan(0);

    await matchNodes.first().hover();
    const highlights = page.locator('#string-highlights .string-highlight');
    await expect(highlights.first()).toBeAttached();
  });

  test('hovering match node highlights corresponding trace node', async ({ page }) => {
    const matchNodes = page.locator('.match-node');
    const traceNodes = page.locator('.tree-node');
    await matchNodes.first().hover();
    const hasOutline = await traceNodes.evaluateAll(nodes =>
      nodes.some(n => n.style.outline && n.style.outline.includes('2px'))
    );
    expect(hasOutline).toBe(true);
  });
});
