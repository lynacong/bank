!function () {
  var tokenId = getTokenId()
  var CHAT_CONTAINER_ID = 'topChat'
  var url = {
    GET_MSG: '/df/imaccess/getUserMessagesByUserId.do?tokenid=' + tokenId,
    WEBSOCKET: '',
  }
  setTimeout(function () {
    getImParam(initChat)
  }, 1000)

//  noticeUserIsOnline({userName: 'test'})


  function initChat() {

    /**
     * 初始化下拉菜单和消息数量
     */
    initMenuAndCount()

    // 如果是刷新页面, 则从sessionStorage里面读取未读消息
    // getMsgFromSessionStorage()

    /**
     * 事件初始化
     */
    $('#topChat').click(function() {
      $(this).removeClass('hover')
    })
    $('#topChat').hover(function() {
      $(this).addClass('hover')
    }, function () {
      $(this).removeClass('hover')
    })
    $("#normal-msg").click(function () {
      if (window.vueInstance) {

//      $('#im-chat').css('display', 'block')
        window.vueInstance.$store.commit('SHOW_IMCHAT_BOX', true)
        return
      }

      // 获取聊天窗口的css文件
      insertCss('head')

      // 获取聊天窗口的js文件
      insertScript([
        '/df/fap/messageplatform/chat/lib/jquery.json-2.3.min.js',
        '/df/fap/messageplatform/chat/lib/niuniucapture.js',
        // 'http://localhost:8080/dist/build.js',
        '/df/fap/messageplatform/chat/dist/build.js',

      ])

      function insertScript(paths) {
        paths.forEach(function (path) {
          var script = document.createElement('script')
          script.src = path
          $(document.body).append(script)
        })
      }

      function insertCss(parentNode) {
        $("<link>")
          .attr({ rel: "stylesheet",
            type: "text/css",
            // href: "http://localhost:8080/dist/style.css",
            href: "/df/fap/messageplatform/chat/dist/style.css",
          })
          .appendTo(parentNode);
      }
    });

    $('#bill-msg').click(function() {
      var title = '共商共建'
      var url = '/df/fi_fip/inspectDiscuss/inspectDiscussList.html?_x=1&menuid=e9dc08a0-7d6a-4fe4-b289-28a79643e03f&menuname=共商共建&tokenid='+getTokenId()
      window.parent.addTabToParent(title, url);
    })

    if (window._client) {
      for (var key in url) {
        url[key] = 'http://' + window._client + ':' + window._clientPort + url[key]
      }
    }
    if (window._websocketUrl) {
//      url.WEBSOCKET ='ws://' + window._websocketUrl + getCommonParam().svUserId
      openWebsocket(window._websocketUrl)
    }

    // 向全局注册接口
    /**
     * 单据聊天
     * @param params
     */
    window.sendBillMessage = function(params) {
      if(window.vueInstance) {
        window.vueInstance.$store.commit('SHOW_IMCHAT_BOX', true)
        window.vueInstance.$store.dispatch('openChatWindow', params)
      } else {
        window._chatParams = params  // 暂存参数
        $('#normal-msg').click()
      }
    }

    window.initDiscussChatBox = function(opt) {
      var groupId = opt.groupId
      var containerId = opt.containerId
      var isClose = opt.isClose
      if(window.vueInstance) {
        window.vueInstance.$store.dispatch('sdChat/openDiscussChatBox', {groupId: groupId, containerId: containerId, isClose: isClose})
      } else {
        window._discussChatParams = {groupId: groupId, containerId: containerId, isClose: isClose}  // 暂存参数
        $('#normal-msg').click()
      }
    }

  }

  function getMsgFromSessionStorage() {
    var msgs = sessionStorage.getItem('notReadMsgs')
    msgs && msgs.length && getMsgHandler({data: msgs})
  }


  function initMenuAndCount() {
    var style = ' .u-relative {\n' +
      '      position: relative;\n' +
      '    }\n' +
      '\n' +
      '    .u-absolute {\n' +
      '      position: absolute;\n' +
      '    }\n' +
      '\n' +
      '    .u-pointer {\n' +
      '      cursor: pointer;\n' +
      '    }\n' +
      '\n' +
      '    .u-count {\n' +
      '      position: absolute;\n' +
      '      right: -5px;\n' +
      '      top: -8px;\n' +
      '      background: #f00;\n' +
      '      border-radius: 10px;\n' +
      '      min-width: 18px;\n' +
      '      color: #fff;\n' +
      '      display: none;\n' +
      '      padding: 0 4px;\n' +
      '    }\n' +
      '\n' +
      '    .chat-menu-box {\n' +
      '      position: absolute;\n' +
      '      display: none;\n' +
      '      background: #fff;\n' +
      '      color: #666;\n' +
      '      right: 0;\n' +
      '      top: 25px;\n' +
      '      width: 103px;\n' +
      '      border: 1px solid #ccc;\n' +
      '      border-radius: 3px;\n' +
      '    }\n' +
      '\n' +
      '    .chat-menu-box > li:first-child {\n' +
      '      border-bottom: 1px solid #ccc;\n' +
      '    }\n' +
      '\n' +
      '    .chat-menu-box .item {\n' +
      '      display: block;\n' +
      '      position: relative;\n' +
      '      cursor: pointer;\n' +
      '      padding: 4px 18px 4px 4px;\n' +
      '    }\n' +
      '\n' +
      '    .chat-menu-box .item:hover {\n' +
      '      background: rgb(16, 142, 233);\n' +
      '      color: #fff;\n' +
      '    }\n' +
      '    .chat-menu-box .item .u-count {\n' +
      '      top: 3px;\n' +
      '      right: 5px;\n' +
      '    }\n' +
      '    .chat-icon-box {\n' +
      '      position: relative;\n' +
      '    }\n' +
      '    .chat-icon-box.hover .chat-menu-box {\n' +
      '      display: block;\n' +
      '    }'
    $('head').append('<style type="text/css">'+ style + '</style>')
    var html = '<span id="total-count" class="u-count">99+</span>\n' +
      '    <ul id="chat-menu" class="list-unstyled chat-menu-box">\n' +
      '      <li>\n' +
      '        <div class="item" id="normal-msg" >普通消息 <span id="msg-count" class="u-count">99+</span></div>\n' +
      '      </li>\n' +
      '      <li>\n' +
      '        <div class="item" id="bill-msg">共商消息 <span id="group-msg-count" class="u-count">1ds</span></div>\n' +
      '      </li>\n' +
      '    </ul>'
    $('#'+CHAT_CONTAINER_ID).addClass('chat-icon-box').append(html)
  }

  function getImParam(cb) {
    $.ajax({
      url: '/df/imaccess/getImConfig.do?tokenid=' + getTokenId(),
      success: function (data) {
        // console.log(data)
        if (data.result === 'success' && data.isenabled === '1') {
          window._client = data.client
          window._clientPort = data.clientport
          var hostname = data.useip == '1' ? data.websocketurl : location.hostname
          window._websocketUrl = 'ws://'+hostname+':'+data.websocketport+'/websocket/' + getCommonParam().svUserId
          cb()
        }
      },
      error: function () {
        // alert('初始化消息系统失败')
      },
    })
  }

  // 获取消息后的回调函数
  function getMsgHandler(data) {
    if (window.vueInstance)
      window.vueInstance.$store.dispatch('getMsg', {data: data})
    else {
      window._chatData = window._chatData || {msgs: []}
      var tempMsgs = window._chatData.msgs.concat(data.msgs)
      window._chatData.msgs = dereplication(tempMsgs, 'msg_id')

      // 保存未读消息到sessionStorage里面, 刷新页面后可以再次取出
      // saveMsgToSessionStorage(data.msgs)

      // 保存msg到sessionStorage里面, 提供给共商共建页面调用
      saveMsg(window._chatData.msgs.filter(function(msg){ return isBillGroupMsg(msg) }))
      // 普通消息的长度
      var normalMsgLength = window._chatData.msgs.filter(function(msg) {return !isBillGroupMsg(msg)}).length
      // 群消息的长度
      // var groupMsgLength = window._chatData.msgs.filter(function(msg) { return isBillGroupMsg(msg) }).length
      // 群的个数
      var groupCount = dereplication(window._chatData.msgs.filter(function(msg) { return isBillGroupMsg(msg) }), 'user_id').length
      showCount(normalMsgLength, $('#msg-count'))
      showCount(groupCount, $('#group-msg-count'))
      showCount(normalMsgLength + groupCount, $('#total-count'))

      var count = normalMsgLength > 99 ? '99+' : normalMsgLength
      var display = count ? 'block' : 'none'
      $('#msg-count').html(count).css('display', display)
    }
//		var display = data.total_count > 0 ? 'block' : 'none'
//		$('#msg-count')
//			.html(data.total_count > 99 ? '99+' : data.total_count )
//			.css('display', display)
  }

  // 去重
  function dereplication(arr, key) {
    return arr.filter(function(msg, i, arr2) {
      var index = -1
      arr2.some(function(msg2, j) {
        if (msg2[key] === msg[key]) {
          index = j
          return true
        }
      })
      return i === index
    })
  }

  function saveMsgToSessionStorage(msgs) {
    sessionStorage.setItem('notReadMsgs', msgs)
  }

  /**
   * 是否是单据消息
   * @param msg
   * @returns {boolean}
   */
  function isBillGroupMsg(msg) {
    // user_name不存在就是群消息
    return msg.isgroup == 1 && msg.grouptype == 2
  }


  function saveMsg(msgs) {
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

  function showCount(len, container) {
    var count = len > 99 ? '99+' : len
    var display = count ? 'block' : 'none'
    container.html(count).css('display', display)
  }

  function getMsg(fn) {
    //获取消息
    //msgType 0 未读消息  1 已读消息
    // pageNum rowCount 页码/页面大小
    $.ajax({
      url: url.GET_MSG,
      dataType: "json",
      data: {
        ajax: "nocache",
        "pageNum": 1,
        "rowCount": 500,
        "msgType": 0,
        svRoleId: getCommonParam().svRoleId
      },
      success: function (data) {
//        console.log(1)
        //回调函数处理逻辑
        fn(data)
      },
      error: function (err) {
        console.log(err)
        //回调函数处理逻辑
//        	if(data.responseText == "msgtimeout"){
//        		window.location.href="/df/portal/login/login.html";
//        	}
      }
    });
  }

  function getTokenId() {
//      var tokenId = window.location.search
//        .slice(1)
//        .split('&')
//        .filter(function(str) {
//          return str.indexOf('tokenid=') === 0
//        })[0]
//        .split('=')[1]
//      return tokenId
    return sessionStorage.getItem('tokenid')
  }

  function getCommonParam() {
    var commonData = sessionStorage.getItem("commonData")
    commonData = commonData ? JSON.parse(commonData) : {}
    return commonData
  }

  function openWebsocket(url) {
    if ("WebSocket" in window) {
      // alert("您的浏览器支持 WebSocket!");

      // 打开一个 web socket
      var ws = new WebSocket(url);
      window.chatWs = ws
      ws.topics = {
        user: [], // 发送消息成功后返回的消息id和服务器时间
        getMsg: [getMsgHandler], // 收到其他人发送的消息
        system: [noticeUserIsOnline], // 系统消息
        usergroups: [groupChange], // 群修改

      } // 事件列表

      ws.onopen = function () {
        // console.log('connect success')
        // Web Socket 已连接上，使用 send() 方法发送数据
        // ws.send(JSON.stringify({
        //   fromUserId: '00000000000000000000000000008850',
        //   content: "你好",
        //   toUserId: "00000000000000000000000000018522",
        //   msgType: '0'
        // }));
      };

      ws.onmessage = function (e) {
        // console.log('onmessage')
        // console.log(e.data)
        var rs = JSON.parse(e.data)
        var cbs = ws.topics[rs.type]
        if (cbs && cbs.length) {
          cbs.forEach(function (cb, i, arr) {
            cb(rs.data)
          })
        }
        if (['user'].indexOf(rs.type) > -1) cbs.length = 0
      };


    }

    else {
      // 浏览器不支持 WebSocket
      alert("您的浏览器不支持 WebSocket!");
    }
  }

  function groupChange(groups) {
    if(window.vueInstance)
      window.vueInstance.$store.commit('GROUP_LIST', groups)
  }

  function noticeUserIsOnline(data) {
    var str = '<div>'
      + '<div id="chat-system-message" style="padding: 5px; background: #fff; position: fixed; right: 5px; bottom: -200px; color: #f00; width: 200px; height: 200px; box-shadow: 0 0 8px 0 rgba(0,0,0,0.5); z-index: 900;" >'
      + data.content
      + '</div>'
      + '<audio src="/df/fap/messageplatform/chat/assets/msgComing.wav" autoplay></audio>'
      + '</div>'
    var $container = $(str)
    var $div = $container.find('#chat-system-message')
    $(document.body).append($container)
    $div.animate({
      bottom: 0,
    }, 600)
    setTimeout(function () {
      $div.animate({
        bottom: -200,
      }, 600, function () {
        $(this).remove()
      })
    }, 3000)
  }
}()

