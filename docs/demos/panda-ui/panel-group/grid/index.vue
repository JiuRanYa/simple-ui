<script setup lang="ts">

</script>

<template>
  <div class="wrapper">
    <PanelGroup grid :grid-layout="[3, 4, 5]">
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
