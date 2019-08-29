<!--模态框 创建群-->
<template>
  <div class="m-md" :style="{width: width + 'px'}" id="chat-create-group">
    <!--header-->
    <div class="hd" id="chat-create-group-hd">
      创建群
      <span class="u-cs" @click="close">&times</span>
    </div>
    <div class="bd g-mn">
      <!--tab页-->
      <div class="tab">
        <div class="itm" :class="{active: step === 1}"><span class="u-nb">1</span>填写群信息 <span class="cret">&gt;</span>
        </div>
        <div class="itm" :class="{active: step === 2}"><span class="u-nb">2</span>添加群成员</div>
      </div>
      <!--content-->
      <div class="ct g-mnc">
        <div class="step step1" v-show="step === 1">
          <div class="m-item">
            <div class="lb">群名称</div>
            <div class="ct"><input type="text" v-model.trim="groupName" class="form-control"
                                   style="padding: 0 8px; height: 22px;"></div>
          </div>
          <div class="m-item">
            <div class="lb">地区</div>
            <div class="ct">
              <select name="" v-model.number="proIndex">
                <option value="-1" selected>请选择省</option>
                <option :value="i" v-for="(pro, i) in provinces" v-text="pro.provinceName"></option>
              </select>
              <select name="" v-model.number="cityIndex">
                <option value="-1" selected>请选择市</option>
                <template v-if="provinces[proIndex]">
                  <option :value="i" v-for="(city, i) in provinces[proIndex].citys" v-text="city.citysName"></option>
                </template>
              </select>
            </div>
          </div>
          <div class="m-item">
            <div class="lb">人数</div>
            <div class="ct">
              <label class=" radio-inline">
                <input type="radio" name="count" value="200" checked v-model.number="groupNumber"> 200人
              </label>
              <label class="radio-inline">
                <input type="radio" name="count" value="500" v-model.number="groupNumber"> 500人
              </label>
              <label class="radio-inline">
                <input type="radio" name="count" value="1000" v-model.number="groupNumber"> 1000人
              </label>
            </div>
          </div>
        </div>
        <add-user @getNodes="getNodes" v-show="step === 2" :my-user-id="myUserId" :max-member-number="groupNumber"></add-user>
      </div>
    </div>
    <div class="ft">
      <button class="btn btn-default" @click="step = 1" v-show="step===2">上一步</button>
      <button class="btn btn-default" @click="step = 2" v-show="step===1" :disabled="!groupName || proIndex < 0 || cityIndex < 0">下一步</button>
      <button class="btn btn-default" @click="complete" v-show="step===2">完成创建</button>
    </div>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import {dragAble, treeSearch} from '../util/util'
  import addUser from './common/add-user.vue'
  import cityData from '../lib/citys'

  export default {
    props: {
      value: {
        default: false,
        type: Boolean,
      },
      width: {
        value: 200,
      },
    },
    data() {
      return {
        selectedNodes: [],
        groupName: '',
        groupNumber: 200,
        step: 1, // 1 填写群信息 2 添加群成员
//        nodes: data.users.map(user => {
//          user.id = user.id || user.chr_id
//          user.pId = user.pId || user.parent_id
//          return user
//        }),
        provinces: cityData.provinces,
        proIndex: -1,
        cityIndex: -1,
      }
    },
    computed: {
      ...mapState(['myUserId', 'allUsers']),
    },
    methods: {
      getNodes(nodes) {
        this.selectedNodes = nodes
      },
      complete() {
        this.close()
        let proName = this.provinces[this.proIndex].provinceName
        let cityName = this.provinces[this.proIndex].citys[this.cityIndex].citysName
        let groupInfo = {
          "group_id": "",
          "group_type": "1",
          "group_name": this.groupName,
          "group_number": this.groupNumber,
          "group_region": `${proName}#${cityName}`,
          "create_user": this.myUserId,
          "group_users": this.selectedNodes,
          group_introduction: '',
        }
        this.$store.dispatch('group/createGroup', {groupInfo})
      },
      close() {
        this.$emit('input', false)
      },
    },
    mounted() {
      this.$nextTick(() => {
        dragAble('#chat-create-group', '#chat-create-group-hd')
      })
    },
    watch: {
    },
    components: {addUser},
  }
</script>

<style lang="scss" scoped>
  @import "../assets/css/variable";

  .m-md {
    z-index: 99;
    position: fixed;
    width: 600px;
    height: 400px;
    display: flex;
    flex-direction: column;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  .m-md .hd {
    background: #F0F1F5;
    padding: 5px 10px;
    position: relative;
    color: $gray5;
    .u-cs {
      position: absolute;
      right: 10px;
      top: -3px;
    }
  }

  .m-md .bd {
    background: #F6FAFA;
    padding: 5px 10px;
    flex: 1;
    .tab {
      display: flex;
      padding: 10px 100px;
      justify-content: space-between;
      .itm {
        flex: 1;
        color: $gray5;
        display: flex;
        justify-content: center;
        .cret {
          padding-left: 60px;

        }
        &.active {
          color: $gray9;
          .u-nb {
            background: #9ECE4E;
          }
          .cret {
            color: #9ECE4E;
          }
        }

      }
    }
  }

  .m-md .ft {
    background: #ECF5FC;
    text-align: right;
    padding: 5px 10px;
    .btn {
      padding: 2px 8px;
    }
  }

  .u-nb {
    border-radius: 50%;
    width: 18px;
    height: 18px;
    background: $bdColor;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    color: #fff;
    &.active {
      background: #9ECE4E;
    }
  }

  .m-item {
    padding: 20px 0;
  }

  .m-item .lb {
    width: 100px;
    text-align: right;
  }

  .g-mn {
    display: flex;
    flex-direction: column;
  }

  .g-mnc {
    flex: 1;
    display: flex;
  }
</style>
