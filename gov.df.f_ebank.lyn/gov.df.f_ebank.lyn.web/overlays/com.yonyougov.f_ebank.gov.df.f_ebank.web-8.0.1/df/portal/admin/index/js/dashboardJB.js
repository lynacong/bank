/**
 * page key
 */
//var SERVER_URL = "";
//var SERVER_URL = "";
var ptd_jb_obj_chaUrl = "http://10.28.5.155:8080";
var ptd_jb_obj_chaParam = "&id=admin&pw=admin&showmenu=false&fasp_t_agency_id=" + Base64.decode($("#svAgencyId", parent).val());
var ptd_dwjb_obj = {
    oftenUrl: {
        "0": [
            // 新 现金业务
            "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=" + encodeURI("现金业务") + "&type=AN",
            // 新 普通转账
            "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=" + encodeURI("普通转账") + "&type=PT",
            // 新 代扣代缴
            "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=" + encodeURI("代扣代缴") + "&type=DK",
            // 新 柜台缴税
            "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=" + encodeURI("柜台缴税") + "&type=GT",
            // 新 批量支付
            "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=" + encodeURI("批量支付") + "&type=PLZF",
            // 新 公务卡
            "/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=" + encodeURI("公务卡") + "&type=GWK",
            // 政府采购
            "/df/sd/pay/centerpay/input/paAccreditBillInputZFCG.html?billtype=366&busbilltype=322&menuid=C9028BFD7E0826FD3FBC3EFC213D83A1&menuname=" + encodeURI("政府采购") + ""
        ],
        "1": [
            // 额度到账通知书
            "/df/pay/plan/bills/plAgentenRegister.html?menuid=14C5F873520F87F22EEB06FCEB4950BD&menuname=%u5355%u4F4D%u989D%u5EA6%u5230%u8D26%u901A%u77E5%u4E66%u767B%u8BB0%0A&tokenid=" + getTokenId(),
            // 授权支付退款通知书
            "/df/pay/centerpay/bills/paAccountBillRegister.html?billtype=365&menuid=F572C1F1142AD82C3663F1B3768A6E32&menuname=%u6388%u6743%u652F%u4ED8%u51ED%u8BC1%u9000%u6B3E%u56DE%u5355%u767B%u8BB0&tokenid=" + getTokenId(),
            // 授权支付入账通知书
            "/df/pay/centerpay/bills/paAccountBillRegister.html?menuid=02BF79AF73F700B10A9D4B7DE442681C&menuname=%u6388%u6743%u652F%u4ED8%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid=" + getTokenId(),
            // 授权支付退款入账通知书
            "/df/pay/centerpay/bills/paFundReturnBill.html?menuid=451C4DA34F040F0CF0626223D0ABCF3E&menuname=%u6388%u6743%u652F%u4ED8%u9000%u6B3E%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid=" + getTokenId(),
            // 直接支付入账通知书
            "/df/pay/centerpay/bills/paAccountBillRegister.html?menuid=2C7C442EF357E721C948CF59521DB3CE&menuname=%u8D22%u653F%u76F4%u63A5%u652F%u4ED8%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid=" + getTokenId(),
            // 直接支付退款入账通知书
            "/df/pay/centerpay/bills/paAccountBillRegister.html?billtype=365&menuid=4726D8EB91D92438B8FAC33F0B9E3247&menuname=%u8D22%u653F%u76F4%u63A5%u652F%u4ED8%u9000%u6B3E%u5165%u8D26%u901A%u77E5%u4E66%u767B%u8BB0&tokenid=" + getTokenId()
        ],
        "2": [
            // 财政直接支付申请书查询
            "" + getTokenId(),
            // 财政授权支付凭证查询
            "" + getTokenId(),
            // 指标明细查询
            ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$MMOWUNDUXN03OUXMKF5YM3MI45M8U4TZ$1$C5IL13357KQP6FU5KZFJLRKCLU5CKLXM.rpttpl&tokenid=" + getTokenId() + ptd_jb_obj_chaParam,
            // 支付明细查询
            ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$KWNVUEM4LRCOXZLWK9SO3MLNNSWYO5DK$1$UMUYSPL6E5TUSZRMKWZMTKSIOXMKCK8U.rpttpl&tokenid=" + getTokenId() + ptd_jb_obj_chaParam,
            // 预算执行情况查询
            ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$UYXTC5MKUMYXULKY73LN5QXW78YSQYM1$1$TC3B0QM8DMNVUC3CUKC1ZVK86OCJMAIK.rpttpl&tokenid=" + getTokenId() + ptd_jb_obj_chaParam,
            // 国库集中支付年终结余资金对账单
            ptd_jb_obj_chaUrl + "/bi422-20160603/showreport.do?resid=EBI$12$MVURSBULV1UKITVV60L1XKMI4LVOI238$1$8UNKFCC5XLXNCNFUQ0NRIJJ9O9UQDOAL.rpttpl&tokenid=" + getTokenId() + ptd_jb_obj_chaParam,
            // 预算单位分预算项目查询
            "" + getTokenId()
            // 自定义查询
            //""+getTokenId()
        ],
        "3": [
            // 操作手册
            "" + getTokenId(),	// 邹锦涛 提供
            // 操作规范
            "/doc/paybusiness/article.html?tokenid=" + getTokenId(),
            // 公务卡
            "" + getTokenId(),	// 张明辉 提供
            // 支付签章
            "" + getTokenId(),	// 张明辉 提供
            // 凭证查询
            "" + getTokenId(),	// 张明辉 提供
            // 凭证打印
            "" + getTokenId(),	// 张明辉 提供
            // 资金监控
            "" + getTokenId(),	// 张明辉 提供
            // 其他
            "" + getTokenId()	// 张明辉 提供
        ]
    },
    dealing: {
        title: [
            "单位额度到账通知书登记",
            "授权支付退款通知书",
            "财政授权支付入账通知书登记",
            "财政授权支付退款入账通知书登记",
            "财政直接支付入账通知书登记",
            "财政直接支付退款入账通知书",
            "授权支付凭证经办人签私章",
            "集中支付监控反馈"
        ],
        menuid: [
            //"单位额度到账通知书登记",
            "14C5F873520F87F22EEB06FCEB4950BD",
            //"授权支付退款通知书",
            "7B4D1BA03A0AB37310660E90B98193D5",
            //"财政授权支付入账通知书登记",
            "02BF79AF73F700B10A9D4B7DE442681C",
            //"财政授权支付退款入账通知书登记",
            "F572C1F1142AD82C3663F1B3768A6E32",
            //"财政直接支付入账通知书登记",
            "2C7C442EF357E721C948CF59521DB3CE",
            //"财政直接支付退款入账通知书"
            "4726D8EB91D92438B8FAC33F0B9E3247",
            //"授权支付凭证经办人签私章"
            "9588FA171826EE5F56C82AEF1C474E01",
            // 集中支付监控反馈
            "84BDA9DC0F327C1435434CD228DAD0D0"
        ]
    }
};

/**
 * 常用操作
 */
var ptd_dwjb_often = {
    bf: function () {
        // 常用操作-div层显示
        $(".hid").mouseover(function () {
            //$(this).css({"background":"#D9EDF7"});
            $(this).css({"background": "#108EE9"});
            var imgPath = $(this).find("a").find("img").prop("src");
            if (imgPath.indexOf("ban") > 0) {
                imgPath = "img/menu/icon-ban2-w.png";
            }
            if (imgPath.indexOf("deng") > 0) {
                imgPath = "img/menu/icon-deng-w.png";
            }
            if (imgPath.indexOf("cha") > 0) {
                imgPath = "img/menu/icon-cha-w.png";
            }
            if (imgPath.indexOf("wen") > 0) {
                imgPath = "img/menu/icon-wen-w.png";
            }
            if (imgPath.indexOf("bao") > 0) {
                imgPath = "img/menu/icon-bao-w.png";
            }
            $(this).find("a").find("img").prop("src", imgPath);
            $(this).find("a").find("span").css("color", "#FFFFFF");
            $(this).find("div").css({"display": "block"});
        }).mouseleave(function () {
            $(this).css({"background": "#F8F8F8"});
            var imgPath = $(this).find("a").find("img").prop("src");
            if (imgPath.indexOf("ban") > 0) {
                imgPath = "img/menu/icon-ban2.png";
            }
            if (imgPath.indexOf("deng") > 0) {
                imgPath = "img/menu/icon-deng.png";
            }
            if (imgPath.indexOf("cha") > 0) {
                imgPath = "img/menu/icon-cha.png";
            }
            if (imgPath.indexOf("wen") > 0) {
                imgPath = "img/menu/icon-wen.png";
            }
            if (imgPath.indexOf("bao") > 0) {
                imgPath = "img/menu/icon-bao.png";
            }
            $(this).find("a").find("img").prop("src", imgPath);
            $(this).find("a").find("span").css("color", "#000000");
            $(this).find("div").css({"display": "none"});
        });
        $(".hidContent").mouseleave(function () {
            $(".hid").css({"background": "#F8F8F8"});
            $(this).find("div").css({"display": "none"});
        });
        // 常用操作-字体颜色
        $(".hidContent ul li").mouseover(function () {
            $(this).find("a").css("color", "#FFFFFF");
        });
        $(".hidContent ul li").mouseleave(function () {
            $(this).find("a").css("color", "#333");
        });
    },
    set: function (oftenUrl) {
        this.bf();
        oftenUrl = dfp_util.isNull(oftenUrl) ? {} : oftenUrl;
        $("div.hidContent").each(function (i) { // 单分类div
            $(this).find("li").each(function (n) { // 单功能li
                $(this).on("click", function () {
                    window.parent.addTabToParent($(this).find("a").text(), fullUrlWithTokenid((oftenUrl[i])[n]));
                });
            });
        });
    },
    /**
     * 我要办
     */
    ban: function () {
        params = {};
        params['ruleID'] = 'portal-df-link.getShortCutLinkPortlet';
        params['pgPletId'] = '2';
        params['roleId'] = Base64.decode($("#svRoleId", parent.document).val());
        params['tokenid'] = getTokenId();
        params['start'] = '0';
        params['limit'] = '998';
        $.ajax({
            url: "/portal/GetPageJsonData.do",
            type: "GET",
            dataType: "json",
            data: params,
            success: function (data) {
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    // <li><span class="icon2"></span><a href="javascript:void(0);">现金业务</a></li>
                    var name = data[i].link_title;
                    var url = "window.parent.addTabToParent(&quot;" + name + "&quot;, &quot;" + fullUrlWithTokenid(data[i].link_url) + "&quot;);";
                    html += '<li><span class="icon2"></span><a href="javascript:' + url + '">' + name + '</a></li>';
                }
                $("#woyaoban").html(html);
            }
        });
    }
};

/**
 * dealing
 */
var ptd_dwjb_dealing = {
    get: function () {
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
            data: params,
            dataType: "json",
            async: false,
            success: function (data) {
                dealingThing = data.dealingThing;
            }
        });
        return dealingThing;
    },
    show: function () {
        var dealingThing = this.get();
        var html = "";
        if (dealingThing) {
            var selectName = ptd_dwjb_obj.dealing.title,
                selectMenuid = ptd_dwjb_obj.dealing.menuid;
            var dealingLength = dealingThing.length,
                selectMenuidLength = selectMenuid.length;
            // 待办区域高度
            var height = 50;
            // 获取指定待办，匹配menuid

            // 待办全展示，最好抽象成公共方法，不用每个js里都实现。
            for (var i = 0; i < dealingLength; i++) {
                var menuid = dealingThing[i].menu_id;
                var name = (dealingThing[i].menu_name).replace(/[\n]/g, "");
                var showname = name;
                var url = dealingThing[i].menu_url;
                if (menuid == '9588FA171826EE5F56C82AEF1C474E01') {
                    //下面应该去对应表和菜单表中动态获取
                    //对应表主要字段: 待办传入的菜单ID，链接打开的菜单ID， 页签状态代码 status_code
                    menuid = 'C50DDC8D2A440D61713D513FDA429633';
                    name = '授权支付申请';
                    url = '/df/sd/pay/orderPaAccredit/orderPaAccredit.html?billtype=366&busbilltype=322&model=model5&vtcode=8202';
                    url += "&activetabcode=201"
                }
                url = fullUrlWithTokenid(url) + '&menuid=' + menuid + '&menuname=' + escape(name);
                task = dealingThing[i].task_content;
                title = name + " " + task;
                html += '<li><a href="javascript:window.parent.addTabToParent(&quot;' + name + '&quot;, &quot;' + url + '&quot;);" title="' + title + '">' + showname + ' <span class="c-red">' + task + '</span></a></li>';
            }

        }

        if (!isObjNull(html)) {
            $("#m-content1").find("ul").html("").append(html);
        }

    },
    refresh: function (selectTitle, selectMenuid) { // 部分更新
        this.show(selectTitle, selectMenuid);
    }
};

$(function () {

    // 支出进度
    dfpPayProgress.bf();
    dfpPayProgress.show();
    $("#payProgressRefreshGaoji").click(function () {
        dfpPayProgress.show();
    });
    //$("#payProgressIframe").prop("src", "http://192.168.10.11:8089/dss-web/ssoLogin/getEsen?resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$LRCX74UMZ2UYRTNR1ATF0ML66NR97LUS.rpttpl&calcnow=true&showmenu=FALSE&showparams=false&tokenid=" + getTokenId());
    //$("#payProgressIframe").prop("src", "http://192.168.10.11:8089/dss-web/ssoLogin/getEsen?resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$LRCX74UMZ2UYRTNR1ATF0ML66NR97LUS.rpttpl&calcnow=true&showmenu=FALSE&showparams=false&tokenid=" + getTokenId());

    // 预算指标
    ptd_budget.bf();
    ptd_budget.show();
    $("#budgetGridRefresh").click(function () {
        ptd_budget.show(true);
    });
    //指标拆分
    $("#budgetGridchaifen").click(function () {
        window.parent.addTabToParent("指标拆分", dfp.fullUrl("/df/sd/pay/budgetSplit/budgetSplit.html?billtype=366&busbilltype=322&menuid=5041488d-0ad0-4124-b6b0-29ec88d31339&menuname=%u6307%u6807%u62C6%u5206"));
    });

    // 资金监控
    dfpFundmonitor.bf();
    dfpFundmonitor.show();
    $("#refreshFundmonitor").click(function () {
        dfpFundmonitor.show();
    });

    // 待办
    //ptd_dwjb_dealing.show();
    dfpDealing.show("m-content1", dfp.page.JB);
    $("#dealingMore").click(function () {
        dfpDealing.show("m-content1", dfp.page.JB);
    });

    // 公告
//	dfpArticle.bf();
    dfpArticle.show(3, '', 'JB');
    $("#articleRefresh").click(function () {
        dfpArticle.show(3, '', 'JB');
    });
    //start
    dfpMenu.menu("oftenContent", ['ban', 'deng', 'wen', 'cha']);
    //end
    dfpMenu.show("JB", "ban", "woyaoban");
    dfpMenu.show("JB", "deng", "woyaodeng");
    dfpMenu.show("JB", "cha", "woyaocha");
    dfpMenu.show("JB", "wen", "woyaowen");
    // 主题查询
    $("#zhutifexi").click(function () {
        window.parent.addTabToParent("单位查询", dfp.fullUrl(dfp.esen.url("DWJB_TOP")));
    });
    ptd_dwjb_often.bf();

    // 右侧滑动设置框
    $("#confirm").on("click", function () {
        rightHiddenSiderShow();
        var type = $('#rightDanweiSetting').val();
        // 支出进度
        $("#payProgressDanweiChange").val(type);
        $("#payProgressDanweiChange").change();
        // 预算指标
        $("#budgetDanweiChange").val(type);
        $("#budgetDanweiChange").change();
        // TODO 我的单据
        //dfpFundmonitor.show(null, dfpFundmonitor.showDataList, type);
        dfpFundmonitor.show(null, null, type);

    });
    $("#cancel").on("click", function () {
        rightHiddenSiderShow();
    });
    // 右侧金额显示单位切换
    $("#rightDanweiSetting").change(function () {

    });
    //最大化
    $("#budgetGridMax").click(function () {
        dfp_util.maxDiv(".cen-3", "预算指标");
        $(".layui-layer-close2").css('right', '-15px');
        $("#budgetGridMax").hide();
        $(".layui-layer-close").on("click", function () {
            $("#budgetGridMax").show();
        });
    });
    $("#payProgressMaxGaoji").click(function () {
        var index = layer.open({
            type: 1,
            title: '支出进度',
            //skin: 'layui-layer-rim', //加上边框
            area: ['800px', '600px'], //宽高
            content: $(".cen-2"),
            offset: 'rb',
            closeBtn: 2,
            //maxmin: true,
            yes: function (index) {
                layer.close(index);
                setTimeout('$("#payProgressRefreshGaoji").click()', 500);
            },
            cancel: function (index) {
                layer.close(index);
                setTimeout('$("#payProgressRefreshGaoji").click()', 500);
            }
        });
        layer.full(index);
        $(".layui-layer-close2").css('right', '-15px');
        //$("#payProgressRefreshGaoji").click();
        setTimeout('$("#payProgressRefreshGaoji").click()', 500);

        $("#payProgressMaxGaoji").hide();
        $(".layui-layer-close").on("click", function () {
            $("#payProgressMaxGaoji").show();
        });

    });
});

// 右侧bar滑出
var $rightHiddenSider = $("#rightHiddenSider"),
    $cls_control_sidebar_open = "control-sidebar-open";

function rightHiddenSiderShow() {
    if ($rightHiddenSider.hasClass($cls_control_sidebar_open)) {
        $rightHiddenSider.removeClass($cls_control_sidebar_open);
        // 添加鼠标滑动事件
        $("#rightSetting").on("mouseover", function () {
            $(this).find("i").css("color", "#fff");
            $(this).find("span").css("color", "#fff");
            $(this).css("background-color", "#108ee9");
        }).on("mouseleave", function () {
            $(this).find("i").css("color", "#313131");
            $(this).find("span").css("color", "#313131");
            $(this).css("background-color", "#CCE7F5");
        });
    } else {
        $rightHiddenSider.addClass($cls_control_sidebar_open);
        // 取消鼠标滑动事件
        $("#rightSetting").unbind("mouseover").unbind("mouseleave");
        $("#rightSetting").css("background-color", "#108ee9").find("i").css("color", "#fff");
        $("#rightSetting").find("span").css("color", "#fff");
    }

}

