import { ComponentPublicInstance } from 'vue'
export type ComponentInstance = ComponentPublicInstance<{}, any>;
export interface SwipeChild {
    list: any[];
    dom: any[];
    width: number;
    offsetX: number;
}
export interface SwipeTrack {
    offsetX: number;
    width: number;
}
export interface SwipeTouch {
    startX: number;
    startY: number;
    moveX: number;
    endX: number;
    progress: number;
    isTouch: boolean;
    direction: string;
}
export interface Swipe {
    index: number;
    width: number;
    syncIndex: number;
}
export interface SwipeProvide {
    awSwipe: ComponentInstance;
}