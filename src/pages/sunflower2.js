import CanvasPage from '../lib/canvasPage'

const OFFSET = 3
const PHI = (Math.sqrt(5) - 1) * Math.PI
const DENSITY = 1.2

export default class SunflowerPage extends CanvasPage {
  constructor () {
    super()
    this.inspiration = {
      title: 'This spiral is rotated by the golden angle...',
      source: 'matthen.com',
      url: 'https://blog.matthen.com/post/127400828111/this-spiral-is-rotated-by-the-golden-angle-every',
    }
  }

  getPolarCoords (index, rotationFactor) {
    return {
      radius: OFFSET + index / DENSITY,
      theta: PHI * index + rotationFactor,
    }
  }

  polarCoordsToCartesian ({ radius, theta }) {
    return {
      x: this.canvas.width / 2 + Math.cos(theta) * radius,
      y: this.canvas.height / 2 + Math.sin(theta) * radius,
      radius: Math.sqrt(radius/7),
      alpha: Math.pow(radius / this.sunflowerRadius - 1, 2) * 2
    }
  }

  drawPoint (ctx, { x, y, radius, alpha }) {
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fill()
  }

  animate () {
    super.animate()

    for (let i = 0; i < this.numPoints; i++) {
      let polarCoords = this.getPolarCoords(i, this.rotationFactor)
      let point = this.polarCoordsToCartesian(polarCoords)
      this.drawPoint(this.ctx, point)
    }

    if (this.frameIndex % 2 === 0) {
      this.rotationFactor += PHI
    }

    this.frameIndex++
  }

  onResize () {
    super.onResize()
    this.sunflowerRadius = Math.min(
        window.innerWidth / 2 - OFFSET,
        window.innerHeight / 2 - OFFSET
      )
    this.numPoints = this.sunflowerRadius * DENSITY
    this.rotationFactor = 0
    this.frameIndex = 0
  }
}
