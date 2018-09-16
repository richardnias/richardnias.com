import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import standard from 'rollup-plugin-standard'

export default {
  input: ['src/index.js', 'src/oblong.js'],
  output: {
    dir: 'public/js',
    format: 'esm',
    sourcemap: true
  },
  experimentalCodeSplitting: true,
  plugins: [
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
