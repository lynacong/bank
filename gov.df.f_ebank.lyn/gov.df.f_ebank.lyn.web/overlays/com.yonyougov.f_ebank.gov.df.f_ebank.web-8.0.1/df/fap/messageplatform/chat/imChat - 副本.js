!function () {
  var tokenId = getTokenId()
  var url = {
    GET_MSG: '/df/imaccess/getUserMessagesByUserId.do?tokenid=' + tokenId,
    WEBSOCKET: '',
  }
  setTimeout(function() {
    getImParam(initChat)
  }, 1000)


  $("#topChat").click(function () {
    if (window.Vue) {
      $('#im-chat').css('display', 'block')
      return
    }
    // 获取聊天窗口
//    var script = document.createElement('script')
////	 script.src = '/df/fap/messageplatform/chat/dist/build.js'
//    script.src = 'http://localhost:8080/dist/build.js'
//    document.body.appendChild(script)
    insertScript([
      '/df/fap/messageplatform/chat/lib/jquery.json-2.3.min.js', '/df/fap/messageplatform/chat/lib/niuniucapture.js',
       'http://localhost:8080/dist/build.js',
//      '/df/fap/messageplatform/chat/dist/build.js',
    ])
    function insertScript(paths) {
      paths.forEach(function (path) {
        let script = document.createElement('script')
        script.src = path
        $(document.body).append(script)
      })
    }
  });

  function initChat() {
    if (window._client) {
      for (var key in url) {
        url[key] = 'http://' + window._client + ':' + window._clientPort + url[key]
      }
    }
    if (window._websocketUrl) {
//      url.WEBSOCKET ='ws://' + window._websocketUrl + getCommonParam().svUserId
      openWebsocket(window._websocketUrl)
    }

    // 显示消息数量
    var span = '<span id="msg-count" style="position: absolute;'
      + 'right: -5px;'
      + 'top: -8px;'
      + 'background: #f00;'
      + 'border-radius: 5px;'
      + 'color: #fff;'
      + 'display: none;'
      + 'padding: 0 4px;" ></span>'
    $('#topChat').append(span).css('position', 'relative')
    

    // 获取消息的条数
    // getMsg(fn)
    // setInterval(function () {
    //   getMsg(fn)
    // }, 600000)
  }

  function getImParam(cb) {
    $.ajax({
      url: '/df/imaccess/getImConfig.do?tokenid=' + getTokenId(),
      success: function (data) {
        console.log(data)
        if (data.result === 'success' && data.isenabled === '1') {
          window._client = data.client
          window._clientPort = data.clientport
          window._websocketUrl = 'ws://' + data.websocketurl + getCommonParam().svUserId
          cb()
        }
      },
      error: function () {
        alert('初始化消息系统失败')
      },
    })
  }

  // 获取消息后的回调函数
  function fn(data) {
    window._chatData = data
    if (window.vueInstance)
      window.vueInstance.$store.dispatch('getMsg', {data: data})
    else {
      var count = data.total_count > 99 ? '99+' : data.total_count
      var display = count ? 'block' : 'none'
      $('#msg-count').html(data.total_count).css('display', display)
    }
//		var display = data.total_count > 0 ? 'block' : 'none'
//		$('#msg-count')
//			.html(data.total_count > 99 ? '99+' : data.total_count )
//			.css('display', display)
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
    		  user: [],
      } // 事件列表

      ws.onopen = function () {
    	  console.log('connect success')
        // Web Socket 已连接上，使用 send() 方法发送数据
        // ws.send(JSON.stringify({
        //   fromUserId: '00000000000000000000000000008850',
        //   content: "你好",
        //   toUserId: "00000000000000000000000000018522",
        //   msgType: '0'
        // }));
      };

      ws.onmessage = function (e) {
    	  console.log('onmessage')
//    	  console.log(e.data)
    	  var rs = JSON.parse(e.data)
    	  var cbs = ws.topics[rs.type]
    	  if(cbs && cbs.length) {
    		 cbs.forEach(function(cb, i, arr) {
    			 cb(rs.data)
    			 arr.splice(i, 1)
			 })
    	  }
//    	  fn(rs.data)
        // var received_msg = evt.data;
//        console.log(e)
//                  alert("数据已接收...");
//    	  var type = JSON.parse(e.data).type
//    	  this.subscribes.forEach(function())
      };


    }

    else {
      // 浏览器不支持 WebSocket
      alert("您的浏览器不支持 WebSocket!");
    }
  }
}()


