/*angular.module("getParamNameApp", []) .controller("KisBpmGetParamNameCtrl", function ($scope) {
        //J1 这里我们在作用域里初始化两个变量
    $scope.name = "dreamapple";
    $scope.age = 20;
        //J2 创建一个方法，修改我们创建的对象的年龄
    $scope.changeAge = function () {
        $scope.age = 22;
    }
})*/


var KisBpmGetParamNameCtrl_p = ['$scope', function($scope) {
    
    $scope.saveP = function() {};

    $scope.closeP = function() {
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
    
    
  
    
}];