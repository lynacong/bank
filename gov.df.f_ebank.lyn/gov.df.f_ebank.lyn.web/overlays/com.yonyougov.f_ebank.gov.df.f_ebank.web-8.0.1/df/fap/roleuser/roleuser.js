require(['jquery', 'knockout', 'bootstrap', 'uui','ip','tree','grid','director'],function ($, ko) {
	window.ko = ko;
	var roleid = null;
	var menuTree = {};
	var menuViewModel = {
			data: ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						if(node.pid != "0" && node.pid != ""){
							var tokenid = ip.getTokenId();
							roleId = node.id;
							$.ajax({
								url: "/df/rolemenu/usertree.do?tokenid=" + tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"roleid":roleId,"ajax":"noCache"},
								success: function (data) {
									menuViewModel.treeDataTable1.setSimpleData(data.treedata);
								}
							});
						}else{
							roleId = "";
							menuViewModel.treeDataTable1.setSimpleData("");
						}
					}
				}
			},
			treeSetting1:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						
					}
				}
			},
			treeDataTable: new u.DataTable({
				meta: {
					'id': {
						'value':""
					},
					'pid': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			treeDataTable1: new u.DataTable({
				meta: {
					'user_id': {
						'value':""
					},
					'name': {
						'value':""
					},
					'parent_id':{
						'value':""
					}
				}
			}),
			treeDataTable2: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'roletype': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
	}
	menuViewModel.getInitData = function(){
		var tokenid = ip.getTokenId();
		$.ajax({
			url: "/df/rolemenu/initTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				menuViewModel.treeDataTable.setSimpleData(data.roleDetail);
				var data_tree = $("#robtnRoleTree1")[0]['u-meta'].tree;
				var node = data_tree.getNodes();
				data_tree.expandNode(node[0],true,false,true);
				menuTree = data.dataDetail;
				
			}
		});

	}
	

	var val="";
	quickQuery = function (){  
		var user_write = $("#quickquery").val();
		if(val == user_write){
			return;
		}
		val = user_write
		var data_tree = $("#robtnRoleTree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);
		$("#quickquery").focus();
		i=1;
	}
	var i = 0;
	menuTreeNext = function (){
		var user_write = $("#quickquery").val();
		var data_tree = $("#robtnRoleTree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(i < search_nodes.length){
			data_tree.selectNode(search_nodes[i++]);
		}else{
			i = 0;
			ip.ipInfoJump("最后一个");
		}
		$("#quickquery").focus();
	}

	var val1 = "";
	quickQuery1 = function (){  
		var user_write = $("#quickquery1").val();
		if(val1 == user_write){
			return;
		}
		val1 = user_write
		var data_tree = $("#robtnRoleTree2")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);
		$("#quickquery1").focus();
		j = 1;
	}
	var j = 0;
	menuTreeNext1 = function (){
		var user_write = $("#quickquery1").val();
		var data_tree = $("#robtnRoleTree2")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(j < search_nodes.length){
			data_tree.selectNode(search_nodes[j++]);
		}else{
			j = 0;
			ip.ipInfoJump("最后一个");
		}
		$("#quickquery1").focus();
	}

	

	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		menuViewModel.getInitData();
	});
});
