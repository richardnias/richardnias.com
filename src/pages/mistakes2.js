import bspline from "b-spline";
import concat from "lodash/concat";
import intersection from "lodash/intersection";
import last from "lodash/last";
import maxBy from "lodash/maxBy";
import range from "lodash/range";

import CanvasPage from "../lib/canvasPage";

const SIZE = 1000;
const ERROR_SIZE = Math.PI;
const ERROR_FACTOR = 0.3;
const MARGIN = 0.05;
const W = 1 - MARGIN * 2;

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export default class LinePage extends CanvasPage {
  LINE_WIDTH = 0.7;
  REDRAW = false;

  constructor() {
    super();
    this.inspiration = {
      title: "Linetrace",
      source: "Inconvergent",
      url: "https://inconvergent.net/generative/linetrace/",
    };
  }

  generateFirstLine() {
    return range(SIZE).map((_, i) => [0, (i / SIZE) * window.innerHeight * W]);
  }

  generateError() {
    return (2 * Math.random() - 1) * ERROR_SIZE;
  }

  generateLine(previousLine, spacing) {
    let previousIndices = range(previousLine.length);

    let nearLast = [];
    let rawLine = [];
    for (let i = 0; i < previousLine.length; i++) {
      let [x, y] = previousLine[i];
      let indices = previousIndices.filter(
        (j) => distance(x, y, previousLine[j][0], previousLine[j][1]) <= spacing
      );

      // add node if not too close to a previous node _or_ it's the last point
      if (
        intersection(indices, nearLast).length < 5 ||
        i === previousLine.length - 1
      ) {
        nearLast = indices;

        let [x1, y1] = previousLine[indices[0]];
        let [x2, y2] = previousLine[last(indices)];

        let alpha = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;

        let dx = Math.cos(alpha);
        let dy = Math.sin(alpha);

        let error = this.generateError();
        let errorX = Math.cos(error) * ERROR_FACTOR;
        let errorY = Math.sin(error) * ERROR_FACTOR;

        rawLine.push([
          x + (dx + errorX) * spacing,
          y + (dy + errorY) * spacing,
        ]);
      }
    }

    let rawLength = rawLine.length;
    let knots = concat([0, 0, 0, 0], range(2, rawLength - 2), [
      rawLength - 1,
      rawLength - 1,
      rawLength - 1,
      rawLength - 1,
    ]);
    let numPoints = rawLength * 4;

    let line = [];
    for (let i = 0; i < numPoints; i++) {
      let point = bspline(i / (numPoints - 1), 3, rawLine, knots);
      if (point[1] >= 0 && point[1] <= window.innerHeight * W) {
        line.push(point);
      }
    }
    return line;
  }

  drawLine(ctx, line) {
    let xStart = window.innerWidth * MARGIN;
    let yStart = window.innerHeight * MARGIN;
    ctx.beginPath();
    ctx.moveTo(line[0][0] + xStart, line[0][1] + yStart);

    line.slice(1).forEach(function draw([x, y]) {
      ctx.lineTo(x + xStart, y + yStart);
    });

    ctx.stroke();
  }

  animate() {
    super.animate();

    let line = this.generateLine(last(this.lines), this.spacing);
    this.lines.push(line);

    let xMax = maxBy(line, ([x]) => x)[0];
    if (xMax >= window.innerWidth * W) {
      this.pause();
    }

    this.drawLine(this.ctx, line);
  }

  onResize() {
    super.onResize();

    this.lines = [this.generateFirstLine()];
    this.spacing = 4;

    if (this.stopped()) {
      this.start();
    }
  }
}
