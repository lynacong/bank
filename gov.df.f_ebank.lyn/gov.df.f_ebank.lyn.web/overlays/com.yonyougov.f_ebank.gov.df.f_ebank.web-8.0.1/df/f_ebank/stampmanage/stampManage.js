 require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
 	function ($, ko) {
	 window.ko = ko;
	 //var tokenid = ip.getTokenId();
	    //新增或者修改 类型
 		var editType;
 		var chr_id="";
 		var selectNode={};
 		var viewModel = {
 			tokenid : ip.getTokenId(),
 			dataArr: ko.observableArray(),
 			treeSetting:{
 				view:{
 					showLine:false,
 					selectedMulti:false
 				},
 				callback:{
 					onClick:function(e,id,node){
 						 selectNode=node;
 						 chr_id=node.chr_id;
 						 isParent=node.isParent;
 						 if(isParent){
 							viewModel.gridDataTable.clear();
 						 }else{
 							 var data={
 		 							"chr_code":node.chr_code,
 		 							"chr_name":node.chr_name,
 		 							"financeCode":node.finance_code,
 		 							"type": node.type
 		 						 };
 							 if(!node.isParent&&node.chr_code!=undefined){
 								viewModel.gridDataTable.setSimpleData(data,{"unSelect": true});
 							 }
 						 }
			            }
			        }
			    },
			    treeDataTable: new u.DataTable({
			    	meta: {
			    		'chr_id': {
			    			'value':""
			    		},
			    		'finance_code': {
			    			'value':""
			    		},
			    		'show_name':{
			    			'value':""
			    		}
			    	}
			    }),
			    gridDataTable: new u.DataTable({
			    	meta: {
			    		'chr_code': {},
			    		'chr_name': {},
			    		'type':{}
			    	}
			    }),
			};
 		viewModel.initCombo = function() {
			$.ajax({url : "/df/f_ebank/config/getAllFinanceOrgData.do?tokenid="+ viewModel.tokenid,
					type : "GET",
					dataType : "json",
					data : {
						"ajax" : "noCache"
					},
					success : function(datas) {
						if (datas.errorCode == "0") {
							for ( var i = 0; i < datas.dataDetail.length; i++) {
								var x = document.getElementById("finance_code");
								var option = document.createElement("option");
								option.text = datas.dataDetail[i].chr_name;
								option.value = datas.dataDetail[i].chr_code;
								try {
									// 对于更早的版本IE8
									x.add(option, x.options[null]);
								} catch (e) {
									x.add(option, null);
								}
								//var rg_code = document.getElementById("financeOrg").value;
								//viewModel.initTree();
								}
							} else {
								ip.ipInfoJump("加载Combo失败！原因："+ datas.result, "error");
							}
						}
					});
		};
 		//初始左边
 		viewModel.initTree=function(){
 			var finance_code = $("#finance_code").val();
 			$.ajax({
        		url: "/df/f_ebank/stampManage/findAllStamps.do?tokenid="+viewModel.tokenid,
        		type:"GET",
        		data: {
        			"ajax" : "noCache",
        			"financeCode": finance_code
        		},
        		success: function(data){
        			if(data.result=="success"){
        				viewModel.treeDataTable.setSimpleData(data.ebankStamps,{unSelect:true});
        				var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
        	 			treeObj.expandAll(true);
        			}
        		}
        	});
 			
 		};
 		
 		//根据复选框监听改变树的值
 		treeValueChange=function(){
 			viewModel.initTree();
 			chr_id="";
 			viewModel.gridDataTable.clear();
 		};
 		
 		//刷新
 		viewModel.refreshTree=function(){
 			viewModel.initTree();
 			chr_id="";
 			ip.ipInfoJump("刷新成功！","success");
 			viewModel.gridDataTable.clear();
 		};
 		
 		
 		
 		//新增印章
 		viewModel.addStamp=function(){
 			editType="add";
 			var finance_code = $("#finance_code").val();
 			var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 			var nodes = treeObj.getSelectedNodes();
 			if((finance_code=="000000"||finance_code=="")&&nodes.length==0){
 				ip.ipInfoJump("请先选择具体的财政机构！","info");
				return;
 			}
 			$("#stampSetModel input").val("");
 			$("#titleText").text("新增印章信息");
 			$("#stampSetModel").modal("show");
 		};
 		
 		
 		//修改印章
 		viewModel.modifyStamp=function(){
 			editType="modify";
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要修改的电子印章信息！","info");
				return;
			}
 			if(isParent == true){
 				ip.ipInfoJump("请选择子节点！","info");
				return;
 			}
 			$("#titleText").text("修改印章信息");
 			$("#stampCode").val(selectNode.chr_code);
 			$("#stampName").val(selectNode.chr_name);
 			$("#stampType").val(selectNode.type);
 			//$("#stamp option[value='"+selectNode.parent_id+"']").prop("selected", true);
 			$("#stampSetModel").modal("show");
 		};
 		
 		//删除印章
 		viewModel.delStamp=function(){
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要删除的信息！","info");
				return;
			}
 			var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 			var nodes = treeObj.getSelectedNodes();
 			/*if(nodes[0].isParent == true){
 				ip.ipInfoJump("当前为父节点，不能删除，请重新选择！","error");
 				return;
 			}*/
 			if(nodes[0].finance_code == null || nodes[0].finance_code == "" ){
 				ip.ipInfoJump("当前为财政区划信息，不能删除，请重新选择！","error");
 				return;
 			}
 			ip.warnJumpMsg("确定要删除吗？","sad","cacel",false);
 			$("#sad").click(function(){
 				var finance_code = $("#finance_code").val();
 				if(finance_code=="000000"||finance_code==""){
 	 				var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 	 	 			var nodes = treeObj.getSelectedNodes();
 	 	 			finance_code = nodes[0].finance_code;
 	 			}
 				$.ajax({
 	        		url: "/df/f_ebank/stampManage/saveOrUpdateOrDelStampInfo.do?tokenid="+viewModel.tokenid,
 	        		type:"POST",
 	        		data: {
 	        			"editType":"delete",
 	        			"stampId":chr_id,
 	        			"financeCode":finance_code,
 	        			"ajax" : "noCache",
 	        		},
 	        		success: function(data){
 	        			if(data.result=="success"){
 	        				ip.ipInfoJump("删除成功！","info");
 	        				//刷新树
 	        				viewModel.initTree();
 	        				viewModel.gridDataTable.clear();
 	        				$("#config-modal").remove();
 	        			}
 	        			else if(data.result=="fail"){
 	        				$("#config-modal").remove();
 	        				ip.ipInfoJump(data.reason,"error");
 	        			}
 	        		}
 	        	});
 			});
 			$(".cacel").click(function(){
 				$("#config-modal").remove();
 			});
 		};
 		
 		//弹出框上的确定-(新增或者修改保存)
 		viewModel.saveOrUpdate=function(){
 			var stampCode=$("#stampCode").val();
 			var stampName=$("#stampName").val();
 			
 			//编码和名称校验
 			if(stampCode ==""){
 				ip.ipInfoJump("印章编码不能为空！","error");
 				return false; 
 			}
 			if(stampCode.length>100){
 				ip.ipInfoJump("印章编码长度过长！","error");
 				return false;
 			}
 			if(stampName ==""){
 				ip.ipInfoJump("印章名称不能为空！","error");
 				return false;
 			}
 			if(stampName.length>100){
 				ip.ipInfoJump("印章名称长度过长！","error");
 				return false;
 			}
 			
 			var stampType=$('#stampType').val();
 			var finance_code = $("#finance_code").val();
 			if(finance_code=="000000"||finance_code==""){
 				var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 	 			var nodes = treeObj.getSelectedNodes();
 	 			finance_code = nodes[0].finance_code;
 	 			if(finance_code == "" || finance_code == null){
 	 				finance_code = nodes[0].id;
 	 			}
 			}
 			$.ajax({
        		url: "/df/f_ebank/stampManage/saveOrUpdateOrDelStampInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"stampId":chr_id,
        			"editType":editType,
        			"stampCode":stampCode,
        			"stampName":stampName,
        			"stampType":stampType,
        			"financeCode":finance_code,
        			ajax: "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				ip.ipInfoJump("保存成功！","success");
        				viewModel.initTree();
        				$("#stampSetModel").modal("hide");
        				//viewModel.initDropDownList();
        			}
        			else if(data.result=="fail"){
        				ip.warnJumpMsg(data.reason,"sad1","cacel",true);
        				$("#sad1").click(function(){
        					$("#config-modal").remove();
        				});
        			}
        		}
        		
        	});
 			
 		};
 		
 		
 		//同步按钮的事件
 		viewModel.btnSynClick=function(){
 			var finance_code = $("#finance_code").val();
 			if(finance_code=='000000'){
 				ip.ipInfoJump("请选择具体的财政机构进行同步！","info");
 				return;
 			}
 			$.ajax({
        		url: "/df/f_ebank/stampManage/synStampInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"financeCode":finance_code,
        			"ajax": "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				ip.ipInfoJump("同步成功！","success");
        				viewModel.refreshTree();
        			}
        			else if(data.result=="fail"){
        				//ip.ipInfoJump(data.reason,"error");
        				ip.warnJumpMsg(data.reason,"sad","cacel",true);
        			}
        		}
        	});
 		};
 		
 		//监听搜索框，蓝色高亮显示匹配到的节点
 		inputListner=function(){
 			var searchValue = $("#stampNameSearch").val();
 			var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 			var childNodes = treeObj.transformToArray(treeObj.getNodes());
 			var chrName;
 			for ( var j = 0; j < childNodes.length; j++) {  
 				chrName = childNodes[j].chr_name;
 				chrCode = childNodes[j].chr_code;
 				isParent= childNodes[j].isParent;
 				if(isParent||chrCode==undefined){
 					treeObj.setting.view.fontCss["color"]="	#000000";
 					treeObj.setting.view.fontCss["background"]="#FFFFFF";
 				}else{
 					if(searchValue!="" && chrName.indexOf(searchValue)!=-1){
 	 					treeObj.setting.view.fontCss["color"]="	#0000FF";
 	 					treeObj.setting.view.fontCss["background"]="#FFFF00";
 	 				}else{
 	 					treeObj.setting.view.fontCss["color"]="	#000000";
 	 					treeObj.setting.view.fontCss["background"]="#FFFFFF";
 	 				}
 				}
 				treeObj.updateNode(childNodes[j]);
 			}  
 		};
 		
 		$(function(){
 			app = u.createApp({
	            el: 'body',
	            model: viewModel
	        });
 			viewModel.initCombo();
			viewModel.initTree();
 		});
	});

