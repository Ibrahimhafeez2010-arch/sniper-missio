
const game = document.getElementById("game");
const scope = document.getElementById("scope");
const crosshair = document.getElementById("crosshair");

const startScreen = document.getElementById("startScreen");
const completeScreen = document.getElementById("completeScreen");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");

const targetsHitDisplay = document.getElementById("targetsHit");
const statusDisplay = document.getElementById("status");

const targetsContainer = document.getElementById("targets");


// -----------------------------
// GAME SETTINGS
// -----------------------------

const TOTAL_TARGETS = 5;

let targetsHit = 0;
let aiming = false;
let gameRunning = false;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;


// -----------------------------
// START GAME
// -----------------------------

startButton.addEventListener("click", startMission);

restartButton.addEventListener("click", startMission);


function startMission() {

    targetsHit = 0;
    aiming = false;
    gameRunning = true;

    targetsHitDisplay.textContent = "0";
    statusDisplay.textContent = "READY";

    startScreen.style.display = "none";
    completeScreen.style.display = "none";

    scope.style.display = "none";
    game.classList.remove("aiming");

    createTargets();
}


// -----------------------------
// CREATE TARGETS
// -----------------------------

function createTargets() {

    targetsContainer.innerHTML = "";

    /*
        These positions place the targets
        around different parts of the city.
    */

    const positions = [

        {
            left: "18%",
            top: "54%"
        },

        {
            left: "35%",
            top: "42%"
        },

        {
            left: "52%",
            top: "58%"
        },

        {
            left: "68%",
            top: "38%"
        },

        {
            left: "84%",
            top: "50%"
        }

    ];


    positions.forEach((position, index) => {

        const target = document.createElement("div");

        target.className = "mission-target";

        target.dataset.target = index;

        target.style.left = position.left;
        target.style.top = position.top;


        targetsContainer.appendChild(target);

    });
}


// -----------------------------
// MOUSE MOVEMENT
// -----------------------------

game.addEventListener("mousemove", function(event) {

    mouseX = event.clientX;
    mouseY = event.clientY;


    if (aiming) {

        crosshair.style.left = mouseX + "px";
        crosshair.style.top = mouseY + "px";

    }

});


// -----------------------------
// LEFT CLICK = AIM
// -----------------------------

game.addEventListener("mousedown", function(event) {

    if (!gameRunning) return;


    // LEFT BUTTON

    if (event.button === 0) {

        aiming = true;

        game.classList.add("aiming");

        scope.style.display = "block";

        statusDisplay.textContent = "AIMING";


        crosshair.style.left = mouseX + "px";
        crosshair.style.top = mouseY + "px";

    }


    // RIGHT BUTTON = FIRE

    if (event.button === 2) {

        if (aiming) {

            fire();

        }

    }

});


// -----------------------------
// RELEASE LEFT CLICK
// -----------------------------

game.addEventListener("mouseup", function(event) {

    if (event.button === 0) {

        aiming = false;

        game.classList.remove("aiming");

        scope.style.display = "none";


        if (gameRunning) {

            statusDisplay.textContent = "READY";

        }

    }

});


// -----------------------------
// STOP RIGHT CLICK MENU
// -----------------------------

game.addEventListener("contextmenu", function(event) {

    event.preventDefault();

});


// -----------------------------
// FIRE
// -----------------------------

function fire() {

    const targets =
        document.querySelectorAll(".mission-target");


    let targetHit = false;


    targets.forEach(function(target) {

        if (targetHit) return;


        const rectangle =
            target.getBoundingClientRect();


        /*
            Check whether the crosshair
            is over the target.
        */

        if (

            mouseX >= rectangle.left &&
            mouseX <= rectangle.right &&

            mouseY >= rectangle.top &&
            mouseY <= rectangle.bottom

        ) {

            hitTarget(target);

            targetHit = true;

        }

    });


    if (!targetHit) {

        statusDisplay.textContent = "MISSED";

    }

}


// -----------------------------
// TARGET HIT
// -----------------------------

function hitTarget(target) {

    targetsHit++;


    target.classList.add("hit");


    targetsHitDisplay.textContent =
        targetsHit;


    statusDisplay.textContent =
        "TARGET HIT";


    setTimeout(function() {

        target.remove();

    }, 180);


    if (targetsHit >= TOTAL_TARGETS) {

        setTimeout(missionComplete, 400);

    }

}


// -----------------------------
// MISSION COMPLETE
// -----------------------------

function missionComplete() {

    gameRunning = false;

    aiming = false;

    scope.style.display = "none";

    game.classList.remove("aiming");

    statusDisplay.textContent = "COMPLETE";

    completeScreen.style.display = "flex";

}
