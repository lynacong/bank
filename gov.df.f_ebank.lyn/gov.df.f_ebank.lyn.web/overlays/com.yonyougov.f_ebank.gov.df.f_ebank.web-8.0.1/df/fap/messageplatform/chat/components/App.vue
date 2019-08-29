<template>
  <div id="im-chat" class="app-box" v-show="showImChatBox" :style="{width: width+'px'}">
    <chat-header :activeTabIndex="activeTab"></chat-header>
    <chat-main v-show="activeTab === 0" ></chat-main>
    <chat-users v-show="activeTab === 1"></chat-users>
    <Vodal :show="vodalConf.show" :width="vodalConf.width" :height="vodalConf.height" @hide="confirm">
      <div class="hd" v-text="vodalConf.title"></div>
      <div class="bd" v-text="vodalConf.content" style="margin: 10px 0;"></div>
      <div style="text-align: right; position: absolute; bottom: 10px; right: 10px;"><button class="btn btn-default" @click="confirm">确定</button></div>
    </Vodal>

    <sd-chat v-if="showDiscussBox" ref="sdChat"></sd-chat>
  </div>
</template>

<script>
  import sdChat from './sdChat/Main.vue'
import chatHeader from './chat-header.vue'
import chatMain from './chat-main.vue'
import chatUsers from './chat-users.vue'
import {mapState, mapGetters, mapMutations} from 'vuex'
  import {createUser} from '../util/util'
export default {
  name: 'app',
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['width', 'vodalConf', 'myInfo']),
    ...mapState({
      username: state => state.myInfo.username,
      showDiscussBox: state => state.sdChat.showDiscussBox,
      groupUsers: state => state.sdChat.groupUsers,
    }),
    ...mapGetters(['activeTab']),
    showImChatBox() {
      let flag = this.$store.state.showImChatBox
      if(flag) {
        this.$store.dispatch('readMsg')
      }
      return flag
    },
  },
  methods: {
    confirm() {
      this.$store.commit('VODAL_CONF', {show: false})
    },
  },
  components: {chatHeader, chatMain, chatUsers, sdChat},
  mounted() {
    this.$store.dispatch('getUsers')
//    var msg = {"total_count":13,"row":[{"fromuserid":"00000000000000000000000000008669","attm_id":null,"rn":"13","fromuser":"张海舒","msg_title":null,"file_name":null,"send_type":"","msg_content":"测试 哈哈哈哈或或或或或或或或或或或或或或或或或或或或","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:48:21","msg_id":"{9A544F66-CB17-4A44-B43D-CAE2F2B24040}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"1","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户4】账号【622559887621】的账户已经过期370天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:30:20","msg_id":"{8D2C8CB5-6439-11E7-95C5-B11086F0E647}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"3","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户2】账号【6225998877664321】的账户已经过期371天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:30:11","msg_id":"{8D2CB3C7-6439-11E7-95C5-B11086F0E647}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"2","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户1】账号【6225998877661234】的账户已经过期371天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:30:01","msg_id":"{8D2CB3C6-6439-11E7-95C5-B11086F0E647}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"4","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户3】账号【6225998877663456】的账户已经过期371天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:20:21","msg_id":"{8D2CB3C8-6439-11E7-95C5-B11086F0E647}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"6","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户3】账号【6225998877663457】的账户已经过期373天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:20:21","msg_id":"{E1EC0FC0-65CB-11E7-95C5-B11086F0E647}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"9","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户1】账号【6225998877661234】的账户已经过期373天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:10:21","msg_id":"{DD35C6BF-78A7-11E7-B4A6-AB73C9C2D73F}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"12","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户3】账号【6225998877663457】的账户已经过期373天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 15:00:21","msg_id":"{DD35C6C2-78A7-11E7-B4A6-AB73C9C2D73F}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"5","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户3】账号【6225998877663457】的账户已经过期371天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 13:30:21","msg_id":"{8D2CB3C9-6439-11E7-95C5-B11086F0E647}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"10","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户2】账号【6225998877664321】的账户已经过期373天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 13:20:21","msg_id":"{DD35C6C0-78A7-11E7-B4A6-AB73C9C2D73F}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"11","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户3】账号【6225998877663456】的账户已经过期373天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 11:30:21","msg_id":"{DD35C6C1-78A7-11E7-B4A6-AB73C9C2D73F}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"7","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户2】账号【6225998877664321】的账户已经过期373天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 10:30:21","msg_id":"{E1EC36D1-65CB-11E7-95C5-B11086F0E647}","role_name":null},{"fromuserid":"00000000000000000000000000008850","attm_id":null,"rn":"8","fromuser":"贾琰","msg_title":"账户到期提醒","file_name":null,"send_type":"","msg_content":"账户到期提醒：预算单位【省委本级】账户名称【测试账户4】账号【622559887621】的账户已经过期372天,请及时办理相关手续.","user_name":"张海舒","msg_type_code":"","time":"2017-08-14 09:30:21","msg_id":"{DD35C6BE-78A7-11E7-B4A6-AB73C9C2D73F}","role_name":null}]}
//    this.$store.dispatch('getMsg', msg)
    if(window._chatData) {
      this.$store.dispatch('getMsg', {data: window._chatData})
    } else {
      this.$store.commit('SET_ACTIVE_TAB', 1)
    }
    if(window._chatParams) { // _chatParams存在, 说明不是通过直接点击右上角图标激活的聊天窗口, 此情况是发送单据消息
      this.$store.dispatch('openChatWindow', window._chatParams)
    }
    this.$store.commit('USER_ID', getUserId())
    this.$store.dispatch('getUserInfo')

    if(window._discussChatParams) { // _discussChatParams存在,说明是 问题共商 界面的聊天框需要初始化
      let groupId = window._discussChatParams
      this.$store.dispatch('sdChat/openDiscussChatBox', groupId)
    }
  },
  watch: {
    showDiscussBox(val) {
      if(!val) {
        if(this.$refs.sdChat) {
          this.$refs.sdChat.$destroy()
        }
      }
    },
  },
}
function getUserId() {
//  let tokenId = window.location.search
//    .slice(1)
//    .split('&')
//    .filter((str) => str.indexOf('tokenid=') === 0)[0]
//    .split('=')[1]
//  return tokenId.slice(0, 32)
  let commonData = sessionStorage.getItem('commonData')
  commonData = JSON.parse(commonData) || {}
  return commonData.svUserId
}
</script>

<style lang="scss" rel="stylesheet">
  .app-box {
    position: fixed;
    top: 60px;
    left: 50%;
    width: 760px;
    height: 500px;
    margin-left: -380px;
    z-index: 1000;
    /*transform: ;*/
    /*border: 1px solid;*/
    /*margin-top: 30px;*/
    /*margin-left: auto;*/
    /*margin-right: auto;*/
    box-shadow: 0 0 8px 0 rgba(0,0,0,0.5);
    background: #fff;
    h4 {
      line-height: 14px;
    }
  }
  ul,
  ol {
    margin: 0;
  }
  .msg-count {
    position: absolute;
    left: 35px;
    top: 10px;
    background: #f00;
    border-radius: 5px;
    color: #fff;
    padding: 0 4px;
  }
  .m-vodal {
    display: flex;
    flex-direction: column;
    .bd {
      height: 1px;
      flex: 1;
    }
  }
</style>
