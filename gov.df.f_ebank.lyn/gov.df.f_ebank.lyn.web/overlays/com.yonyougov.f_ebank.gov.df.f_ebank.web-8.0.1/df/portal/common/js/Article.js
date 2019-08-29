window.onload = function () {
    //文章详细数据获取
    initData(articleId);
    getArticleAttach();
//	  getMendorName();
};

function initData(articleId) {
    //项目管理通知获取
    var html = "";
    var html2 = "";
    var path = "../../common/articleDetail.jsp?";
    params = {};
    params['ruleID'] = 'getArticleByParams';
    params['articleId'] = articleId;
    params['start'] = '0';
    params['limit'] = '1';
    params['ajax'] = 'ajax';
    $.ajax({
        url: "/df/portal/getArticleData.do?tokenid=" + dfp.tokenid(),
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (result) {
            //文章详细页面赋值
            var article = result;

            var pubTime = article.pubTime;
            var title = article.title;
            $("#articleTitle").html(title);
            var content = article.content;
            $("#articlePubTime").html(pubTime.substring(0, 10));
            $("#content").html(content);
        },
        failure: function () {
            alert('访问服务器失败!');
        }
    });
}

/**
 * 切换字体size
 */
function changeFont(oper) {
    var fontsize = document.getElementById('content').style.fontSize;
    var fontsizeNum = parseInt(fontsize.substring(0, fontsize.length - 2));
   if (oper === 'add') {
        fontsizeNum += 2;
    } else if (oper === 'sub') {
       // 默认最小字体size为12px
        if (fontsizeNum <= 12) {
            return false;
        }
        fontsizeNum -= 2;
    }
    document.getElementById('content').style.fontSize = fontsizeNum + 'px';
}

function getArticleAttach() {
    params = {};
    params['ruleID'] = 'getArticleAttachByParams';
    params['articleId'] = articleId;
    params['start'] = '0';
    params['limit'] = '10';
    params['ajax'] = 'ajax';
    $.ajax({
        url: "/portal/GetPageJsonData.do?tokenid=" + dfp.tokenid(),
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (result) {
        	//alert(result[0].attach_name);
            //文章附件
            var aa = result[0];
            var resultObject = result;
            if (resultObject && resultObject.length > 0) {
                document.getElementById('attachDiv').style.display = "";
                for (var i = 0; i < resultObject.length; i++) {
                    var table = document.getElementById('articleAttach');
                    newRow = table.insertRow(-1);
                    newCell = newRow.insertCell(-1);
                    newCell.height = "25";
                    newCell.width = "150px";
                    newCell.innerHTML = "&nbsp;";
                    newCell = newRow.insertCell(-1);
                    newCell.className = "font1";
                    newCell.height = "25";
                    //newCell.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class='article' style='cursor:hand' href=\"/portal.cms/downloadFile.action?attachId=" + resultObject[i].attach_id + "\">" + (i + 1) + ".&nbsp;" + resultObject[i].attach_name + "</a>";
                    newCell.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class='article' style='cursor:hand' href=\"/df/portal/budget/downloadFile.do?attachId="+resultObject[i].attach_id+"&fileName="+resultObject[i].attach_name+"\">"+(i+1)+".&nbsp;"+resultObject[i].attach_name+"</a>";
                }
            }
        },
        failure: function () {
            alert('访问服务器失败!');
        }
    });
}

function getMendorName() {
    params = {};
    params['ruleID'] = 'getMendorName';
    params['userId'] = userId;
    params['start'] = '0';
    params['limit'] = '1';
    params['ajax'] = 'ajax';
    var current_url = location.search;
    var tokenId = current_url.substring(current_url.indexOf("tokenid") + 8);
    $.ajax({
        url: "/portal/GetPageJsonData.do?tokenid=" + tokenId,
        type: 'GET',
        data: params,
        dataType: 'json',
        success: function (result) {
            var resultObject = result;
            if (resultObject && resultObject.length > 0) {
                document.getElementById('mendor').innerHTML = resultObject[0].user_name;
            } else {
                document.getElementById('mendor').innerHTML = "办公室";
            }
        }
    });
}

/**
 * 打印本页
 */
function printContent() {
    var body = window.document.body.innerHTML;
    var prnHtml = document.getElementById("articleDiv").innerHTML;
    window.document.body.innerHTML = prnHtml;
    window.print();
    window.document.body.innerHTML = body;
}
		
