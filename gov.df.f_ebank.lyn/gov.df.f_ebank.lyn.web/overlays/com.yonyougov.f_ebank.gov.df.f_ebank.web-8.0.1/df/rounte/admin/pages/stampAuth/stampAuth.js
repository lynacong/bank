define(['text!pages/stampAuth/stampAuth.html',
        'jquery', 'uui','tree','bootstrap','ip'],function(html) {
var init =function(element,param){
	    document.title=ip.getUrlParameter("menuname");
		var viewModel = {
			tokenid : ip.getTokenId(),
			// 设置用户树
			treeSettingUser : {
				view:{
    				showLine:false,
    				selectedMulti:false
    			},
    			data:{
	    			simpleData: {
	    				enable: true,
	    				idKey: "guid",
	    				pIdKey: "belong_org",
	    				rootPId: null
	    			}
	    		},
	    		callback:{
	    			onClick:function(event,treeId,treeNode){
	    				var treeObj = $.fn.zTree.getZTreeObj("userTree");
	    				var nodes = treeObj.getSelectedNodes();
	    				if(nodes[0].isParent){
	    					ip.warnJumpMsg("请选择末级节点！",0,0,true);
	    					return false;
	    				}
	    				showUserStamp(event, treeId, treeNode);
	    			}
	    		}
			},
			// 设置印章树
			treeSettingStamp : {
				view : {
					showLine : false,
					selectedMulti : true
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
					// 若无用户信息则印章不勾选
					beforeCheck : function(e, id, node) {
						var treeObjUser = $.fn.zTree.getZTreeObj("userTree");
						var selectedUser = treeObjUser.getSelectedNodes()[0];
						if (selectedUser == null || selectedUser.belong_type == null || selectedUser.belong_type =="000") {
							ip.warnJumpMsg("请选择授权用户！",0,0,true);
							return false;
						}
					},
					// 绑定check事件，当选择印章时，将页面中的用户、印章及财政信息存入数据库
					onCheck : function(e, id, node) {
						updateStampUserFinance(e, id, node);
					},
					onClick:null
				},
				check : {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "s", "N": "s" }
				}
			}
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
							var html = document.getElementById("finance_code").innerHTML;
							for ( var i = 0; i < data.dataDetail.length; i++) {
								html+="<option value="+data.dataDetail[i].chr_code+">"+data.dataDetail[i].chr_name+"</option>";
							}
							$("#finance_code").html(html);
							var finance_code = $("#finance_code").val();
						}
					} else {
						ip.warnJumpMsg("获取财政信息失败！原因："+ data.reason,0,0,true);
					}
				}
			});
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
						var userTreeObj = $.fn.zTree.init($("#userTree"), viewModel.treeSettingUser, data.userList);
						userTreeObj.expandAll(true);
						userTreeObj.cancelSelectedNode();
					} else {
						ip.warnJumpMsg("获取用户信息失败！原因："+ data.reason,0,0,true);
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
						var stampTreeObj = $.fn.zTree.init($("#stampTree"), viewModel.treeSettingStamp, data.ebankStamps);
						stampTreeObj.expandAll(true);
					}
				}
			});
		};
	
		// 切换财政时，重新加载印章树
		getStampsByFinanceUser = function() {
			// 判断是否有用户被选中
			var treeObjUser = $.fn.zTree.getZTreeObj("userTree");
			var selectUser = treeObjUser.getSelectedNodes()[0];
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
						var stampTreeObj = $.fn.zTree.init($("#stampTree"), viewModel.treeSettingStamp, data.ebankStamps);
						stampTreeObj.expandAll(true);
					}
				}
			});
		};
	
		// 根据用户显示印章的函数
		showUserStamp = function(e, id, node) {
			// 将印章节点均置为未选中状态
			var stampTreeObj = $.fn.zTree.getZTreeObj("stampTree");
			stampTreeObj.checkAllNodes(false);
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
						//勾选印章的选中框
						var dataArrStamp = data.stampList;
        				if(dataArrStamp.length > 0){
        					for(var i=0;i<dataArrStamp.length;i++){
    							var stampNode = stampTreeObj.getNodeByParam("chr_id",dataArrStamp[i].chr_id, null);
    							if (stampNode != null) {
    								stampTreeObj.checkNode(stampNode);
    								stampNode.checkedOld =  stampNode.checked;
    							}
    						}
        				}
					} else {
						ip.warnJumpMsg("查询财政信息失败！原因：" + data.reason,0,0,true);
					}
				}
			});
		};
		
		//选择印章时，将页面中的用户、印章及财政信息存入数据库
		updateStampUserFinance = function(e, id, node) {
			// 获取选中的用户user_id
			var userTreeObj = $.fn.zTree.getZTreeObj("userTree");
			var selectedUserId = userTreeObj.getSelectedNodes()[0].guid;
			//获取改变的印章树节点
			var stampTreeObj = $.fn.zTree.getZTreeObj("stampTree");
			var nodes = stampTreeObj.getChangeCheckedNodes();
			var stampidAndFinance = [];
			var checked = "";
			for(var i = 0 ; i < nodes.length ; i++){
				var curNode = nodes[i];
				if(curNode.finance_code != null && curNode.finance_code != "null"){//只存储叶子节点数据
					var stampId = nodes[i].chr_id;
					//若当前节点无父节点，则从财政下拉框获取
					var selectedFinanceCode = curNode.getParentNode() == null ? 
							$("#finance_code").val() : curNode.finance_code;
					nodes[i].checkedOld =  curNode.checked;
				    //节点checked属性： true表示插入，false表示删除
				    checked = curNode.checked;
					stampidAndFinance.push({"stampId":stampId,"financeCode":selectedFinanceCode});
				}
			}
			// 将获取的数据出入后台，存入数据库表
			$.ajax({
				url : "/df/f_ebank/stampAuth/updateStampUserFinance.do?tokenid=" + viewModel.tokenid,
				type : "POST",
				dataType : "json",
				data : {
					"ajax" : "nocache",
					"userId" : selectedUserId,
					"stampidAndFinance" : JSON.stringify(stampidAndFinance),
					"flag" : checked
				},
				success : function(data) {
					if (data.result == "success") {
						// 保存后不进行任何操作
					} else {
						ip.warnJumpMsg("印章添加失败！原因：" + data.reason,0,0,true);
					}
				}
			});
		};
		//用户输入框的回车键事件
		eventHandler = function(event){
			if(event.keyCode ==13)
	    		commonSeach("user");
		};
		
		 var nextClickNum = 0;
		 var choseNodeList=[];
		//查询
		commonSeach = function(type){
			nextClickNum = 0;
			choseNodeList=[];
	    	var userTreeObj = $.fn.zTree.getZTreeObj(type+"Tree");
	    	var nodes = userTreeObj.getNodes();
	    	var nodesList = userTreeObj.transformToArray(nodes);
	    	var values = $("#"+type+"Text").val();
	    	nodesList.forEach(function(obj) {
		            if(obj.name.indexOf(values) > -1) 
		            	choseNodeList.push(obj);
	    	});
	    	if(choseNodeList.length==0){
	    		ip.warnJumpMsg("没有类似数据！",0,0,true);
	    		return;
	    	}
    		userTreeObj.selectNode(choseNodeList[0]);  //默认选中第一个
	    };
		//公共查询下一个
	    commonSeachNext = function(type){
	    	var userTreeObj = $.fn.zTree.getZTreeObj(type+"Tree");
	    	nextClickNum = nextClickNum + 1;
	    	var list;
	    	if(type=="user"){
	    		list = choseNodeList;
	    	}
	    	if(list.length <= nextClickNum){
	    		nextClickNum = 0;
	    	}
	    	userTreeObj.selectNode(list[nextClickNum]);
	    };
		// 初始化整个页面
		initView = function() {
			findUsers();
			findFinances();
			findStamps();
		},
		
		pageInit =function(){
			app = u.createApp({
				el : element,
				model : viewModel
			});
			initView();
		};

		$(element).html(html);	
		pageInit();
};
	return {
		init:init
	};
});
