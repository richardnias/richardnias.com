import { Color } from 'three/src/math/Color'
import { FogExp2 } from 'three/src/scenes/FogExp2'
import { Mesh } from 'three/src/objects/Mesh'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry'
import { Scene } from 'three/src/scenes/Scene'
import { Vector3 } from 'three/src/math/Vector3'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import BasePage from '../lib/basePage'
import Detector from '../lib/detector'
import generateTerrain from '../lib/terrainGen'
import { PINK } from '../lib/canvasStyles'
import { weightedAvg } from '../lib/util'

const WORLD_WIDTH = 512
const WORLD_DEPTH = 512
const PLANE_WIDTH = 10000
const PLANE_DEPTH = 10000
const RADIUS = 1000
const HYPOTENUSE = Math.sqrt(RADIUS * RADIUS * 2)

export default class MountainPage extends BasePage {
  constructor () {
    super()
    this.requiresSupportFor = [Detector.webgl]
    this.inspiration = {
      title: 'geometry / terrain',
      source: 'Three.js documentation',
      url: 'https://threejs.org/examples/#webgl_geometry_terrain'
    }
  }

  init () {
    super.init()

    const { data, texture } = generateTerrain(WORLD_WIDTH, WORLD_DEPTH)
    const geometry = new PlaneBufferGeometry(
      PLANE_WIDTH,
      PLANE_DEPTH,
      WORLD_WIDTH - 1,
      WORLD_DEPTH - 1
    )
    geometry.rotateX(-Math.PI / 2)

    let vertices = geometry.attributes.position.array
    for (let i = 0, j = 0; i < vertices.length; i++, j += 3) {
      vertices[j + 1] = data[i] * 10
    }

    const mesh = new Mesh(geometry, new MeshBasicMaterial({ map: texture }))

    this.theta = 0
    this.height = data[WORLD_WIDTH / 2 + WORLD_DEPTH / 2 * WORLD_WIDTH] * 10 + 500
    this.data = data

    this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000)
    this.scene = new Scene()
    this.scene.background = new Color(PINK)
    this.scene.fog = new FogExp2(PINK, 0.001)

    this.scene.add(mesh)

    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    return this.renderer.domElement
  }

  animate () {
    super.animate()

    const { height: oldHeight, theta: oldTheta, data, scene, camera, renderer } = this

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

    camera.position.x = x
    camera.position.y = y
    camera.position.z = z

    camera.lookAt(lookVector)
    renderer.render(scene, camera)

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
