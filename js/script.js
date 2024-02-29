// Variables //

let video, detector, detections, serial, detectTimeout;
let minConfidence = 0;
let potData = 0;
let modelLoaded = false;
let lastPotValue = 0;

// Detection Data Elements //

const timelineSlider = document.querySelector('#timeline-slider');
const timelineSliderValue = document.querySelector('#timeline-slider-value');

const confidenceSlider = document.querySelector('#confidence-slider');
const confidenceSliderValue = document.querySelector(
  '#confidence-slider-value'
);

const showResults = document.querySelector('#show-results-input');

const categoriesHolder = document.querySelector('#categories-holder');

function unique(value, index, self) {
  return self.indexOf(value) === index;
}

// ML5 Functions //

function modelReady() {
  console.log('model loaded');
  modelLoaded = true;
}

function detect() {
  if (!modelLoaded) {
    return;
  }
  detector.detect(video, gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.log(err, video);
    return;
  }

  detections = results;
}

function preload() {
  detector = ml5.objectDetector('yolo', modelReady);
}

function setup() {
  let canvas = createCanvas(1280, 720);
  canvas.parent('video-holder');

  //create a Serial connection
  serial = new Serial();

  serial.on(SerialEvents.DATA_RECEIVED, (_, data) => {
    potData = parseInt(data);
    console.log(parseInt(data));
  });

  video = createVideo('../video/test_footage.mp4');
  video.size(width, height);
  video.hide();
  video.volume(0);
}

function draw() {
  image(video, 0, 0, width, height);

  let timelineValue = (video.elt.currentTime / video.elt.duration) * 1023;

  if (serial.isOpen()) {
    if (abs(potData - lastPotValue) > 2) {
      lastPotValue = potData;
      timelineSlider.value = potData;
      timelineSliderValue.innerHTML = potData.toFixed(2);
      video.elt.currentTime = (potData / 1023) * video.elt.duration;
      clearTimeout(detectTimeout);
    }
  } else {
    timelineSlider.value = timelineValue;
    timelineSliderValue.innerHTML = timelineValue.toFixed(2);
  }

  if (potData === lastPotValue && serial.isOpen()) {
    detectTimeout = setTimeout(() => {
      console.log('detecting');
      detect();
    }, 300);
  }

  if (detections && showResults.checked) {
    detections.forEach((detection) => {
      if (detection.confidence < minConfidence) {
        return;
      }
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
    let uniqueCategories = detections.map((detection) => detection.label);
    categoriesHolder.innerHTML = '';
    uniqueCategories.filter(unique).forEach((category) => {
      categoriesHolder.innerHTML += '<li>' + category + '</li>';
    });
    // console.log(uniqueCategories.filter(unique));
  }
}

// Control Events

timelineSlider.addEventListener('input', (e) => {
  video.elt.currentTime = (e.target.value / 1023) * video.elt.duration;
});

confidenceSlider.addEventListener('input', (e) => {
  confidenceSliderValue.innerHTML = Number(e.target.value).toFixed(2);
  minConfidence = Number(e.target.value).toFixed(2);
});

document.querySelector('#serialConnect').addEventListener('click', () => {
  if (!serial.isOpen()) {
    serial.connectAndOpen(null);
    document.querySelector('#serialConnect').innerHTML = 'Disconnect';
  } else {
    serial.close();
    document.querySelector('#serialConnect').innerHTML = 'Connect';
  }
});
