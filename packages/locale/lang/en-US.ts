import { defineLocaleConfig } from '..'

export function enUSLocale() {
  return defineLocaleConfig({
    locale: 'en-US',

    input: {
      placeholder: 'Please input',
    },

    inputEmoji: {
      copy: 'Copy successfully',
    },

    timePicker: {
      startPlaceholder: 'Start time',
      endPlaceholder: 'End time',
      cancel: 'Cancel',
      confirm: 'Confirm',
      hour: 'Hour',
      minute: 'Minute',
      second: 'Second',
    },

    datePicker: {
      startPlaceholder: 'Start date',
      endPlaceholder: 'End date',
      cancel: 'Cancel',
      confirm: 'Confirm',
      manual: 'Manual',
      year: 'Year',
      month: 'Month',
      day: 'Day',
      hour: 'Hour',
      minute: 'Minute',
      second: 'Second',
      since: (placeholder: string) => `Since ${placeholder}`,
      last: (digit: number, unit: string) => {
        if (unit === 'day')
          return `Last ${digit} ${digit === 1 ? 'day' : 'days'}`
        if (unit === 'month')
          return `Last ${digit} ${digit === 1 ? 'month' : 'months'}`
        if (unit === 'year')
          return `Last ${digit} ${digit === 1 ? 'year' : 'years'}`

        return `Last ${digit} ${unit}`
      },
      sinceType: 'Since',
      fixedType: 'Fixed',
      lastType: 'Last',
      units: {
        days: 'days',
        months: 'months',
        years: 'years',
        day: 'day',
        month: 'month',
        year: 'year',
      },
    },
  })
}
