define(['text!pages/agent/refundAgentInput/refundAgentInput.html',
	'commonUtil','jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select',
    'initDataTableUtil' ],function(html,commonUtil){
	var init =function(element,param){
		//页面标题
		document.title = ip.getUrlParameter("menuname"); 
		var viewModel = {
				tokenid : ip.getTokenId()
			};
		var baseURL = EBankConstant.Ctx + "agent";
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
		
		var requesting = false;
		var vtCode = ip.getUrlParameter("vt_code");
        var num = "";
		//初始化页面
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false);
			viewModel["viewList"] = pageData.viewList;
		};
		
		//构建传入后台的billNos
		buildBillNosAndFinanceCode = function(id){
			var billNosAndFinanceCode = new Array();
			var selectRows = $('#modalMainGridArea').DataTable().rows('.selected');
			for (var i = 0; i < selectRows.indexes().length; i++) {
				var temp = {};
				temp["bill_no"] = selectRows.data()[i].bill_no;
				temp["finance_code"] = selectRows.data()[i].finance_code;
				billNosAndFinanceCode.push(temp);
			}
			return billNosAndFinanceCode;
		};
		
		//补录
		inputRefundVoucher = function() {
			if(requesting){
				return;
			}
			requesting=true; 
			var billNosAndFinanceCode =  commonUtil.getOperaParam("mainGridArea",false,false,false,false);
			if(billNosAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;  
				return false;
			}
			if(billNosAndFinanceCode.length!=1){
				ip.warnJumpMsg("每次只能补录一条凭证！",0,0,true);
				requesting=false;  
				return false;
			}
			num = "1";
			$("#refundAgentInput").modal("show");	
		};
		
		//再次补录
		reInputRefundVoucher = function() {
			if(requesting){
				return;
			}
			requesting=true; 
			var billNosAndFinanceCode = commonUtil.getOperaParam("mainGridArea",false,false,false,false);
			if(billNosAndFinanceCode.length==0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				requesting=false;  
				return false;
			}
			if(billNosAndFinanceCode.length>1){
				ip.warnJumpMsg("每次只能补录一条凭证！",0,0,true);
				requesting=false;  
				return false;
			}
			num = "2";
			$("#refundAgentInput").modal("show");	
		};
		
		//清空
		doClearAgentRefundBillInput=function(){
			$("#pay_entrust_date").val("");
			$("#pay_msg_no").val("");
			$("#pay_dictate_no").val("");
		};		
		
		//保存
		doSaveAgentRefundBillInput=function(){
			var patt1=/^[0-9]*$/;
			var pay_msg_no= $('#pay_msg_no').val().trim();
			var pay_dictate_no = $('#pay_dictate_no').val().trim();
			var pay_entrust_date= $('#pay_entrust_date').val();
			if(!pay_msg_no){
				ip.warnJumpMsg("请输入支付报文类型！",0,0,true);
				return;
			}
			if(!pay_dictate_no){
				ip.warnJumpMsg("请输入支付交易序号！",0,0,true);
				return;
			}
			if(!patt1.test(pay_dictate_no) || pay_dictate_no.length != 8){
				ip.warnJumpMsg("支付交易序号是8位数字！",0,0,true);
				return;
			}
			if(!pay_entrust_date){
				ip.warnJumpMsg("请输入交易委托日期！",0,0,true);
				return;
			}
			var postData = ip.getCommonOptions({});
			var billNosAndFinanceCode =  commonUtil.getOperaParam("mainGridArea",false,false,false,false);
			postData["setYear"] = mainOptions["svSetYear"];
			postData["vtCode"] = vtCode;
			postData["billnosAndFinanceCode"] = JSON.stringify(billNosAndFinanceCode);
			postData["ajax"] = "nocache";
			postData["num"] = num;
			postData["pay_msg_no"] = pay_msg_no;
			postData["pay_dictate_no"] = pay_dictate_no;
			postData["pay_entrust_date"] = pay_entrust_date;
			ip.processInfo("正在处理中，请稍候......", true);
			$.ajax({
				url : baseURL+"/doRefundAgentInput.do",
				type : "POST",
				data : postData,
				success : function(data) {
					ip.processInfo("正在处理中，请稍候......", false);
					if(data.flag=='1'){
						ip.warnJumpMsg("录入成功！",0,0,true);
							$("#refundAgentInput").modal("hide");		
					}else{
						ip.warnJumpMsg("录入失败，"+data.result,0,0,true);	
					}
					doClearAgentRefundBillInput();
					requesting=false;	
					queryHandler();
				}
			});				
		};
		
		//关闭
		closeAgentRefundBillInput = function(){
			doClearAgentRefundBillInput();
			$("#refundAgentInput").modal("hide");	
			queryHandler();
			requesting=false;
		};
		
		pageInit = function(){
			viewModel.initData();	
		};
		
		$(element).html(html);	
		pageInit();
	};
	
	return {
        init:init
    };
	});