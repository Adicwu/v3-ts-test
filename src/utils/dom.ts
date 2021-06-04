export function domObserver (dom: HTMLElement) {
  return new Promise((resolve: any) => {
    const observer = new IntersectionObserver((entries: any, observer: any) => {
      const isShow: boolean = entries.some((entrie: any) => entrie.intersectionRatio > 0)
      if (isShow) {
        // 解绑
        observer.unobserve(dom)
        resolve(entries)
      }
    })
    observer.observe(dom)
  })
}
export function windowResize (fn: (e: Event) => void) {
  window.addEventListener('resize', (e: Event) => {
    fn && fn(e)
  })
}
export function scrollToDom (dom: string | HTMLElement, config = {}) {
  const target = typeof dom === 'string' ? document.querySelector(dom) : dom
  if (!target) return
  return target.scrollIntoView({
    block: 'start',
    behavior: 'smooth',
    ...config
  })
}
export function getRealStyle (el: HTMLElement, styles = ['width', 'height']) {
  const computedStyle: any = (window as any).getComputedStyle(el)
  const res: any = {}
  const numberStyles = ['width', 'height']
  styles.forEach((style: string) => {
    if (numberStyles.indexOf(style) !== -1) {
      res[style] = Number(computedStyle[style].replace('px', ''))
    } else {
      res[style] = computedStyle[style]
    }
  })
  return styles.length > 0 ? res : computedStyle
}
