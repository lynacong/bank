define([ 'jquery', 'knockout','ip'],
   function($,ko) {
	var childListFlag = true;
	var options = {};
	var viewModel = {
			itl1Data :[],
			itl2Data :[],
			itl3Data :[],
	};
	var tokenid = ip.getTokenId();
	
	//加载div中input,select和textarea数据3,获取CODE
	viewModel.getDataFromDiv = function(divId){
		var data = {};
		$("#"+divId+" input").each(function(){
			if(this.type=="radio"&&this.checked!=true&&this.checked!="checked"){//如果是radio按钮,且未被选中
				return ;
			}else if(this.type=="checkbox"&&this.checked!=true&&this.checked!="checked"){//如果是checkbox按钮,且未被选中
				return ;
			}else {
				if(this.value.indexOf(" ") > 0){
					if(this.name == "cardbank"){
						data[this.name] = this.value;
					}else{
						var value = this.value.split(" ");
						for(var i = 0;i<value.length;i++){
							if( value[i] == 'undefined' || value[i] == 'null'){
								value[i] = '';
							}
						}
			    		data[this.name+"_code"] = value[0]?value[0]:'';
			    		data[this.name+"_name"] = value[1]?value[1]:'';
					}
				}else{
					var value = this.value;
					if( value == 'undefined' || value == 'null'){
						value = '';
					}else{
						data[this.name] = this.value;
					}
				}
				
			}
		});
		$("#"+divId+ " select").each(function(){
			if(this.value.indexOf(" ") > 0){
				var value = this.value.split(" ");
				for(var i = 0;i<value.length;i++){
					if( value[i] == 'undefined' || value[i] == 'null'){
						value[i] = '';
					}
				}
				if(this.name == "pay_account"){
					data[this.name+"_no"] = value[0]?value[0]:'';
					data[this.name+"_name"] = value[1]?value[1]:'';
					data[this.name+"_bank"] = value[2]?value[2]:'';
				}
			}else{
				var value = this.value;
				if( value == 'undefined' || value == 'null'){
					value = '';
				}else{
					if(this.name == "coll_type"){
						data["colltype_code"] = this.value;
						data["colltype_name"] = $(this).find("option:selected").text();
					}else{
						data[this.name] = this.value;
					}
				}
			}
		
		});
		$("#"+divId+" textarea").each(function(){
			data[this.name] = this.value;
		})
		//options[storeName] = JSON.stringify([ data ]);
		return data;
	}
	viewModel.clearData = function(id){
		$("#"+id+" input").each(function(){
			if(this.type == "radio" || this.type == "checkbox") {
				this.checked = false;
			}else {
				this.value = "";
			}
			//默认选中第一个
			if(this.type == "radio"&&this.value == 1) {
				this.checked = true;
			}
		});
		$("#"+id+" select").each(function(){
			var arr = $(this).children("option");
			//默认选中第一个
			for(var i = 0;i < arr.length;i++){
				if(i == 0) {
					arr[i].selected = "selected";
				}else {
					arr[i].selected = "";
				}
			}
		});
		$("#"+id+" textarea").each(function(){
			this.value = "";
		});
	};

	viewModel.validateNull = function(){
		var flag = true;
		//获取所有的必填项
		$("label.color-red,label.require").each(function(){
			$(this).next().children("input").each(function(){
				if(this.value == ""||this.value==null || this.value==undefined){
					flag = false;
				}
			});
			$(this).next().children("select").each(function(){
				if(this.value == ""||this.value==null || this.value==undefined){
					flag = false;
				}
			});
			$(this).next().children("textarea").each(function(){
				if(this.value == ""||this.value==null || this.value==undefined){
					flag = false;
				}
			});
		});
		return flag;
	}
	//对常用的身份证号、手机号、电子邮件的验证
	viewModel.validateCommon = function(id,type){
		 var ID_REG = /(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/;//15位或者18位，15位的全为数字，18位的前17位为数字，最后一位为数字或者大写字母X
		 var PHONE_REG = /^1[3|4|5|7|8][0-9]{9}$/;//11位数字，以1开头
		 var EMAIL_REG = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    	 var NON_NEGETIVE_REG = /^\d+$/;//非负整数
    	 var paramFlag;//后台校验是否有重复
    	 var flag = true;
    	 var tempValue = $("#"+id).val();
    	 if(tempValue != ""){
    		switch(type){
	 		 	case "ID":
	 		 		paramFlag = "1";
	 		 		flag = ID_REG.test(tempValue);
	 		 		break;
	 		 	case "PHONE":
	 		 		paramFlag = "2";
	 		 		flag = PHONE_REG.test(tempValue);
	 		 		break;
	 		 	case "EMAIL":
	 		 		paramFlag = "3";
	 		 		flag = EMAIL_REG.test(tempValue);
	 		 		break;
	 		 	case "NON_NEGETIVE":
	 		 		flag = NON_NEGETIVE_REG.test(tempValue);
	 		 		break;
	 		 	default:
	 		 		break;
    		}
	     	if(flag == false){
	     		 var validateTitle = $("#"+id).parent().prev("label").text();
	     		 if(validateTitle.indexOf("*") == 0){
	     			validateTitle = validateTitle.substring(1,validateTitle.length);
	     		 }
	     		 ip.warnJumpMsg("非法的"+validateTitle+"!", 0, 0, true);
	              $("#"+id).focus();
	              return false;
	     	 }
    	 }
    	
    };
    
	//删除列表数据
	viewModel.doDelete = function(gridViewModel,deleteUrl,backFunc,options) {
		var ids = gridViewModel.gridData.getSimpleData({
			type : 'select',
			fields:['CHR_ID']
		});
		if (ids.length == 0) {
			ip.ipInfoJump("请选择数据!","info");
		} else {
			var list = [];
			for(var i=0;i<ids.length;i++){
				list.push(ids[i].CHR_ID);
			}
			// 删除操作进行确认
			ip.warnJumpMsgSys("提示信息", "确定删除吗", "sidsys", "cancelCla");
			// 点击确定
			$("#sidsys").on("click", function() {
				$.ajax({
					async : true,
					type : 'POST',
					url : deleteUrl,
					data : JSON.stringify(list),
					contentType:"application/json",
					dataType : 'json',
					success : function(data) {
						if (data.flag == true) {
							$("#config-modal-sys").remove();
							ip.ipInfoJump(data.msg,"success");
							if(typeof backFunc == 'function'){
			            		backFunc();
		            		}
						} else {
							$("#config-modal-sys").remove();
							ip.warnJumpMsg(data.msg, 0, 0, true);
						}
					}
				});
			});
			// 点击取消
			$(".cancelCla").on("click", function() {
				$("#config-modal-sys").remove();
				return;
			});

		}
	};

	//编辑数据初始化,将数据放到div中
	viewModel.initEditData = function(id,rowObj) {
		$("#"+id+" input").each(function(){
			if(this.type == "radio") {
				if(this.value==rowObj[this.name]) {
					this.checked = true;
				}
			}else if(this.type == "checkbox"){
				if(rowObj[this.name] && rowObj[this.name] == "1"){
					this.checked = true;
				}
			}else {
				if(rowObj[this.name]==null || rowObj[this.name] == undefined)
					rowObj[this.name] = "";
				else             
					this.value = rowObj[this.name]; 
			}
		});
		$("#"+id+" select").each(function(){
			var selectVal = rowObj[this.name];
			var arr = $(this).children("option");
			arr.each(function(){
				if(this.value == selectVal){
					this.selected = "selected";
				}else {
					this.selected = "";
				}
			});
		});
		$("#"+id+" textarea").each(function(){
			if(rowObj[this.name]==null || rowObj[this.name] == undefined)
				rowObj[this.name] = "";
			else             
				this.value = rowObj[this.name]; 
		});
	}
	


    return {       	
 	'doValidateNull' : viewModel.validateNull, //判空函数
 	'doValidateCommon' : viewModel.validateCommon,
 	'getDataFromDiv' : viewModel.getDataFromDiv, //获取表单数据
 	'clearData' : viewModel.clearData,//清空数据
 	'doDelete' : viewModel.doDelete, //表格批量删除行
 	'initEditData' : viewModel.initEditData
    }
});
