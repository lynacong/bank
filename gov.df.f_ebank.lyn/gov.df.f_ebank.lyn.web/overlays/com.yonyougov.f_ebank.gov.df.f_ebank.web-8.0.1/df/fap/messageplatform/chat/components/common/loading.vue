<template>
  <div class="loadEffect" :style="{width: radius+'px', height: radius+'px'}">
    <span v-for="style in styles" :style="style"></span>
    <!--<span></span>-->
    <!--<span></span>-->
    <!--<span></span>-->
    <!--<span></span>-->
    <!--<span></span>-->
    <!--<span></span>-->
    <!--<span></span>-->
  </div>
</template>
<script>
  export default {
    props: {
      radius: {
        type: Number,
        default: 100,
      },
      subRadius: {
        type: Number,
        default: 16,
      },
    },
    data() {
      let subRadius = this.subRadius
      var commonStyle = {
        width: subRadius + 'px',
        height: subRadius + 'px',
      }
      let styles = [
        { //1
          left: 0,
          top: '50%',
          marginTop: -subRadius/2+'px',
        },
        { //2
          left: 14/16*subRadius+'px',
          top: 14/16*subRadius+'px'
        },
        { //3
          left: '50%',
          top: 0,
          marginLeft: -subRadius/2+'px',
        },
        { //4
          top: 14/16*subRadius+'px',
          right: 14/16*subRadius+'px'
        },
        { //5
          top: '50%',
          right: 0,
          marginTop: -subRadius/2+'px',
        },
        { //6
          bottom: 14/16*subRadius+'px',
          right: 14/16*subRadius+'px',
        },
        { //7
          left: '50%',
          bottom: 0,
          marginLeft: -subRadius/2+'px',
        },
        { //8
          bottom: 14/16*subRadius+'px',
          left: 14/16*subRadius+'px',
        },

      ]
      styles = styles.map(style => {
        return {...style, ...commonStyle}
      })
      return {
        styles
      }
    },
  }
</script>