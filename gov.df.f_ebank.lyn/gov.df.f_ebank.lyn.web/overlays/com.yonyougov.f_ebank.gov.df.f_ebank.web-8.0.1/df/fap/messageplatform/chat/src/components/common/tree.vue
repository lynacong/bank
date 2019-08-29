<!--tree组件-->
<template>
  <div class="m-tree2">
    <input class="f-sea form-control" type="text" placeholder="输入查找关键字" @keyup.enter="search($event)">
    <ul class="list-unstyled ul" >
      <item :model="model" v-for="(model, i) in list2" :key="i"
            @selNode="selNode"
            @multiSel="multiSel"
            :level="1" :active-id="activeId" :id-list="idList"></item>
    </ul>
  </div>
</template>
<script>
  import item from './tree-item.vue'
  import {transformArray2Tree, transformTree2Array} from '../../util/util'
  let rs = [],
    valCache = '',
    index = 0
  export default {
    props: {
      nodes: Array,
      searchKey: String,
    },
    data() {
      return {
        idList: [], // 界面被选中的id
        activeId: '',
        list: [
          {name: 1, id: 1, children: [{name: 11, id: 11,}, {name: 12, id: 12}]},
          {name: 2, id: 2, children: []},
          {name: 3, id: 3, children: []},
        ],
      }
    },
    computed: {
      list2() {
        return transformArray2Tree(this.nodes)
      },
      arrayList() {
        return transformTree2Array(this.list2)
      },
      // 实际被选中的id
      selIdList() {
        let list = []
        if(this.idList.length === 1) {
          let id = this.idList[0]
          this.arrayList.some(o => {
            if(o.id === id) {
              if(o.children && o.children.length) {
                list = list.concat(transformTree2Array(o.children).filter(o => o.isuser == 1).map(obj => obj.id))
              }
              else list.push(id)
              return true
            }
          })
        }
        return list
      },
    },
    methods: {
      search(e) {
        let val = e.target.value.trim()
        if(!val) return
        if(val !== valCache) {
          valCache = val
          rs = []
          index = 0
          this.arrayList.forEach(o => {
            if(o.id.indexOf(val) > -1 || o.name.indexOf(val) > -1) {
              rs.push(o.id)
            }
          })
        } else {
          index++
          if(index > rs.length - 1) {
            index = 0
          }
        }
        if(rs.length)
          this.idList = [rs[index]]
      },
      selNode(id) {
        let list = []
        this.arrayList.some(o => {
          if(o.id === id) {
            if(o.children && o.children.length) {
              list = list.concat(transformTree2Array([o]).map(obj => obj.id))
            }
            else list.push(id)
          }
        })
        this.idList = [id]
      },
      multiSel(id) {
        if(this.idList.length) {
          let s = -1, cur = -1, end = -1
          this.arrayList.some(o => {
            let i = this.idList.indexOf(o.id)
            if( i > -1) {
              s = i
              return true
            }
          })
          this.arrayList.some(o => {
            let i = this.idList.indexOf(id)
            if( i > -1) {
              cur = i
              return true
            }
          })
          if(s < cur) {
            this.idList = this.arrayList.filter( (o, i) => i >=s && i <= cur).map(o => o.id)
            return
          }
          this.arrayList.reverse().some(o => {
            let i = this.idList.indexOf(id)
            if( i > -1) {
              end = i
              return true
            }
          })
          this.idList = this.arrayList.filter((o, i) => i >= cur && i <= end).map(o => o.id)
          this.selIdList = this.idList
        }
      },
    },
    components: {item},
    watch: {
      selIdList(val) {
        this.$emit('selNodes', val)
      },
    },
  }

  function transform2TreeData({data, id = 'id', pId = 'pId', name = 'name', rootPId = null }) {
    let rs = []
    data.forEach(o => {
      if(o[pId] === rootPId) {
        rs.push(o)
        o.children = getChildren({data, par: o, id, pId})
      }
    })
    return rs
  }
  function getChildren({data, par, id, pId}) {
    let children = []
    data.forEach(o => {
      if(o[pId] === par[id]) {
        o.children = getChildren({data, par: o, id, pId})
        children.push(o)
      }
    })
    return children
  }
</script>
<style lang="scss" scoped>
  .m-tree2 {
    display: flex;
    flex-direction: column;
    flex: 1;
    .ul {
      flex: 1;
      overflow: auto;
    }
  }
</style>