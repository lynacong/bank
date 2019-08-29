require(['jquery', 'knockout','bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	//动态生成树的方法----开始
	var tokenid = ip.getTokenId();
	function treeChoice(id,data,index) {
		var success_info = $("#data-tree"+index)[0];
		var tree_html = '';
		if(!success_info){
			tree_html = "<div class='ztree check_tree' u-meta='"+'{"id":"data-tree'+index+'","type":"tree","data":"treeDataTable","idField":"chr_id","pidField":"parent_id","nameField":"chr_name","setting":"treeSettingCheck"}'+"'>";
			$("#" + id).append(tree_html);
		}
		initTree(id,data);
	}
	function initTree(id,data) {
		var viewModel = {
	    treeSettingCheck:{
	        view:{
	            showLine:false,
	            selectedMulti:false
	        },
	        callback:{
				onDblClick:function(e,id,node){
					setSelectedNode();
				}
	        },
	        check:{
	        	enable: true,
	        	chkboxType:{ "Y" : "ps", "N" : "ps" }
	        }
	    },
	    treeDataTable: new u.DataTable({
	        meta: {
	            'chr_id': {
	                'value':""
	            },
	            'parent_id': {
	                'value':""
	            },
	            'chr_name':{
	                'value':""
	            }
	        }
	    })
		};
		ko.cleanNode($('#' + id)[0]);
		var app = u.createApp({
		    el: '#'+id,
		    model: viewModel
		});
		viewModel.treeDataTable.setSimpleData(data);
		
	}
	//生成树树结束
	var viewModel = {
		eleDataTable: new u.DataTable({
            meta: {
                'chr_id': {
                    'value':""
                },
                'parentid': {
                    'value':""
                },
                'elename':{
                    'value':""
                }
            }
        })
	}
	viewModel.gethref = function(){
		alert(parent.window.viewModel.rightTreeId());
	}
	//获取所有要素
	viewModel.getEleTree = function(){
		$.ajax({
			url: "/df/globalConfig/getElementTree.do?tokenid="+tokenid,
		    type: "GET",
		    data: {
		    	"tokenid":tokenid,
		    	"ajax": "noCache"
		    },
		    success: function(data){
		    	if(data.flag == 1){
		    		viewModel.eleDataTable.setSimpleData(data.eledata);
		    		var treeObj = $.fn.zTree.getZTreeObj("eleTree");
		    		//var treeObj = $.fn.zTree.getzTreeObj("eleTree");
		    		treeObj.expandAll(true);
		    	}else{
		    		ip.ipInfoJump("服务器繁忙，请稍等");
		    	}
		    }
		});
    	
    }
	//刷新按钮，将选中的节点取消选中
	refreshTabPanl = function (treeId) {
		var zTree = $.fn.zTree.getZTreeObj(treeId);
		zTree.checkAllNodes(false);
	}
	
	//获取过滤条件  根据id
	viewModel.getFilterCondition = function(modelid){
		//根据modelid获取数据
		$.ajax({
			url: "/df/globalConfig/getfilterinit.do?tokenid="+tokenid,
			type: "GET",
			data: {
				"ajax": "1",
				"moduleId": modelid,
				"tokenid": tokenid
			},
			success: function(data){
				if(data != null && data.initinfo != null){
					$("#sqlInputVal").val(data.specialSql1);
					var ulNavtabTree = $("#ulNavtabTree"); //标签
					var tabContentTree = $("#tabContentTree");//面板
					var resultData = [];
					for(var i=0; i<data.initinfo.length; i++){
						var eleName = {};
						var eleNameArr = [];
						var filterItem = {}; 
						eleName["ele_name"] = data[data.initinfo[i]];
						eleName["ele_value"] = data.initinfo[i];
						eleName["specialSql"] = data[data.initinfo[i]+"_info"].specialSql;
						eleName["eleNum"] = data[data.initinfo[i]+"_info"].eleNum;
						eleName["operFlag"] = data[data.initinfo[i]+"_info"].operFlag;
						eleNameArr.push(eleName)
						filterItem["source"] = eleNameArr;
						filterItem["treeAll"] = data[data.initinfo[i]+"_all"];
						filterItem["treeCheck"] = data[data.initinfo[i]+"_info"].checkEle;;
						resultData.push(filterItem);
					}
					
					var liItem = "";  //页签项
					var TabPanlItem = "";//面板项
					for(var i = 0; i < resultData.length; i++){
						var target = "li"+resultData[i].source[0].ele_value;
						if(i == 0){
							liItem += "<li role='presentation' class='active' id='"+target+"'><a href='#tab"+target+"' aria-controls='profile' role='tab' data-toggle='tab'>"+resultData[i].source[0].ele_name+"</a></li>";
							TabPanlItem += "<div role='tabpanel' class='tab-pane active' id='tab"+target+"' name='"+target+"'>";
						}else{
							liItem += "<li role='presentation' class='' id='"+target+"'><a href='#tab"+target+"' aria-controls='profile' role='tab' data-toggle='tab'>"+resultData[i].source[0].ele_name+"</a></li>";
							TabPanlItem += "<div role='tabpanel' class='tab-pane' id='tab"+target+"' name='"+target+"'>";
						}
						TabPanlItem += "<div class='eleTitle'>"+
								"<label class='col-md-3 col-sm-3 eleTitle-label'>关系运算符</label>"+
								"<div class='col-md-9 col-sm-9 eleTitle-select'>"+
									"<select class='form-control'>"+
										"<option value='0'></option>"+
										"<option value='1'>in(=)</option>"+
										"<option value='2'>not in(<>)</option>"+
										"<option value='3'>like</option>"+
										"<option value='4'>not like</option>"+
										"<option value='5'>or</option>"+
									"</select>"+
								"</div>"+
							"</div>"+
							"<div class='eleContent'>" +
								"<div id='treePanel"+target+"' class='ele-tree-panel'></div>"+
								"<div class='elefooter'>"+
									"<p><label>过滤条件：</label><input style='width: 45%; display: inline-block;' class='form-control' id='filterInput"+target+"' value='"+resultData[i].source[0].specialSql+"'><button class='btn btn-primary' id='refresh"+target+"' name='data-tree"+target+"' onClick='refreshTabPanl(this.name)' style='margin-left: 10px'>刷新</button></p>"+
									"<p><label>过滤条件填写实例：</label><label>and level_num=1</label><label style='margin-left: 20px'>序号：</label><input style='width: 60px;' id='eleNum"+target+"' value='"+resultData[i].source[0].eleNum+"'></p>"+
									"<p></p>"+
								"</div>"+
							"</div>"+
						"</div>";
					}
					ulNavtabTree.append(liItem);
					tabContentTree.append(TabPanlItem);
					//树的处理
					for(var i = 0; i < resultData.length; i++){
						var target = "li"+resultData[i].source[0].ele_value;
						 treeChoice("treePanel"+target,resultData[i].treeAll, target);
						 var treeObj =  $.fn.zTree.getZTreeObj("data-tree"+target);
						//树的选中
						 for(var j= 0; j<resultData[i].treeCheck.length; j++){
							 var search_nodes = treeObj.getNodesByParam("chr_id",resultData[i].treeCheck[j].chr_id,null);
							 if(search_nodes != null && search_nodes.length > 0){
									treeObj.checkNode(search_nodes[0], true, false);
									treeObj.expandNode(search_nodes[0], true, false, true);
								}
						 }
					}
					//多选框 处理
					for(var i = 0; i < resultData.length; i++){
						var TabPanelId = "tabli"+resultData[i].source[0].ele_value;
						$("#"+TabPanelId).find("select option[value='"+resultData[i].source[0].operFlag+"']").prop("selected", true);
						//$("#organSelectList option[value='"+data.org_type+"']").prop("selected", true);
					}
				}
			}
		});
	}
	
	//弹出框
	viewModel.showModalELE = function(){
    	$("#modalElE").modal("show");
    	viewModel.getEleTree();
    }
	//要素选择确定按钮
	viewModel.sureCloseModalEle = function(){
		var treeObj = $.fn.zTree.getZTreeObj("eleTree");
		var nodes = treeObj.getSelectedNodes();
		if(nodes != null && nodes.length > 0){
			$("#elecontationInput").val(nodes[0].elename);
			$("#eleCodeInput").val(nodes[0].ele_code);
			$("#eleNameInput").val(nodes[0].elename.split(" ")[2]);
		}else{
			$("#elecontationInput").val();
			$("#eleCodeInput").val();
		}
		$("#modalElE").modal("hide");
	}
	//点击添加的方法
	
	viewModel.addEle = function() {
		var eleName = $("#elecontationInput").val();
		if(eleName == null || eleName == ""){
			ip.ipInfoJump("请选择要增加的要素");
		}else{
			var liName = $("#eleCodeInput").val();
			var elename = $("#eleNameInput").val();
			var target ="li"+liName; //要添加的东西   zhege difangyaogai
			var liItem = $("#ulNavtabTree li");
			var liId = [];
			if(liItem.length != 0){
				for(var i=0; i<liItem.length; i++){
					liId.push(liItem.eq(i).attr("id"));
				}
				if(liId.indexOf(target) != -1){
					ip.ipInfoJump("已经在过滤条件中，请不要重复添加");
					return false;
				}
			}
				var ulNavtabTree = $("#ulNavtabTree"); //标签
				var tabContentTree = $("#tabContentTree");//面板
				var myTab ="";
				if($("#ulNavtabTree li").length == 0){
					var liItem = "<li role='presentation' class='active' id='"+target+"'><a href='#tab"+target+"' aria-controls='profile' role='tab' data-toggle='tab'>"+elename+"</a></li>";
					myTab = "<div role='tabpanel' class='tab-pane active' id='tab"+target+"' name='"+target+"'>";
				}else{
					var liItem = "<li role='presentation' id='"+target+"'><a href='#tab"+target+"' aria-controls='profile' role='tab' data-toggle='tab'>"+elename+"</a></li>";
					myTab = "<div role='tabpanel' class='tab-pane' id='tab"+target+"' name='"+target+"'>";
				}
				var TabPanlItem = myTab +
					"<div class='eleTitle'>"+
						"<label class='col-md-3 col-sm-3 eleTitle-label'>关系运算符</label>"+
						"<div class='col-md-9 col-sm-9 eleTitle-select'>"+
							"<select class='form-control'>"+
								"<option value='0'></option>"+
								"<option value='1'>in(=)</option>"+
								"<option value='2'>not in(<>)</option>"+
								"<option value='3'>like</option>"+
								"<option value='4'>not like</option>"+
								"<option value='5'>or</option>"+
							"</select>"+
						"</div>"+
					"</div>"+
					"<div class='eleContent'>" +
						"<div id='treePanel"+target+"' class='ele-tree-panel'></div>"+
						"<div class='elefooter'>"+
							"<p><label>过滤条件：</label><input style='width: 45%; display: inline-block;' class='form-control' id='filterInput"+target+"'><button class='btn btn-primary' id='refresh"+target+"' name='data-tree"+target+"' onClick='refreshTabPanl(this.name)' style='margin-left: 10px'>刷新</button></p>"+
							"<p><label>过滤条件填写实例：</label><label>and level_num=1</label><label style='margin-left: 20px'>序号：</label><input style='width: 100px;' id='eleNum"+target+"'></p>"+
							"<p></p>"+
						"</div>"+
					"</div>"+
				"</div>";
				ulNavtabTree.append(liItem);
				tabContentTree.append(TabPanlItem);
				//获取树的数据
				var element = $("#elecontationInput").val().split(" ")[0];
				$.ajax({
					url: "/df/dic/dictree.do?tokenid="+tokenid,
					type: "GET",
					async: false,
					data: {
						"element": element,
						"tokenid": tokenid,
						"ele_value": "",
						"ajax": "noCache"
					},
					success: function(data) {
						treeChoice("treePanel"+target, data.eleDetail, target);
					}
				});
				//var data=[{"chr_id":"1", "parent_id":"1","chr_name": "aaaa"}];
				//treeChoice("treePanel"+target, data, target);
			}
	}
	//删除
	viewModel.delEle = function() {
		var liActive=$("#ulNavtabTree li.active");
		var index = $("#ulNavtabTree li.active").index();
		var panlActive=$("#tabContentTree div.active");
		liActive.remove();
		panlActive.remove();
		if(index == 0){
			$("#ulNavtabTree li").eq(0).addClass("active");
			$("#tabContentTree div.tab-pane").eq(0).addClass("active");
		}else{
			$("#ulNavtabTree li").eq(index-1).addClass("active");
			$("#tabContentTree div.tab-pane").eq(index-1).addClass("active");
		}
	};
	//保存
	viewModel.saveAllInfo = function(){
		//先校验，判断添加的过滤条件中有没有没有选择的，如果没有提示选择
		var tabPane = $("#tabContentTree div.tab-pane");
		for(var i = 0; i < tabPane.length; i++){
			var treeId = "data-tree"+tabPane.eq(i).attr("id").substring(3);
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			if(treeObj != null){
				var checkNodes = treeObj.getCheckedNodes();
				if(checkNodes.length == 0){
					ip.ipInfoJump("要素"+tabPane.eq(i).attr("id").substring(5)+"没有选择过滤数据,请选择");
					return false;
				}
			}
		}
		var url = $("#leftFrame", parent.document).attr("src");
		var moduleId = url.split("&")[1].split("=")[1];
		var moduleName = url.split("&")[2].split("=")[1];
		var moduleCode = url.split("&")[3].split("=")[1];
		if(moduleId == "undefined"){
			moduleId == "";
		}else if(moduleName == "undefined"){
			moduleName == "";
		}else if(moduleCode == "undefined"){
			moduleCode == "";
		}
		//获取每个面板节点的选中数据
		 var filterPane = $("#tabContentTree div.tab-pane");
		 var control = {};
		 var controlItem = [];
		 if(filterPane != null && filterPane.length > 0){
			 
			 for(var i=0; i < filterPane.length; i++){
				 var eleCode = filterPane.eq(i).attr("name").substring(2);
				 var item = {};
				 var treeObj =  $.fn.zTree.getZTreeObj("data-treeli" + eleCode);
				 var chekedNodes = treeObj.getCheckedNodes();
				 if(chekedNodes != null && chekedNodes.length != 0){
					 fiterChekedNodes = [];
					 for(var j=0 ;j< chekedNodes.length; j++){
						 var fiterChekedNode = {};
						 fiterChekedNode["chr_id"] = chekedNodes[j].chr_id;
						 fiterChekedNode["level_num"] = chekedNodes[j].level_num;
						 fiterChekedNode["is_leaf"] = chekedNodes[j].is_leaf;
						 fiterChekedNode["chr_name"] = chekedNodes[j].chr_name;
						 fiterChekedNode["set_year"] = chekedNodes[j].set_year;
						 fiterChekedNode["operFlag"] = chekedNodes[j].operFlag;
						 fiterChekedNode["chr_code"] = chekedNodes[j].chr_code;
						 fiterChekedNode["parent_name"] = chekedNodes[j].parent_name;
						 fiterChekedNode["chr_code5"] = chekedNodes[j].chr_code5;
						 fiterChekedNode["chr_code3"] = chekedNodes[j].chr_code3;
						 fiterChekedNode["chr_code2"] = chekedNodes[j].chr_code2;
						 fiterChekedNode["chr_code1"] = chekedNodes[j].chr_code1;
						 fiterChekedNode["parent_id"] = chekedNodes[j].parent_id;
						 fiterChekedNode["enabled"] = chekedNodes[j].enabled;
						 fiterChekedNode["eleNum"] = filterPane.eq(i).find("#eleNumli"+eleCode).val();
						 fiterChekedNode["operFlag"] = filterPane.eq(i).find("select").val();
						 fiterChekedNode["specialSql"] = $("#filterInputli"+eleCode).val();
						 fiterChekedNodes.push(fiterChekedNode);
					 }
					 item[eleCode] = fiterChekedNodes;
					 //specialsql
				 }
				 controlItem.push(item);
			 }
		     control["specialSql1"] = $("#sqlInputVal").val();
		     control["control"] = controlItem;
		 }
		 $.ajax({
			 url: "/df/globalConfig/updateFilter.do?tokenid="+tokenid,
			 type: "POST",
			 data: {
				 "ajax": "1",
				 "tokenid": tokenid,
				 "moduleId": moduleId,
				 "moduleCode":moduleCode,
				 "moduleName":moduleName,
				 "filterInfo": JSON.stringify(control)
			 },
			 success: function(data){
				 if(data.flag == 1){
					 ip.ipInfoJump("保存成功");
				 }else{
					 ip.ipInfoJump("服务器繁忙，请稍等!");
				 }
			 }
		 });
	};
	$(function(){
		app = u.createApp({
            el: 'body',
            model: viewModel
        });
		var url = $("#leftFrame", parent.document).attr("src");
		var moduleId = url.split("&")[1].split("=")[1];
		viewModel.getFilterCondition(moduleId);
	})
});
