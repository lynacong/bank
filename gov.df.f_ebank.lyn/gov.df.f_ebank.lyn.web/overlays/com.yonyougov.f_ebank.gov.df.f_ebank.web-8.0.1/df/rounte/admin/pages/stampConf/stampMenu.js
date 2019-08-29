define(['text!pages/stampConf/stampMenu.html','commonUtil',
    'jquery','bootstrap','ip','uui','tree',
    'datatables.net-bs','datatables.net-autofill-bs',
    'datatables.net-buttons-bs', 'datatables.net-colreorder',
    'datatables.net-rowreorder', 'datatables.net-select',
    'datatables.net-scroller','datatables.net-keyTable',
    'datatables.net-responsive'],function(html,commonUtil){

    var init = function (element) {
        document.title = ip.getUrlParameter("menuname");
        var treeMap = {};//操作 tree

        var viewModel = {
            tokenid : ip.getTokenId(),
            dataTable : new u.DataTable({
                    meta : {
                        'menu_id' : {
                            'value' : ""
                        },
                        'parent_id' : {
                            'value' : ""
                        },
                        'menu_code' : {
                            'value' : ""
                        },
                        'menu_name' : {
                            'value' : ""
                        }
                    }
                }),
                treeSetting : {
                    callback : {
                        onClick : zTreeOnClick,
                        beforeClick : zTreeBeforeClick

                    }
                }
        };

        function zTreeBeforeClick(event, treeId, treeNode, clickFlag) {}
        function zTreeOnClick(event, treeId, treeNode, clickFlag) {}

        viewModel.getData = function(){
            $.ajax({
                url : "/df/f_ebank/stampMenu/getMenuList?tokenid="
                    + viewModel.tokenid,
                type : "POST",
                dataType : "json",
                data : {
                    "ajax" : "nocache"},
                success : function(datas) {
                    if (datas.errorCode == "0") {
                        $('#subSystemGrid').DataTable( {
                            destroy: true,
                            searching: true,
                            paging: true,
                            bSort: false,
                            bInfo: true,
                            bLengthChange: true,
                            iDisplayLength: 10,
                            scrollY:$("#tableAcc").innerHeight()-135 + "px",
                            select: {
                                style: 'single',
                            },
                            lengthMenu: [
                                [ 10, 25,50, 100, 200,2000],
                                [ '10', '25','50', '100', '200','2000']
                            ],
                            dom: //f:filtering input
                                '<\'row\'<\'col-xs-4\'><\'col-xs-5\'><\'col-xs-3 search-input\'f>>' +
                                't' +   //t:表格
                                //一行内: i:Table information summary,p:pagination control,l:length changing input control
                                '<\'row\'<\'col-xs-4\'i><\'col-xs-6\'p><\'col-xs-2 pub-page\'l>>' +
                                '<\'row\'<\'#mytool.col-xs-6\'>r>',
                            language: {
                                'lengthMenu': '每页_MENU_条 ',
                                'info': '从 _START_ 到 _END_ /共 _TOTAL_ 条数据',
                                'infoEmpty': '',
                                'infoFiltered': '(从 _MAX_ 条数据中检索)',
                                'zeroRecords': '没有检索到数据',
                                'search': '查询',
                                'paginate': {
                                    'first': '首页',
                                    'previous': ' < ',
                                    'next': ' >',
                                    'last': '尾页'
                                },
                                select: {
                                    rows: {
                                        _: '%d行被选中',
                                        0: ''
                                    }
                                }
                            },
                            data:datas.dataDetail,
                            columnDefs:[{
                                "targets": [ 0,3],
                                "visible": false
                            }],
                            columns: [
                                { data: 'menu_id'},
                                { data: 'addr_chr_code'},
                                { data: 'btn_id'},
                                { data: 'parent_id' },
                                { data: 'menu_code'},
                                { data: 'menu_name'}
                            ],
                            "fnDrawCallback": function() {
                                //添加跳转到指定页
                                // showSpecificPageCom("subSystemGrid");
                            }
                        } );
                    } else {
                        ip.warnJumpMsg("加载Grid失败！原因："+ datas.result,0,0,true);
                    }
                }
            });
        }

        //按钮方法 刷新
        refreshBtn = function(){
            viewModel.getData();
            ip.ipInfoJump("刷新成功！","success");
        }


        //标识 新增或编辑
        var type ;

        //按钮 增加
        addBtn = function() {
            type = 0;
            $("#titleText").text("新增菜单信息");
            $("#menu_id").val("");
            $("#addr_chr_code").val("");
            $("#btn_id").val("");
            $("#parent_id").val("");
            $("#menu_code").val("");
            $("#menu_name").val("");


            $('#accSetModel').modal('show');
        };

        //旧数据
        var old = {};
        //编辑 按钮
        editBtn = function(){
            type = 1;
            $("#titleText").text("编辑菜单信息");
            var rows = $('#subSystemGrid').DataTable().rows('.selected');
            if(rows.indexes().length!=1){
                ip.warnJumpMsg("请选择一条数据数据！",0,0,true);
                return;
            }else{
                var o = rows.data()[0];
                $("#menu_id").val(o.menu_id);
                $("#addr_chr_code").val(o.addr_chr_code);
                $("#btn_id").val(o.btn_id);
                $("#parent_id").val(o.parent_id);
                $("#menu_code").val(o.menu_code);
                $("#menu_name").val(o.menu_name);
                old.menu_id = o.menu_id;
                old.addr_chr_code = o.addr_chr_code;
                old.btn_id = o.btn_id;
            }

            $('#accSetModel').modal('show');
        }

        //按钮  删除
        deleteBtn = function () {
            var rows = $('#subSystemGrid').DataTable().rows('.selected');
            if(rows.indexes().length<1){
                ip.warnJumpMsg("请先选择数据！",0,0,true);
                return;
            }
            var param = rows.data()[0];
            //addr_chr_code 和 menu_id确定唯一一条
            if (!param.addr_chr_code  || !param.menu_id ) {
                ip.warnJumpMsg("本条数据不符合删除规则！",0,0,true);
                return ;
            }

            param.ajax = "nocache";
            ip.warnJumpMsg("确定删除记录吗？", "sid", "cCla");
            $("#sid").on("click", function() {
                $("#config-modal").remove();
                var chr_ids = [];
                for (var i = 0; i < rows.indexes().length; i++) {
                    chr_ids.push(rows.data()[i].chr_id);
                }
                if (chr_ids.length > 0) {
                    $.ajax({
                        url : "/df/f_ebank/stampMenu/delete?tokenid="
                            + viewModel.tokenid,
                        data :param,
                        type : "POST",
                        dataType : "json",
                        success : function(datas) {
                            if (datas.errorCode == "0") {
                                ip.ipInfoJump(datas.result, "success");
                                viewModel.getData();
                            } else {
                                ip.warnJumpMsg("删除失败，原因："+ datas.result,0,0,true);
                            }
                        }
                    });
                }
            });
            $(".cCla").on("click", function() {
                $("#config-modal").remove();
            });
        }

        //代表menu 树是否加载
        var is = false;
        //弹框显示菜单
        getMenu = function () {
            $('#wizardModal').modal('show');
            if (!is) {
                app = u.createApp({
                    el : element,
                    model : viewModel
                });
                $.ajax({
                    url : "/df/f_ebank/stampMenu/getSysMenu?tokenid="
                        + viewModel.tokenid,
                    type : "POST",
                    dataType : "json",
                    data : {
                        "ajax" : "nocache"
                    },
                    success : function(datas) {
                        if (datas.errorCode == "0") {
                            viewModel.dataTable.setSimpleData(datas.dataDetail);
                            is=true;
                            assemb(datas.dataDetail);
                        } else {
                            ip.warnJumpMsg("加载BankTree失败！原因："+ datas.result,0,0,true);
                        }
                    }
                });

            }
        }

        //组装成 key-value key:子节点menu_id,value:level为1级父节点
        function assemb(arr){
            var tem = {};
            for (var i = 0; i < arr.length; i++) {
                var o = arr[i];
                var parent_id = o.parent_id;
                var menu_id = o.menu_id;
                var level_num = o.level_num; //1级
                if (level_num != '1') {
                    tem[menu_id] = parent_id;
                }

            }

            for (var i = 0; i < arr.length; i++) {
                var o = arr[i];
                var menu_id = o.menu_id;
                var is_leaf = o.is_leaf; //1是子节点 ，0不是
                var parent_id = o.parent_id;

                if (is_leaf == '0') {
                    continue;
                }

                var value = tem[parent_id];
                while (tem[value]) {
                    value = tem[value];
                }
                if (!value) {
                    value = parent_id;
                }

                treeMap[menu_id] = value;
            }


        }

        treeCancel = function(){
            $('#wizardModal').modal('hide');
        }

        treeOK = function(){
            var curentRow = viewModel.dataTable.getFocusRow();
            var is_leaf = curentRow.data.is_leaf.value;
            var menu_id = curentRow.data.menu_id.value;
            var menu_name = curentRow.data.menu_name.value;
            var menu_code = curentRow.data.menu_code.value;
            var pid = treeMap[menu_id];

            if (is_leaf == '0') {
                ip.warnJumpMsg("请选择末级节点！",0,0,true)
                return ;
            }

            $('#parent_id').val(pid);
            $('#menu_id').val(menu_id);
            $('#menu_name').val(menu_name);
            $('#menu_code').val(menu_code);

            $('#wizardModal').modal('hide');
        }

        save = function(){
            var param = {};
            param.parent_id = $('#parent_id').val();
            param.menu_id = $('#menu_id').val();
            param.menu_name = $('#menu_name').val();
            param.menu_code = $('#menu_code').val();
            param.addr_chr_code = $('#addr_chr_code').val();
            param.btn_id = $('#btn_id').val();

            if (param.menu_id == null) {
                ip.warnJumpMsg("菜单名称不能为空！",0,0,true)
                return ;
            }
            if (param.addr_chr_code == null) {
                ip.warnJumpMsg("报文类型不能为空！",0,0,true)
                return ;
            }

            //新增
            if (type == 0) {

                $.ajax({
                    url : "/df/f_ebank/stampMenu/insert?tokenid="
                        + viewModel.tokenid,
                    data :param,
                    type : "POST",
                    dataType : "json",
                    success : function(datas) {
                        if (datas.errorCode == "0") {
                            ip.ipInfoJump(datas.result, "success");
                            $('#accSetModel').modal('hide');
                            viewModel.getData();
                        } else {
                            ip.warnJumpMsg("新增失败，原因："+ datas.result,0,0,true);
                        }
                    }
                });

            } else {
                param.omenu_id = old.menu_id;
                param.oaddr_chr_code = old.addr_chr_code;
                param.obtn_id = old.btn_id;
                $.ajax({
                    url : "/df/f_ebank/stampMenu/update?tokenid="
                        + viewModel.tokenid,
                    data :param,
                    type : "POST",
                    dataType : "json",
                    success : function(datas) {
                        if (datas.errorCode == "0") {
                            ip.ipInfoJump(datas.result, "success");
                            $('#accSetModel').modal('hide');
                            viewModel.getData();
                        } else {
                            ip.warnJumpMsg("修改失败，原因："+ datas.result,0,0,true);
                        }
                    }
                });
            }

        }

        $(element).html(html);

        (function () {
            viewModel.getData();

            $.ajax({
                url : "/df/f_ebank/voucherSignHandler/getVt_code.do?tokenid="
                    + viewModel.tokenid,
                type : "POST",
                dataType : "json",
                data : {
                    "ajax" : "nocache",
                },
                success : function(data) {
                    if (data.errorCode == "0") {
                        var html = "";
                        for ( var i = 0; i < data.dataDetail.length; i++) {
                            html+="<option value="+data.dataDetail[i].chr_code+">"+data.dataDetail[i].chr_name1+"</option>";
                        }
                        $("#addr_chr_code").html(html);
                    } else {
                        ip.warnJumpMsg("加载AccountType失败！原因：" + datas.result,0,0,true);
                    }
                }
            });

        })();

    }

    return {
        init:init
    }


})