<template>
  <div class="main-box">
    <div class="chat-main-users bdr-1">
      <main-users></main-users>
    </div>
    <div class="chat-main-content">
      <main-content v-show="activeUserId"></main-content>
    </div>
  </div>
</template>
<script>
  import mainUsers from './main-users.vue'
  import mainContent from './main-content.vue'
  import {mapState} from 'vuex'
  export default {
    data() {
      return {}
    },
    computed: {
      ...mapState(['historyMsgBoxState', 'activeUserId']),
    },
    components: {mainUsers, mainContent},
  }
</script>
<style lang="scss" scoped>
  @import "../assets/css/variable";
  .main-box {
    position: absolute;
    top: 56px;
    bottom: 0;
    left: 0;
    right: 0;
    .chat-main-users {
      /*float: left;*/
      position: absolute;
      width: 200px;
      /*border-right: 1px solid;*/
      height: 100%;
      /*border-right: 1px solid rgba(0,0,0,.1);*/
    }
    .chat-main-content {
      height: 100%;
      margin-left: 200px;
    }
  }
</style>