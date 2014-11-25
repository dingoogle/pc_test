app.factory("authenticationService", ["$http", function($http){
	var promise;
	var service = {
		login: function(em,ps){
			if(useDummy){
				promise = $http.get("dummy/login.json?t=" + (new Date().getTime())).then(function(response){					
					return response.data;
				});
			}
			else{
				var userInfo = {email: em, password: ps};
				promise = $http.post("../ws/login/validate",userInfo)
				.then(function(response){
					return response.data;
				});				
			}
			return promise;
		},
		register: function(fn,ln,em,ps){
			if(useDummy){
				promise = $http.get("dummy/register.json").then(function(response){
					//dummy data, the structure is different with real data.
					return response.data.result;
				});
				return promise;
			}
			else{				
				promise = $http({				
					method: 'POST',
					url: "../ws/employeerole/updateEmployeeRole/",
					data: empRole,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).then(function(response){
					return response.data;
				});				
				return promise;
			}
		},
		getProfile: function(uid){
			if(useDummy){
				promise = $http.get("dummy/profile.json").then(function(response){
					//dummy data, the structure is different with real data.
					console.log(response);
					return response.data.result;
				});
				return promise;
			}
			else{				
				promise = $http({				
					method: 'Get',
					url: "../ws/employeerole/updateEmployeeRole/",
					data: empRole,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).then(function(response){
					return response.data;
				});				
				return promise;
			}
		}
	}
	return service;
}]);


app.factory("profileService", ["$http", function($http){
	var promise;
	var service = {		
		getProfile: function(uid){
			if(useDummy){
				promise = $http.get("dummy/profiles.json").then(function(response){
					//dummy data, the structure is different with real data.
					return response.data.result;
				});
				return promise;
			}
			else{				
				promise = $http({				
					method: 'Get',
					url: "../ws/employeerole/updateEmployeeRole/",
					data: empRole,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).then(function(response){
					return response.data;
				});				
				return promise;
			}
		},
		getRatingOptions: function(){
			if(useDummy){
				promise = $http.get("dummy/rating_options.json").then(function(response){
					//dummy data, the structure is different with real data.
					return response.data.result;
				});
				return promise;
			}
			else{				
				promise = $http({				
					method: 'Get',
					url: "../ws/employeerole/updateEmployeeRole/",
					data: empRole,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).then(function(response){
					return response.data;
				});				
				return promise;
			}
		},
	}
	return service;
}]);


app.factory("deviceService", ["$http", function($http){
	var promise;
	var service = {
		getDevices: function(){
			if(useDummy){
				promise = $http.get("dummy/devices.json").then(function(response){
					//dummy data, the structure is different with real data.
					return response.data.result;
				});
				return promise;
			}
			else{				
				promise = $http({				
					method: 'Get',
					url: "../ws/employeerole/updateEmployeeRole/",
					data: empRole,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).then(function(response){
					return response.data;
				});				
				return promise;
			}
		},
		getDeviceInfo: function(deviceId){
			if(useDummy){
				promise = $http.get("dummy/devices.json").then(function(response){
					console.log("deviceId " + deviceId)
					console.log("response " , response.data.result.devices[deviceId])
					//dummy data, the structure is different with real data.
					return response.data.result.devices[deviceId] || null;
				});
				return promise;
			}
			else{				
				promise = $http({				
					method: 'Get',
					url: "../ws/employeerole/updateEmployeeRole/",
					data: empRole,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).then(function(response){
					return response.data;
				});				
				return promise;
			}
		},
		getTimeRules: function(){
			if(useDummy){
				promise = $http.get("dummy/timerule.json").then(function(response){
					
					//dummy data, the structure is different with real data.
					return response.data.result;
				});
				return promise;
			}
			else{				
				promise = $http({				
					method: 'Get',
					url: "../ws/employeerole/updateEmployeeRole/",
					data: empRole,
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				}).then(function(response){
					return response.data;
				});				
				return promise;
			}
		}
	}
	return service;
}]);



// filter capital letters
app.filter('capitalLetter', function(){
	return function(str){
		var tmpStr = str.toLowerCase();
		var len = tmpStr.length;
		if(tmpStr && len){
			var tmpChar = tmpStr.substring(0,1).toUpperCase();
			var otherChars = tmpStr.substring(1, len);
			tmpStr = tmpChar + otherChars;
		}
		return tmpStr;
	}
});


// localization module
angular.module('localization', []).factory('localize', ['$http', '$rootScope', '$window', '$filter', function ($http, $rootScope, $window, $filter) {
	var substitute = function(str, sub) {
		return str.replace(/\{(.+?)\}/g, function($0, $1) {
			return $1 in sub ? sub[$1] : $0;
		});
	};

    var localize = {
        language:$window.navigator.userLanguage || $window.navigator.language,
        dictionary:{},
        resourceFileLoaded:false,

        successCallback:function (data) {
            localize.dictionary = data;
            localize.resourceFileLoaded = true;
            $rootScope.$broadcast('localizeResourcesUpdates');
        },

        initLocalizedResources:function () {
            var url = 'i18n/resources-locale_' + localize.language + '.js';
            $http({ method:"GET", url:url, cache:false }).success(localize.successCallback).error(function () {
				// default language en-US
                var url = 'i18n/resources-locale_en-US.js';
                $http({ method:"GET", url:url, cache:false }).success(localize.successCallback);
				
            });
        },

        getLocalizedString:function (value, options) {
            var result = '';
            if (!localize.resourceFileLoaded) {
                localize.initLocalizedResources();
                localize.resourceFileLoaded = true;
                return result;
            }
            if (localize.dictionary) {
				var entry = localize.dictionary[value];
                if ((entry !== null) && (entry != undefined)) {
                    result = entry;
					if(options){
						result = substitute(entry, options);
					}
                }
				
            }
            return result;
        }
    };
    return localize;
} ]).
    filter('i18n', ['localize', function (localize) {
    return function (input, options) {
        return localize.getLocalizedString(input, options);
    };
}]);