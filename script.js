const board = document.getElementById('board');

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

// -------------------- New code below --------------------

let currentRow = 0; // index of the active row
let currentCol = 0; // index within the active row
const MAX_ROWS = 6;
const MAX_COLS = 5;

createTiles(MAX_ROWS, MAX_COLS); // initialize the board

document.addEventListener('keydown', handleKeyPress);

/**
 * Stub validation function. Replace with real dictionary logic.
 * @param {string} word
 * @returns {boolean}
 */
function validateWord(word) {
    return true; // always valid in this stub
}

/** Handle global keydown events */
function handleKeyPress(event) {
    if (currentRow >= MAX_ROWS) {
        return; // board is full
    }

    const key = event.key;

    if (key === 'Backspace') {
        eraseLetter();
    } else if (key === 'Enter') {
        submitRow();
    } else if (/^[a-zA-Z]$/.test(key)) {
        placeLetter(key.toUpperCase());
    }
}

/** Place a letter in the current tile if space is available */
function placeLetter(letter) {
    if (currentCol >= MAX_COLS) {
        return; // row already full
    }
    const tile = board.children[currentRow].children[currentCol];
    tile.textContent = letter;
    currentCol++;
}

/** Remove the last entered letter in the current row */
function eraseLetter() {
    if (currentCol === 0) {
        return; // nothing to erase
    }
    currentCol--;
    const tile = board.children[currentRow].children[currentCol];
    tile.textContent = '';
}

/** Submit the current row if it is filled with letters */
function submitRow() {
    if (currentCol < MAX_COLS) {
        return; // not enough letters
    }

    const word = getCurrentWord();
    if (validateWord(word)) {
        // move to next row on success
        currentRow++;
        currentCol = 0;
    } else {
        flashInvalidRow();
    }
}

/** Collect the word typed in the active row */
function getCurrentWord() {
    let word = '';
    const tiles = board.children[currentRow].children;
    for (let i = 0; i < MAX_COLS; i++) {
        word += tiles[i].textContent;
    }
    return word;
}

/** Flash the active row red for 500 ms */
function flashInvalidRow() {
    const row = board.children[currentRow];
    const original = row.style.backgroundColor;
    row.style.backgroundColor = 'red';
    setTimeout(() => {
        row.style.backgroundColor = original;
    }, 500);
}
