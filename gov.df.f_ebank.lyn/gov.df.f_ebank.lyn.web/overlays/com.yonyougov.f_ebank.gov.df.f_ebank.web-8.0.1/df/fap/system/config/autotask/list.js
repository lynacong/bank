require(['jquery', 'knockout', '/df/fap/system/config/ncrd.js', 'bootstrap', 'uui', 'tree', 'grid', 'ip'], function ($, ko, ncrd) {
  window.ko = ko;
  var listApp, editAddApp, editUpdateApp;
  var tokenid;

  // 定时任务管理数据模型
  var viewModel = {
    // 树查找功能
    treeKeyword: ko.observable(""),
    findTree: function () {
      ncrd.findTreeNode($.fn.zTree.getZTreeObj("tree"), viewModel.treeKeyword());
    },
    // 树组件设置
    treeSetting: {
      view: {
        showLine: false,
        selectedMulti: false
      },
      callback: {
        // 右键点击事件：增改删启用停用刷新
        onRightClick: function zTreeOnRightClick(event, treeId, treeNode) {
          // 选中节点
          var treeObj = $.fn.zTree.getZTreeObj("tree");
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
              // 点击子系统和节点显示信息
              if (treeNode.getParentNode() !== null) {
                viewModel.initTable();
              } else {
                viewModel.gridDataTable
                  .setSimpleData([]);
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
        autotask_no: {},
        autotask_id: {},
        autotask_code: {},
        autotask_name: {},
        sys_id: {},
        task_status: {},
        task_status_name: {},
        last_ver: {}
      }
    })
  };

  // 点击删除出现模态框
  viewModel.deleteBtn = function () {
    var treeNodes = $("#tree")[0]['u-meta'].tree.getSelectedNodes();
    if (treeNodes !== null && treeNodes.length > 0) {
      if (treeNodes[0].getParentNode() !== null && treeNodes[0].getParentNode().id !== 0) {
        if (treeNodes[0].children === undefined || treeNodes[0].children.length === 0) {
          var delConfirmMsg = '确定删除此任务吗？';
          ip.warnJumpMsg(delConfirmMsg, 'delConfirmSureId', 'delConfirmCancelCla');
          $('#delConfirmSureId').on('click', viewModel.deleteNode);
          $('#delConfirmSureId').on('click', function () {
            $('#config-modal').remove();
          });
          $('.delConfirmCancelCla').on('click', function () {
            $('#config-modal').remove();
          });
        } else {
          // 存在子节点，请先删除子节点再删除父节点!
          ip.ipInfoJump('存在子节点，请先删除子节点再删除父节点!', 'info');
        }
      } else {
        // 根节点和系统节点不允许删除
        ip.ipInfoJump('此节点不允许进行删除操作', 'info');
      }
    } else {
      // 需要选中节点
      ip.ipInfoJump('请选择您要删除的数据!', 'info');
    }
  };

  // 删除节点
  viewModel.deleteNode = function () {
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var nodes = treeObj.getSelectedNodes();
    var autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
    // 后续ajax交互程序
    $.ajax({
      type: 'GET',
      url: "/df/sysAutoTask/delete.do?tokenid=" + tokenid,
      data: {
        'autotask_id': autotaskId,
        "ajax": "noCache"
      },
      cache: false,
      success: function (result) {
        if (result.errorCode === 0) {
          ip.ipInfoJump("节点删除成功！", 'info'); // 提示消息
          for (var i = 0, l = nodes.length; i < l; i++) {
            var nextNode = nodes[i].getNextNode();
            var preNode = nodes[i].getPreNode();
            var parentNode = nodes[i].getParentNode();
            treeObj.removeNode(nodes[i]);
            if (nextNode) {
              viewModel.showTaskTree(nextNode);
            } else if (preNode) {
              viewModel.showTaskTree(preNode);
            } else {
              viewModel.showTaskTree(parentNode);
            }
          }
          viewModel.gridDataTable.setSimpleData([]);
        }
      },
      error: ncrd.commonAjaxError
    });
  };

  // 左边树初始化
  viewModel.showTaskTree = function (autotaskData, callback) {
    // 后续ajax交互程序
    $.ajax({
      type: 'GET',
      url: '/df/sysAutoTask/initTree.do?tokenid=' +
      tokenid,
      cache: false,
      data: {
        "ajax": "noCache"
      },
      dataType: 'json',
      success: function (result) {
        if (result.data) {
          var tempArr = [];
          var data = result.data;
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

          // 初始化时只展开自动任务节点
          var treeObj = $.fn.zTree
            .getZTreeObj('tree');
          var rootNode = treeObj.getNodeByParam("id", 0, null);
          treeObj.expandNode(rootNode, true, false, false);

          // 选中指定的节点
          if (autotaskData) {
            for (var i = 0, length = tempArr.length; i < length; i++) {
              var sNodes = null;
              if (tempArr[i].cid !== 0 && tempArr[i].cid.slice(0, -1) === autotaskData.autotask_code) {
                viewModel.treeDataTable.setRowSelect(i);
                sNodes = treeObj.getNodeByParam("id", tempArr[i].cid, null);
                treeObj.selectNode(sNodes);
                treeObj.expandNode(sNodes.getParentNode(), true, false, false);
                break;
              } else if (tempArr[i].cid !== 0 && tempArr[i].cid !== tempArr[i].id && tempArr[i].cid === autotaskData.cid) {
                viewModel.treeDataTable.setRowSelect(i);
                sNodes = treeObj.getNodeByParam("id", tempArr[i].cid, null);
                treeObj.selectNode(sNodes);
                treeObj.expandNode(sNodes.getParentNode(), true, false, false);
                break;
              } else if (tempArr[i].cid !== 0 && tempArr[i].cid === tempArr[i].id && tempArr[i].cid === autotaskData.cid) {
                viewModel.treeDataTable.setRowSelect(i);
                sNodes = treeObj.getNodeByParam("id", tempArr[i].cid, null);
                treeObj.selectNode(sNodes);
                treeObj.expandNode(sNodes.getParentNode(), true, false, false);
                break;
              }
            }
          }

          if (typeof callback === "function") {
            callback();
          }
        }
      },
      error: ncrd.commonAjaxError
    });
  };

  // 初始化表格
  viewModel.initTable = function () {
    var autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
    var type = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id
    // ajax交互程序
    $.ajax({
      type: 'GET',
      url: "/df/sysAutoTask/findOneById.do?tokenid=" + tokenid,
      data: {
        'autotask_id': autotaskId,
        'type': type,
        "ajax": "noCache"
      },
      cache: false,
      success: function (result) {
        if (result.errorCode === 0) {
          viewModel.gridDataTable.setSimpleData(
            result.data, {
              unSelect: true
            });
          var tempArr = viewModel.gridDataTable.getAllRows();
          for (var i = 0, length = tempArr.length; i < length; i++) {
            var temp = i + 1;
            tempArr[i].setValue('autotask_no', temp);
            var task_status = tempArr[i].getValue('task_status');
            if (task_status === '1') {
              tempArr[i].setValue('task_status_name', '未启用');
            } else if (task_status === '2') {
              tempArr[i].setValue('task_status_name', '运行中');
            } else if (task_status === '3') {
              tempArr[i].setValue('task_status_name', '挂起');
            } else if (task_status === '4') {
              tempArr[i].setValue('task_status_name', '执行中');
            }
          }
        } else if (result.errorCode === -1) {
          ip.ipInfoJump('系统出现异常，请稍后重试！', 'error');
        } else {
          ip.ipInfoJump('系统出现异常，请稍后重试！', 'error');
        }
      },
      error: ncrd.commonAjaxError
    });
  };

  // 切换当前显示的界面
//  function go(showCollapse) {
//    $("div.container-fluid.ncrd.collapse").collapse('hide');
//    $(showCollapse).collapse('show');
//  }

  // 新增按钮单击事件 只有子系统有这个功能
  viewModel.editAdd = function () {
    // 需要展现的数据
    var autotaskData = {
      // 节点ID集合
      treeData: [],
      sys_id: ''
    };
    // 要编辑的单据id
    var autotaskId = '';
    var treeDataArr = viewModel.treeDataTable.getSimpleData();
    if (treeDataArr !== undefined) {
      for (var i = 0, length = treeDataArr.length; i < length; i++) {
        if (treeDataArr[i].cid !== 0 && treeDataArr[i].id !== treeDataArr[i].cid) {
          autotaskData.treeData.push(treeDataArr[i].cid.slice(0, -1));
        }
      }
    }
    var nodes = $("#tree")[0]['u-meta'].tree.getSelectedNodes();
    if (nodes !== null && nodes.length > 0 && nodes[0].id !== 0) {
//      autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
      if (nodes[0].getParentNode() !== null && nodes[0].getParentNode().id === 0) {
        autotaskData.sys_id = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id;
        loadEditAddApp(onEditAddAppLoaded, autotaskId, autotaskData);
      } else {
        ip.ipInfoJump("请选择在子系统上新增！", 'info'); // 提示消息
      }
    }else if(nodes.length === 0) {
    	loadEditAddApp(onEditAddAppLoaded, autotaskId, autotaskData);
    } else if (nodes !== null && nodes.length > 0 && nodes[0].id === 0) {
    	ip.ipInfoJump("请选择在子系统上新增！", 'info'); // 提示消息
    }
  };

  function loadEditAddApp(onloaded, autotaskId, autotaskData) {
    var container = $('#timingtask-editAdd-contanier');
    var url = "fap/system/config/autotask/edit";
    requirejs.undef(url);
    require([url], function (module) {
      ko.cleanNode(container[0]);
      container.html('');
      container.html(module.template);
      module.init(container[0]);
      editAddApp = module;
      if (onloaded) {
        onloaded(autotaskId, autotaskData);
      }
    });
  }

  // 完成页面加载完成后的回调函数，需要等待编辑页面加载完才能执行的代码放在这里
  function onEditAddAppLoaded(autotaskId, autotaskData) {
//    go("#timingtask-editAdd-contanier");
    editAddApp.show(autotaskId, autotaskData, onEditAddAppClose);
  }

  // 完成页面关闭时的回调事件，save:保存关闭 cancel：取消关闭
  var onEditAddAppClose = {
    save: function (data) {
      var autotaskData = data;
//      go("#timingtask-list-contanier");
      $('#TimingManagerEdit').modal('hide');
      // 刷新列表页面数据 选中新增的节点
      viewModel.showTaskTree(autotaskData,viewModel.initTable);

//      var treeObj = $.fn.zTree.getZTreeObj("tree");
//      var nodes = treeObj.getSelectedNodes();
//      viewModel.initTable();
    },
    cancel: function () {
//      go("#timingtask-list-contanier");
      $('#TimingManagerEdit').modal('hide');
    }
  };

  // 修改按钮单击事件
  viewModel.editUpdate = function () {
    // 需要展现的数据
    var autotaskData = {
      // 节点ID集合
      treeData: [],
      sys_id: ''
    };
    // 要编辑的定时任务id
    var autotaskId = '';
    var treeDataArr = viewModel.treeDataTable.getSimpleData();
    if (treeDataArr !== undefined) {
      for (var i = 0, length = treeDataArr.length; i < length; i++) {
        if (treeDataArr[i].cid !== 0 && treeDataArr[i].id !== treeDataArr[i].cid) {
          autotaskData.treeData.push(treeDataArr[i].cid
            .slice(0, -1));
        }
      }
    }
    var nodes = $("#tree")[0]['u-meta'].tree.getSelectedNodes();
    if (nodes !== null && nodes.length > 0) {
      autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
      if (nodes[0].getParentNode() !== null && nodes[0].getParentNode().id !== 0) {
        loadEditUpdateApp(onEditUpdateAppLoaded, autotaskId, autotaskData);
      } else if (nodes[0].getParentNode() !== null &&  nodes[0].getParentNode().id === 0){ // 选中子系统
        ip.ipInfoJump("子系统节点不能修改！", 'info');
      } else if (nodes[0].getParentNode() === null) {
    	 ip.ipInfoJump("根节点不能修改！", 'info');  
      }
    } else {
      ip.ipInfoJump("请选择您要修改的数据！", 'info');
    }
  };

  function loadEditUpdateApp(onloaded, autotaskId, autotaskData) {
    var container = $('#timingtask-editAdd-contanier');
    var url = "fap/system/config/autotask/edit";
    requirejs.undef(url);
    require([url], function (module) {
      ko.cleanNode(container[0]);
      container.html('');
      container.html(module.template);
      module.init(container[0]);
      editUpdateApp = module;
      if (onloaded) {
        onloaded(autotaskId, autotaskData);
      }
    });
  }

  // 完成页面加载完成后的回调函数，需要等待编辑页面加载完才能执行的代码放在这里
  function onEditUpdateAppLoaded(autotaskId, autotaskData) {
//    go("#timingtask-editAdd-contanier");
    editUpdateApp.show(autotaskId, autotaskData, onEditUpdateAppClose);
  }

  // 完成页面关闭时的回调事件，save:保存关闭 cancel：取消关闭
  var onEditUpdateAppClose = {
    save: function (data) {
      var autotaskData = data;
//      go("#timingtask-list-contanier");
      $('#TimingManagerEdit').modal('hide');
      // 刷新列表页面数据 选中修改的节点
      viewModel.showTaskTree(autotaskData);
      var treeObj = $.fn.zTree.getZTreeObj("tree");
      var nodes = treeObj.getSelectedNodes();
      var autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
      // 根据data里面的状态值来判断是否实现重启自动任务 状态为运行启用状态则提示是否重启自动任务
      // 处于运行状态都要重启
      if (autotaskData.status !== '1') {
        var delConfirmMsg = '是否重启自动任务？';
        ip.warnJumpMsg(delConfirmMsg, 'delConfirmSureId', 'delConfirmCancelCla');
        $('#delConfirmSureId').on('click', viewModel.rebootTask);
        $('#delConfirmSureId').on('click', function () {
          $('#config-modal').remove();
        });
        $('.delConfirmCancelCla').on('click', function () {
          $('#config-modal').remove();
        });
      } else {
        // 直接填充表格
        viewModel.initTable();
      }
    },
    cancel: function () {
//      go("#timingtask-list-contanier");
      $('#TimingManagerEdit').modal('hide');
    }
  };

  viewModel.rebootTask = function () {
    var treeObj = $.fn.zTree.getZTreeObj("tree");
    var nodes = treeObj.getSelectedNodes();

    var autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;

    $.ajax({
      type: 'GET',
      url: "/df/sysAutoTask/changeStatus.do?tokenid=" + tokenid,
      data: {
        'autotask_id': autotaskId,
        'status': '4',
        "ajax": "noCache"
      },
      cache: false,
      success: function (result) {
        $.ajax({
          type: 'GET',
          url: "/df/sysAutoTask/changeStatus.do?tokenid=" + tokenid,
          data: {
            'autotask_id': autotaskId,
            'status': '1',
            "ajax": "noCache"
          },
          cache: false,
          success: function (result) {
            if (result.errorCode === 0) {
              viewModel.initTable();
            } else if (result.errorCode === -1) {
              ip.ipInfoJump('系统出现异常，请稍后重试！', 'error');
            } else {
              ip.ipInfoJump('系统出现异常，请稍后重试！', 'error');
            }
          },
          error: ncrd.commonAjaxError
        });
      },
      error: ncrd.commonAjaxError
    });
  };

  // 重新刷新页面
  viewModel.refresh = function () {
    viewModel.showTaskTree(); // 初始化树
    viewModel.gridDataTable.setSimpleData([]); // 初始化表格
  };

  // 停用任务按钮事件
  viewModel.taskDisabled = function () {
    // 需要停用的任务id
    var autotaskId = '';
    var nodes = $("#tree")[0]['u-meta'].tree.getSelectedNodes();
    if (nodes !== null && nodes.length > 0 && nodes[0].id !== 0) {
      if (nodes[0].getParentNode() !== null && nodes[0].getParentNode().id !== 0) {
        autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
        var type = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id;
        // ajax交互程序
        $.ajax({
          type: 'GET',
          url: "/df/sysAutoTask/findOneById.do?tokenid=" + tokenid,
          data: {
            'autotask_id': autotaskId,
            'type': type,
            "ajax": "noCache"
          },
          cache: false,
          success: function (result) {
            if (result.errorCode === 0) {
              viewModel.gridDataTable.setSimpleData(result.data, {
                unSelect: true
              });
              var rows = viewModel.gridDataTable.getAllRows();
              for (var i = 0, length = rows.length; i < length; i++) {
                var temp = i + 1;
                rows[i].setValue('autotask_no', temp);
                var task_status = rows[i].getValue('task_status');
                if (task_status === '1') {
                  rows[i].setValue('task_status_name', '未启用');
                } else if (task_status === '2') {
                  rows[i].setValue('task_status_name', '运行中');
                } else if (task_status === '3') {
                  rows[i].setValue('task_status_name', '挂起');
                } else if (task_status === '4') {
                  rows[i].setValue('task_status_name', '执行中');
                }
              }
              var status = rows[0].getValue('task_status');
              var taskName = rows[0].getValue('autotask_name');
              // 节点已经停用
              if (status === '1') {
                // 模态框：节点尚未启动
                var tempMessage = '自动任务[' + taskName + ']尚未启动!';
                ip.ipInfoJump(tempMessage, 'info');
              } else {
                // 传递信息给后台停用节点
                $.ajax({
                  type: 'GET',
                  url: "/df/sysAutoTask/changeStatus.do?tokenid=" + tokenid,
                  data: {
                    'autotask_id': autotaskId,
                    'status': '4',
                    "ajax": "noCache"
                  },
                  cache: false,
                  success: function (result) {
                    if (result.errorCode === 0) {
                      // 表格任务状态值改变
                      rows[0].setValue('task_status', '1');
                      rows[0].setValue('task_status_name', '未启用');
                      var tempMessage = '自动任务[' + taskName + ']停用成功!';
                      ip.ipInfoJump(tempMessage, 'info');
                    }
                  },
                  error: ncrd.commonAjaxError
                });
              }
            } else if (result.errorCode === -1) {
              ip.ipInfoJump('系统出现异常，请稍后重试！', 'error');
            }
          },
          error: ncrd.commonAjaxError
        });
      } else {
        ip.ipInfoJump('子系统节点不能使用该功能！', 'info');
      }
    } else {
      ip.ipInfoJump('请选择要停用的自动任务！', 'info');
    }
  };

  // 启用任务
  viewModel.taskEnabled = function () {
    // 需要停用的任务id
    var autotaskId = '';
    var nodes = $("#tree")[0]['u-meta'].tree.getSelectedNodes();

    if (nodes !== null && nodes.length > 0 && nodes[0].id !== 0) {
      if (nodes[0].getParentNode() !== null && nodes[0].getParentNode().id !== 0) {
        autotaskId = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().id;
        var type = viewModel.treeDataTable.getSelectedRows()[0].getSimpleData().sys_id;
        // ajax交互程序
        $.ajax({
          type: 'GET',
          url: "/df/sysAutoTask/findOneById.do?tokenid=" + tokenid,
          data: {
            'autotask_id': autotaskId,
            'type': type,
            "ajax": "noCache"
          },
          cache: false,
          success: function (result) {
            if (result.errorCode === 0) {
              viewModel.gridDataTable.setSimpleData(result.data, {
                unSelect: true
              });
              var rows = viewModel.gridDataTable.getAllRows();
              for (var i = 0, length = rows.length; i < length; i++) {
                var temp = i + 1;
                rows[i].setValue('autotask_no', temp);
                var task_status = rows[i].getValue('task_status');
                if (task_status === '1') {
                  rows[i].setValue('task_status_name', '未启用');
                } else if (task_status === '2') {
                  rows[i].setValue('task_status_name', '运行中');
                } else if (task_status === '3') {
                  rows[i].setValue('task_status_name', '挂起');
                } else if (task_status === '4') {
                  rows[i].setValue('task_status_name', '执行中');
                }
              }
              var status = rows[0].getValue('task_status');
              var taskName = rows[0].getValue('autotask_name');
              // 节点已经停用
              if (status !== '1') {
                // 模态框：节点已经启动
                var tempMessage = '自动任务[' + taskName + ']已经启动!';
                ip.ipInfoJump(tempMessage, 'info');
              } else {
                // 传递信息给后台停用节点
                $.ajax({
                  type: 'GET',
                  url: "/df/sysAutoTask/changeStatus.do?tokenid=" + tokenid,
                  data: {
                    'autotask_id': autotaskId,
                    'status': '1',
                    "ajax": "noCache"
                  },
                  cache: false,
                  success: function (result) {
                    if (result.errorCode === 0) {
                      // 表格任务状态值改变
                      rows[0].setValue('task_status', '2');
                      rows[0].setValue('task_status_name', '运行中');
                      var tempMessage = '自动任务[' + taskName + ']启用成功!';
                      ip.ipInfoJump(tempMessage, 'info');
                    }
                  },
                  error: ncrd.commonAjaxError
                });
              }
            } else if (result.errorCode === -1) {
            	ip.ipInfoJump('系统出现异常，请稍后重试！', 'error');
            }
          },
          error: ncrd.commonAjaxError
        });
      } else {
        ip.ipInfoJump('子系统节点不能使用该功能！', 'info');
      }
    } else {
      ip.ipInfoJump('请选择要启用的自动任务！', 'info');
    }
  };

  function init() {
    ko.cleanNode($("#timingtask-list-contanier")[0]);
    listApp = u.createApp({
      el: document.body,
      model: viewModel
    });

    tokenid = ip.getTokenId();
    viewModel.showTaskTree(); // 初始化树
    viewModel.gridDataTable.setSimpleData([]); // 初始化表格

    // 页面点击隐藏右键菜单
    document.onclick = function () {
      var oDiv = $('.clickContent')[0];
      oDiv.style.display = 'none';
    };
  }

  init();

});