require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'director','ip' ],
		function($, ko) {
			window.ko = ko;
			var tokenid = ip.getTokenId();
				var tmpRightList = {};
				var mapLeftList = [];
				var enableEle=[];
				var eleSize=0;
				var create_type;
				var edit_type;
				var rightElementLength=0;
				
				$("#rule_code").blur(function(){
					
					var rule_code = $("#rule_code").val();
					$.ajax({
								url : "/df/dataright/checkRightCodeExist.do?tokenid="+ tokenid,
								type : 'POST',
								dataType : "json",
								data: {
									"ajax":1,
									"rule_code" : rule_code,
									"edit_type" : edit_type,
									"rule_id":rule_id
									},
								success : function(data) {
									if(data.result=="fail"){
										ip.ipInfoJump(data.reason,"error");
										$("#rule_code").val("");
									}
								
								}
							});
				});
				
				function zTreeOnClick(event, treeId, treeNode) {
					var right_code = treeNode.name.split(" ")[0];
					var right_name = treeNode.name.split(" ")[1];
					$("#right-code").val(right_code);
					$("#right-name").val(right_name);
				    groupclick(treeNode.id);
				    
				};
				
				//动态生成树的方法----开始
				function treeChoice(id,data,index) {
					var success_info = $("#data-tree"+index)[0];
					var treeHtml="";
					var tree_html = '';
					if(!success_info){
						treeHtml = '<span class="modal-tree-root" onclick= "selectAll(&quot;'+ "data-tree"+index + '&quot;)"><img src="/df/trd/ip/changeTree/images/base.gif">全部</span>';
						tree_html = "<div class='ztree check_tree' u-meta='"+'{"id":"data-tree'+index+'","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename","setting":"treeSettingCheck"}'+"'>";
						$("#" + id).append(treeHtml);
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
				            'codename':{
				                'value':""
				            }
				        }
				    }),
					};
					ko.cleanNode($('#' + id)[0]);
					var app = u.createApp({
					    el: '#'+id,
					    model: viewModel
					});
					viewModel.treeDataTable.setSimpleData(data);
				}
             //动态生成树----结束
				
			 //要素列表数组
				var mapRightList = [];
				
				viewModel = {
					enabledElesList : ko.observableArray(),
					RightListTreeSetting : {
						view : {
							showLine : true,
							selectedMulti : false
						},
						callback : {}
					},
					RuleListTreeSetting : {
						view : {
							showLine : true,
							selectedMulti : false
						},
						callback : {
							onClick: zTreeOnClick
						}
					},
					treeSetting : {
						view : {
							showLine : true,
							selectedMulti : false
						},
						check : {
							enable : true,
							autoCheckTrigger : true,
							chkboxType : {
								"Y" : "ps",
								"N" : "ps"
							}
						},
						callback : {
							onClick : function(e, id, node) {
								if (id == "tree1") {
									var rightInfo = node.name + '被选中';
									$("#right-code").val(node.id);
									$("#right-name").val(node.name);
								}
							}
						}
					},
					
				    selectEletreeDataTable:new u.DataTable({
				        meta: {
				            'chr_id': {
				                'value':""
				            },
				            'parent_id': {
				                'value':""
				            },
				            'codename':{
				                'value':""
				            }
				        }
				    }),
					
					dataTableTree2 : new u.DataTable({
						meta : {
							'id' : {
								'value' : ""
							},
							'pid' : {
								'value' : ""
							},
							'title' : {
								'value' : ""
							}
						}
					}),
					
					dataTableRuleGroup : new u.DataTable({
						meta : {
							'rule_id' : {

							},
							'pid' : {

							},
							'name' : {}
						}
					}),
					
					
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

					gridDataTableLeftList : new u.DataTable({
						meta : {
							"chr_id" : {},
							'ele_name' : {},
							'ele_code' : {},
							'ele_source' : {},
						}
					}),
				};
				
				//初始化界面权限组列表-开始
				 function initGroup() {
					$.ajax({
								url : "/df/dataright/showGroupList.do?tokenid="+ tokenid,
								type : 'POST',
								dataType : "json",
								data: {"ajax":1},
								success : function(data) {
									viewModel.dataTableRuleGroup.setSimpleData(data.groupList);
									var treeObj = $.fn.zTree.getZTreeObj("ruleTree");
									var nodes = treeObj.getSelectedNodes();
									if (nodes.length>0) { 
										treeObj.cancelSelectedNode(nodes[0]);
									}
									
								}
							});
				};
				//初始化界面权限组列表-结束
				
				//新增或者修改权限的保存设置-开始
				viewModel.rightSure = function() {
					//alert(rule_id);
					create_type="newrule";
					if(eleSize <= 0){
						ip.ipInfoJump("没有启用的权限要素，清先设置权限要素！","error");
						$('#rightModal').modal('hide');
						return;
					}
					var rule_code = $("#rule_code").val();
					if(rule_code == "")
						{
							ip.ipInfoJump("权限编码不能为空！","info");
							return ;
						}
					var rule_name = $("#rule_name").val();
					
					if(rule_name == "")
					{
						ip.ipInfoJump("权限名称不能为空！","info");
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
								if(eleObj == null || eleObj.length == 0)
									{
										ip.ipInfoJump("选择部分权限必须至少勾选一个要素！","info");
										return false;
									}
								right_type = 1 ;
								for(var j=0 ;j< eleObj.length ;j++)
									{
										if(j != eleObj.length-1)
											{
												selectedNameValue += eleObj[j].codename + ",";
											}
										else
											{
												selectedNameValue += eleObj[j].codename;
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
								initGroup();
								ip.ipInfoJump("保存成功！","success");
								$('#rightModal').modal('hide');
							}
							else if(data.result == "fail"){
								ip.ipInfoJump(data.reason,"error");
							}
						}
					});
				};
				//新增或者修改权限的保存设置-结束
				
				 //新增一行 -开始
				viewModel.addRow = function() {

					// 获取左边树的选选中节点添加到右边
					var notRightGrid = $("#notRightGrid").parent()[0]['u-meta'].grid;
					var hasRightGrid = $("#hasRightGrid").parent()[0]['u-meta'].grid;
					var notRightGridRows = notRightGrid.getSelectRows();
					tmpRightList[notRightGridRows[0].chr_id] = 1;

					//参数1：要添加的数据， 参数2：添加的位置
					viewModel.gridDataTableRightList.addSimpleData(notRightGridRows, 1);
					
					rightElementLength +=1;

					var delIndex = notRightGrid.getFocusRowIndex();
					notRightGrid.deleteRows([ delIndex ]);

				};
				 //新增一行 -结束
				
				 //保存权限要素设置-开始
				viewModel.saveElement = function() {
					
					if(rightElementLength > 6)
					{
						ip.ipInfoJump("选择的权限要素不能多于6个！","info");
						return;
					}
					
					var mapright = "";
					var mapleft = "";
					if (tmpRightList != null) {
						for ( var key in tmpRightList) {

							if (tmpRightList[key] == 0) {
								mapleft = key + "," + mapleft;
							} else if (tmpRightList[key] == 1) {
								mapright = key + "," + mapright;
							}
						}

						// 网后台发送ajax请求到后台保存数据
						$.ajax({
							url : "/df/dataright/saveElements.do?tokenid="+ tokenid,
							type : 'POST',
							dataType : "json",
							data : {
								"ajax":1,
								"right_list" : mapright,
								"left_list" : mapleft,
								"set_type" : "RIGHT"
							},
							success : function(data) {
								if (data.result == "success") {
									ip.ipInfoJump("保存成功！","success");
								}
							}
						});
					}
					else
					{
						ip.ipInfoJump("保存成功！","success");
					}
				};
				 //保存权限要素设置-开始
				
				
				//删除一行 -开始
				viewModel.delRows = function() {
					// 获取右边树的选选中节点添加到右边
					var notRightGrid = $("#notRightGrid").parent()[0]['u-meta'].grid;
					var hasRightGrid = $("#hasRightGrid").parent()[0]['u-meta'].grid;
					var hasRightGridRows = hasRightGrid.getSelectRows();
					viewModel.gridDataTableLeftList.addSimpleData(
							hasRightGridRows, 1);
					tmpRightList[hasRightGridRows[0].chr_id] = 0;
					var delIndex = hasRightGrid.getFocusRowIndex();
					
					rightElementLength -= 1;
					//参数：要删除的行索引组成的数组
					//hasRightGrid.deleteRows([ delIndex ]);
					viewModel.gridDataTableRightList.removeRow(delIndex);
					
				};
				//删除一行 -结束
				
				//新增权限组按钮事件-开始
				viewModel.addGroup = function() {
					create_type="newrule";
					edit_type="new";
					//alert("sadada");
					$("#rule_code").attr("disabled",false);
				    $("#rule_code").val("");
					$("#rule_name").val("");
					$("#remark").val("");
					
					$("#rightModal").modal("show");
				};
				//新增权限组按钮事件-结束
				
			    //修改权限组-开始
				viewModel.modifyGroup=function() {
					//设定类型为修改
					edit_type="modify";
					if(rule_id == "")
					{
						ip.ipInfoJump("请选择要修改的权限！","info");
						return;
					}
					$("#rightModal").modal("show");
					$("#rule_code").attr("disabled",true);
						
					
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
				//修改权限组-结束
				
				
				//删除权限组-开始
				viewModel.delGroup=function() {
					if(rule_id == "")
						{
							ip.ipInfoJump("请选择要删除的权限！","info");
							return;
						}

                    ip.warnJumpMsg("确定删除吗？","sid","cCla");
                    //处理确定逻辑方法
                    $("#sid").on("click",function(){
                        $.ajax({
                            url: "/df/dataright/delRuleByRuleId.do?tokenid="+ tokenid,
                            type: 'post',
                            dataType: 'json',
                            data: {"rule_id":rule_id,"ajax":1},
                            success: function (data) {
                                if(data.result == "success"){
                                    ip.ipInfoJump("删除成功！","success");
                                    initGroup();
                                }
                                else if(data.result == "fail"){
                                    ip.ipInfoJump("删除失败！"+ data.reason,"error");
                                }
                                $("#config-modal").remove();
                            }
                        });
                    });
                    //处理取消逻辑方法
                    $(".cCla").on("click",function(){
                        $("#config-modal").remove();
                    });
				};
				//删除权限组-结束
				
				

			$(function(){ 
				initGroup();
				
				// 关闭预览model function
				$('#ylModal').on('hidden.bs.modal', function(e) {
					$("#yl-box").html("");
				});
				// 设置表格列model function
				$('#setColModal').on('show.bs.modal', function(event) {
					var button = $(event.relatedTarget);
					var recipient = button.data('whatever');
					var modal = $(this);
					modal.find('.modal-body #set-goal').val(recipient);
				});
				
			
			});
				ko.cleanNode($('body')[0]);
				var app = u.createApp({
					el : "body",
					model : viewModel
				});
				
				// 预览model function-开始
				$('#ylModal').on('show.bs.modal',function(event) {
					
					var detail_list = $("#detail_list");
					//清空之前的预览数据
					detail_list.empty();
					
					var allSelectedData=[];
					
					//获取选中数据
					for(var i=0 ; i < eleSize ; i++)
					{
						//获取ele_code值
						var idValue = $("#addNewRule li a").eq(i).attr("id");
						
						//获取ele_name值 即页签名称
						var ele_class_name = $("#"+idValue).text();
						
						var pNode={};
						pNode['chr_id']="xxxxxxxxx"+i;
						pNode['codename']=ele_class_name;
						pNode['parent_id']="";
						allSelectedData.push(pNode);
						
						
						//全部按钮是否被选中
						var isChecked = $("#gnflsRadioAll"+i).is(":checked")?1:0;
						var addHtml = "";
						if(isChecked == 0)
							{
								var eleObj = $.fn.zTree.getZTreeObj("data-tree"+enableEle[i]).getCheckedNodes(true);
								for(var j=0 ;j< eleObj.length ;j++)
									{
										if(eleObj[j].getParentNode() == null){
											eleObj[j]["parent_id"]=pNode['chr_id'];
										}
										allSelectedData.push(eleObj[j]);
									}
							}
					}
					
					addHtml += "<div class='ztree radio-tree assist-insert-tree' u-meta='" + '{"id":"selectYulanTree","type":"tree","data":"selectEletreeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename"}' + "'></div>" ;
					detail_list.append(addHtml);
					var viewModelNew=viewModel;
					ko.cleanNode($('#detail_list')[0]);
					var app = u.createApp({
						el: '#detail_list',
						model: viewModelNew
					});
					viewModelNew.selectEletreeDataTable.setSimpleData(allSelectedData);
				});
				// 预览model function-结束
			
				// 权限组添加/修改-------- 开始
				$('#rightModal').on('show.bs.modal',function(event) {
					//alert("权限组弹出看");
				          	$.ajax({
								url : "/df/dataright/getEnabledEle.do?tokenid=" + tokenid,
								type : 'POST',
								data: {"ajax":1},
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
										" checked> 全部权限"+" </label> " +
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
				});
				// 权限组添加/修改-------- 结束
				
				
				// 权限要素设置部分 -------- 开始
				$('#elementModal').on('show.bs.modal',function(e) {
					             rightElementLength=0;
									tmpRightList = {};
									        $.ajax({
										       url : "/df/dataright/setupElements.do?tokenid="+ tokenid,
											   type : 'POST',
											   dataType : "json",
											   data: {"ajax":1},
												success : function(data) {
													//flag 表中有数据 返回false 无数据 返回true
													if (data.flag == false) {
														$("#btnAdd").prop(
																"disabled",
																true);
														$("#btnDel").prop(
																"disabled",
																true);
														$("#elementSave").prop(
																"disabled",
																true);
														$("#canEdit").show();
													} else if (data.flag == true) {
														$("#btnAdd")
																.prop(
																		"disabled",
																		false);
														$("#btnDel")
																.prop(
																		"disabled",
																		false);
														$("#elementSave")
																.prop(
																		"disabled",
																		false);
														$("#canEdit").hide();
													}
													viewModel.gridDataTableRightList
															.setSimpleData(data.right_list);
													viewModel.gridDataTableLeftList
															.setSimpleData(data.left_list);
													//初始化右侧列表
													rightElementLength= viewModel.gridDataTableRightList.getAllRows().length;
													viewModel.gridDataTableLeftList.setRowUnSelect(0);
													viewModel.gridDataTableRightList.setRowUnSelect(0);
												}
											});
								});
				// 权限要素设置部分 -------- 结束
				
				
});

rule_id="";
function groupclick(id) {
	rule_id=id;
	var tokenid = ip.getTokenId();
	$.ajax({
				url : "/df/dataright/getSysRightList.do?tokenid="
						+ tokenid,
				type : 'POST',
				dataType : 'json',
				data : {
					"rule_id" : id,
					"ajax":1
				},
				success : function(data) {
					viewModel.dataTableRightList.setSimpleData(data.rows);
				}
			});
};

var i=0;
menuTreeNext = function (){
	var user_write = $("#quickquery").val();
	var data_tree = $("#ruleTree")[0]['u-meta'].tree;
	var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
	if(i < search_nodes.length){
		var node=search_nodes[i++];
		data_tree.selectNode(node);
		var right_code = node.name.split(" ")[0];
		var right_name = node.name.split(" ")[1];
		$("#right-code").val(right_code);
		$("#right-name").val(right_name);
	    groupclick(node.id);
	}else{
		i = 0;
		ip.ipInfoJump("最后一个","info");
	}
	if(data_tree.getSelectedNodes().length>0){
		if(!data_tree.getSelectedNodes()[0].isParent){
			menuGuid = data_tree.getSelectedNodes()[0].id;
		}else{
			menuGuid = null;
		}
	}
	$("#quickquery").focus();
}

var val = "";
quickQuery = function (){  
	var user_write = $("#quickquery").val();
	if(val == user_write){
		return;
	}
	val = user_write;
	var data_tree = $("#ruleTree")[0]['u-meta'].tree;
	var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
	data_tree.expandNode(search_nodes[0],true,false,true);
	data_tree.selectNode(search_nodes[0]);


	var node=search_nodes[0];
	var right_code = node.name.split(" ")[0];
	var right_name = node.name.split(" ")[1];
	$("#right-code").val(right_code);
	$("#right-name").val(right_name);
    groupclick(node.id);
	
	if(data_tree.getSelectedNodes().length>0){
		if(!data_tree.getSelectedNodes()[0].isParent){
			menuGuid = data_tree.getSelectedNodes()[0].id;
		}else{
			menuGuid = null;
		}
	}
	$("#quickquery").focus();
	i = 1;

};

var checkAllflag = false;
//新增获取修改权限组 部分权限单选按钮需要用到的选择全部
function selectAll(treeId){
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	if(checkAllflag){
		treeObj.checkAllNodes(true);
		checkAllflag = false;
	}
	else{
		treeObj.checkAllNodes(false);
		checkAllflag = true;
	}
};

