<template>
  <div id="sd-chat-container" v-transfer-dom="parentNode" :data-transfer="true" class="g-mn" style="border: 1px solid #ccc;">
    <!--用户列表-->
    <user-list :users="groupUsers" class="g-sd"></user-list>
    <!--主聊天框-->
    <chat-main class="g-mnc"></chat-main>
  </div>
</template>
<script>
  import TransferDom from '../../directives/transfer-dom'
  import {mapState} from 'vuex'
  import userList from './user-list.vue'
  import chatMain from './chat-main.vue'

  export default {
    data() {
      return {
        frameName: '问题共商',  // iframe的名称
      }
    },
    computed: {
      ...mapState('sdChat', ['groupId', 'groupUsers', 'parentNode', 'containerId']),
      element() {
        return $(this.parentNode).find('#chat-content')
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.element.focus() // 页面加载后聊天框获取焦点
      })

      let document = window.frames[this.frameName].document
      let parentNode = document.querySelector('#' + this.containerId)
      this.$store.commit('sdChat/PARENT_NODE', parentNode)

      // 载入css
//      $("<link>")
//        .attr({
//          rel: "stylesheet",
//          type: "text/css",
////          href: "http://localhost:8080/dist/style.css",
//           href: "/df/fap/messageplatform/chat/dist/style.css",
//        })
//        .appendTo($(document).find('head'));

      // 获取群成员
      this.$store.dispatch('sdChat/getGroupUsers', this.groupId)
    },
    methods: {
      doSome() {
        alert(1)
      }
    },
    directives: {TransferDom},
    components: {userList, chatMain},
  }
</script>
<style lang="scss" scoped>
  .g-mn {
    height: 100%;
    /*margin-top: 10px;*/
    /*display: flex;*/
    .g-sd {
      float: left;
      border-left: none;
      border-right: 1px solid #ccc;
      margin-top: 0;
    }
  }

  .g-mnc {
    /*flex: 1;*/
    margin-left: 155px;
  }

  .ccc {
    width: 100%;
  }
</style>
