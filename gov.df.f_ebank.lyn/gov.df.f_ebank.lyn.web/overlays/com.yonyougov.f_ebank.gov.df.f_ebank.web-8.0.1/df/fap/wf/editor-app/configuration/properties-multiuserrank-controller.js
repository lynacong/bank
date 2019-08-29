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

var KisBpmMultiUserRankCtrl = [ '$scope', function($scope) {
	
	$scope.items = [
	    {value:"", text:""},           
		{value:"1", text:ORYX.I18N.MultiInstance.UserRank01},
		{value:"2", text:ORYX.I18N.MultiInstance.UserRank02},
		{value:"3", text:ORYX.I18N.MultiInstance.UserRank03},
		{value:"4", text:ORYX.I18N.MultiInstance.UserRank04},
		{value:"5", text:ORYX.I18N.MultiInstance.UserRank05},
		{value:"6", text:ORYX.I18N.MultiInstance.UserRank06},
		{value:"7", text:ORYX.I18N.MultiInstance.UserRank07},
		{value:"8", text:ORYX.I18N.MultiInstance.UserRank08},
		{value:"9", text:ORYX.I18N.MultiInstance.UserRank09},
		{value:"10", text:ORYX.I18N.MultiInstance.UserRank10}];
        
    $scope.multiInstanceModelChanged = function() {
    	switch($scope.property.value){
			case "":
				$scope.property.showtext = ORYX.I18N.MultiInstance.None;
				break;
			case "1":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank01;
				break;
			case "2":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank02;
				break;
			case "3":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank03;
				break;
			case "4":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank04;
				break;
			case "5":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank05;
				break;
			case "6":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank06;
				break;
			case "7":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank07;
				break;
			case "8":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank08;
				break;
			case "9":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank09;
				break;
			case "10":
				$scope.property.showtext = ORYX.I18N.MultiInstance.UserRank10;
				break;
		}
    	$scope.updatePropertyInModel($scope.property);
    };
}];