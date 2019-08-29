
var KisBpmReferenceOtmrtiCtrl = [ '$rootScope','$scope', '$modal', '$timeout', '$translate', function($rootScope,$scope, $modal, $timeout, $translate) {

    // Config for the modal window
    var opts = {
        template:  'editor-app/configuration/properties/reference/grid/reference-otmrti.html?version=' + Date.now(),
        scope: $scope
    };

    // Open the dialog
    $modal(opts);
}];

var personCtrl = ['$scope', '$q', '$translate', '$http', '$timeout', '$cookieStore', function($scope, $q, $translate, $http, $timeout, $cookieStore) {
	
	
	
	 //$scope.testShow = false;
        $scope.add = function() {
            //$scope.testShow = true;
            jQuery("#testShow").show();
            
        };
        $scope.close = function() {
            //$scope.testShow = false;
             jQuery("#testShow").hide();
        };
        /*弹窗的数据*/
        $scope.datatop = ["提取","跨节点挂起","跨节点删除","跨节点作废","录入","修改","审核","退回","撤消","删除","作废","挂起"];
        $scope.databottom = ["在途记账","终审记账"];

        //begin_数据不能回显问题_2017_04_21
               
               $scope.datas=[];
        
                if($scope.property.value!=""){
                   $scope.datas=$scope.property.value.refResultData;
                   var mycars=new Array();
                   for(var e=0;e<$scope.datas.length;e++){
   		        	mycars.push($scope.datas[e]);
   		          }
                }else{
                	var refResultData=new Array();
                	$scope.property.value={
                	  refResultData:refResultData,
                	  showValue:""
                	};
                	$scope.datas=$scope.property.value.refResultData;
                    var mycars=new Array();
                    for(var e=0;e<$scope.datas.length;e++){
    		        	mycars.push($scope.datas[e]);
                }
              }
		        
         //end_数据不能回显问题_2017_04_21

        $scope.adddatas=function(){
        	//begin_过滤数据重复_2017_04_21
        	    var flag=true;
        	    var Name1= jQuery("#select1 option:selected").text();
        	    var Name2= jQuery("#select2 option:selected").text();
	        	var newData=Name1+" "+Name2;
	        	
	        	
	        		for(var i=0;i<$scope.datas.length;i++){
		        		var oldData=$scope.datas[i].Name1+" "+$scope.datas[i].Name2;
		        		if(oldData==newData){
		        			flag=false;
		        		}
		        	}
		        	if(flag){
		        		$scope.datas.push({
		 	                Name1:jQuery("#select1 option:selected").text(),
		 	                Name2:jQuery("#select2 option:selected").text()
		 	            });
		        	}
	        	 
        	//end_过滤数据重复_2017_04_21
            
            console.log($scope.datas);
        };
        $scope.deletedatas=function(){   //删除一行的内容
           // $scope.datas.splice($scope.datas.indexOf(data),1);
        	
        	
            $scope.datas.splice($scope.focus,1);
        };

        $scope.dataschange=function(i){
                $scope.focus = i;
        }


        $scope.save = function() {
            $scope.property.value = $scope.datas
    
                    $scope.property.value = {};
                    $scope.property.value.refResultData =  $scope.datas;
                    $scope.property.value.showValue = '';
                    var len = $scope.datas.length;
                    for(var i = 0; i < len; i++){
                        if(i > 0){
                            $scope.property.value.showValue += ',';
                        }
                        
                        var modelValue =  $scope.property.value.refResultData[i];
                        
                        $scope.property.value.showValue += modelValue.Name1 ;
                  
                } 
          
            $scope.updatePropertyInModel($scope.property);
            
            $scope.closeP();
        };
    
        $scope.cancel = function() {
            $scope.$hide();
            $scope.property.mode = 'read';
            $scope.property.value.refResultData=mycars;
            //jQuery("#moid").hide();
        };
        $scope.closeP=function(){
        	 $scope.$hide();
        	 $scope.property.mode = 'read';
            // jQuery("#moid").hide();
        }

}];


