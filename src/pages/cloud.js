import * as FRAG_GL from '../shaders/cloud.glsl'
import * as VERT_GL from '../shaders/vert.glsl'

import ShaderPage from '../lib/shaderPage'

export default class CloudPage extends ShaderPage {
  vertShader = VERT_GL
  fragShader = FRAG_GL
}