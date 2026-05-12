import { test, expect } from '@playwright/test';
import { setGrammar, setString, waitForResponse, setupPage } from './fixtures.js';

test.describe('Grammar Evaluation', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
  });

  test('valid grammar produces trace tree with MATCH badges', async ({ page }) => {
    await waitForResponse(page);
    const matchBadges = page.locator('.tree-badge.match');
    await expect(matchBadges.first()).toBeVisible();
    await expect(matchBadges.first()).toHaveText('MATCH');
  });

  test('trace tree shows FAIL badges for failed rules', async ({ page }) => {
    await page.evaluate(() => {
      const failTrace = {
        rule: "TOP", match: false, pos_start: 0, pos_end: 0,
        children: [
          { rule: "test", match: false, pos_start: 0, pos_end: 0, children: [] }
        ]
      };
      if (typeof renderTrace === 'function') {
        renderTrace(failTrace);
      }
    });
    await expect(page.locator('.tree-badge.fail').first()).toBeVisible();
    await expect(page.locator('.tree-badge.fail').first()).toHaveText('FAIL');
  });

  test('match panel shows parsed match data', async ({ page }) => {
    await waitForResponse(page);
    const matchRules = page.locator('.match-rule-name');
    await expect(matchRules.first()).toBeVisible();
    await expect(matchRules.first()).toHaveText('TOP');
  });

  test('string input area shows colored output after evaluation', async ({ page }) => {
    await waitForResponse(page);
    const coloredOutput = page.locator('#string-colored-output');
    await expect(coloredOutput).toBeVisible();
    const spans = coloredOutput.locator('span');
    const count = await spans.count();
    expect(count).toBeGreaterThan(0);
  });

  test('error panel appears on invalid grammar', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    const errorPanel = page.locator('#error-panel');
    await expect(errorPanel).toBeVisible();
    const errorBody = page.locator('#error-body');
    await expect(errorBody).not.toBeEmpty();
  });

  test('trace and match cleared when error occurs', async ({ page }) => {
    await setGrammar(page, `syntax error`);
    await waitForResponse(page);
    await expect(page.locator('#trace-body')).toBeEmpty();
    await expect(page.locator('#match-body')).toBeEmpty();
  });

  test('made panel displays made value when actions are provided', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="made"]').click();
    await waitForResponse(page);
    const madeBody = page.locator('#made-body');
    await expect(madeBody).not.toBeEmpty();
  });
});
