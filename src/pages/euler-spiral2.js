import BasePage from "../lib/basePage";
import Detector from "../lib/detector";
import { BLACK, WHITE } from "../lib/canvasStyles";
import { triangleNumber } from "../lib/util";

const LINE_WIDTH = 1;
const TOTAL_POINTS = 300;

export default class EulerSpiral2Page extends BasePage {
  constructor() {
    super();
    this.requiresSupportFor = [Detector.canvas];
    this.inspiration = {
      title: "Spiral Generation",
      source: "Ben Sparks",
      url: "https://www.geogebra.org/m/rgsuh8na",
    };
  }

  async init() {
    super.init();

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setDimensions();

    return this.canvas;
  }

  generatePoint([x, y], segmentLength, theta) {
    return [
      x + Math.cos(theta) * segmentLength,
      y + Math.sin(theta) * segmentLength,
    ];
  }

  transformPoint([x, y]) {
    return [x + window.innerWidth / 2, y + window.innerHeight / 2];
  }

  drawLine(ctx, point0, point1) {
    let [x0, y0] = this.transformPoint(point0);
    let [x1, y1] = this.transformPoint(point1);

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);

    ctx.stroke();
    this.ctx.fillRect(
      x1 - LINE_WIDTH / 2,
      y1 - LINE_WIDTH / 2,
      LINE_WIDTH,
      LINE_WIDTH
    );
  }

  animate() {
    super.animate();

    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let lastPoint = [0, 0];

    for (let i = 0; i < TOTAL_POINTS; i++) {
      let nextPoint = this.generatePoint(
        lastPoint,
        this.segmentLength,
        this.theta * triangleNumber(i)
      );
      this.drawLine(this.ctx, lastPoint, nextPoint);
      lastPoint = nextPoint;
    }

    this.theta += 0.000003;
  }

  setDimensions() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.strokeStyle = WHITE;
    this.ctx.fillStyle = BLACK;
    this.theta = 0;
    this.segmentLength = 20;
  }

  onResize() {
    this.setDimensions();

    if (this.stopped()) {
      this.start();
    }
  }
}
