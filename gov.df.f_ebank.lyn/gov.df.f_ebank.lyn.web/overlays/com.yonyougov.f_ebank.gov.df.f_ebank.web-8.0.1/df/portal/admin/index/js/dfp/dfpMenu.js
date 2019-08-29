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
    key: {
        JB: {
            ban: "101001001001",
            deng: "101001001002",
            cha: "101001001003",
            wen: "101001001004",
            article: "101001002001",
            dealing: "101001003001"
        },
        SH: {
            ban: "101002001001",
            deng: "101002001002",
            cha: "101002001003",
            wen: "101002001004",
            article: "101002002001",
            dealing: "101003003001"
        },
        ZGBM: {
            ban: "101003001001",
            deng: "101003001002",
            cha: "101003001003",
            wen: "101003001004",
            article: "101003002001",
            dealing: "101003003001"
        },
        JZZF: {
            ban: "101004001001",
            deng: "101004001002",
            cha: "101004001003",
            wen: "101004001004",
            article: "101004002001",
            dealing: "101004003001"
        },
        GKLeader: {
            ban: "101005001001",
            deng: "101005001002",
            cha: "101005001003",
            wen: "101005001004",
            article: "101005002001",
            dealing: "101005003001"
        },
        GKJB: {
            ban: "101006001001",
            deng: "101006001002",
            cha: "101006001003",
            wen: "101006001004",
            article: "101006002001",
            dealing: "101006003001"
        },
        YWCS: {
            ban: "101007001001",
            deng: "101007001002",
            cha: "101007001003",
            wen: "101007001004",
            article: "101007002001",
            dealing: "101007003001"
        },
        GKZFSH: {
            ban: "101008001001",
            deng: "101008001002",
            cha: "101008001003",
            wen: "101008001004",
            article: "101008002001",
            dealing: "101008003001"
        },
        GKZFXD: {
            ban: "101009001001",
            deng: "101009001002",
            cha: "101009001003",
            wen: "101009001004",
            article: "101009002001",
            dealing: "101009003001"
        },
        GKKJJB: {
            ban: "101010001001",
            deng: "101010001002",
            cha: "101010001003",
            wen: "101010001004",
            article: "101010002001",
            dealing: "101010003001"
        },
        GKKJCZ: {
            ban: "101011001001",
            deng: "101011001002",
            cha: "101011001003",
            wen: "101011001004",
            article: "101011002001",
            dealing: "101011003001"
        },
        GKLD: {
            ban: "101012001001",
            deng: "101012001002",
            cha: "101012001003",
            wen: "101012001004",
            article: "101012002001",
            dealing: "101012003001"
        },
        GKZFSH: {
            ban: "101013001001",
            deng: "101013001002",
            cha: "101013001003",
            wen: "101013001004",
            article: "101013002001",
            dealing: "101013003001"
        },
        GKKJFZ: {
            ban: "101014001001",
            deng: "101014001002",
            cha: "101014001003",
            wen: "101014001004",
            article: "101014002001",
            dealing: "101014003001"
        },
        YSC: {
            ban: "101015001001",
            deng: "101015001002",
            cha: "101015001003",
            wen: "101015001004",
            article: "101015002001",
            dealing: "101015003001"
        },
        YSCZB: {
            ban: "101016001001",
            deng: "101016001002",
            cha: "101016001003",
            wen: "101016001004",
            article: "101016002001",
            dealing: "101016003001"
        }
    },
    /**
     * 菜单拆分，获取第三级
     */
    level3: function (menuList) {
        dfpMenuThreeLevel = {
            menuFirstLevelList: new Array(),
            menuSecondLevelList: new Array(),
            menuThirdLevelList: new Array(),
            menuFourthLevelList: new Array(),
            menuFivthLevelList: new Array()
        };
        var n1 = 0;
        var n2 = 0;
        var n3 = 0;
        var n4 = 0;
        var n5 = 0;
        var baseNo = 0;
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i].levelno == baseNo) {
                dfpMenuThreeLevel.menuFirstLevelList[n1] = menuList[i];
                n1++;
            } else if (menuList[i].levelno == baseNo + 1) {
                dfpMenuThreeLevel.menuSecondLevelList[n2] = menuList[i];
                n2++;
            } else if (menuList[i].levelno == baseNo + 2) {
                dfpMenuThreeLevel.menuThirdLevelList[n3] = menuList[i];
                n3++;
            } else if (menuList[i].levelno == baseNo + 3) {
                dfpMenuThreeLevel.menuFourthLevelList[n4] = menuList[i];
                n4++;
            } else if (menuList[i].levelno == baseNo + 4) {
                dfpMenuThreeLevel.menuFivthLevelList[n5] = menuList[i];
                n5++;
            }
        }
        if (dfpMenuThreeLevel.menuFirstLevelList != null && dfpMenuThreeLevel.menuFirstLevelList.length > 0) {
            // 0/1/2
        } else if (dfpMenuThreeLevel.menuSecondLevelList != null && dfpMenuThreeLevel.menuSecondLevelList.length > 0) {
            dfpMenuThreeLevel.menuFirstLevelList = dfpMenuThreeLevel.menuSecondLevelList;
            dfpMenuThreeLevel.menuSecondLevelList = dfpMenuThreeLevel.menuThirdLevelList;
            dfpMenuThreeLevel.menuThirdLevelList = dfpMenuThreeLevel.menuFourthLevelList;
        } else if (dfpMenuThreeLevel.menuThirdLevelList != null && dfpMenuThreeLevel.menuThirdLevelList.length > 0) {
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
    htmlModel: function (type, obj, menuPlatform, modelType) {
        var html = "";
        var _style = ' style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"';

        // if (type == "GKJB") {
        //     var _html = '<li style="margin-bottom: -1px;clear:both;overflow: auto;"><a href="javascript:void(0);" style="position: relative;"title="Title"><span></span>&nbsp;Name</a></li>';
        //         _name = dfp_re.space.removeAll(dfp_re.num.removeAll(obj.link_name)),
        //         _title = dfp_re.space.removeAll(dfp_re.num.removeAll(obj.link_name));
        //     html += _html.replace("Title", _title).replace("Name", _name);
        // }
        if (type == "JB" || type == "SH") {
            var _html = '<li' + _style + '><span class="icon2"></span><a href="javascript:void(0);" title="Title">Name</a></li>',
                _name = dfp_re.space.removeAll(dfp_re.num.removeAll(obj.link_name)),
                _title = dfp_re.space.removeAll(dfp_re.num.removeAll(obj.link_name));
            html += _html.replace("Title", _title).replace("Name", _name);
        } else {
            var _html = '<li style="border: solid 1px #cccccc;margin-bottom: -1px;"><a class="dfpMenuHover" href="javascript:void(0);" title="Title">&nbsp;Name</a></li>';
            _name = dfp_re.space.removeAll(dfp_re.num.removeAll(obj.link_name)),
                _title = dfp_re.space.removeAll(dfp_re.num.removeAll(obj.link_name));
            html += _html.replace("Title", _title).replace("Name", _name);
        }
        return html;
    },
    /**
     * 获取最大宽度
     */
    maxWidth: function (pageType, str1, str2, ori_width) {
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
    getMenu: function (pageType, modelType) {
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
        if (modelType != 'dan') {
            $.ajax({
                url: "/df/portal/getPortalSettingMenu.do",
                type: "GET",
                data: {
                    "tokenid": getTokenId(),
                    "roleId": roleId,
                    "pgPletId": pgPletId,
                    "pageType": pageType,
                    "modelType": modelType
                },
                dataType: "json",
                async: false,
                success: function (data) {
                    var name = "",
                        data = data.settingMenu;
                    for (var i = 0; i < data.length; i++) {

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
                    var caroleguid = sessionStorage.select_role_guid == undefined ? "" : sessionStorage.select_role_guid;
                    $.ajax({
                        url: "/df/portal/getMenuByRole.do",
                        type: "GET",
                        data: {"tokenid": getTokenId(), "caroleguid": Base64.encode(caroleguid)},
                        dataType: "json",
                        async: false,
                        success: function (data2) {
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
                    for (var i in menuOriIds) {
                        if (!menuOriIds.hasOwnProperty(i)) {
                            continue;
                        }
                        // 从系统选择的菜单
                        if (menuOriIds[i].indexOf(menu_select) > -1) {
                            for (var j in dfpMenuThirdLevelList) {
                                if (!dfpMenuThirdLevelList.hasOwnProperty(i)) {
                                    continue;
                                }

                                if (dfpMenuThirdLevelList[j].guid == menuOriIds[i].split("|")[1]) {
                                    html += dfpMenu.htmlModel(pageType, data[i], dfpMenuThirdLevelList[j]);
                                    var _url = fullUrlWithTokenid(dfpMenuThirdLevelList[j].url),
                                        _guid = dfpMenuThirdLevelList[j].guid,
                                        _name = dfp_re.space.removeAll(dfp_re.num.removeAll(dfpMenuThirdLevelList[j].name));
                                    menuUrls.push(_url + '&menuid=' + _guid + '&menuname=' + escape(_name));
                                    break;
                                }
                            }
                        } else if (menuOriIds[i].indexOf(menu_create) > -1) {

                            // TODO 后台已修改，当前无自定义添加菜单，即此方法不再走，但不满足用户在发布菜单后对菜单的自定修改及显示

                            // 创建临时对象，适应接口生成html
                            var menuUserCreateTemp = {
                                "name": menuUserCreate[menuUserCreateIndex].link_name
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
        } else if (modelType == 'dan') {
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
                url: "/df/portal/getMenuByRole.do",
                type: "GET",
                data: dfp.pAjaxData,
                dataType: "json",
                async: false,
                success: function (data) {
                    dfpMenuThirdLevelList = (dfpMenu.level3(data.mapMenu)).menuThirdLevelList;
                    for (var m in givenMenu) {
                        if (!givenMenu.hahasOwnProperty(m)) continue;
                        for (var j in dfpMenuThirdLevelList) {
                            if (!dfpMenuThirdLevelList.hasOwnProperty(j)) continue;
                            if (dfpMenuThirdLevelList[j].guid == givenMenu[m]) {
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
            "html": html,
            "url": menuUrls,
            "width": widths,
            "ele_width": (ele_width > 200 ? ele_width : 200)
        };
    },
    /**
     * “我的单据”menu_code匹配
     */
    selfDocuments: function (pageType, modelType) {
        var html = '',
            menuUrls = [];
        // 单位页面的“我要问”伪装为“我的单据”显示
        if ((pageType == dfp.page.JB || pageType == dfp.page.SH) && modelType == 'wen') {

            for (var i = 0; i < dfpMenuGivenMenu.length; i++) {
                for (var j in dfpMenuThirdLevelList) {
                    if (!dfpMenuThirdLevelList.hasOwnProperty(j)) continue;
                    var onemenu = dfpMenuThirdLevelList[j];
                    if (onemenu.code == dfpMenuGivenMenu[i]) {
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
    eventBind: function (type, modelID, url, tabId) {
        if (type == "JB" || type == "SH") {
            $("#" + modelID).find("li").each(function (i) {
                $(this).click(function (e) {
                    window.parent.addTabToParent($(this).find("a").text(), dfp.ping.addServerIP(url[i]));
                });
            });
        } else {
            $("#" + tabId).on("mouseover", function () {
                $(this).find("div").css({"display": "block"});
            }).on("mouseleave", function () {
                $(this).find("div").css({"display": "none"});
            });
            $("#" + tabId).find("div").find("div").find("ul").find("li").each(function (i) {
                $(this).click(function (e) {
                    window.parent.addTabToParent($(this).find("a").text(), dfp.ping.addServerIP(url[i]));
                });
                // 行hover事件
                $(this).find("a").each(function() {
                	$(this).on("mouseover", function() {
                    	$(this).css({"background": "#108ee9", "color": "#fff"});
                    }).on("mouseleave", function() {
                    	$(this).css({"background": "#f8f8f8", "color": "#000"});
                    });
                });
            });
        }

    },
    /**
     * 渲染到页面
     * @param pageType 页面类型
     * @param modelType 模块
     * @param modelID 渲染标签ID
     * @params tabId 页面常用操作按钮id
     */
    show: function (pageType, modelType, modelID, tabId) {
        var data = this.getMenu(pageType, modelType);
//		if(pageType == dfp.page.GKJB) {
//			$("#" + modelID).find("ul").html(data["html"]).css("width", data["ele_width"] + "px");
//		} else 
        if (pageType == dfp.page.JB || pageType == dfp.page.SH) {
            $("#" + modelID).html(data["html"]).css("width", data["ele_width"] + 0 + "px");
        } else {
            var _style = 'display:none;border: none;width:' + data["ele_width"] + 'px;position: relative;z-index: 9999;font-size: 14px;text-align: left;line-height: 16px;top: 0px;left: 0;';
            // 获取常用操作展示标签左下角在整个页面的绝对位置，依次确定其内部菜单的展示位置
            //var resize = dfpMenu.resize(tabId, "bl");
            //_style += 'top:' + resize['top'] + 'px;left:' + resize['left'] + 'px;';
            var h = '<div style="' + _style + '" class="box box-solid"><div class="box-body no-padding"><ul class="nav nav-pills nav-stacked">';
            h += data["html"];
            h += '</ul></div></div>';
            $("#" + tabId).append(h);
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
dfpMenu.resize = function (id, p) {
    var $id = $("#" + id);
    var top = $id.offset().top,
        left = $id.offset().left;
    var width = $id.outerWidth(), // 区块的宽度+padding宽度+border宽度
        height = $id.outerHeight(); // 区块的高度+padding高度+border高度
    if (!p || p == 'tl')
        return {top: top, left: left};
    else if (p == 'tr')
        return {top: top, left: left + width};
    else if (p == 'bl')
        return {top: top + height, left: left};
    else if (p == 'br')
        return {top: top + height, left: left + width};
};

/**
 * 常用操作html
 */
dfpMenu.options = {
    'ban': {
        id: 'oftenUlBan',
        cls: '',
        aTitle: '我要办理',
        aCls: '',
        aImgSrc: 'img/menu/icon-ban.png',
        aText: '我要办理',
        divStyle: 'display: none;border: none;width: 200px;position: relative;z-index: 9999;font-size: 14px;text-align: left;line-height: 16px; top: 4px;left: 0px;',
        divCls: ''
    }, // 我要支付、我要办理
    'deng': {
        id: 'oftenUlDeng',
        cls: '',
        aTitle: '我要登记',
        aCls: '',
        aImgSrc: 'img/menu/icon-deng.png',
        aText: '我要登记',
        divStyle: 'display: none;border: none;width: 200px;position: relative;z-index: 9999;font-size: 14px;text-align: left;line-height: 16px; top: 4px;left: 0px;',
        divCls: ''
    }, // 我要登记、我的单据
    'cha': {
        id: 'oftenUlCha',
        cls: '',
        aTitle: '常用报表',
        aCls: '',
        aImgSrc: 'img/menu/icon-bao.png',
        aText: '常用报表',
        divStyle: 'display: none;border: none;width: 200px;position: relative;z-index: 9999;font-size: 14px;text-align: left;line-height: 16px; top: 4px;left: 0px;',
        divCls: ''
    }, // 我要查询
    'wen': {
        id: 'oftenUlWen',
        cls: '',
        aTitle: '我的单据',
        aCls: '',
        aImgSrc: 'img/menu/icon-wen.png',
        aText: '我的单据',
        divStyle: 'display: none;border: none;width: 200px;position: relative;z-index: 9999;font-size: 14px;text-align: left;line-height: 16px; top: 4px;left: 0px;',
        divCls: ''
    }, // 我要咨询
    'dan': {
        id: 'oftenUlDan',
        cls: '',
        aTitle: '我的单据',
        aCls: '',
        aImgSrc: 'img/menu/icon-wen.png',
        aText: '我的单据',
        divStyle: 'display: none;border: none;width: 200px;position: relative;z-index: 9999;font-size: 14px;text-align: left;line-height: 16px; top: 4px;left: 0px;',
        divCls: ''
    }, // 我的单据
    'zhu': {
        type: 'btn',
        id: 'oftenUlZhu',
        cls: '',
        aTitle: '请点击',
        aCls: '',
        aImgSrc: 'img/menu/icon-cha.png',
        aText: '我要查询'
    }, // 主题分析
    'jiankong': { // 动态监控，当前仅用于业务处室、主管部门
        type: 'btn',
        id: 'oftenUlJiankong',
        cls: '',
        aTitle: '动态监控',
        aCls: '',
        aImgSrc: 'img/menu/icon-jiankong.png',
        aText: '动态监控'
    }
};

/**
 * 获取页面菜单按钮html
 * @param types 数组
 * @param TODO objs 数组
 * @returns {string}
 */
dfpMenu.pageHtml = function (types, objs) {
    var menuHtml = '<li id="{id}" class="oftenUl-li {cls}">' +
        '               <a href="javascript:void(0);" title="{aTitle}" class="{aCls}">' +
        '                   <img src="{aImgSrc}">&nbsp;&nbsp;{aText}' +
        '               </a>' +
        // '               <div style="{divStyle}" class="box box-solid {divCls}">' +
        // '                   <div class="box-body no-padding" style="display: none;">' +
        // '                       <ul class="nav nav-pills nav-stacked"></ul>' +
        // '                   </div>' +
        // '               </div>' +
        '           </li>';
    var lihtml = '';
    for (var i in types) {
        if (!types.hasOwnProperty(i)) continue;
        var option = this.options[types[i]];
        // if(option.type && option.type == 'btn')
        //     ;
        lihtml += dfp.strFormat2(menuHtml, option);
    }
    return '<ul id="oftenUl">' + lihtml + '</ul>';
};
dfpMenu.menu = function (id, types) {
    var html = this.pageHtml(types);
    $("#" + id).html(html);
    // hover
    $("#oftenUl").find("li.oftenUl-li").each(function (i) {
        // 获取li类型判断hover图片
        var liType = $(this).prop("id").replace("oftenUl", "").toLowerCase();

        // TODO 暂时使用，仅用于不同显示下的图片切换
        if (liType == 'zhu') {
            liType = 'cha';
        } else if (liType == 'cha') {
            liType = 'bao';
        }

        $(this).on('mouseover', function () {
            $(this).find("a").find("img").prop("src", "img/menu/icon-" + liType + "-w.png");
            $(this).css({"background": "#108ee9", "color": "#FFFFFF"});
        }).on('mouseleave', function () {
            $(this).find("a").find("img").prop("src", "img/menu/icon-" + liType + ".png");
            $(this).css({"background": "#f8f8f8", "color": "#000000"});
        });
    });
};

