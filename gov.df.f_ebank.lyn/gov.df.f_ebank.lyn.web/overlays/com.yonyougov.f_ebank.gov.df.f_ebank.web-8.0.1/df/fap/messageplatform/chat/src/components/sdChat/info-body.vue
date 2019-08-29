<template>
  <div class="info-body" info-body>
    <!--获取更多消息-->
    <div class="get-more" v-show="!noMore">
      <span class="time-icon"></span>
      <span class="time-word" @click="getHistoryMsg">查看历史消息</span>
    </div>
    <div class="get-more" v-if="noMore">
      没有更多消息了
      <!--<span>更多消息请在消息记录中查阅</span><span v-if="!historyMsgBoxState.show">,</span>-->
      <!--<a href="javascript:;" class="chat-link" v-if="!historyMsgBoxState.show" @click="openHistoryMsgBox">打开消息记录</a>-->
    </div>
    <!--消息列表-->
    <ul class="list-unstyled" id="chat-msg-list" :style="{fontSize: fontSize+'px'}">
      <li v-for="msg in msgs" class="one-msg"
          :class="{other: msg.fromuserid !== myUserId, self: msg.fromuserid === myUserId}">
        <div class="chat-time" v-text="msg.time" v-if="!msg.hideTime">2018-21-32 12:45:45</div>
        <div style="position: relative">
          <!--头像 别人发送的消息-->
          <template v-if="msg.fromuserid !== myUserId">
            <div class="user-img"></div>
            <!--<img v-else :src="activeUser.photo" alt="" class="f-customImg">-->
          </template>

          <!--用户名称-->
          <div class="f-nm" v-text="msg.fromuser" v-if="msg.fromuserid !== myUserId"></div>
          <!--具体消息内容-->
          <one-msg :msg="msg" class="msg-box" :class="{grp: msg.fromuserid !== myUserId}"></one-msg>
          <!--头像 自己发送的消息-->
          <template v-if="msg.fromuserid === myUserId">
            <div class="user-img " v-if="!myInfo.photo"></div>
            <img v-else :src="myInfo.photo" alt="" class="f-customImg">
          </template>
        </div>

      </li>
    </ul>
  </div>
</template>
<script>
  import {mapState, mapGetters} from 'vuex'
  import loading from '../common/loading.vue'
  import bigImg from '../common/view-img.vue'
  import {getTokenId, url, getParam, openModal} from '../../util/util'
  import oneMsg from '../common/one-msg.vue'

  export default {
    props: ['fontSize', 'msgs'],
    data() {
      return {
        imgSrc: '',
        showBigImg: false,
        init: false, // 加载了50条消息后, init置为true
      }
    },
    computed: {
      ...mapState([
        'showImChatBox',
        'myUserId', 'activeUserId', 'noMoreMsg', 'actionType', 'chatUsers', 'activeTab',
        'historyMsgBoxState',
        'myInfo',
      ]),
      ...mapState('sdChat', ['parentNode','groupId', 'showDiscussBox']),
      ...mapGetters(['activeUser']),
      noMore() {
        return !!this.chatUsers.find(user => user.id === this.groupId)
//        let user = this.chatUsers.filter(user => user.id === this.groupId)
////        console.log(user)
//        if (user[0]) {
//          return user[0].noMore
//        }
//        return false
      },
    },
//    filters: {
//      showContent(val) {
//        val = val.replace(/\n/g, '<br>').replace(/\/(\w+) /g, function(str, name) {
//          return `<img src="/df/fap/messageplatform/chat/assets/emoji/${name}.gif">`
//        })
//      }
//    },
    mounted() {
      if(this.msgs.length < 50) {
        this.getHistoryMsg()
      }
//        this.scrollIntoView()
    },
    methods: {
//      openBillModal(e, msg) {
//        if (e.target.nodeName !== 'A') return
//        if (msg.param) {
//          let params = typeof msg.param === 'object' ? msg.param : JSON.parse(msg.param)
//          openModal(params.url)
////          let func = eval(paras.callback)
////          let obj = paras.object
////          func(obj)
//        }
//      },
//      openIframe(msg) {
//        window.parent.addTabToParent(getParam('menuname', msg.menu_url), msg.menu_url);
//      },
      viewBigImg(imgData) {
        this.imgSrc = imgData
        this.showBigImg = true
      },
      getHistoryMsg() {
        this.$store.dispatch('sdChat/getGroupHistoryMsg', {groupId: this.groupId})
      },
      downloadFile(msg_id) {
        var form = $("<form id='downloadForm'>");
        form.attr('style', 'display:none');
        form.attr('target', '');
        form.attr('method', 'post');
        form.attr('action', url.DOWNLOAD);
        var input = $('<input>');
        input.attr('type', 'hidden');
        input.attr('name', 'msg_id');
        input.attr('value', msg_id);
        $('body').append(form);
        form.append(input);
        form.submit();
        form.remove();
        $('#downloadForm').remove();
      },
      openHistoryMsgBox() {
        this.$store.dispatch('toggleHistoryBoxState')
      },
      scrollIntoView() {
        this.$nextTick(() => {
//          var li = $(this.parentNode).find('#chat-msg-list > li:last-child')[0]
          var ul = $(this.parentNode).find('#chat-msg-list')[0]
//            var li = $('#chat-msg-list > li:last-child')[0]
          if (ul) {
            setTimeout(() => {
              ul.scrollIntoView(false)
            }, 0)
          }
        })
      },
    },
    watch: {
      msgs: {
        handler(list) {
          // 将最新的对话滚动到可视区
          if (this.actionType === 0 || !this.init) {
            if(list.length >= 50) {
              this.init = true
            }
            this.scrollIntoView()
          }
        },
        immediate: true,
//        deep: true,
      },
//      msgs: {
//        handler() {
//          console.log('deepChange')
//        },
//        deep: true,
//      },
//      showDiscussBox(val) {
//        alert(val)
//        // 页面初始化时最新的对话滚动到可视区
//        if(val) {
//          alert(1)
//          this.scrollIntoView()
//        }
//      },
//      msgs(list) {
//        // 将最新的对话滚动到可视区
//        if (this.actionType === 0 || !this.init) {
//          if(list.length) {
//            this.init = true
//          }
//          this.scrollIntoView()
//        }
//      },
    },
    components: {loading, bigImg, oneMsg},
  }
</script>
<style lang="scss" scoped>
</style>