window.onload = function() {
	var userNameValue = getCookieValue("yysdczuname");
	document.getElementById("username").value = userNameValue;
}

function pwdremember(){
	var pwd_checkbox = document.getElementById("pwd_checkbox");
	if(pwd_checkbox.checked){
		addCookie("yysdczuname", $("#username").val(), 7, "/");
		addCookie("yysdczuname", $("#username").val(), 7, "/df/portal/login/login.html");
		//addCookie("userPass", $("#password").val(), 7, "/");
	}else{
		// remove cookie ??
	}
}

// add cookie
function addCookie(name, value, days, path) {
	var name = escape(name);
	var value = escape(value);
	var expires = new Date();
	expires.setTime(expires.getTime() + days * 3600000 * 24);
	//path=/，表示cookie能在整个网站下使用，path=/temp，表示cookie只能在temp目录下使用  
	path = path == "" ? "" : ";path=" + path;
	//GMT(Greenwich Mean Time)是格林尼治平时，现在的标准时间，协调世界时是UTC  
	//参数days只能是数字型  
	var _expires = (typeof days) == "string" ? "" : ";expires=" + expires.toUTCString();
	document.cookie = name + "=" + value + _expires + path;
}

// get cookie
function getCookieValue(name) {
	//用处理字符串的方式查找到key对应value  
	var name = escape(name);
	//读cookie属性，这将返回文档的所有cookie  
	var allcookies = document.cookie;
	//查找名为name的cookie的开始位置  
	name += "=";
	var pos = allcookies.indexOf(name);
	//如果找到了具有该名字的cookie，那么提取并使用它的值  
	if(pos != -1) { //如果pos值为-1则说明搜索"version="失败  
		var start = pos + name.length; //cookie值开始的位置  
		var end = allcookies.indexOf(";", start); //从cookie值开始的位置起搜索第一个";"的位置,即cookie值结尾的位置  
		if(end == -1) 
			end = allcookies.length; //如果end值为-1说明cookie列表里只有一个cookie  
		var value = allcookies.substring(start, end); //提取cookie的值  
		return (value); //对它解码        
	} else { //搜索失败，返回空字符串  
		return "";
	}
}

// delete cookie
function deleteCookie(name, path) {
	var name = escape(name);
	var expires = new Date(0);
	path = path == "" ? "" : ";path=" + path;
	document.cookie = name + "=" + ";expires=" + expires.toUTCString() + path;
}

