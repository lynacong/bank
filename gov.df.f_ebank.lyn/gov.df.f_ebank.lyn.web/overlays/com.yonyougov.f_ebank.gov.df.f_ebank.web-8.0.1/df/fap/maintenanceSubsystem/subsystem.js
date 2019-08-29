require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
function ($, ko) {
	var subsystem = {
		tokenid : ip.getTokenId(),
		subsystemDatatable : new u.DataTable({
			meta : {
				'sys_id' : {},
				'sys_name' : {},
				'sys_desc' : {},
				'enabled' : {},
				'version' : {}
			}
		}),
		comItems: [{
	        "value": "1",
	        "name": "启用"
    	},{
	        "value": "2",
	        "name": "未启用"
    	}]
	}
	subsystem.editFun = function (obj) {
		window.s = subsystem.subsystemDatatable;
		obj.element.innerHTML = '<input type="text" id="edit-text" class="u-input" value="' + obj.value + '">';
		subsystem.moveEnd($("#edit-text").get(0));
		$("#edit-text").on("blur",function () {
			var curent_value = $("#edit-text").val();
			if(curent_value == ""){
				ip.ipInfoJump("所填信息不能为空！","error");
			} else {
				var curent_row = subsystem.subsystemDatatable.getFocusRow();
				subsystem.subsystemDatatable.setValue(obj.field,curent_value,curent_row);
			}
		})
	}
	subsystem.moveEnd = function(obj) {
        obj.focus(); 
        var len = obj.value.length; 
        if (document.selection) { 
            var sel = obj.createTextRange(); 
            sel.moveStart('character',len); //设置开头的位置
            sel.collapse(); 
            sel.select(); 
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') { 
            obj.selectionStart = obj.selectionEnd = len; 
        } 
    }
	subsystem.subAddRow = function () {
		subsystem.subsystemDatatable.addSimpleData([{
			"sys_id": "",
			"sys_name": "",
			"sys_desc": "",
			"enabled": "1",
			"version": ""
		}], {"status": "new"});
	}
	subsystem.subDeleRow = function () {
		var rows = subsystem.subsystemDatatable.getSelectedRows();
		if(rows==null||rows==""){
			ip.ipInfoJump("请选择数据！");
			return;
		}else{
			ip.warnJumpMsg("确定删除吗？","sid","cCla");
		}
		$("#sid").on("click",function(){
			$("#config-modal").remove();
		 	var rows_id = [];
		 	var rows_index = [];
			for(var i = 0; i < rows.length; i++) {
				if (rows[i].data.sys_guid == undefined) {
					rows_index.push(rows[i].rowId);
				} else {
					rows_id.push(rows[i].data.sys_guid.value);
				}
			}
			if(rows_index.length > 0) {
				for(var k = 0; k < rows_index.length; k++){
					subsystem.subsystemDatatable.removeRowByRowId(rows_index[k]);
				}
				ip.ipInfoJump("删除成功！","success");
			}
			if(rows_id.length > 0) {
				rows_id = rows_id.toString();
				$.ajax({
		        	url:"/df/subsystem/deleSubsystemInfo.do?tokenid=" + subsystem.tokenid,
		        	data:{
		        		"ajax":"nocache",
		        		"sys_guid":rows_id
		        	},
		        	type:"POST",
		        	dataType:"json",
		        	success:function(data){
		        		if(data.flag = "success"){
		        			subsystem.initData();
		        			ip.ipInfoJump(data.msg,"success");
		        		} else {
		        			ip.ipInfojump(data.msg,"error");
		        		}
		        	}
		        });
			}
		 });
		 $(".cCla").on("click",function(){
		 	$("#config-modal").remove();
		 })
	}
	subsystem.subSaveRow = function () {
		var current_grid = $("#subsystem-grid").parent()[0]['u-meta'].grid;
		// var rows = subsystem.subsystemDatatable.getSelectedRows();
		var rows = subsystem.subsystemDatatable.getAllRows();
		// var rows_grid = current_grid.getSelectRows();
		var rows_grid = current_grid.getAllRows();
		var upd_rows = [];
		var new_rows = [];
		var rows_sys_id = [];
		for(var j = 0; j < rows.length; j++){
			if (rows[j].status == "nrm"){
                rows_sys_id.push(rows[j].data.sys_id.value);
			}

		}
		for(var i = 0; i < rows.length; i++){
			if(rows[i].data.sys_id.value == ""){
                ip.ipInfoJump("所填信息不能为空","error");
				return;
			} else {
                if(!ip.isNumber(rows[i].data.sys_id.value)){
                    ip.ipInfoJump("系统编码只能是数字","error");
                    return;
                }
			}
			if(rows[i].data.sys_name.value == "") {
                ip.ipInfoJump("所填信息不能为空","error");
				return;
			} else if(rows[i].data.enabled.value == "") {
                ip.ipInfoJump("所填信息不能为空","error");
				return;
			} else if(rows[i].data.version.value == "") {
                ip.ipInfoJump("所填信息不能为空","error");
				return;
			}
			switch (rows[i].status) {
				case "upd": 
					var data = rows_grid[i];
					upd_rows.push(data);
					break;
				case "new": 
					for(var f = 0; f < rows_sys_id.length; f++){
						if(rows[i].data.sys_id.value == rows_sys_id[f]){
                            ip.ipInfoJump("编码有重复","error");
							return;
						}
					}
					for(var f = 0; f < new_rows.length; f++){
						if(rows[i].data.sys_id.value == new_rows[f].sys_id){
                            ip.ipInfoJump("编码有重复","error");
                            return;
						}
					}
					var data = rows_grid[i];
					new_rows.push(data);
					break;
			}
		}
		upd_rows = JSON.stringify(upd_rows);
		new_rows = JSON.stringify(new_rows);
		$.ajax({
        	url:"/df/subsystem/updSubsystemInfo.do?tokenid=" + subsystem.tokenid,
        	data:{
        		"ajax":"nocache",
        		"upd_rows":upd_rows,
        		"new_rows":new_rows
        	},
        	type:"POST",
        	dataType:"json",
        	success:function(data){
        		if(data.flag = "success"){
        			subsystem.initData();
        			ip.ipInfoJump(data.msg,"success");
        		} else {
        			ip.ipInfoJump(data.msg,"error");
        		}
        	}
        })
	}
	subsystem.initData = function () {
		$.ajax({
        	url:"/df/subsystem/getSubsystemInfo.do?tokenid=" + subsystem.tokenid,
        	data:{"ajax":"nocache"},
        	type:"GET",
        	dataType:"json",
        	success:function(data){
        		if(data.flag = "success"){
					subsystem.subsystemDatatable.setSimpleData(data.gridData);
					subsystem.subsystemDatatable.setRowUnSelect(0);
        		} else {
        			ip.ipInfoJump(data.msg,"error");
        		}
        	}
        })
	}
	subsystem.initData();
	ko.cleanNode($('.subsystem-content')[0]);
	app = u.createApp({
		el: '.subsystem-content',
		model: subsystem
	});
});