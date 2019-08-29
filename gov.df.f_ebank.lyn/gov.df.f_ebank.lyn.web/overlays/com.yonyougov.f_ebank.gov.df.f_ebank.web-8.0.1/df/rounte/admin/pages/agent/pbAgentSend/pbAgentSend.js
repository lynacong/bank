define(['text!pages/agent/pbAgentSend/pbAgentSend.html',
	'commonUtil','jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select',
    'initDataTableUtil' ],function(html,commonUtil){
	var init =function(element,param){ 
		//页面标题
		document.title=ip.getUrlParameter("menuname"); 
		var viewModel = {
				tokenid : ip.getTokenId()
			};
		var baseURL = EBankConstant.Ctx + "billStampSend";
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["isDetailQuery"] = "false";  //是否查询明细
		mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_AGENT_BILL;
		mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		mainOptions["isWorkFlowRelated"] = "true";
		mainOptions["relationBillId"] = "agent_bill_id";
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
		voucherOptions["isDetailQuery"] = "true";  //是否查询明细
		voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
		voucherOptions["isWorkFlowRelated"] = "false";
		voucherOptions["relationBillId"] = "agent_bill_id";
		
		var requesting=false;
		var vtCode=ip.getUrlParameter("vt_code");
		
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false);
			viewModel["viewList"] = pageData.viewList;
		};
		
		//退回
		agentBack = function() {
			if(requesting==true){
				return;
			}
			requesting=true;
			var billIdsAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,false,false,false,true);
			if(billIdsAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;
				return;
			}
			var postData = ip.getCommonOptions({});
			postData["vt_code"]=ip.getUrlParameter("vt_code");
			postData["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
			postData["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : "/df/f_ebank/agent/doBackAgentBill.do?tokenid="+ viewModel.tokenid,
				type : "POST",
				data :postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.flag=='1'){
						ip.warnJumpMsg("退回成功！",0,0,true);	
					}else{
						ip.warnJumpMsg("退回失败，"+data.result,0,0,true);	
					}
					queryHandler();
					requesting=false;
				}
			});
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
