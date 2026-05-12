import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', msg => {
    if (msg.type() === 'error') console.log('ERR:', msg.text().slice(0, 300));
});

await page.goto('http://localhost:8000', { waitUntil: 'load', timeout: 120000 });
await page.waitForTimeout(40000);

// Show panels
await page.evaluate(() => {
    ['actions', 'made'].forEach(id => {
        const input = document.querySelector(`.panel-toggle[data-panel="${id}"] input`);
        if (input) input.checked = true;
        const el = document.getElementById(id + '-panel');
        if (el) el.classList.remove('collapsed');
    });
    if (window.updateRightHalf) updateRightHalf();
});

// Simple actions test with default grammar
await page.fill('#actions-code', 'class Actions { method TOP($/) { make "MADE:" ~ $/.Str } }');
await page.waitForTimeout(3000);

const madeText = await page.textContent('#made-body');
console.log('MADE:', madeText.trim() || '(empty)');

const matchText = await page.textContent('#match-body');
console.log('MATCH:', matchText.trim().slice(0, 100));

const errorHTML = await page.innerHTML('#error-bar');
if (errorHTML) console.log('ERROR:', errorHTML);

// Edit actions code to test redeclaration
await page.fill('#actions-code', 'class Actions { method TOP($/) { make "MADE2:" ~ $/.Str } }');
await page.waitForTimeout(3000);

const madeText2 = await page.textContent('#made-body');
console.log('\nAFTER EDIT MADE:', madeText2.trim() || '(empty)');

const errorHTML2 = await page.innerHTML('#error-bar');
if (errorHTML2) console.log('AFTER EDIT ERROR:', errorHTML2);

await browser.close();
