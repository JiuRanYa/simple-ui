import { createApp, ref } from 'vue'
import '@simple-ui/styles'
import { install } from '@simple-ui/components'
import './style.scss'
import { enUSLocale } from '@simple-ui/locale/lang/en-US'

Promise.all([import(`./router/port-${__PORT__}.ts`), import('./App.vue')]).then(
  ([{ router }, { default: App }]) => {
    createApp(App).use(install, { locale: ref(enUSLocale()) }).use(router).mount('#app')
  },
)
