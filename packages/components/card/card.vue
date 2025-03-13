<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@simple-ui/hooks'

defineOptions({
  name: 'Card',
})

const ns = useNamespace('card')
const className = computed(() => {
  return [ns.b()]
})
</script>

<template>
  <div :class="className">
    <slot />
  </div>
</template>
