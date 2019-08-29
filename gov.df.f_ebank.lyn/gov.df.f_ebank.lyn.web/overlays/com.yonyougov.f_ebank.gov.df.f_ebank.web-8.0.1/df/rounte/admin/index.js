$(function(){
	
	$('.menu-icon-box').click(function() {
	    if($(this).hasClass('rotate')){
	      _unfold();//展开
	    }else{
	      _shrink();
	    }
//	    setMenuBtnWidth();
	    var pageTableNum = $("table").length;
	    if( pageTableNum > 1){
	    	tableResize();
	    }
	    if(typeof voucherPie == "undefined"){
	    	return;
	    }else{
	    	voucherPie.reflow();
	    }
	 });
	$(".home-icon-box").click(function(){
		window.location.reload();
	});
	//调整datatable表格尺寸
	function tableResize(){
		var table = $.fn.dataTable.fnTables(true);
	    if ( table.length > 0 ) {
	    	$(table).dataTable().fnAdjustColumnSizing(false);
	    }
	}
	//固定按钮菜单宽度与页面内标题宽度相等
	function setMenuBtnWidth(){
	    var menuBtnWidth = $(".mainLabel").innerWidth();
		$(".button-fixed").css("width",menuBtnWidth);
	}
	// left nav shrink 收缩
	function _shrink(){
//	    $('.nav-li').addClass('live-hover');
	    $('.menu-icon-box').addClass('rotate');
	    $('.page-sidebar').css('display','none');
//	    $('.page-sidebar').css('margin-left',"-220px");//6：拖动条宽度
	    $('.page-container').css('margin-left','0');
//	    var menuWidth = $(".page-sidebar").width();
	   
//	    $('.global-notice').css('left','90px');
	}
	// left nav unfold 展开
	function _unfold(){
//	    $('.nav-li').removeClass('live-hover');
	    $('.menu-icon-box').removeClass('rotate');
	    $('.page-sidebar').css('display','block');
//	    var menuWidth = $(".page-sidebar").width();
	    $('.page-container').css('margin-left',"220px");
//	    $('.page-sidebar').css('margin-left','0px');
//	    $('.global-notice').css('left','235px');
	}
	function bindResize(el)  
	{  
		//初始化参数  
		var els = $('.page-sidebar'); 
		//鼠标的 X 和 Y 轴坐标  
		x = 0; 
		var $rightbar = $("#rightbar");
		var $content = $("#content");
		$(el).mousedown(function (e){  
			//按下元素后，计算当前鼠标与对象计算后的坐标  
			x = e.clientX - el.offsetWidth - $(".page-sidebar").width();  
			//在支持 setCapture 做些东东  
			el.setCapture ? (  
			//捕捉焦点  
			el.setCapture(),  
			//设置事件  
			el.onmousemove = function (ev){  
					mouseMove(ev || event);  
				},  
			el.onmouseup = mouseUp  
			) : (  
			//绑定事件
			$(document).bind("mousemove", mouseMove).bind("mouseup", mouseUp)  
			);  
			//防止默认事件发生  
			e.preventDefault();  
		});  
		//移动事件  
		function mouseMove(e){  
			//宇宙超级无敌运算中...  
			var menuWidth = e.clientX - x + 'px';
			if(parseInt(menuWidth) >= 220){
				$content.css("marginLeft",menuWidth);
				els.css("width",menuWidth);
				$rightbar.css("marginLeft",menuWidth);
				
			}
			setMenuBtnWidth();
		}  
		//停止事件  
		function mouseUp(){  
			//在支持 releaseCapture 做些东东  
			el.releaseCapture ? (  
			//释放焦点  
			el.releaseCapture(),  
			//移除事件  
			el.onmousemove = el.onmouseup = null  
			) : (  
			//卸载事件  
			$(document).unbind("mousemove", mouseMove).unbind("mouseup", mouseUp)  
			);  
		}  
	}  
	var divResize=function(){  
		var menuHeight = $(".page-sidebar").height();
		$("#rightbar").height(menuHeight);
	}; 
	
	// divResize();
	// $(window).resize(divResize);
	// bindResize(document.getElementById('rightbar'));
	var isIE = navigator.userAgent.indexOf('MSIE') != -1;
	if(isIE){
		$(".page-sidebar,#content").css("height",$(".layout").innerHeight()-40+"px");
	}
});
	



    
