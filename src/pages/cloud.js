import * as FRAG_GL from '../lib/cloud.glsl'
import * as VERT_GL from '../lib/vert.glsl'

import ShaderPage from '../lib/shaderPage'

export default class CloudPage extends ShaderPage {
  vertShader = VERT_GL
  fragShader = FRAG_GL
}
