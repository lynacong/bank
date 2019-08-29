define(['text!pages/pay/factPay/factPayBillBatchConfirm.html',
	'commonUtil','jquery','es5sham','html5','calendar',
	'bootstrap','ip','ebankConstants','datatables.net-bs', 
    'datatables.net-select','initDataTableUtil'],function(html,commonUtil) {
		var init =function(element,param){ 	
		//页面标题
		document.title=ip.getUrlParameter("menuname"); 
		var viewModel = {
				tokenid : ip.getTokenId(),
			};
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
		
		//配置列表
		viewModel.initData = function() {
			var pageData = commonUtil.initPageData("buttonArea","searchArea","statusArea","mainGridArea","detailContainer",
					mainOptions,voucherOptions,false);
			viewModel["viewList"] = pageData.viewList;
		};
		
		//退回财政
		var payInfo = [];
		returnCZ = function(){
			payInfo = [];
			var allMoney=0.00;
			var selectRows = $('#mainGridArea').DataTable().rows('.selected');
			if(selectRows[0].length == 0){
				ip.warnJumpMsg("请选择数据！",0,0,true);
				return;
			}else{
				for (var i = 0; i < selectRows.indexes().length; i++) {
					var curIndexData = selectRows.data()[i];
					var temp = {};
					temp["bill_no"] = curIndexData.bill_no;
					temp["finance_code"] = curIndexData.finance_code;
					temp["pay_money"] = curIndexData.pay_money;
					allMoney = parseFloat(allMoney) + parseFloat(curIndexData.pay_money);
					payInfo.push(temp);
				}
			}
			//退回财政意见意见框、支付信息表格、合计金额赋值
			$("#returnAdvice").val("");
	 		$('#gridTest').DataTable({
 			    destroy: true,
 			    searching: false,
 		        paging: false,
 		        bSort: false,
 		        bInfo: false,
 		        scrollY:$("#returnCZModal").innerHeight()*0.20 + "px",
		        data:payInfo,
		        columns: [
		            { data: 'bill_no' },
		            { data: 'pay_money' },
		            { data: 'finance_code' }
		        ]				 
			 });
	 		 $("#money").html(parseFloat(allMoney).toFixed(2));
	 		 $("#returnCZModal").modal("show");
		};
		//判断是否是托收或空白支票数据
		viewModel.isCollect = function(pfName,needPfType){
			pfName = pfName || "";
			var index1 = pfName.indexOf("托收");
			var index2 = pfName.indexOf("空白支票");
			var pfType;
			if(index1 != -1 || index2 != -1){
				if(needPfType){
					if(pfName.indexOf("托收") != -1){
						pfType = 0;
					}else if(pfName.indexOf("空白支票") != -1){
						pfType = 1;
					}
				}
				return  {"flag":true,"pfType":pfType};
			}
			return {"flag":false};
		}
		
		//退回财政清空意见
		clearAdvice=function(){
			$("#returnAdvice").val("");
		};
		//退回财政历史记录
		notes=function(){
			setNotesGrid();
			$("#preNotes").modal("show");
		};
		//历史记录表格赋值
		setNotesGrid = function(){
			var data = commonUtil.getCookie("czNotes");
			var noteData = [];
			if(!data){
				noteData = [];
			}else{
				var	prenotes = data.split("@");
				for (var i = 0;i < prenotes.length; i++){
					if(prenotes[i]){
						var temp={
 							"suggest":prenotes[i],
 						};
						noteData.push(temp);
					}
				}
			}
				
			$('#gridNotes').DataTable({
 			    destroy: true,
 			    searching: false,
 		        paging: false,
 		        bSort: false,
 		        bInfo: false,
		        data:noteData,
		        language: {'zeroRecords': '没有检索到数据'},
		        columns: [
		            { data: 'suggest' }
		        ]
		    });
			$("#gridNotes_wrapper").css("marginTop","-12px");
		};
		//获取选中数据
		$("body").on('click', '#gridNotes tbody tr', function () {
			$(this).toggleClass('selected');
		    var rowData = $('#gridNotes').DataTable().row($(this)).data();
		    if(rowData == undefined){
		    	return;
		    }
		    $("#returnAdvice").val(rowData.suggest);
	  	});
		//保存审核意见并退回财政
		saveAdvice = function(){
			var returnAdvice = $("#returnAdvice").val();
			if(!returnAdvice){
				ip.warnJumpMsg("请填写审核意见！",0,0,true);
				return;
			}else{
				$("#returnCZModal").modal("hide");
				//勾选保存记录，把退回财政意见存到cookie中
				if($('#saveRecord')[0].checked){
					var data = commonUtil.getCookie("czNotes");
					if(data){
						var temp = data.split("@");
						for(var i = 0; i < temp.length; i++){
							if(temp[i] == returnAdvice){
								break;
							}else if(i == temp.length-1){
								commonUtil.setCookie("czNotes",data + "@" + returnAdvice);
							}
						}
					}else{
						document.cookie = "czNotes=" + returnAdvice;
					}
				}
				
				var postData = ip.getCommonOptions({});
				postData["vt_code"] = ip.getUrlParameter("vt_code");
				postData["set_year"] = mainOptions["svSetYear"];
				postData["billNosAndFinanceCode"] = JSON.stringify(payInfo);
				postData["advice"] = returnAdvice;
				postData["ajax"] = "nocache";
				ip.processInfo("正在处理中，请稍候......", true);
				$.ajax({
					url : baseURL+"/doBackCZ.do?tokenid=" + viewModel.tokenid,
					type : "POST",
					data :postData,
					success : function(data) {
						ip.processInfo("正在处理中，请稍候......", false);
						if(data.is_success=='0'){
							ip.warnJumpMsg(data.error_msg,0,0,true);
						}else{
							queryHandler();
							ip.warnJumpMsg('支付凭证退回财政成功！',0,0,true);
						}
					}
				});
			}
		};
		//删除所有审核意见
		delAll=function(){
			nodes = $('#gridNotes').DataTable().data();
			if(nodes.length == 0){
				ip.warnJumpMsg("没有可删除的数据！",0,0,true);
				return;
			}	
			ip.warnJumpMsg("确定要删除所有审核意见吗？","del", "cCla");
			$("#del").on("click", function() {
				commonUtil.setCookie("czNotes", "", -1);
				$("#preNotes").modal("hide");
				$("#config-modal").remove();
			});
			
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
		};
		//删除选中的审核意见
		delCheck = function(){
			var nodes = new Array();
			var selectRows = $('#gridNotes').DataTable().rows('.selected');
			for (var i = 0; i < selectRows.indexes().length; i++) {
				var temp = {};
				temp["suggest"] = selectRows.data()[i].suggest;
				nodes.push(temp);
			}
			if(nodes.length == 0){
				ip.warnJumpMsg("请选择数据进行删除！",0,0,true);
				return;
			}				
			var cookieData='';
			var data = commonUtil.getCookie("czNotes");
			var	prenotes=data.split("@");
			for (var i=0;i<prenotes.length;i++){
				for (var j=0;j<nodes.length;j++){
					if(prenotes[i]==nodes[j].suggest){
						prenotes[i]='';
					}
				}
				if(prenotes[i]!=''){
					cookieData=cookieData+"@"+prenotes[i];
				}
			}
			ip.warnJumpMsg("确定要删除选中的审核意见吗？","del", "cCla");
			$("#del").on("click", function() {
				commonUtil.setCookie("czNotes",cookieData);
				$("#config-modal").remove();
				setNotesGrid();
				clearAdvice();
			});
				
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
		};
		//退回财政弹窗关闭事件
		closeAdvice=function(){
			$("#returnCZModal").modal("hide");
		};
		
		pageInit =function(){
			viewModel.initData();
		};
		
		//画html
		$(element).html(html);	
		pageInit();
	};
	return {
	    init:init
	};
});
