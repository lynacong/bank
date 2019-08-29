// 获取预算单点登录
function getDanUrl(){
    
	var tokenId = getTokenId();
	var userId = $("#svUserId").val();
	var roleId = $("#svRoleId").val();
	var region = $("#svRgCode").val();
	var svUserName = $("#svUserName").val();
	var svUserCode = $("#svUserCode").val();
	$.ajax({
		url:"/df/portal/budget/getDanUrl.do",
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
		    
			var html= "";
			var html1= "";
			html = '<li><a href="javascript:toUrl();">预算管理系统</a></li>';
			$("#danurl").html(html);
			html1 ='<li><span class="bor"></span><a>'+data[0].svUserName+'</a></li> <li><span class="bor"></span><a href="/df/portal/budget/changepw.html?tokenid='+tokenId+'">修改密码</a><span class="bor"></span></li><li><span class="bor"></span><a href="/df/portal/login/login.html">退出</a></li>';
			$("#top-in").html(html1);
		}
	});
}
//单点登录路径
function toUrl(){
	var tokenId = getTokenId();
	 var svUserCode= $("#svUserCode").val();
	var url = "http://10.10.65.194:7007/gfmis/login?sysapp=800&ucode="+svUserCode+"&&sid=1HKQJNhpvvY3Zm6G6D&setyear=2017&rgcode=420000&loadModel=1&version=V3.0.6.0";
	var hidden_a = $(".one_hidden_a");
	hidden_a.attr('href', url);
	hidden_a[0].click();
}
// 获取待办事项
function getBudgetTask(){
    
	var tokenId = getTokenId();
	var userId = $("#svUserId").val();
	var roleId = $("#svRoleId").val();
	var region = $("#svRgCode").val();
	var svUserName = $("#svUserName").val();
	var svUserCode = $("#svUserCode").val();

	$.ajax({
		url:"/df/portal/budget/getBudgetTask.do",
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
			var html = "";
			var count = 1;
			for(var i=0; i<data.length; i++){
				var name = data[i].name;
				//var task = dealingThing[i].task_content;
				var url = "http://10.10.65.194:7007/gfmis".replace(/(^\s*)|(\s*$)/g, "")+data[i].url.replace(/(^\s*)|(\s*$)/g, "")+'&tokenid='+getTokenId();
				//html += '<li><span class="icon"></span><a href="'+ 'url' +'" target="_blank">'+ '专项指标录入' +' &nbsp;&nbsp;<span class="c-red">'+ '未送审1条' +'</span></a></li>';
				html += '<li><span class="icon"></span><a href="'+url+'" target="_blank">'+name+' &nbsp;&nbsp;<span class="c-red"></span></a></li>';
				count++;
				if(count==7){
					break;
				}
			}
			
			$("#list-r2").html(html);
		}
	});
}
//获取公告
function GetPageJsonData(){
	 var current_url = window.location.href;
	   
		// 截取IP，eg: http://10.10.10.10:9999/login.html
		var arr = current_url.split("/");
		//10.10.10.10:9999
		var IP = arr[2];
		var IP2 = IP.split(":");
		//10.10.10.10
		var IP3 =IP2[0];
	var tokenId = getTokenId();
	var userId = $("#svUserId").val();
	var roleId = $("#svRoleId").val();
	var region = $("#svRgCode").val();
	var svUserName = $("#svUserName").val();
	$.ajax({
		url:"/portal/GetPageJsonData.do?tokenid="+tokenId,
		type:"GET",
		data:{
			"tokenid":tokenId,
			"ruleID":'getArticleData',
			"pgPletId":'16',
			"userId":'sa',
			"start":'0',
			"limit":'6'
		},
		dataType:"json",
		success:function(data){
			var html = "";
			var html2= "";
			
        	var path ="../common/articleDetail.jsp?";
        	for(var i=0;i<4;i++){
        		var name = (data[i].article_title).replace(/(^\s+)|(\s+$)/g, "");
        		var url = path+'articleId='+data[i].article_id+'&title='+name+'&tokenid='+getTokenId();
        		html+= '<li style="width:270px;line-height:30px;"><span class="icon"></span><a href="'+url+'" title="'+name+'" target="view_window">'+name+'</a></li>';
        	}
        	$("#m-content").html(html);
		}
	});
}
//获取文件下载
function getDownload(){
    
	var tokenId = getTokenId();
	var userId = $("#svUserId").val();
	var roleId = $("#svRoleId").val();
	var region = $("#svRgCode").val();
	var svUserName = $("#svUserName").val();
	var svUserCode = $("#svUserCode").val();
	$.ajax({
		url:"/df/portal/budget/getDownload.do",
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
			var html = "";
			for(var i=0;i<data.length;i++){
				var name =data[i].downname;
				html+='<li><span class="icon"></span><a  href="/servlet/DownLoadServlet?name='+name+'" id="'+name+'">'+name+'</a></li>';
			}
			$("#download").html(html);
		
		}
	});
}


	
	
//修改密码
function changePassWord(){
    
	var tokenId = getTokenId();
	var userId = $("#svUserId").val();
	var roleId = $("#svRoleId").val();
	var region = $("#svRgCode").val();
	var svUserName = $("#svUserName").val();
	var svUserCode = $("#svUserCode").val();
    var oldpasswd1 = $("#oldpasswd").val();
    var oldpasswd = hex_md5(oldpasswd1);
    //var password = hex_md5(passWord);
    var passwd = $("#passwd").val().replace(/(^\s+)|(\s+$)/g, "");
    var passwd2 = $("#passwd2").val().replace(/(^\s+)|(\s+$)/g, "");
    var passwdmd5 = hex_md5(passwd);
    if(passwd==passwd2){
    	$.ajax({
    		url:"/df/portal/budget/changePassWord.do",
    		type:"GET",
    		data:{
    			"tokenid":tokenId,
    			"userid":userId,
    			"roleid":roleId,
    			"region":region,
    			"svUserName":svUserName,
    			"svUserCode":svUserCode,
    			"oldpasswd":oldpasswd,
    			"passwd":passwd,
    			"passwd2":passwd2,
    			"passwdmd5":passwdmd5
    		},
    		dataType:"json",
    		success:function(data){
    			if(data[0].flag=="1"){
    				alert("密码修改成功");
    				
    			}else if(data[0].flag=="2"){
    				alert("原始密码验证失败");
    			}else{
    				alert("密码修改失败");
    			}
    			
    			
    		}
    	});
    }else{
    	alert("两次密码不一致，请重新输入！");
    }

}

