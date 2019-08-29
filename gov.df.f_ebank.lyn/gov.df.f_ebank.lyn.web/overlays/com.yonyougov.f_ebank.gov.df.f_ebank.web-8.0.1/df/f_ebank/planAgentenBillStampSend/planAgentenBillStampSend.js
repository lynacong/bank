require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;

			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var baseURL = EBankConstant.Ctx + "billStampSend";

			var viewModel = {
				tokenid : ip.getTokenId()
			};
			var vtCode=ip.getUrlParameter("vt_code");
			mainOptions["operate_width"] =80;
			//构建传到后台的billNos
			buildBillNosAndFinanceCode = function(id){
				var billnosAndRgCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billnosAndRgCode = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["bill_no"] = planData.bill_no;
					temp["finance_code"] = planData.finance_code;
					billnosAndRgCode.push(temp);
				} else {//id为空
					billnosAndRgCode = viewModel.gridViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'bill_no','finance_code' ]
					});
				}
				return	billnosAndRgCode;
			};


			//签章发送
			signSend = function(id) {
				if(requesting){
					return;
				}
				requesting=true;
				var billnosAndFinanceCode=buildBillNosAndFinanceCode(id);
				if(billnosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				} 
				mainOptions["setYear"]=  $("#set_year").val();
				mainOptions["vtCode"]=vtCode;
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billnosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doSignSend.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.is_success=="0"){
							viewModel.fSelect();
							ip.warnJumpMsg(data.error_msg,0,0,true);
						}else{
							viewModel.fSelect();
							ip.warnJumpMsg("签章发送成功",0,0,true); 
						}
						requesting=false;
					}
				});
			}
			//刷新按钮
			viewModel.ref = function() {
				$("#bill_no").val("");
				mainOptions["condition"]='';
				ip.setGrid(viewModel.gridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", mainOptions);
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			//查询按钮
			viewModel.fSelect = function() {
				getMainData();
			}
			//重新发送
			againSend = function(id) {
				if(requesting){
					return;
				}
				requesting=true;
				var billnosAndFinanceCode=buildBillNosAndFinanceCode(id);
				if(billnosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				} 
				mainOptions["setYear"]=document.getElementById("set_year").value;
				mainOptions["vtCode"]=vtCode;
				mainOptions["billnosAndFinanceCode"]=JSON.stringify(billnosAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doAgainSend.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data : mainOptions,
					success : function(data) {
						if(data.is_success=="0"){
							viewModel.fSelect();
							ip.warnJumpMsg(data.error_msg,0,0,true);
						}else{
							viewModel.fSelect();
							ip.warnJumpMsg("重新发送成功",0,0,true);
						}
						requesting=false;
					}
				});
			}
			
			fsc_show = function() {
				var sc_status = document.getElementById("sc_status")[0].selected;// 选择未生成
				d = new Date();
		        if(document.getElementById("set_year").value==d.getFullYear()){
		        	if (sc_status) {
						document.getElementById("qzfs").style.display = "";
						document.getElementById("cfs").style.display = "none";
						document.getElementById("asspview").style.display = "none";
					} else {
						document.getElementById("qzfs").style.display = "none";
						document.getElementById("cfs").style.display = "";
						document.getElementById("asspview").style.display = "";
					}
		        }else{
		        	document.getElementById("qzfs").style.display = "none";
					document.getElementById("cfs").style.display = "none";
					document.getElementById("asspview").style.display = "none";
		        }
			}
			
			//额度到账通知单状态改变事件
			fGetGrid = function() {
				fsc_show();
				var status=document.getElementById("sc_status").value;
				if(status=='1'){
					mainOptions["status"] = EBankConstant.WfStatus.TODO_001;
					voucherOptions["status"] = EBankConstant.WfStatus.TODO_001;
				}else{
					mainOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
					voucherOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
				}
				ip.setGrid(viewModel.gridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", mainOptions);
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			}
			
			//年度状态改变事件
			yearChange= function() {
				mainOptions["set_year"] = document.getElementById("set_year").value;
				voucherOptions["set_year"] = document.getElementById("set_year").value;
				getMainData();
			}
			
			//财政机构改变事件
			orgChange= function() {
				var financeCode=document.getElementById("finance_code").value;
				mainOptions["finance_code"] = financeCode;
				voucherOptions["finance_code"] = financeCode;
				getMainData();
			}
			
			//月份改变事件
			monthChange= function() {
				getMainData();
			}
			
			
			
			
			getMainData = function() {
				var status=document.getElementById("sc_status").value;
				if(status=='1'){
					mainOptions["status"] = EBankConstant.WfStatus.TODO_001;
				}else{
					mainOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
					
				}
				mainOptions["finance_code"] = document.getElementById("finance_code").value;
				mainOptions["set_year"] = document.getElementById("set_year").value;
	            var billNo = $("#bill_no").val();
				if(document.getElementById("set_month").value=="0"){
					
				    if(billNo==null||billNo=="")
				    	mainOptions["condition"]="";
				    else{
				    	mainOptions["condition"] = " bill_no like'%"+$("#bill_no").val()+"%'";	
				    }	
				}else{
					mainOptions["condition"]="set_month = '"+ document.getElementById("set_month").value+"'";
					if(billNo!=null&&billNo!=""){
						mainOptions["condition"]=mainOptions["condition"]+" and bill_no like'%"+$("#bill_no").val()+"%'";	
					}
				}
						//mainOptions["pageInfo"] = "20,0,";
				    viewModel.gridViewModel.gridData.clear();
				    viewModel.gridViewModel.gridData.totalRow(0);
					ip.setGrid(viewModel.gridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", mainOptions);
					viewModel.voucherGridViewModel.gridData.clear();
					viewModel.voucherGridViewModel.gridData.totalRow(0);
					
			}
			
			
			//主单上的操作
			modalMianGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status=document.getElementById("sc_status").value;
				d = new Date();
		        if(document.getElementById("set_year").value==d.getFullYear()){
		        	if(status=='1'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="signSend(this.id)" class="iconmenu icon-sign-send" title="签章发送"></a><div>';
					}else{
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="againSend(this.id)" class="iconmenu icon-send-again" title="重新发送"></a><a id="'
							+ obj.rowIndex
							+ '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}
		        }
			};
			
			//查找明细
			doMianDetail = function(id) {
				//获取选中行的数据
				var rowData = $(
						'#' + viewModel.mainViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["id"] =rowData.id;
				ip.setGrid(viewModel.voucherGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", voucherOptions);

			}
			//查找明细
			getVoucher=function(){
				var id=viewModel.gridViewModel.gridData.getFocusIndex();
				doMianDetail(id);
			}

			// var menuid = 'A525A6D957600BCEB0B20BD361334DA3';// 从上下文中取菜单id
			// var roleid = '{2439FB6D-43C6-11E0-9C67-9D4F3182A2BD}';//
			// 从上下文中取角色id
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

						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							var status=document.getElementById("sc_status").value;
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId = view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									mainOptions["isSetValue"] = "false";
									mainOptions["isDetailQuery"] = "false";  //是否查询明细
									mainOptions["finance_code"] = document.getElementById("finance_code").value;
									mainOptions["set_year"] = document.getElementById("set_year").value;
									mainOptions["queryTable"] = EBankConstant.PlanTables.PLAN_AGENTEN_BILL;
									mainOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
									mainOptions["isWorkFlowRelated"] = "true";
									mainOptions["relationBillId"] = "agenten_bill_id";
									if(status=='1'){
										mainOptions["status"] = EBankConstant.WfStatus.TODO_001;
									}else{
										mainOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
										
									}
									if(document.getElementById("set_month").value=="0")
										mainOptions["condition"]="";
									else{
										mainOptions["condition"]="set_month = '"+ document.getElementById("set_month").value+"'";
									}
									viewModel.gridViewModel = ip.initGrid(view, 'modalMianGridArea', EBankConstant.CommonUrl.query+"/doFind.do", mainOptions, 1, true);
									
								} else if (view.orders == '2') {
									viewModel.voucherViewId = view.viewid;
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isSetValue"] = "false";
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["finance_code"] = document.getElementById("finance_code").value;
									voucherOptions["set_year"] = document.getElementById("set_year").value;
									voucherOptions["set_month"] = document.getElementById("set_month").value;
									voucherOptions["queryTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
									voucherOptions["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
									voucherOptions["isWorkFlowRelated"] = "false";
									voucherOptions["relationBillId"] = "agenten_bill_id";
									voucherOptions["pageInfo"] = "10,0";
									if(status=='1'){
										voucherOptions["status"] = EBankConstant.WfStatus.TODO_001;
									}else{
										voucherOptions["status"] = EBankConstant.WfStatus.AUDITED_002;
										
									}
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', EBankConstant.CommonUrl.query+"/doFind.do", voucherOptions, 0, false);
								}

							}
						}
					}
				});
			};
			//财政机构初始化
			viewModel.initOrg= function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getFinanceData+"?tokenid="
							+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : mainOptions,
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
							viewModel.initParam();
						} else {
							ip.ipInfoJump("加载Combo失败！原因："
									+ datas.result, "error");
						}
					}
				})
			}
			
			//年度的初始化
			viewModel.initParam = function() {
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
									fsc_show();
									viewModel.initData();
								} else {
									ip.ipInfoJump("加载参数失败！原因：" + datas.result,
											"error");
								}
							}
						})
			}
			
			
			
			// 凭证查看
			doVoucherSee = function(id, evt) {
				var e = evt || window.event;
				$("#asspview").attr("disabled", true); 
				//$('#planCheckModalDetail').modal('show');
				var billIds = buildBillIds(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					$("#asspview").attr("disabled", false); 
					return;
				}
				doAsspVoucherSee(billIds,evt,vtCode);
				$("#asspview").attr("disabled", false); 
				window.event ? e.cancelBubble = true : e.stopPropagation();
			};
						
			//预览
			doVoucherPreview = function(id, evt) {
				var e = evt || window.event;
				//$('#planCheckModalDetail').modal('show');
				$("#asspview").attr("disabled", true); 
				var billIds = buildBillIds(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证预览",0,0,true);
					$("#asspview").attr("disabled", false); 
					return;
				}
				
				doAsspVoucherPreview(billIds,evt,vtCode);
				$("#asspview").attr("disabled", false); 
				window.event ? e.cancelBubble = true : e.stopPropagation();
			};
			
			//构建传到后台的ids
			buildBillIds = function(id){
				var billIds =new Array();
				if (strIsNotNull(id)) {//id不为空
					billIds = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var tempId = {};
					tempId["id"] = planData.id;
					tempId["finance_code"]= planData.finance_code;
					tempId["set_year"]= planData.set_year;
					tempId["bill_no"]= planData.bill_no;
					billIds.push(tempId);
				} else {//id为空
					billIds = viewModel.gridViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','set_year','bill_no' ]
					});
					
					//var planData = $('#' + options["tableViewId"].substring(1, 37) + '').parent()[0]['u-meta'].grid.getSelectRows();
				}
				return	billIds;
			};

			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initOrg();
			})

		});
