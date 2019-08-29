var dataGrid = {
	flag: 1,
	viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
	viewDetail: [{
		ui_detail_id: "{81F1586E-CD09-45CE-B58F-98BA0A482025}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: "text",
		query_relation_sign: null,
		is_nessary: "0",
		id: "dir_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "DIR",
		headerlevel: "1",
		name: "采购目录",
		ref_model: null,
		parent_id: null,
		field_index: "1"
	}, {
		ui_detail_id: "{FE17C63F-131B-4339-8CC6-05436DF06D69}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: "text",
		query_relation_sign: null,
		is_nessary: "0",
		id: "expfunc_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "EXPFUNC",
		headerlevel: "1",
		name: "功能分类",
		ref_model: null,
		parent_id: null,
		field_index: "2"
	}, {
		ui_detail_id: "{BD92A45B-D1C4-405A-803E-F880E9426226}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: "decimal",
		query_relation_sign: null,
		is_nessary: "0",
		id: "en_bis_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "EN_BIS",
		headerlevel: "1",
		name: "预算项目",
		ref_model: null,
		parent_id: null,
		field_index: "3"
	}, {
		ui_detail_id: "{631A9627-2417-4228-913F-CE2EC413392C}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: "treeassist",
		query_relation_sign: null,
		is_nessary: "0",
		id: "bp_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "BP",
		headerlevel: "2",
		name: "指标类型",
		ref_model: null,
		parent_id: "{BD92A45B-D1C4-405A-803E-F880E9426226}",
		field_index: "4"
	}, {
		ui_detail_id: "{2521E9C8-86D4-46B4-8180-C22D6C862DD4}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: "text",
		query_relation_sign: null,
		is_nessary: "0",
		id: "gp_agency_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "GP_AGENCY",
		headerlevel: "3",
		name: "中介机构",
		ref_model: null,
		parent_id: "{631A9627-2417-4228-913F-CE2EC413392C}",
		field_index: "5"
	}, {
		ui_detail_id: "{47704B88-77CC-4CDB-915F-E5962E2A2CA9}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: null,
		query_relation_sign: null,
		is_nessary: "0",
		id: "payee_account_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "PAYEE_ACCOUNT",
		headerlevel: "3",
		name: "收款人账户",
		ref_model: null,
		parent_id: "{631A9627-2417-4228-913F-CE2EC413392C}",
		field_index: "6"
	}, {
		ui_detail_id: "{CB1429C2-9E65-462A-97CA-A9C6A479767C}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: "multreeassist",
		query_relation_sign: null,
		is_nessary: "0",
		id: "bgtsource_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "BGTSOURCE",
		headerlevel: "2",
		name: "预算来源",
		ref_model: null,
		parent_id: "{BD92A45B-D1C4-405A-803E-F880E9426226}",
		field_index: "7"
	}, {
		ui_detail_id: "{0F8F91C5-FC84-4D21-8081-3186343C582D}",
		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
		visible: "true",
		width: "",
		disp_mode: null,
		query_relation_sign: null,
		is_nessary: "0",
		id: "gb_id",
		is_enabled: "0",
		sumflag: "fasle",
		source: "GB",
		headerlevel: "1",
		name: "政府采购标志",
		ref_model: null,
		parent_id: null,
		field_index: "8"
	}],
	viewCode: "001001003"
};
ip.initGrid(dataGrid, "more-header", "", {}, 0);




// function ipInfoJump(msg) {
// 	var success_info = $("#info-notice")[0];
// 	if (!success_info) {
// 		$("body").append('<div id="info-notice" class="info-notice">' + msg + '</div>');
// 	} else {
// 		$("#info-notice").text(msg);
// 	}
// 	$("#info-notice").css("display", "block");

// 	$("#info-notice").css("z-index", "9999");
// 	$("#info-notice").fadeOut(4000);
// }
// var more_header_data = {
// 	"mate": {
// 		"maxHeaderLevel": "3"
// 	},
// 	"moreHeader": [{
// 			"field": "bbbn",
// 			"title": "姓名+性别",
// 			"id": "bbb",
// 			"parent_id": "aaa",
// 			"headerLevel": "2",
// 			"startField": "name",
// 			"endField": "sex"
// 		}, {
// 			"field": "aaan",
// 			"title": "姓名+性别+年龄",
// 			"id": "aaa",
// 			"parent_id": "",
// 			"headerLevel": "3",
// 			"startField": "name",
// 			"endField": "age"
// 		}

// 	],
// 	"header": [{
// 		"field": "name",
// 		"title": "姓名",
// 		"id": "111",
// 		"parent_id": "bbb",
// 	}, {
// 		"field": "sex",
// 		"title": "性别",
// 		"id": "222",
// 		"parent_id": "bbb",
// 	}, {
// 		"field": "age",
// 		"title": "年龄",
// 		"id": "333",
// 		"parent_id": "aaa",
// 	}, {
// 		"field": "height",
// 		"title": "身高",
// 		"id": "444",
// 		"parent_id": "",
// 	}],
// 	"body": [{
// 		"field": "name",
// 		"title": "姓名",
// 		"id": "111",
// 		"parent_id": "bbb",
// 	}, {
// 		"field": "sex",
// 		"title": "性别",
// 		"id": "222",
// 		"parent_id": "bbb",
// 	}, {
// 		"field": "age",
// 		"title": "年龄",
// 		"id": "333",
// 		"parent_id": "aaa",
// 	}, {
// 		"field": "height",
// 		"title": "身高",
// 		"id": "444",
// 		"parent_id": "",
// 	}]
// }
// var ip = {};
// ip.changeData = function(data) {
// 	    ip.more_grid_data = data;
// 	    // data = data.viewDetail;
// 		var zTreeNodes1 = [];
// 		// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
// 		var setting1 = {
// 			check: {
// 				enable: true,
// 			},
// 			data: {
// 				simpleData: {
// 					enable: true,
// 					idKey: "id",
// 					pIdKey: "pId",
// 					rootPId: 0
// 				}
// 			}
// 		};
// 		//获取ztree对象
// 		var zTreeObj1 = $.fn.zTree.init($("#treeTest2"), setting1, data);
// 		//展开所有节点
// 		zTreeObj1.expandAll(true);
// 		return ip.classifyNode(zTreeObj1);
// 	}
// 	//将数据分成 子节点与父节点
// ip.classifyNode = function(tree) {
// 	ip.more_head_header = [];
// 	ip.more_head_parent_nodes = [];
// 	ip.more_head_all_data = tree.transformToArray(tree.getNodes());
// 	console.log(ip.more_head_all_data);
// 	//将数据分为 底级表头（ip.more_head_header） 和 高级表头（ip.more_head_parent_nodes）的数据
// 	for (var i = 0; i < ip.more_head_all_data.length; i++) {
// 		if (ip.more_head_all_data[i].isParent) {
// 			ip.more_head_parent_nodes.push(ip.more_head_all_data[i]);
// 		} else {
// 			ip.more_head_header.push(ip.more_head_all_data[i]);
// 		}
// 	}
// 	return ip.matchChildFatherNode(ip.more_head_parent_nodes, ip.more_head_header);
// }
// ip.matchChildFatherNode = function(parent, child) {
// 		var more_head_array = {};
// 		for (var i = 0; i < parent.length; i++) {
// 			for (var j = 0; j < child.length; j++) {
// 				for (var k = 0; k < child[j].getPath().length; k++) {
// 					if (child[j].getPath()[k].id == parent[i].id) {
// 						if (more_head_array[parent[i].id] == undefined) {
// 							more_head_array[parent[i].id] = [];
// 						}
// 						more_head_array[parent[i].id].push(child[j]);
// 					}
// 				}
// 			}
// 		}
// 		console.log(more_head_array);
// 		return ip.creatMoreHeadInfo(more_head_array);
// 	}
// 	//创建多表头数据
// ip.creatMoreHeadInfo = function(more_head_array) {
// 	var max_head_level = [];
// 	var more_head_info = [];
// 	var node = "";
// 	for (node in more_head_array) {
// 		var first_node = more_head_array[node][0];
// 		var last_node = more_head_array[node][more_head_array[node].length - 1];
// 		var more_head = [];
// 		for (var i = 0; i < more_head_array[node].length; i++) {
// 			for (var j = 0; j < 5; j++) {
// 				if (more_head_array[node][i].getPath()[j] !== undefined) {
// 					if (more_head_array[node][i].getPath()[j].id === node) {
// 						more_head.push(more_head_array[node][i].getPath().length - j);
// 					}
// 				}
// 			}
// 		}

// 		//获取子节点中父节点层级最大的：即父级的level
// 		var max_more_header = Math.max.apply(null, more_head);
// 		var current_parent_node = ip.getNodeInfo(node);
// 		var more_head_node = {
// 			"field": current_parent_node.field,
// 			"name": current_parent_node.name,
// 			"id": current_parent_node.id,
// 			"parent_id": current_parent_node.pId,
// 			"headerLevel": max_more_header,
// 			"startField": first_node.field,
// 			"endField": last_node.field
// 		}
// 		more_head_info.push(more_head_node);
// 		max_head_level.push(max_more_header);
// 	}
//     var max_level = Math.max.apply(null, max_head_level);
// 	var data = {
// 		"viewid": ip.more_grid_data.viewid,
// 		"mate": {
// 			"maxHeaderLevel": max_level,
// 		},
// 		"header": ip.more_head_header,
// 		"moreHeader": more_head_info
// 	}
// 	return data;
// }

// //通过id获取数据信息
// ip.getNodeInfo = function(id) {
// 	for (var i = 0; i < ip.more_head_all_data.length; i++) {
// 		if (ip.more_head_all_data[i].id === id) {
// 			return ip.more_head_all_data[i];
// 		}
// 	}
// }

// function createMoreHeaderGrid(datas) {
// 	var data = ip.changeData(datas);
// 	var viewModelMore = {
// 		moreGridData: new u.DataTable({
// 			meta: ''
// 		}),
// 	}
// 	var meta = '{';
// 	for (var j = 0; j < data.header.length; j++) {
// 		meta += '"' + data.header[j].field + '"';
// 		meta += ':{}';
// 		if (j < data.header.length - 1) {
// 			meta += ",";
// 		}
// 	}
// 	meta += "}";
// 	viewModelMore.moreGridData.meta = JSON.parse(meta);
// 	var innerHTML = "<div u-meta='" + '{"id":"more-header-grid","data":"moreGridData","type":"grid","keyField":"theId","parentKeyField":"parentId","maxHeaderLevel":' + data.mate.maxHeaderLevel + ',"showNumCol": true,"multiSelect": true,"headerHeight":32,"rowHeight":32,"sumRowHeight":32}' + "'>";
// 	for (var h = 0; h < data.moreHeader.length; h++) {
// 		innerHTML += "<div options='" + '{"field":"' + data.moreHeader[h].field + '","title":"' + data.moreHeader[h].name + '","headerLevel":"' + data.moreHeader[h].headerLevel + '","startField":"' + data.moreHeader[h].startField + '","endField":"' + data.moreHeader[h].endField + '"}' + "'></div>";
// 	}
// 	for (var i = 0; i < data.header.length; i++) {
// 		innerHTML += "<div options='" + '{"field":"' + data.header[i].field + '","dataType":"String","title":"' + data.header[i].name + '"}' + "'></div>";
// 	}
// 	innerHTML += "</div>";
// 	$('#more-header').append(innerHTML);
// 	ko.cleanNode($('#more-header')[0]);
// 	var app = u.createApp({
// 		el: '#more-header',
// 		model: viewModelMore
// 	});
// 	viewModelMore.moreGridData.setSimpleData(data.body);
// }

// var newCreateGrid = function(data) {
// 	data = createMoreHeaderGrid(data);
// 	var viewId = data.viewid.substring(1, 37);
// 	var meta = '{';
// 	for (var j = 0; j < data.header.length; j++) {
// 		meta += '"' + data.header[j].id.toLowerCase() + '"';
// 		meta += ":{}";
// 		if (j < data.header.length - 1) {
// 			meta += ",";
// 		}
// 	}
// 	meta += "}";
// 	viewModel.gridData.meta = JSON.parse(meta);
// 	if (selectFlag == undefined) {
// 		selectFlag = true;
// 	}
// 	if (sumRowFlag == undefined) {
// 		sumRowFlag = true;
// 	}
// 	if (sumRowFlag) {
// 		innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData","type":"grid","editType":"string","onRowSelected":"onRowSelectedFun","onRowUnSelected":"onRowSelectedFun","autoExpand":false,"needLocalStorage":true,"multiSelect": ' + selectFlag + ',"showNumCol": true,"showSumRow": true,"sumRowFirst":true,"sumRowFixed": true,"headerHeight":32,"rowHeight":32,"sumRowHeight":32,"cancelFocus":false,"onBeforeRowSelected":"' + areaId + '_onRowSelected","sortable":true,"maxHeaderLevel":' + data.mate.maxHeaderLevel + '}' + "'>";
// 	} else {
// 		innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData","type":"grid","editType":"string","onRowSelected":"onRowSelectedFun","onRowUnSelected":"onRowSelectedFun","autoExpand":false,"needLocalStorage":true,"multiSelect": ' + selectFlag + ',"showNumCol": true,"headerHeight":32,"rowHeight":32,"cancelFocus":false,"onBeforeRowSelected":"' + areaId + '_onRowSelected","sortable":true,"maxHeaderLevel":' + data.mate.maxHeaderLevel + '}' + "'>";
// 	}
// 	// "onSortFun":"sortFun", 	去除全局排序 仅当前页排序
// 	// innerHTML = "<div u-meta='" + '{"id":"' + viewId + '","data":"gridData","type":"grid","editType":"string","onRowSelected":"onRowSelectedFun","onRowUnSelected":"onRowSelectedFun","autoExpand":false,"needLocalStorage":true,"multiSelect": ' + selectFlag + ',"showNumCol": true,"showSumRow": true,"sumRowFirst":true,"sumRowFixed": true,"headerHeight":32,"rowHeight":32,"sumRowHeight":32,"cancelFocus":false,"onBeforeRowSelected":"' + areaId + '_onRowSelected","sortable":true}' + "'>";
// 	innerHTML += "<div options='" + '{"field":"operate","visible":' + operateFlag + ',"dataType":"String","editType":"string","title":"操作","fixed":true,"width": 150,"renderType":"' + areaId + '"}' + "'></div>";
// 	for (var h = 0; h < data.moreHeader.length; h++) {
// 		innerHTML += "<div options='" + '{"field":"' + data.moreHeader[h].field + '","title":"' + data.moreHeader[h].name + '","headerLevel":"' + data.moreHeader[h].headerLevel + '","startField":"' + data.moreHeader[h].startField + '","endField":"' + data.moreHeader[h].endField + '"}' + "'></div>";
// 	}
// 	var item = [];
// 	for (var i = 0; i < data.header.length; i++) {
// 		if (data.header[i].width == "") {
// 			data.header[i].width = 200;
// 		}
// 		// canVisible = ((data.header[i].visible == false) ? true : false);
// 		if (data.header[i].sumflag == "true") {
// 			viewModel.totals.push(data.header[i].id);
// 			viewModel[data.header[i].id] = "";
// 			if (data.header[i].disp_mode == "decimal") {
// 				var num_data = {
// 					"field": data.header[i].id,
// 					"name": data.header[i].name
// 				};

// 				item.push(num_data);
// 				viewModel.sumArry(item);
// 				innerHTML += "<div options='" + '{"field":"' + data.header[i].id.toLowerCase() + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"String","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","width": ' + data.header[i].width + ',"sumCol":true,"sumRenderType":"summ","renderType":"dealThousandsGrid"}' + "'></div>";
// 			} else {
// 				innerHTML += "<div options='" + '{"field":"' + data.header[i].id.toLowerCase() + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"String","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","width": ' + data.header[i].width + ',"sumCol":true,"sumRenderType":"summ","renderType":"' + areaId + '_render"}' + "'></div>";
// 			}
// 		} else {
// 			if (data.header[i].disp_mode == "decimal") {
// 				innerHTML += "<div options='" + '{"field":"' + data.header[i].id.toLowerCase() + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"String","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","width": ' + data.header[i].width + ',"renderType":"dealThousandsGrid"}' + "'></div>";
// 			} else {
// 				innerHTML += "<div options='" + '{"field":"' + data.header[i].id.toLowerCase() + '","editType":"string","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"String","title":"' + data.header[i].name + '","headerLevel":"' + data.header[i].headerLevel + '","renderType":"' + areaId + '_render","width": ' + data.header[i].width + '}' + "'></div>";
// 			}
// 		}
// 	}
// 	innerHTML += "</div>";
// 	if (pageFlag == undefined) {
// 		pageFlag = true;
// 	}
// 	innerHTML += "<div id='ip-grid-footer-area-" + areaId + "' class='text-right' style='height: 36px;'><div id='ip-grid-footer-area-sum-" + areaId + "' class='fl' style='margin: 10px 0 5px 5px;'></div>";
// 	if (pageFlag) {
// 		innerHTML += "<div id='pagination' style='float: right;' class='u-pagination' u-meta='" + '{"type":"pagination","data":"gridData","pageList":[50,100,500,1000],"sizeChange":"sizeChangeFun","pageChange":"pageChangeFun"}' + "'></div>";
// 	}
// 	innerHTML += "</div>";
// 	$('#' + areaId).append(innerHTML);
// 	// ip.loading(true,areaId);
// };

// $(function() {
// 	var datas = [{
// 		"id": "01",
// 		"pId": "root",
// 		"name": "f1",
// 		"field": "demo01"
// 	}, {
// 		"id": "02",
// 		"pId": "root",
// 		"name": "f2",
// 		"field": "demo02"
// 	}, {
// 		"id": "101",
// 		"pId": "01",
// 		"name": "2级1",
// 		"field": "demo101"
// 	}, {
// 		"id": "10101",
// 		"pId": "101",
// 		"name": "3级1",
// 		"field": "demo10101"
// 	}, {
// 		"id": "10102",
// 		"pId": "101",
// 		"name": "3级2",
// 		"field": "demo10102"
// 	}, {
// 		"id": "102",
// 		"pId": "01",
// 		"name": "2级2",
// 		"field": "demo102"
// 	}, {
// 		"id": "201",
// 		"pId": "02",
// 		"name": "2级1",
// 		"field": "demo201"
// 	}];
// 	// createMoreHeaderGrid(more_header_data);
// 	createMoreHeaderGrid(datas);
// 	// var dataGrid = {
// 	// 	flag: 1,
// 	// 	viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 	viewDetail: [{
// 	// 		ui_detail_id: "{81F1586E-CD09-45CE-B58F-98BA0A482025}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: "text",
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "dir_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "DIR",
// 	// 		headerlevel: "1",
// 	// 		name: "采购目录",
// 	// 		ref_model: null,
// 	// 		parent_id: null,
// 	// 		field_index: "1"
// 	// 	}, {
// 	// 		ui_detail_id: "{FE17C63F-131B-4339-8CC6-05436DF06D69}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: "text",
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "expfunc_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "EXPFUNC",
// 	// 		headerlevel: "1",
// 	// 		name: "功能分类",
// 	// 		ref_model: null,
// 	// 		parent_id: null,
// 	// 		field_index: "2"
// 	// 	}, {
// 	// 		ui_detail_id: "{BD92A45B-D1C4-405A-803E-F880E9426226}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: "decimal",
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "en_bis_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "EN_BIS",
// 	// 		headerlevel: "1",
// 	// 		name: "预算项目",
// 	// 		ref_model: null,
// 	// 		parent_id: null,
// 	// 		field_index: "3"
// 	// 	}, {
// 	// 		ui_detail_id: "{631A9627-2417-4228-913F-CE2EC413392C}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: "treeassist",
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "bp_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "BP",
// 	// 		headerlevel: "2",
// 	// 		name: "指标类型",
// 	// 		ref_model: null,
// 	// 		parent_id: "{BD92A45B-D1C4-405A-803E-F880E9426226}",
// 	// 		field_index: "4"
// 	// 	}, {
// 	// 		ui_detail_id: "{2521E9C8-86D4-46B4-8180-C22D6C862DD4}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: "text",
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "gp_agency_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "GP_AGENCY",
// 	// 		headerlevel: "3",
// 	// 		name: "中介机构",
// 	// 		ref_model: null,
// 	// 		parent_id: "{631A9627-2417-4228-913F-CE2EC413392C}",
// 	// 		field_index: "5"
// 	// 	}, {
// 	// 		ui_detail_id: "{47704B88-77CC-4CDB-915F-E5962E2A2CA9}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: null,
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "payee_account_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "PAYEE_ACCOUNT",
// 	// 		headerlevel: "3",
// 	// 		name: "收款人账户",
// 	// 		ref_model: null,
// 	// 		parent_id: "{631A9627-2417-4228-913F-CE2EC413392C}",
// 	// 		field_index: "6"
// 	// 	}, {
// 	// 		ui_detail_id: "{CB1429C2-9E65-462A-97CA-A9C6A479767C}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: "multreeassist",
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "bgtsource_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "BGTSOURCE",
// 	// 		headerlevel: "2",
// 	// 		name: "预算来源",
// 	// 		ref_model: null,
// 	// 		parent_id: "{BD92A45B-D1C4-405A-803E-F880E9426226}",
// 	// 		field_index: "7"
// 	// 	}, {
// 	// 		ui_detail_id: "{0F8F91C5-FC84-4D21-8081-3186343C582D}",
// 	// 		viewid: "{CE64168C-0D9A-459F-A5B4-8BCD109B3617}",
// 	// 		visible: "true",
// 	// 		width: "",
// 	// 		disp_mode: null,
// 	// 		query_relation_sign: null,
// 	// 		is_nessary: "0",
// 	// 		id: "gb_id",
// 	// 		is_enabled: "0",
// 	// 		sumflag: "fasle",
// 	// 		source: "GB",
// 	// 		headerlevel: "1",
// 	// 		name: "政府采购标志",
// 	// 		ref_model: null,
// 	// 		parent_id: null,
// 	// 		field_index: "8"
// 	// 	}],
// 	// 	viewCode: "001001003"
// 	// };
// 	// newCreateGrid(dataGrid);
// 	var datas = {
// 		"grid": {
// 			"viewId": "11",
// 			"totalPages": 5,
// 			"totalElements": 22,
// 			"header": [{
// 				"field": "aaan",
// 				"title": "姓名+性别+年龄",
// 				"visible": "true",
// 				"headerLevel": "2",
// 				"width": "200",
// 				"fixed": false,
// 				"id": "aaa",
// 				"parent_id": "",
// 				"child": [],
// 				"disp_mode": ""
// 			}, {
// 				"field": "bbbn",
// 				"title": "姓名+性别",
// 				"visible": "true",
// 				"headerLevel": "2",
// 				"width": "200",
// 				"fixed": false,
// 				"id": "bbb",
// 				"parent_id": "aaa",
// 				"child": [],
// 				"disp_mode": ""
// 			}, {
// 				"field": "name",
// 				"title": "姓名",
// 				"visible": "true",
// 				"headerLevel": "1",
// 				"width": "200",
// 				"fixed": false,
// 				"id": "111",
// 				"parent_id": "bbb",
// 				"child": [],
// 				"disp_mode": ""
// 			}, {
// 				"field": "sex",
// 				"title": "性别",
// 				"visible": "true",
// 				"headerLevel": "1",
// 				"width": "200",
// 				"id": "222",
// 				"parent_id": "bbb",
// 				"child": [],
// 				"disp_mode": ""
// 			}, {
// 				"field": "age",
// 				"title": "年龄",
// 				"visible": "true",
// 				"headerLevel": "1",
// 				"width": "200",
// 				"sumFlag": "1",
// 				"id": "333",
// 				"parent_id": "aaa",
// 				"child": [],
// 				"disp_mode": "decimal"

// 			}, {
// 				"field": "height",
// 				"title": "身高",
// 				"visible": "true",
// 				"headerLevel": "1",
// 				"width": "200",
// 				"sumFlag": "1",
// 				"id": "444",
// 				"parent_id": "",
// 				"child": [],
// 				"disp_mode": "decimal"
// 			}],
// 			"body": [{
// 				"name": "hanmeimei",
// 				"sex": "女",
// 				"age": "24",
// 				"height": "17555.34"
// 			}, {
// 				"name": "hanmeimei",
// 				"sex": "女",
// 				"age": "24",
// 				"height": "17555.3"
// 			}, {
// 				"name": "hanmeimei",
// 				"sex": "女",
// 				"age": "24",
// 				"height": "17555.345"
// 			}, {
// 				"name": "hanmeimei",
// 				"sex": "女",
// 				"age": "24",
// 				"height": "175"
// 			}, {
// 				"name": "hanmeimei",
// 				"sex": "女",
// 				"age": "24",
// 				"height": "175"
// 			}]
// 		},
// 		"search": {
// 			"viewId": "11",
// 			"data": [{
// 				"id": "name",
// 				"name": "名字",
// 				"showType": "input",
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "sex",
// 				"name": "性别",
// 				"showType": "radio",
// 				"data": [{
// 					"name": "女",
// 					"value": "0"
// 				}, {
// 					"name": "男",
// 					"value": "0"
// 				}],
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "dutys",
// 				"name": "职务",
// 				"showType": "tree",
// 				"source": "RZ",
// 				"data": {
// 					"treeData": [{
// 						"id": "01",
// 						"pid": "root",
// 						"title": "Parent1",
// 						"code": "0101"
// 					}, {
// 						"id": "02",
// 						"pid": "root",
// 						"title": "Parent2",
// 						"code": "0202"
// 					}, {
// 						"id": "101",
// 						"pid": "01",
// 						"title": "Child11",
// 						"code": "101101"
// 					}, {
// 						"id": "102",
// 						"pid": "01",
// 						"title": "mChild12",
// 						"code": "102102"
// 					}, {
// 						"id": "201",
// 						"pid": "02",
// 						"title": "Child21",
// 						"code": "201201"
// 					}]
// 				},
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "unite",
// 				"name": "单位五",
// 				"showType": "Checktree",
// 				"source": "RZ1",
// 				"visible": "true",
// 				"editable": "false"

// 			}, {
// 				"id": "money",
// 				"name": "金额",
// 				"showType": "money",
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "moneyRegion",
// 				"name": "金额区间",
// 				"showType": "moneyRegion",
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "hobby",
// 				"name": "爱好",
// 				"showType": "select",
// 				"data": [{
// 					"name": "JS",
// 					"value": "1"
// 				}, {
// 					"name": "HTML",
// 					"value": "2"
// 				}],
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "date",
// 				"name": "日期",
// 				"showType": "date",
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "dateRegion",
// 				"name": "日期区间",
// 				"showType": "dateRegion",
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "age",
// 				"name": "年龄",
// 				"showType": "number",
// 				"visible": "true",
// 				"editable": "false"
// 			}, {
// 				"id": "works",
// 				"name": "考勤",
// 				"showType": "checkbox",
// 				"data": [{
// 					"name": "一月",
// 					"value": "1"
// 				}, {
// 					"name": "二月",
// 					"value": "2"
// 				}],
// 				"visible": "true",
// 				"editable": "false"
// 			}, ]
// 		},
// 		"edit": []
// 	};
// 	var set_data = {
// 			"age-11": "11",
// 			"date-11": "2017-03-08",
// 			"duty-11": {
// 				"id": "01",
// 				"name": "Parent1"
// 			},
// 			"dutys-11": {
// 				"id": "02",
// 				"name": "Parent2"
// 			},
// 			"hobby-11": "1",
// 			"name-11": "333",
// 			"sex-11": "1",
// 			"works-11": [1, 2]
// 		}
// 	createGrid(dataGrid.viewDetail,"grid-area");
// 	// createGrid(datas.grid, "grid-area", "true");
// 	var area_data = createArea(datas.search.data, "search", datas.search.viewId, "test");
// 	console.log(area_data);
// 	var m = getAreaDate(area_data);
// 	console.log(m);
// 	console.log(set_data);
// 	setAreaData(area_data, set_data);
// });

// function setAreaData(area_data, set_data) {
// 	for (var i = 0; i < area_data.length; i++) {
// 		switch (area_data[i].type) {
// 			case "input":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
// 				break;
// 			case "number":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
// 				break;
// 			case "radio":
// 				$("input:radio[value='" + set_data[area_data[i].id] + "']").attr('checked', 'true');
// 				break;
// 			case "select":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
// 				break;
// 			case "checkbox":
// 				if (set_data[area_data[i].id].length > 0) {
// 					for (var m = 0; m < set_data[area_data[i].id].length; m++) {
// 						$("input[value='" + set_data[area_data[i].id][m] + "']").prop("checked", 'true');
// 					}
// 				}
// 				break;
// 			case "date":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id]);
// 				break;
// 			case "tree":
// 				$("#" + area_data[i].id).val(set_data[area_data[i].id].name);
// 				$("#" + area_data[i].id).attr("name", set_data[area_data[i].id].id);
// 				break;
// 		}
// 	}
// }

// function fun11(obj) {
// 	obj.element.innerHTML = '<a id="' + obj.rowIndex + '" onclick="editFun11(this.id)" class="other-fun">编辑</a><span class="separator">|</span><a id="' + obj.rowIndex + '" onclick="delFun11(this.id)" class="other-fun">删除</a>';
// };

// function editFun11(id) {
// 	alert(id);
// 	alert("edit");
// }

// function delFun11(id) {
// 	alert("del");
// }

// function getAreaDate(data) {
// 	var area_data = {};
// 	for (var i = 0; i < data.length; i++) {
// 		switch (data[i].type) {
// 			case "input":
// 				var value = $("#" + data[i].id).val();
// 				area_data[data[i].id] = value;
// 				break;
// 			case "number":
// 				var value = $("#" + data[i].id).val();
// 				area_data[data[i].id] = value;
// 				break;
// 			case "radio":
// 				var value = $("input[name='" + data[i].id + "']:checked").val();
// 				area_data[data[i].id] = value;
// 				break;
// 			case "select":
// 				var value = $("#" + data[i].id).val();
// 				area_data[data[i].id] = value;
// 				break;
// 			case "checkbox":
// 				var check_value = [];
// 				var check_values = $("input[name='" + data[i].id + "']:checked");
// 				if (check_values.length > 0) {
// 					for (var i = 0; i < check_values.length; i++) {
// 						check_value.push(check_values[i].value);
// 					}
// 				}
// 				area_data[data[i].id] = check_value;
// 				break;
// 			case "tree":
// 				var tree_info = $("#" + data[i].id).val();
// 				var space_position = tree_info.indexOf(" ");
// 				var value = {};
// 				value["code"] = tree_info.substring("0", space_position);
// 				value["name"] = tree_info.substring(space_position + 1);
// 				value["id"] = $("#" + data[i].id).attr("name");
// 				area_data[data[i].id] = value;
// 				break;
// 			case "date":
// 				var value = $("#" + data[i].id).val();
// 				area_data[data[i].id] = value;
// 				break;
// 			case "money":
// 				var value = $("#" + data[i].id).val();
// 				area_data[data[i].id] = value;
// 				break;
// 			case "Checktree":
// 				// var value = {};
// 				// 	value["name"] = $("#" + data[i].id).val();
// 				// 	value["id"] = $("#" + data[i].id).attr("name");

// 				area_data[data[i].id] = $("#" + data[i].id + "-check").val();
// 				break;
// 			case "moneyRegion":
// 				var money_values = [];
// 				for (var j = 1; j < 3; j++) {
// 					var money_value = $("#" + data[i].id + j).val();
// 					money_values.push(money_value);
// 				}
// 				var money_object = money_values.join(",");
// 				area_data[data[i].id] = money_object;
// 				break;
// 			case "dateRegion":
// 				var date_values = [];
// 				for (var k = 1; k < 3; k++) {
// 					var date_value = $("#" + data[i].id + k).val();
// 					date_values.push(date_value);
// 				}
// 				var date_object = money_values.join(",");
// 				area_data[data[i].id] = date_object;
// 				break;
// 		}
// 	}
// 	return area_data;
// }

// function dealThousands(value) {
// 	var num = "";
// 	if (value.indexOf(".") == -1) {
// 		num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
// 			return s + ',';
// 		});
// 	} else {
// 		num = value.replace(/(\d)(?=(\d{3})+\.)/g, function(s) {
// 			return s + ',';
// 		});
// 	}
// 	return num;
// }

// function dealThousandsGrid(obj) {
// 	console.log(obj);
// 	var value = obj.value;
// 	var num = "";
// 	value = parseFloat(value).toFixed(2);
// 	if (value.indexOf(".") == -1) {
// 		num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
// 			return s + ',';
// 		});
// 	} else {
// 		num = value.replace(/(\d)(?=(\d{3})+\.)/g, function(s) {
// 			return s + ',';
// 		});
// 	}
// 	obj.element.innerHTML = '<p class="text-right"><span>￥</span>' + num + '</p>';
// }

// sumArry = [];

// function createGrid(data, viewId, checkboxFlag) {
// 	var viewModel = {
// 		gridData: new u.DataTable({
// 			meta: ''
// 		}),
// 	};
// 	viewModel.createGrid = function(data, viewId, checkboxFlag) {
// 		console.log(data);
// 		var meta = '{';
// 		for (var j = 0; j < data.header.length; j++) {
// 			meta += '"' + data.header[j].field + '"';
// 			meta += ':{}';
// 			if (j < data.header.length - 1) {
// 				meta += ",";
// 			}
// 		}
// 		meta += "}";
// 		viewModel.gridData.meta = JSON.parse(meta);
// 		var innerHTML = "<div u-meta='" + '{"id":"' + data.viewId + '","data":"gridData","onRowSelected":"onRowSelectedFun","type":"grid","autoExpand":false,"needLocalStorage":true,"showSumRow":true,"onSortFun":"sortFun","sumRowFirst":true,"showNumCol": true,"headerHeight":32,"rowHeight":32,"sumRowHeight":32}' + "'>";
// 		innerHTML += "<div options='" + '{"field":"operate","dataType":"String","title":"操作","editType":"string","width": 150,"renderType":"fun' + data.viewId + '"}' + "'></div>";
// 		for (var i = 0; i < data.header.length; i++) {
// 			canVisible = ((data.header[i].visible == false) ? true : false);
// 			if (data.header[i].sumFlag == "1") {
// 				viewModel.totals = "";
// 				viewModel[data.header[i].field + "_total"] = 0;
// 				if (data.header[i].disp_mode == "decimal") {
// 					sumArry.push(data.header[i].field);
// 					innerHTML += "<div options='" + '{"field":"' + data.header[i].field + '","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"String","title":"' + data.header[i].title + '","headerLevel":"' + data.header[i].headerLevel + '","editType":"string","width": ' + data.header[i].width + ',"sumCol":true,"sumRenderType":"summ","renderType":"dealThousandsGrid"}' + "'></div>";
// 				} else {
// 					innerHTML += "<div options='" + '{"field":"' + data.header[i].field + '","visible":' + data.header[i].visible + ',"canVisible":' + data.header[i].visible + ',"dataType":"String","title":"' + data.header[i].title + '","headerLevel":"' + data.header[i].headerLevel + '","editType":"string","width": ' + data.header[i].width + ',"sumCol":true,"sumRenderType":"summ"}' + "'></div>";
// 				}
// 			} else {
// 				innerHTML += "<div options='" + '{"field":"' + data.header[i].field + '","canVisible":' + canVisible + ',"dataType":"String","title":"' + data.header[i].title + '","headerLevel":"' + data.header[i].headerLevel + '","editType":"string","width": ' + data.header[i].width + '}' + "'></div>";
// 			}
// 		}
// 		innerHTML += "</div>";

// 		innerHTML += "<div class='text-right' style='height: 36px;'><div id='pagination' style='float: right;' class='u-pagination' u-meta='" + '{"type":"pagination","data":"gridData","pageList":[50,100,500,1000],"sizeChange":"sizeChangeFun","pageChange":"pageChangeFun"}' + "'></div></div>";
// 		$('#' + viewId).append(innerHTML);
// 	}
// 	summ = function(obj) {
// 		console.log("}}}}}}}}}}}}}}}");
// 		obj.element.parentNode.style.height = 'auto';
// 		obj.element.parentNode.innerHTML = '<div class = "text-left" style="height:15px; line-height:15px;">总计：' + viewModel.totals + '</div><div class = "text-left" style="height:15px; line-height:15px;">小计：' + obj.value + '</div>';
// 	}
// 	sortFun = function(field, sort) {
// 		console.log(field);
// 		console.log(sort);
// 		if (sort == undefined) {
// 			console.log("1111111");
// 		}
// 		alert("ssssssssssssssss");
// 	}
// 	onRowSelectedFun = function(obj) {
// 		var selected_nodes = viewModel.gridData.getSelectedRows();
// 		console.log(selected_nodes);
// 		console.log(sumArry);
// 		var show_sum = [];
// 		for (var sa = 0; sa < sumArry.length; sa++) {
// 			var sum_all = 0;
// 			var sum_field = sumArry[sa];
// 			for (var sn = 0; sn < selected_nodes.length; sn++) {
// 				console.log(parseFloat(selected_nodes[sn].data[sumArry[sa]].value));
// 				sum_all += parseFloat(selected_nodes[sn].data[sumArry[sa]].value);
// 			}
// 			var sum_obj = {
// 				"num": dealThousands(sum_all.toString()),
// 				"filed": sum_field
// 			}
// 			show_sum.push(sum_obj);
// 		}
// 		console.log(show_sum);
// 	}
// 	viewModel.pageChangeFun = function(pageIndex) {
// 		viewModel.gridData.pageIndex(pageIndex);
// 		viewModel.getDataTableStaff();
// 	}
// 	viewModel.sizeChangeFun = function(size) {
// 		viewModel.gridData.pageSize(size);
// 		viewModel.gridData.pageIndex("0");
// 		viewModel.getDataTableStaff();
// 	}
// 	viewModel.getDataTableStaff = function() {
// 		var grid_data = {
// 			"totalPages": 5,
// 			"totalElements": 22,
// 			"setting": {
// 				"showNumCol": "false",
// 				"multiSelect": "false",
// 				"columnMenu": "true",
// 				"sortable": "true",
// 				"showTree": "false",
// 			},
// 			"header": [{
// 				"field": "name",
// 				"title": "姓名",
// 				"visible": "true",
// 				"headerLevel": "1",
// 				"width": "200"
// 			}, {
// 				"field": "sex",
// 				"title": "性别",
// 				"visible": "true",
// 				"headerLevel": "1"
// 			}, {
// 				"field": "age",
// 				"title": "年龄",
// 				"visible": "true",
// 				"headerLevel": "1"
// 			}],
// 			"body": [{
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}, {
// 				"name": "dingyle",
// 				"sex": "男",
// 				"age": "25"
// 			}]
// 		}
// 		viewModel.gridData.setSimpleData(grid_data.body);
// 		viewModel.gridData.setRowUnSelect(0);
// 		viewModel.gridData.totalPages(grid_data.totalPages);
// 		viewModel.gridData.totalRow(grid_data.totalElements);
// 	}
// 	viewModel.createGrid(data, viewId, checkboxFlag);
// 	ko.cleanNode($('#' + viewId)[0]);
// 	var app = u.createApp({
// 		el: '#' + viewId,
// 		model: viewModel
// 	});
// 	viewModel.gridData.pageIndex("0");
// 	viewModel.gridData.pageSize("5");
// 	viewModel.gridData.setSimpleData(data.body);
// 	viewModel.gridData.setRowUnSelect(0);
// 	viewModel.gridData.totalPages(data.totalPages);
// 	viewModel.gridData.totalRow(data.totalElements);
// }
// // 搜索、编辑区域动态生成 createArea（）
// // areaType or edit
// // creatData： 创建区域的json数据
// // viewId：视图ID
// // areaId：创建区域的ID
// // url: 树形辅助录入获取数据的url
// // "visible": "false",
// // "editable": "false"
// function createArea(creatData, areaType, viewId, areaId) {
// 	var n = areaType == "edit" ? 6 : 4;
// 	var html = '';
// 	var aims = [];
// 	for (var i = 0; i < creatData.length; i++) {
// 		switch (creatData[i].showType) {
// 			case "input":
// 				if (creatData[i].visible == "true") {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="' + creatData[i].id + '" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
// 						'<div class="col-md-8 ip-input-group">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input type="text" class="form-control" id="' + creatData[i].id + '-' + viewId + '">';
// 					} else {
// 						html += '<input type="text" class="form-control" id="' + creatData[i].id + '-' + viewId + '" disabled>';
// 					}
// 					html += '</div></div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "input"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "number":
// 				if (creatData[i].visible == "true") {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
// 						'<div class="col-md-8 ip-input-group">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '">';
// 					} else {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" disabled>';
// 					}
// 					html += '</div></div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "number"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "money":
// 				if (creatData[i].visible == "true") {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
// 						'<div class="col-md-8 ip-input-group">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" onblur="moneyQuset(this.id)">';
// 					} else {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '" onblur="moneyQuset(this.id)" disabled>';
// 					}
// 					html += '</div></div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "money"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "moneyRegion":
// 				if (creatData[i].visible == "true") {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
// 						'<div class="col-md-3 ip-input-group">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="moneyQuset(this.id)">';
// 					} else {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="moneyQuset(this.id)" disabled>';
// 					}
// 					html += '</div>' +
// 						'<div class="col-md-2 ip-to-font">至</div>' +
// 						'<div class="col-md-3 ip-input-group">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="moneyQuset(this.id)">';
// 					} else {
// 						html += '<input type="number" class="form-control" id="' + creatData[i].id + '-' + viewId + '1" onblur="moneyQuset(this.id)" disabled>';
// 					}
// 					html += '</div></div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "moneyRegion"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "radio":
// 				if (creatData[i].visible == "true") {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
// 						'<div class="col-md-8 ip-input-group">';
// 					for (var k = 0; k < creatData[i].data.length; k++) {
// 						if (creatData[i].editable == "true") {
// 							html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="' + creatData[i].data[k].value + '">' + creatData[i].data[k].name + '</label>';
// 						} else {
// 							html += '<input type="radio" name="' + creatData[i].id + '-' + viewId + '" value="' + creatData[i].data[k].value + '" disabled>' + creatData[i].data[k].name + '</label>';
// 						}
// 					}
// 					html += '</div></div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "radio"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "select":
// 				if (creatData[i].visible == "true") {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
// 						'<div class="col-md-8 ip-input-group">';
// 					if (creatData[i].editable == "true") {
// 						html += '<select class="form-control" class="col-md-8" id="' + creatData[i].id + '-' + viewId + '">';
// 					} else {
// 						html += '<select class="form-control" class="col-md-8" id="' + creatData[i].id + '-' + viewId + '" disabled>';
// 					}
// 					for (var m = 0; m < creatData[i].data.length; m++) {
// 						html += '<option value="' + creatData[i].data[m].value + '">' + creatData[i].data[m].name + '</option>';
// 					}
// 					html += '</select></div></div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "select"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "checkbox":
// 				if (creatData[i].visible == "true") {

// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="" class="col-md-4 text-right">' + creatData[i].name + '</label>' +
// 						'<div class="col-md-8 ip-input-group">';
// 					for (var p = 0; p < creatData[i].data.length; p++) {
// 						html += '<input type="checkbox" name="' + creatData[i].id + '-' + viewId + '" value="' + creatData[i].data[p].value + '">' + creatData[i].data[p].name + '</label>';
// 					}
// 					html += '</div></div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "checkbox"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "date":
// 				if (creatData[i].visible) {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="dtp_input2" class="col-md-4 control-label text-right">' + creatData[i].name + '</label>' +
// 						'<div class="input-group date form_date col-md-8 ip-input-group" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '" data-link-format="yyyy-mm-dd">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="">' +
// 							// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
// 							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
// 					} else {
// 						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="" disabled>' +
// 							// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
// 							'<span class="input-group-addon"><button class="glyphicon glyphicon-calendar" disabled></button></span>';
// 					}
// 					html += '</div>' +
// 						// '<input type="hidden" id="' + creatData[i].id + '-' + viewId + '" value="" /><br/>' +
// 						'</div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "date"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "dateRegion":
// 				if (creatData[i].visible) {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label for="dtp_input2" class="col-md-4 control-label text-right">' + creatData[i].name + '</label>' +
// 						'<div class="input-group date form_date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '1" data-link-format="yyyy-mm-dd">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="">' +
// 							// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
// 							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
// 					} else {
// 						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '" type="text" value="" disabled>' +
// 							// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
// 							'<span class="input-group-addon"><button class="glyphicon glyphicon-calendar" disabled></button></span>';
// 					}
// 					html += '</div>' +
// 						'<div class="col-md-2 ip-to-font">至</div>' +
// 						'<div class="input-group date form_date col-md-3 ip-input-group fleft" data-date="" data-date-format="yyyy-mm-dd" data-link-field="' + creatData[i].id + '2" data-link-format="yyyy-mm-dd">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '2" type="text" value="">' +
// 							// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
// 							'<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
// 					} else {
// 						html += '<input class="form-control" size="16" id="' + creatData[i].id + '-' + viewId + '2" type="text" value="" disabled>' +
// 							// '<span class="input-group-addon"><span class="glyphicon glyphicon-remove"></span></span>' +
// 							'<span class="input-group-addon"><button class="glyphicon glyphicon-calendar" disabled></button></span>';
// 					}
// 					html += '</div>' +
// 						// '<input type="hidden" id="'  + creatData[i].id + '-' + viewId + '" value="" /><br/>' +
// 						'</div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "dateRegion"
// 					};
// 					aims.push(current_aim);
// 				}
// 				break;
// 			case "tree":
// 				if (creatData[i].visible) {
// 					html += '<div class="col-md-' + n + '">' +
// 						'<label class="col-md-4 text-right">' + creatData[i].name + 'ssssss' + '</label>' +
// 						'<div class="input-group col-md-8 ip-input-group">';
// 					if (creatData[i].editable == "true") {
// 						html += '<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '" onkeydown="return codeInto(this.id,this.name,event)">' +
// 							'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '-h">' +
// 							'<span class="input-group-btn">' +
// 							'<button class="btn btn-default glyphicon glyphicon-list" style="margin-top: -2px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source + '" data-toggle="modal" onclick="showAssitTree(this.id, this.name,0,{},0,0)"></button>';
// 					} else {
// 						html += '<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '" onkeydown="return codeInto(this.id,this.name,event)" disabled>' +
// 							'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '-h" disabled>' +
// 							'<span class="input-group-btn">' +
// 							'<button class="btn btn-default glyphicon glyphicon-list" style="margin-top: -2px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source + '" data-toggle="modal" onclick="showAssitTree(this.id, this.name,0,{},0,0)" disabled></button>';
// 					}
// 					html += '</span>' +
// 						'</div>' +
// 						'</div>';
// 					var current_aim = {
// 						"id": creatData[i].id + '-' + viewId,
// 						"type": "tree"
// 					};
// 					aims.push(current_aim);
// 				}
// 				//localStorage.setItem(creatData[i].id + '-' + viewId, JSON.stringify(creatData[i].data));
// 				break;
// 			case "Checktree":
// 				html += '<div class="col-md-' + n + '">' +
// 					'<label class="col-md-4 text-right">' + creatData[i].name + 'ssssss' + '</label>' +
// 					'<div class="input-group col-md-8 ip-input-group">' +
// 					'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source + '">' +
// 					'<input type="text" class="form-control col-md-6" id="' + creatData[i].id + '-' + viewId + '-h">' +
// 					'<span class="input-group-btn">' +
// 					'<button class="btn btn-default" style="margin-top: -2px;border-radius: 0;" type="button" id="' + creatData[i].id + '-' + viewId + '" onclick="clearText(this.id)">X</button>' +
// 					'</span>' +
// 					'<span class="input-group-btn">' +
// 					'<button class="btn btn-default glyphicon glyphicon-list" style="margin-top: -2px;" type="button" id="' + creatData[i].id + '-' + viewId + '" name="' + creatData[i].source + '" data-toggle="modal" onclick="showAssitTree(this.id, this.name,1,{},0,0)"></button>' +
// 					'</span>' +
// 					'</div>' +
// 					'</div>';
// 				var current_aim = {
// 					"id": creatData[i].id + '-' + viewId,
// 					"type": "Checktree"
// 				};
// 				aims.push(current_aim);
// 				//localStorage.setItem(creatData[i].id + '-' + viewId, JSON.stringify(creatData[i].data));
// 				break;
// 		}
// 	}
// 	// html += '<button type="submit" class="btn btn-default">查询</button>';
// 	$("#" + areaId).append(html);
// 	$('.form_date').datetimepicker({
// 		language: 'zh-CN',
// 		weekStart: 1,
// 		todayBtn: 1,
// 		autoclose: 1,
// 		todayHighlight: 1,
// 		startView: 2,
// 		minView: 2,
// 		forceParse: 0
// 	});
// 	return aims;
// }

// function clearText(id) {
// 	$("#" + id).val("");
// 	$("#" + id + "-h").val("");
// }

// function codeInto(id, element, e) {
// 	if (e.keyCode == "13") {
// 		alert($("#" + id).val());
// 		// var current_url = location.search;
// 		// var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
// 		// var ele_value = $("#" + id).val();
// 		// $.ajax({
// 		// 	url: "/df/dic/dictree.do",
// 		// 	type: "GET",
// 		// 	async: false,
// 		// 	data: {
// 		// 		"element": element,
// 		// 		"tokenid": tokenid,
// 		// 		"ele_value": ele_value,
// 		// 		"ajax":"noCache"
// 		// 	},
// 		// 	success: function(data){
// 		// 		if(data.eleDetail.length > 1){
// 		// 			$("#" + id).click();
// 		// 		} else {
// 		// 			var tree_string_old = data.eleDetail[0].codename;
// 		// 			var tree_string = data.eleDetail[0].id + "@" + encodeURI(data.eleDetail[0].chr_name,"utf-8") + "@" + data.eleDetail[0].chr_code;
// 		// 			$("#"+ id ).val(tree_string_old);
// 		// 			$("#" + id + "-h").val(tree_string);
// 		// 		}
// 		// 	}
// 		// });
// 	}
// }

// function moneyQuset(id) {
// 	$("#" + id).val(parseFloat($("#" + id).val()).toFixed(2));
// }
// var ip_tree_viewModel = {};
// var ip_areaId = "";

// function treeChoice(id, data, flag, viewModel, areaId, ele_name) {
// 	ip_tree_viewModel = viewModel;
// 	ip_areaId = areaId;
// 	var success_info = $("#myModalTree")[0];
// 	var html = '';
// 	if (ele_name == 0) {
// 		ele_name = $("#" + id).parent().parent().find("label").text();
// 	}
// 	if (!success_info) {
// 		html += '<div class="modal fade" id="myModalTree" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
// 			'<div class="modal-dialog" role="document">' +
// 			'<div class="modal-content">' +
// 			'<div class="modal-header">' +
// 			'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
// 			'<h4 class="modal-title" id="myModalLabel">' + ele_name + '</h4>' +
// 			'</div>' +
// 			'<div class="modal-body">' +
// 			'<label for="" class="col-md-2 text-right" style="width:18%; font-weight:normal">快速定位</label>' +
// 			'<input type="hidden" id="choiced-node">' +
// 			'<input type="hidden" id="aim">' +
// 			'<div class="col-md-4 ip-input-group">' +
// 			'<input type="text" class="form-control" id="user-write">' +
// 			'</div>' +
// 			'<button id="btn-radio-data-tree" class="btn btn-default top-button" style="margin-left:10px;" type="button" name="btnFind" onClick="search(this.id);" ><span class="glyphicon glyphicon-search search-addon"></span>查找</button>' +
// 			'<button id="nex-radio-data-tree" class="btn btn-default top-button-next" style="margin-left:10px;" type="button" name="btnNext" onClick="next(this.id);">下一个</button>' +
// 			'<div class="tree-area">' +
// 			'</div>' +
// 			'</div>' +
// 			'<div class="modal-footer">' +
// 			'<div class="radio pull-left" id="isRelationPc"><label><input type="checkbox" name="optionsCheck" value="" checked onclick="TreeIsIncliudChild();">包含下级</label></div>' +
// 			'<div id="modal-tree-footer-btn" class="fr">' +
// 			'<button id="sur-radio-data-tree" type="button" class="btn btn-primary" name="btnSure" onclick="sureSelectTree(this.id);">确定</button>' +
// 			'<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
// 			'</div>' +
// 			'</div>' +
// 			'</div>' +
// 			'</div>' +
// 			'</div>';
// 		$("body").append(html);
// 	}
// 	$("#myModalLabel").text(ele_name);
// 	var tree_html = "";
// 	var tree_html_nochild = "";
// 	$(".tree-area").html("");
// 	if (flag == 0) {
// 		//单选树
// 		$("#isRelationPc").hide();
// 		tree_html = "<div class='text-righ tradio-data-tree'><a style='cursor: pointer;font-size:12px;color:#1871c1;' id='ip-open-all' name='radio-data-tree'>全部展开</a>&nbsp;|&nbsp;<a style='cursor: pointer;font-size:12px;color:#1871c1;' id='ip-close-all' name='radio-data-tree'>全部闭合</a></div><div class='ztree radio-tree assist-insert-tree' u-meta='" + '{"id":"radio-data-tree","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename","setting":"treeSetting"}' + "'>";
// 		$(".tree-area").append(tree_html);
// 	} else {
// 		//多选树
// 		$("#isRelationPc").show();
// 		$("#isRelationPc").prop("checked", true);
// 		var tree_html = "<div class='text-right child-data-tree'><a style='cursor: pointer;font-size:12px;color:#1871c1;' id='ip-open-all' name='child-data-tree'>全部展开</a>&nbsp;|&nbsp;<a style='cursor: pointer;font-size:12px;color:#1871c1;' id='ip-close-all' name='child-data-tree'>全部闭合</a></div><div class='ztree child-data-tree assist-insert-tree' u-meta='" + '{"id":"child-data-tree","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename","setting":"treeSettingCheck"}' + "'>";
// 		var tree_html_nochild = "<div class='text-right noChi-data-tree'><a style='cursor: pointer;font-size:12px;color:#1871c1;' id='ip-open-all' name='noChi-data-tree'>全部展开</a>&nbsp;|&nbsp;<a style='cursor: pointer;font-size:12px;color:#1871c1;' id='ip-close-all' name='noChi-data-tree'>全部闭合</a></div><div class='ztree noChi-data-tree assist-insert-tree' u-meta='" + '{"id":"noChi-data-tree","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename","setting":"treeSettingCheckNoChid"}' + "'>";
// 		$(".tree-area").append(tree_html);
// 		$(".tree-area").append(tree_html_nochild);
// 		if ($("input[name='optionsCheck']")[0].checked) {
// 			$(".noChi-data-tree").hide();
// 			$(".child-data-tree").show();
// 			$("button[name='btnFind']").attr("id", "btn-child-data-tree");
// 			$("button[name='btnNext']").attr("id", "nex-child-data-tree");
// 			$("button[name='btnSure']").attr("id", "sur-child-data-tree");
// 		} else {
// 			$(".noChi-data-tree").show();
// 			$(".child-data-tree").hide();
// 			$("button[name='btnFind']").attr("id", "btn-noChi-data-tree");
// 			$("button[name='btnNext']").attr("id", "nex-noChi-data-tree");
// 			$("button[name='btnSure']").attr("id", "sur-noChi-data-tree");
// 		}

// 	}
// 	//initTree(id,data,flag);

// 	localStorage.setItem("tree_flag", flag);
// 	initTree(id, data, flag);
// }

// function initTree(id, data, flag) {
// 	var viewModel = {
// 		treeSetting: {
// 			view: {
// 				showLine: false,
// 				selectedMulti: false
// 			},
// 			callback: {
// 				onDblClick: function(e, id, node) {
// 					setSelectedNode(id);
// 				}
// 			}
// 		},
// 		treeSettingCheck: {
// 			view: {
// 				showLine: false,
// 				selectedMulti: false
// 			},
// 			callback: {
// 				onDblClick: function(e, id, node) {
// 					setSelectedNode(id);
// 				}
// 			},
// 			check: {
// 				enable: true,
// 				chkboxType: {
// 					"Y": "ps",
// 					"N": "ps"
// 				}
// 			}
// 		},
// 		treeSettingCheckNoChid: {
// 			view: {
// 				showLine: false,
// 				selectedMulti: false
// 			},
// 			callback: {
// 				onDblClick: function(e, id, node) {
// 					setSelectedNode(id);
// 				}
// 			},
// 			check: {
// 				enable: true,
// 				chkboxType: {
// 					"Y": "",
// 					"N": ""
// 				}
// 			}
// 		},
// 		treeDataTable: new u.DataTable({
// 			meta: {
// 				'code_id': {
// 					'value': ""
// 				},
// 				'parent_id': {
// 					'value': ""
// 				},
// 				'codename': {
// 					'value': ""
// 				}
// 			}
// 		})
// 	}
// 	ko.cleanNode($('.tree-area')[0]);
// 	var app = u.createApp({
// 		el: '.tree-area',
// 		model: viewModel
// 	});
// 	viewModel.treeDataTable.setSimpleData(data);
// 	$("#aim").val(id);
// 	$("#ip-open-all").on('click', function() {
// 		var treeId = $(this).attr("name");
// 		$("#" + treeId)[0]['u-meta'].tree.expandAll(true);
// 	});
// 	$("#ip-close-all").on('click', function() {
// 		var treeId = $(this).attr("name");
// 		$("#" + treeId)[0]['u-meta'].tree.expandAll(false);
// 	});
// 	$("#myModalTree").modal({
// 		backdrop: 'static',
// 		keyboard: false
// 	});
// 	$("#myModalTree").on("shown.bs.modal", function() {
// 		$(this).draggable({
// 			handle: ".modal-header" // 只能点击头部拖动
// 		});
// 		$(this).css("overflow", "hidden"); // 防止出现滚动条，出现的话，你会把滚动条一起拖着走的
// 	});
// }

// function getTreeInputValue(id) {
// 	var tree_info = $("#" + id).val();
// 	var space_position = tree_info.indexOf(" ");
// 	var value = {};
// 	value["code"] = tree_info.substring("0", space_position);
// 	value["name"] = tree_info.substring(space_position + 1);
// 	value["id"] = $("#" + id).attr("name");
// 	return value;
// }

// function setSelectedNode(id) {
// 	var treeId = id.substring(4);
// 	var data_tree = $("#" + id)[0]['u-meta'].tree;
// 	var aim = $("#aim").val();
// 	var flag = localStorage.getItem("tree_flag");
// 	if (flag == "0") {
// 		var select_node = data_tree.getSelectedNodes();
// 		if (select_node[0].name == "0101 真的是很。。。") {
// 			if (ip_areaId == 0) {
// 				$("#" + aim).val("");
// 				$("#" + aim + "-h").val("");
// 			} else {
// 				$("#" + aim + "-" + ip_areaId).val("");
// 				$("#" + aim + "-" + ip_areaId + "-h").val("");
// 			}
// 			alert("傻子儿，别瞎选！！！");
// 			return;
// 		}
// 	} else {
// 		var select_node = data_tree.getCheckedNodes(true);
// 	}
// 	console.log(select_node);
// 	var tree_string = "";
// 	var tree_string_old = "";
// 	for (var i = 0; i < select_node.length; i++) {
// 		// tree_string_old += select_node[0].code + " " + select_node[0].name + ",";
// 		if (i == select_node.length - 1) {
// 			tree_string_old += select_node[i].codename;
// 			tree_string += select_node[i].id + "@" + encodeURI(select_node[i].chr_name, "utf-8") + "@" + select_node[i].chr_code;
// 		} else {
// 			tree_string_old += select_node[i].codename + ",";
// 			tree_string += select_node[i].id + "@" + encodeURI(select_node[i].chr_name, "utf-8") + "@" + select_node[i].chr_code + ",";
// 		}
// 	}
// 	if (ip_areaId == 0) {
// 		$("#" + aim).val(tree_string_old);
// 		$("#" + aim + "-h").val(tree_string);
// 	} else {
// 		$("#" + aim + "-" + ip_areaId).val(tree_string_old);
// 		$("#" + aim + "-" + ip_areaId + "-h").val(tree_string);
// 	}
// 	if (!isEmptyObject(ip_tree_viewModel)) {
// 		ip_tree_viewModel.setValue(aim, tree_string);
// 	}
// 	// clearSecEleCode(aim,ip_areaId);
// 	$("input[name='optionsCheck']").attr("checked", false);
// 	$("#myModalTree").modal('hide');
// }

// function isEmptyObject(obj) {　　
// 	for (var name in obj) {　　　　
// 		return false; //返回false，不为空对象
// 		　　
// 	}　　　　
// 	return true; //返回true，为空对象

// }
// //选中之后确定的函数
// function sureSelectTree(id) {
// 	id = id.substring(4);
// 	setSelectedNode(id);
// }

// function search(id) {
// 	var treeId = id.substring(4);
// 	var user_write = $("#user-write").val();
// 	var data_tree = $("#" + treeId)[0]['u-meta'].tree;
// 	var search_nodes = data_tree.getNodesByParamFuzzy("name", user_write, null);
// 	if (search_nodes == null || search_nodes.length == 0) {
// 		ipInfoJump("无搜索结果");
// 	} else {
// 		data_tree.expandNode(search_nodes[0], true, false, true);
// 		data_tree.selectNode(search_nodes[0]);
// 	}
// }
// var node_count = 1;

// function next(id) {
// 	var treeId = id.substring(4);
// 	var user_write = $("#user-write").val();
// 	var data_tree = $("#" + treeId)[0]['u-meta'].tree;
// 	var search_nodes = data_tree.getNodesByParamFuzzy("name", user_write, null);
// 	if (node_count < search_nodes.length) {
// 		data_tree.selectNode(search_nodes[node_count++]);
// 	} else {
// 		node_count = 1;
// 		ipInfoJump("最后一个");
// 		//alert("最后一个");
// 	}
// }

// function TreeIsIncliudChild() {
// 	if ($("input[name='optionsCheck']")[0].checked) {
// 		$(".noChi-data-tree").hide();
// 		$(".child-data-tree").show();
// 		$("button[name='btnFind']").attr("id", "btn-child-data-tree");
// 		$("button[name='btnNext']").attr("id", "nex-child-data-tree");
// 		$("button[name='btnSure']").attr("id", "sur-child-data-tree");
// 	} else {
// 		$(".noChi-data-tree").show();
// 		$(".child-data-tree").hide();
// 		$("button[name='btnFind']").attr("id", "btn-noChi-data-tree");
// 		$("button[name='btnNext']").attr("id", "nex-noChi-data-tree");
// 		$("button[name='btnSure']").attr("id", "sur-noChi-data-tree");
// 	}
// }

// /*
//  * 辅助录入树的弹窗 
//  * param id 目标输入框的id  element 资源标识    flag单选和多选的标识（0代表单选，1代表有多选框的）
//  */

// function showAssitTree(id, element, flag, viewModel, areaId, ele_name) {
// 	// var current_url = location.search;
// 	// var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
// 	// var ele_value = $("#" + id + areaId).val();
// 	// $.ajax({
// 	// 	url: "/df/dic/dictree.do",
// 	// 	type: "GET",
// 	// 	async: false,
// 	// 	data: {
// 	// 		"element": element,
// 	// 		"tokenid": tokenid,
// 	// 		"ele_value": ele_value,
// 	// 		"ajax":"noCache"
// 	// 	},
// 	// 	success: function(data){
// 	// 		treeChoice(id,data.eleDetail,flag,viewModel,areaId,ele_name);
// 	// 	}
// 	// });
// 	var data = [{
// 		"chr_id": "01",
// 		"parent_id": "root",
// 		"chr_name": "真的是很。。。",
// 		"chr_code": "0101",
// 		"codename": "0101 真的是很。。。"
// 	}, {
// 		"chr_id": "02",
// 		"parent_id": "root",
// 		"chr_name": "Parent2",
// 		"chr_code": "0202",
// 		"codename": "0202 Parent2"
// 	}, {
// 		"chr_id": "101",
// 		"parent_id": "01",
// 		"chr_name": "Child11",
// 		"chr_code": "101101",
// 		"codename": "101101 Child11"
// 	}, {
// 		"chr_id": "102",
// 		"parent_id": "01",
// 		"chr_name": "mChild12",
// 		"chr_code": "102102",
// 		"codename": "102102 mChild12"
// 	}, {
// 		"chr_id": "201",
// 		"parent_id": "02",
// 		"chr_name": "Child21",
// 		"chr_code": "201201",
// 		"codename": "201201 Child21"
// 	}];
// 	treeChoice(id, data, flag, viewModel, areaId, ele_name);
// }


// //设置列固定

// function setFixedColumn(gridId, fixedNum) {
// 	//app.getComp(gridId).setColumnFixed ("name",true);
// 	fixedNum = $("#fixedNum").val();
// 	var gridObj = $("#" + gridId).parent()[0]['u-meta'].grid;
// 	//	 var aaa = gridObj.gridCompColumnArr;

// 	var fixebumber = gridObj.gridCompColumnFixedArr.length;
// 	var freeNum = gridObj.gridCompColumnArr.length;
// 	if (fixedNum < fixebumber) {
// 		for (i = fixebumber - 1; i > fixebumber - fixedNum; i--) {
// 			gridObj.setColumnFixed(gridObj.gridCompColumnFixedArr[i].options.field, false)
// 		}
// 	}
// 	//	 for(var i=gridObj.gridCompColumnArr.length-1; i>0; i--){
// 	//		 gridObj.setColumnFixed(gridObj.gridCompColumnArr[i].options.field,false);
// 	//	 }
// 	if (fixedNum > fixebumber) {

// 		for (i = 0; i < fixedNum - fixebumber; i++) {
// 			gridObj.setColumnFixed(gridObj.gridCompColumnArr[i].options.field, true);
// 		}

// 	}
// }

// //	 for(var i=0 ;i<gridObj.gridCompColumnArr.length; i++){
// //		 gridObj.setColumnFixed(gridObj.gridCompColumnArr[0].options.field,true);
// //	 }