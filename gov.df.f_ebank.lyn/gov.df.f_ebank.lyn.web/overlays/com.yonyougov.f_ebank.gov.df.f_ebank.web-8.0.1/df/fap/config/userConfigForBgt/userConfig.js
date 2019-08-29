require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip' ,'dateZH','md5'], function ($, ko) {
	window.ko = ko;
	var menuGuid = null;
	var ui_guid = null;
	var enableEle=[];
	var menuName = null;
	var count = 1;
	var passsec = "";
	//角色信息
	var roleCheck = {};
	//权限来源  0权限管理界面 1角色界面
	var ruleCheck ="0" ;
	//机构信息
	var orgtypeop = {};
	//新增修改判断 1新增 0修改
	var isNew = "1";
	var user_id = "";
	var rule_id="";
	//修改时保留用户密码
	var passwordold = "";
	var tokenid = ip.getTokenId();
	var menuViewModel = {
			data : ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						//左侧树事件
						var chr_id = node.chr_id;


						$.ajax({
							url: "/df/userConfig/usergrid.do?tokenid="+tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"chr_id":chr_id,"ajax":"noCache"},
							success: function (data) {
								menuViewModel.gridDataTable.removeAllRows();
								menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
								menuViewModel.gridDataTable.setRowUnSelect(0);
							}
						});
					}
				}
			},
			organTreeSetting:{
				view:{
					showLine:false,
					selectedMulti:false
				},
				check: {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "ps", "N": "ps" }
				}
			},
			roleTreeSetting:{
				view:{
					showLine:false,
					selectedMulti:false
				},
				check: {
					enable: true,
					chkStyle: "checkbox",
					chkboxType: { "Y": "ps", "N": "ps" }
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
			}),
			gridDataTable: new u.DataTable({
				meta: {
					'user_id':{},
					'user_code':{},
					'user_name':{},
					'nickname':{},
					'belong_type':{},
					'belong_org':{},
					'datarule':{},
					'security_level':{},
					'headship_code':{},
					'gender':{},
					'birthday':{},
					'address':{},
					'telephone':{},
					'mobile':{},
					'imsi':{},
					'imei':{},
					'is_black_list':{},
					'enabled':{},
					'use_lock':{},
					'auto_lock':{},
					'role_info':{},
					'orgname':{},
					'is_ever_locked':{}
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
			roleDataTable: new u.DataTable({
				meta: {
					'id': {
						'value':""
					},
					'parentid': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			comItems: [{
				"value": "001",
				"name": "系统管理员"
			}, {
				"value": "002",
				"name": "预算单位"
			}, {
				"value": "003",
				"name": "代理银行"
			}, {
				"value": "004",
				"name": "清算银行"
			}, {
				"value": "005",
				"name": "收入银行"
			}, {
				"value": "006",
				"name": "下级财政"
			},{
				"value": "007",
				"name": "业务处室"
			},{
				"value": "008",
				"name": "采购机构"
			}],
			comItems1: [{
				"value": "0",
				"name": "密码认证"
			}, {
				"value": "1",
				"name": "ca认证"
			}],
			comItems2: [{
				"value": "0",
				"name": "女"
			}, {
				"value": "1",
				"name": "男"
			}],
			comItems3: [{
				"value": "0",
				"name": "停用"
			}, {
				"value": "1",
				"name": "启用"
			}],
			comItems4: [{
				"value": "0",
				"name": "未锁定"
			}, {
				"value": "1",
				"name": "已锁定"
			}],
	};
	$.fn.datetimepicker.dates['zh-CN'] = {
			days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
			daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
			daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
			months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
			monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
			today: "今天",
			meridiem: ["上午", "下午"]
	};
	$('.form_date').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	});
	//左侧树初始化
	menuViewModel.getInitData = function () {
		$("#userorgtype").empty();
		$("#organSelectList").empty();
		getPara();
		$.ajax({
			url: "/df/userConfig/usertree.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				menuViewModel.treeDataTable.setSimpleData(data.dataDetail);
				orgtypeop = data.orgtype;
				dataselect = data.option;
				passsec = data.passsec;
				var ophtml = "";
				for(var k = 0 ; k < dataselect.length ; k++){
					ophtml = ophtml + "<option value='"+dataselect[k].orgtype_code+"'>"+dataselect[k].orgtype_code+"  "+dataselect[k].orgtype_name+"</option>";
				}
				$("#userorgtype").append(ophtml);
				$("#organSelectList").append(ophtml);
			} 
		});
	}

	//新增按钮事件
	menuViewModel.addbtnSubmit = function () {
		clearAll();
		isNew = "1";
		user_id = "";
		$("#myModalLabelnew").text("新增用户");
		$("#addModal").modal({backdrop: 'static', keyboard: false});
	}
	//修改按钮事件
	menuViewModel.editbtnSubmit = function () {


		$("#myModalLabelnew").text("修改用户");
		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		clearAll();
		isNew = "0";
		if(selRows.length == 0){
			ip.ipInfoJump("请选择需要修改的用户","info");
			return;
		}
		if(selRows.length > 1){
			ip.ipInfoJump("请不要选择一个以上用户","info");
			return;
		}

		user_id = selRows[0].data.user_id.value;
		var user_code = selRows[0].data.user_code.value;
		var user_name = selRows[0].data.user_name.value;
		var nickname = selRows[0].data.nickname.value;
		var belong_type = selRows[0].data.belong_type.value;
		var belong_org = selRows[0].data.belong_org.value;
		var security_level = selRows[0].data.security_level.value;
		var gender = selRows[0].data.gender.value;
		var birthday = selRows[0].data.birthday.value;
		var org_type = selRows[0].data.org_type.value;
		var mobile = selRows[0].data.mobile.value;
		var imsi = selRows[0].data.imsi.value;
		var imei = selRows[0].data.imei.value;
		var enabled = selRows[0].data.enabled.value;
		var role_info = selRows[0].data.role_info.value;
		passwordold = selRows[0].data.password.value;
		var identity_card = selRows[0].data.identity_card.value;
		if(gender == "1"){
			$("input[name='optionsRadios']").eq(0).prop("checked", true);
		}else{
			$("input[name='optionsRadios']").eq(1).prop("checked", true);
		}
		$("#usercode").val(user_code);
		$("#username").val(user_name);
		$("#nickname").val(nickname);
		$("#birthday").val(birthday);
		$("#identity_card").val(identity_card);
		$("#mobile").val(mobile);
		$("#imsi").val(imsi);
		$("#imei").val(imei);
		$("#mobile").val(mobile);

		$("#addModal").modal({backdrop: 'static', keyboard: false});
		if(enabled == "1"){
			$('#enabled').eq(0).prop("checked",true);
		}else{
			$('#enabled').eq(0).prop("checked",false);
		}
		$("#security_level").val(security_level);
		if(org_type != "009"){
			$("#organSelectList").val(org_type);
		}else{
			$("#organSelectList").val("009");
			org_type = "002";
		}
		$("#userorgtype").val(belong_type);
		var userorgtype = $("#userorgtype").val();
		var elecode = orgtypeop[userorgtype];
		$('#beloneorg-span').unbind("click"); 

		if(elecode != "" && elecode != null){
			$("#belon-star").show();
			if(userorgtype != "009"){
				$("#beloneorg-span").click(function(){
					ip.showAssitTree('beloneorg',elecode,'0',{},'',orgtypeop[userorgtype+"name"]);
				});
			}else{
				$.ajax({
					url: "/df/agencymb/AgencyMbTree.do?tokenid="+tokenid,
					type: 'GET',
					dataType: 'json',
					data: {"ajax":"noCache"},
					success: function (data) {
						$("#beloneorg-span").click(function(){
							ip.treeChoice('beloneorg',data.dataDetail,'0',{},'',orgtypeop[userorgtype+"name"],false);
						});
					}
				});
			}
		}else{
			$("#belon-star").hide();
		}
		$.ajax({
			url: "/df/userConfig/initMessage.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache","user_id":user_id,"org_type":org_type , "belontype":belong_type ,"belonorg":belong_org },
			success: function (data) {
				//角色界面修改初始化
				var roleinfo = data.roleinfo;
				var addhtml = "";
				//基本设置修改初始化
				var dataorg = data.dataorg;
				if("001" != belong_type){
					$("#beloneorg").val(dataorg[0].chr_code + " "+ dataorg[0].chr_name);
					$("#beloneorg-h").val(dataorg[0].chr_id + "@"+ dataorg[0].chr_name+ "@"+dataorg[0].chr_code);
				}
				roleCheck={};
				for(var i=0; i<roleinfo.length; i++){
					addhtml += "<li id='"+roleinfo[i].role_id+"'><span class='glyphicon glyphicon-list-alt list-icon-color'></span><span class='ulroleSelectedRight-text'>"+roleinfo[i].role_name+"</span></li>";
					var roleMassage1 = {};
					var check = roleinfo[i].is_defined;
					roleMassage1["Check"] = check;
					roleMassage1["roleName"] = roleinfo[i].role_name;
					if(check != 0){
						var roleMassage = data[roleinfo[i].rule_id];
						roleMassage1["name"] = roleMassage.name;
						roleMassage1["id"] = roleinfo[i].rule_id;
						roleMassage1["treedata"] = roleMassage.treedata;
						roleMassage1["data"] = "1";
					}
					roleCheck[roleinfo[i].role_id] = roleMassage1;
				}

				$("#ulroleSelectedRight").html("");
				$("#ulroleSelectedRight").append(addhtml);

				//数据权限界面修改初始化
				var sysruledata = data.sysruledata;
				var rule_name =  data.rule_name;
				var sysrule =  data.sysrule;
				menuViewModel.rightDetaileDataTable.setSimpleData(sysruledata);
				var treeObj = $.fn.zTree.getZTreeObj("rightDetaile"); 
				treeObj.expandAll(true);
				$("#dataRightInput").val(rule_name);
				$("#dataRightInput").attr("name",sysrule);

				//机构权限界面修改初始化
				var orgtreedate = data.datadetail;
				menuViewModel.organRightDataTable.setSimpleData(orgtreedate);
				var selectRoles = data.userOrglist;
				var allRoletreeObj = $.fn.zTree.getZTreeObj("oragn-tree");
				if(selectRoles != null && selectRoles != ""){
					for(var i=0; i<selectRoles.length; i++){
						var id = selectRoles[i].org_id;
						var search_nodes = allRoletreeObj.getNodesByParam("id",id,null);
						if(!search_nodes[0].isParent)
							allRoletreeObj.checkNode(search_nodes[0], true, true);
						allRoletreeObj.expandNode(search_nodes[0].getParentNode(), true, true, true);
					}
				}
				


			} 
		});
	}
	//删除按钮事件
	menuViewModel.delbtnSubmit = function () {
		var selRows = menuViewModel.gridDataTable.getSelectedRows(); 
		if(selRows.length == 0){
			ip.ipInfoJump("请选择删除的数据","info");
			return;
		}


		ip.warnJumpMsg("真的要删除吗?","sid1","cCla1");
		$("#sid1").on("click",function(){
			$("#config-modal").remove();
			var allid = "";
			for(var k = 0 ; k < selRows.length ; k++){
				var user_id = selRows[k].data.user_id.value;
				allid = user_id + "@"+allid;
			}

			$.ajax({
				url: "/df/userConfig/deleteUser.do?tokenid="+tokenid,
				type: "POST",
				data: {
					"ajax": "1",
					"user_id":allid
				},
				success: function(data){
					ip.ipInfoJump("删除成功!","info");
					refreshgrid();
				}
			});
		});
		$(".cCla1").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		})
	}
	//表格刷新
	function refreshgrid(){


		var allRoletreeObj = $.fn.zTree.getZTreeObj("user-tree1");
		var chr_id = allRoletreeObj.getSelectedNodes()[0].chr_id;
		if(chr_id == null || chr_id ==""){
			return;
		}
		$.ajax({
			url: "/df/userConfig/usergrid.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"chr_id":chr_id,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.gridDataTable.removeAllRows();
				menuViewModel.gridDataTable.setSimpleData(data.dataDetail);
				menuViewModel.gridDataTable.setRowUnSelect(0);
			}
		});
	}
	//锁定按钮事件
	menuViewModel.lockbtnSubmit = function () {


		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择要锁定的数据","info");
			return;
		}
		var allid = "";
		var errorMessage = "";
		for(var k = 0 ; k < selRows.length ; k++){
			if(selRows[k].data.is_ever_locked.value == "0"){
				var user_code = selRows[k].data.user_code.value;
				var codeEnd = user_code.substring(6,9);
				if(user_code.length == 9 && codeEnd == "999"){
					ip.ipInfoJump("不能锁定'xxxxxx999'的用户","info");
				}else{
					var user_id = selRows[k].data.user_id.value;
					allid = user_id + "@"+allid;
				}

			}
			else{
				var user_code = selRows[k].data.user_code.value;
				var user_name = selRows[k].data.user_name.value;
				errorMessage = user_code + " "+ user_name +"@"+errorMessage;
			}
		}
		if(errorMessage != "" && errorMessage != null){
			var len = errorMessage.length;
			var errstr = errorMessage.substring(0,len-1);
			var errstrnew = errstr.replaceAll("@","和");
			ip.ipInfoJump("选择的"+errstrnew + "已经被锁定","info");
		}
		if(allid == "" || allid == null){
			return;
		}
		$.ajax({
			url: "/df/userConfig/locked.do?tokenid="+tokenid,
			type: "POST",
			data: {
				"ajax": "1",
				"user_id":allid
			},
			success: function(data){
				if(data.flag == "1"){
					ip.ipInfoJump("成功锁定"+data.num +"条用户","info");
					refreshgrid();
				}
			}
		});
	}
	//解锁事件
	menuViewModel.unlockbtnSubmit = function () {


		var selRows = menuViewModel.gridDataTable.getSelectedRows();
		if(selRows.length == 0){
			ip.ipInfoJump("请选择要解锁的数据","info");
			return;
		}
		var allid = "";
		var errorMessage = "";
		for(var k = 0 ; k < selRows.length ; k++){
			if(selRows[k].data.is_ever_locked.value == "1"){

				var user_id = selRows[k].data.user_id.value;
				allid = user_id + "@"+allid;

			}
			else{
				var user_code = selRows[k].data.user_code.value;
				var user_name = selRows[k].data.user_name.value;
				errorMessage = user_code + " "+ user_name +"@"+errorMessage;
			}
		}
		if(errorMessage != "" && errorMessage != null){
			var len = errorMessage.length;
			var errstr = errorMessage.substring(0,len-1);
			var errstrnew = errstr.replaceAll("@","和");
			ip.ipInfoJump("选择的"+errstrnew + "未被锁定","info");
		}

		$.ajax({
			url: "/df/userConfig/unlocked.do?tokenid="+tokenid,
			type: "POST",
			data: {
				"ajax": "1",
				"user_id":allid
			},
			success: function(data){
				if(data.flag == "1"){
					ip.ipInfoJump("成功解锁"+data.num +"条用户","info");
					refreshgrid();
				}
			}
		});
	}

//	获取权限组
	menuViewModel.getRightGroup = function(){
		var tokenid = ip.getTokenId();
		ruleCheck = "0";
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
					menuViewModel.dataTableRuleGroup.setSimpleData(data.groupList);
				}

			}
		});
		$("#selectAuthModal").modal("show");
	};

	menuViewModel.getRightGroup1 = function(){
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
					menuViewModel.dataTableRuleGroup.setSimpleData(data.groupList);
				}

			}
		});
		$("#selectAuthModal").modal("show");
	};

	var val = "";
	quickQuery = function (){  
		var user_write = $("#quickquery").val();
		if(val == user_write){
			return;
		}
		val = user_write;
		var data_tree = $("#user-tree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].id;
			}else{
				menuGuid = null;
			}
		}
		$("#quickquery").focus();
		i = 1;

	}

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
		if(data_tree.getSelectedNodes().length>0){
			if(!data_tree.getSelectedNodes()[0].isParent){
				menuGuid = data_tree.getSelectedNodes()[0].id;
			}else{
				menuGuid = null;
			}
		}
		$("#quickquery").focus();
	}

	menuViewModel.delDataRight = function(){
		ip.warnJumpMsg("确定要删除吗?","okDelRightDatabtn","cancle");
		$("#okDelRightDatabtn").click(function(){
			//alert("清空输入框删除下面的树的数据");
			$("#dataRightInput").val("");
			$("#config-modal").remove();
			$("#dataRightInput").attr("name","");
			menuViewModel.rightDetaileDataTable.removeAllRows();
		});
		$(".cancle").click(function(){
			$("#config-modal").remove();
		});
	};

//	添加角色弹窗
	menuViewModel.showAddRolesModal = function(){
		var tokenid = ip.getTokenId();
		$.ajax({
			url: "/df/userConfig/findrole.do?tokenid="+tokenid,
			type: "GET",
			data: {
				"ajax": "1"
			},
			success: function(data){
				if(data != null){
					menuViewModel.roleDataTable.setSimpleData(data.datadetail);
					var treeObj = $.fn.zTree.getZTreeObj("addRoletree3");
					var nodes = treeObj.getCheckedNodes();
					for(var i= 0; i < nodes.length; i++){
						if(nodes[i].isParent){
							treeObj.setChkDisabled(nodes[i], true);
						}
					}

					var selectRoles = $("#ulroleSelectedRight li");
					if(selectRoles != null){
						for(var i=0; i<selectRoles.length; i++){
							var id = selectRoles.eq(i).attr("id");
							var allRoletreeObj = $.fn.zTree.getZTreeObj("addRoletree3");
							var search_nodes = allRoletreeObj.getNodesByParam("id",id,null);
							allRoletreeObj.checkNode(search_nodes[0], true, true);
						}
					}
					$("#addRoleModal").modal("show");
				}else{
					ip.ipInfoJump("服务器繁忙，请稍等!","info");
				}
			}
		});
	};

	/*
	 * 删除角色（选中父级，子集也会删除）
	 */
	menuViewModel.delRole = function(){
		var selectRole = $("#ulroleSelectedRight li .select-role-active");
		if(selectRole.length == 0){
			ip.ipInfoJump("请选择要删除的角色","error");
		}else{
			ip.warnJumpMsg("确定要删除吗?","okDelRolebtn","cancle");
			$("#okDelRolebtn").click(function(){
				//alert("请求后端的删除接口");
				var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
				delete(roleCheck[id]);
				$("#ulroleSelectedRight li .select-role-active").parent().find(".list-icon-color").remove();
				$("#ulroleSelectedRight li .select-role-active").parent().remove();
				$("#config-modal").remove();
				$("input[name='optionsRadios1']").eq(0).prop("checked", true);
				$("#optionsRadios4").attr("disabled",true);
				$("#optionsRadios3").attr("disabled",true);
				$("#checkbtn").attr("disabled",true);
				menuViewModel.rightDetaileDataTable1.removeAllRows();
				$("#dataRightInput2").val("");
			});
			$(".cancle").click(function(){
				$("#config-modal").remove();
			});
		}
	};
//	新增权限组按钮事件-开始
	menuViewModel.addGroup = function() {
		create_type="newrule";
		edit_type="new";
		//alert("sadada");
		$("#rule_code").attr("disabled",false);
		$("#rule_code").val("");
		$("#rule_name").val("");
		$("#remark").val("");

		//$("#rightModal .modal-dialog").css("z-index","9999");
		$("#rightModal").modal("show");
		showRightModal();

	};

//	显示每个权限组的详细信息
	menuViewModel.showRightDetail = function(){
		var tokenid = ip.getTokenId();
		var rule_id ="";
		//var rule_id = $("#rightList li span.group-active").parent().attr("id");
		var treeObjRule = $.fn.zTree.getZTreeObj("ruleTree1");
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
						if(ruleCheck == "0"){
							menuViewModel.rightDetaileDataTable.setSimpleData(data.rows);
							var treeObj = $.fn.zTree.getZTreeObj("rightDetaile"); 
							treeObj.expandAll(true);
							$("#dataRightInput").val(nodesRule[0].name);
							$("#dataRightInput").attr("name",nodesRule[0].id);
							$("#selectAuthModal").modal("hide");
						}else{
							menuViewModel.rightDetaileDataTable1.setSimpleData(data.rows);
							var treeObj = $.fn.zTree.getZTreeObj("rightDetaile1"); 
							var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
							var roleMessage = roleCheck[id];
							roleMessage["treedata"] = data.rows;
							roleMessage["name"] = nodesRule[0].name;
							roleMessage["id"] = nodesRule[0].id;
							roleMessage["data"] = "1";
							treeObj.expandAll(true);
							$("#dataRightInput2").val(nodesRule[0].name);
							$("#dataRightInput2").attr("name",nodesRule[0].id);
							$("#selectAuthModal").modal("hide");
						}
					}
				}

			});
		}else{
			ip.ipInfoJump("请选择","info");
		}
	};
	//弹出框确定按钮事件
	menuViewModel.userSave = function(){
		var dataoptions = {};
		var usercode = $("#usercode").val();
		dataoptions["user_code"]=usercode;
		if(usercode == null || $.trim(usercode) == ""){
			ip.ipInfoJump("用户编码不可为空","error");
			return;
		}
		var usernewcode = usercode.match("[\\w-_\u4e00-\u9fa5]+")[0];
		if(usernewcode != usercode){
			ip.ipInfoJump("用户编码只允许汉字、字母、数字、中横杠-、下横杠_!","info");
			return;
		}

		var username = $("#username").val();
		dataoptions["user_name"]=username;
		if(username == null || $.trim(username) == ""){
			ip.ipInfoJump("用户名称不可为空","info");
			return;
		}

		if(isNew == "1"){
			var password = $("#password").val();
			dataoptions["password"]=hex_md5(password);
			if(password == null || $.trim(password) == ""){
				ip.ipInfoJump("用户密码不可为空","error");
				return;
			}
			var confirmpsd = $("#confirmpsd").val();
			if(password != confirmpsd){
				ip.ipInfoJump("两次密码不一致","error");
				return;
			}
		}else{
			var password1 = $("#password").val();
			var password = hex_md5(password1);
			if(password1 == null || password1 == ""){
				dataoptions["password"]=passwordold;
			}else{
				var confirmpsd = $("#confirmpsd").val();
				if(password1 != confirmpsd){
					ip.ipInfoJump("两次密码不一致","error");
					return;
				}
				dataoptions["password"] = password;
			}
		}

		if(passsec != "" && passsec != null ){
			if(parseInt(passsec) > count){
				ip.ipInfoJump("密码安全级别不够！","error");
				return;
			}
		}

		var imsi = $("#imsi").val();
		dataoptions["imsi"]=imsi;
		if(imsi != null && $.trim(imsi) != ""){
			if(imsi.length != 15 ){
				ip.ipInfoJump("手机IMSI必须为15位！","error");
				return;
			}
		}
		var imei = $("#imei").val();
		dataoptions["imei"]=imei;
		if(imei != null && $.trim(imei) != ""){
			if(imei.length != 15 ){
				ip.ipInfoJump("手机IMEI必须为15位！","error");
				return;
			}
		}

		var identity_card = $("#identity_card").val();
		dataoptions["identity_card"]=identity_card;
		if(identity_card != null && $.trim(identity_card) != ""){
			var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
			if(reg.test(identity_card) == false)  
			{  
				ip.ipInfoJump("身份证输入不合法","error");  
				return;  
			}
		}
		var organSelectList = $("#organSelectList").val();
		dataoptions["organSelectList"]=organSelectList;
		var userorgtype = $("#userorgtype").val();
		dataoptions["belong_type"]=userorgtype;
		var beloneorg = $("#beloneorg-h").val();
		if(userorgtype != "001"){
			if(beloneorg == null || $.trim(beloneorg) == ""){
				ip.ipInfoJump("用户所属不能为空","error");
				return;
			}else{
				var bl_org = beloneorg.split("@");
				dataoptions["belong_org"]=bl_org[0];
			}
		}
		var security_level = $("#security_level").val();
		dataoptions["security_level"]=security_level;
		var enabled = "1";
		if(!$('#enabled').is(':checked')){
			enabled = "0";
		} 
		dataoptions["enabled"]=enabled;
		var birthday = $("#birthday").val();
		dataoptions["birthday"]=birthday;
		var nickname = $("#nickname").val();
		dataoptions["nickname"]=nickname;
		var mobile = $("#mobile").val();
		dataoptions["mobile"]=mobile;
		var gender = $("input[name='optionsRadios']:checked")[0].id;
		dataoptions["isNew"] = isNew;
		dataoptions["user_id"] = user_id;
		dataoptions["gender"]=gender;
		dataoptions["ajax"]="noCache";
		var treeObj = $.fn.zTree.getZTreeObj("oragn-tree");
		var nodes = treeObj.getCheckedNodes();
		var org_id = "";
		for(var i= 0; i < nodes.length; i++){
				org_id = nodes[i].chr_id +"@" + org_id;
		}
		if(org_id == "" && userorgtype != "001"){
		
		}
		dataoptions["org_id"] = org_id;
		var ruleId = $("#dataRightInput")[0].name;
		if(ruleId == ""){
			ruleId = "187";
		}
		dataoptions["ruleId"]=ruleId;
		dataoptions["roleMessage"]=JSON.stringify(roleCheck);
		var tokenid = ip.getTokenId();
		$.ajax({
			url: "/df/userConfig/addUser1.do?tokenid="+tokenid,
			type: "POST",
			data: dataoptions,
			success: function(data){
				var flag = data.flag;
				if(flag == "1"){
					if(isNew == "1"){
						ip.ipInfoJump("插入成功！","success");
					}else{
						ip.ipInfoJump("修改成功！","success");
					}
					$("#addModal").modal('hide');
					var data_tree = $("#user-tree1")[0]['u-meta'].tree;
					var search_nodes = null;
					if(userorgtype != "001"){
						var bl_org = beloneorg.split("@");
						search_nodes = data_tree.getNodesByParam("id",userorgtype+bl_org[0],null);
					}else{
						search_nodes = data_tree.getNodesByParam("id",userorgtype,null);
					}
					data_tree.selectNode(search_nodes[0]);
					refreshgrid();
				}else{
					if(isNew == "1"){
						ip.ipInfoJump(data.message,"error");
					}else{
						ip.ipInfoJump(data.message,"error");
					}
				}
			},
			error: function(data){
				if(isNew == "1"){
					ip.ipInfoJump("插入失败！"+data.message,"error");
				}else{
					ip.ipInfoJump("修改失败！"+data.message,"error");
				}
			}
		});
	};
	//弹出初始化
	function clearAll(){
		$("#homes").find("input").val("");
		var a = document.getElementById("userorgtype");
		if(a.options[a.selectedIndex])
			a.options[a.selectedIndex].removeAttribute("selected");
		var b = document.getElementById("security_level");
		if(b.options[b.selectedIndex])
			b.options[b.selectedIndex].removeAttribute("selected");
		var c = document.getElementById("organSelectList");
		c.options[c.selectedIndex].removeAttribute("selected");
		$("#userorgtype").val("001");
		$("#security_level").val("0");
		$("#organSelectList").val("001");
		$('#beloneorg-span').unbind("click"); 
		$("input[name='optionsRadios']").eq(0).prop("checked", true);
		$('#enabled').eq(0).prop("checked",true);
		$("#psdstrth").text("");
		$("#dataRightInput2").val("");
		$("#dataRightInput").val("");
		$("#ulroleSelectedRight").html("");
		menuViewModel.rightDetaileDataTable1.removeAllRows();
		menuViewModel.rightDetaileDataTable.removeAllRows();
		menuViewModel.organRightDataTable.removeAllRows();
		roleCheck = {};
		$("#myTabs").find("li").removeClass("active");
		$("#jbsz").addClass("active");
		$("#profile").removeClass("active");
		$("#messages").removeClass("active");
		$("#settings").removeClass("active");
		$("#homes").addClass("active");
		$("input[name='optionsRadios1']").eq(0).prop("checked", true);
		$("#optionsRadios4").attr("disabled",true);
		$("#optionsRadios3").attr("disabled",true);
		$("#checkbtn").attr("disabled",true);
		$("#dataRightInput2").val("");
	}

	menuViewModel.rightModelCloseButton = function(){
		$("#rightModal").modal("hide");
	};

	menuViewModel.showYLModelDialog=  function() {
		$("#ylModal").show();
		showYLModal();
	}

	menuViewModel.drCloseButton = function(){
		$("#ylModal").hide();
	};
	//角色添加弹出确定按钮事件
	menuViewModel.getSelectRoleTree = function(){
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
		var addhtml="";
		for(var i=0; i<nodes.length; i++){
			addhtml += "<li id='"+nodes[i].id+"'><span class='glyphicon glyphicon-list-alt list-icon-color'></span><span class='ulroleSelectedRight-text'>"+nodes[i].name+"</span></li>";
			if(roleCheckold[nodes[i].id] == null){ 
				var roleMessage = {};
				roleMessage["Check"] = "0";
				roleMessage["roleName"] = nodes[i].name;
				roleCheck[nodes[i].id] = roleMessage;
			}else{
				roleCheck[nodes[i].id] = roleCheckold[nodes[i].id];
			}
		}

		$("#ulroleSelectedRight").html("");
		$("#ulroleSelectedRight").append(addhtml);
		$("input[name='optionsRadios1']").eq(0).prop("checked", true);
		$("#optionsRadios4").attr("disabled",true);
		$("#optionsRadios3").attr("disabled",true);
		menuViewModel.rightDetaileDataTable1.removeAllRows();
		$("#dataRightInput2").val("");
		$("#addRoleModal").modal("hide");
		roleCheckold = null;
	};
	//预览按钮事件
	function showYLModal(){

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
	}

	menuViewModel.rightSure = function() {
		//alert(rule_id);
		create_type="newrule";
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
					var tokenid = ip.getTokenId();
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
								menuViewModel.dataTableRuleGroup.setSimpleData(dataRes.groupList);

								var nodesName=rule_code+" "+ rule_name;
								var data_tree = $("#ruleTree1")[0]['u-meta'].tree;
								var search_nodes = data_tree.getNodesByParamFuzzy("name",nodesName,null);
								data_tree.selectNode(search_nodes[0]);
							}

						}
					});

					//选中操作

					ip.ipInfoJump("保存成功！","success");
					$("#rightModal").modal("hide");
				}
				else if(data.result == "fail"){
					ip.ipInfoJump(data.reason,"error");
				}
			}
		});
	};
	function showRightModal(){



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
					var myTabContent=$("#myTabContent1");
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
						$("#myTabContent1 .tab-pane").eq(index).append(treeDom);
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

	userDefinedClick = function(){
		var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
		var roleMessage = roleCheck[id];
		roleMessage["Check"] = "1";
		$("#checkbtn").removeAttr("disabled");
		var havedata = roleMessage["data"];
		if(havedata == "1"){
			var treeObj = $.fn.zTree.getZTreeObj("rightDetaile1"); 
			var datarow = roleMessage["treedata"];
			var nodename = roleMessage["name"];
			var nodeid = roleMessage["id"];
			menuViewModel.rightDetaileDataTable1.setSimpleData(datarow);
			$("#dataRightInput2").val(nodename);
			$("#dataRightInput2").attr("name",nodeid);
		}
	}

	allClick  = function(){
		var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
		var roleMessage = roleCheck[id];
		roleMessage["Check"] = "0";
		menuViewModel.rightDetaileDataTable1.removeAllRows();
		$("#dataRightInput2").val("");
		$("#checkbtn").attr("disabled",true);
	}
	orgTypeChange = function(obj){
		var orgtype = obj.val();
		if(orgtype == "009"){
			orgtype = "002";
		}


		$.ajax({
			url: "/df/userConfig/findEleCodeByOrgtypeCode.do?tokenid="+tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"orgtype":orgtype,"ajax":"noCache"},
			success: function (data) {
				menuViewModel.organRightDataTable.setSimpleData(data.datadetail);
			}
		});
	}

	getPara = function() {
		var current_url = location.search;
		var params = (current_url || "").split('&');
		for(var i = 0; i < params.length; i++){
			if(params[i].toLowerCase().indexOf("test=") > -1){
				return (params[i].split('=')[1]);
			}
		}
		return "";
	}

//	动态生成树的方法----开始
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
		var app = u.createApp({
			el: '#'+id,
			model: viewModel
		});
		viewModel.treeDataTable.setSimpleData(data);

	}
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		$('.form_date').datetimepicker({
			language:  'zh-CN',
			weekStart: 1,
			todayBtn:  1,
			autoclose: 1,
			todayHighlight: 1,
			startView: 2,
			minView: 2,
			forceParse: 0
		});
		$("#password").change(function(){
			var passWord = $("#password").val();
//			var arr=password.match(/./g); 
			var isNumber = false;
			var isupperChar = false;
			var isChar = false;
			var isSpecial = false;
			count = 1;
			if (passWord == null || $.trim(passWord) == "") {
				ip.ipInfoJump("密码不可为空","error");
				$("#psdstrth").text("");
				return;
			} else if (passWord.length < 5) {
				$("#psdstrth").text("【极弱】");
				return;
			}

			for (var i = 0; i < passWord.length; i++) {
				if (passWord.charCodeAt(i) > 47 && passWord.charCodeAt(i) < 58 && !isNumber) {
					count = count + 1;
					isNumber = true;
				} else if (passWord.charCodeAt(i) > 64 && passWord.charCodeAt(i) < 97 && !isupperChar) {
					count = count + 1;
					isupperChar = true;
				} else if (passWord.charCodeAt(i) > 96 && passWord.charCodeAt(i) < 123 && !isChar) {
					count = count + 1;
					isChar = true;
				} else if ((passWord.charCodeAt(i) < 48 || (passWord.charCodeAt(i) > 57 && passWord.charCodeAt(i) < 65) || passWord.charCodeAt(i) > 122)
						&& !isSpecial) {
					count = count + 1;
					isSpecial = true;
				}
			}

			if(count == 1)
				$("#psdstrth").text("【极弱】");
			else if(count ==2)
				$("#psdstrth").text("【弱】");
			else if(count ==3)
				$("#psdstrth").text("【中】");
			else if(count ==4)
				$("#psdstrth").text("【强】");
			else if(count ==5)
				$("#psdstrth").text("【极强】");
			else
				$("#psdstrth").text("【极弱】");
		});

		$("#confirmpsd").change(function(){
			var passWord = $("#password").val();
			var confirmpsd = $("#confirmpsd").val();
			if(passWord != confirmpsd){
				ip.ipInfoJump("两次密码不一致","error");
				$("#confirmpsd").addClass("has-dif");
			}else{
				$("#confirmpsd").removeClass("has-dif");
			}
		});

		$("#userorgtype").change(function(){
			var userorgtype = $("#userorgtype").val();
			var elecode = orgtypeop[userorgtype];
			$('#beloneorg').val("");
			$('#beloneorg-h').val("");
			$("#organSelectList").val(userorgtype);
			orgTypeChange($("#organSelectList"));
			$('#beloneorg-span').unbind("click"); 
			if(elecode != "" && elecode != null){
				$("#belon-star").show();
				if(userorgtype != "009"){
					$("#beloneorg-span").click(function(){
						ip.showAssitTree('beloneorg',elecode,'0',{},'',orgtypeop[userorgtype+"name"]);
					});
				}else{
					$.ajax({
						url: "/df/agencymb/AgencyMbTree.do?tokenid="+tokenid,
						type: 'GET',
						dataType: 'json',
						data: {"ajax":"noCache"},
						success: function (data) {
							$("#beloneorg-span").click(function(){
								ip.treeChoice('beloneorg',data.dataDetail,'0',{},'',orgtypeop[userorgtype+"name"],false);
							});
						}
					});

				}
			}else{
				$("#belon-star").hide();
			}
		});

		$("#ulroleSelectedRight").on("click","li",function(){
			$("#ulroleSelectedRight li .ulroleSelectedRight-text").removeClass("select-role-active");
			$(this).find(".ulroleSelectedRight-text").addClass("select-role-active");
			$("#optionsRadios4").removeAttr("disabled");
			$("#optionsRadios3").removeAttr("disabled");
			menuViewModel.rightDetaileDataTable1.removeAllRows();
			$("#dataRightInput2").val("");
			var id = $("#ulroleSelectedRight span.select-role-active").parent().attr("id");
			var roleMessage = roleCheck[id];
			var check = roleMessage["Check"];
			if(check == "0"){
				$("input[name='optionsRadios1']").eq(0).prop("checked", true);
				$("#checkbtn").attr("disabled",true);
			}else{
				$("input[name='optionsRadios1']").eq(1).prop("checked", true);
				$("#checkbtn").removeAttr("disabled");
				var havedata = roleMessage["data"];
				if(havedata == "1"){
					var treeObj = $.fn.zTree.getZTreeObj("rightDetaile1"); 
					var datarow = roleMessage["treedata"];
					var nodename = roleMessage["name"];
					var nodeid = roleMessage["id"];
					menuViewModel.rightDetaileDataTable1.setSimpleData(datarow);
					$("#dataRightInput2").val(nodename);
					$("#dataRightInput2").attr("name",nodeid);
				}
			}

		});
		menuViewModel.getInitData();
		$("#basemsg").click(function(){
			$("#info1").slideToggle("slow");
		});
		$("#basemsg1").click(function(){
			$("#info2").slideToggle("slow");
		});

	});

	$(function(){
		$.fn.extend({
//			不能有特殊字符只能由数字、大小写字母组成
			cbSpecialCharacter:function(){
				var str = /[A-Za-z0-9]$/;
				var str1 = /[\u4e00-\u9fa5\!\.@#\$%\^&\*\(\)\[\]\\?\\\/\|\-~`\+\=\,\r\n\:\'\"。，；……！￥\{\}]/g;
				baseValidate(str,this,str1);
				return this;
			},
//			身份证号
			cbCard:function(){
				var str = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[0-9Xx]$/;
				var msg = "请正确填写CA编码！";
				blurValidate(str,this,msg);
				return this;
			},
//			电话号码
			cbPhone:function(){
				var str = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
				var msg = "请正确填写手机号码！";
				blurValidate(str,this,msg);
				return this;
			},
//			邮箱
			cbEmail:function(){
				var str = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
				var msg = "请正确填写邮箱！";
				blurValidate(str,this,msg);
				return this;
			},
//			日期
			cbTime:function(){
				var str = /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)$/;
				var msg = "日期格式不正确";
				blurValidate(str,this,msg);
				return this;
			}

		})
	});
	function baseValidate(str,baseThis,str1){
		baseThis.each(function(){
			$(this).keyup(function(){
				var _thisValue = $(this).val();
				if (str.test(_thisValue) == false){
					var va = _thisValue.replace(str1,"");
					$(this).val(va);
				}else{
					$(this).val(_thisValue);
				}

			});
		});
	};
	function blurValidate(str,baseThis,msg){
		baseThis.each(function(){
			$(this).blur(function(){
				var _thisValue = $(this).val();
				var _thisNum = _thisValue.length-1;
				if(_thisValue == "" || _thisNum =='-1'){
					$(this).val('');
				}else{
					if (str.test(_thisValue) == false){
						$(this).val("");
						$(this).attr("placeholder",msg);
						ip.ipInfoJump(msg,"error");  
					}
				}
			});
		});
	};
//	$('#identity_card').cbCard();
	$('#birthday').cbTime();
});
