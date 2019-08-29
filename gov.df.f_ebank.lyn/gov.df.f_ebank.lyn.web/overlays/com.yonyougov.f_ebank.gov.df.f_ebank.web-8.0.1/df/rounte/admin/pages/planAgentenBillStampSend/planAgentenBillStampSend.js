define(['text!pages/planAgentenBillStampSend/planAgentenBillStampSend.html','commonUtil',
	'jquery','es5sham','html5','calendar','bootstrap','ip',
	'ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,commonUtil){
	var init =function(element,param){ 
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
			tokenid : ip.getTokenId(),
		};
		var isFlow = ip.getUrlParameter("isFlow");
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["isDetailQuery"] = "false";  //是否查询明细
		mainOptions["queryTable"] = EBankConstant.PlanTables.PLAN_AGENTEN_BILL;
		mainOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
		mainOptions["isWorkFlowRelated"] = isFlow;
		mainOptions["relationBillId"] = "agenten_bill_id";
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
		voucherOptions["isDetailQuery"] = "true";  //是否查询明细
		voucherOptions["queryTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
		voucherOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
		voucherOptions["isWorkFlowRelated"] = "false";
		voucherOptions["relationBillId"] = "agenten_bill_id";
		
		//初始化页面
		viewModel.initData = function() {
			var pageData;
			if(isFlow=="true"){
				 pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
							mainOptions,voucherOptions,false);
			}else{
				document.getElementById("statusArea").style.display = "none";
				 pageData = commonUtil.initPageData("buttonArea","searchArea","","mainGridArea","detailContainer",
							mainOptions,voucherOptions,true);
			}
			viewModel["viewList"] = pageData.viewList;
		}; 
		
		$(element).html(html);	
		viewModel.initData();
	};		
	return {
			'template':html,	 	
	        init:init
	};
});
