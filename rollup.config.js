import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import glsl from 'rollup-plugin-glsl'
import notify from 'rollup-plugin-notify'
import resolve from 'rollup-plugin-node-resolve'
import standard from 'rollup-plugin-standard'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: ['src/index.js', 'src/mountains.js', 'src/oblong.js'],
  output: {
    dir: 'public/js',
    format: 'system',
    sourcemap: true
  },
  experimentalCodeSplitting: true,
  plugins: [
    notify(),
    glsl({
      include: '**/*.glsl'
    }),
    resolve({
      module: true,
      jsnext: true
    }),
    commonjs({
      sourceMap: false
    }),
    standard(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
