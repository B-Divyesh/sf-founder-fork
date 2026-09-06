import { expect, test, type Page } from '@playwright/test';

async function chooseAndResolve(page: Page, bet: 'learn' | 'build' | 'buzz' = 'learn', laneIndex = 0): Promise<void> {
  await page.locator(`[data-bet="${bet}"]`).click();
  await page.locator('[data-lane]').nth(laneIndex).click();
  await page.getByRole('button', { name: /Resolve turn/ }).click();
}

test('@claim:four-turn-end a sample match reaches a non-draw end screen after four turns', async ({ page }) => {
  await page.goto('/demo');
  await chooseAndResolve(page, 'buzz', 2);
  await chooseAndResolve(page, 'learn', 0);
  await expect(page.getByText('Match complete')).toBeVisible();
  const outcome = await page.locator('.end-screen').getAttribute('data-outcome');
  expect(['You win', 'Opponent wins']).toContain(outcome);
  await expect(page.locator('.turn-ledger li')).toHaveCount(4);
});

test('@claim:restart-reset restart clears turns, scores, and tokens', async ({ page }) => {
  await page.goto('/demo');
  await chooseAndResolve(page, 'learn', 0);
  await page.getByRole('button', { name: 'Restart match' }).click();
  await page.getByRole('button', { name: 'Restart match', exact: true }).last().click();
  await expect(page.locator('.turn-track .current')).toContainText('1');
  await expect(page.locator('.turn-ledger li')).toHaveCount(0);
  await expect(page.locator('[data-score="player"]')).toHaveText('0');
  await expect(page.locator('.resource-token')).toHaveCount(0);
});

test('@claim:settings-persist real-game sound and motion settings survive reload', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Start for real' }).first().click();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByLabel('Sound')).not.toBeChecked();
  await page.getByLabel('Sound').check();
  await page.getByLabel('Motion').uncheck();
  await page.getByRole('button', { name: 'Save settings' }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByLabel('Sound')).toBeChecked();
  await expect(page.getByLabel('Motion')).not.toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
});

test('@claim:third-party-requests a full match makes no cross-origin requests', async ({ page }) => {
  const origins = new Set<string>();
  page.on('request', (request) => origins.add(new URL(request.url()).origin));
  await page.goto('/demo');
  await chooseAndResolve(page, 'buzz', 2);
  await chooseAndResolve(page, 'learn', 0);
  expect([...origins]).toEqual(['http://127.0.0.1:4173']);
});

test('@claim:local-progress daily progress is restored from this browser', async ({ page }) => {
  await page.goto('/');
  await chooseAndResolve(page, 'build', 1);
  const stored = await page.evaluate(() => localStorage.getItem('founder-fork:game:v1'));
  expect(stored).not.toBeNull();
  await page.reload();
  await expect(page.locator('.turn-ledger li')).toHaveCount(1);
  await expect(page.locator('.turn-track .current')).toContainText('2');
});

test('@claim:demo-sandbox demo play and reset do not change a saved daily match', async ({ page }) => {
  await page.goto('/');
  await chooseAndResolve(page, 'build', 1);
  const before = await page.evaluate(() => localStorage.getItem('founder-fork:game:v1'));
  await page.goto('/demo');
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await chooseAndResolve(page, 'buzz', 2);
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await page.getByRole('link', { name: 'Start for real' }).first().click();
  const after = await page.evaluate(() => localStorage.getItem('founder-fork:game:v1'));
  expect(after).toBe(before);
  await expect(page.locator('.turn-ledger li')).toHaveCount(1);
});

test('@claim:async-challenge a second client faces the creator’s four hidden choices', async ({ browser, page }) => {
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Start for real' }).first().click();
  const creatorPlan = ['learn', 'build', 'buzz', 'learn'] as const;
  for (let turn = 0; turn < 4; turn += 1) await chooseAndResolve(page, creatorPlan[turn], turn % 3);
  await page.getByRole('button', { name: 'Create challenge link' }).click();
  const challengeUrl = await page.getByLabel('Friend challenge link').inputValue();

  const friendContext = await browser.newContext();
  const friendPage = await friendContext.newPage();
  await friendPage.goto(challengeUrl);
  await chooseAndResolve(friendPage, 'learn', 0);
  await friendPage.reload();
  await expect(friendPage.locator('.turn-ledger li')).toHaveCount(1);
  for (let turn = 1; turn < 4; turn += 1) await chooseAndResolve(friendPage, 'learn', 0);
  const rows = await friendPage.locator('.turn-ledger li').allTextContents();
  expect(rows[0]).toContain('vs Learn');
  expect(rows[1]).toContain('vs Build');
  expect(rows[2]).toContain('vs Buzz');
  expect(rows[3]).toContain('vs Learn');
  await friendContext.close();
});

test('@claim:keyboard-play number, letter, and Enter keys resolve a turn', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('1');
  await page.keyboard.press('q');
  await page.keyboard.press('Enter');
  await expect(page.locator('.turn-ledger li')).toHaveCount(3);
  await expect(page.locator('.turn-track .current')).toContainText('4');
});

test('@claim:keyboard-controls Enter follows focused links and Space activates focused buttons', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Founder Fork' })).toBeFocused();
  const sampleLink = page.getByRole('link', { name: 'Try it with sample data' });
  await sampleLink.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/demo$/);

  await chooseAndResolve(page, 'buzz', 2);
  const reset = page.getByRole('button', { name: 'Reset demo' });
  await reset.focus();
  await page.keyboard.press('Space');
  await expect(page.locator('.turn-ledger li')).toHaveCount(2);
  await expect(page.locator('.turn-track .current')).toContainText('3');
});

test('@claim:frame-rate board loop stays within the 60 fps target margin on a phone viewport', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const session = await context.newCDPSession(page);
  await session.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.goto('/demo');
  await page.waitForTimeout(2_500);
  const fps = Number(await page.evaluate(() => document.documentElement.dataset.fps));
  expect(fps).toBeGreaterThanOrEqual(45);
  expect(fps).toBeLessThanOrEqual(75);
  await context.close();
});

test('@claim:daily-seed a reload keeps the same board, event, and opponent placement', async ({ page }) => {
  await page.goto('/');
  const before = await page.locator('.section-kicker, .event-card, .lane-options').allTextContents();
  await page.reload();
  const after = await page.locator('.section-kicker, .event-card, .lane-options').allTextContents();
  expect(after).toEqual(before);
});

test('@claim:free-play a visitor completes the sample without an account or payment step', async ({ page }) => {
  await page.goto('/demo');
  await chooseAndResolve(page, 'buzz', 2);
  await chooseAndResolve(page, 'learn', 0);
  await expect(page.locator('.end-screen')).toBeVisible();
  await expect(page.getByRole('link', { name: /checkout|sign in|create account/i })).toHaveCount(0);
});

test('@claim:five-minute-match the automated full match completes well inside five minutes', async ({ page }) => {
  const started = Date.now();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Restart match' }).click();
  await page.getByRole('button', { name: 'Restart match', exact: true }).last().click();
  for (let turn = 0; turn < 4; turn += 1) await chooseAndResolve(page, 'learn', turn % 3);
  await expect(page.locator('.end-screen')).toBeVisible();
  expect(Date.now() - started).toBeLessThan(300_000);
});
