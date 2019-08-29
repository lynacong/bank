/**
 * need dfp.js
 */
$(function() {

    // 常用操作
    dfpMenu.menu("oftenContent", ['ban', 'wen', 'zhu', 'cha']);
    dfpMenu.show("YWCS", "ban", null, "oftenUlBan");
    dfpMenu.show("YWCS", "wen", null, "oftenUlWen");
    $("#oftenUlZhu").on("click", function () {
        window.parent.addTabToParent("处室查询", dfp.fullUrl(dfp.esen.url("YWCS_TOP")));
    });
    dfpMenu.show("YWCS", "cha", null, "oftenUlCha");

    // 左侧
    // 支出规律分析
    $("#overallSituationContentIframe").prop("src", dfp.fullUrl(dfp.esen.url("YWCS_LEFT_TOP")));
    $("#overallSituationRefresh").on("click", function () {
        var src = $("#overallSituationContentIframe").attr("src");
        $("#overallSituationContentIframe").prop("src", src).ready();
    });
    $("#overallSituationMaxium").on("click", function () {
        dfp_util.maxDiv2($("#overallSituationContentIframe").attr("src"), "");
    });
    // 下方页签
    $("#paymentLawContentDWIframe").prop("src", dfp.fullUrl(dfp.esen.url("YWCS_LEFT_DOWN_1"))).ready();
    $("#paymentLawContentYSXMIframe").prop("src", dfp.fullUrl(dfp.esen.url("YWCS_LEFT_DOWN_2"))).ready();
    // 下方页签最大化
    $("#paymentLawContentMaxium").on("click", function () {
        $("#paymentLawContent").find("div").find("ul").find("li").each(function (i) {
            if ($(this).hasClass("active")) {
                var id = $(this).find("a").attr("href").substring(1),
                    title = $(this).text();
                dfp_util.maxDiv2($("#" + id + "Iframe").prop("src"), title);
            }
        });
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

    // 待办
    dfpDealing.show("dealingContent", dfp.page.YWCS);
    $("#dealingRefresh").on("click", function () {
        dfpDealing.show("dealingContent", dfp.page.YWCS);
    });
    // 公告
    dfpArticle.show2(5, 'articleContent', dfp.page.YWCS);
    $("#articleRefresh").on("click", function () {
        dfpArticle.show2(5, 'articleContent', dfp.page.YWCS);
    });

});