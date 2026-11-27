// Compiled from wordle.ts (same code, type annotations removed).
// Wordle in Hebrew and English: guess the 5-letter word in 6 tries.
// The language settings (words, keyboard, messages) are in languages.ts.

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

// Higher rank wins when a key has been in several guesses: green beats yellow beats gray.
const RESULT_RANK = { absent: 0, present: 1, correct: 2 };

// ---------------------------------------------------------------- State

let language = LANGUAGES.he;

const game = {
    secretWord: "",
    row: 0,       // index of the row being typed
    guess: "",
    isOver: false,
};

// ---------------------------------------------------------------- Input

function addLetter(letter) {
    if (game.isOver) {
        return;
    }
    if (game.guess.length === WORD_LENGTH) {
        showMessage(language.messages.rowFull);
        return;
    }

    const normalized = letter.toUpperCase();
    getCell(game.row, game.guess.length).textContent = normalized;
    game.guess += normalized;
    showMessage("");
}

function deleteLetter() {
    if (game.isOver || game.guess.length === 0) {
        return;
    }

    game.guess = game.guess.slice(0, -1);
    getCell(game.row, game.guess.length).textContent = "";
}

function submitGuess() {
    if (game.isOver) {
        return;
    }
    if (game.guess.length < WORD_LENGTH) {
        showMessage(language.messages.tooShort);
        return;
    }

    showResults(scoreGuess(game.guess, game.secretWord));

    if (game.guess === game.secretWord) {
        endGame(language.messages.win);
    } else if (game.row === MAX_GUESSES - 1) {
        endGame(language.messages.lose(game.secretWord));
    } else {
        game.row++;
        game.guess = "";
    }
}

function endGame(message) {
    game.isOver = true;
    showMessage(message);

    const newGameButton = element("new-game");
    newGameButton.hidden = false;
    newGameButton.focus(); // so Enter starts the next game
}

// ---------------------------------------------------------------- Scoring

// Scores a guess like the original Wordle: exact matches first, then letters that are
// in the word but elsewhere. Each secret letter is used at most once, so repeated
// letters are handled correctly (guessing "LLAMA" for "HELLO" marks only two L's).
function scoreGuess(guess, secret) {
    const results = new Array(WORD_LENGTH).fill("absent");
    const unmatchedLetters = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === secret[i]) {
            results[i] = "correct";
        } else {
            unmatchedLetters.push(secret[i]);
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (results[i] === "correct") {
            continue;
        }
        const index = unmatchedLetters.indexOf(guess[i]);
        if (index !== -1) {
            results[i] = "present";
            unmatchedLetters.splice(index, 1);
        }
    }
    return results;
}

// ---------------------------------------------------------------- Drawing

function element(id) {
    const found = document.getElementById(id);
    if (!found) {
        throw new Error(`Missing element #${id}`);
    }
    return found;
}

function getCell(row, column) {
    return element("board").children[row].children[column];
}

function showMessage(text) {
    element("message").textContent = text;
}

// The colors themselves are in styles.css ([data-result="..."]).
function showResults(results) {
    results.forEach((result, i) => {
        getCell(game.row, i).dataset.result = result;
        updateKey(game.guess[i], result);
    });
}

function updateKey(letter, result) {
    const key = document.querySelector(`.key[data-letter="${letter}"]`);
    if (!key) {
        return;
    }
    const current = key.dataset.result;
    if (!current || RESULT_RANK[result] > RESULT_RANK[current]) {
        key.dataset.result = result;
    }
}

// ---------------------------------------------------------------- Setup

function buildBoard() {
    const board = element("board");
    for (let row = 0; row < MAX_GUESSES; row++) {
        const rowElement = document.createElement("div");
        rowElement.className = "row";
        for (let column = 0; column < WORD_LENGTH; column++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            rowElement.append(cell);
        }
        board.append(rowElement);
    }
}

function createKey(label, onClick, extraClass = "") {
    const key = document.createElement("button");
    key.type = "button";
    key.className = `key ${extraClass}`.trim();
    key.textContent = label;
    key.addEventListener("click", onClick);
    return key;
}

function buildKeyboard() {
    const keyboard = element("keyboard");
    keyboard.replaceChildren();

    language.keyboardRows.forEach((letters, index) => {
        const row = document.createElement("div");
        row.className = "keyboard-row";
        const isLastRow = index === language.keyboardRows.length - 1;

        if (isLastRow) {
            row.append(createKey(language.enterLabel, submitGuess, "wide"));
        }
        for (const letter of letters) {
            const key = createKey(letter, () => addLetter(letter));
            key.dataset.letter = letter;
            row.append(key);
        }
        if (isLastRow) {
            const deleteKey = createKey("⌫", deleteLetter, "wide");
            deleteKey.setAttribute("aria-label", "Delete");
            row.append(deleteKey);
        }
        keyboard.append(row);
    });
}

function startNewGame() {
    const words = language.secretWords;
    game.secretWord = words[Math.floor(Math.random() * words.length)];
    game.row = 0;
    game.guess = "";
    game.isOver = false;

    document.querySelectorAll(".cell, .key").forEach((tile) => {
        if (tile.classList.contains("cell")) {
            tile.textContent = "";
        }
        delete tile.dataset.result;
    });
    showMessage("");
    element("new-game").hidden = true;
}

// Fills the "How to play" dialog with the current language's text.
function fillHelp() {
    const help = language.help;
    element("help-title").textContent = help.title;
    element("help-rules").replaceChildren(...help.rules.map((rule) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = rule;
        return paragraph;
    }));
    element("help-correct").textContent = help.correct;
    element("help-present").textContent = help.present;
    element("help-absent").textContent = help.absent;
    element("help-close").textContent = help.close;
}

function setLanguage(code) {
    language = LANGUAGES[code];
    document.documentElement.lang = code;
    document.documentElement.dir = language.direction;
    element("title").textContent = language.title;
    element("language-switch").textContent = language.switchLabel;
    element("new-game").textContent = language.newGameLabel;
    fillHelp();

    buildKeyboard();
    startNewGame();
}

// Physical keyboard: Enter, Backspace and letters of the current language.
function onKeyDown(event) {
    const helpDialog = element("help");
    if (helpDialog.open || game.isOver) {
        return; // the dialog or the New game button handles the keys
    }

    if (event.key === "Enter") {
        event.preventDefault(); // otherwise Enter also "clicks" the last on-screen key pressed
        submitGuess();
    } else if (event.key === "Backspace") {
        deleteLetter();
    } else if (language.letterPattern.test(event.key)) {
        addLetter(event.key);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buildBoard();
    setLanguage("he");

    const switchButton = element("language-switch");
    switchButton.addEventListener("click", () => {
        setLanguage(language === LANGUAGES.he ? "en" : "he");
        switchButton.blur(); // so Enter submits a guess instead of switching again
    });

    element("new-game").addEventListener("click", startNewGame);

    const helpDialog = element("help");
    element("help-button").addEventListener("click", () => helpDialog.showModal());
    element("help-close").addEventListener("click", () => helpDialog.close());
    helpDialog.addEventListener("close", () => element("help-button").blur());

    document.addEventListener("keydown", onKeyDown);
});
