import BasePage from "../lib/basePage";
import Detector from "../lib/detector";
import { WHITE } from "../lib/canvasStyles";

const POINT_RADIUS = 2 / (window.devicePixelRatio / 2 + 0.5);
const WAVE_RADIUS = 40 / window.devicePixelRatio;
const MARGIN = WAVE_RADIUS * 2;
const DENSITY = 1.2;
const FREQUENCY = 5;
const SPEED = 0.025 * (window.devicePixelRatio / 2 + 0.5);

export default class SunflowerPage extends BasePage {
  constructor() {
    super();
    this.requiresSupportFor = [Detector.canvas];
    this.inspiration = {
      title: "Makin' waves with circles 🌊",
      source: "InertialObservr",
      url: "https://twitter.com/InertialObservr/status/1242904827845201920",
    };
  }

  async init() {
    super.init();

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.t = 0;

    this.onResize();

    return this.canvas;
  }

  drawPoints(ctx, points, t) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.fillStyle = WHITE;
    let numHorizontalPoints = Math.floor(
      ((window.innerWidth - MARGIN * 2) / WAVE_RADIUS) * DENSITY
    );
    let numVerticalPoints = Math.floor(
      ((window.innerHeight - MARGIN * 2) / WAVE_RADIUS) * DENSITY
    );
    let waveDirection = Math.atan(-window.innerHeight / window.innerWidth);
    this.points = [];
    for (let i = 0; i < numHorizontalPoints; i++) {
      for (let j = 0; j < numVerticalPoints; j++) {
        this.points.push({
          x: MARGIN + (WAVE_RADIUS * (i + 0.5)) / DENSITY,
          y: MARGIN + (WAVE_RADIUS * (j + 0.5)) / DENSITY,
          thetaOffset:
            ((i / numHorizontalPoints) * Math.cos(waveDirection) +
              (j / numVerticalPoints) * Math.sin(waveDirection)) *
            Math.PI *
            FREQUENCY,
        });
      }
    }
  }
}
