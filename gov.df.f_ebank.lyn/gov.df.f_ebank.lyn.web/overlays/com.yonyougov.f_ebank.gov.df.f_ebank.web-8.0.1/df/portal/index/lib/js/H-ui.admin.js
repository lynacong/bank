var num=0,oUl=$("#min_title_list"),hide_nav=$("#Hui-tabNav");
var count=0;
/*获取顶部选项卡总长度*/
function tabNavallwidth(){
	var taballwidth=0,
		$tabNav = hide_nav.find(".acrossTab"),
		$tabNavWp = hide_nav.find(".Hui-tabNav-wp"),
		$tabNavitem = hide_nav.find(".acrossTab li"),
		$tabNavmore =hide_nav.find(".Hui-tabNav-more");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
        taballwidth += Number(parseFloat($(this).width()+60))
    });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNavmore.hide();
		$tabNav.css({left:0})
	}
}

/*获取皮肤cookie*/
function getskincookie(){
	var v = $.cookie("Huiskin");
	var hrefStr=$("#skin").attr("href");
	if(v==null||v==""){
		v="default";
	}
	if(hrefStr!=undefined){
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$("#skin").attr("href",hrefRes);
	}
}
/*菜单导航*/
function Hui_admin_tab(obj){
	var bStop = false,
		bStopIndex = 0,
		firstLevel = $(obj).attr('data-firstLevel'),
		href = $(obj).attr('data-href'),
		title = $(obj).attr("data-title"),
		topWindow = $(window.parent.document),
		show_navLi = topWindow.find("#min_title_list li"),
		iframe_box = topWindow.find("#iframe_box");
	
	show_navLi.each(function() {
		if($(this).find('span').attr("data-href")==href){
			bStop=true;
			bStopIndex=show_navLi.index($(this));
			return false;
		}
	});
	if(!bStop){
		creatIframe(href,title);
		var ooli=$(window.parent.document).find(".acrossTab li").length;
		//console.log(ooli);
		count=ooli-1;
		min_titleList();
	}
	else{
		show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
		count=(bStopIndex);
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src",href);
	}	
}

//function upTop(count){
	//console.log(m);
	$("#up").click (function(count) {
		var timer = setInterval(function() {
			window.frames[count].scrollBy(0, -50);
			if (window.frames[count].document.body.scrollTop == 0) {
				clearInterval(timer);
			};
		}, 2);
	})
//	window.frames[m].onscroll=function(){
//	 	var y=window.frames[m].document.body.scrollTop;
//	 	if(y>=200){
//			$("#up").css({"display":"block"});
//		}else{
//			$("#up").css({"display":"none"});
//		}
//	}	
//}
//upTop(0);

/*最新tab标题栏列表*/
function min_titleList(){
	var topWindow = $(window.parent.document),
		show_nav = topWindow.find("#min_title_list"),
		aLi = show_nav.find("li");  
		//aSpan=aLi.find("i").text("×");
}
/*创建iframe*/
function creatIframe(href,titleName){
	var topWindow=$(window.parent.document),
		show_nav=topWindow.find('#min_title_list'),
		iframe_box=topWindow.find('#iframe_box'),
		iframeBox=iframe_box.find('.show_iframe'),
		$tabNav = topWindow.find(".acrossTab"),
		$tabNavWp = topWindow.find(".Hui-tabNav-wp"),
		$tabNavmore =topWindow.find(".Hui-tabNav-more");
	var taballwidth=0;
		
	show_nav.find('li').removeClass("active");	
	show_nav.append('<li class="active"><span data-href="'+href+'">'+titleName+'</span><i class="icon-close"></i><em></em></li>');
	var $tabNavitem = topWindow.find(".acrossTab li");
	
	
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
        taballwidth+=Number(parseFloat($(this).width()+60))
    });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNavmore.hide();	
		$tabNav.css({left:0})
	}	
	iframeBox.hide();
	iframe_box.append('<div class="show_iframe"><div class="loading"></div><iframe frameborder="0" scrolling="yes"  name ="'+titleName+'" src='+href+'></iframe></div>');
//	var showBox=iframe_box.find('.show_iframe:visible');
//	showBox.find('iframe').load(function(){
//		showBox.find('.loading').hide();
//	});
}


/*关闭iframe*/
function removeIframe(){
	var topWindow = $(window.parent.document),
		iframe = topWindow.find('#iframe_box .show_iframe'),
		tab = topWindow.find(".acrossTab li"),
		showTab = topWindow.find(".acrossTab li.active"),
		showBox=topWindow.find('.show_iframe:visible'),
		i = showTab.index();
	tab.eq(i-1).addClass("active");
	tab.eq(i).remove();
	iframe.eq(i-1).show();
	count=(i-1);
	iframe.eq(i).remove();
}
$(function(){
	$(document).on("click","#min_title_list li",function(){
		var bStopIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		$("#min_title_list li").removeClass("active").eq(bStopIndex).addClass("active");
		count=(bStopIndex);
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
		if(bStopIndex!=-1){
			//controlHeight(bStopIndex);
		}
		if($(this).attr('hide')=='true'){
			$('#js-tabNav-next').trigger('click');
		}
	});
	$(document).on("click","#min_title_list li i",function(){
		var aCloseIndex=$(this).parents("li").index();
		$(this).parent().remove();
		$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();	
		num==0?num=0:num--;
		tabNavallwidth();
		//controlHeight(aCloseIndex-1);
	});
	$(document).on("dblclick","#min_title_list li",function(){
		var aCloseIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		if(aCloseIndex>0){
			$(this).remove();
			$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();	
			num==0?num=0:num--;
			$("#min_title_list li").removeClass("active").eq(aCloseIndex-1).addClass("active");
			iframe_box.find(".show_iframe").hide().eq(aCloseIndex-1).show();
			tabNavallwidth();
			
			//controlHeight(aCloseIndex-1);
		}else{
			return false;
		}
	});
	tabNavallwidth();
	
	$('#js-tabNav-next').click(function(){
		num==oUl.find('li').length-1?num=oUl.find('li').length-1:num++;
		if(!toNavPos(1)) num--;
	});
	$('#js-tabNav-prev').click(function(){
		num==0?num=0:num--;
		if(!toNavPos(-1)) num++;
	});
	
	function toNavPos(dir){
		var leftWidth = 0;
		for(var iTab = 0;iTab < num-dir;iTab++){
			var tabWidth = $('#min_title_list li:eq('+iTab+')').outerWidth(true);
			leftWidth -= tabWidth;
		}
		var tabListWidth = 0;
		var navWidth = $('.Hui-tabNav-wp').width()-280;
		var tabs = $('#min_title_list li');
		for(var iTab = num;iTab <= tabs.length;iTab++){
			var $tab = $(tabs[iTab]);
			var tabWidth = $tab.outerWidth(true);
			tabListWidth += tabWidth;
			if(tabListWidth < navWidth){
				$tab.attr('hide','false');
			}else{
				$tab.attr('hide','true');
			}			
		}			
		if(dir==1){//next

			if(tabListWidth > navWidth-350){
				var tabWidth = $('#min_title_list li:eq('+(num-1)+')').outerWidth(true);
				leftWidth = leftWidth - tabWidth;
				oUl.stop().animate({'left':leftWidth},100);	
				return true;
			}
			return false;			
		}else{
		
			if(tabListWidth > navWidth-350){
				var tabWidth = $('#min_title_list li:eq('+(num)+')').outerWidth(true);
				leftWidth = leftWidth + tabWidth;
				oUl.stop().animate({'left':leftWidth},100);	
				return true;
			}
			return false;			
		}
		
	}
	
	/*function controlHeight(bStopIndex){
		var tab = $("#min_title_list li").eq(bStopIndex);
		var tabH = tab.height();
		var iframeHeight = $("iframe");
		var heightH=$(iframeHeight[bStopIndex]).contents().find("html").height();
		$('.content-wrapper').height(heightH+100+'px');
	}*/
	
}); 
