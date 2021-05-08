<template>
  <div class="aw-sticky" ref="selfDom" :style="selfStyle">
    <div class="aw-sticky__inner" :style="selfContentStyle">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, Ref, ref, SetupContext, unref } from 'vue'
import { getScrollParent } from './useScrollParent'
type UseEventListenerOptions = {
  target?: EventTarget | Ref<EventTarget | undefined>;
  capture?: boolean;
  passive?: boolean;
};
type EventListener = (e: any) => void
function useEvent (type: string, listener: EventListener, options: UseEventListenerOptions = {}) {
  const { target } = options
  const element = unref(target)!
  console.log(element)

  element.addEventListener(type, listener)
  onUnmounted(() => {
    element.removeEventListener(type, listener)
  })
}
export default defineComponent({
  name: 'AwSticky',
  props: {
    /**
     * 粘贴未知，可选top bottom，不推荐修改
     */
    position: {
      type: String,
      default: 'top'
    },
    /**
     * 触发距离
     */
    offsetTop: {
      type: [String, Number],
      default: 0
    },
    /**
     * 置顶层级
     */
    zIndex: {
      type: [String, Number],
      default: 0
    }
  },
  setup (props, { emit }:SetupContext) {
    const selfDom = ref<HTMLDivElement>()
    const self = reactive<{
      width: number;
      height: number;
    }>({
      width: 0,
      height: 0
    })
    const isSticky = ref(false)
    const selfStyle = computed(() => {
      const style = {
        width: self.width + 'px',
        height: self.height + 'px'
      }
      return isSticky.value ? style : {}
    })
    const selfContentStyle = computed(() => {
      const style = {
        position: 'fixed',
        top: props.offsetTop + 'px',
        width: self.width + 'px',
        height: self.height + 'px'
      }
      return isSticky.value ? style : {}
    })

    const onScroll = (e: any) => {
      const { scrollTop } = e.target
      const { offsetTop } = selfDom.value!
      if (offsetTop - Number(props.offsetTop) <= scrollTop) {
        if (isSticky.value !== true) {
          isSticky.value = true
          emit('change', isSticky.value)
        }
      } else {
        if (isSticky.value !== false) {
          isSticky.value = false
          emit('change', isSticky.value)
        }
      }
      emit('scorll', {
        scrollTop,
        isFixed: isSticky.value
      })
    }
    const init = () => {
      const { clientWidth: selfWidth, clientHeight: selfHeight } = selfDom.value!;
      [self.width, self.height] = [selfWidth, selfHeight]
      const scrollElement = getScrollParent(selfDom.value!)
      useEvent('scroll', onScroll, { target: scrollElement })
    }
    onMounted(init)
    return {
      selfDom,
      selfStyle,
      selfContentStyle
    }
  }
})
</script>
