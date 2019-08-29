define(['text!pages/pay/paRefundmentNoticeRegister/paRefundmentNoticeRegister.html','commonUtil',
    'jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil' ],function(html,commonUtil){
	var init =function(element,param){
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
				tokenid : ip.getTokenId()
			};
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["isDetailQuery"] = "false";  //是否查询明细
		mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
		mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		mainOptions["isWorkFlowRelated"] = "true";
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
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions);
			viewModel["viewList"] = pageData.viewList;
		};
		
			pageInit =function(){
				viewModel.initData();	
			}

			$(element).html(html);	
			pageInit();
		};
		
		return {
	        init:init
	    };
	});	