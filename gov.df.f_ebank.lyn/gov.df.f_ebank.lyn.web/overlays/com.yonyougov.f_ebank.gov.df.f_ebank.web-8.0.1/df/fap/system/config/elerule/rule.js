define(
    ['jquery', 'knockout', 'text!fap/system/config/elerule/rule._html',
        '/df/fap/system/config/ncrd.js',
        'css!fap/system/config/elerule/rule.css', 'bootstrap', 'uui',
        'tree', 'grid', 'ip'],
    function ($, ko, template, ncrd) {
        window.ko = ko;
        var onCloseCallback;
        var BASEPAGE_GET_URL = "/df/elerule/get.do",
            BASEPAGE_SET_URL = "/df/elerule/set.do",
            EDITPAGE_URL = "/df/dictionary/elementset/list.do",
            SEARCH_URL = "/df/dictionary/elevalues/list.do",
            ELEVALUES_LIST_URL = "/df/dictionary/elevalues/list.do";
            BASEPAGEBYID_GET_URL = "/df/elerule/getRuleById.do";
        var viewModel = {
            titleText: ko.observable("添加元素"), // 编辑页面的标题
            treeName: ko.observable(""),//billtype界面要用
            typeRowId: ko.observable(""), // 暂时保存点击的行（要素）的rowid
            rightType: ko.observable(false),// 复选框
            treeKeyword: ko.observable(""),// 查找框
            findTree: function () {// 查找树节点
                ncrd.findTreeNode($.fn.zTree.getZTreeObj("tree1"), viewModel.treeKeyword());
            },

            selected_ele: ko.observable(""),
            indexs:ko.observable([]),//要删除detailtype的下标
            getSelectedEleName: function (eleCode) {
                return ncrd.getEleNameByCode(eleCode);
            },

            ele_value: ko.observable(""),
            ele_code: ko.observable(""),
            ele_name: ko.observable(""),
            ele_rule_id: ko.observable(""),
            rule_code: ko.observable(""),
            rule_id: ko.observable(""),
            rule_name: ko.observable(""),
            set_year: ko.observable(""),


            ruleDataTable: new u.DataTable({
                meta: {
                    'right_TYPE': {
                        type: "string"
                    },
                    'right_GROUP_DESCRIBE': {
                        type: "string"
                    },
                    'rule_CODE': {
                        type: "string"
                    },
                    'rule_ID': {
                        type: "string"
                    },
                    'rule_NAME': {
                        type: "string"
                    },
                    'remark': {
                        type: "string"
                    },
                    'enabled': {
                        type: "string"
                    },
                    'rule_CLASSIFY': {
                        type: "string"
                    },
                    'sys_REMARK': {
                        type: "string"
                    },
                    'set_YEAR': {
                        type: "string"
                    },
                    'rg_CODE': {
                        type: "string"
                    },
                    'right_group_list': {
                        meta: {
                            'detail_list': {},
                            'type_list': {}
                        }
                    }
                }
            }),

            groupDataTable: new u.DataTable({
                meta: {
                    'right_GROUP_DESCRIBE': {
                        type: "string"
                    },
                    'right_GROUP_ID': {
                        type: "string"
                    },
                    'right_TYPE': {
                        type: "string"
                    },
                    'rule_ID': {
                        type: "string"
                    },
                    'set_YEAR': {
                        type: "string"
                    },
                    'rg_CODE': {
                        type: "string"
                    },
                    'detail_list': {},
                    'type_list': {}
                }
            }),

            detailDataTable: new u.DataTable({
                meta: {
                    'ele_CODE': {
                        type: "string"
                    },
                    'ele_VALUE': {
                        type: "string"
                    },
                    'ele_NAME': {
                        type: "string"
                    },
                    'right_GROUP_ID': {
                        type: "string"
                    },
                    'rg_CODE': {
                        type: "string"
                    },
                    'set_YEAR': {
                        type: "string"
                    }
                }
            }),

            typeDataTable: new u.DataTable({
                meta: {
                    'right_TYPE_STR': {
                        type: "string"
                    },
                    'ele_CODE': {
                        type: "string"
                    },
                    'ele_NAME': {
                        type: "string"
                    },
                    'right_GROUP_ID': {
                        type: "string"
                    },
                    'right_TYPE': {
                        type: "string"
                    },
                    'rg_CODE': {
                        type: "string"
                    },
                    'set_YEAR': {
                        type: "string"
                    }
                }
            }),

            // 树模型
            treeSetting: {
                view: {
                    showLine: false,
                    selectedMulti: false
                },
                callback: {
                    onClick: function (e, id, node) {
                        var rightInfo = node.name + '被选中';
                        viewModel.treeName = {"field_name": node.name};
                        //ip.ipInfoJump(rightInfo, "info");
                    },
                	beforeCheck: tree1BeforeCheck
                },
                check: {
                    enable: true,
                    chkDisabledInherit:true,
                    chkboxType: {
                        "Y": "s", "N": "s"
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                }
            },
            elemTreeDataTable: new u.DataTable()
        };

        //树结点搜索框键盘按下事件
        viewModel.treeSearchKeyDown = function (vm, e) {
            if (e.keyCode == 13) {
                e.currentTarget.blur();
                viewModel.findTree();
            } else {
                return true;
            }
        }

        // 删除要素
        viewModel.delElement = function ($index) {
            ip.warnJumpMsg("确定要删除这个要素吗？", "sid", "cCla");
            // 处理确定逻辑方法
            $("#sid").on("click", function () {
                var eleCode = ($index).getValue("ele_CODE");
                var types = viewModel.typeDataTable.getSimpleData();//获取所有条type
                for (var i = 0; i < types.length; i++) {//删除对应的type行
                    if (types[i].ele_CODE == eleCode) {
                        viewModel.typeDataTable.getAllRows().splice(i, 1);
                    }
                }
                //获取typeDataTable的值再塞进去，是为了触发kero自带刷新datatable功能，使删除的要素从页面消失
                var typeRow = viewModel.typeDataTable.getSimpleData();
                viewModel.typeDataTable.setSimpleData(typeRow);

                //获取当前要素对应的detail并删除
                var details = viewModel.detailDataTable.getSimpleData();//获取所有条detail
                var count = 0;
                for (var i = 0; i < details.length; i++) {
                    if (details[i].ele_CODE == eleCode) {
                        viewModel.indexs()[count] = i;
                        count = count + 1;
                    }
                }
                for (var w = viewModel.indexs().length - 1; w >= 0; w--) {
                    var delIndex = viewModel.indexs()[w];  //依次获取要删除detail的下标
                    viewModel.detailDataTable.getAllRows().splice(delIndex, 1);
                }
                var detailRow = viewModel.detailDataTable.getSimpleData(); // 删除中的detailDataTable
                //删除框消失
                $("#config-modal").remove();
            });
            // 处理取消逻辑方法
            $(".cCla").on("click", function () {
                $("#config-modal").remove();
            });
        };

        //初始化添加要素页面
        viewModel.changeTitleAddElem = function () {
            viewModel.titleText("添加要素");
            $("#selectElement").val(" ");//把下拉框默认值变为空
            viewModel.elemTreeDataTable.clear();//把树清空
            $("#saveElmBtn").removeAttr('data-dismiss');//解决关闭alert时摸态框也消失，在保存后再加上摸态框属性
        };
        //初始化修改要素页面
//        var indexs = [];//存放要修改要素的detail的index,便于删除；后面要用
        var modifyEleCode;//点击修改要素的ele_code;后面保存时判断要用
        viewModel.changeTitleEditElem = function ($index) {
        	viewModel.indexs([]);
            //获取需要的信息
            viewModel.titleText("修改要素");
            $("#saveElmBtn").removeAttr('data-dismiss');//解决关闭alert时摸态框也消失，在保存后再加上摸态框属性
            var rowid = ($index).rowId;// 获取当前点击要素的rowid
            viewModel.typeRowId(rowid); // 保存当前点击要素的rowid,当修改完成点击保存时，根据rowid修改保存对应的要素
            var eleCode = ($index).getValue("ele_CODE");// 获取当前点击要素的eleCode
            modifyEleCode = eleCode;
            var details = viewModel.detailDataTable.getSimpleData();//获取所有条detail
            var count = 0;
            var chrCodes = [];//获取勾选要素节点的chrCode
            //获取当前要素的detail的index,便于进入时显示数据和后面保存的时候删除
            for (var i = 0; i < details.length; i++) {
                if (details[i].ele_CODE == eleCode) {
                	viewModel.indexs()[count] = i;//当前行对应的detail行的索引组
                    chrCodes[count] = details[i].ele_VALUE;//存放勾选的树节点名称集合
                    count = count + 1;
                }
            }
            
            //使进入修改页面时，下拉框显示对应的要素名称，树显示对应要素detail信息
            $("#selectElement").val(eleCode);//设置下拉框默认值
            viewModel.selected_ele(eleCode);
            viewModel.getSelectEle();
            //勾选所有detail节点
            var treeObj = $.fn.zTree.getZTreeObj("tree1");
            var allNodes = treeObj.getNodes();// 获取所有树节点(数组，不同层次节点在不同组里)
            for (var x = 0; x < chrCodes.length; x++) {
                var node = treeObj.getNodeByParam("chr_code", chrCodes[x]);//获得该节点
                var node1 = node.getParentNode();
                treeObj.checkNode(node, true, false);//true勾选该节点,false不关联子节点
                treeObj.expandNode(node, true, true, true);
                treeObj.expandNode(node1, true, true, true);
            }
        };

        // 保存编辑要素页面信息
        viewModel.saveAddElement = function () {
            // 获取编辑要素页面数据
            var title = viewModel.titleText();// 编辑页面标题，用于判断是添加还是修改要素
            var ele_code = $("#selectElement").val();//要素编码
            var ele_name = ncrd.getEleNameByCode(ele_code);//要素简称
            var rightTypeBox = viewModel.rightType();// 获取复选框勾选状态,true/false
            var treeObj = $.fn.zTree.getZTreeObj("tree1");
            var nodes = treeObj.getCheckedNodes(true);// 选择的树节点
            var allNodes = treeObj.getNodes();// 获取所有树节点(数组，不同层次节点在不同组里)
            var rightType;
            var newType;//添加时是新的空type行，修改时是当前要修改的type行
            var right_GROUP_ID;
            var rg_CODE;
            var set_YEAR;

            // 根据复选框勾选情况和树节点勾选情况确定rightType的值（0为全部，1为部分）
            if (rightTypeBox) {// 如果复选框rightTypeBox为true,为全部权限（rightType = 0）
                rightType = 0;
            } else {
                rightType = 1;
                // 当rightType=1,复选框未勾选，但要判断树节点是否全选，若树节点全选，权限状态要变成全部，rightType为0
                var rt = 1;// 是否存在未勾选节点标识：1全勾选，0未全勾选
                for (var m = 0; m < allNodes.length; m++) {
                    var checked = allNodes[m].checked; // 判断节点是否d都选中
                    if (!checked) {// 如果存在没选中树节点，rt为0,跳出循环
                        rt = 0;
                        break;
                    }
                }
                if (rt) {// 若rt为1，树节点全勾选，为全部权限，rightType为0
                    rightType = 0;
                }
            }

            var flag = 0; //是否能添加的要素的标识，为0是能，为-1时不能（未选择下拉框要素/没有勾选节点/选择了重复的要素
            //判断是否选择要素
            if (ele_code == "" || ele_code == null) {
                flag = -1;
                //alert("请选择要素值");
                ip.ipInfoJump("请选择要素值", "info");
            }
            //判断选择要素是否重复
            var typeList = viewModel.typeDataTable.getSimpleData();//获取所有条detail
            if (ele_code && typeList && flag != -1) {
                //TODO 下面两个for一样，可以写成一个方法调用
                if (title == "添加要素") {
                    for (var s = 0; s < typeList.length; s++) {
                        var haved_ele_code = typeList[s].ele_CODE;
                        if (haved_ele_code == ele_code) {
                            flag = -1;
                            //alert("要素名称重复");
                            ip.ipInfoJump("要素名称重复", "error");
                            break;
                        }
                    }
                } else {	//修改要素时判断重复
                    if (ele_code != modifyEleCode) {//如果修改要素的要素名称和原来不一样就遍历所有type
                        for (var s = 0; s < typeList.length; s++) {
                            var haved_ele_code = typeList[s].ele_CODE;
                            if (haved_ele_code == ele_code) {
                                flag = -1;
                                //alert("要素名称重复");
                                ip.ipInfoJump("要素名称重复", "error");
                                break;
                            }
                        }
                    }
                }
            }
            //判断是否选择树节点
            if (ele_code && typeList && nodes.length == 0 && flag != -1) {
                flag = -1;
                //alert("请选择要素值详细信息");
                ip.ipInfoJump("请选择要素值详细信息", "info");
            }
            if (flag != -1) {// 选择要素要素不重复有信息时，保存添加或修改的要素信息
                if (title == "添加要素") {	// 判断是添加还是修改
                    newType = viewModel.typeDataTable.createEmptyRow(); // 添加要素，创建空行
                } else {
                    var rowid = viewModel.typeRowId();// 获取要修改要素的rowid
                    newType = viewModel.typeDataTable.getRowByRowId(rowid);// 通过rowid获取要修改的行
                    var indexs = viewModel.indexs();
					viewModel.detailDataTable.removeRows(indexs,{"forceDel":true});
//                    for (var k = indexs.length - 1; k >= 0; k--) {
//                        var delIndex = indexs[k]; //获取要删除detail的下标
//                        viewModel.detailDataTable.getAllRows().splice(delIndex, 1);
//                    }
                    var detailRow = viewModel.detailDataTable.getSimpleData(); // 删除后的detailDataTable
                }

                // 保存type数据
                if (rightType) {// rightType为1是部分权限
                    viewModel.typeDataTable.setValue("right_TYPE_STR", "部分", newType);
                    viewModel.typeDataTable.setValue("right_TYPE", 1, newType);
                } else {
                    viewModel.typeDataTable.setValue("right_TYPE_STR", "全部", newType);
                    viewModel.typeDataTable.setValue("right_TYPE", 0, newType);
                }
                viewModel.typeDataTable.setValue("ele_NAME", ele_name, newType);
                viewModel.typeDataTable.setValue("ele_CODE", ele_code, newType);

                var group = viewModel.groupDataTable.getSimpleData();//从group获取right_GROUP_ID,rg_CODE,set_YEAR
                if (group) {
                    if (group.length != 0) {
                        right_GROUP_ID = group[0].right_GROUP_ID;
                        rg_CODE = group[0].rg_CODE;
                        set_YEAR = group[0].set_YEAR;
                        viewModel.typeDataTable.setValue("right_GROUP_ID", right_GROUP_ID, newType);
                        viewModel.typeDataTable.setValue("rg_CODE", rg_CODE, newType);
                        viewModel.typeDataTable.setValue("set_YEAR", set_YEAR, newType);
                    }
                }

                // 保存detail数据
                if (nodes.length) {// 有勾选的节点 TODO 前面加了判断这里就可以不用了
                    var detaliData = [];// 用于保存所有选中树节点
                    for (var i = 0; i < nodes.length; i++) {
                        var chr_name = nodes[i].chr_name;
                        var chr_code = nodes[i].chr_code;
                        detaliData[i] = {
                            "ele_NAME": chr_name,// 树节点title
                            "ele_VALUE": chr_code,
                            "ele_CODE": ele_code,
                            "right_GROUP_ID": right_GROUP_ID,
                            "rg_CODE": rg_CODE,
                            "set_YEAR": set_YEAR
                        };
                    }
                    viewModel.detailDataTable.addSimpleData(detaliData);
//                    var saveDetail =  viewModel.detailDataTable.getSimpleData(detaliData);
                } else {
                    //alert("没有选中节点！");
                    ip.ipInfoJump("没有选中节点！", "info");
                }
                changeEleNameLength();//改变要素名称在页面显示的长度
                $("#saveElmBtn").attr('data-dismiss', 'modal');//加上摸态框属性，保存成功后摸态框会消失

                $("#selectElement").val(" ");//把下拉框默认值变为空
                viewModel.elemTreeDataTable.clear();//把树清空
            }
        };

        // 设定规则页面保存
        viewModel.saveSetRule = function () {
            var rule_code = viewModel.rule_code();
            var rule_name = viewModel.rule_name();
            var ele_value = viewModel.ele_value();
            var ele_code = viewModel.ele_code();
            var ele_name = viewModel.ele_name();
            var ele_rule_id = viewModel.ele_rule_id();
            var rule_id = viewModel.rule_id();
            var set_year = viewModel.set_year();

            //判断是否填写规则编码和名称
            if (!rule_code || !rule_name) {
                //alert("请输入规则编码和规则名称");
                ip.ipInfoJump("请输入规则编码和规则名称", "error");
            } else {
                //给groupDataTable赋值
                var group = viewModel.groupDataTable.getSimpleData();//从group获取一下三个属性
                if (group) {
                    if (group.length != 0) {
                        var right_GROUP_DESCRIBE = group[0].right_GROUP_DESCRIBE;
                        var right_GROUP_ID = group[0].right_GROUP_ID;
                        var rule_ID = group[0].rule_ID;
                    }
                }
                var detail_Data = viewModel.detailDataTable.getSimpleData();
                var type_Data = viewModel.typeDataTable.getSimpleData();
                var flag = 0;//为0时保存，为-1时不ajax
                if (!type_Data) {
                    //alert("要素为空！请添加要素");
                    ip.ipInfoJump("要素为空！请添加要素", "error");
                    flag = -1;
                }
                if (flag != -1) {//要素列不为空时
                    var rightType = 1;//rightType默认为1，若type_Data里rightType全为0，则groupDataTable的rightType为0
                    var count = 0;//记录type_Data里right_TYPE=0的个数，默认为0
                    for (var i = 0; i < type_Data.length; i++) {
                     if (type_Data[i].right_TYPE == 0) {
                            count = count + 1;//当有right_TYPE=0，个数+1
                        }
                    }
                    if (count == type_Data.length) {
                        rightType = 0;//如果type_Data里right_TYPE个数和right_TYPE=0的个数相等，则rightType全为0
                    }
                    var group_Data = {//	给groupDataTable的值
                        "right_GROUP_DESCRIBE": right_GROUP_DESCRIBE,
                        "right_GROUP_ID": right_GROUP_ID,
                        "rule_ID": rule_ID,
                        "right_TYPE": rightType,
                        "detail_list": detail_Data,
                        "type_list": type_Data
                    };
                    viewModel.groupDataTable.setSimpleData(group_Data);

                    //给ruleDataTable赋值
                    var rule = viewModel.ruleDataTable.getSimpleData();
                    if (rule) {
                        if (rule.length != 0) {
                            var rule_CLASSIFY = rule[0].rule_CLASSIFY;
                            var rg_CODE = rule[0].rg_CODE;
                            var set_YEAR = rule[0].set_YEAR;
                        }
                    }
                    var groupData = viewModel.groupDataTable.getSimpleData();
                    var rule_Data = {// 给ruleDataTable的值
                        "rule_CLASSIFY": rule_CLASSIFY,
                        "right_TYPE": rightType,
                        "rule_CODE": rule_code,
                        "rule_ID": rule_id,
                        "rule_NAME": rule_name,
                        "enabled": 1,
                        "set_YEAR": set_YEAR,
                        "rg_CODE": rg_CODE,
                        //"remark" : 1,
                        //"rule_CLASSIFY" : 1,
                        //"sys_REMARK" : 1,
                        "right_group_list": groupData
                    };
                    viewModel.ruleDataTable.setSimpleData(rule_Data);

                    //传给后台数据
                    var ruledata = viewModel.ruleDataTable.getSimpleData()[0];
                    var is_relation_ele = "1";
                    if (onCloseCallback.is_relation_ele) {
                        if (onCloseCallback.is_relation_ele == "0") {
                            is_relation_ele = "0";
                        }

                    }
                    var data = {// 传给后台的data
                        "ele_value": ele_value,
                        "ele_code": ele_code,
                        "ele_name": ele_name,
                        "rule_id": rule_id,
                        "ele_rule_id": ele_rule_id,
                        "ruledata": JSON.stringify(ruledata),
                        "is_relation_ele": is_relation_ele
                    };

                    //传data给后台
                    $.ajax({
                        type: 'POST',
                        url: BASEPAGE_SET_URL + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
                        dataType: 'json',
                        data: data,
                        cache: false,
                        success: function (result) {
                            if (result.errorCode == 0) {
                                //alert("后台保存规则成功！");
                                ip.ipInfoJump("保存规则成功！", "success");
                                if (onCloseCallback.save) {
                                    onCloseCallback.save(result);
                                }
                            } else {
                                //alert("后台返回-1，保存规则失败，请确定失败原因后重新保存！");
                                ip.ipInfoJump("服务器返回-1，保存规则失败，请确定失败原因后重新保存！", "error");
                            }
                        },
                        error: ncrd.commonAjaxError
                    });
                }
            }
        };

        //获取要素值集
        viewModel.getElemSource = function () {
            var setYear = viewModel.set_year();
            $.ajax({
                type: 'GET',
                data: {'set_year': setYear},
                cache: false,
                url: EDITPAGE_URL + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
                dataType: 'json',
                async: false,
                success: function (result) {
                    if (result.data) {
                        var data = result.data;
                        for (var i = 0; i < data.length; i++) {
                            $("#selectElement").append("<option value=" + data[i].ele_code + ">" + data[i].ele_name + data[i].ele_code + "</option>");
                        }
                    }
                },
                error: ncrd.commonAjaxError
            });
        };

        //获取树
        viewModel.getSelectEle = function () {
            var ele_code = $("#selectElement").val();//获取ele_code
            var treeData = ncrd.getEleValues(ele_code);//获取树节点信息，ele_code存在时才会返回数据
            viewModel.elemTreeDataTable.setSimpleData(treeData);// 设置要素树的值
        };

        // 展示rightType复选框勾选情况,全选和取消全选，复选框状态改变时触发
        viewModel.rightTypeChange = function () {
            var rightType = viewModel.rightType();
            var treeObj = $.fn.zTree.getZTreeObj("tree1");// 保存勾选树节点信息
            if (treeObj) {
//            	var treeAllNodes= treeObj.getNodes();
                if (rightType == true) {
                    treeObj.checkAllNodes(true);
                    // 全选时添加透明黑色遮罩
                    $("#addElementBody").addClass("selectAllBgColor");
                } else {
                    treeObj.checkAllNodes(false);
                    $("#addElementBody").removeClass("selectAllBgColor");
                }
            }
        };
        
        function tree1BeforeCheck() {
        	 var rightType = viewModel.rightType();
        	 if(rightType){
        		 return false;
        	 }else{
        		 return true;
        	 }
        };

        //改变显示的要素名称的长度，防止超出div
        var changeEleNameLength = function () {
            for (var i = 0; i < $("span.eleName").length; i++) {
                var content = $("span.eleName").eq(i).html();
                var value = content.substring(0, 4);
                $("span.eleName").eq(i).html(value);
                $("span.eleName").eq(i).attr('title', content);
            }
        };

        //初始化设定规则页面
        function show(eleRuleDetailId, seteleRuleId, setchrName, setchrCode, setchrId, callback) {
            onCloseCallback = callback;
            //清除缓存
            viewModel.rule_code("");
            viewModel.rule_name("");
            viewModel.rule_id("");
            viewModel.ruleDataTable.clear();
            viewModel.groupDataTable.clear();
            viewModel.detailDataTable.clear();
            viewModel.typeDataTable.clear();
            
//            if(eleRuleDetailId){
            	//初始化设定规则页面
                $.ajax({
                    type: 'GET',
                    url: BASEPAGE_GET_URL + '?tokenid=' + ip.getTokenId() + "&ajax=" + "noCache",
                    dataType: 'json',
                    data: {"ele_rule_detail_id": eleRuleDetailId},
                    cache: false,
                    success: function (result) {
                        if (result.data) {
                            var data = result.data;
                            if (eleRuleDetailId == "" || eleRuleDetailId == null) {// 新增设定规则，eleRuleDetailId为空
                                viewModel.ele_value(setchrId);
                                viewModel.ele_code(setchrCode);
                                viewModel.ele_name(setchrName);
                                viewModel.ele_rule_id(seteleRuleId);
                            } else {// 修改设定规则
                                //获取保存后台传的数据到viewModel
                                //data[0]，后台传的数据
                                viewModel.ele_value(data[0].ele_value);
                                viewModel.ele_code(data[0].ele_code);
                                viewModel.ele_name(data[0].ele_name);
                                viewModel.rule_id(data[0].rule_id);
                                viewModel.ele_rule_id(data[0].ele_rule_id);
                                viewModel.rule_code(data[1].rule_CODE);
                                viewModel.rule_name(data[1].rule_NAME);
                                //data[1]，后台传的数据
                                viewModel.ruleDataTable.setSimpleData(data[1]);
                                var groupList = data[1].right_group_list;
                                viewModel.groupDataTable.setSimpleData(groupList);// 把所有要素放入groupDataTable
                                var detailList = data[1].right_group_list[0].detail_list;
                                viewModel.detailDataTable.setSimpleData(detailList);
                                var typeList = data[1].right_group_list[0].type_list;
                                viewModel.typeDataTable.setSimpleData(typeList);
                                // 循环获取要素列,显示页面
                                for (var i = 0; i < typeList.length; i++) {
                                    var rightType = typeList[i].right_TYPE;
                                    var row = viewModel.typeDataTable.getRow(i);//获取当前遍历的行要素
                                    // 给第i个要素权限赋值（显示中文全部部分）
                                    if (rightType) {// rightType=1为部分
                                        viewModel.typeDataTable.setValue("right_TYPE_STR", "部分", row);
                                    } else {
                                        viewModel.typeDataTable.setValue("right_TYPE_STR", "全部", row);
                                    }
                                }
                                changeEleNameLength();//截取要素名称的部分显示在页面上
                            }
                        }
                        else {// 没有得到后台数据             
                            ip.ipInfoJump("传过来的eleRuleDetailId不为空", "error");
                            viewModel.ele_value(setchrId);
                            viewModel.ele_code(setchrCode);
                            viewModel.ele_name(setchrName);
                            viewModel.ele_rule_id(seteleRuleId);
                        }
                    },
                    error: ncrd.commonAjaxError
                });
//            } else{
//            	 viewModel.ele_value(setchrId);
//                 viewModel.ele_code(setchrCode);
//                 viewModel.ele_name(setchrName);
//                 viewModel.ele_rule_id(seteleRuleId);
//            }                
        }

        // 保存按钮单击事件
        viewModel.btnSaveClick = function () {
            viewModel.saveSetRule();
        };
        // 关闭按钮单击事件
        viewModel.btnCloseClick = function () {
            if (onCloseCallback.cancel) {
                onCloseCallback.cancel();
            }
        };
        
        function showByruleId(ruleId,returnCloseFun) {           
            //关闭自定义规则的函数
        	onCloseCallback = returnCloseFun;        
        }; 
        
        function init(contanier) {
            editApp = u.createApp({
                el: contanier,
                model: viewModel
            });
            viewModel.getElemSource();
            //TODO 9.展开所有树节点？
//				var treeObj = $.fn.zTree.getZTreeObj("tree1");
//				treeObj.expandAll(true);
        }

        return {
            'model': viewModel,
            'template': template,
            'show': show,
            'init': init,
            'showByruleId': showByruleId
        };

    });


