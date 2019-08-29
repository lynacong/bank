var Portal = Portal || {};
var Portal1 = Portal1 || {};
var menuThreeLevel;
var tokenId = "";

//获取tokenId方法
function getTokenId(){
	//return Portal.tokenid.getTokenId();
	return dfp.tokenid.getTokenId();
}
function switchRoleConfirm(data, type){
	Portal.role.switchRoleConfirm(data, type);
}

$(function(){
	Portal.init.index();
	
});

Portal = {
	init:{
		index:function(){
			var caroleguid = localStorage.select_role_guid==undefined?"":localStorage.select_role_guid;
			dfp.Ajax.doReq(
				null,
				{"tokenid":getTokenId(), "caroleguid":dfp.encrypt.base64.encode(caroleguid)},
				AjaxURL.init.index,
				dfp.Ajax.doType("get"),
				function(data){
					
					Portal.tokenid.isValid(data.msg);
					
					// public param
					Portal.publicParams.commonData(data.publicParam);
					
					// hidden label with public param
					Portal.publicParams.hiddenLabel(data.publicParam);
	            	
	            	$("#_username_index_top").html(data.publicParam.svUserName+"（"+data.publicParam.svRoleName+"）");
	            	Portal.init.time();
	            	
	            	// 左侧菜单
	        		Portal.menu.leftMenu();
	        		
	        		// 年度区划
	        		//Portal.yearRg.switchYearRg();
	        		
	        		// 角色
	        		//Portal.role.switchRole();
	        		
	        		// index事件
	        		Portal.init.event();
	        		
	        		// recent 
	        		//$("._portal_recent_check_a").on("click", function(){
	        		//	Portal.recent.mainData();
	        		//});
	        		
	        		// echarts
	        		//Portal.echarts.mainData();
	        		
	        		// article
	        		//Portal.article.mainData();
	            	
	            	// dealing
	            	//Portal.dealing.mainData();
	            	
	        		$("#iframe_first_id_iframe").prop("src", "/df/portal/admin/index2/subpage.html?tokenid="+getTokenId());
	        		
				}
			);
		},
		time:function(){
			time = dfp.common.currentTime();
			$("#_currenttime_index_top").append(time);
		},
		event:function(){
			// 左上角按钮
//			$("#sidebar-btn").on("click", function(){
//				var _display = $("._portal_left_menu_hidden_aside").css("display");
//				_display = _display == "none" ? "block" : (_display == "block" ? "none" : "none");
//				$("._portal_left_menu_hidden_aside").css("display", _display);
//			});
			
			// 右侧，最近操作
//			$("#work a").click(function(){
//				$("#recent_work_div").animate({"right":"37"},200);
//			});
//			$("#recent_work_div").mouseleave(function(){
//				$(this).animate({"right":"-300"},200);
//			});
//			$("#dMenuInfo1").mouseleave(function(){
//				$("#dropdown-menu1").hide();
//			});
//			$("#dMenuInfo2").mouseleave(function(){
//				$("#dropdown-menu2").hide();
//			});
			//top栏事件
			$(".nav .dropdown a").click(function(){
				var i = $(this).parent("li").index();
				$(".toggle").each(function(){
					$(this).hide();
				});
				if(!$(".toggle").eq(i).hasClass("null")){
					$(".toggle").eq(i).show();
				}			
			});
			$(".toggle").mouseleave(function(){
				$(".toggle").each(function(){
					$(this).hide();
				});
			});
		}
	},
	menu:{
		threeLevelAnalysis:function(menuList){	// 暂定三级菜单，levelno允许为0/1/2或1/2/3或2/3/4
			menuThreeLevel = {
				menuFirstLevelList : new Array(),
				menuSecondLevelList : new Array(),
				menuThirdLevelList : new Array(),
				menuFourthLevelList : new Array(),
				menuFivthLevelList : new Array()
			};
			var n1 = 0;
			var n2 = 0;
			var n3 = 0;
			var n4 = 0;
			var n5 = 0;
			var baseNo = 0;
			for (var i = 0; i < menuList.length; i++){
				if(menuList[i].levelno==baseNo){
					menuThreeLevel.menuFirstLevelList[n1] = menuList[i];
					n1++;
				}else if(menuList[i].levelno==baseNo+1){
					menuThreeLevel.menuSecondLevelList[n2] = menuList[i];
					n2++;
				}else if(menuList[i].levelno==baseNo+2){
					menuThreeLevel.menuThirdLevelList[n3] = menuList[i];
					n3++;
				}else if(menuList[i].levelno==baseNo+3){
					menuThreeLevel.menuFourthLevelList[n4] = menuList[i];
					n4++;
				}else if(menuList[i].levelno==baseNo+4){
					menuThreeLevel.menuFivthLevelList[n5] = menuList[i];
					n5++;
				}
			}
			if(menuThreeLevel.menuFirstLevelList!=null && menuThreeLevel.menuFirstLevelList.length>0){
				// 0/1/2
			}else if(menuThreeLevel.menuSecondLevelList!=null && menuThreeLevel.menuSecondLevelList.length>0){
				menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuSecondLevelList;
				menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuThirdLevelList;
				menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFourthLevelList;
			}else if(menuThreeLevel.menuThirdLevelList!=null && menuThreeLevel.menuThirdLevelList.length>0){
				menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuThirdLevelList;
				menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuFourthLevelList;
				menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFivthLevelList;
			}
			return menuThreeLevel;
		},
		showMenuHtml:function(){
			var menuFirstLevelList = menuThreeLevel.menuFirstLevelList;
	    	var menuSecondLevelList = menuThreeLevel.menuSecondLevelList;
	    	var menuThirdLevelList = menuThreeLevel.menuThirdLevelList;
	    	
	    	var menuListHtml = '<li class="treeview">';
	    	menuListHtml += '<a href="javascript:void(0);">';
	    	menuListHtml += '<i class="fa fa-desktop"></i>';
	    	menuListHtml += '<span>我的工作台</span>';
	    	menuListHtml += '</a></li>';
	    	var _tokenid = "";
	    	var menuFirstLevelListLength = dfp.Object.isNull(menuFirstLevelList)?0:menuFirstLevelList.length;
	    	// 一级菜单
	    	for (var i=0; i<menuFirstLevelListLength; i++){
	    		menuListHtml += '<li class="treeview">';
	    		menuListHtml += '<a href="javascript:void(0);">';
	    		menuListHtml += '<i class="fa fa-leaf"></i>';
	    		menuListHtml += '<span>' + menuFirstLevelList[i].name + '</span><span class="pull-right-container"><i class="fa fa-angle-right pull-right"></i></span></a>';
	    		menuListHtml += '<div class="two-level treeview-menu">';
	    		
	    		// 二级菜单
	    		for (var j in menuSecondLevelList){
	    			if(menuSecondLevelList[j].parentid == null || menuSecondLevelList[j].parentid == ""
	    					|| menuSecondLevelList[j].parentid != menuFirstLevelList[i].guid){
    	    			continue;
    	    		}
	    			
	    			menuListHtml += '<dl class="two-level-item">';
	    			menuListHtml += '<dt class="two-level-tit">';
	    			menuListHtml += menuSecondLevelList[j].name + '&nbsp;&nbsp;';
	    			menuListHtml += '</dt>';
	    			menuListHtml += '<dd class="two-level-detail">';
	    			
	    			// 三级菜单
	    			for (var k in menuThirdLevelList){
	    				if(menuThirdLevelList[k].parentid == null || menuThirdLevelList[k].parentid == ""
	    					|| menuThirdLevelList[k].parentid != menuSecondLevelList[j].guid){
	    	    			continue;
	    	    		}
	    				
	    				if(null == menuThirdLevelList[k].url || menuThirdLevelList[k].url.indexOf("?")!=-1){
	            			_tokenid = "&tokenid="+getTokenId();
	            		}else{
	            			_tokenid = "?tokenid="+getTokenId();
	            		}
	    				menuListHtml += '<a class="_portal_recent_menu_add_a" href="javascript:void(0);" data-title="'+menuThirdLevelList[k].name+'" data-href="'+menuThirdLevelList[k].url+_tokenid+'&menuid='+menuThirdLevelList[k].guid+'&menuname='+escape(menuThirdLevelList[k].name)+'" >'+menuThirdLevelList[k].name+'</a>';
	    			}
	    			menuListHtml += '</dd></dl>';
	    		}
	    		menuListHtml += '</div>';
	    	}
	    	menuListHtml += '</li>';
	    	$("#_sidebar_menu").append(menuListHtml);
	    	// 菜单操作记录
        	$("._portal_recent_menu_add_a").on("click", function(){
        		dfp.recent.addRecord(this, "menu");
        	});
		},
		event:function(){
			//页签
			$(".two-level-detail a").click(function(){
				var href = $(this).attr('data-href'),
				title = $(this).attr("data-title");
				if(title==""||href==""){
					alert("data-title属性不能为空或data-href属性不能为空");
					return false;
				}
				Hui_admin_tab($(this));
				$("#min_title_list li i").addClass('fa fa-times');
				$(this).parents('.two-level').hide();
			});
			$("li.treeview >a").on("click", function(e){
				e.preventDefault();
			});
    	    $("li.treeview >a").on("mouseover", function(e) {
    	    	if($(this).parent("li").index() == 0){
    	    		$(".two-level").each(function() {
    	    			$(this).hide();
    	    		});
    	    		return;
    	    	}
    			var s = e.fromElement || e.relatedTarget;
    			if (document.all) {
    				if (this.contains(s))  // 判断调用onmouseover的对象(this)是否包含自身或子级，如果包含，则不执行
    					return;
    			} else {
    				var reg = this.compareDocumentPosition(s);
    				if ((reg == 20 || reg == 0))
    					return;
    			}
    			$(".two-level").each(function() {
    				$(this).hide();
    			});
    			var i = $(this).parent("li").index();
    			if(!$(".two-level").eq(i-1).hasClass("null")) {
    				$(".two-level").eq(i-1).slideDown();
    			}
    		});
    		$("li.treeview >a").on("mouseout", function(e) {
    			e = window.event || e;
    			var s = e.toElement || e.relatedTarget;
    			if(document.all) {
    				if(this.contains(s)) {
    					return;
    				}
    			} else {
    				var reg = this.compareDocumentPosition(s);
    				if((reg == 20 || reg == 0)) {
    					return;
    				}
    			}
    		});
    		$(".two-level").mouseleave(function() {
    			$(".two-level").each(function() {
    				$(this).slideUp();
    			})
    		});
		},
		leftMenu:function(){
			var caroleguid = localStorage.select_role_guid==undefined?"":localStorage.select_role_guid;
			dfp.Ajax.doReq(
				null,
				{"tokenid":getTokenId(), "caroleguid":dfp.encrypt.base64.encode(caroleguid)},
				AjaxURL.menu.getInitMenu,
				dfp.Ajax.doType("get"),
				function(data){
					Portal.menu.threeLevelAnalysis(data.mapMenu);
			    	Portal.menu.showMenuHtml();
			    	Portal.menu.event();
				}
			);
		}
	},
	yearRg:{
		switchYearRg:function(){
			dfp.Ajax.doReq(
				null,
				{"tokenid":getTokenId()},
				AjaxURL.init.getInitYearRg,
				dfp.Ajax.doType("get"),
				function(data){
					rgset_relation = data.rgset_relation; //map
					set_year = data.set_year;
					rg_code = data.rg_code;
					
					var set_yearHtml = "";
					for(var i in set_year){
						set_yearHtml += '<li><a href="javascript:switchRoleConfirm(&quot;' + set_year[i] + '&quot;,&quot;switchSetyear&quot;);">' + set_year[i] + '</a></li>';
						$("#dMenuInfo3").html(set_yearHtml);
					}
					
					var rg_codeHtml = "";
					for(var i in rg_code){
						rg_codeHtml += '<li><a href="javascript:switchRoleConfirm(&quot;' + rg_code[i] + '&quot;,&quot;switchSetyear&quot;);">' + rg_code[i] + '</a></li>';
						$("#dMenuInfo4").html(rg_codeHtml);
					}
				}
			);
		},
		switchRgcode:function(){
			
		}
	},
	role:{
		switchRole:function(){
			dfp.Ajax.doReq(
				null,
				{"tokenid":getTokenId()},
				AjaxURL.role.switchRole,
				dfp.Ajax.doType("get"),
				function(data){
					var html = data.html;
					$("#dMenuInfo").html(html);
				}
			);
		},
		switchRoleConfirm:function(data, type){
			// TODO localstorage对应属性刷新（年度、区划、角色ID）
//			var url = AjaxURL.role.switchRoleConfirm;
//			if (type == "switchRole") {
//				localStorage.select_role_guid = roleId;
//			}else if (type == "switchRgcode") {
//				url = AjaxURL.role.switchRgcodeConfirm;
//			}else if (type = "switchSetyear") {
//				url = AjaxURL.role.switchSetyearConfirm;
//			}
			dfp.Ajax.doReq(
				null,
				{"tokenid":getTokenId(), "data":data},
				AjaxURL.role.switchRoleConfirm,
				dfp.Ajax.doType("get"),
				function(data){
					dfp.localStorage.setItem(dfp.key.tokenid, dfp.key.dfValidFlag+tokenId);
					window.location.href="/df/portal/admin/index/index.html?tokenid="+data.tokenid;
				}
			);
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
		}
	},
	publicParams:{
		commonData:function(data){
			var _data = JSON.stringify(data);
			if(!localStorage.commonData){
				localStorage.commonData = _data;
			} else {
				localStorage.commonData = _data;
			}
		},
		hiddenLabel:function(data){
			$("#svFiscalPeriod").val(dfp.encrypt.base64.encode(data.svFiscalPeriod));	// 会计期间
			$("#svMenuId").val(dfp.encrypt.base64.encode(data.svMenuId));	// 菜单ID
			$("#svRgCode").val(dfp.encrypt.base64.encode(data.svRgCode));	// 区划CODE
			$("#svRgName").val(dfp.encrypt.base64.encode(data.svRgName));	// 区划ID
			$("#svRoleCode").val(dfp.encrypt.base64.encode(data.svRoleCode));	// 角色CODE
			$("#svRoleId").val(dfp.encrypt.base64.encode(data.svRoleId));	// 角色ID
			$("#svRoleName").val(dfp.encrypt.base64.encode(data.svRoleName));	// 角色名称
			$("#svSetYear").val(dfp.encrypt.base64.encode(data.svSetYear));	// 年度
			$("#svTransDate").val(dfp.encrypt.base64.encode(data.svTransDate));	// 业务日期
			$("#svUserCode").val(dfp.encrypt.base64.encode(data.svUserCode));	// 用户CODE
			$("#svUserId").val(dfp.encrypt.base64.encode(data.svUserId));	// 用户ID
			$("#svUserName").val(dfp.encrypt.base64.encode(data.svUserName));	// 用户名称
		}
	},
	user:{
		logout:function(){
			var tokenId = getTokenId();
			
			// 清空当次访问产生的页面临时数据
			var lsName = [
				"commonData",
				"select_role_guid",
				"commonBtnValue",
				"common_operation_select_url",
				"commonOperationSelectMenuHtml",
				"normalMenuByUserRoleSimple",
				dfp.key.tokenid
			];
			for(var i in lsName){
				dfp.localStorage.removeItem(lsName[i]);
			}
			
			dfp.Ajax.doReq(
				null,
				{"tokenid":tokenId},
				AjaxURL.user.logout,
				dfp.Ajax.doType("get"),
				function(data){
					var flag = data.flag;
					if(flag == 1){
						localStorage.tokenid = "";
						window.location.href=AjaxURL.user.login;
					}else{
						alert("wrong");
					}
				}
			);
		}
	
	},
	password:{
		registerPwd:function(){
			var tokenId = getTokenId();
			var oldpwd = $("#oldpwd").val();
			var newpwd = $("#newpwd").val();
			var confirmpwd = $("#confirmpwd").val();
			var password = hex_md5(newpwd);
			
			$.ajax({
				url:"/df/portal/registerPwd.do",
				type:"GET",
				dataType:"json",
				data:{"tokenid":tokenId,"password":Base64.encode(password)},
				success:function(data){
					//window.location.href = "..";
				}
			});
		}
	},
	recent:{
		mainData:function(){
			// 获取localstorage，转为html
			//var recentHtml = dfp.Object.isValid(dfp.localStorage.getItem(dfp.key.recentHtml));
			
		}
	}
	
};

