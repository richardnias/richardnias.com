import CanvasPage from "../lib/canvasPage";

const AXIOM = "F";
const RULES = {
  F: "G-F-G",
  G: "F+G+F",
};

const ANGLE_STEP = -Math.PI / 3;
const MARGIN = 10;
const MAX_ITERATIONS = 10;

export default class LSystemPage extends CanvasPage {
  REDRAW = false;

  constructor() {
    super();
    this.inspiration = {
      title: "Sierpiński triangle",
      source: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle",
    };
  }

  lindenmayer(string) {
    let output = "";
    // eslint-disable-next-line no-unused-vars
    for (let char of string) {
      output += RULES[char] || char;
    }
    return output;
  }

  calculate(iterations) {
    let state = `${AXIOM}`;
    for (let i = 0; i < iterations; i++) {
      state = this.lindenmayer(state);
    }
    return state;
  }

  step(instruction, x, y, angle) {
    switch (instruction) {
      case "F":
      case "G":
        return [
          x + this.stepSize * Math.cos(angle),
          y + this.stepSize * Math.sin(angle),
          angle,
        ];
      case "+":
        return [x, y, angle + ANGLE_STEP];
      case "-":
        return [x, y, angle - ANGLE_STEP];
      default:
        return [x, y, angle];
    }
  }

  drawLine(ctx, oldX, oldY, newX, newY) {
    ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(newX, newY);
    ctx.stroke();
  }

  reset() {
    this.ctx.globalCompositeOperation = "copy";
    this.ctx.globalAlpha = 0.4;
    this.ctx.drawImage(this.canvas, 0, 0);
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = "source-over";
    let triangeSideLength = Math.min(
      window.innerWidth - MARGIN * 2,
      (window.innerHeight - MARGIN * 2) / Math.sin(Math.PI / 3)
    );
    this.stepSize = triangeSideLength / Math.pow(2, this.iterations);
    this.x = (window.innerWidth - triangeSideLength) / 2;
    this.y = window.innerHeight - MARGIN;
    this.angle = 0;
    this.state = this.calculate(this.iterations);
    this.index = 0;
    this.linesPerStep = Math.max(
      1,
      Math.round(Math.pow(2, this.iterations) / 4)
    );
  }

  restart() {
    this.reset();
    setTimeout(this.start.bind(this), 800);
  }

  animate() {
    for (let i = 0; i < this.linesPerStep; i++) {
      let instruction = this.state[this.index];
      let [newX, newY, newAngle] = this.step(
        instruction,
        this.x,
        this.y,
        this.angle
      );
      this.drawLine(this.ctx, this.x, this.y, newX, newY);
      this.x = newX;
      this.y = newY;
      this.angle = newAngle;
      this.index += 1;
    }
    if (this.index < this.state.length) {
      super.animate();
    } else {
      this.iterations += 2 * this.iterationsDirection;
      if (this.iterations < 0) {
        this.iterations = 0;
        this.iterationsDirection = 1;
      } else if (this.iterations >= MAX_ITERATIONS) {
        this.iterationsDirection = -1;
      }
      setTimeout(this.restart.bind(this), 1000);
    }
  }

  onResize() {
    super.onResize();
    this.iterations = 0;
    this.iterationsDirection = 1;
    this.reset();
  }
}
