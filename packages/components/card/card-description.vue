<script setup lang="ts">
import { useNamespace } from '@simple-ui/hooks'

defineOptions({
  name: 'CardDescription',
})
const ns = useNamespace('card')
</script>

<template>
  <div :class="ns.bs('description')">
    <slot />
  </div>
</template>
