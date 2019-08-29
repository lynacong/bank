define(['text!pages/agent/directPayRefundRecordStampSend/directPayRefundRecordStampSend.html',
	'commonUtil','jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select',
    'initDataTableUtil'  ],
		function(html,commonUtil) {
	    var init =function(element,param){ 	
	    //页面标题
		document.title=ip.getUrlParameter("menuname"); 
		var viewModel = {
				tokenid : ip.getTokenId()
			};
		
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["isDetailQuery"] = "false";  //是否查询明细
		mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_ACC_BILL;
		mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		mainOptions["isWorkFlowRelated"] = "true";
		mainOptions["relationBillId"] = "acc_bill_id";
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
		voucherOptions["isDetailQuery"] = "true";  //是否查询明细
		voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		voucherOptions["isWorkFlowRelated"] = "false";
		voucherOptions["relationBillId"] = "acc_bill_id";
			
		var requesting=false;
		var vtCode=ip.getUrlParameter("vt_code");
		
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false);
			viewModel["viewList"] = pageData.viewList;
		};
		
		pageInit =function(){
			viewModel.initData();	
		};
		
		$(element).html(html);	
		pageInit();
	};
	
	return {
	    init:init
	};
});
