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
}
changeColorZhibiao = function (obj) {
	var html = '';
	if(!(obj.value==null||obj.value==""||obj.value==undefined))
		html = '<div style="text-align:right;font-size:14px;line-height:30px;font-family:微软雅黑;">' + ip.dealThousands(obj.value) + '</div>';
	obj.element.innerHTML = html;
}

changeColorZCJD = function (obj) {
	var html = '';
	if(!(obj.value==null||obj.value==""||obj.value==undefined))
		html = '<div style="text-align:right;font-size:14px;line-height:30px;font-family:微软雅黑;">' + obj.value + '</div>';
	obj.element.innerHTML = html;
}

changeColorKeyong = function (obj) { // 原 #f56a00， 蓝 0000ff 
	var html = '';
	if(!(obj.value==null||obj.value==""||obj.value==undefined))
		html = '<div style="text-align:right;color:#0000ff;font-size:14px;line-height:30px;font-family:微软雅黑;">' + ip.dealThousands(obj.value) + '</div>';
	obj.element.innerHTML = html;
}

changeColorXSJDC = function (obj) { // 原 #f56a00， 蓝 0000ff 
	var html = '';
	if(!(obj.value==null||obj.value==""||obj.value==undefined))
		html = '<div style="text-align:center;color:#0000ff;font-size:14px;line-height:30px;font-family:微软雅黑;">' + obj.value + '</div>';
	obj.element.innerHTML = html;
}

tableSum = function (obj) {
	var fontColor = {
		"avi_money":"#000000",
		"canuse_money":"#000000"
	}
	var colName = obj.gridCompColumn.options.field;
	var html = '<div style="text-align:right;color:'+fontColor[colName]+';font-size:14px;line-height:30px;font-family:微软雅黑;">' + ip.dealThousands(obj.value) + '</div>';
	obj.element.innerHTML = html;
}
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
	//ptd_budget.tabledbClick(obj);
}

// 预算指标请求参数
var all_options_condition = " and paytype_code like '12%' ";
var all_options = {
	"tokenid": getTokenId(),
	"file_name": "",
	"agencyexp_name": "",
	"bis_name": "",
	"avi_money": "",
	"canuse_money": "",
	"expfunc_name": "",
	"expeco_name": "",
	"fundtype_name": "",
	"bgtsource_name": "",
	"agency_name": "",
	"mb_name": "",
	"budget_summary": "",
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
	"file_name": "指标文号",
	"agencyexp_name": "项目分类",
	"bis_name": "预算项目",
	"avi_money": "指标金额",
	"canuse_money": "指标余额",
	"expfunc_name": "功能分类",
	"expeco_name": "经济分类",
	"fundtype_name": "资金性质",
	"bgtsource_name": "指标来源",
	"agency_name": "预算单位",
	"mb_name": "业务处室",
	"budget_summary": "指标摘要"
};
var viewModel = {
	dataTable: new u.DataTable({
		// 表头
		meta: budgetTableColTitle
	}, this),
};
if($('#tableContent')[0]){
	ko.cleanNode($('#tableContent')[0]);
}
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
var budgetTableRadioWan = 0;
// 预算指标高级查询启动标志，启动为1，未启动为0
var budgetTableGaojiStart = 0;

/**
 * page key
 */
var ptd_obj = {
	budget: {
		rightUrl : [
			"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=AN",
			// 新 普通转账
			"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PT",
			// 新 代扣代缴
			"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=DK",
			// 新 柜台缴税
			"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GT",
			// 新 批量支付
			"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=PLZF",
			// 新 公务卡
			"/df/sd/pay/centerpay/input/payCommonInput.html?billtype=366&busbilltype=322&model=model5&menuid=9588FA171826EE5F56C82AEF1C474E01&menuname=%u65B0%u5F55%u5165%u754C%u9762&type=GWK",
			// 政府采购
			"/df/sd/pay/centerpay/input/paAccreditBillInputZFCG.html?billtype=366&busbilltype=322&menuid=C9028BFD7E0826FD3FBC3EFC213D83A1&menuname=%u653F%u5E9C%u91C7%u8D2D",
			// 预算执行情况
			"/df/sd/pay/commonModal/traceBalanceList/balanceForPortal.html",
			// 导出Excel
			""
		]
	}
};

/**
 * budget
 */
// 预算指标选中的行的序号
var gridSelectObj; // 选中行对象
var focus_row_index; // 选中行序号
var focus_row_sum_id; // 选中行原始数据sum_id
var focus_row_fromctrlid; // 选中行原始数据fromctrlid
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
		// 预算指标 高级查询-更多
		$("._portal_table_gaoji_zbwh_span").on("click", function(){
			$("#_portal_yusuan_gaoji_type_input").val("");
			$("#_portal_table_input").val("");
			$("#zhibiaotree").html("");
			$("#_portal_yusuan_gaoji_type_input").val("zbwh");
			ptd_budget.tree(this.id, $(this).parent().text(), "zbwh");	// 指标文号
			$(".content_wrap").css({"display":"block"});
		});
		$("#budgetTableSelectClear_zbwh").on("click", function(){
			$("#_portal_yusuan_table_gaoji_zbwh_input").val("");
			$("#_portal_yusuan_table_gaoji_zbwh_input_chrid").val("");
		});
		$("._portal_table_gaoji_xmfl_span").on("click", function(){
			$("#_portal_yusuan_gaoji_type_input").val("");
			$("#_portal_table_input").val("");
			$("#zhibiaotree").html("");
			$("#_portal_yusuan_gaoji_type_input").val("xmfl");
			ptd_budget.tree(this.id, $(this).parent().text(), "xmfl");	// 项目分类
			$(".content_wrap").css({"display":"block"});
		});
		$("#budgetTableSelectClear_xmfl").on("click", function(){
			$("#_portal_yusuan_table_gaoji_xmfl_input").val("");
			$("#_portal_yusuan_table_gaoji_xmfl_input_chrid").val("");
		});
		$("._portal_table_gaoji_ysxm_span").on("click", function(){
			$("#_portal_yusuan_gaoji_type_input").val("");
			$("#_portal_table_input").val("");
			$("#zhibiaotree").html("");
			$("#_portal_yusuan_gaoji_type_input").val("ysxm");
			ptd_budget.tree(this.id, $(this).parent().text(), "ysxm");	// 预算项目
			$(".content_wrap").css({"display":"block"});
		});
		$("#budgetTableSelectClear_ysxm").on("click", function(){
			$("#_portal_yusuan_table_gaoji_ysxm_input").val("");
			$("#_portal_yusuan_table_gaoji_ysxm_input_chrid").val("");
		});
		$("._portal_table_gaoji_ysdw_span").on("click", function(){
			$("#_portal_yusuan_gaoji_type_input").val("");
			$("#_portal_table_input").val("");
			$("#zhibiaotree").html("");
			$("#_portal_yusuan_gaoji_type_input").val("ysdw");
			ptd_budget.tree(this.id, $(this).parent().text(), "ysdw");	// 预算单位
			$(".content_wrap").css({"display":"block"});
		});
		$("#budgetTableSelectClear_ysdw").on("click", function(){
			$("#_portal_yusuan_table_gaoji_ysdw_input").val("");
			$("#_portal_yusuan_table_gaoji_ysdw_input_chrid").val("");
		});
		$("._portal_table_gaoji_zffs_span").on("click", function(){
			$("#_portal_yusuan_gaoji_type_input").val("");
			$("#_portal_table_input").val("");
			$("#zhibiaotree").html("");
			$("#_portal_yusuan_gaoji_type_input").val("zffs");
			ptd_budget.tree(this.id, $(this).parent().text(), "zffs");	// 支付方式
			$(".content_wrap").css({"display":"block"});
		});
		$("#budgetTableSelectClear_zffs").on("click", function(){
			$("#_portal_yusuan_table_gaoji_zffs_input").val("");
			$("#_portal_yusuan_table_gaoji_zffs_input_chrid").val("");
		});
		// 预算指标 高级查询 确定按钮
		$("#_portal_table_gaoji_submit_input").on("click", function(){
			var treeNode = "zhibiaotree";
			var treeObj = $.fn.zTree.getZTreeObj(treeNode);  
			var selectedNode = treeObj.getSelectedNodes()[0];  
			$("#_portal_table_input").val(selectedNode.name);  
			$("#_portal_table_input_chrid").val(selectedNode.id);
			
			var type = $("#_portal_yusuan_gaoji_type_input").val();
			var type2Class = {
				"zbwh":"_portal_yusuan_table_gaoji_zbwh_input",
				"xmfl":"_portal_yusuan_table_gaoji_xmfl_input",
				"ysxm":"_portal_yusuan_table_gaoji_ysxm_input",
				"ysdw":"_portal_yusuan_table_gaoji_ysdw_input",
				"zffs":"_portal_yusuan_table_gaoji_zffs_input"
			};
			$("#"+type2Class[type]).val($("#_portal_table_input").val());
			$("#"+type2Class[type]+"_chrid").val($("#_portal_table_input_chrid").val());
			$(".content_wrap").css({"display":"none"});
		});
		// 预算指标 高级查询 关闭按钮
		$("#_portal_table_gaoji_close_input").click(function(){
			$("#_portal_table_input").val("");
			$(".content_wrap").css({"display":"none"});
		});
		$("#close-div").click(function(){
			$(".content_wrap").css({"display":"none"});
		});
		// 预算指标 高级查询 外层提交按钮
		$("#sure").on("click", function(){
			var file_name = $("#_portal_yusuan_table_gaoji_zbwh_input").val();
			var agencyexp_name = $("#_portal_yusuan_table_gaoji_xmfl_input").val();
			var bis_name = $("#_portal_yusuan_table_gaoji_ysxm_input").val();
			var agency_name = $("#_portal_yusuan_table_gaoji_ysdw_input").val();
			var paytype_name = $("#_portal_yusuan_table_gaoji_zffs_input").val();
			var file_name_chrid = $("#_portal_yusuan_table_gaoji_zbwh_input_chrid").val();
			var agencyexp_name_chrid = $("#_portal_yusuan_table_gaoji_xmfl_input_chrid").val();
			var bis_name_chrid = $("#_portal_yusuan_table_gaoji_ysxm_input_chrid").val();
			var agency_name_chrid = $("#_portal_yusuan_table_gaoji_ysdw_input_chrid").val();
			var paytype_name_chrid = $("#_portal_yusuan_table_gaoji_zffs_input_chrid").val();
			
			// 条件拼接
			var condition = all_options_condition;
			if(!isObjNull(file_name)){
				condition += " and file_id= '" + file_name_chrid + "' ";
			}
			if(!isObjNull(agencyexp_name)){
				condition += " and agencyexp_id= '" + agencyexp_name_chrid + "' ";
			}
			if(!isObjNull(bis_name)){
				condition += " and bis_id= '" + bis_name_chrid + "' ";
			}
			if(!isObjNull(agency_name)){
				condition += " and c.agency_id= '" + agency_name_chrid + "' ";
			}
			if(!isObjNull(paytype_name)){
				condition += " and paytype_id= '" + paytype_name_chrid + "' ";
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
			var e = e || window.event;
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
				focus_row_fromctrlid = $(cur).find("td")[1].innerText;
			}else if(browser == "Chrome" || brower != ""){ // TODO 暂时只考虑IE和谷歌
				focus_row_index = $('#gridShow_content_tbody > tr').index(eventTarget.closest('tr'));
				if(focus_row_index == undefined || focus_row_index < 0){
					// 取消右键点击的默认事件
					return false;
				}
				$(eventTarget.closest('tr')).addClass("u-grid-content-focus-row").addClass("u-grid-content-sel-row");
				focus_row_sum_id = ($(eventTarget.closest('tr')).find("td")[0]).innerText;
				focus_row_fromctrlid = ($(eventTarget.closest('tr')).find("td")[1]).innerText;
			}else{
				focus_row_index = -1;
			}
			if(focus_row_index == undefined || focus_row_index < 0){
				// 取消右键点击的默认事件
				return false;
			}
			
			// 自定义右键菜单显示
			$("#budgetWrapper").css("display", "block")
				.css("position", "fixed")
				.css("zIndex", "9999")
				.css("left", e.clientX+'px')
				.css("top", e.clientY-110 +'px');
			return false;
		});
		// 预算指标右键菜单点击
		$budgetWrapper.find("ul").find("li").each(function(){
			$(this).click(function(e){
				var i = $(this).data("index");
				
				//TODO wait 政府采购
				//if(i == 6){
				//	return false;
				//}
				$budgetWrapper.css("display", "none");
				// 导出Excel
				if(i == 8){
					var fields = [];
					for(var key in budgetTableColTitle){
						var str = '{' + '"fieldName"' + ':' +'"' + key + '"' + "," + '"title"' + ':' + '"' + budgetTableColTitle[key] + '"' + '}';
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
				url = fullUrlWithTokenid(ptd_obj.budget.rightUrl[i]) + "&sum_id=" + focus_row_sum_id;
				// 预算执行情况
				if(i == 7){
					title = "预算执行情况";
					url = fullUrlWithTokenid(ptd_obj.budget.rightUrl[i]) + "&sum_id=" + focus_row_fromctrlid;
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
			$("#budgetDanweiChange").html('<option value="0" selected="selected" id="budgetDanweiChangeYuan">元</option><option value="1">万元</option><option value="2">亿元</option>');
			return true;
		}else{	// 未启动高级查询，使用静态数据
			if(budgetTableYueNull == 1){ // 包含余额为零数据
				switch(budgetTableRadioWan){
					case "0":
						budgetTableDatadetail = budgetTableDatadetailOri;
						break;
					case "1":
						budgetTableDatadetail = budgetTableDatadetailWan;
						break;
					case "2":
						budgetTableDatadetail = budgetTableDatadetailYi;
						break;
					default:
						budgetTableDatadetail = budgetTableDatadetailOri;
						break;
				}
			}else{
				switch(budgetTableRadioWan){
					case "0":
						budgetTableDatadetail = budgetTableDatadetailOriNull;
						break;
					case "1":
						budgetTableDatadetail = budgetTableDatadetailWanNull;
						break;
					case "2":
						budgetTableDatadetail = budgetTableDatadetailYiNull;
						break;
					default:
						budgetTableDatadetail = budgetTableDatadetailOriNull;
						break;
				}
			}
			return false;
		}
	},
	show : function(){
		var isNeedAjax = this._ajax();
		if(isNeedAjax){
			$.ajax({
				url: "/df/pay/centerpay/input/getPlanBoundData.do",
				type: "GET",
				dataType: "json",
				async: false,
				data: ip.getCommonOptions(all_options),
				success: function(data){
					budgetTableDatadetailOri = data.dataDetail;
					// 首次加载，显示余额不为零的数据
					if(isNeedAjax){
						ptd_budget.classify();
					}
					budgetTableDatadetail = budgetTableDatadetailOriNull;
				}
			});
		}
		viewModel.dataTable.removeAllRows();
		viewModel.dataTable.setSimpleData(budgetTableDatadetail,{
			unSelect: true
		});
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
		for(var i=0; i<length; i++){
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
					"file_name": budgetTableDatadetailOri[i].file_name,
					"agencyexp_name": budgetTableDatadetailOri[i].agencyexp_name,
					"bis_name": budgetTableDatadetailOri[i].bis_name,
					"avi_money":"",
					"canuse_money":"",
					"expfunc_code": budgetTableDatadetailOri[i].expfunc_code,
					"expfunc_name": budgetTableDatadetailOri[i].expfunc_name,
					"expeco_code": budgetTableDatadetailOri[i].expeco_code,
					"expeco_name": budgetTableDatadetailOri[i].expeco_name,
					"fundtype_name": budgetTableDatadetailOri[i].fundtype_name,
					"bgtsource_name": budgetTableDatadetailOri[i].bgtsource_name,
					"agency_code": budgetTableDatadetailOri[i].agency_code,
					"agency_name": budgetTableDatadetailOri[i].agency_name,
					"mb_name": budgetTableDatadetailOri[i].mb_name,
					"budget_summary": budgetTableDatadetailOri[i].budget_summary
				};
				if(j == 0){
					obj.avi_money = (budgetTableDatadetailOri[i].avi_money/1e4).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOri[i].canuse_money/1e4).toFixed(2);
					budgetTableDatadetailWan.push(obj);
				}
				if(j == 1){
					obj.avi_money = (budgetTableDatadetailOri[i].avi_money/1e8).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOri[i].canuse_money/1e8).toFixed(2);
					budgetTableDatadetailYi.push(obj);
				}
			}
		}
		
		// 不含零
		var lenthOriNull = budgetTableDatadetailOriNull.length;
		for(var m=0; m<lenthOriNull; m++){
			for(var n=0; n<2; n++){
				var obj = {
					"file_name": budgetTableDatadetailOriNull[m].file_name,
					"agencyexp_name": budgetTableDatadetailOriNull[m].agencyexp_name,
					"bis_name": budgetTableDatadetailOriNull[m].bis_name,
					"avi_money":"",
					"canuse_money":"",
					"expfunc_code": budgetTableDatadetailOriNull[m].expfunc_code,
					"expfunc_name": budgetTableDatadetailOriNull[m].expfunc_name,
					"expeco_code": budgetTableDatadetailOriNull[m].expeco_code,
					"expeco_name": budgetTableDatadetailOriNull[m].expeco_name,
					"fundtype_name": budgetTableDatadetailOriNull[m].fundtype_name,
					"bgtsource_name": budgetTableDatadetailOriNull[m].bgtsource_name,
					"agency_code": budgetTableDatadetailOriNull[m].agency_code,
					"agency_name": budgetTableDatadetailOriNull[m].agency_name,
					"mb_name": budgetTableDatadetailOriNull[m].mb_name,
					"budget_summary": budgetTableDatadetailOriNull[m].budget_summary
				};
				if(n == 0){
					obj.avi_money = (budgetTableDatadetailOriNull[m].avi_money/1e4).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOriNull[m].canuse_money/1e4).toFixed(2);
					budgetTableDatadetailWanNull.push(obj);
				}
				if(n == 1){
					obj.avi_money = (budgetTableDatadetailOriNull[m].avi_money/1e8).toFixed(2);
					obj.canuse_money = (budgetTableDatadetailOriNull[m].canuse_money/1e8).toFixed(2);
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
		var element = elements[type];
		var all_options1 = {
			"element": element,
			"tokenid": getTokenId(),
			"ele_value": "",
			"ajax": "noCache"
		};
		$.ajax({
			url: "/df/dic/dictree.do",
			type: "GET",
			dataType: "json",
			//async: false,
			data: ip.getCommonOptions(all_options1),
			success: function(data) {
				var eleDetail = data.eleDetail;
				var setting = {
					view: {
						dblClickExpand: false,
						showLine: true,
						selectedMulti: false,
						showIcon: false
					},
					data: {
						simpleData: {
							enable:true,
							idKey: "id",
							pIdKey: "pId",
							rootPId: ""
						}
					},
					callback: {  
						onDblClick: function(event, treeId, treeNode){
							$("#_portal_table_gaoji_submit_input").click();
						}
					}
				};
				var zNodes = [];
				for(var i in eleDetail){
					if(!eleDetail.hasOwnProperty(i)){
						continue;
					}
					zNodes.push({id:eleDetail[i].chr_id, pId:eleDetail[i].parent_id, name:eleDetail[i].codename});
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
			"sum_id": rowValue.sum_id
		};
		
		var url = "/df/sd/pay/paymentinfo/paymentinfo.html?tokenid="+getTokenId();
		url += "&file_name="+all_options2.file_name;
		url += "&expfunc_name="+all_options2.expfunc_name;
		url += "&agencyexp_name="+all_options2.agencyexp_name;
		url += "&expeco_name="+all_options2.expeco_name;
		url += "&approve_date="+all_options2.approve_date;
		url += "&avi_money="+all_options2.avi_money;
		url += "&canuse_money="+all_options2.canuse_money;
		url += "&sum_id="+all_options2.sum_id;
		url += "&billtype=366";
		url += "&menuid=B357D1CA7B7E7B8B3D27562EFDDE1B6C";
		window.parent.addTabToParent("指标支付信息", url);
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
    for (var h = 0; h < fields.length; h++) {
        if (fields[h] && fields[h].fieldName) {
            sheet[index2ColName(h + 1) + "1"] = {"v": (fields[h].title ? fields[h].title : fields[h].fieldName)};
        }
    }
    for (var r = 0; r < rows.length; r++) {
        for (var c = 0; c < fields.length; c++) {
            if (fields[c] && fields[c].fieldName) {
                var v = rows[r].getValue(fields[c].fieldName);
                if (v) {
                    sheet[index2ColName(c + 1) + (r + 2)] = {"v": v};
                }
            }
        }
    }
    sheet["!ref"] = "A1:" + index2ColName(Math.max(fields.length, 1)) + (r + 1);
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