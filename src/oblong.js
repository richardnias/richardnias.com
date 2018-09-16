import { BoxGeometry } from 'three/src/geometries/BoxGeometry'
import { Color } from 'three/src/math/Color'
import { Mesh } from 'three/src/objects/Mesh'
import { MeshNormalMaterial } from 'three/src/materials/MeshNormalMaterial'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { Scene } from 'three/src/scenes/Scene'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import Detector from './lib/detector.js'
import removeCanvas from './lib/removeCanvas'

let camera, scene, renderer, geometry, material, mesh

export default function main () {
  if (Detector.webgl) {
    init()
    animate()
  }
}

window.addEventListener('resize', onWindowResize, false)

function init () {
  camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
  camera.position.z = 1

  scene = new Scene()
  scene.background = new Color(0xd595a3)

  geometry = new BoxGeometry(0.4, 0.2, 0.2)
  material = new MeshNormalMaterial()

  mesh = new Mesh(geometry, material)
  scene.add(mesh)

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  removeCanvas()
  document.body.appendChild(renderer.domElement)
}

function animate () {
  window.requestAnimationFrame(animate)

  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.02
  mesh.rotation.z -= 0.02

  renderer.render(scene, camera)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
