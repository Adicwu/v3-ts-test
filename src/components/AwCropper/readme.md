### Cropper Attributes

| 参数    | 说明                         | 类型   | 可选值                                                     | 默认值 |
| ------- | ---------------------------- | ------ | ---------------------------------------------------------- | ------ |
| options | Cropper 实例化对象的第二参数 | object | 详情参考 https://github.com/fengyuanchen/cropperjs#options | {}     |
| width   | 组件自身宽                   | string | ——                                                         | 600px  |
| height  | 组件自身高                   | string | ——                                                         | 300px  |

### Cropper Events

| 事件名称 | 说明                       | 回调参数                         |
| -------- | -------------------------- | -------------------------------- |
| init     | 裁剪框在有图片时初始化触发 | cropperjs的原对象                |
| replace  | 裁剪图片改变时触发         | 当前裁剪图片的源路径，base64格式 |

### Cropper Methods

| 方法名       | 说明               | 参数                                                         |
| ------------ | ------------------ | ------------------------------------------------------------ |
| choseImg     | 手动触发的图片选择 | ——                                                           |
| getImageData | 获取裁剪结果       | options getCroppedCanvas的参数，用于处理裁剪后图片质量；type 返回的结果类型 Blob \| string \| FormData；返回Promise |
| rotate       | 图片旋转           | type 旋转方向(smooth 顺时针、adverse 逆时针、默认 重置旋转)， deg 旋转角度 deg为默认单位 |
| reset        | 重置裁剪的所有状态 | ——                                                           |

