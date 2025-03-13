<script setup lang="ts">
import { ref } from "vue";

const value = ref<string>('auto自动模式')
const value2 = ref<string>('edit编辑模式')
const value3 = ref<string>('show预览模式')

function handleChange(modelValue: string) {
  console.log(modelValue)
}
</script>

<template>
  <Row :gap="[12, 24]">
    <Col :span="8">
      <InputEmoji v-model:value="value" type="auto" @change="handleChange"/>
    </Col>
    <Col :span="8">
      <InputEmoji v-model:value="value2" type="edit" @change="handleChange"/>
    </Col>
    <Col :span="8">
      <InputEmoji v-model:value="value3" type="show" @change="handleChange"/>
    </Col>
  </Row>
</template>

<style lang="scss" scoped>
.bl-input-emoji {
  width: 400px;
}
</style>  
