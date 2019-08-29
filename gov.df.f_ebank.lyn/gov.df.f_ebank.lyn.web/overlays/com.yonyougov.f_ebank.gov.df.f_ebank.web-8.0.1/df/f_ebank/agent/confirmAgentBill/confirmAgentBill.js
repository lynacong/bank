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

			var viewModel = {
				tokenid : ip.getTokenId(),
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
					temp["set_year"]= payData.set_year;
					temp["bill_no"] = payData.bill_no;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','bill_no','set_year','finance_code' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			
			//确认
			confirmBill=function(id){
				if(requesting==true){
					return;
				}
				requesting=true;
				var billIdsAndFinanceCode = buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doConfirmAgentBill+"?tokenid="
								+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.flag=='1'){
							ip.warnJumpMsg("确认成功",0,0,true);	
						}else{
							ip.warnJumpMsg("确认失败,"+data.result,0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			};
			
			//撤销确认
			cancelConfirmBill=function(id){
				if(requesting==true){
					return;
				}
				requesting=true;
				var billIdsAndFinanceCode = buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCancelConfirmAgentBill+"?tokenid="
								+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.flag=='1'){
							ip.warnJumpMsg("撤销确认成功",0,0,true);	
						}else{
							ip.warnJumpMsg("撤销确认失败,"+data.result,0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			};
			
			
			//查询
			viewModel.fSelect=function(){
				fGetGrid();
				/*fsc_show();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);*/
			};
			
			
			
			//点击主单查询明细
			getDetail=function(){
				var id=viewModel.mainViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["id"] =rowData.id;
				voucherOptions["finance_code"] =mainOptions["finance_code"];
				voucherOptions["set_year"] =mainOptions["set_year"];
				ip.setGrid(viewModel.voucherGridViewModel, queryURL+"/doFind.do", voucherOptions);
			};
			
			viewModel.getQueryView = function() {
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				var pay_money=document.getElementById("pay_money" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！", 0, 0, true);
					return;
				}
				//mainOptions["condition"]=ip.getAreaData(viewModel.planSearchViewModel);
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
				}
				if(pay_money!=null&&pay_money!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and pay_money='"+pay_money+"'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			};
			
			
			//主单上的操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
		        	if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
						+ '" onclick="confirmBill(this.id)" class="iconmenu icon-confirms" title="确认"></a></div>';
					}else{
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="cancelConfirmBill(this.id)" class="iconmenu icon-back-prev" title="撤销确认"></a></div>';
					};
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
									mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_AGENT_BILL;
									mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									mainOptions["isWorkFlowRelated"] = "true";
									mainOptions["relationBillId"] = "agent_bill_id";
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
									voucherOptions["relationBillId"] = "agent_bill_id";
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
			        		document.getElementById("confirm").style.display = "";
			        		document.getElementById("cancelConfirm").style.display = "none";
			        		document.getElementById("view").style.display = "";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("confirm").style.display = "none";
							document.getElementById("cancelConfirm").style.display = "";
			        		document.getElementById("view").style.display = "";
						} 
					}else{
						document.getElementById("confirm").style.display = "none";
		        		document.getElementById("cancelConfirm").style.display = "none";
					}
			};
			
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				var pay_money=document.getElementById("pay_money" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);	
					return;
				}
				
				
				//mainOptions["condition"]=ip.getAreaData(viewModel.planSearchViewModel);
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				
				mainOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
				}
				if(pay_money!=null&&pay_money!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and pay_money like '%"+pay_money+"%'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
				mainOptions["status"] = status;
			
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			};
			
			// 凭证查看
			doVoucherSee = function(id, evt) {
				var e = evt || window.event;
				//$('#planCheckModalDetail').modal('show');
				var billIds = buildBillIdsAndFinanceCode(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					return;
				}
				doAsspVoucherSee(billIds,evt,vtCode);
				window.event ? e.cancelBubble = true : e.stopPropagation();
			};
			
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
				});

			};
			
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
				});

			};

			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				});
				viewModel.initData();
			});

		});
