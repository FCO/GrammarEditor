import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

const TEST_GRAMMAR = 'grammar Foo { token TOP { <digit> } }';
const TEST_ACTIONS = 'class MyActions { method TOP($/) { make "ok"; } }';

test.describe('File Operations', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
  });

  test('save grammar triggers download', async ({ page }) => {
    await page.evaluate(() => {
      window.showSaveFilePicker = undefined;
    });
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('[data-action="save-grammar"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/grammar-.+\.rakumod/);
  });

  test('save string triggers download', async ({ page }) => {
    await page.evaluate(() => {
      window.showSaveFilePicker = undefined;
    });
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('[data-action="save-string"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/input\.txt/);
  });

  test('save actions triggers download', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.evaluate(() => {
      window.showSaveFilePicker = undefined;
    });
    const downloadPromise = page.waitForEvent('download', { timeout: 5000 });
    await page.locator('[data-action="save-actions"]').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/actions-.+\.rakumod/);
  });

  test('open grammar loads file content', async ({ page }) => {
    await page.evaluate(() => {
      window.showOpenFilePicker = Promise.reject.bind(Promise, new Error('stubbed'));
    });
    const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 });
    await page.locator('[data-action="open-grammar"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.raku',
      mimeType: 'text/plain',
      buffer: Buffer.from(TEST_GRAMMAR),
    });
    await page.waitForTimeout(1000);
    await expect(page.locator('#grammar-code')).toHaveValue(TEST_GRAMMAR);
  });

  test('open actions loads file content', async ({ page }) => {
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.evaluate(() => {
      window.showOpenFilePicker = Promise.reject.bind(Promise, new Error('stubbed'));
    });
    const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 });
    await page.locator('[data-action="open-actions"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.rakumod',
      mimeType: 'text/plain',
      buffer: Buffer.from(TEST_ACTIONS),
    });
    await page.waitForTimeout(1000);
    await expect(page.locator('#actions-code')).toHaveValue(TEST_ACTIONS);
  });

  test('open string loads file content', async ({ page }) => {
    await page.evaluate(() => {
      window.showOpenFilePicker = Promise.reject.bind(Promise, new Error('stubbed'));
    });
    const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 5000 });
    await page.locator('[data-action="open-string"]').click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
      name: 'test.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('custom input'),
    });
    await page.waitForTimeout(1000);
    await expect(page.locator('#string-input')).toHaveValue('custom input');
  });
});
