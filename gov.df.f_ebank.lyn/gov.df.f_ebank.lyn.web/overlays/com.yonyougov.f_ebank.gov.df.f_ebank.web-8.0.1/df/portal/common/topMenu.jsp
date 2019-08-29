<%@page contentType="text/html; charset=utf-8"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%
/* 	String userIdTop = (String) session.getAttribute("svUserID");
    String userNameTop = (String) session.getAttribute("svUserName");
	String searchPathTop ="/portal/jsp/ArticleSearch.jsp?";
	//获取系统名称
	org.json.JSONObject portalObject = (org.json.JSONObject)session.getAttribute("portalObject");
	String portalName ="";
	if(portalObject!=null){
	portalName=(String)portalObject.get("portal_name");
	} */
%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
    	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title>国库集中支付系统</title>
		<link rel="stylesheet" href="css/part.css" />
		<script type="text/javascript" src="js/jquery-1.12.1.js" ></script>
		<script type="text/javascript" src="js/part.js" ></script>
	</head>
	<body>
		<div class="head fixed">
			<div class="head_t">
				<div class="top"></div>
				<div class="mid">
					<div class="content">
						<span id="cont_1">待办消息
							<span id="icon11">
								|
							</span>
							<span id="icon1">
								<img src="/portal/html/home_in/part/images/backlog.png"/>
							</span>
						</span>
						
						<span id="cont_2">
							登录名：&nbsp;
							<span id="icon2">
								<img src="/portal/html/home_in/part/images/userName.png"/>
							</span>
						</span>
						
						<span id="cont_3"><a href ="https://sso.cgs.gov.cn/ssoserver/logout.do?url=http://portal.cgs.gov.cn/portal/logout.jsp" >注销</a>
							<span id="icon33">
								|
							</span>
							<span id="icon3">
								<img src="/portal/html/home_in/part/images/logout.png"/>
							</span>
						</span>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>
			<div class="head_b">
				<div class="nav">
					<div class="logo">
						<a href="#"></a>
					</div>
					<ul class="list">
						<li><a href='https://portal.cgs.gov.cn' target="_parent">首页</a></li>
						<li><a href='https://uc.cgs.gov.cn' target="uc" >用户中心</a></li>
						<li><a href='javascript:void(0)'>业务系统</a></li>
						<li><a href='javascript:void(0)'>工作动态</a></li>
					</ul>
					<!--以上是显示部分-->
					<div class="menulist">
						<div class="menu null"></div>
						<div class="one menu null">
						</div>
						<div class="two menu">
							<ul class="hd"></ul>
							<ul class="text" id="operationSystem">
								
							</ul>
						</div>
						<div class="three menu">
							<ul class="hd"></ul>
							<ul class="text">
								<li><a id="222" href="/portal/jsp/ArticleSearch.jsp?pgPletId=222&userId=sa" target="articleSearch">人事</a></li>
								<li><a id="218" href="/portal/jsp/ArticleSearch.jsp?pgPletId=218&userId=sa" target="articleSearch">项目</a></li>
								<li><a id="261" href="/portal/jsp/ArticleSearch.jsp?pgPletId=261&userId=sa" target="articleSearch">装备</a></li>
								<li><a id="220" href="/portal/jsp/ArticleSearch.jsp?pgPletId=220&userId=sa" target="articleSearch">财务</a></li>
								<li><a id="223" href="/portal/jsp/ArticleSearch.jsp?pgPletId=223&userId=sa" target="articleSearch">党群</a></li>
								<li><a id="221" href="/portal/jsp/ArticleSearch.jsp?pgPletId=221&userId=sa" target="articleSearch">科技</a></li>
								<li><a id="224" href="/portal/jsp/ArticleSearch.jsp?pgPletId=224&userId=sa" target="articleSearch">纪检</a></li>
							</ul>	
						</div>
					</div>
				</div>
			</div>
			<div class="clearfix"></div>
		</div>
		<div style="width: 100%;height: 114px;"></div>
	</body>
</html>
