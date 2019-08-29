var menuThreeLevel = {},
    isMenuThreeLevelOk = 0,
    tokenId = "",
    roleList = roleList || {},
    centerDate;
var DFP_FISCAL_SELECTED_URL = "http://192.168.10.11:9999";

//即时通讯聊天工具 add by yanyga
var setRuleApp;

function getTokenId() {
    return sessionStorage.getItem("tokenid");
}

// 生成tab页
function addTabToParent(title, url) {
    if (title == "" || url == "") {
        //alert("data-title属性不能为空或data-href属性不能为空");
        return false;
    }
    var tokenId = getTokenId();
    title = dfp_re.space.removeAll(dfp_re.num.removeAll(title));

    var bStop = false,
        bStopIndex = 0,
        href = url,
        title = title,
        topWindow = $(window.parent.document),
        show_navLi = topWindow.find("#min_title_list li"),
        iframe_box = topWindow.find("#iframe_box");
    show_navLi.each(function () {
        if ($(this).find('span').attr("data-href") == href) {
            bStop = true;
            bStopIndex = show_navLi.index($(this));
            return false;
        }
    });
    if (!bStop) {
        creatIframe(href, title);
        min_titleList();
    } else {
        show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
        iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src", href);
    }
    scroll(0, 0);
}

//右上角我的单据图片闪烁
function selfDocumentFade() {
    $("#topDanju").find("img").show().fadeOut(500).fadeIn(500);
}

/**
 * 检测tokenid过期时导致子页面跳转到登录页
 */
function iframeLoadCheck() {
    var iframeSrc = $("#iframeDashboard").prop("src");
    if (iframeSrc.indexOf("/df/portal/login/login.html") > 0)
        window.location.href = "/df/portal/login/login.html";
}

var pt_index = {
    bf: function () {
        //top栏事件
        $(".nav .dropdown a").click(function () {
            var i = $(this).parent("li").index();
            $(".toggle").each(function () {
                $(this).hide();
            });
            if (!$(".toggle").eq(i).hasClass("null")) {
                $(".toggle").eq(i).show();
            }
        });
        $(".toggle").mouseleave(function () {
            $(".toggle").each(function () {
                $(this).hide();
            });
        });

        // 右上三图标
//		$("#topDanju").click(function() {
//			addTabToParent("我的单据", "/df/sd/pay/order/order.html?billtype=366&busbilltype=322&menuid=2E8B00AE30A562200CC558307069B4D9&menuname=%u6211%u7684%u5355%u636E&wfStatus=201&tokenid="+getTokenId());
//		});
        $("#topXiaoxi").click(function () {
            $(this).find("span#topXiaoxiMore").hide();
            //addTabToParent("消息提醒", "http://www.baidu.com");
        });
    },
    init: function () {
        this.bf();
        var caroleguid = sessionStorage.select_role_guid == undefined ? "" : sessionStorage.select_role_guid,
            agencyCode = sessionStorage.select_agency_code == undefined ? "" : sessionStorage.select_agency_code;
        if (!sessionStorage.tokenid) {
            window.location.href = "/df/portal/login/login.html";
            return false;
        }
        $.ajax({
            url: "/df/portal/initIndex.do",
            type: "GET",
            data: {
                "tokenid": getTokenId(),
                "caroleguid": Base64.encode(caroleguid),
                "agencyCode": Base64.encode(agencyCode)
            },
            dataType: "json",
            success: function (data) {

                //portal.co.tokenid.isValid(data.msg);
                portal.pp.hiddenLabel(data.publicParam);
                portal.pp.commonData(data.publicParam);

                // 用户名
                $("#usernameTop").html(data.publicParam.svUserName);

                // 单位/处室
                if (data.publicParam.svAgencyName) {
                    $("#agencyameTop").text(data.publicParam.svAgencyName);
                } else {
                    $("#agencyameTop").parent("a").css("display", "none");
                }
                //portal.ag.show(data.elename, data.agencyList);

                // 角色
                portal.role.show(data.roleList);
                // 时间
                portal.co.time.current();

                // menu config
                //$("#menuConfigKN").click(function(){ window.open("/df/portal/portalManager/home.html?tokenid="+getTokenId(), "菜单配置-测试")});

                // 业务处室隐藏顶部“我的单据”
                if (data.dashboardUrl.indexOf("dashboardYWCS") < 0)
                    $("#topDanju").css("visibility", "visible");
                /*//单位用户隐藏"我的单据"
                if(data.dashboardUrl.indexOf("dashboardJB") > 0){
                    $("#topDanju").css("visibility", "hidden");
                }*/

                /**
                 * 检测tokenid过期时导致子页面跳转到登录页
                 */
                $("#iframeDashboard").on("load", function () {
                    var iframeSrc = $("#iframeDashboard").prop("src");
                    if (iframeSrc.indexOf("/df/portal/login/login.html") > 0)
                        window.location.href = "/df/portal/login/login.html";
                });
                $("#iframeDashboard").prop("src", data.dashboardUrl);

                portal.menu.show();

            },
            error: function () {
                window.location.href = "/df/portal/login/login.html";
            }
        });
    }
};

/**
 * common: tokenid time
 */
var pt_common = {
    tokenid: {
        isValid: function (msg) {
            if (msg == "tokenid_passed") {
                alert("tokenId 已失效，请重新登录");
                portal.user.logout();
                window.location.href = "/df/portal/login/login.html";
                return;
            }
        }
    },
    time: {
        current: function () {
            //portalTopTime();
            var _xx = setInterval(function () {
                portalTopTime();
            }, 1000);
        }
    }
}

/**
 * public params
 */
var pt_pubparams = {
    commonData: function (data) {
        sessionStorage.select_role_guid = Base64.decode($("#svRoleId").val());
        sessionStorage.select_agency_code = Base64.decode($("#svAgencyCode").val());
        var _data = JSON.stringify(data);
        if (!sessionStorage.commonData) {
            sessionStorage.commonData = _data;
        } else {
            sessionStorage.commonData = _data;
        }
    },
    hiddenLabel: function (data) {
        if (!data || data.svFiscalPeriod == undefined) {
            window.location.href = "/df/portal/login/login.html";
        }
        $("#svFiscalPeriod").val(dfp_util.base64.encode(data.svFiscalPeriod));	// 会计期间
        $("#svMenuId").val(dfp_util.base64.encode(data.svMenuId));	// 菜单ID
        $("#svRgCode").val(dfp_util.base64.encode(data.svRgCode));	// 区划CODE
        $("#svRgName").val(dfp_util.base64.encode(data.svRgName));	// 区划ID
        $("#svRoleCode").val(dfp_util.base64.encode(data.svRoleCode));	// 角色CODE
        $("#svRoleId").val(dfp_util.base64.encode(data.svRoleId));	// 角色ID
        $("#svRoleName").val(dfp_util.base64.encode(data.svRoleName));	// 角色名称
        $("#svSetYear").val(dfp_util.base64.encode(data.svSetYear));	// 年度
        $("#svTransDate").val(dfp_util.base64.encode(data.svTransDate));	// 业务日期
        $("#svUserCode").val(dfp_util.base64.encode(data.svUserCode));	// 用户CODE
        $("#svUserId").val(dfp_util.base64.encode(data.svUserId));	// 用户ID
        $("#svUserName").val(dfp_util.base64.encode(data.svUserName));	// 用户名称
        $("#svAgencyId").val(dfp_util.base64.encode(data.svAgencyId));	// 单位Id
        $("#svAgencyCode").val(dfp_util.base64.encode(data.svAgencyCode));	// 单位用户登录为单位Code，业务处室用户登录为业务处室code
        $("#svAgencyName").val(dfp_util.base64.encode(data.svAgencyName));	// 单位名称
        $("#svDivision").val(dfp_util.base64.encode(data.svDivision));	// df
        $("#svBelongOrg").val(dfp_util.base64.encode(data.svBelongOrg));	// df
        $("#svUserType").val(dfp_util.base64.encode(data.svUserType));	// 用户类型
    }
};

/**
 * agency
 */
var pt_agency = {
    bf: function () {
        // 单位选择
//		$('body').off('click').on('click','#department',function(e){
//			var displayCss = $("#userDanweiTreeDiv").css("display");
//			if(displayCss=='none'){
//				portal.ag.tree();
//				$("#userDanweiTreeDiv").show();
//				e = e || event;
//				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
//				window.onclick = function() {
//					$("#department").unbind("click");
//					$("#userDanweiTreeDiv").hide();
//				}
//			}else{
//				$("#userDanweiTreeDiv").hide();
//			}
//		});
//		$("#userDanweiTreeDiv").bind("click", function(e) {
//			e = e || event;
//			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
//		});
        // 单位选择确认
//		$("#userDanweiSelectSubmit").click(function(){
//			var treeObj = $.fn.zTree.getZTreeObj("userDanweiTree");  
//            var selectedNode = treeObj.getSelectedNodes()[0];
//            if(!selectedNode){
//            	return;
//            }
//            $("#userDanweiTreeDiv").hide();
//		});
//		$("#userDanweiSelectClose").click(function(){
//			$("#userDanweiTreeDiv").hide();
//		});
        $("#userDanweiLi").click(function (e) {
            var $div = $(this).find("div#userDanweiTreeDiv");
            display = $div.css("display");
            display == "block" ? $div.hide() : $div.show();
            e = e || event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });
        $("#userDanweiTreeDiv, #userDanweiLi").mouseleave(function (e) { //#switchRoleLi,
            $("#userDanweiTreeDiv").hide();
            e = e || event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });

    },
    tree: function () {
        this.bf();
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: false,
                selectedMulti: false,
                showIcon: false
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: ""
                }
            },
            callback: {
                onDblClick: function (event, treeId, treeNode) {
                    $("#userDanweiSelectSubmit").click();
                }
            }
        };
        $.ajax({
            url: "/df/portal/getAllCompony.do",	// 获取用户全部单位信息
            type: "GET",
            data: {"tokenid": getTokenId(), "userid": $("#svUserId").val()},
            dataType: "json",
            success: function (data) {
                var componyList = data.componyList;
                var zNodes = [];
                for (var i in componyList) {
                    if (!componyList.hasOwnProperty(i)) {
                        continue;
                    }
                    zNodes.push({
                        id: componyList[i].chr_id,
                        pId: componyList[i].parent_id,
                        name: (componyList[i].chr_code + " " + componyList[i].chr_name)
                    });
                }
                var treeObj = $.fn.zTree.init($("#userDanweiTree"), setting, zNodes);
                treeObj.expandAll(true);
            }
        });
    },
    show: function (elename, agencyList) {
        $("#userDanweiTree").html("");
        var html = "",
            tempWidth = 0,
            agencySwitchDivWidth = 200, // 单位下拉框默认宽度
            codes = [];
        // 单位用户从top栏选择，业务处室用户从各自工作页面的支出进度上方选择
        var select_agency_code = sessionStorage.select_agency_code || "";
//		var all_options1 = {
//			"element": "AGENCY",
//			"tokenid": getTokenId(),
//			"ele_value": ""
//		};
//		$.ajax({
//			url: "/df/dic/dictree.do",
//			type : "GET",
//			data: dfp.commonData(all_options1),
//			dataType : "json",
//			async : false,
//			success : function(data) {
//				var agencyList = data.eleDetail;
        if (elename == "AGENCY") {
            html += '<div class="dropdown-menu" id="userDanweiTreeDiv" style="width:auto; right: 0px !important;z-index:99;top:38px;">';
            html += '<ul class="dMenuInfo" id="userDanweiTree">';
            for (var i in agencyList) {
                if (!agencyList.hasOwnProperty(i)) {
                    continue;
                }
                agencySwitchDivWidth = (tempWidth = agencyList[i].chr_name.length * 14 + 30) > agencySwitchDivWidth ? tempWidth : agencySwitchDivWidth;
                var name = dfp_re.space.removeAll(dfp_re.num.removeAll((agencyList[i]).chr_name));
                //name = (select_agency_code == agencyList[i].chr_code ? "✔ " : "") + name ;
                if (select_agency_code == agencyList[i].chr_code) {
                    $("#agencyameTop").text(name);
                    name = "✔ " + name;
                    $("#svAgencyCode").val(Base64.encode(agencyList[i].chr_code));
                    sessionStorage.setItem("select_agency_code", agencyList[i].chr_code);
                }
                html += '<li><a href="javascript:switchAgencyConfirm(&quot;' + (agencyList[i]).chr_code + '&quot;,&quot;' + name + '&quot;);">' + name + '</a></li>';
            }
            html += '</ul></div>';
            if (agencyList == null || agencyList.length == 0) {
                $("#userDanweiDownImg").hide();
            } else {
                //$("#userDanweiTree").html(html);
                $("#_department").append(html);
                $("#userDanweiTreeDiv").css("width", agencySwitchDivWidth + "px");
            }
        } else if (elename == "MB") {
            $("#userDanweiDownImg").hide();
            localStorage.setItem("agencyList", JSON.stringify(agencyList));
        }
//			}
//		});
        this.bf();

    },
    /**
     * 切换单位
     */
    _switch: function (agencyCode, agencyName) {
        if (agencyCode == Base64.decode($("#svAgencyCode").val())) {
            return;
        }
//		$.ajax({
//			url : "/df/portal/switchAgencyConfirm.do",
//			type : "GET",
//			data : {"tokenid" : getTokenId(), "agencyCode" : agencyCode},
//			dataType: "json",
//			success : function(data) {
//				sessionStorage.setItem("select_agency_code", agencyCode);
//				window.location.href = "/df/portal/admin/index/index.html";
//			}
//		});
        sessionStorage.setItem("select_agency_code", agencyCode);
        window.location.href = "/df/portal/admin/index/index.html";
    }
};

/**
 * role
 */
var pt_role = {
    bf: function () {
        $("#switchRoleLi").click(function (e) {
            //$("#switchRoleLi").mouseover(function(e){
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
        $("#roleSwitchDiv, #switchRoleLi").mouseleave(function (e) { //#switchRoleLi,
            $("#roleSwitchDiv").hide();
            e = e || event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });
    },
    show: function (roleList) {
        this.bf();
//		if(dfp_util.isNull(roleList)){
//			$.ajax({
//				url : "/df/portal/switchRole.do",
//				type : "GET",
//				dataType : "json",
//				data : {"tokenid" : getTokenId()},
//				async: false,
//				success : function(data) {
//					roleList = data.rlist;
//				}
//			});
//		}

        $("#roleSwitch").html("");
        var html = "",
            tempWidth = 0,
            roleSwitchDivWidth = 190; // 角色下拉框默认宽度
        var select_role_guid = sessionStorage.select_role_guid || "";
        for (var i in roleList) {
            if (!roleList.hasOwnProperty(i)) {
                continue;
            }
            roleSwitchDivWidth = (tempWidth = roleList[i].role_NAME.length * 13) > roleSwitchDivWidth ? tempWidth : roleSwitchDivWidth;
            var name = dfp_re.space.removeAll(dfp_re.num.removeAll((roleList[i]).role_NAME));
            name = (select_role_guid == roleList[i].role_ID ? "✔ " : "") + name;
            html += '<li><a href="javascript:switchRoleConfirm(&quot;' + (roleList[i]).role_ID + '&quot;);">' + name + '</a></li>';
        }
        $("#roleSwitch").html(html);
        $("#roleSwitchDiv").css("width", roleSwitchDivWidth + "px");
        if (roleList != null && roleList.length == 1) {
            $("#switchRoleLi").css("display", "none");
        }

    },
    _switch: function (roleid) {
        if (roleid == Base64.decode($("#svRoleId").val())) {
            return;
        }
        $.ajax({
            url: "/df/portal/switchRoleConfirm.do",
            type: "GET",
            data: {"tokenid": getTokenId(), "roleid": roleid},
            dataType: "json",
            success: function (data) {
                sessionStorage.setItem("select_role_guid", roleid);
                sessionStorage.setItem("tokenid", data.tokenid);
                window.location.href = "/df/portal/admin/index/index.html";
            }
        });
    }
};

/**
 * menu
 */
var pt_menu = {
    level3: function (menuList) {
        menuThreeLevel = {
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
                menuThreeLevel.menuFirstLevelList[n1] = menuList[i];
                n1++;
            } else if (menuList[i].levelno == baseNo + 1) {
                menuThreeLevel.menuSecondLevelList[n2] = menuList[i];
                n2++;
            } else if (menuList[i].levelno == baseNo + 2) {
                menuThreeLevel.menuThirdLevelList[n3] = menuList[i];
                n3++;
            } else if (menuList[i].levelno == baseNo + 3) {
                menuThreeLevel.menuFourthLevelList[n4] = menuList[i];
                n4++;
            } else if (menuList[i].levelno == baseNo + 4) {
                menuThreeLevel.menuFivthLevelList[n5] = menuList[i];
                n5++;
            }
        }
        if (menuThreeLevel.menuFirstLevelList != null && menuThreeLevel.menuFirstLevelList.length > 0) {
            // 0/1/2
        } else if (menuThreeLevel.menuSecondLevelList != null && menuThreeLevel.menuSecondLevelList.length > 0) {
            menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuSecondLevelList;
            menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuThirdLevelList;
            menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFourthLevelList;
        } else if (menuThreeLevel.menuThirdLevelList != null && menuThreeLevel.menuThirdLevelList.length > 0) {
            menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuThirdLevelList;
            menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuFourthLevelList;
            menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFivthLevelList;
        }
        return menuThreeLevel;
    },
    html: function () {
        var menuFirstLevelList = menuThreeLevel.menuFirstLevelList;
        var menuSecondLevelList = menuThreeLevel.menuSecondLevelList;
        var menuThirdLevelList = menuThreeLevel.menuThirdLevelList;
        sessionStorage.setItem("dfp_menu_all", JSON.stringify(menuThreeLevel));
        sessionStorage.setItem("dfp_menu_lv3", JSON.stringify(menuThirdLevelList));

        var menuListHtml = '<li class="treeview">';
        menuListHtml += '<a href="javascript:void(0);">';
        menuListHtml += '<i class="fa fa-desktop"></i>';
        menuListHtml += '<span>我的工作台</span>';
        menuListHtml += '</a></li>';
        var _tokenid = "";
        var menuFirstLevelListLength = dfp_util.isNull(menuFirstLevelList) ? 0 : menuFirstLevelList.length;
        // 一级菜单
        for (var i = 0; i < menuFirstLevelListLength; i++) {
            var menuFirstLevelListName = dfp.removeNumFromStr(menuFirstLevelList[i].name);
            menuListHtml += '<li class="treeview">';
            menuListHtml += '<a href="javascript:void(0);">';
            menuListHtml += '<i class="fa fa-leaf"></i>';
            menuListHtml += '<span>' + menuFirstLevelListName + '</span><span class="pull-right-container"><i class="fa fa-angle-right pull-right"></i></span></a>';
            menuListHtml += '<div class="two-level treeview-menu">';

            // 二级菜单
            for (var j in menuSecondLevelList) {
                if (menuSecondLevelList[j].parentid == null || menuSecondLevelList[j].parentid == ""
                    || menuSecondLevelList[j].parentid != menuFirstLevelList[i].guid) {
                    continue;
                }
                var menuSecondLevelListName = dfp.removeNumFromStr(menuSecondLevelList[j].name);
                menuListHtml += '<dl class="two-level-item">';
                menuListHtml += '<dt class="two-level-tit">';
                menuListHtml += menuSecondLevelListName + '&nbsp;&nbsp;';
                menuListHtml += '</dt>';
                menuListHtml += '<dd class="two-level-detail">';

                // 三级菜单
                for (var k in menuThirdLevelList) {
                    if (menuThirdLevelList[k].parentid == null || menuThirdLevelList[k].parentid == ""
                        || menuThirdLevelList[k].parentid != menuSecondLevelList[j].guid) {
                        continue;
                    }
                    var _url = menuThirdLevelList[k].url;
                    if (_url == null || _url == "" || _url == undefined) {
                        _url = "";
                    } else {
                        //_url = (menuThirdLevelList[k].url).replace(/\s/g, "");
                        _url = dfp.removeNumFromStr(menuThirdLevelList[k].url);
                    }
                    _url += (_url.indexOf("?") != -1 ? "&tokenid=" : "?tokenid=") + getTokenId();
                    var menuThirdLevelListName = dfp.removeNumFromStr(menuThirdLevelList[k].name);
                    _url += '&menuid=' + menuThirdLevelList[k].guid + '&menuname=' + encodeURI(menuThirdLevelListName);
                    menuListHtml += '<a class="_portal_recent_menu_add_a" href="javascript:void(0);" data-title="' + menuThirdLevelListName + '" data-href="' + _url + '" >' + menuThirdLevelListName + '</a>';
                }
                menuListHtml += '</dd></dl>';
            }
            menuListHtml += '</div>';
        }
        menuListHtml += '</li>';
        $("#_sidebar_menu").append(menuListHtml);
    },
    event: function () {
        //页签
        $(".two-level-detail a").click(function () {
            var href = $(this).attr('data-href'),
                title = $(this).attr("data-title");
            if (title == "" || href == "") {
                alert("data-title属性不能为空或data-href属性不能为空");
                return false;
            }
            Hui_admin_tab($(this));
            $("#min_title_list li i").addClass('fa fa-times');
            $(this).parents('.two-level').hide();
        });
        $("li.treeview >a").on("click", function (e) {
            e.preventDefault();
        });
        $("li.treeview >a").on("mouseover", function (e) {
            if ($(this).parent("li").index() == 0) {
                $(".two-level").each(function () {
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
            $(".two-level").each(function () {
                $(this).hide();
            });
            var i = $(this).parent("li").index();
            if (!$(".two-level").eq(i - 1).hasClass("null")) {
                $(".two-level").eq(i - 1).slideDown();
            }
        });
        $("li.treeview >a").on("mouseout", function (e) {
            e = window.event || e;
            var s = e.toElement || e.relatedTarget;
            if (document.all) {
                if (this.contains(s)) {
                    return;
                }
            } else {
                var reg = this.compareDocumentPosition(s);
                if ((reg == 20 || reg == 0)) {
                    return;
                }
            }
        });
        $(".two-level").mouseleave(function () {
            $(".two-level").each(function () {
                $(this).slideUp();
            })
        });
    },
    show: function () {
        var caroleguid = sessionStorage.select_role_guid == undefined ? "" : sessionStorage.select_role_guid;
        $.ajax({
            url: "/df/portal/getMenuByRole.do",
            type: "GET",
            data: {"tokenid": getTokenId(), "caroleguid": Base64.encode(caroleguid)},
            dataType: "json",
            success: function (data) {
                pt_menu.level3(data.mapMenu);
                pt_menu.html();
                isMenuThreeLevelOk = 1;
                pt_menu.event();
                // 右上角 我的单据
                topRightMyDanju();
            }
        });
    }
};

function fullUrlWithTokenid(url, param) {
    if (param == "" || param == null || param == undefined)
        param = "_x=1";
    url = url.replace(/\s/g, ""); // 去除全部空格
    if (url.indexOf("?") > -1)
        url = url + "&" + param;
    if (url.indexOf("?") < 0)
        url = url + "?" + param;
    return url + "&tokenid=" + getTokenId();
}

function topRightMyDanju() {
    // 获取当前角色全部的三级菜单
    var isDfpMenuLv3Ok = setInterval(function () {
        dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
        if (dfp_menu_lv3 != null && dfp_menu_lv3 != undefined) {
            clearTimeout(isDfpMenuLv3Ok);
        }
    }, 100);
    dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
    // 匹配
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
    var html = "",
        name = [],
        url = [];
    for (var i = 0; i < givenMenu.length; i++) {
        for (var j in dfp_menu_lv3) {
            if (!dfp_menu_lv3.hasOwnProperty(j)) {
                continue;
            }
            var onemenu = dfp_menu_lv3[j];
            if (onemenu.code == givenMenu[i]) {
                name.push(dfp_re.space.removeAll(dfp_re.num.removeAll(onemenu.name)));
                url.push(fullUrlWithTokenid(onemenu.url) + '&menuid=' + onemenu.guid + '&menuname=' + escape(onemenu.name));
                html += '<li class="list-group-item topDanjuMenu" style="cursor:pointer;text-align: center;">' + dfp_re.space.removeAll(dfp_re.num.removeAll(onemenu.name)) + '</li>';
            }
        }
    }

    // 事件
    if (url.length == 0) {
        return false;
    }
    if (url.length == 1) {
        $("#topDanju").click(function () {
            addTabToParent(name[0], url[0]);
        });
        return false;
    }

    // 渲染
    $("#topDanjuMenu").html("").append(html);
    $("#topDanjuMenu").find("li").each(function (i) {
        $(this).mouseover(function () {
            $(this).css("color", "#0089DB").css("backgroud", "#F5F5F5");
        }).mouseleave(function () {
            $(this).css("color", "#333333").css("backgroud", "inline-block");
        });
    });
    $(".topDanjuMenu").mouseover(function () {
        $("#topDanjuMenu").css("display", "block");
    }).mouseleave(function () {
        $("#topDanjuMenu").css("display", "none");
    });
    $("#topDanjuMenu").mouseleave(function () {
        $("#topDanjuMenu").css("display", "none");
    });
    $("#topDanjuMenu").find("li").each(function (i) {
        $(this).click(function (e) {
            e.preventDefault();
            $("#topDanjuMenu").css("display", "none");
            addTabToParent($(this).text(), url[i]);
        });
    });
}

/**
 * user management
 */
var pt_user = {
    bf: function () {
        $("#usernameTopLi").click(function (e) {
            var $div = $(this).find("div#usernameTopDiv");
            display = $div.css("display");
            display == "block" ? $div.hide() : $div.show();
            e = e || event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });
        $("#usernameTopDiv, #usernameTopLi").mouseleave(function (e) {
            $("#usernameTopDiv").hide();
            e = e || event;
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
        });
        usernameTopDoUrl = [
            "/df/portal/admin/index/dChangePwd.html?tokenid=" + getTokenId()
        ];
        $("#usernameTopDo").find("li").each(function (i) {
            $(this).click(function () {
                addTabToParent(this.innerText, usernameTopDoUrl[i]);
            });
        });
    },
    logout: function () {
        var tokenId = getTokenId();
        // 清空当次访问产生的页面临时数据
        sessionStorage.tokenid = "";
        sessionStorage.select_role_guid = "";
        sessionStorage.select_agency_code = "";
        sessionStorage.dfp_menu_lv3 = "";
        sessionStorage.dfp_menu_all = "";
        sessionStorage.commonData = "";
        // 延时退出
        //setInterval(function() {
        $.ajax({
            url: "/df/login/loginout.do",
            type: "GET",
            data: {"tokenid": tokenId},
            dataType: "json",
            success: function (data) {
                var flag = data.flag;
                if (flag == 1) {
                    window.location.href = "/df/portal/login/login.html";
                }
            }
        });
        //}, 1000);
    }
};

function logout() {
    layer.confirm('是否确认退出？', {
        title: '退出提示',
        btn: ['退出', '取消'] //按钮
    }, function () {
        portal.user.logout();
    }, function () {
        layer.closeAll();
    });
}

/**
 * 切换角色
 */
function switchRoleConfirm(roleid) {
    portal.role._switch(roleid);
}

/**
 * 切换单位
 */
function switchAgencyConfirm(agencyCode, agencyName) {
    pt_agency._switch(agencyCode, agencyName);
}

/**
 * 刷新工作台待办条目数量
 * @params menuid 待办menuid
 */
function refreshDealingDashboard(menuid) {
    //iframeDashboard.window.refreshDealingDashboardPart(menuid);
}

/**
 * 页面顶部时间显示
 */
function portalTopTime() {
    _timestamp = Date.parse(centerDate);
    _timestamp = _timestamp.toString().match(/^\d$/) ? _timestamp : new Date().getTime();
    curDate = new Date(_timestamp);
    _hour = curDate.getHours();
    _minutes = curDate.getMinutes();
    _seconds = curDate.getSeconds();
    if (_hour < 10) {
        _hour = "0" + _hour;
    }
    if (_minutes < 10) {
        _minutes = "0" + _minutes;
    }
    if (_seconds < 10) {
        _seconds = "0" + _seconds;
    }
    $("#_currenttime_index_top").html(curDate.getFullYear() + '年' + (curDate.getMonth() + 1) + '月' + curDate.getDate() + '日' + '&nbsp;&nbsp;' + curDate.getHours() + ":" + _minutes + ":" + _seconds);
    centerDate += 1000;
}

/**
 * 获取菜单渲染完成标识
 */
function isParentMenuLoadOk() {
    return isMenuThreeLevelOk;
}

/**
 * fiscal 循环检查是否有点击事件
 */
function isDfFiscalSelectedUrl() {
    var dfFiscalSelectedUrl = "",
        // 外网
        dfFiscalIPPort = "http://192.168.10.11:9090/ESEN/showreport.do";
    // 内网
    //dfFiscalIPPort = "http://127.0.0.1:9090/ESEN/showreport.do";
    var dfFiscalTimeout = setTimeout(function () {
        dfFiscalSelectedUrl = window.sessionStorage.getItem("dfFiscalSelectedUrl");
        if (!dfp_util.isNull(dfFiscalSelectedUrl)) {
            nameUrl = dfFiscalSelectedUrl.split("___"); // ip:port/name___&&
            // TODO 链接
            //url = DFP_FISCAL_SELECTED_URL + nameUrl[1];
            addTabToParent((nameUrl[0].split("="))[1], dfFiscalIPPort + nameUrl[1]);
            window.sessionStorage.set("dfFiscalSelectedUrl", "");
        }
    }, 500);
    // clearTimeout(dfFiscalTimeout);
}

function Portal() {
    this.index = pt_index;
    this.co = pt_common;
    this.pp = pt_pubparams;
    this.ag = pt_agency;
    this.role = pt_role;
    this.menu = pt_menu;
    this.user = pt_user;
}

var portal = new Portal();

$(function () {
    // 服务器时间
    centerDate = $.ajax({async: false}).getResponseHeader("Date");
    portal.index.init();
    portal.user.bf();
});
