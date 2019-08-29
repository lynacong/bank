require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'],function ($, ko) {
	window.ko = ko;
	var tokenid=ip.getTokenId();
	var roleid = null;
	var menuViewModel = {
			data: ko.observable({}),
			gridDataTable: new u.DataTable({
				meta: {
					'chr_id':{},
					'czgb_code':{},
					'ele_code':{},
					'ele_source':{},
					'ele_name':{},
					'enabled':{},
					'ref_mode':{},
					'code_rule':{},
					'is_view':{},
					'is_rightfilter':{},
					'level_name':{},
					'is_nolevel':{},
					'is_operate':{},
					'max_level':{}
				}
			}),
			enabledItems: [{
				"value": "0",
				"name": "不启用"
			}, {
				"value": "1",
				"name": "启用"
			}],
			refItems: [{
				"value": "0",
				"name": "树参照"
			}, {
				"value": "1",
				"name": "下拉框"
			}, {
				"value": "2",
				"name": "列表参照"
			}],
			isrightfilterItems: [{
				"value": "0",
				"name": "否"
			}, {
				"value": "1",
				"name": "是"
			}],
			isviewItems: [{
				"value": "0",
				"name": "否"
			}, {
				"value": "1",
				"name": "是"
			}],
			isnolevelItems: [{
				"value": "0",
				"name": "否"
			}, {
				"value": "1",
				"name": "是"
			}],
			isoperateItems: [{
				"value": "0",
				"name": "否"
			}, {
				"value": "1",
				"name": "是"
			}],
	}
	menuViewModel.getInitData = function(){
		$.ajax({
			url: "/df/elementConfig/init.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenid":tokenid,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.eledetail);
				menuViewModel.gridDataTable.setRowUnSelect(0);
			}
		});


	}
	clearText = function(id){
		$("#"+ id).val("");
	};
	menuViewModel.delviewSubmit = function (){
		var row = menuViewModel.gridDataTable.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要删除的数据","info");
			return;
		}
		ip.warnJumpMsg("确定删除吗？","sid","cCla");
		//处理确定逻辑方法
		$("#sid").on("click",function(){
			//处理确定逻辑方法
			var chr_id =row.data.chr_id.value;
			var ele_code =row.data.ele_code.value;
			$.ajax({
				url: "/df/elementConfig/deleteEle.do?tokenid=" + tokenid,
				type: 'POST',
				dataType: 'json',
				data: {"eleid":chr_id,"elecode":ele_code,"ajax":"noCache"},
				success: function (data) {
					var num = data.num;
					ip.ipInfoJump("已删除"+num+"条","success");
					$("#config-modal").remove();
					menuViewModel.getInitData();
				}
			});
		});

		$(".cCla").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})

	}
	menuViewModel.lrtree = function (){
		$.ajax({
			url: "/df/elementConfig/entertree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenid":tokenid,"ajax":"noCache"},
			success: function (data) {
				ip.treeChoice("enterview", data.entertree, 0, null, 0, "录入视图");
			}
		});
	}
	menuViewModel.lbtree = function (){
		$.ajax({
			url: "/df/elementConfig/listtree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenid":tokenid,"ajax":"noCache"},
			success: function (data) {
				ip.treeChoice("listview", data.listtree, 0, null, 0, "列表视图");
			}
		});
	}
	menuViewModel.lrtree1 = function (){
		$.ajax({
			url: "/df/elementConfig/entertree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenid":tokenid,"ajax":"noCache"},
			success: function (data) {
				ip.treeChoice("enterview1", data.entertree, 0, null, 0, "录入视图");
			}
		});
	}
	menuViewModel.lbtree1 = function (){
		$.ajax({
			url: "/df/elementConfig/listtree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"tokenid":tokenid,"ajax":"noCache"},
			success: function (data) {
				ip.treeChoice("listview1", data.listtree, 0, null, 0, "列表视图");
			}
		});
	}
	menuViewModel.ensure = function (){
		var ele_source = $("#ele_source").val();
		if(ele_source == null || ele_source.trim() =="" ){
			ip.ipInfoJump("请输入要素表");
			return;
		}
		var ele_code = $("#ele_code").val();
		if(ele_code == null || ele_code.trim() =="" ){
			ip.ipInfoJump("请输入要素简称");
			return;
		}
		var ele_name = $("#ele_name").val();
		if(ele_name == null || ele_name.trim() =="" ){
			ip.ipInfoJump("请输入要素中文名");
			return;
		}
		var ref_mode = $("#ref_mode").val();
		var czgb_code = $("#czgb_code").val();
		var enterview = $("#enterview-h").val();
		var listview = $("#listview-h").val();
		if(enterview==null||enterview==""){
			ip.ipInfoJump("视图不可为空");
			return;
		}
		if(listview==null||listview==""){
			ip.ipInfoJump("视图列表不可为空");
			return;
		}
		var enter = enterview.split("@");
		var list = listview.split("@");
		var level_name = enter[2]+"&"+list[2];
		var options = {};
		options["ele_source"]=ele_source;
		options["ele_code"]=ele_code;
		options["ele_name"]=ele_name;
		options["ref_mode"]=ref_mode;
		options["czgb_code"]=czgb_code;
		options["level_name"]=level_name;
		options["ajax"] = "noCache";
		$.ajax({
			url: "/df/elementConfig/insertEle.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: options,
			success: function (data) {
				var num = data.num;
				ip.ipInfoJump("已插入"+num+"条","success");
				$("#addElementModal").modal('hide');
				menuViewModel.getInitData();
			}
		});

	}
	menuViewModel.ensure1 = function (){
		var ele_source = $("#ele_source1").val();
		if(ele_source == null || ele_source.trim() =="" ){
			ip.ipInfoJump("请输入要素表");
			return;
		}
		var ele_code = $("#ele_code1").val();
		if(ele_code == null || ele_code.trim() =="" ){
			ip.ipInfoJump("请输入要素简称");
			return;
		}
		var ele_name = $("#ele_name1").val();
		if(ele_name == null || ele_name.trim() =="" ){
			ip.ipInfoJump("请输入要素名称");
			return;
		}
		var ref_mode = $("#ref_mode1").val();
		var czgb_code = $("#czgb_code1").val();
		var enterview = $("#enterview1-h").val();
		var listview = $("#listview1-h").val();
		var chr_id = $("#chr_id1").val();
		var enter = enterview.split("@");
		var list = listview.split("@");
		var level_name = enter[2]+"&"+list[2];
		var options = {};
		options["ele_source"]=ele_source;
		options["ele_code"]=ele_code;
		options["ele_name"]=ele_name;
		options["ref_mode"]=ref_mode;
		options["czgb_code"]=czgb_code;
		options["level_name"]=level_name;
		options["chr_id"]=chr_id;
		options["ajax"] = "noCache";
		$.ajax({
			url: "/df/elementConfig/updateEle.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: options,
			success: function (data) {
				var num = data.num;
				ip.ipInfoJump("已更新"+num+"条","success");
				$("#editElementModal").modal('hide');
				menuViewModel.getInitData();
			}
		});

	}
	menuViewModel.ensure2 = function (){
		var max_level = $("#max_level").val();
		if(max_level == null || max_level.trim() =="" ){
			ip.ipInfoJump("请输入最大级次");
			return;
		}
		var code_rule = $("#code_rule").val();
		if(code_rule == null || code_rule.trim() =="" ){
			ip.ipInfoJump("请输入编码格式");
			return;
		}
		var codeArray = code_rule.split("-");
		if(codeArray.length != max_level){
			ip.warnJumpMsg("编码格式不正确,格式为3-3-3样式且编码格式的级次应和最大级次对同！例如3-3-3的级次为3则最大级次应为3！",0,0,true);
			return;
		}
		for(var i = 0 ; i < codeArray.length;i++ ){
			if(codeArray[i]!=null && codeArray[i]!="" ){
				var a = codeArray[i].replace(/[^\d]/g,"");
				if(a != codeArray[i]){
					ip.warnJumpMsg("级次必须为数字",0,0,true);
					return;
				}
			}else{
				ip.warnJumpMsg("编码格式不正确,格式为3-3-3样式且编码格式的级次应和最大级次对同！例如3-3-3的级次为3则最大级次应为3！",0,0,true);
				return;
			}
		}
		var chr_id = $("#chr_id2").val();
		var options = {};
		options["max_level"]=max_level;
		options["code_rule"]=code_rule;
		options["chr_id"]=chr_id;
		$.ajax({
			url: "/df/elementConfig/updateEleCode.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: options,
			success: function (data) {
				var num = data.num;
				ip.ipInfoJump("已更新"+num+"条","success");
				$("#editcodeModal").modal('hide');
				menuViewModel.getInitData();
			}
		});
	}
	menuViewModel.editviewSubmit = function (obj){
		if(obj.rowIndex != null){
			menuViewModel.gridDataTable.setRowFocus(obj.rowIndex);
		}
		var row = menuViewModel.gridDataTable.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要修改的数据","info");
			return;
		}
		var chr_id =row.data.chr_id.value;
		var czgb_code =row.data.czgb_code.value;
		var ele_code =row.data.ele_code.value;
		var ele_source =row.data.ele_source.value;
		var ele_name =row.data.ele_name.value;
		var ref_mode =row.data.ref_mode.value;
		var is_nolevel="";
		var is_operate="";
		var level_name =row.data.level_name.value;
		if(level_name != null){
			var list = level_name.split("&");
			if(list.length > 0){
				is_nolevel = list[0];
			}
			if(list.length > 1){
				is_operate = list[1];
			}
		}
		$("#chr_id1").val(chr_id);
		$("#ele_source1").val(ele_source);
		$("#ele_code1").val(ele_code);
		$("#ele_name1").val(ele_name);
		$("#ref_mode1").val(ref_mode);
		$.ajax({
			url: "/df/elementConfig/queryenter.do?tokenid=" + tokenid,
			type: "GET",
			async: false,
			data: {
				"enter_code": is_nolevel,
				"list_code": is_operate,
				"ajax": "noCache"
			},		
			success: function(data) {
				if(data.enter.length>0){
					$("#enterview1").val(data.enter[0].codename);
					$("#enterview1-h").val(data.enter[0].chr_id+"@"+data.enter[0].chr_name+"@"+data.enter[0].chr_code);
				}
				else{
					$("#enterview1").val("");
					$("#enterview1-h").val("");
				}
				if(data.list.length>0){
					$("#listview1").val(data.list[0].codename);
					$("#listview1-h").val(data.list[0].chr_id+"@"+data.list[0].chr_name+"@"+data.list[0].chr_code);
				}
				else{
					$("#listview1").val("");
					$("#listview1-h").val("");
				}
			}
		});
		$("#czgb_code1").val(czgb_code);
		$("#editElementModal").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.editcodeSubmit =  function (){
		var row = menuViewModel.gridDataTable.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要修改的数据","info");
			return;
		}
		var max_level =row.data.max_level.value;
		var code_rule =row.data.code_rule.value;
		var chr_id =row.data.chr_id.value;
		$("#max_level").val(max_level);
		$("#code_rule").val(code_rule);
		$("#chr_id2").val(chr_id);
		$("#editcodeModal").modal({backdrop: 'static', keyboard: false});
	}
	
	
	menuViewModel.addviewSubmit = function (){
		$("#ele_source").val("");
		$("#ele_code").val("");
		$("#ele_name").val("");
		$("#ref_mode").val("");
		$("#enterview").val("");
		$("#enterview-h").val("");
		$("#listview").val("");
		$("#listview-h").val("");
		$("#czgb_code").val("");
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
