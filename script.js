"use strict";

/*==================================================
    LUCKY WHEEL
    Author : Seif Basha
    Version: 2.0
==================================================*/


/*==================================================
    DOM ELEMENTS
==================================================*/

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const itemsInput = document.getElementById("items");
const durationInput = document.getElementById("duration");

const spinButton = document.getElementById("spinBtn");
const resetButton = document.getElementById("resetBtn");

const shuffleButton = document.getElementById("shuffleBtn");
const clearButton = document.getElementById("clearBtn");
const importButton = document.getElementById("importBtn");
const exportButton = document.getElementById("exportBtn");
const importFileInput = document.getElementById("importFile");
const copyWinnerButton = document.getElementById("copyWinnerBtn");

const removeWinnerCheckbox = document.getElementById("removeWinner");
const enableSoundCheckbox = document.getElementById("enableSound");
const enableConfettiCheckbox = document.getElementById("enableConfetti");
const themeSelect = document.getElementById("theme");

const winnerLabel = document.getElementById("winner");
const historyList = document.getElementById("historyList");

const totalSpinsLabel = document.getElementById("totalSpins");
const uniqueWinnersLabel = document.getElementById("uniqueWinners");
const remainingEntriesLabel = document.getElementById("remainingEntries");

const presetListSelect = document.getElementById("presetList");
const savePresetButton = document.getElementById("savePreset");
const loadPresetButton = document.getElementById("loadPreset");
const deletePresetButton = document.getElementById("deletePreset");


/*==================================================
    CONSTANTS
==================================================*/

const DEFAULT_ITEMS = [
    "Apple",
    "Banana",
    "Orange",
    "Prize"
];

const COLOR_PALETTE = [

    "#FF6B6B",
    "#4D96FF",
    "#6BCB77",
    "#FFD93D",
    "#845EC2",
    "#FF9671",
    "#00C9A7",
    "#F9F871",
    "#0081CF",
    "#C34A36"

];

const MIN_DURATION = 2;
const MAX_DURATION = 20;

const MAX_HISTORY_ENTRIES = 30;

const PRESET_STORAGE_KEY = "luckyWheel.presets";


/*==================================================
    GLOBAL VARIABLES
==================================================*/

let wheelItems = [...DEFAULT_ITEMS];

let wheelColors = [];

let currentRotation = 0;

let spinning = false;

let lastWinner = null;

let spinHistory = [];

let totalSpins = 0;

let uniqueWinners = new Set();

let audioContext = null;

/*==================================================
    UTILITY FUNCTIONS
==================================================*/

/*
    Clamp a value between a minimum and maximum.
*/
function clamp(value, min, max)
{
    return Math.max(min, Math.min(max, value));
}

/*
    Generate a random integer.
*/
function randomInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
    Convert degrees to radians.
*/
function degreesToRadians(degrees)
{
    return degrees * Math.PI / 180;
}

/*
    Convert radians to degrees.
*/
function radiansToDegrees(radians)
{
    return radians * 180 / Math.PI;
}

/*
    Generate colours for each wheel slice.
*/
function generateColors(count)
{
    const colors = [];

    for(let i = 0; i < count; i++)
    {
        colors.push(
            COLOR_PALETTE[i % COLOR_PALETTE.length]
        );
    }

    return colors;
}

/*
    Escape text before inserting into innerHTML.
*/
function escapeHtml(text)
{
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

/*==================================================
    INPUT FUNCTIONS
==================================================*/

function parseItemsFromText(text)
{
    return text
        .split(/\r?\n/)
        .map(item => item.trim())
        .filter(item => item !== "");
}

function updateWheelItems()
{

    const text = itemsInput.value.trim();

    wheelItems = parseItemsFromText(text);

    wheelColors = generateColors(
        wheelItems.length
    );

    currentRotation = 0;

    drawWheel();

    updateRemainingLabel();

}

function getSpinDuration()
{
    return clamp(

        Number(durationInput.value) || 5,

        MIN_DURATION,

        MAX_DURATION

    );
}

/*==================================================
    DRAWING FUNCTIONS
==================================================*/

function drawWheel()
{

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radius =
        Math.min(centerX, centerY) - 10;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (wheelItems.length === 0)
    {
        ctx.save();
        ctx.fillStyle = "#334155";
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f8fafc";
        ctx.font = "bold 20px Inter, Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Add items to spin", centerX, centerY);
        ctx.restore();
        return;
    }

    const slice =
        (2 * Math.PI) / wheelItems.length;

    for(let i = 0; i < wheelItems.length; i++)
    {

        const angle =
            currentRotation +
            (i * slice);

        ctx.beginPath();

        ctx.moveTo(centerX, centerY);

        ctx.arc(
            centerX,
            centerY,
            radius,
            angle,
            angle + slice
        );

        ctx.closePath();

        ctx.fillStyle = wheelColors[i];

        ctx.fill();

        ctx.save();

        ctx.translate(centerX, centerY);

        ctx.rotate(angle + slice / 2);

        ctx.textAlign = "right";

        ctx.fillStyle = "#1f2937";

        ctx.font = "bold 18px Inter, Arial";

        const label = wheelItems[i].length > 18
            ? wheelItems[i].slice(0, 16) + "…"
            : wheelItems[i];

        ctx.fillText(
            label,
            radius - 20,
            6
        );

        ctx.restore();

    }

    ctx.beginPath();

    ctx.arc(
        centerX,
        centerY,
        40,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#181818";

    ctx.fill();

}

/*==================================================
    SPIN FUNCTIONS
==================================================*/


/*
    Start spinning the wheel.
*/

function spinWheel()
{

    if (spinning)
    {
        return;
    }

    updateWheelItems();

    if (wheelItems.length < 2)
    {
        alert("Please enter at least two items.");
        return;
    }

    spinning = true;

    spinButton.disabled = true;

    winnerLabel.textContent = "Spinning...";

    winnerLabel.classList.remove("winner");

    playTickSound();

    const duration = getSpinDuration();

    const sliceAngle = 360 / wheelItems.length;

    // Choose a random winner

    const winningIndex = randomInt(
        0,
        wheelItems.length - 1
    );

    /*
        Calculate the angle needed so the
        selected slice lands under the arrow.
    */

    const fullRotations = randomInt(5, 8) * 360;

    const targetAngle =
        fullRotations +
        (winningIndex * sliceAngle) +
        (sliceAngle / 2);

    animateSpin(

        duration,

        targetAngle,

        winningIndex

    );

}

/*==================================================
    CANVAS
==================================================*/

function resizeCanvas()
{
    const size = Math.min(520, window.innerWidth * 0.9);

    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );

    drawWheel();
}

/*==================================================
    HISTORY / STATS
==================================================*/

function updateRemainingLabel()
{
    remainingEntriesLabel.textContent = wheelItems.length;
}

function addHistoryEntry(name)
{
    const time = new Date().toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit", second: "2-digit" }
    );

    spinHistory.unshift({ name, time });

    if (spinHistory.length > MAX_HISTORY_ENTRIES)
    {
        spinHistory.length = MAX_HISTORY_ENTRIES;
    }

    renderHistory();
}

function renderHistory()
{
    historyList.innerHTML = "";

    if (spinHistory.length === 0)
    {
        const li = document.createElement("li");
        li.className = "empty";
        li.textContent = "No spins yet";
        historyList.appendChild(li);
        return;
    }

    spinHistory.forEach(entry =>
    {
        const li = document.createElement("li");

        const nameSpan = document.createElement("span");
        nameSpan.textContent = entry.name;

        const timeSpan = document.createElement("span");
        timeSpan.className = "time";
        timeSpan.textContent = entry.time;

        li.appendChild(nameSpan);
        li.appendChild(timeSpan);

        historyList.appendChild(li);
    });
}

function updateStats(winnerName)
{
    totalSpins += 1;
    uniqueWinners.add(winnerName);

    totalSpinsLabel.textContent = totalSpins;
    uniqueWinnersLabel.textContent = uniqueWinners.size;
    updateRemainingLabel();
}

/*==================================================
    SOUND
==================================================*/

function getAudioContext()
{
    if (!audioContext)
    {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;

        if (!AudioCtx)
        {
            return null;
        }

        audioContext = new AudioCtx();
    }

    if (audioContext.state === "suspended")
    {
        audioContext.resume();
    }

    return audioContext;
}

function playTone(frequency, startTime, duration, type = "sine", volume = 0.2)
{
    const ac = getAudioContext();

    if (!ac)
    {
        return;
    }

    const oscillator = ac.createOscillator();
    const gain = ac.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.connect(gain);
    gain.connect(ac.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playTickSound()
{
    if (!enableSoundCheckbox.checked)
    {
        return;
    }

    const ac = getAudioContext();

    if (!ac)
    {
        return;
    }

    playTone(440, ac.currentTime, 0.12, "square", 0.08);
}

function playWinSound()
{
    if (!enableSoundCheckbox.checked)
    {
        return;
    }

    const ac = getAudioContext();

    if (!ac)
    {
        return;
    }

    const now = ac.currentTime;

    playTone(523.25, now, 0.18, "triangle", 0.15);
    playTone(659.25, now + 0.15, 0.18, "triangle", 0.15);
    playTone(783.99, now + 0.3, 0.35, "triangle", 0.18);
}

/*==================================================
    CONFETTI
==================================================*/

function launchConfetti()
{
    if (!enableConfettiCheckbox.checked)
    {
        return;
    }

    const colors = COLOR_PALETTE;
    const pieceCount = 80;

    for (let i = 0; i < pieceCount; i++)
    {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";

        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor =
            colors[randomInt(0, colors.length - 1)];

        const fallDuration = 2.2 + Math.random() * 1.6;
        const delay = Math.random() * 0.4;

        piece.style.animationDuration = `${fallDuration}s`;
        piece.style.animationDelay = `${delay}s`;
        piece.style.transform =
            `rotate(${randomInt(0, 360)}deg)`;

        document.body.appendChild(piece);

        setTimeout(
            () => piece.remove(),
            (fallDuration + delay) * 1000 + 200
        );
    }
}

/*==================================================
    IMPORT / EXPORT
==================================================*/

function exportItems()
{
    updateWheelItems();

    if (wheelItems.length === 0)
    {
        alert("There are no items to export.");
        return;
    }

    const blob = new Blob(
        [wheelItems.join("\n")],
        { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "lucky-wheel-items.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

function importItems()
{
    importFileInput.value = "";
    importFileInput.click();
}

function handleImportFile(event)
{
    const file = event.target.files && event.target.files[0];

    if (!file)
    {
        return;
    }

    const reader = new FileReader();

    reader.onload = () =>
    {
        let text = String(reader.result);

        // Support a plain JSON array of strings as well as text/csv.
        const trimmed = text.trim();

        if (trimmed.startsWith("["))
        {
            try
            {
                const parsed = JSON.parse(trimmed);

                if (Array.isArray(parsed))
                {
                    text = parsed.join("\n");
                }
            }
            catch (error)
            {
                // Fall back to treating it as plain text.
            }
        }
        else if (file.name.toLowerCase().endsWith(".csv"))
        {
            text = text
                .split(/\r?\n/)
                .map(line => line.split(",")[0])
                .join("\n");
        }

        itemsInput.value = text;
        updateWheelItems();
    };

    reader.onerror = () =>
    {
        alert("Could not read that file.");
    };

    reader.readAsText(file);
}

/*==================================================
    SHUFFLE / CLEAR
==================================================*/

function shuffleItems()
{
    updateWheelItems();

    for (let i = wheelItems.length - 1; i > 0; i--)
    {
        const j = randomInt(0, i);
        [wheelItems[i], wheelItems[j]] =
            [wheelItems[j], wheelItems[i]];
    }

    itemsInput.value = wheelItems.join("\n");

    wheelColors = generateColors(wheelItems.length);

    currentRotation = 0;

    drawWheel();
}

function clearItems()
{
    if (itemsInput.value.trim() === "")
    {
        return;
    }

    if (!confirm("Clear all entries?"))
    {
        return;
    }

    itemsInput.value = "";
    updateWheelItems();

    winnerLabel.textContent = "Winner: —";
    winnerLabel.classList.remove("winner");
}

/*==================================================
    COPY WINNER
==================================================*/

function copyWinner()
{
    if (!lastWinner)
    {
        alert("Spin the wheel to get a winner first.");
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText)
    {
        navigator.clipboard.writeText(lastWinner)
            .then(() => flashCopyFeedback())
            .catch(() => fallbackCopy(lastWinner));
    }
    else
    {
        fallbackCopy(lastWinner);
    }
}

function fallbackCopy(text)
{
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();

    try
    {
        document.execCommand("copy");
        flashCopyFeedback();
    }
    catch (error)
    {
        alert("Could not copy the winner automatically.");
    }

    textarea.remove();
}

function flashCopyFeedback()
{
    const original = copyWinnerButton.textContent;
    copyWinnerButton.textContent = "✅ Copied!";

    setTimeout(() =>
    {
        copyWinnerButton.textContent = original;
    }, 1400);
}

/*==================================================
    THEME
==================================================*/

function applyTheme(theme)
{
    document.body.setAttribute("data-theme", theme);
}

/*==================================================
    PRESETS
==================================================*/

function loadPresetsFromStorage()
{
    try
    {
        const raw = localStorage.getItem(PRESET_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }
    catch (error)
    {
        return {};
    }
}

function savePresetsToStorage(presets)
{
    try
    {
        localStorage.setItem(
            PRESET_STORAGE_KEY,
            JSON.stringify(presets)
        );
    }
    catch (error)
    {
        alert("Could not save presets in this browser.");
    }
}

function refreshPresetList()
{
    const presets = loadPresetsFromStorage();

    presetListSelect.innerHTML =
        '<option value="">Select Preset</option>';

    Object.keys(presets)
        .sort((a, b) => a.localeCompare(b))
        .forEach(name =>
        {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            presetListSelect.appendChild(option);
        });
}

function savePreset()
{
    updateWheelItems();

    if (wheelItems.length === 0)
    {
        alert("Add some items before saving a preset.");
        return;
    }

    const name = prompt("Name this preset:");

    if (!name || !name.trim())
    {
        return;
    }

    const presets = loadPresetsFromStorage();
    presets[name.trim()] = wheelItems;

    savePresetsToStorage(presets);
    refreshPresetList();
    presetListSelect.value = name.trim();
}

function loadPreset()
{
    const name = presetListSelect.value;

    if (!name)
    {
        alert("Choose a preset to load first.");
        return;
    }

    const presets = loadPresetsFromStorage();
    const items = presets[name];

    if (!items)
    {
        alert("That preset no longer exists.");
        refreshPresetList();
        return;
    }

    itemsInput.value = items.join("\n");
    updateWheelItems();
}

function deletePreset()
{
    const name = presetListSelect.value;

    if (!name)
    {
        alert("Choose a preset to delete first.");
        return;
    }

    if (!confirm(`Delete preset "${name}"?`))
    {
        return;
    }

    const presets = loadPresetsFromStorage();
    delete presets[name];

    savePresetsToStorage(presets);
    refreshPresetList();
}

/*==================================================
    EVENT LISTENERS
==================================================*/

// Spin Button

spinButton.addEventListener(
    "click",
    spinWheel
);


// Reset Button

resetButton.addEventListener(
    "click",
    resetWheel
);


// Update wheel when text changes

itemsInput.addEventListener(
    "input",
    updateWheelItems
);


// Shuffle / Clear / Import / Export

shuffleButton.addEventListener("click", shuffleItems);
clearButton.addEventListener("click", clearItems);
importButton.addEventListener("click", importItems);
exportButton.addEventListener("click", exportItems);
importFileInput.addEventListener("change", handleImportFile);


// Copy winner

copyWinnerButton.addEventListener("click", copyWinner);


// Theme

themeSelect.addEventListener("change", () =>
{
    applyTheme(themeSelect.value);
});


// Presets

savePresetButton.addEventListener("click", savePreset);
loadPresetButton.addEventListener("click", loadPreset);
deletePresetButton.addEventListener("click", deletePreset);


// Window Resize

window.addEventListener(
    "resize",
    resizeCanvas
);

/*==================================================
    KEYBOARD SHORTCUTS
==================================================*/

document.addEventListener("keydown", (event) =>
{

    // Ignore shortcuts while typing

    if (
        event.target.tagName === "TEXTAREA" ||
        event.target.tagName === "INPUT"
    )
    {
        return;
    }

    switch(event.key)
    {

        case "Enter":

            spinWheel();

            break;

        case "r":

        case "R":

            resetWheel();

            break;

    }

});

/*==================================================
    STARTUP
==================================================*/

function initialize()
{

    wheelColors =
        generateColors(
            wheelItems.length
        );

    itemsInput.value =
        wheelItems.join("\n");

    applyTheme(themeSelect.value || "dark");

    resizeCanvas();

    winnerLabel.textContent =
        "Winner: —";

    renderHistory();
    updateRemainingLabel();
    refreshPresetList();

}

initialize();

/*==================================================
    ANIMATION
==================================================*/

function animateSpin(
    duration,
    targetAngle,
    winningIndex
)
{

    const startTime = performance.now();

    const startDegrees =
        radiansToDegrees(currentRotation);

    const endDegrees =
        startDegrees + targetAngle;

    function frame(time)
    {

        const elapsed =
            (time - startTime) / 1000;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );

        const ease =
            1 - Math.pow(1 - progress, 3);

        const currentDegrees =
            startDegrees +
            ((endDegrees - startDegrees) * ease);

        currentRotation =
            degreesToRadians(currentDegrees);

        drawWheel();

        if(progress < 1)
        {
            requestAnimationFrame(frame);
        }
        else
        {
            finishSpin(winningIndex);
        }

    }

    requestAnimationFrame(frame);

}

/*==================================================
    FINISH SPIN
==================================================*/

function finishSpin(index)
{

    spinning = false;

    spinButton.disabled = false;

    const winnerName = wheelItems[index];

    lastWinner = winnerName;

    winnerLabel.textContent =
        `Winner: ${winnerName}`;

    winnerLabel.classList.add("winner");

    addHistoryEntry(winnerName);
    updateStats(winnerName);

    playWinSound();
    launchConfetti();

    if (removeWinnerCheckbox.checked)
    {
        wheelItems.splice(index, 1);

        itemsInput.value = wheelItems.join("\n");

        wheelColors = generateColors(wheelItems.length);

        currentRotation = 0;

        drawWheel();

        updateRemainingLabel();
    }

}

/*==================================================
    RESET
==================================================*/

function resetWheel()
{

    wheelItems = [...DEFAULT_ITEMS];

    itemsInput.value =
        wheelItems.join("\n");

    currentRotation = 0;

    winnerLabel.textContent =
        "Winner: —";

    winnerLabel.classList.remove("winner");

    lastWinner = null;

    spinHistory = [];
    totalSpins = 0;
    uniqueWinners = new Set();

    totalSpinsLabel.textContent = "0";
    uniqueWinnersLabel.textContent = "0";

    renderHistory();

    wheelColors =
        generateColors(
            wheelItems.length
        );

    updateRemainingLabel();

    drawWheel();

}
