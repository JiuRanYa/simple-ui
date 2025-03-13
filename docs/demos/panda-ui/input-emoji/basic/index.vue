<script setup lang="ts">
import { ref } from "vue";

const value =  ref<string>('测试标题')

function handleChange(modelValue: string) {
  console.log(modelValue)
}
</script>

<template>
  <InputEmoji v-model:value="value" @change="handleChange" style="width: 300px;"/>
</template>
