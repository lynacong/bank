(function($) {
	var Z_TMAIL_SIDE_DATA = new Array(); // 用来存放列表数据，暂时没有用到
	
	$.fn.Z_TMAIL_SIDER = function(options) {
		var opts = $.extend( {}, $.fn.Z_TMAIL_SIDER.defaults, options);
		var base = this;
		var target = opts.target;
		var Z_MenuList = $(base).find('.Z_MenuList');
		var Z_SubList = $(base).find('.Z_SubList');
		
		initPosition();

		// 定位
		function initPosition() {
			if($(base).css('position') == 'absolute') {
				$(base).css({
					top: $(target).offset().top + 40, 
					left: $(target).offset().left 
				}).show();

				$(Z_SubList).css({
					top: $(target).offset().top - 60,
					left: $(target).offsetLeft- $(base).offset().left
//					left: $(target).offsetLeft- $(base).offset().left
				});
			}
//			if($(base).css('position') == 'fixed') {
//				$(base).css({
//					top: opts.fTop, 
//					left: $(target).offset().left - $(base).width()
//				}).show();
//
//				$(Z_SubList).css({
//					top: opts.cTop - 60,
//					left: $(target).offset().left - $(base).offset().left
//				});
//			}
		};
		var isIE = navigator.userAgent.indexOf('MSIE') != -1;
	    var isIE6 = isIE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == '6');

	 	// 重新定位
		$(window).resize(function() {
			initPosition();
		});
	
		$(Z_MenuList).find('li').live('mouseover', function(e, index) {
			var thisLi = this;
			var timeOut = setTimeout(function() {
				showSubList(thisLi);
			},10);
			$(Z_SubList).hover(function() {
				clearTimeout(timeOut);
			},function() {
				hideSubList(thisLi);
			});
			e.stopPropagation();
		}).live('mouseout', function(e) {
			var thisLi = this;
			var timeOut = setTimeout(function(){
				hideSubList(thisLi);
			}, 10);
			$(Z_SubList).hover(function() {
				clearTimeout(timeOut);
			},function() {
				hideSubList(thisLi);
			});
			e.stopPropagation();
		});

		function showSubList(thisLi) {
			if(!isIE6) {
				$(thisLi).addClass('curr');
			}
			var thisIndex = $(Z_MenuList).find('li').index($(thisLi));
			var subExList = $(Z_SubList).find('div');
			if(thisIndex > subExList.length - 1) return;
			
			var winHeight = $(window).height();
			var subTop = $(thisLi).offset().top - $(window).scrollTop();
			var subBottom = winHeight - subTop - $(Z_SubList).height();
			
			var absTop = $(thisLi).offset().top - $(window).scrollTop() - opts.fTop-10;
			var absLeft = $(target).offset().left - $(base).offset().left;
			if(subBottom < 40) {
				absTop = absTop + subBottom - 20;
			}
			
			$(subExList).each(function(index) {
				if(index == thisIndex) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
			
			$(Z_SubList).show().stop().animate({
				top: absTop,
				left: 217
			}, 100);
			//解决IE输入框光标，下拉框面板穿透二级菜单浮动菜单面板问题
			$("input,select").blur();
		};

		function hideSubList(thisLi) {
			if(!isIE6) {
				$(thisLi).removeClass('curr');
			}
			$(Z_SubList).hide();
		};
		
	};
	
	// 默认配置项
	$.fn.Z_TMAIL_SIDER.defaults = {
		target: $('#Z_RightSide'),
		fTop: 75, // 距离顶部距离
		cTop: 100, // 滚动条滚动多少像素后开始折叠的高度
		unitHeight: 80, // 每滚动多少距离折叠一个
		autoExpan: true
	};
})(jQuery);