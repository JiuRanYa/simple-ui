<script setup lang="ts">
import { ref } from 'vue'

const value = ref('emojiInput')
</script> 

<template>
  <Row :gap="[12, 24]">
    <Col :span="8">
      <InputEmoji size="large" placeholder="Large" type="edit"/>
    </Col>
    <Col :span="8">
      <InputEmoji v-model:value="value" placeholder="Middle" type="edit"/>
    </Col>
    <Col :span="8">
      <InputEmoji v-model:value="value" size="small" placeholder="Small" type="edit"/>
    </Col>
  </Row>
</template>
