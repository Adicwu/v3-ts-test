<template>
  <div class="content">
    <AwCropper
      ref="awCropper"
      width="400px"
      height="400px"
      :options="{
        aspectRatio: 1 / 1,
        modal: false,
        autoCropArea: 1,
        cropBoxMovable: false,
        cropBoxResizable: false,
      }"
    />
    <img :src="imgPath" alt="" width="300" />
    <button @click="$refs.awCropper.choseImg">重新选择图片</button>
    <button @click="getData">获取裁剪后数据</button>
    <button @click="$refs.awCropper.rotate('smooth')">+</button>
    <button @click="$refs.awCropper.rotate('adverse')">-</button>
    <button @click="$refs.awCropper.reset()">re</button>
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
    const say = (e: any) => {
      console.log(e)
    }
    const getData = async () => {
      const data = await awCropper.value!.getImageData({}, 'path')
      imgPath.value = data
    }
    return {
      awCropper,
      getData,
      imgPath,
      say
    }
  }
})
</script>
<style>
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
button{
  margin: 16px;
  padding: 0 16px;
}
</style>
