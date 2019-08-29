var index = {
	roleId : JSON.parse((sessionStorage.getItem("commonData"))).svRoleId,
	setYear : JSON.parse((sessionStorage.getItem("commonData"))).svSetYear,
	taskDataLength : 0,
//		我的常用操作
	basicOperation: function() {
        $.ajax({
            url: '/df/fb/fbpanel/getFBPanelUrl.do',
            type: 'post',
            data:{"type":4},
            dataType: 'json',
            success: function (data) {
            	var liLength = data.length;
				var totalPage = Math.ceil(liLength/6);
				var totalPageHtml = "";
				var carouselInner = "";
				for(var j = 0;j < totalPage;j++) {
					totalPageHtml += '<li data-target="#myCarousel" data-slide-to="'+j+'"></li>';
					carouselInner += '<div class="item">'+
							            '<ul id="baOper'+j+'">'+
										'</ul>'+
							         '</div>';	
				}
				$("#totalPage").empty().append(totalPageHtml);
				$("#carouselInner").empty().append(carouselInner);
				$("#totalPage li:first").addClass("active");
				$("#carouselInner div:first").addClass("active");
				for(var n = 1;n <= totalPage;n++) {
					var num;
					if(n*6 < data.length) {
						num = n*6;
					}else {
						num = data.length;
					}
					var html = "";
					for(var i = (n-1)*6;i < num;i++) {
	                	html += '<li id="'+data[i].id+'" class="cycz_cen" clickUrl="'+data[i].url+'">'+
	                    			'<a href="" onclick="return false">'+
		                    			'<img src="'+data[i].iconpath+'"/>'+
	                    			'</a>'+
	                    			'<div class="bainfo"><span>'+data[i].urlname+'</span></div>'+
	                			'</li>';
	                }
					$("#baOper"+(n-1)).empty().append(html);
				}
                
                index.sessionUrl("#myCarousel ul","li");
                for(var j = 0;j < data.length; j++) {
                	index.clickUrl("#myCarousel",data[j].id,data[j].destname,data[j].url);
                }
                $(".bainfo").each(function() {
                	if($(this).children("span").text().length > 6) {
                		$(this).children("span").addClass("horse");
                	}
                });
                //$('.carousel').carousel();
                
            }
        });

	},
//	获取权限单位
//	getPower: function() {
//		//获取权限单位
//		$.ajax({
//		    url: '/df/fb/fbpanel/getAgencyData.do',
//		    type: 'post',
//		    data: {
//		    	"tokenid": fbUtil.tokenid(),
//		    	"roleId":index.roleId,
//		    	"ajax":"1"
//		    	},
//		    dataType: 'json',
//		    success: function (data) {
//		    	if(data && data.length>0) {
//					var unit = [];
//					for(var i = 0;i < data.length;i++) {
//						if(data[i].is_leaf > 0) {
//							unit.push({agencyName:data[i].agency_name,agencyCode:data[i].agency_code});
//						}
//					}
//					if(unit.length > 0) {
//						$("#powerUnit").show();
//						var html = '';
//						for(var j = 0;j < unit.length;j++) {
//							html += '<option id="'+unit[j].agencyCode+'">'+unit[j].agencyName+'</option>';
//						}
//						$("#powerUnit").empty().append(html);
//						$("#powerUnit>option").eq(0).prop("selected","selected");
//						var agencycode = $("#powerUnit>option:selected").attr("id");
////						index.unfinishTask(agencycode);
//						sessionStorage.agencyCode = agencycode;
//					}
//				}
//		    }
//		});
//		
//	},
//	点击跳转页面
	clickUrl: function(data,id,name,url) {
		$(data).on("click","#"+id+"",function() {
			if(data == "#taskInit") {
				sessionStorage.wfid = $(this).attr("wfid");
			}
			window.parent.addTabToParent(name, fbUtil.fullUrl(url));
			sessionStorage.nodeid = "";
			sessionStorage.nodeidNode = "";
			sessionStorage.agencyCode = "";
			sessionStorage.agencyCodeNode = "";
		});
	},
//		公告信息
	getPageData: function(pageNumber) {
		var current_url = location.search;
	    $.ajax({
	        url: "/df/portal/ArticleManage/GetArticleData.do",
	        type: 'GET',
	        dataType: 'json',
			data: {
				"tokenid":fbUtil.tokenid(),
				"pageNumber": Base64.encode(pageNumber)
			},
		    success: function (data) {
		    	index.noticeInfo(data.content);
		    	index.clickPageData();
		    }
		});
	},
	noticeInfo: function(data) {
		var html = "";
		for(var i = 0;i < data.length;i++) {
			html += "<li id='"+data[i].id+"'><b class='star'></b><a href='' onclick='return false'>"+data[i].title+"</a></li>";
		}
		$("#noticeInfo").empty().append(html);
	},
//	扇形图切换
	showDiv1: function() {
		if($("#containeraa").css("display")=="none"){
			  $("#container").hide();
			  $("#containeraa").show();
		  }else{
			  $("#container").show();
			  $("#containeraa").hide();
		  }
	},
//	柱状图切换
	showDiv2: function() {
		if($("#container2").css("display")=="none"){
			$(".bottom-cen2 .title").text("本年预算安排情况分析");
			$("#container1").hide();
			$("#container2").show();
		}else{
			$(".bottom-cen2 .title").text("历年预算安排情况对比分析");
			$("#container1").show();
		    $("#container2").hide();
		}
	},
	//待办事项
	backlog: function() {
		var params = {
		        tokenid: getTokenId(),
		        userid: $("#svUserId", parent.document).val(),
		        roleid: $("#svRoleId", parent.document).val(),
		        region: $("#svRgCode", parent.document).val(),
		        year: $("#svSetYear", parent.document).val()
		    };
		$.ajax({
		    url: '/df/portal/getDealingThing.do',
		    type: 'get',
		    dataType: 'json',
		    data: params,
		    success: function (array) {
		    	var data = array.dealingThing;
		    	var html = "";
		    	for(var i = 0;i < data.length;i++) {
		    		var taskContent = data[i].task_content;
		    		taskContent = taskContent.split("：")[1].substr(0,1);
		    		html += "<li id='"+data[i].menu_id+"'><b class='star'></b><a href='' onclick='return false'><span>"+taskContent+"条</span><span>"+data[i].menu_name+"</span></a></li>";
		    	}
		    	$("#myTask").empty().append(html);
		    	for(var j = 0;j < data.length; j++) {
                	index.clickUrl("#myTask",data[j].menu_id,data[j].menu_name,data[j].menu_url);
                }
		    }
		});
	},
//	发起任务
	taskInit: function() {
		$.ajax({
		    url: '/df/fb/fbpanel/getFBPanelStartUrl.do',
		    type: 'post',
		    dataType: 'json',
		    success: function (data) {
		    	if(data.errorCode == 0) {
            		var array = data.objData;
            		index.taskDataLength = array.length;
                	if(array && array.length>0) {
                		var html = "";
                		for(var i = 0;i < array.length;i++) {
                			var name = array[i].urlname.replace(/\$setyear\$/gi,index.setYear);
                			html += '<li id="'+array[i].id+'" clickUrl="'+array[i].url+'" wfid="'+array[i].wfid+'">'+
			        					'<b class="star"></b>'+
			        					'<a href="" onclick="return false">'+
			        						'<span>'+name+'</span>'+
			        					'</a>'+
			        				'</li>';
                		}
                	}
                	$("#taskInit").empty().append(html);
                	index.sessionUrl("#taskInit","li");
                	for(var j = 0;j < array.length; j++) {
                		var name = array[j].urlname.replace(/\$setyear\$/gi,index.setYear);
                    	index.clickUrl("#taskInit",array[j].id,name,index.encodeUrl(array[j]));
                    }
                	$("#initiateTask .circlenum").hide();
                	if(index.taskDataLength != 0) {
                		$("#initiateTask .circlenum").show().text(index.taskDataLength);
                	}
            	}else {
            		alert(data.message);
            	}
		    }
		});
	},
	encodeUrl:function(data) {
		var url = data.url;
		url = url + (url.indexOf("?") ==-1 ? "?" : "&") + 
			"wfid=" + data.wfid; 
		return encodeURI(url);
	},
	unfinishTask: function() {
		$.ajax({
		    url: '/df/fb/fbpanel/getFBPanelUnFinishUrl.do',
		    type: 'post',
		    dataType: 'json',
            data:{"type":4},
		    success: function (data) {
		    	if(data.errorCode == 0) {
            		var array = data.objData;
            		index.taskDataLength = array.length;
                	if(array && array.length>0) {
                		var html = "";
                		for(var i = 0;i < array.length;i++) {
                			html += '<li id="'+array[i].task_id+'" clickUrl="'+array[i].url+'">'+
			        					'<b class="star"></b>'+
			        					'<a href="" onclick="return false">'+
			        						'<span>'+array[i].urlname+'</span>'+
			        					'</a>'+
			        				'</li>';
                		}
                	}
                	$("#unfinishedTask").empty().append(html);
                	index.sessionUrl("#unfinishedTask","li");
                	for(var j = 0;j < array.length; j++) {
                		var url = array[j].url;
                		url = url + (url.indexOf("?") ==-1 ? "?" : "&") + 
                			"task_id=" + array[j].task_id; 
                    	index.clickUrl("#unfinishedTask",array[j].task_id,array[j].urlname,url);
                    }
                	index.clickTaskid("#unfinishedTask");
                	$("#unfinishTask .circlenum").hide();
                	if(index.taskDataLength != 0) {
                		$("#unfinishTask .circlenum").show().text(index.taskDataLength);
                	}
            	}else {
            		alert(data.message);
            	}
		    }
		});
	},
	finishTask: function() {
		$.ajax({
		    url: '/df/fb/fbpanel/getFBPanelFinishUrl.do',
		    type: 'post',
		    dataType: 'json',
		    success: function (data) {
		    	if(data.errorCode == 0) {
            		var array = data.objData;
            		index.taskDataLength = array.length;
                	if(array && array.length>0) {
                		var html = "";
                		for(var i = 0;i < array.length;i++) {
                			html += '<li id="'+array[i].task_id+'">'+
			        					'<b class="star"></b>'+
			        					'<a href="" onclick="return false">'+
			        						'<span>'+array[i].urlname+'</span>'+
			        					'</a>'+
			        				'</li>';
                		}
                	}
                	$("#finishedTask").empty().append(html);
                	for(var j = 0;j < array.length; j++) {
                    	index.clickUrl("#finishedTask",array[j].task_id,array[j].urlname,array[j].url);
                    }
                	index.clickTaskid("#finishedTask");
                	$("#finishTask .circlenum").hide();
                	if(index.taskDataLength != 0) {
                		$("#finishTask .circlenum").show().text(index.taskDataLength);
                	}
            	}else {
            		alert(data.message);
            	}
		    }
		});
	},
//	agencyChange: function() {
//		$("#powerUnit").change(function() {
//			var agencyCode = $("#powerUnit>option:selected").attr("id");
////			index.unfinishTask();
//			sessionStorage.agencyCode = agencyCode;
//		});
//	},
	clickTaskid: function(id) {
		$(id).on("click","li",function() {
			sessionStorage.taskid = $(this).attr("id");
		});
	},
	//点击公告信息
	clickPageData: function() {
		$("#noticeInfo").on("click","li",function() {
			var articleid = $(this).attr("id");
			var tokenid = fbUtil.tokenid();
			window.open("/df/fb/portal/noticeInfo/noticeInfo.html?tokenid="+tokenid+"&articleId="+articleid,'newwindow',"height=600,width=800,top=20,left=250,scrollbars=yes,toolbar=no,menubar=no,location=no,status=no");
		});
	},
	sessionUrl: function(id,item) {
		$(id).on("click",item,function() {
    		var location = parent.document.getElementsByTagName('iframe')[0].contentWindow.location;
    		var lastURL = location.pathname + location.search;
    		var nowURL = $(this).attr("clickUrl");
    		var obj = {"lastURL":lastURL,"nowURL":nowURL};
    		var str = JSON.stringify(obj);
    		var key = nowURL.split("\/").pop().split(".")[0];
    		sessionStorage[key] = str;
    	});
	}
};

$(function () {
	index.basicOperation();
//	index.getPower();
	index.getPageData('1');
//	index.backlog();
	index.taskInit();
	index.unfinishTask();
	index.finishTask();
//	index.agencyChange();

    $("#container,#container1").show();
    $("#containeraa,#container2").hide();
    
    $(".bottom-cen1-cen").on("click","i",function() {
    	index.showDiv1();
    });
    $(".bottom-cen2-cen").on("click","i",function() {
    	index.showDiv2();
    });
    $(".daliyOp").on("click","li",function() {
    	$(this).siblings().removeClass("active");
    	$(this).addClass("active");
    });
    
});










