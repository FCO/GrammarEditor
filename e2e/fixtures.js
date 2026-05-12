export const DEFAULT_GRAMMAR = `unit grammar MyGrammar;

token TOP       { <letter>+ }
token letter    { <vowel> || <consonant> }
token vowel     { <[aeiou]> }
token consonant { <[bcdfghjklmnpqrstvwxyz]> }`;

export const DEFAULT_STRING = `hello`;

export async function waitForResponse(page) {
  await page.waitForTimeout(800);
}

export async function waitForConnected(page) {
  await page.waitForFunction(() => {
    const bar = document.getElementById('status-bar');
    return bar && bar.textContent === 'Connected';
  }, { timeout: 10000 });
}

export async function getGrammarText(page) {
  return page.locator('#grammar-code').inputValue();
}

export async function getStringText(page) {
  return page.locator('#string-input').inputValue();
}

export async function setGrammar(page, code) {
  await page.locator('#grammar-code').fill(code);
  await page.waitForTimeout(400);
}

export async function setString(page, text) {
  await page.locator('#string-input').fill(text);
  await page.waitForTimeout(400);
}

export async function setActions(page, code) {
  await page.locator('#actions-code').fill(code);
  await page.waitForTimeout(400);
}

export function setupPage(page) {
  page.on('pageerror', err => {
    console.error('Page error:', err.message);
  });
}
