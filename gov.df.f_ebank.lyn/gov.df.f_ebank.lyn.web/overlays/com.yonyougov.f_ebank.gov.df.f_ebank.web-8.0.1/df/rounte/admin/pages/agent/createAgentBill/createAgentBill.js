define(['text!pages/agent/createAgentBill/createAgentBill.html','commonUtil',
     	'jquery', 'calendar','bootstrap','ip','ebankConstants','datatables.net-bs', 
        'datatables.net-select',
        'initDataTableUtil' ],
		function(html,commonUtil) {
		var init =function(element,param){ 	
			document.title=ip.getUrlParameter("menuname"); 
			var requesting=false;
			var viewModel = {
				tokenid : ip.getTokenId()
			};
			var mainOptions = ip.getCommonOptions({});
			mainOptions["isDetailQuery"] = "false";  //是否查询明细
			mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
			mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			mainOptions["isWorkFlowRelated"] = "true";
			mainOptions["relationBillId"] = "voucher_bill_id";
			
			var mainDoneOptions = ip.getCommonOptions({});
			mainDoneOptions["isDetailQuery"] = "false";  //是否查询明细
			mainDoneOptions["queryTable"] = EBankConstant.PayTables.EBANK_AGENT_BILL;
			mainDoneOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			mainDoneOptions["isWorkFlowRelated"] = "true";
			mainDoneOptions["relationBillId"] = "agent_bill_id";
			
			var voucherOptions=ip.getCommonOptions({});
			voucherOptions["isDetailQuery"] = "true";  //是否查询明细
			voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["isWorkFlowRelated"] = "false";
			voucherOptions["relationBillId"] = "voucher_bill_id";
	
			//查询
			queryHandler = function(){
				commonUtil.doubleMainListener($("#statusArea").val());
			}
					
			//画html
			$(element).html(html);	
			//初始化页面
			commonUtil.initDoubleMainListPage("buttonArea", "searchArea", "statusArea", "mainGridArea", "detailContainer",
					mainOptions,mainDoneOptions,voucherOptions,false);
		};
		return {
		    init:init
		};
	});