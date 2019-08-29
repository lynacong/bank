define(['text!pages/agent/directPayRecordCreate/directPayRecordCreate.html','commonUtil',
     	'jquery','calendar','bootstrap','ip','ebankConstants','datatables.net-bs', 
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
			mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_ACC_BILL;
			mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			mainOptions["isWorkFlowRelated"] = "true";
			mainOptions["relationBillId"] = "acc_bill_id";

			var voucherOptions=ip.getCommonOptions({});
			voucherOptions["isDetailQuery"] = "true";  //是否查询明细
			voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
			voucherOptions["isWorkFlowRelated"] = "true";
			voucherOptions["relationBillId"] = "acc_bill_id";
		
			queryHandler = function(){
				commonUtil.detailPageListener($("#statusArea").val());
			}
			
			$("body").on('change','#searchArea select',function() {
				commonUtil.detailPageListener($("#statusArea").val());
			});
			
			$(element).html(html);
			commonUtil.initDetailGridPage("buttonArea", "searchArea", "statusArea", "mainGridArea", "detailContainer",
					mainOptions, voucherOptions,false,"","");
				
			};
			return {
			    init:init
			};
		});
