var portalGKJB = {
        /**
         * 常用操作
         */
        often: function () {
            dfpMenu.menu("oftenContent", ['ban', 'wen', 'zhu', 'cha']);
            dfpMenu.show("GKJB", "ban", null, "oftenUlBan");
            dfpMenu.show("GKJB", "wen", null, "oftenUlWen");
//            $("#oftenUlZhu").on("click", function () {
//                window.parent.addTabToParent("国库经办查询", dfp.fullUrl(dfp.esen.url("GKCX_TOP")));
//            });
            dfpMenu.show("GKJB", "cha", null, "oftenUlCha");
        },
        /**
         * 中部单据、签章
         */
        agencyOperation: {
            show: function () {
                var menuCode = [
                    '00111501020',
                    '00111503200',
                    '',
                    '00111504150',
                    '00111503310',
                    '00111503040',
                    '00111502023',
                    '00111502044',
                    '00111800010',
                    '00111800011'
                ];
                //            	处长 = ['00111501021', '00111503210',
//            	                 '', '00111504150', 
//            	                 '00111503310', '00111503040', '00111502023', '00111502044',
//            	                 '',''];
                var menu = [
                    [menuCode[0], '授权汇总清算', 'authPaymentSumAndSetSheet'],
                    [menuCode[1], '直接汇总清算', 'directPaymentSumAndSetSheet'],
                    [menuCode[2], '实拨凭证', 'actualAppropriationCredence'],
                    [menuCode[3], '调度款凭证', 'dispatchingFundCredence'],
                    [menuCode[4], '直接支付-正常', 'directPaymentNormal'],
                    [menuCode[5], '直接支付-退款', 'directPaymentTui'],
                    [menuCode[6], '授权支付-正常', 'authPaymentNormal'],
                    [menuCode[7], '授权支付-退款', 'authPaymentTui'],
                    [menuCode[8], '支付对账', 'paymentReconciliation'],
                    [menuCode[9], '实拨对账', 'actualAppropriationReconciliation']
                ];

                // var dfp_menu_lv3 = dfp.getMenuLv3();
                var dfp_menu_lv3;
                var isDfpMenuLv3Ok = setInterval(function () {
                    dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3") || "");
                    if (dfp_menu_lv3 != null && dfp_menu_lv3 != undefined) {
                        clearTimeout(isDfpMenuLv3Ok);
                    }
                }, 100);
                dfp_menu_lv3 = JSON.parse(sessionStorage.getItem("dfp_menu_lv3"));

                var bi = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                    urls = ['', '', '', '', '', '', '', '', '', ''];
                var options = {};
                options.menuCode = JSON.stringify(menuCode);
                $.ajax({
                    url: '/df/sd/pay/forportal/findTasksByMenuCode.do',
                    type: 'GET',
                    data: dfp.commonData(options),
                    dataType: 'json',
                    success: function (data) {
                        oriData = data;
                        var ddkInput;
                        for (var i = 0; i < menuCode.length; i++) {
                            for (var o in oriData) {
                                if (!oriData.hasOwnProperty(o)) continue;
                                if (oriData[o]['menu_code'] == menuCode[i]) {
                                    bi[i] = oriData[o]['count'];
                                    break;
                                }
                            }
                            for (var j = 0; j < dfp_menu_lv3.length || 0; j++) {
                            	if (dfp_menu_lv3[j]['code'] == '00111504190') {
                            		ddkInput = dfp_menu_lv3[j]['code'];
                            		delete dfp_menu_lv3[j]['code'];
                            		//break;
                            	}
                                if (dfp_menu_lv3[j]['code'] == menu[i][0]) {
                                    var url = dfp_menu_lv3[j]['url'];
                                    urls[i] = url + (url.indexOf("?") != -1 ? "&" : "?") + 'menuid=' + dfp_menu_lv3[j]['guid'] + '&menuname=' + escape(dfp_menu_lv3[j]['menu_name']) + '&tokenid=' + getTokenId();
                                    break;
                                }
                            }
                        }
                        // 数据
                        for (var k = 0; k < menu.length; k++) {
                            $("#" + menu[k][2] + "Bi").text(bi[k]);
                            if (!urls[k])
                                $("#" + menu[k][2] + "A").css("color", "#ccc"); // 置灰
                        }

                        if (ddkInput) {
                            $("#dispatchingFundCredenceIn").on("click", function () {
                                window.parent.addTabToParent("调度款录入", "/df/sd/pay/realpay/input/dispatchFundsInput.html?billtype=378&realbilltype=325&busbilltype=330&acctype=71&vtcode=5207&menuid=E4A2B14E3216251F0C8C0E7D592736CB&menuname=" + escape("调度款录入") + "&tokenid=" + dfp.tokenid());
                            });
                        } else {
                            $("#dispatchingFundCredenceIn").css("color", "#ccc"); // 置灰
                        }

                        $(".agencyOperationSpanToClick").each(function (n) {
                            var url = urls[n];
                            if (n == 0) {
                                url = '/df/sd/pay/orderAgent/orderAgent.html?billtype=232&busbilltype=232&isclient=0&vtcode=5106&menuid=0C9CA3517937F11BB80AD1B60508AC88&menuname=00111510005%20%u6388%u6743%u6C47%u603B%u6E05%u7B97&tokenid=' + getTokenId();
                            } else if (n == 1) {
                                url = '/df/sd/pay/orderClear/orderClear.html?billtype=331&busbilltype=331&vtcode=5108&isclient=0&menuid=D6CC0C65CA6F980E7CC098F767A13FA0&menuname=00111510004%20%u76F4%u63A5%u6C47%u603B%u6E05%u7B97&tokenid=' + getTokenId();
                            }
                            if (urls[n]) {
                                $(this).on("click", function () {
                                    window.parent.addTabToParent(dfp.getParamFromUrl(url, "menuname"), url);
                                });
                            }
                        });

                    },
                    error: function () {
                    }
                });

            }
        },
        /**
         * 对账管理 checkPayment
         */
        checkPayment: {
            /**
             * 左侧图标
             */
            echart: function () {
                option = {
                    title: {
                        text: '对账结果分布',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'horizontal',
                        bottom: 'auto',
                        padding: [300, 0, 0, 0], // 图例边距，上右下左
                        data: ['正确笔数', '在途笔数', '有误笔数', '被退回笔数', '作废笔数']
                    },
                    textStyle: {
                        color: '#000'
                    },
                    series: [
                        {
                            name: '对账结果分布',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '40%'],
                            color: ['#f18526', '#d972d3', '#d7e5bd', '#00b150', '#00b1f1'],
                            data: [
                                {value: 335, name: '正确笔数'},
                                {value: 310, name: '在途笔数'},
                                {value: 234, name: '有误笔数'},
                                {value: 346, name: '被退回笔数'},
                                {value: 1548, name: '作废笔数'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
                var myChart = echarts.init(document.getElementById("checkPaymentChart"));
                myChart.setOption(option);
                window.onresize = function () {
                    myChart.resize();
                }
            }
            ,
            /**
             * 右上select
             */
            select: function () {

            }
            ,
            /**
             * 右下对账业务办理
             */
            table: function () {
                $.ajax({
                    url: '/df/sd/pay/forportal/getBalanceDataCount.do',
                    type: 'GET',
                    data: {tokenid: dfp.tokenid()},
                    dataType: 'json',
                    success: function (data) {
                        var t = data.result;
                        var v = [
                            [t.youwu, t.zfyouwu, t.sbyouwu],
                            [t.beituihui, t.zfbeituihui, t.sbbeituihui],
                            [t.zaitu, t.zfzaitu, t.sbzaitu],
                            [t.zuofei, t.zfzuofei, t.sbzuofei],
                            [t.zhengque, t.zfzhengque, t.sbzhengque]
                        ];
                        // var v = [
                        //     [0, 0, 0],
                        //     [0, 0, 0],
                        //     [0, 0, 0],
                        //     [0, 0, 0],
                        //     [0, 0, 0]
                        // ];
                        var trName = ['有误', '被追回', '在途', '作废', '正确'];
                        var tdName = ['支付凭证', '实拨凭证'];
                        var html = '<table id="checkPaymentContentTable" class="table table-striped table-hover table-expandable">' +
                            '<thead style="display:none;">' +
                            '<tr><td>name</td><td>bi</td></tr>' +
                            '</thead><tbody>';
                        for (var i = 0; i < v.length; i++) {
                            // 主行
                            html += '<tr class="dfp-event-loadToClick"><td>' + '<span class="loadToClickSymbol">+</span>' + trName[i] + '</td><td class="dfp-num-yellow">' + v[i][0] + '笔</td></tr>';
                            // 隐藏行
                            html += '<tr class="dfp-event-loadToHide"><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tdName[0] + '</td><td class="dfp-num-yellow">' + v[i][1] + '笔</td></tr>';
                            html += '<tr class="dfp-event-loadToHide"><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + tdName[1] + '</td><td class="dfp-num-yellow">' + v[i][2] + '笔</td></tr>';
                        }
                        html += '</tbody></table>';
                        $("#checkPaymentContent").html(html);
                        // 展开行事件
                        $('#checkPaymentContentTable').each(function () {
                            var table = $(this);
                            var tr = table.children('tbody').children('tr');
                            tr.filter('.dfp-event-loadToHide').hide();
                            tr.filter('.dfp-event-loadToClick').click(function () {
                                var _tr = $(this);
                                var spanText = _tr.find('span.loadToClickSymbol').text();
                                _tr.find('span.loadToClickSymbol').html(spanText == '+' ? '- ' : '+');
                                _tr.next('tr').toggle();
                                _tr.next('tr').next('tr').toggle();

                            });
                        });

                    }
                });
            }
        }


    }
;

$(function () {

    portalGKJB.often();

    portalGKJB.agencyOperation.show();
    $("#middleRefresh").on("click", function () {
        portalGKJB.agencyOperation.show();
    });

    portalGKJB.checkPayment.echart();
    portalGKJB.checkPayment.select();
    portalGKJB.checkPayment.table();

    // 公告
    dfpArticle.show2(8, 'articleContent', dfp.page.GKJB);
    $("#articleRefresh").click(function () {
        dfpArticle.show2(8, 'articleContent', dfp.page.GKJB);
    });

});
