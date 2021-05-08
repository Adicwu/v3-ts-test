<template>
  <div class="content">
    <AwCropper ref="awCropper"/>
    <img :src="imgPath" alt="" width="300">
    <button @click="$refs.awCropper.choseImg">重新选择图片</button>
    <button @click="getData">获取裁剪后数据</button>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import AwCropper from './components/AwCropper/AwCropper.vue'
export default defineComponent({
  name: 'App',
  components: {
    AwCropper
  },
  setup () {
    const awCropper = ref<typeof AwCropper>()
    const imgPath = ref<string>('')
    const getData = async () => {
      const data = await awCropper.value!.getImageData({}, 'path')
      imgPath.value = data
    }
    return {
      awCropper,
      getData,
      imgPath
    }
  }
})
</script>
<style>
* {
  padding: 0;
  margin: 0;
}
.content{
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
