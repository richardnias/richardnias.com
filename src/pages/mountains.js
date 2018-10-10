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

import ImprovedNoise from '../lib/improvedNoise'
import BasePage from '../lib/basePage'

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

function weightedAvg (a, b) {
  return (a + b * 999) / 1000
}

const WORLD_WIDTH = 512
const WORLD_DEPTH = 512
const PLANE_WIDTH = 10000
const PLANE_DEPTH = 10000
const RADIUS = 1000
const HYPOTENUSE = Math.sqrt(RADIUS * RADIUS * 2)

export default class MountainPage extends BasePage {
  init () {
    this.theta = 0

    this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000)
    this.scene = new Scene()
    this.scene.background = new Color(0xd595a3)
    this.scene.fog = new FogExp2(0xd595a3, 0.001)

    this.data = generateHeight(WORLD_WIDTH, WORLD_DEPTH)
    const texture = new CanvasTexture(generateTexture(this.data, WORLD_WIDTH, WORLD_DEPTH))
    texture.wrapS = ClampToEdgeWrapping
    texture.wrapT = ClampToEdgeWrapping

    this.height = this.data[WORLD_WIDTH / 2 + WORLD_DEPTH / 2 * WORLD_WIDTH] * 10 + 500

    const geometry = new PlaneBufferGeometry(
      PLANE_WIDTH,
      PLANE_DEPTH,
      WORLD_WIDTH - 1,
      WORLD_DEPTH - 1
    )
    geometry.rotateX(-Math.PI / 2)

    let vertices = geometry.attributes.position.array

    for (let i = 0, j = 0; i < vertices.length; i++, j += 3) {
      vertices[j + 1] = this.data[i] * 10
    }

    const mesh = new Mesh(geometry, new MeshBasicMaterial({map: texture}))
    this.scene.add(mesh)

    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    return this.renderer.domElement
  }

  animate () {
    const {height: oldHeight, theta: oldTheta, data, scene, camera, renderer} = this

    const theta = oldTheta + 0.0005
    let y

    const x = Math.cos(theta) * RADIUS
    const z = Math.sin(theta) * RADIUS

    const xIndex = WORLD_WIDTH / 2 + Math.round(x / PLANE_WIDTH * WORLD_WIDTH)
    const zIndex = WORLD_DEPTH / 2 + Math.round(z / PLANE_DEPTH * WORLD_DEPTH)
    const index = xIndex + zIndex * WORLD_WIDTH

    const groundPosition = data[index] * 10

    if (oldHeight < groundPosition + 300) {
      y = Math.max(weightedAvg(groundPosition + 300, oldHeight), groundPosition)
    } else if (oldHeight > groundPosition + 800) {
      y = weightedAvg(groundPosition + 800, oldHeight)
    } else {
      y = oldHeight
    }

    const lookVector = new Vector3(
      Math.sin(-theta) * HYPOTENUSE,
      y,
      Math.cos(-theta) * HYPOTENUSE
    )

    this.camera.position.x = x
    this.camera.position.y = y
    this.camera.position.z = z

    this.camera.lookAt(lookVector)
    this.renderer.render(this.scene, this.camera)

    // state updates
    this.theta = theta
    this.height = y
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
