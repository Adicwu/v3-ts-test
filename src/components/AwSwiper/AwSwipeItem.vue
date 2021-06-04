<template>
  <div
    class="aw-swipe-item"
    :style="{ ...selfStyle, ...selfOffset }"
    :class="selfClass"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, Ref } from 'vue'
import { useParent } from '@/utils/useRelation/index'
import { AWSWIPE_KEY } from './AwSwipe.vue'
import { SwipeProvide, ComponentInstance } from './type'
function linkFather () {
  return useParent<SwipeProvide>(AWSWIPE_KEY)
}
function init (): {
  key: Ref<number>;
  awSwipe: ComponentInstance;
  } {
  const { index: key, parent } = linkFather()
  const { awSwipe }: SwipeProvide = parent
  return {
    key,
    awSwipe
  }
}
function styleHandler (awSwipe: ComponentInstance, key: Ref<number>) {
  const active = computed(() => awSwipe.swipe.syncIndex)
  const childLength = computed(() => awSwipe.childLength)
  const selfClass = computed(() => {
    const { isTouch } = awSwipe.touch
    return {
      'aw-swipe-item__transition': !isTouch
    }
  })

  // 计算无缝轮播
  const computedOffsetX = () => {
    const active = awSwipe.swipe.index
    const { width: offsetX } = awSwipe.track
    if (
      active === 0 &&
      [childLength.value - 1, childLength.value - 2].includes(key.value)
    ) {
      return -offsetX
    } else if (active === childLength.value - 1 && [0, 1].includes(key.value)) {
      return offsetX
    } else {
      return 0
    }
  }
  // 是否为左右侧的item 节约性能
  const isNearby = () => {
    return [
      active.value + 1 === key.value, // 左
      active.value - 1 === key.value, // 右
      active.value === childLength.value - 1 && key.value === 0, // 边界
      active.value === 0 && key.value === childLength.value - 1 // 边界
    ].some((nearby: boolean) => nearby)
  }
  // 计算当前过渡进度
  const computedTransform = (
    progress: number,
    result: number,
    origin: number
  ) => {
    return {
      high: result + (origin - result) * progress,
      low: origin - (origin - result) * progress
    }
  }
  // scale计算
  const computedScale = (progress: number, scale: number) => {
    let finalScale = `scale(${scale})`
    const { high, low } = computedTransform(progress, scale, 1)
    const scaleType = {
      high: `scale(${high})`,
      low: `scale(${low})`
    }
    if (active.value === key.value) {
      finalScale = scaleType.low
    } else if (isNearby()) {
      finalScale = scaleType.high
    }

    return finalScale
  }
  // translate计算
  const computedTranslate = (progress: number, y: string) => {
    let finalTranslate = `translateY(${y})`
    // 拆分单位 值
    const formatedY = {
      value: Number(y.match(/^(\d+(\.\d+)?)/g)![0]),
      unit: y.match(/(%|px|vw|vh|rem|em)/g)![0]
    }
    const { high, low } = computedTransform(progress, formatedY.value, 0)
    const yType = {
      high: `translateY(${high}${formatedY.unit})`,
      low: `translateY(${low}${formatedY.unit})`
    }
    if (active.value === key.value) {
      finalTranslate = yType.low
    } else if (isNearby()) {
      finalTranslate = yType.high
    }
    return finalTranslate
  }
  // 最终transform控制器
  const mixTransfrom = () => {
    const transform = []
    const {
      touch: { progress }
    } = awSwipe
    const { scale, y } = awSwipe.unActiveStyle
    if (typeof scale !== 'undefined') {
      transform.push(computedScale(progress, scale))
    }
    if (typeof y !== 'undefined') {
      transform.push(computedTranslate(progress, y))
    }
    return transform
  }

  return {
    computedOffsetX,
    mixTransfrom,
    selfClass
  }
}
export default defineComponent({
  name: 'AwSwipeItem',
  setup () {
    const { key, awSwipe } = init()
    const { computedOffsetX, mixTransfrom, selfClass } = styleHandler(
      awSwipe,
      key
    )

    // 过渡样式
    const selfStyle = computed(() => {
      return {
        transform: mixTransfrom().join(' ')
      }
    })
    // 无缝样式
    const selfOffset = computed(() => {
      const offsetX = computedOffsetX()
      return {
        left: `${offsetX}px`
      }
    })

    return {
      selfStyle,
      selfClass,
      selfOffset
    }
  }
})
</script>
<style lang="less" scoped>
.aw-swipe-item {
  display: inline-block;
  position: relative;
  height: 100%;
  &__transition {
    transition: transform 0.25s;
  }
}
</style>
