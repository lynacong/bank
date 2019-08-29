require(['jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH'], function($, ko, echarts) {

			var options = ip.getCommonOptions({});
			var subsysUrl = "/df/f_ebank/voucherSignHandler/getSubsysData.do";
			// var tokenid = ip.getTokenId();
			var gStatus = 0;// 0查询，1新增，2更新

			var viewModel = {
				tokenid : ip.getTokenId()
			};

			viewModel.fsetStatus = function(status) {
				gStatus = status;
				if (gStatus == 0) {
				}
			}

			viewModel.fBuild = function() {
				//ip.ipInfoJump("正在签收...", "success");
				var grid = $('#' + viewModel.subsysViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid;
				var voucher_id = "";
				if(grid.getSelectRows().length==0){
					ip.ipInfoJump("请选择需要签收的数据！！！", "info");
					return;
				}
				for (var i = 0; i < grid.getSelectRows().length; i++) {
					voucher_id = voucher_id + grid.getSelectRows()[i].id + ','
				}
				voucher_id = voucher_id.replace(/\,\s*$/ig, "");
				var svUserCode = options.svUserCode;
				$.ajax({
					url : "/df/f_ebank/voucherSignHandler/reSignVoucher.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"voucher_id" : voucher_id,
						"status":options["voucher_status"],
						"svUserCode" : svUserCode
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							viewModel.fSelect();
							ip.ipInfoJump(datas.result, "success");
						} else {
							ip.warnJumpMsg("签收失败！原因：" + datas.result,0,0,true);
							viewModel.fSelect();
						}
					}
				})

			}

			viewModel.fBuildFail = function() {
				//ip.ipInfoJump("正在处理...", "success");
				var grid = $('#' + viewModel.subsysViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid;
				var voucher_id = "";
				if(grid.getSelectRows().length==0){
					ip.ipInfoJump("请选择需要操作的数据！！！", "info");
					return;
				}
				for (var i = 0; i < grid.getSelectRows().length; i++) {
					if(grid.getSelectRows()[i].fail_reason==""||grid.getSelectRows()[i].fail_reason==undefined){
						ip.ipInfoJump("请补录签收失败原因！！！", "info");
						return;
					}
					voucher_id = voucher_id + grid.getSelectRows()[i].id + ',';
				}
				voucher_id = voucher_id.replace(/\,\s*$/ig, "");
				var svUserCode = options.svUserCode;
				$.ajax({
					url : "/df/f_ebank/voucherSignHandler/updateVoucherStatus.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"voucher_id" : voucher_id,
						"status":"2",
						"year":options["year"],
						"svUserCode" : svUserCode
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							viewModel.fSelect();
							ip.ipInfoJump("执行成功！", "success");
						} else {
							viewModel.fSelect();
							ip.warnJumpMsg("执行失败！原因：" + datas.result,0,0,true);
							//ip.ipInfoJump("执行失败！原因：" + datas.result, "error");
						}
					}
				})

			};
			
			viewModel.openUpdateErrorMsgDlg = function(){
				var grid = $('#' + viewModel.subsysViewId.substring(1, 37) + '')
				.parent()[0]['u-meta'].grid;
				if(grid.getSelectRows().length!=1){
					ip.ipInfoJump("请选择一条需要操作的数据！！！", "info");
					return;
				}
				$("#titleText").text("错误原因补录");
				$("#errorMsgModel").modal("show");
			};
			
			viewModel.updateErrorMsg = function(){
				var grid = $('#' + viewModel.subsysViewId.substring(1, 37) + '')
				.parent()[0]['u-meta'].grid;
				var errMsg = $("#errorMsg").val();
				var voucher_id = grid.getSelectRows()[0].id;
				voucher_id = voucher_id.replace(/\,\s*$/ig, "");
				$.ajax({
					url : "/df/f_ebank/voucherSignHandler/updateErrorMsg.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"voucher_id" : voucher_id,
						"errorMsg":errMsg,
						"year":options["year"],
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							viewModel.fSelect();
							ip.ipInfoJump("执行成功！", "success");
							$("#errorMsgModel").modal("hide");
						} else {
							ip.warnJumpMsg("执行失败！原因：" + datas.result,0,0,true);
							//ip.ipInfoJump("执行失败！原因：" + datas.result, "error");
						}
					}
				})
			};

			viewModel.showButton = function() {
				var ele = document.getElementById("voucher_status" + "-"
						+ viewModel.planQueryViewId.substring(1, 37));
				for (var i = 0; i < ele.length; i++) {
					if (ele[i].selected == true) {
						if (ele[i].value == "0") {
							$("#qianshou").html("签收");
							document.getElementById("qianshou").disabled = false;
							document.getElementById("qssb").disabled = false;
							document.getElementById("updateErrMsg").disabled = false;

						} else if (ele[i].value == "2") {
							$("#qianshou").html("重新签收");
							document.getElementById("qianshou").disabled = false;
							document.getElementById("qssb").disabled = false;
							document.getElementById("updateErrMsg").disabled = false;

						} else {
							document.getElementById("qianshou").disabled = true;
							document.getElementById("qssb").disabled = true;
							document.getElementById("updateErrMsg").disabled = true;
						}
					}
				}
			}

			viewModel.fSelect = function() {

				viewModel.showButton();
				viewModel.getSubsysData();

			}

			//options["operate_width"] = 50;

			/*modalSubsysGridArea = function(obj) {
				obj.element.style["text-align"] = "center";
				obj.element.innerHTML = '<div class="fun-operate pay-ope" ><a id="'
						+ obj.rowIndex
						+ '" onclick="doSubsysDetail(this.id)" class="iconmenu icon-details" title="查看业务报文内容"></a><div>';
						<a id="'
						+ obj.rowIndex
						+ '" onclick="doSubsysBuild(this.id)" class="iconmenu icon-edit" title="签收"></a><div>';
			};*/

			SubsysDetailClick = function() {
				var grid = $('#' + viewModel.subsysViewId.substring(1, 37) + '')
						.parent()[0]['u-meta'].grid;
				var id = grid.getFocusRowIndex();
				if (id != null) {
					doSubsysDetail(id);
				}
			}

			doSubsysDetail = function(id) {
				var rowData = $('#' + viewModel.subsysViewId.substring(1, 37)
						+ '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
				document.getElementById("imessage").value =htmlDecodeByRegExp( htmlEncodeByRegExp(rowData.message));

			}

			/*doSubsysBuild = function(id) {
				var rowData = $('#' + viewModel.subsysViewId.substring(1, 37)
						+ '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;

				ip.ipInfoJump("正在签收：" + id + "_" + rowData.plan_money,
						"success");

			}*/

			// var menuid = 'A525A6D957600BCEB0B20BD361334DA3';// 从上下文中取菜单id
			// var roleid = '{2439FB6D-43C6-11E0-9C67-9D4F3182A2BD}';//
			// 从上下文中取角色id

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
									if (view.viewtype == '002') {// 列表视图

										// planViewId = view.viewid;
										if (view.orders == "2") {
											viewModel.subsysViewId = view.viewid;

											viewModel.subsysGridViewModel = ip
													.initGrid(
															view,
															'modalSubsysGridArea',
															subsysUrl, options,
															0, false);

											options["pageInfo"] = "10,0,";

											ip
													.setGrid(
															viewModel.subsysGridViewModel,
															subsysUrl, options);
										}

									} else if (view.viewtype == '003') {// 查询视图
										viewModel.planQueryViewId = view.viewid;
										viewModel.planSearchViewModel = ip
												.initArea(view.viewDetail,
														"search", view.viewid
																.substring(1,
																		37),
														"planSearchArea");
										viewModel.getVt_code();
										viewModel.getRgCode();
										viewModel.getYear();
									}

								}
								// viewModel.getSubsysData();

							}
						});
			};

			viewModel.getSelect = function() {
				options["voucher_no"] = document.getElementById("voucher_no"
						+ "-" + viewModel.planQueryViewId.substring(1, 37)).value;
				options["vt_code"] = document.getElementById("vt_code" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				options["voucher_status"] = document
						.getElementById("voucher_status" + "-"
								+ viewModel.planQueryViewId.substring(1, 37)).value;

				options["b_date"] = document.getElementById("b_date" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;

				options["e_date"] = document.getElementById("e_date" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				options["finance_code"] =document.getElementById("rg_code" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;
				options["year"] =document.getElementById("year" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).value;

			};

			viewModel.getSubsysData = function() {
				viewModel.getSelect();
				// options["pageInfo"] = "20,0,";
				if(options["year"]==''||options["year"]=='null'){
					ip.ipInfoJump("请选择年度！！！", "info");
					return;
				}
				ip.setGrid(viewModel.subsysGridViewModel, subsysUrl, options);
				document.getElementById("imessage").value = "";
			}

			viewModel.getVt_code = function() {
				
				$("#voucher_status" + "-"
						+ viewModel.planQueryViewId.substring(1, 37)).on(
						"change", function() {
							viewModel.showButton();
							viewModel.getSubsysData();
						})

				viewModel.showButton();

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
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("vt_code"
										+ "-"
										+ viewModel.planQueryViewId.substring(
												1, 37));
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
						} else {
							ip.ipInfoJump("加载参数失败！原因：" + datas.result, "error");
						}
					}
				})

			}
			
			viewModel.getRgCode = function() {
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
							for (var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("rg_code"
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
							var x = document.getElementById("year"
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
								         options["year"] =datas.setYear[i].set_year;
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
					// viewModel.initParam();
					// viewModel.fsetStatus(0);

				})

		});
