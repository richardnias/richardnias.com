import { CanvasTexture } from 'three/src/textures/CanvasTexture'
import { ClampToEdgeWrapping } from 'three/src/constants'
import { Color } from 'three/src/math/Color'
import { FogExp2 } from 'three/src/scenes/FogExp2'
import { Mesh } from 'three/src/objects/Mesh'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry'
import { Scene } from 'three/src/scenes/Scene'
import { Vector3 } from 'three/src/math/Vector3'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import Detector from './lib/detector.js'
import ImprovedNoise from './lib/improvedNoise'
import removeCanvas from './lib/removeCanvas'

export default function main () {
  let running, camera, scene, renderer, mesh, texture, data, worldWidth, worldDepth, planeWidth, planeDepth,
    lookPosition, radius, hypotenuse, theta, height

  if (Detector.webgl) {
    init()
    animate()
  }

  function stop () {
    running = false
  }

  function init () {
    worldWidth = worldDepth = 512
    planeWidth = planeDepth = 10000

    radius = 1000
    hypotenuse = Math.sqrt(radius * radius * 2)
    theta = 0
    lookPosition = new Vector3(0, 0, 0)

    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000)
    scene = new Scene()
    scene.background = new Color(0xd595a3)
    scene.fog = new FogExp2(0xd595a3, 0.001)

    data = generateHeight(worldWidth, worldDepth)

    height = data[worldWidth / 2 + worldDepth / 2 * worldWidth] * 10 + 500

    const geometry = new PlaneBufferGeometry(planeWidth, planeDepth, worldWidth - 1, worldDepth - 1)
    geometry.rotateX(-Math.PI / 2)

    let vertices = geometry.attributes.position.array

    for (let i = 0, j = 0; i < vertices.length; i++, j += 3) {
      vertices[j + 1] = data[i] * 10
    }
    texture = new CanvasTexture(generateTexture(data, worldWidth, worldDepth))
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping

    mesh = new Mesh(geometry, new MeshBasicMaterial({map: texture}))
    scene.add(mesh)

    renderer = new WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)

    removeCanvas()
    document.body.appendChild(renderer.domElement)

    window.addEventListener('resize', onWindowResize, false)

    running = true
  }

  function onWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function generateHeight (width, height) {
    const size = width * height
    const data = new Uint8Array(size)
    const perlin = new ImprovedNoise()
    let quality = 1
    const z = Math.random() * 100

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width
        const y = ~~(i / width)
        data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
      }
      quality *= 5
    }
    return data
  }

  function generateTexture (data, width, height) {
    let context, image, imageData

    const vector3 = new Vector3(0, 0, 0)

    const sun = new Vector3(1, 1, 1)
    sun.normalize()

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    context = canvas.getContext('2d')
    context.fillStyle = '#000'
    context.fillRect(0, 0, width, height)

    image = context.getImageData(0, 0, width, height)
    imageData = image.data

    for (let i = 0, j = 0; i < imageData.length; i += 4, j++) {
      vector3.x = data[j - 2] - data[j + 2]
      vector3.y = 2
      vector3.z = data[j - width * 2] - data[j + width * 2]
      vector3.normalize()

      const shade = vector3.dot(sun)

      imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007)
      imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007)
      imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007)
    }

    context.putImageData(image, 0, 0)

    // scaled 4x

    const canvasScaled = document.createElement('canvas')
    canvasScaled.width = width * 4
    canvasScaled.height = height * 4

    context = canvasScaled.getContext('2d')
    context.scale(4, 4)
    context.drawImage(canvas, 0, 0)

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height)
    imageData = image.data

    for (let i = 0, l = imageData.length; i < l; i += 4) {
      const v = ~~(Math.random() * 5)
      imageData[i] += v
      imageData[i + 1] += v
      imageData[i + 2] += v
    }

    context.putImageData(image, 0, 0)
    return canvasScaled
  }

  function animate () {
    if (running) {
      window.requestAnimationFrame(animate)
    }
    theta += 0.0005

    const x = Math.cos(theta) * radius
    const z = Math.sin(theta) * radius

    camera.position.x = x
    camera.position.z = z

    lookPosition.x = Math.sin(-theta) * hypotenuse
    lookPosition.z = Math.cos(-theta) * hypotenuse

    const xIndex = worldWidth / 2 + Math.round(x / planeWidth * worldWidth)
    const zIndex = worldDepth / 2 + Math.round(z / planeDepth * worldDepth)
    const index = xIndex + zIndex * worldWidth

    const groundPosition = data[index] * 10

    if (height < groundPosition + 300) {
      height = weightedAvg(groundPosition + 300, height)
    } else if (height > groundPosition + 800) {
      height = weightedAvg(groundPosition + 800, height)
    }

    camera.position.y = height
    lookPosition.y = height

    camera.lookAt(lookPosition)
    render()
  }

  function weightedAvg (a, b) {
    return (a + b * 999) / 1000
  }

  function render () {
    console.log('mountain render')
    renderer.render(scene, camera)
  }

  return stop
}
