import fs from 'node:fs'
import prompts from 'prompts'
import type { Project } from '@pnpm/find-workspace-packages'
import { projRoot } from '@simple-ui/internal'
import findWorkspacePackages from '@pnpm/find-workspace-packages'
import { run } from './utils'

const versionChoices = ['patch', 'minor', 'major']
const publicDir = 'dist/simple-ui'

export const getWorkspacePackages = () => findWorkspacePackages(projRoot)

async function main() {
  const semm = await queryVersion()

  try {
    await run('npm', ['version', semm])
    await run('git', ['push'], {
      env: process.env,
    })

    // update version
    const packagejson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    const version = packagejson.version

    const writeVersion = async (project: Project) => {
      await project.writeProjectManifest({
        ...project.manifest,
        version,
      } as any)
    }
    const pkgs = Object.fromEntries(
      (await getWorkspacePackages()).map(pkg => [pkg.manifest.name!, pkg]),
    )
    const pandaUI = pkgs['simple-ui']

    await writeVersion(pandaUI)

    await run('pnpm', ['build'], {})
    await run('git', ['add', '.'], {})
    await run('git', ['commit', '-m', `v${version}: release new version`], {})
    await run('git', ['push'], {
      env: process.env,
    })

    const publicArgs = [
      'publish',
      '--registry',
      'http://34.219.210.151:8212/',
      '--access',
      'public',
    ]

    await run('npm', publicArgs, {
      cwd: publicDir,
    })
  }
  catch {
    await run('git', ['revert', 'HEAD'], {})
    await run('git', ['push'], {
      env: process.env,
    })
  }
}

async function queryVersion() {
  const version = (
    await prompts(
      {
        type: 'autocomplete',
        name: 'version',
        message: 'Which semantic version you want:',
        choices: versionChoices.map(comp => ({
          title: comp,
          value: comp,
        })),
        onState(this: any) {
          this.fallback = { title: this.input, value: this.input }

          if (this.suggestions.length === 0)
            this.value = this.fallback.value
        },
      },
      {
        onCancel: () => {
          console.log('Canceled by user, exiting...')
          process.exit(1)
        },
      },
    )
  ).version

  return version
}
main()
