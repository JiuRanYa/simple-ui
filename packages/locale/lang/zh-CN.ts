import { defineLocaleConfig } from '..'

export function zhCNLocale() {
  return defineLocaleConfig({
    locale: 'zh-CN',

    input: {
      placeholder: '请输入',
    },

    inputEmoji: {
      copy: '复制成功',
    },

    timePicker: {
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      cancel: '取消',
      confirm: '确认',
      hour: '时',
      minute: '分',
      second: '秒',
    },

    datePicker: {
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      cancel: '取消',
      confirm: '确认',
      manual: '手动',
      year: '年',
      month: '月',
      day: '日',
      hour: '时',
      minute: '分',
      second: '秒',
      since: (placeholder: string) => `自从${placeholder}以来`,
      last: (digit: number, unit: string) => {
        if (unit === 'day')
          return `过去${digit}天`
        if (unit === 'month')
          return `过去${digit}月`
        if (unit === 'year')
          return `过去${digit}年`

        return `过去${digit}${unit}`
      },
      sinceType: '自从',
      fixedType: '固定',
      lastType: '过去',
      units: {
        days: '天',
        months: '月',
        years: '年',
        day: '天',
        month: '月',
        year: '年',
      },
    },
  })
}
