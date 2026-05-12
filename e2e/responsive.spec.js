import { test, expect } from '@playwright/test';
import { setupPage } from './fixtures.js';

test.describe('Responsive Layout', () => {
  test('narrow viewport stacks panels vertically', async ({ page }) => {
    setupPage(page);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    const panelArea = page.locator('#panel-area');
    const flexDirection = await panelArea.evaluate(el => getComputedStyle(el).flexDirection);
    expect(flexDirection).toBe('column');
  });
});
