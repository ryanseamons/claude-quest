const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * Season 2 Level Tests
 */
test.describe('Season 2 Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.clear();
        });
        const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
        await page.goto(filePath);
    });

    async function dismissModal(page) {
        await page.evaluate(() => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
        await page.waitForTimeout(200);
    }

    test('Season 2 unlocks after completing Level 5', async ({ page }) => {
        // Set up state with all Season 1 complete
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 1500,
                playerLevel: 6,
                coins: 150,
                currentLevel: '5',
                unlockedLevels: ['home', '1', '2', '3', '4', '5'],
                completedLevels: ['1', '2', '3', '4', '5'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant',
                    'l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev', 'wizard'],
                soundEnabled: true,
                firstVisit: false,
                season2Unlocked: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Check Season 2 unlock button is visible
        const unlockBtn = page.locator('#unlock-season2');
        await expect(unlockBtn).toBeVisible();
        console.log('✓ Season 2 unlock button is visible');

        // Season 2 nav should be hidden initially
        const nav6 = page.locator('#nav-6');
        const isNav6Hidden = await nav6.evaluate(el => el.style.display === 'none');
        expect(isNav6Hidden).toBe(true);
        console.log('✓ Season 2 nav is hidden before unlock');

        // Click unlock button
        await unlockBtn.click();
        await page.waitForTimeout(500);
        await dismissModal(page);

        // Verify Season 2 nav is now visible
        const isNav6Visible = await nav6.evaluate(el => el.style.display !== 'none');
        expect(isNav6Visible).toBe(true);
        console.log('✓ Season 2 nav is visible after unlock');

        // Verify we're on Level 6
        await expect(page.locator('#level-6')).toHaveClass(/active/);
        console.log('✓ Navigated to Level 6');

        // Take screenshot
        await page.screenshot({ path: 'season2-unlocked.png', fullPage: true });
    });

    test('Level 6 Code Arcade: Complete 3 of 6 to unlock Level 7', async ({ page }) => {
        // Set up state at Level 6
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 1600,
                playerLevel: 7,
                coins: 200,
                currentLevel: '6',
                unlockedLevels: ['home', '1', '2', '3', '4', '5', '6'],
                completedLevels: ['1', '2', '3', '4', '5'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant',
                    'l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev', 'wizard'],
                soundEnabled: true,
                firstVisit: false,
                season2Unlocked: true
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Verify we're on Level 6
        await expect(page.locator('#level-6')).toHaveClass(/active/);
        console.log('✓ On Level 6 - Code Arcade');

        // Complete 3 challenges
        const l6Challenges = ['l6-snake', 'l6-pong', 'l6-breakout'];
        for (const id of l6Challenges) {
            await dismissModal(page);
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            console.log(`Completed ${id}`);
            await page.waitForTimeout(200);
        }

        await dismissModal(page);

        // Check Level 6 complete
        const level6Complete = page.locator('#level6-complete');
        await expect(level6Complete).toBeVisible();
        console.log('✓ Level 6 complete section visible');

        // Click continue
        await page.click('#next-level-6', { force: true });
        await page.waitForTimeout(300);

        // Verify on Level 7
        await expect(page.locator('#level-7')).toHaveClass(/active/);
        console.log('✓ Navigated to Level 7 - Space Explorer');
    });

    test('Level 7 Space Explorer: Complete 3 of 6 to unlock Level 8', async ({ page }) => {
        // Set up state at Level 7
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 1900,
                playerLevel: 8,
                coins: 250,
                currentLevel: '7',
                unlockedLevels: ['home', '1', '2', '3', '4', '5', '6', '7'],
                completedLevels: ['1', '2', '3', '4', '5', '6'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant',
                    'l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed',
                    'l6-snake', 'l6-pong', 'l6-breakout'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev', 'wizard', 'arcade'],
                soundEnabled: true,
                firstVisit: false,
                season2Unlocked: true
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Verify we're on Level 7
        await expect(page.locator('#level-7')).toHaveClass(/active/);
        console.log('✓ On Level 7 - Space Explorer');

        // Complete 3 challenges
        const l7Challenges = ['l7-asteroid', 'l7-planets', 'l7-rocket'];
        for (const id of l7Challenges) {
            await dismissModal(page);
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            console.log(`Completed ${id}`);
            await page.waitForTimeout(200);
        }

        await dismissModal(page);

        // Check Level 7 complete
        const level7Complete = page.locator('#level7-complete');
        await expect(level7Complete).toBeVisible();
        console.log('✓ Level 7 complete section visible');

        // Click continue
        await page.click('#next-level-7', { force: true });
        await page.waitForTimeout(300);

        // Verify on Level 8
        await expect(page.locator('#level-8')).toHaveClass(/active/);
        console.log('✓ Navigated to Level 8 - Fantasy Quest');
    });

    test('Level 8 Fantasy Quest: Complete 3 of 7 to finish Season 2', async ({ page }) => {
        // Set up state at Level 8
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 2200,
                playerLevel: 9,
                coins: 310,
                currentLevel: '8',
                unlockedLevels: ['home', '1', '2', '3', '4', '5', '6', '7', '8'],
                completedLevels: ['1', '2', '3', '4', '5', '6', '7'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant',
                    'l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed',
                    'l6-snake', 'l6-pong', 'l6-breakout',
                    'l7-asteroid', 'l7-planets', 'l7-rocket'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev', 'wizard', 'arcade', 'space'],
                soundEnabled: true,
                firstVisit: false,
                season2Unlocked: true
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Verify we're on Level 8
        await expect(page.locator('#level-8')).toHaveClass(/active/);
        console.log('✓ On Level 8 - Fantasy Quest');

        // Complete 3 challenges
        const l8Challenges = ['l8-character', 'l8-battle', 'l8-inventory'];
        for (const id of l8Challenges) {
            await dismissModal(page);
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            console.log(`Completed ${id}`);
            await page.waitForTimeout(200);
        }

        await dismissModal(page);

        // Check Level 8 complete (Season 2 Complete!)
        const level8Complete = page.locator('#level8-complete');
        await expect(level8Complete).toBeVisible();
        console.log('✓ Level 8 / Season 2 complete section visible');

        // Verify badges
        const gameState = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('claudequest_save') || '{}');
        });

        expect(gameState.completedLevels).toContain('8');
        expect(gameState.unlockedBadges).toContain('legendary');
        console.log('✓ Legendary Coder badge unlocked!');
        console.log('🎉 SEASON 2 COMPLETE!');

        await page.screenshot({ path: 'season2-complete.png', fullPage: true });
    });

    test('Full Season 2 playthrough from unlock to completion', async ({ page }) => {
        // Start with Season 1 complete
        await page.addInitScript(() => {
            const state = {
                playerName: 'FullTester',
                currentXP: 1500,
                playerLevel: 6,
                coins: 150,
                currentLevel: '5',
                unlockedLevels: ['home', '1', '2', '3', '4', '5'],
                completedLevels: ['1', '2', '3', '4', '5'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant',
                    'l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev', 'wizard'],
                soundEnabled: true,
                firstVisit: false,
                season2Unlocked: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Unlock Season 2
        console.log('--- Unlocking Season 2 ---');
        await page.click('#unlock-season2');
        await page.waitForTimeout(500);
        await dismissModal(page);
        console.log('✓ Season 2 unlocked');

        // Level 6
        console.log('--- Level 6: Code Arcade ---');
        for (const id of ['l6-snake', 'l6-pong', 'l6-breakout']) {
            await dismissModal(page);
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            await page.waitForTimeout(150);
        }
        await dismissModal(page);
        await page.click('#next-level-6', { force: true });
        await page.waitForTimeout(300);
        await dismissModal(page);
        console.log('✓ Level 6 complete');

        // Level 7
        console.log('--- Level 7: Space Explorer ---');
        for (const id of ['l7-asteroid', 'l7-planets', 'l7-rocket']) {
            await dismissModal(page);
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            await page.waitForTimeout(150);
        }
        await dismissModal(page);
        await page.click('#next-level-7', { force: true });
        await page.waitForTimeout(300);
        await dismissModal(page);
        console.log('✓ Level 7 complete');

        // Level 8
        console.log('--- Level 8: Fantasy Quest ---');
        for (const id of ['l8-character', 'l8-battle', 'l8-inventory']) {
            await dismissModal(page);
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            await page.waitForTimeout(150);
        }
        await dismissModal(page);
        console.log('✓ Level 8 complete');

        // Verify final state
        const gameState = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('claudequest_save') || '{}');
        });

        expect(gameState.completedLevels).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
        console.log('');
        console.log('🎉 FULL GAME + SEASON 2 COMPLETE! 🎉');
        console.log('Final XP:', gameState.currentXP);
        console.log('Final Badges:', gameState.unlockedBadges);

        await page.screenshot({ path: 'full-game-season2-complete.png', fullPage: true });
    });
});
