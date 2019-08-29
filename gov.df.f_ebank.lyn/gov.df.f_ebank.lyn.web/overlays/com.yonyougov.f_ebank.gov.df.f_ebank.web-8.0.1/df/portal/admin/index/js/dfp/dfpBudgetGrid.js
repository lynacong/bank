/**
 * 预算指标表格
 * <p>需要 dfp.js</p>
 */

//预算指标表格样式设置
changeColorNormal = function(obj) {
	var value = obj.value;
	// 功能分类
	if("expfunc_name"==obj.gridCompColumn.options.field){
		value = obj.row.value.expfunc_code + " " + value;
	}
	// 经济分类
	if("expeco_name"==obj.gridCompColumn.options.field){
		value = obj.row.value.expeco_code + " " + value;
	}
	// 预算单位
	if("agency_name"==obj.gridCompColumn.options.field){
		value = obj.row.value.agency_code + " " + value;
	}
	var html = '<div style="font-size:14px;line-height:30px;font-family:微软雅黑;">' + value + '</div>';
	obj.element.innerHTML = html;
};
changeColorZhibiao = function (obj) {
	var html = '';
	if(!(obj.value==null||obj.value==""||obj.value==undefined))
		html = '<div style="text-align:right;font-size:14px;line-height:30px;font-family:微软雅黑;">' + dfp.num2ThousandBreak(obj.value) + '</div>';
	obj.element.innerHTML = html;

	// 获取当前页面显示单位
	var pageDanweiSetting = $("#rightDanweiSetting").val();
	var moneyCount = 1e8; // 默认元显示
	if (pageDanweiSetting == 1 || pageDanweiSetting == "1") { // 万元显示
        moneyCount = 1e4;
	} else if (pageDanweiSetting == 2 || pageDanweiSetting == "2") { // 亿元显示
		moneyCount = 1;
	}

    // 项目支出（agencyexp_code以102开头）-指标金额超过100,000,000时，行底色变为 yellow
    var _agencyexpCode = obj.row.value.agencyexp_code || "";
    _agencyexpCode = _agencyexpCode.replace(" ", "");
    if (obj.value >= moneyCount && _agencyexpCode.substring(0, 3) == "102") {
        $(obj.element).parent().parent().css("background","yellow");
    }

    // 项目支出-指标金额在1000万以上，支出进度低于序时进度20%的 -> 字体红色，未覆盖原“指标余额”列蓝色字
    var _bsjjd = obj.row.value._bsjjd || "";
    _bsjjd = _bsjjd.replace(" ", "").replace("%", "");
    if (obj.value >= (moneyCount / 10) && parseFloat(_bsjjd) <= -20 && _agencyexpCode.substring(0, 3) == "102") {
        $(obj.element).parent().parent().css("color", "red");
    }

};
changeColorKeyong = function (obj) { // 原 #f56a00， 蓝 0000ff 
	var html = '';
	if(!(obj.value==null||obj.value==""||obj.value==undefined))
		html = '<div style="text-align:right;color:#0000ff;font-size:14px;line-height:30px;font-family:微软雅黑;">' + dfp.num2ThousandBreak(obj.value) + '</div>';
	obj.element.innerHTML = html;
}
changeColorZCJD = function (obj) {
	var html = '';
	if(!(obj.value==null||obj.value==""||obj.value==undefined))
		html = '<div style="text-align:right;font-size:14px;line-height:30px;font-family:微软雅黑;">' + obj.value + '</div>';
	obj.element.innerHTML = html;
}

tableSum = function (obj) {
	var fontColor = {
		"avi_money":"#000000",
		"canuse_money":"#000000"
	};
	var colName = obj.gridCompColumn.options.field;
	var html = '<div style="text-align:right;color:'+fontColor[colName]+';font-size:14px;line-height:30px;font-family:微软雅黑;">' + dfp.num2ThousandBreak(obj.value) + '</div>';
	obj.element.innerHTML = html;
};
//预算指标单击事件
tableBeforeEdit = function(obj) {
	var colName = (obj.gridObj.gridCompColumnArr[obj.colIndex]).options.field;
	if("canuse_money"!=colName)
		return;
	//ptd_budget.tabledbClick(obj);
	return;
}
//预算指标双击事件
tableDbCLick = function(obj){
	ptd_budget.tabledbClick(obj);
}

// 预算指标请求参数
var all_options_condition = " and paytype_code like '12%' ";
var all_options = {
	"tokenid": getTokenId(),
	"file_name": "",
	"agencyexp_name": "",
	"bis_code": "",
	"bis_name": "",
	"avi_money": "",
	"canuse_money": "",
	"expfunc_name": "",
	"expeco_name": "",
	"fundtype_name": "",
	"bgtsource_name": "",
	"agency_name": "",
	"mb_name": "",
	"sm_name": "",
	"billtype":"366",
	"busbilltype":"311",
	"pageInfo":"99999,0",
	"ajax": "noCache",
	"condition": all_options_condition
};
// 预算指标table初始化
// 预算指标table列
// 预算指标table列 外加（expfunc_code、expeco_code、agency_code）
var budgetTableColTitle = {
	"sum_id": "sum_id",
	"fromctrlid": "fromctrlid",
	"zfcgbs_code": "zfcgbs_code",
    "agencyexp_code": "agencyexp_code",
	"expeco_code": "expeco_code",
	"file_name": "指标文号",
	"is_zfcg": "政府采购",
	"agencyexp_name": "项目分类",
	"bis_code": "预算编码",
	"bis_name": "预算项目",
	"avi_money": "指标金额",
	"canuse_money": "指标余额",
	"canuse_money_ori": "指标余额(yuan)",
	"zcjd" : "支出进度",
	"_bsjjd": "比时间进度(+-)",
	"expeco_name": "经济分类",	
	"expfunc_name": "功能分类",
	"fundtype_name": "资金性质",
	"bgtsource_name": "指标来源",
	"agency_name": "预算单位",
	"mb_name": "业务处室",
	"sm_name": "指标摘要"
};
var viewModel = {
	dataTable: new u.DataTable({
		// 表头
		meta: budgetTableColTitle
	}, this),
};
ko.cleanNode($('#tableContent')[0]);
app = u.createApp({
	el: '#tableContent',
	model: viewModel
});

// 首次加载
var budgetTableInit = 1;
// 预算指标原始数据
var budgetTableDatadetail = [];
// 预算指标余额为零数据(元)
var budgetTableDatadetailNull = [];
// 预算指标原始数据(元，用于切换单位)
var budgetTableDatadetailOri = [];
// 预算指标原始数据-不含零数据(元，用于切换单位)
var budgetTableDatadetailOriNull = [];
// 预算指标万元数据
var budgetTableDatadetailWan = [];
// 预算指标-包含余额为零数据(万元)
var budgetTableDatadetailWanNull = [];
// 预算指标亿元数据
var budgetTableDatadetailYi = [];
// 预算指标-包含余额为零数据(亿元)
var budgeTableDatadetailYiNull = [];
// 预算指标余额为零标志，被选中为1，否则为0
var budgetTableYueNull = 0;
// 预算指标单位标志：0 元，1 万元，2 亿元
var budgetTableRadioWan = 1;
// 预算指标高级查询启动标志，启动为1，未启动为0
var budgetTableGaojiStart = 0;

/**
 * page key
 */
var dfpBudgetGridRightUrl = [
	//现金业务
	"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=CD41C5643DCAF6D96C6E83D559CB505B&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=AN&wfMenuId=C50DDC8D2A440D61713D513FDA429633",
	// 普通转账
	"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=C427F8BB4F684A1F147BF58255C4DD8A&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PT&wfMenuId=C50DDC8D2A440D61713D513FDA429633",
	// 代扣代缴
	"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=CDF5C89E23AAB26EFDBC9F5329021573&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=DK&wfMenuId=C50DDC8D2A440D61713D513FDA429633",
	// 柜台缴税
	"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=D1B480617114034B2F4E80F108B86E6A&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GT&wfMenuId=C50DDC8D2A440D61713D513FDA429633",
	// 批量支付
	"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=F34F5CB3DA92E88B3EDADBD8F997E869&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PLZF&wfMenuId=C50DDC8D2A440D61713D513FDA429633",
	// 公务卡
	"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=1FC7114B943D60AC07BBDBD07DA88A2C&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GWK&wfMenuId=C50DDC8D2A440D61713D513FDA429633",
	// 政府采购
	"/df/sd/pay/centerpay/input/paAccreditBillInputZFCG.html?billtype=366&busbilltype=322&menuid=C9028BFD7E0826FD3FBC3EFC213D83A1&menuname=%u653F%u5E9C%u91C7%u8D2D&wfMenuId=C50DDC8D2A440D61713D513FDA429633",
	// 预算执行情况
	"/df/sd/pay/commonModal/traceBalanceList/balanceForPortal.html",
	// 导出Excel
	""
];

/**
 * budget
 */
// 预算指标选中的行的序号
var gridSelectObj; // 选中行对象
var focus_row_index; // 选中行序号
var focus_row_sum_id; // 选中行原始数据sum_id
var focus_row_fromctrlid; // 选中行原始数据fromctrlid
var focus_row_zfcgbs_code; // 政府采购标识，1 政府采购 显示6 7 8, 0 非政府采购 6 不显示 
var focus_row_canuse_money; // can use money
var focus_row_expeco_code; // 经济分类code
var ptd_budget = {
	bf : function(){
		// 预算指标高级查询层操作
		$("#demand").click(function(){
			var isNone = $(".demandContent").css("display");
			if(isNone=="none") {$(".demandContent").css("display", "block");return;}
			if(isNone=="block") $(".demandContent").css("display", "none");
		});
		$("#close").click(function(){
			$(".demandContent").css({"display":"none"});
		});

		// 高级查询替换为modal
        var budgetGridModalHtml = '<div class="example-modal" style="width: 500px;">' +
            '<div class="modal fade" id="budgetGridCheckZTreeModal">' +
            '   <div class="modal-dialog">' +
            '       <div class="modal-content" style="width: 500px;border-radius: 8px;">' +
            '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
            '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
            '                   <h4 class="modal-title" id="budgetGridCheckZTreeTitle">选择标题</h4>' +
            '               </div>' +
            '               <div class="modal-body" style="padding: 5px 10px;">' +
            '                   <input type="text" id="budgetModalZTreeCheck" value="" style="width: 479px; margin-bottom: 5px; height: 30px; padding-left: 10px;" placeholder="输入查询条件">' +
            '                   <div class="box box-info" style="border: solid 1px #ccc;">' +
            '                       <ul id="budgetModalZTree" class="ztree" style="width: 468px; height: 235px; margin-left: 10px;margin-top: 0px;overflow: auto;"></ul>' +
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
        $("body").append(budgetGridModalHtml);
		// 预算指标单条件查询
		$("#budgetGaojiCheck").find("ul").find("li").each(function(i) {
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
            			"zbwh":"FILE",	// 指标文号
            			"xmfl":"AGENCYEXP",	// 项目分类
            			"ysxm":"BIS",	// 预算项目
            			"ysdw":"AGENCY",	// 预算单位
            			"zffs":"PAYTYPE"	// 支付方式
            		};
            		var elementsName = {
            			"zbwh":"指标文号",	// 指标文号
            			"xmfl":"项目分类",	// 项目分类
            			"ysxm":"预算项目",	// 预算项目
            			"ysdw":"预算单位",	// 预算单位
            			"zffs":"支付方式"	// 支付方式
            		};
	                var element = elements[type];
	                $("#budgetGridCheckZTreeTitle").html(elementsName[type] + '选择');
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
	                        
                            for (var i in eleDetail) {
                                if (!eleDetail.hasOwnProperty(i)) continue;
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
	
	                        zSetting.callback = {
	                            onClick: function (event, treeId, treeNode) {
	                                //$("#content_wrap2").css({"display": "none"});
	                                $("#budget" + id + "GaojiInput_NAME").val(treeNode.name);
	                                $("#budget" + id + "GaojiInput_ID").val(treeNode.code);
	                                $("#budgetGridCheckZTreeModal").modal('hide');
	                            }
	                        };
	                        $("#budgetModalZTreeCheck").val("");
	                        $("#budgetGridCheckZTreeModal").modal({
	                            keyboard: true
	                        }).on("shown.bs.modal", function () {
	                            payProgressZTreeNodeList = [];
	                            //$("#budgetModalZTree").empty();
	                            zTreeObj = $.fn.zTree.init($("#budgetModalZTree"), zSetting, zNodes);
	                            zTreeObj.expandAll(true);
	                        });
	                    }
	                });
	            };
	
	            if (i == 0) { // 指标文号
	                ztree("ZBWH", "zbwh");
	            } else if (i == 1) { // 项目分类 expfuncCode
	                ztree("XMFL", "xmfl");
	            } else if (i == 2) { // 预算项目
	                ztree("YSXM", "ysxm");
	            } else if (i == 3) { // 预算单位 agencyCode
	                ztree("YSDW", "ysdw");
	            } else if (i == 4) { // 支付方式
	            	ztree("ZFFS", "zffs");
	            }
            });
		});
		// 添加查询框事件
		$("#budgetModalZTreeCheck")
	        .bind("propertychange", searchNode)
	        .bind("input", searchNode);
	    function searchNode() {
	        payProgressZTreeCheckValue = $("#budgetModalZTreeCheck").val();
	        var zTreeObj = $.fn.zTree.getZTreeObj("budgetModalZTree");
	        // 显示上次搜索后背隐藏的结点
	        zTreeObj.showNodes(payProgressZTreeNodeList);
	        // 查找不符合条件节点
	        var filterFunc = function(node){
	            // 查找不符合条件叶子节点
	            if(node.isParent || node.name.indexOf(payProgressZTreeCheckValue) != -1) {
	                return false;
	            }
	            return true;
	        };
	        //获取不符合条件的叶子结点
	        payProgressZTreeNodeList=zTreeObj.getNodesByFilter(filterFunc);
	        //隐藏不符合条件的叶子结点
	        zTreeObj.hideNodes(payProgressZTreeNodeList);
	    }
		// 预算指标 高级查询 外层提交按钮
		$("#sure").on("click", function(){
			
			var file_name = $("#budgetZBWHGaojiInput_NAME").val(),
				zbwd_id = $("#budgetZBWHGaojiInput_ID").val(),
				agencyexp_name = $("#budgetXMFLGaojiInput_NAME").val(),
				xmfl_id = $("#budgetXMFLGaojiInput_ID").val(),
				bis_name = $("#budgetYSXMGaojiInput_NAME").val(),
				ysxm_id = $("#budgetYSXMGaojiInput_ID").val(),
				agency_name = $("#budgetYSDWGaojiInput_NAME").val(),
				ysdw_id = $("#budgetYSDWGaojiInput_ID").val(),
				paytype_name = $("#budgetZFFSGaojiInput_NAME").val(),
				zffs_id = $("#budgetZFFSGaojiInput_ID").val(),
				zfcg_id = $("#budgetZFCGGaojiInput_ID").val();
			
			// 条件拼接
			var condition = all_options_condition;
			if(!isObjNull(file_name)){
				condition += " and file_id= '" + zbwd_id + "' ";
			}
			if(!isObjNull(agencyexp_name)){
				condition += " and agencyexp_id= '" + xmfl_id + "' ";
			}
			if(!isObjNull(bis_name)){
				condition += " and bis_id= '" + ysxm_id + "' ";
			}
			if(!isObjNull(agency_name)){
				condition += " and c.agency_id= '" + ysdw_id + "' ";
			}
			if(!isObjNull(paytype_name)){
				condition += " and paytype_id= '" + zffs_id + "' ";
			}
			if(zfcg_id == '2') { // all
                condition += "";
			} else if(zfcg_id == '1') { // is zfcg
                condition += " and zfcgbs_code='1' ";
			} else if(zfcg_id == '0') {
                condition += " and zfcgbs_code='0' ";
			}
			all_options.condition = condition;
			
			$(".content_wrap").css({"display":"none"});
			$(".demandContent").css({"display":"none"});
			budgetTableGaojiStart = 1;
			ptd_budget.show();
		});
		// 预算指标余额为零
		$("#budgetTableYueNull").on("click", function(){
			if($(this).is(":checked")){
				budgetTableYueNull = 1;
			}else{
				budgetTableYueNull = 0;
			}
			ptd_budget.show();
		});
		
		// 预算指标单位切换
		$("#budgetDanweiChange").change(function(){
			budgetTableRadioWan = $(this).val();
			ptd_budget.show();
		});
		
		// 预算指标右键
		var $budgetWrapper = $("#budgetWrapper");
		$budgetWrapper.css("display", "none");
		$budgetWrapper.bind("contextmenu", function(){ return false;});
		//document.oncontextmenu = function(e){ return false;}
		// 绑定中间滚动事件
//		var scrollFunc = function (e) {  
//	        e = e || window.event;  
//	        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件               
//	        	$budgetWrapper.css("display", "none");
//	        } else if (e.detail) {  //Firefox滑轮事件  
//	        	$budgetWrapper.css("display", "none");
//	        }
//	    }  
//	    //给页面绑定滑轮滚动事件  
//	    if (document.addEventListener) {//firefox  
//	        document.addEventListener('DOMMouseScroll', scrollFunc, false);  
//	    }  
//	    //滚动滑轮触发scrollFunc方法  //ie 谷歌  
//	    window.onmousewheel = document.onmousewheel = scrollFunc; 
		
		$("#mainGeriContentDiv").bind("contextmenu", function(e){
			e = e || window.event;
			var browser = whichBrowser();
			var eventTarget = e.srcElement ? e.srcElement : e.target;
			// 取消全部tr选中状态
			$(this).find("tr").removeClass("u-grid-content-focus-row").removeClass("u-grid-content-sel-row");

			// 获取对应focus_row_index和focus_row_sum_id
			if(browser == "IE"){
				var cur = $(eventTarget)[0];
				while(true){
					cur = cur.parentNode;
					if(cur.tagName.toUpperCase() == "TR"){
						break;
					}
				}
				// 行选中状态
				focus_row_index = $('#gridShow_content_tbody > tr').index(cur);
				if(focus_row_index == undefined || focus_row_index < 0){
					// 取消右键点击的默认事件
					return false;
				}
				$(cur).addClass("u-grid-content-focus-row").addClass("u-grid-content-sel-row");
				focus_row_sum_id = $(cur).find("td")[0].innerText;
				if(focus_row_sum_id != null){
					focus_row_sum_id = focus_row_sum_id.replace('\r\n', '')
				}
				focus_row_fromctrlid = $(cur).find("td")[1].innerText;
				if(focus_row_fromctrlid != null){
					focus_row_fromctrlid = focus_row_fromctrlid.replace('\r\n', '')
				}
				focus_row_zfcgbs_code = $(cur).find("td")[2].innerText;
				if(focus_row_zfcgbs_code != null){
					focus_row_zfcgbs_code = focus_row_zfcgbs_code.replace('\r\n', '')
				}
				focus_row_canuse_money = $(cur).find("td")[3].innerText;
                if(focus_row_canuse_money != null){
                    focus_row_canuse_money = focus_row_canuse_money.replace('\r\n', '')
                }
                focus_row_expeco_code = $(cur).find("td")[5].innerText;
                if(focus_row_expeco_code != null){
                    focus_row_expeco_code = focus_row_expeco_code.replace('\r\n', '')
                }
				
			}else if(browser == "Chrome" || brower != ""){ // TODO 暂时只考虑IE和谷歌
				//focus_row_index = $('#gridShow_content_tbody > tr').index(eventTarget.closest('tr'));
				var cur = $(eventTarget)[0];
				// 获取点击行对象
				while(true){
					cur = cur.parentNode;
					if(cur.tagName.toUpperCase() == "TR"){
						break;
					}
				}
				focus_row_index = $('#gridShow_content_tbody > tr').index(cur);
				if(focus_row_index == undefined || focus_row_index < 0){
					// 取消右键点击的默认事件
					return false;
				}
				$(cur).addClass("u-grid-content-focus-row").addClass("u-grid-content-sel-row");
				// 获取行中一列数据，顺序参考HTML
				focus_row_sum_id = ($(cur).find("td")[0]).innerText;
				focus_row_fromctrlid = ($(cur).find("td")[1]).innerText;
				focus_row_zfcgbs_code = ($(cur).find("td")[2]).innerText;
				focus_row_canuse_money = ($(cur).find("td")[3]).innerText;
                focus_row_expeco_code = ($(cur).find("td")[5]).innerText;
			}else{
				focus_row_index = -1;
			}
			if(focus_row_index == undefined || focus_row_index < 0){
				// 取消右键点击的默认事件
				return false;
			}

			focus_row_sum_id = focus_row_sum_id.replace(/\r\n/ig, "");
			
			// 自定义右键菜单显示
			$("#budgetWrapper").css("display", "block")
				.css("position", "fixed")
				.css("zIndex", "9999999999")
				.css("left", e.clientX+'px')
				.css("top", e.clientY-110 +'px');
			// 换行右键初始化
			$("div#budgetWrapper ul").find("li").each(function(i) {
				$(this).css("color", "#0000ff").css("text-decoration", "none").css("background-color", "#FFF");
			});
			// 政府采购标识判定：政府采购 1 显示6 7 8，非政府采购不显示 6
			if(focus_row_zfcgbs_code == "1" || focus_row_zfcgbs_code == 1) {
				// 设置不可用数量
				var disableCount = focus_row_canuse_money == 0 || focus_row_canuse_money =="0" ? 7 : 6;
				$("div#budgetWrapper ul").find("li").each(function(i) {
					var i2 = $(this).data("index");
					if (i2 < disableCount) {
						$(this).css("color", "#c3b9b9").css("cursor", "default"); // .css("background-color", "#DEDEDE")
						$(this).unbind("mouseover").unbind("mouseleave");
					} else {
						$(this).css("background-color", "#fff");
						$(this).mouseover(function(){
							$(this).css("color", "#FFF").css("text-decoration", "none").css("background-color", "#108EE9");
						}).mouseleave(function(){
							$(this).css("color", "#0000ff").css("text-decoration", "none").css("background-color", "#FFF");
						});
					}
				});
			}
			// 非政府采购
			if(focus_row_zfcgbs_code == "0" || focus_row_zfcgbs_code == 0) {
				if(focus_row_canuse_money == 0 || focus_row_canuse_money =="0") {
					$("div#budgetWrapper ul").find("li").each(function(i){
						var i2 = $(this).data("index");
                        // 加入经济分类判断：部门经济分类不是通用(30000)，代扣代缴变灰
						if(i2 < 7  || (focus_row_expeco_code != '30000' && i2 == 2)) {
							$(this).css("color", "#c3b9b9").css("cursor", "default"); // .css("background-color", "#DEDEDE")
							$(this).unbind("mouseover").unbind("mouseleave");
						} else {
							$(this).mouseover(function(){
								$(this).css("color", "#FFF").css("text-decoration", "none").css("background-color", "#108EE9");
							}).mouseleave(function(){
								$(this).css("color", "#0000ff").css("text-decoration", "none").css("background-color", "#FFF");
							});
						}
					});
				} else {
					$("div#budgetWrapper ul").find("li").each(function(i){
						var i2 = $(this).data("index");
                        // 加入经济分类判断：部门经济分类不是通用(30000)，代扣代缴变灰
						if(i2 == 6 || (focus_row_expeco_code != '30000' && i2 == 2)) {
							$(this).css("color", "#c3b9b9").css("cursor", "default"); // .css("background-color", "#DEDEDE")
							$(this).unbind("mouseover").unbind("mouseleave");
						} else {
							$(this).mouseover(function(){
								$(this).css("color", "#FFF").css("text-decoration", "none").css("background-color", "#108EE9");
							}).mouseleave(function(){
								$(this).css("color", "#0000ff").css("text-decoration", "none").css("background-color", "#FFF");
							});
						}
					});
				}

			}
			return false; // 取消右键效果
		});
		// 预算指标右键菜单点击
		$budgetWrapper.find("ul").find("li").each(function(){
			$(this).click(function(e){
				var i = $(this).data("index");

                // 可用余额为0时
                if (focus_row_canuse_money == 0 || focus_row_canuse_money == "0") {
                    if (i < 7)
                        return false;
                }

                // 政府采购标识判定：政府采购 1 显示6 7 8，非政府采购不显示 6
                if (focus_row_zfcgbs_code == "1" || focus_row_zfcgbs_code == 1) {
                    if (i < 6)
                        return false;
                } else if (focus_row_zfcgbs_code == "0" || focus_row_zfcgbs_code == 0) {
                    if (i == 6)
                        return false;
                }

                // 加入经济分类判断：部门经济分类不是通用(30000)，代扣代缴不可点击
                if (focus_row_expeco_code != '30000') {
                    if (i == 2)
                        return false;
                }
				
				$budgetWrapper.css("display", "none");
				// 导出Excel
				if(i == 8){
					var fields = [];
					// 设置数字列
                    // "avi_money": "指标金额", "canuse_money": "指标余额", "canuse_money_ori": "指标余额(yuan)",
                    var _count = -1;
                    var notShowBudgetCol = ["sum_id", "fromctrlid", "zfcgbs_code", "canuse_money_ori"],
                        budgetColToDecimal = ["avi_money", "canuse_money", "canuse_money_ori"];
                    var _budgetLength = [170,170,170,170,170,80,130,130,120,120,120,180,180,130,130,300,130,170];
					for(var key in budgetTableColTitle){
					    if(!budgetTableColTitle.hasOwnProperty(key)) continue;
						_count += 1;
					    // 排除隐藏字段
                        if(dfp.isArrayContain(notShowBudgetCol, key))
                            continue;
                        var type = dfp.isArrayContain(budgetColToDecimal, key) ? "decimal" : "String";
						var str = '{' + '"fieldName"' + ':' +'"' + key + '"' + "," + '"title"' + ':' + '"' + budgetTableColTitle[key] + '", "type":"' + type + '", "field_width":"' + _budgetLength[_count] + '"}';
						fields.push(JSON.parse(str));
					}
					var params = {
						"type" : "all",
						"fieldMap" : fields,
					};
					export2Excel(viewModel.dataTable, params, null);
					return false;
				}
				
				// 参数确认
				var url;
				var title = $(this).text();
				url = fullUrlWithTokenid(dfpBudgetGridRightUrl[i]) + "&sum_id=" + focus_row_sum_id;
				// 预算执行情况
				if(i == 7){
					title = "执行情况";
					url = fullUrlWithTokenid(dfpBudgetGridRightUrl[i]) + "&sum_id=" + focus_row_fromctrlid;
				}
				window.parent.addTabToParent(title, url);
			});
		});
		
	},
	_ajax : function(){
		if(budgetTableInit == 1){
			budgetTableInit = 0;
			return true;
		}
		if(budgetTableGaojiStart == 1){ // 首次请求或高级查询
			budgetTableGaojiStart = 0; // 高级查询启动，余额为零条件复原
			budgetTableYueNull = 0; // 余额显示复原
			$("#budgetTableYueNull").removeAttr("checked");
			budgetTableRadioWan = 0; // 单位显示复原
			$("#budgetDanweiChange").html('<option value="0" id="budgetDanweiChangeYuan">元</option><option selected="selected" value="1">万元</option><option value="2">亿元</option>');
			return true;
		}else{	// 未启动高级查询，使用静态数据
			if(budgetTableYueNull == 1 || budgetTableYueNull == "1"){ // 包含余额为零数据
				if(budgetTableRadioWan == 0 || budgetTableRadioWan == "0") {
					budgetTableDatadetail = budgetTableDatadetailOri;
				} else if(budgetTableRadioWan == 1 || budgetTableRadioWan == "1") {
					budgetTableDatadetail = budgetTableDatadetailWan;
				} else if(budgetTableRadioWan == 2 || budgetTableRadioWan == "2") {
					budgetTableDatadetail = budgetTableDatadetailYi;
				} else {
					budgetTableDatadetail = budgetTableDatadetailWan;
				}
			}else{
				if(budgetTableRadioWan == 0 || budgetTableRadioWan == "0") {
					budgetTableDatadetail = budgetTableDatadetailOriNull;
				} else if(budgetTableRadioWan == 0 || budgetTableRadioWan == "1") {
					budgetTableDatadetail = budgetTableDatadetailWanNull;
				} else if(budgetTableRadioWan == 0 || budgetTableRadioWan == "2") {
					budgetTableDatadetail = budgetTableDatadetailYiNull;
				} else {
					budgetTableDatadetail = budgetTableDatadetailWanNull;
				}
			}
			return false;
		}
	},
	show : function(isClick){
		$("#budgetGridImg").css("display", "block");
		var isNeedAjax = this._ajax();
		if(isClick || isNeedAjax){
			$.ajax({
				url: "/df/pay/centerpay/input/getPlanBoundDataForPortal.do?_t="+Date.parse(new Date()),
				type: "GET",
				dataType: "json",
				data: dfp.commonData(all_options),
				success: function(data){

                    // 清空缓存
                    budgetTableDatadetail = [];
                    budgetTableDatadetailNull = [];
                    budgetTableDatadetailOri = [];
                    budgetTableDatadetailOriNull = [];
                    budgetTableDatadetailWan = [];
                    budgetTableDatadetailWanNull = [];
                    budgetTableDatadetailYi = [];
                    budgeTableDatadetailYiNull = [];

					budgetTableDatadetailOri = data.dataDetail;
					
					// 首次加载，显示余额不为零的数据
					ptd_budget.classify();
						
					// yuan
					//budgetTableDatadetail = budgetTableDatadetailOriNull;
					//budgetTableDatadetail = budgetTableDatadetailWanNull;

                    ptd_budget.changeColumnName();
                    viewModel.dataTable.removeAllRows();
                    viewModel.dataTable.setSimpleData(budgetTableDatadetail,{
                        unSelect: true
                    });
                    $("#budgetGridImg").css("display", "none");
                    return false;
				}
			});
		} else {
			this.classify();
			this.changeColumnName();
			viewModel.dataTable.removeAllRows();
			viewModel.dataTable.setSimpleData(budgetTableDatadetail,{
				unSelect: true
			});
			$("#budgetGridImg").css("display", "none");
			return false;
		}
		
	},
	/**
	 * 切换列标题和数据集合
	 */
	changeColumnName : function(budgetTableRadioWan){
		budgetTableRadioWan = $("#budgetDanweiChange").val();
		if(budgetTableRadioWan == 0 || budgetTableRadioWan == "0") {
			app.comps[0].grid.getColumnByField('avi_money').options['title'] = '指标金额(元)';
			app.comps[0].grid.getColumnByField('canuse_money').options['title'] = '指标余额(元)';
			budgetTableDatadetail = budgetTableDatadetailOriNull;
		} else if(budgetTableRadioWan == 1 || budgetTableRadioWan == "1") {
			app.comps[0].grid.getColumnByField('avi_money').options['title'] = '指标金额(万元)';
			app.comps[0].grid.getColumnByField('canuse_money').options['title'] = '指标余额(万元)';
			budgetTableDatadetail = budgetTableDatadetailWanNull;
		} else if(budgetTableRadioWan == 2 || budgetTableRadioWan == "2") {
			app.comps[0].grid.getColumnByField('avi_money').options['title'] = '指标金额(亿元)';
			app.comps[0].grid.getColumnByField('canuse_money').options['title'] = '指标余额(亿元)';
			budgetTableDatadetail = budgetTableDatadetailYiNull;
		} else {
			app.comps[0].grid.getColumnByField('avi_money').options['title'] = '指标金额(万元)';
			app.comps[0].grid.getColumnByField('canuse_money').options['title'] = '指标余额(万元)';
			budgetTableDatadetail = budgetTableDatadetailWanNull;
		}
	},
	classify : function(){
		// 数字列为：avi_money, canuse_money
		var length = budgetTableDatadetailOri.length||0;
		
		// 处理显示数据，原始数据为 budgetTableDatadetailOri
		budgetTableDatadetailNull = [];
		budgetTableDatadetailOriNull = [];
		budgetTableDatadetailWan = [];
		budgetTableDatadetailWanNull = [];
		budgetTableDatadetailYi = [];
		budgetTableDatadetailYiNull = [];
        // 比时间进度
        var _bsjjdFunc_XSJD = dfp.progressInYear();
        var _bsjjdFunc = function (zcjd) {
            zcjd = zcjd.replace(" ", "").replace("%", "");
            var _zcjd = parseFloat(zcjd);
            return (_zcjd - _bsjjdFunc_XSJD).toFixed(2);// + "%";
        };
		for(var i=0; i<length; i++){
			budgetTableDatadetailOri[i].canuse_money_ori = budgetTableDatadetailOri[i].canuse_money;
			// 支出进度
			var zcjd = 0;
			if(budgetTableDatadetailOri[i].avi_money > 0){
				zcjd = (budgetTableDatadetailOri[i].use_money/budgetTableDatadetailOri[i].avi_money * 100);
			}
			budgetTableDatadetailOri[i].zcjd = zcjd.toFixed(2) + "%";
			// 比时间进度
            budgetTableDatadetailOri[i]._bsjjd = _bsjjdFunc(budgetTableDatadetailOri[i].zcjd);

			// 是否为政府采购
			if(budgetTableDatadetailOri[i].zfcgbs_code == '1') {
				budgetTableDatadetailOri[i].is_zfcg = '是';
			} else if(budgetTableDatadetailOri[i].zfcgbs_code == '0') {
				budgetTableDatadetailOri[i].is_zfcg = '否';
			} 
			if(!(budgetTableDatadetailOri[i].canuse_money == "0" ||
				budgetTableDatadetailOri[i].canuse_money == "0.0" ||
				budgetTableDatadetailOri[i].canuse_money == "0.00" ||
				budgetTableDatadetailOri[i].canuse_money == 0 ||
				budgetTableDatadetailOri[i].canuse_money == 0.0 ||
				budgetTableDatadetailOri[i].canuse_money == 0.00)) {
				
				// 余额不为零的原始数据：元
				budgetTableDatadetailOriNull.push(budgetTableDatadetailOri[i]);
			}
		}
		
		// 包含零 - 万/亿元显示
		var lengthOri = budgetTableDatadetailOri.length;
		for(var i=0; i<lengthOri; i++){
			for(var j=0; j<2; j++){
				var obj = {
					"sum_id": budgetTableDatadetailOri[i].sum_id,
					"file_name": budgetTableDatadetailOri[i].file_name,
					"agencyexp_name": budgetTableDatadetailOri[i].agencyexp_name,
					"agencyexp_code": budgetTableDatadetailOri[i].agencyexp_code,
					"bis_code": budgetTableDatadetailOri[i].bis_code,
					"bis_name": budgetTableDatadetailOri[i].bis_name,
					"avi_money":"",
					"canuse_money":"",
					"canuse_money_ori":"",
					"expfunc_code": budgetTableDatadetailOri[i].expfunc_code,
					"expfunc_name": budgetTableDatadetailOri[i].expfunc_name,
					"expeco_code": budgetTableDatadetailOri[i].expeco_code,
					"expeco_name": budgetTableDatadetailOri[i].expeco_name,
					"fundtype_name": budgetTableDatadetailOri[i].fundtype_name,
					"bgtsource_name": budgetTableDatadetailOri[i].bgtsource_name,
					"agency_code": budgetTableDatadetailOri[i].agency_code,
					"agency_name": budgetTableDatadetailOri[i].agency_name,
					"mb_name": budgetTableDatadetailOri[i].mb_name,
					"sm_name": budgetTableDatadetailOri[i].sm_name,
					"zfcgbs_code": budgetTableDatadetailOri[i].zfcgbs_code,
					"fromctrlid": budgetTableDatadetailOri[i].fromctrlid,
					"zcjd" : budgetTableDatadetailOri[i].zcjd, // 3.50%
                    "_bsjjd": budgetTableDatadetailOri[i]._bsjjd,
                    "expeco_code": budgetTableDatadetailOri[i].expeco_code
				};
				if (obj.zfcgbs_code == '1') 
					obj.is_zfcg = '是';
				else if (obj.zfcgbs_code == '0')
					obj.is_zfcg = '否';
				if(j == 0){
					obj.avi_money = (budgetTableDatadetailOri[i].avi_money/1e4).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOri[i].canuse_money/1e4).toFixed(2);
					obj.canuse_money_ori = budgetTableDatadetailOri[i].canuse_money;
					budgetTableDatadetailWan.push(obj);
				}
				if(j == 1){
					obj.avi_money = (budgetTableDatadetailOri[i].avi_money/1e8).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOri[i].canuse_money/1e8).toFixed(2);
					obj.canuse_money_ori = budgetTableDatadetailOri[i].canuse_money;
					budgetTableDatadetailYi.push(obj);
				}
			}
		}
		
		// 不含零
		var lenthOriNull = budgetTableDatadetailOriNull.length;
		for(var m=0; m<lenthOriNull; m++){
			for(var n=0; n<2; n++){
				var obj = {
					"sum_id": budgetTableDatadetailOriNull[m].sum_id,
					"file_name": budgetTableDatadetailOriNull[m].file_name,
					"agencyexp_name": budgetTableDatadetailOriNull[m].agencyexp_name,
					"agencyexp_code": budgetTableDatadetailOriNull[m].agencyexp_code,
					"bis_code": budgetTableDatadetailOriNull[m].bis_code,
					"bis_name": budgetTableDatadetailOriNull[m].bis_name,
					"avi_money":"",
					"canuse_money":"",
					"canuse_money_ori":"",
					"expfunc_code": budgetTableDatadetailOriNull[m].expfunc_code,
					"expfunc_name": budgetTableDatadetailOriNull[m].expfunc_name,
					"expeco_code": budgetTableDatadetailOriNull[m].expeco_code,
					"expeco_name": budgetTableDatadetailOriNull[m].expeco_name,
					"fundtype_name": budgetTableDatadetailOriNull[m].fundtype_name,
					"bgtsource_name": budgetTableDatadetailOriNull[m].bgtsource_name,
					"agency_code": budgetTableDatadetailOriNull[m].agency_code,
					"agency_name": budgetTableDatadetailOriNull[m].agency_name,
					"mb_name": budgetTableDatadetailOriNull[m].mb_name,
					"sm_name": budgetTableDatadetailOriNull[m].sm_name,
					"zfcgbs_code": budgetTableDatadetailOriNull[m].zfcgbs_code,
					"fromctrlid": budgetTableDatadetailOriNull[m].fromctrlid,
					"zcjd" : budgetTableDatadetailOriNull[m].zcjd,
                    "_bsjjd": budgetTableDatadetailOriNull[m]._bsjjd,
                    "expeco_code": budgetTableDatadetailOriNull[m].expeco_code
				};
				if (obj.zfcgbs_code == '1') 
					obj.is_zfcg = '是';
				else if (obj.zfcgbs_code == '0')
					obj.is_zfcg = '否';
				if(n == 0){
					obj.avi_money = (budgetTableDatadetailOriNull[m].avi_money/1e4).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOriNull[m].canuse_money/1e4).toFixed(2);
					obj.canuse_money_ori = budgetTableDatadetailOriNull[m].canuse_money;
					budgetTableDatadetailWanNull.push(obj);
				}
				if(n == 1){
					obj.avi_money = (budgetTableDatadetailOriNull[m].avi_money/1e8).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOriNull[m].canuse_money/1e8).toFixed(2);
					obj.canuse_money_ori = budgetTableDatadetailOriNull[m].canuse_money;
					budgetTableDatadetailYiNull.push(obj);
				}
			}
		}
		
	},
	tree : function(id, title, type){
		var elements = {
			"zbwh":"FILE",	// 指标文号
			"xmfl":"AGENCYEXP",	// 项目分类
			"ysxm":"BIS",	// 预算项目
			"ysdw":"AGENCY",	// 预算单位
			"zffs":"PAYTYPE"	// 支付方式
		};
		var elementsName = {
			"zbwh":"指标文号",	// 指标文号
			"xmfl":"项目分类",	// 项目分类
			"ysxm":"预算项目",	// 预算项目
			"ysdw":"预算单位",	// 预算单位
			"zffs":"支付方式"	// 支付方式
		};
		var element = elements[type];
		$("#budgetGridCheckZTreeTitle").html(elementsName[type] + '选择');
		var all_options1 = { "element": element, "tokenid": getTokenId(), "ele_value": "", "ajax": "noCache"};
		$.ajax({
			url: "/df/dic/dictree.do",
			type: "GET",
			dataType: "json",
			//async: false,
			data: dfp.commonData(all_options1),
			success: function(data) {
				var setting = {
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
						simpleData: { enable:true, idKey: "id", pIdKey: "pId", rootPId: ""}
                    },
					callback: {  
						onDblClick: function(event, treeId, treeNode){
							$("#_portal_table_gaoji_submit_input").click();
						}
					}
				};
				var zNodes = [];
                zNodes.push({id: "", name: "全部", pId: ""});
                var eleDetail = data.eleDetail;
				for(var i in eleDetail){
					if(!eleDetail.hasOwnProperty(i)){
						continue;
					}
                    var _name = eleDetail[i].codename;
                    // 预算单位显示code
                    if (type !== 'ysdw') {
                        _name = dfp_re.space.removeAll(dfp_re.num.removeAll(_name));
                    }
					zNodes.push({
					    id:eleDetail[i].chr_id,
                        pId:eleDetail[i].parent_id,
                        name:_name,
                        code: eleDetail[i].chr_code
					});
				}
				$.fn.zTree.init($("#zhibiaotree"), setting, zNodes);
			}
		});
	},
	tabledbClick : function(obj){
		var gridObj = obj.gridObj;	// 表格控件对象
		var rowIndex = obj.rowIndex;	// 数据行对应的index
		var rowValue = obj.rowObj.value;	// 数据行对象值
		var all_options2 = {
			"tokenid": getTokenId(),
			"file_name": rowValue.file_name,
			"expfunc_name": rowValue.expfunc_name,
			"agencyexp_name": rowValue.agencyexp_name,
			"expeco_name": rowValue.expfunc_name,
			"approve_date": rowValue.approve_date,
			"avi_money": rowValue.avi_money,
			"canuse_money": rowValue.canuse_money,
			"sum_id": rowValue.fromctrlid
		};
		
		//var url = "/df/sd/pay/paymentinfo/paymentinfo.html?tokenid="+getTokenId();
		// url += "&file_name="+all_options2.file_name;
		// url += "&expfunc_name="+all_options2.expfunc_name;
		// url += "&agencyexp_name="+all_options2.agencyexp_name;
		// url += "&expeco_name="+all_options2.expeco_name;
		// url += "&approve_date="+all_options2.approve_date;
		// url += "&avi_money="+all_options2.avi_money;
		// url += "&canuse_money="+all_options2.canuse_money;
		// url += "&sum_id="+all_options2.sum_id;
		// url += "&billtype=366";
		// url += "&menuid=B357D1CA7B7E7B8B3D27562EFDDE1B6C";

		// 预算执行情况
		var url = "/df/sd/pay/commonModal/traceBalanceList/balanceForPortal.html?tokenid="+getTokenId();
        url += "&sum_id=" + rowValue.fromctrlid;
		window.parent.addTabToParent("预算执行情况", url);
	}
};

var ptd_util = {
	/**
	 * 对象是否为空
	 */
	isNull : function(obj){
		if (obj === null) return true;
		if (obj === undefined) return true;
		if (obj === "undefined") return true;
		if (obj === "") return true;
		if (obj === "[]") return true;
		if (obj === "{}") return true;
		return false;
	}
};

/**
 * 判断tokenid前是否已存在参数
 * @params url
 * @return 拼接好tokenid的url
 */ 
function fullUrlWithTokenid(url){
	if(url == null || url == undefined)
		return url;
	url = url.replace(/\s/g, "");
	if(url.indexOf("?") > -1)
		return url + "&tokenid=" + getTokenId();
	if(url.indexOf("?") < 0)
		return url + "?tokenid=" + getTokenId();
}

// 对象为空
function isObjNull(obj){
	if (obj == "")
		return true;
	if (obj == null)
		return true;
	if (obj == undefined)
		return true;
	var length = obj.length;
	if(!length) return true; // undefined
	if(length == 0)	return true;
	var count = 0;
	for(var i = 0; i < length; i++){
		if(obj[i] == null || obj[i] == "" || obj[i] == undefined)
			count += 1;
	}
	return count == length ? true : false;
}

/**
 * 获取当前时间
 * @params pp: 支付进度
 */
function datetimeSpe(type) {
	var SEP_1 = "-";
	var SEP_2 = ":";
	var myDate = new Date();
	var Year = myDate.getFullYear();
	var Month = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
	Month = Month>=1&&Month<=9 ? "0"+Month : Month;
	var Today = myDate.getDate(); //获取当前日(1-31)
	Today = Today>=1&&Today<=9 ? "0"+Today : Today;
	var Day = myDate.getDay();
	if ("pp" == type) {
		return Year + SEP_1 + Month + SEP_1 + Today; // 2017-07-22
	}
	
}


/**
 * excel工具
 */
var capital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var digit = [1, 26, 676, 17576];
var capital_zero = "-0ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//导出dataTable数据到Excel文件中
function export2Excel(dataTable, options, fileName) {
    if (!(dataTable instanceof u.DataTable)) {
        ip.ipInfoJump("dataTable参数不正确!", "error");
        return;
    }
    options = options || {};
    options.type = options.type === "select" ? options.type : "all";
    options.fieldMap = (options.fieldMap instanceof Array ? options.fieldMap : []);
    fileName = fileName || "导出文件" + getCurrentDate() + ".xlsx";
    if (fileName.slice(-5).toLowerCase() != '.xlsx') {
        fileName = fileName + ".xlsx";
    }

    var sheet = dtData2Sheet(dataTable, options);
    if (options && typeof options.onBeforeSave == "function") {
        sheet = options.onBeforeSave(sheet) || sheet;
    }
    saveExcelFile(sheet, fileName);
}
//以下载文件的方式保存导出的Excel文件
function saveExcelFile(sheet, fileName) {
    var wb = {
        SheetNames: ['Sheet1'],
        Sheets: {
            'Sheet1': sheet
        }
    };
    var wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'};
    var wbout = XLSX.write(wb, wopts);
    saveAs(new Blob([s2ab(wbout)], {type: ""}), fileName);
}
//将dataTable中数据转为Sheet数据格式
function dtData2Sheet(dataTable, options) {
    var rows = (options.type === "select" ? dataTable.getSelectedRows() : dataTable.getAllRows());
    var sheet = {};
    var fields = options.fieldMap;
    var colWidth = [];
    for (var h = 0; h < fields.length; h++) {
        if (fields[h] && fields[h].fieldName) {
            sheet[index2ColName(h + 1) + "1"] = {"v": (fields[h].title ? fields[h].title : fields[h].fieldName)};
        }
        colWidth.push({
            wpx: fields[h].field_width || 100
        });
    }
    for (var r = 0; r < rows.length; r++) {
        for (var c = 0; c < fields.length; c++) {
            if (fields[c] && fields[c].fieldName) {
                var v = rows[r].getValue(fields[c].fieldName);
                if (v) {
                    if(fields[c].type == "decimal"){
                        sheet[index2ColName(c + 1) + (r + 2)] = {"v": v,"t": "n", "z": "#,##0.00"};
                    }else{
                        sheet[index2ColName(c + 1) + (r + 2)] = {"v": v};
                    }
                }
            }
        }
    }
    sheet["!ref"] = "A1:" + index2ColName(Math.max(fields.length, 1)) + (r + 1);
    sheet["!cols"] = colWidth;
    return sheet;
}
//String转换为ArrayBuffer
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i < s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}
//index转为列名，如：28 转为 AB
function index2ColName(index) {
    var colName = "";
    var j = 0;
    for (var i = digit.length - 1; i >= 0; i--) {
        j = Math.floor(index / digit[i]);
        if (j > 0) {
            colName += capital[j - 1];
            index = index % digit[i];
        } else {
            if (colName.length > 0) {
                colName += "0"
            }
        }
    }
    colName = colName.split("");
    for (var x = colName.length - 1; x >= 0; x--) {
        if (colName[x] == "0") {
            if (colName.join("").substring(0, x).replace(/0/g, "") != "") { //向高位借位处理0
                colName[x] = "Z";
                colName[x - 1] = capital_zero[capital_zero.indexOf(colName[x - 1]) - 1];
            } else {
                break;
            }
        } else if (colName[x] == "-") {  //向高位借位，还低位的借位
            colName[x] = "Y";
            colName[x - 1] = capital_zero[capital_zero.indexOf(colName[x - 1]) - 1];
        }
    }
    return colName.join("").replace(/0/g, "");
}
function getCurrentDate() {
    var d = new Date();
    return "" + d.getFullYear() +
        (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1) +
        (d.getDate() < 10 ? "0" : "") + d.getDate() +
        (d.getHours() < 10 ? "0" : "") + d.getHours() +
        (d.getMinutes() < 10 ? "0" : "") + d.getMinutes() +
        (d.getSeconds() < 10 ? "0" : "") + d.getSeconds();
}


/**
 * 点击标签外部关闭当前标签
 * @param type 选择器类型：id/ class
 */
function closeLabelOnDocumentClick(type, selector1, selector2) {
	var _selector1 = type == "id" ? document.getElementById(selector1) : (type == "class" ? document.getElementsByClassName(selector1):null);
	_selector1.onclick = function(e) {
		stopBubble(e);
		document.onclick = function() {
			var _selector2 = document.getElementById(selector2);
			_selector2.style.display = "none";
			document.onclick = null;
		}
	}
}
/**
 * 阻止事件冒泡
 */
function stopBubble(e) {
	if (e && e.stopPropagation) {
		e.stopPropagation(); //w3c
	} else {
		window.event.cancelBubble = true; //IE
	}
}

/**
 * 判断元素是否在数组中
 */
function isValueInArray(arr, obj) {
	var i = arr.length;  
    while (i--) {  
        if (arr[i] === obj) {  
            return true;  
        }  
    }  
    return false; 
}
