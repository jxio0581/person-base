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
    this.color = this.createColor(color);  // 创建初始颜色对象

    this.currentWidth = width;
    this.currentHeight = height;
    this.targetWidth = width;
    this.targetHeight = height;

    this.currentColor = this.color; // 当前颜色初始化为初始颜色
    this.targetColor = this.color; // 目标颜色初始化为初始颜色

    
  }

  // 创建或验证颜色对象
  createColor(c) {
    // 检查c是否已经是一个颜色对象
    if (c instanceof p5.Color) {
      return c;
    } else {
      // 假设c是[r, g, b]数组
      return color(c[0], c[1], c[2]);
    }
  }

  draw(energy) {
    this.targetWidth = map(energy, 0, 255, this.width * 0.9, this.width * 1.6);
    this.targetHeight = map(energy, 0, 255, this.height * 0.9, this.height * 1.6);
    this.currentWidth = lerp(this.currentWidth, this.targetWidth, 0.2);
    this.currentHeight = lerp(this.currentHeight, this.targetHeight, 0.2);

    // 更新颜色目标值
    let brightnessFactor = 1 + energy / 255;
    let r = red(this.color) * brightnessFactor;
    let g = green(this.color) * brightnessFactor;
    let b = blue(this.color) * brightnessFactor;

    // 确保颜色值在0到255之间
    r = constrain(r, 0, 255);
    g = constrain(g, 0, 255);
    b = constrain(b, 0, 255);

    this.targetColor = color(r, g, b);

    // 平滑过渡当前颜色
    this.currentColor = lerpColor(this.currentColor, this.targetColor, 0.1);

    fill(this.currentColor);
    noStroke();
    rect(this.x + (this.width - this.currentWidth) / 2, this.y + (this.height - this.currentWidth) / 2, this.currentWidth, this.currentHeight);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateSegments();
}
