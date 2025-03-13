<script setup lang="ts">
import { EmojiPicker, Icon, Message } from '@panda-ui/components'
import { emitEvent, useLocale, useProps } from '@panda-ui/common'
import { useClickOutside, useNamespace } from '@panda-ui/hooks'
import { Copy, X } from '@panda-ui/icons'
import { computed, defineProps, nextTick, ref, toRef, watch } from 'vue'
import type { Emoji } from '@panda-ui/components/emoji-picker/props'
import { emojiRegex } from './regex'
import { inputEmojiProps } from './props'

defineOptions({
  name: 'InputEmoji',
})

const _props = defineProps(inputEmojiProps)
const emit = defineEmits(['update:value'])
const props = useProps('inputEmoji', _props, {})

const ns = useNamespace('input-emoji')

const isEditing = ref<boolean>(false)

const classByPropsType = computed(() => {
  if (props.type === 'edit')
    return ['editing', 'always']

  if (props.type === 'show')
    return ['show', 'always']

  return [isEditing.value ? 'editing' : 'show']
})

const classNames = computed(() => {
  return Array.from(new Set([
    ns.b(),
    ns.bs('vars'),
    ns.bm(props.size),
    ...classByPropsType.value,
  ]))
})

const inputClass = computed(() => {
  return [
    ns.be('input'),
    isEditing.value ? 'editable' : 'readonly',
    isEditing.value || inputVal.value.trim().length ? '' : props.placeholderClass,
  ]
})

const reference = ref()
const inputRef = ref()
const emojiVal = ref<string>('')
const inputVal = ref<string>('')

const locale = useLocale('inputEmoji', toRef(props, 'locale'))

watch(
  () => props.value,
  (val: string) => {
    parseInputValue(val)
  },
  { immediate: true },
)

async function moveCursorPos(toStart: boolean = true) {
  await nextTick()

  const el = inputRef.value as HTMLElement
  const range = document.createRange()
  const sel = window.getSelection()

  range.selectNodeContents(el)
  range.collapse(toStart)
  sel?.removeAllRanges()
  sel?.addRange(range)
}

async function parseInputValue(str: string) {
  const regex = emojiRegex()
  const matches = [...str.matchAll(regex)]
  if (matches.length && matches[0].index === 0) {
    const emoji = matches[0][0]
    emojiVal.value = emoji
    inputVal.value = str.slice(emoji.length)
  }
  else {
    inputVal.value = str
  }
}

function handlePaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasteText = event.clipboardData?.getData('text') || ''
  parseInputValue(pasteText.trim().replace(/\r?\n|\r/g, ' ').trim())

  moveCursorPos(false)
}

function handleSelect(selected: Emoji) {
  emojiVal.value = selected.parsed!
}

async function copyToClipboard() {
  const _value = emojiVal.value + inputVal.value
  await navigator.clipboard.writeText(_value)
  Message({ message: locale.value?.copy, type: 'success' })
}

function clear() {
  inputRef.value.textContent = ''
  inputVal.value = ''
  emojiVal.value = ''
}

function enterEditMode() {
  if (props.type === 'show')
    return

  isEditing.value = true
}

function exitEditMode() {
  if (!isEditing.value)
    return

  isEditing.value = false

  inputVal.value = inputRef.value.textContent.trim()

  const _value = emojiVal.value + inputVal.value
  if (_value !== props.value) {
    emit('update:value', _value)
    emitEvent(props.onChange, _value)
  }
}

function handleInput(event: Event) {
  emitEvent(props.onInput, emojiVal.value + inputVal.value, event)
}

useClickOutside(exitEditMode, {}, reference)

watch(() => isEditing.value, async (bool: boolean) => {
  moveCursorPos(!bool)
})
</script>

<template>
  <div
    ref="reference"
    :class="classNames"
    @click="enterEditMode"
  >
    <template v-if="props.type === 'show'">
      <div v-if="emojiVal" :class="[ns.be('picker')]">
        {{ emojiVal }}
      </div>
    </template>
    <template v-else-if="isEditing || emojiVal">
      <EmojiPicker
        v-model="props.defaultEmoji"
        trigger="click"
        v-bind="props.emojiOptions"
        @select="handleSelect"
      >
        <div v-if="isEditing" :class="[ns.be('picker')]">
          {{ emojiVal || props.defaultEmoji }}
        </div>
        <div v-else-if="emojiVal" :class="[ns.be('picker')]">
          {{ emojiVal }}
        </div>
      </EmojiPicker>
    </template>

    <div
      ref="inputRef"
      :class="inputClass"
      :contenteditable="isEditing"
      spellcheck="false"
      @paste="handlePaste"
      @keyup.enter="exitEditMode"
      @keydown.enter.prevent
      @input="handleInput"
    >
      {{ isEditing ? inputVal : inputVal || props.placeholder }}
    </div>

    <div v-if="isEditing" :class="ns.be('tools')">
      <span :class="ns.bem('tools', 'icon')" @click="copyToClipboard">
        <slot v-if="$slots.copy" name="copy" />
        <Icon v-else :icon="Copy" />
      </span>
      <span :class="ns.bem('tools', 'icon')" @click="clear">
        <slot v-if="$slots.clear" name="clear" />
        <Icon v-else :icon="X" />
      </span>
    </div>
  </div>
</template>
