<script setup lang="ts">
import PanelGroup from '@panda-ui/components/panel-group/panel-group.vue';
import Panel from '@panda-ui/components/panel/panel.vue';
import PanelResizeHandle from '@panda-ui/components/panel-resize-handle/panel-resize-handle.vue';
import { ref } from 'vue'


const panelData = ref([
  {
    content: 1,
  },
  {
    content: 2,
  },
  {
    content: 3,
  },
])

const handleDragStart = (e: any) => {
  const panel = e.target.closest('.handle')
  if (panel) {
    panel.classList.add('dragging')
  }
}

const handleDragOver = (e: any) => {
  e.preventDefault()
  const draggingPanel = document.querySelector('.dragging')
  const panel = e.target.closest('.handle')

  if (draggingPanel && panel && draggingPanel !== panel) {
    const panels = Array.from(document.querySelectorAll('.handle'))
    const dragIndex = panels.indexOf(draggingPanel)
    const dropIndex = panels.indexOf(panel)

    if (dragIndex !== -1 && dropIndex !== -1) {
      const newPanelData = [...panelData.value]
      const [removed] = newPanelData.splice(dragIndex, 1)
      newPanelData.splice(dropIndex, 0, removed)
      panelData.value = newPanelData
    }
  }
}

const panelGroupRef = ref()

const handleDragEnd = (e: any) => {
  const panel = e.target.closest('.handle')
  if (panel) {
    panel.classList.remove('dragging')
  }
  panelGroupRef.value?.reset()
}
</script>

<template>
  <div class="wrapper">
    <PanelGroup ref="panelGroupRef" id="panel-group" grid @dragstart="handleDragStart" @dragover="handleDragOver" @dragend="handleDragEnd">
      <template v-for="(i, idx) in panelData" :key="i.content">
        <Panel class="handle" draggable="true">
          <div class="inner">
            {{ i.content }}
          </div>
        </Panel>
        <PanelResizeHandle v-if="idx < panelData.length - 1" />
      </template>
    </PanelGroup>

  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 200px;
}

.inner {
  background: var(--bl-color-secondary-base);
  color: var(--bl-color-primary-base);
  flex: auto;
  font-size: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
}

.handle {
  cursor: move;

  &.dragging {
    opacity: 0.5;
  }
}

:deep(.panel-resize-handle) {
  width: 4px;
  background: var(--bl-color-primary-base);
  cursor: col-resize;

  &:hover {
    background: var(--bl-color-primary-dark);
  }
}
</style>
