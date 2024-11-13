let img;
let music;
let numSegments = 40; 
let segments = [];
let button;
let fft;

function preload() {
  img = loadImage('assets/Claude_Monet.jpg', () => console.log("Image loaded"), (e) => console.error("Error loading image", e));
  music = loadSound('assets/LaTale_Music.mp3', () => console.log("Music loaded"), (e) => console.error("Error loading sound", e));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  button = createButton("Play");
  button.mousePressed(togglePlaying);
  fft = new p5.FFT(0.95, 256); 
  calculateSegments(img, numSegments);
}

function togglePlaying() {
  if (!music.isPlaying()) {
    music.play();
    button.html("Pause");
  } else {
    music.pause();
    button.html("Play");
  }
}

function draw() {
  background(255);
  let spectrum = fft.analyze();
  for (let i = 0; i < segments.length; i++) {
    let segment = segments[i];
    let energy = spectrum[int(random(spectrum.length))];
    segment.draw(energy);
  }
}

function calculateSegments(image, numSegments) {
  segments = []; 
  let scaleFactor = min(width / image.width, height / image.height);
  let displayWidth = image.width * scaleFactor;
  let displayHeight = image.height * scaleFactor;
  let offsetX = (width - displayWidth) / 2;
  let offsetY = (height - displayHeight) / 2;

  let segmentWidth = displayWidth / numSegments;
  let segmentHeight = displayHeight / numSegments;

  for (let y = 0; y < displayHeight; y += segmentHeight) {
    for (let x = 0; x < displayWidth; x += segmentWidth) {
      let originalX = x / scaleFactor;
      let originalY = y / scaleFactor;
      let col = img.get(originalX + (segmentWidth / scaleFactor) / 2, originalY + (segmentHeight / scaleFactor) / 2);
      let segment = new ImageSegment(offsetX + x, offsetY + y, segmentWidth, segmentHeight, col);
      segments.push(segment);
    }
  }
}

class ImageSegment {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(energy) {
    let dynamicSize = map(energy, 0, 255, this.width * 0.8, this.width * 1.2);
    let dynamicColor = color(
      red(this.color) * (1 + energy / 255),
      green(this.color) * (1 + energy / 255),
      blue(this.color) * (1 + energy / 255)
    );

    fill(dynamicColor);
    noStroke();
    rect(this.x + (this.width - dynamicSize) / 2, this.y + (this.height - dynamicSize) / 2, dynamicSize, dynamicSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateSegments(img, numSegments);
}
