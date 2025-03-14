import type { MaybeRef } from '@simple-ui/common'
import { noop } from '@simple-ui/common'
import { getCurrentScope, onScopeDispose, unref, watch } from 'vue'

export function useEventListener<E = Event>(
  target: MaybeRef<EventTarget | null | undefined>,
  event: string,
  listener: (event: E) => any,
  options?: AddEventListenerOptions | boolean,
) {
  if (!target)
    return

  let remove = noop

  const stopWatch = watch(
    () => unref(target),
    (el) => {
      remove()

      if (!el)
        return

      el.addEventListener(event, listener as any, options)

      remove = () => {
        el.removeEventListener(event, listener as any, options)
        remove = noop
      }
    },
    { immediate: true, flush: 'post' },
  )

  const stop = () => {
    stopWatch()
    remove()
  }

  getCurrentScope() && onScopeDispose(stop)

  return stop
}
