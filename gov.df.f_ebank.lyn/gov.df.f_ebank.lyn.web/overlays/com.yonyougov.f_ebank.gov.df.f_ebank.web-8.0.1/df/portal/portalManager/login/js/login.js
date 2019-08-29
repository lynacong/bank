require(['jquery', 'knockout', 'bootstrap', 'uui', 'director','md5'], function ($, ko) {
    window.ko = ko;
    
    //定义登录回馈信息
    var loginSuccess=1;
    var loginfalse_psErro=0;
    var ctx = window.location.pathname;
    var arry = ctx.split("/");
    if(arry[1]!="pf"){
    	ctx = arry[1];
    }else{
    	ctx = "";
    }
    var viewModelWrite = {
        data : ko.observable({})
    };
    viewModelWrite.init = function(){
   /*		$.ajax({
			url:"/pf/login/LoginPageSet.do",
			type: 'GET',
			data:{},
			dataType: 'json',
			success: function (data){
				 // debugger;
				  $("#appName").html( data.portalName);
				  $("#title").html( data.portalName);
				  var urls = data.loginSettings.split(",");
				  var url = "url("+urls[0]+") no-repeat center center";
				  $("#lubo_bg1").css( {"background":url}); 
				  url = "url("+urls[1]+") no-repeat center center";
				  $("#lubo_bg2").css( {"background":url});
				  url = "url("+urls[2]+") no-repeat center center";
				  $("#lubo_bg3").css( {"background":url});
			}
		});*/
    }
    viewModelWrite.onFocus = function() {
    	$("#error").text("");
    }
    
    
/*    viewModelWrite.loading = function() {
    	$('.loading').css({"display":"block"});
		$("#loginBtn").val("登录中");
		$("#loginBtn").css({"background":"rgba(16,142,233,0.65)"});
    }*/
    
    
    viewModelWrite.valiSubmit = function() {
        var userName = $('#username').val();
        var passWord = $('#password').val();
        var datetimepickerValue = $('#datetimepickerValue').val();
        if (userName == ""){
        	$("#error").text("请输入用户名");
			return false;
		}	
		if (passWord == ""){
			$("#error").text("请输入密码");
			return false;
		}
		
		var res = verifyCode.validate($("#code_input").val());
		console.log(res);
		if(!res){
			$("#error").text("请输入正确的验证码");
			$("#code_input").val("");
			return false;
		}
		//pwdremember();
		$("#error").text("");
		// TODO 修改密码加密方式??
		//var password =hex_md5(passWord);
		var password = passWord;
		var loginTime = new Date();
		//console.log("登陆请求发送："+loginTime.getTime());
		$.ajax({
			async: true,
			url:"/pf/login/portalManage/userLogin.do",
			type: 'GET',
			data:{"userName":userName,"passWord":password},
			dataType: 'json',
			beforeSend: function () {
				$('.loading').css({"display":"block"});
				$("#loginBtn").val("登录中");
				$("#loginBtn").css({"background":"rgba(16,142,233,0.65)"});
				},
			success: function (data){
				var successTime = new Date();
				var usingTime = successTime.getTime()-loginTime.getTime();
				console.log("登陆请求发送时间："+loginTime+";登陆成功跳转时间："+successTime+";总消耗时间："+usingTime+"毫秒");
				var flag = data.result;
				if(flag == loginSuccess){
					window.location.href="/pf/portal/portalManager/home.html";	
				}else if (flag == loginfalse_psErro) {
					$("#error").text("用户名或密码错误");
					$('#passWord').val("");
					$("#code_input").val("");
					verifyCode.validate("");
					$('.loading').css({"display":"none"});
					$("#loginBtn").val("登录");
					$("#loginBtn").css({"background":"rgb(16,142,233)"});
					return false;
				}else
					$("#error").text("用户不存在");
					$('#passWord').val("");
					$('.loading').css({"display":"none"});
					$("#loginBtn").val("登录");
					$("#loginBtn").css({"background":"rgb(16,142,233)"});
					return false;
			}
		});
    };
   
    $(function () {
        app = u.createApp(
            {
                el:'.content',
                model: viewModelWrite
            }
        );
        document.onkeydown = function(event_e){    
	        if(window.event)    
	         event_e = window.event;    
	         var int_keycode = event_e.charCode||event_e.keyCode;    
	         if(int_keycode ==13){   
	          //$('#queryForList').click();  
	          viewModelWrite.valiSubmit();
      		  }  
   		 }
		viewModelWrite.init();
    });
    
});

