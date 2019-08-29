/**
 * 国库
 */
dfpMenu.menu("oftenContent", ['ban', 'wen', 'zhu', 'cha']);
dfpMenu.show(dfp.page.GKZFSH, "ban", null, "oftenUlBan");
dfpMenu.show(dfp.page.GKZFSH, "wen", null, "oftenUlWen");
$("#oftenUlZhu").on("click", function () {
    window.parent.addTabToParent("国库经办查询", dfp.fullUrl(dfp.esen.url("GKCX_TOP")), "");
});
dfpMenu.show(dfp.page.GKZFSH, "cha", null, "oftenUlCha");

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
    //alert("payProgressStatementCheckSelectSub....");

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

dfpDealing.show("dealingContent", dfp.page.GKZFSH);
$("#dealingRefresh").on("click", function() {
    dfpDealing.show("dealingContent", dfp.page.GKZFSH);
});

// 支付排名
$("#payProgressRankingIframe").prop("src", dfp.fullUrl(dfp.esen.url("GKZFSH_RIGHT")));
$("#payProgressRankingContentMaxium").on("click", function() {
	dfp_util.maxDiv2(dfp.fullUrl(dfp.esen.url("GKZFSH_RIGHT")), "");
});

// 公告
dfpArticle.show2(3, 'articleContent', dfp.page.GKZFSH);
$("#articleRefresh").click(function () {
    dfpArticle.show2(3, 'articleContent', dfp.page.GKZFSH);
});

$("#paymentLawIframe").prop("src", dfp.fullUrl(dfp.esen.url("GKZFSH_DOWN")));
$("#paymentLawAnalysisMaxium").on("click", function () {
    dfp_util.maxDiv2(dfp.fullUrl(dfp.esen.url("GKZFSH_DOWN")), "");
});
