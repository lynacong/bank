require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH',],
		function($, ko, echarts) {
			var requesting=false;
			var optionsMain = ip.getCommonOptions({});
			var optionsSub = ip.getCommonOptions({});
			
			var baseURL = EBankConstant.Ctx + "billStampSend";
			var vtCode=ip.getUrlParameter("vt_code");
			optionsMain["operate_width"] =80;
			optionsSub["operate_width"] =50;

			var viewModel = {
				tokenid : ip.getTokenId()
			};
			
			//构建传入后台的billNos
			billnosAndFinanceCode = function(id){
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
			
			//签章发送
			signSend = function(id) {
				if(requesting){
					return;
				}
				requesting=true;
				var billnosAndFinanceCodes =  billnosAndFinanceCode(id);
				if(billnosAndFinanceCodes.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false; 
					return false;
				}
				
				var optionsParam = ip.getCommonOptions({});
				optionsParam["setYear"]=$("#set_year").val();
				optionsParam["vtCode"]=vtCode;
				optionsParam["billnosAndFinanceCode"]=JSON.stringify(billnosAndFinanceCodes);
				optionsParam["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doSignSend.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsParam,
					success : function(data){
						if(data.is_success=="0"){
							viewModel.query();
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
							requesting=false; 
						}else{
							viewModel.query();
							ip.warnJumpMsg("签章发送成功", 0, 0, true);
							requesting=false; 

						}
					}
				});
			};
			
			//重新发送
			reSend = function(id){
				if(requesting){
					return;
				}
				requesting=true; 
				var billnosAndFinanceCodes=billnosAndFinanceCode(id);
				if(billnosAndFinanceCodes.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false; 
					return false;
				}
				var optionsParam = ip.getCommonOptions({});
				optionsParam["setYear"]=$("#set_year").val();
				optionsParam["vtCode"]=vtCode;
				optionsParam["billnosAndFinanceCode"]=JSON.stringify(billnosAndFinanceCodes);
				optionsParam["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doAgainSend.do?tokenid="
						+ viewModel.tokenid,
					type : "POST",
					data :optionsParam,
					success : function(data) {
						if(data.is_success=="0"){
							viewModel.query();
							ip.warnJumpMsg(data.error_msg,0,0,true);
							requesting=false; 
						}else{
							viewModel.query();
							ip.warnJumpMsg("重新发送成功",0,0,true);
							requesting= false; 
						}
					}
				});
			};
			
			//刷新按钮
			viewModel.refresh= function(status) {
				//清空页面单号输入框
				$("#bill_no").val("");
				optionsMain["condition"]='';
				ip.setGrid(viewModel.mainGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsMain);
				viewModel.subsysGridViewModel.gridData.clear();
				viewModel.subsysGridViewModel.gridData.totalRow(0);
			};
			
			//查询按钮
			viewModel.query = function(){
				getMainData();
			};
			
			// 发送按钮显示设置
			fs_show = function() {
				var fs_status = document.getElementById("fs_status")[0].selected;
				sysDate = new Date();
				//选择非本年度时，隐藏签章发送及重新发送按钮
				if(document.getElementById("set_year").value==sysDate.getFullYear()){
					if (fs_status) {
						document.getElementById("qzfs").style.display = "";
						document.getElementById("cxfs").style.display = "none";
						document.getElementById("asspview").style.display = "none";
					} else {
						document.getElementById("qzfs").style.display = "none";
						document.getElementById("cxfs").style.display = "";
						document.getElementById("asspview").style.display = "";
					}
				}else{
					document.getElementById("qzfs").style.display = "none";
					document.getElementById("cxfs").style.display = "none";
					document.getElementById("asspview").style.display = "none";
				}
			};
			
			//主单
			/*viewModel.getMainData = function(){
				optionsMain["id"] = null;
				optionsMain["tableViewId"] = viewModel.mainViewId;
				optionsMain["isDetailQuery"] = "false";
				optionsMain["queryTable"] = EBankConstant.PlanTables.PLAN_AGENT_BILL;
				optionsMain["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
				optionsMain["isWorkFlowRelated"] = "true";
				optionsMain["pageInfo"] = "10,0";
				optionsMain["relationBillId"] = "agent_bill_id";
				optionsMain["condition"] = "and bill_no like'%"+$("#bill_no").val()+"%'";
			};*/
			
			//明细
			/*viewModel.getSubsysData = function() {
				optionsSub["tableViewId"] = viewModel.subsysViewId;
				optionsSub["isDetailQuery"] = "true";
				optionsSub["queryTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
				optionsSub["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
				optionsSub["isWorkFlowRelated"] = "false";
				optionsSub["pageInfo"] = "20,0";
				optionsSub["relationBillId"] = "agent_bill_id";
			};*/
			
			//主单图标操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status=document.getElementById("fs_status").value;
				sysDate = new Date();
				if(document.getElementById("set_year").value==sysDate.getFullYear()){
					if(status=='1'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
						+ '" onclick="signSend(this.id)" class="iconmenu icon-sign-send" title="签章发送"></a></div>';
					}else{
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="reSend(this.id)" class="iconmenu icon-send-again" title="重新发送"></a><a id="'
							+ obj.rowIndex
							+ '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					};
				};
			};
			
			//查询明细
			doDetail = function(id){
				//获取主单号
				var rowData = $(
						'#' + viewModel.mainViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				//viewModel.getSubsysData();
				optionsSub["id"] =rowData.id;
				ip.setGrid(viewModel.subsysGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsSub);
			};
			
			getDetail = function(){
				var id = viewModel.mainGridViewModel.gridData.getFocusIndex();
				doDetail(id);
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
				ip.setGrid(viewModel.mainGridViewModel,EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid,optionsMain);
				viewModel.subsysGridViewModel.gridData.clear();
				viewModel.subsysGridViewModel.gridData.totalRow(0);
			};
			
			//财政机构变化
			orgChange= function() {
				var financeCode=document.getElementById("finance_code").value;
				optionsMain["finance_code"] = financeCode;
				optionsSub["finance_code"] = financeCode;
				//viewModel.getMainData();
				getMainData();
			};
			
			//年度变化
			yearChange= function() {
				optionsMain["set_year"] = document.getElementById("set_year").value;
				optionsSub["set_year"] = document.getElementById("set_year").value;
				//viewModel.getMainData();
				getMainData();
			};
			
			//月份改变事件
			monthChange= function() {
				optionsMain["set_month"] =document.getElementById("set_month").value;
				optionsSub["set_month"] =document.getElementById("set_month").value;
				
				//viewModel.getMainData();
				getMainData();
			};
			
			
			
			getMainData = function() {
				var status=document.getElementById("fs_status").value;
				if(status=='1'){
					optionsMain["status"] = EBankConstant.WfStatus.TODO_001;
				}else{
					optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
					
				}
				optionsMain["finance_code"] = document.getElementById("finance_code").value;
	            optionsMain["set_year"] = document.getElementById("set_year").value;
	            var billNo = $("#bill_no").val();
				if(document.getElementById("set_month").value=="0"){
					
				    if(billNo==null||billNo=="")
					    optionsMain["condition"]="";
				    else{
				    	optionsMain["condition"] = " bill_no like'%"+$("#bill_no").val()+"%'";	
				    }	
				}else{
					optionsMain["condition"]="set_month = '"+ document.getElementById("set_month").value+"'";
					if(billNo!=null&&billNo!=""){
						optionsMain["condition"]=optionsMain["condition"]+" and bill_no like'%"+$("#bill_no").val()+"%'";	
					}
				}
						//mainOptions["pageInfo"] = "20,0,";
				    viewModel.mainGridViewModel.gridData.clear();
				    viewModel.mainGridViewModel.gridData.totalRow(0);
					ip.setGrid(viewModel.mainGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", optionsMain);
					viewModel.subsysGridViewModel.gridData.clear();
					viewModel.subsysGridViewModel.gridData.totalRow(0);
					
			}
			
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
						//viewModel.coaId = datas.coaId;// coaid
						//viewModel.coaDetails = datas.coaDetail;// coa明细
						//viewModel.relations = datas.relationlist;// 关联关系
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							var status = document.getElementById("fs_status").value;
							//001：录入视图、002：列表视图、003：查询视图、004：详细显示视图、005：Toolbar视图、101：路由视图
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST ) {// 列表视图
								if (view.orders == "1") {//主单
									viewModel.mainViewId = view.viewid;
									optionsMain["id"] = null;
									optionsMain["tableViewId"] = view.viewid;
									optionsMain["isSetValue"] = "false";
									optionsMain["isDetailQuery"] = "false";
									optionsMain["pageInfo"] = "10,0,";
									optionsMain["queryTable"] = EBankConstant.PlanTables.PLAN_AGENT_BILL;
									optionsMain["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
									optionsMain["isWorkFlowRelated"] = "true";
									optionsMain["relationBillId"] = "agent_bill_id";
									optionsMain["finance_code"] = document.getElementById("finance_code").value;
									optionsMain["set_year"] = document.getElementById("set_year").value;
									optionsMain["set_month"] = document.getElementById("set_month").value;
									if(status == "1"){
										optionsMain["status"] = EBankConstant.WfStatus.TODO_001;
									}else{
										optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
									}
									viewModel.mainGridViewModel = ip.initGrid(view, 'modalMainGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsMain, 1, true, true);
								} else if (view.orders == "2") {//明细单
									viewModel.subsysViewId = view.viewid;
									optionsSub["tableViewId"] = view.viewid;
									optionsSub["isSetValue"] = "false";
									optionsSub["isDetailQuery"] = "true";
									optionsSub["pageInfo"] = "10,0,";
									optionsSub["queryTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
									optionsSub["detailTable"] = EBankConstant.PlanTables.PLAN_VOUCHER;
									optionsSub["isWorkFlowRelated"] = "false";
									optionsSub["relationBillId"] = "agent_bill_id";
									optionsSub["finance_code"] = document.getElementById("finance_code").value;
									optionsSub["set_year"] = document.getElementById("set_year").value;
									optionsSub["set_month"] = document.getElementById("set_month").value;
									//viewModel.getSubsysData();
									if(status == "1"){
										optionsSub["status"] = EBankConstant.WfStatus.TODO_001;
									}else{
										optionsSub["status"] = EBankConstant.WfStatus.AUDITED_002;
									}
									viewModel.subsysGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsSub, 0, false);
								};
							}else{}
						}
					}
				});
			};
			
			//初始化财政机构
			viewModel.initAllFinances = function() {
				$.ajax({
					url : EBankConstant.CommonUrl.getFinanceData+"?tokenid=" + viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : optionsMain,
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
			
			//初始化年度
			viewModel.initYear = function() {
				$.ajax({
					url :  EBankConstant.CommonUrl.getEnabledYearData+"?tokenid="
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
							viewModel.initData();
						} else {
							ip.ipInfoJump("加载参数失败！原因：" + datas.result,
									"error");
						}
						fs_show();
					}
				});
			};
			
			
			
			// 凭证查看
			doVoucherSee = function(id, evt) {
				var e = evt || window.event;
				//$('#planCheckModalDetail').modal('show');
				var billIds = buildBillIds(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					return;
				}
				doAsspVoucherSee(billIds,evt,vtCode);
				window.event ? e.cancelBubble = true : e.stopPropagation();
			};
						
			//预览
			doVoucherPreview = function(id, evt) {
				var e = evt || window.event;
				//$('#planCheckModalDetail').modal('show');
				var billIds = buildBillIds(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证预览",0,0,true);
					return;
				}
				
				doAsspVoucherPreview(billIds,evt,vtCode);
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
					billIds = viewModel.mainGridViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','set_year','bill_no' ]
					});
					
					//var planData = $('#' + options["tableViewId"].substring(1, 37) + '').parent()[0]['u-meta'].grid.getSelectRows();
				}
				return	billIds;
			};
			
			//初始化财政和年度
			viewModel.initParam = function(){
				viewModel.initAllFinances();
				viewModel.initYear();
			};
			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				});
				//初始化财政、年度、月份等信息
				viewModel.initParam();
				//fs_show();
			});
		});
