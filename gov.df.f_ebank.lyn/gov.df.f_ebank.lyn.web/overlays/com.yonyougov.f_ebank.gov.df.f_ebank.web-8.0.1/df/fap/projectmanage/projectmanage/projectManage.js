require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var tree_diff;
	var belong_parent_id1;
	var belong_parent_id2;
	var belong_parent_name1;
	var belong_parent_name2;
	var belong_ser_id1;
	var belong_ser_id2;
	var belong_ser_name1;
	var belong_ser_name2;
	var belong_project_id1;
	var belong_project_id2;
	var belong_project_name1;
	var belong_project_name2;
	var belong_unit_id1;
	var belong_unit_id2;
	var belong_unit_name1;
	var belong_unit_name2;
	var is_ser_flag;
	var is_pro_flag;
	var is_unit_flag;
	var is_pro_flag1=true;
	var is_ser_flag1=true;
	var is_unit_flag1=true;
	var is_auto_code;
	var tokenid = ip.getTokenId();
	//当前选中节点
	var currentnode;
	var manageViewModel = {
			is_leaf: [{
	            "value": "1",
	            "name": "是"
	        }, {
	            "value": "0",
	            "name": "否"
	        }],	
	        enabled: [{
	            "value": "1",
	            "name": "是"
	        }, {
	            "value": "0",
	            "name": "否"
	        }],	
	        public_sign:  [{
	            "value": "1",
	            "name": "是"
	        }, {
	            "value": "0",
	            "name": "否"
	        }],	
	        is_deleted:  [{
	            "value": "1",
	            "name": "是"
	        }, {
	            "value": "0",
	            "name": "否"
	        }],	
			data : ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
							var bis_id = node.id;
							currentnode=bis_id;
							$.ajax({
								url: "/df/bis/selectBis.do?tokenid="+tokenid,
								type: 'POST',
								dataType: 'json',
								data: {"bis_id":bis_id,"tokenId":tokenid,"ajax":"1"},
								success: function (data) {
									if(data.flag=="1"){
										manageViewModel.gridDataTable.pageIndex("0");
										manageViewModel.gridDataTable.setSimpleData(data.List);
										manageViewModel.gridDataTable.totalRow(data.rowsCount);
										manageViewModel.gridDataTable.totalPages(data.pageCount);

										manageViewModel.gridDataTable.setRowUnSelect(0);
									}else if(data.flag=="0"){
										ip.ipInfoJump("系统繁忙，请稍后！","info");
									}
								}
							});
					}
				}
			},
			treePaSetting:{
				view:{
					selectedMulti:true
				},
				callback:{
					onClick:function(e,id,node){
						belong_parent_id1=node.id;
						belong_parent_name1=node.name;
					}
				}
			},
			treeSerSetting:{
				view:{
					selectedMulti:true
				},
				callback:{
					onClick:function(e,id,node){
						belong_ser_id1=node.id;
						belong_ser_name1=node.name;
					}
				}
			},
			treeProSetting:{
				view:{
					selectedMulti:true
				},
				callback:{
					onClick:function(e,id,node){
						belong_project_id1=node.id;
						belong_project_name1=node.name;
					}
				}
			},
			treeUnitSetting:{
				view:{
					selectedMulti:true
				},
				callback:{
					onClick:function(e,id,node){
						belong_unit_id1=node.id;
						belong_unit_name1=node.name;
					}
				}
			},
			treeDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						'value':""
					},
					'parent_id': {
						'value':""
					},
					'codename':{
						'value':""
					}
				}
			}),
			treeSerDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						'value':""
					},
					'parent_id': {
						'value':""
					},
					'chr_name':{
						'value':""
					}
				}
			}),
			treeProDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						'value':""
					},
					'parent_id': {
						'value':""
					},
					'chr_name':{
						'value':""
					}
				}
			}), 
			treeUnitDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						'value':""
					},
					'parent_id': {
						'value':""
					},
					'codename':{
						'value':""
					}
				}
			}), 
			gridDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						'value':""
					},
					'chr_code': {
						'value':""
					},
					'chr_name':{
						'value':""
					}
				},
				isNot: function(obj) {
			     
			        var htmlStr = '';
			        obj.element.innerHTML = htmlStr;

			    },
			}),
	};
	//初始化树与表格
	manageViewModel.getInitData = function () {
		var pageIndex=manageViewModel.gridDataTable.pageIndex();
		var pageSize=manageViewModel.gridDataTable.pageSize();
		$.ajax({
			url: "/df/bis/initBisMain.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"tokenId":tokenid,"ajax":"1","pageIndex":pageIndex,"pageRows":pageSize},
			success: function (data) {
				if(data.flag=="1"){
//					manageViewModel.treeDataTable.setSimpleData(data.params[0].treeList);
					manageViewModel.gridDataTable.setSimpleData(data.resultList,{unSelect:true});
					manageViewModel.gridDataTable.totalRow(data.rowsCount);
					manageViewModel.gridDataTable.totalPages(data.pageCount);
//					manageViewModel.gridDataTable.setRowUnSelect(0);
				}
			} 
		});
	}
	manageViewModel.getGridData=function(){
		var pageIndex=manageViewModel.gridDataTable.pageIndex();
		var pageSize=manageViewModel.gridDataTable.pageSize();
		$.ajax({
			url: "/df/bis/pageChange.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"tokenId":tokenid,"ajax":"1","pageIndex":pageIndex,"pageRows":pageSize},
			success: function (data) {
				if(data.flag=="1"){
					manageViewModel.gridDataTable.setSimpleData(data.resultList);
					manageViewModel.gridDataTable.totalRow(data.rowsCount);
					manageViewModel.gridDataTable.totalPages(data.pageCount);
					manageViewModel.gridDataTable.setRowUnSelect(0);
				}
			} 
		});
	};	
	
	manageViewModel.getTablePageData=function(){
		var pageIndex=manageViewModel.gridDataTable.pageIndex();
		var pageSize=manageViewModel.gridDataTable.pageSize();
		$.ajax({
			url: "/df/bis/pageChange.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"tokenId":tokenid,"ajax":"1","pageIndex":pageIndex,"pageRows":pageSize,"bis_id":currentnode},
			success: function (data) {
				if(data.flag=="1"){
					manageViewModel.gridDataTable.setSimpleData(data.resultList);
					manageViewModel.gridDataTable.totalRow(data.rowsCount);
					manageViewModel.gridDataTable.totalPages(data.pageCount);
					manageViewModel.gridDataTable.setRowUnSelect(0);
				}
			} 
		});
	};
	
	manageViewModel.pageChangeFun= function(index){
		manageViewModel.gridDataTable.pageIndex(index);
		manageViewModel.getTablePageData();		
	};
	manageViewModel.sizeChangeFun= function(size){
		manageViewModel.gridDataTable.pageSize(size);
		manageViewModel.getTablePageData();
	};
	var t=0;
	manageViewModel.treeQuery = function (){
		var user_write = $.trim($("#tree-query-val").val());
		var data_tree = $("#manageTree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(t < search_nodes.length){
			data_tree.expandNode(search_nodes[t],true,false,true);
			data_tree.selectNode(search_nodes[t++]);
		}else{
			t = 0;
		}
	}
	manageViewModel.viewQuery = function (treeId){
		var treeId = $(".view-Tree").find(".ztree:visible").attr("id");
		var user_write = $("#addviewInput").val();
		var data_tree = $("#"+treeId+"")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);	
	}

	var j = 1;
	manageViewModel.viewNext = function (treeId){
		var treeId = $(".view-Tree").find(".ztree:visible").attr("id");
		var user_write = $("#addviewInput").val();
		var data_tree = $("#"+treeId+"")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(j < search_nodes.length){
			data_tree.selectNode(search_nodes[j++]);
		}else{
			j = 1;
		}
	}

	//删除树节点
	manageViewModel.delBudgetItem = function(){
		var nodes = manageViewModel.gridDataTable.getSelectedRows();
		if(nodes==undefined || nodes==""){
			ip.ipInfoJump("请选择要删除的数据！","info");
		}else{
			var nodeId = nodes[0].data.chr_id.value;
			ip.warnJumpMsg("确定要删除吗？","del-sure","del-cancle");
			$("#del-sure").one("click",function(){
				$("#config-modal").hide();
				$.ajax({
					url: "/df/bis/deleteBis.do?tokenid="+tokenid,
					type: 'POST',
					dataType: 'json',
					async: false,
					data: {"bis_id":nodeId,"tokenId":tokenid},
					success: function (data) {
						if(data.flag=="1"){
							manageViewModel.getInitData();
							ip.ipInfoJump(data.notice,"success");
						}else
						if(data.flag=="0"){
							ip.ipInfoJump(data.notice,"error");
						}
					}
				});
			});
			$(".del-cancle").on("click",function(){
				$("#config-modal").hide();
			});
		}
		
	};
	//各自弹出树确定
	manageViewModel.sureNode = function (){
		if(tree_diff=="pa"){
			belong_parent_id2=belong_parent_id1;
			belong_parent_name2=belong_parent_name1;
			$("#belong-parent").val(belong_parent_name2);
			$("#belong-parent").attr("name",belong_parent_id2);
			$('#addChoiceModel').modal('hide');
		}
		
		if(tree_diff=="ser"){
			belong_ser_id2=belong_ser_id1;
			belong_ser_name2=belong_ser_name1;
			$("#belong-firm").val(belong_ser_name2);
			$("#belong-firm").attr("name",belong_ser_id2);
			$('#addChoiceModel').modal('hide');
		}
		if(tree_diff=="pro"){
			belong_project_id2=belong_project_id1;
			belong_project_name2=belong_project_name1;
			$("#belong-project").val(belong_project_name2);
			$("#belong-project").attr("name",belong_project_id2);
			$('#addChoiceModel').modal('hide');
		}
		
		if(tree_diff=="unit"){
			belong_unit_id2=belong_unit_id1;
			belong_unit_name2=belong_unit_name1;
			$("#belong-unit").val(belong_unit_name2);
			$("#belong-unit").attr("name",belong_unit_id2);
			$('#addChoiceModel').modal('hide');
		}
		
	}
	//新增保存预算项目
	manageViewModel.sureItem = function (){
		var pro_code = $.trim($("#pro-code").val());
		if(!is_auto_code){
			if(pro_code == null ||pro_code ==""){
				ip.ipInfoJump("请输入项目编码！","info");
				return;
			}
		}
		var pro_name = $.trim($("#pro-name").val());
		if(pro_name == null || pro_name == ""){
			ip.ipInfoJump("请输入项目名称！","info");
			return;
		}
		if(is_pro_flag&&is_pro_flag1){
			var belong_project = $.trim($("#belong-project").val());
			if(belong_project == null || belong_project == ""){
				ip.ipInfoJump("请选择项目分类！","info");
				return;
			}
		}
		if(is_ser_flag&&is_ser_flag1){
			var belong_firm = $.trim($("#belong-firm").val());
			if(belong_firm == null || belong_firm == ""){
				ip.ipInfoJump("请选择业务处室！","info");
				return;
			}
		}
		if(is_unit_flag&&is_unit_flag1){
			var belong_unit = $.trim($("#belong-unit").val());
			if(belong_unit == null || belong_unit == ""){
				ip.ipInfoJump("请选择预算单位！","info");
				return;
			}
		}
		var pro_id = $("#pro-code").attr("name");
		$.ajax({
			url: "/df/bis/saveBisInput.do?tokenid="+tokenid,
			type: 'POST',
			dataType: 'json',
			data: {
				"tokenId":tokenid,
				"ajax":"1",
				"bis_id":pro_id,
				"chr_code":pro_code,
				"chr_name":pro_name,
				"parent_id":belong_parent_id2,
				"public_sign":$("#is-public").val(),
				"enabled":$("#is-use").val(),
				"mb_id":belong_ser_id2,
				"agency_id":belong_unit_id2,
				"agencyexp_id":belong_project_id2
			},
			success: function (data) {
				if(data.flag=="1"){
					var pageIndex=manageViewModel.gridDataTable.pageIndex();
					var pageSize=manageViewModel.gridDataTable.pageSize();
					$("#addBudgetItem").modal("hide");
					ip.ipInfoJump("保存成功！","success");
					$.ajax({
						url: "/df/bis/initBisMain.do?tokenid=" + tokenid,
						type: 'POST',
						dataType: 'json',
						data: {"tokenId":tokenid,"ajax":"1","pageIndex":pageIndex,"pageRows":pageSize},
						success: function (data) {
							if(data.flag=="1"){
//								manageViewModel.treeDataTable.setSimpleData(data.params[0].treeList);
								manageViewModel.gridDataTable.setSimpleData(data.resultList);
								manageViewModel.gridDataTable.totalRow(data.rowsCount);
								manageViewModel.gridDataTable.totalPages(data.pageCount);
								manageViewModel.gridDataTable.setRowUnSelect(0);
//								var data_tree = $("#manageTree1")[0]['u-meta'].tree;
//								var nodes  = data_tree.getNodes();
								var expand_node = belong_parent_id2;
//								var node = data_tree.getNodeByParam("id", expand_node, null);
//								data_tree.selectNode(node);
//								data_tree.expandNode(node, true, false, true);
							}
						} 
					});
				}else if(data.flag=="0"){
					ip.ipInfoJump("保存失败！","error");
				}
			}
		})
	};
	
	manageViewModel.editBudgetItem=function(){
		manageViewModel.initUse();
		var nodes = manageViewModel.gridDataTable.getSelectedRows();
		
//		var treeObj = $.fn.zTree.getZTreeObj("manageTree1");
//		var treenodes = treeObj.getSelectedNodes();
//		var treenodes = manageViewModel.treeDataTable.getSelectedNode();
		if(nodes==undefined || nodes==""){
			ip.ipInfoJump("请选择要编辑的数据！","info");
		}else{
			$('#addBudgetItem').modal('show');
			$("#project-title").text("编辑预算项目");
			var gridObj = $("#manage-grid").parent()[0]['u-meta'].grid;
			var select = gridObj.getSelectRows();
			$.ajax({
				url: "/df/bis/getEleTreeFile.do?tokenid=" + tokenid,
				type: 'POST',
				dataType: 'json',
				data: {"tokenId":tokenid,"ajax":"1",
					"mb_id":select[0].mb_id,"agency_id":select[0].agency_id,"agencyexp_id":select[0].agencyexp_id,"bis_id":select[0].chr_id
				},
				success: function (data) {
					if(data.flag=="1"){
						if(data.agency!="" && data.agency!=null && data.agency!=undefined){
							$("#belong-unit").val(data.agency[0].chr_name);
						}
						if(data.agencyexp!="" && data.agencyexp!=null && data.agencyexp!=undefined){
							$("#belong-project").val(data.agencyexp[0].chr_name);
						}
						if(data.mb!="" && data.mb!=null && data.mb!=undefined){
							$("#belong-firm").val(data.mb[0].chr_name);
						}
						if(data.bis!="" && data.bis!=null && data.bis!=undefined){
							$("#belong-parent").val(data.bis[0].chr_name);
						}
						if(select[0].public_sign=="1"){
							$("#belong-firm").parent().parent().hide();
							$("#belong-unit").parent().parent().hide();
							$("#belong-project").parent().parent().hide();
							is_pro_flag1=false;
							is_ser_flag1=false;
							is_unit_flag1=false;
						}
						$("#pro-code").val(select[0].chr_code);
						$("#pro-code").attr("name",select[0].chr_id);
						$("#pro-name").val(select[0].chr_name);
//						$("#belong-parent").val(treenodes[0].getParentNode().codename);
						$("#belong-parent").attr("name",select[0].parent_id);
						$("#is-public option").eq(select[0].public_sign).prop("selected", 'selected');
						if(select[0].enabled=="1"){
							$("#is-use option").eq(0).prop("selected", 'selected');
						}
						if(select[0].enabled=="0"){
							$("#is-use option").eq(1).prop("selected", 'selected');
						}
						$("#belong-firm").attr("name",select[0].mb_id);
						$("#belong-unit").attr("name",select[0].agency_id);
						$("#belong-project").attr("name",select[0].agencyexp_id);
					}else if(data.flag=="0"){
						ip.ipInfoJump("系统繁忙，请稍后！","info");
					}
				}
			});
		}
	};
	// 查询按钮
	manageViewModel.queryByCondition = function(){
		var pageIndex=manageViewModel.gridDataTable.pageIndex();
		var pageSize=manageViewModel.gridDataTable.pageSize();
		var name = $("#query-name").val();
		var code = $("#query-code").val();
		var condition = "";
		if(name!=null&&name!=undefined&&name!=""){
			condition += " and chr_name like '%" + name + "%' ";
		}
		if(code!=null&&code!=undefined&&code!=""){
			condition += " and chr_code like '%" + code + "%'  ";
		}
		
		$.ajax({
			url: "/df/bis/initBisMain.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"tokenId":tokenid,"ajax":"1","pageIndex":pageIndex,"pageRows":pageSize,"query":condition},
			success: function (data) {
				if(data.flag=="1"){
//					manageViewModel.treeDataTable.setSimpleData(data.params[0].treeList);
					manageViewModel.gridDataTable.setSimpleData(data.resultList);
					manageViewModel.gridDataTable.totalRow(data.rowsCount);
					manageViewModel.gridDataTable.totalPages(data.pageCount);
					manageViewModel.gridDataTable.setRowUnSelect(0);
//					var data_tree = $("#manageTree1")[0]['u-meta'].tree;
//					var nodes  = data_tree.getNodes();
					var expand_node = belong_parent_id2;
//					var node = data_tree.getNodeByParam("id", expand_node, null);
//					data_tree.selectNode(node);
//					data_tree.expandNode(node, true, false, true);
				}
			} 
		});
	}
	//
	manageViewModel.initUse = function(){
		$.ajax({
			url: "/df/bis/getAddConfig.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenId":tokenid,"ajax":"1"},
			success: function (data) {
				if(data.flag=="1"){
					if(data.configData[0].chr_value=="1"){
						is_auto_code=true;
						$("#pro-code").parent().parent().hide();
					}else if(data.configData[0].chr_value=="0"){
						is_auto_code=false;
						$("#pro-code").parent().parent().show();
					}
					if(data.configData[3].chr_value=="1"){
						$.ajax({
							url: "/df/dic/dictree.do?tokenid=" + tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"tokenId":tokenid,"ajax":"1","element":"MB"},
							success: function (data) {
								//if(data.flag=="1"){
									is_ser_flag=true;
									manageViewModel.treeSerDataTable.setSimpleData(data.eleDetail);
								//}
							} 
						});
					}else if(data.configData[3].chr_value=="0"){
						is_ser_flag=false;
						$("#belong-firm").parent().parent().hide();
					}
					if(data.configData[2].chr_value=="1"){
						$.ajax({
							url: "/df/dic/dictree.do?tokenid=" + tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"tokenId":tokenid,"ajax":"1","element":"AGENCY"},
							success: function (data) {
								//if(data.flag=="1"){
									is_unit_flag=true;
									manageViewModel.treeUnitDataTable.setSimpleData(data.eleDetail);
								//}
							} 
						});
					}else if(data.configData[2].chr_value=="0"){
						is_unit_flag=false;
						$("#belong-unit").parent().parent().hide();
					}
					if(data.configData[1].chr_value=="1"){
						$.ajax({
							url: "/df/dic/dictree.do?tokenid=" + tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"tokenId":tokenid,"ajax":"1","element":"AGENCYEXP"},
							success: function (data) {
								//if(data.flag=="1"){
									is_pro_flag=true;
									manageViewModel.treeProDataTable.setSimpleData(data.eleDetail);
								//}
							} 
						});
					}else if(data.configData[1].chr_value=="0"){
						is_pro_flag=false;
						$("#belong-project").parent().parent().hide();
					}
				}
			} 
		});
	}
	//清空所有数据信息（公共）
	manageViewModel.clearAllInfo=function(){
		$("#pro-code").val("");
		$("#pro-code").attr("name","");
		$("#pro-name").val("");
		$("#belong-parent").val("");
		$("#belong-parent").attr("name","");
		$("#belong-firm").val("");
		$("#belong-firm").attr("name","");
		$("#belong-unit").val("");
		$("#belong-unit").attr("name","");
		$("#belong-project").val("");
		$("#belong-project").attr("name","");
		$("#is-public option:first").prop("selected", 'selected');
		$("#is-use option:first").prop("selected", 'selected');
		if(is_pro_flag){
			$("#belong-project").parent().parent().show();
			is_pro_flag1=true;
		}
		if(is_ser_flag){
			$("#belong-firm").parent().parent().show();
			is_ser_flag1=true;
		}
		if(is_unit_flag){
			$("#belong-unit").parent().parent().show();
			is_unit_flag1=true;
		}
	};
	
	/*
	 * 清空输入框的值
	 */
	clearText = function(id){
		$("#"+ id).val("");
	};
	
	
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: manageViewModel
		});
		manageViewModel.getInitData();
	});
	
	//增加start
	$('#addBudgetItem').on('show.bs.modal', function (event) {
		$("#project-title").text("新增预算项目");
		manageViewModel.clearAllInfo();
		manageViewModel.initUse();
	})
	//增加end
	//光标离开校验
    $("#pro-code").blur(function(){
		var pro_code = $.trim($("#pro-code").val());
		var pro_id = $("#pro-code").attr("name");
	    $.ajax({
			url: "/df/bis/checkBis.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {
				"tokenId":tokenid,
				"ajax":"1",
				"bis_id":pro_id,
				"bis_code":pro_code
			},
			success: function (data) {
				if(data.flag=="1"){
					if(data.isok=="0"){
						ip.ipInfoJump("该项目编码已存在，请重新编写！","info");
						$("#pro-code").val("");
					}
				}
				if(data.flag=="0"){
					ip.ipInfoJump("系统繁忙，请稍后！","info");
				}
			} 
		});
	});
	//选择父级或业务处室start
	$('#addChoiceModel').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);
	    var tree_target = button.data('whatever');
	    tree_diff=tree_target;
	    //父级
	    if(tree_target=="pa"){
	    	$("#manageTreePa").show();
	    	$("#manageTreeSer").hide();
	    	$("#manageTreePro").hide();
	    	$("#manageTreeUnit").hide();
	    }
	    //项目分类
	    if(tree_target=="pro"){
	    	$("#manageTreeSer").hide();
	    	$("#manageTreePa").hide();
	    	$("#manageTreePro").show();
	    	$("#manageTreeUnit").hide();
	    }
	    //业务处室
	    if(tree_target=="ser"){
	    	$("#manageTreeSer").show();
	    	$("#manageTreePa").hide();
	    	$("#manageTreePro").hide();
	    	$("#manageTreeUnit").hide();
	    }
	    //预算单位
	    if(tree_target=="unit"){
	    	$("#manageTreeSer").hide();
	    	$("#manageTreePa").hide();
	    	$("#manageTreePro").hide();
	    	$("#manageTreeUnit").show();
	    }
	    $.ajax({
			url: "/df/bis/getBISTree.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"tokenId":tokenid,"ajax":"1"},
			success: function (data) {
				if(data.flag=="1"){
					manageViewModel.treeDataTable.setSimpleData(data.params[0].treeList);
//					manageViewModel.gridDataTable.setSimpleData(data.resultList);
//					manageViewModel.gridDataTable.totalRow(data.rowsCount);
//					manageViewModel.gridDataTable.totalPages(data.pageCount);
//					manageViewModel.gridDataTable.setRowUnSelect(0);
//					var data_tree = $("#manageTree1")[0]['u-meta'].tree;
//					var nodes  = data_tree.getNodes();
//					var expand_node = belong_parent_id2;
//					var node = data_tree.getNodeByParam("id", expand_node, null);
//					data_tree.selectNode(node);
//					data_tree.expandNode(node, true, false, true);
				}
			} 
		});
	})
	//选择父级或业务处室end
	$("#is-public").change(function(){
		if($("#is-public").val()=="1"){
			$("#belong-firm").parent().parent().hide();
			$("#belong-unit").parent().parent().hide();
			$("#belong-project").parent().parent().hide();
			is_pro_flag1=false;
			is_ser_flag1=false;
			is_unit_flag1=false;
		}
		if($("#is-public").val()=="0"){
			if(is_pro_flag){
				$("#belong-project").parent().parent().show();
				is_pro_flag1=true;
			}
			if(is_ser_flag){
				$("#belong-firm").parent().parent().show();
				is_ser_flag1=true;
			}
			if(is_unit_flag){
				$("#belong-unit").parent().parent().show();
				is_unit_flag1=true;
			}
		}
	});
	$("#toggle-btn").dblclick(function(){
		//$("#toggle-cla").toggleClass("glyphicon-triangle-top");
		$("#manageTree1").toggleClass("hide");
	});
	$("#toggle-btn").click(function(){
		currentnode = "";
		manageViewModel.getInitData();
//		var pageIndex=manageViewModel.gridDataTable.pageIndex();
//		var pageSize=manageViewModel.gridDataTable.pageSize();
//		var ztree = $.fn.zTree.getZTreeObj("manageTree1");
//		window.dd = ztree;
//		
//		ztree.cancelSelectedNode();
//		currentnode = "";
//		$.ajax({
//			url: "/df/bis/initBisMain.do?tokenid=" + tokenid,
//			type: 'POST',
//			dataType: 'json',
//			data: {"tokenId":tokenid,"ajax":"1","pageIndex":pageIndex,"pageRows":pageSize},
//			success: function (data) {
//				if(data.flag=="1"){
//					manageViewModel.gridDataTable.setSimpleData(data.resultList);
//					manageViewModel.gridDataTable.totalRow(data.rowsCount);
//					manageViewModel.gridDataTable.totalPages(data.pageCount);
//					manageViewModel.gridDataTable.setRowUnSelect(0);
//				}
//			} 
//		});
	});
});

//刷新树
var refreshTree = function(e){
	var treeId = e.getAttribute("name");
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	treeObj.expandAll(false);
	treeObj.checkAllNodes(false);
	treeObj.refresh();
};
