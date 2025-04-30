<script setup lang="ts">
import { useClickOutside, useNamespace, usePopper } from '@simple-ui/hooks'
import { computed, provide, reactive, ref, toRef, watch } from 'vue'
import type { PopperExposed } from '@simple-ui/components'
import type {
  Dateable,
} from '@simple-ui/common'
import {
  emitEvent,
  isString,
  placementWhiteList,
  useIcons,
  useLocale,
  useProps,
  useZIndex,
  warnWithPrefix,
} from '@simple-ui/common'
import type { Dayjs, QUnitType } from 'dayjs'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import { Icon } from '../icon'
import { ButtonGroup } from '../button-group'
import { Button } from '../button'
import { useColumn } from '../time-picker/helper'
import { Popper } from '../popper'
import { config } from './const'
import { datePickerProps } from './props'
import type { DateMeta, DatePickerDynamicConfig, DatePickerDynamicType, DatePickerDynamicValue } from './props'
import DatePickerPanel from './date-picker-panel.vue'
import { DATE_PICKER_INJECTION_KEY } from './token'

defineOptions({
  name: 'DatePicker',
})

const _props = defineProps(datePickerProps)

const emit = defineEmits(['update:value'])

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)

const props = useProps('date-picker', _props, {
  placement: {
    default: 'bottom-start',
    validator: value => placementWhiteList.includes(value),
  },
  value: '',
  transitionName: () => ns.ns('drop'),
  presets: {},
  type: 'static',
  valueFormat: '',
  format: 'YMD Hms',
  to: '',
  size: 'middle',
  locale: null,
  disabledDate: [],
})
const ns = useNamespace('date-picker')
const icons = useIcons()
const locale = useLocale('datePicker')

const isRange = computed(() => {
  return props.type === 'range' || props.type === 'dateTimeRange' || props.type === 'dynamic'
})

const panelRef = ref()
const popperRef = ref<PopperExposed>()

const panelEle = computed(() => panelRef.value?.wrapper)
const popperEl = computed(() => popperRef.value?.wrapper)

const visible = ref(false)
const startMeta = createDateMeta(0)
const endMeta = createDateMeta(1)

const dynamicType = ref<DatePickerDynamicType>('fixed')
const disabledDate = ref<Dateable[]>(props.disabledDate)

const isTime = computed(() => props.type === 'dateTime' || props.type === 'dateTimeRange')
const currentValue = computed(() => {
  const values = [startMeta, endMeta].map((state) => {
    const format = getValueFormat()
    const values = state.getDate()

    return dayjs(values).format(format)
  })

  return isRange.value ? values : values[0]
})

const placement = toRef(props, 'placement')

const dynamicConfig = reactive<DatePickerDynamicConfig>({
  startDate: '',
  endDate: '',
  digit: 0,
  unit: 'day',
})

const popperClass = computed(() => {
  return [
    ns.b(),
    ns.bs('vars'),
    ns.be('popper'),
    {
      [ns.bm('inherit')]: props.inherit,
    },
  ]
})

const { reference, transferTo, updatePopper } = usePopper({
  popper: popperEl,
  placement,
  transfer: toRef(props, 'to'),
  isDrop: true,
})

const getIndex = useZIndex()
const zIndex = computed(() => getIndex())
const popperStyle = computed(() => {
  return {
    zIndex: zIndex.value,
  }
})

function createMeta(data?: any) {
  return {
    year: dayjs(data).year(),
    month: dayjs(data).month(),
    day: dayjs(data).date(),
    hour: 0,
    minute: 0,
    second: 0,
  }
}

function createDateMeta(idx: number) {
  const date = props.value as any
  const { enabled } = useColumn<keyof DateMeta>(['year', 'month', 'day', 'hour', 'minute', 'second'])

  let dateMeta = reactive<DateMeta>(createMeta())

  if (!isRange.value && date && isString(date))
    dateMeta = reactive(createMeta(date))

  if (isRange.value && date && Array.isArray(date))
    dateMeta = reactive(createMeta(date[idx]))

  const extraMeta = reactive({
    allocated: false,
  })

  return reactive({
    enabled,
    dateMeta,
    extraMeta,
    // 你只应该在处理外部时间时使用该方法, 其余你应该使用setDateMeta来控制组件的输出值
    setDate: (date: Dateable | Dayjs, changeByClick = true) => {
      if (!date)
        return
      dateMeta.year = dayjs(date).get('year')
      dateMeta.month = dayjs(date).get('month')
      dateMeta.day = dayjs(date).get('date')
      dateMeta.hour = dayjs(date).get('hour')
      dateMeta.minute = dayjs(date).get('minute')
      dateMeta.second = dayjs(date).get('second')

      changeByClick && (extraMeta.allocated = true)
    },
    setDateMeta: (meta: Partial<DateMeta>) => {
      const keys = Object.keys(meta).filter(unit => enabled[unit as keyof DateMeta]) as (keyof Partial<DateMeta>)[]

      keys.forEach((key) => {
        dateMeta[key] = meta[key]!
      })
    },
    getDate: () => {
      return new Date(
        dateMeta.year,
        dateMeta.month,
        dateMeta.day,
        dateMeta.hour,
        dateMeta.minute,
        dateMeta.second,
      )
    },
    getDayjs: () => {
      return dayjs(new Date(dateMeta.year, dateMeta.month, dateMeta.day))
    },
  })
}
function getValueFormat() {
  if (props.valueFormat)
    return props.valueFormat

  if (isTime.value)
    return config.timeFormat

  return config.defaultFormat
}

function showPanel() {
  togglePanel(true)
  parseValue()
}

function getDisabledDate() {
  return dynamicType.value !== 'fixed' ? [dayjs(endMeta.getDate()), Number.POSITIVE_INFINITY] : props.disabledDate
}

function parseDynamicValue() {
  const { type, dynamicConfig: _dynamicConfig } = props.value as DatePickerDynamicValue

  dynamicType.value = type
  dynamicConfig.digit = _dynamicConfig.digit
  dynamicConfig.unit = _dynamicConfig.unit

  if (type === 'since')
    startMeta.setDate(dayjs(_dynamicConfig.startDate))

  if (type === 'last')
    calcDynamicDateByLastConfig()

  if (type === 'fixed') {
    startMeta.setDate(dayjs(_dynamicConfig.startDate))
    endMeta.setDate(dayjs(_dynamicConfig.endDate))
  }

  startMeta.extraMeta.allocated = true
  endMeta.extraMeta.allocated = true

  disabledDate.value = getDisabledDate()
}

function parseValue() {
  const noValue = !props.value || (Array.isArray(props.value) && !props.value.length)

  // 没有值则重置
  if (noValue) {
    startMeta.extraMeta.allocated = false
    endMeta.extraMeta.allocated = false

    return
  }

  try {
    if (props.type === 'dynamic') {
      parseDynamicValue()
      return
    }
    // 如果是范围选择, 并且值有效
    if (Array.isArray(props.value) && isRange.value) {
      const startValid = dayjs(props.value[0]).isValid()
      const endValid = dayjs(props.value[1]).isValid()

      startValid && startMeta.setDate(props.value[0], false)
      endValid && endMeta.setDate(props.value[1], false)

      startMeta.extraMeta.allocated = startValid
      endMeta.extraMeta.allocated = endValid
    }
    else if (!Array.isArray(props.value)) {
      const startValid = dayjs(props.value as Dateable).isValid()
      startValid && startMeta.setDate(props.value as Dateable, false)
    }
  }
  catch {
    if (typeof props.value !== 'object')
      warnWithPrefix('date-picker', 'parse value error, please make sure the value is a valid date or a valid object')
  }
}

function togglePanel(value = !visible.value) {
  visible.value = value
}

function handleClickOutside() {
  visible.value = false
}

function patchDateMeta(d: Dateable | Dateable[]) {
  if (!Array.isArray(d)) {
    startMeta.setDate(d)
  }
  else {
    startMeta.setDate(d[0])
    endMeta.setDate(d[1])
  }

  emitValue()
}
function handlePresetClick(value: Dateable | Dateable[], preset: string) {
  if (props.type === 'static')
    patchDateMeta(value)

  if (isRange.value)
    patchDateMeta(value)

  emitEvent(props.onShortcut, preset, value)
}

const startFormattedValue = computed(() => {
  if (!startMeta.extraMeta.allocated && !props.value)
    return isRange.value ? locale.value?.startPlaceholder || '开始日期' : locale.value?.manual || '手动'

  const startProps = computed(() => startMeta.getDate())

  return dayjs(startProps.value).format(getValueFormat())
})
const endModelValue = computed(() => {
  if (!endMeta.extraMeta.allocated && !props.value)
    return locale.value?.endPlaceholder || '结束日期'

  const endProps = endMeta.getDate()

  return dayjs(endProps).format(getValueFormat())
})
const placeholder = computed(() => {
  if (props.type === 'dynamic' && dynamicType.value === 'since') {
    const sinceFn = locale.value?.since
    return typeof sinceFn === 'function' ? sinceFn(dayjs(startMeta.getDate()).format(getValueFormat())) : `Since ${dayjs(dynamicConfig.startDate).format(getValueFormat())}`
  }

  if (props.type === 'dynamic' && dynamicType.value === 'last') {
    const lastFn = locale.value?.last
    return typeof lastFn === 'function' ? lastFn(dynamicConfig.digit, dynamicConfig.unit) : `Last ${dynamicConfig.digit} ${dynamicConfig.unit}`
  }

  return isRange.value ? `${startFormattedValue.value} - ${endModelValue.value}` : startFormattedValue.value
})

function parseFormat() {
  ;[startMeta, endMeta].forEach((state) => {
    state.enabled.year = props.format.includes('Y')
    state.enabled.month = props.format.includes('M')
    state.enabled.day = props.format.includes('D')
    state.enabled.hour = props.format.toLowerCase().includes('h')
    state.enabled.minute = props.format.includes('m')
    state.enabled.second = props.format.includes('s')
  })
}

function emitValue() {
  if (props.type === 'dynamic') {
    const emitValue: DatePickerDynamicValue = {
      type: dynamicType.value,
      dynamicConfig: {
        digit: dynamicConfig.digit,
        unit: dynamicConfig.unit,
        startDate: startMeta.getDate().getTime(),
        endDate: endMeta.getDate().getTime(),
      },
    }
    emit('update:value', emitValue)
    emitEvent(props.onChange, emitValue)
    return
  }

  const emitValue = isRange.value
    ? [startMeta.getDate().getTime(), endMeta.getDate().getTime()]
    : startMeta.getDate().getTime()

  emit('update:value', emitValue)
  emitEvent(props.onChange, emitValue)
}

function handleConfirm() {
  emitValue()
  togglePanel(false)
}

function ensureStartIsBefor() {
  const startDate = startMeta.getDate()
  const endDate = endMeta.getDate()
  const needChange = dayjs(endDate).isSameOrBefore(startDate)

  if (!needChange)
    return

  startMeta.setDate(endDate)
  endMeta.setDate(startDate)
}

function calcDynamicDateByLastConfig() {
  if (props.type !== 'dynamic' || dynamicType.value !== 'last')
    return

  const today = dayjs()
  const startDate = today.subtract(dynamicConfig.digit, dynamicConfig.unit as QUnitType)

  startMeta.setDateMeta({
    year: startDate.get('year'),
    month: startDate.get('month'),
    day: startDate.get('date'),
  })
  endMeta.setDateMeta({
    year: today.get('year'),
    month: today.get('month'),
    day: today.get('date'),
  })
  startMeta.extraMeta.allocated = true
  endMeta.extraMeta.allocated = true
}

function handlePickDate(dateStr: string) {
  if (isDisabledDate(dateStr) || dateStr === '')
    return

  const date = dayjs(dateStr)

  // 如果不是范围选择终止
  if (!isRange.value) {
    startMeta.setDateMeta({ year: date.get('year'), month: date.get('month'), day: date.get('date') })

    return
  }

  // // 动态时间类型
  if (props.type === 'dynamic') {
    const today = dayjs()

    // 如果是动态日期，默认以今天为结束日期
    if (dynamicType.value !== 'fixed') {
      startMeta.setDateMeta({ year: date.get('year'), month: date.get('month'), day: date.get('date') })
      endMeta.setDateMeta({ year: today.get('year'), month: today.get('month'), day: today.get('date') })
    }
    if (dynamicType.value === 'since') {
      startMeta.extraMeta.allocated = true
      endMeta.extraMeta.allocated = true
      return
    }
    else if (dynamicType.value === 'last') {
      startMeta.extraMeta.allocated = true
      endMeta.extraMeta.allocated = true
      return
    }
  }

  // 如果全部指派, 重置
  if (startMeta.extraMeta.allocated && endMeta.extraMeta.allocated) {
    startMeta.extraMeta.allocated = false
    endMeta.extraMeta.allocated = false
  }

  // 分别指派开始时间和结束时间
  if (!startMeta.extraMeta.allocated) {
    startMeta.setDateMeta({
      year: date.get('year'),
      month: date.get('month'),
      day: date.get('date'),
    })
    startMeta.extraMeta.allocated = true

    return
  }
  if (!endMeta.extraMeta.allocated) {
    endMeta.setDateMeta({
      year: date.get('year'),
      month: date.get('month'),
      day: date.get('date'),
    })
    endMeta.extraMeta.allocated = true
  }
}

function isDisabledDate(dateStr: string) {
  if (!dateStr)
    return false

  if (!dayjs(dateStr).isValid())
    return true

  const startDate = disabledDate.value[0]
  const endDate = disabledDate.value[1]

  if (startDate === Number.POSITIVE_INFINITY)
    return dayjs(dateStr).isBefore(endDate)

  if (endDate === Number.POSITIVE_INFINITY)
    return dayjs(dateStr).isAfter(startDate)

  return dayjs(dateStr).isBetween(startDate, endDate, null, '[)')
}

watch(
  () => props.value,
  (value) => {
    if (!value)
      return

    parseValue()
  },
  { immediate: true },
)

watch(() => props.valueFormat, parseFormat, { immediate: true })

watch(visible, (value) => {
  parseValue()
  if (value)
    updatePopper()
})
watch(
  () => endMeta.dateMeta,
  () => {
    ensureStartIsBefor()
  },
  { deep: true },
)

watch(() => [dynamicConfig.digit, dynamicConfig.unit], () => {
  calcDynamicDateByLastConfig()
})

provide(DATE_PICKER_INJECTION_KEY, {
  currentValue,
  isRange,
  startMeta,
  endMeta,
  props,
  dynamicType,
  dynamicConfig,
  disabledDate,
  handlePickDate,
  isDisabledDate,
  getValueFormat,
  getDisabledDate,
})

useClickOutside(handleClickOutside, { ignore: [panelEle] }, reference)
</script>

<template>
  <div ref="reference" :class="ns.bs('trigger')" style="display: inline-block" @click="showPanel">
    <slot v-if="$slots.trigger" name="trigger" />
    <ButtonGroup v-else-if="presets" v-bind="$attrs">
      <Button :size="props.size">
        <template #icon>
          <Icon v-bind="icons.calendar" />
        </template>
        {{ placeholder }}
      </Button>
      <Button
        v-for="preset in Object.keys(presets)"
        :key="preset"
        :size="props.size"
        @click.stop="handlePresetClick(presets[preset], preset)"
      >
        {{ preset }}
      </Button>
    </ButtonGroup>

    <Button v-else :size="props.size" v-bind="$attrs">
      <template #icon>
        <Icon v-bind="icons.calendar" />
      </template>
      {{ placeholder }}
    </Button>
  </div>

  <Popper
    ref="popperRef"
    :class="popperClass"
    :to="transferTo"
    :visible="visible"
    :transition="props.transitionName"
    :style="popperStyle"
    :inherit="props.inherit"
    @click.stop
  >
    <DatePickerPanel
      ref="panelRef"
      :type="props.type"
      @confirm="handleConfirm"
      @cancel="togglePanel"
    />
  </Popper>
</template>
