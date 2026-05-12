import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

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
    const handles = page.locator('.resize-handle');
    let found = false;
    const count = await handles.count();
    for (let i = 0; i < count; i++) {
      const prev = await handles.nth(i).evaluate(el => {
        const prev = el.previousElementSibling;
        const next = el.nextElementSibling;
        return prev && next && prev.id === 'trace-panel' && next.id === 'match-panel';
      });
      if (prev) { found = true; break; }
    }
    expect(found).toBe(true);
  });
});
