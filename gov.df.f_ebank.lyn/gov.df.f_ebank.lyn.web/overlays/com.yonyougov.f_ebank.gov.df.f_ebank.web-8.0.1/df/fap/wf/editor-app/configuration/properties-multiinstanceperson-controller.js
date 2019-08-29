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

var KisBpmMultiInstancePersonCtrl = [ '$scope', function($scope) {
	
	$scope.items = [          
		{value:"tongbu", text:"同步"},
		{value:"yibu", text:"异步"}];
        
    $scope.multiInstanceModelChanged = function() {
       	switch($scope.property.value){
			case "None":
				$scope.property.showtext = "";
				break;
			case "tongbu":
				$scope.property.showtext = "同步";
				break;
			case "yibu":
				$scope.property.showtext = "异步";
				break;
		}
    	$scope.updatePropertyInModel($scope.property);
		/*var facade=$scope.editor.selection[0].facade;  //2017_04_14
		var current=$scope.editor.selection[0];
		facade.setSelection($scope.editor.selection[0].parent);
		facade.setSelection(current);*/
    }
}];
