var dfp = dfp || {};
var dfp_util = dfp_util || {};
var dfp_re = dfp_re || {};

dfp = {
	/**
	 * 从当前url中解析出tokenid（按位置）
	 */
	tokenid : function() {
//		var current_url = window.location.href;
//		if(current_url.indexOf("?") > -1){
//			var tokenid = "";
//			var params = new Array();
//			params = current_url.split("?");
//			if(params[1].indexOf("tokenid=") > -1){
//				if(params[1].indexOf("&") > -1){
//					var neededParams = params[1].split("&");
//					for(var i in neededParams){
//						if(neededParams[i].indexOf("tokenid=") > -1){
//							tokenid = neededParams[i];
//							break;
//						}
//					}
//				}else{
//					tokenid = params[1];
//				}
//			}
//			return tokenid.substring(8);
//		}
//		return "";
		//return localStorage.getItem("tokenid");
		return sessionStorage.getItem("tokenid");
	},
	/**
	 * 拼接url，自动加载参数
	 * @params url
	 * @params [param] 参数字符串 // TODO 考虑增加json解析
	 */
	completeUrl : function(url, param) {
		if(param == "" || param == null || param == undefined)
			param = "_x=1";
		if(url == "" || url == null || url == undefined)
			return url;
		url = url.replace(/\s/g, ""); // 去除全部空格
		if(url.indexOf("?") > -1)
			return url + "&" + param;
		if(url.indexOf("?") < 0)
			return url + "?" + param;
	},
	/**
	 * 拼接url并加入tokenid参数
	 * @params url
	 * @params [param] 参数可为空
	 */
	completeUrlWithTokenid : function(url, param) {
		return this.completeUrl(url, param) + "&tokenid=" + this.tokenid();
	},
	/**
	 * 序时进度，参数格式 2017/07/07
	 */
	/*progressInYear : function(_time) {
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
		var _year = 2000 + parseInt(_now.getYear());
		if (((_year % 4)==0) && ((_year % 100)!=0) || ((_year % 400)==0)) {
			_yearday += 1;
		} 
		// 序时进度
		return ((passDay/_yearday)*100).toFixed(2); // 两位小数
	},*/
	/**
	 * 获取当前时间
	 * @params type pp:支出进度-截止时间
	 */
	datetimeSpe : function(type) {
		var SEP_1 = "-";
		var SEP_2 = ":";
		var myDate = new Date();
		var Year = myDate.getFullYear();
		var Month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
		Month = Month>=1&&Month<=9 ? "0"+Month : Month;
		var Today = myDate.getDate(); //获取当前日(1-31)
		Today = Today>=1&&Today<=9 ? "0"+Today : Today;
		var Day = myDate.getDay();
		if ("pp" == type) {
			return Year + SEP_1 + Month + SEP_1 + Today; // 2017-07-22
		}
	},
	/**
	 * 获取ls中的公共参数
	 * @params options
	 * @params [type] 返回类型，默认返回对象：json 返回公共参数的json形式，obj 返回封装后对象
	 */
	commonData : function(options, type) {
		options = dfp_util.isNull(options) ? {} : options;
		options["ajax"] = "noCache";
		options["tokenid"] = getTokenId();
		var common_data = JSON.parse(sessionStorage.getItem("commonData"));
		if(type == "json") {
			return common_data;
		}
		for(var i in common_data) {
			if(!common_data.hasOwnProperty(i)) {
				continue;
			}
			options[i] = common_data[i];
		}
		if(type == "obj" || type == null) {
			return options;
		}
		return options;
	},
	/**
	 * 获取指定ls中指定字段值
	 */
	thisFromCommonData : function(name) {
		return (this.commonData({}))[name];
	},
	/**
	 * 数字千分位处理，保留2位小数
	 */
	num2ThousandBreak : function(value) {
		if (value == 0) {
			return parseFloat(value).toFixed(2);
		}
		if (value != "") {
			var num = "";
			value = parseFloat(value).toFixed(2);
			if (value.indexOf(".") == -1) {
				num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
					return s + ',';
				});
			} else {
				num = value.replace(/(\d)(?=(\d{3})+\.)/g, function(s) {
					return s + ',';
				});
			}
		}
		return num;
	},
	/**
	 * 数字千分位处理，保留2位小数
	 */
	num2ThousandBreakNoDigit : function(value) {
		if (value == 0) {
			return parseFloat(value).toFixed(0);
		}
		if (value != "") {
			var num = "";
			value = parseFloat(value).toFixed(0);
			if (value.indexOf(".") == -1) {
				num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
					return s + ',';
				});
			} else {
				num = value.replace(/(\d)(?=(\d{3})+\.)/g, function(s) {
					return s + ',';
				});
			}
		}
		return num;
	},
	/**
	 * 数字转百分比
	 */
	num2Percent : function(num) {
		return (num * 100).toFixed(2) + "%";
	},
	/**
	 * 去掉字符串中的数字
	 */
	removeNumFromStr : function(str) {
		str = dfp_re.num.removeAll(str);
		str = dfp_re.trim(str);
		return str;
	},
	cookie : function() {
		
	}
	
};

dfp_util = {
	/**
	 * 样式操作
	 */
	css : {
		/**
		 * 基础样式
		 * @params style 标签选择器及样式，eg: 
		 * { "0":"#id", 
		 *   "_0":{"width":"20px", "height":"20px"},
		 *   "1":".class",
		 *   "_1":{"width":"20px", "height":"20px"}
		 * }
		 */
		set : function(style) {
			// 增加 # . 判断
			
		}
	},
	
	/**
	 * 判断单个变量是否为空
	 * // TODO 为空判断需要重做 
	 */
	isNull : function(param) {
		return param == "" ? true : (param == null ? true : (param == undefined ? true : false));
	},
	/**
	 * 判断对象是否为空（只能判断对象，如 {}）
	 */
	isObjEmpty : function(obj) {
		var name;
		for (name in obj) {
			return false;
		}
		return true;
	},
	/**
	 * 判断元素是否在数组内
	 */
	isValueInArray : function(arr, obj) {
		var i = arr.length;  
	    while (i--) {  
	        if (arr[i] === obj) {  
	            return true;  
	        }  
	    }  
	    return false;
	},
	/**
	 * 判断一个变量是否已获取上文中的值，如果未获取则等待
	 * @params variableName 待判断的变量
	 * @params waitTime 等待次数，默认10次
	 * @params perTime 每次等待间隔（毫秒），默认100毫秒
	 */
	isVariableGot : {
		
	},
	/**
	 * 循环js对象，返回键值对对象
	 * @params jobj json对象，字符串需预先转换为json对象
	 */
	jobj2kv : function(jobj) {
		var options = {};
		for(var i in jobj) {
			if(!jobj.hasOwnProperty(i)) {
				continue;
			}
			options[i] = jobj[i];
		}
		return options;
	},
	/**
	 * 从 ls 中获取指定数据
	 * @params lsname ls名
	 * @params [type] ls类型：json JSON串，str 普通字符串(默认)
	 */
	thisFromLS : function(lsname, type) {
		return type == "json" ? JSON.parse(localStorage.getItem(lsname)) : localStorage.getItem(lsname);
	},
	
	/**
	 * 时间操作
	 */
	time : {
		/**
		 * 获取客户端时间
		 * @params type
		 */
		client : function(type) {
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
			if(type=="date") return myDate.toLocaleDateString(); //获取当前日期 eg: google 2017/8/10, ie 2017年8月10日
			if(type=="currenttime") return myDate.toLocaleTimeString(); //获取当前时间 eg: 下午3:59:18
			if(type=="datetime") return myDate.toLocaleString( ); //获取日期与时间 eg: 2017/8/10 下午3:59:00
		},
		/**
		 * 获取服务器时间
		 */
		server : function() {
			// 毫秒数，可用 +1000 与 setInterval 实现数字表
			var centerDate = $.ajax({async: false}).getResponseHeader("Date");
			var _timestamp = Date.parse(centerDate);
		    _timestamp = _timestamp.toString().match(/^\d$/) ? _timestamp : new Date().getTime();
			curDate = new Date(_timestamp);
			//_hour = curDate.getHours();
			//_minutes = curDate.getMinutes();
			//_seconds = curDate.getSeconds();
			return curDate;
		}
	},
	
	/**
	 * 浏览器类型
	 */
	browser : {
		/**
		 * 获取浏览器类型
		 */
		type : function() {
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
		},
		/**
		 * 是否为 IE
		 */
		isIE : function() {
			return this.type() == "IE" ? true : false;
		}
	},
	/**
	 * Base64
	 */
	base64 : {
		encode : function(data) {
			return Base64.encode(data);
		},
		decode : function(data) {
			return Base64.decode(data);
		}
	},
	/**
	 * 获取cookie
	 */
	cookie : {
		/**
		 * 设置cookie
		 * @params [time] 数字类型，有效时间(毫秒)，默认 24*60*60*1000 24小时
		 * @params [path] 路径：/，表示cookie能在整个网站下使用(默认); path=/temp，表示cookie只能在temp目录下使用
		 */
		set : function(name, val, time, path) {
			time = time == null ? 24*60*60*1000 : time;
			var expires = new Date();
			expires.setTime(expires.getTime() + time);
			//GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
			var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
			path = ";path=" + (path = path == "" ? "/" : path);
			document.cookie = escape(name) + "=" + escape(val) + _expires + path;
		},
		/**
		 * 获取cookie中的值
		 */
		get : function(name) {
			//读cookie属性，这将返回文档的所有cookie  
			var allcookies = document.cookie;
			//查找名为name的cookie的开始位置，用处理字符串的方式查找到key对应value  
			name = escape(name) + "=";
			var pos = allcookies.indexOf(name);
			//如果找到了具有该名字的cookie，那么提取并使用它的值  
			if(pos != -1) { //如果pos值为-1则说明搜索"version="失败  
				var start = pos + name.length; //cookie值开始的位置  
				var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
				if(end == -1) 
					end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie  
				var value = allcookies.substring(start, end); //提取cookie的值  
				return(value); //对它解码        
			} else { //搜索失败，返回空字符串  
				return "";
			}
		},
		/**
		 * 移除指定cookie
		 */
		remove : function(name, path) {
			var expires = new Date(0);
			path = ";path=" + (path = path == null ? "/" : path);
			document.cookie = escape(name) + "=" + ";expires=" + expires.toUTCString() + path;
		}
	},
	
	getUrlParameter : function(url, key) {
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
		var r = url.match(reg);
		if(r == null){
			reg = new RegExp("([?])" + key + "=([^&]*)(&|$)");
			r = url.match(reg);
		}
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	},
	
	maxDiv : function(id){
        var index = layer.open({
            type: 1,
            title: '',
            //skin: 'layui-layer-rim', //加上边框
            area: ['820px', '600px'], //宽高
            content: $(id),
            offset: 'rb',
            closeBtn: 2,
            //maxmin: true,
            yes: function (index) {
                layer.close(index);
            },
            cancel: function (index) {
                layer.close(index);
            }
        });
        layer.full(index);
	}
};

/**
 * 正则表达式
 */
dfp_re = {
	/**
	 * 空格、回车、换行等
	 */
	whitespace : "[\\x20\\t\\r\\n\\f]",
	rtrim : new RegExp( "^" + this.whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + this.whitespace + "+$", "g" ),
	bf : function() {},
	/**
	 * 去掉首尾空格
	 */
	trim : function(text) {
		return text == null ? "" : (text + "").replace(this.rtrim, "");
	},
	/**
	 * 去除全部特殊字符
	 */
	strim : function(text) {
		return text == null ? "" : (text + "").replace(/[\r\n\t\f]/g, "");
	},
	space : {
		/**
		 * 去除全部空格
		 */
		removeAll : function(str) {
			return str.replace(/\s/g, "");
		}
	},
	num : {
		/**
		 * 去除全部数字
		 */
		removeAll : function(str) {
			return str.replace(/^[\d]+/g, "");
		}
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

/**
 * 获取tokenid
 */
function getTokenId() {
	return dfp.tokenid();
}
/**
 * fullUrlWithTokenid
 */
function fullUrlWithTokenid(url, param) {
	return dfp.completeUrlWithTokenid(url, param);
}

