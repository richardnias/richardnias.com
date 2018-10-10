import { BoxGeometry } from 'three/src/geometries/BoxGeometry'
import { Color } from 'three/src/math/Color'
import { Mesh } from 'three/src/objects/Mesh'
import { MeshNormalMaterial } from 'three/src/materials/MeshNormalMaterial'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { Scene } from 'three/src/scenes/Scene'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import BasePage from '../lib/basePage'

export default class OblongPage extends BasePage {
  init () {
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10)
    this.camera.position.z = 1

    this.scene = new Scene()
    this.scene.background = new Color(0xd595a3)

    const geometry = new BoxGeometry(0.4, 0.2, 0.2)
    const material = new MeshNormalMaterial()

    this.mesh = new Mesh(geometry, material)
    this.scene.add(this.mesh)

    this.renderer = new WebGLRenderer({antialias: true})
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    return this.renderer.domElement
  }

  animate () {
    this.mesh.rotation.x += 0.01
    this.mesh.rotation.y += 0.02
    this.mesh.rotation.z -= 0.02

    this.renderer.render(this.scene, this.camera)
  }

  onResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
