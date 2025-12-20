const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 40;
const CANVAS_SIZE = 400;

let snake = [
  { x: 200, y: 200 },
  { x: 180, y: 200 },
  { x: 160, y: 200 }
];

let direction = "UP";

let food = randomFoodPosition();

let score = 0;

function update() {
  const head = { ...snake[0] }; // Array > list of items

  switch (direction) {
    case "UP":
      head.y -= TILE_SIZE;
      break
    case "DOWN":
      head.y += TILE_SIZE;
      break
    case "LEFT":
      head.x -= TILE_SIZE;
      break
    case "RIGHT":
      head.x += TILE_SIZE;
      break
  }

  snake.unshift(head); // Add new head to beginning

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFoodPosition();
  } else {
    snake.pop();
  }
}

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
}

function randomFoodPosition() {
  return {
    x: Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE,
    y: Math.floor(Math.random() * (CANVAS_SIZE / TILE_SIZE)) * TILE_SIZE
  }
}

function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 200);

document.addEventListener("keydown", e => {
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
