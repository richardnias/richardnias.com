import BasePage from "../lib/basePage";
import Detector from "../lib/detector";
import range from "lodash/range";

const POINT_RADIUS = 4;
const SPACING = 16;
const SPEED_FACTOR = 5e-6;

export default class SinePage extends BasePage {
  constructor() {
    super();
    this.requiresSupportFor = [Detector.canvas];
    this.inspiration = {
      title: '"Vertically oscillating points..."',
      source: "IntertialObservr",
      url: "https://twitter.com/InertialObservr/status/1234227684537860097",
    };
  }

  async init() {
    super.init();

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.onResize();

    this.startTime = +new Date();

    return this.canvas;
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
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    points.forEach(function ({ x, y, color }) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  animate() {
    super.animate();

    // console.log(this.numPoints, -this.numPoints/2, this.numPoints/2)

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

    console.log(points);

    this.drawPoints(this.ctx, points);
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    let maybeOddNumPoints = Math.floor(window.innerWidth / SPACING);
    this.numPoints = maybeOddNumPoints + (maybeOddNumPoints % 2);
    this.halfWidth = window.innerWidth / 2;
    this.halfHeight = window.innerHeight / 2;
  }
}
