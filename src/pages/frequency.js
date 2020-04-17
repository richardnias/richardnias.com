import AudioContext from "../lib/audioContext";
import CanvasPage from "../lib/canvasPage";
import Detector from "../lib/detector";

const FFT_SIZE = 32;
const BAR_WIDTH_MULTIPLIER = 1;

export default class FFTPage extends CanvasPage {
  LINE_WIDTH = 0;

  constructor() {
    super();
    this.requiresSupportFor = [Detector.audioContext, Detector.getUserMedia];
    this.inspiration = {
      title: "Creating a frequency bar graph",
      source: "MDN Web Docs",
      url:
        "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API#Creating_a_frequency_bar_graph",
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

    const barWidth = (width / this.bufferLength) * BAR_WIDTH_MULTIPLIER;

    this.analyser.getByteFrequencyData(this.data);

    this.data.forEach((d, i) => {
      const x = barWidth * i;
      const barHeight = ((height / 255) * d) / 2;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    });
  }
}
