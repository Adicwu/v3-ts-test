<template>
  <div class="aw-amazing">
    <div class="bg-shadow"></div>
    <div class="colorful-stripe"></div>
    <div class="g-loading-line"></div>
    <div class="text-magic" data-word="Adic Wu">
      Adic Wu
      <div class="white"></div>
    </div>
    <div class="wave"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'AwAmazing'
})
</script>
<style lang="less">
@size: 4;
@gap: 20px;
.aw-amazing {
  position: relative;
  width: 100%;
  height: 100%;
  padding: @gap;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(@size, 1fr);
  grid-template-rows: repeat(@size, 1fr);
  justify-items: center;
  align-items: center;
  gap: @gap;
  .bg-shadow {
    position: relative;
    width: 90%;
    height: 90%;
    background: url("@/assets/test3.png");
    background-size: cover;
    background-position: center;
    &::before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      background: inherit;
      background-position: inherit;
      filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5)) blur(20px);
      z-index: -1;
    }
  }
  .colorful-stripe {
    width: 90%;
    height: 90%;
    color: #fff;
    border-radius: 0.5em;
    background: linear-gradient(limegreen, transparent),
      linear-gradient(90deg, skyblue, transparent),
      linear-gradient(-90deg, coral, transparent);
    background-blend-mode: screen;
    animation: stripe 5s infinite alternate linear;
    @keyframes stripe {
      100% {
        filter: hue-rotate(360deg);
      }
    }
  }
  .g-loading-line {
    position: relative;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: auto;
    transform: rotate(360deg);
    animation: rotate 45s infinite linear;

    &::before {
      position: absolute;
      content: "";
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      box-sizing: border-box;
      border-radius: 50%;
      border-top: 3px solid #000;
      border-left: 3px solid #000;
      border-bottom: 3px solid transparent;
      border-right: 3px solid transparent;
      transform: rotate(720deg);
      animation: rotate 3s infinite ease-out;
    }

    &::after {
      position: absolute;
      content: "";
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      box-sizing: border-box;
      border-radius: 50%;
      border-bottom: 7px solid transparent;
      border-right: 7px solid transparent;
      border-top: 7px solid #fff;
      border-left: 7px solid #fff;
      transform: rotate(720deg);
      animation: rotate 3s infinite ease-in-out;
    }

    @keyframes rotate {
      100% {
        transform: rotate(0deg);
      }
    }
  }
  .text-magic {
    position: relative;
    width: 300px;
    font-size: 36px;

    .white {
      position: absolute;
      left: 0;
      top: 15px;
      width: 100%;
      height: 3px;
      background: #fff;
      z-index: 4;
      animation: whiteMove 3s ease-out infinite;
    }

    &::before {
      content: attr(data-word);
      position: absolute;
      top: 0;
      left: 0.5px;
      height: 0px;
      color: rgba(0, 0, 0, 0.9);
      overflow: hidden;
      z-index: 2;
      animation: redShadow 1s ease-in infinite;
      filter: contrast(200%);
      text-shadow: 0.1px 0 0 red;
    }

    &::after {
      content: attr(data-word);
      position: absolute;
      top: 0;
      left: -3px;
      height: 36px;
      color: rgba(0, 0, 0, 0.8);
      overflow: hidden;
      z-index: 3;
      background: rgba(255, 255, 255, 0.9);
      animation: redHeight 1.5s ease-out infinite;
      filter: contrast(200%);
    }

    @keyframes redShadow {
      20% {
        height: 32px;
      }
      60% {
        height: 6px;
      }
      100% {
        height: 42px;
      }
    }

    @keyframes redHeight {
      20% {
        height: 42px;
      }
      35% {
        height: 12px;
      }
      50% {
        height: 40px;
      }
      60% {
        height: 20px;
      }
      70% {
        height: 34px;
      }
      80% {
        height: 22px;
      }
      100% {
        height: 0px;
      }
    }

    @keyframes whiteMove {
      8% {
        top: 38px;
      }
      10% {
        top: 8px;
      }
      12% {
        top: 42px;
      }
      99% {
        top: 36px;
      }
    }
  }
  .wave {
    position: relative;
    width: 200px;
    height: 200px;
    background-image: url("@/assets/test3.png");
    background-position: center;
    overflow: hidden;

    &::before,
    &::after {
      content: "";
      position: absolute;
      background-image: inherit;
      background-position: inherit;
      border-radius: 50%;
    }
    .wa&::before {
      z-index: 2;
      animation: wave 2s ease-out infinite;
    }
    &::after {
      z-index: 3;
      animation: wave 2s ease-out 0.2s infinite;
    }
    @keyframes wave {
      0% {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1.4);
        width: 30px;
        height: 30px;
      }
      50% {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1);
        width: 240px;
        height: 240px;
      }
      100% {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(1);
        width: 240px;
        height: 240px;
      }
    }
  }
}
</style>
