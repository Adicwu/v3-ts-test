<template>
  <div class="content">
    <AwslideX style="width: 600px;">
      <AwslideItem v-for="item in 10" :key="item">
        <div class="item"></div>
      </AwslideItem>
    </AwslideX>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import AwslideX from '@/components/AwSlide/AwslideX.vue'
import AwslideItem from '@/components/AwSlide/AwslideItem.vue'
export default defineComponent({
  name: 'App',
  components: {
    AwslideX,
    AwslideItem
  },
  setup () {
    return {
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
  background: #333;
  // flex-direction: column;
  .item{
    width: 200px;
    height: 200px;
    border-radius: 50%;
    padding: 10px;
    box-sizing: border-box;
    background: linear-gradient(to bottom,#fff,#def);
    background-clip: content-box;
  }
}
</style>
