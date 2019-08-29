 require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
 	function ($, ko) {
	 window.ko = ko;
	 //var tokenid = ip.getTokenId();
	 var treedata;
	    //新增或者修改 类型
 		var editType;
 		var chr_id="";
 		var selectNode={};
 		var viewModel = {
 			tokenid: ip.getTokenId(),
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
 						if(chr_id=="null"){
 							viewModel.gridDataTable.clear();
 						}else{
 	 						 var data={
 	 							"chr_name":node.chr_name,
 	 							"chr_code":node.chr_code,
 	 							"org_code":node.org_code
 	 						 };
 	 						viewModel.gridDataTable.setSimpleData(data);
 	 						}
 						}
			        }
			    },
			    treeDataTable: new u.DataTable({
			    	meta: {
			    		'chr_id': {
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
			    gridDataTable: new u.DataTable({
			    	meta: {
			    		'chr_name': {},
			    		'chr_code': {},
			    		'org_code': {}
			    	}
			    }),
			};
 		
 		//初始化左边树
 		viewModel.initTree=function(){
 			$.ajax({
        		url: "/df/f_ebank/bankManage/findAllBank.do?tokenid="+viewModel.tokenid,
        		type:"GET",
        		data: {
        			ajax: "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				treedata=data.eleList;
        				viewModel.treeDataTable.setSimpleData(data.eleList,{unSelect:true});
        				var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
        	 			treeObj.expandAll(true);
        	 			
        	 			for(var j = 0; j < treedata.length; j++){
        					if(chr_id==treedata[j].chr_id){
        						viewModel.treeDataTable.setRowSelect(j);
               	 			 for(var i = 0; i < treedata.length; i++){
       								 if(treedata[i].chr_id==chr_id){
       									 var a={
       											"chr_name":treedata[i].chr_name,
       			 	 							"chr_code":treedata[i].chr_code,
       			 	 							"org_code":treedata[i].org_code
       		 		 						 }
       		       						viewModel.gridDataTable.setSimpleData(a);
       									 break;
       								 }
       							 }
        						break;
        					}
						 }
        			}
        		}
        	});
 		};
 		
 		
 		//监听搜索框，蓝色高亮显示匹配到的节点
 		inputListner=function(){
 			var searchValue = $("#bankNameSearch").val();
 			var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 			var childNodes = treeObj.transformToArray(treeObj.getNodes());
 			var chrName;
 			for ( var j = 0; j < childNodes.length; j++) {  
 				chrName = childNodes[j].chr_name;
 				chrCode = childNodes[j].chr_code;
 				isParent= childNodes[j].isParent;
 				if(chrCode==undefined){
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

 		//刷新
 		viewModel.refreshTree=function(){
 			viewModel.initTree();
 			chr_id="";
 			viewModel.gridDataTable.clear();
 			ip.ipInfoJump("刷新成功！","success");
 			
 		};
 		
 		//新增银行机构
 		viewModel.addElectronicsEle=function(){
 			editType="add";
 			$("#titleText").text("新增银行机构");
 			$("#billType").attr("disabled", false);
 			$("#bankCode").val('');
 			$("#bankName").val('');
 			$("#orgCode").val('');
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		
 		//修改银行信息
 		viewModel.modifyElectronicsEle=function(){
 			editType="modify";
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要修改的信息！","info");
				return;
			}
 			if(chr_id=="null"){
 				ip.ipInfoJump("此项不能进行修改，请选择要修改的信息！","info");
				return;
 			}
 			$("#titleText").text("修改银行机构信息");
 			$("#bankCode").val(selectNode.chr_code);
 			$("#bankName").val(selectNode.chr_name);
 			$("#orgCode").val(selectNode.org_code);
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		//删除银行机构
 		viewModel.delElectronicsEle=function(){
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要删除的信息！","info");
				return;
			}
 			if(chr_id == "null")
			{
				ip.ipInfoJump("此项不能进行删除，请选择要删除的信息！","info");
				return;
			}
 			for(var i = 0; i < treedata.length; i++){
				 if(treedata[i].parent_id==chr_id){
					 ip.ipInfoJump("因该银行有下级银行，所以不能进行删除！！！","info");
						return;
				 }
			 }
 			ip.warnJumpMsg("确定删除 【"+ selectNode.chr_name +"】 吗？", "del", "cCla");
 			$("#del").on("click", function() {
 				$.ajax({
 	        		url: "/df/f_ebank/bankManage/delElebankInfo.do?tokenid="+viewModel.tokenid,
 	        		type:"POST",
 	        		data: {
 	        			"chr_id":chr_id,
 	        			ajax: "noCache",
 	        		},
 	        		success: function(data){
 	        			if(data.result=="success"){
 	        				ip.ipInfoJump("删除成功！","success");
 	        				//刷新树
 	        				viewModel.initTree();
 	        				viewModel.gridDataTable.clear();
 	        			}else{
 	        				ip.ipInfoJump("删除失败！"+data.result,data.result);
 	        				//刷新树
 	        				viewModel.initTree();
 	        				viewModel.gridDataTable.clear();
 	        			}
 	        		}
 	        	});
				$("#config-modal").remove();
			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
 		};
 		
 		//弹出框上的确定-(新增或者修改保存)
 		viewModel.saveOrUpdate=function(){
 			var bankCode=$("#bankCode").val();
 			var bankName=$("#bankName").val();
 			var orgCode=$("#orgCode").val();
 			
 			//编码和名称校验
 			if(bankCode ==""){
 				ip.ipInfoJump("银行编码不能为空！","info");
 				return;
 			}
 			if(isNaN(bankCode)){
 				ip.ipInfoJump("银行编码只能为数字！！","info");
 				return;
 			}
 			if(bankCode.length>100){
 				ip.ipInfoJump("银行编码长度过长！","info");
 				return;
 			}
 			if(bankName ==""){
 				ip.ipInfoJump("银行名称不能为空！","info");
 				return;
 			}
 			if(bankName.length>100){
 				ip.ipInfoJump("银行名称长度过长！","info");
 				return;
 			}
 			if(orgCode ==""){
 				ip.ipInfoJump("机构码不能为空！","info");
 				return;
 			}
 			if(orgCode.length>100){
 				ip.ipInfoJump("机构码长度过长！","info");
 				return;
 			}
 			if(chr_id=="null"){
 				chr_id="";
 			}
 			var parentId=selectNode.parent_id;
 			$.ajax({
        		url: "/df/f_ebank/bankManage/saveOrUpdateBankInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"chr_id":chr_id,
        			"editType":editType,
        			"bankCode":bankCode,
        			"bankName":bankName,
        			"orgCode":orgCode,
        			ajax: "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				ip.ipInfoJump("保存成功！","success");
        				viewModel.initTree();
        			}
        			else if(data.result=="fail"){
        				ip.ipInfoJump(data.reason,"error");
        			}
        		}
        	});
 		};
 		$(function(){
 			app = u.createApp({
	            el: 'body',
	            model: viewModel
	        });
 			
 		//初始化左侧的树
 			viewModel.initTree();
 			
			
 		});
	});

