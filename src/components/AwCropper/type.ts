import Cropper from 'cropperjs'
export interface Preview {
  origin: string;
  path: string;
}
export interface CropperOptions {
  /**
   * 宽高比例
   * 默认自由比例，格式为 x / y
   * 默认 16 / 9
   */
  aspectRatio?: number;
  /**
   * 视图模式
   * 0 无限制; 1 裁剪框在图片内; 2 ？; 3 图片限制在外框
   * 默认 3
   */
  viewMode?: 0 | 1 | 2 | 3;
  /**
   * 是否显示裁剪框内虚线
   * 默认 false
   */
  guides?: boolean;
  /**
   * 鼠标在背景图拖动是操作
   * crop 创建新裁剪框；move 移动背景；none 无操作
   * 默认 move
   */
  dragMode?: 'crop' | 'move' | 'none';
  /**
   * 在裁剪框外是否设置黑色阴影
   * 默认 true
   */
  modal?: boolean;
  /**
   * 裁剪框初始化大小（百分比格式，值为 0-1）
   * 默认0.8
   */
  autoCropArea?: number;
  /**
   * 裁剪框是否可移动
   * 默认 true
   */
  cropBoxMovable?: boolean;
  /**
  * 裁剪框是否可改变大小
  * 默认 true
  */
  cropBoxResizable?: boolean;
  /**
   * 裁剪背景是否存在
   * 默认 true
   */
  background?: boolean;
  /**
   * 裁剪框内是否显示中心指示器
   * 默认 true
   */
  center?: boolean;
}
export interface CroppedCanvasOptions {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  fillColor?: string; // 背景填充色，默认transparent
  imageSmoothingEnabled?: boolean; // 图像平滑，默认true
  imageSmoothingQuality?: 'low' | 'medium' | 'high'; // 裁剪后图片质量，默认low
}
export interface AwCropperProps {
  options: CropperOptions;
  width: string;
  height: string;
  cropShape: 'square' | 'circle' | string;
}
export interface CropperData {
  instance: Cropper | null | any,
  isInit: boolean;
  rotate: number;
}
export type Emit = (e: string, arg: any) => void
