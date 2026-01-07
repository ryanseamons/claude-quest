const { test } = require('@playwright/test');
const path = require('path');

test('capture all screens for design review', async ({ page }) => {
    const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
    await page.goto(filePath);

    // Home screen
    await page.screenshot({ path: 'review-home.png', fullPage: true });

    // Start quest and capture Level 1
    await page.fill('#player-name', 'Player1');
    await page.click('#start-quest');
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'review-level1.png', fullPage: true });

    // Scroll to terminal area
    await page.locator('.terminal-container').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'review-terminal.png' });

    // Navigate to home and capture quest map
    await page.click('[data-level="home"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'review-questmap.png', fullPage: true });

    console.log('Design review screenshots captured');
});
