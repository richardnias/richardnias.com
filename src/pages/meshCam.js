import { Color } from 'three/src/math/Color'
import { Mesh } from 'three/src/objects/Mesh'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { Scene } from 'three/src/scenes/Scene'
import { VideoTexture } from 'three/src/textures/VideoTexture'
import { LinearFilter, DoubleSide } from 'three/src/constants'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import WebcamPage from '../lib/webcam'
import Detector from '../lib/detector'

const RESOLUTION = 20
const GEOMETRY_WIDTH = RESOLUTION * 16
const GEOMETRY_HEIGHT = RESOLUTION * 9
const EXTRUSION_FACTOR = 10

function getBrightness (r, g, b) {
  return Math.max(r, g, b) / 256
}

function getPixelsAtCoords (x, y, imageWidth, imageData) {
  const index = (x + y * imageWidth) * 4
  return imageData.slice(index, index + 3)
}

function getBrightnessAtCoords (x, y, imageWidth, imageData) {
  return getBrightness(...getPixelsAtCoords(x, y, imageWidth, imageData))
}

export default class MeshCamPage extends WebcamPage {
  constructor () {
    super()
    this.errorMessage = 'WebGL is not supported in this browser or MediaDevices interface not available.'
  }

  async init () {
    // todo: different pixel densities
    await super.init()

    const texture = new VideoTexture(this.video)
    texture.minFilter = LinearFilter

    this.geometry = new PlaneGeometry(16, 9, GEOMETRY_WIDTH - 1, GEOMETRY_HEIGHT - 1)
    this.geometry.scale(0.8, 0.8, 0.8)

    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide })

    const mesh = new Mesh(this.geometry, material)
    mesh.scale.x = -1
    mesh.position.set(0, 0, -10)

    this.camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    this.camera.position.z = 0.01
    this.scene = new Scene()
    this.scene.background = new Color(0xd595a3)

    this.scene.add(mesh)
    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    return this.renderer.domElement
  }

  animate () {
    super.animate()

    const videoData = this.extractVideoData(0, 0, this.videoWidth, this.videoHeight).data

    for (let i = 0; i < GEOMETRY_WIDTH; i++) {
      for (let j = GEOMETRY_HEIGHT - 1; j >= 0; j--) {
        const x = Math.floor(this.videoWidth * (1 - i / GEOMETRY_WIDTH))
        const y = Math.floor(j / GEOMETRY_HEIGHT * this.videoHeight)
        const vertexIndex = i + j * GEOMETRY_WIDTH
        this.geometry.vertices[vertexIndex].z = EXTRUSION_FACTOR * (-1 + getBrightnessAtCoords(x, y, this.videoWidth, videoData))
      }
    }
    this.geometry.verticesNeedUpdate = true

    this.renderer.render(this.scene, this.camera)
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  isSupported () {
    return Detector.webgl && super.isSupported()
  }
}
