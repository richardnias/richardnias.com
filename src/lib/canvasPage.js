import BasePage from "./basePage";
import Detector from "./detector";
import { WHITE } from "./canvasStyles";

export default class CanvasPage extends BasePage {
  FILL_STYLE = WHITE;
  LINE_WIDTH = 1;
  STROKE_STYLE = WHITE;
  REDRAW = true;

  constructor() {
    super();
    this.requiresSupportFor = [Detector.canvas];
  }

  async init() {
    super.init();

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.onResize();

    return this.canvas;
  }

  animate() {
    super.animate();
    if (this.REDRAW) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.strokeStyle = this.STROKE_STYLE;
    this.ctx.fillStyle = this.FILL_STYLE;
    this.ctx.lineWidth = this.LINE_WIDTH;
  }
}
