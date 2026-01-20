const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let score = 0;
let gameOver = false;

// Bird
const bird = {
    x: 90,
    y: 250,
    radius: 16,
    velocity: 0,
    gravity: 0.5,
    jump: -8
};

// Pipes
const pipes = [];
const pipeWidth = 60;
const gap = 170;
let frameCount = 0;

// Controls
document.addEventListener("keydown", e => {
    if (e.code === "Space") flap();
});
canvas.addEventListener("click", flap);

function flap() {
    if (gameOver) location.reload();
    bird.velocity = bird.jump;
}

// HIGH GRAPHICS BIRD
function drawBird() {
    // Body gradient
    const bodyGradient = ctx.createRadialGradient(
        bird.x - 5,
        bird.y - 5,
        4,
        bird.x,
        bird.y,
        bird.radius + 8
    );
    bodyGradient.addColorStop(0, "#fff3b0");
    bodyGradient.addColorStop(1, "#f1c40f");

    // Body
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = bodyGradient;
    ctx.fill();

    // Wing animation
    ctx.beginPath();
    ctx.ellipse(
        bird.x - 6,
        bird.y + 2,
        8,
        5,
        Math.sin(Date.now() / 180) * 0.25,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = "#f39c12";
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(bird.x + 6, bird.y - 4, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bird.x + 7, bird.y - 4, 1.7, 0, Math.PI * 2);
    ctx.fillStyle = "#000";
    ctx.fill();

    // Beak
    ctx.beginPath();
    ctx.moveTo(bird.x + bird.radius + 2, bird.y);
    ctx.lineTo(bird.x + bird.radius + 12, bird.y + 4);
    ctx.lineTo(bird.x + bird.radius + 2, bird.y + 8);
    ctx.closePath();
    ctx.fillStyle = "#e67e22";
    ctx.fill();
}

// Pipes
function drawPipes() {
    ctx.fillStyle = "#27ae60";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height);
    });
}

function updatePipes() {
    frameCount++;

    if (frameCount % 100 === 0) {
        const topHeight = Math.random() * 220 + 60;
        pipes.push({
            x: canvas.width,
            top: topHeight,
            bottom: topHeight + gap,
            passed: false
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2.2;

        // Score
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            score++;
            pipe.passed = true;
        }

        // Collision
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            (bird.y - bird.radius < pipe.top ||
             bird.y + bird.radius > pipe.bottom)
        ) {
            gameOver = true;
        }
    });
}

// Score
function drawScore() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "32px Arial";
    ctx.fillText(score, canvas.width / 2 - 10, 60);
}

// Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;
        updatePipes();
    }

    drawPipes();
    drawBird();
    drawScore();

    // Ground & sky collision
    if (bird.y + bird.radius > canvas.height || bird.y < 0) {
        gameOver = true;
    }

    // Game over screen
    if (gameOver) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.font = "36px Arial";
        ctx.fillText("Game Over", 95, 280);
        ctx.font = "18px Arial";
        ctx.fillText("Click or Space to Restart", 90, 320);
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
