const board = document.getElementById('board');
const mascot = document.getElementById('mascot');
const coinsDisplay = document.getElementById('coins-display');
const streakDisplay = document.getElementById('streak-display');
const mysteryModal = document.getElementById('mystery-modal');
const mysteryMessage = document.getElementById('mystery-message');
const closeMystery = document.getElementById('close-mystery');
const statsBtn = document.getElementById('stats-btn');
const statsModal = document.getElementById('stats-modal');
const trophiesList = document.getElementById('trophies');
const closeStats = document.getElementById('close-stats');
const themeBtn = document.getElementById('theme-btn');

function createTiles(rows = 6, cols = 5) {
    for (let r = 0; r < rows; r++) {
        const row = document.createElement('div');
        row.className = 'row';
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

const SNARKS = [
    "Oh look, a genius among us!",
    "Lucky guess or actual skill?",
    "That was...adequate.",
    "Try not to hurt yourself patting your back.",
    "You must be fun at parties."
];

const WORDS = ["APPLE","BRAIN","CHESS","DODGE","ELITE","FUNNY","GHOST","HAPPY"];

function getDailyWord() {
    const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    return WORDS[day % WORDS.length];
}

let solution = getDailyWord();
let currentRow = 0;
let currentCol = 0;
const MAX_ROWS = 6;
const MAX_COLS = 5;

let currentStreak = parseInt(localStorage.getItem('streak') || '0');
let coins = parseInt(localStorage.getItem('coins') || '0');
updateStats();

createTiles(MAX_ROWS, MAX_COLS);
document.addEventListener('keydown', handleKeyPress);
closeMystery.addEventListener('click', () => mysteryModal.classList.add('hidden'));
statsBtn.addEventListener('click', showTrophies);
closeStats.addEventListener('click', () => statsModal.classList.add('hidden'));

const THEMES = ['dark','cyberpunk','pastel'];
let currentTheme = localStorage.getItem('theme') || 'dark';
document.body.classList.add(currentTheme);
themeBtn.addEventListener('click', () => {
    const idx = (THEMES.indexOf(currentTheme) + 1) % THEMES.length;
    document.body.classList.remove(currentTheme);
    currentTheme = THEMES[idx];
    document.body.classList.add(currentTheme);
    localStorage.setItem('theme', currentTheme);
});

function validateWord(word) {
    return WORDS.includes(word);
}

function handleKeyPress(event) {
    if (currentRow >= MAX_ROWS) return;
    const key = event.key;
    if (key === 'Backspace') {
        eraseLetter();
    } else if (key === 'Enter') {
        submitRow();
    } else if (/^[a-zA-Z]$/.test(key)) {
        placeLetter(key.toUpperCase());
    }
}

function placeLetter(letter) {
    if (currentCol >= MAX_COLS) return;
    const tile = board.children[currentRow].children[currentCol];
    tile.textContent = letter;
    currentCol++;
}

function eraseLetter() {
    if (currentCol === 0) return;
    currentCol--;
    const tile = board.children[currentRow].children[currentCol];
    tile.textContent = '';
}

function submitRow() {
    if (currentCol < MAX_COLS) return;
    const word = getCurrentWord();
    if (!validateWord(word)) {
        flashInvalidRow();
        mascot.textContent = '🙄';
        return;
    }
    if (word === solution) {
        handleWin();
    } else {
        mascot.textContent = '😬';
        currentRow++;
        currentCol = 0;
        if (currentRow === MAX_ROWS) {
            currentStreak = 0;
            localStorage.setItem('streak', currentStreak.toString());
            updateStats();
        }
    }
}

function handleWin() {
    mascot.textContent = '😎';
    currentStreak++;
    localStorage.setItem('streak', currentStreak.toString());
    const reward = (50 + 10 * (MAX_ROWS - 1 - currentRow)) * currentStreak;
    coins += reward;
    localStorage.setItem('coins', coins.toString());
    updateStats();
    showSnark();
    confetti();
    maybeMysteryBox();
    addAchievement('winner');
    currentRow = MAX_ROWS; // prevent further input
}

function getCurrentWord() {
    let word = '';
    const tiles = board.children[currentRow].children;
    for (let i = 0; i < MAX_COLS; i++) {
        word += tiles[i].textContent;
    }
    return word;
}

function flashInvalidRow() {
    const row = board.children[currentRow];
    row.style.backgroundColor = 'red';
    setTimeout(() => { row.style.backgroundColor = ''; }, 500);
}

function showSnark() {
    alert(SNARKS[Math.floor(Math.random() * SNARKS.length)]);
}

function confetti() {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.textContent = '🎉';
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),1000);
    coinFloat();
}

function coinFloat() {
    const c = document.createElement('div');
    c.textContent = '🪙';
    c.style.position = 'fixed';
    c.style.bottom = '20px';
    c.style.left = '50%';
    c.style.animation = 'fade 1s forwards';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(),1000);
}

function maybeMysteryBox() {
    if (Math.random() < 0.25) {
        let msg = '';
        const roll = Math.random();
        if (roll < 0.33) { coins += 20; msg = 'You found 20 coins!'; }
        else if (roll < 0.66) { coins += 50; msg = 'Jackpot! 50 coins!'; }
        else { msg = 'The box was empty. Bummer.'; }
        localStorage.setItem('coins', coins.toString());
        updateStats();
        mysteryMessage.textContent = msg;
        mysteryModal.classList.remove('hidden');
    }
}

function updateStats() {
    coinsDisplay.textContent = `Coins: ${coins}`;
    streakDisplay.textContent = `Streak: ${currentStreak}`;
}

function addAchievement(name) {
    const trophies = JSON.parse(localStorage.getItem('trophies') || '[]');
    if (!trophies.includes(name)) {
        trophies.push(name);
        localStorage.setItem('trophies', JSON.stringify(trophies));
    }
}

function showTrophies() {
    trophiesList.innerHTML = '';
    const trophies = JSON.parse(localStorage.getItem('trophies') || '[]');
    trophies.forEach(t => {
        const li = document.createElement('li');
        li.textContent = t;
        trophiesList.appendChild(li);
    });
    statsModal.classList.remove('hidden');
}
