<!--群成员列表-->
<template>
  <div class="g-mn">
    <span class="add-user fa fa-user-plus" title="添加用户" @click="addUser"></span>
    <div class="g-hd">
      <div class="tt">成员(<span v-text="users.length"></span>)</div>
      <!--<input type="text" class="form-control" v-model.trim="keyword">-->
    </div>
    <ul class="list-unstyled g-bd">
      <li v-for="(user, i) in filterUsers" class="f-ellipse"  @click="index = i">
        <!--头像-->
        <template>
          <div class="user-img " v-if="!user.photo"></div>
          <img v-else :src="user.photo" alt="" class="f-customImg">
        </template>
        <span v-text="user.name" :title="user.belong_name" ></span>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    props: {
      users: {
        type: Array
      },
    },
    data() {
      return {
        keyword: '',
        index: 0,
      }
    },
    computed: {
      filterUsers() {
        return this.users.filter(user => {
          return user.name.indexOf(this.keyword) > -1
        })
      },
    },
    methods: {
      addUser() {
        let iframeName = this.$store.state.sdChat.iframeName
        window.frames[iframeName].doAddUser()
      },
//      gotoChat(user) {
//        this.$store.dispatch('gotoChat', {node: user})
//      },
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/css/variable";
  .g-mn {
    height: 100%;
    width: 150px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid $bdColor;
    position: relative;
    .add-user {
      width: 20px;
      height: 20px;
      display: inline-block;
      position: absolute;
      right: 7px;
      top: 11px;
      color: #999;
      font-size: 18px;
      &:hover {
        color: #333;
        cursor: pointer;
      }
    }
  }
  .g-hd {
    padding: 8px;
    .tt {
      line-height: 24px;
      padding-left: 5px;
    }
    .form-control {
      height: 24px;
    }
  }
  .g-bd {
    flex: 1;
    overflow: auto;
    line-height: 30px;
    li {
      cursor: default;
      padding-left: 8px;
    }
    li.act {
      background: $bgColor;
    }
  }
  .user-img,
  .f-customImg {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
</style>