import { Color } from 'three/src/math/Color'
import { Mesh } from 'three/src/objects/Mesh'
import { MeshBasicMaterial } from 'three/src/materials/MeshBasicMaterial'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry'
import { Scene } from 'three/src/scenes/Scene'
import { VideoTexture } from 'three/src/textures/VideoTexture'
import { LinearFilter, DoubleSide } from 'three/src/constants'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import WebcamPage from '../lib/webcam'
import Detector from '../lib/detector'

export default class MeshCamPage extends WebcamPage {
  constructor () {
    super()
    this.errorMessage = 'WebGL is not supported in this browser'
  }

  init () {
    super.init()

    const texture = new VideoTexture(this.video)
    texture.minFilter = LinearFilter

    console.log(texture)

    const geometry = new PlaneBufferGeometry(16, 9)
    geometry.scale(0.5, 0.5, 0.5)

    const material = new MeshBasicMaterial({ map: texture, side: DoubleSide })

    const mesh = new Mesh(geometry, material)
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

    this.renderer.render(this.scene, this.camera)
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  isSupported () {
    return Detector.webgl
  }
}
