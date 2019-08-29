require([ 'jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid', 'ip' ], 
	function($, ko) {
		var chr_id = "";
		var selectNode;
		//var tokenid = ip.getTokenId();
	
		var viewModel = {
			tokenid : ip.getTokenId(),
			dataArr : ko.observableArray(),
	
			// 定义菜单树
			treeMenuDataTable : new u.DataTable({
				meta : {
					'chr_id' : {
						'value' : ""
					},
					'parent_id' : {
						'value' : ""
					},
					'show_name' : {
						'value' : ""
					}
				}
			}),
	
			// 定义签章位置树(即凭证类型树)
			treeBillTypeDataTable : new u.DataTable({
				meta : {
					'chr_id' : {
						'value' : ""
					},
					'parent_id' : {
						'value' : ""
					},
					'show_name' : {
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
	
			// 设置菜单树
			treeMenuSetting : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				callback : {
					onClick : function(e, id, node) {
						//获取menuId,addrId以及financeCode
						if(node.isParent)
							return;
						var menu_id = node.chr_id;
						var finance_code = $("#finance_code").val();
						getAddrByMenuIdFinance(menu_id,finance_code);
						var treeObjAddr = $.fn.zTree.getZTreeObj("tree_billType");
						if(treeObjAddr.getSelectedNodes()[0]==null || treeObjAddr.getSelectedNodes()[0].isParent){
							var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps"); 
							treeObjStamp.checkAllNodes(false);
							return false;
						}
						var addrId = treeObjAddr.getSelectedNodes()[0].chr_id;
						selectStampByMenuAddr(menuId,addrId);
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
	
			// 设置签章类型树
			treeBillTypeSetting : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				callback : {
					onClick : function(e, id, node) {
						//获取menuId,addrId以及financeCode
						var treeObjMenu = $.fn.zTree.getZTreeObj("tree_menu");
						var menuId = treeObjMenu.getSelectedNodes()[0].chr_id;
						if(node.isParent){
							return false;
						}
						var addrId = node.chr_id;
						selectStampByMenuAddr(menuId,addrId);
					}
				}
			},
	
			// 设置印章树
			treeStampSetting : {
				view : {
					showLine : false,
					selectedMulti : true,
				},
				callback : {
					// 若无菜单或签章位置信息则印章不勾选
					beforeCheck : function(e, id, node) {
						//菜单信息
						var treeObjMenu = $.fn.zTree.getZTreeObj("tree_menu");
						var selectedMenu = treeObjMenu.getSelectedNodes()[0];
						//签章位置
						var treeObjBillType = $.fn.zTree.getZTreeObj("tree_billType");
						var selectedBillType = treeObjBillType.getSelectedNodes()[0];
						if(selectedMenu == null || selectedMenu.isParent ){
							ip.ipInfoJump("请先设置签章发送", "error");
							return false;
						}
						if(selectedBillType == null  || selectedBillType.isParent) {
							ip.ipInfoJump("请先设置签章位置", "error");
							return false;
						}
					},
					// 绑定check事件，当选择印章时，将页面中的菜单、签章位置、印章及财政信息存入数据库
					onCheck : function(e, id, node) {
						// 获取选中的菜单、签章位置、印章及财政信息
						//菜单信息
						var treeObjMenu = $.fn.zTree.getZTreeObj("tree_menu");
						var menu_id = treeObjMenu.getSelectedNodes()[0].chr_id;
						//签章位置
						var treeObjBillType = $.fn.zTree.getZTreeObj("tree_billType");
						var addr_id = treeObjBillType.getSelectedNodes()[0].chr_id;
						// 财政信息
						var finance_code = $("#finance_code").val();
						//印章信息
						var stamp_id = node.chr_id;
						// 标识印章选中状态的标识符
						var flag = node.checked;// true:则进行插入，false:则进行删除
						// 将获取的数据出入后台，存入数据库表
						updateMenuAddrStampFinance(menu_id,addr_id,stamp_id,finance_code,flag);
					},
				},
				check : {
					enable : true,
					chkboxType : {
						"Y" : "",
						"N" : ""
					},
				}
			},
	
		};
	
		// 初始化财政机构下拉框
		viewModel.initFinance = function() {
			$.ajax({
				url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				dataType : "json",
				data : {
					"ajax" : "noCache"
				},
				async : false,
				success : function(datas) {
					if (datas.errorCode == "0") {
						for ( var i = 0; i < datas.dataDetail.length; i++) {
							var x = document.getElementById("finance_code");
							var option = document.createElement("option");
							option.text = datas.dataDetail[i].chr_name;
							option.value = datas.dataDetail[i].chr_code;
							try {
								// 对于更早的版本IE8
								x.add(option, x.options[null]);
							} catch (e) {
								x.add(option, null);
							}
							// 初始化 盖章位置 树
							//viewModel.initBillTypeTree();
							// 初始化印章树
							viewModel.initEpayStampTree();
						}
						viewModel.initEpayStampTree();
					} else {
						ip.ipInfoJump("加载Combo失败！原因：" + datas.result, "error");
					}
				}
			});
		};
		
		//初始化菜单树
		viewModel.initMenuTree = function() {
			$.ajax({
				url : "/df/f_ebank/stampConf/findAllMenus.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				data : {
					ajax : "noCache",
				},
				success : function(data){
					if(data.result=="success"){
						viewModel.treeMenuDataTable.setSimpleData(data.Menulist,{"unSelect": true});
					}
				}
				
			});
		};
	
		// 初始化签章位置树
		viewModel.initBillTypeTree = function() {
			//var rg_code = document.getElementById("rg_code").value;
			var finance_code = $("#finance_code").val();
			$.ajax({
				url : "/df/ebankVoucherManage/findAllBillandPosition.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				data : {
					"ajax" : "noCache",
					"financeCode" : finance_code,
				},
				success : function(data) {
					if (data.result == "success") {
						treedata = data.eleList;
						viewModel.treeBillTypeDataTable.setSimpleData(data.eleList,{"unSelect": true});
					}
				}
			});
		};
	
		// 初始化印章树
		viewModel.initEpayStampTree = function() {
			var finance_code = $("#finance_code").val();
			$.ajax({
				url : "/df/f_ebank/stampManage/findAllStamps.do?tokenid=" + viewModel.tokenid,
				type : "GET",
				data : {
					"ajax" : "noCache",
					"financeCode" : finance_code
				},
				//async : false,
				success : function(data) {
					if (data.result == "success") {
						viewModel.treeStampDataTable.setSimpleData(data.ebankStamps, {
							unSelect : true
						});
						var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps");
					}
				}
			});
		};
		
		// 根据下拉框中选中的财政获取对应的凭证列表
		getBillsByFinance = function(){
			//菜单信息
			var treeObjMenu = $.fn.zTree.getZTreeObj("tree_menu");
			var selectedMenu = treeObjMenu.getSelectedNodes()[0]; 
			if(selectedMenu == null || selectedMenu.isParent ){
				ip.ipInfoJump("请先设置签章发送", "error");
				return false;
			}
			var menu_id = treeObjMenu.getSelectedNodes()[0].chr_id;
			var finance_code = $("#finance_code").val();
			getAddrByMenuIdFinance(menu_id,finance_code);
 		};
		
		//根据下拉框中选中的财政获取对应的印章列表
		getStampsByFinance = function() {
			var finance_code = document.getElementById("finance_code").value;
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
					}
				}
			});
		};
		
		//根据下拉框中选中的财政获取对应的凭证和印章列表
		getBillStampByFinance = function(){
			viewModel.initMenuTree();
			viewModel.treeBillTypeDataTable.clear();
			viewModel.initEpayStampTree();
			//getStampsByFinance();
			//getBillsByFinance();
		};
		
		//根据选中的菜单和签章位置查询对应的印章信息
		selectStampByMenuAddr = function(menu_id,addr_id){
			var finance_code = $("#finance_code").val(); 
			$.ajax({
				url : "/df/f_ebank/stampConf/selectStampByMenuAddr.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				data : {
					"ajax" : "noCache",
					"menuId" : menu_id,
					"addrId" : addr_id,
					"financeCode" : finance_code
				},
				success : function(data) {
					if (data.result == "success") {
						//得到此时对应的印章
						var stampData = data.StampList;
						//获取当前页面的显示的所有印章
						var treeObjStamp = $.fn.zTree.getZTreeObj("tree_stamps"); 
						//// 将印章节点均置为未选中状态
						treeObjStamp.checkAllNodes(false);
						//若此时显示的印章中有对应印章打钩
						for ( var i = 0; i < stampData.length; i++) {
							checkStamp = treeObjStamp.getNodeByParam("chr_id", stampData[i].chr_id);
							if (checkStamp != null) {
								treeObjStamp.checkNode(checkStamp);
							}
						}
					}else{
						ip.ipInfoJump(data.reason, "error");
						
					}
				}
			});
		};
		
		//更新菜单、签章位置、印章及财政关系函数
		updateMenuAddrStampFinance = function(menu_id,addr_id,stamp_id,finance_code,flag){
			$.ajax({
				url : "/df/f_ebank/stampConf/updateMenuAddrStampFinance.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "noCache",
					"menuId" : menu_id,
					"addrId" : addr_id,
					"stampId" : stamp_id,
					"financeCode" : finance_code,
					flag : flag
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
		
		//根据菜单及财政机构查询对应的签章位置
		getAddrByMenuIdFinance = function(menu_id,finance_code){
			$.ajax({
				url : "/df/f_ebank/stampConf/getAddrByMenuIdFinance.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "noCache",
					"menuId" : menu_id,
					"financeCode" : finance_code,
				},
				async : false,
				success : function(data) {
					if (data.result == "success") {
						viewModel.treeBillTypeDataTable.setSimpleData(data.addrList,{"unSelect": true});
						var treeBillType = $.fn.zTree.getZTreeObj("tree_billType");
						// 自动展开节点
						treeBillType.expandAll(true);
					} else {
						ip.ipInfoJump("获取用户信息失败！原因：" + data.reason, "error");
					}
				}
			});
		};
		
		$(function() {
			app = u.createApp({
				el : 'body',
				model : viewModel
			});
			
			// 初始化菜单树
			viewModel.initMenuTree();
			
			// 初始化财政机构下拉框
			viewModel.initFinance();
			
		});

});
