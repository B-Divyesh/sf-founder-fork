import { expect, test } from '@playwright/test';

test('daily progress survives a reload', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-bet="build"]').click();
  await page.locator('[data-lane]').nth(1).click();
  await page.getByRole('button', { name: 'Resolve turn 1' }).click();
  const score = await page.locator('[data-score="player"]').textContent();
  await page.reload();
  await expect(page.locator('.turn-ledger li')).toHaveCount(1);
  await expect(page.locator('[data-score="player"]')).toHaveText(score ?? '');
});

test('an unreadable saved match recovers to a fresh board with a clear message', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('founder-fork:game:v1', '{broken'));
  await page.reload();
  await expect(page.locator('.global-notice')).toContainText('could not be read');
  await expect(page.locator('.turn-track .current')).toContainText('1');
  await expect(page.locator('.turn-ledger li')).toHaveCount(0);
});

test('an internally inconsistent saved match recovers before play can break', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-bet="learn"]').click();
  await page.locator('[data-lane]').first().click();
  await page.getByRole('button', { name: 'Resolve turn 1' }).click();
  await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('founder-fork:game:v1') ?? '{}');
    state.playerTokens = {};
    localStorage.setItem('founder-fork:game:v1', JSON.stringify(state));
  });
  await page.reload();
  await expect(page.getByRole('status').first()).toContainText('incomplete');
  await expect(page.locator('.turn-ledger li')).toHaveCount(0);
  await page.locator('[data-bet="learn"]').click();
  await page.locator('[data-lane]').first().click();
  await page.getByRole('button', { name: 'Resolve turn 1' }).click();
  await expect(page.locator('.turn-ledger li')).toHaveCount(1);
});

test('play continues with a clear warning when browser storage rejects a save', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    Storage.prototype.setItem = () => { throw new DOMException('Storage disabled', 'QuotaExceededError'); };
  });
  await page.locator('[data-bet="learn"]').click();
  await page.locator('[data-lane]').first().click();
  await page.getByRole('button', { name: 'Resolve turn 1' }).click();
  await expect(page.locator('.global-notice')).toContainText('blocked saving');
  await expect(page.locator('.turn-ledger li')).toHaveCount(1);
});

test('privacy deletion is confirmed and removes both saved keys', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    localStorage.setItem('founder-fork:game:v1', 'saved-match');
    localStorage.setItem('founder-fork:settings:v1', JSON.stringify({ sound: true, motion: false }));
    localStorage.setItem('founder-fork:challenge:v1:sample', 'saved-challenge');
  });
  await page.goto('/privacy');
  await page.getByRole('button', { name: 'Clear saved game and settings' }).click();
  await expect(page.getByRole('dialog', { name: 'Clear saved game and settings?' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep saved data' }).click();
  expect(await page.evaluate(() => localStorage.getItem('founder-fork:game:v1'))).not.toBeNull();
  await page.getByRole('button', { name: 'Clear saved game and settings' }).click();
  await page.getByRole('button', { name: 'Clear saved data' }).click();
  await expect(page.getByRole('status')).toHaveText('Saved game and settings cleared.');
  expect(await page.evaluate(() => [
    localStorage.getItem('founder-fork:game:v1'),
    localStorage.getItem('founder-fork:settings:v1'),
    localStorage.getItem('founder-fork:challenge:v1:sample'),
  ])).toEqual([null, null, null]);
});

test('an invalid challenge explains recovery and links back to the game', async ({ page }) => {
  await page.goto('/challenge/not-valid');
  await expect(page).toHaveTitle('Invalid challenge — Founder Fork');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('This challenge link does not work');
  await page.getByRole('link', { name: 'Return to the game' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('.game-board')).toBeVisible();
});

test('back navigation restores the route and moves focus to its heading', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page).toHaveTitle('Privacy — Founder Fork');
  await page.goBack();
  await expect(page).toHaveTitle('Founder Fork — play a four-turn strategy duel');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page.locator('.route-announcer')).toHaveText('Founder Fork — play a four-turn strategy duel');
});

test('restart returns keyboard focus to the reset game board', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Restart match' }).click();
  await page.getByRole('button', { name: 'Restart match', exact: true }).last().click();
  await expect(page.locator('.game-board')).toBeFocused();
});

test('a resolved turn is announced with both point changes', async ({ page }) => {
  await page.goto('/demo');
  await page.locator('[data-bet="learn"]').click();
  await page.locator('[data-lane]').first().click();
  await page.getByRole('button', { name: 'Resolve turn 3' }).click();
  await expect(page.locator('.turn-announcer')).toContainText(/Turn 3 resolved\. You gained \d+ points\. The opponent gained \d+ points\./);
});

test('the static 404 document has a useful return path', async ({ page }) => {
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Founder Fork');
  await expect(page.locator('h1')).toHaveText('This page does not exist');
  await expect(page.getByRole('link', { name: 'Return to the game' })).toHaveAttribute('href', '/');
});

test('every internal navigation link on public routes resolves', async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const route of ['/', '/demo', '/privacy', '/terms', '/404.html']) {
    await page.goto(route);
    for (const href of await page.locator('a[href]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href))) hrefs.add(href);
  }
  const internal = [...hrefs].filter((href) => new URL(href).origin === 'http://127.0.0.1:4173');
  for (const href of internal) {
    const response = await request.get(href);
    expect(response.status(), href).toBeLessThan(400);
  }
});
