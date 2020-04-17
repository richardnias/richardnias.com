import CanvasPage from "../lib/canvasPage";
import { BLACK } from "../lib/canvasStyles";
import { triangleNumber } from "../lib/util";

const ROTATION_SPEED = 0.000004 * window.devicePixelRatio;
const SEGMENT_LENGTH = 20 / window.devicePixelRatio;
const TOTAL_POINTS = 300;

export default class EulerSpiral2Page extends CanvasPage {
  FILL_STYLE = BLACK;

  constructor() {
    super();
    this.inspiration = {
      title: "Spiral Generation",
      source: "Ben Sparks",
      url: "https://www.geogebra.org/m/rgsuh8na",
    };
  }

  async init() {
    this.theta = 0;

    return super.init();
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
      x1 - this.LINE_WIDTH / 2,
      y1 - this.LINE_WIDTH / 2,
      this.LINE_WIDTH,
      this.LINE_WIDTH
    );
  }

  animate() {
    super.animate();

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

    this.theta += ROTATION_SPEED;
  }

  onResize() {
    super.onResize();
    this.segmentLength = SEGMENT_LENGTH;
  }
}
