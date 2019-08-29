<template>
  <!-- 过渡动画 -->
  <!--<transition name="fade">-->
    <div class="img-view"
         @mousewheel="changeSize"
         @mousemove.prevent="mousemove"
         @mouseup="mouseup"
    >
      <!-- 遮罩层 -->
      <div class="img-layer"></div>
      <div class="img-box" >
        <img id="chat-big-img"
             :src="imgSrc" :style="imgStyle"
             @mousedown.prevent="mousedown"
        >

        <!--控制按钮-->
        <div class="control-btn">
          <span class="c-btn-item"  title="关闭" style="padding-right: 20px;" @click="closeImg"></span>
          <span class="c-btn-item item2"  title="旋转" @click="rotateImg"></span>
        </div>

      </div>
    </div>
  <!--</transition>-->
</template>
<script>
  import {dragAble} from '../../util/util'
  import TransferDom from '../../directives/transfer-dom'
  export default {
    props: ['imgSrc'],
    data() {
      let imgStyle = {
//        width:
      }
      return {
        imgStyle,
        canDrag: false,
        x: 0, // 鼠标的x
        y: 0, // 鼠标的y
        offset: {left: 0, top: 0}, // 当前图片左上角位置
        rotate: 0,
      }
    },
    directives: {TransferDom},
    methods: {
      mousedown(e) {
        this.canDrag = true
        // 获取图片的位置, 不能通过 $img.position()来获取, 旋转图片前后, $img.position()获取的值不一样
        this.offset = {left: parseInt(this.imgStyle.left), top: parseInt(this.imgStyle.top)}
        this.x = e.pageX
        this.y = e.pageY
      },
      mousemove(e) {
        if(!this.canDrag) return
        let y = e.pageY - this.y
        let x = e.pageX - this.x
        let top = this.offset.top + y + 'px'
        let left = this.offset.left + x + 'px'
        this.imgStyle = {...this.imgStyle, ...{top, left}}
      },
      mouseup() {
        this.canDrag = false
      },
      closeImg() {
        // 发送事件
        this.$emit('clickit')
      },
      rotateImg() {
        this.rotate += 90
        if(this.rotate === 360) this.rotate = 0
        this.imgStyle = {
          ...this.imgStyle,
          transform: `rotate(${this.rotate}deg)`
        }
      },
      changeSize(e) {
        let $img = $(this.$el).find('#chat-big-img')
        let w = $img.width()
        let h = $img.height()
        let {top, left} = this.imgStyle
        top = parseInt(top)
        left = parseInt(left)
        let flag = e.deltaY < 0 ? 1 : -1
        this.imgStyle = {
          ...this.imgStyle,
          maxWidth: 'none',
          top: top - h*0.1*flag/2 + 'px',
          left: left - w*0.1*flag/2 + 'px',
//          transform: `rotate(${this.rotate}deg)`,
          width: w*(1+0.1*flag) + 'px',
          height: h*(1+0.1*flag) + 'px',
        }
      },
    },
    mounted() {
      this.$nextTick(() => {
        let $img = $(this.$el).find('#chat-big-img')
        this.imgStyle = {
          ...this.imgStyle,
          top: $img.parent().height()/2 - $img.height()/2 + 'px',
          left: $img.parent().width()/2 - $img.width()/2 + 'px',
        }
      })
    },
  }

</script>
<style>
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
    position: relative;
  }
  /*不限制图片大小，实现居中*/
  .img-view .img-box img {
    max-width: 100%;
    /*display: block;*/
    position: absolute;
    /*top: 50%;*/
    /*left: 50%;*/
    /*transform: translate(-50%, -50%);*/
    z-index: 1000;
  }

  .control-btn {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    /*margin-left: -20px;*/
    z-index: 1000;
    padding: 3px;
    border-radius: 3px;
    background: rgba(0, 0, 0, .5);
  }
  .control-btn .c-btn-item {
    width: 40px;
    height: 40px;
    display: inline-block;
    background: url('../../assets/icon-close.png') no-repeat;
    background-size: contain;
    vertical-align: top;
    padding: 3px;
  }
  .control-btn .c-btn-item:hover {
    background-color: rgba(255, 255, 255, .3);
  }
  .control-btn .c-btn-item.item2 {
    margin-left: 20px;
    background-image: url('../../assets/icon-rotate.png')
  }
</style>