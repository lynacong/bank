require(['jquery', 'knockout', 'bootstrap', 'uui', 'jquery.file.upload', 'grid', 'ip'], function ($, ko) {
  window.ko = ko;

  var app,
    tokenid,
    lock = 1; // 防止按钮重复提交Ajax请求

  var viewModel = {
    sortNameValue: ko.observable(''), // 分类名称
    sortCodeValue: ko.observable(''), // 分类代号
    sortInfoValue: ko.observable(''), // 分类说明
    attachCodeValue: ko.observable(''), // 业务编号
    attachNameValue: ko.observable(''), // 附件名称
    selectedSort: ko.observable(''), // 附件分类
    sortOptions: ko.observableArray([]), // 附件分类选项
    selectedSysId: ko.observable(''), // 子系统
    sysIdOptions: ko.observableArray([]), // 子系统选项
    attachNewCodeValue: ko.observable(''), // 新增业务编号
    attachOldCodeValue: ko.observableArray([]), // 原有业务编号
    selectedSortNumberValue: ko.observable(''), // 所选择的附件分类
    selectedAttachFileId: ko.observable(''), // 所选择的附件ID
    fileSize: ko.observable(0), // 文件大小
    fileDataArray: ko.observableArray([]), // 上传文件数组
    fileUploadData: ko.observable(''), // 上传文件数据
    status: ko.observable('0'),
    // 附件分类数据模型
    attachSort: new u.DataTable({
      meta: {
        'sortnumber': '', // 分类编号
        'sortname': '', // 分类名称
        'sortcode': '', // 分类代号
        'sortinfo': '' // 分类信息
      }
    }),
    // 附件数据模型
    attachFiles: new u.DataTable({
      meta: {
        'attach_id': '', // 附件ID
        'busi_id': '', // 业务编号
        'attach_name': '', // 附件名称
        'create_by': '', // 附件上传人
        'createTime': '', // 附件上传时间
        'attach_info': '', // 附件说明
        'attach_type': '' // 附件类型
      },
      pageSize: 10
    }),

    // 上传文件数据模型
    uploadedFiles: new u.DataTable({
      meta: {
        'busi_id': {
          type: 'string'
        },
        'name': {
          type: 'string'
        }
      }
    }, this),
    // 已经上传文件数据模型
    existedFile: new u.DataTable({
      meta: {
        'busi_id': {
          type: 'string'
        },
        'attach_id': {
          type: 'string'
        },
        'name': {
          type: 'string'
        }
      }
    }, this)
  };

  /**
   * 初始化附件分类列表
   * @param sortCodeValue
   * @param sys_id
   */
  viewModel.initSortList = function (sortCodeValue, sys_id) {
    var req = $.ajax({
      type: 'GET',
      url: '/df/attach/getAttachCategroy.do?tokenid=' + tokenid,
      cache: false,
      dataType: 'json',
      data: {
        'sys_id': sys_id,
        'ajax': 'noCache'
      }
    });

    req.done(function (result) {
      var errorCode = result.errorCode;
      var sortList;
      var AttachSort;

      if (errorCode === '0') {
        sortList = result.data;
        viewModel.attachSort.setSimpleData(sortList);
        // 初始化附件分类下拉列表
        viewModel.sortOptions([]);
        AttachSort = function (sortnumber, sortname, sortcode) {
          this.sort_id = sortnumber;
          this.sort_name = '[' + sortcode + ']' + sortname;
        };
        for (var i = 0, l = result.data.length; i < l; i++) {
          viewModel.sortOptions.push(new AttachSort(result.data[i].sortnumber,
            result.data[i].sortname, result.data[i].sortcode));
        }

        // 初始化附件表格
        viewModel.attachFiles.setSimpleData([]);
        // 选中新增的节点
        if (sortCodeValue) {
          var rows = viewModel.attachSort.getAllRows();
          for (i = 0, l = rows.length; i < l; i++) {
            if (rows[i].getValue('sortcode') === sortCodeValue) {
              viewModel.attachSort.setRowSelect(i);
              var sortListGroup = $('.list-group');
              sortListGroup.find('.list-group-item').removeClass('sortActive');
              sortListGroup.find('.list-group-item').eq(i).addClass('sortActive');
              break;
            }
          }
        }
      } else {
        ip.ipInfoJump('附件分类初始化出现异常，请稍后重试！', 'error');
      }
    }).fail(function () {
      ip.ipInfoJump('附件分类初始化出现异常，请稍后重试！', 'error');
    });
  };

  /**
   * 初始化附件列表
   * @param sortnumber
   * @param index
   * @param attachCode
   */
  viewModel.initAttachTable = function (sortnumber, index, attachCode) {
    if (index !== undefined) {
      var sortListGroup = $('.list-group');
      sortListGroup.find('.list-group-item').removeClass('sortActive');
      sortListGroup.find('.list-group-item').eq(index).addClass('sortActive');
      var sortname = viewModel.attachSort.getRow(index).getValue('sortnumber');
      viewModel.selectedSort(sortnumber);
      viewModel.selectedSortNumberValue(sortnumber);
      viewModel.attachFiles.pageIndex('0');
      viewModel.attachFiles.pageSize('10');
    }

    var currentPage = viewModel.attachFiles.pageIndex();
    var pageSize = viewModel.attachFiles.pageSize();
    // 传输数据
    var queryData = {
      'pageStart': currentPage,
      'pageSize': pageSize,
      'sortnumber': sortnumber,
      'ajax': 'noCache'
    };

    $.ajax({
      type: 'GET',
      cache: false,
      url: '/df/attach/findAttachByCategoryId.do?tokenid=' + tokenid,
      data: queryData,
      dataType: 'JSON',
      success: function (result) {
        var errorCode = result.errorCode;
        if (errorCode === '0') {
          $('#selectAll').prop('checked', false);
          viewModel.attachOldCodeValue([]);
          var files = result.data.content;
          viewModel.attachFiles.setSimpleData(files);
          var rows = viewModel.attachFiles.getAllRows();
          for (var i = 0, l = rows.length; i < l; i++) {
            if (attachCode && attachCode === rows[i].getValue('busi_id')) {
              viewModel.attachFiles.setRowSelect(i);
              var sortListGroup = $('#attach-table');
              sortListGroup.find('tr').removeClass('attachActive');
              sortListGroup.find('tr').eq(i).addClass('attachActive');
            }
            viewModel.attachOldCodeValue.push(rows[i].getValue('busi_id'));
          }
          viewModel.attachFiles.totalPages(result.data.totalPages);
          viewModel.attachFiles.totalRow(result.data.size);
          $('#selectAll').click(function () {
            $('input[name="selectedFile"]').prop('checked', $('#selectAll').prop('checked'));
          });
          $('.selectedFile').click(function () {
            $('#selectAll').prop('checked', $('input[name="selectedFile"]').length ===
              $('input[name="selectedFile"]').filter(':checked').length);
          });
        } else {
          ip.ipInfoJump('查询附件出现异常，请稍后重试', 'error');
        }
      },
      error: function () {
        ip.ipInfoJump('查询附件出现异常，请稍后重试', 'error');
      }
    });
  };

  /**
   * 分页页码改变事件
   * @param index
   */
  viewModel.pageChangeFunc = function (index) {
    viewModel.attachFiles.pageIndex(index);
    viewModel.initAttachTable(viewModel.selectedSortNumberValue());
  };

  /**
   * 分页显示数量改变事件
   * @param size
   */
  viewModel.sizeChangeFunc = function (size) {
    viewModel.attachFiles.pageSize(size);
    viewModel.attachFiles.pageIndex('0');
    viewModel.initAttachTable(viewModel.selectedSortNumberValue());
  };

  /**
   * 新增附件分类
   */
  viewModel.addSort = function () {
    var sys_id = $('#sys-id').val();
    if (!sys_id) {
      ip.ipInfoJump('请选择一个子系统！', 'info');
    } else {
      viewModel.sortCodeValue('');
      viewModel.sortNameValue('');
      viewModel.sortInfoValue('');
      document.getElementById('sort-code-error').innerHTML = '';
      document.getElementById('sort-name-error').innerHTML = '';
      $('#add-sort-box').modal({
        backdrop: 'static'
      });
    }
  };

  /**
   * 取消保存新增分类
   */
  viewModel.cancleAddSort = function () {
    $('#add-sort-box').modal('hide');
  };

  /**
   * 保存新增分类
   */
  viewModel.confirmAddSort = function () {
    var flag = true;
    var sys_id = $('#sys-id').val();
    var sortNameValue = $('#sort-name').val();
    var sortCodeValue = $('#sort-code').val();
    var sortInfoValue = $('#sort-info').val();

    if (isNull(sortNameValue)) {
      document.getElementById('sort-name-error').innerHTML = '分类名称不能为空';
      flag = false;
    }

    if (isNull(sortCodeValue)) {
      document.getElementById('sort-code-error').innerHTML = '分类代号不能为空';
      flag = false;
    }

    if (checkValid(sortCodeValue)) {
      document.getElementById('sort-code-error').innerHTML = '格式错误，只能由字母、数字、中横杠_、下横杠-、组成';
      flag = false;
    }

    var oldSortCodeArr = [];
    var oldSortCodeObjArr = viewModel.attachSort.getSimpleData({
      'fields': ['sortcode']
    });
    for (var i = 0, l = oldSortCodeObjArr.length; i < l; i++) {
      oldSortCodeArr.push(oldSortCodeObjArr[i].sortcode);
    }

    if (!checkValue(sortCodeValue, oldSortCodeArr)) {
      document.getElementById('sort-code-error').innerHTML = '该分类代号已经存在';
      flag = false;
    }

    if (flag && lock) {
      var req = $.ajax({
        type: 'GET',
        url: '/df/attach/saveAttachCategory.do?tokenid=' + tokenid,
        cache: false,
        dataType: 'json',
        beforeSend: function () {
          lock = 0;
        },
        data: {
          'sys_id': sys_id,
          'sortNameValue': sortNameValue,
          'sortCodeValue': sortCodeValue,
          'sortInfoValue': sortInfoValue,
          'ajax': 'noCache'
        }
      });
      req.done(function (result) {
        if (result.errorCode === '0') {
          var sys_id = $('#sys-id').val();
          viewModel.initSortList(sortCodeValue, sys_id);
          $('#add-sort-box').modal('hide');
          lock = 1;
          ip.ipInfoJump('保存成功！', 'success');
        } else if (result.errorCode === '-1') {
          ip.ipInfoJump('保存失败，请稍后重试！', 'error');
        }
      });
      req.fail(function () {
        lock = 1;
        ip.ipInfoJump('保存失败，请稍后重试！', 'error');
      });
    }
  };

  /**
   * 删除附件分类按钮点击事件
   */
  viewModel.deleteSortBtn = function (index, sortnumber) {
    viewModel.attachSort.setRowSelect(index);
    var req = $.ajax({
      type: 'GET',
      url: '/df/attach/findAttachByCategoryId.do?tokenid=' + tokenid,
      cache: false,
      dataType: 'json',
      data: {
        'pageStart': '0',
        'pageSize': '10',
        'sortnumber': sortnumber,
        'ajax': 'noCache'
      }
    });
    req.done(function (result) {
      var files;
      var delConfirmMsg;

      if (result.errorCode === '0') {
        files = result.data.content;
        if (files.length) {
          delConfirmMsg = '该分类还有附件存在，不能进行删除操作？';
          viewModel.initAttachTable(sortnumber, index);
          ip.warnJumpMsg(delConfirmMsg, 'delConfirmSureId', 'delConfirmCancelCla');
          $('#delConfirmSureId').on('click', function () {
            $('#config-modal').remove();
          });
          $('.delConfirmCancelCla').on('click', function () {
            $('#config-modal').remove();
          });
        } else {
          delConfirmMsg = '是否删除这个附件分类？';
          viewModel.initAttachTable(sortnumber, index);
          ip.warnJumpMsg(delConfirmMsg, 'delConfirmSureId', 'delConfirmCancelCla');
          $('#delConfirmSureId').on('click', function () {
            viewModel.deleteSort();
            $('#config-modal').remove();
          });
          $('.delConfirmCancelCla').on('click', function () {
            $('#config-modal').remove();
          });
        }
      }
    });
  };

  /**
   * 删除附件分类
   */
  viewModel.deleteSort = function () {
    var data = viewModel.attachSort.getSimpleData({
      type: 'current',
      'fields': ['sortnumber']
    })[0];
    $.ajax({
      type: 'GET',
      cache: false,
      url: '/df/attach/deleteAttachCategory.do?tokenid=' + tokenid,
      data: {
        'sortnumber': data.sortnumber
      },
      dataType: 'JSON',
      success: function (result) {
        var errorCode = result.errorCode;
        if (errorCode === '0') {
          var sys_id = $('#sys-id').val();
          // 初始化附件分类列表
          viewModel.initSortList('', sys_id);
          // 初始化附件表格
          viewModel.attachFiles.setSimpleData([]);
          ip.ipInfoJump('删除成功！', 'success');
        } else {
          ip.ipInfoJump('删除附件分类出现异常，请稍后重试', 'error');
        }
      },
      error: function () {
        ip.ipInfoJump('删除附件分类出现异常，请稍后重试', 'error');
      }
    });
  };

  /**
   * 新增附件
   */
  viewModel.addAttach = function () {
    var sys_id = $('#sys-id').val();
    if (!sys_id) {
      ip.ipInfoJump('请选择一个子系统！', 'info');
    } else {
      $('#add-attach-box').modal({
        backdrop: 'static'
      });
      $('#attach-add-confirm').click(function () {
        viewModel.confirmAddAttach();
      });
      document.getElementById('attach-sort-error').innerHTML = '';
      document.getElementById('attach-new-code-error').innerHTML = '';
      document.getElementById('fileupload-error').innerHTML = '';
      document.getElementById('sort-code-error').innerHTML = '';
      $('#progress .progress-bar').css('width', 0).html('');
    }
  };

  /**
   * 取消保存新增附件
   */
  viewModel.cancleAddAttach = function () {
    $('#add-attach-box').modal('hide');
    viewModel.attachNewCodeValue('');
    viewModel.selectedSort('');
    viewModel.fileSize(0);
    viewModel.fileDataArray([]);
    $('#attach-add-confirm').off('click');
    viewModel.uploadedFiles.setSimpleData([]);
    viewModel.fileUploadData('');
  };

  /**
   * 保存新增附件
   */
  viewModel.confirmAddAttach = function () {
    var flag = true;
    var sys_id = $('#sys-id').val();
    var attachNewCodeValue = $('#attach-new-code').val();
    var selectedSort = $('#attach-sort').val();

    // 数据校验
    if (isNull(selectedSort)) {
      document.getElementById('attach-sort-error').innerHTML = '请选择附件分类';
      flag = false;
    } else {
      var rows = viewModel.attachSort.getAllRows();
      for (var i = 0, l = rows.length; i < l; i++) {
        if (selectedSort === rows[i].getValue('sortnumber')) {
          viewModel.selectedSortNumberValue(rows[i].getValue('sortnumber'));
          break;
        }
      }
    }

    if (attachNewCodeValue && checkValid(attachNewCodeValue)) {
      document.getElementById('attach-new-code-error').innerHTML = '格式错误，只能由字母、数字、中横杠_、下横杠-、组成';
      flag = false;
    }

    var oldAttachCodeArr = [];
    var oldAttachCodeObjArr = viewModel.attachFiles.getSimpleData({
      'fields': ['busi_id']
    });
    for (var m = 0, n = oldAttachCodeObjArr.length; m < n; m++) {
      oldAttachCodeArr.push(oldAttachCodeObjArr[m].busi_id);
    }

    if (attachNewCodeValue && !checkValue(attachNewCodeValue, oldAttachCodeArr)) {
      document.getElementById('attach-new-code-error').innerHTML = '该业务编号已经存在';
      flag = false;
    }
    if (!viewModel.uploadedFiles.getSimpleData() || viewModel.uploadedFiles.getSimpleData().length === 0) {
      document.getElementById('fileupload-error').innerHTML = '请选择要上传的文件';
      flag = false;
    } else {
      document.getElementById('fileupload-error').innerHTML = '';
    }

    if (flag && viewModel.uploadedFiles.getSimpleData() && viewModel.uploadedFiles.getSimpleData().length !== 0) {
      $.ajax({
        type: 'GET',
        url: '/df/attach/checkUploadCondition.do?tokenid=' + tokenid,
        data: {
          'attachSize': viewModel.fileSize()
        },
        dataType: 'JSON',
        success: function (result) {
          var errorCode = result.errorCode;
          if (errorCode === '0') {
            // 上传文件
            // 附加参数
            var data = viewModel.fileUploadData();
            data.files = viewModel.fileDataArray();
            var formData = {
              'sys_id': sys_id,
              'attachNewCodeValue': attachNewCodeValue,
              'selectedSort': selectedSort
            };
            data.formData = formData;
            data.submit();
          } else {
            ip.ipInfoJump(result.errorMsg, 'error');
          }
        },
        error: function () {
          ip.ipInfoJump('保存新增附件失败，请稍后重试', 'error');
        }
      });
    }
  };

  /**
   * 删除附件按钮点击事件
   * @param index
   */
  viewModel.deleteFileBtn = function (index) {
    viewModel.attachFiles.setRowSelect(index);
    var delConfirmMsg = '确定要删除这个附件吗？';
    ip.warnJumpMsg(delConfirmMsg, 'delConfirmSureId', 'delConfirmCancelCla');
    $('#delConfirmSureId').on('click', function () {
      viewModel.deleteFile();
      $('#config-modal').remove();
    });
    $('.delConfirmCancelCla').on('click', function () {
      $('#config-modal').remove();
    });
  };

  /**
   * 删除附件
   */
  viewModel.deleteFile = function () {
    var data = viewModel.attachFiles.getSimpleData({
      type: 'current',
      'fields': ['attach_id']
    })[0];

    var attachIdArr = [];
    attachIdArr.push(data.attach_id);
    $.ajax({
      type: 'POST',
      url: '/df/attach/deleteAttach.do?tokenid=' + tokenid,
      data: {
        'attach_id': attachIdArr
      },
      dataType: 'JSON',
      success: function (result) {
        var errorCode = result.errorCode;
        if (errorCode === '0') {
          viewModel.initAttachTable(viewModel.selectedSortNumberValue());
          ip.ipInfoJump('删除成功！', 'success');
        } else {
          ip.ipInfoJump('删除文件出现异常，请稍后重试！', 'error');
        }
      },
      error: function () {
        ip.ipInfoJump('删除文件出现异常，请稍后重试！', 'error');
      }
    });
  };

  /**
   * 批量删除按钮点击事件
   */
  viewModel.batchDeleteFileBtn = function () {
    var attachIdArr = [];

    $('input[name="selectedFile"]:checked').each(function () {
      attachIdArr.push($(this).val()); // 向数组中添加元素
    });
    if (attachIdArr.length !== 0) {
      var delConfirmMsg = '确定要删除所选中的附件吗？';
      ip.warnJumpMsg(delConfirmMsg, 'delConfirmSureId', 'delConfirmCancelCla');
      $('#delConfirmSureId').on('click', function () {
        viewModel.batchDeleteFile(attachIdArr);
        $('#config-modal').remove();
      });
      $('.delConfirmCancelCla').on('click', function () {
        $('#config-modal').remove();
      });
    }
  };

  /**
   * 批量删除附件
   */
  viewModel.batchDeleteFile = function (attachIdArr) {
    $.ajax({
      type: 'POST',
      url: '/df/attach/deleteAttach.do?tokenid=' + tokenid,
      data: {
        'attach_id': attachIdArr
      },
      dataType: 'JSON',
      success: function (result) {
        if (result.errorCode === '0') {
          viewModel.initAttachTable(viewModel.selectedSortNumberValue());
          ip.ipInfoJump('批量删除成功！', 'success');
        } else {
          ip.ipInfoJump('批量删除文件出现异常，请稍后重试！', 'error');
        }
      },
      error: function () {
        ip.ipInfoJump('批量删除文件出现异常，请稍后重试！', 'error');
      }
    });
  };

  /**
   * 上传附件
   */
  function fileupload() {
    var options = {
      url: '/df/attach/uploadattach.do?tokenid=' + tokenid,
      dataType: 'json',
      autoUpload: false,
      maxFileSize: 99 * 1024 * 1024,
      messages: {
        maxFileSize: '文件最大上传大小为99MB',
        acceptFileTypes: '文件类型不允许'
      },
      dropZone: $('#dropzone'),
      disableImageResize: /Android(?!.*Chrome)|Opera/
        .test(window.navigator.userAgent),
      previewMaxWidth: 100,
      previewMaxHeight: 100,
      previewCrop: true,
      singleFileUploads: false
    };
    $('#fileupload').fileupload(options)
      .bind('fileuploadadd', fileuploadadd)
      .bind('fileuploaddone', fileuploaddone)
      .bind('fileuploadprogressall', fileuploadprogressall)
      .bind('fileuploadfail', fileuploadfail)
      .prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
  }

  /**
   * 上传新附件
   */
  function newfileupload() {
    var options = {
      url: '/df/attach/updateAttachInfo.do?tokenid=' + tokenid,
      dataType: 'json',
      autoUpload: false,
      maxFileSize: 99 * 1024 * 1024,
      messages: {
        maxFileSize: '文件最大上传大小为99MB',
        acceptFileTypes: '文件类型不允许'
      },
      dropZone: $('#dropzone'),
      disableImageResize: /Android(?!.*Chrome)|Opera/
        .test(window.navigator.userAgent),
      previewMaxWidth: 100,
      previewMaxHeight: 100,
      previewCrop: true,
      singleFileUploads: false
    };

    $('#fileuploadNew').fileupload(options)
      .bind('fileuploadadd', newFileuploadadd)
      .bind('fileuploaddone', newFileuploaddone)
      .bind('fileuploadprogressall', fileuploadprogressall)
      .bind('fileuploadfail', newFileuploadfail)
      .prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
  }

  /**
   * 添加文件
   * @param e
   * @param data
   */
  function fileuploadadd(e, data) {
    // 避免文件多次选择
    var existedFiles = viewModel.uploadedFiles.getSimpleData({
      'fields': ['name']
    });
    var currentFiles;
    if (existedFiles && existedFiles.length) {
      currentFiles = existedFiles.map(function (item) {
        return item.name;
      });
    } else {
      currentFiles = [];
    }

    data.files = $.map(data.files, function (file, i) {
      if ($.inArray(file.name, currentFiles) >= 0) {
        return null;
      }
      return file;
    });
    var files = data.files.slice();

    var size = parseInt(viewModel.fileSize());
    var totalSize = 0;
    for (var i = 0; i < files.length; i++) {
      totalSize += files[i].size;
    }
    viewModel.fileSize(size + totalSize);
    viewModel.uploadedFiles.addSimpleData(files);
    viewModel.fileUploadData(data);
    viewModel.fileDataArray(viewModel.fileDataArray().concat(data.files));
    document.getElementById('fileupload-error').innerHTML = '';
  }

  /**
   * 上传到服务器成功
   * @param e
   * @param data
   */
  function fileuploaddone(e, data) {
    var selectedSort = $('#attach-sort').val();
    viewModel.attachFiles.pageIndex('0');
    viewModel.attachFiles.pageSize('10');
    viewModel.initAttachTable(selectedSort);
    $('#add-attach-box').modal('hide');
    var rows = viewModel.attachSort.getAllRows();
    for (i = 0, l = rows.length; i < l; i++) {
      if (rows[i].getValue('sortnumber') === selectedSort) {
        viewModel.attachSort.setRowSelect(i);
        var sortListGroup = $('.list-group');
        sortListGroup.find('.list-group-item').removeClass('sortActive');
        sortListGroup.find('.list-group-item').eq(i).addClass('sortActive');
        break;
      }
    }
    viewModel.attachNewCodeValue('');
    viewModel.selectedSort('');
    viewModel.fileSize(0);
    viewModel.fileDataArray([]);
    viewModel.uploadedFiles.setSimpleData([]);
    viewModel.fileUploadData('');
    $('#attach-add-confirm').off('click');
    ip.ipInfoJump('附件保存成功！', 'success');

  }

  /**
   * 进度条
   * @param e
   * @param data
   */
  function fileuploadprogressall(e, data) {
    var progress = parseInt(data.loaded / data.total * 100, 10);
    $('.progress-bar').css('width', progress + '%').html(progress + '%');
  }

  /**
   * 上传失败
   * @param e
   * @param data
   */
  function fileuploadfail(e, data) {
    ip.ipInfoJump('保存失败，请稍后重试！', 'error');
    viewModel.attachNewCodeValue('');
    viewModel.selectedSort('');
    viewModel.fileSize(0);
    viewModel.fileDataArray([]);
    viewModel.uploadedFiles.setSimpleData([]);
    viewModel.fileUploadData('');
    $('#attach-add-confirm').off('click');
    $('#progress .progress-bar').css('width', 0).html('');
  }

  /**
   * 添加新文件
   * @param e
   * @param data
   */
  function newFileuploadadd(e, data) {
    var file = data.files.slice();
    viewModel.fileSize(file.size);
    viewModel.existedFile.setSimpleData(data.files);
    viewModel.fileUploadData(data);
    viewModel.fileDataArray(viewModel.fileDataArray().concat(data.files));
  }

  /**
   * 上传新文件到服务器成功
   * @param e
   * @param data
   */
  function newFileuploaddone(e, data) {
    var selectedSort = viewModel.selectedSortNumberValue();
    viewModel.attachFiles.pageIndex('0');
    viewModel.attachFiles.pageSize('10');
    viewModel.initAttachTable(selectedSort);
    $('#add-attach-box').modal('hide');
    var rows = viewModel.attachSort.getAllRows();
    for (i = 0, l = rows.length; i < l; i++) {
      if (rows[i].getValue('sortnumber') === selectedSort) {
        viewModel.attachSort.setRowSelect(i);
        var sortListGroup = $('.list-group');
        sortListGroup.find('.list-group-item').removeClass('sortActive');
        sortListGroup.find('.list-group-item').eq(i).addClass('sortActive');
        break;
      }
    }
    viewModel.attachCodeValue('');
    viewModel.attachNameValue('');
    $('#edit-attach-box').modal('hide');
    viewModel.selectedSort('');
    viewModel.fileSize(0);
    viewModel.fileDataArray([]);
    viewModel.existedFile.setSimpleData([]);
    viewModel.fileUploadData('');
    ip.ipInfoJump('附件保存成功！', 'success');
//    u.messageDialog({
//      msg: '附件保存成功!',
//      title: '信息',
//      width: '200px',
//      btnText: '确定'
//    });
  }

  /**
   * 新文件上传失败
   * @param e
   * @param data
   */
  function newFileuploadfail(e, data) {
    ip.ipInfoJump('保存失败，请稍后重试！', 'error');
    viewModel.attachCodeValue('');
    viewModel.selectedSort('');
    viewModel.fileSize(0);
    viewModel.fileDataArray([]);
    viewModel.existedFile.setSimpleData([]);
    viewModel.fileUploadData('');
    $('#progress .progress-bar').css('width', 0).html('');
  }

  /**
   * 删除要上传的新文件
   */
  viewModel.removeFile = function (data) {
    var totalSize = viewModel.fileSize();
    var files = viewModel.uploadedFiles.getSimpleData();
    var fileDataArray = viewModel.fileDataArray();

    for (var i = 0; i < files.length; i++) {
      if (files[i].name === data.getValue('name')) {
        files.splice(i, 1);
        break;
      }
    }

    for (var j = 0; j < fileDataArray.length; j++) {
      if (fileDataArray[j].name === data.getValue('name')) {
        fileDataArray.splice(j, 1);
        break;
      }
    }

    viewModel.fileSize(totalSize - data.getValue('size'));
    viewModel.uploadedFiles.setSimpleData(files);
    viewModel.fileDataArray(fileDataArray);
  };

  // 清除进度条
  $('#fileupload').click(function () {
    $('#progress .progress-bar').css('width', 0).html('');
  });
  
  
  /**
   * 预览附件
   * @param attach_id
   */
  var srcPath;
  viewModel.previewFile = function (attach_id) {
	  $.ajax({
		type : 'GET',
		url : '/df/attach/previewFile.do?ajax=noCache&tokenid=' + tokenid,
		data : {
			'attach_id' : attach_id
		},
		dataType : 'JSON',
		async: true,
		beforeSend: ip.loading(true),
		success : function(result) {
			if (result.errorCode === '0') {
				var mydata = result.data;
				var typeFlag = mydata.typeFlag;
				if (typeFlag === '0') { //pdf预览
					$('#csof-right-iframe').media({width:870,height:430,src:mydata.htmlString});
				} else if (typeFlag === '1') { //图片预览
					var str = "<img id='img-show' src='" + mydata.htmlString + "' style='width:100%;min-height:430px;overflow:auto;/' >";
					$('#csof-right-iframe').html(str);
				} else { //其它office文件预览
				    $('#csof-right-iframe').html(mydata.htmlString);
				}
				if (typeFlag != '1') {
					ip.loading(false);
					$('#preview-attach-box').modal({backdrop: 'static'});
				} else {
					$("#img-show").load( function(){ //图片加载完成
						ip.loading(false);
						$('#preview-attach-box').modal({backdrop: 'static'});
					});
				}
			    srcPath = mydata.srcPath;
			} else {
				ip.ipInfoJump(result.message, "error");
			}
		}, 
		error : function () {
			ip.loading(false);
			ip.ipInfoJump("暂不支持该转换类型，请升级jdk后重试", "error");
		}
	});
  };
  
  /* 关闭预览 */
  viewModel.clsoePreview = function () {
	  $('#preview-attach-box').modal('hide');
	  $('#other').html('');
	  $('#other').html('<div id="csof-right-iframe" style="width:98%;height:430px;overflow-y:auto;"></div>');
	  if (srcPath != '') {
		  $.ajax({
			  type : 'POST',
			  url : '/df/attach/closePreview.do?tokenid=' + tokenid,
			  data : {
				  'filePath' : srcPath
			  },
		  	  dataType : 'JSON',
		  	  success : function (result) {
		  		if (result.errorCode == '-1') {
		  		  ip.ipInfoJump(result.message, "error");
		  		}
		  	  },
		  	  error : function (result) {
		  		ip.ipInfoJump("预览关闭出现异常，文件未及时删除," + result.message, "error");
		  	  }
		  });
	  }
  };

  /**
   * 下载附件
   * @param attach_id
   * @param attach_type
   */
  viewModel.downloadFile = function (attach_id, attach_type) {
    if (attach_type === '') {
      u.messageDialog({
        msg: '当前行没有附件!',
        title: '信息',
        width: '200px',
        btnText: '确定'
      });
    } else {
      $.ajax({
        type: 'GET',
        url: '/df/attach/checkAttachPath.do?tokenid=' + tokenid,
        data: {
          'attach_id': attach_id
        },
        dataType: 'JSON',
        success: function (result) {
          var errorCode = result.errorCode;
          if (errorCode === '-1') {
            ip.ipInfoJump(result.errorMsg, 'error');
          } else {
            var form = $("<form id='downloadForm'>");
            form.attr('style', 'display:none');
            form.attr('target', '');
            form.attr('method', 'post');
            var url = '/df/attach/download.do?tokenid=' + tokenid;
            form.attr('action', url);
            var input = $('<input>');
            input.attr('type', 'hidden');
            input.attr('name', 'attach_id');
            input.attr('value', attach_id);
            $('body').append(form);
            form.append(input);
            form.submit();
            form.remove();
            $('#downloadForm').remove();
          }
        },
        error: function (result) {
          ip.ipInfoJump(result.errorMsg, 'error');
        }
      });
    }
  };

  /**
   * 编辑附件信息
   * @param index
   * @param row
   */
  viewModel.editFile = function (index, row) {
    var attach_type = row.getValue('attach_type');
    viewModel.status('0');

    viewModel.selectedAttachFileId('');
    viewModel.selectedAttachFileId(row.getValue('attach_id'));
    viewModel.attachCodeValue(row.getValue('busi_id'));
    viewModel.attachNameValue(row.getValue('attach_name'));
    if (attach_type !== '') {
      viewModel.existedFile.setSimpleData({
        'busi_id': viewModel.selectedAttachFileId(),
        'attach_id': viewModel.attachCodeValue(),
        'name': viewModel.attachNameValue()
      });
    }

    document.getElementById('new-attach-sort-error').innerHTML = '';
    document.getElementById('attach-name-error').innerHTML = '';
    $('#edit-attach-box').modal({
      backdrop: 'static'
    });
  };

  /**
   * 关闭编辑附件界面
   */
  viewModel.cancleEditAttach = function () {
    $('#edit-attach-box').modal('hide');
    viewModel.attachCodeValue('');
    viewModel.attachNameValue('');
    viewModel.existedFile.setSimpleData([]);
  };

  // 删除已经上传的文件
  viewModel.removeExistedFile = function () {
    viewModel.status('1');
    viewModel.existedFile.setSimpleData([]);
  };

  /**
   * 保存编辑附件信息
   */
  viewModel.confirmEditAttach = function () {
    var flag = true;
    var selectedSort = $('#new-attach-sort').val();
    var attachCodeValue = $('#attach-code').val();
    var attachNameValue = $('#attach-name').val();

    // 数据校验
    if (isNull(selectedSort)) {
      document.getElementById('new-attach-sort-error').innerHTML = '请选择附件分类';
      flag = false;
    } else {
      var rows = viewModel.attachSort.getAllRows();
      for (var i = 0, l = rows.length; i < l; i++) {
        if (selectedSort === rows[i].getValue('sortnumber')) {
          viewModel.selectedSortNumberValue(rows[i].getValue('sortnumber'));
          break;
        }
      }
    }
    if (isNull(attachNameValue)) {
      document.getElementById('attach-name-error').innerHTML = '附件名称不能为空';
      flag = false;
    }

    if (attachCodeValue && checkValid(attachCodeValue)) {
      document.getElementById('attach-code-error').innerHTML = '格式错误，只能由字母、数字、中横杠_、下横杠-、组成';
      flag = false;
    }

    var oldAttachCodeArr = [];
    var oldAttachCodeObjArr = viewModel.attachFiles.getSimpleData({
      'fields': ['busi_id']
    });
    for (var m = 0, n = oldAttachCodeObjArr.length; m < n; m++) {
      oldAttachCodeArr.push(oldAttachCodeObjArr[m].busi_id);
    }

    if (viewModel.attachCodeValue() !== attachCodeValue && !checkValue(attachCodeValue, oldAttachCodeArr)) {
      document.getElementById('attach-code-error').innerHTML = '该业务编号已经存在';
      flag = false;
    }

    if (flag) {
      // 刷新列表页面数据 选中改变的节点
      var stauts = viewModel.status();
      var data = viewModel.fileUploadData();
      data.files = viewModel.fileDataArray();
      if (!data.files || data.files.length === 0) {
        // 刷新列表页面数据 选中新增的节点
        var req = $.ajax({
          type: 'GET',
          url: '/df/attach/updateAttachInfoWithoutAttach.do?tokenid=' + tokenid,
          cache: false,
          dataType: 'json',
          data: {
            'attach_id': viewModel.selectedAttachFileId(),
            'attachCodeValue': attachCodeValue,
            'attachNameValue': attachNameValue,
            'selectedSort': selectedSort,
            'stauts': stauts,
            'ajax': 'noCache'
          }
        });
        req.done(function (result) {
          if (result.errorCode === '0') {
            viewModel.attachFiles.pageIndex('0');
            viewModel.attachFiles.pageSize('10');
            viewModel.initAttachTable(viewModel.selectedSortNumberValue());
            ip.ipInfoJump('保存成功！', 'success');
            viewModel.attachCodeValue('');
            viewModel.attachNameValue('');
            $('#edit-attach-box').modal('hide');
          } else {
            ip.ipInfoJump('保存失败，请稍后重试！', 'error');
          }
        });
        req.fail(function () {
          ip.ipInfoJump('保存失败，请稍后重试！', 'error');
        });
      } else {
        var formData = {
          'attach_id': viewModel.selectedAttachFileId(),
          'attachCodeValue': attachCodeValue,
          'attachNameValue': attachNameValue,
          'selectedSort': selectedSort
        };
        data.formData = formData;
        data.submit();
      }
    }
  };

  $('input[id="sort-code"]').bind('input propertychange', function () {
    document.getElementById('sort-code-error').innerHTML = '';
    if (checkValid($(this).val())) {
      document.getElementById('sort-code-error').innerHTML = '格式错误，只能由字母、数字、中横杠_、下横杠-、组成';
    }
  });

  // 校验业务编号输入
  $('input[id="attach-new-code"]').bind('input propertychange', function () {
    document.getElementById('attach-new-code-error').innerHTML = '';
    if (checkValid($(this).val())) {
      document.getElementById('attach-new-code-error').innerHTML = '格式错误，只能由字母、数字、中横杠_、下横杠-、组成';
    }
  });

  $('input[id="attach-code"]').bind('input propertychange', function () {
    document.getElementById('attach-code-error').innerHTML = '';
    if (checkValid($(this).val())) {
      document.getElementById('attach-code-error').innerHTML = '格式错误，只能由字母、数字、中横杠_、下横杠-、组成';
    }
  });

  $('input[id="attach-sort"]').bind('input propertychange change', function () {
    document.getElementById('attach-sort-error').innerHTML = '';
  });

  /**
   * 校验编码唯一性
   * @param value 要校验的值
   * @param arr 要对比的数组
   * @returns {boolean} 返回true表示唯一
   */
  var checkValue = function (value, arr) {
    var flag = true;
    for (var i = 0, l = arr.length; i < l; i++) {
      if (value === arr[i]) {
        flag = false;
        break;
      }
    }
    return flag;
  };

  // 判断是否为空串 未定义 null
  var isNull = function (obj) {
    return obj === '' || obj === null || obj === undefined;
  };

  // 验证编码的非法字符   编码只能是字母、数字、中横杠_、下横杠-
  var checkValid = function (code) {
    var codeStr = '0123456789-_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0, l = code.length; i < l; i++) {
      var str = code.charAt(i);
      if (codeStr.indexOf(str) === -1) {
        return true;
      }
    }
    return false;
  };

  // 只能是数字字母和中文，不能包括特殊字符)
  function checkusername(value) {
    var regex = /^[0-9a-zA-Z\u4e00-\u9fa5]*$/;
    if (regex.test(value) === true) {
      // 格式正确
      document.getElementById('error').innerHTML = '';
    } else {
      // 格式错误
      document.getElementById('error').innerHTML = '格式错误，只能由数字、字母、中文组成，不能包含特殊字符';
    }
  }

  // 初始化子系统下拉列表
  viewModel.initSys = function () {
    var req = $.ajax({
      type: 'GET',
      url: '/df/attach/getSysApp.do?tokenid=' + tokenid,
      cache: false,
      dataType: 'json',
      data: {
        'ajax': 'noCache'
      }
    });
    req.done(function (result) {
      if (result.data) {
        viewModel.sysIdOptions([]);
        var System = function (sys_id, sys_name) {
          this.sys_id = sys_id;
          this.sys_name = sys_name;
        };
        for (var i = 0, l = result.data.length; i < l; i++) {
          viewModel.sysIdOptions.push(new System(result.data[i].sys_id, result.data[i].sys_name));
        }
      }
    }).fail(function () {
      ip.ipInfoJump('初始化子系统下拉列表失败，请稍后重试！', 'error');
    });
  };

  function init() {
    'use strict';
    app = u.createApp({
      el: 'body',
      model: viewModel
    });
    tokenid = ip.getTokenId();
    // 下载插件初始化
    fileupload();
    newfileupload();
    // 初始化子系统下拉列表
    viewModel.initSys();

    // 根据子系统的值确定附件分类列表
    $('#sys-id').on('change', function () {
      var sys_id = $('#sys-id').val();

      // 初始化附件分类列表
      viewModel.initSortList('', sys_id);
      // 初始化附件表格
      viewModel.attachFiles.setSimpleData([]);
    });
  }

  init();
});