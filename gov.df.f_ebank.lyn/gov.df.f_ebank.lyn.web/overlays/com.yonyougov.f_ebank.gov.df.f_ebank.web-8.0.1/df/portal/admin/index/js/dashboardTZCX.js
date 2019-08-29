/**
 * need dfp.js
 */

$(function() {
	//查找父级页面的“支付凭证查询”
	var linkPaySearch = $("body", parent.document).find('#topDanju .pay-detail-link');
	linkPaySearch.click(function(){
		subUrl = '/df/pay/centerpay/billsearch/billsearch.html?tokenid='+getTokenId();
		window.parent.addTabToParent("支付凭查询", subUrl);
	});
	console.log(linkPaySearch);
    //查询时间
    //获取当前年度
	var roleId = JSON.parse(sessionStorage.getItem("commonData")).svRoleId;
	if(roleId == "32335"){
		var html = '<option value="0">按处室</option><option value="1">按部门单位</option><option value="2">按功能科目</option>';
		$('#groupType').append(html);
		$("#add-condation").css("display","none");
	}else{
		var html = '<option value="1">按部门单位</option><option value="2">按功能科目</option>';
		$('#groupType').append(html);
		$("#add-condation").css("display","inline-block");
	}
	
	var myDate = new Date();
	var Year=myDate.getFullYear();
	
	var startTime = Year+'-01'+'-01';
	var month = myDate.getMonth()+1;
	if(month < 10){
		month = "-0" + month;
	}else{
		month = "-" + month;
	}
	var day = myDate.getDate();
	if(day < 10){
		day = "-0" + day;
	}else{
		day = "-" + day;
	}
	var endTime = Year+month+day;

	$('#searchTimeStart').val(startTime);
	
	$('#searchTimeEnd').val(endTime);
	
	$('.searchTimeEnd').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format : "yyyy-mm-dd"//日期格式
	});
	
	
	$('.searchTimeStart').datetimepicker({
		language: 'zh-CN',
		weekStart: 1,
		todayBtn: 1,
		autoclose: 1,
		todayHighlight: 1,
		startView: 2,
		minView: 2,
		forceParse: 0,
		format : "yyyy-mm-dd"//日期格式
	});
	//加载高级查询模态框
	createModal();
	//底部表格
	getInitData("0");
	//获取预算支出情况
	getTableData();
	//获取金箍棒数据
	getHighcharts();
	//全部，政府采购，三公经费，中央专款部分 点击事件
	$(".eleTypeBtn").click(function(){
		var eleType = ($(this).attr("data-eleType"));
		$("#eleType").attr("value",eleType);
		$(".eleTypeBtn").removeClass("selectTypeBtn");
		$(".eleTypeBtn").addClass("selectTypeBtnGray");
		$(this).removeClass("selectTypeBtnGray");
		$(this).addClass("selectTypeBtn");
		var type = $("#groupType").val();
		getInitData(type);
	});
	$(".start-time-btn").click(function(){
		$('#searchTimeStart').fdatepicker({
			format: 'yyyy-mm-dd'
		});
	});
	$(".end-time-btn").click(function(){
		$('#searchTimeStart').fdatepicker({
			format: 'yyyy-mm-dd'
		});
	});
	// 高级查询
	$("#payProgressStatementCheck").on("click", function () {
	    $("#payProgressGaoji").toggle();
	});
	
	$("#payProgressGaojiSubmit").on("click", function () {
		$("#payProgressGaoji").css("display", "none");
		var type = $("#groupType").val();
		getInitData(type);
	});
	
	$("#payProgressGaojiClose").on("click", function () {
		$("#payProgressGaoji").css("display", "none");
	});
	
	
    $("#payProgressGaoji").find("ul").find("li").each(function (i) {
        // 单查询-x，情况内容
        $(this).find("span:eq(0)").click(function () {
            $(this).parent("li").find("input").each(function () {
                $(this).val("");
            });
        });
    });
    
    //清空的时候去查询
    $("#add-condation li").find("span:eq(0)").click(function(){
    	$("#commonCode_NAME").val("");
    	$("#commonCode").val("");
    	var type = $("#groupType").val();
		getInitData(type);
		isRealSearch = false;
    });
	// 最大化

    $("#payProgressStatementMaxium").click(function () {
    	$("#tableContent").css('height',"600px");
    	$("#tableContent").css('width',"1300px");
    	getInitData();
    	dfp_util.maxDiv("tableContent", "执行进度");
        $(".layui-layer-close2").css('right', '-15px');
        $("#payProgressStatementMaxium").hide();
        $(".layui-layer-close").on("click", function () {
        	$("#tableContent").css('height',"300px");
        	$("#tableContent").css('width',"1300px");
        	$("#payProgressStatementMaxium").show();
        	var type = $("#groupType").val();
        	getInitData(type);
        });
    });
    
    $("#maxRightdiv").click(function () {
    	$("#dwzcGridContent").html("");
    	$("#dwzcGridContent").append("<table id='dwzcGrid'><table>");
    	$("#dwzcGridContent").css('height',"600px");
    	$("#dwzcGridContent").css('width',"1300px");
    	dfp_util.maxDiv("dwzcGridContent", "省级政府预算分配情况");
    	getHighcharts();
        $(".layui-layer-close2").css('right', '-15px');
        $("#maxRightdiv").hide();
        $(".layui-layer-close").on("click", function () {
        	$("#dwzcGridContent").css('height',"100%");
        	$("#dwzcGridContent").css('width',"100%");
        	$("#maxRightdiv").show();
        	$("#dwzcGridContent").html("");
        	$("#dwzcGridContent").append("<table id='dwzcGrid'><table>");
        	getHighcharts();
        });
    });
    $("#maxLeftdiv").click(function () {
    	$("#leftDivContent").css('height',"600px");
    	$("#leftDivContent").css('width',"1300px");
    	dfp_util.maxDiv("leftDivContent", "省级政府预算支出情况");
        $(".layui-layer-close2").css('right', '-15px');
        $("#maxLeftdiv").hide();
        $(".layui-layer-close").on("click", function () {
        	$("#leftDivContent").css('height', 'calc(100% - 60px)');
        	$("#leftDivContent").css('width',"100%");
        	$("#maxLeftdiv").show();
        });
    });
    
    //按处室切换事件 
    $("#groupType").change(function() {
    	isRealSearch = false;
    	var val = $("#groupType").val();
    	$("#commonCode").val("");
		$("#commonCode_NAME").val("");
    	if(val == "0"){
    		$("#liysdw,#liexpfunc").css("display","block");
    		$("#add-condation").css("display","none");
    	}else if(val == 1){//隐藏高级查询预算单位，显示功能科目
    		$("#liysdw").css("display","none");
    		$("#liexpfunc").css("display","block");
    		$("#add-condation").css("display","inline-block");
    		$("#add-condation label").text("预算单位");
    		$("#source-name").attr("name","AGENCY");
    		$("#commonCode_NAME").attr("name","AGENCY");
    		$("#common-modal-title").text("预算单位");
    		$("#liysdw input").val("");
    	}else{
    		$("#liysdw").css("display","block");
    		$("#liexpfunc").css("display","none");
    		$("#add-condation").css("display","inline-block");
    		$("#add-condation label").text("功能科目");
    		$("#source-name").attr("name","EXPFUNC");
    		$("#commonCode_NAME").attr("name","EXPFUNC");
    		$("#common-modal-title").text("功能分类");
    		$("#liexpfunc input").val("");
    	}
    	getInitData(val);
    });
});


var gridDataExp=null;

//公共弹窗
$("#source-name").click(function(){
	var element = $(this).attr("name");
	$.ajax({
		url : "/df/dic/dictree.do?tokenid="+getTokenId(),
		type : 'GET',
		dataType : "json",
		async :false,
		data : {
			"element" : element,
			"ajax" : 1
		},
		success:function(data){
			$("#commonCodeModal").modal("show");
			var zNodes = data.eleDetail;
			var rootNode ={chr_id:null,chr_name:"全部",chr_code:null,codename:"全部",parent_id:null,open:true};
			zNodes.push(rootNode);
			$.fn.zTree.init($("#commonCodeTree"), settingMuli, zNodes);
		}
	});
});
$("#commonCode_NAME").keyup(function(event){
	  if(event.keyCode ==13){
		  var element = $(this).attr("name");
		  var ele_value = $("#commonCode_NAME").val();
			$.ajax({
				url : "/df/dic/dictree.do?tokenid="+getTokenId(),
				type : 'GET',
				dataType : "json",
				async :false,
				data : {
					"element" : element,
					"ele_value":ele_value,
					"ajax" : 1
				},
				success:function(data){
					$("#commonCodeModal").modal("show");
					var zNodes = data.eleDetail;
					$.fn.zTree.init($("#commonCodeTree"), settingMuli, zNodes);
				}
			});
		  }
		});

//树的公共设置多选树
var settingMuli = {
		check: {
			enable: true,
			chkStyle: "checkbox"
		},
		data: {
			key: {
				name: "codename"
			},
			simpleData: {
				enable: true,
				//chr_code
				code:"chr_code",
				//当前节点id属性  
                idKey: "chr_id",
                //当前节点的父节点id属性 
                pIdKey: "parent_id",
                rootPId: "" 
			}
		},
		view: {showIcon: false}

	};

//单选树配置
var setting = {
		check: {
			enable: false
		},
		data: {
			key: {
				name: "codename"
			},
			simpleData: {
				enable: true,
				//chr_code
				code:"chr_code",
				//当前节点id属性  
                idKey: "chr_id",
                //当前节点的父节点id属性 
                pIdKey: "parent_id",
                rootPId: "" 
			}
		},
		view: {showIcon: false}
	};
function getTableData(){
	
    var params = {
        	tokenid:getTokenId()
        };
	
    $.ajax({
      url: "/df/pay/search/mainpage/getPayProgressByFunctype.do",
//		url: "tree_data1.json",
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (result) {
        	var data = result.mk_pay_progress;
        	//赋值
        	//一般预算
        	var ybys_payed_money='';
        	var ybys_pay_progress ='';
        	var ybys_dif_progress='';
        	var ybysHtml='';
        	//基金预算
        	var jjys_payed_money='';
        	var jjys_pay_progress ='';
        	var jjys_dif_progress='';
        	var jjysHtml='';
        	//国资预算
        	var gzys_payed_money='';
        	var gzys_pay_progress ='';
        	var gzys_dif_progress='';
        	var gzysHtml='';
        	
        	for(i=0;i<data.length;i++){
    		if(data[i].fundtype_code=='11'){
    			$("#ybys").text(parseFloat(Number(data[i].yusuan)/10000).toFixed(2));
            	ybys_payed_money=(data[i].payed_money /1e8).toFixed(2);
            	ybys_pay_progress =data[i].pay_progress;
            	ybys_dif_progress=data[i].dif_progress;
            	ybysHtml+='<div class="row-tab-div2"><span class="tab-span-info">已支出：</span><span class="tab-span-large">'+ ybys_payed_money +'</span><span class="tab-span-normal">亿元</span></div>';
            	ybysHtml+='<div class="row-tab-div2"><span class="tab-span-info">支出进度：</span><span class="tab-span-normal-jd">'+ybys_pay_progress+'%</span></div>';
            	if(ybys_dif_progress>0){
            		ybysHtml+='<div class="row-tab-div2"><span class="tab-span-info">比序时进度：</span><span class="tab-span-normal-jd upspan ">+'+ybys_dif_progress+'</span><span class="progress_span upback">快</span></div>';
            	}else{
            		ybysHtml+='<div class="row-tab-div2"><span class="tab-span-info">比序时进度：</span><span class="tab-span-normal-jd lowspan">'+ybys_dif_progress+'</span><span class="progress_span lowback">慢</span></div>';
            	}
            	$('#ggysData').html(ybysHtml);
            	
    			
    		}else if(data[i].fundtype_code=='12'){
    			$("#jjys").text(parseFloat(Number(data[i].yusuan)/10000).toFixed(2));
            	jjys_payed_money=(data[i].payed_money /1e8).toFixed(2);
            	jjys_pay_progress =data[i].pay_progress;
            	jjys_dif_progress=data[i].dif_progress;
            	
            	jjysHtml+='<div class="row-tab-div2"><span class="tab-span-info">已支出：</span><span class="tab-span-large">'+ jjys_payed_money +'</span><span class="tab-span-normal">亿元</span></div>';
            	jjysHtml+='<div class="row-tab-div2"><span class="tab-span-info">支出进度：</span><span class="tab-span-normal-jd">'+jjys_pay_progress+'%</span></div>';
            	if(jjys_dif_progress>0){
            		jjysHtml+='<div class="row-tab-div2"><span class="tab-span-info">比序时进度：</span><span class="tab-span-normal-jd upspan ">+'+jjys_dif_progress+'</span><span class="progress_span upback">快</span></div>';
            	}else{
            		jjysHtml+='<div class="row-tab-div2"><span class="tab-span-info">比序时进度：</span><span class="tab-span-normal-jd lowspan">'+jjys_dif_progress+'</span><span class="progress_span lowback">慢</span></div>';
            	}
            	$('#zfjjData').html(jjysHtml);
    			
    		}else if(data[i].fundtype_code=='13'){
    			$("#gzys").text(parseFloat(Number(data[i].yusuan)/10000).toFixed(2));
            	gzys_payed_money=(data[i].payed_money /1e8).toFixed(2);
            	gzys_pay_progress =data[i].pay_progress;
            	gzys_dif_progress=data[i].dif_progress;
            	
            	gzysHtml+='<div class="row-tab-div2"><span class="tab-span-info">已支出：</span><span class="tab-span-large">'+ gzys_payed_money +'</span><span class="tab-span-normal">亿元</span></div>';
            	gzysHtml+='<div class="row-tab-div2"><span class="tab-span-info">支出进度：</span><span class="tab-span-normal-jd">'+gzys_pay_progress+'%</span></div>';
            	if(gzys_dif_progress>0){
            		gzysHtml+='<div class="row-tab-div2"><span class="tab-span-info">比序时进度：</span><span class="tab-span-normal-jd upspan">+'+gzys_dif_progress+'</span><span class="progress_span upback">快</span></div>';
            	}else{
            		gzysHtml+='<div class="row-tab-div2"><span class="tab-span-info">比序时进度：</span><span class="tab-span-normal-jd lowspan">'+gzys_dif_progress+'</span><span class="progress_span lowback">慢</span></div>';
            	}
            	$('#gyzbData').html(gzysHtml);
    			
    		}
    		$("#current_time").text(Computationals());
    		/*下方的描述*/
    		/*$("#year_budget").text((Number($("#ybys").text())+Number($("#jjys").text())+Number($("#gzys").text())).toFixed(2));
    		$("#year_payed").text((Number($("#ggysData .tab-span-large").text()) + Number($("#zfjjData .tab-span-large").text())+Number($("#gyzbData .tab-span-large").text())).toFixed(2));
    		$("#year_payed_progress").text(((Number($("#year_payed").text())/Number($("#year_budget").text())).toFixed(2))*100+"%");
    		var a = Number($("#current_time").text().substring(0,2))-Number($("#year_payed_progress").text().substring(0,2));
    		if(a > 0){
    			$('#percent_progress').text("快"+ a);
    		}else{
    			$('#percent_progress').text("慢"+ -(a));
    		}*/
    		
    		
    	}
        	
       /*
        * 计算当前的序时进度
        */
       function Computationals(){
    	   var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    	   var date = new Date();
    	   var day = date.getDate();
    	   var month = date.getMonth(); //getMonth()是从0开始
    	   var year = date.getFullYear();
    	   var result = 0;
    	   for ( var i = 0; i < month; i++) {
    	   	result += dateArr[i];
    	   }
    	   result += day;
    	   if(result>0){
    		   result--;
    	   }
    	   //判断是否闰年
    	   if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
	    	   	result += 1;
	    	   	result = ((result/365)*100).toFixed(1)+"%";
    	   }else{
    		   result = ((result/365)*100).toFixed(1)+"%";
    	   }
    	  return result;
       }
        	
//        	
//        	//合计
//        	var dataSum = result.total_pay_progress;
//        	//支出
//        	var total_payed_money = (dataSum.total_payed_money /1e8).toFixed(2);
//        	//进度
//        	var total_pay_progress = dataSum.total_pay_progress ;
//        	//比序时进度
//        	var total_dif_progress = dataSum.total_dif_progress;
//        	
//        	var tableHtml ='';
//        	tableHtml +='<thead>';
//        	tableHtml +='<tr>';
//        	tableHtml +='<th>类别</th>';
//        	tableHtml +='<th>一般预算</th>';
//        	tableHtml +='<th>基金预算</th>';
//        	tableHtml +='<th>国资预算</th>';
//        	tableHtml +='<th>合计</th>';
//        	tableHtml +='</tr>';
//        	tableHtml +='<thead>';
//        	tableHtml +='<tbody>';
//        	tableHtml +='<tr>';
//        	tableHtml +='<td>支出</td>';
//        	tableHtml +='<td>'+ybys_payed_money+'</td>';
//        	tableHtml +='<td>'+jjys_payed_money+'</td>';
//        	tableHtml +='<td>'+gzys_payed_money+'</td>';
//        	tableHtml +='<td>'+total_payed_money+'</td>';
//        	tableHtml +='</tr>';
//        	tableHtml +='<tr class="jindu">';
//        	tableHtml +='<td>进度</td>';
//        	tableHtml +='<td>'+ybys_pay_progress+'%</td>';
//        	tableHtml +='<td>'+jjys_pay_progress+'%</td>';
//        	tableHtml +='<td>'+gzys_pay_progress+'%</td>';
//        	tableHtml +='<td>'+total_pay_progress+'%</td>';
//        	tableHtml +='</tr>';
//        	tableHtml +='<tr>';
//        	tableHtml +='<td>比序时进度</td>';
//        	if(ybys_dif_progress>0){
//        		tableHtml +='<td>+'+ybys_dif_progress+'</td>';
//        	}else{
//        		tableHtml +='<td class="redspan">'+ybys_dif_progress+'</td>';
//        	}
//        	if(jjys_dif_progress>0){
//        		tableHtml +='<td>+'+jjys_dif_progress+'</td>';
//        	}else{
//        		tableHtml +='<td class="redspan">'+jjys_dif_progress+'</td>';
//        	}
//        	
//        	if(gzys_dif_progress>0){
//        		tableHtml +='<td>+'+gzys_dif_progress+'</td>';
//        	}else{
//        		tableHtml +='<td class="redspan">'+gzys_dif_progress+'</td>';
//        	}
//        	if(total_dif_progress>0){
//        		tableHtml +='<td>+'+total_dif_progress+'</td>';
//        	}else{
//        		tableHtml +='<td class="redspan">'+total_dif_progress+'</td>';
//        	}
//        	
//        	tableHtml +='</tr>';
//        	tableHtml +='</tbody>';
        	
//        	$('#dataTable').html(tableHtml);
        },
        error: function () {
        	//
        }
    });
	
}
function createDataGrid(datas){
	$('#dwzcGrid').datagrid({
			width:'100%',
			height: '100%',
			rownumbers: false,
			collapsible:true,
			fitColumns:false,
			data:datas,
			method: 'get',
			idField:'mb_code',
			showFooter:true,
			singleSelect: true,
		  columns: [[
		    { field: 'mb_name', title: '资金处室', width: '15%', align: 'left'},
		    {field:'sort_progress',title:'排名',width:'10%',align:'center'},
		    { field: 'yusuan', title: '预算总额', width: '15%', align: 'center',
		    	formatter:function(value,row){
			    	if (value){
			    		var a = numThousandBreak(value);
			    		return '<div>' + a + '</div>';
				    	
			    	} else {
				    	return '';
			    	}
		    	}
		    },
		    { field: 'payed_money', title: '已支出金额', width: '15%', align: 'center',
		    	formatter:function(value,row){
			    	if (value){
			    		var a = numThousandBreak(value);
			    		return '<div>' + a + '</div>';
				    	
			    	} else {
				    	return '';
			    	}
		    	}
		    },
		    { field: 'canuse_money', title: '预算余额', width: '15%', align: 'center',
		    	formatter:function(value,row){
			    	if (value){
			    		var a = numThousandBreak(value);
			    		return '<div>' + a + '</div>';
				    	
			    	} else {
				    	return '';
			    	}
		    	}
		    },
		    { field: 'pay_progress', title: '预算支出进度', width: '16%', align: 'center',
		    	formatter:function(value){
			    	if (value){
			    		value = parseFloat(value).toFixed(1);
				    	var s = '<div style="color:#007AD1">' + value + '%' + '</div>'
				    	return s;
			    	} else {
				    	return '';
			    	}
		    	}
		    },
		    { field: 'dif_progress', title: '比序时进度', width: '15%', align: 'center',
		    	formatter:function(value){
			    	if (value <= 0){
				    	var s = '<div style="color:#E90000">' + value  + '</div>'
				    	return s;
			    	} else if(value > 0){
				    	var s = '<div>' + value  + '</div>'
				    	return s;
			    	}else{
			    		return '';
			    	}
		    	}
		    },
		    { field: 'mb_code', title: 'mb_code', width: 80, align: 'left','hidden':true}
		  ]],
          onLoadSuccess: function(row, data){
          	$("#dwzcGridContent .datagrid-view2 .datagrid-body").on('mousewheel', function(e){//
          	    var _self = $(this),
          	        delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
          	    if(delta > 0 && _self.scrollTop() === 0){//滑动到顶部，再往上滑就
          	        e.preventDefault();
          	    //滑动到底部，再往下滑就阻止默认行为
          	    }else if(delta < 0 && (_self.scrollTop() == _self.get(0).scrollHeight - _self.height())){
          	        e.preventDefault();
          	    }
          	});
          	
          	$("#dwzcGridContent .datagrid-cell").mouseenter(function(e){
          		var leftx = e.clientX;
          		var leftY = e.clientY;
          		var p = $("<div id='tree-grid-tips' style='position: absolute;left:"+leftx+"px;top:"+leftY+"px;padding:2px 10px;border:1px solid #ccc;border-radius:4px;background:#fff;'></div>");
          		if(!$("#tree-grid-tips")[0]){
          			$("body").append(p);
          			p.html($(this).html());
          		}else{
          			$("#tree-grid-tips").html($(this).html());
          		}
          		
          	}).mouseleave(function(){
          		$("#tree-grid-tips").remove();
          	});
          }
		});
}
var expDataGridData = {};
function getHighcharts(){
    var params = {
    		ajax:'ajax',
        	tokenid:getTokenId(),
        	"fundtype_code":"11"
        };
    $.ajax({
          url: "/df/pay/search/mainpage/getPayMbProgress.do",
          type: 'GET',
          data: params,
          dataType: 'json',
          success: function (datas) {
        	  var gridData = {};
        	  if(datas.flag == true){
        		  gridData["rows"] = datas.mk_pay_progress;
        		  for(var j=0;j < gridData["rows"].length; j++){
        			  gridData["rows"][j].mb_code = gridData["rows"][j].mb_code + j+ "a";
        		  }
        		  var total_pay_progress = {};
        		  total_pay_progress["yusuan"] = datas.total_pay_progress["total_yusuan"];
        		  total_pay_progress["payed_money"] = datas.total_pay_progress["total_payed_money"];
        		  total_pay_progress["canuse_money"] = datas.total_pay_progress["total_canuse_money"];
        		  total_pay_progress["pay_progress"] = datas.total_pay_progress["total_pay_progress"];
        		  total_pay_progress["dif_progress"] = datas.total_pay_progress["total_dif_progress"];
        		  total_pay_progress["mb_name"] = "合计";
        		  gridData["footer"] = [total_pay_progress];
        		  createDataGrid(gridData);
        		  expDataGridData.rows = datas.mk_pay_progress;
        		  expDataGridData.footer =[total_pay_progress];
        	  }else{
        		  expDataGridData.rows = {};
        		  gridData["rows"] = [];
        		  gridData["footer"] = [];
        		  createDataGrid(gridData);
        	  }
          }
    });
    
    /*
    $.ajax({
      url: "/df/pay/search/mainpage/getPayMbProgress.do",
//		url: "tree_data1.json",
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (result) {
        	//默认取全部
        	var dataTotalResult = result.total_pay_progress;
        	//预算
        	var total_yusuan=parseFloat((dataTotalResult.total_yusuan*10000/1e8).toFixed(2));
        	//余额
        	var canuse_money=parseFloat((dataTotalResult.total_canuse_money/1e8).toFixed(2));
        	//已支付
        	var payed_money=parseFloat((dataTotalResult.total_payed_money/1e8).toFixed(2));
        	// 序时进度
        	var time_progress=parseFloat(dataTotalResult.time_progress);
        	
        	var dataResult = result.mk_pay_progress;
        	var yusuan ;
        	//当不选择全部时
        	var fundTypeCode = $('#fundTypeCode').val();
        	for(i=0;i<dataResult.length;i++){
        		if(fundTypeCode!=null && fundTypeCode == dataResult[i].fundtype_code){
        			canuse_money = parseFloat((dataResult[i].canuse_money/1e8).toFixed(2));
        			payed_money = parseFloat((dataResult[i].payed_money/1e8).toFixed(2));
        			yusuan = parseFloat((dataResult[i].yusuan*10000/1e8).toFixed(2));
        			time_progress =parseFloat(dataResult[i].time_progress);
        		}
        	}
        	if(fundTypeCode==""){
    		    yusuan = total_yusuan;
    	     }
        	var remain_money = parseFloat((yusuan-payed_money).toFixed(2));
		    var jsonSeries = [
//		                      {name: '可用指标', data: [lastBgtMoney]},
//		                      {name: '已支付', data: [payMoney]}
		                      {name: '剩余预算',data:[remain_money]},
		                      {name: '已支付', data:[payed_money]}                      
		                      
		                  ];
			var chart = Highcharts.chart('dwzc', {
			    chart: {
			        type: 'bar',
			        height: 120
			        //,width: 600
			    },
			    credits: {enabled: false},
			    exporting: {enabled: false},
			    title: {text: ''},
			    xAxis: {
			        labels: {enabled: false},
			        tickWidth: 0//, // 次级刻线宽度
			        //categories: [''],
			        //lineWidth: 0,
			        //lineColor:'#fff'
			    },
			    yAxis: {
			        opposite: true, // 坐标轴对面显示
			        min: 0, // 起始值
			        tickWidth: 1,
			        tickPosition: 'outside',
			        tickLength: 20,
			        tickmarkPlacement: 'on', // 刻度线位置，“on”表示刻度线将在分类上方显示
			        //alternateGridColor: '#FDFFD5', // 相邻刻度线之间会用对应的颜色来绘制颜色分辨带
			        lineWidth: 5,
			        lineColor: '#fff',
			        offset: -15,
			        //offset: -55,
			        gridLineColor: '#FFF', // 辅助轴线颜色
			        title: {text: ''},
			        labels: { //y轴刻度文字标签
			            style: {
			                color: '#000',
			                "font-size": '14px'
			            },
			            formatter: function () {
			                return this.value// + '%'; //y轴加上%
			            }
			        },
			        plotLines: [{   //一条延伸到整个绘图区的线，标志着轴中一个特定值。
			            color: 'red', //'#108EE9',
			            dashStyle: 'Dash', //Dash,Dot,Solid,默认Solid
			            width: 2,
			            value: time_progress,  // TODO 序时进度，y轴显示位置
			            zIndex: 5,
			            label: {
			                text: '<span style="color:red">▲   <span><div style="color:black; ">序时进度   <span style="color:red">'+time_progress+'%</span></div>',//+xsjd+'%',//xsjd+'%',
			                align: 'left',
			                rotation: 0,
			                x: -9,
			                y: 80,
			                style: {
			                    'color': 'red',
			                    'fontWeight': 'bold',
			                    'font-size': '20px',
			                    'cursor': 'default'
			                }
			            },
			            events: {
			                mouseover: function (e) {
			                },
			                mouseout: function () {
			                }
			            }
			        }]
			    },
			    tooltip: { // style="color:{series.color}"
			        //followTouchMove:false,
			        //followPointer:false,
			        //headerFormat: '<small>{point.key}</small><br>',
			        headerFormat: '',
			        pointFormat: '<span >{series.name}</span>: <b>{point.y} (亿元)</b> ({point.percentage:.1f}%)<br/>',
			        shared: false
			    },
			    //colors: ['#F8A23C', '#7DC338'],
			    colors: ['#C5F594','#108EE9'],
			    legend: {
			        "enabled": false, // 隐藏图例
			        reversed: true,
			        //layout: 'horizontal',
			        align: 'right',
			        itemMarginTop: 18,
			        //itemMarginLeft: 250, // 底部margin-bottom
			        verticalAlign: 'top',
//			        x: 200,
			        y: -35,
			        floating: true,
			        borderWidth: 0,
			        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
			        shadow: false
			    },
			    plotOptions: {
			        series: {
			            stacking: 'percent',
			            dataLabels: {
			                enabled: true,
			                align: 'right',
			                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
			                style: {
			                    textShadow: '0 0 6px green'
			                },
			                formatter: function () {
			                    var percent = this.point.percentage || 0;
			                    return percent.toFixed(1) + '%';
			                }
			            },
			            events: {
			                legendItemClick: function () {	// 禁止图例点击
			                    return false;
			                },
			                click: function (event) {
			                    //支付状态
//			                    var zfzt = event.point.series.name;
//			                    var fundtypeCode = $("#payProgressYSLBGaojiInput_ID").val() || "";
//			                    var expfuncCode = $("#payProgressXMFLGaojiInput_ID").val() || "";
//			                    var bgtsourceCode = $("#payProgressZBLYGaojiInput_ID").val() || "";
//			                    var pAgencyCode = $("#payProgressYSDWGaojiInput_ID").val() || "";
//			                    //var agency = Base64.decode($("#svAgencyCode", parent.document).val());
//			                    var htmlParam = "&fundtypeCode=" + fundtypeCode + "&expfuncCode=" + expfuncCode + "&bgtsourceCode=" + bgtsourceCode + "&agencyCode=" + pAgencyCode;
//			                    if (zfzt == '已支付') {
//			                        window.parent.addTabToParent('已支付', '/df/pay/portalpay/statusquery/payrelated/payInfo.html?billtype=366&busbilltype=311&menuid=132C25064BD2BAE4627573EEA7BB9CA8&menuname=%u652F%u51FA%u8FDB%u5EA6%u652F%u4ED8%u4FE1%u606F&tokenid=' + getTokenId() + htmlParam);
//			                    } else if (zfzt == '可用指标') {
//			                        window.parent.addTabToParent('可用指标', '/df/pay/portalpay/input/payQuota.html?billtype=366&busbilltype=311&model=model5&menuid=B249D0506FCAAADDE98A515AB777DD31&menuname=%u652F%u51FA%u8FDB%u5EA6%u6307%u6807%u4FE1%u606F&tokenid=' + getTokenId() + htmlParam);
//			                    }
			                }
			            }
			        }
			    },
			    series: jsonSeries
			});
        	
        	
        	
        }
    
    });
    */
};
 
function getElementData(elment,treeid,type,setting){
	if(type == 1){//预算类别
		var zNodes = [
		          {chr_id: "1", chr_code: "1", chr_name: "全部", parent_id: "",codename:"全部"},
		          {chr_id: "02", chr_code: "11", chr_name: "一般预算", parent_id: "1",codename:"11 一般预算"},
                  {chr_id: "01", chr_code: "12", chr_name: "基金预算", parent_id: "1",codename:"12 基金预算"},
                  {chr_id: "03", chr_code: "13", chr_name: "国有资本经营预算", parent_id: "1",codename:"13 国有资本经营预算"}
                  /*{chr_id: "04", chr_code: "88", chr_name: "其他支出", parent_id: "1",codename:"88 其他支出"}*/
              ];
		$.fn.zTree.init($("#"+treeid), setting, zNodes);
		var treeObj = $.fn.zTree.getZTreeObj(treeid);
		treeObj.expandAll(true);
	}else{
		$.ajax({
			url : "/df/dic/dictree.do?tokenid="+getTokenId(),
			type : 'GET',
			dataType : "json",
			async :false,
			data : {
				"element" : elment,
				"ajax" : 1
			},
			success:function(data){
				var zNodes = data.eleDetail;
				var rootNode ={chr_id:null,chr_name:"全部",chr_code:null,codename:"全部",parent_id:null,open:true};
				zNodes.push(rootNode);
				$.fn.zTree.init($("#"+treeid), setting, zNodes);
			}
		});
	}
	
}

//生成模态框
function createModal(){
	//预算类别
	var bgtTypeModalHtml = '<div class="example-modal" style="width: 500px;">' +
    '<div class="modal fade" id="bgtTypeCodeModal" style="z-index:1500;">' +
    '   <div class="modal-dialog">' +
    '       <div class="modal-content" style="border-radius: 8px;">' +
    '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
    '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
    '                   <h4 class="modaltitle" id="bgtSourceCodeZTreeTitle">预算类别</h4>' +
    '               </div>' +
    '               <div class="modal-body" style="padding: 5px 10px;">' +
    '                   <label class="search-label">快速定位</label>'+
    '                   <input type="text" id="bgtTypeCodeTreeQuickQuery" value="" class="modalInput" placeholder="输入查询条件" onkeyup="quickQuery(\'bgtTypeCodeTreeQuickQuery\')" onkeydown="keyTreeNext(\'bgtTypeCodeTreeQuickQuery\',\'bgtTypeCodeTree\')")"> ' +
    '                   <button class="btn btn-primary search-btn" onclick="searchTree(\'bgtTypeCodeTreeQuickQuery\',\'bgtTypeCodeTree\')">查找</button>'+
    '                   <button class="btn btn-default search-next" onclick="nextSearch(\'bgtTypeCodeTreeQuickQuery\',\'bgtTypeCodeTree\')">下一个</button>'+
    '                   <div class="box box-info" style="border: solid 1px #ccc;overflow-y:auto;">' +
    '                       <ul id="bgtTypeCodeTree" class="ztree ztree-sm" ></ul>' +
    '                   </div>' +
    '               </div>' +
     '               <div class="modal-footer" style="padding: 5px 15px;">' +
     '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" onclick="eleModalConfirm(\'bgtTypeCodeTree\',\'bgtTypeCodeModal\',\'1\')">确定</button>' +
     '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
     '               </div>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>';
	//项目分类
    var agencyExpModalHtml = '<div class="example-modal" style="width: 500px;">' +
    '<div class="modal fade" id="agencyExpModal" style="z-index:1500;">' +
    '   <div class="modal-dialog">' +
    '       <div class="modal-content" style="border-radius: 8px;">' +
    '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
    '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
    '                   <h4 class="modaltitle" id="agencyExpTreeTitle">项目分类</h4>' +
    '               </div>' +
    '               <div class="modal-body" style="padding: 5px 10px;">' +
    '                   <label class="search-label">快速定位</label>'+
    '                   <input type="text" id="agencyExpTreeQuickQuery" value="" class="modalInput" placeholder="输入查询条件" onkeyup="quickQuery(\'agencyExpTreeQuickQuery\')" onkeydown="keyTreeNext(\'agencyExpTreeQuickQuery\',\'agencyExpTree\')")"> ' +
    '                   <button class="btn btn-primary search-btn" onclick="searchTree(\'agencyExpTreeQuickQuery\',\'agencyExpTree\')">查找</button>'+
    '                   <button class="btn btn-default search-next" onclick="nextSearch(\'agencyExpTreeQuickQuery\',\'agencyExpTree\')">下一个</button>'+
    '                   <div class="box box-info" style="border: solid 1px #ccc;overflow-y:auto;">' +
    '                       <ul id="agencyExpTree" class="ztree ztree-sm" class="modalInput""></ul>' +
    '                   </div>' +
    '               </div>' +
    '               <div class="modal-footer" style="padding: 5px 15px;">' +
    '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" onclick="agencyExpModalConfirm()">确定</button>' +
    '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
    '               </div>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>';
  //指标类型
    var bpTypeCodeModalHtml = '<div class="example-modal" style="width: 500px;">' +
    '<div class="modal fade" id="bpTypeCodeModal" style="z-index:1500;">' +
    '   <div class="modal-dialog">' +
    '       <div class="modal-content" style="border-radius: 8px;">' +
    '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
    '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
    '                   <h4 class="modaltitle" id="agencyExpTreeTitle">指标类型</h4>' +
    '               </div>' +
    '               <div class="modal-body" style="padding: 5px 10px;">' +
    '                   <label class="search-label">快速定位</label>'+
    '                   <input type="text" id="bpTypeCodeQuickQuery" value="" class="modalInput" placeholder="输入查询条件" onkeyup="quickQuery(\'bpTypeCodeQuickQuery\')" onkeydown="keyTreeNext(\'bpTypeCodeQuickQuery\',\'bpTypeCodeTree\')")"> ' +
    '                   <button class="btn btn-primary search-btn" onclick="searchTree(\'bpTypeCodeQuickQuery\',\'bpTypeCodeTree\')">查找</button>'+
    '                   <button class="btn btn-default search-next" onclick="nextSearch(\'bpTypeCodeQuickQuery\',\'bpTypeCodeTree\')">下一个</button>'+
    '                   <div class="box box-info" style="border: solid 1px #ccc;overflow-y:auto;">' +
    '                       <ul id="bpTypeCodeTree" class="ztree ztree-sm" class="modalInput""></ul>' +
    '                   </div>' +
    '               </div>' +
    '               <div class="modal-footer" style="padding: 5px 15px;">' +
    '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" onclick="eleModalConfirm(\'bpTypeCodeTree\',\'bpTypeCodeModal\',\'1\')">确定</button>' +
    '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
    '               </div>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>';
    //预算单位
    var agencyCodeModalHtml = '<div class="example-modal" style="width: 500px;">' +
    '<div class="modal fade" id="agencyCodeModal" style="z-index:1500;">' +
    '   <div class="modal-dialog">' +
    '       <div class="modal-content" style="border-radius: 8px;">' +
    '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
    '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
    '                   <h4 class="modaltitle" id="agencyExpTreeTitle">预算单位</h4>' +
    '               </div>' +
    '               <div class="modal-body" style="padding: 5px 10px;">' +
    '                   <label class="search-label">快速定位</label>'+
    '                   <input type="text" id="agencyCodeQuickQuery" value="" class="modalInput" placeholder="输入查询条件" onkeyup="quickQuery(\'agencyCodeQuickQuery\')" onkeydown="keyTreeNext(\'agencyCodeQuickQuery\',\'agencyCodeTree\')")"> ' +
    '                   <button class="btn btn-primary search-btn" onclick="searchTree(\'agencyCodeQuickQuery\',\'agencyCodeTree\')">查找</button>'+
    '                   <button class="btn btn-default search-next" onclick="nextSearch(\'agencyCodeQuickQuery\',\'agencyCodeTree\')">下一个</button>'+
    '                   <div class="box box-info" style="border: solid 1px #ccc;overflow-y:auto;">' +
    '                       <ul id="agencyCodeTree" class="ztree ztree-sm" class="modalInput""></ul>' +
    '                   </div>' +
    '               </div>' +
    '               <div class="modal-footer" style="padding: 5px 15px;">' +
    '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" onclick="eleModalConfirm(\'agencyCodeTree\',\'agencyCodeModal\',\'1\')">确定</button>' +
    '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
    '               </div>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>';
    // 预算来源modal
    var bgtSourceModalHtml = '<div class="example-modal" style="width: 500px;">' +
        '<div class="modal fade" id="bgtSourceCodeModal" style="z-index:1500;">' +
        '   <div class="modal-dialog">' +
        '       <div class="modal-content" style="border-radius: 8px;">' +
        '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
        '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
        '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
        '                   <h4 class="modaltitle" id="bgtSourceCodeZTreeTitle">预算来源</h4>' +
        '               </div>' +
        '               <div class="modal-body" style="padding: 5px 10px;">' +
        '                   <label class="search-label">快速定位</label>'+
        '                   <input type="text" id="bgtSourceCodeTreeQuickQuery" value="" class="modalInput" placeholder="输入查询条件" onkeyup="quickQuery(\'bgtSourceCodeTreeQuickQuery\')" onkeydown="keyTreeNext(\'bgtSourceCodeTreeQuickQuery\',\'bgtSourceCodeTree\')")"> ' +
        '                   <button class="btn btn-primary search-btn" onclick="searchTree(\'bpTypeCodeQuickQuery\',\'bgtSourceCodeTree\')">查找</button>'+
        '                   <button class="btn btn-default search-next" onclick="nextSearch(\'bgtSourceCodeTree\',\'bgtSourceCodeTree\')">下一个</button>'+
        '                   <div class="box box-info" style="border: solid 1px #ccc;overflow-y:auto;">' +
        '                       <ul id="bgtSourceCodeTree" class="ztree ztree-sm" ></ul>' +
        '                   </div>' +
        '               </div>' +
         '               <div class="modal-footer" style="padding: 5px 15px;">' +
         '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" onclick="bgtSourceModalConfirm()">确定</button>' +
         '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
         '               </div>' +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>';
    
    //指标流向
    var bgtDirCodeModalHtml = '<div class="example-modal" style="width: 500px;">' +
    '<div class="modal fade" id="bgtDirCodeModal" style="z-index:1500;">' +
    '   <div class="modal-dialog">' +
    '       <div class="modal-content" style="border-radius: 8px;">' +
    '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
    '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
    '                   <h4 class="modaltitle" id="bgtDirCodeZTreeTitle">指标流向</h4>' +
    '               </div>' +
    '               <div class="modal-body" style="padding: 5px 10px;">' +
    '                   <label class="search-label">快速定位</label>'+
    '                   <input type="text" id="bgtDirCodeTreeQuickQuery" value="" class="modalInput" placeholder="输入查询条件" onkeyup="quickQuery(\'bgtDirCodeTreeQuickQuery\')" onkeydown="keyTreeNext(\'bgtDirCodeTreeQuickQuery\',\'bgtDirCodeTree\')")"> ' +
    '                   <button class="btn btn-primary search-btn" onclick="searchTree(\'bpTypeCodeQuickQuery\',\'bgtDirCodeTree\')">查找</button>'+
    '                   <button class="btn btn-default search-next" onclick="nextSearch(\'bgtSourceCodeTree\',\'bgtDirCodeTree\')">下一个</button>'+
    '                   <div class="box box-info" style="border: solid 1px #ccc;overflow-y:auto;">' +
    '                       <ul id="bgtDirCodeTree" class="ztree ztree-sm" ></ul>' +
    '                   </div>' +
    '               </div>' +
    '               <div class="modal-footer" style="padding: 5px 15px;">' +
    '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" onclick="eleModalConfirm(\'bgtDirCodeTree\',\'bgtDirCodeModal\',\'1\')">确定</button>' +
    '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
    '               </div>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>';
  //功能分类
    var expfuncCodeModalHtml = '<div class="example-modal" style="width: 500px;">' +
    '<div class="modal fade" id="expfuncCodeModal" style="z-index:1500;">' +
    '   <div class="modal-dialog">' +
    '       <div class="modal-content" style="border-radius: 8px;">' +
    '           <div class="modal-header" style="padding: 10px 10px 5px 10px;">' +
    '               <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
    '                   <span aria-hidden="true" style="top: 4px;right: 5px;position: absolute;">×</span></button>' +
    '                   <h4 class="modaltitle" id="expfuncCodeZTreeTitle">指标流向</h4>' +
    '               </div>' +
    '               <div class="modal-body" style="padding: 5px 10px;">' +
    '                   <label class="search-label">快速定位</label>'+
    '                   <input type="text" id="expfuncCodeTreeQuickQuery" value="" class="modalInput" placeholder="输入查询条件" onkeyup="quickQuery(\'expfuncCodeTreeQuickQuery\')" onkeydown="keyTreeNext(\'bgtDirCodeTreeQuickQuery\',\'expfuncCodeTree\')")"> ' +
    '                   <button class="btn btn-primary search-btn" onclick="searchTree(\'bpTypeCodeQuickQuery\',\'bgtDirCodeTree\')">查找</button>'+
    '                   <button class="btn btn-default search-next" onclick="nextSearch(\'bgtSourceCodeTree\',\'bgtDirCodeTree\')">下一个</button>'+
    '                   <div class="box box-info" style="border: solid 1px #ccc;overflow-y:auto;">' +
    '                       <ul id="expfuncCodeTree" class="ztree ztree-sm" ></ul>' +
    '                   </div>' +
    '               </div>' +
    '               <div class="modal-footer" style="padding: 5px 15px;">' +
    '                   <button type="button" class="btn btn-primary" style="height: 30px;line-height: 1;" onclick="eleModalConfirm(\'expfuncCodeTree\',\'expfuncCodeModal\',\'1\')">确定</button>' +
    '                   <button type="button" class="btn btn-default" style="height: 30px;line-height: 1;" data-dismiss="modal">取消</button>' +
    '               </div>' +
    '           </div>' +
    '       </div>' +
    '   </div>' +
    '</div>';
    
    
//    $("body").append(fundTypeCodeModalHtml);  bgtTypeModalHtml、agencyExpModalHtml、bpTypeCodeModalHtml、agencyCodeModalHtml、bgtSourceModalHtml、bgtDirCodeModalHtml
    $("body").append(bgtTypeModalHtml);
    $("body").append(agencyExpModalHtml);
    $("body").append(bpTypeCodeModalHtml);
    $("body").append(agencyCodeModalHtml);
    $("body").append(bgtSourceModalHtml);
    $("body").append(bgtDirCodeModalHtml);
    $("body").append(expfuncCodeModalHtml); //功能分类
	//指标类别
	getElementData('','bgtTypeCodeTree','1',settingMuli);
	getElementData('BGTTYPE','bpTypeCodeTree','0',settingMuli);
	getElementData('AGENCY','agencyCodeTree','0',settingMuli);
	getElementData('EXPFUNC','expfuncCodeTree','0',settingMuli);
	var condition = "";
	var bgttypeValue = $("#bpTypeCode").val();
	if(bgttypeValue=="1"){
		condition = " and chr_code not like '99%'";
	}else if(bgttypeValue=="2"){
		condition = " and chr_code  like '99%'";
	}
	//预算来源
	$.ajax({
		url : "/df/dic/dictree.do?tokenid="+getTokenId(),
		type : 'GET',
		dataType : "json",
		async :false,
		data : {
			"condition" :condition,
			"element" : "BGTSOURCE",
			"ajax" : 1
		},
		success : function(data) {
			var zNodes = data.eleDetail;
			var rootNode ={chr_id:null,chr_name:"全部",chr_code:null,codename:"全部",parent_id:null,open:true};
			zNodes.push(rootNode);
			$.fn.zTree.init($("#bgtSourceCodeTree"), settingMuli, zNodes);
			 
		}
		
	});
	
	//指标流向
	$.ajax({
		url : "/df/dic/dictree.do?tokenid="+getTokenId(),
		type : 'GET',
		dataType : "json",
		async :false,
		data : {
			"element" : "BGTDIR",
			"ajax" : 1
		},
		success : function(data) {
			var zNodes = data.eleDetail;
			var rootNode ={chr_id:null,chr_name:"全部",chr_code:null,codename:"全部",parent_id:null,open:true};
			zNodes.push(rootNode);
			$.fn.zTree.init($("#bgtDirCodeTree"), settingMuli, zNodes);
			$('#bgtDirCode_NAME').val('1 本级');
			$('#bgtDirCode').val('1');
		}
	});
    //项目分类
	$.ajax({
		url : "/df/dic/dictree.do?tokenid="+getTokenId(),
		type : 'GET',
		dataType : "json",
		async :false,
		data : {
			"element" : "AGENCYEXP",
			"ajax" : 1
		},
		success : function(data) {
			var zNodes = data.eleDetail;
			var rootNode ={chr_id:null,chr_name:"全部",chr_code:null,codename:"全部",parent_id:null,open:true};
			zNodes.push(rootNode);
			$.fn.zTree.init($("#agencyExpTree"), settingMuli, zNodes);
			 var zTree = $.fn.zTree.getZTreeObj("agencyExpTree");
			   //默认选中所有
			 zTree.checkAllNodes(true); 
			//默认选中基本支出，项目支出	其余的不选择		 
			 var search_nodes = zTree.getNodesByParamFuzzy("chr_code",'103',null);
			 
			 for(i=0;i<search_nodes.length;i++){
				 search_nodes[i].checked =false;
				 zTree.updateNode(search_nodes[i]);
			 }
		
	    nodes = zTree.getCheckedNodes(true);
	    v="";
	    codeNameList="";
	    for(var i=1;i<nodes.length;i++){
	    v+=nodes[i].chr_code + ",";
	    codeNameList+=nodes[i].codename + ",";
	    }
			codeList=v;
			
	  // $("#agencyExp_NAME").val(codeNameList);
	   //$("#agencyExp").val(codeList);
		
		}
		
	});
	
}

function openModalTree(id){
	$('#'+id+'Modal').modal();
	treeSearchIndex = 1;
	indexSearch = 0;
}
function openModalTreebSour(id){
	var setting = {
			check: {
				enable: true,
				chkStyle: "checkbox"
			},
			data: {
				key: {
					name: "chr_name"
				},
				simpleData: {
					enable: true,
					//chr_code
					code:"chr_code",
					//当前节点id属性  
                    idKey: "chr_id",
                    //当前节点的父节点id属性 
                    pIdKey: "parent_id",
                    rootPId: "" 
				}
			},
			view: {showIcon: false}

		}; 
	var condition = "";
	var bgttypeValue = $("#bpTypeCode").val();
	if(bgttypeValue=="1," || bgttypeValue=="1"){
		condition = " and chr_code not like '99%'";
	}else if(bgttypeValue=="2,"){
		condition = " and chr_code  like '99%'";
	}
    
	
	//预算来源
	$.ajax({
		url : "/df/dic/dictree.do?tokenid="+getTokenId(),
		type : 'GET',
		dataType : "json",
		async :false,
		data : {
			"condition" :condition,
			"element" : "BGTSOURCE",
			"ajax" : 1
		},
		success : function(data) {
			$('#'+id+'Modal').modal();
			var zNodes = data.eleDetail;
			var rootNode ={chr_id:null,chr_name:"全部",chr_code:null,codename:"全部",parent_id:null,open:true};
			zNodes.push(rootNode);
			$.fn.zTree.init($("#bgtSourceCodeTree"), setting, zNodes);
			 
		}
		
	});
}
//资金性质
//function zjxzTreeOnClick(event, treeId, treeNode) {
//	$('#fundTypeCode').val(treeNode.chr_code);
//	$('#fundTypeCode_NAME').val(treeNode.chr_name);
//	$('#fundTypeCodeModal').modal('hide');
//};
//指标流向
/*function zblxTreeOnClick(event, treeId, treeNode) {
	$('#bgtDirCode').val(treeNode.chr_code);
	$('#bgtDirCode_NAME').val(treeNode.chr_name);
	$('#bgtDirCodeModal').modal('hide');
	
};*/

//预算来源确定按钮
function bgtSourceModalConfirm() {  
	//是否全选
    var zTree = $.fn.zTree.getZTreeObj('bgtSourceCodeTree');  
    //根据过滤机制获得zTree的所有节点              
    nodes = zTree.getCheckedNodes(true)
    v="";
    codeNameList="";
    for(var i=1;i<nodes.length;i++){
    v+=nodes[i].chr_code + ",";
    codeNameList+=nodes[i].codename + ",";
    }
		codeList=v;
		
   $("#bgtSourceCode_NAME").val(codeNameList);
   $("#bgtSourceCode").val(codeList);
    $('#bgtSourceCodeModal').modal('hide');
} 


//项目分类确定按钮
function agencyExpModalConfirm() {  
	//是否全选
    var zTree = $.fn.zTree.getZTreeObj('agencyExpTree');  
    //根据过滤机制获得zTree的所有节点              
    nodes = zTree.getCheckedNodes(true)
    v="";
    codeNameList="";
    for(var i=1;i<nodes.length;i++){
    v+=nodes[i].chr_code + ",";
    codeNameList+=nodes[i].codename + ",";
    }
		codeList=v;
		
   $("#agencyExp_NAME").val(codeNameList);
   $("#agencyExp").val(codeList);
    $('#agencyExpModal').modal('hide');
    
    
} 
var isRealSearch = false; //变量标识是否走后台查询
//高级查询弹窗关闭
function eleModalConfirm(treeId,modalId,type,inputId){ //type '0'单选
	 var zTree = $.fn.zTree.getZTreeObj(treeId);
	 if(!inputId){
		 var inputId = treeId.substring(0,treeId.length-4);
	 }else{
		 var inputId = inputId;
	 }
	 
	 var codeList="";
	 var codeNameList="";
    var j = 0;
    if(type != '0' ){
    	 nodes = zTree.getCheckedNodes(true);
    	for(var i = j;i<nodes.length;i++){
    		if(nodes[i].codename == "全部"){
        		continue;
        	}
    	    codeList+=nodes[i].chr_code + ",";
    	    codeNameList+=nodes[i].codename + ",";
        }
    }else{
    	nodes = zTree.getSelectedNodes();
    	if(nodes[0].codename == "全部"){
    		return false;
    	}
    	codeList+=nodes[0].chr_code;
    	codeNameList+=nodes[0].codename;
    }
   
    
   $("#"+inputId +"_NAME").val(codeNameList);
   $("#"+inputId).val(codeList);
   $('#'+modalId).modal('hide');
   treeSearchIndex = 1;
   indexSearch = 0;
   var parentNodes = [];
   if(treeId == "commonCodeTree"){
	   for(var n = 0; n < nodes.length; n++){
		   if(nodes[n].isParent && nodes[n].level == "1" && nodes[n].codename != "全部"){
			   parentNodes.push(nodes[n]);
		   }
	   }
	   if(parentNodes.length > 1){
		   var val = $("#groupType").val();
		   isRealSearch = true;
		   getInitData(val);
		   
	   }else{
		   //走模糊查询定位数据
		   if(isRealSearch){
			   	$("#commonCode_NAME").val("");
		    	$("#commonCode").val("");
		    	var type = $("#groupType").val();
				getInitData(type,parentNodes[0].codename);
		   }else{
			   highLightKeyWord(parentNodes[0].codename,'red','tableContent');  
			   isRealSearch = false;
		   }
		   
	   }
	   
   }
}
/*高亮显示*/
function highLightKeyWord(codename, color,gridArea) {
	var key = codename.split(" ")[0]; //树节点的code
	$("#" + gridArea + " tr").removeClass("hightlihgt-key-word");
	$("#" + gridArea + " tr").removeClass("datagrid-row-selected");
	if($("#groupType").val() == 1){
		var domhtml = $("#" + gridArea + " tr[node-id = '"+key+"']");
		if(document.querySelector("#" + gridArea + " tr[node-id = '"+key+"']") != null){
			document.querySelector("#" + gridArea + " tr[node-id = '"+key+"']").scrollIntoView(true);  
		}
	}else if($("#groupType").val() == 2){
		var domhtml = $("#" + gridArea + " tr[node-id = '"+key+"#0']" != null);
		if(document.querySelector("#" + gridArea + " tr[node-id = '"+key+"#0']")){
			document.querySelector("#" + gridArea + " tr[node-id = '"+key+"#0']").scrollIntoView(true);
		}
	}
	domhtml.addClass("hightlihgt-key-word");
};
function quickSearch(id){
	var element = $("#" + id).attr("name");
	var ele_value = $("#" + id).val();
	$.ajax({
		url: "/df/dic/dictree.do",
		type: "GET",
		async: true,
		data: {
			"element": element,
			"tokenid": getTokenId(),
			"quikSelect":"1",
			"ajax": "noCache",
			"ele_value": ele_value
		},
		success: function(data) {
			if (data.eleDetail.length > 0) {
				$("#" + id+'quickSelect').remove();
				var width = $("#" + id).width();
				var widthnum = Number(width)+10;
				var appendHtml = '<div id="'+id+'quickSelect" class="input-quick-ele-list" style="height: auto;z-index: 1500;background: #fff;position: absolute;top: 28px;border: 1px solid #ccc;width: '+widthnum+'px;"><ul>';
				for(var k = 0 ; k <data.eleDetail.length ; k++ ){
					var info = data.eleDetail[k];
					appendHtml = appendHtml + '<li data-key="'+info.chr_id+'@'+encodeURI(info.chr_name, "utf-8")+'@'+info.chr_code+'" class="bdsug-store bdsug-overflow" onmousedown="eleLiClick(\''+id+'\',this)">'+info.codename+'</li>'
				}
				appendHtml = appendHtml + '</ul></div>';
				$("#" + id).after(appendHtml);
				$("#" + id+'quickSelect').css("left",($("#agency-label-de").width() + 15) +'px');
			}else{
				$("#" + id+'quickSelect').remove();
			}
		}
	});
}

function eleLiClick(id,e){
	$("#" + id+"quickSelect ul li").removeClass("input-quick-ele-list-selected");
	$(this).addClass("input-quick-ele-list-selected");
	var value = $(e).attr("data-key");
	var text = $(e).text();
	$("#"+id).val(text);
	$("#commonCode").val(value);
	$("#" + id+'quickSelect').remove();
	var codename = text.split(" ")[0].substring(0,3) + " " + text.split(" ")[1];
	if(!isRealSearch){
		highLightKeyWord(codename,'red','tableContent');
		isRealSearch = false;
	}else{
		$("#commonCode_NAME").val("");
    	$("#commonCode").val("");
		var type = $("#groupType").val();
		getInitData(type,codename);
	}
}
function inputblur(id){
	//点击事件
	 $("#" + id+'quickSelect').hide();
};
function inputfucx(){
	$("#commonCode_NAME").val("");
	$("#commonCode").val("");
}/*需求变来变去，复选框*/
function getEleCode(inputName){
	var eleNameCheck = $("input[name="+inputName+"]");
	var codes = "";
	for(var m=0; m < eleNameCheck.length; m++){
		if(eleNameCheck.eq(m).is(":checked")){
			codes += eleNameCheck.eq(m).siblings("input").val()+ ',';
		}
	}
	return codes;
}
/*需求变来变去，复选框选中的label值*/
function getEleName(inputName){
	var eleNameCheck = $("input[name="+inputName+"]");
	var codes = "";
	for(var m=0; m < eleNameCheck.length; m++){
		if(eleNameCheck.eq(m).is(":checked") < eleNameCheck.length-1){
			names += eleNameCheck.eq(m).siblings("input").val()+ ',';
		}else{
			names += eleNameCheck.eq(m).siblings("input").val();
		}
		
	}
	return names;
}
function commonParams(){//初始化参数
	var beginDay = $('#searchTimeStart').val();//查询时间-开始
	var endDay =$('#searchTimeEnd').val();//查询时间-结束
	var fundTypeCode = $('#fundTypeCode').val();//资金性质
	var bgtSourceCode = $('#bgtSourceCode').val();//预算来源
	var bgtDirCode = $('#bgtDirCode').val();//指标流向
	var agencyExp = getEleCode('agencyExp');//项目分类[变为复选框]
	var eleType = getEleCode('eleType');//全部，政府采购，三公经费，中央专款部分[复选框]
	var groupType =$('#groupType').val();//按处室，按部门单位，按功能科目
	var bgtSourceCodeName =$("#bgtSourceCodeName").val();//预算来源
	//新增查询条件
	var bgtTypeCode = $("#bgtTypeCode").val();//预算类别
	if(groupType == "0"){//按业务处室
		var agencyCode = $("#agencyCode").val();//预算单位
		var agencyCode_NAME = $("#agencyCode_NAME").val();//预算单位
		var expfuncCode = $("#expfuncCode").val();//功能分类
		var expfuncCode_NAME = $("#expfuncCode_NAME").val();//功能分类
	}else if(groupType == "1"){//按单位
		if(isRealSearch)
		var agencyCode = $("#commonCode").val();//预算单位
		var agencyCode_NAME = $("#commonCode_NAME").val();//预算单位
		var expfuncCode = $("#expfuncCode").val();//功能分类
		var expfuncCode_NAME = $("#expfuncCode_NAME").val();//功能分类
	}else{//按功能分类
		var expfuncCode = $("#commonCode").val();//功能分类
		var expfuncCode_NAME = $("#commonCode_NAME").val();//功能分类
		var agencyCode = $("#agencyCode").val();
		var agencyCode_NAME = $("#agencyCode_NAME").val();//预算单位
	}
	var bpTypeCode = getEleCode('bpType');//指标类型【改为复选框】
	
	var expfuncFlag = getEleCode('expfuncFlag').substring(0,1);//不含线下支出
	/*需求变动 新增 现金支出查询不要了
	var setMoodCode = getEleCode('setMode');
	var paykindCode = getEleCode('payKind');
	*/
	var params = {
		ajax:'ajax',
    	beginDay:beginDay,
    	endDay:endDay,
    	fundTypeCode:fundTypeCode,
    	bgtSourceCode:bgtSourceCode,
    	bgtDirCode:bgtDirCode,
    	agencyExp:agencyExp,
    	eleType:eleType,
    	groupType:groupType,
    	top_id:'',
    	parent_id:'',
    	bgtTypeCode:bgtTypeCode,
    	agencyCode:agencyCode,
    	bpTypeCode:bpTypeCode,
    	expfuncCode:expfuncCode,
    	expfuncFlag:expfuncFlag,
    	file:$("#FileName").val() //指标文号
	 };
	return params;
}

//返回选中的参数
function checkedEleStr(){
	var param = '';
	var bpTypeChecked ='';
	var eleTypeChecked = '';
	var agencyExpChecked = '';
	var setModeChecked ='';
	var payKindChecked ='';
	//指标类型
	var bpType = $("input[name='bpType']");
	for(var i =0;i < bpType.length; i++){
		if(bpType.eq(i).is(":checked")){
			bpTypeChecked += i +',';
		}
	}
	param += "&bpTypeChecked=" + bpTypeChecked;
	//eleType
	var eleType = $("input[name='eleType']");
	for(var j =0;j < eleType.length; j++){
		if(eleType.eq(j).is(":checked")){
				eleTypeChecked += j +',';
		}
	}
	param += "&eleTypeChecked=" + eleTypeChecked;
	//项目分类
	var agencyExp = $("input[name='agencyExp']");
	for(var m =0;m < eleType.length; m++){
		if(agencyExp.eq(m).is(":checked")){
				agencyExpChecked += m +',';
			
		}
	}
	param += "&agencyExpChecked=" + agencyExpChecked;
	//现金支出
	/*if($("input[name='setMode']").eq(0).is(":checked")){
		setModeChecked = "0";
	}
	param += "&setModeChecked=" + setModeChecked;
	if($("input[name='payKind']").eq(0).is(":checked")){
		payKindChecked = "0";
	}
	param += "&payKindChecked=" + payKindChecked;*/
	return param;
}
function getInitData(type,codename){
	/*项目分类列举复选框*/
	var params = commonParams();
    var url = "/df/pay/search/mainpage/getTreeTableForMB.do?tokenid="+getTokenId();
    loadingImg(true);
    $.ajax({
		url: url,
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (data) {
        	gridDataExp=data;
        	loadingImg(false);
        	var foot = data.footer;
        	data.footer = [foot];
        	$('#treeGrid').treegrid({
        		width:'100%',
        		height: '100%',
        		rownumbers: false,
        		collapsible:true,
        		fitColumns:true,
        		data:data,
        		method: 'get',
        		idField:'id',
        		treeField:'ele_name',
        		showFooter:true,
        		singleSelect: true,
        		columns:[[
                    {field:'ele_name',title:'执行主体',width:180,align:'left'},
        			{field:'sort_progress',title:'排名',width:60,align:'center'},
        			{field:'avi_money',title:'已下达指标金额',width:180,align:'center',
        				formatter:function(value,row){
        			    	if (value){
        				    	var a = numThousandBreak(value);
        				    	if(row.state){
        			    			if(row.state == "open"){
        			    				return '<div class="money-decoration">' + a + '</div>';
        			    			}else{
        			    				return '<div>' + a + '</div>';
        			    			}
        			    		}else{
        			    			return '<div>' + a + '</div>';
        			    		}
        			    	} else {
        				    	return '';
        			    	}
        		    	}
        			
        			},
        			{field:'payed_money',title:'已支出金额',width:180,align:'center',
        				formatter:function(value,row){
        			    	if (value){
        			    		var a = numThousandBreak(value);
        			    		if(row.state){
        			    			if(row.state == "open"){
        			    				return '<div class="money-decoration">' + a + '</div>';
        			    			}else{
        			    				return '<div>' + a + '</div>';
        			    			}
        			    		}else{
        			    			return '<div>' + a + '</div>';
        			    		}
        				    	
        			    	} else {
        				    	return '';
        			    	}
        		    	}
        			},
        			{field:'canuse_money',title:'指标余额',width:180,align:'center',
        				formatter:function(value){
        			    	if (value){
        				    	return numThousandBreak(value);
        			    	} else {
        				    	return '';
        			    	}
        		    	}
        			},
        			{field:'pay_progress',title:'支出进度',width:150,align:'center',
        				 formatter:function(value){
        				    	if (value){
        				    		value = parseFloat(value).toFixed(1);
        					    	var s = '<div style="color:#007AD1">' + value + '%' + '</div>'
        					    	return s;
        				    	} else {
        					    	return '';
        				    	}
        			    	}
        				},
        				{field:'dif_progress',title:'比序时进度',width:120,align:'center',
        					formatter:function(value){
        				    	if (value <= 0){
        					    	var s = '<div style="color:#E90000">' + value  + '</div>'
        					    	return s;
        				    	} else if(value > 0){
        					    	var s = '<div>' + value  + '</div>'
        					    	return s;
        				    	}else{
        				    		return '';
        				    	}
        			    	}
        				
        				}
//        				{field:'',title:'进度排名',width:120,align:'center',},

                		]],
                onClickCell :function(field,row, value){
        		//只能点击最底级节点
                	//var row = $("#treeGrid").datagrid('getSelected');
                    //获取点击的行
	              	  var child  = $('#treeGrid').treegrid('getChildren', row.id);
	            	  if((row.state && row.state =="closed")||child.length >0){
	            		  return false;
	            	  }
        			//参数
        			var beginDay = $('#searchTimeStart').val();//查询时间-开始
        			var endDay =$('#searchTimeEnd').val();//查询时间-结束
        			var fundTypeCode = $('#fundTypeCode').val();//资金性质
        			
        			var eleType = getEleCode('eleType');//全部，政府采购，三公经费，中央专款部分[复选框]
        			var groupType =$('#groupType').val();//按处室，按部门单位，按功能科目
        			var fundTypeCode = $('#fundTypeCode').val();//资金性质
        			var bgtSourceCodeName =$("#bgtSourceCodeName").val();//预算来源
        			
        			var bgtSourceCode = $('#bgtSourceCode').val();//预算来源
        			var bgtDirCode = $('#bgtDirCode').val();//指标流向
        			var agencyExp = getEleCode('agencyExp');//项目分类[变为复选框]
        			var bgtTypeCode = $("#bgtTypeCode").val();//预算类别
        			var type = $("#groupType").val();
                	if(type == "0"){//按业务处室
                		var agencyCode = $("#agencyCode").val();//预算单位
                		var agencyCode_NAME = $("#agencyCode_NAME").val();//预算单位
                		var expfuncCode = $("#expfuncCode").val();//功能分类
                		var expfuncCode_NAME = $("#expfuncCode_NAME").val();//功能分类
                	}else if(type == "1"){//按单位
                		var agencyCode = $("#commonCode").val();//预算单位
                		var agencyCode_NAME = $("#commonCode_NAME").val();//预算单位
                		var expfuncCode = $("#expfuncCode").val();//功能分类
                		var expfuncCode_NAME = $("#expfuncCode_NAME").val();//功能分类
                	}else{//按功能分类
                		var expfuncCode = $("#commonCode").val();//功能分类
                		var expfuncCode_NAME = $("#commonCode_NAME").val();//功能分类
                		var agencyCode = $("#agencyCode").val();
                		var agencyCode_NAME = $("#agencyCode_NAME").val();//预算单位
                	}
        			
                	var bpTypeCode = getEleCode('bpType');//指标类型【改为复选框】
                	var expfuncFlag = getEleCode('expfuncFlag').substring(0,1);//不含线下支出
                	
        			var bgtTypeCode_NAME = $("#bgtTypeCode_NAME").val();//预算类别
        			var agencyExp_NAME = $("#agencyExp_NAME").val();//项目分类
                	
                	var bpTypeCode_NAME = $("#bpTypeCode_NAME").val();//指标类型
                	var bgtSourceCode_NAME = $('#bgtSourceCode_NAME').val();//预算来源
            		var bgtDirCode_NAME = $('#bgtDirCode_NAME').val();//指标流向
            		/*需求变动 新增 现金支出查询 不要了
            		var setMoodCode = getEleCode('setMode');
            		var paykindCode = getEleCode('payKind');
            		*/
        			var eleCode = row.ele_code;//单位部门处室code
        			//单位部门处室name
        			var eleName = escape(row.ele_name);	
        			
        			//笨方法获取顶级处室和编码。。。。。。。请谅解
        			
                	var mb_code =row.ele_code;
                	var mb_name = row.ele_name;
                	
                	var root = $('#treeGrid').treegrid('getParent', row.id);
                	
                	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                		mb_code = root.ele_code;
                		mb_name = root.ele_name;
                	}
                	
                	if(root != undefined && root !=null && root.ele_code.length>2){
                		root = $('#treeGrid').treegrid('getParent', root.id);
                    	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                       		mb_code = root.ele_code;
                       		mb_name = root.ele_name;
                    	}
                	}
                	if(root != undefined && root !=null && root.ele_code.length>2){
                		root = $('#treeGrid').treegrid('getParent', root.id);
                    	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                       		mb_code = root.ele_code;
                       		mb_name = root.ele_name;
                    	}
                	}
                	
                	if(root != undefined && root !=null && root.ele_code.length>2){
                		root = $('#treeGrid').treegrid('getParent', root.id);
                    	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                       		mb_code = root.ele_code;
                       		mb_name = root.ele_name;
                    	}
                	}
        			mb_name=escape(mb_name);
        			
        			var param=checkedEleStr();
        			param += "&beginDay=" + beginDay;
        			param += "&endDay=" + endDay;
        			param += "&fundTypeCode=" + fundTypeCode;
        			param += "&bgtSourceCode=" + bgtSourceCode;
        			param += "&bgtDirCode=" +bgtDirCode;
        			param += "&agencyExp=" + agencyExp;
        			param += "&eleType=" + eleType;
        			param += "&groupType=" + groupType;
        			param += "&agency_code=" + eleCode;
        			param += "&agency_name=" + eleName;
        			param += "&bgtTypeCode=" + bgtTypeCode; //新增条件
        			param += "&agencyCode=" + agencyCode; //新增条件
        			param += "&bpTypeCode=" + bpTypeCode; //新增条件expfuncCode
        			param += "&expfuncCode=" + expfuncCode; //功能分类
        			param += "&expfuncFlag=" + expfuncFlag; //功能分类
        			
        			param += "&bgtTypeCode_NAME=" + escape(bgtTypeCode_NAME); //新增条件name
        			param += "&agencyExp_NAME=" + escape(agencyExp_NAME); //新增条件
        			param += "&agencyCode_NAME=" + escape(agencyCode_NAME); //新增条件
        			param += "&bpTypeCode_NAME=" + escape(bpTypeCode_NAME); //新增条件
        			param += "&bgtSourceCode_NAME=" + escape(bgtSourceCode_NAME); //新增条件
        			param += "&bgtDirCode_NAME=" + escape(bgtDirCode_NAME); //新增条件
        			param += "&expfuncCode_NAME=" + escape(expfuncCode_NAME); //新增条件
       			
        			if(groupType=='2'){
        				param += "&expfunc_code=" + row.top_id; 
        				var expId = row.id;
        				var recount = 0;
        				while(true){
        					var exproot = $('#treeGrid').treegrid('getParent', expId);
        					if(exproot != undefined && exproot !=null && exproot.id.indexOf("#1")>0){
        						var expfunc_name = exproot.ele_name;
        						var expfuncArr = expfunc_name.split(" ");       						
        						param += "&expfunc_name=" + escape(expfuncArr[1]); 
        						break;
        					}
        					expId = exproot.id;
        					recount++;
        					if(recount>10){
        						break;
        					}
        				}
        				
        			}else{//处室和单位穿高级查询条件功能分类
        				param += "&expfunc_code=" + $("#expfuncCode").val();
        				param += "&expfunc_name=" + escape($("#expfuncCode_NAME").val());
        			}
        			if(groupType=='2' || groupType=='1'){
        				param += "&mb_code=" + "";
            			param += "&mb_name=" + "";
        			}else{
        				param += "&mb_code=" + mb_code;
            			param += "&mb_name=" + mb_name; 
        			}
        			param += "&fileName=" + escape($("#FileName").val());
        			if(field == "avi_money"){
        				subUrl = '/df/sd/pay/paymentinfo/exeprogress1.html?tokenid='+getTokenId()+'&menuid=372d4614-93b0-4a14-ad73-bb02065b07a2'+param+'&vtcode=8202'+'&isShowAgencyTree=true';
            			window.parent.addTabToParent("指标执行", subUrl);
        			}else if(field == "payed_money"){
        				subUrl = '/df/sd/pay/paymentinfo/payexeprogress1.html?tokenid='+getTokenId()+'&menuid=57561b52-41b1-4a5f-9d69-f5858ac78cb7'+param+'&vtcode=8202'+'&isShowAgencyTree=true';
            			window.parent.addTabToParent("支付明细", subUrl);
        			}else{
        				return false;
        			}
        			
        		},
        		onBeforeExpand : function(row) {  
                      // 此处就是异步加载地所在  节点打开前触发  
        			$("#tableContent tr").removeClass("hightlihgt-key-word");
                      if (row) { 
                    	  //判断是否有子节点，如果有的话不再请求
                    	  
                    	  var child  = $('#treeGrid').treegrid('getChildren', row.id);
                    	  
                    	  if(child.length>0 ){
                    		  return;
                    	  }
                    	  
                    	    var suburl = "/df/pay/search/mainpage/getTreeTableForMB.do";
//                    	    var suburl = "treegrid_data6.json";
                    	    
                    		//参数
                    		var beginDay = $('#searchTimeStart').val();//查询时间-开始
                    		var endDay =$('#searchTimeEnd').val();//查询时间-结束
                    		var fundTypeCode = $('#fundTypeCode').val();//资金性质
                    		var bgtSourceCode = $('#bgtSourceCode').val();//预算来源
                    		var bgtDirCode = $('#bgtDirCode').val();//指标流向
                    		var agencyExp = getEleCode('agencyExp');//项目分类
                    		var eleType =getEleCode('eleType');//全部，政府采购，三公经费，中央专款部分
                    		var groupType =$('#groupType').val();//按处室，按部门单位，按功能科目
                    		var bgtSourceCodeName =$("#bgtSourceCodeName").val();//预算来源
                    		//新增查询条件
                        	var bgtTypeCode = $("#bgtTypeCode").val();//预算类别
                        	var type = $("#groupType").val();
                        	if(type == "0"){//按业务处室
                        		var agencyCode = $("#agencyCode").val();//预算单位
                        		var agencyCode_NAME = $("#agencyCode_NAME").val();//预算单位
                        		var expfuncCode = $("#expfuncCode").val();//功能分类
                        		var expfuncCode_NAME = $("#expfuncCode_NAME").val();//功能分类
                        	}else if(type == "1"){//按单位
                        		//var agencyCode = $("#commonCode").val();//预算单位
                        		//var agencyCode_NAME = $("#commonCode_NAME").val();//预算单位
                        		var expfuncCode = $("#expfuncCode").val();//功能分类
                        		var expfuncCode_NAME = $("#expfuncCode_NAME").val();//功能分类
                        	}else{//按功能分类
                        		//var expfuncCode = $("#commonCode").val();//功能分类
                        		//var expfuncCode_NAME = $("#commonCode_NAME").val();//功能分类
                        		var agencyCode = $("#agencyCode").val();
                        		var agencyCode_NAME = $("#agencyCode_NAME").val();//预算单位
                        	}
                        	var bpTypeCode = getEleCode('bpType');//指标类别[复选框]
                        	var expfuncFlag = getEleCode('expfuncFlag').substring(0,1);//不含线下支出
                    	    //top_id 为顶级节点 即 处室ID 待调整。。。
                    	   
                        	var top_id =row.ele_code;
                        	var parent_id = row.ele_code;
                        	var data_id = row.id;
                        	
                        	var root = $('#treeGrid').treegrid('getParent', row.id);
                        	
                        	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                        		top_id = root.ele_code;
                        	}
                        	
                        	if(root != undefined && root !=null && root.ele_code.length>2){
                        		root = $('#treeGrid').treegrid('getParent', root.id);
                            	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                            		top_id = root.ele_code;
                            	}
                        	}
                        	if(root != undefined && root !=null && root.ele_code.length>2){
                        		root = $('#treeGrid').treegrid('getParent', root.id);
                            	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                            		top_id = root.ele_code;
                            	}
                        	}
                        	
                        	if(root != undefined && root !=null && root.ele_code.length>2){
                        		root = $('#treeGrid').treegrid('getParent', root.id);
                            	if(root != undefined  &&root !=null && root.ele_code.length ==2){
                            		top_id = root.ele_code;
                            	}
                        	}
                        	
                        	//按功能科目的时候top_id 指定
                        	if(groupType =='2'){
                        		top_id = row.top_id;
                        	}
                        	
                    	    var params = {
                    	    		ajax:'ajax',
                    	        	tokenid:getTokenId(),
                    	        	beginDay:beginDay,
                    	        	endDay:endDay,
                    	        	fundTypeCode:fundTypeCode,
                    	        	bgtSourceCode:bgtSourceCode,
                    	        	bgtDirCode:bgtDirCode,
                    	        	agencyExp:agencyExp,
                    	        	eleType:eleType,
                    	        	groupType:groupType,
                    	        	top_id:top_id,
                    	        	parent_id:parent_id,
                    	        	data_id:data_id,
                    	        	bgtTypeCode:bgtTypeCode,
                    	        	agencyCode:agencyCode,
                    	        	bpTypeCode:bpTypeCode,
                    	        	expfuncCode:expfuncCode,
                    	        	file:$("#FileName").val()
                    	        };
                    	    
                    	    setTimeout(function(){
                    	    	$.ajax({
                        			url: suburl,
                        	        type: 'GET',
                        	        data: params,
                        	        dataType: 'json',
                        	        async :true,
                        	        beforeSend: function(){
                        	        	loadingImg(true);
                        	        },
                        	        success: function (res) {
                        	        	loadingImg(false);
                        	        	 var result = res.rows;
                        	        	 //点开一级，向导出数据中增加一部分数据
                        	        	 if(res.rows.length!=0 || res.rows.length!=null){
                        	        		 for(var j=0;j<gridDataExp.rows.length;j++){
                         	        			for(var i=res.rows.length-1;i>-1;i--){
                                	        		 if(res.rows[i].parent_id ==gridDataExp.rows[j].id){
                                	        			gridDataExp.rows.splice(j+1,0,res.rows[i]);
                                	        		 }
                                	        	 } 
                        	        		}
                        	        	 }
                        	        	 
                                	    $('#treeGrid').treegrid('append',{
            								parent: row.id,//父节点id
            								data: result//节点数据
            							});
                                	    // $(".treegrid-tr-tree>td>div").css("display","block");
                                	    $("tr[node-id="+row.id+"]").next().find("div").eq(0).css("display","block");                              	   
                        	        }
                        	    });
                    	    },10);
                    	    
//                    	    $(this).treegrid('options').data = result;
//                          $(this).treegrid('options').url = 'treegrid_data6.json?tokenId='+getTokenId();  
                      }  
                      return true;  
                },
                onClickRow: function(row) {
                	$(this).treegrid("toggle", row.id);
                	$("#tableContent tr").removeClass("hightlihgt-key-word");
                },
                onLoadSuccess: function(row, data){
                	$("#tableContent .datagrid-view2 .datagrid-body").on('mousewheel', function(e){
                	    var _self = $(this),
                	        delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
                	    if(delta > 0 && _self.scrollTop() === 0){//滑动到顶部，再往上滑就
                	        e.preventDefault();
                	    //滑动到底部，再往下滑就阻止默认行为
                	    }else if(delta < 0 && (_self.scrollTop() == _self.get(0).scrollHeight - _self.height())){
                	        e.preventDefault();
                	    }
                	});
                }
                	
        	});
        	if(isRealSearch){
        		if(type == 1 || type == 2){
//        			$("#commonCode").val(codename.split(" ")[0] + ",");
//            		$("#commonCode_NAME").val(codename);
            		highLightKeyWord(codename,'red','tableContent');
            		isRealSearch = false;
        		}
        		
        	}
            //去掉各级节点的文件夹图标
//            $(".tree-icon,.tree-file").removeClass("tree-folder-open tree-folder tree-icon tree-file");
        	
        }
        })
}

/**
 * 导出
 */
function doEXPTZ(){
	var gridDataExp1=gridDataExp;
	var fields = [];
	//构造options
	var str1 = '{' + '"fieldName"' + ':' +'"' + "ele_name" + '"'
	+","+'"title"' + ':' + '"' + "考核主体" + '" , "field_width":"'+180+'"' +' , "type":"'+"column"+'"' + '}';
	fields.push(JSON.parse(str1));
	
	var str2 = '{' + '"fieldName"' + ':' +'"' + "sort_progress" + '"'
	+","+'"title"' + ':' + '"' + "排名" + '" , "field_width":"'+60+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str2));
	
	var str3 = '{' + '"fieldName"' + ':' +'"' + "avi_money" + '"'
	+","+'"title"' + ':' + '"' + "指标金额" + '" , "field_width":"'+180+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str3));
	
	var str4 = '{' + '"fieldName"' + ':' +'"' + "payed_money" + '"'
	+","+'"title"' + ':' + '"' + "支出金额" + '" , "field_width":"'+180+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str4));
	
	var str5 = '{' + '"fieldName"' + ':' +'"' + "canuse_money" + '"'
	+","+'"title"' + ':' + '"' + "指标余额" + '" , "field_width":"'+180+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str5));
	
	
	var str6 = '{' + '"fieldName"' + ':' +'"' + "pay_progress" + '"'
	+","+'"title"' + ':' + '"' + "支出进度" + '" , "field_width":"'+180+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str6));
	
	var str7 = '{' + '"fieldName"' + ':' +'"' + "dif_progress" + '"'
	+","+'"title"' + ':' + '"' + "比序时进度" + '" , "field_width":"'+180+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str7));
	
	var params= {
			"type" : "select",
			"fieldMap" : fields,
	};
	
	//构造dataTable
	export2ExcelTZ(gridDataExp1,params,null);
	
}
/*
 * 导出右上表格
 */
function doEXPToLeftGrid(){
	var fields = [];
	var str1 = '{' + '"fieldName"' + ':' +'"' + "mb_name" + '"'
	+","+'"title"' + ':' + '"' + "资金处室" + '" , "field_width":"'+150+'"' +' , "type":"'+"String"+'"' + '}';
	fields.push(JSON.parse(str1));
	var str2 = '{' + '"fieldName"' + ':' +'"' + "sort_progress" + '"'
	+","+'"title"' + ':' + '"' + "排名" + '" , "field_width":"'+100+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str2));
	var str3 = '{' + '"fieldName"' + ':' +'"' + "yusuan" + '"'
	+","+'"title"' + ':' + '"' + "预算总额" + '" , "field_width":"'+100+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str3));
	var str4 = '{' + '"fieldName"' + ':' +'"' + "payed_money" + '"'
	+","+'"title"' + ':' + '"' + "已支出金额" + '" , "field_width":"'+150+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str4));
	var str5 = '{' + '"fieldName"' + ':' +'"' + "canuse_money" + '"'
	+","+'"title"' + ':' + '"' + "预算余额" + '" , "field_width":"'+150+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str5));
	var str6 = '{' + '"fieldName"' + ':' +'"' + "pay_progress" + '"'
	+","+'"title"' + ':' + '"' + "预算支出进度" + '" , "field_width":"'+100+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str6));
	var str7 = '{' + '"fieldName"' + ':' +'"' + "dif_progress" + '"'
	+","+'"title"' + ':' + '"' + "比序时进度" + '" , "field_width":"'+100+'"' +' , "type":"'+"decimal"+'"' + '}';
	fields.push(JSON.parse(str7));
	
	var params= {
			"type" : "select",
			"fieldMap" : fields,
	};
	export2ExcelTZ(expDataGridData,params,null,false);
}


/**
 * 数字千分位处理
 */
 function numThousandBreak (value) {
     if (value == 0) {
         return parseFloat(value).toFixed(2);
     }
     if (value != "") {
    	 value = Number(value)/10000;
         var num = "";
         value = parseFloat(value).toFixed(2);
         if (value.indexOf(".") == -1) {
             num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                 return s + ',';
             });
         } else {
             num = value.replace(/(\d)(?=(\d{3})+\.)/g, function (s) {
                 return s + ',';
             });
         }
     }
     
    	 return num;
}
//树的模糊查找
function searchTree(inputId,treeId) { //按钮查找
		var user_write = $("#" +inputId).val();
		var data_tree = $.fn.zTree.getZTreeObj(treeId);
		var search_nodes = data_tree.getNodesByParamFuzzy("codename", user_write, null);
		if (search_nodes == null || search_nodes.length == 0) {
			alert("无搜索结果", "error");
		} else {
			data_tree.expandNode(search_nodes[0], true, false, true);
			data_tree.selectNode(search_nodes[0]);
		}
}

 var treeSearchIndex = 1;
function nextSearch(id,treeId) {//按钮下一个
		var user_write = $("#" + id).val();
		var data_tree = $.fn.zTree.getZTreeObj(treeId);
		var search_nodes = data_tree.getNodesByParamFuzzy("codename", user_write, null);
		if (treeSearchIndex < search_nodes.length) {
			data_tree.selectNode(search_nodes[treeSearchIndex++]);
		} else {
			treeSearchIndex = 1;
			//ip.ipInfoJump("最后一个", "info");
			 alert("最后一个");
		}
}

function quickQuery(inputId){  //输入框onkeyup
	$("#"+inputId).focus();
	if(event.keyCode != 13){
		indexSearch = 0;
	}
}
indexSearch = 0;
function keyTreeNext (inputId,treeId){
	if(event.keyCode == 13){//按住enter键才进行搜索结果定位
		var user_write = $("#"+inputId).val();
		var data_tree = $.fn.zTree.getZTreeObj(treeId);
		var search_nodes = data_tree.getNodesByParamFuzzy("codename",user_write, null);
		if(search_nodes.length == 0){
			indexSearch = 0;
			//ip.ipInfoJump("没有找到！");
			return;
		}
		if(indexSearch < search_nodes.length){
			data_tree.selectNode(search_nodes[indexSearch++]);
		}else{
			indexSearch= 0;
			//ip.ipInfoJump("最后一个");
			alert("最后一个");
		}
		$("#"+inputId).focus();
	}
}
//
function loadingImg(flag) {
	var configModal = $("#info-loading")[0];
	if (!configModal) {
		var innerHTML = '<div id="info-loading" class="info-loading"><img src="/df/trd/ip/image/loading.gif"></div>';
		$("body").append(innerHTML);
	}
	if (flag) {
		$("#info-loading").css("display", "block");
		$("#info-loading").css("z-index", "5555"); //解决有弹窗后被遮挡问题
	} else {
		$("#info-loading").css("display", "none");
	}
}


