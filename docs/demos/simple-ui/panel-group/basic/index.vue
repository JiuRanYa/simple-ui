<script setup lang="ts">
import { ref } from 'vue'

function handleDrag(e: MouseEvent) {
  console.log(e)
}

const layout = ref([25, 25, 25, 25])
const panelGroupRef = ref()
</script>

<template>
  <div class="wrapper">
    <PanelGroup :layout="layout" :onDragEnd="handleDrag" ref="panelGroupRef">
      <Panel>
        <div class="inner">
          1
        </div>
      </Panel>
      <PanelResizeHandle />
      <Panel>
        <div class="inner">
          1
        </div>
      </Panel>
      <PanelResizeHandle />
      <Panel>
        <div class="inner">
          2
        </div>
      </Panel>
      <PanelResizeHandle />
      <Panel>
        <div class="inner">
          3
        </div>
      </Panel>
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
  border-radius: 12px;
}
</style>
