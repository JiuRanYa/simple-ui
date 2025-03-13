<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@simple-ui/hooks'

defineOptions({
  name: 'DropdownList',
})

const ns = useNamespace('dropdown-list')

const className = computed(() => {
  return [ns.b()]
})
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
