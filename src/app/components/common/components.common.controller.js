'use strict';

angular.module('inspinia')
	.controller('getAvatar', getAvatar)
  	.controller('CommonCtrl', function ($scope, appSetting, $http,$cookieStore,$state) {
		$scope.records = [];
	    $scope.totalRecords = 0;
	    $scope.recordsPerPage = 2;
	    $scope.pagination = {
	        current: 1
	    };
	    $scope.searching = "";
	    /* auto-complete address */
	    $scope.selectedAddress = '';
		$scope.getAddress = function(viewValue) {
			var params = {address: viewValue, sensor: false};
			return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params})
				.then(function(res) {
					return res.data.results;
				});
		};
  		
  		$scope.getData = function(pageNumber) {
	    	var start = $scope.records.length * (pageNumber-1);
	    	
			var url = appSetting.backEnd;
			var params = $.param({
	                        action:'ClingmeViewController',
	                        method:'getListInvoice',
	                        page: pageNumber,
	                        start: start,
	                        limit: $scope.recordsPerPage,
	                        keyword: $scope.searching
		                });
	        var promise = $http.post(url, params,{headers: {
	                        'Content-Type': 'application/x-www-form-urlencoded'
	                    }});
	        promise.success(function(data, status, headers, config){
				$scope.hide_field_search = "visibility:hidden;";
				$scope.show_results = "visibility:visible;";
				$scope.records = data.data;
				$scope.totalRecords = data.length;
				$scope.totalPage = Math.ceil($scope.totalRecords/$scope.recordsPerPage);
	       	});
		};
		$scope.search = function() {
			$scope.pagination = {
		        current: 1
		    };
		    $scope.searching = $scope.keyword;
			$scope.getData(1);
		};
		$scope.pageChangeHandler = function(newPageNumber){
			$scope.getData(newPageNumber);
		}
    });
function getAvatar($scope, appSetting ,$localStorage,$sessionStorage, $http, $rootScope, $cookieStore,$state){
	$scope.avatar = "assets/images/user/user-default.png";	
	$rootScope.$on('setAvatar', function(event, args) {
		$scope.avatar = args;

	});
	$scope.userName = 'user';
	$http({
        url: appSetting.backEndClingMe+"account/info",
        headers: {"X-SESSION": $cookieStore.get("cookieXsession")},
        method: "GET"
    }).success(function(data, status, headers, config){
    	if(data.code != undefined && data.msg == "session_expired"){
    		$cookieStore.remove("cookieXsession");
            $state.go("homepage.login");return;
    	}else if(data.code = 1806 && data.msg == "not_enter_verify_code_yet"){
        	$state.go("homepage.verify");
        	return;
        }
        if(data.updated.account.avatar != ""){
           $scope.avatar = data.updated.account.avatar;
        }
        if(data.updated.account.fullName != "")
        	$scope.userName = data.updated.account.fullName;
        
    });
   $scope.notificationCount = 0;
    $http({
        url: appSetting.backEndClingMe+"notify/list?page=1",
        method: "GET", 
        headers: {
            'X-SESSION': $cookieStore.get("cookieXsession")
        }
    }).success(function(data, status, headers, config){
        if(data.code != undefined){
           if(data.code == 1903 && data.msg == "session_expired"){
                $cookieStore.remove("cookieXsession");
                $state.go("homepage.login");return;
            }else if(data.code = 1806 && data.msg == "not_enter_verify_code_yet"){
            	$state.go("homepage.verify");
            	return;
            }
        }
        $scope.notificationCount = data.updated.notifyResponse.newNotifyNumber;
        
    });
}