/**
 * 待办事项
 * <p>需要 dfp.js</p>
 */
var dfpDealing = dfpDealing || {};

// 代码示例
//<div class="cen2" style="height:220px;">
//	<div class="head-r2">
//		<span>待办事项</span>
//		<a id="dealingMore" class="_portal_cursor_pointer" style="color: #0000ee;text-align: center;font-family:微软雅黑;font-size: 14px !important;margin-top: 7px;">刷新</a>
//	</div>
//	<div id="m-content1">
//		<ul>
//			<!-- <li><span class="icon1"></span><a href="javascript:void(0);">财政直接支付退款入账通知书登记<span class="c-red">未登记1条</span></a></li> -->
//		</ul>
//	</div>
//</div>

dfpDealing = {
    get: function () {
    },
    /**
     * @params [setElementId] 展示ID
     * @params [pageType] 页面类型
     */
    show: function (setElementId, pageType) {
        setElementId = dfp_util.isNull(setElementId) ? "m-content1" : setElementId;
        $("#" + setElementId).html("");
        //if (pageType == dfp.page.JZZF || pageType == dfp.page.YWCS || pageType == dfp.page.GKJB || pageType == dfp.page.GKLD || pageType == dfp.page.GKZFSH) {
            $("#dealingRefreshCover").css("display", "block");
        //} else {
            $("#" + setElementId + "_loadinggif").css("display", "block");
        //}
        var data = this.get();
        var params = {
            tokenid: getTokenId(),
            userid: $("#svUserId", parent.document).val(),
            roleid: $("#svRoleId", parent.document).val(),
            region: $("#svRgCode", parent.document).val(),
            year: $("#svSetYear", parent.document).val()
        };
        var dealingThing = {};
        $.ajax({
            url: "/df/portal/getDealingThing.do",
            type: "GET",
            data: dfp.commonData(params),
            dataType: "json",
            success: function (data) {
                dealingThing = data.dealingThing;
                var isDfpMenuLv3Ok = setInterval(function () {
                    dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
                    if (dfp_menu_lv3 != null && dfp_menu_lv3 != undefined) {
                        clearTimeout(isDfpMenuLv3Ok);
                    }
                }, 100);
                dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));
                var dealingConfig = dfp_menu_lv3,
                    html = "",
                    urls = [];

                for (var i = 0, len = dealingThing.length || 0; i < len; i++) {

                    // 只显示 status_code = '001' || status_code为空
                    if(dealingThing[i]['status_code'] !== '001' && (!dfp.isNull(dealingThing[i]['status_code']))) {
                        continue;
                    }
                    
                    if(dealingThing[i]['menu_url']== '') {
                        continue;
                    }

                    var menuid = dealingThing[i].menu_id,
                        name = (dealingThing[i].menu_name).replace(/[\n]/g, ""),
                        showname = name;
                    var url = dealingThing[i].menu_url;
                    // 匹配targetMenuId，确定最终标签显示名
                    var targetMenuId = dfp_util.getUrlParameter(url, 'targetMenuId');
                    if (targetMenuId != null) {
                        menuid = targetMenuId;
                        var activeStatusCode = dfp_util.getUrlParameter(url, 'activeStatusCode');
                        showname = dfp_util.getUrlParameter(url, 'showName');
                        if (showname == null) {
                            showname = name;
                        }
                        for (var j in dfp_menu_lv3) {
                            if (!dfp_menu_lv3.hasOwnProperty(j)) {
                                continue;
                            }
                            var onemenu = dfp_menu_lv3[j];
                            if (menuid == onemenu.guid) {
                                name = onemenu.name;
                                url = onemenu.url;
                                if (activeStatusCode != null) {
                                    url += '&activetabcode=' + activeStatusCode;
                                }
                                break;
                            }
                        }
                    }
                    url = fullUrlWithTokenid(url) + '&menuid=' + menuid + '&menuname=' + escape(name);
                    urls.push(url);

                    var task = dealingThing[i].task_content;

                    //dfpDealingTaskCountFunc(task);
                    title = name + " " + task;
                    html += dfpDealing.html({name: name, url: url, task: task, title: title, showname: showname}, pageType);
                }

                // 拼接新dealing
                var outerHtml = ['<table style="width:100%;"><thead style="display: none;"><th>name</th><th>num</th></thead><tbody>', '</tbody></table>'];
                if (pageType == dfp.page.JB || pageType == dfp.page.SH) {
                    var dealingTimeout = setInterval(function () {
                        $("#dealingRefreshCover").css("display", "none");
                        $("#" + setElementId + "_loadinggif").css("display", "none");
                        $("#" + setElementId).html("").append(html ? outerHtml.join(html) : '<br>');
                        $("#" + setElementId).find("tr:gt(0)").each(function(i) {
                            $(this).on("click", function() {
                                window.parent.addTabToParent($(this).find("td:eq(0)").find("span:eq(1)").text(), urls[i]);
                            });
                        });
                        clearInterval(dealingTimeout);
                    }, 1000);
                } else {
                    var dealingTimeout = setInterval(function () {
                        $("#dealingRefreshCover").css("display", "none");
                        $("#" + setElementId).html("").append(html ? outerHtml.join(html) : '<br>');
                        $("#" + setElementId).find("tr:gt(0)").each(function(i) {
                            $(this).on("click", function() {
                                window.parent.addTabToParent($(this).find("td:eq(0)").find("span:eq(1)").text(), urls[i]);
                            });
                        });
                        clearInterval(dealingTimeout);
                    }, 1000);
                }
            },
            error: function () {
                $("#dealingRefreshCover").css("display", "none");
                $("#" + setElementId).find("ul").html("");
            }
        });

    },
    refresh: function () { // 部分更新
        this.show();
    },
    /**
     * 分页面生成HTML
     */
    html: function (data, pageType) {
        // 分
        var _task = data.task.split();
        // 分
        var _task = data.task.split("：");
        data.task = '<span>' + _task[1].split(" ")[0] + '</span>' + '条';

        // TODO 待办去掉“未处理”，添加虚拟中线，数字靠左显示
        var html = '';
        html += '<tr><td class="dealingContent1" title="' + data.showname + '">' + this.symbol.circle + '<span style="display:none;">' + data.name +'</span><span>' + data.showname + '</span>' + '</div></td><td class="c-red">' + data.task + '</td></tr>';
        return html;
    },
    /**
     * 行前标识
     */
    symbol: {
        circle: '<span style="color: #999999;margin-right: 13px;">•</span>'
    }

};

/**
 * TODO 待办新js
 */
dfpDealing.init = {};

/**
 * 获取全部待办事项数量
 */
var dfpDealingTaskCount = 0;

function dfpDealingTaskCountFunc(s) {
    s = s || "";
    s = s.split("：")[1];
    s = s.split(" ")[0];
    dfpDealingTaskCount += parseInt(s) || 0;
    window.setInterval(function () {
        var dfpDealingInter = window.setInterval(function () {
            if (dfpDealingTaskCount > 0) {
                window.parent.selfDocumentFade();
            } else {
                clclearInterval(dfpDealingInter);
            }
        });
    }, 2000);
}
