require(['jquery','knockout','/df/fap/system/config/ncrd.js','bootstrap','uui','tree','grid','director','ip'],function($,ko,ncrd){
	window.ko = ko;
	var listApp,addApp,editApp;
	var LIST_DO_URL = "/df/fap/system/config/relation/list.do";
	var DEL_DO_URL = "/df/fap/system/config/relation/del.do";
	var GET_DO_URL = "/df/fap/system/config/relation/get.do";
	var tokenid;
	//detail;存放关联关系详细信息
	var detail;
	var viewModel = {
		treeKeyword: ko.observable(""),
		findTree: function(){
			ncrd.findTreeNode($.fn.zTree.getZTreeObj("tree2"), viewModel.treeKeyword());
		},
		//关联关系数据模型
		listTreeSetting : {
			view : {
				showLine : false,
				selectedMulti : false
			},
			callback : {
				onClick : function(e, id, node) {
					if(node.id != "association"){
						 listSelectMainElement(node.id);
						 findSpecificElement(ncrd.getEleValues(node.pri_ele_code),node.pri_ele_name,0);
						 findSpecificElement(ncrd.getEleValues(node.sec_ele_code),node.sec_ele_name,1);
						 showMainElement();
					}					
				}
			}
		},
		associationDataTable : new u.DataTable({
			meta : {
				'chr_id' : {
					'value' : ""
				},
				'parent_id' : {
					'value' : ""
				},
				'chr_name' : {
					'value' : ""
				},
				'pri_ele_name' :{
					'value' : ""
				},
				'sec_ele_name' :{
					'value' : ""
				},
				'pri_ele_code' :{
					'value' : ""
				},
				'sec_ele_code' :{
					'value' : ""
				},
				'relation_type' :{
					'value' : ""
				},
				'relation_code' :{
					'value' : ""
				},
			}
		}),
		//主控要素数据模型
		listMainTreeSetting : {
			view : {
				showLine : false,
				selectedMulti : false
			},
			check : {
				enable : true,
				chkStyle : "checkbox"
			},
			callback : {
				onClick : function(e, id, node) {
					showConElement(node);
				},
				 beforeCheck: zTreeBeforeCheck
			}
		},
		listMainElementDataTable : new u.DataTable({
			meta : {
				'chr_id' : {
					'value' : ""
				},
				'parent_id' : {
					'value' : ""
				},
				'chr_name' : {
					'value' : ""
				},
				"chr_code": {
                    'value':""
                }
			}
		}),
		//被控要素数据模型
		listConTreeSetting : {
			view : {
				showLine : false,
				selectedMulti : false
			},
			check : {
				enable : true,
				chkStyle : "checkbox"
			},
			callback : {
				onClick : function(e, id, node) {
				},
				beforeCheck: zTreeBeforeCheck
			}
		},
		listConElementDataTable : new u.DataTable({
			meta : {
				'chr_id' : {
					'value' : ""
				},
				'parent_id' : {
					'value' : ""
				},
				'chr_name' : {
					'value' : ""
				},
				"chr_code": {
                    'value':""
                }
			}
		}),

	};

	//初始化查询所有关联关系
	function initAssociation() {
		var dataArr = {
				"treeDatas1" :[
					{
						"chr_id" : "association",
						"parent_id" : "root",
						"chr_name" : "关联关系",
						"pri_ele_name" : "",
						"sec_ele_name" : "",
						"pri_ele_code" : "",
						"sec_ele_code" : "",
						"relation_type" : "",
						"relation_code" : ""
					}
				]
			};
		$.ajax({
			type : "GET",
			async : false,			
			url : LIST_DO_URL + '?tokenid=' + tokenid,
			data:{"ajax":"noCache"},
			dataType : "json",
			cache:false,
			success : function(result){
				if(result){
					// errorCode:0查询成功存在数据;-1查询失败
					var errorCode = result.errorCode;
					var data = result.data.row;
					if(errorCode == 0 && result.data.total_count>0){
						for(var i=0;i<data.length;i++){
							var code = {
									"chr_id" : data[i].relation_id,
									"parent_id" : "association",
									"chr_name" : data[i].relation_code + " " + data[i].pri_ele_name + "-" + data[i].sec_ele_name,
									"pri_ele_name" : data[i].pri_ele_name,
									"sec_ele_name" : data[i].sec_ele_name,
									"pri_ele_code" : data[i].pri_ele_code,
									"sec_ele_code" : data[i].sec_ele_code,
									"relation_type" : data[i].relation_type,
									"relation_code" : data[i].relation_code
							};
							dataArr.treeDatas1.push(code);
						}								
					}
					else{					
					}
					viewModel.associationDataTable.setSimpleData(dataArr.treeDatas1);
					var treeObj = $.fn.zTree.getZTreeObj("tree2");
					treeObj.expandAll(true);
				}
			},
			error: ncrd.commonAjaxError
		});		
	};
	
	/**			 
	 * 通过关联关系ID查询关联关系详细
	 * @param id			 
	 */
	function listSelectMainElement(id) {
		var queryData = {
			'relation_id':id,
			"ajax":"noCache"
		};
		$.ajax({
	    type: 'GET',
	    url: GET_DO_URL + '?tokenid=' + tokenid,
	    dataType: 'json',
		data:queryData,
	    async:false,
	    cache:false,
		  success : function(result){
		    if(result){
			  var errorCode = result.errorCode;
			    if(errorCode == 0 && result.data.total_count>0){			  
			    	detail = result.data.row;//关联关系详细数组 				    	
			     }
			    else{
			    	detail = null;
			     }
		      }
	     },
	       error: ncrd.commonAjaxError
		 });
	};
	
	/**
	 * 给主控被控要素树赋值
	 * @param data 具体要素值;name 要素根节点名称;number 0:主控要素 1:被控要素
	 */	 
	function findSpecificElement(data,name,number){
		var elementArr = [{
			"chr_id":"findSpecificElement",
			"parent_id":"root",
			"chr_name":name,
			"chr_code": "findSpecificElement"			
		}];
		if(data){
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					var num = 0;
					if(data[i].parent_id == ""){
						var elementTree = {
								"chr_id" :data[i].chr_id,
								"parent_id" :"findSpecificElement",
								"chr_name":data[i].chr_code + data[i].chr_name,
								"chr_code": data[i].chr_code
						};
					}
					else{			
						for(var j=0;j<data.length;j++){					
							if(data[j].chr_id == data[i].parent_id){
								var elementTree = {
										"chr_id" :data[i].chr_id,
										"parent_id" :data[i].parent_id,
										"chr_name":data[i].chr_code + data[i].chr_name,
										"chr_code": data[i].chr_code
								};
							}
							else{
							 num++;	
							}
						}
						if(num == data.length){
							var elementTree = {
									"chr_id" :data[i].chr_id,
									"parent_id" :"findSpecificElement",
									"chr_name":data[i].chr_code + data[i].chr_name,
									"chr_code": data[i].chr_code
							};
						}				
					}					
					elementArr.push(elementTree);			
				}
			}
		}
		else{
			ip.ipInfoJump("查询数据出错","error");
		}				
		if(number == 0){
			viewModel.listMainElementDataTable.setSimpleData(elementArr);
		}
		else{
			viewModel.listConElementDataTable.setSimpleData(elementArr);
		}	
	};

	/**
	 * 设置主控要素自动展开
	 * 设置主控要素树默认勾选
	 * @param 主控要素值，details详细数据
	 */
	function showMainElement(){
		var main_element_list = viewModel.listMainElementDataTable.getSimpleData();
		var treeObj = $.fn.zTree.getZTreeObj("listmaintree");
		treeObj.expandAll(true);
		if(detail != null){
			for(var i=0;i<detail.length;i++){
				for (var j=0;j<main_element_list.length;j++){
					if (main_element_list[j].chr_code == detail[i].pri_ele_value){
						var node = treeObj.getNodeByParam("chr_id",main_element_list[j].chr_id);
						treeObj.checkNode(node, true, true);
					}
				}
			}
		}				
	};
	
	/**
	 * 通过id 判断被控要素节点的显示
	 * @param  主控要素树节点
	 */
	function showConElement(node) {
		var con_element_list = viewModel.listConElementDataTable.getSimpleData();
		var treeObj = $.fn.zTree.getZTreeObj("listcontree");
		treeObj.expandAll(true);
		var nodeArr = treeObj.transformToArray(treeObj.getNodes());
		for(var j=0;j<nodeArr.length;j++){
			treeObj.checkNode(nodeArr[j], false, false);
		}
		if (node.checked == true){
				for (var i=0;i<detail.length;i++){
					if (node.chr_code == detail[i].pri_ele_value){
						for(var j=0;j<con_element_list.length;j++){
							if(detail[i].sec_ele_value == con_element_list[j].chr_code){
								var nodes = treeObj.getNodeByParam("id",con_element_list[j].chr_id);
								treeObj.checkNode(nodes, true, false);
							}
						}						
					}
				}
		}
	};

	/**
	 * 新增和修改
	 * @param num: 0 是修改 1:新增
	 * @param data 形式参数
	 */
	viewModel.addModify = function(num,data){
		var param = [];//传递到新增和修改页面的参数数组
		if(num == 0){
			var treeObj = $.fn.zTree.getZTreeObj("tree2");
			var nodes = treeObj.getSelectedNodes();
			if(nodes[0].id == "association"){
                ip.ipInfoJump("请选择关联关系或关联关系选择错误","info");
				return false;
			}
			else{
				var relation_list = viewModel.associationDataTable.getSimpleData();
				for(var i=0;i<relation_list.length;i++){
					if(nodes[0].id == relation_list[i].chr_id){
						param = relation_list[i];
					}
				}		
			}						
		}
		if (!addApp) {
			loadeditApp(onAddAppLoaded,param);
		} else {
			onAddAppLoaded(param);
		}
	};

	/**
	 * 加载编辑模块方法
	 * @param onLoaded = onEditAppLoaded onLoaded,
	 */
	function loadeditApp(onLoaded,param) {
		var container = $('div#edit-contanier');
		var url = "fap/system/config/relation/edit";
		requirejs.undef(url);
		require([url], function (module) {
			ko.cleanNode(container[0]);
			container.html('');
			container.html(module.template);
			module.init(container[0]);
			editApp = module;
			if(onLoaded){
				onLoaded(param);
			}
		});
	};
	
	//新增和修改页面加载完成后回调函数，需要等待页面加载完才能执行的代码
	function onAddAppLoaded(param){
		viewModel.listMainElementDataTable.clear();
		viewModel.listConElementDataTable.clear();
		go("#edit-contanier");
		editApp.auth(param,onEditAppClose);
	};

	/**
	 * 切换当前显示的界面
	 * @param showCollapse
	 */
	function go(showCollapse) {
		$("div.container-fluid.ncrd.collapse").collapse('hide');
		$(showCollapse).collapse('show');
	};

	/**
	 * 编辑页面关闭时的回调事件，save:保存关闭 cancel：取消关闭
	 * @type {{save: onEditAppClose.save, cancel: onEditAppClose.cancel}}
	 */
	var onEditAppClose = {
		save : function() {
			go("#list-contanier");
			initAssociation();
			
		},
		cancel : function() {
			go("#list-contanier");
			initAssociation();

		}
	};

	/*删除*/
	viewModel.warnJump = function() {
		var treeObj = $.fn.zTree.getZTreeObj("tree2");
		var nodes = treeObj.getSelectedNodes();
		if(nodes == null || nodes[0].parent_id == "root"){
			ip.ipInfoJump("请选择关联关系或关联关系选择错误","info");
		}else{
			ip.warnJumpMsg("确定删除吗？","sid","cCla");		
		}
		$("#sid").on("click",function(){			
			var queryData = {
				'relation_id' : nodes[0].id,
				"ajax":"noCache"
			};
			$.ajax({
				type : 'POST',
				url : DEL_DO_URL + '?tokenid=' + tokenid,
				data : queryData,
				async : false,
				cache:false,
				success : function(result) {
					$("#config-modal").remove();
					var errorCode = result.errorCode;
					if(errorCode == '0') {
						ip.ipInfoJump("删除成功", "success");
						initAssociation();
						viewModel.listMainElementDataTable.clear();
						viewModel.listConElementDataTable.clear();
					} else {
						ip.ipInfoJump("删除失败", "error");
					}
				},
				error : ncrd.commonAjaxError
			});
		});
		$(".cCla").on("click",function(){
			$("#config-modal").remove();
		});
   };

	/**
	 * 设置树的子节点checkbox默认勾选且不可改变
	 * @param   
	 */
	function zTreeBeforeCheck(treeId, treeNode) {
		return false;
	};

	/*初始化方法*/
	function init(contanier) {
		listApp = u.createApp({
			el: contanier,
			model: viewModel
		});
		tokenid = ip.getTokenId();
		initAssociation();
	};
	init('div#list-contanier');
});