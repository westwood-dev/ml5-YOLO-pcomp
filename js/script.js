/**
 * @file script.js
 * @description This file contains the JavaScript code for a video detection application using ml5.js and YOLO object detection model. It includes functions for model loading, video detection, serial communication, and UI event handling.
 */

// Variables //

let video, detector, detections, serial, detectTimeout;
let minConfidence = 0;
let potData = 0;
let modelLoaded = false;
let lastPotValue = 0;

// Detection Data Elements //

// Timeline Slider
const timelineSlider = document.querySelector('#timeline-slider');
const timelineSliderValue = document.querySelector('#timeline-slider-value');

// Confidence Slider
const confidenceSlider = document.querySelector('#confidence-slider');
const confidenceSliderValue = document.querySelector(
  '#confidence-slider-value'
);

// Show Results Checkbox
const showResults = document.querySelector('#show-results-input');

// Categories Holder un-ordered list
const categoriesHolder = document.querySelector('#categories-holder');

// ML5 Functions //

// Function to run when the ml5 yolo model is loaded
function modelReady() {
  console.log('model loaded');
  modelLoaded = true;
}

// Function to detect objects in the video
function detect() {
  if (!modelLoaded) {
    return;
  }
  detector.detect(video, gotResults);
}

// Function to handle the detection results
function gotResults(err, results) {
  if (err) {
    // console.log(err, video);
    return;
  }

  detections = results;
}

// p5.js Functions //

function preload() {
  detector = ml5.objectDetector('yolo', modelReady);
}

function setup() {
  let canvas = createCanvas(1280, 720);
  // Move the canvas so it’s inside the <div id="video-holder">.
  canvas.parent('video-holder');

  //create a Serial connection
  serial = new Serial();

  // run the 'serialDataRecieved' function when the data is received on serial
  serial.on(SerialEvents.DATA_RECEIVED, serialDataReceived);

  // Load the video as an html DOM element and hide it from view
  video = createVideo('../video/test_footage.mp4');
  video.size(width, height);
  video.hide();
  video.volume(0);
}

function draw() {
  // Draw the video frame to the canvas
  image(video, 0, 0, width, height);

  // Set the timeline slider value to the current video time
  let timelineValue = (video.elt.currentTime / video.elt.duration) * 1023;

  // If the serial port is open, update the potData value
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

  // If the video is playing and the model is loaded, detect objects
  if (potData === lastPotValue && serial.isOpen()) {
    detectTimeout = setTimeout(() => {
      // console.log('detecting');
      detect();
    }, 300);
  }

  // If there are detections and the showResults checkbox is checked, draw the results
  if (detections && showResults.checked) {
    detections.forEach((detection) => {
      // If the detection confidence is less than the minConfidence, skip it
      if (detection.confidence < minConfidence) {
        return;
      }
      noStroke();
      fill(255);
      strokeWeight(2);
      // Draw the label
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
      // Draw the bounding box
      rect(
        detection.normalized.x * width,
        detection.normalized.y * height,
        detection.normalized.width * width,
        detection.normalized.height * height
      );
    });
    // Filter unique categories and display them in the categoriesHolder
    let uniqueCategories = [
      ...new Set(detections.map((detection) => detection.label)),
    ];
    categoriesHolder.innerHTML = '';
    uniqueCategories.forEach((category) => {
      categoriesHolder.innerHTML += '<li>' + category + '</li>';
    });
  }
}

// Serial Communication Functions //

// Function to run when data is received on the serial port
function serialDataReceived(_, data) {
  potData = parseInt(data);
  // console.log(parseInt(data));
}

// Control Events

// Timeline Slider Event for when the slider is manually changed
timelineSlider.addEventListener('input', (e) => {
  video.elt.currentTime = (e.target.value / 1023) * video.elt.duration;
  // If the serial port is not open, update the potData value manually
  if (!serial.isOpen()) {
    potData = e.target.value;
  }
});

// Confidence Slider Event for when the slider is manually changed
confidenceSlider.addEventListener('input', (e) => {
  confidenceSliderValue.innerHTML = Number(e.target.value).toFixed(2);
  minConfidence = Number(e.target.value).toFixed(2);
});

// Serial Connection Event
// This event listener handles the click event on the serialConnect button.
document.querySelector('#serialConnect').addEventListener('click', () => {
  if (!serial.isOpen()) {
    // If the serial port is not open, it connects and opens the port.
    serial.connectAndOpen(null);
    document.querySelector('#serialConnect').innerHTML = 'Disconnect';
  } else {
    // If the serial port is already open, it closes the port (disconnects).
    serial.close();
    document.querySelector('#serialConnect').innerHTML = 'Connect';
  }
});
