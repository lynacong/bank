function setDataTables(gridArea,columnList,param,gridData){
    var returnTable = $('#'+gridArea).DataTable(
	  $.extend(true, {},  param.gridParam, {
		  aaData:gridData,
		  columns: initColumn(columnList,param),
	        "columnDefs" : [ {
	        "targets" : ["_all"],
	        "render" : function(data, type, full) {
	          if (data == null||data=='undefined') {
	              return "";
	            }
	              return data;
	          }
	        
	        } ],
	     select: {
	            style: 'multi' /* os,single,multi, multi+shift,api*/
	            //selector: 'td.select-checkbox',
	        }
	  
	  }));
     returnTable.columns().header().to$().removeClass("text-right").addClass("text-center");
     if(param.sortnum==undefined||param.sortnum){
         returnTable.on('draw.dt', function () {
         //给第一列编号
          returnTable.column(1, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
             cell.innerHTML = i + 1;
          });
        });
     }
    
     return returnTable;
 }

//构造普通表格（非视图配置表格）
var drawCommonGrid = function(tableId,busiData,columnsData,columnsDefsConfig){
	$('#'+tableId).DataTable( {
		destroy: true,
	    searching: false,
        paging: false,
        bSort: false,
        bInfo: false,
        language: {
        	'zeroRecords': '没有检索到数据'
        },
        select: {
            style: 'os', 
            items: 'row'
        },
        data:busiData,
        columns: columnsData,
        columnDefs:columnsDefsConfig
    });
}

//组装表头信息
var initColumn=function(columnList,param,tableArea){
	var columns = new Array();
	//第一列复选框列
	if(param.selectflag==undefined || param.selectflag){
	  var column0 = {   // Checkbox select column
          data: 'select_col',
          defaultContent: '',
          className: 'select-checkbox',
          name:'ckbox',
          orderable: false,
		  "width": "40px",
          title:"<input type='checkbox' style='width:14px;height:14px;min-width:20px!important;margin-left:14px;' id='all_checked"+tableArea+"'/>",
      };
      columns.push(column0);
    }
	//序号列
	if(param.sortnum==undefined||param.sortnum){
      var column1 = {
          "title": "序号",
          "className": "text-left",
          "orderable": false,
          "data": "row_num",
          "targets": 0,
          "width": "40px"
      };
      columns.push(column1);
	}
	//视图配置的列
	for (var i = 0; i < columnList.length; i++) {
//		var defaultWwidth = "120px";
//		if(columnList[i].width == ""){
//			columnList[i].width = defaultWwidth;
//		}
		var temp = {};
		temp["data"] = columnList[i].id;
		temp["title"] = columnList[i].name;
		temp["className"] ='text-left';
		temp["width"] = columnList[i].width;
		if( columnList[i].visible=='false'){
			temp["visible"] =false;
		}
		columns.push(temp);
	}
	return columns;
};
//显示跳转页输入框和按钮
var showSpecificPageCom = function(tableArea){
	$("#"+tableArea+"_paginate").prepend("<div class='jump-to-page'>"+
			"到第 <input class='form-control margin text-center jump-input'"+
			" id='changePage_"+	tableArea +"' type='text' onkeyup=validatePageInput(\""+tableArea+"\")"+
			" onkeydown='if(event.keyCode == 13){toSpecificPage(\""+tableArea+"\");}'> 页 "+
			" <button class='btn btn-primary' style='margin-top:0;height:32px;padding:8px 10px;' href='javascript:void(0);' id='dataTable-btn_"+tableArea+"'>确认</button></div>");
	$('#dataTable-btn_'+tableArea).click(function(){
		toSpecificPage(tableArea);
	});
}
//跳转页面函数
var toSpecificPage = function(tableArea){
	var table = $("#"+tableArea).DataTable();
	var changePageText = $("#changePage_"+tableArea).val();
	var maxPageNum =  table.page.info().pages;
	//输入为空时，不进行任何操作
    if (changePageText == null || changePageText === '') {
        return;
    }
	if(changePageText && changePageText > 0 && changePageText <= maxPageNum) {
		var redirectpage = changePageText - 1;
	} else {
		var redirectpage = 0;
	}
	table.page(redirectpage).draw(false);
};

//校验页码输入框
var validatePageInput = function(tableArea){
	var textGotoPage = $("#changePage_"+tableArea).val();
    //清除非数字
	$("#changePage_"+tableArea).val(textGotoPage.replace(/[\D]/g, ''));
};
//初始化表格
var initDataTables = function (tableArea,url,param,columnList,loadDataFlag) {
	var sumData = {};
    var returnTable = $('#'+tableArea).DataTable(
        $.extend(true, {}, param.gridParam, {
          ajax: function (data, callback) {
          	param["start"]=data.start;
          	param["length"]=data.length;
          	if(param["loadDataFlag"]){
          		param["order"]=data.columns[data.order[0].column].data+" "+data.order[0].dir;
          		$.ajax ({
  	                'url': url,
  	                "type": "GET",
  	                "data": param,
  	              
  	                success: function (data) {
  	                	if(data.flag==false){
  	                		if(data.result == "该年度数据不存在"){
  	                			callback({data:[],recordsTotal:0,recordsFiltered:0});
  	                		}else if(data.result == "查询区金额格式输入不正确"){
  	                			callback({data:[],recordsTotal:0,recordsFiltered:0});
  	                		}
                			ip.warnJumpMsg(data.result,0,0,true);
  	                		return;
  	                	}
  	                	if(data.data.length == 0){//没数据时，统计json数据为空对象
  	                		sumData = {};
  	                	}else{
  	                		// 添加表格序号列数据
  	                		for(var i=0;i<data.data.length;i++){
  	  	                		data.data[i]["row_num"] = i+1;
  	  	                	}
  	                		//表格有统计列标志，计算金额总和
  	  	                	if(param["sumFlag"]){ 
  	  	                		var sumRow = {"select_col":"合计"};
	  	  	                	for(var i = 0; i < columnList.length; i++){
	  	                			if(columnList[i].sumflag == 'true'){
	  	                				var sumColumName = columnList[i].id;
	  	                				var sumColumData = 0.00;
	  	                				for(var j=0,rowdata=data.data;j<rowdata.length;j++){
	  	                					sumColumData += parseFloat(rowdata[j][sumColumName]);
	  	                					if(isNaN(sumColumData)){
	  	                						sumColumData = 0.00;
	  	  	                		  	  }
	  	    	  	                	}
	  	                				sumRow[sumColumName] = sumColumData.toFixed(2);
	  	                			}
		  	                	}
	  	  	                	data.data.unshift(sumRow);
  	  	                	}
  	                	}
  	                    callback(data);
  	                },
  	                error: function (e) {
  	                	sumData = {};
  	                    callback({data:[]});
  	                }
  	            }); 
          	}else{
          		 sumData = {};
          		 var valueDatas = param["setDatas"];
          		 if(valueDatas==null)
          		   callback({data:[],recordsTotal:0,recordsFiltered:0});
          		 else{
          		   callback({data:valueDatas,recordsTotal:valueDatas.length,recordsFiltered:valueDatas.length}); 
          		 }
          	}
			
        },
        scrollY: param["scrollY"],// "180px"
        columns: initColumn(columnList,param,tableArea),
        "columnDefs" : [
        	{
        	"targets" : ["_all"],
    		"render" : function(data, type, full) {
    			if (data == null||data=='undefined') {
    				return "";
    			}
    			return type === 'display' && data.length > 25 ?
    				        '<span title="'+data+'">'+data.substring( 0, 15 )+'...</span>' :
    				        data;
    			//return data;
    		}
        }],
		select: {
            style: 'multi' /* os,single,multi, multi+shift,api*/
            //selector: 'td.select-checkbox',
        },
        "fnDrawCallback": function() { 
        	if(param["sumFlag"]){ 
        		// 修改合计列class，删除合计列复选框
            	$($("#"+tableArea).DataTable().row(0).node()).removeClass("odd").addClass("sum-row");
            	$($("#"+tableArea).DataTable().cell(0,0).node()).removeClass("select-checkbox").addClass("text-right");
        	}
        	//在表格绘制完成函数中设置全选复选框初始状态未选中
            $('#all_checked'+tableArea).prop('checked',false);
            //添加跳转到指定页
            showSpecificPageCom(tableArea);
        },
        }));
    
        returnTable.columns().header().to$().removeClass("text-right").addClass("text-center");
        
        $('#all_checked'+tableArea).click(function() {  
        	if( $('#all_checked'+tableArea).prop('checked')){
        		$("#"+tableArea).DataTable().rows('tbody tr').select();
        		// 全选不选中合计列
        		if(param["sumFlag"]){
        			$("#"+tableArea).DataTable().rows(0).deselect();
        		}
        	}else{
        		//通过表格的方法将表格全部不选中
        		$("#"+tableArea).DataTable().rows('tbody tr').deselect();
        	}
        });
        //监听表格行取消选中事件，行取消选中时全选复选框置为不选
        returnTable.on('deselect', function ( e, dt, type, indexes ) {
        	// deselect合计行时不把全选复选框勾掉
            if ( indexes != 0 ) {
            	var hasAllCheck = $('#all_checked'+tableArea).prop("checked");
            	if(hasAllCheck){
            		$('#all_checked'+tableArea).prop("checked",false);
            	}
            }
        });
        if(param["sumFlag"]){
        	returnTable.on('select', function ( e, dt, type, indexes ) {
            	// deselect合计行时不把全选复选框勾掉
                if ( indexes == 0 ) {
                	$($("#"+tableArea).DataTable().row(0).node()).removeClass("selected");
                }
            });
        }
        
        return returnTable;
    };
		 	
