// Compiled from languages.ts (same code, type annotations removed).
// Everything that changes between languages. The game itself (wordle.ts) is shared.
// To add a language, add one more entry to LANGUAGES.

const LANGUAGES = {
    he: {
        title: "וורד-לי",
        direction: "rtl",
        switchLabel: "English",
        keyboardRows: ["קראטוןםפ", "שדגכעיחלךף", "זסבהנמצתץ"],
        enterLabel: "הכנס",
        secretWords: [
            "רשימה", "סיפור", "אגודל", "וורדל", "מניפה", "מריצה", "רכישה", "ענבים", "חביות", "מכונה",
            "נקישה", "דפדפן", "בקבוק", "עיתון", "שניצל", "ספורט", "גיטרה", "גאנדי", "מונית", "תופסן",
            "ציפית", "שטרות", "מכולת", "מנורה", "יהודי", "ברירה", "ערכים", "בחינה", "שרביט", "שולחן",
            "רובוט", "מכלול", "פרחים", "בורגר", "מוותר", "צדדים", "מילון", "מטריה", "פגיעה", "זינוק",
            "זרנוק", "סגנון", "ציפור", "נקיון", "אתמול", "אתרוג", "מספיק", "מפליק", "מצדיק", "מפליל",
            "תלמיד", "תרמיל", "תרשים", "חתולה", "אפרוח",
        ],
        letterPattern: /^[א-ת]$/,
        newGameLabel: "משחק חדש",
        messages: {
            rowFull: "השורה כבר מלאה",
            tooShort: "צריך חמש אותיות",
            win: "כל הכבוד, אתה קוסם אמיתי! ניחשת נכון את המילה וניצחת!",
            lose: (secretWord) => `לא הצלחת לנחש הפעם :( המילה הייתה ${secretWord}`,
        },
        help: {
            title: "איך משחקים",
            rules: [
                "נחשו את המילה הסודית בשישה ניסיונות.",
                "כל ניחוש הוא מילה של חמש אותיות. לחצו הכנס כדי לבדוק אותו.",
                "אחרי כל ניחוש צבע המשבצות מראה כמה התקרבתם:",
            ],
            correct: "האות במילה ובמקום הנכון",
            present: "האות במילה אבל במקום אחר",
            absent: "האות לא נמצאת במילה",
            close: "הבנתי",
        },
    },
    en: {
        title: "Wordle",
        direction: "ltr",
        switchLabel: "עברית",
        keyboardRows: ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"],
        enterLabel: "ENTER",
        secretWords: [
            "APPLE", "BEACH", "BRAIN", "BREAD", "BRICK", "CHAIR", "CHESS", "CLOUD", "CRANE", "DANCE",
            "DREAM", "EAGLE", "EARTH", "FLAME", "FROST", "FRUIT", "GHOST", "GLASS", "GRAPE", "HEART",
            "HORSE", "HOUSE", "JUICE", "KNIFE", "LEMON", "LIGHT", "MAGIC", "MONEY", "MOUSE", "MUSIC",
            "NIGHT", "OCEAN", "PAINT", "PIANO", "PILOT", "PIZZA", "PLANT", "QUEEN", "RIVER", "ROBOT",
            "SHEEP", "SHIRT", "SNAKE", "SPACE", "SPOON", "STONE", "STORM", "SUGAR", "TABLE", "TIGER",
            "TOAST", "TRAIN", "WATER", "WHALE", "WORLD", "ZEBRA", "BLOCK", "SWORD", "CROWN", "TOWER",
        ],
        letterPattern: /^[a-zA-Z]$/,
        newGameLabel: "New game",
        messages: {
            rowFull: "The row is already full",
            tooShort: "Five letters needed",
            win: "Well done, you guessed the word!",
            lose: (secretWord) => `Out of tries :( The word was ${secretWord}`,
        },
        help: {
            title: "How to play",
            rules: [
                "Guess the secret word in six tries.",
                "Each guess is a five-letter word. Press Enter to check it.",
                "After each guess, the tiles change color to show how close you were:",
            ],
            correct: "The letter is in the word and in the right spot",
            present: "The letter is in the word but in another spot",
            absent: "The letter is not in the word",
            close: "Got it",
        },
    },
};

