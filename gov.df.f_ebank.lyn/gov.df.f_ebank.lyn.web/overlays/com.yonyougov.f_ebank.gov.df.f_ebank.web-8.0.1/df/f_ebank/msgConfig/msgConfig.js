  require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
  	function ($, ko) {
	  //var tokenid = ip.getTokenId();                                                
	//新增或者修改 类型
		var editType;
	//新增的编码是否存在	
		var flag=false;
  		viewModel = {
  			tokenid : ip.getTokenId(),
  		    errorMsg: ko.observable(""),
  			dataTable: new u.DataTable({
  				meta: {
  					"chr_code": "",
  					"chr_name": "",
  				}
  			}, this),
  			gridDataTable: new u.DataTable({
  				meta: {
  					"field_name": "",
  					"description": "",
  					"display_order": "",
  					"disp_field_name": "",
  					"data_type": "",
  					"data_format": "",
  					"default_value": "",
  					"is_null": "",
  					"len_min": "",
  					"len_max": "",
  					"val_set": ""
  					
  				}
  			}, this),
  			gridDataTable1: new u.DataTable({
  				meta: {
  					"field_name": "",
  					"description": "",
  					"display_order": "",
  					"disp_field_name": "",
  					"data_type": "",
  					"data_format": "",
  					"default_value": "",
  					"is_null": "",
  					"len_min": "",
  					"len_max": "",
  					"val_set": ""
  					
  				}
  			}, this),
  			eleDataTable: new u.DataTable({
  				meta: {
  					"id": "",
  					"cp_name": "",
  					"parent_id": ""
  				}
  			}, this)
  		};
  		/*
  		 * 校验
  		 */
  		viewModel.validate = function(){
  			/*var displayorderVal = $("#displayorder").val();
  			if(displayorderVal == ""){
  				$("#displayorder").focus();
  				ip.ipInfoJump("不能为空！", "info");
  				return false;
  			}else{
	  			var patt1=/^[0-9]*$/;
	  			if(!patt1.test(displayorderVal)){
	  				$("#displayorder").val("");
	  				$("#displayorder").focus();
	  				ip.ipInfoJump("请输入整数", "info");
	  				return false;
	  			}else{
	  				return true;
	  			}
  			}*/
  			var displayorderVal = $("#displayorder").val();
  			var patt1=/^[0-9]*$/;
  			if(!patt1.test(displayorderVal)){
  				$("#displayorder").val("");
  				$("#displayorder").focus();
  				ip.ipInfoJump("导出顺序值需为整数！", "info");
  				//alert("导出顺序值需为整数！");
  				return false;
  			}/*else{
  				return true;
  			}*/
  		};
  		
  	     viewModel.myRenderType = function(obj){
      	   if(obj.value == "1"){
      		   obj.element.innerHTML = "是";
      	   }else if(obj.value == "0"){
      		   obj.element.innerHTML = "否";
      	   }else{
      		   obj.element.innerHTML = "";
      	   }
         };
  		
  	  validateName1 = function(id, value){
  			if(value == ""){
				$("#"+id).focus();
				ip.ipInfoJump("不能为空！", "info");
				return false;
			}
  		};
  		/*
  		 * 校验编码是否存在
  		 */
  		viewModel.checkCodeExist = function(){
  			var displayorderVal = $("#chrCode").val();
  			  $.ajax({
	        		url: "/df/msgConfig/isCodeExist.do?tokenid="+viewModel.tokenid,
	        		async: false,
	        		type:"GET",
	        		data: {
	        			"codeText": displayorderVal,
	        			//"rg_code":document.getElementById("rg_code").value,
	        			"financeCode":$("#finance_code").val(),
	        			ajax: "noCache",
	        		},
	        		success: function(data){
	        			if(data.result=="success"){
	        				if(data.isExist){
	        					$("#chrCode").focus();
	        	  				ip.ipInfoJump("编码已存在，请重新输入！", "info");
	        	  				flag=true;
	        				}
	        			}
	        		}
	        });
  		};
  		
  		/*
  		 * 编码以及名称表格行选中事件
  		 */
  		viewModel.onRowSelectedFun = function(){
			  var selected = viewModel.dataTable.getSelectedRows();
			  if(selected.length>0){
				  var chr_code = selected[0].data.chr_code.value;
				  $("#chrCode").val(selected[0].data.chr_code.value);
				  $("#chrName").val(selected[0].data.chr_name.value);
				  $("#billtable").val(selected[0].data.bill_table.value);
				  $("#vouchertable").val(selected[0].data.voucher_table.value);
				  $("#billdto").val(selected[0].data.bill_dto.value);
				  $("#voucherdto").val(selected[0].data.voucher_dto.value);
				  $("#billId").val(selected[0].data.bill_id.value);
				  $("#voucherId").val(selected[0].data.voucher_id.value);
				  $("#codeCompar").val(selected[0].data.code_comparison_id.value);
				  $("#referenceId").val(selected[0].data.reference_id.value);
				  $("#sender").val(selected[0].data.sender.value);
				  $("#receiver").val(selected[0].data.receiver.value);
				  $("#callback_class").val(selected[0].data.callback_class.value);
			  }
			  $.ajax({
	        		url: "/df/msgConfig/getFieldListByChrcode.do?tokenid="+viewModel.tokenid,
	        		type:"GET",
	        		data: {
	        			"chr_code": chr_code,
	        			//"rg_code":document.getElementById("rg_code").value,
	        			"financeCode":$("#finance_code").val(),
	        			ajax: "noCache",
	        		},
	        		success: function(data){
	        			if(data.result=="success"){
	        				viewModel.gridDataTable.setSimpleData(data.billColumnList, {unSelect:true});
	        				viewModel.gridDataTable1.setSimpleData(data.voucherColumnList, {unSelect:true});
	        			}
	        		},
	        		error: function(){
//	        			console.log("adad");
	        		}
	        });
		  };
	  	/*
	  	 * 新增按钮事件
	  	 */
		  viewModel.add = function(){
			  $("#refresh").attr("disabled",true);
			  editType="add";
			  $("#interface-form input, #interface-form button, #interface-form select").prop("disabled", false);
			  viewModel.gridDataTable.clear();
			  viewModel.gridDataTable1.clear();
			  $("#chrCode").attr("disabled", false);
			  $("#interface-form input").val(""); //清空所有的输入框
			  $("#sender option").eq(0).prop("selected", true);
			  $("#receiver option").eq(0).prop("selected", true);
			  $("#bill-btn-container").show();
			  $("#voucher-btn-container").show();
			  $("#update, #add, #del").attr("disabled", true);
			  $("#save, #cancel").attr("disabled", false);
		  };
	    /*
	  	 * 新增字段按钮事件
	  	 */
		  viewModel.addField = function(optype, type){
			  if(optype == "add"){
				  $("#modelTitleText").html("新增主单/明细字段信息"); 
				  $("#updateModalfield input, #updateModalfield select").val("");
				  if(type == "bill"){
					  $("#bill-sur-eleTree").show();
					  $("#voucher-sur-eleTree").hide();
					  $("#voucher-update-eleTree").hide();
					  $("#bill-update-eleTree").hide();
				  }else{
					  $("#bill-sur-eleTree").hide();
					  $("#voucher-sur-eleTree").show();
					  $("#voucher-update-eleTree").hide();
					  $("#bill-update-eleTree").hide();
				  }
			  }else if(optype == "update"){
				  //alert("adad");
				  $("#modelTitleText").html("修改主单/明细字段信息"); 
				  $("#bill-sur-eleTree").hide();
				  $("#voucher-sur-eleTree").hide();
				  if(type == "bill"){
					  $("#voucher-update-eleTree").hide();
					  $("#bill-update-eleTree").show();
					  var select = viewModel.gridDataTable.getSelectedRows();
				  }else{
					  $("#voucher-update-eleTree").show();
					  $("#bill-update-eleTree").hide();
					  var select = viewModel.gridDataTable1.getSelectedRows();
				  }
				  if(select.length != 1){
					  ip.ipInfoJump("请选中一条数据进行修改", "info");
					  return false;
				  }else{
					 
					  var data = select[0].getSimpleData();
//					  console.log("adadad");
//					  console.log(data);
					  for(key in data){
						  if(data[key] == null){
							  data[key] = ""; 
						  }
					  }
					  $("#filedName").val(data.field_name);
					  $("#description").val(data.description);
					  $("#dispfieldname").val(data.disp_field_name);
					  $("#datatype").val(data.data_type);
					  $("#displayorder").val(data.display_order);
					  $("#dataformate").val(data.data_format);
					  $("#defaultvalue").val(data.default_value);
					  $("#isnull").val(data.is_null);
					  $("#lenmin").val(data.len_min);
					  $("#lenmax").val(data.len_max);
					  $("#valset").val(data.val_set);
					//    $("#filedName").val(data.field_name);
					  
				  }
				  
			  }
			  
			  $("#updateModalfield").modal("show");
		  };
		  
		  /*
		   * 编码对照弹出树
		   */
		  viewModel.showCode = function(){
			  $("#modalElE").modal("show");
		  };
		  
		  /*
		   * 删除事件
		   */
		  viewModel.del = function(){
			  $("#refresh").attr("disabled",true);
				  var selected = viewModel.dataTable.getSelectedRows();
				  if(selected.length > 0){
//					  console.log(selected[0]);
					  if(confirm("确定删除【编码:"+selected[0].data.chr_code.value+"名称:"+selected[0].data.chr_name.value+"】的数据？")){
						  var chr_code = selected[0].data.chr_code.value;
					  }else{
						  $("#refresh").attr("disabled",false);
						  return false;
					  };
				  } else{
					  ip.ipInfoJump("请选择要删除的信息!", "error");
					  $("#refresh").attr("disabled",false);
					  return;
				  }
				  $.ajax({
		        		url: "/df/msgConfig/deleteInterfaceConfig.do?tokenid="+viewModel.tokenid,
		        		type:"POST",
		        		data: {
		        			"chr_code": chr_code,
		        			//"rg_code":document.getElementById("rg_code").value,
		        			"financeCode":$("#finance_code").val(),
		        			ajax: "noCache",
		        		},
		        		success: function(data){
		        			if(data.result=="success"){
		        				ip.ipInfoJump("删除成功!", "success");
		        				$("#interface-form input").val(""); //清空所有的输入框
		        				viewModel.gridDataTable.clear();
		        				viewModel.gridDataTable1.clear();
		        				viewModel.getleftTable(); //重刷表格
		        				viewModel.init();
		        			}else{
		        				ip.ipInfoJump("删除失败!", "error");
		        			}
		        		},
		        		error: function(){
		        			ip.ipInfoJump("删除失败!", "error");
		        		}
		        }); 
			  $("#refresh").attr("disabled",false);
		  };
		/*
		 * 编码对照确定事件
		 */
		  viewModel.sureBtn = function(){
			  var data_tree = $.fn.zTree.getZTreeObj("eleTree"); 
				var aim = $("#aim").val();
				var select_node = data_tree.getSelectedNodes();
				var tree_string = "";
				var tree_string_old = "";
				for (var i = 0; i < select_node.length; i++) {
					if (i == select_node.length - 1) {
						tree_string_old += select_node[i].cp_name;
						tree_string += select_node[i].cp_code;
					} else {
						//tree_string_old += select_node[i].cp_name + ",";
						//tree_string += select_node[i].id + "@" + encodeURI(select_node[i].chr_name, "utf-8") + "@" + select_node[i].chr_code + ",";
					}
				}
				
				$("#codeCompar").val(tree_string_old);
				$("#codeCompar-h").val(tree_string);
				$("#modalElE").modal('hide');  
		  };
		  /*
		   * 获取左边表格数据
		   */
		  viewModel.getleftTable = function(){
			  $.ajax({
	        		url: "/df/msgConfig/initMsgTypeTree.do?tokenid="+viewModel.tokenid,
	        		type:"GET",
	        		data: {
	        			ajax: "noCache",
	        			//"rg_code":document.getElementById("rg_code").value,
	        			"financeCode":$("#finance_code").val(),
	        		},
	        		success: function(data){
	        			if(data.result=="success"){
	        				viewModel.dataTable.setSimpleData(data.typeList, {unSelect:true});
	        				//编码对照id里面的数据
	        			//	viewModel.eleDataTable.setSimpleData(data.compList, {unSelect:true});
	        				
	        			}
	        		},
	        });
		  };
		  
		  /*
		   * 添加字段弹出框“确定”
		   */
		  viewModel.saveAddField = function(type,optype) {
			  //if(viewModel.validate()){
				  var fieldObj = {};
				  fieldObj["field_name"] = $("#filedName").val();
				  fieldObj["description"] = $("#description").val();
				  fieldObj["disp_field_name"] = $("#dispfieldname").val();
				  fieldObj["data_type"] = $("#datatype").val();
				  fieldObj["display_order"] = $("#displayorder").val();
				  fieldObj["data_format"] = $("#dataformate").val();
				  fieldObj["default_value"] = $("#defaultvalue").val();
				  fieldObj["is_null"] = $("#isnull").val();
				  fieldObj["len_min"] = $("#lenmin").val();
				  fieldObj["len_max"] = $("#lenmax").val();
				  fieldObj["val_set"] = $("#valset").val();
				  if(fieldObj["field_name"]==""||fieldObj["description"]==""||fieldObj["display_order"]==""){
					  ip.ipInfoJump("*为必填项，请补充填写！", "info");
					  //alert("*为必填项，请补充填写！");
					  return false;
				  }
				  var patt1=/^[0-9]*$/;
				  if(!patt1.test(fieldObj["display_order"])){
		  				$("#displayorder").val("");
		  				$("#displayorder").focus();
		  				ip.ipInfoJump("导出顺序值需为整数！", "info");
		  				//alert("导出顺序值需为整数！");
		  				return false;
		  		  }
				  //viewModel.validate();
				 
//				  console.log(type);
				  if(type == "primary" && optype == "add"){
					  viewModel.gridDataTable.addSimpleData([fieldObj],"add");
					  //viewModel.gridDataTable.setValue('is_null',$("#isnull").val());
				  }else if(type == "voucher" && optype == "add"){
					  viewModel.gridDataTable1.addSimpleData([fieldObj],"add");
					 // viewModel.gridDataTable1.setValue('is_null',$("#isnull").val());
				  }else if(type == "primary" && optype == "update"){
					  var index = viewModel.gridDataTable.getSelectedIndex();
					 var gridObj =  $("#grid2").parent()[0]['u-meta'].grid;
					 gridObj.updateRow(index,fieldObj);
					 //viewModel.gridDataTable.setValue('is_null',$("#isnull").val());
					 viewModel.gridDataTable.setRowUnSelect(index);
				  }else{
					  var index = viewModel.gridDataTable1.getSelectedIndex();
					  var gridObj =  $("#grid3").parent()[0]['u-meta'].grid;
					  gridObj.updateRow(index,fieldObj);
					 // viewModel.gridDataTable1.setValue('is_null',$("#isnull").val());
					  viewModel.gridDataTable1.setRowUnSelect(index);
				  }
				  $("#updateModalfield").modal("hide");
			  /*}else{
				  return false;
			  }*/
		  };
		  
		  /*
		   * 删除“字段”
		   */
		  viewModel.delField = function(type){
			  if(type == "bill"){
				  var selectIndex = viewModel.gridDataTable.getSelectedIndices();
				  if(selectIndex.length>0){
					  viewModel.gridDataTable.removeRows(selectIndex);
				  }
				  else{
					  ip.ipInfoJump("请选择要删除的信息!", "error");
					  return;
				  }
			  }else{
				  var selectIndex = viewModel.gridDataTable1.getSelectedIndices();
				  if(selectIndex.length>0){
					  viewModel.gridDataTable1.removeRows(selectIndex);
				  }
				  else{
					  ip.ipInfoJump("请选择要删除的信息!", "error");
					  return;
				  }
			  }
			  
		  };
		  /*
		   * 顶部修改"按钮"的方法
		   */
		  viewModel.update = function(){
			  editType="update";
			  //可编辑 
			  $("#interface-form input, #interface-form button, #interface-form select").prop("disabled", false);
			  $("#chrCode").attr("disabled", true);
			  var selected = viewModel.dataTable.getSelectedRows();
			  if(selected && selected.length){
//				  console.log(selected[0]);
				  $("#refresh").attr("disabled",true);
				  var chr_code = selected[0].data.chr_code.value;
				  $("#bill-btn-container").show();
				  $("#voucher-btn-container").show();
				  $("#update, #add, #del").attr("disabled", true);
				  $("#save, #cancel").attr("disabled", false);
			  }else{
				  $("#bill-btn-container").hide();
				  $("#voucher-btn-container").hide();
				  ip.ipInfoJump("请选择要修改的数据！", "info");
			  }
		  };
		  /*
		   * 页面初始化
		   */
		  viewModel.init = function(){
			  viewModel.getleftTable();
		  };
		 
		  /*
		   * 数据“保存”
		   */
		  viewModel.saveData = function(){
			  var commonSetting ={};
			  if(editType=='add'){
				  viewModel.checkCodeExist();
				  if(flag){
					  flag=false;
					  $("#refresh").attr("disabled",false);
					  return;
				  }
			  }
			  //必填字段非空校验
			  if(($("#chrCode").val()+"").trim()==""||($("#chrName").val()+"").trim()==""||($("#billtable").val()+"").trim()==""||($("#vouchertable").val()+"").trim()==""){
				  ip.ipInfoJump("*内容为必填项", "info");
				  //alert("*内容为必填项", "info");
				  return false;
			  }
			  //主单表名与明细表名不能相同
			  if($("#billtable").val()==$("#vouchertable").val()){
				  ip.ipInfoJump("主单表名称不能与明细表名称相同！", "info");
				  //alert("主单表名称不能与明细表名称相同！");
				  return false;
			  }
			  commonSetting["codeText"] = $("#chrCode").val();
			  commonSetting["nameText"] = $("#chrName").val();  
			  commonSetting["billTableBox"] = $("#billtable").val();
			  commonSetting["voucherTableBox"] =$("#vouchertable").val();
			  commonSetting["billClassText"] =$("#billdto").val();
			  commonSetting["voucherClassText"] =$("#voucherdto").val();
			  commonSetting["billId"] =$("#billId").val();
			  commonSetting["voucherId"] =$("#voucherId").val();
			  commonSetting["rererenceId"] =$("#referenceId").val();
			  commonSetting["code_comparison_id"] = $("#codeCompar-h").val();
			  commonSetting["sender"] = $("#sender").val() == null ? "":$("#sender").val();
			  commonSetting["receiver"] = $("#receiver").val() == null ? "" : $("#receiver").val();
			  commonSetting["callBackClass"] = $("#callback_class").val();
			  
			  var grid2 = $("#grid2").parent()[0]['u-meta'].grid;
			  var billdata = grid2.getAllRows();
			  var grid3 = $("#grid3").parent()[0]['u-meta'].grid;
			  var voucherdata = grid3.getAllRows();
			  var billArray = [];
			  var voucherArray = [];
			  for(var i =0; i < billdata.length; i++){
				  var item = {};
				 for(key in billdata[i]){
					if(key.indexOf("$") == -1){
						item[key] = billdata[i][key]==null?"":billdata[i][key];
					}
				 }
				 billArray.push(item);
			  }
			 
			  for(var i =0; i < voucherdata.length; i++){
				  var item = {};
				 for(key in voucherdata[i]){
					if(key.indexOf("$") == -1){
						item[key] = voucherdata[i][key]==null?"":voucherdata[i][key];
					}
				 }
				 voucherArray.push(item);
			  }
			  $.ajax({
				  url: "/df/msgConfig/saveOrUpdateFieldInfo.do?tokenid="+viewModel.tokenid,
				  type: "POST",
				  data: {
					  "commonSetting": JSON.stringify(commonSetting),
					  "billArray": JSON.stringify(billArray),
					  "voucherArray":JSON.stringify(voucherArray),
					  //"rg_code":document.getElementById("rg_code").value,
					  "financeCode":$("#finance_code").val(),
					  "ajax": "noCache"
				  },
				  success: function(data){
					  if(data.result == "success"){
						  ip.ipInfoJump("保存成功", "success");
						  $("#interface-form input, #interface-form button, #interface-form select").prop("disabled", true);
						  $("#bill-btn-container").hide();
						  $("#voucher-btn-container").hide();
						  viewModel.getleftTable();
						  $("#save, #cancel").attr("disabled",true);
						  $("#add, #update, #del, #refresh").attr("disabled", false);
						  $("#refresh").attr("disabled",false);
					  }
				  }
			  });
		  };
		  /*
		   * 取消“事件”
		   */
		  viewModel.cancel = function(){
			  //viewModel.init();
			  var selected = viewModel.dataTable.getSelectedRows();
			  $("#interface-form input, #interface-form button, #interface-form select").prop("disabled", true);
			  if(selected.length>0){
				  viewModel.onRowSelectedFun();
			  }else{
				  viewModel.gridDataTable.clear();
				  viewModel.gridDataTable1.clear();
			  }
			  $("#add, #update, #del, #refresh").attr("disabled", false);
			  $("#save, #cancel").attr("disabled", true);
			  $("#bill-btn-container").hide();
			  $("#voucher-btn-container").hide();
		  };
		  /*
		   * 刷新
		   */
		  viewModel.refresh = function(){
			  window.location.reload();
		  };
		  
		// 下拉框赋值
			viewModel.initCombo = function() {

				$.ajax({
							url : "/df/f_ebank/config/getFinanceOrgData.do?tokenid="
									+ viewModel.tokenid,
							type : "GET",
							dataType : "json",
							data : {
								"ajax" : "nocache"
							},
							success : function(datas) {
								if (datas.errorCode == "0") {
									for ( var i = 0; i < datas.dataDetail.length; i++) {
										var x = document
												.getElementById("finance_code");
										var option = document
												.createElement("option");
										option.text = datas.dataDetail[i].chr_name;
										option.value = datas.dataDetail[i].chr_code;

										try {
											// 对于更早的版本IE8
											x.add(option, x.options[null]);
										} catch (e) {
											x.add(option, null);
										}
										
										viewModel.init();

									}
								} else {
									ip.ipInfoJump("加载Combo失败！原因："
											+ datas.result, "error");
								}
							}
						})
			};
			//财政机构改变事件
			fGetGrid = function() {
				$("#interface-form input").val("");
				$("#sender option").eq(0).prop("selected", true);
				$("#receiver option").eq(0).prop("selected", true);
				viewModel.gridDataTable.clear();
				viewModel.gridDataTable1.clear();
				viewModel.init();
			};
			
			isNull = function(obj){
				if((obj.value+"").trim()==""){
					//$('#'+obj.id+'Tx').html('<font color="red">请输入内容</font>');
					//obj.style.color="red";
					//obj.value="请输入内容";
					obj.placeholder="请输入内容";
					obj.focus();
					//obj.style.color="";
				}else{
					obj.placeholder="";
				};
			};
		  
		  $(function(){
			var app = new u.createApp();
			app.init(viewModel);
		 // 初始化财政机构的下拉框
			viewModel.initCombo();
		  	//viewModel.getleftTable();
		  	//var r = viewModel.dt2.createEmptyRow();
		  });
	});

