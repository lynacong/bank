<template>
  <div class="users-box">
    <ul class="list-unstyled">
      <li
          v-for="(user, i) in users"
          class="user-box clearfix"
          :class="{active: activeUserId === user.id}"
          @click="tab(user,i)">
        <div class="img-box">
          <!--头像-->
          <div v-if="!user.photo" class="user-img center" :class="{'user-img-2': !!user.groupId}" >
            <!--<span class="icon center glyphicon glyphicon-user"></span>-->
          </div>
          <img v-else :src="user.photo" alt="" class="center f-customImg">
          <!--<img v-else src="/df/fap/messageplatform/chat/assets/user.png" alt="" class="center" style="width: 40px; height: 40px;">-->
        </div>
        <!--名字-->
        <div class="user-title">
          <h4 class="main-users-title" v-text="user.name">用户Abc</h4>
          <p class="main-users-msg" v-html="user.msgs[user.msgs.length-1] ? user.msgs[user.msgs.length-1].msg_content : ''">你好 hello</p>
          <span class="msg-count" v-show="user.notReadCount && user.id !== activeUserId" v-text="user.notReadCount"></span>
        </div>
        <div class="chat-close" @click.stop="removeUser(user, i+1)">
          <span class="close-icon center">&times;</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  import {mapState, mapGetters} from 'vuex'
  export default {
    data() {
      return {
        activeIndex: 0,
      }
    },
    computed: {
//      ...mapGetters(['users']),
      ...mapState(['activeUserId', 'activeDialogUserIndex', 'showImChatBox']),
      ...mapGetters(['activeUser']),
      users() { // 激活的用户列表
        let users =  this.$store.getters.users
        if(!this.activeUserId && users.length && this.showImChatBox) {
          this.tab(users[0], 0)
        }
        return users
      },
    },
    methods: {
      tab(user,i) {
        this.$store.commit('ACTIVE_USER_ID', user.id)
        this.$store.commit('SET_NO_MORE_MSG', false)
        typeof user.department === 'undefined' || this.$store.dispatch('getDepartment', {id:user.id, flag: true})
        // 通知服务器消息已读
        this.$store.dispatch('readMsg')
      },
      removeUser(user, i) {
        // 激活下一个用户
        let activeUserId = ''
        if(this.users && this.users[i]) {
          activeUserId = this.users[i].id
        }
        this.$store.commit('ACTIVE_USER_ID', activeUserId)

        // 移除用户及用户的消息
        this.$store.commit('REMOVE_MSG', user.msgs)
        this.$store.commit('REMOVE_MY_MSG', user.msgs)
        this.$store.commit('REMOVE_USER', user.id)
        this.$store.commit('REMOVE_USER_NOMORE_INFO', user.id)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .users-box {
    /*background: #FAFAFA;*/
    height: 100%;
  }
  .user-box {
    /*clear: both;*/
    padding: 0;
    height: 50px;
    position: relative;
    &.active,
    &:hover {
      background: #F5F5F5;
    }
    .chat-close {
      display: none;
    }
    &:hover {
      .chat-close {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translate(0, -50%);
        background: rgba(0,0,0,.5);
        cursor: pointer;
        border-radius: 50%;
        display: block;
        &:hover {
          background: rgba(255,0,0,.5);
        }
        .close-icon {
          font-size: 16px;
          color: #fff;
        }
      }
    }
  }
  .img-box {
    float: left;
    .user-img-2 {
      background-image: url(../assets/group2.png);
    }
  }
  .user-title {
    float: left;
    width: 65%;
    height: 100%;
    position: relative;
    .main-users-title {
      font-size: 16px;
      overflow: hidden;
      margin: 0;
      padding-top: 10px;
      padding-bottom: 5px;
      white-space: nowrap;
    }
    .main-users-msg {
      margin-bottom: 0;
      overflow: hidden;
      color: rgba(0,0,0,.5);
      font-size: 12px;
      white-space: nowrap;
      height: 18px;
    }
    .msg-count {
      right: -3px;
      left: inherit;
      top: 3px;
    }
  }
</style>