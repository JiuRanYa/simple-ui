export function getProjectLink(pro: string, link: string) {
  return `/projects/${pro}${link}`
}

export const navs: Record<string, any> = {
  'simple-ui': [
    {
      link: getProjectLink('simple-ui', '/guide/design'),
      text: '指南',
    },
    {
      link: getProjectLink('simple-ui', '/components/button'),
      text: '组件',
    },
    {
      link: getProjectLink('simple-ui', '/hooks/usePopper'),
      text: 'Hooks',
    },
    {
      link: getProjectLink('simple-ui', '/contribute/start'),
      text: '贡献',
    },
  ],
  'panda': [
    {
      link: getProjectLink('panda', '/guide/index'),
      text: '项目说明',
    },
    {
      link: getProjectLink('panda', '/standard/index'),
      text: '代码规范',
    },
  ],
  'raccoon': [
    {
      link: getProjectLink('raccoon', '/guide/index'),
      text: '使用指南',
    },
  ],
  'sso': [
    {
      link: getProjectLink('sso', '/guide/index'),
      text: '使用指南',
    },
  ],
}
function getNav() {
  // const project = getProject()
  //
  // if (navs[project.value]) {
  //   console.warn(`${project.value} nav config not exit, pls add config to nav.ts`)
  // }
  // return navs[project.value]
}

export const nav = getNav()
