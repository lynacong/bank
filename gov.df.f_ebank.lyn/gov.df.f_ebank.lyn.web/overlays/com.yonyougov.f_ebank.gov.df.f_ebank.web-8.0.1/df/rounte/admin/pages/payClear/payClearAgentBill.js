define(['text!pages/payClear/payClearAgentBill.html','commonUtil',
    'jquery','es5sham','html5','calendar','uui','tree',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select',
    'initDataTableUtil'],function(html,commonUtil){
	var init =function(element,param){
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
				tokenid : ip.getTokenId(),
			};
			
		var requesting=false;
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
			
		//初始化页面
		viewModel.initData = function() {
			var pageData= commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					      mainOptions,voucherOptions,false,EBankConstant.Ctx+"pay/payClear/loadPayClearBillData.do",
						  EBankConstant.Ctx+"pay/payClear/loadPayClearDetailData.do");		
		};
			
		//退回
		callBackBill = function(){
			if(requesting)
				return;
			requesting=true;
			var billNosAndFinanceCode =  commonUtil.getOperaParam("mainGridArea",false,false,false);
			if(billNosAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择数据！！！",0,0,true);
				requesting=false;
				return false;
			}
			var optionsParam = ip.getCommonOptions({});
			optionsParam["setYear"]=optionsParam["svSetYear"];
			optionsParam["vtCode"]=ip.getUrlParameter("vt_code");
			optionsParam["isBH"]=ip.getUrlParameter("isBH");
			optionsParam["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
			optionsParam["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.Ctx + "pay/payClear/doCallBackAgentBill.do?tokenid="
				+ viewModel.tokenid,
				type : "POST",
				data : optionsParam,
				success : function(data){
					ip.processInfo("正在处理中，请稍候......", false);
					requesting=false;
					if(data.flag=="0"){
						queryHandler();
						ip.warnJumpMsg(data.result, 0, 0, true);
					}else{
						queryHandler();
						ip.warnJumpMsg("退回成功！", 0, 0, true);
					}
				}
			});
			
		};
			
		//确认
		createClearBill=function(){
			if(requesting)
				return;
			requesting=true;
			var billIdsAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,false,false);
			if(billIdsAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择生成数据",0,0,true);
				requesting=false;
				return;
			}
			var optionsParam = ip.getCommonOptions({});
			optionsParam["setYear"]=optionsParam["svSetYear"];
			optionsParam["vtCode"]=ip.getUrlParameter("vt_code");
			optionsParam["billnosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
			optionsParam["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.Ctx + "pay/payClear/doConfirmAgentBill.do",
				type : "POST",
				data :optionsParam,
				success : function(data) {
						ip.processInfo("正在处理中，请稍候......", false);
						ip.warnJumpMsg(data.result,0,0,true);	
						queryHandler();
						requesting=false;
				}
			});
		};

		$(element).html(html);	
		viewModel.initData();
	};
	return {
		'template':html,
        init:init
    };
});