
mini.iuapbpm = mini.iuapbpm || {};
var temp=[];
var result = [];
var tmpNodes;
mini.iuapbpm.SelectUserTree = function () {
    mini.iuapbpm.SelectUserTree.superclass.constructor.apply(this, arguments);
//    this.setCheckRecursive(true);
//    this.setShowCheckBox(true);
    this.setLeafIconCls("user");
    this.setShowTreeIcon(true);
    this.on("drawnode", this._onDrawNode, this);
    this.on("expand", this._onExpand, this);
    this.on("nodecheck", this._nodeCheck, this);
    this.setUrl("../service/reference/org_view/tree");
};

mini.extend(mini.iuapbpm.SelectUserTree, mini.iuapbpm.BaseTree, {
    uiCls: "mini-iuapselectusertree",
    checkedNodeIds: [],

    setCheckNodeIds: function (a) {
        if (a instanceof Array) {
            this.checkedNodeIds = a;
        } else if (typeof (a) == 'string') {
            this.checkedNodeIds = a.split(',');
        }
    },

    _prepareData: function (obj) {
        obj = mini.iuapbpm.SelectUserTree.superclass._prepareData.call(this, obj);
        if (this.pNode) {
            obj.id = this.pNode.id;
            obj.orgValues = this.pNode.id;
            obj.roleValues = this.pNode.id;
            obj.type = this.pNode.type;
            if(typeof(obj.viewValue) == 'undefined'){
            	obj.viewValue = this.pNode.viewValue;
            }

            obj.appValue = this.pNode.appValue;

        }
        obj.viewCategory = "ViewCode"
        return obj;
    },

    loadData: function () {
        mini.iuapbpm.SelectUserTree.superclass.loadData.call(this);
    },
    orgLoadData: function () {
        mini.iuapbpm.SelectUserTree.superclass.loadData.call(this);
    },
    success: function (data) {
    	if (typeof (data) == 'string') {
    		data = eval('(' + data + ')');
    	}
    	if(data.result){
    		data = data.result;
    		if (typeof (data) == 'string') {
                data = eval('(' + data + ')');
            }
    	}

        var tree = mini.get(this.treeId);

        var checkedNodes = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].objectclass) {
                if (data[i].objectclass.toLowerCase() == "organizations") {
                    data[i].isLeaf = false;
                    data[i].asyncLoad = false;
                    data[i].expanded = false;
                } else {
                    data[i].isLeaf = true;
                }
            }

            if (tree.checkedNodeIds instanceof Array && tree.checkedNodeIds.length > 0) {
            	//判断当前节点是否选中
                for (var m = 0; m < tree.checkedNodeIds.length; m++) {
                	if(tree.pNode && tree.pNode.checked && tree.pNode.checked == true){
                		checkedNodes.push(data[i]);
                	}else{
                		if(data[i].pk == tree.checkedNodeIds[m]) {
                            checkedNodes.push(data[i]);
                        }
                	}
                }

            }
        }

        if (tree.pNode) {

            tree.addNodes(data, tree.pNode);
        } else {
            tree.loadList(data, tree.idField, tree.parentField);
        }

        if (checkedNodes && checkedNodes.length > 0) {
            tree.checkNodes(checkedNodes, true);
        }
    },
    _onDrawNode: function (e) {

        if (this.extAttrs && this.extAttrs.activity) {
            e.showCheckBox = true;
            if (e.cellHtml == "用户" || e.cellHtml == "组织" || e.cellHtml == "角色") {
                e.showCheckBox = false;
            }

            //            mini.encode(this.extAttrs.activity.participants)

        } else {
            var isLeaf = e.node.isLeaf;
            if (isLeaf) {
                e.iconCls = "user";
                e.showCheckBox = e.sender.showCheckBox;
            } else {
                e.showCheckBox = false;
            }
        }

    },

    _onExpand: function (e) {
        if (this.extAttrs && this.extAttrs.activity) {
            var pnode = e.node;
            var pars = this.extAttrs.activity.participants;
            if(typeof(pars[0]) != 'undefined'){
            	pnode.viewValue =pars[0].viewValue;
            }
            if (pnode.children && pnode.children.length > 0) {
                return;
            }
            var tree = e.sender;
            tree.pNode = pnode;
            if ((pnode.type && pnode.type.toLowerCase() == "org") || (pnode.nodeType && pnode.nodeType == "ORGANIZATIONS") || (pnode.nodeType && pnode.OBJECTCLASS == "ORGANIZATIONS")) {
                tree.orgLoadData();
            } else if (pnode.type && pnode.type.toLowerCase() == "role") {
                tree.roleLoadData();
            }else if (pnode.objectClass && pnode.objectClass=="ORGANIZATIONS"){
            	tree.orgLoadData();
            }

        } else {
            var pnode = e.node;
            if (pnode.children && pnode.children.length > 0) {
                return;
            }

            var tree = e.sender;
            tree.nodeType=pnode.nodeType;
            tree.pk=pnode.pk;
            tree.pNode = pnode;
            tree.loadData();
        }

    },
    _nodeCheck:function(e){
    	result=[];
    	var id=e.node.id || e.node.pk;
    	var len=temp.length;
        	for(var i=0;temp!=null&&i<len;i++){
        		var sid=temp[i];
        		if(id==sid){
        			if(e.checked){
        				tmpNodes[i]=null;
        			}else{
        				tmpNodes[i]=e.node;
        			}
        		}
        		//判断e.node是否是父节点
        		var children=e.node.children;
        		if(children!=null && children.length>0){
        			if(!e.checked){//如果是要全选，则说明不管之前父节点的所有节点有没有选中，都无所谓；
        				
        			}else{//如果全不选，那就要判断子节点中是否之前选中，若有 则置空
        				var idNodes=isFatherNode(e.node,e.node.id);
        				for(var j=0;j<idNodes.length;j++){
            				var nid=idNodes[j].id||idNodes[j].pk;
            				if(nid==sid){
            					tmpNodes[i]=null;
                    		}
            			}
        			}
        		}
        	}
    }
    
});

mini.regClass(mini.iuapbpm.SelectUserTree, "iuapselectusertree");


function isFatherNode(data,id){
	    for(var i in data.children){
	        if(data.children[i].pid==id){
	            result.push(data.children[i]);
	            if(data.children.length>0){
	            	isFatherNode(data.children[i],data.children[i].id);    
	            }         
	        }       
	    }
	    return result;
}
function SetData(data) {
    var tree = mini.get("selectUserTree");
    if (data) {
        if (data.showCheckBox) {
            tree.setShowCheckBox(data.showCheckBox);
        }
        tree.extAttrs = mini.clone(data);
        if ((tree.extAttrs.checkedIds instanceof Array) || (typeof (tree.extAttrs.checkedIds) == 'string')) {
            tree.setCheckNodeIds(tree.extAttrs.checkedIds);
        }
        tree.url = data.url || tree.url;
    }

    tree.loadData();
}

function GetData(data) {
    var tree = mini.get("selectUserTree");
    tree.extAttrs = mini.clone(data);
//    if (tree.showCheckBox) {
//            var nodes = tree.getCheckedNodes(false);
//            var len = nodes.length;
//            var ids = [], names = [];
//            for (var i = 0; i < len; i++) {
//                var node = nodes[i];
//                ids.push(node.pk || node.id);
//                names.push(node.name);
//            }
//            var data = {};
//            data.id = ids.join(",");
//            data.name = names.join(",");
//            data.nodes = mini.clone(nodes);
//            return data;
//
//    } else {
        var node = tree.getSelectedNode();
        var data = {};
        data.id = node.pk || node.id;
        data.name = node.name;
        data.nodes = [mini.clone(node)];
        return data;
//    }
}

function CloseWindow(action) {
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow(action);
    } else {
        window.close();
    }
}

function onOk() {
    var tree = mini.get("selectUserTree");

    var node = null;
//    if (tree.showCheckBox) {
//        node = tree.getCheckedNodes();
//    } else {
        node = tree.getSelectedNode();
//    }

    if (!node || node.length == 0) {
    	if(!tmpNodes || tmpNodes.length==0){
    		 alert("请选择部门！");
    	        return;
    	}       
    }
    //if (tree.isLeaf(node) == false) { 
    // alert("不能选中父节点"); 
    // return; 
    //} 

    CloseWindow("ok");
}

function onCancel() {
    CloseWindow("cancel");
}
   