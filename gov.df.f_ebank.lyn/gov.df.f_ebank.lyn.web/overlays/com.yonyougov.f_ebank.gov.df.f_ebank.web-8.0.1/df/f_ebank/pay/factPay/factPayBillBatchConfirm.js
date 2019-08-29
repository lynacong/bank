require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			var requesting=false;			
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var addPayeeBankNoOptions = ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			var isInitPayeeBankNo=0;
			var isnewInitPayeeBankNo=0;
			var needPaydata;
			var provincedata;
			var bankleitzahlData;
			var stiff_user_code='';
			var baseURL = EBankConstant.Ctx + "pay/payCommon";
			mainOptions["operate_width"] =80;
			mainOptions["btype"]=ip.getUrlParameter("btype");
			mainOptions["isFlow"]=ip.getUrlParameter("isFlow");
			mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
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
					temp["bill_no"] = payData.bill_no;
					temp["finance_code"] = payData.finance_code;
					temp["payee_account_bank"] = payData.payee_account_bank;
					temp["payee_account_no"] = payData.payee_account_no;
					temp["payee_bank_no"] = payData.payee_bank_no;
					temp["pm_code"]=payData.pm_code;
					temp["pay_money"]=payData.pay_money;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','bill_no','finance_code','payee_account_bank','payee_account_no','payee_bank_no','pm_code','pay_money' ]
					});
				}
				return	billIdsAndFinanceCode;
			};
			
			//支付
			pay=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				if(mainOptions["svUserType"]==EBankConstant.UserType.MANAGER){
					ip.warnJumpMsg("柜员不合法！",0,0,true);
					requesting=false;
					return;
				}
				var n=0;
				var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
				if(billIdsAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;
					return;
				}
				mainOptions["btype"]=ip.getUrlParameter("btype");
				mainOptions["isFlow"]=ip.getUrlParameter("isFlow");
				mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billIdsAndFinanceCode);
				mainOptions["ajax"]="nocache";
				for(var i=0,j=billIdsAndFinanceCode.length;i<j;i++){
					//if(billIdsAndFinanceCode[i].pm_code!='001' || billIdsAndFinanceCode[i].pm_code!='1'){
						if(billIdsAndFinanceCode[i].payee_account_bank.indexOf("重庆银行")==-1){
							if(j!=1){
								ip.warnJumpMsg("此次操作中存在需补录行号的跨行转账数据，此数据要单笔操作！！！",0,0,true);
								requesting=false;
								return;
							}
							//if(billIdsAndFinanceCode[i].payee_bank_no==''||billIdsAndFinanceCode[i].payee_bank_no==null){
								needPaydata=null;
								needPaydata=billIdsAndFinanceCode[i];
								Input(billIdsAndFinanceCode[i].payee_account_bank);
								requesting=false;
								return;
							//}
						}
					//}
				}
				
				if(n<=0){
					$.ajax({
						url : EBankConstant.CommonUrl.doCommonPay,
						type : "POST",
						 async: false,
						data :mainOptions,
						success : function(data) {
							ip.warnJumpMsg(data.result,0,0,true);
								viewModel.fSelect();
								requesting=false;
						}
					});
				}else{
					$("#userCodeInput").modal("show");
					requesting=false;
				}
			};
			
			//退回财政
			ref=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				var billNosAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billNosAndFinanceCode = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["bill_no"] = planData.bill_no;
					temp["finance_code"] = planData.finance_code;
					temp["pay_money"] = planData.pay_money;
					billNosAndFinanceCode.push(temp);
				} else {//id为空
					billNosAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'bill_no','finance_code' ,'pay_money']
					});
				}
				var allMoney=0.00;
				 if(billNosAndFinanceCode.length==0){
					 ip.warnJumpMsg("请选择数据",0,0,true);
					 requesting=false;
						return;
				 }else{
					 for (var i=0;i<billNosAndFinanceCode.length;i++){
						 allMoney=allMoney+parseFloat(billNosAndFinanceCode[i].pay_money);
					 }
				 }
				 
				 mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				 mainOptions["billNosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				 mainOptions["ajax"]="nocache";
				 
				 //退回财政意见  viewModel.sumArry(billNosAndFinanceCode)
				 $("#advice").val("");
		 		 $("#backAdvice").modal("show");
		 		 viewModel.gridDataTable.setSimpleData(billNosAndFinanceCode);
		 		 $("#money").html(allMoney);
			};
			 //补录交易流水号
			input=function(id){
			if(requesting){
				return;
			}
			requesting=true;
			var billIdsAndFinanceCode=buildBillIdsAndFinanceCode(id);
			if(billIdsAndFinanceCode.length!=1){
				ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
				requesting=false;
				return;
			}
			mainOptions["bill_no"]=billIdsAndFinanceCode[0].bill_no;
			mainOptions["finance_code"]=billIdsAndFinanceCode[0].finance_code;
			mainOptions["ajax"]="nocache";
			$("#agentBusinessNoAddDialog").modal("show");
		};
		  
		//保存
		viewModel.saveAgentBusinessNo=function(){
			var patt1=/^[0-9]*$/;
			var agentBusinessNo=$("#agent_business_no").val();
			if(agentBusinessNo==''||agentBusinessNo==null){
				ip.warnJumpMsg("请先填写交易流水号！！！",0,0,true);
				return;
			}else if(!patt1.test(agentBusinessNo)){
				ip.warnJumpMsg("交易流水号必须是数字！！！",0,0,true);
				return;
			}else{
				viewModel.closeAgentBusinessNo();
				mainOptions["agentBusinessNo"]=agentBusinessNo;
				$.ajax({
					url : EBankConstant.CommonUrl.doInputAgentBusinessNoNext,
					type : "POST",
					 async: false,
					data :mainOptions,
					success : function(data) {
						ip.warnJumpMsg(data.result,0,0,true);
							viewModel.fSelect();
							requesting=false;
					}
				});
			}
		};
		
		//关闭
		viewModel.closeAgentBusinessNo=function(){
			$("#agent_business_no").val("");
			$("#agentBusinessNoAddDialog").modal("hide");
			requesting=false;
		};
			
			//退回
			/*ref=function(id){
				if(requesting){
					return;
				}
				requesting=true;
				var billNosAndFinanceCode =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billNosAndFinanceCode = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["id"] = planData.id;
					temp["finance_code"] = planData.finance_code;
					temp["pay_money"] = planData.pay_money;
					billNosAndFinanceCode.push(temp);
				} else {//id为空
					billNosAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code' ,'pay_money']
					});
				}
				var allMoney='';
				 if(billNosAndFinanceCode.length!=1){
					 ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
					 requesting=false;
						return;
				 }else{
					 for (var i=0;i<billNosAndFinanceCode.length;i++){
						 allMoney=allMoney+billNosAndFinanceCode[i].pay_money;
					 }
				 }
				 
				 mainOptions["vt_code"]=ip.getUrlParameter("vt_code");
				 mainOptions["billIdsAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				 mainOptions["ajax"]="nocache";
				 
				 //退回财政意见  viewModel.sumArry(billNosAndFinanceCode)
				 $.ajax({
						url : EBankConstant.CommonUrl.doCommonBack,
						type : "POST",
						data :mainOptions,
						success : function(data) {
							if(data.is_success=="0"){
								ip.warnJumpMsg("退回失败",0,0,true);
								viewModel.fSelect();
								requesting=false;
							}else{
								ip.warnJumpMsg("退回成功",0,0,true);
								viewModel.fSelect();
								requesting=false;
							}
						}
					});
			}*/
			
			//凭证查看
			doVoucherSee=function(id, evt){
				if(requesting){
					return;
				}
				requesting=true;
				var e = evt || window.event;
				var billIds =new Array();
				if (id != null && id != undefined && (id + " ").trim().length > 0) {//id不为空
					billIds = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var tempId = {};
					tempId["id"] = planData.id;
					tempId["finance_code"]= planData.finance_code;
					tempId["set_year"]= planData.set_year;
					tempId["bill_no"]= planData.bill_no;
					billIds.push(tempId);
				} else {//id为空
					billIds = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','set_year','bill_no' ]
					});
				}
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					requesting=false;
					return;
				}
				doAsspVoucherSee(billIds,evt,ip.getUrlParameter("vt_code"));
				window.event ? e.cancelBubble = true : e.stopPropagation();
				requesting=false;
			};
			
			//查询
			viewModel.fSelect=function(){
				fsc_show();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
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
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择",0,0,true);
					return;
				}
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.QueryViewId.substring(1, 37)+2)).value;
				var payMoney = document.getElementById("pay_money"
						+ "-" + viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
				}
				if(startTime!=null&&startTime!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and create_date>='"+startTime+"'";
				}
				/*if(endTime!=null&&endTime!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and create_date<'"+endTime+"'";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
			}*/				if(endTime!=null&&endTime!=''){
				endTime=endTime.replace(/-/g,"/");
				var date=new Date(new Date(endTime).valueOf()+24*60*60*1000);
				mainOptions["condition"]=mainOptions["condition"]+"and create_date<'"+changeDateToString(date)+"'";
			}
			if(payMoney!=null&&payMoney!=''){
				mainOptions["condition"]=mainOptions["condition"]+"and pay_money='"+payMoney+"'";
			}
			mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
					+ viewModel.QueryViewId.substring(1, 37)).value;
			mainOptions["set_year"] =year;
		};
		
		changeDateToString=function(date){
			var Year=0;
			var Month=0;
			var Day=0;
			var CurrentDate="";
			Year=date.getFullYear();
			Month=date.getMonth()+1;
			Day=date.getDate();
			CurrentDate=Year;
			if(Month>=10){
				CurrentDate=CurrentDate+"-"+Month+"-";
			}else{
				CurrentDate=CurrentDate+"-"+"0"+Month+"-";
			}
			if(Day>=10){
				CurrentDate=CurrentDate+Day;
			}else{
				CurrentDate=CurrentDate+"0"+Day;
			}
			return CurrentDate;
		};
			
			//主单上的操作
			modalMianGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status = $("#pz_status option:selected").val();
		        	if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="pay(this.id)" class="iconmenu icon-clearing-bank-amendment" title="支付"></a><a id="'
						+ obj.rowIndex
						+ '" onclick="input(this.id)" class="iconmenu icon-input" title="补录交易流水号"></a></div>';
						/*<a id="'
						+ obj.rowIndex
						+ '" onclick="ref(this.id)" class="iconmenu icon-recover" title="退回"></a></div>';*/
						/*<a id="'
						+ obj.rowIndex
						+ '" onclick="Input(this.id)" class="iconmenu icon-input" title="收款行号补录"></a></div>';*/
					}/*else if(status=='002'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
		        	        + '" onclick="getDetail(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}*//*else{
						obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
	        	            + '" onclick="getDetail(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					}*/
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
									viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
									
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
			        		document.getElementById("pay").style.display = "";
			        		document.getElementById("input").style.display = "";
			        		document.getElementById("ref").style.display = "";
			        		document.getElementById("view").style.display = "";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("pay").style.display = "none";
							document.getElementById("input").style.display = "none";
			        		document.getElementById("ref").style.display = "none";
			        		document.getElementById("view").style.display = "";
						} else if(status==EBankConstant.WfStatus.RETURNED_003) {
							document.getElementById("pay").style.display = "none";
							document.getElementById("input").style.display = "none";
			        		document.getElementById("ref").style.display = "none";
							document.getElementById("view").style.display = "";
						} 
					}else{
						document.getElementById("view").style.display = "";
						document.getElementById("pay").style.display = "none";
						document.getElementById("input").style.display = "none";
		        		document.getElementById("ref").style.display = "none";
					}
			};
			
			//凭证状态改变事件
			fGetGrid = function() {
				fsc_show();
				mainOptions["status"] = $("#pz_status option:selected").val();
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
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

			//补录
			Input=function(payee_account_bank){
			/*	if(requesting){
					return;
				}
				requesting=true;*/
				//needPaydata=null;
				//needPaydata=buildBillIdsAndFinanceCode(id);
/*				if(needPaydata.length==0){
					alert("请选择数据！！！");
					requesting=false;
					return;
				} 
				if(needPaydata.length>1){
					alert("请选择一条数据！！！");
					requesting=false;
					return;
				} */
				$("#payeeBankNoAddDialog").modal("show");
				if(isInitPayeeBankNo==0)
				    initPayeeBankNoDailog();
				getBankleitzahl();
				getProvince();
				/*$("#" + "united_bank_name" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val(needPaydata[0].payee_account_bank);*/
				$("#" + "united_bank_name" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val(payee_account_bank);

				var province_code = document.getElementById("province_code" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37));

				province_code.addEventListener("change", getCity, false);
				getPayeeBankNo();
			};
			
			//操作按钮的显示
			initPayeeBankNoDailog = function() {
				isInitPayeeBankNo=1;
				for ( var n = 0; n < viewModel.viewList.length; n++) {
					var view = viewModel.viewList[n];
					if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
						if (view.orders == '5') {
							viewModel.payeeBankNoMainViewId=view.viewid;
							addPayeeBankNoOptions["tableViewId"] = view.viewid;
							addPayeeBankNoOptions["isSetValue"] = "false";
							addPayeeBankNoOptions["isDetailQuery"] = "false";  //是否查询明细
							viewModel.payeeBankNoMainModal = ip.initGrid(view, 'payeeBankNoList', null, mainOptions, 0, false);
							//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
						} 

					}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
						
						if (view.orders == '5') {
							viewModel.payeeBankNoQueryViewId = view.viewid;
							viewModel.payeeBankNoViewModel = ip
									.initArea(view.viewDetail,
											"edit", view.viewid
													.substring(1,
															37),
											"payeeBankNoSearch");
							/*viewModel.getFinanceCode();
							viewModel.getYear();*/
							//viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', queryURL+"/doFind.do", mainOptions, 1, true);
							//province_code.attachEvent("onchange", getCity());
						} 
						
					}
				}
			};
			
			//查询区的行别
			getBankleitzahl = function() {
				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/getBank.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(datas) {
						bankleitzahlData= datas.data;
							for (var i = 0; i < datas.data.length; i++) {
								var x = document.getElementById("bankleitzahl"
										+ "-"
										+ viewModel.payeeBankNoQueryViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.data[i].bankleitzahl_no;
								option.text = datas.data[i].bankleitzahl_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
						
					}
				});
			};
			
			//查询区的行别
			getProvince = function() {
				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/getProvince.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(datas) {
						    provincedata= datas.data;
							for (var i = 0; i < datas.data.length; i++) {
								var x = document.getElementById("province_code"
										+ "-"
										+ viewModel.payeeBankNoQueryViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.data[i].province_code;
								option.text = datas.data[i].province_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}

					}
				});
			};
			
			//查询区的行别
			function  getCity() {
				var city_code=document.getElementById("city_code" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37));
				city_code.options.length = 0;
				var provinceCode=document.getElementById("province_code" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).value;
				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/getCity.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"provinceCode":provinceCode
					},
					async : false,
					success : function(datas) {
							for (var i = 0; i < datas.data.length; i++) {
								var x = document.getElementById("city_code"
										+ "-"
										+ viewModel.payeeBankNoQueryViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.data[i].city_code;
								option.text = datas.data[i].city_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
					}
				});
			};
			
			//查询区的行别
			getPayeeBankNo = function() {
				var bankleitzahlCode=document.getElementById("bankleitzahl" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).value;
				var provinceCode=document.getElementById("province_code" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).value;
				var cityCode=document.getElementById("city_code" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).value;
				var payeeBankName=document.getElementById("united_bank_name" + "-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).value;
				var condition="";
				if(bankleitzahlCode!=null&&bankleitzahlCode!=''){
					condition=condition+" and bankleitzahl_no='"+bankleitzahlCode+"' ";
				}
				if(provinceCode!=null&&provinceCode!=''){
					condition=condition+" and province_code='"+provinceCode+"' ";
				}
				if(cityCode!=null&&cityCode!=''){
					condition=condition+" and city_code='"+cityCode+"' ";
				}
				if(payeeBankName!=null&&payeeBankName!=''){
					condition=condition+" and united_bank_name like '%"+payeeBankName+"%' ";
				}

				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/getPayeeBank.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"condition":condition
					},
					async : false,
					success : function(datas) {
						viewModel.payeeBankNoMainModal.gridData.setSimpleData(datas.data, {
							unSelect: true
						});
					}
				});
			};

			//查询
			viewModel.payeeBankNoSearch=function(){
				getPayeeBankNo();
			};
			
			//清空
			viewModel.payeeBankNoClear=function(){
				$("#bankleitzahl-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				$("#province_code-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				$("#city_code-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				$("#united_bank_name-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				viewModel.payeeBankNoMainModal.gridData.clear();
				viewModel.payeeBankNoMainModal.gridData.totalRow(0);
			};
			
			//新增
			viewModel.payeeBankNoAdd=function(){
				$("#newpayeeBankNoAddDialog").modal("show");
				if(isnewInitPayeeBankNo==0)
					initnewPayeeBankNoDailog();
			};
			
			//保存
			viewModel.savePayeeBankNo=function(){
				var payeeBankName =needPaydata.payee_account_bank;
				var payeeAccountNo =needPaydata.payee_account_no;
				var  id= needPaydata.id;
				var financeCode =  needPaydata.finance_code;
				var payeeBankData = viewModel.payeeBankNoMainModal.gridData.getSimpleData({  //批量选中
					type : 'select',
					fields : [ 'united_bank_no','united_bank_name']
				});
				if(payeeBankData==null||payeeBankData.length==0||payeeBankData.length>1){
					ip.warnJumpMsg("请选择一条数据！！！",0,0,true);
					return;
				}
				var unitedBankNo=payeeBankData[0].united_bank_no;
				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/inputBillPayeeBankNo.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"financeCode":financeCode,
						"unitedBankNo":unitedBankNo,
						"payeeBankName":payeeBankName,
						"payeeAccountNo":payeeAccountNo,
						"id":id,
						"setYear":mainOptions["svSetYear"],
					},
					async : false,
					success : function(datas) {
						$("#bankleitzahl-"
								+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
						$("#province_code-"
								+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
						$("#city_code-"
								+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
						$("#united_bank_name-"
								+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
						viewModel.payeeBankNoMainModal.gridData.clear();
						viewModel.payeeBankNoMainModal.gridData.totalRow(0);
						$("#payeeBankNoAddDialog").modal("hide");
						if(datas.flag=="0"){

							ip.warnJumpMsg("补录失败",0,0,true);
						}else{
							//ip.warnJumpMsg("补录成功",0,0,true);
							var payMoney = needPaydata.pay_money;
							var payMoneyFloat = parseFloat(payMoney);
							if(payMoneyFloat>50000){//大金额数据
								$("#userCodeInput").modal("show");
								requesting=false;
							}else{
								$.ajax({
									url : EBankConstant.CommonUrl.doCommonPay,
									type : "POST",
									 async: false,
									data :mainOptions,
									success : function(data) {
										ip.warnJumpMsg(data.result,0,0,true);
											viewModel.fSelect();
											requesting=false;
									}
								});
							}
						}				
					}
				});
			};
			
			//关闭
			viewModel.closePayeeBankNo=function(){
				$("#bankleitzahl-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				$("#province_code-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				$("#city_code-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				$("#united_bank_name-"
						+ viewModel.payeeBankNoQueryViewId.substring(1, 37)).val("");
				viewModel.payeeBankNoMainModal.gridData.clear();
				viewModel.payeeBankNoMainModal.gridData.totalRow(0);
				$("#payeeBankNoAddDialog").modal("hide");
                ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
				requesting=false;
			};
			
			//保存新增数据
			viewModel.saveAddPayeeBankNo=function(){
				var bankleitzahlCode=document.getElementById("bankleitzahl" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).value;
				var selectIndex = document.getElementById("bankleitzahl" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).selectedIndex;//获得是第几个被选中了
				var bankleitzahlname = document.getElementById("bankleitzahl" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).options[selectIndex].text; 
				var provinceCode=document.getElementById("province" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).value;
				 selectIndex = document.getElementById("province" + "-"
							+ viewModel.payeeBankNoInputViewId.substring(1, 37)).selectedIndex;//获得是第几个被选中了
				 var provinceName = document.getElementById("province" + "-"
							+ viewModel.payeeBankNoInputViewId.substring(1, 37)).options[selectIndex].text; 
				var cityCode=document.getElementById("city" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).value;
				 selectIndex = document.getElementById("city" + "-"
							+ viewModel.payeeBankNoInputViewId.substring(1, 37)).selectedIndex;//获得是第几个被选中了
				var cityName = document.getElementById("city" + "-"
							+ viewModel.payeeBankNoInputViewId.substring(1, 37)).options[selectIndex].text; 
				var unitedBankName=document.getElementById("united_bank_name" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).value;
				var unitedBankNo=document.getElementById("united_bank_no" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).value;
				if(unitedBankNo==null||unitedBankNo==''){
					ip.warnJumpMsg("请输入收款行行号！！！",0,0,true);
					return;
				}
				if(unitedBankName==null||unitedBankName==''){
					ip.warnJumpMsg("请输入收款行名称！！！",0,0,true);
					return;
				}
				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/savePayeeBank.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"bankleitzahlNo":bankleitzahlCode,
						"unitedBankNo":unitedBankNo,
						"unitedBankName":unitedBankName,
						"cityCode":cityCode,
						"cityName":cityName,
						"bankleitzahlName":bankleitzahlname,
						"provinceCode":provinceCode,
						"provinceName":provinceName
					},
					async : false,
					success : function(datas) {
						if(datas.flag=="0"){
							ip.warnJumpMsg("新增失败",0,0,true);
						}else{
							ip.warnJumpMsg("新增成功",0,0,true);
						}
						$("#bankleitzahl-"
								+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
						$("#province-"
								+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
						$("#city-"
								+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
						$("#united_bank_name-"
								+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
						$("#united_bank_no-"
								+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");

						$("#newpayeeBankNoAddDialog").modal("hide");
						getPayeeBankNo();
					}
				});
			};
			
			//关闭
			viewModel.closeAddPayeeBankNo=function(){
				$("#bankleitzahl-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
				$("#province-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
				$("#city-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
				$("#united_bank_name-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");
				$("#united_bank_no-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).val("");

				$("#newpayeeBankNoAddDialog").modal("hide");
				getPayeeBankNo();
			};
			
			//操作按钮的显示
			initnewPayeeBankNoDailog = function() {
				isnewInitPayeeBankNo=1;
				for ( var n = 0; n < viewModel.viewList.length; n++) {
					var view = viewModel.viewList[n];
					 if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_INPUT){
						if (view.orders == '5') {
							viewModel.payeeBankNoInputViewId = view.viewid;
							viewModel.payeeBankNoInputViewModel = ip
									.initArea(view.viewDetail,
											"edit", view.viewid
													.substring(1,
															37),
											"payeeBankNoInput");
							for (var i = 0; i < bankleitzahlData.length; i++) {
								var x = document.getElementById("bankleitzahl"
										+ "-"
										+ viewModel.payeeBankNoInputViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value =bankleitzahlData[i].bankleitzahl_no;
								option.text = bankleitzahlData[i].bankleitzahl_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
							for (var i = 0; i < provincedata.length; i++) {
								var x = document.getElementById("province"
										+ "-"
										+ viewModel.payeeBankNoInputViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value =provincedata[i].province_code;
								option.text = provincedata[i].province_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
							var provinceEle = document.getElementById("province" + "-"
									+ viewModel.payeeBankNoInputViewId.substring(1, 37));

							provinceEle.addEventListener("change", getCityInput, false);
						} 
					}
				}
			};
			
			//查询区的行别
			function  getCityInput() {
				var city_code=document.getElementById("city" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37));
				city_code.options.length = 0;
				var provinceCode=document.getElementById("province" + "-"
						+ viewModel.payeeBankNoInputViewId.substring(1, 37)).value;
				$.ajax({
					url : "/df/f_ebank/pay/InputPayeeBankNo/getCity.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"provinceCode":provinceCode
					},
					async : false,
					success : function(datas) {
							for (var i = 0; i < datas.data.length; i++) {
								var x = document.getElementById("city"
										+ "-"
										+ viewModel.payeeBankNoInputViewId.substring(
												1, 37));
								var option = document.createElement("option");
								option.value = datas.data[i].city_code;
								option.text = datas.data[i].city_name;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
					}
				});
			};
			
			//清除填写意见的文本域
			viewModel.clear=function(){
				$("#advice").val("");
			};
			
			viewModel.notes=function(){
				$("#preNotes").modal("show");
				var data=getCookie("czNotes");
				if(data!=null||data!=''){
					var noteData=[];
					var	prenotes=data.split(",");
					for (var i=0;i<prenotes.length;i++){
						if(prenotes[i]!=null&&prenotes[i]!=""){
							 var temp={
		 							"suggest":prenotes[i],
		 						 };
							 noteData.push(temp);
						}
					}
					viewModel.gridNodes.setSimpleData(noteData);
				}
			};
			
			//删除所有审核意见
			viewModel.delAll=function(){
				nodes = viewModel.gridNodes.getAllDatas();
				if(nodes.length==0){
					ip.warnJumpMsg("没有可删除的数据！",0,0,true);
					return;
				}	
				 ip.warnJumpMsg("确定要删除所有审核意见吗？","del", "cCla");
				 $("#del").on("click", function() {
						setCookie("czNotes", "", -1);
						 $("#preNotes").modal("hide");
						 $("#config-modal").remove();
					});
					
					$(".cCla").on("click", function() {
						$("#config-modal").remove();
					});
			};
			
			//删除选中的审核意见
			viewModel.delCheck=function(){
				nodes = viewModel.gridNodes.getSimpleData({  //批量选中
					type : 'select',
					fields : [ 'suggest' ]
				});
				if(nodes.length==0){
					ip.warnJumpMsg("请选择数据进行删除！",0,0,true);
					return;
				}				
				var cookieData='';
				var data=getCookie("czNotes");
				var	prenotes=data.split(",");
				for (var i=0;i<prenotes.length;i++){
					for (var j=0;j<nodes.length;j++){
						if(prenotes[i]==nodes[j].suggest){
							prenotes[i]='';
						}
					}
					if(prenotes[i]!=''){
						cookieData=cookieData+","+prenotes[i];
					}
				}
				 ip.warnJumpMsg("确定要删除选中的审核意见吗？","del", "cCla");
				 $("#del").on("click", function() {
					 setCookie("czNotes",cookieData);
						 $("#preNotes").modal("hide");
						 $("#config-modal").remove();
					});
					
					$(".cCla").on("click", function() {
						$("#config-modal").remove();
					});
			};
			
			//保存审核意见并退回财政
			viewModel.saveAdvice=function(){
				advice=$("#advice").val();
				if(advice==''||advice==null){
					ip.warnJumpMsg("请填写审核意见",0,0,true);
					requesting=false;
					return;
				}else{
					if(document.getElementById('check').checked){
						var data=getCookie("czNotes");
						if(data!=null && data!=""){
							var temp=data.split(",");
							for(var i=0;i<temp.length;i++){
								if(temp[i]==advice){
									break;
								}else if(i==temp.length-1){
									setCookie("czNotes",data+","+advice);
								}
							}
						}
						else
							document.cookie="czNotes="+advice;
					}
					$("#backAdvice").modal("hide");
					mainOptions["advice"]=advice;
					$.ajax({
						url : baseURL+"/doBackCZ.do?tokenid="
							+ viewModel.tokenid,
						type : "POST",
						data :mainOptions,
						success : function(data) {
							if(data.is_success=='0'){
								ip.warnJumpMsg(data.error_msg,0,0,true);
							}else{
								viewModel.fSelect();
								ip.warnJumpMsg('支付凭证退回财政成功',0,0,true);
							}
							requesting=false;
					}
				});
				}
			};
			
			viewModel.close=function(){
				$("#backAdvice").modal("hide");
				requesting=false;
			};
			
			//设置cookie 
			setCookie=function(cname, cvalue, exdays) {  
			    var d = new Date();  
			    d.setTime(d.getTime() + (exdays*24*60*60*1000));  
			    var expires = "expires="+d.toUTCString();  
			    document.cookie = cname + "=" + cvalue + "; " + expires;  
			};
			
			//获取cookie  
			getCookie=function(cname) {  
			    var name = cname + "=";  
			    var ca = document.cookie.split(';');  
			    for(var i=0; i<ca.length; i++) {  
			        var c = ca[i];  
			        while (c.charAt(0)==' ') c = c.substring(1);  
			        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);  
			    }  
			    return "";  
			};
			
			getNotes=function(){
				var id=viewModel.gridNodes.getFocusIndex();
				var rowData = $("#gridNotes ")[0]['u-meta'].grid.getRowByIndex(id).value;
				$("#advice").val(rowData.suggest);
			}
			
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
			    	alert("采集指纹特征失败!");
			    }
			    return	strTZ;
			}
			
			//保存
			viewModel.doSaveuserCodeInput=function(){
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
								ip.warnJumpMsg("指纹验证失败,"+data.result,0,0,true);
								viewModel.fSelect();
								requesting=false;
								return;
							}else{
								$.ajax({
									url : EBankConstant.CommonUrl.doCommonPay,
									type : "POST",
									 async: false,
									data :mainOptions,
									success : function(data) {
										ip.warnJumpMsg(data.result,0,0,true);
											viewModel.fSelect();
											requesting=false;
									}
								});
							}
						}
					});
				}
				$("#stiff_user_code").val("");
				$("#userCodeInput").modal("hide");
			};
			
			//关闭
			viewModel.closeuserCodeInput=function(){
				$("#stiff_user_code").val("");
				$("#userCodeInput").modal("hide");
			};
			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				});
				viewModel.initData();
			});
		});
