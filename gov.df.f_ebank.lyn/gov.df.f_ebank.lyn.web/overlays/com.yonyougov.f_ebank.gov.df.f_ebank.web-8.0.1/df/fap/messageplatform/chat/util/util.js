/**
 *
 * @param keyword 搜索关键字
 * @param treeId 树id
 * @param inputId 搜索输入框id
 * @param key 搜索node中的哪个属性, 默认是name属性
 * @param type 'next' 搜索下一个, 'prev' 上一个
 * @param success 搜索到节点后的回调
 */
export function treeSearch({keyword, treeId, inputId, key = 'name', type = 'next', success = empty}) {
  window._tree_list = window._tree_list || []
  var list = window._tree_list
  list.indexOf(treeId) < 0 && list.push(treeId)

  // 将其它tree的index置零
  list.forEach(function (id) {
    if (id !== treeId) {
      $.fn.zTree.getZTreeObj(id).sel_index = 0
    }
  })

  var tree = $.fn.zTree.getZTreeObj(treeId)
  typeof tree.sel_index === 'undefined' && (tree.sel_index = 0)
  // 更换关键字后, sel_index置零, search_rs置空
  if (keyword !== tree.keyword) {
    tree.sel_index = 0
    tree.keyword = keyword
    tree.search_rs = []
  }

  type = type || 'next'
  tree.search_rs = tree.search_rs && tree.search_rs.length ?
    tree.search_rs : tree.getNodesByParamFuzzy(key, keyword, null)
  !keyword.trim() && (tree.search_rs = [])

  // 对一些值过滤
  // tree.search_rs = tree.search_rs.filter(function(obj) {
  //   if (obj && obj.level && !obj.children) {
  //     return obj
  //   }
  // })

  if (tree.search_rs.length) {
    tree.selectNode(tree.search_rs[tree.sel_index])
    // tree.search_rs[tree.sel_index].click()
    success(tree.search_rs[tree.sel_index]) // 成功回调
    if (type === 'next') {
      tree.sel_index++
      tree.sel_index > tree.search_rs.length - 1 && (tree.sel_index = 0)
    } else {
      tree.sel_index--
      tree.sel_index < 0 && (tree.sel_index = 0) && (tree.sel_index = tree.search_rs.length - 1)
    }
  } else {
    tree.cancelSelectedNode()
    // success() // 成功回调
  }
  setTimeout(function () {
    $('#' + inputId).focus()
  }, 0)
}

export function createUser({
                             id,
                             name,
                             msgs = [],
                             notReadCount = 0, historyMsgs = [], department = '', groupId = '', photo = '',
                             users = [],
                             groupNumber = 0,
                             groupType = 1,
                           }) {
  // if(!photo) {
  //   photo = groupId ? '/df/fap/messageplatform/chat/assets/group2.png' : '/df/fap/messageplatform/chat/assets/user2.png'
  // }
  return {
    id,
    name,
    msgs,
    notReadCount,
    historyMsgs,
    department,
    groupId,
    groupType, // 1 是普通群, 2是单据群聊群
    photo,
    users, // 群成员列表
    groupNumber,
  }
}

let tokenId = ''
export const getTokenId = () => {
  // return window.location.search
  //   .slice(1)
  //   .split('&')
  //   .filter((str) => str.indexOf('tokenid=') === 0)[0]
  //   .split('=')[1]
  if (!tokenId) {
    tokenId = sessionStorage.getItem('tokenid')
  }
  return tokenId
}

export const getCommonParam = () => {
  let paramStr = sessionStorage.getItem('commonData')
  return paramStr ? JSON.parse(paramStr) : {}
}

/**
 * 设置dom可拖动
 * @param outerSelector  被拖动的元素
 * @param filterSelector 点击那些元素可以拖动
 */
const dragCache = {}

export function dragAble(outerSelector, filterSelector) {
  if (dragCache[outerSelector]) return
  dragCache[outerSelector] = 1
  filterSelector = filterSelector || null
  var x = 0, y = 0;
  var offset = null
  $(outerSelector).on('mousedown', filterSelector, function (e) {
    offset = $(outerSelector).offset()
    x = e.pageX
    y = e.pageY

    document.body.onselectstart = document.body.ondrag = function () {
      return false;
    }

    // 拖动图片会导致mousemove事件中断, 解决办法就是 return false, 阻止浏览器默认事件
    // return false
  })
  var mousemove = function (e) {
    if ($(e.target).hasClass('js-no-move')) return
    if (offset) {
      var left = offset.left + e.pageX - x,
        top = offset.top + e.pageY - y;
      $(outerSelector).css({
        left: left + 'px',
        top: top + 'px',
        margin: 0,
        transform: 'none',
      })
    }
  }
  $(document).on('mousemove', throttle(mousemove, 2))
  $(outerSelector).on('mouseup', filterSelector, function (e) {
    offset = null
    document.body.onselectstart = document.body.ondrag = null
  })
}

/**
 * 节流阀, 定时处理任务
 * @param fn
 * @param interval
 * @returns {Function}
 */
function throttle(fn, interval) {
  var _self = fn,
    timer = null,
    firstTime = true
  return function () {
    var _me = this,
      args = arguments
    if (firstTime) {
      _self.apply(_me, arguments)
      return firstTime = false
    }
    if (timer) return false
    timer = setTimeout(function () {
      clearInterval(timer)
      timer = null
      _self.apply(_me, args)
    }, interval || 500)
  }
}

export function selectFile(cb, accept) {
  let input = document.createElement('input')
  input.type = 'file'
  input.style.display = 'none'
  input.multiple = 'true'
  accept && (input.setAttribute("accept", accept))
  document.body.appendChild(input)
  input.onchange = function (e) {
    cb([...e.target.files])
    document.body.removeChild(input)
  }
  input.click()
}

const url = {
  SEND_MSG: '/df/imaccess/sendInstantMessage.do?tokenid=' + getTokenId(),
  GET_MSG: "/df/imaccess/getUserMessagesByUserId.do?tokenid=" + getTokenId(),
  READ_MSG: "/df/imaccess//setMessageReaded.do?tokenid=" + getTokenId(),
  READ_GROUP_MSG: "/df/imgroupmanage/setGroupMessageReaded.do?tokenid=" + getTokenId(),
  GET_MSG_BY_USER_ID: '/df/imaccess/getMsgHistoryWithSelectedUser.do?tokenid=' + getTokenId(), // 获取历史消息
  GET_USER_LIST: '/df/messageconfig/findSysUser.do?tokenid=' + getTokenId(),
  GET_USER_DEPARTMENT: '/df/imaccess/getUserDetailInfo.do?tokenid=' + getTokenId(),
  GET_USERS: '/df/datarightrelation/getUserTreeForMessage.do?tokenid=' + getTokenId(),
  SEND_FILE: '/df/imaccess//uploadattach.do?tokenid=' + getTokenId(),
  SEND_LOGO: "/df/imgroupmanage/changelogo.do?tokenid=" + getTokenId(),
  DOWNLOAD: '/df/imaccess/download.do?tokenid=' + getTokenId(),
  GET_NIUNIU: '/df/fap/messageplatform/chat/exe/CaptureInstall.exe?tokenid=' + getTokenId(),

  // 群
  CREATE_GROUP: '/df/imgroupmanage/saveMessageGroup.do?tokenid=' + getTokenId(), // 新增或修改群
  DEL_GROUP: "/df/imgroupmanage/delGroup.do?tokenid=" + getTokenId(), // 删除群
  LEAVE_GROUP: "/df/imgroupmanage/exitGroup.do?tokenid=" + getTokenId(), // 退出群
  ADD_GROUP_MEMBER: "/df/imgroupmanage/addGroupMember.do?tokenid=" + getTokenId(), // 添加群成员
  GET_GROUP_USERS: "/df/datarightrelation/getGroupUsersByGroupIdForSupervise.do?tokenid=" + getTokenId(), // 根据群id获取群成员
  GET_GROUP_MSG: '/df/imaccess/getGroupMsgByGroupId.do?tokenid='+getTokenId(),
}
for (let key in url) {
  url[key] += (url[key].indexOf('?') > -1 ? '&' : '?') + 'ajax=nocache'
}
if (window._client) {
  for (let key in url) {
    url[key] = 'http://' + window._client + ':' + window._clientPort + url[key]
  }
}
export {url}

//**dataURL to blob**
export function dataURLtoBlob(dataurl) {
  // var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  let mime = 'image/jpeg'
  let bstr = atob(dataurl), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}

//**dataURL to blob**
export function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  blob.name = '截图.png'
  return blob;

}

export function insertScript(paths = []) {
  paths.forEach(path => {
    let script = document.createElement('script')
    script.src = path
    $(document.body).append(script)
  })
}

//判断当前浏览类型
export function browserType() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
  var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return "IE7";
    }
    else if (fIEVersion == 8) {
      return "IE8";
    }
    else if (fIEVersion == 9) {
      return "IE9";
    }
    else if (fIEVersion == 10) {
      return "IE10";
    }
    else if (fIEVersion == 11) {
      return "IE11";
    }
    else {
      return "0"
    }//IE版本过低
  }//isIE end

  if (isFF) {
    return "FF";
  }
  if (isOpera) {
    return "Opera";
  }
  if (isSafari) {
    return "Safari";
  }
  if (isChrome) {
    return "Chrome";
  }
  if (isEdge) {
    return "Edge";
  }
}


function empty() {
}

//判断是否是IE浏览器，包括Edge浏览器
export function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return "IE7";
    }
    else if (fIEVersion == 8) {
      return "IE8";
    }
    else if (fIEVersion == 9) {
      return "IE9";
    }
    else if (fIEVersion == 10) {
      return "IE10";
    }
    else if (fIEVersion == 11) {
      return "IE11";
    }
    else {
      return "0"
    }//IE版本过低
  }
  else if (isEdge) {
    return "Edge";
  }
  else {
    return "-1";//非IE
  }
}

export function isIE() { //ie?
  if (!!window.ActiveXObject || "ActiveXObject" in window)
    return true;
  else
    return false;
}

export function createMsg({fromuserid, msg_content, msg_type_code = -1, time, msg_id, user_id, imgContent = '', param = '', group_id}) {
  return {
    fromuserid,
    "attm_id": null,
    "rn": "13",
    "fromuser": '',
    "msg_title": null,
    "file_name": null,
    "send_type": "",
    msg_content,
    "user_name": '',
    msg_type_code,
    time,
    msg_id,
    "role_name": null,
    user_id,
    imgContent,
    imgLoading: true, // 表示图片正在加载中
    param,
    group_id,
  }
}

let tempMsgId = 0

export function getTempMsgId() {
  let num = tempMsgId
  tempMsgId++
  return num
}

export function removeItemFromArray(list, key, value) {
  list.some((item, i, arr) => {
    if (item[key] === value) {
      arr.splice(i, 1)
      return true
    }
  })
}

export function getParam(key, url) {
  let val = ''
  let arr = url.split('?')
  let params = arr.length >= 2 ? arr[1] : arr[0]
  params.split('&').some(str => {
    let entry = str.split('=')
    if (entry[0] === key) {
      val = entry[1]
      return true
    }
  })
  return decodeURIComponent(val)
}

export function openModal(url) {
  url += url.indexOf('?') > -1 ? '&tokenid=' + getTokenId() : '?tokenid=' + getTokenId()
  let modal = `<div class="modal fade" id="preview-bill-page" style="z-index:9999">
    <div class="modal-dialog" style="width: 800px; min-height: 400px;">
      <div class="modal-content" style="height-full">
        <div class="modal-header">
          <button type="button" class="close" aria-label="Close" data-dismiss="modal"><span
              aria-hidden="true">&times;</span></button>
        </div>
        <div class="modal-body">
          <iframe src=${url} frameborder="0" width="100%" style="min-height: 400px;"></iframe>
        </div>
      </div>
    </div>
  </div>`
  $(document.body).on('hidden.bs.modal', '#preview-bill-page', function () {
    $(this).remove()
  })
  $(document.body).append(modal)
  $('#preview-bill-page').modal()
}

export function date2Str(date, format) {
  if (Object.prototype.toString.call(date) === '[object String]') return date
  let year, month, day
  year = date.getFullYear()
  month = date.getMonth() + 1
  month < 10 && (month = '0' + month)
  day = date.getDate()
  day < 10 && (day = '0' + day)
  return format.replace(/yyyy/ig, year)
    .replace(/MM/g, month)
    .replace(/M/g, month)
    .replace(/dd/g, day)
    .replace(/d/g, day)
}

// 去重
export function dereplication(arr, key) {
  // let tempMap = {},
  //   rs = []
  // arr.forEach(o => {
  //   tempMap[o[key]] = o
  // })
  // for(let key2 in tempMap) {
  //   rs.push(tempMap[key2])
  // }
  // return rs
  return arr.filter((msg, i, arr2) => {
    var index = -1
    arr2.some((msg2, j) => {
      if (msg2[key] === msg[key]) {
        index = j
        return true
      }
    })
    return i === index
  })
}

export function transformArray2Tree(sNodes) {
  var i, l,
    key = 'id',
    parentKey = 'pId',
    childKey = 'children';
  if (!key || key == "" || !sNodes) return [];

  if (Array.isArray(sNodes)) {
    var r = [];
    var tmpMap = {};
    for (i = 0, l = sNodes.length; i < l; i++) {
      tmpMap[sNodes[i][key]] = sNodes[i];
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
      if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] != sNodes[i][parentKey]) {
        if (!tmpMap[sNodes[i][parentKey]][childKey])
          tmpMap[sNodes[i][parentKey]][childKey] = [];
        tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
      } else {
        r.push(sNodes[i]);
      }
    }
    return r;
  } else {
    return [sNodes];
  }
}

export function transformTree2Array(nodes) {
  if (!nodes) return [];
  var childKey = 'children',
    r = [];
  if (Array.isArray(nodes)) {
    for (var i = 0, l = nodes.length; i < l; i++) {
      r.push(nodes[i]);
      if (nodes[i][childKey])
        r = r.concat(transformTree2Array(nodes[i][childKey]));
    }
  } else {
    r.push(nodes);
    if (nodes[childKey])
      r = r.concat(transformTree2Array(nodes[childKey]));
  }
  return r;
}

export const blob2DataUrl = (file, cb) => {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = cb
}

/**
 * 保存消息条数用于共商共建页面
 * @param msgs
 */
export function saveMsgForMonitor(msgs) {
  var idKey = 'user_id'
  var tempObj = {}
  msgs.forEach(function(msg) {
    if(tempObj[msg[idKey]]) {
      tempObj[msg[idKey]]++
    } else {
      tempObj[msg[idKey]] = 1
    }
  })
  var rs = []
  for(var key in tempObj) {
    rs.push({groupId: key, msgCount: tempObj[key]})
  }
  window.sessionStorage.setItem('groupInfo', JSON.stringify(rs))
}

/**
 *
 * @param len 消息的数量
 * @param container ; jQuery DOM, 消息的容器
 */
export function showCount(len, container) {
  var count = len > 99 ? '99+' : len
  var display = count ? 'block' : 'none'
  container.html(count).css('display', display)
}

export function saveNotReadMsg(msgs) {
  sessionStorage.setItem('notReadMsgs', msgs)
}