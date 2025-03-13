<script setup lang="ts">
import { ref } from "vue";

const value = ref<string>('传递默认emoji')

function handleChange(modelValue: string) {
  console.log(modelValue)
}
</script>

<template>
  <InputEmoji v-model:value="value" @change="handleChange" default-emoji="🌍"/>
</template>
