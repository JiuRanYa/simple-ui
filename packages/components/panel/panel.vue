<script setup lang="ts">
import { useNamespace } from '@simple-ui/hooks'
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { useProps } from '@simple-ui/common'
import { useUniqueId } from '../panel-group/utils'
import { panelGroupKey } from '../panel-group/token'
import type { PanelData } from './types'
import { panelProps } from './props'

defineOptions({
  name: 'Panel',
})

const _props = defineProps(panelProps)
const props = useProps('panel', _props, {
  defaultSizePercentage: _props.defaultSizePercentage,
  minSizePercentage: _props.minSizePercentage,
  maxSizePercentage: _props.maxSizePercentage,
  minGridCol: 3,
})
const panelId = useUniqueId()

const ns = useNamespace('panel')
const classNames = computed(() => {
  return [ns.b(), ns.bs('vars')]
})

const panelData = ref<PanelData>({
  panelId,
  constraints: {
    defaultSizePercentage: props.defaultSizePercentage,
    minSizePercentage: props.minSizePercentage ?? 0,
    maxSizePercentage: props.maxSizePercentage ?? 100,
    minGridCol: props.minGridCol ?? 3,
  },
})

const panelRoot = inject(panelGroupKey)!

const panelStyle = computed(() => {
  return panelRoot?.getPanelStyle(panelData)
})

onMounted(() => {
  panelRoot?.registerPanel(panelData)
})
</script>

<template>
  <div :class="classNames" :style="panelStyle" data-panel :data-panel-id="panelId">
    <slot />
  </div>
</template>
