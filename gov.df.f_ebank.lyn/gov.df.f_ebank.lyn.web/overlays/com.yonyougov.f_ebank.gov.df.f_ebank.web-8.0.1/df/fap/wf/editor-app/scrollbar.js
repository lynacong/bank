


/* Copyright (c) 2012 HyeonJe Jun (http://github.com/noraesae)
 * Licensed under the MIT License
 */
((function($) {
	var  hiddenx = false;
	var hiddeny = false;
	var allId = [],
		lastRegist = {},
		staticValue = {
			bottom : 2,
			right:2
		};
    $.fn.perfectScrollbar = function(option,eleId) {
		var self = this,
		scrollbar_x_width,
		scrollbar_x_left,
		scrollbar_y_height,
		scrollbar_y_left;
        if(!lastRegist[eleId]){
			lastRegist[eleId] = {};
			lastRegist[eleId].oldLeft = 0;
			lastRegist[eleId].oldScrollLeft = 0;
			lastRegist[eleId].oldTop = 0;
			lastRegist[eleId].oldScrollTop = 0;			
        }
        function getData(){
    		container_width = $this.width();
            container_height = $this.height();
            content_width = $content[0].style.width.replace("px",'')?$content[0].style.width.replace("px",''):$content[0].offsetWidth;//$content.outerWidth(false);//
            content_height = $content[0].style.height.replace("px",'') ?$content[0].style.height.replace("px",''):$content[0].offsetHeight;//$content.outerHeight(false);//
            if($content.next()[0]){
            	if($content.next()[0].className == "dynsumcontainer_div")
            		content_height = parseInt(content_height) + 24;
            }
            if(container_width < content_width){
            	 content_height = parseInt(content_height)+17;
            }else{
            	content_height = parseInt(content_height);
            }
           
            
        }
		var  updateScroll = function ($this){
			        $content = $this.children().first(),
        			scrollbar_x_width,
        			scrollbar_x_left,
        			scrollbar_y_height,
        			scrollbar_y_left;
        			getScrollBar($this);
        			if($content.length<1)return ;
        			getData();
               	var xbarcontentwidth =0;
            	var ybarcontentheight =0;
	            if(container_width < content_width) {
	                scrollbar_x_width = parseInt(container_width * container_width / content_width);
	                scrollbar_x_left = parseInt($this.scrollLeft() * container_width / content_width);
	                xbarcontentwidth = content_width;
	            }
	            else {
	                scrollbar_x_width = 0;
	                scrollbar_x_left = 0;
	                $this.scrollLeft(0);
	                xbarcontentwidth = 0;
	            }
	            if(container_height < content_height) {
	                scrollbar_y_height = parseInt(container_height * container_height / content_height);
	                scrollbar_y_top = parseInt($this.scrollTop() * container_height / content_height);
	                 ybarcontentheight = content_height;
	            }
	            else {
	                scrollbar_y_height = 0;
	                scrollbar_y_left = 0;
	                $this.scrollTop(0);
	                 ybarcontentheight = 0;
	            }
	            
				$scrollbar_x_contenter.css({left: 0,width:xbarcontentwidth+"px"});
				$scrollbar_y_contenter.css({top: 0 ,height: ybarcontentheight+"px"});
	            $scrollbar_x.css({left: scrollbar_x_left + $this.scrollLeft(), bottom: scrollbar_x_bottom - $this.scrollTop(), width: scrollbar_x_width});
	            $scrollbar_y.css({top: scrollbar_y_top + $this.scrollTop(), right: scrollbar_y_right - $this.scrollLeft(), height: scrollbar_y_height});
		};
		var reset = function ($this,eleId){
 					$content = $this.children().first(),
        			scrollbar_x_width,
        			scrollbar_x_left,
        			scrollbar_y_height,
        			scrollbar_y_left;
        			getScrollBar($this);
        			if($content.length<1)return ;
        			getData();
	            var xbarcontentwidth =0;
            	var ybarcontentheight =0;
	            if(container_width < content_width) {
	                scrollbar_x_width = parseInt(container_width * container_width / content_width);
	                scrollbar_x_left = parseInt($this.scrollLeft() * container_width / content_width);
	                xbarcontentwidth = content_width;
	            }
	            else {
	                scrollbar_x_width = 0;
	                scrollbar_x_left = 0;
	                $this.scrollLeft(0);
	                xbarcontentwidth = 0;
	            }
	            if(container_height < content_height) {
	                scrollbar_y_height = parseInt(container_height * container_height / content_height);
	                scrollbar_y_top = parseInt($this.scrollTop() * container_height / content_height);
	                ybarcontentheight = content_height;
	            }
	            else {
	                scrollbar_y_height = 0;
	                scrollbar_y_left = 0;
	                $this.scrollTop(0);
	                ybarcontentheight;
	            }
				$scrollbar_x_contenter.css({left: 0 + $this.scrollLeft(),width:xbarcontentwidth+"px"});
				$scrollbar_y_contenter.css({top: 0 + $this.scrollTop(),height: ybarcontentheight+"px"});
	            $scrollbar_x.css({left: 0 + $this.scrollLeft(), bottom: scrollbar_x_bottom - $this.scrollTop(), width: scrollbar_x_width});
	            $scrollbar_y.css({top: 0 + $this.scrollTop(), right: scrollbar_y_right - $this.scrollLeft(), height: scrollbar_y_height});
		};
		if(option == 'updateAll'){
        	for(var i = 0,l = allId.length;i<l;i++){
        		var $this = $("#"+allId[i]);
        		updateScroll($this);
        	}
        	return false;
        }
        if(option == 'updateAllandLeft'){
        	var $this = $("#"+eleId);
        	reset($this,eleId);
        	return false;
        }
        if(option == 'updateKeepLeft'){
        	var $this = $("#"+eleId);
        	var temp = lastRegist[eleId];
        	if(!temp)return ;

        	getScrollBar($this);
        	$this.scrollLeft(temp.oldScrollLeft);
        	$scrollbar_x.css({left:temp.oldLeft+"px"});
            $scrollbar_y.css({right: staticValue.left - temp.oldScrollLeft});
            $scrollbar_y_contenter.css({right: staticValue.left - temp.oldScrollLeft});
            
        	$this.scrollTop(temp.oldScrollTop);
        	$scrollbar_y.css({top:temp.oldTop+"px"});
            $scrollbar_x.css({bottom: staticValue.bottom - temp.oldScrollTop});
            $scrollbar_x_contenter.css({bottom: staticValue.bottom - temp.oldScrollTop});
        	return false;
        }
        //初始化内容
        if(option=="init"){
            $("#"+eleId).scrollTop(0);
            $("#"+eleId).scrollLeft(0);
            return;
        }

        
		if(typeof option == "object"){
			hiddeny = option.hiddeny||false;
			hiddenx = option.hiddenx||false;
		}
        if($(this).data('perfect_scrollbar')) {
            // if there's already perfect_scrollbar
            return $(this).data('perfect_scrollbar');
        }
        var $this = $(this).addClass('ps-container'),
            $content = $(this).children();
        $("<div style='width:100%;height:18px;clear:both;'></div>").appendTo($this);
		if(hiddeny){
			var $scrollbar_x = $("<div class='ps-scrollbar-x'></div>").appendTo($this);
			var $scrollbar_y = $("").appendTo($this);
			var $scrollbar_x_contenter = $("<div class='ps-content-x' style='width:0px;position:absolute;'></div>").appendTo($this);
		}else if(hiddenx){
			var $scrollbar_x = $("").appendTo($this);
			var $scrollbar_y = $("<div class='ps-scrollbar-y'></div>").appendTo($this);
			var $scrollbar_y_contenter = $("<div class='ps-content-y' style='height:0px;position:absolute;'></div>").appendTo($this);
		}else{
			var $scrollbar_x = $("<div class='ps-scrollbar-x'></div>").appendTo($this);
			var $scrollbar_y = $("<div class='ps-scrollbar-y'></div>").appendTo($this);
			var $scrollbar_x_contenter = $("<div class='ps-content-x' style='width:0px;position:absolute;'></div>").appendTo($this);
			var $scrollbar_y_contenter = $("<div class='ps-content-y' style='height:0px;position:absolute;'></div>").appendTo($this);
		}
		
        var container_width,
            container_height,
            content_width,
            content_height,
            scrollbar_x_width,
            scrollbar_x_left,
            scrollbar_x_bottom = parseInt($scrollbar_x.css('bottom')),
            scrollbar_y_height,
            scrollbar_y_top,
            scrollbar_y_right = parseInt($scrollbar_y.css('right'));
       //更新横向滚动条
        var updateContentScrollTop = function() {
            var scroll_top = parseInt(scrollbar_y_top * content_height / container_height);
            $this.scrollTop(scroll_top);
            $scrollbar_x.css({bottom: scrollbar_x_bottom - scroll_top});
            $scrollbar_x_contenter.css({bottom: 2 - scroll_top});
            if($this.attr("id"))
            	lastRegist[$this.attr("id")].oldScrollTop = scroll_top;	
			
        };
        //更新纵向滚动条
        var updateContentScrollLeft = function() {
            var scroll_left = parseInt(scrollbar_x_left * content_width / container_width);
            $this.scrollLeft(scroll_left);
            $scrollbar_y.css({right: scrollbar_y_right - scroll_left});
            $scrollbar_y_contenter.css({right: 2 - scroll_left});
        	if($this.attr("id"))
        		lastRegist[$this.attr("id")].oldScrollLeft = scroll_left;
        };
        //获得当前滚动条的相关内容
        function getScrollBar ($parent){
        	$scrollbar_y = $parent.find(".ps-scrollbar-y");
    		$scrollbar_y_contenter = $parent.find(".ps-content-y");
			$scrollbar_x = $parent.find(".ps-scrollbar-x");
			$scrollbar_x_contenter = $parent.find(".ps-content-x");
			$content = $parent.children().first();
        }
        var updateBarSizeAndPosition = function() {
            getScrollBar($this);
            getData();
			var xbarcontentwidth =0;
            var ybarcontentheight =0;
            if(container_width < content_width) {
                scrollbar_x_width = parseInt(container_width * container_width / content_width);
                scrollbar_x_left = parseInt($this.scrollLeft() * container_width / content_width);
                xbarcontentwidth = content_width;
            }
            else {
                scrollbar_x_width = 0;
                scrollbar_x_left = 0;
                xbarcontentwidth = 0;
                $this.scrollLeft(0);
            }
            if(container_height < content_height) {
                scrollbar_y_height = parseInt(container_height * container_height / content_height);
                scrollbar_y_top = parseInt($this.scrollTop() * container_height / content_height);
                ybarcontentheight = content_height;
            }
            else {
                scrollbar_y_height = 0;
                scrollbar_y_left = 0;
                ybarcontentheight =0;
                $this.scrollTop(0);
            }
			$scrollbar_x_contenter.css({left: 0 + $this.scrollLeft(),width:xbarcontentwidth+"px", bottom: scrollbar_x_bottom - $this.scrollTop()});
			$scrollbar_y_contenter.css({top: 0 + $this.scrollTop(),height: ybarcontentheight+"px"});
            $scrollbar_x.css({left: scrollbar_x_left + $this.scrollLeft(), bottom: scrollbar_x_bottom - $this.scrollTop(), width: scrollbar_x_width});
            $scrollbar_y.css({top: scrollbar_y_top + $this.scrollTop(), right: scrollbar_y_right - $this.scrollLeft(), height: scrollbar_y_height});
        };

        var moveBarX = function(current_left, delta_x) {
            var new_left = current_left + delta_x,
                max_left = container_width - scrollbar_x_width;
            if(new_left < 0) {
                scrollbar_x_left = 0;
            }
            else if(new_left > max_left) {
                scrollbar_x_left = max_left;
            }
            else {
                scrollbar_x_left = new_left;
            }
            $scrollbar_x.css({left: scrollbar_x_left + $this.scrollLeft()});
            lastRegist[$this.attr("id")].oldLeft = scrollbar_x_left + $this.scrollLeft();
        };

        var moveBarY = function(current_top, delta_y) {
            var new_top = current_top + delta_y,
                max_top = container_height - scrollbar_y_height;
            if(new_top < 0) {
                scrollbar_y_top = 0;
            }
            else if(new_top > max_top) {
                scrollbar_y_top = max_top;
            }
            else {
                scrollbar_y_top = new_top;
            }
            $scrollbar_y.css({top: scrollbar_y_top + $this.scrollTop()});
            lastRegist[$this.attr("id")].oldTop =  scrollbar_y_top + $this.scrollTop();	
        };
        var bindMouseScrollXHandler = function() {
            var current_left,
                current_page_x;
			
            $scrollbar_x.bind('mousedown', function(e) {
            	$scrollbar_x = $(e.target);
                current_page_x = e.pageX;
                current_left = $scrollbar_x.position().left;
                container_width = $scrollbar_x.parent().width();
                scrollbar_x_width  = $scrollbar_x.width();
    			content_width = $scrollbar_x.parent().children().first().width();
    			$this = $scrollbar_x.parent();
    			getScrollBar($this);
                $scrollbar_x.addClass('in-scrolling');
//				if(window.event){
//					window.event.cancelBubble = true;//停止冒泡
//					window.event.returnValue = false;//阻止事件的默认行为
//				}else{
//					e.stopPropagation();
//					e.preventDefault();
//				}
        		$(document).bind("selectstart", function() {
        			return false;
        		});
            });

            $(document).bind('mousemove', function(e) {
            	var element = e;
                if($scrollbar_x.hasClass('in-scrolling')) {
                    moveBarX(current_left, e.pageX - current_page_x);
                    updateContentScrollLeft();

                }
            });

            $(document).bind('mouseup', function(e) {
                if($scrollbar_x.hasClass('in-scrolling')) {
                    $scrollbar_x.removeClass('in-scrolling');
                }
            });
            $scrollbar_x_contenter.bind("mousedown",function (event){
        		var target  = event.target,
        			scrollLeft = $(target).parent().scrollLeft(),
        			mouse_x_left = event.offsetX-scrollLeft;
        		//初始化此时的滚动条
        		$this  = $(target).parent();
            	$scrollbar_x = $(target).parent().find(".ps-scrollbar-x");	
            	$scrollbar_x_contenter = $(target);
    			content_width = $this.children().first().width();
    			container_width = $this.width();
        		var xwidth = $scrollbar_x.width(),
        			xleft = $scrollbar_x.position().left,
        			left = 0;
        			if(mouse_x_left>=xleft){
        				left = mouse_x_left-xwidth;
        			}else{
        				left = mouse_x_left;
        			}
        			if(left<0){
        				left = 0;
        			}else if(left>container_width){
        				left = container_width-xwidth;
        			}
        			scrollbar_x_left = left;
        		    updateContentScrollLeft();
        		    $scrollbar_x.css({left:left+ $this.scrollLeft()+"px"});
        		    lastRegist[$this.attr("id")].oldLeft = left+ $this.scrollLeft();
					
//        			if(window.event){
//						window.event.cancelBubble = true;//停止冒泡
//						window.event.returnValue = false;//阻止事件的默认行为
//					}else{
//						event.stopPropagation();
//						event.preventDefault();
//					}
            });
            
            $scrollbar_y_contenter.bind("mousedown",function (event){
        		var target  = event.target,
        			scrollTop = $(target).parent().scrollTop(),
        			mouse_y_top = event.offsetY-scrollTop;
        		//初始化此时的滚动条
        		$this  = $(target).parent();
            	$scrollbar_y = $(target).parent().find(".ps-scrollbar-y");
            	$scrollbar_y_contenter = $(target);
            	content_height = parseInt($this.children().first().height())+17;
            	container_height = $this.height();
        		var yheight = $scrollbar_y.height(),
        			ytop = $scrollbar_y.position().top,
        			top = 0;
        		    if(mouse_y_top>=ytop){
        				top = mouse_y_top-yheight;
        			}else{
        				top = mouse_y_top;
        			}
        			if(top<0){
        				top = 0;
        			}else if(top>container_height){
        				top = container_height-yheight;
        			}
        			scrollbar_y_top = top;
        		    updateContentScrollTop();
        		    $scrollbar_y.css({top:top+ $this.scrollTop()+"px"});
	    			lastRegist[eleId].oldTop = top+ $this.scrollTop();

//        			if(window.event){
//						window.event.cancelBubble = true;//停止冒泡
//						window.event.returnValue = false;//阻止事件的默认行为
//					}else{
//						event.stopPropagation();
//						event.preventDefault();
//					}

            });

            if(!window.event){
	            function contains (a,b){
				    try {return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b)&16)}catch(e){};
				};
	            $this.bind('mouseover',function (e){
	            	var e=window.event || e, target= e.currentTarget,related= e.relatedTarget || e.toElement;//注意这里
				    if(!contains(target, related) && target!==related){
				    		getScrollBar($(target));
				    		updateScroll($(target));
				    };
	            });
            }else{
	            $this.bind('mouseenter',function (e){
        			var target = e.target;
        			var $t = $(target).closest(".ps-container");
        			if($t.length==0){
        				$t = $(target);
        			}
        			getScrollBar($t);
		    		updateScroll($t);
	            });
            }




        };

        function isString(str){  
            return (typeof str=='string')&&str.constructor==String;  
        }  
        var bindMouseScrollYHandler = function() {
            var current_top,
                current_page_y;

            $scrollbar_y.bind('mousedown', function(e) {
				$scrollbar_y = $(e.target);
                current_page_y = e.pageY;
                $this = $scrollbar_y.parent();
                getScrollBar($this);
                current_top = $scrollbar_y.position().top;
                $scrollbar_y.addClass('in-scrolling');
                getData();
                scrollbar_y_height = parseInt(container_height * container_height / content_height);
//				if(window.event){
//					window.event.cancelBubble = true;//停止冒泡
//					window.event.returnValue = false;//阻止事件的默认行为
//				}else{
//					e.stopPropagation();
//					e.preventDefault();
//				}
        		$(document).bind("selectstart", function() {
        			return false;
        		});
            });

            $(document).bind('mousemove', function(e) {
				var src = e.target;
                if($scrollbar_y.hasClass('in-scrolling')) {
                	updateContentScrollTop();
                    moveBarY(current_top, e.pageY - current_page_y);
                }
            });
            $(document).bind('mouseup', function(e) {
                if($scrollbar_y.hasClass('in-scrolling')) {
                    $scrollbar_y.removeClass('in-scrolling');
                }
        		$(document).unbind("selectstart");
            });
        };
		// add wheel event
		var types = ['DOMMouseScroll', 'mousewheel'];
		var ele = self[0];
		var mouseWheel = {
			setup: function(handler) {
				
		        if ( ele.addEventListener ) {

		            for ( var i=types.length; i; ) {
		                ele.addEventListener( types[--i], handler, false );
		            }
		        } else {
		            ele.onmousewheel = handler;
		        }
			},
			teardown: function(handler) {
				if ( ele.removeEventListener ) {
					for ( var i=types.length; i; ) {
						ele.removeEventListener( types[--i],handler, false );
					}
				} else {
					ele.onmousewheel = null;
				}
			}
		};

        // bind handlers
        var bindMouseWheelHandler = function() {
            var shouldPreventDefault = function(deltaX, deltaY) {
                var scrollTop = $this.scrollTop();
                if(scrollTop == 0 && deltaY > 0 && deltaX == 0) {
                    return false;
                }
                else if(scrollTop >= content_height - container_height && deltaY < 0 && deltaX == 0) {
                    return false;
                }

                var scrollLeft = $this.scrollLeft();
                if(scrollLeft == 0 && deltaX < 0 && deltaY == 0) {
                    return false;
                }
                else if(scrollLeft >= content_width - container_width && deltaX > 0 && deltaY == 0) {
                    return false;
                }
                return true;
            };

            mouseWheel.setup(function(event) {

				var orgEvent = event || window.event, args = [].slice.call( arguments, 1 ), delta = 0, returnValue = true, deltaX = 0, deltaY = 0;
			    //event = $.event.fix(orgEvent);
			    //orgEvent.type = "mousewheel";
			    // Old school scrollwheel delta
			    if ( orgEvent.wheelDelta ) { delta = orgEvent.wheelDelta/120; }
			    if ( orgEvent.detail     ) { delta = -orgEvent.detail/3; }
			    
			    // New school multidimensional scroll (touchpads) deltas
			    deltaY = delta;
			    
			    // Gecko
			    if ( orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
			        deltaY = 0;
			        deltaX = -1*delta;
			    }
			    
			    // Webkit
			    if ( orgEvent.wheelDeltaY !== undefined ) { deltaY = orgEvent.wheelDeltaY/120; }
			    if ( orgEvent.wheelDeltaX !== undefined ) { deltaX = -1*orgEvent.wheelDeltaX/120; }
				
				
				var scrollTop = $this.scrollTop();
                if(scrollTop == 0 && deltaY > 0 && deltaX == 0) {
                    return false;
                }
                else if(scrollTop >= content_height - container_height && deltaY < 0 && deltaX == 0) {
                    return false;
                }
                
                $this.scrollTop($this.scrollTop() - (deltaY * 30));
                $this.scrollLeft($this.scrollLeft() + (deltaX * 30));
				updateBarSizeAndPosition();
                // update bar position
                

                if(shouldPreventDefault(deltaX, deltaY)) {
					if(window.event){
						window.event.cancelBubble = true;//停止冒泡
						window.event.returnValue = false;//阻止事件的默认行为
					}else{
						orgEvent.stopPropagation();
						orgEvent.preventDefault();
					}
                }
				if(window.event){
					window.event.cancelBubble = true;//停止冒泡
					window.event.returnValue = false;//阻止事件的默认行为
				}else{
					orgEvent.stopPropagation();
					orgEvent.preventDefault();
				}
            });
        };

        // bind mobile touch handler
        var bindMobileTouchHandler = function() {
            var applyTouchMove = function(difference_x, difference_y) {
                $this.scrollTop($this.scrollTop() - difference_y);
                $this.scrollLeft($this.scrollLeft() - difference_x);

                // update bar position
                updateBarSizeAndPosition();
            };

            var start_coords = {},
                start_time = 0,
                speed = {},
                breaking_process = null;

            $this.bind("touchstart", function(e) {
                var touch = e.originalEvent.targetTouches[0];

                start_coords.pageX = touch.pageX;
                start_coords.pageY = touch.pageY;

                start_time = (new Date()).getTime();

                if (breaking_process !== null) {
                    clearInterval(breaking_process);
                }
            });
            $this.bind("touchmove", function(e) {
                var touch = e.originalEvent.targetTouches[0];

                var current_coords = {};
                current_coords.pageX = touch.pageX;
                current_coords.pageY = touch.pageY;

                var difference_x = current_coords.pageX - start_coords.pageX,
                    difference_y = current_coords.pageY - start_coords.pageY;

                applyTouchMove(difference_x, difference_y);
                start_coords = current_coords;

                var current_time = (new Date()).getTime();
                speed.x = difference_x / (current_time - start_time);
                speed.y = difference_y / (current_time - start_time);
                start_time = current_time;

                e.preventDefault();
            });
            $this.bind("touchend", function(e) {
                breaking_process = setInterval(function() {
                    if(Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                        clearInterval(breaking_process);
                        return;
                    }

                    applyTouchMove(speed.x * 30, speed.y * 30);

                    speed.x *= 0.8;
                    speed.y *= 0.8;
                }, 10);
            });
        };
            if(option === 'update') {
        	 updateBarSizeAndPosition();
            if($(this).data('perfect_scrollbar_update')) {
             
            }
            return $(this);
        }
        else if(option === 'destroy') {
        	destroy();

            return $(this);
        }
        if($(this).attr('id')){
        	allId.push($(this).attr('id'));
        }

        var destroy = function() {
            $scrollbar_x.remove();
            $scrollbar_y.remove();
            $this.unbind('mousewheel');
            $this.unbind('touchstart');
            $this.unbind('touchmove');
            $this.unbind('touchend');
            $(topWin.document).unbind("mouseup");
            $(parentWindow.document).unbind("mouseup");
            $(window).unbind('mousemove');
            $(window).unbind('mouseup');
            $this.data('perfect_scrollbar', null);
            $this.data('perfect_scrollbar_update', null);
            $this.data('perfect_scrollbar_destroy', null);
        };

        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

        var initialize = function() {
            updateBarSizeAndPosition();
            bindMouseScrollXHandler();
            bindMouseScrollYHandler();
            if(isMobile) 
            	bindMobileTouchHandler();
            else 
            	bindMouseWheelHandler();
            $this.data('perfect_scrollbar', $this);
            $this.data('perfect_scrollbar_update', updateBarSizeAndPosition);
            $this.data('perfect_scrollbar_destroy', destroy);
        };

        // initialize
        initialize();
		$.scrollBarDestroy = destroy;
        return $this;
    };
})($));
