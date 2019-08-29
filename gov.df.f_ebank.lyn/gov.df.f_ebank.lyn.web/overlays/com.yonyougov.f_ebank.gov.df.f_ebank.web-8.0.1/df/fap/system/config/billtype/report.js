/**
 * Created by 阿奔 BENcorry on 2017/4/5 0005.
 */
define(['jquery', 'knockout','/df/fap/system/config/ncrd.js','text!fap/system/config/billtype/report._html','bootstrap', 'uui', 'tree', 'grid', 'ip'],
    function ($, ko,ncrd,template) {
        window.ko = ko;
        var listApp,
		    basePath = '/df/billType',
		    tokenid = ip.getTokenId(),
            treeNodeClick = '',
		    treeDt,
			num = 0,
		    //treeObj = $.fn.zTree.getZTreeObj("tree2"),
            onCloseCallback,
			INITPRINTFORMAT = basePath + '/initPrintFormat?tokenid=' + tokenid;
        var viewModel = {
            data : {
              treeName : ko.observable('')
            },
            tree2KeyWord : ko.observable(''),
            events : {
            	findClick : function(){
            		num = 0;
            		viewModel.treeDataTable.setSimpleData(treeDt);
            		viewModel.events.findTree();
            	},
                findTree : function () {
                	var treeObj = $.fn.zTree.getZTreeObj("tree2");
                    var nodes = treeObj.getNodesByFilter(filter); // 查找节点集合
					if(viewModel.tree2KeyWord() == ''){
						ip.ipInfoJump('查询不能为空！','info');
					}else{
						for (var i=0; i<nodes.length; i++) {
                        treeObj.selectNode(nodes[i]);
                        }
						treeObj.selectNode(nodes[num]);
					}
                    
                },
				nextOne : function(){
					num++;
					viewModel.events.findTree();
				},
                refresh : function () {
                    viewModel.treeDataTable.setSimpleData(treeDt);
                }
            },
            initTree : function () {
                $.ajax({
                    type : 'GET',
                    url : INITPRINTFORMAT,
                    dataType : 'json',
                    success : function (map) {
                        viewModel.treeDataTable.setSimpleData(map.data);
                        treeDt = map.data;
                    }
                });
            },
            treeSetting:{
                view:{
                    showLine:false,
                    selectedMulti:false
                },
                callback:{
                    onClick:function(e,id,node){
                        treeNodeClick = node.report_name;
						var treeId = node.report_id;
                        viewModel.data.treeName = {
                            "report_name": treeNodeClick,
							"report_id" : treeId
							
                        };
                    }
                }
            },
            treeDataTable: new u.DataTable({
                meta: {
                    'report_id': {
                        'value':""
                    },
                    'parent_id': {
                        'value':""
                    },
                    'report_name':{
                        'value':""
                    }
                }
            })
        };

        function filter(node) {
            var condition = $('#condition1').val();
            var text = viewModel.tree2KeyWord();
            var name = node.report_name;
            var result = false;
            if(name) {
                if(condition == '1') {//包含
                    result =  name.indexOf(text) > -1;
                } else if (condition == '2') {//左包含
                    result = name.indexOf(text) == 0;
                } else if (condition == '3') {//右包含
                    result = name.lastIndexOf(text) == (name.length - text.length);
                } else if (condition == '4') {//精确定位`
                    result =  text == name;
                }
            }
            return result == true;//result == false;
        }

        function show(billId, callback){
            onCloseCallback = callback || {};
        }
        viewModel.btnSaveClick = function () {
            if(onCloseCallback.save){
                onCloseCallback.save();
            }
        };
        viewModel.btnCloseClick = function () {
            if(onCloseCallback.cancel){
                onCloseCallback.cancel();
            }
        };
        function init(container){
            listApp = u.createApp({
                el: container,
                model: viewModel
            });
            tokenid = ip.getTokenId();
            //tokenid = getTokenId();
            viewModel.initTree();
        }
        return {
            'model': viewModel,
            'template': template,
            'init': init,
            'show':show

        };
    });