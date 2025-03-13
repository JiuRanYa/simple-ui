<script setup lang="ts">
import { User } from '@simple-ui/icons'
</script>

<template>
  <Input>
    <template #suffix>
      <Icon :icon="User" />
    </template>
  </Input>
</template>
