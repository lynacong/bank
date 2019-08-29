/*
 * 经济分类配置
 * 2017-10-11
 * zhongyp
 */
require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'],function ($, ko) {
	window.ko = ko;
	var viewModel = {
			data: ko.observable({}),
			expecoTreeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						viewModel.getExpecoRelations();
						
					}
				}
			},
			agencyKindTreeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						viewModel.getExpecoRelations();
					}
				}
			},
			agencyExpecoTreeSetting:{
				view:{
					showLine:false,
					selectedMulti:false
				},
				check: {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "ps", "N": "ps" }
				},
				callback:{
					onClick:function(e,id,node){
						
					}
				}
			},
			expecoTreeDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						
					},
					'chr_name': {
						
					},
					'parent_id':{
						
					}
				}
			}),
			agencyKindTreeDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						
					},
					'chr_name': {
						
					},
					'parent_id':{
						
					}
				}
			}),
			agencyExpecoTreeDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						
					},
					'chr_name': {
						
					},
					'parent_id':{
						
					}
				}
			}),
	};
	/*
	 * 获取经济分类树
	 * 
	 */
	viewModel.getGovExpecoList = function(){
		$.ajax({
			url:"/df/expecoConfig/getGovExpecoList.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			dataType:"json",
			type:"POST",
			success: function(data){
				viewModel.expecoTreeDataTable.setSimpleData(data);
			}
		});
	};
	/*
	 * 获取预算单位性质
	 * 
	 */
	viewModel.getAgencyKindList = function(){
		$.ajax({
			url:"/df/expecoConfig/getAgencyKindList.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			dataType:"json",
			type:"POST",
			success: function(data){
				viewModel.agencyKindTreeDataTable.setSimpleData(data);
			}
		});
	};
	
	/*
	 * 获取部门经济分类
	 * 
	 */
	
	viewModel.getAgencyExpecoList = function(){
		$.ajax({
			url:"/df/expecoConfig/getAgencyExpecoList.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			dataType:"json",
			type:"POST",
			success: function(data){
				viewModel.agencyExpecoTreeDataTable.setSimpleData(data);
			}
		});
	};
	/*
	 * 获取关联关系
	 * 
	 */
	viewModel.getExpecoRelations = function(){
		var treeObj = $.fn.zTree.getZTreeObj("govExpecoTree");
		var nodes = treeObj.getSelectedNodes();
		var agencyKindTreeObj = $.fn.zTree.getZTreeObj("agencyKindTree");
		var kinds = agencyKindTreeObj.getSelectedNodes();
		var agencyExpecoTreeObj = $.fn.zTree.getZTreeObj("agencyExpecoTree");
		if(nodes.length>0&&kinds.length>0){
			var expeco = nodes[0].chr_id;
			var kind = kinds[0].chr_id;
			agencyExpecoTreeObj.checkAllNodes(false);
			$.ajax({
				url:"/df/expecoConfig/getExpecoRelations.do?tokenid=" + tokenid,
				data:{"ajax":"nocache","expeco":expeco,"kind":kind},
				dataType:"json",
				type:"POST",
				success: function(data){
					for(var i=0;i<data.length;i++){
						
						var obj = agencyExpecoTreeObj.getNodeByParam("id", data[i].expeco_id, null);
						if(obj.isParent){
							
						}else{
							
							agencyExpecoTreeObj.checkNode(obj, true, true);
						}
					}
				}
			});
		}
	};
	/*
	 * 保存关联关系
	 * 
	 */
	viewModel.saveRelations = function(){
		var treeObj = $.fn.zTree.getZTreeObj("govExpecoTree");
		var nodes = treeObj.getSelectedNodes();
		var agencyKindTreeObj = $.fn.zTree.getZTreeObj("agencyKindTree");
		var kinds = agencyKindTreeObj.getSelectedNodes();
		var agencyExpecoTreeObj = $.fn.zTree.getZTreeObj("agencyExpecoTree");
		if(nodes.length>0&&kinds.length>0){
			var expeco_id = nodes[0].chr_id;
			var kind_id = kinds[0].chr_id;
			var expeco_name = nodes[0].chr_name;
			var kind_name = kinds[0].chr_name;
			var relations = agencyExpecoTreeObj.getCheckedNodes(true);
			var json = [];
			for(var i=0;i<relations.length;i++){
				var array = {"chr_id":relations[i].chr_id,"chr_name":relations[i].chr_name};
				json.push(array);
			}
			$.ajax({
				url:"/df/expecoConfig/saveRelations.do?tokenid=" + tokenid,
				data:{"ajax":"nocache","expeco_id":expeco_id,"kind_id":kind_id,"expeco_name":expeco_name,"kind_name":kind_name,"relations":JSON.stringify(json)},
				dataType:"json",
				type:"POST",
				success: function(data){
					ip.ipInfoJump(data[0].msg);
				}
			});
			
		}else{
			ip.ipInfoJump("请选中政府经济分类与单位性质！");
		}
		
	};
	
	
	viewModel.initPage = function(){
		viewModel.getGovExpecoList();
		viewModel.getAgencyKindList();
		viewModel.getAgencyExpecoList();
	};
	var tokenid;
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: viewModel
		});
		tokenid = ip.getTokenId();
		viewModel.initPage();
	});
});