define(['text!pages/stampmanage/stampManage.html','commonUtil',     
        'jquery','uui','tree', 'bootstrap','ip','datatables.net-bs', 
        'datatables.net-autofill-bs', 
        'datatables.net-buttons-bs', 'datatables.net-colreorder',
        'datatables.net-rowreorder', 'datatables.net-select',
        'datatables.net-scroller',
        'datatables.net-keyTable', 
        'datatables.net-responsive'],function(html,commonUtil){
	var init =function(element,param){ 
		document.title=ip.getUrlParameter("menuname");
	    //新增或者修改 类型
 		var editType;
 		var chr_id="";
 		var selectNode = {};
 		var viewModel = {
 			tokenid : ip.getTokenId(),
 			treeSetting:{
 				view:{
 					showLine:false,
 					selectedMulti:false
 				},
 				callback:{
 					onClick:function(e,id,node){
 						 var stampInfo =[];
 						 selectNode=node;
 						 chr_id=node.chr_id;
 						 isParent=node.isParent;
 						 if(isParent){
 							$('#gridTest').dataTable().fnClearTable();
 						 }else{
 							stampInfo.push({
 		 							"chr_code":node.chr_code,
 		 							"chr_name":node.chr_name,
 		 							"financeCode":node.finance_code,
 		 							"type": node.type
 		 						 });
 							 if(!node.isParent&&node.chr_code!=undefined){
 								 $('#gridTest').DataTable({
 									destroy: true,
					 			    searching: false,
					 		        paging: false,
					 		        bSort: false,
					 		        bInfo: false,
 						 		   language: {
 						            'zeroRecords': '没有检索到数据'
 						            },
 							        data:stampInfo,
 							        columns: [
 							            { "data": "chr_code",width:'60%'},
 							            { "data": "chr_name",width:'40%'}//,
 							        ]
 							    });
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
 			$('#gridTest').dataTable().fnClearTable();
 		};
 		
 		//刷新
 		refreshTree=function(){
 			viewModel.initTree();
 			chr_id="";
 			ip.ipInfoJump("刷新成功！","success");
 			$('#gridTest').dataTable().fnClearTable();
 		};
 		
 		//新增印章
 		addStamp=function(){
 			editType="add";
 			var finance_code = $("#finance_code").val();
 			var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 			var nodes = treeObj.getSelectedNodes();
 			if((finance_code=="000000"||finance_code=="")&&nodes.length==0){
 				ip.warnJumpMsg("请先选择具体的财政机构！",0,0,true);
				return;
 			}
 			$("#stampSetModel input").val("");
 			$("#titleText").text("新增印章信息");
 			$("#stampSetModel").modal("show");
 		};
 		
 		//修改印章
 		modifyStamp=function(){
 			editType="modify";
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要修改的电子印章信息！",0,0,true);
				return;
			}
 			if(isParent == true){
 				ip.warnJumpMsg("请选择子节点！",0,0,true);
				return;
 			}
 			$("#titleText").text("修改印章信息");
 			$("#stampCode").val(selectNode.chr_code);
 			$("#stampName").val(selectNode.chr_name);
 			$("#stampSetModel").modal("show");
 		};
 		
 		//删除印章
 		delStamp=function(){
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要删除的信息！",0,0,true);
				return;
			}
 			var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
 			var nodes = treeObj.getSelectedNodes();
 			if(nodes[0].finance_code == null || nodes[0].finance_code == "" ){
 				ip.warnJumpMsg("当前为财政区划信息，不能删除，请重新选择！",0,0,true);
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
 	        			chr_id="";
 	        			if(data.result=="success"){
 	        				ip.ipInfoJump("删除成功！","success");
 	        				//刷新树
 	        				viewModel.initTree();
 	        				$('#gridTest').dataTable().fnClearTable();
 	        				$("#config-modal").remove();
 	        			}
 	        			else if(data.result=="fail"){
 	        				$("#config-modal").remove();
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
 		saveOrUpdate=function(){
 			var stampCode=$("#stampCode").val();
 			var stampName=$("#stampName").val();
 			
 			//编码和名称校验
 			if(stampCode ==""){
 				ip.warnJumpMsg("印章编码不能为空！",0,0,true);
 				return false; 
 			}
 			if(stampCode.length>100){
 				ip.warnJumpMsg("印章编码长度过长！",0,0,true);
 				return false;
 			}
 			if(stampName ==""){
 				ip.warnJumpMsg("印章名称不能为空！",0,0,true);
 				return false;
 			}
 			if(stampName.length>100){
 				ip.warnJumpMsg("印章名称长度过长！",0,0,true);
 				return false;
 			}
 			
 			var stampType="公章";//$('#stampType').val();
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
        				chr_id="";
        				ip.ipInfoJump("保存成功！","success");
        				viewModel.initTree();
        				$("#stampSetModel").modal("hide");
        				$('#gridTest').dataTable().fnClearTable();
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
 		
 		//监听搜索框，黄色高亮显示匹配到的节点
 		inputListner=function(event){
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
 					if(searchValue!="" && (chrName.indexOf(searchValue)!=-1 || chrCode.indexOf(searchValue)!=-1)){
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
 		
 		pageInit =function(){
 			app = u.createApp({
				el :element,
				model : viewModel
			});
 			// 初始化财政机构的下拉框
 			var param = ip.getCommonOptions({});
 		    // 初始化财政机构的下拉框
 			commonUtil.initFinanceCode("",param);
 			//初始化左侧的树
			viewModel.initTree();
			$('#gridTest').DataTable({
					destroy: true,
 			    searching: false,
 		        paging: false,
 		        bSort: false,
 		        bInfo: false,
		 		   language: {
		            'zeroRecords': '没有检索到数据',
		            },
			        data:null,
			        columns: [
			            { "data": "chr_code",width:'60%'},
			            { "data": "chr_name",width:'40%'}
			          //  { "data": "type"    }
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

