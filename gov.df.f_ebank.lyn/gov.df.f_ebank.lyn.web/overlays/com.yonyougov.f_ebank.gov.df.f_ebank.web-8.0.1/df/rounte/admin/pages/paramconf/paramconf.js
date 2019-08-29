define(['text!pages/paramconf/paramconf.html', 'commonUtil',
		'jquery','bootstrap', 'ip','datatables.net-bs',
		'datatables.net-autofill-bs', 'datatables.net-buttons-bs',
		'datatables.net-colreorder', 'datatables.net-rowreorder',
		'datatables.net-select', 'datatables.net-scroller',
		'datatables.net-keyTable', 'datatables.net-responsive'],
		function(html, commonUtil) {
			var init = function(element, param) {
				document.title = ip.getUrlParameter("menuname");
				var viewModel = {
					tokenid : ip.getTokenId()
				};

				//根据财政机构和参数类型查询表格数据
				viewModel.initGrid = function() {
					var finance_code = $("#finance_code").val();
					var field_disptype = "";
					if ($("#implementParam")[0].checked){
						field_disptype = field_disptype + "1";
					}
					if ($("#developParam")[0].checked){
						field_disptype = field_disptype + "0";
					}
					if (field_disptype.length > 1) {
						field_disptype = "_";
					}
					$.ajax({
						url : "/df/f_ebank/paramconf/paramConfGetGridData.do?tokenid="
								+ viewModel.tokenid,
						type : "POST",
						dataType : "json",
						data : {
							"ajax" : "nocache",
							"financeCode" : finance_code,
							"fieldDisptype" : field_disptype
						},
						success : function(datas) {
							if (datas.errorCode == "0") {
								initUi(datas);
							} else {
								ip.warnJumpMsg("加载Grid失败！原因："
										+ datas.result, 0, 0, true);
							}
						}
					});
				};
				// 初始化表格
				initUi = function(datas) {
					$('#gridDatatable').DataTable({
						destroy : true,
						searching : false,
						paging : false,
						bSort : false,
						bInfo : false,
						select : {
							style : 'os',
							items : 'row'
						},
						language : {
							'zeroRecords' : '没有检索到数据'
						},
						data : datas.dataDetail,
						columns : [ {
								data : 'chr_id'
							}, {
								data : 'chr_name'
							}, {
								data : 'chr_value'
							}, {
								data : 'rg_name'
							}, {
								data : 'chr_code'
							}, {
								data : 'finance_code'
						} ],
						select : {
							style : 'single',
						},
						// 隐藏某一行
						"columnDefs" : [
							{
								"targets" : [ 0, 4, 5 ],
								"visible" : false,
							},
							{
								"targets" : [ 1, 2, 3 ],
								"render" : function(data,
										type, full) {
									if (data == null
											|| data == 'undefined') {
										return "";
									}
//									return "<a title='"
//											+ data
//											+ "' style='color:#000;'>"
//											+ data + "</a>";// 也可以不用a标签，用<span>
									return data;
								}
							} ]
					});
				};
				//修改按钮事件
				editParam = function(status) {
					var rows = $('#gridDatatable').DataTable().rows('.selected');
					var selectRowData = rows.data()[0];
					if (rows.indexes().length == 0) {
						ip.warnJumpMsg("请选择具体的参数进行修改！", 0, 0, true);
						return;
					}
					$("#modal_chr_id").val(selectRowData.chr_id);
					$("#modal_chr_name").val(selectRowData.chr_name);
					// 转义
					if(selectRowData.chr_value != null) {
						$("#modal_chr_value").val(commonUtil.htmlDecodeByRegExp(selectRowData.chr_value));
					}
					$('#editParamModal').modal('show');
				};
				//修改参数保存函数
				fModalOk = function() {
					var chr_name = $("#modal_chr_name").val();
					var chr_value = $("#modal_chr_value").val();
					var finance_code = $("#finance_code").val();
					$.ajax({
						url : "/df/f_ebank/paramconf/paramConfSaveRec.do?tokenid="
								+ viewModel.tokenid,
						type : "POST",
						dataType : "json",
						data : {
							"ajax" : "noCache",
							"chrName" : chr_name,
							"chrValue" : chr_value,
							"financeCode" : finance_code
						},
						success : function(datas) {
							if (datas.errorCode == "0") {
								ip.ipInfoJump("保存成功！", "success");
								$('#editParamModal').modal('hide');
								viewModel.initGrid();
							} else {
								ip.warnJumpMsg("保存参数值失败！原因："
										+ datas.result, 0, 0, true);
							}
						}
					});
				};
				//修改参数取消函数
				fModalCancel = function() {
					$('#editParamModal').modal('hide');
				};

				fGetGrid = function() {
					viewModel.initGrid();
				};
				//初始化页面
				pageInit = function() {
					// 初始化财政机构的下拉框
					var param = ip.getCommonOptions({});
					commonUtil.initFinanceCode("", param);
					viewModel.initGrid();
				};
				$(element).html(html);
				pageInit();
			};
			return {
				init : init
			};
		});
