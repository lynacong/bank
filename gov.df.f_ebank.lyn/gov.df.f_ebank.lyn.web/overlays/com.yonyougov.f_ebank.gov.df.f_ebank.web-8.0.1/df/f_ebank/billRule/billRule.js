 require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid','ip'],
 	function ($, ko) {
	 window.ko = ko;
	 //var tokenid = ip.getTokenId();
	 var treedata;
	    //新增或者修改 类型
 		var editType;
 		//var detailEditType;
 		var chr_id="";
 		var selectNode={};
 		var viewModel = {
 			tokenid: ip.getTokenId(),
 			dataArr: ko.observableArray(),
 			treeSetting:{
 				view:{
 					showLine:true,
 					selectedMulti:false
 				},
 				callback:{
 					onClick:function(e,id,node){
 						 selectNode=node;
 						 chr_id=node.chr_id;
 						 for(var i = 0,j=treedata.length; i < j; i++){
 							 if(treedata[i].chr_id==chr_id){
 								viewModel.gridDataTable.setSimpleData(treedata[i].billcombinefieldlist);
 								break;
 							 }
 						 }
			            }
			        }
			    },
			    
			    detailTreeSetting : {
			    	view : {
						showLine: true
						},
					edit: {
							enable: true,
							showRenameBtn: false,
							showRemoveBtn: false,
							drag: {
								isCopy: false,
								isMove: false
							}
						},
					callback : {
						onClick : function(e, id, node) {
							var idValue = node.id;
							// 获取该节点的详细信息 viewDetailTree
							var oThis = app.getComp(id);
							var rowId = oThis.getRowIdByIdValue(idValue);
							var index = oThis.dataTable.getIndexByRowId(rowId);
							var nodeData = viewModel.viewDetailTree.rows._latestValue[index].data;
							$("#ele_code").attr("disabled", true);
							$("#ele_name").attr("disabled", true)
							if(nodeData.is_ele.value=="0"){
								$("#level_num, #ele_rule").attr("disabled", true);
							}else{
								$("#level_num, #ele_rule").attr("disabled", false);
							}
							// 明细的详细信息
							$("#ele_code").val(nodeData.ele_code.value);
							$("#ele_name").val(nodeData.ele_name.value);
							$("#level_num").val(nodeData.level_num.value);
							$("#ele_rule").val(nodeData.ele_rule.value);
						}
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
			    		'show_name':{
			    			'value':""
			    		}
			    	}
			    }),
			    viewDetailTree :new u.DataTable({
					meta:{
						'chr_id':{},
						'parent_id':{},
						'name':{},
						'type_id':{},
						'ele_code':{},
						'ele_name':{},
						'ele_rule':{},
						'is_ele':{},
						'level_num':{},
						'num':{}
					}
				}),
			    gridDataTable: new u.DataTable({
			    	meta: {
			    		'name': {},
			    		'num': {}
			    	}
			    }),
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
								}
								//初始化左侧的树
								viewModel.initTree();
							} else {
								ip.ipInfoJump("加载Combo失败！原因："
										+ datas.result, "error");
							}
						}
					})
		};
 		//财政机构改变事件
 		fGetGrid = function() {
 			viewModel.gridDataTable.clear();
			viewModel.initTree();
		};
 		
 		//初始化左边树
 		viewModel.initTree=function(){
 			//var rg_code = document.getElementById("rg_code").value;
 			var financeCode = $("#finance_code").val();
 			$.ajax({
        		url: "/df/f_ebank/billRule/loadAllBillInfo.do?tokenid="+viewModel.tokenid,
        		type:"GET",
        		data: {
        			ajax: "noCache",
        			"financeCode" : financeCode,
        		},
        		success: function(data){
        			if(data.result=="success"){
        				treedata=data.eleList;
        				viewModel.treeDataTable.setSimpleData(data.eleList,{unSelect:true});
        				var treeObj = $.fn.zTree.getZTreeObj("tree_elerule");
        	 			treeObj.expandAll(true);
        	 			
        	 			for(var j = 0; j < treedata.length; j++){
        					if(chr_id==treedata[j].chr_id){
        						viewModel.treeDataTable.setRowSelect(j);
               	 			 for(var i = 0; i < treedata.length; i++){
       								 if(treedata[i].chr_id==chr_id){
       		       						viewModel.gridDataTable.setSimpleData(treedata[i].billcombinefieldlist);
       		       						break;
       								 }
       							 }
        						break;
        					}
						 }
        			}
        		}
        	});
 		};
 		
 		
 		//刷新
 		viewModel.refreshTree=function(){
 			viewModel.initTree();
 			chr_id="";
 			viewModel.gridDataTable.clear();
 			ip.ipInfoJump("刷新成功！","success");
 		};
 		
 		//新增合单规则
 		viewModel.add=function(){
 			editType="add";
 			$("#titleText").text("新增合单规则信息");
 			$("#billCombineCode").val('');
 			$("#billCombineName").val('');
 			viewModel.cleardetailpanl();
 			viewModel.viewDetailTree.clear();
 			$("#addBillCombineSetModel").modal("show");
 		};
 		
 		
 		//修改合单规则
 		viewModel.modify=function(){
 			editType="modify";
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要修改的信息！","info");
				return;
			}
 			$("#titleText").text("修改合单规则信息");
 			$("#billCombineCode").val(selectNode.bill_type_code);
 			$("#billCombineName").val(selectNode.bill_type_name);
			for(var i = 0,j=treedata.length; i < j; i++){
				 if(treedata[i].chr_id==chr_id){
					 viewModel.viewDetailTree.setSimpleData(treedata[i].billcombinefieldlist);
				 }
			}
			viewModel.cleardetailpanl();
 			$("#addBillCombineSetModel").modal("show");
 		};
 		//弹窗上的删除按钮
 		viewModel.delColumnButton = function(){
			
			var selectIndex = viewModel.viewDetailTree.getSelectedIndex();
			 viewModel.viewDetailTree.removeRow(selectIndex);
			 viewModel.cleardetailpanl();
			
		};
		//清空弹窗上明细的详细信息
		viewModel.cleardetailpanl=function(){
			$("#ele_code").val("");
			$("#ele_name").val("");
			$("#level_num").val("");
			$("#ele_rule").val("");
			$("#level_num, #ele_rule").attr("disabled", false);
		};
		//弹窗上左侧添加按钮
		viewModel.addColumnButton = function(){
			//viewModel.cleardetailpanl();
			$("#addCode").val("");
			$("#addName").val("");
			$("#addNum").val("");
			$("#addRule").val("");
			$("#addCol").show();
			//$("#addViewButton").show();
			//$("#ele").show();
			$("#category").val("1");
			$("#addNum, #addRule").attr("disabled", false);
			//detailEditType='add';
		};
		
		//判断是否是要素
		isEle=function(){
			var cge=document.getElementById("category").value;
			if(cge=="0"){
				$("#addCode").val("");
				$("#addNum").val("");
				$("#addRule").val("");
				$("#addNum, #addRule").attr("disabled", true);	
			}else{
				$("#addNum, #addRule").attr("disabled", false);
			}
		}
 		
        changeDeatil = function(info){
        	//if(detailEditType!='add'){
        		var fdgd = viewModel.viewDetailTree.getSelectedRows();
    			var rowDetail = viewModel.viewDetailTree.getRowByField("chr_id",(viewModel.viewDetailTree.getSelectedRows())[0].data.chr_id.value);
    			var val = info.value;
    			var id = info.id;
    			if(val==''){
    				return;
    			}
    			if(typeof(id)!="undefined"){
    				if(id=='ele_code'||id=='ele_name'){
    					rowDetail.setValue(id,val);
    					if(rowDetail.data.is_ele.value=="1"){
    						rowDetail.setValue("name",$("#ele_name").val()+"("+$("#ele_code").val()+")");
    					}else{
    						rowDetail.setValue("name",val);
    					}
    				}else{
    					rowDetail.setValue(id,val);
    				}
    				
    			}	
        	//}
			
		};
		//明细添加
		viewModel.addDetailButton = function(){
			
			var ele_code = $("#addCode").val();
			var ele_name = $("#addName").val();
			var is_ele = $("#category").val();
			var level_num = $("#addNum").val();
			var ele_rule = $("#addRule").val();
			var nodeData=viewModel.viewDetailTree.getSimpleData();
			if(ele_code==""){
				ip.ipInfoJump("要素编码不能为空！","info");
				return;
			}
			if(nodeData!=null){
				for(var i=0,j=nodeData.length;i<j;i++){
					if(ele_code==nodeData[i].ele_code){
						ip.ipInfoJump("要素编码已存在！","info");
						return;
					}
				}
			}
			if(ele_name==""){
				ip.ipInfoJump("要素要素名称不能为空！","info");
				return;
			}
			if(is_ele=="1"){
				if(level_num==""){
					ip.ipInfoJump("级次不能为空！","info");
					return;
				}
				if(ele_rule==""){
					ip.ipInfoJump("编码规则不能为空！","info");
					return;
				}
			}
			
			var othisDatatable = app.getComp("viewDetailTree").dataTable;
			var row = othisDatatable.createEmptyRow();
			row.setValue("chr_id",uuid());
			row.setValue("type_id",chr_id);
			row.setValue("ele_code",ele_code);
			row.setValue("ele_name",ele_name);
			row.setValue("level_num",level_num);
			row.setValue("ele_rule",ele_rule);
			row.setValue("is_ele",is_ele);
			row.setValue("num",level_num);
			if(is_ele=="1"){
				row.setValue("name",ele_name+'('+ele_code+')');
			}else{
				row.setValue("name",ele_name);
			}
			$("#addCol").css('display','none');
			//$("#addViewButton").css('display','none');
			//$("#ele").css('display','none');
			//detailEditType='';
		};
		//取消添加明细
		viewModel.cancelAddDetailButton = function(){
			$("#addCol").css('display','none');
			/*$("#addViewButton").css('display','none');
			$("#ele").css('display','none');
			$("#ele_code, #level_num, #ele_rule").attr("disabled", false);*/
			//detailEditType='';
		};
		
		viewModel.closeModel = function(){
			$("#addCol").css('display','none');
			$("#addBillCombineSetModel").modal("hide");
		};
		//随机生成明细id
		uuid = function() {
	        var s = [];
	        var hexDigits = "0123456789ABCDEFGHIJKLMNOPQRSTYVWXYZ";
	        for (var i = 0; i < 36; i++) {
	            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	        }
	        s[14] = "4"; 
	        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
	                                                            
	        s[8] = s[13] = s[18] = s[23] = "-";

	        var uuid = s.join("");
	        return "{"+uuid+"}";
	    };
		//弹框上右下角的确定事件
 		viewModel.saveOrUpdate=function(){
 			//var rgCode= document.getElementById("rg_code").value;
 			var financeCode = $("#finance_code").val();
 			var billCombineCode=$("#billCombineCode").val();
 			var billCombineName=$("#billCombineName").val();
 			if(billCombineCode==""){
 				ip.ipInfoJump("合单编码不能为空！","info");
				return;
			}
 			if(billCombineCode.length>6){
 				ip.ipInfoJump("合单编码不能超过6位！","info");
				return;
			}
			if(billCombineName==""){
 				ip.ipInfoJump("合单名称不能为空！","info");
				return;
			}
 			var getValidRows = viewModel.getDatasWithNotDel(viewModel.viewDetailTree);
 			$.ajax({
        		url: "/df/f_ebank/billRule/saveOrUpdateBillRuleInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"chr_id":chr_id,
        			"editType":editType,
        			"financeCode":financeCode,
        			"bill_combine_code":billCombineCode,
        			"bill_combine_name":billCombineName,
        			"field":JSON.stringify(getValidRows),
        			ajax: "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				$("#addBillCombineSetModel").modal("hide");
        				ip.ipInfoJump("保存成功！","success");
        				viewModel.initTree();
        				//viewModel.gridDataTable.clear();
        			}
        			else if(data.result=="fail"){
        				$("#addBillCombineSetModel").modal("hide");
        				ip.ipInfoJump(data.reason,"error");
        			}
        		}
        	});
 		};
 		 /**
	     * 获取弹窗的树中未删除的数据对象 
	     */
	    viewModel.getDatasWithNotDel = function(datatable){
	    	var rows = datatable.getAllRows();
		    var datas = [];
		    for (var i = 0, count = rows.length; i < count; i++) {
		    	if (rows[i].status != Row.STATUS.FALSE_DELETE && rows[i].status != Row.STATUS.DELETE){		    		
		    		if (rows[i]) datas.push(rows[i].getSimpleData());
		    	}
		    }return datas;
	    }
 		
 		//删除合单规则
 		viewModel.del=function(){
 			if(chr_id == "")
			{
				ip.ipInfoJump("请选择要删除的信息！","info");
				return;
			}
 			ip.warnJumpMsg("确定删除 【"+ selectNode.show_name +"】合单规则吗？", "del", "cCla");
 			$("#del").on("click", function() {
 				$.ajax({
 	        		url: "/df/f_ebank/billRule/delbillInfo.do?tokenid="+viewModel.tokenid,
 	        		type:"POST",
 	        		data: {
 	        			"chr_id":chr_id,
 	        			ajax: "noCache",
 	        		},
 	        		success: function(data){
 	        			if(data.result=="success"){
 	        				//刷新树
 	        				viewModel.refreshTree();
 	        				ip.ipInfoJump("删除成功！","success");
 	        			}
 	        		}
 	        	});
				$("#config-modal").remove();
			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
 		};
 			
 		$(function(){
 			app = u.createApp({
	            el: 'body',
	            model: viewModel
	        });
 			
 		// 初始化财政机构的下拉框
			viewModel.initCombo();
 			
			
 		});
	});

