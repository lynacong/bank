$(function(){
	// 常用操作-div层显示
	$(".hid").mouseover(function(){
		$(this).css({"background":"#D9EDF7"});
		$(this).find("div").css({"display":"block"});
	});
	$(".hid").mouseleave(function(){
		$(this).css({"background":"#ffffff"});
		$(this).find("div").css({"display":"none"});
	});
	$(".hidContent").mouseleave(function(){
		$(".hid").css({"background":"#ffffff"});
		$(this).find("div").css({"display":"none"});
	});
	// 常用操作-字体颜色
	$(".hidContent ul li").mouseover(function(){
		$(this).find("a").css("color", "#FFFFFF");
	});
	$(".hidContent ul li").mouseleave(function(){
		$(this).find("a").css("color", "#333");
	});
	
	//高级查询
	$("#demand").click(function(){
		$(".demandContent").css({"display":"block"});
	})
	$("#close").click(function(){
		$(".demandContent").css({"display":"none"});
	})
	
	//高级查询-更多
	$("._portal_table_gaoji_zbwh").click(function(){
		$(".content_wrap").css({"display":"block"});
	});
	$("._portal_table_gaoji_xbfl").click(function(){
		$(".content_wrap").css({"display":"block"});
	});
	$("._portal_table_gaoji_ysxm").click(function(){
		$(".content_wrap").css({"display":"block"});
	});
	$("._portal_table_gaoji_ysdw").click(function(){
		$(".content_wrap").css({"display":"block"});
	});
	$("._portal_table_gaoji_zffs").click(function(){
		$(".content_wrap").css({"display":"block"});
	});
	$("#over").click(function(){
		$(".content_wrap").css({"display":"none"});
	})
	
})

