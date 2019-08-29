require(['jquery', 'knockout', '/df/fap/system/config/ncrd.js', 'bootstrap', 'uui', 'tree', 'grid', 'ip'], function ($, ko, ncrd) {
  window.ko = ko;
  var LIST_APP_DO_URL = '/df/billNoRule/list/findAllSysApp.do?tokenid='; //获取所有应用模块
  var listApp, editAddApp, editUpdateApp;
  var tokenid;

  // 单号规则数据模型
  var viewModel = {
    // 树查找功能
    treeKeyword: ko.observable(''),
    findTree: function () {
      ncrd.findTreeNode($.fn.zTree.getZTreeObj('tree'), viewModel.treeKeyword());
    },
    // 树组件设置
    treeSetting: {
      view: {
        showLine: false,
        selectedMulti: false
      },
      callback: {
        // 右键点击事件：增改删
        onRightClick: function zTreeOnRightClick(event, treeId, treeNode) {
          // 选中节点
          var treeObj = $.fn.zTree.getZTreeObj('tree');
          treeObj.selectNode(treeNode);
          var treeDataArr = viewModel.treeDataTable.getSimpleData();
          for (var i = 0, length = treeDataArr.length; i < length; i++) {
            if (treeDataArr[i].cid === treeObj.getSelectedNodes()[0].id) {
              viewModel.treeDataTable.setRowSelect(i);
              break;
            }
          }
          var oDiv = $('.clickContent')[0];
          oDiv.style.display = 'block';
          oDiv.style.left = event.clientX + 'px';
          oDiv.style.top = event.clientY + 'px';
          // 阻止浏览器的默认行为
          return false;
        },
        // 左键点击事件
        onClick: function zTreeOnClick(event, treeId, treeNode) {
          // 左键双击事件：弹出修改界面
          if (treeNode.clickTimeout) {
            clearTimeout(treeNode.clickTimeout);
            treeNode.clickTimeout = null;
            if (treeNode.getParentNode() !== null && treeNode.getParentNode().id !== 0) {
              viewModel.editUpdate();
            }
          } else { // 左键单击事件：展示节点信息
            treeNode.clickTimeout = setTimeout(function () {
              if (treeNode.getParentNode() !== null && treeNode.getParentNode().id !== 0) {
                var billnoRuleId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
                var req = $.ajax({
                  type: 'GET',
                  url: '/df/billNoRule/findSysRulesByBillNoRuleId.do?tokenid=' + tokenid,
                  data: {
                    'billnoRuleId': billnoRuleId,
                    "ajax":"noCache"
                  },
                  cache: false
                });
                req.done(function (result) {
                  if (result.errorCode === 0) {
                    initTable(result);
                    var treeNodeName = treeNode.name;
                    var arr = treeNodeName.split(' ');
                    var ruleNumber = arr[0];
                    var ruleName = arr[1];
                    viewModel.ruleNumberData.setSimpleData({
                      ruleNumber: ruleNumber
                    });
                    viewModel.ruleNameData.setSimpleData({
                      ruleName: ruleName
                    });
                    $('#appModel').val(viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id);
                  } else if (result.errorCode === -1) {
                	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
                  } else {
                	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
                  }
                }).fail(ncrd.commonAjaxError);
              } else {
                viewModel.gridDataTable.setSimpleData([]);
                viewModel.ruleNumberData.setSimpleData({});
                viewModel.ruleNameData.setSimpleData({});
                $('#appModel').val('');
                viewModel.exampleMessage('');
              }
              treeNode.clickTimeout = null;
            }, 250);
          }
        }
      }
    },
    // 树的数据格式
    treeDataTable: new u.DataTable({
      meta: {
        // 父ID
        pid: {
          value: ''
        },
        name: {
          value: ''
        },
        // 节点ID
        cid: {
          value: ''
        },
        // 后台ID
        id: {
          value: ''
        },
        // 所属子系统ID
        sys_id: {
          value: ''
        }
      }
    }),
    // 表格的数据格式
    gridDataTable: new u.DataTable({
      meta: {
        last_ver: {},
        line_format: {},
        line_format_name: {},
        latest_op_date: {},
        billnoruleline_id: {},
        line_no: {},
        billnorule_id: {},
        level_num: {},
        level_num_name: {},
        set_year: {},
        line_type: {},
        line_type_name: {},
        ele_code: {},
        ele_code_name: {},
        latest_op_user: {},
        rg_code: {},
        init_value: {},
        eles: [{
          'last_ver': {},
          'billnoruleline_id': {},
          'rg_code': {},
          'set_year': {},
          'ele_code': {},
          'level_num': {}
        }],
        eles_name: {}
      }
    }),
    // 单号规则编号
    ruleNumberData: new u.DataTable({
      meta: {
        ruleNumber: ''
      }
    }),
    // 单号规则名字
    ruleNameData: new u.DataTable({
      meta: {
        ruleName: ''
      }
    }),
    // 下拉列表
    system: ko.observableArray([]),
    // 例子
    exampleMessage: ko.observable()
  };

  // 删除事件
  viewModel.deleteBtn = function () {
    var treeNodes = $('#tree')[0]['u-meta'].tree.getSelectedNodes();
    if (treeNodes !== null && treeNodes.length > 0) {
      if (treeNodes[0].getParentNode() !== null && treeNodes[0].getParentNode().id !== 0) {
        if (treeNodes[0].children === undefined || treeNodes[0].children.length === 0) {
          var delConfirmMsg = '确定要删除这个单号规则吗？';
          ip.warnJumpMsg(delConfirmMsg, 'delConfirmSureId', 'delConfirmCancelCla');
          $('#delConfirmSureId').on('click', viewModel.deleteNode);
          $('#delConfirmSureId').on('click', function () {
            $('#config-modal').remove();
          });
          $('.delConfirmCancelCla').on('click', function () {
            $('#config-modal').remove();
          });
        } else {
          // 提示消息
          ip.ipInfoJump('存在子节点，请先删除子节点再删除父节点！', 'info');
        }
      } else {
        //提示消息
        ip.ipInfoJump('此节点不允许进行删除操作！', 'info');
      }
    } else {
      //提示消息
      ip.ipInfoJump('请选择一个要删除单号规则！', 'info');
    }
  };

  // 删除节点
  viewModel.deleteNode = function () {
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var nodes = treeObj.getSelectedNodes();
    var tempArr = viewModel.treeDataTable.getSelectedRows();
    var billnoRuleId = tempArr[0].getSimpleData().id;

    var req = $.ajax({
      type: 'GET',
      url: "/df/billNoRule/deleteSysBillNoRuleByBillNoRuleId.do?tokenid=" + tokenid,
      data: {
        'billnorule_Id': billnoRuleId,
        "ajax":"noCache"
      },
      cache: false
    });
    req.done(function (result) {
      if (result.errorCode === 0) {
    	  ip.ipInfoJump('删除成功！', 'success');
        for (var i = 0, l = nodes.length; i < l; i++) {
          var nextNode = nodes[i].getNextNode();
          var preNode = nodes[i].getPreNode();
          var parentNode = nodes[i].getParentNode();
          treeObj.removeNode(nodes[i]);
          if (nextNode) {
            viewModel.showBillnoTree(nextNode);
          } else if (preNode) {
            viewModel.showBillnoTree(preNode);
          } else {
            viewModel.showBillnoTree(parentNode);
          }
        }
        viewModel.gridDataTable.setSimpleData([]);
        viewModel.ruleNumberData.setSimpleData({});
        viewModel.ruleNameData.setSimpleData({});
        $("#appModel").val("");
        viewModel.exampleMessage('');
        $("#deleteModal").modal("hide");
      } else {
    	  ip.ipInfoJump('操作失败！', 'error');
      }
    })
      .fail(ncrd.commonAjaxError);
  };

  // 左边树初始化
  viewModel.showBillnoTree = function (billnoRuleData) {
    var req = $.ajax({
      type: 'GET',
      url: '/df/billNoRule/treeInfo?tokenid=' + tokenid,
      cache: false,
      dataType: 'json',
      data:{"ajax":"noCache"}
    });
    req.done(function (result) {
      if (result.rows) {
        initTree(result,billnoRuleData);
      }
    }).fail(ncrd.commonAjaxError);
  };

  // 获取 应用模块 下拉列表
  viewModel.getBillnoModuels = function () {
    $.ajax({
      type: 'GET',
      url: LIST_APP_DO_URL + tokenid,
      dataType: 'json',
      cache: false,
      data:{"ajax":"noCache"}
    }).done(function (result) {
      var data = result.data;
      if (data !== null) {
        for (var i = 0; i < data.length; i++) {
          $("#appModel").append("<option value=" + data[i].sys_id + ">" + data[i].sys_id + " " + data[i].sys_name + "</option>");
        }
      }
    }).fail(ncrd.commonAjaxError);
  };

  // 切换当前显示的界面
//  function go(showCollapse) {
//    $("div.container-fluid.ncrd.collapse").collapse('hide');
//    $(showCollapse).collapse('show');
//  }

  // 新增按钮单击事件
  viewModel.editAdd = function () {
    // 需要展现的数据
    var billnoRuleData = {
      // 节点ID集合
      treeData: [],
      // 表格数据
      data: [],
      ruleNumber: '',
      ruleName: '',
      sys_id: ''
    };
    // 要编辑的单据id
    var billId = '';

    var treeDataArr = viewModel.treeDataTable.getSimpleData();
    if (treeDataArr !== undefined) {
      for (var i = 0, length = treeDataArr.length; i < length; i++) {
        if (treeDataArr[i].cid !== 0 && treeDataArr[i].id !== treeDataArr[i].cid) {
          billnoRuleData.treeData.push(treeDataArr[i].cid.slice(0, -1));
        }
      }
    }
    
    var nodes = $("#tree")[0]['u-meta'].tree.getSelectedNodes();
    //选中节点
    if (nodes !== null && nodes.length > 0 && nodes[0].id !== 0) {
      var billnoRuleId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
      billId = billnoRuleId;
      var parentNode = nodes[0].getParentNode();
      if(parentNode === null) {
    	  ip.ipInfoJump("此节点不允许进行新增操作！", 'info');
    	  return false;
      }
      var parentNodeId = parentNode.id;
      if(parentNodeId !== 0) {
          $.ajax({
            type: 'GET',
            url: "/df/billNoRule/findSysRulesByBillNoRuleId.do?tokenid=" + tokenid,
            data: {
              'billnoRuleId': billnoRuleId,
              "ajax":"noCache"
            },
            cache: false
          }).done(function (result) {
            if (result.errorCode === 0) {
              billnoRuleData.data = result.data;
              var treeNodeName = nodes[0].name;
              var arr = treeNodeName.split(' ');
              billnoRuleData.ruleNumber = arr[0];
              billnoRuleData.ruleName = arr[1];
              billnoRuleData.sys_id = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id;
              loadEditAddApp(onEditAddAppLoaded, billId, billnoRuleData);
            } else if (result.errorCode === -1) {
            } else {
            }
          }).fail(ncrd.commonAjaxError);
      } else {
    	  // 选中子系统
          billnoRuleData.sys_id = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id;
          loadEditAddApp(onEditAddAppLoaded, billId, billnoRuleData);
      }
    } else {
    	//未选中节点
    	loadEditAddApp(onEditAddAppLoaded, billId, billnoRuleData);
    }
  };

  function loadEditAddApp(onloaded, billId, billnoRuleData) {
    var container = $('#billno-editAdd-contanier');
    var url = "fap/system/config/billno/editAdd";
    requirejs.undef(url);
    require([url], function (module) {
      ko.cleanNode(container[0]);
      container.html('');
      container.html(module.template);
      module.init(container[0]);
      editAddApp = module;
      if (onloaded) {
        onloaded(billId, billnoRuleData);
      }
    });
  }

  // 完成页面加载完成后的回调函数，需要等待编辑页面加载完才能执行的代码放在这里
  function onEditAddAppLoaded(billId, billnoRuleData) {
    editAddApp.show(billId, billnoRuleData, onEditAddAppClose);
  }

  // 完成页面关闭时的回调事件，save:保存关闭 cancel：取消关闭
  var onEditAddAppClose = {
    save: function (data) {
      var billnoRuleData = data;
      $('#setRuleWindow').modal('hide');
      // 刷新列表页面数据 选中新增的节点

      var req = $.ajax({
        type: 'GET',
        url: '/df/billNoRule/treeInfo?tokenid=' + tokenid,
        cache: false,
        dataType: 'json',
        data:{"ajax":"noCache"}
      });
      var reqTable = req.then(function (result) {
        initTree(result,billnoRuleData);
        var treeObj = $.fn.zTree.getZTreeObj('tree');
        var nodes = treeObj.getSelectedNodes();
        var billnoRuleId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
        return $.ajax({
          type: 'GET',
          url: "/df/billNoRule/findSysRulesByBillNoRuleId.do?tokenid=" + tokenid,
          cache: false,
          data: {
            'billnoRuleId': billnoRuleId,
            "ajax":"noCache"
          }
        });
      });
      reqTable.done(function (result) {
          if (result.errorCode === 0) {
            initTable(result);
            var treeObj = $.fn.zTree.getZTreeObj('tree');
            var nodes = treeObj.getSelectedNodes();
            var treeNodeName = nodes[0].name;
            var arr = treeNodeName.split(' ');
            var ruleNumber = arr[0];
            var ruleName = arr[1];
            //noinspection JSAnnotator
            viewModel.ruleNumberData.setSimpleData({
              ruleNumber: ruleNumber
            });
            //noinspection JSAnnotator
            viewModel.ruleNameData.setSimpleData({
              ruleName: ruleName
            });
            $("#appModel").val(viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id);
          } else if (result.errorCode === -1) {
        	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
          } else {
        	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
          }
        }
      );
    },
    cancel: function () {
//      go("#billno-list-contanier");
    	$('#setRuleWindow').modal('hide');
    }
  };

  // 修改按钮单击事件
  viewModel.editUpdate = function () {
    // 需要展现的数据
    var billnoRuleData = {
      // 节点ID集合
      treeData: [],
      // 表格数据
      data: [],
      ruleNumber: '',
      ruleName: '',
      sys_id: ''
    };
    // 要编辑的单据id
    var billId = '';

    var treeDataArr = viewModel.treeDataTable.getSimpleData();
    if (treeDataArr !== undefined) {
      for (var i = 0, length = treeDataArr.length; i < length; i++) {
        if (treeDataArr[i].cid !== 0 && treeDataArr[i].id !== treeDataArr[i].cid) {
          billnoRuleData.treeData.push(treeDataArr[i].cid.slice(0, -1));
        }
      }
    }

    var nodes = $("#tree")[0]['u-meta'].tree.getSelectedNodes();
    if (nodes !== null && nodes.length > 0) {
      var billnoRuleId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
      billId = billnoRuleId;
      if (nodes[0].getParentNode() !== null && nodes[0].getParentNode().id !== 0) {
        // 后续ajax交互程序
        var req = $.ajax({
          type: 'GET',
          url: "/df/billNoRule/findSysRulesByBillNoRuleId.do?tokenid=" + tokenid,
          data: {
            'billnoRuleId': billnoRuleId,
            "ajax":"noCache"
          },
          cache: false
        });
        req.done(function (result) {
          if (result.errorCode === 0) {
            billnoRuleData.data = result.data;
            var treeNodeName = nodes[0].name;
            var arr = treeNodeName.split(' ');
            billnoRuleData.ruleNumber = arr[0];
            billnoRuleData.ruleName = arr[1];
            billnoRuleData.sys_id = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id;
            loadEditUpdateApp(onEditUpdateAppLoaded, billId, billnoRuleData);
          } else if (result.errorCode === -1) {
        	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
          } else {
        	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
          }
        })
          .fail(ncrd.commonAjaxError);
      } else {
        //提示消息
        ip.ipInfoJump("此节点不允许进行修改操作！", 'info');

      }
    } else {
      //提示消息
      ip.ipInfoJump("请选择一个要修改的单号规则！", 'info');
    }
  };

  function loadEditUpdateApp(onloaded, billId, billnoRuleData) {
    var container = $('#billno-editAdd-contanier');
    var url = "fap/system/config/billno/editUpdate";
    requirejs.undef(url);
    require([url], function (module) {
      ko.cleanNode(container[0]);
      container.html('');
      container.html(module.template);
      module.init(container[0]);
      editUpdateApp = module;
      if (onloaded) {
        onloaded(billId, billnoRuleData);
      }
    });
  }

  // 完成页面加载完成后的回调函数，需要等待编辑页面加载完才能执行的代码放在这里
  function onEditUpdateAppLoaded(billId, billnoRuleData) {
//    go("#billno-editAdd-contanier");
    editUpdateApp.show(billId, billnoRuleData, onEditUpdateAppClose);
  }

  // 完成页面关闭时的回调事件，save:保存关闭 cancel：取消关闭
  var onEditUpdateAppClose = {
    save: function (data) {
      var billnoRuleData = data;
//      go("#billno-list-contanier");
      $('#setRuleWindow').modal('hide');
      // 刷新列表页面数据 选中新增的节点

      var req = $.ajax({
        type: 'GET',
        url: '/df/billNoRule/treeInfo?tokenid=' + tokenid,
        cache: false,
        dataType: 'json',
        data:{"ajax":"noCache"}
      });
      var reqTable = req.then(function (result) {
        initTree(result,billnoRuleData);
        var treeObj = $.fn.zTree.getZTreeObj('tree');
        var nodes = treeObj.getSelectedNodes();
        var billnoRuleId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
        return $.ajax({
          type: 'GET',
          url: "/df/billNoRule/findSysRulesByBillNoRuleId.do?tokenid=" + tokenid,
          cache: false,
          data: {
            'billnoRuleId': billnoRuleId,
            "ajax":"noCache"
          }
        });
      });
      reqTable.done(function (result) {
          if (result.errorCode === 0) {
            initTable(result);
            var treeObj = $.fn.zTree.getZTreeObj('tree');
            var nodes = treeObj.getSelectedNodes();
            var treeNodeName = nodes[0].name;
            var arr = treeNodeName.split(' ');
            var ruleNumber = arr[0];
            var ruleName = arr[1];
            //noinspection JSAnnotator
            viewModel.ruleNumberData.setSimpleData({
              ruleNumber: ruleNumber
            });
            //noinspection JSAnnotator
            viewModel.ruleNameData.setSimpleData({
              ruleName: ruleName
            });
            $("#appModel").val(viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id);
          } else if (result.errorCode === -1) {
        	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
          } else {
        	  ip.ipInfoJump('查询失败，请稍后重试！', 'error');
          }
        }
      );
    },
    cancel: function () {
//      go("#billno-list-contanier");
    	$('#setRuleWindow').modal('hide');
    }
  };

  //通过格式的value值获取格式名称
  function getFormatNameByVal(format) {
    if (format === '0') {
      return "编码";
    }
    if (format === '1') {
      return "名称";
    }
    if (format === '2') {
      return "简称";
    }
  }

  //通过级次的value值获取级次名称
  function getLevelNameByVal(level) {
    if (level === '-1') {
      return "底级";
    } else if (level === '1') {
      return "一级";
    } else if (level === '2') {
      return "二级";
    } else if (level === '3') {
      return "三级";
    } else if (level === '4') {
      return "四级";
    } else if (level === '5') {
      return "五级";
    } else if (level === '6') {
      return "六级";
    } else if (level === '7') {
      return "七级";
    } else if (level === '8') {
      return "八级";
    } else if (level === '9') {
      return "九级";
    }
  }

  //通过变量的value值获取变量名称
  function getTypeNameByVal(type) {
    if (type === '0') {
      return "变量";
    } else if (type === '1') {
      return "日期";
    } else if (type === '2') {
      return "要素";
    } else if (type === '3') {
      return "要素自增序列";
    }
  }

  // 字符串多次复制拼接
  function repeat(n, str) {
    return new Array(isNaN(n) ? 1 : ++n).join(str);
  }

  function initTree(result,billnoRuleData) {
    var tempArr = [];
    var data = result.rows;
    var tempSysId = null;
    var tempPid = null;
    var dataLength = data.length;

    for (var i = 0; i < dataLength; i++) {
      if (data[i].id === data[i].cid) {
        // 确定根结点
        if (data[i].id === 0) {
          tempArr[i] = {
            "id": 0,
            "name": data[i].name,
            "pid": null,
            "cid": 0
          };
        } else { // 确定应用模块
          tempArr[i] = {
            id: data[i].id,
            cid: data[i].cid,
            pid: 0,
            name: data[i].name,
            sys_id: data[i].sys_id
          };
        }
      } else if (data[i].cid.length === 4) { // 节点cid为4位其父节点为应用模块
        tempArr[i] = {
          id: data[i].id,
          cid: data[i].cid,
          pid: data[i].sys_id,
          name: data[i].name,
          sys_id: data[i].sys_id
        };
      } else {
        tempSysId = data[i].sys_id;
        tempPid = data[i].cid.substring(0, data[i].cid.length - 4) + 't';
        tempArr[i] = {
          id: data[i].id,
          cid: data[i].cid,
          pid: data[i].sys_id,
          name: data[i].name,
          sys_id: data[i].sys_id
        };
        // 确定节点code为其他位数时其父节点
        for (var j = 0; j < dataLength; j++) {
          if (data[j].sys_id === tempSysId && data[j].cid === tempPid) {
            tempArr[i] = {
              id: data[i].id,
              cid: data[i].cid,
              pid: tempPid,
              name: data[i].name,
              sys_id: data[i].sys_id
            };
          }
        }
      }
    }
    viewModel.treeDataTable.removeAllRows();
    viewModel.treeDataTable.setSimpleData(tempArr, {
      unSelect: true
    });

    // 初始化时只展开单号规则节点
    var treeObj = $.fn.zTree.getZTreeObj('tree');
    var rootNode = treeObj.getNodeByParam("id", 0, null);
    treeObj.expandNode(rootNode, true, false, false);
    // 选中指定的节点
    if (billnoRuleData) {
      for (var i = 0, length = tempArr.length; i < length; i++) {
        if (tempArr[i].cid !== 0 && tempArr[i].cid.slice(0, -1) === billnoRuleData.billnorule_code) {

          viewModel.treeDataTable.setRowSelect(i);
          var sNodes = treeObj.getNodeByParam("id", tempArr[i].cid, null);
          treeObj.selectNode(sNodes);

          treeObj.expandNode(sNodes.getParentNode(), true, false, false);
          break;
        } else if (tempArr[i].cid !== 0 && tempArr[i].cid !== tempArr[i].id && tempArr[i].cid === billnoRuleData.id) {
         
          viewModel.treeDataTable.setRowSelect(i);
          var sNodes = treeObj.getNodeByParam("id", tempArr[i].cid, null);
          treeObj.selectNode(sNodes);

          treeObj.expandNode(sNodes.getParentNode(), true, false, false);
          break;
        } else if (tempArr[i].cid !== 0 && tempArr[i].cid === tempArr[i].id && tempArr[i].cid === billnoRuleData.id) {
  
          viewModel.treeDataTable.setRowSelect(i);
          var sNodes = treeObj.getNodeByParam("id", tempArr[i].cid, null);
          treeObj.selectNode(sNodes);

          treeObj.expandNode(sNodes.getParentNode(), true, false, false);
          break;
        }
      }
    }
  }

  function initTable(result) {
    viewModel.gridDataTable.setSimpleData(result.data, {
      unSelect: true
    });
    var rows = viewModel.gridDataTable.getAllRows();
    var tempString = '';
   
    for (var i = 0, length = rows.length; i < length; i++) { //下拉列表名称和value值转换
      var line_type = rows[i].getValue('line_type');
      var ele_code = rows[i].getValue('ele_code');
      var line_format = rows[i].getValue('line_format');
      var level_num = rows[i].getValue('level_num');
      var elesTemp = rows[i].getValue('eles');
      var init_value = rows[i].getValue('init_value');
      if (line_type === '0') {
        tempString = tempString + init_value;
      } else if (line_type === '1') {
        if (line_format === 'YYYYMMDD') {
          tempString = tempString + '20170101';
        } else if (line_format === 'YYYYMM') {
          tempString = tempString + '201701';
        } else if (line_format === 'YYYY') {
          tempString = tempString + '2017';
        } else if (line_format === 'MMDD') {
          tempString = tempString + '0101';
        } else if (line_format === 'MM') {
          tempString = tempString + '01';
        } else if (line_format === 'DD') {
          tempString = tempString + '01';
        }
      } else if (line_type === '2') {
        tempString = tempString + '001';
      } else if (line_type === '3') {
        if (init_value.length > line_format) {
          tempString = tempString + init_value;
        } else {
          tempString = tempString + repeat(line_format - init_value.length, '0') + init_value;
        }
      }
      if (elesTemp !== null) {
        
        
        rows[i].setValue('eles_name', JSON.stringify(elesTemp.getSimpleData()));
      }
      rows[i].setValue('line_type_name', getTypeNameByVal(line_type));
      rows[i].setValue('ele_code_name', ncrd.getEleNameByCode(ele_code));
      if (line_type === '3' || line_type === '1') {
        rows[i].setValue('line_format_name', line_format); //位长 日期格式
      } else {
        rows[i].setValue('line_format_name', getFormatNameByVal(line_format)); //格式
      }
      rows[i].setValue('level_num_name', getLevelNameByVal(level_num));
    }
    
    viewModel.exampleMessage(tempString);
  }

  function init() {
    ko.cleanNode($("#billno-list-contanier")[0]);
    listApp = u.createApp({
      //el: '#billno-list-contanier',
      el: document.body,
      model: viewModel
    });

    tokenid = ip.getTokenId();
    viewModel.showBillnoTree(); // 初始化树
    viewModel.getBillnoModuels(); // 初始化下拉框
    viewModel.gridDataTable.setSimpleData([]); // 初始化表格

    // 页面点击隐藏右键菜单
    document.onclick = function () {
      var oDiv = $('.clickContent')[0];
      oDiv.style.display = 'none';
    };
  }

  init();
});