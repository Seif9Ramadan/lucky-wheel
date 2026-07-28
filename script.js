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

const winnerLabel = document.getElementById("winner");


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


/*==================================================
    GLOBAL VARIABLES
==================================================*/

let wheelItems = [...DEFAULT_ITEMS];

let wheelColors = [];

let currentRotation = 0;

let spinning = false;
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
/*==================================================
    INPUT FUNCTIONS
==================================================*/

function updateWheelItems()
{

    const text = itemsInput.value.trim();

    if(text === "")
    {
        wheelItems = [...DEFAULT_ITEMS];
    }
    else
    {
        wheelItems = text
            .split(",")
            .map(item => item.trim())
            .filter(item => item !== "");
    }

    wheelColors = generateColors(
        wheelItems.length
    );

    drawWheel();

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

        ctx.fillStyle = "#222";

        ctx.font = "bold 18px Arial";

        ctx.fillText(
            wheelItems[i],
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

    winnerLabel.textContent = "Spinning...";

    winnerLabel.classList.remove("winner");


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
        wheelItems.join(", ");

    resizeCanvas();

    winnerLabel.textContent =
        "Winner: —";

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

    winnerLabel.textContent =
        `Winner: ${wheelItems[index]}`;

    winnerLabel.classList.add("winner");

}
/*==================================================
    RESET
==================================================*/

function resetWheel()
{

    wheelItems = [...DEFAULT_ITEMS];

    itemsInput.value =
        wheelItems.join(", ");

    currentRotation = 0;

    winnerLabel.textContent =
        "Winner: —";

    winnerLabel.classList.remove("winner");

    wheelColors =
        generateColors(
            wheelItems.length
        );

    drawWheel();

}
