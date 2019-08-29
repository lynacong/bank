//日报生成
define(['text!pages/agent/PACreatePayDaily/PACreatePayDaily.html','commonUtil',
     	'jquery','calendar',
    	'bootstrap','ip','ebankConstants','datatables.net-bs', 
        'datatables.net-select',
        'initDataTableUtil' ],function(html,commonUtil) {
		var init = function(element,param){ 	
			document.title=ip.getUrlParameter("menuname"); 
			var viewModel = {
				tokenid : ip.getTokenId(),
			};
			var mainOptions = ip.getCommonOptions({});
			mainOptions["isDetailQuery"] = "false";  //是否查询明细
			mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
			mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			mainOptions["isWorkFlowRelated"] = "true";
			mainOptions["relationBillId"] = "voucher_bill_id";
			var mainDailyOptions = ip.getCommonOptions({});
			mainDailyOptions["isDetailQuery"] = "false";  //是否查询明细
			mainDailyOptions["queryTable"] = EBankConstant.PayTables.EBANK_DAY_BILL;
			mainDailyOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			mainDailyOptions["isWorkFlowRelated"] = "true";
			mainDailyOptions["relationBillId"] = "day_bill_id";
			var voucherOptions = ip.getCommonOptions({});
			voucherOptions["isDetailQuery"] = "true";  //是否查询明细
			voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["isWorkFlowRelated"] = "false";
				
			//查询
			queryHandler = function(){
				commonUtil.doubleMainListener($("#statusArea").val());
			}
					
			//画html
			$(element).html(html);	
			//初始化页面
			commonUtil.initDoubleMainListPage("buttonArea", "searchArea", "statusArea", "mainGridArea", "detailContainer",
					mainOptions,mainDailyOptions,voucherOptions,false);
		};
		
		return {
		    init:init
		};
	});
