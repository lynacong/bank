require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;			
			var mainOptions = ip.getCommonOptions({});
			var mainDoneOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var payRefundListOptions = ip.getCommonOptions({});
			var vt_code = ip.getUrlParameter("vt_code");
			var type = ip.getUrlParameter("type");//签章 sign  发送 send  签章发送 signsend
			var queryURL=EBankConstant.Ctx + "pay/payClear";
			var baseURL = EBankConstant.Ctx + "billStampSend";
			mainOptions["operate_width"] =80;
			mainOptions["oriCode"]=ip.getUrlParameter("ori_code");
			mainDoneOptions["oriCode"]=ip.getUrlParameter("ori_code");
			voucherOptions["oriCode"]=ip.getUrlParameter("ori_code");
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
			
			//构建传入后台的billNos签章发送使用
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
					billNosAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  
						type : 'select',
						fields : [ 'bill_no','finance_code' ],
					});
				}
				return billNosAndFinanceCode;
			};
			
			//签章
			sign = function(id){
				var billNosAndFinanceCode =  buildBillNosAndFinanceCode(id);
				if(billNosAndFinanceCode.length==0){
					ip.warnJumpMsg("请选择数据！！！",0,0,true);
					return false;
				}
				var optionsParam = ip.getCommonOptions({});
				optionsParam["setYear"]=document.getElementById("set_year" + "-"+ viewModel.QueryViewId.substring(1, 37)).value;
				optionsParam["vtCode"]=ip.getUrlParameter("vt_code");
				optionsParam["billnosAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				optionsParam["ajax"]="nocache";
				$.ajax({
					url : baseURL+"/doSignOnly.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsParam,
					success : function(data){
						if(data.is_success=="0"){
							fGetGrid();
							ip.warnJumpMsg(data.error_msg, 0, 0, true);
						}else{
							fGetGrid();
							ip.warnJumpMsg("签章发送成功", 0, 0, true);
						}
					}
				});
			
			};
			
			//退回
			callBackBill = function(id) {
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
				optionsParam["set_year"]=document.getElementById("set_year" + "-"+ viewModel.queryViewId.substring(1, 37)).value;
				optionsParam["vt_code"]=ip.getUrlParameter("vt_code");;
				optionsParam["billIdsAndFinanceCode"]=JSON.stringify(billNosAndFinanceCode);
				optionsParam["ajax"]="nocache";
				$.ajax({
					url : "/df/f_ebank/agent/doBackAgentBill.do?tokenid="
					+ viewModel.tokenid,
					type : "POST",
					data : optionsParam,
					success : function(data){
						if(data.flag=="0"){
							viewModel.query();
							ip.warnJumpMsg(data.result, 0, 0, true);
							requesting=false; 
						}else{
							viewModel.query();
							ip.warnJumpMsg("退回成功", 0, 0, true);
							requesting=false;  

						}
					}
				});
			};

			
			//凭证查看
			doVoucherSee=function(id, evt){
				if(requesting){
					return;
				}
				requesting=true;
				var e = evt || window.event;
				var billIds =buildBillIds(id);
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					requesting=false;
					return;
				}
				doAsspVoucherSee(billIds,evt,vt_code);
				window.event ? e.cancelBubble = true : e.stopPropagation();
				requesting=false;
			};
			//构建凭证查看的参数
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
					billIds = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','set_year','bill_no' ]
					});
				}
				return	billIds;
			};
			
			//查询
			viewModel.fSelect=function(){
				fGetGrid();
			};
			
			//点击主单查询明细
			getDetail=function(){
				var status = $("#pz_status option:selected").val();
				var rowData=viewModel.mainViewModel.gridData.getFocusRow().data;
				voucherOptions["bill_no"] =rowData.bill_no.value;
				voucherOptions["finance_code"] = rowData.finance_code.value;
				voucherOptions["set_year"] = mainOptions["set_year"];
				ip.setGrid(viewModel.voucherGridViewModel, queryURL+"/loadPayClearDetailData.do", voucherOptions);
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
									mainOptions["status"] = status;
									//viewModel.getQueryView();
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] ="000000";
									mainOptions["set_year"] =mainOptions["svSetYear"];
									viewModel.mainViewModel = ip.initGrid(view, 'modalMainGridArea', queryURL+"/loadPayClearBillData.do", mainOptions, 1, true);
								} else if (view.orders == '2') {
									voucherOptions["tableViewId"] = view.viewid;
									voucherOptions["isSetValue"] = "false";
									voucherOptions["isDetailQuery"] = "true";  //是否查询明细
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] =voucherOptions["svSetYear"];
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', queryURL+"/loadPayClearDetailData.do", voucherOptions, 0, false);
								}

							}else if(view.viewtype == EBankConstant.ViewType.VIEWTYPE_QUERY){
								if (view.orders == '1'){
									viewModel.QueryViewId = view.viewid;
									viewModel.paySearchViewModel = ip.initArea(view.viewDetail,"search", view.viewid.substring(1,37),"paySearchArea");
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
			        		document.getElementById("sign").style.display = "";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("callBackBill").style.display = "none";
			        		document.getElementById("doVoucherSee").style.display = "";
						} else if(status==EBankConstant.WfStatus.AUDITED_002) {
							document.getElementById("sign").style.display = "none";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("callBackBill").style.display = "none";
			        		document.getElementById("doVoucherSee").style.display = "";
						}else if(status==EBankConstant.WfStatus.RETURNED_003) {
							document.getElementById("sign").style.display = "none";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("callBackBill").style.display = "none";
			        		document.getElementById("doVoucherSee").style.display = "";
						} else if(status==EBankConstant.WfStatus.UNAUDIT_004) {
							document.getElementById("sign").style.display = "none";
			        		document.getElementById("view").style.display = "";
			        		document.getElementById("callBackBill").style.display = "";
			        		document.getElementById("doVoucherSee").style.display = "";
						}  
					}else{
						document.getElementById("view").style.display = "";
						document.getElementById("sign").style.display = "none";
		        		document.getElementById("doVoucherSee").style.display = "none";
		        		document.getElementById("callBackBill").style.display = "none";
					}
			};
			
			//主单图标操作
			modalMainGridArea = function(obj) {
				obj.element.style["text-align"]="center";
				var status=document.getElementById("pz_status").value;
				sysDate = new Date();
				if(document.getElementById("set_year" + "-"  + viewModel.QueryViewId.substring(1, 37)).value==sysDate.getFullYear()){
					if(status=='001'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'	+ obj.rowIndex + '" onclick="sign(this.id)" class="iconmenu icon-signature" title="签章"></a></div>';
					}else if(status=='004'){
						obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'	+ obj.rowIndex + '" onclick="callBackBill(this.id)" class="iconmenu icon-back-prev" title="退回"></a></div>';
					};
				};
			};
			
			
			//刷新界面数据
			fGetGrid = function() {
				fsc_show();
				var status = $("#pz_status option:selected").val();
				var year=document.getElementById("set_year" + "-" + viewModel.QueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				var pk_code=document.getElementById("pk_code" + "-" + viewModel.QueryViewId.substring(1, 37)).value;
				var strs= new Array(); //定义一数组
				strs=pk_code.split(" "); //字符分割 
				if(strs.length > 0 && strs.length == 2){
					mainOptions["condition"]=" and pk_code like '"+strs[0]+"%' ";
				}else{
					mainOptions["condition"] = "";
				}
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-" + viewModel.QueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
				mainOptions["status"] = status;
				ip.setGrid(viewModel.mainViewModel, queryURL+"/loadPayClearBillData.do", mainOptions);
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

			
			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				});
				viewModel.initData();
			});

		});
