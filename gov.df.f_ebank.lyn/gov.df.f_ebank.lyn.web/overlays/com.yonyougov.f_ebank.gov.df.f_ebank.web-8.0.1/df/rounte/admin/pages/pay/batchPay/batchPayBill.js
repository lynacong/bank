define(['text!pages/pay/batchPay/batchPayBill.html','commonUtil',
     	'jquery','calendar','bootstrap','ip','ebankConstants',
     	'datatables.net-bs','datatables.net-select',
     	'initDataTableUtil' ],function(html,commonUtil) {
		var init =function(element,param){ 	
			document.title=ip.getUrlParameter("menuname"); 
			var requesting=false;
			var viewModel = {
				tokenid : ip.getTokenId()
			};
			var baseURL=EBankConstant.Ctx + "pay/batchPay";
			var mainOptions = ip.getCommonOptions({});
			mainOptions["isDetailQuery"] = "true";  //是否查询明细       
			mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
			mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			mainOptions["isWorkFlowRelated"] = "true";
			mainOptions["relationBillId"] = "voucher_bill_id";
			
			//初始化页面
			viewModel.initData = function() {
				var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea",null,
						mainOptions,null,false,baseURL+"/loadBatchPayDetailData.do");
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