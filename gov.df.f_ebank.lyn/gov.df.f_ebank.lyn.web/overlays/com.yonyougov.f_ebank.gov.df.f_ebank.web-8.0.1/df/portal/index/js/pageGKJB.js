var portalGKJB = {
        /**
         * 常用操作
         */
        often: function () {
            dfpMenu.show("GKJB", "ban", null, "oftenUlBan");
            dfpMenu.show("GKJB", "wen", null, "oftenUlDan");
            dfpMenu.show("GKJB", "cha", null, "oftenUlCha");
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
                }).on('mouseleave', function () {
                    $(this).find("a").find("img").prop("src", imgPath[i]);
                });
            });
        },
        /**
         * 中部单据、签章
         */
        agencyOperation: {
            show: function () {
                var menuCode = ['00111501020', '00111503200',
                    '', '00111504120',
                    '00111503310', '00111503040', '00111502023', '00111502044',
                    '', ''];
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
                var dfp_menu_lv3 = dfp.getMenuLv3();
                var bi = [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    urls = ['', '', '', '', '', '', '', '', ''];
                //var oriData = [{}, {}, {}, {}];
                //var oriData = [{bi: '123', menu_code: '0011150804'}, {bi: '634', menu_code: '00111503902'}, {bi: '6657', menu_code: '00111503901'}, {bi: '3454', menu_code: '00111503330'}];
                var options = {};
                options.menuCode = JSON.stringify(menuCode);
                $.ajax({
                    url: '/df/sd/pay/forportal/findTasksByMenuCode.do',
                    type: 'GET',
                    data: dfp.commonData(options),
                    dataType: 'json',
                    success: function (data) {
                        oriData = data;
                        //var menuCode = portalGKJB.agencyOperation.menuCode;
                        //var menu = portalGKJB.agencyOperation.menu;
                        for (var i = 0; i < menuCode.length; i++) {
                            for (var o in oriData) {
                                if (!oriData.hasOwnProperty(o)) continue;
                                if (oriData[o]['menu_code'] == menuCode[i]) {
                                    bi[i] = oriData[o]['count'];
                                    break;
                                }
                            }
                            for (var j = 0; j < dfp_menu_lv3.length || 0; j++) {
                                if (dfp_menu_lv3[j]['code'] == menu[i][0]) {
                                    urls[i] = dfp_menu_lv3[j]['url'] + '&menuid=' + dfp_menu_lv3[j]['guid'] + '&menuname=' + escape(menu[i][1]) + '&tokenid=' + getTokenId();
                                    break;
                                }
                            }
                        }
                        // 数据
                        for (var k = 0; k < menu.length; k++) {
                            $("#" + menu[k][2] + "Bi").text(bi[k]);
                        }
                        $(".agencyOperationSpanToClick").each(function (n) {
                            var url = urls[n];
                            if (n == 0) {
                                url = '/df/sd/pay/orderAgent/orderAgent.html?billtype=232&busbilltype=232&isclient=0&vtcode=5106&menuid=0C9CA3517937F11BB80AD1B60508AC88&menuname=00111510005%20%u6388%u6743%u6C47%u603B%u6E05%u7B97&tokenid=' + getTokenId();
                            } else if (n == 1) {
                                url = '/df/sd/pay/orderClear/orderClear.html?billtype=331&busbilltype=331&vtcode=5108&isclient=0&menuid=D6CC0C65CA6F980E7CC098F767A13FA0&menuname=00111510004%20%u76F4%u63A5%u6C47%u603B%u6E05%u7B97&tokenid=' + getTokenId();
                            }
                            $(this).on("click", function () {
                                window.parent.addTabToParent(menu[n][1], url);
                            });
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
                        padding: [350, 0, 0, 0], // 图例边距，上右下左
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

            }
        }


    }
;

$(function () {

    portalGKJB.often();

    portalGKJB.agencyOperation.show();

    portalGKJB.checkPayment.echart();
    portalGKJB.checkPayment.select();
    portalGKJB.checkPayment.table();

    // 公告
    dfpArticle.show2(8, 'articleContent', dfp.page.GKJB);
    $("#articleRefresh").click(function () {
        dfpArticle.show2(8, 'articleContent', dfp.page.GKJB);
    });

});
