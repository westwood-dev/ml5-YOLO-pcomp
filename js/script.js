let video;
let detector;
let detections;
let port;

function preload() {
  // detector = ml5.objectDetector('yolo', modelReady);
}

function setup() {
  let canvas = createCanvas(1280, 720);
  canvas.parent('video-holder');

  //create a Serial connection
  port = createSerial();

  // video = createCapture(VIDEO);
  video = createVideo('../video/test_footage.mp4');
  video.size(width, height);
  video.hide();
  video.volume(0);
  // video.play();

  frameRate(30);
}

function modelReady() {
  console.log('model loaded');
  // detect();
}

function detect() {
  if (video.elt.buffered.length > 0) {
    detector.detect(video, gotResults);
  } else {
    setTimeout(() => {
      detect();
    }, 100);
  }
}

function gotResults(err, results) {
  if (err) {
    console.log(err, video);
    return;
  }

  detections = results;

  detect();
}

const timelineSlider = document.querySelector('#timeline-slider');
const timelineSliderValue = document.querySelector('#timeline-slider-value');

const confidenceSlider = document.querySelector('#confidence-slider');
const confidenceSliderValue = document.querySelector(
  '#confidence-slider-value'
);

let lastPotValue = 0;

function draw() {
  image(video, 0, 0, width, height);

  let timelineValue = (video.elt.currentTime / video.elt.duration) * 1023;

  if (port.opened()) {
    console.log(port.readUntil('\n'));
  } else {
    timelineSlider.value = timelineValue;
    timelineSliderValue.innerHTML = timelineValue.toFixed(2);
  }

  if (detections) {
    detections.forEach((detection) => {
      noStroke();
      fill(255);
      strokeWeight(2);
      text(
        detection.label + ' / ' + detection.confidence.toFixed(2),
        detection.normalized.x * width + 4,
        detection.normalized.y * height + 10
      );

      noFill();
      strokeWeight(3);
      if (detection.label === 'person') {
        stroke(0, 255, 0);
      } else {
        stroke(0, 0, 255);
      }
      rect(
        detection.normalized.x * width,
        detection.normalized.y * height,
        detection.normalized.width * width,
        detection.normalized.height * height
      );
    });
  }
}

// Control Events

timelineSlider.addEventListener('input', (e) => {
  video.elt.currentTime = (e.target.value / 1023) * video.elt.duration;
});

confidenceSlider.addEventListener('input', (e) => {
  confidenceSliderValue.innerHTML = Number(e.target.value).toFixed(2);
});

document.querySelector('#serialConnect').addEventListener('click', () => {
  if (!port.opened()) {
    port.open('Arduino', 9600);
    document.querySelector('#serialConnect').innerHTML = 'Disconnect';
  } else {
    port.close();
    document.querySelector('#serialConnect').innerHTML = 'Connect';
  }
});
