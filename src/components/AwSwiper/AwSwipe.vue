<template>
  <div class="aw-swipe" :class="{ 'aw-swipe__hide': !isLoad }" ref="swipeDom">
    <div
      class="aw-swipe__track"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
      @touchcancel="touchEnd"
      :style="trackStyle"
      :class="trackClass"
    >
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  getCurrentInstance
} from 'vue'
import { preventDefault, getDirection } from './util'
import { getRealStyle } from '@/utils/dom'
import { useChildren } from '@/utils/useRelation/index'
import { onWindowSizeChange } from '@/utils/useWindowSize'
import {
  ComponentInstance,
  SwipeChild,
  SwipeTrack,
  SwipeTouch,
  Swipe,
  SwipeProvide
} from './type'
export const AWSWIPE_KEY = Symbol('aw-swipe')
function linkChild () {
  const { children, linkChildren } = useChildren<ComponentInstance>(
    AWSWIPE_KEY
  )
  linkChildren({
    awSwipe: (getCurrentInstance() as any).proxy
  } as SwipeProvide)
  return {
    children
  }
}
export default defineComponent({
  name: 'AwSwipe',
  props: {
    stopPropagation: {
      type: Boolean,
      default: true
    },
    touchable: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 0.2
    },
    lazyLoadSize: {
      type: Number,
      default: 2
    },
    unActiveStyle: {
      type: Object,
      default: () => ({})
      // y: px %, scale: 0-1, opacity: 0-1,
    }
  },
  setup (props, { emit }) {
    const { children } = linkChild()
    const swipeDom = ref<HTMLDivElement>()
    const isLoad = ref(false)

    const child = reactive<SwipeChild>({
      list: [],
      width: 0,
      offsetX: 0,
      dom: []
    })
    const track = reactive<SwipeTrack>({
      offsetX: 0,
      width: 0
    })
    const swipe = reactive<Swipe>({
      width: 0,
      index: 0,
      syncIndex: 0
    })
    const touch = reactive<SwipeTouch>({
      startX: 0,
      startY: 0,
      moveX: 0,
      endX: 0,
      progress: 0,
      isTouch: false,
      direction: 'none'
    })

    const trackStyle = computed(() => {
      const { offsetX, width } = track
      return {
        width: `${width}px`,
        transform: `translate3d(${-offsetX}px, 0, 0)`
      }
    })
    const trackClass = computed(() => {
      const { isTouch } = touch
      return {
        'aw-swipe__track-transition': !isTouch
      }
    })
    const childLength = computed(() => child.list.length)

    // 初始化
    const computedData = () => {
      const activeSwipe: HTMLDivElement = child.dom[swipe.index]
      const { width: childWidth } = getRealStyle(activeSwipe)
      child.width = childWidth
      child.offsetX = (window.innerWidth - childWidth) / 2
      swipe.width = getRealStyle(swipeDom.value as HTMLElement).width
      track.width = child.list.length * child.width
      track.offsetX = touch.endX =
        (child.width - swipe.width) / 2 + swipe.index * child.width
      isLoad.value = true
    }
    const init = () => {
      child.dom = child.list.map(({ $el }: any) => $el)
      computedData()
    }

    // touch控制
    const move = (x: number) => {
      track.offsetX = touch.moveX = x
    }
    const touchProgress = (deltaX: number) => {
      const progress = (Math.abs(deltaX) / child.width).toFixed(4)
      touch.progress = Number(progress)
    }
    const onTransitionEnd = (callback: () => void) => {
      setTimeout(() => {
        callback()
      }, 250)
    }
    const setFinalOffset = (index: number) => {
      const { offsetX, width: itemWidth } = child
      touch.endX = track.offsetX = index * itemWidth - offsetX
      if (index >= childLength.value) {
        swipe.syncIndex = 0
        onTransitionEnd(() => {
          touch.isTouch = true
          touch.endX = track.offsetX = -offsetX
          swipe.index = 0
        })
      } else if (index < 0) {
        swipe.syncIndex = childLength.value - 1
        onTransitionEnd(() => {
          touch.isTouch = true
          touch.endX = track.offsetX =
            (childLength.value - 1) * itemWidth - child.offsetX
          swipe.index = childLength.value - 1
        })
      } else {
        swipe.index = swipe.syncIndex = index
      }
    }

    const touchStart = (e: TouchEvent) => {
      const { clientX, clientY } = e.touches[0]
      touch.isTouch = true
      touch.startX = clientX
      touch.startY = clientY
    }
    const touchMove = (e: TouchEvent) => {
      const { clientX, clientY } = e.touches[0]
      const { startX, startY, endX } = touch
      const deltaX: number = clientX - startX
      const deltaY: number = clientY - startY
      const direction: string = getDirection(
        Math.abs(deltaX),
        Math.abs(deltaY)
      )
      if (direction === 'horizontal') {
        preventDefault(e, props.stopPropagation)
        move(startX - clientX + endX)
        touchProgress(deltaX)
        touch.direction = clientX < startX ? 'left' : 'right'
      }
    }
    const touchEnd = (e: TouchEvent) => {
      touch.isTouch = false
      touch.progress = 0
      const { pageX: endX } = e.changedTouches[0]
      const { width: itemWidth } = child
      const { startX } = touch
      let index = swipe.index
      if (Math.abs(startX - endX) > itemWidth * props.limit) {
        startX > endX ? index++ : index--
      }
      setFinalOffset(index)
    }

    const resize = () => computedData()

    watch(
      () => swipe.index,
      (index) => {
        emit('change', index)
      },
      {
        immediate: true
      }
    )

    onWindowSizeChange(resize)
    onMounted(() => {
      child.list = children
      init()
    })

    return {
      trackStyle,
      trackClass,
      swipeDom,
      resize,
      touch,
      touchStart,
      touchMove,
      touchEnd,
      childLength,
      child,
      swipe,
      track,
      isLoad
    }
  }
})
</script>
<style lang="less" scoped>
.aw-swipe {
  position: relative;
  width: 100%;
  user-select: none;
  transition: opacity 0.3s;
  &__hide {
    opacity: 0;
  }
  &__track {
    // display: flex;
    height: 100%;
    &-transition {
      transition: transform 300ms;
    }
  }
}
</style>
