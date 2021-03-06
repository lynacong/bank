define(['text!pages/agent/registerAgentBill/registerAgentBill.html',
	'commonUtil','jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select',
    'initDataTableUtil' ],function(html,commonUtil){
	var init =function(element,param){
		//页面标题
	document.title=ip.getUrlParameter("menuname");
	var viewModel = {
		tokenid : ip.getTokenId(),
	};
	var queryURL = EBankConstant.CommonUrl.query;
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

	//初始化页面
	viewModel.initData = function() {
		var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
				mainOptions,voucherOptions,false);
		viewModel["viewList"] = pageData.viewList;
	};
	
	//构建传到后台的billIds
	buildBillIdsAndFinanceCode = function(id){
		var billIdsAndFinanceCode = new Array();
		var selectRows = $('#modalMainGridArea').DataTable().rows('.selected');
		for (var i = 0; i < selectRows.indexes().length; i++) {
			var temp = {};
			temp["id"] = selectRows.data()[i].id;
			temp["bill_no"] = selectRows.data()[i].bill_no;
			temp["finance_code"] = selectRows.data()[i].finance_code;
			billIdsAndFinanceCode.push(temp);
		}
		return billIdsAndFinanceCode;
	};
	
	
	//登记
	registerBill=function(){
		if(requesting){
			return;
		}
		requesting=true;
		var billIdsAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,false,false,false);
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
			url : EBankConstant.CommonUrl.doRegisterAgentBill+"?tokenid="
			+ viewModel.tokenid,
			type : "POST",
			data :postData,
			success : function(data) {
				ip.processInfo("正在处理中，请稍候......", false);
				if(data.flag=='1'){
					ip.warnJumpMsg("登记成功！",0,0,true);	
				}else{
					ip.warnJumpMsg("登记失败，"+data.result,0,0,true);	
				}
				queryHandler();
				requesting=false;
			}
		});
	};
	//撤销登记
	cancelRegisterBill=function(){
		if(requesting){
			return;
		}
		requesting=true;
		var billIdsAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,false,false,false);
		if(billIdsAndFinanceCode.length==0){
			ip.warnJumpMsg("请选择数据！",0,0,true);
			requesting=false;
			return;
		}
		var postData = ip.getCommonOptions({});
		postData["vt_code"]=ip.getUrlParameter("vt_code");
		postData["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
		postData["ajax"]="nocache";
		$.ajax({
			url : EBankConstant.CommonUrl.doCancelRegisterAgentBill+"?tokenid="
			+ viewModel.tokenid,
			type : "POST",
			data :postData,
			success : function(data) {
				if(data.flag=='1'){
					ip.warnJumpMsg("撤销登记成功！",0,0,true);	
				}else{
					ip.warnJumpMsg("撤销登记失败，"+data.result,0,0,true);	
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
