<!--用户名片-->
<template>
  <div class="user-tab">
    <div class="outer-tab-box">
      <div class="tab-box" v-if="user">
      <!--<div class="tab-box" >-->
        <!--头像-->
        <div class="icon-box">
          <span class="fa fa-camera u-changeLogo" title="更换头像" @click="showUploadImg = true" v-if="user.id === myUserId"></span>
          <div class="user-img center" v-if="!user.photo"></div>
          <img v-else :src="user.photo" class="center f-customImg" alt="">
          <div class="m-send-msg" title="发消息" @click="sendMsg">
            <!--<span class="chat-icon center"></span>-->
          </div>
        </div>
        <!--简介-->
        <div class="intro-box">
          <h4 class="name f-ellipse" v-text="user.name.split(' ')[1]" :title="user.name.split(' ')[1]"></h4>
          <ul class="list-unstyled">
            <li class="key-value">
              <label class="key">编号: </label>
              <span class="value" v-text="user.code">88888888</span>
            </li>
            <li class="key-value">
              <label class="key">部门: </label>
              <input class="input-text" :title="user.department || ''" type="text" readonly :value="user.department || ''">
              <!--<span class="value" v-text="user.department">88888888</span>-->
            </li>
            <li class="key-value">
              <label class="key">电话: </label>
              <span class="value" v-text="user.telephone">88888888</span>
            </li>
            <li class="key-value">
              <label class="key">手机: </label>
              <span class="value" v-text="user.mobile">88888888</span>
            </li>
          </ul>
        </div>

        <upload-img v-if="showUploadImg" :show="showUploadImg" @upload="uploadImg" @hide="showUploadImg = false"></upload-img>
      </div>
    </div>
  </div>
</template>

<script>
  import uploadImg from './common/upload-img.vue'
  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        showUploadImg: false,
      }
    },
    computed: {
      ...mapState(['myUserId']),
      user() {
        return this.$store.state.activeUser
      },
    },
    methods: {
      uploadImg(file) {
        this.$store.dispatch('uploadImg', {file, id: this.user.id, type: 'user'})
      },
      sendMsg() {
        this.$store.commit('GOTO_CHAT')
      },
    },
    components: {uploadImg},
  }
</script>
<style lang="scss" scoped>
  .f-customImg {
    width: 80px;
    height: 80px;
  }
  .user-tab {
    height: 100%;
  }
  .outer-tab-box {
    height: 100%;
    padding-top: 20px;
    /*padding-bottom: 30px;*/
  }
  .tab-box {
    width: 300px;
    margin-left: 90px;
    background: #EDF1F5;
    position: relative;
    height: 100%;
    box-shadow: 0 0 15px 0 rgba(0,0,0,0.3);
  }
  .icon-box {
    height: 150px;
    position: relative;
    background: #D9F3FF;
    .user-img {
      background-image: url('../assets/user2.png');
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-size: contain;
      background-color: #ddd;
    }
  }
  .intro-box {
    position: absolute;
    top: 150px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    background: #fff;
    .name {
      text-align: center;
      font-size: 24px;
      margin: 0;
      padding: 15px 50px;
      white-space: nowrap;
      overflow: hidden;
    }
    .key {
      font-weight: normal;
      color: #999;
      display: inline-block;
      vertical-align: middle;
      padding-right: 10px;
      width: 70px;
      text-align: right;
    }
  }
  .key-value {
    padding-left: 25px;
  }
  .input-text {
    border: none;
    width: 175px;
    background: transparent;
    height: 19px;
    vertical-align: top;
    padding-left: 0;
  }
  /*.send-msg {*/
    /*position: absolute;*/
    /*bottom: 0;*/
    /*right: 10px;*/
    /*transform: translate(0, 50%);*/
    /*background: #02A1E9;*/
    /*border-radius: 50%;*/
    /*width: 40px;*/
    /*height: 40px;*/
    /*cursor: pointer;*/
    /*background: url('../assets/chat-icon.png') no-repeat center center;*/
    /*z-index: 10;*/
    /*.chat-icon {*/
      /*background: url('../assets/chat.png') no-repeat center center;*/
      /*width: 24px;*/
      /*height: 25px;*/
      /*display: inline-block;*/
    /*}*/
  /*}*/

</style>