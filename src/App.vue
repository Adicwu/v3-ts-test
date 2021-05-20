<template>
  <div class="content">
    <button @click="add">add</button>
    <p>{{ fullName("adicw") }}</p>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'App',
  setup () {
    const count = ref(0)
    const add = () => count.value++
    const fullName = computed(() => (first: string) => count.value + ' - ' + first)
    return {
      fullName,
      add
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
}
</style>
