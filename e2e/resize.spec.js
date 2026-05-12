import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

async function hasHandleBetween(page, prevId, nextId) {
  const handles = page.locator('.resize-handle');
  const count = await handles.count();
  for (let i = 0; i < count; i++) {
    const found = await handles.nth(i).evaluate((el, { prevId, nextId }) => {
      const prev = el.previousElementSibling;
      const next = el.nextElementSibling;
      return prev && next && prev.id === prevId && next.id === nextId;
    }, { prevId, nextId });
    if (found) return true;
  }
  return false;
}

test.describe('Panel Resize Handles', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('resize handles exist between adjacent panels', async ({ page }) => {
    const handles = page.locator('.resize-handle');
    const count = await handles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('at least one col-resize handle exists', async ({ page }) => {
    const colHandles = page.locator('.resize-handle.dir-col');
    const count = await colHandles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('resize handles appear between trace and match', async ({ page }) => {
    expect(await hasHandleBetween(page, 'trace-panel', 'match-panel')).toBe(true);
  });

  test('resize handle appears between grammar and actions when both visible', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.waitForTimeout(300);
    expect(await hasHandleBetween(page, 'grammar-panel', 'actions-panel')).toBe(true);
  });

  test('resize handle appears between actions and string when both visible', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.waitForTimeout(300);
    expect(await hasHandleBetween(page, 'actions-panel', 'string-panel')).toBe(true);
  });

  test('resize handle appears between right top row and made when made visible', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="made"]').click();
    await page.waitForTimeout(300);
    expect(await hasHandleBetween(page, 'right-top-row', 'made-panel')).toBe(true);
  });

  test('resize handles hidden when adjacent panel is collapsed', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.waitForTimeout(300);
    expect(await hasHandleBetween(page, 'grammar-panel', 'actions-panel')).toBe(true);
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.waitForTimeout(300);
    expect(await hasHandleBetween(page, 'grammar-panel', 'actions-panel')).toBe(false);
  });
});
