var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngCookies', 'localization', 'ui.bootstrap']).config(
	["$routeProvider", function($routeProvider){
		$routeProvider.
			when('/', {templateUrl: 'views/main.html', controller: 'LoginController'}).
			when('/login', {templateUrl: 'views/login.html', controller: 'LoginController'}).
			when('/register', {templateUrl: 'views/register.html', controller: 'RegisterController'}).
			when('/password', {templateUrl: 'views/reset_password.html', controller: 'ResetPasswordController'}).
			when('/createDevice', {templateUrl: 'views/create_device.html', controller: 'CreateDeviceController'}).
			when('/createRuleProfile', {templateUrl: 'views/create_rule_profile.html', controller: 'CreateRuleProfileController'}).
			when('/createRuleProfileRestrictions', {templateUrl: 'views/create_rule_profile_restrictions.html', controller: 'CreateRuleProfileRestrictionsController'}).	
			when('/enrollChildDevcice', {templateUrl: 'views/enroll_child_device.html', controller: 'EnrollChildDevciceController'}).
			when('/enrollSuccess', {templateUrl: 'views/enroll_child_device_success.html', controller: 'EnrollSuccessController'}).
			when('/dashboard', {templateUrl: 'views/dashboard.html', controller: 'DashboardController'}).
			when('/dashboardNoDevice', {templateUrl: 'views/dashboard_no_device.html', controller: 'DashboardNoDeviceController'}).
			when('/device/:id', {templateUrl: 'views/device_detail.html', controller: 'DeviceController'}).
			when('/timerule', {templateUrl: 'views/time_rule.html', controller: 'TimeRuleController'}).
			when('/timeruleEmpty', {templateUrl: 'views/time_rule_empty.html', controller: 'TimeRuleEmptyController'}).
			when('/createTimerule', {templateUrl: 'views/time_rule_create.html', controller: 'CreateTimeRuleController'}).
			when('/timeout', {templateUrl: 'views/timeout.html', controller: 'TimeoutController'}).
			when('/timeout/:deviceId', {templateUrl: 'views/timeout_settings.html', controller: 'TimeoutSettingsController'}).
			when('/account', {templateUrl: 'views/account.html', controller: 'AccountController'}).		
			when('/report', {templateUrl: 'views/report.html', controller: 'ReportController'}).		
			when('/share', {templateUrl: 'views/share.html', controller: 'ShareController'}).			
			when('/support', {templateUrl: 'views/support.html', controller: 'SupportController'}).					

			
			otherwise({redirectTo: '/'});
	}]
).config(function($sceProvider){
	$sceProvider.enabled(false);
});

var useDummy = true;
function iOS7() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		var vers = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
		if(vers[0] >=7)
			return true;
		return false;
	}
	return false;
}

