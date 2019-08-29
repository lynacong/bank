/**
 * portal setting router
 * 项目私有 url 统一管理
 */
;(function (window, document, undefined) {

    $.extend({
        psu: {
            back: function (key) {
                return dmpsUrls.back(key);
            },
            menu: function (key) {
                return dmpsUrls.menu(key);
            },
            jqgridPage: function () {
                return dmpsPageNameToJqgridPageOptions();
            },
            selectOptionsPage: function () {
                return dmpsPageNameToSelectOptions();
            }
        }
    });

    var dmpsUrlsPrefix = "/df/portal/setting3",
        dmpsBackPrefix = "/df/portal/setting2";

    var dmpsUrls = {
        /**
         * HTML路径
         */
        menuHtmlPath: {
            readme: "/todos.html",
            // 内部配置
            settingOption: "/settingOption.html",

            // 角色 -----------------
            role_page: "/role_page.html",
            role_menu: "/role_menu.html",
            rolepage_menu: "/rolepage_menu.html",
            rolepage_dealing: "/rolepage_dealing.html",
            // end 角色 -----------------

            // 用户 -----------------
            user_system: "/user_system.html"
            // end 用户 -----------------

        },
        /**
         * 后台路径
         */
        backMapping: {
            // role
            roleAll: "/role/allRole.do",
            // role page
            rolePageInit: "/role/pageInit.do",
            rolePageSave: "/role/pageUpdate.do?type=save",
            rolePageUpdate: "/role/pageUpdate.do?type=update",
            rolePageDelete: "/role/pageUpdate.do?type=delete",
            // role menu
            roleMenuInit: "/role/menuInit.do",
            roleMenuPubInit: "/role/menuPubInit.do",
            roleMenuSave: "/role/menuUpdate.do?type=save",
            roleMenuUpdate: "/role/menuUpdate.do?type=update",
            roleMenuDelete: "/role/menuUpdate.do?type=delete",
            roleMenuPagePortlet: "/role/menuPagePortlet.do",
            roleMenuToPagePortlet: "/role/menuToPagePortlet.do",
            roleMenuDeletePublishMenu: "/role/menuDeletePublishMenu.do",
            // user
            allUser: "/user/allUser.do",
            // user
            userSystemInit: "/user/systemInit.do"

        },
        menu: function (key) {
            return dmpsUrlsPrefix + this.menuHtmlPath[key];
        },
        back: function (key) {
            return dmpsBackPrefix + this.backMapping[key];
        }

    };

    /**
     * page
     * // TODO GKJB 即为国库会计经办
     */
    var dmpsPageName = {
    	DLYH:"代理银行",
        JB: "单位经办",
        SH: "单位审核",
        JZZF: "集中支付",
        YSC: "预算处",
        YSCZB: "预算处-指标",
        YWCS: "业务处室",
        ZGBM: "主管部门",
        GKZFXD: "国库支付下达", // 同国库支付负责
        GKJB: "国库会计经办",
        GKKJFZ: "国库会计负责",
        GKZFSH: "国库支付审核", // -> 国库支付经办
        GKLD: "厅领导",
        YWPZ: "业务配置"
        //GKKJJB: "国库会计经办",
        //GKLeader: "国库领导",
        //GKKJCZ: "国库会计处长",
    };
    var dmpsPageNamePrefix = "HOME_PAGE_MENU_"; // 前缀
    var dmpsPageNameToJqgridPageOptions = function () {
        var options = "", count = 0, len = (Object.keys(dmpsPageName)).length;
        for (var i in dmpsPageName) {
            if (!dmpsPageName.hasOwnProperty(i)) continue;
            count += 1;
            options += dmpsPageNamePrefix + i + ":" + dmpsPageName[i] + (count === len ? "" : ";");
        }
        count = null;
        return options;
    };
    var dmpsPageNameToSelectOptions = function () {
        var optionHtml = '<option value="{0}">{1}</option>';
        var html = '';
        for (var i in dmpsPageName) {
            if (!dmpsPageName.hasOwnProperty(i)) continue;
            html += $.dfp.strFormat(optionHtml, dmpsPageNamePrefix + i, dmpsPageName[i]);
        }
        return html;
    };

})(window, document);
