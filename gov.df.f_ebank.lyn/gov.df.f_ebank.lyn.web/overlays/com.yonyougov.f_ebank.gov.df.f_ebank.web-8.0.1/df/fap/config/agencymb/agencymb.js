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
						var chr_id = node.chr_id;
						
						
						$.ajax({
							url: "/df/agencymb/mbGrid.do?tokenid="+tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"chr_id":chr_id,"ajax":"noCache"},
							success: function (data) {
								menuViewModel.gridDataTable.removeAllRows();
								menuViewModel.gridDataTable.setSimpleData(data.datadetail);
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
					'chr_id': {
						'value':""
					},
					'codename': {
						'value':""
					},
					'parent_id':{
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
					'chr_code':{},
					'chr_name':{},
					'parent_name':{},
					'disp_code':{}
				}
			})
	};
	menuViewModel.getInitData = function () {
		
		
		$.ajax({
			url: "/df/agencymb/agencytree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				var treedata = data.datadetail;
				menuViewModel.treeDataTable.setSimpleData(treedata);
				var data_tree = $("#menuConfigTree1")[0]['u-meta'].tree;
				var nodes  = data_tree.getNodes();
				data_tree.expandNode(nodes[0], true, false, true);
			} 
		});
	}
	function refreshgrid(){
		
		
		var allRoletreeObj = $.fn.zTree.getZTreeObj("menuConfigTree1");
		var chr_id = allRoletreeObj.getSelectedNodes()[0].chr_id;
		if(chr_id == null || chr_id ==""){
			return;
		}
		$.ajax({
			url: "/df/agencymb/mbGrid.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"chr_id":chr_id,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.datadetail);
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
		$("#belonemb").val("");
		$("#belonemb-h").val("");
		$("#beloneorg").val("");
		$("#beloneorg-h").val("");
		$("#disp_order").val("");
		$("#addRoleModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.editbtn = function (){
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要修改的处室","info");
			return;
		}
		if(selRows.length > 1){
			ip.ipInfoJump("请不要选择一个以上处室","info");
			return;
		}
		var chr_id =  selRows[0].data.chr_id.value;
		var chr_code =  selRows[0].data.chr_code.value;
		var chr_name = selRows[0].data.chr_name.value;
		var disp_code = selRows[0].data.disp_code.value;
		var parent_id = selRows[0].data.parent_id.value;
		var allRoletreeObj = $.fn.zTree.getZTreeObj("menuConfigTree1");
		var search_nodes = allRoletreeObj.getNodesByParamFuzzy("id",parent_id,null);
		var name = "";
		if(search_nodes.length > 0){
			name = search_nodes[0].name;
		}
		$("#chr_id1").val(chr_id);
		$("#mb").val(chr_code + " " + chr_name);
		$("#org").val(name);
		$("#disp_order1").val(disp_code);
		$("#editRoleModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.delbtn = function (){
		
		
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要删除的部门","info");
			return;
		}
		ip.warnJumpMsg("真的要删除吗?","sid1","cCla1");
		$("#sid1").on("click",function(){
			$("#config-modal").remove();
			var chr_id ="";
			for(var rolesize = 0 ;  rolesize < selRows.length ; rolesize++){
				chr_id=  selRows[rolesize].data.chr_id.value + "@" + chr_id;
			}
			$.ajax({
				url: "/df/agencymb/delAgencyMb.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"chr_id":chr_id,"ajax":"noCache"},
				success: function (data) {
					ip.ipInfoJump("成功删除"+data.cout+"条","info");
					refreshgrid();
				} 
			});
		});
		$(".cCla1").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		});
	}

	menuViewModel.ensure = function (){
		
		
		var mbvalue = $("#belonemb-h").val();
		if(mbvalue == "" || mbvalue ==null){
			ip.ipInfoJump("处室不可为空！","success");
			return;
		}
		var value1 = mbvalue.split("@");
		var chr_name = value1[1];
		var chr_code = value1[2];
		var agenvalue = $("#beloneorg-h").val();
		if(agenvalue == "" || agenvalue ==null){
			ip.ipInfoJump("所属单位不可为空！","success");
			return;
		}
		var value2 = agenvalue.split("@");
		var agency_id = value2[0];
		var disp_order = $("#disp_order").val();
		$.ajax({
			url: "/df/agencymb/insertAgencyMb.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"agency_id":agency_id, "chr_name":decodeURIComponent(chr_name),"chr_code":chr_code,"disp_order":disp_order,"ajax":"noCache"},
			success: function (data) {
				if(data.flag == "1"){
					ip.ipInfoJump("添加成功","success");
					$("#addRoleModal").modal('hide');
					refreshgrid();
				}else{
					ip.ipInfoJump(data.message,"error");
				}
			} 
		});
	}
	menuViewModel.ensure1 = function (){
		
		
		var disp_order = $("#disp_order1").val();
		var chr_id =  $("#chr_id1").val();
		$.ajax({
			url: "/df/agencymb/upAgencyMb.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"disp_order":disp_order,"chr_id":chr_id,"ajax":"noCache"},
			success: function (data) {
				ip.ipInfoJump("修改成功","success");
				$("#editRoleModal").modal('hide');
				refreshgrid();
			} 
		});
	}
	changeType = function (obj) {
		var parent_id = obj.row.value.parent_id;
		var allRoletreeObj = $.fn.zTree.getZTreeObj("menuConfigTree1");
		var search_nodes = allRoletreeObj.getNodesByParamFuzzy("id",parent_id,null);
		var name = "";
		if(search_nodes.length > 0){
			name = search_nodes[0].name;
		}
		obj.element.innerHTML = '<a id="'+ obj.rowIndex +'" >'+name+'</a>';
	};
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		menuViewModel.getInitData();
		$("#beloneorg-span").click(function(){
			ip.showAssitTree('beloneorg',"AGENCY",'0',{},'',"单位");
		});
		$("#belonemb-span").click(function(){
			ip.showAssitTree('belonemb',"MB",'0',{},'',"处室");
		});
	});
});
