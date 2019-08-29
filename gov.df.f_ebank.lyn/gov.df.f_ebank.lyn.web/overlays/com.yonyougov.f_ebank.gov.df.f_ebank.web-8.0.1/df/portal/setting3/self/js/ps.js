/**
 * portal setting
 */
;(function (window, document, undefined) {

    $.extend({

        ps: {
            jqgrid: {
                /**
                 * 获取全部选中行ID
                 */
                getSelRowId: function (jqId) {
                    return $("#" + jqId).jqGrid("getGridParam", "selarrrow");
                },
                /**
                 * 获取全部选中行ROW对象
                 */
                getSelRowData: function (jqId) {
                    var ids = this.getSelRowId(jqId);
                    var rows = [];
                    for (var i in ids) {
                        if (!ids.hasOwnProperty(i)) continue;
                        var row = jQuery("#" + jqId).jqGrid("getRowData", ids[i]);
                        rows.push(row);
                    }
                    return rows;
                },
                /**
                 * 获取指定行指定列值
                 */
                getSelRowColData: function (jqId, rowId, colName) {
                    return jQuery("#" + jqId).getCell(rowId, colName);
                },
                /**
                 * 刷新表格区域
                 * @params jqId
                 * @params jqgrid_data 主体数据，[{},{},...]
                 * @params [page] 起始页，默认1
                 */
                refresh: function (jqId, jqgrid_data, page) {
                    $("#" + jqId).jqGrid('clearGridData');  //清空表格
                    $("#" + jqId).jqGrid('setGridParam', {  // 重新加载数据
                        datatype: 'local',
                        data: jqgrid_data,   // newdata 是符合格式要求的需要重新加载的数据
                        page: page || 1
                    }).trigger("reloadGrid");
                }

            },

            /**
             * layer
             */
            layer: {
                /**
                 * 操作信息提示
                 * @param o
                 */
                confirm: function (flag) {
                    layer.confirm(flag, {
                        btn: ['确定']
                        , title: '操作提示'
                        , shadeClose: true
                    }, function (index) {
                        layer.close(index);
                    });
                },
                /**
                 * 最大化
                 * @param id
                 */
                maxDiv : function(id){
                    var index = layer.open({
                        type: 1,
                        title: '',
                        //skin: 'layui-layer-rim', //加上边框
                        area: ['820px', '600px'], //宽高
                        content: $(id),
                        offset: 'rb',
                        closeBtn: 2,
                        //maxmin: true,
                        yes: function (index) {
                            layer.close(index);
                        },
                        cancel: function (index) {
                            layer.close(index);
                        }
                    });
                    layer.full(index);
                }

            }

        }

    });


})(window, document);