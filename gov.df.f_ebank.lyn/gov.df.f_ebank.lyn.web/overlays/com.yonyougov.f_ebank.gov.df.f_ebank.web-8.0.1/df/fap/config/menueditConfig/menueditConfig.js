require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var sysId = null;
	var tokenid =  ip.getTokenId();
	var menuViewModel = {
			data : ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						var menu_id = node.menu_id;


						$.ajax({
							url: "/df/menuedit/queryGrid.do?tokenid="+tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"menu_id":menu_id,"ajax":"noCache"},
							success: function (data) {
								sysId = node.user_sys_id;
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
					'menu_code':{},
					'menu_name':{},
					'url':{},
					'enabled':{},
					'disp_order':{},
					'sys_name':{},
					'tips':{},
					'menu_parameter':{}
				}
			})
	};
	menuViewModel.getInitData = function () {

		$("#user_sys_id").empty();
		$("#user_sys_id1").empty();
		$.ajax({
			url: "/df/menuedit/initMenuTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			async: false,
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
	}
	function refreshgrid(){


		var allRoletreeObj = $.fn.zTree.getZTreeObj("menuConfigTree1");
		var menu_id = allRoletreeObj.getSelectedNodes()[0].menu_id;
		if(menu_id == null || menu_id ==""){
			return;
		}
		$.ajax({
			url: "/df/menuedit/queryGrid.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {"menu_id":menu_id,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
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
		$("#menu_code").val("");
		$("#menu_name").val("");
		$("#tips").val("");
		$("#url").val("");
		$("#disp_order").val("");
		$("#menu_parameter").val("");
		$("#user_sys_id").val(sysId);
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var nodes = data_tree.getSelectedNodes();
		if(nodes.length == 0){
			$("#parentid").val("");
			$("#parentid-h").val("");
		}else{
			var name = nodes[0].name;
			var id = nodes[0].menu_id;
			$("#parentid").val(name);
			$("#parentid-h").val(id+"@");
		}

		$('#enabled').eq(0).prop("checked",true);
		$("#addRoleModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.editbtn = function (){
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要修改的菜单","info");
			return;
		}
		if(selRows.length > 1){
			ip.ipInfoJump("请不要选择一个以上菜单","info");
			return;
		}
		var menu_id =  selRows[0].data.menu_id.value;
		var menu_code = selRows[0].data.menu_code.value;
		var menu_name = selRows[0].data.menu_name.value;
		var user_sys_id = selRows[0].data.user_sys_id.value;
		var enabled = selRows[0].data.enabled.value;
		var tips = selRows[0].data.tips.value;
		var url = selRows[0].data.url.value;
		var disp_order = selRows[0].data.disp_order.value;
		var menu_parameter = selRows[0].data.menu_parameter.value;
		var parentid = selRows[0].data.parent_id.value;
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		var nodes = data_tree.getNodesByParam("id",parentid,null);
		var name = "";
		var id = "";
		if(nodes.length > 0){
			name = nodes[0].name;
			id = nodes[0].menu_id;
		}
		$("#menu_id").val(menu_id);
		$("#menu_code1").val(menu_code);
		$("#menu_oldcode").val(menu_code);
		$("#menu_name1").val(menu_name);
		$("#tips1").val(tips);
		$("#url1").val(url);
		$("#disp_order1").val(disp_order);
		$("#menu_parameter1").val(menu_parameter);
		$("#user_sys_id1").val(user_sys_id);
		$("#parentid1").val(name);
		$("#parentid1-h").val(id+"@");
		if(enabled == "1"){
			$('#enabled1').eq(0).prop("checked",true);
		}else{
			$('#enabled1').eq(0).prop("checked",false);
		}
		$("#editRoleModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.delbtn = function (){


		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要删除的菜单","info");
			return;
		}
		var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
		ip.warnJumpMsg("真的要删除吗?","sid1","cCla1");
		$("#sid1").on("click",function(){
			$("#config-modal").remove();
			var menu_id ="";
			var name = "";
			for(var rolesize = 0 ;  rolesize < selRows.length ; rolesize++){
				var id = selRows[rolesize].data.menu_id.value;
				var search_nodes = data_tree.getNodesByParam("id",id,null);
				if(search_nodes.length > 0){
					if(!search_nodes[0].isParent){
						menu_id=  selRows[rolesize].data.menu_id.value + "@" + menu_id;
					}else{
						name = name + search_nodes[0].menu_name+",";
					}
				}
			}
			if(name != "")
			ip.ipInfoJump("不可删除带子集的菜单："+name,"info");
			if(menu_id ==""){
				return;
			}
			$.ajax({
				url: "/df/menuedit/delMenu.do?tokenid=" + tokenid,
				type: 'POST',
				dataType: 'json',
				data: {"menu_id":menu_id,"ajax":"noCache"},
				success: function (data) {
					if(data.flag =="1"){
						ip.ipInfoJump("成功删除"+data.cout+"条","info");
						var data_tree =$("#menuConfigTree1")[0]['u-meta'].tree;
						var id = data_tree.getSelectedNodes()[0].id;
						refreshgrid();
						menuViewModel.getInitData();
						var search_nodes1 = data_tree.getNodesByParam("id",id,null);
						data_tree.selectNode(search_nodes1[0]);
						data_tree.expandNode(search_nodes1[0],true,false,true);

					}else{
						ip.ipInfoJump("该菜单存在下级无法删除","info");
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


		var menu_code = $("#menu_code").val();
		var menu_name = $("#menu_name").val();
		var parentinfo = $("#parentid-h").val();
		var parentid="";
		if(parentinfo != null && parentinfo != ""  ){
			var allinof = parentinfo.split("@");
			parentid = allinof[0];
		}
		var tips = $("#tips").val();
		var url = $("#url").val();
		var disp_order = $("#disp_order").val();
		var menu_parameter = $("#menu_parameter").val();
		var user_sys_id = $("#user_sys_id").val();
		if(menu_code == "" || menu_code == null){
			ip.ipInfoJump("菜单编码不可为空！","info");
			return;
		}
		if(menu_name == "" || menu_name == null){
			ip.ipInfoJump("菜单名称不可为空！","info");
			return;
		}
		if(user_sys_id == "" || user_sys_id == null){
			ip.ipInfoJump("子系统不可为空！","info");
			return;
		}
		if(parentinfo == "" || parentinfo == null){
			ip.ipInfoJump("父级菜单不可为空！","info");
			return;
		}
		if(disp_order == "" || disp_order == null){
			ip.ipInfoJump("菜单顺序不可为空！","info");
			return;
		}else{
			if(!isNaN(disp_order)){
				ip.ipInfoJump("菜单顺序必须为数字！", "info");
			}
		}
		
		var enabled = "1";
		if(!$('#enabled').is(':checked')){
			enabled = "0";
		} 
		$.ajax({
			url: "/df/menuedit/insertMenu.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"menu_code":menu_code,"menu_name":menu_name,"user_sys_id":user_sys_id,"enabled":enabled,
				"tips":tips,"url":url,"disp_order":disp_order,"menu_parameter":menu_parameter,"ajax":"noCache" , "parentid":parentid},
				success: function (data) {
					if(data.flag == "1"){
						ip.ipInfoJump("添加成功","success");
						$("#addRoleModal").modal('hide');
						var pid = data.pid;
						var id = data.id;
						var data_tree =$("#menuConfigTree1")[0]['u-meta'].tree;
						var search_nodes = data_tree.getNodesByParam("id",pid,null);
						data_tree.selectNode(search_nodes[0]);
						refreshgrid();
						menuViewModel.getInitData();
						var search_nodes1 = data_tree.getNodesByParam("id",pid,null);
						data_tree.selectNode(search_nodes1[0]);
						data_tree.expandNode(search_nodes1[0],true,false,true);
					}else{
						ip.ipInfoJump("菜单编码已存在！","error");
					}
				} 
		});
	}
	menuViewModel.ensure1 = function (){


		var menu_id = $("#menu_id").val();
		var menu_code = $("#menu_code1").val();
		var menu_oldcode = $("#menu_oldcode").val();
		var menu_name = $("#menu_name1").val();
		var tips = $("#tips1").val();
		var url = $("#url1").val();
		var disp_order = $("#disp_order1").val();
		var menu_parameter = $("#menu_parameter1").val();
		var user_sys_id = $("#user_sys_id1").val();
		var parentinfo = $("#parentid1-h").val();
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		var oldparentid = selRows[0].data.parent_id.value;
		var is_leaf = selRows[0].data.is_leaf.value;
		var parentid="";
		if(parentinfo != null && parentinfo != ""  ){
			var allinof = parentinfo.split("@");
			parentid = allinof[0];
		}
		if(menu_code == "" || menu_code == null){
			ip.ipInfoJump("菜单编码不可为空！","info");
			return;
		}
		if(menu_name == "" || menu_name == null){
			ip.ipInfoJump("菜单名称不可为空！","info");
			return;
		}
		if(user_sys_id == "" || user_sys_id == null){
			ip.ipInfoJump("子系统不可为空！","info");
			return;
		}
		if(parentinfo == "" || menu_code == null){
			ip.ipInfoJump("父级菜单不可为空！","info");
			return;
		}
		var enabled = "1";
		if(!$('#enabled1').is(':checked')){
			enabled = "0";
		} 
		$.ajax({
			url: "/df/menuedit/updateMenu.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"menu_code":menu_code,"menu_name":menu_name,"user_sys_id":user_sys_id,"enabled":enabled,"menu_id":menu_id,
				"tips":tips,"url":url,"disp_order":disp_order,"menu_parameter":menu_parameter,"ajax":"noCache","parentid":parentid
				,"oldparentid":oldparentid,"is_leaf":is_leaf,"menu_oldcode":menu_oldcode},
				success: function (data) {
					if(data.flag == "1"){
						ip.ipInfoJump("修改成功","success");
						$("#editRoleModal").modal('hide');
						var pid = data.pid;
						var id = data.id;
						var data_tree =$("#menuConfigTree1")[0]['u-meta'].tree;
						var search_nodes = data_tree.getNodesByParam("id",pid,null);
						data_tree.selectNode(search_nodes[0]);
						refreshgrid();
						menuViewModel.getInitData();
						var search_nodes1 = data_tree.getNodesByParam("id",pid,null);
						data_tree.selectNode(search_nodes1[0]);
						data_tree.expandNode(search_nodes1[0],true,false,true);
					}else if(data.flag == "0"){
						ip.ipInfoJump("修改失败："+data.message,"error");
					}
				} 
		});
	}

	menuViewModel.lrtree1 = function (){


		var user_sys_id = $("#user_sys_id").val();
		var sys_name = encodeURI($("#user_sys_id").find("option:selected").text());
		$.ajax({
			url: "/df/menuedit/parenttree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenid":tokenid,"ajax":"noCache","user_sys_id":user_sys_id,"sys_name":sys_name},
			success: function (data) {
				ip.treeChoice("parentid", data.datadetail, 0, null, 0, "父级选择");
			}
		});
	}

	menuViewModel.lrtree2 = function (){


		var user_sys_id = $("#user_sys_id1").val();
		var sys_name = encodeURI($("#user_sys_id1").find("option:selected").text());
		$.ajax({
			url: "/df/menuedit/parenttree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenid":tokenid,"ajax":"noCache","user_sys_id":user_sys_id,"sys_name":sys_name},
			success: function (data) {
				ip.treeChoice("parentid1", data.datadetail, 0, null, 0, "父级选择");
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
