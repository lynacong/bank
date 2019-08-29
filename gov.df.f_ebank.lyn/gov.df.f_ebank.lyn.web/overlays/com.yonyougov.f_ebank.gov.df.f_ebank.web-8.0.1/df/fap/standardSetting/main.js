require(['jquery', 'knockout','bootstrap', 'uui','tree','grid','director','ip'], function ($, ko) {
	window.ko = ko;
	var tokenid = ip.getTokenId();
	var viewModel = {
		rightTreeId: ko.observable(""),
		modelDataTable: new u.DataTable({
            meta: {
                'id': {
                    'value':""
                },
                'parent': {
                    'value':""
                },
                'name':{
                    'value':""
                }
            }
        }),
       userTreeSetting:{
        	view:{
                showLine:false,
                selectedMulti:false
            },
            callback: {
        		onClick: zTreeOnClick
        	}
        }
    };
	//用户树的点击事
	function zTreeOnClick(event, treeId, treeNode) {
		var src = "";
		if(treeNode.panel_class != "" && treeNode.panel_class != undefined){
			var src = treeNode.panel_class;
			$("#leftFrame").attr("src",src+"?tokenid="+tokenid+"&moduleId="+treeNode.id+"&moduleName="+treeNode.name+"&moduleCode="+treeNode.code);
		}else{
			$("#leftFrame").attr("src","");
		}
		
	};
	viewModel.initModelTree = function() {
		$.ajax({
			url: "/df/globalConfig/getMenuTree.do?tokenid="+tokenid,
			type: "GET",
			data: {
				"tokenid": tokenid,
				"ajax": "1"
			},
			success: function(data){
				if(data != null){
					viewModel.modelDataTable.setSimpleData(data.menulist);
				}
			}
		});
		$("#leftFrame").attr("src","/df/fap/standardSetting/planmanager/planmain.html?tokenid="+tokenid);
	};
	viewModel.getRightTreeId = function(){
		return viewModel.rightTreeId();
	}
    app = u.createApp({
            el: 'body',
            model: viewModel
        });
    viewModel.initModelTree();//获取用户数据
    
});
