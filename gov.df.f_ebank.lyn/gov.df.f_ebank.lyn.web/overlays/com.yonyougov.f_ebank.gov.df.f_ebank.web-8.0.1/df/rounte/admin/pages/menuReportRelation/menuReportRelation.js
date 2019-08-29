define(['text!pages/menuReportRelation/menuReportRelation.html','commonUtil',
        'jquery','knockout', 'uui','tree',
    	'bootstrap','ip','ebankConstants','datatables.net-bs', 
        'datatables.net-select','initDataTableUtil'],function(html,commonUtil) {
		var init =function(element,param){
		    document.title=ip.getUrlParameter("menuname");
		    var report_id = "";
		    var baseURL = "/df/f_ebank/reportMenuRelation";
			var reportColumnsData = [
			    { data: 'report_id' ,width:'20%'},
	            { data: 'report_name' ,width:'25%'},
	            { data: 'report_code' ,width:'20%'},
	            { data: 'report_sequence' ,width:'20%'}
	        ];
			var reportColumnsDefs = [ {
				"targets" : [0],
				"visible" : false,
			}];
		    var menuGuid = null;
		    var menuSelectNode={};
		    var reportSelectNode = {};
			var viewModel = {
				tokenid : ip.getTokenId(),
				// 定义菜单树
				menuTreeDataTable : new u.DataTable({
					meta: {
						'guid': {
							'value':""
						},
						'parentid': {
							'value':""
						},
						'name':{
							'value':""
						},
						'isleaf':{
							'value':""
						}
					}
				}),
				//定义报表树
				reportTreeTable: new u.DataTable({
					meta: {
						'report_id': {
							'value':""
						},
						'parent_id': {
							'value':""
						},
						'show_name':{
							'value':""
						}
					}
				}),
				//菜单树设置
				treeSetting:{
					view:{
					},
					callback:{
						onClick:function(e,id,node){
							menuSelectNode = node;
							if(!node.isParent){
								var guid = node.id;
								menuName = node.name;
								menuGuid = guid;
								//获取菜单对应的报表数据
								viewModel.getMenuReport();
							}else{
								menuGuid = null;
								drawCommonGrid("reportGrid",null,reportColumnsData,reportColumnsDefs);
							}
						}
					}
				},
				//报表树设置
				treeSetting2:{
					view:{
						selectedMulti:false
					},
					callback:{
						onClick:function(e,id,node){
							reportSelectNode = node;
							report_id = node.id;
						}
					}
				}
			};
			// 初始化菜单树
			findMenuTree = function() {
				$.ajax({
					url: baseURL + "/getReMenu.do?tokenid=" + viewModel.tokenid,
					type: 'GET',
					dataType: 'json',
					data: {"ajax":"noCache"},
					success: function (data) {
						for(var i=0;i<data.mapMenu.length;i++){
							data.mapMenu[i].url = null;
						}
						var treedata = ip.treeJump(data.mapMenu);
						viewModel.menuTreeDataTable.setSimpleData(treedata);
						var data_tree = $("#menutree")[0]['u-meta'].tree;
						var nodes  = data_tree.getNodes();
						data_tree.expandNode(nodes[0], true, false, true);
					} 
				});
			};
			//新增报表
			viewModel.addReport = function (){
				if(menuGuid != null){
					$("#orderInput").val("");
					$("#keyInput").val("");
					$("#addviewInput").val("");
					var financeCode = $("#finance_code").val();
					$("#addReportModal").modal({backdrop: 'static', keyboard: false});
					getReportTreeByFinance(financeCode);
				}else{
					ip.warnJumpMsg("请选择左侧菜单树子节点后再进行新增!",0,0,true);
				}
			}
			//根据财政机构查询报表树
			getReportTreeByFinance = function(financeCode){
				$.ajax({
					url: baseURL + "/findAllReport.do?tokenid="+viewModel.tokenid,
					type: 'GET',
					dataType: 'json',
					data: {
						"financeCode":financeCode,
						"tokenId":viewModel.tokenid,
						"ajax":"noCache",
					},
					success: function (data) {
						viewModel.reportTreeTable.setSimpleData(data.eleList,{unSelect:true});
						var treeObj = $.fn.zTree.getZTreeObj("reportTree");
        	 			treeObj.expandAll(true);
					}
				}); 
			}
			//新增报表保存
			viewModel.addReportSave = function (){
				if(report_id != "null"){
					var financeCode = $("#finance_code").val();
					var menuCodeNameArr = menuSelectNode.name.split(" ");
					var reportCodeNameArr = reportSelectNode.name.split(" ");
					var orderNum = $("#orderInput").val();
					if(orderNum == "" || orderNum==null){
						ip.warnJumpMsg("请输入显示顺序!",0,0,true);
						return;
					}
					$.ajax({
						url: baseURL + "/updateReportMenu.do?tokenid=" + viewModel.tokenid,
						type: 'post',
						dataType: 'json',
						data: {
							"tokenId":viewModel.tokenid,
							"menu_id":menuGuid,
							"menu_name":menuCodeNameArr[1],
							"menu_code":menuSelectNode.code,
							"report_id":report_id,
							"report_name":reportCodeNameArr[1],
							"report_code":reportCodeNameArr[0],
							"report_sequence":orderNum,
							"finance_code":financeCode
						},
						success: function (data) {
							if(data.flag==1){
								$("#addReportModal").modal('hide');
								viewModel.getMenuReport();
								$("#orderInput").val("");
								$("#keyInput").val("");
							}else{
								if(data.msg=="" || data.msg==null){
									ip.warnJumpMsg("保存失败！",0,0,true);
								}else{
									ip.warnJumpMsg(data.msg,0,0,true);
								}
							}
						}
					});	
				}else{
					ip.warnJumpMsg("请选择报表再进行添加！",0,0,true);
				}
			}
			//获取菜单对应的报表
			viewModel.getMenuReport = function(){
				$.ajax({
					url: baseURL + "/getMenuReportView.do?tokenid="+viewModel.tokenid,
					type: 'GET',
					dataType: 'json',
					data: {
						"guid":menuGuid,
						"tokenId":viewModel.tokenid,
						"ajax":"noCache"
					},
					success: function (data) {
						drawCommonGrid("reportGrid",data.reportList,reportColumnsData,reportColumnsDefs);
					}
				});
			}
			viewModel.viewQuery = function (){  
				var user_write = $("#addviewInput").val();
				var data_tree = $("#reportTree")[0]['u-meta'].tree;
				var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
				data_tree.expandNode(search_nodes[0],true,false,true);
				data_tree.selectNode(search_nodes[0]);	
				if(data_tree.getSelectedNodes().length>0){
					ui_guid = data_tree.getSelectedNodes()[0].id;
				}
			}

			var j = 1;
			viewModel.viewNext = function (){
				var user_write = $("#addviewInput").val();
				var data_tree = $("#reportTree")[0]['u-meta'].tree;
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
			//删除菜单绑定的报表
			viewModel.delReport = function (){
				var buildReportIds = viewModel.buildReportIds();
				if(buildReportIds.length == 0){
					ip.warnJumpMsg("请选择删除的报表！",0,0,true);
					return;
				} 
				ip.warnJumpMsg("真的要删除吗?","sid1","cCla1");
				$("#sid1").on("click",function(){
					$("#config-modal").remove();
					var selGuid = "";
					for(var i = 0 ; i < buildReportIds.length ;i++){
						selGuid =  buildReportIds[i].report_id + "," +selGuid;
					}
					$.ajax({
						url:  baseURL +  "/delReportMenu.do?tokenid=" + viewModel.tokenid,
						type: 'post',
						dataType: 'json',
						data: {"selguid":selGuid,"menuid":menuGuid,"ajax":"noCache"},
						success: function (data) {
							if(data.flag == 1){
								var num = data.num;
								ip.ipInfoJump("成功删除"+num+"条数据!","success");
							}else{
								ip.warnJumpMsg("删除失败!",0,0,true);
							}
							viewModel.getMenuReport();
						}
					});
				});

				$(".cCla1").on("click",function(){
					//处理取消逻辑方法
					$("#config-modal").remove();
				})
			}
			
			//构建传到后台的billIds
			viewModel.buildReportIds = function(){
				var buildReportIds = new Array();
				var selectRows = $('#reportGrid').DataTable().rows('.selected');
				for (var i = 0; i < selectRows.indexes().length; i++) {
					var temp = {};
					temp["report_id"] = selectRows.data()[i].report_id;
					buildReportIds.push(temp);
				}
				return buildReportIds;
			};
			// 初始化整个页面
			initView = function() {
				findMenuTree();
				//初始化添加报表模态框财政机构
				var param = ip.getCommonOptions({});
	 		    // 初始化财政机构的下拉框
	 			commonUtil.initFinanceCode("",param);
				drawCommonGrid("reportGrid",null,reportColumnsData,reportColumnsDefs);
			};
			
			pageInit =function(){
				app = u.createApp({
					el : element,
					model : viewModel
				});
				initView();
			}
	
			$(element).html(html);	
			pageInit();
	}
	return {
		init:init
	}
});
