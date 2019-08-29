define(['text!pages/planagentenbillcreate/planagentenbillcreate.html','commonUtil',
	'jquery','bootstrap','ip','ebankConstants','datatables.net-bs', 
   'datatables.net-select','initDataTableUtil'],function(html,commonUtil){
	var init = function(element,param){ 
			document.title=ip.getUrlParameter("menuname"); 
			var requesting=false;
			var viewModel = {
				tokenid : ip.getTokenId()
			};
			var mainOptions = ip.getCommonOptions({});
			mainOptions["isDetailQuery"] = "false";  //是否查询明细       
			mainOptions["queryTable"] = EBankConstant.PlanTables.PLAN_AGENTEN_BILL;
			mainOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
			mainOptions["isWorkFlowRelated"] = "true";
			mainOptions["relationBillId"] = "agenten_bill_id";
			var voucherOptions=ip.getCommonOptions({});
			voucherOptions["isDetailQuery"] = "true";  //是否查询明细
			voucherOptions["queryTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
			voucherOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
			voucherOptions["isWorkFlowRelated"] = "true";
			voucherOptions["relationBillId"] = "agenten_bill_id";
			initData = function(){
				commonUtil.initDetailGridPage("buttonArea", "searchArea", "statusArea", "mainGridArea", "detailContainer",
						mainOptions, voucherOptions,false,"","");
			}
			queryHandler = function(){
				commonUtil.detailPageListener($("#statusArea").val());
			}
			$("body").on('change','#searchArea select',function() {
				commonUtil.detailPageListener($("#statusArea").val());
			});
			
			$(element).html(html);
			initData();
		}
	
		return {
		    init:init
		}
	});
