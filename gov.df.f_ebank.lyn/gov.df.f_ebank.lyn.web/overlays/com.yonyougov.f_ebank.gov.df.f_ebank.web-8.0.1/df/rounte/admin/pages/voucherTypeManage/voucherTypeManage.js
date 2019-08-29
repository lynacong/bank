define(['text!pages/voucherTypeManage/voucherTypeManage.html','commonUtil',     
        'jquery','uui', 'tree', 'bootstrap','ip','datatables.net-bs', 
        'datatables.net-autofill-bs','datatables.net-buttons-bs', 
        'datatables.net-colreorder','datatables.net-rowreorder',
        'datatables.net-select','datatables.net-scroller',
        'datatables.net-keyTable','datatables.net-responsive'],function(html,commonUtil){
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
 						var parent_id=node.parent_id;
 						if(chr_id=="null"){
 							$('#gridTest').dataTable().fnClearTable();
 						}else{
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
								  data.push({
			 							"chr_code":node.chr_code,
	 		 							"chr_name":node.chr_name
	 		 						 });
							 }
	 						 $('#gridTest').DataTable( {
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
							            { data: 'chr_code' },
							            { data: 'chr_name' }
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
			    }),
			};
 		
 		
 		fGetGrid = function() {
 			chr_id="";
 			$('#gridTest').dataTable().fnClearTable();
			viewModel.initTree();
		};
 		
 		//初始化左边树
 		viewModel.initTree = function(){
 			var finance_code = $("#finance_code").val();
 			$.ajax({
        		url: "/df/ebankVoucherManage/findAllBillandPosition.do?tokenid="+viewModel.tokenid,
        		type:"GET",
        		data: {
        			"ajax": "noCache",
        			"financeCode" : finance_code,
        		},
        		success: function(data){
        			if(data.result == "success"){
        				treedata = data.eleList;
        				viewModel.treeDataTable.setSimpleData(data.eleList,{unSelect:true});
        				var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
        				treeObj.expandNode((treeObj.getNodes())[0]);
        				for(var i = 0; i < treedata.length; i++){
        					if(chr_id == treedata[i].chr_id){
        						selectNode = treedata[i];
        						viewModel.treeDataTable.setRowSelect(i);
        						var vou = [];
       								if(treedata[i].parent_id == chr_id || treedata[i].chr_id == chr_id){
       									 var a = {
       		 		 							"chr_code":treedata[i].chr_code,
       		 		 							"chr_name":treedata[i].chr_name
       		 		 						 };
       									 vou.push(a);
       								 }
       								if(chr_id == "null"){
       									vou=[];
       								}
       								$('#gridTest').DataTable({
       								destroy: true,
       				 			    searching: false,
       				 		        paging: false,
       				 		        bSort: false,
       				 		        bInfo: false,
       						 		   	language: {
       						 		   		'zeroRecords': '没有检索到数据'
       						            },
       							        data:vou,
       							        columns: [
       							            { data: 'chr_code'},
       							            { data: 'chr_name'}
       							        ]
       							    });
	       	 						break;
        					}
						 }
        			}
        		}
        	});
 		};
 		//初始化下拉列表
		viewModel.initDropDownList = function(){
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
 					var html = "<option value=''>"+data.rows[0].show_name+"</option>";
					for ( var i = 1; i < data.rows.length; i++) {
						html+="<option value="+data.rows[i].chr_id+">"+data.rows[i].show_name+"</option>";
					}
					$("#billType").html(html);
		 		}
		 	});
		};
		//同步按钮的事件
 		btnSynClick = function(){
 			$.ajax({
        		url: "/df/ebankVoucherManage/creSynBillAndPosition.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"billTypeId":"1",
        			"financeCode":$("#finance_code").val(),
        			"ajax": "noCache",
        		},
        		success: function(data){
        			if(data.result == "success"){
        				ip.ipInfoJump("同步成功！","success");
        				refreshTree();
        			}
        			else if(data.result == "fail"){
        				ip.warnJumpMsg(data.reason,0,0,true);
        			}
        		}
        	});
 		};
 		//刷新
 		refreshTree = function(){
 			viewModel.initTree();
 			chr_id = "";
 			$('#gridTest').dataTable().fnClearTable();
 			ip.ipInfoJump("刷新成功！","success");
 			
 		};
 		
 		//新增电子凭证
 		addElectronicsEle = function(){
 			editType = "add";
 			$("#titleText").text("新增电子凭证信息");
 			$("#billTypeCode").val("");
 			$("#billTypeName").val("");
 			$("#billType").val("");
 			$("#billType").attr("disabled", false);
 			viewModel.initDropDownList();
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		//修改电子凭证
 		modifyElectronicsEle = function(){
 			editType="modify";
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要修改的信息！",0,0,true);
				return;
			}
 			if(chr_id == "null"){
 				ip.warnJumpMsg("此项不能进行修改，请选择要修改的信息！",0,0,true);
				return;
 			}
 			$("#titleText").text("修改电子凭证信息");
 			$("#billTypeCode").val(selectNode.chr_code);
 			$("#billTypeName").val(selectNode.chr_name);
 			$("#billType").val("");
 			$("#billType option[value='"+selectNode.parent_id+"']").prop("selected", true);
 			$("#billType").attr("disabled", true);
 			//默认选中父级节点 如果没有 选中空缺
 			$("#msgAddBillTypeSetModel").modal("show");
 		};
 		
 		//删除电子凭证
 		delElectronicsEle = function(){
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要删除的信息！",0,0,true);
				return;
			}
 			if(chr_id=="null"){
 				ip.warnJumpMsg("此项不能进行删除，请选择要删除的信息！",0,0,true);
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
 	        			if(data.result == "success"){
 	        				ip.ipInfoJump("删除成功！","success");
 	        				refreshTree();
 	        			}else{
 	        				ip.warnJumpMsg(data.reason,0,0,true);
 	        			}
 	        		}
 	        	});
 			});
 			$(".cacel").click(function(){
 				$("#config-modal").remove();
 			});
 		};
 		
 		//弹出框上的确定-(新增或者修改保存)
 		saveOrUpdate = function(){ 			
 			var finance_code = $("#finance_code").val();
 			var billTypeCode = $("#billTypeCode").val();
 			var billTypeName = $("#billTypeName").val();
 			
 			//编码和名称校验
 			if(billTypeCode == ""){
 				ip.warnJumpMsg("凭证编码不能为空！",0,0,true);
 				return;
 			}
 			if(billTypeCode.length > 100){
 				ip.warnJumpMsg("凭证编码长度过长！",0,0,true);
 				return;
 			}
 			if(billTypeName == ""){
 				ip.warnJumpMsg("凭证名称不能为空！",0,0,true);
 				return;
 			}
 			if(billTypeName.length > 100){
 				ip.warnJumpMsg("凭证名称长度过长！",0,0,true);
 				return;
 			}
 			var billTypeParentCode = $("#billType").val();
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
        			if(data.result == "success"){
        				ip.ipInfoJump("保存成功！","success");   
        				$("#msgAddBillTypeSetModel").modal("hide");
        				viewModel.initTree();
        			}else if(data.result == "fail"){
        				ip.warnJumpMsg(data.reason,0,0,true);
        			}
        		}
        	});
 		};
 		
		pageInit = function(){
			app = u.createApp({
				el :element,
				model : viewModel
			});
			 // 初始化财政机构的下拉框
 			var param = ip.getCommonOptions({});
 			commonUtil.initFinanceCode("",param);
 			//初始化左侧的树
			viewModel.initTree();
			viewModel.initDropDownList();
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
			            { data: 'chr_code' },
			            { data: 'chr_name' }
			        ]
			    });
 		};

 		$(element).html(html);	
 		pageInit();
	};		
	return {
		init:init
	};
});

