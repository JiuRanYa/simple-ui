import { resolve } from 'node:path'

export const projRoot = resolve(__dirname, '../../../')
export const pkgRoot = resolve(projRoot, 'packages')
export const blRoot = resolve(pkgRoot, 'simple-ui')
export const buildOutput = resolve(projRoot, 'dist')
export const blOutput = resolve(buildOutput, 'simple-ui')
export const docRoot = resolve(projRoot, './docs')
export const blPackage = resolve(blRoot, 'package.json')
export const vpRoot = resolve(docRoot, '.vitepress')

export function excludeFiles(files: string[]) {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
  return files.filter(path => !excludes.some(exclude => path.includes(exclude)))
}
