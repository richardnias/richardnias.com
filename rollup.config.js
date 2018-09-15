import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import standard from 'rollup-plugin-standard'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: {
    file: 'build/main.min.js',
    format: 'iife',
    sourceMap: 'inline'
  },
  plugins: [
    resolve({
      module: true
    }),
    standard(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
