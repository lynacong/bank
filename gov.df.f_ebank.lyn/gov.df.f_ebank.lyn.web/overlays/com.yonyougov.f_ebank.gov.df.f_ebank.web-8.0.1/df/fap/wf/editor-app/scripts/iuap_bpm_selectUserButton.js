
mini.iuapbpm = mini.iuapbpm || {};

mini.iuapbpm.SelectUserButton = function () {
    mini.iuapbpm.SelectUserButton.superclass.constructor.apply(this, arguments);
    this.onClick(this.onClick_loadUserData, this);
    this.setUrl("reference-popup-dept3.html");
};

mini.extend(mini.iuapbpm.SelectUserButton, mini.iuapbpm.BaseButton, {
    uiCls: "mini-iuapselectuserbutton",

    textCompId: "",

    formId: "",
    //新增参数
    processDefinitionId: "",
    processDefinitionCompId:"",
    userId:"",
    userCompId:"",
    //end
    viewValueCompId: "",
    orgValuesCompId: "",
    viewValue: "",
    
    viewCategory: "",
    orgValues: "",
    orgCategory: "",
    listObjCategories: "",
    objectStatusCategories: "",
    orgDepth: "1",
    orgRank: "",
    userRank: "",
    orgType: "",
    orgClass: "0",

    useAssignUserData: "false",

    setTextCompId: function (a) {
        if (this.textCompId != a) {
            this.textCompId = a;
            this.doUpdate();
        }
    },
    getTextCompId: function () {
        return this.textCompId;
    },
    setFormId: function (a) {
        if (this.formId != a) {
            this.formId = a;
            this.doUpdate();
        }
    },
    getFormId: function () {
        return this.formId;
    },
    setProcessDefinitionId: function (a) {
        if (this.processDefinitionId != a) {
            this.processDefinitionId = a;
            this.doUpdate();
        }
    },
    getProcessDefinitionId: function () {
        return this.processDefinitionId;
    },
    setProcessDefinitionCompId: function (a) {
        if (this.processDefinitionCompId != a) {
            this.processDefinitionCompId = a;
            this.doUpdate();
        }
    },
    getProcessDefinitionCompId: function () {
        return this.processDefinitionCompId;
    },
    setUserId: function (a) {
        if (this.userId != a) {
            this.userId = a;
            this.doUpdate();
        }
    },
    getUserId: function () {
        return this.userId;
    },
    setUserCompId: function (a) {
        if (this.userCompId != a) {
            this.userCompId = a;
            this.doUpdate();
        }
    },
    getUserCompId: function () {
        return this.userCompId;
    },
    setViewValueCompId: function (a) {
        if (this.viewValueCompId != a) {
            this.viewValueCompId = a;
            this.doUpdate();
        }
    },
    getViewValueCompId: function () {
        return this.viewValueCompId;
    },
    setOrgValuesCompId: function (a) {
        if (this.orgValuesCompId != a) {
            this.orgValuesCompId = a;
            this.doUpdate();
        }
    },
    getOrgValuesCompId: function () {
        return this.orgValuesCompId;
    },
    setViewValue: function (a) {
        if (this.viewValue != a) {
            this.viewValue = a;
            this.doUpdate();
        }
    },
    getViewValue: function () {
        return this.viewValue;
    },
    setViewCategory: function (a) {
        if (this.viewCategory != a) {
            this.viewCategory = a;
            this.doUpdate();
        }
    },
    getViewCategory: function () {
        return this.viewCategory;
    },
    setOrgValues: function (a) {
        if (this.orgValues != a) {
            this.orgValues = a;
            this.doUpdate();
        }
    },
    getOrgValues: function () {
        return this.orgValues;
    },
    setOrgCategory: function (a) {
        if (this.orgCategory != a) {
            this.orgCategory = a;
            this.doUpdate();
        }
    },
    getOrgCategory: function () {
        return this.orgCategory;
    },
    setListObjCategories: function (a) {
        if (this.listObjCategories != a) {
            this.listObjCategories = a;
            this.doUpdate();
        }
    },
    getListObjCategories: function () {
        return this.listObjCategories;
    },
    setObjectStatusCategories: function (a) {
        if (this.objectStatusCategories != a) {
            this.objectStatusCategories = a;
            this.doUpdate();
        }
    },
    getObjectStatusCategories: function () {
        return this.objectStatusCategories;
    },
    setOrgDepth: function (a) {
        if (this.orgDepth != a) {
            this.orgDepth = a;
            this.doUpdate();
        }
    },
    getOrgDepth: function () {
        return this.orgDepth;
    },
    setOrgRank: function (a) {
        if (this.orgRank != a) {
            this.orgRank = a;
            this.doUpdate();
        }
    },
    getOrgRank: function () {
        return this.orgRank;
    },
    setUserRank: function (a) {
        if (this.userRank != a) {
            this.userRank = a;
            this.doUpdate();
        }
    },
    getUserRank: function () {
        return this.userRank;
    },
    setOrgType: function (a) {
        if (this.orgType != a) {
            this.orgType = a;
            this.doUpdate();
        }
    },
    getOrgType: function () {
        return this.orgType;
    },
    setOrgClass: function (a) {
        if (this.orgClass != a) {
            this.orgClass = a;
            this.doUpdate();
        }
    },
    getOrgClass: function () {
        return this.orgClass;
    },
    setUseAssignUserData: function (a) {
        if (this.useAssignUserData != a) {
            this.useAssignUserData = a;
            this.doUpdate();
        }
    },
    getUseAssignUserData: function () {
        return this.useAssignUserData;
    },
    _prepareData: function (obj) {
        obj = mini.iuapbpm.SelectUserButton.superclass._prepareData.call(this, obj);

		var viewValue=getParamValue("viewValue");
        var processDefinitionId = this._getValue(this.processDefinitionId, this.processDefinitionCompId, this.formId);
        var userId = this._getValue(this.userId, this.userCompId, this.formId);
        
//        var viewValue = this._getValue(this.viewValue, this.viewValueCompId, this.formId);
        var viewCategory = this.viewCategory;
        var orgValues = this._getValue(this.orgValues, this.orgValuesCompId, this.formId);
        var orgCategory = this.orgCategory;
        var listObjCategories = this.listObjCategories;
        var objectStatusCategories = this.objectStatusCategories;
        var orgDepth = this.orgDepth;
        var orgRank = this.orgRank;
        var userRank = this.userRank;
        var orgType = this.orgType;
        var orgClass = this.orgClass;

        if (userId) {
            obj.userId = userId;
        }
        if (processDefinitionId) {
            obj.processDefinitionId = processDefinitionId;
        }
        if (viewValue) {
            obj.viewValue =viewValue;
        }
        if (viewCategory) {
            obj.viewCategory = viewCategory;
        }
        if (orgValues) {
            obj.orgValues = orgValues;
        }
        if (orgCategory) {
            obj.orgCategory = orgCategory;
        }
        if (listObjCategories) {
            obj.listObjCategories = listObjCategories;
        }
        if (objectStatusCategories) {
            obj.objectStatusCategories = objectStatusCategories;
        }
        if (orgDepth) {
            obj.orgDepth = orgDepth;
        }
        if (orgRank) {
            obj.orgRank = orgRank;
        }
        if (userRank) {
            obj.userRank = userRank;
        }
        if (orgType) {
            obj.orgType = orgType;
        }
        if (orgClass) {
            obj.orgClass = orgClass;
        }

        return obj;
    },

    onClick_loadUserData: function (e) {
        var btn = e.sender;

        btn.extAttrs = btn.extAttrs || {};
        btn.extAttrs = this._beforeSubmit(btn.extAttrs);
        btn.extAttrs = this._prepareData(btn.extAttrs);

        mini.open({
            url: btn.url,
            showMaxButton: false,
            title: "选择特定部门",
            width: 350,
            height: 450,
            onload: function () {
                var iframe = this.getIFrameEl();
                btn.extAttrs.showCheckBox = true;
                btn.extAttrs.showFolderCheckBox = true;
                iframe.contentWindow.SetData(btn.extAttrs);
            },
            ondestroy: function (action) { if (action == "ok") {
                var iframe = this.getIFrameEl();
                var data = iframe.contentWindow.GetData(btn.extAttrs);

                data = mini.clone(data);
                var grid = mini.get("datagrid1");
                
                if (data && grid) {
                	grid.selectAll(false);
                    var rows=grid.getSelecteds();
                    var result=data.nodes;
                    //判断是否有重复
                    for(var k=0;result!=null&&k<result.length;k++){
                    	if(result[k]!=null){
                    		var result_deptCode=result[k].id;
		               		for(var j=0;j<rows.length;j++){
			                 	var rows_deptCode=rows[j].id||rows[j].deptCode;
			                 	if(result_deptCode==rows_deptCode){
			                 		result[k]=null;
			                 	}
		               		}
                    	}
                    }
                   
                    var tArray=new Array();
                    for(var m=0;m<rows.length;m++){
                    	 var obj_old={};
                    	 obj_old.all_path_name=rows[m].all_path_name;
                    	 obj_old.name=rows[m].name;
                    	 obj_old.id=rows[m].id||rows[m].deptCode;
                 		tArray.push(obj_old);
                    }
                	for(var i=0;result!=null&&i<result.length;i++){
                		if(result[i]!=null){
                			 var obj={};
                     		obj.all_path_name=result[i].all_path_name;
                     		obj.name=result[i].name;
                     		obj.id=result[i].id;
                     		tArray.push(obj);
                		}
                	}
                	grid.setData(tArray);
                }
            }
}
        });
    },

    getAttrs: function (el) {
        var attrs = mini.iuapbpm.SelectUserButton.superclass.getAttrs.call(this, el);
        mini._ParseString(el, attrs, ["textCompId", "formId","processDefinitionId","processDefinitionCompId","userId","userCompId", "viewValueCompId", "orgValuesCompId","viewValue", "useAssignUserData"]);
        return attrs;
    }
});

mini.regClass(mini.iuapbpm.SelectUserButton, "iuapselectuserbutton");

