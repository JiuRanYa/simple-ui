<script setup lang="ts">
import { AngleRight } from '@simple-ui/icons'
</script>

<template>
  <Dropdown trigger="click">
    <Button type="primary">
      嵌套使用
    </Button>
    <template #drop>
      <DropdownList>
        <DropdownItem>选项一</DropdownItem>
        <DropdownItem>选项二</DropdownItem>
        <Dropdown trigger="hover">
          <DropdownItem>
            选项三
            <Icon
              :scale="0.8"
              style="position: relative; inset-inline-start: 6px; margin-right: 6px"
            >
              <AngleRight />
            </Icon>
          </DropdownItem>
          <template #drop>
            <DropdownList>
              <DropdownItem>子选项一</DropdownItem>
              <DropdownItem disabled>
                子选项二
              </DropdownItem>
              <DropdownItem>子选项三</DropdownItem>
            </DropdownList>
          </template>
        </Dropdown>
        <DropdownItem>选项四</DropdownItem>
      </DropdownList>
    </template>
  </Dropdown>
</template>
