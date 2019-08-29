<template>
  <div class="main-content">
    <!--用户名-->
    <info-head></info-head>
    <!--消息体-->
    <div class="body-box">
      <div class="body" :style="{marginRight: historyMsgBoxState.show ? 360+ 'px' : 0 + 'px'}">
        <info-body :msgs="convertMsgs" :fontSize="fontSize"></info-body>
        <info-edit @deliverFontSize="getFontSize"></info-edit>
        <!--群成员是否显示图标-->
        <div
            v-if="activeUser && activeUser.groupId && !historyMsgBoxState.show"
            @click="showGroupUsers = !showGroupUsers"
            class="f-showGroupUsers" :class="{'f-showGroupUsers-2': showGroupUsers, 'f-showGroupUsers-1': !showGroupUsers}">
          <span class="fa center" :class="{'fa-angle-right': showGroupUsers, 'fa-angle-left': !showGroupUsers}"></span>
        </div>
      </div>
      <userList :member-count="activeUser.groupNumber" :users="activeUser.users" v-if="activeUser && activeUser.groupId && !historyMsgBoxState.show"  v-show="showGroupUsers"  @hide="showGroupUsers = false"></userList>
      <!--历史记录-->
      <div class="chat-history" v-if="historyMsgBoxState.show" style="width: 360px;">
        <history-msg :msgs="historyMsgs()"></history-msg>
        <!--<history-msg :msgs="convertMsgs"></history-msg>-->
      </div>
    </div>
  </div>
</template>
<script>
  import infoHead from './info-head.vue'
  import infoBody from './info-body.vue'
  import infoEdit from './info-edit.vue'
  import {mapState, mapGetters} from 'vuex'
  import historyMsg from './historyMsg/history-msg.vue'
  import userList from './group/user-list.vue'
  import _cloenDeep from 'lodash/fp/cloneDeep'
  export default {
    data() {
      return {
        fontSize: 14,
        showGroupUsers: true,
      }
    },
    computed: {
      ...mapState(['historyMsgBoxState','showImChatBox','activeTab','activeUserId', 'allUsers']),
      ...mapGetters(['activeUser']),
      ...mapGetters('historyMsg', ['oneDayMsgs'],),
      msgs() {
        // 通知服务器消息已读
        let user = this.$store.getters.activeUser
        if (this.$store.state.activeUserId && this.activeTab === 0 && this.showImChatBox && user)
          this.$store.dispatch('readMsg')
        if (user) {
          return user.msgs
        }
        else
          return []
      },
      convertMsgs() {
        return this.convertMsgsFn(this.msgs)
      },
//      groupUsers() {
//        return this.allUsers.filter(user => this.activeUser.users.some(o => o.id === user.id))
//      },
    },
    methods: {
      historyMsgs() {
        return this.convertMsgsFn(this.oneDayMsgs)
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
      getFontSize(fontSize) {
        this.fontSize = fontSize
      },
    },
    components: {infoHead, infoBody, infoEdit, historyMsg, userList},
    watch: {
      activeUserId() {
        if(this.historyMsgBoxState.show)
          this.$store.dispatch('toggleHistoryBoxState', {show: false})
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import "../assets/css/variable";
  .main-content {
    padding-left: 5px;
    height: 100%;
    .body-box {
      position: relative;
      height: calc( 100% - 34px );
      display: flex;
      /*margin-left: 200px;*/
      .body {
        flex: 1;
        position: relative;
      }
    }
  }
  .chat-history {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    border-left: 1px solid $bdColor;
  }
  .f-showGroupUsers {
    width: 12px;
    height: 24px;
    background: #CCC;
    position: absolute;
    top: 7px;
    text-align: center;
    &:hover {
      background: #49A8FF;
    }
    .fa {
      color: #fff;
      font-size: 16px;
    }
  }
  .f-showGroupUsers.f-showGroupUsers-1 {
    right: 0;
    border-radius: 12px 0 0 12px;
  }
  .f-showGroupUsers.f-showGroupUsers-2 {
    border-radius: 0 12px 12px 0;
    left: 100%;
  }
</style>