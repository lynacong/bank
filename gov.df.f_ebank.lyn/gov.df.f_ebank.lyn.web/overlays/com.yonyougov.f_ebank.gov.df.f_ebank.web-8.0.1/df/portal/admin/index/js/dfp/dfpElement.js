/**
 * 门户页面组件
 */
dfpElement = {};
dfpEle = dfpElement;

/**
 * 全局基础配置 options
 */
var dfpEleRoot = this,
    dfpDebugState = false;
dfpEle.console = function (msg) {
    dfpDebugState && dfpEleRoot.console.log(msg);
};
dfpEle.o = {
    // 全局color
    colors: {
        lightBlue: "#3c8dbc",
        red: "#f56954",
        green: "#00a65a",
        aqua: "#00c0ef",
        yellow: "#f39c12",
        blue: "#0073b7",
        navy: "#001F3F",
        teal: "#39CCCC",
        olive: "#3D9970",
        lime: "#01FF70",
        orange: "#FF851B",
        fuchsia: "#F012BE",
        purple: "#8E24AA",
        maroon: "#D81B60",
        black: "#222222",
        gray: "#d2d6de"
    },
    // 屏幕尺寸 px
    screenSizes: {
        xs: 480,
        sm: 768,
        md: 992,
        lg: 1200
    },
    /**
     * 我的单据配置
     */
    givenMenu: [
        //"用款计划",
        {"code": "00111510001", "name": "用款计划", "menuid": "", "type": "261"},
        //"授权支付申请",
        {"code": "00111510003", "name": "授权支付", "menuid": "", "type": "366"},
        //"直接支付申请",
        {"code": "00111510002", "name": "直接支付", "menuid": "", "type": "361"},
        //"授权支付清算额度单"
        {"code": "00111501005", "name": "授权汇总清算", "menuid": "", "type": "232"},
        //"直接支付汇总清算单",
        {"code": "00111501004", "name": "直接汇总清算", "menuid": "", "type": "331"}
    ]
};

/**
 * 按钮
 */
dfpEle.btn = {
    smbtnClass: 'dfp-smbtn',
    /**
     * 小按钮鼠标滑动事件添加，检测 .dfp-smbtn
     */
    smbtnMouseEvent: function () {
        var cls = this.smbtnClass;
        $("." + cls).on("mouseover", function () {
            $(this).css("background", "#108ee9").find("i").css("color", "#f8f8f8");
        }).on("mouseleave", function () {
            $(this).css("background", "#dbf3f3").find("i").css("color", "#108ee9");
        });
    },
    /**
     * 小按钮，位于标题同行右侧
     * @params o 对象，设置必要的参数
     */
    smbtn: function (o) {
        var id = o['id'] || '', // btn id
            title = o['title'] || '按钮', // btn title
            bcls = 'btn btn-sm ' + (o['bcls'] || 'btn-info'), // btn class
            bstyle = o['bstyle'] || 'font-size:16px;padding:2px;border:none;background:#dbf3f3;color:#108ee9;margin-right:4px;';
        icls = 'fa fa-fw ' + (o['icls'] || 'fa-power-off'), // btn > i class
            istyle = 'padding:0;' + (o['istyle'] || '');
        return '<button type="button" class="' + bcls + ' ' + this.smbtnClass + '" style="' + bstyle + '" title="' + title + '" id="' + id + '">' +
            '<i class="' + icls + '" style="' + istyle + '"></i>' +
            '</button>';
    },

    /**
     * 获取按钮组，包含外层div
     * @params objs 对象数组，[{id:'id', options:[{},{},..]},{id:'id', options:[{},{},..]},...]
     * <div class="pull-right box-tools" >
     <button type="button" class="btn btn-info btn-sm" title="最大化" id="payProgressDetailMax">
     <i class="fa fa-fw fa-square-o" style="padding: 0;"></i>
     </button>
     <button type="button" class="btn btn-info btn-sm" title="导出" id="payProgressDetailExport">
     <i class="fa fa-download" style="padding: 0;"></i>
     </button>
     </div>
     */
    smbtns: function (objs) {
        for (var i in objs) {
            if (!objs.hasOwnProperty(i)) continue;
            var o = objs[i].options,
                html = '';
            for (var j in o) {
                if (!o.hasOwnProperty(j)) continue;
                html += this.smbtn(o[j]);
            }
            $("#" + objs[i].id).addClass("pull-right box-tools");
            $("#" + objs[i].id).html(html);
        }
        this.smbtnMouseEvent();
    }

};

/**
 * 标签页
 */
dfpEle.tab = {
    /**
     * tab标签ul.id
     */
    _header: '_navtab-header-ul',
    /**
     * tab内容div.id
     */
    _content: '_navtab-content-div',
    /**
     * 标签最外层html
     */
    tabTop: ['<div class="nav-tabs-custom">', '</div>'],
    /**
     * 预定义标签类型
     */
    type: {
        // 集中支付-右上-我的单据
        JZZF_DAN: 'JZZF_DAN'
    },

    /**
     * 生成tab标签
     * @params $obj jq对象
     * @params o 对象，[{name:'', content:{_type:'', ..}}, {}, ..]
     */
    init: function ($obj, objs) {
        var _headerId = this._header + '_' + Date.parse(new Date()),
            _contentId = this._content + '_' + Date.parse(new Date());
        var ulHtml = ['<ul id="' + _headerId + '" class="nav nav-tabs">', '</ul>'],
            divHtml = ['<div id="' + _contentId + '" class="tab-content">', '</div>'];
        // 暂存临时ID，用于自动创建的tab.id
        var ids = [];
        // 获取 html
        for (var o in objs) {
            if (!objs.hasOwnProperty(o)) continue;
            ids.push('_navtab-header-ul-li' + Date.parse(new Date()));
            var _type = o['content']['_type'];
            // 集中支付-我的单据
            if (_type == this.type.JZZF_DAN) {
                ulHtml += '';
                divHtml += this.contentHtmlPre(type);
            } else {
                ulHtml[0] += this.headerHtml(o['content']['_type'], ids[ids.length - 1], o['name']);
                divHtml[0] += this.contentHtml(o['content']['_type']);
            }
        }
        ulHtml += '</ul>';
        divHtml += '</div>';
        $($obj).html('').html(ulHtml + divHtml);
        // 激活第一个标签
        $("#" + _headerId).find('li:eq(0)').addClass('active');
        $("#" + _contentId).find('div:eq(0)').addClass('active');
    },
    /**
     * 获取tab标签
     */
    headerHtml: function (type, id, name) {
        var html = '';
        if (type == this.type.JZZF_DAN)
            html += '<li><a href="#' + id + '" data-toggle="tab">' + name + '</a></li>';
        return html;
    },
    /**
     * 获取tab标签内容
     * @params o 对象，{_type:'', ...}
     */
    contentHtml: function (o) {
        var html = this.contentHtmlPre(o['_type']) || '';
        // TODO 加入其他类型判断，及动态值替换

        return html;
    },
    /**
     * 标签内容预设
     */
    contentHtmlPre: function (type) {
        var o = {
            /**
             * 刷选出我的单据
             */
            dan: function () {
                var showMenu = [],
                    html = '';
                // 获取菜单第三级
                var dfp_menu_lv3 = dfp_util.isGetValue();
                // 获取我的单据配置
                var givenMenu = dfpEle.o.givenMenu;
                // 以我的单据为主匹配
                for (var i = 0; i < givenMenu.length; i++) {
                    for (var j in dfp_menu_lv3) {
                        if (!dfp_menu_lv3.hasOwnProperty(j)) continue;
                        var onemenu = dfp_menu_lv3[j];
                        if (onemenu.code == givenMenu[i].code) {
                            var row = givenMenu[i];
                            row.menuid = onemenu.guid;
                            row.menu_name = onemenu.menu_name;
                            row.name = onemenu.menu_name;
                            row.type = dfp_util.getUrlParameter(onemenu.url, 'billtype');
                            row.url = fullUrlWithTokenid(onemenu.url) + '&menuid=' + onemenu.guid + '&menuname=' + escape(onemenu.name);
                            showMenu.push(row);
                        }
                    }
                }
                // 生成tab标签

                // 生成tab标签内容

            }

        }
        return o[type()];
    }

};

/**
 * ajax获取数据
 */
dfpEle.ajax = {};
/**
 * 获取我的单据
 * @params options 对象，{bsibilltypecode:x, bsinodecode:x, menuid:x}
 */
dfpEle.func = {};
dfpEle.func.fundmonitor = {
    init: function ($id, type) {

        // 加载层 - 当前仅用于JZZF
        $("#selfDocumentsRefreshCover").css("display", "block");

        var showMenu = [];
        var dfp_menu_lv3 = dfp_util.isGetValue();
        // 匹配
        var givenMenu = [
            //"用款计划",
            {"code": "00111510001", "name": "用款计划", "menuid": "", "type": "261"},
            //"授权支付申请",
            {"code": "00111510003", "name": "授权支付", "menuid": "", "type": "366"},
            //"直接支付申请",
            {"code": "00111510002", "name": "直接支付", "menuid": "", "type": "361"},
            //"授权支付清算额度单"
            {"code": "00111501005", "name": "授权汇总清算", "menuid": "", "type": "232"},
            //"直接支付汇总清算单",
            {"code": "00111501004", "name": "直接汇总清算", "menuid": "", "type": "331"}
        ];
        for (var i = 0; i < givenMenu.length; i++) {
            for (var j in dfp_menu_lv3) {
                if (!dfp_menu_lv3.hasOwnProperty(j)) continue;
                var onemenu = dfp_menu_lv3[j];
                if (onemenu.code == givenMenu[i].code) {
                    var row = givenMenu[i];
                    row.menuid = onemenu.guid;
                    row.menu_name = onemenu.menu_name;
                    //row.name = onemenu.menu_name;
                    row.type = dfp_util.getUrlParameter(onemenu.url, 'billtype');
                    row.url = fullUrlWithTokenid(onemenu.url) + '&menuid=' + onemenu.guid + '&menuname=' + escape(onemenu.name);
                    showMenu.push(row);
                }
            }
        }
        // 创建ul、div ID
        var _headerId = '_navtab-header-ul_' + Date.parse(new Date()),
            _contentId = '_navtab-header-div_' + Date.parse(new Date());
        var ulHtml = ['<ul id="' + _headerId + '" class="nav nav-tabs">', '</ul>'],
            divHtml = ['<div id="' + _contentId + '" class="tab-content" style="padding: 0;">', '</div>'];
        // 暂存临时ID，用于自动创建的tab.id
        var ids = [];
        var width = '30%';
        if (showMenu.length > 3) {
            width = 99 / showMenu.length + '%'; // li 宽度
        }
        for (var i = 0; i < showMenu.length; i++) {
            ids.push('_navtab-header-ul-li2div-' + Date.parse(new Date()));
            if (type == 'JZZF_DAN')
                ulHtml[0] += '<li style="width: ' + width + ';"><a style="padding: 3px;" href="#' + ids[ids.length - 1] + '" billtype="' + showMenu[i].type + '" data-toggle="tab">' + showMenu[i].name + '</a></li>';
            else
                ulHtml[0] += '';
            // 获取tab标签内容
            divHtml[0] += this._ajax(showMenu[i], ids[ids.length - 1]);
        }
        $("#" + $id).find('div').html(ulHtml.join('') + divHtml.join(''));
        // 激活第一个标签
        $("#" + _headerId).find('li:eq(0)').addClass('active');
        $("#" + _contentId).find('div:eq(0)').addClass('active');
        // 激活表格行样式
        this.trStyle(_contentId);

        $("#selfDocumentsRefreshCover").css("display", "none");
    },
    /**
     * 获取tab内容
     * @params menu 菜单
     * @params id tab标签内容div.id，与对应的tab标签id相同
     * @params unit 金额单位、表格表头（元、万元、亿元）
     */
    _ajax: function (menu, id, unit) {
        var options = {
            "bsibilltypecode": menu.type,
            "bsinodecode": '',
            "menuid": menu.menuid
        };
        var html = '';

        // TODO 创建私有table样式
        var dfpTabTableClass = 'dfp-tab-table';

        $.ajax({
            url: "/df/pay/search/mainpage/getMyBillCount.do",
            type: "GET",
            dataType: "json",
            async: !1,
            data: dfp.commonData(options),
            success: function (data) {
                var _zhifu = data.dataDetail;
                // 绘制一个表格
                html = '<div class="tab-pane" id="' + id + '" style="padding: 0px;margin-bottom: -10px;">' +
                    '<div class="box">' +
                    '<div class="box-body table-responsive no-padding">' +
                    '<table class="table table-hover ' + dfpTabTableClass + '"><tbody>';
                var showUnit = '(' + (!unit || unit == 1 ? '万元' : (unit == 0 ? '元' : (unit == 2 ? '亿元' : '万元'))) + ')';
                //html += '<tr class="dfp-ele-table-tr0" style="background: rgb(233, 233, 233);cursor: default;text-align: center;height: 100%;line-height: 27px;"><th>状态</th><th>笔数</th><th>金额' + showUnit + '</th></tr>';
                html += '<tr class="dfp-ele-table-tr0"><th>状态</th><th>笔数</th><th>金额' + showUnit + '</th></tr>';
                // 表格内行
                for (var o in _zhifu) {
                    var _onezhifu = _zhifu[o];
                    if (!_zhifu.hasOwnProperty(o)) continue;
                    var url = menu.url,
                        menu_name = menu.menu_name;
                    var children = _onezhifu.children_list;
                    // 取第一个待办状态的,并且count大于0的
                    if (children) {
                        var j = 0;
                        for (; j < children.length; j++) {
                            if ((children[j].show_right == '1' || children[j].show_right == null ) && children[j].count > 0)
                                break;
                        }
                        // 取第一个待办的
                        if (j == children.length) {
                            j = 0;
                            for (; j < children.length; j++) {
                                if (children[j].show_right == '1' || children[j].show_right == null)
                                    break;
                            }
                        }
                        if (j == children.length) {
                            j = 0;
                        }
                        url += '&activetabcode=' + (children[j]).bill_node_code + '&tokenid=' + getTokenId();
                    }
                    var money = !unit || unit == 1 ? (_onezhifu['money'] / 1e4).toFixed(2) : (unit == 0 ? _onezhifu['money'] : (unit == 2 ? (_onezhifu['money'] / 1e8).toFixed(2) : (_onezhifu['money'] / 1e4).toFixed(2)));
                    html += '<tr class="dfpElementTr" onclick="window.parent.addTabToParent(&quot;' + menu_name + '&quot;,&quot;' + url + '&quot;);">';
                    html += '<td>' + _onezhifu['name'] + '</td>' +
                        '<td class="dfpElementTdNum"><span>' + dfp.num2ThousandBreakNoDigit(_onezhifu['count']) + '笔</span></td>' +
                        '<td class="dfpElementTdNum"><span>' + dfp.num2ThousandBreak(money) + '</span></td>' +
                        '</tr>';
                }

                // TODO 测试数据
//				html += '<tr onclick="javascript:window.parent.addTabToParent(&quot;1&quot;,&quot;http://www.baidu.com&quot;);"><td>183</td><td>John Doe</td><td><span>1,234,567,890</span></td></tr>';
//				html += '<tr><td>183</td><td>John Doe</td><td><span>1,234,567,890</span></td></tr>';

                html += '</tbody></table></div></div></div>';
            },
            error: function () {
                dfpEle.console("-- error - ajax - dfpEle.ajax.Fundmonitor");
                return '';
            }
        });
        return html;
    },
    /**
     * 表格行样式
     * @params id tab标签内容div.id
     */
    trStyle: function (id) {
        $("#" + id).find("div").each(function (j) {
            $(this).find("div").find("table").find("tbody").find("tr").each(function (i) {
                var $this = $(this);
                // 表头设置
                $this.css({"text-align": "center", "height": "100%", "line-height": "27px"});
                if (i == 0)
                    $this.css({"background": "#e9e9e9", "cursor": "default"});
                else {
                    var bgcolor = i % 2 == 0 ? "rgb(233, 233, 233)" : "#FFFFFF"; // 奇偶行不同色
                    $this.css("background-color", bgcolor).find("td").css("cursor", "pointer");
                    $this.find("td:eq(1)").css({"color": "#000", "float": "right"}); // 笔数 #0000FF
                    $this.find("td:eq(2)").css({"color": "#F56A00", "font-weight": "bold"}); // 金额
                    $this.find("td:eq(2)").find("span").css({"float": "right", "margin-right": "10px"});
                    $this.on("mouseover", function () {
                        $this.css({"background-color": "#108EE9", "color": "#FFF", "text-decoration": "underline"});
                        $this.find("td:eq(1)").css("color", "#FFFFFF");
                        $this.find("td:eq(2)").css("color", "#FFFFFF");
                    }).on("mouseleave", function () {
                        $this.css({"background-color": bgcolor, "color": "#000", "text-decoration": "none"});
                        $this.find("td:eq(1)").css("color", "#000"); // 笔数 #0000FF
                        $this.find("td:eq(2)").css("color", "#F56A00");
                    });
                }
            });
        });

    }

};


// TODO 暂停开发，转到 dfpGrid.js
/**
 * 基于 u.js 绘制 grid
 */
dfpEle.uGrid = {
    /**
     * grid 主体
     * @params o 对象，[{}, [{}, {}, ...]]
     */
    html: function (o) {
        var o1 = o[0], // 主体div
            o2 = o[1]; // 内部div
        // 外部div
        var outerHtml = function () {
            var divId = o1['id'] || '',
                uId = o1['uId'] || 'gridShow',
                data = o1['data'] || 'dataTable',
                type = o1['type'] || 'grid',
                height = o1['height'] || 'auto',
                rowHeight = o1['rowHeight'] || '30',
                headerHeight = o1['headerHeight'] || '36',
                columnMenu = o1['columnMenu'] || 'false',
                needLocalStorage = o1['needLocalStorage'] || 'false',
                onDblClickFun = o1['onDblClickFun'] || '';
            return "<div id='" + divId + "' u-meta='" +  // '"aa":"' + aa + '",' +
                '{"id":"' + uId + '",' +
                '"data":"' + data + '",' +
                '"type":"' + type + '",' +
                '"height":"' + height + '",' +
                '"rowHeight":"' + rowHeight + '",' +
                '"headerHeight":"' + headerHeight + '",' +
                '"columnMenu":"' + columnMenu + '",' +
                '"needLocalStorage":"' + needLocalStorage + '",' +
                '"onDblClickFun":"' + onDblClickFun + "}'>";
        };
        // 内部html
        var innerHtml = function () {
            var html = '';
            for (var o in o2) {
                if (!o2.hasOwnProperty(o)) continue;
                var field = o['field'] || '',
                    width = o['width'] || 'auto',
                    dataType = o['dataType'] || 'String',
                    title = o['title'] || '标题',
                    visible = o['visible'] || 'true',
                    renderType = o['renderType'] || '';
                html += "<div options='{" +
                    '"field":' + field + '",' +
                    '"width":"' + width + '",' +
                    '"dataType":"' + dataType + '",' +
                    '"title":"' + title + '",' +
                    '"visible":"' + visible + '",' +
                    '"renderType":"' + renderType + "}'></div>";
            }
            return html;
        };
        return outerHtml() + innerHtml() + '</div>';
    }

};

