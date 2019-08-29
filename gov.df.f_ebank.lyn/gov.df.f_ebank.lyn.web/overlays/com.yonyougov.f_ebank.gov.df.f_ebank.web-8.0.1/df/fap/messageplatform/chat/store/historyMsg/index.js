import getters from './getters'
import mutations from './mutations'
import * as actions from './actions'
const state = {
  users: {
    // id: {  // 所有的消息, 以日期字符串为key
    //   // dateStr: {
    //   //   pageNum: '',
    //   //   end: false,
    //   //   msgs: [],
    //   //   loading: false,
    //   // }
    // }
  },
  allMsgs: {  // 所有的消息, 以日期字符串为key
    // dateStr: {
    //   pageNum: '',
    //   end: false,
    //   msgs: [],
    //   loading: false,
    // }
  },
  dateStr: '', // 日期
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}