require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			var payeeMessagetemp={};
			var requesting=false;
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			var baseURL = EBankConstant.Ctx + "pay/payCommon";
			var moneyFormat = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
			mainOptions["operate_width"] =100;
			var stiff_user_code='';
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
					temp["pay_money"] = payData.pay_money;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','pay_money' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			//退款
			advance=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				needPaydata=billIdsAndFinanceCode;
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				}
				payeeMessagetemp = {};
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["dc"]="-1";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				mainOptions["payeeMessage"]=JSON.stringify(payeeMessagetemp);
				/*if(billIdsAndFinanceCode.length>1){//判断是否有托收或者空白支票数据
					for (var i = 0; i < billIdsAndFinanceCode.length; i++) {

						
						//产品不需要指纹
						var payMoney = billIdsAndFinanceCode[i].pay_money;
						var payMoneyFloat = parseFloat(payMoney);
						if(payMoneyFloat<-50000){//大金额数据
							$("#userCodeInput").modal("show");
							//alert("凭证号："+billIdsAndFinanceCode[i].bill_no+"支付金额为"+payMoneyFloat+"大于50000请单笔支付，并进行指纹验证");
							requesting=false;
							return;
						}
					}
				}*/
				/*if(billIdsAndFinanceCode.length==1){//判断是否有托收或者空白支票数据，如果是的话补录收款信息
						var payMoney = billIdsAndFinanceCode[0].pay_money;						
						var payMoneyFloat = parseFloat(payMoney);
						if(payMoneyFloat<-50000){//大金额数据指纹验证
							$("#userCodeInput").modal("show");
							requesting=false;
							return;
							if(stiff_user_code==''){
								requesting=false;
								return;
							}
						   var figerMessage = GetFeature();
							if(figerMessage==''){
							requesting=false;
							return;
							}
							$.ajax({
								url : "/df/f_ebank/pay/payCommon/doFingerPay.do?tokenid="
									+ viewModel.tokenid,
								type : "GET",
								dataType : "json",
								data : {
									"ajax" : "nocache",
									"staff_num":stiff_user_code,
									"psTZ":figerMessage
								},
								async : false,
								success : function(data) {
									if(data.flag=='0'){
										ip.warnJumpMsg("指纹验证失败"+data.result,0,0,true);
										viewModel.fSelect();
										requesting=false;
										return;
									}
									
								}
							});
							
						}
				}*/
				$.ajax({
					//url : baseURL+"/doAdvance.do?tokenid="
					url : baseURL+"/doCancelAdvance.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
							viewModel.fSelect();
							ip.warnJumpMsg(data.result,0,0,true);
							requesting=false;
					}
				});
			};
			//退款状态确认
			confirmAdvance=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				} 
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["dc"]="-1";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				mainOptions["payeeMessage"]=JSON.stringify(payeeMessagetemp);
				$.ajax({
					//url : baseURL+"/doConfirmsAdvance.do?tokenid="
					url : baseURL+"/doConfirmCancelAdvance.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
							viewModel.fSelect();
							ip.warnJumpMsg(data.result,0,0,true);
							requesting=false;
					}
				});
			}
			
			//撤销退款
			cancelAdvance=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length!=1){
					ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
					requesting=false;
					return;
				} 
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["dc"]="1";
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["isRet"]="0";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					//url : baseURL+"/doCancelAdvance.do?tokenid="
					url : baseURL+"/doCancelRefund.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
							viewModel.fSelect();
							ip.warnJumpMsg(data.result,0,0,true);
							requesting=false;
					}
				});
			}
			
			//撤销退款状态确认
			/*confirmCancelAdvance=function(id){
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
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["dc"]="1";
				mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				mainOptions["isRet"]="0";
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					//url : baseURL+"/doConfirmCancelAdvance.do?tokenid="
					url : baseURL+"/doConfirmsAdvance.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
							viewModel.fSelect();
							ip.warnJumpMsg(data.result,0,0,true);
							requesting=false;
					}
				});
			}*/
			
			

			

			
			//查询
			viewModel.fSelect=function(){
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				fsc_show();
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
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
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择",0,0,true);
					return;
				}
				//mainOptions["condition"]=ip.getAreaData(viewModel.planSearchViewModel);
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var oriBillNO = document.getElementById("ori_bill_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+2)).value;
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
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			}
			
			
			//主单上的操作
			modalMianGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				var d = new Date();
				if(year==d.getFullYear()){
					if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="advance(this.id)" class="iconmenu icon-clearing-bank-amendment" title="退款"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="confirmAdvance(this.id)" class="iconmenu icon-confirms" title="退款状态确认"></a></div>';
					}else if(status=='002'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="cancelAdvance(this.id)" class="iconmenu icon-refund-redial" title="撤销退款"></a></div>';
					}
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
									mainOptions["queryViewId"] = viewModel.planQueryViewId;
									mainOptions["isSetValue"] = "false";
									viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 0, true);
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
									//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isSetValue"] = "false";
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									voucherOptions["isWorkFlowRelated"] = "false";
									voucherOptions["relationBillId"] = "voucher_bill_id";
									voucherOptions["set_year"] = voucherOptions["svSetYear"];
									voucherOptions["pageInfo"] = "10,0";
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', queryURL+"/doFind.do", voucherOptions, 0, false);
								}

							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
								viewModel.planQueryViewId = view.viewid;
								viewModel.planSearchViewModel = ip
										.initArea(view.viewDetail,
												"search", view.viewid
														.substring(1,
																37),
												"planSearchArea");
								viewModel.getFinanceCode();
								viewModel.getYear();
							}
						}
					}
				});
			};
			
			//操作按钮的显示
			fsc_show = function() {
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
					var d = new Date();
					if(year==d.getFullYear()){
						if (status=="001") {
			        		document.getElementById("tk").style.display = "";
			        		document.getElementById("confirmAdvance").style.display = "";
			        		document.getElementById("cxtk").style.display = "none";
			        		//document.getElementById("confirmCancelAdvance").style.display = "none";
						} else if(status=="002") {
							document.getElementById("tk").style.display = "none";
							document.getElementById("confirmAdvance").style.display = "none";
			        		document.getElementById("cxtk").style.display = "";
			        		//document.getElementById("confirmCancelAdvance").style.display = "";
						} 
					}else{
						document.getElementById("tk").style.display = "none";
		        		document.getElementById("confirmAdvance").style.display = "none";
		        		document.getElementById("cxtk").style.display = "none";
		        		//document.getElementById("confirmCancelAdvance").style.display = "none";
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
			
			
			//--------------------------------------------------------------//
			// 获取指纹特征
			//--------------------------------------------------------------//
	/*		function GetFeature()
			{
				strTZ = "";
				var dtm = document.getElementById("dtm");
				DevType=dtm.FPIDevDetect();
				if(DevType==-1){
					ip.warnJumpMsg("指纹控件获取失败！！！",0,0,true);
					return	strTZ;
				}
			    iRet = dtm.FPIGetFeature(DevType, 15000);
			    if(iRet == 0)
			    {
			    	strTZ = dtm.FPIGetFingerInfo();
			    	//document.getElementById('tz').value = strTZ;
			    }
			    else
			    {
			    	ip.warnJumpMsg("采集指纹特征失败！！！",0,0,true);
			    	//alert("采集指纹特征失败!");
			    }
			    return	strTZ;
			}
			
			//--------------------------------------------------------------//
			// 获取指纹特征(BASE64格式)
			//--------------------------------------------------------------//
			function GetFeatureB64()
			{
				strTZ = "";
				var dtm = document.getElementById("dtm");
				DevType=dtm.FPIDevDetect();
			    iRet = dtm.FPIGetFeatureB64(DevType, 15000);
			    if(iRet == 0)
			    {
			    	strTZ = dtm.FPIGetFingerInfo();
			    	//document.getElementById('tz').value = strTZ;
			    }
			    else
			    {
			    	alert("采集指纹特征失败!");
			    }
			    return	strTZ;
			}*/
			
			
			//保存
		/*	viewModel.doSaveuserCodeInput=function(){
				stiff_user_code=document.getElementById("stiff_user_code").value;
				
				if(stiff_user_code==null||stiff_user_code==""){
					ip.warnJumpMsg("柜员号不能为空",0,0,true);
					return;
				}else{
					var figerMessage = GetFeature();
					if(figerMessage==''){
						//ip.warnJumpMsg("指纹控件获取失败！！！",0,0,true);
						$("#stiff_user_code").val("");
						$("#userCodeInput").modal("hide");
						requesting=false;
						return;
					}
					$.ajax({
						url : "/df/f_ebank/pay/payCommon/doFingerPay.do?tokenid="
							+ viewModel.tokenid,
						type : "GET",
						dataType : "json",
						data : {
							"ajax" : "nocache",
							"staff_num":stiff_user_code,
							"psTZ":figerMessage
						},
						async : false,
						success : function(data) {
							if(data.flag=='0'){
								ip.warnJumpMsg("指纹验证失败"+data.result,0,0,true);
								viewModel.fSelect();
								requesting=false;
								return;
							}else{
								$.ajax({
									url : baseURL+"/doAdvance.do?tokenid="
										+ viewModel.tokenid,
									type : "POST",
									 async: false,
									data :mainOptions,
									success : function(data) {
											viewModel.fSelect();
											ip.warnJumpMsg(data.result,0,0,true);
											requesting=false;
									}
								});
							}						
						}
					});
				}
				$("#stiff_user_code").val("");
				$("#userCodeInput").modal("hide");
				requesting=false;
			}*/
			
			//关闭
			/*viewModel.closeuserCodeInput=function(){
				$("#stiff_user_code").val("");
				$("#userCodeInput").modal("hide");
				requesting=false;
			}*/
			
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

			};
			


			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
			})

		});
