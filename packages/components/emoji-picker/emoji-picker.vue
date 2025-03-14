<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { emitEvent, useProps, useZIndex } from '@simple-ui/common'
import { useNamespace } from '@simple-ui/hooks'
import {
  Baseball,
  CarSide,
  Crow,
  Cube,
  FaceLaughBeam,
  Flag,
  MugHot,
  StarHalfStroke,
} from '@simple-ui/icons'
import { Dropdown } from '../dropdown/index'
import { Input } from '../input'
import { Icon } from '../icon'
import { emojiPickerProps } from './props'
import type { Emoji } from './props'
import emojiList from './data/emoji'

defineOptions({
  name: 'EmojiPicker',
})

const _props = defineProps(emojiPickerProps)

const emit = defineEmits(['update:value'])

const ns = useNamespace('emoji-picker')

const props = useProps('emoji-picker', _props, {
  value: null,
  trigger: 'click',
  placement: 'bottom-start',
  size: 18,
})
const visible = ref(false)
const currentEmoji = ref(props.value)
const panelRef = ref()
const contentRef = ref()
const emojiSearchKey = ref('')
const currentCategory = ref('常用')
const SVG_ICON = [FaceLaughBeam, Crow, MugHot, CarSide, Baseball, StarHalfStroke, Cube, Flag]

const getIndex = useZIndex()
const zIndex = computed(() => getIndex())
const contentStyle = computed(() => {
  return {
    width: `${(props.size + 12) * 10}px`,
  }
})
const innerStyle = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
  }
})
const emojiListShow = computed(() => {
  if (!emojiSearchKey.value)
    return emojiList

  const result: { [key: string]: any[] } = {}

  function findKeyInList(list: string[], key: string) {
    let flag = false

    list.forEach((keyword: string) => {
      if (keyword.includes(key))
        flag = true
    })

    return flag
  }
  for (const category in emojiList) {
    const emojis = emojiList[category]

    const emojiFiltered = emojis.filter((emoji: any) => {
      return findKeyInList(emoji.n, emojiSearchKey.value)
    })

    if (emojiFiltered.length)
      result[category] = emojiFiltered
  }

  return result
})
function handleEmojiSelect(emoji: Emoji) {
  const emitEmoji = {
    ...emoji,
    parsed: parseNativeEmoji(emoji.u),
  }

  currentEmoji.value = emitEmoji
  visible.value = false

  emit('update:value', emitEmoji)
  emitEvent(props.onSelect, emitEmoji)
}
function scrollToTargetType(type: string) {
  currentCategory.value = type
  const typeEl = panelRef.value.querySelector(`[aria-label="${type}"]`)

  contentRef.value.scroll({ top: typeEl.offsetTop })
}
function parseNativeEmoji(unified: string): string {
  return unified
    .split('-')
    .map(hex => String.fromCodePoint(Number.parseInt(hex, 16)))
    .join('')
}
// 监听出现在scroll container中的所有category
function watchIntersection() {
  const emojiCategory = Object.keys(emojiList)
  const visibleCategories = new Map()

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const category = entry.target.getAttribute('aria-label')
        visibleCategories.set(category, entry.intersectionRatio)
      })

      const ratios = Array.from(visibleCategories)
      const lastCategory = ratios[ratios.length - 1]

      // if last category into view, set currentType
      if (lastCategory[1] === 1)
        currentCategory.value = lastCategory[0]

      for (const [id, ratio] of ratios) {
        if (ratio) {
          // find the first category into scroll view
          currentCategory.value = id
          break
        }
      }
    },
    {
      threshold: [0, 1],
    },
  )

  emojiCategory.forEach((type) => {
    const ele = document.querySelector(`[aria-label="${type}"]`)
    ele && observer.observe(ele)
  })
}
watch(visible, (value) => {
  value && nextTick(watchIntersection)
})
</script>

<template>
  <Dropdown
    v-model:visible="visible"
    :trigger="props.trigger"
    :placement="props.placement"
    :transfer="props.transfer"
  >
    <slot />

    <template #drop>
      <div ref="panelRef" :class="ns.bm('panel')" :style="{ zIndex }">
        <Input v-model:value="emojiSearchKey" placeholder="搜索表情" type="secondary" @click.stop />
        <div :class="ns.be('category')">
          <div
            v-for="(icon, index) in SVG_ICON"
            :key="index"
            :class="{
              [ns.bem('category', 'active')]: currentCategory === Object.keys(emojiList)[index],
              [ns.bem('category', 'item')]: true,
            }"
            :style="{ 'font-size': `${props.size}px` }"
            @click.stop="scrollToTargetType(Object.keys(emojiList)[index])"
          >
            <Icon :icon="icon" />
          </div>
        </div>
        <div ref="contentRef" :class="ns.bm('content')" :style="contentStyle">
          <div
            v-for="(emojiType, idx) in Object.keys(emojiListShow)"
            :key="idx"
            :class="ns.bm('wrapper')"
            :aria-label="emojiType"
          >
            <div :class="ns.bs('title')">
              {{ emojiType }}
            </div>

            <div
              v-for="(emoji, idx) in emojiListShow[emojiType]"
              :key="idx"
              :class="ns.bs('item')"
              :style="{ 'font-size': `${props.size}px` }"
              @click="handleEmojiSelect(emoji)"
            >
              <div
                :data-emoji="emoji.u"
                :title="emoji.n"
                :class="ns.bs('inner')"
                :style="innerStyle"
              >
                {{ parseNativeEmoji(emoji.u) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Dropdown>
</template>
