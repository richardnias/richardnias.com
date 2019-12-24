import BasePage from '../lib/basePage'
import Detector from '../lib/detector'
import { WHITE } from '../lib/canvasStyles'

const OFFSET = 0
const ROTATION_SPEED = 0.000001
const INITIAL_ROTATION_FACTOR = (1 + Math.sqrt(5)) / 2 - 0.0001
const POINT_RADIUS = 2
const DENSITY = 6

export default class SunflowerPage extends BasePage {
  constructor () {
    super()
    this.requiresSupportFor = [Detector.canvas]
    this.inspiration = {
      title: 'The Golden Ratio (why it is so irrational)',
      source: 'Numberphile',
      url: 'https://www.youtube.com/watch?v=sj8Sg8qnjOg'
    }
  }

  async init () {
    super.init()

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')

    this.rotationFactor = INITIAL_ROTATION_FACTOR

    this.onResize()

    return this.canvas
  }

  getPolarCoords (index, rotationFactor) {
    return {
      radius: OFFSET + index / DENSITY,
      theta: Math.PI * 2 / rotationFactor * index
    }
  }

  polarCoordsToCartesian ({ radius, theta }) {
    return {
      x: this.canvas.width / 2 + Math.cos(theta) * radius,
      y: this.canvas.height / 2 + Math.sin(theta) * radius
    }
  }

  drawPoints (ctx, points) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    points.forEach(function ({ x, y }) {
      ctx.fillRect(x - POINT_RADIUS, y - POINT_RADIUS, POINT_RADIUS * 2, POINT_RADIUS * 2)
    })
  }

  animate () {
    super.animate()

    let points = []

    for (let i = 0; i < this.numPoints; i++) {
      let polarCoords = this.getPolarCoords(i, this.rotationFactor)
      points.push(this.polarCoordsToCartesian(polarCoords))
    }

    this.drawPoints(this.ctx, points)

    this.rotationFactor += ROTATION_SPEED
  }

  onResize () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx.fillStyle = WHITE
    this.numPoints = Math.min(window.innerWidth / 2 - OFFSET, window.innerHeight / 2 - OFFSET) * DENSITY
  }
}
