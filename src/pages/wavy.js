import Delaunator from 'delaunator'
import { mat3 } from 'gl-matrix'

import WebcamPage from '../lib/webcam'


const RESOLUTION = 100
const FUZZ = 10
const HALF_FUZZ = FUZZ / 2


const fuzz = x => x - HALF_FUZZ + Math.round(Math.random() * FUZZ)
const fuzzMap = arr => arr.map(fuzz)

export default class WavyPage extends WebcamPage {
  constructor (props) {
    super(props)
    this.getTargetPoints = this.getTargetPoints.bind(this)
  }

  async init () {
    this.sourceMatrix = mat3.create()
    this.targetMatrix = mat3.create()
    this.invSourceMatrix = mat3.create()
    this.transformMatrix = mat3.create()

    this.corners = [
      [0, 0],
      [window.innerWidth, 0],
      [window.innerWidth, window.innerHeight],
      [0, window.innerHeight],
    ]

    this.calculateSourcePoints()

    return super.init()
  }

  calculateSourcePoints() {
    this.innerSourcePoints = []
    for (let x = RESOLUTION; x < window.innerWidth; x += RESOLUTION) {
      for (let y = RESOLUTION; y < window.innerHeight; y += RESOLUTION) {
        this.innerSourcePoints.push([x, y])
      }
    }

    this.sourcePoints = this.corners.concat(this.innerSourcePoints)
    this.sourceDelaunay = Delaunator.from(this.sourcePoints)
  }

  getTargetPoints () {
    return this.corners.concat(
      this.innerSourcePoints.map(fuzzMap)
    )
  }

  animate () {
    super.animate()
    this.stats.begin()

    const source = this.sourceDelaunay

    const targetPoints = this.getTargetPoints()

    const [dx, dy, width, height] = this.calculateDrawImageParams()

    for (let i = 0; i < source.triangles.length; i += 3) {
      const i0 = source.triangles[i]
      const i1 = source.triangles[i + 1]
      const i2 = source.triangles[i + 2]

      const [s0x, s0y] = this.sourcePoints[i0]
      const [s1x, s1y] = this.sourcePoints[i1]
      const [s2x, s2y] = this.sourcePoints[i2]

      const [t0x, t0y] = targetPoints[i0]
      const [t1x, t1y] = targetPoints[i1]
      const [t2x, t2y] = targetPoints[i2]

      mat3.set(this.sourceMatrix,
        s0x,
        s0y,
        1,
        s1x,
        s1y,
        1,
        s2x,
        s2y,
        1
      )

      mat3.set(this.targetMatrix,
        t0x,
        t0y,
        1,
        t1x,
        t1y,
        1,
        t2x,
        t2y,
        1
      )

      mat3.invert(this.invSourceMatrix, this.sourceMatrix)
      mat3.multiply(this.transformMatrix, this.targetMatrix, this.invSourceMatrix)

      this.ctx.save()
      this.ctx.transform(
        this.transformMatrix[0],
        this.transformMatrix[1],
        this.transformMatrix[3],
        this.transformMatrix[4],
        this.transformMatrix[6],
        this.transformMatrix[7],
      )

      this.ctx.beginPath()
      this.ctx.moveTo(s0x, s0y)
      this.ctx.lineTo(s1x, s1y)
      this.ctx.lineTo(s2x, s2y)
      this.ctx.closePath()

      this.ctx.clip()
      this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight, dx, dy, width, height)
      this.ctx.restore()
    }
    this.stats.end()
  }

  onResize () {
    super.onResize()
    this.calculateSourcePoints()
  }
}
