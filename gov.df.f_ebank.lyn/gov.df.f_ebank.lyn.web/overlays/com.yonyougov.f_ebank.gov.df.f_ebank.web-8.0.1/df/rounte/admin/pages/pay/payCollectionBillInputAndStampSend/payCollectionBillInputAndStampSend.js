define(['text!pages/pay/payCollectionBillInputAndStampSend/payCollectionBillInputAndStampSend.html','operate','commonUtil',
    'jquery','es5sham','html5','calendar','uui','tree', 'bootstrap','ip',
    'ebankConstants','datatables.net-bs','datatables.net-select',
    'initDataTableUtil'],function(html,operate,commonUtil){
	var init =function(element,param){
		//页面标题
		document.title=ip.getUrlParameter("menuname");
		var viewModel = {
			tokenid : ip.getTokenId(),
		};
		
		var requesting=false;			
		//查询主单参数
		var mainOptions = ip.getCommonOptions({});
		mainOptions["vtCode"]=ip.getUrlParameter("vt_code");
		mainOptions["isDetailQuery"] = "false";  //是否查询明细
		mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_COLL_BILL;
		mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_COLL_BILL;
		mainOptions["isWorkFlowRelated"] = true;
		mainOptions["relationBillId"] = "id";
		
		//初始化页面
		viewModel.initData = function() {
			var pageData= commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
							mainOptions,"",false);
			
			viewModel["viewList"] = pageData.viewList;
			for ( var n = 0; n < viewModel.viewList.length; n++) {
				var view = viewModel.viewList[n];
				if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_INPUT){		
					if (view.orders == '1') {
						viewModel.collInputViewId = view.viewid;
						viewModel.collInputViewModel = ip.initArea(view.viewDetail,"edit", view.viewid.substring(1,37),
								"modalCollInputArea");
					} 
				}
			}
			//视图初始化结束将录入视图必填项进行渲染
			for(var i=0;i<viewModel.collInputViewModel.length;i++){
				//给必填项label添加一个标识class
				var id = viewModel.collInputViewModel[i].id;
				$("#"+id).parent().prev("label").prepend("<span class='color-red'>*</span>");
			}
 		    // 初始化财政机构的下拉框
 			commonUtil.initFinanceCode(viewModel.collInputViewId.substring(1, 37),mainOptions);
			$("#finance_code-"+ viewModel.collInputViewId.substring(1, 37)).change(getPayAccount);
		};

		//录入
		inputCollection=function(){
			$("#payCollectionBillInput").modal("show");
		};
		//保存
		doSaveCollInput=function(){
			var pay_account_no="";
			var pay_account_name="";
			var pay_account_bank="";
			var finance_code = $('#'+viewModel.collInputViewModel[0].id).val();
			var validInfo = "";
			for(var i=0;i<viewModel.collInputViewModel.length;i++){
				var value = $("#" + viewModel.collInputViewModel[i].id).val();
				var id = viewModel.collInputViewModel[i].id.substring(0, viewModel.collInputViewModel[i].id.indexOf("-"));
				if(value == null || value == "" || value.trim() == ""){
					var inputLable = $("#" + viewModel.collInputViewModel[i].id).parent().prev("label").text().substring(1);
					validInfo +=  "<span style='display:block;'>"+inputLable+"不能为空！"+"</span>";
				}else{
					if(id == "payee_account_no"){
						var patt1=/^[0-9]*$/;
						if(!patt1.test(value)){
							validInfo +=  "<span style='display:block;'>收款人账号必须是数字！</span>";
						}
					}
					if(id == "pay_money"){
						var moneyReg = /^[+]?\d+(\.\d{1,2})?$/g;
						if(!moneyReg.test(value)){
							validInfo +=  "<span style='display:block;'>金额格式有误，小数点后只保留两位！</span>";
						}
					}
				}
			}
			if(validInfo != ""){
				ip.warnJumpMsg(validInfo,0,0,true);
				return;
			}
			//组装向后台传的数据
			var info = [];
			var infos = operate.getDataFromDiv("modalCollInputArea");
			infos.vt_code = mainOptions["vtCode"];
			info.push(infos);
			mainOptions["info"]=JSON.stringify(info);
			$.ajax({
				url :"/df/f_ebank/pay/collection/doCollectionBillInput.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data :mainOptions,
				success : function(data) {
					if(data.success=='1'){
						ip.warnJumpMsg("录入成功！",0,0,true);
						closeCollBillInput();	
					}else{
						ip.warnJumpMsg("录入失败"+data.error,0,0,true);
					}
				}
			});		
		};
		//关闭
		closeCollBillInput=function(){
			$("#payCollectionBillInput").modal("hide");	
			operate.clearData("modalCollInputArea");
			$("#pay_account-"+viewModel.collInputViewId.substring(1, 37)).html("");
			queryHandler();
		};	
		//删除
		deleteCollectionBill=function(){
			var billNosAndFinanceCode= commonUtil.getOperaParam("mainGridArea",false,false,false);
			if(billNosAndFinanceCode.length!=1){
				ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
				return false;
			}
			mainOptions["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
			mainOptions["ajax"]="nocache";
		    ip.warnJumpMsg("确定要删除吗？","del", "cCla");
		    
		    $("#del").on("click", function() {
		    	$("#config-modal").remove();
		    	$.ajax({
					url : "/df/f_ebank/pay/collection/doCollectionBillDelete.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data : mainOptions,
					success : function(data) {
						if(data.is_success=="0"){
							ip.warnJumpMsg("删除失败,"+data.error,0,0,true);
						}else{
							queryHandler();
							ip.warnJumpMsg("删除成功！",0,0,true);
						}
					}
				});
			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
		};
		//付款人信息
		function  getPayAccount() {
			var financeCode=document.getElementById("finance_code" + "-"
					+ viewModel.collInputViewId.substring(1, 37)).value;
			$.ajax({
				url : "/df/f_ebank/financeAcctManage/getAccountForSingleType.do?tokenid="
					+ viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"accountType" : "12",
					"finance_code":financeCode
				},
				success : function(datas) {
					if (datas.errorCode == "0") {
						var html = "";
						for (var i = 0; i < datas.result.length; i++) {
							html+="<option value='"+datas.result[i].account_no+" "+datas.result[i].account_name+" "+datas.result[i].bank_name+"'>"+datas.result[i].account_name+"</option>";
						}
						$("#pay_account" + "-" + viewModel.collInputViewId.substring(1, 37)).html(html);		
					} else {
						ip.warnJumpMsg("获取付款人信息失败！原因：" + data.reason,0,0,true);
						//ip.ipInfoJump("获取付款人信息失败！原因：" + data.reason, "error");
					}
				}
			});
		};
		
		$(element).html(html);	
		viewModel.initData();
	};
	return {
         init:init
    };
});