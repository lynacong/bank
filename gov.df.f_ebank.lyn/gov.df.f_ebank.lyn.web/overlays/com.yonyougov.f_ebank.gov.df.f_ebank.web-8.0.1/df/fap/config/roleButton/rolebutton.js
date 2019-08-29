require(['jquery', 'knockout', 'bootstrap', 'uui','tree','grid','director','ip'],function ($, ko) {
	window.ko = ko;
	var roleid = null;
	var reloadResOpt = null;
	var menuViewModel = {
			data: ko.observable({}),
			treeSetting:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						$("#checklist").empty();
						if(!node.isParent){
							var guid = node.id;
							roleid =guid;
							var tokenid = ip.getTokenId();
							$.ajax({
								url: "/df/menu/getbyrole.do?tokenid="+tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"guid":guid,"tokenId":tokenid ,"ajax":"noCache"},
								success: function (data) {
									for(var i=0;i<data.mapMenu.length;i++){
										data.mapMenu[i].url = null;
									}
									menuViewModel.treeDataTable1.setSimpleData(data.mapMenu);
									var data_tree = $("#robtnRoleTree2")[0]['u-meta'].tree;
									var nodes  = data_tree.getNodes();
									data_tree.expandNode(nodes[0], true, false, true);
								}
							});
							
						}else{
							menuViewModel.treeDataTable1.setSimpleData("");
						}
					}
				}
			},
			treeSetting1:{
				view:{
				},
				callback:{
					onClick:function(e,id,node){
						$("#checklist").empty();
						if(!node.isParent){
							var guid = node.id;
							reloadResOpt=guid;
							var tokenid = ip.getTokenId();
							$.ajax({
								url: "/df/res/queryRoleRes.do?tokenid="+tokenid,
								type: 'GET',
								dataType: 'json',
								data: {"guid":guid,"role_id":roleid,"ajax":"noCache"},
								success: function (data) {
									var innerHTML = "";
									var flagState=true;
									for(var i = 0; i < data.btnlist.length; i++ ){
										var btnid = data.btnlist[i].btn_id;
										var btnName = data.btnlist[i].btn_name;
										var roleId = data.btnlist[i].role_id;
										if(roleId == null || roleId == ""){
											innerHTML+="	<div class='checkbox'><label> <input type='checkbox' id='"+guid+"' onclick='change(this)' value='"+btnid+"'> "+btnName+" </label></div>"
											flagState=false;
										}else{
											innerHTML+="	<div class='checkbox'><label> <input type='checkbox' checked='checked' id='"+guid+"' onclick='change(this)'  value='"+btnid+"'> "+btnName+" </label></div>"
										}
										
									}
									//begin_全选按钮状态设置
									if(!flagState){
										$("#resSelAll").attr("checked",false);
									}else{
										$("#resSelAll").attr("checked",true);
									}
									//end_全选按钮状态设置
									$("#checklist").append(innerHTML);
								}
							});
							
						}
					}
				}
			},
			treeDataTable: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'roletype': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			treeDataTable1: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'roletype': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
			treeDataTable2: new u.DataTable({
				meta: {
					'guid': {
						'value':""
					},
					'roletype': {
						'value':""
					},
					'name':{
						'value':""
					}
				}
			}),
	}
	menuViewModel.getInitData = function(){
		var tokenid = ip.getTokenId();
		$.ajax({
			url: "/df/role/getAllRole.do?tokenid=" + tokenid,
			type: 'GET',
			dataType: 'json',
			data: {"ajax":"noCache"},
			success: function (data) {
				var treedata = ip.treeJump(data.rolelist);
				menuViewModel.treeDataTable.setSimpleData(treedata);
//				var data_tree = $("#robtnRoleTree1")[0]['u-meta'].tree;
//				var nodes  = data_tree.getNodes();
//				data_tree.expandNode(nodes[0], true, false, true);
			}
		});

	}
	change = function (obj){
		var tokenid = ip.getTokenId();
		var btnid = obj.value;
		var menuid = obj.id;
		var checked = obj.checked;
		$.ajax({
			url: "/df/res/changeResCheck.do?tokenid=" + tokenid,
			type: 'post',
			dataType: 'json',
			data: {"btnid":btnid,"menu_id":menuid,"checked":checked,"role_id":roleid,"ajax":"noCache"},
			success: function (data) {
//				$("#checklist").empty();
//				var tokenid = ip.getTokenId();
//				$.ajax({
//					url: "/df/res/queryRoleRes.do?tokenid="+tokenid,
//					type: 'GET',
//					dataType: 'json',
//					data: {"guid":menuid,"role_id":roleid,"ajax":"noCache"},
//					success: function (data) {
//						var innerHTML = "";
//						for(var i = 0; i < data.btnlist.length; i++ ){
//							var btnid = data.btnlist[i].btn_id;
//							var btnName = data.btnlist[i].btn_name;
//							var roleId = data.btnlist[i].role_id;
//							if(roleId == null ||　roleId　==　""){
//								innerHTML+="	<div class='checkbox'><label> <input type='checkbox' id='"+menuid+"' onclick='change(this)' value='"+btnid+"'> "+btnName+" </label></div>"
//							}else{
//								innerHTML+="	<div class='checkbox'><label> <input type='checkbox' id='"+menuid+"'  checked='checked' onclick='change(this)' value='"+btnid+"'> "+btnName+" </label></div>"
//							}
//
//						}
//						$("#checklist").append(innerHTML);
//					}
//				});

			}
		});
	}
	
	//begin_新怎资源列表全选按钮
		 selAllOpt = function (obj){
			 var mainChecked = obj.checked;
			 /*if(mainChecked=true){
				 obj.checked=false;
			 }else{
				 obj.checked=true;
			 }*/
			 var tokenid = ip.getTokenId();
			 var datalist= new Array(); //定义json数组
			 $("#checklist input").each(function(){
				   var saveFlag= $(this).attr("checked");
					   if(mainChecked==true){
					    	    if(saveFlag!="checked"){
					    	    	 var object = new Object(); 
					    	    	    $(this).attr("checked","checked");
									    object.btnid = $(this).attr("value");
									    object.menu_id = $(this).attr("id");
									    object.checked = $(this).attr("checked");
									    object.role_id = roleid;
									    datalist.push(object);
					    	    }
					    }else{
					    	 if(saveFlag="checked"){
				    	    	 var object = new Object();
				    	    	    $(this).attr("checked",false);
								    object.btnid = $(this).attr("value");
								    object.menu_id = $(this).attr("id");
								    object.checked = $(this).attr("checked");
								    object.role_id = roleid;
								    datalist.push(object);
					    	 }
					    }
				    });
			 $.ajax({
				 type:"post",  
				 url:"/df/res/changeAllResCheck.do?tokenid=" + tokenid,  
				 data:{"selectList":JSON.stringify(datalist),"mainChecked":mainChecked},  
				 dataType: "json",  
				 success:function (data){
					// alert(data.flag);
					 $("#checklist").empty();
					 $.ajax({
							url: "/df/res/queryRoleRes.do?tokenid="+tokenid,
							type: 'GET',
							dataType: 'json',
							data: {"guid":reloadResOpt,"role_id":roleid,"ajax":"noCache"},
							success: function (data) {
								var innerHTML = "";
								var flagState=true;
								for(var i = 0; i < data.btnlist.length; i++ ){
									var btnid = data.btnlist[i].btn_id;
									var btnName = data.btnlist[i].btn_name;
									var roleId = data.btnlist[i].role_id;
									if(roleId == null || roleId == ""){
										innerHTML+="	<div class='checkbox'><label> <input type='checkbox' id='"+reloadResOpt+"' onclick='change(this)' value='"+btnid+"'> "+btnName+" </label></div>"
										flagState=false;
									}else{
										innerHTML+="	<div class='checkbox'><label> <input type='checkbox' checked='checked' id='"+reloadResOpt+"' onclick='change(this)'  value='"+btnid+"'> "+btnName+" </label></div>"
									}
									
								}
								//begin_全选按钮状态设置
								if(!flagState){
									$("#resSelAll").attr("checked",false);
								}else{
									$("#resSelAll").attr("checked",true);
								}
								//end_全选按钮状态设置
								$("#checklist").append(innerHTML);
							}
						}); 
				 }
			 });
		   }
	//end_新怎资源列表全选按钮
	
	
	var val="";
	quickQuery = function (){  
		var user_write = $("#quickquery").val();
		if(val == user_write){
			return;
		}
		val = user_write
		var data_tree = $("#robtnRoleTree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);
		$("#quickquery").focus();
		i=1;
	}
	var i = 0;
	menuTreeNext = function (){
		var user_write = $("#quickquery").val();
		var data_tree = $("#robtnRoleTree1")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(i < search_nodes.length){
			data_tree.selectNode(search_nodes[i++]);
		}else{
			i = 0;
			ip.ipInfoJump("最后一个");
		}
		$("#quickquery").focus();
	}
	
	var val1 = "";
	quickQuery1 = function (){  
		var user_write = $("#quickquery1").val();
		if(val1 == user_write){
			return;
		}
		val1 = user_write
		var data_tree = $("#robtnRoleTree2")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		data_tree.expandNode(search_nodes[0],true,false,true);
		data_tree.selectNode(search_nodes[0]);
		$("#quickquery1").focus();
		j = 1;
	}
	var j = 0;
	menuTreeNext1 = function (){
		var user_write = $("#quickquery1").val();
		var data_tree = $("#robtnRoleTree2")[0]['u-meta'].tree;
		var search_nodes = data_tree.getNodesByParamFuzzy("name",user_write,null);
		if(j < search_nodes.length){
			data_tree.selectNode(search_nodes[j++]);
		}else{
			j = 0;
			ip.ipInfoJump("最后一个");
		}
		$("#quickquery1").focus();
	}
	
	$(function () {
		ko.cleanNode($('body')[0]);
		app = u.createApp({
			el: 'body',
			model: menuViewModel
		});
		menuViewModel.getInitData();
	});
});
