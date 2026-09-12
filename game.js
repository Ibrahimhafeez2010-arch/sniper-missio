
const game = document.getElementById("game");
const targetContainer = document.getElementById("target");
const scope = document.getElementById("scope");
const message = document.getElementById("message");
const startButton = document.getElementById("startButton");
const status = document.getElementById("status");

let aiming = false;
let missionStarted = false;
let targets = [];
let targetsHit = 0;

// Prevent the normal right-click menu
game.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

// Start the mission
startButton.addEventListener("click", function() {
    missionStarted = true;
    message.style.display = "none";
    status.textContent = "TARGETS: 0 / 5";

    createTargets();
});

// Create five targets
function createTargets() {
    targets = [];
    targetsHit = 0;

    // Remove old targets
    document.querySelectorAll(".mission-target").forEach(target => {
        target.remove();
    });

    const positions = [
        { left: "18%", top: "48%" },
        { left: "35%", top: "38%" },
        { left: "52%", top: "52%" },
        { left: "70%", top: "42%" },
        { left: "84%", top: "55%" }
    ];

    positions.forEach((position, index) => {
        const target = document.createElement("div");

        target.className = "mission-target";
        target.dataset.id = index;

        target.style.left = position.left;
        target.style.top = position.top;

        game.appendChild(target);
        targets.push(target);
    });
}

// LEFT CLICK = AIM
game.addEventListener("mousedown", function(event) {
    if (!missionStarted) return;

    if (event.button === 0) {
        aiming = true;
        scope.style.display = "block";
        status.textContent = "AIMING";
    }
});

// Release left click = stop aiming
game.addEventListener("mouseup", function(event) {
    if (event.button === 0) {
        aiming = false;
        scope.style.display = "none";

        if (missionStarted) {
            status.textContent = `TARGETS: ${targetsHit} / 5`;
        }
    }
});

// RIGHT CLICK = FIRE
game.addEventListener("mousedown", function(event) {
    if (!missionStarted) return;

    if (event.button === 2 && aiming) {
        fire();
    }
});

function fire() {
    const crosshairX = window.innerWidth / 2;
    const crosshairY = window.innerHeight / 2;

    let hitTarget = null;

    targets.forEach(target => {
        if (target.dataset.hit === "true") return;

        const rect = target.getBoundingClientRect();

        if (
            crosshairX >= rect.left &&
            crosshairX <= rect.right &&
            crosshairY >= rect.top &&
            crosshairY <= rect.bottom
        ) {
            hitTarget = target;
        }
    });

    if (hitTarget) {
        hitTarget.dataset.hit = "true";
        hitTarget.style.display = "none";

        targetsHit++;

        status.textContent = `TARGETS: ${targetsHit} / 5`;

        if (targetsHit === 5) {
            missionComplete();
        }
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
        <p>You hit all 5 targets.</p>
        <button id="restartButton">PLAY AGAIN</button>
    `;

    document.getElementById("restartButton").addEventListener("click", function() {
        message.style.display = "none";
        missionStarted = true;
        status.textContent = "TARGETS: 0 / 5";
        createTargets();
    });
}
