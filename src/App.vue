<template>
  <div class="content">
    <AwEditor v-model="val" @save="xxx">
      <template #header>
        <b>readme.md</b>
      </template>
    </AwEditor>
    <!-- <div class="content-show ql-snow" v-html="val"></div> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import AwEditor from '@/components/AwEditor/AwEditor.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
export default defineComponent({
  name: 'App',
  components: {
    AwEditor
  },
  setup () {
    const val = ref('')
    const xxx = (e: any) => {
      console.log(e, 'xxx')
    }
    return {
      val,
      xxx
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
  &-show {
    margin-top: 60px;
  }
}
</style>
