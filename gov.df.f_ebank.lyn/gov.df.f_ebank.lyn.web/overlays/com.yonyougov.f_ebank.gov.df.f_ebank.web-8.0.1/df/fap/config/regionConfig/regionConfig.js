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
					}
				}
			},
			editRegionTreeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						var sys_id = node.sys_id;
						menuName = node.name;

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
			treeDataTable2: new u.DataTable({
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
			treeDataTable3: new u.DataTable({
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
					'sys_id':{},
					'sys_name':{},
					'enabled':{}
				}
			})
	};
	menuViewModel.template = {
		rg_id : '',
		rg_code : '',
		rg_name : '',
		clear:function(){
			this.rg_id = "";
			this.rg_code = "";
			this.rg_name = "";
		}
	}
	menuViewModel.getInitData = function () {
		refreshRegionTree();
		$.ajax({
			url: "/df/regionConfig/querySysApp.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
				menuViewModel.gridDataTable.setRowUnSelect(0);
			}
		});
	}
	function refreshRegionTree(){
		$.ajax({
			url: "/df/regionConfig/initRegionTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache","is_valid":'1'},
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
		
		$.ajax({
			url: "/df/regionConfig/initRegionTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				var treedata = data.dataDetail;
				menuViewModel.treeDataTable2.setSimpleData(treedata);
				var data_tree = $("#enableRegionConfigTree1")[0]['u-meta'].tree;
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
		
		$.ajax({
			url: "/df/regionConfig/initRegionTree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache","is_valid":'1'},
			success: function (data) {
				var treedata = data.dataDetail;
				menuViewModel.treeDataTable3.setSimpleData(treedata);
				var data_tree = $("#templateConfigTree1")[0]['u-meta'].tree;
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
	var val = "";
	quickQuery = function (type){
		if(type == 'quickquery'){
			treeId ='menuConfigTree1';
		}else{
			treeId ='enableRegionConfigTree1';
		}
		var user_write = $("#"+type).val();
		if(val == user_write){
			return;
		}
		val = user_write;
		var data_tree = $("#"+treeId)[0]['u-meta'].tree;
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
		$("#"+type).focus();
		i = 1;

	}

	var i = 0;
	var searchInput = "";
	menuTreeNext = function (treeId){
		var quickQuery = "quickquery";
		if(treeId == null ||treeId == 'menuConfigTree1'){
			treeId ='menuConfigTree1';
			quickQuery = 'quickquery';
		}else if(treeId == 'enableRegionConfigTree1'){
			quickQuery = 'enableRegionQuickquery';
		}else if(treeId == 'templateConfigTree1'){
			quickQuery = 'templateQuickquery';
		}
		var user_write = $("#"+quickQuery).val();
		if(ip.strIsNull(searchInput)){//输入框内容已经变更
			searchInput = user_write;
		}else if(searchInput != user_write){
			i = 0;
			searchInput = user_write;
		}
		var data_tree = $("#"+treeId)[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(i < search_nodes.length){
			data_tree.selectNode(search_nodes[i++]);
		}else{
			i = 0;
			//ip.ipInfoJump("最后一个","info");
		}
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].id;
			}else{
				menuGuid = null;
			}
		}
		$("#"+quickQuery).focus();
	}
	
	configRegionTemplate = function (condition){
		$("#templateQuickquery").val("");
		$('#enabled').eq(0).prop("checked",true);
		var user_write = $("#regionTemplateQuery").val();
		$('#templateQuickquery').val(user_write);
		menuTreeNext('templateConfigTree1');
		$("#selectTempletModal").modal({backdrop: 'static', keyboard: false});
	}
	//查询处理进度
	refreshInitRegionProgress = function(){
		if(ip.strIsNull(menuViewModel.initRegionProgress.progress)){
			menuViewModel.initRegionProgress.progress = '0';
		}
		$.ajax({
			url: "/df/regionConfig/checkRegionProgress.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache","progress":menuViewModel.initRegionProgress.progress},
			success: function (data) {
				var progress = data.progress;
				if(data.flag == "1"){
					//进行中
					$("#initProgress").width(progress+"%");
					$("#progressTip").html("正在处理，已完成"+progress+"%");
					menuViewModel.initRegionProgress.progress = progress;
					if(progress >= 100){
						menuViewModel.initRegionProgress.close();
						menuViewModel.initRegionProgress.resetProgress();
					}
				}else{
					//失败
					menuViewModel.initRegionProgress.close();
					menuViewModel.initRegionProgress.resetProgress();
				}
			} 
		});
	}


	menuViewModel.addbtn = function (){
		$("#role_code").val("");
		$("#role_name").val("");
		$("#user_sys_id").val(sysId);
		$('#enabled').eq(0).prop("checked",true);
		$("#enableRegionModal").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.initRegionProgress = {
		interval : '',
		progress : '0',
		close:function(){
			clearInterval(this.interval);
			this.interval = "";
			this.progress = '0';
			$("#progressModal").modal("hide");
		},
		resetProgress:function(){
			$("#initProgress").width("0%");
			$("#progressTip").html("正在处理，已完成0%");
		}
	}

	menuViewModel.refreshbtn = function (){
		refreshRegionTree();
		
	}
	
	/*
	 * description do initialize Region
	 */
	menuViewModel.ensure = function (){
		//检查选中节点是否为未启动
		var data_tree = $("#"+treeId)[0]['u-meta'].tree;
		var nodes = data_tree.getSelectedNodes();
		if(nodes.length == 0){
			ip.ipInfoJump("请选择一个区划","info");
			return;
		}else if(nodes.length > 1){
			ip.ipInfoJump("只能选择一个区划","info");
			return;
		}else if(nodes[0].id == '0'){
			var rg_name = nodes[0].name;
			ip.ipInfoJump('【'+rg_name.substr(0, rg_name.indexOf("("))+"】并非行政区划，请重新选择需要启动的区划","info");
			return;
		}else{
			var isValid = nodes[0].is_valid;
			if(isValid == '1'){
				ip.ipInfoJump("所选区划【"+nodes[0].name+"】已经启用，请选择其他区划","info");
				return;
			}
		}
		if(ip.strIsNull(menuViewModel.template.rg_code)){
			ip.ipInfoJump("请选择区划模板","info");
			return;
		}
		
		var rg_id = nodes[0].id;
		var rg_code = nodes[0].code;
		var rg_name = nodes[0].name;
		var sysApps = JSON.stringify(menuViewModel.gridDataTable.getSimpleData());
		
		$.ajax({
			url: "/df/regionConfig/initRegion.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {
				"templateRgId":menuViewModel.template.rg_id,
				"templateRgCode":menuViewModel.template.rg_code,
				"templateRgName":menuViewModel.template.rg_name,
				"targetRgId":rg_id,
				"targetRgCode":rg_code,
				"targetRgName":rg_name,
				"ajax":"noCache",
				"sysApps":sysApps
			},
			success: function (data) {
				if(data.flag == "1"){
					if(data.message.search("失败")>-1){
						ip.ipInfoJump(data.message,"error");
					}else{
						ip.ipInfoJump(data.message,"success");
						refreshRegionTree();
					}
				}else{
					ip.ipInfoJump(data.message,"error");
				}
				menuViewModel.initRegionProgress.close();
				menuViewModel.initRegionProgress.resetProgress();
			},
			error:function(data){
				ip.ipInfoJump(data.message,"error");
			}
		});
		//打开进度条
		//$("#progressModal").modal({backdrop: 'static', keyboard: false});
		//menuViewModel.initRegionProgress.interval = setInterval("refreshInitRegionProgress()","1000");
	}
	//选择模板
	menuViewModel.ensure1 = function (){
		menuViewModel.template.clear();
		var data_tree = $("#templateConfigTree1")[0]['u-meta'].tree;
		var nodes = data_tree.getSelectedNodes();
		if(nodes.length == 0){
			ip.ipInfoJump("请选择一个区划作为模板","info");
			return;
		}else if(nodes.length > 1){
			ip.ipInfoJump("只能选择一个区划作为模板","info");
			return;
		}
		var rg_id = nodes[0].id;
		var rg_code = nodes[0].code;
		var rg_name = nodes[0].name;
		if(nodes[0].id == '0'){
			ip.ipInfoJump('【'+rg_name.substr(0, rg_name.indexOf("("))+"】并非行政区划，请重新选择区划模板","info");
			return;
		}
		menuViewModel.template.rg_id = rg_id;
		menuViewModel.template.rg_code = rg_code;
		menuViewModel.template.rg_name = rg_name;
		$('#templateQuickquery').val(rg_name);
		$('#regionTemplateQuery').val(rg_name);
		$("#selectTempletModal").modal("hide");
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
