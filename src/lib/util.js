export function weightedAvg (a, b) {
  return (a + b * 999) / 1000
}

export function copyUintArray (src) {
  const dest = new Uint8ClampedArray(src.length)
  dest.set(src)
  return dest
}
