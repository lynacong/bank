define(['text!pages/bankManage/bankManage.html',
        'jquery','uui', 'tree', 'bootstrap','ip',
        'datatables.net-bs','datatables.net-autofill-bs', 
        'datatables.net-buttons-bs', 'datatables.net-colreorder',
        'datatables.net-rowreorder', 'datatables.net-select',
        'datatables.net-scroller','datatables.net-keyTable', 
        'datatables.net-responsive'],function(html){
	var init =function(element,param){ 
		document.title=ip.getUrlParameter("menuname");
		var treedata;
	    //新增或者修改 类型
 		var editType;
 		var chr_id="";
 		var selectNode={};
 		var viewModel = {
 			tokenid: ip.getTokenId(),
 			treeSetting:{
 				view:{
 					showLine:false,
 					selectedMulti:false
 				},
 				callback:{
 					onClick:function(e,id,node){
 						var data=[];
 						selectNode=node;
 						chr_id=node.chr_id;
 						if(chr_id=="null"){
 							$('#gridTest').dataTable().fnClearTable();
 						}else{
 	 						 var a={
 	 							"chr_name":node.chr_name,
 	 							"chr_code":node.chr_code,
 	 							"org_code":node.org_code,
 	 							"banktype":node.banktype,
 	 						 };
 	 						 data.push(a);
 	 						 $('#gridTest').DataTable({
								destroy: true,
				 			    searching: false,
				 		        paging: false,
				 		        bSort: false,
				 		        bInfo: false,
						        language: {
						            'zeroRecords': '没有检索到数据'
						            },
						        data:data,
						        columns: [
						            { data: 'chr_name' ,width:'25%'},
						            { data: 'chr_code' ,width:'20%'},
						            { data: 'org_code' ,width:'20%'},
						            { data: 'banktype' ,width:'20%',
						              "render" : function(data, type, full) {
				    					   if (data == "1") {
				    						   return "办理行";
				    					   	}else if(data == "2"){
				    					   	   return "开户行";
				    					   	}else{
				    					   		return "";
				    					   	}
				    				}}
						        ]
						    } );
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
			    })
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
        						selectNode=treedata[j];
        						viewModel.treeDataTable.setRowSelect(j);
        						for(var i = 0; i < treedata.length; i++){
        							if(treedata[i].chr_id==chr_id){
        								var s={
       											"chr_name":treedata[i].chr_name,
       			 	 							"chr_code":treedata[i].chr_code,
       			 	 							"org_code":treedata[i].org_code,
       			 	 							"banktype":treedata[i].banktype,
       		 		 						 }
       									var datas=[];
       									datas.push(s);
       									$('#gridTest').DataTable( {
       	 									destroy: true,
       	 					 			    searching: false,
       	 					 		        paging: false,
       	 					 		        bSort: false,
       	 					 		        bInfo: false,
       	 							        language: {
       	 							        	'zeroRecords': '没有检索到数据'
   	 							            },
   									        data:datas,
   									        columns: [
								                { data: 'chr_name' ,width:'25%'},
   									            { data: 'chr_code' ,width:'20%'},
   									            { data: 'org_code' ,width:'20%'},
   									            { data: 'banktype' ,width:'20%',
   									              "render" : function(data, type, full) {
       						    					   if (data == "1") {
       						    						   return "办理行";
       						    					   	}else if(data == "2"){
       						    					   	   return "开户行";
       						    					   	}else{
       						    					   		return "";
       						    					   	}
       						    				}}
   									        ]
   									    } );
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
 		inputListner = function(event){
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
 		refreshTree=function(){
 			chr_id="";
 			viewModel.initTree();
 			$('#gridTest').dataTable().fnClearTable();
 			//viewModel.gridDataTable.clear();
 			ip.ipInfoJump("刷新成功！","success");
 			
 		};
 		
 		//新增银行机构
 		addElectronicsEle=function(){
 			editType="add";
 			$("#titleText").text("新增银行机构");
 			$("#bankCode").val('').attr("disabled",false);
 			$("#bankName").val('');
 			$("#orgCode").val('');
			$("#banktype").attr("disabled", false);
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		
 		//修改银行信息
 		modifyElectronicsEle=function(){
 			editType="modify";
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要修改的信息！",0,0,true);
				return;
			}
 			if(chr_id=="null"){
 				ip.warnJumpMsg("此项不能进行修改，请选择要修改的信息！",0,0,true);
				return;
 			}
 			$("#titleText").text("修改银行机构信息");
 			$("#bankCode").val(selectNode.chr_code).attr("disabled","disabled");
 			$("#bankName").val(selectNode.chr_name);
 			$("#orgCode").val(selectNode.org_code);
 			$("#banktype").val(selectNode.banktype).attr("disabled","disabled");
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		//删除银行机构
 		delElectronicsEle=function(){
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要删除的信息！",0,0,true);
				return;
			}
 			if(chr_id == "null"){
 				ip.warnJumpMsg("此项不能进行删除，请选择要删除的信息！",0,0,true);
				return;
			}
 			for(var i = 0; i < treedata.length; i++){
				 if(treedata[i].parent_id==chr_id){
					 ip.warnJumpMsg("因该银行有下级银行，所以不能进行删除！！！",0,0,true);
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
 	        				$('#gridTest').dataTable().fnClearTable();
 	        			}else{
 	        				ip.warnJumpMsg("删除失败！"+data.result,0,0,true);
 	        				//刷新树
 	        				viewModel.initTree();
 	        				$('#gridTest').dataTable().fnClearTable();
 	        			}
 	        			//进行删除操作后，不论成功与否，当前选中节点置空
 	        			chr_id = "";
 	        		}
 	        	});
				$("#config-modal").remove();
			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
 		};
 		
 		//弹出框上的确定-(新增或者修改保存)
 		saveOrUpdate=function(){
 			var bankCode=$("#bankCode").val();
 			var bankName=$("#bankName").val();
 			var orgCode=$("#orgCode").val();
 			var banktype=$("#banktype").val();
 			
 			if(banktype ==null){
 				ip.warnJumpMsg("请选择银行类别！",0,0,true);
 				return;
 			}
 			
 			//编码和名称校验
 			if(bankCode ==""){
 				ip.warnJumpMsg("银行编码不能为空！",0,0,true);
 				return;
 			}
 			
 			if(isNaN(bankCode)){
 				ip.warnJumpMsg("银行编码只能为数字！",0,0,true);
 				return;
 			}
 			if(bankName ==""){
 				ip.warnJumpMsg("银行名称不能为空！",0,0,true);
 				return;
 			}
 			if(orgCode ==""){
 				ip.warnJumpMsg("机构码不能为空！",0,0,true);
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
        			"banktype":banktype,
        			ajax: "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				ip.ipInfoJump("保存成功！","success");
        				viewModel.initTree();
        			}
        			else if(data.result=="fail"){
        				ip.warnJumpMsg("失败，"+data.reason,0,0,true);
        			}
        			$("#msgAddBillTypeSetModel").modal("hide");
        		}
        	});
 		};
 		
 		pageInit =function(){
 			app = u.createApp({
				el :element,
				model : viewModel
			});
 			//初始化左侧的树
			viewModel.initTree();
			$('#gridTest').DataTable({
					destroy: true,
	 			    searching: false,
	 		        paging: false,
	 		        bSort: false,
	 		        bInfo: false,
			        language: {
			            'zeroRecords': '没有检索到数据'
			            },
			        data:null,
			        columns: [
			            { data: 'chr_name' ,width:'25%'},
			            { data: 'chr_code' ,width:'20%'},
			            { data: 'org_code' ,width:'20%'},
			            { data: 'banktype' ,width:'20%',
			              "render" : function(data, type, full) {
	    					   if (data == "1") {
	    						   return "办理行";
	    					   	}else if(data == "2"){
	    					   	   return "开户行";
	    					   	}else{
	    					   		return "";
	    					   	}
	    				}}
			        ]
			    } );
 		};

 		$(element).html(html);	
 		pageInit();

        };		
 		return {
 			init:init
 		};
	});

