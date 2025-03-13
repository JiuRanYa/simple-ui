import type { App } from 'vue'
import type { IconsOptions, MaybeRef } from '@simple-ui/common'
import { configIcons, configProps, configZIndex, isNumber, toCapitalCase } from '@simple-ui/common'
import { configLocale } from '@simple-ui/common/config/locale'
import type { LocaleOptions } from '@simple-ui/common/config/locale/types'
import { defaultLocale } from '@simple-ui/locale'
import type { PropsOptions } from './props'

export interface InstallConfig {
  props?: PropsOptions
  prefix?: string
  zIndex?: number
  icons?: MaybeRef<IconsOptions>
  locale?: MaybeRef<LocaleOptions>
}

export function buildInstall(components: any[] = []) {
  return function install(app: App, options: InstallConfig = {}) {
    const { props = {}, prefix = '', zIndex = 2000, icons = {}, locale = defaultLocale } = options

    configProps(props, app)
    configIcons(icons as IconsOptions, app)
    configLocale(locale, app)

    if (isNumber(zIndex))
      configZIndex(zIndex, app)

    const normallizedPrefix = toCapitalCase(prefix || '')

    components.forEach((component) => {
      if (typeof component === 'function' || typeof component.install === 'function')
        app.use(component)
      else
        app.component(`${normallizedPrefix}${component.name}`, component)
    })
  }
}
