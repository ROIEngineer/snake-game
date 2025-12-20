// Screen configuration
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 20;
const CANVAS_SIZE = 400;

// Game start
let gameOver = false;

let speed = 200;

let snake = [
  { x: 200, y: 200 },
  { x: 180, y: 200 },
  { x: 160, y: 200 }
];

let direction = "RIGHT";

let food = randomFoodPosition();

let score = 0;

// Update
function update() {
  if (gameOver) return;

  const head = { ...snake[0] }; // Array > list of items

  if (checkWallCollision(head) || checkSelfCollision(head)) {
    gameOver = true;
    return;
  }

  switch (direction) {
    case "UP":
      head.y -= TILE_SIZE;
      break;
    case "DOWN":
      head.y += TILE_SIZE;
      break;
    case "LEFT":
      head.x -= TILE_SIZE;
      break;
    case "RIGHT":
      head.x += TILE_SIZE;
      break;
  }

  snake.unshift(head); // Add new head to beginning

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFoodPosition();
  } else {
    snake.pop();
  }
}

// Draw
function draw() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // Clear the previous frame

  // Draw food
  ctx.fillStyle = "red"; // Set color
  ctx.fillRect(food.x, food.y, TILE_SIZE, TILE_SIZE);

  // Draw snake
  ctx.fillStyle = "limegreen";
  snake.forEach((segment) => {
    ctx.fillRect(segment.x, segment.y, TILE_SIZE, TILE_SIZE);
  });

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Game Over Screen
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game over", CANVAS_SIZE / 2, CANVAS_SIZE / 2);

    ctx.font = "16px Arial";
    ctx.fillText(
      "Press R to Restart",
      CANVAS_SIZE / 2,
      CANVAS_SIZE / 2 + 30
    );
  }
}

// Food position
function randomFoodPosition() {
  let position;
  let collision;

  do {
    position = {
      x: Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE,
      y: Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE
    };

    collision = snake.some(
      segment => segment.x === position.x && segment.y === position.y
    );
  } while (collision);

  return position;
}

// Wall collision
function checkWallCollision(head) {
  return (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= CANVAS_SIZE ||
    head.y >= CANVAS_SIZE
  );
}

// Self collision
function checkSelfCollision(head) {
  return snake.some(
    (segment, index) =>
      index !== 0 &&
      segment.x === head.x &&
      segment.y === head.y
  );
}

// Reset game
function resetGame() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ];
  direction = "RIGHT";
  food = randomFoodPosition();
  score = 0;
  gameOver = false;
}

// Game loop
function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 100);

/* How do I implement this ?
function startGameLoop() {
  return setInterval(gameLoop, speed);
}

let interval = startGameLoop();

if (score % 5 === 0 && speed > 50) {
  clearInterval(interval);
  speed -= 20;
  interval = startGameLoop();
}
*/

// Event listener
document.addEventListener("keydown", e => {
  if (e.key === "r" || e.key === "R") {
    if (gameOver) resetGame();
  }

  switch (e.key) {
    case "ArrowUp":
      if (direction !== "DOWN") direction = "UP";
      break;
    case "ArrowDown":
      if (direction !== "UP") direction = "DOWN";
      break;
    case "ArrowLeft":
      if (direction !== "RIGHT") direction = "LEFT";
      break;
    case "ArrowRight":
      if (direction !== "LEFT") direction = "RIGHT";
      break;
  }
});
