const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Code Quest Site Testing', () => {
    test.beforeEach(async ({ page }) => {
        const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
        await page.goto(filePath);
    });

    test('page loads correctly', async ({ page }) => {
        // Check title
        await expect(page).toHaveTitle('Claude Quest: Adventures with AI');

        // Check main elements exist
        await expect(page.locator('.game-title')).toBeVisible();
        await expect(page.locator('.xp-bar')).toBeVisible();
        await expect(page.locator('.level-nav')).toBeVisible();
    });

    test('welcome screen displays properly', async ({ page }) => {
        // Check welcome elements
        await expect(page.locator('.hero-title')).toContainText('Your AI Adventure Starts Here');
        await expect(page.locator('#player-name')).toBeVisible();
        await expect(page.locator('#start-quest')).toBeVisible();

        // Check quest map
        await expect(page.locator('.quest-map')).toBeVisible();
        await expect(page.locator('.map-node').first()).toBeVisible();
    });

    test('player can start quest', async ({ page }) => {
        // Enter name
        await page.fill('#player-name', 'TestPlayer');

        // Click start
        await page.click('#start-quest');

        // Wait for level 1 to appear
        await page.waitForTimeout(500);

        // Should navigate to Level 1
        await expect(page.locator('#level-1')).toHaveClass(/active/);
    });

    test('terminal simulator works', async ({ page }) => {
        // Start quest first
        await page.fill('#player-name', 'TestPlayer');
        await page.click('#start-quest');
        await page.waitForTimeout(500);

        // Find terminal input
        const terminalInput = page.locator('#terminal-input');
        await expect(terminalInput).toBeVisible();

        // Test pwd command
        await terminalInput.fill('pwd');
        await terminalInput.press('Enter');

        // Check output
        const output = page.locator('#terminal-output');
        await expect(output).toContainText('/home/guest');

        // Test ls command
        await terminalInput.fill('ls');
        await terminalInput.press('Enter');
        await expect(output).toContainText('Documents');

        // Test mkdir command
        await terminalInput.fill('mkdir code-quest');
        await terminalInput.press('Enter');
        await expect(output).toContainText('Created directory');
    });

    test('navigation works correctly', async ({ page }) => {
        // Start quest
        await page.fill('#player-name', 'TestPlayer');
        await page.click('#start-quest');
        await page.waitForTimeout(500);

        // Home should be accessible
        await page.click('[data-level="home"]');
        await expect(page.locator('#level-home')).toHaveClass(/active/);

        // Level 1 should be accessible
        await page.click('[data-level="1"]');
        await expect(page.locator('#level-1')).toHaveClass(/active/);

        // Level 2 should be locked initially
        const level2Btn = page.locator('.nav-btn[data-level="2"]');
        await expect(level2Btn).toHaveClass(/locked/);
    });

    test('copy buttons exist', async ({ page }) => {
        // Verify copy buttons exist in the page (they're on various levels)
        const copyButtons = page.locator('.copy-btn');
        const count = await copyButtons.count();
        expect(count).toBeGreaterThan(0);
    });

    test('platform tabs switch content', async ({ page }) => {
        await page.fill('#player-name', 'TestPlayer');
        await page.click('#start-quest');
        await page.waitForTimeout(500);

        // Click Windows tab within Level 1
        await page.click('#level-1 [data-platform="windows"]');
        await expect(page.locator('#level-1 .platform-content[data-platform="windows"]')).toHaveClass(/active/);

        // Click Linux tab within Level 1
        await page.click('#level-1 [data-platform="linux"]');
        await expect(page.locator('#level-1 .platform-content[data-platform="linux"]')).toHaveClass(/active/);
    });

    test('XP system displays correctly', async ({ page }) => {
        // Check XP elements
        await expect(page.locator('#current-xp')).toBeVisible();
        await expect(page.locator('#player-level')).toBeVisible();
        // xp-bar container should be visible (xp-fill has 0% width initially so it's "hidden")
        await expect(page.locator('.xp-bar')).toBeVisible();
        await expect(page.locator('#coins')).toBeVisible();
    });

    test('achievements panel toggles', async ({ page }) => {
        const panel = page.locator('#achievements-panel');
        const toggle = page.locator('#achievements-toggle');

        // Panel should be closed initially
        await expect(panel).not.toHaveClass(/open/);

        // Click toggle
        await toggle.click();
        await expect(panel).toHaveClass(/open/);

        // Click again to close
        await toggle.click();
        await expect(panel).not.toHaveClass(/open/);
    });

    test('visual check - no broken styles', async ({ page }) => {
        // Take screenshot for visual comparison
        await page.screenshot({ path: 'test-screenshot-home.png', fullPage: true });

        // Start quest and screenshot level 1
        await page.fill('#player-name', 'TestPlayer');
        await page.click('#start-quest');
        await page.waitForTimeout(500);
        await page.screenshot({ path: 'test-screenshot-level1.png', fullPage: true });

        console.log('Screenshots saved for visual review');
    });

    test('responsive design check', async ({ page }) => {
        // Test mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.screenshot({ path: 'test-screenshot-mobile.png', fullPage: true });

        // Check elements are still visible on mobile
        await expect(page.locator('.game-title')).toBeVisible();
        await expect(page.locator('#start-quest')).toBeVisible();

        console.log('Mobile screenshot saved');
    });
});
