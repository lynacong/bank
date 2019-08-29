require(
		[ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director',
				'md5', 'ip' ,'dateZH'],
		function($, ko) {
			var colValue;
			var advanceObj;
			var rowAdvanceObj;
			var advanceArr = [];
			var rowAdvanceArr = [];
			window.ko = ko;
			var uiConfigureViewModel = {

				data : ko.observable({}),
				// 视图树meta定义
				treeDataTable : new u.DataTable({
					meta : {
						'ui_id' : {
							'value' : ""
						},
						'parentid' : {
							'value' : ""
						},
						'uiname' : {
							'value' : ""
						}
					}
				}),
				
				viewDetailTree :new u.DataTable({
					meta:{
						'ui_detail_id':{},
						'parent_id':{},
						'detailname':{},
						'ui_id':{},
						'field_name':{},
						'disp_mode':{},
						'field_index':{},
						'id':{},
						'title':{},
						'cols':{},
						'visible':{},  // 是否可见
						'editable':{},
						'is_enabled':{}, // 是否启用
						'enabled':{}, // 是否可用
						'query_relation_sign':{},
						'value':{},
						'ref_model':{},
						'source':{},
						'width':{},
						'is_virtual_column':{},
						'virtual_column_sql':{},
						'sum_flag':{},
						'source_name':{},
						'header_level':{},
					}
				}),
				
				eleInfoTree :new u.DataTable({
					meta:{
						'chr_id':{},
						'parentid':{},
						'elename':{},
					}
				}),
				
				// 菜单表格的meta定义
				menuGridDataTable : new u.DataTable({
					meta:{
						'code' :{
							'code' : ""
						},
						'name': {
							'name':""
						}
					}
				}),
				
				// 菜单表格的meta定义
				uiConfigureAdvanceGrid : new u.DataTable({
					meta:{
						'uiconf_field' :{
							'uiconf_field' : ""
						},
						'uiconf_field_name': {
							'uiconf_field_name':""
						},
						'uiconf_field_type': {
							'uiconf_field_type':""
						},
						'uiconf_value': {
							'uiconf_value':""
						},
						'uiconf_id': {
							'uiconf_id':""
						}
					}
				}),
				
				valueInfoTree: new u.DataTable({
					meta: {
						'chr_id': {},
						'parent_id': {},
						'codename': {}
					}
				}),
				
				// 显示方式初始化 
				dispModeComItems: [{
				        "value": "text",
				        "name": "文本框"
				    }, {
				        "value": "textarea",
				        "name": "多行文本框"
				    }, {
				        "value": "checkbox",
				        "name": "选择框"
				    }, {
				        "value": "int",
				        "name": "整数框"
				    }, {
				        "value": "decimal",
				        "name": "小数框"
				    }, {
				        "value": "radio",
				        "name": "单选框"
				    }, {
				        "value": "combobox",
				        "name": "下拉框"
				    },{
				    	"value": "datetime",
				        "name": "日期控件"
				    },{
				    	"value": "treeassist",
				    	"name": "树型辅助录入"
				    },{
				    	"value": "multreeassist",
				    	"name": "多选树型辅助录入"
				    },{
				    	"value": "doubletime",
				    	"name": "时间段"
				    },{
				    	"value": "doubledecimal",
				    	"name": "金额段"
				    },{
				    	"value": "column",
				    	"name": "列表的列"
				    }],
				    
				    colsComItems: [{
				        "value": "1",
				        "name": "1"
				    }, {
				        "value": "2",
				        "name": "2"
				    }, {
				        "value": "3",
				        "name": "3"
				    }, {
				        "value": "4",
				        "name": "4"
				    }, {
				        "value": "5",
				        "name": "5"
				    }, {
				        "value": "6",
				        "name": "6"
				    }, {
				        "value": "7",
				        "name": "7"
				    }, {
				        "value": "8",
				        "name": "8"
				    }, {
				        "value": "9",
				        "name": "9"
				    }, {
				        "value": "10",
				        "name": "10"
				    }],
					    
					qrsComItems: [{
				        "value": "0",
				        "name": "等于(选择值)"
				    }, {
				        "value": "1",
				        "name": "不等于(选择值)"
				    }, {
				        "value": "2",
				        "name": "大于(选择值)"
				    }, {
				        "value": "3",
				        "name": "大于等于(选择值)"
				    }, {
				        "value": "4",
				        "name": "小于(选择值)"
				    }, {
				        "value": "5",
				        "name": "小于等于(选择值)"
				    }, {
				        "value": "6",
				        "name": "like(选择值)"
				    }, {
				        "value": "7",
				        "name": "nolike(选择值)"
				    }, {
				        "value": "8",
				        "name": "between(两个选择值之间)"
				    }, {
				        "value": "9",
				        "name": "betweenequal(包含两个选择值)"
				    },  {
				        "value": "10",
				        "name": "is null(空值)"
				    },{
				    	 "value": "11",
					     "name": "is not null(不为空)"
				    },{
				    	 "value": "12",
					     "name": "in(包含于)"
				    },{
				    	 "value": "13",
					     "name": "not in(不包含于)"
				    }],
				    // 高级属性的属性值 
				    uiconfValueItems: [{
				        "value": "VARCHAR2",
				        "name": "字符型"
				    }, {
				        "value": "NUMBER",
				        "name": "数字型"
				    }, {
				        "value": "003",
				        "name": "003 查询视图"
				    }, {
				        "value": "BOOLEAN",
				        "name": "逻辑型"
				    }],
				
				// 视图树及设置
				treeSetting : {
					view : {
						showLine : true,
						selectedMulti : false
					},
					callback : {
						onClick : function(e, id, node) {
							var idValue = node.id;
							var oThis = app.getComp(id);
							var rowId = oThis.getRowIdByIdValue(idValue);
							var index = oThis.dataTable.getIndexByRowId(rowId);
							var nodeData = uiConfigureViewModel.treeDataTable.rows._latestValue[index].data;							
							if(idValue == "0" ||node.pId=="0" ){
								uiConfigureViewModel.viewContentClear();
								return ;
							}
							// 视图基本信息
							$("#main-info input[type='text']").each(function() {
								var id = $(this).attr("id");
								if (nodeData.hasOwnProperty(id)) {
									var value = nodeData[id].value;
									$(this).val(value);
								}
							});

							$("#main-info select ").each(function() {
								var id = $(this).attr("id");
								if (nodeData.hasOwnProperty(id)) {
									var value = nodeData[id].value;
									$(this).val(value);
								}
							});
							
							$("#info-content").empty();
							var uiType=nodeData["ui_type"].value;
							uiConfigureViewModel.initGridUi(idValue,uiType);
						}
					}
				},
				
				
				// 视图详细信息树及设置
				detailTreeSetting : {
					view : {
						showLine: true
						},
					edit: {
							enable: true,
							showRenameBtn: false,
							showRemoveBtn: false,
							drag: {
								isCopy: false,
								isMove: true
							}
						},
					callback : {
						onClick : function(e, id, node) {
							var idValue = node.id;
							// 获取该节点的详细信息 viewDetailTree
							var oThis = app.getComp(id);
							var rowId = oThis.getRowIdByIdValue(idValue);
							var index = oThis.dataTable.getIndexByRowId(rowId);
							var nodeData = uiConfigureViewModel.viewDetailTree.rows._latestValue[index].data;
							// 视图基本信息
							$("#view-detail input[type='text']").each(function() {
								var id = $(this).attr("id");								
								if(id=="value_detail-h" || id=="value_detail"){
									var defValue = nodeData["value"].value;
									var values;
									if(defValue){
										values = defValue.split("@");
									}
									var ValuecodeName;
									if(values){
										if (values.length==3) {
											if(node.source == "FILE"){ //指标文号code与name一样，所以只显示一个。
												ValuecodeName = decodeURI(values[1]);
											}else{
												ValuecodeName = values[2] + " " + decodeURI(values[1]);
											}
										}else{
											ValuecodeName = defValue;
										}
									}
									
									$("#value_detail-h").val(defValue);
									$("#value_detail").val(ValuecodeName);
								}
								else{
									id=id.substring(0,id.length-7);
									if (nodeData.hasOwnProperty(id)) {
										var value = nodeData[id].value;
										$(this).val(value);
									}
								}
								
							});

							$("#view-detail select ").each(function() {
								var id = $(this).attr("id");
								id=id.substring(0,id.length-7);
								if (nodeData.hasOwnProperty(id)) {
									var value = nodeData[id].value;
									$(this).val(value);
								}
							});
							
							$("#view-detail input[type='checkbox']  ").each(function() {
								var id = $(this).attr("id");
								id=id.substring(0,id.length-7);
								if (nodeData.hasOwnProperty(id)) {
									var value = nodeData[id].value;
									if(value=="true" || value=="1"){
										$(this).prop("checked",true);
									}else{
										$(this).prop("checked",false);
									}
								}
							});
							
							$("#virtual_column_sql_detail").val(nodeData["virtual_column_sql"].value);
						}
					}
				},
			};
			
			
			eleInfoTreeSetting : {
				view : {
					showLine: true;
					}
			}
			
		
			uiConfigureViewModel.viewContentClear = function(){
				// 视图基本信息
				$("#main-info input[type='text']").each(function() {
					$(this).val("");
				});

				$("#main-info select ").each(function() {					
					$(this).val("");
				});
				
				$("#info-content").empty();
			};
			
			
			// 初始视图树数据
			uiConfigureViewModel.getInitData = function() {
				var tokenid = ip.getTokenId();
				$.ajax({
					url : "/df/viewConfig/getUiManagerTree.do?tokenid=" + tokenid,
					type : 'GET',
					dataType : 'json',
					data: {"tokenId":tokenid,"ajax":"nocache"},
					success : function(data) {
						uiConfigureViewModel.treeDataTable.setSimpleData(data.viewlist,{unSelect:true});
						if(node != undefined){
							var ztree = $("#uiConfigureTree")[0]['u-meta'].tree;
							var current_node = ztree.getNodesByParamFuzzy("name",node[0].name, null);
							ztree.expandNode(current_node[0], true, true, true);
							ztree.selectNode(current_node[0]);
							$(".curSelectedNode").click();
						}else{
							var zTree = $("#uiConfigureTree")[0]['u-meta'].tree;
						 	var nodes = zTree.getNodes();
						 	for(var i=0;i<nodes.length;i++){
						 		if(nodes[i].id=="0"){
						 			zTree.expandNode(nodes[i]);
						 		}
						 	}
						} 	
					}
				});
			};
			
			// 快速查詢文本框
			var val = "";
			quickQuery = function (){  
				
				var user_write = $("#quickquery").val();
				if(user_write == val){
					return;
				}
				val = user_write;
				var data_tree = $("#uiConfigureTree")[0]['u-meta'].tree;
				var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
				data_tree.expandNode(search_nodes[0],true,false,true);
				data_tree.selectNode(search_nodes[0]);
				$("#quickquery").focus();

			};
			// 查詢下一個
			var i = 0;
			menuTreeNext = function (){
				var user_write = $("#quickquery").val();
				var data_tree = $("#uiConfigureTree")[0]['u-meta'].tree;
				var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
				if(i < search_nodes.length){
					data_tree.selectNode(search_nodes[i++]);
				}else{
					i = 0;
					ip.ipInfoJump("最后一个");
				}
				$("#quickquery").focus();
			};
			
			// 初始化下拉框
			uiConfigureViewModel.getInitViewCombox = function() {
				var tokenid = ip.getTokenId();
				$.ajax({
					url : "/df/viewConfig/initCombox?tokenid=" + tokenid,
					type : 'GET',
					dataType : 'json',
					data: {"tokenId":tokenid,"ajax":"nocache"},
					success : function(data) {
						var uiTypeComboxOption = uiConfigureViewModel
								.loadCombox(data.ui_type, "ui_type");
						$("#ui_type").append(uiTypeComboxOption);
						$("#ui_type_base").append(uiTypeComboxOption);

						var sysIdComboxOption = uiConfigureViewModel
								.loadCombox(data.sys_id, "sys_id");
						$("#sys_id").append(sysIdComboxOption);
						$("#sys_id_base").append(sysIdComboxOption);
					}
				});
			};
			
			// 下拉框赋值
			uiConfigureViewModel.loadCombox = function(obj, id) {
				var jsonStr;
				// jsonStr = '<option title="-1" selected="selected" value=""> </option>';
				if (id == "ui_type") {
					$.each(obj, function(i, value) {
						jsonStr += '<option value="' + this.chr_code + '" >'
								+ this.chr_name + '</option>';
					});
				} else if (id == "sys_id") {
					$.each(obj, function(i, value) {
						jsonStr += '<option value="' + this.sys_id + '" >'
								+ this.sys_id + " " + this.sys_name
								+ '</option>';
					});
				}else{
					$.each(obj, function(i, value) {
						jsonStr += '<option value="' + this.value + '" >'
								+ this.name
								+ '</option>';
					});
				}

				return jsonStr;
			};
			
			uiConfigureViewModel.addButton = function(){
				$("#opt_type").val("new");
				var optType = "new";
				uiConfigureViewModel.editModle(optType);
			};
			uiConfigureViewModel.modifyButton = function(){
				var nodes = $.fn.zTree.getZTreeObj("uiConfigureTree").getSelectedNodes();
				if(nodes.length!=1){
					ip.ipInfoJump("请选择一个视图进行修改!","info");
					return;
				}
				if(!uiCheck()){
					return;
				}
				
				$("#opt_type").val("modify");
				var optType = "modify";
				uiConfigureViewModel.editModle(optType);
			};
			
			uiCheck = function(){
				var nodes = $.fn.zTree.getZTreeObj("uiConfigureTree").getSelectedNodes();
				var treeNode = nodes[0];
				if(treeNode.id == "0" ||treeNode.pId=="0" ){
					ip.ipInfoJump("您选择的不是视图，请选择视图!","info");
					return false;
				}
				return true;
			}
			

			// 主界面删除按钮
			uiConfigureViewModel.delButton = function(){
				var nodes = $.fn.zTree.getZTreeObj("uiConfigureTree").getSelectedNodes();
				if(nodes.length!=1){
					ip.ipInfoJump("请选择一个视图!","info");
					return;
				}
				if(!uiCheck()){
					return;
				}
				// var treeNode = nodes[0].getPreNode();
				if(nodes.length>0){
					var treeNode = nodes[0];
					var preNode = nodes[0].getPreNode();
					var nextNode = nodes[0].getNextNode();
					ip.warnJumpMsg("确定删除吗？","del","cCla");
			    	$("#del").on("click",function(){ 
			    		var id =treeNode.id;
				    	var tokenid = ip.getTokenId();
				    	$.ajax({
							url : "/df/viewConfig/delView.do?tokenid=" + tokenid,
							type : 'GET',
							dataType : 'json',
							data :{"viewId":id,"tokenId":tokenid,"ajax":"nocache"},
							success : function(data) {
								if(data.flg == "sucess"){
									uiConfigureViewModel.getInitData();
									ip.ipInfoJump("刪除成功！","success");
								}else{
									ip.ipInfoJump("服务器繁忙，请稍后！","error");
								}
							}
						});
			    		$("#config-modal").remove(); 
			    		uiConfigureViewModel.viewContentClear();
			    	});
			    	$(".cCla").on("click",function(){ 
			    		$("#config-modal").remove(); 
			    	});
				}			
			};
			
			// 新增按钮 
			uiConfigureViewModel.editModle = function(optType){
				// 清空高级属性配置 
				advanceArr =[];
				$("#addModal").modal({
					backdrop: 'static', 
					keyboard: false});
				
				$("#fist-pane").addClass("active");
				$("#sec-pane").removeClass("active");
				$("#baseinfo").addClass("active");
				$("#profiles").removeClass("active");
				
				$("#base-info input[type='text']").each(function() {		
					$(this).val("");
				});
				$("#ui_type_base").val("-1");
				$("#sys_id_base").val("-1");
				
				$("#view-detail input[type='text']").each(function() {				
					$(this).val("");
				});
				$("#view-detail input[type='checkbox']").each(function() {				
					$(this).attr("checked",false);
				});
				
				// 清空
				$("#virtual_column_sql_detail").val("");
				
				var dispModeOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.dispModeComItems,"");
				$("#disp_mode_detail").empty(); 
				$("#disp_mode_detail").append(dispModeOption);
				
				var colsOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.colsComItems,"");
				$("#cols_detail").empty();
				$("#cols_detail").append(colsOption);
				
				var qrsOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.qrsComItems,"");
				$("#query_relation_sign_detail").empty();
				$("#query_relation_sign_detail").append(qrsOption);
				
				var nodes = $.fn.zTree.getZTreeObj("uiConfigureTree").getSelectedNodes();
				if(nodes.length == 1){
					var id =nodes[0].id;
					var tokenid = ip.getTokenId();
					$.ajax({
						url : "/df/viewConfig/getAllInfoForView.do?tokenid=" + tokenid,
						type : 'GET',
						dataType : 'json',
						data :{"viewId":id,"tokenId":tokenid,"ajax":"nocache"},
						success : function(data) {
							if(optType=="new"){
								uiConfigureViewModel.viewDetailTree.setSimpleData(data.viewDetail);
								uiConfigureViewModel.menuGridDataTable.setSimpleData("");
							}else{
								advanceArr = data.advance;
								uiConfigureViewModel.viewDetailTree.setSimpleData(data.viewDetail);
								uiConfigureViewModel.menuGridDataTable.setSimpleData(data.menulist);
								if(data.viewDetail!=null  && data.viewDetail.length>0){
									var treeId = data.viewDetail[0].ui_detail_id
									zTree_Menu = $.fn.zTree.getZTreeObj("viewDetailTree");  
					                var node = zTree_Menu.getNodeByParam("id",treeId );  
					                zTree_Menu.selectNode(node,true);
					                uiConfigureViewModel.detailTreeSetting.callback.onClick(null,"viewDetailTree",node);
								}
							}
						}
					});
					var oThis = app.getComp("uiConfigureTree");
					var rowId = oThis.getRowIdByIdValue(nodes[0].id);
					var index = oThis.dataTable.getIndexByRowId(rowId);
					var nodeData = uiConfigureViewModel.treeDataTable.rows._latestValue[index].data;
					
					$("#base-info input[type='text']").each(function() {
						var id = $(this).attr("id");
						id=id.substring(0,id.length-5);
						if (nodeData.hasOwnProperty(id)) {
							var value = nodeData[id].value;
							$(this).val(value);
						}
					});
					$("#base-info select ").each(function() {
						var id = $(this).attr("id");
						id=id.substring(0,id.length-5);
						if (nodeData.hasOwnProperty(id)) {
							var value = nodeData[id].value;
							$(this).val(value);
						}
					});
				}else{
					$("#base-info input[type='text']").each(function() {
					});
				}
			};		
			
			uiConfigureViewModel.initBaseCombox = function(){				
				$.ajax({
					url : "/df/viewConfig/initCombox?tokenid=" + tokenid,
					type : 'GET',
					dataType : 'json',
					data: {"tokenId":tokenid,"ajax":"nocache"},
					success : function(data) {
						var uiTypeComboxOption = uiConfigureViewModel
								.loadCombox(data.ui_type, "ui_type");
						$("#ui_type").append(uiTypeComboxOption);
						$("#ui_type_base").append(uiTypeComboxOption);

						var sysIdComboxOption = uiConfigureViewModel
								.loadCombox(data.sys_id, "sys_id");
						$("#sys_id").append(sysIdComboxOption);
						$("#sys_id_base").append(sysIdComboxOption);
					}
				});
			},	
			
			// 视图高级属性按钮 
			uiConfigureViewModel.uiConfigureViewAdvanceEdit = function(){		
				var ui_type_base = $("#ui_type_base").val();
				if(ui_type_base==""){
					ip.ipInfoJump("请选择视图类型！","info");
					return;
				}
				var  ui_id =  $("#ui_id_base").val();
				var uiconf_type = ui_type_base;
				// 为详细信息添加高级属性 row代表详细信息 
				var uiconf_flg = "ui";
				// 详细每行的唯一标示，用于区分不同的详细信息
				var uiconf_row_field = $("#ui_code_base").val();
				uiConfigureViewModel.uiConfigureAdvanceEdit(uiconf_type,ui_id,uiconf_flg,uiconf_row_field);
			},
			
			
			
			// 列高级属性按钮 
			uiConfigureViewModel.uiConfigureRowAdvanceEdit = function(){		
				var ui_detail_id = $("#ui_detail_id_detail").val();
				if(ui_detail_id==""){
					ip.ipInfoJump("请选择列设置的高级属性！","info");
					return;
				}
				var uiconf_type = $("#disp_mode_detail").val();
				// 为详细信息添加高级属性 row代表详细信息 
				var uiconf_flg = "uidetail";
				// 详细每行的唯一标示，用于区分不同的详细信息
				var uiconf_row_field = $("#id_detail").val();
				uiConfigureViewModel.uiConfigureAdvanceEdit(uiconf_type,ui_detail_id,uiconf_flg,uiconf_row_field);
			},
			
			uiConfigureViewModel.uiConfigureAdvanceEdit = function(uiconf_type,uiconf_id,uiconf_flg,uiconf_row_field){
				var tokenid = ip.getTokenId();
				$("#uiConfigureAdvance").show();
				$("#uiconf_id").val(uiconf_id);
				$("#uiconf_flg").val(uiconf_flg);
				$("#uiconf_row_field").val(uiconf_row_field);
				// 
				
				$.ajax({
					url : "/df/viewConfig/getUIConf?tokenid=" + tokenid,
					type : 'GET',
					dataType : 'json',
					data: {"tokenId":tokenid,"ajax":"nocache","uiconf_type":uiconf_type},
					success : function(data) {
						uiConfigureViewModel.uiConfigureAdvanceGrid.setSimpleData(data.uiconf,{unSelect:true})
						for(var i = 0; i < advanceArr.length; i++) {
							if(uiconf_id == advanceArr[i].uiconf_id){
								var uiconf_field = advanceArr[i].uiconf_field;
								var advanRow = uiConfigureViewModel.uiConfigureAdvanceGrid.getRowByField('uiconf_field',uiconf_field)
								advanRow.setValue('uiconf_value',advanceArr[i].uiconf_value);
							}
									
						}
					
					}
				});
			}
			
			// 关闭高级属性界面
			uiConfigureViewModel.cencelUiConfigureAdvance = function(){
				$("#uiConfigureAdvance").hide();
				$("#uiconf_id").val("");
				$("#uiconf_flg").val("");
				$("#uiconf_row_field").val("");
			}
			// 修改选中的高级属性 
			uiConfigureViewModel.advanceEditButton = function(){
				var gridObj = $("#uiConfigureAdvance-grid").parent()[0]['u-meta'].grid;
				var selectedRow= gridObj.getSelectRows();
				if(selectedRow.length != 1){
					ip.ipInfoJump("请选择一条数据进行修改！","info");
					return;
				}
				var selectdata = selectedRow[0];
				var innerHTML = "<div id='advanceEditButton-modal' class='bs-modal-sm'><div class='modal-dialog modal-sm' style='width: 400px;'>";
				innerHTML += "<div class='modal-content advance-edit-row-view'><div class='modal-header'>";
				innerHTML += "<button type='button' class='close closeBtn' onclick='cencelUiConfigureAdvanceEidt()'><span>&times;</span></button>";
				innerHTML += "<h4 class='modal-title'>高级属性设置</h4></div><div class='modal-body'>" ;
				innerHTML +="<label for='uiconf_field_e' class='col-md-4 text-right detail-text-right'>属性名：</label>";
				innerHTML +=" <div class='col-md-8 ip-input-group'>";
				innerHTML +=" <input type='text' class='form-control detail-text-left' id='uiconf_field_e' readonly='readonly'>";
				innerHTML +=" </div>";
				innerHTML +="<label for='uiconf_field_name_e' class='col-md-4 text-right detail-text-right'>属性中文名：</label>";
				innerHTML +=" <div class='col-md-8 ip-input-group'>";
				innerHTML +=" <input type='text' class='form-control detail-text-left' id='uiconf_field_name_e' readonly='readonly'>";
				innerHTML +=" </div>";
				innerHTML +="<label for='uiconf_field_type_e' class='col-md-4 text-right detail-text-right'>属性类型：</label>";
				innerHTML +=" <div class='col-md-8 ip-input-group'>";
				innerHTML +=" <input type='text' class='form-control detail-text-left' id='uiconf_field_type_e' readonly='readonly'>";
				innerHTML +=" </div>";
				innerHTML +="<label for='uiconf_value_e' class='col-md-4 text-right detail-text-right'>属性类型：</label>";
				innerHTML +=" <div class='col-md-8 ip-input-group'>";
				if(selectdata.uiconf_field_type=="BOOLEAN"){
					innerHTML +=" <select class='form-control detail-text-left' id='uiconf_value_e'>";
					innerHTML +=" <option value ='true'>是</option>";
					innerHTML +=" <option value ='false' selected='selected'>否</option>";
					innerHTML +=" </select>";
				}else{
					innerHTML +=" <input type='text' class='form-control detail-text-left' id='uiconf_value_e'>";
				}
				innerHTML +=" </div>";
				innerHTML +=" </div>";
				innerHTML +=" <div class='advance-edit-row-div'>";
					innerHTML += "<button id='buiConfigureAdvanceEditOK' onclick='uiConfigureAdvanceEditOK()' type='button' class='btn btn-primary advance-edit-row-button'>确定</button>";
					innerHTML += "<button id='bcenceluiConfigureAdvanceEdit' onclick='cencelUiConfigureAdvanceEidt()' type='button' class='btn btn-primary advance-edit-row-button'>取消</button>";
				innerHTML +=" </div>";
					
				innerHTML +=" </div></div></div>";
				$("#advanceEditView").append(innerHTML);
				$("#advanceEditButton").show();
				uiConfigureViewModel.uiConfigureAdvanceRowEdit(selectdata);
				
			}
			// 赋值 
			uiConfigureViewModel.uiConfigureAdvanceRowEdit = function(selectdata){
				$("#uiconf_field_e").val(selectdata.uiconf_field);
				$("#uiconf_field_name_e").val(selectdata.uiconf_field_name);
				$("#uiconf_field_type_e").val(selectdata.uiconf_field_type);
				$("#uiconf_value_e").val(selectdata.uiconf_value);
			}
			// 确定按钮将值赋给全局变量 
			uiConfigureAdvanceEditOK = function(){
				rowAdvanceObj = {};
				var uiconf_field_e = $("#uiconf_field_e").val();
				var uiconf_value_e = $("#uiconf_value_e").val();
				var uiconf_id = $("#uiconf_id").val();
				var uiconf_flg = $("#uiconf_flg").val();
				var uiconf_row_field = $("#uiconf_row_field").val();
				var advanRow = uiConfigureViewModel.uiConfigureAdvanceGrid.getRowByField('uiconf_field',uiconf_field_e)
				advanRow.setValue('uiconf_value',uiconf_value_e);
				rowAdvanceObj.uiconf_field = uiconf_field_e;
				rowAdvanceObj.uiconf_value = uiconf_value_e;
				rowAdvanceObj.uiconf_id = uiconf_id;
				rowAdvanceObj.uiconf_flg = uiconf_flg;
				rowAdvanceObj.uiconf_row_field = uiconf_row_field;
				// rowAdvanceArr.push(rowAdvanceObj);
				
				for(var i = 0; i < advanceArr.length; i++) {
					if((uiconf_id == advanceArr[i].uiconf_id)
						&& (uiconf_field_e == advanceArr[i].uiconf_field)){
							advanceArr.splice(i,1);
						}
					}
				if(uiconf_value_e!=""){
					advanceArr.push(rowAdvanceObj);
				}
				$("#advanceEditView").html("");
			}
			
			cencelUiConfigureAdvanceEidt = function(){
				$("#advanceEditView").html("");
			}
			// 详细界面信息列信息
			uiConfigureViewModel.addColumnButton = function(){
				$("#addCol").show();
				
				$("#col_body input[type='text']").each(function() {				
					$(this).val("");
				});
				$("#col_body input[type='checkbox']").each(function() {				
					$(this).attr("checked",false);
					var id = $(this).attr("id");
					if(typeof(id)!="undefined"){
						if(id=="col_visible" || id=="col_editable" || id=="col_is_enabled" || id=='col_enabled'){
							$(this).prop("checked",true);
						}
					}
					
				});
				
				if($("#ui_type_base").val()=="002"){
					$("#col_cols").readOnly="false";
					$("#col_query_relation_sign").readOnly="false";
				}
				
				$("#col_virtual_column_sql").val("");
				
				var dispModeOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.dispModeComItems,"");
				$("#col_disp_mode").empty(); 
				$("#col_disp_mode").append(dispModeOption);
				
				var colsOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.colsComItems,"");
				$("#col_cols").empty();
				$("#col_cols").append(colsOption);
				
				var qrsOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.qrsComItems,"");
				$("#col_query_relation_sign").empty();
				$("#col_query_relation_sign").append(qrsOption);
				
			},
			
			uiConfigureViewModel.delColumnButton = function(){
				
				var selectIndex = uiConfigureViewModel.viewDetailTree.getSelectedIndex();
				 uiConfigureViewModel.viewDetailTree.removeRow(selectIndex);
				 uiConfigureViewModel.cleardetailpanl();
				
			};
			
			
			uiConfigureViewModel.cleardetailpanl = function(){
				$("#view-detail input[type='text']").each(function() {				
					$(this).val("");
				});
				$("#view-detail input[type='checkbox']").each(function() {				
					$(this).attr("checked",false);
				});
				
				// 清空
				$("#virtual_column_sql_detail").val("");
				
				var dispModeOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.dispModeComItems,"");
				$("#disp_mode_detail").empty(); 
				$("#disp_mode_detail").append(dispModeOption);
				
				var colsOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.colsComItems,"");
				$("#cols_detail").empty();
				$("#cols_detail").append(colsOption);
				
				var qrsOption = uiConfigureViewModel.loadCombox(uiConfigureViewModel.qrsComItems,"");
				$("#query_relation_sign_detail").empty();
				$("#query_relation_sign_detail").append(qrsOption);
			}
			
			clickBaseInfo = function(){
				$("#previewButton").css('display','none'); 
			}
			
			clickProfile = function(){
				$("#previewButton").css('display','block'); 
			}
			
			uiConfigureViewModel.confirmColumnButton = function(){
				
				var col_id = $("#col_id").val();
				if(col_id==""){
					ip.warnJumpMsg("控件id不能为空！",0,0,true);
					return;
				}
				var col_title = $("#col_title").val();
				if(col_id==""){
					ip.warnJumpMsg("控件标题不能为空！",0,0,true);
					return;
				}
				
				var re = /^[1-9]+[0-9]*]*$/ ;
				var col_width = $("#col_width").val();
				if(col_width!=""){
					if (!re.test(col_width)){
						ip.warnJumpMsg("视图列宽必须为数字！",0,0,true);
						return;
					};
				}
				
				var col_id = $("#col_id").val();
				var rowCheck = uiConfigureViewModel.viewDetailTree.getRowByField("id",col_id);
				if (rowCheck !== null && rowCheck !== undefined && rowCheck !== '') {
					ip.warnJumpMsg("不能添加重复的控件id！",0,0,true);
					return;
				}
				
				var othisDatatable = app.getComp("viewDetailTree").dataTable;
				var row = othisDatatable.createEmptyRow();
				row.setValue("ui_detail_id",uuid());
				row.setValue("detailname", $("#col_id").val()+" "+$("#col_title").val());
				
				var element = $("#col_source").val();
				var elementCodeName = $("#col_source_name").val();
				var colDispMode = $("#col_disp_mode").val();
				
				if(!elementCodeName){
					$("#col_source").val("");
					if(colDispMode=="treeassist" || colDispMode=="multreeassist"){
						$("#col_value").val("");
						$("#col_value-h").val("");
					}
				}
				
				
				// 文本框赋值 
				$("#col_body input[type='text']").each(function() {	
					var id = $(this).attr("id");
					if(typeof(id)!="undefined"){
						if(id.indexOf("col_")==0){
							if(id!="col_value-h" && id!="col_value"){
								var dbid=id.substring(4,id.length);	
								row.setValue(dbid, $(this).val());
							}
						}
					}
					
				});
				
				var colSourceName = $("#col_source_name").val();
				if(colSourceName){
					row.setValue("value", $("#col_value-h").val());
				}else{
					row.setValue("value", $("#col_value").val());
				}
				
				// 下拉框赋值
				
				$("#col_body select ").each(function() {
					var id = $(this).attr("id");
					if(typeof(id)!="undefined"){
						var dbid=id.substring(4,id.length);
						row.setValue(dbid, $(this).val());
					}
				});
				
				$("#col_body input[type='checkbox']").each(function() {	
					var id = $(this).attr("id");
					if(typeof(id)!="undefined"){
						var dbid=id.substring(4,id.length);
						if($(this).is(':checked')== true){
							row.setValue(dbid,"true");
						}else{
							row.setValue(dbid,"false");
						}
					}
				});
				// textarea 赋值 
				var col_virtual_column_sql = $("#col_virtual_column_sql").val();
				row.setValue("virtual_column_sql",col_virtual_column_sql);
				
				$("#addCol").hide();
				
			};
			
			uiConfigureViewModel.cencelColumnButton = function(){
				$("#addCol").hide();
			};
			
			getValueInfo = function(info){
				colValue = info.value;
			}
			
			
			 changeDeatil = function(info){
				 
				var ui_detail_id = $("#ui_detail_id_detail").val();
				var rowDetail = uiConfigureViewModel.viewDetailTree.getRowByField("ui_detail_id",ui_detail_id);
				var val = info.value;
				var id = info.id;
				var type = info.type;
				
					
				if(type=="checkbox"){
					if(typeof(id)!="undefined"){
						dbid=id.substring(0,id.length-7);
						if(info.checked== true){
							rowDetail.setValue(dbid,"true");
						}else{
							rowDetail.setValue(dbid,"false");
						}
					}
				}else{
					if(typeof(id)!="undefined"){
						if(id=="value_detail"){
							var sourceNameDetail = $("#source_name_detail").val();
							if(sourceNameDetail){
								if(colValue!=val && colValue){
									$("#value_detail-h").val("");
									$("#value_detail").val("");
								}
							}
							
							var value = $("#value_detail-h").val();
							if(value){
								rowDetail.setValue("value",value);
							}else{
								rowDetail.setValue("value",val);
							}
						}
						else if(id=="source_name_detail"){
							$("#value_detail-h").val("");
							$("#value_detail").val("");
							colValue="";
						}
						else{
							var dbid=id.substring(0,id.length-7);
							rowDetail.setValue(dbid,val);
						}
					}	
				}
			};
			var node;
			uiConfigureViewModel.baseSaveButton = function(){
				var tokenid = ip.getTokenId();
				// 操作类型，新增or修改
		    	var optType = $("#opt_type").val();
		    	var ztree = $.fn.zTree.getZTreeObj("uiConfigureTree");
		    	node = ztree.getSelectedNodes();
				var treeObj = $.fn.zTree.getZTreeObj("viewDetailTree");
				var nodes = treeObj.transformToArray(treeObj.getNodes());
				var detailTable = uiConfigureViewModel.viewDetailTree;
				if(nodes.length>0){
					for(var i=0;i<nodes.length;i++){
						var ui_detail_id = nodes[i]["id"];
						var row = detailTable.getRowByField("ui_detail_id",nodes[i]["id"]);
						if (row !== null && row !== undefined && row !== '') {
							row.setValue("field_index",i+1);
							row.setValue("header_level",nodes[i]["level"]+1);
							row.setValue("parent_id",nodes[i]["pId"]);
							var is_enabled =  row.getValue('is_enabled');
							if(is_enabled=='true' || is_enabled=='1'){
								row.setValue("is_enabled",'1');
							}else{
								row.setValue("is_enabled",'0');
							}
						}
					}
				}
				var getValidRows = uiConfigureViewModel.getDatasWithNotDel(uiConfigureViewModel.viewDetailTree);
				var nodefields =uiConfigureViewModel.viewDetailTree.getSimpleData();				
				var ui_id_base = $("#ui_id_base").val();
		    	var ui_code_base = $("#ui_code_base").val();
		    	var ui_name_base = $("#ui_name_base").val();
		    	var ui_type_base = $("#ui_type_base").val();
		    	var remark_base = $("#remark_base").val();
		    	var columns_base = $("#columns_base").val();
		    	var id_base = $("#id_base").val();
		    	var title_base = $("#title_base").val();
		    	var sys_id_base = $("#sys_id_base").val();
		    	var viewData= {
		    		 ajax:"noCache",
		    		 tokenId:tokenid,
		    		 ui_id:ui_id_base,
		    		 ui_code: ui_code_base,
		    		 ui_name: ui_name_base,
		    		 ui_type: ui_type_base,
		    		 remark:remark_base,
		    		 columns:columns_base,
		    		 id:id_base,
		    		 title:title_base,
		    		 sys_id:sys_id_base,
		    		 uidetails:getValidRows
	                };
		    	
		    	 $.ajax({
						url : "/df/viewConfig/saveView?tokenid=" + tokenid,
						type : 'POST',
						dataType : 'json',
						data:{"viewData":JSON.stringify(viewData),"advanceArr":JSON.stringify(advanceArr),
							"optType":optType,"tokenId":tokenid,"ajax":"nocache"},
						success : function(data) {
							if(data.flg == "sucess"){
								$("#addModal").modal('hide');
								var ztree = $.fn.zTree.getZTreeObj("uiConfigureTree");
						    	node = ztree.getSelectedNodes();
								uiConfigureViewModel.getInitData();
								uiConfigureViewModel.viewContentClear();
								ip.ipInfoJump("保存成功！","success");
							}else{
								ip.warnJumpMsg(data.msg,0,0,true);
							}
						}
					});
		    	
		    };
		    
		    /**
		     * 获取未删除的数据对象 
		     */
		    uiConfigureViewModel.getDatasWithNotDel = function(datatable){
		    	var rows = datatable.getAllRows();
			    var datas = [];
			    for (var i = 0, count = rows.length; i < count; i++) {
			    	if (rows[i].status != Row.STATUS.FALSE_DELETE && rows[i].status != Row.STATUS.DELETE){		    		
			    		if (rows[i]) datas.push(rows[i].getSimpleData());
			    	}
			    }return datas;
		    }
		    

		    uiConfigureViewModel.pCloseButton = function(){
		    	$("#preview-content").hide();
		    };
		    
		    uiConfigureViewModel.previewButton = function(){
		    	$("#preview-view").empty();
		    	var ui_type = $("#ui_type_base").val();
		    	var nodefields =uiConfigureViewModel.viewDetailTree.getSimpleData();
		    	// 列表视图
		    	var viewId=uuid();
		    	if(ui_type=="002"){
		    		uiConfigureViewModel.initGridDate(nodefields,viewId,"preview-view");
		    		$("#preview-content").show();
		    	}else if(ui_type=="001" || ui_type=="003"){
		    		uiConfigureViewModel.initQueryDate(nodefields,"query",viewId,"preview-view");
		    		$("#preview-content").show();
		    	}
		    };
		    
		    
		    // 通过添加详细信息中的  控件id 添加要素 
		    uiConfigureViewModel.eleChoiceButton = function(){
		    	$("#ele-type-hide").val("from-col-id");
		    	uiConfigureViewModel.eleInfoInit();
		    };
		    
		   
		    // 通过添加详细信息中的  数据源 添加要素 
		    uiConfigureViewModel.eleChoiceFromSourceButton = function(){
		    	$("#ele-type-hide").val("from-col-source");
		    	uiConfigureViewModel.eleInfoInit();
		    };
		    
		    // 通过详细信息中的  数据源 添加要素 
		    uiConfigureViewModel.eleChoiceDetailButton = function(){
		    	$("#ele-type-hide").val("from-source-detail");
		    	uiConfigureViewModel.eleInfoInit();
		    };
		    
		    // 初始化选择要素的信息 
		    uiConfigureViewModel.eleInfoInit =function(){
		    	$("#ele-choice").show();
		    	$("#elequickquery").val("");
		    	var tokenid = ip.getTokenId();
		    	$.ajax({
					url : "/df/viewConfig/getEleInfo.do?tokenid=" + tokenid,
					type : 'GET',
					dataType : 'json',
					data: {"tokenId":tokenid,"ajax":"nocache"},
					success : function(data) {
						uiConfigureViewModel.eleInfoTree.setSimpleData(data.eleinfo);
					}
		    	});
		    	
		    	/*var eleInfoTree = $.fn.zTree.getZTreeObj("eleInfoTree");
		    	eleInfoTree.expandAll(true);*/
		    };
		    
		    
		    
		    // 选择要素的确认按钮
		    uiConfigureViewModel.eleConfirmButton = function(){
		    	var index = uiConfigureViewModel.eleInfoTree.getSelectedIndex();
		    	var nodeData = uiConfigureViewModel.eleInfoTree.rows._latestValue[index].data;
		    	if($("#ele-type-hide").val()=="from-col-id"){
		    		$("#col_id").val(nodeData["ele_code"].value.toLowerCase()+"_id");
			    	$("#col_title").val(nodeData["ele_name"].value);
			    	$("#col_source_name").val(nodeData["elename"].value);
			    	$("#col_source").val(nodeData["ele_code"].value);
			    	$("#col_value").val("");
			    	$("#col_value-h").val("");
		    	}else if($("#ele-type-hide").val()=="from-col-source"){
		    		$("#col_source_name").val(nodeData["elename"].value).change();
			    	$("#col_source").val(nodeData["ele_code"].value);
			    	$("#col_value").val("");
			    	$("#col_value-h").val("");
		    	}else if($("#ele-type-hide").val()=="from-source-detail"){
		    		$("#source_name_detail").val(nodeData["elename"].value).change();
			    	$("#source_detail").val(nodeData["ele_code"].value);
			    	$("#value_detail").val("");
			    	$("#value_detail-h").val("");
			    	var ui_detail_id = $("#ui_detail_id_detail").val();
					var rowDetail = uiConfigureViewModel.viewDetailTree.getRowByField("ui_detail_id",ui_detail_id);
					if(rowDetail !== null && rowDetail !== undefined && rowDetail !== ''){
						rowDetail.setValue("source", nodeData["ele_code"].value);
						rowDetail.setValue("source_name", nodeData["elename"].value);
					}
		    	}
		    	
		    	$("#ele-choice").hide();
			};
			
			changeColDispMode = function(info){
				 
				var val = info.value;
				var id = info.id;
				var type = info.type;
				if(val!="treeassist" && val!="multreeassist"){
					$("#col_source_name").attr("readOnly",true);
					$("#ele-addsource-choice").attr("data-bind","");
				}else{
					$("#col_source_name").attr("readOnly",false);
					$("#ele-addsource-choice").attr("data-bind","click: eleChoiceFromSourceButton");
				}
				
			};
			
			
			// 默认值选择  
		    uiConfigureViewModel.defaultValueColButton = function(){
		    	uiConfigureViewModel.defaultValueButton("0");
		    };
		    // 默认
		    uiConfigureViewModel.defaultValueDetailButton = function(){
		    	uiConfigureViewModel.defaultValueButton("1");
		    };
		    
		    
		    // flg 0:新增列是的选择默认值 1：详细信息选择默认值
		    uiConfigureViewModel.defaultValueButton = function(flg){
		    	var tokenid = ip.getTokenId();
		    	var element;
		    	var elementCodeName;
		    	var textId;
		    	if(flg=='0'){
		    		 element = $("#col_source").val();
			    	 elementCodeName = $("#col_source_name").val();
			    	 textId= 'col_value';
		    	}else if(flg=='1'){
		    		element = $("#source_detail").val();
			    	 elementCodeName = $("#source_name_detail").val();
			    	 textId='value_detail';
		    	}
		    	
		    	if(!element || !elementCodeName){
		    		ip.warnJumpMsg("请先选择数据源！！!",0,0,true);
		    		return;
		    	}
		    	
		    	$.ajax({
		    		url: "/df/dic/dictree.do",
		    		type: "GET",
		    		async: false,
		    		data: {
		    			"element": element,
		    			"tokenid": tokenid,
		    			"ele_value": "",
		    			"ajax": "noCache"
		    		},success: function(data) {
		    			if(element == "FILE"){
		    				ip.treeChoice(textId, data.eleDetail, '0', {}, '', '默认值选择', '','','chr_name');
		    			}else{
		    				ip.treeChoice(textId, data.eleDetail, '0', {}, '', '默认值选择', '','');
		    			}
		    		}
		    	});
		    };
		    
		    // 快速查詢文本框
			var val = "";
			elequickquery = function (){  
				
				var user_write = $("#elequickquery").val();
				if(user_write == val){
					return;
				}
				val = user_write;
				var data_tree = $("#eleInfoTree")[0]['u-meta'].tree;
				var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
				data_tree.expandNode(search_nodes[0],true,false,true);
				data_tree.selectNode(search_nodes[0]);
				$("#elequickquery").focus();

			};
			// 查詢下一個
			var i = 0;
			eleTreeNext = function (){
				var user_write = $("#elequickquery").val();
				var data_tree = $("#eleInfoTree")[0]['u-meta'].tree;
				var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
				if(i < search_nodes.length){
					data_tree.selectNode(search_nodes[i++]);
				}else{
					i = 0;
					ip.ipInfoJump("最后一个");
				}
				$("#elequickquery").focus();
			};
		    uiConfigureViewModel.eleCloseButton = function(){
		    	$("#ele-choice").hide();
		    };
		    
		    
		    uiConfigureViewModel.initGridUi = function(viewId,uiType){
			    var tokenid = ip.getTokenId();
		    	var view = {};
		    	
		    	$.ajax({
		    		url : "/df/viewConfig/getAllInfoForView.do?tokenid=" + tokenid,
		            type: "GET",
		            dataType: "json",
		    		async: false,
		    		data :{"viewId":viewId,"tokenId":tokenid,"ajax":"nocache"},
		            success: function (data) {
		            	if(uiType=="002"){
		            		uiConfigureViewModel.initGridDate(data.viewDetail,viewId,"info-content");
		            	}else if (uiType=="003" || uiType=="001"){
		            		uiConfigureViewModel.initQueryDate(data.viewDetail,"query",viewId,"info-content");
		            	}
		    		}
		    	});
		    };
		    
		    
		    uiConfigureViewModel.initGridDate = function(creatData,viewid,areaid) {
		    	
		    	var viewModel = {
		    			gridData: new u.DataTable({
		    				meta:''
		    			}),
		    			totals:[],
		    		};
		    	
		    		var viewId = viewid.substring(1,37);
		    		var meta = '{';
		    		for(var j=0;j<creatData.length;j++){
		    			meta += '"' + creatData[j].id + '"';
		    			meta += ":{}";
		    			if(j < creatData.length - 1){
		    				meta += ",";
		    			}
		    		}
		    		meta += "}";
		    		viewModel.gridData.meta = JSON.parse(meta);
		    		var innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData","type":"grid","editType":"string","autoExpand":false,"needLocalStorage":true,"multiSelect": true,"showNumCol": true,"showSumRow": true,"onSortFun":"sortFun"}' + "'>";
		    		for(var i = 0; i < creatData.length; i++ ) {
		    			if(creatData[i].width == ""){
		    				creatData[i].width = 200;
		    			}
		    			if(creatData[i].sumflag == "1"&&creatData[i].visible=="true") {
		    				viewModel.totals.push(creatData[i].id);
		    				viewModel[creatData[i].id] = "";
		    				innerHTML += "<div options='"+'{"field":"'+ creatData[i].id +'","editType":"string","dataType":"String","title":"'+ creatData[i].title +'","headerLevel":"'+ creatData[i].header_level +'","width": '+ creatData[i].width +',"sumCol":true,"sumRenderType":"summ"}'+"'></div>";
		    			} else if(creatData[i].visible=="true"){
		    				innerHTML += "<div options='"+'{"field":"'+ creatData[i].id +'","editType":"string","dataType":"String","title":"'+ creatData[i].title +'","headerLevel":"'+ creatData[i].header_level +'","width": '+ creatData[i].width +'}'+"'></div>";
		    			} 
		    		}
		    		innerHTML += "</div>";
		    		$('#'+areaid).append(innerHTML);
		    		
		    		ko.cleanNode($('#'+areaid)[0]);
		    		var app = u.createApp({
		    			el: '#'+areaid,
		    			model: viewModel
		    		});
		    	};
		    	
		    	
		    uiConfigureViewModel.initQueryDate = function(creatData,areaType,viewId,areaid){		    	
		    	viewId = viewId.substring(1, 37);
		    	var n = areaType == "edit" ? 6 : 4;
		    	var html = '';
		    	var aims = [];
		        for (var i = 0; i < creatData.length; i++) {
		        	if(creatData[i].disp_mode!=""){	
		        		if(creatData[i].visible=="false"){	
		        			html += '<div class="col-md-'+ n +'"style="display:none">]';
		        		}else{
		        			html += '<div class="col-md-'+ n +'">';
		        		}
		        	}
		            switch (creatData[i].disp_mode) {
		    			case "text":
		    				html +=	'<label for="' + creatData[i].id + '" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
		    							'<div class="col-md-8 ip-input-group">';
		    							if(creatData[i].editable=="false"){
		    								html +=	'<input type="text" class="form-control" id="' + creatData[i].id + '-' + viewId + '" disabled>';
		    							}else{
		    								html +=	'<input type="text" class="form-control" id="' + creatData[i].id + '-' + viewId + '">';
		    							}
		    							html +=	'</div>' +
		    								'</div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "text"
		    				};
		    				aims.push(current_aim);
		                    break;
		    			case "int":
		    				// html += '<div class="col-md-'+ n +'">'+
		    				html +='<label for="" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
		    							'<div class="col-md-8 ip-input-group">';
		    					if(creatData[i].editable=="false"){
		    						html +='<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" disabled >';
		    					}else{
		    						html +='<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '">';
		    					};
		    					html +='</div>' +
		    						'</div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "int"
		    				};
		    				aims.push(current_aim);
		    				break;
		    			case "radio":
		    				// html += '<div class="col-md-'+ n +'">'+
		    				html +='<label for="" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
		    							'<div class="col-md-8 ip-input-group">';
		    				if(creatData[i].ref_model!=null || creatData[i].ref_model!=""){
		    					var m = creatData[i].ref_model.split("+");
			    				for(var t = 0; t < m.length; t++){
			    					var k = m[t].split("#");
			    					if(k.length > 1){
				    						if(creatData[i].editable=="false"){
				    							html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="' + k[0] + '" disabled>' + k[1] + '</label>';
				    						}else{
				    							html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="' + k[0] + '">' + k[1] + '</label>';
				    						}
			    							
			    						} else {
			    							if(creatData[i].editable=="false"){
			    								html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="" disabled>' + k[0] + '</label>';
			    							}else{
			    								html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="">' + k[0] + '</label>';
			    							}
			    					}
			    				}
		    				}else{
		    					
		    				}
		    				
		    				html += '</div></div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "radio"
		    				};
		    				aims.push(current_aim);
		                    break;
		    			case "combobox":
		    				// html += '<div class="col-md-'+ n +'">'+
		    				html +='<label for="" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
		    								'<div class="col-md-8 ip-input-group">';
		    				if(creatData[i].editable=="false"){
		    					html += '<select class="form-control" class="col-md-8" id="' + creatData[i].id + '-' + viewId + '" disabled>';
		    				}else{
		    					html += '<select class="form-control" class="col-md-8" id="' + creatData[i].id + '-' + viewId + '">';
		    				}
		    				var m = creatData[i].ref_model.split("+");
		    				for(var t = 0; t < m.length; t++){
		    					var k = m[t].split("#");
		    					if(k.length > 1){
		    						html += '<option value="' + k[0] + '">' + k[1] + '</option>';
		    					} else {
		    						html += '<option value="">' + k[0] + '</option>';
		    					}
		    				}
		    				html += '</select></div></div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "combobox"
		    				};
		    				aims.push(current_aim);
		                    break;
		                case "checkbox":
		    				// html += '<div class="col-md-'+ n +'">'+
		                	html +='<label for="" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
		    							'<div class="col-md-8 ip-input-group">';
		    				
		    				var m = creatData[i].ref_model.split("+");
		    				for(var nn = 0; nn < m.length; nn++){
		    					var kk = m[nn].split("#");
		    					if(kk.length > 1){
		    						if(creatData[i].editable=="false"){
		    							html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="' + kk[0] + '" disabled>' + kk[1] + '</label>';
		    						}else{
		    							html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="' + kk[0] + '">' + kk[1] + '</label>';
		    						}
		    					} else {
		    						if(creatData[i].editable=="false"){
		    							html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="" disabled>' + kk[0] + '</label>';
		    						}else{
		    							html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="">' + kk[0] + '</label>';
		    						}
		    					}
		    				}
		    				html += '</div></div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "checkbox"
		    				};
		    				aims.push(current_aim);
		                    break;
		                case "decimal":
		    				// html += '<div class="col-md-'+ n +'">'+
		                	html +='<label for="" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
		    							'<div class="col-md-8 ip-input-group">';
		                	if(creatData[i].editable=="false"){
		                		html +='<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" onblur="moneyQuset(this.id)" disabled>';
		                	}else{
		                		html +='<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" onblur="moneyQuset(this.id)">';
		                	}
		                	html +='</div>' +
		    						'</div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "decimal"
		    				};
		    				aims.push(current_aim);
		    				break;
		                case "doubledecimal":
		    				// html += '<div class="col-md-'+ n +'">'+
		                	if(creatData[i].editable=="false"){
		                	html +='<label for="" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
		    							'<div class="col-md-3 ip-input-group">' +
		    								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="moneyQuset(this.id)" disabled>' +
		    							'</div>' +
		    							'<div class="col-md-2 ip-to-font">至</div>'+
		    							'<div class="col-md-3 ip-input-group">' +
		    								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '2" onblur="moneyQuset(this.id)" disabled>' +
		    							'</div>' +
		    						'</div>';
		                	}else{
		                		html +='<label for="" class="col-md-4 text-right">' + creatData[i].title + '</label>' +
    							'<div class="col-md-3 ip-input-group">' +
    								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="moneyQuset(this.id)">' +
    							'</div>' +
    							'<div class="col-md-2 ip-to-font">至</div>'+
    							'<div class="col-md-3 ip-input-group">' +
    								'<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '2" onblur="moneyQuset(this.id)">' +
    							'</div>' +
    						'</div>';
		                	}

		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "doubledecimal"
		    				};
		    				aims.push(current_aim);
		    				break;
		                case "datetime":
		    				// html += '<div class="col-md-'+ n +'">'+
		                	
		                	html +='<label for="dtp_input2" class="col-md-4 control-label text-right">' + creatData[i].title + '</label>';
		                			if(creatData[i].editable=="false"){
		                				html +='<div class="input-group date col-md-8 ip-input-group" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '" data-link-format="yyyy-mm-dd">';
		                			}else{
		                				html +='<div class="input-group date form_date col-md-8 ip-input-group" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '" data-link-format="yyyy-mm-dd">';
		                			}
		                			
		                			html +='<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="" readonly>' +
		    								'<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
		    								'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
		    							'</div>' +
		    							// '<input type="hidden" id="' + creatData[i].id + '-' + viewId + '" value="" /><br/>' +
		    						'</div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "datetime"
		    				};
		    				aims.push(current_aim);
		                    break;
		                case "doubletime":
		    				// html += '<div class="col-md-'+ n +'">'+
		                	html +='<label for="dtp_input2" class="col-md-4 control-label text-right">' + creatData[i].title + '</label>';
		                	if(creatData[i].editable=="false"){
		                		html +='<div class="input-group date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '1" data-link-format="yyyy-mm-dd">' ;
		                	}else{
		                		html +='<div class="input-group date form_date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '1" data-link-format="yyyy-mm-dd">';
		                	}
		                	html +='<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '1" type="text" value="" readonly>' +
		    								'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
		    							'</div>' +
		    							'<div class="col-md-2 ip-to-font">至</div>';
		    							if(creatData[i].editable=="false"){
		    								html +='<div class="input-group date form_date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '2" data-link-format="yyyy-mm-dd">';
		    							}else{
		    								html +='<div class="input-group date form_date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '2" data-link-format="yyyy-mm-dd">';	
		    							}
		    							html +='<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '2" type="text" value="" readonly>' +
		    							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>' +
		    							'</div>' +
		    						'</div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "doubletime"
		    				};
		    				aims.push(current_aim);
		                    break;
		    			case "treeassist":
		    				// html += '<div class="col-md-'+ n +'">'+
		    				html +='<label class="col-md-4 text-right">' + creatData[i].title + '</label>'+
		    							'<div class="input-group col-md-8 ip-input-group">' +
		    								'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '">' +
		    								'<input type="hidden" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '-h">' +
		    								'<span class="input-group-btn">';
		    									if(creatData[i].editable=="false"){
		    										html +='<button class="btn btn-default" style="padding: 4px 9px;margin-top: 0px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source +'" data-toggle="modal" ">';
		    									}else{
		    										html +='<button class="btn btn-default" style="padding: 4px 9px;margin-top: 0px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source +'" data-toggle="modal" onclick="ip.showAssitTree(this.id,this.name,0,{},0,0)">';
		    									}
		    									html +='<span class="glyphicon glyphicon-list" aria-hidden="true"></span></button></span>' +
		    							'</div>' +
		    						'</div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "treeassist"
		    				};
		    				aims.push(current_aim);
		    				break;
		    			case "multreeassist":
		    				// html += '<div class="col-md-'+ n +'">'+
		    				html +='<label class="col-md-4 text-right">' + creatData[i].title + '</label>'+
		    							'<div class="input-group col-md-8 ip-input-group">' +
		    								'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '">' +
		    								'<input type="hidden" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '-h">' +
		    								'<span class="input-group-btn">';
		    								if(creatData[i].editable=="false"){
		    									html +='<button class="btn btn-default" style="padding: 4px 9px;margin-top: -4px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source +'" data-toggle="modal" ">';
		    								}else{
		    									html +='<button class="btn btn-default" style="padding: 4px 9px;margin-top: -4px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source +'" data-toggle="modal" onclick="ip.showAssitTree(this.id,this.name,1,{},0,0)">';
		    								}
		    								html +='<span class="glyphicon glyphicon-list" aria-hidden="true"></span></button></span>' +
		    							'</div>' +
		    						'</div>';
		    				var current_aim = {
		    					"id" : creatData[i].id + '-' + viewId,
		    					"type" : "multreeassist"
		    				};
		    				aims.push(current_aim);
		    				break;
		            }
		        }
		    	
		    	$("#"+areaid ).append(html);
		    	$('.form_date').datetimepicker({
		    		language:  'zh-CN',
		    		weekStart: 1,
		    		todayBtn:  1,
		    		autoclose: 1,
		    		todayHighlight: 1,
		    		startView: 2,
		    		minView: 2,
		    		forceParse: 0
		    	});
		};
		    
			
			
			uuid = function() {
		        var s = [];
		        var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTYVWXYZ";
		        for (var i = 0; i < 36; i++) {
		            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		        }
		        s[14] = "4"; 
		        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
		                                                            
		        s[8] = s[13] = s[18] = s[23] = "-";

		        var uuid = s.join("");
		        return "{"+uuid+"}";
		    };

			$(function() {
				ko.cleanNode($('body')[0]);
				app = u.createApp({
					el : 'body',
					model : uiConfigureViewModel
				});
				uiConfigureViewModel.getInitData();
				uiConfigureViewModel.getInitViewCombox();

			});
		});