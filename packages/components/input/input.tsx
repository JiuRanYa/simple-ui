import { useNamespace } from '@simple-ui/hooks'
import { emitEvent, isNull, useLocale, useProps } from '@simple-ui/common'
import { computed, defineComponent, ref, toRef, watch } from 'vue'
import { debounce, throttle } from '@simple-ui/utils'
import { inputProps } from './props'

export default defineComponent({
  name: 'Input',
  props: inputProps,
  emits: ['update:value'],
  setup(_props, { slots, emit, expose }) {
    const ns = useNamespace('input')
    const className = computed(() => {
      return [ns.b(), ns.bs('vars'), ns.bm(props.size)]
    })
    const inputClass = computed(() => {
      return [ns.bm('control')]
    })
    const props = useProps('input', _props, {
      value: '',
      debounce: false,
      placeholder: null,
      type: 'secondary',
      autofocus: false,
      disabled: false,
      readonly: false,
      size: 'middle',
      delay: 100,
      locale: null,
    })

    const inputRef = ref<HTMLInputElement>()
    const initialValue = isNull(props.value) ? '' : String(props.value)
    const currentValue = ref(initialValue)
    const placeholder = toRef(props, 'placeholder')
    const locale = useLocale('input', toRef(props, 'locale'))

    const inputDisabled = computed(() => props.disabled)

    const hasPrefix = computed(() => {
      return !!slots.prefix
    })
    const hasSuffix = computed(() => {
      return !!slots.suffix
    })
    const hasBefore = computed(() => {
      return !!slots.before
    })
    const hasAfter = computed(() => {
      return !!slots.after
    })

    function handleChange(event: Event) {
      const value = (event.target as HTMLInputElement).value
      setValue(value)
    }

    function setValue(value: string) {
      currentValue.value = value
      emit('update:value', value)
      emitEvent(props.onChange, value)
    }

    const handleInput = props.debounce ? debounce(handleChange, props.delay) : throttle(handleChange, props.delay)
    const handleBlur = (event: FocusEvent) => emitEvent(props.onBlur, currentValue.value, event)

    function renderInput() {
      return (
        <input
          ref={inputRef}
          class={inputClass.value}
          value={currentValue.value}
          onInput={handleInput}
          onBlur={handleBlur}
          autofocus={props.autofocus}
          disabled={inputDisabled.value}
          readonly={props.readonly}
          placeholder={props.placeholder ? placeholder.value : locale.value?.placeholder}
        />
      )
    }
    function renderPrefix() {
      return <div class={[ns.be('prefix'), ns.be('icon')]}>{slots.prefix && slots.prefix()}</div>
    }
    function renderSuffix() {
      return slots.suffix && slots.suffix()
    }
    function renderBefore() {
      return <div class={[ns.be('before')]}>{slots.before && slots.before()}</div>
    }
    function renderAfter() {
      return <div class={[ns.be('after')]}>{slots.after && slots.after()}</div>
    }

    watch(
      () => props.value,
      () => {
        currentValue.value = String(props.value)
      },
    )

    expose({
      inputRef,
      focus: () => {
        inputRef.value?.focus()
      },
      blur: () => {
        inputRef.value?.blur()
      },
    })

    return () => {
      return hasBefore.value || hasAfter.value
        ? (
          <div class={[ns.bm('wrapper')]}>
            {hasBefore.value ? renderBefore() : null}
            <div class={className.value}>
              {hasPrefix.value ? renderPrefix() : null}
              {renderInput()}
              {hasSuffix.value ? renderSuffix() : null}
            </div>
            {hasAfter.value ? renderAfter() : null}
          </div>
          )
        : (
          <div class={className.value}>
            {hasPrefix.value ? renderPrefix() : null}
            {renderInput()}
            {hasSuffix.value ? renderSuffix() : null}
          </div>
          )
    }
  },
})
