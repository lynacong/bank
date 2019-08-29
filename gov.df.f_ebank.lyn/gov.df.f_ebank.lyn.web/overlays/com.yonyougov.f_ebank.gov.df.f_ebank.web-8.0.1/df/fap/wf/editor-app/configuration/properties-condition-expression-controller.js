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
 * Condition expression
 */

var KisBpmConditionExpressionCtrl = [ '$scope', '$modal','$compile', function($scope, $modal,$compile) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/condition-expression-popup.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
    
   
}];

var KisBpmConditionExpressionPopupCtrl = [ '$rootScope','$scope', '$translate', '$http','$compile','$modal', function($rootScope,$scope, $translate, $http,$compile,$modal) {
	
	
	$scope.isShow1=true;
	$scope.isShow3=true;
	$scope.datas=[];
    $scope.tableExpVal=[];
    if ($scope.property.value !== "" && $scope.property.value !== null) {
     
			    	if("#"==$scope.property.value){
			    		$scope.conditionExpressionDesc="";
			    		$scope.conditionExpressionScript="";
			    	}else{
			    		
			    		var settingArr=($scope.property.value).split("*");
			    		
			        	$scope.conditionExpressionDesc=settingArr[0];
			        	$scope.conditionExpressionScript=settingArr[1];
			            $scope.settingInfoArray=settingArr[2];
			            var settingInfoArrayJson= angular.fromJson($scope.settingInfoArray.substring(1,$scope.settingInfoArray.length-1));
			            
			            for(var k=0;k<settingInfoArrayJson.length;k++){
			            	var left_pare=settingInfoArrayJson[k].left_pare;
			            	var left_paraname_noFlag=settingInfoArrayJson[k].left_paraname_noFlag;
			            	var leftFlagLR=left_paraname_noFlag.split(" ");
			            	var left_paraname="["+leftFlagLR[0]+"]"+settingInfoArrayJson[k].left_paraname+"["+leftFlagLR[1]+"]";
			            	var logic_operator = settingInfoArrayJson[k].logic_operator;
			            	var operator=settingInfoArrayJson[k].operator;
			            	var operator_store=operator;
			            	if("like"==operator){
			            		operator="包含";
			            	}else if("LLike"==operator){
			            		operator="左包含";
			            	}else if("RLike"==operator){
			            		operator="右包含";
			            	}else if("NLike"==operator){//20170811引入NLike
			            		operator="不包含";
			            	}else if("NLLike"==operator){//20170811引入NLLike
			            		operator="不左包含";
			            	}else if("NRLike"==operator){//20170811引入NRLike
			            		operator="不右包含";
			            	}
			            	
			            	var right_paraname=settingInfoArrayJson[k].right_paraname
			            	var right_paraname_noFlag= settingInfoArrayJson[k].right_paraname_noFlag;
			            	right_paraname="["+right_paraname_noFlag+"]"+right_paraname;
			            	var right_pare=settingInfoArrayJson[k].right_pare;
			            	
			            	var left_paraid=settingInfoArrayJson[k].left_paraid;
			            	var left_paravaluetype=settingInfoArrayJson[k].left_paravaluetype;
			            	var right_paraid=settingInfoArrayJson[k].right_paraid;
			            	var right_paravaluetype=settingInfoArrayJson[k].right_paravaluetype;
			            	var line_id=settingInfoArrayJson[k].line_id;
			            	var ele_source_info=settingInfoArrayJson[k].ele_source_info;
			            	$scope.datas.push({sortData:k,left_pare:left_pare,left_paraname:left_paraname,operator:operator,right_paraname:right_paraname,right_pare:right_pare,logic_operator:logic_operator,ele_source_info:ele_source_info});
			            	//将配置信息放进配置数组中
			    	        	$scope.tableExpVal.push({left_pare:left_pare,logic_operator:logic_operator,left_paraid:left_paraid,left_paravaluetype:left_paravaluetype,left_paraname:settingInfoArrayJson[k].left_paraname,operator:operator_store,left_paraname_noFlag:left_paraname_noFlag,
			    	            right_paraid:right_paraid,right_paravaluetype:right_paravaluetype,right_pare:right_pare,right_paraname:settingInfoArrayJson[k].right_paraname,right_paraname_noFlag:right_paraname_noFlag,line_id:line_id,ele_source_info:ele_source_info});
			            }
			    	}
    	
    	}else{
		    	$scope.conditionExpressionScript="";
		    	$scope.conditionExpressionDesc="";
      }
    
  //begin_条件表达式规则
    $scope.countNumOfSel=0;
    $scope.leftFlag = ["","(","((","((("];//左括号
    $scope.rightFlag = ["",")","))",")))"];//右括号
    $scope.logicFlag = ["","AND","OR"];//逻辑运算符
    $scope.relFlag = ["",">","<",">=","<=","=","!=","包含","左包含","右包含","不包含","不左包含","不右包含"];//关系运算符
    
    /*$scope.leftFlagHtml="<select id=selectLeftFlag"+$scope.countNumOfSel+" ng-init='selectedNameLeftFlag'"+$scope.countNumOfSel+"' = leftFlag[0]'"+
					   "ng-model='selectedNameLeftFlag'"+$scope.countNumOfSel+" ng-options='x for x in leftFlag' ng-change=leftflagChanged("+$scope.countNumOfSel+",selectedNameLeftFlag) style='text-align: center;width: 100%;'>"+
					 "</select>";*/
    
    $scope.leftFlagHtml="<select id=selectLeftFlag"+$scope.countNumOfSel+" ng-init='selectedNameLeftFlag"+$scope.countNumOfSel+"=leftFlag[0]' " +
    		"ng-model=selectedNameLeftFlag"+$scope.countNumOfSel+" ng-options='x for x in leftFlag' ng-change=leftflagChanged("+$scope.countNumOfSel+",selectedNameLeftFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
	 "</select>";
    
    
    $scope.rightFlagHtml="<select id=selectRightFlag"+$scope.countNumOfSel+" ng-init='selectedNameRightFlag"+$scope.countNumOfSel+" = rightFlag[0]' "+
						"ng-model=selectedNameRightFlag"+$scope.countNumOfSel+" ng-options='x for x in rightFlag' ng-change=rightflagChanged("+$scope.countNumOfSel+",selectedNameRightFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
					  "</select>";
    $scope.logicFlagHtml="<select id=selectLogicFlag"+$scope.countNumOfSel+" ng-init='selectedNameLogicFlag"+$scope.countNumOfSel+" = logicFlag[0]'"+
						"ng-model=selectedNameLogicFlag"+$scope.countNumOfSel+" ng-options='x for x in logicFlag' ng-change=logicflagChanged("+$scope.countNumOfSel+",selectedNameLogicFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
					 "</select>";
    $scope.relFlagHtml="<select id=selectRelFlag"+$scope.countNumOfSel+" ng-init='selectedNameRelFlag"+$scope.countNumOfSel+" = relFlag[0]'"+
						"ng-model=selectedNameRelFlag"+$scope.countNumOfSel+" ng-options='x for x in relFlag' ng-change=relflagChanged("+$scope.countNumOfSel+",selectedNameRelFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
					"</select>";
    
   /* if(angular.element("#"+"leftFlag"+(idVal)).html()=="" || angular.element("#"+"leftFlag"+(idVal)).html() == null){
		angular.element("#"+"leftFlag"+(idVal)).append($scope.leftFlagHtml);
	}*/
    
    //左括号
    $scope.leftflagClick=function(idVal){
    	
    	$scope.selTemp=$scope.datas[idVal].left_pare;
    	$scope.datas[idVal].left_pare="";
    	
    	    
    	    var selContext=document.getElementById("selectLeftFlag"+(idVal));
    	    if(selContext=="" || selContext==undefined || selContext==null){
    	    	
    	    	//清空表格内容
    	    	  angular.element(document.getElementById("leftFlag"+idVal)).text("");
    	    	
    	    	 $scope.leftFlagHtml="<select id=selectLeftFlag"+idVal+" ng-init='selectedNameLeftFlag"+idVal+"=leftFlag[0]' " +
    	    		"ng-model=selectedNameLeftFlag"+idVal+" ng-options='x for x in leftFlag' ng-change=leftflagChanged("+idVal+",selectedNameLeftFlag"+idVal+") style='text-align: center;width: 100%;'>"+
    		 "</select>";
    	    	angular.element("#"+"selectLeftFlag"+(idVal)).remove();
    	    	var templateLeftFlagHtml = angular.element($scope.leftFlagHtml);
            	var leftFlagElement = $compile(templateLeftFlagHtml)($scope);
            	angular.element("#"+"leftFlag"+(idVal)).append(leftFlagElement[0]);
            	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
        		if(!($scope.tableExpVal instanceof Array)){
        			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
        		}
            	
            	//测试_点击后默认选中空项_2017_05_15
          	      $scope.tableExpVal[idVal].left_pare="";
    	    }
    }
    
    //运算符
    $scope.relFlagClick=function(idVal){
    	
    	$scope.selTemp=$scope.datas[idVal].operator;
    	$scope.datas[idVal].operator="";
    	
    	    
    	    var selContext=document.getElementById("selectRelFlag"+(idVal));
    	    if(selContext=="" || selContext==undefined || selContext==null){
    	    	
    	    	//清除表格内容
    	    	angular.element(document.getElementById("relFlag"+idVal)).text("");
    	    	
    	    	$scope.relFlagHtml="<select id=selectRelFlag"+idVal+" ng-init='selectedNameRelFlag"+idVal+" = relFlag[0]'"+
				"ng-model=selectedNameRelFlag"+idVal+" ng-options='x for x in relFlag' ng-change=relflagChanged("+idVal+",selectedNameRelFlag"+idVal+") style='text-align: center;width: 100%;'>"+
			"</select>";
    	    	
    	    	angular.element("#"+"selectRelFlag"+(idVal)).remove();
    	    	/*$scope.leftFlagHtml="<select id=selectLeftFlag"+idVal+" ng-init='selectedNameLeftFlag"+idVal+"=leftFlag[0]' " +
        		"ng-model=selectedNameLeftFlag"+idVal+" ng-options='x for x in leftFlag' ng-change=leftflagChanged("+idVal+",selectedNameLeftFlag"+idVal+") style='text-align: center;width: 100%;'>"+
    	 "</select>";*/
    	    	var templateRelFlagHtml = angular.element($scope.relFlagHtml);
            	var relFlagElement = $compile(templateRelFlagHtml)($scope);
            	angular.element("#"+"relFlag"+(idVal)).append(relFlagElement[0]);
            	
            	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
        		if(!($scope.tableExpVal instanceof Array)){
        			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
        		}
            	
            	//测试_点击后默认选中空项_2017_05_15
           	      $scope.tableExpVal[idVal].operator="";
    	    }
    }
    
    //右括号
    $scope.rightFlagClick=function(idVal){
    	
    	$scope.selTemp=$scope.datas[idVal].right_pare;
    	$scope.datas[idVal].right_pare="";
    	
    	    
    	    var selContext=document.getElementById("selectRightFlag"+(idVal));
    	    if(selContext=="" || selContext==undefined || selContext==null){
    	    	//清除表格内容
    	    	angular.element(document.getElementById("rightFlag"+idVal)).text("");
    	    	
    	    	$scope.rightFlagHtml="<select id=selectRightFlag"+idVal+" ng-init='selectedNameRightFlag"+idVal+" = rightFlag[0]' "+
				"ng-model=selectedNameRightFlag"+idVal+" ng-options='x for x in rightFlag' ng-change=rightflagChanged("+idVal+",selectedNameRightFlag"+idVal+") style='text-align: center;width: 100%;'>"+
			  "</select>";
    	    	angular.element("#"+"selectRightFlag"+(idVal)).remove();
    	    	var templateRightFlagHtml = angular.element($scope.rightFlagHtml);
            	var rightFlagElement = $compile(templateRightFlagHtml)($scope);
            	angular.element("#"+"rightFlag"+(idVal)).append(rightFlagElement[0]);
            	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
        		if(!($scope.tableExpVal instanceof Array)){
        			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
        		}
            	
            	//测试_点击后默认选中空项_2017_05_17
          	     $scope.tableExpVal[idVal].right_pare="";
    	    }
    }
    
    
    //逻辑运算符
	    $scope.logicFlagClick=function(idVal){
	    	
	    	$scope.selTemp=$scope.datas[idVal].logic_operator;
	    	$scope.datas[idVal].logic_operator="";
	    	
	    	    
	    	    var selContext=document.getElementById("selectLogicFlag"+(idVal));
	    	    if(selContext=="" || selContext==undefined || selContext==null){
	    	    	
	    	    	//清除表格内容
	    	    	angular.element(document.getElementById("logicFlag"+idVal)).text("");
	    	    	
	    	    	$scope.logicFlagHtml="<select id=selectLogicFlag"+idVal+" ng-init='selectedNameLogicFlag"+idVal+" = logicFlag[0]'"+
					"ng-model=selectedNameLogicFlag"+idVal+" ng-options='x for x in logicFlag' ng-change=logicflagChanged("+idVal+",selectedNameLogicFlag"+idVal+") style='text-align: center;width: 100%;'>"+
				 "</select>";
	    	    	angular.element("#"+"selectLogicFlag"+(idVal)).remove();
	    	    	var templateLogicFlagHtml = angular.element($scope.logicFlagHtml);
	            	var logicFlagElement = $compile(templateLogicFlagHtml)($scope);
	            	angular.element("#"+"logicFlag"+(idVal)).append(logicFlagElement[0]);
	            	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
	        		if(!($scope.tableExpVal instanceof Array)){
	        			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
	        		}
	            	
	            	//测试_点击后默认选中空项_2017_05_15
	  	    	      $scope.tableExpVal[idVal].logic_operator="";
	    	    }
	    }
    
    
    
    
    
   
    $scope.add =function(){  
    	//$scope.datas.push({name1:"",name2:"",name3:"",name4:"",name5:"",name6:"",name7:""});
	    $scope.datas.push({sortData:"",left_pare:"",left_paraname:"",operator:"",right_paraname:"",right_pare:"",logic_operator:"",ele_source_info:""});
	  //在同一个页面操作可能会城市间共享一个scope,屏蔽错误
		if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
		//begin_2017-5-17 回显表格树的显示问题_增加内容
    	$scope.tableExpVal.push({left_pare:"",logic_operator:"",left_paraid:"",left_paravaluetype:"",left_paraname:"",operator:"",left_paraname_noFlag:"",
        	right_paraid:"",right_paravaluetype:"",right_pare:"",right_paraname:"",right_paraname_noFlag:"",line_id:"",ele_source_info:""});
    	//end_2017-5-17 回显表格树的显示问题_增加内容
    	//$scope.countNum++;
    	$scope.countNumOfSel=$scope.countNumOfSel+1;
    	/* $scope.leftFlagHtml="<select id=selectLeftFlag"+$scope.countNumOfSel+" ng-init='selectedNameLeftFlag = leftFlag[0]'"+
		   "ng-model='selectedNameLeftFlag' ng-options='x for x in leftFlag' ng-change=leftflagChanged("+$scope.countNumOfSel+",selectedNameLeftFlag) style='text-align: center;width: 100%;'>"+
		 "</select>";*/
    	/*$scope.leftFlagHtml="<select id=selectLeftFlag"+$scope.countNumOfSel+" ng-init='selectedNameLeftFlag"+$scope.countNumOfSel+"="+$scope.leftFlag[1]+
        "' ng-model=selectedNameLeftFlag"+$scope.countNumOfSel+" ng-options='x for x in leftFlag' ng-change=leftflagChanged("+$scope.countNumOfSel+",selectedNameLeftFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
    	 "</select>";*/
    	 $scope.leftFlagHtml="<select id=selectLeftFlag"+$scope.countNumOfSel+" ng-init='selectedNameLeftFlag"+$scope.countNumOfSel+"=leftFlag[0]' " +
 		"ng-model=selectedNameLeftFlag"+$scope.countNumOfSel+" ng-options='x for x in leftFlag' ng-change=leftflagChanged("+$scope.countNumOfSel+",selectedNameLeftFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
	 "</select>";
    	 
    	 $scope.rightFlagHtml="<select id=selectRightFlag"+$scope.countNumOfSel+" ng-init='selectedNameRightFlag"+$scope.countNumOfSel+" = rightFlag[0]' "+
			"ng-model=selectedNameRightFlag"+$scope.countNumOfSel+" ng-options='x for x in rightFlag' ng-change=rightflagChanged("+$scope.countNumOfSel+",selectedNameRightFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
		  "</select>";
    	 
    	 $scope.logicFlagHtml="<select id=selectLogicFlag"+$scope.countNumOfSel+" ng-init='selectedNameLogicFlag"+$scope.countNumOfSel+" = logicFlag[0]'"+
			"ng-model=selectedNameLogicFlag"+$scope.countNumOfSel+" ng-options='x for x in logicFlag' ng-change=logicflagChanged("+$scope.countNumOfSel+",selectedNameLogicFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
		 "</select>";
    	 
    	 $scope.relFlagHtml="<select id=selectRelFlag"+$scope.countNumOfSel+" ng-init='selectedNameRelFlag"+$scope.countNumOfSel+" = relFlag[0]'"+
			"ng-model=selectedNameRelFlag"+$scope.countNumOfSel+" ng-options='x for x in relFlag' ng-change=relflagChanged("+$scope.countNumOfSel+",selectedNameRelFlag"+$scope.countNumOfSel+") style='text-align: center;width: 100%;'>"+
		"</select>";
    	
    }  
  
    $scope.del =function(){  
    	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
    	if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
    	$scope.datas.splice($scope.focus,1);
    	$scope.tableExpVal.splice($scope.focus,1);
    	//$scope.countNum--;
    	if($scope.countNumOfSel>0){
    		$scope.countNumOfSel=$scope.countNumOfSel-1;
    	}
    	
    }  
    
    $scope.datasFocuschange=function(i){
        $scope.focus = i;
}
    
    
    /*$scope.tableExpVal=[{left_pare:"",logic_operator:"",left_paraid:"",left_paravaluetype:"",left_paraname:"",operator:"",
    	right_paraid:"",right_paravaluetype:"",right_pare:"",right_paraname:"",line_id:""}];*/
    
    
    
    
    //主界面的下拉配置存储
    $scope.leftflagChanged =function(indexVal,selVal){
    	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
		if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
    	
    	$scope.tableExpVal[indexVal].left_pare=selVal;
    	
    	//begin_选完下拉信息后，删掉下拉，显示表格
    	  var paramNameData = angular.element(document.getElementById("leftFlag"+indexVal)).text(selVal);
    	 //删掉下拉
    	  angular.element("#"+"selectRelFlag"+(indexVal)).remove();
    	//end_选完下拉信息后，删掉下拉，显示表格
    	
    	
    	//$scope.left_pare=selVal;
    }
    $scope.rightflagChanged =function(indexVal,selVal){
    	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
    	if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
    	
    	$scope.tableExpVal[indexVal].right_pare=selVal;
    	//begin_选完下拉信息后，删掉下拉，显示表格
	  	  angular.element(document.getElementById("rightFlag"+indexVal)).text(selVal);
	  	 //删掉下拉
	  	  angular.element("#"+"selectRightFlag"+(indexVal)).remove();
	  	//end_选完下拉信息后，删掉下拉，显示表格
    	
    	
    	//$scope.right_pare=selVal;
    }
    $scope.relflagChanged =function(indexVal,selectedNameRelFlag){
    	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
    	if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
    	
    	//begin_选完下拉信息后，删掉下拉，显示表格
	  	  angular.element(document.getElementById("relFlag"+indexVal)).text(selectedNameRelFlag);
	  	 //删掉下拉
	  	  angular.element("#"+"selectRelFlag"+(indexVal)).remove();
	  	//end_选完下拉信息后，删掉下拉，显示表格
    	
    	//符号转换
    	  if("包含"==selectedNameRelFlag){
    		  selectedNameRelFlag="like";
    	  }else if("左包含"==selectedNameRelFlag){
    		  selectedNameRelFlag="LLike";
    	  }else if("右包含"==selectedNameRelFlag){
    		  selectedNameRelFlag="RLike";
    	  }else if("不包含"==selectedNameRelFlag){
    		  selectedNameRelFlag="NLike";
    	  }else if("不左包含"==selectedNameRelFlag){
    		  selectedNameRelFlag="NLLike";
    	  }else if("不右包含"==selectedNameRelFlag){
    		  selectedNameRelFlag="NRLike";
    	  }else{
    		  
    	  }
    	
        $scope.tableExpVal[indexVal].operator=selectedNameRelFlag;
      
        
        
    	//$scope.operator=selectedNameRelFlag;
    }
    $scope.logicflagChanged=function(indexVal,selectedNameLogicFlag){
    	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
    	if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
    	$scope.tableExpVal[indexVal].logic_operator=selectedNameLogicFlag;
    	
    	 //begin_选完下拉信息后，删掉下拉，显示表格
	  	  angular.element(document.getElementById("logicFlag"+indexVal)).text(selectedNameLogicFlag);
	  	 //删掉下拉
	  	  angular.element("#"+"selectLogicFlag"+(indexVal)).remove();
	  	//end_选完下拉信息后，删掉下拉，显示表格
    	
    	
    	//$scope.logic_operator=selectedNameLogicFlag;
    }
    
    
    
    
    $scope.showDes =function(){//描述
    	
    	$scope.isShow1=true;
    	$scope.isShow3=true;
    	$scope.isShow2=false;
    	 $scope.isShow4=false;
    	
    }
    
   $scope.showSC =function(){//脚本
    	
	   $scope.isShow2=true;
	   $scope.isShow4=true;
	   $scope.isShow1=false;
	   $scope.isShow3=false;
    	
    }
    
   
   //参数名模态框
   $scope.getParamName= function(){
	   
	   
	 //在同一个页面操作可能会城市间共享一个scope,屏蔽错误
		if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
	   
	        var opts = {
	                template:  'editor-app/configuration/properties/condition-getGetParamName-popup.html?version=' + Date.now(),
	                controller : KisBpmGetParamNameCtrl,
	                keyboard : false,
	                scope: $scope
	            };

	            // Open the dialog
	            $modal(opts);
	            $scope.paramNameModalShow=true;
         }
   
   //参数值模态框
   $scope.getParamVal = function(countRow){
	   
	 //在同一个页面操作可能会城市间共享一个scope,屏蔽错误
		if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}
	   
		//2017_5_16改造右侧值的弹出页面
		var paramNameData = angular.element(document.getElementById("paramNameID"+countRow)).text();
		
		
	   //判断要素/非要素
	    //if("1"==$rootScope.eleSelFlag){
		if(""==paramNameData || typeof(paramNameData)=='undefined'){
	    	//弹出表格
	    	  var opts = {
	                  template:  'editor-app/configuration/properties/condition-getGetParamValue-popup.html?version=' + Date.now(),
	                  controller : KisBpmGetParamNameCtrl,
	                  keyboard : false,
	                  scope: $scope
	              };

	              // Open the dialog
	              $modal(opts);
	              $scope.paramNameModalShow=true;

		           // Open the dialog
		             // $modal(opts);
	    	
	   // }else if("1"==$rootScope.eleSelFlag){str.indexOf(substr) >= 0
	    }else if(!(paramNameData.substring(0,5).indexOf("非要素")>=0)){
	    	//弹出树
	    	
	    	//begin_2017-5-17 回显表格树的显示问题_增加内容
			   var eleTableInfoData = angular.element(document.getElementById("eleTableInfo"+countRow)).text();
			   $scope.eleTableInfoDataScope=eleTableInfoData;
			//end_2017-5-17 回显表格树的显示问题_增加内容

	    	  var opts = {
	                  template:  'editor-app/configuration/properties/condition-getGetParamValueTree-popup.html?version=' + Date.now(),
	                  controller : paramValTree,
	                  keyboard : false,
	                  scope: $scope
	              };

	              // Open the dialog
	              $modal(opts);
	              $scope.paramNameModalShow=true;
	    	
	    }else{
	    	//弹出表格
	    	  var opts = {
	                  template:  'editor-app/configuration/properties/condition-getGetParamValue-popup.html?version=' + Date.now(),
	                  controller : KisBpmGetParamNameCtrl,
	                  keyboard : false,
	                  scope: $scope
	              };

	              // Open the dialog
	              $modal(opts);
	              $scope.paramNameModalShow=true;

		           // Open the dialog
		             // $modal(opts);
	    	
	    }
     
    }
   
   
   
    
   
   //参数名称模态框显示/隐藏
   $scope.closeParamNameModal=function(){
	   $scope.paramNameModalShow=false;
	   //$scope.property.mode = 'read';
       //$scope.$hide();
   }
   
   $scope.saveParamNameModal=function(){
	   $scope.paramNameModalShow=true;
   }
   
   
   $scope.getTokenId = function () {
	    var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
    	return tokenid;
    }
   
   //规则校验
   $scope.ruleExpCheck = function(){
	   
	  /* var opts = {
               template:  'editor-app/configuration/properties/condition-ruleExpCheck-popup.html?version=' + Date.now(),
               controller : KisBpmRuleExpCheckCtrl,
               keyboard : false,
               scope: $scope
           };

           // Open the dialog
           $modal(opts);
           $scope.paramNameModalShow=true;*/
	   
	   
	   if($scope.tableExpVal.length >0 || $scope.tableExpVal!=null){
		   
		   if($scope.tableExpVal instanceof Array && $scope.tableExpVal.length==0){
			   parent.window.message("没有选中行","error");
		   }else{
			   var fd = new FormData();
				
				//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
				if(!($scope.tableExpVal instanceof Array)){
					$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
				}
				
				
				
				
				$scope.tableExpVal = angular.toJson($scope.tableExpVal);
				$scope.tableExpVal=$scope.tableExpVal.replace(/\\/g,"");
				
				fd.append('tableExpVal', $scope.tableExpVal);
				
				//将条件配置信息放进root
				$rootScope.conditionSettingInfo=$scope.tableExpVal;
				
				 $http.post(KISBPM.URL.getExpBySetting()+"&tokenid="+$scope.getTokenId()+"&ajax=noCache",fd, { //使用post方法 传送formdata对象
			            transformRequest: angular.identity, //使用angular传参认证
			            headers: {
			                'Content-Type': undefined //设置请求头
			            }
			        })
			        .success(function (data){
			        	
			        	if(data.errorMsg !=null || typeof(data.errorMsg)!='undefined'){
			        		parent.window.message(data.errorMsg,"error");
			        	}else{
			        		 //toastr.success("success");
				        	var scriptExpressionBySetting=data.scriptExpressionBySetting;
				        	var descExpressionBySetting=data.descExpressionBySetting;
				        	$scope.conditionExpressionDesc=descExpressionBySetting;
				        	$scope.conditionExpressionScript=scriptExpressionBySetting;
				        	parent.window.message("成功生成表达式","success");
			        	}
			        	
			           
			        	
			        	//$scope.$emit('sendToChildExp', {"conditionExpressionDesc":descExpressionBySetting,"conditionExpressionScript":scriptExpressionBySetting});
			        })
			        .error(function (data) {
			        	
			           // toastr.success("failed");
			        });
			}
		   }
      }
   
   
   
    //end_条件表达式规则
    
   // $scope.add();
    
    $scope.save = function() {
    	
    	//begin_2017-05-17防止配置信息没有生成jsonStr就直接保存
    	$scope.tableExpValTmp=$scope.tableExpVal;
    	if($scope.tableExpVal instanceof Array){
    		$scope.tableExpVal = angular.toJson($scope.tableExpVal);
    		$scope.tableExpVal=$scope.tableExpVal.replace(/\\/g,"");
		}
    	//end_2017-05-17防止配置信息没有生成jsonStr就直接保存
    	
    	if($scope.tableExpValTmp.length!=0 && $scope.conditionExpressionDesc==""){
    		parent.window.message("请生成完条件表达式后再保存！","error");
    	}else{
    		
    		//配置条件为空时，将exp bsh设置为#
        	if($scope.tableExpValTmp.length==0){
        		$scope.property.value = "#";
        	}else{
        		 $scope.property.value = $scope.conditionExpressionDesc.trim() +"*"+$scope.conditionExpressionScript.trim()+"*"+$scope.tableExpVal;
        	}
        	
        	
           
           // $scope.property.fuck = $scope.tableExpVal;
            $scope.updatePropertyInModel($scope.property);
    		var facade=$scope.editor._canvas.facade;
    		if(facade!=undefined)
    		{
    			var current=$scope.editor.selection[0];
    			facade.setSelection($scope.editor.selection[0].parent);
    			facade.setSelection(current);
        	}
            $scope.close();
        
    		
    		
    	}
    	};

    // Close button handler
    $scope.close = function() {
    	$scope.property.mode = 'read';
    	$scope.$hide();
    };
    
    
    //begin_入口条件扩展_2017-5-22    
       
		    $scope.save_main = function() {
		    	
		    	//begin_2017-05-17防止配置信息没有生成jsonStr就直接保存
		    	$scope.tableExpValTmp=$scope.tableExpVal;
		    	if($scope.tableExpVal instanceof Array){
		    		$scope.tableExpVal = angular.toJson($scope.tableExpVal);
		    		$scope.tableExpVal=$scope.tableExpVal.replace(/\\/g,"");
				}
		    	//end_2017-05-17防止配置信息没有生成jsonStr就直接保存
		    	
		    	
		    	//配置条件为空时，将exp bsh设置为#
		    	if($scope.tableExpValTmp.length==0){
		    		$scope.property.value = "#";
		    	}else{
		    		 $scope.property.value = $scope.conditionExpressionDesc.trim() +"*"+$scope.conditionExpressionScript.trim()+"*"+$scope.tableExpVal;
		    	}
		    	
		        $scope.updatePropertyInModel($scope.property);
		        $scope.close();
		    };
		
		    $scope.close_main = function() {
		    	 $scope.property.mode = 'read';
		         $scope.$hide();
		    };
    //end_入口条件扩展_2017-5-22    
    
    
  
    
}];


//参数名称模态框
var KisBpmGetParamNameCtrl = ['$rootScope','$scope',"$sce","$http", function($rootScope,$scope,$sce,$http) {
    
	  $scope.getTokenId = function () {
		var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
     	return tokenid;
     }
	  
	 var tableName=$rootScope.mainTableName_condition;
	 
	  
	 tokenid=$scope.getTokenId();
	 
	
	 $scope.mainInfo = ["要素字段","非要素字段"];//左括号
      
	 //请求后台获得要素数据，默认获得要素下的
	  $http({method: 'GET', url: KISBPM.URL.getEleValue()+"&eleType=1&tableName="+tableName+"&tokenid="+tokenid+"&ajax=noCache"}).success(function (data, status, headers, config) {
			$scope.setmianInfoDatas(data);
			$rootScope.eleData=data;
		 });
	 
	 //$scope.mianInfoDatas=[{fieldName:"001",fieldNameCN:"联想"},{fieldName:"002",fieldNameCN:"百度"},{fieldName:"003",fieldNameCN:"腾讯"},{fieldName:"001",fieldNameCN:"联想"},{fieldName:"001",fieldNameCN:"联想"},{fieldName:"001",fieldNameCN:"联想"},{fieldName:"001",fieldNameCN:"联想"},{fieldName:"001",fieldNameCN:"联想"},{fieldName:"001",fieldNameCN:"联想"}];
	 $scope.mianInfoDatas=[];
	 
	 //选中当前行
	 $scope.mainEleSelected=function(selRow){
		 $scope.focus_out = selRow;
	 }
	 
	 
    $scope.saveP = function() {};
    
    //选中要素/非要素的内容
    $scope.selElementContent = function(){
    	
    	 var eleFieldName = angular.element(document.getElementById("eleFieldName"+$scope.focus_out)).text();
    	 var eleFieldNameCN = angular.element(document.getElementById("eleFieldNameCN"+$scope.focus_out)).text();
    	 
    	 //将表信息放进root
    	 $rootScope.ele_source=$rootScope.eleData[$scope.focus_out];
    	 
    	 
    	
    	if($scope.selectedEleInfo==undefined){
    		var eleValue='要素';
    		var paramName="["+eleValue+"]"+eleFieldNameCN+"["+eleFieldName+"]";
    		//记录每次选中要素/非要素的情况
    		$rootScope.eleSelFlag='1';
    		
    	}else{
    		var eleValue=$scope.selectedEleInfo;
    		eleValue=eleValue.substring(0,eleValue.length-2);
    		var paramName="["+eleValue+"]"+eleFieldNameCN+"["+eleFieldName+"]";
    		//记录每次选中要素/非要素的情况
    		$rootScope.eleSelFlag='2';
    	}
    	 
    	angular.element(document.getElementById("paramNameID"+$scope.focus)).text(paramName);
    	
    	//begin_2017-5-17 回显表格树的显示问题_增加内容
    	  if(typeof($rootScope.ele_source.ele_source)!='undefined'){
    		//begin_左侧值是code右侧值就选code,是ID就选ID_改造_20170806
  		      angular.element(document.getElementById("eleTableInfo"+$scope.focus)).text($rootScope.ele_source.ele_source+"|"+$rootScope.ele_source.para_name); 
  		    //end_左侧值是code右侧值就选code,是ID就选ID_改造_20170806 
    	  }else{
    		  angular.element(document.getElementById("eleTableInfo"+$scope.focus)).text("");
    	  }
    	  
    	//end_2017-5-17 回显表格树的显示问题_增加内容
    	
    	
    	
    	
    	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误_5-16
		/*if(!($scope.tableExpVal instanceof Array)){
			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
		}*/
    	
    	//主界面左边数据配置
    	$scope.tableExpVal[$scope.focus].left_paraname=eleFieldNameCN;
    	$scope.tableExpVal[$scope.focus].left_paraname_noFlag=eleValue+" "+eleFieldName;
    	
    	$scope.tableExpVal[$scope.focus].left_paraid=eleFieldName;
    	$scope.tableExpVal[$scope.focus].left_paravaluetype="2";
    	//begin_2017-5-17 回显表格树的显示问题_增加内容
    	if(typeof($rootScope.ele_source.ele_source)!='undefined'){
    		//begin_左侧值是code右侧值就选code,是ID就选ID_改造_20170806
  		      $scope.tableExpVal[$scope.focus].ele_source_info=$rootScope.ele_source.ele_source+"|"+$rootScope.ele_source.para_name;
  		    //end_左侧值是code右侧值就选code,是ID就选ID_改造_20170806
    	}else{
    		$scope.tableExpVal[$scope.focus].ele_source_info="";
    	}
    	   
    	//end_2017-5-17 回显表格树的显示问题_增加内容
    	
    	$scope.closeP();
    	
    }
    
    
    //获得要素信息
    $scope.eleChanged = function(selectedEleInfo){
    	 $scope.selectedEleInfo=selectedEleInfo;
    	 if("非要素字段"==selectedEleInfo){
    		 var eleType='2';
    	 }else{
    		 var eleType='1';
    	 }
    	 //查询当前要素下的记录
    	//请求后台获得要素数据，默认获得要素下的
   	  $http({method: 'GET', url: KISBPM.URL.getEleValue()+"&eleType="+eleType+"&tableName="+tableName+"&tokenid="+tokenid+"&ajax=noCache"}).success(function (data, status, headers, config) {
   		 //写到表格
   		  $scope.setmianInfoDatas(data);
   		  $rootScope.eleData=data;
   		 });
    }
    
    $scope.setmianInfoDatas = function(data){
    	$scope.mianInfoDatas=[];
		//设置要素记录 
	    for(var j=0;j<data.length;j++){
	    	 $scope.mianInfoDatas.push({
	    		 fieldName:data[j].para_name,
	    		 fieldNameCN:data[j].para_chs
	    	 });
	    }
	  
	}
    
    

    $scope.closeP = function() {
       /* $scope.property.mode = 'read';
        $scope.property.value=null;
        $rootScope.mainTableCN==null;
        $rootScope.isSelect=null;
        $scope.$hide();
    	 $scope.property.mode = 'read';
         $scope.$hide();*/
    	//$modalInstance.close();
    	$scope.$hide();
    	//$scope.close();
    };
}];



//参数值模态框
var KisBpmGetParamValueCtrl = ['$rootScope','$scope','$sce','$http','$modal', function($rootScope,$scope,$sce,$http,$modal) {
     //getNoEleValue
	
	
	
	
	 $scope.paramTypeSel = ["常量","变量"];
	 $scope.paramvaluetype = ["整数","字符串","布尔值","小数"];
	 $scope.paramIsShared = ["不公用","公用"];
	 $scope.selectedNoEleInfo="常量";
	 
	 $scope.getTokenId = function () {
		    var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
	     	return tokenid;
	     }
	 
	 $rootScope.noEleData=[];
     //初始化非要素数据
	  $http({method: 'GET', url:  KISBPM.URL.getNoEleValue()+"&ele_type=1&tokenid="+$scope.getTokenId()+"&ajax=noCache"}).success(function (data, status, headers, config) {
		    for(var i=0;i<data.length;i++){
		    	data[i].is_shared = $scope.paramIsShared[Number(data[i].is_shared)];
		    	data[i].para_valuetype = $scope.paramvaluetype[Number(data[i].para_valuetype)-1];
		    }
		   $rootScope.noEleData=data; 
	      });
	
	 
	 //选中当前行
	 $scope.noEleDataSelected=function(selRow){
		 $scope.focus_out = selRow;
		 var noEleDataSelectedID = angular.element(document.getElementById("noElePara_id"+selRow)).text();
		 $scope.noEleDataSelectedID=noEleDataSelectedID;//获得id
	 }
	 
	 
	 //删除当前行
	 $scope.delNewNoEleByEleType = function(){
		//$scope.selectedNoEleInfo
		 if($scope.noEleDataSelectedID!=undefined){
			 $http({method: 'GET', url:  KISBPM.URL.deleteRuleParam()+"&paraType_c="+$scope.selectedNoEleInfo+"&ruleParamID="+$scope.noEleDataSelectedID+"&tokenid="+$scope.getTokenId()+"&ajax=noCache"})
			 .success(function (data, status, headers, config) {
				 var msg=data.returnReg;
				 parent.window.message(msg,"success");
				 $scope.closeP();
			 }).error(function (data, status, headers, config) {
				 var msg=data.returnReg;
				 parent.window.message(msg,"fail");
	           });
		 }
		
	 }
	 
	 
	 //修改规则参数
	 $scope.ruleParamFix = function(){
		 
		   //消息广播，发送当前参数
		 $scope.noElePara_id = angular.element(document.getElementById("noElePara_id"+$scope.focus_out)).text();
		 $scope.noElePara_valuetype_t = angular.element(document.getElementById("noElePara_valuetype_t"+$scope.focus_out)).text();//返回值类型
		 $scope.noElePara_name = angular.element(document.getElementById("noElePara_name"+$scope.focus_out)).text();
		 $scope.noElePara_desc = angular.element(document.getElementById("noElePara_desc"+$scope.focus_out)).text();
		 $scope.noEleIs_shared = angular.element(document.getElementById("noEleIs_shared"+$scope.focus_out)).text();
		 /*$scope.$broadcast("to-child-fix", { noEleDataSelectedID: noEleDataSelectedID, noElePara_valuetype_t: noElePara_valuetype_t,
			   noElePara_name:noElePara_name,noElePara_desc:noElePara_desc,noEleIs_shared:noEleIs_shared});  */
		   
		   
		   var opts = {
	               template:  'editor-app/configuration/properties/condition-updateRuleParam-popup.html?version=' + Date.now(),
	               controller : updateRuleParamCtrl,
	               keyboard : false,
	               scope: $scope
	           };
	           $modal(opts);
	            $scope.$on('to-parent-ruleParam', function(event,data) {
	              
	              //更新之前选中的行数据
	              angular.element(document.getElementById("noElePara_valuetype_t"+$scope.focus_out)).text($scope.paramvaluetype[Number(data.paramvaluetypeInit)-1]);
	              angular.element(document.getElementById("noEleIs_shared"+$scope.focus_out)).text($scope.paramIsShared[Number(data.paramCheck_val)]);
	              angular.element(document.getElementById("noElePara_name"+$scope.focus_out)).text(data.paramName_val);
	              angular.element(document.getElementById("noElePara_desc"+$scope.focus_out)).text(data.paramDesc_val);
	            });
	   }
	 
	 
	 
	 
	 
  /* $scope.saveP = function() {};*/
   
   $scope.selNoElementContent = function(){
    var noEleParaName = angular.element(document.getElementById("noElePara_name"+$scope.focus_out)).text();
    var noElePara_desc = angular.element(document.getElementById("noElePara_desc"+$scope.focus_out)).text();
    var noElePara_id = angular.element(document.getElementById("noElePara_id"+$scope.focus_out)).text();
   	var paramVal="["+ $scope.selectedNoEleInfo+"]"+noElePara_desc;
   	angular.element(document.getElementById("paramValueID"+$scope.focus)).text(paramVal);
   	
  //在同一个页面操作可能会城市间共享一个scope,屏蔽错误_右侧非要素
	if(!($scope.tableExpVal instanceof Array)){
		$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
	}
   	
   	//非要素主界面右侧配置
     	$scope.tableExpVal[$scope.focus].right_paraname=noElePara_desc;
     	$scope.tableExpVal[$scope.focus].right_paraname_noFlag=$scope.selectedNoEleInfo;
     	$scope.tableExpVal[$scope.focus].right_paraid=noElePara_id;
     	
     	var noElePara_valuetype_t=angular.element(document.getElementById("noElePara_valuetype_t"+$scope.focus_out)).text();
     	if("整数"==noElePara_valuetype_t){
     		noElePara_valuetype_t="1"  
		}else if("字符串"==noElePara_valuetype_t){
			noElePara_valuetype_t="2";
		}else if("布尔值"==noElePara_valuetype_t){
			noElePara_valuetype_t="3";
		}else{
			noElePara_valuetype_t="4";
		}
     	$scope.tableExpVal[$scope.focus].right_paravaluetype=noElePara_valuetype_t;
   	
   	$scope.closeP();
   }
   
   
   $scope.noEleChanged = function(selectedNoEleInfo){
   	 $scope.selectedNoEleInfo=selectedNoEleInfo;
   	 //查询当前要素下的记录
   	 
   	    if("常量"==selectedNoEleInfo){
   	    	 $scope.ele_type="1";
   	    }else{
   	    	 $scope.ele_type="2";
   	    }
   	    
   	 $http({method: 'GET', url:  KISBPM.URL.getNoEleValue()+"&ele_type="+$scope.ele_type+"&tokenid="+$scope.getTokenId()+"&ajax=noCache"}).success(function (data, status, headers, config) {
		    for(var i=0;i<data.length;i++){
		    	data[i].is_shared = $scope.paramIsShared[Number(data[i].is_shared)];
		    	data[i].para_valuetype = $scope.paramvaluetype[Number(data[i].para_valuetype)-1];
		    }
		   $rootScope.noEleData=data; 
	      });
   }
   
   
   
   
   
   //根据eleType增加非要素信息
   $scope.addNewNoEleByEleType = function(selectedNameParamTypeSel){
	   
	   $rootScope.titleName=selectedNameParamTypeSel;
	   
	   
	   //将作用域传到子集的规则参数保存中
	  // $scope.$broadcast('sendChild_saveRuleParam',$scope);
	   
	   //弹出变量定义模态框
	   var opts = {
               template:  'editor-app/configuration/properties/condition-createParamModal-popup.html?version=' + Date.now(),
               controller : KisBpmCreateParamModalCtrl,
               keyboard : false,
               scope: $scope
           };

           // Open the dialog
	       $scope.$broadcast('sendChild_paramVal1',$scope);
           $modal(opts);
         //消息广播_接收父级信息
    	   $scope.$on('sendChild_paramVal', function(event,data) {
    		    var msg=data;
    	   });
    	
           //parentScope.getParamVal();
           
           
           //2017-05-09
          /* $http({method: 'GET', url:  KISBPM.URL.getNoEleValue()+"&ele_type="+$scope.ele_type+"&tokenid="+$scope.getTokenId()}).success(function (data, status, headers, config) {
   		    for(var i=0;i<data.length;i++){
   		    	data[i].is_shared = $scope.paramIsShared[Number(data[i].is_shared)];
   		    	data[i].para_valuetype = $scope.paramvaluetype[Number(data[i].para_valuetype)-1];
   		    }
   		   $rootScope.noEleData=data; 
   	      });*/
           
           
    	   
	   
	   
   }
   
   

   $scope.closeP = function() {
   	$scope.$hide();
   };
}];



//变量定义模态框
var KisBpmCreateParamModalCtrl=['$rootScope','$scope','$http', function($rootScope,$scope,$http) {
	
	 $scope.paramvaluetype = ["整数","字符串","布尔值","小数"];
	
	 $scope.paramvaluetypeInit="整数";
	 
	 $scope.getTokenId = function () {
		    var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
	     	return tokenid;
	     }
	 
	 //保存常量、变量信息
	 $scope.saveParaValue = function(){
		 
		 //获得数据信息
		// var paramName_val=$scope.paramName_val;
		 //var paramDesc_val=$scope.paramDesc_val;
		 //var paramvaluetypeInit=$scope.paramvaluetypeInit;
		 
		var paramName_val=angular.element(document.getElementById("paramNameId")).val();
		var paramDesc_val=angular.element(document.getElementById("descId")).val();
		var paramCheck_val=$scope.paramCheck_val;
		if(paramCheck_val==undefined){
			paramCheck_val='0';
		}
		var paramvaluetypeInit=$scope.paramvaluetypeInit;
		if("整数"==paramvaluetypeInit){
			paramvaluetypeInit="1"  
		}else if("字符串"==paramvaluetypeInit){
			paramvaluetypeInit="2";
		}else if("布尔值"==paramvaluetypeInit){
			paramvaluetypeInit="3";
		}else{
			paramvaluetypeInit="4";
		}
		
		var paraType_c=$scope.titleName=="常量"?"1":"2";
		var noElePara_id_val=typeof($scope.noElePara_id_val)=="undefined"?"":$scope.noElePara_id_val;
		
		 
		 $http({method: 'GET', url:  KISBPM.URL.saveParaValue()+"&tokenid="+$scope.getTokenId()+
			 "&paramName_val="+paramName_val+"&paramDesc_val="+paramDesc_val+"&paramCheck_val="+paramCheck_val+
			 "&paramvaluetypeInit="+paramvaluetypeInit+"&paraType_c="+paraType_c+"&noElePara_id_val="+noElePara_id_val+"&ajax=noCache"
			 }).success(function (data, status, headers, config) {
				 
				 var msg=data.returnReg;
				 parent.window.message(msg,"success");
				 
					//消息广播_接收父级信息
					  /* $scope.$on('sendChild_saveRuleParam', function(event,data1) {
						  data1.closeP(); 
					   });*/
				 
				   $scope.$emit('sendChild_paramVal', 'nihao');
				  /* $scope.$on('sendChild_paramVal1', function(event,scopeData) {
					   $scope.scopeDataInfo=scopeData;
		    	   });*/
				   $http({method: 'GET', url:  KISBPM.URL.getNoEleValue()+"&ele_type="+paraType_c+"&tokenid="+$scope.getTokenId()+"&ajax=noCache"}).success(function (data, status, headers, config) {
					    for(var i=0;i<data.length;i++){
					    	data[i].is_shared = $scope.paramIsShared[Number(data[i].is_shared)];
					    	data[i].para_valuetype = $scope.paramvaluetype[Number(data[i].para_valuetype)-1];
					    }
					   $rootScope.noEleData=data; 
				      });
					   $scope.closeP();
				
				// parentScope.closeP();
				 
			 }).error(function (data, status, headers, config) {
				 var msg=data.returnReg;
				 parent.window.message(msg,"fail");
	           });
		 
		
	 }
	 
	 //下拉列表change
	 $scope.paramValueTypeChange = function(paramType){
		 $scope.paramvaluetypeInit=paramType;
		 //angular.element(document.getElementById("paramValueID"+$scope.focus)).text($scope.selNode.name.split(" ")[1]);
	 }
	 
	 
	 //选中当前行
	 $scope.mainEleSelected=function(selRow){
		 $scope.focus_out = selRow;
	 }
	 
	 
	$scope.closeP = function() {
	   	$scope.$hide();
	   };
	
}];




//规则参数修改
var updateRuleParamCtrl = ['$scope','$http', function($scope,$http) {
	
	 $scope.paramvaluetype = ["整数","字符串","布尔值","小数"];
	
	 $scope.paramvaluetypeInit="整数";
	 
	 $scope.getTokenId = function () {
		    var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
	     	return tokenid;
	     }
	 
	 //消息广播
	/* $scope.$on('to-child-fix', function(event,data) {
          var fix_name=data.noElePara_name;

       });*/
	 
	 //数据回显
	 $scope.noElePara_id_val = angular.element(document.getElementById("noElePara_id"+$scope.focus_out)).text();
	 $scope.selectedNameParamvaluetype = angular.element(document.getElementById("noElePara_valuetype_t"+$scope.focus_out)).text();//返回值类型
	 $scope.paramName_val= angular.element(document.getElementById("noElePara_name"+$scope.focus_out)).text();
	 $scope.paramDesc_val= angular.element(document.getElementById("noElePara_desc"+$scope.focus_out)).text();
	 $scope.noEleIs_shared = angular.element(document.getElementById("noEleIs_shared"+$scope.focus_out)).text();
	 
	   
	 
	   //空值ckeckbox回显
	    if("公用"==$scope.noEleIs_shared){
	    	 $scope.checkbox = 1;
	    	 $scope.paramCheck_val="1";
		 }else{
			 $scope.checkbox = 0;
			 $scope.paramCheck_val="0";
		 }
	    
	    $scope.$watch(function(){
	        return $scope.checkbox;
	    }, function(){
	        $scope.checkbox = Number($scope.checkbox);
	    },true);
	    
	
	 
	 
	 //更新常量、变量信息
	 $scope.saveParaValue = function(){

		var paramName_val=$scope.paramName_val;
		var paramDesc_val=$scope.paramDesc_val;
		var paramCheck_val=$scope.paramCheck_val==true?"1":"0";
		var paramvaluetypeInit=$scope.selectedNameParamvaluetype;
		if("整数"==paramvaluetypeInit){
			paramvaluetypeInit="1"  
		}else if("字符串"==paramvaluetypeInit){
			paramvaluetypeInit="2";
		}else if("布尔值"==paramvaluetypeInit){
			paramvaluetypeInit="3";
		}else{
			paramvaluetypeInit="4";
		}
		
		var paraType_c=$scope.titleName=="常量"?"1":"2";
		var noElePara_id_val=typeof($scope.noElePara_id_val)=="undefined"?"":$scope.noElePara_id_val;
		 
		 
		 $http({method: 'GET', url:  KISBPM.URL.saveParaValue()+"&tokenid="+$scope.getTokenId()+
			 "&paramName_val="+paramName_val+"&paramDesc_val="+paramDesc_val+"&paramCheck_val="+paramCheck_val+
			 "&paramvaluetypeInit="+paramvaluetypeInit+"&paraType_c="+paraType_c+"&noElePara_id_val="+noElePara_id_val+"&ajax=noCache"
			 }).success(function (data, status, headers, config) {
				 
				 var msg=data.returnReg;
				 parent.window.message(msg,"success");
				 $scope.closeP();
				 
				 //消息广播
				  $scope.$emit('to-parent-ruleParam', {paramName_val:paramName_val,paramDesc_val:paramDesc_val,
					  paramCheck_val:paramCheck_val,paramvaluetypeInit:paramvaluetypeInit});
				 
				 
			 }).error(function (data, status, headers, config) {
				 var msg=data.returnReg;
				 parent.window.message(msg,"fail");
	           });
	 }
	 
	    
	 
	 
	 //下拉列表change
	 $scope.paramValueTypeChange = function(paramType){}
	 
	$scope.closeP = function() {
	   	$scope.$hide();
	   };
	
}];





//规则表达式校验模态框
var KisBpmRuleExpCheckCtrl = ['$rootScope','$scope','$http', function($rootScope,$scope,$http) {
	
	
	
	$scope.getTokenId = function () {
		var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
     	return tokenid;
     }
	
	//获得表达式
	//将配置信息toJson
	if($scope.tableExpVal.length >0 || $scope.tableExpVal!=null){
		var fd = new FormData();
		
		var tableExpVal = angular.toJson($scope.tableExpVal);
		tableExpVal=tableExpVal.replace(/\\/g,"");
		
		fd.append('tableExpVal', tableExpVal);
		 $http.post(KISBPM.URL.getExpBySetting()+"&tokenid="+$scope.getTokenId()+"&ajax=noCache",fd, { //使用post方法 传送formdata对象
	            transformRequest: angular.identity, //使用angular传参认证
	            headers: {
	                'Content-Type': undefined //设置请求头
	            }
	        })
	        .success(function (data){
	            //toastr.success("success");
	        	var scriptExpressionBySetting=data.scriptExpressionBySetting;
	        	var descExpressionBySetting=data.descExpressionBySetting;
	        	$scope.conditionExpressionDesc=descExpressionBySetting;
	        	$scope.conditionExpressionScript=scriptExpressionBySetting;
	        	
	        	$scope.$emit('sendToChildExp', {"conditionExpressionDesc":descExpressionBySetting,"conditionExpressionScript":scriptExpressionBySetting});
	        })
	        .error(function (data) {
	            toastr.success("failed");
	        });
		
	}
	
	
	//获得外层记录数
	 var out_count=document.getElementsByName("out_1st").length;
	 $scope.writeInfoDatas=[];
	 for(var i=0;i<out_count;i++){
		//获得每行的参数名称，形成列表
		  var eleFieldName=angular.element(document.getElementById("paramNameID"+i)).text();
		  var index=eleFieldName.lastIndexOf("[");
		  eleFieldName=eleFieldName.substring(index+1,eleFieldName.length-1);
		  $scope.writeInfoDatas.push({
			  writeFieldName:eleFieldName
           });
	 }
	 
	 //获得表达式配置数量
	 var count=$scope.countNum;
	 
	 //录入变量值
       $scope.insertParamVal = function(){
    	
    	   for(var k=0;k<out_count;k++){
    		   var writeFieldName = angular.element(document.getElementById("writeFieldName"+k)).text(); 
    		   var writeFieldNameVal = angular.element(document.getElementById("writeFieldNameVal"+k)).text(); 
    		   //if()
    		   
    		   
    		   
    	   }
    	   
    	   
    	   
       }	 
	 
	 
	 
	 $scope.closeP = function() {
		   	$scope.$hide();
		   };
	 
}];


//参数值树结构
var paramValTree = ['$rootScope','$scope', '$q', '$translate', '$http', '$timeout', '$element', function($rootScope,$scope, $q, $translate, $http, $timeout, $element) {
	//parent.window.bbb();
	/*var current_url = location.search;
	var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
	
	 $http({method: 'GET', url: "/df/wf/treePid?tokenid="+tokenid}).success(function (data, status, headers, config) {
			var test=data;
			//var treeObj = jQuery.fn.zTree.getZTreeObj(angular.element(document.getElementById("tree3")));
			var treeObj = jQuery("#tree3")[0]['u-meta'].tree;
//			var treeObj = document.getElementById("treeTest2");
		 });*/
	
	
	 $scope.searchTreeArr = ["包含","左包含","右包含","精确定位"];//左括号
	
	
	
	 //begin_2017-5-17 回显表格树的显示问题_增加内容   var ele_source_val=$rootScope.ele_source.ele_source;
	/* var ele_source_val="";
	 if(typeof($rootScope.ele_source)=='undefined'){
		 ele_source_val=$scope.eleTableInfoDataScope;
	  }else{
		   ele_source_val=$rootScope.ele_source.ele_source;
	  }*/
	 
	 var ele_source_val=$scope.eleTableInfoDataScope;
	 
	 
	 
	 //end_2017-5-17 回显表格树的显示问题_增加内容
	
	
	var current_url = location.search;
	var tokenid = EDITOR.UTIL.getUrlParameter('tokenid');
	
	
	
	var setting = {
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "pId"/*,
					rootPId: 0*/
				}
			},
			/*async: {  //2015-05-05
				enable: true,
				type : 'GET',
				url: "/df/service/get/eleParamValTree?ele_source_val="+ele_source_val+"&tokenid="+tokenid,
				dataType : 'json',
				contentType: 'application/json',
				otherParam: $scope.property.queryConditions,
				autoParam: [ "id", "name" ],
				dataFilter: dataFilter
			},*/
//			check: {
//				enable: $scope.property.multiSelect,
//				chkboxType: {"Y":"ps","N":"ps"}
//			},
//			data: {
//				simpleData: {
//					enable: true
//				}
//			},
//			view: {
//				expandSpeed: ""
//			},
			callback: {
				onClick: $scope.property.multiSelect ? null : onClick,
			}
		};
	
//		var zNodes =[
//			{name:"root", id:"root", isParent:true}
//		];
		
		//2015-05-05
		$http({method: 'GET', url: "/df/service/get/eleParamValTree?ele_source_val="+ele_source_val+"&tokenid="+tokenid+"&ajax=noCache"}).success(function (data, status, headers, config) {
	  		 
			jQuery.fn.zTree.init(jQuery($element.find("ul")[0]),setting, data);
			
		
		
		});
		
		//var k=jQuery.fn.zTree.init(jQuery($element.find("ul")[0]), setting);
		
		
		
		
		
		function beforeExpand(treeId, treeNode) {
			if (!treeNode.isAjaxing) {
				//if(!treeNode.children || treeNode.children.length == 0){
				  if(treeNode.isleaf=='1'){
					jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.pk = treeNode.pk;
					jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.viewValue = treeNode.viewValue;
					jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.nodeType = treeNode.nodeType;
					jQuery.fn.zTree.getZTreeObj("treeref1_zTree").setting.async.otherParam.orgClass = treeNode.orgClass;
					startTime = new Date();
					treeNode.times = 1;
					ajaxGetNodes(treeNode, "refresh");
				}
				
				  //将父节点isParent的值设置为true
				  //treeNode.isParent=true;
				  
				  
				return true;
			} else {
				alert("zTree 正在下载数据中，请稍后展开节点。。。");
				return false;
			}
		}
		
		
		function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
			var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			alert("异步获取数据出现异常。");
			if(treeNode){
				treeNode.icon = "";
				zTree.updateNode(treeNode);
			}
		}
		
		
		function onClick(event, treeId, treeNode, clickFlag) {
			if(treeNode && treeNode.canselect){
				if(!$scope.params){
					$scope.params = {};
				}
				$scope.params.treeSelecteds = [];
				$scope.params.treeSelecteds.push(treeNode);
				
				//选中节点,放进缓存
				$scope.selNode=treeNode;
				
			}
		}
		
		
		
		function beforeClick(treeId, treeNode) {
			if(treeNode && treeNode.canselect){
				var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
				zTree.checkNode(treeNode, !treeNode.checked, true, true);
			}
			return false;
		}
		
		
		function dataFilter(treeId, parentNode, responseData){
			if(responseData instanceof Array){
				jQuery.each(responseData, function(){
					if(typeof(this.nodeType) == "string" && "user" == this.nodeType.toLowerCase()){
						this.nocheck = false;
						this.icon = KISBPM.URL.getApplicationPath() + "/s/ztree/zTreeStyle/img/diy/user0.png";
					}
				});
			}
			return responseData;
		}
		
		
		function onAsyncSuccess(event, treeId, treeNode, msg) {
			var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			if (!msg || msg.length == 0) {
				if(treeNode){
					treeNode.icon = "";
					zTree.updateNode(treeNode);
				}
				return;
			}
			var totalCount = 0;
			if(msg[0].totalCount){
				totalCount = msg[0].totalCount;
			}
			if(treeNode){
				if(msg.length == totalCount){
					treeNode.icon = "";
					zTree.updateNode(treeNode);
				}else if (treeNode.children.length < totalCount) {
					setTimeout(function() {ajaxGetNodes(treeNode);}, perTime);
				} else {
					treeNode.icon = "";
					zTree.updateNode(treeNode);
					//zTree.selectNode(treeNode.children[0]);
				}
			}else{
				if(msg.length == totalCount){
					zTree.updateNode(treeNode);
				}else if(zTree.getNodes().length < totalCount){
					setTimeout(function() {ajaxGetNodes(treeNode);}, perTime);
				}else{
					zTree.updateNode(treeNode);
				}
			}
		}
		
		
	
	
		function ajaxGetNodes(treeNode, reloadType) {
			var zTree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
			if(treeNode){
				if (reloadType == "refresh") {
					treeNode.icon = KISBPM.URL.getApplicationPath() + "/s/ztree/zTreeStyle/img/loading.gif";
					zTree.updateNode(treeNode);
				}
			}
			zTree.reAsyncChildNodes(treeNode, reloadType, true);
		}
	
		$scope.closeP = function() {
		   	$scope.$hide();
		   };
	
		   $scope.ipInfoJump = function(msg,flag) {
				var success_info = jQuery("#info-notice")[0];
				if (!success_info) {
					jQuery("body").append('<div id="info-notice" class="info-notice"><span><i class="glyphicon glyphicon-ok-circle ip-pop-' + flag + '"></i></span>' + msg + '</div>');
				} else {
					jQuery("#info-notice").html('<span><i class="glyphicon glyphicon-ok-circle ip-pop-' + flag + '"></i></span>'+ msg);
				}
				jQuery("#info-notice").css("display", "block");
				jQuery("#info-notice").css("z-index", "9999");
				jQuery("#info-notice").fadeOut(4000);
			}
		   $scope.search = function() {
				var user_write = jQuery("#user-write").val();
				var data_tree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
				var search_nodes = data_tree.getNodesByParamFuzzy("name", user_write, null);
				if (search_nodes == null || search_nodes.length == 0) {
					parent.window.searchTreeNode("无搜索结果","info");
				} else {
					data_tree.expandNode(search_nodes[0], true, true, true);  
					//beforeExpand("treeref1_zTree", search_nodes[0])
					data_tree.selectNode(search_nodes[0]);
					
					//选中节点,放进缓存
					$scope.selNode=search_nodes[0];
					$scope.node_count = 1;
					
					
					
				}
			}	   
		   
	
	
		   //选中树节点
		    $scope.selElementTreeNode = function(){
		    	//$scope.selNode.name
		    	var k=1;
		    	angular.element(document.getElementById("paramValueID"+$scope.focus)).text("[要素]"+$scope.selNode.name.split(" ")[1]);
		    	//begin_判断当前左侧名称选的是code还是ID_20170806
		    	   if($scope.eleTableInfoDataScope.split("|")[1].endsWith("CODE")){
		    		   angular.element(document.getElementById("NoParamValueTree"+$scope.focus)).text($scope.selNode.name.split(" ")[0]);
		    		   $scope.tableExpVal[$scope.focus].right_paraid=$scope.selNode.name.split(" ")[0];
		    	   }else{
		    		   angular.element(document.getElementById("NoParamValueTree"+$scope.focus)).text($scope.selNode.id);
		    		   $scope.tableExpVal[$scope.focus].right_paraid=$scope.selNode.id;
		    	   }
		    	//end_判断当前左侧名称选的是code还是ID_20170806
		    	
		    	//在同一个页面操作可能会城市间共享一个scope,屏蔽错误
        		if(!($scope.tableExpVal instanceof Array)){
        			$scope.tableExpVal= angular.fromJson($scope.tableExpVal.substring(1,$scope.tableExpVal.length-1));
        		}
		    	
		    	//主界面右边数据配置
		    	$scope.tableExpVal[$scope.focus].right_paraname=$scope.selNode.name.split(" ")[1];
		    	$scope.tableExpVal[$scope.focus].right_paraname_noFlag="要素";
		    	//$scope.tableExpVal[$scope.focus].right_paraid=$scope.selNode.id;//20170806
		    	$scope.tableExpVal[$scope.focus].right_paravaluetype="";
		    	
		       	$scope.closeP();
		    	
		    	
		    }
	
	
		    $scope.node_count = 0;
		    $scope.next = function() {
		    	
		    	var user_write = jQuery("#user-write").val();
				var data_tree = jQuery.fn.zTree.getZTreeObj("treeref1_zTree");
		    	var search_nodes = data_tree.getNodesByParamFuzzy("name", user_write, null);
		    	if ( $scope.node_count < search_nodes.length) {
		    		data_tree.selectNode(search_nodes[$scope.node_count++]);
		    		//打开非叶子节点
		    		 //beforeExpand("treeref1_zTree", search_nodes[$scope.node_count-1])
		    		 data_tree.expandNode(search_nodes[$scope.node_count-1], true, true, true);
		    		 
		    		 //将选中树节点放进缓存
		    		 $scope.selNode=search_nodes[$scope.node_count-1];
		    		 
		    		
		    	} else {
		    		$scope.node_count = 0;
		    		parent.window.searchTreeNode("最后一个","info");
		    		// alert("最后一个");
		    	}
		    }
	
	
	
	
	
	
	
	
	
	
	
	
	/**
	 * 
		var current_url = location.search;
    	var tokenid = current_url.substring(current_url.indexOf("tokenid") + 8,current_url.indexOf("tokenid") + 48);
		$.ajax({
			url : "/df/wf/treePid?tokenid="+tokenid,
			type : 'GET',
			dataType : "json",
			success : function(data) {
				console.log(data);
				viewModel.dataTableList.setSimpleData(data.wf);
				var treeObj = $.fn.zTree.getZTreeObj("tree3");
				var node =treeObj.getNodesByParam("wf_code", proCode, null);
				if(node != null && node.length > 0){
					treeObj.selectNode(node[0]);
				}
			}
		});
	
	 */
	
	
	
}];



