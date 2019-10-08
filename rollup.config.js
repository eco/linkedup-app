import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

const thisPkg = require('./package')

const production = !process.env.ROLLUP_WATCH
const ci = !!process.env.CI
const sandbox = !!process.env.SANDBOX_MODE

export default {
  input: production ? 'src/main' : 'sandbox/main',
  output: {
    sourcemap: !production,
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
      preferBuiltins: true,
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/'),
      customResolveOptions: {
        pathFilter: (pkg, path, relativePath) => {
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

    builtins(),
    globals(),
    json(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    // Generate stats for bundle size analysis when
    // building locally
    !ci && production && visualizer(),


  ],
  watch: {
    clearScreen: false,
  },
}
