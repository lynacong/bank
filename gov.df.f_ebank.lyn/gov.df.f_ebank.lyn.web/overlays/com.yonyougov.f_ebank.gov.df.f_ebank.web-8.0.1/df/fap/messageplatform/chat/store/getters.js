import {createUser, dereplication} from "../util/util"
import _cloneDeep from 'lodash/fp/cloneDeep'
export default {
  activeTab(state) {
    return state.activeTab
  },
  msgs(state) {
    return state.msgs
  },
  usersBak(state, getters) {
    // let users = JSON.parse(JSON.stringify(state.userList))
    let users = _cloneDeep(state.userList)
    // let users = state.userList
    users.forEach(user => {
      user.msgs = []
      user.notReadCount = 0
    })
    // let users = []
    state.msgs.forEach(msg => {
      // 用户是否已经存在
      let hasUser = users.some(user => {
        if((msg.isgroup == 1 && msg.user_id === user.id) || (msg.isgroup != 1 && (user.id === msg.fromuserid || user.id === msg.user_id))) {
          if(msg.notRead) user.notReadCount += 1
          user.msgs.push(msg)
          return true
        }
      })
      if(!hasUser) {
        let id, name, groupId = '', groupType = 1, groupUsers = []
        if(msg.isgroup == 1) { // 群
          id = groupId = msg.user_id
          groupType = msg.grouptype || 1
          state.groupList.some(o => {
            if(o.id === msg.user_id) {
              name = o.name
              groupUsers = o.users
              return true
            }
          })
        } else {
          id = msg.fromuserid === state.myUserId ? msg.user_id : msg.fromuserid
          name = msg.fromuser
        }
        let user = createUser({
          id,
          name,
          msgs: [msg],
          groupId,
          groupType,
          users: groupUsers,
        })
        if(msg.notRead) user.notReadCount += 1
        users.push(user)
      }
    })

    // 把我的消息放入对应的用户下
    state.myMsgs.forEach(msg => {
      users.some(user => {
        if(user.id === msg.user_id) {
          user.msgs.push(msg)
          return true
        }
      })
    })

    // users = JSON.parse(JSON.stringify(users))
    users = _cloneDeep(users)
    users.forEach(user => {
      // 去重
      user.msgs = dereplication(user.msgs, 'msg_id')

      // 排序
      user.msgs = user.msgs.sort((a, b) => {
        if(a.time > b.time) return 1
        else if(a.time < b.time) return -1
        else return 0
      })

    })

    if(state.userGetDeparment)
      users.some(user => {
        if(user.id === state.userGetDeparment.id) {
          user.department = state.userGetDeparment.department
          user.photo = state.userGetDeparment.photo
          return true
        }
      })

    return users
  },
  activeUser(state, getters) {
    let users = getters.users.filter(user => {
      return user.id === state.activeUserId
    })
    if(users.length) return users[0]
    else return null
  },
  activeSearchUser(state, getters) {
    return state.searchUserList[state.activeSearchUserIndex]
  },
  users(state, getters) {
    let users
    if(!state.keyword) {
      users = getters.usersBak
    }
    else {
      users = getters.usersBak.filter(user => {
        return user.name.indexOf(state.keyword) > -1 || user.id.indexOf(state.keyword) > -1
      })
    }
    // 过滤单据群用户
    return users.filter(user => user.groupType != 2)
    // return users
  },
}