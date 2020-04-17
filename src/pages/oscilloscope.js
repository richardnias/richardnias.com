import AudioContext from "../lib/audioContext";
import CanvasPage from "../lib/canvasPage";

const FFT_SIZE = 2048;
const WINDOW_PARAM = 0.16;

export default class OscilloscopePage extends CanvasPage {
  LINE_WIDTH = 3;

  constructor() {
    super();
    this.inspiration = {
      title: "Creating a waveform/oscilloscope",
      source: "MDN Web Docs",
      url:
        "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API#Creating_a_waveformoscilloscope",
    };
  }

  async init() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    this.analyser = audioContext.createAnalyser();
    source.connect(this.analyser);

    this.analyser.fftSize = FFT_SIZE;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.data = new Uint8Array(this.bufferLength);

    return super.init();
  }

  animate() {
    super.animate();

    const { width, height } = this.canvas;
    const ctx = this.ctx;

    const sliceWidth = width / this.bufferLength;

    this.analyser.getByteTimeDomainData(this.data);

    ctx.beginPath();
    ctx.moveTo(0, height / 2);

    this.data.forEach((d, i) => {
      const x = sliceWidth * i;
      const y =
        (((d / 128) * height) / 2 - height / 2) * this.calculateWindow(i) +
        height / 2;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(width, height / 2);
    ctx.stroke();
  }

  calculateWindow(n) {
    return (
      (1 - WINDOW_PARAM) / 2 -
      0.5 * Math.cos((2 * Math.PI * n) / (this.bufferLength - 1)) +
      (WINDOW_PARAM / 2) * Math.cos((4 * Math.PI * n) / (this.bufferLength - 1))
    );
  }
}
