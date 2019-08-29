require(['jquery', 'knockout', 'bootstrap', 'uui','tree', 'grid', 'ip'],
    function($, ko) {
        var zTreeNodes1 = [];
        // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
        var setting1 = {
            check: {
                enable: true,
            },
            callback: {
                onClick:function(){
                    var treeObj1 = $.fn.zTree.getZTreeObj("treeTest2");
                    var treeObj2 = $.fn.zTree.getZTreeObj("treeTest3");
                    var nodes1 = treeObj1.getSelectedNodes();
                    treeObj2.checkAllNodes(false);
                    if(nodes1[0].isParent){
                        alert("只能对用户进行设置!");
                        zTreeNodes1 = [];
                        return false;
                    }else{
                        alert(nodes1.name);
                    }
                    zTreeNodes1 = nodes1;
                }
            }
        };
     // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var zNodes1 = [
            {
                name: "用户",
                open: true,
                children: [
                    {
                        name: "001 系统管理员",
                        open: true,
                        children: [
                            {name:"200 特别权限用户"}, {name:"999002 总账超级"}, {name:"999115 支付超级"}
                        ]
                    },
                    {
                        name: "002 预算单位",
                        open: true,
                        children: [
                            {
                                name:"000 测试单位",
                                open: true,
                                children: [{name:"000 测试单位000"}]
                            },
                            {
                                name:"111 测试单位",
                                open: true,
                                children: [{name:"111 测试单位111"}]
                            },
                            {
                                name:"222 测试单位",
                                open: true,
                                children: [{name:"222 测试单位222"}]
                            },
                        ]
                    }
                ]
            }
        ];

        $(document).ready(function () {
            zTreeObj1 = $.fn.zTree.init($("#treeTest2"), setting1, zNodes1);
        });


        search = function(){
            zTreeObj1.checkAllNodes(false);
            var demoValue = $("#input1").val();
            var searchNode1 = zTreeObj1.getNodesByParamFuzzy("name",demoValue,null);
            /*var searchNode2 = zTreeObj2.getNodesByParamFuzzy("name",demoValue,null);*/
            console.log(searchNode1);

            for (var i=0, l=searchNode1.length; i < l; i++) {
                zTreeObj1.selectNode(searchNode1[i]);
            }

        };

        var viewModel = {
            treeSetting:{
                view:{
                    showLine:false,
                    selectedMulti:false
                },
                callback:{
                    onClick:function(e,id,node){
                        // alert(id)
                        // alert(node)
                        var rightInfo = node.name + '被选中';
                        /*u.showMessage({msg:rightInfo,position:"top"})*/


                    }
                }
            },
            dataTable: new u.DataTable({
                meta: {
                    'id': {
                        'value':""
                    },
                    'pid': {
                        'value':""
                    },
                    'title':{
                        'value':""
                    }
                }
            })
        };
        var data = [{
            "id": "01",
            "pid": "root",
            "title": "f1"
        },{
            "id": "02",
            "pid": "root",
            "title": "f2"
        },{
            "id": "101",
            "pid": "01",
            "title": "f11"
        },{
            "id": "102",
            "pid": "01",
            "title": "f12"
        },{
            "id": "201",
            "pid": "02",
            "title": "f21"
        }];

        viewModel.dataTable.setSimpleData(data);
        
        

        

        $(function () {
    		app = u.createApp({
    			el: 'body',
    			model: viewModel
    		});

    	});

        
    });
