require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {

			var requesting=false;
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			mainOptions["operate_width"] =80;
			// var tokenid = ip.getTokenId();
			var gStatus = 0;// 0查询，1新增，2更新
			
			var isInitDoulist = 0;
			
			var vtCode=ip.getUrlParameter("vt_code");
			var oriCode=ip.getUrlParameter("ori_code");
			var viewModel = {
				tokenid : ip.getTokenId()
			};

			viewModel.fsetStatus = function(status) {
				gStatus = status;
				if (gStatus == 0) {
				}
			}

			doCreateBill = function(id) {
				if(requesting){
					return;
				}
				requesting=true;
				var billNosAndRgCode =  buildVoucherNosAndFinanceCode(id);
				if(billNosAndRgCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false; 
					return false;
				}
				
				var optionsParam = ip.getCommonOptions({});
				optionsParam["setYear"]=document.getElementById("set_year").value;
				optionsParam["vtCode"]=vtCode;
				optionsParam["billnosAndFinanceCode"]=JSON.stringify(billNosAndRgCode);
				optionsParam["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCreateBill+"?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsParam,
					success : function(data){
						if(data.flag=="0"){
							fGetGrid();
							ip.warnJumpMsg(data.result, 0, 0, true);
							requesting=false; 
						}else{
							fGetGrid();
							ip.warnJumpMsg("生成成功", 0, 0, true);
							requesting=false; 
						}
					}
				});
			}
			
			//构建传入后台的billNos
			buildVoucherNosAndFinanceCode = function(id){
				var billnosAndRgCode = new Array();
				if(id!=null && id!=undefined && (id+" ").trim().length > 0){//id不为空
					billnosAndRgCode = [];
					var planData = $('#' + viewModel.voucherViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["voucher_no"] = planData.voucher_no;
					temp["finance_code"] = planData.finance_code;
					billnosAndRgCode.push(temp);
				}else{//id为空
					billnosAndRgCode = viewModel.voucherGridViewModel.gridData.getSimpleData({  
						type : 'select',
						fields : [ 'voucher_no','finance_code' ],
					});
				}
				return billnosAndRgCode;
			};
			viewModel.fSelect = function(status) {
				fGetGrid();
			}
			doCancelCreateBill = function(id) {
				if(requesting){
					return;
				}
				requesting=true; 
				var billNosAndRgCode =  buildBillNosAndRgCode(id);
				if(billNosAndRgCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false; 
					return false;
				}
				
				var optionsParam = ip.getCommonOptions({});
				optionsParam["setYear"]=document.getElementById("set_year").value;
				optionsParam["vtCode"]=vtCode;
				optionsParam["oriCode"]=oriCode;
				optionsParam["billnosAndFinanceCode"]=JSON.stringify(billNosAndRgCode);
				optionsParam["ajax"]="nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCancelCreateBill+"?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsParam,
					success : function(data){
						if(data.flag=="0"){
							fGetGrid();
							ip.warnJumpMsg(data.result, 0, 0, true);
							requesting=false; 
						}else{
							fGetGrid();
							ip.warnJumpMsg("撤销生成成功", 0, 0, true);
							requesting=false;
						}
					}
				});
			
			}
			
			
			//构建传入后台的billNos
			buildBillNosAndRgCode = function(id){
				var billnosAndRgCode = new Array();
				if(id!=null && id!=undefined && (id+" ").trim().length > 0){//id不为空
					billnosAndRgCode = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["bill_no"] = planData.bill_no;
					temp["finance_code"] = planData.finance_code;
					billnosAndRgCode.push(temp);
				}else{//id为空
					billnosAndRgCode = viewModel.mainGridViewModel.gridData.getSimpleData({  
						type : 'select',
						fields : [ 'bill_no','finance_code' ],
					});
				}
				return billnosAndRgCode;
			};

			fsc_show = function() {

				var sc_status = document.getElementById("sc_status")[0].selected;// 选择未生成
				if (sc_status) {
					document.getElementById("sc").style.display = "";
					document.getElementById("cxsc").style.display = "none";

					document.getElementById("lb_mian").innerText = "额度明细：";
					document.getElementById("detail").style.display = "none";
					document.getElementById("mianDiv").style.display = "none";
					document.getElementById("voucher_no_name").style.display = "none";
					document.getElementById("voucher_no").style.display = "none";
					document.getElementById("plan_voucher_no_name").style.display = "";
					document.getElementById("plan_voucher_no").style.display = "";

				} else {
					document.getElementById("sc").style.display = "none";
					document.getElementById("cxsc").style.display = "";
					document.getElementById("lb_mian").innerText = "额度到账通知书：";
					document.getElementById("mianDiv").style.display = "";
					document.getElementById("detail").style.display = "";
					document.getElementById("voucher_no_name").style.display = "";
					document.getElementById("voucher_no").style.display = "";
					document.getElementById("plan_voucher_no_name").style.display = "none";
					document.getElementById("plan_voucher_no").style.display = "none";

				}
			}

			fGetGrid = function() {
				fsc_show();
				var sc_status = document.getElementById("sc_status")[0].selected;// 选择未生成
				if (sc_status) {

						viewModel.voucherGridViewModel.gridData.clear();
						viewModel.voucherGridViewModel.gridData.totalRow(0);
						viewModel.getSubsysData();

					
				} else {

						if(isInitDoulist==1){
							viewModel.mainGridViewModel.gridData.clear();
							viewModel.mainGridViewModel.gridData.totalRow(0);
						}
						viewModel.getMainData();
						viewModel.voucherGridViewModel.gridData.clear();
						viewModel.voucherGridViewModel.gridData.totalRow(0);
					
					
					
					//viewModel.subsysGridViewModel.gridData.clear();
				}
			}
			fGridOndblclick = function() {
				viewModel.fEditRec();
			}
			
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
						+ '" onclick="doCancelCreateBill(this.id)" class="iconmenu icon-back-prev" title="撤销生成"></a><div>';
			};

			modalSubsysGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
						+ '" onclick="doSubsysBuild(this.id)" class="iconmenu icon-edit" title="生成"></a><div>';
			};


			doMainPrev = function(id) {
				ip.ipInfoJump("正在撤销生成：" + id ,
				"success");
			}
			
			//查找明细
			getVoucher=function(){
				var id=viewModel.mainGridViewModel.gridData.getFocusIndex();
				doMainDetail(id);
			}

			doMainDetail = function(id) {
				//获取选中行的数据
				var rowData = $(
						'#' + viewModel.mainViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["id"] =rowData.id;
				var status = document.getElementById("sc_status").value;
				if(status=='1'){
					voucherOptions["status"] = EBankConstant.WfStatus.TODO_001;
				}else{
					voucherOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
					
				}
				ip.setGrid(viewModel.voucherGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", voucherOptions);

			}
			
			doSubsysBuild = function(id) {
				var rowData = $(
						'#' + viewModel.subsysViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				
				ip.ipInfoJump("正在生成：" + id + "_" + rowData.plan_money,
				"success");

			}


			viewModel.initData = function() {
				$.ajax({
					url : "/df/init/initMsg.do",
					type : "GET",
					dataType : "json",
					async : true,
					data : ip.getCommonOptions({}),
					success : function(datas) {
						viewModel.viewList = datas.viewlist;// 视图信息
						viewModel.resList = datas.reslist;// 资源信息
						var status=document.getElementById("sc_status").value;
						if(status=='1'){//未生成状态下只有明细列表
							for ( var n = 0; n < viewModel.viewList.length; n++) {
								var view = viewModel.viewList[n];
								if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {// 列表视图

									 if (view.orders == "2") {
										viewModel.voucherViewId = view.viewid;
										voucherOptions["tableViewId"] = view.viewid;
										voucherOptions["isSetValue"] = "false";
										voucherOptions["isDetailQuery"] = "true";  //是否查询明细
										voucherOptions["finance_code"] = document.getElementById("finance_code").value;
										voucherOptions["set_year"] = voucherOptions["svSetYear"];
										voucherOptions["set_month"] = document.getElementById("set_month").value;
										voucherOptions["queryTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
										voucherOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
										voucherOptions["isWorkFlowRelated"] = "true";
										voucherOptions["relationBillId"] = "agenten_bill_id";
										voucherOptions["pageInfo"] = "10,0";
										if(status=='1'){
											voucherOptions["status"] = EBankConstant.WfStatus.TODO_001;
										}else{
											voucherOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
											
										}
										viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', EBankConstant.CommonUrl.query+"/doFind.do", voucherOptions, 1, false);
									}

								} else if (view.viewtype == '003') {// 查询视图
									// planQueryViewId = view.viewid;
									// viewModel.planSearchViewModel =
									// ip.initArea(view.viewDetail, "search",
									// view.viewid.substring(1, 37),
									// "planSearchArea");
								}

							}	
						}
						
						// viewModel.getSubsysData();

					}
				});
			};

			
			viewModel.initDoubleListData = function() {

				        isInitDoulist=1;
						var status=document.getElementById("sc_status").value;
						if(status=='2'){
							for ( var n = 0; n < viewModel.viewList.length; n++) {
								var view = viewModel.viewList[n];
								if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {// 列表视图

									// planViewId = view.viewid;
									if (view.orders == "1") {
										viewModel.mainViewId = view.viewid;										
										mainOptions["tableViewId"] = view.viewid;
										mainOptions["isSetValue"] = "false";
										mainOptions["isDetailQuery"] = "false";  //是否查询明细       
										mainOptions["finance_code"] = document.getElementById("finance_code").value;
										mainOptions["set_year"] = mainOptions["svSetYear"];
										mainOptions["queryTable"] = EBankConstant.PlanTables.PLAN_AGENTEN_BILL;
										mainOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
										mainOptions["isWorkFlowRelated"] = "true";
										mainOptions["relationBillId"] = "agenten_bill_id";
										if(status=='1'){
											mainOptions["status"] = EBankConstant.WfStatus.TODO_001;
										}else{
											mainOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
											
										}
										viewModel.mainGridViewModel = ip.initGrid(view, 'modalMainGridArea', EBankConstant.CommonUrl.query+"/doFind.do", mainOptions, 1, true);
										
									}

								} else if (view.viewtype == '003') {// 查询视图
									// planQueryViewId = view.viewid;
									// viewModel.planSearchViewModel =
									// ip.initArea(view.viewDetail, "search",
									// view.viewid.substring(1, 37),
									// "planSearchArea");
								}

							}
						}
							
		
						
						// viewModel.getSubsysData();

				
			};
			
			viewModel.getSubsysData = function(agenten_bill_id) {
				voucherOptions["sc_status"] = document.getElementById("sc_status").value;
				voucherOptions["finance_code"] = document.getElementById("finance_code").value;
				voucherOptions["set_year"] = document.getElementById("set_year").value;
				voucherOptions["agenten_bill_id"] = agenten_bill_id;
				voucherOptions["isDetailQuery"] = "true";  //是否查询明细
				voucherOptions["id"] =null;
				var voucherNo = document.getElementById("plan_voucher_no").value;
				if(document.getElementById("set_month").value=="0"){
					voucherOptions["condition"]="";
					if(voucherNo!=null&&voucherNo!=""){
						voucherOptions["condition"]=voucherOptions["condition"]+" voucher_no like'%"+voucherNo+"%'";	
					}
				}
				else{
					voucherOptions["condition"]="set_month = '"+ document.getElementById("set_month").value+"'";
					if(voucherNo!=null&&voucherNo!=""){
						voucherOptions["condition"]=voucherOptions["condition"]+" and voucher_no like'%"+voucherNo+"%'";	
					}

				}
				
			
				var status = document.getElementById("sc_status").value;
				if(status=='1'){
					voucherOptions["status"] = EBankConstant.WfStatus.TODO_001;
				}else{
					voucherOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
					
				}
				// options["pageInfo"] = "20,0,";
				ip.setGrid(viewModel.voucherGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", voucherOptions);
			}

			viewModel.getMainData = function() {
				
				var sc_status = document.getElementById("sc_status").value;
				if (sc_status == "2") {
					if(isInitDoulist==0)
						viewModel.initDoubleListData();
					else{
						var billNo = document.getElementById("voucher_no").value;
						mainOptions["sc_status"] = document.getElementById("sc_status").value;
						mainOptions["finance_code"] = document.getElementById("finance_code").value;
						mainOptions["set_year"] = document.getElementById("set_year").value;
						mainOptions["bill_no"] = document.getElementById("voucher_no").value;
						mainOptions["isDetailQuery"] = "false";  //是否查询明细
						if(document.getElementById("set_month").value=="0"){
							mainOptions["condition"]="";
							if(billNo!=null&&billNo!=""){
								mainOptions["condition"]=mainOptions["condition"]+" bill_no like'%"+billNo+"%'";	
							}
						}
						else{
							mainOptions["condition"]="set_month = '"+ document.getElementById("set_month").value+"'";
							if(billNo!=null&&billNo!=""){
								mainOptions["condition"]=mainOptions["condition"]+" and bill_no like'%"+billNo+"%'";	
							}
						}
						//mainOptions["pageInfo"] = "20,0,";
						ip.setGrid(viewModel.mainGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", mainOptions);
					}
					
				}
			}
			
			
			//财政机构变化
			orgChange= function() {
				fGetGrid();
			};
			
			//年度变化
			yearChange= function() {
				fGetGrid();
			};
			
			//月份改变事件
			monthChange= function() {
				fGetGrid();
			};

			//财政机构初始化
			viewModel.initOrg= function() {
				$.ajax({
					url :  EBankConstant.CommonUrl.getFinanceData+"?tokenid="
							+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : mainOptions,
					async:false,
					success : function(datas) {
						if (datas.errorCode == "0") {
							for ( var i = 0; i < datas.dataDetail.length; i++) {
								var x = document
										.getElementById("finance_code");
								var option = document
										.createElement("option");
								option.text = datas.dataDetail[i].chr_name;
								option.value = datas.dataDetail[i].chr_code;

								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						} else {
							ip.ipInfoJump("加载Combo失败！原因："
									+ datas.result, "error");
						}
					}
				})
			}
			
			//年度的初始化
			viewModel.initYear = function() {
				$
						.ajax({
							url : EBankConstant.CommonUrl.getEnabledYearData+"?tokenid="
								+ viewModel.tokenid,
							type : "GET",
							dataType : "json",
							data : {
								"ajax" : "nocache"
							},
							success : function(datas) {
								if (datas.errorCode == "0") {
									for ( var i = 0; i < datas.setYear.length; i++) {
										var x = document
												.getElementById("set_year");
										var option = document
												.createElement("option");
										x.disabled="false";
										option.value = datas.setYear[i].set_year;
										option.text = datas.setYear[i].year_name;

										try {
											// 对于更早的版本IE8
											x.add(option, x.options[null]);
										} catch (e) {
											x.add(option, null);
										}
									}
									
								} else {
									ip.ipInfoJump("加载参数失败！原因：" + datas.result,
											"error");
								}
							}
						})
			}

			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				fsc_show();
				
				viewModel.initOrg();
				viewModel.initYear();
				viewModel.initData();
				//fGetGrid();
				// viewModel.fsetStatus(0);

			})

		});
