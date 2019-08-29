define(
		[ 'jquery', 'knockout', '/df/fap/system/config/ncrd.js',
				'text!fap/system/config/billno/editUpdate._html',
				'text!fap/system/config/billno/editBase.css', 'bootstrap',
				'uui', 'tree', 'grid', 'ip' ],
		function($, ko, ncrd, template) {
			window.ko = ko;
			var onCloseCallback;
			var tokenid = ip.getTokenId();
			var LIST_APP_DO_URL = '/df/billNoRule/list/findAllSysApp.do';//获取所有应用模块
			var RULEITEM_SAVE_URL = '/df/billNoRule/ruleItem/saveorUpdateSysBillNoRule.do';//保存或更新
			var ELEMENTS_DO_URL = '/df/billNoRule/getElement.do';//获取所有要素下拉列表
			var LEVEL_DO_URL = '/df/billNoRule/getMaxLevelNumByEleCode.do';//获取要素级次列表
			var viewModel = {
				billId : ko.observable(),//单号id
				billCode : ko.observable(),//单号编码
				billName : ko.observable(),//单号名称
				//sysApps: ko.observableArray(),//应用模块
				selectedApp : ko.observable(),//应用模块
				ruleEleCode : ko.observable(),//规则项页面中表单的 要素
				ruleFormat : ko.observable(),//规则项格式
				selectedLevel : ko.observable(),//规则项级次
				ruleInitValue : ko.observable(),//规则项初始值
				comElesArr : ko.observableArray(),//自增要素表格中的要素列表
				//规则项信息  类型
				types : ko.observableArray([				
				{
					name : '常量',
					value : '0'
				}, {
					name : '日期',
					value : '1'
				}, {
					name : '要素',
					value : '2'
				}, {
					name : '要素自增序列',
					value : '3'
				} ]),
				selectedType : ko.observable(0), //被选中的类型对象     默认选中 请选择
				//单号规则 表格
				editDataTable : new u.DataTable({
					meta : {
						'last_ver' : {},
						'line_format' : {},
						'line_format_name' : {},
						'latest_op_date' : {},
						'billnoruleline_id' : {},
						'line_no' : {},
						'line_type' : {},
						'line_type_name' : {},
						'ele_code' : {},
						'ele_code_name' : {},
						'level_num' : {},
						'level_num_name' : {},
						'set_year' : {},
						'init_value' : {},
						'latest_op_user' : {},
						'rg_code' : {},
						'eles' : [ {
							'last_ver' : {},
							'billnoruleline_id' : {},
							'rg_code' : {},
							'set_year' : {},
							'ele_code' : {},
							'ele_code_name' : {},
							'level_num' : {},
							'level_num_name' : {}
						} ],
						eles_name : {}
					}
				}),
				//规则项信息  表格
				ruleItem_dataTable : new u.DataTable({//创建一个名为‘ruleItem_dataTable’的数据集
					meta : {//meta 放字段集
						'line_no': {},
						'billnoruleline_id' : {},
						'ele_code' : {},
						'level_num' : {}
					}
				}),
				/*
				 elesDataTable : new u.DataTable({//放置要素自增要素的数据
				 meta : {
				 'ele_code' : {},
				 'level_num' : {}
				 }
				 }),
				 */

				comEles : new u.DataTable({ //放置自增要素表的要素列表
					meta : {
						'name' : {},
						'value' : {}
					}
				}),
				comElesLevel : [ {
					'name' : '底级',
					'value' : '-1',
				}, {
					'name' : '一级',
					'value' : '1',
				}, {
					'name' : '二级',
					'value' : '2',
				}, {
					'name' : '三级',
					'value' : '3',
				}, {
					'name' : '四级',
					'value' : '4',
				}, {
					'name' : '五级',
					'value' : '5',
				}, {
					'name' : '六级',
					'value' : '6',
				}, {
					'name' : '七级',
					'value' : '7',
				}, {
					'name' : '八级',
					'value' : '8',
				}, {
					'name' : '九级',
					'value' : '9',
				}, ],

			};
			var data = {
				"editDatas" : [],
				"ruleItemDatas" : [],
				'lineDelDatas' : []
			};
			var treeData = [];
			var lineIdsToBeDeleted = [];
			var BillCodeBefore;//修改时初始化的的规则编号  要与修改后的作对比
			viewModel.editDataTable.setSimpleData(data.editDatas,{unSelect:true});
			viewModel.ruleItem_dataTable.setSimpleData(data.ruleItemDatas,{unSelect:true});
			//               viewModel.lineDelDataTable.setSimpleData(data.lineDelDatas,{unSelect:true});
			//                var billNoNum = 0;
			//                //自动增加 序号 line_no
			//                optFun = function(obj) {
			//                	billNoNum++;
			//                	obj.element.innerHTML = billNoNum;
			//                },

			//---------------------------------------------------规则信息 edit 弹框------------------------------------------------

			//上移表格数据
			viewModel.editUp = function() {
				if(viewModel.editDataTable.getSimpleData()){
					var row=viewModel.editDataTable.getFocusRow();		
					if(row){
						var index = viewModel.editDataTable.getFocusIndex();// 获取焦点行的索引
						if (index > 0) {// 判断当前行是否为第一行
							var arr = [], arr_before = [];
							var focus_row = viewModel.editDataTable.getRow(index);// 取出当前焦点行
							arr_before = viewModel.editDataTable.getRow(index - 1);
							var arr = focus_row.getSimpleData();
							focus_row.setSimpleData(arr_before.getSimpleData());// 将焦点行上面的一行数据赋给焦点行
							arr_before.setSimpleData(arr);
							viewModel.editDataTable.setRowSelect(index-1);//光标跟着上移
							setLineno();
						}else{
							// alert("当前行无法上移！");
							ip.ipInfoJump("当前行无法上移","info");
						}
					}else{
//						viewModel.editDataTable.setRowFocus(0);
//						viewModel.editUp();		
// 						alert("请选中要上移的数据！");
						ip.ipInfoJump("请选择要上移的数据","info");
					}
				}else{
					// alert("没有可上移的数据！");
					ip.ipInfoJump("没有可上移的数据","info");
				}
				
			};
			//下移表格数据
			viewModel.editDown = function() {
				if(viewModel.editDataTable.getSimpleData()){
					var row=viewModel.editDataTable.getFocusRow();
					if(row){
						var index = viewModel.editDataTable.getFocusIndex();				
						var rowNum = viewModel.editDataTable.getAllRows().length;
						if (index < rowNum - 1) {// 判断当前行不是最后一行
							var arr = [], arr_after = [];
							var focus_row = viewModel.editDataTable.getFocusRow(index);// 取出当前焦点行对象
							var after_row = viewModel.editDataTable.getRow(index + 1);// 取出当前焦点行的下一行的行对象
							arr = focus_row.getSimpleData();// 将焦点行的数据传给数组arr_curr
							focus_row.setSimpleData(after_row.getSimpleData());// 将焦点行下面的一行数据赋给焦点行
							after_row.setSimpleData(arr);// 数组arr_curr的数据给后面一行
							viewModel.editDataTable.setRowUnFocus(index);
							viewModel.editDataTable.setRowFocus(index+1);//光标跟下移
							setLineno();
						}else{
							// alert("当前行无法下移！");
							ip.ipInfoJump("当前行无法下移","info");
						}
					}else{
//						viewModel.editDataTable.setRowFocus(0);
//						viewModel.editDown();		
// 						alert("请选中要下移的数据！");
						ip.ipInfoJump("请选择要下移的数据","info");
					}		
				}else{
					// alert("没有可下移的数据！");
					ip.ipInfoJump("没有可下移的数据","info");
				}
				
			};
			//删除表格数据
			viewModel.editDelete = function() {
				if(viewModel.editDataTable.getSimpleData()){
					var row=viewModel.editDataTable.getFocusRow();
					if(row){
						var index = viewModel.editDataTable.getFocusIndex();
						ip.warnJumpMsg("确定删除吗？", "sid", "cCla",false);					
						$("#sid").on("click", function() {
							viewModel.editDataTable.getAllRows().splice(index,1);
							var editData=viewModel.editDataTable.getSimpleData();
							viewModel.editDataTable.setSimpleData(editData,{unSelect:true});
							setLineno();//设置序号
							$("#config-modal").remove();
						});
						$(".cCla").on("click", function() {
							$("#config-modal").remove();
						});
					} else {
//						viewModel.editDataTable.setRowFocus(0);
//						viewModel.editDelete();
// 						alert("请选择要删除的数据！");
						ip.ipInfoJump("请选择要删除的数据","info");
					}	
				}else{
					// alert("当前表格没有可删除的数据！");
					ip.ipInfoJump("当前表格没有可删除的数据","info");
				}
			};

			//修改 规则项 edit 表格中数据
			viewModel.updateRule = function() {
				if(viewModel.editDataTable.getSimpleData()!=null){
					var row = viewModel.editDataTable.getFocusRow();// 获取当前行数据								
					if (row) {// 获取焦点行
						updateShow(row);
					} else {// 没有获取焦点行
						// alert("请选择要修改的数据!");
						ip.ipInfoJump("请选择要修改的数据","info");
					}
				}else{
					$("#ruleItemBoxTitle").val("addRule");
					// alert("当前表格没有可修改的数据!");
					ip.ipInfoJump("当前表格没有可修改的数据","info");
				}
			};
			//点击修改或者双击时将数据显示在修改页面
			var updateShow = function(rowObj){
				//alert("rowObj");
				viewModel.ruleItem_dataTable.clear();			
				//$("#updateBtn").attr("data-target", "#ruleItemBox");				
				$("#ruleItemBoxTitle").val("updateRule");					
				//console.log(viewModel.ruleItem_dataTable.getSimpleData());
				/*
				 * viewModel.selectedType(row.getValue('line_type'));
				 * viewModel.ruleEleCode(row.getValue('ele_code'));
				 * if(viewModel.selectedType()=='3'){
				 * formatOrLengthShow("length"); }else{
				 * formatOrLengthShow("format"); }
				 * viewModel.ruleFormat(row.getValue('line_format'));
				 * viewModel.selectedLevel(row.getValue('level_num'));
				 * viewModel.ruleInitValue(row.getValue('init_value'));
				 * viewModel.ruleItem_dataTable.setSimpleData(row.getValue('eles'));
				 */					
				var line_type=rowObj.getValue('line_type');
				var ele_code = rowObj.getValue('ele_code');
				var line_format = rowObj.getValue('line_format');
				var level_num = rowObj.getValue('level_num');
				var init_value = rowObj.getValue('init_value');
				var eles;
				if(rowObj.getValue('eles')!=null){
					eles = rowObj.getValue('eles').getSimpleData();
				}else{
					eles = null;
				}										
				if (line_type == "0") {// 选择类型：常量
					//viewModel.selectedType(line_type);
					$("#line_type").val(line_type);
					formatOrLengthShow("format");// 显示格式
					$("#ele_code_sel").val('').attr("disabled", true);
					$("#line_format").val('').attr("disabled", true);
					$("#level_num").val('').attr("disabled", true);
					$("#init_value").removeAttr("disabled").val(init_value);
					viewModel.ruleItem_dataTable.clear();
					$("#seqAddBtn").attr("disabled", true);
					$("#seqDelBtn").attr("disabled", true);
				} else if (line_type == "1") {// 选择类型：日期
					//viewModel.selectedType(line_type);
					$("#line_type").val(line_type);
					$("#ele_code_sel").attr("disabled", true);
					formatOrLengthShow("format");
					getDateFormat();// 获取时间格式的select列表
					$("#ele_code_sel").val('').attr("disabled", true);						
					$("#line_format").removeAttr("disabled").val(line_format);
					$("#level_num").val('').attr("disabled", true);
					$("#init_value").val('').attr("disabled", true);
					viewModel.ruleItem_dataTable.clear();
					$("#seqAddBtn").attr("disabled", true);
					$("#seqDelBtn").attr("disabled", true);
				} else if (line_type == "2") {// 选择类型：要素
					//viewModel.selectedType(line_type);						
					$("#line_type").val(line_type);
					getElements();
					$("#ele_code_sel").removeAttr("disabled").val(ele_code);
					viewModel.eleCodeChange();
					formatOrLengthShow("format");
					getEleFormat();
					$("#line_format").removeAttr("disabled").val(line_format);
					$("#level_num").removeAttr("disabled").val(level_num);					
					$("#init_value").val('').attr("disabled", true);	
					viewModel.ruleItem_dataTable.clear();
					$("#seqAddBtn").attr("disabled", true);
					$("#seqDelBtn").attr("disabled", true);
				} else if (line_type == "3") {// 选择类型：自增序列
					//getElesData();
					//viewModel.selectedType(line_type);
					$("#line_type").val(line_type);
					$("#ele_code_sel").val('').attr("disabled", true);
					formatOrLengthShow("length");
					$("#line_format").removeAttr("disabled").val(line_format);
					$("#level_num").val('').attr("disabled", true);
					$("#init_value").removeAttr("disabled").val(init_value);					
					$("#seqAddBtn").attr("disabled", false);
					$("#seqDelBtn").attr("disabled", false);
					viewModel.ruleItem_dataTable.setSimpleData(eles,{unSelect:true});
					setLineno('eles');//设置序号
				}			
				$("#line_type").attr("disabled", true);
				$("#ruleItemBox").modal({backdrop: 'static'});
			}
			//增加规则项
			viewModel.addRule = function() {
				$("#line_type").removeAttr("disabled");
				$("#ruleItemBoxTitle").val("addRule");
				$("#line_type").val("0");
				formatOrLengthShow("format");
				$("#ele_code_sel").val('').attr("disabled", true);
				$("#line_format").val('').attr("disabled", true);
				$("#level_num").val('').attr("disabled", true);
				$("#init_value").val('').removeAttr("disabled");
				viewModel.ruleItem_dataTable.clear();
				$("#seqAddBtn").attr("disabled", true);
				$("#seqDelBtn").attr("disabled", true);
			};
			//规则项弹框的关闭按钮
			viewModel.cancleItem1 = function() {
				viewModel.selectedType('');
				viewModel.ruleEleCode('');
				viewModel.ruleFormat('');
				viewModel.selectedLevel('');
				viewModel.ruleInitValue('');
				$("#closeBtn").attr('data-dismiss', 'modal');
			}
			// 规则项弹框的取消按钮
			viewModel.cancleItem2 = function() {
				viewModel.selectedType('');
				viewModel.ruleEleCode('');
				viewModel.ruleFormat('');
				viewModel.selectedLevel('');
				viewModel.ruleInitValue('');
				$("#cancleItemBtn").attr('data-dismiss', 'modal');
			}

		
			//--------------------------规则项信息 ruleItem 弹框--------------------------

			
			
			//todo 元素 下拉列表选择时触发onchange事件   获取下拉列表 级次
			viewModel.eleCodeChange = function() {//指定onchange事件需要执行的方法
				var eleCode = $("#ele_code_sel").val();
				$("#level_num").html('');				
						$.ajax({
							type : 'GET',
							url : LEVEL_DO_URL + '?tokenid=' + tokenid,
							data : { "eleCode" : eleCode ,
								     "ajax": "noCache"
							        },
							async: false,
							dataType : 'json',
							cache: false,
							success : function(result) {
//								console.log("result:" + result);
								/*var maxLevel=result.maxLevel;
								 console.log("maxLevel:"+maxLevel);*/
								if (result != -1) {
									$("#level_num").append(
											"<option value='-1'>" + '底级'
													+ "</option>");
									for ( var i = 1; i <= result; i++) {
										var text = "级";
										switch (i) {
										case 1:
											text = "一" + text
											break;
										case 2:
											text = "二" + text
											break;
										case 3:
											text = "三" + text
											break;
										case 4:
											text = "四" + text
											break;
										case 5:
											text = "五" + text
											break;
										case 6:
											text = "六" + text
											break;
										case 7:
											text = "七" + text
											break;
										case 8:
											text = "八" + text
											break;
										case 9:
											text = "九" + text
											break;
										default:
											break;
										}
										$("#level_num").append(
												"<option value=" + i + ">"
														+ text + "</option>");
										
									}
								}
							},
							error : ncrd.commonAjaxError,
						});
			};		
			//获取 要素 下拉列表
			var getElements=function () {
				$.ajax({
					type : 'GET',
					url : ELEMENTS_DO_URL + '?tokenid=' + tokenid,
					dataType : 'json',
					data: { "ajax": "noCache" },
					async: false,
					cache: false,
					success : function(result) {
						var data = result.data;
//						console.log(data);
						if (data != null) {
							for ( var i = 0; i < data.length; i++) {
								$("#ele_code_sel").append(
										"<option value=" + data[i].ele_code
												+ ">" + data[i].ele_name
												+ "</option>");
							}
						} 
						viewModel.eleCodeChange();
					},
					error : ncrd.commonAjaxError,
				});
			}
			//获取 日期格式 下拉列表
			var getDateFormat=function () {
				$("#line_format").html(
						"<option value='YYYYMMDD'>" + 'YYYYMMDD' + "</option>"
								+ "<option value='YYYYMM'>" + 'YYYYMM'
								+ "</option>" + "<option value='YYYY'>"
								+ 'YYYY' + "</option>"
								+ "<option value='MMDD'>" + 'MMDD'
								+ "</option>" + "<option value='MM'>" + 'MM'
								+ "</option>" + "<option value='DD'>" + 'DD'
								+ "</option>");
			}
			//获取 要素格式 下拉列表
			var getEleFormat=function() {
				$("#line_format").html(
						"<option value='0'>" + '编码' + "</option>"
								+ "<option value='1'>" + '名称' + "</option>"
								+ "<option value='2'>" + '简称' + "</option>");
			}
			//格式和位长框的切换
			var formatOrLengthShow=function (name) {
				if (name == 'format') {
					$("#formatDiv")
							.html(
									"<label for='line_format' class='col-sm-2 control-label' id='lineFormatLabel'>格式:</label>"
											+ "<div class='col-sm-4'>"
											+ "<select class='form-control' id='line_format' disabled data-bind='value:ruleFormat'></select>"
											+ "</div>");
				}
				if (name == 'length') {
					$("#formatDiv")
							.html(
									"<label for='line_format' class='col-sm-2 control-label' id='lineFormatLabel'>位长:</label>"
											+ "<div class='col-sm-4'>"
											+ "<input type='text' class='form-control' id='line_format' disabled data-bind='value:ruleFormat'>"
											+ "</div>");
				}
			}
			//选择类型
			viewModel.typeChange = function() {//指定onchange事件需要执行的方法
				if ($("#line_type").val() == "0") {//选择类型：常量
					formatOrLengthShow("format");//显示格式
					$("#ele_code_sel").val('').attr("disabled", true);
					$("#line_format").val('').attr("disabled", true);
					$("#level_num").val('').attr("disabled", true);
					$("#init_value").removeAttr("disabled").focus();
					$("#seqAddBtn").attr("disabled", true);
					$("#seqDelBtn").attr("disabled", true);
				} else if ($("#line_type").val() == "1") {//选择类型：日期
					$("#ele_code_sel").attr("disabled", true);
					formatOrLengthShow("format");
					$("#ele_code_sel").val('').attr("disabled", true);
					$("#line_format").removeAttr("disabled");
					$("#level_num").val('').attr("disabled", true);
					$("#init_value").val('').attr("disabled", true);
					getDateFormat();//获取时间格式的select列表
					$("#seqAddBtn").attr("disabled", true);
					$("#seqDelBtn").attr("disabled", true);
				} else if ($("#line_type").val() == "2") {//选择类型：要素
					$("#ele_code_sel").removeAttr("disabled");
					formatOrLengthShow("format");
					$("#line_format").removeAttr("disabled");
					$("#level_num").removeAttr("disabled");
					$("#init_value").val('').attr("disabled", true);
					getElements();
					getEleFormat();
					//getLevels();//todo 获取级次的select列表
					$("#seqAddBtn").attr("disabled", true);
					$("#seqDelBtn").attr("disabled", true);
				} else if ($("#line_type").val() == "3") {//选择类型：自增序列
					$("#ele_code_sel").val('').attr("disabled", true);
					formatOrLengthShow("length");
					$("#line_format").removeAttr("disabled");
					$("#level_num").val('').attr("disabled", true);
					$("#init_value").val('').removeAttr("disabled");
					$("#seqAddBtn").attr("disabled", false);
					$("#seqDelBtn").attr("disabled", false);
				} else {
					$("#line_type").val("0");
					formatOrLengthShow("format");
					$("#ele_code_sel").val('').attr("disabled", true);
					$("#line_format").val('').attr("disabled", true);
					$("#level_num").val('').attr("disabled", true);
					$("#init_value").val('').attr("disabled", true);
					$("#seqAddBtn").attr("disabled", true);
					$("#seqDelBtn").attr("disabled", true);
				}
			};
			//双击行数据 出现修改页面
			viewModel.onDblClickFun1=function(object){
				var index=object.rowIndex;//双加的行索引
				viewModel.editDataTable.setRowUnFocus();//焦点行反选
				viewModel.editDataTable.setRowFocus(index);
				viewModel.updateRule();
				//rowObj getSimpleData() getValue()获取不到			
			};
			
			//删除表格数据
			viewModel.del_ruleItem = function() {
				if(viewModel.ruleItem_dataTable.getSimpleData()){
					var row=viewModel.ruleItem_dataTable.getFocusRow();
					if(row){
						var index = viewModel.ruleItem_dataTable.getFocusIndex();
						ip.warnJumpMsg("确定删除吗？", "sid", "cCla",false);
						$("#sid").on("click", function() {
							viewModel.ruleItem_dataTable.getAllRows().splice(index,1);
							var ruleData=viewModel.ruleItem_dataTable.getSimpleData();
							viewModel.ruleItem_dataTable.setSimpleData(ruleData,{unSelect:true});
							setLineno('eles');//设置序号
							 //alert("删除成功！");
							//ip.ipInfoJump("删除成功！","success");
							$("#config-modal").remove();
						});
						$(".cCla").on("click", function() {
							$("#config-modal").remove();
						});
					}else{
//						viewModel.ruleItem_dataTable.setRowFocus(0);
//						viewModel.del_ruleItem();
// 						alert("请选择要删除的数据！");
						ip.ipInfoJump("请选择要删除的数据！","info");
					}
				}else{
					// alert("没有可删除的数据！");
					ip.ipInfoJump("当前表格没有可删除的数据！","info");
				}
			};
			// todo 增加表格数据  要素自增序列
			viewModel.add_ruleItem = function() {
				viewModel.ruleItem_dataTable.createEmptyRow(); //增加一行
				setLineno('eles');//设置序号
				//getElesData();
				//  var rowNum = viewModel.ruleItem_dataTable.getAllRows().length;
				//  viewModel.ruleItem_dataTable.getRow(rowNum - 1).setValue("code", rowNum);
			};
			//todo  增加/修改单号规则 保存数据到edit页面
			viewModel.save_ruleItem = function() {
				$("#ruleItem_add").removeAttr('data-dismiss');
				var title = $("#ruleItemBoxTitle").val();
				//获取 规则项 数据
				var line_type = $("#line_type").val();
				var line_type_name = $("#line_type").find("option:selected").text();
				var ele_code , ele_code_name;
				var line_format , line_format_name;
				var level_num , level_num_name;
				var init_value;
				var eles , eles_name;			
				//保证每次只能保存一种类型 防止没点保存的情况下切换类型 都保存
				if(line_type=='0'){//常量
					init_value = $("#init_value").val();
				}
				if(line_type=='1'){//日期
					line_format = $("#line_format").val();
					line_format_name = $("#line_format").find("option:selected").text();
				}
				if(line_type=='2'){//要素
					ele_code = $("#ele_code_sel").val();
					ele_code_name = $("#ele_code_sel").find("option:selected").text();
					line_format = $("#line_format").val();
					line_format_name = $("#line_format").find("option:selected").text();
					level_num = $("#level_num").val();
					level_num_name = $("#level_num").find("option:selected").text();
				}
				if(line_type=='3'){//要素自增序列
					line_format = $("#line_format").val();//位长
					line_format_name =  $("#line_format").val();
					init_value = $("#init_value").val();
					//var eles=viewModel.ruleItem_dataTable.getSimpleData();
					eles = viewModel.ruleItem_dataTable.getSimpleData({
						'fields' : [ 'ele_code', 'level_num' ]
					});
					if (eles !== null) {
						eles_name = JSON.stringify(eles);
					}
				}				
				var billnorulelines = {
					'line_type' : line_type,
					'line_type_name' : line_type_name,
					'ele_code' : ele_code,
					'ele_code_name' : ele_code_name,
					'line_format' : line_format,
					'line_format_name' : line_format_name,
					'level_num' : level_num,
					'level_num_name' : level_num_name,
					'init_value' : init_value,
					'eles' : eles,
				};
				if (checkRule(line_type, line_format, ele_code, level_num,
						init_value)
						&& checkEleNull() && checkEleOnly()) {//校验
					if (title == 'addRule') {//增加单号规则
						viewModel.editDataTable.addSimpleData(billnorulelines);
						setLineno();//设置序号
					} else {//修改单号规则
						var row = viewModel.editDataTable.getFocusRow();//获取要修改的行数据
						row.setSimpleData(billnorulelines);
					}
					$("#ruleItem_add").attr('data-dismiss', 'modal');
				}
			};
			//重置序号
			var setLineno=function(name){
				var rows ;
				if(name=='eles'){
					rows=viewModel.ruleItem_dataTable.getAllRows();
				}else{
					rows=viewModel.editDataTable.getAllRows();
				}
				for ( var i = 0; i < rows.length; i++) {// 设置序号
					rows[i].setValue('line_no', i + 1);
				}
			}

			//显示单据数据
			function show(billId, billnoRuleData, callback) {
				onCloseCallback = callback || {};
				//todo 根据billId查询单据数据，显示在页面上。
				if (billId != null) {//没有选中树节点
					viewModel.editDataTable.clear();
					viewModel.ruleItem_dataTable.clear();
					viewModel.editDataTable.setSimpleData(billnoRuleData.data,{unSelect:true});
					// lineIdsToBeDeleted=viewModel.editDataTable.getSimpleData({'field':['billnoruleline_id']});
					var ids = viewModel.editDataTable.getSimpleData({
						'fields' : [ 'billnoruleline_id' ]
					});
					for ( var i = 0; i < ids.length; i++) {
						lineIdsToBeDeleted.push(ids[i].billnoruleline_id);
					}
					treeData = billnoRuleData.treeData;
					var rows = viewModel.editDataTable.getAllRows();
					for ( var i = 0; i < rows.length; i++) {//下拉列表名称和value值转换
						var line_type = rows[i].getValue('line_type');
						var ele_code = rows[i].getValue('ele_code');
						var line_format = rows[i].getValue('line_format');
						var level_num = rows[i].getValue('level_num');
						var elesTemp = rows[i].getValue('eles');
						if (elesTemp !== null) {
//							console.log(elesTemp);
//							console.log(JSONringify(elesTemp.getSimpleData()));
							rows[i].setValue('eles_name', JSON
									.stringify(elesTemp.getSimpleData()));
						}
						rows[i].setValue('line_type_name',
								getTypeNameByVal(line_type));
						rows[i].setValue('ele_code_name', ncrd
								.getEleNameByCode(ele_code));
						if (line_type == '3' || line_type == '1') {
							rows[i].setValue('line_format_name', line_format);//位长 日期格式
						} else {
							rows[i].setValue('line_format_name',
									getFormatNameByVal(line_format));//格式
						}
						rows[i].setValue('level_num_name',
								getLevelNameByVal(level_num));
						/* var eles=rows[i].getValue('eles');
						 console.log(eles);
						 viewModel.ruleItem_dataTable.setSimpleData(eles,{unSelect:true});*/
					}
					viewModel.billId(billId);
					viewModel.billCode(billnoRuleData.ruleNumber);
					viewModel.billName(billnoRuleData.ruleName);
					viewModel.selectedApp(billnoRuleData.sys_id);
					//$("#sys_app").val(billnoRuleData.sys_id);
					BillCodeBefore = billnoRuleData.ruleNumber;
				}
			}
			//通过常量的value值获取常量名称
			var getTypeNameByVal=function (type) {
				if (type == '0') {
					return "常量";
				}
				if (type == '1') {
					return "日期";
				}
				if (type == '2') {
					return "要素";
				}
				if (type == '3') {
					return "要素自增序列";
				}
				/*switch(line_type){
				 case 0: rows[i].setValue('line_type_name','常量');
				 break;
				 case 1: rows[i].setValue('line_type_name','日期');
				 break;
				 case 2: rows[i].setValue('line_type_name','要素');
				 break;
				 case 3: rows[i].setValue('line_type_name','要素自增序列');
				 break;
				 default:break;
				 }*/
			}
			//通过格式的value值获取格式名称
			var  getFormatNameByVal=function(format) {
				if (format == '0') {
					return "编码";
				}
				if (format == '1') {
					return "名称";
				}
				if (format == '2') {
					return "简称";
				}
			}
			//通过级次的value值获取级次名称
			var getLevelNameByVal=function (level) {
				if (level == '-1') {
					return "底级";
				}
				if (level == '1') {
					return "一级";
				}
				if (level == '2') {
					return "二级";
				}
				if (level == '3') {
					return "三级";
				}
				if (level == '4') {
					return "四级";
				}
				if (level == '5') {
					return "五级";
				}
				if (level == '6') {
					return "六级";
				}
				if (level == '7') {
					return "七级";
				}
				if (level == '8') {
					return "八级";
				}
				if (level == '9') {
					return "九级";
				}
			}
			//校验编码的唯一性
			var checkBillCode= function(billCodeBefore, billCode, arr) {
				var flag = true;
				for ( var i = 0; i < arr.length; i++) {
					if (billCode == arr[i] && billCode != billCodeBefore) {
						flag = false;
						// alert("该编码已经存在！");
						ip.ipInfoJump("该编码已经存在！","error");
						break;
					}
				}
				return flag;
			}
			//验证编码的非法字符   规则编码只能是字母、数字、中横杠_、下横杠-
			var billCodeStr='0123456789-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			var checkValid=function(billCode){
				var flag=true;
				for(var i=0;i<billCode.length;i++){
					var str=billCode.charAt(i);
					if(billCodeStr.indexOf(str)==-1){//该字符不在billCodeStr中 属于非法字符
						flag=false;
						break;
					}
				}
				return flag;
			}

			//校验单号编码 编码名称
			var checkBill1=function(billCode, billName) {
				var flag = true;
				if (billCode.length % 3 !== 0) {
					// alert("单号规则编码不规范，请按照三位一节输入单号规则编号！");
					ip.ipInfoJump("单号规则编码不规范，请按照三位一节输入单号规则编码！","error");
					flag = false;						 
				} else {
					if(!checkValid(billCode)){
						// alert("规则编码只允许字母、数字、中横杠_以及下横杠-！");
						ip.ipInfoJump("规则编码只允许字母、数字、中横杠_以及下横杠-！","error");
					}else{
						if (isNull(billName.length)) {
							// alert("单号规则名称不能为空！");
							ip.ipInfoJump("单号规则名称不能为空！","error");
							flag = false;
						}	
					}													
				}			
				return flag;
			}
			//校验至少有一条自增要素序列
			var checkBill2=function() {
				var rows = viewModel.editDataTable.getAllRows();
				var flag = false;
				for ( var i = 0; i < rows.length; i++) {
					if (rows[i].getValue('line_type') == '3') {
						flag = true;
						break;
					}
				}
				if (!flag) {
					// alert("至少有一条自增要素序列");
					ip.ipInfoJump("至少有一条自增要素序列！","info");
				}
				return flag;
			}
			//校验规则名称不含空格
			var checkBlank=function(billName) {
				var flag = true;
				var afterBillName = billName.split(" ").join("");
				if (billName.length != afterBillName.length) {
					// alert("规则名称不能有空格！");
					ip.ipInfoJump("规则名称不能含空格！","error");
					flag = false;
				}
				return flag;
			}
			//判断常量是否为整数
			var isInteger=function(obj) {
				return (!isNaN(obj)) && obj % 1 === 0;
			}
			//判断是否为空串 未定义 null
			var isNull=function (obj) {
				return obj == '' || obj == null || obj == undefined;
			}
			//规则项页面校验
			var checkRule=function(type, format, eleCode, levelNum, initValue) {
				var flag = true;
				if (type == '0') {//常量
					if (isNull(initValue)) {
						// alert("初始值不能为空！");
						ip.ipInfoJump("初始值不能为空！","error");
						flag = false;
					}
				} else if (type == '1') {//日期
					if (isNull(format)) {
						// alert("请选择日期格式！");
						ip.ipInfoJump("请选择日期格式！","error");
						flag = false;
					}
				} else if (type == '2') {//要素
					if (isNull(eleCode)) {
						// alert("请选择要素！");
						ip.ipInfoJump("请选择要素！","error");
						flag = false;
					} else {
						if (isNull(format)) {
							// alert("请选择要素格式！");
							ip.ipInfoJump("请选择要素格式！","error");
							flag = false;
						}
						//                            else{
						//                                if(isNull(levelNum)){
						//                                    alert("请选择要素级次！");
						//                                   ip.ipInfoJump("请选择要素级次！","error");
						//                                    flag = false;
						//                                }
						//                            }
					}
				} else if (type == '3') {//自增要素序列
					if (isNull(format)) {
						// alert("位长不能为空！");
						ip.ipInfoJump("位长不能为空！","error");
						flag = false;
					} else {
						if (!isInteger(format)) {
							// alert("位长必须为整数！");
							ip.ipInfoJump("位长必须为整数！","error");
							flag = false;
						} else {
							if (format == '0') {
								// alert("位长不能为0！");
								ip.ipInfoJump("位长不能为0！","error");
								flag = false;
							} else {
								if (isNull(initValue)) {
									// alert("初始值不能为空！");
									ip.ipInfoJump("初始值不能为空！","error");
									flag = false;
								} else {
									if (!isInteger(initValue)) {
										// alert("初始值必须为整数！");
										ip.ipInfoJump("初始值必须为整数！","error");
										flag = false;
									}
								}
							}
						}
					}
				}
				return flag;
			}
			// 校验要素自增序列的要素不为空
			var checkEleNull=function() {
				var flag = true;
				var rows = viewModel.ruleItem_dataTable.getAllRows();
				for ( var i = 0; i < rows.length; i++) {
					if (rows[i].getValue('ele_code') == null) {
						// alert("要素不为空!");
						ip.ipInfoJump("要素不能为空！","erro");
						flag = false;
						break;
					}
				}
				return flag;
			}
			//校验要素自增序列的每条要素不能相同
			var checkEleOnly=function () {
				var flag = true;
				var eleTempArr = viewModel.ruleItem_dataTable.getSimpleData({
					'fields' : [ 'ele_code' ]
				});
			    var eleCodeArr=[];
			    for(var i = 0; i < eleTempArr.length; i++){
			    	eleCodeArr.push(eleTempArr[i].ele_code);
			    }
				if (eleCodeArr != null) {
					for ( var i = 0; i < eleCodeArr.length; i++) {
						var x = eleCodeArr[i];
						for ( var j = i + 1; j < eleCodeArr.length; j++) {
							var y = eleCodeArr[j];
							if (x == y) {
								// alert("已存在相同的要素！");
								ip.ipInfoJump("已存在相同的要素！","erro");
								flag = false;
								break;
							}
						}
					}
				}
				return flag;
			}

			// 保存按钮单击事件
			viewModel.btnSaveClick = function() {
				if (onCloseCallback.save) {
					var billnorule_id = $("#billnorule_id").val();
					var billnorule_code = $("#billnorule_code").val();
					var billnorule_name = $("#billnorule_name").val();
					var sys_id = $("#sys_app").val();
					var rows = viewModel.editDataTable.getAllRows();
					for ( var i = 0; i < rows.length; i++) {//设置序号
						rows[i].setValue('line_no', i + 1);
					}
					var billnorulelines = viewModel.editDataTable
							.getSimpleData({
								'fields' : [ 'billnoruleline_id', 'line_no',
										'line_type', 'line_format', 'ele_code',
										'level_num', 'init_value', 'eles' ]
							});
					if(billnorulelines.length>0){
						for(var i=0;i<billnorulelines.length;i++){
							if(billnorulelines[i].line_format==null){
								billnorulelines[i].line_format="";
							}							
							if(billnorulelines[i].ele_code==null){
								billnorulelines[i].ele_code="";
							}
							if(billnorulelines[i].line_format==null){
								billnorulelines[i].line_format="";
							}
							if(billnorulelines[i].level_num==null){
								billnorulelines[i].level_num="";
							}
							if(billnorulelines[i].init_value==null){
								billnorulelines[i].init_value="";
							}
							if(billnorulelines[i].eles==null|| billnorulelines[i].eles.length == 0){
								billnorulelines[i].eles=[];
							}else{																
								var elesTempArr=billnorulelines[i].eles;//获取的是一个数组
							    //放置传到后台的临时eles数组
							    var elesArr=[];
							    for(var j=0; j<elesTempArr.length; j++){
							    	var tempEles =  {
									    	ele_code: {},
									    	level_num: {}
									    };
							    	tempEles.ele_code=elesTempArr[j].ele_code;
							    	tempEles.level_num=elesTempArr[j].level_num;
							    	elesArr.push(tempEles);
							    }
							    billnorulelines[i].eles=elesArr;							        					    		
					        }			
						}
					}
														
//					console.log(lineIdsToBeDeleted);
					var data = {
						'billnorule_id' : billnorule_id,
						'billnorule_code' : billnorule_code,
						'billnorule_name' : billnorule_name,
						'sys_id' : sys_id,
						'lineIdsToBeDeleted' : lineIdsToBeDeleted,
						'billnorulelines' : billnorulelines,
					};
//					console.log(JSON.stringify(data));
					if (checkBill1(billnorule_code, billnorule_name)
							&& checkBlank(billnorule_name)
							&& checkBillCode(BillCodeBefore, billnorule_code,
									treeData) && checkBill2()) {//表单校验
						$.ajax({
							type : 'POST',
							url : RULEITEM_SAVE_URL + '?tokenid=' + tokenid + '&ajax=' + 'noCache',
							data : JSON.stringify(data),
							contentType : 'application/json',
							dataType : 'json',
							cache: false,
							success : function(map) {
								if (map.errorCode == 0) {
									// alert("修改成功");
									ip.ipInfoJump("保存成功！","success");
									onCloseCallback.save(data);
								} else {
									// alert("修改失败");
									ip.ipInfoJump("保存失败！","error");
								}
							}
						});
					}
				}
			};

			//关闭按钮单击事件
			viewModel.btnCloseClick = function() {
				if (onCloseCallback.cancel) {
					onCloseCallback.cancel();
				}
			};
			//获取 应用模块 下拉列表
			var getModuels=function() {
				$.ajax({
					type : 'GET',
					url : LIST_APP_DO_URL + '?tokenid=' + tokenid,
					dataType : 'json',
					data: { "ajax": "noCache" },
					async: false,
					cache: false,
					success : function(result) {
						var data = result.data;
//						console.log(data);
						if (data != null) {
							for ( var i = 0; i < data.length; i++) {
								$("#sys_app").append(
										"<option value=" + data[i].sys_id + ">"
												+ data[i].sys_id + " "
												+ data[i].sys_name
												+ "</option>");
							}
							//viewModel.sysApps(data);
						}
					},
					error : ncrd.commonAjaxError,
				});
			}
			//获取要素集合
			var getElesData= function () {
				$.ajax({
					type : 'GET',
					url : ELEMENTS_DO_URL + '?tokenid=' + tokenid,
					dataType : 'json',
					data: { "ajax": "noCache" },
					cache: false,
					success : function(result) {
						var data = result.data;
						if (data != null) {
							//viewModel.comEles.clear();
							viewModel.comElesArr.splice(0,viewModel.comElesArr.length);//清空数组
							for ( var i = 0; i < data.length; i++) {
//								viewModel.comEles.addSimpleData([ {
//									'name' : data[i].ele_name,
//									'value' : data[i].ele_code
//								} ]);
								viewModel.comElesArr.push({
									'name' : data[i].ele_name,
									'value' : data[i].ele_code
								});										  
							}
							viewModel.comElesArr=viewModel.comElesArr();
							//viewModel.comElesArr(viewModel.comEles.getSimpleData());
						}
					}
				});
			}

			function init(container) {
				u.createApp({
					el : container,
					model : viewModel
				});
				getModuels();	
				getElesData();
				$('#setRuleWindow').modal({backdrop: 'static'});
			}			
			return {
				'model' : viewModel,
				'template' : template,
				'init' : init,
				'show' : show
			};
		});
