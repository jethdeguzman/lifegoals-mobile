appControllers.controller('accountCtrl', function ($scope, $timeout, $state, $stateParams, $ionicHistory, localStorage, $mdToast, $http) {
    $scope.portfolio = {
        'total' : 0.00,
        'coins' : {
            'accountId' : null,
            'currentBalance' : 0.00,
            'type' : 'COINS'
        },
        'ubank' : {
            'accountId' : null,
            'currentBalance' : 0.00,
            'type' : 'UBANK'
        },
        'transactions' : []
    };
    localStorage.set("portfolio", $scope.portfolio);
    userInfo = localStorage.get("Facebook");
    $http.get('http://lifegoals.cloudapp.net/api/v1/portfolio/' + userInfo.userId).success(
        function(result){
            $scope.portfolio.total = result.data.total;
            for(i in result.data.accounts){
                if(result.data.accounts[i].type == 'COINS'){
                    $scope.portfolio.coins.accountId = result.data.accounts[i].id;
                    $scope.portfolio.coins.currentBalance = result.data.accounts[i].current_balance;
                }
                if(result.data.accounts[i].type == 'UBANK'){
                    $scope.portfolio.ubank.accountId = result.data.accounts[i].id;
                    $scope.portfolio.ubank.currentBalance = result.data.accounts[i].current_balance;
                }
            }
        }).error(function(err){
            $scope.showToast('An Error Occured');
        });
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

                accessToken = data.access_token;
                
                params = {
                    'user_id' : userInfo.userId,
                    'type' : 'COINS',
                    'access_token' : accessToken
                }

                $http.post('http://lifegoals.cloudapp.net/api/v1/accounts', params).success(
                    function(result){
                        $scope.portfolio.coins.currentBalance = result.data.curremt_balance;
                        $scope.portfolio.coins.accountId  = result.data.id;
                        localStorage.set("portfolio", $scope.portfolio);
                        $scope.showToast('Successfully Connected');
                        location.reload();
                    }).error(function(err){
                        $scope.showToast('An Error Occured');
                    });
                window.localStorage.auth = data;
                ref.close();
            }
        });
    };

    $scope.showToast = function (title) {
        $mdToast.show({
            controller: 'toastController',
            templateUrl: 'toast.html',
            hideDelay: 800,
            position: 'bottom',
            locals: {
                displayOption: {
                    title: title
                }
            }
        });
    }

});
