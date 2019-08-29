/**
 * need dfp.js
 */
var portal_YWCS = portal_YWCS || {};
//序时进度依赖的进度条长度
var xsjdTotalWidth = 0.010101,
    xsjdWidthJudgeTime = 0;

portal_YWCS = {
    /**
     * 常用操作
     */
    often : function() {
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
    },
    /**
     * 部门总体进度
     */
    topProgress : {
        show : function(){
//			$.ajax({
//				url: "/df/portal/dubbo/payProgress.do",
//				//先由业务系统提供取数，便于对数
//				//url: "/df/pay/search/mainpage/payProgress.do",
//				type: "GET",
//				dataType: "json",
//				data: dfp.commonData({
//					"tokenid":getTokenId(),
//					"fundtypeCode":fundtypeCode,
//					"expfuncCode":expfuncCode,
//					"bgtsourceCode":bgtsourceCode,
//					"selecttime":selecttime,
//					"agencyCode":pAgencyCode,
//					"billtype":"366",
//					"busbilltype":"311",
//					"pageInfo":"99999,0",
//					"condition": " and paytype_code like '12%' "
//				}),
//				success: function(data) {

            portal_YWCS.topProgress.progress();

//				},
//				error: function(){
//				}
//			});	
        },
        progress : function(){

            var data = {
                zzbje : '27213.26', // 总指标金额
                zzfje : '19355.12', // 总支付金额
                zzbye : '17355.14', // 总指标余额
                zzfjd : '47', // 总支付进度
                xsjd : '52.7', // 序时进度
                xmzc : ['57.15', '42.85'], // 项目支出： 已用指标， 可用指标
                jbzc : ['42.79', '57.21'] // 基本支出：..
            };
            // 部门总体进度-五行数字
            dataNum = ['27213.26', '19355.12', '17355.14', '47', '52.7'];
            $("#agencyTopProgress").find("button").find("span:eq(0)").each(function(i) {
                $(this).html(dataNum[i]);
            });
            // 部门总体进度-进度条
            // 项目支出
//			$("#agencyTopProgressProjectPayment").find("div.progress-bar").each(function(i) {
//				$(this).css("width", data.xmzc[i] + "%");
//				$(this).find("span").html(data.xmzc[i] + "%");
//				xsjdBarLength += $(this).width();
//			});
            $("#agencyProjectPaymentUsed").css("width", data.xmzc[0] + "%").find("span").html(data.xmzc[0] + "%");
            $("#agencyProjectPaymentUsing").css("width", data.xmzc[1] + "%").find("span").html(data.xmzc[1] + "%");
            portal_YWCS.topProgress.xsjdPosition($("#agencyProjectPaymentUsed").width() + $("#agencyProjectPaymentUsing").width());
            // 基本支出
            $("#agencyTopProgressBasePayment").find("div.progress-bar").each(function(i) {
                $(this).css("width", data.jbzc[i] + "%");
                $(this).find("span").html(data.jbzc[i] + "%");
            });

//			var agency = Base64.decode($("#svAgencyCode", parent.document).val());
//			var htmlParam = "&fundtypeCode="+fundtypeCode+"&expfuncCode="+expfuncCode+"&agency="+agency;
//			if(zfzt == '已支付') {
//				window.parent.addTabToParent('已支付', '/df/pay/portalpay/statusquery/payrelated/payInfo.html?billtype=366&busbilltype=311&menuid=132C25064BD2BAE4627573EEA7BB9CA8&menuname=%u652F%u51FA%u8FDB%u5EA6%u652F%u4ED8%u4FE1%u606F&tokenid='+getTokenId()+htmlParam);
//			} else if(zfzt == '可用指标') {
//				window.parent.addTabToParent('可用指标', '/df/pay/portalpay/input/payQuota.html?billtype=366&busbilltype=311&model=model5&menuid=B249D0506FCAAADDE98A515AB777DD31&menuname=%u652F%u51FA%u8FDB%u5EA6%u6307%u6807%u4FE1%u606F&tokenid='+getTokenId()+htmlParam);
//			}
        },
        /**
         * 序时进度-计算显示位置
         */
        xsjdPosition : function(_xsjdBarLength) {
            setTimeout(function() {
                var totalWidthInterval = setInterval(function() {
                    var totalWidth = $("#agencyProjectPaymentUsed").width() + $("#agencyProjectPaymentUsing").width();
                    //if(xsjdTotalWidth == totalWidth) {
                    if(xsjdTotalWidth == totalWidth) {
                        clearInterval(totalWidthInterval);
                        $("#XSJD").css("margin-left", totalWidth * dfp.progressInYear() / 100 + "px");
                    } else {
                        xsjdTotalWidth = totalWidth;
                    }
                }, 2000);
            }, 5000);
//			xsjdBarLength = 0;
//			if(_xsjdBarLength || _xsjdBarLength > 0) {
//				xsjdBarLength = _xsjdBarLength;
//				var xsjdPercent = dfp.progressInYear();
//				$("#XSJD").css("margin-left", xsjdBarLength * xsjdPercent / 100 + "px");
//			} else {
//				if(xsjdBarLength == 0) {
//					xsjdBarLength = $("#agencyProjectPaymentUsed").width();
//				}
//				var agencyInterval = setInterval(function() {
//					if(xsjdBarLength < $("#agencyProjectPaymentUsed").width()) {
//						xsjdBarLength = $("#agencyProjectPaymentUsed").width();
//					} else {
//						if(xsjdBarLength > 0 && xsjdBarLength == $("#agencyProjectPaymentUsed").width()) {
//							clearInterval(agencyInterval);
//							xsjdBarLength += $("#agencyProjectPaymentUsing").width();
//							var xsjdPercent = dfp.progressInYear();
//							$("#XSJD").css("margin-left", xsjdBarLength * xsjdPercent / 100 + "px");
//						}
//					}
//				}, 1000);
//			}
        }

    },

    /**
     * 单位支出进度
     */
    payProgress : {
        datalist : [],
        first : true,
        inited : false,
        payProgressViewModel : {},
        payProgressApp : {},
        bf : function() {
        },
        show : function(agency_code, autoExpand) {
            if(!this.inited){
                payProgressViewModel = {
                    dataTable : new u.DataTable({
                        meta : {
                            "agencyexp_name" : "",
                            "avi_money" : "",
                            "pay_money" : "",
                            "canuse_money" : "",
                            "zcjd" : "",
                            "xsjdc" : ""
                        }
                    }, this),
                    onRowFocus1 : function(obj) {
                        if(portal_YWCS.payProgress.datalist.length == 0){
                            return;
                        }
                        var row = portal_YWCS.payProgress.datalist[obj.rowIndex];
                        var agency_code, agencyexp_code;
                        if(!row.pid){
                            agency_code = row.agency_code;
                            agencyexp_code = '';
                        }else{
                            agency_code = row.agency_code;
                            agencyexp_code = row.agencyexp_code;
                        }
                        portal_YWCS.payProgressDetail.show(agency_code, agencyexp_code);
                    },
                    dataSourceInitRows : null,

                    onSortFun1 : function(field, sortType){
                        if(portal_YWCS.payProgressDetail.dataSourceInitRows == null){
                            portal_YWCS.payProgressDetail.dataSourceInitRows = this.dataSourceObj.rows;
                        }
                        if(!field){
                            this.dataSourceObj.rows = portal_YWCS.payProgressDetail.dataSourceInitRows;
                            return;
                        }
                        var datalist = _.cloneDeep(this.dataSourceObj.rows);
                        var rows = _.filter(datalist, function(o) {
                            return o.value.is_leaf == '1';
                        });
                        var rows1 = _.filter(datalist, function(o) {
                            return o.value.is_leaf == null;
                        });

                        rows.sort(this.SortByFun(field, sortType));
                        var newRows = [];
                        var index = 0;
                        _.forEach(rows, function(o) {
                            o.value.pid = null;
                            o.parentKeyValue = null;
                            o.parentRow = null;
                            o.parentRowIndex = null;
                            o.level = 0;
                            o.valueIndex = index++;
                            newRows.push(o);
                            _.forEach(rows1, function(o1) {
                                if(o.value.id == o1.value.pid){
                                    o1.level = 1;
                                    o1.valueIndex = index++;
                                    o1.parentRow = o;
                                    o1.parentRowIndex = o.valueIndex;
                                    newRows.push(o1);
                                }
                            });
                        });

                        this.dataSourceObj.rows = newRows;
                    },
                    onDblClickFun1 : function(){

                    }
                };
                ko.cleanNode($('#payProgressContent')[0]);
                payProgressApp = u.createApp({
                    el : '#payProgressContent',
                    model : payProgressViewModel
                });
                //树表也变成可以排序，u-grid控件本身没实现，自行实现 排序
                var columns = payProgressApp.comps[0].grid.gridCompColumnArr;
                _.forEach(columns, function(o) {
                    o.options['sortable'] = true;
                });
                this.inited = true;
            }
            var unitChange = function(money) {
                return Number((money / 10000).toFixed(2));
            };
            var calcMoney = function(row, xsjd){
                if (row.avi_money > 0) {
                    row.zcjd = (row.pay_money / row.avi_money * 100).toFixed(2).toString() + "%";
                    row.xsjdc = ((row.pay_money / row.avi_money * 100).toFixed(2) - xsjd).toFixed(2);
                    row.syjd = (row.canuse_money / row.avi_money * 100).toFixed(2).toString() + "%";
                }
                row.xsjd = xsjd + "%";
            };
            // 预算指标请求参数
            var all_options_condition = " and paytype_code like '12%' ";
            var dicCondition = "";
            if(agency_code){
                dicCondition = " and chr_id in (" + agency_code + ")";
            }
            var all_options = {
                "tokenid" : getTokenId(),
                "file_name" : "",
                "agencyexp_name" : "",
                "bis_name" : "",
                "avi_money" : "",
                "canuse_money" : "",
                "expfunc_name" : "",
                "expeco_name" : "",
                "fundtype_name" : "",
                "bgtsource_name" : "",
                "agency_code" : !agency_code?'':agency_code,
                "agency_name" : "",
                "mb_name" : "",
                "sm_name" : "",
                "billtype" : "366",
                "busbilltype" : "311",
                "pageInfo" : "99999,0",
                "ajax" : "noCache",
                "search_condition" : all_options_condition,
                "element":"AGENCY",
                "condition" : dicCondition
            };
            $.ajax({
                url : "/df/pay/search/mainpage/payProgressByAgencys.do",
                type : "GET",
                dataType : "json",
                data : dfp.commonData(all_options),
                success : function(data) {
                    var xsjd = dfp.progressInYear();
                    var datas = data.dataDetail;
                    for ( var i = 0; i < datas.length; i++) {
                        var row = datas[i];
                        row.avi_money_old = row.avi_money;
                        row.pay_money_old = row.pay_money;
                        row.avi_money = unitChange(row.avi_money);
                        row.pay_money = unitChange(row.pay_money);
                        row.canuse_money = row.avi_money - row.pay_money;
                        calcMoney(row, xsjd);
                        if(row.agencyexp_code == '102'){
                            row.agencyexp_name = '项目支出';
                        }
                    }
                    portal_YWCS.payProgress.datalist = datas;
                    payProgressViewModel.dataTable.removeAllRows();
                    if(portal_YWCS.payProgressDetail){
                        portal_YWCS.payProgressDetail.removeAllRows();
                    }
                    if(autoExpand){
                        payProgressApp.comps[0].grid.options['autoExpand'] = true;
                    }else{
                        payProgressApp.comps[0].grid.options['autoExpand'] = false;
                    }
                    payProgressViewModel.dataTable.setSimpleData(datas, {
                        ubSelect : true
                    });
                    //第一次打开时，构建部门总体进度情况。
                    if(!portal_YWCS.payProgress.first){
                        return;
                    }
                    portal_YWCS.payProgress.first = false;
                    var all = {"avi_money" : 0, "pay_money" : 0, "canuse_money" : 0};
                    var jbzc = {"avi_money" : 0, "pay_money" : 0, "canuse_money" : 0};
                    var xmzc = {"avi_money" : 0, "pay_money" : 0, "canuse_money" : 0};
                    for ( var i = 0; i < datas.length; i++) {
                        var row = datas[i];
                        if(!row.pid){
                            all.avi_money += row.avi_money;
                            all.pay_money += row.pay_money;
                            all.canuse_money += row.canuse_money;
                        }else{
                            if(row.agencyexp_code == '102'){
                                xmzc.avi_money += row.avi_money;
                                xmzc.pay_money += row.pay_money;
                                xmzc.canuse_money += row.canuse_money;
                            }else{
                                jbzc.avi_money += row.avi_money;
                                jbzc.pay_money += row.pay_money;
                                jbzc.canuse_money += row.canuse_money;
                            }
                        }
                    }
                    calcMoney(all, xsjd);
                    calcMoney(jbzc, xsjd);
                    calcMoney(xmzc, xsjd);
                    $('#all_avi_money').html(all.avi_money.toFixed(2));
                    $('#all_pay_money').html(all.pay_money);
                    $('#all_canuse_money').html(all.canuse_money.toFixed(2));
                    all.zcjd = !all.zcjd ? '0.00%' : all.zcjd;
                    $('#all_zcjd').html(all.zcjd);
                    $('#all_xsjd').html(all.xsjd);

                    // 项目支出
                    xmzc.zcjd = !xmzc.zcjd ? '0.00%' : xmzc.zcjd;
                    xmzc.syjd = !xmzc.syjd ? '100.00%' : xmzc.syjd;
                    $("#agencyProjectPaymentUsed").css("width", xmzc.zcjd).find("span").html(xmzc.zcjd);
                    $("#agencyProjectPaymentUsing").css("width", xmzc.syjd).find("span").html(xmzc.syjd);

                    // 基本支出
                    jbzc.zcjd = !jbzc.zcjd ? '0.00%' : jbzc.zcjd;
                    jbzc.syjd = !jbzc.syjd ? '100.00%' : jbzc.syjd;
                    $("#agencyBasePaymentUsed").css("width", jbzc.zcjd).find("span").html(jbzc.zcjd);
                    $("#agencyBasePaymentUsing").css("width", jbzc.syjd).find("span").html(jbzc.syjd);
                    // 初始化序时进度
                    portal_YWCS.topProgress.xsjdPosition($("#agencyProjectPaymentUsed").width() + $("#agencyProjectPaymentUsing").width());


                }
            });

        }
    },

    payProgressDetail : {
        datalist : [],
        inited : false,
        payProgressDetailApp : {},
        payProgressDetailViewModel : {},
        dataCache : [],
        bf : function() {
        },
        show : function(agency_code, agencyexp_code) {
            if(!this.inited){
                this.payProgressDetailViewModel = {
                    dataTable : new u.DataTable({
                        meta : {
                            "file_name" : "",
                            "bis_name" : "",
                            "expfunc_name" : "",
                            "avi_money" : "",
                            "canuse_money" : "",
                            "zcjd" : ""
                        }
                    }, this),
                    onDblClickFun1 : function(obj) {
                        if(portal_YWCS.payProgressDetail.datalist.length == 0){
                            return;
                        }
                        var row = portal_YWCS.payProgressDetail.datalist[obj.rowIndex];
                        var title = "执行情况";
                        var url = "/df/sd/pay/commonModal/traceBalanceList/balanceForPortal.html";
                        url = fullUrlWithTokenid(url) + "&sum_id=" + row.fromctrlid;
                        window.parent.addTabToParent(title, url);
                    }
                };
                ko.cleanNode($('#payProgressDetailContent')[0]);
                this.payProgressDetailApp = u.createApp({
                    el : '#payProgressDetailContent',
                    model : this.payProgressDetailViewModel
                });
                this.inited = true;
            }
            var cacheData = this.dataCache[agency_code + agencyexp_code];
            if(cacheData != null){
                portal_YWCS.payProgressDetail.datalist = cacheData;
                this.payProgressDetailViewModel.dataTable.setSimpleData(cacheData, {
                    ubSelect : true
                });
                return;
            }
            // 预算指标请求参数
            var all_options_condition = " and paytype_code like '12%' ";
            var all_options = {
                "tokenid" : getTokenId(),
                "file_name" : "",
                "agencyexp_name" : "",
                "bis_name" : "",
                "avi_money" : "",
                "canuse_money" : "",
                "expfunc_name" : "",
                "expeco_name" : "",
                "fundtype_name" : "",
                "bgtsource_name" : "",
                "agency_code" : agency_code,
                "agencyexp_code" : agencyexp_code,
                "agency_name" : "",
                "mb_name" : "",
                "sm_name" : "",
                "billtype" : "366",
                "busbilltype" : "311",
                "pageInfo" : "99999,0",
                "ajax" : "noCache",
                "condition" : all_options_condition
            };
            $.ajax({
                url : "/df/pay/search/mainpage/payProgressDetailByAgencys.do",
                type : "GET",
                dataType : "json",
                data : dfp.commonData(all_options),
                success : function(data) {
                    var xsjd = dfp.progressInYear();
                    var datas = data.dataDetail;
                    for ( var i = 0; i < datas.length; i++) {
                        var row = datas[i];
                        row.canuse_money = row.avi_money - row.pay_money;
                        if (row.avi_money > 0) {
                            row.zcjd = (row.pay_money / row.avi_money * 100)
                                    .toFixed(2).toString()
                                + "%";
                            row.xsjdc = ((row.pay_money / row.avi_money * 100)
                                .toFixed(2) - xsjd).toFixed(2);
                        }
                    }
                    portal_YWCS.payProgressDetail.datalist = datas;
                    portal_YWCS.payProgressDetail.payProgressDetailViewModel.dataTable.removeAllRows();
                    portal_YWCS.payProgressDetail.payProgressDetailViewModel.dataTable.setSimpleData(datas, {
                        ubSelect : true
                    });
                    portal_YWCS.payProgressDetail.dataCache[agency_code + agencyexp_code] = datas;
                }
            });

        },
        removeAllRows : function(){
            if(this.payProgressDetailViewModel.dataTable){
                this.payProgressDetailViewModel.dataTable.removeAllRows();
            }
        },

        quickSearch : function(id) {
            var dataTable = this.payProgressDetailViewModel.dataTable;
            var curGridHead = this.payProgressDetailApp.comps[0].options['columns'];
            var	datas = this.datalist;
            var search_text = $("#" + id).val();
            var result = [];
            if (search_text == "") {
                result = datas;
            } else {
                for (var i = 0; i < datas.length; i++) {

                    for (var j = 0; j < curGridHead.length; j++) {
                        if('false' == curGridHead[j].visible){
                            continue;
                        }
                        var value = datas[i][curGridHead[j].field];
                        if(value){
                            if (String(value).indexOf(search_text) !== -1) {
                                result.push(datas[i]);
                                break;
                            }
                        }
                    }
                }
            }
            dataTable.setSimpleData(result, {
                unSelect: true
            });
            ip.highLightKeyWord(search_text, "red", "payProgressDetailContentDiv");
        }
    },

    /**
     * 单位树
     */
    rightAgencyTree : {
        bf : function() {
            // 右侧单位树-滑出事件
            var $rightHiddenSider = $("#rightHiddenSider"),
                $cls_control_sidebar_open = "control-sidebar-open";
            $("#rightAgency").click(function() {
                if ($rightHiddenSider.hasClass($cls_control_sidebar_open)) {
                    $rightHiddenSider.removeClass($cls_control_sidebar_open);
                } else {
                    $rightHiddenSider.addClass($cls_control_sidebar_open);
                }
            });
            $("#confirm").on("click", function() {
                //portal_YWCS.rightAgencyTree.confirm();
            });
            $("#cancel").on("click", function() {
                //portal_YWCS.rightAgencyTree.cancel();
            });
        },
        show : function() {
            var all_options = {
                "element": "AGENCY",
                "tokenid": getTokenId(),
                "ele_value": "",
                "ajax": "noCache"
            };
            $.ajax({
                url: "/df/dic/dictree.do",
                type: "GET",
                dataType: "json",
                data: dfp.commonData(all_options),
                success: function(data) {
                    var eleDetail = data.eleDetail;
                    var setting = {
                        check: {
                            enable: true
                        },
                        data: {
                            simpleData: {
                                enable: true
                            }
                        }
                    };
                    var zNodes = [];
                    for(var i in eleDetail){
                        if(!eleDetail.hasOwnProperty(i)){
                            continue;
                        }
                        zNodes.push({id:eleDetail[i].chr_id, pId:eleDetail[i].parent_id, name:eleDetail[i].codename, open:true});
                    }

                    $.fn.zTree.init($("#rightAgencyTree"), setting, zNodes);

                }
            });

        },
        getSelectedAgency : function(){
            var zTree = $.fn.zTree.getZTreeObj("rightAgencyTree");
            var nodes = zTree.getCheckedNodes(true);

            var result = '';
            for ( var i = 0; i < nodes.length; i++) {
                result += "'" + nodes[i].id + "',";
            }
            if(result.length > 0){
                result = result.substring(0, result.lastIndexOf(","));
            }
            return result;
        },
        confirm : function(){
            var result = this.getSelectedAgency();
            if (result.length == 0) {
                alert("请选择单位");
                return false;
            }
            portal_YWCS.payProgress.show(result, true);
            $("#rightAgency").click();
        },
        cancel : function(){
            $("#rightAgency").click();
        }
    }
};

$(function() {

    // 常用操作
    portal_YWCS.often();

    $("#topPageSettingBtn").on("mouseover", function () {
        $(this).css("background", "#108ee9");
        $(this).find("div").find("div").css("color", "#FFFFFF");
    }).on("mouseleave", function () {
        $(this).css("background", "#B8E1FF");
        $(this).find("div").find("div").css("color", "#000000");
    });

    // 部门总体进度
    // portal_YWCS.topProgress.show();
    // $("#agencyTopProRefresh").click(function() {
    //     portal_YWCS.topProgress.show();
    // });
    $("#agencyTopProgressProjectPaymentIframe").prop("src", "http://192.168.10.11:8089/dss-web/ssoLogin/getEsen?resid=EBI$12$U9UURC0UPFMIDDI9JYDSQB8JXB91YTYM$1$YU0LUUQE2E2TYUNUM1U6SAUUERU7WW4B.rpttpl&calcnow=true&showmenu=FALSE&showparams=false&tokenid=" + getTokenId());
    //$("#agencyTopProgressProjectPaymentIframe").prop("src", "http://www.nipic.com/index.html");

    // 单位支出进度
    // portal_YWCS.payProgress.show();
    // $("#payProgressRefresh").click(function() {
    //     var selectAgency = portal_YWCS.rightAgencyTree.getSelectedAgency();
    //     portal_YWCS.payProgress.show(selectAgency, true);
    // });
    // // 监听窗口尺寸改变，动态设置序时进度
    // window.onresize = function() {
    //     portal_YWCS.topProgress.xsjdPosition();
    // }

    // 右侧菜单树
    portal_YWCS.rightAgencyTree.bf();
    // portal_YWCS.rightAgencyTree.show();

    //最大化
    $("#payProgressMaxium").click(function() {
        dfp_util.maxDiv("#rightdiv");
    });

    // $("#payProgressDetailMaxium").click(function() {
    //     dfp_util.maxDiv("#payProgressDetailContent");
    //     $(".layui-layer-close2").css('right', '-13px');
    // });

    // 待办
    dfpDealing.show("dealingContent", dfp.page.YWCS);
    // 公告
    dfpArticle.show2(5, 'articleContent', dfp.page.YWCS);
    $("#leftDownRefresh").on("click", function () {
        if($("#dealingTab").hasClass("active"))
            dfpDealing.show("dealingContent", dfp.page.YWCS);
        else if($("#articleTab").hasClass("active"))
            dfpArticle.show2(5, 'articleContent', dfp.page.YWCS);
    });

});