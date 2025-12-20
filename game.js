const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 20;
const CANVAS_SIZE = 400;

let x = 0;
let y = 0;

function update() {
  x += TILE_SIZE; // Move right by one tile
  if (x >= CANVAS_SIZE) { // Is edge reached?
    x = 0; // Reset to left side
  }
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // Clear the previous frame

  ctx.fillStyle = "limegreen"; // Set color
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE); // Draw square at current position
}

function gameLoop() {
  update();
  draw();
}

setInterval(gameLoop, 200);
