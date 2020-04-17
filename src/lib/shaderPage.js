import BasePage from "./basePage";
import Detector from "./detector";

const VERTICES = new Float32Array([1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0]);

export default class ShaderPage extends BasePage {
  get vertShader() {
    throw new Error("Not implemented!");
  }

  get fragShader() {
    throw new Error("Not implemented!");
  }

  constructor() {
    super();
    this.requiresSupportFor = [Detector.webgl];
  }

  init() {
    super.init();

    this.start_time = new Date();

    let gl, shaderProgram;

    this.canvas = document.createElement("canvas");
    this.canvas.width = 400;
    this.canvas.height = 400;

    gl = this.gl = this.canvas.getContext("webgl");
    shaderProgram = this.shaderProgram = gl.createProgram();

    let vertShader = this.loadShader(gl, gl.VERTEX_SHADER, this.vertShader);
    let fragShader = this.loadShader(gl, gl.FRAGMENT_SHADER, this.fragShader);

    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(shaderProgram));
    }

    let positionBuffer = gl.createBuffer();
    let aVertexPosition = gl.getAttribLocation(shaderProgram, "a_position");
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, VERTICES, gl.STATIC_DRAW);
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aVertexPosition);

    this.uResolution = gl.getUniformLocation(shaderProgram, "u_resolution");
    this.uTime = gl.getUniformLocation(shaderProgram, "u_time");

    this.onResize();

    return this.canvas;
  }

  loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
  }

  animate() {
    super.animate();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.shaderProgram);
    this.updateUniforms();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  updateUniforms() {
    this.gl.uniform1fv(
      this.uTime,
      new Float32Array([(new Date() - this.start_time) / 1000])
    );
    this.gl.uniform2fv(this.uResolution, new Float32Array(this.resolution));
  }

  onResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.resolution = [width, height];
    this.gl.viewport(0, 0, width, height);
  }
}
