
const fs = require('fs')
const path = require('path')
const render = require('stylus').render
const postcss = require('postcss')
const postcssModulesSync = require('postcss-modules-sync').default

module.exports = _ => ({
  pre: prepare,
  visitor: { TaggedTemplateExpression: transform }
})

function prepare (state) {
  const ROOT = this.opts.dest ? path.join(state.opts.root, this.opts.dest) : state.opts.root
  const DEST = path.join(ROOT, '.modules')
  const BUNDLE = path.join(DEST, 'bundle.styl')

  this.cache = new Map()
  this.cache.set('root', ROOT)
  this.cache.set('dest', DEST)
  this.cache.set('bundle', BUNDLE)

  if (fs.existsSync(BUNDLE)) return
  fs.mkdirSync(DEST, {recursive: true})
  fs.writeFileSync(BUNDLE, '@require "./**/*.css"', 'utf8')
}

function transform (el, state) {
  if (el.node.tag.name !== 'styl') return

  const raw = el.node.quasi.quasis[0].value.raw
    .split('\n')
    .filter(function(str) {
      return str !== '' && str.match(/^\s*$/g) === null
    })

  const indent = /^\s*/.exec(raw[0])[0]
  const fixed = raw
    .map(raw => raw.replace(new RegExp(`^${indent}`), ''))
    .join('\n')

  const filename = state.filename
  const rel = path.relative(this.cache.get('root'), path.dirname(filename))
  const file = path.join(this.cache.get('dest'), rel, path.parse(filename).name + '.css')

  let exportedTokens = {}
  const css = postcss([
    postcssModulesSync({getJSON: tokens => exportedTokens = tokens})
  ]).process(render(fixed)).css

  el.replaceWithSourceString(JSON.stringify(exportedTokens))
  fs.mkdirSync(path.dirname(file), {recursive: true})
  fs.writeFileSync(file, css, 'utf8')

  const bundle = this.cache.get('bundle')
  fs.writeFileSync(bundle, '@require "./**/*.css"', 'utf8')
}
