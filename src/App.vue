<template>
  <div class="content">
    <SpectrumProgress />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import SpectrumProgress from './components/AwAudioVisualization/SpectrumProgress.vue'
export default defineComponent({
  name: 'App',
  components: {
    SpectrumProgress
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
