import * as THREE from 'three'
import Detector from './lib/detector.js'

let camera, scene, renderer, geometry, material, mesh

if (Detector.webgl) {
  init()
  animate()
}

window.addEventListener('resize', onWindowResize, false)

function init () {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
  camera.position.z = 1

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xd595a3)

  geometry = new THREE.BoxGeometry(0.4, 0.2, 0.2)
  material = new THREE.MeshNormalMaterial()

  mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
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
