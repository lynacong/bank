import {removeItemFromArray, saveNotReadMsg} from "../util/util"
import {groupAdapter} from '../util/adapter'
export default {
  SET_ACTIVE_TAB(state, i) {
    state.activeTab = i
  },
  GET_MSG(state, msgs) {
    state.msgs = msgs
    saveNotReadMsg(msgs.filter(msg => msg.notRead))
  },
  ALERT_MSG(state, ids = []) {
    // state.msgs.forEach(msg => {
    //   ids.some(id => {
    //     if(msg.msg_id === id) {
    //       msg.notRead = false
    //       return true
    //     }
    //   })
    // })
    ids.forEach(id => {
      for(let msg of state.msgs) {
        if(msg.msg_id === id) {
          msg.notRead = false
          return
        }
      }
    })

    // saveNotReadMsg(msgs.filter(msg => msg.notRead))
  },
  REMOVE_MSG(state, msgs = []) {
    msgs.forEach(delMsg => {
      let i = state.msgs.findIndex(msg => msg.msg_id === delMsg.msg_id)
      if(i > -1) {
        state.msgs.splice(i, 1)
      }
      // state.msgs.some((msg,i) => {
      //   if(msg.msg_id === delMsg.msg_id) {
      //     state.msgs.splice(i, 1)
      //   }
      // })
    })

    saveNotReadMsg(msgs.filter(msg => msg.notRead))
  },
  REMOVE_MY_MSG(state, msgs = []) {
    msgs.forEach(delMsg => {
      let i = state.myMsgs.findIndex(msg => msg.msg_id === delMsg.msg_id)
      if(i > -1) {
        state.myMsgs.splice(i, 1)
      }
      // state.myMsgs.some((msg,i) => {
      //   if(msg.msg_id === delMsg.msg_id) {
      //     state.msgs.splice(i, 1)
      //   }
      // })
    })
  },
  // 给单个员工添加部门信息
  ADD_DEPARTMENT(state, {photo, department, mobile, telephone} = {}) {
    // state.searchUserList.some(user => {
    //   if(user.id === userId) {
    //     // 如果user没有这个属性, 此时给其添加这个属性是不会触发视图更新的,
    //     // user必须原先已经有了这个属性
    //     user.department = department
    //     user.mobile = mobile
    //     user.telephone = telephone
    //     return true
    //   }
    // })
    let user = state.activeUser
    user.department = department
    user.mobile = mobile
    user.telephone = telephone
    user.photo = photo
  },
  ADD_DEPARTMENT_2(state, {department, id, photo}) {
    state.userGetDeparment = {
      department,
      id,
      photo,
    }
  },
  ADD_MSG(state, msg) {
    state.msgs.push(msg)
  },
  ADD_MY_MSG(state, msg) {
    state.myMsgs.push(msg)
  },
  UPDATE_MY_MSG(state, {msg, tempMsgId}) {
    state.myMsgs.some((myMsg,i,arr) => {
      if(myMsg.msg_id === tempMsgId) {
        arr.splice(i, 1, msg)
        return true
      }
    })
  },
  TOTAL_COUNT(state, count) {
    state.totalCount = count
  },
  ACTIVE_USER_ID(state, id) {
    state.activeUserId = id
  },
  USER_ID(state, id) {
    state.myUserId = id
  },
  SET_KEY_WORD(state, keyword) {
    state.keyword = keyword
  },
  SET_USER_LIST(state, {userList, addFlag}) {
    userList.forEach(user => {
      user.department = user.department || ''
    })
    if(addFlag) state.searchUserList = state.searchUserList.concat(userList)
    else state.searchUserList = userList
  },
  ACTIVE_SEARCH_USER_INDEX(state, i) {
    state.activeSearchUserIndex = i
  },
  ADD_USER(state, user) {
    if(state.userList.every(existUser => existUser.id !== user.id)) {
      state.userList.push(user)
    }
  },
  ALTER_USER_LOGO(state, {url, id}) {
    state.activeUser.photo = url
  },
  REMOVE_USER(state, userId) {
    state.userList.some((user,i,arr) => {
      if(user.id === userId) {
        arr.splice(i, 1)
        return true
      }
    })
  },
  SET_NO_MORE_MSG(state, flag) {
    state.noMoreMsg = flag
  },
  SET_ACTION_TYPE(state, num) {
    state.actionType = num
  },
  SET_NO_MORE_FOR_USER(state, {id, noMore}) {
    let exist =
      state.chatUsers.some(user => {
        if(user.id === id) {
          user.noMore = noMore
          return true
        }
      })
    if(!exist) {
      state.chatUsers.push({
        id,
        noMore
      })
    }
  },
  REMOVE_USER_NOMORE_INFO(state, userId) {
    removeItemFromArray(state.chatUsers, 'id', userId)
  },
  SEARCH_USER_TYPE(state, num) {
    state.searchUserType = num
  },
  GOTO_CHAT(state) {
    state.noticeGotoChat = !state.noticeGotoChat
  },
  GET_USERS(state, users) {
    state.allUsers = users.map(user => {
      if(user.isuser != 1)
        // user.photo = ''
        user.isParent = true
      return user
    })
  },
  GROUP_LIST(state, list) {
    state.groupList = groupAdapter(list)
  },
  DEL_GROUP(state, groupId) {
    state.groupList.some((o, i, arr) => {
      if(o.id === groupId) {
        arr.splice(i, 1)
        return true
      }
    })
  },
  DEL_GROUP_USER(state, {groupId, userId}) {
    state.groupList.some((o, i, arr1) => {
      if(o.id === groupId) {
        return o.users.some((obj, j, arr) => {
          if(obj.id === userId) {
            arr.splice(j, 1)
            arr1.splice(i, 1, o)
            return true
          }
        })
      }
    })
  },
  ADD_GROUP(state, obj) {
    state.groupList.push(obj)
  },
  ALTER_GROUP(state, obj) {
    state.groupList.some((o,i,arr) => {
      if(o.id === obj.id) {
        state.groupList.splice(i, 1, obj)
      }
    })
  },
  ALTER_LOGO(state, {url, id}) {
    state.groupList.some((o,i,arr) => {
      if(o.id === id) {
        let obj = {...o, group_logo: url}
        state.groupList.splice(i, 1, obj)
      }
    })
  },
  SET_ACTIVE_USER(state, user) {
    state.activeUser = user
  },
  ADD_FILE(state, {file, msgId}) {
    state.fileList.push({file, msgId})
  },
  DEL_FILE(state, msgId) {
    state.fileList.some((file,i,arr) => {
      if(file.msgId === msgId) {
        arr.splice(i, 0)
      }
    })
  },
  SHOW_IMCHAT_BOX(state, flag) {
    state.showImChatBox = flag
  },
  SET_BILL_MESSAGE_DATA(state, params) {
    if(params && params.callback) {
      params.callback = 'true&&'+String(params.callback)
    }
    state.billMessageData = params
  },
  WIDTH(state, width) {
    state.width += width
  },
  HISTORY_MSG_BOX_STATE(state, {show, end = true}) {
    state.historyMsgBoxState = {show, end}
  },

  VODAL_CONF(state, {show = true, ...conf}) {
    state.vodalConf = {...state.vodalConf, show, ...conf}
  },
  SEARCH_INFO(state, {treeId}) {
    state.searchInfo = {treeId}
  },
  MY_INFO(state, user) {
    state.myInfo = {...state.myInfo, ...user}
  },
  CLEAR_GROUP_MSG(state, groupId) {
    state.msgs = state.msgs.filter(msg => msg.user_id !== groupId)
  }
}