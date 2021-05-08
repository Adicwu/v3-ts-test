/**
 * 将file转换为base64
 * @param file
 * @returns
 */
export function fileToBase64 (file: File): Promise<string> {
  const render = new FileReader()
  render.readAsDataURL(file)
  return new Promise((resolve: (e: string) => void, reject) => {
    render.onload = () => {
      resolve(render.result!.toString())
    }
    render.onerror = reject
  })
}
/**
 * 将blob转换为base64
 * @param blob
 * @returns
 */
export function blobToBase64 (blob: Blob): Promise<string> {
  const render = new FileReader()
  return new Promise((resolve, reject) => {
    render.readAsDataURL(blob)
    render.onload = (e: any) => {
      resolve(e.target.result)
    }
    render.onerror = reject
  })
}
