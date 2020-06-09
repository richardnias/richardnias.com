import CanvasPage from "../lib/canvasPage";

const SPEED = 0.001;
const N = 20;

export default class SinePage extends CanvasPage {
  constructor() {
    super();
    this.inspiration = {
      title: "Making relaxing math gifs...",
      source: "IntertialObservr",
      url: "https://twitter.com/InertialObservr/status/1240008000078614528",
    };
  }

  drawSquare(p0, p1, p2, p3) {
    let ctx = this.ctx;

    ctx.beginPath();
    ctx.moveTo(...p0);
    ctx.lineTo(...p1);
    ctx.lineTo(...p2);
    ctx.lineTo(...p3);
    ctx.lineTo(...p0);
    ctx.stroke();
  }

  lerp([x0, y0], [x1, y1], t) {
    let x = x0 + (x1 - x0) * t;
    let y = y0 + (y1 - y0) * t;
    return [x, y];
  }

  generateSquare([p0, p1, p2, p3], t) {
    return [
      this.lerp(p0, p1, t),
      this.lerp(p1, p2, t),
      this.lerp(p2, p3, t),
      this.lerp(p3, p0, t),
    ];
  }

  animate() {
    super.animate();

    this.t = (this.t + SPEED) % 1;

    let square = this.firstSquare;
    this.drawSquare(...square);
    for (let i = 0; i < N; i++) {
      square = this.generateSquare(square, this.t);
      this.drawSquare(...square);
    }
  }

  onResize() {
    super.onResize();
    this.halfWidth = window.innerWidth / 2;
    this.halfHeight = window.innerHeight / 2;
    this.halfSize = Math.min(this.halfWidth, this.halfHeight);
    this.side = Math.sqrt(2 * this.halfSize ** 2);
    this.firstSquare = [
      [this.halfWidth, this.halfHeight - this.halfSize],
      [this.halfWidth + this.halfSize, this.halfHeight],
      [this.halfWidth, this.halfHeight + this.halfSize],
      [this.halfWidth - this.halfSize, this.halfHeight],
    ];
    this.t = 0;
  }
}
