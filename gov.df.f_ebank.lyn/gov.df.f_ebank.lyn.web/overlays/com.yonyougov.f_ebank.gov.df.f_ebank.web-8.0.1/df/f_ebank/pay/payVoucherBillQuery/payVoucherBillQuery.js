require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {
			
			var requesting=false;
			var advice;
			
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var queryURL=EBankConstant.CommonUrl.query;
			var baseURL = EBankConstant.Ctx + "pay/payCommon";
			//var vtCode=ip.getUrlParameter("vt_code");
			mainOptions["operate_width"] =50;
			mainOptions["condition"]=" vt_code ='5201' ";
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
					var planData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
					var temp = {};
					temp["id"] = planData.id;
					temp["finance_code"] = planData.finance_code;
					billIdsAndFinanceCode.push(temp);
				} else {//id为空
					billIdsAndFinanceCode = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code' ]
					});
				}
				return	billIdsAndFinanceCode;
			};			
			
			//查询
			viewModel.fSelect=function(){
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, queryURL+"/doFind.do", mainOptions);
//				fsc_show();
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			};
			
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
					tempId["vt_code"]= planData.vt_code;
					billIds.push(tempId);
				} else {//id为空
					billIds = viewModel.mainViewModel.gridData.getSimpleData({  //批量选中
						type : 'select',
						fields : [ 'id','finance_code','set_year','bill_no','vt_code' ]
					});
				}
				if(billIds.length<1){
					ip.warnJumpMsg("请选择数据进行凭证查看",0,0,true);
					requesting=false;
					return;
				}
				doAsspVoucherSee(billIds,evt,billIds[0].vt_code);
				window.event ? e.cancelBubble = true : e.stopPropagation();
				requesting=false;
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
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				if(year==null||year==''){
					ip.warnJumpMsg("年度不能为空，请选择！！！",0,0,true);
					return;
				}
				var billNO = document.getElementById("bill_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				var startTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+1)).value;
				var endTime=document.getElementById("create_date"
						+ "-" + (viewModel.planQueryViewId.substring(1, 37)+2)).value;
				
				var vtCode=document.getElementById("vt_code"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				/*if(pkCode==-1){
					mainOptions["condition"]="vt_code in ('5201','8202') ";
				}else if(pkCode==11){
					mainOptions["condition"]="vt_code ='5201' ";
				}else{
					mainOptions["condition"]="vt_code ='8202' ";
				}*/
				mainOptions["condition"]="vt_code = '"+vtCode+"'";
				if(billNO!=null&&billNO!=''){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_no='"+billNO+"'";
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
				var billStatus=document.getElementById("bill_status"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				if(billStatus!=null&&billStatus!=''&&billStatus!=-1){
					mainOptions["condition"]=mainOptions["condition"]+"and bill_status='"+billStatus+"'";
				}
			};
			
			
			//主单上的操作
			modalMianGridArea = function(obj) {
				obj.element.style["text-align"]="center";
						obj.element.innerHTML='<div class="fun-operate pay-ope" ><a id="'
							+ obj.rowIndex
	        	            + '" onclick="doVoucherSee(this.id)" class="iconmenu icon-previews" title="凭证查看"></a></div>';
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
						
						//var status=$("#pz_status option:selected").val();
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
									mainOptions["isWorkFlowRelated"] = "false";
									mainOptions["relationBillId"] = "voucher_bill_id";
									//mainOptions["status"] = status;
									//viewModel.getQueryView();
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] = "000000";
									mainOptions["set_year"] = mainOptions["svSetYear"];
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
									voucherOptions["pageInfo"] = "10,0";
									voucherOptions["set_year"] = voucherOptions["svSetYear"];
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

			}
			
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
				})

			}


			$(function() {
				var app = u.createApp({
					el : document.body,
					model : viewModel
				})
				viewModel.initData();
			})

		});
