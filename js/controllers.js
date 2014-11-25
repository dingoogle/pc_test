app.controller("HeaderController", ['$location', '$scope', '$rootScope', function($location, $scope, $rootScope){
	
	
	$rootScope.titleLocaleKey = "_AppTitle_";

	$rootScope.iOS7 = iOS7();
    $scope.logo = "lib/image/logo.png";
	
	$scope.back = function(url){	
		history.back();	
	}
	
}]);

app.controller("FooterController", ['$scope', function($scope){
	$scope.links = [
		{"label": "Related Websites", "icon": "lib/image/ico_footer_related.png", "description": "My Learning PEGA", "url": "#"},
		{"label": "Contact us", "icon": "lib/image/ico_footer_contact.png", "description": "Tel: 86 571 2548 2369",  "description2": "E-mail: l&c@capgemini.com"},
		{"label": "About us", "icon": "lib/image/ico_footer_about.png", "description": "Know more about",  "description2": "Learning & Culture team"},
		{"label": "Need Help", "icon": "lib/image/ico_footer_help.png", "description": "If you need help",  "description2": "Please contact..."}
	];
}]);

app.controller("HomeController", ['$scope', "$rootScope", function($scope, $rootScope){
	$scope.pageClass = "page-login";
}]);

app.controller("LoginController", ['$location', '$scope', "$rootScope", "authenticationService", function($location, $scope, $rootScope, authenticationService){
	$rootScope.titleLocaleKey = "_Login_";
	$scope.interval = 2000;
	$scope.pageClass = "page-login";
	$scope.currentStep = 1;
	$scope.finishedStep = 0;
	$rootScope.isLoggedIn = false;
}]);

app.controller("RegisterController", ['$scope', "$rootScope", function($scope, $rootScope){
	$rootScope.titleLocaleKey = "_Register_";
	$scope.pageClass = "page-register";
}]);


app.controller("ResetPasswordController", ['$scope', "$rootScope", function($scope, $rootScope){
	$rootScope.titleLocaleKey = "_ResetPassword_";
	$scope.pageClass = "page-reset-password";
}]);

app.controller("CreateDeviceController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$rootScope.titleLocaleKey = "_CreateChildDevice_";
	$scope.pageClass = "page-create-device";
	$scope.currentStep = 2;
	$scope.finishedStep = 1;
	$scope.createProfile = function(){
		// to enroll device
		$location.path("/createRuleProfile");
	};
	$scope.createMyProfile = function(){
		// to my device
		$location.path("/createRuleProfileRestrictions");
	}
}]);

app.controller("CreateRuleProfileController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){

	$scope.pageClass = "page-create-rule-profile";
	$scope.currentStep = 3;
	$scope.finishedStep = 2;
	$scope.nextStep = function(){
		$location.path("/createRuleProfileRestrictions");
	};
}]);
app.controller("CreateRuleProfileRestrictionsController", 
['$location', '$filter', '$scope', "$rootScope", "profileService", 
function($location, $filter, $scope, $rootScope, profileService){

	$scope.pageClass = "page-create-rule-profile-restrictions";
	$scope.currentStep = 3;
	$scope.finishedStep = 2;
	$scope.selectedOption = {};
	$scope.ratings = {};
	$scope.selectedIndex = 0;
	$scope.isRestrictionCollapsed = false;
	$scope.isRatingCollapsed = true;
	$scope.isAdvanceCollapsed = true;
	var options = [];

	var initRatings = function(ratings, ratingList){
		for(var itm in ratings){			
			ratings[itm].options = ratingList[ratings[itm]["label"]].options;
			ratings[itm].selected = ratings[itm]["value"];
		}
	};
	profileService.getRatingOptions().then(function(ratings){
		//$scope.ratings = ratings;
		for(var itm in ratings){
			$scope.ratings[itm] = {
				"label": itm,
				"options": ratings[itm]
			}
		}
		profileService.getProfile().then(function(profile){
			$scope.options = profile.profiles;
			for(var i=0;i<profile.profiles.length;i++){
				initRatings($scope.options[i].ratings, $scope.ratings);	
			}			
			angular.copy($scope.options[0],$scope.selectedOption);
			return;
		});		
		return;
	});
	$scope.updateOption = function(index){
		$scope.selectedIndex = index;
		angular.copy($scope.options[index],$scope.selectedOption);
	};
	$scope.updateRatingOption = function(rating, index){
		rating.selected = rating.options[index];
	};

	$scope.updateProfile = function(){
		console.log($scope.selectedOption)
	};
	$scope.resetProfile = function(){
		angular.copy($scope.options[$scope.selectedIndex],$scope.selectedOption);	
		console.log($scope.selectedOption)
	};
	$scope.restrictionCollapsed = function(){
		$scope.isRestrictionCollapsed = !$scope.isRestrictionCollapsed;
	};
	$scope.ratingCollapsed = function(){
		$scope.isRatingCollapsed = !$scope.isRatingCollapsed;
	};
	$scope.advancedCollapsed = function(){
		$scope.isAdvanceCollapsed = !$scope.isAdvanceCollapsed;
	}
	$scope.nextStep = function(){
		$location.path("/enrollChildDevcice");
	};
}]);

app.controller("EnrollChildDevciceController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "enroll-child-device";
	$scope.currentStep = 3;
	$scope.finishedStep = 2;
	$scope.nextStep = function(){
		$location.path("/enrollSuccess");
	};
}]);

app.controller("EnrollSuccessController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "enroll-child-device-success";
	$scope.currentStep = 4;
	$scope.finishedStep = 3;
	$scope.showDashboard = function(){
		$location.path("/dashboard");
	};
}]);

app.controller("DashboardController", ['$location', '$scope', "$rootScope", "deviceService", function($location, $scope, $rootScope, deviceService){
	$rootScope.titleLocaleKey = "_Dashboard_";
	$scope.pageClass = "dashboard";
	$scope.devices = [];
	deviceService.getDevices().then(function(data){
		//data= {};
		if(!data || !data.devices || !data.devices.length){
			$location.path("/dashboardNoDevice");
			return;
		}
		$scope.devices = data.devices;		
		return;
	});
	$scope.createNewDevice = function(){
		
		$location.path("/createDevice");
		return;
	};
	$scope.showDeviceDetail = function(device){
		console.log(device);
		$location.path("/device/" + device.deviceId);
	};
	$scope.seeMyProfile = function(){
		$location.path("/profile");
		return;
	};
	$scope.createProfile = function(){
		$location.path("/createRuleProfile");
		return;
	};
	$scope.seeMyTimeRule = function(){
		$location.path("/timerule");
		return;
	};
	$scope.createTimeRule = function(){
		$location.path("/createTimerule");
		return;
	};
	$scope.seeTimeout = function(){
		$location.path("/timeout");
		return;
	};
	$scope.createTimeout = function(){
		$location.path("/createTimeout");
		return;
	};
}]);

app.controller("DashboardNoDeviceController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "dashboard-no-device";
	$scope.currentStep = 2;
	$scope.finishedStep = 1;
	$scope.showDashboard = function(){
		$location.path("/dashboard");
	};
}]);
app.controller("DeviceController", 
['$location', '$scope', "$rootScope", "$routeParams", "deviceService", "profileService", 
function($location, $scope, $rootScope, $routeParams, deviceService, profileService){
	$scope.pageClass = "dashboard-no-device";
	deviceService.getDeviceInfo($routeParams.id).then(function(deviceInfo){
		$scope.device = deviceInfo;
		$scope.profileName = deviceInfo.profileName;
		profileService.getProfile().then(function(profile){
			$scope.options = profile.profiles;
			console.log($scope.options )
			
			return;
		});		
		return;
	});
	$scope.editDevice = function(){
	
	};
	$scope.deleteDevice = function(){
	
	};
	$scope.updateOption = function(index){
		$scope.profileName = $scope.options[index].profileName;
	};
	
}]);

app.controller("TimeRuleController", ['$location', '$scope', "$rootScope", "deviceService", function($location, $scope, $rootScope, deviceService){
	$scope.pageClass = "time-rule";
	deviceService.getTimeRules().then(function(data){
		console.log("data " , data);
		if(!data.timeRules.length){
			$location.path("/timeruleEmpty");
			return;
		}
		$scope.timeRules = data.timeRules;
		return;
	});
	$scope.createTimeRule = function(){
		$location.path("/createTimerule");
		return;
	}
}]);

app.controller("TimeRuleEmptyController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "time-rule-empty";
	$scope.createTimeRule = function(){
		$location.path("/createTimerule");
		return;
	}
}]);

app.controller("CreateTimeRuleController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "time-rule-create";
}]);

app.controller("ReportController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "report";
}]);


app.controller("ShareController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "share";
}]);

app.controller("SupportController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "support";
}]);




app.controller("TimeoutController", ['$location', '$scope', "$routeParams", "$rootScope", "deviceService",
function($location, $scope, $routeParams, $rootScope, deviceService){
	$scope.pageClass = "timeout";
	deviceService.getDevices().then(function(data){
		if(!data || !data.devices || !data.devices.length){
			$location.path("/dashboardNoDevice");
			return;
		}
		$scope.devices = data.devices;		
		return;
	});
	
	$scope.showDeviceDetail = function(device){
		$location.path("/timeout/" + device.deviceId);
	};
}]);


app.controller("TimeoutSettingsController", ['$location', '$scope', "$routeParams", "$rootScope", "deviceService", "profileService", 
function($location, $scope, $routeParams, $rootScope, deviceService, profileService){
	$scope.pageClass = "timeout-settings";
	deviceService.getDeviceInfo($routeParams.deviceId).then(function(deviceInfo){
		$scope.device = deviceInfo;
		$scope.profileName = deviceInfo.profileName;
		profileService.getProfile().then(function(profile){
			$scope.options = profile.profiles;
			
			return;
		});		
		return;
	});
	
}]);

app.controller("AccountController", ['$location', '$scope', "$rootScope", function($location, $scope, $rootScope){
	$scope.pageClass = "account";
}]);

