import { PlaneBufferGeometry } from 'three/src/geometries/PlaneGeometry'
import { Mesh } from 'three/src/objects/Mesh'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
import { Camera } from 'three/src/cameras/Camera'
import { Scene } from 'three/src/scenes/Scene'
import { Vector2 } from 'three/src/math/Vector2'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'

import BasePage from './basePage'
import Detector from './detector'

export default class ShaderPage extends BasePage {
  get vertShader () {
    throw new Error('Not implemented!')
  };

  get fragShader () {
    throw new Error('Not implemented!')
  };

  constructor () {
    super()
    this.requiresSupportFor = [Detector.webgl]
  }

  init () {
    super.init()

    this.camera = new Camera()
    this.camera.position.z = 1

    this.scene = new Scene()
    const geometry = new PlaneBufferGeometry(2, 2)

    this.uniforms = {
      u_time: { type: 'f', value: 1.0 },
      u_resolution: { type: 'v2', value: new Vector2() }
    }

    const material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: this.vertShader,
      fragmentShader: this.fragShader
    })

    const mesh = new Mesh(geometry, material)
    this.scene.add(mesh)

    this.renderer = new WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.uniforms.u_resolution.value.x = this.renderer.domElement.width
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height

    return this.renderer.domElement
  }

  animate () {
    super.animate()
    this.uniforms.u_time.value += 0.05
    this.renderer.render(this.scene, this.camera)
  }

  onResize () {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.uniforms.u_resolution.value.x = this.renderer.domElement.width
    this.uniforms.u_resolution.value.y = this.renderer.domElement.height
  }
}
