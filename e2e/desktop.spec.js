// @ts-check
const { test, expect } = require('@playwright/test');

// The load event waits on the jspaint.app iframe, which is third-party and
// sometimes slow; everything under test is ready by DOMContentLoaded.
const open = (page) => page.goto('/', { waitUntil: 'domcontentloaded' });

test.describe('desktop', () => {
  test('loads the player, icons and taskbar', async ({ page }) => {
    await open(page);
    await expect(page).toHaveTitle(/Parade/i);

    // Webamp comes from unpkg; if the CDN fails, the player never mounts.
    // #webamp itself has no box; its windows are positioned inside it.
    await expect(page.locator('#webamp #main-window')).toBeVisible({ timeout: 15_000 });
    const playlist = page.locator('#webamp #playlist-window');
    await expect(playlist).toBeVisible();
    await expect(playlist.getByText(/Parade/).first()).toBeVisible();

    for (const icon of ['About This', 'Spotify', 'Links', 'Paint']) {
      await expect(page.locator('.desktop-icon').getByRole('img', { name: icon })).toBeVisible();
    }
    await expect(page.locator('.start-button')).toBeVisible();
    await expect(page.locator('#clock')).toHaveText(/^\d{1,2}:\d{2} (AM|PM)$/);
    await page.screenshot({ path: test.info().outputPath('home.png') });
  });

  test('About opens with its markdown and closes again', async ({ page }) => {
    await open(page);
    const about = page.locator('#aboutWindow');
    await expect(about).toBeHidden();

    await page.locator('.desktop-icon', { hasText: 'About This' }).click();
    await expect(about).toBeVisible();
    // Rendered from content/about.md by marked (jsDelivr).
    await expect(about.getByRole('heading', { name: 'Parade' })).toBeVisible();
    await page.screenshot({ path: test.info().outputPath('about.png') });

    await about.getByRole('button', { name: 'Close' }).click();
    await expect(about).toBeHidden();
  });

  test('Links window shows the credits', async ({ page }) => {
    await open(page);
    await page.locator('.desktop-icon', { hasText: 'Links' }).click();
    const links = page.locator('#inspirationWindow');
    await expect(links).toBeVisible();
    await expect(links.getByRole('heading', { name: 'Thanks' })).toBeVisible();
    await expect(links.getByRole('link', { name: 'Instagram' }).first()).toBeVisible();
  });

  test('Start menu lists the apps and opens one', async ({ page }) => {
    await open(page);
    const menu = page.locator('#start-menu');
    await expect(menu).toBeHidden();

    await page.locator('.start-button').click();
    await expect(menu).toBeVisible();
    for (const app of ['About This', 'Spotify', 'Links', 'Paint', 'Winamp']) {
      await expect(menu.locator('.start-menu-item', { hasText: app })).toBeVisible();
    }
    await page.screenshot({ path: test.info().outputPath('start-menu.png') });

    await menu.locator('.start-menu-item', { hasText: 'Links' }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator('#inspirationWindow')).toBeVisible();
  });

  test('every track file is served', async ({ request }) => {
    for (const track of ['Parade', 'Marusa is sneezing', 'The Boiler', 'Crazy Cat', 'Mukha']) {
      const res = await request.head(`/music/${encodeURIComponent(track)}.wav`);
      expect(res.status(), track).toBe(200);
    }
  });
});
