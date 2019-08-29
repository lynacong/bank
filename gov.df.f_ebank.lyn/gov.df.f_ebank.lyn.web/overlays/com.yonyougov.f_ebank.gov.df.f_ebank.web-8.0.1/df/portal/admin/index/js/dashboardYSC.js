/**
 * need dfp.js
 */
$(function() {

    // 常用操作
    dfpMenu.menu("oftenContent", ['ban', 'wen', 'zhu', 'cha']);
    dfpMenu.show("YSC", "ban", null, "oftenUlBan");
    dfpMenu.show("YSC", "wen", null, "oftenUlWen");
    $("#oftenUlZhu").on("click", function () {
        window.parent.addTabToParent("预算处查询", dfp.fullUrl(dfp.esen.url("YSC_TOP")));
    });
    dfpMenu.show("YSC", "cha", null, "oftenUlCha");

    // 左侧
    $("#overallSituationContentIframe").prop("src", dfp.fullUrl(dfp.esen.url("YSC_LEFT")));
    $("#overallSituationRefresh").on("click", function () {
        var src = $("#overallSituationContentIframe").attr("src");
        $("#overallSituationContentIframe").prop("src", src).ready();
    });
    $("#overallSituationMaxium").on("click", function () {
        dfp_util.maxDiv2($("#overallSituationContentIframe").attr("src"), "");
    });

    // 待办
    dfpDealing.show("dealingContent", dfp.page.YSC);
    $("#dealingRefresh").on("click", function () {
        dfpDealing.show("dealingContent", dfp.page.YSC);
    });
    // 公告
    dfpArticle.show2(5, 'articleContent', dfp.page.YSC);
    $("#articleRefresh").on("click", function () {
        dfpArticle.show2(5, 'articleContent', dfp.page.YSC);
    });

});