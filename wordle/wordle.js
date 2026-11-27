// Compiled from wordle.ts (same logic, type annotations removed).
// Wordle in Hebrew and English: guess the 5-letter word in 6 tries.
// Board cells have ids "row-column" (e.g. "1-1" is the first letter of the first row),
// and every on-screen letter key has its letter as its id.

const WORD_LENGTH = 5;
const MAX_ROWS = 6;



// Everything that changes between languages lives here; the game logic below is shared.
const LANGUAGES = {
    he: {
        title: "וורד-לי",
        direction: "rtl",
        switchLabel: "English",
        keyboardRows: ["קראטוןםפ", "שדגכעיחלךף", "זסבהנמצתץ"],
        enterLabel: "הכנס",
        words: [
            "רשימה", "סיפור", "אגודל", "וורדל", "מניפה", "מריצה", "רכישה", "ענבים", "חביות", "מכונה",
            "נקישה", "דפדפן", "בקבוק", "עיתון", "שניצל", "ספורט", "גיטרה", "גאנדי", "מונית", "תופסן",
            "ציפית", "שטרות", "מכולת", "מנורה", "יהודי", "ברירה", "ערכים", "בחינה", "שרביט", "שולחן",
            "רובוט", "מכלול", "פרחים", "בורגר", "מוותר", "צדדים", "מילון", "מטריה", "פגיעה", "זינוק",
            "זרנוק", "סגנון", "ציפור", "נקיון", "אתמול", "אתרוג", "מספיק", "מפליק", "מצדיק", "מפליל",
            "תלמיד", "תרמיל", "תרשים", "חתולה", "אפרוח",
        ],
        letterPattern: /^[א-ת]$/,
        messages: {
            rowFull: "השורה כבר מלאה",
            tooShort: "צריך חמש אותיות",
            notAWord: "המילה הזו לא קיימת במאגר",
            win: "כל הכבוד, אתה קוסם אמיתי! ניחשת נכון את המילה וניצחת!",
            lose: (word) => `לא הצלחת לנחש הפעם :( המילה הייתה ${word}. רענן את הדף כדי לשחק שוב`,
        },
    },
    en: {
        title: "Wordle",
        direction: "ltr",
        switchLabel: "עברית",
        keyboardRows: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
        enterLabel: "ENTER",
        words: [
            "APPLE", "BEACH", "BRAIN", "BREAD", "BRICK", "CHAIR", "CHESS", "CLOUD", "CRANE", "DANCE",
            "DREAM", "EAGLE", "EARTH", "FLAME", "FROST", "FRUIT", "GHOST", "GLASS", "GRAPE", "HEART",
            "HORSE", "HOUSE", "JUICE", "KNIFE", "LEMON", "LIGHT", "MAGIC", "MONEY", "MOUSE", "MUSIC",
            "NIGHT", "OCEAN", "PAINT", "PIANO", "PILOT", "PIZZA", "PLANT", "QUEEN", "RIVER", "ROBOT",
            "SHEEP", "SHIRT", "SNAKE", "SPACE", "SPOON", "STONE", "STORM", "SUGAR", "TABLE", "TIGER",
            "TOAST", "TRAIN", "WATER", "WHALE", "WORLD", "ZEBRA", "BLOCK", "SWORD", "CROWN", "TOWER",
        ],
        letterPattern: /^[a-zA-Z]$/,
        messages: {
            rowFull: "The row is already full",
            tooShort: "Five letters needed",
            notAWord: "That word isn't in the list",
            win: "Well done, you guessed the word!",
            lose: (word) => `Out of tries :( The word was ${word}. Switch language or refresh to play again`,
        },
    },
};

const COLORS = {
    correct: "#538d4e", // right letter, right place
    present: "#b59f3b", // right letter, wrong place
    absent: "#3a3a3c",  // letter not in the word
};

let language = LANGUAGES.he;

const game = {
    secretWord: "",
    row: 1,
    guess: "",
    isOver: false,
};

function pickRandomWord() {
    return language.words[Math.floor(Math.random() * language.words.length)];
}

function getCell(row, column) {
    return document.getElementById(`${row}-${column}`);
}

function showMessage(text) {
    const message = document.getElementById("message");
    if (message) {
        message.textContent = text;
    }
}

function addLetter(letter) {
    if (game.isOver) {
        return;
    }
    if (game.guess.length === WORD_LENGTH) {
        showMessage(language.messages.rowFull);
        return;
    }

    const normalized = letter.trim().toUpperCase();
    game.guess += normalized;
    const cell = getCell(game.row, game.guess.length);
    if (cell) {
        cell.textContent = normalized;
    }
    showMessage("");
}

function deleteLetter() {
    if (game.isOver || game.guess.length === 0) {
        return;
    }

    const cell = getCell(game.row, game.guess.length);
    if (cell) {
        cell.textContent = "";
    }
    game.guess = game.guess.slice(0, -1);
}

function submitGuess() {
    if (game.isOver) {
        return;
    }
    if (game.guess.length < WORD_LENGTH) {
        showMessage(language.messages.tooShort);
        return;
    }
    if (!language.words.includes(game.guess)) {
        showMessage(language.messages.notAWord);
        return;
    }

    paintRow(scoreGuess(game.guess, game.secretWord));

    if (game.guess === game.secretWord) {
        game.isOver = true;
        showMessage(language.messages.win);
        return;
    }
    if (game.row === MAX_ROWS) {
        game.isOver = true;
        showMessage(language.messages.lose(game.secretWord));
        return;
    }

    game.row++;
    game.guess = "";
}

// Scores a guess like the original Wordle: exact matches first, then
// "present" letters, each secret letter used at most once (handles repeated letters).
function scoreGuess(guess, secret) {
    const results = new Array(WORD_LENGTH).fill("absent");
    const unmatched = [];

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guess[i] === secret[i]) {
            results[i] = "correct";
        } else {
            unmatched.push(secret[i]);
        }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
        if (results[i] === "correct") {
            continue;
        }
        const index = unmatched.indexOf(guess[i]);
        if (index !== -1) {
            results[i] = "present";
            unmatched.splice(index, 1);
        }
    }
    return results;
}

function paintRow(results) {
    for (let i = 0; i < WORD_LENGTH; i++) {
        const cell = getCell(game.row, i + 1);
        if (cell) {
            cell.style.background = COLORS[results[i]];
        }
        paintKey(game.guess[i], results[i]);
    }
}

// A key keeps its best result: green beats yellow, yellow beats gray.
function paintKey(letter, result) {
    const key = document.getElementById(letter);
    if (!key) {
        return;
    }
    const current = key.dataset.result;
    if (current === "correct" || (current === "present" && result === "absent")) {
        return;
    }
    key.dataset.result = result;
    key.style.background = COLORS[result];
}

// ---- Setup: building the page for the current language ----

function createKey(label, className, onClick) {
    const key = document.createElement("button");
    key.type = "button";
    key.className = className;
    key.textContent = label;
    key.addEventListener("click", onClick);
    return key;
}

function buildKeyboard() {
    const keyboard = document.getElementById("keyboard");
    if (!keyboard) {
        return;
    }
    keyboard.replaceChildren();

    language.keyboardRows.forEach((letters, index) => {
        const row = document.createElement("div");
        row.className = "keyboard-row";
        const isLastRow = index === language.keyboardRows.length - 1;

        if (isLastRow) {
            row.append(createKey(language.enterLabel, "key wide", submitGuess));
        }
        for (const letter of letters) {
            const key = createKey(letter, "key", () => addLetter(letter));
            key.id = letter;
            row.append(key);
        }
        if (isLastRow) {
            const deleteKey = createKey("", "key wide", deleteLetter);
            deleteKey.setAttribute("aria-label", "Delete");
            const icon = document.createElement("img");
            icon.src = "delete-icon.png";
            icon.alt = "";
            deleteKey.append(icon);
            row.append(deleteKey);
        }
        keyboard.append(row);
    });
}

function startNewGame() {
    game.secretWord = pickRandomWord();
    game.row = 1;
    game.guess = "";
    game.isOver = false;

    document.querySelectorAll(".cell").forEach((cell) => {
        cell.textContent = "";
        cell.style.background = "";
    });
    showMessage("");
}

function setLanguage(code) {
    language = LANGUAGES[code];
    document.documentElement.lang = code;
    document.documentElement.dir = language.direction;

    const title = document.getElementById("title");
    if (title) {
        title.textContent = language.title;
    }
    const switchButton = document.getElementById("language-switch");
    if (switchButton) {
        switchButton.textContent = language.switchLabel;
    }

    buildKeyboard();
    startNewGame();
}

// Physical keyboard support (Hebrew or English layout, matching the current language).
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // otherwise Enter also "clicks" the last on-screen key that was pressed
        submitGuess();
    } else if (event.key === "Backspace") {
        deleteLetter();
    } else if (language.letterPattern.test(event.key)) {
        addLetter(event.key);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const switchButton = document.getElementById("language-switch");
    switchButton?.addEventListener("click", () => {
        setLanguage(language === LANGUAGES.he ? "en" : "he");
        switchButton.blur(); // so Enter submits a guess instead of switching again
    });
    setLanguage("he");
});
