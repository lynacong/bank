function getTokenId(){
	var current_url = window.location.href;
	if(current_url.indexOf("?") > -1){
		var tokenid = "";
		var params = new Array();
		params = current_url.split("?");
		if(params[1].indexOf("tokenid=") > -1){
			if(params[1].indexOf("&") > -1){
				var neededParams = params[1].split("&");
				for(var i in neededParams){
					if(neededParams[i].indexOf("tokenid=") > -1){
						tokenid = neededParams[i];
						break;
					}
				}
			}else{
				tokenid = params[1];
			}
		}
		var tokenidFromLS = dfp.localStorage.getItem(dfp.key.tokenid);
		if(!dfp.Object.isNull(tokenidFromLS)){
			var tokenidFromLSs = tokenidFromLS.split(dfp.key.dfSeparator1);
			if(tokenidFromLSs[2] == tokenid.substring(8))
				dfp.localStorage.setItem(dfp.key.tokenid, dfp.key.dfValidFlag+tokenid.substring(8));
		}
		return tokenid.substring(8);
	}
	return "";
}
function toIndex1(){
	    var current_url = window.location.href;
	 
	   
		// 截取IP，eg: http://10.10.10.10:9999/login.html
		var arr = current_url.split("/");
		//10.10.10.10:9999
		var IP = arr[2];
		
		var IP2 = IP.split(":");
		//10.10.10.10
		var IP3 =IP2[0];
		
	    var svUserCode= $("#svUserCode").val();
		var tokenId = getTokenId();
		window.open("http://127.0.0.1:9001/gfmis/login?sysapp=800&ucode="+svUserCode+"&&sid=1HKQJNhpvvY3Zm6G6D&setyear=2018&rgcode=370000&loadModel=1&version=V3.0.5.02&menuid=800016005&tokenid="+tokenId+" ");
		//var url = "/df/sd/pay/centerpay/input/paAccreditBillInput.html?billtype=366&busbilltype=322&model=model5&menuid=C047898C4CD1EED11FD618D4E3028DEF&menuname=%u73B0%u91D1%u4E1A%u52A1%u5F55%u5165&tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	function toIndex2(){
		var tokenId = getTokenId();
		var url = "/df/sd/pay/centerpay/input/paInputEn.html?billtype=366&busbilltype=311&model=model5&menuid=C427F8BB4F684A1F147BF58255C4DD8A&menuname=%u5355%u4F4D%u6388%u6743%u652F%u4ED8%u7533%u8BF7%u5F55%u5165&tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	function toIndex3(){
		var tokenId = getTokenId();
		var url = "/df/sd/pay/centerpay/input/paAccreditBillInputDK.html?billtype=366&busbilltype=322&model=model5&menuid=D4D2E5CF288710FE3582E3B6C2831ACF&menuname=%u4EE3%u6263%u4EE3%u7F34%u4E1A%u52A1%u5F55%u5165&tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	function toIndex4(){
		var tokenId = getTokenId();
		var url = "/df/sd/pay/centerpay/input/paAccreditBillInputGT.html?billtype=366&busbilltype=322&model=model5&menuid=724D55EF8BB15697FBE6484F8D1F3B9E&menuname=%u67DC%u53F0%u7F34%u7EB3%u7A0E%u8D39%u4E1A%u52A1%u5F55%u5165&tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	function toIndex5(){
		var tokenId = getTokenId();
		var url = "/df/sd/pay/centerpay/input/payBatchImport.html?billtype=367&busbilltype=322&menuid=86134C532B4456C55521D219C9A9A62D&menuname=%u6388%u6743%u652F%u4ED8%u6279%u91CF%u5BFC%u5165&tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	function toIndex6(){
		var tokenId = getTokenId();
		var url = "/df/sd/pay/centerpay/input/payBatchImport.html?billtype=367&busbilltype=322&menuid=86134C532B4456C55521D219C9A9A62D&menuname=%u6388%u6743%u652F%u4ED8%u6279%u91CF%u5BFC%u5165&tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	function toIndex7(){
		var tokenId = getTokenId();
		var url = "/df/sd/pay/centerpay/input/payBatchImport.html?billtype=367&busbilltype=322&menuid=86134C532B4456C55521D219C9A9A62D&menuname=%u6388%u6743%u652F%u4ED8%u6279%u91CF%u5BFC%u5165&tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	function toUpload(){
		var tokenId = getTokenId();
		var url = "/df/portal/budget/upload.html?tokenid="+tokenId;
		var hidden_a = $(".one_hidden_a");
		hidden_a.attr('href', url);
		hidden_a[0].click();
	}
	
$(function(){
	window.onload = function(){
		var tokenId = getTokenId();
		var caroleguid = localStorage.select_role_guid==undefined?"":localStorage.select_role_guid;
		$.ajax({
			url:"/df/portal/initBudget.do",
			type:"GET",
			data:{"tokenid":tokenId, "caroleguid":Base64.encode(caroleguid)},
			dataType:"json",
			success: function(data){
				
				$("#svFiscalPeriod").val(dfp.encrypt.base64.encode(data.publicParam.svFiscalPeriod));	// 会计期间
				$("#svMenuId").val(dfp.encrypt.base64.encode(data.publicParam.svMenuId));	// 菜单ID
				$("#svRgCode").val(dfp.encrypt.base64.encode(data.publicParam.svRgCode));	// 区划CODE
				$("#svRgName").val(dfp.encrypt.base64.encode(data.publicParam.svRgName));	// 区划ID
				$("#svRoleCode").val(dfp.encrypt.base64.encode(data.publicParam.svRoleCode));	// 角色CODE
				$("#svRoleId").val(dfp.encrypt.base64.encode(data.publicParam.svRoleId));	// 角色ID
				$("#svRoleName").val(dfp.encrypt.base64.encode(data.publicParam.svRoleName));	// 角色名称
				$("#svSetYear").val(dfp.encrypt.base64.encode(data.publicParam.svSetYear));	// 年度
				$("#svTransDate").val(dfp.encrypt.base64.encode(data.publicParam.svTransDate));	// 业务日期
				$("#svUserCode").val(data.publicParam.svUserCode);	// 用户CODE
				$("#svUserId").val(dfp.encrypt.base64.encode(data.publicParam.svUserId));	// 用户ID
				$("#svUserName").val(data.publicParam.svUserName);	// 用户名称
				$("#svAgencyCode").val(dfp.encrypt.base64.encode(data.publicParam.svAgencyCode));	// 单位Code
				$("#svAgencyName").val(dfp.encrypt.base64.encode(data.publicParam.svAgencyName));	// 单位名称
        		
        		
    	    	
		        //获取预算公告
				GetPageJsonData();
				//获取预算下载
				getDownload();
				// 获取预算待办事项
				getBudgetTask();
				//获取预算单点登录
				getDanUrl();
			}
		});
		
		
	}
	//取消按钮
	$("#changepw").click(function(){
		changePassWord();
	});
	//取消按钮
	$("#quxiao").click(function(){
		history.go(-1);
	});
	
	
});

