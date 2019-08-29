var dfp = dfp || {};
var AjaxURL = AjaxURL || {};

dfp = {
	key:{
		tokenid:"df_tokenid",
		tokenidPassed:"tokenid_passed",
		recentHtml:"recent_html",
		dfValidFlag:"df_valid_",	// 有效
		dfInValidFlag:"df_invalid_",
		dfSeparator1:"_"
	},
	common:{
		currentTime:function(){	// 获取当前时间
			var myDate = new Date();
			var Year=myDate.getFullYear();
			var Month=myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
			var Today=myDate.getDate();        //获取当前日(1-31)
			var Day=myDate.getDay(); 
			var week = "星期" + "日一二三四五六".split("")[Day];
			var time="";
			time+=Year+'年'+Month+'月'+Today+'日'+'&nbsp;&nbsp;'+week;
			return time;
		}
	},
	Ajax:{
		doReq:function(form, param, url, type, fn){	// form表单ID（未实现）,url请求路径,type为请求类型,param参数对象,如：{a:'test',b:2},fn回调函数
			var params = param || {}; // || form
			$.ajax({
				type:type,
				url:url,
				data:params,	// {a:'test',b:2}
				dataType:'json',
				success:function(data){
					if (typeof(fn)=='function')
						fn.call(this, data);
				},
				error:function(){return;},
				beforeSend:function(){},
				complete:function(){}
			});
		},
		doType:function(type){	// ajax类型（未加入POST）
			return type=="get"||type=="GET"||type=="Get"?"GET":"GET";
		}
	},
	tokenid:{
		isValid:function(msg){
			if(msg==dfp.key.tokenidPassed){
				alert("tokenId 已失效，请重新登录");
				Portal.user.logout();
				window.location.href = "/";
				return;
			}
		},
		getTokenId:function(){
			// TODO tokenid与后台同步刷新
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
	},
	Object:{
		isNull : function(obj) {	// 对象是否为空
			if (obj === null) return true;
			if (obj === undefined) return true;
			if (obj === "undefined") return true;
			if (obj === "") return true;
			if (obj === "[]") return true;
			if (obj === "{}") return true;
			return false;
		},
		isValid:function(obj){
			return dfp.Object.isNull(obj)?null:obj;
		}
	},
	label:{
		setLabel:function(id, name, value, type, param){	// 自定义标签设置
			
		}
	},
	encrypt:{
		base64:{
			encode:function(data){
				return dfp.Object.isNull(data)?"":Base64.encode(data);
			},
			decode:function(data){
				return dfp.Object.isNull(data)?"":Base64.decode(data);
			}
		}
	},
	localStorage:{
		setItem:function(name, value){
			window.localStorage.setItem(name, value);
		},
		getItem:function(name){
			return window.localStorage.getItem(name);
		},
		removeItem:function(name){
			window.localStorage.removeItem(name);
		},
		clearAll:function(){
			window.localStorage.clear();
		},
		keys:function(){	// 获取全部key
			//window.localStorage.key();
		}
	},
	json:{
		toJSON:function(data){
			return JSON.stringify(data);
		}
	},
	recent:{	// 最近操作
		addRecord:function(obj, type){
			
		}
	}
	
};

AjaxURL = {
	init:{
		index:"/df/portal/initIndex.do",
		getInitYearRg:"/df/portal/getYearRgcode.do"
	},
	user:{
		login:"/df/portal/login/login.html",
		logout:"/df/login/loginout.do",
		index:"/df/portal/admin/index/index.jsp"
	},
	role:{
		switchRole:"/df/portal/switchRole.do",
		switchRoleConfirm:"/df/portal/switchRoleConfirm.do"
	},
	menu:{
		getInitMenu:"/df/portal/getMenuByRole.do"
	},
	yearRg:{
		getUserSetyear:"/df/portal/getUserSetyear.do",
		getUserRgcode:"/df/portal/getUserRgcode.do",
		switchRgcodeConfirm:"/df/portal/switchRgcodeConfirm.do",
		switchSetyearConfirm:"/df/portal/switchSetyearConfirm.do"
	},
	password:{
		registerPwd:"/df/portal/registerPwd.do"
	},
	dealing:{
		getDealingThing:"/df/portal/getDealingThing.do"
	},
	often:{
		getCommonOperation:"/df/portal/getCommonOperation.do",
		addCommonOperation:"/df/portal/addToCommonOperation.do",
		removeCommonOperation:"/df/portal/removeCommonOperation.do"
	}
	
};



//function toNewIndexJSP(){
//	var tokenId = getTokenId();
//	var url = "/df/portal/admin/index2/index2.html?tokenid="+tokenId;
//	var hidden_a = $(".one_hidden_a");
//	hidden_a.attr('href', url);
//	hidden_a[0].click();
//}

