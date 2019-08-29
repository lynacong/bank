require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH',],
		function($, ko, echarts) {
			
			var requesting=false;
			var optionsMain = ip.getCommonOptions({});
			var optionsSub = ip.getCommonOptions({});
			
			var baseURL = EBankConstant.Ctx + "agent";
			var vtCode=ip.getUrlParameter("vt_code");
			optionsMain["operate_width"] =50;
			optionsSub["operate_width"] =50;

			var viewModel = {
				tokenid : ip.getTokenId()
			};
			
			//构建传入后台的billNos
			buildBillNosAndFinanceCode = function(id){
				var billNosAndFinanceCode = new Array();
				if(id!=null && id!=undefined && (id+" ").trim().length > 0){//id不为空
					billNosAndFinanceCode = [];
					var agentData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["bill_no"] = agentData.bill_no;
					temp["finance_code"] = agentData.finance_code;
					temp["id"] = agentData.id;
					billNosAndFinanceCode.push(temp);
				}else{//id为空
					billNosAndFinanceCode = viewModel.mainGridViewModel.gridData.getSimpleData({  
						type : 'select',
						fields : [ 'id','bill_no','finance_code' ]
					});
				}
				return billNosAndFinanceCode;
			};
			
			//补录
			input = function(id) {
				if(requesting){
					return;
				}
				requesting=true; 
				var billNosAndFinanceCode =  buildBillNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;  
					return false;
				}
				if(billNosAndFinanceCode.length!=1){
					ip.warnJumpMsg("每次只能补录一条凭证！！！",0,0,true);
					requesting=false;  
					return false;
				}
				
				optionsMain["setYear"]=document.getElementById("set_year" + "-"+ viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["vtCode"]=vtCode;
				optionsMain["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				optionsMain["ajax"]="nocache";
				optionsMain["num"]="1";
				
				$("#refundAgentInput").modal("show");	

			};
			
			//再次补录
			reInput = function(id) {
				if(requesting){
					return;
				}
				requesting=true; 
				var billNosAndFinanceCode =  buildBillNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;  
					return false;
				}
				optionsMain["num"]="2";
				optionsMain["setYear"]=document.getElementById("set_year" + "-"+ viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["vtCode"]=vtCode;
				optionsMain["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				optionsMain["ajax"]="nocache";
				
				$("#refundAgentInput").modal("show");	

			};
			
			//撤销补录
			cancelInput = function(id) {
				if(requesting){
					return;
				}
				requesting=true; 
				var billNosAndFinanceCode =  buildBillNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;  
					return false;
				}
				
				optionsMain["setYear"]=document.getElementById("set_year" + "-"+ viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["vtCode"]=vtCode;
				optionsMain["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				optionsMain["ajax"]="nocache";
				
				$.ajax({
					url : baseURL+"/doCancelRefundAgentInput.do",
					type : "POST",
					data : optionsMain,
					success : function(data) {
						if(data.flag=='1'){
							ip.warnJumpMsg("撤销录入成功",0,0,true);
								$("#refundAgentInput").modal("hide");	
						
						}else{
							ip.warnJumpMsg("撤销录入失败",0,0,true);	
						}
						viewModel.doClearAgentRefundBillInput();
						requesting=false;	
						viewModel.query();	
						
					}
				});				

			};

			
			//刷新按钮
			viewModel.refresh= function(status) {
				//清空页面单号输入框
				$('#bill_no-' + viewModel.queryViewId.substring(1, 37)).val("");
				/*$(document.getElementById("bill_no"
						+ "-" + viewModel.queryViewId.substring(1, 37))).val("");*/
				optionsMain["condition"]='';
				ip.setGrid(viewModel.mainGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsMain);
				viewModel.subsysGridViewModel.gridData.clear();
				viewModel.subsysGridViewModel.gridData.totalRow(0);
			};
			
			
			// 发送按钮显示设置
			fs_show = function() {
				var fs_status = document.getElementById("fs_status")[0].selected;
				var current_year = document.getElementById("set_year" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
				var sysDate = new Date();
				//选择非本年度时，隐藏签章发送及重新发送按钮
				if(current_year==sysDate.getFullYear()){
					if (fs_status) {
						document.getElementById("input").style.display = "";
					    document.getElementById("query").style.display = "";
					    document.getElementById("cancelInput").style.display = "none";
					} else {
						document.getElementById("input").style.display = "none";
						document.getElementById("query").style.display = "";
						 document.getElementById("cancelInput").style.display = "";

					}
				}else{
					document.getElementById("input").style.display = "none";
					document.getElementById("query").style.display = "";
				}
			};
			
			//主单图标操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status=document.getElementById("fs_status").value;
				sysDate = new Date();
				if(document.getElementById("set_year" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value==sysDate.getFullYear()){
					if(status=='1'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="input(this.id)" class="iconmenu icon-input" title="补录"></a></div>';
					}else{
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="reInput(this.id)" class="iconmenu icon-input" title="再次补录"></a></div>';
					};
				};
			};
			
			//查询明细
			/*doDetail = function(id){
				//获取主单号
				var rowData = $(
						'#' + viewModel.mainViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				//viewModel.getSubsysData();
				optionsSub["id"] =rowData.id;
				optionsSub["set_year"] = $("#set_year-"+viewModel.queryViewId.substring(1, 37)).val();
				optionsSub["finance_code"] = $("#finance_code-"+viewModel.queryViewId.substring(1, 37)).val();
				ip.setGrid(viewModel.subsysGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsSub);
			};*/
			
			//根据主单查询明细
			getDetail = function(){
				var id = viewModel.mainGridViewModel.gridData.getFocusIndex();
				var rowData = $(
						'#' + viewModel.mainViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				optionsSub["id"] =rowData.id;
				optionsSub["finance_code"] = $("#finance_code-"+viewModel.queryViewId.substring(1, 37)).val();
				optionsSub["set_year"] = optionsMain["set_year"];
				ip.setGrid(viewModel.subsysGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
						+ viewModel.tokenid, optionsSub);
			};
			
			//发送状态改变
			fGetGrid = function() {
				fs_show();
				var status=document.getElementById("fs_status").value;
				if(status=='1'){
					optionsMain["status"] = EBankConstant.WfStatus.TODO_001;
					optionsSub["status"] = EBankConstant.WfStatus.TODO_001;
				}else{
					optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
					optionsSub["status"] = EBankConstant.WfStatus.AUDITED_002;
				}
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainGridViewModel,EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid,optionsMain);
				viewModel.subsysGridViewModel.gridData.clear();
				viewModel.subsysGridViewModel.gridData.totalRow(0);
			};
			
			//获取查询区参数
			viewModel.getQueryView = function(){
				var year=document.getElementById("set_year" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return false;
				}
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.queryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.queryViewId.substring(1, 37)+2)).value;
				var payMoney = document.getElementById("pay_money"
						+ "-" + viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					optionsMain["condition"]=optionsMain["condition"]+"and bill_no='"+billNO+"'";
				}
				if(startTime!=null&&startTime!=''){
					optionsMain["condition"]=optionsMain["condition"]+"and create_date>='"+startTime+"'";
				}
				if(endTime!=null&&endTime!=''){
					endTime=dateAddOneDay(endTime);
					optionsMain["condition"]=optionsMain["condition"]+"and create_date<'"+endTime+"'";
				}
				if(payMoney!=null&&payMoney!=''){
					optionsMain["condition"]=optionsMain["condition"]+"and pay_money='"+payMoney+"'";
				}
				optionsMain["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["set_year"] =document.getElementById("set_year" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
			};
			
			//查询区财政机构
			viewModel.getFinanceCode = function() {
				$.ajax({
					url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid=" + viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : optionsMain,
					async : false,
					success : function(datas) {
						if (datas.errorCode == "0") {
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code"
										+ "-"
										+ viewModel.queryViewId.substring(
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
			
			//查询区年度
			viewModel.getYear = function() {
				$.ajax({
					url :  EBankConstant.CommonUrl.getEnabledYearData+"?tokenid="
							+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					async : false,
					success : function(datas) {
						if (datas.errorCode == "0") {
							var sysDate = new Date();
							var x = document.getElementById("set_year"
									+ "-"
									+ viewModel.queryViewId.substring(
											1, 37));
							x.options[0].disabled="false";
							x.disabled="false";
							for ( var i = 0; i < datas.setYear.length; i++) {
								
								var option = document
										.createElement("option");

								option.value = datas.setYear[i].set_year;
								option.text = datas.setYear[i].year_name;
								if(datas.setYear[i].set_year==sysDate.getFullYear()){
									  option.defaultSelected = true;
								         option.selected = true;
								}
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								};
							};
							fs_show();
						} else {
							ip.ipInfoJump("加载参数失败！原因：" + datas.result,
									"error");
						};
					}
				});
			};
			
			//查询按钮
			viewModel.query = function(){
				if(requesting){
					return;
				}
				requesting=true;
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", optionsMain);
				
				viewModel.subsysGridViewModel.gridData.clear();
				viewModel.subsysGridViewModel.gridData.totalRow(0);
				requesting=false;
			};

			
			//初始化视图信息
			viewModel.initData = function() {
				$.ajax({
					url : "/df/init/initMsg.do?tokenid="
					+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					async : true,
					data : optionsMain,
					success : function(datas) {
						viewModel.viewList = datas.viewlist;// 视图信息
						viewModel.resList = datas.reslist;// 资源信息
						viewModel.coaId = datas.coaId;// coaid
						viewModel.coaDetails = datas.coaDetail;// coa明细
						viewModel.relations = datas.relationlist;// 关联关系
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							var status = document.getElementById("fs_status").value;
							//001：录入视图、002：列表视图、003：查询视图、004：详细显示视图、005：Toolbar视图、101：路由视图
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST ) {// 列表视图
								if (view.orders == "1") {//主单
									viewModel.mainViewId = view.viewid;
									optionsMain["tableViewId"] = view.viewid;
									optionsMain["queryViewId"] = viewModel.queryViewId;
									optionsMain["isSetValue"] = "false";
									//viewModel.mainGridViewModel = ip.initGrid(view, 'modalMianGridArea', EBankConstant.CommonUrl.query+"/doFind.do", optionsMain, 0, true);
									optionsMain["isDetailQuery"] = "false";
									optionsMain["pageInfo"] = "10,0,";
									optionsMain["queryTable"] = EBankConstant.PayTables.EBANK_AGENT_BILL;
									optionsMain["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									optionsMain["isWorkFlowRelated"] = "true";
									optionsMain["relationBillId"] = "agent_bill_id";
									if(status == "1"){
										optionsMain["status"] = EBankConstant.WfStatus.TODO_001;
									}else{
										optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
									}
									optionsMain["set_year"] = optionsMain["svSetYear"];
									optionsMain["finance_code"] = "000000";
									/*viewModel.getQueryView();*/
									viewModel.mainGridViewModel = ip.initGrid(view, 'modalMainGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsMain, 1, true);
								} else if (view.orders == "2") {//明细单
									viewModel.subsysViewId = view.viewid;
									optionsSub["tableViewId"] = view.viewid;
									optionsSub["isSetValue"] = "false";
									optionsSub["isDetailQuery"] = "true";
									optionsSub["pageInfo"] = "10,0,";
									optionsSub["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									optionsSub["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									optionsSub["isWorkFlowRelated"] = "false";
									optionsSub["relationBillId"] = "agent_bill_id";
									optionsSub["set_year"] = optionsSub["svSetYear"];
									if(status == "1"){
										optionsSub["status"] = EBankConstant.WfStatus.TODO_001;
									}else{
										optionsSub["status"] = EBankConstant.WfStatus.AUDITED_002;
									}
									viewModel.subsysGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsSub, 0, false);
								};
							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){//查询视图
								viewModel.queryViewId = view.viewid;
								viewModel.planSearchViewModel = ip.initArea(view.viewDetail,"search", view.viewid.substring(1,37),"modalQueryGridArea");
								viewModel.getFinanceCode();
								viewModel.getYear();
							}else{}
						}
					}
				});
			};
			
			

			
			//清空
			viewModel.doClearAgentRefundBillInput=function(){
				$("#pay_entrust_date").val("");
				$("#pay_msg_no").val("");
				$("#pay_dictate_no").val("");

			}
			
			
			//保存
			viewModel.doSaveAgentRefundBillInput=function(){
				var patt1=/^[0-9]*$/;
					var pay_dictate_no= document.getElementById('pay_dictate_no').value;
					var pay_msg_no= document.getElementById('pay_msg_no').value.trim();
					var pay_entrust_date= document.getElementById('pay_entrust_date').value;
					pay_dictate_no=pay_dictate_no.trim();
					if(pay_entrust_date==''||pay_entrust_date==null){
						ip.warnJumpMsg("请输入交易委托日期！！！",0,0,true);
						return;
					}
					if(pay_dictate_no==''||pay_dictate_no==null){
						ip.warnJumpMsg("请输入支付交易序号！！！",0,0,true);
						return;
					}
					if(!patt1.test(pay_dictate_no)||pay_dictate_no.length!=8){
						ip.warnJumpMsg("支付交易序号是8位数字！！！",0,0,true);
						return;
					}
					if(pay_msg_no==''||pay_msg_no==null){
						ip.warnJumpMsg("请输入支付报文编号！！！",0,0,true);
						return;
					}
					optionsMain["pay_dictate_no"]=pay_dictate_no;
					optionsMain["pay_msg_no"]=pay_msg_no;
					optionsMain["pay_entrust_date"]=pay_entrust_date;

			
				
				$.ajax({
					url : baseURL+"/doRefundAgentInput.do",
					type : "POST",
					data : optionsMain,
					success : function(data) {
						if(data.flag=='1'){
							ip.warnJumpMsg("录入成功",0,0,true);
								$("#refundAgentInput").modal("hide");	
								viewModel.query();	
						}else{
							ip.warnJumpMsg("录入失败,"+data.result,0,0,true);	
						}
						viewModel.doClearAgentRefundBillInput();
						requesting=false;	
						viewModel.query();	
						
					}
				});				
			}
			
			//关闭
			viewModel.closeAgentRefundBillInput=function(){
				viewModel.doClearAgentRefundBillInput();
				$("#refundAgentInput").modal("hide");	
				viewModel.query();	
				requesting=false;
				
			}
			
			
			// 显示高级查询
			viewModel.showHighSearch = function() {
				var btn = $("#" + this + "-high-query-btn");
				btn.toggleClass("glyphicon-triangle-top");
				var searchPanel = $("#" + this + "-high-search-panel");
				searchPanel.toggleClass("hidden");
				var showOrHideSearch = $("#showOrHideSearch");
				showOrHideSearch.toggleClass("hidden");
				setGridHeight(btn);
				/* 根据上次点击情况是否显示高级查询内容 */
				if (btn.hasClass("glyphicon-triangle-top")) {
					localStorage.setItem("showHighSearch_flag", 1);
				} else {
					localStorage.setItem("showHighSearch_flag", 2);
				}
			};
			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				});
				viewModel.initData();
			});
		});
