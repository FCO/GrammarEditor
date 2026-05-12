import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

test.describe('WebSocket Reconnection', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
  });

  test('closing WS shows Reconnecting status', async ({ page, baseURL }) => {
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await page.request.post(`${baseURL}/admin/close-ws`);
    await expect(page.locator('#status-bar')).toHaveText('Reconnecting...', { timeout: 10000 });
  });

  test('reconnects and resumes evaluations after WS close', async ({ page, baseURL }) => {
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await waitForResponse(page);
    await page.request.post(`${baseURL}/admin/close-ws`);
    await expect(page.locator('#status-bar')).toHaveText('Reconnecting...', { timeout: 10000 });
    await page.waitForSelector('#status-bar.connected', { timeout: 15000 });
    await waitForResponse(page);
    await expect(page.locator('.tree-badge.match').first()).toBeVisible({ timeout: 5000 });
  });
});
