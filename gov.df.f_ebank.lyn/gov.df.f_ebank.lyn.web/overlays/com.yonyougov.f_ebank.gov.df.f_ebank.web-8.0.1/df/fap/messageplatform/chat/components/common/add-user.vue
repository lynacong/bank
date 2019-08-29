<template>
  <div class="m-add-user">
    <div class="tre">
      <input class="f-sea form-control" id="chat-modal-tree-search" type="text" placeholder="输入查找关键字"
             @keyup.enter="search($event)">
      <div class="bx">
        <div class="ztree" :id="id"></div>
      </div>
      <!--<Tree :nodes="nodes" @selNodes="selNodes"></Tree>-->
    </div>
    <div class="btns">
      <div>
        <button class="btn btn-default" @click="addUser">添加&gt;</button>
      </div>
      <div>
        <button class="btn btn-default" @click="delUser" :disabled="!delIdList.length">&lt;删除</button>
      </div>
    </div>
    <div class="seled">
      <ul class="list-unstyled" id="chat-seled-users" onselectstart="return false;">
        <li v-for="(obj, i) in selectedNodes" @click="addRemoveId($event, i)" class="txt-box f-ellipse"
            :class="{act: delIdList.indexOf(i) > -1}">
          <span v-text="obj.name" class="txt"></span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import {dragAble, treeSearch} from '../../util/util'

  let tree_setting = {
    data: {
      simpleData: {
        enable: true,
        idKey: 'id',
        pIdKey: 'pid',
        rootPId: null,
      }
    },
  }
  let num = 0
  let getId = () => {
    return 'chat-modal-tree' + num++
  }
  export default {
    props: {
      // 已经存在的群成员
      members: {
        type: Array,
        default() {
          return []
        },
      },

      myUserId: {
        type: String,
        default: '',
      },

      maxMemberNumber: {
        type: Number,
      },
    },
    data() {
      return {
        searchKey: '',
        idList: [], // 左侧被选中的用户id列表
        objList: [],
        selIdList: [], // 右侧已经选择的id列表
        delIdList: [], // 右侧将要被删除的id列表
        id: getId(),
      }
    },
    computed: {
      ...mapState(['allUsers']),
      selectedNodes() {
        this.$nextTick(() => {
          let li = $('#chat-seled-users > li:last-child')[0]
          // let li = $(`#${this.id} > li:last-child`)[0]
          if (li) li.scrollIntoView()
        })
        let nodes = this.selIdList.map(id => {
          let obj
          this.allUsers.some(node => {
            if (node.id === id) {
              obj = node
              return true
            }
          })
          return obj || {}
        })

        this.$emit('getNodes', nodes)

        return nodes
      },
    },
    methods: {
      addRemoveId(e, index) {
        let ctrl = e.ctrlKey,
          shift = e.shiftKey
//      if(keyCode === )
        let list = this.delIdList,
          i = list.indexOf(index)
        if (ctrl) {
          if (i > -1) {
            list.splice(i, 1)
          } else list.push(index)
        } else if (shift && list.length) {
          let s = -1, end = -1
          end = Math.max.apply(null, this.delIdList)
          s = Math.min.apply(null, this.delIdList)
          if (s <= index) {
            this.delIdList = Array(index - s + 1).fill(0).map(() => s++)
          } else
            this.delIdList = Array(end - index + 1).fill(0).map(() => index++)
        } else {
          this.delIdList = i > -1 ? [] : [index]
        }

      },
      delUser() {
        this.selIdList = this.selIdList.filter((id, i) => this.delIdList.indexOf(i) === -1)
        if(this.myUserId) {
          if (!this.selIdList[0] || this.selIdList[0] !== this.myUserId) {
            this.selIdList.unshift(this.myUserId)
          }
        }
        this.delIdList = []
      },
      addUser() {
        let treeObj = $.fn.zTree.getZTreeObj(this.id)
        let nodes = treeObj.getSelectedNodes()
        let rs = []
        nodes.forEach(o => {
          if (rs.indexOf(o.id) === -1) {
            if (o.children && o.children.length) {
              rs = rs.concat(treeObj.transformToArray(o.children).filter(o => o.isuser == 1).map(o => o.id))
            } else if (o.isuser == 1) {
              rs.push(o.id)
            }
          }
        })
        let name = ''
        if(this.members.length)
          rs.some(id => {
            return this.members.some(obj => {
              if(obj.id === id) {
                name = obj.name
                return true
              }
            })
          })
        if(name) {
          this.$store.commit('VODAL_CONF', {content: `${name} 已经是群成员了`, width: 300, height: 200})
          return
        }
        let list = this.selIdList.concat(rs).filter((o, i, arr) => i === arr.indexOf(o))
        if((list.length + this.members.length > this.maxMemberNumber)) {
          this.$store.commit('VODAL_CONF', {content: `超过了群的最大成员数 ${this.maxMemberNumber}`, width: 300, height: 200})
          return
        }
        this.selIdList = list
      },
      selNodes(list) {
        this.idList = list
      },
      search(e) {
        let val = e.target.value.trim()
        treeSearch({keyword: val, treeId: this.id, inputId: 'chat-modal-tree-search'})
      },
    },
    mounted() {
      if(this.myUserId)
        this.selIdList = [this.myUserId]
      this.$nextTick(() => {
        $.fn.zTree.init($(`#${this.id}`), tree_setting, this.allUsers)
      })
    },
    watch: {
      allUsers(list) {
        $.fn.zTree.init($(`#${this.id}`), tree_setting, list)
      },
    },
  }
</script>
<style lang="scss" rel="stylesheet">
  @import "../../assets/css/variable";

  .m-add-user {
    flex: 1;
    /*width: 100%;*/
    /*height: 100%;*/
    display: flex;
    .tre {
      flex: 1;
      display: flex;
      width: 1px;
      flex-direction: column;
      .bx {
        flex: 1;
        overflow: auto;
      }
    }
    .seled {
      flex: 1;
      width: 1px;
      padding: 5px 10px;
      overflow: auto;
      .txt-box {
        &.act {
          background: #66C6FC;
        }
      }
      .txt {
        white-space: nowrap;
        cursor: default;
        font-size: 12px;
        &.act {
          background: #66C6FC;
        }
      }
    }
    .btns {
      width: 100px;
      text-align: center;
      background: #fff;
      .btn {
        padding: 2px 8px;
        margin-top: 50px;
      }
    }
  }

  .f-sea {
    margin-bottom: 10px;
    padding: 2px 5px;
    height: 24px;
  }
</style>