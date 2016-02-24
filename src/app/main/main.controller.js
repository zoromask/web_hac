'use strict';

angular.module('inspinia')
  .controller('MainCtrl', function ($scope, appSetting, $http,$localStorage,$sessionStorage,$cookieStore) {
        this.helloText = 'Welcome in INSPINIA Gulp SeedProject';
        this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects.';
		$scope.$on('updateAvatar', function () {
			$scope.avatar = appSetting.avatar;
	    });
    });
