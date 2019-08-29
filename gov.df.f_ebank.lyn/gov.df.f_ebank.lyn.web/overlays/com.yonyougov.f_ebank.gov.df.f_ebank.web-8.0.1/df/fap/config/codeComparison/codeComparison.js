require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'],function ($, ko) {
	window.ko = ko;
	var roleid = null;
	var tokenid = ip.getTokenId();
	var ele_code = "";
	var ele_name = "";
	var flag = "1";
	var type = "0";
	var codeall = "";
	var menuViewModel = {
			data: ko.observable({}),
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

					}
				}
			},
			gridDataTable: new u.DataTable({
				meta: {
					'chr_id':{},
					'chr_code':{},
					'out_chr_code':{},
					'chr_name':{}
				}
			}),
			treeViewTable: new u.DataTable({
				meta: {
					'ele_code': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'codename':{
						'value':""
					}
				}
			}),
			treeViewTable1: new u.DataTable({
				meta: {
					'ele_code': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'codename':{
						'value':""
					}
				}
			}),
			gridDataTable1: new u.DataTable({
				meta: {
					'cp_code':{},
					'cp_name':{}
				}
			}),
	}
	menuViewModel.getInitData = function(){
		$.ajax({
			url: "/df/CodeComparison/initliftGrid.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable1.removeAllRows();
				menuViewModel.gridDataTable1.setSimpleData(data.liftinfo);
			}
		});

	}
	getdata = function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		var id = row.data.id.value;
		if(flag == "1"){
			$.ajax({
				url: "/df/CodeComparison/initRightGrid.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"id":id,"ele_code":ele_code,"ajax":"noCache"},
				success: function (data) {
					menuViewModel.gridDataTable.removeAllRows();
					menuViewModel.gridDataTable.setSimpleData(data.rigtinfo);
					menuViewModel.gridDataTable.setRowUnSelect(0);
				}
			});	
		}else{
			$.ajax({
				url: "/df/CodeComparison/initRightHaveGrid.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"id":id,"ele_code":ele_code,"ajax":"noCache"},
				success: function (data) {
					menuViewModel.gridDataTable.removeAllRows();
					menuViewModel.gridDataTable.setSimpleData(data.rigtinfo);
					menuViewModel.gridDataTable.setRowUnSelect(0);
				}
			});
		}
	}

	rowSelect = function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		var id = row.data.id.value;
		$.ajax({
			url: "/df/CodeComparison/initRightArea.do?tokenid=" + tokenid,
			type: 'GET',
			async: false,
			dataType: 'json',
			data: {"id":id,"ajax":"noCache"},
			success: function (data) {
				var lilist  =data.tabinfo;
				var inhtml = "";
				codeall = "";
				for(var j = 0 ; j <lilist.length ; j++){
					codeall = lilist[j].ele_code + ","+codeall;
					inhtml  = inhtml + "<li role='presentation'><a href='#homes' aria-controls='profile' role='tab' data-toggle='tab' " +
					"id='"+lilist[j].ele_code+"'>"+lilist[j].ele_name+"</a></li>" 
				}
				$("#myTabs").empty();
				$("#myTabs").append(inhtml);
			}
		});	
		var li = $("#myTabs li").eq(0);
		li.attr("class","active");
		ele_code = li.find("a").attr("id");
		ele_name = li.find("a").text();
		$("#myTabs li").on("click","a",function(){
			ele_code = $(this).attr("id");
			ele_name = $(this).text();
			getdata();
		});
		getdata();
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
	}

	menuViewModel.viewQuery1 = function (){  
		var user_write = $("#addviewInput1").val();
		var data_tree = $("#menuConfigTree3")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);	
		if(data_tree.getSelectedNodes().length>0){
			ui_guid = data_tree.getSelectedNodes()[0].id;
		}
	}

	var k = 1;
	menuViewModel.viewNext1 = function (){
		var user_write = $("#addviewInput1").val();
		var data_tree = $("#menuConfigTree3")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(data_tree.getSelectedNodes().length>0){
			ui_guid = data_tree.getSelectedNodes()[0].id;
			if(k < search_nodes.length){
				data_tree.selectNode(search_nodes[k++]);
			}else{
				k = 1;
			}
		}
	}

	menuViewModel.ensure =  function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		var id = row.data.id.value;
		var chr_id = $("#chr_id").val();
		var chr_code = $("#chr_code").val();
		var chr_name = $("#chr_name").val();
		var out_chr_code =$("#out_chr_code").val();
		if(out_chr_code == "" || out_chr_code == null ){
			type = "2";
		}
		if(type == "0"){
			$.ajax({
				url: "/df/CodeComparison/updateRightGrid.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"id":id,"ele_code":ele_code,"inner_chr_code":chr_code,"out_chr_code":out_chr_code,"ajax":"noCache"},
				success: function (data) {
					ip.ipInfoJump("修改成功","success");
					getdata();
					$("#editcodeModal").modal('hide');
				}
			});
		}else if(type == "1"){
			$.ajax({
				url: "/df/CodeComparison/insertRightGrid.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"cp_id":id,"ele_code":ele_code,"ele_name":ele_name,"inner_chr_code":chr_code,"chr_name":chr_name,"inner_chr_id":chr_id,"out_chr_code":out_chr_code,"ajax":"noCache"},
				success: function (data) {
					ip.ipInfoJump("修改成功!","success");
					getdata();
					$("#editcodeModal").modal('hide');
				}
			});
		}else if(type == "2"){
			$.ajax({
				url: "/df/CodeComparison/deleteRightGrid.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"id":id,"ele_code":ele_code,"inner_chr_code":chr_code,"ajax":"noCache"},
				success: function (data) {
					ip.ipInfoJump("修改成功!","success");
					getdata();
					$("#editcodeModal").modal('hide');
				}
			});
		}

	}
	menuViewModel.del = function(){
		var row2 = menuViewModel.gridDataTable1.getFocusRow();
		var id = row2.data.id.value;
		var row = menuViewModel.gridDataTable.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要修改的数据!","info");
			return;
		}
		var code = row.data.chr_code.value;
		ip.warnJumpMsg("确定删除该条数据外码吗？","sid","cCla");
		$("#sid").on("click",function(){
			$("#config-modal").remove();
			//处理确定逻辑方法
			$.ajax({
				url: "/df/CodeComparison/deleteRightGrid.do?tokenid=" + tokenid,
				type: 'post',
				dataType: 'json',
				data: {"id":id,"ele_code":ele_code,"inner_chr_code":code,"ajax":"noCache"},
				success: function (data) {
					ip.ipInfoJump("删除成功!","success");
					getdata();
				}
			});

		});

		$(".cCla").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})
	}
	menuViewModel.edit = function(){
		var row = menuViewModel.gridDataTable.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要修改的数据!","info");
			return;
		}

		//处理确定逻辑方法
		$("#config-modal").remove();
		var chr_id = row.data.chr_id.value;
		var chr_code = row.data.chr_code.value;
		var chr_name = row.data.chr_name.value;
		var out_chr_code = row.data.out_chr_code.value;
		if(out_chr_code == "" || out_chr_code == null){
			type = "1";
		}
		$("#chr_id").val(chr_id);
		$("#chr_code").val(chr_code);
		$("#chr_name").val(chr_name);
		$("#out_chr_code").val(out_chr_code);
		$("#editcodeModal").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.ensure2 =  function(){
		var incode = $("#incode").val();
		if(incode == "" || incode == null){
			ip.ipInfoJump("编码不可为空。","info");
			return;
		}
		var inname = $("#inname").val();
		if(inname == "" || inname == null){
			ip.ipInfoJump("名称不可为空。","info");
			return;
		}
		$.ajax({
			url: "/df/CodeComparison/insertLiftGrid.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"cp_code":incode,"cp_name":inname,"ajax":"noCache"},
			success: function (data) {
				if(data.flag == "1"){
					ip.ipInfoJump("保存成功！","success");
					menuViewModel.getInitData();
					$("#insertcodeModal").modal('hide');
				}else{
					ip.ipInfoJump(data.message,"info");	
				}
			}
		});
	}
	menuViewModel.ensure3 =  function(){
		var incode = $("#incode1").val();
		if(incode == "" || incode == null){
			ip.ipInfoJump("编码不可为空！","info");
			return;
		}
		var inname = $("#inname1").val();
		if(inname == "" || inname == null){
			ip.ipInfoJump("名称不可为空！","info");
			return;
		}
		var codeid =  $("#codeid").val();
		$.ajax({
			url: "/df/CodeComparison/updateLiftGrid.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"id":codeid,"cp_code":incode,"cp_name":inname,"ajax":"noCache"},
			success: function (data) {
				if(data.flag == "1"){
					ip.ipInfoJump("保存成功！","success");
					menuViewModel.getInitData();
					$("#editcodeModal2").modal('hide');
				}else{
					ip.ipInfoJump(data.message,"info");	
				}
			}
		});
	}

	menuViewModel.ensure4 =  function(){
		var treeObj1 = $("#menuConfigTree2")[0]['u-meta'].tree;
		var nodes = treeObj1.getCheckedNodes();
		var code = ""
			for(var i=0; i<nodes.length; i++){
				code = code +nodes[i].id+"@"+nodes[i].name+",";
			}
		var row2 = menuViewModel.gridDataTable1.getFocusRow();
		var id = row2.data.id.value;
		if(code == ""){
			return;
		}
		$.ajax({
			url: "/df/CodeComparison/insertelement.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"id":id,"code":code,"ajax":"noCache"},
			success: function (data) {
				if(data.flag == "1"){
					ip.ipInfoJump("保存成功！","success");
					rowSelect();
					$("#insertelementModal").modal('hide');
				}else{
					ip.ipInfoJump(data.message,"info");	
				}
			}
		});
	}

	menuViewModel.ensure5 =  function(){
		var treeObj1 = $("#menuConfigTree3")[0]['u-meta'].tree;
		var nodes = treeObj1.getCheckedNodes();
		var code = ""
			for(var i=0; i<nodes.length; i++){
				code = code +nodes[i].id+",";
			}
		var row2 = menuViewModel.gridDataTable1.getFocusRow();
		var id = row2.data.id.value;
		if(code == ""){
			return;
		}
		$.ajax({
			url: "/df/CodeComparison/delelement.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"id":id,"code":code,"ajax":"noCache"},
			success: function (data) {
				if(data.flag == "1"){
					ip.ipInfoJump("删除成功！","success");
					rowSelect();
					$("#delelementModal").modal('hide');
				}else{
					ip.ipInfoJump(data.message,"info");	
				}
			}
		});
	}


	menuViewModel.insert = function(){
		$("#incode").val("");
		$("#inname").val("");
		$("#insertcodeModal").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.editcode = function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要修改的数据！","info");
			return;
		}
		var cp_code = row.data.cp_code.value;
		var cp_name = row.data.cp_name.value;
		var cpid = row.data.id.value;
		$("#incode1").val(cp_code);
		$("#inname1").val(cp_name);
		$("#codeid").val(cpid);
		$("#editcodeModal2").modal({backdrop: 'static', keyboard: false});
	}
	menuViewModel.delcode = function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要删除的数据！","info");
			return;
		}
		var id = row.data.id.value;
		ip.warnJumpMsg("确定删除该条编码吗？","sid","cCla");
		$("#sid").on("click",function(){
			$("#config-modal").remove();
			ip.warnJumpMsg("是否删除所有对照数据？","sid1","cCla1");
			$("#sid1").on("click",function(){
				$("#config-modal").remove();
				$.ajax({
					url: "/df/CodeComparison/deleteLeftGrid.do?tokenid=" + tokenid,
					type: 'post',
					dataType: 'json',
					data: {"id":id,"flag":"1","ajax":"noCache"},
					success: function (data) {
						ip.ipInfoJump("删除成功！","success");
						menuViewModel.getInitData();
					}
				});
			});
			$(".cCla1").on("click",function(){
				//处理取消逻辑方法
				$("#config-modal").remove();
				$.ajax({
					url: "/df/CodeComparison/deleteLeftGrid.do?tokenid=" + tokenid,
					type: 'post',
					dataType: 'json',
					data: {"id":id,"flag":"0","ajax":"noCache"},
					success: function (data) {
						ip.ipInfoJump("删除成功！","success");
						menuViewModel.getInitData();
					}
				});
			})
		});

		$(".cCla").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})
	}
	menuViewModel.newElement = function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要新增的编码！","info");
			return;
		}
		$("#addviewInput").val("");
		$.ajax({
			url: "/df/CodeComparison/element.do?tokenid=" + tokenid,
			type: 'get',
			dataType: 'json',
			data: {"code":codeall,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.treeViewTable.setSimpleData(data.treedata);
			}
		});
		$("#insertelementModal").modal({backdrop: 'static', keyboard: false});
	}

	menuViewModel.delElement = function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		if(row == null){
			ip.ipInfoJump("请选择要新增的编码！","info");
			return;
		}
		$("#addviewInput1").val("");
		$.ajax({
			url: "/df/CodeComparison/elementHave.do?tokenid=" + tokenid,
			type: 'get',
			dataType: 'json',
			data: {"code":codeall,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.treeViewTable1.setSimpleData(data.treedata);
			}
		});
		$("#delelementModal").modal({backdrop: 'static', keyboard: false});
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
