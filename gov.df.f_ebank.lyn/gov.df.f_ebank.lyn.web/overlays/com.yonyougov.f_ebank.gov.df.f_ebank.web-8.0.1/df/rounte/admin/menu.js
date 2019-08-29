﻿﻿﻿﻿require(['knockout','text!pages/common/template/homePage.html','director','jquery','bootstrap','uui','tree','ip'], function(ko,homePage) {
 	window.ko = ko;
 	var menuObj,
 	menuTreeData,
 	comMenuList,
 	topMenuPanel = [],
	roleList = roleList || {},
	centerDate; 
    var menuDetailHtmlJson = {};
    var menuImgJson = {"授权额度管理":"./static/icon-cha.png","直接支付":"./static/icon-ban2.png","授权支付":"./static/icon-wen.png",
    		"直接支付清算":"./static/icon-deng.png","授权支付清算":"./static/icon-wen.png",
    		"常用报表":"./static/icon-bao.png"};
	//初始化首页（顶部用户、角色、时间等、左侧菜单，主内容部分）
	var index_page = {
		init : function(){
			var caroleguid = sessionStorage.select_role_guid == undefined ? ""
					: sessionStorage.select_role_guid, 
			agencyCode = sessionStorage.select_agency_code == undefined ? ""
					: sessionStorage.select_agency_code;
			if (!sessionStorage.tokenid) {
				window.location.href = "/df/portal/login/login.html";
				return false;
			}
			$.ajax({
				url : "/df/portal/initIndex.do",
				type : "GET",
				cache:false,
				data : {"tokenid":portal.common_util.getTokenId(), "caroleguid":Base64.encode(caroleguid), "agencyCode":Base64.encode(agencyCode)},
				dataType : "json",
				success : function(data){
					portal.sys_user_info.setHiddenLabel(data.publicParam);
					portal.sys_user_info.saveInSessionStorage(data.publicParam);
					// 用户名
	            	$("#usernameTop").html(data.publicParam.svUserName);
	            	// 角色
	            	portal.role.show(data.roleList);
	            	// 时间
	            	portal.common_util.setTopTime();
	            	portal.common_util.checkLicense(data.publicParam.svUserId);
	            	// 显示菜单
	            	portal.menu.show();
	            	var menuname = sessionStorage.getItem("menuname");
	            	if(menuname == null || menuname == ""){
	            		$("#content").html(homePage);
						var isIE = navigator.userAgent.indexOf('MSIE') != -1;
						if(isIE){
							$(".center-box").css("height",$(".wrapper").height()-46+"px");
						};
	            		var boxContent = $(".box-content");
	            		for(var i=0,len=boxContent.length;i<len;i++){
	            			var curBoxContent = $(".box-content").eq(i);
	            			var curBoxHeight = curBoxContent.parent().innerHeight() - 35 + "px";
	            			curBoxContent.css("height",curBoxHeight);
	            		};
	            		index_content.setDealList();
	            		index_content.initCommonUsedMenu();
	            		index_content.initStatusList("5201");
	            		index_content.initVouResultPie();
	            		index_content.eventListener();
	            	}
	            	$(window).resize(function(){
	    				var boxContent = $(".box-content");
	            		for(var i=0,len=boxContent.length;i<len;i++){
	            			var curBoxContent = $(".box-content").eq(i);
	            			var curBoxHeight = curBoxContent.parent().innerHeight() - 35 + "px";
	            			curBoxContent.css("height",curBoxHeight);
	            		};
	    			}); 
	            	// 页面头部用户下拉和退出系统事假绑定
	            	portal.user.eventListener();
				},
				complete :function(XHR){
					//系统授权类型
					var type = XHR.getResponseHeader('x_check_license_type');
					//如果授权类型获取不到说明未注册，直接return
					if(type==null||type =='-1'){
						return;
					}
					//演示版
					if(type==0){						
						$('#license').html('演示版');
					}
				},
				error:function (data) {
					window.location.href = "/df/portal/portalManager/login/relogin.html";
				}
			});
		}
	};
	
	// 保存系统及用户信息
	var sys_user_info = {
		// 将用户及系统信息（用户、角色、年度、区划等）保存在页面隐藏的表单中
		setHiddenLabel : function(data){
			$("#svRgCode").val(Base64.encode(data.svRgCode));// 区划CODE
			$("#svSetYear").val(Base64.encode(data.svSetYear)); // 年度
			$("#svRoleCode").val(Base64.encode(data.svRoleCode)); // 角色CODE
			$("#svRoleId").val(Base64.encode(data.svRoleId)); // 角色ID
			$("#svRoleName").val(Base64.encode(data.svRoleName)); // 角色名称
			$("#svUserCode").val(Base64.encode(data.svUserCode)); // 用户CODE
			$("#svUserId").val(Base64.encode(data.svUserId)); // 用户ID
			$("#svUserName").val(Base64.encode(data.svUserName)); // 用户名称
			$("#svUserType").val(Base64.encode(data.svUserType)); // 用户类型
			$("#svTransDate").val(Base64.encode(data.svTransDate));// 业务日期
			$("#svBelongOrg").val(Base64.encode(data.svBelongOrg)); // 所属机构
		},
		// 将用户及系统信息写到sessionStorage
		saveInSessionStorage : function(data){
			sessionStorage.select_role_guid = Base64.decode($("#svRoleId").val());
			sessionStorage.select_agency_code = Base64.decode($("#svAgencyCode").val());
			sessionStorage.commonData = JSON.stringify(data);
		}
	};
	
	// 公共方法
	var common_util = {
		isUserManager : false,
		// 获取tokenid 
		getTokenId : function(){
			return sessionStorage.getItem("tokenid");
		},
		// 设置顶部系统时间
		setTopTime : function(){
			var _xx = setInterval(function() {
				var _timestamp = Date.parse(centerDate);
			    _timestamp = _timestamp.toString().match(/^\d$/)?_timestamp:new Date().getTime();
				var curDate = new Date(_timestamp);
				var _hour = curDate.getHours();
				var _minutes = curDate.getMinutes();
				var _seconds = curDate.getSeconds();
				if (_hour < 10) {
					_hour = "0" + _hour;
				}
				if (_minutes < 10) {
					_minutes = "0" + _minutes;
				}
				if (_seconds < 10) {
					_seconds = "0" + _seconds;
				}
				$("#time").html(curDate.getFullYear() + '年' + (curDate.getMonth() + 1) + '月' + curDate.getDate() +
						'日' + '&nbsp;&nbsp;' + curDate.getHours() + ":" + _minutes + ":" + _seconds);
				centerDate += 1000;
			}, 1000);
		},
		checkIsUserManager : function(userId){
			var params = {};
		    params['ruleID'] = 'portal-df-user.getUserInfoByUserId';
		    params['userId'] = userId;
		    params['start'] = '0';
		    params['limit'] = '1';
		    $.ajax({
		        url : "/portal/GetPageJsonData.do?tokenid=" + portal.common_util.getTokenId(),
		        type : "GET",
		        dataType : "json",
		        async : false,
		        data : params,
		        success : function(data) {
		            var result = data[0];
		            var userType = result.belong_type;
		            if(userType == '001'){
		                this.isUserManager = true;
		            }
		        }
		    });
		},
		checkIsValidate : function(dateTime,endTime){
		    if(endTime > dateTime || endTime == dateTime){
		        return true;
		    }else{
		    	return false;
		    }
		},
		judgeTimeDiffer : function(startTime,endTime) {
		    return parseInt(( endTime -startTime) / 1000 / 60 / 60 / 24 );
		},
		checkLicense : function(userId){
			this.checkIsUserManager(userId);
			 //系统授权类型
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
		        difDay = this.judgeTimeDiffer(dateTime,endTime);
		    }else{
		        return;
		    }
		    //只要有一个参数没有值，暂不作处理
		    if(type == null || type == '-1'|| endTime == null || endDate == null || checkStatus == null ){
		        return;
		    }
		    var statusMes = '';
		    if(checkStatus < 0){
		        statusMes ='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;授权超限';
		    }
		    //是否过期
		    var isValidate = this.checkIsValidate(dateTime,endTime);
		    if(!this.isUserManager){
		        if(type == 0){
		            $('#license').html('演示版');
		        }
		    }else{
		        //演示版
		        if(type==0){
		            if(difDay==0&&!isValidate){
		                $('#license').html('演示版 授权已过期'+statusMes);
		            }else if(difDay<0 ){
		                $('#license').html('演示版 授权已过期'+statusMes);
		            }else if(difDay>-1 && difDay<30){
		                $('#license').html('演示版 授权还有'+(difDay+1)+'天过期，有效期截止到: '+endDate+statusMes);
		            }else{
		                $('#license').html('演示版'+statusMes);
		            }

		        }else if(type==1){
		            //正式版
		            if(difDay>-1 && difDay<30 && isValidate){
		                $('#license').html('授权还有:'+(difDay+1)+'天过期,有效期截止到: '+endDate+statusMes);
		            }else if((difDay ==0 && (difDay >((-6*30)-1)))&& !isValidate){
		                var validateDateTime = endTime+179*24*60*60*1000;
		                validateDateTime = new Date(validateDateTime);
		                var validateDate = validateDateTime.getFullYear()+'-'+(validateDateTime.getMonth()+1)+'-'+validateDateTime.getDate();
		                $('#license').html('授权已过期,在 '+validateDate+' 后将无法登录系统，请尽快更新授权有效期'+statusMes);
		            }else if((difDay <0 && (difDay >((-6*30)-1)))&& !isValidate){
		                var validateDateTime = endTime+179*24*60*60*1000;
		                validateDateTime = new Date(validateDateTime);
		                var validateDate = validateDateTime.getFullYear()+'-'+(validateDateTime.getMonth()+1)+'-'+validateDateTime.getDate();
		                $('#license').html('授权已过期,在 '+validateDate+' 后将无法登录系统，请尽快更新授权有效期'+statusMes);
		            }else {
		                $('#license').html(statusMes);
		            }
		        }
		    }
		},
		// 菜单url加tokenid
		addTokenidToUrl : function(url, param) {
			if(param == "" || param == null || param == undefined)
				param = "_x=1";
			url = url.replace(/\s/g, ""); // 去除全部空格
			if(url.indexOf("?") > -1)
				url = url + "&" + param;
			if(url.indexOf("?") < 0)
				url = url + "?" + param;
			return url + "&tokenid=" + portal.common_util.getTokenId();
		}, 
		// 去掉字符串中的数字
		removeNumFromStr : function(str) {
			str = str.replace(/^[\d]+/g, "");
			str = str.replace(/(^\s*)|(\s*$)/g, "");
			return str;
		},
		space : {
			// 去除全部空格
			removeAll : function(str) {
				return str.replace(/\s/g, "");
			}
		},
		num : {
			 //去除全部数字
			removeAll : function(str) {
				return str.replace(/^[\d]+/g, "");
			}
		},
		// 判断单个变量是否为空
		isNull : function(param) {
			if(!param){
				return true;
			}
		},
	}
	// 用户管理
	var user_manage = {
		eventListener : function() {
			// 点击用户名事件
			$("#userSettingLi").click(function(e){
				var $div = $("#userSettingDiv"),
					display = $div.css("display");
				display == "block" ? $div.hide() : $div.show();
				e = e || event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			});
			$("#userSettingLi,#userSettingDiv").mouseleave(function(e){
				$("#userSettingDiv").hide();
				e = e || event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			});
			// 点击修改密码事件
			$("#userSetting").click(function(e){
	        	var e = e || window.event;
	        	var target = e.target || e.srcElement;
	        	if(target.nodeName.toLowerCase() == "li"){
	        		//弹出修改密码模态框
	        		$("#changePwdModal").modal("show");
	        	}
	        });
			// 修改密码提交事件
			$("#newPwdSubmitBtn").click(function(){
				var originPwd = $("#originPwd").val();
				var newPwd = $("#newPwd").val();
				var confirmNewPwd = $("#confirmNewPwd").val();
				if(newPwd != confirmNewPwd){
					alert("两次输入的新密码不同！");
					return;
				}
				var originPwd_md5 = hex_md5(originPwd);
				$.ajax({
					url:"/df/portal/chengepwd.do",
					type:"POST",
					dataType:"json",
					data:{
						"ajax" : "ajax",
						"tokenid" : portal.common_util.getTokenId(),
						"oldpasswd" : hex_md5(originPwd),
						"passwd" : hex_md5(newPwd),
						"passwd2" : hex_md5(confirmNewPwd),
						"setYear" : $("#svSetYear").val()
					},
					success:function(data){
						if(data.msg == "原始密码输入错误"){
							alert("原始密码输入错误！");
						}else{
							layer.confirm('密码修改成功,请重新登录！', {
									title : '提示',
									btn : [ '登录'] //按钮
							}, function() {
								portal.user._logout();
							});
						}
					}
				});
			});
			// 退出事件
			$("#logoutLi").click(function(){
				ip.warnJumpMsg("是否确认退出？","logoutId", "cCla");
				$("#logoutId").on("click", function() {
					portal.user._logout();
				});
				$(".cCla").on("click", function() {
					$("#config-modal").remove();
				});

				// layer.confirm('是否确认退出？', {
				// 	title : '退出提示',
				// 	btn : [ '退出', '取消' ] //按钮
				// }, function() {
				// 	portal.user._logout();
				// }, function() {
				// 	layer.closeAll();
				// });
			});
		},
		// 退出系统方法
		_logout : function(){
			var tokenId = portal.common_util.getTokenId();
			// 清空当次访问产生的页面临时数据
			sessionStorage.tokenid = "";
			sessionStorage.select_role_guid = "";
			sessionStorage.select_agency_code = "";
			sessionStorage.commonData = "";
			sessionStorage.setItem("menuname","");
			$.ajax({
				url : "/df/login/loginout.do",
				type : "GET",
				data : {"tokenid":tokenId},
				dataType : "json",
				success : function(data){
					var flag = data.flag;
					if(flag == 1){
						window.location.href = "/df/portal/login/login.html";
					}
				}
			});
		}
	};
	// 角色管理
	var role_manage = {
	    eventListener: function () {
	    	// 点击角色名事件
	        $("#switchRoleLi").click(function (e) {
	            var $div = $(this).find("div#roleSwitchDiv");
	            display = $div.css("display");
	            if (display == "block") {
	                $div.hide();
	            } else {
	                $div.show();
	            }
	            e = e || event;
	            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	        });
	        $("#roleSwitchDiv, #switchRoleLi").mouseleave(function (e) {
	            $("#roleSwitchDiv").hide();
	            e = e || event;
	            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
	        });
	        // 切换角色事件
	        $("#roleSwitch").on("click",function(e){
	        	var e = e || window.event;
	        	var target = e.target || e.srcElement;
	        	if(target.nodeName.toLowerCase() == "li"){
	        		portal.role._switch(target.id);
	        	}
	        });
	    },
	    // 角色和角色下拉框内容添加到HTML中
	    show: function (roleList) {
	        $("#roleSwitch").html("");
	        var roleHtml = "",
	            tempWidth = 0,
	            roleSwitchDivWidth = 190; // 角色下拉框默认宽度
	        var select_role_guid = sessionStorage.select_role_guid || "";
	        for (var i in roleList) {
	            if (!roleList.hasOwnProperty(i)) {
	                continue;
	            }
	            roleSwitchDivWidth = (tempWidth = roleList[i].role_NAME.length * 13) > roleSwitchDivWidth ? tempWidth : roleSwitchDivWidth;
	            var role_id = roleList[i].role_ID;
	            var role_name = portal.common_util.space.removeAll(portal.common_util.num.removeAll((roleList[i]).role_NAME));
	            if(select_role_guid == roleList[i].role_ID){
	            	roleHtml += '<li class="curRole" id="' + role_id + '">✔ ' + role_name + '</li>';
	            }else{
	            	roleHtml += '<li id="' + role_id + '">' + role_name + '</li>';
	            }
	        }
	        $("#roleSwitch").html(roleHtml);
	        //切换角色改为显示当前登录角色
	        var currentRole = $("li.curRole").text().split(" ")[1];
	        $("#rolenameTop").html(currentRole);
	        $("#roleSwitchDiv").css("width", roleSwitchDivWidth + "px");
	        if (roleList != null && roleList.length == 1) {
	            $("#switchRoleLi").css("display", "none");
	        }
	        this.eventListener();
	    },
	    // 切换角色事件
	    _switch: function (roleid) {
	        if (roleid == Base64.decode($("#svRoleId").val())) {
	            return;
	        }
	        $.ajax({
	            url: "/df/portal/switchRoleConfirm.do",
	            type: "GET",
	            data: {
	            	"tokenid": portal.common_util.getTokenId(), 
	            	"roleid": roleid,
	            	"userSysId": sessionStorage.getItem("select_role_user_sys_id")
	            },
	            dataType: "json",
	            success: function (data) {
	                sessionStorage.setItem("select_role_guid", roleid);
	                sessionStorage.setItem("tokenid", data.tokenid);
	                window.location.reload();
	            }
	        });
	    }
	};
	
	// 系统菜单管理
	var sys_menu = {
		eventListener : function(){
			//点击待办事项事件处理函数
			$("#dealSpan").on("click",function(){
				sessionStorage.setItem("menuname","");
		      	window.location.href = "/df/rounte/admin/index.html";
			});
		},
		// 分类菜单
		_classifyMenu : function(menuList){
			menuObj = {
				firstLevelMenuList : new Array(),
				secondLeveMenuList : new Array(),
				thirdLevelMenuList : new Array(),
				fourthLevelMenuList : new Array(),
				fivthLevelMenuList : new Array()
			};
			var n1 = 0;
			var n2 = 0;
			var n3 = 0;
			var n4 = 0;
			var n5 = 0;
			var baseNo = 1;
			for (var i = 0; i < menuList.length; i++){
				if(menuList[i].levelno == baseNo){
					menuObj.firstLevelMenuList[n1] = menuList[i];
					n1++;
				}else if(menuList[i].levelno == baseNo+1){
					menuObj.secondLeveMenuList[n2] = menuList[i];
					n2++;
				}else if(menuList[i].levelno == baseNo+2){
					menuObj.thirdLevelMenuList[n3] = menuList[i];
					n3++;
				}else if(menuList[i].levelno == baseNo+3){
					menuObj.fourthLevelMenuList[n4] = menuList[i];
					n4++;
				}else if(menuList[i].levelno == baseNo+4){
					menuObj.fivthLevelMenuList[n5] = menuList[i];
					n5++;
				}
				
			}
			return menuObj;
		},
		// 一级菜单放到id=firstLevelList的div中，二三级菜单放到id=Z_SubList1的div中
		setMenuHtml : function(){
			var menuType = sessionStorage.getItem('menuType');
			var firstLevelMenuList = menuObj.firstLevelMenuList;
	    	var secondLeveMenuList = menuObj.secondLeveMenuList;
	    	var thirdLevelMenuList = menuObj.thirdLevelMenuList;
	    	var menuListHtml = '<li class="list-item0 ">';
	    	menuListHtml += '<a>';
	    	menuListHtml += '<i class="icon glyphicon glyphicon-home" style="color:#d0cfcf;"></i>';
	    	menuListHtml += '<span id="dealSpan">首页</span>';
			menuListHtml += '</a></li>';
			
	    	var _tokenid = "";
	    	var firstLevelMenuListLength = portal.common_util.isNull(firstLevelMenuList) ? 0 : firstLevelMenuList.length;
	    	var directPayHtml = '';
			var authPayHtml = '';
			var directPayClearHtml = '';
			var authPayClearHtml = '';
			var authLimitHtml = '';
			var reportHtml = '';
	    	// 一级菜单
	    	for (var i=0; i<firstLevelMenuListLength; i++){
	    		var menuFirstLevelListName = portal.common_util.removeNumFromStr(firstLevelMenuList[i].name);
	    		// 判断页面顶部常用操作有几个模块
	    		menuListHtml += '<li class="list-item' + (i+1);
	    		menuListHtml += ' ">';
	    		menuListHtml += '<a href="javascript:void(0);">';
	    		menuListHtml += '<i class="icon glyphicon glyphicon-leaf" style="color:#d0cfcf;"></i>';
	    		menuListHtml += '<span>' + menuFirstLevelListName + 
	    		'</span><span class="pull-right-container"><i class="glyphicon glyphicon-menu-right pull-right" style="font-size:12px;top:-3px;"></i></span></a></li>';

				var menuHtml = "";
				menuHtml += '<div class="subView"><section class="two-level"><section class="two-level-l">';
				for (var j in secondLeveMenuList){
					if(secondLeveMenuList[j].parentid == null || secondLeveMenuList[j].parentid == ""
							|| secondLeveMenuList[j].parentid != firstLevelMenuList[i].guid){
						continue;
					}
					
					var secondLeveMenuListName = portal.common_util.removeNumFromStr(secondLeveMenuList[j].name);
					menuHtml += '<dl class="two-level-item">';
					menuHtml += '<dt class="two-level-tit">';
					menuHtml += secondLeveMenuListName + '&nbsp;&nbsp;';
					menuHtml += '<i class="glyphicon glyphicon-menu-right pull-right" style="font-size:12px;top:4px;"></i></dt>';
					menuHtml += '<dd class="two-level-detail">';
					
					var directStrIndex = secondLeveMenuListName.indexOf("直接支付");
					var authStrIndex = secondLeveMenuListName.indexOf("授权支付");
					if(directStrIndex > -1 && menuFirstLevelListName == "柜面业务"){
						topMenuPanel.push("直接支付");
					}else if(authStrIndex > -1 && menuFirstLevelListName == "柜面业务"){
						topMenuPanel.push("授权支付");
					}else if(directStrIndex > -1 && menuFirstLevelListName == "资金清算"){
						topMenuPanel.push("直接支付清算");
					}else if(authStrIndex > -1 && menuFirstLevelListName == "资金清算"){
						topMenuPanel.push("授权支付清算");
					}else if(secondLeveMenuListName.indexOf("授权额度管理") > -1){
						topMenuPanel.push("授权额度管理");
					}else if(secondLeveMenuListName.indexOf("报表") > -1){
						topMenuPanel.push("常用报表");
					}
					// 三级菜单
					for (var k in thirdLevelMenuList){
						if(thirdLevelMenuList[k].parentid == null || thirdLevelMenuList[k].parentid == ""
							|| thirdLevelMenuList[k].parentid != secondLeveMenuList[j].guid){
							continue;
						}
						
						var _url = thirdLevelMenuList[k].url;
						if(_url == null || _url == "" || _url == undefined){
							_url = "";
						}else{
							_url = portal.common_util.removeNumFromStr(thirdLevelMenuList[k].url);
						}
						_url += (_url.indexOf("?") != -1 ? "&tokenid=" : "?tokenid=") + portal.common_util.getTokenId();
						var menuThirdLevelListName = portal.common_util.removeNumFromStr(thirdLevelMenuList[k].name);
						_url += '&menuid='+thirdLevelMenuList[k].guid+'&menuname='+encodeURI(menuThirdLevelListName);
						var r_url = _url.split(".");
						var	R_url = r_url[0].substring(12);

						var routerPath = thirdLevelMenuList[k].guid+"/"+R_url;
						addRouter(routerPath);
						menuHtml += '<a class="_portal_recent_menu_add_a" id="' + routerPath +'"  name ="' + _url + 
						'" href="javascript:void(0);" data-singleid="' + _url + '" onclick="RounterCheck(this);">'+menuThirdLevelListName+'</a>';
						
						var directStrIndex = secondLeveMenuListName.indexOf("直接支付");
						var authStrIndex = secondLeveMenuListName.indexOf("授权支付");
						if(directStrIndex > -1 && menuFirstLevelListName == "柜面业务"){
							directPayHtml += '<li class="common-detail-menu"><a class="_portal_recent_menu_add_a" id="' + routerPath +'"  name ="' + _url + 
							'" href="javascript:void(0);" data-singleid="' + _url + '">'+menuThirdLevelListName+'</a></li>';
						}else if(authStrIndex > -1 && menuFirstLevelListName == "柜面业务"){
							authPayHtml += '<li class="common-detail-menu"><a class="_portal_recent_menu_add_a" id="' + routerPath +'"  name ="' + _url + 
							'" href="javascript:void(0);" data-singleid="' + _url + '">'+menuThirdLevelListName+'</a></li>';
						}else if(directStrIndex > -1 && menuFirstLevelListName == "资金清算"){
							directPayClearHtml += '<li class="common-detail-menu"><a class="_portal_recent_menu_add_a" id="' + routerPath +'"  name ="' + _url + 
							'" href="javascript:void(0);" data-singleid="' + _url + '">'+menuThirdLevelListName+'</a></li>';
						}else if(authStrIndex > -1 && menuFirstLevelListName == "资金清算"){
							authPayClearHtml += '<li class="common-detail-menu"><a class="_portal_recent_menu_add_a" id="' + routerPath +'"  name ="' + _url + 
							'" href="javascript:void(0);" data-singleid="' + _url + '">'+menuThirdLevelListName+'</a></li>';
						}else if(secondLeveMenuListName.indexOf("授权额度管理") > -1){
							authLimitHtml += '<li class="common-detail-menu"><a class="_portal_recent_menu_add_a" id="' + routerPath +'"  name ="' + _url + 
							'" href="javascript:void(0);" data-singleid="' + _url + '">'+menuThirdLevelListName+'</a></li>';
						}else if(secondLeveMenuListName.indexOf("报表") > -1){
							reportHtml += '<li class="common-detail-menu"><a class="_portal_recent_menu_add_a" id="' + routerPath +'"  name ="' + _url + 
							'" href="javascript:void(0);" data-singleid="' + _url + '">'+menuThirdLevelListName+'</a></li>';
						}
						
					}
					menuHtml += '</dd></dl>';
				}
				menuHtml += '</section></section></div>';
				/*$("#menuPanel").append(directPayHtml);
				$("#menuPanel").append(authPayHtml);
				$("#menuPanel").append(directPayClearHtml);
				$("#menuPanel").append(authPayClearHtml);
				$("#menuPanel").append(otherHtml);*/
	            if(menuType == 0){
	            	$("#Z_SubList1").append(menuHtml);
	            }
			}
	    	menuDetailHtmlJson = {"直接支付":directPayHtml,"授权支付":authPayHtml,
    	    		"直接支付清算":directPayClearHtml,"授权支付清算":authPayClearHtml,
    	    		"授权额度管理":authLimitHtml,"常用报表":reportHtml};
            if(menuType == 0){
            	$("#firstLevelList").append(menuListHtml);
            }
            //菜单全部渲染到页面之后绑定事件
            this.eventListener();
		},
		// 显示菜单
		show : function(){
			var caroleguid = sessionStorage.select_role_guid==undefined?"":sessionStorage.select_role_guid;
			$.ajax({
				url : "/df/portal/getMenuByRole.do",
				type : "GET",
				data : {"tokenid":portal.common_util.getTokenId(), "caroleguid":Base64.encode(caroleguid)},
				dataType : "json",
				success : function(data){
					menuTreeData = data.mapMenu;
					menuTreeData = menuTreeData.slice(1);
					sys_menu._classifyMenu(data.mapMenu);
					sys_menu.setMenuHtml();
					index_content.initTopMenuChunk();
					initPage();
					//增加折叠菜单
					var menuType = sessionStorage.getItem('menuType');
					// menuType为1时, 菜单栏更换为树的形式
	                if(menuType == 1){
	                	window.createSideBar({selector: '#firstLevelList',data: data.mapMenu,tokenid: portal.common_util.getTokenId()});
	                } 
				}
			});
		}
	};
	// 首页管理
	var index_content = {
		eventListener : function(){
			
			$("#refreshDeal").on("click",function(){
				index_content.setDealList();
			});
			$('#statusTabs a').click(function (e) {
				e = e || window.event;
				e.preventDefault();
				e.returnValue = false;
				var target = e.target || e.srcElement;
				var vt_code = target.hash.replace(/[^0-9]/ig,"");
				index_content.initStatusList(vt_code);
			});
			$("#menuSetting").on("click",function(){
				index_content.initMenuTree();
    			$("#menuSetModal").modal("show");
    		});
			$("#closeCommonMenu,#closeMenuCross").click(function(){
				$("#menuSetModal").modal("hide");
				index_content.initCommonUsedMenu();
			});
			$("#refreshPie").on("click",function(){
				index_content.initVouResultPie();
			});
		},
		// 初始化页面顶部常用操作模块
		initTopMenuChunk : function(){
		    var uniqueTopMenu = [topMenuPanel[0]]; //一个新的临时数组
		    for(var i = 0; i < topMenuPanel.length; i++){
		        if(uniqueTopMenu.indexOf(topMenuPanel[i]) == -1){
		        	uniqueTopMenu.push(topMenuPanel[i]);
		        }
		    }
		    //下面两类需要显示在最后面
//		    uniqueTopMenu.push("授权额度管理");
//		    uniqueTopMenu.push("常用报表");
//			var colNum = Math.floor(12/uniqueTopMenu.length);    
			$(".common-used-menu").html("");
			var topMenuHtml = '';
			for(var i=0;i<uniqueTopMenu.length;i++){
				if(i == uniqueTopMenu.length-1){
					topMenuHtml += '<li class="col-lg-2 col-md-2 col-sm-2 common-used-item last-used-item">' +
					'<a class="used-item-link" href="javascript:;"><img class="menu-img" src="' + menuImgJson[uniqueTopMenu[i]]+ '">'+
					'<span style="color: rgb(0, 0, 0);">' + uniqueTopMenu[i] + '</span></a>';
				}else{
					topMenuHtml += '<li class="col-lg-2 col-md-2 col-sm-2 common-used-item">' +
					'<a class="used-item-link" href="javascript:;"><img class="menu-img" src="' + menuImgJson[uniqueTopMenu[i]]+ '">'+
					'<span style="color: rgb(0, 0, 0);">' + uniqueTopMenu[i] + '</span></a>';
				}
				topMenuHtml += '<div class="common-used-detail"><ul>' + 
				menuDetailHtmlJson[uniqueTopMenu[i]] + '</ul></div></li>';
			}
			$(".common-used-menu").html(topMenuHtml);
			$(".common-used-item").mouseover(function () {
	            $(this).css({"background": "#108EE9"});
	            var imgPath = $(this).find("a").find("img").prop("src");
	            if (imgPath.indexOf("ban") > 0) {
	                imgPath = "./static/icon-ban2-w.png";
	            }
	            if (imgPath.indexOf("deng") > 0) {
	                imgPath = "./static/icon-deng-w.png";
	            }
	            if (imgPath.indexOf("cha") > 0) {
	                imgPath = "./static/icon-cha-w.png";
	            }
	            if (imgPath.indexOf("wen") > 0) {
	                imgPath = "./static/icon-wen-w.png";
	            }
	            if (imgPath.indexOf("bao") > 0) {
	                imgPath = "./static/icon-bao-w.png";
	            }
	            $(this).find("a").find("img").prop("src", imgPath);
	            $(this).find("a").find("span").css("color", "#FFFFFF");
	            // $(this).find("div").css({"display": "block"});
				$(this).find("div").slideDown("fast");
	        }).mouseleave(function () {
	            $(this).css({"background": "#FFFFFF"});
	            var imgPath = $(this).find("a").find("img").prop("src");
	            if (imgPath.indexOf("ban") > 0) {
	                imgPath = "./static/icon-ban2.png";
	            }
	            if (imgPath.indexOf("deng") > 0) {
	                imgPath = "./static/icon-deng.png";
	            }
	            if (imgPath.indexOf("cha") > 0) {
	                imgPath = "./static/icon-cha.png";
	            }
	            if (imgPath.indexOf("wen") > 0) {
	                imgPath = "./static/icon-wen.png";
	            }
	            if (imgPath.indexOf("bao") > 0) {
	                imgPath = "./static/icon-bao.png";
	            }
	            $(this).find("a").find("img").prop("src", imgPath);
	            $(this).find("a").find("span").css("color", "#000000");
	            $(this).find("div").css({"display": "none"});
				// $(this).find("div").slideUp();
	        });
			$(".common-used-detail ul").click(function(e){
				var target = e.target || e.srcElement;
				routeHandler(target);
			});
		},
	    // 获取待办事项
	    setDealList : function(){
//	    	this.eventListener();
			var params = {
        			tokenid : portal.common_util.getTokenId(),
        			userid : $("#svUserId").val(),
        			roleid : $("#svRoleId").val(),
        			region : $("#svRgCode").val(),
        			year : $("#svSetYear").val()
        		};
        	$.ajax({
    			url : "/df/portal/getDealingThing.do",
    			type : "GET",
    			data : params,
    			dataType : "json",
    			async: false,
    			success : function(data){
    				var dealingThing = data.dealingThing;
    				var html = '<ul class="dealing" style="margin-top: 10px;margin-left: 34px;">';
            		for (var i = 0, len = dealingThing.length || 0; i < len; i++) {
            			var name = (dealingThing[i].menu_name).replace(/[\n]/g, "");
            			var url = portal.common_util.addTokenidToUrl(dealingThing[i].menu_url)+'&menuid=' + dealingThing[i].menu_id + '&menuname='+encodeURI(name);
            			var task = dealingThing[i].task_content;
            		    var taskWithRedNum = task.replace(/\d+/g, function(){return '<span class="color-red">'+arguments[0]+'</span>'});
            			var url_r = url.split(".");
						var	url_R = url_r[0].substring(12);
						var routerPath = dealingThing[i].menu_id + "/"+ url_R;
//             			html += '<li style="height: 30px;line-heightL 30px;list-style-type: square;color: #128FE9;" ><a style="color: #333;" href="#' +
//             			dealingThing[i].menu_id + "/" + url_R + '">'+ name +' &nbsp;&nbsp;</a><span style="color:red;">'+ task +'</span></li>';
						html += '<li class="deal-item"><a style="color: #333;" href="javascript:void(0);" id="' 
							+ routerPath +'"  name ="' + url + '">'
						+ name +'</a><span class="deal-status-num">'+ taskWithRedNum +'</span></li>';
					
            		}
    				html += '</ul>';
    				$("#dealList").html(html);
    				//事件委托形式写法，减少内存占用
    				$(".dealing").click(function(e){
    					var target = e.target || e.srcElement;
    					var menuLink = "";
    					if(target.nodeName.toLowerCase() == "a"){
    						menuLink = target;
    					}else if(target.nodeName.toLowerCase() == "span"){
    						menuLink = target.previousElementSibling;
    					}else{
    						menuLink = target.children[0]
    					}
    					routeHandler(menuLink);
    				});
    			}
    		});
	    },
		//初始化菜单树
		initMenuTree : function() {
			var menuTreeSetting = {
				view : {
					showLine : false,
					selectedMulti : true
				},
				data:{
					key:{
    					name:"menu_name",
    				},
	    			simpleData: {
	    				enable: true,
	    				idKey: "guid",
	    				pIdKey: "parentid",
	    				rootPId: null,
	    			}
	    		},
				callback : {
					onCheck : function(e, id, node) {
						var menuTreeObj = $.fn.zTree.getZTreeObj("menuTree");
						var checkedNodes = menuTreeObj.getCheckedNodes();
						if(checkedNodes.length > 6){
							ip.warnJumpMsg("常用菜单最多可设置6个！",0,0,true);
							node.checked = false;
							return;
						}
						var postData = ip.getCommonOptions({});
						postData["menu_id"] = node.guid;
						postData["menu_code"] = node.code;
						postData["menu_name"] = node.menu_name;
						postData["menu_url"] = node.url;
						postData["flag"] = node.checked;// true:则进行插入，false:则进行删除
						// 将获取的数据出入后台，存入数据库表
						$.ajax({
							url : "/df/f_ebank/homePortal/updateCommonMenu.do",
							type : "POST",
							dataType : "json",
							data : postData ,
							success : function(data) {
								if (data.result == "success") {
									// 保存后不进行任何操作
								} else {
									ip.warnJumpMsg("设置常用菜单失败！原因：" + data.reason,0,0,true);
								}
							}
						});
					},
					onClick:function(event){
						event.preventDefault(); 
					}
				},
				check : {
					enable : true,
					chkboxType : {
						"Y" : "",
						"N" : ""
					}
				}
    		
			};
			var menuTreeObj = $.fn.zTree.init($("#menuTree"), menuTreeSetting, menuTreeData);
			menuTreeObj.expandAll(true);
			menuTreeObj.cancelSelectedNode();
			var nodes = menuTreeObj.getNodes();
			// 将财政信息的checkbox消去
			// 将第一，二层的复选框去掉，只保留具体菜单复选框，因为最多只能选6个
			for ( var i = 0; i < nodes.length; i++) {
				nodes[i].nocheck = true;
				for(var j=0;j<nodes[i].children.length;j++){
					nodes[i].children[j].nocheck = true;
					menuTreeObj.updateNode(nodes[i].children[j]);
				}
				menuTreeObj.updateNode(nodes[i]);
			}
			//勾选已设置为常用菜单的菜单
			if(comMenuList.length > 0){
				for(var i=0;i<comMenuList.length;i++){
					var menuNode = menuTreeObj.getNodeByParam("guid",comMenuList[i].menu_id, null);
					if (menuNode != null) {
						menuTreeObj.checkNode(menuNode);
					}
				}
			}
		},
		// 初始化常用菜单
		initCommonUsedMenu : function () {
			var postData = ip.getCommonOptions({});
			$.ajax({
	    		url : "/df/f_ebank/homePortal/getAllCommonMenu.do",
				type : "GET",
				cache:false,
				data : postData,
				dataType : "json",
				success : function(data){
                  if(data.flag){
						comMenuList = data.result; //保存常用菜单数据，渲染菜单树勾选
						var commonMenuHtml = '';
						for(var i=0;i<comMenuList.length;i++){
							var menuData = comMenuList[i];
	            			var url = portal.common_util.addTokenidToUrl(menuData.menu_url) + 
	            			'&menuid=' + menuData.menu_id + '&menuname=' + encodeURI(menuData.menu_name);
	            			var url_r = url.split(".");
							var	url_R = url_r[0].substring(12);
							var routerPath = menuData.menu_id + "/"+ url_R;
							commonMenuHtml += '<button class="btn btn-primary common-menu-item" id="' +
							routerPath + '" name="' + url + '" onclick="RounterCheck(this);">'
								+ menuData.menu_name+'</button>'; 
						}
						$("#menuContent").html(commonMenuHtml);
	   	    	    }else{
		                ip.warnJumpMsg("查询常用菜单失败！",0,0,true);
		                return;
	   	    	    }
				}
			});
	    },
	    // 初始化状态列表
	    initStatusList : function(vt_code){
	    	var postData = ip.getCommonOptions({});
	    	postData["vt_code"] = vt_code;
	    	//查询凭证签收结果数据
	    	$.ajax({
	    		url : "/df/f_ebank/homePortal/queryDirectAccreditStatus.do",
				type : "GET",
				cache:false,
				dataType : "json",
				data : postData,
				success : function(data){
					if(data.flag){
						var statusData = data.resultList;
						for(var i=0;i<statusData.length;i++){
							var rowData = statusData[i];
							$("tr.status-row").eq(i).html('');
							var trData = '<td class="status-cell text-center">' + rowData[0] +
							'</td><td class="status-cell text-right">' + parseInt(rowData[1]) +
							'</span></td><td class="status-cell text-right">' + ip.dealThousands(parseFloat(rowData[2])) + '</td>';
							$("tr.status-row").eq(i).html(trData);
						}
					}else{
						ip.warnJumpMsg("查询状态列表失败！",0,0,true);
						return;
					}
				}
			});
	    },
	    // 初始化凭证签收结果饼图
	    initVouResultPie : function(){
	    	var options = {
	    	    title: {
	    	        floating:true,
	    	        text: '总共',
	    	    },
	    	    subtitle: { //图表副标题设置
		    		floating:true,
    		        text: '',
    		    },
    		    legend: {
	    			layout :'vertical',
	    			align: 'right',
	    			verticalAlign: 'top',
	    			symbolRadius: 0,
	    			x: 10,
	    			y: 20,
	    		},
	    	    tooltip: {
	    	        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
	    	    },
	    	    colors: ['#5BA7FC','#92D173','#FF6881'],//未签收：蓝色、已签收：绿色、签收失败：红色
	    	    
	    	    plotOptions: {
	    	        pie: {
	    	            allowPointSelect: true,
	    	            cursor: 'pointer',
	    	            dataLabels: {
	    	                enabled: true,
	    	                format: '{point.y}'+'笔',
	    	                distance: 8, // 数据标签与扇区距离
			                connectorPadding: 8,  // 数据标签与连接线的距离
	    	                style: {
	    	                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
	    	                }
	    	            },
	    	            showInLegend: true,
	    	            point: {
	    	                events: {
	    	                     click: function(e) { // 同样的可以在点击事件里处理
	    	                    	 var menuInfo = {
	    	                    		id : '119001011/voucherSignHandler/voucherSignHandler',
	    								name : '/df/f_ebank/voucherSignHandler/voucherSignHandler.html?menuid=119001011&menuname=%E7%94%B5%E5%AD%90%E5%87%AD%E8%AF%81%E7%AD%BE%E6%94%B6%E7%AE%A1%E7%90%86',
	    								innerHTML :'电子凭证签收管理',
	    	                    	 };
	    	                    	 routeHandler(menuInfo);
	    	                     }
	    	                }
	    	            },
	    	        }
	    	    },
	    	    series: [{
	    	        type: 'pie',
	    	        innerSize: '80%',
	    	        name: '占比',
	    	    }]
	    	};
	    	//查询凭证签收结果数据
	    	$.ajax({
	    		url : "/df/f_ebank/homePortal/queryVoucherSign.do",
				type : "GET",
				cache:false,
				dataType : "json",
				success : function(data){
					if(data.flag){
						var voucherUnSign = data.voucherUnSign;
						var voucherAlSign = data.voucherAlSign;
						var voucherFaiSign = data.voucherFaiSign;
						if(voucherUnSign == 0 & voucherAlSign == 0 & voucherFaiSign == 0){
							$("#voucherSignStats").html('<span class="pie-no-data">暂无数据</span>');
						}else{
							options.series[0]["data"] = [
//								{name: '未签收 ' +'\xa0\xa0\xa0\xa0'+ voucherUnSign + '笔', y: voucherUnSign}, 
//								{name: '已签收 ' +'\xa0\xa0\xa0\xa0'+ voucherAlSign + '笔', y: voucherAlSign}, 
//								{name: '签收失败 '+'\xa0' + voucherFaiSign + '笔', y: voucherFaiSign},
								{name: '未签收 ', y: voucherUnSign}, 
								{name: '已签收 ', y: voucherAlSign}, 
								{name: '签收失败 ', y: voucherFaiSign},
							];
							
							var voucherSum = data.voucherSum;
							// 图表初始化函数
					        voucherPie = Highcharts.chart('voucherSignStats',options, function(c) { // 图表初始化完毕后的会掉函数
					    	    // 环形图圆心
					    	    var centerY = c.series[0].center[1],
					    	        titleHeight = parseInt(c.title.styles.fontSize);
					    	    // 动态设置标题位置
					    	    c.setTitle({
					    	    	x:-87/2,
					        		y:centerY + titleHeight/2-10,
					        		text:"总共",
					        	});
					        	c.setSubtitle({
					        		x:-87/2,
					        		y:centerY + titleHeight/2+5,
					        		text:voucherSum + "笔",
					        	})
					    	});
						}
					}else{
						ip.warnJumpMsg("查询凭证签收结果失败！",0,0,true);
						return;
					}
				},
			});
	    },
	};
	// director.js 客户端路由初始化
	var router = Router();
	router.init();
	// 路由即时注册方法 
	function addRouter(path, func) {
        func = func || function() {
        	routeHandler(path);
        };
        var tmparray = path.split("/");
        if (tmparray[1] in router.routes && tmparray[2] in router.routes[tmparray[1]] && tmparray[3] in router.routes[tmparray[1]][tmparray[2]]) {
            return;
        } else {    
            router.on(path, func);
        }
    };
    // 菜单点击事件
    RounterCheck = function(_this) {
    	routeHandler(_this);
	}
    // 匹配路由成功后，需要执行的方法	
	function routeHandler(menuInfo) {
		$("#menuPanelModal").modal("hide");
        // ip.getUrlParameter方法需要
        sessionStorage.setItem("curUrl", menuInfo.name);
        // 前后台交互都需要菜单id和name信息，ip.js中需要
        sessionStorage.setItem("menuId", menuInfo.id.split("/")[0]);
        sessionStorage.setItem("menuname", menuInfo.innerHTML);
        sessionStorage.setItem("curMenuPatn", menuInfo.id);
        // 只有第一次访问页面用require加载模块，其他情况刷新页面
        var isCheckFirst = sessionStorage.getItem("isCheckFirst");
        $("#Z_SubList1").hide();
        if(isCheckFirst==null||isCheckFirst==1){
        	sessionStorage.setItem("isCheckFirst", "2");
        	initPage();
        }else{
        	window.location.reload();
        }
        
    };
    // 初始化业务页面函数，通过requirejs将业务模块引进来
	initPage = function(){
		var pagePath = sessionStorage.getItem("curMenuPatn");
		if(!pagePath){
			return;
		}
		var content = document.getElementById("content");
		var cutPos = pagePath.indexOf("/");
		var pathNoMenuId = pagePath.substring(cutPos);
	    var module = 'pages' + pathNoMenuId;
	    require([module], function(module) {
		     sessionStorage.setItem("curMenuPatn", '');
		     var menuname = sessionStorage.getItem("menuname");
		     ko.cleanNode(content);
		     content.innerHTML = "";
		     module.init(content,menuname);
		     $("#currentMenu").text(menuname);
		     // 页面初始化结束后将menuname清空，刷新页面时直接显示首页
		     sessionStorage.setItem("menuname", "");
		     if(navigator.userAgent.indexOf('MSIE') > -1){
		    	var configSearch = $(".config-search").length;
		    	var mainHeight = "400px";
		    	if(configSearch == 0){
		    		mainHeight = $(".container-fluid").innerHeight()-$(".config-btn").outerHeight()-10+"px"; 
		    		$(".config-main").css("height",mainHeight);
		    	}else{
		    		mainHeight = $(".container-fluid").innerHeight()-$(".config-btn").outerHeight()-$(".config-search").outerHeight()-16+"px";
		    		$(".config-main-hassearch").css("height",mainHeight);
		    	}
				
			}
	    });
	};
	//获取页面可见的模态框个数
	var getVisibleModalCount = function(){
		var visibleModalLen = 0;
    	var modalEleArr = $(".modal");
    	if(modalEleArr != null || modalEleArr != undefined){
    		for(var i=0;i<modalEleArr.length;i++){
    			if(modalEleArr[i].style.display == "block"){
    				visibleModalLen++;
    			}
        	}
    	}
    	return visibleModalLen;
    }
	
	//后弹出的modal层级永远最高
    $(document).on('show.bs.modal', '.modal', function() {
//        var zIndex = 1040 + (10 * $('.modal:visible').length);
    	//在合单规则配置，额度配置中用:visible无法获取显示的modal，暂用下面的方式代替
    	var visibleModalLen = getVisibleModalCount();
        var zIndex = 1040 + (10 * visibleModalLen);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
	});
    
    // 解决modal弹出框下，背景页面滚动和日期控件穿透问题
	$(document).on('shown.bs.modal', '.modal', function(){
		//有modal弹出的时候content不设置z-index层级，日期控件本身的层级起作用
		$('#content').css("z-index","auto");
		if($.fn.dataTable){
			$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
		}
	});
	$(document).on('hidden.bs.modal', '.modal', function() {
		var visibleModalLen = getVisibleModalCount();
		if(visibleModalLen == 0){
			$('#content').css("z-index","99");
		}
	});
	// 解决明细、日志页签页面表格对不齐问题
	$("body").on('shown.bs.tab', 'a[data-toggle="tab"]',
		function(e) {
		if($.fn.dataTable){
			$.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
		}
	});
	function Portal() {
		this.index = index_page;
		this.sys_user_info = sys_user_info;
		this.common_util    = common_util;
		this.role  = role_manage;
		this.menu  = sys_menu;
		this.user  = user_manage;
		
	}
	var portal = new Portal();
	
	$(function(){
		// 获取服务器时间
		centerDate = $.ajax({async: false}).getResponseHeader("Date");
		portal.index.init();
	});
});