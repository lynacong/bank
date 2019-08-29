
mini.iuapbpm = mini.iuapbpm || {};

mini.iuapbpm.BaseTree = function () {
    mini.iuapbpm.BaseTree.superclass.constructor.apply(this, arguments);
    this.setIdField("id");
    this.setParentField("pid");
    this.setTextField("name");
    this.setResultAsTree(false);
};

mini.extend(mini.iuapbpm.BaseTree, mini.Tree, {
    uiCls: "mini-iuapbasetree",
    operPackage: "",
    formIds: "",
    beforeSubmitName: "",
    url: "",
    successName: "",
    success: function (data) {
        if (typeof (data) == 'string') {
            data = eval('(' + data + ')');
        }

        if (this.successName) {
            eval(this.successName + "(data)");
        } else {
            var tree = mini.get(this.treeId);

            if (tree.pNode) {
                tree.addNodes(obj, tree.pNode);
            } else {
                tree.loadList(obj, "id", "pid");
            }
        }
    },
    errorName: "",
    error: function (jqXHR, textStatus, errorThrown) {
        if (this.errorName) {
            eval(this.errorName + "(jqXHR)");
        } else {
//            alert("ajax回调 error方法");
        }
    },

    setLeafIconCls: function (a) {
        if (this.leafIconCls != a) {
            this.leafIconCls = a;
            this.doUpdate();
        }
    },
    getLeafIconCls: function () {
        return this.leafIconCls;
    },
    setOperPackage: function (a) {
        if (this.operPackage != a) {
            this.operPackage = a;
            this.doUpdate();
        }
    },
    getOperPackage: function () {
        return this.operPackage;
    },
    setFormIds: function (a) {
        if (this.formIds != a) {
            this.formIds = a;
            this.doUpdate();
        }
    },
    getFormIds: function () {
        return this.formIds;
    },
    getBeforeSubmitName: function () {
        return this.beforeSubmitName;
    },
    setBeforeSubmitName: function (a) {
        if (this.beforeSubmitName != a) {
            this.beforeSubmitName = a;
            this.doUpdate();
        }
    },
    setUrl: function (a) {
        if (this.url != a) {
            this.url = a;
            this.doUpdate();
        }
    },
    getUrl: function () {
        return this.url;
    },
    setSuccess: function (a) {
        this.success = a;
        this.doUpdate();
    },
    getSuccess: function () {
        return this.success;
    },
    setError: function (a) {
        this.error = a;
        this.doUpdate();
    },
    getError: function () {
        return this.error;
    },

    _beforeSubmit: function (obj) {
        if (!obj) {
            obj = {};
        }
        if (this.beforeSubmitName) {
            obj.beforeSubmitResult = eval(this.beforeSubmitName + "()");
        }
        return obj;
    },
    _prepareData: function (obj) {
        if (!obj) {
            obj = {};
        }
        if (this.operPackage) {
            obj.operPackage = this.operPackage;
        }
        if (this.formIds) {
            var formIds = this.formIds.split(",");
            var len = formIds.length;
            for (var i = 0; i < len; i++) {
                var form = new mini.Form("#" + formIds[i]);
                if (form) {
                    obj[formIds[i]] = form.getData();
                }
            }
        }
        return obj;
    },
    loadRoleData:function(){
        var url = iuap_bpm_global_url.iuap_bpm_baseTree_url_1;
        var obj = {};

        if (typeof (this.extAttrs) == 'object') {
            obj = mini.clone(this.extAttrs);
        }

        obj = this._beforeSubmit(obj);

        if (typeof (obj.beforeSubmitResult) == 'boolean' && !obj.beforeSubmitResult) {
            return;
        }

        obj = this._prepareData(obj);

        var json = mini.encode(obj);

        this._ajax(url, json, this.success, this.error);
    },
    loadData: function () {
        var obj = {};

        if (typeof (this.extAttrs) == 'object') {
            obj = mini.clone(this.extAttrs);
        }

        obj = this._beforeSubmit(obj);

        if (typeof (obj.beforeSubmitResult) == 'boolean' && !obj.beforeSubmitResult) {
            return;
        }

        obj = this._prepareData(obj);
        if(this.pk){
        	obj.pk=this.pk;
        }
        if(this.nodeType){
        	obj.nodeType=this.nodeType;
        }
        var json = mini.encode(obj);

        this._ajax(this.url, json, this.success, this.error);
    },
    _ajax: function (url, json, success, error) {
        $.ajax({
            url: url,
            type: "post",
            data: json,
            contentType: 'application/json;charset=utf-8',
            dataType: 'json',
            success: success,
            error: error,
            successName: this.successName,
            errorName: this.errorName,
            treeId: this.getId()
        });
    },

    _on: function (type, fn, scope) {
        mini.iuapbpm.BaseButton.superclass.on.call(this, type, fn, scope);

        type = type.toLowerCase();
        //事件只保留最后一个
        if ("drawnode" == type || "expand" == type) {
            var event = this._events[type];
            if (event instanceof Array && event.length > 1) {
                this._events[type] = [event[event.length - 1]];
            }
        }

        return this;
    },
    getAttrs: function (el) {
        var attrs = mini.iuapbpm.BaseTree.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs, ["operPackage", "formIds", "beforeSubmitName", "url", "successName", "errorName", "leafIconCls"]);
        return attrs;
    },

    _getValue: function (value, compId, formId) {
        var v = value;

        if (formId && compId) {
            var form = new mini.Form("#" + formId);
            if (form) {
                var data = form.getData();
                v = data[compId];
            }
        }

        if (!v) {
            if (compId) {
                var nuiObj = mini.get(compId);
                if (nuiObj) {
                    v = nuiObj.getValue();
                } else {
                    nuiObj = $("#" + compId);
                    if (nuiObj) {
                        v = nuiObj.val();
                    }
                }
            }
        }

        return v;
    }
});

mini.regClass(mini.iuapbpm.BaseTree, "iuapbasetree");
   