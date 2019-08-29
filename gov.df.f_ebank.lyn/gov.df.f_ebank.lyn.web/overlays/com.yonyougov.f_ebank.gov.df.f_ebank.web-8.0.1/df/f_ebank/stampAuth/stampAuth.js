require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid', 'ip' ], 
	function($, ko) {
		window.ko = ko;
		var viewModel = {
			tokenid : ip.getTokenId(),
	
			// 定义用户树
			treeUserDataTable : new u.DataTable({
				meta : {
					'guid' : {
						'value' : ""
					},
					'belong_type' : {
						'value' : ""
					},
					'name' : {
						'value' : ""
					}
				}
			}),
	
			// 定义印章树
			treeStampDataTable : new u.DataTable({
				meta : {
					'chr_id' : {
						'value' : ""
					},
					'finance_code' : {
						'value' : ""
					},
					'show_name' : {
						'value' : ""
					},
				}
			}),
	
			// 设置用户树
			treeSettingUser : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				callback : {
					onClick : function(e, id, node) {
						showUserStamp(e, id, node);
					}
				},
				check : {
					enable : false,
					chkboxType : {
						"Y" : "",
						"N" : ""
					},
				}
			},
	
			// 设置印章树
			treeSettingStamp : {
				view : {
					showLine : false,
					selectedMulti : true,
				},
				callback : {
					// 若无用户信息则印章不勾选
					beforeClick : function(e, id, node) {
						if(id.isParent==true){
							return false;
						}
						var treeObjUser = $.fn.zTree.getZTreeObj("tree_users");
						var selectedUser = treeObjUser.getSelectedNodes()[0];
						if (selectedUser == null || selectedUser.belong_type == null) {
							ip.ipInfoJump("只能对具体用户进行设置操作", "error");
							return false;
						}
					},
					beforeCheck : function(e, id, node) {
						if(id.isParent==true){
							return false;
						}
						var treeObjUser = $.fn.zTree.getZTreeObj("tree_users");
						var selectedUser = treeObjUser.getSelectedNodes()[0];
						if (selectedUser == null || selectedUser.belong_type == null) {
							ip.ipInfoJump("只能对具体用户进行设置操作", "error");
							return false;
						}
					},
					// 绑定check事件，当选择印章时，将页面中的用户、印章及财政信息存入数据库
					onClick : function(e, id, node){
						updateStampUserFinance(e, id, node);
					},
					onCheck : function(e, id, node) {
						updateStampUserFinance(e, id, node);
					}
				},
				check : {
					enable : true,
					chkboxType : {
						"Y" : "",
						"N" : ""
					},
				}
			}
		};
	
		// 初始化用户信息
		findUsers = function() {
			$.ajax({
				url : "/df/f_ebank/stampAuth/findUsers.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				success : function(data) {
					if (data.result == "success") {
						viewModel.treeUserDataTable.setSimpleData(data.userList, {
							"unSelect" : true
						});
						var treeObjStamp = $.fn.zTree.getZTreeObj("tree_users");
						treeObjStamp.cancelSelectedNode();
					} else {
						ip.ipInfoJump("获取用户信息失败！原因：" + data.reason, "error");
					}
				}
			});
		};
	
		// 初始化财政信息
		findFinances = function() {
			$.ajax({
				url : "/df/f_ebank/config/getAllFinanceOrgData.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "nocache"
				},
				async : false,
				success : function(data) {
					if (data.result == "成功！") {
						for ( var i = 0; i < data.dataDetail.length; i++) {
							var x = document.getElementById("finance_code");
							var option = document.createElement("option");
							option.text = data.dataDetail[i].chr_name;
							option.value = data.dataDetail[i].chr_code;
	
							try {
								// 对于更早的版本IE8
								x.add(option, x.options[null]);
							} catch (e) {
								x.add(option, null);
							}
	
							//var rg_code = document.getElementById("rg_code").value;
							var finance_code = $("#finance_code").val();
						}
					} else {
						ip.ipInfoJump("获取财政信息失败！原因：" + data.reason, "error");
					}
				}
			});
		};
	
		// 初始化印章信息
		findStamps = function() {
			var finance_code = $("#finance_code").val();
			$.ajax({
				url : "/df/f_ebank/stampManage/findAllStamps.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				data : {
					"ajax" : "noCache",
					"financeCode" : finance_code
				},
				async : false,
				success : function(data) {
					if (data.result == "success") {
						viewModel.treeStampDataTable.setSimpleData(data.ebankStamps, {
							unSelect : true
						});
						var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps");
						// 自动展开节点
						treeObjStamp.expandAll(true);
						var nodes = treeObjStamp.getNodes();
						// 将财政信息的checkbox消去
						for ( var i = 0; i < nodes.length; i++) {
							if (nodes[i].finance_code == "") {
								nodes[i].nocheck = true;
								treeObjStamp.updateNode(nodes[i]);
							}
						}
					}
				}
			});
		};
	
		// 切换财政时，重新加载印章树
		getStampsByFinanceUser = function() {
			// 判断是否有用户被选中
			var treeObjUser = $.fn.zTree.getZTreeObj("tree_users");
			var selectUser = treeObjUser.getSelectedNodes()[0];
			//var rg_code = document.getElementById("rg_code").value;
			var finance_code = $("#finance_code").val();
			// 无用户时，直接显示对应财政的所有印章
			if (selectUser == null || selectUser.belong_type == null) {
				// 根据财政显示所有印章
				if (finance_code == '000000') {
					findStamps();
				} else {
					getStampsByFinance(finance_code);
				}
				return false;
			}
			if (finance_code == '000000') {
				findStamps();
			} else {
				getStampsByFinance(finance_code);
			}
			showUserStamp(null, null, selectUser);
		};
	
		// 根据财政显示印章的函数
		getStampsByFinance = function(finance_code) {
			$.ajax({
				url : "/df/f_ebank/stampManage/findAllStamps.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				data : {
					"ajax" : "noCache",
					"financeCode" : finance_code
				},
				async : false,// 保证在调用showUserStamp时印章树已加载
				success : function(data) {
					if (data.result == "success") {
						viewModel.treeStampDataTable.setSimpleData(data.ebankStamps, {
							unSelect : true
						});
						var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps");
					}
				}
			});
		},
	
		// 根据用户显示印章的函数
		showUserStamp = function(e, id, node) {
			// 将印章节点均置为未选中状态
			var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps");
			treeObjStamp.checkAllNodes(false);
	
			$.ajax({
				url : "/df/f_ebank/stampAuth/getStampsByUser.do?tokenid=" + viewModel.tokenid,
				type : "post",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"userId" : node.guid
				},
				success : function(data) {
					if (data.result == "success") {
						var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps");
						for ( var i = 0; i < data.stampList.length; i++) {
							// 将所有与用户关联的印章勾选
							checkStamp = treeObjStamp.getNodeByParam("chr_id", data.stampList[i].chr_id);
							if (checkStamp != null) {
								treeObjStamp.checkNode(checkStamp);
							}
						}
					} else {
						ip.ipInfoJump("查询财政信息失败！原因：" + data.reason, "error");
					}
				}
			});
		};
		
		//选择印章时，将页面中的用户、印章及财政信息存入数据库
		updateStampUserFinance = function(e, id, node) {
			// 获取选中的用户、财政及印章状态
			var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps");
			var treeObjUser = $.fn.zTree.getZTreeObj("tree_users");
			var selectedUser = treeObjUser.getSelectedNodes()[0];
			// 获取user_id
			var selectUser_id = selectedUser.guid;
			// 获取rg_code
			// 若当前节点无父节点，则从财政下拉框获取
			var selectedFinance_code;
			if (node.getParentNode() == null) {
				selectedFinance_code = $("#finance_code").val();
			} else {
				selectedFinance_code = node.pId;
			}
			var selectedStamp_id = node.chr_id;
			// 标识印章选中状态的标识符
			var flag = node.checked;// true:则进行插入，false:则进行删除
			// 将获取的数据出入后台，存入数据库表
			$.ajax({
				url : "/df/f_ebank/stampAuth/updateStampUserFinance.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"stampId" : selectedStamp_id,
					"userId" : selectUser_id,
					"financeCode" : selectedFinance_code,
					"flag" : flag
				},
				success : function(data) {
					if (data.result == "success") {
						// 保存后不进行任何操作
					} else {
						ip.ipInfoJump("获取用户信息失败！原因：" + data.reason, "error");
					}
				}
			});
		};
		
		// 初始化整个页面
		initView = function() {
			findUsers();
			findFinances();
			findStamps();
		},
	
		$(function() {
			app = u.createApp({
				el : 'body',
				model : viewModel
			});
			initView();
		});
});
