define(['jquery', 'knockout','/df/fap/system/config/ncrd.js','text!fap/system/config/relation/edit._html','bootstrap', 'uui', 'tree', 'grid', 'ip'],
    function ($, ko,ncrd,template) {
        window.ko = ko;
        var SAVE_DO_URL="/df/fap/system/config/relation/save.do";
        var UPDATE_DO_URL="/df/fap/system/config/relation/update.do";
        var onCloseCallback;
        var listApp;
        var editcheckData=[];//用来存放主被控选择
        var authcode;//用来存放修改详细信息
        /**
         *eleArr用来存放修改返回的勾选数据
         * mainElement存放主控要素
         * conElement存放被控要素
         * detail接收修改主被控详细数据
         */
        var detail;
        var mainElement;
        var conElement;
        var eleArr=[];
        var elementDetail;
        /**
        关联关系数据
        */
        var viewModel = {
            availableCountries:ko.observableArray(),
            availableCountries1:ko.observableArray(),
            whenchange:function(num,data){
                if(num==0){
                    /*主控要素选择*/
                    var code_value=$("#editselect-left option:selected").val();
                    var code_text=$("#editselect-left option:selected").text();
                    if($("#editselect-left option:selected").text()=="请选择"){
                        viewModel.mainElementDataTable.clear();
                        viewModel.clearbeiCheck();
                    }else {
                        editcheckData=[];
                        mainobjId="test";
                        viewModel.clearbeiCheck();
                        codeRequest(code_text,code_value,"edittree1");
                    }
                }else{
                    /*被控要素选择*/
                    var code_value=$("#editselect-right option:selected").val();
                    var code_text=$("#editselect-right option:selected").text();
                    if($("#editselect-right option:selected").text()=="请选择"){
                        viewModel.conElementDataTable.clear();
                    }else{
                        editcheckData=[];
                        mainobjId="test";
                        var treeObj = $.fn.zTree.getZTreeObj("edittree1");
                        var nodes = treeObj.getNodes();
                        if (nodes.length>0) {
                            treeObj.selectNode(nodes[0]);
                        }
                        codeRequest(code_text,code_value,"edittree2");
                    }
                }
            },
            /*主控要素*/
            edittreeSetting1:{
                view:{
                    showLine:false,
                    selectedMulti:false
                },
                callback:{
                    /*beforeExpand:beforeExpand,*/
                    onClick: function(e, id, node){
                        if(verifyrightmesg()){
                            viewModel.zTree1OnClick();//获取被控勾选
                        }
                    }
                }
            },
            mainElementDataTable: new u.DataTable({
                meta: {
                    "chr_id": {
                        'value':""
                    },
                    "chr_code": {
                        'value':""
                    },
                    "chr_name": {
                        'value':""
                    },
                    "parent_id": {
                        'value':""
                    }
                }
            }),
            /*被控树*/
            edittreeSetting2:{
                view:{
                    showLine:false,
                    selectedMulti:false
                },
                check:{
                    enable: true,
                    chkStyle: 'checkbox',
                    chkboxType: {"Y":"s", "N":"ps"}
                },
                callback:{
                    /*beforeExpand:beforeExpand,*/
                    onCheck: function (e,id,node) {
                        verifyleftmesg(e,id,node);//判断是否选了主控
                    }
                }
            },
            conElementDataTable: new u.DataTable({
                meta: {
                    "chr_id": {
                        'value':""
                    },
                    "chr_code": {
                        'value':""
                    },
                    "chr_name": {
                        'value':""
                    },
                    "parent_id": {
                        'value':""
                    }
                }
            })
        };
        /**
        打击打开树
        */
        function beforeExpand (treeId) {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            zTree.expandAll(true);
            return false;
        }
       /**
       主被控要素数据
       */
        function codeRequest(code_text,code_value,treeId){
            var codeelementArr=[{
                "chr_id": "codeRequest",
                "chr_code": "codeRequest",
                "chr_name": code_text,
                "parent_id": "root"
            }];
           var data =  ncrd.getEleValues(code_value);
           if(data){
               for(var i=0;i<data.length;i++) {
                   var num=0;
                   if (data[i].parent_id == "") {
                       var elementTree = {
                           "chr_id": data[i].chr_id,
                           "chr_code": data[i].chr_code,
                           "chr_name": data[i].chr_name + data[i].chr_code,
                           "parent_id": "codeRequest"
                       };
                   } else {
                       for(var j=0;j<data.length;j++){
                           if(data[j].chr_id == data[i].parent_id){
                               var elementTree = {
                                   "chr_id": data[i].chr_id,
                                   "chr_code": data[i].chr_code,
                                   "chr_name": data[i].chr_name + data[i].chr_code,
                                   "parent_id": data[i].parent_id
                               };
                           }
                           else{
                               num++;
                           }
                       }
                       if(num == data.length){
                           var elementTree = {
                               "chr_id" :data[i].chr_id,
                               "parent_id" :"codeRequest",
                               "chr_name":data[i].chr_name + data[i].chr_code,
                               "chr_code": data[i].chr_code
                           };
                       }
                   }
                   codeelementArr.push(elementTree);
               }
           }
           if(treeId == "edittree1"){
               viewModel.mainElementDataTable.setSimpleData(codeelementArr);
           }else{
               viewModel.conElementDataTable.setSimpleData(codeelementArr);
           }
           beforeExpand(treeId);
           return data;
        }
        /**
        保存验证
        */
        function verifymesg(relation_code,pri_ele_code,sec_ele_code){
            var flag = 0;
            /*关联关系编码*/
            if(relation_code==''||relation_code==null){
                ip.ipInfoJump("请填写关联关系编码","info");
                flag = 1;
                return false;
            }
            /*主被控要素不能为空*/
            if($("#editselect-left option:selected").text()=="请选择"||$("#editselect-right option:selected").text()=="请选择"){
                ip.ipInfoJump("请选择主控要素或被控要素","info");
                flag = 1;
                return false;
            }
            /* 主控要素和被控要素是否相等*/
            if(pri_ele_code==sec_ele_code){
                ip.ipInfoJump("主控要素和被控要素不能相等","info");
                flag = 1;
                return false;
            }
            return true;
        }
        /**
        判断主控是否为根节点
        */
        function verifyleftmesg(event, treeId, treeNode){
            var peat=true;
            if($("#editselect-left option:selected").text()=="请选择"){
                peat=false;
            }else{
                var treeObj1 = $.fn.zTree.getZTreeObj("edittree1");
                var nodes1= treeObj1.getSelectedNodes();
                var treeObj2 = $.fn.zTree.getZTreeObj("edittree2");
                var nodes2 = treeObj2.getNodes()[0];
                var nodes3 = nodes2.children;
                if(!nodes3){
                    viewModel.clearbeiCheck();
                }
                if (nodes1.length > 0) {
                    var node = nodes1[0].getParentNode();
                    if(node==null){
                        peat=false;
                    }
                }
            }
            if(!peat){
                viewModel.clearbeiCheck();
                ip.ipInfoJump("请选择正确的主控要素","info");
            }
        }
        /**
        判断是否选了被控要素
        */
        function verifyrightmesg(){
            var treeObj1 = $.fn.zTree.getZTreeObj("edittree1");
            var nodes1= treeObj1.getSelectedNodes();
            if($("#editselect-right option:selected").text()=="请选择"){
                var nodes = treeObj1.getNodes();
                if (nodes.length>0) {
                    treeObj1.selectNode(nodes[0]);
                }
                ip.ipInfoJump("请选择正确的被控要素","info");
                return false;
            }
            return true;
        }
        /**
        清除被控勾选
        */
        viewModel.clearbeiCheck=function (){
            var treeObj2 = $.fn.zTree.getZTreeObj("edittree2");//被控要素清零
            var nodes=treeObj2.getCheckedNodes(true);
            for(var k=0;k<nodes.length;k++){
                treeObj2.checkNode(nodes[k], false, false);
            }
        };
        /**
        获取被控要素勾选
        */
        var mainobjId="test";
        var nodePnt;
        viewModel.zTree1OnClick=function() {
            var treeObj2=$.fn.zTree.getZTreeObj("edittree1");
            var node2=treeObj2.getSelectedNodes();
            var node3=node2[0].chr_code;
            var treeObj=$.fn.zTree.getZTreeObj("edittree2");
            var nodes=treeObj.getCheckedNodes(true);
            if (node2.length > 0) {
                nodePnt = node2[0].getParentNode();
            }
            if(authcode.relation_code){
                if(authcode.pri_ele_code == $("#editselect-left option:selected").val()&&authcode.sec_ele_code == $("#editselect-right option:selected").val()){
                    var sec_ele_code = viewModel.eleRemove("edittree2");
                    var editObj={
                        "pri_ele_value": mainobjId,
                        "sec_ele_value": sec_ele_code
                    };
                    addtreebei(elementDetail,editObj,nodePnt);
                    removetree(elementDetail,"test");
                    for(var a=0;a<nodes.length;a++){
                        treeObj.checkNode(nodes[a], false, false);
                    }
                    var checked=checkedagain(elementDetail,treeObj,node3);//重新勾选
                    var sec_ele_code1 = viewModel.eleRemove("edittree2");
                    viewModel.delBugCheched(sec_ele_code1,checked);
                }else{
                    var sec_ele_code = viewModel.eleRemove("edittree2");
                    var editObj={
                        "pri_ele_value": mainobjId,
                        "sec_ele_value": sec_ele_code
                    };
                    addtreebei(editcheckData,editObj,nodePnt);
                    removetree(editcheckData,"test");//删除id为test的
                    /*每次变换清除勾选*/
                    for(var a=0;a<nodes.length;a++){
                        treeObj.checkNode(nodes[a], false, false);
                    }
                    var checked=checkedagain(editcheckData,treeObj,node3);//重新勾选
                    var sec_ele_code1 = viewModel.eleRemove("edittree2");
                    viewModel.delBugCheched(sec_ele_code1,checked);
                }
            }else{
                var sec_ele_code = viewModel.eleRemove("edittree2");
                var editObj={
                    "pri_ele_value": mainobjId,
                    "sec_ele_value": sec_ele_code
                };
                addtreebei(editcheckData,editObj,nodePnt);
                removetree(editcheckData,"test");//删除id为test的
                /*每次变换清除勾选*/
                for(var a=0;a<nodes.length;a++){
                    treeObj.checkNode(nodes[a], false, false);
                }
                var checked=checkedagain(editcheckData,treeObj,node3);//重新勾选
                var sec_ele_code1 = viewModel.eleRemove("edittree2");
                viewModel.delBugCheched(sec_ele_code1,checked);
            }
            mainobjId=node3;//赋值
        };
        /**
        获取勾选数组并保存
         e 新增或者修改保存的数组
         editObj 要保存的一对多主被关系
         nodePnt 判断选择的主控是否是根节点
        */
        function addtreebei(e,editObj1,nodePnt){
            var repeat=false;
            for(var i=0;i<e.length;i++){
                if(mainobjId == e[i].pri_ele_value){
                    e.splice(i,1);
                    e.push(editObj1);
                    repeat=true;
                    break;
                }
            }
            if(!repeat){
                if(nodePnt==null){

                }else{
                    e.push(editObj1);
                }
            }
        }
        /**
        删除数组元素的
         e 元素存在的数组
         treeid 要删除的元素
        */
        function removetree(e,treeid){
            for(var i=0; i< e.length;i++){
                if(e[i].pri_ele_value == treeid){
                    e.splice(i,1);
                }
            }
        }
        /**
        重新勾选
         e 判断新增修改储存数组
         treeObj 被控勾选树的id
         node3 主控树选择的节点chr_code
         */
        function checkedagain(e,treeObj,node3){
        	var pri_element_list = viewModel.conElementDataTable.getSimpleData();
        	console.log(pri_element_list);
            for(var k=0;k<e.length;k++){
                if(e[k].pri_ele_value == node3){
                    for(var j=0;j<e[k].sec_ele_value.length;j++){
                    	for(var i=0;i<pri_element_list.length;i++){
                    		if(pri_element_list[i].chr_code == e[k].sec_ele_value[j]){
                    			treeObj.checkNode(treeObj.getNodeByParam("chr_id",pri_element_list[i].chr_id,null),true,true);
                    		}
                    	}
                    }
                    return e[k].sec_ele_value;
                }
            }
        }

        /**
         * 取消重新勾选
         */
        viewModel.delBugCheched=function(m,n){
            var treeObj=$.fn.zTree.getZTreeObj("edittree2");
            var nodes=[];
            for(var i=0;i< m.length;i++){
                var peat=false;
                for(var j=0;j< n.length;j++){
                    if(m[i]==n[j]){
                        peat=true;
                        break;
                    }
                }
                if(!peat){
                    nodes.push(m[i]);
                }
            }
            for(var k=0;k<nodes.length;k++){
                treeObj.checkNode(treeObj.getNodeByParam("chr_code",nodes[k],null),false,false);
            }
        };
        /**
        被控要素勾选去除半勾选及根节点
         参数treeId 树的id
        */
        viewModel.eleRemove=function(treeId){
            var treeObj1=$.fn.zTree.getZTreeObj(treeId);
            var nodeRemovepnt=treeObj1.getCheckedNodes(true);
            var nodeId=[];
            for(var c=0;c<nodeRemovepnt.length;c++){
                var nodebeiId=nodeRemovepnt[c].chr_code;
                if(nodebeiId == "codeRequest"){

                }else{
                    nodeId.push(nodebeiId);
                }
            }
            return nodeId;
        };
        /**
        获取最后一条数据
         分为修改和新增  参数e接收主被控数组
        */
        viewModel.getLastmsg=function (e){
            var treeObj=$.fn.zTree.getZTreeObj("edittree1");
            var treeObj1=$.fn.zTree.getZTreeObj("edittree2");
            var nodes=treeObj1.getCheckedNodes(true);
            var node=treeObj.getSelectedNodes();
            var sec_ele_code=viewModel.eleRemove("edittree2")
            var editObj={
                "pri_ele_value": node[0].chr_code,
                "sec_ele_value": sec_ele_code
            };
            if (node.length > 0) {
                var nodePnt = node[0].getParentNode();
            }
            if(nodePnt==null){

            }else{
                addtreebei(e,editObj,nodePnt);
            }
            /*自动关联未设定要素*/
            //if(statue.checked){
            //    if(e.length != 0){
            //        for(var i=0;i<mainElement.length;i++){
            //            if(mainElement[i].chr_code !== "codeRequest"){
            //                var peat=false;
            //                for(var j=e.length-1;j>=0;j--){
            //                    if(mainElement[i].chr_code === e[j].pri_ele_value){
            //                        peat=true;
            //                        break
            //                    }
            //                }
            //                if(!peat){
            //                    relationCheck();
            //                }
            //            }
            //        }
            //    }else{
            //        for(var i=0;i<mainElement.length;i++){
            //            relationCheck();
            //        }
            //    }
            //}
        };
        /**
        下拉框默认选择
         下拉框id 默认选择的value
        */
        function selectAnyone(id,value){
            $(id).each(function(){
                if(this.value==value){
                    $(this).attr("selected","true");
                }
            })
        }
        /**
        *初始化页面
        * code 参数数组
        * 长度0 为新增 长度1为修改
        */
        function auth(code,callback){
            onCloseCallback = callback || {};
            $('.bs-example-modal-lg').modal({backdrop: "static", keyboard: false});
            editcheckData=[];
            addRequest(code);
            authcode=code;
        };
        /**
        *编辑页面数据初始化
        * @param code 参数数组
        */
        function addRequest(code){
            if (code.relation_code){
                $("#editadd").text("修改");
            	$("#edittopcode").val(code.relation_code);//给关联关系编码输入框赋值
                selectAnyone("#edittoptype option",code.relation_type);
            }
            else {
                $("#editadd").text("新增");
                $("#edittopcode").val("");//清空关联关系编码输入框
                selectAnyone("#edittoptype option",0);
                //var checkedclear=document.getElementById("checkone");
                //checkedclear.checked=false;
            }
            var data = ncrd.getEleSetList();
            viewModel.availableCountries(data);
            viewModel.availableCountries1(data);
            if (code.relation_code){
                selectAnyone("#editselect-left option",code.pri_ele_code);
                selectAnyone("#editselect-right option",code.sec_ele_code);
                detail = selectMainElement(code.chr_id);
                seleleArr();
                elementDetail = eleArr;
                codeRequest(code.pri_ele_name,code.pri_ele_code,"edittree1");
                codeRequest(code.sec_ele_name,code.sec_ele_code,"edittree2");
            }

        };
        /**
         * 通过关联关系ID查询关联关系详细
         * @param id
         */
        function selectMainElement(id) {
            var data;
            var queryData = {
                'relation_id':id,
                "ajax":"noCache"
            };
            $.ajax({
                type: 'GET',
                url: "/df/fap/system/config/relation/get.do?tokenid=" + tokenid,
                dataType: 'json',
                data:queryData,
                async:false,
                success : function(result){
                    if(result){
                        var errorCode = result.errorCode;
                        if(errorCode == 0){
                            data = result.data.row;//关联关系详细数组
                        }
                        else{

                        }
                    }
                },
                erroe: ncrd.commonAjaxError
            });
            return data;
        };
        /**
        查询关联关系详细数据处理
        */
        function seleleArr(){
            if(detail.length == 0){

            }else{
                for(var i=0;i<detail.length;i++){
                    if(detail[i].sec_ele_value == ""){
                        var sec_ele_value=[];
                        var editObj2={
                            "pri_ele_value": detail[i].pri_ele_value,
                            "sec_ele_value": sec_ele_value
                        };
                        eleArr.push(editObj2);
                    }else{
                        if(eleArr.length == 0){
                            var sec_ele_valueArr=[];
                            sec_ele_valueArr.push(detail[i].sec_ele_value);
                            var editObj2={
                                "pri_ele_value": detail[i].pri_ele_value,
                                "sec_ele_value": sec_ele_valueArr
                            };
                            eleArr.push(editObj2);
                        }else{
                            var peat=false;
                            for(var j=0;j<eleArr.length;j++){
                                if(eleArr[j].pri_ele_value === detail[i].pri_ele_value){
                                    eleArr[j].sec_ele_value.push(detail[i].sec_ele_value);
                                    peat=true;
                                    break;
                                }
                            }
                            if(!peat){
                                var sec_ele_valueArr=[];
                                sec_ele_valueArr.push(detail[i].sec_ele_value);
                                var editObj2={
                                    "pri_ele_value": detail[i].pri_ele_value,
                                    "sec_ele_value": sec_ele_valueArr
                                };
                                eleArr.push(editObj2);
                            }
                        }
                    }
                }
            }
        }

        /**
        保存按钮
        */
        viewModel.editsave=function(){
            var relation_code=$("#edittopcode").val();
            if(!ip.isNumber(relation_code)){
                ip.ipInfoJump("关联关系编码只能是数字","error");
                return;
            }
            var pri_ele_code=$("#editselect-left option:selected").val();
            var sec_ele_code=$("#editselect-right option:selected").val();
            var relation_type=$("#edittoptype option:selected").val();
            //var edittype='';
            if(verifymesg(relation_code,pri_ele_code,sec_ele_code)){
                                //修改
                    if(authcode.chr_id){
                        if(authcode.pri_ele_code == $("#editselect-left option:selected").val()&&authcode.sec_ele_code == $("#editselect-right option:selected").val()){
                            viewModel.getLastmsg(elementDetail);
                            editcheckData=elementDetail;
                        }else{
                            viewModel.getLastmsg(editcheckData);
                        }
                        var queryData={
                            "relation_id":authcode.chr_id,
                            "relation_code": relation_code,
                            "pri_ele_code": pri_ele_code,
                            "sec_ele_code": sec_ele_code,
                            "relation_type": relation_type,
                            "relationDetail":JSON.stringify(editcheckData),
                            "ajax":"noCache"
                        };
                        saveAjax(queryData,UPDATE_DO_URL)
                    }else{
                        //增加
                        viewModel.getLastmsg(editcheckData);
                        var queryData={
                            "relation_code": relation_code,
                            "pri_ele_code": pri_ele_code,
                            "sec_ele_code": sec_ele_code,
                            "relation_type": relation_type,
                            "relationDetail":JSON.stringify(editcheckData),
                            "ajax":"noCache"
                        };
                        saveAjax(queryData,SAVE_DO_URL);
                    }
            }
        };
        /**
         * 保存交互
         * 参数queeyData  url
         */
        function saveAjax(queryData,url){
            $.ajax({
                type : 'POST',
                url : url + '?tokenid=' + tokenid,
                data : queryData,
                dataType : 'json',
                success: function (result) {
                    if(result.errorCode == 0){
                        $('.bs-example-modal-lg').modal("hide");
                        ip.ipInfoJump("保存成功","success");
                        if(onCloseCallback.cancel){
                            onCloseCallback.cancel();
                        }
                    } else {
                    	ip.ipInfoJump(result.errorMsg, 'error');
                    }
                },
                error: ncrd.commonAjaxError
            })
        }
        /**
        关闭按钮
        */
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
        }
        return {
            'model': viewModel,
            'template': template,
            'init': init,
            'auth':auth

        };
    }
)