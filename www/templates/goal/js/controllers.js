appControllers.controller('goalCtrl', function ($scope, $state, localStorage) {
    var userInfo = localStorage.get("Facebook");
    if (userInfo == null){
        $state.go('login');
    }

    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };

});

appControllers.controller('createGoalCtrl', function ($scope, $state, $cordovaImagePicker) {
    $scope.navigateTo = function (targetPage) {
        $state.go(targetPage);
    };

    $scope.selectImage = function (limit) {
        var options = {
            maximumImagesCount: limit,
            width: 1600,
            height: 900,
            quality: 100
        };

        $cordovaImagePicker.getPictures(options)
            .then(function (results) {
                $scope.imageList = [];
                for (var i = 0; i < results.length; i++) {
                    $scope.imageList.push(results[i]);
                }
            }, function (error) {
                console.log(error);
            });
    };

    $scope.visibilities = [
        { name : "Private", value : "private" },
        { name : "Public", value : "public" }
    ];

    $scope.saveGoal = function(){
        //http
    }
});

appControllers.controller('viewGoalCtrl', function ($scope, $state, $stateParams) {

});

