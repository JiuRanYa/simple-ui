<script setup lang="ts">
import { User } from '@simple-ui/icons'
</script>

<template>
  <Input>
    <template #after>
      <Label>Name</Label>
    </template>
    <template #prefix>
      <Icon :icon="User" />
    </template>
  </Input>
</template>
