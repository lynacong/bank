<!--tree组件-->
<template>
  <li class="m-tree" @click.stop="toggle(model)">
    <div href="javascript:;"
         class="f-ellipse"
         :class="{act: idList.indexOf(model.id) > -1}" @click="selNode(model)" @click.shift="multiSel(model)">
      <a class="txt"
         :style="{marginLeft: 10 * level+'px'}"
         :class="{opn: open, folderIcon: isFolder}" href="javascript:;" v-text="model.name" :title="model.name"></a>
      <!--<span class="glyphicon" v-if="isFolder" :class="{'glyphicon-plus': !open, 'glyphicon-minus': open}"></span>-->
    </div>
    <ul class="list-unstyled" v-if="isFolder && open">
      <item v-for="(model, i) in model.children" :model="model" :key="i" :active-id="activeId"
            @selNode="deliver"
            @multiSel="deliver2"
            :level="level+1" :id-list="idList"></item>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'item',
    props: {
      idList: Array,
      model: Object,
      activeId: String,
      level: Number,
//      openAll: Boolean
    },
    data: function () {
      return {
        open: false,
      }
    },
    computed: {
      isFolder: function () {
        return this.model.children && this.model.children.length
      },
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open
        } else {
        }
      },
      selNode(model) {
        this.$emit('selNode', model.id)
      },
      deliver(id) {
        this.$emit('selNode', id)
      },
      multiSel(model) {
        if(this.idList.length) {
          this.$emit('multiSel', model.id)
        }
      },
      deliver2(id) {
        this.$emit('multiSel', id)
      },
    },
  }
</script>
<style lang="scss" scoped>
  .m-tree {
    .act {
      background: #66C6FC;
    }
    .txt {
      padding-left: 15px;
      font-size: 12px;
      position: relative;
      color: #000;
      cursor: default;
      &:hover,
      &:focus {
        text-decoration: none;
      }
    }
    .folderIcon {
      &:before {
        content: '';
        width: 0;
        height: 0;
        border: 5px solid transparent;
        border-left-color: #000;
        position: absolute;
        left: 5px;
        top: 3px;
      }
    }
    .folderIcon.opn {
      &:before {
        transform: rotate(90deg);
        transform-origin: 1px center;
      }
    }
  }
</style>