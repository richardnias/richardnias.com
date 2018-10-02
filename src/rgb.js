import bindWindowResize from './lib/bindWindowResize'
import Detector from './lib/detector.js'
import removeCanvas from './lib/removeCanvas'

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_video_webcam.html

export default async function main () {
  let running, removeResizeListener, inputCanvas, inputCtx, outputCanvas, outputCtx, video

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
    document.body.appendChild(video)

    inputCanvas = document.createElement('canvas')
    inputCanvas.width = window.innerWidth
    inputCanvas.height = window.innerHeight
    inputCtx = inputCanvas.getContext('2d')
    inputCtx.translate(window.innerWidth, 0)
    inputCtx.scale(-1, 1)

    outputCanvas = document.createElement('canvas')
    outputCanvas.width = window.innerWidth
    outputCanvas.height = window.innerHeight
    outputCtx = outputCanvas.getContext('2d')

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {video: {width: 1280, height: 720, facingMode: 'user'}}

      try {
        video.srcObject = await navigator.mediaDevices.getUserMedia(constraints)
        video.play()
      } catch (e) {
        console.error(e)
      }
    } else {
      console.error('MediaDevices interface not available.')
    }

    removeCanvas()
    document.body.appendChild(outputCanvas)

    running = true
    removeResizeListener = bindWindowResize(null, (w, h) => {
      inputCanvas.width = outputCanvas.width = w
      inputCanvas.height = outputCanvas.height = h
      inputCtx.translate(w, 0)
    })
  }

  function animate () {
    if (running) {
      window.requestAnimationFrame(animate)
    }

    inputCtx.drawImage(video, 0, 0, window.innerWidth, window.innerHeight)
    const frame = inputCtx.getImageData(0, 0, window.innerWidth, window.innerHeight)

    outputCtx.putImageData(frame, 0, 0)
  }

  return stop
}
