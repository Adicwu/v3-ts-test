<template>
  <div class="aw-editor" ref="selfDom">
    <div class="aw-editor__edit" @click="editSwitcher">
      <i
        class="fa"
        :class="[!edit.enable ? 'fa-pencil-square-o' : 'fa-check-square-o']"
      ></i>
    </div>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <div class="aw-editor__header" v-show="!edit.enable">
        <slot name="header" />
      </div>
    </transition>
    <QuillEditor
      ref="editorComp"
      v-bind="$attrs"
      v-model:content="editorContent"
      :enable="edit.enable"
      :options="editorOptions"
      theme="snow"
      contentType="html"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import quillEmoji from 'quill-emoji'
Quill.register('modules/quillEmoji', quillEmoji)

export default defineComponent({
  name: 'AwEditor',
  components: {
    QuillEditor
  },
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  inheritAttrs: false,
  emits: {
    /**
     * 编辑器失去焦点
     */
    blur: null,
    /**
     * 编辑器聚焦
     */
    focus: null,
    /**
     * 编辑器初始化完成
     */
    ready: null,
    /**
     * 编辑器内容改变 相当于change
     */
    textChange: null,
    'update:modelValue': null,
    /**
     * 编辑器模式切换为只读时触发
     */
    save: null
  },
  setup (props, { emit }) {
    const editorComp = ref<typeof QuillEditor>()
    const selfDom = ref<HTMLElement>()
    const edit = reactive({
      enable: true
    })
    /**
     * 编辑器关键节点集合
     */
    const editEls = reactive<{
      [props: string]: HTMLElement | null
    }>({
      content: null,
      toolbar: null
    })

    /**
     * 编辑器配置
     */
    const editorOptions = {
      modules: {
        'emoji-toolbar': true,
        'emoji-shortname': true,
        toolbar: [
          ['bold', 'italic', 'underline', 'strike', 'emoji'], // toggled buttons
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['blockquote', 'code-block'],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ header: [2, 3, 4, 5, 6, false] }],
          [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
          [{ align: [] }]
          // [{ header: 1 }, { header: 2 }], // custom button values
          // [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          // [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          // [{ direction: 'rtl' }], // text direction
          // [{ font: [] }],
          // ['clean']
        ]
      }
    }

    const editorContent = computed({
      get: () => props.modelValue,
      set: (content: string) => emit('update:modelValue', content)
    })

    const styleInit = () => {
      editEls.content = selfDom.value!.querySelector('.ql-container')
      editEls.toolbar = editorComp.value!.$el.nextElementSibling
      editEls.toolbar!.style.transition = 'all 0.25s'
    }
    /**
     * 只读模式切换导致的样式改变
     * @param bool 是否为只读模式
     */
    const readModeStyler = (bool: boolean) => {
      editEls.toolbar!.style.opacity = bool ? '1' : '0'
      // editEls.toolbar!.style.display = bool ? 'block' : 'none'
      editEls.content!.style.borderColor = bool ? '#d1d5db' : 'rgba(0,0,0,0)'
    }
    /**
     * 只读模式切换
     */
    const editSwitcher = () => {
      edit.enable = !edit.enable
      readModeStyler(edit.enable)
      if (!edit.enable) emit('save', props.modelValue)
    }

    onMounted(styleInit)

    return {
      editorContent,
      editorOptions,
      editorComp,
      selfDom,
      edit,
      editSwitcher
    }
  }
})
</script>
<style lang="less" scoped>
@headerHeight: 20px;
.aw-editor {
  position: relative;
  width: 100%;
  padding-top: @headerHeight;
  box-sizing: border-box;
  &__edit {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 33;
    i {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 42px;
      height: 42px;
      background: #fff;
      box-shadow: 0 4px 8px rgb(0 0 0 / 0.2);
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      text-indent: 2px;
      &.fa-pencil-square-o {
        color: crimson;
      }
      &.fa-check-square-o {
        color: #5bdd5b;
      }
    }
  }
  &__header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 42px;
    padding-top: @headerHeight;
    animation-duration: 0.25s;
  }
  ::v-deep(.ql-container) {
    .ap {
      margin: 4px;
      transition: all 0.25s;
      &:hover {
        transform: scale(1.5);
      }
    }
  }
  ::v-deep(::-webkit-scrollbar) {
    width: 5px;
    height: 5px;
    position: fixed;
    &-track {
      background: transparent;
      border-radius: 5px;
      width: 5px;
      position: fixed;
    }
    &-thumb {
      background: #999;
      border-radius: 2px;
    }
  }
}
</style>
