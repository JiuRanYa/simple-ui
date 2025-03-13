<script setup lang="ts">
const options = [
  {
    label: '选项1',
    value: '1',
  },
  {
    label: '选项2',
    value: '2',
    children: [
      {
        label: '选项2-1',
        value: '2-1',
      },
      {
        label: '选项2-2',
        value: '2-2',
      },
    ],
  },
  {
    label: '选项3',
    value: '3',
  },
  {
    label: '选项4',
    value: '4',
  },
  {
    label: '选项5',
    value: '5',
  },
]
</script>

<template>
  <div class="container">
    <Cascader :options="options" size="small" placeholder="Small" />
    <Cascader :options="options" size="middle" placeholder="Middle" />
    <Cascader :options="options" size="large" placeholder="Large" />
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  gap: 10px;
}

.bl-cascader {
  width: 400px;
}
</style>
