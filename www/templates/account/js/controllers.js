appControllers.controller('accountCtrl', function ($scope, $timeout, $state, $stateParams, $ionicHistory, localStorage) {

    $scope.navigateTo = function (stateName) {
        $timeout(function () {
            if ($ionicHistory.currentStateName() != stateName) {
                $ionicHistory.nextViewOptions({
                    disableAnimate: false,
                    disableBack: true
                });
                $state.go(stateName);
            }
        }, ($scope.isAnimated  ? 300 : 0));
    };

    $scope.connectCoins = function() {
        var ref = window.open(
            'https://coins.ph/user/api/authorize' +
            '?client_id=l3J6rHubPGLMgiJf4tNe925BR9Am8VfePYWbP5UL' +  
            '&token_type=Bearer' +
            '&response_type=token' + 
            '&grant_type=refresh_token',
            '_blank'
        );

        ref.addEventListener('loadstart', function(event) {
            if (typeof String.prototype.startsWith != 'function') {
                String.prototype.startsWith = function (str){
                    return this.indexOf(str) === 0;
                };
            }

            console.log('listen event oauth callback');

            if((event.url).startsWith("http://lifegoals.cloudapp.net:8000/")) {
                console.log('oauth callback url');

                var query = event.url.substr(event.url.indexOf('#') + 1);

                var data = {};

                var parts = query.split('&');

                // read names and values
                for (var i = 0; i < parts.length; i++) {
                    var name = parts[i].substr(0, parts[i].indexOf('='));
                    var val = parts[i].substr(parts[i].indexOf('=') + 1);
                    val = decodeURIComponent(val);
                    data[name] = val;
                }

                console.log('saving auth data ' + JSON.stringify(data));

                data = JSON.stringify(data);
                window.localStorage.auth = data;
                ref.close();
            }
        });
    };

});
