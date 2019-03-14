import BasePage from '../lib/basePage'

const AudioContext = window.AudioContext

const FILL_STYLE = '#ffffff'
const FFT_SIZE = 32
const BAR_WIDTH_MULTIPLIER = 1

export default class FFTPage extends BasePage {
  constructor () {
    super()
    this.errorMessage = 'AudioContext is not supported by this browser'
  }

  async init () {
    super.init()

    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })

    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    this.analyser = audioContext.createAnalyser()
    source.connect(this.analyser)

    this.analyser.fftSize = FFT_SIZE
    this.bufferLength = this.analyser.frequencyBinCount
    this.data = new Uint8Array(this.bufferLength)

    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = FILL_STYLE
    this.ctx.lineWidth = 0

    return this.canvas
  }

  animate () {
    super.animate()

    const { width, height } = this.canvas
    const ctx = this.ctx

    const barWidth = width / this.bufferLength * BAR_WIDTH_MULTIPLIER

    this.analyser.getByteFrequencyData(this.data)

    ctx.clearRect(0, 0, width, height)

    this.data.forEach((d, i) => {
      const x = barWidth * i
      const barHeight = height / 255 * d / 2
      ctx.fillRect(x, height - barHeight, barWidth, barHeight)
    })
  }

  onResize () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  isSupported () {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia && AudioContext
  }
}
