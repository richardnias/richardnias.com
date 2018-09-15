import babel from 'rollup-plugin-babel'
import standard from 'rollup-plugin-standard'

export default {
  entry: 'src/index.js',
  dest: 'build/main.min.js',
  format: 'iife',
  sourceMap: 'inline',
  plugins: [
    standard(),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
