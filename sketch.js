// Zoom from a Soap Bubble to Infinity
// 6 scales: Soap → Molecules → Atoms → Quantum Foam → Galaxy → Infinity
// Tap screen to start cosmic drone (pitch rises as you zoom out)

let zoom = 1.0;           // current zoom level (1 = closest)
const ZOOM_SPEED = 0.005; // slow, steady zoom for a 7‑minute journey
const MAX_ZOOM = 12.0;    // after this, reset to 1 (loop)
let time = 0;             // for animations
let oscillator;           // generative sound
let soundStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Create oscillator for ambient drone
  oscillator = new p5.Oscillator('sine');
  oscillator.amp(0.2);     // volume
}

function draw() {
  background(0); // deep space black
  
  // --- Zoom logic ---
  zoom += ZOOM_SPEED;
  if (zoom > MAX_ZOOM) {
    zoom = 1.0; // loop back to beginning
  }
  
  // --- Apply camera zoom (scale inversely) ---
  push();
  translate(width / 2, height / 2);
  scale(1 / zoom);
  
  // Choose which scene to draw based on zoom level
  if (zoom < 2.0) {
    drawSoap();
  } else if (zoom < 4.0) {
    drawMolecules();
  } else if (zoom < 6.0) {
    drawAtoms();
  } else if (zoom < 8.0) {
    drawQuantumFoam();
  } else if (zoom < 10.0) {
    drawGalaxy();
  } else {
    drawInfinity();
  }
  
  pop(); // restore normal coordinate system
  
  // --- Update sound pitch (if started) ---
  if (soundStarted) {
    // Map zoom to frequency: 100 Hz at zoom=1, 800 Hz at zoom=12
    let freq = map(zoom, 1, MAX_ZOOM, 100, 800);
    oscillator.freq(freq);
  }
  
  // --- Display current level text at bottom ---
  push();
  fill(255, 200);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  let label = "";
  if (zoom < 2.0) label = "🧼 Soap Bubble";
  else if (zoom < 4.0) label = "🧪 Molecules";
  else if (zoom < 6.0) label = "⚛️ Atoms";
  else if (zoom < 8.0) label = "🌌 Quantum Foam";
  else if (zoom < 10.0) label = "🌠 Galaxy";
  else label = "♾️ Infinity";
  text(label, width / 2, height - 30);
  pop();
  
  // --- Show "tap to start sound" message if needed ---
  if (!soundStarted) {
    push();
    fill(255);
    textSize(20);
    text("Tap screen to start cosmic drone", width / 2, height / 2);
    pop();
  }
  
  // Advance time for animations
  time += 0.01;
}

// ---------- Drawing functions for each scale ----------

function drawSoap() {
  // Iridescent soap bubbles
  for (let i = 0; i < 10; i++) {
    let x = sin(time + i) * 150;
    let y = cos(time * 0.8 + i) * 150;
    let size = 80 + sin(time * 2 + i) * 20;
    
    // Shimmering colors (hue cycles)
    let hue = (time * 20 + i * 30) % 360;
    fill(hue, 80, 80, 0.6);
    noStroke();
    circle(x, y, size);
    
    // Inner highlight
    fill(255, 255, 255, 0.3);
    circle(x - 5, y - 5, size * 0.3);
  }
}

function drawMolecules() {
  // Simple lattice structure
  let spacing = 40;
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      let x = i * spacing + sin(time + i) * 5;
      let y = j * spacing + cos(time + j) * 5;
      
      // Bonds (lines)
      stroke(100, 200, 255, 0.5);
      strokeWeight(1);
      if (i < 3) line(x, y, x + spacing, y);
      if (j < 3) line(x, y, x, y + spacing);
      
      // Atoms (circles)
      noStroke();
      fill(255, 150, 0, 0.9);
      circle(x, y, 10);
    }
  }
}

function drawAtoms() {
  // Nuclei with orbiting electrons
  for (let i = 0; i < 5; i++) {
    let x = sin(time * 2 + i * 2) * 100;
    let y = cos(time * 1.3 + i) * 100;
    
    // Nucleus
    fill(255, 0, 100, 0.8);
    noStroke();
    circle(x, y, 15);
    
    // Electron orbit (ring)
    noFill();
    stroke(0, 200, 255, 0.4);
    strokeWeight(1);
    circle(x, y, 35);
    
    // Electron (tiny dot on the orbit)
    let angle = time * 5 + i;
    let ex = x + cos(angle) * 17.5;
    let ey = y + sin(angle) * 17.5;
    fill(0, 255, 255);
    circle(ex, ey, 3);
  }
}

function drawQuantumFoam() {
  // Flickering dots (conceptual quantum foam)
  for (let i = 0; i < 200; i++) {
    let x = random(-200, 200);
    let y = random(-200, 200);
    let alpha = random(100, 255);
    let size = random(1, 4);
    
    fill(255, 255, 255, alpha);
    noStroke();
    circle(x, y, size);
  }
}

function drawGalaxy() {
  // Spiral galaxy of many dots
  stroke(255, 200, 255, 150);
  strokeWeight(1);
  for (let i = 0; i < 300; i++) {
    let angle = i * 0.2 + time * 5;
    let radius = i * 1.5;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    point(x, y);
  }
}

function drawInfinity() {
  // Recursive tunnel of ellipses
  for (let i = 0; i < 10; i++) {
    let size = 200 / (i + 1);
    let x = sin(time * 2 + i) * 50;
    let y = cos(time * 2 + i) * 50;
    stroke(255, 100 - i * 8);
    noFill();
    ellipse(x, y, size, size);
  }
  // Random stars
  for (let j = 0; j < 150; j++) {
    let x = random(-250, 250);
    let y = random(-250, 250);
    stroke(255, random(100, 255));
    point(x, y);
  }
}

// ---------- Sound control ----------
function mousePressed() {
  if (!soundStarted) {
    oscillator.start();
    oscillator.freq(100); // start at low pitch
    soundStarted = true;
  }
}

// Handle window resize (mobile orientation change)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
