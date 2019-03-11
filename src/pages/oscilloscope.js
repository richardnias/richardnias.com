import BasePage from '../lib/basePage'

const AudioContext = window.AudioContext

const FFT_SIZE = 2048
const WINDOW_PARAM = 0.16
const LINE_WIDTH = 3
const STROKE_STYLE = 'rgb(255, 255, 255)'

export default class Oscilloscope extends BasePage {
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
    this.ctx.lineWidth = LINE_WIDTH
    this.ctx.strokeStyle = STROKE_STYLE

    return this.canvas
  }

  animate () {
    super.animate()

    const { width, height } = this.canvas
    const ctx = this.ctx

    const sliceWidth = width / this.bufferLength

    this.analyser.getByteTimeDomainData(this.data)

    ctx.clearRect(0, 0, width, height)
    ctx.beginPath()
    ctx.moveTo(0, height / 2)

    this.data.forEach((d, i) => {
      const x = sliceWidth * i
      const y = (d / 128 * height / 2 - height / 2) * this.calculateWindow(i) + height / 2
      ctx.lineTo(x, y)
    })

    ctx.lineTo(width, height / 2)
    ctx.stroke()
  }

  calculateWindow (n) {
    return (1 - WINDOW_PARAM) / 2 - 0.5 * Math.cos((2 * Math.PI * n) / (this.bufferLength - 1)) + WINDOW_PARAM / 2 * Math.cos((4 * Math.PI * n) / (this.bufferLength - 1))
  }

  onResize () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  isSupported () {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia && AudioContext
  }
}
