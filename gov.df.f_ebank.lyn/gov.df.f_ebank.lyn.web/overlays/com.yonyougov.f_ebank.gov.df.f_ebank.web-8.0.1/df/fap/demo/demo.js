$(function(){
	var viewModel = {
	    treeSetting:{
	        view:{
	            showLine:true,
	            selectedMulti:false
	        },
    		check: {
    			enable: true,
    			autoCheckTrigger: true,
    			chkboxType: { "Y": "ps", "N": "ps" }
    		},
	        callback:{
	            onClick:function(e,id,node){
	            	if(id=="tree1"){
	            		var rightInfo = node.name + '被选中';
		                $("#right-code").val(node.id);
		                $("#right-name").val(node.name);
	            	}
	               // u.showMessage({msg:rightInfo,position:"top"})
	
	
	            }
	        }
	    },
	    dataTableTree1: new u.DataTable({
	        meta: {
	            'id': {
	                'value':""
	            },
	            'pid': {
	                'value':""
	            },
	            'title':{
	                'value':""
	            }
	        }
	    }),
	    dataTableTree2: new u.DataTable({
	        meta: {
	            'id': {
	                'value':""
	            },
	            'pid': {
	                'value':""
	            },
	            'title':{
	                'value':""
	            }
	        }
	    }),
	    gridDataTable: new u.DataTable({
	        meta: {
	            'handler': {},
	            'defi': {},
	            'enablement':{},
	            'source':{}
	        }
	    }),
	    
	};
	//预览model function
	$('#ylModal').on('show.bs.modal', function (event) {
	});
	//关闭预览model function
	$('#ylModal').on('hidden.bs.modal', function (e) {
	});
	var app = u.createApp({
	    el: document.body,
	    model: viewModel
	})
	var data = {
	  "pageIndex": 1,
	  "pageSize": 10,
	  "rows": [
	    {
	      "status": "nrm",
	      "data": {
	        "id": "01",
	        "pid": "root",
	        "title": "Parent1"
	      }
	    },
	    {
	      "status": "nrm",
	      "data": {
	        "id": "02",
	        "pid": "root",
	        "title": "Parent2"
	      }
	    },
	    {
	      "status": "nrm",
	      "data": {
	        "id": "101",
	        "pid": "01",
	        "title": "Child11"
	      }
	    },
	    {
	      "status": "nrm",
	      "data": {
	        "id": "102",
	        "pid": "01",
	        "title": "mChild12"
	      }
	    },
	    {
	      "status": "nrm",
	      "data": {
	        "id": "201",
	        "pid": "02",
	        "title": "Child21111111111111111111111111111111111111111111111"
	      }
	    }
	  ],
	  "gridDatas" : 
		  [
 			{
 				"handler": "wuchr",
 		        "defi": "1",
 		        "enablement": "25",
 				"source": "25",
 		  	},
 			{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 			{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 			{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 			{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 		  	{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 		  	{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 		  	{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 		  	{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 		  	{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 		  	{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	},
 		  	{
 				"handler": "wuchr",
           		"defi": "1",
             	"enablement": "25",
 		    	"source": "25",
 		  	}
 		 ]
	};
	viewModel.dataTableTree1.setData(data);
	viewModel.gridDataTable.setSimpleData(data.gridDatas);
});
