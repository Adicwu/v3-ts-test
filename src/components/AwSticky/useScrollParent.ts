import { ref, Ref, onMounted } from 'vue'

type ScrollElement = HTMLElement | Window;

const overflowScrollReg = /scroll|auto/i

function isElement (node: Element) {
  const ELEMENT_NODE_TYPE = 1
  return (
    node.tagName !== 'HTML' &&
    node.tagName !== 'BODY' &&
    node.nodeType === ELEMENT_NODE_TYPE
  )
}

// https://github.com/youzan/vant/issues/3823
export function getScrollParent (el: Element, root: ScrollElement = window): Element | Window {
  let node = el

  while (node && node !== root && isElement(node)) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowScrollReg.test(overflowY)) {
      return node
    }
    node = node.parentNode as Element
  }

  return root
}

export function useScrollParent (
  el: Ref<Element | undefined>,
  root: ScrollElement = window
): Ref<any> {
  const scrollParent = ref<Element | Window>()

  onMounted(() => {
    if (el.value) {
      scrollParent.value = getScrollParent(el.value, root)
    }
  })

  return scrollParent
}
