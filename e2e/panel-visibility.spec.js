import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

test.describe('Panel Visibility and View Modes', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('toggle checkbox hides trace panel', async ({ page }) => {
    const traceToggle = page.locator('.panel-toggle[data-panel="trace"]');
    await traceToggle.click();
    const tracePanel = page.locator('#trace-panel');
    await expect(tracePanel).toHaveClass(/collapsed/);
  });

  test('toggle checkbox shows trace panel after hide', async ({ page }) => {
    const traceToggle = page.locator('.panel-toggle[data-panel="trace"]');
    await traceToggle.click();
    await traceToggle.click();
    const tracePanel = page.locator('#trace-panel');
    await expect(tracePanel).not.toHaveClass(/collapsed/);
  });

  test('hiding all right panels hides right half', async ({ page }) => {
    const rightHalf = page.locator('#right-half');
    await page.locator('.panel-toggle[data-panel="trace"]').click();
    await page.locator('.panel-toggle[data-panel="match"]').click();
    await expect(rightHalf).toHaveClass(/hidden/);
  });

  test('DSL button shows only Input and Made panels', async ({ page }) => {
    await page.locator('#btn-dsl').click();
    await expect(page.locator('#string-panel')).not.toHaveClass(/collapsed/);
    await expect(page.locator('#grammar-panel')).toHaveClass(/collapsed/);
    await expect(page.locator('#trace-panel')).toHaveClass(/collapsed/);
    await expect(page.locator('#match-panel')).toHaveClass(/collapsed/);
  });

  test('DSL button becomes disabled after click', async ({ page }) => {
    await page.locator('#btn-dsl').click();
    await expect(page.locator('#btn-dsl')).toHaveClass(/disabled/);
  });

  test('PRO button shows all panels', async ({ page }) => {
    await page.locator('#btn-pro').click();
    const panels = ['grammar', 'actions', 'trace', 'match', 'string', 'made'];
    for (const p of panels) {
      await expect(page.locator(`#${p}-panel`)).not.toHaveClass(/collapsed/);
    }
  });

  test('PRO button becomes disabled after click', async ({ page }) => {
    await page.locator('#btn-pro').click();
    await expect(page.locator('#btn-pro')).toHaveClass(/disabled/);
  });

  test('actions panel toggle shows/hides actions editor', async ({ page }) => {
    const actionsPanel = page.locator('#actions-panel');
    const actionsToggle = page.locator('.panel-toggle[data-panel="actions"]');
    await actionsToggle.click();
    await expect(actionsPanel).not.toHaveClass(/collapsed/);
    await actionsToggle.click();
    await expect(actionsPanel).toHaveClass(/collapsed/);
  });

  test('grammar panel toggle hides and shows grammar editor', async ({ page }) => {
    const grammarPanel = page.locator('#grammar-panel');
    const grammarToggle = page.locator('.panel-toggle[data-panel="grammar"]');
    await grammarToggle.click();
    await expect(grammarPanel).toHaveClass(/collapsed/);
    await grammarToggle.click();
    await expect(grammarPanel).not.toHaveClass(/collapsed/);
  });

  test('restorePaneState handles error panel in saved state', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    const result = await page.evaluate(() => {
      const errs = [];
      const orig = typeof console.error !== 'undefined' ? console.error : null;
      if (orig) console.error = msg => errs.push(msg);
      try {
        restorePaneState({
          panelSizes: { error: 0 }
        });
        restorePaneState({
          panelSizes: { error: 1 }
        });
        return { ok: true, errorCount: errs.length };
      } catch (e) {
        return { ok: false, error: e.message };
      } finally {
        if (orig) console.error = orig;
      }
    });
    expect(result.ok).toBe(true);
    expect(result.errorCount).toBe(0);
  });
});
