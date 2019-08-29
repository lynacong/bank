//获取当前用户tokenid
function getTokenId() {
	return sessionStorage.tokenid || "";
}

var tokenId = getTokenId();

// 当前已选择页面的角色id
var selectedPageRoleId = [];

$(function() {

	// 获取全部页面配置
	getRolePage();
    
	//rolePageSelect();
	getPageSelect();
	getAddRoles();
	
});



/*//角色页面对应
dmpPageName = {
	JB : "单位经办",
	SH : "单位审核",
	JZZF : "集中支付",
	YWCS : "业务处室",
	GKLeader : "国库领导",
	GKJB : "国库经办",
	ZGBM : "主管部门",
	YWPZ : "业务配置"
};

// 获取 dmpPageName key
function getDmpPageNameKey(val) {
	var keys = Object.keys(dmpPageName);
	for (var i in keys) {
		if (dmpPageName[keys[i]] == val) {
			return keys[i];
		}
	}
	return "";
}
// 获取dmpPageName val str
function getDmpPageNameValStr() {
	var html = "";
	for (var i in dmpPageName) {
		if (!dmpPageName.hasOwnProperty(i)) {
			continue;
		}
		html += dmpPageName[i] + ' ';
	}
	return html;
}
*//**
 * 渲染页面选择select
 *//*
function rolePageSelect() {
	var html = "";
	for (var i in dmpPageName) {
		if (!dmpPageName.hasOwnProperty(i)) {
			continue;
		}
		html += '<option value="' + i + '">' + dmpPageName[i] + '</option>';
	}
	$("#selectGroupType").html(html);
	$("#pageGroupType").html(html);
}
*/
/**
 * 门户页面配置-增加-页面分类的select
 */
function getPageSelect() {
	$.ajax({
		url : "/df/portal/setting/getPageSelect.do",
		type : "GET",
		data : {"tokenid" : tokenId},
		dataType : "json", 
		async : !0,
		success : function(data) {
			var html="";
			for(var i=0;i<data.length;i++){
				html += '<option value="' + data[i].pageid + '">' +data[i].pagetitle+ '</option>';
			}
			$("#selectGroupType").html(html);
			$("#pageGroupType").html(html);
		}
	});

}
/**
 * 获取全部页面配置
 */
function getRolePage() {
	//var tokenId = getTokenId();
	$("#rolePageTableTbody").html("");
	$.ajax({
		url : "/df/portal/setting/getRolePage.do",
		type : "GET",
		data : {
			"tokenid" : tokenId
		},
		dataType : "json",
		success : function(data) {
			var html = "";
			for (var i = 0; i < data.length; i++) {
				var num = i + 1;
				//替换了原来表中的id
				var id = data[i].roleid;
				//var grouptype = data[i].grouptype;
				var rolename = data[i].rolename;
				var roleid = data[i].roleid;
				selectedPageRoleId.push(roleid);
				var pagetitle = data[i].pagetitle;
				//var pageid = data[i].pageid;
				var setyear = data[i].setyear;
				var rgcode = data[i].rgcode;
				html += '<tr>';
				html += '<td><input type="checkbox" class="rolePageCheckbox" name="rolePageCheckbox"/></td>';
				html += '<td>' + num + '</td>';
				html += '<td>' + rolename + '</td>';
				html += '<td>' + pagetitle + '</td>';
				html += '<td style="display:none">' + roleid + '</td>';
				html += '<td style="display:none">' + id + '</td>';
				html += '<td style="display:none">' + setyear + '</td>';
				html += '<td style="display:none">' + rgcode + '</td>';
				//html += '<td style="display:none">' + pageid + '</td>';
				html += '</tr>';
			}
			$("#rolePageTableTbody").html(html);
		}
	});
}

/**
 * 添加
 */
function addRolePage() {
	
	var tokenId = getTokenId();
	var pageFormRoleId =$("#pageFormRoleName").val();
	var pageFormRoleName =  $("#pageFormRoleName").find("option:selected").text();
	var pageGroupId = $("#pageGroupType").val();
	var pageSetYear = $("#pageSetYear").val();
	var pageRgCode = $("#pageRgCode").val();
	
	// 角色-页面绑定 唯一判断
	for(var i in selectedPageRoleId) {
		if(!selectedPageRoleId.hasOwnProperty(i)) {
			continue;
		}
		if(selectedPageRoleId[i] == pageFormRoleId) {
			alert("该角色已经绑定页面");
			return false;
		}
	}
	
	$.ajax({
		url : "/df/portal/setting/addRolePage.do",
		type : "POST",
		data : {
			"tokenid" : tokenId,
			"roleId" : pageFormRoleId,
			"roleName" : pageFormRoleName,
			"groupId" : pageGroupId,
			"setYear" : pageSetYear,
			"rgCode" : pageRgCode
		},
		dataType : "json",
		success : function(data) {
			//alert(data);
			getRolePage();
		}
	});
}

/**
 * 显示增加框
*/
function addRolePageModel() {
	document.getElementById('light').style.display='block';
	document.getElementById('fade').style.display='block';	
	document.getElementById("pageFormRoleName").focus();
}
/**
 * 显示修改框
 */
function editRolePageModel() {
	var ids = [],
		$selectCheckbox = new Object;
	$("input.rolePageCheckbox:checked").each(function(i) {
		if (i > 0) {
			return;
		}
		$selectCheckbox = $(this);
		ids.push($(this).parent().parent("tr").find("td:eq(5)").text());
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
	$("#editRoleId").val($(tds[4]).text()),
	$("#editRoleName").val($(tds[2]).text()),
	// $("#editGroupType").val($(tds[4]).text()),
	$("#editId").val($(tds[5]).text());
	$("#editSetYear").val($(tds[6]).text()),
	$("#editRgCode").val($(tds[7]).text() ? $(tds[7]).text() : "");
	//$("#rolePageGrouptypeExample").html(getDmpPageNameValStr());
	document.getElementById('editLight').style.display = 'block';
	document.getElementById('editFade').style.display = 'block';
	document.getElementById("selectGroupType").focus();
}

/**
 * 修改
 */
function editRolePage() {
	var tokenId = getTokenId();
	var editId = $("#editId").val();
	var editRoleId = $("#editRoleId").val();
	var editRoleName = $("#editRoleName").val();
	//editGroupType = getDmpPageNameKey($("#editGroupType").val()),
	var editGroupId = document.getElementById("selectGroupType").value;
	var editSetYear = $("#editSetYear").val();
	var editRgCode = $("#editRgCode").val();
	$.ajax({
		url : "/df/portal/setting/editRolePage.do",
		type : "POST",
		data : {
			"tokenid" : tokenId,
			"id" : editId,
			"roleId" : editRoleId,
			"roleName" : editRoleName,
			"groupId" : editGroupId,
			"setYear" : editSetYear,
			"rgCode" : editRgCode
		},
		dataType : "json",
		success : function(data) {
			//alert(data);
			getRolePage();
		}
	});
}
/**
 * 删除选定数据
 */
function deleteRolePage() {
	var ids = [];
	$("input.rolePageCheckbox:checked").each(function(i) {
		ids.push($(this).parent().parent("tr").find("td:eq(5)").text());
	});
	if (ids.length == 0) {
		alert("请选择要删除的数据");
		return;
	}
	var idss = ids.join("_");
	$.ajax({
		url : "/df/portal/setting/deleteRolePage.do",
		type : "POST",
		data : {
			"tokenid" : tokenId,
			"ids" : idss
		},
		dataType : "json",
		success : function(data) {
			//alert(data);
			getRolePage();
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			//alert(XMLHttpRequest.status);
			//alert(XMLHttpRequest.readyState);
			alert(textStatus);
			getRolePage();
		}
	});
}

/**
 * 获取添加select全部角色
 */
function getAddRoles() {
	$.ajax({
		url : "/df/portal/setting/getAllRoles.do",
		type : "GET",
		data : {"tokenid" : tokenId},
		dataType : "json", 
		async : !0,
		success : function(data) {
			var roleList = data.roleList,
				$selectRole = $("#pageFormRoleName"),
				html = "";
			for(var i in roleList) {
				if(!roleList.hasOwnProperty(i)) {
					continue;
				}
				var id = roleList[i].guid,
					name = roleList[i].role_name;
				html += '<option value="'+ id +'">'+ name +'</option>';
			}
			$selectRole.append(html);

		}
	});
}



