<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@simple-ui/hooks'

defineOptions({
  name: 'DropdownItem',
})

const ns = useNamespace('dropdown-item')

const className = computed(() => {
  return [ns.b()]
})
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
