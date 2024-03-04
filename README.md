# Object detection with PCOMP controls

A project using p5.js, ml5.js, and Arduino over serial for object detection.

## Description

This project combines the power of p5.js, ml5.js, and Arduino to perform object detection. The p5.js library is used for creating interactive visuals, while ml5.js provides pre-trained machine learning models for object detection (yolo). Arduino is used to establish a serial connection with the computer, allowing real-time communication between the hardware and software components, via the Serial.js library.

## Features

- Real-time object detection using pre-trained machine learning models
- Interactive visuals created with p5.js
- Arduino integration for hardware communication

## Installation

1. Clone the repository: `git clone https://github.com/your-username/project-name.git`
2. Install the necessary dependencies:

- p5.js: [Installation guide](https://p5js.org/get-started/)
- serial.js: [Available here](https://github.com/makeabilitylab/p5js) (Under '\_libraries/serial.js')
- ml5.js: [Installation guide](https://ml5js.org/docs/getting-started.html)
- Arduino IDE: [Download](https://www.arduino.cc/en/software)

## Usage

1. Wire two potentiometers to your Arduino, following the wiring guide here (`circuit-image.png`)
2. Connect your Arduino board to your computer via USB.
3. Open the Arduino IDE and upload the provided Arduino sketch (`arduino_sketch.ino`) to your Arduino board.
4. Run the p5.js sketch by opening `index.html` in a web browser.
5. Follow the on-screen instructions to interact with the object detection system.

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE.md).

## Acknowledgements

- [p5.js](https://p5js.org/)
- [ml5.js](https://ml5js.org/)
- [Arduino](https://www.arduino.cc/)
