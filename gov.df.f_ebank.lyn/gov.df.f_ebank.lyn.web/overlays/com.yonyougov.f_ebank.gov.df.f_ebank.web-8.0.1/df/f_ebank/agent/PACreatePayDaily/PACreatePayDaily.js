require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;
			
			var mainOptions = ip.getCommonOptions({});
			var options = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			var vtCode=ip.getUrlParameter("vt_code");
			var oriCode=ip.getUrlParameter("ori_code");
			mainOptions["operate_width"] =50;
			options["operate_width"] =50;

			var viewModel = {
				tokenid : ip.getTokenId(),
			};
			
			//构建生成日报单时传到后台的billNos
			buildBillNosAndFinanceCode = function(id){
				var billNosAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billNosAndFinanceCode = [];
					var payData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["finance_code"] = payData.finance_code;
					temp["bill_no"] = payData.bill_no;
					billNosAndFinanceCode.push(temp);
				} else {//id为空
					billNosAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : ['bill_no','finance_code' ]
					});
				}
				return	billNosAndFinanceCode;
			};
			
			//生成日报单
			doCreateDayBill = function(id) {
				if(requesting){
					return;
				}
				requesting=true;
				var billNosAndFinanceCode = buildBillNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["vtCode"]=vtCode;
				mainOptions["oriCode"]=oriCode;
				mainOptions["setYear"]=mainOptions["set_year"];
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCreateBillByBillNos+"?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.flag=='1'){
							ip.warnJumpMsg("生成成功",0,0,true);	
						}else{
							ip.warnJumpMsg(data.result,0,0,true);	
						}
							fSelect();		
							requesting=false;
					}
				});
			}
			
			//构建撤销生成日报单时传到后台的billNos
			buildNosAndFinanceCode = function(id){
				var billNosAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billNosAndFinanceCode = [];
					var payData = $('#' + options["tableViewId"].substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["finance_code"] = payData.finance_code;
					temp["bill_no"] = payData.bill_no;
					billNosAndFinanceCode.push(temp);
				} else {//id为空
					billNosAndFinanceCode = viewModel.mainGridModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : ['bill_no','finance_code' ]
					});
				}
				return	billNosAndFinanceCode;
			};
			
			//撤销生成
			doCancelCreateDayBill = function(id) {
				if(requesting){
					return;
				}
				requesting=true; 
				var billNosAndFinanceCode =  buildNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false; 
					return false;
				}
				
				var optionsParam = ip.getCommonOptions({});
				options["setYear"]=options["set_year"];
				options["vtCode"]=vtCode;
				options["oriCode"]=oriCode;
				options["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				options["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCancelCreateBill+"?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : options,
					success : function(data){
						if(data.flag=="0"){
							ip.warnJumpMsg(data.result, 0, 0, true);
						}else{
							ip.warnJumpMsg("撤销生成成功", 0, 0, true);
						}
						fSelect();		
						requesting=false;
					}
				});
			}
			
			//查询
			fSelect=function(){
				fsc_show();
				viewModel.getQueryView();
				var status = $("#pz_status option:selected").val();
				if(status==EBankConstant.WfStatus.AUDITED_002){
					ip.setGrid(viewModel.mainGridModel, queryURL+"/doFind.do", options);
					viewModel.voucherGridViewModel.gridData.clear();
					viewModel.voucherGridViewModel.gridData.totalRow(0);
				}else{
					ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				}
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			
			//打印
			doPrint = function() {
				if(requesting){
					return;
				}
				requesting=true;
				ip.warnJumpMsg("打印功能暂不开放！！！",0,0,true);
				requesting=false;
				
			}
			
			//操作按钮的显示
			fsc_show = function() {
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
					var d = new Date();
					if(year==d.getFullYear()){
						if (status==EBankConstant.WfStatus.TODO_001) {
			        		document.getElementById("creat").style.display = "";
			        		document.getElementById("cancelCreat").style.display = "none";
			        		//document.getElementById("print").style.display = "none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("creat").style.display = "none";
							//document.getElementById("print").style.display = "";
			        		document.getElementById("cancelCreat").style.display = "";
						} 
					}else{
						if (status==EBankConstant.WfStatus.TODO_001) {
			        		document.getElementById("creat").style.display = "none";
			        		document.getElementById("cancelCreat").style.display = "none";
			        		//document.getElementById("print").style.display = "none";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("creat").style.display = "none";
							//document.getElementById("print").style.display = "";
			        		document.getElementById("cancelCreat").style.display = "none";
						}
					}
			}
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				var status = $("#pz_status option:selected").val();
				if(status==EBankConstant.WfStatus.AUDITED_002){
					document.getElementById("mainLable").innerText = "日报单：";
					document.getElementById("mianDiv1").style.display = "";
	        		document.getElementById("mianDiv").style.display = "none";
					options["status"] = status;
					viewModel.getQueryView();
					ip.setGrid(viewModel.mainGridModel, queryURL+"/doFind.do", options);
				}else{
					document.getElementById("mainLable").innerText = "支付凭证：";
					document.getElementById("mianDiv").style.display = "";
	        		document.getElementById("mianDiv1").style.display = "none";
					mainOptions["status"] = status;
					viewModel.getQueryView();
					ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				}
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			
			//点击主单查询明细
			getDetail=function(){
				var status = $("#pz_status option:selected").val();
				if(status==EBankConstant.WfStatus.AUDITED_002){
					voucherOptions["relationBillId"] = "day_bill_id";
					var id=viewModel.mainGridModel.gridData.getFocusIndex();
					var rowData = $('#' + options["tableViewId"].substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					voucherOptions["id"] =rowData.id;
					voucherOptions["finance_code"] =options["finance_code"];
					voucherOptions["set_year"] =options["set_year"];
				}else{
					voucherOptions["relationBillId"]=relationBillId="voucher_bill_id";
					var id=viewModel.mainViewModel.gridData.getFocusIndex();
					var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					voucherOptions["id"] =rowData.id;
					voucherOptions["finance_code"] =mainOptions["finance_code"];
					voucherOptions["set_year"] =mainOptions["set_year"];
				}
				ip.setGrid(viewModel.voucherGridViewModel, queryURL+"/doFind.do", voucherOptions);
			}
			
			//查询区条件
			viewModel.getQueryView = function() {
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var payMoney = document.getElementById("pay_money"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+2)).value;
				mainOptions["condition"]="1=1 ";
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
				if(payMoney!=null&&payMoney!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and pay_money='"+payMoney+"'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
				options["set_year"] =year;
				options["condition"]=mainOptions["condition"];
			}
			
			
			//主单上的操作（未生成）
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
						obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
	        	            + '" onclick="doCreateDayBill(this.id)" class="iconmenu icon-generate" title="生成日报单"></a></div>';
			};
			//主单上的操作（已生成）
			modalMainGridArea1 = function(obj) {
				obj.element.style["text-align"]="center";
						obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
	        	            + '" onclick="doCancelCreateDayBill(this.id)" class="iconmenu icon-back-prev" title="撤销生成"></a></div>';
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
						var status=$("#pz_status option:selected").val();
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId=view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									mainOptions["queryViewId"] = viewModel.planQueryViewId;
									viewModel.mainViewModel = ip.initGrid(view, 'modalMainGridArea', queryURL+"/doFind.do", mainOptions, 0, true);
									mainOptions["isDetailQuery"] = "false";  //是否查询明细
									mainOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
									mainOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									mainOptions["isWorkFlowRelated"] = "true";
									mainOptions["relationBillId"] = "voucher_bill_id";
									mainOptions["status"] = status;
									mainOptions["set_year"] = mainOptions["svSetYear"];
									mainOptions["finance_code"] = "000000";
									mainOptions["pageInfo"] = "10,0";
									ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
									
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["isWorkFlowRelated"] = "false";
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] = voucherOptions["svSetYear"];
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', queryURL+"/doFind.do", voucherOptions, 0, false);
								}else if (view.orders == '3') {
									options["tableViewId"] = view.viewid;
									//ptions["queryViewId"] = viewModel.planQueryViewId;
									options["isDetailQuery"] = "false";  //是否查询明细
									options["queryTable"] = EBankConstant.PayTables.EBANK_DAY_BILL;
									options["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									options["isWorkFlowRelated"] = "true";
									options["relationBillId"] = "day_bill_id";
									options["status"] = status;
									options["set_year"] = options["svSetYear"];
									options["finance_code"] = "000000";
									options["pageInfo"] = "10,0";
									viewModel.mainGridModel = ip.initGrid(view, 'modalMainGridArea1', queryURL+"/doFind.do", options, 0, true);
								}

							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
								viewModel.planQueryViewId = view.viewid;
								viewModel.planSearchViewModel = ip
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
				});
			};
			
			//查询区的财政机构
			viewModel.getFinanceCode = function() {
				$.ajax({
					url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : mainOptions,
					success : function(datas) {
						if (datas.errorCode == "0") {
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code"
										+ "-"
										+ viewModel.planQueryViewId.substring(
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
									+ viewModel.planQueryViewId.substring(
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
