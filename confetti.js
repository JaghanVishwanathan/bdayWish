const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pieces = [];

for (let i = 0; i < 150; i++) {
  pieces.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    size: Math.random() * 6 + 2,
    speed: Math.random() * 3 + 1,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  });
}

function update() {
  pieces.forEach(p => {
    p.y += p.speed;
    if (p.y > canvas.height) {
      p.y = -p.size;
      p.x = Math.random() * canvas.width;
    }
  });
}

function loop() {
  draw();
  update();
  requestAnimationFrame(loop);
}

function startConfetti() {
  canvas.style.display = "block";
  loop();
}
canvas.style.display = "none";
