define(['text!pages/pay/payVoucherBillQuery/payVoucherBillQuery.html','commonUtil',
    'jquery','es5sham','html5','calendar','uui','tree',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,commonUtil){
	var init =function(element,param){ 
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
			tokenid : ip.getTokenId(),
		};

		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["condition"]="vt_code in ('5201') ";
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
		};
	

		$(element).html(html);	
		viewModel.initData();
	};
	return {
		'template':html,
		init:init
	};
});
