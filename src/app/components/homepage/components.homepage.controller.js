'use strict';

angular.module('inspinia')
	.factory('homepageModel', function () {
        var dataModel = {};
        return {
            setData:function (data) {
                dataModel = data;
            },
            getData:function () {
                return dataModel;
            }
        };
    })
  	.controller('HomepageCtrl', function ($translate, $timeout, $location, $scope, appSetting, $modal, $cookieStore, $localStorage, $filter,$state, $anchorScroll) {
		$scope.activeLink = 'page-top';
        $scope.scrollTo = function(id) {
            //console.log(id);
            $scope.activeLink = id;
            $location.hash(id);
            $anchorScroll();
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

        //function scroll to position
        $scope.scrollToId = function(eID) {
            // This scrolling function 
            // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
            
            var startY = $scope.currentYPosition();
            var stopY = $scope.elmYPosition(eID) - 50;
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                $scope.scrollToId(0, stopY); return;
            }
            //more geater more slower
            var speed = Math.round(distance / 100);
            //if (speed >= 20) speed = 20;
            speed = 30;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for ( var i=startY; i<stopY; i+=step ) {
                    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for ( var i=startY; i>stopY; i-=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }
        }

        $scope.currentYPosition = function() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
            
        $scope.elmYPosition = function(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }
    })
	.controller('ModalInstanceController', function ($modalInstance,$scope){
		$scope.closeModal = function(){
	    	$modalInstance.dismiss('cancel');
	    }
	});
