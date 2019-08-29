import {url, createMsg, createUser, getTempMsgId, getCommonParam, date2Str, dereplication, saveMsgForMonitor} from '../util/util'
import {msgs} from '../store/mock'
// import userTree from "../data/data";
// 从数据库搜索用户, 历史代码, 已经不用了
let searchCache = {
  keyword: '',
  pageNum: 1,
  noMore: false,
}
let searchUserTimer = null

$.ajaxSetup({
  ajax: 'noCache',
})

// 消息发送时前台给的id,消息发送成功后,把从后台获取的id替换这个id
let tempMsgId = 0

// 要导出的对象
export const getMsg = ({commit, state}, {data, isHistoryMsg = false}) => {
  data.msgs = data.msgs || data.row || []

  // 自己发送的群消息后台也会推送给自己, 需要过滤
  if(!isHistoryMsg) {
    data.msgs = data.msgs.filter(msg => msg.fromuserid != state.myUserId)
  }

  data.msgs.forEach(msg => {
    msg.msg_type_code = msg.msg_type_code || msg.msgType || 0
    msg.msg_content = msg.msg_content || msg.content
    msg.fromuser = msg.fromuser || msg.fromUser
  })


  data.msgs.forEach(msg => {
    // 下载图片
    if (msg.msg_type_code == 2 && state.fileList.every(file => file.msgId !== msg.msg_id)) {
      loadImg({commit}, msg)
    }

    // 添加一些属性
    if (!isHistoryMsg) {
      msg.notRead = true
    }
    msg.imgContent = ''
    msg.imgLoading = true
  })

  // 去重
  let msgs = dereplication(state.msgs.concat(data.msgs), 'msg_id')
  let notReadGroupMsgs = msgs.filter(msg => isBillGroupMsg(msg) && msg.notRead)
  // 群数量
  let groupCount = dereplication(notReadGroupMsgs, 'user_id').length
  showGroupUnreadMsgCount(groupCount)
  saveMsgForMonitor(notReadGroupMsgs)
  commit('GET_MSG', msgs)
  // if (!isHistoryMsg)
  //   commit('TOTAL_COUNT', msgs.filter(msg => msg.notRead).length)
}

function isBillGroupMsg(msg) {
  return msg.isgroup == 1 && msg.grouptype == 2
}

/**
 * 显示单据群聊的未读消息条数
 * @param len
 */
const showGroupUnreadMsgCount = (len) => {
  var count = len > 99 ? '99+' : len
  var display = count ? 'block' : 'none'
  $('#group-msg-count').html(count).css('display', display)
}

const loadImg = ({commit}, msg) => {
  let imgUrl = url.DOWNLOAD
  var xhr = new XMLHttpRequest();
  xhr.open('POST', imgUrl, true);//get请求，请求地址，是否异步
  xhr.responseType = "blob";
  // xhr.setRequestHeader("client_type", "DESKTOP_WEB");
  // xhr.setRequestHeader("desktop_web_access_key", _desktop_web_access_key);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.onload = function () {
    if (this.status == 200) {
      let blob = this.response
      blob2DataUrl(blob, e => {
        commit('ADD_FILE', {file: e.target.result, msgId: msg.msg_id})
      })
    }
  }
  xhr.send(`msg_id=${msg.msg_id}`);
}

// 发送文字消息
export const sendMsg = ({commit, state}, {content, msgType = 0, groupId, userId = state.activeUserId}) => {
  let tempMsgId = getTempMsgId()
  sendTempMsg({commit, state}, {tempMsgId, groupId, userId})
  sendRealMsg({commit, state}, {content, tempMsgId, msgType, groupId, userId})
}

export const sendRealMsg = ({commit, state}, {content, msgType = 0, tempMsgId, file, groupId, userId}) => {
  // 添加事件回调
  chatWs.topics.user.push(data => {
    //回调函数处理逻辑
    let msg = createMsg({
      "fromuserid": state.myUserId,
      "msg_content": content,
      "msg_type_code": msgType,
      "time": data.time,
      "msg_id": data.msg_id,
      user_id: userId,
      param: billMessageData,
      group_id: groupId,
    })
    if (file) {
      // let reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = function (e) {
      //   commit('ADD_FILE', {file: e.target.result, msgId: data.msg_id}) // 添加一个文件
      // }
      blob2DataUrl(file, (e) => {
        commit('ADD_FILE', {file: e.target.result, msgId: data.msg_id})
      })
    }
    commit('UPDATE_MY_MSG', {msg, tempMsgId})
    // commit('GET_MSG', msg)
  })

  let toUserId = state.activeUserId
  let billMessageData = state.billMessageData ? JSON.stringify(state.billMessageData) : ''
  let msg = {
    fromuserid: state.myUserId,
    fromuser: getCommonParam().svUserName,
    // fromUserCompany: '',
    msg_content: content,
    msg_type_code: msgType + '',
    param: billMessageData,
  }

  // groupId存在, 表示是一个群消息
  let data = groupId ? {type: 'group', data: {...msg, group_id: groupId}} : {type: 'user', data: {...msg, user_id: toUserId}}
  // 发送消息
  window.chatWs.send(JSON.stringify(data))

  // 消息发送后, 清空billMessageData
  if (msgType == 5) {
    commit('SET_BILL_MESSAGE_DATA', null)
  }
}

const blob2DataUrl = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = cb
}

/**
 * 发送消息, 未发送到后台, 只是在前台显示一个loading
 * @param imgContent
 * @param tempMsgId
 */
export const sendTempMsg = ({commit, state}, {imgContent, tempMsgId, groupId, userId} = {}) => {
  commit('ADD_MY_MSG', createMsg({
    "fromuserid": state.myUserId,
    "msg_content": '',
    "msg_type_code": -1,
    "time": new Date().format('yyyy-MM-dd hh:mm:ss'),
    "msg_id": tempMsgId,
    user_id: userId,
    group_id: groupId,
    imgContent,
  }))
}

/**
 * 发送文件
 * @param commit
 * @param state
 * @param files
 */
export const sendFile = ({commit, state}, {files, groupId, userId = state.activeUserId}) => {
  let data = new FormData()
  let idList = []
  files.forEach(file => {
    data.append('files', file, file.name)
    // vm.$store.dispatch('sendTempMsg', {})
    let tempMsgId = getTempMsgId()
    idList.push(tempMsgId)
    sendTempMsg({commit, state}, {tempMsgId, groupId, userId})
  });
  $.ajax({
    url: url.SEND_FILE,
    type: 'POST',
    data,
    processData: false,
    contentType: false,
    success(data) {
      if (data.errorCode === '0') {
        files.forEach((file, i) => {
          let msgType = /\.(jpg|png|jpeg|gif)$/.test(file.name) ? 2 : 1 // 2是图片, 1文件
          let content = file.name
          let tempMsgId = idList[i]
          // let content = file.name
          // let msgType = 1
          sendRealMsg({commit, state}, {content, msgType, tempMsgId, file, groupId, userId})
        })
      } else {
        alert(data.errorMsg)
      }
    },
    error() {
      alert('上传失败')
    },
  })
}

// 获取历史消息
// const hasMoreCache = [
//   {
//     historyMsgTimer: null,
//     historyObj: {
//       pageNum:
//     },
//   }
// ]
let historyMsgTimer = null
let historyObj = {
  pageNum: 1,
  noMore: false,
  id: '',
}

/**
 * 获取历史消息
 * @param commit
 * @param state
 * @param rowCount
 */
export const getHistoryMsg = ({commit, state},
                              {
                                rowCount = 50,
                                userId = state.activeUserId,
                                path = url.GET_MSG_BY_USER_ID,
                                groupId = ''
                              } = {}) => {
  if (historyMsgTimer) return // 正在加载中, 本次点击无效
  if (historyObj.id !== userId) {
    commit('SET_NO_MORE_MSG', false)
    historyObj = {id: userId, pageNum: 1, noMore: false}
  } else {
    historyObj.pageNum += 1
  }
  if (historyObj.noMore) {
    return
  }
  historyMsgTimer = setTimeout(function () {
    let data = {
      pageNum: historyObj.pageNum,
      rowCount
    }
    if(groupId) { // groupId存在, 说明是获取群历史消息
      data.groupid = groupId
    } else {
      data.withUserId = userId
    }
    $.ajax({
      url: path,
      type: "GET",
      dataType: "json",
      data,
      success: function (data) {
        //回调函数处理逻辑
        commit('SET_ACTION_TYPE', 1)
        // commit('GET_MSG', data.row)
        getMsg({commit, state}, {data, isHistoryMsg: true})
        if (data.row.length < rowCount) {
          historyObj.noMore = true
          commit('SET_NO_MORE_MSG', true)
          commit('SET_NO_MORE_FOR_USER', {id: userId, noMore: true})
        }
        clearTimeout(historyMsgTimer)
        historyMsgTimer = null
      },
      error: function (data) {
        //回调函数处理逻辑
        clearTimeout(historyMsgTimer)
        historyMsgTimer = null
        historyObj.pageNum -= 1
      }
    });
  }, 0)
  // clearTimeout(timer)
  // timer = null
}

// 根据日期获取历史消息
export const getHistoryMsgByDate = function () {
  let pending = false,
    timer = null,
    // pageNum = 1,
    userIdCache = '',
    dateStrCache = ''
  return function ({commit, state}, {rowCount = 50, dateStr = dateStrCache, withUserId = userIdCache} = {}) {
    if (timer) return
    let {end, pageNum = 0} = (state.historyMsg.allMsgs[dateStr] || {})
    let replaceFlag = false
    if (userIdCache !== withUserId) { // 切换用户了
      userIdCache = withUserId
      dateStrCache = dateStr
      replaceFlag = true
    } else {
      if (end) return // 当前日期的数据已经被缓存完毕了
    }
    pageNum++
    commit('historyMsg/ALL_MSGS', {loading: true})
    timer = setTimeout(function () {
      $.ajax({
        beforeSend() {

        },
        url: url.GET_MSG_BY_USER_ID,
        data: {
          pageNum,
          rowCount,
          withUserId,
          dateStr,
        },
        success(data) {
          data.row = data.row || []
          commit('historyMsg/ALL_MSGS', {msgs: data.row, replaceFlag, end: data.row.length < rowCount, pageNum})
        },
        error() {
        },
        complete() {
          // commit('historyMsg/ALL_MSGS',  {msgs, replaceFlag, end: pageNum >= 4, pageNum})
          clearTimeout(timer)
          timer = null
        }
      })
    }, 0)
  }
}()

export const readMsg = ({commit, state, getters}) => {
  if (!state.activeUserId) return
  if (!getters.activeUser) return
  var ids = getters.activeUser.msgs.filter(msg => msg.notRead).map(msg => msg.msg_id)
  var timer = null
  var fn = (data) => {
    clearInterval(timer)
    timer = null
    commit('ALERT_MSG', ids)
  }
  if (ids.length && !timer) {
    timer = setTimeout(() => {
      let groupId = getters.activeUser.groupId
      let url2 = groupId ? url.READ_GROUP_MSG : url.READ_MSG
      let data
      if(groupId) {
        data = {
          group_id: groupId,
          user_id: state.myUserId
        }
      } else {
        data = {
          msgIds: ids.map(id => "'" + id + "'").join(',')
        }
      }
      noticeReadMsg(fn, {data, url: url2})
    }, 0)
  }

}

export const searchUser = ({commit}, {keyword = searchCache.keyword, rowCount = 50} = {}) => {
  if (searchUserTimer) return
  if (!keyword) {
    searchCache = {keyword: '', pageNum: 1, noMore: false}
    commit('SET_USER_LIST', {userList: []})
    return
  }
  commit('SEARCH_USER_TYPE', searchCache.keyword === keyword ? 1 : 0)
  if (searchCache.keyword === keyword) {
    searchCache.pageNum += 1
  } else {
    // 更换了关键字
    searchCache = {
      keyword: keyword,
      pageNum: 1,
      noMore: false,
    }
  }
  if (searchCache.noMore) return
  searchUserTimer = setTimeout(() => {
    $.ajax({
      url: url.GET_USER_LIST,
      dataType: 'json',
      data: {
        pageNum: searchCache.pageNum,
        rowCount,
        u_name: keyword,
      },
      success(data) {
        if (data.userList < rowCount) searchCache.noMore = true
        var addFlag = searchCache.pageNum <= 1 ? false : true
        commit('SET_USER_LIST', {userList: data.userList, addFlag})
        clearTimeout(searchUserTimer)
        searchUserTimer = null
      },
      error() {
        clearTimeout(searchUserTimer)
        searchUserTimer = null
      },
    })
  }, 0)

}

/**
 *
 * @param id
 * @param flag flag为true时, 是聊天窗口的获取部门
 */
export const getDepartment = ({commit}, {id, flag = false}) => {
  $.ajax({
    url: url.GET_USER_DEPARTMENT,
    data: {userId: id},
    success(data) {
      if (data.result === 'success') {
        let userInfo = data.userInfo || {}
        let userDepartInfo = data.userDepartInfo || {}
        if (!flag) {
          commit('ADD_DEPARTMENT', {
            userId: id,
            department: userDepartInfo.chr_name,
            mobile: userInfo.mobile,
            telephone: userInfo.telephone,
            photo: userInfo.photo
          })
        } else {
          commit('ADD_DEPARTMENT_2', {
            department: userDepartInfo.chr_name,
            id,
            photo: userInfo.photo
          })
        }
      }
    },
    error() {
      // alert('获取用户部门失败')
    }
  })
}

export const getUserInfo = ({commit, state}) => {
  $.ajax({
    url: url.GET_USER_DEPARTMENT,
    data: {userId: state.myUserId},
    success(data) {
      if (data.result === 'success') {
        let userInfo = data.userInfo || {}
        let userDepartInfo = data.userDepartInfo || {}
        commit('MY_INFO', {
          id: state.myUserId,
          department: userDepartInfo.chr_name,
          mobile: userInfo.mobile,
          telephone: userInfo.telephone,
          photo: userInfo.photo,
          username: userInfo.user_name,
        })
      }
    },
    error() {
      // alert('获取用户部门失败')
    }
  })
}

/**
 * 页面呈现后获取所有用户及群
 */
export const getUsers = ({commit}) => {
  // cb(userTree)
  // return
  return new Promise(res => {
    $.ajax({
      url: url.GET_USERS,
      type: 'POST',
      success(data) {
        cb(data)
        res()
      },
      error() {
        console.log('获取所有用户失败')
      },
      complete() {
        // cb(userTree)
      },
    })
  })


  // cb(userTree)

  function cb(data) {
    data.users.forEach(user => {
      user.id = user.id || user.chr_id
      user.pid = user.pid || user.parent_id
    })
    commit('GET_USERS', data.users)
    commit('GROUP_LIST', data.usergroup)
  }
}

/**
 * 打开与某个用户的聊天窗口
 * @param commit
 * @param getters
 */
export const openChatWindow = ({commit, state}, params) => {
  commit('SET_BILL_MESSAGE_DATA', params)
  let a = `<a onclick="chatOpenModal()" href="#" class="chat-link">${params.showtext}</a>`
  $('#chat-content').html(a) // 消息内容
  if (!state.activeUserId) {
    commit('SET_ACTIVE_TAB', 1)
  } else {
    commit('SET_ACTIVE_TAB', 0)
  }
}

export const toggleHistoryBoxState = ({commit, state, dispatch}, {show = true, end = true} = {}) => {
  commit('HISTORY_MSG_BOX_STATE', {show, end})
  commit('WIDTH', 360 * (show ? 1 : -1))
  let withUserId = state.activeUserId
  if (show && withUserId) {
    let date = new Date()
    date.setDate(date.getDate() - 7)
    let dateStr = date2Str(date, 'yyyy-MM-dd')
    commit('historyMsg/DATE_STR', dateStr)
    dispatch('getHistoryMsgByDate', {dateStr, withUserId})
  }

}

function ajaxSendMsg({fn, content, toUserId, msgType, tempMsgId}) {
  $.ajax({
    url: url.SEND_MSG,
    type: "POST",
    dataType: "json",
    data: {
      ajax: "nocache",
      "content": content,
      "toUserId": toUserId,
      msgType
    },
    success: function (data) {
      //回调函数处理逻辑
      fn(data, tempMsgId)
    },
    error: function (data) {
      //回调函数处理逻辑
    }
  })
}

function noticeReadMsg(fn, {data, url}) {
  //通知服务器消息已经处理
  $.ajax({
    url,
    type: "POST",
    dataType: "json",
    data,
    success: function (data) {
      fn()
      //回调函数处理逻辑
    },
    error: function (data) {
      //回调函数处理逻辑
    }
  });
}

export const uploadImg = ({commit, state}, {file, id, type = 'group'}) => {
  let data = new FormData()
  data.append('files', file, file.name)
  data.append('type', type)
  data.append('userorgroupid', id)
  $.ajax({
    url: url.SEND_LOGO,
    type: 'POST',
    data,
    processData: false,
    contentType: false,
    success(data) {
      if (data.errorCode === '0') {
        if(state.myUserId === id) {
          commit('MY_INFO', {id, photo: data.logourl})
        } else {
          if(type === 'group') {
            commit('ALTER_LOGO', {url: data.logourl, id})
          } else {
            commit('ALTER_USER_LOGO', {url: data.logourl, id})
          }
        }

        commit('VODAL_CONF', {content: '上传成功'})
      } else {
        alert(data.errorMsg)
      }
    },
    error() {
      alert('上传失败')
    },
  })
}

export const gotoChat = ({commit, state}, {node = {}, groupId = '', users = []} = {}) => {
  // 如果是自己, 则不做任何操作
  if (node.id === state.myUserId) return
  commit('SET_ACTIVE_TAB', 0)
  let name = node.name.split(' ').map(o => o.trim())
  name = name[1] || name[0]
  if (state.userList.every(user => user.id !== node.id)) {
    commit('ADD_USER', createUser({
      id: node.id,
      groupId,
      name,
      msgs: [],
      notReadCount: 0,
      historyMsgs: [],
      department: node.getParentNode && node.getParentNode() ? node.getParentNode().name.split(' ')[1] : '',
      photo: node.photo,
      users,
    }))
  }
  commit('ACTIVE_USER_ID', node.id)
}


