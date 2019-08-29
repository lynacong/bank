require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
		function ($, ko) {
	window.ko = ko;
	var ele_source_value;
	var actionflag = 0;// 0为默认值，1为保存，2为修改
	var viewModel = {
			startDateVal: ko.observable(),//起始时间
			endDateVal: ko.observable(),//终止时间
			enabled: [{
				"value": "1",
				"name": "启用"
			}, {
				"value": "0",
				"name": "禁用"
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
			accountTypeDataSetting:{
				view:{
					showLine:false,
					selectedMulti:false
				},
				callback:{
					onClick:function(e,id,node){
						viewModel.getAccountListByID(node.id);
						$("#query-account-son-type").val(node.chr_name);
						$("#query-account-type").val(viewModel.getParentAccountType(node.chr_name.split(" ")[0]));

					}
				}
			},
			agencyDataTreeSetting:{
				view:{
					showLine:false,
					selectedMulti:false
				},
				callback:{
					onClick:function(e,id,node){
						viewModel.getAccountListByAgency();
						var treeObj = $.fn.zTree.getZTreeObj("agencyDataTree");
						var nodes = treeObj.getSelectedNodes();
						treeObj.selectNode(nodes[0]);
						$("#query-owner").val(nodes[0].chr_name);
					}
				}
			},
			treeUnitSetting:{
				view:{
					selectedMulti:true
				},
				callback:{
					onClick:function(e,id,node){
						$("#bank").val(node.chr_name);
						$("#bank-h").val(node.id);
						$("#query-bank").val(node.chr_name);
						$("#addChoiceModel").modal("hide");
					}
				} 
			},
			ownerTreeSetting:{
				view:{
					selectedMulti:true
				},
				callback:{
					onClick:function(e,id,node){
						$("#owner").val(node.chr_name);
						$("#query-owner").val(node.chr_name);
						$("#addChoiceModel").modal("hide");
					}
				} 
			},
			//财政账户列表
			accountDataTable : new u.DataTable({
				meta : {
					'owner' : {

					},
					'chr_code' : {

					},
					'account_no' : {

					},
					'account_name' : {

					},
					'bank' : {

					}
					,
					'remark' : {

					}
					,
					'enabled' : {

					}
				}
			}),
			//账户类型树
			accountTypeDataTree : new u.DataTable({
				meta : {
					'id' : {

					},
					'parent_id' : {

					},
					'chr_name' : {

					}
				}
			}),
			//预算单位树
			agencyDataTree : new u.DataTable({
				meta : {
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

			//获取开户行
			treeUnitDataTable: new u.DataTable({
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
			//获取所有者
			ownerTree: new u.DataTable({
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
	/*
	 * 初始化左侧树
	 * 
	 */
	viewModel.initPage = function(){

		viewModel.getAccountType();//初始化账户类型树
		viewModel.setAdvancedModal();//初始化高级查询

	};
	//获取账户类型树
	viewModel.getAccountType = function(){
		$.ajax({
			url:"/df/accountConfig/getAccountType.do?tokenid=" + tokenid,
			data:{"ajax":"nocache","param":"11#12#13#21#22#31#61#62#64#65#66#69#71"},
			dataType:"json",
			type:"POST",
			async:false,
			success:function(data){
				viewModel.accountTypeDataTree.setSimpleData(data);
			}
		});
	};

	//获取预算单位
	viewModel.getAgencyList = function(){
		$.ajax({
			url:"/df/accountConfig/getAgencyList.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			dataType:"json",
			type:"POST",
			async: false,
			success:function(data){
				viewModel.agencyDataTree.setSimpleData(data);
			}
		});
	},
	//切换账户类型和预算单位的回调
	viewModel.changeProp = function(){
		$('#changeprop').change(function(){

			var val = $(this).children('option:selected').val();
			if(val=="0"||val==0){
				$("#account-tree").css("display","block");
				$("#agency-tree").css("display","none");
				$("#query-owner").val("");
				viewModel.getAccountType();
				viewModel.setAdvancedModal();
			}else{
				$("#account-tree").css("display","none");
				$("#agency-tree").css("display","block");
				viewModel.getAgencyList();
				var typeval = $('#query-account-type-value').children('option:selected').val();
				var type = typeval.split(" ");
				var parent_name = viewModel.getParentAccountType(type[0]);
				$("#query-account-son-type").val(parent_name);
				viewModel.accountDataTable.setSimpleData();
			}
			viewModel.setAdvancedModal();//初始化高级查询

		});  
	},
	/*
	 * 获取开户行树
	 * 
	 */
	viewModel.getBankList = function(){
		var treeObj = $.fn.zTree.getZTreeObj("accountTypeTree");
		var nodes = treeObj.getSelectedNodes();
		$("#manageTreeUnit").css("display","block");
		$("#ownerTree").css("display","none");
		$.ajax({
			url: "/df/accountConfig/getBankList.do?tokenid=" + tokenid,
			type: 'POST',
			dataType: 'json',
			data: {"tokenId":tokenid,"ajax":"nocache"},
			success: function (data) {
				viewModel.treeUnitDataTable.setSimpleData(data);
			} 
		});
	},
	/*
	 * 根据账户类型设置新增或者修改modal的界面和数据默认值
	 * 
	 */
	viewModel.setDefaultValue = function(){
		var val = $('#changeprop').children('option:selected').val();
		var selectData = viewModel.accountTypeDataTree.getSimpleData({type:'select'});
		actionflag = 1;
		var bank_ele = $("#bank");
		var bank_ele_clear = $("#bank").next().next(".input-control-feedback");
		var bank_ele_addon = $("#bank").next().next().next(".input-group-addon");
		if(val==0||val=="0"){//判断当前是账户类型，还是预算单位
			var account_id = selectData[0].id;
			if(account_id=="64" || account_id == "65" || account_id == "66" || account_id =="69" || account_id == "71"){
				bank_ele.css({"width":"calc(100% + 25px)","border-top-right-radius":"4px","border-bottom-right-radius":"4px"});
				bank_ele.prop("readonly",false);
				bank_ele_clear.css("right","2px");
				bank_ele_addon.css("visibility","hidden");
			}
			if(account_id=="11" || account_id == "12" || account_id == "21" || account_id =="22" || account_id == "31" ||account_id =="61" || account_id == "62"){
				bank_ele.css({"width":"100%","border-top-right-radius":"0px","border-bottom-right-radius":"0px"});
				bank_ele.prop("readonly",true);
				bank_ele_clear.css("right","28px");
				bank_ele_addon.css("visibility","visible");
			}//
			$("#owner").removeAttr("disabled");
			$("#clearText").attr("onclick","clearText('owner')");
			$("#addChoice").attr("data-bind","click: getOwnerList");
			$("#addChoice").attr("data-target","#addChoiceModel");

			$("#query-clearText").attr("onclick","clearText('owner')");
			$("#query-addChoice").attr("data-bind","click: getOwnerList");
			$("#query-addChoice").attr("data-target","#addChoiceModel");

			$("#account-son-type-container").css("display","block");
			$("#agency-account-type").css("display","none");
			var account_type = $("#query-account-son-type").val();
			var type = account_type.split(" ");
			/*var ele_source = viewModel.getEleSource(account_type.split(" ")[0]);*/
			var parent_name = viewModel.getParentAccountType(account_type.split(" ")[0]);
			if(selectData.length > 0){
				var ele_source = selectData[0].ele_source;
				var ele_code = selectData[0].ele_code;
			}
			$("#account-type").val(parent_name);
			$("#account-son-type").val(account_type);
			$("#ele_code").val(ele_code);

			/*
			 * 根据账户类型调整modal界面
			 * 
			 */
			if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
				$("#payee-name-container").css("display","block");
				$("#is-public-container").css("display","block");
				$("#foreign-code-container").css("display","block");
				$("#account-name-container").css("display","none");
				$("#code-container").css("display","none");
			}else{
				$("#payee-name-container").css("display","none");
				$("#is-public-container").css("display","none");
				$("#foreign-code-container").css("display","none");
				$("#account-name-container").css("display","block");
				$("#code-container").css("display","block");
			}

		}else{
			//预算单位展示时，开户行变为tree模式
			bank_ele.css({"width":"100%","border-top-right-radius":"0px","border-bottom-right-radius":"0px"});
			bank_ele.prop("readonly",true);
			bank_ele_clear.css("right","28px");
			bank_ele_addon.css("visibility","visible");//end			
			$("#account-son-type-container").css("display","none");
			$("#agency-account-type").css("display","block");
//			var treeObj = $.fn.zTree.getZTreeObj("agencyDataTree");
//			var nodes = treeObj.getSelectedNodes();
//			var type = ($("#account-type").val().split(" "))[0];
//			var type = ($('#account-type option:selected').val().split(" "))[0];
			var account_type = $('#query-account-type-value').val();
			var type = account_type.split(" ");
			var parent_name = viewModel.getParentAccountType(type[0]);
			var treeObj = $.fn.zTree.getZTreeObj("agencyDataTree");
			var nodes = treeObj.getSelectedNodes();
			$("#owner").val(nodes[0].chr_name);
			$("#owner").attr("disabled","disabled");
			$("#clearText").removeAttr("onclick");
			$("#addChoice").removeAttr("data-bind");
			$("#addChoice").removeAttr("data-target");

			$("#query-clearText").removeAttr("onclick");
			$("#query-addChoice").removeAttr("data-bind");
			$("#query-addChoice").removeAttr("data-target");

			$.ajax({
				url:"/df/accountConfig/getEleSource.do?tokenid=" + tokenid,
				data:{"ajax":"nocache","type":type[0]},
				dataType:"json",
				type:"POST",
				async:false,
				success: function(data){
					ele_source_value = data[0].ele_source;
				}

			});

			$("#account-type").val(parent_name);
			$("#account-son-type").val($("#account-type").val());

			/*
			 * 根据账户类型调整modal界面
			 * 
			 */
			if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
				$("#payee-name-container").css("display","block");
				$("#is-public-container").css("display","block");
				$("#foreign-code-container").css("display","block");
				$("#account-name-container").css("display","none");
				$("#code-container").css("display","none");
			}else{
				$("#payee-name-container").css("display","none");
				$("#is-public-container").css("display","none");
				$("#foreign-code-container").css("display","none");
				$("#account-name-container").css("display","block");
				$("#code-container").css("display","block");
			}

		}

		viewModel.clearModalInputValue();
	},

	/*
	 * 获取所有者列表
	 * 
	 */

	viewModel.getOwnerList = function(){
		var treeObj = $.fn.zTree.getZTreeObj("accountTypeTree");
		var nodes = treeObj.getSelectedNodes();
		$("#manageTreeUnit").css("display","none");
		$("#ownerTree").css("display","block");
		if(nodes[0].owner_type_id=="cz"){//判断是否是财政账户
			var row = {
					"data": {
						"chr_id": "000",
						"chr_name": "000 财政",
						"parent_id": "1"
					}
			};
			viewModel.ownerTree.setSimpleData(row.data);
		}else{
			$.ajax({
				url:"/df/accountConfig/getAgencyList.do?tokenid=" + tokenid,
				data:{"ajax":"nocache"},
				dataType:"json",
				type:"POST",
				success:function(data){
					viewModel.ownerTree.setSimpleData(data);
				}
			});
		}

	},

	/*
	 * 
	 * 通过账户类型获取ELeSource
	 * 
	 */
	viewModel.getEleSource = function (type){
		var ele_source = "";
		$.ajax({
			url:"/df/accountConfig/getEleSource.do?tokenid=" + tokenid,
			data:{"ajax":"nocache","type":type},
			dataType:"json",
			type:"POST",
			async:false,
			success: function(data){
				ele_source = data[0].ele_source;
			}

		});
		if(ele_source==""){
			ip.ipInfoJump("获取ele_source失败！","error");
			return false;
		}
		return ele_source;
	}

	/*
	 * 根据账户类型ID获取账户类型父级code+name
	 * 
	 */
	viewModel.getParentAccountType = function(id){
		var name = "";
		$.ajax({
			url:"/df/accountConfig/getParentAccountType.do?tokenid=" + tokenid,
			data:{"ajax":"nocache","id":id},
			dataType:"json",
			type:"POST",
			async:false,
			success:function(data){
				name = data[0].name;
			}
		});
		return name;
	},

	/*
	 * 新增保存账户
	 * 
	 */
	viewModel.saveAccount = function(){
		var val = $('#changeprop').children('option:selected').val();
		actionflag = 1;
		var ele_source;
		var account_type ;
		var bank_code = $("#bank").val();//开户行
		if(val==0||val=="0"){//判断当前是账户类型，还是预算单位
			var treeObj = $.fn.zTree.getZTreeObj("accountTypeTree");
			var nodes = treeObj.getSelectedNodes();
			ele_source = nodes[0].ele_source;
			account_type = $("#account-son-type").val();//账户类型
			var account_id = nodes[0].id;
			if(account_id=="64" || account_id == "65" || account_id == "66" || account_id =="69" || account_id == "71"){
				bank_code = " "+bank_code;
			}
		}else{
			ele_source = ele_source_value;
			account_type = $('#account-type-value').val();
		}
		
		var bank_id = $("#bank-h").val();//开户行id
		var ele_code = $("#ele_code").val();//开户行id
		var owner_code = $("#owner").val();//所有者
		var account_no = $("#account-no").val();//账号
		var start_date = $("#start-date").val();
		var end_date = $("#stop-date").val();
		var isDefault = $("[name='isDefault']").filter(":checked").val();//默认账户
		var enabled = $("[name='enable']").filter(":checked").val();//是否启用
		var remark = $("#remark").val();//备注
		if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
			var payee_name = $("#payee-name").val();//收款人账户
			var is_public = $("[name='is-public']").filter(":checked").val();//是否公用
			var foreign_code = $("#foreign-code").val();//外码
			if(account_type==""||account_type==null
					||bank_code==""||bank_code==null
					||owner_code==""||owner_code==null
					||account_no==""||account_no==null
					||payee_name==""||payee_name==null
					||isDefault==""||isDefault==null
					||enabled==""||enabled==null
					||is_public==""||is_public==null){
				ip.ipInfoJump("星标数据不可为空，请补充数据！","error");
				return;
			}
			var arrayData = {
					"ajax":"nocache",
					"account_type":account_type,
					"bank_code":bank_code,
					"bank_id": bank_id,
					"ele_code":ele_code,
					"owner_code":owner_code,
					"account_no":account_no,
					"payee_name":payee_name,
					"isDefault":isDefault,
					"enabled":enabled,
					"is_public":is_public,
					"start_date":start_date,
					"end_date":end_date,
					"remark":remark,
					"ele_source": ele_source,
					"foreign_code": foreign_code
			};

		}else{
			var account_name = $("#account-name").val();//账号名称
			var code = $("#code").val();//编码
			if(account_type==""||account_type==null
					||bank_code==""||bank_code==null
					||owner_code==""||owner_code==null
					||account_no==""||account_no==null
					||account_name==""||account_name==null
					||isDefault==""||isDefault==null
					||enabled==""||enabled==null){
				ip.ipInfoJump("星标数据不可为空，请补充数据！","error");
				return;
			}
			var arrayData = {
					"ajax":"nocache",
					"account_type":account_type,
					"bank_code":bank_code,
					"bank_id": bank_id,
					"ele_code":ele_code,
					"owner_code":owner_code,
					"account_no":account_no,
					"account_name":account_name,
					"isDefault":isDefault,
					"enabled":enabled,
					"start_date":start_date,
					"end_date":end_date,
					"remark":remark,
					"ele_source": ele_source,
					"code": code
			};

		}

		$.ajax({
			url:"/df/accountConfig/saveAccount.do?tokenid=" + tokenid,
			data:arrayData,
			dataType:"json",
			type:"POST",
			success:function(data){
				ip.ipInfoJump(data[0].msg+"!");
				if(val==0||val=="0"){
					viewModel.getAccountListByID(account_type.split(" ")[0]);
				}else{
					viewModel.getAccountListByAgency();
				}
				$("#addModal").modal("hide");
			}
		});

	},
	/*
	 * 删除选中的账户
	 * 
	 */
	viewModel.delAccountByID = function(){
		var val = $('#changeprop').children('option:selected').val();
		var ele_code  = $('#ele_code').val();
		var type;
		if(val==0||val=="0"){
			type = $("#query-account-son-type").val().split(" ");
		}else{
			type = $("#query-account-type-value").val().split(" ");
		}
		var ele_source = viewModel.getEleSource(type[0]);
		var data = [];
		var value;
		var rows = viewModel.accountDataTable.getSelectedRows();
		if(rows.length==0){
			ip.ipInfoJump("请至少选择一条数据。","info");
			return false;
		}
		for(var i=0;i<rows.length;i++){
			value = {"chr_id":rows[i].data.chr_id.value};
			data.push(value);
		}
		ip.warnJumpMsg("确定要删除吗?","sid1","cCla1");
		$("#sid1").on("click",function(){
			$("#config-modal").remove();
			$.ajax({
				url:"/df/accountConfig/delAccount.do?tokenid=" + tokenid,
				data:{"ajax":"nocache","data":JSON.stringify(data),"ele_code":ele_code,"ele_source":ele_source,"account_type":type[0]},
				dataType:"json",
				type:"POST",
				success: function(data){
					ip.ipInfoJump(data[0].msg+"!");
					if(val==0||val=="0"){
						viewModel.getAccountListByID(type[0]);


					}else{
						viewModel.getAccountListByAgency();

					}
				}
			});
		});
		$(".cCla1").on("click",function(){
			//处理取消逻辑方法
			$("#config-modal").remove();
		});
		},

		/*
		 * 删除选中的账户
		 * 
		 */
		viewModel.delAgencyAccountByID = function(){

			var data = [];
			var value;
			var rows = viewModel.agencyAccountDataTable.getSelectedRows();
			var ele_source = viewModel.getEleSource(rows[0].data.account_type.value);

			if(rows.length==0){
				ip.ipInfoJump("请至少选择一条数据。","info");
				return false;
			}
			for(var i=0;i<rows.length;i++){
				value = {"chr_id":rows[i].data.chr_id.value};
				data.push(value);
			}
			$.ajax({
				url:"/df/accountConfig/delAccount.do?tokenid=" + tokenid,
				data:{"ajax":"nocache","data":JSON.stringify(data),"ele_source":ele_source},
				dataType:"json",
				type:"POST",
				success: function(data){
					ip.ipInfoJump(data[0].msg+"!");
					viewModel.getAccountListByAgency();
				}
			});
		},

		/*
		 * 时间控件
		 * 
		 */
		viewModel.timecomponent = function(){
			var startDate=new Date();
			startDate=new Date(startDate.toString());
			startDate=startDate.getFullYear()+"-"+fix(startDate.getMonth()+1,2)+"-"+fix(startDate.getDate(),2);
			var endDate=new Date();
			endDate=new Date(endDate);
			endDate=endDate.getFullYear()+"-"+fix(endDate.getMonth()+1,2)+"-"+fix(endDate.getDate(),2);

			viewModel.startDateVal(startDate);
			viewModel.endDateVal(endDate);
		};
		/**
		 * 解决IE下new Date 带参数返回NAN的bug
		 * @param sDate
		 */
		function NewDate(sDate) {
			var dates = sDate.split(' '),ymd = dates[0].split('-'),
			time = dates[1].split(':');
			var date = new Date();
			date.setUTCFullYear(ymd[0], ymd[1] - 1, ymd[2]);
			date.setUTCHours(Number(time[0]), Number(time[1]), 0, 0);
			return date;
		}

		/*
		 * 通过账户类型获取账户列表
		 * @param chr_code
		 * 
		 */

		viewModel.getAccountListByID = function(id){
			$.ajax({
				url:"/df/accountConfig/getAccountByID.do?tokenid=" + tokenid,
				data:{"ajax":"nocache","id":id},
				dataType:"json",
				type:"POST",
				success:function(data){
					viewModel.accountDataTable.setSimpleData(data,{"unSelect":true});
				}
			});
		},

		/*
		 * 更新账户
		 * 
		 */

		viewModel.updateAccount = function(){
			var account_type;
			var ele_source;
			var val = $('#changeprop').children('option:selected').val();
			var bank_code = $("#bank").val();//开户行
			if(val==0||val=="0"){
				account_type = $("#account-son-type").val();//账户类型
				var account_id = account_type.split(" ")[0];
				if(account_id=="64" || account_id == "65" || account_id == "66" || account_id =="69" || account_id == "71"){
					bank_code = " "+bank_code;
				}
			}else{
				account_type = $('#account-type-value').val();
			}
			ele_source = viewModel.getEleSource(account_type.split(" ")[0]);
			var bank_id = $("#bank-h").val();//开户行id
			var ele_code = $("#ele_code").val();
			var owner_code = $("#owner").val();//所有者
			var account_no = $("#account-no").val();//账号
			var start_date = $("#start-date").val();
			var end_date = $("#stop-date").val();
			var isDefault = $("[name='isDefault']").filter(":checked").val();//默认账户
			var enabled = $("[name='enable']").filter(":checked").val();//是否启用
			var remark = $("#remark").val();//备注
			var rows = viewModel.accountDataTable.getSelectedRows();
			var guid = rows[0].data.chr_id.value;
			if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
				var payee_name = $("#payee-name").val();//收款人账户
				var is_public = $("[name='is-public']").filter(":checked").val();//是否公用
				var foreign_code = $("#foreign-code").val();//外码
				if(account_type==""||account_type==null
						||bank_code==""||bank_code==null
						||owner_code==""||owner_code==null
						||account_no==""||account_no==null
						||payee_name==""||payee_name==null
						||isDefault==""||isDefault==null
						||enabled==""||enabled==null
						||is_public==""||is_public==null){
					ip.ipInfoJump("星标数据不可为空，请补充数据！","error");
					return;
				}
				var arrayData = {
						"ajax":"nocache",
						"account_type":account_type,
						"bank_code":bank_code,
						"bank_id":bank_id,
						"ele_code":ele_code,
						"owner_code":owner_code,
						"account_no":account_no,
						"payee_name":payee_name,
						"isDefault":isDefault,
						"enabled":enabled,
						"is_public":is_public,
						"start_date":start_date,
						"end_date":end_date,
						"remark":remark,
						"ele_source": ele_source,
						"foreign_code": foreign_code,
						"guid": guid
				};

			}else{
				var account_name = $("#account-name").val();//账号名称
				var code = $("#code").val();//编码
				if(account_type==""||account_type==null
						||bank_code==""||bank_code==null
						||owner_code==""||owner_code==null
						||account_no==""||account_no==null
						||account_name==""||account_name==null
						||isDefault==""||isDefault==null
						||enabled==""||enabled==null){
					ip.ipInfoJump("星标数据不可为空，请补充数据！","error");
					return;
				}
				var arrayData = {
						"ajax":"nocache",
						"account_type":account_type,
						"bank_code":bank_code,
						"bank_id":bank_id,
						"ele_code":ele_code,
						"owner_code":owner_code,
						"account_no":account_no,
						"account_name":account_name,
						"isDefault":isDefault,
						"enabled":enabled,
						"start_date":start_date,
						"end_date":end_date,
						"remark":remark,
						"ele_source": ele_source,
						"code": code,
						"guid": guid
				};

			}

			$.ajax({
				url:"/df/accountConfig/updateAccount.do?tokenid=" + tokenid,
				data:arrayData,
				dataType:"json",
				type:"POST",
				success:function(data){
					ip.ipInfoJump(data[0].msg+"!");
					if(val==0||val=="0"){
						viewModel.getAccountListByID(account_type.split(" ")[0]);
					}else{
						viewModel.getAccountListByAgency();
					}
					$("#addModal").modal("hide");
				}
			});
		},

		/*
		 * 保存账户
		 * 
		 */

		viewModel.save = function(){
			if(actionflag==1){
				viewModel.saveAccount();
			}
			else if(actionflag==2){
				viewModel.updateAccount();
			}else{
				ip.ipInfoJump("找不到保存方法,请联系管理员！","error");
			}
		},

		/*
		 * 点击修改按钮设置modal里的数据默认值
		 * 
		 */
		viewModel.setAccountDefaultValue = function(){

			viewModel.setDefaultValue();
			actionflag = 2;
			var rows = viewModel.accountDataTable.getSelectedRows();
			if(rows.length!=1){
				ip.ipInfoJump("请选择一条数据。","info");
				return false;
				$("#addModal").modal("hide");
			}
			var treeObj = $.fn.zTree.getZTreeObj("accountTypeTree");
			var nodes = treeObj.getSelectedNodes();
			var ele_source = nodes[0].ele_source;
			$("#bank").val(rows[0].data.bank.value);//开户行
			$("#bank-h").val(rows[0].data.bank_id.value);//开户行
			$("#owner").val(rows[0].data.owner.value);//所有者
			$("#account-no").val(rows[0].data.account_no.value);//账号
			$("#start-date").val(rows[0].data.start_date.value);
			$("#stop-date").val(rows[0].data.stop_date.value);
			$("input[name='isDefault'][value='" + rows[0].data.is_default.value + "']").attr("checked",'checked');
			$("input[name='enable'][value='" + rows[0].data.enabled.value + "']").attr("checked",'checked');
			$("#remark").val(rows[0].data.remark.value);//备注

			if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
				$("#payee-name").val(rows[0].data.payee_name.value);//收款人账户
				$("input[name='is_public'][value='" + rows[0].data.is_public.value + "']").attr("checked",'checked');
//				$("[name='is-public']").filter(":checked").val(rows[0].data.is_public.value);//是否公用
				$("#foreign-code").val(rows[0].data.chr_code.value);//外码
			}else{
				$("#account-name").val(rows[0].data.account_name.value);//账号名称
				$("#code").val(rows[0].data.chr_code.value);//编码
			}
			$("#addModal").modal("show");

		},

		/*
		 * 通过单位获取账户
		 * 
		 */
		viewModel.getAccountListByAgency = function(){
			var treeObj = $.fn.zTree.getZTreeObj("agencyDataTree");
			var nodes = treeObj.getSelectedNodes();
			if(nodes.length<1){
				nodes = treeObj.getNodes();
			}
			var type = $("#query-account-type-value").val().split(" ");
			var table = viewModel.getEleSource(type[0]);
			$.ajax({
				url:"/df/accountConfig/getAccountListByAgency.do?tokenid=" + tokenid,
				data:{"ajax":"nocache","account_type":type[0],"owner_code":nodes[0].chr_code,"ele_source":table},
				dataType:"json",
				type:"POST",
				success: function(data){
					viewModel.accountDataTable.setSimpleData(data,{"unSelect":true});
				}
			});
		},
		/*
		 * 高级查询按钮
		 * 
		 */
		viewModel.showAdvancedQuery = function(){
			$("input[name='query-isDefault']").eq(0).attr("checked",false);
			$("input[name='query-isDefault']").eq(0).attr("checked",false);
			$("input[name='query-is-public']").eq(0).attr("checked",false);
			$("input[name='query-is-public']").eq(0).attr("checked",false);
			if($(".advanced-query-container").css("display")=="none"){
				$(".advanced-query-container").css("display","block");
				$("#query-action").css("display","block");
				$("#account").css("max-height","220px");
			}else{
				$(".advanced-query-container").css("display","none");
				$("#query-action").css("display","none");
				$("#account").css("max-height","395px");
			}
			viewModel.setAdvancedModal();
		},
		/*
		 * 设置高级查询的界面
		 * 
		 */
		viewModel.setAdvancedModal = function(){
			var val = $('#changeprop').children('option:selected').val();
			actionflag = 1;
			if(val==0||val=="0"){//判断当前是账户类型，还是预算单位
				$("#query-owner").removeAttr("disabled");
				$("#query-clearText").attr("onclick","clearText('query-owner')");
				$("#query-addChoice").attr("data-bind","click: getOwnerList");
				$("#query-addChoice").attr("data-target","#addChoiceModel");
				$("#query-account-son-type-container").css("display","block");
				$("#query-agency-account-type").css("display","none");
				var treeObj = $.fn.zTree.getZTreeObj("accountTypeTree");
				var nodes = treeObj.getSelectedNodes();
				if(nodes.length>0){
					var ele_source = nodes[0].ele_source;
					var parent_name = viewModel.getParentAccountType(nodes[0].id);
					$("#query-account-type").val(parent_name);
					$("#query-account-son-type").val(nodes[0].chr_name);
				}

			}else{
				$("#query-account-son-type-container").css("display","none");
				$("#query-agency-account-type").css("display","block");
				viewModel.changeType();
//				var treeObj = $.fn.zTree.getZTreeObj("agencyDataTree");
//				var nodes = treeObj.getSelectedNodes();
//				var type = ($("#account-type").val().split(" "))[0];
//				var type = ($('#account-type option:selected').val().split(" "))[0];

				var account_type = $('#query-account-type-value').val();
				var type = account_type.split(" ");
				var parent_name = viewModel.getParentAccountType(type[0]);
				var treeObj = $.fn.zTree.getZTreeObj("agencyDataTree");
				var nodes = treeObj.getSelectedNodes();
				treeObj.selectNode(nodes[0]);
				$("#query-owner").val(nodes[0].chr_name);
				$("#query-owner").attr("disabled","disabled");
				$("#query-clearText").removeAttr("onclick");
				$("#query-addChoice").removeAttr("data-bind");
				$("#query-addChoice").removeAttr("data-target");
				ele_source = viewModel.getEleSource(type[0]);
				ele_source_value = ele_source;
				$("#query-account-type").val(parent_name);
				$("query-account-type-value").val($("#query-account-type").val());
			}
			/*
			 * 根据账户类型调整modal界面
			 * 
			 */
			if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
				$("#query-payee-name-container").css("display","block");
				$("#query-is-public-container").css("display","block");
				$("#query-foreign-code-container").css("display","block");
				$("#query-account-name-container").css("display","none");
				$("#query-code-container").css("display","none");
			}else{
				$("#query-payee-name-container").css("display","none");
				$("#query-is-public-container").css("display","none");
				$("#query-foreign-code-container").css("display","none");
				$("#query-account-name-container").css("display","block");
				$("#query-code-container").css("display","block");
			}

		},

		/*
		 * 高级查询账户类型修改回调函数
		 * 
		 */
		viewModel.changeType = function(){
			$('#query-account-type-value').change(function(){
				viewModel.setAdvancedModal();//初始化高级查询
				var val = $(this).children('option:selected').val();
				var type = val.split(" ");
				var parent_name = viewModel.getParentAccountType(type[0]);
				$("#query-account-son-type").val(parent_name);
				viewModel.getAccountListByAgency();

			});  
		},

		/*
		 * 清空modal输入框中的值
		 * 
		 */

		viewModel.clearModalInputValue = function(){
			$("#bank").val("");//开户行

			$("#account-no").val("");//账号
			$("#start-date").val("");
			$("#stop-date").val("");
			$("input[name='isDefault'][value='1']").attr("checked",'checked');
			$("input[name='enable'][value='1']").attr("checked",'checked');
			$("#remark").val("");//备注
			var val = $('#changeprop').children('option:selected').val();
			var account_type;
			if(val==0||val=="0"){
				$("#owner").val("");//所有者
				account_type = $("#account-son-type").val();//账户类型
			}else{

				account_type = $('#account-type-value').val();
			}
			var ele_source = viewModel.getEleSource(account_type.split(" ")[0]);


			if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
				$("input[name='is_public'][value='1']").attr("checked",'checked');
				$("#foreign-code").val("");//外码
				$("#payee-name").val("");//所有者
			}else{
				$("#account-name").val("");//账号名称
				$("#code").val("");//编码
			}



		},
		/*
		 * 查询
		 * 
		 */

		viewModel.conditionQuery = function(){
			var val = $('#changeprop').children('option:selected').val();

			var ele_source;
			var account_type ;
			if(val==0||val=="0"){//判断当前是账户类型，还是预算单位
				var treeObj = $.fn.zTree.getZTreeObj("accountTypeTree");
				var nodes = treeObj.getSelectedNodes();
				ele_source = nodes[0].ele_source;
				account_type = $("#query-account-son-type").val();//账户类型
			}else{
				ele_source = ele_source_value;
				account_type = $('#query-account-type-value').val();
			}
			var bank_code = $("#query-bank").val();//开户行
			var owner_code = $("#query-owner").val();//所有者
			var account_no = $("#query-account-no").val();//账号
			var start_date = $("#query-start-date").val();
			var end_date = $("#query-stop-date").val();
			var isDefault = $("[name='query-isDefault']").filter(":checked").val();//默认账户
			var enabled = $("[name='query-enable']").filter(":checked").val();//是否启用
			var remark = $("#query-remark").val();//备注
			if(ele_source=="ma_ele_payee_account"||ele_source=="MA_ELE_PAYEE_ACCOUNT"){
				var payee_name = $("#query-payee-name").val();//收款人账户
				var is_public = $("[name='query-is-public']").filter(":checked").val();//是否公用
				var foreign_code = $("#query-foreign-code").val();//外码

				var arrayData = {
						"ajax":"nocache",
						"account_type":account_type,
						"bank_code":bank_code,
						"owner_code":owner_code,
						"account_no":account_no,
						"payee_name":payee_name,
						"isDefault":isDefault,
						"enabled":enabled,
						"is_public":is_public,
						"start_date":start_date,
						"end_date":end_date,
						"remark":remark,
						"ele_source": ele_source,
						"foreign_code": foreign_code
				};

			}else{
				var account_name = $("#query-account-name").val();//账号名称
				var code = $("#query-code").val();//编码

				var arrayData = {
						"ajax":"nocache",
						"account_type":account_type,
						"bank_code":bank_code,
						"owner_code":owner_code,
						"account_no":account_no,
						"account_name":account_name,
						"isDefault":isDefault,
						"enabled":enabled,
						"start_date":start_date,
						"end_date":end_date,
						"remark":remark,
						"ele_source": ele_source,
						"code": code
				};

			}

			$.ajax({
				url:"/df/accountConfig/advancedQuery.do?tokenid=" + tokenid,
				data:arrayData,
				dataType:"json",
				type:"POST",
				success:function(data){
					viewModel.accountDataTable.setSimpleData(data);
					$("#addModal").modal("hide");
				}
			});

		},


		/*
		 * viewQuery 查找
		 * 
		 */

		viewModel.viewQuery = function (treeId){
			var treeId = $(".view-Tree").find(".ztree:visible").attr("id");
			var user_write = $("#addviewInput").val();
			var data_tree = $("#"+treeId+"")[0]['u-meta'].tree;
			var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
			data_tree.expandNode(search_nodes[0],true,false,true);
			data_tree.selectNode(search_nodes[0]);	
		}

		/*
		 * 下一个
		 * 
		 */

		var j = 1;
		viewModel.viewNext = function (treeId){
			var treeId = $(".view-Tree").find(".ztree:visible").attr("id");
			var user_write = $("#addviewInput").val();
			var data_tree = $("#"+treeId+"")[0]['u-meta'].tree;
			var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
			if(j < search_nodes.length){
				data_tree.selectNode(search_nodes[j++]);
			}else{
				j = 1;
			}
		},

		//清空输入框
		clearText = function(id){
			$("#"+ id).val("");
		};
		var tokenid;
		$(function () {
			tokenid = ip.getTokenId();
			var app = u.createApp({
				el: '.gl-container',
				model: viewModel
			});
			viewModel.changeProp();
			viewModel.initPage();
			viewModel.changeType();
		});


	});