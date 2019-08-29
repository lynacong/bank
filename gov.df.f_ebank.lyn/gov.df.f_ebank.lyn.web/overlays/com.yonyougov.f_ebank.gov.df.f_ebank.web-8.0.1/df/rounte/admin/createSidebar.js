!function () {	
  var selector = ''
  var menuList = []
  var tokenid = '',
  $img,
  $root;

  function init(opt) {
    selector = opt.selector;
    menuList = adapter(opt.data, 'guid', 'parentid', 'menu_name');
    tokenid = opt.tokenid;
      $img = $('<div id="_temp-img" style="text-align: center; color: #fff; width: 100px; height: 100px; position: absolute; left: 50%; top: 100px; margin-left: -50px;"><img src="static/loading-refresh.gif" style="max-width: 100%;">加载中...</div>');
      $(selector).empty().parent().append($img);
      if (!window.ko) {
        $.getScript('trd/knockout/knockout-3.2.0.debug.js', createSidebarByKo);
      } else
        createSidebarByKo();
  }
  // 改写菜单数据
  function adapter(list, id, pid, name) {
    return list.map(function (o) {
      o.name = o[name];
      o.id = o[id];
      o.pid = o[pid];
      return o;
    });
  }
  
  function getChildren(pid, list, openAll) {
    return list.filter(function (o) {
      if (o.pid === pid) {
        o.children = getChildren(o.id, list, openAll);
        o.isFolder = ko.observable(!!(o.children && o.children.length));
        o.open = ko.observable(openAll);
        o.isOpen=false;
       var openMenuId= sessionStorage.getItem("openMenuId");
        if(openMenuId != null && openMenuId == o.id){
        	o.open = ko.observable(true); 
        	o.isOpen = true;
        }
       for(var i=0;i<o.children.length;i++){
    		if(o.children[i].isOpen){
    			o.open=ko.observable(true);	
    			o.isOpen=true;
    		}
    	}
        return true;
      }
    });
  }

  function createSidebarByKo() {
	$(selector).html("");
    $(selector).load('createSidebarByKo.html', function () {
      var vm = new Vm();
      $root = vm;
      ko.cleanNode($(selector)[0]);
      //激活knockout 使页面中的data-bind起作用，因为data-bind不是HTML原生的属性
      //第二个参数可以声明成使用data-bind的HTML元素或者容器，只激活$(selector)[0]，能实现一个页面声明对个viewModel
      ko.applyBindings(vm, $(selector)[0]);

      function Vm() {
        var self = this;
        this.menuList = menuList;
        this.openAll = ko.computed(function () {
            return false;
        }, this);
        this.menu = ko.computed(function () {
          var list1 = this.menuList.filter(function (o) {
            return o.levelno == 1;
          });
          var list = list1.map(function (o) {
            o.children = getChildren(o.id, self.menuList, self.openAll());
            o.isFolder = ko.observable(!!(o.children && o.children.length));
            o.open = ko.observable(self.openAll());		
            o.isOpen=false;
            for(var i=0;i<o.children.length;i++){
        		if(o.children[i].isOpen){
        			o.open=ko.observable(true);		
        			o.isOpen=true;
        		}
            }
            return o;
          });
          return list;
        }, this);
        //待办事项点击事件
        this.dealClick = function(){
          	sessionStorage.setItem("openMenuId","");
          	sessionStorage.setItem("menuname","");
          	createSidebarByKo();
          	window.location.href = "/df/rounte/admin/index.html";
        };
        this.toggle = function (model) {
          if (model.isFolder()) {
            model.open(!model.open());
          } else {
            var url = model.url;
            var menuid = model.id;
            var menuname = model.name;
            url += '&menuid='+menuid+'&menuname='+encodeURI(menuname);
            sessionStorage.setItem("menuId",menuid || "");
            sessionStorage.setItem("curUrl", url || "");
            sessionStorage.setItem("menuname", menuname || "");
            sessionStorage.setItem("openMenuId",menuid);
            var r_url = url.split(".");
			var	R_url=r_url[0].substring(12);
            var module = menuid+"/"+R_url;
            sessionStorage.setItem("curMenuPatn", module);
            initPage();
        	createSidebarByKo();
            var isCheckFirst = sessionStorage.getItem("isCheckFirst");
            if(isCheckFirst==null||isCheckFirst==1){
            	sessionStorage.setItem("isCheckFirst", "2");
            	initPage();
            	createSidebarByKo();
            }else{
            	window.location.reload();
            }
          }
        }

        this.afterRender = function() {
          resetCss();
          setTimeout(function() {
            $(document.body).removeClass('sidebar-collapse');
          }, 0);
        }
      }
    })
  }
  
  
/*	function initPageKo(p) {
        var module = p;

        localStorage.setItem("menuId", params["menuId"] || "");
        localStorage.setItem("curUrl", params["url"] || "");
        // localStorage.setItem("curUrl", params["url"] || "");

        //$($('#menu,#nav-zone').find(aa)[0]).parent().addClass('specli');
        localStorage.setItem("addMenu", module);
        //window.location.href="/df/rounte/admin/index.html";
        //document.URL=location.href;
        var isCheckFirst = localStorage.getItem("isCheckFirst");
        if(isCheckFirst!=null&&isCheckFirst==1){
        	localStorage.setItem("isCheckFirst", "2");
        	reCallOriRouter();
        }else{
        	window.location.reload();
        }
        
    }*/

  function resetCss() {
	  $('#menu').css({
	      top:'0px',
	      height:'100%'
	    });

  }

  window.createSideBar = init;
}();