define(['text!pages/payClear/payClearAgentBillSign.html','commonUtil',
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
		callBackAgentBill = function() {
			if(requesting){
				return;
			}
			requesting=true; 
			var billNosAndFinanceCode =  commonUtil.getOperaParam("mainGridArea",false,false,false);
			if(billNosAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择数据！！！",0,0,true);
				requesting=false;  
				return false;
			}
			
			var optionsParam = ip.getCommonOptions({});
			optionsParam["set_year"]=optionsParam["svSetYear"];
			optionsParam["vt_code"]=ip.getUrlParameter("vt_code");;
			optionsParam["billIdsAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
			optionsParam["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : "/df/f_ebank/agent/doBackAgentBill.do?tokenid="+ viewModel.tokenid,
				type : "POST",
				data : optionsParam,
				success : function(data){
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.flag=="0"){
						queryHandler();
						ip.warnJumpMsg(data.result, 0, 0, true);
						requesting=false; 
					}else{
						queryHandler();
						ip.warnJumpMsg("退回成功", 0, 0, true);
						requesting=false;  

					}
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