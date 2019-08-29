var oldpwd, newpwd, confirmpwd, btn;
var tokenid = "";

//var oldpwd = $("#oldped").val();
//var newpwd = $("#newpwd").val();
//var confirmpwd = $("#confirmpwd").val();

window.onload = function(){
	btn = document.getElementById("btn");
	btn.onclick = function(){
		oldpwd = document.getElementById("oldpwd").value;
		newpwd = document.getElementById("newpwd");
		confirmpwd = document.getElementById("confirmowd");
		registerPwd();
	}
}

// 修改密码
function registerPwd(){
	if(newpwd.value != confirmpwd.value){
		alert("两次输入的新密码不同");
		pwdWrongRecord();
		return;
	}
	
//	if(pwdCheck(newpwd.value)){
//		alert("密码强度不足");
//		return;
//	}
	var _oldpwd = hex_md5(oldpwd.value);
	$.ajax({
		url:"/df/portal/registerPwd.do",
		type:"GET",
		dataType:"json",
		data:{
			"ajax":"ajax",
			"tokenid":tokenid,
			"oldpwd":_oldpwd,
			"newpwd":newpwd.value,
			"confirmpwd":confirmpwd.value
		},
		success:function(data){
			var flag = data.flag;
			if(flag == "1"){
				alert("修改成功，请重新登录");
				//window.location.href = "xx?tokenid="+tokenid;
			}else if(flag == "0"){
				//原密码错误
				alert(data.msg);
			}
		}
	});
}

// 密码检测
function pwdCheck() {
	// TODO 密码强度检测
	var _rule = {
		"long" : {
			weak : 4,
			medium : 8,
			strong : 12
		}
	};
	// long check
	var _long;
	if (_rule.long.weak > pwd.length)
		_long = 1;
	else if (_rule.long.medium > pwd.length)
		_long = 2;
	else
		_long = 3;
	// strong check
	var _strong = 0;
	var _pwd_letter = pwd.replace(/[0-9]/gi, '');
	var _pwd_num = pwd.replace(/[a-z,A-Z]/gi, '');
	// TODO 特殊字符??
	if (pwd.length > _pwd_letter.length)
		_strong++;
	if (pwd.length > _pwd_num.length)
		_strong++;

	if (_long + _strong < 3)
		return true; // pwd weak
	return false;
}

// 密码错误记录
function pwdWrongRecord(){
	// TODO 密码错误记录
	$.ajax({
		url:"/df/portal/registerPwdWrongRecord.do",
		type:"GET",
		dataType:"json",
		data:{"ajax":"ajax","tokenid":tokenid},
		success:function(data){
		}
	});
}
