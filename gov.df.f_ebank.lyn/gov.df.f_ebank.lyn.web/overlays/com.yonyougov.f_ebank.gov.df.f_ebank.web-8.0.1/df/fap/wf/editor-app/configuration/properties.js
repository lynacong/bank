/*
 * Activiti Modeler component part of the Activiti project
 * Copyright 2005-2014 Alfresco Software, Ltd. All rights reserved.
 * 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.

 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */
'use strict';

var KISBPM = KISBPM || {};
KISBPM.PROPERTY_CONFIG = {
	"string" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/string-property-write-mode-template.html"
	},
	"integer" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/integer-property-write-mode-template.html"
	},
	"condition" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/condition-property-write-mode-template.html"
	},
	"timercycle" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/timercycle-property-write-mode-template.html"
	},
	"timerdate" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/timerdate-property-write-mode-template.html"
	},
	"timerduration" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/timerduration-property-write-mode-template.html"
	},
	"boolean" : {
		"templateUrl" : "editor-app/configuration/properties/boolean-property-template.html"
	},
	"text" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/text-property-write-template.html"
	},
	"text_exp" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/text-exp-property-write-template.html"
	},
	"mailtext" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/text-mail-property-write-template.html"
	},
	"kisbpm-multiinstance" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstance-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstance-property-write-template.html"
	},
	"kisbpm-multiinstancemodel" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstancemodel-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstancemodel-property-write-template.html"
	},
	"kisbpm-multiuserrank" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiuserrank-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiuserrank-property-write-template.html"
	},
	"kisbpm-multiinstancepriority" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstancepriority-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstancepriority-property-write-template.html"
	},
	"kisbpm-scriptformat" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/scriptformat-property-write-template.html"
	},
	"kisbpm-servicetasktype" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/servicetasktype-property-write-template.html"
	},
	"kisbpm-texttype" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/default-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/texttype-property-write-template.html"
	},
	"oryx-formproperties-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/form-properties-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/form-properties-write-template.html"
	},
	"oryx-executionlisteners-multiplecomplex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/execution-listeners-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/execution-listeners-write-template.html"
	},
	"oryx-sequenceexecutionlisteners-multiplecomplex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/sequenceexecution-listeners-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/sequenceexecution-listeners-write-template.html"
	},
	"oryx-tasklisteners-multiplecomplex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/task-listeners-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/task-listeners-write-template.html"
	},
	"oryx-eventlisteners-multiplecomplex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/event-listeners-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/event-listeners-write-template.html"
	},
	"oryx-usertaskassignment-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/assignment-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/assignment-write-template.html"
	},
	"oryx-servicetaskfields-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/fields-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/fields-write-template.html"
	},
	"oryx-callactivityinparameters-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/in-parameters-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/in-parameters-write-template.html"
	},
	"oryx-callactivityoutparameters-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/out-parameters-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/out-parameters-write-template.html"
	},
	"oryx-subprocessreference-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/subprocess-reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/subprocess-reference-write-template.html"
	},
	"oryx-formreference-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/form-reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/form-reference-write-template.html"
	},
	"oryx-sequencefloworder-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/sequenceflow-order-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/sequenceflow-order-write-template.html"
	},
	"oryx-conditionsequenceflow-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/condition-expression-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/condition-expression-write-template.html"
	},
	"oryx-conditionsequencejumpflow-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/condition-expression-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/condition-expression-write-template.html"
	},
	"oryx-gridreference-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/grid/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/grid/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "grid",
		"multiSelect" : true,
		"dataUrl" : "/reference/grid",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		}, {
			id : 'type',
			i18n : 'REFERENCE.BASE.TYPE'
		} ]
	},
	"oryx-treereference-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"dataUrl" : "/reference/tree",
		"multiSelect" : true,
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		} ]
	},
	"oryx-treegridreference-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/treegrid/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/treegrid/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "treegrid",
		"dataUrl" : "/reference/treegrid/grid",
		"treeDataUrl" : "/reference/treegrid/tree",
		"multiSelect" : true,
		"treeMultiSelect" : true,
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		}, {
			id : 'type',
			i18n : 'REFERENCE.BASE.TYPE'
		} ]
	},
	"oryx-assignment-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : false,
		"dataUrl" : "/reference/tree/user",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true,
			width : 180
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		} ]
	},
	"oryx-user-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/tree/user",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		}, {
			id : 'all_path_name',
			i18n : 'REFERENCE.BASE.ALL_PATH_NAME',
			resultField : true,
			width : 200
		} ]
	},
	// 操作记账
	"oryx-otmrti-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/grid/reference-otmrti-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/grid/reference-otmrti-write-template.html",
		"isReference" : true,
		"referenceType" : "grid",
		"multiSelect" : true,
		"dataUrl" : "/reference/grid",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		}, {
			id : 'type',
			i18n : 'REFERENCE.BASE.TYPE'
		} ]
	},
	"oryx-role-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/roletree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/roletree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/role_view/tree",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true,
			width : 180
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		} ]
	},
	"oryx-usergroups-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/treegrid/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/treegrid/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "treegrid",
		"multiSelect" : true,
		"treeMultiSelect" : false,
		"dataUrl" : "/reference/usergroup_view/grid",
		"treeDataUrl" : "/reference/usergroup_view/tree",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true,
			width : 180
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		} ]
	},
	"oryx-org-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/org_view/tree",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		}, {
			id : 'all_path_name',
			i18n : 'REFERENCE.BASE.ALL_PATH_NAME',
			resultField : true,
			width : 200
		} ]
	},
	"oryx-candidatestarterusers-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/tree/user",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		}, {
			id : 'all_path_name',
			i18n : 'REFERENCE.BASE.ALL_PATH_NAME',
			resultField : true,
			width : 200
		} ]
	},
	"oryx-candidateusers-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/tree/module",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		}, {
			id : 'all_path_name',
			i18n : 'REFERENCE.BASE.ALL_PATH_NAME',
			resultField : true,
			width : 200
		} ]
	},
	"oryx-timerdatedefinition-string" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/datetime-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/datetime-property-write-mode-template.html"
	},
	"oryx-duedatedefinition-string" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/datetime-value-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/datetime-property-write-mode-template.html"
	},
	"kisbpm-multiinstanceperson" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstanceperson-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstanceperson-property-write-template.html"
	},
	"kisbpm-multiinstancepersonal" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstancepersonal-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstancepersonal-property-write-template.html"
	},
	"kisbpm-multiinstancehandletype" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstancehandletype-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstancehandletype-property-write-template.html"
	},
	"kisbpm-multiinstanceouttertrantablename" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstanceouttertrantablename-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstanceouttertrantablename-property-write-template.html"
	},
	"kisbpm-multiinstancemaintablename" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/multiinstancemaintablename-property-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/multiinstancemaintablename-property-write-template.html"
	},
	// 菜单
	"oryx-functionauth-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/tree/module",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		} ]
	},
	// 角色
	"oryx-roleauth-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/tree/role",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		}]
	},
	// 节点挂规则
	"oryx-preferra-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/tree/rule",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		} ]
	},
	// 规则定义
	"oryx-rulesequenceflow-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/tree/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "tree",
		"multiSelect" : true,
		"dataUrl" : "/reference/tree/rule",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			visible : false
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 100
		} ]
	},
	"oryx-callactivitycalledelement-complex" : {
		"readModeTemplateUrl" : "editor-app/configuration/properties/reference/grid/reference-display-template.html",
		"writeModeTemplateUrl" : "editor-app/configuration/properties/reference/grid/reference-write-template.html",
		"isReference" : true,
		"referenceType" : "grid",
		"multiSelect" : false,
		"dataUrl" : "/reference/procdef",
		"fields" : [ {
			id : 'pk',
			i18n : 'REFERENCE.BASE.PK',
			pkField : true,
			visible : false
		}, {
			id : 'code',
			i18n : 'REFERENCE.BASE.ID',
			resultField : true
		}, {
			id : 'version',
			i18n : 'REFERENCE.MODEL.VERSION',
			width : 180
		}, {
			id : 'name',
			i18n : 'REFERENCE.BASE.NAME',
			returnField : true,
			resultField : true,
			width : 180
		} ]
	}
};
