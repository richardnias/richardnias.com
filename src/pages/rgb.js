import CircularBuffer from '../lib/circularBuffer'

import BasePage from '../lib/basePage'
import { copyUintArray } from '../lib/util'

const VIDEO_WIDTH = 1280
const VIDEO_HEIGHT = 720
const VIDEO_RATIO = VIDEO_WIDTH / VIDEO_HEIGHT
const DELAY = 5

export default class RGBPage extends BasePage {
  constructor () {
    super()
    this.errorMessage = 'MediaDevices interface not available.'
  }

  async init () {
    super.init()

    this.buffer = new CircularBuffer(20)

    this.video = document.createElement('video')
    this.video.autoplay = true

    const constraints = { video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, facingMode: 'user' } }

    this.video.srcObject = await navigator.mediaDevices.getUserMedia(constraints)
    this.video.play()

    this.canvas = document.createElement('canvas')
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx = this.canvas.getContext('2d')
    this.ctx.setTransform(-1, 0, 0, 1, window.innerWidth, 0)

    return this.canvas
  }

  animate () {
    super.animate()

    // calculate crop/offset
    let dx, dy, width, height
    if (this.canvas.width / this.canvas.height <= VIDEO_RATIO) {
      width = this.canvas.height * VIDEO_RATIO
      height = this.canvas.height
      dx = (this.canvas.width - width) / 2
      dy = 0
    } else {
      width = this.canvas.width
      height = this.canvas.width / VIDEO_RATIO
      dx = 0
      dy = (this.canvas.height - height) / 2
    }

    // draw video to canvas
    this.ctx.drawImage(this.video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, dx, dy, width, height)

    // get ImageData
    let frame = this.ctx.getImageData(dx, dy, width, height)

    // save a copy
    const currentFrame = copyUintArray(frame.data)
    this.buffer.push(currentFrame)

    const redFrame = currentFrame
    const greenFrame = this.buffer.get(DELAY) || new Uint8ClampedArray(frame.data.length)
    const blueFrame = this.buffer.get(DELAY * 2) || new Uint8ClampedArray(frame.data.length)

    // manipulate
    for (let i = 0; i < frame.data.length; i += 4) {
      frame.data[i] = redFrame[i]
      frame.data[i + 1] = greenFrame[i + 1]
      frame.data[i + 2] = blueFrame[i + 2]
      frame.data[i + 3] = 255
    }

    // put the new data back
    this.ctx.putImageData(frame, dx, dy)
  }

  onResize () {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.ctx.setTransform(-1, 0, 0, 1, window.innerWidth, 0)
  }

  stop () {
    super.stop()
    if (this.video.srcObject) {
      this.video.srcObject.getTracks().forEach(s => s.stop())
      this.video.srcObject = null
    }
  }

  isSupported () {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  }
}
