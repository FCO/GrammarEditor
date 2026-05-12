import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

const TEST_GRAMMAR = 'grammar Foo { token TOP { <digit> } }';

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
});
