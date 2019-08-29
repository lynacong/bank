require(['jquery', 'knockout','bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var organType = {};
	var tokenid = ip.getTokenId();
	//2017-05-02 add by yanyga
	var enableEle=[];
	var eleSize=0;
	var create_type;
	var edit_type;
	//用于存储用户选择的角色信息
	var roleCheck = {};
	//用户机构权限树 全选标志
	var checkAllflag = true;

	var rule_id="";

	var viewModel = {
			rightLists: ko.observableArray(),
			roleSelectRight: ko.observableArray(),
			rightDetaileDataTable1: new u.DataTable({
				meta: {
					'chr_id': {
						'value':""
					},
					'parent_id': {
						'value':""
					},
					'codeName':{
						'value':""
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
			userDataTable: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'pid': {
						'value':""
					},
					'name':{
						'value':""
					},
					'userType':{
						'value':""
					}
				}
			}),
			organRightDataTable: new u.DataTable({
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
			rightDetaileDataTable: new u.DataTable({
				meta: {
					'chr_id': {
						'value':""
					},
					'parent_id': {
						'value':""
					},
					'codeName':{
						'value':""
					}
				}
			}),
			dataTable: new u.DataTable({
				meta: {
					'id': {
						'value':""
					},
					'pid': {
						'value':""
					},
					'title':{
						'value':""
					}
				}
			}),
			roleDataTable: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'roletype': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			selectRoleDataTable: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'roletype': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			roleTreeSetting:{
				view:{
					showLine:false

				},
				check: {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "ps", "N": "ps" }
				}
			},
			organTreeSetting:{
				view:{
					showLine:false
				},
				check: {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "ps", "N": "ps" }
				}
			},
			userTreeSetting:{
				view:{
					showLine:false
				},
				callback: {
					onClick: zTreeOnClick
				}
			},

			//2017-05-02 add by yanyga  --begin
			RightListTreeSetting : {
				view : {
					showLine : true
				},
				callback : {}
			},
			RuleListTreeSetting : {
				view : {
					showLine : true
				},
				callback : {
					onClick: zTreeOnClickDR
				}
			},
			treeSetting : {
				view : {
					showLine : true
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
			//2017-05-02 add by yanyga  --end
			groupclick:function(id) {
				rule_id=id;
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
							viewModel.dataTableRightList.setSimpleData(data.rows,{unSelect:true});
						}
				});
			}

	};


	//2017-05-02 add by yanyga
	$("#rule_code").blur(function(){

		var rule_code = $("#rule_code").val();
		$.ajax({
			url : "/df/dataright/checkRightCodeExist.do?tokenid="
				+ tokenid,
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

	//2017-05-02 add by yanyga
	function zTreeOnClickDR(event, treeId, treeNode) {

		var right_code = treeNode.name.split(" ")[0];
		var right_name = treeNode.name.split(" ")[1];
		$("#right-code").val(right_code);
		$("#right-name").val(right_name);
		viewModel.groupclick(treeNode.id);

	};


	//2017-05-02 add by yanyga 
	//动态生成树的方法----开始
	function treeChoice(id,data,index) {
		var success_info = $("#data-tree"+index)[0];
		var tree_html = '';
		if(!success_info){
			tree_html = "<div class='ztree check_tree' u-meta='"+'{"id":"data-tree'+index+'","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"codename","setting":"treeSettingCheck"}'+"'>";
			$("#" + id).append(tree_html);
		}
		initTree(id,data);
	}
	function initTree(id,data) {
		var viewModel = {
				treeSettingCheck:{
					view:{
						showLine:false

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
				})
		};
		ko.cleanNode($('#' + id)[0]);
		var app = u.createApp({
			el: '#'+id,
			model: viewModel
		});
		viewModel.treeDataTable.setSimpleData(data,{unSelect:true});

	}
	//动态生成树----结束




	//加载权限组弹出窗
	viewModel.showDataRightModel=function(){
		//alert('ok');
		//$("#drModel").modal("show");
		$("#modal-iframe").attr("src", "/df/fap/dataright/dataRight.html?tokenid="+tokenid);
		$("#demo").modal("show");
	};

	//机构权限中点击全部默认全选
	viewModel.selectAll=function(){
		var treeObj = $.fn.zTree.getZTreeObj("oragn-tree");
		if(checkAllflag){
			treeObj.checkAllNodes(true);
			checkAllflag = false;
		}
		else{
			treeObj.checkAllNodes(false);
			checkAllflag = true;
		}
	};

	//2017-05-02 add by yanyga
	//新增权限组按钮事件-开始
	viewModel.addGroup = function() {
		create_type="newrule";
		edit_type="new";
		//alert("sadada");
		$("#rule_code").attr("disabled",false);
		$("#rule_code").val("");
		$("#rule_name").val("");
		$("#remark").val("");

		//$("#rightModal .modal-dialog").css("z-index","9999");
		$("#rightModal").show();
		showRightModal();

	};
	//新增权限组按钮事件-结束


	viewModel.showYLModelDialog=  function() {
		$("#ylModal").show();
		showYLModal();
	}

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
		if(confirm("真的要删除吗?")){
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
						ip.ipInfoJumpump("删除失败！"+ data.reason,"error");
					}
				}
			});
		}
	};
	//删除权限组-结束




	//2017-05-02 add by yanyga
	//初始化界面权限组列表-开始
	function initGroup() {
		$.ajax({
			url : "/df/dataright/showGroupList.do?tokenid="
				+ tokenid,
				type : 'POST',
				dataType : "json",
				data: {"ajax":1},
				success : function(data) {

					viewModel.dataTableRuleGroup.setSimpleData(data.groupList,{unSelect:true});
					var treeObj = $.fn.zTree.getZTreeObj("ruleTree");
					var nodes = treeObj.getSelectedNodes();
					if (nodes.length>0) { 
						treeObj.cancelSelectedNode(nodes[0]);
					}

				}
		});
	};
	//初始化界面权限组列表-结束

	viewModel.drCloseButton = function(){
		$("#ylModal").hide();
	};

	viewModel.rightModelCloseButton = function(){
		$("#rightModal").hide();
	};


	//2017-05-02 add by yanyga
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
				if (eleObj == null || eleObj.length == 0) {
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

					//刷新权限组
					$.ajax({
						url: "/df/datarightrelation/showAllGROUPlist.do?tokenid="+tokenid,
						type: "POST",
						data: {
							"ajax": "1",
							"tokenid":tokenid
						},
						success: function(dataRes){
							if(dataRes != null && dataRes.groupList != null){
								//viewModel.rightLists(data.groupList);
								viewModel.dataTableRuleGroup.setSimpleData(dataRes.groupList,{unSelect:true});

								var nodesName=rule_code+" "+ rule_name;
								var data_tree = $("#ruleTree1")[0]['u-meta'].tree;
								var search_nodes = data_tree.getNodesByParamFuzzy("name",nodesName,null);
								data_tree.selectNode(search_nodes[0]);
							}

						}
					});

					//选中操作

					ip.ipInfoJump("保存成功！","success");
					$('#rightModal').hide();
				}
				else if(data.result == "fail"){
					ip.ipInfoJump(data.reason,"error");
				}
			}
		});
	};
	//新增或者修改权限的保存设置-结束


	viewModel.drCancelEvent= function(){
		$("#rightModal").modal("hide");
	};




	//用户树的点击事件
	function zTreeOnClick(event, treeId, treeNode) {
		//alert(treeNode.tId + ", " + treeNode.name);
		checkAllflag = true;
		if(treeNode.isParent){
			ip.ipInfoJump("请选择子节点","info");
		    viewModel.clearData();
		}else{
			if(treeNode.guid == -1 || treeNode.guid == 1 || treeNode.guid == 0 || treeNode.guid == 4){
				ip.ipInfoJump("请勿选择用户类别","info");
			}else{
				$.ajax({
					url: "/df/datarightrelation/getRightInfoByUserId.do?tokenid="+tokenid,
					type: "POST",
					data: {
						"ajax":"1",
						"userGuid": treeNode.guid,
						"orgType": $('#organSelectList option:selected').val()
					},
					success: function(data){
						viewModel.organRightDataTable.removeAllRows();
						if(data.org_type != null || data.orgTypes != null && data.orgTypes.length > 0){
							viewModel.organRightDataTable.setSimpleData(data.orgTypes,{unSelect:true});
							if(data.org_type != null){
								if(treeNode.usertype==-1){
									data.org_type = "001";
								}
								if(treeNode.usertype==0){
									data.org_type = "002";
								}
								if(treeNode.usertype==1){
									data.org_type = "007";
								}
								$("#organSelectList option[value='"+data.org_type+"']").prop("selected", true);
							}
							if(data.selectedorgTypes != null && data.selectedorgTypes.length > 0){
								for(var i =0; i<data.selectedorgTypes.length; i++){
									var treeObj = $.fn.zTree.getZTreeObj("oragn-tree");
									var search_nodes = treeObj.getNodesByParam("chr_id",data.selectedorgTypes[i].org_id,null);
									if(search_nodes != null && search_nodes.length > 0){
										if(!search_nodes[0].isParent){
											treeObj.checkNode(search_nodes[0], true, true);
										}
										treeObj.expandNode(search_nodes[0].getParentNode(), true, true, true);
									}
								}
							}
						}
						$("#ulroleSelectedRight").html("");
						//roleCheck = data.roleRight;
						if(data.roleRight != null && data.roleRight.length > 0){
							var addHtml="";

							for(var i=0; i<data.roleRight.length; i++){
								var roleMassage1  = {};
								if(data.roleRight[i].is_defined != "0"){
									var roleMassage = data.roleRight[i].rule_id;
									roleMassage1["rule_id"] = data.roleRight[i].rule_id;
									roleMassage1["rule_name"] = data.roleRight[i].rule_name;
									roleMassage1["is_defined"] = data.roleRight[i].is_defined;
								}else{
									roleMassage1["is_defined"] = data.roleRight[i].is_defined;
								}
								roleCheck[data.roleRight[i].role_id] = roleMassage1;
								addHtml += "<li id='"+data.roleRight[i].role_id+"'><span class='glyphicon glyphicon-list-alt list-icon-color'></span><span class='ulroleSelectedRight-text'>"+data.roleRight[i].role_name+"</span></li>";
							}
							$("#ulroleSelectedRight").append(addHtml);
						}
						$("#dataRightInput").val("");
						$("#dataRightInput").attr("name","");
						viewModel.rightDetaileDataTable.removeAllRows();
						if(data.userRight != null && data.userRight.length > 0){
							$("#dataRightInput").val(data.userRight[0].rule_name);
							$("#dataRightInput").attr("name",data.userRight[0].rule_id);
							// viewModel.showRightDetail();
							$.ajax({
								url: "/df/dataright/getSysRightList.do?tokenid="+tokenid,
								type: "POST",
								data: {
									"ajax": "1",
									"rule_id": $("#dataRightInput").attr("name"),
									"tokenid": tokenid
								},
								success: function(data){
									if(data != null){
										viewModel.rightDetaileDataTable.setSimpleData(data.rows,{unSelect:true});
										var treeObj = $.fn.zTree.getZTreeObj("rightDetaile"); 
										treeObj.expandAll(true);
										$("#selectAuthModal").modal("hide");
									}
								}
							});
						}
					}
				});
			}
		}
	};
	viewModel.toggleUserRole = function(){
		$("#user-role-info").slideToggle(false);
	};


	//权限树搜索 暂时不用
	var j=0;
	menuTreeNextDR = function(){
		var user_write = $("#quickqueryDR").val();
		var data_tree = $("#ruleTree")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(j < search_nodes.length){
			var node=search_nodes[j++];
			data_tree.selectNode(node);
			var right_code = node.name.split(" ")[0];
			var right_name = node.name.split(" ")[1];
			$("#right-code").val(right_code);
			$("#right-name").val(right_name);
			viewModel.groupclick(node.id);
		}else{
			j = 0;
			ip.ipInfoJump("最后一个","info");
		}
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].id;
			}else{
				menuGuid = null;
			}
		}
		$("#quickqueryDR").focus();
	}



	var val = "";
	quickQueryDR = function (){  
		var user_write = $("#quickqueryDR").val();
		if(val == user_write){
			return;
		}
		val = user_write;
		var data_tree=$("#ruleTree")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);


		var node=search_nodes[0];
		var right_code = node.name.split(" ")[0];
		var right_name = node.name.split(" ")[1];
		$("#right-code").val(right_code);
		$("#right-name").val(right_name);
		viewModel.groupclick(node.id);

		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].id;
			}else{
				menuGuid = null;
			}
		}
		$("#quickqueryDR").focus();
		j = 1;
	};






	//获取所有用户
	viewModel.initUserTree = function(){
		$.ajax({
			url: "/df/datarightrelation/getUserTree.do?tokenid="+tokenid,
			type: "POST",
			data: {
				"tokenid":tokenid,
				"ajax":"1"
			},
			success: function(data){
				viewModel.userDataTable.setSimpleData(data.users,{unSelect:true});
			}

		});
	};
	//获取机构权限
	viewModel.getOrganTree = function(){
		//orgType = "001";
		viewModel.organRightDataTable.removeAllRows();
		var orgType = $('#organSelectList option:selected').val();
		var userguid = "";
		var treeObj = $.fn.zTree.getZTreeObj("user-tree1");
		var search_nodes = treeObj.getSelectedNodes();
		if(search_nodes != null && search_nodes.length >0){
			userguid = search_nodes[0].guid;
		}

		$.ajax({
			url: "/df/datarightrelation/getEleByConditionAsObjxs.do?tokenid="+tokenid,
			type: "POST",
			data: {
				"ajax": "1",
				"orgType": orgType,
				"userGuid": userguid,
				"tokenid": tokenid
			},
			dataType:"json",
			success: function(data){
				if(data.orgTypes != null){
					viewModel.organRightDataTable.setSimpleData(data.orgTypes,{unSelect:true});
					if(data.selectedorgTypes != null){
						for(var i =0; i<data.selectedorgTypes.length; i++){
							var treeObj = $.fn.zTree.getZTreeObj("oragn-tree");
							var search_nodes = treeObj.getNodesByParam("chr_id",data.selectedorgTypes[i].org_id,null);
							if(search_nodes.length > 0){
								treeObj.checkNode(search_nodes[0], true, true);
							}
						}
					}
				}
			}
		});
	};
	//机构权限下拉框获取数据
	viewModel.getOrganSelect = function(){
		$.ajax({
			url: "/df/datarightrelation/findAllSysOrgtypes.do?tokenid="+tokenid,
			type: "POST",
			data: {
				"tokenid":tokenid,
				"ajax":"1"
			},
			success: function(data){
				if(data != null){
					for(var i=0;i<data.orgTypes.length; i++){
						var option="";
						if(i == 0){
							option=$("<option value='"+data.orgTypes[i].orgtype_code+"' selected>"+data.orgTypes[i].orgtype_name+"</option>");
						}
						option=$("<option value='"+data.orgTypes[i].orgtype_code+"'>"+data.orgTypes[i].orgtype_code+data.orgTypes[i].orgtype_name+"</option>");
						$("#organSelectList").append(option);
					}
				}
			}
		});
	};

	viewModel.setSelected = function(index){
		$("#rightList li").find(".char-name").removeClass("group-active");
		$("#rightList li").eq(index).find(".char-name").addClass("group-active");

	};

	//获取权限组
	viewModel.getRightGroup = function(){
		var treeObj = $.fn.zTree.getZTreeObj("user-tree1");
		var nodes = treeObj.getSelectedNodes();
		if(nodes ==null || nodes.length == 0){
			ip.ipInfoJump("请选择用户","info");
		}else{
			if(nodes[0].isParent){
				ip.ipInfoJump("请选择子节点","info");
			}else{
				$.ajax({
					url: "/df/datarightrelation/showAllGROUPlist.do?tokenid="+tokenid,
					type: "POST",
					data: {
						"ajax": "1",
						"tokenid":tokenid
					},
					success: function(data){
						if(data != null && data.groupList != null){
							//viewModel.rightLists(data.groupList);
							viewModel.dataTableRuleGroup.setSimpleData(data.groupList);
						}

					}
				});
				$("#selectAuthModal").modal("show");
			}
		}
	};
	//显示每个权限组的详细信息
	viewModel.showRightDetail = function(){
		var rule_id ="";
		//var rule_id = $("#rightList li span.group-active").parent().attr("id");
		var treeObjRule = $.fn.zTree.getZTreeObj("ruleTree1");
		var nodesRule = treeObjRule.getSelectedNodes();
		if(nodesRule != null || nodesRule.length > 0){
			rule_id = nodesRule[0].rule_id;

			$.ajax({
				url: "/df/dataright/getSysRightList.do?tokenid"+tokenid,
				type: "POST",
				data: {
					"ajax": "1",
					"tokenid": tokenid,
					"rule_id": rule_id
				},
				success: function(data){
					if(data != null){
						viewModel.rightDetaileDataTable.setSimpleData(data.rows,{unSelect:true});
						var treeObj = $.fn.zTree.getZTreeObj("rightDetaile"); 
						treeObj.expandAll(true);
						$("#dataRightInput").val(nodesRule[0].name);
						$("#dataRightInput").attr("name",nodesRule[0].id);
						$("#selectAuthModal").modal("hide");
					}
				}

			});
		}else{
			ip.ipInfoJump("请选择","info");
		}
	};
	//删除数据权限
	viewModel.delDataRight = function(){
		ip.warnJumpMsg("确定要删除吗?","okDelRightDatabtn","cancle");
		$("#okDelRightDatabtn").click(function(){
			//alert("清空输入框删除下面的树的数据");
			$("#dataRightInput").attr("name","");
			$("#dataRightInput").val("");
			$("#config-modal").remove();
			viewModel.rightDetaileDataTable.removeAllRows();
		});
		$(".cancle").click(function(){
			$("#config-modal").remove();
		});
	};

	//添加角色弹窗
	viewModel.showAddRolesModal = function(){
		var treeObj = $.fn.zTree.getZTreeObj("user-tree1");
		var nodes = treeObj.getSelectedNodes();
		if(nodes ==null || nodes.length == 0){
			ip.ipInfoJump("请选择用户","info");
		}else{
			if(nodes[0].isParent){
				ip.ipInfoJump("请选择子节点","info");
			}else{
				$.ajax({
					url: "/df/datarightrelation/addCaRole.do?tokenid"+tokenid,
					type: "POST",
					data: {
						"ajax": "1",
						"tokenid":tokenid,
						"usertype": nodes[0].usertype
					},
					success: function(data){
						if(data != null){
							viewModel.roleDataTable.setSimpleData(data.addroles,{unSelect: true});
							var treeObj = $.fn.zTree.getZTreeObj("addRoletree3");
							var nodes = treeObj.getSelectedNodes();
							if(data.addroles.length == 1){
								treeObj.setChkDisabled(nodes[0], true);
							}
							var selectRoles = $("#ulroleSelectedRight li");
							if(selectRoles != null){
								for(var i=0; i<selectRoles.length; i++){
									var id = selectRoles.eq(i).attr("id");
									var allRoletreeObj = $.fn.zTree.getZTreeObj("addRoletree3");
									var search_nodes = allRoletreeObj.getNodesByParam("guid",id,null);
									if(search_nodes.length > 0){
										allRoletreeObj.checkNode(search_nodes[0], true, true);
									}

								}
							}
							$("#addRoleModal").modal("show");
						}else{
							ip.ipInfoJump("服务器繁忙，请稍等!","info");
						}
					}
				});
			}
		}
	};

	/*
	 * 删除角色（选中父级，子集也会删除）
	 */
	viewModel.delRole = function(){
		var selectRole = $("#ulroleSelectedRight li .select-role-active");
		if(selectRole.length == 0){
			ip.ipInfoJump("请选择要删除的角色","error");
		}else{
			ip.warnJumpMsg("确定要删除吗?","okDelRolebtn","cancle");
			$("#okDelRolebtn").click(function(){
				//alert("请求后端的删除接口");

				$("#ulroleSelectedRight li .select-role-active").parent().find(".list-icon-color").remove();
				$("#ulroleSelectedRight li .select-role-active").parent().remove();
				$("#config-modal").remove();
			});
			$(".cancle").click(function(){
				$("#config-modal").remove();
			});
		}
	};
	viewModel.getSelectRoleTree = function(){
		var roleCheckold = {};
		roleCheckold = roleCheck;
		roleCheck = {};
		var treeObj = $.fn.zTree.getZTreeObj("addRoletree3");
		var nodes = treeObj.getCheckedNodes();
		for(var i= 0; i < nodes.length; i++){
			if(nodes[i].parentid === '0'){
				treeObj.setChkDisabled(nodes[i], true);
			}
		}
		nodes = treeObj.getCheckedNodes(true);
		//viewModel.selectRoleDataTable.setSimpleData(nodes);
		var addNodes=[];
		if(nodes != null && nodes.length >0){
			for(var i=0; i<nodes.length; i++){
				if(nodes[i].guid != -1 && nodes[i].guid != 1 && nodes[i].guid != 2 && nodes[i].guid != 4){
					addNodes.push(nodes[i]);
				}
			}

		}
		var addhtml="";
		for(var i=0; i<addNodes.length; i++){
			addhtml += "<li id='"+addNodes[i].guid+"'><span class='glyphicon glyphicon-stop list-icon-color'></span><span class='ulroleSelectedRight-text'>"+addNodes[i].name+"</span></li>";
			if(roleCheckold[addNodes[i].id] == null){ 
				var roleMessage = {};
				roleMessage["is_defined"] = "0";
				roleMessage["role_name"] = addNodes[i].name;
				roleCheck[addNodes[i].id] = roleMessage;
			}else{
				roleCheck[addNodes[i].id] = roleCheckold[addNodes[i].id];
			}
		}
		$("#ulroleSelectedRight").html("");
		$("#ulroleSelectedRight").append(addhtml);
		$("#addRoleModal").modal("hide");
	};
	viewModel.getRightGroup1 = function(){
		var tokenid = ip.getTokenId();
		ruleCheck = "1";
		$.ajax({
			url: "/df/datarightrelation/showAllGROUPlist.do?tokenid="+tokenid,
			type: "POST",
			data: {
				"ajax": "1",
				"tokenid":tokenid
			},
			success: function(data){
				if(data != null && data.groupList != null){
					//viewModel.rightLists(data.groupList);
					viewModel.dataTableRuleGroup.setSimpleData(data.groupList,{unSelect:true});
				}

			}
		});
		$("#selectAuthModal1").modal("show");
	};

//	显示每个权限组的详细信息
	viewModel.showRightDetail1 = function(){
		var tokenid = ip.getTokenId();
		var rule_id ="";
		//var rule_id = $("#rightList li span.group-active").parent().attr("id");
		var treeObjRule = $.fn.zTree.getZTreeObj("ruleTree1-jump");
		var nodesRule = treeObjRule.getSelectedNodes();
		if(nodesRule != null || nodesRule.length > 0){
			rule_id = nodesRule[0].rule_id;

			//var rule_id = $("#dataRightInput").attr("name");
			$.ajax({
				url: "/df/dataright/getSysRightList.do?tokenid="+tokenid,
				type: "POST",
				data: {
					"ajax": "1",
					"tokenid": tokenid,
					"rule_id": rule_id
				},
				success: function(data){
					if(data != null){
						viewModel.rightDetaileDataTable1.setSimpleData(data.rows,{unSelect:true});
						var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
						var roleMessage = roleCheck[id];
						roleMessage["rule_name"] = nodesRule[0].name;
						roleMessage["rule_id"] = nodesRule[0].id;
						$("#dataRightInput2").val(roleMessage["rule_name"]);
						$("#selectAuthModal1").modal("hide");
					}
				}

			});
		}else{
			ip.ipInfoJump("请选择","info");
		}
	};

	// 查詢下一個
	var i = 0;
	menuTreeNext = function (){
		var user_write = $("#quickquery").val();
		var data_tree = $("#user-tree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(i < search_nodes.length){
			data_tree.selectNode(search_nodes[i++]);
		}else{
			i = 0;
			ip.ipInfoJump("最后一个","info");
		}
		$("#quickquery").focus();
	};

	//选中权限组

	$("#organSelectList").change(function(){
		var treeObj = $.fn.zTree.getZTreeObj("user-tree1");
		var search_nodes = treeObj.getSelectedNodes();
		if(search_nodes != null && search_nodes.length >0){
			if(search_nodes[0].isParent){
				ip.ipInfoJump("请选择用户","info");
			}
			else{
				viewModel.getOrganTree();
			}
		}
	});

	allClick  = function(){
		var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
		var roleMessage = roleCheck[id];
		roleMessage["is_defined"] = "0";
		viewModel.rightDetaileDataTable1.removeAllRows();
		$("#dataRightInput2").val("");
		$("#checkbtn").attr("disabled",true);
	}
	//保存角色权限
	viewModel.saveDataRightReltion = function(){
		var org_type = $('#organSelectList option:selected').val();

		//ip.ipInfoJump("保存成功");
		var organTreeId=[]; //机构id
		var roleTreeId=[]; //角色id
		var guid="";
		var treeObj = $.fn.zTree.getZTreeObj("user-tree1");
		var nodes = treeObj.getSelectedNodes();
		//选中的用户id
		if(nodes != null && nodes.length > 0){
			guid = nodes[0].guid;																																														 guid = nodes[0].guid;
		}
		//选中的机构的树的id
		var organTree = $.fn.zTree.getZTreeObj("oragn-tree");
		var organSelect = organTree.getCheckedNodes(true);
		if( org_type!="001"){
			if(!organSelect || organSelect.length==0){
				ip.ipInfoJump("机构管理权限不能为空！","error");
				return;
			}
		}

		for(var i=0 ;i<organSelect.length; i++){
			organTreeId.push(organSelect[i].chr_id);
		}

		var roleli = $("#ulroleSelectedRight li");
		for(var i=0; i<roleli.length; i++){
			var a={};
			a["role_name"] = roleli.eq(i).find(".ulroleSelectedRight-text").text();
			a["role_id"] = roleli.eq(i).attr("id");
			var b = roleCheck[a["role_id"]];
			a["is_defined"] = b["is_defined"];
			a["rule_id"] = b["rule_id"];
			if( b["is_defined"] === "1"){
				if(!b["rule_id"]){
					ip.ipInfoJump("请添加"+a["role_name"] +"权限信息！","error");
					return;
				}
			}

			roleTreeId.push(a);
		}
        var ruleId = $("#dataRightInput").attr("name");
       if(ruleId == ""){
            ip.ipInfoJump("保存失败！请先添加数据权限信息！","error");
            return;
        }
		if(roleTreeId.length == 0){
			ip.ipInfoJump("保存失败！请先添加角色信息！","error");
			return;
		}

		$.ajax({
			url: "/df/datarightrelation/saveDataRightReltion.do?tokenid="+tokenid,
			type: "POST",
			data:{
				"tokenid":tokenid,
				"guid":guid,
				"organCode": $('#organSelectList option:selected').val(),
				"organTreeId": organTreeId.join(","),
				"ruleId": $("#dataRightInput").attr("name"),
				"ajax":"1",
				"roleTreeId":JSON.stringify(roleTreeId),
				"org_type" :org_type
			},
			success: function(data){
				if(data.flag == "1"){
					ip.ipInfoJump("保存成功","success");
				}else{
					ip.ipInfoJump("保存失败","error");
				}
			}
		});
	};
	viewModel.clearData = function(){
		viewModel.organRightDataTable.setSimpleData("");
		viewModel.rightDetaileDataTable.setSimpleData("");
		$("#ulroleSelectedRight").html("");
		$("#dataRightInput2").val("");
		$("#checkbtn").attr("disabled",true);
		$("#optionsRadios4").attr("checked",false);
		$("#optionsRadios4").attr("disabled",true);
		$("#optionsRadios3").attr("checked",true);
		viewModel.rightDetaileDataTable1.setSimpleData("");
		$("#dataRightInput").val("");
	}
	/*    ulroleSelectedClick = function(is_defined, rule_id, rule_name){
    	$("#ulroleSelectedRight li .ulroleSelectedRight-text").removeClass("select-role-active");
		$(this).find(".ulroleSelectedRight-text").addClass("select-role-active");
		$("#optionsRadios4").removeAttr("disabled");
		$("#optionsRadios3").removeAttr("disabled");
		//menuViewModel.rightDetaileDataTable1.removeAllRows();
		$("#dataRightInput2").val("");
		if(is_defined == "0"){
			$("input[name='optionsRadios1']").eq(0).prop("checked", true);
			$("#checkbtn").attr("disabled",true);
		}else{
			$("#dataRightInput2").val(rule_name);
			$.ajax({
				url: "/df/dataright/getSysRightList.do",
				type: "POST",
				data: {
					"ajax": "1",
					"tokenid": tokenid,
					"rule_id": rule_id
				},
				success: function(data){
					alert("adad");

				}
			})
				//$("#dataRightInput2").attr("name",nodeid);
		}
    }*/
	$(function(){
		$("#organSelectList").attr("disabled", true);
		/*$("#ulroleSelectedRight").on("click","li",function(){
    		$("#ulroleSelectedRight li .ulroleSelectedRight-text").removeClass("select-role-active");
    		$(this).find(".ulroleSelectedRight-text").addClass("select-role-active");

    	});*/
		$("#ulroleSelectedRight").on("click","li",function(){
			$("#ulroleSelectedRight li .ulroleSelectedRight-text").removeClass("select-role-active");
			$(this).find(".ulroleSelectedRight-text").addClass("select-role-active");
			$("#optionsRadios4").removeAttr("disabled");
			$("#optionsRadios3").removeAttr("disabled");
			viewModel.rightDetaileDataTable1.removeAllRows();
			$("#dataRightInput2").val("");
			var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
			if(roleCheck.length !=0){
				var roleMessage = roleCheck[id];
				var check = roleMessage["is_defined"];
				if(check == "0"){
					$("input[name='optionsRadios1']").eq(0).prop("checked", true);
					$("#checkbtn").attr("disabled",true);
				}else{
					$("input[name='optionsRadios1']").eq(1).prop("checked", true);
					$("#checkbtn").removeAttr("disabled");
					//var havedata = roleMessage["data"];

					$("#dataRightInput2").val(roleMessage.rule_name);
					$.ajax({
						url : "/df/dataright/getSysRightList.do?tokenid=" + tokenid,
						type : 'POST',
						data: {
							"ajax":1,
							"rule_id":roleMessage.rule_id
						},
						success: function(data){
							viewModel.rightDetaileDataTable1.setSimpleData(data.rows,{unSelect:true});
						}
					});
					//$("#dataRightInput2").attr("name",nodeid);
				}
			}


		});
		app = u.createApp({
			el: 'body',
			model: viewModel
		});
	});

	viewModel.initUserTree();//获取用户数据
	viewModel.getOrganSelect();//获取机构下拉列表

	viewModel.dataTable.removeAllRows();
	// viewModel.dataTable.setSimpleData(data);
	initGroup();

	//2017-05-02 by yanyga
	// 预览model function-开始

	function showYLModal(){


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
		viewModelNew.selectEletreeDataTable.setSimpleData(allSelectedData,{unSelect:true});

	}
	// 预览model function-结束

	// 权限组添加/修改-------- 开始

	function showRightModal(){

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
					//var data=['a','b','c'];
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
						" checked> 全部权限" +" </label> " +
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
	}

	/*自定义权限 */
	userDefinedClick = function(){
		var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
		var roleMessage = roleCheck[id];
		roleMessage["is_defined"] = "1";
		$("#checkbtn").removeAttr("disabled");
		//var havedata = roleMessage["data"];
		//if(havedata == "1"){
		/*var treeObj = $.fn.zTree.getZTreeObj("rightDetaile1"); 
			var datarow = roleMessage["treedata"];
			var nodename = roleMessage["name"];
			var nodeid = roleMessage["id"];*/
		$.ajax({
			url : "/df/dataright/getSysRightList.do?tokenid=" + tokenid,
			type : 'POST',
			data: {
				"ajax":1,
				"rule_id":roleMessage.rule_id
			},
			success: function(data){
				viewModel.rightDetaileDataTable1.setSimpleData(data.rows,{unSelect:true});
				$("#dataRightInput2").val(roleMessage.rule_name);
				$("#dataRightInput2").attr("name", roleCheck[id]);
			}
		});

		//}
	}
	// 权限组添加/修改-------- 结束
});


