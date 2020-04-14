import CircularBuffer from "../lib/circularBuffer";

import WebcamPage from "../lib/webcam";
import { copyUintArray } from "../lib/util";

const DELAY = 10;

export default class RGBPage extends WebcamPage {
  async init() {
    this.buffer = new CircularBuffer(DELAY * 2 + 1);

    return super.init();
  }

  animate() {
    super.animate();

    const [dx, dy, width, height] = this.calculateDrawImageParams();

    // get ImageData
    let frame = this.extractVideoData(dx, dy, width, height);

    // save a copy
    const currentFrame = copyUintArray(frame.data);
    this.buffer.push(currentFrame);

    const redFrame = currentFrame;
    const greenFrame =
      this.buffer.get(DELAY) || new Uint8ClampedArray(frame.data.length);
    const blueFrame =
      this.buffer.get(DELAY * 2) || new Uint8ClampedArray(frame.data.length);

    // manipulate
    for (let i = 0; i < frame.data.length; i += 4) {
      frame.data[i] = redFrame[i];
      frame.data[i + 1] = greenFrame[i + 1];
      frame.data[i + 2] = blueFrame[i + 2];
      frame.data[i + 3] = 255;
    }

    // put the new data back
    this.ctx.putImageData(frame, dx, dy);
  }
}
