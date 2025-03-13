<script setup lang="ts">
import { ref } from 'vue';

const options = [
  { value: '1', label: '选项1' },
  { value: '2', label: '选项2' },
  { value: '3', label: '选项3' },
]
const value = ref('1')
</script>

<template>
  <Select v-model:value="value" :options="options" disabled placeholder="禁用状态" />
</template>

<style lang="scss" scoped>
.bl-select {
  width: 200px;
}
</style>