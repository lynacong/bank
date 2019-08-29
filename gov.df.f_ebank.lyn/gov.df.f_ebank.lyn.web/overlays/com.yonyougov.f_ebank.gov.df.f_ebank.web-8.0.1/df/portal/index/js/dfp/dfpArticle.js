/**
 * 系统公告
 * <p>需要 dfp.js </p>
 */
var dfpArticle = dfpArticle || {};

// 示例代码
//<div class="cen3">
//	<div class="head-r2">
//		<span>公告信息</span>
//		<!-- <img src="img/dashboard/notice.png" class="articleMore _portal_cursor_pointer"/> -->
//		<!-- <a id="articleMore" class="articleMore _portal_cursor_pointer" style="color: #108ee9;">更多</a>
//		<a id="articleCreate" class="articleCreate _portal_cursor_pointer" style="color: #108ee9;">创建</a> -->
//	</div>
//	<div id="m-content">
//		<ul>
//			<!-- <li><span class="icon1"></span><a href="javascript:void(0);">关于提醒自行纳税申报的函20161229</a></li> -->
//		</ul>
//	</div>
//</div>

/**
 * 创建公告
 */
var DFP_ARTICLE_URL_CREATE = "/df/portal/articleManagement/articleMain.html?a=1";
/**
 * 更多公告
 */
var DFP_ARTICLE_URL_MORE = "/df/portal/common/articleSearch.jsp?pgPletId=16&userId=sa";

dfpArticle = {
    key: {
        JB: "101001002001",
        SH: "101002002001",
        ZGBM: "101003002001",
        JZZF: "101004002001",
        GKLeader: "101005002001",
        GKJB: "101006002001",
        YWCS: "101007002001",
        GKLD: "101008002001",
        GKZFSH: "101013002001",
        GKZFXD: "101009002001",
        GKKJJB: "101010002001",
        GKKJCZ: "101011002001",
        GKLD: "101012002001"
    },
    /**
     * 绑定按钮
     * // TODO ?? 需配合权限显示
     */
    bf: function () {
        $("#articleMore").on("click", function () {
            window.parent.addTabToParent("公告信息", fullUrlWithTokenid(DFP_ARTICLE_URL_MORE));
        });
        $("#articleCreate").on("click", function () {
            window.parent.addTabToParent("公告创建", fullUrlWithTokenid(DFP_ARTICLE_URL_CREATE));
        });
    },

    /**
     * 展示公告
     * @param num 显示数量
     * @param showId 要显示的标签ID
     */
    show: function (num, showId, pageType) {

        // 加载层 - 当前仅适用JZZF
        $("#articleRefreshCover").css("display", "block");

        num = dfp_util.isNull(num) ? 3 : num;
        showId = dfp_util.isNull(showId) ? "m-content" : showId;

        var params = {
            ruleID: 'portal-df-menu.getArticleData',
            pgPletId: dfpArticle.key[pageType],
            userId: 'sa',
            start: '0',
            limit: num
        };
        $.ajax({
            url: "/portal/GetPageJsonData.do?tokenid=" + getTokenId(),
            type: 'GET',
            data: params,
            dataType: 'json',
            success: function (result) {
                var html = "";
                var path = "../../common/articleDetail.jsp?";
                for (var i = 0; i < result.length; i++) {
                    var name = (result[i].article_title).replace(/(^\s+)|(\s+$)/g, "");
                    var url = path + 'articleId=' + result[i].article_id + '&title=' + name + '&tokenid=' + getTokenId();
                    //html += '<li style="width:80%;"><span class="icon1"></span><a href="javascript:window.parent.addTabToParent(&quot;' + name + '&quot;, &quot;' + url + '&quot;);" title="' + name + '">' + name + '</a></li>';
                    html += dfpArticle.html({name: name, url: url}, pageType)
                }
                $("#" + showId).find("ul").html(html);

                $("#articleRefreshCover").css("display", "none");
            },
            error: function () {
                $("#" + showId).find("ul").html("");
                $("#articleRefreshCover").css("display", "none");
            }
        });
    },
    /**
     * 分页面生成HTML
     */
    html: function (data, pageType) {
        var html = '';
        if (pageType == dfp.page.GKLD || pageType == dfp.page.YWCS || pageType == dfp.page.ZGBM || pageType === dfp.page.JZZF) {
            html += '<li style="margin-left: 13px;width: 99%;"><a style="width: 98%;" href="javascript:window.parent.addTabToParent(&quot;' + data.name + '&quot;, &quot;' + data.url + '&quot;);" title="' + data.name + '">' + this.symbol.circle + data.name + ' </a></li>';
        } else {
            //html += '<li><a href="javascript:window.parent.addTabToParent(&quot;' + data.name + '&quot;, &quot;' + data.url + '&quot;);" title="' + data.title + '">' + data.showname + ' <span class="c-red">' + data.task + '</span></a></li>';
            html += '<li style="width:95%;"><span class="icon1"></span><a style="width: 95%;" href="javascript:window.parent.addTabToParent(&quot;' + data.name + '&quot;, &quot;' + data.url + '&quot;);" title="' + data.name + '">' + data.name + ' </a></li>'
        }
        return html;
    },
    /**
     * 行前标识
     */
    symbol: {
        circle: '<span style="color: #999999;margin-right: 10px;">•</span>'
    },
    show2: function (num, showId, pageType) {
        var type = '';
        if (pageType === dfp.page.GKLD || pageType == dfp.page.YWCS || pageType == dfp.page.ZGBM || pageType === dfp.page.JZZF)
            type = '16';
        $("#articleRefreshCover").css("display", "block");

        num = dfp_util.isNull(num) ? 3 : num;
        showId = dfp_util.isNull(showId) ? "m-content" : showId;

        var params = {
            ruleID: 'portal-df-menu.getArticleData',
            pgPletId: dfpArticle.key[type],
            userId: 'sa',
            start: '0',
            limit: num
        };
        $.ajax({
            url: "/portal/GetPageJsonData.do?tokenid=" + getTokenId(),
            type: 'GET',
            data: params,
            dataType: 'json',
            success: function (result) {
                var html = "";
                var path = "../../common/articleDetail.jsp?";
                for (var i = 0; i < result.length; i++) {
                    var name = (result[i].article_title).replace(/(^\s+)|(\s+$)/g, "");
                    var url = path + 'articleId=' + result[i].article_id + '&title=' + name + '&tokenid=' + getTokenId();
                    //html += '<li style="width:80%;"><span class="icon1"></span><a href="javascript:window.parent.addTabToParent(&quot;' + name + '&quot;, &quot;' + url + '&quot;);" title="' + name + '">' + name + '</a></li>';
                    html += dfpArticle.html({name: name, url: url}, pageType);
                }
                $("#" + showId).find("ul").html(html);

                $("#articleRefreshCover").css("display", "none");
            },
            error: function () {
                $("#" + showId).find("ul").html("");
                $("#articleRefreshCover").css("display", "none");
            }
        });
    }

};

