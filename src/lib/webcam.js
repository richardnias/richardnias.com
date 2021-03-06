import BasePage from "./basePage";
import { extractFrameData } from "./util";
import Detector from "./detector";
import innerHeight from "ios-inner-height";

const REQUESTED_VIDEO_WIDTH = 1280;
const REQUESTED_VIDEO_HEIGHT = 720;

export default class WebcamPage extends BasePage {
  constructor() {
    super();
    this.requiresSupportFor = [Detector.getUserMedia];

    this.calculateDrawImageParams = this.calculateDrawImageParams.bind(this);
  }

  async init() {
    super.init();

    this.video = document.createElement("video");
    this.video.setAttribute("muted", "");
    this.video.setAttribute("playsinline", "");
    this.video.setAttribute("autoplay", "");

    this.video.style.display = "none";

    document.body.appendChild(this.video);

    const constraints = {
      video: {
        width: REQUESTED_VIDEO_WIDTH,
        height: REQUESTED_VIDEO_HEIGHT,
        facingMode: "user",
      },
    };

    this.video.srcObject = await navigator.mediaDevices.getUserMedia(
      constraints
    );
    await this.video.play();

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.onResize();

    return this.canvas;
  }

  /**
   * calculate params to pass into drawImage to ensure the video is the right size/position
   */
  calculateDrawImageParams() {
    // calculate crop/offset
    let dx, dy, width, height;
    if (this.canvas.width / this.canvas.height <= this.videoRatio) {
      width = this.canvas.height * this.videoRatio;
      height = this.canvas.height;
      dx = (this.canvas.width - width) / 2;
      dy = 0;
    } else {
      width = this.canvas.width;
      height = this.canvas.width / this.videoRatio;
      dx = 0;
      dy = (this.canvas.height - height) / 2;
    }

    return [dx, dy, width, height];
  }

  extractVideoData(dx, dy, width, height) {
    return extractFrameData(this.ctx, this.video, dx, dy, width, height);
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = innerHeight();
    this.videoWidth = this.video.videoWidth;
    this.videoHeight = this.video.videoHeight;
    this.videoRatio = this.videoWidth / this.videoHeight;
    this.ctx.setTransform(-1, 0, 0, 1, window.innerWidth, 0);
  }

  stop() {
    super.stop();
    if (this.video.srcObject) {
      this.video.srcObject.getTracks().forEach((s) => s.stop());
      this.video.srcObject = null;
    }
  }
}
