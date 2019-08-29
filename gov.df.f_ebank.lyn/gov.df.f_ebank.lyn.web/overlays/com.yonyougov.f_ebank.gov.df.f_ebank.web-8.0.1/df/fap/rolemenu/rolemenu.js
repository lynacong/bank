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
							menuViewModel.treeDataTable1.setSimpleData(menuTree, {
								unSelect: true
							});
							var allRoletreeObj = $.fn.zTree.getZTreeObj("robtnRoleTree2");
							$.ajax({
								url: "/df/rolemenu/TreeChecked.do?tokenid=" + tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"roleid":roleId,"ajax":"noCache"},
								success: function (data) {
									var dataArray = data.dateDetail;
									for(var k = 0 ; k < dataArray.length ; k++){
										var id = dataArray[k].menu_id;
										var search_nodes = allRoletreeObj.getNodesByParam("id",id,null);
										if(search_nodes.length > 0){
											if(!search_nodes[0].isParent){
												allRoletreeObj.checkNode(search_nodes[0], true, true);
											}
											allRoletreeObj.expandNode(search_nodes[0], true, false, false, false);
											search_nodes[0].checkedOld = true;
										}
									}
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
					showLine:false,
					selectedMulti:false
				},
				check: {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "ps", "N": "ps" }
				},
				callback:{
					onCheck: zTreeOnCheck //纭槸涓嶈鐢ㄤ繚瀛樻寜閽紝浣犳槸娌℃湁鍙嶆倲鐨勬満浼氱殑 ^-^
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
					'menu_id': {
						'value':""
					},
					'menu_name': {
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
	menuViewModel.save = function(){
		var tokenid = ip.getTokenId();
		var treeObj = $.fn.zTree.getZTreeObj("robtnRoleTree2");
		var checkNodes  = treeObj.getCheckedNodes();
		if(roleId == ""){
			ip.ipInfoJump("请选择角色","info");
			return;
		}
		var menuid = "";
		for(var i = 0 ; i <checkNodes.length ; i++ ){
			menuid = checkNodes[i].menu_id+","+menuid;
		}
		ip.warnJumpMsg("确定要保存吗?","okDelRolebtn","cancle");
		$("#okDelRolebtn").click(function(){
			$.ajax({
				url: "/df/rolemenu/updateRolemenu.do?tokenid=" + tokenid,
				type: 'POST',
				dataType: 'json',
				data: {"roleid":roleId,"menuid":menuid,"ajax":"noCache"},
				success: function (data) {
					menuViewModel.treeDataTable1.setSimpleData(menuTree);
					$.ajax({
						url: "/df/rolemenu/TreeChecked.do?tokenid=" + tokenid,
						type: 'GET',
						dataType: 'json',
						data: {"roleid":roleId,"ajax":"noCache"},
						success: function (data) {
							var dataArray = data.dateDetail;
							for(var k = 0 ; k < dataArray.length ; k++){
								var id = dataArray[k].menu_id;
								var allRoletreeObj = $.fn.zTree.getZTreeObj("robtnRoleTree2");
								var search_nodes = allRoletreeObj.getNodesByParam("id",id,null);
								if(search_nodes.length > 0){
									if(!search_nodes[0].isParent){
										allRoletreeObj.checkNode(search_nodes[0], true, true);
									}
								}
							}
						}
					});
				}
			});
			$("#config-modal").remove();
		});
		$(".cancle").click(function(){
			$("#config-modal").remove();
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

	function zTreeOnCheck(event, treeId, treeNode) {
		var tokenid = ip.getTokenId();
		var treeObj = $.fn.zTree.getZTreeObj("robtnRoleTree2");
		var nodes = treeObj.getChangeCheckedNodes();
		var menuid = "";
		var checked = "";
		for(var i = 0 ; i < nodes.length ; i++){
		   menuid = nodes[i].menu_id+","+menuid;
		   nodes[i].checkedOld =  nodes[i].checked;
		   if(nodes[i].checked){
			   checked = "1";
		   }else{
			   checked = "0";
		   }
		}
		$.ajax({
			url: "/df/rolemenu/updateRolemenu.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"roleid":roleId,"menu_id":menuid,"ajax":"noCache","checked":checked},
			success: function (data) {
				
			}
		})
	};

	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		menuViewModel.getInitData();
	});
});
