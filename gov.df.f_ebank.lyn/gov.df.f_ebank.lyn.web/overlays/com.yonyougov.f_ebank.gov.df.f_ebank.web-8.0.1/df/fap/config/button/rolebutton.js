require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'],function ($, ko) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	var roleid = null;
	var guid = null;
	var status_id = null;
	showOrder = null;
	var menuViewModel = {
			data: ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						menuViewModel.treeDataTable3.setSimpleData("");
						menuViewModel.treeDataTable4.setSimpleData("");
						$("#statue_check").hide();
						if(!node.isParent){
							var guid = node.id;
							roleid =guid;
							var tokenid = ip.getTokenId();
							$.ajax({
								url: "/df/menu/getbyrole.do?tokenid="+tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"guid":guid,"tokenId":tokenid ,"ajax":"noCache"},
								success: function (data) {
									for(var i=0;i<data.mapMenu.length;i++){
										data.mapMenu[i].url = null;
									}
									menuViewModel.treeDataTable1.setSimpleData(data.mapMenu);
									var data_tree = $("#robtnRoleTree2")[0]['u-meta'].tree;
									var nodes  = data_tree.getNodes();
									data_tree.expandNode(nodes[0], true, false, true);
								}
							});

						}else{
							menuViewModel.treeDataTable1.setSimpleData("");
							menuViewModel.treeDataTable3.setSimpleData("");
							menuViewModel.treeDataTable4.setSimpleData("");
							$("#statue_check").hide();
						}
					}
				}
			},
			treeSetting1:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						if(!node.isParent){
							guid = node.id;
							var tokenid = ip.getTokenId();
							$.ajax({
								url: "/df/menu/menuStatusTree.do?tokenid="+tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"menu_id":guid,"role_id":roleid,"ajax":"noCache"},
								success: function (data) {
									var statustree = data.statree;
									menuViewModel.treeDataTable3.setSimpleData(statustree);
									menuViewModel.treeDataTable4.setSimpleData("");
									$("#statue_check").hide();
								}
							});

						}else{
							menuViewModel.treeDataTable3.setSimpleData("");
							menuViewModel.treeDataTable4.setSimpleData("");
							$("#statue_check").hide();
						}
					}
				}
			},
			treeSetting2:{
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
						if(!node.isParent){
							status_id = node.id;
							$.ajax({
								url: "/df/menu/BtnCheck.do?tokenid="+tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"menu_id":guid,"role_id":roleid,"status_id":status_id,"ajax":"noCache"},
								success: function (data) {
									menuViewModel.treeDataTable4.setSimpleData(data.btncheck);
									$("#statue_check").show();
									var statueCheck = data.showright;
									if(statueCheck.length > 0){
										if(statueCheck[0].show_right === "0"){
											$("input[name='optionsRadios1']").eq(1).prop("checked", true);
										}else{
											$("input[name='optionsRadios1']").eq(0).prop("checked", true);
										}
									}else{
										$("input[name='optionsRadios1']").eq(0).prop("checked", true);
									}
								}
							});
						}
					},
					onCheck: function(event, treeId, treeNode){
						var flag = treeNode.checked;
						var status_id = treeNode.status_id;
						if(flag == true){
							$.ajax({
								url: "/df/menu/insertmenuStatus.do?tokenid="+tokenid,
								type: 'POST',
								dataType: 'json',
								data: {"menu_id":guid,"role_id":roleid,"status_id":status_id,"ajax":"noCache"},
								success: function (data) {

								}
							});
						}else {
							$.ajax({
								url: "/df/menu/delmenuStatus.do?tokenid="+tokenid,
								type: 'POST',
								dataType: 'json',
								data: {"menu_id":guid,"role_id":roleid,"status_id":status_id,"ajax":"noCache"},
								success: function (data) {

								}
							});
						}
					}
				}
			},
			treeSetting4:{
				view:{
					showLine:false,
					selectedMulti:false
				},
				check: {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "ps", "N": "ps" }
				},
				/*edit: {
					enable: true,
					drag:{
						prev: true,
						next: true,
						inner: false
					}
				},*/
				callback: {
					onCheck: function(event, treeId, treeNode){
						var tokenid = ip.getTokenId();
						var action_id = treeNode.action_id;
						var checked = treeNode.checked;
						var treeObj = $.fn.zTree.getZTreeObj(treeId);
						var checkNode = treeObj.getCheckedNodes(true);
						showOrder = checkNode.length;
						if(checked == true){
							$.ajax({
								url: "/df/menu/insertBtnCheck.do?tokenid=" + tokenid,
								type: 'post',
								dataType: 'json',
								data: {"action_id":action_id,"menu_id":guid,"role_id":roleid,"status_id":status_id,"show_order": showOrder,"ajax":"noCache"},
								success: function (data) {

								}
							});
						}else{
							$.ajax({
								url: "/df/menu/delBtnCheck.do?tokenid=" + tokenid,
								type: 'post',
								dataType: 'json',
								data: {"action_id":action_id,"menu_id":guid,"role_id":roleid,"status_id":status_id,"ajax":"noCache"},
								success: function (data) {
								}
							});
						}
					},
					onDrop: function(event, treeId, treeNodes, targetNode, moveType) {
						alert(treeNodes[0].name + targetNode.name);
						var data = [];
						var item1 = {};
						var item2 = {};
						item1["button_id"] = treeNodes[0].action_id;
						item1["menu_id"] = guid;
						item1["role_id"] = roleid;
						item1["status_id"] = status_id;
						item1["show_order"] = targetNode.show_order; 
						data.push(item1);
						item2["button_id"] = targetNode.action_id;
						item2["menu_id"] = guid;
						item2["role_id"] = roleid;
						item2["status_id"] = status_id;
						item2["show_order"] = treeNodes[0].show_order;

						data.push(item2);
						$.ajax({
							url: "/df/menu/updateMenuStatusBtn.do?tokenid=" + tokenid,
							type: 'post',
							dataType: 'json',
							data: {
								"dropData": JSON.stringify(data),
								"ajax":"noCache"
							},
							success: function (data) {
							}
						});

					},
					/*beforeDrop: function(treeId, treeNodes, targetNode, moveType){
						if(treeNodes[0].checked && targetNode.checked){
							return true;
						}else{
							ip.ipInfoJump("勾选的节点之间才能拖动", "error");
							return false;
						}
					}*/
				}
			},
			treeDataTable: new u.DataTable({
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
			treeDataTable1: new u.DataTable({
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
			treeDataTable3: new u.DataTable({
				meta: {
					'status_id': {
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
			treeDataTable4:new u.DataTable({
				meta: {
					'action_id': {
						'value':""
					},
					'pid': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			})

	}
	menuViewModel.getInitData = function(){
		var tokenid = ip.getTokenId();
		$.ajax({
			url: "/df/role/getAllRole.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: tokenid,
			success: function (data) {
				var treedata = ip.treeJump(data.rolelist);
				menuViewModel.treeDataTable.setSimpleData(treedata);
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
	check1 = function () {
		$.ajax({
			url: "/df/menu/updateMenuStatueRight.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"type":"1","menu_id":guid,"role_id":roleid,"status_id":status_id,"ajax":"noCache"},
			success: function (data) {

			}
		});
	}
	check2 = function () {
		$.ajax({
			url: "/df/menu/updateMenuStatueRight.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"type":"0","menu_id":guid,"role_id":roleid,"status_id":status_id,"ajax":"noCache"},
			success: function (data) {

			}
		});
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
