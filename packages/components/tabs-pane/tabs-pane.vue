<script setup lang="ts">
import { useNamespace } from '@simple-ui/hooks'
import { computed, inject } from 'vue'
import { useProps } from '@simple-ui/common'
import { tabsContextKey } from '../tabs/token'
import { tabsPaneProps } from './props'

defineOptions({
  name: 'TabsPane',
})

const _props = defineProps(tabsPaneProps)
const props = useProps('tabs-pane', _props, {
  value: '',
})
const ns = useNamespace('tabs-pane')

const paneName = computed(() => props.value)
const classNames = computed(() => {
  return [ns.b(), ns.bs('vars')]
})
const active = computed(() => {
  return props.value === tabsRoot?.props.value
})

const tabsRoot = inject(tabsContextKey)
</script>

<template>
  <div
    v-show="active"
    :id="`pane-${paneName}`"
    :class="classNames"
    role="tabpanel"
    :aria-hidden="!active"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot />
  </div>
</template>
