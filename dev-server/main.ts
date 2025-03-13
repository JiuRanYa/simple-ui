import { createApp, ref } from 'vue'
import '@panda-ui/styles'
import { install } from '@panda-ui/components'
import './style.scss'
import { enUSLocale } from '@panda-ui/locale/lang/en-US'

Promise.all([import(`./router/port-${__PORT__}.ts`), import('./App.vue')]).then(
  ([{ router }, { default: App }]) => {
    createApp(App).use(install, { locale: ref(enUSLocale()) }).use(router).mount('#app')
  },
)
