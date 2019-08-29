/**
 * 集中支付
 */
var portalJZZF = {
    /**
     * 常用操作
     */
    often: function () {
        dfpMenu.show("JZZF", "ban", null, "oftenUlBan");
        dfpMenu.show("JZZF", "wen", null, "oftenUlDan");
        dfpMenu.show("JZZF", "cha", null, "oftenUlCha");
        var imgPath = [
            'img/menu/often-ban.png',
            'img/menu/often-dan.png',
            'img/menu/often-cha.png',
            'img/menu/often-ban-w.png',
            'img/menu/often-dan-w.png',
            'img/menu/often-cha-w.png'
        ];
        $("#oftenUl").find("li.oftenUl-li").each(function (i) {
            $(this).on('mouseover', function () {
                $(this).find("a").find("img").prop("src", imgPath[i + 3]);
                //$(this).find("a").find("img").prop("background", "url(" + imgPath[i+3] + ") no-repeat");
            }).on('mouseleave', function () {
                $(this).find("a").find("img").prop("src", imgPath[i]);
            });
        });
    },
    /**
     * 单位操作信息
     */
    agencyOperation: {
        menuCode: [
            // 转移支付
            '0011150804',
            // 特殊、涉密单位
            '00111503902',
            // 非部门预算单位
            '00111503901',
            // 统发工资
            '00111503330'
        ],
        menuName: [
            '转移支付',
            '特殊、涉密单位',
            '非部门预算单位',
            '统发工资'
        ],
        show: function () {
            var dfp_menu_lv3 = dfp.getMenuLv3();
            var $li = $("#agencyOperationLi"), // 标签
                $content = $("#agencyOperationContent"); // 标签内容
            var liHtml = '',
                contentHtml = '',
                urls = [];
            for (var i in this.menuCode) {
                if (!this.menuCode.hasOwnProperty(i)) continue;
                for (var j = 0; j < dfp_menu_lv3.length || 0; j++) {
                    if (dfp_menu_lv3[j].code == this.menuCode[i]) {
                        var liId = '_dfp_agency_operation_li_' + hex_md5(this.menuCode[i]);
                        liHtml += '<li class="' + liId + '"><a href="#' + liId + '" data-toggle="tab">' + this.menuName[i] + '</a></li>';
                        var url = dfp_menu_lv3[j].url + dfp.obj2Str() + '&isshowflowchart=1&menuid=' + dfp_menu_lv3[j].guid;
                        urls.push(url);
                        contentHtml += '<div class="tab-pane" id="' + liId + '"><iframe ';
                        if (i == 0)
                            contentHtml += 'src="' + url + '" ';
                        contentHtml += '></iframe></div>';
                        break;
                    }
                }
            }
            $li.html(liHtml).find("li:eq(0)").addClass("active");
            $content.html(contentHtml).find("div:eq(0)").addClass("active");
            // click
            $li.find("li").each(function (i) {
                $(this).on("click", function () {
                    var id = ($(this).attr("class").split(" "))[0];
                    var $content = $("#" + id);
                    if (i > 0 && !$content.find("iframe").prop("src"))
                        $content.find("iframe").prop("src", urls[i]);
                    $content.addClass("active");
                });
            });
            this.btn2max();
        },
        show2: function () {
            var dfp_menu_lv3 = dfp.getMenuLv3();
            var bi = [0, 0, 0, 0],
                money = [0, 0, 0, 0],
                urls = ['', '', '', ''],
                ids = ['transferPayment', 'specialSecretAgency', 'nDepartmentBudget', 'payRoll'];
            var oriData = [{}, {}, {}, {}];// [{bi:'123', money:'2235223', menu_code:'0011150804'},{bi:'634', money:'3624322', menu_code:'00111503902'},{bi:'6657', money:'826345345', menu_code:'00111503901'},{bi:'3454', money:'82645186', menu_code:'00111503330'}];
            var options = {};
            options.menuCode = JSON.stringify(this.menuCode);
            $.ajax({
                url: '/df/sd/pay/forportal/findTasksByMenuCode.do',
                type: 'GET',
                data: dfp.commonData(options),
                dataType: 'json',
                success: function (data) {
                    oriData = data;
                    for (var i = 0; i < portalJZZF.agencyOperation.menuCode.length; i++) {
                        for (var o in oriData) {
                            if (!oriData.hasOwnProperty(o)) continue;
                            if (oriData[o]['menu_code'] == portalJZZF.agencyOperation.menuCode[i]) {
                                bi[i] = oriData[o]['count'];
                                // TODO 默认单位“万元”
                                money[i] = dfp.num2ThousandBreak(oriData[o]['totalMoney'] / 10000);
                            }
                        }
                        for (var j = 0; j < dfp_menu_lv3.length || 0; j++) {
                            if (dfp_menu_lv3[j]['code'] == portalJZZF.agencyOperation.menuCode[i]) {
                                urls[i] = dfp_menu_lv3[j]['url'] + '&menuid=' + dfp_menu_lv3[j]['guid'] + '&menuname=' + escape(portalJZZF.agencyOperation.menuName[i]) + '&tokenid=' + getTokenId();
                            }
                        }
                    }
                    // 数据
                    for (var j = 0; j < ids.length; j++) {
                        $("#" + ids[j] + "Bi").text(bi[j]);
                        $("#" + ids[j] + "Money").html(money[j] + ' <span style="color: #000000;">万</span>');
                    }

                    // 是否可用，以url是否为空判断
                    $(".agencyOperationBtn").each(function (i) {
                        if (urls[i] || urls[i] !== '') {
                            $(this).on("click", function () {
                                window.parent.addTabToParent(portalJZZF.agencyOperation.menuName[i], urls[i]);
                            }).css('background', '#FFFFFF').removeAttr("disabled");
                        } else {
                            $(this).css({"background": "#FFFFFF", "color": "#ccc"});
                        }
                    });
                },
                error: function () {
                }
            });

        },
        btn2max: function () {
            $("#agencyOperationMax").on("click", function () {
                var $ac = $("#agencyOperationContent").find("div.active").find("iframe");
                //dfp_util.maxDiv($ac);
                dfp_util.maxDiv2($ac.attr("src"));
            });
        }
    },
    /**
     * 支付监控
     */
    paymentMonitoring: function () {
        dfpGrid.init({
            id: "paymentMonitoring"
            //, url : "/df/pay/centerpay/input/getPlanBoundData.do"
        });
    },
    /**
     * 我的单据
     */
    selfDocuments: function () {
        dfpEle.func.fundmonitor.init("selfDocuments", "JZZF_DAN");
    }

};

$(function () {

    portalJZZF.often();

    //portalJZZF.agencyOperation.show();
    portalJZZF.agencyOperation.show2();

    portalJZZF.paymentMonitoring();

    portalJZZF.selfDocuments();
    $("#selfDocumentsRefresh").on("click", function () {
        portalJZZF.selfDocuments();
    });

    // 待办
    dfpDealing.show("dealingContent", dfp.page.JZZF);
    $("#dealingRefresh").on("click", function () {
        dfpDealing.show("dealingContent", dfp.page.JZZF);
    });

    // 公告
    dfpArticle.show2(3, 'articleContent', dfp.page.JZZF);
    $("#articleRefresh").click(function () {
        dfpArticle.show2(3, 'articleContent', dfp.page.JZZF);
    });

});
