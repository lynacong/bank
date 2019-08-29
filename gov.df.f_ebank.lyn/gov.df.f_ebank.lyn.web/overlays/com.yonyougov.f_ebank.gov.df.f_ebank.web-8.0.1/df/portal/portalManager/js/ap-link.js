//获取UserID
var commonData = localStorage.getItem("commonData");
var svUserId = JSON.parse(commonData).svUserId;
var tokenId = getTokenId();
$(function() {

	// 获取初始化数据
	getListAllIndexData(1,10,'');
	getListPublishedIndexData(1,10,'');
	
	//获取发布频道数据
	getPublishPortletData();
	
	$('#publishPage').change( function(){
		//根据选择的页面筛选对应的发布频道
		getInitPortletData();
	});

	/* “全选/反选”复选框 */
	$('#checkAllLinkAll').click(
			function(event) {
				$('input[name="ap_linkallList"]').prop('checked',
						$(this).prop('checked'));
				/* 阻止向上冒泡，以防再次触发点击操作 */
				event.stopPropagation();
			});
	$('#checkAllLinkPublish').click(
			function(event) {
				$('input[name="ap_linkPublishList"]').prop('checked',
						$(this).prop('checked'));
				/* 阻止向上冒泡，以防再次触发点击操作 */
				event.stopPropagation();
			});

	$('#myTab').click(function() {
		if ($('#publishedLinkLi').hasClass('active')) {
			$('#addLink').removeAttr('disabled');
			$('#editLink').removeAttr('disabled');
			$('#publishLink').removeAttr('disabled');
		} else {
			$('#addLink').attr('disabled', 'true');
			$('#editLink').attr('disabled', 'true');
			$('#publishLink').attr('disabled', 'true');
		}
	});

	// 页签切换方法
	// $('#myTab>li').click(function() {
	// var tabVal = $(this).val();
	// if(tabVal == 0) {
	// $("#linkListAll").css("display", "block");
	// $("#linkListPublished").css("display", "none");
	// } else if(tabVal == 1) {
	// $("#linkListAll").css("display", "none");
	// $("#linkListPublished").css("display", "block");
	// }
	// });

	// 新增按钮
	$("#addLink").click(function() {
		$(" input[type='text']").val('');
		$("input[name='linkType']").prop("checked",false); 
		$('#addModal').modal();

	});

	// 编辑按钮
	$("#editLink").click(function() {
		
		//清空所有input框
		$("input[ type='text']").val();
		$("input[name='linkTypeEdit']").prop("checked",false); 
		//获取选中的链接的link_id
		var linkIdListStr='';
	    $("input:checkbox[name='ap_linkallList']:checked").each (function(){
	    	linkIdListStr += $(this).val() + ",";
	    });
	    
	    var linkIdList = linkIdListStr.split(',');
	    var linkId = linkIdList[0];
	    if(linkId==''){
	    	return;
	    }
	    //请求选中的链接数据并往页面上赋值
		params = {};
		params['ruleID'] = 'portal-df-link.getLinkByParams';
		params['guid'] = linkId;
		params['tokenid'] =tokenId;
		params['start'] = '0';
		params['limit'] = '1';

		$.ajax({
			url : "/portal/GetPageJsonData.do",
			type : "GET",
			dataType : "json",
			data : params,
			success : function(data) {
				var result = data[0];
				//标题
				$('#linkTitleEdit').val(result.link_title);
				//地址
				$('#linkUrlEdit').val(result.link_url);
				//图片
				$('#linkImgEdit').val(result.link_img);
				//排序
				$('#linkOrderEdit').val(result.ord_index);
				//类型
				var linkType = result.link_type;
				if(linkType=='0'){
					$("input[name='linkTypeEdit'][value='0']").prop("checked",true); 
				}else if (linkType='1'){
					$("input[name='linkTypeEdit'][value='1']").prop("checked",true); 
				}else if(linkType='2'){
					$("input[name='linkTypeEdit'][value='2']").prop("checked",true); 
				}
				

			}
		});
	    
		$('#editModal').modal();

	});
	
	// 发布按钮
	$("#publishLink").click(function() {
		$('#publishModal').modal();

	});

});

//获取发布频道数据
function getPublishPortletData(){
	params = {};
	params['ruleID'] = 'portal-df-link.getPublishPage';
	params['tokenid'] =tokenId;
	params['start'] = '0';
	params['limit'] = '100';
	$.ajax({
		url : "/portal/GetPageJsonData.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var result = data;
			var pageHtml = '';
			for (var i = 0;i<result.length;i++){
				pageHtml += '<option value="' + result[i].page_id + '">' + result[i].page_title + '</option>';
			}
			$('#publishPage').html(pageHtml);
			
			var pageId = result[0].page_id;
			params = {};
			params['ruleID'] = 'portal-df-link.getPublishPortlet';
			params['pageId'] = pageId;
			params['tokenid'] =tokenId;
			params['portletId'] ='todoWork';
			params['start'] = '0';
			params['limit'] = '100';
			$.ajax({
				url : "/portal/GetPageJsonData.do",
				type : "GET",
				dataType : "json",
				data : params,
				success : function(data) {
					var result = data;
					var portletHtml = '';
					for (var i = 0;i<result.length;i++){
						portletHtml += '<option value="' + result[i].id + '">' + result[i].title + '</option>';
					}
					$('#publishPgPlet').html(portletHtml);
					
				}
			});
		}
	});
	
}


function getInitPortletData(){
	var pageId = $('#publishPage').val();
	params = {};
	params['ruleID'] = 'portal-df-link.getPublishPortlet';
	params['pageId'] = pageId;
	params['tokenid'] =tokenId;
	params['portletId'] = 'link';
	params['start'] = '0';
	params['limit'] = '100';
	$.ajax({
		url : "/portal/GetPageJsonData.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var result = data;
			var portletHtml = '';
			for (var i = 0;i<result.length;i++){
				portletHtml += '<option value="' + result[i].id + '">' + result[i].title + '</option>';
			}
			$('#publishPgPlet').html(portletHtml);
			
		}
	});
}

// 获取初始化数据
function getListAllIndexData(pageCurrent,pagePerNum,searchKey) {
	params = {};
	params['ruleID'] = 'portal-df-link.getLinkByParams';
	params['searchKey'] = searchKey;
	params['tokenid'] =tokenId;
	params['start'] = '0';
	params['limit'] = '1000';

	$.ajax({
		url : "/portal/GetPageJsonData.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
        	//数据总数
        	var count = data.length;
            //总页数
            var pageNum = Math.ceil(count/pagePerNum);
            //当输入页码跳转的情况
            var toPage = $('#d_changepageAll').val();
            if(toPage>pageNum){
            	toPage=pageNum;
            }
            if (pageCurrent=='undefined'||pageCurrent==''){
            	pageCurrent=toPage;
            }
            //页面显示行号
            var index=0;
            //数组下标最小
            var indexMin = (pageCurrent-1)*pagePerNum;
            //数组下标最大
            var indexMax = indexMin+pagePerNum-1;
            //当页面条数不足pagePerNum时
            var indexTmp = count-(pageCurrent-1)*pagePerNum;
            if(indexTmp<pagePerNum){
            	indexMax=count-1;
            }
			var result = data;
//			console.log(result);
			var html ='';
			//分页html
			var pageHtml = "";
			
			for(i=indexMin;i<=indexMax;i++){
				html+='<tr>';
				html+= '<td><input type="checkbox" class="checkbox-info checkbox-primary" value="'+result[i].guid+'" name="ap_linkallList"> </td>';
				html+='<td><div>'+result[i].link_title+'</div></td>';
				html+='<td><div>'+result[i].link_url+'</div></td>';
				html+='<td><div>'+result[i].link_img+'</div></td>';
				html+='<td>'+result[i].ord_index+'</td>';
				//判断链接类型
				switch(result[i].link_type){
				
				case '0':{
					html+='<td>图片链接</td>';
					break;
				}
				case '1':{
					html+='<td>文字链接</td>';
					break;
				}
				case '2':{
					html+='<td>图片和文字链接</td>';
					break;
				}
				}
				html +='</tr>';
			}
				
//			console.log(html);
			$('#linkListAllBody').html(html);
			
			//分页显示
			pageHtml+='<li><a onclick="getListAllIndexData(1,'+pagePerNum+',\'\');">首页</a></li>';
            //上一页显示html
            if(pageCurrent==1){
            	pageHtml+='<li class="disabled"><a href="javascript:void(0);">&lt;上一页</a></li>';
            }else{
            	pageHtml+='<li ><a onclick="getListAllIndexData('+(pageCurrent-1)+','+pagePerNum+',\'\')">&lt;上一页</a></li>';
            }
            pageHtml+='<li class="active"><a>-'+pageCurrent+'-</a></li>';
            //下一页显示html
            if(pageCurrent>= pageNum){
            	pageHtml+='<li class="disabled"><a  href ="javascript:void(0);">下一页&gt;</a></li>';
            }else{
            	pageHtml+='<li><a onclick="getListAllIndexData('+(pageCurrent+1)+','+pagePerNum+',\'\');">下一页&gt;</a></li>';
            }
            
            pageHtml+='<li><a onclick="getListAllIndexData('+pageNum+','+pagePerNum+',\'\');">末页</a></li>';
            pageHtml+='<li><a>共'+pageNum+'页</a></li>';
            pageHtml+='<li><a>条数：'+count+'</a></li>';
            pageHtml+='</ul>';
            $("#allLinkPagination").html(pageHtml);
		}
	});

}

//已发布链接获取初始化数据
function getListPublishedIndexData(pageCurrent,pagePerNum,searchKey) {
	params = {};
	params['ruleID'] = 'portal-df-link.getLinkPortlet';
	params['tokenid'] =tokenId;
	params['searchKey'] = searchKey;
	params['start'] = '0';
	params['limit'] = '1000';

	$.ajax({
		url : "/portal/GetPageJsonData.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
        	//数据总数
        	var count = data.length;
            //总页数
            var pageNum = Math.ceil(count/pagePerNum);
            //当输入页码跳转的情况
            var toPage = $('#d_changepagePublish').val();
            if(toPage>pageNum){
            	toPage=pageNum;
            }
            if (pageCurrent=='undefined'||pageCurrent==''){
            	pageCurrent=toPage;
            }
            //页面显示行号Zazswq
            var index=0;
            //数组下标最小
            var indexMin = (pageCurrent-1)*pagePerNum;
            //数组下标最大
            var indexMax = indexMin+pagePerNum-1;
            //当页面条数不足pagePerNum时
            var indexTmp = count-(pageCurrent-1)*pagePerNum;
            if(indexTmp<pagePerNum){
            	indexMax=count-1;
            }
			var result = data;
//			console.log(result);
			var html ='';
			//分页html
			var pageHtml = "";
			
			for(i=indexMin;i<=indexMax;i++){
				html+='<tr>';
				html+= '<td><input type="checkbox" class="checkbox-info checkbox-primary" value="'+result[i].link_id+'"name="ap_linkPublishList"> </td>';
				html+='<td><div>'+result[i].page_title+'</div></td>';
				html+='<td><div>'+result[i].portlet_name+'</div></td>';
				html+='<td><div>'+result[i].link_title+'</div></td>';
				html+='<td><div>'+result[i].pub_time+'</div></td>';
				//判断链接类型
				switch(result[i].link_type){
				
				case '0':{
					html+='<td>图片链接</td>';
					break;
				}
				case '1':{
					html+='<td>文字链接</td>';
					break;
				}
				case '2':{
					html+='<td>图片和文字链接</td>';
					break;
				}
				}
				html+='<td style="display:none;">'+result[i].pg_plet_id+'</td>';
				html +='</tr>';
			}
				
			$('#linkListPublishedBody').html(html);
			//分页显示
			pageHtml+='<li><a onclick="getListPublishedIndexData(1,'+pagePerNum+',\'\');">首页</a></li>';
            //上一页显示html
            if(pageCurrent==1){
            	pageHtml+='<li class="disabled"><a href="javascript:void(0);">&lt;上一页</a></li>';
            }else{
            	pageHtml+='<li ><a onclick="getListPublishedIndexData('+(pageCurrent-1)+','+pagePerNum+',\'\')">&lt;上一页</a></li>';
            }
            pageHtml+='<li class="active"><a>-'+pageCurrent+'-</a></li>';
            //下一页显示html
            if(pageCurrent>= pageNum){
            	pageHtml+='<li class="disabled"><a  href ="javascript:void(0);">下一页&gt;</a></li>';
            }else{
            	pageHtml+='<li><a onclick="getListPublishedIndexData('+(pageCurrent+1)+','+pagePerNum+',\'\');">下一页&gt;</a></li>';
            }
            
            pageHtml+='<li><a onclick="getListPublishedIndexData('+pageNum+','+pagePerNum+',\'\');">末页</a></li>';
            pageHtml+='<li><a>共'+pageNum+'页</a></li>';
            pageHtml+='<li><a>条数：'+count+'</a></li>';
            pageHtml+='</ul>';
            $("#linkPublishPagination").html(pageHtml);
		}
	});

}


function saveLink(){
	//链接标题
	var linkTitle = $('#linkTitle').val();
	//链接地址
	var linkUrl = $('#linkUrl').val();
	//链接图片
	var linkImg = $('#linkImg').val();
	//排序序列
	var linkOrder = $('#linkOrder').val();
	//链接类型
	var linkType = $('#linkType input:radio:checked').val();
	
	var params = {};
	params['action']='insert';
	params['linkTitle'] = linkTitle;
	params['linkUrl'] = linkUrl;
	params['linkImg'] = linkImg;
	params['linkOrder'] = linkOrder;
	params['linkType'] = linkType;
	params['tokenid'] =tokenId;

	$.ajax({
		url : "/df/portal/newOrEditLink.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var result = data;
			if (result) {
				$('#addModal').modal('hide');
				ufma.showTip("保存成功", function() {}, "success");
				getListAllIndexData(1,10,'');
				
			} else {
				$('#addModal').modal('hide');
				ufma.showTip("保存失败", function() {}, "error");
			}
		}
	});
}

function editLink(){
	
	var linkIdListStr='';
    $("input:checkbox[name='ap_linkallList']:checked").each (function(){
    	linkIdListStr += $(this).val() + ",";
    });
    
    var linkIdList = linkIdListStr.split(',');
	//链接ID
    var guid = linkIdList[0];
	//链接标题
	var linkTitle = $('#linkTitleEdit').val();
	//链接地址
	var linkUrl = $('#linkUrlEdit').val();
	//链接图片
	var linkImg = $('#linkImgEdit').val();
	//排序序列
	var linkOrder = $('#linkOrderEdit').val();
	//链接类型
	var linkType = $('#linkTypeEdit input:radio:checked').val();
	
	var params = {};
	params['guid']=guid;
	params['action']='update';
	params['linkTitle'] = linkTitle;
	params['linkUrl'] = linkUrl;
	params['linkImg'] = linkImg;
	params['linkOrder'] = linkOrder;
	params['linkType'] = linkType;
	params['tokenid'] =tokenId;

	$.ajax({
		url : "/df/portal/newOrEditLink.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var result = data;
			if (result) {
				$('#editModal').modal('hide');
				ufma.showTip("保存成功", function() {}, "success");
				getListAllIndexData(1,10,'');
				
			} else {
				$('#editModal').modal('hide');
				ufma.showTip("保存失败", function() {}, "error");
			}
		}
	});
}




function deleteLink(){
	
	//删除已发布链接
	if ($('#publishedLinkLi').hasClass('active')) {
		var rows = document.getElementById("linkListPublishedBody").rows;
		var linkPublish = document.getElementsByName("ap_linkPublishList");
		//链接ID字符串
		var linkIdListStr='';
		//pgPletId字符串
		var pgPletIdListStr = '';
		for(var i=0;i<linkPublish.length;i++)
		{
		if(linkPublish[i].checked){
		var row = linkPublish[i].parentElement.parentElement.rowIndex-1;
		linkIdListStr += linkPublish[i].value+ ",";
		pgPletIdListStr += rows[row].cells[6].innerHTML+ ",";
		}
		
	    if(linkIdListStr==""){
	    	ufma.showTip("请选择要删除的链接", function() {}, "warning");
	    	return;
	    }
		}
		//删除已发布链接
		var params = {};
		params['ruleId']="portal-df-link.deleteLinkPortlet";
		params['linkIdList']=linkIdListStr;
		params['pgPletIdList']=pgPletIdListStr;
		params['tokenid'] =tokenId;
		$.ajax({
			url : "/df/portal/deleteLinkPortlet.do",
			type : "GET",
			dataType : "json",
			data : params,
			success : function(data) {
				var result = data;
				if (result) {
					ufma.showTip("删除成功", function() {}, "success");
					getListPublishedIndexData(1,10,'');
					
				} else {
					ufma.showTip("删除失败", function() {}, "error");
				}
			}
		});
		
	//删除录入链接
	}else{
		var linkIdListStr='';
	    $("input:checkbox[name='ap_linkallList']:checked").each (function(){
	    	linkIdListStr += $(this).val() + ",";
	    });
	    
	    if(linkIdListStr==""){
	    	ufma.showTip("请选择要删除的链接", function() {}, "warning");
	    	return;
	    }
	    
		var params = {};
		params['ruleId']="portal-df-link.deleteLink";
		params['list']=linkIdListStr;
		params['tokenid'] =tokenId;
		$.ajax({
			url : "/df/portal/deleteLink.do",
			type : "GET",
			dataType : "json",
			data : params,
			success : function(data) {
				var result = data;
				if (result) {
					ufma.showTip("删除成功", function() {}, "success");
					
				} else {
					ufma.showTip("删除失败", function() {}, "error");
					getListAllIndexData(1,10,'');
				}
			}
		});
		
	}
	
	
}


function publishLink(){
	var linkIdListStr='';
    $("input:checkbox[name='ap_linkallList']:checked").each (function(){
    	linkIdListStr += $(this).val() + ",";
    });
    
    if(linkIdListStr==""){
    	ufma.showTip("请选择发布的链接", function() {}, "warning");
    	return;
    }
    
//    var linkIdList = linkIdListStr.split(',');
    //发布至的页面
    var pageId = $('#publishPage').val();
    //发布至的频道ID
    var pgPletId = $('#publishPgPlet').val();
	var params = {};
	params['ruleId']="portal-df-link.insertLinkPortlet";
	params['svUserId']=svUserId;
	params['linkIdList']=linkIdListStr;
	params['pageId']=pageId;
	params['pgPletId']=pgPletId;
	params['tokenid'] =tokenId;
	$.ajax({
		url : "/df/portal/publishLink.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var result = data;
			if (result) {
				$('#publishModal').modal('hide');
				ufma.showTip("发布成功", function() {}, "success");
				getListPublishedIndexData(1,10,'');
				
			} else {
				$('#publishModal').modal('hide');
				ufma.showTip("发布失败", function() {}, "error");
			}
		}
	});
}

function getTokenId() {
	var current_url = location.search;
	var params = (current_url || "").split('&');
	for(var i = 0; i < params.length; i++){
		if(params[i].toLowerCase().indexOf("tokenid=") > -1){
			return (params[i].split('=')[1]);
		}
	}
	return "";
}
