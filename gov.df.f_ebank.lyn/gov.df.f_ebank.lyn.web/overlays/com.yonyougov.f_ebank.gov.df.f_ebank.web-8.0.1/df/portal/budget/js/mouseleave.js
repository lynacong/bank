$(function(){
	
	$("#menu-btn").click(function(){
		var displayCss = $("#menu-content").css("display");
		if(displayCss=='none'){
			$("#menu-content").slideDown(500);
		}else{
			$("#menu-content").slideUp(300);
		}
	})
	
	$("#menu-content").mouseleave(function(){
		
		$("#menu-content").slideUp(300);
	})
	
	
	
	
	
})
