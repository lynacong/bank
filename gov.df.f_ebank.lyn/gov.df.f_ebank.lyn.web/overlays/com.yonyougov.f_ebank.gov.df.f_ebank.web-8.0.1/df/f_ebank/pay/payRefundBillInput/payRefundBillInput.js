require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;			
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var payRefundListOptions = ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			var isInitPayRefundDailog=0;
			var all_can_refund_money=0;
            var otiVtCode = ip.getUrlParameter("ori_vt_code");
            var moneyFormat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
			mainOptions["operate_width"] =80;
			var selectIndex =-1;
			var allData;

			var viewModel = {
				tokenid : ip.getTokenId(),
				 gridDataTable: new u.DataTable({
				    	meta: {
				    		'bill_no': {},
				    		'pay_money': {},
				    		'finance_code':{},
				    	}
				    }),
			    gridNodes: new u.DataTable({
			    	meta: {
			    		'suggest': {},
			    	}
			    }),
			};
			
			//构建传到后台的billIds
			buildBillIdsAndFinanceCode = function(id){
				var billIdsAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billIdsAndFinanceCode = [];
					var payData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["id"] = payData.id;
					temp["finance_code"] = payData.finance_code;
					temp["bill_no"] = payData.bill_no;
					temp["ori_bill_no"] = payData.ori_bill_no;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','bill_no','finance_code','ori_bill_no' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			//录入
			input=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				$("#payRefundBillInput").modal("show");
				if(isInitPayRefundDailog==0)
				    initPayRefundDailog();
				
				//initAllFinances();
				/*var province_code = document.getElementById("province_code" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37));

				province_code.addEventListener("change", getCity, false);*/
			}
			
			//送审
			check=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				var billIdsAndFinanceCode = buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择送审数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.refund+"/doCommonRefundNext.do",
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.success=='1'){
							ip.warnJumpMsg("送审成功",0,0,true);	
						}else{
							ip.warnJumpMsg("送审失败",0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			}
			  

			
			//撤销送审
			cancelcheck=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				var billIdsAndFinanceCode = buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择送审数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.refund+"/doCancelRefundCheck.do",
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.success=='1'){
							ip.warnJumpMsg("撤销送审成功",0,0,true);	
						}else{
							ip.warnJumpMsg("撤销送审失败",0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			}

			
			//作废
			deleteBill=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				} 
				
				
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url :EBankConstant.CommonUrl.refund+"/doRefundDelete.do",
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.success=='1'){
							ip.warnJumpMsg("作废成功",0,0,true);	
						}else{
							ip.warnJumpMsg("作废失败",0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			}
			
			//查询
			viewModel.fSelect=function(){
				fsc_show();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			

			searchBill=function(){				
				var bill_no = document.getElementById("bill_no").value.trim();
				var finance_code = document.getElementById("finance_code").value;
				document.getElementById('refundSerchText').innerHTML="";
				if(bill_no==''||bill_no==null){
					ip.warnJumpMsg("请输入原支付凭证号！！！",0,0,true);
					return;
				}
				payRefundListOptions["bill_no"]=bill_no;
				payRefundListOptions["ajax"]="nocache";
				payRefundListOptions["ori_vt_code"]=otiVtCode;
				payRefundListOptions["finance_code"]=finance_code;
				 $.ajax({
						url : EBankConstant.CommonUrl.refund+"/getOriBillDetail.do",
						type : "GET",
						data :payRefundListOptions,
						success : function(datas) {
							if(datas.data.length>0){
								allData = datas.data;
								viewModel.payRefundListArea.gridData.setSimpleData(datas.data, {
									unSelect: true
								});	
							
								
								all_can_refund_money=0;
								for ( var i = 0; i < allData.length; i++) {
									all_can_refund_money =all_can_refund_money+  parseFloat(allData[i].can_refund_money);
									
								}
								document.getElementById('refundSerchText').style.color= "red";
								document.getElementById('refundSerchText').innerHTML="可退金额为"+all_can_refund_money;
								if(selectIndex!=-1&&datas.data.length>selectIndex)//连续录入时勾上已选择的数据
								    viewModel.payRefundListArea.gridData.setRowSelect(selectIndex);
							}else{
								document.getElementById('refundSerchText').style.color= "red";
								document.getElementById('refundSerchText').innerHTML="该笔数据数据不存在或数据没有完成清算不能进行退款";
							}
							
						}
					});

				 
				 var isAllBatchCheck = document.getElementById('isAllBatchCheck');
				 document.getElementById('isAllBatchCheck').checked=false;
				 isAllBatchCheck.addEventListener("change", isAllBatchCheckListener, false);
			}
			
			//批量选择框监听
			function  isAllBatchCheckListener() {
				if(document.getElementById('isAllBatchCheck').checked){
					viewModel.payRefundListArea.gridData.setAllRowsSelect();
					var all_can_refund_money=0;
					
					for ( var i = 0; i < allData.length; i++) {
						all_can_refund_money =all_can_refund_money+ parseFloat(allData[i].can_refund_money);
						
					}
					$("#refund_money").val(all_can_refund_money);
				}else{
					viewModel.payRefundListArea.gridData.setAllRowsUnSelect();
					$("#refund_money").val("");
				}
			}
			
			
			
			
			
			
			//操作按钮的显示
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
							
							viewModel.payRefundListArea = ip.initGrid(view, 'modalPayRefundListArea', null, payRefundListOptions, 0, false);
							
							//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
							
						} 

					}
				}
		       
			}
			
			
			//点击主单查询明细
			getDetail=function(){
				var id=viewModel.mainViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["id"] =rowData.id;
				voucherOptions["finance_code"] =mainOptions["finance_code"];
				voucherOptions["set_year"] =mainOptions["set_year"];
				ip.setGrid(viewModel.voucherGridViewModel, queryURL+"/doFind.do", voucherOptions);
			}
			
			viewModel.getQueryView = function() {
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				//mainOptions["condition"]=ip.getAreaData(viewModel.planSearchViewModel);
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				var oriBillNO = document.getElementById("ori_bill_no"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value.trim();
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+2)).value;
				mainOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
				}
				if(oriBillNO!=null&&oriBillNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and ori_bill_no='"+oriBillNO+"'";
				}
				if(startTime!=null&&startTime!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and create_date>='"+startTime+"'";
				}
				if(endTime!=null&&endTime!=''){
					endTime=dateAddOneDay(endTime);
					mainOptions["condition"]=mainOptions["condition"]+"and create_date<'"+endTime+"'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			}
			
			
			//主单上的操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
		        	if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="check(this.id)" class="iconmenu icon-examine" title="审核"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="deleteBill(this.id)" class="iconmenu icon-to-void" title="作废"></a></div>';
					}else if(status=='002'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
		        	        + '" onclick="cancelcheck(this.id)" class="iconmenu icon-cancel-examine" title="撤销送审"></a></div>';
					}
			};
			
			

			//配置列表
			viewModel.initData = function() {
				$.ajax({
					url : "/df/init/initMsg.do",
					type : "GET",
					dataType : "json",
					async : true,
					data : mainOptions,
					success : function(datas) {
						viewModel.viewList = datas.viewlist;// 视图信息
						viewModel.resList = datas.reslist;// 资源信息
						viewModel.coaId = datas.coaId;// coaid
						viewModel.coaDetails = datas.coaDetail;// coa明细
						viewModel.relations = datas.relationlist;// 关联关系
						
						var status=$("#pz_status option:selected").val();
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId=view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									mainOptions["queryViewId"] = viewModel.QueryViewId;
									mainOptions["isSetValue"] = "false";
									mainOptions["isDetailQuery"] = "false";  //是否查询明细
									mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
									mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									mainOptions["isWorkFlowRelated"] = "true";
									mainOptions["relationBillId"] = "voucher_bill_id";
									mainOptions["status"] = status;
									//viewModel.getQueryView();
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] ="000000";
									mainOptions["set_year"] =mainOptions["svSetYear"];
									viewModel.mainViewModel = ip.initGrid(view, 'modalMainGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
									//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isSetValue"] = "false";
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["isWorkFlowRelated"] = "false";
									voucherOptions["relationBillId"] = "voucher_bill_id";
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] =voucherOptions["svSetYear"];
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', queryURL+"/doFind.do", voucherOptions, 0, false);
								}

							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
								if (view.orders == '1'){
									viewModel.QueryViewId = view.viewid;
									viewModel.paySearchViewModel = ip
											.initArea(view.viewDetail,
													"search", view.viewid
															.substring(1,
																	37),
													"paySearchArea");
									viewModel.getFinanceCode();
									viewModel.getYear();
								}
								
							}
						}
					}
				});
			};
			
			//操作按钮的显示
			fsc_show = function() {
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
					var d = new Date();
					if(year==d.getFullYear()){
						if (status==EBankConstant.WfStatus.TODO_001) {
			        		document.getElementById("input").style.display = "";
			        		document.getElementById("check").style.display = "";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("delete").style.display = "";
			        		document.getElementById("cancelCheck").style.display = "none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("input").style.display = "none";
			        		document.getElementById("check").style.display = "none";
			        		document.getElementById("delete").style.display = "none";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("cancelCheck").style.display = "";
						} 
					}else{
						document.getElementById("view").style.display = "";
						document.getElementById("input").style.display = "none";
		        		document.getElementById("check").style.display = "none";
		        		document.getElementById("delete").style.display = "none";
		        		document.getElementById("cancelCheck").style.display = "none";
					}
		        	
		       
			}
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				
				mainOptions["status"] = $("#pz_status option:selected").val();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			
			//查询区的财政机构
			viewModel.getFinanceCode = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getFinanceData+"?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code"
										+ "-"
										+ viewModel.QueryViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.dataDetail[i].chr_code;
								option.text = datas.dataDetail[i].chr_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载财政机构参数失败！原因：" + datas.result, "error");
						}
					}
				})

			}
			
			//查询区的年度
			viewModel.getYear = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getEnabledYearData+"?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(datas) {
						if (datas.errorCode == "0") {
							var d = new Date();
							var x = document.getElementById("set_year"
									+ "-"
									+ viewModel.QueryViewId.substring(
											1, 37));
							x.options[0].disabled="false";
							x.disabled="false";
							for (var i = 0; i < datas.setYear.length; i++) {
							
								var option = document.createElement("option");
								option.value = datas.setYear[i].set_year;
								option.text = datas.setYear[i].year_name;
								if(datas.setYear[i].set_year==d.getFullYear()){
									  option.defaultSelected = true;
								         option.selected = true;
								        // mainOptions["year"] =datas.setYear[i].set_year;
								}
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载年度参数失败！原因：" + datas.result, "error");
						}
					}
				})

			}

			
			//清空
			viewModel.doClearPayRefundBillInput=function(){
				$("#refundSerchText").val("");
				$("#refund_reason").val("");
				$("#bill_no").val("");
				$("#refund_money").val("");
				document.getElementById('refundSerchText').innerHTML="";
				document.getElementById('isAllBatchCheck').checked=false;
				document.getElementById('continueCheck').checked=false;
				viewModel.payRefundListArea.gridData.clear();
				viewModel.payRefundListArea.gridData.totalRow(0);
			}
			
			
			//保存
			viewModel.doSavePayRefundBillInput=function(){
				var billIdsAndFinanceCode = viewModel.payRefundListArea.gridData.getSimpleData({  //批量选中
					type : 'select',
					fields : [ 'id','finance_code','can_refund_money' ]
				});
				payRefundListOptions["oriBillNo"]=document.getElementById('bill_no').value.trim();
				if(document.getElementById('isAllBatchCheck').checked){//批量全额退款
					
					/*if(billIdsAndFinanceCode.length<1){
						alert("请选择数据");
						return;
					}*/
					var refundReasion= document.getElementById('refund_reason').value;
					
					var refundMoney= document.getElementById('refund_money').value;
					if(refundReasion==''||refundReasion==null){
						ip.warnJumpMsg("请输入退款原因！！！",0,0,true);
						return;
					}
					if(all_can_refund_money==0){
						ip.warnJumpMsg("可退金额为零不许退款！！！",0,0,true);
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
						ip.warnJumpMsg("请选择数据！！！",0,0,true);
						return;
					}
					if(billIdsAndFinanceCode.length>1){
						ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
						return;
					}
					var canRefundMoney = billIdsAndFinanceCode[0].can_refund_money;
					var refundReasion= document.getElementById('refund_reason').value;
					var refundMoney= document.getElementById('refund_money').value;
					
					if(refundReasion==''||refundReasion==null){
						ip.warnJumpMsg("请输入退款原因！！！",0,0,true);
						return;
					}
					if(refundMoney==''||refundMoney==null){
						ip.warnJumpMsg("请输入退款金额！！！",0,0,true);
						return;
					}
					if(!moneyFormat.test(refundMoney)){
						ip.warnJumpMsg("输入金额格式不正确！！！",0,0,true);
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
				$.ajax({
					url :EBankConstant.CommonUrl.refund+"/doPayRefundInput.do",
					type : "POST",
					dataType : "json",
					data :payRefundListOptions,
					success : function(data) {
						if(data.success=='1'){
							ip.warnJumpMsg("录入成功",0,0,true);
							if(!document.getElementById('continueCheck').checked){
								$("#payRefundBillInput").modal("hide");	
								
								requesting=false;
								viewModel.doClearPayRefundBillInput();
							}else{
								 selectIndex = viewModel.payRefundListArea.gridData.getSelectedIndex();
								viewModel.payRefundListArea.gridData.clear();
								viewModel.payRefundListArea.gridData.totalRow(0);
								searchBill();
								
							}
						}else{
							ip.warnJumpMsg("录入失败"+data.error,0,0,true);	
						}
						viewModel.fSelect();
							
					}
				});				
			}
			
			//关闭
			viewModel.closePayRefundBillInput=function(){
				$("#refundSerchText").val("");
				$("#refund_reason").val("");
				$("#bill_no").val("");
				$("#refund_money").val("");
				//$("#finance_code").val("");
				document.getElementById('isAllBatchCheck').checked=false;
				document.getElementById('continueCheck').checked=false;
				document.getElementById('refundSerchText').innerHTML="";
				viewModel.payRefundListArea.gridData.clear();
				viewModel.payRefundListArea.gridData.totalRow(0);
				$("#payRefundBillInput").modal("hide");
				
                ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
				requesting=false;
				
			}
			
			
			//初始化财政机构
			initAllFinances = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getFinanceData+"?tokenid=" + viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : mainOptions,
					async : false,
					success : function(data) {
						if (data.result == "成功！") {
							for ( var i = 0; i < data.dataDetail.length; i++) {
								var x = document.getElementById("finance_code");
								var option = document.createElement("option");
								option.text = data.dataDetail[i].chr_name;
								option.value = data.dataDetail[i].chr_code;
		
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
								//var rg_code = document.getElementById("finance_code").value;
							}
						} else {
							ip.ipInfoJump("获取财政信息失败！原因：" + data.reason, "error");
						}
					}
				});
			};
			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
				initAllFinances();
			})

		});
