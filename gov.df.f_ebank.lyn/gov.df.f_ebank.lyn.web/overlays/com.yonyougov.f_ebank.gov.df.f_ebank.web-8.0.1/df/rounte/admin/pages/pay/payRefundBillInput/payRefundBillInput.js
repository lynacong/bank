define(['text!pages/pay/payRefundBillInput/payRefundBillInput.html','commonUtil',
    'jquery','es5sham','html5','calendar','bootstrap','ip',
    'ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,commonUtil) {
	var init =function(element,param){ 	
		//页面标题
		document.title=ip.getUrlParameter("menuname"); 
		var viewModel = {
				tokenid : ip.getTokenId(),
			};
		var queryURL=EBankConstant.CommonUrl.query;
		
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
		
		var requesting=false;			
		var payRefundListOptions = ip.getCommonOptions({});
		payRefundListOptions.gridParam = ip.getTableSetting();
		payRefundListOptions["isDataTables"]=true; 
		var isInitPayRefundDailog=0;
		var all_can_refund_money=0;
        var oriVtCode = ip.getUrlParameter("oriVtCode");
		var selectIndex =-1;
		var allData=null;
		
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false);
			viewModel["viewList"] = pageData.viewList;
		};
		
		//录入
		inputVoucher = function(){
			if(requesting){
				return;
			}
			requesting = true;
			$("#payRefundBillInput").modal("show");
			$("#refund_money").attr("disabled",false);
			if(isInitPayRefundDailog==0)
			    initPayRefundDailog();
			viewModel.payRefundListArea.page.len(20).draw();
		};
		
		//审核
		checkVoucher=function(){
			if(requesting){
				return;
			}
			requesting=true;
			var billIdsAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,true,false,false);
			if(billIdsAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择送审数据！",0,0,true);
				requesting=false;
				return;
			}
			var postData = ip.getCommonOptions({});
			postData["vt_code"]=ip.getUrlParameter("vt_code");
			postData["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
			postData["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.CommonUrl.refund+"/doCommonRefundNext.do",
				type : "POST",
				data :postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.success=='1'){
						ip.warnJumpMsg("审核成功！",0,0,true);	
					}else{
						ip.warnJumpMsg("审核失败！",0,0,true);	
					}
						queryHandler();
						requesting=false;
				}
			});
		};
		  
		//撤销送审
		cancelCheck=function(){
			if(requesting){
				return;
			}
			requesting=true;
			var billIdsAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,true,false,false);
			if(billIdsAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择撤销送审的数据！",0,0,true);
				requesting=false;
				return;
			}
			var postData = ip.getCommonOptions({});
			postData["vt_code"]=ip.getUrlParameter("vt_code");
			postData["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
			postData["ajax"]="nocache";
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : EBankConstant.CommonUrl.refund+"/doCancelRefundCheck.do",
				type : "POST",
				data :postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.success=='1'){
						ip.warnJumpMsg("撤销送审成功！",0,0,true);	
					}else{
						ip.warnJumpMsg("撤销送审失败，"+data.result,0,0,true);	
					}
					queryHandler();
					requesting=false;
				}
			});
		};

		
		//作废
		deleteVoucher=function(){
			if(requesting){
				return;
			}
			requesting=true;
			var billIdsAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,true,false,false);
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
				url :EBankConstant.CommonUrl.refund+"/doRefundDelete.do",
				type : "POST",
				data :postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.success=='1'){
						ip.warnJumpMsg("作废成功！",0,0,true);	
					}else{
						ip.warnJumpMsg("作废失败",0,0,true);	
					}
					queryHandler();
					requesting=false;
				}
			});
		};
		
		searchBill=function(){	
			$("#refund_money").val("");
		    $("#refund_money").attr("disabled",false);
		    $("#refund_reason").val("");
		    $("#refund_reason").attr("disabled",false);
			var bill_no = document.getElementById("bill_no").value.trim();
			var finance_code = document.getElementById("finance_code").value;
			document.getElementById('refundSerchText').innerHTML="";
			if(bill_no==''||bill_no==null){
				ip.warnJumpMsg("请输入原支付凭证号！！！",0,0,true);
				return;
			}
			payRefundListOptions["bill_no"]=bill_no;
			payRefundListOptions["ajax"]="nocache";
			payRefundListOptions["ori_vt_code"]=oriVtCode;
			payRefundListOptions["finance_code"]=finance_code;
			
			payRefundListOptions["loadDataFlag"]= true;
			viewModel.payRefundListArea.ajax.reload(function(){
				allData = $('#modalPayRefundListArea').DataTable().rows().data();
				if(allData.length>0){
					all_can_refund_money=0;
					if(mainOptions["sumFlag"]){
						for ( var i = 1; i < allData.length; i++) {
							all_can_refund_money = parseFloat(all_can_refund_money)+ parseFloat(allData[i].can_refund_money);
						}
					}else{
						for ( var i = 0; i < allData.length; i++) {
							all_can_refund_money =parseFloat(all_can_refund_money)+ parseFloat(allData[i].can_refund_money);
						}
					}
					document.getElementById('refundSerchText').style.color= "red";
					document.getElementById('refundSerchText').innerHTML="可退金额为"+parseFloat(all_can_refund_money).toFixed(2);
					if(selectIndex!=-1&&allData.length>selectIndex)//连续录入时勾上已选择的数据
						$('#modalPayRefundListArea').DataTable().rows(selectIndex)
					    .nodes()
					    .to$()      
					    .addClass( 'selected' );
				}else{
					document.getElementById('refundSerchText').style.color= "red";
					document.getElementById('refundSerchText').innerHTML="该笔数据不存在或数据没有完成清算不能进行退款";
				}
				
				 var isAllBatchCheck = document.getElementById('isAllBatchCheck');
				 document.getElementById('isAllBatchCheck').checked=false;
			});
		};
		
		//是否全额批量退款复选框事件监听
		 isAllBatchCheckListener= function() {
			//勾选时，表格全部选中，获取所有可退金额，填到退款录入区中的退款金额中
			if(document.getElementById('isAllBatchCheck').checked){
				if(allData != null){
					$("#modalPayRefundListArea").DataTable().rows('tbody tr').select();
					var all_can_refund_money = 0;		
					if(mainOptions["sumFlag"]){
						for ( var i = 1; i < allData.length; i++) {
							all_can_refund_money = parseFloat(all_can_refund_money)+ parseFloat(allData[i].can_refund_money);
						}
					}else{
						for ( var i = 0; i < allData.length; i++) {
							all_can_refund_money =parseFloat(all_can_refund_money)+ parseFloat(allData[i].can_refund_money);
						}
					}
					
					if(allData.length==0){
						$("#refund_money").val("");
					}else{
						$("#refund_money").val(parseFloat(all_can_refund_money).toFixed(2));
					}
					$("#refund_money").attr("disabled",true);
				}
			}else{
				$("#modalPayRefundListArea").DataTable().rows('tbody tr').deselect();
				$("#refund_money").val("");
				$("#refund_money").attr("disabled",false);
			}
		};
		
		//录入弹出框
		initPayRefundDailog = function() {
			isInitPayRefundDailog=1;
			for ( var n = 0; n < viewModel.viewList.length; n++) {
				var view = viewModel.viewList[n];
				if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
					if (view.orders == '5') {
						viewModel.payRefundListViewId=view.viewid;
						payRefundListOptions["tableViewId"] = view.viewid;
						payRefundListOptions["isSetValue"] = "false";
						payRefundListOptions["isDetailQuery"] = "false";  //是否查询明细
						payRefundListOptions["loadDataFlag"]= false;
						payRefundListOptions["pageflag"]=false;
						payRefundListOptions["scrollY"]=$("#payRefundBillInput .modal-body").innerHeight()*0.47 + "px";
						viewModel.payRefundListArea = initDataTables("modalPayRefundListArea", EBankConstant.CommonUrl.refund+"/getOriBillDetail.do",payRefundListOptions,view.viewDetail);
					} 
				}
			}
			//初始化录入模态框财政机构
			commonUtil.initFinanceCode("",payRefundListOptions);
		};
		
		//清空
		doClearPayRefundBillInput=function(){
			$("#refundSerchText").val("");
			$("#refund_reason").val("");
			$("#bill_no").val("");
			$("#refund_money").val("");
			document.getElementById('refundSerchText').innerHTML="";
			document.getElementById('isAllBatchCheck').checked=false;
			document.getElementById('continueCheck').checked=false;
			payRefundListOptions["loadDataFlag"]=false;
			viewModel.payRefundListArea.ajax.reload(null, true); 
		};
		
		
		//保存
		doSavePayRefundBillInput=function(){
			var billIdsAndFinanceCode = new Array();
			var selectRows = $('#modalPayRefundListArea').DataTable().rows('.selected');
			if (selectRows.indexes().length ==0){
				ip.warnJumpMsg("请选择数据！！！",0,0,true);
			    return;
			};
			for (var i = 0; i < selectRows.indexes().length; i++) {
				var temp = {};
				temp["id"] = selectRows.data()[i].id;
				temp["finance_code"] = selectRows.data()[i].finance_code;
				temp["can_refund_money"] = selectRows.data()[i].can_refund_money;
				billIdsAndFinanceCode.push(temp);
			}
			payRefundListOptions["oriBillNo"]=document.getElementById('bill_no').value.trim();
			if(document.getElementById('isAllBatchCheck').checked){//批量全额退款
				
				var refundReasion= document.getElementById('refund_reason').value;
				
				var refundMoney= document.getElementById('refund_money').value;
				if(refundReasion==''||refundReasion==null){
					ip.warnJumpMsg("请输入退款原因！",0,0,true);
					return;
				}
				if(all_can_refund_money==0){
					ip.warnJumpMsg("可退金额为零不许退款！",0,0,true);
					return;
				}
				payRefundListOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				payRefundListOptions["ajax"]="nocache";
				payRefundListOptions["vt_code"]=ip.getUrlParameter("vt_code");
				payRefundListOptions["refundReasion"]=refundReasion;
				payRefundListOptions["refundMoney"]=refundMoney;
				payRefundListOptions["isBatchAllRefund"]="1";
			}else{
				if(billIdsAndFinanceCode.length<1){
					ip.warnJumpMsg("请选择数据！",0,0,true);
					return;
				}
				if(billIdsAndFinanceCode.length>1){
					ip.warnJumpMsg("请选择一条数据！",0,0,true);
					return;
				}
				var canRefundMoney = billIdsAndFinanceCode[0].can_refund_money;
				var refundReasion= document.getElementById('refund_reason').value;
				var refundMoney= document.getElementById('refund_money').value;
				
				if(refundReasion==''||refundReasion==null){
					ip.warnJumpMsg("请输入退款原因！",0,0,true);
					return;
				}
				if(refundMoney==''||refundMoney==null){
					ip.warnJumpMsg("请输入退款金额！",0,0,true);
					return;
				}
				if(!ip.validateMoney(refundMoney)){					
					ip.warnJumpMsg("输入金额格式不正确，小数点后只保留两位！",0,0,true);
					return ;
			    }
				var refundMoneyFloat = parseFloat(refundMoney);
				var canRefundMoneyFloat = parseFloat(canRefundMoney);
				if(refundMoneyFloat<0){
					ip.warnJumpMsg("输入退款金额应为正数",0,0,true);
					return;
				}
				if(refundMoneyFloat>canRefundMoneyFloat){
					ip.warnJumpMsg("退款金额大于可退金额，可退金额为"+canRefundMoney,0,0,true);
					return;
				}
				payRefundListOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				payRefundListOptions["ajax"]="nocache";
				payRefundListOptions["vt_code"]=ip.getUrlParameter("vt_code");
				payRefundListOptions["refundReasion"]=refundReasion;
				payRefundListOptions["refundMoney"]=refundMoney;
				payRefundListOptions["isBatchAllRefund"]="0";
			}
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url :EBankConstant.CommonUrl.refund+"/doPayRefundInput.do",
				type : "POST",
				dataType : "json",
				data :payRefundListOptions,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.success=='1'){
						ip.warnJumpMsg("录入成功！",0,0,true);
						if(!document.getElementById('continueCheck').checked){
							$("#payRefundBillInput").modal("hide");	
							requesting=false;
							doClearPayRefundBillInput();
						}else{
							selectIndex = $('#modalPayRefundListArea').DataTable().rows('.selected').indexes()[0];
							payRefundListOptions["loadDataFlag"]=false;
							viewModel.payRefundListArea.ajax.reload(null, true); 
							searchBill();
						}
					}else{
						ip.warnJumpMsg("录入失败，"+data.error,0,0,true);	
					}
					queryHandler();
					allData=null;	
				}
			});				
		};
		
		//关闭
		closePayRefundBillInput=function(){
			allData=null;	
			$("#refundSerchText").val("");
			$("#refund_reason").val("");
			$("#bill_no").val("");
			$("#refund_money").val("");
			document.getElementById('isAllBatchCheck').checked=false;
			document.getElementById('continueCheck').checked=false;
			document.getElementById('refundSerchText').innerHTML="";
			payRefundListOptions["loadDataFlag"]=false;
			viewModel.payRefundListArea.ajax.reload(null, true); 
			$("#payRefundBillInput").modal("hide");
			queryHandler();
			requesting=false;
			
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
