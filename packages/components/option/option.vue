<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@simple-ui/hooks'
import { Icon } from '@simple-ui/components'
import { AngleRight, Check } from '@simple-ui/icons'
import { useProps } from '@simple-ui/common'
import { optionProps } from './props'

const _props = defineProps(optionProps)

const ns = useNamespace('option')

const props = useProps('option', _props, {
  expandable: false,
})

const className = computed(() => {
  return [
    ns.b(),
    ns.bs('vars'),
    {
      [ns.bm('disabled')]: props.disabled,
    },
  ]
})
</script>

<template>
  <li
    :class="className"
    role="option"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-selected="selected"
  >
    <slot>
      <div :class="ns.be('content')">
        <Icon v-if="selected" :icon="Check" :class="ns.be('icon')" />

        <span :class="ns.be('label')">
          {{ label || value }}
        </span>
      </div>
    </slot>

    <Icon v-if="props.expandable" :scale="0.9" :icon="AngleRight" :class="ns.be('arrow')" />
  </li>
</template>
