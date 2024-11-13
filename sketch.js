let img;
let music;
let numSegments = 30;
let segments = [];
let button;
let fft;

function preload() {
  img = loadImage('assets/Claude_Monet.jpg');
  music = loadSound('assets/LaTale_Music.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  fft = new p5.FFT(0.8, 64);
  button = createButton('Play');
  button.mousePressed(togglePlaying);

  calculateSegments();
}

function togglePlaying() {
  if (music.isPlaying()) {
    music.pause();
    button.html('Play');
  } else {
    music.play();
    button.html('Pause');
  }
}

function draw() {
  background(255);
  let spectrum = fft.analyze();

  // for (let segment of segments) {
  //   let energy = spectrum[int(random(spectrum.length))];
  //   segment.draw(energy);
  // }

  for (let segment of segments) {
    let energy = spectrum[int(random(spectrum.length))];
    // segment.update(energy); 
    segment.draw(energy); 
  }
  console.log(frameCount)
}

function calculateSegments() {
  segments = [];
  let scaleFactor = min(width / img.width, height / img.height);
  let displayWidth = img.width * scaleFactor;
  let displayHeight = img.height * scaleFactor;
  let offsetX = (width - displayWidth) / 2;
  let offsetY = (height - displayHeight) / 2;

  let segmentWidth = displayWidth / numSegments;
  let segmentHeight = displayHeight / numSegments;

  for (let y = 0; y < displayHeight; y += segmentHeight) {
    for (let x = 0; x < displayWidth; x += segmentWidth) {
      let originalX = x / scaleFactor;
      let originalY = y / scaleFactor;
      let col = img.get(originalX + segmentWidth / 2 / scaleFactor, originalY + segmentHeight / 2 / scaleFactor);
      segments.push(new ImageSegment(offsetX + x, offsetY + y, segmentWidth, segmentHeight, col));
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

    this.currentWidth = width;
    this.currentHeight = height;
    this.targetWidth = width;
    this.targetHeight = height;

    
  }

  draw(energy) {
    this.targetWidth = map(energy, 0, 255, this.width * 0.9, this.width * 1.6);
    this.targetHeight = map(energy, 0, 255, this.height * 0.9, this.height * 1.6);
    this.currentWidth = lerp(this.currentWidth, this.targetWidth, 0.2);
    this.currentHeight = lerp(this.currentHeight, this.targetHeight, 0.2);

    // let dynamicColor = color(
    //   red(this.color) * (1 + energy / 255),
    //   green(this.color) * (1 + energy / 255),
    //   blue(this.color) * (1 + energy / 255)
    // );

    // fill(dynamicColor);
    fill(this.color);
    noStroke();
    rect(this.x + (this.width - this.currentWidth) / 2, this.y + (this.height - this.currentWidth) / 2, this.currentWidth, this.currentHeight);
  }
}





function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateSegments();
}
