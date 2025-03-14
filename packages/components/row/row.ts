import { computed, defineComponent, h, provide, reactive, toRef } from 'vue'
import { useNamespace } from '@simple-ui/hooks'
import { rowProps } from './props'
import { ROW_STATE } from './symbol'

export default defineComponent({
  name: 'Row',
  props: rowProps,
  setup(props, { slots }) {
    const ns = useNamespace('row')

    const classNames = computed(() => {
      return [
        ns.b(),
        ns.bs('vars'),
        {
          [ns.bm(props.justify)]: props.justify,
        },
      ]
    })

    const styles = computed(() => {
      if (!props.gap)
        return null

      if (typeof props.gap === 'number') {
        return {
          [ns.cv('h-gap')]: `${props.gap}px`,
        }
      }

      if (Array.isArray(props.gap)) {
        const [horizontal, vertical] = props.gap

        return {
          [ns.cv('h-gap')]: `${horizontal}px`,
          [ns.cv('v-gap')]: `${vertical}px`,
        }
      }

      return null
    })

    provide(
      ROW_STATE,
      reactive({
        gap: toRef(props, 'gap'),
      }),
    )

    return () =>
      h(
        props.tag || 'div',
        {
          class: classNames.value,
          style: styles.value,
        },
        {
          default: () => slots.default && slots.default(),
        },
      )
  },
})
