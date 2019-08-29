<!--群名片-->
<template>
  <div class="g-mn">
    <div class="g-mn2">
      <div class="g-hd">
        <span class="fa fa-camera u-changeLogo" title="更换头像" @click="uploadGroupLogo" v-if="groupInfo.create_user === myUserId"></span>
        <span class="user-img" v-if="!groupInfo.group_logo"></span>
        <img v-else :src="groupInfo.group_logo" alt="" class="f-customImg" >
        <!--<img v-else :src="/df/fap/messageplatform/chat/assets/me.png" alt="" style="width: 60px; height: 60px; border-radius: 50%; margin-right: 15px;">-->
        <span v-text="groupInfo.name"></span>
        <div class="m-send-msg" title="发消息" @click="sendMsg"></div>
      </div>
      <div class="g-bd" v-show="!edit">
        <div class="m-tab">
          <a class="edi-btn" href="javascript:;" v-if="groupInfo.create_user === myUserId" @click="edit = true">编辑资料</a>
          <div class="item">
            <span class="txt" :class="{active: type === 0}" @click="type = 0">首页</span>
          </div>
          <div class="item">
            <span class="txt" :class="{active: type === 1}" @click="type = 1">成员</span>
          </div>
          <div class="item">
            <span class="txt" :class="{active: type === 2}" @click="type = 2">设置</span>
          </div>
        </div>
        <div class="m-bd">
          <!--简介-->
          <template v-if="type === 0">
            <div class="m-item">
              <div class="lb">群介绍</div>
              <div class="ct" v-if="!groupInfo.group_introduction">
                本群创建于<span v-text="groupInfo.create_time.slice(0, 10)"></span>, 群主很懒, 什么都没有留下
              </div>
              <div class="ct" v-else v-text="groupInfo.group_introduction"></div>
            </div>
            <div class="m-item">
              <div class="lb">群主</div>
              <div class="ct" v-text="groupAdmin.name">张三</div>
            </div>
            <div class="m-item">
              <div class="lb">地区</div>
              <div class="ct" v-text="groupInfo.group_region"></div>
            </div>
            <div class="m-item">
              <div class="lb">群大小</div>
              <div class="ct" v-text="groupInfo.group_number"></div>
            </div>
          </template>
          <!--设置-->
          <template v-if="type === 1">
            <div class="m-list">
              <div class="tab">
                <div class="coun">
                  <span v-text="groupInfo.users.length"></span>/<span v-text="groupInfo.group_number"></span>人
                </div>

                <span class="fa fa-user-plus" title="添加成员" @click="addGroupUser"></span>
              </div>
              <div class="tbl">
                <div class="hd">
                  <table>
                    <thead>
                    <tr>
                      <th>
                        <div class="cod">编码</div>
                      </th>
                      <th>
                        <div class="mb">姓名</div>
                      </th>
                      <!--<th>-->
                        <!--<div class="dp">部门</div>-->
                      <!--</th>-->
                      <th>
                        <div class="edi">操作</div>
                      </th>
                      <!--<th><div class="tel">电话</div></th>-->
                    </tr>
                    </thead>
                  </table>
                </div>
                <div class="bd">
                  <table>
                    <tbody>
                    <tr v-for="member in groupInfo.users">
                      <td>
                        <div class="cod" v-text="member.name.split(' ')[0]"></div>
                      </td>
                      <td>
                        <div v-text="member.name.split(' ')[1]" class="mb" :title="member.name"></div>
                      </td>
                      <!--<td>-->
                        <!--<div v-text="member.department" class="dp" :title="member.department">其他信息</div>-->
                      <!--</td>-->
                      <td>
                        <div class="edi" v-if="groupInfo.create_user !== member.id && groupInfo.create_user === myUserId">
                          <button class="btn btn-default" @click="delGroupMember(member)">删除</button>
                        </div>
                      </td>
                      <!--<td><div v-text="member.telephone" class="tel" :title="member.telephone">电话</div></td>-->
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </template>
          <template v-if="type === 2">
            <div class="m-item cent">
              <div class="lb">其他</div>
              <div class="ct">
                <button class="btn btn-default" style="padding: 3px;" v-if="groupInfo.create_user === myUserId" @click="show = true; showMsg='确定解散该群?'">解散该群</button>
                <button class="btn btn-default" style="padding: 3px;" v-else @click="show = true; showMsg='确定退出该群?'">退出该群</button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="g-bd" v-if="edit" style="padding: 15px;">
        <div class="m-item">
          <span class="lb">群名称</span>
          <input class="ct form-control" v-model.trim="groupName">
        </div>
        <div class="m-item" style="flex: 1; margin-bottom: 30px;">
          <span class="lb">群介绍</span>
          <div class="ct" >
            <textarea class="form-control" style="height: 100%; resize: none;" v-model.trim="groupIntro" @input="inputGroupIntro"  cols="30" rows="10" ></textarea>
            <div class="text-right">
              还能输入<span v-text="200 - groupIntro.length">200</span>个字
            </div>
          </div>
        </div>
        <div class="text-right">
          <button class="btn btn-default" @click="confirmEditGroup">确定</button>
          <button class="btn btn-default" @click="edit = false">取消</button>
        </div>
      </div>
    </div>
    <Vodal :show="show" @hide="show = false" :width="250" :height="140">
      <div class="">提示</div>
      <div style="padding: 20px 0; font-size: 16px;" v-text="showMsg"></div>
      <div class="text-right">
        <button class="btn btn-default" @click="confirm">确定</button>
        <button class="btn btn-default" @click="show = false">取消</button>
      </div>
    </Vodal>
    <Vodal v-if="addUserFlag" :show="addUserFlag"  @hide="addUserFlag = false" :width="600" :height="400" class-name="f-vodal">
      <div>添加群成员</div>
      <add-user @getNodes="getNodes" :members="groupInfo.users" :max-member-number="parseInt(groupInfo.group_number)"></add-user>
      <div class="text-right">
        <button class="btn btn-default" @click="confirmAddNodes" :disabled="!selectedNodes.length">确定</button>
        <button class="btn btn-default" @click="addUserFlag = false">取消</button>
      </div>
    </Vodal>
    <upload-img v-if="showUploadImg" :show="showUploadImg" @upload="uploadImg" @hide="showUploadImg = false"></upload-img>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import Vodal from 'vodal'
  import addUser from './common/add-user.vue'
  import {dereplication} from '../util/util'
  import uploadImg from './common/upload-img.vue'

  export default {
    props: {
      groupInfo: Object,

    },
    data() {
      return {
        type: 0, // 0 首页 1 成员 2 设置
        edit: false,
        show: false,
        showMsg: '',

        addUserFlag: false, // 显示添加群成员的框
        selectedNodes: [],

        groupName: '',
        groupIntro: '',

        showUploadImg: false,
//        members: [
//          {name: '3', department: '1'},
//          {name: '1', department: '1', telephone: 1},
//          {name: '2', department: '1'},
//          {name: '3', department: '1'},
//          {name: '1', department: '1', telephone: 1},
//          {name: '2', department: '1'},
//          {name: '3', department: '1'},
//          {name: '3', department: '1'},
//          {name: '1', department: '1', telephone: 1},
//          {name: '2', department: '1'},
//          {name: '3', department: '1'},
//          {name: '3', department: '1'},
//          {name: '1', department: '1', telephone: 1},
//          {name: '2', department: '1'},
//          {name: '3', department: '1'},
//          {name: '3', department: '1'},
//          {name: '1', department: '1', telephone: 1},
//          {name: '2', department: '1'},
//          {name: '3', department: '1'},
//          {name: '3', department: '1'},
//          {name: '1', department: '1', telephone: 1},
//          {name: '2', department: '1'},
//          {name: '3', department: '1'},
//        ],
      }
    },
    computed: {
      ...mapState(['myUserId', 'allUsers']),
//      members() {
//        return this.groupInfo.users.map(o => {
//          let map = {name: '', department: '', telephone: ''}
//          let obj = {...o, ...map}
//        })
//      },
      groupAdmin() {
        let user = {}
        this.allUsers.some(o => {
          if(o.id === this.groupInfo.create_user) {
            user = o
            return true
          }
        })
        return user
      },
    },
    methods: {
      uploadImg(file) {
        this.$store.dispatch('uploadImg', {file, id: this.groupInfo.id})
      },
      uploadGroupLogo() {
        this.showUploadImg = true
      },
      confirmEditGroup() {
        let groupInfo = {
          "group_id": this.groupInfo.id,
          "group_type": "1",
          "group_name": this.groupName,
          "group_number": this.groupInfo.group_number,
          "group_region": this.groupInfo.group_region,
          "create_user": this.groupInfo.create_user,
          "group_users": this.groupInfo.users,
          create_time: this.groupInfo.create_time,
          group_introduction: this.groupIntro,
        }
        this.$store.dispatch('group/createGroup', {groupInfo, type: 'edit'})
      },
      inputGroupIntro(e) {
        if(this.groupIntro.length >= 200) {
          this.groupIntro = this.groupIntro.slice(0, 200)
        }
      },
      delGroupMember(member) {
        let groupId = this.groupInfo.id
        let userId = member.id
        let groupName = this.groupInfo.name
        this.$store.dispatch('group/leaveGroup', {groupId, userId, groupName, msg: '删除成功'})
      },
      confirmAddNodes() {
        this.addUserFlag = false
        let groupInfo = {
          "group_id": this.groupInfo.id,
          "group_type": "1",
          "group_name": this.groupInfo.name,
          "group_number": this.groupInfo.group_number,
          "group_region": this.groupInfo.group_region,
          "create_user": this.groupInfo.create_user,
          "group_users": this.selectedNodes,
          create_time: this.groupInfo.create_time,
          group_introduction: '',
          allUsers: this.groupInfo.users.concat(this.selectedNodes),
        }

        this.$store.dispatch('group/createGroup', {groupInfo, type: 'addUser'})
      },
      getNodes(nodes) {
        this.selectedNodes = nodes
      },
      // 添加群成员
      addGroupUser() {
        this.addUserFlag = true
      },
      sendMsg() {
        this.$store.commit('GOTO_CHAT')
      },
      confirm() {
        this.show = false
        if(this.groupInfo.create_user === this.myUserId) {
          this.$store.dispatch('group/delGroup', {id: this.groupInfo.id, name: this.groupInfo.name})
        } else
          this.$store.dispatch('group/leaveGroup', {groupId: this.groupInfo.id, userId: this.myUserId, groupName: this.groupInfo.name})
      },
    },
    watch: {
      groupInfo() {
        this.edit = false
        this.groupName = this.groupInfo.name
        this.groupIntro = this.groupInfo.group_introduction
      },
    },
    mounted() {
      this.groupName = this.groupInfo.name
      this.groupIntro = this.groupInfo.group_introduction
    },
    components: {Vodal, addUser, uploadImg},
  }
</script>
<style>
  .f-vodal .vodal-dialog {
    display: flex;
    flex-direction: column;
  }
</style>
<style lang="scss" scoped>
  @import "../assets/css/variable";
  .g-mn {
    height: 100%;
    padding-top: 20px;
  }

  .g-mn2 {
    height: 100%;
    display: flex;
    width: 400px;
    margin: 0 auto;
    box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.3);
    flex-direction: column;
    background: #fff;
  }

  .g-hd {
    position: relative;
    /*background: #DCE3EA;*/
    background: #D9F3FF;
    text-align: center;
    font-size: 24px;
    padding: 10px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .user-img {
      background-image: url(../assets/group2.png);
      width: 60px;
      height: 60px;
      margin-right: 15px;
    }
    .u-changeLogo {
      font-size: 14px;
    }
  }

  .g-bd {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 5px;
  }

  .m-tab {
    height: 45px;
    padding: 10px 90px 0;
    position: relative;
    .edi-btn {
      position: absolute;
      left: 20px;
      top: 11px;
      font-size: 12px;
      text-decoration: none;
      color: #02A1E9;
    }
  }

  .m-bd {
    padding: 0 10px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .m-list {
    display: flex;
    flex-direction: column;
    flex: 1;
    .tab {
      height: 24px;
      line-height: 24px;
      .fa {
        float: right;
        padding-top: 5px;
        padding-right: 15px;
        display: inline-block;
        width: 12px;
        height: 12px;
        color: $gray5;
        cursor: pointer;
        &:hover {
          color: $gray7;
        }
      }
      .coun {
        padding-left: 8px;
        color: $gray5;
        float: left;
        font-size: 13px;
      }
    }
    .tbl {
      flex: 1;
      line-height: 24px;
      display: flex;
      flex-direction: column;
      .hd {
        background: #ECECEC;
      }
      .bd {
        overflow-y: auto;
        flex: 1;
      }
      .mb,
      .dp,
      .tel,
      .edi,
      .cod {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        font-weight: normal;
        color: $gray5;
      }
      .mb {
        width: 150px;
      }
      td .mb,
      td .cod {
        text-align: left;
      }
      .dp {
        width: 150px;
      }
      .tel {
        width: 100px;
      }
    }
  }
  .f-vodal {
    .vodal-dialog {

    }
  }
  .m-item.cent {
    align-items: center;
  }

  .f-customImg {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }

</style>