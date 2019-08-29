var rgset_relation;
var rg_code;
var set_year;
$(function(){
//	var isValidate = true;
	// 加载年度、区划信息
	$.ajax({
		url:"/df/portal/getYearRgcode.do?tokenid=before",
		type: 'GET',		
		dataType: 'json',
//		success: function (data){
//			$("#login-btn").attr("disabled", true);
//			rgset_relation = data.rgset_relation; //map
//			rg_code = data.rg_code;
//			set_year = data.set_year;
//			var rg_codeHtml = "";
//			var year_codeHtml = "";
//			for(var  i in rg_code){
//				rg_codeHtml += '<option value="'+rg_code[i].chr_code+'">'+rg_code[i].chr_name+'</option>';
//			}
//			for(var i in set_year){
//				year_codeHtml += '<option value="'+set_year[i]+'">'+set_year[i]+'</option>';
//			}
//			$("#rgCode").html(rg_codeHtml);
//			$("#setYear").html(year_codeHtml);
//		},
		complete :function(XHR){
			var licenseMap = localStorage.getItem('licenseMap');
			var type = endTime = endDate = checkStatus = dateTime = difDay = null;
			if(licenseMap != null){
		        //授权类型
		        type = JSON.parse(licenseMap).type;
		        //授权截止时间 long
		        endTime = JSON.parse(licenseMap).endTime;
		        //授权截止时间 yyyy-mm-dd
		        endDate = JSON.parse(licenseMap).endDate;
		        //授权检查状态
		        checkStatus = JSON.parse(licenseMap).checkStatus;
		        dateTime = JSON.parse(licenseMap).dateTime;
		        difDay = judgeTimeDiffer(dateTime,endTime);
		    }else{
		        return;
		    }
			//只要有一个参数没有值，暂不作处理
		    if(type == null || type =='-1'|| endTime == null || endDate == null || checkStatus == null ){
		        return;
		    }
		    //演示版
		    if(type == 0){
		        if(difDay == 0 & (endTime-dateTime) < 0){
		            $('#license').html('演示版 授权已过期');
		            $("#login-btn").attr("disabled", true);
		            $("#login-btn").css("background", "gray");
//		            isValidate = false;
		        }else if(difDay < 0){
		            $('#license').html('演示版 授权已过期');
		            $("#login-btn").attr("disabled", true);
		            $("#login-btn").css("background", "gray");
//		            isValidate = false;
		        }else{
		            $('#license').html('演示版');
		            $("#login-btn").attr("disabled", false);
		        }
		    }else if(type == 1){
		        //正式版
		        if(difDay < ((-6*30) + 1) || difDay == (-6*30) + 1){
		            $('#license').html('授权已过期' );
		            $("#login-btn").attr("disabled", true);
		            $("#login-btn").css("background", "gray");
//		            isValidate = false;
		        }else{
					$("#login-btn").attr("disabled", false);
				}
		    }
		},
		error : function(){
			alert("获取区划信息失败！");
		}
	});
	
	function judgeTimeDiffer(startTime,endTime) {
	    return parseInt(( endTime -startTime) / 1000 / 60 / 60 / 24 );
	}
	
	localStorage.agencyList = "";
	sessionStorage.tokenid = "";
	sessionStorage.select_role_guid = "";
	sessionStorage.select_agency_code = "";
	sessionStorage.dfp_menu_lv3 = "";
	sessionStorage.dfp_menu_all = "";
	sessionStorage.commonData = "";
	sessionStorage.select_role_user_sys_id = "";
	
	$(".panel-login input").focus(function(){
		//IE8并不奏效，但是能解决输入框获焦时紧贴的问题-> <-
		this.placeholder='';
		$(this).next().hide();
	})
	$(".panel-login .user").blur(function(){
		var value = $(this).val();
		checkTips(value,$(this),"用户名不能为空");
	})
	$(".panel-login .pwd").blur(function(){
		var value = $(this).val();
		checkTips(value,$(this),"密码不能为空");
	})
	
	function checkTips(value,curEle,tipText){
		if(value == ''){
			curEle.next().show().text(tipText);
		}else{
			curEle.next().hide();
		}
	}
});

//用户名登录
function login() {
	var userName = $('#username').val();
    var passWord = $('#password').val();
    var setYear = $("#setYear").val();
   	var rgCode = $("#rgCode").val();
   	userName=$.trim(userName);
    if (!userName){
   		alert("请输入用户名！");
   		$("#username").focus();
   		return false;
   	}	
   	if (!passWord){
   		alert("请输入密码！");
   		$("#password").focus();
   		return false;
   	}
   	if (setYear == "" || setYear == "0"){
   		alert("请选择年度！");
   		$("#setYear").focus();
   		return false;
   	}
   	if (rgCode == "" || rgCode == "0"){
   		alert("请选择区划！");
   		$("#rgCode").focus();
   		return false;
   	}
	var password = hex_md5(passWord);
	
	$.ajax({
		url:"/df/login/userLogin.do",
		type: 'GET',
		data:{"ajax":"ajax","userName":userName,"passWord":password,"setYear":setYear,"rgCode":rgCode},
		dataType: 'json',
		success: function (data){
			var flag = data.flag;
			var tokenId = data.tokenid;
			if(flag == "1"){
				//dfp_util.cookie.set("yysdczuname", $("#username").val(), 7 * 24 * 60 * 60 * 1000);
				sessionStorage.setItem("select_agency_code", "");
				sessionStorage.setItem("select_role_guid", "");
				sessionStorage.setItem("tokenid", tokenId);
				localStorage.setItem("tokenid", tokenId);
				sessionStorage.setItem('menuType', data.menuType);
				sessionStorage.setItem('menuname', "");
				if(userName=='999999999'){
					window.location.href="/df/portal/admin/index/index.html";
				}else{
					window.location.href="/df/rounte/admin/index.html";
				}
			}else{
				alert("用户名或密码错误！");
				return false;
			}
		}
	});
}
