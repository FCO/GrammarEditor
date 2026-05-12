import { test, expect } from '@playwright/test';
import { DEFAULT_GRAMMAR, DEFAULT_STRING, getGrammarText, getStringText, setupPage } from './fixtures.js';

test.describe('Application Load and Connection', () => {
  test.beforeEach(({ page }) => {
    setupPage(page);
  });

  test('page loads with default grammar and input string', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#grammar-code')).toHaveValue(DEFAULT_GRAMMAR);
    await expect(page.locator('#string-input')).toHaveValue(DEFAULT_STRING);
  });

  test('status bar shows Connected after WS connects', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#status-bar')).toHaveText('Connected', { timeout: 5000 });
  });

  test('grammar textarea accepts typing', async ({ page }) => {
    await page.goto('/');
    const ta = page.locator('#grammar-code');
    await ta.fill('token Foo { <bar> }');
    await expect(ta).toHaveValue('token Foo { <bar> }');
  });

  test('string textarea accepts typing', async ({ page }) => {
    await page.goto('/');
    const ta = page.locator('#string-input');
    await ta.fill('test input');
    await expect(ta).toHaveValue('test input');
  });
});
