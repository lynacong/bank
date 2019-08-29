//电子签章配置
define(['text!pages/stampConf/stampConf.html',
        'jquery','knockout', 'uui','tree',
    	'bootstrap','ip'],function(html) {
		var init =function(element,param){
		document.title=ip.getUrlParameter("menuname");
		var chr_id = "";
		var selectNode;
		var viewModel = {
			tokenid : ip.getTokenId(),
			dataArr : ko.observableArray(),
			// 签章发送菜单树设置
			menuTreeSetting : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				data:{
					key:{
    					name:"show_name"
    				},
	    			simpleData: {
	    				enable: true,
	    				idKey: "chr_id",
	    				pIdKey: "parent_id",
	    				btn_id: "btn_id",
	    				rootPId: null
	    			}
	    		},
				callback : {
					onClick : function(e, id, node) {
						//获取menuId,addrId以及financeCode
						if(node.isParent)
							return;
						var menu_id = node.chr_id;
						var btn_id = node.btn_id;
						var finance_code = $("#finance_code").val();
						getAddrByMenuIdFinance(menu_id,finance_code,btn_id);
						var stampPosTreeObj = $.fn.zTree.getZTreeObj("stampPosTree");
						if(stampPosTreeObj.getSelectedNodes()[0]==null || stampPosTreeObj.getSelectedNodes()[0].isParent){
							var stampTreeObj = $.fn.zTree.getZTreeObj("stampTree"); 
							stampTreeObj.checkAllNodes(false);
							return false;
						}
						var addrId = stampPosTreeObj.getSelectedNodes()[0].chr_id;
						selectStampByMenuAddr(menuId,addrId);
					}
				},
				check : {
					enable : false,
					chkboxType : {
						"Y" : "",
						"N" : ""
					}
				}
    		
			},
			//签章位置树设置
			stampPosTreeSetting : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				data:{
					key:{
    					name:"show_name"
    				},
	    			simpleData: {
	    				enable: true,
	    				idKey: "chr_id",
	    				pIdKey: "parent_id",
	    				rootPId: null
	    			}
	    		},
	    		callback : {
					onClick : function(e, id, node) {
						//获取menuId,addrId以及financeCode
						var menuTreeObj = $.fn.zTree.getZTreeObj("menuTree");
						var menuId = menuTreeObj.getSelectedNodes()[0].chr_id;
						if(node.isParent){
							return false;
						}
						var addrId = node.chr_id;
						selectStampByMenuAddr(menuId,addrId);
					}
				}
			},
			//印章（签章）树设置
			stampTreeSetting : {
				view : {
					showLine : false,
					selectedMulti : false
				},
				data:{
					key:{
    					name:"show_name"
    				},
	    			simpleData: {
	    				enable: true,
	    				idKey: "chr_id",
	    				pIdKey: "finance_code",
	    				rootPId: null
	    			}
	    		},
	    		callback : {
					// 若无菜单或签章位置信息则印章不勾选
					beforeCheck : function(e, id, node) {
						//菜单信息
						var menuTreeObj = $.fn.zTree.getZTreeObj("menuTree");
						var selectedMenu = menuTreeObj.getSelectedNodes()[0];
						//签章位置
						var stampPosTreeObj = $.fn.zTree.getZTreeObj("stampPosTree");
						var selectedBillType = stampPosTreeObj.getSelectedNodes()[0];
						if(selectedMenu == null || selectedMenu.isParent ){
							ip.warnJumpMsg("请先设置签章发送！",0,0,true);
							return false;
						}
						if(selectedBillType == null  || selectedBillType.isParent) {
							ip.warnJumpMsg("请先设置签章位置！",0,0,true);
							return false;
						}
					},
					// 绑定check事件，当选择印章时，将页面中的菜单、签章位置、印章及财政信息存入数据库
					onCheck : function(e, id, node) {
						// 获取选中的菜单、签章位置、印章及财政信息
						//菜单信息
						var menuTreeObj = $.fn.zTree.getZTreeObj("menuTree");
						var menu_id = menuTreeObj.getSelectedNodes()[0].chr_id;
						//签章位置
						var stampPosTreeObj = $.fn.zTree.getZTreeObj("stampPosTree");
						var pos_id = stampPosTreeObj.getSelectedNodes()[0].chr_id;
						// 财政信息
						var finance_code = $("#finance_code").val();
						//印章信息
						var stamp_id = node.chr_id;
						// 标识印章选中状态的标识符
						var flag = node.checked;// true:则进行插入，false:则进行删除
						// 将获取的数据出入后台，存入数据库表
						updateMenuAddrStampFinance(menu_id,pos_id,stamp_id,finance_code,flag);
					}
				},
				check : {
					enable : true,
					chkboxType : {
						"Y" : "",
						"N" : ""
					}
				}
			}
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
							var html = document.getElementById("finance_code").innerHTML;
							for ( var i = 0; i < datas.dataDetail.length; i++) {
								html+="<option value="+datas.dataDetail[i].chr_code+">"+datas.dataDetail[i].chr_name+"</option>";
							}
							$("#finance_code").html(html);
							// 初始化印章树
							viewModel.initEpayStampTree();
						}
						viewModel.initEpayStampTree();
					} else {
						ip.warnJumpMsg("加载Combo失败！原因：" + datas.result,0,0,true);
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
						var menuTreeObj = $.fn.zTree.init($("#menuTree"), viewModel.menuTreeSetting, data.Menulist);
						menuTreeObj.expandAll(true);
						menuTreeObj.cancelSelectedNode();
					}
				}
				
			});
		};
		// 初始化签章位置树
		viewModel.initBillTypeTree = function() {
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
						var stampPosTreeObj = $.fn.zTree.init($("#stampPosTree"), viewModel.stampPosTreeSetting, data.eleList);
						stampPosTreeObj.cancelSelectedNode();
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
				success : function(data) {
					if (data.result == "success") {
						var stampTreeObj = $.fn.zTree.init($("#stampTree"), viewModel.stampTreeSetting, data.ebankStamps);
						stampTreeObj.cancelSelectedNode();
						stampTreeObj.expandAll(true);
						var nodes = stampTreeObj.getNodes();
						nodes[0].nocheck = true;
						stampTreeObj.updateNode(nodes[0]);
					}
				}
			});
		};
		// 根据下拉框中选中的财政获取对应的凭证列表
		getBillsByFinance = function(){
			//菜单信息
			var menuTreeObj = $.fn.zTree.getZTreeObj("menuTree");
			var selectedMenu = menuTreeObj.getSelectedNodes()[0]; 
			if(selectedMenu == null || selectedMenu.isParent ){
				ip.warnJumpMsg("请先设置签章发送！",0,0,true);
				return false;
			}
			var menu_id = menuTreeObj.getSelectedNodes()[0].chr_id;
			var btn_id = menuTreeObj.getSelectedNodes()[0].btn_id;
			var finance_code = $("#finance_code").val();
			getAddrByMenuIdFinance(menu_id,finance_code,btn_id);
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
						var stampTreeObj = $.fn.zTree.init($("#stampTree"), viewModel.stampTreeSetting, data.ebankStamps);
						stampTreeObj.expandAll(true);
					}
				}
			});
		};
		
		//根据下拉框中选中的财政获取对应的凭证和印章列表
		getBillStampByFinance = function(){
			viewModel.initMenuTree();
			$.fn.zTree.destroy("stampPosTree");
			viewModel.initEpayStampTree();
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
						var stampTreeObj = $.fn.zTree.getZTreeObj("stampTree"); 
						// 将印章节点均置为未选中状态
						stampTreeObj.checkAllNodes(false);
						//若此时显示的印章中有对应印章打钩
						for ( var i = 0; i < stampData.length; i++) {
							var checkStamp = stampTreeObj.getNodeByParam("chr_id", stampData[i].chr_id);
							if (checkStamp != null) {
								stampTreeObj.checkNode(checkStamp);
							}
						}
					}else{
						ip.warnJumpMsg(data.reason,0,0,true);
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
						ip.warnJumpMsg("获取用户信息失败！原因：" + data.reason,0,0,true);
					}
				}
			});
		};
		
		//根据菜单及财政机构查询对应的签章位置
		getAddrByMenuIdFinance = function(menu_id,finance_code,btn_id){
			$.ajax({
				url : "/df/f_ebank/stampConf/getAddrByMenuIdFinance.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "noCache",
					"menuId" : menu_id,
					"financeCode" : finance_code,
					"btnId" : btn_id
				},
				async : false,
				success : function(data) {
					if (data.result == "success") {
						var stampPosTreeObj = $.fn.zTree.init($("#stampPosTree"), viewModel.stampPosTreeSetting, data.addrList);
						stampPosTreeObj.expandAll(true);
					} else {
						ip.warnJumpMsg("获取用户信息失败！原因：" + data.reason,0,0,true);
					}
				}
			});
		};
		
		pageInit =function(){
			app = u.createApp({
				el : element,
				model : viewModel
			});
			
			// 初始化菜单树
			viewModel.initMenuTree();
			// 初始化财政机构下拉框
			viewModel.initFinance();
	
		};

		$(element).html(html);	
		pageInit();
};
	return {
		init:init
	};
});
