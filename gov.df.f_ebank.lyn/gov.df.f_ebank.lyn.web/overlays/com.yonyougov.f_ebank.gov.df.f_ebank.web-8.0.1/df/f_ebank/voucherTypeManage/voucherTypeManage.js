 require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
 	function ($, ko) {
	 window.ko = ko;
	// var tokenid = ip.getTokenId();
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
 						var data=[];
 						 selectNode=node;
 						 var parent_id=node.parent_id;
 						 chr_id=node.chr_id;
 						 if(parent_id==null || parent_id==''){
 							 var parentData={"chr_code":node.chr_code,
	 		 							"chr_name":node.chr_name
	 		 							};
 							data.push(parentData);
 							 for(var i = 0; i < treedata.length; i++){
 								var s=treedata[i].parent_id;
 								 if(treedata[i].parent_id==chr_id){
 									 var a={
 		 		 							"chr_code":treedata[i].chr_code,
 		 		 							"chr_name":treedata[i].chr_name
 		 		 						 };
 									 data.push(a);
 									
 								 }
 							 }
 						 }else{
 							  data={
	 		 							"chr_code":node.chr_code,
	 		 							"chr_name":node.chr_name
	 		 						 };
 							
 						 }
 						viewModel.gridDataTable.setSimpleData(data);
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
			    		'chr_code': {},
			    		'chr_name': {}
			    	}
			    }),
			};
 		
 	// 下拉框赋值
		viewModel.initCombo = function() {

			$.ajax({
						url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid="
								+ viewModel.tokenid,
						type : "GET",
						dataType : "json",
						data : {
							"ajax" : "noCache"
						},
						success : function(datas) {
							if (datas.errorCode == "0") {
								for ( var i = 0; i < datas.dataDetail.length; i++) {
									var x = document
											.getElementById("finance_code");
									var option = document
											.createElement("option");
									option.text = datas.dataDetail[i].chr_name;
									option.value = datas.dataDetail[i].chr_code;

									try {
										// 对于更早的版本IE8
										x.add(option, x.options[null]);
									} catch (e) {
										x.add(option, null);
									}
									
									viewModel.initTree();
									viewModel.initDropDownList();

								}
							} else {
								ip.ipInfoJump("加载Combo失败！原因："
										+ datas.result, "error");
							}
						}
					});
		};
 		
 		fGetGrid = function() {
 			chr_id="";
 			viewModel.gridDataTable.clear();
			viewModel.initTree();
			viewModel.initDropDownList();
		};
 		
 		//初始化左边树
 		viewModel.initTree=function(){
 			//var rg_code = document.getElementById("rg_code").value;
 			var finance_code = $("#finance_code").val();
 			$.ajax({
        		url: "/df/ebankVoucherManage/findAllBillandPosition.do?tokenid="+viewModel.tokenid,
        		type:"GET",
        		data: {
        			"ajax": "noCache",
        			"financeCode" : finance_code,
        		},
        		success: function(data){
        			if(data.result=="success"){
        				treedata=data.eleList;
        				viewModel.treeDataTable.setSimpleData(data.eleList,{unSelect:true});
        				for(var i = 0; i < treedata.length; i++){
        					if(chr_id==treedata[i].chr_id){
        						viewModel.treeDataTable.setRowSelect(i);
        						var vou=[];
               	 			 for(var i = 0; i < treedata.length; i++){
       								var s=treedata[i].parent_id;
       								 if(treedata[i].parent_id==chr_id || treedata[i].chr_id==chr_id){
       									 var a={
       		 		 							"chr_code":treedata[i].chr_code,
       		 		 							"chr_name":treedata[i].chr_name
       		 		 						 };
       									 vou.push(a);
       									
       								 }
       							 }
       						viewModel.gridDataTable.setSimpleData(vou);
        						break;
        					}
						 }
        				//viewModel.treeDataTable.setRowSelect(10);
        				//勾选使用
        				//var treeObj = $.fn.zTree.getZTreeObj("tree_elerule"); 
        			//	treeObj.cancelSelectedNode();
        			}
        		}
        	});
 		};
 		
 		//刷新
 		viewModel.refreshTree=function(){
 			viewModel.initTree();
 			viewModel.initDropDownList();
 			chr_id="";
 			viewModel.gridDataTable.clear();
 			ip.ipInfoJump("刷新成功！","success");
 			
 		};
 		
 		//新增电子凭证
 		viewModel.addElectronicsEle=function(){
 			editType="add";
 			$("#titleText").text("新增电子凭证信息");
 			$("#billTypeCode").val("");
 			$("#billTypeName").val("");
 			$("#billType").val("");
 			$("#billType").attr("disabled", false);
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		
 		//修改电子凭证
 		viewModel.modifyElectronicsEle=function(){
 			editType="modify";
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要修改的信息！","info");
				return;
			}
 			$("#titleText").text("修改电子凭证信息");
 			$("#billTypeCode").val(selectNode.chr_code);
 			$("#billTypeName").val(selectNode.chr_name);
 			$("#billType").val("");
 			$("#billType option[value='"+selectNode.parent_id+"']").prop("selected", true);
 			$("#billType").attr("disabled", true);
 			//默认选中父级节点 如果没有 选中空缺
// 			console.log(selectNode);
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		//删除电子凭证
 		viewModel.delElectronicsEle=function(){
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要删除的信息！","info");
				return;
			}
 			ip.warnJumpMsg("确定要删除【"+selectNode.chr_code+" "+selectNode.chr_name+"】吗？","sad","cacel",false);
 			$("#sad").click(function(){
 				$("#config-modal").remove();
 				var finance_code = $("#finance_code").val();
 	 			$.ajax({
 	        		url: "/df/ebankVoucherManage/delElebillInfo.do?tokenid="+viewModel.tokenid,
 	        		type:"POST",
 	        		data: {
 	        			"chr_code1":selectNode.chr_code1,
 	        			"chr_id":chr_id,
 	        			"financeCode":finance_code,
 	        			"ajax": "noCache",
 	        		},
 	        		success: function(data){
 	        			if(data.result=="success"){
 	        				viewModel.refreshTree();
 	        				ip.ipInfoJump("删除成功！","success");
 	        				//刷新树
 	        				/*viewModel.initTree();
 	        				viewModel.gridDataTable.clear();*/
 	        			}else{
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
 			//var rgCode= document.getElementById("rg_code").value;
 			var finance_code = $("#finance_code").val();
 			var billTypeCode=$("#billTypeCode").val();
 			var billTypeName=$("#billTypeName").val();
 			
 			//编码和名称校验
 			if(billTypeCode ==""){
 				ip.ipInfoJump("凭证代码不能为空！","info");
 				return;
 			}
 			if(billTypeCode.length>100){
 				ip.ipInfoJump("凭证代码长度过长！","info");
 				return;
 			}
 			if(billTypeName ==""){
 				ip.ipInfoJump("凭证名称不能为空！","info");
 				return;
 			}
 			if(billTypeName.length>100){
 				ip.ipInfoJump("凭证名称长度过长！","info");
 				return;
 			}
 			
 			var billTypeParentCode=$('#billType option:selected').val();
 			$.ajax({
        		url: "/df/ebankVoucherManage/saveOrUpdateElebillInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"chrId":chr_id,
        			"editType":editType,
        			"billTypeCode":billTypeCode,
        			"billTypeName":billTypeName,
        			"billTypeParentCode":billTypeParentCode,
        			"financeCode":finance_code,
        			"ajax": "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				//viewModel.refreshTree();
        				viewModel.initTree();
        	 			viewModel.initDropDownList();
        				ip.ipInfoJump("保存成功！","success");
        				/*viewModel.initTree();
        				viewModel.initDropDownList();
        				viewModel.gridDataTable.clear();*/
        			}
        			else if(data.result=="fail"){
        				ip.warnJumpMsg(data.reason,0,0,true);
        				//ip.ipInfoJump(data.reason,"error");
        			}
        		}
        	});
 		};
 		
 		
 		//同步按钮的事件
 		viewModel.btnSynClick=function(){
 			$.ajax({
        		url: "/df/ebankVoucherManage/creSynBillAndPosition.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"billTypeId":"1",
        			"financeCode":$("#finance_code").val(),
        			"ajax": "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				viewModel.refreshTree();
        				ip.ipInfoJump("同步成功！","success");
        			}
        			else if(data.result=="fail"){
        				ip.warnJumpMsg(data.reason,0,0,true);
        				//ip.ipInfoJump(data.reason,"error");
        			}
        		}
        	});
 		};
 		
 		//初始化下拉列表
		viewModel.initDropDownList = function(){
			//var rg_code = document.getElementById("rg_code").value;
			var finance_code = $("#finance_code").val();
		 	$.ajax({
 				url : "/df/ebankVoucherManage/initBillTypeList.do?tokenid="+viewModel.tokenid,
 				type : 'GET',
 				dataType : "json",
 				data: {
 					"ajax":1,
 					"financeCode":finance_code
 					},
 				success : function(data) {
// 					console.log(data);
 					if(data.result=="success"){
 						 viewModel.dataArr(data.rows);
 					}
 					else if(data.result=="fail"){
 						ip.warnJumpMsg("初始化电子凭证列表失败",0,0,true);
 						//ip.ipInfoJump("初始化电子凭证列表失败","error");
 					}
		 		}
		 	});
		};
		
 		$(function(){
 			app = u.createApp({
	            el: 'body',
	            model: viewModel
	        });
 			
 		// 初始化财政机构的下拉框
			viewModel.initCombo();
 			
			
 		});
	});

