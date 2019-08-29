require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;			
			var mainOptions = ip.getCommonOptions({});
			var mainDoneOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var payRefundListOptions = ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			mainOptions["operate_width"] =80;
			mainOptions["oriCode"]=ip.getUrlParameter("ori_code");
			mainDoneOptions["oriCode"]=ip.getUrlParameter("ori_code");
			voucherOptions["oriCode"]=ip.getUrlParameter("ori_code");
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
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','bill_no','finance_code' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			
			//送审
			createBill=function(id){
				requesting=true;
				var billIdsAndFinanceCode = buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择生成数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["vtCode"]=ip.getUrlParameter("vt_code");
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCreateAgentBill,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.flag=='1'){
							ip.warnJumpMsg("生成成功"+data.result,0,0,true);	
						}else{
							ip.warnJumpMsg("生成失败,"+data.result,0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			}
			  
			//构建传到后台的billIds
			buildAgentBillIdsAndFinanceCode = function(id){
				var billIdsAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billIdsAndFinanceCode = [];
					var payData = $('#' + viewModel.mainDoneViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["id"] = payData.id;
					temp["finance_code"] = payData.finance_code;
					temp["bill_no"] = payData.bill_no;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainDoneViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','bill_no','finance_code' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			//撤销送审
			cancelCreate=function(id){
				requesting=true;
				var billIdsAndFinanceCode = buildAgentBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				}
				mainDoneOptions["vtCode"]=ip.getUrlParameter("vt_code");
				
				mainDoneOptions["setYear"]=mainOptions["svSetYear"];
				mainDoneOptions["billnosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainDoneOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCancelCreateBill,
					type : "POST",
					data :mainDoneOptions,
					success : function(data) {
						if(data.flag=='1'){
							ip.warnJumpMsg("撤销生成成功",0,0,true);	
						}else{
							ip.warnJumpMsg("撤销生成失败,"+data.result,0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			}

			
			
			//查询
			viewModel.fSelect=function(){
				fGetGrid();
				/*fsc_show();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);*/
			}
			
			
			
			//点击主单查询明细
			getDetail=function(){
				
				var status = $("#pz_status option:selected").val();

				if (status==EBankConstant.WfStatus.AUDITED_002) {
					voucherOptions["relationBillId"] = "agent_bill_id";
					
					var id=viewModel.mainDoneViewModel.gridData.getFocusIndex();
					var rowData = $('#' + viewModel.mainDoneViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					voucherOptions["id"] =rowData.id;
				}else{
					voucherOptions["relationBillId"] = "voucher_bill_id";
					
					
					var id=viewModel.mainViewModel.gridData.getFocusIndex();
					var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					voucherOptions["id"] =rowData.id;
				}
				
				
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
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+2)).value;
				mainOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
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
			modalMainDoneGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
                        if(status=='002'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
		        	        + '" onclick="cancelCreate(this.id)" class="iconmenu icon-revoke-generation" title="撤销生成"></a></div>';
					}
			};
			
			//（生成）主单上的操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
		        	        + '" onclick="createBill(this.id)" class="iconmenu icon-generate" title="生成"></a></div>';
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
								}else if (view.orders == '3') {
									viewModel.mainDoneViewId=view.viewid;
									mainDoneOptions["tableViewId"] = view.viewid;
									mainDoneOptions["queryViewId"] = viewModel.QueryViewId;
									mainDoneOptions["isSetValue"] = "false";
									mainDoneOptions["isDetailQuery"] = "false";  //是否查询明细
									mainDoneOptions["queryTable"] = EBankConstant.PayTables.EBANK_AGENT_BILL;
									mainDoneOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									mainDoneOptions["isWorkFlowRelated"] = "true";
									mainDoneOptions["relationBillId"] = "agent_bill_id";
									
									//viewModel.getQueryView();
									mainDoneOptions["pageInfo"] = "10,0";
									mainDoneOptions["finance_code"] ="000000";
									mainDoneOptions["set_year"] =mainOptions["svSetYear"];
									viewModel.mainDoneViewModel = ip.initGrid(view, 'modalMainDoneGridArea', queryURL+"/doFind.do", mainDoneOptions, 0, true);
									document.getElementById("mianDoneDiv").style.display="none";
	
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
			        		document.getElementById("create").style.display = "";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("cancelCreate").style.display = "none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("create").style.display = "none";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("cancelCreate").style.display = "";
						} else if(status==EBankConstant.WfStatus.UNAUDIT_004) {
							document.getElementById("create").style.display = "";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("cancelCreate").style.display = "none";
						} 
					}else{
						document.getElementById("view").style.display = "";
						document.getElementById("create").style.display = "none";
		        		document.getElementById("cancelCreate").style.display = "none";
					}
		        	
		       
			}
			
			
			//操作按钮的显示
			fList_show = function() {
				var status = $("#pz_status option:selected").val();

						if (status==EBankConstant.WfStatus.TODO_001) {
							document.getElementById("mianDiv").style.display="";
							document.getElementById("mianDoneDiv").style.display="none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("mianDiv").style.display="none";
							document.getElementById("mianDoneDiv").style.display="";
						} else if(status==EBankConstant.WfStatus.UNAUDIT_004) {
							document.getElementById("mianDiv").style.display="";
							document.getElementById("mianDoneDiv").style.display="none";
						} 

		        	
		       
			}
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				//fList_show();
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				
				
				//mainOptions["condition"]=ip.getAreaData(viewModel.planSearchViewModel);
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+2)).value;
				var payMoney = document.getElementById("pay_money"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["condition"]='1=1 ';
				mainDoneOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
					mainDoneOptions["condition"]=mainDoneOptions["condition"]+"and bill_no='"+billNO+"'";
				}
				if(startTime!=null&&startTime!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and create_date>='"+startTime+"'";
					mainDoneOptions["condition"]=mainDoneOptions["condition"]+"and create_date>='"+startTime+"'";
				}
				if(endTime!=null&&endTime!=''){
					endTime=dateAddOneDay(endTime);
					mainOptions["condition"]=mainOptions["condition"]+"and create_date<'"+endTime+"'";
					mainDoneOptions["condition"]=mainDoneOptions["condition"]+"and create_date<'"+endTime+"'";
				}
				if(payMoney!=null&&payMoney!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and pay_money='"+payMoney+"'";
					mainDoneOptions["condition"]=mainDoneOptions["condition"]+"and pay_money='"+payMoney+"'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
				
				mainDoneOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainDoneOptions["set_year"] =year;
				mainDoneOptions["status"] = status;
				mainOptions["status"] = status;
				
				if (status==EBankConstant.WfStatus.TODO_001) {
					document.getElementById("mianDiv").style.display="";
					document.getElementById("mianDoneDiv").style.display="none";
					ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				} else if(status==EBankConstant.WfStatus.AUDITED_002) {
					document.getElementById("mianDiv").style.display="none";
					document.getElementById("mianDoneDiv").style.display="";
					ip.setGrid(viewModel.mainDoneViewModel, queryURL+"/doFind.do", mainDoneOptions);
				} else if(status==EBankConstant.WfStatus.UNAUDIT_004) {
					document.getElementById("mianDiv").style.display="";
					document.getElementById("mianDoneDiv").style.display="none";
					ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				} 
				
				
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
					data : mainOptions,
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

			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
			})

		});
