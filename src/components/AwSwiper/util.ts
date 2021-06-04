const MIN_DISTANCE = 10
export function getDirection (x: number, y: number) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal'
  }
  if (y > x && y > MIN_DISTANCE) {
    return 'vertical'
  }
  return ''
}
export function stopPropagation (event: Event) {
  event.stopPropagation()
}
export function preventDefault (event: Event, isStopPropagation = true) {
  /* istanbul ignore else */
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault()
  }

  if (isStopPropagation) {
    stopPropagation(event)
  }
}
