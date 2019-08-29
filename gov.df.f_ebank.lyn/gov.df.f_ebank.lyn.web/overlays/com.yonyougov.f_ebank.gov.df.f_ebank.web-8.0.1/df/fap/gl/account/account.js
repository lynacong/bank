require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
function ($, ko) {
	var viewModel = {
			enabled: [{
	            "value": "1",
	            "name": "启用"
	        }, {
	            "value": "0",
	            "name": "禁用"
	        }],	
	        balanceSide: [{
	            "value": "1",
	            "name": "借"
	        }, {
	            "value": "0",
	            "name": "贷"
	        }],
	        subjectKind: [{
	            "value": "-1",
	            "name": " "
	        },{
	            "value": "0",
	            "name": "普通科目"
	        }, {
	            "value": "1",
	            "name": "银行科目"
	        }, {
	            "value": "2",
	            "name": "固定资产"
	        }, {
	            "value": "3",
	            "name": "往来"
	        }],	
			subjectType: [{
	            "value": "1",
	            "name": "资产类"
	        }, {
	            "value": "2",
	            "name": "负债类"
	        }, {
	            "value": "3",
	            "name": "净资产类"
	        }, {
	            "value": "4",
	            "name": "收入类"
	        }, {
	            "value": "5",
	            "name": "支出类"
	        }, {
	            "value": "6",
	            "name": "其他类"
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
	    accounttreeSetting:{
	        view:{
	            showLine:false,
	            selectedMulti:false
	        },
	        callback:{
	            onClick:function(e,id,node){
	            	viewModel.chache = viewModel.accountDataTree.getFocusRow();
	            	var st_id = node.stId;
	            	var coa_id = node.coaId;
	            	node["stName"] = "指标账套";
	            	viewModel.accountDataTable.setSimpleData(node);
	            }
	        }
	    },
	    accountDataTable : new u.DataTable({
			meta : {
				'accountCode' : {

				},
				'accountName' : {

				},
				'enabled' : {
					
				},
				'subjectKind' : {
					
				}
				,
				'subjectType' : {
					
				}
				,
				'balanceSide' : {
					
				}
				,
				'stName' : {
					'value':"指标账套"
				}
				,
				'coaName' : {
					
				}
			}
		}),
		accountDataTree : new u.DataTable({
			meta : {
				'id' : {

				},
				'parent_id' : {

				},
				'nodeName' : {
					
				}
			}
		})
	    
	}; 
	viewModel.chache;
	viewModel.initUpdatePage = function(){
		$("#update-name").val(viewModel.chache.data.accountName.value);
		$("#update-code").val(viewModel.chache.data.accountCode.value);
		$("#update-subject-kind").val(viewModel.chache.data.subjectKind.value);
		$("#update-subject-type").val(viewModel.chache.data.subjectType.value);
		$("#update-coa").val(viewModel.chache.data.coaId.value);
		$("#update-table").val(viewModel.chache.data.tableName.value);
		$("#update-detail-table").val(viewModel.chache.data.monthDetailTableName.value);
		$("#update-balance_period_type").val(viewModel.chache.data.balancePeriodType.value);
		var len = $("[name='update-isDebit']").length;
		for(var i=0;i<len;i++){
			if($("[name='update-isDebit']")[i].value==viewModel.chache.data.balanceSide.value){
				$("[name='update-isDebit']")[i].checked=true;
			}
			if($("[name='update-enable']")[i].value==viewModel.chache.data.enabled.value){
				$("[name='update-enable']")[i].checked=true;
			}
		}
	}
	viewModel.initAddPage = function(){
		$("#name").val("");
		$("#code").val("");
		$("#subject-kind").val('');
		$("#subject-type").val('');
		$("#coa").val('');
		$("#table").val("");
		$("#detail-table").val("");
		$("#balance_period_type").val('');
	}
	viewModel.updateAccount = function () {
		var account_name = $("#update-name").val();
		var account_code = $("#update-code").val();
		var isDebit = $("[name='update-isDebit']").filter(":checked").val();
		var enable = $("[name='update-enable']").filter(":checked").val();
		var subject_kind = $("#update-subject-kind").val();
		var subject_type = $("#update-subject-type").val();
		var coa = $("#update-coa").val();
		var balancePeriodType = $("#update-balance_period_type").val();
		var table = $("#update-table").val();
		var detail_table = $("#update-detail-table").val();
		var book_set="";
		var account_id = viewModel.chache.data.accountId.value;
		var accountData= {
	    		 ajax:"noCache",
	    		 "accountId":account_id,
	    		 "accountName":account_name,
	    		 "accountCode":account_code,
	    		 "isDebit": isDebit,
	    		 "enable": enable,
	    		 "subject_kind": subject_kind,
	    		 "subject_type":subject_type,
	    		 "coa":coa,
	    		 "balancePeriodType":balancePeriodType,
	    		 "table":table,
	    		 "detail_table":detail_table,
	    		 "book_set":book_set
               };	
		$.ajax({
			url:"/df/gl/account/getbookset.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			dataType:"json",
			type:"POST",
			success:function(data){
				if(data[0].msg=="success"){
					book_set = data[0].stId;
					if(account_name==""||account_code==""||subject_type==""||enable==""||book_set==""){
						ip.ipInfoJump("星标数据不可为空");
					}else{
						$.ajax({
							url:"/df/gl/account/updateAccount.do?tokenid=" + tokenid,
							data:{"ajax":"nocache","account":JSON.stringify(accountData)},
							dataType:"json",
							type:"POST",
							success:function(data){
								getAccount();
								$('#updateModal').modal('hide');
								ip.ipInfoJump(data[0].msg)
							}
						});
					}
					
				}else{
					ip.ipInfoJump(data[0].msg);
				}
			}
		});
			
    };
    viewModel.addAccount = function () {
    	var account_name = $("#name").val();
		var account_code = $("#code").val();
		var isDebit = $("[name='isDebit']").filter(":checked").val();
		var enable = $("[name='enable']").filter(":checked").val();
		var subject_kind = $("#subject-kind").val();
		var subject_type = $("#subject-type").val();
		var coa = $("#coa").val();
		var balancePeriodType = $("#balance_period_type").val();
		var table = $("#table").val();
		var detail_table = $("#detail-table").val();

		if(table != "" && detail_table != ""){
            if(table==detail_table){
                ip.ipInfoJump("额度表不能与明细额度表相同","error");
                return;
            }
		}

		var book_set="";
		var accountData= {
	    		 ajax:"noCache",
	    		 "accountName":account_name,
	    		 "accountCode":account_code,
	    		 "isDebit": isDebit,
	    		 "enable": enable,
	    		 "subject_kind": subject_kind,
	    		 "subject_type":subject_type,
	    		 "coa":coa,
	    		 "balancePeriodType":balancePeriodType,
	    		 "table":table,
	    		 "detail_table":detail_table,
	    		 "book_set":book_set
              };	
		$.ajax({
			url:"/df/gl/account/getbookset.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			dataType:"json",
			type:"POST",
			success:function(data){
				if(data[0].msg=="success"){
					book_set = data[0].stId;
					if(account_name==""||account_code==""||subject_type==""||subject_type==null||enable==""||book_set==""){
						ip.ipInfoJump("星标数据不可为空","error");
						return;
					}else{
						$.ajax({
							url:"/df/gl/account/addAccount.do?tokenid=" + tokenid,
							data:{"ajax":"nocache","account":JSON.stringify(accountData)},
							dataType:"json",
							type:"POST",
							success:function(data){
								getAccount();
								if(data[0].msg!="编码重复，保存失败"){
									$('#addModal').modal('hide');
								}
								ip.ipInfoJump(data[0].msg);
							}
						});
					}
				}else{
					ip.ipInfoJump(data[0].msg);
				}
			}
		});
    };
    viewModel.deleteAccount = function(){
    	var accountName = viewModel.chache.data.accountName.value;
		var accountCode = viewModel.chache.data.accountCode.value;
		var isDebit = viewModel.chache.data.balanceSide.value;
		var subject_kind = viewModel.chache.data.subjectKind.value;
		var subject_type = viewModel.chache.data.subjectType.value;
		var coa = viewModel.chache.data.coaId.value;
		var table = viewModel.chache.data.tableName.value;
		var detail_table = viewModel.chache.data.monthDetailTableName.value;
		var balancePeriodType = viewModel.chache.data.balancePeriodType.value;
		var book_set = viewModel.chache.data.stId.value;
		var enable = viewModel.chache.data.enabled.value;
		var account_id = viewModel.chache.data.accountId.value;
		var accountData= {
	    		 ajax:"noCache",
	    		 "accountId":account_id,
	    		 "accountName":accountName,
	    		 "accountCode":accountCode,
	    		 "isDebit": isDebit,
	    		 "enable": enable,
	    		 "subject_kind": subject_kind,
	    		 "subject_type":subject_type,
	    		 "coa":coa,
	    		 "balancePeriodType":balancePeriodType,
	    		 "table":table,
	    		 "detail_table":detail_table,
	    		 "book_set":book_set
             };
        ip.warnJumpMsg("确定删除吗？","sid","cCla");
        //处理确定逻辑方法
        $("#sid").on("click",function(){
        	$.ajax({
            url:"/df/gl/account/deleteaccount.do?tokenid="+tokenid,
            data:{"account":JSON.stringify(accountData)},
            dataType:"json",
            type:"POST",
            success:function(data){
                getAccount();
                ip.ipInfoJump(data[0].msg);
                viewModel.accountDataTable.setSimpleData();
            }
        });
            $("#config-modal").remove();
        });
        //处理取消逻辑方法
        $(".cCla").on("click",function(){
            $("#config-modal").remove();
        });

    }
    
    var tokenid;
    $(function () {
    	tokenid = ip.getTokenId();
    	getAccount();
		app = u.createApp({
			el: '.gl-container',
			model: viewModel
		});
		$.ajax({
    		url:"/df/gl/account/getcoa.do?tokenid=" + tokenid,
    		data:{"ajax":"nocache"},
    		dataType:"json",
    		type:"POST",
    		success:function(data){
    			$("#update-coa").html("");
    			$("#coa").html("");
    			var html = "";
    			for(var i=0;i<data.length;i++){
    				html+="<option value='" + data[i].coa_id + "'>" + data[i].coa_name + "</option>";
    			}
    			$("#coa").append(html);
    			$("#update-coa").append(html);
    		}
    	});
    });
    
  //获取左侧科目树数据
	function getAccount(){
		$.ajax({
			url:"/df/gl/account/getaccount.do?tokenid=" + tokenid,
			data:{"ajax":"nocache"},
			type: 'POST',
			dataType: 'json',
			success: function (data){
				for(var i=0;i<data.length;i++){
					if(data[i]["coaDto"]!=null){
						data[i]["coaName"] = data[i]["coaDto"].coaCode + " " + data[i]["coaDto"].coaName;
						
					}
					data[i]["nodeName"] = data[i]["accountCode"] + " " + data[i]["accountName"];
					data[i]["parent_id"] = 1;
					data[i]["id"] = i+5;
				}
				var arr = {id:1,accountName:"科目",nodeName:"科目",parent_id:0}; 
				data.push(arr);
				viewModel.accountDataTree.setSimpleData(data);
			}
		});
	}
});