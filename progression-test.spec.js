const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Level Progression Bug Test', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage before navigation
        await page.addInitScript(() => {
            localStorage.clear();
        });
        const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
        await page.goto(filePath);
    });

    async function dismissModal(page) {
        // Try to close any open modal
        const modal = page.locator('.modal.show');
        if (await modal.isVisible()) {
            await page.click('.modal.show', { position: { x: 10, y: 10 } }); // Click edge to close
            await page.waitForTimeout(300);
        }
        // Also try clicking the close button if modal still open
        const closeBtn = page.locator('.modal.show .modal-close');
        if (await closeBtn.isVisible()) {
            await closeBtn.click();
            await page.waitForTimeout(200);
        }
        // Try levelup close
        const levelupClose = page.locator('#levelup-close');
        if (await levelupClose.isVisible()) {
            await levelupClose.click();
            await page.waitForTimeout(200);
        }
    }

    test('complete Level 3 mini-projects and check if level-complete section appears', async ({ page }) => {
        // Set up completed state via init script
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 500,
                playerLevel: 3,
                coins: 50,
                currentLevel: '3',
                unlockedLevels: ['home', '1', '2', '3'],
                completedLevels: ['1', '2'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help'
                ],
                unlockedBadges: ['terminal', 'ai'],
                projectIdea: '',
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        // Reload page to pick up the injected state
        await page.reload();
        await page.waitForTimeout(500);

        // Verify we're on Level 3
        const level3Section = page.locator('#level-3');
        await expect(level3Section).toHaveClass(/active/);
        console.log('Successfully on Level 3');

        // Verify buttons are visible
        const firstBtn = page.locator('[data-challenge="l3-greeter"] .challenge-complete-btn');
        await expect(firstBtn).toBeVisible();
        console.log('First challenge button is visible');

        // Complete 4 of 6 mini-projects (the threshold)
        const l3Challenges = ['l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment'];
        for (const challengeId of l3Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.click();
            console.log(`Clicked ${challengeId}`);
            await page.waitForTimeout(300);
            await dismissModal(page);
        }

        // Get current game state for debugging
        const gameState = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('claudequest_save') || '{}');
        });
        console.log('Completed challenges:', gameState.completedChallenges);
        console.log('Completed levels:', gameState.completedLevels);

        // Check Level 3 complete section appears
        const level3Complete = page.locator('#level3-complete');
        const isVisible = await level3Complete.isVisible();
        console.log(`Level 3 complete section visible: ${isVisible}`);

        // Take a screenshot to debug
        await page.screenshot({ path: 'level3-after-completion.png', fullPage: true });

        await expect(level3Complete).toBeVisible({ timeout: 2000 });
    });

    test('complete ALL Level 3 mini-projects (6 of 6) and check progression', async ({ page }) => {
        // Set up completed state via init script
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 500,
                playerLevel: 3,
                coins: 50,
                currentLevel: '3',
                unlockedLevels: ['home', '1', '2', '3'],
                completedLevels: ['1', '2'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help'
                ],
                unlockedBadges: ['terminal', 'ai'],
                projectIdea: '',
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        // Reload page to pick up the injected state
        await page.reload();
        await page.waitForTimeout(500);

        // Verify we're on Level 3
        await expect(page.locator('#level-3')).toHaveClass(/active/);

        // Complete ALL 6 mini-projects
        const l3Challenges = ['l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment', 'l3-countdown', 'l3-rps'];
        for (const challengeId of l3Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            console.log(`Clicked ${challengeId}`);
            await page.waitForTimeout(300);
            await dismissModal(page);
        }

        // Get game state
        const gameState = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('claudequest_save') || '{}');
        });
        console.log('Completed challenges:', gameState.completedChallenges);
        console.log('Completed levels:', gameState.completedLevels);

        // Take screenshot
        await page.screenshot({ path: 'level3-all-complete.png', fullPage: true });

        // Check Level 3 complete section appears
        const level3Complete = page.locator('#level3-complete');
        await expect(level3Complete).toBeVisible({ timeout: 2000 });
    });

    test('check if 4 of 6 threshold works correctly', async ({ page }) => {
        // Set up state with 3 level 3 challenges already complete (one below threshold)
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 500,
                playerLevel: 3,
                coins: 50,
                currentLevel: '3',
                unlockedLevels: ['home', '1', '2', '3'],
                completedLevels: ['1', '2'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz'  // Only 3 of 6
                ],
                unlockedBadges: ['terminal', 'ai'],
                projectIdea: '',
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Level 3 complete should NOT be visible yet (only 3 of 4 required)
        const level3Complete = page.locator('#level3-complete');
        const isVisibleBefore = await level3Complete.isVisible();
        console.log(`Level 3 complete visible with 3 challenges: ${isVisibleBefore}`);
        expect(isVisibleBefore).toBe(false);

        // Complete the 4th challenge
        const btn = page.locator('[data-challenge="l3-compliment"] .challenge-complete-btn');
        await btn.scrollIntoViewIfNeeded();
        await btn.click();
        console.log('Clicked 4th challenge');
        await page.waitForTimeout(300);
        await dismissModal(page);

        // Now check if level complete appears
        const isVisibleAfter = await level3Complete.isVisible();
        console.log(`Level 3 complete visible after 4th challenge: ${isVisibleAfter}`);

        // Take screenshot
        await page.screenshot({ path: 'level3-threshold-test.png', fullPage: true });

        await expect(level3Complete).toBeVisible({ timeout: 2000 });
    });
});
