import {url} from '../../util/util'

export const leaveGroup = ({commit, state}, {groupId, userId, groupName, msg}) => {
  let data = {
    group_id: groupId,
    group_users: userId,
    group_name: groupName,
  }
  $.ajax({
    url: url.LEAVE_GROUP,
    type: 'POST',
    dataType: 'json',
    data,
    success() {
      if(msg) {
        commit('DEL_GROUP_USER', {groupId, userId}, {root: true})
      } else {
        msg = '退群成功'
        commit('DEL_GROUP', groupId, {root: true})
      }
      commit('VODAL_CONF', {content: msg}, {root: true})
    },
    error() {},
  })
}
export const delGroup = ({commit, state}, {id, name}) => {
  let data = {
    group_id: id,
    group_name: name,
  }
  $.ajax({
    type: 'POST',
    url: url.DEL_GROUP,
    data,
    dataType: 'json',
    success() {
      commit('DEL_GROUP', id, {root: true})
      commit('VODAL_CONF', {content: '删群成功'}, {root: true})
    },
    error() {},
  })
}

export const readGroupMsg = ({commit, state, rootState}, {groupId}) => {
  if(timer) return
  let timer = null
  let data = {
    group_id: groupId,
    user_id: rootState.myUserId,
  }
  timer = setTimeout(() => {
    $.ajax({
      type: 'POST',
      url: url.READ_GROUP_MSG,
      dataType: 'json',
      data,
      success(data) {
        commit('READ_MSG', )
      },
      error() {},
    })
  }, 0)
}

// type -> new | edit | addUser
export const createGroup = ({commit, state,rootState, dispatch}, {groupInfo, allUsers = groupInfo.group_users, type = 'new'}) => {
  let users = groupInfo.group_users
  groupInfo.group_users = users.map(o => `${o.id}@${o.name}`).join('#')

  let data, url2
  if(type === 'new' || type === 'edit') {
    data = {
      type,
      "groupinfo": JSON.stringify(groupInfo)
    }
    url2 = url.CREATE_GROUP
  } else {
    data = {
      group_id: groupInfo.group_id,
      group_users: groupInfo.group_users,
      group_name: groupInfo.group_name
    }
    url2 = url.ADD_GROUP_MEMBER
  }

  $.ajax({
    type: 'POST',
    url: url2,
    dataType: 'json',
    data,
    success(rs) {
      let payload = {
        id: rs.group_id || groupInfo.group_id,
        name: groupInfo.group_name,
        users: allUsers,
        create_user: rootState.myUserId,
        create_time: rs.time || groupInfo.create_time,
        group_number: groupInfo.group_number,
        group_introduction: groupInfo.group_introduction || '',
        group_region: groupInfo.group_region,
      }
      if(type === 'new') {
        let msg = '创建群成功'
        commit('ADD_GROUP',payload , {root: true})
        commit('VODAL_CONF', {content: msg}, {root: true})
      } else if(type === 'edit') {
        let msg = '修改群资料成功'
        commit('ALTER_GROUP',payload , {root: true})
        commit('VODAL_CONF', {content: msg}, {root: true})
      }
      else {
        commit('ALTER_GROUP', payload, {root: true})
        commit('VODAL_CONF', {content: '添加群成员成功'}, {root: true})
      }
    },
    error() {
    },
  })
}
