'use strict';

angular.module('inspinia')
	.factory('localSearchService', function () {
        var dataModel = '';
        return {
            setData:function (data) {
                dataModel = data;
            },
            getData:function () {
                return dataModel;
            }
        };
    })
    .controller('NotificationTopnavbarController',NotificationTopnavbarController)
  
function NotificationTopnavbarController($scope,appSetting,$http,$localStorage,$sessionStorage, $window, $filter, notify, localSearchService,$state,$cookieStore,$translate){
	$scope.notification = {};
	$scope.notification.count = 0;
	$scope.notification.item = [];
	$scope.inspiniaTemplate = 'app/components/homepage/notify.html';
	
	$scope.localSearch = '';
	$scope.service = localSearchService;
	$scope.changeText = function(){
		localSearchService.setData($scope.localSearch);
	}
	$scope.$watch('service.getData()', function(textSearch) {
	    $scope.localSearch = textSearch;
	});
	var xSession = $cookieStore.get("cookieXsession");
	$http({
		url: appSetting.backEndClingMe+"notify/list?page=1",
		method: "GET", 
		headers: {
			'X-SESSION': xSession
		}
	}).success(function(data, status, headers, config){
		if(data.code != undefined){
           if(data.code == 1903 && data.msg == "session_expired"){
                $cookieStore.remove("cookieXsession");
                $state.go("homepage.login");return;
            }else if(data.code = 1806 && data.msg == "not_enter_verify_code_yet"){
            	$state.go("homepage.verify");
            	return;
            }else{
                var msg = $translate.instant(data.msg);
                notify({
                    message: msg,
                    classes: 'custom_notify', 
                    templateUrl: $scope.inspiniaTemplate
                });
                return;
            } 
        }
		$scope.notification.count = data.updated.notifyResponse.newNotifyNumber;
		for(var i = 0;i < data.updated.notifyResponse.lstNotification.length;i++){
			data.updated.notifyResponse.lstNotification[i].time = $filter('date')(data.updated.notifyResponse.lstNotification[i].createdTime * 1000, 'dd/MM/yyyy')
			if(data.updated.notifyResponse.lstNotification[i].icon == "")
				data.updated.notifyResponse.lstNotification[i].icon = "assets/images/user/user-default.png";
		}
		$scope.notification.item = data.updated.notifyResponse.lstNotification;
	});
	$scope.updateNotifyToRead = function(){
		var xSession = $cookieStore.get("cookieXsession");
		$http({
			url: appSetting.backEndClingMe+"notify/all-read",
			method: "GET", 
			headers: {
				'X-SESSION': xSession
			}
		}).success(function(data, status, headers, config){
			if(data.code != undefined){
               if(data.code == 1903 && data.msg == "session_expired"){
                    $cookieStore.remove("cookieXsession");
                    $state.go("homepage.login");return;
                }else if(data.code = 1806 && data.msg == "not_enter_verify_code_yet"){
	            	$state.go("homepage.verify");
	            	return;
	            }else{
                    var msg = $translate.instant(data.msg);
                    notify({
                        message: msg,
                        classes: 'custom_notify', 
                        templateUrl: $scope.inspiniaTemplate
                    });
                    return;
                } 
            }
			if(data == undefined)
				return false;
			if(data.updated.isSuccess)
				$scope.notification.count = 0;
		});

	}
	$scope.logout = function(){
		var url = appSetting.backEndClingMe+'logout';
		var xSession = $cookieStore.get("cookieXsession");            
		var promise = $http({
            url: url,
            method: 'GET',
            headers: {
                'X-SESSION': xSession
            }
        });
        promise.success(function(data, status, headers, config){
        	if(data.code != undefined){
        		$cookieStore.remove("cookieXsession");
                $state.go("homepage.login");return;
            }else if(data.updated.isLogout){
        		$cookieStore.remove("cookieXsession");
        		$state.go("homepage.login");return;
        	}
        });
	}
	$scope.changeLanguage = function(){
		if($translate.use() == 'en_US'){
			$translate.use('vi_VN');
			$cookieStore.put('lang', 'vi_VN');
		}else{
			$translate.use('en_US');
			$cookieStore.put('lang', 'en_US');
		}
		// $translate.use(($translate.use() === 'en_US') ? 'vi_VN' : 'en_US');
		$translate.refresh();
	}
	$scope.searchDealPlace = function(){	
		if($scope.localSearch == undefined || $scope.localSearch == ""){
			var msg = $translate.instant("Input info search");
            notify({
                message: msg,
                classes: 'custom_notify', 
                templateUrl: $scope.inspiniaTemplate
            });
			return;
		}
		$state.go('index.searchResult',{textSearch:$scope.localSearch});
	}
	
}