<script setup lang="ts">
import { useNamespace } from '@simple-ui/hooks'
import { computed, inject, onMounted, reactive, ref, watch } from 'vue'
import { useUniqueId } from '../panel-group/utils'
import { panelGroupKey } from '../panel-group/token'

defineOptions({
  name: 'PanelResizeHandle',
})

const ns = useNamespace('panel-resize-handle')
const classNames = computed(() => {
  return [
    ns.b(),
    {
      [ns.be('dragging')]: isDragging.value,
    },
  ]
})
const resizeHandleId = useUniqueId()
const isDragging = computed(() => {
  return dragStates.value?.dragHandleId === resizeHandleId
})

const resizeHandleRef = ref<HTMLDivElement>()

const panelRoot = inject(panelGroupKey, undefined)
const dragStates = computed(() => panelRoot?.dragStates.value)
const groupId = computed(() => panelRoot?.groupId)

const previewStyle = reactive({
  top: '0px',
  left: '',
  opacity: 0,
})
function startDraggingInner(event: MouseEvent) {
  panelRoot?.startDragging(event, resizeHandleId)
}

function stopDraggingInner(event: MouseEvent) {
  panelRoot?.stopDragging(event, resizeHandleId)
}

function resizeHandleMouseEnter() {
  previewStyle.opacity = 1
}
const isVertical = computed(() => {
  return panelRoot?.groupProps.direction === 'vertical'
})
function resizeHandleMouseMove(e: MouseEvent) {
  if (isVertical.value)
    previewStyle.left = `${e.offsetX}px`
  else
    previewStyle.top = `${e.offsetY - 16}px`
}
function resizeHandleMouseLeave() {
  if (isDragging.value)
    return

  previewStyle.opacity = 0
}

let resizeHandler: any = null

function onMove(event: MouseEvent) {
  resizeHandler(event, resizeHandler)
  panelRoot?.groupProps?.onDragMove && panelRoot.groupProps.onDragMove(panelRoot.states)
}

/*
 * 应该监听拖拽情况再添加事件监听，即使会有频繁的事件监听和卸载，但避免了多个resize handle上重复添加事件

 * TODO: 这种方式可以优化为第一个resize handle组件再渲染时添加监听，后面所有的组件不进行监听
 */
watch(
  () => isDragging.value,
  () => {
    if (isDragging.value) {
      // document应该是节点自身的ownerDocument, 而不是window.document
      const document = resizeHandleRef.value?.ownerDocument

      document?.body.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', stopDraggingInner)
    }
    else {
      previewStyle.opacity = 0
      document?.body.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', stopDraggingInner)
      panelRoot?.groupProps?.onDragEnd && panelRoot.groupProps.onDragEnd(panelRoot.states)
    }
  },
)

// 监听 reset 事件
watch(() => panelRoot?.states.resizeHandleCount, (newCount, oldCount) => {
  if (newCount === 0 && oldCount > 0) {
    // 重新注册 ResizeHandle
    resizeHandler = panelRoot?.registerResizeHandler(resizeHandleId)
  }
})

onMounted(() => {
  resizeHandler = panelRoot?.registerResizeHandler(resizeHandleId)
})
</script>

<template>
  <div
    ref="resizeHandleRef"
    :class="classNames"
    data-panel-resize-handle
    :data-panel-resize-handle-id="resizeHandleId"
    :data-panel-group-id="groupId"
    @mouseenter="resizeHandleMouseEnter"
    @mouseleave="resizeHandleMouseLeave"
    @mousemove="resizeHandleMouseMove"
    @mousedown="startDraggingInner"
    @mouseup="stopDraggingInner"
  >
    <div :class="ns.bm('bar')" />
    <div :class="ns.bm('preview')" :style="previewStyle" />
  </div>
</template>
