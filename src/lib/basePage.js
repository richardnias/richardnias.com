import { bindWindowResize } from './util'

export default class BasePage {
  constructor () {
    this._running = true
    this._removeResizeListener = () => null

    this.requiresSupportFor = []

    this.inspiration = null

    this.init = this.init.bind(this)
    this.animate = this.animate.bind(this)
    this.onResize = this.onResize.bind(this)
    this.stop = this.stop.bind(this)
  }

  isSupported () {
    return this.requiresSupportFor.reduce((acc, dep) => acc && dep.isSupported)
  }

  init () {
    let errors = []
    this.requiresSupportFor.forEach(function checkDependency (dependency) {
      if (!dependency.isSupported) {
        errors.push(dependency.message)
      }
    })
    if (errors.length) {
      throw new Error(errors.join(', '))
    }
    this._removeResizeListener = bindWindowResize(this.onResize.bind(this))
  }

  animate () {
    if (this._running) {
      window.requestAnimationFrame(this.animate)
    }
  }

  onResize (w, h) {
    console.log('onResize not implemented', w, h)
  }

  stop () {
    this._running = false
    this._removeResizeListener()
  }
}
