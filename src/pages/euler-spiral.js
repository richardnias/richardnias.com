import last from "lodash/last";
import random from "lodash/random";

import CanvasPage from "../lib/canvasPage";
import { triangleNumber } from "../lib/util";

const STEPS = 10;

export default class EulerSpiralPage extends CanvasPage {
  LINE_WIDTH = 0.5;
  REDRAW = false;

  constructor() {
    super();
    this.inspiration = {
      title: '"draw a line, and extend it deflected by a fixed angle..."',
      source: "matthen2",
      url: "https://twitter.com/matthen2/status/1249611168265547776",
    };
  }

  async init() {
    this.segmentLength = random(-14, 14);
    this.theta = random(-0.15, 0.15);

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
  }

  animate() {
    super.animate();

    let lastPoint = last(this.points);
    let n = this.points.length;

    for (let i = 0; i < STEPS; i++) {
      let nextPoint = this.generatePoint(
        lastPoint,
        this.segmentLength,
        this.theta * triangleNumber(n + i)
      );

      this.drawLine(this.ctx, lastPoint, nextPoint);
      this.points.push(nextPoint);

      lastPoint = nextPoint;
    }
  }

  onResize() {
    super.onResize();
    this.points = [[0, 0]];
  }
}
