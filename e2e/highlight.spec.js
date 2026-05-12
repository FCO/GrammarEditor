import { test, expect } from '@playwright/test';
import { setupPage } from './fixtures.js';

test.describe('Grammar Syntax Highlighting', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
  });

  test('highlight output shows grammar code', async ({ page }) => {
    const output = page.locator('#highlight-output');
    await expect(output).not.toBeEmpty();
    const text = await output.innerText();
    expect(text).toContain('grammar');
    expect(text).toContain('TOP');
  });

  test('highlight updates on grammar input', async ({ page }) => {
    const output = page.locator('#highlight-output');
    const originalText = await output.innerText();
    const ta = page.locator('#grammar-code');
    await ta.fill('grammar Foo { token TOP { <digit> } }');
    await page.waitForFunction((old) => {
      const el = document.getElementById('highlight-output');
      return el && el.innerText !== old;
    }, originalText, { timeout: 5000 });
    const newText = await output.innerText();
    expect(newText).toContain('Foo');
  });

  test('empty grammar shows empty highlight', async ({ page }) => {
    const output = page.locator('#highlight-output');
    await expect(output).not.toBeEmpty();
    const ta = page.locator('#grammar-code');
    await ta.fill('');
    await page.waitForFunction(() => {
      const el = document.getElementById('highlight-output');
      return el && el.innerText === '';
    }, { timeout: 5000 });
  });

  test('empty grammar after non-empty clears highlight', async ({ page }) => {
    const output = page.locator('#highlight-output');
    await expect(output).not.toBeEmpty();
    const ta = page.locator('#grammar-code');
    await ta.fill('');
    await page.waitForFunction(() => {
      const el = document.getElementById('highlight-output');
      return el && el.innerText === '';
    }, { timeout: 5000 });
  });

  test('actions highlight shows actions code', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    const ta = page.locator('#actions-code');
    await ta.fill('class MyActions { method TOP($/) { make $/.Str; } }');
    await page.waitForTimeout(500);
    const output = page.locator('#actions-highlight-output');
    await expect(output).not.toBeEmpty();
    const text = await output.innerText();
    expect(text).toContain('MyActions');
  });
});
