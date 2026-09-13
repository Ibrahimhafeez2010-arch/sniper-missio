
const game = document.getElementById("game");
const scope = document.getElementById("scope");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const status = document.getElementById("status");

let aiming = false;
let missionStarted = false;
let targetsHit = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

const totalTargets = 5;

// Stop the normal right-click menu
game.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

// Start game
startButton.addEventListener("click", () => {
    message.style.display = "none";
    missionStarted = true;
    targetsHit = 0;

    status.textContent = `TARGETS: 0 / ${totalTargets}`;

    createTargets();
});

// Create targets
function createTargets() {

    document.querySelectorAll(".mission-target").forEach(target => {
        target.remove();
    });

    const positions = [
        { left: "15%", top: "50%" },
        { left: "32%", top: "38%" },
        { left: "50%", top: "52%" },
        { left: "68%", top: "35%" },
        { left: "83%", top: "48%" }
    ];

    positions.forEach((position) => {

        const target = document.createElement("div");

        target.className = "mission-target";

        target.style.left = position.left;
        target.style.top = position.top;

        game.appendChild(target);
    });
}

// Track mouse
game.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

    // Move scope crosshair with mouse
    const horizontal = document.querySelector(".crosshair.horizontal");
    const vertical = document.querySelector(".crosshair.vertical");
    const circle = document.querySelector(".scope-circle");

    if (horizontal && vertical && circle) {

        horizontal.style.left = mouseX + "px";
        horizontal.style.top = mouseY + "px";

        vertical.style.left = mouseX + "px";
        vertical.style.top = mouseY + "px";

        circle.style.left = mouseX + "px";
        circle.style.top = mouseY + "px";
    }
});

// LEFT CLICK = AIM
game.addEventListener("mousedown", (event) => {

    if (!missionStarted) return;

    if (event.button === 0) {

        aiming = true;

        scope.style.display = "block";

        status.textContent = "AIMING";
    }
});

// Release left mouse = stop aiming
game.addEventListener("mouseup", (event) => {

    if (event.button === 0) {

        aiming = false;

        scope.style.display = "none";

        if (missionStarted) {
            status.textContent =
                `TARGETS: ${targetsHit} / ${totalTargets}`;
        }
    }
});

// RIGHT CLICK = FIRE
game.addEventListener("mousedown", (event) => {

    if (!missionStarted) return;

    if (event.button === 2 && aiming) {

        fire();
    }
});

// Fire at mouse position
function fire() {

    const targets = document.querySelectorAll(".mission-target");

    let hit = false;

    targets.forEach((target) => {

        if (target.dataset.hit === "true") return;

        const rect = target.getBoundingClientRect();

        // Check whether mouse is over target
        if (
            mouseX >= rect.left &&
            mouseX <= rect.right &&
            mouseY >= rect.top &&
            mouseY <= rect.bottom
        ) {

            target.dataset.hit = "true";

            target.classList.add("hit");

            hit = true;

            targetsHit++;

            status.textContent =
                `TARGETS: ${targetsHit} / ${totalTargets}`;

            setTimeout(() => {
                target.remove();
            }, 150);

            if (targetsHit === totalTargets) {
                missionComplete();
            }
        }
    });

    // Small firing effect
    if (!hit) {
        status.textContent = "MISSED!";
    }
}

// Mission complete
function missionComplete() {

    missionStarted = false;
    aiming = false;

    scope.style.display = "none";

    message.style.display = "block";

    message.innerHTML = `
        <h1>MISSION COMPLETE!</h1>
        <p>You hit all ${totalTargets} targets!</p>
        <button id="restartButton">PLAY AGAIN</button>
    `;

    document
        .getElementById("restartButton")
        .addEventListener("click", () => {

            message.style.display = "none";

            missionStarted = true;
            targetsHit = 0;

            status.textContent =
                `TARGETS: 0 / ${totalTargets}`;

            createTargets();
        });
}
