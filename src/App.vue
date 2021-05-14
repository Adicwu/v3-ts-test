<template>
  <div class="content" >
    <img src="@/assets/test2.png" alt="" v-img-theme-color>
  </div>
</template>
<script lang="ts">
import ImgThemeColor from '@/directs/imgThemeColor.direct'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'App',
  directives: {
    ImgThemeColor
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
  img{
    width: 600px;
    box-shadow: 7px 8px 16px var(--theme-color);
  }
}
</style>
