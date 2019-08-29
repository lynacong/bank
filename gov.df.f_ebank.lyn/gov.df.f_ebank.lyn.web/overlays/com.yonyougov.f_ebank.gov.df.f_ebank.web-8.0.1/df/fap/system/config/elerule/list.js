require(['jquery', 'knockout', '/df/fap/system/config/ncrd.js', 'bootstrap', 'uui', 'tree', 'grid', 'ip'], function ($, ko, ncrd) {
    window.ko = ko;
    var listApp, setRuleApp;
    var LIST_DO_URL = '/df/elerule/list.do'; //查询要素定值规则主表列表
    var DETAIL_LIST_DO_URL = '/df/elerule/detail/list.do'; //根据定值规则id查询定值规则明细列表
    var DEL_DO_URL = '/df/elerule/del.do'; //删除要素定值规则
    var CANCEL_DO_URL = '/df/elerule/cancel.do'; //取消定值规则
    var SAVE_DO_URL = '/df/elerule/save.do'; //保存新增的要素定值规则
    var UPDATE_DO_URL = '/df/elerule/update.do'; //修改要素定值规则
    var ELEMENTSET_LIST_DO_URL = '/df/dictionary/elementset/list.do';//获取要素配置信息列表
    var ELEVALUES_LIST_DO_URL = '/df/dictionary/elevalues/list.do';//根据要素代码获取要素值集
    var viewModel = {
        ruleName: ko.observable(),
        treeKeyword: ko.observable(""),
        findTree: function () {
            ncrd.findTreeNode($.fn.zTree.getZTreeObj("tree2"), viewModel.treeKeyword());
        },
        //定值规则树数据模型
        listDataTable: new u.DataTable({
            meta: {
                'title': {type: 'string'}
            }
        }),
        treeSetting: {
            view: {
                showLine: true,
                selectedMulti: false
            },
            callback: {
                onClick: treeNodeClick
            }
        },
        //表格数据模型
        gridDataTable: new u.DataTable({
            meta: {
                'chr_code': {type: 'string'},
                'chr_name': {type: 'string'},
                'rule_name': {type: 'string'}
            }
        })
    };

    //树结点单击事件
    function treeNodeClick(e, id, node) {
        showgrid(node.id, node.ele_code);
        if (node.ele_code != "ROOT") {
            var data = ncrd.getEleValues(node.length);
        }
    }

    //请求数据，刷新左侧定值规则树
    function refreshEleRuleTree() {
        $.ajax({
            type: 'GET',
            data: {'tokenid': ip.getTokenId(), "ajax": "noCache"},
            cache: false,
            url: LIST_DO_URL,
            dataType: 'json',
            success: function (result) {
                if (result.data) {
                    var element = new Array(), data = result.data;
                    //构造要素规则树的标题
                    for (var j = 0; j < data.length; j++) {
                        data[j].title = data[j].ele_rule_code + ' ' + data[j].ele_rule_name;
                    }
                    for (var i = data.length - 1; i >= 0; i--) {
                        //element数组中不包含data[i]['ele_code']，则往data中新增一条数据
                        if (element.indexOf(data[i]['ele_code']) < 0) {
                            //往data中添加要素的数据，从data.length处开始添加
                            data[data.length] = {
                                "ele_rule_code": data[i]['ele_code'],
                                "title": ncrd.getEleNameByCode(data[i]['ele_code']),
                                "ele_code": "ROOT"
                            };
                            element[element.length] = data[i]['ele_code'];
                        }
                    }
                    viewModel.listDataTable.setSimpleData(data);
                    var treeObj = $("#tree2")[0]['u-meta'].tree;
                    if (treeObj.getSelectedNodes().length > 0) {
                        treeNodeClick(null, "#tree2", treeObj.getSelectedNodes()[0]);
                    }
                }
            },
            error: ncrd.commonAjaxError
        });
    }

    /*
     *根据定值规则id查询定值规则明细列表
     * 必须点击节点再进行数据加载
     * 2017-4-06
     */
    var grid_ele_rule_id;//定义定值规则id，后面传参需要用到，写在方法外
    function showgrid(id, pid) {
        //获取定值规则id
        var eleruleid_list = viewModel.listDataTable.getSimpleData();
        for (var i = 0; i < eleruleid_list.length; i++) {
            if (id == eleruleid_list[i].ele_rule_code) {
                if (pid == eleruleid_list[i].ele_code) {
                    grid_ele_rule_id = eleruleid_list[i].ele_rule_id;
                    break;
                }
            }
        }
        if (pid && pid != "ROOT") {
            $.ajax({
                type: "GET",
                url: DETAIL_LIST_DO_URL,
                data: {'tokenid': ip.getTokenId(), "ajax": "noCache", "ele_rule_id": grid_ele_rule_id},
                cache: false,
                dataType: 'json',
                success: function (result) {
                    var data = result.data;
                    viewModel.gridDataTable.setSimpleData(data);
                },
                error: ncrd.commonAjaxError
            });
        }
    };
    /*
     * 获取要素配置信息列表
     * 查询新增时能选择的所有定值要素
     * 2017-3-23
     */
    viewModel.selectAllfactor = function () {
        $.ajax({
            type: 'GET',
            url: ELEMENTSET_LIST_DO_URL,
            data: {'tokenid': ip.getTokenId(), "ajax": "noCache", 'set_year': "0"},//业务年度，为空时默认为当前登录业务年度。
            cache: false,
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        $("#selectEle").append("<option value=" + data[i].ele_code + ">" + data[i].ele_code + data[i].ele_name + "</option>");
                    }
                } else {
                }
            },
            error: ncrd.commonAjaxError
        });
    };
    /*
     * 新增部分
     * newaddBtn点击新增出现模态框
     * saveAddele新增保存方法，保存成功之后刷新一下左侧树
     */
    viewModel.newaddBtn = function () {
        $("#addmyModal").modal("show");
    };
    viewModel.saveAddele = function () {
        var ele_rule_code = $("#entereleruleCode").val();//新增输入的定值规则编码
        var ele_rule_name = $("#entereleruleName").val();//新增输入的定值规则名称
        var ele_code = $("#selectEle").val();//新增的ele_code
        var is_empty = 0;//判断所填编码和名称以及要素是否为空，0不为空
        if (ele_rule_code == '') {
            //alert("编码不能为空");
            ip.ipInfoJump("编码不能为空", 'error');
            $("#entereleruleCode").css("border", "1px solid red");
            is_empty = -1;
        }
        if (ele_rule_name == '') {
            //alert("名称不能为空");
            ip.ipInfoJump("名称不能为空", 'error');
            $("#entereleruleName").css("border", "1px solid red");
            is_empty = -1;
        }
        var listData = viewModel.listDataTable.getSimpleData();
        var flag = 0; // 要素规则是否重复标识：0 不重复，-1 重复
        if (listData != undefined) {
            //判断新增要素规则是否重复
            for (var i = 0; i < listData.length; i++) {
                if (listData[i].ele_code == ele_code) {
                    if (listData[i].ele_rule_code == ele_rule_code) {
                        flag = -1;
                        //alert("要素规则重复");
                        ip.ipInfoJump("要素规则重复", 'error');
                        break;
                    }
                }
            }
        }
        if (flag != -1 && is_empty == 0) {
            $.ajax({
                type: 'POST',
                url: SAVE_DO_URL + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
                data: {
                    'ele_rule_code': ele_rule_code,
                    'ele_rule_name': ele_rule_name,
                    'ele_code': ele_code,
                    'set_year': "0"
                },
                cache: false,
                dataType: 'json',
                success: function (result) {
                    flag = 0;
                    var data = result.data;
                    viewModel.listDataTable.setSimpleData(data);
                    $("#addmyModal").modal("hide");
                    $("#entereleruleCode").val("");
                    $("#entereleruleName").val("");
                    refreshEleRuleTree();
                },
                error: ncrd.commonAjaxError
            });
        }
    };
    /*
     * 修改部分
     * updateBtn点击修改出现模态框
     * saveModify修改保存方法
     */
    viewModel.updateBtn = function () {
        var treeObj = $("#tree2")[0]['u-meta'].tree.getSelectedNodes();
        if (treeObj != null && treeObj.length > 0 && treeObj[0].ele_code != 'ROOT') {
            if (treeObj[0].ele_code != "ROOT") {
                $("#modifymyModal").modal("show");
                var modify_ele_code;
                var elemodify_list = viewModel.listDataTable.getSimpleData();
                for (var i = 0; i < elemodify_list.length; i++) {
                    if (treeObj[0].ele_code == elemodify_list[i].ele_code) {//判断ele_code
                        if (treeObj[0].id == elemodify_list[i].ele_rule_code) {//判断ele_rule_code
                            $("#modifyeleCode").val(elemodify_list[i].ele_rule_code);//赋值
                            $("#modifyeleName").val(elemodify_list[i].ele_rule_name);
                            modify_ele_code = treeObj[0].ele_code;
                            var selectmodifyEle = ncrd.getEleNameByCode(modify_ele_code);
                            $("#selectmodifyEle").empty();
                            $("#selectmodifyEle").append("<option>" + modify_ele_code + selectmodifyEle + "</option>");
                            break;
                        }
                    }
                }
            }
        }
        else {
            //$("#promptModal").modal("show");
            ip.ipInfoJump("请选择一个要素规则！", "info");
        }

    };
    viewModel.saveModify = function () {
        var ele_rule_code;
        var ele_rule_name;
        var ele_code;
        var ele_rule_id;
        var set_year;
        ele_rule_code = $("#modifyeleCode").val();
        ele_rule_name = $("#modifyeleName").val();
        var elemodifysave_list = viewModel.listDataTable.getSimpleData();
        for (var i = 0; i < elemodifysave_list.length; i++) {
            if (ele_rule_code == elemodifysave_list[i].ele_rule_code) {
                ele_code = elemodifysave_list[i].ele_code;
                set_year = elemodifysave_list[i].set_year;
                ele_rule_id = grid_ele_rule_id;
//					alert(ele_rule_id);
                break;
            }
        }
        $.ajax({
            type: 'POST',
            url: UPDATE_DO_URL + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
            data: {
                'ele_rule_code': ele_rule_code,
                'ele_rule_name': ele_rule_name,
                'ele_code': ele_code,
                'ele_rule_id': ele_rule_id,
                'set_year': set_year
            },
            cache: false,
            dataType: 'json',
            success: function (result) {
                $("#modifymyModal").modal("hide");
                refreshEleRuleTree();
            },
            error: ncrd.commonAjaxError
        });
    };
    /*
     * 删除部分
     * deleteBtn点击删除出现模态框
     * confirmDelete确认删除
     */
    var del_ele_rule_id;
    viewModel.deleteBtn = function () {
        var treeObj = $("#tree2")[0]['u-meta'].tree.getSelectedNodes();
        if (treeObj != null && treeObj.length > 0 && treeObj[0].ele_code != 'ROOT') {
            //$("#deleteModal").modal("show");
            var delConfirmMsg = '确定要删除"' + treeObj[0].ele_rule_code + ' ' + treeObj[0].ele_rule_name + '"定值规则吗？';
            ip.warnJumpMsg(delConfirmMsg, "delConfirmSureId", "delConfirmCancelCla");
            $("#delConfirmSureId").on("click", viewModel.confirmDelete);
            $("#delConfirmSureId").on("click", function () {
                $("#config-modal").remove();
            });
            $(".delConfirmCancelCla").on("click", function () {
                $("#config-modal").remove();
            });

            var delete_list = viewModel.listDataTable.getSimpleData();//获取定值规则id
            for (var i = 0; i < delete_list.length; i++) {
                if (treeObj[0].id == delete_list[i].ele_rule_code) {
                    del_ele_rule_id = delete_list[i].ele_rule_id;
                    break;
                }
            }
        } else {
            //$("#promptModal").modal("show");
            ip.ipInfoJump("请选择一个要素规则！", "info");
        }
    };
    viewModel.confirmDelete = function () {
        $.ajax({
            type: 'POST',
            url: DEL_DO_URL + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
            data: {'ele_rule_id': del_ele_rule_id},
            cache: false,
            dataType: 'json',
            success: function (result) {
            	if(result.errorCode == "-1"){
            		ip.ipInfoJump(result.errorMsg,"error");
            	}
                $("#deleteModal").modal("hide");
                refreshEleRuleTree();
            },
            error: function (data) {
            	ip.ipInfoJump("该条规则不可删除","error");
            }
        });
    };

    //提示消息(请选择一个要素)点确定关闭模态框
    viewModel.confirmDetermine = function () {
        $("#promptModal").modal("hide");
    };
    /*
     * 取消规则部分
     * cancelRule出现模态框
     * confirmCancel确认取消规则
     * 2017-3-29
     */
    var cancel_ele_rule_detail_id;//定义取消详细规则id
    var cancel_chr_name;//定义取消规则name
    viewModel.cancelRule = function () {
        cancel_ele_rule_detail_id = detailId;
        cancel_chr_name = setchrCode + setchrName;//确定要取消规则的名字
        viewModel.ruleName('"' + cancel_chr_name + '"');
        if (cancel_ele_rule_detail_id == null || cancel_ele_rule_detail_id == "null") {
            //$("#info-notice").show();
            //$("#info-notice").fadeOut(2000);
            ip.ipInfoJump("没有对应规则，不能取消！", "info");
        } else {
            //$("#cancelruleModal").modal("show");
            var delConfirmMsg = '确定要取消' + viewModel.ruleName() + '这个定值规则吗？';
            ip.warnJumpMsg(delConfirmMsg, "cancelConfirmSureId", "cancelConfirmCancelCla");
            $("#cancelConfirmSureId").on("click", viewModel.confirmCancel);
            $("#cancelConfirmSureId").on("click", function () {
                $("#config-modal").remove();
            });
            $(".cancelConfirmCancelCla").on("click", function () {
                $("#config-modal").remove();
            });
        }
    };
    viewModel.confirmCancel = function () {
        $("#cancelruleModal").modal("hide");
        $.ajax({
            type: 'POST',
            url: CANCEL_DO_URL + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
            data: {'ele_rule_detail_id': cancel_ele_rule_detail_id},
            cache: false,
            dataType: 'json',
            success: function (result) {
                if (result.errorCode == "0") {
                    //清除规则
                    var selectrow = viewModel.gridDataTable.getRow(rowindex);
                    selectrow.setValue('rule_name', '');
                }
                else {
                    //alert("取消失败！");
                    ip.ipInfoJump("取消失败！", 'error');
                }
            },
            error: ncrd.commonAjaxError
        });
    };

    //获取定值规则明细id和当前选中的索引，用于设定规则和取消规则，用于设定规则作为 参数
    var rowindex;
    var detailId;
    //以下五个参数传给设定规则页面
    var eleRuleDeatilId;// 设定规则的定值规则明细id
    var seteleRuleId;
    var setchrName;
    var setchrCode;
    var setchrId;
    viewModel.getSelectedEleRuleDeatilId = function (obj) {
        var row = viewModel.gridDataTable.getFocusRow();
        detailId = row.getSimpleData().ele_rule_detail_id;
        setchrCode = row.getSimpleData().chr_code;
        setchrName = row.getSimpleData().chr_name;
        setchrId = row.getSimpleData().chr_id;
        seteleRuleId = grid_ele_rule_id;
        rowindex = obj.rowIndex;
    };
    /*
     * 动态加载设定规则页面部分
     * 2017-3-21
     */
    // 编辑页面关闭时的回调事件，save:保存关闭 cancel：取消关闭
    var onsetRuleAppClose = {
        save: function () {
            go("#list-page");
            var save_ele_code;
            var save_ele_rule_code;
            var con1 = viewModel.listDataTable.getSimpleData();
            for (var i = 0; i < con1.length; i++) {
                if (con1[i].ele_rule_id == seteleRuleId) {
                    save_ele_code = con1[i].ele_code;
                    save_ele_rule_code = con1[i].ele_rule_code;
                }
            }
            showgrid(save_ele_rule_code, save_ele_code);
            // todo 刷新列表页面数据          
        },
        cancel: function () {
            go("#list-page");
        }
    };

    // 切换当前显示的界面
    function go(showCollapse) {
        $("div.container-fluid.ncrd.collapse:not(" + showCollapse + ")").collapse('hide');
        $(showCollapse).collapse('show');
        if (showCollapse == "#list-page") {
            $("#list-page .ztree").css("display", "block");
        }
    }

    // 设定规则页面加载完成后的回调函数，需要等待编辑页面加载完才能执行的代码放在这里
    function onsetRuleAppLoaded(eleRuleDeatilId, seteleRuleId, setchrName, setchrCode, setchrId) {
        go("#setRule-page");
        setRuleApp.show(eleRuleDeatilId, seteleRuleId, setchrName, setchrCode, setchrId, onsetRuleAppClose);
    };
    // 设定规则按钮单击事件
    viewModel.setRule = function () {
        var gridTable = viewModel.gridDataTable.getSimpleData();
        if (gridTable) {
            if (gridTable.length) {
                var row = viewModel.gridDataTable.getFocusRow();
                if (row) {
                	
                	if(row.getValue("rule_name")){
                		eleRuleDeatilId = detailId;
                	}else{
                		eleRuleDeatilId = "";
                	}           
                	
                    if (!setRuleApp) {
                        loadsetRuleApp(onsetRuleAppLoaded, eleRuleDeatilId, seteleRuleId, setchrName, setchrCode, setchrId);
                    } else {
                        onsetRuleAppLoaded(eleRuleDeatilId, seteleRuleId, setchrName, setchrCode, setchrId);
                    }
                } else {//没有获取焦点行的时候默认第一行为获取焦点行
                    viewModel.gridDataTable.setRowFocus(0);
                    viewModel.setRule();
                }
            } else {
                //alert("没有数据，不能设定规则！");
                ip.ipInfoJump("没有数据，不能设定规则！", 'info');
            }
        } else {
            //alert("");
            ip.ipInfoJump("没有数据，不能设定规则！", 'info');
        }
    };

    function loadsetRuleApp(onloaded, eleRuleDeatilId, seteleRuleId, setchrName, setchrCode, setchrId) {
        var container = $('#setRule-page');
        var url = "fap/system/config/elerule/rule";
        requirejs.undef(url);
        require([url], function (module) {
            ko.cleanNode(container[0]);
            container.html('');
            container.html(module.template);
            module.init(container[0]);
            setRuleApp = module;
            //回调函数
            if (onloaded) {
                onloaded(eleRuleDeatilId, seteleRuleId, setchrName, setchrCode, setchrId);
            }
        });
    }

    function init() {
        ko.cleanNode($("#list-page")[0]);
        var app = u.createApp(
            {
                el: '#list-page',
                model: viewModel
            }
        );
        refreshEleRuleTree();
        viewModel.selectAllfactor();
        //展开所有子节点
        var treeObj = $.fn.zTree.getZTreeObj("tree2");
        treeObj.expandAll(true);
    };

    init();

});