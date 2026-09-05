import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  ['/', 'Founder Fork — play a four-turn strategy duel'],
  ['/demo', 'Demo — Founder Fork'],
  ['/privacy', 'Privacy — Founder Fork'],
  ['/terms', 'Terms — Founder Fork'],
  ['/missing-page', 'Page not found — Founder Fork'],
  ['/404.html', 'Page not found — Founder Fork'],
] as const;

for (const [path, title] of routes) {
  test(`route ${path} has its own title, one h1, landmarks, and no serious axe findings`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
    expect(serious).toEqual([]);
    expect(consoleErrors).toEqual([]);
  });
}

test('keyboard focus is visible and the settings dialog returns focus', async ({ page }) => {
  await page.goto('/demo');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.getByRole('button', { name: 'Settings' }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog', { name: 'Game settings' })).toBeVisible();
  await expect(page.getByLabel('Sound')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Settings' })).toBeFocused();
});

test('phone layout has no horizontal overflow and every visible control is at least 44px', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto('/demo');
  const sizes = await page.locator('a[href], button, input').evaluateAll((elements) => elements.flatMap((element) => {
    const box = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (box.width === 0 || box.height === 0 || style.display === 'none' || style.visibility === 'hidden') return [];
    if (element instanceof HTMLInputElement && element.labels?.length) return [];
    return [{ label: element.getAttribute('aria-label') ?? element.textContent?.trim(), width: box.width, height: box.height }];
  }));
  expect(sizes.filter((size) => size.width < 44 || size.height < 44)).toEqual([]);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await context.close();
});

test('the phone first screen states the job, audience, and first action while showing the game', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeInViewport();
  await expect(page.locator('.intro-copy')).toBeInViewport();
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeInViewport();
  await expect(page.locator('.game-board')).toBeInViewport();
  await context.close();
});

test('the demo reflows at 200 percent text size', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('/demo');
  await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Start for real' }).first()).toBeVisible();
  await context.close();
});

test('reduced motion removes animated transition durations', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/demo');
  const duration = await page.locator('.bet-button').first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
  await context.close();
});
