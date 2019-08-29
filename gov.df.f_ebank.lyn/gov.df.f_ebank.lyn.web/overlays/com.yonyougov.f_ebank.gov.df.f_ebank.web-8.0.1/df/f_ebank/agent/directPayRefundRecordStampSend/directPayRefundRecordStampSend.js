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
			//optionsSub["operate_width"] =50;

			var viewModel = {
				tokenid : ip.getTokenId()
			};
			
			//构建传入后台的billNos
			buildBillNosAndFinanceCode = function(id){
				var billNosAndFinanceCode = new Array();
				if(id!=null && id!=undefined && (id+" ").trim().length > 0){//id不为空
					billNosAndFinanceCode = [];
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["bill_no"] = planData.bill_no;
					temp["finance_code"] = planData.finance_code;
					billNosAndFinanceCode.push(temp);
				}else{//id为空
					billNosAndFinanceCode = viewModel.mainGridViewModel.gridData.getSimpleData({  
						type : 'select',
						fields : [ 'bill_no','finance_code' ],
					});
				}
				return billNosAndFinanceCode;
			};
			
			//签章发送
			signSend = function(id) {
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
				
				var optionsParam = ip.getCommonOptions({});
				optionsParam["setYear"]=document.getElementById("set_year" + "-"+ viewModel.queryViewId.substring(1, 37)).value;
				optionsParam["vtCode"]=vtCode;
				optionsParam["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
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
			againSend = function(id){
				if(requesting){
					return;
				}
				requesting=true;  
				var billNosAndFinanceCode=buildBillNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					requesting=false;  
					return false;
				}
				var optionsParam = ip.getCommonOptions({});
				optionsParam["setYear"]=document.getElementById("set_year" + "-"+ viewModel.queryViewId.substring(1, 37)).value;
				optionsParam["vtCode"]=vtCode;
				optionsParam["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
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
							requesting=false; 
						}
					}
				});
			};
			
			//打印按钮
			print = function(){
				alert("打印...");
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
						document.getElementById("qzfs").style.display = "";
						//document.getElementById("dayin").style.display = "";
						document.getElementById("cxfs").style.display = "none";
						//document.getElementById("assppreview").style.display = "";
						document.getElementById("asspview").style.display = "none";
					} else {
						document.getElementById("qzfs").style.display = "none";
						//document.getElementById("dayin").style.display = "none";
						document.getElementById("cxfs").style.display = "";
						//document.getElementById("assppreview").style.display = "none";
						document.getElementById("asspview").style.display = "";
					}
				}else{
					document.getElementById("qzfs").style.display = "none";
					//document.getElementById("dayin").style.display = "none";
					document.getElementById("cxfs").style.display = "none";
					document.getElementById("asspview").style.display = "none";
					//document.getElementById("assppreview").style.display = "none";
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
						+ '" onclick="signSend(this.id)" class="iconmenu icon-sign-send" title="签章发送"></a></div>';
					}else{
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
							+ '" onclick="againSend(this.id)" class="iconmenu icon-send-again" title="重新发送"></a><a id="'
							+ obj.rowIndex
							+ '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
					};
				};
			};
			
			//根据主单查询明细
			getDetail = function(){
				var id = viewModel.mainGridViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				/*var rowData = $(
						'#' + viewModel.mainViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid.getRowByIndex(id).value;*/
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
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", optionsMain);
				viewModel.subsysGridViewModel.gridData.clear();
				viewModel.subsysGridViewModel.gridData.totalRow(0);
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
						fields : [ 'id','finance_code','set_year','bill_no' ],
					});
				}
				return	billIds;
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
									optionsMain["isDetailQuery"] = "false";
									optionsMain["pageInfo"] = "10,0,";
									optionsMain["queryTable"] = EBankConstant.PayTables.EBANK_ACC_BILL;
									optionsMain["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									optionsMain["isWorkFlowRelated"] = "true";
									//optionsMain["isWorkFlowRelated"] = "false";
									optionsMain["relationBillId"] = "acc_bill_id";
									if(status == "1"){
										optionsMain["status"] = EBankConstant.WfStatus.TODO_001;
									}else{
										optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
									}
									optionsMain["set_year"] = optionsMain["svSetYear"];
									optionsMain["finance_code"] = "000000";
									viewModel.mainGridViewModel = ip.initGrid(view, 'modalMainGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
					+ viewModel.tokenid, optionsMain, 1, true, true);
								} else if (view.orders == "2") {//明细单
									viewModel.subsysViewId = view.viewid;
									optionsSub["tableViewId"] = view.viewid;
									optionsSub["isSetValue"] = "false";
									optionsSub["isDetailQuery"] = "true";
									optionsSub["pageInfo"] = "10,0,";
									optionsSub["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									optionsSub["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
									optionsSub["isWorkFlowRelated"] = "false";
									optionsSub["relationBillId"] = "acc_bill_id";
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
			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				});
				viewModel.initData();
			});
		});
