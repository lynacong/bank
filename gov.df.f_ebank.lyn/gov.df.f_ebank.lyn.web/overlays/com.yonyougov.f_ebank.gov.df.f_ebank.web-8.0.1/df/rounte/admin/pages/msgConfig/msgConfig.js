define(['text!pages/msgConfig/msgConfig.html', 'commonUtil',
		'jquery','bootstrap', 'ip', 'datatables.net-bs',
		'datatables.net-autofill-bs', 'datatables.net-buttons-bs',
		'datatables.net-colreorder', 'datatables.net-rowreorder',
		'datatables.net-select', 'datatables.net-scroller',
		'datatables.net-keyTable', 'datatables.net-responsive',
		'initDataTableUtil' ],function(html, commonUtil) {
			var init = function(element, param) {
				document.title = ip.getUrlParameter("menuname");
				// 新增或者修改 类型
				var editType;
				var msgGridObj, mainFieldGridObj, detailFieldGridObj;
				var options = ip.getCommonOptions({});
				options.gridParam = ip.getTableSetting();
				options["loadDataFlag"] = false;
				options["selectflag"] = false;
				options["sortnum"] = false;
				options["sumFlag"] = false;
				options.gridParam.ordering = true;
				options.gridParam.serverSide = false;
				options.gridParam.binfo = false;
				options.gridParam.paging = false;
				options.gridParam.bSort = true;
				options.gridParam.order = [ [ 3, "asc" ] ];
				options.gridParam.bInfo = false;
				options.gridParam.searching = false;
				options.gridParam.processing = false;
				options.gridParam.bDeferRender = false;
				var options1 = JSON.parse(JSON.stringify(options));
				// 新增的编码是否存在
				var flag = false;
				viewModel = {
					tokenid : ip.getTokenId(),
				};
				//获取左边表格数据
				viewModel.getleftTable = function() {
					$.ajax({
						url : "/df/msgConfig/initMsgTypeTree.do?tokenid="
								+ viewModel.tokenid,
						type : "GET",
						data : {
							ajax : "noCache",
							"financeCode" : $("#finance_code").val(),
						},
						success : function(data) {
							if (data.result == "success") {
								setDataForGrid(data.typeList);
							}
						}
					});
				};
				// 配置列表
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
								if (view.viewtype == EBankConstant.ViewType.VIEWTYPE_LIST) {// 列表视图
									if (view.orders == '1') {
										options.scrollY = $(".config-main-hassearch").height()-329+"px";
										mainFieldGridObj = initDataTables(
												"mainFieldGrid", "", options,
												view.viewDetail);
									} else if (view.orders == '2') {
										options1.scrollY = $(".config-main-hassearch").height()-329+"px";
										detailFieldGridObj = initDataTables(
												"detailFieldGrid", "", options1,
												view.viewDetail);
									}
								}
							}
							$("#bill-btn-container button,#voucher-btn-container button").attr("disabled","disabled");
						}
					});
				};
				//左侧报文列表赋值
				setDataForGrid = function(tableData) {
					msgGridObj = $('#msgGrid').DataTable({
						destroy : true,
						searching : false,
						paging : false,
						bSort : false,
						bInfo : false,
						bautoWidth : false,
						scrollY : $(".config-main-hassearch").height()-47+"px",
						language : {
							'zeroRecords' : '没有检索到数据'
						},
						data : tableData,
						columns : [ {
							"data" : "chr_code"
						}, {
							"data" : "chr_name"
						} ],
					});
				};
				
				//tab页签表格错位问题解决
				$("body").on('shown.bs.tab', 'a[data-toggle="tab"]',
						function(e) {
							$.fn.dataTable.tables({
								visible : true,
								api : true
							}).columns.adjust();
						});

				
				//编码以及名称表格行选中事件
				$("body").on('click','#msgGrid tr',function() {
					if ($(this).hasClass('selected')) {
						$(this).removeClass('selected');
					} else {
						msgGridObj.$('tr.selected').removeClass('selected');
						$(this).addClass('selected');
					}
					var dataSrc = $('#msgGrid').DataTable().row($(this)).data();
					var chr_code = dataSrc.chr_code;
					$("#chrCode").val(dataSrc.chr_code);
					$("#chrName").val(dataSrc.chr_name);
					$("#billtable").val(dataSrc.bill_table);
					$("#vouchertable").val(dataSrc.voucher_table);
					$("#billdto").val(dataSrc.bill_dto);
					$("#voucherdto").val(dataSrc.voucher_dto);
					$("#billId").val(dataSrc.bill_id);
					$("#voucherId").val(dataSrc.voucher_id);
					$("#referenceId").val(dataSrc.reference_id);
					$("#sender").val(dataSrc.sender);
					$("#receiver").val(dataSrc.receiver);
					$("#callback_class").val(dataSrc.callback_class);
					$.ajax({
						url : "/df/msgConfig/getFieldListByChrcode.do?tokenid="
								+ viewModel.tokenid,
						type : "GET",
						data : {
							"chr_code" : chr_code,
							"financeCode" : $("#finance_code").val(),
							ajax : "noCache",
						},
						success : function(data) {
							if (data.result == "success") {
//								options.scrollY = $(".config-main").height()-286+"px";
								options.setDatas = data.billColumnList;
								mainFieldGridObj.ajax.reload(
										null, true);
								options1.setDatas = data.voucherColumnList;
								detailFieldGridObj.ajax.reload(
										null, true);
							}
						}
					});
				});

				//财政机构改变事件
				fGetGrid = function() {
					$("#interface-form input").val("");
					$("#sender option").eq(0).prop("selected", true);
					$("#receiver option").eq(0).prop("selected", true);
					if (detailFieldGridObj != undefined || mainFieldGridObj != undefined) {
						detailFieldGridObj.clear();
						detailFieldGridObj.draw();
						mainFieldGridObj.clear();
						mainFieldGridObj.draw();
					}
					viewModel.getleftTable();
				};
				
				//刷新
				refresh = function() {
					fGetGrid();
				};
				
				//新增按钮事件
				add = function() {
					editType = "add";
					$("#update, #add, #delMsg,#refresh").attr("disabled", true);
					$("#save, #cancel").attr("disabled", false);
					$("#interface-form input, #interface-form select")
							.prop("disabled", false);
					$("#interface-form input").val(""); // 清空所有的输入框
					$("#sender option").eq(0).prop("selected", true);
					$("#receiver option").eq(0).prop("selected", true);
					$("#bill-btn-container button,#voucher-btn-container button").attr("disabled",false);
					
					detailFieldGridObj.clear();
					detailFieldGridObj.draw();
					mainFieldGridObj.clear();
					mainFieldGridObj.draw();
				};
				
				//新增字段按钮事件
				addField = function(optype, type) {
					if (optype == "add") {
						$("#modelTitleText").html("新增主单/明细字段信息");
						$("#updateModalfield input, #updateModalfield select")
								.val("");
						if (type == "bill") {
							$("#bill-sur-eleTree").show();
							$("#voucher-sur-eleTree").hide();
							$("#voucher-update-eleTree").hide();
							$("#bill-update-eleTree").hide();
						} else {
							$("#bill-sur-eleTree").hide();
							$("#voucher-sur-eleTree").show();
							$("#voucher-update-eleTree").hide();
							$("#bill-update-eleTree").hide();
						}
					} else if (optype == "update") {
						$("#modelTitleText").html("修改主单/明细字段信息");
						$("#bill-sur-eleTree").hide();
						$("#voucher-sur-eleTree").hide();
						if (type == "bill") {
							$("#voucher-update-eleTree").hide();
							$("#bill-update-eleTree").show();
							var select = $('#mainFieldGrid').DataTable().rows(
									'.selected').data();
						} else {
							$("#voucher-update-eleTree").show();
							$("#bill-update-eleTree").hide();
							var select = $('#detailFieldGrid').DataTable().rows(
									'.selected').data();
						}
						if (select.length != 1) {
							ip.warnJumpMsg("请选中一条数据进行修改", 0, 0, true);
							return false;
						} else {
							var data = select[0];
							$("#filedName").val(data.field_name);
							$("#description").val(data.description);
							$("#dispfieldname").val(data.disp_field_name);
							$("#datatype").val(data.data_type);
							$("#displayorder").val(data.display_order);
							$("#dataformate").val(data.data_format);
							$("#defaultvalue").val(data.default_value);
							$("#isnull").val(data.is_null);
							$("#lenmin").val(data.len_min);
							$("#lenmax").val(data.len_max);
							$("#valset").val(data.val_set);
						}
					}
					$("#updateModalfield").modal("show");
				};

				//删除事件
				del = function() {
					$("#refresh").attr("disabled", true);
					var selected = $('#msgGrid').DataTable().rows('.selected')
							.data();
					if (selected.length > 0) {
						ip.warnJumpMsg("确定删除【编码:" + selected[0].chr_code
								+ "名称:" + selected[0].chr_name + "】的数据？",
								"del", "cCla");
						var chr_code = selected[0].chr_code;
						$("#del").on("click",function() {
							$("#config-modal").remove();
							$.ajax({
								url : "/df/msgConfig/deleteInterfaceConfig.do?tokenid="
										+ viewModel.tokenid,
								type : "POST",
								data : {
									"chr_code" : chr_code,
									"financeCode" : $("#finance_code").val(),
									ajax : "noCache",
								},
								success : function(data) {
									if (data.result == "success") {
										ip.ipInfoJump("删除成功!","success");
										$("#interface-form input").val(""); // 清空所有的输入框
										detailFieldGridObj.clear();
										detailFieldGridObj.draw();
										mainFieldGridObj.clear();
										mainFieldGridObj.draw();
										viewModel.getleftTable(); // 重刷表格
									} else {
										ip.warnJumpMsg("删除失败!",0,0,true);
									}
								},
								error : function() {
									ip.warnJumpMsg("删除失败!", 0,0, true);
								}
							});

						});
						$(".cCla").on("click", function() {
							$("#config-modal").remove();
						});
					} else {
						ip.warnJumpMsg("请选择要删除的信息!", 0, 0, true);
						$("#refresh").attr("disabled", false);
						return;
					}
					$("#refresh").attr("disabled", false);
				};
			
				//添加字段弹出框“确定”
				saveAddField = function(type, optype) {
					var fieldObj = {};
					fieldObj["field_name"] = $("#filedName").val();
					fieldObj["description"] = $("#description").val();
					fieldObj["disp_field_name"] = $("#dispfieldname").val();
					fieldObj["data_type"] = $("#datatype").val();
					fieldObj["display_order"] = $("#displayorder").val();
					fieldObj["data_format"] = $("#dataformate").val();
					fieldObj["default_value"] = $("#defaultvalue").val();
					fieldObj["is_null"] = $("#isnull").val();
					fieldObj["len_min"] = $("#lenmin").val();
					fieldObj["len_max"] = $("#lenmax").val();
					fieldObj["val_set"] = $("#valset").val();
					if (fieldObj["field_name"] == ""
							|| fieldObj["description"] == ""
							|| fieldObj["display_order"] == "") {
						ip.warnJumpMsg("*为必填项，请补充填写！", 0, 0, true);
						return false;
					}
					var patt1 = /^[0-9]*$/;
					if (!patt1.test(fieldObj["display_order"])) {
						$("#displayorder").val("");
						$("#displayorder").focus();
						ip.warnJumpMsg("导出顺序值需为整数！", 0, 0, true);
						return false;
					}

					if (type == "primary" && optype == "add") {
						mainFieldGridObj.rows.add([ fieldObj ]).draw(false);
					} else if (type == "voucher" && optype == "add") {
						detailFieldGridObj.rows.add([ fieldObj ]).draw(false);
					} else if (type == "primary" && optype == "update") {
						var selecta = mainFieldGridObj.row(".selected").data();
						mainFieldGridObj.row(".selected").data(fieldObj);

					} else {
						detailFieldGridObj.row(".selected").data(fieldObj);

					}
					$("#updateModalfield").modal("hide");
				};

				//删除“字段”
				delField = function(type) {
					if (type == "bill") {
						var select = $('#mainFieldGrid').DataTable().rows('.selected')
								.data();
						if (select.length != 1) {
							ip.warnJumpMsg("请选择一条要删除的数据", 0, 0, true);
							return false;
						} else {
							mainFieldGridObj.rows(".selected").remove().draw(false);
						}
					} else {
						var select = $('#detailFieldGrid').DataTable().rows('.selected')
								.data();
						if (select.length != 1) {
							ip.warnJumpMsg("请选择一条要删除的数据", 0, 0, true);
							return false;
						} else {
							detailFieldGridObj.rows(".selected").remove().draw(false);
						}
					}
				};
				//顶部修改"按钮"的方法
				update = function() {
					editType = "update";
					var selected = $('#msgGrid').DataTable().rows('.selected').data();
					if (selected && selected.length) {
						$("#update, #add, #delMsg,#refresh").attr("disabled", true);
						$("#save, #cancel").attr("disabled", false);
						var chr_code = selected[0].chr_code;
						// 可编辑
						$("#interface-form input,#interface-form select").prop("disabled", false);
						$("#chrCode").attr("disabled", true);
						$("#bill-btn-container button,#voucher-btn-container button").attr("disabled",false);
					} else {
						$("#bill-btn-container button,#voucher-btn-container button").attr("disabled","disabled");
						ip.warnJumpMsg("请选择要修改的数据！", 0, 0, true);
					}
				};

				//数据“保存”
				saveData = function() {
					$("#save").attr("disabled", true);
					var commonSetting = {};
					if (editType == 'add') {
						viewModel.checkCodeExist();
						if (flag) {
							flag = false;
							$("#refresh").attr("disabled", false);
							return;
						}
					}
					// 必填字段非空校验
					if (($("#chrCode").val() + "").trim() == ""
							|| ($("#chrName").val() + "").trim() == ""
							|| ($("#billtable").val() + "").trim() == ""
							|| ($("#vouchertable").val() + "").trim() == "") {
						ip.warnJumpMsg("*内容为必填项", 0, 0, true);
						$("#save").attr("disabled", false);
						return false;
					}
					// 主单表名与明细表名不能相同
					if ($("#billtable").val() == $("#vouchertable").val()) {
						ip.warnJumpMsg("主单表名称不能与明细表名称相同！", 0, 0, true);
						$("#save").attr("disabled", false);
						return false;
					}
					commonSetting["codeText"] = $("#chrCode").val();
					commonSetting["nameText"] = $("#chrName").val();
					commonSetting["billTableBox"] = $("#billtable").val();
					commonSetting["voucherTableBox"] = $("#vouchertable").val();
					commonSetting["billClassText"] = $("#billdto").val();
					commonSetting["voucherClassText"] = $("#voucherdto").val();
					commonSetting["billId"] = $("#billId").val();
					commonSetting["voucherId"] = $("#voucherId").val();
					commonSetting["rererenceId"] = $("#referenceId").val();
					commonSetting["sender"] = $("#sender").val() == null ? ""
							: $("#sender").val();
					commonSetting["receiver"] = $("#receiver").val() == null ? ""
							: $("#receiver").val();
					commonSetting["callBackClass"] = $("#callback_class").val();

					var billdata = $('#mainFieldGrid').DataTable().rows().data();
					var voucherdata = $('#detailFieldGrid').DataTable().rows().data();
					var billArray = [];
					var voucherArray = [];
					for (var i = 0; i < billdata.length; i++) {
						var item = {};
						for (key in billdata[i]) {
							if (key.indexOf("$") == -1) {
								item[key] = billdata[i][key] == null ? ""
										: billdata[i][key];
							}
						}
						billArray.push(item);
					}

					for (var i = 0; i < voucherdata.length; i++) {
						var item = {};
						for (key in voucherdata[i]) {
							if (key.indexOf("$") == -1) {
								item[key] = voucherdata[i][key] == null ? ""
										: voucherdata[i][key];
							}
						}
						voucherArray.push(item);
					}
					$.ajax({
						url : "/df/msgConfig/saveOrUpdateFieldInfo.do?tokenid="
								+ viewModel.tokenid,
						type : "POST",
						data : {
							"commonSetting" : JSON
									.stringify(commonSetting),
							"billArray" : JSON.stringify(billArray),
							"voucherArray" : JSON
									.stringify(voucherArray),
							"financeCode" : $("#finance_code").val(),
							"ajax" : "noCache"
						},
						success : function(data) {
							if (data.result == "success") {
								ip.ipInfoJump("保存成功", "success");
								$(
										"#interface-form input, #interface-form button, #interface-form select")
										.prop("disabled", true);
								$("#bill-btn-container").hide();
								$("#voucher-btn-container").hide();
								viewModel.getleftTable();
								$("#save, #cancel").attr("disabled",
										true);
								$("#add, #update, #delMsg, #refresh")
										.attr("disabled", false);
								$("#refresh").attr("disabled", false);
							}
						}
					});
				};
				
				//取消“事件”
				cancel = function() {
					$("#interface-form input, #interface-form button, #interface-form select")
							.prop("disabled", true);
					detailFieldGridObj.clear();
					detailFieldGridObj.draw();
					mainFieldGridObj.clear();
					mainFieldGridObj.draw();
					$("#add, #update, #delMsg, #refresh").attr("disabled",
							false);
					$("#save, #cancel").attr("disabled", true);
					$("#bill-btn-container button,#voucher-btn-container button").attr("disabled","disabled");
				};
				//校验编码是否存在
				viewModel.checkCodeExist = function() {
					var displayorderVal = $("#chrCode").val();
					$.ajax({
						url : "/df/msgConfig/isCodeExist.do?tokenid="
								+ viewModel.tokenid,
						async : false,
						type : "GET",
						data : {
							"codeText" : displayorderVal,
							"financeCode" : $("#finance_code").val(),
							ajax : "noCache",
						},
						success : function(data) {
							if (data.result == "success") {
								if (data.isExist) {
									$("#chrCode").focus();
									ip.warnJumpMsg("编码已存在，请重新输入！", 0, 0, true);
									$("#save").attr("disabled", false);
									flag = true;
								}
							}
						}
					});
				};
				

				pageInit = function() {
					var param = ip.getCommonOptions({});
					// 初始化财政机构的下拉框
					commonUtil.initFinanceCode("", param);
					//初始化左侧的表格
					viewModel.getleftTable();
					viewModel.initData();
				};

				$(element).html(html);
				pageInit();
			};
			return {
				init : init
			};
		});
