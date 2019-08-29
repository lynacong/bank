require(['jquery', 'knockout', 'bootstrap', 'uui', 'director', 'tree', 'grid', 'dateZH', 'ip'],
function ($, ko) {
	var viewModel = {
	    treeSetting:{
			data: {
				key: {
					idname:"id"+"title"
				}
			},
			check: {
					enable: true,
					chkStyle: "checkbox"
				},
	        view:{
		        showLine:false,
	            selectedMulti:false
	        },
	        callback:{
	            onClick:function(e,id,node){
	                // alert(id)
	                // alert(node)
	                var rightInfo = node.name + '被选中';
	                u.showMessage({msg:rightInfo,position:"top"})
	            }
	        }
	    },
	    treeDataTable: new u.DataTable({
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
	//点击确定直接关闭实例(平台)
	viewModel.warnJump=function(){
		ip.warnJumpMsg("确定删除吗？",0,0,true);
	}
	//点击删除弹出框实例（写逻辑）
	viewModel.warnJump1=function(){
		ip.warnJumpMsg("确定删除吗？","sid","cCla");
		//处理确定逻辑方法
		 $("#sid").on("click",function(){
		 	//处理确定逻辑方法
		 	alert("删除成功！");
		 });
		 
		 $(".cCla").on("click",function(){
		 	//处理取消逻辑方法
		 	$("#config-modal").remove();
		 })
	}
	//
	//点击确定直接关闭实例(业务系统)
	viewModel.warnJumpSys=function(){
		ip.warnJumpMsgSys("提示信息","确定删除吗？",0,0,true);
	}
	//点击删除弹出框实例（写逻辑）
	viewModel.warnJumpSys1=function(){
		ip.warnJumpMsgSys("提示信息","此处可编辑信息","sidsys","cClasys");
		//处理确定逻辑方法
		 $("#sidsys").on("click",function(){
		 	//处理确定逻辑方法
		 	alert($("#msg-notice-sys").val());
		 	alert("删除成功！");
		 });
		 
		 $(".cClasys").on("click",function(){
		 	//处理取消逻辑方法
		 	$("#config-modal-sys").remove();
		 })
	}
	viewModel.pageChangeFun = function(pageIndex){
		 viewModel.gridDataTable.pageIndex(pageIndex);
		 viewModel.getDataTableStaff();
	}
	viewModel.sizeChangeFun = function(size){
		viewModel.gridDataTable.pageSize(size);
	    viewModel.gridDataTable.pageIndex("0");
	    viewModel.getDataTableStaff();
	},
	viewModel.getDataTableStaff = function () {
		var gridDatas = {
			"totalPages":5,
			"totalElements":22,
			"datas": [
					{
						"handler": "wuchr11111111",
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
		}
		viewModel.gridDataTable.setSimpleData(gridDatas.datas);
		viewModel.gridDataTable.totalPages(gridDatas.totalPages);
	    viewModel.gridDataTable.totalRow(gridDatas.totalElements);
	}
	ko.cleanNode($('body')[0]);
	var app = u.createApp({
	    el: document.body,
	    model: viewModel
	})
	var data = {
		"treeDatas" : [
					{
				    	"id": "01",
				    	"pid": "root",
				    	"title": "单位会计科目"  
				  	},
					{
						"id": "02",
				        "pid": "root",
				        "title": "负债类"
				  	},
					{
						"id": "201",
				        "pid": "02",
				        "title": "收入户存款"
				  	},
					{
						"id": "101",
				        "pid": "01",
				        "title": "支出户存款"
				  	},
					{
						"id": "102",
				        "pid": "01",
				        "title": "现金"
				  	}
				],
				"gridDatas" : {
					"totalPages":5,
					"totalElements":22,
					"datas": [
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						},
						{
							"handler": "成功",
	            			"defi": "医疗",
	            			"enablement":"kk",
	            			"source":"styleSheetSets"
						}
					]
				}
	}
	viewModel.treeDataTable.setSimpleData(data.treeDatas);
	viewModel.gridDataTable.pageIndex("0");
	viewModel.gridDataTable.pageSize("5");
	viewModel.gridDataTable.setSimpleData(data.gridDatas.datas);
	viewModel.gridDataTable.totalPages(data.gridDatas.totalPages);
	viewModel.gridDataTable.totalRow(data.gridDatas.totalElements);
    $('.form_date').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn:  1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0
	});
});
    
function commafy(id){
	//var str = $(this).val();
	//$(this).
	var num="";
	var value = $("#"+id).val();
	if(value.indexOf(".") == -1){
		num = value.replace(/\d{1,3}(?=(\d{3})+$)/g,function(s){
			return s+',';
		});
	}else{
		num = value.replace(/(\d)(?=(\d{3})+\.)/g,function(s){
			return s+',';
		});
	}
	$("#"+id).val(num);
}
