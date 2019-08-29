/**
 * 国库
 */
dfpMenu.menu("oftenContent", ['ban', 'wen', 'zhu', 'cha']);
dfpMenu.show(dfp.page.GKZFXD, "ban", null, "oftenUlBan");
dfpMenu.show(dfp.page.GKZFXD, "wen", null, "oftenUlWen");
$("#oftenUlZhu").on("click", function () {
    window.parent.addTabToParent("国库经办查询", dfp.fullUrl(dfp.esen.url("GKCX_TOP")));
});
dfpMenu.show(dfp.page.GKZFXD, "cha", null, "oftenUlCha");

$("#topPageSettingBtn").on("mouseover", function () {
    $(this).css("background", "#108ee9");
    $(this).find("div").find("div").css("color", "#FFFFFF");
}).on("mouseleave", function () {
    $(this).css("background", "#B8E1FF");
    $(this).find("div").find("div").css("color", "#000000");
});

// 支出进度情况
// 查询
$("#payProgressStatementCheck, #payProgressStatementCheckSelectCancel").on("click", function () {
    //$("#payProgressStatementCheckSelect").toggle("normal");
    $("#payProgressGaoji").toggle();
});
$("#payProgressStatementCheckSelectSubmit").on("click", function () {
    // TODO 获取全部参数，ajax，重置表格

    $("#payProgressStatementCheckSelect").toggle("normal");
});
// 刷新
$("#payProgressStatementRefresh").on("click", function () {
    dfpPayProgress.show(1);
});
// 最大化
$("#payProgressStatementMaxium").on("click", function () {
    dfp_util.maxDiv("payProgressStatement");
    $("#payProgressStatementMaxium").hide();
    $(".layui-layer-close").on("click", function () {
        $("#payProgressStatementMaxium").show();
    });
});
dfpPayProgress.bf();
dfpPayProgress.show(1);
$("#payprogressXSJDValue").html(dfp.progressInYear() + '%');

dfpDealing.show("dealingContent", dfp.page.GKZFXD);
$("#dealingRefresh").on("click", function () {
    dfpDealing.show("dealingContent", dfp.page.GKZFXD);
});

// 公告
dfpArticle.show2(3, 'articleContent', dfp.page.GKZFXD);
$("#articleRefresh").click(function () {
    dfpArticle.show2(3, 'articleContent', dfp.page.GKZFXD);
});

$("#paymentLawContentKKZSIframe").prop("src", dfp.fullUrl(dfp.esen.url("GKZFXD_DOWN_2")));
$("#paymentLawContentZCFXIframe").prop("src", dfp.fullUrl(dfp.esen.url("GKZFXD_DOWN_3")));
$("#paymentLawContentFXWJIframe").prop("src", dfp.fullUrl(dfp.esen.url("GKZFXD_DOWN_4")));
$("#paymentLawContentDZPZIframe").prop("src", dfp.fullUrl(dfp.esen.url("GKZFXD_DOWN_5")));
$("#payProgressRankingIframe").prop("src", dfp.fullUrl(dfp.esen.url("GKZFSH_RIGHT")));
$("#payProgressRankingMaxium").on("click", function () {
    dfp_util.maxDiv2(dfp.fullUrl(dfp.esen.url("GKZFSH_RIGHT")), "");
});

// 下方tab最大化
$("#paymentLawContentMaxium").on("click", function () {
    $("#paymentLawContent").find("div").find("ul").find("li").each(function (i) {
        if ($(this).hasClass("active")) {
            var id = $(this).find("a").attr("href").substring(1),
                title = $(this).text();
            if (i == 0)
                dfp_util.maxDiv(id, title);
            else
                dfp_util.maxDiv2($("#" + id + "Iframe").prop("src"), title);
        }
    });
    //dfp_util.maxDiv("paymentLawContent");
});

// 加入标签选中即刷新事件
$("#paymentLawContent").find("div").find("ul").find("li").each(function (i) {
    $(this).on("click", function () {
        if (!$(this).hasClass("active")) {
            var id = $(this).find("a").attr("href").substring(1);
            var src = $("#" + id + "Iframe").prop("src");
            $("#" + id + "Iframe").prop("src", src).ready();
        }
    });
});

/**
 * 本日支付柱状图
 */
var paymentLawContentBRZFHighchart = Highcharts.chart('paymentLawContentBRZFEchart', {
    chart: {
        type: 'column',
        width: 300,
        height: 310
    },
    title: {
        text: ''
    },
    xAxis: {
        title: {
            text: null,
            style: {
                color: '#FFFFFF'
            }
        },
        visible: false
        //categories: ['可用库款', '审核中', '已发送银行/未支付', '大额报备', '已支付/未清算', '已清算']
    },
    yAxis: {
        min: 0,
        title: {
            text: null
        }
    },
    tooltip: {
        // color:{series.color}
        pointFormat: '<span style="color:#000">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.2f}%)<br/>',
        shared: true
    },
    legend: {
        align: 'right',
        layout: 'horizontal',
        verticalAlign: 'middle',
        width: 150,
        x: 0,
        y: 20,
        itemDistance: 30 // 间距
    },
    plotOptions: {
        column: {
            stacking: 'percent',
            maxPointWidth: 50 // 柱宽度
        }
    },
    credits: {
        enabled: false
    },
    series: [
        {
            name: '可用库款',
            data: [320],
            //color: '#FFFFFF'
            color: '#f9e7d8'
        },
        {
            name: '审核中',
            data: [120],
            color: '#FAC090'
        },
        {
            name: '已发送银行/未支付',
            data: [220],
            color: '#F68D36'
        },
        {
            name: '大额报备',
            data: [150],
            color: '#E46C0E'
        },
        {
            name: '已支付/未清算',
            data: [820],
            color: '#D16306'
        },
        {
            name: '已清算',
            data: [320],
            color: '#994807'
        }
    ]
});
window.onresize = function () {
    paymentLawContentBRZFHighchart.reflow();
}

// 本日支付右侧表格-快慢车道
$.ajax({
    url: '/df/budget/fastShowRoad/queryCenterData.do',
    type: 'GET',
    data: {tokenid: dfp.tokenid()},
    dataType: 'json',
    success: function (data) {
        var dataDetail = data.dataDetail;
        var trHeight = 'height: 20px;';
        var html = '<table id="paymentLawContentBRZFGridTable" style="margin-bottom: 0px;" class="table table-striped table-hover table-expandable">' +
            '<thead>' +
            '<tr style="text-align: center;font-size: 14px;background: #e5e5e5;font-weight: bold;cursor: default;"><td style="' + trHeight + '">支付情况</td><td style="' + trHeight + '">笔数</td><td style="' + trHeight + '">金额（万元）</td><td style="' + trHeight + '">占限额比（%）</td></tr>' +
            '</thead><tbody>';
        var dataDetailIds = [];
        for (var i = 0; i < dataDetail.length || 0; i++) {
            html += '<tr><td style="' + trHeight + '">';
            if (i > 5)
                html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
            html += dataDetail[i].title + '</td>' +
                '<td style="text-align: right;' + trHeight + '">' + isIntegerNumNull(dataDetail[i].pay_count) + '</td>' +
                '<td style="text-align: right;' + trHeight + '">' + dfp.num2ThousandBreak(isNumNull(dataDetail[i].pay_money)) + '</td>' +
                '<td style="text-align: right;' + trHeight + '">' + dfp.num2ThousandBreak(isNumNull(dataDetail[i].paypro)) + '%</td>' +
                '</tr>';
            dataDetailIds.push(dataDetail[i].id);
        }
        html += '</tbody></table>';
        $("#paymentLawContentBRZFGrid").html(html);
        $("#paymentLawContentBRZFGrid").find("tr:eq(0)").css({"border-top": "solid 1px #ddd"});
        $("#paymentLawContentBRZFGrid").find("tr:eq(9)").css({"border-bottom": "solid 1px #ddd"});
        $("#paymentLawContentBRZFGrid").find("tr:lt(6)").css({"cursor": "pointer"});
        $("#paymentLawContentBRZFGrid").find("tr:gt(6)").css({"cursor": "pointer"});
        //$("#paymentLawContentBRZFGrid").find("tr").find("td").css({"border-left": "solid 1px #ddd", "border-right": "solid 1px #ddd"});
        $("#paymentLawContentBRZFGrid").find("tr").find("td").css({"border": "solid 1px #ddd"});

        // tr行hover
        $("#paymentLawContentBRZFGridTable").find("tbody").find("tr").each(function() {
        	$(this).on("mouseover", function() {
        		$(this).css("background", "#ccc");
        	}).on("mouseleave", function() {
        		$(this).css("background", "#fff");
        	});
        });
        
        // 报表
        var frontUrl = [
            dfp.esen.url("GKZFXD_DOWN_1_1"),
            dfp.esen.url("GKZFXD_DOWN_1_2"),
            dfp.esen.url("GKZFXD_DOWN_1_3"),
            dfp.esen.url("GKZFXD_DOWN_1_4"),
            dfp.esen.url("GKZFXD_DOWN_1_5")
        ];
        var backUrl = '/df/sd/pay/other/slowRoadList.html?menuid=CFDC8DC0454D59059DA048921F1EAD82&dataid=';
        $("#paymentLawContentBRZFGrid").find("tr:gt(0)").each(function (i) {
            $(this).on("click", function () {
                if (i < 5)
                    window.parent.addTabToParent($(this).find("td:eq(0)").text(), dfp.fullUrl(frontUrl[i]) + '&tokenid=' + dfp.tokenid());
                if (i > 5)
                    window.parent.addTabToParent($(this).find("td:eq(0)").text(), backUrl + dataDetailIds[i] + '&tokenid=' + dfp.tokenid());
            });
        });
        
        // 顶部独立数据
        $.ajax({
        	url: "/queryLimitedData.do",
        	data: {tokenid: getTokenId()},
        	type: "GET",
        	dataType: "json",
        	success: function(data) {
        		data.result;
        		// 库款限额
                $("#paymentLawContentBRZFCount1").val("");
                // 已完成支付
                $("#paymentLawContentBRZFCount2").val("");
                // 可用库款
                $("#paymentLawContentBRZFCount3").val("");
                // 库款可用率
                $("#paymentLawContentBRZFCount4").val("");
        	}
        });

    }
});

/**
 * 判断数字是否为0或0.00等
 */
function isNumNull(num) {
    if (!num)
        return 0;
    if (num == 0 || num == 0.0 || num == 0.00 || num == "0" || num == "0.0" || num == "0.00")
        return 0;
    return num;
}
/**
 * 判断整数数字是否为0
 */
function isIntegerNumNull(num) {
	if (!num) 
		return 0;
	return dfp.num2ThousandBreak(isNumNull(num));
}

