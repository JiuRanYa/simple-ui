<script setup lang="ts">
import { ref } from "vue";
import { CopyM, Trash } from '@simple-ui/icons'

const value = ref<string>('copy/clear slot')

function handleChange(modelValue: string) {
  console.log(modelValue)
}
</script>

<template>
  <InputEmoji v-model:value="value" @change="handleChange">
    <template #copy>
      <Icon :icon="CopyM" />
    </template>
    <template #clear>
      <Icon :icon="Trash" />
    </template>
  </InputEmoji>
</template>
