import CanvasPage from "../lib/canvasPage";

const POINT_RADIUS = 4 / (window.devicePixelRatio + 1);
const WAVE_RADIUS = 40 / window.devicePixelRatio;
const MARGIN = WAVE_RADIUS * 2;
const DENSITY = 1.2;
const FREQUENCY = (-4 / 3) * window.devicePixelRatio + 17 / 3;
const SPEED = 0.025 * (window.devicePixelRatio / 2 + 0.5);

export default class SunflowerPage extends CanvasPage {
  constructor() {
    super();
    this.inspiration = {
      title: "Makin' waves with circles 🌊",
      source: "InertialObservr",
      url: "https://twitter.com/InertialObservr/status/1242904827845201920",
    };
  }

  async init() {
    this.t = 0;
    return super.init();
  }

  drawPoints(ctx, points, t) {
    points.forEach(function ({ x, y, thetaOffset }) {
      ctx.fillRect(
        x + Math.cos(thetaOffset + t) * WAVE_RADIUS - POINT_RADIUS,
        y + Math.sin(thetaOffset + t) * WAVE_RADIUS - POINT_RADIUS,
        POINT_RADIUS * 2,
        POINT_RADIUS * 2
      );
    });
  }

  animate() {
    super.animate();

    this.drawPoints(this.ctx, this.points, this.t);

    this.t += SPEED;
  }

  generatePoints(hPoints, vPoints, waveDirection) {
    let points = [];
    for (let i = 0; i < hPoints; i++) {
      for (let j = 0; j < vPoints; j++) {
        let x = MARGIN + (WAVE_RADIUS * (i + 0.5)) / DENSITY;
        let y = MARGIN + (WAVE_RADIUS * (j + 0.5)) / DENSITY;
        let thetaOffset =
          ((i * Math.cos(waveDirection)) / hPoints +
            (j * Math.sin(waveDirection)) / vPoints) *
          Math.PI *
          FREQUENCY;
        points.push({
          x,
          y,
          thetaOffset,
        });
      }
    }
    return points;
  }

  onResize() {
    super.onResize();

    let numHorizontalPoints = Math.floor(
      ((window.innerWidth - MARGIN * 2) / WAVE_RADIUS) * DENSITY
    );
    let numVerticalPoints = Math.floor(
      ((window.innerHeight - MARGIN * 2) / WAVE_RADIUS) * DENSITY
    );
    let waveDirection = Math.atan(-window.innerHeight / window.innerWidth);
    this.points = this.generatePoints(
      numHorizontalPoints,
      numVerticalPoints,
      waveDirection
    );
  }
}
