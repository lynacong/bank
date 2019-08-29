<!--用户以及群列表容器页面-->
<template>
  <!--<div class="users-box" @scroll="getMoreUser($event)">-->
  <div class="users-box">
    <!--顶部tab页-->
    <div class="g-hd m-tab">
      <div class="item">
        <span class="txt" :class="{active: type === 0}" @click="tabChange(0)">好友</span></div>
      <div class="item">
        <span class="txt" :class="{active: type === 1}" @click="tabChange(1)">群</span></div>
    </div>
    <div class="g-bd">
      <div v-show="type === 0">
        <div v-if="allUsers.length" class="ztree" id="user-tree1"></div>
        <loading v-else style="margin-top: 100px;"></loading>
      </div>
      <div v-show="type === 1">
        <div v-if="!loading && groupList.length" class="ztree" id="group-tree"></div>
        <loading v-if="loading" style="margin-top: 100px;"></loading>
        <div v-if="!groupList.length && !loading" style="padding: 10px;">暂未加入任何群</div>
      </div>
    </div>

    <div class="u-add" title="创建群" @click="showAddModal = true"></div>
    <Modal v-if="showAddModal" v-model="showAddModal" id="chat-create-group"></Modal>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import loading from './common/loading.vue'
    import Modal from './modal.vue'
  import {createUser, treeSearch} from '../util/util'

  let vm = null
  const tree1 = {
    setting: {
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'pid',
          rootPId: null,
        }
      },
      callback: {
        onClick(e, treeId, treeNode) {
          if (treeNode.isuser == 1) {
            treeNode.mobile = treeNode.mobile || ''
            treeNode.telephone = treeNode.telephone || ''
            treeNode.department = treeNode.department || ''
            treeNode.photo = treeNode.photo || ''
            vm.$store.commit('SET_ACTIVE_USER', treeNode)
            treeNode.department || vm.$store.dispatch('getDepartment', {id: treeNode.id})
            vm.node = treeNode
          }

        },
        onDblClick(e, treeId, treeNode) {
          if (treeNode.isuser == 1) {
            vm.gotoChat({node: treeNode})
          }
        },
      },
    },
    instance: null,
    nodes: [],
  }
  let group_set = {
    callback: {
      onClick(e, treeId, treeNode) {
        vm.node = treeNode
        vm.showGroupInfo(treeNode)
      },
      onDblClick(e, treeId, treeNode) {
        vm.gotoChat({node: treeNode, groupId: treeNode.id, users: treeNode.users})
      },
    },
  }
  export default {
    data() {
      return {
        activeIndex: 0,
        node: null, // 被点击的用户或用户群
        type: 0, // 0 好友 1 群
        showAddModal: false,
      }
    },
    computed: {
      ...mapState(['searchUserList', 'myUserId', 'noticeGotoChat', 'allUsers', 'groupList', 'allUsers']),
      loading() {
        return !this.allUsers.length
      },
      userList() {
        if (this.$store.state.searchUserType === 0) {
          this.showDetail(0)
//          this.$store.commit('SEARCH_USER_TYPE', 1)
          this.$nextTick(() => {
            const li = $('#search-user-list > li:first-child')[0]
            if (li) li.scrollIntoView()
          })
        }
        return this.$store.state.searchUserList
      },
      user() {
        return this.userList[this.activeIndex]
      },
    },
    methods: {
      ...mapActions(['getDepartment']),
      showGroupInfo(group) {
        this.$emit('showGroupInfo', JSON.parse(JSON.stringify(group)))
      },
      // 点击用户, 显示详情
      showDetail(i) {
        this.$store.commit('ACTIVE_SEARCH_USER_INDEX', i)
        this.activeIndex = i
        // 获取用户部门
        if (this.searchUserList[i] && !this.searchUserList[i].department) {
          this.getDepartment(this.searchUserList[i].id)
        }
      },
      gotoChat({node = {}, groupId = '', users = []} = {}) {
        // 如果是自己, 则不做任何操作
        if (node.id === this.myUserId) return
        this.$store.commit('SET_ACTIVE_TAB', 0)
        let name = node.name.split(' ').map(o => o.trim())
        name = name[1] || name[0]
        let groupNumber = node.group_number || 0
        if (this.$store.state.userList.every(user => user.id !== node.id)) {
          this.$store.commit('ADD_USER', createUser({
            id: node.id,
            groupId,
            name,
            msgs: [],
            notReadCount: 0,
            historyMsgs: [],
            department: node.getParentNode() ? node.getParentNode().name.split(' ')[1] : '',
            photo: node.photo,
            users,
            groupNumber,
          }))
        }
        this.$store.commit('ACTIVE_USER_ID', node.id)
      },
      getMoreUser(e) {
        var $this = $(e.target),
          viewH = $this.height(),//可见高度
          contentH = $this.get(0).scrollHeight,//内容高度
          scrollTop = $this.scrollTop();//滚动高度
        //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
        if (scrollTop / (contentH - viewH) >= 0.95) { //到达底部100px时,加载新内容
          // 这里加载数据..
          this.$store.dispatch('searchUser')
        }
      },

      tabChange(type) {
        this.type = type
        this.$emit('tabChange', type)
        let treeId = type === 0 ? 'user-tree1' : 'group-tree'
        this.$store.commit('SEARCH_INFO', {treeId})
      },
    },
    watch: {
      noticeGotoChat() {
        this.gotoChat({node: vm.node})
      },
      allUsers(newV) {
        if (!tree1.instance) {
          this.$nextTick(() => {
//            console.log($('#user-tree1'))
            tree1.nodes = newV
            tree1.instance = $.fn.zTree.init($('#user-tree1'), tree1.setting, tree1.nodes)
//          tree1.instance.expandAll(true)
          })
        }
      },
      groupList(newV, oldV) {
        let treeObj = $.fn.zTree.getZTreeObj('group-tree')
        let node = null
        if (treeObj)
          node = treeObj.getSelectedNodes()[0]
        this.$nextTick(() => {
          let tree = $.fn.zTree.init($('#group-tree'), group_set, newV)
          let newNode = null
          //如果原先有节点被选中
          if (node) {
            newNode = tree.getNodeByParam('id', node.id)
            if (newNode) {
              tree.selectNode(newNode)
            }
          }
          this.showGroupInfo(newNode)
        })


//        if(newV.length !== oldV.length) {
//          this.$nextTick(() => {
//            this.showGroupInfo(null)
//            $.fn.zTree.init($('#group-tree'), group_set, newV)
//          })
//        } else {
//          let node
//          newV.some(o => {
//            if(o.id === this.node.id) {
//              node = o
//              return true
//            }
//          })
//          this.showGroupInfo(node)
//        }
      },
//
    },
    mounted() {
      vm = this
//      $.fn.zTree.init($('#group-tree'), {}, [{name: '1', id: '1'}])
    },
    components: {
      loading,
      Modal,
//      Modal(resolve) {
//        //异步组件写法
//        require(['./modal.vue'], resolve)
//      }
    },
  }
</script>
<style lang="scss" scoped>
  @import "../assets/css/variable";

  .users-box {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    position: relative;
    /*padding: 0 5px;*/
    /*.users-inner-box {*/
    /*height:100%;*/
    /*overflow: auto;*/
    /*}*/
  }

  .g-bd {
    flex: 1;
    overflow: auto;
  }

  .user-box {
    /*clear: both;*/
    padding: 0;
    height: 50px;
    &:hover,
    &.active {
      background: #F5F5F5;
    }
  }

  .img-box {
    float: left;
  }

  .user-title {
    float: left;
    width: 65%;
    height: 100%;
    .title {
      font-size: 16px;
      overflow: hidden;
      margin: 0;
      padding-top: 20px;
      padding-bottom: 5px;
      white-space: nowrap;
    }
    .msg {
      margin-bottom: 0;
      overflow: hidden;
      color: rgba(0, 0, 0, .5);
      font-size: 12px;
    }
  }

  .u-add {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    background: #0188FB;
    position: absolute;
    right: 20px;
    bottom: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:after,
    &:before {
      content: '';
      width: 15px;
      height: 1px;
      position: absolute;
      flex: 1;
      background: #fff;
    }
    &:before {
      width: 1px;
      height: 15px;
    }
    &:hover {
      background: #289CFF;
    }
  }
</style>