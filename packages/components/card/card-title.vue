<script setup lang="ts">
import { useNamespace } from '@simple-ui/hooks'

defineOptions({
  name: 'CardTitle',
})
const ns = useNamespace('card')
</script>

<template>
  <div :class="ns.bs('title')">
    <slot />
  </div>
</template>
