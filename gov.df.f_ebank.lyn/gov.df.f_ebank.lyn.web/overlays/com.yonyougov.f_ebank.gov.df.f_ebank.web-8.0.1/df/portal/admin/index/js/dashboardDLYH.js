var portalGKJB = {
    /**
     * 常用操作
     */
    often: function () {
        dfpMenu.show("GKJB", "ban", null, "oftenUlBan");
        dfpMenu.show("GKJB", "wen", null, "oftenUlDan");
        dfpMenu.show("GKJB", "cha", null, "oftenUlCha");
        var imgPath = [
            'img/jzzf-icon-ban.png',
            'img/jzzf-icon-dan.png',
            'img/jzzf-icon-cha.png',
            'img/jzzf-icon-ban-w.png',
            'img/jzzf-icon-dan-w.png',
            'img/jzzf-icon-cha-w.png'
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
    a: function () {

    },
    /**
     * 对账管理 checkPayment
     */
    checkPayment: {
        /**
         * 左侧图标
         */
        echart : function () {
            option = {
                title : {
                    text: '对账结果分布',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 'auto',
                    padding: [350, 0, 0, 0], // 图例边距，上右下左
                    data: ['正确笔数','在途笔数','有误笔数','被退回笔数','作废笔数']
                },
                series : [
                    {
                        name: '对账结果分布',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '40%'],
                        data:[
                            {value:335, name:'正确笔数'},
                            {value:310, name:'在途笔数'},
                            {value:234, name:'有误笔数'},
                            {value:346, name:'被退回笔数'},
                            {value:1548, name:'作废笔数'}
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
        },
        /**
         * 右上select
         */
        select : function () {

        },
        /**
         * 右下对账业务办理
         */
        table : function () {

        }
    }


};

$(function () {

/*    portalGKJB.often();

    portalGKJB.checkPayment.echart();
    portalGKJB.checkPayment.select();
    portalGKJB.checkPayment.table();*/
	dfpDealing.show("content-p2");
    $("#dealingRefresh").on("click", function() {
    	dfpDealing.show("content-p2");
    });

   /* // 公告
    dfpArticle.show(5, 'articleContent', '16');
    $("#articleRefresh").click(function () {
        dfpArticle.show(5, 'articleContent', '16');
    });*/

});
