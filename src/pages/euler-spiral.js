import last from 'lodash/last'
import random from 'lodash/random'

import BasePage from '../lib/basePage'
import Detector from '../lib/detector'
import { WHITE } from '../lib/canvasStyles'

const LINE_WIDTH = 1

const SEGMENT_LENGTH = random(6, 14)
const THETA = random(0, 0.15)
const STEPS = 5

const triangleNumber = n => n * (n + 1) / 2

export default class EulerSpiralPage extends BasePage {
  constructor () {
    super()
    this.requiresSupportFor = [Detector.canvas]
    this.inspiration = {
      title: '"draw a line, and extend it deflected by a fixed angle..."',
      source: 'matthen2',
      url: 'https://twitter.com/matthen2/status/1249611168265547776'
    }
  }

  async init () {
    super.init()

    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.setDimensions()

    return this.canvas
  }

  generatePoint ([x, y], theta) {
    return [x + Math.cos(theta) * SEGMENT_LENGTH, y + Math.sin(theta) * SEGMENT_LENGTH]
  }

  transformPoint ([x, y]) {
    return [x + window.innerWidth / 2, y + window.innerHeight / 2]
  }

  drawLine (ctx, point0, point1) {
    let [x0, y0] = this.transformPoint(point0)
    let [x1, y1] = this.transformPoint(point1)

    ctx.beginPath()
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)

    ctx.stroke()
  }

  animate () {
    super.animate()

    let lastPoint = last(this.points)
    let n = this.points.length

    for (let i = 0; i < STEPS; i++) {
      let nextPoint = this.generatePoint(lastPoint, THETA * triangleNumber(n + i))

      this.drawLine(this.ctx, lastPoint, nextPoint)
      this.points.push(nextPoint)

      lastPoint = nextPoint
    }
  }

  setDimensions () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    this.ctx.lineWidth = LINE_WIDTH
    this.ctx.strokeStyle = WHITE
    this.ctx.fillStyle = WHITE
    this.ctx.font = '1rem Work Sans, Arial'
    this.ctx.fillText(`r=${SEGMENT_LENGTH}, θ=${Math.round(THETA * 1000) / 1000}`, 50, 50)
    this.points = [[0, 0]]
  }

  onResize () {
    this.setDimensions()

    if (this.stopped()) {
      console.log('stopped!')
      this.start()
    }
  }
}
