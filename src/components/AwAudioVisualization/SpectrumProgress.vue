<template>
  <div class="spectrum-progress">
    <input type="file" @change="onFileChanged" />
    <div class="spectrum-progress__content">
      <canvas ref="canvas"></canvas>
      <!-- <li
        v-for="(item, index) in peaks"
        :style="computePeakStyle(item)"
        :key="index"
      ></li> -->
    </div>
  </div>
</template>
<script lang="ts">
import { CSSProperties, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SpectrumProgress',
  setup () {
    const peaks = ref<number[]>([])
    const canvas = ref<HTMLCanvasElement>()

    const computePeakStyle = (peak: number) => {
      peak = peak * 1000
      return {
        height: `${Math.abs(peak)}px`
      } as CSSProperties
    }
    const onFileChanged = (e: Event) => {
      const { files } = e.target as HTMLInputElement
      render(files![0])
    }
    const getPeaks = (buffer: AudioBuffer, perSecPx = 100) => {
      const { sampleRate, length } = buffer
      // 每一份的点数=44100 / 100 = 441
      const sampleSize = ~~(sampleRate / perSecPx)
      const first = 0
      const last = ~~(length / sampleSize)
      const peaks: any[] = []
      // 为方便起见只取左声道
      const chan = buffer.getChannelData(0)
      for (let i = first; i <= last; i++) {
        const start = i * sampleSize
        const end = start + sampleSize
        let min = 0
        let max = 0
        for (let j = start; j < end; j++) {
          const value = chan[j]
          if (value > max) {
            max = value
          }
          if (value < min) {
            min = value
          }
        }
        // 波峰
        peaks[2 * i] = max
        // 波谷
        peaks[2 * i + 1] = min
      }
      return peaks
    }
    const render = (file: File) => {
      // 读取音频文件.mp3 .flac .wav等等
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = (evt: Event) => {
        // 编码过的音频数据
        const encodedBuffer = (evt.currentTarget as any).result
        // 下面开始处理读取到的音频数据
        // 创建环境对象
        const context = new AudioContext()
        // 解码
        context.decodeAudioData(encodedBuffer, decodedBuffer => {
          // 创建数据缓存节点
          const dataSource = context.createBufferSource()
          // 加载缓存
          dataSource.buffer = decodedBuffer
          // 连接播放器节点destination，中间可以连接其他节点，比如音量调节节点createGain()，
          // 频率分析节点（用于傅里叶变换）createAnalyser()等等
          dataSource.connect(context.destination)
          // 开始播放
          dataSource.start()
          peaks.value = getPeaks(dataSource.buffer)
          // console.log(dataSource.buffer.getChannelData(0))
        })
      }
    }
    const drawSpectrum = () => {
      const ctx = canvas.value!.getContext('2d')
      peaks.value.forEach((peak:number) => {
        ctx.beginPath()
        ctx.closePath()
      })
    }
    return {
      onFileChanged,
      peaks,
      computePeakStyle,
      canvas
    }
  }
})
</script>
<style lang="less" scoped>
.spectrum-progress {
  position: relative;
  padding: 16px;
  border: 2px solid #000;
  &__content {
    // display: flex;
    // li {
    //   width: 2px;
    //   background: red;
    //   margin-right: 2px;
    // }
  }
}
</style>
