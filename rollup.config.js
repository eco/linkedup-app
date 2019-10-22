import path from 'path'
import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import json from 'rollup-plugin-json'

const thisPkg = require('./package')

const production = !process.env.ROLLUP_WATCH
const ci = !!process.env.CI
const sandbox = !!process.env.SANDBOX_MODE

const generateConfig = (input, outputDir, livereloadPort) => ({
  input,
  output: {
    sourcemap: !production,
    format: 'esm',
    name: 'app',
    dir: outputDir,
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write(path.join(outputDir, 'main.css'))
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.svelte', '.json'],
      preferBuiltins: false,
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/'),
      customResolveOptions: {
        pathFilter: (pkg, _path, relativePath) => {
          if (
            sandbox &&
            pkg.name === thisPkg.name &&
            relativePath.startsWith('src/services')
          ) {
            return relativePath.replace('src/services', 'sandbox/services')
          }
          return relativePath
        },
      },
    }),
    commonjs(),

    json(),

    // Watch the outputDir directory and refresh the
    // browser on changes when not in production
    !production && livereload({
      watch: outputDir,
      port: livereloadPort,
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    // Generate stats for bundle size analysis when
    // building locally
    !ci && production && visualizer({ filename: path.join(outputDir, 'stats.html')}),
  ],
  watch: {
    clearScreen: false,
  },
})

export default [
  generateConfig(production ? 'src/main' : 'sandbox/main', 'public', 35729),
  generateConfig('src/standalone/redeem/main', 'public/s/redeem', 35730),
]
