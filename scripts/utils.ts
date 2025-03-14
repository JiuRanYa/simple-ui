import { resolve } from 'node:path'
import { existsSync, lstatSync, readdirSync, rmdirSync, statSync, unlinkSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createServer } from 'node:net'
import { execa } from 'execa'
import { bgCyan, bgGreen, bgRed, bgYellow, cyan, green, lightBlue, red, yellow } from 'kolorist'
import prompts from 'prompts'

import type { Options } from 'execa'
import type { ParsedArgs } from 'minimist'
import type { Config } from 'prettier'

export const rootDir = resolve(fileURLToPath(import.meta.url), '../..')

export const prettierConfig: Config = {
  printWidth: 100,
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  bracketSameLine: false,
  quoteProps: 'as-needed',
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  vueIndentScriptAndStyle: false,
  overrides: [
    {
      files: '*.md',
      options: {
        embeddedLanguageFormatting: 'off',
      },
    },
  ],
}

type LogFn = () => void

export const logger = {
  ln: () => console.log(),
  withStartLn: (log: LogFn) => {
    logger.ln()
    log()
  },
  withEndLn: (log: LogFn) => {
    log()
    logger.ln()
  },
  withBothLn: (log: LogFn) => {
    logger.ln()
    log()
    logger.ln()
  },
  warning: (msg: string) => {
    console.warn(`${bgYellow(' WARNING ')} ${yellow(msg)}`)
  },
  info: (msg: string) => {
    console.log(`${bgCyan(' INFO ')} ${cyan(msg)}`)
  },
  success: (msg: string) => {
    console.log(`${bgGreen(' SUCCESS ')} ${green(msg)}`)
  },
  error: (msg: string) => {
    console.error(`${bgRed(' ERROR ')} ${red(msg)}`)
  },
  warningText: (msg: string) => {
    console.warn(`${yellow(msg)}`)
  },
  infoText: (msg: string) => {
    console.log(`${cyan(msg)}`)
  },
  successText: (msg: string) => {
    console.log(`${green(msg)}`)
  },
  errorText: (msg: string) => {
    console.error(`${red(msg)}`)
  },
}

export function bin(name: string) {
  return resolve(rootDir, `node_modules/.bin/${name}`)
}

export async function run(bin: string, args: string[], opts: Options = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts })
}

export async function dryRun(bin: string, args: string[], opts: Options = {}) {
  console.log(lightBlue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
}

function allCapital(value: string) {
  const matched = value.match(/[A-Z]+/)

  return matched && matched[0] === value
}

// 短横线命名
export function toKebabCase(value: string) {
  if (allCapital(value))
    return value.toLocaleLowerCase()

  return (
    value.charAt(0).toLowerCase()
    + value
      .slice(1)
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
  )
}

// 全大写命名
export function toCapitalCase(value: string) {
  return (
    value.charAt(0).toUpperCase()
    + value.slice(1).replace(/-([a-z])/g, (_, char) => (char ? char.toUpperCase() : ''))
  )
}

// 驼峰命名
export function toCamelCase(value: string) {
  const capitalName = toCapitalCase(value)

  if (allCapital(capitalName))
    return capitalName.toLocaleLowerCase()

  return capitalName.charAt(0).toLowerCase() + capitalName.slice(1)
}

export const hooksDir = resolve(rootDir, 'packages/hooks')
export const componentsDir = resolve(rootDir, 'packages/components')
export const iconDir = resolve(rootDir, 'docs/public/icon')
export const publicDir = resolve(rootDir, 'dist/simple-ui')

export const components = readdirSync(componentsDir).filter((f) => {
  const path = resolve(componentsDir, f)

  if (!statSync(path).isDirectory())
    return false

  return existsSync(`${path}/index.ts`)
})
export const hooks = readdirSync(hooksDir).filter((f) => {
  const path = resolve(hooksDir, f)

  if (!statSync(path).isDirectory())
    return false

  return existsSync(`${path}/index.ts`)
})

export function fuzzyMatch(partials: string[], total: string[], includeAll = false) {
  const matched: string[] = []

  partials.forEach((partial) => {
    for (const target of total) {
      if (target.match(partial)) {
        matched.push(target)

        if (!includeAll)
          break
      }
    }
  })

  return matched
}

export function fuzzyMatchComponent(
  partialComponents: string[],
  includeAll = false,
  allComponents = components,
) {
  const matched = fuzzyMatch(partialComponents, allComponents, includeAll)

  if (matched.length) {
    return matched
  }
  else {
    logger.withBothLn(() => logger.error(`Any component matches '${partialComponents}'!`))
    process.exit(1)
  }
}

export async function specifyComponent(
  args: ParsedArgs,
  allComponents = components,
  required = true,
) {
  const matchedComponents = args._.length ? fuzzyMatchComponent(args._, true, allComponents) : ['']

  let component: string

  if (matchedComponents.length > 1 || !matchedComponents[0]) {
    component = (
      await prompts({
        type: 'select',
        name: 'component',
        message: 'Select a component:',
        choices: (matchedComponents.length > 1 ? matchedComponents : allComponents).map(name => ({
          title: name,
          value: name,
        })),
      })
    ).component
  }
  else {
    component = matchedComponents[0] || ''
  }

  if (!component && required) {
    logger.withStartLn(() => logger.error('Component must be specified.'))
    process.exit(1)
  }

  return component
}

export async function runParallel<T>(
  maxConcurrency: number,
  source: T[],
  iteratorFn: (item: T, source: T[]) => Promise<any>,
) {
  const ret: Array<Promise<any>> = []
  const executing: Array<Promise<any>> = []

  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item, source))

    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e: Promise<any> = p.then(() => executing.splice(executing.indexOf(e), 1))

      executing.push(e)

      if (executing.length >= maxConcurrency)
        await Promise.race(executing)
    }
  }

  return Promise.all(ret)
}

export function emptyDir(dir: string) {
  if (!existsSync(dir))
    return

  for (const file of readdirSync(dir)) {
    const abs = resolve(dir, file)

    if (lstatSync(abs).isDirectory()) {
      emptyDir(abs)
      rmdirSync(abs)
    }
    else {
      unlinkSync(abs)
    }
  }
}
export function queryIdlePort(startPort: number, host = 'localhost', maxTry = 20) {
  const server = createServer()

  return new Promise<number>((resolve, reject) => {
    const onError = (error: Error & { code?: string }) => {
      if (error.code === 'EADDRINUSE') {
        if (maxTry-- <= 0)
          close()

        server.listen(++startPort, host)
      }
      else {
        close()
        reject(error)
      }
    }

    const close = () => {
      server.off('error', onError)
      server.close()
    }

    server.on('error', onError)
    server.listen(startPort, host, () => {
      close()
      resolve(startPort)
    })
  })
}

export function mkDirAndFile(_path: string) {
  // const compose = path.split('/')

  // compose.reduce((cur, path) => {
  //   console.log(cur)
  // }, compose[1])
}
