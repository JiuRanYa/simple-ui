<script setup lang="ts">
import { ref } from 'vue'

const value = ref('')

function handleChange() {
  console.log(value.value)
}
</script>

<template>
  <Input v-model:value="value" placeholder="Simple UI" @change="handleChange" />
</template>
