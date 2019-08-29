<%@page contentType="text/html; charset=utf-8"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%
    String pgPletId = request.getParameter("pgPletId");
	String userId = request.getParameter("userId");
	String tokenId = request.getParameter("tokenid");
    System.out.println("###########pgPletId"+pgPletId);
    System.out.println("###########userId"+userId);
    
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="js/jquery-1.12.1.js" ></script>
<script type="text/javascript" src="js/ArticleSearch.js"></script>
<script type="text/javascript">
    userId = '<%=userId%>';
    pgPletId = '<%=pgPletId%>';
</script>
<title>通知展示</title>
</head>
<body>
<div style="width: 100%;">	
 			<div style="height: 100px; text-align: center;">
		<!-- 		<div style='margin: 0px auto; width: 1200px; height: 100px; background-image: url("image/top_bg.jpg");'>
				</div> -->
      </div> 
		<div class="rightbox pr" style="height: 100%;">
			<div class="container" style="width: 100%;">
				<div class="container-fluid">
					<div class="form-group">
						<dl class="dlcss" style="width: 1000px; margin-left: 100px;">

							<dd>
								<input id="searchKey" style="margin-left: 550px;"
									onkeypress="if(event.keyCode==13) {$('#mySearch').click();return false;}"
									type="text">
								<button class="btn btn-primary" id="mySearch"
									style="margin-top: -8px;"
									onclick='initSearchList(1,12,document.getElementById("searchKey").value);'
									type="submit">
									<i class="icon-search icon-white"> 搜索</i>
								</button>
							</dd>

							<dd style="margin-top: 20px;">
								<div class="tab-content" id="myTabContent">
									<div class="tab-pane fade active in" id="doneListPanel">
										<div id="doneList">
											<table class="table table-striped"
												style="font-size: 14px; margin-top: 15px;">
												<thead>
													<tr>
														<th></th>
														<th style="font-size: 14px !important;">标题</th>
														<th style="font-size: 14px !important;">发布时间</th>
													</tr>
												</thead>
												<tbody id ="searchContent">
												</tbody>
											</table>
											<div id="donePageDef">
											 	<ul class="pagination" id ="pagination" style=" padding-left: 15%;">
												</ul>
												<div style="margin-top: -70px; margin-left: 70%;">
													<a> <input id="d_changepage"
														style="width: 40px; margin-left: 10px; margin-top: 15px;"
														type="text"> 
														<input class="btn btn-primary"
														id="d_redirect" onclick="initSearchList('',8)"
														style="width: 60px; padding-top: 0px; margin-top: -8px;"
														type="button" value="跳转">
													</a>
												</div>
											</div>
										</div>
									</div>
								</div>
							</dd>
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>