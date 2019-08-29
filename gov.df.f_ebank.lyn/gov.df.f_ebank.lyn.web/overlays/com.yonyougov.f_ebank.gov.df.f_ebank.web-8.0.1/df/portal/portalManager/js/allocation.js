var leftmenuurl = [];


function getTokenId(){
	return sessionStorage.getItem("tokenid");

}

var tokenId = getTokenId();

$(function(){
	
	getAllocation();
	
	$("#menuFrame").prop("src", "/df/portal/portalManager/shortCutLink.html?tokenid=" + getTokenId());
	getUserName();
});


//获取所有配置页面的菜单
function getAllocation(){
	var userId = $("#svUserId").val();
	var roleId = $("#svRoleId").val();
	var region = $("#svRgCode").val();
	var svUserName = $("#svUserName").val();
	var svUserCode = $("#svUserCode").val();
	$.ajax({
		url:"/df/portal/budget/getAllocation.do",
		type:"GET",
		data:{
			"tokenid":tokenId,
			"userid":userId,
			"roleid":roleId,
			"region":region,
			"svUserName":svUserName,
			"svUserCode":svUserCode
		},
		dataType:"json",
		success:function(data){
			var html="";
			var url ="";
			
			for(var i = 0; i < data.length; i++){
				/*var us = data[i].page_url.split("?");
				alert(us.length);*/
				url = data[i].page_url+"tokenid="+tokenId;
				leftmenuurl[i] = url;
				html += "<li class='treeview'><a  href='javascript:void(0)'><i class='icon-desktop'></i> <span>"+data[i].page_title+"</span></a></li>";
				
			}
			$("#treemenu").html(html);
			$("#treemenu").find("li").each(function(i){
				$(this).on("click",function(){
					$("#menuFrame").prop("src",leftmenuurl[i]);
				});
			});
		}
	});
}
//退出      
function logout(){
	window.location.href = "/df/portal/login/login.html";
}
//获取用户名，加载top栏
function getUserName(){
    
	var tokenId = getTokenId();
	
	$.ajax({
		url:"/df/portal/setting/getUserName.do",
		type:"GET",
		data:{
			"tokenid":tokenId
		},
		dataType:"json",
		success:function(data){
		    alert(data);
			
		}
	});
}