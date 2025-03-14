import path, { resolve } from 'node:path'
import fs from 'fs-extra'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import cleanCss from 'gulp-clean-css'
import autoPrefixer from 'gulp-autoprefixer'
import { dest, parallel, series, src } from 'gulp'

const { existsSync, mkdirSync, emptyDir } = fs

const buildOutput = resolve(__dirname, 'dist')
const distCssBundle = path.resolve(buildOutput, 'simple-ui/css')
const cssDir = resolve(buildOutput, 'simple-ui/css')

function buildStyle() {
  ensureEmptyDir(cssDir)

  const sass = gulpSass(dartSass)

  return src(resolve(__dirname, 'packages/styles/**/*.scss'))
    .pipe(sass.sync())
    .pipe(autoPrefixer())
    .pipe(cleanCss())
    .pipe(dest(cssDir))
}

function ensureEmptyDir(dir: string) {
  existsSync(dir) ? emptyDir(dir) : mkdirSync(dir)
}

function copySassSource() {
  ensureEmptyDir(resolve(cssDir, 'src'))

  return src(path.resolve(__dirname, 'packages/styles/**')).pipe(
    dest(path.resolve(distCssBundle, 'src')),
  )
}

export default parallel(series(buildStyle, copySassSource))
