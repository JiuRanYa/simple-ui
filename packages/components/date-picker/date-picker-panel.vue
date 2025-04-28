<script setup lang="ts">
import { useNamespace } from '@simple-ui/hooks'
import { computed, inject, reactive, ref, watch } from 'vue'
import { Button } from '@simple-ui/components'
import dayjs from 'dayjs'
import { useLocale } from '@simple-ui/common'
import TimePanel from '../time-picker/time-panel.vue'
import InputNumber from '../input-number/input-number.vue'
import Select from '../select/select.vue'
import { datePickerPanelProps } from './props'
import type { DatePickerDynamicType } from './props'
import DatePickerCalendar from './date-picker-calendar.vue'
import { config, weekDay } from './const'
import { DATE_PICKER_INJECTION_KEY } from './token'

defineOptions({
  name: 'DatePickerPanel',
})
const props = defineProps(datePickerPanelProps)

const emit = defineEmits(['confirm', 'cancel'])
const wrapper = ref()
const ns = useNamespace('date-picker')
const locale = useLocale('datePicker')

const className = computed(() => {
  return [ns.be('panel'), ns.bs('vars')]
})

const root = inject(DATE_PICKER_INJECTION_KEY)!

const startTime = reactive({
  hour: root?.startMeta.dateMeta.hour,
  minute: root?.startMeta.dateMeta.minute,
  second: root?.startMeta.dateMeta.second,
})
const endTime = reactive({
  hour: root?.endMeta.dateMeta.hour,
  minute: root?.endMeta.dateMeta.minute,
  second: root?.endMeta.dateMeta.second,
})

const startDate = ref(root?.startMeta.getDayjs().format(config.defaultFormat))
const endDate = ref(root?.endMeta.getDayjs().format(config.defaultFormat))

function validateDate(date: string) {
  return dayjs(date).isValid()
}

function setValidDate(date: string, isStart: boolean = true) {
  if (validateDate(date)) {
    const parsedDate = dayjs(date).format(config.defaultFormat)
    const method = isStart ? root?.startMeta : root?.endMeta

    method?.setDate(parsedDate)
  }
}

function switchDynamicType(type: DatePickerDynamicType) {
  if (!root)
    return

  root.dynamicType.value = type
  const today = dayjs()

  if (type === 'since') {
    root.endMeta.setDateMeta({
      year: today.year(),
      month: today.month(),
      day: today.date(),
    })
  }

  if (type === 'last') {
    root.endMeta.setDateMeta({
      year: today.year(),
      month: today.month(),
      day: today.date(),
    })
  }

  root.disabledDate.value = root.getDisabledDate()
}

function confirmValue() {
  emit('confirm')
}
function handleCancel() {
  emit('cancel')
}

const unitOptions = computed(() => [
  { label: root.dynamicConfig.digit > 1 ? locale.value?.units?.days || '' : locale.value?.units?.day || '', value: 'day' },
  { label: root.dynamicConfig.digit > 1 ? locale.value?.units?.months || '' : locale.value?.units?.month || '', value: 'month' },
  { label: root.dynamicConfig.digit > 1 ? locale.value?.units?.years || '' : locale.value?.units?.year || '', value: 'year' },
])

function calcDynamicConfig() {
  const startDate = root.startMeta.getDayjs()
  const today = dayjs()
  const diffDays = Math.abs(startDate.diff(today, 'days'))
  const diffMonths = Math.abs(startDate.diff(today, 'months'))
  const diffYears = Math.abs(startDate.diff(today, 'years'))

  // 根据当前单位和计算结果，如果digit为0则向下退位
  if (root.dynamicConfig.unit === 'year' && diffYears === 0) {
    root.dynamicConfig.digit = diffMonths
    root.dynamicConfig.unit = 'month'
  }
  else if (root.dynamicConfig.unit === 'month' && diffMonths === 0) {
    root.dynamicConfig.digit = diffDays
    root.dynamicConfig.unit = 'day'
  }
  else {
    // 保持当前单位，更新digit
    switch (root.dynamicConfig.unit) {
      case 'year':
        root.dynamicConfig.digit = diffYears
        break
      case 'month':
        root.dynamicConfig.digit = diffMonths
        break
      case 'day':
        root.dynamicConfig.digit = diffDays
        break
    }
  }
}

function handleStartInput(type: 'start' | 'end', e: Event) {
  const input = e.target as HTMLInputElement
  const value = input.value

  // 严格验证日期格式为 YYYY-MM-DD
  if (!dayjs(value, root?.getValueFormat(), true).isValid())
    return

  if (root?.isDisabledDate(value)) {
    input.value = root?.startMeta.getDayjs().format(root?.getValueFormat())

    return
  }

  const currentDate = dayjs(value)
  const otherDate = type === 'start' ? root.endMeta.getDayjs() : root.startMeta.getDayjs()

  // 根据输入类型和日期比较结果确定新的开始和结束日期
  let newStartDate: dayjs.Dayjs
  let newEndDate: dayjs.Dayjs

  if (type === 'start') {
    newStartDate = currentDate.isBefore(otherDate) ? currentDate : otherDate
    newEndDate = currentDate.isBefore(otherDate) ? otherDate : currentDate
  }
  else {
    newStartDate = currentDate.isAfter(otherDate) ? otherDate : currentDate
    newEndDate = currentDate.isAfter(otherDate) ? currentDate : otherDate
  }

  // 更新开始日期
  root.startMeta.setDateMeta({
    year: newStartDate.year(),
    month: newStartDate.month(),
    day: newStartDate.date(),
  })

  // 更新结束日期
  root.endMeta.setDateMeta({
    year: newEndDate.year(),
    month: newEndDate.month(),
    day: newEndDate.date(),
  })

  // 标记日期已被分配
  root.startMeta.extraMeta.allocated = true
  root.endMeta.extraMeta.allocated = true
}

watch(
  () => startDate.value,
  () => {
    startDate.value && setValidDate(startDate.value)
  },
)
watch(
  () => endDate.value,
  () => {
    endDate.value && setValidDate(endDate.value, false)
  },
)
watch(
  () => startTime,
  (time) => {
    root?.startMeta.setDateMeta(time)
  },
  { deep: true },
)
watch(
  () => endTime,
  (time) => {
    root?.endMeta.setDateMeta(time)
  },
  { deep: true },
)

watch(
  () => root?.startMeta.dateMeta,
  () => {
    startDate.value = root?.startMeta.getDayjs().format(root?.getValueFormat())

    root.dynamicConfig.startDate = root?.startMeta.getDayjs().format(root?.getValueFormat())
    calcDynamicConfig()
  },
  { deep: true, immediate: true },
)
watch(
  () => root?.endMeta.dateMeta,
  () => {
    endDate.value = root?.endMeta.getDayjs().format(root?.getValueFormat())

    root.dynamicConfig.endDate = root?.endMeta.getDayjs().format(root?.getValueFormat())
    calcDynamicConfig()
  },
  { deep: true, immediate: true },
)

defineExpose({
  wrapper,
})
const showTime = computed(
  () => props.type === 'dateTime' || props.type === 'dateTimeRange',
)
const isTimeRange = computed(() => props.type === 'dateTimeRange')
</script>

<template>
  <div ref="wrapper" :class="className">
    <template v-if="root?.props.type === 'dynamic'">
      <div :class="ns.be('type')">
        <div :class="[ns.bem('type', 'option'), { [ns.bem('type', 'active')]: root?.dynamicType.value === 'fixed' }]" @click="switchDynamicType('fixed')">
          {{ locale?.fixedType }}
        </div>
        <div :class="[ns.bem('type', 'option'), { [ns.bem('type', 'active')]: root?.dynamicType.value === 'since' }]" @click="switchDynamicType('since')">
          {{ locale?.sinceType }}
        </div>
        <div :class="[ns.bem('type', 'option'), { [ns.bem('type', 'active')]: root?.dynamicType.value === 'last' }]" @click="switchDynamicType('last')">
          {{ locale?.lastType }}
        </div>
      </div>

      <div :class="ns.be('actions')">
        <input v-if="root?.dynamicType.value !== 'last'" v-model="root.dynamicConfig.startDate" type="text" @input="e => handleStartInput('start', e)">
        <input v-if="root.dynamicType.value === 'fixed'" v-model="root.dynamicConfig.endDate" type="text" @input="e => handleStartInput('end', e)">

        <template v-if="root?.dynamicType.value === 'last'">
          <InputNumber v-model:value="root.dynamicConfig.digit" sync :min="0" placeholder="" :size="root.props.size" />
          <Select v-model:value="root.dynamicConfig.unit" placeholder="" :options="unitOptions" :size="root.props.size" />
        </template>
      </div>
    </template>

    <div :class="ns.bm('list')">
      <div :class="ns.be('panels')">
        <div :class="ns.bem('data', 'panel')">
          <div :class="ns.bem('panel', 'body')">
            <div :class="ns.be('header')">
              <div
                v-for="i in weekDay"
                :key="i"
                :class="ns.bem('header', 'day')"
              >
                {{ i }}
              </div>
            </div>

            <DatePickerCalendar />
          </div>
        </div>

        <div
          v-if="showTime"
          :class="[ns.bem('time', 'panel'), { [ns.bem('time', 'range')]: isTimeRange }] "
        >
          <TimePanel
            v-model:hour="startTime.hour"
            v-model:minute="startTime.minute"
            v-model:second="startTime.second"
            :enabled="root?.startMeta.enabled"
          />
          <TimePanel
            v-if="isTimeRange"
            v-model:hour="endTime.hour"
            v-model:minute="endTime.minute"
            v-model:second="endTime.second"
            :enabled="root?.endMeta.enabled"
          />
        </div>
      </div>

      <div :class="ns.be('action')">
        <Button type="ghost" @click="handleCancel">
          取消
        </Button>
        <Button type="ghost" @click="confirmValue">
          确认
        </Button>
      </div>
    </div>
  </div>
</template>
