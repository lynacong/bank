<template>
  <div class="header-box" id="chat-header-box" :style="{background: bdColor}">
    <!--头像-->
    <div class="pull-left img-box">
      <div class="user-img center" v-if="!myInfo.photo"  @click="changeImg" title="切换头像" style="cursor: pointer;">
        <!--<span class="icon center glyphicon glyphicon-user"></span>-->
      </div>
      <img v-else :src="myInfo.photo" alt="" class="center f-customImg"  @click="changeImg" title="切换头像" style="cursor: pointer;" >

    </div>
    <!--搜索框-->
    <div class="pull-left search-box" v-show="activeTabIndex === 0">
      <input type="text" class="center search js-no-move" v-model.trim="keyword" @input="search" >
      <!--<span class="header-box-search-icon"></span>-->
    </div>
    <div class="pull-left search-box" v-show="activeTabIndex === 1">
      <input type="text" id="chat-search-user" class="center search js-no-move" v-model.trim="keywordSearchUser"  @keyup.enter="searchUser">
      <!--<span class="header-box-search-icon"></span>-->
    </div>
    <!--tab页-->
    <div class="pull-left btns-box">
      <span class="chat" :class="{active: activeTabIndex === 0}" @click="SET_ACTIVE_TAB(0)">
        <span class="msg-count" v-show="notReadMsgsCount > 0" v-text="notReadMsgsCount > 99 ? '99+' : notReadMsgsCount">99+</span>
      </span>
      <span class="user" :class="{active: activeTabIndex === 1}" @click="SET_ACTIVE_TAB(1)"></span>
    </div>

    <div class="icon-box">
      <span class="iconfont icon-liebiaoshitucaidan menu-icon" @click.stop="showMenuBox(!showMenu)"></span>
      <span class="header-box-close" @click="hideChatBox">&times;</span>
    </div>


    <div class="menu-setting" v-if="showMenu">
      <ul class="list-unstyled level-01">
        <li v-for="(menu,i) in menuList"
            :class="{'has-child': menu.children && menu.children.length, 'active': menu.active}"
            @mouseover="showChildren(i)" @click.stop="triggerMenu(menu, i)">
          <span v-text="menu.name"></span>

          <!--子级-->
          <ul class="list-unstyled level-02" v-if="menu.showChildren && menu.children && menu.children.length">
            <li v-for="item in menu.children" @click="changeSkin(item, menu.children)">
              <span v-text="item.name"></span>
              <span class="iconfont icon-zhengquewancheng" v-if="item.active"></span>
            </li>
          </ul>
        </li>
      </ul>

    </div>
    <upload-img v-if="showUploadImg" :show="showUploadImg" @upload="uploadImg" @hide="showUploadImg = false"></upload-img>
  </div>
</template>
<script>
  import {mapActions, mapMutations, mapState} from 'vuex'
  import {treeSearch, dragAble, showCount, dereplication} from '../util/util'
  import uploadImg from './common/upload-img.vue'
  export default {
    props: ['activeTabIndex'],
//    props: {
//      activeTabIndex: {
//        type: 'Number',
//        default: 0,
//        required: true,
//      }
//    },
    data() {
      return {
        showUploadImg: false,

        keyword: '',
        keywordSearchUser: '',
        showMenu: false,
        showSkinList: false,
        bdColor: '#EFF1ED',
        menuList: [
          {name: '换肤', children: [
            {name: '红', value: '#f00', active: false},
            {name: '绿', value: '#0f0', active: false},
            {name: '蓝', value: '#00f', active: false},
            {name: '默认', value: '#EFF1ED', active: true},
          ], showChildren: false, active: false},
          {
            name: '设置',
//            children: [{name: '头像'}],
            active: false
          },
        ],
      }
    },
    computed: {
      ...mapState(['totalCount', 'activeTab', 'msgs', 'searchInfo', 'myInfo', 'myUserId']),
      notReadMsgsCount() {
        let notReadBillGroupMsgs = this.msgs.filter(msg => msg.notRead && msg.grouptype == 2)
        let notReadNormalMsgLength = this.msgs.filter(msg => msg.notRead && msg.grouptype != 2).length
        let billGroupCount = dereplication(notReadBillGroupMsgs, 'user_id').length
        showCount(notReadNormalMsgLength + billGroupCount, $('#total-count'))
        showCount(notReadNormalMsgLength, $('#msg-count'))
        return notReadNormalMsgLength
      },
    },
    methods: {
      ...mapMutations(['SET_ACTIVE_TAB']),
      uploadImg(file) {
        this.$store.dispatch('uploadImg', {file, id: this.myUserId, type: 'user'})
      },
      changeImg() {
        this.showUploadImg = true
      },
      changeSkin(obj, list) {
        list.forEach(item => {
          item.active = false
        })
        obj.active = true
        this.bdColor = obj.value
        this.showMenuBox(false)

      },
      triggerMenu(menu, i) {
        if(menu.children && menu.children.length) {
          this.showChildren(i)
        } else {
          alert('功能待开发')
        }
      },
      showMenuBox(flag) {
        this.showMenu = flag
//        this.showSkinList = false
        this.menuList.forEach(menu => {
          menu.active = menu.showChildren = false
        })
      },
      // 显示子菜单
      showChildren(i) {
        this.menuList.some((menu, index) => {
          if(menu.active && i !== index) menu.active = false
        })
        this.menuList[i].active = true
        setTimeout(() => {
          this.menuList.some((menu, index) => {
            if(menu.showChildren && i !== index) {
              menu.showChildren = false
            }
          })
          this.menuList[i].showChildren = true
        }, 300)
      },
      hideChatBox() {
//        $('#im-chat').css('display', 'none')
        this.$store.commit('SHOW_IMCHAT_BOX', false)
      },
      search() {
        if(this.activeTab === 0)
          this.$store.commit('SET_KEY_WORD', this.keyword)

      },
      searchUser() {
        if(this.activeTab === 1) {
//          this.$store.dispatch('searchUser', {keyword: this.keywordSearchUser})
          let keyword = this.keywordSearchUser
          let treeId = this.searchInfo.treeId
          let inputId = 'chat-search-user'
          let key = 'name'
          let flag = 'next'
          let success = (treeNode = {}) => {
            let tree = $.fn.zTree.getZTreeObj(treeId)
            tree.setting.callback.onClick(null, treeId, treeNode)
          }
          treeSearch({keyword, treeId,inputId,key,flag,success})
        }
      },
    },
    mounted() {
      dragAble('#im-chat', '#chat-header-box')

      $(document.body).click(() => {
        this.showMenuBox(false)
      })
    },
    components: {uploadImg},
  }
</script>
<style lang="scss" scoped>
  $bdColor1: rgba(255,255,255,.5);
  @mixin icon {
    display: inline-block;
    width: 70px;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    position: relative;
    /*
    &.active:after {
      content: '';
      display: block;
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translate(-50%, 0);
      border: 5px solid transparent;
      border-bottom-color: #fff;
    }*/

  }
  .img-box .user-img {
    background-image: url('../assets/me.png');
  }
  .header-box {
    position: relative;
    height: 56px;
    /*border-bottom: 1px solid;*/
    background: #EFF1ED;


    .search-box {
      width: 170px;
      height: 100%;
      position: relative;
      .header-box-search-icon {
        position: absolute;
        left: 18px;
        top: 18px;
        background: url('../assets/search.png') no-repeat center center;
        width: 20px;
        height: 20px;
      }
    }
    .search {
      width: 150px;
      border-radius: 20px;
      border: 1px solid #D6D7D6;
      background: #fff;
      /*color: #fff;*/
      text-align: left;
      padding: 5px;
      padding-left: 10px;
      font-size: 12px;
    }

    .btns-box {
      width: 300px;
      padding-left: 100px;
      height: 100%;
      position: relative;

      .chat {
        @include icon;
        background-image: url('../assets/chat.png');
        position: relative;
        &.active,
        &:hover {
          background-image: url('../assets/chat-hover.png');
          background-color: transparent;
        }
      }

      .user {
        @include icon;
        background-image: url('../assets/user.png');
        &.active,
        &:hover {
          background-image: url('../assets/user-hover.png');
          background-color: transparent;
        }
      }
    }
  }
  .header-box-close {
    /*<!--position: absolute;-->*/
    /*<!--right: 8px;-->*/
    /*<!--top: -6px;-->*/
    font-size: 28px;
    color: rgba(100,100,100, .7);
    cursor: pointer;
    &:hover {
      color: #000;
    }
  }
  .menu-icon {
    /*position: absolute;*/
    /*right: 35px;*/
    /*top: 6px;*/
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: rgba(100,100,100,.7);
    position: relative;
    top: -3px;
    margin-right: 5px;
    &:hover {
      color: #000;
    }
  }
  .icon-box {
    position: absolute;
    right: 10px;
    top: 5px;
  }
  .menu-setting {
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 10;
    .list-unstyled {
      padding: 3px 0;
      box-shadow: -2px 2px 8px 0 rgba(0,0,0,.4);
      background: #fff;
      width: 100px;
      border-radius: 4px;
    }
    li {
      padding-left: 15px;
      line-height: 28px;
      cursor: default;
      position: relative;
      &.active,
      &:hover {
        background: #EFF1ED;
      }
    }
    .level-01 {
      height: 100px;
      > li.has-child:after {
        content: '';
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-left-color: rgba(0,0,0,.6);
        position: absolute;
        right: 2px;
        top: 50%;
        margin-top: -5px;
      }
    }
    .level-02 {
      position: absolute;
      right: 105%;
      top: 0;
    }
  }
</style>