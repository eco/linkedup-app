import fs from 'fs'
import path from 'path'
import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import visualizer from 'rollup-plugin-visualizer'
import json from 'rollup-plugin-json'
import sha256 from 'hash.js/lib/hash/sha/256'

const production = !process.env.ROLLUP_WATCH
const ci = !!process.env.CI

const generateConfig = (input, outputDir, livereloadPort) => {
  let cssName = 'main.css'

  return {
    input,
    output: {
      sourcemap: !production,
      format: 'esm',
      name: 'app',
      dir: outputDir,
      entryFileNames: production ? '[name]-[hash].js' : '[name].js',
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        // we'll extract any component CSS out into
        // a separate file — better for performance
        css: css => {
          if (production) {
            const hash = sha256()
            hash.update(css.code)
            const cssHash = hash.digest('hex').substr(0, 8)
            cssName = `main-${cssHash}.css`
          }
          css.write(path.join(outputDir, cssName))
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
      }),
      commonjs(),

      json(),

      // Watch the outputDir directory and refresh the
      // browser on changes when not in production
      !production &&
        livereload({
          watch: outputDir,
          port: livereloadPort,
        }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),

      // Generate stats for bundle size analysis when
      // building locally
      !ci &&
        production &&
        visualizer({ filename: path.join(outputDir, 'stats.html') }),

      {
        name: 'html-generate',
        generateBundle(config, data) {
          const main = Object.values(data).find(chunk => chunk.isEntry)
          const srcHtml = fs.readFileSync(path.join(outputDir, 'template.html'), 'utf-8')
          const html = srcHtml.replace('main.css', cssName).replace('main.js', main.fileName)
          fs.writeFileSync(path.join(outputDir, 'index.html'), html)
        },
      },
    ],
    watch: {
      clearScreen: false,
    },
  }
}

export default [
  generateConfig('src/main', 'public', 35729),
  generateConfig('src/standalone/redeem/main', 'public/s/redeem', 35730),
  generateConfig(
    'src/standalone/leaderboard/main',
    'public/s/leaderboard',
    35731
  ),
  generateConfig('src/standalone/export/main', 'public/s/export', 35732)
]
