'use strict';

var app = angular.module('inspinia', ['pascalprecht.translate','ngAnimate', 'ngCookies', 'ngSanitize',
                             'ngResource', 'ui.router', 'ui.bootstrap', 
                             'oc.lazyLoad','angularFileUpload','ngMessages','ngStorage',
                             'angularUtils.directives.dirPagination','ngLocale','ngTouch'])
.service("appSetting",function () {
    this.appSetting = {
        "version": "@APP_VERSION",
        "port": "@APP_PORT",
        "backEndClingMe": "@APP_SERVICE"
    };
    return this.appSetting;
})  
.service('sharedProperties', function () {
    var item = {};
    return {
        getProperty: function () {
            return item;
        },
        setProperty: function(value) {
            item = value;
        }
    };
})

//http://datacenter.diadiemcuoi.vn/upload.php
app.config(function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider
        //redirect when url index.place.placeList
        .when('/index/setup', ['$state', function ($state) {
            $state.go('index.setupRestaurant.create-com');
        }])
        .when('/index/place/list', ['$state', function ($state) {
            // $state.go('index.place.placeList.listview');
            $state.go('index.place.placeList.gridview');
        }])
        .when('/index/invoice', ['$state', function ($state) {
            $state.go('index.invoice.invoicePaymentHistory');
        }])
        .otherwise('/index/dashboard')
        .otherwise('/homepage/index');
        
    $stateProvider
        .state('homepage', {
            abstract: true,
            url: "/homepage",
            controller: 'HomepageCtrl',
            templateUrl: "app/components/homepage/content.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'cgNotify',
                        files: ['../bower_components/angular-notify/angular-notify.css',
                            '../bower_components/angular-notify/angular-notify.js']
                    }])
                }
            }
        })
        .state('homepage.index', {
            url: "/index",
            //templateUrl: "app/components/homepage/index.html",
            //controller: 'HomepageCtrl',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                    {
                        files: ['../bower_components/angular-hac/css/animate.min.css',
                                '../bower_components/angular-hac/css/bootstrap.css',
                                '../bower_components/angular-hac/font-awesome/css/font-awesome.min.css',
                                '../bower_components/angular-hac/css/style.css',]
                    },
                    {
                        serie: true,
                        files: ['../bower_components/angular-hac/js/jquery-2.1.1.js',
                                '../bower_components/angular-hac/js/pace.min.js',
                                '../bower_components/angular-hac/js/bootstrap.min.js',
                                '../bower_components/angular-hac/js/classie.js',
                                '../bower_components/angular-hac/js/cbpAnimatedHeader.js',
                                '../bower_components/angular-hac/js/wow.min.js',
                                '../bower_components/angular-hac/js/wow.js']
                    }])
                }
            }
        })
        .state('homepage.place-list', {
            url: "/place-list",
            templateUrl: "app/components/homepage/place-list.html",
            controller: 'HomepageCtrl',
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        files: ['../bower_components/jquery/dist/jquery-ui.js']
                    },{
                        name: 'cgNotify',
                        files: ['../bower_components/angular-notify/angular-notify.css',
                            '../bower_components/angular-notify/angular-notify.js']
                    }, {
                       name: 'md5',
                       files: ['../bower_components/angular-md5/angular-md5.js']
                   }])
                }
            }
        })
        
        // .state('index', {
        //     abstract: true,
        //     url: "/index",
        //     templateUrl: "app/components/common/content.html",
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([{
        //                 name: 'cgNotify',
        //                 files: ['../bower_components/angular-notify/angular-notify.min.css',
        //                     '../bower_components/angular-notify/angular-notify.js']
        //             }])
        //         }
        //     }
        // })
        
});
// .run(function($rootScope, $state) {
//   $rootScope.$state = $state;
// });

//define filter
app.filter('cmdate', [
    '$filter', function($filter) {
        return function(input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
]);


app.filter('remainDate', [
    '$filter', function($filter) {
        return function(input, format) {
            var delta = Math.abs(new Date(input) - new Date()) / 1000;
            // calculate (and subtract) whole days
            var days = Math.floor(delta / 86400) + 1;
            return  days+ " ngày";
        };
    }
]);

app.filter('remainDateUnix', [
    '$filter', function($filter) {
        return function(input, format) {
            if(input * 1000 > new Date()){
                var delta = Math.abs(input * 1000 - new Date()) / 1000;
                // calculate (and subtract) whole days
                var days = Math.floor(delta / 86400) + 1;
                return  days + " ngày";
            }else{
                return "0 ngày";
            }
            
        };
    }
]);

//

app.filter('absValue',[
    '$filter', function($filter) {
        return function(val) {
            var value = Math.round(Math.abs(val) * 100) / 100;
            if(value >= 0 && value < 1){
                value = $filter('formatDecimal')($filter('number')(value,2));
            }else if(value < 1000){
                // value = $filter('number')(value,2);
                value = $filter('formatDecimal')($filter('number')(value,2));
            }else{
                value = $filter('formatMoney')($filter('number')(value,0));
            }       
            return value;
        };
    }
]);

app.filter('formatMoney', function () {
  return function(val) {
    if(val != undefined)
        return val.replace(/\,/g,".");
    }
});

app.filter('formatDecimal', function () {
  return function(val) {
    if(val != undefined)
        return val.replace(/\./g,",");
    }
});

app.filter('formatPrecent', function () {
  return function(val) {
    if(val != undefined)
        return val.replace(/\./g,",");
  }
});

app.filter('trusthtml', ['$sce', function ($sce) {
    return function(t) {
        return $sce.trustAsHtml(t)
    }
}]);
app.run(function ($rootScope, $state, $timeout, $interval, appSetting, $http, $modalStack, $cookieStore) {
    /*var poll = $interval(function(){
        var url = appSetting.backEndClingMe+'account/info';
        var xSession = sessionStorage.xSession;
        var promise = $http({
            url: url,
            method: 'GET',
            headers: {
                'X-SESSION': xSession
            }
        });
        promise.then(function(data, status, headers, config){
            if(data.data.code == 1909){
                delete sessionStorage.xSession;
                $state.transitionTo("homepage.login");
            }
        });
    }, 10000);*/
    
    $rootScope.closeSideBar = function(){
        if($(event.target).closest('.table').length == 0 && $(event.target).closest('.allow-scroll').length == 0){
            if(angular.element('body').hasClass('mini-navbar')){
                angular.element('body').toggleClass('mini-navbar');
                if(!angular.element('.nav.cling-me-side-bar').hasClass('hide-menu')){
                    angular.element('.nav.cling-me-side-bar').toggleClass('hide-menu');
                }
            }
        }
    }
    $rootScope.openSideBar = function(event){
        if($(event.target).closest('.table').length == 0 && $(event.target).closest('.allow-scroll').length == 0){
            if(!angular.element('body').hasClass('mini-navbar')){
                angular.element('body').toggleClass('mini-navbar');
                if(angular.element('.nav.cling-me-side-bar').hasClass('hide-menu')){
                    angular.element('.nav.cling-me-side-bar').toggleClass('hide-menu');
                }
            }
        }
    }
    // $interval.cancel(poll);
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
        $modalStack.dismissAll();
        if(angular.element('body').hasClass('mini-navbar')){
            angular.element('body').toggleClass('mini-navbar');
            if(!angular.element('.nav.cling-me-side-bar').hasClass('hide-menu')){
                angular.element('.nav.cling-me-side-bar').toggleClass('hide-menu');
            }
        }
        if(toState.name.indexOf('homepage.') != -1){
            // $interval.cancel(poll);
        }
        if(toState.name === 'homepage.login' && $cookieStore.get("cookieXsession") !== undefined){
            $http({
                url: appSetting.backEndClingMe+'account/info',
                method: 'GET',
                headers: {
                    'X-SESSION': $cookieStore.get("cookieXsession")
                }
            }).success(function(data,status,headers,config){
               if(data.code == 1806 && data.msg == "not_enter_verify_code_yet"){
                   $cookieStore.remove("cookieXsession"); 
                   $state.transitionTo("index.login");
               }else{
                    $state.transitionTo("index.dashboard");
               }
            });
            
            event.preventDefault();
        }
        else if(toState.name.indexOf('index.') != -1 && $cookieStore.get("cookieXsession") === undefined){
            // User isn’t authenticated
            $state.transitionTo("homepage.login");
            event.preventDefault();
        }
    });
});
app.controller('routerApi', routerAjaxApi);

function routerAjaxApi(scope, DTOptionsBuilder, requestType, action, method,url, compile, completeFn,ajaxCallType,http,$filter,$cookieStore){
    if(ajaxCallType == 'read'){
        var startDate =  '';
        var endDate = '';
        if(scope.tbl.startDate != undefined && scope.tbl.startDate != '' && scope.tbl.endDate != ''){
            startDate =  $filter('date')(scope.tbl.startDate._d, 'dd/MM/yyyy');
            endDate = $filter('date')(scope.tbl.endDate._d, 'dd/MM/yyyy');
        }
        var xSession = $cookieStore.get("cookieXsession");
        return DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: url,
            type: requestType,
            data: {
                action:action,
                method:method,
                length:scope.tbl.length,
                startDate:startDate,
                endDate :endDate              
            },
            complete: completeFn,
            headers: { "X-SESSION": xSession }
        })
        .withLanguage({
            "sLengthMenu":     "_MENU_ số bản nghi",
            "sLoadingRecords": "Loading ...",
            "sProcessing":     "đang xử lý...",
            "oPaginate": {
                "sFirst":    "Đầu tiên",
                "sLast":     "Cuối cùng",
                "sNext":     "Tiếp",
                "sPrevious": "Trước"
            },
            "sInfo": "Hiển thị _START_ to _END_ of _TOTAL_ kết quả",
            "sInfoEmpty": $translate.instant('table_controls_sInfoEmpty')
        })
        .withOption("lengthMenu", [ [5, 10, 15], [5, 10, 15] ])
        .withDataProp('results.data')
        .withOption('processing', true)             
        .withPaginationType('full_numbers')
        .withOption('searching',false)
        .withOption('stateSave', true)
        .withOption('order', [0, 'desc'])
        //bind data to scope
        .withOption('fnRowCallback',
            function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                compile(nRow)(scope);
                $('td', nRow).unbind('click');
                $('td', nRow).bind('click', function() {
                    scope.$apply(function() {
                        scope.openPopUp(aData);
                    });
                })
                return nRow;

        });
        /*.withOption('rowCallback', function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            console.log('12');
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function() {
                scope.$apply(function() {
                    //vm.someClickHandler(aData);
                    console.log(aData);
                });
            })
            return nRow;
        });*/
        //.withOption('initComplete', function(settings) {
            // Recompiling so we can bind Angular directive to the DT
            //console.log(angular.element('#' + settings.sTableId).contents());
        //    compile(angular.element('#' + settings.sTableId).contents())(scope);
        //});
    }else{
        var parametter = scope.item;
        if(ajaxCallType == 'filter'){
            parametter = {
                            name: scope.term,
                            district: scope.district,
                            menuId : scope.item.id
                        };
        }else if(ajaxCallType == 'callBackServer'){
            parametter = {
                            value: scope.value
                        };
        }else if(ajaxCallType == 'verify'){
            parametter = {
                            value: scope
                        };
        }
        var params = $.param({
                        action:action,
                        method:method,
                        object : parametter
                    });

        var promise = http.post(url, params,{headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }});
        return promise;
    }
    
}



app.controller('routerApiClingMe', routerApiClingMe);

function routerApiClingMe($translate, scope, DTOptionsBuilder, requestType, url, compile, completeFn,ajaxCallType,$sessionStorage,pathData,$cookieStore){
    
    if(ajaxCallType == 'get'){
        var xSession = $cookieStore.get("cookieXsession");
        return DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: url,
            type: requestType,
            complete: completeFn,
            headers: { "X-SESSION": xSession }
        })
        .withLanguage({
            "sEmptyTable": $translate.instant("No data available in table"),
            "sLengthMenu": $translate.instant('table_controls_sLengthMenu'),
            "sLoadingRecords": $translate.instant('table_controls_sLoadingRecords'),
            "sProcessing": $translate.instant('table_controls_sProcessing'),
            "oPaginate": {
                "sFirst":$translate.instant('table_controls_sFirst'),
                "sLast": $translate.instant('table_controls_sLast'),
                "sNext": $translate.instant('table_controls_sNext'),
                "sPrevious": $translate.instant('table_controls_sPrevious'),
            },
            "sInfo": $translate.instant('table_controls_sInfo'),
            "sInfoEmpty": $translate.instant('table_controls_sInfoEmpty')
        })
        .withDataProp(pathData)
        .withOption("lengthMenu", [ [5, 10, 15], [5, 10, 15] ])
        .withOption('processing', false)             
        .withPaginationType('simple_numbers')
        .withOption('searching',true)
        .withOption('stateSave', false)
        // .withOption('order', [0, 'desc'])
        .withOption('bSort', false)
        // .withOption('order', false)
        .withOption('headerCallback', function (thead, data, start, end, display) {
            if(data.length > 0){
                $('.hover-btn-delete').unbind('click');
                compile(angular.element(thead).contents())(scope);
            }
        })
        //bind data to scope
        .withOption('fnRowCallback',
            function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                compile(nRow)(scope);
                $('td', nRow).unbind('click');
                return nRow;
        });
    }
    
}
