import BasePage from '../lib/basePage'

const AudioContext = window.AudioContext || window.webkitAudioContext

const MIN_BASE_FREQUENCY = 220
const MAX_BASE_FREQUENCY = 440
const OSCILLATOR_TYPE = 'sine'

/**
 * exponential growth from 0 to 1 for 0<=t<=1
 * @param t
 */
const exp = t => Math.exp(1 - Math.pow(t, -2))

class ShephardOscillator {
  constructor (ctx) {
    this.ctx = ctx
    this.node = ctx.createOscillator()
    this.gainNode = ctx.createGain()
    this.node.type = OSCILLATOR_TYPE
    this.node.connect(this.gainNode)
    this.gainNode.connect(ctx.destination)
  }

  setFrequencyAndGain (frequency, gain) {
    this.node.frequency.setValueAtTime(frequency, this.ctx.currentTime)
    this.gainNode.gain.setValueAtTime(gain, this.ctx.currentTime)
  }

  start() {
    this.node.start()
  }

  stop () {
    this.node.stop()
  }
}

export default class ShephardPage extends BasePage {
  constructor (props) {
    super(props)
    this.errorMessage = 'AudioContext is not supported.'
  }

  async init () {
    super.init()

    const audioContext = new AudioContext()

    this.osc1 = new ShephardOscillator(audioContext)
    this.osc2 = new ShephardOscillator(audioContext)
    this.osc3 = new ShephardOscillator(audioContext)

    this.baseFrequency = MIN_BASE_FREQUENCY

    this.osc1.setFrequencyAndGain(this.baseFrequency / 2, 0)
    this.osc2.setFrequencyAndGain(this.baseFrequency, 1)
    this.osc3.setFrequencyAndGain(this.baseFrequency * 2, 1)

    this.osc1.start()
    this.osc2.start()
    this.osc3.start()
  }

  animate () {
    super.animate()
    this.baseFrequency += 1
    if (this.baseFrequency >= MAX_BASE_FREQUENCY) {
      this.baseFrequency = MIN_BASE_FREQUENCY
    }

    const t = (this.baseFrequency - MIN_BASE_FREQUENCY) / (MAX_BASE_FREQUENCY - MIN_BASE_FREQUENCY)

    this.osc1.setFrequencyAndGain(this.baseFrequency / 2, exp(t))
    this.osc2.setFrequencyAndGain(this.baseFrequency, 1)
    this.osc3.setFrequencyAndGain(this.baseFrequency * 2, exp(1 - t))
  }

  stop () {
    super.stop()
    this.osc1.stop()
    this.osc2.stop()
    this.osc3.stop()
  }

  onResize () {}

  isSupported () {
    return AudioContext
  }
}
