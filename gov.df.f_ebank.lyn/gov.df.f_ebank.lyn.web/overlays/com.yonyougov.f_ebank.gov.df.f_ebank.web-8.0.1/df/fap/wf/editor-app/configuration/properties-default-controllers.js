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

/*
 * String controller
 */

var KisBpmStringPropertyCtrl = [ '$scope', '$element', function ($scope, $element) {

	$scope.shapeId = $scope.selectedShape.id;
	$scope.valueFlushed = false;
    /** Handler called when input field is blurred */
    $scope.inputBlurred = function() {
    	$scope.valueFlushed = true;
    	if ($scope.property.value) {
    		$scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig,"");
    		if($scope.property.key=="oryx-process_id"||$scope.property.key=="oryx-overrideid"
    			||$scope.property.key==	"oryx-name")
    		{
	    		var pattern = new RegExp("[\"`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
	    		var rs = "";
	    		for (var i = 0; i < $scope.property.value.length; i++) {
	    			rs = rs+$scope.property.value.substr(i, 1).replace(pattern, ''); 
	    		}
	    		$scope.property.value=rs;
    		}
    	}
    	var supportPlaceholder = 'placeholder' in document.createElement('input');
	    if (!supportPlaceholder) {
	    	var inputName=$scope.property.key.substring(5)+"Input";
	    	if(document.getElementById(inputName)!=null){
		    	var defaultValue = document.getElementById(inputName).getAttribute('placeholder');
		    	if ($scope.property.value == defaultValue) {
		    		document.getElementById(inputName).value ='';
		    		document.getElementById(inputName).style.color = '';
		        } else if ($scope.property.value == ''||$scope.property.value.length==0) {
		        	document.getElementById(inputName).value = defaultValue;
		            document.getElementById(inputName).style.color = '#ACA899';
		        }
		    }
	    }

        $scope.updatePropertyInModel($scope.property);
    };
    $scope.onfocus = function() {
    	var supportPlaceholder = 'placeholder' in document.createElement('input');
		    if (!supportPlaceholder) {
	    		var inputName=$scope.property.key.substring(5)+"Input";
	    		if(inputName=="duedateparamdefinitionInput")
	    			inputName="timerdateparamdefinitionInput";
		    	if(document.getElementById(inputName)!=null){
			    	var defaultValue = document.getElementById(inputName).getAttribute('placeholder');
			    	if ($scope.property.value == ''||$scope.property.value.length==0) {
			    		document.getElementById(inputName).value = defaultValue;
			        	document.getElementById(inputName).style.color = '#ACA899';
			        }else{
			    		document.getElementById(inputName).style.color = '';
			        }
		    }
    	}
    };


   $scope.enterPressed = function($event) {
        $event.preventDefault();
        $scope.inputBlurred(); // we want to do the same as if the user would blur the input field
    };
    
    $scope.$on('$destroy', function controllerDestroyed() {
    	if(!$scope.valueFlushed) {
    		if ($scope.property.value) {
        		$scope.property.value = $scope.property.value.replace(/(<([^>]+)>)/ig,"");
        	}
    		$scope.updatePropertyInModel($scope.property, $scope.shapeId);
    	}
    });
    
    if($element.children() && $element.children().length > 0){
    	var element = $element.children()[0];
    	if(element.tagName && element.tagName.toLowerCase() == "input"){
    		element.focus();
    	}
    }
    
}];

/*
 * Boolean controller
 */

var KisBpmBooleanPropertyCtrl = ['$scope', function ($scope) {

    $scope.changeValue = function() {
        if ($scope.property.key === 'oryx-defaultflow' && $scope.property.value) {
            var selectedShape = $scope.selectedShape;
            if (selectedShape) {
                var incomingNodes = selectedShape.getIncomingShapes();
                if (incomingNodes && incomingNodes.length > 0) {
                    // get first node, since there can be only one for a sequence flow
                    var rootNode = incomingNodes[0];
                    var flows = rootNode.getOutgoingShapes();
                    if (flows && flows.length > 1) {
                        // in case there are more flows, check if another flow is already defined as default
                        for (var i = 0; i < flows.length; i++) {
                            if (flows[i].resourceId != selectedShape.resourceId) {
                                var defaultFlowProp = flows[i].properties['oryx-defaultflow'];
                                if (defaultFlowProp) {
                                    flows[i].setProperty('oryx-defaultflow', false, true);
                                }
                            }
                        }
                    }
                }
            }
        }
    	$scope.updatePropertyInModel($scope.property);
        if ($scope.property.key === 'oryx-defaultflow')
        {
			var facade=$scope.editor._canvas.facade;
			var current=$scope.editor.selection[0];
			if(facade!=undefined)
			{
				facade.setSelection($scope.editor.selection[0].parent);
				facade.setSelection(current);
			}
        }
    };

}];

/*
 * Text controller
 */

var KisBpmTextPropertyCtrl = [ '$scope', '$modal', function($scope, $modal) {

    var opts = {
        template:  'editor-app/configuration/properties/text-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];

var KisBpmMailUserPropertyCtrl = [ '$scope', '$modal', function($scope, $modal) {

    var opts = {
        template:  'editor-app/configuration/properties/text-mail-popup.html?version=' + Date.now(),
        scope: $scope
    };
    // Open the dialog
    $modal(opts);
}];


//入口条件
var KisBpmTextExpPropertyCtrl = [ '$scope', '$modal', function($scope, $modal) {

    var opts = {
        template:  'editor-app/configuration/properties/text-exp-popup.html?version=' + Date.now(),
        scope: $scope
    };
    // Open the dialog
    $modal(opts);
}];


var KisBpmTextExpDataPropertyPopupCtrl = ['$scope', '$element', '$timeout','$rootScope', function($scope, $element, $timeout,$rootScope) {
	
	 $scope.save = function() {
	        $scope.updatePropertyInModel($scope.property);
	        $scope.close();
	    };

	    $scope.close = function() {
	    	 $scope.property.mode = 'read';
	         $scope.$hide();
	    };
	
	
	
}];


var KisBpmTextPropertyPopupCtrl = ['$scope', '$element', '$timeout','$rootScope', function($scope, $element, $timeout,$rootScope) {
    
    $scope.save = function() {
    	if($rootScope.mainTableCN==null && $scope.property.title=="ID字段"){
    		$scope.property.value=null;
    	}
    	
    	if($rootScope.outterTableCN==null && $scope.property.title=="外部事务提醒主表ID"){
    		$scope.property.value=null;
    	}
    	
    	if($rootScope.innerTableCN==null && $scope.property.title=="内部事务提醒主表ID"){
    		$scope.property.value=null;
    	}
        $scope.updatePropertyInModel($scope.property);
        //$rootScope.mainTableCN=null;
        //$rootScope.isSelect=null;
        $scope.close();
    };

    $scope.close = function() {
       /* $scope.property.mode = 'read';
        $scope.property.value=null;
        $rootScope.mainTableCN==null;
        $rootScope.isSelect=null;
        $scope.$hide();*/
    	 $scope.property.mode = 'read';
         $scope.$hide();
    };
    
   /* if($rootScope.mainTableCN != null){
    	$scope.property.value=$rootScope.mainTableCN;
    	$scope.updatePropertyInModel($scope.property);
    }*/
    
    
    $timeout(function(){
    	var textareas = $element.find("textarea");
    	if(textareas && textareas.length > 0){
    		var textarea = textareas[0];
    		var supportPlaceholder = 'placeholder' in document.createElement('input');
    		
    		if($scope.property.title=="ID字段" || $scope.property.title=="内部事务提醒主表ID" || $scope.property.title=="外部事务提醒主表ID"){
    			//begin_
        		if($rootScope.mainTableCN != null && $scope.property.title=="ID字段"){
        	    	$scope.property.value=$rootScope.mainTableCN;
        	    	textarea.value=$scope.property.value;
        	    	//$scope.updatePropertyInModel($scope.property);
        	    	//$rootScope.mainTableCN=null;
        	    }else if($rootScope.outterTableCN !=null && $scope.property.title=="外部事务提醒主表ID"){
        	    	$scope.property.value=$rootScope.outterTableCN;
        	    	textarea.value=$scope.property.value;
        	    }else if($rootScope.innerTableCN != null && $scope.property.title=="内部事务提醒主表ID"){
        	    	$scope.property.value=$rootScope.innerTableCN;
        	    	textarea.value=$scope.property.value;
        	    }else{
        	    	
        	    	if(supportPlaceholder)
            			textarea.focus();
            		else{
                		textarea.onfocus = function(){
        	  		    	if(textarea!=null){
        	  			    	var defaultValue = textarea.getAttribute('placeholder');
        	  			    	if(defaultValue!=null){
        		  			    	if ($scope.property.value == ''||$scope.property.value.length==0) {
        		  			    		textarea.value = defaultValue;
        		  			    		textarea.style.color = '#ACA899';
        		  			        }else{
        		  			        	textarea.style.color = '';
        		  			        }
        	  			    	}
        	  		    	}
                		};
        		    	textarea.inputBlurred = function() {
            		    	if(textarea!=null){
            			    	var defaultValue = textarea.getAttribute('placeholder');
            			    	if(defaultValue!=null){
        	    			    	if ($scope.property.value == defaultValue) {
        	    			    		textarea.value ='';
        	    			    		textarea.style.color = '';
        	    			        } else if ($scope.property.value == ''||$scope.property.value.length==0) {
        	    			        	textarea.value = defaultValue;
        	    			        	textarea.style.color = '#ACA899';
        	    			        }
            			    	}
            			    }

        		    	};
            		}
        	    	if($rootScope.mainTableCN==null || $rootScope.outterTableCN==null || $rootScope.innerTableCN==null){
        	    		if($rootScope.isSelect==null){
        	    			if(textarea.value && textarea.value.length > 0 && textarea.setSelectionRange){
                    			var len = textarea.value.length;
                    			textarea.setSelectionRange(len, len);
                    		}	
        	    		}else{
        	    			textarea.value=null;
        	    		}
        	    	}
        	    	
        	    }
    			
    			
    		}
    	else{
    			
    			if(supportPlaceholder)
        			textarea.focus();
        		else{
            		textarea.onfocus = function(){
    	  		    	if(textarea!=null){
    	  			    	var defaultValue = textarea.getAttribute('placeholder');
    	  			    	if(defaultValue!=null){
    		  			    	if ($scope.property.value == ''||$scope.property.value.length==0) {
    		  			    		textarea.value = defaultValue;
    		  			    		textarea.style.color = '#ACA899';
    		  			        }else{
    		  			        	textarea.style.color = '';
    		  			        }
    	  			    	}
    	  		    	}
            		};
    		    	textarea.inputBlurred = function() {
        		    	if(textarea!=null){
        			    	var defaultValue = textarea.getAttribute('placeholder');
        			    	if(defaultValue!=null){
    	    			    	if ($scope.property.value == defaultValue) {
    	    			    		textarea.value ='';
    	    			    		textarea.style.color = '';
    	    			        } else if ($scope.property.value == ''||$scope.property.value.length==0) {
    	    			        	textarea.value = defaultValue;
    	    			        	textarea.style.color = '#ACA899';
    	    			        }
        			    	}
        			    }

    		    	};
        		}
        		if(textarea.value && textarea.value.length > 0 && textarea.setSelectionRange){
        			var len = textarea.value.length;
        			textarea.setSelectionRange(len, len);
        		}
    			
    		}
    	}
    }, 500);
    
}];

/*
 * Datetime controller
 */
var KisBpmDateTimePropertyCtrl = [ '$scope', '$element', function ($scope, $element) {

	$scope.shapeId = $scope.selectedShape.id;
	$scope.valueFlushed = false;
	$scope.property.datetime = $scope.property.value;
    /** Handler called when input value is changed */
    $scope.valueChanged = function() {
    	$scope.valueFlushed = true;
    	if (typeof($scope.property.datetime) == "object") {
    		var d = $scope.property.datetime;
    		var date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset(), d.getSeconds());
    		$scope.property.value = date.toISOString().replace(".000Z","");;
    	}
    	$scope.updatePropertyInModel($scope.property);
        $scope.property.mode = 'write';
    };

    $scope.enterPressed = function($event) {
        $event.preventDefault();
        $scope.valueChanged(); // we want to do the same as if the input field value changed
    };
    
    $scope.$on('$destroy', function controllerDestroyed() {
    	if(!$scope.valueFlushed) {
    		if (typeof($scope.property.datetime) == "object") {
    			var d = $scope.property.datetime;
    			var date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset(), d.getSeconds());
        		$scope.property.value = date.toISOString().replace(".000Z","");
        	}
    		$scope.updatePropertyInModel($scope.property, $scope.shapeId);
    	}
    });
    
    $scope.closed = function() {
        $scope.property.mode = 'read';
    };
    
}];
/*
 * Datetime controller
 */
var KisBpmDueDatePropertyCtrl = [ '$scope', '$element', function ($scope, $element) {

	$scope.shapeId = $scope.selectedShape.id;
	$scope.valueFlushed = false;
	$scope.property.datetime = $scope.property.value;
    /** Handler called when input value is changed */
    $scope.valueChanged = function() {
    	$scope.valueFlushed = true;
    	if (typeof($scope.property.datetime) == "object") {
    		var d = $scope.property.datetime;
    		var date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset(), d.getSeconds());
    		$scope.property.value = date.toISOString().replace(".000Z","");;
    	}
    	$scope.updatePropertyInModel($scope.property);
        $scope.property.mode = 'write';
    };

    $scope.enterPressed = function($event) {
        $event.preventDefault();
        $scope.valueChanged(); // we want to do the same as if the input field value changed
    };
    
    $scope.$on('$destroy', function controllerDestroyed() {
    	if(!$scope.valueFlushed) {
    		if (typeof($scope.property.datetime) == "object") {
    			var d = $scope.property.datetime;
    			var date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes() - d.getTimezoneOffset(), d.getSeconds());
        		$scope.property.value = date.toISOString().replace(".000Z","");
        	}
    		$scope.updatePropertyInModel($scope.property, $scope.shapeId);
    	}
    });
    
    $scope.closed = function() {
        $scope.property.mode = 'read';
    };
    
}];
