<!--用户、群列表、用户名片、群名片容器-->
<template>
  <div class="main-box">
    <div class="chat-users-users">
      <search-users @tabChange="tabChange" @showGroupInfo="showGroupInfo"></search-users>
    </div>
    <div class="chat-users-content">
      <div class="bx">
        <user-tab v-if="type === 0"></user-tab>
        <group-tab v-if="type === 1 && groupInfo" :group-info="groupInfo"></group-tab>
      </div>
    </div>
  </div>
</template>
<script>
  import searchUsers from './search-users.vue'
  import userTab from './user-tab.vue'
  import groupTab from './group-tab.vue'
  export default {
    data() {
      return {
        type: 0,
        groupInfo: null,
      }
    },
    methods: {
      tabChange(i) {
        this.type = i
      },
      showGroupInfo(opt) {
        this.groupInfo = opt
      },
    },
    components: {searchUsers, userTab, groupTab},
  }
</script>
<style lang="scss" scoped>
  .main-box {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    .chat-users-users {
      position: absolute;
      float: left;
      width: 300px;
      /*border-right: 1px solid;*/
      height: 100%;
      border-right: 1px solid rgba(0,0,0,.1);
    }
    .chat-users-content {
      /*float: left;*/
      margin-left: 300px;
      /*width: 460px;*/
      height: 100%;
      padding-top: 1px;
      .bx {
        height: 100%;
        background: url(../assets/think.png) no-repeat center center;
        background-color: #EDEFEF;
      }
    }
  }
</style>