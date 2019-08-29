require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director',
		'ip' ], function($, ko) {
	window.ko = ko;
	var wfCode = "";
	var wfName = "";
	var tokenid = ip.getTokenId();
	var viewModel = {
		treeSetting : {
			view : {
				showLine : true,
				selectedMulti : false
			},
			callback : {
				onClick : function(e, id, node) {
					// 处理连接路径问题
					// 通过code查询model的id
					var treeCode=node.id;
					// 超链接导出
					viewModel.leadout();
					
					$.ajax({
						url : "/df/wf/getModelId?tokenid="+tokenid,
						type : "GET",
						data : {
							"code" : treeCode,
							"ajax" : 1
						},
						success : function(data) {
							// 获得modelId
							var modelId=data.modelId;
							// 拼接路径和参数
							var url="/df/fap/wf/modeler.html?modelId="+modelId+"&viewValue=BASE_VIEW&appValue=APP_ADMIN&tokenid="+tokenid;
							$("#iframeSrc").attr("src",url);
						}
					})
				}
			}
		},

		dataTableList : new u.DataTable({
			meta : {
				'wf_code' : {
				},
				'zpid' : {
				},
				'name' : {}
			}
		}),
	};
	
	viewModel.initTree = function(proCode) {
		$.ajax({
			url : "/df/wf/treePid?tokenid="+tokenid,
			type : 'GET',
			dataType : "json",
			success : function(data) {
				viewModel.dataTableList.setSimpleData(data.wf);
				var treeObj = $.fn.zTree.getZTreeObj("tree2");
				var node =treeObj.getNodesByParam("wf_code", proCode, null);
				if(node != null && node.length > 0){
					treeObj.selectNode(node[0]);
					// begin_打开设计器_2017_04_17
							$.ajax({
								url : "/df/wf/getModelId?tokenid="+tokenid,
								type : "GET",
								data : {
									"code" : node[0].id,
									"ajax" : 1
								},
								success : function(data) {
									// 获得modelId
									var modelId=data.modelId;
									// 拼接路径和参数
									// var
									// url="/df/fap/wf/modeler.html?modelId="+modelId+"&viewValue=BASE_VIEW&appValue=APP_ADMIN&tokenid="+tokenid;
									var url="/df/fap/wf/modeler.html?modelId="+modelId+"&viewValue=BASE_VIEW&appValue=APP_ADMIN&tokenid="+tokenid;
									$("#iframeSrc").attr("src",url);
								}
							})
					// end_打开设计器_2017_04_17
				}
			}
		});
	}
	aaa = function(proCode){
		viewModel.initTree(proCode);
	}
	
	bbb = function(proCode){
		viewModel.initTree_condition(proCode);
	}
	
	searchTreeNode = function(msg, flag){
		ip.ipInfoJump(msg,flag);
	}
	
	message=function(msg,flag){
		ip.ipInfoJump(msg,flag);
	}
	
	// 主表名称下拉框获取数据
	viewModel.getPrimaryNameSelect = function() {
		$.ajax({
			url : "/df/wf/queryPrimaryName?tokenid="+tokenid,
			type : "GET",
			data : {
				"tokenid" : tokenid,
				"ajax" : 1
			},
			success : function(data) {
				if (data != null) {
					for ( var i = 0; i < data.length; i++) {
						var option = "";
						if (i == 0) {
							option = $("<option value='" + data[i].idColumnName
									+ "' selected>" + data[i].tableCode + ' '
									+ data[i].tableName + "</option>");
							$("#idField").val(data[i].idColumnName);
						}
						option = $("<option value='" + data[i].idColumnName
								+ "'>" + data[i].tableCode + ' '
								+ data[i].tableName + "</option>");
						$("#primaryName").append(option);
					}
				}
			}
		})
	}

	// 增加按钮绑定模态框
	viewModel.addRow = function() {
		$("#addModal").modal("show");
		$("#addModal input[type='email']").val("");
		// 将主表名称和ID字段绑定
		$("#primaryName").change(function() {
			var textInput = $("#primaryName option:selected").val();
			$("#idField").val(textInput);
		});
	};

	// 确定按钮提交数据
	viewModel.confirm = function() {
		var paf = $("#primaryName option:selected").text();
		var name = $("#inputProcessName").val();
		var code = $("#inputProcessCode").val();
		if (code == "" || code == null) {
            ip.ipInfoJump("流程编号不能为空","error");
            return;
		}
        if (name == "" || name == null) {
            ip.ipInfoJump("流程名称不能为空","error");
            return;
        }
		var ptname = paf.split(' ')[0];
		var field = $("#primaryName option:selected").val();
		               // begin_重组model数据_2017_04_19
					   var newModelData=new Object();
					   newModelData.description="";
					   newModelData.modelId="";
					   newModelData.revision=1;
					   newModelData.name=name;
					   newModelData.firstLoad=true;
					  
					   var model=new Object();
					   var properties=new Object();
					   var stencilset=new Object();
					   
					   newModelData.model=model;
					   newModelData.model.properties=properties;
					   newModelData.model.stencilset=stencilset;
					   
					   model.id="canvas";
					   model.resourceId="canvas";
					   
					   model.properties=properties;
					   model.stencilset=stencilset;
					   
					   properties.expreson="";
					   properties.idfield=field;
					   properties.multiinstance_maintablename=ptname+" "+field;
					   properties.processname=encodeURI(name);
					   properties.process_id=code;
					  
					   stencilset.namespace="http://b3mn.org/stencilset/bpmn2.0#";
					   var stringify=JSON.stringify(newModelData);
					   var url="/df/fap/wf/modeler.html?modelId="+newModelData.modelId+"&newModelData="+stringify+"&viewValue=BASE_VIEW&appValue=APP_ADMIN&tokenid="+tokenid;
					   $("#iframeSrc").attr("src",url);
					   // end_重组model数据_2017_04_19
	}
	
	// 取消按钮隐藏模态框
	viewModel.cancel = function() {
		$("#addModal").modal("hide");
	};
	
	// 导入按钮
	viewModel.leadinRow = function() {
		var tokenid = ip.getTokenId();
		var FileController = "/df/wf/leadin?tokenid="+tokenid; 
		var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    	if (isIE && isIE<="9.0") {
    		if(noticeTitle!=""&&!htmlFlag&&!textFlag){
    			$("#form1").attr("action",$ctx+"/notice/saveNoticeForIE");
    			$("#form1").submit();
    			clearNot();
    		}
	    } else {
		    	var fileObj = document.getElementById("leadinRow").files[0]; 
 		    	if(fileObj==undefined){
 	    			fileObj="";
 	    		}
 	    			var form  = new FormData();
 	 				form.append("imgFile", fileObj);// 文件对象
 	 				form.append("file",fileObj);
 	 				var xhr = new XMLHttpRequest();
 	 				xhr.open("post", FileController, true);
 	 				xhr.onload = function () {
 	 					if (xhr.status == 200) {
 	 					   var data = jQuery.parseJSON(xhr.responseText);
 	 					    var flag = data.leadin;
 	 					    var isFile = data.isFile;
 	 					    var success = data.success;
 	 					    if (isFile == "false"){
 	 					    	ip.ipInfoJump("请选择正确文件导入！","error");
 	 					    }
 	 					    if (success == "true"){
	 					    	ip.ipInfoJump("文件导入成功！");
	 					    	viewModel.initTree();
	 					    }
 	 					    if (success == "false"){
	 					    	ip.ipInfoJump("文件导入失败！","error");
	 					    }
 	 					    if (flag == "true"){
 	 					    	ip.warnJumpMsg("流程模板已存在确定要导入吗？","sureId","cancelCla");
 	 					    	$("#sureId").click(function(){
 	 					    		var leadin = "true";
 	 					    		form.append("leadin",leadin);
 	 					    		xhr.open("post", FileController, true);
 	 					    		xhr.onload = function () {
 	 			 	 					if (xhr.status == 200) {
 	 			 	 					   var data = jQuery.parseJSON(xhr.responseText);
 	 			 	 					    var flag = data.leadin;
 	 			 	 					    var isFile = data.isFile;
 	 			 	 					    var success = data.success;
 	 			 	 					    if(success == "true") {
 	 			 	 					    	$("#config-modal").remove();
	 					    					ip.ipInfoJump("文件导入成功！");
	 					    					viewModel.initTree();
	 					    				} else {
	 					    					$("#config-modal").remove();
	 					    					ip.ipInfoJump("文件导入失败！","error");
	 					    				}
 	 			 	 					}
 	 			 	 					else {
 	 			 	 						u.showMessageDialog({type: "info", title: "提示信息", msg: "服务器繁忙，请稍后重试！", backdrop: true});
 	 			 	 					}
 	 			 	 				};
 	 			 	 				xhr.send(form);
 	 					    	});
 	 					    	$(".cancelCla").click(function(){
 	 					    		$("#config-modal").remove();
 	 					    	});
 	 					    	return;
 	 					    }
 	 					} else {
 	 						u.showMessageDialog({type: "info", title: "提示信息", msg: "服务器繁忙，请稍后重试！", backdrop: true});
 	 					}
 	 				};
 	 				xhr.send(form);
		}
	};
	
	// 导出按钮
	viewModel.leadoutRows = function() {
		// 取得选中节点wf_code
		var treeObj = $.fn.zTree.getZTreeObj("tree2");
		var selectedNode=treeObj.getSelectedNodes();
		var wfCode = selectedNode[0].wf_code;
		var wfName= encodeURI(selectedNode[0].wf_name);
		var tokenid = ip.getTokenId();
		// 发送ajax请求后端
		$.ajax({
			url : "/df/wf/leadout?tokenid="+tokenid,
			async: false,
			type : "GET",
			data : {
				"tokenid" : tokenid,
				"wfCdode" : wfCode,
				"wfName" : wfCode + " " +wfName,
				"ajax" : 1
			},
			success : function(data) {
				if(data.flag) {
					ip.ipInfoJump("导出成功！");
				} else {
					ip.ipInfoJump("请选择正确模型导出！","error");
				}
			}
		})
	};
	
	// 升级
	viewModel.upgRows = function() {
		var tokenid = ip.getTokenId();
		$.ajax({
			url : "/df/sys/upg?tokenid="+tokenid,
			async: false,
			type : "POST",
			data : {
				"tokenid" : tokenid,
				"ajax" : 1
			},
			success : function(data) {
				var f = data.flag;
				if(f == "true") {
					ip.ipInfoJump("系统升级完成！");
					$("#btnUpg").attr("disabled", true);
				} else if(f == "false"){
					ip.ipInfoJump("已是最新系统！","info");
					$("#btnUpg").attr("disabled", true);
				} else{
					ip.ipInfoJump("系统升级失败！","error");
				}
			}
		})
	};
	
	// 删除按钮
	viewModel.delRows = function() {
		// 弹出删除警告框
		var treeObj = $.fn.zTree.getZTreeObj("tree2");
		var selectedNodes = treeObj.getSelectedNodes();
		if(selectedNodes != null && selectedNodes.length > 0){
			if(selectedNodes[0].isParent){
				ip.ipInfoJump("存在子节点，请先删除子节点再删除父节点！","error");
			}else{
				ip.warnJumpMsg("确定删除吗？","sureId","cancelCla");
				$("#sureId").on("click", function() {
					viewModel.delCode();
				});
				$(".cancelCla").on("click", function() {
					$("#config-modal").remove();
				})
			}
		}else{
			ip.ipInfoJump("请先选择一个子节再来删除！","info");
		}
	};
	
	// 超链接导出
	viewModel.leadout = function() {
		var tokenid = ip.getTokenId();
		var treeObj = $.fn.zTree.getZTreeObj("tree2");
		var selectedNodes = treeObj.getSelectedNodes();
		if(selectedNodes != null && selectedNodes.length > 0){
			if(selectedNodes[0].isParent){
//				ip.ipInfoJump("请选择正确模型导出！");
			}else{
				wfCode = selectedNodes[0].wf_code;
				wfName = encodeURI(encodeURI(selectedNodes[0].wf_name));
				var url="/df/wf/leadout?wfCdode="+wfCode+"&wfName="+wfName+"&tokenid="+tokenid;
				$("#export").attr("href",url);
			}
		}else{
//			ip.ipInfoJump("请先选择一个子节再来导出！");
		}
	};
	
	// 发送ajax请求后端
	viewModel.delCode = function() {
		// 取得选中节点wf_code
		var treeObj = $.fn.zTree.getZTreeObj("tree2");
		var selectedNode=treeObj.getSelectedNodes();
		var wfCode = selectedNode[0].wf_code;
		var tokenid = ip.getTokenId();
		// 发送ajax请求后端
		$.ajax({
			url : "/df/wf/delProcess?tokenid="+tokenid,
			type : "POST",
			data : {
				"tokenid" : tokenid,
				"code" : wfCode,
				"ajax" : 1
			},
			success : function(data) {
				if(data.flag) {
					// 删除成功提示框
					ip.ipInfoJump("删除成功！");
					viewModel.initTree();
					// 关闭删除警告框
					$("#config-modal").remove();
				} else {
					alert("节点删除失败或树加载异常！");
				}
			}
		})
	};

	// 初始化 viewModel
	$(function() {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el : 'body',
			model : viewModel
		});
		// 页面初始化调用
		// 流程树
		viewModel.initTree();
		// 主表下拉选
		viewModel.getPrimaryNameSelect();
		$("#leadinRow").change(function(){
			viewModel.leadinRow();
		})
	});

});
