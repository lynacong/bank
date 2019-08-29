define(['text!pages/pay/batchPay/batchPay.html','commonUtil',
    'jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,commonUtil){
	var init =function(element,param){
		//页面标题
		document.title=ip.getUrlParameter("menuname");	
		var viewModel = {
				tokenid : ip.getTokenId(),
			};
		var baseURL=EBankConstant.Ctx + "pay/batchPay";
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		//查询明细参数
		var voucherOptions = ip.getCommonOptions({});
				
		
		var popOptions = ip.getCommonOptions({});
		popOptions.gridParam = ip.getTableSetting();
		var requesting=false;	
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false,baseURL+"/loadPayCardBillData.do",baseURL+"/loadPayCardDetailData.do");
			viewModel["viewList"] = pageData.viewList;
			for ( var n = 0; n < viewModel.viewList.length; n++) {
				var view = viewModel.viewList[n];
				if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
					 if (view.orders == '3') {
						viewModel.confirmViewId=view.viewid;
						popOptions["set_year"] = popOptions["svSetYear"];
						popOptions["scrollY"]=$("#content").innerHeight()*0.5 + "px";
						popOptions["loadDataFlag"] =false;
						confirmTable = initDataTables("modalConfirmPayArea",baseURL+"/loadPayCardConfirmData.do",popOptions,view.viewDetail);
					}
				}
			}
		};
		
		//还款支付
		rePay = function() {
			if(requesting){
				return;
			}
			requesting=true;
			var cardBills=commonUtil.getOperaParam("mainGridArea",false,false,false,false,false);
			if(cardBills.length==0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;
				return;
			}
			if(cardBills.length>1){
				ip.warnJumpMsg("请选择一条凭证！",0,0,true);
				requesting=false;
				return;
			}
			var postData = ip.getCommonOptions({});
			postData["bills"]=JSON.stringify(cardBills);
			postData["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : baseURL+"/doPayCardPay.do?tokenid="
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
			
		}
		//线下支付确认
		confPay = function() {
			if(requesting){
				return;
			}
			requesting=true;
			var cardBills=commonUtil.getOperaParam("mainGridArea",false,false,false,false,false);
			if(cardBills.length==0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;
				return;
			}
			if(cardBills.length>1){
				ip.warnJumpMsg("请选择一条凭证！",0,0,true);
				requesting=false;
				return;
			}
			popOptions["bills"]=JSON.stringify(cardBills);;
			 $("#confirmPay").modal("show");
			 popOptions["loadDataFlag"]=true;
			 confirmTable.ajax.reload(null, true);
			 requesting=false;
		}
		
		//手动退款
		doConfirmRefund = function() {
			popOptions["operationType"]=EBankConstant.OperationType.REFUND;
			popOptions["agentBusinessNo"]="0";
			doConfirm();
		};
		//手动还款
		doConfirmPay = function() {
			popOptions["operationType"]=EBankConstant.OperationType.REPAYMENT;
			popOptions["agentBusinessNo"]="0";
			doConfirm();
		};
		
		doConfirm = function() {
			if(requesting){
				return;
			}
			requesting=true;
			var confirmBills=commonUtil.getOperaParam("modalConfirmPayArea",false,false,false,false,false);
			if(confirmBills.length==0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;
				return;
			}
			var postData = ip.getCommonOptions({});
			postData["confirmBills"]=JSON.stringify(confirmBills);
			postData["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : baseURL+"/doConfirm.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				data :postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					postData["loadDataFlag"]=true;
					confirmTable.ajax.reload(null, true);
					ip.warnJumpMsg(data.result,0,0,true);
					requesting=false;
				}
			});
		}
		
		//关闭弹窗
		closeConfirmPay=function(){
			 $("#confirmPay").modal("hide");
			requesting=false;
			queryHandler();
		}
		
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