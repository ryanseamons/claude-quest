const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Level 4 Progression Test', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.clear();
        });
        const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
        await page.goto(filePath);
    });

    async function dismissModal(page) {
        const levelupClose = page.locator('#levelup-close');
        if (await levelupClose.isVisible()) {
            await levelupClose.click();
            await page.waitForTimeout(200);
        }
        const modal = page.locator('.modal.show');
        if (await modal.isVisible()) {
            await page.click('.modal.show', { position: { x: 10, y: 10 } });
            await page.waitForTimeout(300);
        }
    }

    test('complete Level 4 projects (3 of 6) and check progression', async ({ page }) => {
        // Set up state at Level 4
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 800,
                playerLevel: 4,
                coins: 80,
                currentLevel: '4',
                unlockedLevels: ['home', '1', '2', '3', '4'],
                completedLevels: ['1', '2', '3'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator'],
                projectIdea: '',
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Verify we're on Level 4
        await expect(page.locator('#level-4')).toHaveClass(/active/);
        console.log('Successfully on Level 4');

        // Complete 3 of 6 projects (the threshold)
        const l4Challenges = ['l4-adventure', 'l4-quiz', 'l4-assistant'];
        for (const challengeId of l4Challenges) {
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

        // Check Level 4 complete section
        const level4Complete = page.locator('#level4-complete');
        const isVisible = await level4Complete.isVisible();
        console.log(`Level 4 complete section visible: ${isVisible}`);

        await page.screenshot({ path: 'level4-after-completion.png', fullPage: true });

        await expect(level4Complete).toBeVisible({ timeout: 2000 });
    });

    test('complete ALL Level 4 projects and check progression to Level 5', async ({ page }) => {
        // Set up state at Level 4
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 800,
                playerLevel: 4,
                coins: 80,
                currentLevel: '4',
                unlockedLevels: ['home', '1', '2', '3', '4'],
                completedLevels: ['1', '2', '3'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator'],
                projectIdea: '',
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Verify we're on Level 4
        await expect(page.locator('#level-4')).toHaveClass(/active/);

        // Complete ALL 6 projects
        const l4Challenges = ['l4-adventure', 'l4-quiz', 'l4-assistant', 'l4-madlibs', 'l4-timer', 'l4-rps'];
        for (const challengeId of l4Challenges) {
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
        console.log('L4 Completed challenges:', gameState.completedChallenges.filter(c => c.startsWith('l4')));
        console.log('Completed levels:', gameState.completedLevels);

        // Check Level 4 complete section
        const level4Complete = page.locator('#level4-complete');
        const isVisible = await level4Complete.isVisible();
        console.log(`Level 4 complete section visible: ${isVisible}`);

        await page.screenshot({ path: 'level4-all-complete.png', fullPage: true });

        await expect(level4Complete).toBeVisible({ timeout: 2000 });

        // Now click continue to Level 5
        await page.click('#next-level-4');
        await page.waitForTimeout(500);

        // Verify we're on Level 5
        await expect(page.locator('#level-5')).toHaveClass(/active/);
        console.log('Successfully navigated to Level 5!');
    });

    test('test Continue button from Level 3 to Level 4', async ({ page }) => {
        // Set up state where Level 3 is complete but haven't clicked continue yet
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 600,
                playerLevel: 3,
                coins: 60,
                currentLevel: '3',
                unlockedLevels: ['home', '1', '2', '3'],
                completedLevels: ['1', '2', '3'],  // Level 3 is complete
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment'  // 4 of 6
                ],
                unlockedBadges: ['terminal', 'ai', 'creator'],
                projectIdea: '',
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Check if the Level 3 complete section is visible
        const level3Complete = page.locator('#level3-complete');
        const isVisible = await level3Complete.isVisible();
        console.log(`Level 3 complete section visible on load: ${isVisible}`);

        // Verify Level 4 is NOT unlocked yet in nav
        const level4Nav = page.locator('.nav-btn[data-level="4"]');
        const hasLocked = await level4Nav.evaluate(el => el.classList.contains('locked'));
        console.log(`Level 4 nav is locked: ${hasLocked}`);

        await page.screenshot({ path: 'level3-complete-before-continue.png', fullPage: true });

        // Click continue button
        const continueBtn = page.locator('#next-level-3');
        await continueBtn.scrollIntoViewIfNeeded();
        await continueBtn.click();
        await page.waitForTimeout(500);

        // Check if we're now on Level 4
        const isLevel4Active = await page.locator('#level-4').evaluate(el => el.classList.contains('active'));
        console.log(`Level 4 is active: ${isLevel4Active}`);

        await page.screenshot({ path: 'level3-after-continue.png', fullPage: true });

        await expect(page.locator('#level-4')).toHaveClass(/active/);
        console.log('Successfully navigated to Level 4!');
    });
});
