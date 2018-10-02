export default function bindWindowResize (camera, setSize) {
  function onWindowResize () {
    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
    }

    setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('resize', onWindowResize, false)

  return _ => window.removeEventListener('resize', onWindowResize, false)
}
