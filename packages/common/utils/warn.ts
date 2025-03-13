export function warnWithPrefix(name: string, info: string) {
  console.warn(`[Simple UI] [${name.charAt(0).toLocaleUpperCase() + name.substring(1)}], ${info}`)
}

export const logger = {
  warnWithPrefix,
}
