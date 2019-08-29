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
					'coa_code':{},
					'coa_name':{}
				}
			}),
	}
	menuViewModel.getInitData = function(){
		$.ajax({
			url: "/df/genCCID/initCOAGrid.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			async: false,
			data: {"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable1.removeAllRows();
				menuViewModel.gridDataTable1.setSimpleData(data.coainfo);
			}
		});

	}
	getdata = function(){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		var id = row.data.coa_id.value;
			$.ajax({
				url: "/df/genCCID/getCoaInitInfo.do?tokenid=" + tokenid,
				type: 'GET',
				dataType: 'json',
				data: {"id":id,"ajax":"noCache"},
				success: function (data) {
					/*menuViewModel.gridDataTable.removeAllRows();
					menuViewModel.gridDataTable.setSimpleData(data.rigtinfo);
					menuViewModel.gridDataTable.setRowUnSelect(0);*/
					alert(data);
				}
			});	
	}

	
	
	
	/*
	 * 动态列特殊需要——生成ccid
	 */
	initGrid_ccid = function(data, areaId, url, options, flag, operateFlag, selectFlag, pageFlag, sumRowFlag,storageFlag,finalData1) {
		$("#ip-grid-footer-area-sum-budgetGridArea").html(""); //清空切换状态时候左下角表格金额选中显示的数据
			var viewModel = {
				gridData1: new u.DataTable({
					meta: ''
				}),
				totals: [],
				curGridHead: [],
				sumArry: ko.observableArray()
			};
			viewModel.areaid = areaId;
			var viewId = data.viewid.substring(1, 37);
			viewModel.createGrid = function(data) {
				data = ip.changeData(data);
				var meta = '{';
				for (var j = 0; j < data.header.length; j++) {
					meta += '"' + data.header[j].id + '"';
					meta += ":{}";
					if (j < data.header.length - 1) {
						meta += ",";
					}
				}
				meta += "}";
				viewModel.gridData1.meta = JSON.parse(meta);
				if (selectFlag == undefined) {
					selectFlag = true;
				}
				if (sumRowFlag == undefined) {
					sumRowFlag = true;
				}
				if (storageFlag == undefined) {
					storageFlag = true;
				}
				if (sumRowFlag) {
					innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData1","type":"grid","editType":"string","onRowSelected":"' + areaId + '_onRowSelectedFun","onRowUnSelected":"' + areaId + '_onRowUnSelectedFun","autoExpand":false,"needLocalStorage":' + storageFlag + ',"afterCreate": "' + areaId + '_afterCreate","multiSelect": ' + selectFlag + ',"onDblClickFun":"' + areaId + '_onDbClick","showNumCol": true,"showSumRow": true,"sumRowFirst":true,"sumRowFixed": true,"headerHeight":32,"rowHeight":32,"sumRowHeight":32,"cancelFocus":false,"onBeforeRowSelected":"' + areaId + '_onRowSelected","maxHeaderLevel":' + data.mate.maxHeaderLevel + ',"sortable":true}' + "'>";
				} else {
					innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData1","type":"grid","editType":"string","onRowSelected":"' + areaId + '_onRowSelectedFun","onRowUnSelected":"' + areaId + '_onRowUnSelectedFun","autoExpand":false,"needLocalStorage":' + storageFlag + ',"afterCreate": "' + areaId + '_afterCreate","multiSelect": ' + selectFlag + ',"onDblClickFun":"' + areaId + '_onDbClick","showNumCol": true,"headerHeight":32,"rowHeight":32,"cancelFocus":false,"onBeforeRowSelected":"' + areaId + '_onRowSelected","maxHeaderLevel":' + data.mate.maxHeaderLevel + ',"sortable":true}' + "'>";
				}
				if (operateFlag == undefined) {
					operateFlag = true;
				}
				// "onSortFun":"sortFun", 	去除全局排序 仅当前页排序
				// innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData","type":"grid","editType":"string","onRowSelected":"onRowSelectedFun","onRowUnSelected":"onRowSelectedFun","autoExpand":false,"needLocalStorage":true,"multiSelect": ' + selectFlag + ',"showNumCol": true,"showSumRow": true,"sumRowFirst":true,"sumRowFixed": true,"headerHeight":32,"rowHeight":32,"sumRowHeight":32,"cancelFocus":false,"onBeforeRowSelected":"' + areaId + '_onRowSelected","sortable":true}' + "'>";
				if (operateFlag) {
					innerHTML += "<div options='" + '{"field":"operate","visible":true,"dataType":"String","editType":"string","title":"操作","fixed":true,"width": 150,"renderType":"' + areaId + '"}' + "'></div>";
				}
				for (var h = 0; h < data.moreHeader.length; h++) {
					innerHTML += "<div options='" + '{"field":"' + data.moreHeader[h].field + '","title":"' + data.moreHeader[h].name + '","headerLevel":"' + data.moreHeader[h].headerLevel + '","startField":"' + data.moreHeader[h].startField + '","endField":"' + data.moreHeader[h].endField + '"}' + "'></div>";
				}
				var item = [];
				for (var i = 0; i < data.header.length; i++) {
					if (data.header[i].width == "") {
						data.header[i].width = 200;
					}
					viewModel.curGridHead.push(data.header[i].id);
					// canVisible = ((data.header[i].visible == false) ? true : false);
					if (viewModel.grid_header_disp_mode == undefined) {
						viewModel.grid_header_disp_mode = {};
					}
					if (data.header[i].sumflag == "true") {
						viewModel.totals.push(data.header[i].id);
						viewModel[data.header[i].id] = "";
						viewModel.grid_header_disp_mode[data.header[i]["id"]] = data.header[i].disp_mode;
						if (data.header[i].disp_mode == "decimal") {
							var num_data = {
								"field": data.header[i].id,
								"name": data.header[i].name
							};

							item.push(num_data);
							viewModel.sumArry(item);
							innerHTML += "<div options='" + '{"field":"' + data.header[i].id + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"Float","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","width": ' + data.header[i].width + ',"sumCol":true,"sumRenderType":"summ","renderType":"dealThousandsGrid"}' + "'></div>";
						} else {
							innerHTML += "<div options='" + '{"field":"' + data.header[i].id + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"Float","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","width": ' + data.header[i].width + ',"sumCol":true,"sumRenderType":"summ","renderType":"' + areaId + '_render"}' + "'></div>";
						}
					} else {
						if (data.header[i].disp_mode == "decimal") {
							innerHTML += "<div options='" + '{"field":"' + data.header[i].id + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"Float","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","width": ' + data.header[i].width + ',"renderType":"dealThousandsGrid"}' + "'></div>";
						} else {
							innerHTML += "<div options='" + '{"field":"' + data.header[i].id + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"String","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","renderType":"' + areaId + '_render","width": ' + data.header[i].width + '}' + "'></div>";
						}
					}
				}
				innerHTML += "</div>";
				if (pageFlag == undefined) {
					pageFlag = true;
				}
				innerHTML += "<div id='ip-grid-footer-area-" + areaId + "' class='text-right' style='height: 36px;'><div id='ip-grid-footer-area-sum-" + areaId + "' class='fl' style='margin: 10px 0 5px 5px;'></div>";
				if (pageFlag) {
					innerHTML += "<div id='pagination' style='float: right;' class='u-pagination' u-meta='" + '{"type":"pagination","data":"gridData1","pageList":[50,100,500,1000],"sizeChange":"sizeChangeFun","pageChange":"pageChangeFun"}' + "'></div>";
				}
				innerHTML += "</div>";
				$('#' + areaId).append(innerHTML);
			
				if(finalData1!=null){
					viewModel.gridData1.removeAllRows();
					viewModel.gridData1.setSimpleData(finalData1);
					
				}
			
			
			};
			
			viewModel.createGrid(data);
			ko.cleanNode($('#' + areaId)[0]);
			

			
			
			
			var app = u.createApp({
				el: '#' + areaId,
				model: viewModel
			});
			
			return viewModel;
		}
	
	
	
	
	
	
	
	
	
	
	
	
	
	randomString = function (len) {
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		var maxPos = $chars.length;
		var pwd = '';
		for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	  }
		return pwd;
		}
	
	rowSelect = function(area){
		var row = menuViewModel.gridDataTable1.getFocusRow();
		areaId=area;
		
		
		
		var id = row.data.coa_id.value;
		var options = ip.getCommonOptions({"id":id});
		var columnName="";
		var url="";
		$.ajax({
			url: "/df/genCCID/getRightCloumn.do?tokenid=" + tokenid,
			type: 'GET',
			async: false,
			dataType: 'json',
			data: {"id":id,"pageInfo":"20,0","ajax":"noCache"},
			success: function (data) {
				
				//获得列名信息
				   columnName=data.regMap;
				
				//获得列数据信息
				url="/df/genCCID/getRightCloumn.do";
				$("#hahaha").html("");
				ip.initGrid(columnName, "hahaha", url, options, 1, false, false, false, false);
				
				
				
				
				
			}
		});	
		/*$("#hello").html("");
		var topgridData = columnName;
		topgridData.viewid = "125615271217321as";
		ip.initGrid(topgridData, "hello", url, options, 1, false, false, false, false);*/
		rightDataShowUP(columnName, url, options);
	}
	
	
	rightDataShowUP = function(columnName,url, options){
		$("#hello").html("");
		var topgridData = columnName;
		topgridData.viewid =  randomString(32);
		//ip.initGrid_ccid(columnName, "hello", url, options, 1, false, false, false, false,null);
		initGrid_ccid(columnName, "hello", url, options, 1, false, false, false, false,null);
		//ip.initGrid(columnName, "hello", url, options, 1, false, false, false, false);
		
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
		var table_name = $("#incode").val();
		if(table_name == "" || table_name == null){
			ip.ipInfoJump("转换表不可为空！","info");
			return;
		}
		
		$.ajax({
			url: "/df/genCCID/doBatchGenCCID.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"table_name":table_name,"ajax":"noCache"},
			success: function (data) {
				//校验处理提示
				if(data.check_error!=null){
					ip.ipInfoJump(data.check_error,"error");
				}
				
				if(data.no_exist_ele!=null){
					ip.ipInfoJump(data.no_exist_ele,"error");
				}
				
				//批量生成提示
				
				if(data.success!=null){
					ip.ipInfoJump(data.success,"success");
					
				}
				
				
				
			},
			error:function (data) {
				if(data.no_exist_ele!=null){
					ip.ipInfoJump(data.no_exist_ele,"error");
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
	var val1 = "";
	quickQuery1 = function (){  
		 user_write_ccid = $("#quickquery1").val();
		if(user_write_ccid==null || user_write_ccid==""){
			ip.ipInfoJump("请输入要生成的模板CCID！","info");	
		}else{
			//1.加载表头
			   //查询ccid
			$.ajax({
				url: "/df/genCCID/checkCCID.do?tokenid=" + tokenid,
				type: 'get',
				dataType: 'json',
				data: {"data_ccid":user_write_ccid,"ajax":"noCache"},
				success: function (data) {
					ccidResponseData=data;
					if(data == null){
						ip.ipInfoJump("此CCID不存在！","info");	
					}else{
						var coa_id=data.ccidDataInfo[0].coa_id;
						var options = ip.getCommonOptions({"id":coa_id});
						var columnName="";
						var url="";
						var finalData="";
						$.ajax({
							url: "/df/genCCID/getRightCloumn.do?tokenid=" + tokenid,
							type: 'GET',
							async: false,
							dataType: 'json',
							data: {"id":coa_id,"pageInfo":"20,0","ajax":"noCache"},
							success: function (data) {
								//获得列名信息
								   columnName=data.regMap;
								//获得列数据信息
								url="/df/genCCID/getRightCloumn.do";
								$("#hahaha").html("");
								ip.initGrid(columnName, "hahaha", url, options, 1, false, false, false, false);
								
								//viewModel.gridData1.removeAllRows();
								//viewModel.gridData1.setSimpleData(data.coainfo);
							    var sel_column=data.sel_column;
							    filterDataInfo=ccidResponseData.ccidDataInfo;
							    $.ajax({
									url: "/df/genCCID/checkCCID.do?tokenid=" + tokenid,
									type: 'get',
									dataType: 'json',
									data: {"data_ccid":user_write_ccid,"sel_column":sel_column,"ajax":"noCache"},
									success: function (data) {
										
										 $("#hello").html("");
											var topgridData = columnName;
											topgridData.viewid =  randomString(32);
											//ip.initGrid_ccid(columnName, "hello", url, options, 1, false, false, false, false,false,data.ccidDataInfo);
											initGrid_ccid(columnName, "hello", url, options, 1, false, false, false, false,false,data.ccidDataInfo);
										
									}
								});
								
							}
						});	
						
					}
					
					
					
					
					
				}
			});
			   
			
			
			
			
			
		}
		
		
		
		
		
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
