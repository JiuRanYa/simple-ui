<script setup lang="ts">
import { ref } from 'vue'

const currentDate = ref()
</script>

<template>
  <DatePicker v-model:value="currentDate" type="dynamic" />

  <br>
  <br>

  绑定值: {{ currentDate }}
</template>
