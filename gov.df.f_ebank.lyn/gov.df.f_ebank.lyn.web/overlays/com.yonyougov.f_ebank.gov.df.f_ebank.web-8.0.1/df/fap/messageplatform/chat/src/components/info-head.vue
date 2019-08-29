<template>
  <div class="user-head bdb-1">
    <h4 class="name" >
    <span v-if="activeUser" v-text="activeUser.name">用户A</span>
    <span class="chat-department" v-if="activeUser" v-text="activeUser.department">用户A</span>
    </h4>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    computed: {
      activeUser() {
        return this.$store.getters.activeUser
      },
    },
  }
</script>
<style lang="scss" scoped>
  @import "../assets/css/variable";
  .user-head {
    height: 34px;
    overflow: hidden;
    border-bottom: 1px solid $bdColor;
    .name {
      padding-left: 10px;
    }
  }
  .chat-department {
    color: rgba(0,0,0,.7);
    font-size: 12px;
  }
</style>