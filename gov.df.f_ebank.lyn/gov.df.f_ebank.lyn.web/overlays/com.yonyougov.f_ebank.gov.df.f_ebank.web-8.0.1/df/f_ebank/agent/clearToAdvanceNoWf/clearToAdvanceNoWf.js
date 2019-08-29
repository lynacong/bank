require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;			
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			mainOptions["operate_width"] =80;
			var stiff_user_code='';
			mainOptions["condition"]=' ';

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
					temp["pay_money"] = payData.pay_money;
					temp["finance_code"] = payData.finance_code;
					temp["set_year"]= payData.set_year;
					temp["bill_no"] = payData.bill_no;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','bill_no','set_year','finance_code','pay_money' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			
			//清算到账确认
			advanceConfirm=function(id){
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
				mainOptions["billNosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : "/df/f_ebank/agent/clearAdvanceNoWf/doClearToAdvanceConfirm.do?tokenid="
								+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						if(data.success=='0'){
							ip.warnJumpMsg(data.result,0,0,true);	
						}else{
							ip.warnJumpMsg("清算到账确认失败,"+data.result,0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			};
			
			//撤销确认
			advanceCancelConfirm=function(id){
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
				mainOptions["billNosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : "/df/f_ebank/agent/clearAdvanceNoWf/doClearToAdvanceCancelConfirm.do?tokenid="
								+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						 if(data.success=='0'){
							ip.warnJumpMsg(data.result,0,0,true);	
						}else{
							ip.warnJumpMsg("撤销确认失败,"+data.result,0,0,true);	
						}
							viewModel.fSelect();
							
							requesting=false;
					}
				});
			};
			//清算资金划转
			advancePayTrade=function(id){
				if(requesting==true){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var n=0;
				var billIdsAndFinanceCode = buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["billNosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				for(var i=0,j=billIdsAndFinanceCode.length;i<j;i++){
					var money=billIdsAndFinanceCode[i].pay_money;
					var payMoneyFloat = parseFloat(money);
					
					//支付金额大于50000进行指纹验证
						if(payMoneyFloat>50000){//大金额数据指纹验证
							n++;
							$("#userCodeInput").modal("show");
							requesting=false;
							return;
							/* var figerMessage = GetFeature();
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
								});*/
								break;
						}
				}
				/*mainOptions["billNosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";*/
				if(n<=0){
					$.ajax({
						url : "/df/f_ebank/agent/clearAdvanceNoWf/doClearToAdvancePayTrade.do?tokenid="
									+ viewModel.tokenid,
						type : "POST",
						sysn : false,
						data :mainOptions,
						success : function(data) {
							if(data.success=='0'){
								ip.warnJumpMsg(data.result,0,0,true);	
							}else{
								ip.warnJumpMsg("清算资金划转失败,"+data.result,0,0,true);	
							}
								viewModel.fSelect();
								
								requesting=false;
						}
					});
				}
			}
			
			//清算资金划转确认
			advancePayConfirm=function(id){
				if(requesting==true){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var billIdsAndFinanceCode = buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["billNosAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				$.ajax({
					url : "/df/f_ebank/agent/clearAdvanceNoWf/doClearToAdvancePayQuery.do?tokenid="
								+ viewModel.tokenid,
					type : "POST",
					data :mainOptions,
					success : function(data) {
						 if(data.success=='0'){
							ip.warnJumpMsg(data.result,0,0,true);	
						}else{
							ip.warnJumpMsg("清算资金划转确认失败,"+data.result,0,0,true);	
						}
							viewModel.fSelect();						
							requesting=false;
					}
				});
			}
			
			//指纹校验
			viewModel.doSaveuserCodeInput=function(){
				var stiff_user_code=$("#userNo").val();
				if(stiff_user_code==null||stiff_user_code==""){
					ip.warnJumpMsg("柜员号不能为空",0,0,true);
					return;
				}else{
					var figerMessage = GetFeature();
					if(figerMessage==''){
						//ip.warnJumpMsg("指纹控件获取失败！！！",0,0,true);
						viewModel.closeuserCodeInput();
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
								ip.warnJumpMsg("指纹验证失败,"+data.result,0,0,true);
								viewModel.fSelect();
								requesting=false;
								return;
							}else{
								$.ajax({
									url : "/df/f_ebank/agent/clearAdvanceNoWf/doClearToAdvancePayTrade.do?tokenid="
												+ viewModel.tokenid,
									type : "POST",
									sysn : false,
									data :mainOptions,
									success : function(data) {
										if(data.success=='0'){
											ip.warnJumpMsg(data.result,0,0,true);	
										}else{
											ip.warnJumpMsg("清算资金划转失败,"+data.result,0,0,true);	
										}
											viewModel.fSelect();
											
											requesting=false;
									}
								});
							}
							
						}
					});
				}
				viewModel.closeuserCodeInput();
			};
			
			//关闭校验
			viewModel.closeuserCodeInput=function(){
				$("#userNo").val("");
				requesting=false;
				$("#userCodeInput").modal("hide");
			};
			
			
			//查询
			viewModel.fSelect=function(){
				fGetGrid();
			};
			
			
			
			//点击主单查询明细
			getDetail=function(){
				var id=viewModel.mainViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["bill_no"] =rowData.bill_no;
				voucherOptions["finance_code"] =rowData.finance_code;
				voucherOptions["set_year"] =mainOptions["set_year"];
				ip.setGrid(viewModel.voucherGridViewModel, "/df/f_ebank/agent/clearAdvanceNoWf/doQueryClearmoneyRecount.do", voucherOptions);
			};
			
			
			//主单上的操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
		        	if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
						+ '" onclick="advanceConfirm(this.id)" class="iconmenu icon-confirms" title="清算到账确认"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="advanceCancelConfirm(this.id)" class="iconmenu icon-revoke-confirms" title="撤销确认"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="advancePayTrade(this.id)" class="iconmenu icon-refund-redials" title="清算资金划转"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="advancePayConfirm(this.id)" class="iconmenu icon-edit" title="清算资金划转确认"></a></div>';
					}/*else{
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="cancelConfirmBill(this.id)" class="iconmenu icon-back-prev" title="撤销确认"></a><a id="'
							+ obj.rowIndex
							+ '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					};*/
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
						var status = $("#pz_status option:selected").val();
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId=view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									mainOptions["status"] = status;
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] ="000000";
									mainOptions["set_year"] =mainOptions["svSetYear"];
									viewModel.mainViewModel = ip.initGrid(view, 'modalMainGridArea', "/df/f_ebank/agent/clearAdvanceNoWf/doQueryAgentBill.do", mainOptions, 1, true);
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] =voucherOptions["svSetYear"];
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', "/df/f_ebank/agent/clearAdvanceNoWf/doQueryClearmoneyRecount.do", voucherOptions, 0, false);
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
				mainOptions["status"] = status;
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
					var d = new Date();
					if(year==d.getFullYear()){
						if (status==EBankConstant.WfStatus.TODO_001) {
			        		document.getElementById("advanceConfirm").style.display = "";
			        		document.getElementById("advanceCancelConfirm").style.display = "";
			        		document.getElementById("advancePayTrade").style.display = "";
			        		document.getElementById("advancePayConfirm").style.display = "";
			        		document.getElementById("view").style.display = "";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("advanceConfirm").style.display = "none";
			        		document.getElementById("advanceCancelConfirm").style.display = "none";
			        		document.getElementById("advancePayTrade").style.display = "none";
			        		document.getElementById("advancePayConfirm").style.display = "none";
			        		document.getElementById("view").style.display = "";
						} 
					}else{
						document.getElementById("advanceConfirm").style.display = "none";
		        		document.getElementById("advanceCancelConfirm").style.display = "none";
		        		document.getElementById("advancePayTrade").style.display = "none";
		        		document.getElementById("advancePayConfirm").style.display = "none";
		        		document.getElementById("view").style.display = "";
					}
			};
			
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				var year=document.getElementById("set_year" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				var mk_code=document.getElementById("mk_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				var pb_code=document.getElementById("pb_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				var agent_account_no=document.getElementById("agent_account_no" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				var payee_account_no=document.getElementById("payee_account_no" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				mainOptions["condition"]=' ';
				if(mk_code!=null&&mk_code!=''){
					mk_code=mk_code.split(" ")[0];
					mainOptions["condition"]=mainOptions["condition"]+"and mk_code='"+mk_code+"'";
				}
				if(pb_code!=null&&pb_code!=''){
					pb_code=pb_code.split(" ")[0];
					mainOptions["condition"]=mainOptions["condition"]+"and pb_code ='"+pb_code+"'";
				}
				if(agent_account_no!=null&&agent_account_no!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and agent_account_no='"+agent_account_no+"'";
				}
				if(payee_account_no!=null&&payee_account_no!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and payee_account_no ='"+payee_account_no+"'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			
				ip.setGrid(viewModel.mainViewModel, "/df/f_ebank/agent/clearAdvanceNoWf/doQueryAgentBill.do", mainOptions);
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
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
			
			//--------------------------------------------------------------//
			// 获取指纹特征
			//--------------------------------------------------------------//
			function GetFeature()
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
			    	ip.ipInfoJump("采集指纹特征失败!", "error");
			    }
			    return	strTZ;
			}
			

			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				});
				viewModel.initData();
			});

		});
