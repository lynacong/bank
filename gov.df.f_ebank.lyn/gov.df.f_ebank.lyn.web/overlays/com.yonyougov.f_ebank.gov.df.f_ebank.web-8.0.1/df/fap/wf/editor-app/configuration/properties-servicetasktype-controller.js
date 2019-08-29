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
 * Execution listeners
 */

var KisBpmServiceTaskTypeCtrl = [ '$scope', function($scope) {
	
	$scope.items = [
	    {value:"class", text:"java类"},           
		{value:"expression", text:"表达式"},
		{value:"delegateexpression", text:"委托表达式"},
		{value:"WebService", text:"WebService"}];
        
    $scope.serviceTaskTypeChanged = function() {
    	switch($scope.property.value){
			case "class":
				$scope.property.value = "java类";
				break;
			case "expression":
				$scope.property.value = "表达式";
				break;
			case "delegateexpression":
				$scope.property.value = "委托表达式";
				break;
			case "WebService":
				$scope.property.value = "WebService";
				break;
		}
    	$scope.updatePropertyInModel($scope.property);
		var facade=$scope.editor.selection[0].facade;
		var current=$scope.editor.selection[0];
		facade.setSelection($scope.editor.selection[0].parent);
		facade.setSelection(current);
    };
}];