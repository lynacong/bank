define(['text!pages/pay/payRefundBillConfirm/payRefundBillConfirm.html', 
	'commonUtil','jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,commonUtil){
	var init =function(element,param){ 
		//页面标题
		document.title=ip.getUrlParameter("menuname"); 
		var viewModel = {
				tokenid : ip.getTokenId(),
		};
		var queryURL=EBankConstant.CommonUrl.query;
		var baseURL = EBankConstant.Ctx + "pay/payCommon";
		
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
		
		var payeeMessagetemp={};
		var requesting=false;
		var moneyFormat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
		
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false);
			viewModel["viewList"] = pageData.viewList;
		};
		
		//退款
		refundVoucher=function(){
			if(requesting){
				return;
			}
			requesting=true;
			var billIdsAndFinanceCode=commonUtil.getOperaParam("mainGridArea",false,true,false,false);
			if(billIdsAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;
				return;
			}
			payeeMessagetemp = {};
			var postData = ip.getCommonOptions({});
			postData["btype"]=ip.getUrlParameter("btype");
			postData["vt_code"]=ip.getUrlParameter("vt_code");
			postData["dc"]="-1";
			postData["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
			postData["ajax"]="nocache";
			postData["payeeMessage"]=JSON.stringify(payeeMessagetemp);
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : baseURL+"/doCancelAdvance.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				data :postData,
				success : function(data) {
						ip.processInfo("正在处理中，请稍候......", false);
					    queryHandler();
						ip.warnJumpMsg(data.result,0,0,true);
						requesting=false;
				}
			});
		};
		
		//撤销退款
		cancelRefund=function(){
			if(requesting){
				return;
			}
			requesting=true;

			var billIdsAndFinanceCode=commonUtil.getOperaParam("mainGridArea",false,true,false,false);
			if(billIdsAndFinanceCode.length!=1){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;
				return;
			} 
			var postData = ip.getCommonOptions({});
			postData["btype"]=ip.getUrlParameter("btype");
			postData["dc"]="1";
			postData["vt_code"]=ip.getUrlParameter("vt_code");
			postData["isRet"]="0";
			postData["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
			postData["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : baseURL+"/doCancelRefund.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				data :postData,
				success : function(data) {
						ip.processInfo("正在处理中，请稍候......", false);
						queryHandler();
						ip.warnJumpMsg(data.result,0,0,true);
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
