<template>
  <Dropdown>
    <Button type="primary">
      测试
    </Button>
    <template #drop>
      <Dropdown trigger="hover">
        <div class="card p-2">
          <div class="option" @mouseenter="info = '选项1'">
            选项1
          </div>
          <div class="option" @mouseenter="info = '选项2'">
            选项2
          </div>
          <div class="option" @mouseenter="info = '选项3'">
            选项3
          </div>
        </div>

        <template #drop>
          <div class="panel card">
            {{ info }}
          </div>
        </template>
      </Dropdown>
    </template>
  </Dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const info = ref('')
</script>
<style scoped>  
.card {
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #f3f3f3;
}
.p-2 {
  padding: 10px;
}
.option {
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
}
.panel {
    min-width: 200px;
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>