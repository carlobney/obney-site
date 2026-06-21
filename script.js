const canvas = document.querySelector("#factory-canvas");
const ctx = canvas.getContext("2d");

const nodes = [
  { label: "INTAKE", x: 0.16, y: 0.24, color: "#b7ff68" },
  { label: "SPEC", x: 0.42, y: 0.18, color: "#eef2e7" },
  { label: "ASSEMBLY", x: 0.68, y: 0.28, color: "#86a9c8" },
  { label: "INSPECT", x: 0.78, y: 0.55, color: "#ffbe55" },
  { label: "SHIP", x: 0.50, y: 0.70, color: "#b7ff68" },
  { label: "LOOP", x: 0.22, y: 0.60, color: "#eef2e7" },
];

const links = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [1, 4],
  [0, 3],
];

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawGrid(width, height) {
  ctx.save();
  ctx.strokeStyle = "rgba(238, 242, 231, 0.055)";
  ctx.lineWidth = 1;

  for (let x = 0; x < width; x += 36) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y < height; y += 36) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
}

function drawNode(node, width, height, t) {
  const x = node.x * width;
  const y = node.y * height;
  const pulse = Math.sin(t / 520 + x * 0.01) * 0.5 + 0.5;
  const radius = 33 + pulse * 4;

  ctx.save();
  ctx.strokeStyle = node.color;
  ctx.fillStyle = "rgba(8, 11, 10, 0.86)";
  ctx.shadowColor = node.color;
  ctx.shadowBlur = 16 + pulse * 12;
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.rect(x - radius, y - radius, radius * 2, radius * 2);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = node.color;
  ctx.font = "600 11px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(node.label, x, y);
  ctx.restore();
}

function drawLink(a, b, width, height, t, index) {
  const from = nodes[a];
  const to = nodes[b];
  const x1 = from.x * width;
  const y1 = from.y * height;
  const x2 = to.x * width;
  const y2 = to.y * height;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const progress = ((t / 1900 + index * 0.13) % 1);

  ctx.save();
  ctx.strokeStyle = "rgba(238, 242, 231, 0.16)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.fillStyle = index % 2 ? "#b7ff68" : "#ffbe55";
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(x1 + dx * progress, y1 + dy * progress, 3.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawTelemetry(width, height, t) {
  ctx.save();
  ctx.fillStyle = "rgba(238, 242, 231, 0.62)";
  ctx.font = "500 11px 'IBM Plex Mono', monospace";
  ctx.fillText("TRACE / BUILD-LINE / " + String(Math.floor(t / 17) % 9999).padStart(4, "0"), 28, 34);

  const bars = [0.82, 0.58, 0.74, 0.42, 0.91, 0.66, 0.52];
  bars.forEach((bar, index) => {
    const x = 28 + index * 24;
    const y = height - 118;
    const h = 54 * (0.55 + Math.sin(t / 700 + index) * 0.08 + bar * 0.35);
    ctx.fillStyle = index % 3 === 0 ? "rgba(183, 255, 104, 0.78)" : "rgba(238, 242, 231, 0.34)";
    ctx.fillRect(x, y - h, 10, h);
  });
  ctx.restore();
}

function render(t = 0) {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;

  ctx.clearRect(0, 0, width, height);
  drawGrid(width, height);

  links.forEach(([a, b], index) => drawLink(a, b, width, height, t, index));
  nodes.forEach((node) => drawNode(node, width, height, t));
  drawTelemetry(width, height, t);

  requestAnimationFrame(render);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
requestAnimationFrame(render);
