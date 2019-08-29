require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var sysId = null;
	var tokenid = ip.getTokenId();
	var menuViewModel = {
			data : ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						var sys_id = node.sys_id;
						menuName = node.name;
						
						
						$.ajax({
							url: "/df/roleConfig/queryRole.do?tokenid="+tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"sys_id":sys_id,"ajax":"noCache"},
							success: function (data) {
								sysId = sys_id;
								menuViewModel.gridDataTable.removeAllRows();
								menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
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
					'sys_name': {
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
					'role_code':{},
					'role_name':{},
					'sys_name':{},
					'enabled':{}
				}
			})
	};
	menuViewModel.getInitData = function () {
		
		
		$.ajax({
			url: "/df/roleConfig/initRoleTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				var treedata = data.dataDetail;
				menuViewModel.treeDataTable.setSimpleData(treedata);
				var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
				var nodes  = data_tree.getNodes();
				data_tree.expandNode(nodes[0], true, false, true);
				var dataselect = data.selectDetail;
				var ophtml = "";
				for(var k = 0 ; k < dataselect.length ; k++){
					if(dataselect[k].sys_id != "0")
						ophtml = ophtml + "<option value='"+dataselect[k].sys_id+"'>"+dataselect[k].sys_name + "</option>"
				}
				$("#user_sys_id").append(ophtml);
				$("#user_sys_id1").append(ophtml);
			} 
		});
	};
	function refreshgrid(){
		var allRoletreeObj = $.fn.zTree.getZTreeObj("menuConfigTree1");
		var chr_id = allRoletreeObj.getSelectedNodes()[0].sys_id;
		if(chr_id == null || chr_id ==""){
			return;
		}
		$.ajax({
			url: "/df/roleConfig/queryRole.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			async:'false',
			data: {"sys_id":chr_id,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
				menuViewModel.gridDataTable.setRowUnSelect(0);
			}
		});
	}
	refreshRoleTree = function(){
		var allRoletreeObj = $.fn.zTree.getZTreeObj("menuConfigTree1");
		var chr_id = allRoletreeObj.getSelectedNodes()[0].sys_id;
		var nodes = allRoletreeObj.getSelectedNodes();
		if(chr_id == null || chr_id ==""){
			return;
		}
		$.ajax({
			url: "/df/roleConfig/initRoleTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			async:'false',
			success: function (data) {
				var treedata = data.dataDetail;
				menuViewModel.treeDataTable.setSimpleData(treedata);
				var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
				data_tree.expandAll(true);
				if (nodes.length>0) {
					allRoletreeObj.selectNode(nodes[0]);
				}
			}
		});
	};
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

	};

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
		$("#role_code").val("");
		$("#role_name").val("");
		$("#user_sys_id").val(sysId);
		$('#enabled').eq(0).prop("checked",true);
		$("#addRoleModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.editbtn = function (){
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要修改的角色","info");
			return;
		}
		if(selRows.length > 1){
			ip.ipInfoJump("请不要选择一个以上角色","info");
			return;
		}
		var role_id =  selRows[0].data.role_id.value;
		var role_code = selRows[0].data.role_code.value;
		var role_name = selRows[0].data.role_name.value;
		var user_sys_id = selRows[0].data.sys_id.value;
		var enabled = selRows[0].data.enabled.value;
		$("#role_id").val(role_id);
		$("#role_code1").val(role_code);
		$("#role_name1").val(role_name);
		$("#user_sys_id1").val(user_sys_id);
		if(enabled == "1"){
			$('#enabled1').eq(0).prop("checked",true);
		}else{
			$('#enabled1').eq(0).prop("checked",false);
		}
		$("#editRoleModal").modal({backdrop: 'static', keyboard: false});
	};

	menuViewModel.delbtn = function (){
		
		
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要删除的角色","info");
			return;
		}
		ip.warnJumpMsg("真的要删除吗?","sid1","cCla1");
		$("#sid1").on("click",function(){
			$("#config-modal").remove();
			var role_id ="";
			for(var rolesize = 0 ;  rolesize < selRows.length ; rolesize++){
				role_id=  selRows[rolesize].data.role_id.value + "@" + role_id;
			}
			$.ajax({
				url: "/df/roleConfig/delRole.do?tokenid=" + tokenid,
				type: 'GET',
				dataType: 'json',
				data: {"role_id":role_id,"ajax":"noCache"},
				success: function (data) {
					refreshgrid();
					refreshRoleTree();
					var msg = "";
					if(data.flag==1){
						
						ip.ipInfoJump("成功删除"+data.cout+"条","success");
					}
					if(data.flag==0){
						$.each(data.rolelist, function(idx, obj) {
					        msg += obj.role_name + " ";
					    });
						ip.ipInfoJump(msg + "角色已经使用！请勿删除","error");
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
		
		
		var role_code = $("#role_code").val();
		var role_name = $("#role_name").val();
		var user_sys_id = $("#user_sys_id").val();
		if(role_code ==""||role_code==null){
			ip.ipInfoJump("角色编码不可为空！","error");
			return;
		}
		if(role_name ==""||role_code==null){
			ip.ipInfoJump("角色名称不可为空！","error");
			return;
		}
		if(user_sys_id ==""||user_sys_id==null){
			ip.ipInfoJump("子系统不可为空！","error");
			return;
		}
		var enabled = "1";
		if(!$('#enabled').is(':checked')){
			enabled = "0";
		} 
		$.ajax({
			url: "/df/roleConfig/saveRole.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"role_code":role_code, "role_name":encodeURI(encodeURI(role_name)),"user_sys_id":user_sys_id,"enabled":enabled,"ajax":"noCache"},
			success: function (data) {
				if(data.flag == "1"){
					ip.ipInfoJump("添加成功","success");
					refreshgrid();
					refreshRoleTree();
					$("#addRoleModal").modal('hide');
					
				}else{
					ip.ipInfoJump(data.message,"error");
				}
			} 
		});
	}
	menuViewModel.ensure1 = function (){
		
		
		var role_id = $("#role_id").val();
		var role_code = $("#role_code1").val();
		var role_name = $("#role_name1").val();
		var user_sys_id = $("#user_sys_id1").val();
		if(role_code ==""||role_code==null){
			ip.ipInfoJump("角色编码不可为空！","error");
			return;
		}
		if(role_name ==""||role_code==null){
			ip.ipInfoJump("角色名称不可为空！","error");
			return;
		}
		if(user_sys_id ==""||user_sys_id==null){
			ip.ipInfoJump("子系统不可为空！","error");
			return;
		}
		var enabled = "1";
		if(!$('#enabled1').is(':checked')){
			enabled = "0";
		} 
		$.ajax({
			url: "/df/roleConfig/updateRole.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"role_code":role_code,"role_name":role_name,"user_sys_id":user_sys_id,"enabled":enabled,"role_id":role_id,"ajax":"noCache"},
			success: function (data) {
				if(data.flag == "1"){
					ip.ipInfoJump("修改成功","success");
					refreshgrid();
					refreshRoleTree();
					$("#editRoleModal").modal('hide');
				}else{
					ip.ipInfoJump(data.message,"error");
				}
			} 
		});
	}
	
	menuViewModel.reflush = function () {
		menuViewModel.getInitData();	
		menuViewModel.gridDataTable.removeAllRows();
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
