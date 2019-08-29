/**
 * grid
 */
var dfpGrid = {};

/**
 * 生成html
 */
dfpGrid.html = {
	
};

/**
 * 默认数据
 */
dfpGrid.options = {
	/**
	 * 请求参数
	 */
	params : {
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
		"sm_name": "",
		"billtype":"366",
		"busbilltype":"311",
		"pageInfo":"99999,0",
		"ajax": "noCache",
		"condition": " and paytype_code like '12%' "
	},
	/**
	 * 表头
	 */
	budgetTableColTitle : {
		"sum_id": "sum_id",
		"fromctrlid": "fromctrlid",
		"zfcgbs_code": "zfcgbs_code",
		"file_name": "指标文号",
		"is_zfcg": "政府采购",
		"agencyexp_name": "项目分类",
		"bis_name": "预算项目",
		"avi_money": "指标金额",
		"canuse_money": "指标余额",
		"canuse_money_ori": "指标余额(yuan)",
		"zcjd" : "支出进度",
		"expeco_name": "经济分类",	
		"expfunc_name": "功能分类",
		"fundtype_name": "资金性质",
		"bgtsource_name": "指标来源",
		"agency_name": "预算单位",
		"mb_name": "业务处室",
		"sm_name": "指标摘要"
	}
};

/**
 * 创建表头并创建应用
 * @params o 对象，{id:'', url:'', tableColTitle:{}}
 */
dfpGrid.init = function(o) {
	var viewModel = {
		dataTable: new u.DataTable({
			// 表头
			meta : o['tableColTitle'] || dfpGrid.options.budgetTableColTitle
		}, this),
	};
	var app = u.createApp({
		el: "#" + o['id'],
		model: viewModel
	});
	dfpGrid.data.normal(o['url'], viewModel);
	return {
		viewModel : viewModel,
		app : app
	};
};

/**
 * 请求
 */
dfpGrid.data = {
	normal : function(url, viewModel) {
		$.ajax({
			url: url,
			type: "GET",
			dataType: "json",
			async: false,
			data: dfp.commonData(dfpGrid.options.params),
			success: function(data){
				viewModel.dataTable.removeAllRows();
				viewModel.dataTable.setSimpleData(data.dataDetail, {
					unSelect: true
				});
			}
		});
	}
	
};

