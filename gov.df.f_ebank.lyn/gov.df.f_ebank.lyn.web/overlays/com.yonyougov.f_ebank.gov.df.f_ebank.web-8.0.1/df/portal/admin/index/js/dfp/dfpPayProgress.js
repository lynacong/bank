/**
 * 支出进度
 * <p>需要 dfp.js</p>
 */
var dfpPayProgress = dfpPayProgress || {};
// 代码示例
// 暂存数据
// 指标金额
var _budgetMoney = 0;
// 指标余额
var _lastBgtMoney = 0;
// 支付金额
var _payMoney = 0;
// 支出进度ztree符合条件的node集合
var payProgressZTreeNodeList = [];
// 支出进度ztree查询条件
var payProgressZTreeCheckValue = '';

dfpPayProgress = {
    tree: function () {
        // 绑定中间滚动事件
        var scrollFunc = function (e) {
            e = e || window.event;
            if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
                $("#budgetWrapper").css("display", "none");
                $("#expfuncCodeTree").css("display", "none");
                $("#bgtsourceCodeTree").css("display", "none");
            } else if (e.detail) {  //Firefox滑轮事件
                $("#budgetWrapper").css("display", "none");
                $("#expfuncCodeTree").css("display", "none");
                $("#bgtsourceCodeTree").css("display", "none");
            }
        }
        //给页面绑定滑轮滚动事件
        if (document.addEventListener) {//firefox
            document.addEventListener('DOMMouseScroll', scrollFunc, false);
        }
        //滚动滑轮触发scrollFunc方法  //ie 谷歌
        window.onmousewheel = document.onmousewheel = scrollFunc;
        document.onclick = function (e) {
            $("#budgetWrapper").css("display", "none");

            // TODO 预算指标-高级查询，单击事件冒泡导致隐藏
            //$(".demandContent").css("display", "none");
            var eventTargetAllPage = e.srcElement ? e.srcElement : e.target;
            var eventTargetAllPageId = eventTargetAllPage.id;
            var selectedTabelId = ["expfuncCode", "expfuncCodeTree", "bgtsourceCode", "bgtsourceCodeTree"];

            // 判断单击点位置
            //var $a = $("#eventTargetAllPage").parents("ul#expfuncCodeTree");

//			if(dfp_util.isValueInArray(selectedTabelId, eventTargetAllPageId)){
//				return false;
//			}else{
//				if($("#expfuncCodeTree").css("display")=="block") {
//					$("#expfuncCodeTree").css("display", "none");
//				}
//				if($("#bgtsourceCodeTree").css("display")=="block") {
//					$("#bgtsourceCodeTree").css("display", "none");
//				}
//			}
        };
    },
    bf: function () {
        this.tree();
        // 支出进度截止时间初始化
//		$('#budgetTime').fdatepicker({
//			format: 'yyyy-mm-dd'
//		});
//		$("#budgetTime").val(dfp.datetimeSpe("pp"));
//		var $timeFoot = $(".datepicker-days").find("tfoot").find("th.today");
//		$timeFoot.css("display", "block !important");
//		$timeFoot.css("border", "solid 1px #ccc");
//		$timeFoot.click(function(){
//			$("#budgetTime").val(dfp.datetimeSpe("pp"));
//			$("div.datepicker.datepicker-dropdown.dropdown-menu").hide();
//		});

        // 单位切换
        $("#payProgressDanweiChange").on("change", function (e) {
            dfpPayProgress.hchart(_payMoney, _lastBgtMoney, null, null, null, _budgetMoney);
        });

        // 高级查询
        $("#payProgressShowGaoji").click(function () {
            // $("#payProgressGaoji").css("display", "block");
            $("#payProgressGaoji").toggle();
        });
        // 高级查询-单查询事件
        // modal
        var payProgressModalHtml = '<div class="example-modal" style="width: 500px;">' +
            '<div class="modal fade" id="payProgressModal">' +
            '   <div class="modal-dialog">' +
            '       <div class="modal-content" style="width: 500px;border-radius: 8px;">' +
            '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
            '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
            '                   <h4 class="modal-title" id="payProgressZTreeTitle">选择标题</h4>' +
            '               </div>' +
            '               <div class="modal-body" style="padding: 5px 10px;">' +
            '                   <input type="text" id="payProgressZTreeCheck" value="" style="width: 479px; margin-bottom: 5px; height: 30px; padding-left: 10px;" placeholder="输入查询条件">' +
            '                   <div class="box box-info" style="border: solid 1px #ccc;">' +
            '                       <ul id="payProgressModalZTree" class="ztree" style="width: 468px; height: 235px; margin-left: 10px;margin-top: 0px;overflow: auto;"></ul>' +
            '                   </div>' +
            '               </div>' +
            // '               <div class="modal-footer" style="padding: 5px 15px;">' +
            // '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
            // '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" id="payProgressModalSub">保存</button>' +
            // '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '</div>';
        $("body").append(payProgressModalHtml);
        $("#payProgressGaoji").find("ul").find("li").each(function (i) {
            // 单查询-x，情况内容
            $(this).find("span:eq(0)").click(function () {
                $(this).parent("li").find("input").each(function () {
                    $(this).val("");
                });
            });
            // 单查询-...，展示弹窗
            $(this).find("span:eq(1)").click(function () {
                var zNodes = [],
                    zSetting = {
                        view: {
                            dblClickExpand: false,
                            showLine: true,
                            selectedMulti: false,
                            showIcon: false,
                            fontCss: function (treeId, treeNode) { // 元素选中时添加指定highlight样式
                                return (!!treeNode.highlight) ?
                                    {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
                            }
                        },
                        data: {
                            simpleData: {enable: true, idKey: "id", pIdKey: "pId", rootPId: ""}
                        },
                        callback: {} // 由之后的个标签事件独立添加
                    };
                var ztree = function(id, type) {
                    var elements = {
                        "yslb":"xx",	// 预算类别
                        "xmfl":"AGENCYEXP",	// 项目分类
                        "zbly":"BGTSOURCE",	// 指标来源
                        "ysdw":"AGENCY"	// 预算单位
                    };
                    var elementsName = {
                		"yslb":"预算类别",	// 预算类别
                        "xmfl":"项目分类",	// 项目分类
                        "zbly":"指标来源",	// 指标来源
                        "ysdw":"预算单位"	// 预算单位
                    };
                    var element = elements[type];
                    $("#payProgressZTreeTitle").html(elementsName[type] + '选择');
                    var all_options1 = {
                        "element": element, "tokenid": getTokenId(), "ele_value": "", "ajax": "noCache"
                    };

                    $.ajax({
                        url: "/df/dic/dictree.do",
                        type: "GET",
                        data: dfp.commonData(all_options1),
                        dataType: "json",
                        //async: false,
                        success: function (data) {
                            var eleDetail = data.eleDetail;
                            zNodes.push({id: "", name: "全部", pId: ""});
                            // TODO 暂时使用之前的预算类别设定
                            if (type === 'yslb') {
                                zNodes = [
                                    {id: "", code: "", name: "全部", pId: "0"},
                                    {id: "01", code: "11", name: "基金预算", pId: "0"},
                                    {id: "02", code: "22", name: "一般预算", pId: "0"},
                                    {id: "03", code: "33", name: "国有资本经营预算", pId: "0"},
                                    {id: "04", code: "88", name: "其他支出", pId: "0"}
                                ];
                            } else {
                                for (var i in eleDetail) {
                                    if (!eleDetail.hasOwnProperty(i)) {
                                        continue;
                                    }
                                    var _name = eleDetail[i].codename;
                                    // 预算单位显示code
                                    if (type !== 'ysdw') {
                                        _name = dfp_re.space.removeAll(dfp_re.num.removeAll(_name));
                                    }
                                    zNodes.push({
                                        id: eleDetail[i].chr_id,
                                        pId: eleDetail[i].parent_id,
                                        name: _name,
                                        code: eleDetail[i].chr_code
                                    });
                                }
                            }

                            zSetting.callback = {
                                onClick: function (event, treeId, treeNode) {
                                    //$("#content_wrap2").css({"display": "none"});
                                    $("#payProgress" + id + "GaojiInput_NAME").val(treeNode.name);
                                    $("#payProgress" + id + "GaojiInput_ID").val(treeNode.code);
                                    $("#payProgressModal").modal('hide');
                                }
                            };
                            //$.fn.zTree.init($("#payProgressZTree"), zSetting, zNodes);
                            //$("#content_wrap2").css("display", "block");
                            $("#payProgressZTreeCheck").val("");
                            $("#payProgressModal").modal({
                                keyboard: true
                            }).on("shown.bs.modal", function () {
                                payProgressZTreeNodeList = [];
                                //$("#payProgressModalZTree").empty();
                                zTreeObj = $.fn.zTree.init($("#payProgressModalZTree"), zSetting, zNodes);
                                zTreeObj.expandAll(true);
                            });
                        }
                    });
                };

                if (i == 0) { // 预算类别 fundtypeCode
                    ztree("YSLB", "yslb");
                } else if (i == 1) { // 项目分类 expfuncCode
                    ztree("XMFL", "xmfl");
                } else if (i == 2) { // 指标来源 bgtsourceCode
                    ztree("ZBLY", "zbly");
                } else if (i == 3) { // 预算单位 agencyCode
                    ztree("YSDW", "ysdw");
                }

            });
        });
        // 高级查询-单查询关闭
        // $("#payProgressZTreeClose, #_payProgressZTreeClose").click(function () {
        //     $("#content_wrap2").css("display", "none");
        // });

        $("#payProgressZTreeCheck")
            .bind("propertychange", searchNode)
            .bind("input", searchNode);
        function searchNode() {
            payProgressZTreeCheckValue = $("#payProgressZTreeCheck").val();
            var zTreeObj = $.fn.zTree.getZTreeObj("payProgressModalZTree");

//            var updateNodes = function (highlight) {
//                for( var i = 0; i < nodeList.length; i++) {
//                    nodeList[i].highlight = highlight;
//                    zTreeObj.updateNode(nodeList[i]);
//                    zTreeObj.expandNode(nodeList[i].getParentNode(), highlight, null, null, false);
//                }
//            };
//            updateNodes(false);
//            nodeList = zTreeObj.getNodesByParamFuzzy("name", payProgressZTreeCheckValue);
//            updateNodes(true);

            // 显示上次搜索后背隐藏的结点
            zTreeObj.showNodes(payProgressZTreeNodeList);
            // 查找不符合条件节点
            var filterFunc = function(node){
                // 查找不符合条件叶子节点
                if(node.isParent || node.name.indexOf(payProgressZTreeCheckValue) != -1) {
                    return false;
                }
                // 查找不符合条件的全部节点
                // if(node.name.indexOf(payProgressZTreeCheckValue) != -1) {
                // 	return false;
                // }
                return true;
            };
            //获取不符合条件的叶子结点
            payProgressZTreeNodeList=zTreeObj.getNodesByFilter(filterFunc);
            //隐藏不符合条件的叶子结点
            zTreeObj.hideNodes(payProgressZTreeNodeList);

        }
        // 高级查询-总查询关闭
        $("#payProgressGaojiClose").click(function () {
            $("#payProgressGaoji").css("display", "none");
        });
        // 高级查询-总查询确定
        $("#payProgressGaojiSubmit").click(function () {
            $("#payProgressGaoji").css("display", "none");
            dfpPayProgress.show();
        });

    },
    show: function (urlNo) {
//		var fundtypeCode = $("#fundtypeCode").val();
//		var expfuncCode = $("#_expfuncCode").val();
//		var bgtsourceCode = $("#_bgtsourceCode").val();
//		var pAgencyCode = $("#_pAgencyCode").val();
//		var selecttime = $("#budgetTime").val() || "";
        var fundtypeCode = $("#payProgressYSLBGaojiInput_ID").val() || "";
        var expfuncCode = $("#payProgressXMFLGaojiInput_ID").val() || "";
        var bgtsourceCode = $("#payProgressZBLYGaojiInput_ID").val() || "";
        var pAgencyCode = $("#payProgressYSDWGaojiInput_ID").val() || "";
        var selecttime = "";
        // 两套url
        var payProgressUrl = [
            "/df/pay/search/mainpage/payProgress.do", // 单位端
            "/df/pay/search/mainpage/payProgressForOrg.do" // 国库
        ];
        urlNo = urlNo || 0; // 默认单位端
        $.ajax({
            //url: "/df/portal/dubbo/payProgress.do",
            //先由业务系统提供取数，便于对数
            url: payProgressUrl[urlNo],
            type: "GET",
            dataType: "json",
            data: dfp.commonData({
                "tokenid": getTokenId(),
                "fundtypeCode": fundtypeCode,
                "expfuncCode": expfuncCode,
                "bgtsourceCode": bgtsourceCode,
                "selecttime": selecttime,
                "agencyCode": pAgencyCode,
                "billtype": "366",
                "busbilltype": "311",
                "pageInfo": "99999,0",
                "condition": " and paytype_code like '12%' "
            }),
            success: function (data) {
                $("#tooltipXSJD").css("display", "block");
                if (null == data.data || (data.data).length == 0) {
                    $("#tooltipXSJD").css("display", "none");
                }

                // 渲染图表
                //$("#dwzc").css("display","block");
                var dataDetail = data.data;
                if (dataDetail == null || dataDetail[0] == null) {
                    //console.log("-- dubbo service is out");
                    $("#_portal_zhichu_text_zbje_span").html("0");
                    $("#_portal_zhichu_text_zfje_span").html("0");
                    $("#_portal_zhichu_text_zbye_span").html("0");
                    $("#tooltipXSJD").css("display", "none");
                    $("#payprogressXSJD").css("display", "none");
                    $("#dwzc").html('<span style="padding:20px;font-size:20px;color:#1b1005;line-height:120px;">当前条件下无指标及支出数据</span>');
                    return;
                }

                //var mofdepCode = dataDetail[0].mofdepCode;	// 处室
                //var deptCode = dataDetail[0].deptCode;	// 部门
                //var agencyCode = dataDetail[0].agencyCode;	// 单位
                //var queryDate = dataDetail[0].queryDate;	// 时间 yyyy-MM-dd
                //var fundtypeCode = dataDetail[0].fundtypeCode;	// 预算类别
                //var expfuncCode = dataDetail[0].expfuncCode;	// 支出类型
                var budgetMoney = dataDetail[0].budgetMoney;	// 指标金额
                var payMoney = dataDetail[0].payMoney;	// 支付金额
                var lastBgtMoney = dataDetail[0].lastBgtMoney;	// 指标余额

                if (payMoney == 0 && budgetMoney == 0) {
                    // 渲染支出进度文字提示
                    $("#_portal_zhichu_text_zbje_span").html("0");
                    $("#_portal_zhichu_text_zfje_span").html("0");
                    $("#_portal_zhichu_text_zbye_span").html("0"); //dfp.num2ThousandBreak(lastBgtMoney?lastBgtMoney:"0")
                    $("#tooltipXSJD").css("display", "none");
                    $("#payprogressXSJD").css("display", "none");
                    $("#dwzc").html('<span style="padding:20px;font-size:20px;color:#1b1005;line-height:120px;">当前条件下无指标及支出数据</span>');
                    return;
                }

                _budgetMoney = budgetMoney;
                _lastBgtMoney = lastBgtMoney;
                _payMoney = payMoney;
                dfpPayProgress.hchart(payMoney, lastBgtMoney, fundtypeCode, expfuncCode, selecttime, budgetMoney);

                // TODO 支出进度排名
                // 支出进度本部门排名
                //$("#payProgressRanking_bm").html("1");
                // 全部升级预算单位排名
                //$("#payProgressRanking_ysdw").html("2");
                for (var i = 0; i < dataDetail.length; i++) {
                    if ("bumen" == dataDetail[i].type) {
                        // 支出进度本部门排名
                        $("#payProgressRanking_bm").html(dataDetail[i].sortd);
                    } else if ("danwei" == dataDetail[i].type) {
                        // 全部升级预算单位排名
                        $("#payProgressRanking_ysdw").html(dataDetail[i].sortd);
                    }
                }

                // 序时进度
                $("#tooltipXSJD").css("display", "block");
                $payprogressXSJD = $("#payprogressXSJD");
                $payprogressXSJD.css("display", "none");
                var _dfpXSJD = dfp.progressInYear();
                $XSJD = $("text.highcharts-plot-line-label");
                $XSJD.on("mouseover", function (e) {
                    $payprogressXSJD.css("display", "block").css("position", "fixed")
                        .css("zIndex", "4").css("left", e.clientX + 'px').css("top", e.clientY + 'px');
                    $payprogressXSJD.find("ul").find("li").find("span").html(_dfpXSJD + "%");
                }).on("mouseout", function () {
                    $payprogressXSJD.css("display", "none");
                });

                // 支出进度比序时进度快或慢多少
                // payMoney  budgetMoney
                var _fasterOrLower = 0;
                if (payMoney != 0) {
                    _fasterOrLower = payMoney / budgetMoney;
                }
                _fasterOrLower = (_fasterOrLower * 100).toFixed(2) - _dfpXSJD;
                var _fasterOrLowerHtml = '';
                if(_fasterOrLower >= 0) {
                    _fasterOrLowerHtml += '快 ';
                } else {
                    _fasterOrLowerHtml += '慢 ';
                    _fasterOrLower = -1 * _fasterOrLower;
                }
                $("#payProgressRanking_fasterOrLower").html(_fasterOrLowerHtml + _fasterOrLower.toFixed(2) ); // + '%'

            },
            error: function () {
                $("#tooltipXSJD").css("display", "none");
            }
        });
    },
    /**
     * 单查询条件弹出框
     */
    singleCheckModel: function() {
        var html = '';
        
    },
    hchart: function (payMoney, lastBgtMoney, fundtypeCode, expfuncCode, selecttime, budgetMoney) {
        var jsonSeries = [
            {name: '可用指标', data: [lastBgtMoney]},
            {name: '已支付', data: [payMoney]}
        ];
        // 单位切换，默认 1 万元，0 元，2 亿元
        var payProgressDanweiChange = $("#payProgressDanweiChange").val();
        if (payProgressDanweiChange == 1) {
            budgetMoney = (budgetMoney / 1e4).toFixed(2);
            lastBgtMoney = (lastBgtMoney / 1e4).toFixed(2);
            payMoney = (payMoney / 1e4).toFixed(2);
            _showDanwei = "万";
        } else if (payProgressDanweiChange == 2) {
            budgetMoney = (budgetMoney / 1e8).toFixed(2);
            lastBgtMoney = (lastBgtMoney / 1e8).toFixed(2);
            payMoney = (payMoney / 1e8).toFixed(2);
            _showDanwei = "亿";
        } else {
            _showDanwei = "";
        }

        // 渲染支出进度文字提示
        $("#_portal_zhichu_text_zbje_span").html('<span onclick="dfpPayProgressSpanClick(&quot;zbje&quot;);" style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak(budgetMoney) + '</span>' + _showDanwei);
        $("#_portal_zhichu_text_zfje_span").html('<span onclick="dfpPayProgressSpanClick(&quot;zfje&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' + dfp.num2ThousandBreak(payMoney) + '</span>' + _showDanwei);
        //$("#_portal_zhichu_text_zbye_span").html('<span onclick="dfpPayProgressSpanClick(&quot;zbye&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' + dfp.num2ThousandBreak(lastBgtMoney) + '</span>' + _showDanwei);
        $("#_portal_zhichu_text_zbye_span").html('<span style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak(lastBgtMoney) + '</span>' + _showDanwei);
        // GKZFXD
        $("#_portal_zhichu_text_zbje_span_GKZFXD").html('<span onclick="dfpPayProgressSpanClick(&quot;zbje&quot;);" style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak((budgetMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        $("#_portal_zhichu_text_zfje_span_GKZFXD").html('<span onclick="dfpPayProgressSpanClick(&quot;zfje&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' + dfp.num2ThousandBreak((payMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        //$("#_portal_zhichu_text_zbye_span_GKZFXD").html('<span onclick="dfpPayProgressSpanClick(&quot;zbye&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' + dfp.num2ThousandBreak((lastBgtMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        $("#_portal_zhichu_text_zbye_span_GKZFXD").html('<span style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak((lastBgtMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        // 国库支付审核
        $("#_portal_zhichu_text_zbje_span_GKZFSH").html('<span onclick="dfpPayProgressSpanClick(&quot;zbje&quot;);" style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak((budgetMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        $("#_portal_zhichu_text_zfje_span_GKZFSH").html('<span onclick="dfpPayProgressSpanClick(&quot;zfje&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' + dfp.num2ThousandBreak((payMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        //$("#_portal_zhichu_text_zbye_span_GKZFSH").html('<span onclick="dfpPayProgressSpanClick(&quot;zbye&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' + dfp.num2ThousandBreak((lastBgtMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        $("#_portal_zhichu_text_zbye_span_GKZFSH").html('<span style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak((lastBgtMoney / 1e8).toFixed(2)) + '</span>' + '亿');

        $("#payProgressStatementAllBudget").html('<span onclick="dfpPayProgressSpanClick(&quot;zbje&quot;);" style="color:#F56A00;font-weight:bold;">' + dfp.num2ThousandBreak((budgetMoney / 1e8).toFixed(2)) + '</span>' + '亿');
        $("#payProgressStatementAllBudgetCost").html('<span onclick="dfpPayProgressSpanClick(&quot;zfje&quot;);" style="color:#F56A00;font-weight:bold;cursor: pointer;">' + dfp.num2ThousandBreak((payMoney / 1e8).toFixed(2)) + '</span>' + '亿');

        // TODO 金额数目过小，导致bar比例计算失误，此处不处理bar浮框显示，避免显示数据错误
        _showDanwei = "";

        var xsjd = dfp.progressInYear();
        var chart = Highcharts.chart('dwzc', {
            chart: {
                type: 'bar',
                height: 100
                //,width: 600
            },
            credits: {enabled: false},
            exporting: {enabled: false},
            title: {text: ''},
            xAxis: {
                labels: {enabled: false},
                tickWidth: 0//, // 次级刻线宽度
                //categories: [''],
                //lineWidth: 0,
                //lineColor:'#fff'
            },
            yAxis: {
                opposite: true, // 坐标轴对面显示
                min: 0, // 起始值
                tickWidth: 2,
                tickPosition: 'outside',
                tickLength: 15,
                tickmarkPlacement: 'on', // 刻度线位置，“on”表示刻度线将在分类上方显示
                //alternateGridColor: '#FDFFD5', // 相邻刻度线之间会用对应的颜色来绘制颜色分辨带
                lineWidth: 5,
                lineColor: '#fff',
                offset: -15,
                //offset: -55,
                gridLineColor: '#FFF', // 辅助轴线颜色
                title: {text: ''},
                labels: { //y轴刻度文字标签
                    style: {
                        color: '#000',
                        "font-size": '14px'
                    },
                    formatter: function () {
                        return this.value// + '%'; //y轴加上%
                    }
                },
                plotLines: [{   //一条延伸到整个绘图区的线，标志着轴中一个特定值。
                    color: 'red', //'#108EE9',
                    dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
                    width: 1.5,
                    value: xsjd,  // TODO 序时进度，y轴显示位置
                    zIndex: 5,
                    label: {
                        text: '▼',//+xsjd+'%',//xsjd+'%',
                        align: 'left',
                        rotation: 0,
                        x: -6,
                        y: 6,
                        style: {
                            'color': 'red',
                            'fontWeight': 'bold',
                            'font-size': '15px',
                            'cursor': 'default'
                        }
                    },
                    events: {
                        mouseover: function (e) {
                        },
                        mouseout: function () {
                        }
                    }
                }]
            },
            tooltip: { // style="color:{series.color}"
                //followTouchMove:false,
                //followPointer:false,
                //headerFormat: '<small>{point.key}</small><br>',
                headerFormat: '',
                pointFormat: '<span >{series.name}</span>: <b>{point.y} (' + _showDanwei + '元)</b> ({point.percentage:.2f}%)<br/>',
                shared: false
            },
            //colors: ['#F8A23C', '#7DC338'],
            colors: ['#D4EBFC', '#F66A01'],
            legend: {
                "enabled": false, // 隐藏图例
                reversed: true,
                layout: 'horizontal',
                align: 'right',
                itemMarginBottom: -15, // 底部margin-bottom
                verticalAlign: 'top',
                //x: 200,
                //y: 0,
                floating: false,
                borderWidth: 0,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: false
            },
            plotOptions: {
                series: {
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true,
                        align: 'right',
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 6px green'
                        },
                        formatter: function () {
                            var percent = this.point.percentage || 0;
                            return percent.toFixed(2) + '%';
                        }
                    },
                    events: {
                        legendItemClick: function () {	// 禁止图例点击
                            return false;
                        },
                        click: function (event) {
                            //支付状态
                            var zfzt = event.point.series.name;
                            var fundtypeCode = $("#payProgressYSLBGaojiInput_ID").val() || "";
                            var expfuncCode = $("#payProgressXMFLGaojiInput_ID").val() || "";
                            var bgtsourceCode = $("#payProgressZBLYGaojiInput_ID").val() || "";
                            var pAgencyCode = $("#payProgressYSDWGaojiInput_ID").val() || "";
                            //var agency = Base64.decode($("#svAgencyCode", parent.document).val());
                            var htmlParam = "&fundtypeCode=" + fundtypeCode + "&expfuncCode=" + expfuncCode + "&bgtsourceCode=" + bgtsourceCode + "&agencyCode=" + pAgencyCode;
                            if (zfzt == '已支付') {
                                window.parent.addTabToParent('已支付', '/df/pay/portalpay/statusquery/payrelated/payInfo.html?billtype=366&busbilltype=311&menuid=132C25064BD2BAE4627573EEA7BB9CA8&menuname=%u652F%u51FA%u8FDB%u5EA6%u652F%u4ED8%u4FE1%u606F&tokenid=' + getTokenId() + htmlParam);
                            } else if (zfzt == '可用指标') {
                                window.parent.addTabToParent('可用指标', '/df/pay/portalpay/input/payQuota.html?billtype=366&busbilltype=311&model=model5&menuid=B249D0506FCAAADDE98A515AB777DD31&menuname=%u652F%u51FA%u8FDB%u5EA6%u6307%u6807%u4FE1%u606F&tokenid=' + getTokenId() + htmlParam);
                            }
                        }
                    }
                }
            },
            series: jsonSeries
        });
    }

};

function dfpPayProgressSpanClick(name) {
    var fundtypeCode = $("#payProgressYSLBGaojiInput_ID").val() || "";
    var expfuncCode = $("#payProgressXMFLGaojiInput_ID").val() || "";
    var bgtsourceCode = $("#payProgressZBLYGaojiInput_ID").val() || "";
    var pAgencyCode = $("#payProgressYSDWGaojiInput_ID").val() || "";
    var htmlParam = "&fundtypeCode=" + fundtypeCode + "&expfuncCode=" + expfuncCode + "&bgtsourceCode=" + bgtsourceCode + "&agencyCode=" + pAgencyCode;
    if (name == 'zfje') {
        window.parent.addTabToParent('已支付', '/df/pay/portalpay/statusquery/payrelated/payInfo.html?billtype=366&busbilltype=311&menuid=132C25064BD2BAE4627573EEA7BB9CA8&menuname=%u652F%u51FA%u8FDB%u5EA6%u652F%u4ED8%u4FE1%u606F&tokenid=' + getTokenId() + htmlParam);
    } else if (name == 'zbye') {
        window.parent.addTabToParent('可用指标', '/df/pay/portalpay/input/payQuota.html?billtype=366&busbilltype=311&model=model5&menuid=B249D0506FCAAADDE98A515AB777DD31&menuname=%u652F%u51FA%u8FDB%u5EA6%u6307%u6807%u4FE1%u606F&tokenid=' + getTokenId() + htmlParam);
    }
}
