!function () {
  var selector = ''
  var menuList = []
  var tokenid = ''

  function init(opt) {
    selector = opt.selector
    menuList = adapter(opt.data, 'guid', 'parentid', 'menu_name')
    tokenid = opt.tokenid
    if (!window.Vue)
      loadScript('/df/portal/admin/index/js/vue.js', createSidebar)
    else createSidebar()
  }

  function adapter(list, id, pid, name) {
    return list.map(function (o) {
      o.name = o[name]
      o.id = o[id]
      o.pid = o[pid]
      return o
    })
  }

  function createSidebar() {
    $(selector).load('./createSidebar.html', function () {
      // 注册全局组件
      Vue.component('item', {
        template: '#item-template',
        props: {model: Object, openAll: Boolean},
        data: function () {
          return {
            open: this.openAll,
          }
        },
        computed: {
          isFolder: function () {
            return this.model.children && this.model.children.length
          },
        },
        methods: {
          toggle: function () {
            if (this.isFolder) {
              this.open = !this.open
            } else {
              var url = this.model.url
              var menuid = this.model.id
              var menuname = this.model.name
              var params = [['tokenid', tokenid], ['menuid', menuid], ['menuname', menuname]]
              var paramsStr = params.map(function (o) {
                o[1] = encodeURIComponent(o[1])
                return o.join('=')
              }).join('&')
             // url += (url.indexOf('?') > 0 ? '&' : '?') + paramsStr
              url = fullUrlWithTokenid(url)+'&menuid=' + menuid + '&menuname='+escape(menuname);
              window.parent.addTabToParent(this.model.name, url)
            }
          },
        },
      })

      new Vue({
        el: selector,
        data: {
          menuList: menuList,
        },
        computed: {
          menu: function () {
            var self = this
            var list1 = this.menuList.filter(function (o) {
              return o.levelno == 1
            })
            var list = list1.map(function (o) {
              o.children = self.getChildren(o.id, self.menuList)
              return o
            })
            return list
          },
          openAll: function () {
            return this.menuList.length < 100
          },
        },
        methods: {
          getChildren: function (pid, list) {
            var self = this
            return list.filter(function (o) {
              if (o.pid === pid) {
                o.children = self.getChildren(o.id, list)
                return true
              }
            })
          },
        },
          beforeCreate: function() {
          $('#sidebar-btn')[0].click()
        },
        mounted: function () {
          $('.main-sidebar').css({
            bottom: 0,
            'padding-bottom': '15px',
            paddingTop: 0,
          })
          $('#sidebar').css({
            paddingTop: '38px',
            height: 'calc( 100% - 24px )',
            'overflow': 'auto',
          })
          $('#_sidebar_menu').css({
            overflow: 'visible',
          }).addClass('overflow-auto')

        },
      })
    })
  }

  function loadScript(url, callback) {
    var script = document.createElement('script')
    script.src = url
    script.onload = callback
    document.body.appendChild(script)
  }

  window.createSideBar = init
}()