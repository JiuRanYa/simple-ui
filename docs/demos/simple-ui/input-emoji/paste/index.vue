<script setup lang="ts">
import { ref } from "vue";

//假如这个value是要粘贴的文本，即使组件传递了defaultEmoji参数，默认emoji也会被替换为“😇”
const value = ref<string>('😇paste替换emoji')

function handleChange(modelValue: string) {
  console.log(modelValue)
}
</script>

<template>
  <InputEmoji v-model:value="value" @change="handleChange" default-emoji="🌍"/>
</template>
