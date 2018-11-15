import Delaunator from 'delaunator'
import { mat3 } from 'gl-matrix'

import BasePage from '../lib/basePage'

const WIDTH = 750
const HEIGHT = 550

const CORNERS = [
  [0, 0],
  [WIDTH, 0],
  [WIDTH, HEIGHT],
  [0, HEIGHT],
]

const fuzz = x => x - 5 + Math.round(Math.random() * 10)
const fuzzMap = arr => arr.map(fuzz)

function getTargetPoints (source) {
  return CORNERS.concat(
    source.map(fuzzMap)
  )
}

function loadImage (src) {
  return new Promise(function (resolve, reject) {
    const img = new Image()
    img.addEventListener('load', function () {
      resolve(img)
    })
    img.addEventListener('error', reject)
    img.src = src
  })
}

export default class WavyPage extends BasePage {
  constructor () {
    super()
    this.errorMessage = 'MediaDevices interface not available.'
  }

  async init () {
    super.init()

    let _source = []
    for (let x = 50; x < WIDTH; x += 50) {
      for (let y = 50; y < HEIGHT; y += 50) {
        _source = _source.concat([[x, y]])
      }
    }

    this._source = _source

    this.sourcePoints = CORNERS.concat(_source)

    this.canvas = document.createElement('canvas')
    this.canvas.width = WIDTH
    this.canvas.height = HEIGHT
    this.ctx = this.canvas.getContext('2d')

    this.sourceDelaunay = Delaunator.from(this.sourcePoints)

    this.sourceMatrix = mat3.create()
    this.targetMatrix = mat3.create()
    this.invSourceMatrix = mat3.create()
    this.transformMatrix = mat3.create()

    this.img = await loadImage('https://www.out.com/sites/out.com/files/2018/05/18/anotni.jpg')

    return this.canvas
  }

  animate () {
    super.animate()
    this.stats.begin()

    const source = this.sourceDelaunay

    const targetPoints = getTargetPoints(this._source)

    for (let i = 0; i < source.triangles.length; i += 3) {
      const [s0x, s0y] = this.sourcePoints[source.triangles[i]]
      const [s1x, s1y] = this.sourcePoints[source.triangles[i + 1]]
      const [s2x, s2y] = this.sourcePoints[source.triangles[i + 2]]

      const [t0x, t0y] = targetPoints[source.triangles[i]]
      const [t1x, t1y] = targetPoints[source.triangles[i + 1]]
      const [t2x, t2y] = targetPoints[source.triangles[i + 2]]

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

      // this.ctx.strokeStyle = 'cyan'
      this.ctx.beginPath()
      this.ctx.moveTo(s0x, s0y)
      this.ctx.lineTo(s1x, s1y)
      this.ctx.lineTo(s2x, s2y)
      this.ctx.closePath()
      // this.ctx.stroke()

      this.ctx.clip()
      this.ctx.drawImage(this.img, 0, 0)
      this.ctx.restore()
    }
    this.stats.end()
  }

  onResize () {
  }

  isSupported () {
    return true
  }
}
