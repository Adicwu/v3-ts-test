<template>
  <div class="content">
    <AwAmazing />
    <!-- <div class="content__inner"></div> -->
    <!-- <img src="@/assets/test2.png" alt="" > -->
  </div>
</template>
<script lang="ts">
import ImgThemeColor from '@/directs/imgThemeColor.direct'
import AwAmazing from '@/components/AwAmazing/AwAmazing.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  directives: {
    ImgThemeColor
  },
  components: {
    AwAmazing
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
}
</style>
