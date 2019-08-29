define(['jquery','bootstrap','ip'], function() {
  var files = null
  var params = null
  /**
   * 上传文件, 调用这个方法即可
   * @param opt
   */
  var uploadFile = function(opt) {
    opt = opt || {}
    if(!opt.sys_id || ! opt.selectedSort || !opt.attachNewCodeValue) {
      ip.ipInfoJump('')
    }
    opt.sys_id = opt.sys_id || '001' // 系统id
    opt.selectedSort = opt.selectedSort || 'C3F5DE1F-E3C5-4275-BC79-BCDD07FBDD99' // 分类号
    opt.attachNewCodeValue = opt.attachNewCodeValue || 0 // 附件编号
    opt.success = typeof opt.success === 'function' ? opt.success : function() {}
    opt.error = typeof opt.error === 'function' ? opt.error : function() {}
    params = opt
    ip.uploadFile(function(rs) {
      if(rs && rs.length) {
        files = rs
        createModal()
      }
    })
  }

  /**
   * 将表格保存到后台
   */
  function uploadFileToServer() {
    var tokenid = ip.getTokenId()
    // 文件总大小
    var totalSize = files.reduce(function(sum, file) {
      return sum + file.size
    }, 0)
    // 校验文件总大小
    $.ajax({
      url: '/df/attach/checkUploadCondition.do?tokenid=' + tokenid,
      data: {
        'attachSize': totalSize,
      },
      dataType: 'JSON',
      beforeSend: function() {ip.loading(true)},
      complete: function() {
        ip.loading(false)
        $('#add-attach-box').modal('hide')
      },
      success: function (result) {
        var errorCode = result.errorCode;
        if (errorCode === '0') {
          // 搜集上传数据
          var data = new FormData()
          files.forEach(function(file) {
            data.append('files', file)
          })
          data.append('sys_id', params.sys_id)
          data.append('selectedSort', params.selectedSort)
          data.append('attachNewCodeValue', params.attachNewCodeValue)

          $.ajax({
            type: 'POST',
            url: '/df/attach/uploadattach.do?tokenid=' + tokenid,
            data: data,
            beforeSend: function() {ip.loading(true)},
            complete: function() {
              ip.loading(false)
              $('#add-attach-box').modal('hide')
            },
            processData:false,
            // contentType: 'multipart/form-data',
            contentType: false,
            success: function(data) {
              if(data.errorCode === '0') {
                ip.ipInfoJump('保存成功', 'success')
                params.success()
              } else {
                ip.ipInfoJump('保存失败', 'error')
                params.error()
              }
            },
            error: function() {},
          })
        } else {
          ip.ipInfoJump(result.errorMsg, 'error');
        }
      },
      error: function () {
        ip.ipInfoJump('保存新增附件失败，请稍后重试', 'error');
      }
    });
  }

  /**
   * 创建模态框
   */
  function createModal() {
    if(!$('#add-attach-box').length) {
      var modal = '<div class="modal fade" id="add-attach-box" tabindex="-1" role="dialog" aria-labelledby="addAttachBoxLabel" data-backdrop="static">\n' +
        '  <div class="modal-dialog" role="document">' +
        '    <div class="modal-content">\n' +
        '      <div class="modal-header">\n' +
        '        <button type="button" class="close" data-bind="click:cancleAddAttach" aria-label="Close"><span\n' +
        '            aria-hidden="true" onclick="_saveFile(false)">&times;</span></button>\n' +
        '        <h4 class="modal-title font-size-14" id="addAttachBoxLabel">新增附件</h4>\n' +
        '      </div>\n' +
        '      <div class="modal-body">\n' +
        '        <!--form表单开始-->\n' +
        '        <form class="form-horizontal">\n' +
        '          <div class="form-group height-150" style="overflow:auto">\n' +
        '            <!--已添加文件-->\n' +
        '            <table id="uploadTable" class="table-bordered table-hover table-condensed col-sm-10 col-sm-offset-1">\n' +
        '              <thead>\n' +
        '              <tr>\n' +
        '                <th class="col-sm-1 text-center">序号</th>\n' +
        '                <th class="col-sm-9 text-center">附件名称</th>\n' +
        '                <th class="col-sm-2 text-center">操作</th>\n' +
        '              </tr>\n' +
        '              </thead>\n' +
        '              <tbody id="upload-table-content">\n' +
        '              </tbody>\n' +
        '            </table>\n' +
        '          </div>\n' +
        '        </form>\n' +
        '        <!--form表单结束-->\n' +
        '      </div>\n' +
        '      <div class="modal-footer padding-right-0">\n' +
        '        <button type="button" class="btn btn-primary" id="attach-add-confirm" onclick="_saveFile(true)">保存</button>\n' +
        '        <button type="button" class="btn btn-primary" id="attach-add-cancle" onclick="_saveFile(false)">取消\n' +
        '        </button>\n' +
        '      </div>\n' +
        '    </div>\n' +
        '  </div>\n' +
        '</div>'
      $(document.body).append(modal)
    }

    $('#add-attach-box').modal()
  }

  /**
   * 打开模态框后执行渲染
   */
  $(document).on('shown.bs.modal', '#add-attach-box', function() {
    render()
  })

  /**
   * 移除单个文件
   * @param i
   * @private
   */
  window._removeFile = function(i) {
    files.splice(i, 1)
    render()
  }

  /**
   * 保存或取消保存文件
   * @param saveFlag
   * @private
   */
  window._saveFile = function(saveFlag) {
    if(!saveFlag) {
      files = []
      render()
    } else {
      if(files && files.length) {
        uploadFileToServer()
      }
    }
  }

  /**
   * 将files渲染成表格
   */
  function render() {
    files = files || []
    var body = ''
    if(files.length) {
      files.forEach(function(file, i) {
        body += '<tr>'
          + '<td class=" text-center">'+(i+1)+'</td>'
          + '<td class=" text-center">'+file.name+'</td>'
          + '<td class=" text-center"><span class="glyphicon glyphicon-trash file-glyphicon" title="删除" onclick="_removeFile('+i+')"></span></td>'
          + '</tr>'
      })
      $('#upload-table-content').html(body)
    }
    else
      $('#add-attach-box').modal('hide')
  }

  return  uploadFile
})




