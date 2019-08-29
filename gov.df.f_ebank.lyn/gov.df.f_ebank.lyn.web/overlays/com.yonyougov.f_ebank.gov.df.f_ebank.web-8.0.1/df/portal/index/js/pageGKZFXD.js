/**
 * 国库
 */

dfpMenu.show("YWCS", "ban", null, "oftenUlBan");
dfpMenu.show("YWCS", "wen", null, "oftenUlDan");
dfpMenu.show("YWCS", "cha", null, "oftenUlCha");
var imgPath = [
    'img/menu/often-ban.png',
    'img/menu/often-dan.png',
    'img/menu/often-cha.png',
    'img/menu/often-ban-w.png',
    'img/menu/often-dan-w.png',
    'img/menu/often-cha-w.png'
];
$("#oftenUl").find("li.oftenUl-li").each(function(i) {
    $(this).on('mouseover', function() {
        $(this).find("a").find("img").prop("src", imgPath[i+3]);
        $(this).css({"background": "#108ee9", "color": "#FFFFFF"});
        //$(this).find("a").find("img").prop("background", "url(" + imgPath[i+3] + ") no-repeat");
    }).on('mouseleave', function() {
        $(this).find("a").find("img").prop("src", imgPath[i]);
        $(this).css({"background": "#FFFFFF", "color": "#000000"});
    });
});

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
    $("#payProgressStatementCheckSelect").toggle("normal");
});
$("#payProgressStatementCheckSelectSubmit").on("click", function () {
    // TODO 获取全部参数，ajax，重置表格
    alert("payProgressStatementCheckSelectSub...");

    $("#payProgressStatementCheckSelect").toggle("normal");
});
// 刷新
$("#payProgressStatementRefresh").on("click", function () {
    dfpPayProgress.show();
});
// 最大化
$("#payProgressStatementMaxium").on("click", function () {
    dfp_util.maxDiv("payProgressStatement");
});
dfpPayProgress.bf();
dfpPayProgress.show();
$("#payprogressXSJDValue").html(dfp.progressInYear() + '%');

dfpDealing.show("dealingContent", dfp.page.GKLD);
$("#dealingRefresh").on("click", function() {
    dfpDealing.show("dealingContent", dfp.page.GKLD);
});

// 公告
dfpArticle.show2(3, 'articleContent', dfp.page.GKLD);
$("#articleRefresh").click(function () {
    dfpArticle.show2(3, 'articleContent', dfp.page.GKLD);
});
