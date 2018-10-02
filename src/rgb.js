import bindWindowResize from './lib/bindWindowResize'
import CircularBuffer from './lib/circularBuffer'
import Detector from './lib/detector.js'
import removeCanvas from './lib/removeCanvas'

export default async function main () {
  const WIDTH = 640
  const HEIGHT = 360
  const DELAY = 5

  const buffer = new CircularBuffer(20)

  let running, removeResizeListener, canvas, ctx, video

  if (Detector.webgl) {
    await init()
    animate()
  }

  function stop () {
    running = false
    if (typeof removeResizeListener === 'function') {
      removeResizeListener()
    }
  }

  async function init () {
    video = document.createElement('video')
    video.autoplay = true

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {video: {width: WIDTH, height: HEIGHT, facingMode: 'user'}}

      try {
        video.srcObject = await navigator.mediaDevices.getUserMedia(constraints)
        video.play()
      } catch (e) {
        console.error(e)
      }
    } else {
      console.error('MediaDevices interface not available.')
    }

    canvas = document.createElement('canvas')
    canvas.width = WIDTH
    canvas.height = HEIGHT
    ctx = canvas.getContext('2d')
    // inputCtx.translate(WIDTH, 0)
    // inputCtx.scale(-1, 1)

    removeCanvas()
    document.body.appendChild(canvas)

    running = true
    removeResizeListener = bindWindowResize(null, (w, h) => {
      // inputCanvas.width = outputCanvas.width = w
      // inputCanvas.height = outputCanvas.height = h
      // inputCtx.translate(w, 0)
    })
  }

  function animate () {
    if (running) {
      window.requestAnimationFrame(animate)
    }

    animateCanvas()
  }

  function copyUintArray (src) {
    const dest = new Uint8ClampedArray(src.length)
    dest.set(src)
    return dest
  }

  function animateCanvas () {
    // draw video to canvas
    ctx.drawImage(video, 0, 0, WIDTH, HEIGHT)

    // get ImageData
    const frame = ctx.getImageData(0, 0, WIDTH, HEIGHT)

    // save a copy
    buffer.push(copyUintArray(frame.data))

    // manipulate
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const idx = 4 * (x + y * WIDTH)

        // rgb
        for (let c = 0; c < 3; c++) {
          let bufferFrame = buffer.get(c * DELAY)
          frame.data[idx + c] = bufferFrame ? bufferFrame[idx + c] : 0
        }
        frame.data[idx + 4] = 255  // alpha
      }
    }

    // put the new data back
    ctx.putImageData(frame, 0, 0)
  }

  return stop
}
