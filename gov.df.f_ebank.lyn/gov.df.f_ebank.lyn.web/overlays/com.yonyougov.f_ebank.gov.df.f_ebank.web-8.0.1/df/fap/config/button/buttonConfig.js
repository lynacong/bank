require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	var sysId = "";
	var menuViewModel = {
			data : ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						var sys_id = node.sys_id;
						$.ajax({
							url: "/df/buttoncofnig/BtnGrid.do?tokenid="+tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"sys_id":sys_id,"ajax":"noCache"},
							success: function (data) {
								sysId = sys_id;
								menuViewModel.gridDataTable.removeAllRows();
								menuViewModel.gridDataTable.setSimpleData(data.griddata);
								menuViewModel.gridDataTable.setRowUnSelect(0);
							}
						});
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
			treeDataTable: new u.DataTable({
				meta: {
					'sys_id': {
						'value':""
					},
					'name': {
						'value':""
					},
					'pid':{
						'value':""
					}
				}
			}),
			comItems: [{
				"value": "0",
				"name": "不启用"
			}, {
				"value": "1",
				"name": "启用"
			}],    
			comItems2: [{
				"value": "0",
				"name": "按钮区"
			}, {
				"value": "1",
				"name": "操作区"
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
					'action_code':{},
					'action_name':{},
					'icon_name':{},
					'func_name':{},
					'param':{},
					'action_type':{}
				}
			})
	};
	menuViewModel.getInitData = function () {
		$.ajax({
			url: "/df/buttoncofnig/initBtnTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {"ajax":"noCache"},
			success: function (data) {
				var treedata = data.datatree;
				menuViewModel.treeDataTable.setSimpleData(treedata);
				var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
				var nodes  = data_tree.getNodes();
				data_tree.expandNode(nodes[0], true, false, true);
				var ophtml = "";
				for(var k = 0 ; k < treedata.length ; k++){
					if(treedata[k].sys_id != "0")
						ophtml = ophtml + "<option value='"+treedata[k].sys_id+"'>"+treedata[k].name + "</option>"
				}
				$("#user_sys_id").append(ophtml);
				$("#user_sys_id1").append(ophtml);
			} 
		});
	}
	function refreshgrid(){
		var allRoletreeObj = $.fn.zTree.getZTreeObj("menuConfigTree1");
		var sys_id = allRoletreeObj.getSelectedNodes()[0].sys_id;
		if(sys_id == null || sys_id ==""){
			return;
		}
		$.ajax({
			url: "/df/buttoncofnig/BtnGrid.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {"sys_id":sys_id,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.griddata);
				menuViewModel.gridDataTable.setRowUnSelect(0);
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
	sysidChange = function (obj){
		$("#parentid").val("");
		$("#parentid-h").val("");
	}
	sysidChange1 = function (obj){
		$("#parentid1").val("");
		$("#parentid1-h").val("");
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


	menuViewModel.addbtn = function (){
		$("#action_code").val("");
		$("#action_name").val("");
		$("#icon_name").val("");
		$("#func_name").val("");
		$("#param").val("");
		$("#action_type").val("0");
		$("#user_sys_id").val(sysId);
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var nodes = data_tree.getSelectedNodes();
		$("#addRoleModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.editbtn = function (){
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要修改的按钮","info");
			return;
		}
		if(selRows.length > 1){
			ip.ipInfoJump("请不要选择一个以上按钮","info");
			return;
		}
		var action_id =  selRows[0].data.action_id.value;
		var action_code = selRows[0].data.action_code.value;
		var action_name = selRows[0].data.action_name.value;
		var user_sys_id = selRows[0].data.sys_id.value;
		var icon_name = selRows[0].data.icon_name.value;
		var param = selRows[0].data.param.value;
		var func_name = selRows[0].data.func_name.value;
		var action_type = selRows[0].data.action_type.value;
		$("#action_id").val(action_id);
		$("#action_code1").val(action_code);
		$("#action_name1").val(action_name);
		$("#user_sys_id1").val(user_sys_id);
		$("#icon_name1").val(icon_name);
		$("#param1").val(param);
		$("#func_name1").val(func_name);
		$("#action_type1").val(action_type);
		$("#editRoleModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.delbtn = function (){
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要删除的按钮","info");
			return;
		}
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		ip.warnJumpMsg("真的要删除吗?","sid1","cCla1");
		$("#sid1").on("click",function(){
			$("#config-modal").remove();
			var acIdlist ="";
			var name = "";
			for(var rolesize = 0 ;  rolesize < selRows.length ; rolesize++){
				var action_id = selRows[rolesize].data.action_id.value;
				acIdlist = action_id+"@"+acIdlist;
			}
			if(acIdlist ==""){
				return;
			}
			$.ajax({
				url: "/df/buttoncofnig/delBtn.do?tokenid=" + tokenid,
				type: 'POST',
				dataType: 'json',
				data: {"acIdlist":acIdlist,"ajax":"noCache"},
				success: function (data) {
					if(data.flag =="1"){
						ip.ipInfoJump("成功删除"+data.cout+"条","info");
						refreshgrid();
					}else{
						ip.ipInfoJump("删除失败","info");
					}
				} 
			});
		});
		$(".cCla1").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		});
	}

	menuViewModel.ensure = function (){
		var action_code = $("#action_code").val();
		var action_name = $("#action_name").val();
		var icon_name = $("#icon_name").val();
		var func_name = $("#func_name").val();
		var param = $("#param").val();
		var sys_id = $("#user_sys_id").val();
		var action_type = $("#action_type").val();
		if(action_code == "" || action_code == null){
			ip.ipInfoJump("编码不可为空！","error");
			return;
		} else {
            var myReg = /^[a-zA-Z0-9_]{0,}$/;
            if (!myReg.test(action_code)) {
                ip.ipInfoJump("编码不可有中文或特殊字符！","error");
                return;
            }
		}
		if(action_name == "" || action_name == null){
			ip.ipInfoJump("名称不可为空！","error");
			return;
		}
		if(sys_id == "" || sys_id == null){
			ip.ipInfoJump("子系统不可为空！","error");
			return;
		}
		$.ajax({
			url: "/df/buttoncofnig/insertBtn.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"action_code":action_code,"action_name":action_name,"icon_name":icon_name,"func_name":func_name,
				"param":param,"sys_id":sys_id,"action_type":action_type,"ajax":"noCache" },
				success: function (data) {
					if(data.flag == "1"){
						ip.ipInfoJump("添加成功","success");
						$("#addRoleModal").modal('hide');
						refreshgrid();
					}else{
						ip.ipInfoJump("添加失败！","error");
					}
				} 
		});
	}
	menuViewModel.ensure1 = function (){
		var action_id = $("#action_id").val();
		var action_code = $("#action_code1").val();
		var action_name = $("#action_name1").val();
		var icon_name = $("#icon_name1").val();
		var func_name = $("#func_name1").val();
		var param = $("#param1").val();
		var sys_id = $("#user_sys_id1").val();
		var action_type = $("#action_type1").val();
		if(action_code == "" || action_code == null){
			ip.ipInfoJump("编码不可为空！","error");
			return;
		} else {
            var myReg = /^[a-zA-Z0-9_]{0,}$/;
            if (!myReg.test(action_code)) {
                ip.ipInfoJump("编码不可有中文或特殊字符！","error");
                return;
            }
        }
		if(action_name == "" || action_name == null){
			ip.ipInfoJump("名称不可为空！","error");
			return;
		}
		$.ajax({
			url: "/df/buttoncofnig/updateBtn.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"action_id":action_id,"action_code":action_code,"action_name":action_name,"icon_name":icon_name,"func_name":func_name,
				"param":param,"sys_id":sys_id,"action_type":action_type,"ajax":"noCache"},
				success: function (data) {
					if(data.flag == "1"){
						ip.ipInfoJump("修改成功","success");
						$("#editRoleModal").modal('hide');
						var data_tree =$("#menuConfigTree1")[0]['u-meta'].tree;
						refreshgrid();
					}else if(data.flag == "0"){
						ip.ipInfoJump("修改失败："+data.message,"error");
					}
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
