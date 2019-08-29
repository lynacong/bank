require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
function ($, ko) {
	var selectNode;
	var viewModel = {
			entry_side: [{
	            "value": "1",
	            "name": "借"
	        }, {
	            "value": "0",
	            "name": "贷"
	        }],	
	        is_primary_source: [{
	            "value": "1",
	            "name": "是"
	        }, {
	            "value": "0",
	            "name": "否"
	        }],	
	        is_primary_target: [{
	            "value": "1",
	            "name": "是"
	        }, {
	            "value": "0",
	            "name": "否"
	        }],	
			ctrl_level: [{
	            "value": "0",
	            "name": "不控制"
	        }, {
	            "value": "1",
	            "name": "警告控制"
	        }, {
	            "value": "2",
	            "name": "严格控制"
	        }],	
	    treeSetting:{
	        view:{
	            showLine:false,
	            selectedMulti:false
	        },
	        callback:{
	            onClick:function(e,id,node){
	            }
	        }
	    },
	    dataTableRightList : new u.DataTable({
			meta : {
				'chr_id' : {

				},
				'parent_id' : {

				},
				'chr_name' : {}
			}
		}),
		gridDataTableRightList : new u.DataTable({
			meta : {
				"chr_id" : {},
				'ele_name' : {},
				'ele_code' : {},
				'ele_source' : {},
			}
		}),
	    busvoutypetreeSetting:{
	        view:{
	            showLine:false,
	            selectedMulti:false
	        },
	        callback:{
	            onClick:function(e,id,node){
	            	selectNode = node;
	                var vou_type_id = node.vou_type_id;
	                var vou_type_code = node.vou_type_code;
	                $("#vou_type_code_text").val(vou_type_code);
	                var vou_type_name = node.vou_type_name;
	                var strs= new Array();
	                strs = vou_type_name.split(" ");
	                $("#vou_type_name_text").val(strs[1]);
	                $.ajax({
	                	url:"/df/gl/configure/getacctmdl.do?tokenid=" + tokenid,
	                	data:{"ajax":"nocache","vou_type_id":vou_type_id},
	                	type:"POST",
	                	dataType:"json",
	                	success:function(data){
	                		$(".gl-form-container-busvou").css("display","none");
	                		$(".gl-form-container-grid").css("display","block");
	                		$("#vou_type_name_text").removeAttr("readOnly");
	                		$("#vou_type_code_text").removeAttr("readOnly");
	                		$("#addOneRow").removeAttr("disabled"); 
	                		$("#deleteRow").removeAttr("disabled"); 
	                		$("#saveRow").removeAttr("disabled"); 
	                		viewModel.gridDatas = data;
	                		viewModel.gridDataTable.setSimpleData(viewModel.gridDatas);
	                	}
	                });
	            }
	        }
	    },
	    accounttreeSetting:{
	        view:{
	            showLine:false,
	            selectedMulti:false
	        },
	        callback:{
	            onClick:function(e,id,node){
	                var account_id =  node.accountId;
	                $.ajax({
	                	url:"/df/gl/configure/getacctmdlbyaccid.do?tokenid=" + tokenid,
	                	data:{"account_id": account_id,"ajax":"nocache"},
	                	type:"GET",
	                	dataType:"json",
	                	success:function(data){
	                		for(var i=0;i<data.length;i++){
	                			if(data[i].bvType==null){
	                				
	                			}else{
	                				data[i]["voutype_name"] = data[i].bvType.vou_type_code + " " + data[i].bvType.vou_type_name;
	                			}
	        				}
	                		$("#vou_type_name_text").val(node.chr_name);
	                		$("#vou_type_code_text").val(node.chr_code);
	                		$("#vou_type_name_text").attr("readOnly","readOnly");
	                		$("#vou_type_code_text").attr("readOnly","readOnly");
	                		$("#addOneRow").attr("disabled", true); 
	                		$("#deleteRow").attr("disabled", true); 
	                		$("#saveRow").attr("disabled", true); 
	                		$(".gl-form-container-busvou").css("display","block");
	                		$(".gl-form-container-grid").css("display","none");
	        				viewModel.busvouDataTable.setSimpleData(data);
	                	}
	                });
	            }
	        }
	    },
	    voutypeTree: new u.DataTable({
	        meta: {
	            'vou_type_id': {
	                'value':""
	            },
	            'parentid': {
	                'value':""
	            },
	            'vou_type_name':{
	                'value':""
	            }
	        }
	    }),
	    leftaccountTree: new u.DataTable({
	        meta: {
	            'id': {
	                'value':""
	            },
	            'parentId': {
	                'value':""
	            },
	            'codename':{
	                'value':""
	            }
	        }
	    }),
	    gridDataTable: new u.DataTable({
	        meta: {
	            'account_name': {},
	            'entry_side': {},
	            'is_primary_source':{},
	            'is_primary_target':{},
	            'ctrl_level':{},
	            'rule_id':{},
	            'acctmdl_id':{}
	        }
	    }),
	    busvouDataTable: new u.DataTable({
	        meta: {
	            'voutype_name': {},
	            'entry_side': {},
	            'is_primary_source':{},
	            'is_primary_target':{},
	            'ctrl_level':{},
	            'rule_id':{},
	            'acctmdl_id':{}
	        }
	    })
	};
	
	var tokenid = ip.getTokenId();
	eidtTypeFun = function(obj) {
		$.ajax({
			url:"/df/gl/configure/getaccount.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			type: 'GET',
			dataType: 'json',
			success: function (data){
				viewModel.accountTree = data;

                var demo = viewModel.gridDataTable;
                demo.accountTree = data;
                var index = demo.getIndexByRowId(demo.getRowByField(obj.field,obj.value).rowId);
                demo.setRowFocus(index);
//		setTimeout(function(){
                var ele_code = obj.field;
                showSuxiliaryTree(ele_code,"AS",0,demo,0,"选择科目");
			}
		});

	};
	accountFun = function(obj){
		 if (obj.value != "") {
			 var values = obj.value.split("@");
			 obj.element.innerHTML = values[2] + " " + decodeURI(values[1]);
		 } else {
			 obj.element.innerHTML = "";
		 }
	};
	
	
	$("#addOneRow").on("click", function () {
        var row = {
            "data": {
            	"account_name": "",
		        "entry_side": "0",
		        "is_primary_source": "0",
				"is_primary_target": "0",
				"ctrl_level": "0",
				"rule_id": "0"
            }
        };
		viewModel.gridDataTable.addSimpleData(row.data, 1);
    });
	$("#saveRow").on("click", function(){
		var tempflag = 0;
		var griddata = viewModel.gridDataTable.getAllRows();
		var voutypedata = viewModel.voutypeTree.getAllDatas();
		var vou_type_code = $("#vou_type_code_text").val();
		var vou_type_name = $("#vou_type_name_text").val();

		if( vou_type_code == "" || vou_type_code == null) {
            ip.ipInfoJump("记账模板编码不能为空","error");
		}
        if( vou_type_name == "" || vou_type_name == null) {
            ip.ipInfoJump("记账模板，名称不能为空","error");
        }
		for(var i=0;i<voutypedata.length;i++){
			if(voutypedata[i].data.vou_type_code.value==vou_type_code&&voutypedata[i].data.vou_type_name.value!=(vou_type_code + " " +vou_type_name)){
				tempflag =1;
				ip.ipInfoJump("记账模板编码不能重复","error");
				return;
			}
		}
		var busvoutypedata = vou_type_code + "#" + vou_type_name;
		var busvouacctmdldata = '';
		for(var a=0;a<griddata.length;a++){
			if(griddata[a].data.account_name.value==""||griddata[a].data.account_name.value==null){
				ip.ipInfoJump("科目名称不能为空","error");
				tempflag = 1;
				return;
			}
			var account = (griddata[a].data.account_name.value).split("@");
			busvouacctmdldata += griddata[a].data.acctmdl_id.value  + "#" + "{" + account[0] + "#" + griddata[a].data.entry_side.value + "#"
			+ griddata[a].data.is_primary_source.value + "#" + griddata[a].data.is_primary_target.value + "#"
			+ griddata[a].data.ctrl_level.value + "#" + griddata[a].data.rule_id.value + "#";
		}
		if(tempflag!=1){
			$.ajax({
				url:"/df/gl/configure/saveacctmdl.do?tokenid="+tokenid,
				data:{"ajax":"nocache","busvoutype":busvoutypedata,"busvouacctmdl":busvouacctmdldata},
				type:"POST",
				dataType:"json",
				success:function(data){
					getVouType();
					var ztree =  $.fn.zTree.getZTreeObj("voutypeTree");
					ztree.selectNode(selectNode);
					if (data.flag==0) {
                        ip.ipInfoJump(data.msg,"error");
					} else {
                        ip.ipInfoJump(data.msg);
					}

				}
			});
		}
	});
	
	$("#deleteRow").on("click", function () {
        ip.warnJumpMsg("确定删除吗？","sid","cCla");
		//处理确定逻辑方法
		$("#sid").on("click",function(){
			var rows = viewModel.gridDataTable.getSelectedIndexs();
			var tabledata = viewModel.gridDataTable.getSelectedRows();
			if(tabledata==""){
				ip.ipInfoJump("没有选中数据","info");
				$("#config-modal").remove();
			}else{
				var arraydata = '';
				
				for(var a=0;a<tabledata.length;a++){
					if(tabledata[a].data.acctmdl_id.value==null||tabledata[a].data.acctmdl_id.value==""){
						viewModel.gridDataTable.removeRows(rows);
						$("#config-modal").remove();
						return;
					}
					arraydata += JSON.stringify(tabledata[a].data.acctmdl_id.value) + " " + JSON.stringify(tabledata[a].data.vou_type_id.value) + '#';	
				}				
				$.ajax({
		        	url:"/df/gl/configure/delacctmdl.do?tokenid=" + tokenid,
		        	data:{"ajax":"nocache","acctmdl":arraydata},
		        	dataType:"json",
		        	type:"POST",
		        	success:function(data){
		        		ip.ipInfoJump(data.msg);
		        		viewModel.gridDataTable.removeRows(rows);
						$("#config-modal").remove();
						$("#vou_type_code_text").val("");
						$("#vou_type_name_text").val("");
						getVouType();
		        	}
		        });
		        
			}
		});
		//处理取消逻辑方法
		$(".cCla").on("click",function(){
			$("#config-modal").remove();
		});
    });
	viewModel.gridDataTable.setSimpleData(viewModel.gridDatas);
	
	$(document).ready(function(){
		getVouType();
		getAccount();
		
	});
	function getVouType(){
		$.ajax({
			url:"/df/gl/configure/getvoutype.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			type: 'GET',
			dataType: 'json',
			success: function (data){
				for(var i=0;i<data.length;i++){
					data[i]["parentid"] = 1;
				}
				var arr = {vou_type_id:1,vou_type_name:"记账模板",vou_type_code:0,parentid:0}; 
				data.push(arr);
				viewModel.voutypeTree.setSimpleData(data);
				if(selectNode != undefined){
					var ztree = $.fn.zTree.getZTreeObj("voutypeTree");;
					var current_node = ztree.getNodesByParamFuzzy("vou_type_code",selectNode.vou_type_code, null);
					ztree.expandNode(current_node[0], true, true, true);
					if (selectNode == null) {
						
						ztree.selectNode(current_node[0]);
					}else{
						ztree.selectNode(selectNode);
					}
					
					//$(".curSelectedNode").click();
				}
			}
		});
	}
	//获取左侧科目树数据
	function getAccount(){
		$.ajax({
			url:"/df/gl/configure/getaccount.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			type: 'GET',
			dataType: 'json',
			success: function (data){
				for(var i=0;i<data.length;i++){
					data[i]["parentId"] = 1;
					data[i]["id"] = i+5;
				}
				var arr = {id:1,codename:"科目类型",parentId:0}; 
				data.push(arr);
				viewModel.leftaccountTree.setSimpleData(data);
			}
		});
	}
	
	//权限树
	function treeChoice(id,data,index) {
		var success_info = $("#data-tree"+index)[0];
		var tree_html = '';
		if(!success_info){
			tree_html = "<div class='ztree check_tree' u-meta='"+'{"id":"data-tree'+index+'","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"chr_name","setting":"treeSettingCheck"}'+"'>";
			$("#" + id).append(tree_html);
		}
		initTree(id,data);
	}
	function initTree(id,data) {
		var viewModel = {
	    treeSettingCheck:{
	        view:{
	            showLine:false,
	            selectedMulti:false
	        },
	        callback:{
				onDblClick:function(e,id,node){
					setSelectedNode();
				}
	        },
	        check:{
	        	enable: true,
	        	chkboxType:{ "Y" : "ps", "N" : "ps" }
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
	            'chr_name':{
	                'value':""
	            }
	        }
	    })
		};
		ko.cleanNode($('#' + id)[0]);
		viewModel.treeDataTable.setSimpleData(data);
		var app = u.createApp({
			el : '#' + id,
			model : viewModel
		});
	}
	
	// 初始化叶签和树
	function intiPage(rule_id) {
		//alert("权限组弹出看");
	          	$.ajax({
					url : "/df/gl/configure/getElements.do?tokenid=" + tokenid,
					type : 'POST',
					data: {"ajax":"nocache","rule_id":rule_id},
					dataType:'json',
					async: false,
					success : function(data) {
						if (data.result == "success") {
							eleSize = data.enable_elements.length;
							var addNewRule = $("#addNewRule");
							var myTabContent=$("#myTabContent");
							addNewRule.html("");
							myTabContent.html("");
							var appendDiv="";
							var addHtml = "";
							var ulTab="";
							
							$.each(data.enable_elements,function(index, value){
							if(index == 0){
								enableEle.push(value.ele_code);
								addHtml += "<li role='presentation' class='active' ><a href='#li"
									+ value.ele_code
									+ "' id="
									+ value.ele_code
									+ " aria-controls='zjxz' role='tab' data-toggle='tab'>"
									+ value.ele_name
									+ "</a></li>";
								appendDiv += "<div role='tabpanel' class='tab-pane active' id='li" + value.ele_code + "'>";
							}else{
								enableEle.push(value.ele_code);
								addHtml += "<li role='presentation'><a href='#li"
									+ value.ele_code
									+ "' id="
									+ value.ele_code
									+ " aria-controls='zjxz' role='tab' data-toggle='tab'>"
									+ value.ele_name
									+ "</a></li>";
								appendDiv += "<div role='tabpanel' class='tab-pane' id='li" + value.ele_code + "'>";
							}
							appendDiv += "<div class='radio-box'>" +
							"<label class='radio-inline' name='com-tree"+value.ele_code+"'"+
							"onclick='allRadioClick(this)'> <input type='radio'"+
							"name='com-tree"+value.ele_code+"' id='gnflsRadioAll"+index+"'"+
							" checked> 全部权限"+ index +" </label> " +
							"<label class='radio-inline' name='com-tree"+value.ele_code+"'"+
							"onclick='partRadioClick(this)'> <input type='radio'"+
							"name='com-tree"+value.ele_code+"' id='gnflsRadioPart"+index+"'"+
							"> 部分权限 </label>"+
						    
					        "</div>"+
				           "</div>";
						});
							myTabContent.append(appendDiv);
							addNewRule.append(addHtml);
							$.each(data.enable_elements,function(index, value){
								//$("<div id='com-tree"+ index +"'></div>")
								 var treeDom="<div id='com-tree"+ value.ele_code +"' class='tabs-tree' style='display:none'></div>";
								 $("#myTabContent .tab-pane").eq(index).append(treeDom);
								 treeChoice("com-tree"+value.ele_code,data.enable_elements[index].element_list,value.ele_code);						
							});
								
						allRadioClick = function(e) {
							var treeId = e.getAttribute("name");
							$("#" + treeId).hide();
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
						};
						partRadioClick = function(e) {
							var treeId = e.getAttribute("name");
							$("#" + treeId).show();
							
						};
					}
				}
	      });
	};

	// 获取所有权限要素
	$('#elementModal').on('show.bs.modal',function(e) {
	        $.ajax({
		       url : "/df/gl/configure/getCoaElements.do?tokenid="+ tokenid,
			   type : 'POST',
			   dataType : "json",
			   data: {"ajax":1,"accountId":tempRowData.rowObj.account_id},
				success : function(data) {
					viewModel.gridDataTableRightList
							.setSimpleData(data);
					viewModel.gridDataTableRightList.setRowUnSelect(0);
				}
			});
	});
	// 权限要素设置部分 -------- 结束
	
	var isNull = 0;
	
	//给记账模板权限描述表格添加事件
	var enableEle;
	var eleSize=0;
	var currentRowObj;
	var tempRowData;
	addRuleFun = function(obj) {
		currentRowObj = obj.field;
		tempRowData=obj;
		if(tempRowData.rowObj.account_id==""||tempRowData.rowObj.account_id==null){
			ip.ipInfoJump("科目信息为空，请补全数据","info");
			return ;
		}
		if(obj.value==0){
			$("#rule_code").removeAttr("disabled");
			isNull = 1;
		}else{
			isNull = 0;
		}
		enableEle=[];
		modifyGroup(obj);
		$("#addRuleModal").modal("show");
	};
	//添加要素界面，双击要素行事件
	var cacheRow;
	addEleCache = function(obj){
		cacheRow = obj.rowObj;
		var flag = 0;
		var count = 0;
		
		for(var i=0;i<$("#addNewRule li").length;i++){
			var idValue =   $("#addNewRule li a").eq(i).attr("id");
			if(idValue==null){
				break;
			}else{
				count++;
				if(cacheRow.value.ele_code==idValue){
					flag = 1;
					break;
				}
			}
		}
		if(flag!=1){
			$.ajax({
			       url : "/df/gl/configure/getEleValue.do?tokenid="+ tokenid,
				   type : 'POST',
				   dataType : "json",
				   data: {"ajax":"nocache","ele_code":cacheRow.value.ele_code},
					success : function(data) {
						if (data.result == "success") {
							eleSize +=1;
							var addNewRule = $("#addNewRule");
							var myTabContent=$("#myTabContent");
							//var data=['a','b','c'];
							var appendDiv="";
							var addHtml = "";
							var ulTab="";
							
							var index=0;
							var value=data.enable_elements[0];
							for(var i=0;i<$("#addNewRule li").length;i++){
								var idValue =   $("#addNewRule li").eq(i).attr("class");
								if(idValue==null){
									
								}else{
									$("#addNewRule li").eq(i).removeClass("active");
									
								}
							}
							enableEle.push(value.ele_code);
							addHtml += "<li role='presentation' class='active' ><a href='#li"
								+ value.ele_code
								+ "' id="
								+ value.ele_code
								+ " aria-controls='zjxz' role='tab' data-toggle='tab'>"
								+ value.ele_name
								+ "</a></li>";
							for(var i=0;i<$("#myTabContent div").length;i++){
								var idValue =   $("#myTabContent div").eq(i).attr("class");
								if(idValue==null){
									
								}else{
									$("#myTabContent div").eq(i).removeClass("active");
									
								}
							}
							appendDiv += "<div role='tabpanel' class='tab-pane active' id='li" + value.ele_code + "'>";
							
							appendDiv += "<div class='radio-box'>" +
							"<label class='radio-inline' name='com-tree"+value.ele_code+"'"+
							"onclick='allRadioClick(this)'> <input type='radio'"+
							"name='com-tree"+value.ele_code+"' id='gnflsRadioAll"+index+"'"+
							" checked> 全部权限"+ index +" </label> " +
							"<label class='radio-inline' name='com-tree"+value.ele_code+"'"+
							"onclick='partRadioClick(this)'> <input type='radio'"+
							"name='com-tree"+value.ele_code+"' id='gnflsRadioPart"+index+"'"+
							"> 部分权限 </label>"+
						    
					        "</div>"+
				           "</div>";
							myTabContent.append(appendDiv);
							addNewRule.append(addHtml);
							$.each(data.enable_elements,function(index, value){
								//$("<div id='com-tree"+ index +"'></div>")
								 var treeDom="<div id='com-tree"+ value.ele_code +"' class='tabs-tree' style='display:none'></div>";
								 $("#myTabContent .tab-pane").eq(count).append(treeDom);
								 treeChoice("com-tree"+value.ele_code,data.enable_elements[index].element_list,value.ele_code);						
							});
								
						allRadioClick = function(e) {
							var treeId = e.getAttribute("name");
							$("#" + treeId).hide();
							var treeObj = $.fn.zTree.getZTreeObj(treeId);
						};
						partRadioClick = function(e) {
							var treeId = e.getAttribute("name");
							$("#" + treeId).show();
							
						};
						}
					}
			});	
		}
		$("#elementModal").modal("hide");
	};
	
	//获取角色RuleDTO
	function modifyGroup(obj) {
		//设定类型为修改
		edit_type="modify";
		var row = obj.rowObj;
		var rule_id = row.rule_id;
		intiPage(rule_id);
		if(rule_id == "")
		{
			ip.ipInfoJump("请先选中一个权限组！","info");
			return;
		}
		var current_url = location.search;
		var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
		$.ajax({
			url: "/df/dataright/getRuleDTODataByRuleId.do?tokenid="+ tokenid,
			type: 'post',
			dataType: 'json',
			data: {"rule_id":rule_id,"ajax":1},
			success: function (data) {
				if(data.result == "success"){
					 $("#rule_code").val(data.ruleDto.rule_CODE);
					 $("#rule_name").val(data.ruleDto.rule_NAME);
					 $("#remark").val(data.ruleDto.remark);
					 var type_list=data.ruleDto.right_group_list[0].type_list;
					 
					 var detail_list=data.ruleDto.right_group_list[0].detail_list;
					 var detail_list_length=detail_list.length;
					 
					 
					 var length = type_list.length;
					 for(var i=0;i< length ; i++)
						 {
						 	var ele_code = type_list[i].ele_CODE;
						 	var checked=type_list[i].right_TYPE==0?true:false;
						 	$('#li'+ele_code).find("input").eq(0).prop("checked",checked)
						 	$('#li'+ele_code).find("input").eq(1).prop("checked",!checked)
						 	
						 	if($('#li'+ele_code).find("input").eq(1).is(":checked"))
						 		{
						 			$("#" + "com-tree"+ele_code).show();
						 			
						 			for(var j=0;j < detail_list_length ; j++)
						 				{
						 					var detail_list_node_name = detail_list[j].ele_VALUE+" "+detail_list[j].ele_NAME;
						 					if( detail_list[j].ele_CODE ==ele_code && detail_list[j].ele_VALUE != "#")
						 						{
						 							//勾选树的节点
						 						var data_tree = $("#" + "data-tree"+ele_code)[0]['u-meta'].tree;
						 						var search_nodes = data_tree.getNodesByParamFuzzy("name",detail_list_node_name,null);
						 						data_tree.checkNode(search_nodes[0], true, false);
						 						
						 						
						 						}
						 				}
						 			
						 		}
						 }
				}
			}
		});
		
	};
	
	//保存
	viewModel.rightSure = function() {
		create_type="voucher";
		if(isNull==1){
			edit_type = "new";
		}else{
			edit_type = "modify";
		}
		var rule_id = tempRowData.value;
		var rule_code = $("#rule_code").val();
		if(rule_code == "")
			{
				ip.ipInfoJump("权限编码不能为空！","error");
				return ;
			}
		var rule_name = $("#rule_name").val();
		
		if(rule_name == "")
		{
			ip.ipInfoJump("权限名称不能为空！","error");
			return ;
		}
		
		var remark = $("#remark").val();
		
		var list=[];
		
		//获取选中数据
		for(var i=0 ; i < eleSize ; i++)
		{
			var obj={};
			var idValue =   $("#addNewRule li a").eq(i).attr("id");
			//全部按钮是否被选中
			var isChecked = $("#gnflsRadioAll"+i).is(":checked")?1:0;
			var right_type = 0;
			if(isChecked == 0)
				{
					var eleObj = $.fn.zTree.getZTreeObj("data-tree"+enableEle[i]).getCheckedNodes(true);
					var selectedNameValue ="";
					if(obj == null)
						{
							ip.ipInfoJump("选择部分权限必须至少勾选一个要素！","info");
							return;
						}
					right_type = 1 ;
					for(var j=0 ;j< eleObj.length ;j++)
						{
							if(j != eleObj.length-1)
								{
									selectedNameValue += eleObj[j].chr_name + ",";
								}
							else
								{
									selectedNameValue += eleObj[j].chr_name;
								}
						}
					obj[idValue] = selectedNameValue;
				}
			else
				{
					obj[idValue] = "1";
				}
			list.push(obj);
		}
		var current_url = location.search;
		var tokenid = current_url.substring(current_url
				.indexOf("tokenid") + 8, current_url
				.indexOf("tokenid") + 48);
		$.ajax({
			url : "/df/dataright/saveorupdate.do?tokenid=" + tokenid,
			type : 'POST',
			dataType : "json",
			data : {
				"ajax":1,
				"rule_code" : rule_code,
				"rule_name" : rule_name,
				"create_type" : create_type,
				"edit_type" : edit_type,
				"rule_id":rule_id,
				"remark":remark,
				"right_type":right_type,
				"rule_list":JSON.stringify(list)
			},
			success : function(data) {
				if (data.result == "success") {
					ip.ipInfoJump("保存成功！");
					viewModel.gridDataTable.setValue(currentRowObj,data.rule_id);
					$('#rightModal').modal('hide');
				}
				else if(data.result == "fail"){
					ip.ipInfoJump(data.reason,"error");
				}
			}
		});
	};
	//删除一个权限要素
	viewModel.delElement = function(){
		if($("#addNewRule li").length<1){
			ip.ipInfoJump("请选择权限要素","info");
			return;
		}
		if($("#addNewRule li").length==1){
			delSysRule();
			viewModel.gridDataTable.setValue(currentRowObj,"0");
		}else{
			
		}
		for(var i=0;i<$("#addNewRule li").length;i++){
			var idValue =   $("#addNewRule li").eq(i).attr("class");
			if(idValue==null){
			}else{
				if(idValue="active"){
					var ele_code = $("#addNewRule li a").eq(i).attr("id");
					for(var j=0;j<enableEle.length;j++){
						if(enableEle[j]==ele_code){
							enableEle.splice(j,1);
						}
					}
					$("#addNewRule li").eq(i).html("");
					$("#myTabContent div").eq(i).html("");
				}
			}
			
		}
		
		
		
	};
	//删除rule_id
	function delSysRule() {
		var rule_id = tempRowData.value;
		if(rule_id == "")
			{
				ip.ipInfoJump("请选中一个权限组！","info");
				return;
			}
		if(confirm("真的要删除吗?")){
			var current_url = location.search;
			var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
			$.ajax({
				url: "/df/dataright/delRuleByRuleId.do?tokenid="+ tokenid,
				type: 'post',
				dataType: 'json',
				data: {"rule_id":rule_id,"ajax":1},
				success: function (data) {
					if(data.result == "success"){
						ip.ipInfoJump("删除成功！");
						$("#rule_code").val("");
						$("#rule_name").val("");
						$("#remark").val("");
						
					}
					else if(data.result == "fail"){
						ip.ipInfoJump("删除失败！"+ data.reason,"error");
					}
				}
			});
		}
	};
	
	// 预览model
	$('#ylModal').on('show.bs.modal',function(event) {
		
		var detail_list = $("#detail_list");
		//清空之前的预览数据
		detail_list.empty();
		
		//获取选中数据
		for(var i=0 ; i < eleSize ; i++)
		{
			//获取ele_code值
			var idValue = $("#addNewRule li a").eq(i).attr("id");
			
			//获取ele_name值 即页签名称
			var ele_class_name = $("#"+idValue).text();
			//全部按钮是否被选中
			var isChecked = $("#gnflsRadioAll"+i).is(":checked")?1:0;
			if(isChecked == 0)
				{
					var eleObj = $.fn.zTree.getZTreeObj("data-tree"+enableEle[i]).getCheckedNodes(true);
					var addHtml = "";
					
					addHtml += "<ul class='display-ul'>"+ele_class_name;
					for(var j=0 ;j< eleObj.length ;j++)
						{
						   addHtml += "<li class='display-li'><span class='glyphicon glyphicon-list-alt list-icon-color' aria-hidden='true'></span><span>"+ eleObj[j].chr_name + "</span></li>";
						}
					addHtml += "</ul>";
					detail_list.append(addHtml);
				}
		}
	});
	
	//辅助录入树
	function showSuxiliaryTree(id, element, flag, viewModel, areaId, ele_name, add_node ,codeIntoFlag) {
		var current_url = location.search;
		var tokenid = ip.getTokenId();
		
		$.ajax({
			url: "/df/dic/dictree.do?tokenid=" + tokenid,
			type: "GET",
			async: false,
			data: {
				"element": element,
				"tokenid": tokenid,
				"ele_value": "",
				"ajax": "noCache"
			},		
			success: function(data) {
				ip.treeChoice(id, viewModel.accountTree, flag, viewModel, areaId, ele_name);
			}
		});
	}
	
	//修改权限组-结束
	var app = u.createApp({
	    el: '.gl-container',
	    model: viewModel
	});
	
});