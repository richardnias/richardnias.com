import CanvasPage from "../lib/canvasPage";
import { mat2d, vec2 } from "gl-matrix";

const A1 = mat2d.fromValues(0, 0, 0, 0.16, 0, 0);
const P1 = 0.01;

const A2 = mat2d.fromValues(0.85, -0.04, 0.04, 0.85, 0, 1.6);
const P2 = 0.86;

const A3 = mat2d.fromValues(0.2, 0.23, -0.26, 0.22, 0, 1.6);
const P3 = 0.93;

const A4 = mat2d.fromValues(-0.15, 0.26, 0.28, 0.24, 0, 0.44);

const POINT_RADIUS = 0.6;
const POINTS_DRAWN_PER_FRAME = 15;

export default class FernPage extends CanvasPage {
  REDRAW = false;

  constructor() {
    super();
    this.inspiration = {
      title: "Barnsley Fern",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Barnsley_fern",
    };
  }

  async init() {
    this.point = vec2.fromValues(0, 0);
    this.transformedPoint = vec2.create();
    return super.init();
  }

  transform(pos, A) {
    let result = vec2.create();
    vec2.transformMat2d(result, pos, A);
    return result;
  }

  drawPoint(ctx, pos) {
    vec2.transformMat2d(this.transformedPoint, pos, this.viewMatrix);
    ctx.fillRect(
      this.transformedPoint[0] - POINT_RADIUS,
      this.transformedPoint[1] - POINT_RADIUS,
      POINT_RADIUS * 2,
      POINT_RADIUS * 2
    );
  }

  calculateNextPoint(prev) {
    let r = Math.random();
    if (r < P1) {
      return this.transform(prev, A1);
    } else if (r < P2) {
      return this.transform(prev, A2);
    } else if (r < P3) {
      return this.transform(prev, A3);
    } else {
      return this.transform(prev, A4);
    }
  }

  animate() {
    super.animate();
    for (let i = 0; i < POINTS_DRAWN_PER_FRAME; i++) {
      this.drawPoint(this.ctx, this.point);
      this.point = this.calculateNextPoint(this.point);
    }
  }

  onResize() {
    super.onResize();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.viewMatrix = mat2d.fromValues(
      window.innerWidth / 6,
      0,
      0,
      -window.innerHeight / 14,
      (window.innerWidth * 6) / 13,
      (window.innerHeight * 6) / 7
    );
    this.point = vec2.fromValues(0, 0);
  }
}
