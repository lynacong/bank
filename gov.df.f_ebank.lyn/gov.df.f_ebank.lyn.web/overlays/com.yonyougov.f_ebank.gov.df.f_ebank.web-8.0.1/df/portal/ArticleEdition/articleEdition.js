require(['jquery','knockout','director','date','fileInput','bootstrap','ckeditor','Base64'],function ($,ko) {
        
	var infoUrl = "";
	
	//addRouter(infoUrl);
	
	var viewModel = {
            data: ko.observable(),
            title:ko.observable(""),
            articleNo:ko.observable(""),
            articleAuthor:ko.observable(""),
            createTime:ko.observable(""),
            picUrl:ko.observable(""),
            validateTime:ko.observable(""),
            expireTime:ko.observable(""),
            articleLink:ko.observable(""),
            articleIntroduction:ko.observable(""),
            articleContent:ko.observable(""),
    		setData : function(data) {
    				this.data(data);
    				this.title(data.title);
    				this.articleAuthor(data.author);
    				this.articleNo(data.articleNo);
    				this.createTime(data.createTime);
    				this.picUrl(data.imgUrl);
    				this.validateTime(data.validateTime);
    				this.expireTime(data.expiredTime);
    				this.articleLink(data.href);
    				this.articleIntroduction(data.review);
    				$("#articleContent")[0].value = data.content;
    				//this.articleContent(data.content);
    			},
    		infoUrl : infoUrl
			
        };
	
	var isEdit = "";
	var tokenid = "";
	var current_url = "";
	var ajax = "ajax";
	var articleId = "";
	viewModel.initData = function () {
		var current_url = location.search;
		var me = this;
		GetArgs(current_url);
		$.ajax({
            url: "/df/portal/ArticleManage/GetArticleDataById.do?tokenid=" + tokenid,
            type: 'GET',
            dataType: 'json',
			data: {
				tokenid:tokenid,
				articleId: Base64.encode(articleId)
			},
            success: function (data) {
            	me.setData(data);
            }
        });
	};
	
	function GetArgs(params){
	    var argsIndex = params.indexOf("?tokenid");
	    var arg = params.substring(argsIndex+1);
	    args = arg.split("&");
	    var valArg = "";
	    for(var i =0;i<args.length;i++){
	    str = args[i];
	    var arg = str.split("=");
	 
	        if(arg.length<=1) continue;
	        if(arg[0] == "tokenid"){
	        	tokenid = arg[1];
	        }else if(arg[0] == "articleId"){
	        	articleId = arg[1];
	        }
	    }
	}
	viewModel.saveArticle = function () {
			var me = this;
			if(articleId==""){
				articleId = "0";
			}
			var articleTittle = $('#articleTittle').val();
			var articleNumber = $('#articleNumber').val();
			var articleAuthor = $('#articleAuthor').val();
			var createTime = $('#createTime').val();
			var picUrl = $('#picUrl').val();
			var validateTime = $('#validateTime').val();
			var expireTime = $('#expireTime').val();
			var articleLink = $('#articleLink').val();
			var articleIntroduction = $('#articleIntroduction').val();
			var articleContent = CKEDITOR.instances.articleContent.getData();
	//		var articleAttach = $('#articleAttach').val();
			
            $.ajax({
                url: "/df/portal/ArticleManage/SaveArticleData.do?tokenid=" + tokenid,
                type: 'GET',
                dataType: 'json',
				data: {
					tokenid:tokenid,
					articleId: Base64.encode(articleId),
					articleTittle : articleTittle,
					articleNumber : Base64.encode(articleNumber),
					articleAuthor : articleAuthor,
					createTime : Base64.encode(createTime),
					picUrl : Base64.encode(picUrl),
					validateTime : Base64.encode(validateTime),
					expireTime : Base64.encode(expireTime),
					articleLink : Base64.encode(articleLink),
					articleIntroduction : Base64.encode(articleIntroduction),
					articleContent : articleContent
				},
                success: function (data) {
                	if(data==false){
                		alert("文章保存失败！");
                	}
                	if(data==true){
                		alert("文章保存成功！");
                		window.close();
                	}
                	me.setData(data);
                }
            });
        };
        
        $(function () {
            ko.cleanNode($('body')[0]); 
 //           viewModel.getPageData(1);
            viewModel.initData();
            ko.applyBindings(viewModel);
          	$('#datetimepicker-create').datetimepicker({
                language:  'zh-CN',
                weekStart: 1,
                todayBtn:  1,
        		autoclose: 1,
        		todayHighlight: 1,
        		startView: 2,
        		forceParse: 0,
                showMeridian: 1
            });
        	$('#datetimepicker-active').datetimepicker({
                weekStart: 1,
                todayBtn:  1,
        		autoclose: 1,
        		todayHighlight: 1,
        		startView: 2,
        		forceParse: 0,
                showMeridian: 1
            });
        	$('#datetimepicker-invalidate').datetimepicker({
                weekStart: 1,
                todayBtn:  1,
        		autoclose: 1,
        		todayHighlight: 1,
        		startView: 2,
        		forceParse: 0,
                showMeridian: 1
            });
          //初始化fileinput控件（第一次初始化）
            $('#file-1').fileinput({
               language: 'zh', //设置语言  
               uploadUrl: "/df/portal/ArticleManage/UpLoadArticleAttach.do?tokenid="+tokenid,  //上传地址  
               showUpload: false, //是否显示上传按钮  
               showRemove:true,  
               showCaption: true,//是否显示标题
                dropZoneEnabled: false,  
               showCaption: true,//是否显示标题  
               allowedPreviewTypes: ['image'],  
                   allowedFileTypes: ['image'],  
                   allowedFileExtensions:  ['jpg', 'png'],  
                   maxFileSize : 2000,  
               maxFileCount: 2, 
           }).on("filebatchselected", function(event, files) {  
               $(this).fileinput("upload");  
           }).on("fileuploaded", function(event, data) {  
               $("#path").attr("value",data.response);  
           });   
        });
        

        
    });
