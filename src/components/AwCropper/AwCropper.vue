<template>
  <div class="aw-cropper" :style="selfStyle">
    <input type="file" ref="fileDom" accept="image/*" @change="onFileChanged" />
    <img :src="preview.origin" alt="" ref="imgDom" @load="replaceCropper" />
  </div>
</template>
<script lang="ts">
import { computed, CSSProperties, defineComponent, nextTick, reactive, ref } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { fileToBase64, blobToBase64 } from './utils'
import { Preview, CropperOptions, CroppedCanvasOptions, AwCropperProps, Emit, CropperData } from './type'
// cropperjs 模块
function cropperModule (props: AwCropperProps, preview: Preview, emit: Emit) {
  const { options, cropShape } = props
  const imgDom = ref<HTMLImageElement>()
  const cropper = reactive<CropperData>({
    instance: null,
    isInit: false,
    rotate: 0
  })
  // 设置crop裁剪框样式
  const setCropStyle = () => {
    const el: HTMLElement | null = cropper.instance!.cropBox
    if (!el) return
    if (cropShape === 'circle') {
      const styles = {
        borderRadius: '50%',
        outlineColor: 'rgba(0,0,0,0)',
        border: '1px solid #fff'
      }
      const crop: HTMLElement | null = el.querySelector('.cropper-view-box')
      if (!crop) return
      (el.querySelector('.cropper-face')! as HTMLElement).style.backgroundColor = 'unset'
      Object.entries(styles).forEach(([name, value]: [string, string]) => {
        (crop.style as any)[name] = value
      })
    } else {
      if (typeof options.cropBoxResizable === 'boolean' && !options.cropBoxResizable) {
        el.style.opacity = '0'
      }
    }
  }
  // 初始化裁剪器
  const cropperInit = (callback?: () => void) => {
    cropper.instance = new Cropper(imgDom.value!, {
      aspectRatio: 16 / 9,
      viewMode: 3,
      dragMode: 'move',
      guides: false,
      ...options,
      ready () {
        cropper.isInit = true
        callback && callback()
      }
    })
  }
  // 加载裁剪器
  const replaceCropper = () => {
    emit('replace', preview.origin)
    if (!cropper.isInit) {
      cropperInit(() => {
        emit('init', cropper.instance)
        setCropStyle()
      })
    } else if (cropper.instance !== null) {
      const imgPath = preview.origin
      preview.origin = '' // 防止图片节点的src与将要替换的src相同，会导致死循环
      imgPath && cropper.instance.replace(imgPath, false)
    }
  }
  /**
   * 获取裁剪结果
   * @param options getCroppedCanvas的参数，用于处理裁剪后图片质量
   * @param type 返回的结果类型 Blob | string | FormData
   * @returns Promise
   */
  const getImageData = (options: CroppedCanvasOptions, type = 'Blob') => {
    return new Promise((resolve, reject) => {
      cropper.instance!.getCroppedCanvas(options).toBlob((blob: Blob | null) => {
        if (blob) {
          let result: Blob | FormData | string = blob
          switch (type) {
            case 'FormData': {
              const fromData = new FormData()
              fromData.append('croppedImage', blob)
              result = fromData
              resolve(result)
              break
            }
            case 'path': {
              blobToBase64(blob).then((res: string) => {
                result = res
                resolve(result)
              })
              break
            }
            default: resolve(result)
          }
        } else {
          reject(new Error('bad blob'))
        }
      })
    })
  }
  /**
   * 图片旋转
   * @param type 旋转方向 smooth 顺时针；adverse 逆时针；默认 重置旋转
   * @param deg 旋转角度 deg为默认单位
   */
  const rotate = (type = 'smooth', deg = 90) => {
    switch (type) {
      case 'smooth': {
        cropper.rotate += deg
        break
      }
      case 'adverse': {
        cropper.rotate -= deg
        break
      }
      default: {
        cropper.rotate = 0
      }
    }
    cropper.instance!.rotateTo(cropper.rotate)
  }
  /**
   * 重置裁剪所有状态
   */
  const reset = () => cropper.instance!.reset()
  return {
    imgDom,
    replaceCropper,
    getImageData,
    rotate,
    reset
  }
}
// file处理 模块
function fileModule (preview: Preview) {
  const fileDom = ref<HTMLInputElement>()
  // file节点 change事件
  const onFileChanged = async (e: Event) => {
    const { accept, files } = e.target as HTMLInputElement
    if (files!.length === 1 && accept.includes('image')) {
      try {
        const imgPath = await fileToBase64(files![0])
        preview.origin = imgPath
      } catch (error) {
        console.log(error, '图片处理错误')
      }
    }
  }
  // 手动触发的图片选择
  const choseImg = () => {
    fileDom.value!.click()
  }
  return {
    onFileChanged,
    fileDom,
    choseImg
  }
}
// 样式 模块
function styleModule (props: AwCropperProps) {
  const { width, height } = props
  const selfStyle = computed<CSSProperties>(() => {
    return {
      width,
      height
    }
  })
  return {
    selfStyle
  }
}
export default defineComponent({
  name: 'AwCropper',
  props: {
    /**
     * Cropper 实例化对象的第二参数
     * 详情参考 https://github.com/fengyuanchen/cropperjs#options
     */
    options: {
      type: Object,
      default: () => ({} as CropperOptions)
    },
    /**
     * 组件自身宽
     */
    width: {
      type: String,
      default: '600px'
    },
    /**
     * 组件自身高
     */
    height: {
      type: String,
      default: '300px'
    },
    /**
     * 裁剪框形状
     * square | circle
     */
    cropShape: {
      type: String,
      default: 'square'
    }
  },
  setup (props: AwCropperProps, { emit }) {
    const preview = reactive<Preview>({
      path: '',
      origin: ''
    })
    return {
      preview,
      ...fileModule(preview),
      ...cropperModule(props, preview, emit),
      ...styleModule(props)
    }
  }
})
</script>
<style lang="less" scoped>
.aw-cropper {
  position: relative;
  background: #000;
  .hide {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  & > input[type="file"] {
    .hide();
    cursor: pointer;
    z-index: 3;
  }
  & > img {
    .hide();
    max-width: 100%;
  }
  ::v-deep(.cropper-container) {
    position: relative;
    z-index: 6;
  }
}
</style>
