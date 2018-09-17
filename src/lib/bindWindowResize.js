export default function bindWindowResize (camera, renderer) {
  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  return _ => window.removeEventListener('resize', onWindowResize, false)
}
