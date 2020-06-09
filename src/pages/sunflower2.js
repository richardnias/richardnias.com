import CanvasPage from "../lib/canvasPage";

const OFFSET = 0;
const ROTATION_SPEED = 0.000001;
const INITIAL_ROTATION_FACTOR = (1 + Math.sqrt(5)) / 2 - 0.0001;
const POINT_RADIUS = 4 / (window.devicePixelRatio + 1);
const DENSITY = 6;

export default class SunflowerPage extends CanvasPage {
  constructor() {
    super();
    this.inspiration = {
      title: "The Golden Ratio (why it is so irrational)",
      source: "Numberphile",
      url: "https://www.youtube.com/watch?v=sj8Sg8qnjOg",
    };
  }

  async init() {
    this.rotationFactor = INITIAL_ROTATION_FACTOR;
    return super.init();
  }

  getPolarCoords(index, rotationFactor) {
    return {
      radius: OFFSET + index / DENSITY,
      theta: ((Math.PI * 2) / rotationFactor) * index,
    };
  }

  polarCoordsToCartesian({ radius, theta }) {
    return {
      x: this.canvas.width / 2 + Math.cos(theta) * radius,
      y: this.canvas.height / 2 + Math.sin(theta) * radius,
    };
  }

  drawPoints(ctx, points) {
    points.forEach(function ({ x, y }) {
      ctx.fillRect(
        x - POINT_RADIUS,
        y - POINT_RADIUS,
        POINT_RADIUS * 2,
        POINT_RADIUS * 2
      );
    });
  }

  animate() {
    super.animate();

    let points = [];

    for (let i = 0; i < this.numPoints; i++) {
      let polarCoords = this.getPolarCoords(i, this.rotationFactor);
      points.push(this.polarCoordsToCartesian(polarCoords));
    }

    this.drawPoints(this.ctx, points);

    this.rotationFactor += ROTATION_SPEED;
  }

  onResize() {
    super.onResize();
    this.numPoints =
      Math.min(
        window.innerWidth / 2 - OFFSET,
        window.innerHeight / 2 - OFFSET
      ) * DENSITY;
  }
}
