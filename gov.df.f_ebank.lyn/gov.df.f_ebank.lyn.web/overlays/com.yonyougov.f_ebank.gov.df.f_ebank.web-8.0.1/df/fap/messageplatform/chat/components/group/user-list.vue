<!--群成员列表-->
<template>
  <div class="g-mn">
    <div class="g-hd">
      <div class="tt">成员(<span v-text="users.length"></span>/<span v-text="memberCount"></span>)</div>
      <input type="text" class="form-control" v-model.trim="keyword">
    </div>
    <ul class="list-unstyled g-bd">
      <li v-for="(user, i) in filterUsers" class="f-ellipse" :class="{act: index === i}" @click="index = i" @dblclick="gotoChat(user)">
        <!--<img :src="user.photo" alt="" class="f-customImg">-->
        <span v-text="user.name" :title="user.name" ></span>
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
      memberCount: {
        type: [Number,String],
        default() {
          return this.users.length
        },
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
      gotoChat(user) {
        this.$store.dispatch('gotoChat', {node: user})
      },
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
  .f-customImg {
    width: 20px;
    height: 20px;
  }
</style>