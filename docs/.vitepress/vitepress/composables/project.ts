import { computed } from 'vue'

export const defaultProject = 'simple-ui'

export function useProject() {
  const project = defaultProject

  return computed(() => {
    return project
  })
}
