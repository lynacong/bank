<template>
  <div class="g-mn">
    <!--消息搜索框-->
    <!--<div class="form-inline m-search" :style="{width: searchBoxWidth}">-->
      <!--<input @blur="searchBlur" @focus="searchBoxWidth = '180px'" type="text" class="form-control"-->
             <!--style="padding-bottom: 3px; padding-top: 3px; height: 20px; width: 100%;" v-model.trim="keyword">-->
      <!--<span  class="glyphicon glyphicon-search form-control-feedback"></span>-->
    <!--</div>-->
    <!--消息列表-->
    <info-body class="g-bd" :msgs="convertMsgs"></info-body>
    <!--消息编辑框-->
    <info-edit class="g-edit"></info-edit>
  </div>
</template>
<script>
  import _cloenDeep from 'lodash/fp/cloneDeep'
  import infoBody from './info-body.vue'
  import infoEdit from './info-edit.vue'
  import {mapState, mapGetters } from 'vuex'
  export default {
    data() {
      return {
        keyword: '', // 搜索聊天信息
        searchBoxWidth: '24px',
      }
    },
    computed: {
      ...mapState('sdChat', ['groupId', 'iframeName']),
      ...mapGetters('sdChat', ['groupUser']),
      msgs() {
        let user = this.groupUser
        // 判断iframe是否依然是打开的
        if(window.frames[this.iframeName]) {
          // 通知服务器消息已读
          user &&  this.$store.dispatch('sdChat/readGroupMsg')
        }
        let msgs = user ? user.msgs : []
        if(this.keyword)
          return msgs.filter(msg => msg.msg_content.indexOf(this.keyword) > -1)
        return msgs
      },
      convertMsgs() {
        return this.convertMsgsFn(this.msgs)
      },
    },
    methods: {
      searchBlur() {
        if(!this.keyword) {
          this.searchBoxWidth = '24px'
        }
      },
      convertMsgsFn(msgs) {
//        msgs = JSON.parse(JSON.stringify(msgs))
        msgs = _cloenDeep(msgs)
//        url拼接
        msgs.forEach(msg => {
          if (msg.menu_url) {
            // 加上tokenid
            msg.menu_url += (msg.menu_url.lastIndexOf('?') > -1 ? '&' : '?') + `tokenid=${getTokenId()}`
            if (msg.param) {
              // 加上参数
              msg.menu_url += '&' + msg.param
            }

            // 参数用 encodeURIComponent 转码
            let tempArr = msg.menu_url.split('?')
            tempArr[1] = tempArr[1] && tempArr[1].split('&').map(param => {
              return param.split('=').map(str => encodeURIComponent(str)).join('=')
            }).join('&')
            msg.menu_url = tempArr.join('?')
          }
        })

        // 图片
        msgs.forEach(msg => {
          if (msg.msg_type_code == 2 && msg.imgLoading) {
            this.$store.state.fileList.some(obj => {
              if (obj.msgId === msg.msg_id) {
                msg.imgContent = obj.file
                msg.imgLoading = false
//                this.$store.commit('DEL_FILE', msg.msg_id)
                return true
              }
            })
          }
        })

        // 时间显示策略 信息之间间隔3分钟才显示时间
        msgs.forEach((msg, i, arr) => {
          msg.hideTime = false
          if(!i) return
          let prevMsg = arr[i-1]
          let tempTime = 0
          if( (tempTime = (new Date(msg.time) - new Date(prevMsg.time)) / 1000 / 60 ) < 3) {
            msg.hideTime = true // 时间间隔不超过3分钟, 添加属性hideTime 为true
          }
        })

        return msgs
      },
    },
    components: {infoBody, infoEdit},
  }
</script>
<style lang="scss" scoped>
  .g-mn {
    position: relative;
    .g-bd {
      height: calc( 100% - 135px );
    }
    .g-edit {
      border-top: 1px solid #ccc;
    }
  }

  .m-search {
    position: absolute;
    top: 3px;
    left: 3px;
    background-color: #fff;
    z-index: 1;
    .form-control-feedback {
      top: -3px;
      right: -5px;
    }
  }

</style>