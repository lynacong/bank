require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid', 'dateZH', 'ip'],
function ($, ko) {
	var viewModel = {
		type: [{
            "value": "oracle",
            "name": "oracle"
        }, {
            "value": "mysql",
            "name": "mysql"
        }],
		treeSetting:{
	        view:{
	            showLine:false,
	            selectedMulti:false
	        },
	        callback:{
	            onClick:function(e,id,node){
	            	window.test = viewModel.appgridDataTable;
	            	$.ajax({
	            		url:"/df/datasourceconfig/getrelations.do?tokenid=" + tokenid,
	            		data:{"ajax":"nocache","id":node.id},
	            		dataType:"json",
	            		type:"POST",
	            		success:function(data){
	            			var indecies = new Array(data.data.length);
	            			viewModel.appgridDataTable.setAllRowsUnSelect();
	            			data.data.forEach(function(value,index,array){
	            				var row = viewModel.appgridDataTable.getRowByField('guid',value["id"]);
	            				var index = viewModel.appgridDataTable.getIndexByRowId(row.rowId);
	            				indecies.push(index);
	            			});
	            			viewModel.appgridDataTable.setRowsSelect(indecies);
	            		}
	            		
	            	});
	            	
	            }
	        }
	    },
		//数据源配置表	
		gridDataTable: new u.DataTable({
	        meta: {
	        	'tablespace': {},
	            'type': {},
	            'name':{},
	            'ip':{},
	            'port':{},
	            'sid':{},
	            'username':{},
	            'passwd':{},
	            'updatetime':{}
	        }
	    }),
	    appgridDataTable: new u.DataTable({
	    	meta:{
	    		'id':{},
	    		'name':{}
	    	}
	    
	    }),
	    datasourceTree: new u.DataTable({
	        meta: {
	            'id': {
	                'value':""
	            },
	            'parentid': {
	                'value':"1"
	            },
	            'name':{
	                'value':""
	            }
	        }
	    })
	}
	var tokenid;
	//表格新增一行
	viewModel.addRow = function () {
		var year = new Date().getFullYear();
		var month = new Date().getMonth() + 1;
		var day = new Date().getDate();
		var h= new Date().getHours();     
		var m= new Date().getMinutes();
        var row = {
            "data": {
            	'tablespace': {},
	            'type': {},
	            'name':{},
	            'ip':{},
	            'port':{},
	            'sid':{},
	            'username':{},
	            'passwd':{},
	            'updatetime':year + "-" + month + "-" + day + "  " + h + ":" + m
            }
        };
		viewModel.gridDataTable.addSimpleData(row.data, 1);
    };
    //初始化界面表格
    viewModel.initDatasourceConfig = function(){
    	$.ajax({
    		url:"/df/datasourceconfig/initdatasourceconfig.do?tokenid=" + tokenid,
    		data:{"ajax":"nocache"},
    		dataType: "json",
    		type: "POST",
    		success:function(data){
    			viewModel.gridDataTable.setSimpleData(data.data);
    			viewModel.gridDataTable.setAllRowsUnSelect();
    		}
    	});
    	
    }
    
    //删除选中配置
    viewModel.deleteRows = function(){
    	var indexes = viewModel.gridDataTable.getSelectedIndexs();
    	var rows = viewModel.gridDataTable.getSelectedRows();
    	if(rows == null || rows == ""){
    		ip.ipInfoJump("请至少选择一条记录");
    		return;
    	}
    	viewModel.gridDataTable.removeRows(indexes);
    	rows.forEach(function(value, index, array){
    		if("guid" in value.data){
    			$.ajax({
    				url:"/df/datasourceconfig/deletedatasourceconfig.do?tokenid=" + tokenid,
    				data:{"ajax":"nocache","guid":value.data.guid.value},
    				dataType:"json",
    				type:"POST",
    				success:function(data){
    				}
    			});
    		}
    	});
    	ip.ipInfoJump("删除成功");
    }
    //刷新
    viewModel.refreshRows = function(){
    	viewModel.initDatasourceConfig();
    }
    //测试
    viewModel.testRow = function(){
    	var rows = viewModel.gridDataTable.getSelectedRows();
    	if(rows.length==1){
    		var arr = {};
    		var data = [];
    		for(var o in rows[0].data){
    			arr[o] = rows[0].data[o].value;
    		}
    		data.push(arr);
    		$.ajax({
        		url:"/df/datasourceconfig/testconnection.do?tokenid=" + tokenid,
        		data:{"ajax":"nocache","data":JSON.stringify(data)},
        		dataType:"json",
        		type:"POST",
        		success:function(data){
        			ip.ipInfoJump(data.msg);
        		}
        	});
    		
    	}else{
    		ip.ipInfoJump("请选择一条数据测试");
    		return;
    	}
    	
    }
    
    //获取子系统列表
    viewModel.getApps = function(){
    	$.ajax({
    		url: "/df/datasourceconfig/initappdata.do?tokenid=" + tokenid,
    		data: {"ajax":"nocache"},
    		dataType: "json",
    		type: "POST",
    		success: function(data){
    			viewModel.appgridDataTable.setSimpleData(data.data);
    			viewModel.appgridDataTable.setAllRowsUnSelect();
    		}
    	});
    	
    }
	//初始化数据源树
    viewModel.initDataSourceTree = function(){
		$.ajax({
			url:"/df/datasourceconfig/getdatasourcetree.do?tokenid="+tokenid,
			data:{"ajax":"nocache"},
			type:"POST",
			dataType:"json",
			success:function(data){
				var arr = {id:1,name:"数据源",parentid:0};
				data.data.push(arr);
				viewModel.datasourceTree.setSimpleData(data.data);
			}
		});
	}
    
    //获取关联关系
    $("#configRelations").on("click",function(){
    	viewModel.getApps();
    	
    	viewModel.initDataSourceTree();
    });
    
    //保存关联关系
    
    $("#saveConfigRelations").on("click", function(){
    	var treeObj = $.fn.zTree.getZTreeObj("datasourceTree-area");
    	var nodes = treeObj.getSelectedNodes();
    	var rows = viewModel.appgridDataTable.getSelectedRows();
    	var apps="";
    	rows.forEach(function(value,index,array){
    		apps += value.data.guid.value + "#";
    	});
    	
    	var arr = {
    		"datasource":nodes[0].id,
    		"apps":apps
    	};
    	
    	$.ajax({
    		url:"/df/datasourceconfig/saveconfigrelations.do?tokenid="+tokenid,
    		data:{"ajax":"nocache","data":JSON.stringify(arr)},
    		dataType:"json",
    		type:"POST",
    		success:function(data){
    			ip.ipInfoJump(data.msg);
    		}
    	});
    	
    });
    
    //保存数据源配置
    viewModel.saveRows = function(){
    	var flag = true;
    	var rows = viewModel.gridDataTable.getAllRows();
    	var tablearray = [];
    	//行遍历表中数据，判断表中数据是否为空
		rows.forEach(function(value,index,array){
			var rowarray = {};
			for(var o in value.data){
    			if(value.data[o].value==null||value.data[o]==" "){
    				ip.ipInfoJump("数据不允许为空");
    				flag = false;
    				return;
    			}
    			rowarray[o] = value.data[o].value;
			}
			tablearray.push(rowarray);
		});
    	if(flag&&tablearray!=null){
    		$.ajax({
    			url:"/df/datasourceconfig/savedatasourceconfig.do?tokenid="+tokenid,
    			data:{"ajax":"nocache","datasouceconfig":JSON.stringify(tablearray)},
    			type:"POST",
    			dataType:"json",
    			success:function(data){
    				ip.ipInfoJump(data.msg);
    			}
    		});
    	}
    }
    
   
    
	$(function () {
		var app = u.createApp({
			el: '.wrapper',
			model: viewModel
		});
		tokenid = ip.getTokenId();
		viewModel.gridDataTable.setSimpleData();
		viewModel.datasourceTree.setSimpleData();
		viewModel.appgridDataTable.setSimpleData();
		viewModel.initDatasourceConfig();
		window.b = viewModel.datasourceTree;
	});
	
});