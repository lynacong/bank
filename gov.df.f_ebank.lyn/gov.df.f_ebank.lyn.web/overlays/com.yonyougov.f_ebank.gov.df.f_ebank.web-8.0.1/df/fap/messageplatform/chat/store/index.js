import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import mutations from './mutations'
import getters from './getters'
import historyMsg from './historyMsg/index'
import group from './group/index'
import sdChat from './sdChat/index'
import {msgs} from './mock'

const state = {
  width: 760, // 整个容器的宽度
  showImChatBox: true, // 是否显示即时通讯窗口
  activeTab: 0, // 0是聊天窗口, 1是用户窗口
  msgs: [],
  // msgs, // 从后台获取的消息
  totalCount: 0, // 未读消息条数
  myUserId: '', // 当前用户的id, 即我
  myInfo: {}, // 我的一些信息
  activeUserId: '', // 对话窗口左侧列表被激活用户的id
  noMoreMsg: false, // 没有更多消息了
  myMsgs: [], // 我发送的消息 -> 因为新增消息时只返回了时间,
              // 没有消息id, 而每次获取消息时都会去重, 导致不用这个对象会把自己发送的消息只留下一条
  keyword: '', // 搜索用户
  searchUserList: [], // 搜索到的用户列表
  activeSearchUserIndex: -1, // 搜索到的被激活用户索引
  userList: [], // 聊天窗口的用户列表
  userGetDeparment: null, // 正在获取部门信息的用户
  actionType: 0, // 0表示发送消息, 1获取历史消息, 发新消息时滚动条要滚动到底部, 获取历史消息时, 滚动条滚动到最顶部
  searchUserType: 0, // 0表示新关键字搜索的新用户, 1表示获取更多用户
  chatUsers: [], // 用户列表, 主要用于判断每个用户是否所有消息加载完毕
  noticeGotoChat: false, // 值变化时 触发 search-users里面的gotoChat方法
  allUsers: [], // 所有的用户
  activeUser: null, // 所有用户左侧列表中被激活的用户, 用于user_tab组件显示用户相关信息
  fileList: [/*{msgId: 1, file: ''}*/], // 文件列表
  billMessageData: '', // 单据消息
  historyMsgBoxState: {show: false, end: true}, // show 是否显示, end 是否滚动到底部

  searchInfo: {type: 0, treeId: 'user-tree1'},

  groupList: [], // 群列表
  vodalConf: {
    show: false,
    content: '',
    title: '提示',
    width: 200,
    height: 120,
  }, // 弹出框的设置
}

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  actions,
  getters,
  mutations,
  modules: {
    historyMsg,
    group,
    sdChat,
  },
  strict: debug,
})