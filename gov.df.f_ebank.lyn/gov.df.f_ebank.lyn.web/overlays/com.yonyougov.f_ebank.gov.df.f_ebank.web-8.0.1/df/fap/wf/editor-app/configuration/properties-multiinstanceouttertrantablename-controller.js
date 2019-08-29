var KisBpmMultiinstanceOutterTranTableNameCtrl = [ '$scope','$http','$rootScope', function($scope,$http,$rootScope) {
	
	$rootScope.rootitems=[];
	$scope.items=[];
	
	var jsonData;
	//请求后台
	$http({method: 'GET', url: KISBPM.URL.getInnerTable()}).success(function (data, status, headers, config) {
	$scope.setjsonData(data);
	
 });
 
   /*$.ajax({
        type:'GET',
        url:'http://localhost:8088/ubpm-webserver-process-center/service/get/innerTable',
        dataType:'json',
        success:function(data){
          $scope.setjsonData(data);
        }  
   })*/
 
 
 
  $scope.setjsonData = function(data){	
        
    if(data!=undefined){
      for (var i=0;i<data.length;i++){
	    $scope.items.push(data[i]);
	   // $rootScope.rootitems.push(data[i]);
	  }
    }
        
  };
 
	
	
	 $scope.multiInstanceModelChanged = function() {
	      
		  $scope.$emit('to-parent',$scope.items);
	      
	      
	       for (var p=0;p<$scope.items.length;p++)
		 {
		   if($scope.property.value=="luru"){
		     $scope.property.showtext = "";
		     break;;
		   }else if($scope.property.value==$scope.items[p].value){
		     $scope.property.showtext =$scope.items[p].text;
		     $rootScope.outterTableCN=$scope.items[p].id_column_name;
		     //$rootScope.mainTableCN=null;
		     $rootScope.isSelect=true;
		     break;
		   }
		
		 }
		 
		 
		 /*
		     switch($scope.property.value){
				case "None":
					$scope.property.showtext = "";
					break;
				case "ELE_PERTYPE":
					$scope.property.showtext = "人员性质表";
					break;
				case "FI_BASEDATA_AUDITFIRMS":
					$scope.property.showtext = "审计事务所";
					break;
			}
		 */
		 
		 /*var keepGoing = true;
		 angular.forEach($scope.items, function(data,index,array){   
		       if(keepGoing){
		         if($scope.property.value=="None"){
		          $scope.property.showtext = "";
		         keepGoing=false;
			    }else if($scope.property.value=data.value){
			         $scope.property.showtext =data.text;
			        keepGoing=false;
			     }
		       
		       }
		        
		       
		       });
		*/
			 
		 
		
	       	
      
    	$scope.updatePropertyInModel($scope.property);
//		var facade=$scope.editor.selection[0].facade;
//		var current=$scope.editor.selection[0];
//		facade.setSelection($scope.editor.selection[0].parent);
//		facade.setSelection(current);
		
    }
	
	
        
   
}];
