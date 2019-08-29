define(['jquery', 'knockout', 'bootstrap', 'uui', 'tree', 'grid', 'ip'],
    function ($, ko) {
        window.ko = ko;

        var ELEMENTSET_LIST_URL = "/df/dictionary/elementset/list.do",
            ELEVALUES_LIST_URL = "/df/dictionary/elevalues/list.do";

        var eleSet = null,   //元素列表
            eleValues = new Array();  //元素值集列表

        //根据元素code得到元素名称
        function getEleNameByCode(eleCode) {
            if (!eleSet) {
                refreshEleSet();
            }
            return (function () {
                for (var i = 0; i < eleSet.length; i++) {
                    if (eleSet[i].ele_code == eleCode) {
                        return eleSet[i].ele_name;
                    }
                }
            })();
        }

        //获取元素列表
        function getEleSetList() {
            if (!eleSet) {
                refreshEleSet();
            }
            return eleSet;
        }

        //刷新元素列表
        function refreshEleSet() {
            $.ajax({
                type: 'GET',
                data: {'tokenid': ip.getTokenId()},
                url: ELEMENTSET_LIST_URL,
                dataType: 'json',
                async: false,
                success: function (result) {
                    if (result.errorCode == 0) {
                        if (result.data) {
                            eleSet = result.data;
                        }
                    } else {
                        //u.showMessage({msg: "查询数据出错，服务器返回 errorCode:" + result.errorCode, position: "center", msgType: "error"});
                        ip.ipInfoJump("查询数据出错，服务器返回 errorCode:" + result.errorCode, "error");
                    }
                },
                error: commonAjaxError
            });
        }

        //获取元素值集
        function getEleValues(eleCode) {
            if (eleCode) {
                if (!(eleCode in eleValues)) {
                    refreshEleValues(eleCode);
                }
                return eleValues[eleCode];
            }
        }

        //刷新元素值集
        function refreshEleValues(eleCode) {
            if (eleCode) {
                $.ajax({
                    type: 'GET',
                    data: {
                        'tokenid': ip.getTokenId(),
                        'ele_code': eleCode
                    },
                    url: ELEVALUES_LIST_URL,
                    dataType: 'json',
                    async: false,
                    success: function (result) {
                        if (result.errorCode == 0) {
                            if (result.data) {
                                eleValues[eleCode] = result.data;
                            }
                        } else {
                            //u.showMessage({msg: "查询数据出错，服务器返回 errorCode:" + result.errorCode, position: "center", msgType: "error"});
                            ip.ipInfoJump("查询数据出错，服务器返回 errorCode:" + result.errorCode, "error");
                        }
                    },
                    error: commonAjaxError
                });
            }
        }

        //通用Ajax错误处理函数
        function commonAjaxError(jqXHR, textStatus, errorThrown) {
            var msg = textStatus + errorThrown + ":" + (jqXHR.responseJSON ? jqXHR.responseJSON.msg : "");
            if (jqXHR.responseText && jqXHR.responseText.indexOf("用户会话已经失效") > -1) {
                msg = "登录验证已过有效期,请重新登录！";
            }
            //u.showMessage({msg: msg, position: "center", msgType: "error"});
            ip.ipInfoJump(msg, "error");
        };

        //生成guid
        function guid() {
            var s4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };

            return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
        }

        //格式化金额，返回带人民币符号和千分位的金额格式
        function formatCurrency(num, destination, settings) {

            function generateRegex(settings__i) {
                if (settings__i.symbol === '') {
                    return new RegExp("[^\\d" + settings__i.decimalSymbol + "-]", "g");
                }
                else {
                    var symbol = settings__i.symbol.replace('$', '\\$').replace('.', '\\.');
                    return new RegExp(symbol + "|[^\\d" + settings__i.decimalSymbol + "-]", "g");
                }
            };

            function getRegionOrCulture(region) {
                var regionInfo = $.formatCurrency.regions[region];
                if (regionInfo) {
                    return regionInfo;
                }
                else {
                    if (/(\w+)-(\w+)/g.test(region)) {
                        var culture = region.replace(/(\w+)-(\w+)/g, "$1");
                        return $.formatCurrency.regions[culture];
                    }
                }
                // fallback to extend(null) (i.e. nothing)
                return null;
            }

            // initialize defaults
            var defaults = {
                name: "formatCurrency",
                colorize: false,
                region: '',
                global: true,
                roundToDecimalPlace: 2, // roundToDecimalPlace: -1; for no rounding; 0 to round to the dollar; 1 for one digit cents; 2 for two digit cents; 3 for three digit cents; ...
                eventOnDecimalsEntered: false,

                symbol: '￥',
                positiveFormat: '%s%n',
                negativeFormat: '-%s%n',
                decimalSymbol: '.',
                digitGroupSymbol: ',',
                groupDigits: true

            };
            // override defaults with settings passed in
            var settings = $.extend(defaults, settings);

            // check for region setting
            if (settings.region.length > 0) {
                settings = $.extend(settings, getRegionOrCulture(settings.region));
            }
            settings.regex = generateRegex(settings);

            //identify '(123)' as a negative number
            if (num.search('\\(') >= 0) {
                num = '-' + num;
            }

            if (num === '' || (num === '-' && settings.roundToDecimalPlace === -1)) {
                return;
            }

            // if the number is valid use it, otherwise clean it
            if (isNaN(num)) {
                // clean number
                num = num.replace(settings.regex, '');

                if (num === '' || (num === '-' && settings.roundToDecimalPlace === -1)) {
                    return;
                }

                if (settings.decimalSymbol != '.') {
                    num = num.replace(settings.decimalSymbol, '.');  // reset to US decimal for arithmetic
                }
                if (isNaN(num)) {
                    num = '0';
                }
            }

            // evalutate number input
            var numParts = String(num).split('.');
            var isPositive = (num == Math.abs(num));
            var hasDecimals = (numParts.length > 1);
            var decimals = (hasDecimals ? numParts[1].toString() : '0');
            var originalDecimals = decimals;

            // format number
            num = Math.abs(numParts[0]);
            num = isNaN(num) ? 0 : num;
            if (settings.roundToDecimalPlace >= 0) {
                decimals = parseFloat('1.' + decimals); // prepend "0."; (IE does NOT round 0.50.toFixed(0) up, but (1+0.50).toFixed(0)-1
                decimals = decimals.toFixed(settings.roundToDecimalPlace); // round
                if (decimals.substring(0, 1) == '2') {
                    num = Number(num) + 1;
                }
                decimals = decimals.substring(2); // remove "0."
            }
            num = String(num);

            if (settings.groupDigits) {
                for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
                    num = num.substring(0, num.length - (4 * i + 3)) + settings.digitGroupSymbol + num.substring(num.length - (4 * i + 3));
                }
            }

            if ((hasDecimals && settings.roundToDecimalPlace == -1) || settings.roundToDecimalPlace > 0) {
                num += settings.decimalSymbol + decimals;
            }

            // format symbol/negative
            var format = isPositive ? settings.positiveFormat : settings.negativeFormat;
            var money = format.replace(/%s/g, settings.symbol);
            money = money.replace(/%n/g, num);

            return money;
        };

        //返回树结点的字体样式，用于树查找时突出显示匹配结点
        function getTreeFontCss(treeId, treeNode) {
            return (!!treeNode.highLight) ? {"color": "red", "font-weight": "bold"} : {
                "color": "black",
                "font-weight": "normal"
            };
        }

        //查找树结点，匹配结点突出显示
        function findTreeNode_old(treeObj, value, key) {
            var rsltNodes = new Array();
            var parentNode;
            if (treeObj) {
                var allNodes = treeObj.transformToArray(treeObj.getNodes());
                if (value) {
                    rsltNodes = treeObj.getNodesByParamFuzzy(key ? key : 'name', value);
                    treeObj.setting.view.fontCss = getTreeFontCss;
                } else {
                    treeObj.setting.view.fontCss = null;
                }
                for (var i = 0; i < allNodes.length; i++) {
                    if (rsltNodes.indexOf(allNodes[i]) > -1) {
                        allNodes[i].highLight = true;
                        parentNode = allNodes[i].getParentNode();
                        while (parentNode) {
                            treeObj.expandNode(parentNode, true, false, false);
                            parentNode = parentNode.getParentNode();
                        }
                    } else {
                        allNodes[i].highLight = false;
                    }
                    treeObj.updateNode(allNodes[i]);
                }

            }
            return rsltNodes;
        }

        var searchIndex = 0;

        function findTreeNode(treeObj, value, key) {
            var rsltNodes = new Array();
            var parentNode;
            if (treeObj) {
                rsltNodes = treeObj.getNodesByParamFuzzy(key ? key : 'name', value);
                if (searchIndex < rsltNodes.length) {
                    treeObj.selectNode(rsltNodes[searchIndex++]);
                } else {
                    searchIndex = 0;
                    ip.ipInfoJump("最后一个");
                }
            }
            return rsltNodes;
        }

        // 字符串左侧填充字符至指定长度
        function padding(str, len, chr) {
            return Array(
                    len > str.toString().length ? (len
                    - str.toString().length + 1) : 0).join(chr)
                + str;
        }

        // 根据字段值查找指定行，不区分大小写
        function getRowByFieldCaseInsensitive(dt, field, value, includeDel) {
            if (includeDel == null || typeof includeDel == "undefined") {
                includeDel = false;
            }
            var rows = dt.rows.peek();
            for (var i = 0, count = rows.length; i < count; i++) {
                if (rows[i].getValue(field).toUpperCase() === (value ? value
                        .toUpperCase()
                        : "")
                    && (rows[i].status != Row.STATUS.FALSE_DELETE || includeDel)) {
                    return rows[i];
                }
            }
            return null;
        }

        //将数组元素添加到监控数组中
        function koArrayConcat(koArray, array) {
            if (koArray && array) {
                for (var i = 0; i < array.length; i++) {
                    koArray.push(array[i]);
                }
            }
        }

        // 重建显示data数据的表格
        function rebuildUGridByData(data, gridContainer, gridId) {
            var sqlVM = {
                sqlDT: new u.DataTable({
                    meta: {}
                })
            };

            var innerHTML = '<div u-meta=\'{"id":"' + gridId + '","data":"sqlDT","type":"grid", "columnMenu":false,"headerHeight":32,"rowHeight":32}\'>';
            if (data.length > 0) {
                var propertys = Object.keys(data[0])
                for (var i = 0; i < propertys.length; i++) {
                    innerHTML += '<div options=\'{"field":"'
                        + propertys[i]
                        + '","editType":"string","dataType":"String","title":"'
                        + propertys[i] + '", "width":100}\'></div>';
                }
            }
            innerHTML += "</div>";
            ko.cleanNode($(gridContainer)[0]);
            $(gridContainer).html(innerHTML);
            var app = u.createApp({
                el: gridContainer,
                model: sqlVM
            });
            sqlVM.sqlDT.setSimpleData(data);
        };

        // null和undefined替换为指定字条串
        function nvl(val, str) {
            if (val == null || val == undefined) {
                return str || "";
            } else {
                return val;
            }
        }

        /**
         * 分离出dataTable中需要保存的数据
         *
         * @param dt
         *            dataTable或Row对象
         * @param key
         *            主键属性名，多个用逗号分隔
         * @param excludes
         *            要排除的字段，多个用逗号分隔
         * @return {insert:[{data:{}},{...}],
			 *         update:[{data:{},key:{}},{...}], delete:[{key:{}},{...}]
			 */
        function dt2PersistObj(dt, keys, excludes, ver, rg, year) {
            keys = (keys || "").toLowerCase().split(",").map(function (v) {
                return v.trim()
            });
            excludes = (excludes || "").toLowerCase().split(",").map(function (v) {
                return v.trim()
            });
            var rslt = {
                "insert": [],
                "update": [],
                "delete": []
            };
            var datas = [];
            if (dt instanceof DataTable) {
                datas = dt.getChangedRows();
            } else if (dt instanceof Row) {
                datas = [dt];
            }

            for (var i = 0; i < datas.length; i++) {
                if (datas[i].status != Row.STATUS.NORMAL) {
                    //此处过滤掉删除状态的行，否则会导致fdel状态变为upd状态，保存时就不正确。iuap的bug。
                    if (datas[i].status != Row.STATUS.FALSE_DELETE) {
                        if (ver) {
                            datas[i].setValue(ver.name, ver.value);
                        }
                        if (rg) {
                            datas[i].setValue(rg.name, rg.value);
                        }
                        if (year) {
                            datas[i].setValue(year.name, year.value);
                        }
                    }
                    var propertys = Object.keys(datas[i].data);
                    var data = {}, key = {};
                    for (var j = 0; j < propertys.length; j++) {
                        if (excludes.indexOf(propertys[j].toLowerCase()) < 0) {
                            if (datas[i].status == Row.STATUS.NEW) {
                                data[propertys[j]] = nvl(datas[i].data[propertys[j]].value);
                            } else {
                                if (datas[i].status == Row.STATUS.UPDATE) {
                                    if (datas[i].data[propertys[j]].changed) {
                                        data[propertys[j]] = nvl(datas[i].data[propertys[j]].value);
                                    }
                                }
                                if (keys.indexOf(propertys[j].toLowerCase()) >= 0) {
                                    key[propertys[j]] = nvl(datas[i].data[propertys[j]].baseValue);
                                }
                            }
                        }
                    }
                    if (datas[i].status == Row.STATUS.NEW) {
                        rslt.insert.push({"data": data});
                    } else if (datas[i].status == Row.STATUS.UPDATE) {
                        rslt.update.push({"data": data, "key": key});
                    } else if (datas[i].status == Row.STATUS.FALSE_DELETE) {
                        rslt.delete.push({"data": data, "key": key});
                    }
                }
            }
            return rslt;
        }

        //格式化日期
        function dateFormat(date, fmt) {
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        }

        // 重建显示data数据的树
        function rebuildTreeByData(data, treeContainer, treeId, idField, pidField, nameField, hasSearch, rootLabel) {
            var sqlVM = {
                sqlDT: new u.DataTable({
                    meta: {}
                }),
                treeKeyword: ko.observable(""),
                findTree: function (treeId) {
                    findTreeNode($.fn.zTree.getZTreeObj(treeId), sqlVM.treeKeyword());
                },
                //列表树配置
                treeSetting: {
                    view: {
                        showLine: true,
                        selectedMulti: false
                    }
                }
            };

            var innerHTML = ""
            if (hasSearch) {  //<!-- 树搜索框 -->
                innerHTML = innerHTML
                    + ' <div class="tree-search-panel"> '
                    + '     <div class="input-group"> '
                    + '         <input type="text" class="form-control" placeholder="请输入关键词" data-bind="value: treeKeyword"> '
                    + '         <span class="input-group-btn"> '
                    + '             <button class="btn tree-search-btn" type="button" data-bind="click: findTree.bind(null, \'' + treeId + '\')"> '
                    + '                 <span class="glyphicon glyphicon-search" aria-hidden="true"></span> '
                    + '             </button> '
                    + '         </span> '
                    + '     </div> '
                    + ' </div> '
            }
            innerHTML = innerHTML + ' <div class="tree-scroll">';

            if (rootLabel) { //<!-- 虚拟根结点 -->
                innerHTML = innerHTML
                    + ' <div class="tree-root-div">'
                    + '     <div class="tree-root-icon"></div>'
                    + '     <span class="tree-root-label" >' + rootLabel + '</span>'
                    + '</div>'
            }
            innerHTML = innerHTML
                + ' <div id="leftTree" class="ztree" '
                + ' u-meta=\'{"id":"' + treeId + '","data":"sqlDT","type":"tree","idField":"' + idField + '","pidField":"' + pidField + '","nameField":"' + nameField + '","setting":"treeSetting"}\' >'
                + ' </div>'
                + ' </div>'  //tree-scroll

            ko.cleanNode($(treeContainer)[0]);
            $(treeContainer).html(innerHTML);
            var app = u.createApp({
                el: treeContainer,
                model: sqlVM
            });
            sqlVM.sqlDT.setSimpleData(data);
        };

        //将对象数组中的属性转化为小写，不支持嵌套
        function propertyToLowerCase(data) {
            if (data && data instanceof Array) {
                var result = new Array(data.length);
                for (var i = 0; i < data.length; i++) {
                    var propertys = Object.keys(data[i]);
                    result[i] = {};
                    for (var j = 0; j < propertys.length; j++) {
                        result[i][propertys[j].toLowerCase()] = data[i][propertys[j]];
                    }
                }
                return result;
            }
        }

        //初始化
        function init() {
        };

        init();

        return {
            'init': init,
            'getEleNameByCode': getEleNameByCode,
            'getEleSetList': getEleSetList,
            'getEleValues': getEleValues,
            'commonAjaxError': commonAjaxError,
            'guid': guid,
            'formatCurrency': formatCurrency,
            'findTreeNode': findTreeNode,
            'padding': padding,
            'getRowByFieldCaseInsensitive': getRowByFieldCaseInsensitive,
            'koArrayConcat': koArrayConcat,
            'rebuildUGridByData': rebuildUGridByData,
            'nvl': nvl,
            'dt2PersistObj': dt2PersistObj,
            'dateFormat': dateFormat,
            'rebuildTreeByData': rebuildTreeByData,
            'propertyToLowerCase': propertyToLowerCase
        };
    }
)
;
