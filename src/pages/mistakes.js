import BasePage from "../lib/basePage";
import Detector from "../lib/detector";
import { WHITE } from "../lib/canvasStyles";

const SEGMENT_LENGTH = 10;
const SPACING = 10;
const ERROR_SIZE = Math.PI / 8;
const LINE_WIDTH = 0.5;

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export default class LinePage extends BasePage {
  constructor() {
    super();
    this.requiresSupportFor = [Detector.canvas];
    this.inspiration = {
      title: "Linetrace",
      source: "Inconvergent",
      url: "https://inconvergent.net/generative/linetrace/",
    };
  }

  async init() {
    super.init();

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.onResize();

    return this.canvas;
  }

  generateLines() {
    let ySegments = Math.round(window.innerHeight / SEGMENT_LENGTH) + 1;
    let line = Array(ySegments)
      .fill(0)
      .map((_, i) => [SPACING, SEGMENT_LENGTH * i]);

    this.lines = [line];

    for (let xPos = SPACING * 2; xPos < window.innerWidth; xPos += SPACING) {
      line = this.generateLine(line);
      this.lines.push(line);
    }
  }

  generateError() {
    return (Math.random() - 0.5) * ERROR_SIZE;
  }

  generateLine(previousLine) {
    let line = [];
    for (let i = 0; i < previousLine.length; i++) {
      let [x, y] = previousLine[i];
      let neighbours = previousLine.filter(
        ([x2, y2]) => distance(x, y, x2, y2) <= SEGMENT_LENGTH * 2
      );
      if (neighbours.length >= 2) {
        let point1 = neighbours[0];
        let point2 = neighbours.slice(-1)[0];
        let xDiff = point2[0] - point1[0];
        let yDiff = point2[1] - point1[1];
        let alpha =
          Math.atan2(yDiff, xDiff) - Math.PI / 2 + this.generateError();
        let dx = Math.cos(alpha);
        let dy = Math.sin(alpha);
        line.push([x + dx * SEGMENT_LENGTH, y + dy * SEGMENT_LENGTH]);
      }
    }
    console.log(line);
    return line;
  }

  drawLine(ctx, line) {
    ctx.beginPath();
    ctx.moveTo(line[0][0], line[0][1]);

    line.slice(1).forEach(function draw([x, y]) {
      ctx.lineTo(x, y);
    });

    ctx.stroke();
  }

  animate() {
    let { ctx } = this;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let drawLine = this.drawLine.bind(this);

    this.lines.forEach(function (line) {
      if (line.length) {
        drawLine(ctx, line);
      }
    });
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.lineWidth = LINE_WIDTH;
    this.ctx.strokeStyle = WHITE;
    this.generateLines();
    this.animate();
  }
}
