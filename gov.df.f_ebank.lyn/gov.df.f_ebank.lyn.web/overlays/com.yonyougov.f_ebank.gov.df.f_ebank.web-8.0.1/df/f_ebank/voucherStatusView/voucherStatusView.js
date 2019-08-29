require(['jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH'], function($, ko, echarts) {

			var options = ip.getCommonOptions({});

			var viewModel = {
				tokenid : ip.getTokenId(),
				gridDatatable : new u.DataTable({
					meta : {
						'voucher_no' : {},
						'vt_code' : {},
						'status' : {}
					}
				})
			};


			viewModel.fSelect = function() {
				document.getElementById("view").disabled = true;
				var voucher_no=document.getElementById("voucher_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				if(voucher_no==null||voucher_no==''){
					ip.warnJumpMsg("凭证号不能为空，请填写！！！",0,0,true);
					document.getElementById("view").disabled = false;
					return;
				}
				options["voucher_no"] = voucher_no;
				options["vt_code"] = document.getElementById("vt_code" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				options["finance_code"] =document.getElementById("finance_code" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				options["set_year"] =document.getElementById("set_year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				//ip.setGrid(viewModel.subsysGridViewModel, "/df/f_ebank/voucherStatusView/getVoucherStatus.do", options);
				$.ajax({
					url : "/df/f_ebank/voucherStatusView/getVoucherStatus.do?tokenid=" + viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : options,
					success : function(data) {
						if (data.flag) {
							var status="";
							switch(data.result){
							case 0:
							     status="未接收";
							     break;
							case 1:
							     status="已接收";
							     break;
							case 2:
							     status="接收失败";
							     break;
							case 3:
							     status="签收成功";
							     break;
							case 4:
							     status="签收失败";
							     break;
							case 5:
							     status="已回单";
							     break;
							case 6:
							     status="被退回";
							     break;
						     default:
						    	 ip.warnJumpMsg("凭证状态查询失败！！！",0,0,true);
						     	 return;
							}
							 var dataStatus={
		 	 							"voucher_no":options["voucher_no"],
		 	 							"vt_code":options["vt_code"],
		 	 							"status":status
		 	 						 };
							viewModel.gridDatatable.setSimpleData(dataStatus);
							// viewModel.subsystemDatatable.setRowUnSelect(0);
						} else {
							ip.warnJumpMsg(data.result,0,0,true);
						}
						document.getElementById("view").disabled = false;
					}
				});
			}

			viewModel.initData = function() {
				$.ajax({
							url : "/df/init/initMsg.do",
							type : "GET",
							dataType : "json",
							async : true,
							data : options,
							success : function(datas) {
								viewModel.viewList = datas.viewlist;// 视图信息
								viewModel.resList = datas.reslist;// 资源信息
								for (var n = 0; n < viewModel.viewList.length; n++) {
									var view = viewModel.viewList[n];
									/*if (view.viewtype == '002') {// 列表视图

										// planViewId = view.viewid;
										if (view.orders == "1") {
											viewModel.subsysViewId = view.viewid;

											viewModel.subsysGridViewModel = ip
													.initGrid(
															view,
															'modalSubsysGridArea',
															"/df/f_ebank/voucherStatusView/getVoucherStatus.do", options,
															0, false,true,true,false);
											}
									} else */if (view.viewtype == '003') {// 查询视图
										viewModel.planQueryViewId = view.viewid;
										viewModel.planSearchViewModel = ip
												.initArea(view.viewDetail,
														"search", view.viewid
																.substring(1,
																		37),
														"planSearchArea");
										viewModel.getVt_code();
										viewModel.getFinanceCode();
										viewModel.getYear();
									}
								}
							}
						});
			};

			viewModel.getVt_code = function() {		
				$.ajax({
					url : "/df/f_ebank/voucherSignHandler/getVt_code.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							var x = document.getElementById("vt_code"+ "-"
									+ viewModel.planQueryViewId.substring(1, 37));
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var option = document.createElement("option");
								option.value = datas.dataDetail[i].chr_code;
								option.text = datas.dataDetail[i].chr_name1;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
							}
							x.remove(x.options[0]);
						} else {
							ip.ipInfoJump("加载参数失败！原因：" + datas.result, "error");
						}
					}
				})

			}
			
			viewModel.getFinanceCode = function() {
				$.ajax({
					url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid="
						+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "nocache"
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							var x = document.getElementById("finance_code"+ "-"
									+ viewModel.planQueryViewId.substring(1, 37));
							for (var i = 0; i < datas.dataDetail.length; i++) {
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
							x.remove(x.options[0]);
							//x.options[0].selected = true;
						} else {
							ip.ipInfoJump("加载财政机构参数失败！原因：" + datas.result, "error");
						}
					}
				})
			}
			
			viewModel.getYear = function() {
				$.ajax({
					url : "/df/f_ebank/config/getYearData.do?tokenid="
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
							//x.disabled="false";
							for (var i = 0; i < datas.setYear.length; i++) {
							
								var option = document.createElement("option");
								option.value = datas.setYear[i].set_year;
								option.text = datas.setYear[i].year_name;
								if(datas.setYear[i].set_year==d.getFullYear()){
									  option.defaultSelected = true;
								         option.selected = true;
								         options["set_year"] =datas.setYear[i].set_year;
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
