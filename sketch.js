// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];
let circleX, circleY; // 圓的初始位置
let circleRadius = 50; // 圓的半徑
let isDrawing = false; // 是否正在畫軌跡
let trailColor; // 軌跡顏色

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // 圓的初始位置設置在視窗中間
  circleX = width / 2;
  circleY = height / 2;

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);

  // 畫出圓
  fill(0, 0, 255, 150); // 半透明藍色
  noStroke();
  circle(circleX, circleY, circleRadius * 2);

  // 確保至少檢測到一隻手
  if (hands.length > 0) {
    let isHandTouching = false; // 檢查是否有手指夾住圓

    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // 獲取食指與大拇指的座標
        let indexFinger = hand.keypoints[8];
        let thumb = hand.keypoints[4];

        // 檢查食指與大拇指是否同時碰觸圓的邊緣
        let dIndex = dist(indexFinger.x, indexFinger.y, circleX, circleY);
        let dThumb = dist(thumb.x, thumb.y, circleX, circleY);

        if (dIndex < circleRadius && dThumb < circleRadius) {
          // 如果兩者同時碰觸到，讓圓跟隨手指移動
          circleX = (indexFinger.x + thumb.x) / 2;
          circleY = (indexFinger.y + thumb.y) / 2;

          // 設置軌跡顏色
          if (hand.handedness === "Right") {
            trailColor = color(255, 0, 0); // 紅色
          } else if (hand.handedness === "Left") {
            trailColor = color(0, 255, 0); // 綠色
          }

          isDrawing = true; // 開始畫軌跡
          isHandTouching = true;
        }

        // 繪製手部關鍵點
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 根據左右手設置顏色
          if (hand.handedness == "Left") {
            fill(255, 0, 255);
          } else {
            fill(255, 255, 0);
          }

          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }

        // 繪製手部骨架
        stroke(0, 255, 0);
        strokeWeight(2);

        // Connect keypoints 0-4
        for (let i = 0; i < 4; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 5-8
        for (let i = 5; i < 8; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 9-12
        for (let i = 9; i < 12; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 13-16
        for (let i = 13; i < 16; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }

        // Connect keypoints 17-20
        for (let i = 17; i < 20; i++) {
          line(
            hand.keypoints[i].x,
            hand.keypoints[i].y,
            hand.keypoints[i + 1].x,
            hand.keypoints[i + 1].y
          );
        }
      }
    }

    // 如果沒有手指夾住圓，停止畫軌跡
    if (!isHandTouching) {
      isDrawing = false;
    }
  } else {
    // 如果沒有檢測到手，停止畫軌跡
    isDrawing = false;
  }

  // 畫出軌跡
  if (isDrawing) {
    stroke(trailColor);
    strokeWeight(2);
    point(circleX, circleY);
  }
}
