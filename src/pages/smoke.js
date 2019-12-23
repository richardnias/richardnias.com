import * as FRAG_GL from '../shaders/smoke.glsl'
import * as VERT_GL from '../shaders/vert.glsl'

import ShaderPage from '../lib/shaderPage'

export default class CloudPage extends ShaderPage {
  vertShader = VERT_GL
  fragShader = FRAG_GL

  constructor (props) {
    super(props)
    this.inspiration = {
      title: 'Fractal Brownian Motion',
      source: 'The Book of Shaders',
      url: 'https://thebookofshaders.com/13/'
    }
  }
}
