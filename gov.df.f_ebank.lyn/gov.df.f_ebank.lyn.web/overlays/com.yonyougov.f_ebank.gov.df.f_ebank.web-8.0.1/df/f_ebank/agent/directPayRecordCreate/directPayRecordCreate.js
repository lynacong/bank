require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH',],
		function($, ko, echarts) {
			
			var requesting=false;
			var optionsMain = ip.getCommonOptions({});
			var optionsSub = ip.getCommonOptions({});
			var optionsNonCreateMain = ip.getCommonOptions({});
			var optionsNonCreateSub = ip.getCommonOptions({});
			
			var baseURL = EBankConstant.Ctx + "billStampSend";
			var vtCode=ip.getUrlParameter("vt_code");
			optionsMain["operate_width"] =50;
			optionsNonCreateMain["operate_width"] =50;

			var viewModel = {
				tokenid : ip.getTokenId()
			};

			//构建传入后台的billNos
			buildBillNosAndFinanceCode = function(id){
				var status=document.getElementById("sc_status").value;
				var billNosAndFinanceCode = new Array();
				if(id != null && id != undefined && (id + " ").trim().length > 0){//id不为空
					billNosAndFinanceCode = [];
					var planData;
					if(status == '1'){
						planData = $('#'+ viewModel.nonCreateMainViewId.substring(1,37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					}else{
						planData = $('#'+ viewModel.mainViewId.substring(1,37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					}
					var temp = {};
					temp["bill_no"] = planData.bill_no;
					temp["finance_code"] = planData.finance_code;
					billNosAndFinanceCode.push(temp);
				}else{//id为空
					if(status == '1'){
						billNosAndFinanceCode = viewModel.nonCreateMainGridViewModel.gridData.getSimpleData({
							type : 'select',
							fields : ['bill_no','finance_code'],
						});
					}else{
						billNosAndFinanceCode = viewModel.mainGridViewModel.gridData.getSimpleData({
							type : 'select',
							fields : ['bill_no','finance_code'],
						});
					}
				}
				return billNosAndFinanceCode;
			};
			
			//构建传入后台的billNos
			buildVoucherNosAndFinanceCode = function(id){
				var status=document.getElementById("sc_status").value;
				var billVouchersAndFinanceCode = new Array();
					billVouchersAndFinanceCode = viewModel.subsysGridViewModel.gridData.getSimpleData({
							type : 'select',
							fields : ['voucher_no','finance_code'],
						});
				return billVouchersAndFinanceCode;
			};
			
			//生成按钮
			doCreate = function(id){
				if(requesting){
					return;
				}
				requesting = true;
				var billNosAndFinanceCode = buildVoucherNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length == 0){
					ip.warnJumpMsg("请选择要生成的数据!",0,0,true);
					requesting = false;
					return;
				}
				var optionsNonCreateMain = ip.getCommonOptions({});
				optionsNonCreateMain["setYear"] = document.getElementById("set_year" + "-" + viewModel.queryViewId.substring(1, 37)).value;
				optionsNonCreateMain["vtCode"] = ip.getUrlParameter("vt_code");
				optionsNonCreateMain["oriCode"] = ip.getUrlParameter("ori_code");
				optionsNonCreateMain["billnosAndFinanceCode"] = JSON.stringify(billNosAndFinanceCode);
				optionsNonCreateMain["ajax"] = "nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCreateBill+"?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsNonCreateMain,
					success : function(data){
						if(data.flag == "0"){
							viewModel.getNonCreateData();
							ip.warnJumpMsg(data.result, 0, 0, true);
							requesting = false;
						}else{
							viewModel.getNonCreateData();
							ip.warnJumpMsg("生成成功", 0, 0, true);
							requesting = false;
						}
					}
				});
			};
			
			//撤销生成
			recallCreate = function(id){
				if(requesting){
					return;
				}
				requesting = true;
				var billNosAndFinanceCode = buildBillNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length == 0){
					ip.warnJumpMsg("请选择要撤销的数据!",0,0,true);
					requesting = false;
					return;
				}
				optionsMain["setYear"] = document.getElementById("set_year" + "-" + viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["vtCode"] = ip.getUrlParameter("vt_code");
				optionsMain["oriCode"] = ip.getUrlParameter("ori_code");
				optionsMain["billnosAndFinanceCode"] = JSON.stringify(billNosAndFinanceCode);
				optionsMain["ajax"] = "nocache";
				$.ajax({
					url : EBankConstant.CommonUrl.doCancelCreateBill+"?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsMain,
					success : function(data){
						if(data.flag == "0"){
							viewModel.getMainData();
							ip.warnJumpMsg(data.result, 0, 0, true);
							requesting = false;
						}else{
							viewModel.getMainData();
							ip.warnJumpMsg("撤销成功", 0, 0, true);
							requesting = false;
						}
					}
				});
			};
			
			//查询按钮
			viewModel.query = function(){
				if(requesting){
					return;
				}
				requesting=true;
				var sc_status = document.getElementById("sc_status").value;
				if(sc_status == '1'){
					viewModel.getNonCreateData();
				}else{
					viewModel.getMainData();
				}
				requesting=false;
			};

			//打印按钮
			print = function(){
				alert("print...");
			};
			
			//生成状态变化事件
			fGetGrid = function(){
				var sc_status = document.getElementById("sc_status")[0].selected;
				var current_year = document.getElementById("set_year" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
				var sysDate = new Date();
				//选择非本年度时，隐藏签章发送及重新发送按钮
				if(current_year==sysDate.getFullYear()){
					if (sc_status) {
						document.getElementById("scBtn").style.display = "";
						document.getElementById("cxscBtn").style.display = "none";
						//document.getElementById("tydyBtn").style.display = "none";
						document.getElementById("zfpzorrztzs").innerText = "支付凭证明细：";
						document.getElementById("rztzsmx").innerText = "";
						document.getElementById("mainDiv").style.display = "none";
						//document.getElementById("subDiv").style.display = "none";
						//document.getElementById("nonCreateMainDiv").style.display = "";
						//document.getElementById("nonCreateSubDiv").style.display = "";
						viewModel.getNonCreateData();
					} else {
						document.getElementById("scBtn").style.display = "none";
						document.getElementById("cxscBtn").style.display = "";
						//document.getElementById("tydyBtn").style.display = "";
						document.getElementById("zfpzorrztzs").innerText = "入账通知书：";
						document.getElementById("rztzsmx").innerText = "支付凭证明细：";
						document.getElementById("mainDiv").style.display = "";
						//document.getElementById("subDiv").style.display = "";
						//document.getElementById("nonCreateMainDiv").style.display = "none";
						//document.getElementById("nonCreateSubDiv").style.display = "none";
						viewModel.getMainData();
						viewModel.subsysGridViewModel.gridData.clear();
						viewModel.subsysGridViewModel.gridData.totalRow(0);
					}
				}else{
					document.getElementById("scBtn").style.display = "none";
					document.getElementById("cxscBtn").style.display = "none";
					//document.getElementById("tydyBtn").style.display = "none";
				}
			};
			
			//获取查询区参数（未生成时）
			viewModel.getNonCreateQueryView = function(){
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
				optionsNonCreateSub["condition"]='1=1 ';
				if(billNO!=null&&billNO!=''){
					optionsNonCreateSub["condition"]=optionsNonCreateSub["condition"]+"and voucher_bill_no='"+billNO+"'";
				}
				if(startTime!=null&&startTime!=''){
					optionsNonCreateSub["condition"]=optionsNonCreateSub["condition"]+"and create_date>='"+startTime+"'";
				}
				if(endTime!=null&&endTime!=''){
					endTime=dateAddOneDay(endTime);
					optionsNonCreateSub["condition"]=optionsNonCreateSub["condition"]+"and create_date<'"+endTime+"'";
				}
				if(payMoney!=null&&payMoney!=''){
					optionsNonCreateSub["condition"]=optionsNonCreateSub["condition"]+"and pay_money='"+payMoney+"'";
				}
				optionsNonCreateSub["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
				optionsNonCreateSub["set_year"] =document.getElementById("set_year" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
			};
			
			//获取查询区参数（生成时）
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
				}if(payMoney!=null&&payMoney!=''){
					optionsMain["condition"]=optionsMain["condition"]+"and pay_money='"+payMoney+"'";
				}
				optionsMain["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
				optionsMain["set_year"] =document.getElementById("set_year" + "-"
						+ viewModel.queryViewId.substring(1, 37)).value;
			};
			
			//更新未生成状态下的列表信息
			viewModel.getNonCreateData = function(){
				viewModel.getNonCreateQueryView();
				//optionsNonCreateMain["status"] = EBankConstant.WfStatus.TODO_001;
				ip.setGrid(viewModel.subsysGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", optionsNonCreateSub);
				//viewModel.subsysGridViewModel.gridData.clear();
				//viewModel.subsysGridViewModel.gridData.totalRow(0);
			};
			
			//更新生成状态下的列表信息
			viewModel.getMainData = function() {
				viewModel.getQueryView();
				optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
				ip.setGrid(viewModel.mainGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do", optionsMain);
				viewModel.subsysGridViewModel.gridData.clear();
				viewModel.subsysGridViewModel.gridData.totalRow(0);
			};
			
			//生成时单据上的图表操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
						+ '" onclick="recallCreate(this.id)" class="iconmenu icon-back-prev" title="撤销生成"></a><div>';
			};
			
			//未生成时单据上的图标操作
		/*	modelNonCreateMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
					+ obj.rowIndex
					+ '" onclick="doCreate(this.id)" class="iconmenu icon-generate" title="生成"></a><div>';
			};*/
			
			//根据主单查询明细（未生成时）
			getDetailNonCreate = function(){
				var id = viewModel.nonCreateMainGridViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.nonCreateMainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				optionsNonCreateSub["id"] =rowData.id;
				optionsNonCreateSub["finance_code"] = $("#finance_code-"+viewModel.queryViewId.substring(1, 37)).val();
				optionsNonCreateSub["set_year"] = optionsMain["set_year"];
				optionsNonCreateSub["relationBillId"] = "voucher_bill_id";
				optionsNonCreateSub["status"] = EBankConstant.WfStatus.TODO_001;
				ip.setGrid(viewModel.subsysGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
						+ viewModel.tokenid, optionsNonCreateSub);
			};
			
			//根据主单查询明细（已生成时）
			getDetail = function(){
				var id = viewModel.mainGridViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				optionsSub["id"] =rowData.id;
				optionsSub["finance_code"] = $("#finance_code-"+viewModel.queryViewId.substring(1, 37)).val();
				optionsSub["set_year"] = optionsMain["set_year"];
				optionsSub["relationBillId"] = "acc_bill_id";
				optionsSub["status"] = EBankConstant.WfStatus.AUDITED_002;
				ip.setGrid(viewModel.subsysGridViewModel, EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
						+ viewModel.tokenid, optionsSub);
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
						} else {
							ip.ipInfoJump("加载参数失败！原因：" + datas.result,
									"error");
						};
					}
				});
			};
			
			//初始化信息
			viewModel.initData = function() {
				document.getElementById("zfpzorrztzs").innerText = "支付凭证明细：";
				document.getElementById("rztzsmx").innerText = "";
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
					var status = $("#sc_status option:selected").val();
					for ( var n = 0; n < viewModel.viewList.length; n++) {
						var view = viewModel.viewList[n];
						//001：录入视图、002：列表视图、003：查询视图、004：详细显示视图、005：Toolbar视图、101：路由视图
						if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST ) {// 列表视图
							/*if (view.orders == "1") {//支付凭证
								viewModel.nonCreateMainViewId = view.viewid;
								optionsNonCreateMain["tableViewId"] = view.viewid;
								optionsNonCreateMain["queryViewId"] = viewModel.queryViewId;
								optionsNonCreateMain["isSetValue"] = "false";
								optionsNonCreateMain["isDetailQuery"] = "false";//是否查询明细
								optionsNonCreateMain["pageInfo"] = "10,0,";
								optionsNonCreateMain["queryTable"] = EBankConstant.PayTables.EBANK_PAY_BILL;
								optionsNonCreateMain["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsNonCreateMain["isWorkFlowRelated"] = "true";
								optionsNonCreateMain["relationBillId"] = "voucher_bill_id";
								if(status == "1"){
									optionsNonCreateMain["status"] = EBankConstant.WfStatus.TODO_001;
								}else{
									optionsNonCreateMain["status"] = EBankConstant.WfStatus.AUDITED_002;
								}
								optionsNonCreateMain["set_year"] = optionsMain["svSetYear"];
								optionsNonCreateMain["finance_code"] = "000000";
								viewModel.nonCreateMainGridViewModel = ip.initGrid(view, 'modelNonCreateMainGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
				+ viewModel.tokenid, optionsNonCreateMain, 1, true, true);
							} else*/ if (view.orders == "2") {//入账通知书
								viewModel.mainViewId = view.viewid;
								optionsMain["tableViewId"] = view.viewid;
								optionsMain["isSetValue"] = "false";
								optionsMain["isDetailQuery"] = "false";
								optionsMain["pageInfo"] = "10,0,";
								optionsMain["queryTable"] = EBankConstant.PayTables.EBANK_ACC_BILL;
								optionsMain["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsMain["isWorkFlowRelated"] = "true";
								optionsMain["relationBillId"] = "acc_bill_id";
								if(status == "1"){
									optionsMain["status"] = EBankConstant.WfStatus.TODO_001;
								}else{
									optionsMain["status"] = EBankConstant.WfStatus.AUDITED_002;
								}
								optionsMain["set_year"] = optionsMain["svSetYear"];
								viewModel.mainGridViewModel = ip.initGrid(view, 'modalMainGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
				+ viewModel.tokenid, optionsMain, 0, true, true);
							} else if (view.orders == '3') {//入账通知书明细
								viewModel.subsysViewId = view.viewid;
								//viewModel.nonCreateSubViewId = view.viewid;
								optionsSub["tableViewId"] = view.viewid;
								optionsSub["isSetValue"] = "false";
								optionsSub["isDetailQuery"] = "true";
								optionsSub["pageInfo"] = "10,0,";
								optionsSub["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsSub["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsSub["isWorkFlowRelated"] = "false";
								optionsSub["relationBillId"] = "acc_bill_id";
								optionsSub["set_year"] = optionsSub["svSetYear"];
								optionsNonCreateSub["tableViewId"] = view.viewid;
								optionsNonCreateSub["isSetValue"] = "false";
								optionsNonCreateSub["isDetailQuery"] = "true";
								optionsNonCreateSub["pageInfo"] = "10,0,";
								optionsNonCreateSub["queryTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsNonCreateSub["detailTable"] = EBankConstant.PayTables.EBANK_PAY_DETAIL;
								optionsNonCreateSub["isWorkFlowRelated"] = "true";
								optionsNonCreateSub["set_year"] = optionsSub["svSetYear"];
								optionsNonCreateSub["finance_code"] = "000000";
								optionsNonCreateSub["isWorkFlowRelated"] = "true";
								if(status == "1"){
									optionsNonCreateSub["status"] = EBankConstant.WfStatus.TODO_001;
								}else{
									optionsNonCreateSub["status"] = EBankConstant.WfStatus.AUDITED_002;
								}
								/*viewModel.nonCreateSubGridViewModel = ip.initGrid(view, 'modelNonCreateSubGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
										+ viewModel.tokenid, optionsNonCreateSub, 0, true);*/
								viewModel.subsysGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', EBankConstant.CommonUrl.query+"/doFind.do?tokenid="
										+ viewModel.tokenid, optionsNonCreateSub, 1, false);
							};
						}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){//查询视图
							viewModel.queryViewId = view.viewid;
							viewModel.planSearchViewModel = ip.initArea(view.viewDetail,"search", view.viewid.substring(1,37),"modalQueryGridArea");
							viewModel.getFinanceCode();
							viewModel.getYear();
						}
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
