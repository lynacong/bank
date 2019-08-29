define([ 'jquery', 'knockout', 'text!./discuss._html', 'text!./discussing._html','uui','css!./discuss.css', 'tree','ip'], function($,ko,templete,discussing) {
    var discuss = {};
    var viewModel = {// 共商常用群组复选框
    	    dt3: new u.DataTable({
    	        meta: {
    	            f3: {}
    	        }
    	    }),
    	    checkboxData3: [{value: 'mb', name: '业务处'}, 
    	                    {value: 'zg', name: '主管单位'},
    	                    {value: 'ys', name: '预算单位'}]
    };
    var zTree = $.fn.zTree;
    var tokenid = ip.getTokenId();
    var selectedUserNodes ={};
	var selectMbNodes={};
	var selectedCommUserNodes ={};
	var selectDeptNodes={};
	var discussUserViewId = "";
	var discussingViewId = "";
	  // 已添加到用户列表的节点code集合
    var existUserNodes=[];
    var discussGroupCheckBox;
    var discussTabFlag;// 共商弹窗页签flag
    var discussMBFlag = true;// 共商处室复选框flag
    var discussAgencyFlag = true;// 共商单位复选框flag
    var existUserArray = [];// 群组中已经存在的共商用户
    var listCount = 0;
    function adapter2(list, id, pid, name) {
        list.forEach(function(o) {
          o.id = o[id]
          o.pid = pid === null ? null : o[pid]
          o.name = o[name]
        })
        return list
      }
    var setting = {

            nodes: [{name: 1}],
            view: {
              showLine: true,
              // showIcon: showIconForTree,
              dblClickExpand: true
            },
            callback: {
              onClick: null,
            }
          };

          var mb_Tree = {
            instance: null,
            nodes: [],
            nodesBak: [],
            selNode: null, // 被选中的节点
            selListBak: {
              // key: arr
            }, // 每个节点选中的规则备份 key是节点id, arr是选中的规则列表
            setting: {
        		 data: {
        		        simpleData: {
        		          enable: true,
        		          idKey: "id",
        		          pIdKey: "pid",
        		          rootPId: 0,
        		        }
        		      },
              view: {
                fontCss: function(treeId, treeNode) {
                  if(!treeNode.isParent && treeNode.selectList && treeNode.selectList.length) {
        			return {color: '#f00'}
                  } else {
                	  return {}
                  }
                },
              },
              callback: {
                beforeClick: function (treeId, treeNode) {
                  if (!treeNode.level) {
                    return false
                  }
                },
                onClick: function (e, treeId, treeNode) {
                	selectedUserNodes = treeNode;
        	          mb_Tree.selNode = treeNode
        	          discuss.options["user_id"] = treeNode.id
                	selectMbNodes = treeNode.getParentNode()
                },
              },
            }
          }
          var commDept_Tree = {
        	        instance: null,
        	        nodes: [],
        	        nodesBak: [],
        	        setting: {
        	          data: {
        	            simpleData: {
        	              enable: true,
        	              idKey: "id",
        	              pIdKey: "pid",
        	              rootPId: 0,
        	            }
        	          },
        	          view: {
        	              fontCss: function(treeId, treeNode) {
        	                if(!treeNode.isParent && treeNode.selectList && treeNode.selectList.length) {
        	      			return {color: '#f00'}
        	                } else {
        	              	  return {}
        	                }
        	              },
        	            },
        	          callback: {
        	        	  beforeClick: function (treeId, treeNode) {
        	                  if (!treeNode.level) {
        	                    return false
        	                  }
        	                },
        	        	  onClick: function(e, treeId, treeNode) {
        	            	selectedCommUserNodes = treeNode;
        	            	commDept_Tree.selNode = treeNode
        	            	discuss.options["user_id"] = treeNode.id
        	          	selectDeptNodes = treeNode.getParentNode()
        	          }
        	          },
        	        }
        	      }
 function initMBTree() {
    if(mb_Tree.instance) mb_Tree.instance.destroy()
    mb_Tree.instance = zTree.init($('#allUserTree'), mb_Tree.setting, mb_Tree.nodes)
    mb_Tree.instance.expandAll(false)
 }
 function initCommDeptTree() {
	    if(commDept_Tree.instance) commDept_Tree.instance.destroy()
	    commDept_Tree.instance = zTree.init($('#commonUserTree'), commDept_Tree.setting, commDept_Tree.nodes)
	    commDept_Tree.instance.expandAll(false)
	  }
// 共商复选框功能
 var discussGroup = ['28','05','06'];// 05预算处，06国库处，28集中支付中心默认选中
	var initDiscussGroupListener = function(){
		var r = viewModel.dt3.createEmptyRow();
		r.setValue('f3', '28,05,06');
		viewModel.dt3.setRowSelect(0);
		discussGroupCheckBox =$("#inspectDiscussModalAdd").find(".u-checkbox");
			for(var i=0; i<discussGroupCheckBox.length; i++){
				 $(discussGroupCheckBox[i]).bind("click", {index: i}, getDiscussGroupValue); 
			}
			$.each($("#inspectDiscussModalAdd").find(".u-checkbox-input"),function(i){
				$(this).attr({"id":"id"+i});
				});
	};
	var getDiscussGroupValue = function(event){
		 var index = event.data.index;  
	     var obj = discussGroupCheckBox[index];  
	     var val=$(obj).find("input[class='u-checkbox-input']").val();
	     if(!discussMBFlag&&val=="mb"){
				ip.ipInfoJump("当前选中数据包含多个业务处室，不能选择业务处人员！","info");
				return;
			}
			if(!discussAgencyFlag&&val=="zg"){
				ip.ipInfoJump("当前选中数据包含多个主管部门，不能选择主管部门人员！","info");
				return;
			}
			if(!discussAgencyFlag&&val=="ys"){
				ip.ipInfoJump("当前选中数据包含多个预算单位，不能选择预算单位人员！","info");
				return;
			}
			if($.inArray(val,discussGroup)!=-1){
				discussGroup.splice($.inArray(val,discussGroup),1);
			 }else{
				 discussGroup.push(val); 
			 }
			discuss.options["data"] = JSON.stringify(discuss.selectData);
			discuss.options["dept_val"] = JSON.stringify(discussGroup);
		    // 加载常用用户数据
		    $.ajax({
		      url: "/df/fi_fip/inspectdiscuss/queryCommDeptUser.do",
		      type : 'GET',
			  dataType : 'json',
			  async : false,
			  data: discuss.options,
		      success: function (data) { 
		    	  commDept_Tree.nodes = adapter2(data.dept_data, 'chr_id', null, 'chr_name')
		    	  	.concat([{id: null, pid: 0, name: '常用人员'}]).concat(adapter2(data.dept_user_data, 'user_id', 'belong_org', 'user_name'))
		    		  initCommDeptTree()
		    		  $(function(){
		    			  var treeObj = $.fn.zTree.getZTreeObj("commonUserTree")
		    			  var node = treeObj.getNodesByParam("pid", 0, null);
		    			  treeObj.expandNode(node[0], true, false, true)
		    		  });
		    	  },
		      error: function () {
		        ip.ipInfoJump('获取树失败', 'error')
		      },
		    })
		};
  // 修改共商用户
   var doAddUser = function(){
	  viewModel.discussUserViewModel = ip.createGrid('{DA4792D8-D24A-42DC-9283-9BC5D30C81F4}', 'discussUserArea', "", discuss.options, 0, false, false, false, false);
		 $('#navuser-tabs li:eq(0) a').tab('show');
		 discussTabFlag ="0";
		 discussGroup = ['28','05','06'];
		 existUserNodes=[];
		 discussMBFlag = true;
		 discussAgencyFlag = true;
		 $("#inspectDiscussModalAdd").find("#id0").attr("disabled",false);
		 $("#inspectDiscussModalAdd").find("#id1").attr("disabled",false);
		 $("#inspectDiscussModalAdd").find("#id2").attr("disabled",false);
		viewModel.discussUserViewModel.clear()
		if(discuss.selectData.length>1){
			for(var i=0;i<discuss.selectData.length-1;i++){
				if(discuss.selectData[i].mb_code != discuss.selectData[i+1].mb_code){
					discussMBFlag = false;
					$("#inspectDiscussModalAdd").find("#id0").attr("disabled",true);
					break;
				}
			}
			for(var i=0;i<discuss.selectData.length-1;i++){
				if(discuss.selectData[i].agency_code != discuss.selectData[i+1].agency_code){
					discussAgencyFlag = false;
					$("#inspectDiscussModalAdd").find("#id1").attr("disabled",true);
					$("#inspectDiscussModalAdd").find("#id2").attr("disabled",true);
					break;
				}
			}
		}
		// 加载业务处室用户数据
	    $.ajax({
	      url: "/df/fi_fip/inspectdiscuss/queryManageBranchUser.do",
	      success: function (data) {
	    	  mb_Tree.nodes = adapter2(data.mb_data, 'mb_id', null, 'mb_name')
	    	  	.concat([{id: null, pid: 0, name: '业务处室'}]).concat(adapter2(data.user_data, 'user_id', 'belong_org', 'user_name'))
	    		  initMBTree()
	    		  $(function(){
	    			  var treeObj = $.fn.zTree.getZTreeObj("allUserTree")
	    			  var node = treeObj.getNodeByParam('name','业务处室',null)
	    			  treeObj.expandNode(node.children[0], true, true, true)
	    		  });
	      },
	      error: function () {
	        ip.ipInfoJump('获取树失败', 'error')
	      },
	    })
	    discuss.options["data"] = JSON.stringify(discuss.selectData);
	    discuss.options["dept_val"] = JSON.stringify(discussGroup);
	    // 加载常用用户数据
	    $.ajax({
	      url: "/df/fi_fip/inspectdiscuss/queryCommDeptUser.do",
	      type : 'GET',
		  dataType : 'json',
		  async : false,
		  data: discuss.options,
	      success: function (data) { 
	    	  commDept_Tree.nodes = adapter2(data.dept_data, 'chr_id', null, 'chr_name')
	    	  	.concat([{id: null, pid: 0, name: '常用人员'}]).concat(adapter2(data.dept_user_data, 'user_id', 'belong_org', 'user_name'))
	    		  initCommDeptTree()
	    		  $(function(){
	    			  var treeObj = $.fn.zTree.getZTreeObj("commonUserTree")
	    			  var node = treeObj.getNodesByParam("pid", 0, null);
	    			  treeObj.expandNode(node[0], true, false, true)
	    		  });
	    	  },
	      error: function () {
	        ip.ipInfoJump('获取树失败', 'error')
	      },
	    })
	     // 加载用户列表数据
	    $.ajax({
	      url: "/df/fi_fip/inspectdiscuss/querydiscussGroupUser.do",
	      type : 'GET',
		  dataType : 'json',
		  async : false,
		  data: discuss.options,
	      success: function (data) {
				var data = data.dataDetail;
			    existUserArray = [];
				if(data.length > 0){
					for( var i = 0; i < data.length; i++){
						var userobj = {};
						userobj.user_id=data[i].user_id;
						userobj.user_name=data[i].user_name;
						userobj.belong_name=data[i].belong_name;
						existUserArray.push(userobj);
					}
				}
	      }
	    })
		$("#inspectDiscussModalAdd").modal({
			backdrop : 'static',
			keyboard : false
		});
	    viewModel.dt3.clear();
		var r = viewModel.dt3.createEmptyRow();
		r.setValue('f3', '28,05,06');
		viewModel.dt3.setRowSelect(0);
};
	// 新增共商共建
	var doAddDiscuss = function(){
	  viewModel.discussUserViewModel = ip.createGrid('{DA4792D8-D24A-42DC-9283-9BC5D30C81F4}', 'discussUserArea', "", discuss.options, 0, false, false, false, false);
		 $('#navuser-tabs li:eq(0) a').tab('show');
		 discussTabFlag ="0";
		 discussGroup = ['28','05','06'];
		 $("#discussTheme").val("");
		 existUserNodes=[];
		 discussMBFlag = true;
		 discussAgencyFlag = true;
		 $("#inspectDiscussModalAdd").find("#id0").attr("disabled",false);
		 $("#inspectDiscussModalAdd").find("#id1").attr("disabled",false);
		 $("#inspectDiscussModalAdd").find("#id2").attr("disabled",false);
		viewModel.discussUserViewModel.gridData.clear()
			if(discuss.selectData.length==1){
				$("#discussTheme").val("【资金监控】关于"+discuss.selectData[0].agency_name+"的预警问题讨论");
			}else{
				for(var i=0;i<discuss.selectData.length-1;i++){
					if(discuss.selectData[i].mb_code != discuss.selectData[i+1].mb_code){
						discussMBFlag = false;
						$("#inspectDiscussModalAdd").find("#id0").attr("disabled",true);
						break;
					}
				}
				for(var i=0;i<discuss.selectData.length-1;i++){
					if(discuss.selectData[i].agency_code != discuss.selectData[i+1].agency_code){
						discussAgencyFlag = false;
						$("#inspectDiscussModalAdd").find("#id1").attr("disabled",true);
						$("#inspectDiscussModalAdd").find("#id2").attr("disabled",true);
						break;
					}
				}
				if(discussAgencyFlag){
					$("#discussTheme").val("【资金监控】关于"+discuss.selectData[0].agency_name+"的预警问题讨论");
				}else{
					$("#discussTheme").val("【资金监控】关于"+discuss.selectData[0].agency_name+"等单位的预警问题讨论");
				}
			}
			
		// 加载业务处室用户数据
	    $.ajax({
	      url: "/df/fi_fip/inspectdiscuss/queryManageBranchUser.do",
	      success: function (data) {
	    	  mb_Tree.nodes = adapter2(data.mb_data, 'mb_id', null, 'mb_name')
	    	  	.concat([{id: null, pid: 0, name: '业务处室'}]).concat(adapter2(data.user_data, 'user_id', 'belong_org', 'user_name'))
	    		  initMBTree()
	    		  $(function(){
	    			  var treeObj = $.fn.zTree.getZTreeObj("allUserTree")
	    			  var node = treeObj.getNodeByParam('name','业务处室',null)
	    			  treeObj.expandNode(node.children[0], true, true, true)
	    		  });
	      },
	      error: function () {
	        ip.ipInfoJump('获取树失败', 'error')
	      },
	    })
	    discuss.options["data"] = JSON.stringify(discuss.selectData);
	    discuss.options["dept_val"] = JSON.stringify(discussGroup);
	    // 加载常用用户数据
	    $.ajax({
	      url: "/df/fi_fip/inspectdiscuss/queryCommDeptUser.do",
	      type : 'GET',
		  dataType : 'json',
		  async : false,
		  data: discuss.options,
	      success: function (data) { 
	    	  commDept_Tree.nodes = adapter2(data.dept_data, 'chr_id', null, 'chr_name')
	    	  	.concat([{id: null, pid: 0, name: '常用人员'}]).concat(adapter2(data.dept_user_data, 'user_id', 'belong_org', 'user_name'))
	    		  initCommDeptTree()
	    		  $(function(){
	    			  var treeObj = $.fn.zTree.getZTreeObj("commonUserTree")
	    			  var node = treeObj.getNodesByParam("pid", 0, null);
	    			  treeObj.expandNode(node[0], true, false, true)
	    		  });
	    	  },
	      error: function () {
	        ip.ipInfoJump('获取树失败', 'error')
	      },
	    })
	      var testData = [];
	    		var b = {};
	    	 	b["user_id"] = discuss.options.svUserId;
	    	 	b["user_code"] = discuss.options.svUserCode;
	    	 	b["user_name"] = discuss.options.svUserName;
	    	 	b["belong_id"] = discuss.options.svAgencyId;
	    	 	b["belong_code"] = discuss.options.svAgencyCode;
	    	 	b["belong_name"] = discuss.options.svAgencyName;
	    		testData.push(b);
	    		existUserNodes.push(discuss.options.svUserId);
			viewModel.discussUserViewModel.gridData.addSimpleData(testData, {
					unSelect: true
					});
			if(discussMBFlag||discussAgencyFlag){
				 discuss.options["discussMBFlag"] = discussMBFlag;
				 discuss.options["discussAgencyFlag"] = discussAgencyFlag;
				$.ajax({
					url : "/df/fi_fip/inspectdiscuss/loadInitDiscussUsers.do",
					type : 'POST',
					dataType : 'json',
					async : false,
					data: discuss.options,
					success : function(datas) {
						var initUsers = [];
						for(i=0;i<datas.dataDetail.length;i++){
							var tempUsers = {};
							tempUsers["user_id"] = datas.dataDetail[i].user_id;
							tempUsers["user_name"] = datas.dataDetail[i].user_name;
							tempUsers["belong_name"] = datas.dataDetail[i].belong_name;
							if(discuss.options.svUserId!=datas.dataDetail[i].user_id){
								initUsers.push(tempUsers);
								existUserNodes.push(datas.dataDetail[i].user_id);
							 }
						}
					viewModel.discussUserViewModel.gridData.addSimpleData(initUsers, {
							unSelect: true
							});
					}
	    	});
			}
			if(discuss.inspectFlag =="1"){
				$(".inspectDiscussModalAdd-content").css("margin-top","-6px");
				$("#navuser-tabs").css("border-bottom","1px solid #108EE9");
				$(".nav-tabs>li>a").css("margin-right","2px");
				doSaveDiscuss();
			}else{
		$("#inspectDiscussModalAdd").modal({
			backdrop : 'static',
			keyboard : false
		});
			}
	    viewModel.dt3.clear();
		var r = viewModel.dt3.createEmptyRow();
		r.setValue('f3', '28,05,06');
		viewModel.dt3.setRowSelect(0);
		
	
};
// 共商左侧树页签切换
showAllMbTab = function(){
		// 切换到全部处室页签
		$('#navuser-tabs li:eq(1) a').tab('show');
		discussTabFlag = "1";
	};
showCommonUserTab = function(){
		// 切换到常用人员页签
		discussTabFlag = "0";
	};

// 共商向右侧列表添加用户
addUserToList = function(){
	if(discussTabFlag == "0"){
		 var treeObj = $.fn.zTree.getZTreeObj("commonUserTree")
		}else if(discussTabFlag == "1"){
			 var treeObj = $.fn.zTree.getZTreeObj("allUserTree")
		}
	 var nodes = treeObj.getSelectedNodes();
	 if(!nodes.length>0){
		 ip.ipInfoJump("请选择一个用户", "info")
		 return
	 }else if (nodes.length>0) { 
		  	treeObj.cancelSelectedNode(nodes[0]);
	  }
	  var deptnode = nodes[0].getParentNode();
	if(nodes[0].id == null || nodes[0].id == ""||deptnode.chr_id == null||deptnode.chr_id ==""){
    		ip.ipInfoJump("请选择一个用户", "info")
    		return;
    	}
	var existUserFlag = false;
	for(var i=0; i<existUserArray.length; i++){
		if(existUserArray[i].user_id ==nodes[0].id){
			existUserFlag = true;
			break;
		}
	}
	if(existUserFlag){
		ip.ipInfoJump("用户"+nodes[0].name+"已经是群成员！", "info");
		return;
	}
    	var userObj = {};
    	var funcArray = new Array();
    	userObj["user_id"] = nodes[0].id;
    	userObj["user_code"] = nodes[0].user_code;
    	userObj["user_name"] = nodes[0].name;
    	userObj["belong_id"] = deptnode.chr_id;
    	userObj["belong_code"] = deptnode.chr_code;
    	userObj["belong_name"] = deptnode.chr_name;
    	// 校验用户是否已经添加
    	var size = existUserNodes.length;
    	if(size > 0){
    		var addFlag = true;
    		for(var i = 0; i < size; i++){
    			if(existUserNodes[i] == nodes[0].id){
    				addFlag = false;
    				ip.ipInfoJump("该用户已经存在，不能重复添加！", "info");
    				return;
    			} 
    		}
    		if(addFlag){
    			existUserNodes.push(nodes[0].id);
    		}
    	}else{
    		existUserNodes.push(nodes[0].id);
    	}
    	funcArray.push(userObj);
    	viewModel.discussUserViewModel.gridData.addSimpleData(funcArray,{unSelect:true});
    }

// 共商从右侧列表删除用户
removeUserFromList = function(){
	var userArray = viewModel.discussUserViewModel.gridData.getSimpleData();
	var userIndex = viewModel.discussUserViewModel.gridData.getSelectedIndex();
	if(discuss.modifyFlag){
		if (userIndex > -1) {
			var userId = userArray[userIndex].user_id;
			removeByValue(existUserNodes, userId);
			userArray.remove(userIndex);
			viewModel.discussUserViewModel.gridData.setSimpleData(userArray, {
				unSelect: true
			});
		}else{
			ip.ipInfoJump("请选择一个需要移除的用户", "info");
			return;
		}
	}else{
		if (userIndex > 0) {
			var userId = userArray[userIndex].user_id;
			removeByValue(existUserNodes, userId);
			userArray.remove(userIndex);
			viewModel.discussUserViewModel.gridData.setSimpleData(userArray, {
				unSelect: true
			});
    	}else if(userIndex == 0){
    		ip.ipInfoJump("群组创建人不可删除！", "info");
    		return;
    	}else{
    		ip.ipInfoJump("请选择一个需要移除的用户", "info");
    		return;
    	}
	}
}

function removeByValue(arr, val) { 
	for(var i=0; i<arr.length; i++) {
		if(arr[i] == val) {     
			arr.splice(i, 1);    
			break;    
		}  
	}
}
function StringBuffer(str){
    var arr = [];
    str = str || "";
    arr.push(str);
    this.append = function(str1)
    {
        arr.push(str1);
        return this;
    };
    this.toString = function()
    {
        return arr.join("");
    };
};
// 保存新增的共商
doSaveDiscuss = function(){
	var userDatas = viewModel.discussUserViewModel.gridData.getSimpleData();
	var discussTheme = $("#discussTheme").val();
	if(discussTheme =="" || discussTheme == null){
		ip.ipInfoJump("共商主题不能为空!","info");
		return;
	}
	if(userDatas==""||userDatas ==null){
		ip.ipInfoJump("请添加用户！","info");
		return;
	}
	var buffer = new StringBuffer();
	for(var i = 0; i < userDatas.length; i++){
	buffer.append(userDatas[i].user_id).append("@").append(userDatas[i].user_name).append("#");
	}
	var groupUsers = buffer.toString();
	groupUsers = groupUsers.substring(0,groupUsers.length-1);
	if(discuss.modifyFlag){
		options["group_name"] = discussTheme;
		options["group_id"] = options.discuss_group_id;
		options["group_users"] = groupUsers;
		$.ajax({
			url : "/df/imgroupmanage/addGroupMember.do",
			type : 'POST',
			dataType : 'json',
			async : true,
			data: discuss.options,
			success : function(datas) {
				window.parent.vueInstance.$store.dispatch('sdChat/getGroupUsers')
				$("#inspectDiscussModalAdd").modal("hide");
			}
		});
	}else{
		discuss.options["selectdiscussdata"] = JSON.stringify(discuss.selectData);
		discuss.options["type"] = "new";
	var groupinfo = {};
    	groupinfo["group_type"] = "2";// 1代表普通群，2代表共商共建群
    	groupinfo["group_name"] = discussTheme;
    	groupinfo["group_number"] = "100";
    	groupinfo["group_region"] = "山东省#济南市";
    	groupinfo["group_users"] = groupUsers;
    	groupinfo["group_introduction"] = "监控单据消息";
    	discuss.options["groupinfo"] = JSON.stringify(groupinfo);
	$.ajax({
		url : "/df/imgroupmanage/saveMessageGroup.do",
		type : 'POST',
		dataType : 'json',
		async : true,
		data: discuss.options,
		success : function(datas) {
			var discussGroupId = datas.group_id;
			discuss.options["discuss_group_id"] = discussGroupId;
			discuss.options["theme"] = discussTheme;
			$.ajax({
				url : "/df/fi_fip/inspectdiscuss/saveInspectDiscuss.do",
				type : 'POST',
				dataType : 'json',
				async : true,
				data: discuss.options,
				success : function(datas) {
					sessionStorage.setItem("discuss_group_id", discussGroupId);
					sessionStorage.setItem("data", JSON.stringify(discuss.selectData));
					sessionStorage.setItem("discussTheme",discussTheme);
					//删除弹窗界面
					
					window.parent.addTabToParent("问题共商", "/df/fi_fip/inspectDiscuss/inspectDiscuss.html?tokenid="+tokenid+"&ajax=1");
					$("#inspectDiscussModalAdd").modal("hide");
					if(discuss.inspectFlag=="1"&&listCount=="1"){
					$("#monitorModalIllegal").modal("hide");	
					}else{
						$('input:checkbox[name=inspect]').attr("checked",false);
					}
					
				}
    	});
			}
	});
	}
}
//经办人签私章页面填写说明
doInstruction = function(id){
	var newOptions = ip.getCommonOptions({});
	var modifyFlag = false;// 新增问题共商返回false，修改共商用户返回true
	var data;
	var billIds = viewModel.buildBillIdAndNos(payGridViewModel.viewdetail.viewid, id,payGridViewModel);
	if(billIds.length!=1){
		ip.ipInfoJump("请选择一条数据", "info");
		return;
	}
	newOptions["data"]=JSON.stringify(billIds);
	 $.ajax({
			url : "/df/fi_fip/inspectdiscuss/queryInspectDataByEntityId.do",
			type : 'GET',
			dataType : 'json',
			async : false,
			data: newOptions,
			success : function(datas) {
				if(datas.dataDetail.length==0){
					ip.ipInfoJump("该单据不存在预警数据，不用填写说明", "info");
					return;
				}else if(datas.dataDetail.length>1){
					ip.ipInfoJump("该单据违反多条规则，请到监控数据查询处分别发起", "info");
		    		return;
				}else{
					if(datas.dataDetail[0].is_end == "1"){
					ip.ipInfoJump("该单据已审核完成，不能填写说明", "info");
		    		return;
					}
					data = datas.dataDetail;
					init("monitorModalDiscuss","monitorModalDiscussing" ,newOptions, data, modifyFlag,1);
				}
			}
		});
	
}
var createFlag = 0;
//经办人签私章控制规则
 queryRuleByWfNodeId = function(options){
	if(createFlag==0){
	createFlag = 1;
	viewModel.relErrorInfosViewModel = ip.createGrid('{01B84AB7-8CC9-4DA7-9DF0-79AEC62D0E72}', 'inspectRuleArea', "", discuss.options, 0, false, false, false, false);
	}
	viewModel.relErrorInfosViewModel.gridData.clear();
	var newOptions = options;
	 $.ajax({
			url : "/df/fi_fip/inspectdiscuss/queryRuleByWfNodeId.do",
			type : 'GET',
			dataType : 'json',
			async : false,
			data: newOptions,
			success : function(datas) {
				if(datas.dataDetail.length==0){
					ip.ipInfoJump("该节点没有挂接规则", "info");
					return;
				}else{
					data = datas.dataDetail;
					viewModel.relErrorInfosViewModel.gridData.addSimpleData(data,{unSelect:true});
					$("#inspectRuleModal").modal({
						backdrop : 'static',
						keyboard : false
					});
				}
			}
		});
	

}
 doInspectRelations = function(id){
		var newOptions = ip.getCommonOptions({});
		var data;
		var billIds = viewModel.buildBillIdAndNos(payGridViewModel.viewdetail.viewid, id,payGridViewModel);
		if(billIds.length!=1){
			ip.ipInfoJump("请选择一条数据", "info");
			return;
		}
		newOptions["uiId"] ='{A7A379C3-73BB-498E-9BFB-D603A3E7D92F}';
    	$.ajax({
			url : "/df/fi_fip/centerpay/queryUIDetail.do",
			type : "GET",
			dataType : "json",
			async : false,
			data:newOptions,
			success : function(data) {
				viewDetail =data.viewDetail;
			 
			 	newOptions["bill_id"]=billIds[0].id;
			 	$.ajax({
					url: "/df/fi_fip/inspectdiscuss/getFromMianGrid.do",
					type: 'GET',
					dataType: "json",
					 async: false,
					data: newOptions,
					success: function(data){
						if(data.flag){
							var treeGridData = {};
							
							treeGridData["rows"] = data.dataDetail;//控件需要rows
							
							$("#fromAndGoneModal").modal({
								backdrop : 'static',
								keyboard : false
							});
							createTreeGrid(viewDetail);
							$('#modifyFromGoneMianTreeGrid').treegrid('loadData',treeGridData);
							$("#fromAndGoneModal").on("shown.bs.modal",function(){
								
								$('#modifyFromGoneMianTreeGrid').treegrid("resize");
							})
							
						}else{
							ip.warnJumpMsg("数据请求失败", 0, 0, true);
						}
					}
				});
	}
});
	
 }
	//创建树表
	createTreeGrid=function(view){
		var columns = [];
		var viewHeader = view;
		for(var i = 0; i < viewHeader.length; i++){
			var item = {};
			item["field"] = viewHeader[i].id;
			item["title"] = viewHeader[i].name;
			item["width"] = viewHeader[i].width;
			if(viewHeader[i].disp_mode == "decimal"){
				item["align"] = 'right';
			}else{
				item["align"] = 'left';
			}
			if(viewHeader[i].visible != "true"){
				item["hidden"] = true;
			}
			columns.push(item);
		}
		$('#modifyFromGoneMianTreeGrid').treegrid({
			width:'100%',
			height: '100%',
			rownumbers: false,
			collapsible:true,
			fitColumns:true,
			method: 'get',
			idField:'sum_id',
			treeField:'file_name',
			showFooter:false,
			singleSelect: true,
			columns:[columns],
	        onClickCell :function(field,row, value){
	        },
			onBeforeExpand : function(row) {  
	        },
	        onClickRow: function(row) {
	        	$(this).treegrid("toggle", '1070880');
	        }
		});
	}
viewModel.buildBillIdAndNos  = function(tableViewId,id,model) {
	var payId;
	if (strIsNull(id)) {//id 为空
		if(objIsNotNull(model)){
			payId = model.gridData.getSimpleData({
				type : 'select',
				fields : [ 'id' ]
			});
		}else{//兼容model为空的情况
			payId = $('#' + tableViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.selectRows;
		}
	} else {
		var payData = $('#' + tableViewId.substring(1, 37) + '').parent()[0]['u-meta'].grid.getRowByIndex(id).value;
		payId = [];
		payId.push(payData);
	}
	return payId;
};
//预警弹窗建立共商按钮
 initDiscuss = function(inspectFlag){
	if(inspectFlag=="1"){
	var newOptions = ip.getCommonOptions({});
	var modifyFlag = false;// 新增问题共商返回false，修改共商用户返回true
	var tabObj=[];
	var data;
	var checked = $('input:checkbox[name=inspect]:checked');
	var listData = $('input:checkbox[name=inspect]');
	for(var j=0,size=checked.length;j<size;j++){
		var check= checked[j].value.split(";");
		var a = {
			"id" : check[0],
			"inspect_flag" : check[1],
			"inspect_rule_count":check[2]
			};
		tabObj.push(a);
	}
	if(tabObj.length!=1){
		ip.ipInfoJump("请选择一条预警数据", "info");
		return;
	}else{
		listCount = listData.length;
		if(tabObj[0].inspect_rule_count>1){
			ip.ipInfoJump("该单据违反多条规则，请到监控数据查询处分别发起", "info");
    		return;
		}
	}
	newOptions["data"]=JSON.stringify(tabObj);
		 $.ajax({
				url : "/df/fi_fip/inspectdiscuss/queryInspectDataByEntityId.do",
				type : 'GET',
				dataType : 'json',
				async : false,
				data: newOptions,
				success : function(datas) {
					if(datas.dataDetail.length>1){
						ip.ipInfoJump("该单据违反多条规则，请到监控数据查询处分别发起", "info");
			    		return;
					}else{
						if(datas.dataDetail[0].is_end == "1"){
						ip.ipInfoJump("该单据已审核完成，不能填写说明", "info");
			    		return;
						}
						data = datas.dataDetail;
						if("是"==data[0].is_discussed){
							init("monitorModalDiscuss","monitorModalDiscussing" ,newOptions, data, modifyFlag,1);
						}else{
							ip.warnJumpMsg("共商创建后，将与财政产生对话消息，用于上传相应证明材料，且此操作不可删除 ，是否继续?", "sid", "cCla");
							$("#sid").on("click", function() {
								$("#config-modal").remove();
								init("monitorModalDiscuss","monitorModalDiscussing" ,newOptions, data, modifyFlag,1);
							});
							$(".cCla").on("click", function() {
								$("#config-modal").remove();
							});
						}
					}
				}
			});
	}
}
//modifyFlag:区别是新增共商（true）还是修改共商用户（false），
//inspectFlag:区别是监控数据（0）还是支付数据（1）
	var init = function(contanier,contanierDiscussing,options,data,modifyFlag,inspectFlag) {
		 discuss.contanier = contanier;
		 discuss.contanierDiscussing = contanierDiscussing;
		 discuss.options = options;
		 discuss.modifyFlag = modifyFlag;
		 discuss.inspectFlag = inspectFlag;
		 discuss.selectData =data;
		var content =$("#"+contanier).html();
		if(content.length==0){
		$("#"+contanier).html("");
		$("#"+contanier).html(templete);
		 ko.cleanNode($("#"+contanier));
		 app = u.createApp({
			el : '#'+contanier, // 引用页面需要放置的一个容纳的div
			model : viewModel
		 });
		}else{
		  $("#discussUserArea").html("");
		  
		} 
		var contentDiscussing = $("#"+contanierDiscussing).html();
		if(contentDiscussing.length==0){
		 $("#"+contanierDiscussing).html("");
		 $("#"+contanierDiscussing).html(discussing);
		 ko.cleanNode($("#"+contanierDiscussing));
		 app = u.createApp({
			el : '#'+contanierDiscussing, // 引用页面需要放置的一个容纳的div
			model : viewModel
		 });
		}else{
			 $("#discussingArea").html("");
		}
		if(discuss.modifyFlag){
			doAddUser();
		}else{
			if(discuss.selectData.length!=1){
				ip.ipInfoJump("请选择一条数据发起共商！","info");
				return;
			}else{
				viewModel.discussingViewModel = ip.createGrid('{E978CBE8-07AA-409B-96DF-4BF50EC5777E}', 'discussingArea', "", discuss.options, 0, false, true, true, false);
				if(discuss.selectData[0].is_discussed =="是"){
					options["data"] = JSON.stringify(discuss.selectData);
					$.ajax({
						url: "/df/fi_fip/inspectdiscuss/checkDiscussIsExists.do",
				        type: "GET",
				        dataType: "json",
				        async: false,
				        data: discuss.options,
						success : function(datas) {
							sessionStorage.setItem("discuss_group_id",datas.dataDetail[0].discuss_group_id);
							sessionStorage.setItem("data", JSON.stringify(discuss.selectData));
							sessionStorage.setItem("discussTheme",datas.dataDetail[0].theme);
							window.parent.addTabToParent("问题共商", "/df/fi_fip/inspectDiscuss/inspectDiscuss.html?tokenid="+tokenid+"&ajax=1");
						}
					});
				}else if(discuss.selectData[0].is_discussed ==null||discuss.selectData[0].is_discussed ==""){
					doAddDiscuss();
				}
			}
		}
		initDiscussGroupListener();
     };
	
	return {
        'discuss': discuss,
        'init': init,
        'initDiscuss':initDiscuss,
        'queryRuleByWfNodeId':queryRuleByWfNodeId,
    };
});