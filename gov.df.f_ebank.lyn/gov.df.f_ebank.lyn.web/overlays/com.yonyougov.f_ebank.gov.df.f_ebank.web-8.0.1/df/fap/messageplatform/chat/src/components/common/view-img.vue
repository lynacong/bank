<template>
  <!-- 过渡动画 -->
  <!--<transition name="fade">-->
    <div class="img-view" @click="bigImg" @mousewheel="changeSize">
      <!-- 遮罩层 -->
      <div class="img-layer"></div>
      <div class="img-box">
        <img id="chat-big-img" :src="imgSrc" :style="imgStyle">
      </div>
    </div>
  <!--</transition>-->
</template>
<script>
  import {dragAble} from '../../util/util'
  export default {
    props: ['imgSrc'],
    data() {
      let imgStyle = {
//        width:
      }
      return {
        imgStyle
      }
    },
    methods: {
      bigImg() {
        // 发送事件
        this.$emit('clickit')
      },
      changeSize(e) {
        let commonImgStyle = {
          maxWidth: 'none'
        }
        let $img = $(this.$el).find('img')
        let w = $img.width()
        let h = $img.height()
        let flag = e.deltaY < 0 ? 1 : -1
//        console.log($img, w, h, e.deltaY)
        this.imgStyle = {
          ...commonImgStyle,
          width: w*(1+0.1*flag) + 'px',
          height: h*(1+0.1*flag) + 'px',
        }
      },
    },
    mounted() {
//      dragAble('#chat-big-img')
    },
  }
</script>
<style scoped>
  /*动画*/
  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s linear;
    transform: translate3D(0, 0, 0);
  }

  .fade-enter,
  .fade-leave-active {
    transform: translate3D(100%, 0, 0);
  }


  /* bigimg */

  .img-view {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
  }

  /*遮罩层样式*/
  .img-view .img-layer {
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .img-view .img-box {
    height: 100%;
    width: 100%;
  }
  /*不限制图片大小，实现居中*/
  .img-view .img-box img {
    max-width: 100%;
    /*display: block;*/
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
  }
</style>