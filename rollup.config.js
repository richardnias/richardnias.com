import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import clear from 'rollup-plugin-clear'
import copy from 'rollup-plugin-copy'
import glsl from 'rollup-plugin-glsl'
import notify from 'rollup-plugin-notify'
import resolve from 'rollup-plugin-node-resolve'
import standard from 'rollup-plugin-standard'
import { uglify } from 'rollup-plugin-uglify'
import visualizer from 'rollup-plugin-visualizer'

export default {
  input: ['src/index.js', 'src/mountains.js', 'src/oblong.js', 'src/rgb.js'],
  output: {
    dir: 'public/js',
    format: 'system',
    sourcemap: true
  },
  experimentalCodeSplitting: true,
  plugins: [
    clear({
      targets: ['public']
    }),
    visualizer(),
    notify(),
    copy({
      'src/favicon.png': 'public/favicon.png',
      'node_modules/systemjs/dist/system-production.js': 'public/js/system-production.js',
      'src/index.html': 'public/index.html'
    }),
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
  ],
  watch: {
    include: ['src/**/*']
  }
}
