/**
 * 初始化页面按钮菜单，来源为与当前角色绑定的左侧菜单
 * <p>需要 dfp.js</p>
 */
var dfpMenu = dfpMenu || {};

// 原始菜单
var dfpMenuThreeLevel = {};
var dfpMenuThirdLevelList = {};

// 外部菜单menu_code
var dfpMenuGivenMenu = [
    //"用款计划",
    "00111510001",
    //"直接支付申请",
    "00111510002",
    //"授权支付申请",
    "00111510003",
    //"直接支付汇总清算单",
    "00111510004",
    //"授权支付清算额度单"
    "00111510005"
];

dfpMenu = {
	/**
	 * 各页面模块参数，pgPletId
	 */
	key : {
		JB : {
			ban : "101001001001",
			deng : "101001001002",
			cha : "101001001003",
			wen : "101001001004",
			article : "101001002001",
			dealing : "101001003001"
		},
		SH : {
			ban : "101002001001",
			deng : "101002001002",
			cha : "101002001003",
			wen : "101002001004",
			article : "101002002001",
			dealing : "101003003001"
		},
        ZGBM : {
            ban : "101003001001",
            deng : "101003001002",
            cha : "101003001003",
            wen : "101003001004",
            article : "101003002001",
            dealing : "101003003001"
        },
		JZZF : {
			ban : "101004001001",
			deng : "101004001002",
			cha : "101004001003",
			wen : "101004001004",
			article : "101004002001",
			dealing : "101004003001"
		},
		GKLeader : {
			ban : "101005001001",
			deng : "101005001002",
			cha : "101005001003",
			wen : "101005001004",
			article : "101005002001",
			dealing : "101005003001"
		},
		GKJB : {
			ban : "101006001001",
			deng : "101006001002",
			cha : "101006001003",
			wen : "101006001004",
			article : "101006002001",
			dealing : "101006003001"
		},
		YWCS : {
			ban : "101007001001",
			deng : "101007001002",
			cha : "101007001003",
			wen : "101007001004",
			article : "101007002001",
			dealing : "101007003001"
		},
        GKZFSH: {
            ban : "101008001001",
            deng : "101008001002",
            cha : "101008001003",
            wen : "101008001004",
            article : "101008002001",
            dealing : "101008003001"
        },
        GKZFXD: {
            ban : "101009001001",
            deng : "101009001002",
            cha : "101009001003",
            wen : "101009001004",
            article : "101009002001",
            dealing : "101009003001"
        },
        GKKJJB: {
            ban : "101010001001",
            deng : "101010001002",
            cha : "101010001003",
            wen : "101010001004",
            article : "101010002001",
            dealing : "101010003001"
        },
        GKKJCZ: {
            ban : "101011001001",
            deng : "101011001002",
            cha : "101011001003",
            wen : "101011001004",
            article : "101011002001",
            dealing : "101011003001"
        },
        GKLD: {
            ban : "101012001001",
            deng : "101012001002",
            cha : "101012001003",
            wen : "101012001004",
            article : "101012002001",
            dealing : "101012003001"
        }


	},
	/**
	 * 菜单拆分，获取第三级
	 */
	level3 : function(menuList){
		dfpMenuThreeLevel = {
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
				dfpMenuThreeLevel.menuFirstLevelList[n1] = menuList[i];
				n1++;
			}else if(menuList[i].levelno==baseNo+1){
				dfpMenuThreeLevel.menuSecondLevelList[n2] = menuList[i];
				n2++;
			}else if(menuList[i].levelno==baseNo+2){
				dfpMenuThreeLevel.menuThirdLevelList[n3] = menuList[i];
				n3++;
			}else if(menuList[i].levelno==baseNo+3){
				dfpMenuThreeLevel.menuFourthLevelList[n4] = menuList[i];
				n4++;
			}else if(menuList[i].levelno==baseNo+4){
				dfpMenuThreeLevel.menuFivthLevelList[n5] = menuList[i];
				n5++;
			}
		}
		if(dfpMenuThreeLevel.menuFirstLevelList!=null && dfpMenuThreeLevel.menuFirstLevelList.length>0){
			// 0/1/2
		}else if(dfpMenuThreeLevel.menuSecondLevelList!=null && dfpMenuThreeLevel.menuSecondLevelList.length>0){
			dfpMenuThreeLevel.menuFirstLevelList = dfpMenuThreeLevel.menuSecondLevelList;
			dfpMenuThreeLevel.menuSecondLevelList = dfpMenuThreeLevel.menuThirdLevelList;
			dfpMenuThreeLevel.menuThirdLevelList = dfpMenuThreeLevel.menuFourthLevelList;
		}else if(dfpMenuThreeLevel.menuThirdLevelList!=null && dfpMenuThreeLevel.menuThirdLevelList.length>0){
			dfpMenuThreeLevel.menuFirstLevelList = dfpMenuThreeLevel.menuThirdLevelList;
			dfpMenuThreeLevel.menuSecondLevelList = dfpMenuThreeLevel.menuFourthLevelList;
			dfpMenuThreeLevel.menuThirdLevelList = dfpMenuThreeLevel.menuFivthLevelList;
		}
		return dfpMenuThreeLevel;
	},
	/**
	 * html 模板
	 * @params type 页面类型
	 * @params obj 门户配置菜单
	 * @params menuPlatform 平台原始菜单
	 */
	htmlModel : function(type, obj, menuPlatform, modelType) {
		var html = "";
		var _style = ' style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"';
		if(type == "JB") {
			var _html = '<li'+_style+'><span class="icon2"></span><a href="javascript:void(0);" title="Title">Name</a></li>',
				_name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name)),
				_title = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name));
			html += _html.replace("Title", _title).replace("Name", _name);
		}
		if(type == "SH") {
			var _html = '<li'+_style+'><span class="icon2"></span><a href="javascript:void(0);" title="Title">Name</a></li>',
				_name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name)),
				_title = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name));
			html += _html.replace("Title", _title).replace("Name", _name);
		}
        // if(type == "YWCS") {
        // 	var _html = '<li><a href="javascript:void(0);" title="Title"><i class="fa fa-circle-o text-red"></i>Name</a></li>',
        // 		_name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name)),
        // 		_title = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name));
        // 	html += _html.replace("Title", _title).replace("Name", _name);
        // }
        if(type == "JZZF" || type == "YWCS") {
            var _html = '<li style="border: solid 1px #cccccc;margin-bottom: -1px;"><a href="javascript:void(0);" title="Title">&nbsp;Name</a></li>';
            _name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name)),
                _title = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name));
            html += _html.replace("Title", _title).replace("Name", _name);
        }
		if(type == "GKLeader") {
			html += '';
		}
		if(type == "GKJB") {
			var _html = '<li style="margin-bottom: -1px;clear:both;overflow: auto;"><a href="javascript:void(0);" style="position: relative;"title="Title"><span></span>&nbsp;Name</a></li>';
				_name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name)),
				_title = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name));
			html += _html.replace("Title", _title).replace("Name", _name);
		}
		if(type == "ZGBM") {
			var _html = '<li><a href="javascript:void(0);" title="Title"><i class="fa fa-circle-o text-red"></i>Name</a></li>',
				_name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name)),
				_title = dfp_re.space.removeAll(dfp_re.num.removeAll(menuPlatform.name));
			html += _html.replace("Title", _title).replace("Name", _name);
		}
		return html;
	},
	/**
	 * 获取最大宽度
	 */
	maxWidth : function(pageType, str1, str2, ori_width) {
		var num = [1, 1];
		//if(pageType == "JZZF" || pageType == "GKJB") {
			num[0] = 70;
			num[1] = 13;
		//}
		return str1.length < str2.length ? (num[0] + str2.length * num[1]) : ori_width;
	},
	/**
	 * 获取各模块显示菜单，与原始菜单比对
	 */
	getMenu : function(pageType, modelType) {
		var roleId = Base64.decode($("#svRoleId", parent.document).val()),
			pgPletId = (this.key[pageType])[modelType];
		var html = "",
			menuUrls = [], // 菜单url - 平台菜单url
			menuOriIds = [], // 菜单ID - 平台放在门户表中的id
			menuOriNames = [], // 菜单名 - 平台放在门户表中的name或修改后的
			menuOriUrls = [], // 菜单url - 平台放在门户表中的url或修改后的
			//menuUserCreateIds = [], // 用户手动创建的菜单，菜单id
			//menuUserCreateNames = [], // 用户手动创建的菜单，菜单name
			//menuUserCreateUrls = [], // 用户手动创建的菜单，菜单url
			menuUserCreate = [], // 用户创建的菜单
			ele_width = 1, // 菜单动态宽度
			temp = "1",	   // 暂存当前菜单名
			widths = 200; // 菜单最小宽度
		var menu_select = "m_select|", // 选择的菜单
			menu_create = "m_create|"; // 手动创建的菜单
		// 获取门户配置菜单
		if(modelType != 'dan') {
			$.ajax({
				url : "/df/portal/getPortalSettingMenu.do",
				type : "GET",
				data : {
					"tokenid" : getTokenId(),
					"roleId" : roleId,
					"pgPletId" : pgPletId,
					"pageType" : pageType,
					"modelType" : modelType
				},
				dataType : "json",
				async: false,
				success : function(data) {
					var name = "",
						data = data.settingMenu;
					for ( var i = 0; i < data.length; i++) {
						
						// 筛选出管理员手动添加的菜单，并在之后展示这条菜单
                        var link_id = data[i].menu_id,
                            link_title = dfp_re.space.removeAll(dfp_re.num.removeAll(data[i].link_name)),
                            link_url = fullUrlWithTokenid(data[i].link_url);
                        // 系统菜单-配置所得
                        if (data[i].link_type == "1" || dfp_util.isNull(data[i].link_type)) {
                            menuOriIds.push(menu_select + link_id);
                            menuOriNames.push(link_title);
                            menuOriUrls.push(link_url);
                        } else if (data[i].link_type == "2") { // 自定义菜单
                            menuOriIds.push(menu_create + link_id);
                            menuUserCreate.push(data[i]);
                        }
						
						// 获取最大行宽
						name = link_title;
						ele_width = dfpMenu.maxWidth(pageType, temp, name, ele_width);
						temp = temp.length > name.length ? temp : name;
						// 老方法的html
						//html += dfpMenu.htmlModel(pageType, data[i]);
					}
					
					// 获取平台原始菜单
					var caroleguid = sessionStorage.select_role_guid==undefined?"":sessionStorage.select_role_guid;
					$.ajax({
						url : "/df/portal/getMenuByRole.do",
						type : "GET",
						data : {"tokenid":getTokenId(), "caroleguid":Base64.encode(caroleguid)},
						dataType : "json",
						async : false,
						success : function(data2){
							//dfpMenuThirdLevelList = JSON.parse(sessionStorage.getItem("dfp_menu_lv3") || "");
							dfpMenuThirdLevelList = (dfpMenu.level3(data2.mapMenu)).menuThirdLevelList;
						}
					});
                    // 加入外部“我的单据”到菜单“我的单据”
					//var _selfDocuments = dfpMenu.selfDocuments(pageType, modelType);
					//html = _selfDocuments[0];
                    //menuUrls = _selfDocuments[1];
					// 菜单规则匹配
					var menuUserCreateIndex = 0; // 自定义菜单序号
					for(var i in menuOriIds) {
						if(!menuOriIds.hasOwnProperty(i)) {
							continue;
						}
						// 从系统选择的菜单
						if(menuOriIds[i].indexOf(menu_select) > -1) {
							for(var j in dfpMenuThirdLevelList) {
								if(!dfpMenuThirdLevelList.hasOwnProperty(i)) {
									continue;
								}

								if(dfpMenuThirdLevelList[j].guid == menuOriIds[i].split("|")[1]) {
									html += dfpMenu.htmlModel(pageType, data[i], dfpMenuThirdLevelList[j]);
									var _url = fullUrlWithTokenid(dfpMenuThirdLevelList[j].url),
										_guid = dfpMenuThirdLevelList[j].guid,
										_name = dfp_re.space.removeAll(dfp_re.num.removeAll(dfpMenuThirdLevelList[j].name));
									menuUrls.push(_url + '&menuid=' + _guid + '&menuname=' + escape(_name));
									break;
								}
							}
						} else if (menuOriIds[i].indexOf(menu_create) > -1) {
							// 创建临时对象，适应接口生成html
							var menuUserCreateTemp = {
								"name" : menuUserCreate[menuUserCreateIndex].link_name
							};
							html += dfpMenu.htmlModel(pageType, data[i], menuUserCreateTemp);
							var _url = fullUrlWithTokenid(menuUserCreate[menuUserCreateIndex].link_url),
								//_guid = menuUserCreate[menuUserCreateIndex].menu_id,
								_name = dfp_re.space.removeAll(dfp_re.num.removeAll(menuUserCreate[menuUserCreateIndex].link_name));
							menuUrls.push(_url + '&menuname=' + escape(_name)); //+ '&menuid=' + _guid
							menuUserCreateIndex += 1;
						}
					}
					
				}
			});
		} else if(modelType == 'dan') {
			var givenMenu = [
				//"用款计划",
				"00111510001",
				//"直接支付申请",
				"00111510002",
				//"授权支付申请",
				"00111510003",
				//"直接支付汇总清算单",
				"00111510004",
				//"授权支付清算额度单"
				"00111510005"
			];
			$.ajax({
				url : "/df/portal/getMenuByRole.do",
				type : "GET",
				data : dfp.pAjaxData,
				dataType : "json",
				async : false,
				success : function(data){
					dfpMenuThirdLevelList = (dfpMenu.level3(data.mapMenu)).menuThirdLevelList;
					for(var m in givenMenu) {
						if(!givenMenu.hahasOwnProperty(m)) continue;
						for(var j in dfpMenuThirdLevelList) {
							if(!dfpMenuThirdLevelList.hasOwnProperty(j)) continue;
							if(dfpMenuThirdLevelList[j].guid == givenMenu[m]) {
								html += dfpMenu.htmlModel(pageType, givenMenu[m], dfpMenuThirdLevelList[j]);
								var _url = fullUrlWithTokenid(dfpMenuThirdLevelList[j].url),
									_guid = dfpMenuThirdLevelList[j].guid,
									_name = dfp_re.space.removeAll(dfp_re.num.removeAll(dfpMenuThirdLevelList[j].name));
								menuUrls.push(_url + '&menuid=' + _guid + '&menuname=' + escape(_name));
								break;
							}
						}
					}
				}
			});
		}

		return {
			"html" : html,
			"url" : menuUrls,
			"width" : widths,
			"ele_width" : (ele_width > 200 ? ele_width : 200)
		};
	},
    /**
	 * “我的单据”menu_code匹配
     */
    selfDocuments : function (pageType, modelType) {
    	var html = '',
            menuUrls = [];
		// 单位页面的“我要问”伪装为“我的单据”显示
        if((pageType == dfp.page.JB || pageType == dfp.page.SH) && modelType == 'wen') {

            for(var i=0; i<dfpMenuGivenMenu.length; i++) {
                for(var j in dfpMenuThirdLevelList) {
                    if(!dfpMenuThirdLevelList.hasOwnProperty(j)) continue;
                    var onemenu = dfpMenuThirdLevelList[j];
                    if(onemenu.code == dfpMenuGivenMenu[i]){
                        html += dfpMenu.htmlModel(pageType, null, onemenu);
                        var _url = fullUrlWithTokenid(onemenu.url),
                            _guid = onemenu.guid,
                            _name = dfp_re.space.removeAll(dfp_re.num.removeAll(onemenu.name));
                        menuUrls.push(_url + '&menuid=' + _guid + '&menuname=' + escape(_name));
                    }
                }
            }

        }
        return [html, menuUrls];
    },
	/**
	 * 绑定事件
	 */
	eventBind : function(type, modelID, url, tabId) {
		if(type == "JB") {
			$("#" + modelID).find("li").each(function(i){
				$(this).click(function(e){
					window.parent.addTabToParent($(this).find("a").text(), url[i]);
				});
			});
		}
		if(type == "SH") {
			$("#" + modelID).find("li").each(function(i){
				$(this).click(function(e){
					window.parent.addTabToParent($(this).find("a").text(), url[i]);
				});
			});
		}
		// if(type == "YWCS") {
		// 	$("#" + modelID).find("a").each(function(i){
		// 		$(this).click(function(e){
		// 			//e.preventDefault();
		// 			window.parent.addTabToParent($(this).text(), url[i]);
		// 		});
		// 	});
		// }
		if(type === "JZZF" || type === "GKJB" || type === "YWCS") {
			$("#" + tabId).on("mouseover", function() {
				$(this).find("div").css({"display": "block"});
			}).on("mouseleave", function() {
				$(this).find("div").css({"display": "none"});
			});
			$("#" + tabId).find("div").find("div").find("ul").find("li").each(function(i) {
				$(this).click(function(e){
					window.parent.addTabToParent($(this).find("a").text(), url[i]);
				});
			});
		}
		if(type == "GKLeader") {
			//html += '';
		}
//		if(type == "GKJB") {
//			$("#" + modelID).find("li").each(function(i){
//				$(this).click(function(e){
//					window.parent.addTabToParent($(this).find("a").text(), url[i]);
//				});
//			});
//		}
		if(type == "ZGBM") {
			$("#" + modelID).find("a").each(function(i){
				$(this).click(function(e){
					window.parent.addTabToParent($(this).text(), url[i]);
				});
			});
		}
	},
	/**
	 * 渲染到页面
	 * @param pageType 页面类型
	 * @param modelType 模块
	 * @param modelID 渲染标签ID
	 * @params [tabId] 页面常用操作按钮id（当前仅JZZF使用）
	 */
	show : function(pageType, modelType, modelID, tabId) {
		var data = this.getMenu(pageType, modelType);
//		if(pageType == dfp.page.GKJB) {
//			$("#" + modelID).find("ul").html(data["html"]).css("width", data["ele_width"] + "px");
//		} else 
		if(pageType == dfp.page.JB || pageType == dfp.page.SH) {
			$("#" + modelID).html(data["html"]).css("width", data["ele_width"] + 0 + "px");
		} else if(pageType == dfp.page.ZGBM) {
			$("#" + modelID).html(data["html"]);
		} else if(pageType == dfp.page.JZZF || pageType == dfp.page.GKJB || pageType == dfp.page.YWCS) {
			var _style = 'display:none;border: none;width:' + data["ele_width"] + 'px;position: relative;z-index: 9999;font-size: 14px;text-align: left;line-height: 16px;top: 4px;left: 0;';
			// 获取常用操作展示标签左下角在整个页面的绝对位置，依次确定其内部菜单的展示位置
			//var resize = dfpMenu.resize(tabId, "bl");
			//_style += 'top:' + resize['top'] + 'px;left:' + resize['left'] + 'px;';
			var h = '<div style="' + _style + '" class="box box-solid"><div class="box-body no-padding"><ul class="nav nav-pills nav-stacked">';
			h += data["html"];
			h += '</ul></div></div>';
			$("#" + tabId).append(h);
		} else {
			$("#" + modelID).html(data["html"]).css("width", data["ele_width"] + "px");
		}
		this.eventBind(pageType, modelID, data["url"], tabId);
	}
	
};


/**
 * 新dfpMenu
 */
/**
 * 获取页面指定标签的绝对位置
 * @params id 标签id
 * @params position 位置，tl 左上角(默认)/tr 右上角/bl 左下角/br 右下角
 * @return {top:30, left:40}，结果会加入传入id对应标签在当前条件下能获取的高度或宽度，因标签style会产生误差，请自行修正
 */
dfpMenu.resize = function(id, p) {
	var $id = $("#" + id);
	var top = $id.offset().top,
		left = $id.offset().left;
	var width = $id.outerWidth(), // 区块的宽度+padding宽度+border宽度
		height = $id.outerHeight(); // 区块的高度+padding高度+border高度
	if(!p || p == 'tl')
		return {top: top, left: left};
	else if(p == 'tr')
		return {top: top, left: left + width};
	else if(p == 'bl')
		return {top: top + height, left: left};
	else if(p == 'br')	
		return {top: top + height, left: left + width};
};


