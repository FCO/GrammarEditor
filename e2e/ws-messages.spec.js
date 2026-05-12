import { test, expect } from '@playwright/test';
import { waitForResponse, setupPage } from './fixtures.js';

test.describe('WebSocket Messages', () => {
  test.beforeEach(async ({ page }) => {
    setupPage(page);
  });

  test('grammar and string are sent when content changes', async ({ page }) => {
    const sentMessages = [];
    await page.exposeFunction('captureWsMessage', (msg) => {
      sentMessages.push(JSON.parse(msg));
    });
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await page.evaluate(() => {
      if (typeof ws !== 'undefined' && ws) {
        const orig = ws.send.bind(ws);
        ws.send = function(data) {
          window.captureWsMessage(data);
          return orig(data);
        };
      }
    });
    await page.locator('#grammar-code').fill('token CustomTest { <digit> }');
    await page.waitForTimeout(600);
    const hasCustom = sentMessages.some(m =>
      m && m.grammar && m.grammar.includes('CustomTest')
    );
    expect(hasCustom).toBe(true);
  });

  test('WS message includes actions field when actions editor has content', async ({ page }) => {
    const sentMessages = [];
    await page.exposeFunction('onWsMsg', (msg) => {
      sentMessages.push(JSON.parse(msg));
    });
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await page.evaluate(() => {
      if (typeof ws !== 'undefined' && ws) {
        const orig = ws.send.bind(ws);
        ws.send = function(data) {
          window.onWsMsg(data);
          return orig(data);
        };
      }
    });
    await page.locator('.panel-toggle[data-panel="actions"]').click();
    await page.locator('#actions-code').fill('class Test { method TOP($/) { make $/.Str; } }');
    await page.waitForTimeout(600);
    const hasActions = sentMessages.some(m =>
      m && m.actions && m.actions.includes('class Test')
    );
    expect(hasActions).toBe(true);
  });

  test('WS message omits actions field when actions editor is empty', async ({ page }) => {
    const sentMessages = [];
    await page.exposeFunction('onWsMsg2', (msg) => {
      sentMessages.push(JSON.parse(msg));
    });
    await page.goto('/');
    await page.waitForSelector('#status-bar.connected', { timeout: 5000 });
    await page.evaluate(() => {
      if (typeof ws !== 'undefined' && ws) {
        const orig = ws.send.bind(ws);
        ws.send = function(data) {
          window.onWsMsg2(data);
          return orig(data);
        };
      }
    });
    await page.locator('#string-input').fill('trigger');
    await page.waitForTimeout(600);
    const noActions = sentMessages.some(m =>
      m && !m.actions
    );
    expect(noActions).toBe(true);
  });
});
