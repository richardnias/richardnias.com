import CanvasPage from "../lib/canvasPage";
import range from "lodash/range";

const POINT_RADIUS = 8 / (window.devicePixelRatio + 1);
const SPACING = 16;
const SPEED_FACTOR = 3e-6;

export default class SinePage extends CanvasPage {
  constructor() {
    super();
    this.inspiration = {
      title: "Vertically oscillating points...",
      source: "IntertialObservr",
      url: "https://twitter.com/InertialObservr/status/1234227684537860097",
    };
  }

  async init() {
    this.startTime = +new Date();

    return super.init();
  }

  getXPosition(n) {
    return n * SPACING;
  }

  getYPosition(n, t) {
    return (
      this.halfHeight * Math.sin(this.getXPosition(n) * t * SPEED_FACTOR) +
      this.halfHeight
    );
  }

  drawPoints(ctx, points) {
    points.forEach(function ({ x, y, color }) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  animate() {
    super.animate();

    let t = +new Date() - this.startTime;

    let points = range(-this.numPoints / 2, this.numPoints / 2 + 1).map(
      (n) => ({
        x: this.getXPosition(n) + this.halfWidth,
        y: this.getYPosition(n, t),
        color: `hsl(${(n / this.numPoints) * 360 * 2}, 100%, ${
          n === 0 ? 100 : 30
        }%)`,
      })
    );

    this.drawPoints(this.ctx, points);
  }

  onResize() {
    super.onResize();
    let maybeOddNumPoints = Math.floor(window.innerWidth / SPACING);
    this.numPoints = maybeOddNumPoints + (maybeOddNumPoints % 2);
    this.halfWidth = window.innerWidth / 2;
    this.halfHeight = window.innerHeight / 2;
  }
}
