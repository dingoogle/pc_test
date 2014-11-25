
app.directive('pcHeader', function($window){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "views/tmpl_header.html",
		link: function(scope, element, attrs){

		}
	}
});

app.directive('pcMenu', function($window, $rootScope, $location){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "views/tmpl_menu.html",
		link: function(scope, element, attrs){
			scope.toggleMenu = function(){
				$rootScope.isMenuOut = !scope.isMenuOut;
			};
			scope.navigateTo = function(url){	
				
				$rootScope.isMenuOut = false;
				$location.path(url);		
			};
			scope.logout = function(){
				console.log("logout!!");
				$rootScope.isLoggedIn = false;
				$rootScope.isMenuOut = false;
				$location.path("/login");
			};
		}
	}
});

app.directive('pcFooter', function(){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "views/tmpl_footer.html"
	}
});

app.directive('pcTimeRule', function(){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "views/tmpl_time_rule.html",
		link: function(scope, element, attrs){
			eval("var obj = " + attrs.timerule);
			scope.timerule = obj;
			scope.editTimeRule = function(){
			
			}
			scope.deleteTimeRule = function(){
			
			}
		}
	}
});

app.directive('pcLogin', function($location, $rootScope, authenticationService, profileService){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "views/tmpl_login.html",
		link: function(scope, element, attrs){
			scope.currentStep = attrs.currentstep || 0;
			scope.finishedStep = attrs.finishedstep || 0;
			
			scope.signIn = function(event){
				var em = element[0].email.value,
				ps = element[0].password.value;
				if(!em || !ps){
					scope.hasError = true;					
					return;
				}
				authenticationService.login(em,ps).then(function(data){
					if(useDummy){
						scope.hasError = false;
						$rootScope.isLoggedIn = true;
						$location.path("/dashboard");
						return;										
					}
					
					if(data && data.Logonflag == '1' ){				
						
					}
					else{
						scope.hasError = true;
					}
				});
			}
		}
	}
});


app.directive('pcRegister', function($location, authenticationService){
	return {
		restrict: "E",
		replace: true,
		templateUrl: "views/tmpl_register.html",
		link: function(scope, element, attrs){
			scope.hasError = false;
			scope.createAccount = function(event){
				var em = element[0].email.value,
				ps = element[0].password.value,
				fn = element[0].firstName.value,
				ln = element[0].lastName.value,
				tnc = element[0].tnc.checked;
				if(!em || !ps || !fn || !ln || !tnc){
					scope.hasError = true;
					return;
				}
				authenticationService.register(fn, ln, em, ps).then(function(data){
					if(useDummy){
						scope.hasError = false;
						$location.path("/createDevice");
						return;
					}
					scope.hasError = true;					
				});
			}
		}
	}
});


app.directive("pcSteps", function(){
	return {
		restrict: "EA",
		replace: true,
		templateUrl: 'views/tmpl_steps.html',
		link: function(scope, element, attrs){
			scope.currentStep = attrs.currentstep || 0;
			scope.finishedStep = attrs.finishedstep || 0;
		}
	}
});

app.directive("datePicker", function(){
	return {
		restrict: "EA",
		replace: true,
		template: '<input type="text" placeholder="{{placeHolder}}" required="required"/>',
		link: function(scope, element, attrs){
			scope.placeHolder = attrs.placeholder || "";
			element.bind("touchend", function(){
				element.attr("type","date");
				element[0].focus();
			});
			element.bind("blur", function(){
				element.attr("type","text");
			});
		}
	}
})


app.directive("adjacent", function(){
	return {
		restrict: "EA",
		replace: true,
		transclude: true,
		scope: {
			direction: '@',
			onAdjacent: '&',
			//onNext: '&'
		},
		template: "<div ng-transclude ng-click='onAdjacent(evt)' class='adjacent {{direction}} '></div>",
		link: function(scope, element, attrs){
			var dir = attrs.direction.toLowerCase() == "next"?1:-1;
			function adjacentTo(){
			}
			//element.bind('click', adjacentTo);
		},
		controller: function($scope) {}
	}
});

app.directive("whatIsIt", function( $rootScope ){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			function openDialog() {
				$rootScope.showHelpPane = true;
				$rootScope.$apply();
			};			
			element.bind('click', openDialog);
		}
	}
});


app.directive("helpPane", function($rootScope){
	return {
		restrict: "EA",
		replace: true,
		templateUrl: 'views/tmpl_whatisit.html',
		link: function(scope, element, attrs){
			function closeDialog(){
				$rootScope.showHelpPane = false;
				if(!$rootScope.$$phase) {
					$rootScope.$apply();
				}
			}
			element.bind('click', closeDialog);
			var el = element[0];
			//if(isIE8Browser()){
			$rootScope.$watch('sheetPos', function(newVal){	
				// for the shit of ie8			
				if(!newVal || !newVal.x)
					return;
				angular.element(el.querySelector('.horizontalRuler')).css({
					"left": newVal.x + "px",
					top: (newVal.y+10) + "px",
					width: newVal.w + "px"
				});
				
				angular.element(el.querySelector('.verticalRuler')).css({
					left:(newVal.x < 32 ? newVal.x: newVal.x - 32) + 'px',
					top: (newVal.y + 92) + 'px',
					height: '76px'
				});
			
				angular.element(el.querySelector('.verticalArrow')).css({
					left:(newVal.x < 32?newVal.x: newVal.x - 32) + 'px',
					top: (newVal.y + 180) + 'px',
					height: '400px'
				});				
				
				angular.element(el.querySelector('.helpInfo')).css({
					left:(newVal.x + 50)+'px',
					width: (newVal.w - 100) + "px",
					top:(newVal.y + newVal.h/3)+'px'
				});		
								
			});
			//}
			scope.$on('$destroy', function (){
				// destroy radar chart
				$rootScope.sheetPos = null;
			});
		}
	}
});

app.directive("careerItem", function( $modal, $log, careerItemService){
	return {
		restrict: "A",		
		link: function(scope, element, attrs){
			function openDialog() {
				if(element.attr("clickable") != "true")
					return;
				var modalInstance = $modal.open({
					templateUrl: 'views/tmpl_modal.html',
					controller: ModalInstanceCtrl,
					size: 'lg',
					resolve: {
						career: function () {							
							return element.attr('data-career');
						}
					}
				})
			};			
			element.bind('click', openDialog);
		}
	}
});


app.directive('swipeView', function( $rootScope ){
	return {
		restrict: "E",		
		replace: true,
		templateUrl: 'views/tmpl_swipe_view.html',
		link: function(scope, element, attrs){
			var sw = document.body.clientWidth || window.screen.width;
			scope.num = 3;
			scope.curIndex = 0;
			scope.scrollerWidth = scope.num * sw;
			scope.slideWidth = sw;
			scope.indicatorWidth = scope.num * 20 -10;
			scope.dots = [0,1,2]
			setTimeout(function(){
				var myScroll = new IScroll(document.querySelector('.steps-view'), {
					scrollX: true,
					scrollY: false,
					momentum: false,
					snap: true,
					snapSpeed: 400,
					keyBindings: true,				
					indicators: {
						el: document.querySelector('.indicator'),
						resize: false
					}
				});				
				myScroll.on("scrollEnd", function(e){
					scope.curIndex = parseInt(Math.abs(myScroll.x / myScroll.wrapperWidth));
					scope.$apply();
				});
			},100);
		}
	}
});

app.directive('bindHtmlUnsafe', function( $compile ) {
    return function( $scope, $element, $attrs ) {
        var compile = function( newHTML ) {
            newHTML = $compile(newHTML)($scope);
            $element.html('').append(newHTML); 
        };
        var htmlName = $attrs.bindHtmlUnsafe; 
        $scope.$watch(htmlName, function( newHTML ) { 
            if(!newHTML) return;
            compile(newHTML); 
        });
    };
});

app.directive("radarChart", function(){
	return {
		restrict: "EA",
		replace: true,
		template: "<canvas height='650' width='650'></canvas>",

		link: function(scope, element){
			var itemName = element.attr("data-src");
			var radar;
			
			scope.$parent.hasCanvas = isCanvasSupported();
			scope.$parent.$$phase || scope.$parent.$apply();
			scope.$watch('$parent.' + itemName, function(newVal){				
				if(newVal){
					var data = scope.$parent[itemName];
					if(isCanvasSupported()){
						radar = new Chart(element[0].getContext("2d")).Radar(data,{scaleShowLabels : false, pointLabelFontSize : 12, scaleFontSize: 12});
					}
				}
			});
			scope.$on('$destroy', function (){
				// destroy radar chart
				radar = null;
			});
	
		}
	}
});
