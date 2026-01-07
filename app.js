/* ===========================================
   CODE QUEST: ADVENTURES WITH AI
   Main JavaScript - Game Logic & Interactivity
   =========================================== */

// ===========================================
// GAME STATE
// ===========================================
const GAME_STATE_KEY = 'claudequest_save';
const XP_PER_LEVEL = [0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000];

let gameState = {
    playerName: '',
    currentXP: 0,
    playerLevel: 1,
    coins: 0,
    currentLevel: 'home',
    unlockedLevels: ['home', '1'],
    completedLevels: [],
    completedChallenges: [],
    unlockedBadges: [],
    projectIdea: '',
    soundEnabled: true,
    firstVisit: true
};

// ===========================================
// INITIALIZATION
// ===========================================
document.addEventListener('DOMContentLoaded', () => {
    loadGameState();
    initializeUI();
    initializeTerminal();
    initializeEventListeners();
    updateUI();
});

function loadGameState() {
    const saved = localStorage.getItem(GAME_STATE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            gameState = { ...gameState, ...parsed };
        } catch (e) {
            console.error('Failed to load save:', e);
        }
    }
}

function saveGameState() {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
}

// ===========================================
// UI INITIALIZATION
// ===========================================
function initializeUI() {
    // Check if returning player
    if (gameState.playerName && !gameState.firstVisit) {
        document.getElementById('player-setup').style.display = 'none';
        document.getElementById('returning-player').style.display = 'block';
        document.getElementById('display-name').textContent = gameState.playerName;
    }

    // Set active level
    showLevel(gameState.currentLevel);

    // Update navigation
    updateNavigation();

    // Update achievements panel
    updateAchievements();

    // Restore completed challenges visual state
    gameState.completedChallenges.forEach(challengeId => {
        markChallengeComplete(challengeId, false);
    });

    // Check for level completions
    checkAllLevelCompletions();
}

function initializeEventListeners() {
    // Start Quest button
    document.getElementById('start-quest')?.addEventListener('click', startQuest);

    // Continue Quest button
    document.getElementById('continue-quest')?.addEventListener('click', () => {
        showLevel('1');
    });

    // Reset Progress button
    document.getElementById('reset-progress')?.addEventListener('click', resetProgress);

    // Player name input - enter key
    document.getElementById('player-name')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startQuest();
    });

    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const level = btn.dataset.level;
            if (!btn.classList.contains('locked')) {
                showLevel(level);
            }
        });
    });

    // Platform tabs - scoped to parent container
    document.querySelectorAll('.platform-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const platform = tab.dataset.platform;
            const container = tab.closest('.content-section') || tab.closest('.callout-section') || tab.parentElement.parentElement;

            // Only affect tabs/content within this container
            container.querySelectorAll('.platform-tab').forEach(t => t.classList.remove('active'));
            container.querySelectorAll('.platform-content').forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            container.querySelector(`.platform-content[data-platform="${platform}"]`)?.classList.add('active');
        });
    });

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                btn.textContent = '✓ Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = '📋 Copy';
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // Challenge complete buttons
    document.querySelectorAll('.challenge-complete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.challenge-card, .project-status, .boss-check, .epic-status');
            const challengeId = card?.dataset.challenge;
            if (challengeId && !gameState.completedChallenges.includes(challengeId)) {
                completeChallenge(challengeId);
            }
        });
    });

    // Next level buttons
    document.getElementById('next-level-1')?.addEventListener('click', () => {
        unlockLevel('2');
        showLevel('2');
    });
    document.getElementById('next-level-2')?.addEventListener('click', () => {
        unlockLevel('3');
        showLevel('3');
    });
    document.getElementById('next-level-3')?.addEventListener('click', () => {
        unlockLevel('4');
        showLevel('4');
    });
    document.getElementById('next-level-4')?.addEventListener('click', () => {
        unlockLevel('5');
        showLevel('5');
    });

    // Save idea button
    document.getElementById('save-idea')?.addEventListener('click', () => {
        const idea = document.getElementById('project-idea').value;
        gameState.projectIdea = idea;
        saveGameState();
        showXPPopup('+10 XP - Idea Saved!');
        addXP(10);
    });

    // Idea cards click to fill
    document.querySelectorAll('.idea-card').forEach(card => {
        card.addEventListener('click', () => {
            const text = card.querySelector('p').textContent;
            document.getElementById('project-idea').value = text;
        });
    });

    // Certificate button
    document.getElementById('show-certificate')?.addEventListener('click', showCertificate);

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
        });
    });

    // Level up close
    document.getElementById('levelup-close')?.addEventListener('click', () => {
        document.getElementById('levelup-modal').classList.remove('show');
    });

    // Achievements toggle
    document.getElementById('achievements-toggle')?.addEventListener('click', () => {
        document.getElementById('achievements-panel').classList.toggle('open');
    });

    // Sound toggle
    document.getElementById('sound-toggle')?.addEventListener('click', toggleSound);

    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// ===========================================
// GAME LOGIC
// ===========================================
function startQuest() {
    const nameInput = document.getElementById('player-name');
    const name = nameInput.value.trim();

    if (!name) {
        nameInput.style.borderColor = '#ff4466';
        nameInput.placeholder = 'Please enter your name!';
        return;
    }

    gameState.playerName = name;
    gameState.firstVisit = false;
    saveGameState();

    // Animate transition
    document.getElementById('player-setup').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('player-setup').style.display = 'none';
        showLevel('1');
        showXPPopup('Quest Started! +50 XP');
        addXP(50);
    }, 300);
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        localStorage.removeItem(GAME_STATE_KEY);
        location.reload();
    }
}

function showLevel(levelId) {
    gameState.currentLevel = levelId;
    saveGameState();

    // Hide all sections
    document.querySelectorAll('.level-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById(`level-${levelId}`);
    if (target) {
        target.classList.add('active');
    }

    // Update nav
    updateNavigation();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function unlockLevel(levelId) {
    if (!gameState.unlockedLevels.includes(levelId)) {
        gameState.unlockedLevels.push(levelId);
        saveGameState();
        updateNavigation();
    }
}

function completeLevel(levelId) {
    if (!gameState.completedLevels.includes(levelId)) {
        gameState.completedLevels.push(levelId);
        saveGameState();
        updateNavigation();
    }
}

function updateNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const level = btn.dataset.level;

        btn.classList.remove('locked', 'active', 'completed');

        if (!gameState.unlockedLevels.includes(level)) {
            btn.classList.add('locked');
        }

        if (level === gameState.currentLevel) {
            btn.classList.add('active');
        }

        if (gameState.completedLevels.includes(level)) {
            btn.classList.add('completed');
        }
    });

    // Update quest map nodes
    document.querySelectorAll('.map-node').forEach(node => {
        const level = node.dataset.level;
        const statusEl = node.querySelector('.node-status');

        node.classList.remove('completed');

        if (gameState.completedLevels.includes(level)) {
            node.classList.add('completed');
            if (statusEl) statusEl.textContent = 'COMPLETE';
        } else if (gameState.unlockedLevels.includes(level)) {
            if (statusEl) statusEl.textContent = 'UNLOCKED';
        }
    });
}

// ===========================================
// XP & LEVELING SYSTEM
// ===========================================
function addXP(amount) {
    gameState.currentXP += amount;

    // Check for level up
    const newLevel = calculateLevel(gameState.currentXP);
    if (newLevel > gameState.playerLevel) {
        gameState.playerLevel = newLevel;
        showLevelUp(newLevel);
    }

    saveGameState();
    updateUI();
}

function calculateLevel(xp) {
    for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
        if (xp >= XP_PER_LEVEL[i]) {
            return i + 1;
        }
    }
    return 1;
}

function addCoins(amount) {
    gameState.coins += amount;
    saveGameState();
    updateUI();
}

function updateUI() {
    // Update XP display
    document.getElementById('current-xp').textContent = gameState.currentXP;
    document.getElementById('player-level').textContent = gameState.playerLevel;

    // Calculate XP progress
    const currentLevelXP = XP_PER_LEVEL[gameState.playerLevel - 1] || 0;
    const nextLevelXP = XP_PER_LEVEL[gameState.playerLevel] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
    const progress = ((gameState.currentXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

    document.getElementById('next-level-xp').textContent = nextLevelXP;
    document.getElementById('xp-fill').style.width = `${Math.min(progress, 100)}%`;

    // Update coins
    document.getElementById('coins').textContent = gameState.coins;
}

function showXPPopup(text) {
    const popup = document.getElementById('xp-popup');
    popup.querySelector('.xp-amount').textContent = text;
    popup.classList.remove('show');
    void popup.offsetWidth; // Trigger reflow
    popup.classList.add('show');
}

function showLevelUp(newLevel) {
    document.getElementById('new-level').textContent = newLevel;
    document.getElementById('levelup-modal').classList.add('show');
    addCoins(newLevel * 5);
}

// ===========================================
// CHALLENGES & ACHIEVEMENTS
// ===========================================
function completeChallenge(challengeId) {
    if (gameState.completedChallenges.includes(challengeId)) return;

    gameState.completedChallenges.push(challengeId);
    saveGameState();

    // Get XP reward from challenge card
    const card = document.querySelector(`[data-challenge="${challengeId}"]`);
    let xpReward = 10;
    if (card) {
        const rewardText = card.querySelector('.challenge-reward')?.textContent;
        if (rewardText) {
            const match = rewardText.match(/\+(\d+)/);
            if (match) xpReward = parseInt(match[1]);
        }
    }

    markChallengeComplete(challengeId, true);
    showXPPopup(`+${xpReward} XP`);
    addXP(xpReward);

    // Check level completion
    checkAllLevelCompletions();
}

function markChallengeComplete(challengeId, animate = true) {
    const elements = document.querySelectorAll(`[data-challenge="${challengeId}"]`);
    elements.forEach(el => {
        el.classList.add('completed');

        const checkbox = el.querySelector('.challenge-checkbox, .check-box, .status-icon');
        if (checkbox) {
            checkbox.textContent = '✓';
        }
    });
}

function checkAllLevelCompletions() {
    // Level 1 challenges
    const l1Challenges = ['l1-pwd', 'l1-ls', 'l1-cd', 'l1-mkdir', 'l1-navigate'];
    const l1Complete = l1Challenges.every(c => gameState.completedChallenges.includes(c));
    if (l1Complete && !gameState.completedLevels.includes('1')) {
        showLevelComplete(1);
    }

    // Level 2 challenges
    const l2Challenges = ['l2-start', 'l2-hello', 'l2-question', 'l2-helloworld', 'l2-help'];
    const l2Complete = l2Challenges.every(c => gameState.completedChallenges.includes(c));
    if (l2Complete && !gameState.completedLevels.includes('2')) {
        showLevelComplete(2);
    }

    // Level 3 - need at least 4 of 6
    const l3Challenges = ['l3-greeter', 'l3-fortune', 'l3-mathquiz', 'l3-compliment', 'l3-countdown', 'l3-rps'];
    const l3Count = l3Challenges.filter(c => gameState.completedChallenges.includes(c)).length;
    if (l3Count >= 4 && !gameState.completedLevels.includes('3')) {
        showLevelComplete(3);
    }

    // Level 4 - need at least 3 of 6 web app upgrades
    const l4Challenges = ['l4-adventure', 'l4-quiz', 'l4-assistant', 'l4-madlibs', 'l4-timer', 'l4-rps'];
    const l4Count = l4Challenges.filter(c => gameState.completedChallenges.includes(c)).length;
    if (l4Count >= 3 && !gameState.completedLevels.includes('4')) {
        showLevelComplete(4);
    }

    // Level 5 - need all boss level challenges
    const l5Challenges = ['l5-picked', 'l5-basic-working', 'l5-features-added', 'l5-styled', 'l5-showed'];
    const l5Complete = l5Challenges.every(c => gameState.completedChallenges.includes(c));
    if (l5Complete && !gameState.completedLevels.includes('5')) {
        showLevelComplete(5);
    }
}

function showLevelComplete(levelNum) {
    completeLevel(String(levelNum));

    const completeSection = document.getElementById(`level${levelNum}-complete`);
    if (completeSection) {
        completeSection.style.display = 'block';
        completeSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Award badge
    const badges = {
        1: 'terminal',
        2: 'ai',
        3: 'creator',
        4: 'webdev',
        5: 'wizard'
    };

    if (badges[levelNum]) {
        unlockBadge(badges[levelNum]);
    }

    // Bonus XP and coins for level completion
    const bonusXP = levelNum * 50;
    const bonusCoins = levelNum * 10;
    setTimeout(() => {
        showXPPopup(`Level Complete! +${bonusXP} XP`);
        addXP(bonusXP);
        addCoins(bonusCoins);
    }, 500);
}

function unlockBadge(badgeId) {
    if (gameState.unlockedBadges.includes(badgeId)) return;

    gameState.unlockedBadges.push(badgeId);
    saveGameState();
    updateAchievements();
}

function updateAchievements() {
    document.querySelectorAll('.badge-item').forEach(item => {
        const badge = item.dataset.badge;
        if (gameState.unlockedBadges.includes(badge)) {
            item.classList.remove('locked');
            item.classList.add('unlocked');
        }
    });
}

// ===========================================
// TERMINAL SIMULATOR
// ===========================================
let terminalState = {
    currentPath: '/home/guest',
    fileSystem: {
        '/home/guest': {
            type: 'dir',
            contents: ['Documents', 'Downloads', 'Pictures', 'Music', 'Desktop']
        },
        '/home/guest/Documents': {
            type: 'dir',
            contents: ['notes.txt', 'homework']
        },
        '/home/guest/Downloads': {
            type: 'dir',
            contents: ['game.zip', 'song.mp3']
        },
        '/home/guest/Pictures': {
            type: 'dir',
            contents: ['vacation.jpg', 'meme.png']
        },
        '/home/guest/Music': {
            type: 'dir',
            contents: ['playlist.m3u']
        },
        '/home/guest/Desktop': {
            type: 'dir',
            contents: []
        },
        '/home/guest/Documents/homework': {
            type: 'dir',
            contents: ['math.txt', 'science.txt']
        }
    },
    commandHistory: [],
    historyIndex: -1
};

function initializeTerminal() {
    const input = document.getElementById('terminal-input');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            if (command) {
                executeCommand(command);
                terminalState.commandHistory.unshift(command);
                terminalState.historyIndex = -1;
            }
            input.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (terminalState.historyIndex < terminalState.commandHistory.length - 1) {
                terminalState.historyIndex++;
                input.value = terminalState.commandHistory[terminalState.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (terminalState.historyIndex > 0) {
                terminalState.historyIndex--;
                input.value = terminalState.commandHistory[terminalState.historyIndex];
            } else {
                terminalState.historyIndex = -1;
                input.value = '';
            }
        }
    });

    // Focus terminal on click
    document.querySelector('.terminal-container')?.addEventListener('click', () => {
        input.focus();
    });
}

function executeCommand(command) {
    const output = document.getElementById('terminal-output');
    const prompt = getPrompt();

    // Add command to output
    addTerminalLine(`${prompt} ${command}`, 'command');

    // Parse command
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let result = '';
    let resultClass = 'output';

    switch (cmd) {
        case 'pwd':
            result = terminalState.currentPath;
            resultClass = 'success';
            checkTerminalChallenge('l1-pwd');
            break;

        case 'ls':
            const currentDir = terminalState.fileSystem[terminalState.currentPath];
            if (currentDir && currentDir.contents) {
                result = currentDir.contents.join('  ') || '(empty)';
            } else {
                result = '(empty)';
            }
            resultClass = 'output';
            checkTerminalChallenge('l1-ls');
            break;

        case 'cd':
            result = handleCd(args[0]);
            if (result.startsWith('Error')) {
                resultClass = 'error';
            } else {
                resultClass = 'success';
            }
            break;

        case 'mkdir':
            result = handleMkdir(args[0]);
            if (result.startsWith('Error')) {
                resultClass = 'error';
            } else {
                resultClass = 'success';
            }
            break;

        case 'clear':
            output.innerHTML = '';
            addTerminalLine('Terminal cleared.', 'info');
            return;

        case 'help':
            result = 'Available commands: pwd, ls, cd, mkdir, clear, help';
            resultClass = 'info';
            break;

        case 'whoami':
            result = 'guest (Code Quest Adventurer)';
            resultClass = 'success';
            break;

        case 'echo':
            result = args.join(' ');
            break;

        case 'date':
            result = new Date().toLocaleString();
            break;

        default:
            result = `Command not found: ${cmd}. Try 'help' for available commands.`;
            resultClass = 'error';
    }

    if (result) {
        addTerminalLine(result, resultClass);
    }

    // Update prompt
    updateTerminalPrompt();

    // Auto-scroll
    output.scrollTop = output.scrollHeight;
}

function handleCd(target) {
    if (!target || target === '~') {
        terminalState.currentPath = '/home/guest';
        checkTerminalChallenge('l1-cd'); // Going home counts as navigation
        return 'Changed to home directory';
    }

    if (target === '..') {
        const parts = terminalState.currentPath.split('/');
        if (parts.length > 3) {
            parts.pop();
            terminalState.currentPath = parts.join('/');
            return `Changed to ${terminalState.currentPath}`;
        }
        return 'Already at root';
    }

    // Get current directory contents for case-insensitive matching
    const currentDir = terminalState.fileSystem[terminalState.currentPath];
    if (!currentDir) {
        return `Error: Current directory not found`;
    }

    // Find matching directory (case-insensitive)
    let matchedName = null;
    for (const item of currentDir.contents) {
        if (item.toLowerCase() === target.toLowerCase()) {
            matchedName = item;
            break;
        }
    }

    if (!matchedName) {
        return `Error: No such directory: ${target}`;
    }

    // Check if the matched item is a directory
    const newPath = `${terminalState.currentPath}/${matchedName}`;
    if (terminalState.fileSystem[newPath]) {
        terminalState.currentPath = newPath;

        // Check challenges based on target name (case-insensitive)
        const targetLower = target.toLowerCase();
        if (targetLower === 'documents') {
            checkTerminalChallenge('l1-cd');
        }
        if (targetLower === 'claude-quest') {
            checkTerminalChallenge('l1-navigate');
        }

        return `Changed to ${matchedName}`;
    }

    // It's a file, not a directory
    return `Error: '${matchedName}' is not a directory`;
}

function handleMkdir(name) {
    if (!name) {
        return 'Error: Please specify a directory name';
    }

    const newPath = `${terminalState.currentPath}/${name}`;

    if (terminalState.fileSystem[newPath]) {
        return `Error: Directory '${name}' already exists`;
    }

    // Create the directory
    terminalState.fileSystem[newPath] = {
        type: 'dir',
        contents: []
    };

    // Add to parent
    const currentDir = terminalState.fileSystem[terminalState.currentPath];
    if (currentDir) {
        currentDir.contents.push(name);
    }

    // Check challenges - creating any folder or specifically claude-quest
    checkTerminalChallenge('l1-mkdir');


    return `Created directory: ${name}`;
}

function getPrompt() {
    const shortPath = terminalState.currentPath.replace('/home/guest', '~');
    return `guest@claudequest:${shortPath}$`;
}

function updateTerminalPrompt() {
    const promptEl = document.querySelector('.terminal-prompt');
    if (promptEl) {
        promptEl.textContent = getPrompt();
    }
}

function addTerminalLine(text, type = 'output') {
    const output = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = 'terminal-line';

    if (type === 'command') {
        line.innerHTML = `<span class="term-prompt">${getPrompt()}</span> <span class="term-command">${escapeHtml(text.split('$')[1] || text)}</span>`;
    } else {
        line.innerHTML = `<span class="term-${type}">${escapeHtml(text)}</span>`;
    }

    output.appendChild(line);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function checkTerminalChallenge(challengeId) {
    if (!gameState.completedChallenges.includes(challengeId)) {
        completeChallenge(challengeId);
    }
}

// ===========================================
// CERTIFICATE
// ===========================================
function showCertificate() {
    document.getElementById('cert-player-name').textContent = gameState.playerName || 'ADVENTURER';
    document.getElementById('cert-date').textContent = new Date().toLocaleDateString();
    document.getElementById('certificate-modal').classList.add('show');
}

// ===========================================
// SOUND
// ===========================================
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    saveGameState();

    const soundOn = document.querySelector('.sound-on');
    const soundOff = document.querySelector('.sound-off');

    if (gameState.soundEnabled) {
        soundOn.style.display = 'inline';
        soundOff.style.display = 'none';
    } else {
        soundOn.style.display = 'none';
        soundOff.style.display = 'inline';
    }
}

// ===========================================
// UTILITIES
// ===========================================
function playSound(type) {
    if (!gameState.soundEnabled) return;
    // Sound effects would go here if we add audio files
}

// Prevent accidental navigation away
window.addEventListener('beforeunload', () => {
    saveGameState();
});

// Handle visibility change (save when tab hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveGameState();
    }
});
