define(['text!pages/pay/billQueryNoWf/billQueryNoWf.html','commonUtil',
    'jquery','knockout','es5sham','html5','calendar','uui','tree',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,commonUtil){
	var init =function(element,param){ 
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
			tokenid : ip.getTokenId(),
		};
		var vtCode=ip.getUrlParameter("vt_code");
		
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["condition"]="vt_code='"+vtCode+"' ";
		mainOptions["isDetailQuery"] = "false";  //是否查询明细
		mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
		mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		mainOptions["isWorkFlowRelated"] = "false";
		mainOptions["relationBillId"] = "voucher_bill_id";
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
		voucherOptions["isDetailQuery"] = "true";  //是否查询明细
		voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		voucherOptions["isWorkFlowRelated"] = "false";
		voucherOptions["relationBillId"] = "voucher_bill_id";
		
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","","mainGridArea","detailContainer",
							mainOptions,voucherOptions,true,"","",false);
			viewModel["viewList"] = pageData.viewList;
			for ( var n = 0; n < viewModel.viewList.length; n++) {
				var view = viewModel.viewList[n];
				if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){		
					if (view.orders == '1') {
						viewModel.payQueryViewId = view.viewid;
					} 
				}
			}
		};
	
		//查询
		queryHandler=function(){
			viewModel.getQueryView();
			$("#mainGridArea").DataTable().ajax.reload(null,true);
		};
		
		viewModel.getQueryView = function() {
			mainOptions["condition"] = " vt_code = '"+vtCode+"' ";
			var searchCondition = ip.getAreaData(viewModel.payQueryViewId);
			var queryFlag = searchCondition.conditionFlag;
			if(queryFlag){
				mainOptions["condition"] = mainOptions["condition"] + searchCondition.condition;
			}
		};
		$(element).html(html);	
		viewModel.initData();
	};	
	return {
        init:init
    };
});