/**
 * Created by xufeng on 2017/4/18.
 */
require(['jquery', 'knockout', '/df/fap/system/config/ncrd.js', 'bootstrap',
  'uui', 'tree', 'grid', 'ip'], function ($, ko, ncrd) {
  window.ko = ko;
  var tokenid;

  // 数据模型
  var viewModel = {
    // 表格的数据格式
    gridDataTable: new u.DataTable({
      meta: {
        autotask_no: {},
        autotask_id: {},
        autotask_code: {},
        autotask_name: {},
        start_time: {},
        last_exe_time: {},
        total_count: {},
        success_count: {},
        fail_count: {},
        task_status: {},
        task_status_name: {}
      }
    })
  };

  // 表格初始化
  viewModel.showGrid = function () {
    // 后续ajax交互程序
    $.ajax({
      type: 'GET',
      url: '/df/sysAutoTask/findAllEnableTask.do?tokenid=' + tokenid,
      dataType: 'json',
      cache: false,
      data: {
        'ajax': 'noCache'
      },
      success: function (result) {
        viewModel.gridDataTable.setSimpleData(result.data, {
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
      },
      error: ncrd.commonAjaxError
    });
  };

  // 挂起自动任务
  viewModel.hangTask = function () {
    var status = '2';
    var tempArr = viewModel.gridDataTable.getSelectedRows();
    if (tempArr.length === 0) {
      // 没有选中节点提示
      ip.ipInfoJump('请选择要挂起的自动任务', 'info');
    } else {
      var autotaskId = tempArr[0].getSimpleData().autotask_id;
      var autotask_status = tempArr[0].getSimpleData().task_status;
      var taskName = tempArr[0].getValue('autotask_name');
      if (autotask_status !== '3') {
        // 可以执行
        // 后续ajax交互程序
        $.ajax({
          type: 'GET',
          url: '/df/sysAutoTask/pause.do?tokenid=' + tokenid,
          data: {
            'autotask_id': autotaskId,
            'status': status,
            'ajax': 'noCache'
          },
          success: function (result) {
            if (result.errorCode === 0) {
              var tempMessage = '自动任务[' + taskName + ']挂起成功!';
              ip.ipInfoJump(tempMessage, 'info');
              tempArr[0].setValue('task_status', '3');
              tempArr[0].setValue('task_status_name', '挂起');
            }
          },
          error: ncrd.commonAjaxError
        });
      } else {
        // 自动任务已经挂起了
        var tempMessage = '自动任务[' + taskName + ']已经挂起!';
        ip.ipInfoJump(tempMessage, 'info');
      }
    }
  };

  // 恢复自动任务
  viewModel.restoreTask = function () {
    var status = '3';
    var tempArr = viewModel.gridDataTable.getSelectedRows();
    if (tempArr.length === 0) {
      // 没有选中节点提示
      ip.ipInfoJump('请选择要恢复的自动任务!', 'info');
    } else {
      var autotaskId = tempArr[0].getSimpleData().autotask_id;
      var autotask_status = tempArr[0].getSimpleData().task_status;
      var taskName = tempArr[0].getValue('autotask_name');
      if (autotask_status === '3') {
        // 可以执行
        // 后续ajax交互程序
        $.ajax({
          type: 'GET',
          url: '/df/sysAutoTask/resume.do?tokenid=' + tokenid,
          data: {
            'autotask_id': autotaskId,
            'status': status,
            'ajax': 'noCache'
          },
          success: function (result) {
            if (result.errorCode === 0) {
              var tempMessage = '自动任务[' + taskName + ']恢复成功!';
              ip.ipInfoJump(tempMessage, 'info');
              tempArr[0].setValue('task_status', '2');
              tempArr[0].setValue('task_status_name', '运行中');
            }
          },
          error: ncrd.commonAjaxError
        });
      } else {
        // 自动任务正在运行
        var tempMessage = '自动任务[' + taskName + ']正在运行!';
        ip.ipInfoJump(tempMessage, 'info');
      }
    }
  };

  // 手工执行自动任务
  viewModel.performTask = function () {
    var tempArr = viewModel.gridDataTable.getSelectedRows();
    if (tempArr.length === 0) {
      // 没有选中节点提示
      ip.ipInfoJump('请选择要手工执行的自动任务!', 'info');
    } else {
      var autotaskId = tempArr[0].getSimpleData().autotask_id;
      var taskName = tempArr[0].getValue('autotask_name');
      // 可以执行
      // 后续ajax交互程序
      $.ajax({
          type: 'GET',
          url: '/df/sysAutoTask/execute.do?tokenid=' + tokenid,
          data: {
            'autotask_id': autotaskId,
            'ajax': 'noCache'
          },
          success: function (result) {
            if (result.errorCode === 0) {
              if (result.data === 0) {
                var tempMessage = '自动任务[' + taskName
                  + ']手动执行成功!';
                ip.ipInfoJump(tempMessage, 'info');
                // 重新刷新表格
                viewModel.showGrid();
              } else if (result.data === 1) {
                var tempMessage = '自动任务[' + taskName
                  + ']有参数,不能执行!';
                ip.ipInfoJump(tempMessage, 'info');
                // 重新刷新表格
                viewModel.showGrid();
              } else if (result.data === 2) {
                var tempMessage = '自动任务[' + taskName
                  + ']不存在,不能执行!';
                ip.ipInfoJump(tempMessage, 'info');
                // 重新刷新表格
                viewModel.showGrid();
              }
            } else if (result.errorCode === -2) {
              var tempMessage = '自动任务[' + taskName
                + ']已挂起，手动执行失败!';
              ip.ipInfoJump(tempMessage, 'info');
            } else if (result.errorCode === -1) {
            	var tempMessage = '系统出现异常请稍后重试!';
              ip.ipInfoJump(tempMessage, 'info');
            }
          },
          error: ncrd.commonAjaxError
        });
    }
  };

  function init() {
    ko.cleanNode($('#timingTask-list-contanier')[0]);
    listApp = u.createApp({
      el: document.body,
      model: viewModel
    });
    tokenid = ip.getTokenId();
    // 初始化表格
    viewModel.showGrid();
  }

  init();
});