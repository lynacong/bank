/**
 * Created by yanqiong on 2017/3/23.
 */
define(['jquery', 'knockout', 'text!fap/system/basesetting/factorylevel/edit._html', 'grid', 'bootstrap', 'uui', 'tree', 'ip'],
  function ($, ko, template, grid) {
    window.ko = ko;
    var onCloseCallback;
    var tokenid;
    var LIST_Element_APP_DO_URL = '/df/coa/getAllElement.do';//获取当前所有启用要素信息
    var EDIT_Element_APP_DO_URL = '/df/coa/getEle.do';//根据要素简称获取要素列表（刷新树时）
    var EDIT_Element_ID_APP_DO_URL = '/df/coa/getCoa.do';//通过COA_ID读取COA对象
    var EDIT_SAVE_COA_DO_URL = '/df/coa/saveCoaDto.do';//保存COA配置
    var EDIT_UPDATA_COA_DO_URL = '/df/coa/updateCoaDto.do';//更新COA配置
    var EDIT_UPDATA_CASCADE_COA_DO_URL = '/df/coa/updateCascadeCoaDto.do';//更新COA配置(级联更新)
    var coaSaveData;//coa保存数据
    //coaID
    var coaIDSelectEle = '';
    var s = {
      coaDetailList: [], // 所有的coaDetail
      selectEleList: [], // 被选中的element列表
      coaId: '', // coaId
      activeEle: null,
      coaDto: null, //
      // 正在切换ele, 点击切换ele时,
      // 会更新级次列表, 这会触发级次change事件,
      // 同时这时select的值是第一个option的值
      // 现在不希望切换ele时触发change事件
      inChangeEle: false,
      onAllRowSelected: false,
      inInitTable: true, // 正在初始化table
    }
    var viewModel = {
      editTitle: ko.observable(''),
      businessStage: [
        {text:'指标管理', value: '指标管理'},
        {text:'计划管理', value: '计划管理'},
        {text:'支付管理', value: '支付管理'},
        {text:'实拨管理', value: '实拨管理'},
        {text:'其他', value: '其他'},
        ],
      //要素Coa级次数据模型
      eleDataTable: new u.DataTable({
        meta: {}
      }),
      coaDetailDataTable: new u.DataTable({
        meta: {
          'coaDetailCode': {value: '',},
          'coaDetailId': {value: '',},
          'coaDto': {value: '',},
          'coaId': {value: '',},
          'defaultValue': {value: '',},
          'dispOrder': {value: '',},
          'eleCode': {value: '',},
          'eleName': {value: '',},
          'isMustInput': {value: '',},
          'levelName': {value: '',},
          'levelNum': {value: '',},
          'rgCode': {value: '',},
          'setYear': {value: '',},
        }
      }),
      //coa中Key对象
      coaDtoKeyDataTable: new u.DataTable({
        meta: {
          'id': {value: '',},
          'rgCode': {value: '',},
          'setYear': {value: '',},
        }
      }),
      coaDtoDataTable: new u.DataTable({
        meta: {
          'ccidsTable': {value: '',},
          'coaCode': {value: '',},
          'coaDesc': {value: '',},
          'coaDetail': [{
            'coaDetailCode': {value: '',},
            'coaDetailId': {value: '',},
            'coaDto': {value: '',},
            'coaId': {value: '',},
            'defaultValue': {value: '',},
            'dispOrder': {value: '',},
            'eleCode': {value: '',},
            'eleName': {value: '',},
            'isMustInput': {value: '',},
            'levelName': {value: '',},
            'levelNum': {value: '',},
            'rgCode': {value: '',},
            'setYear': {value: '',},
          }],
          'coaDetailList': [{
            'coaDetailCode': {value: '',},
            'coaDetailId': {value: '',},
            'coaDto': {value: '',},
            'coaId': {value: '',},
            'defaultValue': {value: '',},
            'dispOrder': {value: '',},
            'eleCode': {value: '',},
            'eleName': {value: '',},
            'isMustInput': {value: '',},
            'levelName': {value: '',},
            'levelNum': {value: '',},
            'rgCode': {value: '',},
            'setYear': {value: '',},
          }],
          'coaId': {value: '',},
          'coaName': {value: '',},
          'createDate': {value: '',},
          'createUser': {value: '',},
          'enabled': {value: '',},
//            		'key':{
//            			value: '',
//            		},
          'lastVer': {value: '',},
          'latestOpDate': {value: '',},
          'latestOpUser': {value: '',},
          'rgCode': {value: '',},
          'setYear': {value: '',},
          'sysAppName': {value: '',},
        }
      }),
      coaObj: {
        coaCode: ko.observable(''),
        coaDesc: ko.observable(''),
        coaName: ko.observable(''),
        sysAppName: ko.observable('指标管理'),
        enabled: ko.observable(1),
        coaCodeError: ko.observable(''),
        coaDescError: ko.observable(''),
        coaNameError: ko.observable(''),
      },
      eleObj: {
        isMustInput: ko.observable(0),
        defaultValue: ko.observable(''),
        defaultValueName: ko.observable(''),
        levelNum: ko.observable(''),
        levelName: ko.observable(''),
      },
      tree: ko.observableArray([{codename: '',chr_id: ''}]),
      levelList: [
        {text: '任意级次', value: -2},
        {text: '底级', value: -1},
        {text: '自定义级次', value: 0},
        {text: '一级', value: 1},
        {text: '二级', value: 2},
        {text: '三级', value: 3},
        {text: '四级', value: 4},
        {text: '五级', value: 5},
        {text: '六级', value: 6},
        {text: '七级', value: 7},
        {text: '八级', value: 8},
        {text: '九级', value: 9},
      ],
      max_level: ko.observable(''),
      //要素树
      treeDataTable: new u.DataTable({
        meta: {}
      }),
      treeSetting1: {
        view: {
          showLine: false,
          selectedMulti: true,
          showIcon: false,
          showTitle: true,
        },
        check: {
          enable: true,
          chkStyle: "checkbox",
          chkboxType: {"Y": "", "N": ""}
        },
        callback: {
          onClick: function (e, id, node) {
//                        showTree(node);
          },
        }
      },
      //通过级别改变树选中
      changeTreeByLevel: function (data, e) {
        var level = parseInt(e.target.value)
        // var Upperlevels = DX(level);
        // var levelName = Upperlevels;
        // var coaDetail = viewModel.coaDetailDataTable.getSimpleData();
        // if (coaDetail) {
        //   for (var i = 0; i < coaDetail.length; i++) {
        //     if (selectEleRowCode == coaDetail[i].eleCode) {
        //       var coaDetailR = viewModel.coaDetailDataTable.getRow(i);
        //       var coaDetaiilList = coaDetailR.getSimpleData();
        //       coaDetailR.setValue('levelNum', level); //设置在指定行字段值
        //       coaDetailR.setValue('levelName', levelName); //设置在指定行字段值
        //     }
        //   }
        // }
        var treeObj = $.fn.zTree.getZTreeObj("coa-tree1");
        treeObj.checkAllNodes(false);
        if (level == -2 || level == -1 || level == 0) {
          treeObj.checkAllNodes(true);
        } else {
          var sNodes = treeObj.getNodes();
          var nodes = treeObj.transformToArray(sNodes);
          for (var j = 0; j < nodes.length; j++) {
            if (level == nodes[j].level + 1) {
              treeObj.checkNode(nodes[j], true, false);
            } else if (nodes[j].isParent == false && nodes[j].level + 1 <= level) {
              treeObj.checkNode(nodes[j], true, false);
            }
          }
        }
      },

      //changeAllowNull
      changeAllowNull: function (obj) {
        var coaDetail = viewModel.coaDetailDataTable.getSimpleData();
        var isMustInput = parseInt($("#allow-null").val());
        if (coaDetail) {
          for (var i = 0; i < coaDetail.length; i++) {
            if (selectEleRowCode == coaDetail[i].eleCode) {
              var coaDetailR = viewModel.coaDetailDataTable.getRow(i);
              var coaDetaiilList = coaDetailR.getSimpleData();
              coaDetailR.setValue('isMustInput', isMustInput); //设置在指定行字段值
            }
          }
        }
      },

      //changeDefault
      changeDefault: function (obj) {
        var coaDetail = viewModel.coaDetailDataTable.getSimpleData();
        var defaultValue = $("#default-value").val();
        if (coaDetail) {
          for (var i = 0; i < coaDetail.length; i++) {
            if (selectEleRowCode == coaDetail[i].eleCode) {
              var coaDetailR = viewModel.coaDetailDataTable.getRow(i);
              coaDetailR.setValue('defaultValue', defaultValue); //设置在指定行字段值
            }
          }
        }
      },

      // 点击行, 获取树
      getEle: function(obj) {
        if(s.inInitTable) return
        // 设置行激活样式
        $('#coa-grid1_content_tbody, #coa-grid1_content_multiSelect, #coa-grid1_content_numCol').find('.mzc-focus')
          .removeClass('mzc-focus')
          .end()
          .find('> :nth-child('+ (obj.rowIndex + 1)+')')
          .addClass('mzc-focus')

        // 获取树
        var ele_code = obj.rowObj.value.ele_code
        selectEleRowCode = ele_code
        s.activeEle = obj.rowObj.value
        getEleTree(ele_code)
        updateView_1(obj.rowObj.value)
        // updateTree()
      },
      beforeAllRowSelected: function() {
        s.onAllRowSelected = true
        return true
      },
      rowSelected: function(obj) {
        if(s.inInitTable) return // 正在初始化table, 不需要触发这个选中事件
        if(!s.onAllRowSelected) viewModel.getEle(obj)
        var isExist = s.selectEleList.some(function(item) {
          if(item.ele_code === obj.rowObj.value.ele_code) {
            return true
          }
        })
        if(!isExist) s.selectEleList.push(obj.rowObj.value)
        // updateCoaDetail(obj)
      },
      allRowSelected: function(obj) {
        s.onAllRowSelected = false
      },
      rowUnSelected: function(obj) {
        // viewModel.getEle(obj)
        var index = -1
        var isExist = s.selectEleList.some(function(item, i) {
          if(item.ele_code === obj.rowObj.value.ele_code) {
            index = i
            return true
          }
        })
        if(isExist) s.selectEleList.splice(index, 1)
      },
      focusHandler: function(type) {
        viewModel.coaObj[type]('')
      },
      changeBusinessStage: function(data) {
        viewModel.coaObj.sysAppName(data.value)
      },
      changeDefaultValue: function(data) {
        viewModel.eleObj.defaultValue(data.chr_id)
        viewModel.eleObj.defaultValueName(data.codename)
      },
      changeLevelNum: function(data) {
        viewModel.eleObj.levelNum(data.value)
        viewModel.eleObj.levelName(data.text)
        var level = parseInt(data.value)
        var treeObj = $.fn.zTree.getZTreeObj("coa-tree1");
        treeObj.checkAllNodes(false);
        if (level == -2 || level == -1 || level == 0) {
          treeObj.checkAllNodes(true);
        } else {
          var sNodes = treeObj.getNodes();
          var nodes = treeObj.transformToArray(sNodes);
          for (var j = 0; j < nodes.length; j++) {
            if (level == nodes[j].level + 1) {
              treeObj.checkNode(nodes[j], true, false);
            } else if (nodes[j].isParent == false && nodes[j].level + 1 <= level) {
              treeObj.checkNode(nodes[j], true, false);
            }
          }
        }
      },
    };
    viewModel.eleObj.levelNum.subscribe(function(newV) {
      if(s.inChangeEle) return
      if(!s.activeEle) return
      s.coaDetailList.some(function(el) {
        if(el.eleCode === s.activeEle.ele_code) {
          el.levelNum = parseInt(newV)
          el.levelName = DX(newV)
          return true
        }
      })
    })

    viewModel.eleObj.isMustInput.subscribe(function(newV) {
      if(!s.activeEle) return
      s.coaDetailList.some(function(el) {
        if(el.eleCode === s.activeEle.ele_code) {
          el.isMustInput = parseInt(newV)
        }
      })
    })

    viewModel.eleObj.defaultValue.subscribe(function(newV) {
      if(!s.activeEle) return
      s.coaDetailList.some(function(el) {
        if(el.eleCode === s.activeEle.ele_code) {
          el.defaultValue = newV
        }
      })
    })

    function pushEmptyEleToCoaDetail(element) {
      var emptyEle = {
        coaDetailCode: '',
        coaDetailId: '',
        coaDto: null,
        coaId: s.coaId,
        defaultValue: '',
        dispOrder: 0,
        eleCode: element.ele_code,
        eleName: element.eleName,
        isMustInput: 1,
        levelName: '任意级次',
        levelNum: -2,
        rgCode: '',
        setYear: 0,
      }
      s.coaDetailList.push(emptyEle)
      return emptyEle
    }

    function updateView_1(element) {
      s.inChangeEle = true
      var ele
      var tree
      var emptyTree = [{codename: '',chr_id: ''}]
      var emptyEle = null
      var max_level
      var isExist = s.coaDetailList.some(function(coa) {
        if(coa.eleCode === element.ele_code) {
          ele = coa
          return true
        }
      })
      tree = window.els.filter(function(el) {return el.ele_code === element.ele_code})[0].tree
      tree = tree || []
      viewModel.tree(emptyTree.concat(tree))
      max_level = parseInt(element.max_level)
      max_level = max_level || 9
      viewModel.max_level(max_level)
      if(isExist) { // 元素已经存在
        viewModel.eleObj.isMustInput(ele.isMustInput)
        viewModel.eleObj.levelNum(ele.levelNum)
        viewModel.eleObj.levelName(DX(ele.levelNum))
      } else { // 元素不存在
        emptyEle = pushEmptyEleToCoaDetail(element)
        viewModel.eleObj.isMustInput(emptyEle.isMustInput)
        viewModel.eleObj.levelNum(emptyEle.levelNum)
        viewModel.eleObj.levelName(emptyEle.levelName)
      }
      s.inChangeEle = false
    }

    // 更新右侧树列表
    function updateTree() {
      var treeData = viewModel.treeDataTable.getSimpleData();
      if (treeData) {
        var selectObj = document.getElementById("default-value");
        selectObj.options.length = 1;
        var selectObjNum = 1;
        for (var i = 0; i < treeData.length; i++) {
          selectObj.options[selectObjNum] = new Option(treeData[i].codename, treeData[i].chr_id);
          selectObjNum++;
        }
        var treeObj = $.fn.zTree.getZTreeObj("coa-tree1");
        treeObj.expandAll(true);
        treeObj.checkAllNodes(true);
        //根据树计算级次
        var maxLevel = parseInt(getlevelByTree());
        //获取并清空级次select
        var selectLevel = document.getElementById("level");
        selectLevel.options.length = 0;
        for (var levels = 0; levels <= maxLevel + 2; levels++) {
          var Upperlevels = DX(levels);
          var level = levels - 2;
          $("#level").append("<option value='" + level + "'>" + Upperlevels + "</option>");
        }
        $("#level").val("-2");
      }
    }

    //
    function updateCoaDetail(obj) {
      var eleCode = obj.rowObj.value.ele_code
      var coaDetail = viewModel.coaDetailDataTable.getSimpleData();
      var coaNum = 0
      var coaDetailR
      if (coaDetail) {
        for (var i = 0; i < coaDetail.length; i++) {
          if (obj.rowObj.ele_code == coaDetail[i].eleCode) {
            coaNum++;
            coaDetailR = viewModel.coaDetailDataTable.getRow(i);
          }
        }
      }
      if (coaNum <= 0) {
        coaDetailR = viewModel.coaDetailDataTable.createEmptyRow();
        coaDetailR.setValue('eleCode', eleCode);
        coaDetailR.setValue('eleName', obj.rowObj.value.ele_name);
        coaDetailR.setValue('coaId', coaIDSelectEle);
        coaDetailR.setValue('levelNum', -2);
        coaDetailR.setValue('isMustInput', 0);
      } else {
        var coaDetailList = coaDetailR.getSimpleData();
        if (coaDetailList.levelNum != null) {
          $("#level").val(coaDetailList.levelNum);
          viewModel.changeTreeByLevel();
        }
        $("#allow-null").val(coaDetailList.isMustInput);
        $("#default-value").val(coaDetailList.defaultValue);
      }
    }

    //通过树得到级次
    var getlevelByTree = function () {
      var treeObj = $.fn.zTree.getZTreeObj("coa-tree1");
      var sNodes = treeObj.getNodes();
      var nodes = treeObj.transformToArray(sNodes);
      var levelNum = 0;
      for (var i = 0; i < nodes.length; i++) {
        if (levelNum < nodes[i].level) {
          levelNum = nodes[i].level;
        }
        ;
      }
      return levelNum + 1;
    };



    function show(code, callback) {
      s.inInitTable = true
      if (code == "" || code == null) {
        document.title = "新增界面";
        viewModel.editTitle('新增要素级次')
        getAllElement();
      } else {
        document.title = "编辑界面";
        viewModel.editTitle('修改要素级次')
        showEditPageDetail(code);
        coaIDSelectEle = code;
        s.coaId = code
      }
      s.inInitTable = false
      onCloseCallback = callback || {};
    };

    //获取当前所有启用要素信息
    var getAllElement = function () {
      if(window.els.length) {
        viewModel.eleDataTable.setSimpleData(window.els);
        viewModel.eleDataTable.setRowUnSelect(0);
        return
      }
      $.ajax({
        type: 'GET',
        url: LIST_Element_APP_DO_URL + "?tokenid=" + tokenid,
        dataType: 'JSON',
        async: false,
        success: function (result) {
          if (result.errorCode == "0") {
            viewModel.eleDataTable.setSimpleData(result.data);
            // viewModel.eleDataTable.setRowUnSelect(0);
            var ele = viewModel.eleDataTable.getSimpleData();
          } else {
            ip.ipInfoJump("错误", 'error');
          }
        }, error: function () {
          ip.ipInfoJump("错误", 'error');
        }
      });
    };

    //通过ele_code获取当前要素信息
    var getElementByCode = function (code) {
      var ele = viewModel.eleDataTable.getSimpleData();
      for (var eleNum = 0; eleNum < ele.length; eleNum++) {
        if (code == ele[eleNum].ele_code) {
          return ele[eleNum];
        }
      }
    };

    //根据要素简称获取要素列表（刷新树时）
    var getEleTree = function (code) {
      var isExist = window.els.some(function(el) {
        if(el.ele_code === code && el.tree) {
          updateTree(el.tree)
          return true
        }
      })
      if(isExist) return
      $.ajax({
        type: 'GET',
        url: EDIT_Element_APP_DO_URL + "?tokenid=" + tokenid,
        data: {"element": code},
        dataType: 'JSON',
        async: false,
        success: function (result) {
          if (result.errorCode == "0") {
            window.els.some(function(el) {
              if(el.ele_code === code) {
                el.tree = result.data[0].row
                return true
              }
            })
            updateTree(result.data[0].row)
          } else {
            viewModel.treeDataTable.clear()
            ip.ipInfoJump("错误", 'error');
          }
        }, error: function () {
          viewModel.treeDataTable.clear()
          ip.ipInfoJump("错误", 'error');
        }
      });

      function updateTree(data) {
        viewModel.treeDataTable.setSimpleData(data);
        var treeObj = $.fn.zTree.getZTreeObj("coa-tree1");
        treeObj.expandAll(true);
        treeObj.checkAllNodes(true);
      }
    };

    //显示编辑页面信息
    var showEditPageDetail = function (obj) {
      $.ajax({
        type: 'GET',
        url: EDIT_Element_ID_APP_DO_URL + "?tokenid=" + tokenid,
        data: {'coaid': obj},
        dataType: 'JSON',
        success: function (result) {
          if (result.errorCode == "0") {
            s.inInitTable = true
            var data = result.coaDto;
            s.coaDetailList = data.coaDetail
            viewModel.coaObj.coaCode(data.coaCode)
            viewModel.coaObj.coaDesc(data.coaDesc)
            viewModel.coaObj.coaName(data.coaName)
            viewModel.coaObj.sysAppName(data.sysAppName)
            viewModel.coaObj.enabled(data.enabled)

            // $("#coa-code").val(data.coaCode);
            // $("#coa-name").val(data.coaName);
            // $("#coa-describe").val(data.coaDesc);
            // $("#ccid-table").val(data.ccidsTable);
            // $("#business-period").val(data.sysAppName);
            // $("#enable-identity").val(data.enabled);
            viewModel.coaDtoDataTable.setSimpleData(data);
            // viewModel.coaDetailDataTable.setSimpleData(data.coaDetail);
            // viewModel.coaDtoKeyDataTable.setSimpleData(data.key);
            // var coaDto = viewModel.coaDtoDataTable.getSimpleData();
            var coaDetail = data.coaDetail;
            getAllElement();
            var ele = viewModel.eleDataTable.getSimpleData();
            var rows = new Array();
            var rowNum = 0;
            for (var i = 0; i < coaDetail.length; i++) {
              for (var j = 0; j < ele.length; j++) {
                if (coaDetail[i].eleCode == ele[j].ele_code) {
                  rows[rowNum] = j;
                  rowNum++;
                }
              }
            }
            viewModel.eleDataTable.setRowsSelect(rows);
            s.inInitTable = false
          } else {
            ip.ipInfoJump("错误", 'error');
          }
        }, error: function () {
          ip.ipInfoJump("错误", 'error');
        }
      });
    };

    var selectEleRowCode = "";
    //点击要素显示树
    onRowSelected1 = function (obj) {
      viewModel.treeDataTable.clear();
      var eleCode = obj.rowObj.ele_code;
      getEleTree(eleCode);
      selectEleRowCode = eleCode;
      var coaDetail = viewModel.coaDetailDataTable.getSimpleData();
      var coaNum = 0;
      var treeData = viewModel.treeDataTable.getSimpleData();
      if (treeData) {
        var selectObj = document.getElementById("default-value");
        selectObj.options.length = 1;
        var selectObjNum = 1;
        for (var i = 0; i < treeData.length; i++) {
          selectObj.options[selectObjNum] = new Option(treeData[i].codename, treeData[i].chr_id);
          selectObjNum++;
        }
        var treeObj = $.fn.zTree.getZTreeObj("coa-tree1");
        treeObj.expandAll(true);
        treeObj.checkAllNodes(true);
        //根据树计算级次
        var maxLevel = parseInt(getlevelByTree());
        //获取并清空级次select
        var selectLevel = document.getElementById("level");
        selectLevel.options.length = 0;
        for (var levels = 0; levels <= maxLevel + 2; levels++) {
          var Upperlevels = DX(levels);
          var level = levels - 2;
          $("#level").append("<option value='" + level + "'>" + Upperlevels + "</option>");
        }
        $("#level").val("-2");
      }
      if (coaDetail) {
        for (var i = 0; i < coaDetail.length; i++) {
          if (obj.rowObj.ele_code == coaDetail[i].eleCode) {
            coaNum++;
            var coaDetailR = viewModel.coaDetailDataTable.getRow(i);
          }
        }
      }
      if (coaNum <= 0) {
        var coaDetailR = viewModel.coaDetailDataTable.createEmptyRow();
        coaDetailR.setValue('eleCode', eleCode);
        coaDetailR.setValue('eleName', obj.rowObj.ele_name);
        coaDetailR.setValue('coaId', coaIDSelectEle);
        coaDetailR.setValue('levelNum', -2);
        coaDetailR.setValue('isMustInput', 0);
      } else {
        var coaDetaiilList = coaDetailR.getSimpleData();
        if (coaDetaiilList.levelNum != null) {
          $("#level").val(coaDetaiilList.levelNum);
          viewModel.changeTreeByLevel();
        }
        $("#allow-null").val(coaDetaiilList.isMustInput);
        $("#default-value").val(coaDetaiilList.defaultValue);
      }
    };

    //取消选择，删除模型中数据
    viewModel.onRowUnSelected1 = function (obj) {
      var coaDetail = viewModel.coaDetailDataTable.getSimpleData();
      if (coaDetail) {
        for (var i = 0; i < coaDetail.length; i++) {
          if (obj.rowObj.value.ele_code == coaDetail[i].eleCode) {
            viewModel.coaDetailDataTable.removeRow(i);
          }
        }
      }
    };

    //整数大写转小写
    var DX = function (n) {
      var china = new Array('任意级次', '底级', '自定义级次', '一级', '二级', '三级', '四级', '五级', '六级', '七级', '八级', '九级');
      n = china[n+2];
      return n;
    };

    //将更新或新增数据放入数据模型中
    viewModel.saveBefore = function () {
      var coaDto = viewModel.coaDtoDataTable.getSimpleData();
      var coaCode = $("#coa-code").val();
      var coaName = $("#coa-name").val();
      var coaDesc = $("#coa-describe").val();
      var ccidsTable = $("#ccid-table").val();
      var sysAppName = $("#business-period").val();
      var enabled = parseInt($("#enable-identity").val());
      var coaDetail = []
      if (coaDto) { // 修改
        coaDto[0].coaCode = coaCode;
        coaDto[0].coaName = coaName;
        coaDto[0].coaDesc = coaDesc;
        coaDto[0].ccidsTable = ccidsTable;
        coaDto[0].sysAppName = sysAppName;
        coaDto[0].enabled = enabled;
        coaDto[0].coaId = coaIDSelectEle;
        coaDetail = viewModel.coaDetailDataTable.getSimpleData();
        coaDto[0].coaDetail = coaDetail;
        coaDto[0].coaDetailList = coaDetail;
        delete(coaDto[0]["key"]);
        viewModel.coaDtoDataTable.setSimpleData(coaDto);
      } else { // 新增
        var coaDtoR = viewModel.coaDtoDataTable.createEmptyRow();
        coaDtoR.setValue('coaCode', coaCode);
        coaDtoR.setValue('coaName', coaName);
        coaDtoR.setValue('coaDesc', coaDesc);
        coaDtoR.setValue('ccidsTable', ccidsTable);
        coaDtoR.setValue('sysAppName', sysAppName);
        coaDtoR.setValue('enabled', enabled);
        coaDtoR.setValue('coaId', coaIDSelectEle);
        coaDetail = viewModel.coaDetailDataTable.getSimpleData();
        coaDtoR.setValue('coaDetail', coaDetail);
        coaDtoR.setValue('coaDetailList', coaDetail);
      }
    };

    // 保存按钮单击事件
    viewModel.btnSaveClick = function () {
      var coaObj = viewModel.coaObj
      var coaCode = coaObj.coaCode().trim()
      if(!coaCode) {
        coaObj.coaCodeError('coa编码不能为空!')
        return
      }
      if(/\D/.test(coaCode)) {
        coaObj.coaCodeError('coa编码只能包含数字!')
        return
      }
      if(!coaObj.coaName().trim()) {
        coaObj.coaNameError('coa名称不能为空!')
        return
      }
      if(!coaObj.coaDesc().trim()) {
        coaObj.coaDescError('coa描述不能为空!')
        return
      }

      // viewModel.saveBefore();
      var emptyCoaDto = {
        'ccidsTable': '',
        'coaCode': '',
        'coaDesc': '',
        'coaDetail': [],
        'coaDetailList': [],
        'coaId': '',
        'coaName': '',
        'createDate': '',
        'createUser': '',
        'enabled': 1,
        // 'key':{
        //   id: '',
        //   setYear: '2016',
        //   rgCode: '3700'
        // },
        'lastVer': '',
        'latestOpDate': '',
        'latestOpUser': '',
        'rgCode': '3700',
        'setYear': '2016',
        'sysAppName': '',
      }
      var coaDtoList = viewModel.coaDtoDataTable.getSimpleData()
      if(coaDtoList && coaDtoList[0]) delete coaDtoList[0].key
      var coaDto = coaDtoList ? coaDtoList[0] : emptyCoaDto
      if (document.title == "编辑界面") {
        var url = EDIT_UPDATA_COA_DO_URL;
      } else {
        var url = EDIT_SAVE_COA_DO_URL;
      }

      var coaDetail = s.selectEleList.map(function(el) {
        var res
        var eleCode = el.ele_code
        var isExist = s.coaDetailList.some(function(coaD) {
          if(coaD.eleCode === el.ele_code) {
            res = coaD
            return true
          }
        })
        if(!isExist) return pushEmptyEleToCoaDetail(el)
        else return res
      })

      coaDto.coaCode = viewModel.coaObj.coaCode()
      coaDto.coaDesc = viewModel.coaObj.coaDesc()
      coaDto.coaName = viewModel.coaObj.coaName()
      coaDto.sysAppName = viewModel.coaObj.sysAppName()
      coaDto.enabled = viewModel.coaObj.enabled()
      coaDto.coaDetail = coaDto.coaDetailList = coaDetail
      s.coaDto = coaDto

      // coaDto = {
      //   "ccidsTable":"",
      //   "coaCode":"123ggdsdsg",
      //   "coaDesc":"dgsagdsag",
      //   "coaDetail":[
      //     {
      //       "coaDetailCode":"",
      //       "coaDetailId":"",
      //       "coaDto":null,
      //       "coaId":'',
      //       "defaultValue":"",
      //       "dispOrder":0,
      //       "eleCode":"HOLD3",
      //       "isMustInput":1,
      //       "levelNum":-2,
      //       "rgCode":"",
      //       "setYear":0,
      //       "levleNum":"-1"
      //     },
      //     {
      //       "coaDetailCode":"",
      //       "coaDetailId":"",
      //       "coaDto":null,
      //       "coaId":'',
      //       "defaultValue":"{2C8DE99A-47C3-11E4-90DE-D58517FD0F5A}",
      //       "dispOrder":0,
      //       "eleCode":"AS",
      //       "isMustInput":1,
      //       "levelNum":-2,
      //       "rgCode":"",
      //       "setYear":0,
      //       "levleNum":"1"
      //     },
      //     {
      //       "coaDetailCode":"",
      //       "coaDetailId":"",
      //       "coaDto":null,
      //       "coaId":'',
      //       "defaultValue":"",
      //       "dispOrder":0,
      //       "eleCode":"IN_BS",
      //       "isMustInput":1,
      //       "levelNum":-2,
      //       "rgCode":"",
      //       "setYear":0,
      //       "inMustInput":1,
      //       "levleNum":"4"
      //     }
      //   ],
      //   "coaDetailList":[
      //     {
      //       "coaDetailCode":"",
      //       "coaDetailId":"",
      //       "coaDto":null,
      //       "coaId":-1,
      //       "defaultValue":"",
      //       "dispOrder":0,
      //       "eleCode":"HOLD3",
      //       "isMustInput":1,
      //       "levelNum":-2,
      //       "rgCode":"",
      //       "setYear":0,
      //       "levleNum":"-1"
      //     },
      //     {
      //       "coaDetailCode":"",
      //       "coaDetailId":"",
      //       "coaDto":null,
      //       "coaId":-1,
      //       "defaultValue":"{2C8DE99A-47C3-11E4-90DE-D58517FD0F5A}",
      //       "dispOrder":0,
      //       "eleCode":"AS",
      //       "isMustInput":1,
      //       "levelNum":-2,
      //       "rgCode":"",
      //       "setYear":0,
      //       "levleNum":"1"
      //     },
      //     {
      //       "coaDetailCode":"",
      //       "coaDetailId":"",
      //       "coaDto":null,
      //       "coaId":-1,
      //       "defaultValue":"",
      //       "dispOrder":0,
      //       "eleCode":"IN_BS",
      //       "isMustInput":1,
      //       "levelNum":-2,
      //       "rgCode":"",
      //       "setYear":0,
      //       "inMustInput":1,
      //       "levleNum":"4"
      //     }
      //   ],
      //   "coaId":"",
      //   "coaName":"sdgagds",
      //   "createDate":"",
      //   "createUser":"",
      //   "enabled":1,
      //   "key":{
      //     "id":"",
      //     "setYear":"2016",
      //     "rgCode":"3700"
      //   },
      //   "lastVer":"",
      //   "latestOpDate":"",
      //   "latestOpUser":"",
      //   "rgCode":"3700",
      //   "setYear":"2016",
      //   "sysAppName":"指标管理"
      // }

      $.ajax({
        type: 'POST',
        url: url + "?tokenid=" + tokenid,
        data: JSON.stringify(coaDto),
        contentType: 'application/json',
        dataType: 'json',
        success: function (result) {
          if (result.errorCode == 0) {
            ip.ipInfoJump("保存成功", 'success');
            clearAll();
            onCloseCallback.save(result.coaDtoBack);
          } else {
            if (result.errorMessage) {
              var rErrorMessage = result.errorMessage.split("+");
              if (rErrorMessage[0] == "级联保存") {
                // $('#f1-edit-container').modal('hide')
                $("#saveModal").modal({backdrop: false});
                var modal = $("#saveModal");
                modal.find('.modal-body').html('<pre>'+rErrorMessage[1]+'</pre>');
              } else {
                ip.ipInfoJump(result.errorMessage, 'error');
              }
            }
          }
        }, error: function () {
          ip.ipInfoJump("错误", 'error');

        }
      });

      // if (onCloseCallback.save) {
      //   var coaDto = viewModel.coaDtoDataTable.getSimpleData();
      //   if (coaDto[0].coaCode == null) {
      //     coaDto[0].coaCode = "";
      //   }
      //   if (coaDto[0].coaName == null) {
      //     coaDto[0].coaName = "";
      //   }
      //   if (coaDto[0].coaDesc == null) {
      //     coaDto[0].coaDesc = "";
      //   }
      //   if (coaDto[0].ccidsTable == null) {
      //     coaDto[0].ccidsTable = "";
      //   }
      //   if (coaDto[0].sysAppName == null) {
      //     coaDto[0].sysAppName = "";
      //   }
      //   if (coaDto[0].enabled == null) {
      //     coaDto[0].enabled = 1;
      //   }
      //   if (coaDto[0].setYear == null) {
      //     coaDto[0].setYear = 2016;
      //   }
      //   if (coaDto[0].rgCode == null) {
      //     coaDto[0].rgCode = "3700";
      //   }
      //   if (coaDto[0].coaId == null) {
      //     coaDto[0].coaId = "";
      //   }
      //   coaDto[0].createDate = "";
      //   if (coaDto[0].createDate == null) {
      //
      //   }
      //   if (coaDto[0].createUser == null) {
      //     coaDto[0].createUser = "";
      //   }
      //   coaDto[0].lastVer = "";
      //   if (coaDto[0].lastVer == null) {
      //
      //   }
      //   coaDto[0].latestOpDate = "";
      //   if (coaDto[0].latestOpDate == null) {
      //
      //   }
      //   if (coaDto[0].latestOpUser == null) {
      //     coaDto[0].latestOpUser = "";
      //   }
      //   coaDto[0].coaDetail = coaDto[0].coaDetailList = coaDto[0].coaDetail || []
      //   for (var i = 0; i < coaDto[0].coaDetail.length; i++) {
      //     if (coaDto[0].coaDetail[i].eleCode == null) {
      //       coaDto[0].coaDetail[i].eleCode = "";
      //       coaDto[0].coaDetailList[i].eleCode = "";
      //     }
      //     if (coaDto[0].coaDetail[i].eleName == null) {
      //       coaDto[0].coaDetail[i].eleName = "";
      //       coaDto[0].coaDetailList[i].eleName = "";
      //     }
      //     if (coaDto[0].coaDetail[i].coaId == null) {
      //       coaDto[0].coaDetail[i].coaId = "";
      //       coaDto[0].coaDetailList[i].coaId = "";
      //     }
      //     if (coaDto[0].coaDetail[i].setYear == null) {
      //       coaDto[0].coaDetail[i].setYear = 0;
      //       coaDto[0].coaDetailList[i].setYear = 0;
      //     }
      //     if (coaDto[0].coaDetail[i].dispOrder == null) {
      //       coaDto[0].coaDetail[i].dispOrder = 0;
      //       coaDto[0].coaDetailList[i].dispOrder = 0;
      //     }
      //     if (coaDto[0].coaDetail[i].levelNum == null) {
      //       coaDto[0].coaDetail[i].levelNum = -2;
      //       coaDto[0].coaDetailList[i].levelNum = -2;
      //     }
      //     if (coaDto[0].coaDetail[i].coaDetailCode == null) {
      //       coaDto[0].coaDetail[i].coaDetailCode = "";
      //       coaDto[0].coaDetailList[i].coaDetailCode = "";
      //     }
      //     if (coaDto[0].coaDetail[i].coaDetailId == null) {
      //       coaDto[0].coaDetail[i].coaDetailId = "";
      //       coaDto[0].coaDetailList[i].coaDetailId = "";
      //     }
      //     if (coaDto[0].coaDetail[i].coaDto == null) {
      //       coaDto[0].coaDetail[i].coaDto = "";
      //       coaDto[0].coaDetailList[i].coaDto = "";
      //     }
      //     if (coaDto[0].coaDetail[i].defaultValue == null) {
      //       coaDto[0].coaDetail[i].defaultValue = "";
      //       coaDto[0].coaDetailList[i].defaultValue = "";
      //     }
      //     if (coaDto[0].coaDetail[i].isMustInput == null) {
      //       coaDto[0].coaDetail[i].isMustInput = 1;
      //       coaDto[0].coaDetailList[i].isMustInput = 1;
      //     }
      //     if (coaDto[0].coaDetail[i].levelName == null) {
      //       coaDto[0].coaDetail[i].levelName = "任意级次";
      //       coaDto[0].coaDetailList[i].levelName = "任意级次";
      //     }
      //     if (coaDto[0].coaDetail[i].rgCode == null) {
      //       coaDto[0].coaDetail[i].rgCode = "";
      //       coaDto[0].coaDetailList[i].rgCode = "";
      //     }
      //   }
      //   coaSaveData = coaDto[0];
      //   $.ajax({
      //     type: 'POST',
      //     url: url + "?tokenid=" + tokenid,
      //     data: JSON.stringify(coaSaveData),
      //     contentType: 'application/json',
      //     dataType: 'json',
      //     success: function (result) {
      //       if (result.errorCode == 0) {
      //         ip.ipInfoJump("保存成功", 'success');
      //         clearAll();
      //         onCloseCallback.save(result.coaDtoBack);
      //       } else {
      //         if (result.errorMessage) {
      //           var rErrorMessage = result.errorMessage.split("+");
      //           if (rErrorMessage[0] == "级联保存") {
      //             $("#saveModal").modal("show");
      //             var modal = $("#saveModal");
      //             modal.find('.modal-body').text(rErrorMessage[1]);
      //           } else {
      //             ip.ipInfoJump(result.errorMessage, 'error');
      //           }
      //         }
      //       }
      //     }, error: function () {
      //       ip.ipInfoJump("错误", 'error');
      //
      //     }
      //   });
      // }
    };

    //级联更新
    viewModel.saveCascadeCoa = function () {
      $("#saveModal").modal("hide");
      $.ajax({
        type: 'POST',
        url: EDIT_UPDATA_CASCADE_COA_DO_URL + "?tokenid=" + tokenid,
        data: JSON.stringify(s.coaDto),
        contentType: 'application/json',
        dataType: 'json',
        success: function (result) {
          if (result.errorCode == 0) {
            ip.ipInfoJump("保存成功", 'success');
            clearAll();
            $('#f1-edit-container').modal('hide')
            onCloseCallback.save(result.coaDtoBack);
          } else {
            ip.ipInfoJump(result.errorMessage, 'error');
          }
        }, error: function () {
          ip.ipInfoJump("错误", 'error');

        }
      });
    };

    //关闭按钮单击事件
    viewModel.btnCloseClick = function () {
      if (onCloseCallback.cancel) {
        clearAll();
        onCloseCallback.cancel();
      }
    };

    //清空
    var clearAll = function () {
      $('#saveModal').modal('hide')
      // $("#coa-code").val("");
      // $("#coa-name").val("");
      // $("#coa-describe").val("");
      // $("#ccid-table").val("");
      // $("#business-period").val("指标管理");
      // $("#enable-identity").val("1");
      viewModel.coaObj.coaCode('')
      viewModel.coaObj.coaCodeError('')
      viewModel.coaObj.coaName('')
      viewModel.coaObj.coaNameError('')
      viewModel.coaObj.coaDesc('')
      viewModel.coaObj.coaDescError('')
      viewModel.coaObj.sysAppName('指标管理')
      viewModel.coaObj.enabled(1)
      viewModel.eleDataTable.clear();
      viewModel.coaDetailDataTable.clear();
      viewModel.coaDtoDataTable.clear();
      viewModel.treeDataTable.clear();
    };

    function init() {
      tokenid = ip.getTokenId()+'&ajax=noCache';
      u.createApp({
        el: $('#editMain')[0],
        model: viewModel
      });
    };
    return {
      'model': viewModel,
      'template': template,
      'init': init,
      'show': show
    };
  }
);

