<script setup lang="ts">
import { computed, provide, reactive, watch } from 'vue'
import { useProps } from '@simple-ui/common'
import { useClickOutside, useNamespace } from '@simple-ui/hooks'
import { ChevronDown, Xmark } from '@simple-ui/icons'
import { Popper } from '../popper'
import { Option } from '../option'
import { Icon } from '../icon'
import { ScrollArea } from '../scroll-area'
import { selectKey } from './token'
import { useSelect } from './useSelect'
import { selectProps } from './props'

defineOptions({
  name: 'Select',
})

const _props = defineProps(selectProps)

const emit = defineEmits(['update:value', 'update:visible'])

const props = useProps('select', _props, {
  value: null,
  visible: false,
  transitionName: () => ns.ns('drop'),
  listClass: [],
  fitPopper: true,
  popperAlive: null,
  options: {
    default: () => [],
    static: true,
  },
  placement: 'bottom-start',
  to: null,
  size: 'middle',
  multiple: false,
  filterable: false,
  creatable: false,
  clearable: false,
  disabled: false,
})

const ns = useNamespace('select')
const {
  input,
  wrapper,
  popper,
  popperEl,
  transferTo,
  reference,

  states,
  setVisible,
  showClearIcon,
  onInput,
  filteredOptions,
  onKeyboardUp,
  updatePopper,
  onKeyboardDown,
  onKeyboardSelect,
  onKeyboardDelete,
  handleOptionClick,
  handleClickOutSide,
  handleClearEmitValue,
  isSelected,
} = useSelect(props, emit)

const className = computed(() => {
  return {
    [ns.b()]: true,
    [ns.bs('vars')]: true,
    [ns.bm(props.size)]: true,
    [ns.bm('inherit')]: props.inherit,
    [ns.bm('disabled')]: props.disabled,
  }
})
const selectorClass = computed(() => {
  return [
    ns.be('selector'),
    {
      [ns.bem('selector', 'focused')]: states.currentVisible,
    },
  ]
})

function showListPanel() {
  if (props.disabled)
    return
  setVisible(!states.currentVisible)
}
function fitPopperWidth() {
  requestAnimationFrame(() => {
    updatePopper()
    if (wrapper.value && popper.value?.wrapper) {
      if (typeof props.fitPopper === 'number')
        popper.value.wrapper.style.width = `${props.fitPopper}px`
      else if (props.fitPopper)
        popper.value.wrapper.style.width = `${wrapper.value.offsetWidth}px`
      else
        popper.value.wrapper.style.minWidth = `${wrapper.value.offsetWidth}px`
    }
  })
}

watch(
  () => states.currentVisible,
  (value) => {
    if (value)
      fitPopperWidth()
  },
  {
    immediate: true,
  },
)

provide(
  selectKey,
  reactive({
    props,
    states,
  }),
)
useClickOutside(handleClickOutSide, { ignore: [popperEl] }, reference)
</script>

<template>
  <div ref="wrapper" :class="className" @click="showListPanel">
    <div ref="reference" :class="selectorClass" tabindex="0">
      <div :class="ns.be('control')">
        <input
          v-if="props.creatable || props.filterable"
          ref="input"
          v-model="states.inputValue"
          :disabled="props.disabled"
          :readonly="!props.filterable"
          :placeholder="states.selectedLabel"
          :class="ns.be('input')"
          @input="onInput"
          @keydown.delete.stop="onKeyboardDelete"
          @keydown.up.stop.prevent="onKeyboardUp"
          @keydown.down.stop.prevent="onKeyboardDown"
          @keydown.enter.stop.prevent="onKeyboardSelect"
        >
        <slot v-else-if="$slots.placeholder" name="placeholder" />
        <span v-else :class="ns.be('placeholder')">
          {{ states.selectedLabel }}
        </span>
      </div>
      <div :class="[ns.be('icon'), ns.be('suffix')]">
        <Icon
          :icon="ChevronDown"
          :class="ns.be('arrow')"
          :style="{ opacity: showClearIcon ? '0%' : '' }"
        />
        <Transition name="fade-in">
          <Icon
            v-if="showClearIcon"
            :icon="Xmark"
            :scale="1.1"
            :class="ns.be('clear')"
            @click.stop="handleClearEmitValue"
          />
        </Transition>
      </div>
    </div>
    <Popper
      ref="popper"
      :to="transferTo"
      :alive="props.popperAlive ?? !transferTo"
      :visible="states.currentVisible"
      :transition="props.transitionName"
      :class="[ns.be('popper'), ns.bs('vars'), ns.bm('popper')]"
      @click.stop
    >
      <div :class="ns.be('wrapper')">
        <ScrollArea max-height="200px" :style="{ width: '100%' }">
          <div :class="[ns.be('list'), props.listClass]" style="height: 100%">
            <slot v-if="$slots.prepend" name="prepend" />
            <Option
              v-for="(option, idx) in filteredOptions"
              :key="idx"
              :index="idx"
              :label="option.label"
              :value="option.value"
              :selected="isSelected(option)"
              @click="handleOptionClick(option)"
            >
              <slot
                name="option"
                :option="option"
                :index="idx"
                :is-selected="isSelected(option)"
              />
            </Option>
            <slot v-if="$slots.empty" name="empty" />
            <div v-else-if="!filteredOptions?.length" :class="ns.bm('empty')">
              暂无数据
            </div>

            <slot v-if="$slots.append" name="append" />
          </div>
        </ScrollArea>
      </div>
    </Popper>
  </div>
</template>
