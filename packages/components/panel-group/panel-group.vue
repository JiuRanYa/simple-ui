<script setup lang="ts">
import { computed, inject, nextTick, provide } from 'vue'
import { useNamespace } from '@panda-ui/hooks'
import { useProps } from '@panda-ui/common'
import { panelGroupKey } from './token'
import { panelGroupProps } from './props'
import { useSplit } from './useSplit'
import { useUniqueId } from './utils'

defineOptions({
  name: 'PanelGroup',
})

const _props = defineProps(panelGroupProps)
const emit = defineEmits(['reset'])
const ns = useNamespace('panel-group')
const props = useProps('panel-group', _props, {
  direction: 'horizontal',
  grid: false,
  gridLayout: undefined,
  onDragEnd: () => null,
  onDragMove: () => null,
  showPreviewDot: true,
})

const parentState = inject(panelGroupKey, null)
const isNested = !!parentState

const groupId = useUniqueId()

const classNames = computed(() => {
  return [ns.b(), ns.bs('vars'), ns.bs(props.direction), {
    [ns.bs('nested')]: isNested,
  }]
})

const splitPanesStyle = computed(() => {
  return {}
})

// // 改为使用 computed 而不是 ref + onMounted
// const processedChildren = computed(() => {
//   return processChildren()
// })

const {
  states,
  caculateGridColToFlexGrowMap,
  caculateDefaultLayout,
  registerResizeHandler,
  getPanelStyle,
  registerPanel,
  startDragging,
  stopDragging,
  container,
  dragStates,
} = useSplit(props, groupId)

function reset() {
  states.resizeHandleCount = 0
  const newPanelDataArray: any[] = []
  const newLayout: any[] = []

  // 根据当前 DOM 顺序重排 panelDataArray和layout
  nextTick(() => {
    const panelGroup = document.querySelector(`[data-panel-group-id="${groupId}"]`)
    const panels = panelGroup?.querySelectorAll('[data-panel]') || []
    const layoutLen = states.layout.length

    panels.forEach((panel: any) => {
      const panelId = panel.getAttribute('data-panel-id')

      const existingPanelData = states.panelDataArray.find(
        p => p.value.panelId === panelId,
      )
      if (existingPanelData) {
        newPanelDataArray.push(existingPanelData)
        const oldIndex = states.panelDataArray.indexOf(existingPanelData)
        newLayout.push(states.layout[oldIndex])
      }
    })
    states.panelDataArray = newPanelDataArray
    states.layout = newLayout

    // 如果面板数量小于布局数量，则重新计算布局
    if (panels.length < layoutLen) {
      caculateGridColToFlexGrowMap()
      states.layout = caculateDefaultLayout()
    }
  })

  emit('reset')
}

// 暴露 reset 方法
defineExpose({
  reset,
  groupId,
  states,
})

provide(panelGroupKey, {
  states,
  groupProps: props,
  groupId,
  dragStates,
  registerPanel,
  getPanelStyle,
  startDragging,
  registerResizeHandler,
  stopDragging,
  reset, // 提供给子组件
})

// function processChildren() {
//   const children = slots.default?.() || [] as any[]
//   const result: any[] = []

//   // 展平可能的嵌套子节点（处理 v-for 的情况）
//   const flattenChildren = children.reduce((acc, child) => {
//     // 处理 v-for 生成的子节点数组
//     if (Array.isArray(child.children))
//       return acc.concat(child.children)

//     return acc.concat(child)
//   }, [])

//   // 找出所有的 Panel 组件
//   const panels = flattenChildren.filter(child =>
//     child.type?.name === 'Panel'
//     || child.type?.__name === 'Panel',
//   )

//   flattenChildren.forEach((child, index) => {
//     const isPanel = child.type?.name === 'Panel' || child.type?.__name === 'Panel'
//     const isResizeHandle = child.type?.name === 'PanelResizeHandle'

//     if (isPanel) {
//       result.push(child)

//       // 如果不是最后一个 Panel 且下一个元素不是 ResizeHandle，则添加 ResizeHandle
//       const isLastPanel = index === panels.length - 1
//       const nextChild = flattenChildren[index + 1]
//       const nextIsResizeHandle = nextChild?.type?.name === 'PanelResizeHandle'

//       if (!isLastPanel && !nextIsResizeHandle)
//         result.push(h(PanelResizeHandle))
//     }
//     else if (isResizeHandle) {
//       result.push(child)
//     }
//   })

//   return result
// }
</script>

<template>
  <div
    ref="container"
    :class="classNames"
    :style="splitPanesStyle"
    data-panel-group
    :data-panel-group-id="groupId"
  >
    <slot />

    <div v-if="props.grid && states.showPreviewDots && props.showPreviewDot" :class="ns.be('preview')">
      <div v-for="i in 12" :key="i" :class="ns.be('preview-box')">
        <div
          v-if="i - 1 >= states.previewDots[0] && i - 1 <= states.previewDots[1]"
          :class="ns.be('preview-dot')"
        />
      </div>
    </div>
  </div>
</template>
