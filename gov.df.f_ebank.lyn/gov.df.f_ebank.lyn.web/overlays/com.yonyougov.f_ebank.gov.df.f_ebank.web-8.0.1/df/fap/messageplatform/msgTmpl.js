/**
 * Created by mazca on 2017/8/1.
 */
require(['jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'ip', 'select2'], function ($, ko) {
  window.ko = ko

  // 设置ajax无缓存, 主要针对ie
  $.ajaxSetup({
    cache: false,
    beforeSend: function () {
      ip.loading(true)
    },
    complete: function () {
      ip.loading(false)
    },
  })

  var zTree = $.fn.zTree
  var baseUrl = '/df/messageconfig'
  var tokenid = '?tokenid=' + ip.getTokenId() + '&ajax=cache'
  // 流程列表
  var wfList = []
  // [{"chr_id":"151532","chr_code":"111002","chr_name":"年初控制数流程","show_name":"111002 年初控制数流程"},{"chr_id":"151539","chr_code":"111101","chr_name":"正式指标流程","show_name":"111101 正式指标流程"},{"chr_id":"151595","chr_code":"112002","chr_name":"计划流程(8.0)","show_name":"112002 计划流程(8.0)"},{"chr_id":"151619","chr_code":"112003","chr_name":"直接支付流程(8.0)","show_name":"112003 直接支付流程(8.0)"},{"chr_id":"151678","chr_code":"112006","chr_name":"授权支付流程8.0","show_name":"112006 授权支付流程8.0"},{"chr_id":"151698","chr_code":"112007","chr_name":"实拨支付流程(8.0)","show_name":"112007 实拨支付流程(8.0)"},{"chr_id":"152072","chr_code":"112008","chr_name":"直接支付退款流程(8.0)","show_name":"112008 直接支付退款流程(8.0)"},{"chr_id":"152379","chr_code":"112009","chr_name":"授权支付退款流程(8.0)","show_name":"112009 授权支付退款流程(8.0)"},{"chr_id":"152641","chr_code":"602001","chr_name":"集中支付监控流程","show_name":"602001 集中支付监控流程"}]
  // 节点列表
  var wfNodes = []
  // [{"chr_id":"151598","chr_code":"7","chr_name":"授权额度通知单打印"},{"chr_id":"151600","chr_code":"13","chr_name":"清算行额度通知单登记"},{"chr_id":"152826","chr_code":"29","chr_name":"批复计划查阅"},{"chr_id":"152827","chr_code":"16","chr_name":"计划录入"},{"chr_id":"152828","chr_code":"19","chr_name":"额度到账通知单登记"},{"chr_id":"152829","chr_code":"34","chr_name":"额度到账通知单生成"},{"chr_id":"152830","chr_code":"33","chr_name":"计划下达"},{"chr_id":"152831","chr_code":"5","chr_name":"支付中心授权额度通知单生成"},{"chr_id":"152832","chr_code":"22","chr_name":"授权额度通知单回单签收"},{"chr_id":"152833","chr_code":"12","chr_name":"授权清算额度通知单打印"},{"chr_id":"152834","chr_code":"11","chr_name":"支付中心授权清算额度通知单生成"}]
  // 规则列表
  var msgRules = []
  // [{"id":"14","name":"001001 测试","code":"001001"},{"id":"15","name":"001001 测试","code":"001001"},{"id":"18","name":"001001 测试","code":"001001"},{"id":"21","name":"001001 测试","code":"001001"},{"id":"24","name":"001001 测试","code":"001001"},{"id":"27","name":"001001 测试","code":"001001"},{"id":"30","name":"001001 测试","code":"001001"},{"id":"33","name":"001001 测试","code":"001001"},{"id":"41","name":"001001 测试","code":"001001"},{"id":"52","name":"001001 测试","code":"001001"},{"id":"58","name":"001001 测试","code":"001001"},{"id":"62","name":"001002 测试2","code":"001002"}]
  // 单个规则
  var msgRule = []
  // [{"last_ver":"2017-08-05 11:35:11","enabled":"1","wf_action_id":"3","upid":"0","wf_flow_id":"151539","wf_flow_name":"正式指标流程","wf_node_code":"6","invoketype":"1","wf_node_id":"152738","set_year":"2017","content_title":"标题2","wf_node_name":"指标审核","is_valid":"1","content_model":"content_model2","wf_condition":null,"id":"62","send_type":"1010","wf_action_code":"NEXT","rg_code":"3700","wf_action_name":"审核","wf_flow_code":"111101","msg_rule_code":"001002","msg_rule_name":"测试2"}]
  // 当前规则的接收人
  var userTree = null
  // {"result":"success","canSelectUsers":[{"id":"00000000000000000000000000009853","name":"001001051 董正立","type":"用户"},{"id":"00000000000000000000000000009853","name":"001001051 董正立","type":"用户"},{"id":"00000000000000000000000000008669","name":"001001052 张海舒","type":"用户"},{"id":"00000000000000000000000000008669","name":"001001052 张海舒","type":"用户"},{"id":"00000000000000000000000000027666","name":"001001053 于文婧","type":"用户"}],"hasSelectedUsersAndGroup":[]}
  // -- end
  // 操作列表
  var wfActions = ['INPUT 录入', 'EDIT 修改', 'NEXT 审核', 'BACK 退回', '5 RECALL 撤销', 'DELETE 删除', 'DISCARD 作废', 'HANG 挂起']
  // 系统信息 -- 字段列表
  var msgContentFields = [
    {key_name: '发送人', value_name: 'fromUser', inset: true},
    {key_name: '接收人', value_name: 'toUser', inset: true},
    {key_name: '操作原因', value_name: 'reason', inset: true},
  ]
  var allUsers = null // 所有的用户
  var allUserGroup = null // 所有的用户群
  var allRoles = null // 所有的角色
  // var selectRoles = [] // 选中的角色
  // var selectUsers = [] // 选中的用户
  // var selectGroups = [] // 选中的用户群
  var url = {
    GET_TMPL: baseUrl + '/getAllMsgRules.do' + tokenid, // 获取消息模板列表
    GET_RULE: baseUrl + '/getMsgRuleById.do' + tokenid, // 通过id获取消息规则
    GET_WF: baseUrl + '/getWFList.do' + tokenid, // 工作流列表
    GET_NODES: baseUrl + '/getWFNodesById.do' + tokenid, // 节点列表
    SAVE_RULE: baseUrl + '/saveMsgRule.do' + tokenid, // 保存模板
    DEL_RULE: baseUrl + '/deleteMsgRuleById.do' + tokenid, // 删除模板
    DEL_USER_GROUP: baseUrl + '/deleteUserGroup.do' + tokenid, // 删除用户群
    GET_USERS: baseUrl + '/getUserTree.do' + tokenid, // 获取用户
    SAVE_GROUP: baseUrl + '/saveOrUpdateGroup.do' + tokenid, // 保存用户群
    GET_GROUP_USER: baseUrl + '/getUserByGroupId.do' + tokenid, // 获取单个用户群的成员
    DEL_GROUP: baseUrl + '/deleteUserGroup.do' + tokenid, // 获取单个用户群的成员
    GET_ROLE_LIST: '/df/datarightrelation/addCaRole.do' + tokenid, // 获取角色列表
    GET_USERS_BY_ROLE: baseUrl + '/findUsersByRole.do' + tokenid, // 获取角色对应用户
  }
  var ajax = {} // 正在发请求的列表


  var set_users = {
    callback: {
      beforeClick: beforeClick,
      onClick: function (e, treeId, treeNode) {
        // 通过id获取规则
      }
    },
  }

  var set_userGroup = {}
  var set_selected = {
    callback: {
      beforeClick: beforeClick,
    }
  }

  // 用户群配置之用户群列表
  var set_userGroups = {
    callback: {
      beforeClick: beforeClick,
      onClick: function (treeId, treeNode) {
        $.ajax({ // 获取所有用户
          url: url.GET_USERS + '&msgRuleId=',
          success: function (data) {
            if (data.result === 'success') {
              _init(data)
            }
          },
          error: function () {
            ip.ipInfoJump('获取节点失败', 'error')
            // _init(users)
          }
        })

        function _init(data) {
          var nodes = [{name: '用户', children: data.canSelectUsers}]
          zTree.init($('#user-tree2'), set_users, nodes).expandAll(true)

          var nodes2 = [{name: '用户', children: []}]
          zTree.init($('#edit-userGroup'), set_users, nodes2).expandAll(true)
        }
      }
    }
  }

  function beforeClick(treeId, treeNode) {
    if (!treeNode.level || treeNode.children && treeNode.children.length || treeNode.isParent) {
      return false
    }
  }

  // var commonTreeSetting = {
  //
  // }

  // 消息规则树
  var tree11 = {
    nodes: [],
    instance: null,
    users: {}, // 每个用户群里面的成员
    setting: {
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'pid',
          rootPId: null,
        }
      },
      callback: {
        beforeClick: function (treeId, treeNode) {
          if (!treeNode.isParent) {
            if (vm.editAble()) {
              ip.warnJumpMsg('当前正在编辑消息规则, 确定放弃编辑吗', '_cancel-edit', '_cancel-edit')
              return false
            }
          } else {
            return false
          }
        },
        onClick: function (e, treeId, treeNode) {
          // 通过id获取规则
          var msg_rule_code = treeNode.code
          vm.ruleId = treeNode.id
          vm.need_init = false
          ip.loading(true)
          // 获取规则
          $.ajax({
            url: url.GET_RULE + '&msg_rule_id=' + treeNode.id,
            success: function (data) {
              if (data.result === 'success' && data.msgRule) {
                _init(data.msgRule)
                data.msgContentFields.forEach(function(field) {
                  field.inset = false
                })
                vm.msgContentFields(msgContentFields.concat(data.msgContentFields))
              }
            },
            error: function () {
              ip.ipInfoJump('获取流程列表失败', 'error')
              _init(msgRule)
            }
            ,
          })

          // 获取接收人
          fetchReceiver(treeNode.id, function (data) {
            var roles = data.hasSelectedRole.filter(function (role) {
              return role.pid
            })
            vm.convertUserToStr(data.hasSelectedUsers, data.hasSelectedGroup, roles)
          })
          // $.ajax({
          //   url: url.GET_USERS+'&msgRuleId='+treeNode.id,
          //   async: false,
          //   success: function(data) {
          //     if(data.result === 'success') {
          //       // userTree = data
          //       allUsers = data.canSelectUsers.concat(data.hasSelectedUsers)
          //       allUserGroup = data.canSelectUserGroups.concat(data.hasSelectedGroup)
          //     }
          //   },
          //   error: function() {
          //     ip.ipInfoJump('获取节点失败', 'error')
          //   }
          //   ,
          // })

          function _init(list) {
            for (var key in list[0]) {
              if (vm.msg[key]) {
                vm.msg[key](list[0][key])
              }
            }
            vm.msg.upId(list[0].upid)

            // 选中flow
            $('#wf-flow').select2().val(list[0].wf_flow_id).trigger('change')
            $('#wf-action').select2().val(list[0].wf_action_id).trigger('change')
            ip.loading(false)

            if (list[0]['send_type']) {
              list[0]['send_type'].split('').forEach(function (flag, i) {
                flag = flag != 0
                switch (i) {
                  case 0:
                    vm.send_type.sys(flag);
                    break
                  case 1:
                    vm.send_type.app(flag);
                    break
                  case 2:
                    vm.send_type.info(flag);
                    break
                  case 3:
                    vm.send_type.wechat(flag);
                    break
                }
              })
            }
          }
        },
      },
    },
  }

  var tree31 = {
    groupId: -1,
    nodes: [],
    instance: null,
    users: {}, // 每个用户群里面的成员
    setting: {
      callback: {
        beforeClick: beforeClick,
        onClick: function (e, treeId, treeNode) {
          var group_id = treeNode.id
          if (!group_id) {
            _init([])
            return
          }
          // if(tree31.users[group_id].) {
          //   _init(tree31.users[group_id].hasSelect)
          //   return
          // }
          $.ajax({
            url: url.GET_GROUP_USER + '&group_id=' + group_id,
            success: function (data) {
              if (data.result === 'success' && data.groupUsers) {
                _init(data.groupUsers)
              }
            },
            error: function () {
              ip.ipInfoJump('获取流程列表失败', 'error')
              _init(msgRule)
            }
            ,
          })

          function _init(list) {
            var all = []
            if (group_id) {
              tree31.users[group_id] = {
                canSelect: allUsers.filter(function (o) {
                  return !list.some(function (obj) {
                    if (obj.id === o.id) return true
                  })
                }),
                hasSelect: list
              }
              all = tree31.users[group_id].canSelect
            }
            else {
              all = allUsers
            }

            tree31.groupId = group_id
            vm.groupName(treeNode.name)
            tree32.instance.removeChildNodes(tree32.instance.getNodes()[0])
            tree33.instance.removeChildNodes(tree33.instance.getNodes()[0])
            tree32.instance.addNodes(tree32.instance.getNodes()[0], all)
            tree33.instance.addNodes(tree33.instance.getNodes()[0], list)
          }
        },
      },
    },
  }

  var tree32 = {
    nodes: [],
    instance: null,
    users: {}, // 每个用户群里面的成员
    setting: {
      callback: {
        beforeClick: beforeClick,
      }
    },
  }

  var tree33 = {
    nodes: [],
    instance: null,
    users: {}, // 每个用户群里面的成员
    setting: {
      callback: {
        beforeClick: beforeClick,
      }
    },
  }

  // 角色树
  var tree_role = {
    instance: null,
    nodes: [],
    setting: {
      callback: {
        beforeClick: beforeClick,
        onClick: function (e, treeId, treeNode) {
          var getUrl = url.GET_USERS_BY_ROLE
          if (!ajax[getUrl]) {
            // 清空角色对应用户
            var obj = zTree.getZTreeObj('role-users')
            if (obj) obj.destroy()

            ajax[getUrl] = $.ajax({
              url: url.GET_USERS_BY_ROLE,
              data: {roleId: treeNode.id},
              success: function (data) {
                var nodes = []
                if (data.result === 'success') {
                  nodes = data.roleUsers.map(function (user) {
                    return {
                      id: user.user_id,
                      name: user.user_name,
                      code: user.user_code,
                    }
                  })
                }
                // if(nodes.length) {
                zTree.init($('#role-users'), {
                  callback: {
                    beforeClick: function () {
                      return false
                    }
                  }
                }, nodes)
                // }
              },
              error: function () {
                ip.ipInfoJump('获取角色对应用户失败', 'error')
              },
              complete: function () {
                ip.loading(false)
                ajax[getUrl] = null
              },
            })
          }
        },
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'pid',
          rootPId: 0,
        }
      },
    },
  }

  var role_user_tree = {
    instance: null,
    nodes: [],
    id: '#role-users',
    settting: {},
  }

  $(document).on('click', '#_cancel-edit', function () {
    $('#config-modal').remove()
    vm.cancelSave()
  })

  $(document).on('click', '._cancel-edit', function () {
    $('#config-modal').remove()
  })

  window.vm = {
    selectUsers: ko.observableArray([]), //
    selectGroups: ko.observableArray([]), //
    selectRoles: ko.observableArray([]), // 选中角色
    msg: {
      msg_rule_code: ko.observable(''),
      msg_rule_name: ko.observable(''),
      invoketype: ko.observable('0'),
      wf_flow_name: ko.observable(''),
      wf_flow_code: ko.observable(''),
      wf_flow_id: ko.observable(''),
      enabled: ko.observable('1'),
      wf_node_name: ko.observable(''),
      wf_node_code: ko.observable(''),
      wf_node_id: ko.observable(''),
      wf_action_name: ko.observable(''),
      wf_action_code: ko.observable(''),
      wf_action_id: ko.observable('0'),
      content_title: ko.observable(''),
      content_model: ko.observable(''),
      send_type: ko.observable('0000'),
      upId: ko.observable('0'),
      wf_condition: ko.observable(''),
      id: ko.observable(''),
    },
    send_type: {
      sys: ko.observable(false),
      app: ko.observable(false),
      info: ko.observable(false),
      wechat: ko.observable(false),
    },
    key_name: ko.observable(''),
    key_value: ko.observable(''),
    msgContentFields: ko.observableArray(JSON.parse(JSON.stringify(msgContentFields))),
    wf_list: ko.observableArray([]),
    node_list: ko.observableArray([]),
    point: {s: -1, e: -1}, // content_model编辑框里面光标的位置
    msg_type: 'new',
    editAble: ko.observable(false),
    ruleId: '',
    // 增加一个字段
    addField: function () {
      if (!this.key_name().trim()) {
        ip.ipInfoJump('"显示名称"不能为空', 'info')
        return
      }
      if (!this.key_value().trim()) {
        ip.ipInfoJump('"参数名"不能为空', 'info')
        return
      }
      var list = this.msgContentFields()
      if (list.some(function (o) {
          return o.key_name === this.key_name().trim()
        }.bind(this))) {
        ip.ipInfoJump('"显示名称"已存在', 'info')
        return
      }
      list.push({key_name: this.key_name().trim(), value_name: this.key_value().trim(), inset: false})
      this.msgContentFields(list)
      this.key_name('')
      this.key_value('')
    },
    // 往content_model里面插入字段
    insertField: function (data) {
      var model = this.msg.content_model()
      var key = ''
      if (data.inset) {
        key = '#' + data.value_name + '#'
      } else
        key = '[' + data.key_name + ']'
      if (this.point.s < 0) {
        model = model + key
      } else {
        model = model.slice(0, this.point.s) + key + model.slice(this.point.e)
        this.point = {s: this.point.s + key.length, e: this.point.s + key.length}
      }

      this.msg.content_model(model)
    },
    delField: function(index) {
      // this.msgContentFields.
      // console.log(arguments)
      index = index()
      this.msgContentFields.splice(index, 1)
    },

    // 获取光标位置
    getPointPos: function (data, e) {
      var start = e.target.selectionStart,
        end = e.target.selectionEnd
      this.point = {s: start, e: end}
    },
    getNodes: function (e) {
      var flowId = e.target.value

      var self = this
      $.ajax({
        url: url.GET_NODES + '&flowId=' + flowId,
        // async: false,
        success: function (data) {
          if (data.result === 'success' && data.wfNodes) {
            initNodes(data.wfNodes)
          }
        },
        error: function () {
          ip.ipInfoJump('获取节点失败', 'error')
          initNodes(wfNodes)
        }
        ,
      })

      function initNodes(list) {
        wfNodes = list
        list = list.map(function (o) {
          return {id: o.chr_id, text: o.chr_name}
        })

        $('#wf-node').children(':not(:first-child)').remove()
        $('#wf-node').select2({
          data: list
        })
        $('#wf-node').select2().val(self.msg.wf_node_id()).trigger('change')

      }
    },
    // 选中节点后, 设置wf_node_name, wf_node_code
    setNode: function () {
      // 设置wf_node_name  wf_node_code
      var self = this
      var obj = wfNodes.filter(function (o) {
        return o.chr_id === self.msg.wf_node_id()
      })[0]
      this.msg.wf_node_code(obj.chr_code)
      this.msg.wf_node_name(obj.chr_name)
    },
    // 选中action后 设置 wf_action_name, wf_action_code
    setAction: function () {
      // 设置wf_node_name  wf_node_code
      var self = this
      var arr = wfActions[this.msg.wf_action_id() - 1].split(' ')
      this.msg.wf_action_code = arr[0]
      this.msg.wf_action_name = arr[1]
    },

    // 保存rule
    saveRule: function () {
      if (!valid()) return
      if (this.msg.invoketype() == 1)
        collectWf.call(this)
      this.msg.send_type('' + Number(this.send_type.sys()) +
        Number(this.send_type.app()) +
        Number(this.send_type.info()) +
        Number(this.send_type.wechat()))
      var msgRuleDTO = ko.toJS(this.msg)
      msgRuleDTO.msg_rule_id = msgRuleDTO.id
      var msgContentFieldsDTOs = null
      var option = {
        msgRuleDTO: JSON.stringify(msgRuleDTO),
        ajax: 1,
        msgType: this.msg_type,
        receiver: this.receiver1(),
        msgContentFieldsDTOs: JSON.stringify(this.msgContentFields.slice(3)),
      }
      var self = this
      ip.loading(true)
      $.ajax({
        method: 'POST',
        url: url.SAVE_RULE,
        data: option,
        dataType: 'json',
        success: function (data) {
          ip.loading(false)
          if (data.result === 'success') {
            ip.ipInfoJump('保存成功', 'success')
            self.clearMainView()
            self.editAble(false)
            fetchTmpl()
            // var tree = zTree.getZTreeObj('tmpl-list')
            // tree.addNodes(tree.getNodes()[0], {id: '', name: self.msg.msg_rule_code()+' '+self.msg.msg_rule_name(), code: self.msg.msg_rule_code()})
          }
        },
        error: function () {
          ip.ipInfoJump('保存失败', 'error')
        },
      })
    },

    // 清空界面
    clearMainView: function () {
      for (var key in this.msg) {
        this.msg[key]('')
      }
      this.msg.invoketype('0')
      for (key in this.send_type) {
        this.send_type[key](false)
      }
      this.msg.enabled('1')
      this.msg.upId('0')
      this.receiver('')
      this.clearSelect()
      this.msgContentFields(msgContentFields.slice(0, 3))

      this.key_name('')
      this.key_value('')
    },
    clearSelect: function () {
      $('#wf-flow').select().val('').trigger('change')
      $('#wf-node').select().val('').trigger('change')
      $('#wf-action').select().val('').trigger('change')
    },

    // 取消保存
    cancelSave: function () {
      this.clearMainView()
      this.editAble(false)
      tree11.instance.cancelSelectedNode()
    },

    // 新增rule
    addRule: function () {
      this.clearMainView()
      this.editAble(true)
      this.msg_type = 'new'
      this.need_init = true
      this.selectUsers([])
      this.selectGroups([])
      this.selectRoles([])
    },

    // 删除rule
    delRule: function () {
      var nodes = tree11.instance.getSelectedNodes()
      if (!nodes.length) {
        ip.ipInfoJump('请先选中一个规则', 'info')
        return
      }
      ip.warnJumpMsg('确定删除选中的消息规则吗', '_del-rule', '_del-rule')
      $('#_del-rule').click(function () {
        delRule(nodes[0])
        $("#config-modal").remove()
      })
      $('._del-rule').click(function () {
        $("#config-modal").remove()
      })
    },

    editRule: function () {
      var nodes = tree11.instance.getSelectedNodes()
      if (!nodes.length) {
        ip.ipInfoJump('请先选中一个规则', 'info')
        return
      }
      this.msg_type = 'modify'
      this.editAble(true)
      this.need_init = false
    },


    /**
     * 关于接收人的操作
     */
    is_user: 1, // 用户树被激活还是用户群树被激活 1 用户, 2 用户群, 3角色
    receiver: ko.observable(''),
    receiver1: ko.observable(''), // 传到后台的数据
    changeView: function (flag) {
      this.is_user = flag
    },
    // 打开接收人模态框
    openUserModal: function () {

      // var msgRuleId = ''
      // if(this.msg_type === 'new') {
      //   if(userTree) {
      //     var data = {
      //       canSelectUsers: userTree.canSelectUsers.concat(userTree.hasSelectedUsers),
      //       hasSelectedUsers: [],
      //       canSelectUserGroups: userTree.canSelectUserGroups.concat(userTree.hasSelectedGroup),
      //       hasSelectedGroup: []
      //     }
      //     _init(data)
      //     return
      //   }
      // }
      // else if(this.msg_type === 'modify') {
      //   msgRuleId = this.ruleId
      //   if(userTree) {
      //     _init(userTree)
      //     return
      //   }
      // }
      if (!allUsers && this.msg_type === 'new') {
        fetchReceiver()
      }
      $('#choose-user').modal({backdrop: false})

      // function _init(data) {
      //
      //   var nodes = [{name: '用户', children: data.canSelectUsers}]
      //   var nodes_group = [{name: '用户群', children: data.canSelectUserGroups}]
      //   var nodes3 = [
      //     {
      //       name: '全部',
      //       children: [
      //         // {name: '用户', children: [], isHidden: true},
      //         // {name: '用户群', children: [], isHidden: true}
      //       ]
      //     }
      //   ]
      //   if(data.hasSelectedUsers && data.hasSelectedUsers.length) {
      //     nodes3[0].children.push({name: '用户', children: data.hasSelectedUsers})
      //   }
      //   if(data.hasSelectedGroup && data.hasSelectedGroup.length) {
      //     nodes3[0].children.push({name: '用户群', children: data.hasSelectedGroup})
      //   }
      //   if(zTree.getZTreeObj('user-tree1')) zTree.getZTreeObj('user-tree1').destroy()
      //   if(zTree.getZTreeObj('users-group1')) zTree.getZTreeObj('users-group1').destroy()
      //   if(zTree.getZTreeObj('choose-users-tree1')) zTree.getZTreeObj('choose-users-tree1').destroy()
      //   zTree.init($('#user-tree1'), set_users, nodes).expandAll(true)
      //   zTree.init($('#users-group1'), set_users, nodes_group).expandAll(true)
      //   zTree.init($('#choose-users-tree1'), set_selected, nodes3).expandAll(true)
      // }
    },

    searchTree: function (treeId, inputId, key, flag, data, e) {
      if (e.keyCode === 13) {
        var kw = e.target.value.trim()
        treeSearch(kw, treeId, inputId, key, flag)
      }
    },

    selUser: function (treeId) {
      var tree_left = this.is_user == 1 ? zTree.getZTreeObj('user-tree1') :
        this.is_user == 2 ? zTree.getZTreeObj('users-group1') :
          tree_role.instance
      var tree_right = zTree.getZTreeObj('choose-users-tree1')
      var nodes = tree_left.getSelectedNodes()
      if (!nodes.length) {
        ip.ipInfoJump('请先选中一个节点', 'warn')
        return
      }
      tree_left.removeNode(nodes[0])
      var rightNodes = tree_right.getNodes()
      var users
      if (this.is_user == 1) { // 添加用户
        users = tree_right.getNodesByParam('name', '用户', rightNodes[0])[0]
        if (!users) {
          tree_right.addNodes(rightNodes[0], {name: '用户', children: [nodes[0]], open: true})
        } else
          tree_right.addNodes(users, nodes[0])
      } else if (this.is_user == 2) { // 添加用户群
        users = tree_right.getNodesByParam('name', '用户群', rightNodes[0])[0]
        if (!users) {
          tree_right.addNodes(rightNodes[0], {name: '用户群', children: [nodes[0]], open: true})
        } else
          tree_right.addNodes(users, nodes[0])
      } else {
        // 清空角色对应用户
        var obj = zTree.getZTreeObj('role-users')
        if (obj) obj.destroy()

        users = tree_right.getNodesByParam('name', '角色', rightNodes[0])[0]
        if (!users) {
          tree_right.addNodes(rightNodes[0], {name: '角色', children: [nodes[0]], open: true})
        } else
          tree_right.addNodes(users, nodes[0])
      }
    },
    selAllUser: function () {
      // 清空角色对应用户
      var obj = zTree.getZTreeObj('role-users')
      if (obj) obj.destroy()

      var tree_left = this.is_user == 1 ? zTree.getZTreeObj('user-tree1') :
        this.is_user == 2 ? zTree.getZTreeObj('users-group1') :
          tree_role.instance
      var tree_right = zTree.getZTreeObj('choose-users-tree1')
      var nodes = tree_left.getNodes()
      var rightNodes = tree_right.getNodes()
      var users
      var roleNodes // 所有的角色, 不包括角色的父节点
      if (this.is_user == 1) { // 添加用户
        users = tree_right.getNodeByParam('name', '用户', rightNodes[0])
        if (!users) {
          users = tree_right.addNodes(rightNodes[0], {name: '用户', children: nodes[0].children, open: true})
        } else
          tree_right.addNodes(users, nodes[0].children)
      } else if (this.is_user == 2) { // 添加用户群
        users = tree_right.getNodeByParam('name', '用户群', rightNodes[0])
        if (!users) {
          users = tree_right.addNodes(rightNodes[0], {name: '用户群', children: nodes[0].children, open: true})
        } else
          tree_right.addNodes(users, nodes[0].children)
      } else { // 添加角色
        roleNodes = tree_left.getNodesByFilter(function (node) {
          return node.pid
        })
        users = tree_right.getNodeByParam('name', '角色', rightNodes[0])
        if (!users) {
          tree_right.addNodes(rightNodes[0], {name: '角色', children: roleNodes, open: true})
        } else
          tree_right.addNodes(users, roleNodes)
      }
      if (this.is_user == 3) {
        // tree_left.removeChildNodes()
        tree_role.instance.destroy()
        var leftNodes = tree_role.nodes.filter(function (role) {
          return !role.pid
        })
        tree_role.instance = zTree.init($('#role-tree'), tree_role.setting, leftNodes)
      } else
        tree_left.removeChildNodes(nodes[0])
    },
    removeUser: function () {
      var tree_right = zTree.getZTreeObj('choose-users-tree1')
      var nodes = tree_right.getSelectedNodes()
      if (!nodes.length) {
        ip.ipInfoJump('请先选中一个节点', 'warn')
        return
      }
      var parentName = nodes[0].getParentNode().name
      var tree_left = parentName == '用户' ? zTree.getZTreeObj('user-tree1') :
        parentName == '用户群' ? zTree.getZTreeObj('users-group1') :
          tree_role.instance
      tree_right.removeNode(nodes[0])
      // 用户为空的话, 去除 用户 标签
      var user = tree_right.getNodeByParam('name', '用户', tree_right.getNodes()[0])
      var userGroup = tree_right.getNodeByParam('name', '用户群', tree_right.getNodes[0])
      var role = tree_right.getNodeByParam('name', '角色', tree_right.getNodes[0])
      var par = tree_left.getNodes()[0]
      if (user && !user.children.length) {
        tree_right.removeNode(user)
      } else if (userGroup && !userGroup.children.length) {
        tree_right.removeNode(userGroup)
      } else if (role && !role.children.length) {
        tree_right.removeNode(role)
      }
      if (role) par = tree_left.getNodeByParam('id', nodes[0].pid)
      tree_left.addNodes(par, nodes)
    },
    removeAllUser: function () {
      var tree_left_user = zTree.getZTreeObj('user-tree1')
      var tree_left_group = zTree.getZTreeObj('users-group1')
      var tree_right = zTree.getZTreeObj('choose-users-tree1')
      var user = tree_right.getNodeByParam('name', '用户', tree_right.getNodes()[0])
      var userGroup = tree_right.getNodeByParam('name', '用户群', tree_right.getNodes()[0])
      var role = tree_right.getNodeByParam('name', '角色', tree_right.getNodes()[0])
      if (user) {
        tree_left_user.addNodes(tree_left_user.getNodes()[0], user.children)
      }
      if (userGroup) {
        tree_left_group.addNodes(tree_left_group.getNodes()[0], userGroup.children)
      }
      if (role) {
        // tree_role.instance.addNodes(tree_role.instance.getNodes()[0], role.children)
        tree_role.instance.destroy()
        tree_role.instance = zTree.init($('#role-tree'), tree_role.setting,
          allRoles.concat({name: '角色', id: null, pid: 0, open: true}))
      }
      tree_right.removeChildNodes(tree_right.getNodes()[0])
    },
    // 保存接收人
    saveUser: function () {
      $('#choose-user').modal('hide')
      this.need_init = false
      var tree = zTree.getZTreeObj('choose-users-tree1')
      // 获取所有节点
      var par = tree.getNodes()[0]
      var users = tree.getNodeByParam('name', '用户', par)
      var userGroup = tree.getNodeByParam('name', '用户群', par)
      var roles = tree.getNodeByParam('name', '角色', par)
      users = users ? users.children : []
      userGroup = userGroup ? userGroup.children : []
      roles = roles ? roles.children : []
      vm.selectUsers(users)
      vm.selectGroups(userGroup)
      vm.selectRoles(roles)
      this.convertUserToStr(users, userGroup, roles)
    },
    cancelSaveUser: function () {
      this.selectUsers(this.selectUsers())
      this.selectGroups(this.selectGroups())
      this.selectRoles(this.selectRoles())

      // 清空角色对应用户
      var obj = zTree.getZTreeObj('role-users')
      if (obj) obj.destroy()
    },

    convertUserToStr: function (users, userGroup, roles) {
      var str = ''
      var str1 = ''
      // 获取用户群
      if (userGroup && userGroup.length) {
        str = '用户群' + '-' + userGroup.map(function (o) {
            return o.name
          }).join(',')
        str1 = '用户群' + '-' + userGroup.map(function (o) {
            return o.id
          }).join(',')
      }
      if (users && users.length) {
        str = str && str + ';'
        str1 = str1 && str1 + ';'
        str += '用户' + '-' + users.map(function (o) {
            return o.name
          }).join(',')
        str1 += '用户' + '-' + users.map(function (o) {
            return o.id
          }).join(',')
      }
      if (roles && roles.length) {
        str = str && str + ';'
        str1 = str1 && str1 + ';'
        str += '角色-' + roles.map(function (o) {
            return o.name
          }).join(',')
        str1 += '角色-' + roles.map(function (o) {
            return o.id
          }).join(',')
      }
      this.receiver(str)
      this.receiver1(str1)
    },

    selUser2: function () {
      var tree_left = zTree.getZTreeObj('user-tree2')
      var tree_right = zTree.getZTreeObj('edit-userGroup')
      var nodes = tree_left.getSelectedNodes()
      if (!nodes.length) {
        ip.ipInfoJump('请先选中一个节点', 'warn')
        return
      }
      tree_left.removeNode(nodes[0])
      tree_right.addNodes(tree_right.getNodes()[0], nodes)
    },
    selAllUser2: function () {
      var tree_left = zTree.getZTreeObj('user-tree2')
      var tree_right = zTree.getZTreeObj('edit-userGroup')
      var node = tree_left.getNodes()[0]
      tree_right.addNodes(tree_right.getNodes()[0], node.children)
      tree_left.removeChildNodes(node, node.children)
    },
    removeUser2: function () {
      var tree_left = zTree.getZTreeObj('user-tree2')
      var tree_right = zTree.getZTreeObj('edit-userGroup')
      var nodes = tree_right.getSelectedNodes()
      if (!nodes.length) {
        ip.ipInfoJump('请先选中一个节点', 'warn')
        return
      }
      tree_right.removeNode(nodes[0])
      tree_left.addNodes(tree_left.getNodes()[0], nodes)
    },
    removeAllUser2: function () {
      var tree_left = zTree.getZTreeObj('user-tree2')
      var tree_right = zTree.getZTreeObj('edit-userGroup')
      var node = tree_right.getNodes()[0]
      tree_left.addNodes(tree_left.getNodes()[0], node.children)
      tree_right.removeChildNodes(node, node.children)
    },

    /**
     * 用户群配置
     */
    groupName: ko.observable(''),
    // 用户群配置
    confUsers: function () {
      $('#conf-users').modal()
      fetchGroupAndUser()
    },
    // 增加新用户群
    addUserGroup: function () {
      this.groupName('新建用户群')
      var newNode = tree31.instance.addNodes(tree31.instance.getNodes()[0], {name: '新建用户群'})[0]
      tree31.instance.selectNode(newNode)
      tree31.setting.callback.onClick(null, 'user-groups', newNode)
    },

    saveUserGroup: function () {
      var nodes = zTree.getZTreeObj('edit-userGroup').getNodes()[0].children
      var groupName = this.groupName().trim()
      if (!groupName) {
        ip.ipInfoJump('群名称不能为空', 'info')
        return
      }
      var groupId = tree31.groupId || ''
      var userIdStr = nodes.map(function (o) {
        return o.id
      }).join('#')
      var data = {
        groupName: groupName,
        groupId: groupId,
        userIdStr: userIdStr
      }
      var self = this
      ip.loading(true)
      $.ajax({
        method: 'POST',
        url: url.SAVE_GROUP,
        data: data,
        dataType: 'json',
        success: function (data) {
          ip.loading(false)
          if (data.result === 'success') {
            ip.ipInfoJump('保存成功', 'success')
            var oldGroups = allUserGroup
            allUserGroup = null
            fetchGroupAndUser(function (data) {
              var newGroup = null
              data.canSelectUserGroups.some(function (group) {
                if (oldGroups.every(function (group2) {
                    return group2.id !== group.id
                  })) {
                  newGroup = group
                  return true
                }
              })
              var tree = zTree.getZTreeObj('users-group1')
              var par = tree.getNodes()[0]
              tree.addNodes(par, newGroup)
            })
            self.clearUserGroupView()
          }
        },
        error: function () {
          ip.ipInfoJump('保存失败', 'error')
        }
        ,
      })

      function _init(list) {
        for (var key in list[0]) {
          if (vm.msg[key]) {
            vm.msg[key](list[0][key])
          }
        }
        if (list['send_type']) {
          list['send_type'].split('').forEach(function (flag, i) {
            flag = flag !== 0
            switch (i) {
              case 0:
                vm.send_type.sys(flag);
                break
              case 1:
                vm.send_type.app(flag);
                break
              case 2:
                vm.send_type.info(flag);
                break
              case 3:
                vm.send_type.wechat(flag);
                break
            }
          })
        }
      }
    },

    clearUserGroupView: function () {
      this.groupName('')
      tree32.instance.removeChildNodes(tree32.instance.getNodes()[0])
      tree33.instance.removeChildNodes(tree33.instance.getNodes()[0])
    },
    cancelUserGroup: function () {
      this.clearUserGroupView()
      // tree31.instance.removeNode(tree31.instance.getNodes()[0].children.pop())
      fetchGroupAndUser()
    },
    delGroup: function () {
      var nodes = tree31.instance.getSelectedNodes()
      if (!nodes.length) {
        ip.ipInfoJump('请先选中一个用户群', 'info')
        return
      }
      delGroup(nodes[0])
    },
  }

  vm.selectUsers.subscribe(function (newV) {
    var children = allUsers ? allUsers.filter(function (user) {
      return !newV.some(function (selUser) {
        if (selUser.id === user.id) return true
      })
    }) : []

    var nodes = [{
      name: '用户',
      children: children,
      isParent: true,
    }]
    if (zTree.getZTreeObj('user-tree1')) zTree.getZTreeObj('user-tree1').destroy()
    zTree.init($('#user-tree1'), set_users, nodes).expandAll(true)
    updateReceiverTree()
  })
  vm.selectGroups.subscribe(function (newV) {
    var children = allUserGroup ? allUserGroup.filter(function (user) {
      return !newV.some(function (selUser) {
        if (selUser.id === user.id) return true
      })
    }) : []
    var nodes = [{
      name: '用户群',
      children: children,
      isParent: true,
    }]
    if (zTree.getZTreeObj('users-group1')) zTree.getZTreeObj('users-group1').destroy()
    zTree.init($('#users-group1'), set_users, nodes).expandAll(true)
    updateReceiverTree()
  })

  vm.selectRoles.subscribe(function (newV) {
    var children = allRoles ? allRoles.filter(function (role) {
      if (!role.pid) role.isParent = true
      return !newV.some(function (selRole) {
        if (role.pid && selRole.id === role.id) return true
      })
    }) : []
    tree_role.nodes = children.concat({id: null, pid: 0, name: '角色', open: true})
    if (tree_role.instance) tree_role.instance.destroy()
    tree_role.instance = zTree.init($('#role-tree'), tree_role.setting, tree_role.nodes)
    // tree_role.instance.expandAll(true)
    updateReceiverTree()
  })

  // 更新接收人树
  function updateReceiverTree() {
    var users = vm.selectUsers()
    var groups = vm.selectGroups()
    var roles = vm.selectRoles()
    var children = []
    if (users.length) children.push({name: '用户', children: users, isParent: true})
    if (groups.length) children.push({name: '用户群', children: groups, isParent: true})
    if (roles.length) children.push({name: '角色', children: roles, isParent: true})
    var nodes = [{
      name: '全部',
      children: children,
    }]
    if (zTree.getZTreeObj('choose-users-tree1')) zTree.getZTreeObj('choose-users-tree1').destroy()
    zTree.init($('#choose-users-tree1'), set_selected, nodes).expandAll(true)
  }


  function fetchReceiver(msgRuleId, callback) {
    msgRuleId = msgRuleId || ''
    ip.loading(true)
    $.ajax({
      url: url.GET_USERS + '&msgRuleId=' + msgRuleId,
      success: function (data) {
        ip.loading(false)
        if (data.result === 'success') {
          // _init(data)
          // userTree = data
          var roles = data.hasSelectedRole.filter(function (role) {
            return role.pid
          })
          allUsers = allUsers || data.canSelectUsers.concat(data.hasSelectedUsers)
          allUserGroup = allUserGroup || data.canSelectUserGroups.concat(data.hasSelectedGroup)
          allRoles =
            allRoles || data.canSelectedRole.concat(roles)
          vm.selectUsers(data.hasSelectedUsers)
          vm.selectGroups(data.hasSelectedGroup)
          vm.selectRoles(roles)
          callback && callback(data)
        }
      },
      error: function () {
        ip.ipInfoJump('获取节点失败', 'error')
      }
      ,
    })
  }


  // vm.selectUsers.push({name: 'hello'})
  // vm.selectUsers.push({name: 'hello2'})

  function delGroup(node) {
    ip.loading(true)
    $.ajax({
      method: 'POST',
      url: url.DEL_GROUP + '&userGroupId=' + node.id,
      success: function (data) {
        ip.loading(false)
        if (data.result === 'success') {
          ip.ipInfoJump('删除成功', 'success')
          _init()
        }
      },
      error: function () {
        ip.ipInfoJump('删除失败', 'error')
        // _init()
      }
      ,
    })

    function _init() {
      tree31.instance.removeNode(node)
      vm.clearUserGroupView()
    }
  }

  function delRule(node) {
    ip.loading(true)
    $.ajax({
      method: 'POST',
      url: url.DEL_RULE + '&msgRuleId=' + node.id,
      success: function (data) {
        ip.loading(false)
        if (data.result === 'success') {
          ip.ipInfoJump('删除成功', 'success')
          _init()
        }
      },
      error: function () {
        ip.ipInfoJump('删除失败', 'error')
        // _init()
      }
      ,
    })

    function _init() {
      tree11.instance.removeNode(node)
      // vm.clearUserGroupView()
      vm.clearMainView()
    }
  }

  function fetchGroupAndUser(callback) {
    if (allUserGroup) {
      _init(allUserGroup)
      return
    }
    ip.loading(true)
    $.ajax({
      url: url.GET_USERS + '&msgRuleId=',
      success: function (data) {
        ip.loading(false)
        if (data.result === 'success') {
          callback && callback(data)

          allUserGroup = data.canSelectUserGroups
          userTree = null

          // vm.openUserModal()
          _init(data.canSelectUserGroups)
        }
      },
      error: function () {
        ip.ipInfoJump('获取所有节点失败', 'error')
        // _init(users)
      }
      ,
    })

    function _init(list) {
      tree31.nodes = [{name: '用户群', children: list}]
      tree31.instance = zTree.init($('#user-groups'), tree31.setting, tree31.nodes)
      tree31.instance.expandAll(true)

      tree32.nodes = [{name: '用户', children: []}]
      tree32.instance = zTree.init($('#user-tree2'), tree32.setting, tree32.nodes)

      tree33.nodes = [{name: '用户', children: []}]
      tree33.instance = zTree.init($('#edit-userGroup'), tree33.setting, tree33.nodes)
    }
  }

  // 只能输入整型的input
  $(document).on('input', 'input[data-number]', function (e) {
    var t = e.target
    t.value = t.value.replace(/[^0-9]/g, '')
  })

  // vm.msg.wf_flow_id.subscribe(vm.getNodes.bind(vm))
  function collectWf() {
    var flow = $('#wf-flow').val(),
      node = $('#wf-node').val(),
      action = $('#wf-action').val();
    // 设置wf_flow_name  wf_flow_code
    var obj = wfList.filter(function (o) {
      return o.chr_id === flow
    })[0]
    this.msg.wf_flow_id(flow)
    this.msg.wf_flow_code(obj.chr_code)
    this.msg.wf_flow_name(obj.chr_name)

    // 设置wf_node_name  wf_node_code
    obj = wfNodes.filter(function (o) {
      return o.chr_id === node
    })[0]
    this.msg.wf_node_id(node)
    this.msg.wf_node_code(obj.chr_code)
    this.msg.wf_node_name(obj.chr_name)

    // 设置wf_node_name  wf_node_code
    var arr = wfActions[action - 1].split(' ')
    this.msg.wf_action_id(action)
    this.msg.wf_action_code(arr[0])
    this.msg.wf_action_name(arr[1])
  }

  function valid() {
    var flow = $('#wf-flow').val(),
      node = $('#wf-node').val(),
      action = $('#wf-action').val();
    var msg = ko.toJS(vm.msg)
    if (!msg.msg_rule_code) {
      ip.ipInfoJump('"规则编码"不能为空', 'info')
      return
    }
    if (vm.msg_type === 'new' && msgRules.some(function (o) {
        if (o.code === msg.msg_rule_code) return true
      })) {
      ip.ipInfoJump('"规则编码"已存在, 请重新输入', 'info')
      return
    }
    if (!msg.msg_rule_name.trim()) {
      ip.ipInfoJump('"规则名称"不能为空', 'info')
      return
    }
    if (msg.invoketype == 1) {
      if (!flow) {
        ip.ipInfoJump('"流程"不能为空', 'info')
        return
      }
      if (!node) {
        ip.ipInfoJump('"节点"不能为空', 'info')
        return
      }
      if (parseInt(action) == 0) {
        ip.ipInfoJump('"操作"不能为空', 'info')
        return
      }
    }
    if (!msg.msg_rule_name.trim()) {
      ip.ipInfoJump('"规则名称"不能为空', 'info')
      return
    }
    if (!msg.content_title.trim()) {
      ip.ipInfoJump('"标题"不能为空', 'info')
      return
    }
    return true
  }

  function treeSearch(keyword, treeId, inputId, key, type) {
    window._tree_list = window._tree_list || []
    var list = window._tree_list
    list.indexOf(treeId) < 0 && list.push(treeId)

    // 将其它tree的index置零
    list.forEach(function (id) {
      if (id !== treeId) {
        $.fn.zTree.getZTreeObj(id).sel_index = 0
      }
    })

    var tree = $.fn.zTree.getZTreeObj(treeId)
    typeof tree.sel_index === 'undefined' && (tree.sel_index = 0)
    // 更换关键字后, sel_index置零, search_rs置空
    if (keyword !== tree.keyword) {
      tree.sel_index = 0
      tree.keyword = keyword
      tree.search_rs = []
    }

    type = type || 'next'
    tree.search_rs = tree.search_rs && tree.search_rs.length ?
      tree.search_rs : tree.getNodesByParamFuzzy(key, keyword, null)
    !keyword.trim() && (tree.search_rs = [])
    // 对一些值过滤
    tree.search_rs = tree.search_rs.filter(function (obj) {
      if (obj && obj.level && !obj.children) {
        return obj
      }
    })

    // 搜索命中
    var node
    if (tree.search_rs.length) {
      node = tree.search_rs[tree.sel_index]
      tree.selectNode(node)
      if (typeof tree.setting.callback.onClick === 'function')
        tree.setting.callback.onClick({}, treeId, node)
      if (type === 'next') {
        tree.sel_index++
        tree.sel_index > tree.search_rs.length - 1 && (tree.sel_index = 0)
      } else {
        tree.sel_index--
        tree.sel_index < 0 && (tree.sel_index = 0) && (tree.sel_index = tree.search_rs.length - 1)
      }
    } else {
      tree.cancelSelectedNode()
    }
    setTimeout(function () {
      $('#' + inputId).focus()
    }, 0)
  }

  function fetchTmpl() {
    ip.loading(true)
    $.ajax({
      url: url.GET_TMPL,
      success: function (data) {
        if (data.result === 'success' && data.msgRules) {
          ip.loading(false)
          initTree(data.msgRules)
        }
      },
      error: function () {
        ip.ipInfoJump('获取消息模板列表失败', 'error')
        initTree(msgRules)
      }
      ,
    })
    // initTree()

    function initTree(list) {
      // var tree = zTree.getZTreeObj('tmpl-list')
      // if(tree) tree.destroy()
      tree11.nodes = list
      tree11.instance =
        $.fn.zTree.init($('#tmpl-list'), tree11.setting, list)
      tree11.instance.expandAll(true)
    }
  }

  function fetchWf() {
    $.ajax({
      url: url.GET_WF,
      success: function (data) {
        if (data.result === 'success' && data.wfList) {
          initSelect(data.wfList)
        }
      },
      error: function () {
        ip.ipInfoJump('获取流程列表失败', 'error')
        initSelect(wfList)
      }
      ,
    })

    function initSelect(list) {
      wfList = list
      list = list.map(function (o) {
        return {
          id: o.chr_id,
          text: o.chr_name
        }
      })
      $('#wf-flow').select2({
        data: list
      })
      // vm.wf_list(list)
    }
  }

  function initAction() {

    var data = wfActions.map(function (str, i) {
      return {id: i + 1, text: str}
    })
    $('#wf-action').select2({
      data: data,
      minimumResultsForSearch: -1
    })
  }


  function init() {
    fetchTmpl()
    fetchWf()
    initAction()
    ko.applyBindings(vm, document.getElementById('app'))
  }

  init()

  // var data = [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
  //
  // $(".js-example-data-array").select2({
  //   data: data
  // })

});
