// 服务器时间
var centerDate;
var svUserCode;
var svUserSysId = [];
//角色权限表示
var userSysId_zb = ['111']; // 指标
var userSysId_pay = ['115', '602', '000','119']; // 支付
var userSysId_super = ['001']; // 超级
var userSysId_budget = ['101']; // 预算
var isSuperUser = false;
// 当前用户可用平台页面
var userSystemPageUrl = "";
// 全局时间
var _timestamp = 0;

$(function() {
	// 获取用户信息
	getUserInfo();
	// getDownload();
	// 政采待办获取
	// getzctask();
	/**
	 * 清空密码框
	 */
	$('#offPwdBtn').click(function() {
		$("#oldpasswd").val("");
		$("#passwd").val("");
		$("#passwd2").val("");
	});
	// 删除缓存
	sessionStorage.select_role_guid = "";
	sessionStorage.select_role_user_sys_id = "";
	/**
	 * 修改密码提交按钮
	 */
	$('#commitPwdBtn').click(function() {
		var tokenId = sessionStorage.getItem("tokenid");
		$.ajax({
			url : "/df/portal/budget/getUserSys.do?tokenId=" + tokenId,
			type : "GET",
			data : {
				"tokenid" : tokenId
			},
			dataType : "json",
			success : function(data) {
				var userId = data[0];

				// 用户密码
				var password = data[1];

				var oldpasswd1 = $("#oldpasswd").val();
				// 原密码加密后
				var oldpasswd = hex_md5(oldpasswd1);
				// 判断用户密码和原密码是否相等
				if (password == oldpasswd) {
					var passwd = $("#passwd").val().replace(/(^\s+)|(\s+$)/g, "");
					var passwd2 = $("#passwd2").val().replace(/(^\s+)|(\s+$)/g, "");
					var passwdmd5 = hex_md5(passwd);
					// 判断新密码两次是否一样
					if (passwd == passwd2) {
						$.ajax({
							url : "/df/portal/budget/changePassWord.do?tokenId=" + tokenId,
							type : "GET",
							data : {
								"tokenid" : tokenId,
								"userId" : userId,
								"passwdmd5" : passwdmd5
							},
							dataType : "json",
							success : function(data) {
								if (data[0].flag == "1") {
									alert("密码修改成功");
									logout();
								} else {
									alert("密码修改失败");
								}
							}
						});
					} else {
						alert("两次密码不一致，请重新输入！");
					}
				} else {
					alert("原始密码验证失败，请重新输入！");
				}
			}

		});

	});
	/**
	 * 预算管理按钮 -> 转移到“主体按钮事件”中
	 */
//	$('#ysglbutton').click(
//		function() {
//			var current_url = window.location.href;
//			// 截取IP，eg: http://10.10.10.10:9999/login.html
//			var arr = current_url.split("/");
//			// 10.10.10.10:9999
//			var IP = arr[2];
//			var IP2 = IP.split(":");
//			// 10.10.10.10
//			var IP3 = IP2[0];
//			var tokenId = sessionStorage.getItem("tokenid");
//			$.ajax({
//				url : "/df/portal/budget/getUserSys.do?tokenId=" + tokenId,
//				type : 'GET',
//				data : {
//					"tokenid" : tokenId
//				},
//				dataType : 'json',
//				success : function(data) {
//					var userCode = data[2];
//					window.open("http://" + IP3 + ":8008/gfmis/login?sysapp=800&ucode=" + userCode
//							+ "&&sid=1HKQJNhpvvY3Zm6G6D&setyear=2018&rgcode=370000&loadModel=1&version=V3.0.5.02&menuid=800028&tokenid="
//							+ tokenId + " ");
//				}
//			});
//		});
	// 获取文件下载
	function getDownload() {

		var tokenId = sessionStorage.getItem("tokenid");
		$.ajax({
			url : "/df/portal/budget/getDownload.do",
			type : "GET",
			data : {
				"tokenid" : tokenId
			},
			dataType : "json",
			success : function(data) {
				var html = "";
				for ( var i = 0; i < data.length; i++) {
					var name = data[i].downname;
					html += '<li><span class="icon"></span><a  href="/servlet/DownLoadServlet?name=' + name + '"&id="' + name + '&tokenid=' + tokenId
							+ '">' + name + '</a></li>';
				}
				$("#download").html(html);

			}
		});
	}
	/**
	 * 页面头部信息加载
	 */
	centerDate = $.ajax({async: false}).getResponseHeader("Date");
	var caroleguid = sessionStorage.select_role_guid == undefined ? "" : sessionStorage.select_role_guid, agencyCode = sessionStorage.select_agency_code == undefined ? ""
			: sessionStorage.select_agency_code;
	if (!sessionStorage.tokenid) {
		window.location.href = "/df/portal/login/login.html";
		return false;
	}
	$.ajax({
		url : "/df/portal/initIndex.do",
		type : "GET",
		data : {
			"tokenid" : getTokenId(),
			"caroleguid" : Base64.encode(caroleguid),
			"agencyCode" : Base64.encode(agencyCode)
		},
		dataType : "json",
		success : function(data) {
			userSystemPageUrl = data.dashboardUrl;
			
			roleUserSysIdList = data.roleUserSysIdList;
			// 获取当前用户全部角色的user_sys_id
			for(var i in roleUserSysIdList) {
				if (!roleUserSysIdList.hasOwnProperty(i)) continue;
				svUserSysId.push(roleUserSysIdList[i]["user_sys_id"]);
			}
			
			// 排除系统管理员对系统选择的影响
			// TODO 恢复001管理员权限
			var _svUserCodeSuper = data.publicParam.svUserCode;
//			if(_svUserCodeSuper === "999999999") {
//				isSuperUser = true;
//			}
			if (dfp.isArrayContainsWithArr(userSysId_super, svUserSysId)) {
				isSuperUser = true;
			}
			
			/**
		     * 主体按钮事件
		     */
            $(".openSystem").each(function () {
                $(this).on("click", function () {
                    var $a = $("<a href='' target='_blank'/>");
                    var id = $(this).prop("id");
                    var sysUrl = sysUrls[id];
                    var param = "?tokenId=" + getTokenId();
                    
                    // 不同系统的前置处理
                    var systemPreDone = function(id) {
                    	if (id === "ysglbutton") {
                    		var lc = window.document.location;
                            var u = lc.href,
                                p = lc.pathname;
                            var _u = u.substring(0, u.indexOf(p)).replace(".241", ".235");
                            sysUrl = _u.substring(0, _u.length - 4) + "8008" + sysUrl;
                            param += 'sysapp=800&ucode=' + svUserCode + '&sid=1HKQJNhpvvY3Zm6G6D&setyear=2018&rgcode=370000&loadModel=1&version=V3.0.5.02&menuid=800028';
                            sessionStorage.setItem("select_role_user_sys_id", userSysId_budget.join(","));
                            return true;
                    	} else if (id === "jzzfbutton") {
                    		// 加入当前判定条件中系统的简易权限判定
                            if (dfp.isNull(userSystemPageUrl)) {
                                alert("您暂时没有该系统的操作权限，请选择其他系统或联系管理员。");
                                return false;
                            }
                            $a.prop("target", "_self");
                            sessionStorage.setItem("select_role_user_sys_id", userSysId_pay.join(","));
                            return true;
                    	} else if (id === "zbglbutton") {
                    		$a.prop("target", "_self");
                    		sessionStorage.setItem("select_role_user_sys_id", userSysId_zb.join(","));
                    		return true;
                    	} else if (id === "zfcgbutton") {
                    		param += "&uId=" + svUserCode;
                    		return true;
                    	}
                    	return false;
                    };
                    var isSystemPreDoneOk = false;
                    if (isSuperUser) {
                    	isSystemPreDoneOk = systemPreDone(id);
                    } else {
                    	if (dfp.isArrayContainsWithArr(userSysId_budget, svUserSysId)) { // 预算管理加入指定IP跳转
                        	if (id === "ysglbutton") {
                        		isSystemPreDoneOk = systemPreDone(id);
                        	}
                        } else if (dfp.isArrayContainsWithArr(userSysId_pay, svUserSysId)) { // 集中支付默认在本页面打开
                        	if (id === "jzzfbutton") {
                        		isSystemPreDoneOk = systemPreDone(id);
                        	}
                        } else if (dfp.isArrayContainsWithArr(userSysId_zb, svUserSysId)) { // 指标管理默认在本页面打开
                        	if (id === "zbglbutton") {
                        		isSystemPreDoneOk = systemPreDone(id);
                        	}
                        } else if (id === "zfcgbutton") { // TODO 政府采购携带用户参数(暂不做处理)
                        	if (id === "zfcgbutton") {
                        		isSystemPreDoneOk = systemPreDone(id);
                        	}
                        }
                    }
                    
                    if (!isSystemPreDoneOk) {
                    	alert("您没有当前系统的访问权限，请选择其他系统或联系管理员。");
                    	return false;
                    }

                    $a.prop("href", sysUrl + param);
                    $("body").append($a);
                    $a[0].click();
                    $a.remove();
                });
            });
			/**
			 * 按钮对应地址
			 */
			var sysUrls = {
				ysglbutton : "/gfmis/login",
				zbglbutton : "/df/portal/admin/index/index.html",
				jzzfbutton : "/df/portal/admin/index/index.html",
				// zfcgbutton : "http://192.168.10.28:8888/sdgp2017/enter_sdczpt.jsp",
				// 加入政府采购单点登录
				zfcgbutton : "http://10.28.5.132:8080/sdgp2014/enter_sdczpt.jsp",
				oabutton: "",
				zcglbutton: "",
				gztfbutton: "",
				jxpjbutton: "",
				jsglbutton: ""
			};
			
			// 当前用户
			if (data.publicParam.svUserName) {
				$("#agencyameTop").text(data.publicParam.svUserName);
			} else {
				$("#agencyameTop").parent("div").css("display", "none");
			}
			// 时间
			var _xx = setInterval(function() {
                if (_timestamp == 0) {
                    _timestamp = Date.parse(centerDate);
                }
                curDate = new Date(_timestamp);
                _hour = curDate.getHours();
                _minutes = curDate.getMinutes();
                _seconds = curDate.getSeconds();
                _days = curDate.getDay();
				var dateweek = " ";
				switch(_days)
				{
					case 0:dateweek += "星期日";break;
					case 1:dateweek += "星期一";break;
					case 2:dateweek += "星期二";break;
					case 3:dateweek += "星期三";break;
					case 4:dateweek += "星期四";break;
					case 5:dateweek += "星期五";break;
					case 6:dateweek += "星期六";break;
				}
                if (_hour < 10) {
                    _hour = "0" + _hour;
                }
                if (_minutes < 10) {
                    _minutes = "0" + _minutes;
                }
                if (_seconds < 10) {
                    _seconds = "0" + _seconds;
                }
                $("#currentTimeTop").html(curDate.getFullYear() + '年' + (curDate.getMonth() + 1) + '月' + curDate.getDate() + '日' + '&nbsp;&nbsp;' + curDate.getHours() + ":" + _minutes + ":" + _seconds + dateweek);
                _timestamp += 1000;
			}, 1000);

			//TODO 加入角色分类
            // TODO 分类渲染标签事件
            // TODO 加入ss存储

		}
	});
	// 加载年度、区划信息
	$.get("/df/portal/getYearRgcode.do?tokenid=before", function(data) {
		rgset_relation = data.rgset_relation; // map
		rg_code = data.rg_code;
		set_year = data.set_year;
		var rg_codeHtml = "";
		var year_codeHtml = "";
		// <option value="2017" selected="selected">2017</option>
		for ( var i in rg_code) {
			rg_codeHtml += '<option value="' + rg_code[i].chr_code + '">' + rg_code[i].chr_name + '</option>';
		}
		for ( var i in set_year) {
			year_codeHtml += '<option value="' + set_year[i] + '">' + set_year[i] + '</option>';
		}
		$("#rgCode").html(rg_codeHtml);
		$("#setYear").html(year_codeHtml);
	});

	/**
	 * 切换年度区划保存事件
	 */
	$("#changeRg").on("click", function() {

		var setYear = $("#setYear").val();
		var rgCode = $("#rgCode").val();

		$.ajax({
			url : "/df/login/changeProvince.do",
			type : 'GET',
			data : {
				"tokenid" : getTokenId(),
				"setYear" : setYear,
				"rgCode" : rgCode
			},
			dataType : 'json',
			success : function(data) {
				if (data.result != '1') {
					alert(data.result);
					return;
				}
				var flag = data.flag;
				var tokenId = data.tokenid;
				if (flag == "1") {
					// dfp_util.cookie.set("yysdczuname", $("#username").val(),
					// 7 * 24 * 60 * 60 * 1000);
					sessionStorage.setItem("select_agency_code", "");
					sessionStorage.setItem("select_role_guid", "");
					sessionStorage.setItem("tokenid", tokenId);
					localStorage.setItem("tokenid", tokenId);
					// window.location.href="/df/portal/admin/index/index.html?tokenid="+tokenId;
					// window.location.href="/df/portal/admin/index/index.html";
					window.location.href = "/df/portal/login/flogin.html";
					sessionStorage.setItem('menuType', data.menuType)
				} else
					window.location.href = "/df/portal/login/flogin.html";
			}
		});
	});

	/**
	 * 退出
	 */
	$("#logoutBtn").on("click", function() {
		layer.confirm('是否确认退出？', {
			title : '退出提示',
			btn : [ '退出', '取消' ]
		// 按钮
		}, function() {
			logout();
		}, function() {
			layer.closeAll();
		});

	});

	/**
	 * 检测可用IP
	 */
	dfp.ping();

	/**
	 * 显示当前用户可用系统图标
	 */
//	$.ajax({
//		url: "/df/portal/userSystemCheck.do",
//		type: "GET",
//		data: {tokenid: getTokenId()},
//		dataType: "json",
//		success: function(data) {
//			var flag = system.flag;
//			if (flag == '-1') {
//			    // 全部显示
//				$(".openSystem").each(function() {
//					$(this).css("display", "block");
//					$(this).on("click", function () {
//                        openSystemButtonClick($(this).attr(id));
//                    });
//				});
//            } else {
//			    // 显示指定系统模块
//                var systems = data.system;
//                for(var i in systems) {
//                	if (!systems.hasOwnProperty(i)) continue;
//                	var id = systems[i] + "button";
//                	$("#" + id).on("click", function() {
//                	    $(this).css("display", "block");
//                        openSystemButtonClick(id);
//                    });
//                }
//            }
//
//		},
//        error: function () {
//        }
//	});
    
	dfpArticle.show3(2, 'm-content', 'JB');

});

function getTokenId() {
	return sessionStorage.getItem("tokenid");
}
// 退出
function logout() {
	var tokenId = getTokenId();
	// 清空当次访问产生的页面临时数据
	sessionStorage.tokenid = "";
	sessionStorage.select_role_guid = "";
	sessionStorage.select_agency_code = "";
	sessionStorage.dfp_menu_lv3 = "";
	sessionStorage.dfp_menu_all = "";
	sessionStorage.commonData = "";
	sessionStorage.portal_ip_ping_0 = "";

	$.ajax({
		url : "/df/login/loginout.do",
		type : "GET",
		data : {
			"tokenid" : tokenId
		},
		dataType : "json",
		success : function(data) {
			var flag = data.flag;
			if (flag == 1) {
				window.location.href = "/df/portal/login/login.html";
			}
		}
	});
}

// 获取用户信息
function getUserInfo() {
	var tokenId = getTokenId();
	$.ajax({
		url : "/df/portal/getUserInfo.do",
		type : "GET",
		data : {
			"tokenid" : tokenId
		},
		dataType : "json",
		async : false,
		success : function(data) {
			svUserCode = data.svUserCode;
		}
	});
};

function getzctask() {
	var tokenid = sessionStorage.getItem("tokenid");
	var webserviceUrl = "http://192.168.10.28:8888/sdgp2017/ws/SDZFCGServices?wsdl";
	$.ajax({
		url : "/df/portal/getZCTask.do",
		type : 'GET',
		data : {
			"ajax" : "ajax",
			"tokenid" : tokenid,
			"userid" : svUserCode,
			"url" : webserviceUrl
		},
		dataType : 'json',
		success : function(data) {
			// 政采待办处理。。。
			var taskList = data.taskList;

		}
	})
}