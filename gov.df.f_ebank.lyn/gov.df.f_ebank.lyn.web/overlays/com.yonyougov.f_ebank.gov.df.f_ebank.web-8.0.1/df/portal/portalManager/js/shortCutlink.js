//获取当前用户tokenid
function getTokenId() {
	return sessionStorage.tokenid || "";
}

// 当前角色ID
var currentRoleId = "";

//获取UserID
var commonData = sessionStorage.getItem("commonData");
var svUserId = JSON.parse(commonData).svUserId;
var svRoleId = $("#selectRole").val();
//svUserId = Base64.decode(svUserId);
var tokenId = getTokenId();
$(function() {
	
	// 获取全部角色
	getAllRoles();
	
	// 获取初始化数据
	getListAllIndexData(1,100,'', $("#selectRole").val());
	getListPublishedIndexData(1,20,'', $("#selectRole").val());
	
	// 获取发布频道数据
	getPublishPortletData();
	
	
	$('#publishPage').change( function(){
		// 根据选择的页面筛选对应的发布频道
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

	$('#deleteLink').attr('disabled', 'true');
	$('#myTab').click(function() {
		if ($('#publishedLinkLi').hasClass('active')) {
			$('#publishLink').removeAttr('disabled');
		} else {
			$('#publishLink').attr('disabled', 'true');
		}
		
		if ($('#shortCutLinkListLi').hasClass('active')) {
			$('#deleteLink').removeAttr('disabled');
		} else {
			$('#deleteLink').attr('disabled', 'true');
		}
		
	});


	// 发布按钮
	$("#publishLink").click(function() {
		$('#publishModal').modal();

	});
	
	
	
	//测试获取链接
	//getToDoWork();

});

// 获取发布频道数据
function getPublishPortletData(){
	params = {};
	params['ruleID'] = 'portal-df-link.getPublishPage';
	params['userId'] = svUserId;
	params['tokenid'] =tokenId;
	params['start'] = '0';
	params['limit'] = '100';
	$.ajax({
		url : "/portal/GetPageJsonData.do", // 获取全部模板信息
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
			params['portletId'] ='link';
			params['tokenid'] =tokenId;
			params['start'] = '0';
			params['limit'] = '100';
			$.ajax({
				url : "/portal/GetPageJsonData.do", // 获取全部频道信息
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
function getListAllIndexData(pageCurrent,pagePerNum,searchKey, roleId) {
	roleId = $("#selectRole").val() == "" ? roleId : $("#selectRole").val();
	$('#shortCutLinkListAllBody').html("");
	$.ajax({
		url : "/df/portal/setting/getPublishMenuByRole.do",
		type : "GET",
		data : {"tokenid":getTokenId(), "caroleguid" : roleId},
		dataType : "json",
		success : function(data) {
			data = (publishMenuLevel3(data.mapMenu)).menuThirdLevelList;
        	// 数据总数
        	var count = data.length;
            // 总页数
            var pageNum = Math.ceil(count/pagePerNum);
            // 当输入页码跳转的情况
            var toPage = $('#d_changepageAll').val();
            if(toPage>pageNum){
            	toPage=pageNum;
            }
            if (pageCurrent=='undefined'||pageCurrent==''){
            	pageCurrent=toPage;
            }
            // 页面显示行号
            var index=0;
            // 数组下标最小
            var indexMin = (pageCurrent-1)*pagePerNum;
            // 数组下标最大
            var indexMax = indexMin+pagePerNum-1;
            // 当页面条数不足pagePerNum时
            var indexTmp = count-(pageCurrent-1)*pagePerNum;
            if(indexTmp<pagePerNum){
            	indexMax=count-1;
            }
			var result = data;
			var html ='';
			// 分页html
			var pageHtml = "";
			
			for(i=indexMin;i<=indexMax;i++){
				var name = result[i].menu_name,
					url = result[i].url,
					id = result[i].guid,
					menuorder = result[i].menuorder;
				html+='<tr>';
				html+= '<td><input type="checkbox" class="checkbox-info checkbox-primary" value="'+id+'" name="ap_linkallList"> </td>';
				html+='<td><div style="width:300px;">'+name+'</div></td>';
				html+='<td ><div style="width:700px;">'+url+'&menuid='+id+'&menuname='+escape(name)+'</div></td>';
				html+='<td style="display:none;">'+menuorder+'</td>';
				html +='</tr>';
			}
				
			$('#shortCutLinkListAllBody').html(html);
			
			// 分页显示
			pageHtml+='<li><a onclick="getListAllIndexData(1,'+pagePerNum+',\'\');">首页</a></li>';
            // 上一页显示html
            if(pageCurrent==1){
            	pageHtml+='<li class="disabled"><a href="javascript:void(0);">&lt;上一页</a></li>';
            }else{
            	pageHtml+='<li ><a onclick="getListAllIndexData('+(pageCurrent-1)+','+pagePerNum+',\'\')">&lt;上一页</a></li>';
            }
            pageHtml+='<li class="active"><a>-'+pageCurrent+'-</a></li>';
            // 下一页显示html
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
function findByTitle(){
	getListPublishedIndexData(1,20,'', $("#selectRole").val());
}
// 已发布链接获取初始化数据
function getListPublishedIndexData(pageCurrent,pagePerNum,searchKey, roleId) {
	roleId = $("#selectRole").val() == "" ? roleId : $("#selectRole").val();
	var findByTitle = $("#findByTitle").val();
	
	/*	params = {};
	params['ruleID'] = 'portal-df-link.getShortCutLinkPortlet';
	params['searchKey'] = searchKey;
	params['tokenid'] =tokenId;
	params['start'] = '0';
	params['limit'] = '1000';
	params['roleId'] = roleId;

	$.ajax({
		url : "/portal/GetPageJsonData.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
        	// 数据总数
        	var count = data.length;
            // 总页数
            var pageNum = Math.ceil(count/pagePerNum);
            // 当输入页码跳转的情况
            var toPage = $('#d_changepagePublish').val();
            if(toPage>pageNum){
            	toPage=pageNum;
            }
            if (pageCurrent=='undefined'||pageCurrent==''){
            	pageCurrent=toPage;
            }
            // 页面显示行号Zazswq
            var index=0;
            // 数组下标最小
            var indexMin = (pageCurrent-1)*pagePerNum;
            // 数组下标最大
            var indexMax = indexMin+pagePerNum-1;
            // 当页面条数不足pagePerNum时
            var indexTmp = count-(pageCurrent-1)*pagePerNum;
            if(indexTmp<pagePerNum){
            	indexMax=count-1;
            }
			var result = data;
// console.log(result);
			var html ='';
			// 分页html
			var pageHtml = "";
			
			for(i=indexMin;i<=indexMax;i++){
				html+='<tr>';
				html+= '<td><input type="checkbox" class="checkbox-info checkbox-primary" value="'+result[i].link_id+'"name="ap_linkPublishList"> </td>';
				html+='<td><div>'+result[i].page_title+'</div></td>';
				html+='<td><div>'+result[i].portlet_name+'</div></td>';
				html+='<td><div>'+result[i].link_title+'</div></td>';
				html+='<td><div>'+result[i].pub_time+'</div></td>';
				html+='<td style="display:none;">'+result[i].pg_plet_id+'</td>';
				html +='</tr>';
			}
				
			$('#shortCutlinkListPubBody').html(html);
			// 分页显示
			pageHtml+='<li><a onclick="getListPublishedIndexData(1,'+pagePerNum+',\'\');">首页</a></li>';
            // 上一页显示html
            if(pageCurrent==1){
            	pageHtml+='<li class="disabled"><a href="javascript:void(0);">&lt;上一页</a></li>';
            }else{
            	pageHtml+='<li ><a onclick="getListPublishedIndexData('+(pageCurrent-1)+','+pagePerNum+',\'\')">&lt;上一页</a></li>';
            }
            pageHtml+='<li class="active"><a>-'+pageCurrent+'-</a></li>';
            // 下一页显示html
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
	});*/
	var tokenid = tokenId;
	$.ajax({
		url : "/df/portal/setting/getAllPublishPage.do",
		type : "GET",
		dataType : "json",
		data : {
			"tokenid" : tokenid,
			"roleId" : roleId,
			"findByTitle":findByTitle
		},
		success : function(data) {
        	// 数据总数
        	var count = data.length;
            // 总页数
            var pageNum = Math.ceil(count/pagePerNum);
            // 当输入页码跳转的情况
            var toPage = $('#d_changepagePublish').val();
            if(toPage>pageNum){
            	toPage=pageNum;
            }
            if (pageCurrent=='undefined'||pageCurrent==''){
            	pageCurrent=toPage;
            }
            // 页面显示行号Zazswq
            var index=0;
            // 数组下标最小
            var indexMin = (pageCurrent-1)*pagePerNum;
            // 数组下标最大
            var indexMax = indexMin+pagePerNum-1;
            // 当页面条数不足pagePerNum时
            var indexTmp = count-(pageCurrent-1)*pagePerNum;
            if(indexTmp<pagePerNum){
            	indexMax=count-1;
            }
			var result = data;
			var html ='';
			// 分页html
			var pageHtml = "";
			
			for(i=indexMin;i<=indexMax;i++){
				html+='<tr>';
				html+= '<td><input type="checkbox" class="checkbox-info checkbox-primary" value="'+result[i].link_id+'"name="ap_linkPublishList"> </td>';
				html+='<td><div>'+result[i].page_title+'</div></td>';
				html+='<td><div>'+result[i].title+'</div></td>';
				html+='<td><div>'+result[i].menu_name+'</div></td>';
				//html+='<td><div>'+result[i].pub_time+'</div></td>';
				html+='<td style="display:none;">'+result[i].pg_plet_id+'</td>';
				html+='<td style="display:none;">'+result[i].menu_url+'</td>';
				html+='<td><div>'+result[i].menu_order+'</div></td>';
				html+='<td style="display:none;">'+result[i].link_id+'</td>';
				html +='</tr>';
			}
				
			$('#shortCutlinkListPubBody').html(html);
			// 分页显示
			pageHtml+='<li><a onclick="getListPublishedIndexData(1,'+pagePerNum+',\'\');">首页</a></li>';
            // 上一页显示html
            if(pageCurrent==1){
            	pageHtml+='<li class="disabled"><a href="javascript:void(0);">&lt;上一页</a></li>';
            }else{
            	pageHtml+='<li ><a onclick="getListPublishedIndexData('+(pageCurrent-1)+','+pagePerNum+',\'\')">&lt;上一页</a></li>';
            }
            pageHtml+='<li class="active"><a>-'+pageCurrent+'-</a></li>';
            // 下一页显示html
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

function deleteLink(){
	
	// 删除已发布链接
		var rows = document.getElementById("shortCutlinkListPubBody").rows;
		var linkPublish = document.getElementsByName("ap_linkPublishList");
		// 链接ID字符串
		var linkIdListStr='';
		// pgPletId字符串
		var pgPletIdListStr = '';
		for(var i=0;i<linkPublish.length;i++)
		{
		if(linkPublish[i].checked){
		var row = linkPublish[i].parentElement.parentElement.rowIndex-1;
		linkIdListStr += linkPublish[i].value+ ",";
		pgPletIdListStr += rows[row].cells[4].innerHTML+ ",";
		}
		}
	    if(linkIdListStr==""){
	    	ufma.showTip("请选择要删除的链接", function() {}, "warning");
	    	return;
	    }
		
		// 删除已发布链接
		var params = {};
		params['ruleId']="portal-df-link.deleteShortCutLinkPortlet";
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
}
function publishLink(){
	var linkIdListStr='';
    $("input:checkbox[name='ap_linkallList']:checked").each (function(){
    	linkIdListStr += $(this).val() + ",";
    });
    var rows = document.getElementById("shortCutLinkListAllBody").rows;
	var linkPublish = document.getElementsByName("ap_linkallList");
	// 链接ID字符串
	var linkIdListStr='';
	// 链接名字字符串
	var linkTitleListStr = '';
	// 链接Url字符串
	var linkUrlListStr = '';
	//链接排序字段字符串
	var linkMenuOrderListStr = '';
	for(var i=0;i<linkPublish.length;i++)
	{
	if(linkPublish[i].checked){
	var row = linkPublish[i].parentElement.parentElement.rowIndex-1;
	linkIdListStr += linkPublish[i].value+ ",";
	linkTitleListStr += rows[row].cells[1].innerText+ ",";
	linkUrlListStr += rows[row].cells[2].innerText+ ",";
	/*linkMenuOrderListStr += rows[row].cells[3].innerText+ ",";*/
	}
	}
    if(linkIdListStr==""){
    	ufma.showTip("请选择要发布的链接", function() {}, "warning");
    	return;
    }
    
// var linkIdList = linkIdListStr.split(',');
    // 发布至的页面
    var pageId = $('#publishPage').val();
    // 发布至的频道ID
    var pgPletId = $('#publishPgPlet').val();
    
    
	var params = {};
	params['ruleId']="portal-df-link.insertShortCutLinkPortlet";
	params['linkIdList']=linkIdListStr;
	params['linkNmList']=dfp_re.strim(linkTitleListStr);
	params['linkUrlList']=linkUrlListStr;
/*	params['linkMenuOrderList']=linkMenuOrderListStr;*/
	params['pageId']=pageId;
	params['pgPletId']=pgPletId;
	params['tokenid'] =tokenId;
	params['svRoleId'] =$("#selectRole").val();
	params['svUserId'] =svUserId;
	$.ajax({
		url : "/df/portal/publishShortCutLink.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var result = data;
			if (result) {
				$('#publishModal').modal('hide');
				ufma.showTip("发布成功", function() {}, "success");
				getListPublishedIndexData(1,10,'', $("#selectRole").val());
				
			} else {
				$('#publishModal').modal('hide');
				ufma.showTip("发布失败", function() {}, "error");
			}
		}
	});
	/*$.ajax({
		url : "/df/portal/publishShortCutLink.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var result = data;
			if (result) {
				$('#publishModal').modal('hide');
				ufma.showTip("发布成功", function() {}, "success");
				getListPublishedIndexData(1,10,'', $("#selectRole").val());
				
			} else {
				$('#publishModal').modal('hide');
				ufma.showTip("发布失败", function() {}, "error");
			}
		}
	});*/
}


 function getCommonData(options) {
	var common_data = JSON.parse(localStorage.getItem("commonData"));
	options["ajax"] = "noCache";
	options["svFiscalPeriod"] = common_data.svFiscalPeriod;
	options["svSetYear"] = common_data.svSetYear;
	options["svTransDate"] = common_data.svTransDate;
	options["svUserId"] = common_data.svUserId;
	options["svUserCode"] = common_data.svUserCode;
	options["svUserName"] = common_data.svUserName;
	options["svRgCode"] = common_data.svRgCode;
	options["svRgName"] = common_data.svRgName;
	options["svRoleId"] = common_data.svRoleId;
	options["svRoleCode"] = common_data.svRoleCode;
	options["svRoleName"] = common_data.svRoleName;
	return options;
};


function getToDoWork(){
	//根据角色获取对应的链接菜单
	
	//角色Id
	var common_data = JSON.parse(localStorage.getItem("commonData"));
	var roleId = common_data.svRoleId;
	params = {};
	params['ruleID'] = 'portal-df-link.getShortCutLinkPortlet';
	params['pgPletId'] = '3';
	params['roleId'] = roleId;
	params['tokenid'] =tokenId;
	params['start'] = '0';
	params['limit'] = '12';

	$.ajax({
		url : "/portal/GetPageJsonData.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var html = '';
			for ( var i = 0; i < data.length; i++) {
				html += '<li><a data-href="' + data[i].link_url
						+ '" href="javascript:void(0)" data-title="'
						+ data[i].link_title + '" class="text-m">'
						+ data[i].link_title + '</a></li>';

			}
			console.log(html);
//			$("#list-hid").append(html);
//			$('#list-hid li a').on("click",function() {
//				//console.log(2222);
//				Hui_admin_tab($(this));
//			})
		}
	});

	// 我要查询数据查询
	params = {};
	params['ruleID'] = 'portal-df-link.getShortCutLinkPortlet';
	params['pgPletId'] = '5';
	params['userId'] = svUserId;
	params['tokenid'] =tokenId;
	params['start'] = '0';
	params['limit'] = '12';

	$.ajax({
		url : "/portal/GetPageJsonData.do",
		type : "GET",
		dataType : "json",
		data : params,
		success : function(data) {
			var html = '';
			for ( var i = 0; i < data.length; i++) {
				html += '<li><a data-href="' + data[i].link_url
						+ '" href="javascript:void(0)" data-title="'
						+ data[i].link_title + '" class="text-m">'
						+ data[i].link_title + '</a></li>';
			}
			
			console.log(html);
			
//			$("#list-hid2").append(html);
//			$('#list-hid2 li a').on("click",function() {
//				//console.log(2222);
//				Hui_admin_tab($(this));
//			})
		}
	});
	
};

/**
 * 获取当前角色对应的全部菜单
 */
function publishMenuLevel3(menuList) {
	menuThreeLevel = {
		menuFirstLevelList : new Array(),
		menuSecondLevelList : new Array(),
		menuThirdLevelList : new Array(),
		menuFourthLevelList : new Array(),
		menuFivthLevelList : new Array()
	};
	var n1 = 0;
	var n2 = 0;
	var n3 = 0;
	var n4 = 0;
	var n5 = 0;
	var baseNo = 0;
	for (var i = 0; i < menuList.length; i++){
		if(menuList[i].levelno==baseNo){
			menuThreeLevel.menuFirstLevelList[n1] = menuList[i];
			n1++;
		}else if(menuList[i].levelno==baseNo+1){
			menuThreeLevel.menuSecondLevelList[n2] = menuList[i];
			n2++;
		}else if(menuList[i].levelno==baseNo+2){
			menuThreeLevel.menuThirdLevelList[n3] = menuList[i];
			n3++;
		}else if(menuList[i].levelno==baseNo+3){
			menuThreeLevel.menuFourthLevelList[n4] = menuList[i];
			n4++;
		}else if(menuList[i].levelno==baseNo+4){
			menuThreeLevel.menuFivthLevelList[n5] = menuList[i];
			n5++;
		}
	}
	if(menuThreeLevel.menuFirstLevelList!=null && menuThreeLevel.menuFirstLevelList.length>0){
		// 0/1/2
	}else if(menuThreeLevel.menuSecondLevelList!=null && menuThreeLevel.menuSecondLevelList.length>0){
		menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuSecondLevelList;
		menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuThirdLevelList;
		menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFourthLevelList;
	}else if(menuThreeLevel.menuThirdLevelList!=null && menuThreeLevel.menuThirdLevelList.length>0){
		menuThreeLevel.menuFirstLevelList = menuThreeLevel.menuThirdLevelList;
		menuThreeLevel.menuSecondLevelList = menuThreeLevel.menuFourthLevelList;
		menuThreeLevel.menuThirdLevelList = menuThreeLevel.menuFivthLevelList;
	}
	return menuThreeLevel;
}

/**
 * 获取全部角色
 */
function getAllRoles() {
	$.ajax({
		url : "/df/portal/setting/getAllRoles.do",
		type : "GET",
		data : {"tokenid" : tokenId},
		dataType : "json", 
		async : !0,
		success : function(data) {
			var roleList = data.roleList,
				$selectRole = $("#selectRole"),
				html = "";
			// 渲染角色select
			html += '<option value="">全部</option>';
			for(var i in roleList) {
				if(!roleList.hasOwnProperty(i)) {
					continue;
				}
				var id = roleList[i].guid,
					name = roleList[i].role_name;
				html += '<option value="'+ id +'">'+ name +'</option>';
			}
			$selectRole.append(html);
			$selectRole.on("change", function(e) {
				// role -> menu refresh
				var roleId = $(this).val();
				getListAllIndexData(1,100,'', roleId);
				getListPublishedIndexData(1,10,'', roleId);
			});
		}
	});
}
/**
 * 显示增加框
 * 
 */
function addLinkModel() {
	document.getElementById('light').style.display='block';
	document.getElementById('fade').style.display='block';
	document.getElementById("addLinkTitle").focus();
	//获取增加弹出框的所有页面位置
	getSelectPgPletId();
}
/**
 * 初始化增加框中的页面位置
 */
function getSelectPgPletId(){
	var tokenId = getTokenId();
	var selectRoleId =$("#selectRole").val();
	$.ajax({
		url :"/df/portal/setting/getSelectPgPletId.do",
		type : "GET",
		data : {
			"tokenid" : tokenId,
			"selectRoleId" : selectRoleId
			}, 
		success : function(data){
			var html = "";
			for(var i=0; i<data.length; i++ ){
				var id = data[i].id;
				var title = data[i].title;
				html +='<option value="'+ id +'">'+ title +'</option>';
			}
			$("#selectPgPletId").html(html);
			
			
			
		}
	});
	
}
/**
 * 初始化修改框中的页面位置
 */
function getEditSelectPgPletId(value){

	var tokenId = getTokenId();
	var selectRoleId =$("#selectRole").val();
	$.ajax({
		url :"/df/portal/setting/getSelectPgPletId.do",
		type : "GET",
		data : {
			"tokenid" : tokenId,
			"selectRoleId" : selectRoleId
			}, 
		success : function(data){
			var html = "";
			for(var i=0; i<data.length; i++ ){
				var id = data[i].id;
				var title = data[i].title;
				html +='<option value="'+ id +'">'+ title +'</option>';
			}
			
			$("#selectEditPgPletId").html(html);
			
			$("#selectEditPgPletId option[value='"+value+"']").prop("selected", true);
		}
	});
	
}
/**
 * 显示修改框
 */
function editLinkModel(){
	var ids = [],
		$selectCheckbox = new Object;
	$("input[name='ap_linkPublishList']:checked").each(function(i) {
		if (i > 0) {
			return;
		}
		$selectCheckbox = $(this);
		ids.push($(this).val());
	});
	if (ids.length == 0) {
		alert("请选择要修改的数据");
		return;
	} else if (ids.length > 1) {
		alert("请选择一条数据进行操作");
		return;
	}
	
	// 添加默认数据
	var tds = $selectCheckbox.parent().parent("tr").find("td");
	$("#editLinkTitle").val($(tds[3]).text());
	$("#editLinkUrl").val($(tds[5]).text());
	//$("#selectEditPgPletId").val($(tds[4]).text()).selected=true;

	$("#editLinkOrder").val($(tds[6]).text());
	$("#editLinkId").val($(tds[7]).text());
	//$("#editLinkSetYear").val("");
	//$("#editLinkRgCode").val("");
	//$("#rolePageGrouptypeExample").html(getDmpPageNameValStr());
	document.getElementById('editLight').style.display = 'block';
	document.getElementById('editFade').style.display = 'block';
	var value = $(tds[4]).text();
	getEditSelectPgPletId(value);
	document.getElementById("editLinkTitle").focus();
	
}
/**
 *增加菜单
 */
function addLink(){
	var tokenId = getTokenId();
	var addLinkTitle =$("#addLinkTitle").val();
	var addLinkUrl =$("#addLinkUrl").val();
	var addLinkOrder =$("#addLinkOrder").val();
	var addLinkSetYear =$("#addLinkSetYear").val();
	var addLinkRgCode =$("#addLinkRgCode").val();
	var pgPletId =$("#selectPgPletId").val();
	var selectRoleId =$("#selectRole").val();
	$.ajax({
		url : "/df/portal/setting/addLink.do",
		type : "GET",
		data : {
			"tokenid" : tokenId,
			"linkTitle" : addLinkTitle,
			"linkUrl" : addLinkUrl,
			"linkOrder" : addLinkOrder,
			"linkSetYear" : addLinkSetYear,
			"linkRgCode" : addLinkRgCode,
			"pgPletId" : pgPletId,
			"selectRoleId" : selectRoleId
			},
		dataType : "json", 
		async : !0,
		success : function(data) {
	       
		}
	});
}
/**
 *修改菜单
 */
function editLink(){
	var tokenId = getTokenId();
	var editLinkTitle =$("#editLinkTitle").val();
	var editLinkUrl =$("#editLinkUrl").val();
	var editLinkOrder =$("#editLinkOrder").val();
	//var addLinkSetYear =$("#addLinkSetYear").val();
	//var addLinkRgCode =$("#addLinkRgCode").val();
	var editpgPletId =$("#selectEditPgPletId").val();
	var selectRoleId =$("#selectRole").val();
	var  linkId =$("#editLinkId").val();
	$.ajax({
		url : "/df/portal/setting/editLink.do",
		type : "GET",
		data : {
			"tokenid" : tokenId,
			"linkTitle" : editLinkTitle,
			"linkUrl" : dfp_re.strim(editLinkUrl),
			"linkOrder" : editLinkOrder,
			"editpgPletId" : editpgPletId,
			"selectRoleId" : selectRoleId,
			"linkId" :linkId
			},
		dataType : "json", 
		async : !0,
		success : function(data) {
	       
		}
	});
}