<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'

const value = ref('')

const instance = ref()

onMounted(() => {
  nextTick(() => {
    instance.value?.inputRef?.focus()
  })
})
</script>

<template>
  <Input ref="instance" v-model:value="value" placeholder="Simple UI" />

  <br>
  <br>

  Input value : {{ value }}
</template>
