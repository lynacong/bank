require([ 'jquery', 'knockout','bootstrap', 'director', 'tree', 'grid', 'ip'], function($, ko, echarts) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	//2017-05-02 add by yanyga
	var enableEle=[];
	var eleSize=0;
	var create_type;
	var edit_type;
	
	var rule_id="";
	var viewModel={
			rightLists: ko.observableArray(),
			dataTableRuleGroup : new u.DataTable({
				meta : {
					'rule_id' : {

					},
					'pid' : {

					},
					'name' : {}
				}
			})
	};
	
	viewModel.addGroup = function() {
		var option={};
		var msgRuleDTO={};
		msgRuleDTO["msg_rule_code"]="001001";
		msgRuleDTO["msg_rule_name"]="测试";
		msgRuleDTO["invoketype"]="0";
		msgRuleDTO["upId"]="0";
		msgRuleDTO["send_type"]="0";
		msgRuleDTO["enabled"]="1";
		msgRuleDTO["content_model"]="content_model";
		msgRuleDTO["content_title"]="标题";
		option["ajax"]=1;
		option["msgType"]="new";
		option["msgRuleDTO"]=JSON.stringify(msgRuleDTO);
		option["receiver"]="用户群-1 新建用户群;用户-00100101 省委本级,00100102 省委本级单位审核,00101 省委主管,00102 主管部门审核,002 省政府主管,002001 省政府本级";
		
		
		alert(0);
    	$.ajax({
		url: "/df/messageconfig/saveMsgRule.do?tokenid="+tokenid,
		type: "POST",
		dataType : "json",
		data:option,
		success: function(data){
			console.log(data);
		}
	});
    }
	
//	viewModel.addGroup = function() {
//		alert(11);
//		create_type="newrule";
//		edit_type="new";
//		//alert("sadada");
//		$("#rule_code").attr("disabled",false);
//	    $("#rule_code").val("");
//		$("#rule_name").val("");
//		$("#remark").val("");
//		
//		//$("#rightModal .modal-dialog").css("z-index","9999");
//		$("#rightModal").show();
//		showRightModal();
//		
//	};
//	//新增权限组按钮事件-结束
//	
//	
//	  //显示每个权限组的详细信息
//    viewModel.showRightDetail = function(){
//    	var tokenid = ip.getTokenId();
//    	var rule_id ="";
//    	//var rule_id = $("#rightList li span.group-active").parent().attr("id");
//    	var treeObjRule = $.fn.zTree.getZTreeObj("ruleTree1");
//    	var nodesRule = treeObjRule.getSelectedNodes();
//    	if(nodesRule != null || nodesRule.length > 0){
//    		rule_id = nodesRule[0].rule_id;
//    	
//    	//var rule_id = $("#dataRightInput").attr("name");
//    	$.ajax({
//    		url: "/df/dataright/getSysRightList.do?tokenid"+tokenid,
//    		type: "POST",
//    		data: {
//    			"ajax": "1",
//    			"tokenid": tokenid,
//    			"rule_id": rule_id
//    		},
//    		success: function(data){
//    			if(data != null){
//	    			viewModel.rightDetaileDataTable.setSimpleData(data.rows);
//	    			var treeObj = $.fn.zTree.getZTreeObj("rightDetaile"); 
//	    			treeObj.expandAll(true);
//	    			$("#dataRightInput").val(nodesRule[0].name);
//	    			$("#dataRightInput").attr("name",nodesRule[0].id);
//	    			$("#selectAuthModal").modal("hide");
//    			}
//    		}
//    		
//    	});
//    	}else{
//    		ip.ipInfoJump("请选择","info");
//    	}
//    };
//    
//	viewModel.drCloseButton = function(){
//    	$("#ylModal").hide();
//    };
//    
//  //2017-05-02 add by yanyga
//	//新增或者修改权限的保存设置-开始
//	viewModel.rightSure = function() {
//		//alert(rule_id);
//		create_type="newrule";
//		if(eleSize <= 0){
//			ip.ipInfoJump("没有启用的权限要素，清先设置权限要素！","error");
//			$('#rightModal').modal('hide');
//			return;
//		}
//		
//		var rule_code = $("#rule_code").val();
//		if(rule_code == "")
//			{
//				ip.ipInfoJump("权限编码不能为空！","info");
//				return ;
//			}
//		var rule_name = $("#rule_name").val();
//		
//		if(rule_name == "")
//		{
//			ip.ipInfoJump("权限名称不能为空！","info");
//			return ;
//		}
//		
//		var remark = $("#remark").val();
//		
//		var list=[];
//		
//		//获取选中数据
//		for(var i=0 ; i < eleSize ; i++)
//		{
//			var obj={};
//			var idValue =   $("#addNewRule li a").eq(i).attr("id");
//			//全部按钮是否被选中
//			var isChecked = $("#gnflsRadioAll"+i).is(":checked")?1:0;
//			var right_type = 0;
//			if(isChecked == 0)
//				{
//					var eleObj = $.fn.zTree.getZTreeObj("data-tree"+enableEle[i]).getCheckedNodes(true);
//					var selectedNameValue ="";
//					if(obj == null)
//						{
//							ip.ipInfoJump("选择部分权限必须至少勾选一个要素！","info");
//							return;
//						}
//					right_type = 1 ;
//					for(var j=0 ;j< eleObj.length ;j++)
//						{
//							if(j != eleObj.length-1)
//								{
//									selectedNameValue += eleObj[j].chr_name + ",";
//								}
//							else
//								{
//									selectedNameValue += eleObj[j].chr_name;
//								}
//						}
//					obj[idValue] = selectedNameValue;
//				}
//			else
//				{
//					obj[idValue] = "1";
//				}
//			list.push(obj);
//		}
//		var current_url = location.search;
//		var tokenid = current_url.substring(current_url
//				.indexOf("tokenid") + 8, current_url
//				.indexOf("tokenid") + 48);
//		$.ajax({
//			url : "/df/dataright/saveorupdate.do?tokenid=" + tokenid,
//			type : 'POST',
//			dataType : "json",
//			data : {
//				"ajax":1,
//				"rule_code" : rule_code,
//				"rule_name" : rule_name,
//				"create_type" : create_type,
//				"edit_type" : edit_type,
//				"rule_id":rule_id,
//				"remark":remark,
//				"right_type":right_type,
//				"rule_list":JSON.stringify(list)
//			},
//			success : function(data) {
//				if (data.result == "success") {
//					
//					//刷新权限组
//					var tokenid = ip.getTokenId();
//			    	$.ajax({
//			    		url: "/df/datarightrelation/showAllGROUPlist.do?tokenid="+tokenid,
//			    		type: "POST",
//			    		data: {
//			    			"ajax": "1",
//			    			"tokenid":tokenid
//			    		},
//			    		success: function(dataRes){
//			    			if(dataRes != null && dataRes.groupList != null){
//			    				//viewModel.rightLists(data.groupList);
//			    				viewModel.dataTableRuleGroup.setSimpleData(dataRes.groupList);
//			    				
//			    				var nodesName=rule_code+" "+ rule_name;
//			    				var data_tree = $("#ruleTree1")[0]['u-meta'].tree;
//			    				var search_nodes = data_tree.getNodesByParamFuzzy("name",nodesName,null);
//			    				data_tree.selectNode(search_nodes[0]);
//			    			}
//			    			
//			    		}
//			    	});
//					
//			    	//选中操作
//					
//					ip.ipInfoJump("保存成功！","success");
//					$('#rightModal').hide();
//				}
//				else if(data.result == "fail"){
//					ip.ipInfoJump(data.reason,"error");
//				}
//			}
//		});
//	};
//	//新增或者修改权限的保存设置-结束
//	
//    
//    viewModel.rightModelCloseButton = function(){
//    	$("#rightModal").hide();
//    };
//    
//    viewModel.showYLModelDialog=  function() {
//		$("#ylModal").show();
//		showYLModal();
//	};
//	
//	 function showYLModal(){
//			//$('#ylModal').on('show.bs.modal',function(event) {
//				
//				var detail_list = $("#detail_list");
//				//清空之前的预览数据
//				detail_list.empty();
//				
//				//获取选中数据
//				for(var i=0 ; i < eleSize ; i++)
//				{
//					//获取ele_code值
//					var idValue = $("#addNewRule li a").eq(i).attr("id");
//					
//					//获取ele_name值 即页签名称
//					var ele_class_name = $("#"+idValue).text();
//					//全部按钮是否被选中
//					var isChecked = $("#gnflsRadioAll"+i).is(":checked")?1:0;
//					if(isChecked == 0)
//						{
//							var eleObj = $.fn.zTree.getZTreeObj("data-tree"+enableEle[i]).getCheckedNodes(true);
//							var addHtml = "";
//							
//							addHtml += "<ul class='display-ul'>"+ele_class_name;
//							for(var j=0 ;j< eleObj.length ;j++)
//								{
//								   addHtml += "<li class='display-li'><span class='glyphicon glyphicon-list-alt list-icon-color' aria-hidden='true'></span><span>"+ eleObj[j].chr_name + "</span></li>";
//								}
//							addHtml += "</ul>";
//							detail_list.append(addHtml);
//						}
//				}
//			//});
//	     };
//	
//	
//	function showModel(){
//		alert(10);
//	};
//	
	$(function() {
		app = u.createApp({
			el : 'body',
			model : viewModel
		});



		
	});
});