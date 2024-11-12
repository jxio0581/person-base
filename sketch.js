let img;
let numSegments = 300;
let segments = [];

function preload() {
  img = loadImage('assets/Claude_Monet.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateSegments(img, numSegments);
  // noLoop();
}

function draw() {
  background(255);
  for (const segment of segments) {
    segment.draw();
  }
}

function calculateSegments(image, numSegments) {
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
      let segmentColor = image.get(originalX + (segmentWidth / scaleFactor) / 2, originalY + (segmentHeight / scaleFactor) / 2);
      let segment = new ImageSegment(offsetX + x, offsetY + y, segmentWidth, segmentHeight, segmentColor);
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

  draw() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  segments = []; 
  calculateSegments(img, numSegments);
  redraw();
}
