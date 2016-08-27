appControllers.controller('loginCtrl', function ($scope, $state, $cordovaOauth, $http, localStorage,  $mdToast) {
    $scope.initialForm = function () {
        $scope.isLogin = false;

        $scope.isLoading = false;

        $scope.userInfo = {
            name: "",
            first_name: "",
            last_name: "",
            email: "",
            link: "",
            pictureProfileUrl: "",
            id: "",
            access_token: ""
        };

        $scope.userInfo = $scope.getUserProfile();
    };

    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };

    $scope.getUserProfile = function () {
        $scope.userInfo = localStorage.get("Facebook");
        if ($scope.userInfo != null) {
            $scope.isLogin = true;
            $state.go('app.goal');
        }

        return $scope.userInfo;
    };

    $scope.login = function () {
        if ($scope.isLoading == false) {
            $scope.isLoading = true;


            $cordovaOauth.facebook(window.globalVariable.oAuth.facebook, ["publish_actions", "user_status", "user_birthday", "user_posts", "user_events"
                , "email", "user_actions.news", "user_friends", "public_profile"]).then(function (result) {

                    $scope.accessToken = result.access_token;

                    $http.get("https://graph.facebook.com/v2.4/me", {
                        params: {
                            access_token: result.access_token,
                            fields: "birthday,first_name,email,last_name,name,link,cover,gender,id",
                            format: "json"
                        }
                    }).then(function (result) {

                        $scope.userInfo = {
                            name: result.data.name,
                            first_name: result.data.first_name,
                            last_name: result.data.last_name,
                            email: result.data.email,
                            link: result.data.link,
                            pictureProfileUrl: "http://graph.facebook.com/" + result.data.id + "/picture?width=62&height=62",
                            id: result.data.id,
                            access_token: $scope.accessToken
                        };

                        data = {
                            'facebook_id' : result.data.id,
                            'name' : result.data.name,
                            'firstname' : result.data.first_name,
                            'lastname' : result.data.last_name,
                            'email' : result.data.email,
                            'link' result.data.link: 
                        }
                        
                        $http.post('http://lifegoals.cloudapp.net/api/v1/users', data)
                             .success(function(result){
                                $scope.userInfo.userId = result.user_id;
                             })
                             .error(function(){
                                $state.go('login');
                                $scope.showToast('A problem occured. Please try again.');  
                             });
                        localStorage.set("Facebook", $scope.userInfo);
                        $state.go("app.goal");
                         $scope.showToast('Login successfully');

                    }, function (error) {
                         $state.go('login');
                         $scope.showToast('A problem occured. Please try again.');
                    });
                }
                , function (error) {
                     $state.go('login');
                     $scope.showToast('A problem occured. Please try again.');
                });
            $scope.isLoading = false;
        }
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

    $scope.initialForm();

});
