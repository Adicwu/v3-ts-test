<template>
  <div class="aw-slide-item">
    <slot/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AWSLIDE_KEY } from './const'
import { useParent } from '@/utils/useRelation/index'
export default defineComponent({
  name: 'AwslideItem',
  setup () {
    useParent(AWSLIDE_KEY)
    return {}
  }
})
</script>
<style lang="less" scoped>
.aw-slide-item{
  // display: inline-block;
}
</style>
