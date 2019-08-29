require(
		[ 'jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH' ],
		function($, ko, echarts) {		
			var mainOptions = ip.getCommonOptions({});
			var voucherOptions=ip.getCommonOptions({});
			var viewModel = {
				tokenid : ip.getTokenId(),
			};
			mainOptions["ele"]="";
			//查询
			viewModel.fSelect=function(){
				viewModel.getQueryView();
				ip.setGrid(viewModel.mainViewModel, "/df/f_ebank/planQuery/doQueryBalanceLimit.do", mainOptions);
				viewModel.voucherGridViewModel.gridData.clear();
				viewModel.voucherGridViewModel.gridData.totalRow(0);
			};
			
			//点击主单查询明细
			getDetail=function(){
				var id=viewModel.mainViewModel.gridData.getFocusIndex();
				var rowData = $('#' + viewModel.mainViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				voucherOptions["sum_id"] =rowData.sum_id;
				voucherOptions["finance_code"] =mainOptions["finance_code"];
				voucherOptions["set_year"] =mainOptions["set_year"];
				voucherOptions["account_kind"] =rowData.account_kind;
				ip.setGrid(viewModel.voucherGridViewModel, "/df/f_ebank/planQuery/doQueryPlanVoucher.do", voucherOptions);
			};
			
			viewModel.getQueryView = function() {
				var year=document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				var en=document.getElementById("EN" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				var bs=document.getElementById("BS" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				var mk=document.getElementById("MK" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				ele = [];
				var temp = {};
				if(en!=null&&en!=''){
					temp["EN"]=en.split(" ")[0];
				}else{
					temp["EN"]=en;
				}
				if(bs!=null&&bs!=''){
					temp["BS"]=bs.split(" ")[0];
				}else{
					temp["BS"]=bs;
				}
				if(mk!=null&&mk!=''){
					temp["MK"]=mk.split(" ")[0];
				}else{
					temp["MK"]=mk;
				}
				ele.push(temp);
				mainOptions["ele"]=JSON.stringify(ele);
				mainOptions["account_kind"] =document.getElementById("account_kind" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				mainOptions["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				mainOptions["set_year"] =year;
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
						
						//var status=$("#pz_status option:selected").val();
						for ( var n = 0; n < viewModel.viewList.length; n++) {
							var view = viewModel.viewList[n];
							if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {//列表视图
								if (view.orders == '1') {
									viewModel.mainViewId=view.viewid;
									mainOptions["tableViewId"] = view.viewid;
									viewModel.mainViewModel = ip.initGrid(view, 'modalMianGridArea', "/df/f_ebank/planQuery/doQueryBalanceLimit.do", mainOptions, 0, false);
									mainOptions["pageInfo"] = "10,0";
									mainOptions["finance_code"] = "000000";
									mainOptions["set_year"] = mainOptions["svSetYear"];
									mainOptions["account_kind"] = "5105";
									ip.setGrid(viewModel.mainViewModel, "/df/f_ebank/planQuery/doQueryBalanceLimit.do", mainOptions);
								} else if (view.orders == '2') {
									voucherOptions["pageInfo"] = "10,0";
									viewModel.voucherGridViewModel = ip.initGrid(view, 'modalSubsysGridArea', "/df/f_ebank/planQuery/doQueryPlanVoucher.do", voucherOptions, 0, false);
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
