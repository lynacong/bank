define(['text!pages/balanceConf/balanceConf.html','commonUtil',
        'jquery','uui','tree', 'bootstrap','ip',
        'datatables.net-bs','datatables.net-autofill-bs', 
        'datatables.net-buttons-bs', 'datatables.net-colreorder',
        'datatables.net-rowreorder', 'datatables.net-select',
        'datatables.net-scroller','datatables.net-keyTable', 
        'datatables.net-responsive'],function(html,commonUtil){
	var init =function(element,param){ 
		document.title=ip.getUrlParameter("menuname");
		var treedata;
	    //新增或者修改 类型
 		var editType;
 		var chr_id="";
 		var selectNode={};
 		var viewModel = {
 			tokenid :ip.getTokenId(),
 			treeSetting:{
 				view:{
 					showLine:false,
 					selectedMulti:false
 				},
 				callback:{
 					onClick:function(e,id,node){
 						 selectNode=node;
 						 chr_id=node.chr_id;
 						 for(var i = 0,j=treedata.length; i < j; i++){
 							 if(treedata[i].chr_id==chr_id){
 								 $('#gridTest').DataTable( {
 									 destroy: true,
 					 			    searching: false,
 					 		        paging: false,
 					 		        bSort: false,
 					 		        bInfo: false,
 							        language: {
 							            'zeroRecords': '没有检索到数据'
 							            },
								        data:treedata[i].balanceconffieldlist,
								        columns: [
								            { data: 'name' },
								            { data: 'num' }
								        ]
								    } );
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
							$("#ele_name").attr("disabled", true);
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
						'level_num':{},
						'num':{}
					}
				}),
			};

 		//初始化左边树
 		viewModel.initTree=function(){
 			var financeCode = $("#finance_code").val();
 			$.ajax({
        		url: "/df/f_ebank/balanceConf/loadAllBalanceConfInfo.do?tokenid="+viewModel.tokenid,
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
        						selectNode=treedata[j];
        						viewModel.treeDataTable.setRowSelect(j);
               	 			 for(var i = 0; i < treedata.length; i++){
   								 if(treedata[i].chr_id==chr_id){
   									 $('#gridTest').DataTable( {
   										destroy: true,
   	 					 			    searching: false,
   	 					 		        paging: false,
   	 					 		        bSort: false,
   	 					 		        bInfo: false,
   	 					 		   language: {
							            'zeroRecords': '没有检索到数据'
							            },
   								        data:treedata[i].balanceconffieldlist,
   								        columns: [
   								            { data: 'name' },
   								            { data: 'num' }
   								        ]
   								    } );
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
 		
 		//财政机构改变事件
 		fGetGrid = function() {
 			$('#gridTest').dataTable().fnClearTable();
			viewModel.initTree();
		};
 		//刷新
 		refreshTree=function(){
 			chr_id="";
 			viewModel.initTree();
 			$('#gridTest').dataTable().fnClearTable();
 			ip.ipInfoJump("刷新成功！","success");
 		};
 		
 		//新增额度配置
 		add = function(){
 			editType="add";
 			$("#titleText").text("新增额度配置信息");
 			$("#billTypeCode").val('');
 			$("#billTypeName").val('');
 			viewModel.cleardetailpanl();
 			viewModel.viewDetailTree.clear();
 			$("#addBalanceSetModel").modal("show");
 		};
 		
 		//修改额度配置
 		modify=function(){
 			editType="modify";
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要修改的信息！",0,0,true);
				return;
			}
 			$("#titleText").text("修改额度配置信息");
 			$("#billTypeCode").val(selectNode.bill_type_code);
 			$("#billTypeName").val(selectNode.bill_type_name);
			for(var i = 0,j=treedata.length; i < j; i++){
				 if(treedata[i].chr_id==chr_id){
					 viewModel.viewDetailTree.setSimpleData(treedata[i].balanceconffieldlist);
				 }
			}
			viewModel.cleardetailpanl();
 			$("#addBalanceSetModel").modal("show");
 		};
 		//弹窗上的删除按钮
 		delColumnButton = function(){
			var selectIndex = viewModel.viewDetailTree.getSelectedIndex();
			viewModel.viewDetailTree.removeRow(selectIndex);
			viewModel.cleardetailpanl();
		};
		
		//清空弹窗上额度配置明细的详细信息
		viewModel.cleardetailpanl = function(){
			$("#ele_code").val("");
			$("#ele_name").val("");
			$("#level_num").val("");
			$("#ele_rule").val("");
		};
		//弹窗上左侧添加按钮
		addColumnButton = function(){
			$("#addCode").val("");
			$("#addName").val("");
			$("#addNum").val("");
			$("#addRule").val("");
			$("#addCol").modal();
		};
		
        changeDeatil = function(info){
    		var fdgd = viewModel.viewDetailTree.getSelectedRows();
			var rowDetail = viewModel.viewDetailTree.getRowByField("chr_id",(viewModel.viewDetailTree.getSelectedRows())[0].data.chr_id.value);
			var val = info.value;
			var id = info.id;
			if(val ==''){
				return;
			}
			if(typeof(id)!="undefined"){
				if(id=='ele_code'||id=='ele_name'){
					rowDetail.setValue(id,val);
					rowDetail.setValue("name",$("#ele_name").val()+"("+$("#ele_code").val()+")");
				}else{
					rowDetail.setValue(id,val);
				}
			}	
		};
		//明细添加
		addDetailButton = function(){
			var ele_code = $("#addCode").val().trim();
			var ele_name = $("#addName").val().trim();
			var level_num = $("#addNum").val();
			var ele_rule = $("#addRule").val().trim();
			var nodeData=viewModel.viewDetailTree.getSimpleData();
			if(ele_code == ""){
				ip.warnJumpMsg("要素编码不能为空！",0,0,true);
				return;
			}
			if(nodeData != null){
				for(var i=0,j=nodeData.length;i<j;i++){
					if(ele_code==nodeData[i].ele_code){
						ip.warnJumpMsg("要素编码已存在！",0,0,true);
						return;
					}
				}
			}
			if(ele_name==""){
				ip.warnJumpMsg("要素名称不能为空！",0,0,true);
				return;
			}
			if(!level_num){
				ip.warnJumpMsg("级次不能为空！",0,0,true);
				return;
			}
			if(!ele_rule){
				ip.warnJumpMsg("编码规则不能为空！",0,0,true);
				return;
			}
			
			var othisDatatable = app.getComp("viewDetailTree").dataTable;
			var row = othisDatatable.createEmptyRow();
			row.setValue("chr_id",uuid());
			row.setValue("type_id",chr_id);
			row.setValue("ele_code",ele_code);
			row.setValue("ele_name",ele_name);
			row.setValue("level_num",level_num);
			row.setValue("ele_rule",ele_rule);
			row.setValue("num",level_num);
			row.setValue("name",ele_name+'('+ele_code+')');
			$("#addCol").modal('hide');
		};
		//取消添加明细
		cancelAddDetailButton = function(){
			$("#addCol").modal('hide');
		};
		closeModel = function(){
			$("#addCol").modal('hide');
			$("#addBalanceSetModel").modal("hide");
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
 		saveOrUpdate=function(){
 			var financeCode = $("#finance_code").val();
 			var billTypeCode=$("#billTypeCode").val();
 			var billTypeName=$("#billTypeName").val();
 			if(billTypeCode==""){
 				ip.warnJumpMsg("额度编号不能为空！",0,0,true);
				return;
			}
 			if(billTypeCode.length>6){
 				ip.warnJumpMsg("额度编号不能超过6位！",0,0,true);
				return;
			}
			if(billTypeName==""){
				ip.warnJumpMsg("额度名称不能为空！",0,0,true);
				return;
			}
 			var getValidRows = viewModel.getDatasWithNotDel(viewModel.viewDetailTree);
 			$.ajax({
        		url: "/df/f_ebank/balanceConf/saveOrUpdateBalanceConfInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"chr_id":chr_id,
        			"editType":editType,
        			"financeCode":financeCode,
        			"bill_type_code":billTypeCode,
        			"bill_type_name":billTypeName,
        			"field":JSON.stringify(getValidRows),
        			ajax: "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				$("#addBalanceSetModel").modal("hide");
        				ip.ipInfoJump("保存成功！","success");
        				viewModel.initTree();
        			}
        			else if(data.result=="fail"){
        				$("#addBalanceSetModel").modal("hide");
        				ip.warnJumpMsg(data.reason,0,0,true);
        			}
        		}
        	});
 		};
	    //获取弹窗的树中未删除的数据对象 
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
 		del=function(){
 			if(chr_id == ""){
 				ip.warnJumpMsg("请选择要删除的信息！",0,0,true);
				return;
			}
 			ip.warnJumpMsg("确定删除 【"+ selectNode.show_name +"】 额度配置吗？", "del", "cCla");
 			$("#del").on("click", function() {
 				$.ajax({
 	        		url: "/df/f_ebank/balanceConf/delBalanceConfInfo.do?tokenid="+viewModel.tokenid,
 	        		type:"POST",
 	        		data: {
 	        			"chr_id":chr_id,
 	        			ajax: "noCache",
 	        		},
 	        		success: function(data){
 	        			if(data.result=="success"){
 	        				ip.ipInfoJump("删除成功！","success");
 	        				//刷新树
 	        				viewModel.initTree();
 	        				$('#gridTest').dataTable().fnClearTable();
 	        			}
 	        		}
 	        	});
				$("#config-modal").remove();
				chr_id="";
			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
 		};
 		pageInit =function(){
 			app = u.createApp({
				el : element,
				model : viewModel
			});
 			var param = ip.getCommonOptions({});
 		    // 初始化财政机构的下拉框
 			commonUtil.initFinanceCode("",param);
 			
 			//初始化左侧的树
			viewModel.initTree();
			
			$('#gridTest').DataTable( {
				 destroy: true,
 			    searching: false,
 		        paging: false,
 		        bSort: false,
 		        bInfo: false,
		        language: {
		            'zeroRecords': '没有检索到数据'
		            },
			        data:null,
			        columns: [
			            { data: 'name' },
			            { data: 'num' }
			        ]
			    } );
 		};

 		$(element).html(html);	
 		pageInit();
 	};		
	return {
		init:init
	};
});

