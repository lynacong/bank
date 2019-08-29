<%@page contentType="text/html; charset=utf-8" %>
<%@page import="gov.df.fap.util.factory.ServiceFactory" %>
<%@page import="gov.df.fap.bean.portal.ArticleEntity" %>
<%@page import="gov.df.fap.api.portal.IBaseDao" %>
<%@page import="gov.df.fap.service.portal.dao.BaseDao" %>
<%@page import="java.util.Map" %>
<%@page import="java.util.List" %>
<%@page import="java.util.HashMap" %>
<%
    String userId = "sa";
    String articleId = null == request.getParameter("articleId") ? ""
            : request.getParameter("articleId");
%>
<html>
<head>
    <title>通知公告</title>
    <script type="text/javascript" src="js/Article.js"></script>
    <script type="text/javascript" src="js/jquery-1.12.1.js"></script>
    <script src="/df/portal/admin/index/js/dfp/dfp.js"></script>
    <style type="text/css">
        body {
            background-image: url(image/main_bg.jpg);
            background-repeat: repeat-x;
            background-attachment: fixed;
            background-position: bottom;
            background-color: #ffffff;
            margin: 0 0 0 0;
        }

        .STYLE1 {
            font-size: 14px;
            color: #990033;
        }

        .font1 {
            color: #000000;
        }

        a.article:link {
            color: #000000;
            text-decoration: none;
        }

        /*未访问的链接 */
        a.article:visited {
            color: #000000;
            text-decoration: none;
        }

        /*已访问的链接*/
        a.article:hover {
            color: #ff0000;
            text-decoration: underline;
        }

        /*鼠标在链接上 */
        a.article:active {
            color: #ff0000;
            text-decoration: none;
        }

    </style>
    <script type="text/javascript">
        var articleId = <%=articleId%>;
        var userId = '<%=userId%>';
    </script>
</head>
<body style="overflow: auto;margin-top:50px">
<table width="1000" border=0 align="center" cellpadding="0"
       cellspacing="1" bgcolor="#6DB3F8">
    <tr>
        <td bgcolor="#FFFFFF">
            <table width="100%" border=0 align="center" cellpadding="0" cellspacing="0">
                <tr>
                    <td bgcolor="#ffffff" align="center">
                        <table width="100%" align="center" border=0 cellpadding="0" cellspacing="0" height="40">
                            <tr>
                                <td align="center" style="padding-top:40px;">
                                    <font color="#16569d"> <span style="font-size:22px;font-weight:bold;" id="articleTitle"></span> </font>
                                </td>
                            </tr>
                        </table>
                        <div style="height:15px;">
                            <hr width="800" color="#94bfe1" style="height:1px"/>
                        </div>
                        <table width="100%" border=0 cellpadding="0" cellspacing="0" bgcolor="#ffffff" class="font1" style="font-size:12px;">
                            <tr>
                                <td align="right" width="*" height="25">发布日期：<span id="articlePubTime"></span>&nbsp;&nbsp;</td>
                                <td align="left" width="150">&nbsp;&nbsp;&nbsp;&nbsp;作 者：<span id="mendor">系统管理员</span></td>
                                <td align="right" width="380">
                                    <table width="100%" border="0" cellspacing="3" cellpadding="2" class="font1" style="font-size:12px;">
                                        <tr>
                                            <td align="right">
                                                【<a href="#" onClick="changeFont('sub');">减小字体</a>】&nbsp;
                                                【<a href="#" onClick="changeFont('add');">增大字体</a>】&nbsp;
                                                【<a href="#" onClick="printContent();">打印本页</a>】&nbsp;
                                                【<a href="#" onClick="window.close()">关闭本页</a>】&nbsp;&nbsp;
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td bgcolor="#ffffff" align="left">
                        <div id="articleDiv" style="width:1000;margin-top:20px">
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="150"></td>
                                    <td id="content" style="font-size:14px;"></td>
                                    <td width="150"></td>
                                </tr>
                                <tr style="height: 100px;"></tr>
                            </table>
                            <div id="attachDiv" style="margin-top:10px">
                                <div style="height:25px;font-size:14px;margin-left:150px;">附件:</div>
                                <div style="margin-left:0px;">
                                    <table id="articleAttach" width="100%" border="0" cellspacing="0" cellpadding="0" class="font1" style="font-size:14px;">
                                    </table>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>