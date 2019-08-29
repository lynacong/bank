/**
 * 国库领导
 */

$("#topPageSettingBtn").on("mouseover", function () {
   $(this).css("background", "#108ee9");
   $(this).find("div").find("div").css("color", "#FFFFFF");
}).on("mouseleave", function () {
   $(this).css("background", "#B8E1FF");
   $(this).find("div").find("div").css("color", "#000000");
});

dfpDealing.show("dealingContent", dfp.page.GKLD);
$("#dealingRefresh").on("click", function() {
    dfpDealing.show("dealingContent", dfp.page.GKLD);
});

// 公告
dfpArticle.show2(3, 'articleContent', dfp.page.GKLD);
$("#articleRefresh").click(function () {
    dfpArticle.show2(3, 'articleContent', dfp.page.GKLD);
});
