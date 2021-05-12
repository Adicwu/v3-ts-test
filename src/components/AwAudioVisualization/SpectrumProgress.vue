<template>
  <div class="spectrum-progress" ref="selfDom">
    <input type="file" @change="onFileChanged" />
    <div class="spectrum-progress__content">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>
<script lang="ts">
import { CSSProperties, defineComponent, onMounted, reactive, ref } from 'vue'
function wait (delay = 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}
function averageSplit (arr: any[], limit = 3) {
  const result = []
  const arrLen = arr.length
  for (let i = 0, len = arrLen; i < len; i += limit) {
    result.push(arr.slice(i, i + limit))
  }
  return result
}
async function arrayDelayLoop (arr: any[][], callback: (item: any, index: number) => void, delay = 300) {
  const cur = arr.shift()
  if (cur) {
    cur.forEach(callback)
    console.log('wait')
    await wait(delay)
    arrayDelayLoop(arr, callback, delay)
  } else {
    console.log('end')
  }
}
export default defineComponent({
  name: 'SpectrumProgress',
  setup () {
    const canvas = ref<HTMLCanvasElement>()
    const selfDom = ref<HTMLElement>()

    const self = reactive({
      width: 0,
      height: 0
    })

    onMounted(() => {
      const { clientWidth, clientHeight } = selfDom.value!
      canvas.value!.width = self.width = clientWidth
      canvas.value!.height = self.height = clientHeight
    })

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
        context.decodeAudioData(encodedBuffer, (decodedBuffer) => {
          // 创建数据缓存节点
          const dataSource = context.createBufferSource()
          // 加载缓存
          dataSource.buffer = decodedBuffer
          // 连接播放器节点destination，中间可以连接其他节点，比如音量调节节点createGain()，
          // 频率分析节点（用于傅里叶变换）createAnalyser()等等
          dataSource.connect(context.destination)
          // 开始播放
          dataSource.start()
          // peaks.value = getPeaks(dataSource.buffer, 30)
          // console.log(peaks.value)
          drawSpectrum(getPeaks(dataSource.buffer, 4))
          // console.log(dataSource.buffer.getChannelData(0))
        })
      }
    }
    const drawSpectrum = (peaks: number[]) => {
      const ctx = canvas.value!.getContext('2d')
      if (!ctx) return
      const offsetX = 1
      const offsetY = 400
      const loop: {
        limit: number;
        cur: number;
        count: number;
        group: number[][];
      } = {
        limit: peaks.length / 40,
        cur: 0,
        count: peaks.length,
        group: []
      }
      loop.group = averageSplit(peaks, loop.limit)
      console.log(loop, 'start')
      arrayDelayLoop(loop.group, (peak) => {
        loop.cur++
        const x = offsetX * loop.cur
        const y = Math.abs(Number(peak.toFixed(4))) * (offsetY * 1.4)
        const yLimit = (offsetY - y / 2)
        const grd = ctx.createLinearGradient(x, yLimit, x, yLimit + y)
        grd.addColorStop(0, '#24dae2')
        grd.addColorStop(1, '#00f59a')
        ctx.strokeStyle = grd
        ctx.moveTo(x, yLimit)
        ctx.lineTo(x, yLimit + y)
        ctx.stroke()
      }, 300)
    }
    return {
      onFileChanged,
      computePeakStyle,
      canvas,
      selfDom
    }
  }
})
</script>
<style lang="less" scoped>
.spectrum-progress {
  position: relative;
  width: 95vw;
  height: 80vh;
  border: 2px solid #000;
  input {
    position: absolute;
  }
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
