require(['jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH'], function($, ko, echarts) {

			var options = ip.getCommonOptions({});
			var gStatus = 0;// 0查询，1新增，2更新
			var gtab = "002";
			var accountTypeDetail = null;
			// var bankDetail=null;

			var viewModel = {
				// data: ko.observable({}),
				tokenid : ip.getTokenId(),
				gridDatatable : new u.DataTable({
							meta : {
								'chr_id' : {},
								'account_no' : {},
								'account_name' : {},
								'bank_code' : {},
								'account_type' : {},
								'account_type_name' : {},
								'account_relation_ele' : {},
								'bank_name' : {},
								'finance_code' :{}
							}
						}),
				dataTable : new u.DataTable({
							meta : {
								'chr_id' : {
									'value' : ""
								},
								'chr_code' : {
									'value' : ""
								},
								'parent_id' : {
									'value' : ""
								},
								'show_name' : {
									'value' : ""
								},
								'chr_name' : {
									'value' : ""
								}
							}
						}),
				treeSetting : {
					callback : {
						onClick : zTreeOnClick,
						beforeClick : zTreeBeforeClick

					}
				}
			};

			function zTreeBeforeClick(event, treeId, treeNode, clickFlag) {

			}

			function zTreeOnClick(event, treeId, treeNode, clickFlag) {
			}

			tabclick001 = function() {
				if (gStatus == 2) {
					ip.ipInfoJump("请完成编辑后切换！", "error");
					return;
				}

				gtab = "001";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。

			};
			tabclick002 = function() {

				if (gStatus == 2) {
					ip.ipInfoJump("请完成编辑后切换！", "error");
					return;
				}
				gtab = "002";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。

			};
			tabclick003 = function() {
				if (gStatus == 2) {
					ip.ipInfoJump("请完成编辑后切换！", "error");
					return;
				}
				gtab = "003";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。

			};
			tabclick004 = function() {
				if (gStatus == 2) {
					ip.ipInfoJump("请完成编辑后切换！", "error");
					return;
				}

				gtab = "006";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。
			};
			tabclick005 = function() {
				if (gStatus == 2) {
					ip.ipInfoJump("请完成编辑后切换！", "error");
					return;
				}

				gtab = "005";
				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。
			};
			function changeColor(treeId, key, value) {
				if (value != "") {
					var treeObj = $.fn.zTree.getZTreeObj(treeId);
					nodeList = treeObj.getNodesByParamFuzzy(key, value);
					if (nodeList && nodeList.length > 0) {
						iNodeList = 0;
						treeObj.selectNode(nodeList[iNodeList], false);
					}
				}
			}

			viewModel.moveEnd = function(obj) {
				obj.focus();
				var len = obj.value.length;
				if (document.selection) {
					var sel = obj.createTextRange();
					sel.moveStart('character', len); // 设置开头的位置
					sel.collapse();
					sel.select();
				} else if (typeof obj.selectionStart == 'number'
						&& typeof obj.selectionEnd == 'number') {
					obj.selectionStart = obj.selectionEnd = len;
				}
			};
			viewModel.editFun = function(obj) {
				if (gStatus == 0) {
					obj.element.innerHTML = '<label>' + obj.value + '</label>';
					return;
				}

				obj.element.innerHTML = '<input type="text" id="edit-text" class="u-input" value="'
						+ obj.value + '">';
				viewModel.moveEnd($("#edit-text").get(0));
				$("#edit-text").on("blur", function() {
					var curent_value = $("#edit-text").val();
					if (gStatus == 2) {
						var curent_row = viewModel.gridDatatable.getFocusRow();
						viewModel.gridDatatable.setValue(obj.field,
								curent_value, curent_row);
					}
				});

			};

			viewModel.editFun1 = function(obj) {
				if (gStatus == 0) {
					obj.element.innerHTML = '<label>' + obj.value + '</label>';
					return;
				}

				// obj.element.style="margin-right:0px";
				// document.getElementsByClassName("u-grid-content-td-div")[0].style="text-align:left;margin-right:0px"
				var oStyle = document
						.getElementsByClassName("u-grid-content-td-div");
				for (var i in oStyle) {
					oStyle[i].style = "text-align:left;margin-right:0px";
				}

				obj.element.innerHTML = '<input type="text" id="edit-text" style="float:left;position:absolute;width:88%" class="part_text" value="'
						+ obj.value
						+ '" readonly>'
						+ '<button id="mybutton"  class="part_button" style="float:right;height:32px;width:12%">...</button>';

				$("#mybutton").on("click", function() {
					if (obj.field == "bank_name") {

						// 不需要重新加载 viewModel.getBankTree();

						// $.fn.zTree.getZTreeObj("treeId").expandAll(false);

						var bank_code = obj.rowObj.bank_code;
						if (bank_code != null)
							changeColor("treeId", "chr_code", bank_code);

						$('#wizardModal').modal('show');
					}
						// if (obj.field == "account_type_name") {
						//
						// $('#wizardModal2').modal('show');
						//
						// }

					});

			};

			cellChange = function(select) {

				var curent_row = viewModel.gridDatatable.getFocusRow();
				viewModel.gridDatatable.setValue("account_type", select.value,
						curent_row);
				viewModel.gridDatatable.setValue("account_type_name",
						select.text, curent_row);
			};
			viewModel.editFun2 = function(obj) {

				if (gStatus == 0) {
					obj.element.innerHTML = '<label>' + obj.value + '</label>';
					return;
				}

				var bStr = '<select id="select-display-format" class="" onclick="cellChange(this.options[this.options.selectedIndex])"> ';
				var mStr = "";
				var eStr = '</select>';

				for (var i = 0; i < accountTypeDetail.length; i++) {
					mStr = mStr + ' <option value="'
							+ accountTypeDetail[i].chr_code + '">'
							+ accountTypeDetail[i].chr_name + '</option> ';
				}
				obj.element.innerHTML = bStr + mStr + eStr;

				var account_type = obj.rowObj.account_type;
				var t1 = document.getElementById("select-display-format");

				for (i = 0; i < t1.length; i++) {// 给select赋值
					if (account_type == t1.options[i].value) {
						t1.options[i].selected = true;
					}
				}

				// obj.element.innerHTML = +' <option value="shift3">#</option>
				// '
				// + ' <option value="#,###" >#,###</option> '
				// + ' <option value="#,###,###">#,###,###</option> '
				// + ' <option value="#,##0.##">#,##0.##</option> '
				// + ' <option value="#,###.00">#,###.00</option> '
				// + '</select>';
			};
			
			viewModel.fsetStatus = function(status) {
				gStatus = status;
				if (gStatus == 0) {
					document.getElementById("sx").disabled = false;
					document.getElementById("zj").disabled = true; // 增加
					document.getElementById("xg").disabled = false; // 修改
					document.getElementById("sc").disabled = true; // 删除
					document.getElementById("bc").disabled = true; // 保存
					document.getElementById("qx").disabled = true; // 取消
					document.getElementById("a001").disabled = false;
					document.getElementById("a002").disabled = false;
					document.getElementById("a003").disabled = false;
					document.getElementById("a004").disabled = false;
					document.getElementById("a005").disabled = false;

				} else if (gStatus == 2) {
					document.getElementById("sx").disabled = true;
					document.getElementById("zj").disabled = false;
					document.getElementById("xg").disabled = true;
					document.getElementById("sc").disabled = false;
					document.getElementById("bc").disabled = false;
					document.getElementById("qx").disabled = false;

					document.getElementById("a001").disabled = true;
					document.getElementById("a002").disabled = true;
					document.getElementById("a003").disabled = true;
					document.getElementById("a004").disabled = true;
					document.getElementById("a005").disabled = true;
					document.getElementById("a" + gtab).disabled = true;

				}

			};

			viewModel.fRefRec = function() {
				viewModel.getGrid();
				viewModel.getAccountType();
				ip.ipInfoJump("已刷新！！", "success");

			};
			viewModel.fAddRec = function() {
				viewModel.gridDatatable.addSimpleData([{}], "new");
			};

			viewModel.fEditRec = function() {
				viewModel.fsetStatus(2);
			};
			viewModel.fSaveRec = function() {
				viewModel.subSaveRow();
			};
			viewModel.fReRec = function() {
				viewModel.getGrid();
				viewModel.getAccountType();
				viewModel.fsetStatus(0);
			};
			viewModel.fDelRec = function() {
				var rows = viewModel.gridDatatable.getSelectedRows();
				if(rows.length<1){
					ip.warnJumpMsg("请先选择数据！",0,0,true);
					return;
				}
				ip.warnJumpMsg("确定删除记录吗？", "sid", "cCla");
				$("#sid").on("click", function() {
					$("#config-modal").remove();
					var chr_ids = [];
					//var chr_codes = [];
					var rows_index = [];
				//	var rows = viewModel.gridDatatable.getSelectedRows();
					for (var i = 0; i < rows.length; i++) {
						if (rows[i].status == "new") {
							rows_index.push(rows[i].rowId);// 新增
						} else {
							chr_ids.push(rows[i].data.chr_id.value);
							//chr_codes.push(rows[i].data.chr_code.value);

						}
					}
					if (rows_index.length > 0) {
						for (var k = 0; k < rows_index.length; k++) {
							viewModel.gridDatatable
									.removeRowByRowId(rows_index[k]);
						}
						ip.ipInfoJump("删除成功！", "success");
					}
					if (chr_ids.length > 0) {
						// field_codes = field_codes.toString();
						$.ajax({
							url : "/df/f_ebank/financeAcctManage/delRecSql.do?tokenid="
									+ viewModel.tokenid,
							data : {
								"ajax" : "nocache",
								"chr_ids" : chr_ids.toString(),
							//	"chr_codes" : chr_codes.toString()
							},
							type : "POST",
							dataType : "json",
							success : function(datas) {
								if (datas.errorCode == "0") {
									ip.ipInfoJump(datas.result, "success");
									viewModel.getGrid();
									viewModel.getAccountType();
									viewModel.fsetStatus(0);
								} else {
									ip.ipInfoJump("删除失败！原因：" + datas.result,
											"error");
								}
							}
						});
					}
				});
				$(".cCla").on("click", function() {
							$("#config-modal").remove();
						});
			};

			fModalOk = function() {
				// var treeObj = $.fn.zTree.getZTreeObj("treeId");
				// var nodes = treeObj.getSelectedNodes();
				// var chr_code = nodes[0].chr_code;

				var curent_modalRow = viewModel.dataTable.getFocusRow();
				var curent_subsystemRow = viewModel.gridDatatable.getFocusRow();

				viewModel.gridDatatable.setValue("bank_code",
						curent_modalRow.data["chr_code"].value,
						curent_subsystemRow);
				viewModel.gridDatatable.setValue("bank_name",
						curent_modalRow.data["chr_name"].value,
						curent_subsystemRow);
				$('#wizardModal').modal('hide');
			};
			viewModel.fModalCancel = function() {
				$('#wizardModal').modal('hide');
			};

			fGetGrid = function() {
				viewModel.initGrid();
			};
			fGridOndblclick = function() {
				viewModel.fEditRec();
			};
			viewModel.subSaveRow = function() {

				var current_grid = $("#subsystem-grid").parent()[0]['u-meta'].grid;
				var rows = viewModel.gridDatatable.getAllRows();
				var rows_grid = current_grid.getAllRows();
				var upd_rows = [];
				var new_rows = [];

				for (var i = 0; i < rows.length; i++) {
					// if (!null),if (!undefined),if (!"")，均为True
					if (!rows[i].data.account_no.value) {
						ip.warnJumpMsg("所填信息'账号'不能为空！", 0, 0, true);
						return;
					} else if (!rows[i].data.account_name.value) {
						ip.warnJumpMsg("所填信息'账户名称'不能为空！", 0, 0, true);
						return;
					} else if (!rows[i].data.bank_code.value) {
						ip.warnJumpMsg("所填信息'开户行'不能为空！", 0, 0, true);
						return;
					} else if (!rows[i].data.account_type.value) {
						ip.warnJumpMsg("所填信息'账户类型'不能为空！", 0, 0, true);
						return;
					}
					if(gtab == "005"){
						if (!rows[i].data.finance_code.value) {
							ip.warnJumpMsg("所填信息'财政机构'不能为空！", 0, 0, true);
							return;
						}
						if ( rows[i].data.finance_code.value.length>6) {
							ip.warnJumpMsg("所填信息'财政机构'不能超过6位！", 0, 0, true);
							return;
						}
					}
					switch (rows[i].status) {
						case "upd" :
							var data = rows_grid[i];
							upd_rows.push(data);
							break;
						case "new" :
							var data = rows_grid[i];
							new_rows.push(data);
							break;
					}
				}
				upd_rows = JSON.stringify(upd_rows);
				new_rows = JSON.stringify(new_rows);

				$.ajax({
					url : "/df/f_ebank/financeAcctManage/updateRecSql.do?tokenid="
							+ viewModel.tokenid,
					data : {
						"ajax" : "nocache",
						"upd_rows" : upd_rows,
						"new_rows" : new_rows
					},
					type : "POST",
					dataType : "json",
					success : function(datas) {
						if (datas.errorCode == "0") {
							viewModel.fRefRec();
							ip.ipInfoJump(datas.result, "success");
						//	viewModel.gridDatatable.setRowUnSelect(0);
							viewModel.fsetStatus(0);
						} else {
							ip.ipInfoJump("保存失败！原因：" + datas.result, "error");
						}

					}
				});

			};

			viewModel.getGrid = function() {
				// document.getElementsByClassName("active")[0].id;
				var account_type = gtab;
				$.ajax({
					url : "/df/f_ebank/financeAcctManage/getGridData.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type
					},
					success : function(datas) {
						if (datas.errorCode == "0") {

							viewModel.gridDatatable
									.setSimpleData(datas.dataDetail);
							viewModel.gridDatatable.setRowUnSelect(0);

						} else {
							ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
									"error");
						}
					}
				});
			};
			viewModel.gridAfterCreate = function() {
				var index = 4;
				var sysGrid = $("#subsystem-grid").parent()[0]['u-meta'].grid;
				if (gtab == "002") {
					sysGrid.setColumnVisibleByIndex(index, false);
					var tmpcolumn = sysGrid.gridCompColumnArr[index];
					sysGrid.setColumnWidth(tmpcolumn,
							tmpcolumn.options.optionsWidth);
				} else {

					$("#subsystem-grid").parent()[0]['u-meta'].grid
							.setColumnVisibleByIndex(index, true);

					var tmpcolumn = sysGrid.gridCompColumnArr[index];
					sysGrid.setColumnWidth(tmpcolumn,
							tmpcolumn.options.optionsWidth);
					// ck 2017年7月7日08:20:59如果要增加的是最后一列 倒数第二列也需要缩回定义宽度
					if (index == (sysGrid.gridCompColumnArr.length - 1)) {
						var tmpcolumn = sysGrid.gridCompColumnArr[index - 1];
						sysGrid.setColumnWidth(tmpcolumn,
								tmpcolumn.options.optionsWidth);
					}

				}
				var colIndex = 5;
				if(gtab == "005"||gtab == "006"||gtab == "002"){
					sysGrid.setColumnVisibleByIndex(colIndex, true);
					sysGrid.setColumnVisibleByIndex(index, false);
					var tmpcolumn = sysGrid.gridCompColumnArr[colIndex];
					sysGrid.setColumnWidth(tmpcolumn,
							tmpcolumn.options.optionsWidth);
				}else{
					$("#subsystem-grid").parent()[0]['u-meta'].grid
					.setColumnVisibleByIndex(colIndex, false);

					var tmpcolumn = sysGrid.gridCompColumnArr[colIndex];
					sysGrid.setColumnWidth(tmpcolumn,
							tmpcolumn.options.optionsWidth);
					// ck 2017年7月7日08:20:59如果要增加的是最后一列 倒数第二列也需要缩回定义宽度
//					if (colIndex == (sysGrid.gridCompColumnArr.length - 1)) {
//						var tmpcolumn = sysGrid.gridCompColumnArr[colIndex - 1];
//						sysGrid.setColumnWidth(tmpcolumn,
//						tmpcolumn.options.optionsWidth);
//					}
				}
			};

			viewModel.getAccountType = function() {
				// document.getElementsByClassName("active")[0].id;
				var account_type = gtab;
				$.ajax({
					url : "/df/f_ebank/financeAcctManage/getAccountType.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							accountTypeDetail = datas.dataDetail;
						} else {
							ip.ipInfoJump("加载AccountType失败！原因：" + datas.result,
									"error");
						}
					}
				});
			};
			viewModel.getBankTree = function() {
				var account_type = gtab;
				$.ajax({
					url : "/df/f_ebank/financeAcctManage/getBankTree.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type
					},
					success : function(datas) {
						if (datas.errorCode == "0") {

							viewModel.dataTable.setSimpleData(datas.dataDetail);
						} else {
							ip.ipInfoJump("加载BankTree失败！原因：" + datas.result,
									"error");
						}
					}
				});
			};
			
			$(function() {
				var app = u.createApp({
							el : document.body,
							model : viewModel
						});

				viewModel.getGrid();
				viewModel.getAccountType();// 每次切换页签加载一次。
				viewModel.getBankTree();// 只加载一次
				viewModel.fsetStatus(0);
					// viewModel.fsetStatus(0);

				});

		});
