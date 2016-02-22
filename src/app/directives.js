'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('inspinia')
    .directive('generateSelectTooltip', ['$log', '$templateCache', '$compile', function($log, $templateCache, $compile) {
      return {
        restrict: 'A',
        priority: 1000,

        link: function(scope, element, attr) {
                element.children().attr('data-toggle', 'place.name');
                element.children().attr('data-placement', 'place.name');
                element.children().attr('title', 'hello tool tip');

          $compile(element)(scope);
        },
      };
    }])
    //focus to menu
    .directive("scroll", function ($window) {
        return function(scope, element, attrs) {
            angular.element($window).bind("scroll", function() {
                var $element = angular.element(element);
                var sectorDiv = $element.find('section')
                //get scroll position add 300 for showing soon
                var scrollPos = $window.pageYOffset+200;
                angular.forEach( sectorDiv , function( sElement , i ) {
                    var refElement = $(sElement);
                    //active menu if this session + heigh < scroll position
                    //not if want to access element must use $($element.find('id'))
                    if(refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos){
                        $element.find('div#navbar ul li').removeClass('active');
                        $($element.find('div#navbar ul li')[i]).addClass('active');
                    }
                });
            });
        };
    })
    .directive('widthTopFormSearch',function($window){
        return function(scope,element){
            if(angular.element(window).width() >= 768){
                $(".only-mobile").hide();
                var widthTopForm = $(".navbar-static-top").width() - $(".navbar-top-links.navbar-right").width() - 10;
                angular.element(".navbar-header").width(widthTopForm);
                angular.element(".navbar-form-custom").width(widthTopForm-88);
                angular.element(".navbar-form-custom >.form-group >.input-group").css("width", "100%");    
            }else{
                $(".only-pc").hide();
                var widthTopForm = $(".navbar-static-top").width() - $(".menu-on-mobile").width() - 21;
                angular.element(".navbar-header").width(widthTopForm);
                angular.element(".navbar-form-custom").width(widthTopForm-88);
                angular.element(".navbar-form-custom >.form-group >.input-group").css("width", "100%");    
            }
            
        }
    })
    .directive('countKnobScore', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, modelCtrl) {
                var allKnobEl = angular.element(document.querySelectorAll("[data-knobscore]"));
                for(var i = 0; i < allKnobEl.length; i++){
                    $(allKnobEl[i]).attr("data-oldvalue", "");
                    $(allKnobEl[i]).bind('change', function() {
                        if(this.value.replace(/\s+/g, '') != "" && this.attributes['data-oldvalue'].value == ""){
                            scope.knobScore += parseFloat(this.attributes['data-knobscore'].value);
                            $('.percentComplete').val(scope.knobScore).trigger('change');
                        }
                        else if(this.attributes['data-oldvalue'].value != this.value && this.value.replace(/\s+/g, '') == ""){
                            scope.knobScore -= parseFloat(this.attributes['data-knobscore'].value);
                            $('.percentComplete').val(scope.knobScore).trigger('change');   

                        }
                        this.attributes["data-oldvalue"].value = this.value;

                    });
                }
            }
        };
    })
    .directive('selectOnClick', ['$window', function ($window) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    if (!$window.getSelection().toString()) {
                        // Required for mobile Safari
                        this.setSelectionRange(0, this.value.length)
                    }
                });
            }
        };
    }])
    .directive('resize', function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    })
    .directive('customValidation', function(){
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if(attrs.validatetype === "number"){
                        var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
                    }
                    else if(attrs.validatetype === "creditcard"){
                        element.bind("keydown", function (e) {
                            // Allow: backspace, delete, tab, escape, enter
                            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
                                 // Allow: Ctrl+A, Command+A
                                (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
                                 // Allow: home, end, left, right, down, up
                                (e.keyCode >= 35 && e.keyCode <= 40)) {
                                     // let it happen, don't do anything
                                     return;
                            }
                            // Ensure that it is a number and stop the keypress
                            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                                e.preventDefault();
                            }
                        });
                        var transformedInput = inputValue.replace(/[^0-9]/g, '').replace(/(\d{4}(?!\s))/g, '$1 '); 
                    }
                    else if(attrs.validatetype === "text-symbol"){
                        var transformedInput = inputValue.replace(/[^a-zA-Z0-9]/g, ''); 
                    }
                    else if(attrs.validatetype === "emailphone"){
                        var transformedInput = inputValue.replace(/[^a-z@.0-9]/g, ''); 
                    }
                    else if(attrs.validatetype === "email"){
                        var transformedInput = inputValue.replace(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i, ''); 
                    }
                    else if(attrs.validatetype === "month"){
                        var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    }
                    else{
                        var transformedInput = inputValue;
                    }
                    if(transformedInput.length > parseInt(attrs.validatelen))
                        transformedInput = transformedInput.substr(0,parseInt(attrs.validatelen));
                    if(attrs.validatemin != undefined && parseInt(transformedInput) < parseInt(attrs.validatemin))
                        transformedInput = attrs.validatemin;
                    if(attrs.validatemax != undefined && parseInt(transformedInput) > parseInt(attrs.validatemax))
                        transformedInput = attrs.validatemax;
                    if (transformedInput!=inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }         
                    return transformedInput;         
                });
            }
        };
    })
    .directive('customStartDateValidator', function($q) {
        return {
            require : 'ngModel',
            link : function($scope, $attr, $elem, ctrl) {
                ctrl.$validators.customStartDateValidator = function(value) {
                    var d = new Date();
                    var validDate = d.setDate(d.getDate()-1);
                    if(value._i > validDate){
                        return true;
                    }
                    return false;    
                };
            }
        }
    })
    .directive('customEndDateValidator', function($q) {
        return {
            require : 'ngModel',
            scope: {
                otherModelValue: "=customEndDateValidator"
              },
            link : function($scope, $attr, $elem, ctrl) {
                ctrl.$validators.customEndDateValidator = function(value) {
                    return false;    
                };

                scope.$watch("otherModelValue", function() {
                    ngModel.$validate();
                });
            }
        }
    })
    .directive('sideNavigation', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function() {
                    $timeout(function() {
                        element.metisMenu();
                    });
                });
            }
        };
    })
    .directive('minimalizaSidebar', function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2" href="" ng-click="minimalize()"><img src="assets/images/icon/nav-button.png"></img></a>',
            controller: function ($scope, $element) {
                $scope.minimalize = function () {
                    if(angular.element('.nav.cling-me-side-bar').hasClass('hide-menu')){
                        angular.element('.nav.cling-me-side-bar').toggleClass('hide-menu');
                    }
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(500);
                        }, 100);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }
        };
    })
    .directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //alert('image is loaded');
                });
                element.bind('error', function(){
                    element.prop('src', 'assets/images/level-sort/notFound.png');
                });
            }
        };
    })
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;
                
                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }])
    .service('fileUpload', ['$http', function ($http) {
        this.uploadFileToUrl = function(file, uploadUrl){
            var fd = new FormData();
            fd.append('file', file);
            $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            .success(function(){
            })
            .error(function(){
            });
        }
    }])
    .directive('uploadedImage', function(){
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                element.bind('load', function() {
                    var width = element.context.clientWidth;
                    element.parent().next().css("width", parseInt(width)+"px");
                });
            }
        };
    })
    //load preview img
    .directive('ngThumb', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };

        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;
                var params = scope.$eval(attributes.ngThumb);

                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    element.css("width", parseInt(width)+"px");
                    element.next().css("width", parseInt(width)+"px");
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }
            }
        };
    }])
    .directive('ngThumbPreview', ['$window', function($window) {
        var helper = {
            support: !!($window.FileReader && $window.CanvasRenderingContext2D),
            isFile: function(item) {
                return angular.isObject(item) && item instanceof $window.File;
            },
            isImage: function(file) {
                var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        };
        return {
            restrict: 'A',
            template: '<canvas/>',
            link: function(scope, element, attributes) {
                if (!helper.support) return;
                var params = scope.$eval(attributes.ngThumbPreview);
                if (!helper.isFile(params.file)) return;
                if (!helper.isImage(params.file)) return;

                var canvas = element.find('canvas');
                var reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }
                function onLoadImage() {
                    var width = params.width || this.width / this.height * params.height;
                    var height = params.height || this.height / this.width * params.width;
                    element.css("width", parseInt(width)+"px");
                    element.next().css("width", parseInt(width)+"px");
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                    scope.$parent.totalImage--;
                    if(scope.$parent.totalImage === scope.$parent.prevTotalImage){
                        scope.$parent.prevTotalImage = scope.$parent.totalImage = params.queuedLen;
                        if(attributes.noofitem === undefined){
                            $(".carousel").owlCarousel({
                                margin:10,
                                nav:true,
                                navText: [
                                    "<i class='icon icon-back'></i>","<i class='icon icon-foward'></i>"
                                ]
                            });
                        }
                        else{
                            $(".carousel").owlCarousel({
                                margin:10,
                                nav:true,
                                items: attributes.noofitem,
                                autoWidth:true,
                                navText: [
                                    "<i class='icon icon-back'></i>","<i class='icon icon-foward'></i>"
                                ]
                            });
                        }
                    }
                }
            }
        };
    }])
    // focus to first invalid field
    .directive( 'customSubmit' , function()
    {
        return {
            restrict: 'A',
            link: function( scope , element , attributes )
            {
                var $element = angular.element(element);
                // Add novalidate to the form element.
                attributes.$set( 'novalidate' , 'novalidate' );
                $element.bind( 'submit' , function( e ) {
                    e.preventDefault();
                    // Remove the class pristine from all form elements.
                    $element.find( '.ng-pristine' ).removeClass( 'ng-pristine' );
                    
                    // Get the form object.
                    var form = scope[ attributes.name ];
                    
                    // Set all the fields to dirty and apply the changes on the scope so that
                    // validation errors are shown on submit only.
                    angular.forEach( form , function( formElement , fieldName ) {
                        // If the fieldname starts with a '$' sign, it means it's an Angular
                        // property or function. Skip those items.
                        if ( fieldName[0] === '$' ) return;
                        
                        formElement.$pristine = false;
                        formElement.$dirty = true;
                    });
                    
                    // Do not continue if the form is invalid.
                    if ( form.$invalid ) {
                        // Focus on the first field that is invalid.
                        if($element.find( '.ng-invalid' ).first()[0] == undefined)
                            return;
                        var style = $element.find( '.ng-invalid' ).first()[0].getAttribute("style");
                        if(style == null || style != 'display:none'){
                            //$element.find( '.ng-invalid' ).first().blur();
                            //console.log($element.find( ':focus' ));
                            var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
                            if(isSafari){
                                $('html, body').animate({
                                    scrollTop: $element.find( '.ng-invalid' ).first().offset().top - 100
                                }, 2000, function(){
                                    $element.find( '.ng-invalid' ).first().focus();
                                });
                            }else{
                                $element.find( '.ng-invalid' ).first().focus();
                            }
                            
                            // $element.find( '.ng-invalid' ).first().focus();
                            //$element.find( '.ng-invalid' ).first().$setTouched();
                            //console.log($element.find( '.ng-invalid' ).first());
                            // $timeout(function() {
                            //     //element.metisMenu();
                            //     $element.find( '.ng-invalid' ).first().focus();
                            // },500);
                            //console.log($element.find( '.ng-invalid' ).first().click());
                        }else{
                            //display:none
                            //console.log($element.find( '#div_exclusivity' ).find( 'button' ));
                            $element.find( '#div_exclusivity' ).find( 'button' ).trigger('click');
                        }
                        return false;
                    }
                    // From this point and below, we can assume that the form is valid.
                    scope.$eval( attributes.customSubmit );
                    scope.$apply();
                });
            }
        };
    })
    //valid db Name
    .directive('recordAvailabilityValidator',
      ['$http','appSetting','$controller', function($http,appSetting,$controller) {
      return {
        require : 'ngModel',
        link : function(scope, element, attrs, ngModel) {
            var apiUrl = attrs.recordAvailabilityValidator;
            var array = apiUrl.split('/');
            var apiAction = array[0];
            var apiMethod = array[1];
            function setAsLoading(bool) {
               ngModel.$setValidity('recordLoading', !bool); 
            }

            function setAsAvailable(bool) {
              ngModel.$setValidity('recordAvailable', bool); 
            }

            ngModel.$parsers.push(function(value) {
                if(!value || value.length < 5) return;
                //blur keyup change
                element.on('blur', function() {
                    setAsLoading(true);
                    setAsAvailable(false);
                    var url = appSetting.backEnd;
                    var promise = $controller('routerApi', 
                    {
                        scope: value,
                        DTOptionsBuilder: null,
                        requestType: 'POST',
                        action: apiAction+'ViewController',
                        method: apiMethod,
                        url: url,
                        compile:null,
                        completeFn: null,
                        ajaxCallType:"verify",
                        http: $http
                    });
                    promise.success(function(response, status, headers, config){ 
                        if(response.data.exits){
                            setAsLoading(false);
                            setAsAvailable(false);
                        }else{
                            setAsLoading(false);
                            setAsAvailable(true);   
                        }
                    })
                    .error(function() {
                        setAsLoading(false);
                        setAsAvailable(false);
                    }); 
                });
            return value;
          })
        }
      }
    }])
    .directive('stringToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {                
                ngModel.$parsers.push(function(value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function(value) {
                    return parseFloat(value, 10);
              });
            }
        };
    })
    .directive("compareTo", function(){
        return {
          require: "ngModel",
          scope: {
            otherModelValue: "=compareTo"
          },
          link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
              return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
              ngModel.$validate();
            });
          }
        };
    })
    .directive('uploadAvatar', function () {
        return {
          restrict: 'A',
          link: function(scope, element) {
            element.bind('click', function(e) {
                element.next().trigger('click');
                e.preventDefault();
            });
          }
        };
    })
    .directive('uploadfile', function () {
        return {
          restrict: 'A',
          link: function(scope, element) {
            element.bind('click', function(e) {
                element.next().trigger('click');
            });
          }
        };
    })
    .directive('icheck', function icheck($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-custom',
                        radioClass: 'iradio_square-custom'

                    }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    })
    .directive('icheckInspinia', function icheck($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function($scope, element, $attrs, ngModel) {
                return $timeout(function() {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function(newValue){
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green'

                    }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    })
    //star rating 
    .directive('starRating', function () {
        return {
            restrict: 'A',
            template: '<span ng-repeat="star in stars">'+
                '<span ng-if="star.filled == true" class="fa text-warning fa-star"></span>'+
                '<span ng-if="star.filled == false && star.halffilled == false" class="fa text-warning fa-star-o"></span>'+
                '<span ng-if="star.filled == false && star.halffilled == true" class="fa text-warning fa-star-half-o"></span>'+
                '</span>',
            scope: {
                ratingValue: '@',
                max: '='
            },
            link: function (scope, elem, attrs) {
                scope.$watch('ratingValue', function(){
                    scope.stars = [];
                    for (var i=0;i<scope.max;i++){
                        if(scope.ratingValue % 1 == 0){
                            if(i<scope.ratingValue){
                                scope.stars.push({filled: true, halffilled: false});    
                            }else{
                                scope.stars.push({filled: false, halffilled: false});    
                            }
                        }else{
                            if(i<(scope.ratingValue-1)){
                                scope.stars.push({filled: true, halffilled: false});
                            }else{
                                if(scope.ratingValue % 1 == 0){
                                    scope.stars.push({filled: false, halffilled: false});
                                }else{
                                    if(i == (Math.ceil(scope.ratingValue)-1)){
                                        scope.stars.push({filled: false, halffilled: true});
                                    }
                                    else
                                        scope.stars.push({filled: false, halffilled: false});
                                }
                            }  
                        }
                    }
                });
            }
        }
    })
    .directive('currencyInput', function ($filter) {
        'use strict';
        return {
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                if (!ctrl) {
                    return;
                }

                ctrl.$formatters.unshift(function () {
                    return $filter('currency')(ctrl.$modelValue);
                });

                ctrl.$parsers.unshift(function (viewValue) {
                    var plainNumber = viewValue.replace(/[\,\.]/g, ''),
                        b = $filter('number')(plainNumber);

                    elem.val(b);

                    return plainNumber;
                });
            }
        };
    })
    .directive('googleplace', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: {}
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    scope.$apply(function() {
                        model.$setViewValue(element.val());                
                    });
                });
            }
        };
    })
    .directive('disableNgAnimate', ['$animate', function($animate) {
        return {
            restrict: 'A',
            link: function(scope, element) {
            $animate.enabled(false, element);
            }
        };
    }])
    .directive("scrollForMobile", function ($window) {
        return function(scope, element, attrs) {
            var $element = angular.element(element);
            angular.element($window).bind("scroll", function() {
                if (this.pageYOffset >= 350 && $window.innerWidth < 768) {
                    $element.find( '.ng-invalid' ).first().blur();
                }
                scope.$apply();
            });
        };
    });


