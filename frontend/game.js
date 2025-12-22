// ====================
// CONSTANTS & CONFIG
// ====================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const TILE_SIZE = 20;
const CANVAS_SIZE = 400;

// ====================
// GAME STATE
// ====================
let snake = [];
let food = {};
let direction = "RIGHT";
let nextDirection = "RIGHT";
let score = 0;
let speed = 200;
let gameOver = false;
let paused = false;
let interval = null;
let leaderboard = [];
let leaderboardLoaded = false;

// ====================
// INITIALIZATION
// ====================
function init() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ];
  direction = "RIGHT";
  nextDirection = "RIGHT";
  food = randomFoodPosition();
  score = 0;
  gameOver = false;
  paused = false;
  speed = 200;
  updateScoreDisplay();
  draw(); // Draw initial start screen
}

// ====================
// GAME LOOP FUNCTIONS
// ====================
function startGameLoop() {
  return setInterval(gameLoop, speed);
}

function gameLoop() {
  update();
  draw();
}

function startGame() {
  if (!interval) {
    interval = startGameLoop();
  }
}

// ====================
// UPDATE LOGIC
// ====================
function update() {
  if (paused || gameOver || !interval) return;

  direction = nextDirection;

  const head = { ...snake[0] };
  moveSnake(head);

  if (checkWallCollision(head) || checkSelfCollision(head)) {
    submitScore(score);

    fetchScores().then(scores => {
      leaderboard = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      leaderboardLoaded = true;
    });

    gameOver = true;
    snake.shift();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    handleFoodCollision();
  } else {
    snake.pop();
  }
}

function moveSnake(head) {
  switch (direction) {
    case "UP": head.y -= TILE_SIZE; break;
    case "DOWN": head.y += TILE_SIZE; break;
    case "LEFT": head.x -= TILE_SIZE; break;
    case "RIGHT": head.x += TILE_SIZE; break;
  }
  snake.unshift(head);
}

function handleFoodCollision() {
  score++;
  updateScoreDisplay();
  food = randomFoodPosition();

  if (score % 5 === 0 && speed > 50) {
    increaseSpeed();
  }
}

function increaseSpeed() {
  clearInterval(interval);
  speed -= 20;
  interval = startGameLoop();
}

// ====================
// DRAW FUNCTIONS
// ====================
function draw() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Start Screen
  if (!interval) {
    drawStartScreen();
    return;
  }

  // Game Elements
  drawFood();
  drawSnake();

  // Overlays
  if (paused) drawPauseScreen();
  if (gameOver) drawGameOverScreen();
}

function drawStartScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  
  ctx.fillStyle = "white";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Snake Game", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 40);
  
  ctx.font = "20px Arial";
  ctx.fillText("Press ENTER to Start", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
  
  ctx.font = "16px Arial";
  ctx.fillText("Use Arrow Keys to Move", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 60);
  ctx.fillText("SPACE to Pause", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 90);
  ctx.fillText("R to Restart (after Game Over)", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 120);
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, TILE_SIZE, TILE_SIZE);
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "limegreen";
    ctx.fillRect(segment.x, segment.y, TILE_SIZE, TILE_SIZE);
  });
}

function drawPauseScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  
  ctx.fillStyle = "yellow";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("PAUSED", CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 20);
  
  ctx.font = "16px Arial";
  ctx.fillText("Press SPACE to Resume", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
}

function drawGameOverScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  ctx.fillStyle = "white";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", CANVAS_SIZE / 2, 80);

  ctx.font = "20px Arial";
  ctx.fillText(`Final Score: ${score}`, CANVAS_SIZE / 2, 120);

  ctx.font = "16px Arial";
  ctx.fillText("Leaderboard", CANVAS_SIZE / 2, 170);

  if (!leaderboardLoaded) {
    ctx.fillText("Loading...", CANVAS_SIZE / 2, 200);
    return;
  }

  leaderboard.forEach((entry, index) => {
    ctx.fillText(
      `${index + 1}. ${entry.score}`,
      CANVAS_SIZE / 2,
      200 + index * 25
    );
  });

  ctx.fillText("Press R to Restart", CANVAS_SIZE / 2, 350);
}

// ====================
// UTILITY FUNCTIONS
// ====================
function updateScoreDisplay() {
  document.getElementById("score").textContent = score;
}

function randomFoodPosition() {
  let position;
  let collision;
  
  do {
    position = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE,
      y: Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE
    };
    
    collision = snake.some(segment => 
      segment.x === position.x && segment.y === position.y
    );
  } while (collision);
  
  return position;
}

function checkWallCollision(head) {
  return head.x < 0 || head.y < 0 || 
         head.x >= CANVAS_SIZE || head.y >= CANVAS_SIZE;
}

function checkSelfCollision(head) {
  return snake.some((segment, index) => 
    index !== 0 && segment.x === head.x && segment.y === head.y
  );
}

function resetGame() {
  clearInterval(interval);
  interval = null;
  init();
}

// ====================
// EVENT HANDLING
// ====================
function handleKeyDown(e) {
  // Start game
  if (e.key === "Enter" && !interval) {
    startGame();
    return;
  }
  
  // Pause toggle
  if (e.key === " ") {
    if (interval) paused = !paused;
    return;
  }
  
  // Restart game
  if ((e.key === "r" || e.key === "R") && gameOver) {
    resetGame();
    return;
  }
  
  // Direction changes (only if game is running)
  if (interval && !paused && !gameOver) {
    switch (e.key) {
      case "ArrowUp":
        if (direction !== "DOWN") nextDirection = "UP";
        break;
      case "ArrowDown":
        if (direction !== "UP") nextDirection = "DOWN";
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") nextDirection = "LEFT";
        break;
      case "ArrowRight":
        if (direction !== "LEFT") nextDirection = "RIGHT";
        break;
    }
  }
}

// ====================
// BACKEND INTEGRATION
// ====================
async function submitScore(finalScore) {
  try {
    await fetch("http://localhost:3000/scores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ score: finalScore })
    });
  } catch (error) {
    console.error("Failed to submit score:", error);
  }
}

async function fetchScores() {
  try {
    const response = await fetch("http://localhost:3000/scores");
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch scores:", error);
    return [];
  }
}

// ====================
// SETUP & INIT
// ====================
document.addEventListener("keydown", handleKeyDown);
init(); // Initialize and draw start screen
