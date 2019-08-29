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
		},
		getCommonOptions:function(){
			var options = [];
			var common_data = JSON.parse(localStorage.getItem("commonData"));
			options["ajax"] = "noCache";
			options["tokenid"] = token_id;
			options["svFiscalPeriod"] = common_data.svFiscalPeriod;
			options["svSetYear"] = common_data.svSetYear;
			options["svTransDate"] = common_data.svTransDate;
			options["svUserId"] = common_data.svUserId;
			options["svUserCode"] = common_data.svUserCode;
			options["svUserName"] = common_data.svUserName;
			options["svRgCode"] = common_data.svRgCode;
			options["svRgName"] = common_data.svRgName;
			options["svRoleId"] = common_data.svRoleId;
			options["svRoleCode"] = common_data.svRoleCode;
			options["svRoleName"] = common_data.svRoleName;
			options["svMenuId"] = ip.getMenuId();
			options["svMenuName"] = ip.getMenuName();
			return options;
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
	},
	time:{
		progressInYear:function(_time){
			var _now = _time;
			if(!_time){
				_now = new Date();
			}
			var firstDay = new Date(_now.getFullYear(), 0, 1);
			var dateDiff = _now - firstDay;
			var msPerDay = 1000 * 60 * 60 * 24;
			// 计算天数
			var passDay =  Math.ceil(dateDiff/msPerDay);
			// 今年天数
			var _yearday = 365;
			var _year = 2000 + parseInt(dfp.time.core("year"));
			if (((_year % 4)==0) && ((_year % 100)!=0) || ((_year % 400)==0)) {
				_yearday += 1;
			} 
			// 序时进度
			return ((passDay/_yearday)*100).toFixed(2); // 两位小数
		},
		core:function(type){	// 时间操作
			var myDate = new Date();
			if(type=="year") return myDate.getYear(); //获取当前年份(2位)
			if(type=="fullyear") return myDate.getFullYear(); //获取完整的年份(4位,1970-????)
			if(type=="month") return myDate.getMonth(); //获取当前月份(0-11,0代表1月)
			if(type=="day") return myDate.getDate(); //获取当前日(1-31)
			if(type=="xqday") return myDate.getDay(); //获取当前星期X(0-6,0代表星期天)
			if(type=="millitime") return myDate.getTime(); //获取当前时间(从1970.1.1开始的毫秒数)
			if(type=="hour") return myDate.getHours(); //获取当前小时数(0-23)
			if(type=="minute") return myDate.getMinutes(); //获取当前分钟数(0-59)
			if(type=="second") return myDate.getSeconds(); //获取当前秒数(0-59)
			if(type=="ms") return myDate.getMilliseconds(); //获取当前毫秒数(0-999)
			if(type=="date") return myDate.toLocaleDateString(); //获取当前日期
			if(type=="currenttime") return myDate.toLocaleTimeString(); //获取当前时间
			if(type=="datetime") return myDate.toLocaleString( ); //获取日期与时间
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
	},
	payprogress:{
		getPayProgress:"/df/portal/dubbo/payProgress.do"
	},
	budget:{
		getBudget:"/df/portal/getBudget.do"
	},
	fundmonitor:{
		getFundmonitor:"/df/portal/getFundmonitor.do"
	}
	
};


function whichBrowser() {
	if (!!window.ActiveXObject || "ActiveXObject" in window){
		return "IE";
	}
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	//判断是否Opera浏览器
	if (userAgent.indexOf("Opera") > -1) {
		return "Opera"
	}
	//判断是否Firefox浏览器
	if (userAgent.indexOf("Firefox") > -1) {
		return "FF";
	}
	if (userAgent.indexOf("Chrome") > -1) {
		return "Chrome";
	}
	//判断是否Safari浏览器
	if (userAgent.indexOf("Safari") > -1) {
		return "Safari";
	}
	//判断是否IE浏览器
	if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
		return "IE";
	}
}


