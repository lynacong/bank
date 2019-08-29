require(['jquery', 'knockout', 'uui','bootstrap','director'],function ($, ko) {
        
	var infoUrl = "";
	
	//addRouter(infoUrl);
	
	var viewModel = {
            data: {
            	content : ko.observableArray([]),
    			totalPages : ko.observable(0),
    			number : ko.observable(0),
    			totalCount : ko.observable(0)
    			},
    			setData : function(data) {
    				this.data.content(data.content);
    				this.data.totalPages(data.totalPages);
    				this.data.number(data.number+1);
    				this.data.totalCount(data.totalElements);
    			},
    			infoUrl : infoUrl
			
        };
/**
 * 分页请求
 */	
	var currentPageNumber = "";
	var firstPageNumber = "";
	var lastPageNumber = "";
	var tokenid = "";
	viewModel.getPageData = function (pageNumber) {
			var me = this;
        	//var current_url = location.search;
			//tokenid = current_url.substring(current_url.indexOf("tokenid") + 8);
			tokenid = sessionStorage.getItem("tokenid");
            $.ajax({
                url: "/df/portal/ArticleManage/GetArticleData.do",
                type: 'GET',
                dataType: 'json',
				data: {
					tokenid:tokenid,
					pageNumber : Base64.encode(pageNumber)
				},
                success: function (data) {
                	currentPageNumber = data.number+1;
                	firstPageNumber = 1;
                	lastPageNumber = data.totalPages;
          //      	me.tableOddEvent();
                	if(data.totalPages>1&&currentPageNumber==1){
                		$('#beforePage').addClass('disabled');
                		$('#nextPage').removeClass("disabled");
                		$('#beforePage2').addClass('disabled');
                		$('#nextPage2').removeClass("disabled");
                	//	$('#beforePage').attr("disabled", true);
                	}else if(data.totalPages==currentPageNumber){
                		$('#beforePage2').removeClass('disabled');
                		$('#nextPage2').addClass('disabled');
                		$('#beforePage').removeClass('disabled');
                		$('#nextPage').addClass('disabled');
                	}else if(currentPageNumber>1&&currentPageNumber<data.totalPages){
                		$('#beforePage').removeClass('disabled');
                		$('#nextPage').removeClass('disabled');
                		$('#beforePage2').removeClass('disabled');
                		$('#nextPage2').removeClass('disabled');
                	}
                	data.totalPages = "共"+data.totalPages+"页";
                	data.totalElements = "总条数："+data.totalElements;
                	me.setData(data);
                }
            });
        };
        viewModel.nextPage = function(){
        	this.getPageData(currentPageNumber+1+"");
        };
        viewModel.beforePage = function(){
        	this.getPageData(currentPageNumber-1+"");
        };
        viewModel.toFirstPage = function(){
        	this.getPageData(firstPageNumber+"");
        };
        viewModel.toLastPage = function(){
        	this.getPageData(lastPageNumber+"");
        };
        viewModel.changePage = function(){
        	if("1"==pageId){
        		
        		pageNumber = $("#changepage").val();
        	}else{
        		pageNumber = $("#changepage2").val();
        	}
        	this.getPageData(pageNumber+"");
        };
        viewModel.addArticle = function(){
    		window.open("/df/portal/ArticleEdition/articleEdition.html?tokenid="+tokenid,'newwindow',"height=600,width=800,top=20,left=250,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no");
 //   		window.open("/df/portal/ArticleEdition/index.html?tokenid="+tokenid,'newwindow',"height=800,width=800,top=20,left=250,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no");
        };
        viewModel.editArticle = function(){
        	window.open("/df/portal/ArticleEdition/articleEdition.html?tokenid="+tokenid+"&articleId="+articleid,'newwindow',"height=600,width=800,top=20,left=250,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no");
        };
        viewModel.pubArticle = function(){
        	//window.open("/df/portal/ArticleEdition/pubArticle.html?tokenid="+tokenid+"&articleId="+articleid,'newwindow',"height=800,width=800,top=20,left=250,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no");
        	var pgPletId=$("#selectPgPletId").val();
            $.ajax({
                url: "/df/portal/ArticleManage/PubArticleData.do",
                type: 'GET',
                dataType: 'json',
				data: {
					tokenid:tokenid,
					articleId : Base64.encode(articleid),
					pgPletId : pgPletId
				},
                success: function (data) {
                	if(data==true){
                		alert("发布成功！");
                		window.location.reload();
                	}else{
                		alert("发布失败！");
                	}
                }
            });
        	
        };
        viewModel.deleteArticle = function(){
			var me = this;
        	var current_url = location.search;
			tokenid = current_url.substring(current_url.indexOf("tokenid") + 8);
            $.ajax({
                url: "/df/portal/ArticleManage/DeleteArticleDataById.do",
                type: 'GET',
                dataType: 'json',
				data: {
					tokenid:tokenid,
					articleId : Base64.encode(articleid)
				},
                success: function (data) {
                	if(data==true){
                		alert("删除成功！");
                		window.location.reload();
                	}else{
                		alert("删除失败！");
                	}
                }
            });
        };
        
 /**
  * 初始化表格选取行事件
  */     
        var articleid = "";
		this.selColor=function(obj){
			$(".table-striped > tbody > tr").removeClass();
			$(".table-striped > tbody > tr:even").addClass("trEven");
			$(".table_striped > tbody > tr:odd").removeClass();
			$(obj).addClass('selectTr');
			var $td = $(obj).find("td");
			articleid = $td.eq(0).text();
			$('#editArticle').removeClass('disabled');
			$('#deleteArticle').removeClass('disabled');
			$('#pubArticle').removeClass('disabled');
		};
        
		var pageId="1";
        $(function () {
            ko.cleanNode($('body')[0]);
            viewModel.getPageData("1");
 //           viewModel.initTableRows();
            ko.applyBindings(viewModel); 
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        		// 获取已激活的标签页的名称
        		var activeTab = $(e.target).text(); 
        		// 获取前一个激活的标签页的名称
        		var previousTab = $(e.relatedTarget).text(); 
        		$(".active-tab span").html(activeTab);
        		$(".previous-tab span").html(previousTab);
        		if("1"==pageId){
        			pageId = "2";
        		}else pageId = "1";
        		viewModel.getPageData("1");
        	});
        });
        
    });
