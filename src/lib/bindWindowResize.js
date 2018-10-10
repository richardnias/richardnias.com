export default function bindWindowResize (setSize) {
  window.addEventListener('resize', setSize, false)

  return _ => window.removeEventListener('resize', setSize, false)
}
