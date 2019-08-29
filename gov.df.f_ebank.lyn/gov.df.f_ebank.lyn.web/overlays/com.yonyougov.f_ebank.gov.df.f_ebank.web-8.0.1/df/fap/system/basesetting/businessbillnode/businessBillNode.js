require(['jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'ip'], function ($, ko) {
    window.ko = ko;
    var viewModel = {
		ruleName: ko.observable(),
        //表格数据模型
        gridDataTable: new u.DataTable({
        	
        })
    };
    
    viewModel.initBusinessGrid = function () {
    	$.ajax({
            type: 'GET',
	        url: '/df/businessbillcode/getBusinessBillNode.do' + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
	        cache: false,
	        dataType: 'json',
	        success: function (result) {
	        	if (result.flag == 'success') {
	        		var data = result.data;
		            viewModel.gridDataTable.setSimpleData(data);
	        	} else {
	        		ip.ipInfoJump("查询出现异常，请稍后重试！", 'error');
	        	}
	            
	        }
        });
    }
    
    /*
     * 新增部分
     * insertBusiness点击新增出现模态框
     * saveAddBusiness新增保存方法，保存成功之后刷新表格
     */
    viewModel.insertBusiness = function () {
        $("#addmyModal").modal("show");
    };
    viewModel.saveAddBusiness = function () {
        var insertData = viewModel.getData('1');
        if(insertData == "1"){
        	return;
        }
        $.ajax({
            type: 'POST',
	        url: '/df/businessbillcode/saveBusinessBillNode.do' + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
	        data: {"data" : JSON.stringify(insertData)},
	        cache: false,
	        dataType: 'json',
	        success: function (result) {
	            var data = result.data;
	            if (result.flag == 'success') {
	            	clearValue('1');
	            	viewModel.initBusinessGrid();
	            	ip.ipInfoJump("保存成功", "success");
	            } else {
	            	ip.ipInfoJump("保存失败", "error");
	            }
	            $("#addmyModal").modal("hide");
	        },
        });
    };
    
    /*
     * 修改部分
     * updateBtn点击修改出现模态框
     * saveModify修改保存方法
     */
    viewModel.updateBusiness = function () {
    	var row = viewModel.gridDataTable.getSelectedRows();
    	if (row.length < 1) {
    		ip.ipInfoJump("请选择要修改的数据", "info");
    		return false;
    	}
    	viewModel.setValue(row);
        $("#modifymyModal").modal("show");
    };
    
    viewModel.saveModify = function () {
    	var modifyData = viewModel.getData('2');
    	 if(modifyData == "1"){
         	return;
         }
        $.ajax({
            type: 'POST',
            url: '/df/businessbillcode/updateBusinessBillNode.do' + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
            data: {"data" : JSON.stringify(modifyData)},
            cache: false,
            dataType: 'json',
            success: function (result) {
            	if (result.flag == 'success') {
	            	//clearValue('2');
	            	viewModel.initBusinessGrid();
	            	ip.ipInfoJump("修改成功", "success");
	            } else {
	            	ip.ipInfoJump("修改失败", "error");
	            }
                $("#modifymyModal").modal("hide");
            }
        });
    };
    
    /*
     * 删除部分
     * deleteBusiness:点击修改出现模态框
     * confirmDelete:确认删除
     */
    var deleteId;
    var index;
    var billtype;
    viewModel.deleteBusiness = function () {
    	var row = viewModel.gridDataTable.getSelectedRows();
    	var bill_node_code = row[0].data.bill_node_code.value;
    	var bill_node_name = row[0].data.bill_node_name.value;
    	billtype = row[0].data.business_bill_code.value;
    	deleteId = row[0].data.id.value;
    	index = viewModel.gridDataTable.getCurrentIndex();
    	$('#delete-msg').html('确定删除<' + bill_node_code + ' ' + bill_node_name + '>业务单据类型节点吗？');
    	$("#deleteModal").modal("show");
    };
    
    viewModel.confirmDelete = function() {
    	 $.ajax({
             type: 'POST',
             url: '/df/businessbillcode/deleteBusinessBillNode.do' + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
             data: {"id" : deleteId,"billtype":billtype},
             cache: false,
             dataType: 'json',
             success: function (result) {
            	 deleteId = '';
             	 if (result.flag == 'success') {
 	            	viewModel.gridDataTable.removeRow(index);
 	             	ip.ipInfoJump("删除成功", "success");
 	             } else {
 	            	ip.ipInfoJump("删除失败", "error");
 	             }
                 $("#deleteModal").modal("hide");
             }
         });
    };
    
    /**
     * 清除模态框的值
     * @param flag    1:新增, 2:编辑
     * 		新增和编辑的标识
     */
    clearValue = function (flag) {
    	$("#business_bill_code" + flag).val('');
        $("#bill_node_code" + flag).val('');
        $("#bill_node_name" + flag).val('');
        $("#wf_node_ids" + flag).val('');
        $("#select_sql" + flag).val('');
        $("#from_where_sql" + flag).val('');
        $("#right_table_alias" + flag).val('');
        $("#order_sql" + flag).val('');
        $("#remak" + flag).val('');
        $("#table_name" + flag).val('');
        $('#is_count' + flag).prop("checked", true);
        $('#is_bill' + flag).prop("checked", true);
        $("#group_name" + flag).val('');
    }
    
    /**
     * 给编辑的模特框赋值
     * @param row
     */
    viewModel.setValue = function (row) {
    	$("#business_bill_code2").val(row[0].data.business_bill_code.value);
        $("#bill_node_code2").val(row[0].data.bill_node_code.value);
        $("#bill_node_name2").val(row[0].data.bill_node_name.value);
        $("#wf_node_ids2").val(row[0].data.wf_node_ids.value);
        $("#select_sql2").val(row[0].data.select_sql.value);
        $("#from_where_sql2").val(ip.dealHtmlToCharacter(row[0].data.from_where_sql.value));
        $("#right_table_alias2").val(row[0].data.right_table_alias.value);
        $("#order_sql2").val(row[0].data.order_sql.value);
        $("#remak2").val(row[0].data.remak.value);
        $("#table_name2").val(row[0].data.table_name.value);
        $("#group_name2").val(row[0].data.group_name.value);
        if (row[0].data.is_count.value == '1') {
        	$('#is_count2').prop("checked", true);
        } else {
        	$('#not_count2').prop("checked", true);
        }
        if (row[0].data.isbill.value == '1') {
        	$('#is_bill2').prop("checked", true);
        } else {
        	$('#not_bill2').prop("checked", true);
        }
        var is_count = 1;
        var isbill = 1;
    };
    
    /**
     * 获取模态框中的值
     * flag：操作标识  1：新增 , 2:修改
     */
    viewModel.getData = function(flag) {
    	var business_bill_code = $("#business_bill_code" + flag).val();
    	if(business_bill_code =="" || business_bill_code == null){
    		ip.ipInfoJump("业务单据类型编码不可为空", "info");
    		return "1";
    	}
        var bill_node_code = $("#bill_node_code" + flag).val();
        if(bill_node_code =="" || bill_node_code == null){
    		ip.ipInfoJump("业务节点不可为空", "info");
    		return "1";
    	}
        var bill_node_name = $("#bill_node_name" + flag).val();
        if(bill_node_name =="" || bill_node_name == null){
    		ip.ipInfoJump("业务节点名词不可为空", "info");
    		return "1";
    	}
        var wf_node_ids = $("#wf_node_ids" + flag).val();
        var select_sql = $("#select_sql" + flag).val();
        var from_where_sql = $("#from_where_sql" + flag).val();
        from_where_sql = ip.dealHtmlToCharacter(from_where_sql); 
        var right_table_alias = $("#right_table_alias" + flag).val();
        var order_sql = $("#order_sql" + flag).val();
        var remak = $("#remak" + flag).val();
        var table_name = $("#table_name" + flag).val();
        var group_name = $("#group_name" + flag).val();
        var id;
        var is_count = 1;
        var isbill = 1;
        var countObjs;
        var billObjs;
        if (flag == '1') { //新增
        	countObjs = $("[name = count1]");
            billObjs = $("[name = bill1]");
        } else { //编辑
        	id = viewModel.gridDataTable.getSelectedRows()[0].data.id.value;
        	countObjs = $("[name = count2]");
            billObjs = $("[name = bill2]");
        }
		if (countObjs[1].checked) {
			is_count = 0;
		}
		if (billObjs[1].checked) {
			isbill = 0;
		}
		var data = {
			"business_bill_code" : business_bill_code,
			"bill_node_code" : bill_node_code,
			"bill_node_name" : bill_node_name,
			"wf_node_ids" : wf_node_ids,
			"select_sql" : select_sql,
			"from_where_sql" : from_where_sql,
			"right_table_alias" : right_table_alias,
			"order_sql" : order_sql,
			"remak" : remak,
			"table_name" : table_name,
			"is_count" : is_count,
			"isbill" : isbill,
			"id" : id,
			"group_name" : group_name
		};
		return data;
    };
  
    viewModel.getSelectedBusiness = function (obj) {
        var row = viewModel.gridDataTable.getFocusRow();
        var id = row.getSimpleData().id;
        rowindex = obj.rowIndex;
    };

    function init() {
        var app = u.createApp(
            {
                el: '#business-page',
                model: viewModel
            }
        );
        viewModel.initBusinessGrid();
    };

    init();

});