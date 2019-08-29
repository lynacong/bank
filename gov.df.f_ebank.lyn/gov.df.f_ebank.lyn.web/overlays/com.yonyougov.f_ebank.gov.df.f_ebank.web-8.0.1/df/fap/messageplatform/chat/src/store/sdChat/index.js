import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'
const state = {
  showDiscussBox: false, // 是否显示共商共建聊天框
  groupId: '', // 群聊id
  groupUsers: [], // 群聊用户
  parentNode: undefined, // 容器的dom元素
  containerId: '',
  isClose: false, // 讨论是否已经关闭
  iframeName: '问题共商',
  mainChatActiveUserIdBak: '', // 主界面的activeUserId的备份
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}