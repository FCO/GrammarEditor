import { test, expect } from '@playwright/test';
import { DEFAULT_GRAMMAR, DEFAULT_STRING, waitForResponse, setupPage } from './fixtures.js';

test.describe('URL Snapshot Sharing', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
  });

  test('Share button triggers snapshot creation', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    const dialogPromise = page.waitForEvent('dialog').catch(() => null);
    const responsePromise = page.waitForResponse(resp =>
      resp.url().includes('/_store') && resp.request().method() === 'POST'
    );
    await page.locator('#btn-share').click();
    const response = await responsePromise;
    expect(response.status()).toBe(200);
    const dialog = await dialogPromise;
    if (dialog) await dialog.accept();
  });

  test('Share button sends modified grammar in POST body', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await page.locator('#grammar-code').fill('grammar Custom { token TOP { <digit> } }');
    const dialogPromise = page.waitForEvent('dialog').catch(() => null);
    const [response] = await Promise.all([
      page.waitForResponse(resp =>
        resp.url().includes('/_store') && resp.request().method() === 'POST'
      ),
      page.locator('#btn-share').click(),
    ]);
    const body = await response.request().postDataJSON();
    expect(body.grammar_code).toContain('Custom');
    const dialog = await dialogPromise;
    if (dialog) await dialog.accept();
  });

  test('Share button sends modified string in POST body', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await page.locator('#string-input').fill('custom string');
    const dialogPromise = page.waitForEvent('dialog').catch(() => null);
    const [response] = await Promise.all([
      page.waitForResponse(resp =>
        resp.url().includes('/_store') && resp.request().method() === 'POST'
      ),
      page.locator('#btn-share').click(),
    ]);
    const body = await response.request().postDataJSON();
    expect(body.string_input).toBe('custom string');
    const dialog = await dialogPromise;
    if (dialog) await dialog.accept();
  });

  test('snapshot store endpoint returns data', async ({ page, baseURL }) => {
    const id = 'a'.repeat(40);
    const response = await page.request.get(`${baseURL}/_store/${id}`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.grammar_code).toBe(DEFAULT_GRAMMAR);
    expect(data.string_input).toBe(DEFAULT_STRING);
  });

  test('snapshot store endpoint includes actions code', async ({ page, baseURL }) => {
    const id = 'a'.repeat(40);
    const response = await page.request.get(`${baseURL}/_store/${id}`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.actions_code).toBeTruthy();
  });
});
