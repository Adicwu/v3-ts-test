<template>
  <div class="content">
    <AvatarCropper />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import AvatarCropper from './components/AvatarCropper/AvatarCropper.vue'
export default defineComponent({
  name: 'App',
  components: {
    AvatarCropper
  },
  setup () {
    return {

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
button {
  margin: 16px;
  padding: 0 16px;
}
</style>
