<template>
  <div class="content">
    <AwSwipe class="swipe" :unActiveStyle="{
      scale: 0.7
    }">
      <AwSwipeItem
        class="swipe-item"
        v-for="item in cards"
        :key="item"
        :style="{ background: item }"
      />
    </AwSwipe>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import AwSwipe from '@/components/AwSwiper/AwSwipe.vue'
import AwSwipeItem from '@/components/AwSwiper/AwSwipeItem.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
export default defineComponent({
  name: 'App',
  components: {
    AwSwipe,
    AwSwipeItem
  },
  setup () {
    const cards = [
      'red',
      'black',
      'pink',
      'green',
      'blue',
      'yellow'
    ]
    return {
      cards
    }
  }

})
</script>
<style lang="less">
* {
  padding: 0;
  margin: 0;
}
.content {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .swipe {
    width: 800px;
    height: 400px;
    overflow: hidden;
    &-item {
      width: 260px;
      height: 260px;
    }
  }
}
</style>
