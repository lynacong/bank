/** 
 * neoui-kero v3.2.4
 * neoui kero
 * author : [object Object]
 * homepage : https://github.com/iuap-design/neoui-kero#readme
 * bugs : https://github.com/iuap-design/neoui-kero/issues
 **/ 
/**
 * tinper-neoui-grid v3.2.4
 * grid
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/tinper-neoui-grid#readme
 * bugs : https://github.com/iuap-design/tinper-neoui-grid/issues
 */

(function () {
'use strict';

/*
 * 澶勭悊鍙傛暟
 */
var init = function init(options, gridComp) {
    this.defaults = {};
    this.gridComp = gridComp;
    this.options = $.extend({}, this.defaults, options);
    this.rows = new Array(); // 瀛樺偍鏁版嵁琛�
    this.hasParentRows = new Array(); // 瀛樺湪鐖堕」
    this.nothasParentRows = new Array(); // 涓嶅瓨鍦ㄧ埗椤�
};
/*
 * 灏唙alues杞寲涓簉ows骞惰繘琛屾帓搴�
 */
var sortRows = function sortRows(field, sortType) {
    var self = this;
    if (typeof this.gridComp.options.filterDataFun == 'function') {
        this.options.values = this.gridComp.options.filterDataFun.call(this, this.options.values);
    }
    if (this.gridComp.options.showTree) {
        this.treeSortRows(field, sortType);
    } else {
        this.basicSortRows(field, sortType);
    }
    this.gridComp.eidtRowIndex = -1;
    if (self.gridComp && self.gridComp.selectRows && self.gridComp.selectRows.length > 0) {
        $.each(this.rows, function () {
            var row = this;
            $.each(self.gridComp.selectRows, function () {
                var selectRow = this;
                if (row.value['$_#_@_id'] == selectRow['$_#_@_id']) row.checked = true;
            });
        });
    }
};
/*
 * 灏唙alues杞寲涓簉ows骞惰繘琛屾帓搴�(鏍囧噯)
 */
var basicSortRows = function basicSortRows(field, sortType) {
    var oThis = this,
        dataType = "";
    if (field) {
        dataType = this.gridComp.getColumnByField(field).options.dataType;
    }
    this.rows = new Array();
    this.groupRows = new Array();
    if (this.options.values) {
        $.each(this.options.values, function (i) {
            var rowObj = {};
            rowObj.value = this;
            rowObj.valueIndex = i;
            oThis.rows.push(rowObj);
            oThis.gridComp.getGroupIndex(this, i, rowObj);
            oThis.rows = oThis.getGroupRows();
        });
    }
};
var treeSortRows = function treeSortRows(field, sortType) {
    this.basicSortRows(field, sortType);
};
/*
 * 鑾峰彇鍚堣鍊�
 */
var getSumValue = function getSumValue(field, gridCompColumn, gridComp) {
    var sumValue = null;
    if (gridCompColumn.options.sumCol) {
        $.each(this.rows, function (i) {
            var v = $(this.value).attr(field);
            if (gridCompColumn.options.dataType == 'Int') {
                v = gridComp.getInt(v, 0);
                sumValue += parseInt(v);
            } else {
                v = gridComp.getFloat(v, 0);
                sumValue = gridComp.accAdd(sumValue, parseFloat(v));
            }
        });
    }
    // 澶勭悊绮惧害
    if (gridCompColumn.options.dataType == 'Float' && gridCompColumn.options.precision) {
        var o = {};
        o.value = sumValue;
        o.precision = gridCompColumn.options.precision;
        sumValue = gridComp.DicimalFormater(o);
    }
    if (sumValue != null && sumValue != undefined && sumValue != 'null' && sumValue != 'undefined') {
        return sumValue + '';
    } else {
        return '';
    }
};

var getGroupSumValue = function getGroupSumValue(field, gridCompColumn, groupRow) {
    var sumValue = null;
    var gridComp = this.gridComp;
    if (gridCompColumn.options.sumCol) {
        $.each(groupRow.rows, function (i) {
            var v = $(this.value).attr(field);
            if (gridCompColumn.options.dataType == 'Int') {
                v = gridComp.getInt(v, 0);
                sumValue += parseInt(v);
            } else {
                v = gridComp.getFloat(v, 0);
                sumValue = gridComp.accAdd(sumValue, parseFloat(v));
            }
        });
    }
    // 澶勭悊绮惧害
    if (gridCompColumn.options.dataType == 'Float' && gridCompColumn.options.precision) {
        var o = {};
        o.value = sumValue;
        o.precision = gridCompColumn.options.precision;
        sumValue = gridComp.DicimalFormater(o);
    }
    if (sumValue != null && sumValue != undefined && sumValue != 'null' && sumValue != 'undefined') {
        return sumValue + '';
    } else {
        return '';
    }
};

var addOneRowGroup = function addOneRowGroup(rowObj) {
    var groupField = this.gridComp.options.groupField,
        hasGroupFlag = false;
    if (groupField) {
        var groupValue = this.gridComp.getString($(rowObj.value).attr(groupField), '');
        if (!this.groupRows) this.groupRows = new Array();
        //[{value:1,length,rows:[{},{}]},{value:2,rows:[{},{}},{value:3,rows:[{},{}}]
        $.each(this.groupRows, function (i) {
            var nowGroup = this;
            if (nowGroup.value == groupValue) {
                hasGroupFlag = true;
                nowGroup.length = parseInt(nowGroup.length) + 1;
                nowGroup.rows.push(rowObj);
            }
        });
        if (!hasGroupFlag) {
            var newGroupRow = {
                value: groupValue,
                length: 1,
                rows: [rowObj]
            };
            this.groupRows.push(newGroupRow);
        }
    }
};

var getGroupRows = function getGroupRows() {
    var groupField = this.gridComp.options.groupField,
        rows = [];
    if (groupField) {
        if (this.groupRows && this.groupRows.length > 0) {
            $.each(this.groupRows, function () {
                $.each(this.rows, function () {
                    rows.push(this);
                });
            });
        }
    } else {
        rows = this.rows;
    }
    return rows;
};
var initFunObj = {
    init: init,
    sortRows: sortRows,
    basicSortRows: basicSortRows,
    treeSortRows: treeSortRows,
    getSumValue: getSumValue,
    getGroupSumValue: getGroupSumValue,
    addOneRowGroup: addOneRowGroup,
    getGroupRows: getGroupRows
};

var sort_initEventFun = function sort_initEventFun() {
    // 鎵╁睍鏂规硶
    var oThis = this;
    $('#' + this.options.id).on('mouseup', function (e) {
        if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
            // 鐐瑰嚮鐨勬槸header鍖哄煙
            oThis.mouseUpX = e.clientX;
            oThis.mouseUpY = e.clientY;
            //鐐瑰嚮杩囩▼涓紶鏍囨病鏈夌Щ鍔�
            if (oThis.mouseDownX == oThis.mouseUpX && oThis.mouseDownY == oThis.mouseUpY) {
                //鎴栬€呯Щ鍔ㄨ窛绂诲皬浜�5px(鐢变簬绉诲姩涔嬪悗浼氭樉绀哄睆骞昫iv锛屾殏鏃朵笉鍋氬鐞�)
                oThis.columnClickX = e.clientX;
                oThis.columnClickY = e.clientY;
                var eleTh = $(e.target).closest('th')[0];
                if ($(e.target).hasClass('u-grid-header-columnmenu')) {} else {
                    // 鎵цclick鎿嶄綔,杩涜鎺掑簭
                    oThis.canSortable(e, eleTh);
                }
            }
        } else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
            // 鐐瑰嚮鐨勬槸鏁版嵁鍖哄煙

        }
    });
};
var sort_initGridEventFun = function sort_initGridEventFun() {
    // 鎵╁睍鏂规硶
    var oThis = this;
};
/*
 * 澶勭悊鎺掑簭
 */
var canSortable = function canSortable(e, ele) {
    var oThis = this,
        $ele = $(ele),
        field = $ele.attr('field'),
        sortable = this.getColumnAttr('sortable', field);
    if (sortable) {
        if (e.ctrlKey) {
            // 鏋勫缓鎺掑簭淇℃伅鐨勬暟鎹粨鏋�
            var prioArray = [];
            $('.u-grid-header-sort-priority').each(function (index, domEle) {
                var $el = $(domEle);
                var p = parseInt($el.text());
                var f = $el.closest('th').attr('field');
                var st;
                if ($el.parent().hasClass("uf-arrow-down")) {
                    st = 'asc';
                } else if ($el.parent().hasClass("uf-arrow-up")) {
                    st = 'desc';
                }
                prioArray[p - 1] = {
                    field: f,
                    sortType: st
                };
            });
            // 椤甸潰璋冩暣
            /*淇敼ue灏哻aret璋冩暣涓篶aret*/
            var $caret;
            if (($caret = $ele.find('.uf-arrow-down')).length > 0) {
                var p = parseInt($caret.find('.u-grid-header-sort-priority').text());
                prioArray[p - 1].sortType = 'desc';
                $caret.removeClass('uf-arrow-down').addClass('uf-arrow-up');
            } else if (($caret = $ele.find('.uf-arrow-up')).length > 0) {
                var p = parseInt($caret.find('.u-grid-header-sort-priority').text());
                for (var i = p; i < prioArray.length; i++) {
                    var $flag = $('[field=' + prioArray[i].field + ']').find('.u-grid-header-sort-priority');
                    $flag.text(parseInt($flag.text()) - 1);
                }
                prioArray.splice(p - 1, 1);
                $caret.remove();
            } else {
                prioArray.push({
                    field: field,
                    sortType: 'asc'
                });
                // $ele.first().append('<span class="uf uf-arrow-down u-grid-header-sort-span" ><span class="u-grid-header-sort-priority">'+prioArray.length+'</span></span>')
                $ele.first().first().append('<span class="uf uf-arrow-down u-grid-header-sort-span" ></span>');
            }
            // 鎵ц鎺掑簭閫昏緫
            this.dataSourceObj.sortRowsByPrio(prioArray);
        } else {
            if ($(".uf-arrow-down").parent().parent().parent()[0] == ele) {
                //鍘熸潵涓哄崌搴忥紝鏈涓洪檷搴�
                $(".uf-arrow-down").remove();
                //$(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="uf uf-arrow-up u-grid-header-sort-span" ><span class="u-grid-header-sort-priority">1</span></span>');
                $(ele.firstChild.firstChild)[0].insertAdjacentHTML('beforeEnd', '<span class="uf uf-arrow-up u-grid-header-sort-span" ></span>');
                if (typeof this.options.onSortFun == 'function') {
                    this.options.onSortFun.call(this, field, 'asc');
                } else {
                    this.dataSourceObj.sortRows(field, "asc");
                }
            } else if ($(".uf-arrow-up").parent().parent().parent()[0] == ele) {
                //鍘熸潵涓洪檷搴忥紝鏈涓轰笉鎺掑簭
                $(".uf-arrow-up").remove();
                if (typeof this.options.onSortFun == 'function') {
                    this.options.onSortFun.call(this);
                } else {
                    this.dataSourceObj.sortRows();
                }
            } else {
                //鏈涓哄崌搴�
                $(".uf-arrow-down").remove();
                $(".uf-arrow-up").remove();
                // $(ele.firstChild)[0].insertAdjacentHTML('beforeEnd','<span class="uf uf-arrow-down u-grid-header-sort-span"><span class="u-grid-header-sort-priority">1</span></span>');
                $(ele.firstChild.firstChild)[0].insertAdjacentHTML('beforeEnd', '<span class="uf uf-arrow-down u-grid-header-sort-span"></span>');
                if (typeof this.options.onSortFun == 'function') {
                    this.options.onSortFun.call(this, field, "desc");
                } else {
                    this.dataSourceObj.sortRows(field, "desc");
                }
            }
        }

        oThis.repairContent();
        oThis.afterGridDivsCreate();
    }
};
var re_deleteOneRowTree = function re_deleteOneRowTree() {
    if (this.options.showTree) {
        this.dataSourceObj.sortRows();
    }
};
/*
 * 鏍规嵁鎺掑簭鐨勪紭鍏堢骇鐨勬帓搴�
 * prioArray = [{field:'f2', sortType:'asc'}, {field:'f3', sortType:'desc'}, {field:'f1', sortType:'asc'}]
 */
var sortRowsByPrio = function sortRowsByPrio(prioArray, cancelSort) {
    var oThis = this;
    if (cancelSort) {
        this.rows = new Array();
        if (this.options.values) {
            $.each(this.options.values, function (i) {
                var rowObj = {};
                rowObj.value = this;
                rowObj.valueIndex = i;
                oThis.rows.push(rowObj);
            });
        }
    }

    var evalStr = function evalStr(i) {
        if (i == prioArray.length - 1) {
            return 'by(prioArray[' + i + '].field, prioArray[' + i + '].sortType)';
        } else {
            return 'by(prioArray[' + i + '].field, prioArray[' + i + '].sortType,' + evalStr(i + 1) + ')';
        }
    };

    var by = function by(field, sortType, eqCall) {
        var callee = arguments.callee;
        return function (a, b) {
            var v1 = $(a.value).attr(field);
            var v2 = $(b.value).attr(field);
            var dataType = oThis.gridComp.getColumnByField(field).options.dataType;
            if (dataType == 'Float') {
                v1 = parseFloat(v1);
                v2 = parseFloat(v2);
                if (isNaN(v1)) {
                    return 1;
                }
                if (isNaN(v2)) {
                    return -1;
                }
                if (v1 == v2 && eqCall) {
                    return eqCall();
                }
                return sortType == 'asc' ? v1 - v2 : v2 - v1;
            } else if (dataType == 'Int') {
                v1 = parseInt(v1);
                v2 = parseInt(v2);
                if (isNaN(v1)) {
                    return 1;
                }
                if (isNaN(v2)) {
                    return -1;
                }
                if (v1 == v2 && eqCall) {
                    return eqCall();
                }
                return sortType == 'asc' ? v1 - v2 : v2 - v1;
            } else {
                v1 = oThis.gridComp.getString(v1, '');
                v2 = oThis.gridComp.getString(v2, '');
                try {
                    var rsl = v1.localeCompare(v2);
                    if (rsl === 0 && eqCall) {
                        return eqCall();
                    }
                    if (rsl === 0) {
                        return 0;
                    }
                    return sortType == 'asc' ? rsl : -rsl;
                } catch (e) {
                    return 0;
                }
            }
        };
    };

    this.rows.sort(eval(evalStr(0)));
};

/*
 * 灏唙alues杞寲涓簉ows骞惰繘琛屾帓搴�(鏍囧噯)
 */
var re_basicSortRows = function re_basicSortRows(field, sortType) {
    var oThis = this,
        groupField = this.gridComp.options.groupField;
    var dataType = "";

    if (!field) {
        this.rows = new Array();
        this.groupRows = new Array();
        if (this.options.values) {
            $.each(this.options.values, function (i) {
                var rowObj = {};
                rowObj.value = this;
                rowObj.valueIndex = i;
                oThis.rows.push(rowObj);
                oThis.addOneRowGroup(rowObj);
                oThis.rows = oThis.getGroupRows();
            });
        }
        return;
    }
    if (groupField && field && groupField != field) {
        oThis.rows = [];
        $.each(this.groupRows, function () {
            var nowGroup = this;
            nowGroup.rows.sort(oThis.gridComp.SortByFun(field, sortType));
            oThis.rows = oThis.rows.concat(nowGroup.rows);
        });
    } else {
        this.rows.sort(this.gridComp.SortByFun(field, sortType));
    }
};
var sortFunObj = {
    sort_initEventFun: sort_initEventFun,
    sort_initGridEventFun: sort_initGridEventFun,
    re_basicSortRows: re_basicSortRows,
    canSortable: canSortable,
    deleteOneRowTree: re_deleteOneRowTree,
    sortRowsByPrio: sortRowsByPrio
};

var re_initTree = function re_initTree(options, gridOptions) {
    if (gridOptions.showTree) {
        options.sortable = false;
    }
    return options;
};
var re_initOptionsTree = function re_initOptionsTree() {
    if (this.options.showTree) {
        this.options.showNumCol = false;
    }
    if (this.options.treeAsync) {
        if (typeof this.options.onTreeExpandFun != 'function') {
            alert('treeAsync 涓簍rue蹇呴』瀹氫箟onTreeExpandFun');
        }
    }
};
var re_clickFunTree = function re_clickFunTree(e) {
    var oThis = this,
        $target = $(e.target),
        $td = $target.closest('td');

    if ($td.length > 0) {
        var $tr = $td.parent();
        var index = this.getTrIndex($tr);
        var row = oThis.dataSourceObj.rows[index];
        if (row) {
            var rowChildIndex = oThis.getChildRowIndex(row);
            if ($target.hasClass('uf-reduce-s-o') || $target.hasClass('uf-add-s-o')) {
                var minus = $td.find('.uf-reduce-s-o');
                var plus = $td.find('.uf-add-s-o');
                if (minus.length > 0) {
                    // 鍚堜笂 闇€瑕佸皢鎵€鏈夌殑閮藉悎涓�
                    minus.removeClass('uf-reduce-s-o').addClass('uf-add-s-o');
                    if (rowChildIndex.length > 0) {
                        var allChildRowIndex = oThis.getAllChildRowIndex(row);
                        $.each(allChildRowIndex, function () {
                            var $tr1 = $('tr[role="row"]:eq(' + parseInt(this) + ')', $tr.parent());
                            $tr1.css('display', 'none');
                            // 宸︿晶澶嶉€夊尯闅愯棌
                            $('#' + oThis.options.id + '_content_multiSelect >div:nth-child(' + (parseInt(this) + 1) + ')').css('display', 'none');
                            $('.uf-reduce-s-o', $tr1).removeClass('uf-reduce-s-o').addClass('uf-add-s-o');
                        });
                    }
                    if (this.options.editType == 'form') {
                        $('#' + this.options.id + '_multiSelect_edit').remove(null, true);
                        $('#' + this.options.id + '_numCol_edit').remove(null, true);
                        $('#' + this.options.id + '_edit_tr').remove(null, true);
                        $('#' + this.options.id + '_edit_tr1').remove(null, true);
                    }
                } else if (plus.length > 0) {
                    // 灞曞紑
                    if (this.options.treeAsync && row.value.isParent) {
                        var obj = {};
                        obj.row = row;
                        obj.gridObj = this;
                        var keyField = this.options.keyField;
                        var keyValue = this.getString(row.value[keyField], '');
                        obj.keyValue = keyValue;
                        this.options.onTreeExpandFun.call(this, obj);
                    }
                    plus.removeClass('uf-add-s-o').addClass('uf-reduce-s-o');
                    if (rowChildIndex.length > 0) {
                        $.each(rowChildIndex, function () {
                            var $tr1 = $('tr[role="row"]:eq(' + parseInt(this) + ')', $tr.parent());
                            $tr1.css('display', '');
                            var ss = $('#' + oThis.options.id + '_content_multiSelect >div:nth-child(' + (parseInt(this) + 1) + ')')[0];
                            $('#' + oThis.options.id + '_content_multiSelect >div:nth-child(' + (parseInt(this) + 1) + ')').css('display', '');
                        });
                    }
                }
                this.resetLeftHeight();
            }
        }
    }
};
var re_addOneRowTree = function re_addOneRowTree(row, index, rowObj) {
    var oThis = this,
        l = this.dataSourceObj.rows.length,
        displayFlag;
    // 瀛樺湪鏍戠粨鏋�
    if (this.options.showTree) {
        this.hasParent = false;
        this.hasChildF = false;
        var keyField = this.options.keyField;
        var parentKeyField = this.options.parentKeyField;
        var keyValue = this.getString($(row).attr(keyField), '');
        rowObj.keyValue = keyValue;
        var parentKeyValue = this.getString($(row).attr(parentKeyField), '');
        rowObj.parentKeyValue = parentKeyValue;
        var parentChildLength;
        /* 鍒ゆ柇鏄惁瀛樺湪鐖堕」/瀛愰」 */
        $.each(this.dataSourceObj.rows, function (i) {
            var value = this.value;
            var nowKeyValue = oThis.getString($(value).attr(keyField), '');
            var nowParentKeyValue = oThis.getString($(value).attr(parentKeyField), '');
            if (nowKeyValue == parentKeyValue) {
                /* 鍙栫埗椤圭殑index鍜岀埗椤圭殑瀛恑ndex*/
                oThis.hasParent = true;
                oThis.addRowParentIndex = i;
                parentChildLength = oThis.getAllChildRow(this).length;
                var parentLevel = this.level;
                rowObj.level = parentLevel + 1;
                // 鐢变簬涓嶆闇€瑕佽绠楁渶鍚庝竴涓瓙鑺傜偣锛屽悓鏃堕渶瑕佽绠楀瓙鑺傜偣鐨勫瓙鑺傜偣銆傛墍浠ョ幇鍦ㄦ坊鍔犲埌鐖惰妭鐐圭殑涓嬮潰涓€涓�
                index = oThis.addRowParentIndex + parentChildLength + 1;
                if (!oThis.options.needTreeSort) return false;
            }
            if (nowParentKeyValue == keyValue && keyValue != '') {
                oThis.hasChildF = true;
            }
            if (oThis.hasParent && oThis.hasChildF) return false;
        });
        if (!this.hasParent) {
            rowObj.level = 0;
            if (index != l) {
                // 濡傛灉娌℃湁鐖堕」鍒欐彃鍏ュ埌鏈€鍚庯紝鍥犱负index鏈夊彲鑳芥彃鍏ュ埌鍏朵粬鑺傜偣鐨勫瓙鑺傜偣涔嬩腑锛岃绠楀鏉�
                index = l;
            }
        }
        if (this.hasParent) {
            var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(oThis.addRowParentIndex);
            $pTr.removeClass('u-grid-content-leaf-row').addClass('u-grid-content-parent-row');

            var openDiv = $('.uf-add-s-o', $pTr);
            if (!(openDiv.length > 0)) {
                displayFlag = 'block';
            }
            if (parentChildLength > 0) {
                // 濡傛灉瀛樺湪鐖堕」骞朵笖鐖堕」瀛樺湪瀛愰」鍒欓渶瑕佸垽鏂埗椤规槸鍚﹀睍寮€
                // var openDiv = $('.uf-add-s-o', $pTr);
                // if (!(openDiv.length > 0)) {
                //     displayFlag = 'block';
                // }
            } else {
                // 濡傛灉瀛樺湪鐖堕」骞朵笖鐖堕」鍘熸潵娌℃湁瀛愰」鍒欓渶瑕佹坊鍔犲浘鏍�
                if (this.options.autoExpand) {
                    displayFlag = 'block';
                }

                var d = $("div:eq(0)", $pTr);
                var openDiv = $('.uf-add-s-o', $pTr);
                var closeDiv = $('.uf-reduce-s-o', $pTr);
                if (this.options.autoExpand) {
                    var spanHtml = '<span class="uf u-grid-content-tree-span uf-reduce-s-o"></span>';
                } else {
                    var spanHtml = '<span class="uf u-grid-content-tree-span uf-add-s-o"></span>';
                }
                if (d.length > 0 && openDiv.length == 0 && closeDiv.length == 0) {
                    d[0].insertAdjacentHTML('afterBegin', spanHtml);
                    var oldLeft = parseInt(d[0].style.left);
                    l = oldLeft - 16;
                    if (l > 0 || l == 0) {
                        d[0].style.left = l + "px";
                    }
                }
                if (openDiv.length > 0) {
                    openDiv.removeClass('uf-add-s-o').addClass('uf-reduce-s-o');
                }
            }
        }
    }

    return {
        index: index,
        displayFlag: displayFlag
    };
};
var re_addOneRowTreeHasChildF = function re_addOneRowTreeHasChildF(rowObj) {
    if (this.hasChildF) {
        //濡傛灉瀛樺湪瀛愰」鍒欓噸鏂版覆鏌撴暣涓尯鍩�
        this.dataSourceObj.sortRows();
        this.repairContent();
    } else {
        // 淇敼rowObj 鍜宲arent鐨勫彉閲�
        if (this.hasParent) {
            var parentRowObj = this.dataSourceObj.rows[this.addRowParentIndex];
            parentRowObj.hasChild = true;
            parentRowObj.childRow.push(rowObj);
            parentRowObj.childRowIndex.push(rowObj.valueIndex);
            rowObj.parentRow = parentRowObj;
            rowObj.parentRowIndex = this.addRowParentIndex;
        }
        rowObj.hasChild = false;
        rowObj.childRow = new Array();
        rowObj.childRowIndex = new Array();
    }
};
var re_updateValueAtTree = function re_updateValueAtTree(rowIndex, field, value, force) {
    var oThis = this;
    var keyField = this.options.keyField;
    var parentKeyField = this.options.parentKeyField;
    if (this.options.showTree && (field == keyField || field == parentKeyField)) {
        // 鐩墠宸茬粡涓嶉€傜敤grid婧愮敓鐨勭紪杈戣缃簡锛屽洜涓烘爲琛ㄦ椂鍏抽棴edit
        var hasParent = false;
        var hasChildF = false;

        $.each(this.dataSourceObj.rows, function (i) {
            var vv = this.value;
            var nowKeyValue = oThis.getString($(vv).attr(keyField), '');
            var nowParentKeyValue = oThis.getString($(vv).attr(parentKeyField), '');
            if (field == keyField && value == nowParentKeyValue) {
                //淇敼鐨勬槸keyfield锛屽垽鏂槸鍚﹀瓨鍦ㄥ瓙椤�
                hasChildF = true;
            }
            if (field == parentKeyField && value == nowKeyValue) {
                //淇敼鐨勬槸parentKeyField锛屽垽鏂槸鍚﹀瓨鍦ㄧ埗椤�
                hasParent = true;
            }
        });
        if (hasChildF || hasParent) {
            //鍒犻櫎褰撳墠琛屼箣鍚庨噸鏂版彃鍏ュ綋鍓嶈鐢盿ddonerow鏉ヨ繘琛屾爲缁撴瀯澶勭悊
            var rowValue = $(this.dataSourceObj.rows[rowIndex].value);
            this.deleteOneRow(rowIndex);
            this.addOneRow(rowValue[0]);
        }
    }
    if (this.options.showTree && (field == keyField || field == parentKeyField) && (hasChildF || hasParent)) {
        rowIndex = this.getRowIndexByValue(field, value);
    }
    return rowIndex;
};
/*
 * 鑾峰彇鏁版嵁琛屼笅鎵€鏈夊瓙鍏冪礌
 */
var getAllChildRow = function getAllChildRow(row) {
    // if(row.allChildRow && row.allChildRow.length > 0){
    // 	return row.allChildRow;
    // }
    row.allChildRow = new Array();
    this.getAllChildRowFun(row, row.allChildRow);
    return row.allChildRow;
};
var re_getChildRowIndex = function re_getChildRowIndex(row) {
    var result = [],
        oThis = this;
    //浼樺厛鍙朿hildRowIndex--鑳＄帴淇敼
    if (row.childRow && row.childRow.length > 0) {
        $.each(row.childRow, function () {
            var index = oThis.getRowIndexByValue(oThis.options.keyField, this.keyValue);
            result.push(index);
        });
    }
    return result;
};
/*
 * 鑾峰彇鏁版嵁琛屼笅鎵€鏈夊瓙鍏冪礌鐨刬ndex
 */
var getAllChildRowIndex = function getAllChildRowIndex(row) {
    // if(row.allChildRowIndex && row.allChildRowIndex.length > 0){
    // 	return row.allChildRowIndex;
    // }
    row.allChildRowIndex = new Array();
    this.getAllChildRowIndexFun(row, row.allChildRowIndex);
    return row.allChildRowIndex;
};
var getAllChildRowFun = function getAllChildRowFun(row, rowArry) {
    var oThis = this;
    if (row.childRow.length > 0) {
        Array.prototype.push.apply(rowArry, row.childRow);
        $.each(row.childRow, function () {
            oThis.getAllChildRowFun(this, rowArry);
        });
    }
};
var getAllChildRowIndexFun = function getAllChildRowIndexFun(row, rowArry) {
    var oThis = this;
    if (row.childRow.length > 0) {
        Array.prototype.push.apply(rowArry, this.getChildRowIndex(row));
        $.each(row.childRow, function () {
            oThis.getAllChildRowIndexFun(this, rowArry);
        });
    }
};
/* 灞曞紑鏌愪釜鑺傜偣 */
var expandNode = function expandNode(keyValue) {
    var rowIndex = this.getRowIndexByValue(this.options.keyField, keyValue);
    this.expandNodeByIndex(rowIndex);
};
var expandNodeByIndex = function expandNodeByIndex(rowIndex) {
    var row = this.getRowByIndex(rowIndex);
    var parentExpand = false,
        parentIndex,
        needExpanedParent = new Array();
    var whileRow = row;
    while (!parentExpand) {
        if (whileRow.parentKeyValue == '') {
            parentExpand = true;
            break;
        } else {
            parentIndex = whileRow.parentRowIndex;
            whileRow = whileRow.parentRow;
            var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(parentIndex);
            var openDiv = $('.uf-add-s-o', $pTr);
            if (openDiv.length > 0) {
                //鍚堢潃
                needExpanedParent.push(parentIndex);
            } else {
                parentExpand = true;
                break;
            }
        }
    }
    if (needExpanedParent.length > 0) {
        for (var i = needExpanedParent.length - 1; i > -1; i--) {
            var index = needExpanedParent[i];
            var $pTr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(index);
            var openDiv = $('.uf-add-s-o', $pTr);
            openDiv.click();
        }
    }

    var $Tr = $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]').eq(rowIndex);
    var openDiv = $('.uf-add-s-o', $Tr);
    var firstDiv = $('.u-grid-content-td-div', $Tr);
    if (openDiv.length > 0) openDiv.click();else firstDiv.click();
};
/*
 * 灏唙alues杞寲涓簉ows骞惰繘琛屾帓搴�(鏁拌〃)
 */
var re_treeSortRows = function re_treeSortRows(field, sortType) {
    var oThis = this;
    var spliceHasParentRows = new Array();
    this.rows = new Array();
    this.hasParentRows = new Array();
    this.nothasParentRows = new Array();
    if (this.options.values) {
        $.each(this.options.values, function (i) {
            var rowObj = {};
            var $this = $(this);
            var keyField = oThis.gridComp.options.keyField;
            var parentKeyField = oThis.gridComp.options.parentKeyField;
            var keyValue = oThis.gridComp.getString($this.attr(keyField), '');
            var parentKeyValue = oThis.gridComp.getString($this.attr(parentKeyField), '');
            rowObj.valueIndex = i;
            rowObj.value = this;
            rowObj.keyValue = keyValue;
            rowObj.parentKeyValue = parentKeyValue;
            if (parentKeyValue == '') {
                oThis.nothasParentRows.push(rowObj);
            } else {
                oThis.hasParentRows.push(rowObj);
            }
            oThis.rows.push(rowObj);
        });
        // 鍒ゆ柇瀛樺湪鐖堕」鐨勬暟鎹殑鐖堕」鏄惁鐪熸瀛樺湪
        $.each(this.hasParentRows, function (i) {
            var parentKeyValue = this.parentKeyValue;
            var hasParent = false;
            $.each(oThis.rows, function () {
                if (this.keyValue == parentKeyValue) {
                    hasParent = true;
                }
            });
            if (!hasParent) {
                spliceHasParentRows.push(this);
                oThis.nothasParentRows.push(this);
            }
        });
        $.each(spliceHasParentRows, function () {
            var index = oThis.hasParentRows.indexOf(this);
            oThis.hasParentRows.splice(index, 1);
        });
        oThis.rows = new Array();
        var level = 0;
        // 閬嶅巻nothasParentRows锛屽皢瀛愰」鍔犲叆rows
        $.each(this.nothasParentRows, function (i) {
            this.level = level;
            oThis.rows.push(this);
            oThis.pushChildRows(this, level);
        });
    }
};
/*
 * 灏嗗綋鍓嶈瀛愰」鎻掑叆rows鏁扮粍
 */
var pushChildRows = function pushChildRows(row, level) {
    var keyValue = row.keyValue;
    var oThis = this;
    var nowLevel = parseInt(level) + 1;
    var hasChild = false;
    var childRowArray = new Array();
    var childRowIndexArray = new Array();
    var spliceHasParentRows = new Array();
    $.each(this.hasParentRows, function (i) {
        if (this && this.parentKeyValue == keyValue) {
            hasChild = true;
            this.level = nowLevel;
            oThis.rows.push(this);
            childRowArray.push(this);
            var index = parseInt(oThis.rows.length - 1);
            childRowIndexArray.push(index);
            spliceHasParentRows.push(this);
            oThis.pushChildRows(this, nowLevel);
        }
    });
    $.each(spliceHasParentRows, function () {
        var index = oThis.hasParentRows.indexOf(this);
        oThis.hasParentRows.splice(index, 1);
    });
    row.hasChild = hasChild;
    row.childRow = childRowArray;
    row.childRowIndex = childRowIndexArray;
};
var treeFunObj = {
    initOptionsTree: re_initOptionsTree,
    clickFunTree: re_clickFunTree,
    addOneRowTree: re_addOneRowTree,
    addOneRowTreeHasChildF: re_addOneRowTreeHasChildF,
    updateValueAtTree: re_updateValueAtTree,
    getAllChildRow: getAllChildRow,
    getChildRowIndex: re_getChildRowIndex,
    getAllChildRowIndex: getAllChildRowIndex,
    getAllChildRowFun: getAllChildRowFun,
    getAllChildRowIndexFun: getAllChildRowIndexFun,
    expandNode: expandNode,
    expandNodeByIndex: expandNodeByIndex,
    re_treeSortRows: re_treeSortRows,
    pushChildRows: pushChildRows,
    re_initTree: re_initTree
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var dataSource = function dataSource(options, gridComp) {
    classCallCheck(this, dataSource);


    this.init(options, gridComp);
    this.sortRows();
};



var dataSourceProto = dataSource.prototype;
if (!Object.assign) {
    Object.assign = u.extend;
}
Object.assign(dataSourceProto, initFunObj);

dataSourceProto.basicSortRows = sortFunObj.re_basicSortRows;

/*
 * tree
 */
dataSourceProto.treeSortRows = treeFunObj.re_treeSortRows;
dataSourceProto.pushChildRows = treeFunObj.pushChildRows;

/*
 * 澶勭悊鍙傛暟
 */
var init$1 = function init(options, gridComp) {
    // this.gridComp = gridComp; // 鍦ㄥ鐞嗗墠绔紦瀛樺皢column杞负string鐨勬椂鍊欎細鍥犱负姝ゅ睘鎬у嚭鐜版寰幆
    var gridOptions = gridComp.options;
    this.gridGetBoolean = gridComp.getBoolean;
    this.initDefault();
    // 浠巊rid缁ф壙鐨勫睘鎬�
    var gridDefault = {
        sortable: gridOptions.sortable,
        canDrag: gridOptions.canDrag,
        width: gridOptions.columnWidth
    };
    if (options.dataType == 'Date') {
        this.defaults.format = 'YYYY-MM-DD';
    }
    // 鏍戣〃鏆傛椂涓嶆敮鎸佹帓搴�
    options = this.initTree(options, gridOptions);
    this.options = $.extend({}, this.defaults, gridDefault, options);
    this.getBooleanOptions();
    try {
        if (typeof this.options.renderType == 'string') this.options.renderType = eval(this.options.renderType);
    } catch (e) {}
    try {
        if (typeof this.options.editType == 'string') this.options.editType = eval(this.options.editType);
    } catch (e) {}

    this.options.width = this.options.width;
    this.firstColumn = false;
};
var initTree = function initTree(options) {
    return options;
};

var initDefault = function initDefault() {
    this.defaults = {
        width: '200', // 榛樿瀹藉害涓�200
        sortable: true, // 鏄惁鍙互鎺掑簭
        canDrag: true, // 鏄惁鍙互鎷栧姩
        fixed: false, // 鏄惁鍥哄畾鍒�
        visible: true, // 鏄惁鏄剧ず
        canVisible: true, // 鏄惁鍙互闅愯棌
        sumCol: false, // 鏄惁璁＄畻鍚堣
        editable: true, // 鏄惁鍙慨鏀�
        editFormShow: true, // 鏄惁鍙慨鏀�
        autoExpand: false, // 鏄惁鑷姩鎵╁睍鍒�
        editType: 'text', // 缂栬緫绫诲瀷锛屾敮鎸佷紶鍏unction鎵╁睍
        dataType: 'String', // 鏁版嵁绫诲瀷,String, Date, Datetime, Int, Float
        //precision:  //绮惧害
        format: 'YYYY-MM-DD hh:mm:ss',
        //renderType:'', 娓叉煋绫诲瀷
        //headerColor
        headerLevel: 1, // header灞傜骇
        hiddenLevel: 1, // 瀹藉害涓嶈冻闅愯棌鐨勪紭鍏堢骇锛屽€艰秺澶т紭鍏堥殣钘�
        // parentHeader 瀵瑰簲鐨勭埗header鐨則itle
        // 鐩墠浠呮敮鎸佷袱绾э紝澶氱骇鐨勮瘽闇€瑕佹敼鍙樺ご鐨勯珮搴︼紝鍙﹀澶勭悊褰撳墠绾у埆鐨勬椂鍊欓渶瑕佺湅涓嬫槸鍚﹀瓨鍦ㄤ笂绾э紝濡傛灉瀛樺湪涓婄骇鐨勮瘽
        // 鍒欏垱寤烘柊鐨刣iv锛岃繖灏辨秹鍙婂埌闇€瑕佽翰鍙橀噺璁＄畻姣忕骇鐨勫搴︼紝闇€瑕佽€冭檻涓嬪浣曞疄鐜般€�
        // headerColor:'#a8a8a8'
        textAlign: 'left' // 鏄剧ず鏃跺榻愭柟寮�
    };
};
var getBooleanOptions = function getBooleanOptions() {
    this.options.sortable = this.gridGetBoolean(this.options.sortable);
    this.options.canDrag = this.gridGetBoolean(this.options.canDrag);
    this.options.fixed = this.gridGetBoolean(this.options.fixed);
    this.options.visible = this.gridGetBoolean(this.options.visible);
    this.options.canVisible = this.gridGetBoolean(this.options.canVisible);
    this.options.sumCol = this.gridGetBoolean(this.options.sumCol);
    this.options.editable = this.gridGetBoolean(this.options.editable);
    this.options.editFormShow = this.gridGetBoolean(this.options.editFormShow);
    this.options.autoExpand = this.gridGetBoolean(this.options.autoExpand);
};

var initFunObj$1 = {
    init: init$1,
    initDefault: initDefault,
    initTree: initTree,
    getBooleanOptions: getBooleanOptions
};

var column = function column(options, gridComp) {
    classCallCheck(this, column);

    this.init(options, gridComp);
};


var gridCompColumnProto = column.prototype;
if (!Object.assign) {
    Object.assign = u.extend;
}
Object.assign(gridCompColumnProto, initFunObj$1);

/*
 * tree
 */
gridCompColumnProto.initTree = treeFunObj.re_initTree;

var gridBrowser = {};
var userAgent = navigator.userAgent;
var ua = userAgent.toLowerCase();
var s;
if (s = ua.match(/msie ([\d.]+)/)) {
    gridBrowser.isIE = true;
}
if (gridBrowser.isIE) {
    var mode = document.documentMode;
    if (mode == null) {} else {
        if (mode == 8) {
            gridBrowser.isIE8 = true;
        } else if (mode == 9) {
            gridBrowser.isIE9 = true;
        } else if (mode == 10) {
            gridBrowser.isIE10 = true;
        }
    }
}

if (ua.indexOf('Android') > -1 || ua.indexOf('android') > -1 || ua.indexOf('Adr') > -1 || ua.indexOf('adr') > -1) {
    gridBrowser.isAndroid = true;
}

if (gridBrowser.isAndroid) {
    if (window.screen.width >= 768 && window.screen.width < 1024) {
        gridBrowser.isAndroidPAD = true;
    }
    if (window.screen.width <= 768) {
        gridBrowser.isAndroidPhone = true;
    }
}

if (ua.match(/iphone/i)) {
    gridBrowser.isIOS = true;
    gridBrowser.isIphone = true;
}

if (ua.match(/ipad/i)) {
    gridBrowser.isIOS = true;
    gridBrowser.isIPAD = true;
}

if (gridBrowser.isIphone || gridBrowser.isAndroidPhone) {
    gridBrowser.isMobile = true;
}

/*
 * 鍒涘缓椤跺眰div浠ュ強_top div灞�
 * 娣诲姞椤跺眰div鐩稿叧鐩戝惉
 */
var createDivs = function createDivs() {
    var oThis = this,
        styleStr = '',
        str = '',
        mobileClass = '';
    this.ele.innerHTML = '';
    if (this.options.width) {
        str += 'width:' + this.options.width + ';';
    } else {
        str += 'width:auto;';
    }
    if (this.options.height) {
        str += 'height:' + this.options.height + ';';
    } else {
        str += 'height:auto;';
    }
    if (str != '') {
        styleStr = 'style="' + str + '"';
    }
    if (gridBrowser.isMobile) {
        mobileClass = 'u-grid-mobile';
    }
    var htmlStr = '<div id="' + this.options.id + '" data-role="grid" class="u-grid ' + mobileClass + '" ' + styleStr + '>';
    htmlStr += '</div>';
    this.ele.insertAdjacentHTML('afterBegin', htmlStr);
    // 鍒涘缓灞忓箷div,鐢ㄤ簬鎷栧姩绛夋搷浣�
    var htmlStr = '<div id="' + this.options.id + '_top" class="u-grid-top"></div>';
    // this.ele.insertAdjacentHTML('afterBegin', htmlStr);
    document.body.appendChild($(htmlStr)[0]);
    this.initEventFun(); //鍒涘缓瀹屾垚涔嬪悗椤跺眰div娣诲姞鐩戝惉
    this.widthChangeFun(); // 鏍规嵁鏁翠綋瀹藉害鍒涘缓grid鎴杅orm灞曠ず鍖哄煙
};
/*
 * 鍒涘缓div鍖哄煙
 */
var repaintDivs = function repaintDivs() {
    // 鍚庢湡鍙互鑰冭檻form灞曠ず
    this.repaintGridDivs();
    this.realtimeTableRows = null;
};
/*
 * 鍒涘缓grid褰㈠紡涓媎iv鍖哄煙
 */
var createGridDivs = function createGridDivs() {
    if (this.createGridFlag) {
        return;
    }
    // 涓洪伩鍏嶉噸澶嶆覆鏌擄紝鍦ㄥ紑濮嬫竻绌洪噷闈㈠唴瀹�
    if ($('#' + this.options.id)[0]) $('#' + this.options.id)[0].innerHTML = '';
    var htmlStr = '<div id="' + this.options.id + '_grid" class="u-grid">';
    htmlStr += this.createHeader();
    htmlStr += this.createBeginNoScroll();
    htmlStr += this.createContent();
    htmlStr += this.createEndNoScroll();
    htmlStr += '</div>';
    if ($('#' + this.options.id)[0]) $('#' + this.options.id).html(htmlStr);
    $('#' + this.options.id + '_column_menu').remove();
    $(document.body).append(this.createColumnMenu());
    this.initGridEventFun();
    this.headerFirstClassFun();
    this.showType = 'grid';
    this.afterGridDivsCreate();
    this.createGridFlag = true;
    this.realtimeTableRows = null;
};

var createBeginNoScroll = function createBeginNoScroll() {
    return this.createNoScroll('begin');
};

var createEndNoScroll = function createEndNoScroll() {
    return this.createNoScroll('end');
};

var createNoScroll = function createNoScroll(type) {
    var htmlStr = '<div id="' + this.options.id + '_noScroll_' + type + '" class="u-grid-noScroll ' + type + '"><div class="u-grid-noScroll-wrap ' + type + '" id="' + this.options.id + '_noScroll_' + type + '_wrap">';

    if ((this.options.multiSelect || this.options.showNumCol) && (type == 'begin' && this.options.sumRowFirst && this.options.sumRowFixed || type == 'end' && !this.options.sumRowFirst && this.options.sumRowFixed)) {
        htmlStr += '<div id="' + this.options.id + '_noScroll_left" class="u-grid-noScroll-left" style="width:' + this.leftW + 'px;height:' + this.noScrollHeight + 'px;">';
        htmlStr += '</div>';
    }
    htmlStr += this.createNoScrollTableFixed(type);
    htmlStr += this.createNoScrollTable(type);
    htmlStr += '</div></div>';
    return htmlStr;
};

var createNoScrollTableFixed = function createNoScrollTableFixed(type) {
    return this.createNoScrollTable(type, 'fixed');
};

var createNoScrollTable = function createNoScrollTable(type, createFlag) {
    /*var leftW, idStr, styleStr, hStr, cssStr, tableStyleStr;
    hStr = "";
     if (createFlag == 'fixed') {
        leftW = parseInt(this.leftW);
        idStr = 'fixed_';
        cssStr = 'fixed-';
        if (this.options.fixedFloat == 'right') {
            styleStr = 'style="position:absolute;width:' + this.fixedWidth + 'px;right:0px;' + hStr + '"';
        } else {
            styleStr = 'style="position:absolute;width:' + this.fixedWidth + 'px;left:' + leftW + 'px;' + hStr + '"';
        }
        tableStyleStr = 'style="width:' + this.fixedWidth + 'px;"';
    } else {
        if (this.options.fixedFloat == 'right') {
            leftW = parseInt(this.leftW);
        } else {
            leftW = parseInt(this.leftW) + parseInt(this.fixedWidth, 0);
        }
        idStr = '';
        cssStr = '';
        styleStr = 'style="position:relative;left:' + leftW + 'px;' + hStr;
        if (this.contentMinWidth > 0) {
            styleStr += 'width:' + this.contentMinWidth + 'px;';
        }
        // 鍥犱负娣诲姞overflow-x涔嬪悗浼氬鑷寸旱鍚戜篃鏄剧ず涓嶅叏锛屽悗缁嚭鐜伴棶棰橀€氳繃淇敼瀹藉害鏉ュ疄鐜帮紝涓嶅啀閫氳繃overflow鏉ュ疄鐜�
        if (this.options.noScroll) {
            styleStr += 'overflow-x:hidden;'
        }
        styleStr += '"';
        tableStyleStr = '';
        if (this.contentMinWidth > 0) {
            if (this.contentWidth > 0) {
                tableStyleStr = 'style="position:relative;min-width:' + this.contentMinWidth + 'px;width:' + this.contentWidth + 'px;"';
            } else {
                tableStyleStr = 'style="position:relative;min-width:' + this.contentMinWidth + 'px;"';
            }
        }
    }
    var htmlStr = '<table role="grid" id="' + this.options.id + '_noScroll_' + idStr + type + '_table" ' + tableStyleStr + '>';
    htmlStr += this.createColgroup(createFlag);
    htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_noSCroll_' + idStr + type + '_thead" style="display:none">';
    htmlStr += this.createThead(createFlag);
    htmlStr += '</thead>';
    if ((type == 'begin' && this.options.sumRowFirst && this.options.sumRowFixed) || (type == 'end' && !this.options.sumRowFirst && this.options.sumRowFixed)) {
        htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_noScroll_' + idStr + type + '_tbody">';
        htmlStr += this.createContentRowsSumRow(createFlag);
        htmlStr += '</tbody>';
    }
    htmlStr += '</table>';
    return htmlStr;*/
    var leftW, positionStr, idStr;
    if (createFlag == 'fixed') {
        leftW = parseInt(this.leftW);
        positionStr = 'absolute;width:' + this.fixedWidth + 'px;z-index:11;';
        idStr = 'fixed_';
    } else {
        if (this.options.fixedFloat == 'right') {
            leftW = parseInt(this.leftW);
        } else {
            leftW = parseInt(this.leftW) + parseInt(this.fixedWidth);
        }
        positionStr = 'relative;';
        idStr = '';
        if (this.contentMinWidth > 0) {
            positionStr += 'width:' + this.contentMinWidth + 'px;';
        }
    }
    if (createFlag == 'fixed' && this.options.fixedFloat == 'right') {
        var htmlStr = '<table role="grid" id="' + this.options.id + '_noScroll_' + idStr + type + '_table" style="position:' + positionStr + ';right:0px;">';
    } else {
        var htmlStr = '<table role="grid" id="' + this.options.id + '_noScroll_' + idStr + type + '_table" style="position:' + positionStr + ';left:' + leftW + 'px;">';
    }
    htmlStr += this.createColgroup(createFlag);
    htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_noSCroll_' + idStr + type + '_thead" style="display:none">';
    htmlStr += this.createThead(createFlag);
    htmlStr += '</thead>';
    if (type == 'begin' && this.options.sumRowFirst && this.options.sumRowFixed || type == 'end' && !this.options.sumRowFirst && this.options.sumRowFixed) {
        htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_noScroll_' + idStr + type + '_tbody">';
        htmlStr += this.createContentRowsSumRow(createFlag);
        htmlStr += '</tbody>';
    }
    htmlStr += '</table>';
    return htmlStr;
};

/*
 * 閲嶇敾grid
 */
var repaintGridDivs = function repaintGridDivs() {
    $('#' + this.options.id + '_grid').remove(null, true);
    this.showType = '';
    this.wholeWidth = 0;
    this.createGridFlag = false;
    this.columnsVisibleFun();
    this.widthChangeFun();
    this.realtimeTableRows = null;
};
/*
 * 鍒涘缓columnMenu鍖哄煙
 */
var createColumnMenu = function createColumnMenu() {
    return '';
};
/*
 * 鍒涘缓header鍖哄煙
 */
var createHeader = function createHeader() {
    var wrapStr = '',
        headerShowStr = '';
    if (!this.options.showHeader) headerShowStr = 'style="display:none;"';
    var htmlStr = '<div class="u-grid-header" id="' + this.options.id + '_header" ' + headerShowStr + '><div class="u-grid-header-wrap" id="' + this.options.id + '_header_wrap" data-role="resizable" ' + wrapStr + '>';
    if (this.options.columnMenu) {
        htmlStr += '<div class="u-grid-header-columnmenu uf uf-navmenu-light"></div>';
    }
    if (this.options.multiSelect || this.options.showNumCol) {
        htmlStr += '<div id="' + this.options.id + '_header_left" class="u-grid-header-left" style="width:' + this.leftW + 'px;">';
        if (this.options.multiSelect) {
            if (gridBrowser.isIE8) {
                //htmlStr += '<div class="u-grid-header-multi-select" style="width:' + this.multiSelectWidth + 'px;"><input class="u-grid-multi-input"   type="checkbox" id="' + this.options.id + '_header_multi_input"></div>'
                htmlStr += '<div class="u-grid-header-multi-select" style="width:' + this.multiSelectWidth + 'px;"><span class="u-grid-checkbox-outline" id="' + this.options.id + '_header_multi_input"><span class="u-grid-checkbox-tick-outline"></span></span></div>';
            } else {
                //htmlStr += '<div class="u-grid-header-multi-select  checkbox check-success" style="width:' + this.multiSelectWidth + 'px;"><input  class="u-grid-multi-input"  type="checkbox" id="' + this.options.id + '_header_multi_input"><label for="' + this.options.id + '_header_multi_input"></label></div>'
                htmlStr += '<div class="u-grid-header-multi-select  checkbox check-success" style="width:' + this.multiSelectWidth + 'px;"><span class="u-grid-checkbox-outline" id="' + this.options.id + '_header_multi_input"><span class="u-grid-checkbox-tick-outline"></span></span></div>';
            }
        }
        if (this.options.showNumCol) {
            htmlStr += '<div class="u-grid-header-num" style="width:' + this.numWidth + 'px;"></div>';
        }
        htmlStr += '</div>';
    }
    htmlStr += this.createHeaderTableFixed();
    htmlStr += this.createHeaderTable();
    htmlStr += '</div>';
    htmlStr += this.createHeaderDrag();
    htmlStr += '</div>';
    return htmlStr;
};
/*
 * 鍒涘缓header鍖哄煙table
 */
var createHeaderTable = function createHeaderTable(createFlag) {
    var leftW, positionStr, idStr;
    if (createFlag == 'fixed') {
        leftW = parseInt(this.leftW);
        positionStr = 'absolute;width:' + this.fixedWidth + 'px;z-index:11;background:#F9F9F9;';
        idStr = 'fixed_';
    } else {
        if (this.options.fixedFloat == 'right') {
            leftW = parseInt(this.leftW);
        } else {
            leftW = parseInt(this.leftW) + parseInt(this.fixedWidth);
        }
        positionStr = 'relative;';
        idStr = '';
        if (this.contentMinWidth > 0) {
            positionStr += 'width:' + this.contentMinWidth + 'px;';
        }
    }
    if (createFlag == 'fixed' && this.options.fixedFloat == 'right') {
        var htmlStr = '<table role="grid" id="' + this.options.id + '_header_' + idStr + 'table" style="position:' + positionStr + ';right:0px;">';
    } else {
        var htmlStr = '<table role="grid" id="' + this.options.id + '_header_' + idStr + 'table" style="position:' + positionStr + ';left:' + leftW + 'px;">';
    }
    htmlStr += this.createColgroup(createFlag);
    htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_header_' + idStr + 'thead">';
    htmlStr += this.createThead(createFlag);
    htmlStr += '</thead></table>';
    return htmlStr;
};
var createHeaderTableFixed = function createHeaderTableFixed() {
    return '';
};
var createHeaderDrag = function createHeaderDrag() {
    return '';
};
/*
 * 鍒涘缓colgroup
 */
var createColgroup = function createColgroup(createFlag) {
    var oThis = this,
        htmlStr = '<colgroup>',
        gridCompColumnArr;
    if (createFlag == 'fixed') {
        gridCompColumnArr = this.gridCompColumnFixedArr;
    } else {
        gridCompColumnArr = this.gridCompColumnArr;
    }
    $.each(gridCompColumnArr, function () {
        if (this.options.visible) {
            htmlStr += '<col';
            if (!this.options.autoExpand) {
                htmlStr += ' style="width:' + oThis.formatWidth(this.options.width) + '"';
            }
            htmlStr += '>';
        }
    });
    htmlStr += '</colgroup>';
    return htmlStr;
};
/*
 * 鍒涘缓thead鍖哄煙
 */
var createThead = function createThead(createFlag) {
    var oThis = this,
        visibleIndex = 0,
        gridCompColumnArr,
        trStyle = '',
        thLevelClass = '';
    if (this.options.maxHeaderLevel > 1) {
        trStyle = 'style="height:' + (this.headerHeight - 1) + 'px;"';
        thLevelClass = ' u-grid-header-level-th ';
    }
    var htmlStr = '<tr role="row" ' + trStyle + '>';
    if (createFlag == 'fixed') {
        gridCompColumnArr = this.gridCompColumnFixedArr;
    } else {
        gridCompColumnArr = this.gridCompColumnArr;
    }
    $.each(gridCompColumnArr, function (i) {
        var vi = visibleIndex,
            displayStyle = '';
        if (this.options.visible == false) {
            vi = -1;
            displayStyle = 'style="display:none;"';
        } else {
            visibleIndex++;
        }

        // 浣庣増鏈祻瑙堝櫒涓嶆敮鎸乼h position涓簉elative锛屽洜姝ゅ姞鍏ョ┖div
        htmlStr += '<th role="columnheader" data-filed="' + this.options.field + '" rowspan="1" class="u-grid-header-th ' + thLevelClass + '" ' + displayStyle + 'field="' + this.options.field + '" index="' + i + '" visibleIndex="' + vi + '"><div style="position:relative;" class="u-grid-header-div">';
        var colorStype = '';
        if (this.options.headerColor || oThis.options.headerHeight) {
            var headerC = '';
            var headerH = '';
            if (this.options.headerColor) headerC = 'color:' + this.options.headerColor + ';';
            if (oThis.options.headerHeight) headerH = 'height:' + oThis.options.headerHeight + 'px;line-height:' + oThis.options.headerHeight + 'px;';
            colorStype = 'style="' + headerC + headerH + '"';
        }
        var requiredHtml = '';
        if (this.options.required) {
            requiredHtml = '<span style="color:red;">*</span>';
        }
        htmlStr += '<div class="u-grid-header-link" field="' + this.options.field + '"  style="text-align:' + this.options.textAlign + '" ' + colorStype + '>' + this.options.title + requiredHtml + '</div>';
        /*if(oThis.options.columnMenu && createFlag != 'fixed'){
            // 鍒涘缓鍙充晶鎸夐挳鍥炬爣
            htmlStr += '<div class="u-grid-header-columnmenu uf uf-navmenu-light " field="' + this.options.field + '" style="display:none;"></div>';
        }*/
        htmlStr += '</div></th>';
    });

    htmlStr += '</tr>';
    return htmlStr;
};
/*
 * 鍒涘缓鍐呭鍖哄煙
 */
var createContent = function createContent() {
    var h = '',
        displayStr = '',
        bottonStr = '',
        lbw = 0;
    if (this.countContentHeight) {
        var wh = $('#' + this.options.id)[0].offsetHeight;
        this.wholeHeight = wh;
        if (wh > 0) {
            this.contentHeight = parseInt(wh) - this.exceptContentHeight - 1 > 0 ? parseInt(wh) - this.exceptContentHeight - 1 : 0;
            if (this.contentHeight > 0) {
                h = 'style="height:' + this.contentHeight + 'px;"';
            }
        }
    }
    var htmlStr = '<div id="' + this.options.id + '_content" class="u-grid-content" ' + h + '>';
    if (this.options.showNumCol || this.options.multiSelect) {
        htmlStr += this.createContentLeft();
        if (!(this.contentWidth > this.contentMinWidth)) {
            displayStr = 'display:none;';
            bottonStr = 'bottom:0px;';
        }
        htmlStr += this.createContentSumRow(bottonStr);
        if (u.isIOS) {
            displayStr += 'width:0px;';
        }
        if (this.options.fixedFloat == 'right') {
            lbw = this.leftW;
        } else {
            lbw = this.leftW + this.fixedWidth;
        }
        // htmlStr += '<div class="u-grid-content-left-bottom" id="' + this.options.id + '_content_left_bottom" style="width:' + lbw + 'px;' + displayStr + '">';
        // htmlStr += '</div>';
    }
    htmlStr += this.createContentTableFixed();
    htmlStr += this.createContentTable();
    htmlStr += '</div>';
    return htmlStr;
};
var createContentSumRow = function createContentSumRow() {
    return '';
};
/*
 * 鍒涘缓鍐呭鍖哄乏渚у尯鍩�
 */
var createContentLeft = function createContentLeft() {
    var oThis = this,
        htmlStr = "",
        left = 0,
        hStr = "",
        sumRowClass = '',
        topStr = "";
    // 楂樺害鍙几缂╋紝鏆傛椂鍘绘帀鍐呴儴鐨勯珮搴﹁缃�
    // if(this.countContentHeight && parseInt(this.contentHeight) > 0){
    // 	hStr = 'max-height:' + this.contentHeight + 'px;overflow:hidden;';
    // }else{
    // 	hStr = '';
    // }
    if (this.options.showSumRow && this.options.sumRowFirst && !this.options.sumRowFixed && this.options.sumRowHeight) {
        topStr = "top:" + this.options.sumRowHeight + 'px';
    }
    if (this.options.showSumRow) {
        sumRowClass = 'u-grid-content-left-sum';
        if (this.options.sumRowFirst && !this.options.sumRowFixed && this.dataSourceObj.rows.length > 0) {
            sumRowClass += ' u-grid-content-left-sum-first';
        }
    }
    if (this.options.multiSelect) {
        htmlStr += '<div class="u-grid-content-left u-grid-content-left-multi ' + sumRowClass + '" id="' + this.options.id + '_content_multiSelect" style="width:' + this.multiSelectWidth + 'px;' + hStr + topStr + '">';
        // 閬嶅巻鐢熸垚鎵€鏈夎
        if (this.dataSourceObj.rows) {
            if (this.options.groupSumRow) {
                htmlStr += oThis.createContentLeftMultiSelectGroupRows();
            } else {
                $.each(this.dataSourceObj.rows, function (i) {
                    htmlStr += oThis.createContentLeftMultiSelectRow(this);
                });
            }
        }
        htmlStr += '</div>';
        left += this.multiSelectWidth;
    }
    if (this.options.showNumCol) {
        htmlStr += '<div class="u-grid-content-left u-grid-content-left-num ' + sumRowClass + '" id="' + this.options.id + '_content_numCol" style="width:' + this.numWidth + 'px;left:' + left + 'px;' + hStr + topStr + '">';
        // 閬嶅巻鐢熸垚鎵€鏈夎
        if (this.dataSourceObj.rows) {
            if (this.options.groupSumRow) {
                htmlStr += oThis.createContentLeftNumColGroupRows();
            } else {
                $.each(this.dataSourceObj.rows, function (i, row) {
                    htmlStr += oThis.createContentLeftNumColRow(i, row.value);
                });
            }
        }
        htmlStr += '</div>';
    }
    return htmlStr;
};

var createContentLeftMultiSelectGroupRows = function createContentLeftMultiSelectGroupRows() {
    return '<div>鍙傛暟璁剧疆鏄剧ず鍒嗙粍鍚堣琛岋紝浣嗘槸鏈紩鍏ュ垎缁勫悎璁¤璧勬簮</div>';
};

var createContentLeftNumColGroupRows = function createContentLeftNumColGroupRows() {
    return '<div>鍙傛暟璁剧疆鏄剧ず鍒嗙粍鍚堣琛岋紝浣嗘槸鏈紩鍏ュ垎缁勫悎璁¤璧勬簮</div>';
};
/*
 * 鍒涘缓鍐呭鍖哄乏渚у尯鍩熷閫夊尯锛堜竴琛岋級
 */
var createContentLeftMultiSelectRow = function createContentLeftMultiSelectRow(row, displayFlag) {
    var displayStr = '';
    if (!this.options.autoExpand && row.level > 0 && displayFlag != 'block') {
        displayStr = 'display:none;';
    }
    var tmpcheck = row.value["$_#_@_id"];
    if (!tmpcheck) {
        tmpcheck = setTimeout(function () {});
    }

    var rootObj = row.value;
    var objAry = this.selectRows;
    var re = objCompare(rootObj, objAry);
    var heightStr = '';

    if (!this.options.needResetHeight) {
        heightStr = 'height:' + (this.options.rowHeight + 1) + 'px;';
    }

    var createFlag = true;
    if (typeof this.options.onBeforeCreateLeftMul == 'function') {
        var obj = {
            gridObj: this,
            rowObj: row
        };
        createFlag = this.options.onBeforeCreateLeftMul.call(this, obj);
    }
    if (gridBrowser.isIE8) {
        //var	htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + displayStr + '" class="u-grid-content-multiSelect " ><input class="u-grid-multi-input" id="checkbox'+tmpcheck+'" type="checkbox" value="1" ></div>'
        var htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + heightStr + displayStr + '" class="u-grid-content-multiSelect " >';
        if (createFlag) htmlStr += '<span class="u-grid-checkbox-outline" id="checkbox' + tmpcheck + '" value="1"><span class="u-grid-checkbox-tick-outline"></span></span>';
        htmlStr += '</div>';
    } else {
        if (re) {
            var htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + heightStr + displayStr + '" class="u-grid-content-multiSelect checkbox check-success u-grid-content-sel-row" >';
            if (createFlag) htmlStr += '<span class="u-grid-checkbox-outline  is-checked" id="checkbox' + tmpcheck + '" value="1"><span class="u-grid-checkbox-tick-outline"></span></span>';
            htmlStr += '</div>';
        } else {
            var htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + heightStr + displayStr + '" class="u-grid-content-multiSelect checkbox check-success" >';
            if (createFlag) htmlStr += '<span class="u-grid-checkbox-outline" id="checkbox' + tmpcheck + '" value="1"><span class="u-grid-checkbox-tick-outline"></span></span>';
            htmlStr += '</div>';
        }
        //var htmlStr = '<div style="width:' + this.multiSelectWidth + 'px;' + displayStr + '" class="u-grid-content-multiSelect checkbox check-success" ><input class="u-grid-multi-input" id="checkbox'+tmpcheck+'" type="checkbox" value="1" ><label for="checkbox'+tmpcheck+'"></label></div>'
    }
    return htmlStr;
};
/*
 * 鍒涘缓鍐呭鍖哄乏渚у尯鍩熸暟瀛楀垪锛堜竴琛岋級
 */
var createContentLeftNumColRow = function createContentLeftNumColRow(index) {
    var row = this.dataSourceObj.rows[index];
    var rootObj = row.value;
    var objAry = this.selectRows;
    var re = objCompare(rootObj, objAry);
    var htmlStr;
    var heightStr = '';

    if (!this.options.needResetHeight) {
        heightStr = 'height:' + (this.options.rowHeight + 1) + 'px;';
    }
    if (re) {
        htmlStr = '<div style="width:' + this.numWidth + 'px;' + heightStr + '" class="u-grid-content-num  u-grid-content-sel-row">' + (index + 1) + '</div>';
    } else {
        htmlStr = '<div style="width:' + this.numWidth + 'px;' + heightStr + '" class="u-grid-content-num">' + (index + 1) + '</div>';
    }
    return htmlStr;
};
/*
 * 鍒涘缓鍐呭鍖簍able
 */
var createContentTable = function createContentTable(createFlag) {
    var leftW, idStr, styleStr, hStr, cssStr, tableStyleStr;
    if (this.countContentHeight && parseInt(this.contentHeight) > 0) {
        hStr = 'height:' + this.contentHeight + 'px;';
    } else {
        hStr = "";
    }

    if (createFlag == 'fixed') {
        leftW = parseInt(this.leftW);
        idStr = 'fixed_';
        cssStr = 'fixed-';
        if (this.options.fixedFloat == 'right') {
            styleStr = 'style="position:absolute;width:' + this.fixedWidth + 'px;right:0px;' + hStr + '"';
        } else {
            styleStr = 'style="position:absolute;width:' + this.fixedWidth + 'px;left:' + leftW + 'px;' + hStr + '"';
        }
        tableStyleStr = 'style="width:' + this.fixedWidth + 'px;"';
    } else {
        if (this.options.fixedFloat == 'right') {
            leftW = parseInt(this.leftW);
        } else {
            leftW = parseInt(this.leftW) + parseInt(this.fixedWidth, 0);
        }
        idStr = '';
        cssStr = '';
        styleStr = 'style="position:relative;left:' + leftW + 'px;' + hStr;
        if (this.contentMinWidth > 0) {
            styleStr += 'width:' + this.contentMinWidth + 'px;';
        }
        // 鍥犱负娣诲姞overflow-x涔嬪悗浼氬鑷寸旱鍚戜篃鏄剧ず涓嶅叏锛屽悗缁嚭鐜伴棶棰橀€氳繃淇敼瀹藉害鏉ュ疄鐜帮紝涓嶅啀閫氳繃overflow鏉ュ疄鐜�
        if (this.options.noScroll) {
            styleStr += 'overflow-x:hidden;';
        }
        styleStr += '"';
        tableStyleStr = '';
        if (this.contentMinWidth > 0) {
            if (this.contentWidth > 0) {
                tableStyleStr = 'style="min-width:' + this.contentMinWidth + 'px;width:' + this.contentWidth + 'px;"';
            } else {
                tableStyleStr = 'style="min-width:' + this.contentMinWidth + 'px;"';
            }
        }
    }

    var htmlStr = '<div id="' + this.options.id + '_content_' + idStr + 'div" class="u-grid-content-' + cssStr + 'div" ' + styleStr + '>';
    htmlStr += '<div style="height:30px;position:absolute;top:-30px;width:100%;z-index:-1;"></div><table role="grid" id="' + this.options.id + '_content_' + idStr + 'table" ' + tableStyleStr + '>';
    htmlStr += this.createColgroup(createFlag);
    htmlStr += '<thead role="rowgroup" id="' + this.options.id + '_content_' + idStr + 'thead" style="display:none">';
    htmlStr += this.createThead(createFlag);
    htmlStr += '</thead>';
    htmlStr += this.createContentRows(createFlag);
    htmlStr += '</table>';
    if (createFlag != 'fixed') {
        htmlStr += this.createNoRowsDiv();
    }
    htmlStr += '</div>';
    return htmlStr;
};
var createContentTableFixed = function createContentTableFixed() {
    return '';
};
/*
 * 鍒涘缓鏃犳暟鎹尯鍩�
 */
var createNoRowsDiv = function createNoRowsDiv() {
    var styleStr = '',
        styleStr1 = '';
    if (this.contentMinWidth > 0) {
        styleStr += 'style="width:' + this.contentMinWidth + 'px;"';
    }
    if (this.contentWidth > 0) {
        styleStr1 += 'style="width:' + this.contentWidth + 'px;"';
    }
    var htmlStr = '<div class="u-grid-noRowsDiv"' + styleStr1 + ' id="' + this.options.id + '_noRows"></div>';
    htmlStr += '<div class="u-grid-noRowsShowDiv"' + styleStr + ' id="' + this.options.id + '_noRowsShow">' + this.transMap.ml_no_rows + '</div>';
    return htmlStr;
};
/*
 * 鍒涘缓鍐呭鍖哄煙鎵€鏈夎
 */
var createContentRows = function createContentRows(createFlag) {
    var oThis = this,
        htmlStr = "",
        idStr;
    if (createFlag == 'fixed') {
        idStr = 'fixed_';
    } else {
        idStr = '';
    }
    // 閬嶅巻鐢熸垚鎵€鏈夎
    if (this.dataSourceObj.rows) {
        htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_content_' + idStr + 'tbody">';
        if (this.options.sumRowFirst && !this.options.sumRowFixed) {
            htmlStr += this.createContentRowsSumRow(createFlag);
        }
        if (this.options.groupField) {
            htmlStr += oThis.createContentGroupRows(createFlag);
        } else {
            $.each(this.dataSourceObj.rows, function (i) {
                htmlStr += oThis.createContentOneRow(this, createFlag);
            });
        }
        if (!this.options.sumRowFirst && !this.options.sumRowFixed) {
            htmlStr += this.createContentRowsSumRow(createFlag);
        }
        htmlStr += '</tbody>';
    }
    return htmlStr;
};
var createContentRowsSumRow = function createContentRowsSumRow() {
    return '<div>鍙傛暟璁剧疆鏄剧ず鍚堣琛岋紝浣嗘槸鏈紩鍏ュ悎璁¤璧勬簮</div>';
};
var createContentGroupRows = function createContentGroupRows() {
    return '<div>鍙傛暟璁剧疆鏄剧ず鍒嗙粍鍚堣琛岋紝浣嗘槸鏈紩鍏ュ垎缁勫悎璁¤璧勬簮</div>';
};
/*
 * 鍒涘缓鍐呭鍖哄煙鏁版嵁琛�
 */
var createContentOneRow = function createContentOneRow(row, createFlag, displayFlag) {
    var styleStr = '';
    if (!this.options.autoExpand && row.level > 0 && displayFlag != 'block') {
        styleStr = 'style="display:none"';
    }

    var rootObj = row.value;
    var objAry = this.selectRows;
    var re = objCompare(rootObj, objAry);
    var htmlStr = '';
    var classStr = '';
    if (this.options.showTree) {
        if (row.hasChild) {
            classStr += ' u-grid-content-parent-row ';
        } else {
            classStr += ' u-grid-content-leaf-row ';
        }

        if (row.level == 0) {
            classStr += ' u-grid-content-level0-row ';
        } else {
            classStr += ' u-grid-content-levelother-row ';
        }
    }

    if (re) {
        classStr += 'u-grid-content-sel-row';
    }
    htmlStr = '<tr role="row" class="' + classStr + '" ' + styleStr + '>';
    htmlStr += this.createContentOneRowTd(row, createFlag);
    htmlStr += '</tr>';
    return htmlStr;
};
/*
 * 鍒涘缓鍐呭鍖哄煙鏁版嵁琛岋紝閽堝IE
 */
var createContentOneRowForIE = function createContentOneRowForIE(table, index, rowObj, createFlag, displayFlag) {
    var row = table.insertRow(index + 1);
    row.setAttribute("role", "row");
    if (!this.options.autoExpand && rowObj.level > 0 && displayFlag != 'block') {
        row.style.display = 'none';
    }

    if (this.options.showTree) {
        if (row.hasChild) {
            $(row).addClass('u-grid-content-parent-row');
        } else {
            $(row).addClass('u-grid-content-leaf-row');
        }

        if (row.level == 0) {
            $(row).addClass('u-grid-content-level0-row');
        } else {
            $(row).addClass('u-grid-content-levelother-row');
        }
    }

    this.createContentOneRowTdForIE(row, rowObj, createFlag);
};

/*
 * 鏁版嵁鏇存柊閲嶇敾褰撳墠琛�
 */
var repaintRow = function repaintRow(rowIndex) {
    var tr = $('#' + this.options.id + '_content_tbody').find('tr[role="row"]')[rowIndex],
        fixedtr = $('#' + this.options.id + '_content_fixed_tbody').find('tr[role="row"]')[rowIndex],
        row = this.dataSourceObj.rows[rowIndex],
        $tr = $(tr),
        index = this.getTrIndex($tr);
    if (gridBrowser.isIE8 || gridBrowser.isIE9) {
        var table = $('#' + this.options.id + '_content_table')[0],
            fixedtable = $('#' + this.options.id + '_content_fixed_table')[0];
        var className = tr.className;
        var fixclassName = fixedtr.className;
        table.deleteRow(rowIndex + 1);
        fixedtable.deleteRow(rowIndex + 1);
        var tr = table.insertRow(rowIndex + 1);
        u.addClass(tr, className);
        var fixedtr = fixedtable.insertRow(rowIndex + 1);
        u.addClass(fixedtr, fixclassName);
        this.createContentOneRowTdForIE(tr, row);
        this.createContentOneRowTdForIE(fixedtr, row, 'fixed');
    } else {
        tr.innerHTML = this.createContentOneRowTd(row);
        if (fixedtr) fixedtr.innerHTML = this.createContentOneRowTd(row, 'fixed');
    }
    var obj = {};
    obj.begin = index;
    obj.length = 1;
    this.renderTypeFun(obj);
};
/*
 * 鍒涘缓琛宼d瀵瑰簲鐨刪tml
 */
var createContentOneRowTd = function createContentOneRowTd(row, createFlag) {
    var oThis = this,
        htmlStr = '',
        gridCompColumnArr,
        value = row.value;
    if (createFlag == 'fixed') {
        gridCompColumnArr = this.gridCompColumnFixedArr;
    } else {
        gridCompColumnArr = this.gridCompColumnArr;
    }
    $.each(gridCompColumnArr, function () {
        var f = this.options.field,
            v = $(value).attr(f);
        v = oThis.getString(v, '');
        if ($.type(v) == 'object') {
            v = v.showValue;
        }
        var renderType = this.options.renderType;
        var treeStyle = '';
        var spanStr = '';
        var iconStr = '';
        var vStr = '';
        var tdStyle = '';
        var cssStr = '';
        var classStr = '';
        var rowHeight = oThis.options.rowHeight;
        if (oThis.options.showTree && this.firstColumn) {
            var l = parseInt(oThis.treeLeft) * parseInt(row.level);
            treeStyle = 'style="position:relative;';
            if (row.hasChild || value.isParent) {
                if (oThis.options.autoExpand && !value.isParent) {
                    spanStr = '<span class=" uf uf-reduce-s-o u-grid-content-tree-span"></span>';
                } else {
                    spanStr = '<span class=" uf uf-add-s-o u-grid-content-tree-span"></span>';
                }
            } else {
                l += 16;
            }
            treeStyle += 'text-align:' + this.options.textAlign + ';';
            if (oThis.options.maxHeight > 40) {
                treeStyle += 'max-height:' + oThis.options.maxHeight + 'px;';
            }
            treeStyle += 'left:' + l + 'px;"';
        } else {
            if (oThis.options.maxHeight > 40) {
                treeStyle += 'style="text-align:' + this.options.textAlign + ';max-height:' + oThis.options.maxHeight + 'px;"';
            } else {
                treeStyle += 'style="text-align:' + this.options.textAlign + ';"';
            }
        }

        if (this.options.icon) {
            iconStr = '<span class="' + this.options.icon + '"></span>';
        }
        if (oThis.options.heightAuto) {
            cssStr = 'height-auto';
        }
        // title="' + v + '" 鍒涘缓td鐨勬椂鍊欎笉鍦ㄨ缃畉itle锛屽湪renderType涓缃�,澶勭悊鐜板疄xml鐨勬儏鍐�
        if (oThis.options.groupField && f == oThis.options.groupField) {
            classStr = 'class="u-grid-content-td-group-field';
            if (oThis.nowGroupValue == v) {
                classStr += ' no-text';
                oThis.nowGroupIndex++;
            } else {
                oThis.nowGroupIndex = 1;
                oThis.nowGroupValue = v;
                oThis.nowGroupRow = oThis.getGroupRowByGroupValue(v);
                oThis.nowGroupRowCount = oThis.nowGroupRow.rows.length;
            }
            if (oThis.nowGroupIndex == oThis.nowGroupRowCount) {
                classStr += ' group-last';
            }
            classStr += '"';
            if (oThis.nowGroupIndex == 1) rowHeight = oThis.options.rowHeight * oThis.nowGroupRowCount;
        }

        if (oThis.options.groupShowField && f == oThis.options.groupShowField) {
            var groupV = row.value[oThis.options.groupField];
            classStr = 'class="u-grid-content-td-group-field';
            if (oThis.nowGroupShowValue == v) {
                classStr += ' no-text';
                oThis.nowGroupShowIndex++;
            } else {
                oThis.nowGroupShowIndex = 1;
                oThis.nowGroupShowValue = v;
                oThis.nowGroupShowRow = oThis.getGroupRowByGroupValue(groupV);
                oThis.nowGroupShowRowCount = oThis.nowGroupShowRow.rows.length;
            }
            if (oThis.nowGroupShowIndex == oThis.nowGroupShowRowCount) {
                classStr += ' group-last';
            }
            classStr += '"';
            if (oThis.nowGroupShowIndex == 1) rowHeight = oThis.options.rowHeight * oThis.nowGroupShowRowCount;
        }

        if (!this.options.visible) {
            tdStyle = 'style="display:none;';
            if (oThis.options.rowHeight) {
                tdStyle += 'height:' + oThis.options.rowHeight + 'px;line-height:' + rowHeight + 'px;';
            }
            tdStyle += '"';
        } else {
            if (oThis.options.rowHeight) {
                tdStyle += 'style="height:' + oThis.options.rowHeight + 'px;line-height:' + rowHeight + 'px;"';
            }
        }
        htmlStr += '<td role="rowcell"  ' + tdStyle + classStr + ' realValue="' + v + '" ><div class="u-grid-content-td-div ' + cssStr + '" ' + treeStyle + '>' + spanStr + iconStr + '<span>' + v.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') + '</span></div></td>';
    });
    return htmlStr;
};
/*
 * 鍒涘缓琛宼d,閽堝IE
 */
var createContentOneRowTdForIE = function createContentOneRowTdForIE(row, rowObj, createFlag) {
    var oThis = this,
        gridCompColumnArr,
        value = rowObj.value;
    if (createFlag == 'fixed') {
        gridCompColumnArr = this.gridCompColumnFixedArr;
    } else {
        gridCompColumnArr = this.gridCompColumnArr;
    }
    $.each(gridCompColumnArr, function () {
        var f = this.options.field,
            v = $(value).attr(f),
            v = oThis.getString(v, '');
        if ($.type(v) == 'object') {
            v = v.showValue;
        }
        var renderType = this.options.renderType,
            treeStyle = '',
            spanStr = '',
            iconStr = '',
            vStr = '',
            htmlStr = '',
            newCell = row.insertCell(),
            cssStr = '';
        newCell.setAttribute("role", "rowcell");
        // newCell.title = v.replace(/\</g,'\<').replace(/\>/g,'\>');
        if (oThis.options.showTree && this.firstColumn) {
            var l = parseInt(oThis.treeLeft) * parseInt(row.level);
            treeStyle = 'style="position:relative;';
            if (row.hasChild || value.isParent) {
                if (oThis.options.autoExpand && !value.isParent) {
                    spanStr = '<span class=" uf uf-reduce-s-o u-grid-content-tree-span"></span>';
                } else {
                    spanStr = '<span class=" uf uf-add-s-o u-grid-content-tree-span"></span>';
                }
            } else {
                l += 16;
            }
            treeStyle += 'text-align:' + this.options.textAlign + ';';
            if (oThis.options.maxHeight > 40) {
                treeStyle += 'max-height:' + oThis.options.maxHeight + 'px;';
            }
            treeStyle += 'left:' + l + 'px;"';
        } else {
            if (oThis.options.maxHeight > 40) {
                treeStyle += 'style="text-align:' + this.options.textAlign + ';max-height:' + oThis.options.maxHeight + 'px;"';
            } else {
                treeStyle += 'style="text-align:' + this.options.textAlign + ';"';
            }
        }
        if (!this.options.visible) {
            newCell.style.display = "none";
        }
        if (oThis.options.rowHeight) {
            newCell.style.height = oThis.options.rowHeight + 'px';
            newCell.style.lineHeight = oThis.options.rowHeight + 'px';
        }
        if (this.options.icon) {
            iconStr = '<span class="' + this.options.icon + '"></span>';
        }
        if (oThis.options.heightAuto) {
            cssStr = 'height-auto';
        }
        htmlStr += '<div class="u-grid-content-td-div ' + cssStr + '" ' + treeStyle + '>' + spanStr + iconStr + '<span>' + v.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') + '</span></div>';
        newCell.insertAdjacentHTML('afterBegin', htmlStr);
    });
};
/*
 * 閲嶇敾鍐呭鍖哄煙
 */
var repairContent = function repairContent() {
    var $pDiv = $('#' + this.options.id + '_content').parent();
    $('#' + this.options.id + '_content').remove(null, true);
    if ($pDiv[0]) {
        var htmlStr = this.createContent();
        $pDiv[0].insertAdjacentHTML('beforeEnd', htmlStr);
        this.renderTypeFun();
        this.initContentDivEventFun();
        if ($('#' + this.options.id + '_content_div')[0]) {
            $('#' + this.options.id + '_content_div')[0].scrollLeft = this.scrollLeft;
        }
        $('#' + this.options.id + '_content_edit_menu').css('display', 'none');
    }
    this.realtimeTableRows = null;
};

/**
 * Object Compare with Array Object
 */
var objCompare = function objCompare(rootObj, objAry) {
    var aryLen = objAry.length;
    // var rootStr = JSON.stringify(rootObj);
    var matchNum = 0;
    for (var i = 0; i < aryLen; i++) {
        // var compareStr = JSON.stringify(objAry[i]);
        var compareObj = objAry[i];
        matchNum += rootObj == compareObj ? 1 : 0;
    }
    return matchNum > 0 ? true : false;
};

var createFunObj = {
    createDivs: createDivs,
    repaintDivs: repaintDivs,
    createGridDivs: createGridDivs,
    repaintGridDivs: repaintGridDivs,
    createColumnMenu: createColumnMenu,
    createHeader: createHeader,
    createHeaderTable: createHeaderTable,
    createHeaderTableFixed: createHeaderTableFixed,
    createHeaderDrag: createHeaderDrag,
    createColgroup: createColgroup,
    createThead: createThead,
    createContent: createContent,
    createContentSumRow: createContentSumRow,
    createContentLeft: createContentLeft,
    createContentLeftMultiSelectRow: createContentLeftMultiSelectRow,
    createContentLeftNumColRow: createContentLeftNumColRow,
    createContentLeftMultiSelectGroupRows: createContentLeftMultiSelectGroupRows,
    createContentLeftNumColGroupRows: createContentLeftNumColGroupRows,
    createContentTable: createContentTable,
    createContentTableFixed: createContentTableFixed,
    createNoRowsDiv: createNoRowsDiv,
    createContentRows: createContentRows,
    createContentRowsSumRow: createContentRowsSumRow,
    createContentGroupRows: createContentGroupRows,
    createContentOneRow: createContentOneRow,
    createContentOneRowForIE: createContentOneRowForIE,
    repaintRow: repaintRow,
    createContentOneRowTd: createContentOneRowTd,
    createContentOneRowTdForIE: createContentOneRowTdForIE,
    repairContent: repairContent,
    createBeginNoScroll: createBeginNoScroll,
    createEndNoScroll: createEndNoScroll,
    createNoScroll: createNoScroll,
    createNoScrollTableFixed: createNoScrollTableFixed,
    createNoScrollTable: createNoScrollTable
};

var trHoverFun = function trHoverFun(index) {
    if (index < 0) return;
    var oThis = this;
    $('#' + oThis.options.id + '_content_tbody').find('tr[role="row"]').removeClass('u-grid-move-bg');
    $('#' + oThis.options.id + '_content_fixed_tbody').find('tr[role="row"]').removeClass('u-grid-move-bg');
    if (oThis.options.multiSelect) $('#' + oThis.options.id + '_content_multiSelect').find('div').removeClass('u-grid-move-bg');
    if (oThis.options.showNumCol) $('#' + oThis.options.id + '_content_numCol').find('div').removeClass('u-grid-move-bg');
    if (index > -1) {
        var $tr = $('#' + oThis.options.id + '_content_tbody').find('tr[role="row"]').eq(index);
        if ($tr && $tr[0] && $tr[0].id && $tr[0].id == oThis.options.id + '_edit_tr') {
            return;
        }
        $('#' + oThis.options.id + '_content_tbody').find('tr[role="row"]').eq(index).addClass('u-grid-move-bg');
        $('#' + oThis.options.id + '_content_fixed_tbody').find('tr[role="row"]').eq(index).addClass('u-grid-move-bg');
        if (oThis.options.multiSelect) $('#' + oThis.options.id + '_content_multiSelect').find('div').eq(index).addClass('u-grid-move-bg');
        if (oThis.options.showNumCol) $('#' + oThis.options.id + '_content_numCol').find('div').eq(index).addClass('u-grid-move-bg');
        if (typeof oThis.options.onRowHover == 'function' && !$tr.is('.u-grid-content-sum-row')) {
            var obj = {};
            obj.gridObj = oThis;
            obj.rowObj = oThis.dataSourceObj.rows[index];
            obj.rowIndex = index;
            oThis.options.onRowHover(obj);
        }
    }
};
/*
 * 瀹氭椂鍣ㄥ鐞�
 */
var setIntervalFun = function setIntervalFun(e) {
    this.widthChangeFun();
    this.heightChangeFun();
    this.editorRowChangeFun();
};
var editorRowChangeFun = function editorRowChangeFun() {};
/*
 * grid鍖哄煙鍒涘缓瀹屾垚涔嬪悗澶勭悊
 * 1銆佹暟鎹垪鏄剧ず澶勭悊
 * 2銆佸彇琛岄珮
 */
var afterGridDivsCreate = function afterGridDivsCreate() {
    if (this.showType != 'grid') return;
    this.columnsVisibleFun();
    this.resetThVariable();
    this.countRowHeight();
    this.noRowsShowFun();
    this.renderTypeFun();
    this.resetScrollLeft();
    this.hideEditMenu();
    this.resetLeftHeight();
    this.isCheckedHeaderRow();
    this.resetColumnWidthByRealWidth();
    if (typeof this.options.afterCreate == 'function') {
        this.options.afterCreate.call(this);
    }
};
/*
 * 鍙栬楂�
 */
var countRowHeight = function countRowHeight() {
    if ($('#' + this.options.id + '_content_tbody tr')[0]) {
        this.rowHeight = $('#' + this.options.id + '_content_tbody tr')[0].offsetHeight;
    }
};

/**
 * 鏍规嵁鍐呭鍖虹殑楂樺害璋冩暣宸︿晶鍖哄煙鐨勯珮搴�
 */
var resetLeftHeight = function resetLeftHeight() {
    if (!this.options.needResetHeight) {
        return;
    }
    this.resetLeftHeightTimes = 0;
    var self = this;
    if (this.resetLeftHeightSetTimeout) clearTimeout(this.resetLeftHeightSetTimeout);
    this.resetLeftHeightSetTimeout = setTimeout(function () {
        resetLeftHeightFun.call(self);
    }, 100);
};

var resetLeftHeightFun = function resetLeftHeightFun() {
    if (this.options.showNumCol || this.options.multiSelect) {
        var self = this;
        var $trs = $('#' + this.options.id + '_content_tbody tr[role="row"]');
        var $leftNums = $('#' + this.options.id + '_content_numCol div');
        var $leftSelects = $('#' + this.options.id + '_content_multiSelect > div');
        for (var i = 0; i < $trs.length; i++) {
            var nowRowHeight = $trs[i].offsetHeight;
            if (nowRowHeight == 0 && this.resetLeftHeightTimes < 50) {
                this.resetLeftHeightTimes++;
                this.resetLeftHeightSetTimeout = setTimeout(function () {
                    resetLeftHeightFun.call(self);
                }, 100);
            }
            if ($leftNums[i]) {
                $leftNums[i].style.height = nowRowHeight + 'px';
                $leftNums[i].style.lineHeight = nowRowHeight + 'px';
            }

            if ($leftSelects[i]) {
                $leftSelects[i].style.height = nowRowHeight + 'px';
                $leftSelects[i].style.lineHeight = nowRowHeight + 'px';
                $($leftSelects[i]).find('.u-grid-checkbox-outline').css('top', (nowRowHeight - 14) / 2);
            }
        }
    }
    this.resetLeftHeightGroupSumFun();
};
var resetLeftHeightGroupSumFun = function resetLeftHeightGroupSumFun() {};
/*
 * 澶勭悊鏄惁鏄剧ず鏃犳暟鎹
 */
var noRowsShowFun = function noRowsShowFun() {
    if (this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0) {
        $('#' + this.options.id + '_noRowsShow').css('display', 'none');
        $('#' + this.options.id + '_noRows').css('display', 'none');
    } else {
        $('#' + this.options.id + '_noRowsShow').css('display', 'block');
        $('#' + this.options.id + '_noRows').css('display', 'block');
    }
};

/*
 * grid鍖哄煙閲嶇敾瀹屾垚涔嬪悗澶勭悊锛屽凡缁忔墽琛岃繃afterGridDivsCreate
 * 1銆佽缃í鍚戞粴鍔ㄦ潯
 * 2銆侀殣钘忕紪杈戞寜閽�
 */
var afterRepaintGrid = function afterRepaintGrid() {
    this.resetScrollLeft();
    this.hideEditMenu();
};
/*
 * 璁剧疆妯悜婊氬姩鏉�
 */
var resetScrollLeft = function resetScrollLeft() {
    if ($('#' + this.options.id + '_content_div')[0]) {
        try {
            $('#' + this.options.id + '_content_div')[0].scrollLeft = this.scrollLeft;
        } catch (e) {}
    }
};
/*
 * 闅愯棌缂栬緫鎸夐挳
 */
var hideEditMenu = function hideEditMenu() {};

var createCalFunOjb = {
    trHoverFun: trHoverFun,
    setIntervalFun: setIntervalFun,
    editorRowChangeFun: editorRowChangeFun,
    afterGridDivsCreate: afterGridDivsCreate,
    countRowHeight: countRowHeight,
    noRowsShowFun: noRowsShowFun,
    afterRepaintGrid: afterRepaintGrid,
    resetScrollLeft: resetScrollLeft,
    hideEditMenu: hideEditMenu,
    resetLeftHeight: resetLeftHeight,
    resetLeftHeightGroupSumFun: resetLeftHeightGroupSumFun
};

/*
 * 鍒涘缓瀹屾垚涔嬪悗椤跺眰div娣诲姞鐩戝惉
 */
var initEventFun = function initEventFun() {
    var oThis = this;
    $('#' + this.options.id).on('mousedown', function (e) {
        if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
            // 鐐瑰嚮鐨勬槸header鍖哄煙
            oThis.mouseDownX = e.clientX;
            oThis.mouseDownY = e.clientY;
        } else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
            // 鐐瑰嚮鐨勬槸鏁版嵁鍖哄煙
        }
    });
};
/*
 * 鍒涘缓瀹屾垚涔嬪悗grid灞� div娣诲姞鐩戝惉
 */
var initGridEventFun = function initGridEventFun() {
    var oThis = this;
    // 鎷栧姩
    this.initContentDivEventFun();
    // 鍏ㄩ€�
    $('#' + this.options.id + '_header_multi_input').on('click', function (e) {
        if (oThis.hasChecked) {
            oThis.setAllRowUnSelect();
        } else {
            oThis.setAllRowSelect();
        }
    });
};
/*
 * 鍐呭鍖� div娣诲姞鐩戝惉
 */
var initContentDivEventFun = function initContentDivEventFun() {
    var oThis = this;
    // 閫氳繃澶嶉€夋璁剧疆閫変腑琛�
    $('#' + oThis.options.id + '_content .u-grid-content-left').on('click', function (e) {
        var $input = $(e.target).closest('.u-grid-checkbox-outline');
        if ($input.length > 0) {
            var $div = $($input.parent());
            var index = $('.u-grid-content-multiSelect', $div.parent()).index($div);
            if ($input.hasClass('is-checked')) {
                oThis.setRowUnselect(index);
            } else {
                oThis.setRowSelect(index);
            }
        }
    });
    // 鍚屾婊氬姩鏉�
    $('#' + oThis.options.id + '_content_div').on('scroll', function (e) {
        var sumRowH = 0,
            l;
        oThis.scrollLeft = this.scrollLeft;
        oThis.scrollTop = this.scrollTop;
        if (oThis.options.fixedFloat == 'right') {
            l = oThis.leftW - oThis.scrollLeft;
        } else {
            l = oThis.leftW - oThis.scrollLeft + oThis.fixedWidth;
        }
        $('#' + oThis.options.id + '_header_table').css('left', l + "px");
        $('#' + oThis.options.id + '_noScroll_begin_table').css('left', l + "px");
        $('#' + oThis.options.id + '_noScroll_end_table').css('left', l + "px");
        $('#' + oThis.options.id + '_noRowsShow').css('left', oThis.scrollLeft + "px");
        $('#' + oThis.options.id + '_edit_form').css('left', oThis.scrollLeft + "px");
        if (oThis.options.showSumRow && oThis.options.sumRowFirst && !oThis.options.sumRowFixed) {
            sumRowH = 44;
            if (oThis.options.sumRowHeight) sumRowH = oThis.options.sumRowHeight;
        }
        $('#' + oThis.options.id + '_content_multiSelect').css('top', -oThis.scrollTop + sumRowH + "px");
        $('#' + oThis.options.id + '_content_numCol').css('top', -oThis.scrollTop + sumRowH + "px");
        $('#' + oThis.options.id + '_content_fixed_div').css('top', -oThis.scrollTop + "px");
        if (gridBrowser.isIE10 || gridBrowser.isIPAD) {
            //ie10涓嬬ず渚嬬郴缁熶腑鐨勬。妗堣妭鐐规柊澧炴暟鎹箣鍚庡墠涓ゆ鏃犳硶杈撳叆锛屽洜涓烘澶勪細鍏抽棴杈撳叆鎺т欢
        } else {
            oThis.editClose();
        }
    });
    // 鏁版嵁琛岀浉鍏充簨浠�
    $('#' + this.options.id + '_content_tbody').on('click', function (e) {
        // // 鍙屽嚮澶勭悊
        // if (typeof oThis.options.onDblClickFun == 'function') {
        //     oThis.isDblEvent('tbodyClick', oThis.dblClickFun, e, oThis.clickFun, e);
        // } else {
        //     oThis.clickFun(e);
        // }
        if (typeof oThis.options.onDblClickFun == 'function') {
            oThis.clickTimeout = setTimeout(function () {
                oThis.clickFun(e);
            }, 300);
        } else {
            oThis.clickFun(e);
        }
    });

    $('#' + this.options.id + '_content_tbody').dblclick(function (e) {
        if (typeof oThis.options.onDblClickFun == 'function') {
            if (oThis.clickTimeout) clearTimeout(oThis.clickTimeout);
            oThis.dblClickFun(e);
        }
    });
    $('#' + this.options.id + '_content_fixed_tbody').on('click', function (e) {
        // 鍙屽嚮澶勭悊
        // if (typeof oThis.options.onDblClickFun == 'function') {
        //     oThis.isDblEvent('tbodyClick', oThis.dblClickFun, e, oThis.clickFun, e);
        // } else {
        //     oThis.clickFun(e);
        // }
        if (typeof oThis.options.onDblClickFun == 'function') {
            oThis.clickTimeout = setTimeout(function () {
                oThis.clickFun(e);
            }, 300);
        } else {
            oThis.clickFun(e);
        }
    });
    $('#' + this.options.id + '_content_fixed_tbody').dblclick(function (e) {
        if (typeof oThis.options.onDblClickFun == 'function') {
            if (oThis.clickTimeout) clearTimeout(oThis.clickTimeout);
            oThis.dblClickFun(e);
        }
    });
    $('#' + this.options.id + '_content').on('mousemove', function (e) {
        var $tr = $(e.target).closest('tr'),
            $div = $(e.target).closest('div'),
            mousemoveIndex = -1;
        // 棣栧厛娓呴櫎鎵€鏈夌殑鑳屾櫙
        if ($tr.length > 0) {
            mousemoveIndex = $('tr[role="row"]', $tr.parent()).index($tr);
        } else if ($div.length > 0 && ($div.hasClass('u-grid-content-multiSelect') || $div.hasClass('u-grid-content-num'))) {
            //宸︿晶澶嶉€夊強鏁板瓧鍒�
            mousemoveIndex = $('div', $div.parent()).index($div);
        }

        oThis.trHoverFun(mousemoveIndex);
    });
    $('#' + this.options.id + '_content').on('mouseout', function (e) {
        $('#' + oThis.options.id + '_content_tbody').find('tr').removeClass('u-grid-move-bg');
        $('#' + oThis.options.id + '_content_fixed_tbody').find('tr').removeClass('u-grid-move-bg');
        if (oThis.options.multiSelect) $('#' + oThis.options.id + '_content_multiSelect').find('div').removeClass('u-grid-move-bg');
        if (oThis.options.showNumCol) $('#' + oThis.options.id + '_content_numCol').find('div').removeClass('u-grid-move-bg');
        if (typeof oThis.options.onContentOut == 'function') {
            var obj = {};
            obj.gridObj = oThis;
            var $tr = $(e.target).closest('tr');
            if ($tr.length > 0 && !$tr.is('.u-grid-content-sum-row')) {
                var mouseoutIndex = $('tr[role="row"]', $tr.parent()).index($tr);
                obj.rowObj = oThis.dataSourceObj.rows[mouseoutIndex];
                obj.rowIndex = mouseoutIndex;
            }
            oThis.options.onContentOut(obj);
        }
    });
};

var eventFunObj = {
    initEventFun: initEventFun,
    initGridEventFun: initGridEventFun,
    initContentDivEventFun: initContentDivEventFun
};

/*
 * 鑾峰彇鏌愬垪瀵瑰簲灞炴€�
 */
var getColumnAttr = function getColumnAttr(attr, field) {
    for (var i = 0; i < this.gridCompColumnArr.length; i++) {
        if (this.gridCompColumnArr[i].options.field == field) {
            return $(this.gridCompColumnArr[i].options).attr(attr);
        }
    }
    for (var i = 0; i < this.gridCompColumnFixedArr.length; i++) {
        if (this.gridCompColumnFixedArr[i].options.field == field) {
            return $(this.gridCompColumnFixedArr[i].options).attr(attr);
        }
    }
    return "";
};
/*
 * 鏍规嵁field鑾峰彇gridcompColumn瀵硅薄
 */
var getColumnByField = function getColumnByField(field) {
    for (var i = 0; i < this.gridCompColumnArr.length; i++) {
        if (this.gridCompColumnArr[i].options.field == field) {
            return this.gridCompColumnArr[i];
        }
    }
    for (var i = 0; i < this.gridCompColumnFixedArr.length; i++) {
        if (this.gridCompColumnFixedArr[i].options.field == field) {
            return this.gridCompColumnFixedArr[i];
        }
    }

    return null;
};
/*
 * 鑾峰彇column灞炰簬绗嚑鍒�
 */
var getIndexOfColumn = function getIndexOfColumn(column) {
    var index = -1;
    for (var i = 0; i < this.gridCompColumnArr.length; i++) {
        if (this.gridCompColumnArr[i] == column) {
            index = i;
            break;
        }
    }
    return index;
};
/*
 * 鑾峰彇column灞炰簬褰撳墠鏄剧ず绗嚑鍒�
 */
var getVisibleIndexOfColumn = function getVisibleIndexOfColumn(column) {
    var index = -1;
    var j = 0;
    for (var i = 0; i < this.gridCompColumnArr.length; i++) {
        if (this.gridCompColumnArr[i] == column) {
            if (!($('#' + this.options.id + '_header_table').find('th').eq(i).css('display') == 'none')) {
                index = j;
            }
            break;
        }
        if (!($('#' + this.options.id + '_header_table').find('th').eq(i).css('display') == 'none')) {
            j++;
        }
    }
    return index;
};
/*
 * 鑾峰彇column鍚庨潰绗竴涓樉绀哄垪鎵€鍦ㄧ鍑犲垪
 */
var getNextVisibleInidexOfColumn = function getNextVisibleInidexOfColumn(column) {
    var index = -1,
        flag = false,
        j = 0;
    for (var i = 0; i < this.gridCompColumnArr.length; i++) {
        if (this.gridCompColumnArr[i] == column) {
            if (!($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')) {

                j++;
            }
            flag = true;
        }
        if (flag == true && !($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')) {
            index = j;
            break;
        }
        if (!($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')) {

            j++;
        }
    }
    return index;
};

/*
 * 鑾峰彇閫変腑琛�
 */
var getSelectRows = function getSelectRows() {
    return this.selectRows;
};
/*
 * 鑾峰彇閫変腑琛屽搴旇鍙�
 */
var getSelectRowsIndex = function getSelectRowsIndex() {
    return this.selectRowsIndex;
};

/*
 * 鑾峰彇focus琛�
 */
var getFocusRow = function getFocusRow() {
    return this.focusRow;
};
/*
 * 鑾峰彇focus琛屽搴旇鍙�
 */
var getFocusRowIndex = function getFocusRowIndex() {
    return this.focusRowIndex;
};
/*
 * 鑾峰彇鎵€鏈夎
 */
var getAllRows = function getAllRows() {
    var oThis = this;
    this.allRows = new Array();
    if (this.dataSourceObj.rows) {
        $.each(this.dataSourceObj.rows, function () {
            oThis.allRows.push(this.value);
        });
    }
    return this.allRows;
};
/*
 * 鏍规嵁琛屽彿鑾峰彇row
 */
var getRowByIndex = function getRowByIndex(index) {
    return this.dataSourceObj.rows[index];
};
/*
 * 鏍规嵁鏌愪釜瀛楁鍊艰幏鍙杛owIndex
 */
var getRowIndexByValue = function getRowIndexByValue(field, value) {
    var index = -1;
    $.each(this.dataSourceObj.rows, function (i) {
        // var v = $(this.value).attr(field);
        var v = this.value[field];
        if (v == value) {
            index = i;
        }
    });
    return index;
};

var getChildRowIndex = function getChildRowIndex(row) {
    var result = [];
    $.each(row.childRow, function () {
        result.push(this.valueIndex);
    });
    return result;
};

var getColumnByVisibleIndex = function getColumnByVisibleIndex(index) {
    var nowIndex = -1;
    for (var i = 0; i < this.gridCompColumnArr.length; i++) {
        var column = this.gridCompColumnArr[i];
        if (!($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')) {
            nowIndex++;
        }
        if (nowIndex == index) {
            return column;
        }
    }
    return null;
};

var getAllVisibleColumns = function getAllVisibleColumns() {
    var index = -1;
    var j = 0;
    var allVisibleColumns = [];
    for (var i = 0; i < this.gridCompColumnArr.length; i++) {
        if (!($('#' + this.options.id + '_header').find('th').eq(i).css('display') == 'none')) {
            allVisibleColumns.push(this.gridCompColumnArr[i]);
        }
    }
    return allVisibleColumns;
};

var getFunObj = {
    getColumnAttr: getColumnAttr,
    getColumnByField: getColumnByField,
    getIndexOfColumn: getIndexOfColumn,
    getVisibleIndexOfColumn: getVisibleIndexOfColumn,
    getNextVisibleInidexOfColumn: getNextVisibleInidexOfColumn,
    getSelectRows: getSelectRows,
    getSelectRowsIndex: getSelectRowsIndex,
    getFocusRow: getFocusRow,
    getFocusRowIndex: getFocusRowIndex,
    getAllRows: getAllRows,
    getRowByIndex: getRowByIndex,
    getRowIndexByValue: getRowIndexByValue,
    getChildRowIndex: getChildRowIndex,
    getColumnByVisibleIndex: getColumnByVisibleIndex,
    getAllVisibleColumns: getAllVisibleColumns
};

/*
 * 澶勭悊鍙傛暟
 */
var init$2 = function init(ele, options) {
    this.dataSource = dataSource;
    this.gridCompColumn = column;
    this.ele = ele[0];
    this.$ele = ele;
    this.initDefault();
    this.options = $.extend({}, this.defaults, options);
    this.getBooleanOptions();
    this.transDefault = {
        ml_show_column: '鏄剧ず/闅愯棌鍒�',
        ml_clear_set: '娓呴櫎璁剧疆',
        ml_no_rows: '鏃犳暟鎹�',
        ml_sum: '鍚堣:',
        ml_group_sum: '灏忚:',
        ml_close: '鍏抽棴'
    };
    this.transMap = $.extend({}, this.transDefault, options.transMap);
    this.gridCompColumnFixedArr = new Array();
    this.gridCompColumnArr = new Array(); // 瀛樺偍璁剧疆榛樿鍊间箣鍚庣殑columns瀵硅薄
    // this.headerHeight = 45; // header鍖哄煙楂樺害
    this.countContentHeight = true; // 鏄惁璁＄畻鍐呭鍖虹殑楂樺害锛堟槸鍚︿负娴佸紡锛�
    this.minColumnWidth = 80; // 鏈€灏忓垪瀹�
    this.scrollBarHeight = 16; // 婊氬姩鏉￠珮搴�
    this.numWidth = this.options.numWidth || 40; // 鏁板瓧鍒楀搴�
    this.multiSelectWidth = this.options.multiSelectWidth || 40; // 澶嶉€夋鍒楀搴�

    this.basicGridCompColumnArr = new Array(); // 瀛樺偍鍩烘湰鐨刢olumns瀵硅薄锛岀敤浜庢竻闄よ缃�
    this.columnMenuWidth = 160; // column menu鐨勫搴�
    this.columnMenuHeight = 33; // column menu鐨勯珮搴�
    this.gridCompColumnFixedArr = new Array(); // 瀛樺偍璁剧疆榛樿鍊间箣鍚庣殑鍥哄畾鍒梒olumns瀵硅薄
    this.gridCompLevelColumn = new Array(); // 瀛樺偍澶氱骇琛ㄥご鏃剁殑澶氱骇
    this.baseHeaderHeight = this.options.headerHeight || 44;
    this.headerHeight = this.baseHeaderHeight * parseInt(this.options.maxHeaderLevel) + 1;
    this.gridCompHiddenLevelColumnArr = new Array(); // 瀛樺偍鑷姩闅愯棌鏃堕殣钘忎紭鍏堢骇鎺掑簭鍚庣殑column
    this.treeLeft = 10; // 鏍戣〃鏃舵瘡涓€绾т箣闂寸殑宸€�
    this.overWidthVisibleColumnArr = new Array(); // 瓒呭嚭瀹氫箟瀹藉害鐨刢olumn闆嗗悎
};
var getBooleanOptions$1 = function getBooleanOptions() {
    this.options.cancelFocus = this.getBoolean(this.options.cancelFocus);
    this.options.showHeader = this.getBoolean(this.options.showHeader);
    this.options.showNumCol = this.getBoolean(this.options.showNumCol);
    this.options.multiSelect = this.getBoolean(this.options.multiSelect);
    this.options.columnMenu = this.getBoolean(this.options.columnMenu);
    this.options.canDrag = this.getBoolean(this.options.canDrag);
    this.options.overWidthHiddenColumn = this.getBoolean(this.options.overWidthHiddenColumn);
    this.options.sortable = this.getBoolean(this.options.sortable);
    this.options.showSumRow = this.getBoolean(this.options.showSumRow);
    this.options.sumRowFirst = this.getBoolean(this.options.sumRowFirst);
    this.options.canSwap = this.getBoolean(this.options.canSwap);
    this.options.showTree = this.getBoolean(this.options.showTree);
    this.options.autoExpand = this.getBoolean(this.options.autoExpand);
    this.options.needTreeSort = this.getBoolean(this.options.needTreeSort);
    this.options.needLocalStorage = this.getBoolean(this.options.needLocalStorage);
    this.options.noScroll = this.getBoolean(this.options.noScroll);
    this.options.cancelSelect = this.getBoolean(this.options.cancelSelect);
    this.options.contentSelect = this.getBoolean(this.options.contentSelect);
    this.options.contentFocus = this.getBoolean(this.options.contentFocus);
    this.options.needResetHeight = this.getBoolean(this.options.needResetHeight);
    this.options.treeAsync = this.getBoolean(this.options.treeAsync);
    this.options.heightAuto = this.getBoolean(this.options.heightAuto);
};
/*
 * 鍒濆鍖栭粯璁ゅ弬鏁�
 */
var initDefault$1 = function initDefault() {
    this.defaults = {
        id: new Date().valueOf(),
        editType: 'default',
        cancelFocus: true, // 绗簩娆＄偣鍑绘槸鍚﹀彇娑坒ocus
        cancelSelect: true, // 绗簩娆＄偣鍑绘槸鍚﹀彇娑坰elect
        showHeader: true, // 鏄惁鏄剧ず琛ㄥご
        showNumCol: false, // 鏄惁鏄剧ず鏁板瓧鍒�
        multiSelect: false, // 鏄惁鏄剧ず澶嶉€夋
        columnMenu: true, // 鏄惁瀛樺湪鍒楀ご鎿嶄綔鎸夐挳
        canDrag: true, // 鏄惁鍙互鎷栧姩
        // formMaxWidth: 300, // 鏁翠綋瀹藉害灏忎簬鏌愪竴鍊间箣鍚庝互form灞曠ず
        formMaxWidth: 0,
        maxHeaderLevel: 1, // header鐨勬渶楂樺眰绾э紝鐢ㄤ簬璁＄畻header鍖哄煙鐨勯珮搴�
        overWidthHiddenColumn: false, // 瀹藉害涓嶈冻鏃舵槸鍚﹁嚜鍔ㄩ殣钘廲olumn
        sortable: true, // 鏄惁鍙互鎺掑簭
        showSumRow: false, // 鏄惁鏄剧ず鍚堣琛�
        sumRowFirst: false, // 鍚堣琛屾槸鍚︽樉绀哄湪绗竴琛岋紝true琛ㄧず鏄剧ず鍦ㄧ涓€琛岋紝false琛ㄧず鏄剧ず鍦ㄦ渶鍚庝竴琛�
        sumRowFixed: false, //鍚堣琛屾槸鍚﹀浐瀹氬湪澶撮儴锛屼笉闅忔粴鍔ㄦ潯婊氬姩
        canSwap: true, // 鏄惁鍙互浜ゆ崲鍒椾綅缃�
        showTree: false, // 鏄惁鏄剧ず鏍戣〃
        autoExpand: true, // 鏄惁榛樿灞曞紑
        needTreeSort: false, // 鏄惁闇€瑕佸浼犲叆鏁版嵁杩涜鎺掑簭锛屾璁剧疆涓轰紭鍖栨€ц兘锛屽鏋滀紶鍏ユ暟鎹槸鏃犲簭鐨勫垯璁剧疆涓簍rue锛屽鏋滃彲浠ヤ繚璇佸厛浼犲叆鐖惰妭鐐瑰悗浼犲叆瀛愯妭鐐瑰垯璁剧疆涓篺alse鎻愰珮鎬ц兘
        needLocalStorage: false, // 鏄惁浣跨敤鍓嶇缂撳瓨
        noScroll: false, // 鏄惁鏄剧ず婊氬姩鏉�,瀹藉害璁剧疆鐧惧垎姣旂殑璇濅笉鏄剧ず婊氬姩鏉�
        contentSelect: true, // 鐐瑰嚮鍐呭鍖烘槸鍚︽墽琛岄€変腑閫昏緫
        showEditIcon: false, // 鏄惁鏄剧ず缂栬緫鍥炬爣
        contentFocus: true, // 鐐瑰嚮鍐呭鍖烘槸鍚︽墽琛宖ocus閫昏緫
        fixedFloat: 'left',
        groupField: '', // 鏄惁鎸夌収鏌愬瓧娈佃繘琛屽垎缁勬樉绀�
        groupSumRow: false, //鏄惁鏄剧ず鍒嗙粍灏忚
        rowHeight: 44, // 琛岄珮
        columnMenuType: 'base', // border琛ㄧず瀛樺湪杈圭嚎
        needResetHeight: false, // 鏄惁闇€瑕佹牴鎹彸渚у唴瀹归珮搴﹁皟鏁村乏渚ч珮搴︼紝鐩墠涓篺alse锛屽悗缁彁渚涙柟妗堜箣鍚庡啀澶勭悊姝ゅ弬鏁�
        treeAsync: false, //鏍戣〃寮傛鍔犺浇鏁版嵁
        heightAuto: false, // 鍐呭鑷姩鎾戦珮
        expandColumnIndex: 0
        // sumRowHeight 鍚堣琛岃楂�
        // headerHeight 琛ㄥご楂�
        // maxHeight heightAuto涓簍rue鏃剁殑鏈€澶ч珮搴�
    };
};
/*
 * 鍒涘缓grid
 */
var initGrid = function initGrid() {
    if (!this.options.columns || this.options.columns.length == 0) {
        return;
    }
    var oThis = this;
    this.initOptions();
    this.initVariable();
    this.initWidthVariable();
    this.initGridCompColumn();
    this.initDataSource();
    this.createDivs();
    // UAP-NC 杞婚噺鍖栭」鐩細鍒囨崲tab鏃舵坊鍔爁orm浼氭秷澶遍棶棰�
    this.inte = setInterval(function () {
        oThis.setIntervalFun.call(oThis);
    }, 300);
};
/*
 * 閿€姣佽嚜韬�
 */
var destroySelf = function destroySelf() {
    clearInterval(this.inte);
    this.$ele.data('gridComp', null);
    this.ele.innerHTML = '';
    this.showTree = '';
    this.showType = '';
};
/*
 * 瀵逛紶鍏ュ弬鏁拌繘琛屾牸寮忓寲澶勭悊
 * 瀹藉害銆侀珮搴﹀鐞�
 * 宸︿晶鍖哄煙瀹藉害璁＄畻
 * 闄ゅ幓鍐呭鍖哄煙鐨勯珮搴�
 */
var initOptions = function initOptions() {
    this.options.width = this.formatWidth(this.options.width);
    this.options.height = this.formatWidth(this.options.height);
    this.options.rowHeight = parseInt(this.options.rowHeight);
    if (this.options.height == '100%' || !this.options.height) {
        this.countContentHeight = false;
    }
    this.initOptionsTree();
    this.leftW = 0; // 宸︿晶鍖哄煙瀹藉害锛堟暟瀛楀垪澶嶉€夋绛夛級
    if (this.options.showNumCol) {
        this.leftW += this.numWidth;
    }
    if (this.options.multiSelect) {
        this.leftW += this.multiSelectWidth;
    }
    this.exceptContentHeight = 0; // 鍐呭鍖哄煙涔嬪鐨勯珮搴�
    this.noScrollHeight = 0;
    if (this.options.showHeader) {
        this.exceptContentHeight += this.headerHeight;
    }

    this.fixedWidth = 0;
    if (this.options.maxHeaderLevel > 1) {
        this.options.canSwap = false;
        this.options.canDrag = false;
        this.options.columnMenu = false;
    }
    if (this.options.rowHeight && !this.options.sumRowHeight) {
        this.options.sumRowHeight = this.options.rowHeight;
    }
    if (this.options.sumRowFixed) {
        this.noScrollHeight += this.options.sumRowHeight;
        this.exceptContentHeight += this.options.sumRowHeight;
        // if (!this.options.sumRowFirst) {
        this.exceptContentHeight += 1;
        // }
    }
    if (this.options.heightAuto) {
        this.options.needResetHeight = true;
    } else {
        this.options.maxHeight = 0;
    }

    // 鑾峰彇缂撳瓨id
    var url = window.location.href;
    var index = url.indexOf('?');
    if (index > 0) {
        url = url.substring(0, index);
    }
    this.localStorageId = this.options.id + url;
};
var initOptionsTree = function initOptionsTree() {};
/*
 * 鍒濆鍖栧彉閲�
 */
var initVariable = function initVariable() {
    this.initDataSourceVariable();
    // 榧犳爣鐐瑰嚮绉诲姩鏃朵綅缃褰�
    this.mouseUpX = 'mouseUpX';
    this.mouseUpY = 'mouseUpY';
    this.mouseDownX = 'mouseDownX';
    this.mouseDownY = 'mouseDownY';
    this.mouseMoveX = 'mouseMoveX';
    this.mouseMoveY = 'mouseMoveY';
    this.scrollLeft = 0; // 璁板綍妯悜婊氬姩鏉�
    this.scrollTop = 0; // 璁板綍绾靛悜婊氬姩鏉�
    this.showType = ''; // 璁板綍grid鏄剧ず鏂瑰紡锛宖orm鍜実rid
    this.createGridFlag = false; // 鏄惁宸茬粡鍒涘缓grid灞曠ず
    this.columnClickX = 0; // 鐐瑰嚮澶勭殑X鍧愭爣
    this.columnClickY = 0; // 鐐瑰嚮澶勭殑Y鍧愭爣
    this.columnMenuMove = false; // 鏄惁鍦╟olumn menu鍖哄煙绉诲姩
    this.firstColumn = true; // 鐢ㄤ簬璁板綍鏄惁宸茬粡瀛樺湪绗竴鍒楋紝true琛ㄧず杩樻病鏈夛紝false琛ㄧず宸茬粡瀛樺湪
    this.lastVisibleColumn = null;
    this.lastVisibleColumnWidth = 0;
    this.columnMenuMove = false; // 鏄惁鍦╟olumn menu鍖哄煙绉诲姩
    this.createColumnMenuFlag = false; // 鏄惁宸茬粡鍒涘缓column menu 鍖哄煙
    this.menuColumnsHeight = 0;
    this.createFormFlag = false; // 鏄惁宸茬粡鍒涘缓form灞曠ず
    this.$sd_storageData = null; // 鏈湴缂撳瓨鍐呭涓簅bject
};
/*
 * 鍒濆鍖杁atasource鐩稿叧鍙橀噺
 */
var initDataSourceVariable = function initDataSourceVariable() {
    this.selectRows = new Array();
    this.selectRowsObj = new Array();
    this.selectRowsIndex = new Array();
    this.allRows = new Array();
    this.eidtRowIndex = -1; // 褰撳墠淇敼琛�
};

// 鍒濆鍖栧搴︾浉鍏冲彉閲�
var initWidthVariable = function initWidthVariable() {
    // 璁＄畻鐢ㄥ彉閲�
    this.wholeWidth = 0; // 鏁翠綋瀹藉害
    this.wholeHeight = 0; // 鏁翠綋楂樺害
    this.rowHeight = 0; // 鏁版嵁琛岄珮搴�
    this.contentRealWidth = 0; // 鍐呭鍖虹湡瀹炲搴�,涓ユ牸鎸夌収璁剧疆鐨剋idth璁＄畻鐨勫搴�
    this.contentWidth = 0; // 鍐呭鍖哄搴︼紝鑷姩鎵╁睍涔嬪悗鐨勫搴�
    this.contentMinWidth = 0; // 鍐呭鍖烘渶灏忓搴�,鍗冲彲瑙嗗搴�
    this.contentHeight = 0; //鍐呭鍖洪珮搴�
    this.fixedRealWidth = 0; // 鍥哄畾鍖哄煙鐪熷疄瀹藉害
    this.fixedWidth = 0; // 鍥哄畾鍖哄煙瀹藉害
};
/*
 * 鍒涘缓gridCompColumn瀵硅薄鏂逛究鍚庣画澶勭悊
 */
var initGridCompColumn = function initGridCompColumn() {
    var oThis = this;
    this.initGridCompColumnVar();
    if (this.options.columns) {
        $.each(this.options.columns, function (i) {
            oThis.initGridCompColumnFun(this);
        });
    }
    this.initGridCompColumnLoacl();
    this.initGridHiddenLevelColumn();
    this.initGridCompFixedColumn();
    this.columnsVisibleFun();
};
var initGridCompColumnVar = function initGridCompColumnVar() {
    this.gridCompColumnArr = new Array();
    this.basicGridCompColumnArr = new Array();
    this.gridCompColumnFixedArr = new Array();
    this.gridCompLevelColumn = new Array();
    this.gridCompHiddenLevelColumnArr = new Array();
};
var initGridCompColumnFun = function initGridCompColumnFun(columnOptions) {
    var column$$1 = new column(columnOptions, this);
    // 濡傛灉鍙紪杈戝鍔犱慨鏀瑰浘鏍�
    this.editHeadTitleIcon(column$$1);
    var widthStr = column$$1.options.width + '';
    if (widthStr.indexOf("%") > 0) {
        this.options.noScroll = 'true';
    } else {
        column$$1.options.width = parseInt(column$$1.options.width);
    }
    column$$1.options.optionsWidth = column$$1.options.width;
    column$$1.options.realWidth = column$$1.options.width;
    this.gridCompColumnArr.push(column$$1);
    this.initGridCompColumnColumnMenuFun(columnOptions);
    this.initGridCompColumnHeaderLevelFun(columnOptions);
};
var initGridCompColumnColumnMenuFun = function initGridCompColumnColumnMenuFun(columnOptions) {};
var initGridCompColumnHeaderLevelFun = function initGridCompColumnHeaderLevelFun(columnOptions) {};
var initGridCompColumnLoacl = function initGridCompColumnLoacl(columnOptions) {};
var initGridHiddenLevelColumn = function initGridHiddenLevelColumn() {};
var initGridCompFixedColumn = function initGridCompFixedColumn() {};
/*
 * 璁剧疆鏌愬垪鏄惁蹇呰緭
 */
var setRequired = function setRequired(field, value) {};
/*
 * 鍒涘缓dataSource瀵硅薄鏂逛究鍚庣画澶勭悊
 */
var initDataSource = function initDataSource() {
    var oThis = this;
    this.dataSourceObj = new dataSource(this.options.dataSource, this);
};
var initFunObj$2 = {
    init: init$2,
    getBooleanOptions: getBooleanOptions$1,
    initDefault: initDefault$1,
    initGrid: initGrid,
    destroySelf: destroySelf,
    initOptions: initOptions,
    initOptionsTree: initOptionsTree,
    initVariable: initVariable,
    initDataSourceVariable: initDataSourceVariable,
    initWidthVariable: initWidthVariable,
    initGridCompColumn: initGridCompColumn,
    initGridCompColumnVar: initGridCompColumnVar,
    initGridCompColumnFun: initGridCompColumnFun,
    initGridCompColumnColumnMenuFun: initGridCompColumnColumnMenuFun,
    initGridCompColumnHeaderLevelFun: initGridCompColumnHeaderLevelFun,
    initGridCompColumnLoacl: initGridCompColumnLoacl,
    initGridHiddenLevelColumn: initGridHiddenLevelColumn,
    initGridCompFixedColumn: initGridCompFixedColumn,
    setRequired: setRequired,
    initDataSource: initDataSource
};

/*
    閲嶆柊缁撶畻鏄惁閫変腑header绗竴琛�
 */

var isCheckedHeaderRow = function isCheckedHeaderRow() {
    if (this.selectRows.length !== 0 && this.selectRows.length == this.dataSourceObj.rows.length) {
        //淇敼鍏ㄩ€夋爣璁颁负false
        $('#' + this.options.id + '_header_multi_input').addClass('is-checked');
        this.hasChecked = true;
    } else {
        $('#' + this.options.id + '_header_multi_input').removeClass('is-checked');
        this.hasChecked = false;
    }
};
/*
 * 娣诲姞涓€琛�
 */
var addOneRow = function addOneRow(row, index) {

    if (typeof this.options.filterDataFun == 'function') {
        var rows = this.options.filterDataFun.call(this, [row]);
        row = rows[0];
    }
    row = this.getGridRow(row);
    var oThis = this,
        displayFlag = 'none',
        rowObj = {},
        parentIndex,
        parentChildLength = 0,
        l = this.dataSourceObj.rows.length,
        endFlag = false;
    rowObj.value = row, displayFlag;
    if (this.options.showTree) {
        var treeObj = this.addOneRowTree(row, index, rowObj);
        index = treeObj.index;
        displayFlag = treeObj.displayFlag;
    }

    if (this.options.groupField) {
        index = this.getGroupIndex(row, index, rowObj);
    }

    if (index != 0) {
        if (index && index > 0) {
            if (l < index) index = l;
        } else {
            index = 0;
        }
    }
    if (l == index) {
        endFlag = true;
    }
    rowObj.valueIndex = index;
    rowObj.value = row;
    this.dataSourceObj.rows.splice(index, 0, rowObj);
    // 濡傛灉鏄湪涓棿鎻掑叆闇€瑕佸皢鍚庣画鐨剉alueIndex + 1锛�
    if (this.dataSourceObj.rows.length > index + 1) {
        $.each(this.dataSourceObj.rows, function (i) {
            if (i > index) {
                this.valueIndex = this.valueIndex + 1;
            }
        });
    }

    // 闇€瑕侀噸鏂版帓搴忛噸缃彉閲�
    var l = 0;
    if (this.options.showTree) {
        if (this.dataSourceObj.options.values) {
            l = this.dataSourceObj.options.values.length;
        } else {
            this.dataSourceObj.options.values = new Array();
        }
        this.dataSourceObj.options.values.splice(index, 0, row);
        this.addOneRowTreeHasChildF(rowObj);
    } else {
        if (this.dataSourceObj.options.values) {} else {
            this.dataSourceObj.options.values = new Array();
        }
        this.dataSourceObj.options.values.splice(index, 0, row);
    }

    if (this.showType == 'grid' && !this.hasChildF) {
        //鍙湁grid灞曠ず鐨勬椂鍊欐墠澶勭悊div锛岄拡瀵归殣钘忔儏鍐典笅杩樿娣诲姞鏁版嵁
        this.editClose();
        this.updateEditRowIndex('+', index);
        try {
            var htmlStr = this.createContentOneRow(rowObj, 'normal', displayFlag);
            if (endFlag) {
                $('#' + this.options.id + '_content_tbody')[0].insertAdjacentHTML('beforeEnd', htmlStr);
            } else {
                var $$tr = $('#' + this.options.id + '_content_tbody').find('tr[role="row"]')[index - 1];
                var $$tbody = $('#' + this.options.id + '_content_tbody')[0];
                if ($$tr) $$tr.insertAdjacentHTML('afterEnd', htmlStr);else if ($$tbody) $$tbody.insertAdjacentHTML('afterBegin', htmlStr);
            }
            if ($('#' + this.options.id + '_content_fixed_div').length > 0) {
                var htmlStr = this.createContentOneRow(rowObj, 'fixed', displayFlag);
                if (endFlag) {
                    $('#' + this.options.id + '_content_fixed_tbody')[0].insertAdjacentHTML('beforeEnd', htmlStr);
                } else {
                    var $$tr = $('#' + this.options.id + '_content_fixed_tbody').find('tr[role="row"]')[index - 1];
                    if ($$tr) $$tr.insertAdjacentHTML('afterEnd', htmlStr);else if ($('#' + this.options.id + '_content_fixed_tbody')[0]) $('#' + this.options.id + '_content_fixed_tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
                }
            }
        } catch (e) {
            //IE鎯呭喌涓�
            var table = $('#' + this.options.id + '_content_div table')[0];
            if (table) this.createContentOneRowForIE(table, index, rowObj, 'normal', displayFlag);
            var fixedTable = $('#' + this.options.id + '_content_fixed_div table')[0];
            if (fixedTable) this.createContentOneRowForIE(fixedTable, index, rowObj, 'fixed', displayFlag);
        }
        if (this.options.multiSelect) {
            var htmlStr = this.createContentLeftMultiSelectRow(rowObj, displayFlag);
            if (endFlag) {
                $('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('beforeEnd', htmlStr);
            } else {
                var $$div = $('#' + this.options.id + '_content_multiSelect').find('div')[index - 1];
                if ($$div) $$div.insertAdjacentHTML('afterEnd', htmlStr);else $('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('afterBegin', htmlStr);
            }
            if (this.options.sumRowFirst && !this.options.sumRowFixed && this.dataSourceObj.rows.length > 0) $('#' + this.options.id + '_content_multiSelect').addClass('u-grid-content-left-sum-first');
        }
        if (this.options.showNumCol) {
            var htmlStr = this.createContentLeftNumColRow(index, row);
            if (endFlag) {
                $('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('beforeEnd', htmlStr);
            } else {
                var $$div = $('#' + this.options.id + '_content_numCol').find('div')[index - 1];
                if ($$div) $$div.insertAdjacentHTML('afterEnd', htmlStr);else $('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('afterBegin', htmlStr);
            }
            if (this.options.sumRowFirst && !this.options.sumRowFixed && this.dataSourceObj.rows.length > 0) $('#' + this.options.id + '_content_numCol').addClass('u-grid-content-left-sum-first');
            this.resetNumCol();
            this.updateNumColLastRowFlag();
        }
        this.repairSumRow();
        this.repairGroupSumRow(rowObj);
        this.noRowsShowFun();
        this.updateLastRowFlag();
        this.resetLeftHeight();
        if (this.dataSourceObj.rows.length > 0) {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "block");
        } else {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "none");
        }
        var obj = {};
        obj.begin = index;
        obj.length = 1;
        this.renderTypeFun(obj);
        if (this.options.groupField) {
            var groupValue = row[this.options.groupField];
            this.resetGroupFieldTd(groupValue);
        }
    }
};

var resetGroupFieldTd = function resetGroupFieldTd() {};

var repairGroupSumRow = function repairGroupSumRow() {};
var addOneRowTree = function addOneRowTree(row, index) {
    return index;
};

var getGroupIndex = function getGroupIndex(row, index) {
    return index;
};
var addOneRowTreeHasChildF = function addOneRowTreeHasChildF() {};
var editClose = function editClose() {};
/*
 * 娣诲姞澶氳
 */
var addRows = function addRows(rows, index) {

    if (!(this.$ele.data('gridComp') == this)) return;
    if (this.options.showTree || this.options.groupField) {
        // 鏍戣〃寰呬紭鍖�
        var l = rows.length;
        for (var i = 0; i < l; i++) {
            this.addOneRow(rows[i], l);
        }
        return;
    }
    if (typeof this.options.filterDataFun == 'function') {
        rows = this.options.filterDataFun.call(this, rows);
    }

    this.editClose();
    var htmlStr = '',
        htmlStrmultiSelect = '',
        htmlStrNumCol = '',
        htmlStrFixed = '',
        oThis = this,
        l = this.dataSourceObj.rows.length,
        endFlag = false;
    var newRows = [];
    $.each(rows, function () {
        newRows.push(oThis.getGridRow(this));
    });
    rows = newRows;
    if (index != 0) {
        if (index && index > 0) {
            if (l < index) index = l;
        } else {
            index = 0;
        }
    }
    if (l == index) {
        endFlag = true;
    }
    var rowObjArr = new Array();
    $.each(rows, function (i) {
        var rowObj = {};
        rowObj.value = this;
        rowObj.valueIndex = index + i;
        rowObjArr.push(rowObj);
        oThis.dataSourceObj.rows.splice(index + i, 0, rowObj);
        oThis.updateEditRowIndex('+', index + i);
    });

    if (this.dataSourceObj.options.values) {} else {
        this.dataSourceObj.options.values = new Array();
    }
    $.each(rows, function (i) {
        oThis.dataSourceObj.options.values.splice(index + i, 0, this);
    });

    // 濡傛灉鏄湪涓棿鎻掑叆闇€瑕佸皢鍚庣画鐨剉alueIndex + 1锛�
    if (this.dataSourceObj.rows.length > index + rows.length) {
        $.each(this.dataSourceObj.rows, function (i) {
            if (i > index + rows.length - 1) {
                this.valueIndex = this.valueIndex + rows.length;
            }
        });
    }
    if (this.showType == 'grid' && $('#' + this.options.id + '_content_div tbody')[0]) {
        //鍙湁grid灞曠ず鐨勬椂鍊欐墠澶勭悊div锛岄拡瀵归殣钘忔儏鍐典笅杩樿娣诲姞鏁版嵁 //lyk--闇€瑕佸畬鍠勯殣钘忎箣鍚庡啀鏄剧ず鍚屼簨娣诲姞鏁版嵁鎿嶄綔
        $.each(rowObjArr, function (i, row) {
            htmlStr += oThis.createContentOneRow(this);
            htmlStrFixed += oThis.createContentOneRowFixed(this);
            if (oThis.options.multiSelect) {
                htmlStrmultiSelect += oThis.createContentLeftMultiSelectRow(this);
            }
            if (oThis.options.showNumCol) {
                htmlStrNumCol += oThis.createContentLeftNumColRow(l + i, row.value);
            }
        });
        try {
            if (endFlag) {
                $('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('beforeEnd', htmlStr);
            } else {
                if ($('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]')[index]) $('#' + this.options.id + '_content_div').find('tbody').find('tr[role="row"]')[index].insertAdjacentHTML('beforeBegin', htmlStr);else if ($('#' + this.options.id + '_content_div tbody')[0]) $('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
            }
            if (endFlag) {
                $('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('beforeEnd', htmlStrFixed);
            } else {
                if ($('#' + this.options.id + '_content_fixed_div').find('tbody').find('tr[role="row"]')[index]) $('#' + this.options.id + '_content_fixed_div').find('tbody').find('tr[role="row"]')[index].insertAdjacentHTML('beforeBegin', htmlStrFixed);else if ($('#' + this.options.id + '_content_fixed_div tbody')[0]) $('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('afterBegin', htmlStrFixed);
            }
        } catch (e) {
            //IE鎯呭喌涓�
            var table = $('#' + this.options.id + '_content_div table')[0];
            var fixedTable = $('#' + this.options.id + '_content_fixed_div table')[0];
            if (table && fixedTable) {
                $.each(rowObjArr, function (i) {
                    oThis.createContentOneRowForIE(table, index + i, this);
                    oThis.createContentOneRowForIE(fixedTable, index + i, this, 'fixed');
                });
            }
        }
        if (this.options.multiSelect) {
            if (endFlag) {
                $('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('beforeEnd', htmlStrmultiSelect);
            } else {
                var _content_multiSelect = $('#' + this.options.id + '_content_multiSelect').find('div')[index];
                if (_content_multiSelect) _content_multiSelect.insertAdjacentHTML('beforeBegin', htmlStrmultiSelect);else $('#' + this.options.id + '_content_multiSelect')[0].insertAdjacentHTML('afterBegin', htmlStrmultiSelect);
            }
            if (this.options.sumRowFirst && !this.options.sumRowFixed && this.dataSourceObj.rows.length > 0) $('#' + this.options.id + '_content_multiSelect').addClass('u-grid-content-left-sum-first');
        }
        if (this.options.showNumCol) {
            if (endFlag) {
                $('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('beforeEnd', htmlStrNumCol);
            } else {
                var _content_multiSelect = $('#' + this.options.id + '_content_numCol').find('div')[index];
                if (_content_multiSelect) _content_multiSelect.insertAdjacentHTML('beforeBegin', htmlStrNumCol);else $('#' + this.options.id + '_content_numCol')[0].insertAdjacentHTML('afterBegin', htmlStrNumCol);
            }
            if (this.options.sumRowFirst && !this.options.sumRowFixed && this.dataSourceObj.rows.length > 0) $('#' + this.options.id + '_content_numCol').addClass('u-grid-content-left-sum-first');
            this.resetNumCol();
            this.updateNumColLastRowFlag();
        }
        this.repairSumRow();
        if (this.dataSourceObj.rows.length > 0) {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "block");
        } else {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "none");
        }
        this.noRowsShowFun();
        var obj = {};
        obj.begin = index;
        obj.length = rows.length;
        this.renderTypeFun(obj);
    }

    this.updateLastRowFlag();
    this.isCheckedHeaderRow();
    this.resetLeftHeight();
};
var createContentOneRowFixed = function createContentOneRowFixed(rowObj) {
    return '';
};
var updateEditRowIndex = function updateEditRowIndex(opType, opIndex, num) {};
/*
 * 鍒犻櫎涓€琛�
 */
var deleteOneRow = function deleteOneRow(index) {
    var oThis = this;
    index = parseInt(index);
    var row = this.dataSourceObj.rows[index];
    if (!row) return;
    var rowValue = row.value;

    if (this.showType == 'grid' && this.eidtRowIndex != index) {
        //鍙湁grid灞曠ず鐨勬椂鍊欐墠澶勭悊div锛岄拡瀵归殣钘忔儏鍐典笅杩樿娣诲姞鏁版嵁
        this.editClose();
    }
    this.dataSourceObj.rows.splice(index, 1);
    this.updateEditRowIndex('-', index);
    if (this.dataSourceObj.options.values) {
        var i = this.dataSourceObj.options.values.indexOf(rowValue);
        this.dataSourceObj.options.values.splice(i, 1);
    }
    // 濡傛灉鏄湪涓棿鎻掑叆闇€瑕佸皢鍚庣画鐨剉alueIndex - 1锛�
    if (this.dataSourceObj.rows.length > index + 1) {
        $.each(this.dataSourceObj.rows, function (i) {
            if (i >= index) {
                this.valueIndex = this.valueIndex - 1;
            }
        });
    }
    if (this.selectRows) {
        $.each(this.selectRows, function (i) {
            if (this == rowValue) {
                oThis.selectRows.splice(i, 1);
                oThis.selectRowsObj.splice(i, 1);
                oThis.selectRowsIndex.splice(i, 1);
            } else if (oThis.selectRowsIndex[i] > index) {
                oThis.selectRowsIndex[i] = oThis.selectRowsIndex[i] - 1;
            }
        });
    }
    if (this.focusRow) {
        if (this.focusRow == rowValue) {
            this.focusRow = null;
            this.focusRowObj = null;
            this.focusRowIndex = null;
        } else if (this.focusRowIndex > index) {
            this.focusRowIndex = this.focusRowIndex - 1;
        }
    }
    this.deleteOneRowGroup(row);
    if (this.showType == 'grid') {
        //鍙湁grid灞曠ず鐨勬椂鍊欐墠澶勭悊div锛岄拡瀵归殣钘忔儏鍐典笅杩樿娣诲姞鏁版嵁
        $('#' + this.options.id + '_content_div tbody tr[role="row"]:eq(' + index + ')').remove();
        $('#' + this.options.id + '_content_fixed_div tbody tr[role="row"]:eq(' + index + ')').remove();
        $('#' + this.options.id + '_content_multiSelect >div:eq(' + index + ')').remove();
        $('#' + this.options.id + '_content_numCol >.u-grid-content-num:eq(' + index + ')').remove();
        if (this.dataSourceObj.rows.length == 0) {
            $('#' + this.options.id + '_content_multiSelect').removeClass('u-grid-content-left-sum-first');
            $('#' + this.options.id + '_content_numCol').removeClass('u-grid-content-left-sum-first');
        }
        this.resetNumCol();
        this.repairSumRow();
        this.repairGroupSumRow(row);
        this.noRowsShowFun();
        this.updateNumColLastRowFlag();
        if (this.dataSourceObj.rows.length > 0) {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "block");
        } else {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "none");
        }
        if (this.options.groupField) {
            var groupValue = row.value[this.options.groupField];
            this.resetGroupFieldTd(groupValue);
        }
    }

    this.deleteOneRowTree();
    if (typeof this.options.onRowDelete == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.index = index;
        obj.row = row;
        if (!this.options.onRowDelete(obj)) {
            return;
        }
    }
    this.isCheckedHeaderRow();
};
var repairSumRow = function repairSumRow() {};
var deleteOneRowGroupSum = function deleteOneRowGroupSum() {};
var deleteOneRowTree = function deleteOneRowTree() {};
/*
 * 鍒犻櫎澶氳
 */
var deleteRows = function deleteRows(indexs) {
    var oThis = this,
        indexss = new Array();
    $.each(indexs, function (i) {
        indexss.push(indexs[i]);
    });
    indexss.sort(function (a, b) {
        return b - a;
    });

    $.each(indexss, function (i) {
        oThis.deleteOneRow(this);
    });
    this.isCheckedHeaderRow();
};
/*
 * 淇敼鏌愪竴琛�
 */
var updateRow = function updateRow(index, row) {
    if (index > -1 && index < this.dataSourceObj.rows.length) {
        this.dataSourceObj.rows[index].value = row;
        this.dataSourceObj.options.values[this.dataSourceObj.rows[index].valueIndex] = row;
        if (this.showType == 'grid') {
            var obj = {};
            obj.begin = index;
            obj.length = 1;
            this.renderTypeFun(obj);
            this.repairSumRow();
        }
    }
};
/*
 * 淇敼鏌愪釜cell鐨勫€�
 */
var updateValueAt = function updateValueAt(rowIndex, field, value, force) {
    if (rowIndex > -1 && rowIndex < this.dataSourceObj.rows.length) {
        var oThis = this,
            oldValue = $(this.dataSourceObj.rows[rowIndex].value).attr(field),
            treeRowIndex = rowIndex;
        if (typeof value == 'undefined') value = '';
        if (oldValue != value || force) {
            if (typeof this.options.onBeforeValueChange == 'function') {
                var obj = {};
                obj.gridObj = this;
                //鍥犱负鏍戣〃鏇存柊鏃跺€欏彲鑳芥敼鍙榬owIndex鐨勯『搴�
                obj.rowIndex = treeRowIndex;
                obj.field = field;
                obj.oldValue = oldValue;
                obj.newValue = value;
                var flag = this.options.onBeforeValueChange(obj);
                if (!flag) return;
            }
            $(this.dataSourceObj.rows[rowIndex].value).attr(field, value);
            // $(this.dataSourceObj.options.values[this.dataSourceObj.rows[rowIndex].valueIndex]).attr(field, value); //grouptest渚濇鎵ц闄ゅ垹闄ゅ悗涓嶅瓨鍦ㄥ垎缁勮〃澶存寜閽渶鍚庝慨鏀规暟鎹細閿欒
            if (this.showType == 'grid') {
                var obj = {};
                obj.field = field;
                obj.begin = rowIndex;
                obj.length = 1;
                this.renderTypeFun(obj);
                // this.editColIndex = undefined;
                // 濡傛灉缂栬緫琛屼负淇敼琛屽垯鍚屾椂闇€瑕佷慨鏀圭紪杈戣鐨勬樉绀�
                treeRowIndex = this.updateValueAtTree(rowIndex, field, value, force);
                this.updateValueAtEdit(rowIndex, field, value, force);
                this.repairSumRow();
                this.repairGroupSumRow(this.dataSourceObj.rows[rowIndex]);
            }
            if (typeof this.options.onValueChange == 'function') {
                var obj = {};
                obj.gridObj = this;
                //鍥犱负鏍戣〃鏇存柊鏃跺€欏彲鑳芥敼鍙榬owIndex鐨勯『搴�
                obj.rowIndex = treeRowIndex;
                obj.field = field;
                obj.oldValue = oldValue;
                obj.newValue = value;
                this.options.onValueChange(obj);
            }
            this.resetLeftHeight();
        }
    }
};
var updateValueAtTree = function updateValueAtTree(rowIndex, field, value, force) {
    return rowIndex;
};
var updateValueAtEdit = function updateValueAtEdit(rowIndex, field, value, force) {};
/*
 * 閫変腑涓€琛�
 * slice 璁剧疆鍏ㄩ€夋椂锛宻lice涓簍rue锛屼笉鍋氭覆鏌擄紝鍦╯etAllRowSelect涓粺涓€娓叉煋
 */
var setRowSelect = function setRowSelect(rowIndex, doms) {
    var selectDiv, rowTr, fixedRowTr, numColDiv;
    if (!this.dataSourceObj.rows[rowIndex]) return true;
    //宸茬粡閫変腑閫€鍑�
    if (this.showType == 'grid') {
        if (doms && doms['contentTrs']) rowTr = doms['contentTrs'][rowIndex];else rowTr = this.$ele.find('#' + this.options.id + '_content_tbody tr[role="row"]')[rowIndex];
    }
    if (this.dataSourceObj.rows[rowIndex].checked) {
        if (this.showType == 'grid') {
            if (u.hasClass(rowTr, "u-grid-content-sel-row")) return true;
        } else {
            return true;
        }
    }
    if (doms && doms['multiSelectDivs']) selectDiv = doms['multiSelectDivs'][rowIndex];else selectDiv = this.$ele.find('#' + this.options.id + '_content_multiSelect').find('div')[rowIndex];

    var beforeSelectFlag = true;
    if (typeof this.options.onBeforeRowSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        beforeSelectFlag = this.options.onBeforeRowSelected(obj);
    }
    if (beforeSelectFlag && typeof this.options.onBeforeCreateLeftMul == 'function') {
        var obj = {
            gridObj: this,
            rowObj: this.dataSourceObj.rows[rowIndex]
        };
        beforeSelectFlag = this.options.onBeforeCreateLeftMul.call(this, obj);
    }
    if (!beforeSelectFlag) {
        if (this.options.multiSelect) {
            var _input = selectDiv.children[0];
            if (_input) _input.checked = false;
        }
        return false;
    }
    if (!this.options.multiSelect) {
        if (this.selectRowsObj && this.selectRowsObj.length > 0) {
            $.each(this.selectRowsObj, function () {
                this.checked = false;
            });
        }
        this.selectRows = new Array();
        this.selectRowsObj = new Array();
        this.selectRowsIndex = new Array();
        if (this.showType == 'grid') {
            $('#' + this.options.id + '_content_tbody tr[role="row"]').removeClass("u-grid-content-sel-row");
            $('#' + this.options.id + '_content_tbody tr[role="row"] a').removeClass("u-grid-content-sel-row");
            $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]').removeClass("u-grid-content-sel-row");
            $('#' + this.options.id + '_content_fixed_tbody tr[role="row"] a').removeClass("u-grid-content-sel-row");
            if (this.options.multiSelect) {
                $('#' + this.options.id + '_content_multiSelect div').removeClass("u-grid-content-sel-row");
            }
            if (this.options.showNumCol) {
                $('#' + this.options.id + '_content_numCol div').removeClass("u-grid-content-sel-row");
            }
        }
    } else {
        if (this.showType == 'grid') {
            var _input = selectDiv.children[0];
            // _input.checked = true;
            $(_input).addClass('is-checked');
        }
    }
    if (this.showType == 'grid') {
        $(rowTr).addClass("u-grid-content-sel-row");

        if (doms && doms['fixContentTrs']) fixedRowTr = doms['fixContentTrs'][rowIndex];else fixedRowTr = this.$ele.find('#' + this.options.id + '_content_fixed_tbody tr[role="row"]')[rowIndex];
        $(fixedRowTr).addClass("u-grid-content-sel-row");
        var ini = rowIndex;
        if (this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form') {
            ini++;
        }
        if (this.options.multiSelect) {
            if (ini != rowIndex) selectDiv = this.$ele.find('#' + this.options.id + '_content_multiSelect').find('div')[ini];
            $(selectDiv).addClass('u-grid-content-sel-row');
        }
        if (this.options.showNumCol) {
            if (doms && doms['numColDivs']) numColDiv = doms['numColDivs'][ini];else numColDiv = this.$ele.find('#' + this.options.id + '_content_numCol').find('div')[ini];
            $(numColDiv).addClass('u-grid-content-sel-row');
        }
    }
    this.selectRows.push(this.dataSourceObj.rows[rowIndex].value);
    this.selectRowsObj.push(this.dataSourceObj.rows[rowIndex]);
    this.selectRowsIndex.push(rowIndex);
    this.dataSourceObj.rows[rowIndex].checked = true;
    // if(this.selectRows.length == this.dataSourceObj.rows.length){
    //     //淇敼鍏ㄩ€夋爣璁颁负false
    //     $('#' + this.options.id + '_header_multi_input').addClass('is-checked')
    // }
    this.isCheckedHeaderRow();
    if (typeof this.defaultOnRowSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        this.defaultOnRowSelected(obj);
    }

    if (typeof this.options.onRowSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        this.options.onRowSelected(obj);
    }
    return true;
};
/*
 * 鍙嶉€変竴琛�
 */
var setRowUnselect = function setRowUnselect(rowIndex) {
    var oThis = this;
    if (!this.dataSourceObj.rows[rowIndex]) return true;
    //宸茬粡閫変腑閫€鍑�
    if (!this.dataSourceObj.rows[rowIndex].checked) return true;
    if (typeof this.options.onBeforeRowUnSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        if (!this.options.onBeforeRowUnSelected(obj)) {
            if (this.options.multiSelect) {
                $('#' + this.options.id + '_content_multiSelect input:eq(' + rowIndex + ')')[0].checked = true;
            }
            return false;
        }
    }
    if (this.options.multiSelect) {
        // $('#' + this.options.id + '_content_multiSelect input:eq(' + rowIndex+ ')')[0].checked = false;
        $('#' + this.options.id + '_content_multiSelect .u-grid-content-multiSelect:eq(' + rowIndex + ')').find('.u-grid-checkbox-outline').removeClass('is-checked');
    }
    var ini = rowIndex;
    if (this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form') {
        ini++;
    }
    $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + ini + ')').removeClass("u-grid-content-sel-row");
    $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + ini + ') a').removeClass("u-grid-content-sel-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + ini + ')').removeClass("u-grid-content-sel-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + ini + ') a').removeClass("u-grid-content-sel-row");
    if (this.options.multiSelect) {
        $('#' + this.options.id + '_content_multiSelect >div:eq(' + ini + ')').removeClass("u-grid-content-sel-row");
    }
    if (this.options.showNumCol) {
        $('#' + this.options.id + '_content_numCol >div:eq(' + ini + ')').removeClass("u-grid-content-sel-row");
    }
    $.each(this.selectRows, function (i) {
        if (this == oThis.dataSourceObj.rows[rowIndex].value) {
            oThis.selectRows.splice(i, 1);
            oThis.selectRowsObj.splice(i, 1);
            oThis.selectRowsIndex.splice(i, 1);
        }
    });
    this.dataSourceObj.rows[rowIndex].checked = false;

    //淇敼鍏ㄩ€夋爣璁颁负false
    $('#' + this.options.id + '_header_multi_input').removeClass('is-checked');

    if (typeof this.options.onRowUnSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        this.options.onRowUnSelected(obj);
    }
    oThis.isCheckedHeaderRow();
    return true;
};
/*
 * 閫変腑鎵€鏈夎
 */
var setAllRowSelect = function setAllRowSelect() {
    // $('#' + this.options.id + '_header_multi_input').prop('checked', true)
    $('#' + this.options.id + '_header_multi_input').addClass('is-checked');
    if (typeof this.options.onBeforeAllRowSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObjs = this.dataSourceObj.rows;
        if (!this.options.onBeforeAllRowSelected(obj)) {
            return;
        }
    }
    // 鎶婇渶瑕佺殑dom鍦ㄥ惊鐜鑾峰彇鍑烘潵
    var multiSelectDivs = this.$ele.find('#' + this.options.id + '_content_multiSelect >div'),
        numColDivs = this.$ele.find('#' + this.options.id + '_content_numCol >div'),
        contentTrs = this.$ele.find('#' + this.options.id + '_content_tbody tr[role="row"]'),
        fixContentTrs = this.$ele.find('#' + this.options.id + '_content_fixed_tbody tr[role="row"]');
    this.$ele.find('#' + this.options.id + '_content_tbody tr[role="row"]');
    for (var i = 0; i < this.dataSourceObj.rows.length; i++) {
        this.setRowSelect(i, {
            multiSelectDivs: multiSelectDivs,
            numColDivs: numColDivs,
            contentTrs: contentTrs,
            fixContentTrs: fixContentTrs
        });
    }
    this.hasChecked = true;
    if (typeof this.options.onAllRowSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObjs = this.dataSourceObj.rows;
        this.options.onAllRowSelected(obj);
    }
};
/*
 * 鍙嶉€夋墍鏈夎
 */
var setAllRowUnSelect = function setAllRowUnSelect() {
    // $('#' + this.options.id + '_header_multi_input').attr('checked', false)
    $('#' + this.options.id + '_header_multi_input').removeClass('is-checked');
    if (typeof this.options.onBeforeAllRowUnSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObjs = this.dataSourceObj.rows;
        if (!this.options.onBeforeAllRowUnSelected(obj)) {
            return;
        }
    }
    for (var i = 0; i < this.dataSourceObj.rows.length; i++) {
        this.setRowUnselect(i);
    }
    this.hasChecked = false;
    if (typeof this.options.onAllRowUnSelected == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObjs = this.dataSourceObj.rows;
        this.options.onAllRowUnSelected(obj);
    }
};

/*
 * focus涓€琛�
 */
var setRowFocus = function setRowFocus(rowIndex) {
    //宸茬粡閫変腑閫€鍑�
    if (this.dataSourceObj.rows[rowIndex].focus) return true;
    if (!this.dataSourceObj.rows[rowIndex]) return true;
    if (typeof this.options.onBeforeRowFocus == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        if (!this.options.onBeforeRowFocus(obj)) {
            return false;
        }
    }
    $('#' + this.options.id + '_content_tbody tr[role="row"]').removeClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_tbody tr[role="row"] a').removeClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]').removeClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"] a').removeClass("u-grid-content-focus-row");
    if (this.options.multiSelect) {
        $('#' + this.options.id + '_content_multiSelect').find('div').removeClass("u-grid-content-focus-row");
    }
    if (this.options.showNumCol) {
        $('#' + this.options.id + '_content_numCol').find('div').removeClass("u-grid-content-focus-row");
    }
    if (this.focusRowObj) {
        this.focusRowObj.focus = false;
    }
    $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + rowIndex + ')').addClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + rowIndex + ') a').addClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + rowIndex + ')').addClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + rowIndex + ') a').addClass("u-grid-content-focus-row");
    var ini = rowIndex;
    if (this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form') {
        ini++;
    }
    if (this.options.multiSelect) {
        $('#' + this.options.id + '_content_multiSelect >div:eq(' + ini + ')').addClass("u-grid-content-focus-row");
    }
    if (this.options.showNumCol) {
        $('#' + this.options.id + '_content_numCol >div:eq(' + ini + ')').addClass("u-grid-content-focus-row");
    }
    this.focusRow = this.dataSourceObj.rows[rowIndex].value;
    this.focusRowObj = this.dataSourceObj.rows[rowIndex];
    this.focusRowIndex = rowIndex;
    this.dataSourceObj.rows[rowIndex].focus = true;
    if (typeof this.options.onRowFocus == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        this.options.onRowFocus(obj);
    }
    /*if(!this.options.multiSelect){
        this.setRowSelect(rowIndex);
    }*/
    return true;
};
/*
 * 鍙峟ocus涓€琛�
 */
var setRowUnFocus = function setRowUnFocus(rowIndex) {
    var oThis = this;
    if (!this.dataSourceObj.rows[rowIndex]) return true;
    if (typeof this.options.onBeforeRowUnFocus == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        if (!this.options.onBeforeRowUnFocus(obj)) {
            return false;
        }
    }
    //宸茬粡閫変腑閫€鍑�
    if (!this.dataSourceObj.rows[rowIndex].focus) return true;
    var ini = rowIndex;
    if (this.eidtRowIndex > -1 && this.eidtRowIndex < rowIndex && this.options.editType == 'form') {
        ini++;
    }
    $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + ini + ')').removeClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + ini + ') a').removeClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + ini + ')').removeClass("u-grid-content-focus-row");
    $('#' + this.options.id + '_content_fixed_tbody tr[role="row"]:eq(' + ini + ') a').removeClass("u-grid-content-focus-row");
    if (this.options.multiSelect) {
        $('#' + this.options.id + '_content_multiSelect >div:eq(' + ini + ')').removeClass("u-grid-content-focus-row");
    }
    if (this.options.showNumCol) {
        $('#' + this.options.id + '_content_numCol >div:eq(' + ini + ')').removeClass("u-grid-content-focus-row");
    }
    this.dataSourceObj.rows[rowIndex].focus = false;
    this.focusRow = null;
    this.focusRowObj = null;
    this.focusRowIndex = null;
    if (typeof this.options.onRowUnFocus == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[rowIndex];
        obj.rowIndex = rowIndex;
        this.options.onRowUnFocus(obj);
    }
    if (!this.options.multiSelect) {
        this.setRowUnselect(rowIndex);
    }
    return true;
};
/*
 * 澧炲姞鍒犻櫎鏃堕噸缃暟瀛楀垪
 */
var resetNumCol = function resetNumCol() {
    var numCols = $('#' + this.options.id + '_content_numCol >.u-grid-content-num');
    $.each(numCols, function (i) {
        this.innerHTML = i + 1 + "";
    });
};
var operateRowFunObj = {
    isCheckedHeaderRow: isCheckedHeaderRow,
    addOneRow: addOneRow,
    addOneRowTree: addOneRowTree,
    addOneRowTreeHasChildF: addOneRowTreeHasChildF,
    getGroupIndex: getGroupIndex,
    editClose: editClose,
    addRows: addRows,
    createContentOneRowFixed: createContentOneRowFixed,
    updateEditRowIndex: updateEditRowIndex,
    deleteOneRow: deleteOneRow,
    repairSumRow: repairSumRow,
    deleteOneRowTree: deleteOneRowTree,
    deleteRows: deleteRows,
    updateRow: updateRow,
    updateValueAt: updateValueAt,
    updateValueAtTree: updateValueAtTree,
    updateValueAtEdit: updateValueAtEdit,
    setRowSelect: setRowSelect,
    setRowUnselect: setRowUnselect,
    setAllRowSelect: setAllRowSelect,
    setAllRowUnSelect: setAllRowUnSelect,
    setRowFocus: setRowFocus,
    setRowUnFocus: setRowUnFocus,
    resetNumCol: resetNumCol,
    repairGroupSumRow: repairGroupSumRow,
    deleteOneRowGroupSum: deleteOneRowGroupSum,
    resetGroupFieldTd: resetGroupFieldTd
};

/*
 * 澶勭悊renderType
 * begin涓鸿捣濮嬭锛宭ength涓鸿鏁帮紙澧炲姞琛屾暟鏃朵娇鐢級
 */
var renderTypeFun = function renderTypeFun(obj) {
    if (!this.isGridShow()) return;
    if (typeof obj == 'undefined') {
        var begin = null,
            length = null,
            field = '';
    } else {
        var begin = typeof obj.begin == 'undefined' ? null : obj.begin,
            length = typeof obj.length == 'undefined' ? null : obj.length,
            field = typeof obj.field == 'undefined' ? '' : obj.field;
    }
    var oThis = this,
        begin = parseInt(begin),
        length = parseInt(length),
        end = begin;
    if (length > 0) {
        end = parseInt(begin + length - 1);
    }
    if (field == '') {
        if (this.gridCompColumnFixedArr) $.each(this.gridCompColumnFixedArr, function (i) {
            oThis.renderTypeByColumn(this, i, begin, length, true);
        });
        $.each(this.gridCompColumnArr, function (i) {
            oThis.renderTypeByColumn(this, i, begin, length, false);
        });
    } else {
        var rendered = false;
        if (this.gridCompColumnFixedArr) $.each(this.gridCompColumnFixedArr, function (i) {
            if (this.options.field == field) {
                oThis.renderTypeByColumn(this, i, begin, length, true);
                rendered = true;
                return;
            }
        });
        if (!rendered) $.each(this.gridCompColumnArr, function (i) {
            if (this.options.field == field) {
                oThis.renderTypeByColumn(this, i, begin, length, false);
                return;
            }
        });
    }
};
/*
 * 澶勭悊renderType
 * gridCompColumn瀵硅薄锛宨ndex涓虹鍑犲垪
 * begin涓鸿捣濮嬭锛宭ength涓鸿鏁帮紙澧炲姞琛屾暟鏃朵娇鐢級
 */
var renderTypeByColumn = function renderTypeByColumn(gridCompColumn, i, begin, length, isFixedColumn) {
    var oThis = this,
        renderType = gridCompColumn.options.renderType,
        sumCol = gridCompColumn.options.sumCol,
        sumRenderType = gridCompColumn.options.sumRenderType,
        dataType = gridCompColumn.options.dataType,
        precision = gridCompColumn.options.precision,
        format = gridCompColumn.options.format,
        field = gridCompColumn.options.field,
        end = begin,
        idSuffix = isFixedColumn === true ? '_content_fixed_tbody' : '_content_tbody',
        idStr = isFixedColumn === true ? 'fixed_' : '',
        visibleColIndex = this.getVisibleIndexOfColumn(gridCompColumn);

    if (length > 0) {
        end = parseInt(begin + length - 1);
    }
    this.realtimeTableRows = $('#' + this.options.id + idSuffix).find('tr[role="row"]');
    // this.realtimeTableRows = document.getElementById(oThis.options.id + idSuffix).children;
    // 璁板綍role涓嶆槸row鐨勮
    var notRowIndex = -1;
    // for (var k = 0; k < oThis.realtimeTableRows.length; k++) {
    //     if (oThis.realtimeTableRows[k].getAttribute("role") != "row") {
    //         notRowIndex = k
    //     }
    // }
    $.each(oThis.dataSourceObj.rows, function (j) {
        if (begin >= 0 && j >= begin && j <= end || isNaN(begin)) {
            //濡傛灉褰撳墠淇敼姝ゅ垪鍒欏皢鍙橀噺閲嶇疆
            if (oThis.editColIndex == visibleColIndex && oThis.eidtRowIndex == j && oThis.options.editType == 'default') {
                oThis.editColIndex = -1;
                oThis.eidtRowIndex = -1;
            }
            var trIndex = j;
            if (notRowIndex != -1 && j >= notRowIndex) {
                trIndex++;
            }
            var tr = oThis.realtimeTableRows[trIndex],
                td = tr.children[i];
            if (oThis.iconSpan) {
                var iconSpan = oThis.iconSpan;
            }

            if (td) {
                if (td.children[0].innerHTML.indexOf('u-grid-content-tree-span') != -1) {
                    var span = td.children[0].children[1];
                } else {
                    // td.innerHTML = '<div class="u-grid-content-td-div"></div>'; //濡傛灉鏄爲琛ㄧ殑璇濈涓€鍒楁樉绀轰細鏈夐棶棰橈紝绛夊嚭鐜板叾浠栭棶棰樹箣鍚庡啀淇敼姝ゅ
                    var span = td.children[0];
                }
                if (span) {
                    var v = $(this.value).attr(field);
                    if (typeof renderType == 'function' || dataType == 'Date' || dataType == 'Datetime' || dataType == 'Int' || dataType == 'Float') {
                        span.innerHTML = '';
                        if (typeof renderType == 'function') {
                            v = oThis.getString(v, '');
                            var obj = {};
                            obj.value = v;
                            obj.element = span;
                            obj.gridObj = oThis;
                            obj.row = this;
                            obj.gridCompColumn = gridCompColumn;
                            obj.rowIndex = j;
                            renderType.call(oThis, obj);
                        } else if (dataType == 'Date' || dataType == 'Datetime') {
                            if (v == null || v == undefined || v == 'null' || v == 'undefined' || v == "") {
                                v = "";
                            }
                            if (dataType == 'Date') {
                                v = u.dateRender(v);
                            } else {
                                v = u.dateTimeRender(v);
                            }
                            span.innerHTML = v;
                            span.title = v;
                        } else if (dataType == 'Int') {
                            v = parseInt(v);
                            if (!isNaN(v)) {
                                span.innerHTML = v;
                                span.title = v;
                            } else {
                                span.innerHTML = "";
                                span.title = "";
                            }
                        } else if (dataType == 'Float') {
                            if (precision) {
                                var o = {};
                                o.value = v;
                                o.precision = precision;
                                v = oThis.DicimalFormater(o);
                            } else {
                                v = parseFloat(v);
                            }
                            if (!isNaN(v)) {
                                span.innerHTML = v;
                                span.title = v;
                            } else {
                                span.innerHTML = "";
                                span.title = "";
                            }
                        } else {
                            //姝ゅ閫昏緫鏀惧埌娓叉煋澶勶紝鍑忓皯render鎵ц娆℃暟銆�
                            v = oThis.getString(v, '');
                            var v1 = v.replace(/\</g, '\<');
                            v1 = v1.replace(/\>/g, '\>');
                            span.title = v;
                            v = v.replace(/\</g, '&lt;');
                            v = v.replace(/\>/g, '&gt;');
                            span.innerHTML = v;
                        }
                    } else {
                        v = oThis.getString(v, '');
                        var v1 = v.replace(/\</g, '\<');
                        v1 = v1.replace(/\>/g, '\>');
                        span.title = v;
                        v = v.replace(/\</g, '&lt;');
                        v = v.replace(/\>/g, '&gt;');
                        if (i == 0 && iconSpan) {
                            v = iconSpan += v;
                        }
                        span.innerHTML = v;
                    }

                    /* 澧炲姞澶勭悊鍒ゆ柇鏄惁闇€瑕佹樉绀�... */
                    var obj = {
                        span: span,
                        column: gridCompColumn
                    };
                    var colum_maxlength = gridCompColumn.options.maxLength,
                        overFlag = false;
                    if (colum_maxlength && colum_maxlength > 0) {
                        //鎺у埗琛ㄦ牸鍒楁樉绀�...
                        overFlag = span.innerHTML.length > colum_maxlength ? true : false;
                    } else {
                        overFlag = oThis.getRenderOverFlag(obj);
                    }
                    if (overFlag) {
                        $(span).addClass('u-grid-content-td-div-over');
                    }
                }
            }
        }
        oThis.renderTypeGroupSumRow(gridCompColumn, i, isFixedColumn, this);
    });
    this.renderTypeSumRow(gridCompColumn, i, begin, length, isFixedColumn);
};

var getRenderOverFlag = function getRenderOverFlag(obj) {
    // 褰卞搷鎬ц兘锛屼笉鍐嶆敮鎸佹鏂瑰紡锛屾寜鐓axLength鏉ュ鐞�
    if (this.options.heightAuto && this.options.maxHeight > 40) {
        var span = obj.span;
        var nowHeight = span.offsetHeight;
        var nowWidth = span.offsetWidth;
        var newSpan = $(span).clone()[0];
        var overFlag = false;
        obj.span.parentNode.appendChild(newSpan);
        var oldDisplay = span.style.display;
        span.style.display = 'none';
        newSpan.style.height = '';
        newSpan.style.maxHeight = '999999px';
        var newHeight = newSpan.offsetHeight;
        if (newHeight > nowHeight) {
            overFlag = true;
        }
        obj.span.parentNode.removeChild(newSpan);
        span.style.display = oldDisplay;
        return overFlag;
    }
};

var renderTypeSumRow = function renderTypeSumRow(gridCompColumn, i, begin, length, isFixedColumn) {};
var renderTypeGroupSumRow = function renderTypeGroupSumRow() {};
var renderTypeFunObj = {
    renderTypeFun: renderTypeFun,
    renderTypeByColumn: renderTypeByColumn,
    renderTypeSumRow: renderTypeSumRow,
    renderTypeGroupSumRow: renderTypeGroupSumRow,
    getRenderOverFlag: getRenderOverFlag
};

/*
 * 璁剧疆鏌愬垪鏄惁鏄剧ず(浼犲叆column)
 */
var setColumnVisibleByColumn = function setColumnVisibleByColumn(column, visible) {
    var index = this.getIndexOfColumn(column);
    this.setColumnVisibleByIndex(index, visible);
};
/*
 * 璁剧疆鏌愬垪鏄惁鏄剧ず(浼犲叆index涓篻ridCompColumnArr涓殑鏁版嵁)
 */
var setColumnVisibleByIndex = function setColumnVisibleByIndex(index, visible) {
    if (index >= 0) {
        var column = this.gridCompColumnArr[index],
            visibleIndex = this.getVisibleIndexOfColumn(column),
            canVisible = column.options.canVisible,
            l = $('input:checked', $('#' + this.options.id + '_column_menu_columns_ul')).length;
        if (!canVisible && visible == false) {
            return;
        }
        // 鏄剧ず澶勭悊
        if (column.options.visible == false && visible) {
            var htmlStr = '<col';
            if (column.options.width) {
                htmlStr += ' style="width:' + this.formatWidth(column.options.width) + '"';
            }
            htmlStr += '>';
            // 褰撳墠鍒椾箣鍚庣殑鏄剧ず鍒楃殑index
            var nextVisibleIndex = this.getNextVisibleInidexOfColumn(column);
            $('#' + this.options.id + '_header_table th:eq(' + index + ')').css('display', "");
            $('#' + this.options.id + '_content_table th:eq(' + index + ')').css('display', "");
            $('td:eq(' + index + ')', $('#' + this.options.id + '_content tbody tr')).css('display', "");
            if (nextVisibleIndex < 0) {
                this.lastVisibleColumn = column;
                // 娣诲姞鍦ㄦ渶鍚庨潰
                try {
                    $('#' + this.options.id + '_header_table col:last')[0].insertAdjacentHTML('afterEnd', htmlStr);
                    $('#' + this.options.id + '_content_table col:last')[0].insertAdjacentHTML('afterEnd', htmlStr);
                } catch (e) {
                    $('#' + this.options.id + '_header_table col:last').after(htmlStr);
                    $('#' + this.options.id + '_content_table col:last').after(htmlStr);
                }
            } else {
                // 娣诲姞鍦ㄤ笅涓€涓樉绀哄垪涔嬪墠
                try {
                    $('#' + this.options.id + '_header_table col:eq(' + (nextVisibleIndex - 1) + ')')[0].insertAdjacentHTML('beforeBegin', htmlStr);
                    $('#' + this.options.id + '_content_table col:eq(' + (nextVisibleIndex - 1) + ')')[0].insertAdjacentHTML('beforeBegin', htmlStr);
                } catch (e) {
                    $('#' + this.options.id + '_header_table col:eq(' + (nextVisibleIndex - 1) + ')').before(htmlStr);
                    $('#' + this.options.id + '_content_table col:eq(' + (nextVisibleIndex - 1) + ')').before(htmlStr);
                }
            }
            var newContentW = this.contentWidth + parseInt(column.options.width);
            if (this.showType == 'grid') {
                $('#' + this.options.id + '_column_menu_columns_ul li input:eq(' + index + ')')[0].checked = true;
            }
        }
        // 闅愯棌澶勭悊
        if (column.options.visible == true && !visible) {
            $('#' + this.options.id + '_header_table th:eq(' + index + ')').css('display', "none");
            $('#' + this.options.id + '_header_table col:eq(' + visibleIndex + ')').remove();
            $('#' + this.options.id + '_content_table th:eq(' + index + ')').css('display', "none");
            $('#' + this.options.id + '_content_table col:eq(' + visibleIndex + ')').remove();
            $('td:eq(' + index + ')', $('#' + this.options.id + '_content_table tbody tr')).css('display', "none");
            // 闅愯棌涔嬪悗闇€瑕佸垽鏂€讳綋瀹藉害鏄惁灏忎簬鍐呭鍖烘渶灏忓搴︼紝濡傛灉灏忎簬闇€瑕佸皢鏈€鍚庝竴鍒楄繘琛屾墿灞�
            var newContentW = this.contentWidth - parseInt(column.options.width);
            if (this.showType == 'grid') {
                $('#' + this.options.id + '_column_menu_columns_ul li input:eq(' + index + ')')[0].checked = false;
            }
            if (this.lastVisibleColumn == column) {
                var allVisibleColumns = this.getAllVisibleColumns();
                this.lastVisibleColumn = allVisibleColumns[allVisibleColumns.length - 1];
            }
        }
        column.options.visible = visible;
        var w = this.contentWidthChange(newContentW);
        this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth;
        this.contentWidth = w;
        this.resetThVariable();
        this.noScrollWidthReset();
        this.contentMinWidth = parseInt(this.wholeWidth) - parseInt(this.leftW) - parseInt(this.fixedWidth);
        if (this.contentMinWidth < 0) this.contentMinWidth = 0;
        if (this.contentRealWidth < this.contentMinWidth) {
            this.contentWidth = this.contentMinWidth;
            var oldWidth = this.lastVisibleColumn.options.width;
            this.lastVisibleColumnWidth = oldWidth + (this.contentMinWidth - this.contentRealWidth);
            // modfied by tianxq1 鏈€鍚庝竴鍒楄嚜鍔ㄦ墿灞�
            this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth;
            // this.setColumnWidth(this.lastVisibleColumn, this.lastVisibleColumnWidth);
        } else {
            this.contentWidth = this.contentRealWidth;
        }
        this.resetColumnWidthByRealWidth();
        this.saveGridCompColumnArrToLocal();

        var columnAllCheck = $('input', $('#' + this.options.id + '_column_menu_ul .header'));
        if (columnAllCheck.length > 0) {
            var lll = $('input:not(:checked)', $('#' + this.options.id + '_column_menu_columns_ul')).length;
            if (lll > 0) {
                columnAllCheck[0].checked = false;
            } else {
                columnAllCheck[0].checked = true;
            }
        }
    }
};

var resetColumnWidthByRealWidth = function resetColumnWidthByRealWidth() {
    var oThis = this;
    $.each(this.gridCompColumnArr, function () {
        if (this.options.realWidth != this.options.width) {
            oThis.setColumnWidth(this, this.options.realWidth);
        }
    });
    this.resetLastVisibleColumnWidth();
};

/*
 * 鏍规嵁field璁剧疆瀹藉害
 */
var setCoulmnWidthByField = function setCoulmnWidthByField(field, newWidth) {
    var column = this.getColumnByField(field);
    this.setColumnWidth(column, newWidth);
};
/*
 * 鏍规嵁column瀵硅薄璁剧疆瀹藉害
 */
var setColumnWidth = function setColumnWidth(column, newWidth) {
    // if (column != this.lastVisibleColumn) {
    if (newWidth > this.minColumnWidth || newWidth == this.minColumnWidth) {
        var nowVisibleThIndex = this.getVisibleIndexOfColumn(column),
            oldWidth = column.options.width,
            changeWidth = newWidth - oldWidth,
            cWidth = this.contentWidth + changeWidth;
        this.contentWidth = this.contentWidthChange(cWidth);
        $('#' + this.options.id + '_header_table col:eq(' + nowVisibleThIndex + ')').css('width', newWidth + "px");
        $('#' + this.options.id + '_content_table col:eq(' + nowVisibleThIndex + ')').css('width', newWidth + "px");
        column.options.width = newWidth;
        column.options.realWidth = newWidth;
        this.resetThVariable();
        this.saveGridCompColumnArrToLocal();
    }
    this.resetLastVisibleColumnWidth();
    this.columnsVisibleFun();
    // }
};
/*
 * 璁剧疆鏁版嵁婧�
 */
var setDataSource = function setDataSource(dataSource) {
    if (!(this.$ele.data('gridComp') == this)) return;
    this.initDataSourceVariable();
    this.options.dataSource = dataSource;
    this.initDataSource();
    if (this.showType == 'grid') {
        this.widthChangeGridFun();
        if (this.dataSourceObj.rows.length > 0) {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "block");
        } else {
            $('#' + this.options.id + '_grid .u-grid-noScroll-left').css('display', "none");
        }
    }
};
/*
 * 璁剧疆鏁版嵁婧� 鏍煎紡涓猴細
 * {
    fields:['column1','column2','column3','column4','column5','column6'],
    values:[["cl1","1","cl3","cl4","cl5","cl6"]
            ,["cl12","2","cl32","cl42","cl52","cl62"]
            ,["cl13","3","cl33","cl43","cl53","cl63"]
            ,["cl14","4","cl34","cl44","cl54","cl64"]
            ,["cl15","5","cl35","cl45","cl55","cl65"]
            ,["cl16","6","cl36","cl46","cl56","cl66"]
        ]

    }
 */
var setDataSourceFun1 = function setDataSourceFun1(dataSource) {
    var dataSourceObj = {};
    if (dataSource.values) {
        var valuesArr = new Array();
        $.each(dataSource.values, function () {
            if (dataSource.fields) {
                var valueObj = {},
                    value = this;
                $.each(dataSource.fields, function (j) {
                    $(valueObj).attr(this, value[j]);
                });
                valuesArr.push(valueObj);
            }
        });
    }
    $(dataSourceObj).attr('values', valuesArr);
    this.setDataSource(dataSourceObj);
};
var setFunObj = {
    setColumnVisibleByColumn: setColumnVisibleByColumn,
    setColumnVisibleByIndex: setColumnVisibleByIndex,
    setCoulmnWidthByField: setCoulmnWidthByField,
    setColumnWidth: setColumnWidth,
    setDataSource: setDataSource,
    setDataSourceFun1: setDataSourceFun1,
    resetColumnWidthByRealWidth: resetColumnWidthByRealWidth
};

/*
 * 鏁翠綋瀹藉害鏀瑰彉澶勭悊
 */
var widthChangeFun = function widthChangeFun() {
    var oThis = this;
    if ($('#' + this.options.id)[0]) {
        // 鑾峰彇鏁翠綋鍖哄煙瀹藉害
        //var w = $('#' + this.options.id).width()  //[0].offsetWidth;
        // jquery鑾峰彇鏂瑰紡鏈夐棶棰橈紝淇敼涓簅ffsetWidth
        var w = $('#' + this.options.id)[0].offsetWidth;
        // w!=0鐨勫垽鏂槸涓轰簡澶勭悊椤电涓殑grid鍦ㄥ垏鎹㈢殑杩囩▼涓細閲嶇粯
        if (this.wholeWidth != w && this.$ele.data('gridComp') == this && w != 0) {
            this.wholeWidth = w;

            // 鏍戝睍寮€/鍚堜笂鐨勬椂鍊欎細瀵艰嚧椤甸潰鍑虹幇婊氬姩鏉″鑷村搴︽敼鍙橈紝娌℃湁&&涔嬪悗浼氶噸鏂板埛鏂伴〉闈㈠鑷存棤娉曟敹璧�
            if (w > this.options.formMaxWidth && (this.showType == 'form' || this.showType == '' || !$('#' + this.options.id + '_content_div tbody')[0]) || this.options.overWidthHiddenColumn || this.options.noScroll) {
                //lyk--闇€瑕佸畬鍠勯殣钘忎箣鍚庡啀鏄剧ず鍚屼簨娣诲姞鏁版嵁鎿嶄綔
                oThis.widthChangeGridFun();
            } else if (w > 0 && w < this.options.formMaxWidth && (this.showType == 'grid' || this.showType == '')) {}
            if (w > this.options.formMaxWidth) {
                this.contentMinWidth = parseInt(this.wholeWidth) - parseInt(this.leftW) - parseInt(this.fixedWidth);
                if (this.contentMinWidth < 0) this.contentMinWidth = 0;
                setTimeout(function () {
                    $('#' + oThis.options.id + '_header_wrap').css('max-width', oThis.wholeWidth + 'px');
                    $('#' + oThis.options.id + '_content_div').css('width', oThis.contentMinWidth + 'px');
                    $('#' + oThis.options.id + '_content_table').css('min-width', oThis.contentMinWidth + 'px');
                    $('#' + oThis.options.id + '_content_table').css('width', oThis.contentMinWidth + 'px');
                    $('#' + oThis.options.id + '_header_table').css('min-width', oThis.contentMinWidth + 'px');
                    $('#' + oThis.options.id + '_header_table').css('width', oThis.contentMinWidth + 'px');
                    $('#' + oThis.options.id + '_noRowsShow').css('width', oThis.contentMinWidth + 'px');
                    //婊氬姩鏉″彲鑳藉彂鐢熷彉鍖栧鑷磄rid鍐呴儴鍒楃殑瀹藉害鍙戠敓鍙樺寲
                    oThis.columnsVisibleFun();
                    if (oThis.contentRealWidth < oThis.contentMinWidth) {
                        oThis.contentWidth = oThis.contentMinWidth;
                    } else {
                        oThis.contentWidth = oThis.contentRealWidth;
                    }
                    $('#' + oThis.options.id + '_noRows').css('width', oThis.contentWidth + 'px');
                    if (typeof oThis.options.afterCreate == 'function') {
                        oThis.options.afterCreate.call(oThis);
                    }
                }, 300);
            }
            $('#' + oThis.options.id + '_header_table').css('width', oThis.contentMinWidth + 'px');
            $('#' + oThis.options.id + '_edit_form').css('width', oThis.contentMinWidth + 'px');

            this.preWholeWidth = w;
            this.resetLeftHeight();
        }
    }
};
/*
 * 鏁翠綋瀹藉害鏀瑰彉澶勭悊(grid褰㈠紡)
 */
var widthChangeGridFun = function widthChangeGridFun() {
    var oThis = this,
        halfWholeWidth = parseInt(this.wholeWidth / 2);
    this.noScrollWidthReset();
    this.widthChangeGridFunFixed(halfWholeWidth);
    /* 濡傛灉瀹藉害涓嶈冻澶勭悊鑷姩闅愯棌*/
    this.widthChangeGridFunOverWidthHidden();
    // 鍐呭鍖哄煙瀹藉害鑷姩鎵╁睍
    this.contentMinWidth = parseInt(this.wholeWidth) - parseInt(this.leftW) - parseInt(this.fixedWidth);
    if (this.contentMinWidth < 0) this.contentMinWidth = 0;
    if (this.contentRealWidth < this.contentMinWidth) {
        this.contentWidth = this.contentMinWidth;
        var oldWidth = this.lastVisibleColumn.options.width;
        this.lastVisibleColumnWidth = oldWidth + (this.contentMinWidth - this.contentRealWidth);
        // modfied by tianxq1 鏈€鍚庝竴鍒楄嚜鍔ㄦ墿灞�
        this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth;
    } else {
        this.contentWidth = this.contentRealWidth;
    }
    this.createGridFlag = false;
    this.createGridDivs();
    $('#' + this.options.id + '_form').css('display', 'none');
    $('#' + this.options.id + '_grid').css('display', 'block');
};

/**
 * 涓嶆樉绀烘粴鍔ㄦ潯鐨勬儏鍐典笅闇€瑕侀噸缃瘡鍒楃殑瀹藉害
 */
var noScrollWidthReset = function noScrollWidthReset() {
    if (this.options.noScroll) {
        //浜戦噰涓嶆敮鎸佹嫋鍔紝鍚庣画鍐嶅畬鍠勬嫋鍔ㄤ箣鍚庣殑鎯呭喌
        /*if (this.hasNoScrollRest) {
            var nowW = 0;
            for (var i = 0; i < this.gridCompColumnArr.length; i++) {
                var column = this.gridCompColumnArr[i];
                var nowWidth = column.options.width;
                var pre = this.preWholeWidth - this.leftW;
                var whole = this.wholeWidth - this.leftW;
                var newWidth = parseInt(nowWidth / pre * whole);
                if(column.options.visible){
                    nowW += newWidth;
                }
                this.setColumnWidth(column, newWidth);
            }
         } else {*/
        //鍏堟寜100%鏉ュ鐞�
        var nowW = 0;
        for (var i = 0; i < this.gridCompColumnArr.length; i++) {
            var column = this.gridCompColumnArr[i];
            // var nowWidth = column.options.width + '';
            var nowWidth = column.options.optionsWidth + '';
            var whole = this.wholeWidth - this.leftW;

            if (nowWidth.indexOf('%') > 0) {
                var newWidth = parseInt(nowWidth.replace('%', '') * whole / 100);
            } else {
                var newWidth = parseInt(nowWidth);
            }
            if (newWidth < this.minColumnWidth) {
                newWidth = this.minColumnWidth;
            }
            if (column.options.visible) {
                nowW += parseInt(newWidth);
            }
            this.setColumnWidth(column, newWidth);
        }
        /*}*/
        this.hasNoScrollRest = true;
    }
    if (nowW > whole) {
        var lastVisibleColumn = this.lastVisibleColumn;
        var lastWidth = lastVisibleColumn.options.width;
        var newLastWidth = lastWidth - (nowW - whole);
        this.setColumnWidth(lastVisibleColumn, newLastWidth);
    }
};
var widthChangeGridFunFixed = function widthChangeGridFunFixed(halfWholeWidth) {};
var widthChangeGridFunOverWidthHidden = function widthChangeGridFunOverWidthHidden() {};
/*
 * 鏁翠綋楂樺害鏀瑰彉澶勭悊
 */
var heightChangeFun = function heightChangeFun() {
    if (this.countContentHeight) {
        var oldH = this.wholeHeight,
            h = $('#' + this.options.id)[0].offsetHeight;
        this.wholeHeight = h;
        if (oldH != h && h > 0) {
            var contentH = h - 1 - this.exceptContentHeight > 0 ? h - 1 - this.exceptContentHeight : 0;
            $('#' + this.options.id + '_content').css('height', contentH + 'px');
            $('#' + this.options.id + '_content_div').css('height', contentH + 'px');
        }
    }
};
/*
 * 鍐呭鍖哄搴︽敼鍙�
 */
var contentWidthChange = function contentWidthChange(newContentWidth) {
    if (newContentWidth < this.contentMinWidth) {
        var oldW = parseInt(this.lastVisibleColumn.options.width);
        this.lastVisibleColumnWidth = oldW + (this.contentMinWidth - newContentWidth);
        $('#' + this.options.id + '_header_table col:last').css('width', this.lastVisibleColumnWidth + "px");
        $('#' + this.options.id + '_content_table col:last').css('width', this.lastVisibleColumnWidth + "px");
        newContentWidth = this.contentMinWidth;
    }

    if (newContentWidth > this.contentMinWidth) {
        // 棣栧厛澶勭悊鎵╁睍鍒楃殑瀹藉害涓哄師鏈夊搴︼紝鐒跺悗鍐嶆墿灞曟渶鍚庝竴鍒�
        // 瑙ｅ喅dragdemo鎷栧姩鐨勮繃绋嬩腑浼氬鑷村搴﹂敊浣嶏紝涓嶅啀杩樺師瀹藉害
        // var l = this.overWidthVisibleColumnArr.length;
        // if (l > 0) {
        //     for (var i = 0; i < l; i++) {
        //         var overWidthColumn = this.overWidthVisibleColumnArr[i];
        //         var nowVisibleIndex = this.getVisibleIndexOfColumn(overWidthColumn);
        //         var w = parseInt(overWidthColumn.options.width);
        //         var realW = overWidthColumn.options.realWidth;
        //         $('#' + this.options.id + '_header_table col:eq(' + nowVisibleIndex + ')').css('width', realW + "px");
        //         $('#' + this.options.id + '_content_table col:eq(' + nowVisibleIndex + ')').css('width', realW + "px");
        //         newContentWidth = newContentWidth - (w - realW);
        //         overWidthColumn.options.width = overWidthColumn.options.realWidth;
        //     }
        //     if (newContentWidth < this.contentMinWidth) {
        //         var oldW = parseInt(this.lastVisibleColumn.options.width);
        //         this.lastVisibleColumnWidth = oldW + (this.contentMinWidth - newContentWidth);
        //         $('#' + this.options.id + '_header_table col:last').css('width', this.lastVisibleColumnWidth + "px");
        //         $('#' + this.options.id + '_content_table col:last').css('width', this.lastVisibleColumnWidth + "px");
        //         this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth;
        //         newContentWidth = this.contentMinWidth;
        //     }
        // }
        if (newContentWidth > this.contentMinWidth) {
            // $('#' + this.options.id + '_content_left_bottom').css('display', 'block');
            // $('#' + this.options.id + '_content_left_sum_bottom').css('bottom', 16);
        } else {
                // $('#' + this.options.id + '_content_left_bottom').css('display', 'none');
                // $('#' + this.options.id + '_content_left_sum_bottom').css('bottom', 0);
            }
    } else {
            // $('#' + this.options.id + '_content_left_bottom').css('display', 'none');
            // $('#' + this.options.id + '_content_left_sum_bottom').css('bottom', 0);
        }
    if (!this.options.noScroll) {
        $('#' + this.options.id + '_content_table').css('width', newContentWidth + "px");
        $('#' + this.options.id + '_header_table').css('width', newContentWidth + "px");
        $('#' + this.options.id + '_noRows').css('width', newContentWidth + "px");
    }

    return newContentWidth;
};
var wdChangeFunObj = {
    widthChangeFun: widthChangeFun,
    widthChangeGridFun: widthChangeGridFun,
    widthChangeGridFunFixed: widthChangeGridFunFixed,
    widthChangeGridFunOverWidthHidden: widthChangeGridFunOverWidthHidden,
    heightChangeFun: heightChangeFun,
    contentWidthChange: contentWidthChange,
    noScrollWidthReset: noScrollWidthReset
};

/*
 * 鍙屽嚮/鍗曞嚮澶勭悊
 */
var isDblEvent = function isDblEvent(eventname, dbFun, dbArg, Fun, Arg) {
    var nowTarget = dbArg.target;
    if (this.currentEventName != null && this.currentEventName == eventname && this.currentTarget != null && this.currentTarget == nowTarget) {
        dbFun.call(this, dbArg);
        this.currentEventName = null;
        this.currentTarget = null;
        if (this.cleanCurrEventName) clearTimeout(this.cleanCurrEventName);
    } else {
        var oThis = this;
        if (this.cleanCurrEventName) clearTimeout(this.cleanCurrEventName);
        this.currentEventName = eventname;
        this.currentTarget = nowTarget;
        this.cleanCurrEventName = setTimeout(function () {
            oThis.currentEventName = null;
            this.currentTarget = null;
            Fun.call(oThis, Arg);
        }, 250);
    }
};
/*
 * 鍙屽嚮澶勭悊
 */
var dblClickFun = function dblClickFun(e) {
    if (typeof this.options.onDblClickFun == 'function') {
        var $tr = $(e.target).closest('tr');
        if ($tr[0].id == this.options.id + '_edit_tr') {
            return;
        }
        var index = 0;
        if ($tr.length > 0) {
            index = this.getTrIndex($tr);
        }
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[index];
        obj.rowIndex = index;
        this.options.onDblClickFun(obj);
    }
};
/*
 * 鍗曞嚮澶勭悊
 */
var clickFun = function clickFun(e) {
    var oThis = this;

    // 澶勭悊focus浜嬩欢
    var $tr = $(e.target).closest('tr');
    if ($tr.length > 0 && $tr[0].id == this.options.id + '_edit_tr') {
        return;
    }
    var index = this.getTrIndex($tr);
    if (typeof this.options.onBeforeClickFun == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[index];
        obj.rowIndex = index;
        obj.e = e;
        if (!this.options.onBeforeClickFun(obj)) {
            return;
        }
    }
    // 澶勭悊鏍戣〃灞曞紑/鍚堜笂
    this.clickFunTree(e);
    if ($tr.length > 0) {

        var row = oThis.dataSourceObj.rows[index];
        if (row) {
            if (oThis.options.rowClickBan) {
                return;
            }
            this.clickFunEdit(e, index);
            var rowChildIndex = oThis.getChildRowIndex(row);
            if (oThis.options.contentFocus || !oThis.options.multiSelect) {
                if (oThis.dataSourceObj.rows[index].focus && oThis.options.cancelFocus) {
                    oThis.setRowUnFocus(index);
                } else {
                    if (!oThis.dataSourceObj.rows[index].focus) {
                        oThis.setRowFocus(index);
                    }
                }
            }
            if (oThis.options.contentSelect || !oThis.options.multiSelect) {
                if (oThis.dataSourceObj.rows[index].checked && oThis.options.cancelSelect) {
                    oThis.setRowUnselect(index);
                } else {
                    if (!oThis.dataSourceObj.rows[index].checked) {
                        oThis.setRowSelect(index);
                    }
                }
            }
        }
    }
};
var clickFunTree = function clickFunTree(e) {};
var clickFunEdit = function clickFunEdit(e) {};

var clickFunObj = {
    isDblEvent: isDblEvent,
    dblClickFun: dblClickFun,
    clickFun: clickFun,
    clickFunTree: clickFunTree,
    clickFunEdit: clickFunEdit
};

/*
 * 鏇存柊鏈€鍚庢暟鎹鏍囪瘑
 */
var updateLastRowFlag = function updateLastRowFlag() {
    // 鍏变韩鏈嶅姟鍔犵殑锛屾病鏈夊搴旂殑css鏆傛椂鍘绘帀
    return;
    var rows = $('#' + this.options.id + '_content_tbody').find('tr[role=row]');
    for (var i = 0, count = rows.length; i < count; i++) {
        if (i == count - 1) $(rows[i]).addClass('last-row');else $(rows[i]).removeClass('last-row');
    }
};
var updateNumColLastRowFlag = function updateNumColLastRowFlag() {
    // 鍏变韩鏈嶅姟鍔犵殑锛屾病鏈夊搴旂殑css鏆傛椂鍘绘帀
    return;
    var numCols = $('#' + this.options.id + '_content_numCol').find('.u-grid-content-num');
    for (var i = 0, count = numCols.length; i < count; i++) {
        if (i == count - 1) $(numCols[i]).addClass('last-row');else $(numCols[i]).removeClass('last-row');
    }
};

/*
 * column鏄惁鏄剧ず澶勭悊锛屽彧鍦ㄥ垵濮嬪寲gridCompColumn瀵硅薄鏃惰皟鐢紝鍏朵粬鏃跺€欎笉鍐嶈皟鐢�
 * 璁＄畻鍥哄畾鍖哄煙鍙婂唴瀹瑰尯鍩熺殑鐪熷疄瀹藉害
 * 璁＄畻绗竴鍒�
 * 璁＄畻鍐呭鍖哄煙鏈€鍚庝竴鍒楁樉绀哄垪
 */
var columnsVisibleFun = function columnsVisibleFun() {
    var oThis = this,
        w = 0;
    this.firstColumn = true;
    this.overWidthVisibleColumnArr = new Array();
    $.each(this.gridCompColumnArr, function () {
        if (this.options.visible) {
            w += parseInt(this.options.width);
            if (this.options.width > this.options.realWidth) {
                oThis.overWidthVisibleColumnArr.push(this);
            }
            this.firstColumn = oThis.firstColumn;
            oThis.firstColumn = false;
            oThis.lastVisibleColumn = this;
            oThis.lastVisibleColumnWidth = this.options.width;
        }
    });
    this.contentRealWidth = w;
};

var resetLastVisibleColumnWidth = function resetLastVisibleColumnWidth() {
    var allVisibleColumns = this.getAllVisibleColumns();
    var l = allVisibleColumns.length;
    var w = 0;
    var lastW = 0;
    for (var i = 0; i < allVisibleColumns.length; i++) {
        var column = allVisibleColumns[i];
        if (i == l - 1 - this.options.expandColumnIndex) {
            lastW = column.options.realWidth;
            this.lastVisibleColumn = column;
        } else {
            w += column.options.width;
        }
    }
    if (w < this.contentMinWidth) {
        var lw = this.contentMinWidth - w;
        if (lw > lastW) lastW = lw;
    }
    this.lastVisibleColumnWidth = lastW;
    this.lastVisibleColumn.options.width = lastW;
    if (this.options.expandColumnIndex == 0) {
        $('#' + this.options.id + '_header_table col:last').css('width', this.lastVisibleColumnWidth + "px");
        $('#' + this.options.id + '_content_table col:last').css('width', this.lastVisibleColumnWidth + "px");
    } else {
        var eqIndex = l - this.options.expandColumnIndex - 1;
        $('#' + this.options.id + '_header_table col:eq(' + eqIndex + ')').css('width', this.lastVisibleColumnWidth + "px");
        $('#' + this.options.id + '_content_table col:eq(' + eqIndex + ')').css('width', this.lastVisibleColumnWidth + "px");
    }
};
/*
 * 鍒涘缓瀹屾垚涔嬪悗澶勭悊鍙橀噺
 */
var resetThVariable = function resetThVariable() {
    if (this.showType != 'grid') return;
    var oThis = this;
    this.contentWidth = 0;

    // 璁板綍姣忓垪瀹藉害鍙婂綋鍓嶅搴︿箣鍜�
    $('#' + this.options.id + '_header_table th', this.$ele).each(function (i) {
        //浼氬嚭鐜皌h澶氫簬鍒楃殑鎯呭喌锛屽彂鐜伴棶棰樹箣鍚庡啀鐪嬩笅涓轰粈涔�
        var gridCompColumn = oThis.gridCompColumnArr[i];
        var w = 0;
        if (gridCompColumn.options.visible) {
            w = parseInt(gridCompColumn.options.width);
        }
        this.attrLeftTotalWidth = oThis.contentWidth;
        oThis.contentWidth += w;
        oThis.resetThVariableDrag(this, gridCompColumn, w);
        this.gridCompColumn = gridCompColumn;
        this.attrWidth = w;
        this.attrRightTotalWidth = oThis.contentWidth;
    });
    oThis.resetThVariableHeaderLevel();
};
var resetThVariableDrag = function resetThVariableDrag(nowTh, gridCompColumn) {};
var resetThVariableHeaderLevel = function resetThVariableHeaderLevel() {};

/*
 * 淇敼绗竴鍒楃殑css
 */
var headerFirstClassFun = function headerFirstClassFun() {
    $('#' + this.options.id + '_grid .u-grid-header-th-first').removeClass('u-grid-header-th-first');
    $('#' + this.options.id + '_grid').find('th').eq(0).addClass('u-grid-header-th-first');
};

/*
 * 鏍规嵁filed璁剧疆renderType
 */
var setRenderType = function setRenderType(field, renderType) {
    var gridCompColumn = this.getColumnByField(field);
    gridCompColumn.options.renderType = renderType;
    var index = this.getIndexOfColumn(gridCompColumn);
    this.renderTypeByColumn(gridCompColumn, index);
};
/*
 * 璁剧疆鏄惁鏄剧ずheader
 */
var setShowHeader = function setShowHeader(showHeader) {
    this.options.showHeader = showHeader;
    if (showHeader) {
        $('#' + this.options.id + '_header').css('display', "block");
    } else {
        $('#' + this.options.id + '_header').css('display', "none");
    }
};
/*
 * 璁剧疆鏁版嵁鍒楃殑绮惧害
 */
var setColumnPrecision = function setColumnPrecision(field, precision) {
    var gridColumn = this.getColumnByField(field);
    gridColumn.options.precision = precision;
    this.renderTypeFun();
    if (this.options.showSumRow) {
        this.repairSumRow();
    }
};
var setMultiSelect = function setMultiSelect(multiSelect) {
    var oldMultiSelect = this.options.multiSelect;
    if (oldMultiSelect != multiSelect) {
        this.options.multiSelect = multiSelect;
        this.initGrid();
    }
};
var setShowNumCol = function setShowNumCol(showNumCol) {
    var oldShowNumCol = this.options.showNumCol;
    if (oldShowNumCol != showNumCol) {
        this.options.showNumCol = showNumCol;
        this.initGrid();
    }
};
var isGridShow = function isGridShow() {
    if (this.showType == 'grid') return true;
    return false;
};
var getBoolean = function getBoolean(value) {
    if (value === 'true' || value === true) return true;
    return false;
};
var otherFunObj = {
    updateLastRowFlag: updateLastRowFlag,
    updateNumColLastRowFlag: updateNumColLastRowFlag,
    columnsVisibleFun: columnsVisibleFun,
    resetThVariable: resetThVariable,
    resetThVariableDrag: resetThVariableDrag,
    resetThVariableHeaderLevel: resetThVariableHeaderLevel,
    headerFirstClassFun: headerFirstClassFun,
    setRenderType: setRenderType,
    setShowHeader: setShowHeader,
    setColumnPrecision: setColumnPrecision,
    setMultiSelect: setMultiSelect,
    setShowNumCol: setShowNumCol,
    isGridShow: isGridShow,
    resetLastVisibleColumnWidth: resetLastVisibleColumnWidth,
    getBoolean: getBoolean
};

/*
 * 瀵瑰搴﹀拰楂樺害杩涜澶勭悊
 */
var formatWidth = function formatWidth(w) {
    // 鑾峰緱瀹藉害
    if (w) {
        return (w + "").indexOf("%") > 0 ? w : parseInt(w) + "px";
    } else {
        return '';
    }
};
/*
 * 涓や釜鍏冪礌浜ゆ崲浣嶇疆锛岃姹備紶鍏ュ弬鏁癳1鍦╡2涔嬪墠
 */
var swapEle = function swapEle(e1, e2) {
    var n = e1.next(),
        p = e2.prev();
    e2.insertBefore(n);
    e1.insertAfter(p);
};
var getString = function getString(value, defaultValue) {
    if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === "") {
        value = defaultValue;
    }
    if (gridBrowser.isIE8) {
        return [value].join("");
    } else {
        return value + "";
    }
};
var getInt = function getInt(value, defaultValue) {
    if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === "" || isNaN(value)) {
        value = defaultValue;
    }
    return value;
};
var getFloat = function getFloat(value, defaultValue) {
    if (value === null || value === undefined || value === 'null' || value === 'undefined' || value === "" || isNaN(value)) {
        value = defaultValue;
    }
    return value;
};
/*
 * 鍏嬮殕瀵硅薄
 */
var cloneObj = function cloneObj(obj) {
    var o;
    if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) == "object") {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    o.push(this.cloneObj(obj[i]));
                }
            } else {
                o = {};
                for (var k in obj) {
                    o[k] = this.cloneObj(obj[k]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
};
/*
 * 澶勭悊绮惧害
 */
var DicimalFormater = function DicimalFormater(obj) {
    var value = obj.value + '',
        precision = obj.precision;
    for (var i = 0; i < value.length; i++) {
        if ("-0123456789.".indexOf(value.charAt(i)) == -1) return "";
    }
    return checkDicimalInvalid(value, precision);
};
var checkDicimalInvalid = function checkDicimalInvalid(value, precision) {
    if (value == null || isNaN(value)) return "";
    // 娴偣鏁版€讳綅鏁颁笉鑳借秴杩�10浣�
    var digit = parseFloat(value);
    var result = (digit * Math.pow(10, precision) / Math.pow(10, precision)).toFixed(precision);
    if (result == "NaN") return "";
    return result;
};
var accAdd = function accAdd(v1, v2) {
    var r1, r2, m;
    try {
        r1 = v1.toString().split('.')[1].length;
    } catch (e) {
        r1 = 0;
    }
    try {
        r2 = v2.toString().split('.')[1].length;
    } catch (e) {
        r2 = 0;
    }
    m = Math.pow(10, Math.max(r1, r2));
    return (v1 * m + v2 * m) / m;
};
var getTrIndex = function getTrIndex($tr) {
    return $('tr[id!="' + this.options.id + '_edit_tr"][role="row"]', $tr.parent()).index($tr);
};

var getDataTableRowIdByRow = function getDataTableRowIdByRow(row) {
    return row.value['$_#_@_id'];
};

/**
 * 鎸夊瓧鑺傛暟鎴彇瀛楃涓� 渚�:"e鎴戞槸d".nLen(4)灏嗚繑鍥�"e鎴�"
 */
String.prototype.substrCH = function (nLen) {
    var i = 0;
    var j = 0;
    while (i < nLen && j < this.length) {
        // 寰幆妫€鏌ュ埗瀹氱殑缁撴潫瀛楃涓蹭綅缃槸鍚﹀瓨鍦ㄤ腑鏂囧瓧绗�
        var charCode = this.charCodeAt(j);
        if (charCode > 256 && i == nLen - 1) {
            break;
        }
        //      else if(charCode >= 0x800 && charCode <= 0x10000){
        //          i = i + 3;
        //      }
        else if (charCode > 256) {
                // 杩斿洖鎸囧畾涓嬫爣瀛楃缂栫爜锛屽ぇ浜�265琛ㄧず鏄腑鏂囧瓧绗�
                i = i + 2;
            } //鏄腑鏂囧瓧绗︼紝閭ｈ鏁板鍔�2
            else {
                    i = i + 1;
                } //鏄嫳鏂囧瓧绗︼紝閭ｈ鏁板鍔�1
        j = j + 1;
    }
    return this.substr(0, j);
};

var SortByFun = function SortByFun(field, sortType, eqCall) {
    var oThis = this;
    return function (a, b) {
        var v1 = $(a.value).attr(field);
        var v2 = $(b.value).attr(field);
        var dataType = oThis.getColumnByField(field).options.dataType;
        if (dataType == 'Float') {
            v1 = parseFloat(v1);
            v2 = parseFloat(v2);
            if (isNaN(v1)) {
                return 1;
            }
            if (isNaN(v2)) {
                return -1;
            }
            if (v1 == v2 && eqCall) {
                return eqCall.apply(oThis, arguments);
            }
            return sortType == 'asc' ? v1 - v2 : sortType == 'desc' ? v2 - v1 : 0;
        } else if (dataType == 'Int') {
            v1 = parseInt(v1);
            v2 = parseInt(v2);
            if (isNaN(v1)) {
                return 1;
            }
            if (isNaN(v2)) {
                return -1;
            }
            if (v1 == v2 && eqCall) {
                return eqCall.apply(oThis, arguments);
            }
            return sortType == 'asc' ? v1 - v2 : sortType == 'desc' ? v2 - v1 : 0;
        } else {
            v1 = oThis.getString(v1, '');
            v2 = oThis.getString(v2, '');
            try {
                var rsl = v1.localeCompare(v2);
                if (rsl === 0 && eqCall) {
                    return eqCall.apply(oThis, arguments);
                }
                if (rsl === 0) {
                    return 0;
                }
                return sortType == 'asc' ? rsl : sortType == 'desc' ? -rsl : 0;
            } catch (e) {
                return 0;
            }
        }
    };
};

var getGridRow = function getGridRow(row) {
    var obj = {};
    var nullField = this.options.nullField;
    if (nullField) {
        if (nullField.indexOf(';') > 0) {
            var nullFields = nullField.split(';');
            for (var i = 0; i < nullFields.length; i++) {
                var f = nullFields[i];
                row[f] = null;
            }
        } else {
            row[nullField] = null;
        }
    }
    return row;
};

var utilFunOjb = {
    formatWidth: formatWidth,
    swapEle: swapEle,
    getString: getString,
    getInt: getInt,
    getFloat: getFloat,
    cloneObj: cloneObj,
    DicimalFormater: DicimalFormater,
    accAdd: accAdd,
    getTrIndex: getTrIndex,
    getDataTableRowIdByRow: getDataTableRowIdByRow,
    SortByFun: SortByFun,
    getGridRow: getGridRow
};

var re_initGridCompColumnColumnMenuFun = function re_initGridCompColumnColumnMenuFun(columnOptions) {
    var column1 = new this.gridCompColumn(columnOptions, this);
    column1.options.realWidth = column1.options.width;
    this.basicGridCompColumnArr.push(column1);
};

var colMenu_initGridCompColumn = function colMenu_initGridCompColumn() {
    // 鎵╁睍鏂规硶
    this.menuColumnsHeight = this.gridCompColumnArr.length * this.columnMenuHeight;
};

var re_createColumnMenu = function re_createColumnMenu() {
    if (this.options.columnMenuType == 'base') {
        return re_createColumnMenu_base.call(this);
    } else if (this.options.columnMenuType == 'border') {
        return re_createColumnMenu_border.call(this);
    }
};

var re_createColumnMenu_base = function re_createColumnMenu_base() {
    var oThis = this;
    var htmlStr = '<div class="u-grid-column-menu" id="' + this.options.id + '_column_menu">';
    htmlStr += '<ul data-role="menu" role="menubar" class="u-grid-column-menu-ul" id="' + this.options.id + '_column_menu_ul">';

    // 鍒涘缓娓呴櫎璁剧疆
    htmlStr += '<li class="u-grid-column-menu-li" role="menuitem">';
    htmlStr += '<div class="u-grid-column-menu-div1" id="' + this.options.id + '_clearSet">';
    htmlStr += '<span class="u-grid-column-menu-span">' + this.transMap.ml_clear_set + '</span>';
    htmlStr += '</div></li>';

    htmlStr += '<div class="u-grid-column-menu-columns" id="' + this.options.id + '_column_menu_columns">';
    htmlStr += '<ul data-role="menu" role="menubar" class="u-grid-column-menu-columns-ul" id="' + this.options.id + '_column_menu_columns_ul">';
    $.each(this.gridCompColumnArr, function (i) {
        if (oThis.getString(this.options.title, '') != '') {
            var styleStr = '';
            if (!this.options.canVisible) styleStr += ' style="display:none;"';
            htmlStr += '<li class="u-grid-column-menu-columns-li" role="menuitem" index="' + i + '" ' + styleStr + '>';
            htmlStr += '<div class="u-grid-column-menu-columns-div1">';
            var checkedStr = "";
            if (this.options.visible) checkedStr = ' checked';

            htmlStr += '<div class="u-grid-column-menu-columns-div2"><input type="checkbox" ' + checkedStr + '><label></label></div>';
            htmlStr += '<span class="u-grid-column-menu-columns-span">' + this.options.title + '</span>';
            htmlStr += '</div></li>';
        }
    });
    htmlStr += '</ul></div>';

    htmlStr += '</ul></div>';

    // 鍒涘缓鏁版嵁鍒楀尯鍩�

    return htmlStr;
};

var re_createColumnMenu_border = function re_createColumnMenu_border() {
    var oThis = this;
    var htmlStr = '<div class="u-grid-column-menu-border" id="' + this.options.id + '_column_menu">';
    htmlStr += '<ul data-role="menu" role="menubar" class="u-grid-column-menu-ul-border" id="' + this.options.id + '_column_menu_ul">';

    var columnHtmlStr = '<div class="u-grid-column-menu-columns" id="' + this.options.id + '_column_menu_columns">';
    columnHtmlStr += '<ul data-role="menu" role="menubar" class="u-grid-column-menu-columns-ul-border" id="' + this.options.id + '_column_menu_columns_ul">';
    var allCheckFlag = true;
    $.each(this.gridCompColumnArr, function (i) {
        if (oThis.getString(this.options.title, '') != '') {
            var styleStr = '';
            if (!this.options.canVisible) styleStr += ' style="display:none;"';
            columnHtmlStr += '<li class="u-grid-column-menu-columns-li" role="menuitem" index="' + i + '" ' + styleStr + '>';
            columnHtmlStr += '<div class="u-grid-column-menu-columns-div1-border">';
            var checkedStr = "";
            if (this.options.visible) checkedStr = ' checked';

            if (this.options.canVisible && !this.options.visible) allCheckFlag = false;
            columnHtmlStr += '<div class="u-grid-column-menu-columns-div2-border"><input type="checkbox" ' + checkedStr + '><label></label></div>';
            columnHtmlStr += '<span class="u-grid-column-menu-columns-span-border">' + this.options.title + '</span>';
            columnHtmlStr += '</div></li>';
        }
    });
    columnHtmlStr += '</ul></div>';
    var checkedStr = '';
    if (allCheckFlag) checkedStr = ' checked ';
    var headerHtmlStr = '<li class="u-grid-column-menu-columns-li header" role="menuitem">';
    headerHtmlStr += '<div class="u-grid-column-menu-columns-div1-border">';
    headerHtmlStr += '<div class="u-grid-column-menu-columns-div2-border"><input type="checkbox" ' + checkedStr + '><label></label>&nbsp;鏄剧ず</div>';
    headerHtmlStr += '<span class="u-grid-column-menu-columns-span-border" style="text-align:center;">椤圭洰鍚嶇О</span>';
    headerHtmlStr += '</div></li>';

    htmlStr += headerHtmlStr;
    htmlStr += columnHtmlStr;

    htmlStr += '</ul>';
    // 鍒涘缓娓呴櫎璁剧疆
    htmlStr += '<div class="u-grid-column-menu-div1-border" id="' + this.options.id + '_clearSet">';
    htmlStr += '<span class="u-grid-column-menu-span-border">' + this.transMap.ml_clear_set + '</span>';
    htmlStr += '</div>';
    htmlStr += '</div>';

    // 鍒涘缓鏁版嵁鍒楀尯鍩�

    return htmlStr;
};

var colMenu_initEventFun = function colMenu_initEventFun() {
    // 鎵╁睍鏂规硶
    var oThis = this;
    $('#' + this.options.id).on('mouseup', function (e) {
        if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
            // 鐐瑰嚮鐨勬槸header鍖哄煙
            oThis.mouseUpX = e.clientX;
            oThis.mouseUpY = e.clientY;
            //鐐瑰嚮杩囩▼涓紶鏍囨病鏈夌Щ鍔�
            if (oThis.mouseDownX == oThis.mouseUpX && oThis.mouseDownY == oThis.mouseUpY) {
                //鎴栬€呯Щ鍔ㄨ窛绂诲皬浜�5px(鐢变簬绉诲姩涔嬪悗浼氭樉绀哄睆骞昫iv锛屾殏鏃朵笉鍋氬鐞�)
                oThis.columnClickX = e.clientX;
                oThis.columnClickY = e.clientY;
                var eleTh = $(e.target).closest('th')[0];
                if ($(e.target).hasClass('u-grid-header-columnmenu')) {
                    //鐐瑰嚮鐨勬槸columnmenu
                    $('#' + oThis.options.id + '_column_menu').css('display', 'block');

                    // 鏍规嵁鐐瑰嚮浣嶇疆鏉ユ樉绀篶olumn menu鍖哄煙
                    if (oThis.options.columnMenuType == 'base') {
                        var left = e.clientX - 160;
                    } else if (oThis.options.columnMenuType == 'border') {
                        var left = e.clientX - 240;
                    }

                    if (left < 0) left = 0;
                    var top = e.clientY + 10;
                    $('#' + oThis.options.id + '_column_menu').css('left', left);
                    $('#' + oThis.options.id + '_column_menu').css('top', top);
                    /*鏁版嵁鍒楀鐨勬儏鍐典笅澶勭悊鏄剧ず鐨勯珮搴�*/

                    var sX = $(window).width();
                    var sH = $(window).height();

                    // 濡傛灉鏁版嵁鍒楅珮搴﹂珮浜庡睆骞曢珮搴﹀垯鏁版嵁鍒楅珮搴﹁缃负灞忓箷楂樺害-10锛�
                    var columnsHeight = oThis.menuColumnsHeight;
                    if (oThis.menuColumnsHeight + top + 34 > sH) {
                        columnsHeight = sH - top - 34;
                        $('#' + oThis.options.id + '_column_menu_columns').css('height', columnsHeight + 'px');
                    } else {
                        $('#' + oThis.options.id + '_column_menu_columns').css('height', '');
                    }
                    oThis.ele.createColumnMenuFlag = true;
                } else {}
            }
        } else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
            // 鐐瑰嚮鐨勬槸鏁版嵁鍖哄煙

        }
    });

    $(document).on('click', function () {
        if (oThis.columnMenuMove == false && oThis.ele.createColumnMenuFlag == false) {
            if (oThis.ele.offsetWidth > 0) $('#' + oThis.options.id + '_column_menu').css('display', 'none');
        }
        oThis.ele.createColumnMenuFlag = false;
    });
    $(document).on('scroll', function () {
        if (oThis.columnMenuMove == false && oThis.ele.createColumnMenuFlag == false) {
            if (oThis.ele.offsetWidth > 0) $('#' + oThis.options.id + '_column_menu').css('display', 'none');
        }
        oThis.ele.createColumnMenuFlag = false;
    });
};

var colMenu_initGridEventFun = function colMenu_initGridEventFun() {
    // 鎵╁睍鏂规硶
    var oThis = this;

    /*header 鎸夐挳澶勭悊寮€濮�*/
    // column鎸夐挳
    $('#' + this.options.id + '_column_menu_ul').off('mousemove');
    $('#' + this.options.id + '_column_menu_ul').on('mousemove', function (e) {
        oThis.columnMenuMove = true;
    });
    $('#' + this.options.id + '_column_menu_ul').off('mouseout');
    $('#' + this.options.id + '_column_menu_ul').on('mouseout', function (e) {
        oThis.columnMenuMove = false;
    });

    // 娓呴櫎璁剧疆鎸夐挳
    $('#' + this.options.id + '_clearSet').off('click');
    $('#' + this.options.id + '_clearSet').on('click', function (e) {
        oThis.clearLocalData();
        oThis.initGridCompColumn();
        oThis.hasNoScrollRest = false;
        oThis.noScrollWidthReset();
        // 娓呴櫎鎺掑簭
        oThis.dataSourceObj.sortRows();
        oThis.repaintGridDivs();
        if (typeof oThis.options.onClearSetFun == 'function') {
            oThis.options.onClearSetFun(oThis);
        }
    });
    // 鏄剧ず/闅愯棌鍒� 瀵瑰簲鎵€鏈夊垪鐨勭偣鍑诲鐞�
    $('#' + this.options.id + '_column_menu_columns_ul li input').off('click');
    $('#' + this.options.id + '_column_menu_columns_ul li input').on('click', function (e) {
        //寰呭畬鍠� 浼樺寲涓巐i鐨刢lick鐨勪唬鐮佹暣鍚�
        var index = $(this).closest('li').attr('index');

        if (oThis.gridCompColumnArr[index].options.visible) {
            $(this)[0].checked = false;
            var ll = $('input:checked', $('#' + oThis.options.id + '_column_menu_columns_ul')).length;
            if (ll == 0) {
                $(this)[0].checked = true;
                return;
            }

            if (document.documentMode == 8) {
                var oldScrollTop = $('#' + oThis.options.id + '_column_menu_columns')[0].scrollTop;
                var oldTop = $('#' + oThis.options.id + '_column_menu')[0].style.top;
                var oldLeft = $('#' + oThis.options.id + '_column_menu')[0].style.left;
                oThis.gridCompColumnArr[index].options.visible = false;
                oThis.repaintGridDivs();
                $('#' + oThis.options.id + '_column_menu').css('display', 'block');
                $('#' + oThis.options.id + '_column_menu').css('left', oldLeft);
                $('#' + oThis.options.id + '_column_menu').css('top', oldTop);
                $('#' + oThis.options.id + '_column_menu_columns')[0].scrollTop = oldScrollTop;
            } else {
                oThis.setColumnVisibleByIndex(index, false);
                oThis.gridCompColumnArr[index].options.visible = false;
            }
        } else {
            $(this)[0].checked = true;

            if (document.documentMode == 8) {
                var oldScrollTop = $('#' + oThis.options.id + '_column_menu')[0].scrollTop;
                var oldTop = $('#' + oThis.options.id + '_column_menu')[0].style.top;
                var oldLeft = $('#' + oThis.options.id + '_column_menu')[0].style.left;
                oThis.gridCompColumnArr[index].options.visible = true;
                oThis.repaintGridDivs();
                $('#' + oThis.options.id + '_column_menu').css('display', 'block');
                $('#' + oThis.options.id + '_column_menu').css('left', oldLeft);
                $('#' + oThis.options.id + '_column_menu').css('top', oldTop);
                $('#' + oThis.options.id + '_column_menu_columns')[0].scrollTop = oldScrollTop;
            } else {
                oThis.setColumnVisibleByIndex(index, true);
                oThis.gridCompColumnArr[index].options.visible = true;
            }
        }
        oThis.saveGridCompColumnArrToLocal();
        e.stopPropagation();
    });
    $('#' + this.options.id + '_column_menu_columns_ul li').off('click');
    $('#' + this.options.id + '_column_menu_columns_ul li').on('click', function (e) {
        var inputDom = $(this).find('input');
        inputDom.click();
    });

    // $('#grid2_column_menu_ul .header input')
    $('#' + this.options.id + '_column_menu_ul .header input').on('click', function (e) {
        var nowCheck = $(this)[0].checked;
        $.each(oThis.gridCompColumnArr, function (i) {
            oThis.setColumnVisibleByColumn(this, nowCheck);
        });
    });
    /*header 鎸夐挳澶勭悊缁撴潫*/
};

var re_createHeaderDrag = function re_createHeaderDrag() {
	return '<div class="u-grid-header-resize-handle" id="' + this.options.id + '_resize_handle"><div class="u-grid-header-resize-handle-inner"></div></div>';
};

var drag_initEventFun = function drag_initEventFun() {
	// 鎵╁睍鏂规硶
	var oThis = this;

	$('#' + this.options.id).on('mousemove', function (e) {
		if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
			// 鍦╤eader鍖哄煙绉诲姩
			var eleTh = $(e.target).closest('th')[0];
			// 灏嗗叾浠栧垪鐨勬搷浣滄寜閽殣钘忥紝鏄剧ず褰撳墠鍒楃殑
			oThis.headerThDrag(e, eleTh);
		}

		oThis.dragFun(e);
		// e.stopPropagation();
	});
	$('#' + this.options.id + '_top').on('mousemove', function (e) {
		oThis.dragFun(e);
		e.stopPropagation();
	});

	$('#' + this.options.id).on('mouseup', function (e) {
		oThis.dragEnd(e);
	});

	$('#' + this.options.id + '_top').on('mouseup', function (e) {
		oThis.dragEnd(e);
	});
};

var drag_initGridEventFun = function drag_initGridEventFun() {
	// 鎵╁睍鏂规硶
	var oThis = this;
	$('#' + this.options.id + '_resize_handle').on('mousedown', function (e) {
		oThis.dragStart(e);
		// return false;
	});
};
/*
 * 鎷栧姩寮€濮�
 */
var dragStart = function dragStart(e) {
	this.dragFlag = true;
	this.dragW = null;
	this.dragStartX = e.clientX;
};
/*
 * 鏀瑰彉鍒楀搴﹀鐞�
 */
var dragFun = function dragFun(e) {
	if (this.dragFlag) {
		var nowTh = $('#' + this.options.id + '_resize_handle')[0].nowTh,
		    $nowTh = $(nowTh),
		    nowThIndex = $nowTh.attr('index'),
		    column = this.gridCompColumnArr[nowThIndex],
		    nowVisibleThIndex = this.getVisibleIndexOfColumn(column);
		if (nowTh && column != this.lastVisibleColumn) {
			this.dragEndX = e.clientX;
			var changeWidth = parseInt(this.dragEndX) - parseInt(this.dragStartX),
			    newWidth = parseInt(nowTh.attrWidth) + parseInt(changeWidth),
			    cWidth = parseInt(this.contentWidth) + parseInt(changeWidth);
			if (newWidth > this.minColumnWidth) {
				if (this.options.noScroll) {
					// 涓嶆樉绀烘粴鍔ㄦ潯鐨勬儏鍐典笅锛屽綋鍓嶅垪鐨勮鍙橀噺瀵瑰悗闈竴鍒椾骇鐢熷奖鍝�
					var nextVisibleThIndex = this.getNextVisibleInidexOfColumn(column);
					if (nextVisibleThIndex > -1) {
						var nextColumn = this.getColumnByVisibleIndex(nextVisibleThIndex);
						if (!this.dragNextClomunWidth || this.dragNextClomunWidth < 0) this.dragNextClomunWidth = nextColumn.options.width;
					}
					var nextNewWidth = parseInt(this.dragNextClomunWidth) - parseInt(changeWidth);
					if (!(nextNewWidth > this.minColumnWidth)) {
						$('#' + this.options.id + '_top').css('display', 'block');
						return;
					}
				}
				if (!this.options.noScroll) {
					this.dragW = this.contentWidthChange(cWidth);
				}
				$('#' + this.options.id + '_header_table col:eq(' + nowVisibleThIndex + ')').css('width', newWidth + "px");
				$('#' + this.options.id + '_content_table col:eq(' + nowVisibleThIndex + ')').css('width', newWidth + "px");

				column.options.width = newWidth;
				column.options.realWidth = newWidth;
				column.options.optionsWidth = newWidth;
				if (this.options.noScroll) {
					$('#' + this.options.id + '_header_table col:eq(' + nextVisibleThIndex + ')').css('width', nextNewWidth + "px");
					$('#' + this.options.id + '_content_table col:eq(' + nextVisibleThIndex + ')').css('width', nextNewWidth + "px");
					nextColumn.options.width = nextNewWidth;
					nextColumn.options.realWidth = nextNewWidth;
					nextColumn.options.optionsWidth = nextNewWidth;
				}
			}
		}
		$('#' + this.options.id + '_top').css('display', 'block');
	}
};
/*
 * 鎷栧姩缁撴潫
 */
var dragEnd = function dragEnd(e) {
	if (this.dragFlag) {
		this.resetThVariable();
		this.saveGridCompColumnArrToLocal();
		this.resetLeftHeight();
	}
	this.dragNextClomunWidth = -1;
	// this.lastVisibleColumn.options.width = this.lastVisibleColumnWidth;
	if (this.dragW) this.contentWidth = this.dragW;
	$('#' + this.options.id + '_resize_handle')[0].nowTh = null;
	this.dragFlag = false;
	$('#' + this.options.id + '_top').css('display', 'none');
};

/*
 * 璁＄畻鎷栧姩div鎵€鍦ㄤ綅缃�
 */
var headerThDrag = function headerThDrag(e, ele) {
	if (!this.dragFlag && !this.swapColumnFlag && ele && ele.gridCompColumn && ele.gridCompColumn.options.canDrag && $('#' + this.options.id + '_resize_handle')[0].nowTh != ele) {
		var $ele = $(ele);
		$('#' + this.options.id + '_resize_handle').css('left', ele.attrRightTotalWidth - this.scrollLeft - 4 + this.leftW + this.fixedWidth);
		$('#' + this.options.id + '_resize_handle')[0].nowTh = ele;
	}
};
var re_resetThVariableDrag = function re_resetThVariableDrag(nowTh, gridCompColumn, width) {
	if (!$('#' + this.options.id + '_resize_handle')[0].nowTh && gridCompColumn.options.canDrag) {
		$('#' + this.options.id + '_resize_handle').css('left', width - 4 + this.leftW);
		$('#' + this.options.id + '_resize_handle')[0].nowTh = nowTh;
	}
};
var dragFunObj = {
	createHeaderDrag: re_createHeaderDrag,
	dragStart: dragStart,
	dragFun: dragFun,
	dragEnd: dragEnd,
	headerThDrag: headerThDrag,
	resetThVariableDrag: re_resetThVariableDrag,
	drag_initEventFun: drag_initEventFun,
	drag_initGridEventFun: drag_initGridEventFun
};

var re_hideEditMenu = function re_hideEditMenu() {
    $('#' + this.options.id + '_content_edit_menu').css('display', 'none');
};

var re_clickFunEdit = function re_clickFunEdit(e, index) {
    var $tr = $(e.target).closest('tr');
    var $td = $(e.target).closest('td');
    var colIndex = $td.index();
    if (this.options.editable && (this.eidtRowIndex != index || this.options.editType == 'default' && this.editColIndex != colIndex)) {
        this.editClose();
        this.editRowFun($tr, colIndex);
    }
};

var editRowFun = function editRowFun($tr, colIndex) {
    var index = this.getTrIndex($tr);
    if (typeof this.options.onBeforeEditFun == 'function') {
        var obj = {};
        obj.gridObj = this;
        obj.rowObj = this.dataSourceObj.rows[index];
        obj.rowIndex = index;
        obj.colIndex = colIndex;
        obj.$tr = $tr;
        if (!this.options.onBeforeEditFun(obj)) {
            if (this.eidtRowIndex != -1) {
                this.editClose();
            }
            return;
        }
    }
    if (this.eidtRowIndex != -1) {
        this.editClose();
    }
    var index = typeof $tr === 'number' ? $tr : this.getTrIndex($tr);
    this.eidtRowIndex = index;
    this.editColIndex = colIndex;
    this.editRow($tr, colIndex);
    return true;
};
var editRowIndexFun = function editRowIndexFun(i) {
    if (this.eidtRowIndex != -1) {
        this.editClose();
    }
    this.eidtRowIndex = i;
    this.editColIndex = 0;
    this.editRow();
};
/*
 * 鍒涘缓缂栬緫琛�
 */
var editRow = function editRow($tr, colIndex) {
    if (colIndex < 0) return;
    var oThis = this;
    var isFixedCol = false;
    if ($tr && $tr.parents('table').attr('id').indexOf('_fixed_') > -1) isFixedCol = true;
    $tr = $tr || $('#' + this.options.id + '_content_tbody tr[role="row"]:eq(' + this.eidtRowIndex + ')');
    colIndex = colIndex || 0;
    var row = this.dataSourceObj.rows[this.eidtRowIndex].value;
    this.editRowObj = this.cloneObj(row);
    if (this.options.editType == 'default') {
        var column = isFixedCol ? this.gridCompColumnFixedArr[colIndex] : this.gridCompColumnArr[colIndex];
        if (column && column.options.editable) {
            var td = $('td:eq(' + colIndex + ')', $tr)[0];
            var field = column.options.field;
            var value = $(row).attr(field);
            value = oThis.getString(value, '');
            var obj = {};
            obj.td = td;
            obj.value = value;
            obj.field = field;
            obj.editType = column.options.editType;
            obj.rowObj = oThis.editRowObj;
            obj.$tr = $tr;
            obj.colIndex = colIndex;
            oThis.editCell(obj);
        }
        $('#' + this.options.id + '_content_edit_menu').css('display', 'block');
        $('#' + this.options.id + '_content_edit_menu_cancel').css('marginLeft', '10px'); // 涓巉orm褰㈠紡鐩告瘮鍋忓乏
        var topIndex = $('tr:visible', $tr.parent()).index($tr);
        this.rowHeight = $tr.height(); // tianxq
        var t = this.rowHeight * (topIndex + 1) + this.headerHeight + 1;
    } else if (this.options.editType == 'form') {
        if (typeof this.options.formEditRenderFun == 'function') {
            if (this.fixedWidth > 0) {
                var table = $('#' + this.options.id + '_content_fixed_table')[0];
            } else {
                var table = $('#' + this.options.id + '_content_table')[0];
            }

            var tr = table.insertRow(this.eidtRowIndex + 2);
            tr.id = this.options.id + '_edit_tr';
            $(tr).addClass('grid_edit_form_tr');
            var cell = tr.insertCell();
            cell.id = this.options.id + '_edit_td';
            $(cell).addClass('grid_edit_form_td');
            cell.style.borderBottom = '0px';
            cell.style.background = '#fff';
            var cWidth = parseInt(this.contentMinWidth) + parseInt(this.fixedWidth);
            var htmlStr = '<div id="' + this.options.id + '_edit_form" class="u-grid-edit-form" style="width:' + cWidth + 'px;float:left;">';
            htmlStr += '</div>';
            cell.innerHTML = htmlStr;
            var obj = {};
            obj.grid = gridObj;
            obj.element = $('#' + this.options.id + '_edit_form')[0];
            obj.editRowObj = this.editRowObj;
            this.options.formEditRenderFun.call(this, obj);
            var htmlStr = '<div style="position:relative;float:left;width:100%;height:40px;"></div>';
            $('#' + this.options.id + '_edit_form')[0].insertAdjacentHTML('beforeEnd', htmlStr);
            var h = $('#' + this.options.id + '_edit_td')[0].offsetHeight;
            var color = $('#' + this.options.id + '_edit_form').css('background-color');
            if (this.options.multiSelect) {
                var $div = $('#' + this.options.id + '_content_multiSelect > div').eq(this.eidtRowIndex);
                var htmlStr = '<div class="grid_open_edit" id="' + this.options.id + '_multiSelect_edit" style="background-color:' + color + ';float:left;position:relative;width:' + this.multiSelectWidth + 'px;height:' + h + 'px"></div>';
                $div[0].insertAdjacentHTML('afterEnd', htmlStr);
            }
            if (this.options.showNumCol) {
                var $div = $('#' + this.options.id + '_content_numCol > .u-grid-content-num').eq(this.eidtRowIndex);
                var htmlStr = '<div id="' + this.options.id + '_numCol_edit" style="background-color:' + color + ';float:left;position:relative;width:' + this.numWidth + 'px;"></div>';
                $div[0].insertAdjacentHTML('afterEnd', htmlStr);
            }
            $('#' + this.options.id + '_content_edit_menu').css('display', 'block');

            if (this.fixedWidth > 0) {
                var table1 = $('#' + this.options.id + '_content_table')[0];
                var tr1 = table1.insertRow(this.eidtRowIndex + 2);
                tr1.id = this.options.id + '_edit_tr1';
            }
        } else {
            if (this.fixedWidth > 0) {
                var table = $('#' + this.options.id + '_content_fixed_table')[0];
            } else {
                var table = $('#' + this.options.id + '_content_table')[0];
            }

            var tr = table.insertRow(this.eidtRowIndex + 2);
            tr.id = this.options.id + '_edit_tr';
            $(tr).addClass('grid_edit_form_tr');
            var cell = tr.insertCell();
            cell.id = this.options.id + '_edit_td';
            $(cell).addClass('grid_edit_form_td');
            cell.style.borderBottom = '0px';
            var cWidth = parseInt(this.contentMinWidth) + parseInt(this.fixedWidth);
            var htmlStr = '<div id="' + this.options.id + '_edit_form" class="u-grid-edit-form" style="width:' + cWidth + 'px;float:left;">';
            $.each(this.gridCompColumnFixedArr, function (i) {
                var show = false;
                if (this.options.editFormShow && (this.options.editable || !this.options.editable && oThis.options.noneEditableFormShow)) {
                    show = true;
                }

                if (show) {
                    var field = this.options.field;
                    var value = $(row).attr(field);
                    value = oThis.getString(value, '');
                    var title = this.options.title;
                    var headerColor = this.options.headerColor;
                    htmlStr += oThis.formEditCell(value, field, title, this.options.required, headerColor);
                }
            });

            $.each(this.gridCompColumnArr, function (i) {
                var show = false;
                if (this.options.editFormShow && (this.options.editable || !this.options.editable && oThis.options.noneEditableFormShow)) {
                    show = true;
                }

                if (show) {
                    var field = this.options.field;
                    var value = $(row).attr(field);
                    value = oThis.getString(value, '');
                    var title = this.options.title;
                    var headerColor = this.options.headerColor;
                    htmlStr += oThis.formEditCell(value, field, title, this.options.required, headerColor);
                }
            });
            htmlStr += '</div>';
            cell.innerHTML = htmlStr;

            $.each(this.gridCompColumnFixedArr, function (i) {
                var show = false;
                if (this.options.editFormShow && (this.options.editable || !this.options.editable && oThis.options.noneEditableFormShow)) {
                    show = true;
                }

                if (show) {
                    var field = this.options.field;
                    var td = $('#' + oThis.options.id + '_edit_' + field)[0];
                    var value = $(row).attr(field);
                    var title = this.options.title;
                    value = oThis.getString(value, '');
                    var obj = {};
                    obj.td = td;
                    td.innerHTML = '<div class="u-grid-content-td-div" title=""></div>';
                    obj.value = value;
                    obj.field = field;
                    obj.editType = this.options.editType;
                    obj.rowObj = oThis.editRowObj;
                    obj.$tr = $tr;
                    obj.colIndex = colIndex;
                    htmlStr += oThis.editCell(obj);
                }
            });

            $.each(this.gridCompColumnArr, function (i) {
                var show = false;
                if (this.options.editFormShow && (this.options.editable || !this.options.editable && oThis.options.noneEditableFormShow)) {
                    show = true;
                }

                if (show) {
                    var field = this.options.field;
                    var td = $('#' + oThis.options.id + '_edit_' + field)[0];
                    var value = $(row).attr(field);
                    var title = this.options.title;
                    value = oThis.getString(value, '');
                    var obj = {};
                    obj.td = td;
                    td.innerHTML = '<div class="u-grid-content-td-div" title=""></div>';
                    obj.value = value;
                    obj.field = field;
                    obj.editType = this.options.editType;
                    obj.rowObj = oThis.editRowObj;
                    obj.$tr = $tr;
                    obj.colIndex = colIndex;
                    htmlStr += oThis.editCell(obj);
                }
            });

            if (typeof this.options.renderEditMemu == "function") {

                this.options.renderEditMemu.apply(this, [$('#' + this.options.id + '_edit_form')[0], this.eidtRowIndex, this.dataSourceObj.rows.length]);
            } else {
                var htmlStr = '<div id="' + this.options.id + '_content_edit_menu" style="position:relative;float:left;width:100%;height:40px;"><button type="button" class="u-grid-content-edit-menu-button u-grid-content-edit-menu-button-ok" id="' + this.options.id + '_content_edit_menu_close">' + this.transMap.ml_close + '</button></div>';

                $('#' + this.options.id + '_edit_form')[0].insertAdjacentHTML('beforeEnd', htmlStr);
                $('#' + this.options.id + '_content_edit_menu_close').on('click', function (e) {
                    oThis.editClose();
                });
            }
            // 澶勭悊宸︿晶鍖哄煙浣嶇疆
            var h = $('#' + this.options.id + '_edit_td')[0].offsetHeight;
            var color = $('#' + this.options.id + '_edit_form').css('background-color');
            if (this.options.multiSelect) {
                var $div = $('#' + this.options.id + '_content_multiSelect > div').eq(this.eidtRowIndex);
                var htmlStr = '<div class="grid_open_edit " id="' + this.options.id + '_multiSelect_edit" style="background-color:' + color + ';float:left;position:relative;width:' + this.multiSelectWidth + 'px;height:' + h + 'px"></div>';
                $div[0].insertAdjacentHTML('afterEnd', htmlStr);
            }
            if (this.options.showNumCol) {
                var $div = $('#' + this.options.id + '_content_numCol > .u-grid-content-num').eq(this.eidtRowIndex);
                var htmlStr = '<div id="' + this.options.id + '_numCol_edit" style="background-color:' + color + ';float:left;position:relative;width:' + this.numWidth + 'px;"></div>';
                $div[0].insertAdjacentHTML('afterEnd', htmlStr);
            }
            $('#' + this.options.id + '_content_edit_menu').css('display', 'block');

            if (this.fixedWidth > 0) {
                var table1 = $('#' + this.options.id + '_content_table')[0];
                var tr1 = table1.insertRow(this.eidtRowIndex + 2);
                tr1.id = this.options.id + '_edit_tr1';
            }
        }
    }
};
/*
 * 琛岀紪杈戝叧闂�
 */
var re_editClose = function re_editClose() {
    var dohideFlag = true; //鏍囪鏄惁鎵ц杩噃ide銆乥lur浜嬩欢
    if (this.eidtRowIndex < 0 || this.editColIndex < 0) return;
    var row = this.dataSourceObj.rows[this.eidtRowIndex];
    var editField = this.gridCompColumnArr[this.editColIndex].options.field;
    var inputDom = null;
    //鍦╟hrome涓�
    // if (dohideFlag && this.editComp && this.editComp.hide) {
    // 	this.editComp.hide();
    // 	dohideFlag = false;
    // }

    // try {
    // 	var inputDom = this.editComp.element.parentNode.querySelector('input');
    // } catch (e) {}

    // if (dohideFlag && inputDom) {
    // 	inputDom.blur();
    // 	dohideFlag = false;
    // }

    // if (dohideFlag && this.editComp && this.editComp.comp && this.editComp.comp.hide) {
    // 	this.editComp.comp.hide();
    // 	dohideFlag = false;
    // }
    // 鎸夌悊璇村簲璇ユ槸浣跨敤dohideFlag鍋氫负鏍囧織锛岃皟鐢╤ide鏂规硶灏变笉璧癰lur锛堝嵆涓婇潰娉ㄩ噴閭ｆ锛夈€備絾鏄负浜嗗吋瀹筰e鍦ㄧ涓€琛岃緭鍏モ€�32424鈥欙紝鐐瑰嚮绗簩琛岋紝鍦ㄥ洖鍒颁竴琛屽氨涓嶅彲杈撳叆浜�
    if (this.editComp && this.editComp.hide) {
        this.editComp.hide();
        dohideFlag = false;
    }

    try {
        var inputDom = this.editComp.element.parentNode.querySelector('input');
    } catch (e) {}

    if (inputDom) {
        inputDom.blur();
        dohideFlag = false;
    }

    if (this.editComp && this.editComp.comp && this.editComp.comp.hide) {
        this.editComp.comp.hide();
        dohideFlag = false;
    }
    try {
        $('#' + this.options.id + '_placeholder_div').remove();
    } catch (e) {}

    if (!row) return;
    if (this.options.editType != 'form') {
        //this.repaintRow(this.eidtRowIndex);
        var obj = {};
        obj.begin = this.eidtRowIndex;
        obj.length = 1;
        obj.field = editField;
        this.renderTypeFun(obj);
    }

    $('#' + this.options.id + '_content_edit_menu').css('display', 'none');
    this.repairSumRow();
    this.noRowsShowFun();
    this.updateLastRowFlag();
    this.eidtRowIndex = -1;
    // form褰㈠紡鍒犻櫎瀵瑰簲鍖哄煙,瀛樺湪鍒囨崲缂栬緫褰㈠紡鐨勬儏鍐碉紝鎵€浠ヤ竴鐩村垹闄�
    // if(this.options.editType == 'form'){
    $('#' + this.options.id + '_multiSelect_edit').remove(null, true);
    $('#' + this.options.id + '_numCol_edit').remove(null, true);
    $('#' + this.options.id + '_edit_tr').remove(null, true);
    $('#' + this.options.id + '_edit_tr1').remove(null, true);
    // }
};
/*
 * 缂栬緫鍗曞厓鏍�
 */
var editCell = function editCell(obj) {
    var td = obj.td;
    var value = obj.value;
    var field = obj.field;
    var editType = obj.editType;
    var rowObj = obj.rowObj;
    var $tr = obj.$tr;
    var colIndex = obj.colIndex;
    var oThis = this;
    if (obj.colIndex == 0) {
        try {
            this.iconSpan = '';
            this.iconSpan = $(td).find('.uf')[0].outerHTML;
        } catch (e) {}
    } else {
        this.iconSpan = '';
    }

    var obj = {};
    obj.td = td;
    obj.field = field;
    obj.$tr = $tr;
    obj.colIndex = colIndex;
    oThis.newEditObj = obj;

    if (editType == 'text') {
        if (this.options.editType == 'default') {
            td.innerHTML = '<div class="u-grid-content-td-div" style="position: relative; left: 0px;"><div class="eType-input"><input id="' + this.options.id + "_edit_field_" + field + '" type="text" value="' + value + '" field="' + field + '" style="width:100%;margin:0px;min-height:20px;font-size:12px;color:#444"></div></div>';
        } else {
            td.innerHTML = '<div class="u-grid-content-td-div" style="position: relative; left: 0px;"><div class="eType-input"><input id="' + this.options.id + "_edit_field_" + field + '" type="text" value="' + value + '" field="' + field + '"></div></div>';
        }
        $('input', $(td)).on('blur', function () {
            oThis.editValueChange(field, this.value);
        });
    } else if (typeof editType == 'function') {
        var obj = {};
        var $Div = $('.u-grid-content-td-div', $(td));
        $Div.removeClass('u-grid-content-td-div-over');
        obj.gridObj = this;
        obj.element = $Div[0];
        if (this.options.editType == 'default') {
            // 瀵逛簬楂樺害琚拺寮€鐨勬儏鍐甸渶瑕佹斁涓€涓� div鏉ユ妸鏁翠綋鎾戝紑
            var nowHeight = obj.element.offsetHeight;
            var editDivHtml = '<div id="' + this.options.id + '_placeholder_div" class="u-grid-edit-placeholder-div" style="height:' + nowHeight + 'px;"></div>';
            $Div[0].innerHTML = editDivHtml;
            obj.element = $('#' + this.options.id + '_placeholder_div')[0];
        }
        obj.value = value;
        obj.field = field;
        obj.rowObj = rowObj;
        editType.call(this, obj);
    }
    // input杈撳叆blur鏃舵樉绀轰笅涓€涓紪杈戞帶浠�
    $('input', $(td)).off('keydown');
    $('input', $(td)).on('keydown', function (e) {
        if (oThis.options.editType == 'form') {} else {
            var keyCode = e.keyCode;
            if (e.keyCode == 13 || e.keyCode == 9) {
                // 鍥炶溅
                this.blur(); //棣栧厛瑙﹀彂blur鏉ュ皢淇敼鍊煎弽搴斿埌datatable涓�
                // IE11浼氬鑷村厛瑙﹀彂nextEditShow鍚庤Е鍙慴lur鐨勫鐞�
                setTimeout(function () {
                    oThis.nextEditShow();
                }, 100);
                u.stopEvent(e);
            }
        }
    });
    if (this.options.editType == 'default') $('input:first', $(td)).focus();
};
/*
 * 瑙﹀彂涓嬩竴涓紪杈戝崟鍏冩牸
 */
var nextEditShow = function nextEditShow() {
    var obj = this.newEditObj;
    var td = obj.td;
    var $tr = obj.$tr;
    var colIndex = parseInt(obj.colIndex) + 1;
    // 濡傛灉鏄渶鍚庝竴鍒楀垯鎹㈣
    if ($(td).next('td').length == 0) {
        var $nextTr = $tr.next('tr');
        if ($nextTr.length > 0) {
            $tr = $nextTr;
            colIndex = 0;
            $tr.click(); //瑙﹀彂涓嬩竴琛岀殑鐒︾偣
        } else {
            return;
        }
    }

    colIndex = _getNextEditColIndex(this, colIndex, $tr);
    var column = this.gridCompColumnArr[colIndex];
    if (column) {
        this.editRowFun($tr, colIndex);
    } else {
        var $nextTr = $tr.next('tr');
        if ($nextTr.length > 0) {
            $tr = $nextTr;
            colIndex = 0;
            $tr.click(); //瑙﹀彂涓嬩竴琛岀殑鐒︾偣
        } else {
            return;
        }
        colIndex = _getNextEditColIndex(this, colIndex, $tr);
        var column = this.gridCompColumnArr[colIndex];
        if (column) {
            this.editRowFun($tr, colIndex);
        }
    }
};

var _getNextEditColIndex = function _getNextEditColIndex(gridObj, nowIndex, $tr) {
    // 濡傛灉涓嬩竴鍒椾负闅愯棌/涓嶅彲淇敼/澶嶉€夋鍒欒烦鍒颁笅涓€涓�
    var colIndex = -1;
    var column = gridObj.gridCompColumnArr[nowIndex];
    var beforeFlag = true;
    var index = gridObj.getTrIndex($tr);
    if (typeof gridObj.options.onBeforeEditFun == 'function') {
        var obj = {};
        obj.gridObj = gridObj;
        obj.rowObj = gridObj.dataSourceObj.rows[index];
        obj.rowIndex = index;
        obj.colIndex = nowIndex;
        obj.$tr = $tr;
        if (!gridObj.options.onBeforeEditFun(obj)) {
            beforeFlag = false;
        }
    }
    if (column && column.options && !column.options.visible || column && column.options && !column.options.editable || !beforeFlag) {
        colIndex = _getNextEditColIndex(gridObj, nowIndex + 1, $tr);
    } else {
        colIndex = nowIndex;
    }
    return colIndex;
};
var editValueChange = function editValueChange(field, value) {
    // 璁剧疆row鐨勫€间负鏂板€�
    if (this.eidtRowIndex > -1 && this.eidtRowIndex < this.dataSourceObj.rows.length) {
        this.updateValueAt(this.eidtRowIndex, field, value);
    }
};
var re_updateEditRowIndex = function re_updateEditRowIndex(opType, opIndex, num) {
    if (this.eidtRowIndex < 0) return;
    if (opType == '-') {
        if (opIndex < this.eidtRowIndex) {
            this.eidtRowIndex--;
        } else if (opIndex == this.eidtRowIndex) {
            this.eidtRowIndex = -1;
        }
    } else if (opType == '+') {
        num === undefined && (num = 1);
        if (opIndex <= this.eidtRowIndex) {
            this.eidtRowIndex += num;
        }
    }
};
var re_updateValueAtEdit = function re_updateValueAtEdit(rowIndex, field, value, force) {
    if (this.eidtRowIndex == rowIndex) {
        if (this.options.editType == 'form') {} else {
            if (this.gridCompColumnArr[this.editColIndex].options.field == field) this.eidtRowIndex = -1; //涓嬫媺閫変腑涔嬪悗eidtRowIndex渚濈劧涓哄師鏉ョ殑鍊硷紝鍚庣画闇€瑕佸垽鏂慨鏀瑰垪
        }

        if ($('#' + this.options.id + "_edit_field_" + field).length > 0) {
            if ($('#' + this.options.id + "_edit_field_" + field)[0].type == 'checkbox') {
                if (value == 'Y' || value == 'true' || value === true) {
                    $('#' + this.options.id + "_edit_field_" + field)[0].checked = true;
                } else {
                    $('#' + this.options.id + "_edit_field_" + field)[0].checked = false;
                }
            } else {
                $('#' + this.options.id + "_edit_field_" + field)[0].value = value;
            }
        }
    }
};
/*
 * 鏍规嵁filed璁剧疆editType
 */
var setEditType = function setEditType(field, editType) {
    var gridCompColumn = this.getColumnByField(field);
    gridCompColumn.options.editType = editType;
};
/*
 * 璁剧疆鏄惁鍙慨鏀�
 */
var setEditable = function setEditable(editable) {
    this.options.editable = editable;
    this.setColumnEdit();
    this.editClose();
};

var setColumnEdit = function setColumnEdit() {
    var i;
    for (i = 0; i < this.gridCompColumnArr.length; i++) {

        this.editFieldIcon(this.gridCompColumnArr[i]);
    }

    for (i = 0; i < this.gridCompColumnFixedArr.length; i++) {

        this.editFieldIcon(this.gridCompColumnFixedArr[i]);
    }
};

var editFieldIcon = function editFieldIcon(column) {
    var fieldDom = $('.u-grid-header-link[field=' + column.options.field + ']');
    var fieldEditIconDom = fieldDom.find('.uf-fontselectioneditor');
    if (this.options.showEditIcon && this.options.editable && column.options.editable) {

        if (!fieldEditIconDom) {
            fieldDom.append('<i class="uf uf-fontselectioneditor"></i>');
        }
        fieldDom.removeClass('u-grid-hide-title-icon');
    } else {
        fieldDom.addClass('u-grid-hide-title-icon');
    }
};

var edit_initEventFun = function edit_initEventFun() {
    var oThis = this;
    $(document).on('click', function (e) {
        if (oThis.options.editable && oThis.options.editType == 'default') {
            var $e = $(e.target);
            var flag = true;
            flag = $(e.target).closest('.u-grid-content-td-div').length > 0 ? false : flag;
            var cusStr = oThis.options.customEditPanelClass;
            if (cusStr) {
                var cArr = cusStr.split(',');
                $.each(cArr, function () {
                    flag = $e.closest('.' + this).length > 0 ? false : flag;
                });
            }
            if ($e.attr('role') == 'grid-for-edit') {
                flag = false;
            }
            if ($e.parent().length == 0) {
                flag = false;
            }
            if (flag) {
                oThis.editClose();
            }
        }
    });

    u.on(document, 'scroll', function () {
        if (oThis.options.editType == 'default') {
            if (gridBrowser.isIE10 || gridBrowser.isIPAD) {} else {
                oThis.editClose();
            }
        }
    });
    // 涓烘墍鏈塪iv娣诲姞鐩戝惉锛屾粴鍔ㄦ椂鎵цeditClose
    $('div').on('scroll', function () {
        if (oThis.options.editType == 'default') {
            if (gridBrowser.isIE10 || gridBrowser.isIPAD) {} else {
                oThis.editClose();
            }
        }
    });
};
var setGridEditType = function setGridEditType(newEditType) {
    this.options.editType = newEditType;
};
var setGridEditTypeAndEditRow = function setGridEditTypeAndEditRow(newEditType, rowIndex, colIndex) {
    this.options.editType = newEditType;
    var $contentBody = $('#' + this.options.id + '_content_tbody');
    var $tr = $('tr:eq(' + rowIndex + ')', $contentBody);
    this.editRowFun($tr, colIndex);
};

// 濡傛灉鍙紪杈戝鍔犱慨鏀瑰浘鏍�
var editHeadTitleIcon = function editHeadTitleIcon(column) {

    if (this.options.showEditIcon && this.options.editable && column.options.editable) {
        column.options.title += '<i class="uf uf-fontselectioneditor"></i>';
    }
};

var eidtFunObj = {
    hideEditMenu: re_hideEditMenu,
    clickFunEdit: re_clickFunEdit,
    editRowFun: editRowFun,
    editRowIndexFun: editRowIndexFun,
    editRow: editRow,
    editClose: re_editClose,
    editCell: editCell,
    nextEditShow: nextEditShow,
    editValueChange: editValueChange,
    updateEditRowIndex: re_updateEditRowIndex,
    updateValueAtEdit: re_updateValueAtEdit,
    setEditType: setEditType,
    setEditable: setEditable,
    setColumnEdit: setColumnEdit,
    editFieldIcon: editFieldIcon,
    setGridEditType: setGridEditType,
    setGridEditTypeAndEditRow: setGridEditTypeAndEditRow,
    editHeadTitleIcon: editHeadTitleIcon,
    edit_initEventFun: edit_initEventFun
};

var editForm_initDefault = function editForm_initDefault() {
	// 鎵╁睍鏂规硶
	this.defaults = $.extend(true, {}, this.defaults, {
		noneEditableFormShow: true // form缂栬緫鍣ㄦ槸鍚︽樉绀轰笉鍙紪杈戝瓧娈�
	});
};

var editForm_setRequired = function editForm_setRequired(field, value) {
	// 鎵╁睍鏂规硶
	var oThis = this;
	$.each(this.gridCompColumnArr, function (i) {
		if (this.options.field == field) {
			this.options.required = value;
			if (!value) {
				$('#' + oThis.options.id + '_edit_' + this.options.field).parent().find('.u-grid-edit-mustFlag').hide();
			} else {
				$('#' + oThis.options.id + '_edit_' + this.options.field).parent().find('.u-grid-edit-mustFlag').show();
			}
		}
	});
};

var re_editorRowChangeFun = function re_editorRowChangeFun() {
	if ($('#' + this.options.id + '_edit_form').length > 0) {
		var h = $('#' + this.options.id + '_edit_form')[0].offsetHeight;
		$('#' + this.options.id + '_numCol_edit').css('height', h);
		$('#' + this.options.id + '_multiSelect_edit').css('height', h);
	}
};
/*
 * form褰㈠紡涓嬬紪杈戝崟鍏冩牸
 */
var formEditCell = function formEditCell(value, field, title, required, headerColor) {
	// 鍒涘缓lable
	var st = title + '';
	if (st.lengthb() > 28) {
		st = st.substrCH(26) + '...';
	}
	var htmlStr = '<div class="u-grid-edit-whole-div"><div class="u-grid-edit-label"><div title="' + title + '" style="color:' + headerColor + '">' + st + '<span style="color:red;' + (!required ? 'display: none' : '') + '" class="u-grid-edit-mustFlag">*</span></div></div>'; // 鍒涘缓缂栬緫鍖哄煙
	htmlStr += '<div id="' + this.options.id + '_edit_' + field + '" class="u-grid-edit-div"></div>';
	htmlStr += '</div>';
	return htmlStr;
};
var editFromFunObj = {
	editForm_initDefault: editForm_initDefault,
	editForm_setRequired: editForm_setRequired,
	editorRowChangeFun: re_editorRowChangeFun,
	formEditCell: formEditCell
};

/*
 * 灏嗗浐瀹氬垪鏀惧叆gridCompColumnFixedArr
 */
var re_initGridCompFixedColumn = function re_initGridCompFixedColumn() {
    var oThis = this;
    var w = 0;
    var removeArr = [];
    $.each(this.gridCompColumnArr, function (i) {
        if (this.options.fixed == true) {
            oThis.gridCompColumnFixedArr.push(this);
        }
    });
    $.each(this.gridCompColumnFixedArr, function (i) {
        if (this.options.fixed != true) {
            oThis.gridCompColumnArr.push(this);
            removeArr.push(this);
        }
    });
    $.each(removeArr, function (i) {
        for (var i = oThis.gridCompColumnFixedArr.length; i > -1; i--) {
            if (this == oThis.gridCompColumnFixedArr[i]) {
                oThis.gridCompColumnFixedArr.splice(i, 1);
                break;
            }
        }
    });
    $.each(this.gridCompColumnFixedArr, function (i) {
        for (var i = oThis.gridCompColumnArr.length; i > -1; i--) {
            if (oThis.gridCompColumnArr[i] == this) {
                oThis.gridCompColumnArr.splice(i, 1);
                break;
            }
        }
    });
};

var fixed_columnsVisibleFun = function fixed_columnsVisibleFun() {
    // 鎵╁睍鏂规硶
    var oThis = this,
        fixW = 0;
    $.each(this.gridCompColumnFixedArr, function () {
        if (this.options.visible) {
            fixW += parseInt(this.options.width);
            this.firstColumn = oThis.firstColumn;
            oThis.firstColumn = false;
        }
    });
    this.fixedRealWidth = fixW;
    this.fixedWidth = fixW;
};

var re_createHeaderTableFixed = function re_createHeaderTableFixed() {
    return this.createHeaderTable('fixed');
};

var re_createContentTableFixed = function re_createContentTableFixed() {
    return this.createContentTable('fixed');
};
var re_createContentOneRowFixed = function re_createContentOneRowFixed(rowObj) {
    return this.createContentOneRow(rowObj, 'fixed');
};
var re_widthChangeGridFunFixed = function re_widthChangeGridFunFixed(halfWholeWidth) {
    // 鍥哄畾鍖哄煙瀹藉害涓嶅ぇ浜庢暣浣撳搴︾殑涓€鍗�
    if (this.fixedRealWidth > halfWholeWidth) {
        this.fixedWidth = halfWholeWidth;
    } else {
        this.fixedWidth = this.fixedRealWidth;
    }
};

var setColumnFixed = function setColumnFixed(field, fixed) {
    var gridCompColumn = this.getColumnByField(field);
    gridCompColumn.options.fixed = fixed;
    this.initGridCompFixedColumn();
    this.repaintDivs();
};

var fixFunObj = {
    initGridCompFixedColumn: re_initGridCompFixedColumn,
    fixed_columnsVisibleFun: fixed_columnsVisibleFun,
    createHeaderTableFixed: re_createHeaderTableFixed,
    createContentTableFixed: re_createContentTableFixed,
    createContentOneRowFixed: re_createContentOneRowFixed,
    widthChangeGridFunFixed: re_widthChangeGridFunFixed,
    setColumnFixed: setColumnFixed
};

/*
 * 鍒涘缓form褰㈠紡涓媎iv
 */
var createFromDivs = function createFromDivs() {
    if (this.createFormFlag) {
        return;
    }
    var htmlStr = '<div id="' + this.options.id + '_form" class="u-grid-form">';
    htmlStr += this.createFromContent();
    $('#' + this.options.id)[0].insertAdjacentHTML('afterBegin', htmlStr);
    this.createFormFlag = true;
};

/*
 * 鍒涘缓form褰㈠紡涓嬪唴瀹瑰尯鍩�
 */
var createFromContent = function createFromContent() {
    var htmlStr = '<div class="u-grid-form-content" id="' + this.options.id + '_form_content" class="u-grid-content">';
    htmlStr += '<table role="grid" id="' + this.options.id + '_form_content_table">';
    htmlStr += this.createFormContentRows();
    htmlStr += '</table>';
    return htmlStr;
};

/*
 * 鍒涘缓form褰㈠紡涓嬪唴瀹瑰尯鍩熸墍鏈夎
 */
var createFormContentRows = function createFormContentRows() {
    var oThis = this,
        htmlStr = "";
    // 閬嶅巻鐢熸垚鎵€鏈夎
    if (this.dataSourceObj.rows) {
        htmlStr += '<tbody role="rowgroup" id="' + this.options.id + '_form_content_tbody">';
        $.each(this.dataSourceObj.rows, function () {
            htmlStr += '<tr role="row"><td role="rowcell">';
            var value = this.value;
            $.each(oThis.gridCompColumnArr, function () {
                var f = this.options.field,
                    t = this.options.title,
                    v = $(value).attr(f);
                htmlStr += '<div>' + t + ':</div>';
                htmlStr += '<div>' + v + '</div>';
            });
            htmlStr += '</td></tr>';
        });
        htmlStr += '</tbody>';
    }
    return htmlStr;
};

/*
 * 鏁翠綋瀹藉害鏀瑰彉澶勭悊(form褰㈠紡)
 */
var widthChangeFormFun = function widthChangeFormFun() {
    this.createFromDivs();
    $('#' + this.options.id + '_grid').css('display', 'none');
    $('#' + this.options.id + '_form').css('display', 'block');
    this.showType = 'form';
    if (typeof this.options.afterCreate == 'function') {
        this.options.afterCreate.call(this);
    }
};
var formShowFunOjb = {
    createFromDivs: createFromDivs,
    createFromContent: createFromContent,
    createFormContentRows: createFormContentRows,
    widthChangeFormFun: widthChangeFormFun
};

var re_resetThVariableHeaderLevel = function re_resetThVariableHeaderLevel() {
    var oThis = this,
        oldParentHeaderStr = '',
        parentWidth = 0,
        maxHeaderLevel = this.options.maxHeaderLevel,
        columnWidthArr = [];
    // 閬嶅巻鎵€鏈夊凡缁忓垱寤虹殑th鍒涘缓瀵硅薄璁板綍column鐨剋idth
    $('#' + this.options.id + '_header_table th', this.$ele).each(function (i) {
        var gridCompColumn = oThis.gridCompColumnArr[i];
        var field = gridCompColumn.options.field;
        var w = 0;
        if (gridCompColumn.options.visible) {
            w = parseInt(gridCompColumn.options.width);
        }
        var obj = {
            field: field,
            width: w
        };
        columnWidthArr.push(obj);
    });
    // 閬嶅巻鎵€鏈塰eaderLevel > 1鐨刢olumn锛屽垱寤篸iv骞惰缃畉op鍙妛idth鍊�
    var firstColumnField = this.getColumnByVisibleIndex(0).options.field;
    for (var i = 0; i < this.gridCompLevelColumn.length; i++) {
        var column = this.gridCompLevelColumn[i];
        var field = column.field;
        var title = column.title;
        var startField = column.startField;
        var endField = column.endField;
        if (startField && endField) {
            var startTh = $('th[field=' + startField + ']', this.$ele.find('#' + this.options.id + '_header_thead'));
            var styleStr = ' style="';
            var classStr = '';
            var linkStyleStr = '';
            var headerLevel = column.headerLevel;
            var top = (parseInt(maxHeaderLevel) - parseInt(headerLevel)) * this.baseHeaderHeight;
            styleStr += 'top:' + top + 'px;z-index:' + headerLevel + ';';
            var width = 0;
            var startFlag = false;
            for (var j = 0; j < columnWidthArr.length; j++) {
                var nowColumn = columnWidthArr[j];
                var nowField = nowColumn.field;
                if (nowField == startField || startFlag) {
                    startFlag = true;
                    width += nowColumn.width;
                    if (nowField == endField) {
                        break;
                    }
                }
            }
            styleStr += 'width:' + width + 'px;';
            styleStr += '" ';
            if (firstColumnField == startField) {
                classStr += ' grid-no-left-border ';
            }
            if (maxHeaderLevel == headerLevel) {
                classStr += ' grid-max-level-div ';
            }

            if (this.options.headerHeight) linkStyleStr = 'style="height:' + this.options.headerHeight + 'px;line-height:' + this.options.headerHeight + 'px;"';
            var htmlStr = '<div id="' + this.options.id + field + '" class="u-gird-parent ' + classStr + '" ' + styleStr + '><div class="u-grid-header-link" ' + linkStyleStr + ' title="' + title + '">' + title + '</div></div>';
            startTh[0].insertAdjacentHTML('afterBegin', htmlStr);
        }
    }
};

var re_initGridCompColumnHeaderLevelFun = function re_initGridCompColumnHeaderLevelFun(columnOptions) {
    // 鎵╁睍鏂规硶
    if (columnOptions.headerLevel > 1) {
        this.gridCompLevelColumn.push(columnOptions);
        var oldLength = this.gridCompColumnArr.length;
        this.gridCompColumnArr.length = oldLength - 1;
        if (this.basicGridCompColumnArr && this.basicGridCompColumnArr.length > 0) {
            this.basicGridCompColumnArr.length = oldLength - 1;
        }
    }
};
var getLevelTitleByField = function getLevelTitleByField(field) {
    for (var i = 0; i < this.gridCompLevelColumn.length; i++) {
        var columnField = this.gridCompLevelColumn[i].field;
        if (columnField == field) {
            return this.gridCompLevelColumn[i].title;
        }
    }
    return '';
};
var headerLevelFunObj = {
    resetThVariableHeaderLevel: re_resetThVariableHeaderLevel,
    initGridCompColumnHeaderLevelFun: re_initGridCompColumnHeaderLevelFun,
    // initGridHiddenLevelColumn : initGridHiddenLevelColumn,
    getLevelTitleByField: getLevelTitleByField
};

var re_initGridCompColumnLoacl = function re_initGridCompColumnLoacl() {
    var oThis = this,
        localGridCompColumnArr = this.getGridCompColumnArrFromLocal();
    // 鑾峰彇鏈湴缂撳瓨涓殑鏁版嵁
    if (localGridCompColumnArr != null) {
        this.gridCompColumnArr = localGridCompColumnArr;
        $.each(this.gridCompColumnArr, function () {
            var field = this.options.field;
            for (var i = 0; i < oThis.options.columns.length; i++) {
                var c = oThis.options.columns[i];
                if (c.field == field) {
                    var options = $.extend({}, c, this.options);
                    this.options = options;
                    this.options.realWidth = this.options.width;
                    break;
                }
            }
        });
    }
};
/*
 * 鑾峰彇鏈湴涓€у寲瀛樺偍鐨勮缃�
 */
var getLocalData = function getLocalData() {
    if (!this.options.needLocalStorage) return null;
    if (window.localStorage == null) return null;
    if (this.$sd_storageData != null) return this.$sd_storageData;else {
        if (window.localStorage.getItem(this.localStorageId) == null) {
            try {
                window.localStorage.setItem(this.localStorageId, "{}");
            } catch (e) {
                return null;
            }
        }
        var storageDataStr = window.localStorage.getItem(this.localStorageId);
        if (typeof JSON == "undefined") this.$sd_storageData = eval("(" + storageDataStr + ")");else this.$sd_storageData = JSON.parse(storageDataStr);
        return this.$sd_storageData;
    }
};
/*
 * 淇濆瓨鏈湴涓€у寲瀛樺偍鐨勮缃�
 */
var saveLocalData = function saveLocalData() {
    if (!this.options.needLocalStorage) return null;
    var oThis = this;
    if (this.saveSettimeout) {
        clearTimeout(this.saveSettimeout);
    }
    this.saveSettimeout = setTimeout(function () {
        if (oThis.$sd_storageData == null || window.localStorage == null) return;
        var strogeDataStr = JSON.stringify(oThis.$sd_storageData);
        try {
            window.localStorage.setItem(oThis.localStorageId, strogeDataStr);
        } catch (e) {}
    }, 200);
};
/*
 * 娓呴櫎鏈湴涓€у寲瀛樺偍鐨勮缃�
 */
var clearLocalData = function clearLocalData() {
    if (!this.options.needLocalStorage) return null;
    if (this.saveSettimeout) {
        clearTimeout(this.saveSettimeout);
    }
    window.localStorage.setItem(this.localStorageId, "{}");
    this.$sd_storageData = {};
};
/*
 * 灏嗘暟鎹垪椤哄簭淇濆瓨鑷虫湰鍦颁釜鎬у寲瀛樺偍
 */
var saveGridCompColumnArrToLocal = function saveGridCompColumnArrToLocal() {
    if (!this.options.needLocalStorage) return null;
    var defData = this.getLocalData();
    defData["gridCompColumnArr"] = this.gridCompColumnArr.concat(this.gridCompColumnFixedArr);
    this.saveLocalData();
};
/*
 * 浠庢湰鍦颁釜鎬у寲瀛樺偍涓彇鍑烘暟鎹垪椤哄簭
 */
var getGridCompColumnArrFromLocal = function getGridCompColumnArrFromLocal() {
    if (!this.options.needLocalStorage) return null;
    var defData = this.getLocalData();
    if (defData == null) return null;
    if (defData["gridCompColumnArr"] == null) return null;
    return defData["gridCompColumnArr"];
};
var localStorageFunObj = {
    initGridCompColumnLoacl: re_initGridCompColumnLoacl,
    getLocalData: getLocalData,
    saveLocalData: saveLocalData,
    clearLocalData: clearLocalData,
    saveGridCompColumnArrToLocal: saveGridCompColumnArrToLocal,
    getGridCompColumnArrFromLocal: getGridCompColumnArrFromLocal
};

var re_initGridHiddenLevelColumn = function re_initGridHiddenLevelColumn() {
    if (!this.options.overWidthHiddenColumn) return;
    var oThis = this;
    var w = 0;

    this.gridCompHiddenLevelColumnArr = this.gridCompColumnArr.slice(0);

    this.gridCompHiddenLevelColumnArr.sort(function (a, b) {
        var hiddenLevel1 = a.options.hiddenLevel;
        var hiddenLevel2 = b.options.hiddenLevel;
        if (hiddenLevel1 > hiddenLevel2) {
            return -1;
        } else {
            return 1;
        }
    });
};
var re_widthChangeGridFunOverWidthHidden = function re_widthChangeGridFunOverWidthHidden() {
    if (this.options.overWidthHiddenColumn) {
        this.lastVisibleColumn.options.width = this.lastVisibleColumn.options.realWidth;
        var wholeWidth = parseInt(this.wholeWidth) - parseInt(this.leftW);
        var columnWholeWidth = parseInt(this.fixedWidth) + parseInt(this.contentRealWidth);
        if (columnWholeWidth > wholeWidth) {
            for (var i = 0; i < this.gridCompHiddenLevelColumnArr.length; i++) {
                var column = this.gridCompHiddenLevelColumnArr[i];
                if (column.options.visible) {
                    column.options.visible = false;
                    columnWholeWidth = parseInt(columnWholeWidth) - parseInt(column.options.width);
                }
                if (!(columnWholeWidth > wholeWidth)) {
                    break;
                }
            }
            this.columnsVisibleFun();
        } else {
            // 浼氬皢闅愯棌鐨勬樉绀哄嚭鏉�
            /*for (var i = this.gridCompHiddenLevelColumnArr.length - 1; i > -1; i--) {
                var column = this.gridCompHiddenLevelColumnArr[i];
                if (!column.options.visible) {
                    columnWholeWidth = parseInt(columnWholeWidth) + parseInt(column.options.width);
                    if (columnWholeWidth > wholeWidth) {
                        break;
                    }
                    column.options.visible = true;
                }
            }
            this.columnsVisibleFun();*/
        }
    }
};
var overWidthHiddenFunObj = {
    initGridHiddenLevelColumn: re_initGridHiddenLevelColumn,
    widthChangeGridFunOverWidthHidden: re_widthChangeGridFunOverWidthHidden
};

var re_createContentRowsSumRow = function re_createContentRowsSumRow(createFlag) {
    var htmlStr = '';
    if (this.options.showSumRow && this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0) {
        htmlStr += this.createSumRow(createFlag);
    }
    return htmlStr;
};
var re_createContentSumRow = function re_createContentSumRow(bottonStr) {
    var htmlStr = '';
    // if(this.options.showSumRow){
    // 	htmlStr += '<div class="u-grid-content-left-sum-bottom" id="' + this.options.id + '_content_left_sum_bottom" style="width:' + (this.leftW + this.fixedWidth) + 'px;'+bottonStr+'">';
    // 	htmlStr += '</div>';
    // }
    return htmlStr;
};
/*
 * 鍒涘缓鍚堣琛�
 */
var createSumRow = function createSumRow(createFlag) {
    if (this.options.showSumRow) {
        var oThis = this,
            idStr,
            gridCompColumnArr;
        if (createFlag == 'fixed') {
            idStr = 'fixed_';
            gridCompColumnArr = this.gridCompColumnFixedArr;
        } else {
            idStr = '';
            gridCompColumnArr = this.gridCompColumnArr;
        }
        var t = parseInt(this.wholeHeight) - this.exceptContentHeight - 48 - this.scrollBarHeight;
        t = t > 0 ? t : 0;
        var htmlStr = '<tr role="sumrow" class="u-grid-content-sum-row" id="' + this.options.id + '_content_' + idStr + 'sum_row" style="top:' + t + 'px;">';
        $.each(gridCompColumnArr, function () {
            var f = this.options.field;
            var precision = this.options.precision;
            var dataType = this.options.dataType;
            var sumValue = oThis.dataSourceObj.getSumValue(f, this, oThis);
            if (dataType == 'float') {
                var o = {};
                o.value = sumValue;
                o.precision = precision ? precision : 2;
                sumValue = oThis.DicimalFormater(o);
            }
            var tdStyle = '';
            if (!this.options.visible) {
                tdStyle = 'style="display:none;';
                if (oThis.options.rowHeight) {
                    tdStyle += 'height:' + oThis.options.rowHeight + 'px;line-height:' + oThis.options.rowHeight + 'px;';
                }
                tdStyle += '"';
            } else {
                if (oThis.options.rowHeight) {
                    tdStyle += 'style="height:' + oThis.options.rowHeight + 'px;line-height:' + oThis.options.rowHeight + 'px;"';
                }
            }
            htmlStr += '<td role="sumrowcell" title="' + sumValue + '" ' + tdStyle + '>';
            if (this.firstColumn) {
                htmlStr += '<div class="u-gird-centent-sum-div"><span>' + oThis.transMap.ml_sum + '</span></div>';
            }
            var contentStyle = '';
            if (this.options.dataType == 'integer' || this.options.dataType == 'float') {
                contentStyle = 'style="text-align: right;"';
            }
            htmlStr += '<div class="u-grid-content-td-div" ' + contentStyle + '><span value="' + sumValue + '">' + sumValue + '</span></div></td>';
        });
        htmlStr += '</tr>';
        return htmlStr;
    }
};

/*
 * 鍒涘缓鍚堣琛� for ie
 */
var createSumRowForIE = function createSumRowForIE(table, createFlag) {
    if (this.options.showSumRow) {
        var oThis = this,
            idStr,
            gridCompColumnArr;
        if (createFlag == 'fixed') {
            idStr = 'fixed_';
            gridCompColumnArr = this.gridCompColumnFixedArr;
        } else {
            idStr = '';
            gridCompColumnArr = this.gridCompColumnArr;
        }
        var t = parseInt(this.wholeHeight) - this.exceptContentHeight - 48 - this.scrollBarHeight;
        t = t > 0 ? t : 0;
        var row = table.insertRow();
        row.role = 'sumrow';
        row.className = 'u-grid-content-sum-row';
        row.id = this.options.id + '_content_' + idStr + 'sum_row';
        row.style.top = t + 'px';
        $.each(gridCompColumnArr, function () {
            var f = this.options.field;
            var precision = this.options.precision;
            var dataType = this.options.dataType;
            var sumValue = oThis.dataSourceObj.getSumValue(f, this, oThis);
            if (dataType == 'float') {
                var o = {};
                o.value = sumValue;
                o.precision = precision ? precision : 2;
                sumValue = oThis.DicimalFormater(o);
            }
            var newCell = row.insertCell();
            newCell.role = 'sumrowcell';
            newCell.title = sumValue;
            if (oThis.options.sumRowHeight) {
                newCell.style.height = oThis.options.sumRowHeight + 'px';
                newCell.style.lineHeight = oThis.options.sumRowHeight + 'px';
            }
            var contentStyle = '';
            if (this.options.dataType == 'integer' || this.options.dataType == 'float') {
                contentStyle = 'style="text-align: right;"';
            }

            var htmlStr = '<div class="u-grid-content-td-div" ' + contentStyle + '>';
            if (this.firstColumn) {
                htmlStr += '<div class="u-gird-centent-sum-div"><span>' + oThis.transMap.ml_sum + '</span></div>';
            }
            htmlStr += '<span value="' + sumValue + '">' + sumValue + '</span></div>';
            newCell.insertAdjacentHTML('afterBegin', htmlStr);
        });
    }
};
/*
 * 閲嶇敾鍚堣琛�
 */
var re_repairSumRow = function re_repairSumRow() {
    var self = this;
    if (this.re_repairSumRowSetTimeout) clearTimeout(this.re_repairSumRowSetTimeout);
    this.re_repairSumRowSetTimeout = setTimeout(function () {
        re_repairSumRowFun.call(self);
    }, 100);
};

var re_repairSumRowFun = function re_repairSumRowFun() {
    if (this.options.showSumRow) {
        if (this.options.sumRowFixed) {
            if (this.options.sumRowFirst) {
                $('#' + this.options.id + '_noScroll_begin_table tbody .u-grid-content-sum-row').remove();
                $('#' + this.options.id + '_noScroll_fixed_begin_table tbody .u-grid-content-sum-row').remove();
                try {
                    if (this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0) {
                        $('#' + this.options.id + '_grid .u-grid-noScroll-left').remove();
                        var type = 'begin';
                        if ((this.options.multiSelect || this.options.showNumCol) && (type == 'begin' && this.options.sumRowFirst && this.options.sumRowFixed || type == 'end' && !this.options.sumRowFirst && this.options.sumRowFixed)) {
                            var htmlStr = '<div id="' + this.options.id + '_noScroll_left" class="u-grid-noScroll-left" style="width:' + this.leftW + 'px;height:' + this.noScrollHeight + 'px;">';
                            htmlStr += '</div>';
                            $('#' + this.options.id + '_grid .u-grid-noScroll-wrap')[0].insertAdjacentHTML('afterBegin', htmlStr);
                        }
                        var htmlStr = this.createSumRow();
                        $('#' + this.options.id + '_noScroll_begin_table tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
                        var htmlStr = this.createSumRow('fixed');
                        $('#' + this.options.id + '_noScroll_fixed_begin_table tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
                    }
                } catch (e) {
                    var table = $('#' + this.options.id + '_noScroll_begin_table')[0];
                    var fixedTable = $('#' + this.options.id + '_noScroll_fixed_begin_table')[0];
                    this.createSumRowForIE(table);
                    this.createSumRowForIE(fixedTable, 'fixed');
                }
            } else {
                $('#' + this.options.id + '_noScroll_end_table tbody .u-grid-content-sum-row').remove();
                $('#' + this.options.id + '_noScroll_fixed_end_table tbody .u-grid-content-sum-row').remove();
                try {
                    if (this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0) {
                        var htmlStr = this.createSumRow();
                        $('#' + this.options.id + '_noScroll_end_table tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
                        var htmlStr = this.createSumRow('fixed');
                        $('#' + this.options.id + '_noScroll_fixed_end_table tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
                    }
                } catch (e) {
                    var table = $('#' + this.options.id + '_noScroll_end_table')[0];
                    var fixedTable = $('#' + this.options.id + '_noScroll_fixed_end_table')[0];
                    this.createSumRowForIE(table);
                    this.createSumRowForIE(fixedTable, 'fixed');
                }
            }
        } else {
            $('#' + this.options.id + '_content_div tbody .u-grid-content-sum-row').remove();
            $('#' + this.options.id + '_content_fixed_div tbody .u-grid-content-sum-row').remove();
            try {
                if (this.dataSourceObj.rows && this.dataSourceObj.rows.length > 0) {
                    var htmlStr = this.createSumRow();
                    if (this.options.sumRowFirst) {
                        $('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
                    } else {
                        $('#' + this.options.id + '_content_div tbody')[0].insertAdjacentHTML('beforeEnd', htmlStr);
                    }
                    var htmlStr = this.createSumRow('fixed');
                    if ($('#' + this.options.id + '_content_fixed_div tbody')[0]) {
                        if (this.options.sumRowFirst) {
                            $('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('afterBegin', htmlStr);
                        } else {
                            $('#' + this.options.id + '_content_fixed_div tbody')[0].insertAdjacentHTML('beforeEnd', htmlStr);
                        }
                    }
                }
            } catch (e) {
                var table = $('#' + this.options.id + '_content_div table')[0];
                var fixedTable = $('#' + this.options.id + '_content_fixed_div table')[0];
                this.createSumRowForIE(table);
                this.createSumRowForIE(fixedTable, 'fixed');
            }
        }

        this.renderSumRow();
    }
};

var renderSumRow = function renderSumRow() {
    var oThis = this;
    $.each(this.gridCompColumnFixedArr, function (i) {
        var sumCol = this.options.sumCol;
        var sumRenderType = this.options.sumRenderType;
        var idStr = 'fixed_';
        if (sumCol) {
            var sumSpans = $('#' + oThis.options.id + '_content_' + idStr + 'sum_row').find('td').eq(i).find('span');
            var sumSpan = sumSpans[sumSpans.length - 1];
            if (sumSpan) {
                if (typeof sumRenderType == 'function') {
                    var sumV = $(sumSpan).attr('value');
                    var obj = {};
                    obj.value = sumV;
                    obj.element = sumSpan;
                    obj.gridObj = oThis;
                    obj.gridCompColumn = this;
                    sumRenderType.call(oThis, obj);
                } else if (dataType == 'integer' || dataType == 'float') {
                    sumSpan.style.textAlign = 'right';
                }
            }
        }
    });
    $.each(this.gridCompColumnArr, function (i) {
        var sumCol = this.options.sumCol;
        var dataType = this.options.dataType;
        var sumRenderType = this.options.sumRenderType;
        var idStr = '';
        if (sumCol) {
            var sumSpans = $('#' + oThis.options.id + '_content_' + idStr + 'sum_row').find('td').eq(i).find('span');
            var sumSpan = sumSpans[sumSpans.length - 1];
            if (sumSpan) {
                if (typeof sumRenderType == 'function') {
                    var sumV = $(sumSpan).attr('value');
                    var obj = {};
                    obj.value = sumV;
                    obj.element = sumSpan;
                    obj.gridObj = oThis;
                    obj.gridCompColumn = this;
                    sumRenderType.call(oThis, obj);
                } else if (dataType == 'integer' || dataType == 'float') {
                    sumSpan.style.textAlign = 'right';
                }
            }
        }
    });
};

var re_renderTypeSumRow = function re_renderTypeSumRow(gridCompColumn, i, begin, length, isFixedColumn) {
    var oThis = this;
    var sumCol = gridCompColumn.options.sumCol;
    var sumRenderType = gridCompColumn.options.sumRenderType;
    var dataType = gridCompColumn.options.dataType;
    var idStr = isFixedColumn === true ? 'fixed_' : '';
    if (sumCol) {
        var sumSpans = $('#' + this.options.id + '_content_' + idStr + 'sum_row').find('td').eq(i).find('span');
        var sumSpan = sumSpans[sumSpans.length - 1];
        if (sumSpan) {
            if (typeof sumRenderType == 'function') {
                var sumV = $(sumSpan).attr('value');
                var obj = {};
                obj.value = sumV;
                obj.element = sumSpan;
                obj.gridObj = oThis;
                obj.gridCompColumn = gridCompColumn;
                sumRenderType.call(oThis, obj);
            } else if (dataType == 'integer' || dataType == 'float') {
                sumSpan.style.textAlign = 'right';
            }
        }
    }
};

// 澧炲姞棰勫埗render
window.maxSumRender = function maxSumRender(opt) {
    var gridComp = opt.gridObj;
    var gridCompColumn = opt.gridCompColumn;
    var field = gridCompColumn.options.field;
    var element = opt.element;
    var nowMax;
    $.each(gridComp.dataSourceObj.rows, function (i) {
        var v = $(this.value).attr(field);
        if (gridCompColumn.options.dataType == 'Int') {
            v = gridComp.getInt(v, 0);
        } else {
            v = gridComp.getFloat(v, 0);
        }
        if (typeof nowMax == 'undefined') {
            nowMax = v;
        } else {
            if (v > nowMax) nowMax = v;
        }
    });

    // 澶勭悊绮惧害
    if (gridCompColumn.options.dataType == 'Float' && gridCompColumn.options.precision) {
        var o = {};
        o.value = nowMax;
        o.precision = gridCompColumn.options.precision;
        nowMax = gridComp.DicimalFormater(o);
    }

    element.innerHTML = nowMax + '';
};
window.minSumRender = function minSumRender(opt) {
    var gridComp = opt.gridObj;
    var gridCompColumn = opt.gridCompColumn;
    var field = gridCompColumn.options.field;
    var element = opt.element;
    var nowMax;
    $.each(gridComp.dataSourceObj.rows, function (i) {
        var v = $(this.value).attr(field);
        if (gridCompColumn.options.dataType == 'Int') {
            v = gridComp.getInt(v, 0);
        } else {
            v = gridComp.getFloat(v, 0);
        }
        if (typeof nowMax == 'undefined') {
            nowMax = v;
        } else {
            if (v < nowMax) nowMax = v;
        }
    });

    // 澶勭悊绮惧害
    if (gridCompColumn.options.dataType == 'Float' && gridCompColumn.options.precision) {
        var o = {};
        o.value = nowMax;
        o.precision = gridCompColumn.options.precision;
        nowMax = gridComp.DicimalFormater(o);
    }
    element.innerHTML = nowMax + '';
};
window.avgSumRender = function avgSumRender(opt) {
    var sumValue = opt.value;
    var gridComp = opt.gridObj;
    var gridCompColumn = opt.gridCompColumn;
    var element = opt.element;
    var l = gridComp.dataSourceObj.rows.length;
    var avgValue = sumValue / l;

    // 澶勭悊绮惧害
    if (gridCompColumn.options.dataType == 'Float' && gridCompColumn.options.precision) {
        var o = {};
        o.value = avgValue;
        o.precision = gridCompColumn.options.precision;
        avgValue = gridComp.DicimalFormater(o);
    }
    element.innerHTML = avgValue + '';
};

var sumRowFunObj = {
    createContentRowsSumRow: re_createContentRowsSumRow,
    createContentSumRow: re_createContentSumRow,
    createSumRow: createSumRow,
    createSumRowForIE: createSumRowForIE,
    repairSumRow: re_repairSumRow,
    renderSumRow: renderSumRow,
    renderTypeSumRow: re_renderTypeSumRow
};

var swap_initEventFun = function swap_initEventFun() {
    // 鎵╁睍鏂规硶
    var oThis = this;
    $('#' + this.options.id).on('mousedown', function (e) {
        if ($(e.target).closest('#' + oThis.options.id + '_header').length > 0) {
            // 鐐瑰嚮鐨勬槸header鍖哄煙
            var eleTh = $(e.target).closest('th')[0];
            if (oThis.options.canSwap && eleTh) {
                oThis.swapColumnStart(e, eleTh);
            }
            e.preventDefault();
        } else if ($(e.target).closest('#' + oThis.options.id + '_content').length > 0) {
            // 鐐瑰嚮鐨勬槸鏁版嵁鍖哄煙
        }
    });

    $('#' + this.options.id).on('mousemove', function (e) {
        oThis.mouseMoveX = e.clientX;
        oThis.mouseMoveY = e.clientY;
        if ((oThis.mouseMoveX != oThis.mouseDownX || oThis.mouseDownY != oThis.mouseMoveY) && oThis.mouseDownX != 'mouseDownX' && oThis.options.canSwap && oThis.swapColumnEle) {
            // 榧犳爣鎸変笅涔嬪悗绉诲姩浜�
            oThis.swapColumnFlag = true;
        }
        oThis.swapColumnFun(e);
        // e.stopPropagation();
    });

    $('#' + this.options.id + '_top').on('mousemove', function (e) {
        oThis.mouseMoveX = e.clientX;
        oThis.mouseMoveY = e.clientY;
        if ((oThis.mouseMoveX != oThis.mouseDownX || oThis.mouseDownY != oThis.mouseMoveY) && oThis.mouseDownX != 'mouseDownX' && oThis.options.canSwap && oThis.swapColumnEle) {
            // 榧犳爣鎸変笅涔嬪悗绉诲姩浜�
            oThis.swapColumnFlag = true;
        }
        oThis.swapColumnFun(e);
        e.stopPropagation();
    });

    $('#' + this.options.id).on('mouseup', function (e) {
        oThis.mouseUpX = e.clientX;
        oThis.mouseUpY = e.clientY;
        oThis.swapColumnEnd(e);
        oThis.mouseUpX = 'mouseUpX';
        oThis.mouseUpY = 'mouseUpY';
        oThis.mouseDownX = 'mouseDownX';
        oThis.mouseDownY = 'mouseDownY';
        oThis.mouseMoveX = 'mouseMoveX';
        oThis.mouseMoveY = 'mouseMoveY';
    });

    $('#' + this.options.id + '_top').on('mouseup', function (e) {
        oThis.mouseUpX = e.clientX;
        oThis.mouseUpY = e.clientY;
        oThis.swapColumnEnd(e);
        oThis.mouseUpX = 'mouseUpX';
        oThis.mouseUpY = 'mouseUpY';
        oThis.mouseDownX = 'mouseDownX';
        oThis.mouseDownY = 'mouseDownY';
        oThis.mouseMoveX = 'mouseMoveX';
        oThis.mouseMoveY = 'mouseMoveY';
    });
};

var swap_initGridEventFun = function swap_initGridEventFun() {
    // 鎵╁睍鏂规硶
    var oThis = this;
};

/*
 * 浜ゆ崲鍒椾綅缃紑濮嬶紝骞朵笉淇敼swapColumnFlag锛屽綋绉诲姩鐨勬椂鍊欐墠淇敼swapColumnFlag
 */
var swapColumnStart = function swapColumnStart(e, ele) {
    if (!this.options.canSwap) {
        return;
    }
    this.swapColumnEle = ele;
    this.swapColumnStartX = e.clientX;
    this.swapColumnStartY = e.clientY;
};
/*
 * 浜ゆ崲浣嶇疆
 */
var swapColumnFun = function swapColumnFun(e) {
    if (!this.options.canSwap) {
        return;
    }
    var oThis = this;
    if (this.swapColumnFlag) {
        var nowTh = this.swapColumnEle;
        if (!nowTh) {
            return;
        }
        var $nowTh = $(nowTh);
        if (!nowTh.gridCompColumn) {
            return;
        }
        var nowGridCompColumn = nowTh.gridCompColumn;
        //鍒涘缓鎷栧姩鍖哄煙
        if ($('#' + this.options.id + '_clue').length == 0) {
            var $d = $('<div class="u-grid u-grid-header-drag-clue" id="' + this.options.id + '_clue" />').css({
                width: nowTh.scrollWidth + "px",
                left: nowTh.attrLeftTotalWidth - oThis.scrollLeft + oThis.leftW + oThis.fixedWidth + "px",
                top: "0px",
                paddingLeft: $nowTh.css("paddingLeft"),
                paddingRight: $nowTh.css("paddingRight"),
                lineHeight: $nowTh.height() + "px",
                paddingTop: $nowTh.css("paddingTop"),
                paddingBottom: $nowTh.css("paddingBottom")
            }).html(nowGridCompColumn.options.title || nowGridCompColumn.options.field).prepend('<span class="uf uf-bancirclesymbol u-grid-header-drag-status" />');
            try {
                $('#' + this.options.id)[0].insertAdjacentElement('afterBegin', $d[0]);
            } catch (e) {
                $('#' + this.options.id)[0].insertBefore($d[0], $('#' + this.options.id)[0].firstChild);
            }
            $d.on('mousemove', function () {
                e.stopPropagation();
            });
        }
        this.swapColumnEndX = e.clientX;
        this.swapColumnEndY = e.clientY;
        var changeX = this.swapColumnEndX - this.swapColumnStartX,
            changeY = this.swapColumnEndY - this.swapColumnStartY;
        $('#' + this.options.id + '_clue').css({
            left: nowTh.attrLeftTotalWidth + changeX - oThis.scrollLeft + oThis.leftW + oThis.fixedWidth + "px",
            top: changeY + "px"
        });

        // 鍒涘缓鎻愮ずdiv
        if ($('#' + this.options.id + '_swap_top').length == 0) {
            var $d = $('<span class="uf uf-triangle-down u-grid-header-swap-tip-span"  id="' + this.options.id + '_swap_top"/>');
            $d.css({
                top: $nowTh.height() - 6 + 'px'
            });
            var $d1 = $('<span class="uf uf-triangle-up u-grid-header-swap-tip-span" id="' + this.options.id + '_swap_down" />');
            $d1.css({
                top: '6px'
            });
            try {
                $('#' + this.options.id)[0].insertAdjacentElement('afterBegin', $d[0]);
                $('#' + this.options.id)[0].insertAdjacentElement('afterBegin', $d1[0]);
            } catch (e) {
                $('#' + this.options.id)[0].insertBefore($d[0], $('#' + this.options.id)[0].firstChild);
                $('#' + this.options.id)[0].insertBefore($d1[0], $('#' + this.options.id)[0].firstChild);
            }
        }
        this.canSwap = false;
        $('#' + this.options.id + '_header_table th').each(function (i) {
            var left = $(this).offset().left,
                right = left + parseInt(this.attrWidth);
            if (i == 0 && e.clientX < left) {
                // 绉诲姩鍒版渶宸﹁竟
                if (oThis.swapColumnEle != this) {
                    oThis.swapToColumnEle = 'LeftEle';
                    $('#' + oThis.options.id + '_swap_top').css({
                        left: -oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
                        display: 'block'
                    });
                    $('#' + oThis.options.id + '_swap_down').css({
                        left: -oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
                        display: 'block'
                    });
                }
                oThis.canSwap = true;
            } else if (left < e.clientX && e.clientX < right) {
                if (oThis.swapColumnEle != this && parseInt($(this).attr('index')) + 1 != parseInt($(oThis.swapColumnEle).attr('index'))) {
                    if (oThis.swapToColumnEle != this) {
                        oThis.swapToColumnEle = this;
                        $('#' + oThis.options.id + '_swap_top').css({
                            left: this.attrRightTotalWidth - oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
                            display: 'block'
                        });
                        $('#' + oThis.options.id + '_swap_down').css({
                            left: this.attrRightTotalWidth - oThis.scrollLeft - 3 + oThis.leftW + oThis.fixedWidth + 'px',
                            display: 'block'
                        });
                    }
                    oThis.canSwap = true;
                    return false;
                }
            }
        });
        if (this.canSwap) {
            $('.u-grid-header-drag-status').removeClass('uf-bancirclesymbol').addClass('uf-plussigninablackcircle');
        } else {
            $('#' + this.options.id + '_swap_top').css('display', 'none');
            $('#' + this.options.id + '_swap_down').css('display', 'none');
            $('.u-grid-header-drag-status').removeClass('uf-plussigninablackcircle').addClass('uf-bancirclesymbol');
            this.swapToColumnEle = null;
        }
        $('#' + this.options.id + '_top').css('display', 'block');
    }
};
/*
 * 浜ゆ崲浣嶇疆缁撴潫
 */
var swapColumnEnd = function swapColumnEnd(e) {
    if (!this.options.canSwap) {
        return;
    }
    var oThis = this;
    if (this.swapColumnFlag) {
        if (this.swapToColumnEle) {
            var swapColumnEle = this.swapColumnEle,
                swapToColumnEle = this.swapToColumnEle,
                swapColumnIndex = $(swapColumnEle).attr('index'),
                swapToColumnIndex = $(swapToColumnEle).attr('index'),
                swapGridCompColumn = this.gridCompColumnArr[swapColumnIndex];
            this.gridCompColumnArr.splice(parseInt(swapToColumnIndex) + 1, 0, swapGridCompColumn);
            if (parseInt(swapColumnIndex) < parseInt(swapToColumnIndex)) this.gridCompColumnArr.splice(parseInt(swapColumnIndex), 1);else this.gridCompColumnArr.splice(parseInt(swapColumnIndex) + 1, 1);

            this.saveGridCompColumnArrToLocal();
            this.repaintGridDivs();
            this.resetColumnWidthByRealWidth();
        }
        $('#' + this.options.id + '_clue').remove();
        $('#' + this.options.id + '_swap_top').css('display', 'none');
        $('#' + this.options.id + '_swap_down').css('display', 'none');
    }
    this.swapColumnEle = null;
    this.swapColumnFlag = false;
    $('#' + this.options.id + '_top').css('display', 'none');
};
var swapFunObj = {
    swap_initEventFun: swap_initEventFun,
    swap_initGridEventFun: swap_initGridEventFun,
    swapColumnStart: swapColumnStart,
    swapColumnFun: swapColumnFun,
    swapColumnEnd: swapColumnEnd
};

var rowDrag_initGridEventFun = function rowDrag_initGridEventFun() {

    var oThis = this;

    // 鍒ゆ柇鏄惁鎿嶄綔鍦ㄥ唴瀹硅涓�
    // 鏍规嵁鏌愪釜瀛楁鍒ゆ柇鏄惁鍙嫋鎷斤紝濡傛灉鍙紪杈戣皟鐢╮owDragStart
    $('#' + this.options.id + '_content_tbody').on('mousedown', function (e) {
        var $tarTr = $(e.target).closest("tr");
        var isEditTr = $(e.target).closest("tr").hasClass('grid_edit_form_tr');
        if ($tarTr.length > 0 && !isEditTr) {
            var eleTr = $(e.target).closest("tr")[0];
            if (oThis.options.canRowDrag) {
                oThis.rowDragStart(e, eleTr);
            }
            // e.preventDefault();
        }
    });

    // move浜嬩欢
    $('#' + this.options.id + '_content_tbody').on('mousemove', function (e) {
        oThis.mouseMoveX = e.clientX;
        oThis.mouseMoveY = e.clientY;
        if (oThis.rowDragEle && (oThis.mouseMoveX != oThis.rowDragStartX || oThis.mouseMoveY != oThis.rowDragStartY) && oThis.options.canRowDrag) {
            oThis.rowDragFlag = true;
            // 榧犳爣鎸変笅涔嬪悗绉诲姩浜�
            oThis.rowDragFun(e);
        }

        // e.stopPropagation();
    });

    $('#' + this.options.id + '_content_tbody').on('mouseup', function (e) {
        oThis.mouseUpX = e.clientX;
        oThis.mouseUpY = e.clientY;
        oThis.rowDragEnd(e);
    });
};

// const rowDrag_initGridEventFun = function(){
// 	// 鎵╁睍鏂规硶
// 	var oThis = this;
// };
// 琛屾嫋鎷藉紑濮嬩箣鍓�
var rowDragStart = function rowDragStart(e, ele) {
    var oThis = this;
    // 淇濆瓨element锛�
    // 璁板綍涔嬪墠clientx锛宑lienty
    // 璁板綍褰撳墠琛岀殑搴忓彿
    if (!this.options.canRowDrag) {
        return;
    }
    this.rowDragStartX = e.clientX;
    this.rowDragStartY = e.clientY;
    this.rowDragEle = ele;
    // 鏌ヨrowDragEle鏄鍑犱釜tr鍏冪礌
    $('#' + this.options.id + '_content_tbody').find('tr').each(function (i) {
        if ($(this).is(oThis.rowDragEle)) {
            oThis.rowDragStartIndex = i;
            return false;
        }
    });
};

// 琛屾嫋鎷�
var rowDragFun = function rowDragFun(e) {
    var oThis = this;
    // 鎷栨嫿鏃跺姩鎬佺敓鎴愬浘鏍�
    if (!oThis.options.canRowDrag) {
        return;
    }

    if (this.rowDragFlag) {
        this.rowDragEndX = e.clientX;
        this.rowDragEndY = e.clientY;
        var changeX = this.rowDragEndX - this.rowDragStartX,
            changeY = this.rowDragEndY - this.rowDragStartY;
        var rowHeight = this.rowDragEle.clientHeight;

        var rowCounts = parseInt(changeY / rowHeight);

        if (rowCounts < 0) {
            this.dragdirection = -1;
        } else {
            this.dragdirection = 1;
        }

        this.rowDragEndIndex = this.rowDragStartIndex + rowCounts;

        if (this.rowDragEndIndex < 0) {
            this.rowDragEndIndex = 0;
        }

        if (this.rowDragEndIndex != this.rowDragStartIndex) {
            // var $flagIconDom = $('<span class="uf uf-moveoption" />');
            //鍏堝垹闄ょ浉鍏崇殑鏍囪鍏冪礌
            $('#' + this.options.id + '_content_tbody').find('tr td').removeClass('u-grid-drag-icon');
            //娣诲姞鏍囪鍏冪礌
            $('#' + this.options.id + '_content_tbody').find('tr').eq(this.rowDragEndIndex).find('td').first().addClass('u-grid-drag-icon');
        }
    }
};

// 琛屾嫋鎷界粨鏉�
var rowDragEnd = function rowDragEnd(e) {
    var tempdata;
    if (!this.options.canRowDrag) {
        return;
    }
    if (this.rowDragFlag && this.rowDragEndIndex != this.rowDragStartIndex) {
        //淇濆瓨涓嬩复鏃舵暟鎹�
        tempdata = this.dataSourceObj.rows[this.rowDragStartIndex];

        $('#' + this.options.id + '_content_tbody').find('tr td').removeClass('u-grid-drag-icon');

        if (this.dragdirection < 0) {

            //dom鍏冪礌鎿嶄綔
            $('#' + this.options.id + '_content_tbody').find('tr').eq(this.rowDragEndIndex).before(this.rowDragEle);

            // 鍒犻櫎璧峰浣嶇疆
            this.dataSourceObj.rows.splice(this.rowDragStartIndex, 1);

            this.dataSourceObj.rows.splice(this.rowDragEndIndex, 0, tempdata);
        } else {

            // 鏁版嵁鎿嶄綔
            this.dataSourceObj.rows.splice(this.rowDragStartIndex, 1);
            // dom鍏冪礌鎿嶄綔
            if (this.rowDragEndIndex >= this.dataSourceObj.rows.length) {
                $('#' + this.options.id + '_content_tbody').append(this.rowDragEle);
                this.dataSourceObj.rows.splice(this.rowDragEndIndex + 1, 0, tempdata);
            } else {
                $('#' + this.options.id + '_content_tbody').find('tr').eq(this.rowDragEndIndex + 1).before(this.rowDragEle);
                this.dataSourceObj.rows.splice(this.rowDragEndIndex, 0, tempdata);
            }
        }

        // 鍒锋柊閫変腑琛� 鍚庣画浼樺寲
        var selectRows = [];
        selectRows = selectRows.concat(this.getSelectRows());
        this.setAllRowUnSelect();
        if (this.options.multiSelect) $('#' + this.options.id + '_content_multiSelect').find('.u-grid-content-sel-row').removeClass('u-grid-content-sel-row');
        if (this.options.showNumCol) $('#' + this.options.id + '_content_numCol').find('.u-grid-content-sel-row').removeClass('u-grid-content-sel-row');
        for (var i = 0; i < selectRows.length; i++) {
            var selectRow = selectRows[i];
            var selectIndex = this.getRowIndexByValue('$_#_@_id', selectRow['$_#_@_id']);
            this.setRowSelect(selectIndex);
        }
    }
    // 鍒犻櫎涔嬪墠琛岋紝鎻掑叆鏂拌

    this.rowDragFlag = false;
    this.rowDragEle = undefined;
};

var setRowDrag = function setRowDrag(isDrag) {
    this.options.canRowDrag = isDrag;
};
var rowDragFunObj = {
    rowDrag_initGridEventFun: rowDrag_initGridEventFun,
    rowDragStart: rowDragStart,
    rowDragFun: rowDragFun,
    rowDragEnd: rowDragEnd,
    setRowDrag: setRowDrag
};

var createContentGroupRows$1 = function createContentGroupRows(createFlag) {
    var htmlStr = '',
        oThis = this;
    if (this.options.groupField && this.dataSourceObj.groupRows && this.dataSourceObj.groupRows.length > 0) {
        $.each(this.dataSourceObj.groupRows, function (i) {
            $.each(this.rows, function () {
                htmlStr += oThis.createContentOneRow(this, createFlag);
            });
            if (oThis.options.groupSumRow) htmlStr += oThis.createContentGroupSumRow(this, createFlag);
        });
    }
    return htmlStr;
};

var createContentLeftMultiSelectGroupRows$1 = function createContentLeftMultiSelectGroupRows() {
    var htmlStr = '',
        oThis = this;
    if (this.options.groupField && this.dataSourceObj.groupRows && this.dataSourceObj.groupRows.length > 0) {
        $.each(this.dataSourceObj.groupRows, function (i) {
            if (this.rows && this.rows.length > 0) {
                $.each(this.rows, function () {
                    htmlStr += oThis.createContentLeftMultiSelectRow(this);
                });
                if (oThis.options.groupSumRow) htmlStr += oThis.createContentLetGroupSumRow('multiSelect', this.value);
            }
        });
    }
    return htmlStr;
};

var createContentLeftNumColGroupRows$1 = function createContentLeftNumColGroupRows() {
    var htmlStr = '',
        oThis = this,
        index = 0;
    if (this.options.groupField && this.dataSourceObj.groupRows && this.dataSourceObj.groupRows.length > 0) {
        $.each(this.dataSourceObj.groupRows, function (i) {
            if (this.rows && this.rows.length > 0) {
                $.each(this.rows, function () {
                    htmlStr += oThis.createContentLeftNumColRow(index);
                    index++;
                });
                if (oThis.options.groupSumRow) htmlStr += oThis.createContentLetGroupSumRow('numCol', this.value);
            }
        });
    }
    return htmlStr;
};

var re_getGroupIndex = function re_getGroupIndex(row, index, rowObj) {
    var groupField = this.options.groupField,
        oThis = this;

    if (groupField) {
        // 瀵逛簬宸茬粡娓叉煋涔嬪悗鍙互鍝﹀ぉ鍝繃姝ゆ柟寮忓鐞�
        // if (this.showType == 'grid') {
        //     var value = this.getString($(row).attr(groupField), '');
        //     var $tds = $("td:contains(" + value + ")");
        //     if ($tds.length > 0) {
        //         var td = $tds[$tds.length - 1];
        //         var $tr = $(td).closest('tr');
        //         var $table = $tr.closest('table');
        //         var index = $table.find('tr[role="row"]').index($tr[0]);
        //         return index;
        //     }
        // }else{
        var value = this.getString($(row).attr(groupField), '');
        var nowIndex = -1;
        this.dataSourceObj.addOneRowGroup(rowObj);

        $.each(this.dataSourceObj.rows, function (i) {
            var nowRow = this;
            var nowValue = oThis.getString($(nowRow.value).attr(groupField), '');
            if (value == nowValue) {
                nowIndex = i;
            } else {
                if (nowIndex > -1) {
                    return false;
                }
            }
        });
        if (nowIndex > -1) {
            return nowIndex + 1;
        } else {
            return nowIndex = this.dataSourceObj.rows.length;
        }
        // }
    }
    return index;
};

var getGroupRowByGroupValue = function getGroupRowByGroupValue(groupValue) {
    var groupRow;
    if (this.dataSourceObj.groupRows && this.dataSourceObj.groupRows.length > 0) {
        $.each(this.dataSourceObj.groupRows, function () {
            var nowGroupRow = this;
            if (nowGroupRow.value == groupValue) {
                groupRow = this;
                return false;
            }
        });
        return groupRow;
    }
};

var deleteOneRowGroup = function deleteOneRowGroup(rowObj) {
    var groupField = this.options.groupField,
        groupValue = rowObj.value[groupField];
    var groupRow = this.getGroupRowByGroupValue(groupValue);
    if (groupRow) {
        var index = groupRow.rows.indexOf(rowObj);
        groupRow.rows.splice(index, 1);
        if (groupRow.rows.length == 0) {
            var groupIndex = this.dataSourceObj.groupRows.indexOf(groupRow);
            this.dataSourceObj.groupRows.splice(groupIndex, 1);
        }
    }
};

var resetGroupFieldTd$1 = function resetGroupFieldTd(groupValue) {
    var $tds = $('#' + this.options.id + '_content_table').find('td[realValue=' + groupValue + ']');
    var l = $tds.length;
    $tds.addClass('u-grid-content-td-group-field').addClass('no-text').removeClass('group-last');
    $($tds[l - 1]).addClass('group-last');
    $($tds[0]).css('line-height', l * this.options.rowHeight + 'px').removeClass('no-text');
};
var groupFunObj = {
    createContentGroupRows: createContentGroupRows$1,
    createContentLeftMultiSelectGroupRows: createContentLeftMultiSelectGroupRows$1,
    createContentLeftNumColGroupRows: createContentLeftNumColGroupRows$1,
    getGroupIndex: re_getGroupIndex,
    getGroupRowByGroupValue: getGroupRowByGroupValue,
    deleteOneRowGroup: deleteOneRowGroup,
    resetGroupFieldTd: resetGroupFieldTd$1
};

// 鍚庣画鍜宑reateSumRow鏁村悎
var createContentGroupSumRow = function createContentGroupSumRow(groupRow, createFlag) {
    if (this.options.groupSumRow) {
        var oThis = this,
            idStr,
            groupValue = groupRow.value;
        if (createFlag == 'fixed') {
            idStr = 'fixed_';
        } else {
            idStr = '';
        }
        var htmlStr = '<tr role="groupsumrow" groupValue="' + groupValue + '" class="u-grid-content-group-sum-row" id="' + this.options.id + '_content_' + idStr + 'group_sum_row_' + groupValue + '">';
        htmlStr += createContentGroupSumRowTd.call(this, groupRow, createFlag);
        htmlStr += '</tr>';
        return htmlStr;
    }
};

var createContentGroupSumRowTd = function createContentGroupSumRowTd(groupRow, createFlag) {
    var htmlStr = '',
        oThis = this,
        gridCompColumnArr;
    if (createFlag == 'fixed') {
        gridCompColumnArr = this.gridCompColumnFixedArr;
    } else {
        gridCompColumnArr = this.gridCompColumnArr;
    }
    $.each(gridCompColumnArr, function () {
        var f = this.options.field;
        var precision = this.options.precision;
        var dataType = this.options.dataType;
        var sumValue = oThis.dataSourceObj.getGroupSumValue(f, this, groupRow);
        if (dataType == 'float') {
            var o = {};
            o.value = sumValue;
            o.precision = precision ? precision : 2;
            sumValue = oThis.DicimalFormater(o);
        }
        var tdStyle = '';
        if (!this.options.visible) {
            tdStyle = 'style="display:none;';
            if (oThis.options.rowHeight) {
                tdStyle += 'height:' + oThis.options.rowHeight + 'px;line-height:' + oThis.options.rowHeight + 'px;';
            }
            tdStyle += '"';
        } else {
            if (oThis.options.rowHeight) {
                tdStyle += 'style="height:' + oThis.options.rowHeight + 'px;line-height:' + oThis.options.rowHeight + 'px;"';
            }
        }
        htmlStr += '<td role="groupsumrowcell"  title="' + sumValue + '" ' + tdStyle + '>';
        if (this.firstColumn) {
            htmlStr += '<div class="u-gird-centent-group-sum-div"><span>' + oThis.transMap.ml_group_sum + '</span></div>';
        }
        var contentStyle = '';
        if (this.options.dataType == 'integer' || this.options.dataType == 'float') {
            contentStyle = 'style="text-align: right;"';
        }
        htmlStr += '<div class="u-grid-content-td-div" ' + contentStyle + '><span value="' + sumValue + '">' + sumValue + '</span></div></td>';
    });
    return htmlStr;
};

var createContentLetGroupSumRow = function createContentLetGroupSumRow(type, groupValue) {
    var w,
        hStr = '';
    if (type == 'multiSelect') w = this.multiSelectWidth;
    if (type == 'numCol') w = this.numWidth;
    var wStr = 'width:' + w + 'px;';

    if (!this.options.needResetHeight) {
        hStr = 'height:' + (this.options.rowHeight + 1) + 'px;';
    }
    var html = '<span groupValue="' + groupValue + '" class="u-grid-content-group-sum-left" style=" ' + wStr + hStr + '"></span>';
    return html;
};

var repairGroupSumRow$1 = function repairGroupSumRow(rowObj) {
    if (this.options.groupSumRow) {
        var oThis = this,
            groupField = this.options.groupField,
            groupValue = rowObj.value[groupField];
        if (!this.repairGroupSumRowArr) {
            this.repairGroupSumRowArr = [];
        }
        if (this.repairGroupSumRowArr.indexOf(groupValue) < 0) {
            this.repairGroupSumRowArr.push(groupValue);
        }
        if (this.re_repairGroupSumRowSetTimeout) clearTimeout(this.re_repairGroupSumRowSetTimeout);
        this.re_repairGroupSumRowSetTimeout = setTimeout(function () {
            repairGroupSumRowFun.call(oThis);
        }, 200);
    }
};

var repairGroupSumRowFun = function repairGroupSumRowFun() {
    var oThis = this;
    if (this.repairGroupSumRowArr && this.repairGroupSumRowArr.length > 0 && this.options.groupSumRow) {
        $.each(this.repairGroupSumRowArr, function () {
            var groupValue = this,
                groupRow = oThis.getGroupRowByGroupValue(groupValue);
            if (groupRow) {
                var $tr = $('#' + oThis.options.id + '_content_tbody').find('tr[groupValue=' + groupValue + ']');
                if ($tr.length > 0) {
                    var htmlStr = createContentGroupSumRowTd.call(oThis, groupRow);
                    $tr.html(htmlStr);
                } else {
                    var htmlStr = oThis.createContentGroupSumRow(groupRow);
                    var $tds = $('#' + oThis.options.id + '_content_tbody').find("td:contains(" + groupValue + ")");
                    if ($tds.length > 0) {
                        var td = $tds[$tds.length - 1];
                        var $tr = $(td).closest('tr');
                        var index = $tr.parent().find('tr[role="row"]').index($tr[0]);
                        $tr[0].insertAdjacentHTML('afterEnd', htmlStr);
                        if (oThis.options.multiSelect) {
                            var mulStr = oThis.createContentLetGroupSumRow('multiSelect', groupValue);
                            var muldiv = $('#' + oThis.options.id + '_content_multiSelect').find('div')[index];
                            muldiv.insertAdjacentHTML('afterEnd', mulStr);
                        }
                        if (oThis.options.showNumCol) {
                            var numStr = oThis.createContentLetGroupSumRow('numCol', groupValue);
                            var numdiv = $('#' + oThis.options.id + '_content_numCol').find('div')[index];
                            numdiv.insertAdjacentHTML('afterEnd', numStr);
                        }
                    }
                }
            } else {
                var $tr = $('#' + oThis.options.id + '_content_tbody').find('tr[groupValue=' + groupValue + ']');
                if ($tr.length > 0) {
                    $tr.remove();
                    if (oThis.options.showNumCol) {
                        var $span = $('#' + oThis.options.id + '_content_numCol').find('span[groupValue=' + groupValue + ']');
                        $span.remove();
                    }
                    if (oThis.options.multiSelect) {
                        var $span = $('#' + oThis.options.id + '_content_multiSelect').find('span[groupValue=' + groupValue + ']');
                        $span.remove();
                    }
                }
            }
        });
        this.resetLeftHeightGroupSumFun();
    }
    this.repairGroupSumRowArr = [];
};

var resetLeftHeightGroupSumFun$1 = function resetLeftHeightGroupSumFun() {
    if ((this.options.showNumCol || this.options.multiSelect) && this.options.groupSumRow) {
        var $trs = $('#' + this.options.id + '_content_tbody tr[role="groupsumrow"]');
        var $leftNums = $('#' + this.options.id + '_content_numCol span');
        var $leftSelects = $('#' + this.options.id + '_content_multiSelect > span');
        for (var i = 0; i < $trs.length; i++) {
            var nowRowHeight = $trs[i].offsetHeight;
            if ($leftNums[i]) {
                $leftNums[i].style.height = nowRowHeight + 'px';
                // $leftNums[i].style.lineHeight = nowRowHeight + 'px';
            }

            if ($leftSelects[i]) {
                $leftSelects[i].style.height = nowRowHeight + 'px';
                // $leftSelects[i].style.lineHeight = nowRowHeight + 'px';
            }
        }
    }
};

var renderTypeGroupSumRow$1 = function renderTypeGroupSumRow(gridCompColumn, i, isFixedColumn, rowObj) {
    var oThis = this;
    var sumCol = gridCompColumn.options.sumCol;
    var groupField = this.options.groupField;
    if (sumCol && groupField) {
        var groupValue = this.getString($(rowObj.value).attr(groupField), '');
        var groupSumRenderType = gridCompColumn.options.groupSumRenderType;
        var dataType = gridCompColumn.options.dataType;
        var idStr = isFixedColumn === true ? 'fixed_' : '';
        var sumSpans = $('#' + this.options.id + '_content_' + idStr + 'group_sum_row_' + groupValue).find('td').eq(i).find('span');
        var sumSpan = sumSpans[sumSpans.length - 1];
        if (sumSpan) {
            if (typeof groupSumRenderType == 'function') {
                var sumV = $(sumSpan).attr('value');
                var obj = {};
                obj.value = sumV;
                obj.element = sumSpan;
                obj.gridObj = oThis;
                obj.gridCompColumn = gridCompColumn;
                groupSumRenderType.call(oThis, obj);
            } else if (dataType == 'integer' || dataType == 'float') {
                sumSpan.style.textAlign = 'right';
            }
        }
    }
};
var groupSumRowFunObj = {
    createContentGroupSumRow: createContentGroupSumRow,
    createContentLetGroupSumRow: createContentLetGroupSumRow,
    repairGroupSumRow: repairGroupSumRow$1,
    resetLeftHeightGroupSumFun: resetLeftHeightGroupSumFun$1,
    renderTypeGroupSumRow: renderTypeGroupSumRow$1
};

var gridComp = function gridComp(ele, options) {
    classCallCheck(this, gridComp);

    this.init(ele, options);
    this.initGrid();
};


var gridCompProto = gridComp.prototype;
if (!Object.assign) {
    Object.assign = u.extend;
}
Object.assign(gridCompProto, createFunObj);
Object.assign(gridCompProto, createCalFunOjb);
Object.assign(gridCompProto, eventFunObj);
Object.assign(gridCompProto, getFunObj);
Object.assign(gridCompProto, initFunObj$2);
Object.assign(gridCompProto, operateRowFunObj);
Object.assign(gridCompProto, renderTypeFunObj);
Object.assign(gridCompProto, setFunObj);
Object.assign(gridCompProto, wdChangeFunObj);
Object.assign(gridCompProto, clickFunObj);
Object.assign(gridCompProto, otherFunObj);
Object.assign(gridCompProto, utilFunOjb);

/*
 * colmuenu
 */
var oldInitGridCompColumn = gridCompProto.initGridCompColumn;
var oldInitEventFun = gridCompProto.initEventFun;
var oldInitGridEventFun = gridCompProto.initGridEventFun;

gridCompProto.initGridCompColumnColumnMenuFun = re_initGridCompColumnColumnMenuFun;
gridCompProto.initGridCompColumn = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitGridCompColumn.apply(this, arguments);
    colMenu_initGridCompColumn.apply(this, arguments);
};
gridCompProto.createColumnMenu = re_createColumnMenu;
gridCompProto.initEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitEventFun.apply(this, arguments);
    colMenu_initEventFun.apply(this, arguments);
};
gridCompProto.initGridEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitGridEventFun.apply(this, arguments);
    colMenu_initGridEventFun.apply(this, arguments);
};

if (typeof gridCompProto.saveGridCompColumnArrToLocal == 'undefined') {
    gridCompProto.saveGridCompColumnArrToLocal = function () {};
}
if (typeof gridCompProto.clearLocalData == 'undefined') {
    gridCompProto.clearLocalData = function () {};
}

/*
 * grag
 */
var oldInitEventFun_grag = gridCompProto.initEventFun;
var oldInitGridEventFun_grag = gridCompProto.initGridEventFun;
Object.assign(gridCompProto, dragFunObj);
gridCompProto.initEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitEventFun_grag.apply(this, arguments);
    dragFunObj.drag_initEventFun.apply(this, arguments);
};
gridCompProto.initGridEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitGridEventFun_grag.apply(this, arguments);
    dragFunObj.drag_initGridEventFun.apply(this, arguments);
};
if (typeof gridCompProto.saveGridCompColumnArrToLocal == 'undefined') {
    gridCompProto.saveGridCompColumnArrToLocal = function () {};
}

/*
 * edit
 */
var oldInitEventFun_edit = gridCompProto.initEventFun;
Object.assign(gridCompProto, eidtFunObj);

if (typeof gridCompProto.formEditCell == 'undefined') {
    gridCompProto.formEditCell = function () {};
}

gridCompProto.initEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitEventFun_edit.apply(this, arguments);
    eidtFunObj.edit_initEventFun.apply(this, arguments);
};

/*
 * editForm
 */
var oldInitDefault = gridCompProto.initDefault;
var oldSetRequired = gridCompProto.setRequired;
Object.assign(gridCompProto, editFromFunObj);
gridCompProto.initDefault = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitDefault.apply(this, arguments);
    editFromFunObj.editForm_initDefault.apply(this, arguments);
};
gridCompProto.setRequired = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldSetRequired.apply(this, arguments);
    editFromFunObj.editForm_setRequired.apply(this, arguments);
};

/*
 * fixed
 */
var oldColumnsVisibleFun = gridCompProto.columnsVisibleFun;
Object.assign(gridCompProto, fixFunObj);
gridCompProto.columnsVisibleFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldColumnsVisibleFun.apply(this, arguments);
    fixFunObj.fixed_columnsVisibleFun.apply(this, arguments);
};

/*
 * formShow
 */
Object.assign(gridCompProto, formShowFunOjb);

/*
 * headerLevel
 */
Object.assign(gridCompProto, headerLevelFunObj);

/*
 * localStorage
 */
Object.assign(gridCompProto, localStorageFunObj);

/*
 * overWidthColumn
 */
Object.assign(gridCompProto, overWidthHiddenFunObj);

/*
 * sort
 */
var oldInitEventFun_sort = gridCompProto.initEventFun;
var oldInitGridEventFun_sort = gridCompProto.initGridEventFun;
Object.assign(gridCompProto, sortFunObj);
gridCompProto.initEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitEventFun_sort.apply(this, arguments);
    sortFunObj.sort_initEventFun.apply(this, arguments);
};
gridCompProto.initGridEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitGridEventFun_sort.apply(this, arguments);
    sortFunObj.sort_initGridEventFun.apply(this, arguments);
};

/*
 * sumRow
 */
Object.assign(gridCompProto, sumRowFunObj);

/*
 * swap
 */
var oldInitEventFun_swap = gridCompProto.initEventFun;
var oldInitGridEventFun_swap = gridCompProto.initGridEventFun;
Object.assign(gridCompProto, swapFunObj);

gridCompProto.initEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitEventFun_swap.apply(this, arguments);
    swapFunObj.swap_initEventFun.apply(this, arguments);
};
gridCompProto.initGridEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitGridEventFun_swap.apply(this, arguments);
    swapFunObj.swap_initGridEventFun.apply(this, arguments);
};

/*
 * rowDrag
 */

// var oldInitEventFun_rowDrag= gridCompProto.initEventFun;
var oldInitGridEventFun_rowDrag = gridCompProto.initGridEventFun;
Object.assign(gridCompProto, rowDragFunObj);

gridCompProto.initGridEventFun = function () {
    // 鎵ц鍘熸湁鏂规硶
    oldInitGridEventFun_rowDrag.apply(this, arguments);
    rowDragFunObj.rowDrag_initGridEventFun.apply(this, arguments);
};

/*
 * tree
 */
Object.assign(gridCompProto, treeFunObj);

/*
 * group
 */
Object.assign(gridCompProto, groupFunObj);

/*
 * groupsum
 */
Object.assign(gridCompProto, groupSumRowFunObj);

/*
 * 瀵硅薄鎵€鏀寔鐨勫睘鎬у強榛樿鍊�
 */

var old = $.fn.grid;
// 鏂规硶鎵╁睍
$.fn.grid = function (options) {
	var grid = $(this).data('gridComp');
	if (!grid) $(this).data('gridComp', grid = new gridComp(this, options));
	return grid;
};
$.fn.grid.gridComp = gridComp;
$.fn.grid.gridCompColumn = column;
$.fn.grid.dataSource = dataSource;

$.fn.grid.noConflict = function () {
	$.fn.grid = old;
	return this;
};

}());