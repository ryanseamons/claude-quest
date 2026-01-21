const { test, expect } = require('@playwright/test');
const path = require('path');

/**
 * Comprehensive tests for ALL level unlock transitions
 * Tests both immediate completion and page reload scenarios
 */
test.describe('All Level Unlock Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.clear();
        });
        const filePath = `file://${path.resolve(__dirname, 'index.html')}`;
        await page.goto(filePath);
    });

    async function dismissModal(page) {
        // Try multiple times to dismiss any modal
        for (let i = 0; i < 3; i++) {
            const levelupClose = page.locator('#levelup-close');
            if (await levelupClose.isVisible()) {
                await levelupClose.click();
                await page.waitForTimeout(300);
            }
            const modal = page.locator('.modal.show');
            if (await modal.isVisible()) {
                // Click the modal background to close it
                await page.evaluate(() => {
                    document.querySelectorAll('.modal.show').forEach(m => m.classList.remove('show'));
                });
                await page.waitForTimeout(200);
            }
        }
    }

    // ==========================================
    // LEVEL 1 → LEVEL 2 TESTS
    // ==========================================
    test('Level 1: Complete terminal challenges and unlock Level 2', async ({ page }) => {
        // Start quest
        await page.fill('#player-name', 'TestPlayer');
        await page.click('#start-quest');
        await page.waitForTimeout(500);

        // Complete terminal challenges
        const terminalInput = page.locator('#terminal-input');

        await terminalInput.fill('pwd');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);

        await terminalInput.fill('ls');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);

        await terminalInput.fill('cd Documents');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);

        await terminalInput.fill('mkdir claude-quest');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);

        await terminalInput.fill('cd claude-quest');
        await terminalInput.press('Enter');
        await page.waitForTimeout(500);

        // Check Level 1 complete
        const level1Complete = page.locator('#level1-complete');
        await expect(level1Complete).toBeVisible();
        console.log('✓ Level 1 complete section visible');

        // Dismiss any modals
        await dismissModal(page);

        // Click continue to Level 2
        await page.click('#next-level-1');
        await page.waitForTimeout(300);

        // Verify on Level 2
        await expect(page.locator('#level-2')).toHaveClass(/active/);
        console.log('✓ Successfully navigated to Level 2');
    });

    test('Level 1: Reload after completion shows continue button', async ({ page }) => {
        // Set up completed Level 1 state
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 150,
                playerLevel: 2,
                coins: 20,
                currentLevel: '1',
                unlockedLevels: ['home', '1'],
                completedLevels: ['1'],
                completedChallenges: ['l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate'],
                unlockedBadges: ['terminal'],
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Level 1 complete section should be visible
        const level1Complete = page.locator('#level1-complete');
        await expect(level1Complete).toBeVisible();
        console.log('✓ Level 1 complete section visible on reload');

        // Level 2 should be unlocked in nav
        const level2Nav = page.locator('.nav-btn[data-level="2"]');
        const isLocked = await level2Nav.evaluate(el => el.classList.contains('locked'));
        expect(isLocked).toBe(false);
        console.log('✓ Level 2 nav is unlocked');
    });

    // ==========================================
    // LEVEL 2 → LEVEL 3 TESTS
    // ==========================================
    test('Level 2: Complete all challenges and unlock Level 3', async ({ page }) => {
        // Set up at Level 2
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 150,
                playerLevel: 2,
                coins: 20,
                currentLevel: '2',
                unlockedLevels: ['home', '1', '2'],
                completedLevels: ['1'],
                completedChallenges: ['l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate'],
                unlockedBadges: ['terminal'],
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Complete all Level 2 challenges
        const l2Challenges = ['l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help'];
        for (const challengeId of l2Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(200);
            await dismissModal(page);
        }

        // Check Level 2 complete
        const level2Complete = page.locator('#level2-complete');
        await expect(level2Complete).toBeVisible();
        console.log('✓ Level 2 complete section visible');

        // Click continue to Level 3
        await page.click('#next-level-2');
        await page.waitForTimeout(300);

        // Verify on Level 3
        await expect(page.locator('#level-3')).toHaveClass(/active/);
        console.log('✓ Successfully navigated to Level 3');
    });

    test('Level 2: Reload after completion shows continue button', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 300,
                playerLevel: 2,
                coins: 40,
                currentLevel: '2',
                unlockedLevels: ['home', '1', '2'],
                completedLevels: ['1', '2'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help'
                ],
                unlockedBadges: ['terminal', 'ai'],
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        const level2Complete = page.locator('#level2-complete');
        await expect(level2Complete).toBeVisible();
        console.log('✓ Level 2 complete section visible on reload');

        const level3Nav = page.locator('.nav-btn[data-level="3"]');
        const isLocked = await level3Nav.evaluate(el => el.classList.contains('locked'));
        expect(isLocked).toBe(false);
        console.log('✓ Level 3 nav is unlocked');
    });

    // ==========================================
    // LEVEL 3 → LEVEL 4 TESTS (4 of 6 threshold)
    // ==========================================
    test('Level 3: Complete exactly 4 of 6 mini-projects and unlock Level 4', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 400,
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
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Complete exactly 4 mini-projects (threshold)
        const l3Challenges = ['l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment'];
        for (const challengeId of l3Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(200);
            await dismissModal(page);
        }

        const level3Complete = page.locator('#level3-complete');
        await expect(level3Complete).toBeVisible();
        console.log('✓ Level 3 complete with 4 of 6 mini-projects');

        // Force dismiss all modals before clicking continue
        await page.evaluate(() => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
        await page.waitForTimeout(200);

        await page.click('#next-level-3', { force: true });
        await page.waitForTimeout(300);

        await expect(page.locator('#level-4')).toHaveClass(/active/);
        console.log('✓ Successfully navigated to Level 4');
    });

    test('Level 3: 3 of 6 mini-projects does NOT unlock Level 4', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 400,
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
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Complete only 3 mini-projects (below threshold)
        const l3Challenges = ['l3-greeter', 'l3-fortune', 'l3-mathquiz'];
        for (const challengeId of l3Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(200);
            await dismissModal(page);
        }

        const level3Complete = page.locator('#level3-complete');
        const isVisible = await level3Complete.isVisible();
        expect(isVisible).toBe(false);
        console.log('✓ Level 3 NOT complete with only 3 of 6 mini-projects');
    });

    test('Level 3: Reload after completion shows continue button', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 550,
                playerLevel: 3,
                coins: 60,
                currentLevel: '3',
                unlockedLevels: ['home', '1', '2', '3'],
                completedLevels: ['1', '2', '3'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator'],
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        const level3Complete = page.locator('#level3-complete');
        await expect(level3Complete).toBeVisible();
        console.log('✓ Level 3 complete section visible on reload');

        const level4Nav = page.locator('.nav-btn[data-level="4"]');
        const isLocked = await level4Nav.evaluate(el => el.classList.contains('locked'));
        expect(isLocked).toBe(false);
        console.log('✓ Level 4 nav is unlocked');
    });

    // ==========================================
    // LEVEL 4 → LEVEL 5 TESTS (3 of 6 threshold)
    // ==========================================
    test('Level 4: Complete exactly 3 of 6 projects and unlock Level 5', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 700,
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
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Complete exactly 3 projects (threshold)
        const l4Challenges = ['l4-adventure', 'l4-quiz', 'l4-assistant'];
        for (const challengeId of l4Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(200);
            await dismissModal(page);
        }

        const level4Complete = page.locator('#level4-complete');
        await expect(level4Complete).toBeVisible();
        console.log('✓ Level 4 complete with 3 of 6 projects');

        // Force dismiss all modals before clicking continue
        await page.evaluate(() => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
        await page.waitForTimeout(200);

        await page.click('#next-level-4', { force: true });
        await page.waitForTimeout(300);

        await expect(page.locator('#level-5')).toHaveClass(/active/);
        console.log('✓ Successfully navigated to Level 5');
    });

    test('Level 4: 2 of 6 projects does NOT unlock Level 5', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 700,
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
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Complete only 2 projects (below threshold)
        const l4Challenges = ['l4-adventure', 'l4-quiz'];
        for (const challengeId of l4Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(200);
            await dismissModal(page);
        }

        const level4Complete = page.locator('#level4-complete');
        const isVisible = await level4Complete.isVisible();
        expect(isVisible).toBe(false);
        console.log('✓ Level 4 NOT complete with only 2 of 6 projects');
    });

    test('Level 4: Reload after completion shows continue button', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 900,
                playerLevel: 5,
                coins: 100,
                currentLevel: '4',
                unlockedLevels: ['home', '1', '2', '3', '4'],
                completedLevels: ['1', '2', '3', '4'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev'],
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        const level4Complete = page.locator('#level4-complete');
        await expect(level4Complete).toBeVisible();
        console.log('✓ Level 4 complete section visible on reload');

        const level5Nav = page.locator('.nav-btn[data-level="5"]');
        const isLocked = await level5Nav.evaluate(el => el.classList.contains('locked'));
        expect(isLocked).toBe(false);
        console.log('✓ Level 5 nav is unlocked');
    });

    // ==========================================
    // LEVEL 5 COMPLETION TESTS (Boss Level)
    // ==========================================
    test('Level 5: Complete all boss challenges and finish the game', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 1000,
                playerLevel: 5,
                coins: 120,
                currentLevel: '5',
                unlockedLevels: ['home', '1', '2', '3', '4', '5'],
                completedLevels: ['1', '2', '3', '4'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev'],
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Complete all Level 5 boss challenges
        const l5Challenges = ['l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed'];
        for (const challengeId of l5Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(200);
            await dismissModal(page);
        }

        const level5Complete = page.locator('#level5-complete');
        await expect(level5Complete).toBeVisible();
        console.log('✓ Level 5 complete - Game finished!');

        // Verify all levels are marked complete
        const gameState = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('claudequest_save') || '{}');
        });
        expect(gameState.completedLevels).toContain('5');
        expect(gameState.unlockedBadges).toContain('wizard');
        console.log('✓ Wizard badge unlocked');
        console.log('✓ All levels completed:', gameState.completedLevels);
    });

    test('Level 5: Partial completion does NOT finish game', async ({ page }) => {
        await page.addInitScript(() => {
            const state = {
                playerName: 'TestPlayer',
                currentXP: 1000,
                playerLevel: 5,
                coins: 120,
                currentLevel: '5',
                unlockedLevels: ['home', '1', '2', '3', '4', '5'],
                completedLevels: ['1', '2', '3', '4'],
                completedChallenges: [
                    'l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate',
                    'l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help',
                    'l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment',
                    'l4-adventure', 'l4-quiz', 'l4-assistant'
                ],
                unlockedBadges: ['terminal', 'ai', 'creator', 'webdev'],
                soundEnabled: true,
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        // Complete only 4 of 5 boss challenges
        const l5Challenges = ['l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled'];
        for (const challengeId of l5Challenges) {
            const btn = page.locator(`[data-challenge="${challengeId}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(200);
            await dismissModal(page);
        }

        const level5Complete = page.locator('#level5-complete');
        const isVisible = await level5Complete.isVisible();
        expect(isVisible).toBe(false);
        console.log('✓ Level 5 NOT complete with only 4 of 5 boss challenges');
    });

    test('Level 5: Reload after completion shows certificate', async ({ page }) => {
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
                firstVisit: false
            };
            localStorage.setItem('claudequest_save', JSON.stringify(state));
        });

        await page.reload();
        await page.waitForTimeout(500);

        const level5Complete = page.locator('#level5-complete');
        await expect(level5Complete).toBeVisible();
        console.log('✓ Level 5 complete section visible on reload');

        // Check certificate button exists
        const certButton = page.locator('#show-certificate');
        await expect(certButton).toBeVisible();
        console.log('✓ Certificate button is visible');

        // Click to show certificate
        await certButton.click();
        await page.waitForTimeout(300);

        const certModal = page.locator('#certificate-modal');
        await expect(certModal).toHaveClass(/show/);
        console.log('✓ Certificate modal opens');

        await page.screenshot({ path: 'certificate-complete.png', fullPage: true });
    });

    // ==========================================
    // FULL GAME FLOW TEST
    // ==========================================
    test('Full game: Complete entire game from start to finish', async ({ page }) => {
        // Start fresh
        await page.fill('#player-name', 'FullGameTester');
        await page.click('#start-quest');
        await page.waitForTimeout(500);

        // --- LEVEL 1: Terminal ---
        console.log('--- Starting Level 1 ---');
        const terminalInput = page.locator('#terminal-input');
        await terminalInput.fill('pwd');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);
        await terminalInput.fill('ls');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);
        await terminalInput.fill('cd Documents');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);
        await terminalInput.fill('mkdir claude-quest');
        await terminalInput.press('Enter');
        await page.waitForTimeout(100);
        await terminalInput.fill('cd claude-quest');
        await terminalInput.press('Enter');
        await page.waitForTimeout(300);
        await dismissModal(page);
        await page.click('#next-level-1');
        await page.waitForTimeout(300);
        console.log('✓ Level 1 complete');

        // --- LEVEL 2: Meet Claude ---
        console.log('--- Starting Level 2 ---');
        for (const id of ['l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help']) {
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(150);
            await dismissModal(page);
        }
        await page.click('#next-level-2');
        await page.waitForTimeout(300);
        console.log('✓ Level 2 complete');

        // --- LEVEL 3: First Prompts (4 of 6) ---
        console.log('--- Starting Level 3 ---');
        for (const id of ['l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment']) {
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click();
            await page.waitForTimeout(150);
            await dismissModal(page);
        }
        // Force dismiss all modals before clicking continue
        await page.evaluate(() => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
        await page.waitForTimeout(200);
        await page.click('#next-level-3', { force: true });
        await page.waitForTimeout(300);
        await page.evaluate(() => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
        console.log('✓ Level 3 complete');

        // --- LEVEL 4: Level Up (3 of 6) ---
        console.log('--- Starting Level 4 ---');
        for (const id of ['l4-adventure', 'l4-quiz', 'l4-assistant']) {
            await page.evaluate(() => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
            });
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            await page.waitForTimeout(150);
            await dismissModal(page);
        }
        // Force dismiss all modals before clicking continue
        await page.evaluate(() => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
        await page.waitForTimeout(200);
        await page.click('#next-level-4', { force: true });
        await page.waitForTimeout(300);
        await page.evaluate(() => {
            document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
        });
        console.log('✓ Level 4 complete');

        // --- LEVEL 5: Boss Level (all 5) ---
        console.log('--- Starting Level 5 ---');
        for (const id of ['l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed']) {
            await page.evaluate(() => {
                document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
            });
            const btn = page.locator(`[data-challenge="${id}"] .challenge-complete-btn`);
            await btn.scrollIntoViewIfNeeded();
            await btn.click({ force: true });
            await page.waitForTimeout(150);
            await dismissModal(page);
        }
        console.log('✓ Level 5 complete');

        // Verify game complete
        const level5Complete = page.locator('#level5-complete');
        await expect(level5Complete).toBeVisible();

        const gameState = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('claudequest_save') || '{}');
        });

        expect(gameState.completedLevels).toEqual(['1', '2', '3', '4', '5']);
        expect(gameState.unlockedBadges).toContain('wizard');
        console.log('');
        console.log('🎉 FULL GAME COMPLETE! 🎉');
        console.log('Final XP:', gameState.currentXP);
        console.log('Final Coins:', gameState.coins);
        console.log('Badges:', gameState.unlockedBadges);

        await page.screenshot({ path: 'full-game-complete.png', fullPage: true });
    });
});
