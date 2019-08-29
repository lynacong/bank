require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var menuGuid = null;
	var ui_guid = null;
	var menuName = null;
	var tokenid = ip.getTokenId();
	var menuViewModel = {
			data : ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						if(!node.isParent){
							var guid = node.id;
							menuName = node.name;
							$.ajax({
								url: "/df/view/getMenuView.do?tokenid="+tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"guid":guid,"ajax":"noCache"},
								success: function (data) {
									menuGuid = guid;
									
									$("#statusoptions").html("");
									menuViewModel.buttonparamDataTable.setSimpleData("");
									initDropdownList();
									
									menuViewModel.gridDataTable.removeAllRows();
									menuViewModel.gridDataTableButton.removeAllRows();
									menuViewModel.gridDataTable.setSimpleData(data.viewList);
									menuViewModel.gridDataTableButton.setSimpleData(data.btnList);
									menuViewModel.gridDataTable.setRowUnSelect(0);
									menuViewModel.gridDataTableButton.setRowUnSelect(0);
									menuViewModel.statueDataTable.removeAllRows();
									menuViewModel.statueDataTable.setSimpleData(data.statusgrid);
									menuViewModel.statueDataTable.setRowUnSelect(0);
									menuViewModel.buttonDataTable.removeAllRows();
									menuViewModel.buttonDataTable.setSimpleData(data.btngrid);
									menuViewModel.buttonDataTable.setRowUnSelect(0);
									$.ajax({
										url: "/df/menu/StatuesGrid.do?tokenid="+tokenid,
										type: 'get',
										dataType: 'json',
										data: {"menu_id":menuGuid,"ajax":"noCache"},
										success: function (data) {
											menuViewModel.treeDataTable5.setSimpleData(data.statusgrid);
											menuViewModel.treeDataTable6.setSimpleData("");
										}
									});
								}
							});
							
							
						}else{
							menuGuid = null;
							menuViewModel.gridDataTable.removeAllRows();
							menuViewModel.gridDataTableButton.removeAllRows();
							menuViewModel.statueDataTable.removeAllRows();
							menuViewModel.buttonDataTable.removeAllRows();
							menuViewModel.treeDataTable5.setSimpleData("");
							menuViewModel.treeDataTable6.setSimpleData("");
							$("#statusoptions").html("");
							menuViewModel.buttonparamDataTable.setSimpleData("");
						}
					}
				}
			},
			treeSetting2:{
				view:{
					selectedMulti:false
				},
				callback:{
					onClick:function(e,id,node){
						ui_guid = node.id;
					}
				}
			},
			treeSetting3:{
				view:{
					selectedMulti:false
				},
				callback:{
					onClick:function(e,id,node){
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
				callback: {
					onCheck: function(event, treeId, treeNode){
						var tokenid = ip.getTokenId();
						var action_id = treeNode.action_id;
						var treeObj1 = $("#statusMenuTree")[0]['u-meta'].tree;
						var status_id  =  treeObj1.getSelectedNodes()[0].status_id;
						var checked = treeNode.checked;
						var treeObj = $.fn.zTree.getZTreeObj(treeId);
						var checkNode = treeObj.getCheckedNodes(true);
						showOrder = checkNode.length;
						if(checked == true){
							$.ajax({
								url: "/df/menu/insertStatueBtnCheck.do?tokenid=" + tokenid,
								type: 'post',
								dataType: 'json',
								data: {"action_id":action_id,"menu_id":menuGuid,"status_id":status_id,"ajax":"noCache"},
								success: function (data) {

								}
							});
						}else{
							$.ajax({
								url: "/df/menu/delStatueBtnCheck.do?tokenid=" + tokenid,
								type: 'post',
								dataType: 'json',
								data: {"action_id":action_id,"menu_id":menuGuid,"status_id":status_id,"ajax":"noCache"},
								success: function (data) {
								}
							});
						}
					}
				}
			},
			treeSetting5:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						var status_id = node.status_id;
						$.ajax({
							url: "/df/menu/BtnCheck1.do?tokenid="+tokenid,
							type: 'get',
							dataType: 'json',
							data: {"menu_id":menuGuid,"status_id":status_id,"ajax":"noCache"},
							success: function (data) {
								menuViewModel.treeDataTable6.setSimpleData(data.btncheck);
							}
						});
					}
				}
			},
			treeDataTable: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'name':{
						'value':""
					},
					'isleaf':{
						'value':""
					}
				}
			}),
			treeDataTable1: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'name':{
						'value':""
					},
					'isleaf':{
						'value':""
					}
				}
			}),
			treeDataTable2: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'name':{
						'value':""
					},
					'isleaf':{
						'value':""
					}
				}
			}),
			treeDataTable3: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			treeDataTable4: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			treeDataTable5: new u.DataTable({
				meta: {
					'status_id': {
						'value':""
					},
					'pid': {
						'value':""
					},
					'show_name':{
						'value':""
					}
				}
			}),
			treeDataTable6:new u.DataTable({
				meta: {
					'action_id': {
						'value':""
					},
					'pid': {
						'value':""
					},
					'show_name':{
						'value':""
					}
				}
			}),
			buttonparamDataTable: new u.DataTable({
				meta: {
					'action_id':{},
					'show_name':{},
					'button_param':{},
				}
			}),
			comItems: [{
				"value": "001",
				"name": "录入视图"
			}, {
				"value": "002",
				"name": "列表视图"
			}, {
				"value": "003",
				"name": "查询视图"
			}, {
				"value": "004",
				"name": "详细显示视图"
			}, {
				"value": "005",
				"name": "查询视图"
			}, {
				"value": "101",
				"name": "路由视图"
			}],
			comItems1: [{
				"value": "0",
				"name": "不显示"
			}, {
				"value": "1",
				"name": "显示"
			}],    

			treeViewTable: new u.DataTable({
				meta: {
					'ui_id': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'uiname':{
						'value':""
					}
				}
			}),
			gridDataTable: new u.DataTable({
				meta: {
					'viewcode':{},
					'viewtype':{},
					'viewname':{},
					'orders':{},
					'keyword':{},
					'guid':{}
				}
			}),
			gridDataTableButton: new u.DataTable({
				meta: {
					'btn_id':{},
					'actioncode':{},
					'actionname':{},
					'buttonname':{}
				}
			}),
			statueDataTable:new u.DataTable({
				meta: {
					'status_name':{},
					'status_code':{},
					'show_name':{},
					'show_order':{},
					'menu_name':{}
				}
			}),
			buttonDataTable:new u.DataTable({
				meta: {
					'remark':{},
					'action_code':{},
					'action_name':{},
					'show_name':{},
					'show_order':{},
					'param':{},
					'func_name':{}
				}
			})
	};
	
	menuViewModel.getInitData = function () {
		$.ajax({
			url: "/df/menu/getAllMenu.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				for(var i=0;i<data.mapMenu.length;i++){
					data.mapMenu[i].url = null;
				}
				var treedata = ip.treeJump(data.mapMenu);
				var btntree = data.btntree;
				menuViewModel.treeDataTable.setSimpleData(treedata);
				menuViewModel.treeDataTable1.setSimpleData(treedata);
				menuViewModel.treeDataTable2.setSimpleData(treedata);
				menuViewModel.treeDataTable3.setSimpleData(btntree);
				menuViewModel.treeDataTable4.setSimpleData(btntree);
				var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
				var nodes  = data_tree.getNodes();
				data_tree.expandNode(nodes[0], true, false, true);
				var dataselect = data.status;
				var ophtml = "";
				for(var k = 0 ; k < dataselect.length ; k++){
					if(dataselect[k].sys_id != "0")
						ophtml = ophtml + "<option value='"+dataselect[k].status_id+"'>"+dataselect[k].name + "</option>"
				}
				$("#status-select").empty();
				$("#status-select1").empty();
				$("#status-select").append(ophtml);
				$("#status-select1").append(ophtml);
			} 
		});
	}

	var val = "";
	quickQuery = function (){  
		var user_write = $("#quickquery").val();
		if(val == user_write){
			return;
		}
		val = user_write;
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].id;
			}else{
				menuGuid = null;
			}
		}
		$("#quickquery").focus();
		i = 1;

	}

	var i = 0;
	menuTreeNext = function (){
		var user_write = $("#quickquery").val();
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(i < search_nodes.length){
			data_tree.selectNode(search_nodes[i++]);
		}else{
			i = 0;
			ip.ipInfoJump("最后一个","info");
		}
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].id;
			}else{
				menuGuid = null;
			}
		}
		$("#quickquery").focus();
	}

	menuViewModel.viewQuery = function (){  
		var user_write = $("#addviewInput").val();
		var data_tree = $("#menuConfigTree2")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);	
		if(data_tree.getSelectedNodes().length>0){
			ui_guid = data_tree.getSelectedNodes()[0].id;
		}
	}

	var j = 1;
	menuViewModel.viewNext = function (){
		var user_write = $("#addviewInput").val();
		var data_tree = $("#menuConfigTree2")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(data_tree.getSelectedNodes().length>0){
			ui_guid = data_tree.getSelectedNodes()[0].id;
			if(j < search_nodes.length){
				data_tree.selectNode(search_nodes[j++]);
			}else{
				j = 1;
			}
		}
	};

	menuViewModel.gridChange=function (obj){
		var status_id = $('#statusoptions').val();
		var action_id=obj.gridObj.editRowObj.action_id;
		var button_param = obj.newValue;
		if(menuGuid != null){
			$.ajax({
				url: "/df/menu/BtnParamSave.do?tokenid="+tokenid,
				type: 'get',
				dataType: 'json',
				data: {"menu_id":menuGuid,"status_id":status_id,"action_id":action_id,"button_param":button_param,"ajax":"noCache"},
				success: function (data) {
				}
			});
		}
		
	};
	menuViewModel.belmenu = function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		$("#menuguid").val(guid);
		$("#drDisplayModal").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.drCloseButton = function (){
		$("#drDisplayModal").modal('hide');
	}

	menuViewModel.belmenu1 = function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		$("#menuguid1").val(guid);
		$("#drDisplayModal1").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.btnmenu1 = function (){
		$("#btnDisplayModal1").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.btnmenu = function (){
		$("#btnDisplayModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.drCloseButton1 = function (){
		$("#drDisplayModal1").modal('hide');
	}
	menuViewModel.btnCloseButton1 = function (){
		$("#btnDisplayModal").modal('hide');
	}
	menuViewModel.btnCloseButton2 = function (){
		$("#btnDisplayModal1").modal('hide');
	}
	menuViewModel.menuCheckButton = function (){
		var guid = $("#menuguid").val();
		var data_tree = $("#menuTree")[0]['u-meta'].tree;
		var menuGuid = "";
		var menuname = "";
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].guid;
				menuname = data_tree.getSelectedNodes()[0].name;
			}else{
				ip.ipInfoJump("请选择非父级菜单","info");
				return;
			}
		}else{
			ip.ipInfoJump("请选择菜单","info");
			return;
		}
		if(menuGuid == guid){
			//ip.ipInfoJump("请选择其他菜单","info");
			//return;
		}
		$("#belonemenu").val(menuname);
		$("#belonemenu-h").val(menuGuid);
		$("#drDisplayModal").modal('hide');
	}
	menuViewModel.btnCheckButton1 = function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		var data_tree = $("#btnTree1")[0]['u-meta'].tree;
		var btnid = "";
		var btnname = "";
		if(data_tree.getSelectedNodes().length>0){
			var pid = data_tree.getSelectedNodes()[0].parentid;
			if(pid == "0"){
				ip.ipInfoJump("该项为子系统，请选择按钮","info");
				return;
			}else{
				btnid = data_tree.getSelectedNodes()[0].guid;
				btnname = data_tree.getSelectedNodes()[0].name;
				$.ajax({
					url: "/df/menu/BtnExist.do?tokenid="+tokenid,
					type: 'GET',
					dataType: 'json',
					data: {"action_id":btnid,"menu_id":guid,"ajax":"noCache"},
					success: function (data) {
						var flag = data.flag;
						if(flag == "0"){
							ip.ipInfoJump("该按钮已存在，请选择其他按钮","info");
							return;
						}else{
							$("#btnmenu").val(btnname);
							$("#btnmenu-h").val(btnid);
							$("#btnDisplayModal").modal("hide");
						}
					}
				}); 
			}
		}
	}

	menuViewModel.btnCheckButton2 = function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		var data_tree = $("#btnTree2")[0]['u-meta'].tree;
		var btnid = "";
		var btnname = "";
		if(data_tree.getSelectedNodes().length>0){
			var pid = data_tree.getSelectedNodes()[0].parentid;
			if(pid == "0"){
				ip.ipInfoJump("该项为子系统，请选择按钮","info");
				return;
			}else{
				btnid = data_tree.getSelectedNodes()[0].guid;
				btnname = data_tree.getSelectedNodes()[0].name;
				$.ajax({
					url: "/df/menu/BtnExist.do?tokenid="+tokenid,
					type: 'GET',
					dataType: 'json',
					data: {"action_id":btnid,"menu_id":guid,"ajax":"noCache"},
					success: function (data) {
						var flag = data.flag;
						if(flag == "0"){
							ip.ipInfoJump("该按钮已存在，请选择其他按钮","info");
							return;
						}else{
							$("#btnmenu1").val(btnname);
							$("#btnmenu1-h").val(btnid);
							$("#btnDisplayModal1").modal("hide");
						}
					}
				}); 
			}
		}
	}

	menuViewModel.menuCheckButton1 = function (){
		var guid = $("#menuguid1").val();
		var data_tree = $("#menuTree1")[0]['u-meta'].tree;
		var menuGuid = "";
		var menuname = "";
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].guid;
				menuname = data_tree.getSelectedNodes()[0].name;
			}else{
				ip.ipInfoJump("请选择非父级菜单","info");
				return;
			}
		}else{
			ip.ipInfoJump("请选择菜单","info");
			return;
		}
		if(menuGuid == guid){
			//ip.ipInfoJump("请选择其他菜单","info");
			//return;
		}
		$("#belonemenu1").val(menuname);
		$("#belonemenu1-h").val(menuGuid);
		$("#drDisplayModal1").modal('hide');
	}
	menuViewModel.addviewSubmit = function (){
		if(menuGuid != null){
			$("#orderInput").val("");
			$("#keyInput").val("");
			$("#addviewInput").val("");
			$("#addviewModal").modal({backdrop: 'static', keyboard: false});
			$.ajax({
				url: "/df/view/getViewTree.do?tokenid="+tokenid,
				type: 'GET',
				dataType: 'json',
				data: {"tokenId":tokenid,"ajax":"noCache"},
				success: function (data) {
					menuViewModel.treeViewTable.setSimpleData(data.viewlist);
				}
			}); 
		}else{
			ip.ipInfoJump("请选择左侧菜单树子节点后再进行新增","info");
		}
	}

	menuViewModel.addbtnSubmit  = function (){
		if(menuGuid != null){
			$("#belongMenu").val(menuName);
			$("#btnCode").val("");
			$("#btnName").val("");
			$("#btnRemark").val("1");
			$("#addButtonModal").modal({backdrop: 'static', keyboard: false});
		}else{
			ip.ipInfoJump("请选择左侧菜单树子节点后再进行新增","info");
		}
	}
	menuViewModel.addstatusSubmit = function (){
		if(menuGuid != null){
			$("#belongMenu1").val(menuName);
			$("#status").val("");
			$("#show_name").val("");
			$("#belonemenu").val("");
			$("#belonemenu-h").val("");
			$("#show_order").val("");
			$("#addStatusModal").modal({backdrop: 'static', keyboard: false});
		}else{
			ip.ipInfoJump("请选择左侧菜单树子节点后再进行新增","info");
		}
	}
	menuViewModel.editstatusSubmit= function (){
		var selRows = menuViewModel.statueDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要修改的状态","info");
			return;
		}
		if(selRows.length > 1){
			ip.ipInfoJump("请不要选择一个以上状态","info");
			return;
		}
		$("#belongMenu2").val(menuName);
		var guid =  selRows[0].data.guid.value;
		var menu_name =  selRows[0].data.menu_name.value;
		var belone_menu =  selRows[0].data.belone_menu.value;
		var status_id =  selRows[0].data.status_id.value;
		var show_name =  selRows[0].data.show_name.value;
		var show_order =  selRows[0].data.show_order.value;
		$("#status-select1").val(status_id);
		$("#belonemenu1").val(menu_name);
		$("#belonemenu1-h").val(belone_menu);
		$("#show_name1").val(show_name);
		$("#show_order1").val(show_order);
		$("#guid2").val(guid);
		$("#editStatusModal").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.addbtn1Submit  = function (){
		if(menuGuid != null){
			$("#belongMenu4").val(menuName);
			$("#btnmenu").val("");
			$("#btnmenu-h").val("");
			$("show_name2").val("");
			$("show_order2").val("");
			$("#addbtnModal").modal({backdrop: 'static', keyboard: false});
		}else{
			ip.ipInfoJump("请选择左侧菜单树子节点后再进行新增","info");
		}
	}
	menuViewModel.editbtn1Submit = function (){
		var selRows = menuViewModel.buttonDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要修改的按钮","info");
			return;
		}
		if(selRows.length > 1){
			ip.ipInfoJump("请不要选择一个以上按钮","info");
			return;
		}
		$("#belongMenu5").val(menuName);
		var chr_id =  selRows[0].data.chr_id.value;
		var action_name =  selRows[0].data.action_name.value;
		var action_id =  selRows[0].data.action_id.value;
		var show_name =  selRows[0].data.show_name.value;
		var show_order =  selRows[0].data.show_order.value;
		$("#show_name3").val(show_name);
		$("#show_order3").val(show_order);
		$("#btnmenu1").val(action_name);
		$("#btnmenu1-h").val(action_id);
		$("#guid3").val(chr_id);
		$("#editbtnModal").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.delviewSubmit = function (){
		var selRows = menuViewModel.gridDataTable.getSelectedRows(); 
		if(selRows.length == 0){
			ip.ipInfoJump("请选择删除的视图","info");
			return;
		}
		ip.warnJumpMsg("真的要删除吗?","sid1","cCla1");
		$("#sid1").on("click",function(){
			$("#config-modal").remove();
			var selGuid = "";
			for(var sel = 0 ; sel < selRows.length ;sel++){
				selGuid =  selRows[sel].data.guid.value + "," +selGuid;
			}
			$.ajax({
				url: "/df/view/delMenuView.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"selguid":selGuid,"menuid":menuGuid,"ajax":"noCache"},
				success: function (data) {
					if(data.flag == 1){
						var num = data.num;
						ip.ipInfoJump("成功删除"+num+"条数据!","success");
					}else{
						ip.ipInfoJump("删除失败","error");
					}
					$.ajax({
						url: "/df/view/getMenuView.do?tokenid="+tokenid,
						type: 'GET',
						dataType: 'json',
						data: {"guid":menuGuid,"tokenId":tokenid,"ajax":"noCache"},
						success: function (data) {
							menuViewModel.gridDataTable.removeAllRows();
							menuViewModel.gridDataTable.setSimpleData(data.viewList);
							menuViewModel.gridDataTable.setRowUnSelect(0);
						}
					});
				}
			});
		});

		$(".cCla1").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})
	}
	menuViewModel.delbtnSubmit = function (){
		var selRows = menuViewModel.gridDataTableButton.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择删除的资源","info");
			return;
		}
		ip.warnJumpMsg("真的要删除吗?","sid","cCla");
		$("#sid").on("click",function(){
			$("#config-modal").remove();
			var selGuid = "";
			for(var sel = 0 ; sel < selRows.length ;sel++){
				selGuid =  selRows[sel].data.btn_id.value + "," +selGuid;
			}
			$.ajax({
				url: "/df/res/delResMenu.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"selguid":selGuid,"ajax":"noCache"},
				success: function (data) {
					if(data.flag == 1){
						var num = data.num;
						ip.ipInfoJump("成功删除"+num+"条数据!","success");
					}else{
						ip.ipInfoJump("删除失败!","error");
					}
					$.ajax({
						url: "/df/view/getMenuView.do?tokenid="+tokenid,
						type: 'GET',
						dataType: 'json',
						data: {"guid":menuGuid,"tokenId":tokenid,"ajax":"noCache"},
						success: function (data) {
							menuViewModel.gridDataTableButton.removeAllRows();
							menuViewModel.gridDataTableButton.setSimpleData(data.btnList);
							menuViewModel.gridDataTableButton.setRowUnSelect(0);
						}
					});
				}
			});
		});

		$(".cCla").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})

	}

	menuViewModel.delstatusSubmit = function (){
		var selRows = menuViewModel.statueDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择删除的状态","info");
			return;
		}
		ip.warnJumpMsg("真的要删除吗?","sid","cCla");
		$("#sid").on("click",function(){
			$("#config-modal").remove();
			var guid = selRows[0].data.guid.value;
			$.ajax({
				url: "/df/menu/delStatus.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"guid":guid,"ajax":"noCache"},
				success: function (data) {
					if(data.flag == 1){
						ip.ipInfoJump("删除成功!","success");
						var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
						var menu_id  =  data_tree.getSelectedNodes()[0].guid;
						$.ajax({
							url: "/df/menu/StatuesGrid.do?tokenid="+tokenid,
							type: 'get',
							dataType: 'json',
							data: {"menu_id":menu_id,"ajax":"noCache"},
							success: function (data) {
								menuViewModel.statueDataTable.removeAllRows();
								menuViewModel.statueDataTable.setSimpleData(data.statusgrid);
								menuViewModel.statueDataTable.setRowUnSelect(0);
							}
						});
					}else{
						ip.ipInfoJump("删除失败","error");
					}

				}
			});
		});

		$(".cCla").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})

	}

	menuViewModel.delbtn1Submit = function (){
		var selRows = menuViewModel.buttonDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择删除的资源","info");
			return;
		}
		ip.warnJumpMsg("真的要删除吗?","sid","cCla");
		$("#sid").on("click",function(){
			$("#config-modal").remove();
			var selGuid = "";
			selGuid =  selRows[0].data.chr_id.value ;
			$.ajax({
				url: "/df/menu/delBtn.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"chr_id":selGuid,"menu_id":menuGuid,"ajax":"noCache"},
				success: function (data) {
					if(data.flag == 1){
						ip.ipInfoJump("删除成功!","success");
						$.ajax({
							url: "/df/menu/BtnGrid.do?tokenid="+tokenid,
							type: 'get',
							dataType: 'json',
							data: {"menu_id":menuGuid,"ajax":"noCache"},
							success: function (data) {
								menuViewModel.buttonDataTable.removeAllRows();
								menuViewModel.buttonDataTable.setSimpleData(data.btngrid);
								menuViewModel.buttonDataTable.setRowUnSelect(0);
							}
						});
					}else{
						ip.ipInfoJump("删除失败","error");
					}
				}
			});
		});

		$(".cCla").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})

	}

	menuViewModel.ensure = function (){
		if(ui_guid != null){
			var orderNum = $("#orderInput").val();
			if(orderNum == ""||orderNum==null){
				ip.ipInfoJump("请输入显示顺序","info");
				return;
			}
			var key = $("#keyInput").val();
			$.ajax({
				url: "/df/view/updateMenuView.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"tokenId":tokenid,"menuGuid":menuGuid,"ui_guid":ui_guid,"key":key,"orderNum":orderNum},
				success: function (data) {
					if(data.flag==1){
						$.ajax({
							url: "/df/view/getMenuView.do?tokenid="+tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"guid":menuGuid,"tokenId":tokenid,"ajax":"noCache"},
							success: function (data) {
								menuViewModel.gridDataTable.removeAllRows();
								menuViewModel.gridDataTable.setSimpleData(data.viewList);
								menuViewModel.gridDataTable.setRowUnSelect(0);
								$("#addviewModal").modal('hide');
								$("#orderInput").val("");
								$("#keyInput").val("");

							}
						});
					}else{
						if(data.msg=="" || data.msg==null){
							ip.ipInfoJump("保存失败！", "info");
						}else{
							ip.ipInfoJump(data.msg, "info");
						}
					}
				}
			});	
		}else{
			ip.ipInfoJump("请选择视图在进行添加","info");
		}
	}
	menuViewModel.ensure2 = function (){
		var btnCode = $("#btnCode").val();
		if(btnCode == null){
			ip.ipInfoJump("请输入按钮编码","info");
		}
		var btnName = $("#btnName").val();
		if(btnName == null){
			ip.ipInfoJump("请输入按钮名称","info");
		}
		var btnRemark = $("#btnRemark").val();
		if(btnRemark == null){
			ip.ipInfoJump("请输入资源标识","info");
		}
		$.ajax({
			url: "/df/res/updateResMenu.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"tokenId":tokenid,"btnCode":btnCode,"btnName":btnName,"btnRemark":btnRemark,"menuGuid":menuGuid,"ajax":"noCache"},
			success: function (data) {
				$.ajax({
					url: "/df/view/getMenuView.do?tokenid="+tokenid,
					type: 'GET',
					dataType: 'json',
					data: {"guid":menuGuid,"tokenId":tokenid,"ajax":"noCache"},
					success: function (data) {
						menuViewModel.gridDataTableButton.removeAllRows();
						menuViewModel.gridDataTableButton.setSimpleData(data.btnList);
						menuViewModel.gridDataTableButton.setRowUnSelect(0);
						$("#addButtonModal").modal('hide');
					}
				})
			}
		});	
	}
	menuViewModel.ensure3 =  function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		var status = $("#status-select").val();
		var belmenu =  $("#belonemenu-h").val();
		var belname =  $("#belonemenu").val();
		var show_name =  $("#show_name").val();
		var show_order =  $("#show_order").val();
		if(show_name == "" || show_name == null){
			ip.ipInfoJump("别名不可为空","info");
			return;
		}
		if(show_order == "" || show_order == null){
			ip.ipInfoJump("显示顺序不可为空","info");
			return;
		}
		$.ajax({
			url: "/df/menu/insertMenuStatues.do?tokenid="+tokenid,
			type: 'post',
			dataType: 'json',
			data: {"menu_id":guid,"status":status,"belmenu":belmenu,"belname":belname,"show_name":show_name,"show_order":show_order,"ajax":"noCache"},
			success: function (data) {
				var flag = data.flag;
				if(flag== "1"){
					ip.ipInfoJump("添加成功!","success");
					$("#addStatusModal").modal('hide');
					$.ajax({
						url: "/df/menu/StatuesGrid.do?tokenid="+tokenid,
						type: 'get',
						dataType: 'json',
						data: {"menu_id":guid,"ajax":"noCache"},
						success: function (data) {
							menuViewModel.statueDataTable.removeAllRows();
							menuViewModel.statueDataTable.setSimpleData(data.statusgrid);
							menuViewModel.statueDataTable.setRowUnSelect(0);
						}
					});
				}else{
					ip.ipInfoJump("添加失败："+data.message,"info");
				}
			}
		});
	}

	menuViewModel.ensure5 =  function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		var guid2 = $("#guid2").val();
		var status = $("#status-select1").val();
		var belmenu =  $("#belonemenu1-h").val();
		var belname =  $("#belonemenu1").val();
		var show_name =  $("#show_name1").val();
		var show_order =  $("#show_order1").val();
		if(belname == "" || belname == null){
			ip.ipInfoJump("所属菜单不可为空","info");
			return;
		}
		if(show_name == "" || show_name == null){
			ip.ipInfoJump("别名不可为空","info");
			return;
		}
		if(show_order == "" || show_order == null){
			ip.ipInfoJump("显示顺序不可为空","info");
			return;
		}
		$.ajax({
			url: "/df/menu/updateMenuStatues.do?tokenid="+tokenid,
			type: 'post',
			dataType: 'json',
			data: {"guid":guid2,"menu_id":guid,"status":status,"belmenu":belmenu,"belname":belname,"show_name":show_name,"show_order":show_order,"ajax":"noCache"},
			success: function (data) {
				var flag = data.flag;
				if(flag== "1"){
					ip.ipInfoJump("修改成功!","success");
					$("#editStatusModal").modal('hide');
					$.ajax({
						url: "/df/menu/StatuesGrid.do?tokenid="+tokenid,
						type: 'get',
						dataType: 'json',
						data: {"menu_id":guid,"ajax":"noCache"},
						success: function (data) {
							menuViewModel.statueDataTable.removeAllRows();
							menuViewModel.statueDataTable.setSimpleData(data.statusgrid);
							menuViewModel.statueDataTable.setRowUnSelect(0);
						}
					});
				}else{
					ip.ipInfoJump("修改失败："+data.message,"info");
				}
			}
		});
	}
	menuViewModel.ensure4 =  function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		var btnmenu =  $("#btnmenu-h").val();
		var show_order =  $("#show_order2").val();
		var show_name =  $("#show_name2").val();
		var btn1Remark =  $("#btn1Remark").val();
		if(btnmenu == "" || btnmenu == null){
			ip.ipInfoJump("请选择按钮","info");
			return;
		}
		if(show_order == "" || show_order == null){
			ip.ipInfoJump("显示顺序不可为空","info");
			return;
		}
		if(show_name == "" || show_name == null){
			ip.ipInfoJump("别名不可为空","info");
			return;
		}
		$.ajax({
			url: "/df/menu/insertMenuBtn.do?tokenid="+tokenid,
			type: 'post',
			dataType: 'json',
			data: {"action_id":btnmenu,"menu_id":guid,"show_order":show_order,"show_name":show_name,"remark":btn1Remark,"ajax":"noCache"},
			success: function (data) {
				var flag = data.flag;
				if(flag== "1"){
					ip.ipInfoJump("新增成功!","success");
					$("#addbtnModal").modal('hide');
					$.ajax({
						url: "/df/menu/BtnGrid.do?tokenid="+tokenid,
						type: 'get',
						dataType: 'json',
						data: {"menu_id":guid,"ajax":"noCache"},
						success: function (data) {
							menuViewModel.buttonDataTable.removeAllRows();
							menuViewModel.buttonDataTable.setSimpleData(data.btngrid);
							menuViewModel.buttonDataTable.setRowUnSelect(0);
						}
					});
				}else{
					ip.ipInfoJump("新增失败："+data.message,"info");
				}
			}
		});
	}


	menuViewModel.ensure6 =  function (){
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		var btnmenu =  $("#btnmenu1-h").val();
		var show_order =  $("#show_order3").val();
		var show_name =  $("#show_name3").val();
		var remark =  $("#btn1Remark1").val();
		var chr_id  =  $("#guid3").val();
		if(btnmenu == "" || btnmenu == null){
			ip.ipInfoJump("请选择按钮","info");
			return;
		}
		if(show_order == "" || show_order == null){
			ip.ipInfoJump("显示顺序不可为空","info");
			return;
		}
		if(show_name == "" || show_name == null){
			ip.ipInfoJump("别名不可为空","info");
			return;
		}
		$.ajax({
			url: "/df/menu/updateMenuBtn.do?tokenid="+tokenid,
			type: 'post',
			dataType: 'json',
			data: {"action_id":btnmenu,"menu_id":guid,"show_order":show_order,"show_name":show_name,"chr_id":chr_id,"remark":remark,"ajax":"noCache"},
			success: function (data) {
				var flag = data.flag;
				if(flag== "1"){
					ip.ipInfoJump("修改成功!","success");
					$("#editbtnModal").modal('hide');
					$.ajax({
						url: "/df/menu/BtnGrid.do?tokenid="+tokenid,
						type: 'get',
						dataType: 'json',
						data: {"menu_id":guid,"ajax":"noCache"},
						success: function (data) {
							menuViewModel.buttonDataTable.removeAllRows();
							menuViewModel.buttonDataTable.setSimpleData(data.btngrid);
							menuViewModel.buttonDataTable.setRowUnSelect(0);
						}
					});
				}else{
					ip.ipInfoJump("修改失败："+data.message,"info");
				}
			}
		});
	}

	changeType = function (obj) {
		obj.element.innerHTML = '<a id="'+ obj.rowIndex +'" onclick="change(this.id)" class="change-type">状态修改</a><span class="separator">';
	};

	change = function(value,evt){
		var e = evt || window.event;
		window.event ? e.cancelBubble = true : e.stopPropagation();
		var selected_node = $('#write-grid1').parent()[0]['u-meta'].grid.getRowByIndex(value);
		var btnRemark = selected_node.value.actionname;
		var btn_id = selected_node.value.btn_id;
		$.ajax({
			url: "/df/res/changeResRemark.do?tokenid="+tokenid,
			type: 'post',
			dataType: 'json',
			data: {"btn_id":btn_id,"btnRemark":btnRemark,"ajax":"noCache"},
			success: function (data) {
				$.ajax({
					url: "/df/view/getMenuView.do?tokenid="+tokenid,
					type: 'GET',
					dataType: 'json',
					data: {"guid":menuGuid,"tokenId":tokenid,"ajax":"noCache"},
					success: function (data) {
						menuViewModel.gridDataTableButton.removeAllRows();
						menuViewModel.gridDataTableButton.setSimpleData(data.btnList);
						menuViewModel.gridDataTableButton.setRowUnSelect(0);
					}
				});
			}
		});
	}

	changeType1 = function (obj) {
		var flag = obj.row.value.remark;
		var action_id = obj.row.value.chr_id;
		if(flag=="0"){
			obj.element.innerHTML = '<a id="'+ obj.rowIndex +'" onclick="change1(this.id)" acid = "'+action_id+'" flag = "1" class="change-type">停用</a><span class="separator">';
		}else{
			obj.element.innerHTML = '<a id="'+ obj.rowIndex +'" onclick="change1(this.id)" acid = "'+action_id+'" flag = "0" class="change-type">启用</a><span class="separator">';
		}
	};
	change1 = function(value,evt){
		var e = evt || window.event;
		window.event ? e.cancelBubble = true : e.stopPropagation();
		var flag = $("#"+value).attr("flag");
		var id = $("#"+value).attr("acid");
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var guid  =  data_tree.getSelectedNodes()[0].guid;
		$.ajax({
			url: "/df/menu/updateBtnRemark.do?tokenid="+tokenid,
			type: 'post',
			dataType: 'json',
			data: {"id":id,"flag":flag,"ajax":"noCache"},
			success: function (data) {
				$.ajax({
					url: "/df/menu/BtnGrid.do?tokenid="+tokenid,
					type: 'get',
					dataType: 'json',
					data: {"menu_id":guid,"ajax":"noCache"},
					success: function (data) {
						menuViewModel.buttonDataTable.removeAllRows();
						menuViewModel.buttonDataTable.setSimpleData(data.btngrid);
						menuViewModel.buttonDataTable.setRowUnSelect(0);
					}
				});
			}
		});

	};
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		menuViewModel.getInitData();
		$("#statue123").click(function(e){
			if(menuGuid != null){
				$.ajax({
					url: "/df/menu/StatuesGrid.do?tokenid="+tokenid,
					type: 'get',
					dataType: 'json',
					data: {"menu_id":menuGuid,"ajax":"noCache"},
					success: function (data) {
						menuViewModel.treeDataTable5.setSimpleData(data.statusgrid);
					}
				});
			}
		});
		
		// 状态按钮参数
		$("#btnparam123").click(function(e){
			initDropdownList();
		});
		
		initDropdownList=function(){
			if(menuGuid != null){
				$.ajax({
					url: "/df/menu/StatuesGrid.do?tokenid="+tokenid,
					type: 'get',
					dataType: 'json',
					data: {"menu_id":menuGuid,"ajax":"noCache"},
					success: function (data) {
						var length=data.statusgrid.length;
						var dataList=data.statusgrid;
						var mbCodeDIV=$("#statusoptions");
						$("#statusoptions").html("");
						mbCodeDIV.append("<option value=''>请选择状态</option>");
						for(var i=0;i<length;i++){
							mbCodeDIV.append("<option value='"+dataList[i].status_id+"'>"+dataList[i].show_name+"</option>");   
						}
						menuViewModel.buttonparamDataTable.setSimpleData("");
					}
				});
			}
		
		};
		
		
		
		// 下拉列表事件
		$('#statusoptions').change(function(e){
			var status_id = $('#statusoptions').val();
			if(status_id  == ""){
				return false;
			}
			else{
				$.ajax({
					url: "/df/menu/BtnParam.do?tokenid="+tokenid,
					type: 'get',
					dataType: 'json',
					data: {"menu_id":menuGuid,"status_id":status_id,"ajax":"noCache"},
					success: function (data) {
						menuViewModel.buttonparamDataTable.setSimpleData(data.btncheck);
					}
				});
			}
		
        });

	});
});
