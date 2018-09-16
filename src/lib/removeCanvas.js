export default function removeCanvas () {
  const canvas = document.querySelector('canvas')
  if (canvas) {
    canvas.remove()
  }
}
