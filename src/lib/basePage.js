import Detector from '../lib/detector.js'
import bindWindowResize from './bindWindowResize'
import removeCanvas from './removeCanvas'

export default class BasePage {
  constructor () {
    this._running = true
    this._removeResizeListener = () => null

    this.init = this.init.bind(this)
    this.animate = this.animate.bind(this)
    this.onResize = this.onResize.bind(this)
    this.stop = this.stop.bind(this)
    this._init = this._init.bind(this)
    this._animate = this._animate.bind(this)

    if (Detector.webgl) {
      this._init().then(this._animate)
    }
  }

  async _init () {
    const canvas = await this.init()
    removeCanvas()
    document.body.appendChild(canvas)
    this._removeResizeListener = bindWindowResize(this.onResize.bind(this))
  }

  init () {
    throw new Error(`${this}#init: Not implemented`)
  }

  _animate () {
    if (this._running) {
      window.requestAnimationFrame(this._animate)
    }

    this.animate()
  }

  animate () {
    throw new Error(`${this}#animate: Not implemented`)
  }

  onResize (w, h) {
    console.log('onResize not implemented', w, h)
  }

  stop () {
    this._running = false
    this._removeResizeListener()
  }
}
