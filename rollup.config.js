import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'

const thisPkg = require('./package')

const production = !process.env.ROLLUP_WATCH
const ci = !!process.env.CI
const branch = process.env.TRAVIS_BRANCH

const includeMocks = !production || (ci && branch === 'master')

const mocksPathFilter = (pkg, path, relativePath) => {
  if (pkg.name === thisPkg.name && relativePath.startsWith('src/services')) {
    return relativePath.replace('src/services', 'mock/services')
  }
  return relativePath
}

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'esm',
    name: 'app',
    dir: 'public',
  },
  plugins: [
    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write('public/main.css')
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
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/'),
      customResolveOptions: {
        pathFilter: includeMocks ? mocksPathFilter : undefined,
      },
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    // Generate stats for bundle size analysis when
    // building locally
    production && !ci && visualizer(),
  ],
  watch: {
    clearScreen: false,
  },
}
