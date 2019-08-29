define(['text!pages/pay/payBillBatchConfirm/payBillBatchConfirm.html','commonUtil',
     	'jquery','es5sham','html5','calendar',
    	'bootstrap','ip','ebankConstants','datatables.net-bs', 
        'datatables.net-select','initDataTableUtil' ],
		function(html,commonUtil) {
	var init =function(element,param){ 	
			document.title = ip.getUrlParameter("menuname"); 
			var requesting = false;			
			var viewModel = {
				tokenid : ip.getTokenId()
			};
			var mainOptions = ip.getCommonOptions({});
			mainOptions["isDetailQuery"] = "false";  //是否查询明细
			mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
			mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			mainOptions["isWorkFlowRelated"] = "true";
			mainOptions["relationBillId"] = "voucher_bill_id";
			var voucherOptions=ip.getCommonOptions({});
			voucherOptions["isDetailQuery"] = "true";  //是否查询明细
			voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["isWorkFlowRelated"] = "false";
			voucherOptions["relationBillId"] = "voucher_bill_id";
			
			//配置列表
			viewModel.initData = function() {
				var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
						mainOptions,voucherOptions,false);
				viewModel["viewList"] = pageData.viewList;
			};
			//画html
			$(element).html(html);	
			viewModel.initData();	
		};
		return {
		    init:init
		};
	});
