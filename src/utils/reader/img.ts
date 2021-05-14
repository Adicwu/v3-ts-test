/**
 * 读取图片主色调
 * @param src 图片地址
 * @returns rgb(x,x,x)
 */
export function readImgThemeColor (src:string): Promise<string> {
  const image = new Image()
  image.src = src

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  return new Promise((resolve, reject) => {
    image.onload = () => {
      try {
        // 设置基台信息
        const { width, height } = image
        const scaleRect = width * height
        canvas.width = width
        canvas.height = height

        // 绘制并获取结果
        ctx!.drawImage(image, 0, 0)
        const imgData = (ctx!.getImageData(0, 0, canvas.width, canvas.height)).data
        const imgDataLen = imgData.length

        // 色点转换 间隔为4
        const colorPointOffset = 4
        let [sumR, sumG, sumB] = [0, 0, 0]
        for (let i = 0; i < imgDataLen; i += colorPointOffset) {
          const r = imgData[i]
          const g = imgData[i + 1]
          const b = imgData[i + 2]
          sumR += r
          sumG += g
          sumB += b
        }
        const avgR = Math.round(sumR / scaleRect)
        const avgG = Math.round(sumG / scaleRect)
        const avgB = Math.round(sumB / scaleRect)

        const mainColor = `rgb(${avgR}, ${avgG}, ${avgB})`
        resolve(mainColor)
      } catch (error) {
        reject(error)
      }
    }
    image.onerror = reject
  })
}
