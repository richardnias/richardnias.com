export function weightedAvg (a, b) {
  return (a + b * 999) / 1000
}

export function copyUintArray (src) {
  const dest = new Uint8ClampedArray(src.length)
  dest.set(src)
  return dest
}

export function bindWindowResize (setSize) {
  window.addEventListener('resize', setSize, false)

  return _ => window.removeEventListener('resize', setSize, false)
}

export function removeCanvas () {
  const canvas = document.querySelector('canvas')
  if (canvas) {
    canvas.remove()
  }
}

export function extractFrameData (ctx, video, dx, dy, width, height) {
  // draw video to canvas
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, dx, dy, width, height)

  // get ImageData
  return ctx.getImageData(dx, dy, width, height)
}
