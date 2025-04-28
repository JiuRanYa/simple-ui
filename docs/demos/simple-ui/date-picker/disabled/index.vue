<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'

const currentDate = ref(dayjs())
</script>

<template>
  <DatePicker v-model:value="currentDate" :disabledDate="[dayjs(), Number.POSITIVE_INFINITY]" />

  <br>
  <br>

  绑定值: {{ currentDate }}
</template>
