require(['jquery', 'knockout', 'echarts', 'bootstrap', 'uui', 'director',
				'tree', 'grid', 'ip', 'dateZH'], function($, ko, echarts) {

			var options = ip.getCommonOptions({});
			var gStatus = 0;// 0查询，1新增，2更新
			var qsDetail = null;
			var hkDetail = null;
			var qsSelect = {};
			var hkSelect = {};

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
								'bank_name' : {}
							}
						}),
				qsDatatable : new u.DataTable({
							meta : {
								'chr_id' : {},
								'account_no' : {},
								'account_name' : {},
								'account_type_name' : {},
								'bank_name' : {}
							}
						}),
				hkDatatable : new u.DataTable({
							meta : {
								'chr_id' : {},
								'account_no' : {},
								'account_name' : {},
								'account_type_name' : {},
								'bank_name' : {}
							}
						}),
				qsDatatableM : new u.DataTable({
							meta : {
								'chr_id' : {},
								'account_no' : {},
								'account_name' : {},
								'account_type_name' : {},
								'bank_name' : {}
							}
						}),
				hkDatatableM : new u.DataTable({
							meta : {
								'chr_id' : {},
								'account_no' : {},
								'account_name' : {},
								'account_type_name' : {},
								'bank_name' : {}
							}
						}),
				/*dataTable : new u.DataTable({
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
								'chr_name' : {
									'value' : ""
								}
							}
						})*/
			};

			subsysRowCheck = function() {
				viewModel.getQSGrid();
				viewModel.getHKGrid();
			};

			viewModel.fRefRec = function() {
				viewModel.subsysGrid();
				ip.ipInfoJump("已刷新！！", "success");

			};
			viewModel.fBandRec = function() {
				var rows = viewModel.gridDatatable.getSelectedRows();
				if(rows==undefined||rows.length!=1){
					ip.ipInfoJump("请选择一条账户信息进行绑定！","error");
					return;
				}
				document.getElementById("balance_account_id").value = rows[0].data["chr_id"].value;
				document.getElementById("balance_account_no").value = rows[0].data["account_no"].value;
				viewModel.getQSGridM(document.getElementById("balance_account_id").value);
				viewModel.getHKGridM(document.getElementById("balance_account_id").value);
				$('#wizardModal').modal('show');
			};

			viewModel.fFindFirst1 = function() {
				viewModel.findNextGrid(
						$("#subsystem-grid").parent()[0]['u-meta'].grid,
						"account_name,account_no,bank_name", document
								.getElementById("findText1").value);
			}

			viewModel.fFindRef1 = function() {
				document.getElementById("findText1").value = "";
				viewModel.subsysGrid();
			}
			viewModel.fFindFirst2 = function() {

				viewModel.findNextGrid(
						$("#qs-grid-m").parent()[0]['u-meta'].grid,
						"account_name,account_no,bank_name", document
								.getElementById("findText2").value);
			}

			viewModel.fFindRef2 = function() {
				document.getElementById("findText2").value = "";
				viewModel.getQSGridM(document
						.getElementById("balance_account_id").value);
			}
			viewModel.fFindFirst3 = function() {
				viewModel.findNextGrid(
						$("#hk-grid-m").parent()[0]['u-meta'].grid,
						"account_name,account_no,bank_name", document
								.getElementById("findText3").value);
			}

			viewModel.fFindRef3 = function() {
				document.getElementById("findText3").value = "";
				viewModel.getHKGridM(document
						.getElementById("balance_account_id").value);
			}

			fModalOk = function() {
				viewModel.subSaveRow();
				$('#wizardModal').modal('hide');
			}
			viewModel.fModalCancel = function() {
				$('#wizardModal').modal('hide');
			}

			// qsSelect={};
			// hkSelect={};
			viewModel.qsRowSelected = function(obj) {
				if (obj.rowObj.checked) {
					if (qsSelect[obj.rowObj.value.chr_id] == null) {
						qsSelect[obj.rowObj.value.chr_id] = "new";
					} else if (qsSelect[obj.rowObj.value.chr_id] == "del") {
						delete qsSelect[obj.rowObj.value.chr_id]
					}
				} else {
					if (qsSelect[obj.rowObj.value.chr_id] == null) {
						qsSelect[obj.rowObj.value.chr_id] = "del";
					} else if (qsSelect[obj.rowObj.value.chr_id] == "new") {
						delete qsSelect[obj.rowObj.value.chr_id]
					}
				}

			}

			viewModel.hkRowSelected = function(obj) {

				if (obj.rowObj.checked) {
					if (hkSelect[obj.rowObj.value.chr_id] == null) {
						hkSelect[obj.rowObj.value.chr_id] = "new";
					} else if (hkSelect[obj.rowObj.value.chr_id] == "del") {
						delete hkSelect[obj.rowObj.value.chr_id]
					}
				} else {
					if (hkSelect[obj.rowObj.value.chr_id] == null) {
						hkSelect[obj.rowObj.value.chr_id] = "del";
					} else if (hkSelect[obj.rowObj.value.chr_id] == "new") {
						delete hkSelect[obj.rowObj.value.chr_id]
					}
				}
			}

			viewModel.subSaveRow = function() {

				var qsSelectStr = JSON.stringify(qsSelect);
				var hkSelectStr = JSON.stringify(hkSelect);
				var balance_account_id = document
						.getElementById("balance_account_id").value;
				var balance_account_no = document
				.getElementById("balance_account_no").value;
				$.ajax({
					url : "/df/f_ebank/accountRelation/updateRecSql.do?tokenid="
							+ viewModel.tokenid,
					data : {
						"ajax" : "nocache",
						"balance_account_id" : balance_account_id,
						"balance_account_no" : balance_account_no,
						"qsSelectStr" : qsSelectStr,
						"hkSelectStr" : hkSelectStr
					},
					type : "POST",
					dataType : "json",
					success : function(datas) {
						if (datas.errorCode == "0") {
							ip.ipInfoJump(datas.result, "success");
							subsysRowCheck();
						} else {
							ip.ipInfoJump("保存失败！原因：" + datas.result, "error");
						}

					}
				})
			}

			viewModel.findNextGrid = function(grid, colName, colValue) {
				// grid=$("#subsystem-grid").parent()[0]['u-meta'].grid
				var arrStr = colName.split(",");
				if (colValue != null)
					for (var i = grid.dataSourceObj.rows.length - 1; i > -1; i--) { 
                     // 从后往前循环。因为删除行，会导致行数变化，导致i不再对应原有行，倒着删除则没有影响。
						var n = 0;
						for (var j = 0; j < arrStr.length; j++) {
							if (grid.dataSourceObj.rows[i].value[arrStr[j]]
									.indexOf(colValue) > -1) {
								n++;
								break;
							}
						}
						if (n == 0) {
							grid.deleteOneRow(i);
						}
					}
			}

			viewModel.subsysGrid = function() {
				// document.getElementsByClassName("active")[0].id;
				var balance_account_id = "";
				var account_type = "002";
				$.ajax({
					url : "/df/f_ebank/accountRelation/getAccountData.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type,
						"balance_account_id" : balance_account_id
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
				})
			}

			viewModel.getQSGrid = function() {
				var fRow = viewModel.gridDatatable.getFocusRow();
				var balance_account_id = fRow.data["chr_id"].value;
				var relation_account_type = "001";
				$.ajax({
					url : "/df/f_ebank/accountRelation/getAccountRelationData.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"relation_account_type" : relation_account_type,
						"balance_account_id" : balance_account_id
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							qsDetail = datas.dataDetail;
							viewModel.qsDatatable
									.setSimpleData(datas.dataDetail);

						} else {
							ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
									"error");
						}
					}
				})
			}

			viewModel.getHKGrid = function() {
				var fRow = viewModel.gridDatatable.getFocusRow();
				var balance_account_id = fRow.data["chr_id"].value;
				var relation_account_type = "003"
				$.ajax({
					url : "/df/f_ebank/accountRelation/getAccountRelationData.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"relation_account_type" : relation_account_type,
						"balance_account_id" : balance_account_id
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							hkDetail = datas.dataDetail;
							viewModel.hkDatatable
									.setSimpleData(datas.dataDetail);

						} else {
							ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
									"error");
						}
					}
				})
			}
			viewModel.getQSGridM = function(balance_account_id) {
				// document.getElementsByClassName("active")[0].id;
				var account_type = "001";
				$.ajax({
					url : "/df/f_ebank/accountRelation/getAccountData.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type,
						"balance_account_id" : balance_account_id
					},
					success : function(datas) {
						if (datas.errorCode == "0") {

							viewModel.qsDatatableM
									.setSimpleData(datas.dataDetail);
							viewModel.qsDatatableM.setRowUnSelect(0);

							for (var i = 0; i < datas.dataDetail.length; i++)
								if (datas.dataDetail[i].status == "1") {
									// viewModel.qsDatatableM.setRowSelect(i);
									var qsGrid = $("#qs-grid-m").parent()[0]['u-meta'].grid
									var obj = {};
									obj.gridObj = qsGrid;
									obj.rowObj = qsGrid.dataSourceObj.rows[i];
									obj.rowIndex = i;
									qsGrid.options.onRowSelected(obj);

								}

							qsSelect = {};
							hkSelect = {};
						} else {
							ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
									"error");
						}
					}
				})
			}

			viewModel.getHKGridM = function(balance_account_id) {
				// document.getElementsByClassName("active")[0].id;
				var account_type = "003";
				$.ajax({
					url : "/df/f_ebank/accountRelation/getAccountData.do?tokenid="
							+ viewModel.tokenid,
					type : "POST",
					dataType : "json",
					data : {
						"ajax" : "nocache",
						"account_type" : account_type,
						"balance_account_id" : balance_account_id
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							viewModel.hkDatatableM
									.setSimpleData(datas.dataDetail);
							viewModel.hkDatatableM.setRowUnSelect(0);
							for (var i = 0; i < datas.dataDetail.length; i++)
								if (datas.dataDetail[i].status == "1") {

									var qsGrid = $("#hk-grid-m").parent()[0]['u-meta'].grid
									var obj = {};
									obj.gridObj = qsGrid;
									obj.rowObj = qsGrid.dataSourceObj.rows[i];
									obj.rowIndex = i;
									qsGrid.options.onRowSelected(obj);

								}
							qsSelect = {};
							hkSelect = {};
						} else {
							ip.ipInfoJump("加载Grid失败！原因：" + datas.result,
									"error");
						}
					}
				})
			}

			$(function() {
						var app = u.createApp({
									el : document.body,
									model : viewModel
								})
						viewModel.subsysGrid();

					})

		});
