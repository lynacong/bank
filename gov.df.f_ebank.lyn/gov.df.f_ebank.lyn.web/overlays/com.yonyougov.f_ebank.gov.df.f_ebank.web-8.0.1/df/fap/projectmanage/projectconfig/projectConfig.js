require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var tokenid =ip.getTokenId();
	var projectViewModel = {
			data : ko.observable({})
	};
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: projectViewModel
		});
		initData();
	});
	
	//编码方式
	$("input[name='bis_codemode']").eq(0).bind("click",function(){
		$("#bis_coderule").attr("disabled", "disabled");
	});
	$("input[name='bis_codemode']").eq(1).bind("click",function(){
		$("#bis_coderule").attr("disabled", false);
	});
	//辅助项目编码
	$("input[name='bis_supcode']").eq(0).bind("click",function(){
		$("#bis_supcoderule").attr("disabled", "disabled");
	});
	$("input[name='bis_supcode']").eq(1).bind("click",function(){
		$("#bis_supcoderule").attr("disabled", false);
	});
	
	//初始化页面
	function initData(){
		 $.ajax({
		 	url : "/df/bis/initConfigure.do?tokenid="+ tokenid,
		 	type : 'POST',
		 	dataType : "json",
		 	data: {ajax:"1"},
		 	success : function(data) {
		 		if(data.flag=="1"){
		 			var data=data.params;
		 			var a,a1,a2;
		 			for(var i=0;i<data.length;i++){
		 				$("input[name="+data[i].chr_code+"]").eq(data[i].chr_value).prop("checked",true);
		 				if(data[i].chr_code=="bis_codemode"&&data[i].chr_value=="0"){
		 					$("#bis_coderule").attr("disabled", "disabled");
		 				}else if(data[i].chr_code=="bis_codemode"&&data[i].chr_value=="1"){
		 					$("#bis_coderule").attr("disabled",false);
		 				}
		 				if(data[i].chr_code=="bis_supcode"&&data[i].chr_value=="0"){
		 					$("#bis_supcoderule").attr("disabled", "disabled");
		 				}else if(data[i].chr_code=="bis_supcode"&&data[i].chr_value=="1"){
		 					$("#bis_supcoderule").attr("disabled",false);
		 				}
		 				if(data[i].chr_code=="bis_coderule"){
		 					a=data[i].chr_desc;
		 					var b=a.split("+");
		 					for(var j=0;j<b.length; j++){
		 						if(b[j].split("#")[0]==data[i].chr_value){
		 							$("#bis_coderule").append("<option selected='selected' value='"+b[j].split("#")[0]+"'>"+b[j].split("#")[1]+"</option>");
		 						}else{
		 							$("#bis_coderule").append("<option value='"+b[j].split("#")[0]+"'>"+b[j].split("#")[1]+"</option>");
		 						}
		 						
		 					}
		 				}
		 				if(data[i].chr_code=="bis_supcoderule"){
		 					a1=data[i].chr_desc;
		 					var b1=a1.split("+");
		 					for(var j=0;j<b1.length; j++){
		 						if(b1[j].split("#")[0]==data[i].chr_value){
		 							$("#bis_supcoderule").append("<option selected='selected' value='"+b1[j].split("#")[0]+"'>"+b1[j].split("#")[1]+"</option>");
		 						}else{
		 							$("#bis_supcoderule").append("<option value='"+b1[j].split("#")[0]+"'>"+b1[j].split("#")[1]+"</option>");
		 						}
		 						
		 					}
		 				}
		 				if(data[i].chr_code=="bis_subcoderule"){
		 					a2=data[i].chr_desc;
		 					var b2=a2.split("+");
		 					for(var j=0;j<b2.length; j++){
		 						if(b2[j].split("#")[0]==data[i].chr_value){
		 							$("#bis_subcoderule").append("<option selected='selected' value='"+b2[j].split("#")[0]+"'>"+b2[j].split("#")[1]+"</option>");
		 						}else{
		 							$("#bis_subcoderule").append("<option value='"+b2[j].split("#")[0]+"'>"+b2[j].split("#")[1]+"</option>");
		 						}
		 						
		 					}
		 				}
		 			}
		 		}else if(data.flag=="0"){
		 			ip.ipInfoJump("系统繁忙，请稍后！","info");
		 		}
				
		 	}
		 });
	};
	//保存数据
	 saveData = function(){
		var bis_mb_val=$("input[name='bis_mb']:checked").val();
		var bis_en_val=$("input[name='bis_en']:checked").val();
		var bis_bi_val=$("input[name='bis_bi']:checked").val();
		var bis_codemode_val=$("input[name='bis_codemode']:checked").val();
		var bis_coderule_val=$("#bis_coderule option:selected").val();
		var bis_supcode_val=$("input[name='bis_supcode']:checked").val();
		var bis_supcoderule_val=$("#bis_supcoderule option:selected").val();
		var subproject_select_val=$("#bis_subcoderule option:selected").val();
		var bis_add_val=$("input[name='bis_add']:checked").val();
		var bis_autoCode_val=$("input[name='bis_autoCode']:checked").val();
		$.ajax({
			url : "/df/bis/saveConfigure.do?tokenid="+ tokenid,
			type : 'POST',
			dataType : "json",
			data: {
				"ajax":"1",
				"bis_mb":bis_mb_val,
				"bis_en":bis_en_val,
				"bis_bi":bis_bi_val,
				"bis_codemode":bis_codemode_val,
				"bis_coderule":bis_coderule_val,
				"bis_supcode":bis_supcode_val,
				"bis_supcoderule":bis_supcoderule_val,
				"bis_subcoderule":subproject_select_val,
				"bis_add":bis_add_val,
				"bis_autoCode":bis_autoCode_val
				
			},
			success : function(data) {
				if(data.flag=="1"){
					ip.ipInfoJump("保存成功！","success");
				}else if(data.flag=="0"){
					ip.ipInfoJump("保存失败，请稍后再试！","error");
				}
			}
		});
	};
});
