import {url, createUser, saveMsgForMonitor, showCount, dereplication} from '../../util/util'

/**
 * 单据群聊的初始化函数
 * @param commit
 * @param state
 * @param rootState
 * @param groupId
 * @param containerId
 */
export const openDiscussChatBox = ({commit, state, rootState}, {groupId, containerId, isClose}) => {
  commit('SHOW_DISCUSS_BOX', false) // 销毁嵌入框
  // state.groupId && state.groupId !== groupId && commit('CLEAR_GROUP_MSG', state.groupId, {root: true}) // 清除前一个group的数据
  commit('SHOW_IMCHAT_BOX', false, {root: true}) // 关闭主聊天框
  let {username: name, department, photo} = rootState.myInfo
  commit('ADD_USER', createUser({ // 添加用户
    id: groupId,
    groupId,
    groupType: 2,
    name,
    msgs: [],
    notReadCount: 0,
    historyMsgs: [],
    department,
    photo,
    users: state.groupUsers,
    groupNumber: state.groupUsers.length,
  }), {root: true})

  commit('GROUP_ID', groupId) // 设置groupId
  commit('CONTAINER_ID', containerId) // 设置groupId
  commit('IS_CLOSE', isClose) // 是否讨论已经关闭,只支持查看
  // commit('ACTIVE_USER_ID', groupId, {root: true})
  // commit('MAIN_CHAT_ACTIVE_USER_ID_BAK', rootState.activeUserId) // 暂存id

  setTimeout(() => {
    commit('SHOW_DISCUSS_BOX', true) // 显示嵌入框
  }, 0)
}

export const getGroupUsers = async ({state, commit, rootState, dispatch}, groupId = state.groupId) => {
  // if(!rootState.groupList.length || !rootState.groupList.find(group => group.id == groupId)) {
  //   await dispatch('getUsers', null, {root: true})
  // }
  // let group = rootState.groupList.find(group => group.id == groupId)
  // if(group) {
  //   commit('GROUP_USERS', group.users)
  // }

  return new Promise(res => {
    $.ajax({
      url: url.GET_GROUP_USERS,
      type: 'post',
      data: {groupid: groupId},
      success(data) {
        data.usergroupusersforsupervise.forEach(obj => {
          obj.name = obj.name || obj.user_name
          obj.id = obj.id || obj.user_id
        })
        commit('GROUP_USERS', data.usergroupusersforsupervise)
        res(true)
      },
    })
  })
}

export const getGroupHistoryMsg = ({commit, state, dispatch, rootState}, {groupId}) => {
  dispatch('getHistoryMsg', {userId: groupId, path: url.GET_GROUP_MSG, groupId}, {root: true})
}

/**
 * 通知服务器群消息已读
 * @param commit
 * @param state
 * @param getters
 */
export const readGroupMsg = ({commit, state, getters, rootState}) => {
  var ids = getters.groupUser.msgs.filter(msg => msg.notRead).map(msg => msg.msg_id)
  var timer = null
  if (ids.length && !timer) {
    timer = setTimeout(() => {
      let groupId = state.groupId
      let data = {
          group_id: groupId,
          user_id: rootState.myUserId
        }
      $.ajax({
        url: url.READ_GROUP_MSG,
        data,
        type: 'post',
        success() {
          clearInterval(timer)
          timer = null
          commit('ALERT_MSG', ids, {root: true})
          let notReadMsgs = rootState.msgs.filter(msg => msg.notRead && msg.grouptype == 2)
          let notReadNormalMsgLength = rootState.msgs.filter(msg => msg.notRead && msg.grouptype != 2).length
          let groupCount = dereplication(notReadMsgs, 'user_id').length
          showCount(groupCount, $('#group-msg-count')) // 刷新未读消息条数
          showCount(notReadNormalMsgLength + groupCount, $('#total-count')) // 刷新总的未读消息条数
          saveMsgForMonitor(notReadMsgs)
        },
      })
    }, 0)
  }
}
