let img;
let numSegments = 30;  // 控制分段数，值越大分段越小
let brushTexture;

function preload() {
  img = loadImage('assets/Claude_Monet.jpg');
  brushTexture = loadImage('assets/brush_texture_1.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // noLoop();
}

function draw() {
  if (!img || !brushTexture) return; // 确保图像和纹理已加载

  background(255);

  // 计算图像的显示尺寸
  let scaleFactor = min(width / img.width, height / img.height);
  let displayWidth = img.width * scaleFactor;
  let displayHeight = img.height * scaleFactor;

  // 计算图像在画布中央的位置
  let offsetX = (width - displayWidth) / 2;
  let offsetY = (height - displayHeight) / 2;

  // 计算每个分段的宽度和高度
  let segmentWidth = displayWidth / numSegments;
  let segmentHeight = displayHeight / numSegments;

  // 遍历每个分段
  for (let segYPos = 0; segYPos < displayHeight; segYPos += segmentHeight) {
    for (let segXPos = 0; segXPos < displayWidth; segXPos += segmentWidth) {
      // 获取原图中的颜色
      let originalX = segXPos / scaleFactor;
      let originalY = segYPos / scaleFactor;
      let segmentColour = img.get(originalX + (segmentWidth / scaleFactor) / 2, originalY + (segmentHeight / scaleFactor) / 2);

      // 绘制笔刷效果
      applyBrush(offsetX + segXPos, offsetY + segYPos, segmentWidth, segmentHeight, segmentColour);
    }
  }
  console.log(frameCount);
}

function applyBrush(x, y, w, h, color) {
  // 设置每个笔刷的宽高
  let brushWidth = w * 1.5;
  let brushHeight = h * 1.5;

  // 应用颜色
  tint(color);

  // 随机旋转并绘制带笔刷纹理的图像
  // push();
  // translate(x + brushWidth / 2, y + brushHeight / 2);
  // rotate(random(-PI / 6, PI / 6));
  // imageMode(CENTER);
  image(brushTexture, 0, 0, brushWidth, brushHeight);
  // pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}
