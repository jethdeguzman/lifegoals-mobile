appControllers.controller('loginCtrl', function ($scope, $state, $cordovaOauth, $http, localStorage) {
    $scope.initialForm = function () {
        $scope.isLogin = false;

        $scope.isLoading = false;

        $scope.userInfo = {
            name: "",
            first_name: "",
            last_name: "",
            email: "",
            birthday: "",
            link: "",
            cover: "",
            pictureProfileUrl: "",
            gender: "",
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
            $state.go('app.account');
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
                            birthday: result.data.birthday,
                            link: result.data.link,
                            cover: result.data.cover,
                            pictureProfileUrl: "http://graph.facebook.com/" + result.data.id + "/picture?width=62&height=62",
                            gender: result.data.gender,
                            id: result.data.id,
                            access_token: $scope.accessToken
                        };
            
                        localStorage.set("Facebook", $scope.userInfo);
                      
                        $state.go("app.account");
                    }, function (error) {
                         $state.go('login');
                    });
                }
                , function (error) {
                     $state.go('login');
                });
            $scope.isLoading = false;
        }
    };

    $scope.initialForm();

});
