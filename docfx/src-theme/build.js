// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

const esbuild = require('esbuild')
const { sassPlugin } = require('esbuild-sass-plugin')
const bs = require('browser-sync')
const { cpSync, rmSync } = require('fs')
const { join } = require('path')
const { spawnSync } = require('child_process')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

const watch = argv.watch
const project = argv.project || '..\\'
const distdir = '../templates'

const loader = {
  '.eot': 'file',
  '.svg': 'file',
  '.ttf': 'file',
  '.woff': 'file',
  '.woff2': 'file'
}

build()

async function build() {

  await Promise.all([buildModernTemplate()])

  copyToDist()

  if (watch) {
    serve()
  }
}

async function buildModernTemplate() {
  const config = {
    bundle: true,
    format: 'esm',
    splitting: true,
    minify: true,
    sourcemap: true,
    outExtension: {
      '.css': '.min.css',
      '.js': '.min.js'
    },
    outdir: 'modern-script-samples/public',
    entryPoints: [
      'modern-script-samples/src/docfx.ts',
      'modern-script-samples/src/search-worker.ts',
    ],
    external: [
      './main.js'
    ],
    plugins: [
      sassPlugin()
    ],
    loader,
  }

  if (watch) {
    const context = await esbuild.context(config)
    await context.watch()
  } else {
    await esbuild.build(config)
  }
}

function copyToDist() {

  rmSync(join(distdir, 'modern-script-samples'), { recursive: true, force: true })

  cpSync('modern-script-samples', join(distdir, 'modern-script-samples'), { recursive: true, overwrite: true, filter })

  function filter(src) {
    const segments = src.split(/[/\\]/)
    return !segments.includes('node_modules') && !segments.includes('package-lock.json') && !segments.includes('src')
  }
}

function buildContent() {
  // TODO: Remove the fixed paths
  exec(`D:\\docfx\\2.78.3\\docfx build D:\\contrib\\pkb-script-samples\\docfx\\docfx.json`)

  function exec(cmd) {
    if (spawnSync(cmd, { stdio: 'inherit', shell: true }).status !== 0) {
      throw Error(`exec error: '${cmd}'`)
    }
  }
}

function serve() {
  buildContent()

  return bs.create('docfx').init({
    open: true,
    startPath: '/test',
    files: [
      'modern-script-samples/public/**',
      join(project, '_site', '**')
    ],
    server: {
      routes: {
        '/test/public/main.js': join(project, '_site', 'public', 'main.js'),
        '/test/public': 'modern-script-samples/public',
        '/test': join(project, '_site')
      }
    }
  })
}
