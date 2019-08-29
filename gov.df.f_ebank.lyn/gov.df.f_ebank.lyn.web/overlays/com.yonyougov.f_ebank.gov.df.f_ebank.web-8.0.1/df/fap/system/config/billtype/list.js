﻿/**
 * Created by 文奔 BENcorry on 2017/3/8 0008.
 */
var mianordetail;
var from;
var to;

require(['jquery', 'knockout', '/df/fap/system/config/ncrd.js','bootstrap', 'uui', 'tree', 'grid', 'ip'],
    function ($, ko,ncrd) {
        window.ko = ko;
        var basePath = '/df/billType';
        var type = '',
            onClickBillId,
            onClickBillName,
            assData,
            //flag = true,
            comboData3,
            assRows = [],
            tokenid = ip.getTokenId(),
            oneBillData;
	    var INITTREE = basePath + '/initTree?tokenid=' + tokenid + '&ajax=' + 'noCache',
		    INITBASETYPE = basePath + '/initBaseType?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INITCOA = basePath + '/initCOA?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INITNORULE = basePath + '/initBillnorule?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INITMASTER = basePath + '/initMasterlist?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INITDETAIL = basePath + '/initDetaillist?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INITBILLTYPE = basePath + '/initBilltype?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INITASS = basePath + '/initassistElements?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INITVALUESET = basePath + '/initvalueset?tokenid=' + tokenid + '&ajax=' + 'noCache',
			FINDSYSBYBILL = '/df/billNoRule/findSysRulesByBillNoRuleId.do?tokenid=' + tokenid + '&ajax=' + 'noCache',
			FINDNAMEBYCODE = basePath + '/findFieldNameByFieldCode?tokenid=' + tokenid + '&ajax=' + 'noCache',
			FINDONEBILL = basePath + '/findOneByBillTypeId?tokenid=' + tokenid + '&ajax=' + 'noCache',
			DELETE = basePath + '/delete?tokenid=' + tokenid + '&ajax=' + 'noCache',
			INSERTORUPDATE = basePath + '/insertOrUpdate?tokenid=' + tokenid + '&ajax=' + 'noCache';
        var viewModel = {
            flag : ko.observable(''),
            nameValue : ko.observable(""),
            //data : ko.observable({}),
            //下拉选择
            COA : ko.observableArray([{coa_name : '请选择',coa_id  : ''}]),
            sys : ko.observableArray([{sys_name  : '请选择',sys_id  : ''}]),
            billType : ko.observableArray([{table_name  : '请选择',table_code  : ''}]),
            billNoRule : ko.observableArray([{billnorule_name  : '请选择',billnorule_id  : ''}]),
            busVouType : ko.observableArray([{vou_type_name  : '请选择',vou_type_id  : ''}]),
            vouControl : ko.observableArray([{sum_type_name : '请选择',sum_type_id : ''}]),
            fromBillType : ko.observableArray([{billtype_name : '请选择',billtype_id : ''}]),
            toBillType : ko.observableArray([{billtype_name : '请选择',billtype_id : ''}]),
            printType : ko.observableArray([{printTypeName : '请选择',printTypeId : ''}]),
            selectType:ko.observableArray([{printTypeName:'请选择'}]),
            //获取输入框内的值
            billNameIN:ko.observable(''),
            billNoIN:ko.observable(''),
            billNoInAdd : ko.observable(''),
            billNameInAdd : ko.observable(''),
            busVouTypeIN : ko.observable(''),
            toBillTypeIN : ko.observable(''),
            busVouTypeAdd : ko.observable(''),
            toBillTypeAdd : ko.observable(''),
            fromBillTypeIN :ko.observable(''),
            fromBillTypeAdd :ko.observable(''),
            billNoRuleIN : ko.observable(''),
            billNoRuleAdd : ko.observable(''),
            billTypeIN : ko.observable(''),
            billTypeAdd : ko.observable(''),
            vouControlIN : ko.observable(''),
            vouControlAdd : ko.observable(''),
            COAIN : ko.observable(''),
            COAAdd : ko.observable(''),
            sysIN : ko.observable(''),
            sysAdd : ko.observable(''),
            yieldIN:ko.observable(''),
            yieldAdd:ko.observable(''),
            sysName:ko.observable(''),
            COAName:ko.observable(''),
            billTypeName:ko.observable(''),
            billNoRuleName:ko.observable(''),
            fromBillTypeName:ko.observable(''),
            toBillTypeName:ko.observable(''),
            busVouTypeName:ko.observable(''),
            vouControlName:ko.observable(''),
            radioIn : ko.observable(''),
            radioAdd : ko.observable(''),
            checkboxIn : ko.observableArray([]),
            checkboxOneAdd : ko.observable(''),
            checkboxTwoAdd : ko.observable(''),
            //nameC : ko.observable(''),
            //方法函数
            deleteBillRow : function () {},
            treeKeyWord : ko.observable(''),
            findTree : function () {
                ncrd.findTreeNode($.fn.zTree.getZTreeObj("tree"),viewModel.treeKeyWord());
            },
            getNodeInTree : '',
            listDown : '',
            deletePrintRow :'',
            billInfo : '',
            treeList : '',
            delBillType :'',
            editBill :'',
            addBill :'',
            addCusRoleRow : '',
            deleteCusRoleRow :'',
            getEditForm : '',
            saveAllEdit : '',
            saveAdd : '',
            validFormAdd : '',
            showNull : '',
            addPrintRow :'',
            sysListDown : '',
            //初始化数据
            intiAss : '',
            initCOA : '',
            initNoRule : '',
            initMaster :'',
            initDetail : '',
            initAssist : '',
            initValueSet : '',
            loadEditNoRule : '',
            btnEditNoClick : '',
            btnEditRuleClick :'',
            btnReport : '',
            canWrite:ko.observable(false),
            getAddForm : function () {},
            renewAss : function () {
                viewModel.assistDataTableAdd.addSimpleData(assData);
            },
			rowIndex : function (obj) {
                var index = obj.rowIndex + 1;
                obj.element.innerHTML = index;
                ko.applyBindings(viewModel, obj.element);
            },
            showTrue : function(obj){
            	var state = '√';
            	obj.element.innerHTML = state;
            	ko.applyBindings(viewModel, obj.element);
            },
            toS : function(obj){
            	if(obj===true){
            		return "1";
            	}else{
            		return "0";
            	}
            },
            toB : function(obj){
            	if(obj=="1"){
            		return true;
            	}else{
            		return false;
            	}
            },
			changeValue : function (obj) {
                var value = viewModel.billRuleTypeToS(obj.value);
                obj.element.innerHTML = value;
                ko.applyBindings(viewModel, obj.element);
            },
            //中文名
            //changeNameC : function(obj){
            	//var value = viewModel.nameC();
            	//obj.element.innerHTML = value;
            	//ko.applyBindings(viewModel,obj.element);
            //},
            //单号规则类型判断
            billRuleTypeToS : function(obj){
            	if(obj=='0'){return '变量';}
            	else if(obj=='1'){return '日期';}
            	else if(obj=='2'){return '要素';}
            	else if(obj=='3'){return '要素自增序列';}
            	else{return '';};
            },
            //数组去重
            unique : function(arr){
            	var result = [],isRepeated;
            	for(var i=0;i<arr.length;i++){
            		isRepeated = false;
            		for(var j=0;j<result.length;j++){
            			if(arr[i]==result[j]){
            				isRepeated = true;
            				break;
            			}
            		}
            		if(!isRepeated){
            			result.push(arr[i]);
            		}
            	}
            	return result;
            },
            unique2 : function(arr){
            	return arr.sort().join(",,").replace(/(,|^)([^,]+)(,,\2)+(,|$)/g,"$1$2$4").replace(/,,+/g,",").replace(/,$/,"").split(",");
            },
            unique3 : function(arr){
            	var result = [],isRepeated;
            	for(var i=0;i<arr.length;i++){
            		isRepeated = false;
            		for(var j=0;j<result.length;j++){
            			if(arr[i].value==result[j].value){
            				isRepeated = true;
            				break;
            			}
            		}
            		if(!isRepeated){
            			result.push(arr[i]);
            		}
            	}
            	return result;
            },
            grid : {
            	ruleGrid : function(){
            		viewModel.cusRoleDataTableAdd.onRowFocus(function(){
            			var row = viewModel.cusRoleDataTableAdd.getFocusRow();
                		/*if(viewModel.cusRoleDataTableAdd.meta.valueset_type==0){
                			row.setValue('ele_rule_id','');
                		}else{
                			row.setValue('default_value','');
                		}*/
            		});
            	}
            },
            //树表结构
            treeSetting:{
                view:{
                    showLine:false,
                    selectedMulti:false
                },
                data : {
                    simpleData : {
                        enable : true,
                        idKey : 'id',
                        pIdKey : 'pId',
                        rootPId : 'null'
                    }
                },
                callback:{
                    onClick:function(e,id,node){
                        onClickBillId = node.billtype_id;
                        onClickBillName = node.title;
                        viewModel.nameValue(node.name);
                        viewModel.billInfo();
                    }
                }
            },
            comItemsPrint:[],
            comItemsAssis:[{
                "value": "-1",
                "name": "底级"
            }, {
                "value": "1",
                "name": "一级"
            }, {
                "value": "2",
                "name": "二级"
            }, {
                "value": "3",
                "name": "三级"
            }, {
                "value": "4",
                "name": "四级"
            }, {
                "value": "5",
                "name": "五级"
            }, {
                "value": "6",
                "name": "六级"
            }, {
                "value": "7",
                "name": "七级"
            }, {
                "value": "8",
                "name": "八级"
            }, {
                "value": "9",
                "name": "九级"
            }],
            comItemsSearch1 :ko.observableArray([]),
            comItemsSearch2 :[{
                "value": "0",
                "name": "指定默认值"
            }, {
                "value": "1",
                "name": "规则授权"
            }],
            comItemsSearch3 :ko.observableArray([]),
            treeDataTable: new u.DataTable({//左边树的dataTable
                meta: {
                    'tree_id': {
                        'value':""
                    },
                    'tree_pid': {
                        'value':""
                    },
                    'title':{
                        'value':""
                    }
                }
            }),
            printDataTable : new u.DataTable({//打印模板
                meta : {
                    'index' : {
                        'value' : ''
                    },
                    'report_name' : {
                        'value' : ''
                    },
                    'enabled' : {
                        'value' : ''
                    },
                    'is_default' : {
                        'value' : ''
                    }
                }
            }),
            assistDataTable : new u.DataTable({//辅助要素设置
                meta : {
                    'index' : {
                        'value' : ''
                    },
                    'enabled' : {
                        'value' : ''
                    },
                    'ele_code' : {
                        'value' : ''
                    },
                    'ele_name' : {
                        'value' : ''
                    },
                    'level_num' : {
                        'value' :''
                    },
                    'billtype_id' : {
                        'value' : ''
                    }
                }
            }),
            cusRoleDataTable : new u.DataTable({//查看定制规则
                meta : {
                    'index' : {
                        'value' : ''
                    },
                    'field_code' : {
                        'value' : ''
                    },
                    'field_name' : {
                        'value' : ''
                    },
                    'valueset_type' : {
                        'value' : ''
                    },
                    'default_value' : {
                        'value' :''
                    },
                    'ele_rule_name' : {
                        'value' : ''
                    },
                    'ele_rule_code' : {
                        'value' : ''
                    }
                }
            }),
            noRoleDataTable : new u.DataTable({//查看单号规则
                meta : {
                    'line_no' : {
                        'value' : ''
                    },
                    'line_type' : {
                        'value' : ''
                    },
                    'ele_code' : {
                        'value' : ''
                    },
                    'line_format' : {
                        'value' : ''
                    },
                    'level_num' : {
                        'value' :''
                    },
                    'init_value' : {
                        'value' :''
                    }
                }
            }),
            printDataTableAdd : new u.DataTable({//打印模板edit
                meta : {
                    'index' : {
                        'value' : ''
                    },
                    'report_name' : {
                        'value' : ''
                    },
                    'is_default' : {
                        'value' : ''
                    },
                    'arg_list' : {
                        'value' : ''
                    },
                    'para_list' : {
                        'value' : ''
                    },
                    'display_order' : {
                        'value' : ''
                    },
                    'enabled' : {
                        'value' : ''
                    },
                    'set_year' : {
                        'value' : ''
                    },
                    'report_id' : {
                        'value' : ''
                    }
                }
            }),
            assistDataTableAdd : new u.DataTable({//辅助要素设置edit
                meta : {
                    'index' : {
                        'value' : ''
                    },
                    'enabled' : {
                        'value' : ''
                    },

                    'ele_code' : {
                        'value' : ''
                    },
                    'ele_name' : {
                        'value' : ''
                    },
                    'level_num' : {
                        'value' :''
                    },
                    'rg_code' : {
                        'value' :''
                    },
                    'set_year' : {
                        'value' :''
                    },
                    'disp_order' : {
                        'value' : ''
                    }
                }
            }),
            cusRoleDataTableAdd : new u.DataTable({//查看定制规则edit
                meta : {
                    'ele_rule_code' : {
                        'value' : ''
                    },
                    'field_code' : {
                        'value' : ''
                    },
                    'field_name' : {
                        'value' : ''
                    },
                    'valueset_type' : {
                        'value' : ''
                    },
                    'default_value' : {
                        'value' :''
                    },
                    'ele_rule_id' : {
                        'value' : ''
                    }/*,
                    'rg_code' : {
                        'value' : ''
                    },
                    'set_year' : {
                        'value' : ''
                    },
                    'billtype_id' : {
                        'value' : ''
                    },
                    'last_ver' : {
                        'value' : ''
                    }*/
                }
            }),
            noRoleDataTableAdd : new u.DataTable({//查看单号规则edit
                meta : {
                    'line_no' : {
                        'value' : ''
                    },
                    'line_type' : {
                        'value' : ''
                    },
                    'ele_code' : {
                        'value' : ''
                    },
                    'line_format' : {
                        'value' : ''
                    },
                    'level_num' : {
                        'value' :''
                    },
                    'init_value' : {
                        'value' :''
                    }
                }
            })
        };

        /******************************************************************************
         * 函数块
         * ******************************************************************************/
        //加载左边树数据
        viewModel.treeList = function () {
            viewModel.treeDataTable.clear();
            var data = {'flag' : null};
            $.ajax({
                type : 'GET',
                url : INITTREE,
                data : {},
                dataType : 'json',
                success : function(map) {
                    viewModel.treeDataTable.setSimpleData(map.data);
                    var treeObj = $.fn.zTree.getZTreeObj("tree");
                    var nodes = treeObj.getNodesByParam("title", viewModel.billNoInAdd()+' '+viewModel.billNameInAdd(), null);
                    if(nodes.length==0){
                    	return;
                    }else{treeObj.selectNode(nodes[0]);}
                },
                error : function() {
                	ip.ipInfoJump('数据加载失败！','info');
                }
            });
        };

        //加载SYS、bus、vou下来列表
        viewModel.sysListDown = function () {
            $.ajax({
                type : 'GET',
                url : INITBASETYPE,
                dataType : 'json',
                success : function (map) {
                    viewModel.sys([{"sys_name": '请选择',"sys_id" : ''}].concat(map.data.sys));
                    viewModel.busVouType([{"vou_type_name"  : '请选择',"vou_type_id"  : ''}].concat(map.data.busvouTypes));
                    viewModel.vouControl([{"sum_type_name"  : '请选择',"sum_type_id"  : ''}].concat(map.data.vouControl));
                }
            });
        };

        //初始化COA下拉框
        viewModel.initCOA = function () {
            $.ajax({
                type : 'GET',
                url : INITCOA,
                dataType : 'json',
                success : function (map) {
                    viewModel.COA([{coa_name : '请选择',coa_id  : ''}].concat(map.data));
                }
            });
        };

        //初始化单号规则下拉框
        viewModel.initNoRule = function () {
            $.ajax({
                type : 'GET',
                url : INITNORULE,
                dataType : 'json',
                success : function (map) {
                    viewModel.billNoRule([{billnorule_name : '请选择',billnorule_id : ''}].concat(map.data));
                }
            });
        };

        //初始化对应主单下拉
        viewModel.initMaster = function () {
            $.ajax({
                type : 'GET',
                url : INITMASTER,
                dataType : 'json',
                success : function (map) {
                    viewModel.billType([{table_name : '请选择',table_code  : ''}].concat(map.data));
                }
            });
        };

        //初始化对应明细单下拉
        viewModel.initDetail = function () {
            $.ajax({
                type : 'GET',
                url : INITDETAIL,
                dataType : 'json',
                success : function (map) {
                    viewModel.billType([{table_name : '请选择',table_code  : ''}].concat(map.data));
                }
            });
        };

        //加载所有下拉列表
        viewModel.listDown = function () {};

        //监听radio值得改变对应主单明细单的值
        $('input[name="inlineRadioOptions"]').on('change', function () {
            viewModel.radioAdd()=='0'?viewModel.initMaster():viewModel.initDetail();
            if(viewModel.radioAdd()=='0'){
                $('#fromBillTypeEdit').attr("disabled",'disabled');
                $('#toBillTypeEdit').attr("disabled",'disabled');
            }else{
                $('#fromBillTypeEdit').removeAttr('disabled');
                $('#toBillTypeEdit').removeAttr('disabled');
            }
        });

        //根据SYS的值初始化to 和from的值
        $('#sysEdit').on('change', function () {
            var sys_id = $('#sysEdit option:selected').val();
            $.ajax({
                type : 'GET',
                data : {"sysId" : sys_id},
                url : INITBILLTYPE,
                dataType :'json',
                success : function (map) {
                    var dataTo = [{billtype_name : '请选择',billtype_id : ''}].concat(map.data);
                    var dataFrom = [{billtype_name : '请选择',billtype_id : ''}].concat(map.data);
                    viewModel.toBillType(dataTo);
                    viewModel.fromBillType(dataFrom);
                }
            });
        });
        
      //根据单号规则的值确定单号规则列表
        $('#billNoRuleEdit').on('change', function () {
            var billNoRule_id = $('#billNoRuleEdit option:selected').val();
            $.ajax({
                type : 'GET',
                data : {"billnoRuleId" : billNoRule_id},
                url : FINDSYSBYBILL,
                dataType :'json',
                success : function (map) {
                    viewModel.noRoleDataTableAdd.setSimpleData(map.data);
                }
            });
        });
        
        //初始化辅助要素的值
        viewModel.initAssist = function () {
            $.ajax({
                type : 'GET',
                url : INITASS,
                dataType : 'json',
                success : function (map) {
                	assData = map.assistElements;
                    viewModel.assistDataTableAdd.setSimpleData(map.assistElements);
                }
            });
        };
        
        //监听定值规则值得改变
        viewModel.testValueChange = function(obj) {
        	var index = obj.rowIndex;
        	var row = viewModel.cusRoleDataTableAdd.getRow(index);
        	if(obj.field=="valueset_type"){
        		if(obj.newValue=="0"){
        			//flag = true;
        			//ip.ipInfoJump('请勿输入默认值', 'info');
            	}else{
            		//flag = false;
            		//ip.ipInfoJump('请勿输入定值规则', 'info');
            	}
        	}else if(obj.field=="field_code"){
        		var data = {"fieldCode":obj.newValue};
        		$.ajax({
        			type : 'GET',
        			data : data,
                    url : FINDNAMEBYCODE,
                    dataType : 'json',
                    success : function(map){
                    	if(map.data.length == 0){
                    		//ip.ipInfoJump('未查询出中文名，请切换英文名！', 'info');
                    		row.setValue('field_name','');
                    	}else{
                    		row.setValue('field_name',map.data[0].field_name);
                    	}
                    }
        		});
        	}/*else if(obj.field=="default_value"){
        		if(flag==true){
        			obj.oldValue = '';
        			obj.newValue = '';
        		}
        	}else if(obj.field=="ele_rule_id"){
        		if(flag==false){
        			obj.newValue = '';
        		}
        	}*/
        	
        };
        viewModel.isEdit = function(obj){
        	var rowObj = obj.rowObj; // 数据行对象
        	var colIndex = obj.colIndex; // 数据列对应的index
    		if ((colIndex == 4 || colIndex ==5) && !rowObj.value["valueset_type"]){
    			ip.ipInfoJump('请先选择"处理方式"列的值！', 'info');
    			return false;
    		}
        	if (colIndex == 5){
        		return (rowObj.value["valueset_type"] == 1);
        	}else if (colIndex == 4){
        		return (rowObj.value["valueset_type"] == 0);
        	}else{
        		return true;
        	}
        }
        //加载列表下拉框数据
        viewModel.initValueSet = function () {
        	var arr = [];
            $.ajax({
                type : 'GET',
                url : INITVALUESET,
                dataType : 'json',
                success : function (map) {
                	var data1 = map.data.sysValuesetTypeList,
                        data2 = map.data.sysValuesetTypeList,
                        data3 = map.data.sysValuesetNameList;
                	var arrEn = [];
                    var arrEn = [],arrGet = [];
                    if(data1 && data1.length > 0) {
                    	for(var i = 0, l=data1.length; i < l; i++) {
                    		arrEn.push({
                				'name' : data1[i].field_code,
                    			'value': data1[i].field_code
                			});
                    	
                    }
                    	arrEn = viewModel.unique3(arrEn);
                    	$.each(arrEn,function(index,item){
                    		viewModel.comItemsSearch1.push(item);
                    	})
                }
                    if(data3 && data3.length > 0){
                    	for(var i = 0, l=data3.length; i < l; i++) {
                    		viewModel.comItemsSearch3.push({
                    			'name' : data3[i].ele_rule_name,
                    			'value': data3[i].ele_rule_id
                    		});
                    	}
                    }
                    //解决grid下拉框显示问题
                    viewModel.comItemsSearch3 = viewModel.comItemsSearch3();
                    comboData3 = viewModel.comItemsSearch3;
                }
            });
        };

        //点击左边树节点显示右边数据
        viewModel.billInfo = function () {
            var billId = onClickBillId;
            var data = {'billTypeId' : billId};
            if(onClickBillId==''||onClickBillId=='1'||onClickBillId=='2'||onClickBillId=='0'||onClickBillId==undefined){
                return 0;
            }else{
                $.ajax({
                    type : "GET",
                    url : FINDONEBILL,
                    data : data,
                    dataType : "json",
                    success : function(map){
                        oneBillData = map;
                        if(map.errorCode == '0'){
                        	 map.data.billtype_class=='0'?main():detail();
                        	 findFromAndTo(map.data.sys_id);
                        	 mianordetail=map.data.table_name;
                        	 from=map.data.from_billtype_id;
                        	 to=map.data.to_billtype_id;
                        	 
                        	 
                        	viewModel.billNameIN(map.data.billtype_name);
                            viewModel.billNoIN(map.data.billtype_code);
                            viewModel.sysIN(map.data.sys_id);
                            viewModel.COAIN(map.data.coa_id);
//                            viewModel.billTypeIN(map.data.table_name);
                            viewModel.billNoRuleIN(map.data.billnorule_id);
                            viewModel.yieldIN(map.data.field_name);
//                            viewModel.fromBillTypeIN(map.data.from_billtype_id);
//                            viewModel.toBillTypeIN(map.data.to_billtype_id);
                            
                            
                            viewModel.busVouTypeIN(map.data.busvou_type_id);
                            viewModel.vouControlIN(map.data.vou_control_id);
                            viewModel.radioIn(map.data.billtype_class);
                            viewModel.checkboxOneAdd(viewModel.toB(map.data.enabled));
                            viewModel.checkboxTwoAdd(viewModel.toB(map.data.is_needchecknobudget));
                            viewModel.printDataTable.setSimpleData(map.data.report);
                            viewModel.assistDataTable.setSimpleData(map.data.assele);
                            viewModel.cusRoleDataTable.setSimpleData(map.data.valueset);
                            viewModel.noRoleDataTable.setSimpleData(map.data.billnorulelinr);
                           
                        }else{
                        	ip.ipInfoJump(map.errorMsg, 'error');
                        }
                        
                    },
                    error : function(){
                    	ip.ipInfoJump('数据加载失败！', 'info');
                    }
                });
               
            }
        };
       
        //删除树节点
        viewModel.delBillType = function () {
            var data = {'billTypeId' : onClickBillId};
            if(onClickBillId==''||onClickBillId=='1'||onClickBillId=='2'||onClickBillId=='0'||onClickBillId==undefined){
            	ip.ipInfoJump('请选择你要删除的单据！', 'info');
            }else {
            	ip.warnJumpMsg('是否删除'+onClickBillName,"delConfirmSureId","delConfirmCancelCla");
            	$('#delConfirmSureId').on('click',function(){
            		$('#config-modal').remove();
            		$.ajax({
                        type : 'GET',
                        url : DELETE,
                        data : data,
                        dataType : "json",
                        success : function (map) {
                            if(map.errorCode == '0'){
                            	ip.ipInfoJump('删除成功','success');
                                init();
                            }else if(map.errorCode =='-4'){
                            	ip.ipInfoJump('存在重复','info');
                            }else{
                            	ip.ipInfoJump('删除失败','error');
                            }
                        }
                    });
            	});
            	$('.delConfirmCancelCla').on('click',function(){
            		$('#config-modal').remove();
            		//ip.ipInfoJump('已取消删除','info');
            	})
            }
            	
        };

        //验证表单数据
        viewModel.validFormAdd = function () {
            if(viewModel.billNoInAdd()==''||viewModel.billNoInAdd()=='单据类型编号为必填'||viewModel.billNameInAdd()==''||viewModel.billNameInAdd()=='单据类型名称为必填'){
                return false;
            }else{
                return true;
            }
        };

        //点击新增按钮
        viewModel.addBill = function () {
        	/*viewModel.initMaster();*/
        	viewModel.billTypeIN('');
        	viewModel.fromBillTypeIN('');
            viewModel.toBillTypeIN('');
            viewModel.initAssist();//youbha 新增初始化要素设置
            onClickBillId = '';
            viewModel.billNoInAdd('');
            viewModel.billNameInAdd('');
            viewModel.checkboxOneAdd(false);
            viewModel.checkboxTwoAdd (false);
            viewModel.radioAdd('0');
            viewModel.yieldAdd('');
            viewModel.sysAdd('');
            viewModel.COAAdd('');
            viewModel.billTypeAdd('');
            viewModel.billNoRuleAdd('');
            viewModel.yieldAdd('');
            viewModel.fromBillTypeAdd('');
            viewModel.toBillTypeAdd('');
            viewModel.busVouTypeAdd('');
            viewModel.vouControlAdd('');
            viewModel.billType([{table_name : '请选择',table_code  : ''}]);
            viewModel.fromBillType([{billtype_name : '请选择',billtype_id : ''}]);
            viewModel.toBillType([{billtype_name : '请选择',billtype_id : ''}]);
            viewModel.initMaster();
            viewModel.printDataTableAdd.clear();
            viewModel.assistDataTableAdd.clear();
            viewModel.assistDataTableAdd.setSimpleData(assData);
            viewModel.cusRoleDataTableAdd.clear();
            viewModel.noRoleDataTableAdd.clear();
            $('#assEdit').hide();
        };

        //点击修改按钮
        viewModel.editBill = function () {
        	/* viewModel.initMaster();*/
            if(onClickBillId==''||onClickBillId=='1'||onClickBillId=='2'||onClickBillId=='0'||onClickBillId==undefined){
            	ip.ipInfoJump('请先选择所需要修改的单据!','info');
                $('#editBill').attr('data-toggle','');
            }else {
                $('#editBill').attr('data-toggle','modal');
                var data = {'billTypeId' : onClickBillId};
                $.ajax({
                    type : 'GET',
                    url : FINDONEBILL,
                    data : data,
                    dataType : 'json',
                    success : function (map) {
                    	if(map.errorCode == '0'){
                    		 //viewModel.radioAdd()=='0'?viewModel.initMaster():viewModel.initDetail();
                    		/*map.data.billtype_class=='0'?viewModel.initMaster():viewModel.initDetail();*/
                    		 map.data.billtype_class=='0'?main():detail();
                        	 findFromAndTo(map.data.sys_id);
                        	 mianordetail=map.data.table_name;
                        	 from=map.data.from_billtype_id;
                        	 to=map.data.to_billtype_id;
                        	 
                    		viewModel.billNameInAdd(map.data.billtype_name);
                            viewModel.billNoInAdd(map.data.billtype_code);
                            viewModel.sysAdd(map.data.sys_id);
                            viewModel.COAAdd(map.data.coa_id);
                            viewModel.billTypeAdd(map.data.table_name);
                            /*viewModel.radioAdd()=='0'?viewModel.initMaster():viewModel.initDetail();*/
              
                            viewModel.billNoRuleAdd(map.data.billnorule_id);
                            viewModel.yieldAdd(map.data.field_name);
                            viewModel.fromBillTypeAdd(map.data.from_billtype_id);
                            viewModel.toBillTypeAdd(map.data.to_billtype_id);
                            viewModel.busVouTypeAdd(map.data.busvou_type_id);
                            viewModel.vouControlAdd(map.data.vou_control_id);
                            viewModel.radioAdd(map.data.billtype_class);
                            viewModel.checkboxOneAdd(viewModel.toB(map.data.enabled));
                            viewModel.checkboxTwoAdd(viewModel.toB(map.data.is_needchecknobudget));
                            //if(map.data.sys_id==null){
                               // $('#sysEdit option[value=""]').text('');
                               // $('#fromBillTypeEdit option[value=""]').text('');
                               // $('#toBillTypeEdit option[value=""]').text('');
                            //}
                           
                            viewModel.printDataTableAdd.setSimpleData(map.data.report);
                            var assData2 = map.data.assele;
                            var len1 = assData.length;
                            var len2 = assData2.length;
                            for(var i=0;i<len2;i++){
                            	for(var j=0;j<len1;j++){
                            		if(assData[j].ele_name==assData2[i].ele_name){
                            			assData[j].enabled = 'Y';
                            			assData[j].level_num = assData2[i].level_num;//youbha
                            		}
                            	}
                            }
                            viewModel.assistDataTableAdd.setSimpleData(assData);
                            for(var t=0;t<assRows.length;t++){
                            	assRows[t].setValue('enabled','Y');
                            }
                            viewModel.cusRoleDataTableAdd.setSimpleData(map.data.valueset);
                            viewModel.noRoleDataTableAdd.setSimpleData(map.data.billnorulelinr);
                    	}else{
                    		ip.ipInfoJump(map.errorMsg,'error');
                    	}
                        
                    }
                });
                $('#assEdit').show();
            }
        };

        //获取form信息
        viewModel.getEditForm = function () {
            var editFormData = new FormData('#editForm');
            return editFormData;
        };

        //获取辅助要素的data
        viewModel.getAss = function (){
            var assData = viewModel.assistDataTableAdd.getSimpleData(),
                num;
            var arr = [];
            for(num in assData){
                if(assData[num].enabled=='Y'){
                    arr.push(assData[num]);
                }
            }
            return arr;
        };
        //保存新增的信息
        viewModel.saveAdd = function () {
            var data = {
                "printData" : JSON.stringify(viewModel.printDataTableAdd.getSimpleData()),
                "assistData" : JSON.stringify(viewModel.getAss()),
                "cusRoleData":  JSON.stringify(viewModel.cusRoleDataTableAdd.getSimpleData()),
                "noRoleData" : JSON.stringify(viewModel.noRoleDataTableAdd.getSimpleData()),
                "billTypeName" :  viewModel.billNameInAdd(),
                "billTypeCode" : viewModel.billNoInAdd(),
                "enabled": viewModel.toS(viewModel.checkboxOneAdd()),
                "isNeedCheckNoBudget" : viewModel.toS(viewModel.checkboxTwoAdd()),
                "billTypeClass" : viewModel.radioAdd(),
                "fieldName" : viewModel.yieldAdd(),
                "tableName":$('#billTypeEdit option:selected').val(),
                "sysId" : $('#sysEdit option:selected').val(),
                "coaId" :  $('#COAEdit option:selected').val(),
                "billNoRuleId" :  $('#billNoRuleEdit option:selected').val(),
                "fromBillTypeId" : $('#fromBillTypeEdit option:selected').val(),
                "toBillTypeId" : $('#toBillTypeEdit option:selected').val(),
                "busVouTypeId" : $('#busVouTypeEdit option:selected').val(),
                "vouControlId" :  $('#vouControlEdit option:selected').val(),
                "billTypeId" : onClickBillId
            };
			var msgPrinter = '';
			var pData = viewModel.printDataTableAdd.getSimpleData();
			if(pData != undefined){
				function printerIsNull(){
	            	var flag;
	            	var len = pData.length;
	            	for(var i=0;i<len;i++){
	                	if(pData[i].report_id==null||pData[i].arg_list==null||pData[i].para_list==null||pData[i].display_order==null||pData[i].is_default==null||pData[i].enabled==null){
	                		flag = false;
	                	}
	                	else{
	                		flag = true;
	                	}
	                }
	            	return flag;
	            }
	            if(printerIsNull()===false){
	            	msgPrinter = '打印模板存在未输入项';
	            }else{
					msgPrinter = '';
				}
			}
            
            if(viewModel.validFormAdd()){
                $.ajax({
                    type : 'POST',
                    url :INSERTORUPDATE,
                    data : data,
                    dataType : 'json',
                    success : function (map) {
                        if(map.errorCode === '0'){
                        	ip.ipInfoJump('保存成功！','success');
                            $('#addModal').modal('toggle');
                            viewModel.treeList();
                        }else if(map.errorCode==='-4'){
                        	ip.ipInfoJump(map.errorMsg,'error');
                        }else{
                        	ip.ipInfoJump(map.errorMsg + msgPrinter,'error');
                        }
                    }
                });
            }else{
            	ip.ipInfoJump('表单存在未输入项','info');
            }
        };

        //查看定制规则增加行
        viewModel.addCusRoleRow = function () {
            viewModel.cusRoleDataTableAdd.createEmptyRow();
        };

        //打印模板增加行
        viewModel.addPrintRow = function () {
            viewModel.printDataTableAdd.createEmptyRow();
        };

        //删除查看定制规则row
        viewModel.deleteCusRoleRow = function () {
            viewModel.deleteBillRow(viewModel.cusRoleDataTableAdd);
        };

        //删除打印模板row
        viewModel.deletePrintRow = function () {
            viewModel.deleteBillRow(viewModel.printDataTableAdd);
        };

        /* 其余方法块 */

        //清空显示列表的默认值
        //$('#billTypeNo').val('');
        //$('#billTypeName').val('');
        /********************************************************************************
         * 方法块
         * ******************************************************************************/

        //根据索引删除row
        viewModel.deleteBillRow = function (dataTable) {
            var index = dataTable.getFocusIndex();
            dataTable.removeRow(index);
            var arr1 = dataTable.getSimpleData(),arr2=[];
            if(arr1 == []){
            	return;
            }else{
            	$.each(arr1,function(index2,item){
            		if(index2 !==index){
            			arr2.push(item);
            		}
            	})
            	dataTable.setSimpleData(arr2);
            }
           
        };

        //加载定值规则编辑模块方法     !!给加载进行type分类，在执行保存时根据type进行判断执行不同的保存
        function loadEditRule(onLoaded) {
            var container = $('#editRule');
            var url = "fap/system/config/elerule/rule";
            requirejs.undef(url);
            require([url], function (module) {
                ko.cleanNode(container[0]);
                container.html('');
                container.html(module.template);
                module.init(container[0]);
                editApp = module;
                //回调
                module.model.btnSaveClick = function () {
                    type = '1';
                    onEditAppClose.save();
                };
				module.model.btnCloseClick = function(){
					onEditAppClose.cancel();
				};
                if(onLoaded){
                    onLoaded();
                }
            });
        }

        //加载单号规则编辑模块
        function loadEditNoRule(onLoaded) {
            var container = $('#editNoRule');
            var url = "fap/system/config/billno/editAdd";
            requirejs.undef(url);
            require([url], function (module) {
                ko.cleanNode(container[0]);
                container.html('');
                container.html(module.template);
                module.init(container[0]);
                editApp = module;
                //回调
                module.model.btnSaveClick = function () {
                    type = '2';
                    onEditAppClose.save();
                };
				module.model.btnCloseClick = function(){
					onEditAppClose.cancel();
				};
                if(onLoaded){
                    onLoaded();
                }
            });
        }
        //加载打印模板模块
        function loadReport(onLoaded){
            var container = $('#report');
            var url = "fap/system/config/billtype/report";
            requirejs.undef(url);
            require([url], function (module) {
                ko.cleanNode(container[0]);
                container.html('');
                container.html(module.template);
                module.init(container[0]);
                editApp = module;
                //回调
                module.model.btnSaveClick = function () {
                    type = '3';
                    onEditAppClose.save();
                };
				module.model.btnCloseClick = function(){
					onEditAppClose.cancel();
				};
                if(onLoaded){
                    onLoaded();
                }
            });
        }

        // 编辑页面关闭时的回调事件，save:保存关闭 cancel：取消关闭
        var onEditAppClose = {
            save : function() {
            	go("#billType");
                if(type =='1'){
                    var saveRuleData = {
                    		"ele_rule_id" : editApp.model.rule_name()
                    };
                    viewModel.cusRoleDataTableAdd.addSimpleData(saveRuleData);
                }else if(type=='2'){
                    var saveRuleNoData = editApp.model.editDataTable.getSimpleData();
                    viewModel.noRoleDataTableAdd.addSimpleData(saveRuleNoData);
                }else{
                    var saveReportData = editApp.model.data.treeName;
                    viewModel.printDataTableAdd.addSimpleData(saveReportData);
                }
            },
            cancel : function() {
                go("#billType");
            }
        };

        // 切换当前显示的界面
        function go(showCollapse) {
            $("div.collapse:not(" + showCollapse + ")").collapse('hide');
            $('#addModal').modal('toggle');
            $(showCollapse).collapse('show');
        }

        //编辑页面加载完成后的回调函数，需要等待编辑页面加载完才能执行的代码放在这里
        function onEditRule(billId) {
            go("#editRule");
            editApp.show(billId, onEditAppClose);
        }
        function onEditNoRule(billId) {
            go("#editNoRule");
            editApp.show(billId, onEditAppClose);
        }
        function onReport(billId) {
            go("#report");
            editApp.show(billId, onEditAppClose);
        }

        // 编辑按钮单击事件
        viewModel.btnEditNoClick = function() {
            // 要编辑的单据id
            var billId = onClickBillId;
            loadEditNoRule(onEditNoRule, billId);
        };
        viewModel.btnEditRuleClick = function() {
            // 要编辑的单据id
            //var billId = onClickBillId;
            //loadEditRule(onEditRule, billId);
        	//$("#iFrameClick").show();
        	$("#editRuleIFrame")[0].src="/df/fap/system/config/elerule/list.html?tokenid=" + tokenid;
        	go("#editRule");
        };
        $('#iFrameClick').click(function(){
        	//$("#editRuleIFrame")[0].src="/df/fap/system/config/billtype/list.html?tokenid=" + tokenid;;
        	//$('#iFrameClick').hide();
        	go("#billType");
        })
        viewModel.btnReport = function () {
            var billId = onClickBillId;
            loadReport(onReport, billId);
        };

        var listApp,
            editApp,
            init = function () {//数据初始化
                viewModel.treeList();
                viewModel.sysListDown();
                viewModel.initCOA();
                viewModel.initNoRule();
                viewModel.listDown();
                viewModel.initValueSet();
                viewModel.initAssist();
              
                $('#addModal').modal({
                	show : false,
                	backdrop : 'static'
                });
            };

        function initModel(container){
            listApp = u.createApp({
                el: container,
                model: viewModel
            });
            //tokenid = getTokenId();
            tokenid = ip.getTokenId();
        }
        initModel('div#billType');
        init();
        
        //根据系统id查询来源和去向
        var findFromAndTo=function (sys_id){
            $.ajax({
                type : 'GET',
                data : {"sysId" : sys_id},
                url : INITBILLTYPE,
                dataType :'json',
                success : function (map) {
                    var dataTo = [{billtype_name : '请选择',billtype_id : ''}].concat(map.data);
                    var dataFrom = [{billtype_name : '请选择',billtype_id : ''}].concat(map.data);
                    viewModel.toBillType(dataTo);
                    viewModel.fromBillType(dataFrom);
                    viewModel.fromBillTypeIN(from);
                    viewModel.toBillTypeIN(to);
                }
            });
        };
       
        //查询主单信息
        var main = function (){
        	 $.ajax({
                 type : 'GET',
                 url : INITMASTER,
                 dataType : 'json',
                 success : function (map) {
                     viewModel.billType([{table_name : '请选择',table_code  : ''}].concat(map.data));
                     viewModel.billTypeIN(mianordetail);
                 }
             });
        }
        
        //查询明细单内容
        var detail = function(){
        	 $.ajax({
                 type : 'GET',
                 url : INITDETAIL,
                 dataType : 'json',
                 success : function (map) {
                     viewModel.billType([{table_name : '请选择',table_code  : ''}].concat(map.data));
                     viewModel.billTypeIN(mianordetail);
                 }
             });
        }       
        
    });