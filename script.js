const bird = document.getElementById("bird");
const game = document.getElementById("game");
const pipeTop = document.querySelector(".pipe-top");
const pipeBottom = document.querySelector(".pipe-bottom");
const message = document.getElementById("message");

let birdTop = 200;
let gravity = 2;
let jump = 40;
let pipeLeft = 400;
let gap = 150;
let gameRunning = true;

// Jump
document.addEventListener("keydown", e => {
  if (e.code === "Space") fly();
});
document.addEventListener("click", fly);

function fly() {
  if (!gameRunning) return;
  birdTop -= jump;
}

// Game loop
const gameLoop = setInterval(() => {
  if (!gameRunning) return;

  // Gravity
  birdTop += gravity;
  bird.style.top = birdTop + "px";

  // Move pipes
  pipeLeft -= 3;
  pipeTop.style.left = pipeLeft + "px";
  pipeBottom.style.left = pipeLeft + "px";

  // Reset pipes
  if (pipeLeft < -60) {
    pipeLeft = 400;
    const topHeight = Math.random() * 200 + 50;
    pipeTop.style.height = topHeight + "px";
    pipeBottom.style.height = (500 - topHeight - gap) + "px";
  }

  // Collision with ground or ceiling
  if (birdTop <= 0 || birdTop >= 470) {
    gameOver();
  }

  // Collision with pipes
  if (
    pipeLeft < 110 && pipeLeft > 50 &&
    (birdTop < pipeTop.offsetHeight ||
     birdTop > 500 - pipeBottom.offsetHeight - 30)
  ) {
    gameOver();
  }

}, 20);

function gameOver() {
  gameRunning = false;
  message.textContent = "Game Over! Refresh to play again.";
}
