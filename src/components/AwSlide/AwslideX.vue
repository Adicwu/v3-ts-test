<template>
  <div class="aw-slide-x" ref="selfDom">
    <div class="aw-slide-content">
      <div class="aw-slide__inner" :class="innerClass" :style="innerStyle">
        <slot />
      </div>
    </div>
    <transition
      enter-active-class="fadeInLeft"
      leave-active-class="fadeOutLeft"
    >
      <div
        class="aw-slide__arrow aw-slide__arrow--left"
        v-show="arrowVisible('left')"
        @click="prev"
      >
        <i class="fa fa-angle-left"></i>
      </div>
    </transition>
    <transition
      enter-active-class="fadeInRight"
      leave-active-class="fadeOutRight"
    >
      <div
        class="aw-slide__arrow aw-slide__arrow--right"
        v-show="arrowVisible('right')"
        @click="next"
      >
        <i class="fa fa-angle-right"></i>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, ComputedRef, onMounted, reactive, ref, watch } from 'vue'
import { AWSLIDE_KEY } from './const'
import { useChildren } from '@/utils/useRelation/index'
import { onWindowSizeChange } from '@/utils/useWindowSize'
interface Slider {
  /** 当前激活下标 */
  active: number;
  /** 每屏最大内容数量 */
  perScreenChildcount: number;
}
function linkChild () {
  const { children, linkChildren } = useChildren(AWSLIDE_KEY)
  linkChildren({})
  const childrenEls = computed<HTMLElement[]>(() => children.map(item => item.$el))
  return {
    children,
    childrenEls
  }
}
function styleModule (childrenEls: ComputedRef<HTMLElement[]>, slider: Slider) {
  const selfDom = ref<HTMLElement>()

  const isTransition = ref(false)
  const childStyle = reactive({
    width: 0
  })
  const innerOffsetX = computed(() => slider.active * childStyle.width)
  const innerWidth = computed(() => childrenEls.value.length * childStyle.width)
  const innerStyle = computed(() => {
    return {
      width: `${innerWidth.value}px`,
      transform: `translateX(${-innerOffsetX.value}px)`
    } as CSSProperties
  })
  const innerClass = computed(() => ({
    'aw-slide__inner-transition': isTransition.value
  }))
  const arrowVisible = computed(() => (key: 'left' | 'right') => {
    if (key === 'left') {
      return slider.active !== 0
    } else if (key === 'right') {
      return (innerWidth.value - innerOffsetX.value) > slider.perScreenChildcount * childStyle.width
    } else {
      return true
    }
  })

  const initStyle = () => {
    childStyle.width = childrenEls.value[0].clientWidth
    slider.perScreenChildcount = (selfDom.value!.clientWidth / childStyle.width) | 0
    isTransition.value = true
  }

  onMounted(initStyle)
  onWindowSizeChange(initStyle)

  return {
    innerStyle,
    innerClass,
    arrowVisible,
    selfDom
  }
}
function controlModule (slider: Slider) {
  const next = () => {
    slider.active++
  }
  const prev = () => {
    slider.active--
  }
  return {
    next,
    prev
  }
}
export default defineComponent({
  name: 'AwslideX',
  emits: {
    /**
     * 轮播改变事件
     * @param active 当前下标
     */
    onChange: null
  },
  setup (props, { emit }) {
    const { children, childrenEls } = linkChild()
    const slider = reactive<Slider>({
      active: 0,
      perScreenChildcount: 0
    })
    watch(() => slider.active, (active:number) => {
      emit('onChange', active)
    }, {
      immediate: true
    })
    return {
      children,
      ...styleModule(childrenEls, slider),
      ...controlModule(slider)
    }
  }
})
</script>
<style lang="less" scoped>
.aw-slide-x {
  position: relative;
  .aw-slide {
    &-content {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    &__inner {
      display: flex;
      &-transition {
        transition: all 0.625s;
      }
    }
  }
  .aw-slide__arrow {
    @size: 40px;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: @size;
    height: @size;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    user-select: none;
    box-shadow: 0 0 6px rgb(0 0 0 / 0.1);
    animation-duration: .25s;
    i {
      font-size: 26px;
      color: #717171;
    }
    &--left {
      left: calc(-@size / 2);
    }
    &--right {
      right: calc(-@size / 2);
    }
  }
}
</style>
