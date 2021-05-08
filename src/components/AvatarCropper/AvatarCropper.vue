<template>
  <div class="avatar-cropper">
    <AwCropper
      ref="awCropper"
      width="100%"
      height="100%"
      cropShape="circle"
      :options="cropperOptions"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import AwCropper from '@/components/AwCropper/AwCropper.vue'
import { CropperOptions } from '@/components/AwCropper/type'
export default defineComponent({
  name: 'AvatarCropper',
  components: {
    AwCropper
  },
  setup () {
    const cropperOptions: CropperOptions = {
      aspectRatio: 1 / 1,
      viewMode: 1,
      autoCropArea: 0.76,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      center: false
    }
    return {
      cropperOptions
    }
  }
})
</script>
<style lang="less" scoped>
.avatar-cropper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3333;
  width: 100%;
  height: 100vh;
  background: #000;
}
</style>
