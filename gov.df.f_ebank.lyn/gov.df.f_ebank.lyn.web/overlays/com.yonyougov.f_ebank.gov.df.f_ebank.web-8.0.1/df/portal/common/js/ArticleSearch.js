
  window.onload = function()
  {
	  //检索通知(页码，每页显示条数)
	  initSearchList(1,8,'');
};
		function initSearchList(pageCurrent,pagePerNum,searchKey){
		  	  //项目管理通知获取
				var html = "";
				var html2 = "";
				var path ="../../portal/common/articleDetail.jsp?";
				params = {};
				params['ruleID'] = 'getArticleData';
				params['pgPletId'] = 16; // AND PG_PLET_ID = '16'
				params['userId'] = userId;
				params['searchKey'] = searchKey;
				params['start'] = '0';
				params['limit'] = '12';
	        	var current_url = location.search;
				var tokenId = current_url.substring(current_url.indexOf("tokenid") + 8);
	            $.ajax({
	            	url: "/portal/GetPageJsonData.do?tokenid=" + tokenId,
	                type: 'GET',
			        data :params,
			        dataType : 'json',
			        success: function(result){
//			        	var res = Ext.decode(response.responseText);
			        	//数据总数
			        	var count = result.length;
			            //总页数
			            var pageNum = Math.ceil(count/pagePerNum);
			            var dataList = result;
			            //当输入页码跳转的情况
			            var toPage = $('#d_changepage').val();
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
			            for(var i=indexMin;i<=indexMax;i++){
			            index++;
		            	html+='<tr>';
			            html+='<td>'+index+'</td>';
			            html+='<td class ="articleTitle" >'+dataList[i].article_title+'</td>';
			            html+='<td class ="articlePubtime">'+dataList[i].pub_time.substring(0,10)+'</td>';
			            html+='<td style="text-align: right;"><a href="'+path+ 'articleId='+dataList[i].article_id+'&pubTime='+dataList[i].pub_time+'&tokenid='+tokenId+'"target="articleDetail">'+'详细信息>></a>';
			            html+='</td>';
			            html+='</tr>';
			            }
			            $("#searchContent").html(html);
			            html2+='<li><a onclick="initSearchList(1,'+pagePerNum+',\'\');">首页</a></li>';
			            //上一页显示html
			            if(pageCurrent==1){
			            	html2+='<li class="disabled"><a href="javascript:void(0);">&lt;上一页</a></li>';
			            }else{
			            	html2+='<li ><a onclick="initSearchList('+(pageCurrent-1)+','+pagePerNum+',\'\')">&lt;上一页</a></li>';
			            }
			            html2+='<li class="active"><a>-'+pageCurrent+'-</a></li>';
			            //下一页显示html
			            if(pageCurrent>= pageNum){
			            	html2+='<li class="disabled"><a  href ="javascript:void(0);">下一页&gt;</a></li>';
			            }else{
			            	html2+='<li><a onclick="initSearchList('+(pageCurrent+1)+','+pagePerNum+',\'\');">下一页&gt;</a></li>';
			            }
			            
			            html2+='<li><a onclick="initSearchList('+pageNum+','+pagePerNum+',\'\');">末页</a></li>';
			            html2+='<li><a>共'+pageNum+'页</a></li>';
			            html2+='<li><a>条数：'+count+'</a></li>';
			            html2+='</ul>';
			            $("#pagination").html(html2);
			        },
			        failure: function(){
			        	alert('访问服务器失败!');
			        }
			    });
		}
		
