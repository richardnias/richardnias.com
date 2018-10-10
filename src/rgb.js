import bindWindowResize from './lib/bindWindowResize'
import CircularBuffer from './lib/circularBuffer'
import removeCanvas from './lib/removeCanvas'

export default async function main () {
  const VIDEO_WIDTH = 1280
  const VIDEO_HEIGHT = 720
  const VIDEO_RATIO = VIDEO_WIDTH / VIDEO_HEIGHT
  const DELAY = 5

  const buffer = new CircularBuffer(20)

  let running, removeResizeListener, canvas, ctx, video

  await init()
  animate()

  function stop () {
    running = false
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(s => s.stop())
      video.srcObject = null
    }
    if (typeof removeResizeListener === 'function') {
      removeResizeListener()
    }
  }

  async function init () {
    video = document.createElement('video')
    video.autoplay = true

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {video: {width: VIDEO_WIDTH, height: VIDEO_HEIGHT, facingMode: 'user'}}

      video.srcObject = await navigator.mediaDevices.getUserMedia(constraints)
      video.play()
    } else {
      throw new Error('MediaDevices interface not available.')
    }

    canvas = document.createElement('canvas')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ctx = canvas.getContext('2d')
    ctx.setTransform(-1, 0, 0, 1, window.innerWidth, 0)

    removeCanvas()
    document.body.appendChild(canvas)

    running = true
    removeResizeListener = bindWindowResize(null, (w, h) => {
      canvas.width = w
      canvas.height = h
      ctx.setTransform(-1, 0, 0, 1, window.innerWidth, 0)
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
    // calculate crop/offset
    let dx, dy, width, height
    if (canvas.width / canvas.height <= VIDEO_RATIO) {
      width = canvas.height * VIDEO_RATIO
      height = canvas.height
      dx = (canvas.width - width) / 2
      dy = 0
    } else {
      width = canvas.width
      height = canvas.width / VIDEO_RATIO
      dx = 0
      dy = (canvas.height - height) / 2
    }

    // draw video to canvas
    ctx.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT, dx, dy, width, height)

    // get ImageData
    let frame = ctx.getImageData(dx, dy, width, height)

    // save a copy
    const currentFrame = copyUintArray(frame.data)
    buffer.push(currentFrame)

    const redFrame = currentFrame
    const greenFrame = buffer.get(DELAY) || new Uint8ClampedArray(frame.data.length)
    const blueFrame = buffer.get(DELAY * 2) || new Uint8ClampedArray(frame.data.length)

    // manipulate
    for (let i = 0; i < frame.data.length; i += 4) {
      frame.data[i] = redFrame[i]
      frame.data[i + 1] = greenFrame[i + 1]
      frame.data[i + 2] = blueFrame[i + 2]
      frame.data[i + 3] = 255
    }

    // put the new data back
    ctx.putImageData(frame, dx, dy)
  }

  return stop
}
