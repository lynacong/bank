//报表配置
define(['text!pages/reportConfig/reportConfig.html',
	        'jquery','knockout','uui', 'director', 'tree', 
	    	'bootstrap','ip','ebankConstants','ebankCommonUtil', 'dateZH','datatables.net-bs', 
	        'datatables.net-autofill-bs', 
	        'datatables.net-buttons-bs', 'datatables.net-colreorder',
	        'datatables.net-rowreorder', 'datatables.net-select',
	        'datatables.net-scroller',
	        'datatables.net-keyTable', 
	        'datatables.net-responsive','initDataTableUtil' ],function(html){
		var init =function(element,param){ 
			document.title=ip.getUrlParameter("menuname");
			var baseURL = "/df/f_ebank/reportConfig";
		 	var treedata;
	 		var editType; //新增或者修改 类型
	 		var report_id="";
	 		var pageNo="";
	 		//是否是第一次使用复制按钮
	 		var isFirstCopy=true;
	 		var pageCount="";
	 		var selectNode={};
	 		var viewModel = {
	 			tokenid: ip.getTokenId(),
	 			treeSetting:{
	 				view:{
	 					showLine:false,
	 					selectedMulti:false
	 				},
	 				callback:{
	 					onClick:function(e,id,node){
	 						var data=[];
	 						
	 						report_id = node.report_id;
	 						if(report_id=="null"){
	 							$("#detailPanel input,textarea").val("");
	 						}else{
	 							var codeAndName = node.name.split(" ");
	 	 						$("#report_name").val(codeAndName[1]);
	 	 						$("#report_code").val(codeAndName[0]);
	 	 						node.data_source = node.data_source.replaceAll("&#60;","<").replaceAll("&#34;","\"").replaceAll("&#39;","'");
	 	 						$("#data_source").val(node.data_source);
	 	 					}
	 						selectNode = node;
	 						if($('#view').hasClass('active')){
	 							addMouldTabs();
	 						}
 						}
			        }
			    },
			    treeDataTable: new u.DataTable({
			    	meta: {
			    		'report_id': {
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
			};
 		//初始化左边树
 		viewModel.initTree = function(){
 			report_id = "";
 			var financeCode = $("#finance_code").val();
 			$.ajax({
        		url: "/df/f_ebank/reportMenuRelation/findAllReport.do?tokenid="+viewModel.tokenid,
        		type:"GET",
        		data: {
					"financeCode":financeCode,
					"tokenId":viewModel.tokenid,
					"ajax":"noCache",
				},
        		success: function(data){
        			if(data.result=="success"){
        				viewModel.treeDataTable.setSimpleData(data.eleList,{unSelect:true});
        				var treeObj = $.fn.zTree.getZTreeObj("reportTree");
        	 			treeObj.expandAll(true);
        			}
        		}
        	});
 		};
 		//财政机构切换事件
 		getReportTreeByFinance = function(){
 			viewModel.initTree();
 			$("#detailPanel input,textarea").val("");
 		}
 		//刷新
 		refreshTree = function(){
 			report_id = "";
 			viewModel.initTree();
 			$("#detailPanel input,textarea").val("");
 			ip.ipInfoJump("刷新成功！","success");
 		};
 		
 		//新增报表
 		addReport = function(){
 			$("#finance").css("display","none");
 			editType="add";
 			$("#titleText").text("新增报表");
 			$("#addReportModal input,#addReportModal textarea").val("");
 			$("#addReportModal").modal("show");
 		};
 		
 		//修改报表
 		editReport = function(){
 			$("#finance").css("display","none");
 			editType="modify";
 			if(report_id == ""){
 				ip.warnJumpMsg("请选择要修改的信息！",0,0,true);
				return;
			}
 			if(report_id=="null"){
 				ip.warnJumpMsg("此项不能进行修改，请选择要修改的信息！",0,0,true);
				return;
 			}
 			$("#titleText").text("修改报表");
 			var codeAndName = selectNode.name.split(" ");
 			$("#reportCode").val(codeAndName[0]);
 			$("#reportName").val(codeAndName[1]);
 			$("#dataSource").val(selectNode.data_source);
 			$("#addReportModal").modal("show");
 		};
 		
 		//报表的复制
 		copyReport = function(){
 			if(isFirstCopy){
 				getCopyReportFinancreCode();
 				isFirstCopy=false;
 			}
 			$("#finance").css("display","block");
 			editType="copy";
 			if(report_id == ""){
 				ip.warnJumpMsg("请选择要复制的报表！",0,0,true);
				return;
			}
 			if(report_id=="null"){
 				ip.warnJumpMsg("此项不能进行复制，请选择要复制的报表！",0,0,true);
				return;
 			}
 			$("#titleText").text("复制报表");
 			var codeAndName = selectNode.name.split(" ");
 			$("#financeCode").val($("#finance_code").val());
 			$("#reportCode").val("");
 			$("#reportName").val(codeAndName[1]);
 			$("#dataSource").val(selectNode.data_source);
 			$("#addReportModal").modal("show");	
 		}
 		
 		//导入报表
 		impReport = function(){
 			ip.warnJumpMsg("确定导入 到【"+ $("#finance_code option:selected").text() +"】区划 吗？", "del", "cCla");
 			$("#del").on("click", function() {
 				var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
 	 			if (isIE && isIE<="9.0") {
 	 	    		if(noticeTitle!=""&&!htmlFlag&&!textFlag){
 	 	    			$("#form1").attr("action",$ctx+"/notice/saveNoticeForIE");
 	 	    			$("#form1").submit();
 	 	    			clearNot();
 	 	    		}
 	 		    } else {
 	 			    	var fileObj = document.getElementById("leadinRow").files[0]; 
 	 	 		    	if(fileObj==undefined){
 	 	 	    			fileObj="";
 	 	 	    		}
 	 	 	    			var form  = new FormData();
 	 	 	 				form.append("imgFile", fileObj);// 文件对象
 	 	 	 				form.append("file",fileObj);
 	 	 	 				var xhr = new XMLHttpRequest();
 	 	 	 				xhr.open("post", baseURL+"/impReportInfo.do?finance_code="+ $("#finance_code").val()+"&tokenid="+viewModel.tokenid, true);
 	 	 	 				xhr.onload = function () {
 	 	 	 					debugger
 	 	 	 					if (xhr.status == 200) {
 	 	 	 					   var data = jQuery.parseJSON(xhr.responseText);
 	 	 	 					    var flag = data.result;
 	 	 	 					    if (flag == "false"){
 	 	 	 					    	ip.ipInfoJump(data.error,"error");
 	 	 	 					    }
 	 	 	 					    if (flag == "true"){
 	 		 					    	ip.ipInfoJump("文件导入成功！");
 	 		 					    }
 	 	 	 					} else {
 	 	 	 						u.showMessageDialog({type: "info", title: "提示信息", msg: "服务器繁忙，请稍后重试！", backdrop: true});
 	 	 	 					}
 	 	 	 				};
 	 	 	 				xhr.send(form);
 	 			}
 	 			$("#config-modal").remove();
 	 			$('#leadinRow').val('');
 			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
				$('#leadinRow').val('');
			});	
 		};
 		
 		//导出报表
 		expReport = function(){
 			if(report_id == ""){//没有选择节点的情况
 				ip.warnJumpMsg("请选择要导出的报表！",0,0,true);
				return;
			}
 			if(report_id == "null"){//选择节点为根节点的情况
 				ip.warnJumpMsg("此项不能进行导出，请选择要导出的报表！",0,0,true);
				return;
			}
 			$.ajax({
	        		url: baseURL+"/expReportInfo.do?tokenid="+viewModel.tokenid,
	        		type:"POST",
	        		data: {
	        			"reportId":report_id,
	        			ajax: "noCache",
	        		},
	        		success: function(data){
	        			if(data.result=="success"){
	        				var ocx=document.getElementById('ocx');
	        				var result= ocx.saveGrfFile(data.data);
	        				if(result == undefined){
	        					ip.ipInfoJump("导出成功！","success");
	        		    	}else{
	        		    		ip.warnJumpMsg("导出失败！",0,0,true);
	        		    	}
	        			}else{
	        				ip.warnJumpMsg("导出失败！",0,0,true);
	        			}
	        		}
	        	});
 		};
 		
 		
 		//删除报表
 		delReport = function(){
 			if(report_id == ""){//没有选择节点的情况
 				ip.warnJumpMsg("请选择要删除的信息！",0,0,true);
				return;
			}
 			if(report_id == "null"){//选择节点为根节点的情况
 				ip.warnJumpMsg("此项不能进行删除，请选择要删除的信息！",0,0,true);
				return;
			}
 			ip.warnJumpMsg("确定删除 【"+ selectNode.name +"】 吗？", "del", "cCla");
 			$("#del").on("click", function() {
 				$.ajax({
 	        		url: baseURL+"/deleteReportInfo.do?tokenid="+viewModel.tokenid,
 	        		type:"POST",
 	        		data: {
 	        			"report_id":report_id,
 	        			ajax: "noCache",
 	        		},
 	        		success: function(data){
 	        			if(data.result=="success"){
 	        				ip.ipInfoJump("删除成功！","success");
 	        				//刷新
 	        	 			viewModel.initTree();
 	        	 			$("#detailPanel input,textarea").val("");
 	        			}else{
 	        				ip.warnJumpMsg("删除失败！"+data.result,0,0,true);
 	        			}
 	        			//进行删除操作后，不论成功与否，当前选中节点置空
 	        			report_id = "";
 	        		}
 	        	});
				$("#config-modal").remove();
			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
 		};
 		//弹出框上的确定-(新增或者修改保存)
 		saveOrUpdate=function(){
 			var reportCode = $("#reportCode").val().trim();
 			var reportName = $("#reportName").val().trim();
 			var dataSource = $("#dataSource").val().trim();
 			var financeCode = $("#finance_code").val();
 			if(editType=="copy"){
 				financeCode = $("#financeCode").val();
 			}
 			//编码和名称校验
 			if(reportCode ==""){
 				ip.warnJumpMsg("报表编码不能为空！",0,0,true);
 				return;
 			}
 			if(isNaN(reportCode)){
 				ip.warnJumpMsg("报表编码只能为数字！",0,0,true);
 				return;
 			}
 			if(reportName ==""){
 				ip.warnJumpMsg("报表名称不能为空！",0,0,true);
 				return;
 			}
 			if(dataSource ==""){
 				ip.warnJumpMsg("数据源不能为空！",0,0,true);
 				return;
 			}
 			if(report_id == "null"){
 				report_id = "";
 			}
 			$.ajax({
        		url:baseURL+ "/saveOrUpdateReportInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
        			"report_id":report_id,
        			"editType":editType,
        			"reportCode":reportCode,
        			"reportName":reportName,
        			"dataSource":dataSource,
        			"financeCode":financeCode,
        			ajax: "noCache",
        		},
        		success: function(data){
        			if(data.result=="success"){
        				ip.ipInfoJump("保存成功！","success");
        				viewModel.initTree();
        				$("#detailPanel input,#detailPanel textarea").val("");
        				$("#addReportModal").modal("hide");
        			}
        			else if(data.result=="fail"){
        				ip.warnJumpMsg("失败，"+data.reason,0,0,true);
        			}
        			requesting = false;
        		}
        	});
 		};
 		
 		$('body').on('shown.bs.tab','.template a[data-toggle="tab"]', function (e) {
 			if(report_id == ""){
 				ip.warnJumpMsg("请选择具体报表！",0,0,true);
				return;
			}
 			if(report_id == "null"){
 				ip.warnJumpMsg("此项不能进行操作，请选择具体报表！",0,0,true);
				return;
 			}
 			addMouldTabs();			
 		});
 		
 		//模板联署动态标签加载
 		addMouldTabs = function(){
 			$.ajax({
        		url: baseURL+"/queryMouldCountByReportId.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		sync:true,
        		data: {
					"reportId" : report_id,
					"ajax" : "noCache",
				},
        		success: function(data){
        			if(data.result == "success"){
        				$("#tabList li").remove();
        				pageCount = data.count;
        				for (var i = 0 ; i < pageCount ;){
        					if(i==0){
        						$("#tabList").append("<li role='presentation' class=' gridtables active' id='" +i+ "'><a role='tab' data-toggle='tab' onclick='showMould("+i+")' href='#'>第" + ++i +  "联</a></li>");
        					}else{
        						$("#tabList").append("<li role='presentation' class=' gridtables' id='" +i+ "'><a role='tab' data-toggle='tab' onclick='showMould("+i+")' href='#'>第" + ++i +  "联</a></li>");
        					}
        					
        				}
//        				setTimeout(function(){
        	 				if(pageCount==0){
        	 					pageNo='';
        	 	 				return;
        	 	 			}
        	 				showMould(0);
//        	 			},200);  
        			}else{
        				ip.warnJumpMsg("报表联数加载失败！",0,0,true);
        			}
        		}
        	});
 		}
 		
 		//模板的展示
 		showMould = function(page){
 			pageNo=page;
 			$.ajax({
        		url: baseURL+"/queryMouldInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		sync:true,
        		data: {
					"reportId" : report_id,
					"pageNo" : pageNo,
					"ajax" : "noCache",
				},
        		success: function(data){
        			if(data.result == "success"){
        				var ocx = document.getElementById('ocxDSc');	
        	 			ocx.showMould(data.mould);
        			}else{
        				ip.warnJumpMsg("报表模板加载失败！",0,0,true);
        			}
        		}
        	});
 		}
 		
 		//新增模板
 		addMould = function(){
 			var mouldHtml = "<option value='-1' selected='selected'>空模板</option>";
 			for (var i = 0; i < pageCount; ) {
 				mouldHtml += "<option value=" + i + ">"
						+ "第"+ ++i +"联为模板" + "</option>";
			}
 			$("#mould").html(mouldHtml);
 			$("#addReportMould input").val("");
 			$("#addReportMould").modal("show");
 		}
 		saveMouldInfo = function(){
 			var mouldNum = $("#mouldNum").val();
 			var mould = $("#mould").val();
 			$.ajax({
        		url: baseURL+"/saveMouldInfo.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
					"mouldNum" : mouldNum,
					"pageNo" : mould,
					"reportId" : report_id,
					"ajax" : "noCache",
				},
        		success: function(data){
        			if(data.result == "success"){
        				for (var i=pageCount;i<(parseInt(mouldNum)+parseInt(pageCount));){
        					$("#tabList").append("<li role='presentation' class=' gridtables' id='" +i+ "'><a role='tab' data-toggle='tab' onclick='showMould("+i+")' href='#'>第" + ++i +  "联</a></li>");
        				}
        				pageCount=parseInt(mouldNum)+parseInt(pageCount);
        	 			$("#addReportMould").modal("hide");
        	 			ip.ipInfoJump("新增成功！","success");
        			}else{
        				ip.warnJumpMsg("新增失败",0,0,true);
        			}
        		}
        	});
 		}
 		
 		//设计模板
 		editMould=function(){
 			var ocx=document.getElementById('ocxDSc');
 			var str=ocx.designMould();
 			if(str=="" || str==null){
 				return;
 			}
 			$.ajax({
        		url: baseURL+"/saveMould.do?tokenid="+viewModel.tokenid,
        		type:"POST",
        		data: {
					"mould" : str,
					"pageNo" : pageNo,
					"reportId" : report_id,
					"ajax" : "noCache",
				},
        		success: function(data){
        			if(data.result == "success"){
        	 			ip.ipInfoJump("模板编辑成功！","success");
        			}else{
        				ip.warnJumpMsg("模板编辑失败",0,0,true);
        			}
        		}
        	});
 		}
 		//删除报表的某一联
 		delMould=function(){
 			ip.warnJumpMsg("确定删除 第"+(pageNo+1)+"联吗？", "del", "cCla");
 			$("#del").on("click", function() {
 				$.ajax({
 	        		url: baseURL+"/deleteReportMouldByPageNo.do?tokenid="+viewModel.tokenid,
 	        		type:"POST",
 	        		data: {
 	        			"reportId":report_id,
 	        			"pageNo" : pageNo,
 	        			ajax: "noCache",
 	        		},
 	        		success: function(data){
 	        			if(data.result=="success"){
 	        				var n=parseInt(pageCount)-1;
 	        				pageCount=n;
 	        				if(n!=pageNo){
 	        					$("#"+n).remove();
 	        					showMould(pageNo);
 	        				}else if(n!=0){
 	        					$("#"+n).remove();
 	        					$("#0").addClass("active");
 	        					showMould("0");
 	        				}else{
 	        					$("#tabList li").remove();
 	        					pageCount="";
 	        					pageNo="";
 	        				}
 	        				ip.ipInfoJump("删除成功！","success");
 	        			}else{
 	        				ip.warnJumpMsg("删除失败！",0,0,true);
 	        			}
 	        		}
 	        	});
				$("#config-modal").remove();
			});
			$(".cCla").on("click", function() {
				$("#config-modal").remove();
			});
 		}
 	   /**
 	    * 获取财政机构
 	    * @param viewid
 	    * @param params
 	    * @param tokenid
 	    */
 	   function getCopyReportFinancreCode() {
 		   $.ajax({
 				url : EBankConstant.CommonUrl.getFinanceData+"?tokenid=" + viewModel.tokenid,
 				type : "GET",
 				dataType : "json",
 				data : "",
 				async : false,
 				success : function(data) {
 					if (data.result == "成功！") {	
 						var financeHtml=""
 						for ( var i = 0; i < data.dataDetail.length; i++) {						
 							financeHtml+="<option value="+data.dataDetail[i].chr_code+">"+data.dataDetail[i].chr_name+"</option>";
 						}
 						$("#financeCode").html(financeHtml);
 					} else {
 						ip.ipInfoJump("获取财政信息失败！原因：" + data.reason, "error");
 					}
 				}
 			});
 	   }
 	   
 		pageInit =function(){
 			app = u.createApp({
				el :element,
				model : viewModel
			});
 			// 初始化财政机构的下拉框
 			getFinancreCode("","",viewModel.tokenid);
 			//初始化左侧的树
			viewModel.initTree();
			$("#leadinRow").change(function(){
				impReport();
			})
 		};

 		$(element).html(html);	
 		pageInit();

        };		
 		return {
 		        init:init
 		};
	});

